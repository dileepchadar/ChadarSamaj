const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all profiles (including unapproved)
router.get('/profiles', async (req, res) => {
  try {
    const profiles = db.getAll('profiles');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve Profile
router.put('/approve/:id', async (req, res) => {
  try {
    db.update('profiles', req.params.id, { isApproved: true });
    res.json({ message: 'Profile approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unapprove Profile
router.put('/unapprove/:id', async (req, res) => {
  try {
    db.update('profiles', req.params.id, { isApproved: false });
    res.json({ message: 'Profile unapproved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject/Delete Profile
router.delete('/profile/:id', async (req, res) => {
  try {
    db.delete('profiles', req.params.id);
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Reported Profiles
router.get('/reports', async (req, res) => {
  try {
    const reports = db.getAll('reports');
    // Manually populate profile name for display
    const populated = reports.map(r => {
        const p = db.findOne('profiles', { _id: r.profileId });
        return { ...r, profileId: p || { name: 'Unknown/Deleted' } };
    });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Report (Dismiss)
router.delete('/report/:id', async (req, res) => {
  try {
    db.delete('reports', req.params.id);
    res.json({ message: 'Report dismissed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
