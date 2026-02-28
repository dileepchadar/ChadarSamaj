const express = require('express');
const router = express.Router();
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { mobile } = req.body;
  try {
    let user = await db.findOne('users', { mobile });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await db.create('users', { mobile, role: 'user' });
    
    res.json({ message: 'Registration successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { mobile } = req.body;
  try {
    const user = await db.findOne('users', { mobile });
    if (!user) return res.status(404).json({ message: 'User not found. Please register.' });

    // Admin Check Logic (Simple)
    if (mobile === 'admin' || mobile === '9999999999') {
        if(user.role !== 'admin') {
             await db.update('users', user._id, { role: 'admin' });
             user.role = 'admin';
        }
    }

    res.json({ message: 'Login successful', userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
