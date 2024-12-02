import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import HealthRecords from './pages/HealthRecords';
import QueueTracking from './pages/QueueTracking';
import Chat from './pages/Chat';
import SymptomChecker from './pages/SymptomChecker';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/health-records" element={<HealthRecords />} />
                <Route path="/queue" element={<QueueTracking />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/symptom-checker" element={<SymptomChecker />} />
              </Routes>
            </Layout>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;