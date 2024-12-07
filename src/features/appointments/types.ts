export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  availability?: {
    date: string;
    slots: TimeSlot[];
  }[];
}

export interface TimeSlot {
  time: string;
  isBooked: boolean;
}

export interface Appointment {
  _id: string;
  doctor: Doctor;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  queueNumber: string;
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms?: string;
  additionalDetails?: string;
}

export interface SearchCriteria {
  name: string;
  specialty: string;
  availableDate: string;
  availableTime?: string;
}

export interface BookingFormData {
  doctorId: string;
  date: string;
  consultationType: string;
  symptoms: string;
  additionalDetails: string;
}