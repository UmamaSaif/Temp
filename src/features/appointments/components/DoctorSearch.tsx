import React from 'react';
import { Grid, TextField, Button, Paper, Typography } from '@mui/material';
import { SearchCriteria } from '../types';

interface DoctorSearchProps {
  searchCriteria: SearchCriteria;
  onSearchChange: (criteria: SearchCriteria) => void;
  onSearch: () => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({
  searchCriteria,
  onSearchChange,
  onSearch
}) => {
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
            onChange={(e) => onSearchChange({
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
            onChange={(e) => onSearchChange({
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
            onChange={(e) => onSearchChange({
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
            onClick={onSearch}
          >
            Search Doctors
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};