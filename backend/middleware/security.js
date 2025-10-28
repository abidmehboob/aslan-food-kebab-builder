const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errorHandler');
const config = require('../config/config');

// Rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        message: message || config.rateLimit.message,
        type: 'RATE_LIMIT_EXCEEDED'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: {
          message: message || config.rateLimit.message,
          type: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.round(windowMs / 1000)
        }
      });
    }
  });
};

// Different rate limits for different endpoints
const generalRateLimit = createRateLimit(
  config.rateLimit.windowMs,
  config.rateLimit.max,
  'Too many requests from this IP, please try again later.'
);

const strictRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests
  'Too many attempts, please try again later.'
);

const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  200, // 200 requests
  'Too many API requests, please try again later.'
);

// Speed limiter for suspicious activity
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests at full speed
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return next(new ValidationError('Validation failed', errorMessages));
  }
  next();
};

// Common validation rules
const validationRules = {
  // Email validation
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  // Password validation
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  // Name validation
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  // Phone validation
  phone: body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  // MongoDB ObjectId validation
  mongoId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
    
  // Kebab builder validation
  ingredients: body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
    
  ingredientId: body('ingredients.*.id')
    .notEmpty()
    .withMessage('Ingredient ID is required'),
    
  quantity: body('ingredients.*.quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
    
  // Order validation
  customerInfo: [
    body('customerName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Customer name must be between 2 and 100 characters'),
    body('customerEmail')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('customerPhone')
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('deliveryAddress')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Delivery address must be between 10 and 200 characters')
  ],
  
  // Query parameters validation
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  search: query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any HTML tags from string inputs
  const sanitizeString = (str) => {
    if (typeof str === 'string') {
      return str.replace(/<[^>]*>/g, '').trim();
    }
    return str;
  };
  
  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    }
  };
  
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  
  next();
};

module.exports = {
  generalRateLimit,
  strictRateLimit,
  apiRateLimit,
  speedLimiter,
  handleValidationErrors,
  validationRules,
  sanitizeInput
};