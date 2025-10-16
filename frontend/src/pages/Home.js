import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/Home.css';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Home = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // Get role (admin/user)

  // All items for admin
  const allItems = [
    { key: 'loan', label: 'Loan', icon: <MonetizationOnIcon />, path: '/AddLoan' },
    { key: 'collection', label: 'My Collection', icon: <CollectionsBookmarkIcon />, path: '/ViewAllLoans' },
    { key: 'payment', label: 'Add Payment', icon: <PaymentIcon />, path: '/AddPayment' },
    { key: 'customers', label: 'Add Customers', icon: <PersonAddIcon />, path: '/AddCustomers' },
    { key: 'paymentsView', label: 'View All Payments', icon: <ReceiptLongIcon />, path: '/ViewAllPayments' },
  ];

  // Filter for normal users
  const userItems = [
    { key: 'customersView', label: 'View All Customers', icon: <PersonAddIcon />, path: '/ViewAllCustomers' },
    { key: 'payment', label: 'Add Payment', icon: <PaymentIcon />, path: '/AddPayment' },
  ];

  const items = userRole === "admin" ? allItems : userItems;

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="Home">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        {items.map(item => (
          <div
            key={item.key}
            className="dashboard-card"
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate(item.path)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigate(item.path); }}
          >
            <div className="card-icon">{item.icon}</div>
            <div className="card-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
