import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import AppointmentBooking from './components/appointments/AppointmentBooking';
import Prescriptions from './components/prescriptions/Prescriptions';
import HealthRecords from './components/health/HealthRecords';
import QueueTracking from './components/queue/QueueTracking';
import Chat from './components/chat/Chat';
import SymptomChecker from './components/symptoms/SymptomChecker';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/appointments" element={<PrivateRoute><AppointmentBooking /></PrivateRoute>} />
              <Route path="/prescriptions" element={<PrivateRoute><Prescriptions /></PrivateRoute>} />
              <Route path="/health-records" element={<PrivateRoute><HealthRecords /></PrivateRoute>} />
              <Route path="/queue" element={<PrivateRoute><QueueTracking /></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/symptoms" element={<PrivateRoute><SymptomChecker /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;