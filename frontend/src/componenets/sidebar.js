import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './../css/Sidebar.css';

// Material UI icons
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const userRole = localStorage.getItem("role"); // "admin" or "user"

  // Sidebar toggle (for mobile)
  useEffect(() => {
    if (open) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [open]);

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) setOpen(false);
  };

  // Admin menu
  const adminMenu = [
    { label: 'Home', icon: <HomeIcon />, path: '/Home' },
    { label: 'Loan', icon: <MonetizationOnIcon />, path: '/AddLoan' },
    { label: 'My Collection', icon: <CollectionsBookmarkIcon />, path: '/ViewAllLoans' },
    { label: 'Payment', icon: <PaymentIcon />, path: '/AddPayment' },
    { label: 'Add Customers', icon: <PersonAddIcon />, path: '/AddCustomers' },
    { label: 'View All Payments', icon: <ReceiptLongIcon />, path: '/ViewAllPayments' },
  ];

  // Normal user menu (Home + View All Customers + Add Payment)
  const userMenu = [
    { label: 'Home', icon: <HomeIcon />, path: '/Home' },
    { label: 'View All Customers', icon: <PersonAddIcon />, path: '/ViewAllCustomers' },
    { label: 'Add Payment', icon: <PaymentIcon />, path: '/AddPayment' },
  ];

  // Select menu based on role
  const menuItems = userRole === 'admin' ? adminMenu : userMenu;

  return (
    <nav className={`sidebar-nav ${open ? 'open' : 'collapsed'}`}>
      {/* Brand Section */}
      <div className="navbar-brand">
        <button
          className="sidebar-toggle"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>

        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <img src={logo} alt="Hiru Capital Logo" className="sidebar-logo-img" />
          <span className="navbar-logo-text">Hiru Capital Investment</span>
        </Link>
      </div>

      {/* Sidebar Links */}
      <ul className="sidebar-list">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item" onClick={() => handleNavigate(item.path)}>
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
