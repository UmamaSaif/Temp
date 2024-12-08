import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HealthRecords() {
  const [healthData, setHealthData] = useState(null);
  const [newRecord, setNewRecord] = useState({
    type: 'weight',
    value: '',
    unit: 'kg',
    notes: ''
  });

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await axios.get('/api/health-records/stats');
      setHealthData(response.data);
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/health-records', newRecord);
      setNewRecord({
        type: 'weight',
        value: '',
        unit: 'kg',
        notes: ''
      });
      fetchHealthData();
    } catch (error) {
      console.error('Error adding health record:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Health Records</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({
                  ...newRecord,
                  type: e.target.value,
                  unit: getDefaultUnit(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="weight">Weight</option>
                <option value="blood_pressure">Blood Pressure</option>
                <option value="blood_sugar">Blood Sugar</option>
                <option value="temperature">Temperature</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Value
              </label>
              <input
                type="text"
                value={newRecord.value}
                onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder={`Enter ${newRecord.type.replace('_', ' ')}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Record
          </button>
        </form>
      </div>

      {healthData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
          <Line data={healthData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Health Metrics Over Time'
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day'
      }
    }
  }
};

function getDefaultUnit(type) {
  const units = {
    weight: 'kg',
    blood_pressure: 'mmHg',
    blood_sugar: 'mg/dL',
    temperature: '°C'
  };
  return units[type] || '';
}

export default HealthRecords;