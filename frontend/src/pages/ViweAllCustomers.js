import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../css/ViewAllCustomers.css';

const ViewAllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://hiru-captial-investment-pvt.onrender.com/api/customers');
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching customers.');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const fetchPaymentHistory = async (fullName) => {
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const response = await axios.get(`https://hiru-captial-investment-pvt.onrender.com/api/customers/${fullName}/payments`);
      setPaymentHistory(response.data);
      setSelectedCustomer(fullName);
      setPaymentLoading(false);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setPaymentHistory([]);
      setPaymentError('Failed to fetch payment history. Please try again.');
      setPaymentLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
    setPaymentHistory([]);
  };

  return (
    <div className="view-all-customers">
      <h2>All Customers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="customers-list">
          {customers.map((customer) => (
            <div key={customer._id} className="customer-card">
              <div className="card-content">
                <h3>{customer.fullName}</h3>
                <div className="customer-info-grid">
  <div className="label">Customer ID:</div>
  <div className="value">{customer._id}</div>

  <div className="label">Birthday:</div>
  <div className="value">{new Date(customer.birthday).toLocaleDateString()}</div>

  <div className="label">Address:</div>
  <div className="value">{customer.address}</div>

  <div className="label">ID Number:</div>
  <div className="value">{customer.idNumber}</div>


</div>
  </div>


              <button
                className="view-payments-button"
                onClick={() => fetchPaymentHistory(customer.fullName)}
              >
                View Payment History
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Payment History for {selectedCustomer}</h3>
            {paymentLoading ? (
              <p>Loading payment history...</p>
            ) : paymentError ? (
              <p className="error">{paymentError}</p>
            ) : paymentHistory.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Loan ID</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment._id}>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>{payment.Amount}</td>
                      <td>{payment.LoanID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No payment history found for this customer.</p>
            )}
            <button className="close-modal" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllCustomers;
