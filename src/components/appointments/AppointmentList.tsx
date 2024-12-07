import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoIcon,
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Appointment } from '../../types/appointment';
import { formatDateTime } from '../../utils/dateUtils';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
}

export default function AppointmentList({
  appointments,
  onEdit,
  onDelete
}: AppointmentListProps) {
  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoIcon />;
      case 'phone':
        return <PhoneIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Doctor</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Queue Number</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell>
                <Typography variant="body1">
                  Dr. {appointment.doctor.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {appointment.doctor.specialty}
                </Typography>
              </TableCell>
              <TableCell>{formatDateTime(appointment.date)}</TableCell>
              <TableCell>
                <Tooltip title={appointment.consultationType}>
                  <IconButton size="small">
                    {getConsultationIcon(appointment.consultationType)}
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Chip
                  label={appointment.status}
                  color={getStatusColor(appointment.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>{appointment.queueNumber}</TableCell>
              <TableCell>
                {onEdit && (
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(appointment)}
                      disabled={appointment.status !== 'scheduled'}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Cancel">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(appointment)}
                      disabled={appointment.status !== 'scheduled'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}