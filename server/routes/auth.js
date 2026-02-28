const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { mobile, password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });

  try {
    let user = await db.findOne('users', { mobile });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await db.create('users', { mobile, role: 'user', password: hashedPassword });
    
    res.json({ message: 'Registration successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });

  try {
    const user = await db.findOne('users', { mobile });
    if (!user) return res.status(404).json({ message: 'User not found. Please register.' });

    if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid mobile or password' });
    } else {
        // Fallback for existing users created before passwords existed
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update('users', user._id, { password: hashedPassword });
        user.password = hashedPassword;
    }

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

// Delete Account
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find profile associated with this user
    const profile = await db.findOne('profiles', { userId });
    
    // If profile exists, delete it first
    if (profile) {
        await db.delete('profiles', profile._id);
    }
    
    // Then delete the user
    await db.delete('users', userId);
    
    res.json({ message: 'Account and associated profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
