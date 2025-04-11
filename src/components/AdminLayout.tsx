import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication tokens or session data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userSession');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="container-fluid admin-layout">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 sidebar" aria-label="Admin Navigation">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  to="/products"
                >
                  Product Management
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  to="/orders"
                >
                  Order Management
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  to="/customers"
                >
                  Customer Management
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  to="/bulk-orders"
                >
                  Bulk Orders
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="logout-section">
            <button className="btn btn-danger w-100" onClick={handleLogout} aria-label="Logout">
              Logout
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 col-lg-10 main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
