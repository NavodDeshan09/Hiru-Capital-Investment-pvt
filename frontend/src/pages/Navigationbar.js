import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import './../css/NavigationBar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState(null); // Track user role
  const navigate = useNavigate(); // For programmatic navigation

  // Function to check user role and navigate to appropriate dashboard
  const handleProfileClick = () => {
    const storedRole = localStorage.getItem('role');
    
    if (storedRole === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      
      // Also update user role when storage changes
      const storedRole = localStorage.getItem('role');
      setUserRole(storedRole || null);
    };

    // Check initial role on mount
    const initialRole = localStorage.getItem('role');
    if (initialRole) {
      setUserRole(initialRole);
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* <Link to="/" className="navbar-logo">
          Hiru Capital Investment
        </Link> */}
      </div>
      <ul className="navbar-links">
        {isLoggedIn ? (
          // Show profile icon + Logout button if the user is logged in
          <>
            <li>
              <button 
                className="profile-link" 
                onClick={handleProfileClick}
                title="Profile"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <AccountCircleIcon />
              </button>
            </li>
            <li>
              <button className="navbar-link logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          // Show only Login and Register links if the user is not logged in
          <>
            <li>
              <Link to="/" className="navbar-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;