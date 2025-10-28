const express = require('express');
const router = express.Router();

// Orders routes placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Orders routes working' });
});

module.exports = router;