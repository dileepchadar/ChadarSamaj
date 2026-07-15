const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { mobile, email, password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });

  try {
    let user = await db.findOne('users', { mobile });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await db.create('users', { mobile, email, role: 'user', password: hashedPassword });
    
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

// Google Login
router.post('/google-login', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    let user = await db.findOne('users', { email });
    if (!user) {
      // Create user if not exists
      user = await db.create('users', { mobile: email, email, role: 'user', password: '' });
    }
    res.json({ message: 'Login successful', userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const nodemailer = require('nodemailer');
// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await db.findOne('users', { email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    await db.update('users', user._id, { password: hashedPassword });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password has been Reset',
      text: `Your temporary password is: ${tempPassword}\nPlease login and change your password.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.json({ message: 'A temporary password has been sent to your email.' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change Password
router.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Passwords must be at least 6 characters long' });
  }

  try {
    const user = await db.findOne('users', { _id: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.update('users', user._id, { password: hashedNewPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
