import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import AppointmentList from './AppointmentList';
import HealthStats from './HealthStats';

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [healthData, setHealthData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appointmentsRes, healthStatsRes] = await Promise.all([
          axios.get('/api/appointments/upcoming'),
          axios.get('/api/health-records/stats')
        ]);

        setAppointments(appointmentsRes.data);
        setHealthData(healthStatsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        <AppointmentList appointments={appointments} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Health Statistics</h2>
        <HealthStats data={healthData} />
      </div>
    </div>
  );
}

export default Dashboard;