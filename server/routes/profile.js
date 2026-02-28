const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const USE_CLOUDINARY = process.env.USE_CLOUDINARY === 'true';

let storage;
if (USE_CLOUDINARY) {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('cloudinary').v2;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'chadar_samaj_profiles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
      },
    });
} else {
    storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/'),
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    });
}
const upload = multer({ storage: storage });

// Create Profile
router.post('/', async (req, res) => {
  try {
    const profile = await db.create('profiles', { ...req.body, isApproved: true });
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
    
    // Cloudinary returns file.path, diskStorage returns file.filename.
    const filePaths = files.map(file => {
        if (USE_CLOUDINARY) return file.path; 
        return `/uploads/${file.filename}`;
    });
    
    res.json({ paths: filePaths });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
router.put('/:id', async (req, res) => {
  try {
    const profile = await db.update('profiles', req.params.id, req.body);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Single Profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await db.findOne('profiles', { _id: req.params.id });
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
    
    const profiles = await db.filterProfiles({ gender, minAge, maxAge, religion, caste, district, name, disability });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get My profile by User ID
router.get('/user/:userId', async (req, res) => {
    try {
        const profile = await db.findOne('profiles', { userId: req.params.userId });
        res.json(profile || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Report a Profile
router.post('/:id/report', async (req, res) => {
  try {
    const { reason, reportedBy } = req.body;
    await db.create('reports', {
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
