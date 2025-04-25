const express = require('express');
const { Book, Category } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { Op } = require('sequelize'); 

const router = express.Router();

// --- CRUD  ---

// GET /api/books 
router.get('/', async (req, res) => {
  try {
    const whereClause = {};
    if (req.query.title) {
      whereClause.title = { [Op.like]: `%${req.query.title}%` }; 
    }
    if (req.query.author) {
      whereClause.author = { [Op.like]: `%${req.query.author}%` };
    }
    if (req.query.isbn) {
      whereClause.isbn = req.query.isbn; 
    }

    const books = await Book.findAll({
      where: whereClause, 
      include: [{ 
        model: Category,
        as: 'category', 
        attributes: ['category_id', 'name'] 
      }],
      order: [['title', 'ASC']]
    });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/books/:id 
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['category_id', 'name']
      }]
    });
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/books 
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { title, author, isbn, published_year, available, category_id } = req.body;


  if (!title || category_id === undefined) {
    return res.status(400).json({ message: 'Title and category_id are required.' });
  }

  try {
    const categoryExists = await Category.findByPk(category_id);
    if (!categoryExists) {
        return res.status(400).json({ message: `Category with ID ${category_id} not found.` });
    }

    const newBook = await Book.create({
      title,
      author,
      isbn, 
      published_year,
      available: available !== undefined ? available : true, 
      category_id
    });
    res.status(201).json(newBook);
  } catch (error) {
     if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'ISBN already exists.' });
    }
    console.error("Error creating book:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/books/:id 
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { title, author, isbn, published_year, available, category_id } = req.body;

  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (category_id !== undefined && category_id !== book.category_id) {
        const categoryExists = await Category.findByPk(category_id);
        if (!categoryExists) {
            return res.status(400).json({ message: `Category with ID ${category_id} not found.` });
        }
    }

    book.title = title !== undefined ? title : book.title;
    book.author = author !== undefined ? author : book.author;
    book.isbn = isbn !== undefined ? isbn : book.isbn;
    book.published_year = published_year !== undefined ? published_year : book.published_year;
    book.available = available !== undefined ? available : book.available;
    book.category_id = category_id !== undefined ? category_id : book.category_id;

    await book.save();
    res.status(200).json(book);

  } catch (error) {
     if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Update failed, possibly due to duplicate ISBN.' });
    }
    console.error("Error updating book:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/books/:id -
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

   
    await book.destroy();
    res.sendStatus(204); 

  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;