// OrderManagement.tsx
import React, { useState } from 'react';
import './OrderManagement.css'
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

const OrderManagement: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      items: [
        { id: '1', name: 'Product 1', quantity: 2, price: 29.99 }
      ],
      total: 59.98,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      items: [
        { id: '2', name: 'Product 2', quantity: 1, price: 49.99 }
      ],
      total: 49.99,
      status: 'completed',
      date: '2024-01-16'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="order-management">
      <div className="header">
        <h1>Order Management</h1>
        <div className="filters">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="export-button">Export Orders</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{orders.filter(order => order.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Orders</h3>
          <p>{orders.filter(order => order.status === 'completed').length}</p>
        </div>
        <div className="stat-card">
          <h3>Cancelled Orders</h3>
          <p>{orders.filter(order => order.status === 'cancelled').length}</p>
        </div>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Date</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => console.log('View', order.id)}>
                      View
                    </button>
                    <button onClick={() => console.log('Edit', order.id)}>
                      Edit
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

export default OrderManagement;