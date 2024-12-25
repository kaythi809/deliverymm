// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Administrator',
    status: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/users/add',
        { ...formData }, // No need to convert status
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error);
      alert(error.response?.data?.message || 'Error adding user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add User</h2>
      <input
        type="text"
        name="username"
        placeholder="Full Name"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="Administrator">Administrator</option>
        <option value="Rider">Rider</option>
      </select>
      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default AddUser;