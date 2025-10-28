const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const ingredientsRoutes = require('./ingredients');
const kebabBuilderRoutes = require('./kebabBuilder');
const ordersRoutes = require('./orders');
const productsRoutes = require('./products');

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Aslan Food API v1',
    version: '1.0.0',
    documentation: 'https://api.aslanfood.com/docs',
    endpoints: {
      auth: '/auth',
      ingredients: '/ingredients',
      kebabBuilder: '/kebab-builder',
      orders: '/orders',
      products: '/products',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/ingredients', ingredientsRoutes);
router.use('/kebab-builder', kebabBuilderRoutes);
router.use('/orders', ordersRoutes);
router.use('/products', productsRoutes);

module.exports = router;