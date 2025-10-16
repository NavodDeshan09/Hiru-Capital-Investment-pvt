import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import './../css/Register.css'; // Correct path to Register.css
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Register = () => {
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // State to handle form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nic: '',
    role: 'user', // Default role
  });

  // State for success and error messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Send a POST request to the backend
      const response = await axios.post('https://hiru-captial-investment.onrender.com/api/users/register', formData);

      // Display success message if registration is successful
      setMessage(response.data.message);

      // Show success alert
      alert('Registration successful!');

      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/admin-dashboard'); // Redirect to admin dashboard
      } else {
        navigate('/user-dashboard'); // Redirect to user dashboard
      }
    } catch (err) {
      // Display error message if registration fails
      setError(err.response?.data?.message || 'An error occurred');

      // Show error alert
      alert('Registration failed: ' + (err.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <div className="Register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
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
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
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
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>

      {/* Success message */}
      {message && <p className="success">{message}</p>}

      {/* Error message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;
