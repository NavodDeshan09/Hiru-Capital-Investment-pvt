import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" />;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        return <Navigate to="/unauthorized" />;
      }
    } catch (error) {
      return <Navigate to="/Login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;