import { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorSearch from './DoctorSearch';
import AppointmentForm from './AppointmentForm';

function AppointmentBooking() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const response = await axios.get(`/api/appointments/slots/${doctor._id}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleBookAppointment = async (appointmentData) => {
    try {
      await axios.post('/api/appointments', {
        ...appointmentData,
        doctorId: selectedDoctor._id
      });
      // Handle success (e.g., show notification, redirect)
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      <DoctorSearch onDoctorSelect={handleDoctorSelect} />
      {selectedDoctor && (
        <AppointmentForm
          doctor={selectedDoctor}
          availableSlots={availableSlots}
          onSubmit={handleBookAppointment}
        />
      )}
    </div>
  );
}

export default AppointmentBooking;