import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import trustLogo from '../assets/trust-logo.svg';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
// Import icons
import { FaTruck, FaStore, FaMotorcycle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';

const Sidebar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { logout } = useAuth();
  
  const [isWayManagementOpen, setIsWayManagementOpen] = useState(false);
  const [isOnlineShopsOpen, setIsOnlineShopsOpen] = useState(false);
  const [isRidersOpen, setIsRidersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleWayManagement = () => setIsWayManagementOpen(!isWayManagementOpen);
  const toggleOnlineShops = () => setIsOnlineShopsOpen(!isOnlineShopsOpen);
  const toggleRiders = () => setIsRidersOpen(!isRidersOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const menuItems = [
    {
      title: 'Way Management',
      icon: <FaTruck />,
      isOpen: isWayManagementOpen,
      toggle: toggleWayManagement,
      submenu: [
        { path: '/way-management/create', label: 'Create Ways' },
        { path: '/way-management/parcel-in-out', label: 'Parcel In/Out' }
      ]
    },
    {
      title: 'Online Shops',
      icon: <FaStore />,
      isOpen: isOnlineShopsOpen,
      toggle: toggleOnlineShops,
      submenu: [
        { path: '/online-shops/add', label: 'Add Online Shops' },
        { path: '/online-shops/list', label: 'Online Shops List' },
        { path: '/online-shops/financial-center', label: 'Financial Center' },
        { path: '/online-shops/receipts', label: 'Receipts' }
      ]
    },
    {
      title: 'Riders',
      icon: <FaMotorcycle />,
      isOpen: isRidersOpen,
      toggle: toggleRiders,
      submenu: [
        { path: '/riders/add', label: 'Add Riders' },
        { path: '/riders/list', label: 'Rider Lists' },
        { path: '/riders/financial', label: 'Financial for Rider' }
      ]
    },
    {
      title: 'Settings',
      icon: <FaCog />,
      isOpen: isSettingsOpen,
      toggle: toggleSettings,
      submenu: [
        { path: '/settings/add-user', label: 'Add Users' },
        { path: '/settings/user-list', label: 'User Lists' }
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <NavLink to="/dashboard">
          <img src={trustLogo} alt="Trust Delivery Logo" className="logo" />
        </NavLink>
        <button
          onClick={toggleLanguage}
          className="language-toggle"
        >
          {language.toUpperCase()}
        </button>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button className="menu-button" onClick={item.toggle}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{t(item.title)}</span>
              <span className="menu-arrow">
                {item.isOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
              </span>
            </button>
            {item.isOpen && (
              <ul className="submenu">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <NavLink to={subItem.path}>
                      {t(subItem.label)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li>
          <button 
            onClick={handleLogout} 
            className="menu-button logout-button"
          >
            <span className="menu-icon"><FaSignOutAlt /></span>
            <span className="menu-text">{t('Log Out')}</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;