const express = require('express');
const Request = require('../models/Request');
const { requireAuth } = require('../middleware/authMiddleware');
const { isInChennai } = require('../lib/chennai');
const matchingService = require('../socket/matchingService');
const router = express.Router();

function validateLocation(loc) {
  return (
    loc &&
    typeof loc.lat === 'number' &&
    typeof loc.lng === 'number' &&
    typeof loc.address === 'string'
  );
}

router.post('/', requireAuth, async (req, res) => {
  const { type, pickupLocation, destination, shopName, itemList } = req.body;

  if (!type || !['ride', 'errand'].includes(type)) {
    return res.status(400).json({ error: 'type must be ride or errand' });
  }

  if (type === 'ride') {
    if (!validateLocation(pickupLocation)) {
      return res.status(400).json({ error: 'pickupLocation must include lat, lng, and address' });
    }
    if (!validateLocation(destination)) {
      return res.status(400).json({ error: 'destination must include lat, lng, and address' });
    }
    if (!isInChennai(pickupLocation)) {
      return res.status(400).json({ error: 'pickupLocation must be within Chennai bounds' });
    }
    if (!isInChennai(destination)) {
      return res.status(400).json({ error: 'destination must be within Chennai bounds' });
    }
  }

  if (type === 'errand') {
    if (!shopName || typeof shopName !== 'string' || !shopName.trim()) {
      return res.status(400).json({ error: 'shopName is required for errand requests' });
    }
    if (!itemList || typeof itemList !== 'string' || !itemList.trim()) {
      return res.status(400).json({ error: 'itemList is required for errand requests' });
    }
  }

  try {
    const doc = await Request.create({
      type,
      passengerId: req.user.userId,
      pickupLocation: type === 'ride' ? pickupLocation : null,
      destination:   type === 'ride' ? destination   : null,
      shopName:      type === 'errand' ? shopName    : null,
      itemList:      type === 'errand' ? itemList    : null,
    });
    // Start matching asynchronously — don't await so the 201 returns immediately
    setImmediate(() => matchingService.startMatching(doc));
    res.status(201).json(doc);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
