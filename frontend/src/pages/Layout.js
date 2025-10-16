import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './Navigationbar';
import Sidebar from '../componenets/sidebar';
import './../css/Layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main-container">
        <NavigationBar />
        <main className="layout-main" >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
