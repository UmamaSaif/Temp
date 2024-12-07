import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import appointmentsRoutes from './routes/appointments.js';
import prescriptionsRoutes from './routes/prescriptions.js';
import healthRecordsRoutes from './routes/healthRecords.js';
import doctorsRoutes from './routes/doctors.js';
import messageRoutes from './routes/messages.js';
import queueRoutes from './routes/queue.js';
import symptomCheckerRoutes from './routes/symptomChecker.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS with specific options
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure Socket.IO with CORS
const io = new Server(httpServer, {
  cors: corsOptions
});

// Database connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/patient-panel', {
      // These options are no longer needed in newer versions of Mongoose
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Monitor database connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/health-records', healthRecordsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/symptom-checker', symptomCheckerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-queue', (appointmentId) => {
    socket.join(`queue-${appointmentId}`);
  });

  socket.on('queue-update', (data) => {
    io.to(`queue-${data.appointmentId}`).emit('queue-position', data);
  });

  socket.on('join-chat', (roomId) => {
    socket.join(`chat-${roomId}`);
  });

  socket.on('chat-message', (data) => {
    io.to(`chat-${data.roomId}`).emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  httpServer.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server closed. Database instance disconnected');
      process.exit(0);
    });
  });
});