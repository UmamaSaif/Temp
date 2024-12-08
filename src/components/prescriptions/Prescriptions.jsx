import { useState, useEffect } from 'react';
import axios from 'axios';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('/api/prescriptions');
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPrescription = async (id) => {
    try {
      const response = await axios.get(`/api/prescriptions/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading prescription:', error);
    }
  };

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Prescriptions</h1>
      <div className="grid gap-4">
        {prescriptions.map((prescription) => (
          <div key={prescription._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Dr. {prescription.doctorId.name}
                </h2>
                <p className="text-gray-600">
                  {new Date(prescription.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => downloadPrescription(prescription._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download PDF
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Diagnosis</h3>
                <p>{prescription.diagnosis}</p>
              </div>
              <div>
                <h3 className="font-semibold">Medications</h3>
                <ul className="list-disc pl-5">
                  {prescription.medications.map((med, index) => (
                    <li key={index}>
                      {med.name} - {med.dosage}, {med.frequency}, for {med.duration}
                    </li>
                  ))}
                </ul>
              </div>
              {prescription.notes && (
                <div>
                  <h3 className="font-semibold">Notes</h3>
                  <p>{prescription.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prescriptions;