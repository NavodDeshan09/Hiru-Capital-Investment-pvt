import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../css/ViewAllPayments.css'; // Correct path to ViewAllPayments.css
import withAdminAuth from './withAdminAuth'; // Correct import path
import DeleteIcon from '@mui/icons-material/Delete';

const ViewAllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        if (!token) {
          throw new Error('Authentication token is missing.');
        }

        const response = await axios.get('http://localhost:5000/api/payment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Payments Data:', response.data); // Debugging log
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching payments.');
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      await axios.delete(`http://localhost:5000/api/payment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayments(payments.filter((payment) => payment._id !== id));
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError(err.response?.data?.message || 'An error occurred while deleting the payment.');
    }
  };

  return (
    <div className="view-all-payments">
      <h2>All Payments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              {/* <th>Payment ID</th>
              <th>Loan ID</th> */}
              <th>No</th> {/* sequence column */}
              <th>Reference</th> {/* new reference/receipt column */}
              <th>Customer Name</th>
              <th>Customer Address</th>
              <th>ID Number</th>
              <th>Amount</th>
              <th>Rider ID</th>
              <th>Date</th> {/* Added Date column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                {/* <td>{payment._id}</td>
                <td>{payment.LoanID}</td> */}
                <td className="seq-col">{index + 1}</td> {/* sequence cell */}
                <td>{payment.receiptNumber || payment.receiptNo || 'N/A'}</td>
                <td>{payment.customerID?.fullName || 'N/A'}</td> {/* Display customer name */}
                <td>{payment.customerID?.address || 'N/A'}</td> {/* Display customer address */}
                <td>{payment.idNumber}</td>
                <td>{payment.Amount}</td>
                <td>{payment.RiderID || 'N/A'}</td>
                <td>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</td> {/* Display formatted date */}
                <td className="actions-cell">
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(payment._id)}
                    title="Delete"
                    aria-label="Delete payment"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withAdminAuth(ViewAllPayments); // Wrap the component with the HOC