// trust-delivery-frontend/src/components/AddRider.js
import React, { useState } from 'react';
import axios from 'axios';

const AddRider = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    township: '',
    fullAddress: '',
    email: '',
    password: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/riders/add', formData);
      alert('Rider added successfully');
    } catch (error) {
      alert('Error adding rider');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Rider</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <select name="township" onChange={handleChange} required>
        <option value="">Select Township</option>
        {/* Add township options here */}
      </select>
      <input type="text" name="fullAddress" placeholder="Full Address" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="status" onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button type="submit">Add Rider</button>
    </form>
  );
};

export default AddRider;