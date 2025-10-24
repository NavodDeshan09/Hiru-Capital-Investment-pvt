import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // Import jsPDF
import './../css/AddPayment.css'; // Correct path to AddPayment.css

const AddPayment = () => {
  const [formData, setFormData] = useState({
    LoanID: '',
    customerID: '',
    fullName: '',
    address: '',
    idNumber: '',
    Amount: '',
    RiderID: '',
    date: '',
    time: '', // Add time field
  });
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://hiru-captial-investment-pvt.onrender.com/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'fullName') {
      const selectedCustomer = customers.find((customer) => customer.fullName === value);
      if (selectedCustomer) {
        setFormData((prevData) => ({
          ...prevData,
          customerID: selectedCustomer._id,
          idNumber: selectedCustomer.idNumber,
          address: selectedCustomer.address,
        }));

        try {
          const response = await axios.get(`https://hiru-captial-investment-pvt.onrender.com/api/loan/customer/${selectedCustomer._id}`);
          setLoans(response.data);
        } catch (error) {
          console.error('Error fetching loans:', error);
        }
      }
    }
  };

  const handleLoanChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'LoanID') {
      const selectedLoan = loans.find((loan) => loan._id === value);
      if (selectedLoan) {
        setFormData((prevData) => ({
          ...prevData,
          LoanID: selectedLoan._id,
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // send form data to backend; backend will generate a unique 4-digit receiptNumber
      const payload = { ...formData };

      const response = await axios.post('https://hiru-captial-investment-pvt.onrender.com/api/payment', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // response expected to include created payment in response.data.payment
      const created = response.data?.payment || response.data;
      const receiptRef = created?.receiptNumber || created?.receiptNo || 'N/A';
      setStatusMessage({ type: 'success', text: response.data.message || `Payment saved. Receipt #: ${receiptRef}` });

      // Generate receipt PDF using server-returned payment (so it includes the receiptNumber)
      generateReceipt(created);

      // Clear the form
      setFormData({
        LoanID: '',
        customerID: '',
        fullName: '',
        address: '',
        idNumber: '',
        Amount: '',
        RiderID: '',
        date: '',
        time: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add payment. Please try again.' });
    }
  };

  // Function to generate receipt
  const generateReceipt = (data) => {
    const doc = new jsPDF();

    // Get current date and time for receipt issue
    const now = new Date();
    const issueDate = now.toLocaleDateString();
    const issueTime = now.toLocaleTimeString();

    // Add receipt content
    doc.setFontSize(16);
    doc.text('Hiru Capital Investment pvt', 20, 30);
    doc.text('Payment Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Receipt No: ${data.receiptNumber || data.receiptNo || 'N/A'}`, 20, 36);
    doc.text(`Full Name: ${data.fullName}`, 20, 46);
    doc.text(`Loan ID: ${data.LoanID}`, 20, 56);
    doc.text(`Address: ${data.address}`, 20, 66);
    doc.text(`ID Number: ${data.idNumber}`, 20, 76);
    doc.text(`Amount: ${data.Amount}`, 20, 86);
    doc.text(`Rider ID: ${data.RiderID || 'N/A'}`, 20, 96);
    doc.text(`Payment Date: ${data.date}`, 20, 106);
    doc.text(`Receipt Issued At: ${issueDate} ${issueTime}`, 20, 116); // Add receipt issue time

    // Save the receipt as a PDF with receipt number in filename
    const filename = `Payment_Receipt_${data.receiptNumber || data.receiptNo || Date.now()}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="add-payment">
      <h2>Add Payment</h2>

      {statusMessage.text && (
        <div className={`status-message ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <select
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleCustomerChange}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer.fullName}>
                {customer.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="LoanID">Loan ID</label>
          <select
            id="LoanID"
            name="LoanID"
            value={formData.LoanID}
            onChange={handleLoanChange}
            required
          >
            <option value="">Select Loan</option>
            {loans.map((loan) => (
              <option key={loan._id} value={loan._id}>
                {loan._id}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="idNumber">ID Number</label>
          <input
            type="text"
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Amount">Amount</label>
          <input
            type="number"
            id="Amount"
            name="Amount"
            value={formData.Amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="RiderID">Rider ID</label>
          <input
            type="text"
            id="RiderID"
            name="RiderID"
            value={formData.RiderID}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Payment Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
       
        <button type="submit">Add Payment</button>
      </form>
    </div>
  );
};

export default AddPayment;