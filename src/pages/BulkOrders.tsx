import React, { useState } from 'react';
import './BulkOrders.css';

interface BulkOrder {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  expectedDelivery: string;
}

const BulkOrders: React.FC = () => {
  const [bulkOrders] = useState<BulkOrder[]>([
    {
      id: 'BO-001',
      productName: 'Premium Coffee Beans',
      quantity: 1000,
      unitPrice: 12.99,
      totalPrice: 12990,
      status: 'pending',
      expectedDelivery: '2024-04-15'
    },
    {
      id: 'BO-002',
      productName: 'Organic Tea Bags',
      quantity: 5000,
      unitPrice: 0.50,
      totalPrice: 2500,
      status: 'approved',
      expectedDelivery: '2024-04-10'
    },
    // Add more sample orders as needed
  ]);

  return (
    <div className="bulk-orders">
      <div className="bulk-orders-header">
        <h1>Bulk Orders Management</h1>
        <button className="new-order-btn">Place New Bulk Order</button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Bulk Orders</h3>
          <p>24</p>
          <span className="trend positive">↑ 12%</span>
        </div>
        <div className="stat-card">
          <h3>Pending Approval</h3>
          <p>8</p>
          <span className="trend neutral">= 0%</span>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
          <p>$45,890</p>
          <span className="trend positive">↑ 8%</span>
        </div>
        <div className="stat-card">
          <h3>Avg. Processing Time</h3>
          <p>2.5 days</p>
          <span className="trend negative">↓ 5%</span>
        </div>
      </div>

      <div className="bulk-orders-filters">
        <input 
          type="search" 
          placeholder="Search orders..." 
          className="search-input"
        />
        <select className="filter-select">
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select className="filter-select">
          <option value="">Sort By</option>
          <option value="date">Date</option>
          <option value="quantity">Quantity</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div className="bulk-orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Expected Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bulkOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.productName}</td>
                <td>{order.quantity.toLocaleString()}</td>
                <td>${order.unitPrice.toFixed(2)}</td>
                <td>${order.totalPrice.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td>{order.expectedDelivery}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view">View</button>
                    <button className="action-btn edit">Edit</button>
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

export default BulkOrders;
