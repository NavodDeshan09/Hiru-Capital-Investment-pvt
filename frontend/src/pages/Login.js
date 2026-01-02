import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named import
import './../css/Login.css'; // Correct path to Login.css

const Login = () => {
  // State for form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Use the navigate hook for redirection
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const apiURL = 'http://localhost:5000/api/users/login'; // Adjust this URL to your backend

    try {
      const response = await axios.post(apiURL, {
        email,
        password,
      });

      setMessage('Login successful');
      console.log('Login Response:', response.data);

      // Decode the token to get the user's role
      const token = response.data.token;
      const decoded = jwtDecode(token);

      // Store the token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('id', response.data.user._id);
      localStorage.setItem('role', decoded.role);
     

      // Redirect based on role
      if (decoded.role === 'admin') {
        navigate('/admin-dashboard'); // Redirect to admin dashboard
      } else {
        navigate('/user-dashboard'); // Redirect to user dashboard
      }

    } catch (err) {
      setError('Invalid credentials or server error');
      console.error('Login error:', err.response);
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2>Login</h2>
        <form className="transparent-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="error">{error}</p>}

          {/* Success Message */}
          {message && <p className="success">{message}</p>}

          {/* Submit Button */}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
