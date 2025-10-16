const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import routes
const userRoutes = require('../routes/Users');
const customerRoutes = require('../routes/Customers');
const loanRoutes = require('../routes/Loan');
const paymentRoutes = require('../routes/Payment');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// MongoDB connection (ensure it's only connected once)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log('Database connected successfully');
}
connectDB().catch((err) => {
  console.error('Database connection error:', err.message);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy and running!' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Vercel handler export
module.exports = app;