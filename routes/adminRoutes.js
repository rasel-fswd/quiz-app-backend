const express = require('express');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticate, isAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
