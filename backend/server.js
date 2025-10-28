const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Load environment variables
dotenv.config();

// Import configuration and utilities
const config = require('./config/config');
const { logger, requestLogger } = require('./utils/logger');
const { errorHandler, notFoundHandler, gracefulShutdown } = require('./utils/errorHandler');
const { generalRateLimit, apiRateLimit, sanitizeInput } = require('./middleware/security');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', apiRateLimit);
app.use(generalRateLimit);

// CORS configuration
app.use(cors({
  origin: config.cors.origins,
  credentials: config.cors.credentials,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Input sanitization
app.use(sanitizeInput);

// Serve static files from frontend directory
app.use(express.static(config.paths.frontend, {
  maxAge: config.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true
}));

// Legacy API routes (for backward compatibility)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/kebab-builder', require('./routes/kebabBuilder'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthData = {
    status: 'OK',
    message: 'Aslan Food API is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: require('../package.json').version,
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  logger.info('Health check requested', { 
    ip: req.ip, 
    userAgent: req.get('User-Agent') 
  });
  
  res.json(healthData);
});

// Serve frontend for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(config.paths.frontend, 'index.html'));
});

// Versioned API routes
app.use(`${config.api.prefix}/${config.api.version}`, require('./routes'));

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

// Database connection with production configurations
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(config.database.uri, config.database.options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`, {
      database: conn.connection.name,
      readyState: conn.connection.readyState
    });
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('Database connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Database disconnected');
    });
    
  } catch (error) {
    logger.error('Database connection failed:', {
      message: error.message,
      uri: config.database.uri.replace(/\/\/.*@/, '//[CREDENTIALS]@') // Hide credentials in logs
    });
    
    if (config.NODE_ENV === 'production') {
      logger.error('Exiting due to database connection failure in production');
      process.exit(1);
    } else {
      logger.warn('Server will continue without database connection in development');
    }
  }
};

// Start server with proper error handling
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start HTTP server
    const server = app.listen(config.PORT, config.HOST, () => {
      logger.info(`🚀 Server running in ${config.NODE_ENV} mode`, {
        port: config.PORT,
        host: config.HOST,
        healthCheck: `http://${config.HOST}:${config.PORT}/api/health`,
        apiPrefix: `${config.api.prefix}/${config.api.version}`
      });
    });
    
    // Set server timeouts
    server.keepAliveTimeout = config.performance.keepAliveTimeout;
    server.headersTimeout = config.performance.keepAliveTimeout + 1000;
    
    // Setup graceful shutdown
    gracefulShutdown(server);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

module.exports = app;