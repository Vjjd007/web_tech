const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const aiRoutes = require('./routes/ai');
const pdfRoutes = require('./routes/pdf');
const imageRoutes = require('./routes/image');
const historyRoutes = require('./routes/history');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// Trust proxy for hosting environments
app.set('trust proxy', 1);

// Middleware
// Allow configuring allowed origins via `ALLOWED_ORIGINS` env var (comma-separated).
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://studenthub-live.vercel.app',
  'https://studenthub-live.netlify.app'
];
const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean) : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('vercel.app')) || (origin && origin.includes('github.io'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;

