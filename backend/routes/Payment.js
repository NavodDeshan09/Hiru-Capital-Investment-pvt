const express = require('express');
const PaymentController = require('../controllers/Payment');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create a new payment
router.post('/', PaymentController.createPayment);

// Get all payments (admin only)
router.get('/', adminAuth, PaymentController.getAllPayments);

// Get a single payment by ID
router.get('/:id', PaymentController.getPaymentById);

// Get payments by customer ID


// Update a payment
router.put('/:id', PaymentController.updatePayment);

// Delete a payment
router.delete('/:id', PaymentController.deletePayment);

module.exports = router;