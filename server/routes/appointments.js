const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');

// Get all appointments for the authenticated patient
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialty')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get upcoming appointments
router.get('/upcoming', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
      date: { $gte: new Date() },
      status: 'scheduled'
    })
      .populate('doctor', 'name specialty')
      .sort({ date: 1 })
      .limit(5);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming appointments' });
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, symptoms } = req.body;
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      symptoms,
      queueNumber: Math.floor(Math.random() * 100) + 1 // Simplified queue number generation
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment' });
  }
});

// Update appointment status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patient: req.user._id },
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

module.exports = router;