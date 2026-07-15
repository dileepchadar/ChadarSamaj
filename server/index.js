const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Connect to JSON DB (No init needed, handled in db.js)
console.log('Using Local JSON File Database (No MongoDB required)');

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Simple Matrimony API is running (JSON DB Mode).');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('--- SERVER RESTARTED (VERSION 2) ---');
});
