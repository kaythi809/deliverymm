// src/components/OnlineShops/AddOnlineShop.js
import React, { useState } from 'react';
import axios from 'axios';

const AddOnlineShop = () => {
  const [formData, setFormData] = useState({
    osName: '',
    phoneNumber: '',
    email: '',
    address: '',
    accountId: '',
    township: '',
    // Contact Person Section
    contactPerson: {
      name: '',
      address: '',
      mobilePhone: '',
      otherPhone: '',
      email: '',
      comment: ''
    },
    // Payment Section - Now an array to handle multiple bank accounts
    bankAccounts: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingBankIndex, setEditingBankIndex] = useState(null);

  const townships = [
    'Yangon',
    'Mandalay',
    'Naypyidaw',
    // Add more townships as needed
  ];

  const bankOptions = [
    'Aya Bank/Pay',
    'CB Bank',
    'KBZ Bank/Pay',
    'Wave Money'
  ];

  // New state for bank account form
  const [bankAccountForm, setBankAccountForm] = useState({
    bank: '',
    accountName: '',
    accountNumber: '',
    remark: '',
    isAvailable: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBankFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBankAccountForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addBankAccount = () => {
    if (!bankAccountForm.bank || !bankAccountForm.accountName || !bankAccountForm.accountNumber) {
      setError('Please fill in all required bank account fields');
      return;
    }

    setFormData(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, { ...bankAccountForm }]
    }));

    // Reset bank account form
    setBankAccountForm({
      bank: '',
      accountName: '',
      accountNumber: '',
      remark: '',
      isAvailable: true
    });
  };

  const editBankAccount = (index) => {
    setEditingBankIndex(index);
    setBankAccountForm(formData.bankAccounts[index]);
  };

  const updateBankAccount = () => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((account, index) => 
        index === editingBankIndex ? bankAccountForm : account
      )
    }));
    setEditingBankIndex(null);
    setBankAccountForm({
      bank: '',
      accountName: '',
      accountNumber: '',
      remark: '',
      isAvailable: true
    });
  };

  const deleteBankAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/online-shops',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 'success') {
        resetForm();
        alert('Online shop added successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding online shop');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      osName: '',
      phoneNumber: '',
      email: '',
      address: '',
      accountId: '',
      township: '',
      contactPerson: {
        name: '',
        address: '',
        mobilePhone: '',
        otherPhone: '',
        email: '',
        comment: ''
      },
      bankAccounts: []
    });
    setBankAccountForm({
      bank: '',
      accountName: '',
      accountNumber: '',
      remark: '',
      isAvailable: true
    });
    setEditingBankIndex(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Online Shop</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        {/* ... (previous basic information fields remain the same) ... */}
        <h2>Add Online Shop</h2>
      <input type="text" name="osName" placeholder="Online Shop Name" onChange={handleChange} required />
      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
      <input type="text" name="accountId" placeholder="Account ID" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
      <select name="township" onChange={handleChange} required>
        <option value="">Select Township</option>
        <option value="township1">Township 1</option>
  <option value="township2">Township 2</option>
  <option value="township3">Township 3</option>
  <option value="township4">Township 4</option>
      </select>
        {/* Contact Person Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Contact Person Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Person Name *
              </label>
              <input
                type="text"
                name="contact.name"
                value={formData.contactPerson.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Phone *
              </label>
              <input
                type="tel"
                name="contact.mobilePhone"
                value={formData.contactPerson.mobilePhone}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Other Phone
              </label>
              <input
                type="tel"
                name="contact.otherPhone"
                value={formData.contactPerson.otherPhone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="contact.email"
                value={formData.contactPerson.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="contact.address"
                value={formData.contactPerson.address}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Comment
              </label>
              <textarea
                name="contact.comment"
                value={formData.contactPerson.comment}
                onChange={handleChange}
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Bank Accounts</h3>
          
          {/* Bank Account Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank *
              </label>
              <select
                name="bank"
                value={bankAccountForm.bank}
                onChange={handleBankFormChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Bank</option>
                {bankOptions.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Name *
              </label>
              <input
                type="text"
                name="accountName"
                value={bankAccountForm.accountName}
                onChange={handleBankFormChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={bankAccountForm.accountNumber}
                onChange={handleBankFormChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remark
              </label>
              <input
                type="text"
                name="remark"
                value={bankAccountForm.remark}
                onChange={handleBankFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={bankAccountForm.isAvailable}
                onChange={handleBankFormChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Available for payments
              </label>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={editingBankIndex !== null ? updateBankAccount : addBankAccount}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {editingBankIndex !== null ? 'Update Bank Account' : 'Add Bank Account'}
              </button>
            </div>
          </div>

          {/* Bank Accounts List */}
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Added Bank Accounts</h4>
            <div className="space-y-4">
              {formData.bankAccounts.map((account, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{account.bank}</p>
                      <p className="text-sm text-gray-600">Account: {account.accountName}</p>
                      <p className="text-sm text-gray-600">Number: {account.accountNumber}</p>
                      {account.remark && (
                        <p className="text-sm text-gray-500">Remark: {account.remark}</p>
                      )}
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        account.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {account.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => editBankAccount(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBankAccount(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Shop'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOnlineShop; 