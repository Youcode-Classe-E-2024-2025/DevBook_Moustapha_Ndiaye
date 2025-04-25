const express = require('express');
const { Category,  } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// --- CRUD ---

// GET /api/categories 
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/categories/:id 
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/categories 
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Category name already exists.' });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/categories/:id 
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    category.name = name;
    await category.save();
    res.status(200).json(category);

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Category name already exists.' });
    }
    console.error("Error updating category:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/categories/:id 
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await category.destroy();
    res.sendStatus(204); 

  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});


module.exports = router;