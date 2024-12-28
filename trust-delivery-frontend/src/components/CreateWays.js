// src/components/CreateWays.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // Make sure to import axios

const initialFormState = {
  userId: '', // Will be set from authentication
  pickupAddress: '',
  deliveryAddress: '',
  scheduledTime: '',
  notes: '',
  price: 0,
  paymentMethod: '',
  customerName: '',
  customerPhone: '',
  township: '',
  onlineShopId: ''
};

const CreateWays = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [onlineShops, setOnlineShops] = useState([]);
  const navigate = useNavigate();

  // Fetch online shops when component mounts
  useEffect(() => {
    const fetchOnlineShops = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/online-shops', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOnlineShops(response.data.data || []); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching online shops:', error);
        toast.error('Failed to fetch online shops');
      }
    };

    fetchOnlineShops();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const deliveryData = {
        userId: formData.userId, // This should come from your auth context
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        status: 'pending', // enum_Deliveries_status default
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
        notes: formData.notes,
        price: parseFloat(formData.price),
        paymentStatus: 'pending', // enum_Deliveries_paymentStatus default
        paymentMethod: formData.paymentMethod,
        onlineShopId: formData.onlineShopId
      };

     const response = await axios.post('http://localhost:5000/api/deliveries', deliveryData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
      
      if (response.data) {
        toast.success('Delivery created successfully');
        setFormData(initialFormState);
        navigate('/deliveries');
      }
    } catch (error) {
      console.error('Delivery creation error:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || 'Error creating delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Create New Delivery</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Online Shop Selection */}
        <div className="mb-4">
          <label className="block mb-2">Online Shop</label>
          <select
            name="onlineShopId"
            value={formData.onlineShopId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Online Shop</option>
            {onlineShops.map(shop => (
              <option key={shop.id} value={shop.id}>
                {shop.osName} - {shop.township}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Information */}
        <div className="mb-4">
          <label className="block mb-2">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Customer Phone</label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Township</label>
          <input
            type="text"
            name="township"
            value={formData.township}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <label className="block mb-2">Delivery Address</label>
          <textarea
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        {/* Pickup Address */}
        <div className="mb-4">
          <label className="block mb-2">Pickup Address</label>
          <textarea
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        {/* Scheduled Time */}
        <div className="mb-4">
          <label className="block mb-2">Scheduled Time</label>
          <input
            type="datetime-local"
            name="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block mb-2">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Delivery'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWays;