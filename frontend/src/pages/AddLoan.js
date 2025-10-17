import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../css/AddLoan.css';

const AddLoan = () => {
  const [formData, setFormData] = useState({
    CustomerID: '',
    fullname: '',
    email: '',
    nic: '',
    garantter1: '',
    garantter1id: '',
    garantter1address: '',
    garantter2: '',
    garantter2id: '',
    garantter2address: '',
    amount: '',
    installment: '',
    installmentrate: '',
    loanType: '',
    loanDuration: '',
    interest: '',
    loanEndDate: '',
    createDate: '', // ✅ user selects manually
  });

  const [customers, setCustomers] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // ✅ Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          'https://hiru-captial-investment-pvt.onrender.com/api/customers'
        );
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Auto-calculate interest
      const amount = parseFloat(name === 'amount' ? value : updatedData.amount);
      const installmentrate = parseFloat(
        name === 'installmentrate' ? value : updatedData.installmentrate
      );
      const loanDuration = parseFloat(
        name === 'loanDuration' ? value : updatedData.loanDuration
      );
      const loanType = name === 'loanType' ? value : updatedData.loanType;

      if (!isNaN(amount) && !isNaN(installmentrate) && !isNaN(loanDuration) && loanType) {
        const monthlyRate = installmentrate / 100;
        let interest = 0;

        if (loanType === 'Daily') {
          const dailyRate = monthlyRate / 25;
          interest = amount * dailyRate * loanDuration;
        } else if (loanType === 'Weekly') {
          const weeklyRate = monthlyRate / 4;
          interest = amount * weeklyRate * loanDuration;
        }

        updatedData.interest = interest.toFixed(2);
      } else {
        updatedData.interest = '';
      }

      // Auto-fill NIC and CustomerID
      if (name === 'fullname') {
        const selectedCustomer = customers.find(
          (customer) => customer.fullName === value
        );
        if (selectedCustomer) {
          updatedData.CustomerID = selectedCustomer._id;
          updatedData.nic = selectedCustomer.idNumber;
        }
      }

      return updatedData;
    });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://hiru-captial-investment-pvt.onrender.com/api/loan/createLoan',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setStatusMessage({ type: 'success', text: response.data.message });

      // Reset form
      setFormData({
        CustomerID: '',
        fullname: '',
        email: '',
        nic: '',
        garantter1: '',
        garantter1id: '',
        garantter1address: '',
        garantter2: '',
        garantter2id: '',
        garantter2address: '',
        amount: '',
        installment: '',
        installmentrate: '',
        loanType: '',
        loanDuration: '',
        interest: '',
        loanEndDate: '',
        createDate: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage({
        type: 'error',
        text:
          error.response?.data?.message || 'Failed to add loan. Please try again.',
      });
    }
  };

  return (
    <div className="add-loan">
      <h2>Add Loan</h2>

      {statusMessage.text && (
        <div className={`status-message ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Selection */}
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <select
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
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

        {/* NIC */}
        <div className="form-group">
          <label htmlFor="nic">NIC</label>
          <input
            type="text"
            id="nic"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Guarantor 1 */}
        <div className="form-group">
          <label htmlFor="garantter1">Guarantor 1</label>
          <input
            type="text"
            id="garantter1"
            name="garantter1"
            value={formData.garantter1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="garantter1id">Guarantor 1 ID</label>
          <input
            type="text"
            id="garantter1id"
            name="garantter1id"
            value={formData.garantter1id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="garantter1address">Guarantor 1 Address</label>
          <input
            type="text"
            id="garantter1address"
            name="garantter1address"
            value={formData.garantter1address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Guarantor 2 */}
        <div className="form-group">
          <label htmlFor="garantter2">Guarantor 2</label>
          <input
            type="text"
            id="garantter2"
            name="garantter2"
            value={formData.garantter2}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="garantter2id">Guarantor 2 ID</label>
          <input
            type="text"
            id="garantter2id"
            name="garantter2id"
            value={formData.garantter2id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="garantter2address">Guarantor 2 Address</label>
          <input
            type="text"
            id="garantter2address"
            name="garantter2address"
            value={formData.garantter2address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Loan Details */}
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="installment">Installment</label>
          <input
            type="number"
            id="installment"
            name="installment"
            value={formData.installment}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="installmentrate">Installment Rate (%)</label>
          <input
            type="number"
            id="installmentrate"
            name="installmentrate"
            value={formData.installmentrate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="loanType">Loan Type</label>
          <select
            id="loanType"
            name="loanType"
            value={formData.loanType}
            onChange={handleChange}
            required
          >
            <option value="">Select Loan Type</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="loanDuration">Loan Duration</label>
          <input
            type="number"
            id="loanDuration"
            name="loanDuration"
            value={formData.loanDuration}
            onChange={handleChange}
            placeholder="Enter number of days or weeks"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="interest">Interest</label>
          <input
            type="number"
            id="interest"
            name="interest"
            value={formData.interest}
            readOnly
          />
        </div>

        {/* ✅ Manually selected dates */}
        <div className="form-group">
          <label htmlFor="createDate">Create Date</label>
          <input
            type="date"
            id="createDate"
            name="createDate"
            value={formData.createDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="loanEndDate">Loan End Date</label>
          <input
            type="date"
            id="loanEndDate"
            name="loanEndDate"
            value={formData.loanEndDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add Loan</button>
      </form>
    </div>
  );
};

export default AddLoan;
