import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/AdminDashboard.css'; // Reusing AdminDashboard.css for consistent styling

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        console.log('Retrieved ID:', id);
        console.log('Retrieved Token:', token);

        if (!id || !token) {
          setError('User ID or token not found. Redirecting to login...');
          setLoading(false);
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const response = await axios.get(`https://hiru-captial-investment-pvt.onrender.com/api/users/user/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('User Profile Response:', response.data);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);

        if (err.response && err.response.status === 404) {
          setError('User profile not found. Please check your account.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setError('Failed to fetch user profile. Please try again later.');
        }

        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard"> {/* Using admin-dashboard class for consistency */}
      <h1>User Dashboard</h1>

      {/* User Profile Section */}
      <div className="admin-profile">
        <h2>User Profile</h2>
        <form className="admin-profile-form" aria-label="User profile (read only)">
          <label>
            Username
            <input type="text" value={user.username || ''} readOnly />
          </label>
          <label>
            Email
            <input type="email" value={user.email || ''} readOnly />
          </label>
          <label>
            Role
            <input type="text" value={user.role || ''} readOnly />
          </label>
        </form>
      </div>

      {/* User Actions Section */}
      <div className="admin-actions">
        <Link to="/ViewAllCustomers" className="admin-action">
          <span>View All Customers</span>
        </Link>
        <Link to="/AddPayment" className="admin-action">
          <span>Add Payment</span>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;