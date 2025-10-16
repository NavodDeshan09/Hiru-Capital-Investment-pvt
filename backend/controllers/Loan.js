const Loan = require('../models/Loan'); // Adjust the path as needed

// Create a new loan
const createLoan = async (req, res) => {
  try {
    const {
      CustomerID,
      fullname,
      email,
      nic,
      garantter1,
      garantter1id,
      garantter1address,
      garantter2,
      garantter2id,
      garantter2address,
      amount,
      installment,
      installmentrate,
      interest,
      loanEndDate,
      loanDuration,
      loanType,
    } = req.body;

    // Validate required fields
    if (
      !CustomerID ||
      !fullname ||
      !email ||
      !nic ||
      !garantter1 ||
      !garantter1id ||
      !garantter1address ||
      !garantter2 ||
      !garantter2id ||
      !garantter2address ||
      !amount ||
      !installment ||
      !installmentrate ||
      !interest ||
      !loanEndDate ||
      !loanDuration ||
      !loanType
    ) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if a loan already exists for the given CustomerID
    const existingLoan = await Loan.findOne({ CustomerID });
    if (existingLoan) {
      return res.status(400).json({ message: 'A loan already exists for this customer!' });
    }

    const newLoan = new Loan({
      CustomerID,
      fullname,
      email,
      nic,
      garantter1,
      garantter1id,
      garantter1address,
      garantter2,
      garantter2id,
      garantter2address,
      amount,
      installment,
      installmentrate,
      interest,
      loanEndDate,
      loanDuration,
      loanType,
      totalPayment: 0,
      fine: 0,
      createDate: Date.now(),
    });

    await newLoan.save();
    res.status(201).json({ message: 'Loan created successfully!', loan: newLoan });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all loans
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find();
    loans.forEach(loan => loan.calculateFine());
    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get loans by customer ID
const getLoansByCustomerId = async (req, res) => {
  try {
    const loans = await Loan.find({ CustomerID: req.params.customerId });
    loans.forEach(loan => loan.calculateFine());
    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get a loan by ID
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found!' });
    }
    loan.calculateFine();
    res.status(200).json(loan);
  } catch (error) {
    console.error('Error fetching loan:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update a loan
const updateLoan = async (req, res) => {
  try {
    const {
      CustomerID,
      fullname,
      email,
      nic,
      garantter1,
      garantter1id,
      garantter1address,
      garantter2,
      garantter2id,
      garantter2address,
      amount,
      installment,
      installmentrate,
      interest,
      loanEndDate,
      loanDuration,
      loanType,
      fine,
      totalPayment,
    } = req.body;

    const updatedData = {
      CustomerID,
      fullname,
      email,
      nic,
      garantter1,
      garantter1id,
      garantter1address,
      garantter2,
      garantter2id,
      garantter2address,
      amount,
      installment,
      installmentrate,
      interest,
      loanEndDate,
      loanDuration,
      loanType,
      fine,
      totalPayment,
    };

    const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan not found!' });
    }

    updatedLoan.calculateFine();
    await updatedLoan.save();

    res.status(200).json({ message: 'Loan updated successfully!', loan: updatedLoan });
  } catch (error) {
    console.error('Error updating loan:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete a loan
const deleteLoan = async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);

    if (!deletedLoan) {
      return res.status(404).json({ message: 'Loan not found!' });
    }

    res.status(200).json({ message: 'Loan deleted successfully!' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createLoan,
  getAllLoans,
  getLoansByCustomerId,
  getLoanById,
  updateLoan,
  deleteLoan,
};