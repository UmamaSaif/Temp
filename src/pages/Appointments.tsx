import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Autocomplete,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
}

interface Appointment {
  _id: string;
  doctor: Doctor;
  date: string;
  status: string;
  queueNumber: string;
  consultationType: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    specialty: '',
    availableDate: '',
    availableTime: ''
  });
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    symptoms: '',
    consultationType: 'in-person',
    additionalDetails: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showSnackbar('Error fetching appointments', 'error');
    }
  };

  const searchDoctors = async () => {
    try {
      const response = await axios.get('/api/appointments/doctors/search', {
        params: searchCriteria
      });
      setDoctors(response.data);
      if (response.data.length === 0) {
        showSnackbar('No doctors found matching your search criteria', 'error');
      }
    } catch (error) {
      console.error('Error searching doctors:', error);
      showSnackbar('Error searching doctors', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.doctorId || !formData.date || !formData.symptoms) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      const response = await axios.post('/api/appointments', formData);
      showSnackbar('Appointment booked successfully', 'success');
      
      setOpenDialog(false);
      fetchAppointments();
      
      // Reset form
      setFormData({
        doctorId: '',
        date: '',
        symptoms: '',
        consultationType: 'in-person',
        additionalDetails: ''
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      showSnackbar('Failed to book appointment', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      valueGetter: (params) => params.row.doctor.name
    },
    {
      field: 'date',
      headerName: 'Date & Time',
      flex: 1,
      valueGetter: (params) => new Date(params.row.date).toLocaleString()
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      valueGetter: (params) => params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)
    },
    {
      field: 'queueNumber',
      headerName: 'Queue Number',
      flex: 1
    },
    {
      field: 'consultationType',
      headerName: 'Consultation Type',
      flex: 1
    }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Appointments</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Trigger doctor search if no doctors are loaded
                if (doctors.length === 0) {
                  searchDoctors();
                }
                setOpenDialog(true);
              }}
            >
              Book New Appointment
            </Button>
          </Box>
        </Grid>

        {/* Doctor Search Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Find a Doctor
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Doctor Name"
                  value={searchCriteria.name}
                  onChange={(e) => setSearchCriteria({
                    ...searchCriteria,
                    name: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Specialty"
                  value={searchCriteria.specialty}
                  onChange={(e) => setSearchCriteria({
                    ...searchCriteria,
                    specialty: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Available Date"
                  InputLabelProps={{ shrink: true }}
                  value={searchCriteria.availableDate}
                  onChange={(e) => setSearchCriteria({
                    ...searchCriteria,
                    availableDate: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={searchDoctors}
                >
                  Search Doctors
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ height: 400 }}>
            <DataGrid
              rows={appointments}
              columns={columns}
              getRowId={(row) => row._id}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Book New Appointment</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                    setFormData({ 
                      ...formData, 
                      doctorId: newValue?._id || '' 
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Date & Time"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    consultationType: e.target.value 
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
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
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
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    additionalDetails: e.target.value 
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}