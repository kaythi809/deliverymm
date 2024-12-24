import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file for styling
import trustLogo from '../assets/trust-logo.svg'; // Import the logo

const Sidebar = () => {
  const [isWayManagementOpen, setIsWayManagementOpen] = useState(false);
  const [isOnlineShopsOpen, setIsOnlineShopsOpen] = useState(false);
  const [isRidersOpen, setIsRidersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleWayManagement = () => setIsWayManagementOpen(!isWayManagementOpen);
  const toggleOnlineShops = () => setIsOnlineShopsOpen(!isOnlineShopsOpen);
  const toggleRiders = () => setIsRidersOpen(!isRidersOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('token'); // Remove JWT token
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-container mb-4">
        <NavLink to="/dashboard">
          <img src={trustLogo} alt="Trust Delivery Logo" className="logo" />
        </NavLink>
      </div>
      <ul className="sidebar-menu">
        <li>
          <button className="menu-button" onClick={toggleWayManagement}>Way Management</button>
          {isWayManagementOpen && (
            <ul className="submenu">
              <li><NavLink to="/way-management/create">Create Ways</NavLink></li>
              <li><NavLink to="/way-management/parcel-in-out">Parcel In/Out</NavLink></li>
            </ul>
          )}
        </li>
        <li>
          <button className="menu-button" onClick={toggleOnlineShops}>Online Shops</button>
          {isOnlineShopsOpen && (
            <ul className="submenu">
              <li><NavLink to="/online-shops/add">Add Online Shops</NavLink></li>
              <li><NavLink to="/online-shops/list">Online Shops List</NavLink></li>
              <li><NavLink to="/online-shops/financial-center">Financial Center </NavLink></li>
              <li><NavLink to="/online-shops/receipts">Receipts</NavLink></li>
            </ul>
          )}
        </li>
        <li>
          <button className="menu-button" onClick={toggleRiders}>Riders</button>
          {isRidersOpen && (
            <ul className="submenu">
              <li><NavLink to="/riders/add">Add Riders</NavLink></li>
              <li><NavLink to="/riders/list">Rider Lists</NavLink></li>
              <li><NavLink to="/riders/financial">Financial for Rider</NavLink></li>
            </ul>
          )}
        </li>
        <li>
          <button className="menu-button" onClick={toggleSettings}>Settings</button>
          {isSettingsOpen && (
            <ul className="submenu">
              <li><NavLink to="/settings/add-user">Add Users</NavLink></li>
              <li><NavLink to="/settings/user-list">User Lists</NavLink></li>
            </ul>
          )}
        </li>
        <li>
          <button 
            onClick={handleLogout} 
            className="menu-button logout-button"
          >
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;