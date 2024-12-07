import React, { useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Autocomplete,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Doctor, BookingFormData } from '../types';

interface BookingFormProps {
  doctors: Doctor[];
  formData: BookingFormData;
  availableSlots: string[];
  onFormChange: (data: Partial<BookingFormData>) => void;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  doctors,
  formData,
  availableSlots,
  onFormChange,
  onDoctorChange,
  onDateChange,
  onSubmit,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={doctors}
              getOptionLabel={(doctor) => `Dr. ${doctor.name} - ${doctor.specialty}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Doctor"
                  required
                  fullWidth
                />
              )}
              value={doctors.find(d => d._id === formData.doctorId) || null}
              onChange={(_, newValue) => {
                onDoctorChange(newValue?._id || '');
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => onDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Consultation Type"
              value={formData.consultationType}
              onChange={(e) => onFormChange({ consultationType: e.target.value })}
              required
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
              value={formData.symptoms}
              onChange={(e) => onFormChange({ symptoms: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Additional Details (Optional)"
              value={formData.additionalDetails}
              onChange={(e) => onFormChange({ additionalDetails: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Book Appointment
        </Button>
      </DialogActions>
    </form>
  );
};