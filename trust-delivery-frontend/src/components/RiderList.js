// src/components/riders/RiderList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';

const RiderList = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/riders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRiders(response.data.data.riders);
    } catch (error) {
      console.error('Error fetching riders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rider List</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CSVLink
            data={filteredRiders}
            filename="riders-report.csv"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Cash on Hand</th>
              <th className="px-6 py-3 text-center">Active Delivery</th>
              <th className="px-6 py-3 text-center">Active Return</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider) => (
              <tr key={rider.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{rider.name}</td>
                <td className="px-6 py-4">{rider.phoneNumber}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    rider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {rider.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">{rider.cashOnHand}</td>
                <td className="px-6 py-4 text-center">{rider.activeDeliveries}</td>
                <td className="px-6 py-4 text-center">{rider.activeReturns}</td>
                <td className="px-6 py-4 text-center">
                  <Link
                    to={`/riders/${rider.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiderList;