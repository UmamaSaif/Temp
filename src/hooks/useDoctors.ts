import { useState, useEffect } from 'react';
import { doctorsApi } from '../services/api';
import { Doctor } from '../types/appointment';
import { toast } from 'react-toastify';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorsApi.getAll();
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch doctors');
      toast.error('Error loading doctors');
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = async (params: { 
    name?: string; 
    specialty?: string; 
    date?: string;
  }) => {
    try {
      setLoading(true);
      const data = await doctorsApi.search(params);
      setDoctors(data);
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to search doctors');
      toast.error('Error searching doctors');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDoctorAvailability = async (doctorId: string) => {
    try {
      const data = await doctorsApi.getAvailability(doctorId);
      return data;
    } catch (err) {
      toast.error('Error fetching doctor availability');
      throw err;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    searchDoctors,
    getDoctorAvailability
  };
}