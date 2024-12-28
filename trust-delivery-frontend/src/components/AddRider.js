// frontend/src/components/AddRider.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddRider.css';

const AddRider = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    township: '',
    fullAddress: '',
    email: '',
    password: '',
    nrc: '',
    joinedDate: '',
    emergencyContact: '',
    vehicleType: '',
    photo: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const townships = [
    'Yangon',
    'Mandalay',
    'Naypyidaw',
    // Add more townships as needed
  ];

  const vehicleTypes = [
    'Motorcycle',
    'Bicycle',
    'Car',
    // Add more vehicle types as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/riders',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setSuccess('Rider added successfully');
        // Reset form
        setFormData({
          name: '',
          phoneNumber: '',
          township: '',
          fullAddress: '',
          email: '',
          password: '',
          nrc: '',
          joinedDate: '',
          emergencyContact: '',
          vehicleType: '',
          photo: '',
          status: 'active'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding rider');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-rider-container">
      <h2>Add New Rider</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="rider-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Township *</label>
          <select
            name="township"
            value={formData.township}
            onChange={handleChange}
            required
          >
            <option value="">Select Township</option>
            {townships.map(township => (
              <option key={township} value={township}>
                {township}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Full Address *</label>
          <textarea
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>NRC</label>
          <input
            type="text"
            name="nrc"
            value={formData.nrc}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Joined Date</label>
          <input
            type="date"
            name="joinedDate"
            value={formData.joinedDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Emergency Contact</label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Adding Rider...' : 'Add Rider'}
        </button>
      </form>
    </div>
  );
};

export default AddRider;