import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import HealthRecords from './pages/HealthRecords';
import QueueTracking from './pages/QueueTracking';
import Chat from './pages/Chat';
import SymptomChecker from './pages/SymptomChecker';
import { useAuth } from './contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
      />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <Layout>
              <Appointments />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/prescriptions"
        element={
          <PrivateRoute>
            <Layout>
              <Prescriptions />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/health-records"
        element={
          <PrivateRoute>
            <Layout>
              <HealthRecords />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/queue"
        element={
          <PrivateRoute>
            <Layout>
              <QueueTracking />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Layout>
              <Chat doctorId="" />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/symptom-checker"
        element={
          <PrivateRoute>
            <Layout>
              <SymptomChecker />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}