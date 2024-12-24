// trust-delivery-frontend/src/components/AddOnlineShop.js
import React, { useState } from 'react';
import axios from 'axios';

const AddOnlineShop = () => {
  const [formData, setFormData] = useState({
    osName: '',
    phoneNumber: '',
    address: '',
    accountId: '',
    email: '',
    township: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/online-shops/add', formData);
      alert('Online shop added successfully');
    } catch (error) {
      alert('Error adding online shop');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Online Shop</h2>
      <input type="text" name="osName" placeholder="Online Shop Name" onChange={handleChange} required />
      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
      <input type="text" name="accountId" placeholder="Account ID" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
      <select name="township" onChange={handleChange} required>
        <option value="">Select Township</option>
        {/* Add township options here */}
      </select>
      <button type="submit">Add Online Shop</button>
    </form>
  );
};

export default AddOnlineShop;