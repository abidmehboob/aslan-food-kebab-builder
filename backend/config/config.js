const path = require('path');

const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  HOST: process.env.HOST || 'localhost',
  
  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aslan-food',
    name: process.env.DB_NAME || 'aslan-food',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
    httpsOnly: process.env.HTTPS_ONLY === 'true',
    secureCookies: process.env.SECURE_COOKIES === 'true'
  },
  
  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    message: 'Too many requests from this IP, please try again later.'
  },
  
  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    uploadPath: process.env.UPLOAD_PATH || 'uploads/',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
    maxFiles: 5,
    maxSize: '10m'
  },
  
  // Performance
  performance: {
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 30000,
    keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10) || 5000
  },
  
  // API
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api'
  },
  
  // Paths
  paths: {
    root: path.resolve(__dirname, '..', '..'),
    frontend: path.resolve(__dirname, '..', '..', 'frontend'),
    uploads: path.resolve(__dirname, '..', process.env.UPLOAD_PATH || 'uploads'),
    logs: path.resolve(__dirname, '..', 'logs')
  }
};

// Validate required environment variables in production
if (config.NODE_ENV === 'production') {
  const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
}

module.exports = config;