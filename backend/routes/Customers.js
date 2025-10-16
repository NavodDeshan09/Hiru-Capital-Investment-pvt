const express = require('express');
const CustomerController = require('../controllers/Customers');

const router = express.Router();

// Create a new customer
router.post('/', CustomerController.createCustomer);

// Get all customers
router.get('/', CustomerController.getAllCustomers);

// Get a single customer by ID
router.get('/:id', CustomerController.getCustomerById);

// Get payment history for a specific customer
router.get('/:fullName/payments', CustomerController.getCustomerPaymentHistory);

// Update a customer by ID
router.put('/:id', CustomerController.updateCustomer);

// Delete a customer by ID
router.delete('/:id', CustomerController.deleteCustomer);

module.exports = router;
