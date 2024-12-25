// trust-delivery-frontend/src/components/OnlineShopsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OnlineShopsList = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      const response = await axios.get('http://localhost:5000/api/online-shops');
      setShops(response.data);
    };
    fetchShops();
  }, []);

  return (
    <div>
      <h2>Online Shops List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Online Shop ID</th>
            <th>Number of Deliveries</th>
            <th>Active Status</th>
          </tr>
        </thead>
        <tbody>
          {shops.map(shop => (
            <tr key={shop.id}>
              <td>{shop.name}</td>
              <td>{shop.phone}</td>
              <td>{shop.id}</td>
              <td>{shop.deliveryCount}</td>
              <td>{shop.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnlineShopsList;