// CustomerManagement.tsx
import React, { useState } from 'react';
import './CustomerManagement.css'
interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastPurchase?: string;
  totalSpent: number;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      joinDate: '2024-01-15',
      lastPurchase: '2024-01-20',
      totalSpent: 1234.56
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'inactive',
      joinDate: '2024-01-10',
      lastPurchase: '2024-01-15',
      totalSpent: 890.32
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customer-management">
      <div className="header">
        <h1>Customer Management</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-button">Add Customer</button>
        </div>
      </div>

      <div className="customer-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Last Purchase</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>
                  <span className={`status-badge ${customer.status}`}>
                    {customer.status}
                  </span>
                </td>
                <td>{customer.joinDate}</td>
                <td>{customer.lastPurchase}</td>
                <td>${customer.totalSpent.toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => console.log('Edit', customer.id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCustomer(customer.id)}>
                      Delete
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

export default CustomerManagement;