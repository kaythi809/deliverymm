// trust-delivery-frontend/src/components/CreateWays.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateWays = () => {
  const [formData, setFormData] = useState({
    onlineShop: '',
    pickupType: '',
    deliveryCount: '',
    pickupDate: '',
    comments: '',
    // Add other fields as necessary
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to create way
      await axios.post('http://localhost:5000/api/ways/create', formData);
      alert('Way created successfully');
    } catch (error) {
      alert('Error creating way');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Way</h2>
      <input type="text" name="onlineShop" placeholder="Online Shop" onChange={handleChange} required />
      <select name="pickupType" onChange={handleChange} required>
        <option value="">Select Pickup Type</option>
        <option value="Merchant">Pickup from Merchant</option>
        <option value="Highway">Pickup from Highway Gates</option>
      </select>
      <input type="number" name="deliveryCount" placeholder="Number of Deliveries" onChange={handleChange} required />
      <input type="date" name="pickupDate" onChange={handleChange} required />
      <textarea name="comments" placeholder="Comments" onChange={handleChange}></textarea>
      <button type="submit">Create Way</button>
    </form>
  );
};

export default CreateWays;