import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import trustLogo from '../assets/trust-logo.svg';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New parcel assigned to Rider #123", time: "5m ago" },
    { id: 2, message: "Cash collected for Way #456", time: "10m ago" },
    { id: 3, message: "Address issue reported for parcel #789", time: "15m ago" }
  ]);

  const stats = [
    { title: 'Total Parcels', value: '156', change: '+12%' },
    { title: 'Active Riders', value: '24', change: '+3%' },
    { title: 'Today\'s Deliveries', value: '45', change: '+8%' },
    { title: 'Pending Payments', value: '₮125,000', change: '-2%' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Logo Section */}
          <div className="flex items-center mb-8">
            <Link to="/dashboard" className="flex items-center">
              <img src={trustLogo} alt="Trust Delivery Logo" className="h-12 w-12" />
              <span className="ml-3 text-xl font-semibold text-purple-800">Trust Delivery</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{notification.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;