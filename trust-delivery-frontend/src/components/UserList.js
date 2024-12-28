// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaLock, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/UserList.css';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: true
  });

  // Role options based on PostgreSQL enum from schema
  const roleOptions = [
    'Administrator',
    'admin',
    'shop_owner',
    'rider',
    'customer',
    'user',
    'manager'
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token) {
        navigate('/login');
        return;
      }

      if (!['Administrator', 'admin'].includes(userRole)) {
        toast.error('Unauthorized access');
        navigate('/dashboard');
        return;
      }

      await fetchUsers();
    };

    checkAuth();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        const mappedUsers = response.data.data.users.map(user => ({
          ...user,
          status: Boolean(user.status),
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
      navigate('/login');
    } else if (error.response?.status === 403) {
      toast.error('Unauthorized access');
      navigate('/dashboard');
    } else {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    setError(error.response?.data?.message || 'An error occurred');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userData = {
        ...newUser,
        failedLoginAttempts: 0,
        accountLocked: false
      };

      const response = await axios.post(
        'http://localhost:5000/api/users',
        userData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('User added successfully');
        resetForm();
        fetchUsers();
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/users/${selectedUser.id}`,
        selectedUser,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('User updated successfully');
        setShowEditForm(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleLockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        toast.error('User not found');
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/toggle-lock`,
        {
          accountLocked: !user.accountLocked // Toggle the lock status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.status === 'success') {
        toast.success(`User ${user.accountLocked ? 'unlocked' : 'locked'} successfully`);
        fetchUsers(); // Refresh the user list
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status === 'success') {
          toast.success('User deleted successfully');
          fetchUsers();
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: 'user',
      status: true
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list-container">
      <ToastContainer />
      <h2>User Management</h2>
      
      <button 
        className="add-user-btn"
        onClick={() => setShowAddForm(true)}
      >
        Add New User
      </button>

      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <div className="form-actions">
                <button type="submit">Add User</button>
                <button type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status ? 'Active' : 'Inactive'}</td>
              <td>{user.lastLogin}</td>
              <td className="action-buttons">
                <FaEye onClick={() => setSelectedUser(user)} title="View" />
                <FaLock onClick={() => handleLockUser(user.id)} title="Lock/Unlock" />
                <FaTimes onClick={() => handleDeleteUser(user.id)} title="Delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;