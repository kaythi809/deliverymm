// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './LogoutButton'; // Import the LogoutButton
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Trust Delivery Service</h1>
      <ul className="navbar-menu">
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/way-management/create">Create Ways</NavLink></li>
        <li><NavLink to="/online-shops/add">Add Online Shop</NavLink></li>
        <li><NavLink to="/riders/add">Add Rider</NavLink></li>
        <li><NavLink to="/settings/add-user">Add User</NavLink></li>
      </ul>
      <LogoutButton /> {/* Add the LogoutButton here */}
    </nav>
  );
};

export default Navbar;