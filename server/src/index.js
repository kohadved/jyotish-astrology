/**
 * Jyotish - Astrology Web Application
 * 
 * Architecture: MVC with Service Layer
 * Design Patterns Used:
 * - Singleton Pattern: Database connection, API services
 * - Factory Pattern: Model creation with Mongoose
 * - Middleware Pattern: JWT authentication, error handling
 * - Repository Pattern: Data access abstraction via Mongoose
 * - Strategy Pattern: Fallback mechanism for external APIs
 * 
 * @author Vedant Kohad
 * @version 1.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const astrologyRoutes = require('./routes/astrologyRoutes');
const guidanceRoutes = require('./routes/guidanceRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware (for development)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Jyotish API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Jyotish Astrology API',
    version: '1.0.0',
    description: 'Backend API for astrology web application',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user with birth details',
        'POST /api/auth/login': 'Login and get JWT token',
        'GET /api/auth/me': 'Get current user profile (protected)',
        'PUT /api/auth/me': 'Update user profile (protected)'
      },
      astrology: {
        'GET /api/astrology/zodiac': 'Get zodiac sign information',
        'GET /api/astrology/kundli': 'Get birth chart (Kundli)',
        'GET /api/astrology/daily-horoscope': 'Get daily horoscope',
        'GET /api/astrology/panchang': 'Get Panchang data'
      },
      guidance: {
        'GET /api/guidance/daily': 'Get AI-generated daily guidance',
        'POST /api/guidance/chat': 'Chat with AI assistant',
        'GET /api/guidance/chat/history': 'Get chat history',
        'DELETE /api/guidance/chat/history': 'Clear chat history'
      }
    },
    architecture: {
      pattern: 'MVC with Service Layer',
      database: 'MongoDB Atlas',
      authentication: 'JWT (JSON Web Tokens)',
      externalAPIs: ['Google Gemini AI', 'Prokerala Astrology']
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/astrology', astrologyRoutes);
app.use('/api/guidance', guidanceRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: '/api'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Jyotish server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});
