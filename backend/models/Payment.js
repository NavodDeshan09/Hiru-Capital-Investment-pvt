const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  LoanID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the Customer model
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  RiderID: {
    type: String,
  },
  date: {
    type: Date,
    required: true, // Make the date field required
  },
});

module.exports = mongoose.model('Payment', PaymentSchema);