// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaLock, FaTimes } from 'react-icons/fa';
import '../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

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
        setUsers(response.data.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Error fetching users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/users',
        newUser,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setShowAddForm(false);
        setNewUser({
          username: '',
          email: '',
          password: '',
          role: 'user',
          status: true
        });
        fetchUsers();
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.response?.data?.message || 'Error adding user');
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/users/${userId}/toggle-status`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchUsers();
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(err.response?.data?.message || 'Error toggling status');
    }
  };

  const handleUpdatePassword = async (userId) => {
    try {
      if (!newPassword) {
        setPasswordError('Password is required');
        return;
      }

      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/users/${userId}/update-password`,
        { password: newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setShowPasswordModal(false);
      setNewPassword('');
      setPasswordError('');
      alert('Password updated successfully');
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError(err.response?.data?.message || 'Error updating password');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  // Profile Modal Component
  const ProfileModal = ({ user, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>User Profile</h2>
          <button onClick={onClose} className="close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <label>Username:</label>
            <span>{user.username}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <label>Role:</label>
            <span className="role-badge">{user.role}</span>
          </div>
          <div className="profile-field">
            <label>Status:</label>
            <span className={`status-badge ${user.status ? 'active' : 'inactive'}`}>
              {user.status ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="profile-field">
            <label>Created:</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="modal-actions">
          <button 
            onClick={() => {
              setShowPasswordModal(true);
              setShowProfileModal(false);
            }} 
            className="password-btn"
          >
            <FaLock /> Update Password
          </button>
        </div>
      </div>
    </div>
  );

  // Password Modal Component
  const PasswordModal = ({ userId, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Password</h2>
          <button onClick={onClose} className="close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="password-form">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </div>
        <div className="modal-actions">
          <button onClick={() => handleUpdatePassword(userId)} className="update-btn">
            Update Password
          </button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-list-container">
      <div className="header">
        <h2>User List</h2>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-user-form" onSubmit={handleAddUser}>
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
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className="role-badge">{user.role}</span>
              </td>
              <td>
                <span className={`status-badge ${user.status ? 'active' : 'inactive'}`}>
                  {user.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="action-buttons">
                <button
                  onClick={() => handleViewProfile(user)}
                  className="view-btn"
                  title="View Profile"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  className={`status-toggle-btn ${user.status ? 'deactivate' : 'activate'}`}
                >
                  {user.status ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showProfileModal && selectedUser && (
        <ProfileModal 
          user={selectedUser} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}

      {showPasswordModal && selectedUser && (
        <PasswordModal 
          userId={selectedUser.id} 
          onClose={() => {
            setShowPasswordModal(false);
            setNewPassword('');
            setPasswordError('');
          }} 
        />
      )}
    </div>
  );
};

export default UserList;