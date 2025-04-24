// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user'); 

const router = express.Router();

// --- Register ---
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body; 

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' }); 
    }

    const newUser = await User.create({
      name,
      email,
      password, 
      role: role || 'member'
    });

    const userResponse = { ...newUser.get({ plain: true }) };
    delete userResponse.password;

    res.status(201).json({ message: 'User created successfully!', user: userResponse });

  } catch (error) {
    console.error("Registration Error:", error);
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- Login ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      userId: user.user_id, 
      role: user.role        
    };

    const secretKey = process.env.JWT_SECRET || 'CLE_SECRETE_PAR_DEFAUT';
    if (secretKey === 'CLE_SECRETE_PAR_DEFAUT') {
        console.warn("You have to define a correct key");
    }

    const token = jwt.sign(
      payload,
      secretKey,
      { expiresIn: '1h' } 
    );

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;