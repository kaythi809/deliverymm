// src/components/riders/RiderDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CSVLink } from 'react-csv';

const RiderDetail = () => {
  const { id } = useParams();
  const [rider, setRider] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchRiderDetails();
    fetchRiderDeliveries();
  }, [id]);

  const fetchRiderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/riders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRider(response.data.data.rider);
    } catch (error) {
      console.error('Error fetching rider details:', error);
    }
  };

  const fetchRiderDeliveries = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/riders/${id}/deliveries`, {
        params: dateFilter,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDeliveries(response.data.data.deliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  };

  return (
    <div className="p-6">
      {rider && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Rider Details: {rider.name}</h2>
            <CSVLink
              data={deliveries}
              filename={`rider-${rider.id}-deliveries.csv`}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Export Deliveries
            </CSVLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Phone:</span> {rider.phoneNumber}</p>
                <p><span className="font-medium">Status:</span> {rider.status}</p>
                <p><span className="font-medium">Current Cash on Hand:</span> {rider.cashOnHand}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Delivery Statistics</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Assigned:</span> {rider.assignedCount}</p>
                <p><span className="font-medium">On the Way:</span> {rider.onTheWayCount}</p>
                <p><span className="font-medium">Successful:</span> {rider.successCount}</p>
                <p><span className="font-medium">Cancelled:</span> {rider.cancelledCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Delivery History</h3>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                  className="border rounded-md px-3 py-2"
                />
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                  className="border rounded-md px-3 py-2"
                />
                <button
                  onClick={fetchRiderDeliveries}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Filter
                </button>
              </div>
            </div>

            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Way ID</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Amount Collected</th>
                  <th className="px-6 py-3 text-right">Amount Transferred</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b">
                    <td className="px-6 py-4">{delivery.wayId}</td>
                    <td className="px-6 py-4">{delivery.status}</td>
                    <td className="px-6 py-4 text-right">{delivery.amountCollected}</td>
                    <td className="px-6 py-4 text-right">{delivery.amountTransferred}</td>
                    <td className="px-6 py-4">{new Date(delivery.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RiderDetail;