const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create Profile
router.post('/', async (req, res) => {
  try {
    const profile = db.create('profiles', { ...req.body, isApproved: true });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload Photos
router.post('/upload', upload.array('photos', 3), (req, res) => {
  try {
    const files = req.files;
    if (!files) return res.status(400).json({ message: 'No files uploaded' });
    
    const filePaths = files.map(file => `/uploads/${file.filename}`);
    res.json({ paths: filePaths });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
router.put('/:id', async (req, res) => {
  try {
    const profile = db.update('profiles', req.params.id, req.body);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Single Profile
router.get('/:id', async (req, res) => {
  try {
    const profile = db.findOne('profiles', { _id: req.params.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search / List Profiles
router.get('/', async (req, res) => {
  try {
    const { gender, minAge, maxAge, religion, caste, district, name, disability } = req.query;
    console.log('DEBUG Route Query:', req.query);
    
    // Use custom filter function
    // Use custom filter function
    const profiles = db.filterProfiles({ gender, minAge, maxAge, religion, caste, district, name, disability });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get My profile by User ID
router.get('/user/:userId', async (req, res) => {
    try {
        const profile = db.findOne('profiles', { userId: req.params.userId });
        // Return null instead of error if not found, to handle "Create vs View" logic on frontend
        res.json(profile || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Report a Profile
router.post('/:id/report', async (req, res) => {
  try {
    const { reason, reportedBy } = req.body;
    db.create('reports', {
      profileId: req.params.id,
      reason,
      reportedBy 
    });
    res.json({ message: 'Profile reported' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
