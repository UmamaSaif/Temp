const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialty')
      .sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

module.exports = router;