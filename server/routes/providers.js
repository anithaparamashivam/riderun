const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

function requireProvider(req, res, next) {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Forbidden: providers only' });
  }
  next();
}

// Get provider profile (name, isOnline)
router.get('/me', requireAuth, requireProvider, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email picture isOnline role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle availability
router.patch('/me/availability', requireAuth, requireProvider, async (req, res) => {
  const { isOnline } = req.body;
  if (typeof isOnline !== 'boolean') {
    return res.status(400).json({ error: 'isOnline must be a boolean' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isOnline },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ isOnline: user.isOnline });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
