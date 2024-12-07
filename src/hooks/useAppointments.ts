import { useState, useEffect } from 'react';
import { appointmentsApi } from '../services/api';
import { Appointment } from '../types/appointment';
import { toast } from 'react-toastify';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getAll();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      const response = await appointmentsApi.create(appointmentData);
      setAppointments(prev => [...prev, response]);
      toast.success('Appointment booked successfully');
      return response;
    } catch (err) {
      toast.error('Failed to book appointment');
      throw err;
    }
  };

  const updateAppointment = async (id: string, data: any) => {
    try {
      const response = await appointmentsApi.update(id, data);
      setAppointments(prev => 
        prev.map(apt => apt._id === id ? response : apt)
      );
      toast.success('Appointment updated successfully');
      return response;
    } catch (err) {
      toast.error('Failed to update appointment');
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment
  };
}