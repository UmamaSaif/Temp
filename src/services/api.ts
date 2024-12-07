import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  validate: async () => {
    const response = await api.get('/auth/validate');
    return response.data;
  }
};

// Doctors API
export const doctorsApi = {
  getAll: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },
  search: async (params: { name?: string; specialty?: string; date?: string }) => {
    const response = await api.get('/doctors/search', { params });
    return response.data;
  },
  getAvailability: async (doctorId: string) => {
    const response = await api.get(`/doctors/${doctorId}/availability`);
    return response.data;
  }
};

// Appointments API
export const appointmentsApi = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  getUpcoming: async () => {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  },
  create: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data;
  }
};

// Health Records API
export const healthRecordsApi = {
  getAll: async () => {
    const response = await api.get('/health-records');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/health-records/stats');
    return response.data;
  }
};

// Prescriptions API
export const prescriptionsApi = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/prescriptions', { params });
    return response.data;
  },
  downloadPDF: async (id: string) => {
    const response = await api.get(`/prescriptions/${id}/pdf`, { 
      responseType: 'blob' 
    });
    return response.data;
  }
};

// Queue API
export const queueApi = {
  getPosition: async (appointmentId: string) => {
    const response = await api.get(`/queue/${appointmentId}`);
    return response.data;
  },
  updatePosition: async (appointmentId: string, data: any) => {
    const response = await api.patch(`/queue/${appointmentId}`, data);
    return response.data;
  }
};

// Messages API
export const messagesApi = {
  getChatHistory: async (userId: string) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },
  markAsRead: async (userId: string) => {
    const response = await api.patch(`/messages/read/${userId}`);
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread/count');
    return response.data;
  }
};

// Symptom Checker API
export const symptomCheckerApi = {
  check: async (symptoms: string) => {
    const response = await api.post('/symptom-checker', { symptoms });
    return response.data;
  }
};

export default api;