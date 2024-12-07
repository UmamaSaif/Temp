import React from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';
import { useDoctors } from '../../hooks/useDoctors';

interface DoctorSearchProps {
  onDoctorsFound: (doctors: any[]) => void;
}

export default function DoctorSearch({ onDoctorsFound }: DoctorSearchProps) {
  const { searchDoctors, loading } = useDoctors();
  const [searchCriteria, setSearchCriteria] = React.useState({
    name: '',
    specialty: '',
    date: ''
  });

  const handleSearch = async () => {
    const doctors = await searchDoctors(searchCriteria);
    onDoctorsFound(doctors);
  };

  return (
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
            value={searchCriteria.date}
            onChange={(e) => setSearchCriteria({
              ...searchCriteria,
              date: e.target.value
            })}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Search Doctors'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}