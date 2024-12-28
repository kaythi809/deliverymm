// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import existing components
import Dashboard from './components/Dashboard';
import CreateWays from './components/CreateWays';
import ParcelInOut from './components/ParcelInOut';
import OnlineShopsList from './components/OnlineShopsList';
import AddOnlineShop from './components/AddOnlineShop';
import AddRider from './components/AddRider';
import Settings from './components/Settings';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AddUser from './components/AddUser';
import LanguageProvider from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserList from './components/UserList';
import RiderList from './components/RiderList';
import RiderDetail from './components/RiderDetail';
import EditRider from './components/EditRider'; // You'll need to create this component

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator' || user?.role === 'admin';
  
  return isAdmin ? (
    <PrivateRoute>{children}</PrivateRoute>
  ) : (
    <Navigate to="/dashboard" replace />
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
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Way Management Routes */}
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

              {/* Online Shops Routes */}
              <Route
                path="/online-shops"
                element={
                  <PrivateRoute>
                    <OnlineShopsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/online-shops/add"
                element={
                  <AdminRoute>
                    <AddOnlineShop />
                  </AdminRoute>
                }
              />

              {/* Rider Routes */}
              <Route
                path="/riders"
                element={
                  <PrivateRoute>
                    <RiderList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/riders/add"
                element={
                  <AdminRoute>
                    <AddRider />
                  </AdminRoute>
                }
              />
              <Route
                path="/riders/:id"
                element={
                  <PrivateRoute>
                    <RiderDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/riders/:id/edit"
                element={
                  <AdminRoute>
                    <EditRider />
                  </AdminRoute>
                }
              />

              {/* Settings Routes */}
              <Route
                path="/settings"
                element={
                  <AdminRoute>
                    <Settings />
                  </AdminRoute>
                }
              />
              <Route
                path="/settings/users"
                element={
                  <AdminRoute>
                    <UserList />
                  </AdminRoute>
                }
              />
              <Route
                path="/settings/users/add"
                element={
                  <AdminRoute>
                    <AddUser />
                  </AdminRoute>
                }
              />

              {/* Catch all route for 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Toast Container */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;