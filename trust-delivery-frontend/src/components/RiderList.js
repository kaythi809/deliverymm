// src/components/RiderList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';
import { FaEye, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const RiderList = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTownship, setFilterTownship] = useState('');
  const [townships, setTownships] = useState(new Set());

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/riders/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.status === 'success') {
        const ridersData = response.data.data.riders;
        setRiders(ridersData);
        
        // Extract unique townships
        const uniqueTownships = new Set(ridersData.map(rider => rider.township));
        setTownships(uniqueTownships);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
      setError(error.response?.data?.message || 'Failed to fetch riders');
      toast.error('Failed to fetch riders');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (riderId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus === 'active' ? 'deactivate' : 'activate'} this rider?`)) {
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/riders/${riderId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 'success') {
        setRiders(riders.map(rider => {
          if (rider.id === riderId) {
            return {
              ...rider,
              status: currentStatus === 'active' ? 'inactive' : 'active'
            };
          }
          return rider;
        }));
        
        toast.success('Rider status updated successfully');
      }
    } catch (error) {
      console.error('Error toggling rider status:', error);
      toast.error(error.response?.data?.message || 'Failed to update rider status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = 
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phoneNumber.includes(searchTerm) ||
      rider.nrc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.userData?.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || rider.status === filterStatus;
    const matchesTownship = !filterTownship || rider.township === filterTownship;
    
    return matchesSearch && matchesStatus && matchesTownship;
  });

  const csvData = filteredRiders.map(rider => ({
    'Username': rider.userData?.username,
    'Email': rider.userData?.email,
    'Name': rider.name,
    'Phone Number': rider.phoneNumber,
    'Township': rider.township,
    'Full Address': rider.fullAddress,
    'NRC': rider.nrc,
    'Joined Date': formatDate(rider.joinedDate),
    'Emergency Contact': rider.emergencyContact,
    'Vehicle Type': rider.vehicleType,
    'Status': rider.status,
    'Created At': formatDate(rider.createdAt),
    'Updated At': formatDate(rider.updatedAt)
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <h3 className="text-lg font-semibold">Error loading riders</h3>
        <p>{error}</p>
        <button 
          onClick={() => fetchRiders()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Rider Management</h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, phone, NRC, or username..."
            className="px-4 py-2 border rounded-md flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="px-4 py-2 border rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select
            className="px-4 py-2 border rounded-md"
            value={filterTownship}
            onChange={(e) => setFilterTownship(e.target.value)}
          >
            <option value="">All Townships</option>
            {Array.from(townships).map(township => (
              <option key={township} value={township}>
                {township}
              </option>
            ))}
          </select>

          <CSVLink
            data={csvData}
            filename={`riders-report-${new Date().toISOString().split('T')[0]}.csv`}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Export CSV
          </CSVLink>

          <Link
            to="/riders/new"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add New Rider
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rider Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRiders.map((rider) => (
              <tr key={rider.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {rider.photo && (
                      <img
                        className="h-10 w-10 rounded-full mr-3"
                        src={rider.photo}
                        alt={rider.name}
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{rider.name}</div>
                      <div className="text-sm text-gray-500">{rider.nrc}</div>
                      <div className="text-xs text-gray-400">
                        Joined: {formatDate(rider.joinedDate)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{rider.userData?.username}</div>
                  <div className="text-sm text-gray-500">{rider.userData?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{rider.phoneNumber}</div>
                  <div className="text-sm text-gray-500">{rider.emergencyContact}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{rider.township}</div>
                  <div className="text-sm text-gray-500">{rider.fullAddress}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rider.vehicleType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rider.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {rider.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`/riders/${rider.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      to={`/riders/${rider.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(rider.id, rider.status)}
                      className={`${
                        rider.status === 'active' 
                          ? 'text-green-600 hover:text-green-900' 
                          : 'text-red-600 hover:text-red-900'
                      }`}
                      title={`${rider.status === 'active' ? 'Deactivate' : 'Activate'} Rider`}
                    >
                      {rider.status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
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