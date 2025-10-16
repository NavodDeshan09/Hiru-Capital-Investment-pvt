const express = require('express');
const LoanController = require('../controllers/Loan');

const router = express.Router();

// Create a new loan
router.post('/createLoan', LoanController.createLoan);

// Get all loans
router.get('/', LoanController.getAllLoans);

// Get loans by customer ID
router.get('/customer/:customerId', LoanController.getLoansByCustomerId);

// Get a single loan by ID
router.get('/:id', LoanController.getLoanById);

// Update a loan
router.put('/:id', LoanController.updateLoan);

// Delete a loan
router.delete('/:id', LoanController.deleteLoan);

module.exports = router;
