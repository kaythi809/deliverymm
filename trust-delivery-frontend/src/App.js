// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateWays from './components/CreateWays';
import ParcelInOut from './components/ParcelInOut';
import OnlineShopsList from './components/OnlineShopsList';
import AddOnlineShop from './components/AddOnlineShop';
import AddRider from './components/AddRider';
import Settings from './components/Settings';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AddUser from './components/AddUser'; // Import AddUser component
import LanguageProvider from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserList from './components/UserList';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', width: '100%' }}>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/way-management/create"
                element={
                  <PrivateRoute>
                    <CreateWays />
                  </PrivateRoute>
                }
              />
              <Route
                path="/way-management/parcel-in-out"
                element={
                  <PrivateRoute>
                    <ParcelInOut />
                  </PrivateRoute>
                }
              />
              <Route
                path="/online-shops/list"
                element={
                  <PrivateRoute>
                    <OnlineShopsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/online-shops/add"
                element={
                  <PrivateRoute>
                    <AddOnlineShop />
                  </PrivateRoute>
                }
              />
              <Route
                path="/riders/add"
                element={
                  <PrivateRoute>
                    <AddRider />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings/add-user"
                element={
                  <PrivateRoute>
                    <AddUser />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/settings/user-list" 
                element={
                  <PrivateRoute>
                    <UserList />
                  </PrivateRoute>
                } 
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              {/* Catch all route for 404 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;