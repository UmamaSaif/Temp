import { useState } from 'react';
import axios from 'axios';

const commonSymptoms = [
  { id: 'fever', label: 'Fever' },
  { id: 'cough', label: 'Cough' },
  { id: 'headache', label: 'Headache' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'sore_throat', label: 'Sore Throat' },
  { id: 'body_aches', label: 'Body Aches' },
  { id: 'shortness_of_breath', label: 'Shortness of Breath' },
  { id: 'nausea', label: 'Nausea' }
];

function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/symptoms/check', {
        symptoms: selectedSymptoms,
        duration,
        severity
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error checking symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Symptom Checker</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Your Symptoms</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {commonSymptoms.map(symptom => (
                <label
                  key={symptom.id}
                  className={`flex items-center p-3 border rounded cursor-pointer ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom.id)}
                    onChange={() => handleSymptomToggle(symptom.id)}
                    className="mr-2"
                  />
                  {symptom.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="">Select duration</option>
              <option value="today">Started today</option>
              <option value="few_days">Few days</option>
              <option value="week">About a week</option>
              <option value="more">More than a week</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || selectedSymptoms.length === 0}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Checking...' : 'Check Symptoms'}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-semibold mb-2">Possible Conditions</h3>
            <ul className="space-y-2">
              {result.conditions.map((condition, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <div className="font-medium">{condition.name}</div>
                    <p className="text-sm text-gray-600">{condition.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-yellow-50 rounded text-yellow-800">
              <p className="text-sm">
                Note: This is not a medical diagnosis. Please consult with a healthcare
                professional for proper medical advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomChecker;