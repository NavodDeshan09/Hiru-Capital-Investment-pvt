import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Home from './pages/Home.js';
import Layout from './pages/Layout.js';
import AddLoan from './pages/AddLoan.js';
import AddCustomers from './pages/AddCustomers.js';
import ViewAllCustomers from './pages/ViweAllCustomers.js';
import ViewAllUsers from './pages/ViewAllUsers.js';
import ViewAllLoans from './pages/ViewAllLoans.js';
import AddPayment from './pages/AddPayment.js';
import ViewAllPayments from './pages/ViewAllPayments.js';
import AdminDashboard from './pages/AdminDashboard.js';
import UserDashboard from './pages/UserDashboard.js';

const router = createBrowserRouter([
  // Public routes (no sidebar)
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },

  // Protected routes inside layout (with sidebar + navbar)
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'Home', element: <Home /> },
      { path: 'AddLoan', element: <AddLoan /> },
      { path: 'AddCustomers', element: <AddCustomers /> },
      { path: 'ViewAllCustomers', element: <ViewAllCustomers /> },
      { path: 'ViewAllUsers', element: <ViewAllUsers /> },
      { path: 'ViewAllLoans', element: <ViewAllLoans /> },
      { path: 'AddPayment', element: <AddPayment /> },
      { path: 'ViewAllPayments', element: <ViewAllPayments /> },
      { path: 'admin-dashboard', element: <AdminDashboard /> },
      { path: 'user-dashboard', element: <UserDashboard /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
