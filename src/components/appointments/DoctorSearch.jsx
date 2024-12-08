import { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorSearch({ onDoctorSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm || specialty) {
      searchDoctors();
    }
  }, [searchTerm, specialty]);

  const searchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/doctors/search', {
        params: { searchTerm, specialty }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error searching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter doctor's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialty
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Specialties</option>
            <option value="general">General Physician</option>
            <option value="cardiology">Cardiologist</option>
            <option value="dermatology">Dermatologist</option>
            <option value="pediatrics">Pediatrician</option>
            <option value="orthopedics">Orthopedic</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading doctors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="border rounded p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => onDoctorSelect(doctor)}
            >
              <h3 className="font-semibold">{doctor.name}</h3>
              <p className="text-gray-600">{doctor.specialty}</p>
              <p className="text-sm text-gray-500">
                Experience: {doctor.experience} years
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorSearch;