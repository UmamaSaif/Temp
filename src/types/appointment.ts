export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  availability?: {
    date: string;
    slots: Array<{
      time: string;
      isBooked: boolean;
    }>;
  }[];
}

export interface Appointment {
  _id: string;
  doctor: Doctor;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  queueNumber: string;
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms: string;
  additionalDetails?: string;
}

export interface AppointmentFormData {
  doctorId: string;
  date: string;
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms: string;
  additionalDetails?: string;
}