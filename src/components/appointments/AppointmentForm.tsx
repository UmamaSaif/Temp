import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { Doctor, AppointmentFormData } from '../../types/appointment';
import { useDoctors } from '../../hooks/useDoctors';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  availableDoctors: Doctor[];
}

export default function AppointmentForm({
  open,
  onClose,
  onSubmit,
  availableDoctors
}: AppointmentFormProps) {
  const { getDoctorAvailability } = useDoctors();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<AppointmentFormData>({
    doctorId: '',
    date: '',
    consultationType: 'in-person',
    symptoms: '',
    additionalDetails: ''
  });
  const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);

  const handleDoctorChange = async (doctorId: string) => {
    try {
      setLoading(true);
      const availability = await getDoctorAvailability(doctorId);
      setAvailableSlots(availability.map((slot: any) => slot.time));
      setFormData(prev => ({ ...prev, doctorId }));
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date || !formData.symptoms) return;
    await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Book New Appointment</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              options={availableDoctors}
              getOptionLabel={(doctor) => `Dr. ${doctor.name} - ${doctor.specialty}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Doctor"
                  required
                  fullWidth
                />
              )}
              onChange={(_, doctor) => doctor && handleDoctorChange(doctor._id)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Available Time Slots"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={loading || availableSlots.length === 0}
            >
              {availableSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Consultation Type"
              value={formData.consultationType}
              onChange={(e) => setFormData({ 
                ...formData, 
                consultationType: e.target.value as any 
              })}
            >
              <MenuItem value="in-person">In-Person</MenuItem>
              <MenuItem value="video">Video Consultation</MenuItem>
              <MenuItem value="phone">Phone Consultation</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Symptoms"
              required
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Additional Details (Optional)"
              value={formData.additionalDetails}
              onChange={(e) => setFormData({ 
                ...formData, 
                additionalDetails: e.target.value 
              })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          disabled={loading || !formData.doctorId || !formData.date || !formData.symptoms}
        >
          {loading ? <CircularProgress size={24} /> : 'Book Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}