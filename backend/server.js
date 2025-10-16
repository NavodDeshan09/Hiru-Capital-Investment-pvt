const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import routes
const userRoutes = require('./routes/Users'); // User-related routes
const customerRoutes = require('./routes/Customers'); // Customer-related routes
const loanRoutes = require('./routes/Loan'); 
const paymentRoutes = require('./routes/Payment');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({ origin: true, credentials: true })); // Enable CORS with credentials support
app.use(cookieParser()); // Parse cookies

// MongoDB connection URI
const uri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  });

// Routes
app.use('/api/users', userRoutes); // Prefix user routes with /api/users
app.use('/api/customers', customerRoutes); // Prefix customer routes with /api/customers
app.use('/api/loan', loanRoutes); // Prefix loan routes with /api/loan
app.use('/api/payment', paymentRoutes); // Prefix payment routes with /api/payment

// Health check endpoint
app.get('/health', (req, res) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



