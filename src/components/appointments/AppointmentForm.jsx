import { useState } from 'react';

function AppointmentForm({ doctor, availableSlots, onSubmit }) {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      slot: selectedSlot,
      reason,
      doctorId: doctor._id
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Book Appointment with Dr. {doctor.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Slots
          </label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {new Date(slot.time).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Visit
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Please describe your symptoms or reason for visit"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;