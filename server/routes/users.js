const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

const VALID_ROLES = ['passenger', 'provider'];

router.patch('/me/role', requireAuth, async (req, res) => {
  const { role } = req.body;
  if (!role || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'role must be passenger or provider' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
