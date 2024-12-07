import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialty availability')
      .sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Search doctors by name, specialty, or availability
router.get('/search', auth, async (req, res) => {
  try {
    const { query, specialty, date } = req.query;
    const searchQuery = {
      role: 'doctor'
    };

    if (query) {
      searchQuery.name = { $regex: query, $options: 'i' };
    }

    if (specialty) {
      searchQuery.specialty = specialty;
    }

    if (date) {
      // Add availability check logic here
      searchQuery['availability.date'] = new Date(date);
    }

    const doctors = await User.find(searchQuery)
      .select('name specialty availability')
      .sort({ name: 1 });
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error searching doctors' });
  }
});

// Get doctor's availability
router.get('/:id/availability', auth, async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
      .select('availability');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor availability' });
  }
});

export default router;
