const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const statsRoutes = require('./routes/statsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resume', resumeRoutes);

// Database is now JSON file-based.
const { initDb } = require('./utils/jsonDb');
initDb();

app.get('/', (req, res) => {
  res.send('Skill Tracker API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
