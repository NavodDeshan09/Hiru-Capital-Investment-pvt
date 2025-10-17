import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/AdminDashboard.css'; // Ensure you have a CSS file for styling

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        if (!id || !token) {
          setError('Admin ID or token not found. Redirecting to login...');
          setLoading(false);
          setTimeout(() => navigate('/'), 2000); // Redirect to login after 2 seconds
          return;
        }

        const response = await axios.get(`https://hiru-captial-investment-pvt.onrender.com/api/users/user/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdmin(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        setError('Failed to fetch admin profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Admin Profile Section - show as readonly form */}
      <div className="admin-profile">
        <h2>Admin Profile</h2>

        <form className="admin-profile-form" aria-label="Admin profile (read only)">
          <label>
            Username
            <input type="text" value={admin.username || ''} readOnly />
          </label>

          <label>
            Email
            <input type="email" value={admin.email || ''} readOnly />
          </label>

          <label>
            Role
            <input type="text" value={admin.role || ''} readOnly />
          </label>
        </form>
      </div>

      {/* Admin Actions Section */}
      <div className="admin-actions">
        <Link to="/AddLoan" className="admin-action">
          <i className="fas fa-plus-circle"></i>
          <span>Add Loan</span>
        </Link>
        <Link to="/AddCustomers" className="admin-action">
          <i className="fas fa-user-plus"></i>
          <span>Add Customers</span>
        </Link>
        <Link to="/ViewAllCustomers" className="admin-action">
          <i className="fas fa-users"></i>
          <span>View All Customers</span>
        </Link>
        <Link to="/ViewAllUsers" className="admin-action">
          <i className="fas fa-user-friends"></i>
          <span>View All Users</span>
        </Link>
        <Link to="/ViewAllLoans" className="admin-action">
          <i className="fas fa-file-invoice-dollar"></i>
          <span>View All Loans</span>
        </Link>
        <Link to="/AddPayment" className="admin-action">
          <i className="fas fa-money-check-alt"></i>
          <span>Add Payment</span>
        </Link>
        <Link to="/ViewAllPayments" className="admin-action">
          <i className="fas fa-receipt"></i>
          <span>View All Payments</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;