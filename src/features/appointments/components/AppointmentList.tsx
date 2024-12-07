import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { Appointment } from '../types';

interface AppointmentListProps {
  appointments: Appointment[];
}

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

export const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  return (
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
  );
};