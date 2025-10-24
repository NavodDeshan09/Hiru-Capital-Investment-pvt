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
  // auto-generated 4-digit unique receipt number
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 4,
  },
});

// Pre-validate hook: generate a 4-digit receiptNumber and try to avoid collisions
PaymentSchema.pre('validate', async function (next) {
  if (this.receiptNumber) return next();

  const PaymentModel = mongoose.models.Payment;
  let attempts = 0;
  while (attempts < 10) {
    const candidate = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
    try {
      // If model exists, check uniqueness in DB; otherwise accept candidate
      const exists = PaymentModel ? await PaymentModel.exists({ receiptNumber: candidate }) : false;
      if (!exists) {
        this.receiptNumber = candidate;
        return next();
      }
    } catch (err) {
      // on DB error, still try next candidate
      // eslint-disable-next-line no-console
      console.error('Error checking receiptNumber uniqueness:', err);
    }
    attempts += 1;
  }

  // Fallback: derive 4 digits from timestamp (very unlikely to collide with above)
  this.receiptNumber = String(Date.now()).slice(-4);
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);