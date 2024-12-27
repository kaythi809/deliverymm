import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiEye, FiTrash2, FiX } from 'react-icons/fi';

// Changed to arrow function component declaration
const OnlineShopsList = () => {
  // Declare navigate hook at the top of the component
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchShops = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/online-shops', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShops(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching online shops');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleDelete = async (shopId) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/online-shops/${shopId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShops(shops.filter(shop => shop.id !== shopId));
      setShowDeleteModal(false);
      setSelectedShop(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting shop');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    Object.values({
      osName: shop.osName || '',
      phoneNumber: shop.phoneNumber || '',
      email: shop.email || '',
      township: shop.township || ''
    }).some(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEscapeKey = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowDeleteModal(false);
      setShowDetailsModal(false);
      setSelectedShop(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" 
         onClick={() => setShowDeleteModal(false)}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
           onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Shop</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete {selectedShop?.osName}? This action cannot be undone.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={() => handleDelete(selectedShop.id)}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2 disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedShop(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ShopDetailsModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
         onClick={() => setShowDetailsModal(false)}>
      <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white"
           onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-900">{selectedShop?.osName}</h3>
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedShop(null);
              }}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <p className="text-sm text-gray-600">Phone: {selectedShop?.phoneNumber}</p>
              <p className="text-sm text-gray-600">Email: {selectedShop?.email}</p>
              <p className="text-sm text-gray-600">Township: {selectedShop?.township}</p>
              <p className="text-sm text-gray-600">Address: {selectedShop?.address}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Payment Methods</h4>
              {selectedShop?.paymentMethods?.map((method, index) => (
                <p key={index} className="text-sm text-gray-600">{method}</p>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-900">Bank Information</h4>
            {selectedShop?.bankAccounts?.map((account, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm text-gray-600">
                  Bank Name: {account.bankName}<br />
                  Account Name: {account.accountName}<br />
                  Account Number: {account.accountNumber}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md m-4">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {showDeleteModal && <DeleteConfirmationModal />}
      {showDetailsModal && <ShopDetailsModal />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Online Shops</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Link
            to="/online-shops/add"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Add New Shop
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{shop.osName}</div>
                    <div className="text-sm text-gray-500">ID: {shop.accountId || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{shop.phoneNumber}</div>
                    <div className="text-sm text-gray-500">{shop.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{shop.township}</div>
                    <div className="text-sm text-gray-500">{shop.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      shop.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {shop.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedShop(shop);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label="View details"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/online-shops/${shop.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-900"
                        aria-label="Edit shop"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedShop(shop);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete shop"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No shops found matching your search.' : 'No online shops added yet.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineShopsList;