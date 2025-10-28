const express = require('express');
const router = express.Router();

// Auth routes placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

module.exports = router;