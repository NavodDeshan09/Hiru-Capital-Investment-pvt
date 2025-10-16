const Customer = require('../models/Customers'); // Adjust the path as needed
const Payment = require('../models/Payment'); // Import the Payment model
const mongoose = require('mongoose');

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { fullName, birthday, address, idNumber } = req.body;

    // Validate required fields
    if (!fullName || !birthday || !address || !idNumber) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check for duplicate ID Number
    const existingCustomer = await Customer.findOne({ idNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: 'ID Number must be unique!' });
    }

    const newCustomer = new Customer({
      fullName,
      birthday,
      address,
      idNumber
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully!', customer: newCustomer });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid customer ID!' });
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found!' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get payment history for a specific customer by full name
const getCustomerPaymentHistory = async (req, res) => {
  try {
    const { fullName } = req.params;

    // Find customer by full name
    const customer = await Customer.findOne({ fullName });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found!' });
    }

    // Find payments associated with the customer
    const payments = await Payment.find({ idNumber: customer.idNumber }).select('date Amount LoanID');

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payment history found for this customer!' });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update a customer by ID
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, birthday, address, idNumber } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid customer ID!' });
    }

    const updatedData = {
      fullName,
      birthday,
      address,
      idNumber
    };

    // Check for duplicate ID Number (if updating the ID Number)
    const existingCustomer = await Customer.findOne({ idNumber });
    if (existingCustomer && existingCustomer._id.toString() !== id) {
      return res.status(400).json({ message: 'ID Number must be unique!' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found!' });
    }

    res.status(200).json({ message: 'Customer updated successfully!', customer: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete a customer by ID
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid customer ID!' });
    }

    // Find and delete customer
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found!' });
    }

    res.status(200).json({ message: 'Customer deleted successfully!' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerPaymentHistory,
  updateCustomer,
  deleteCustomer,
};
