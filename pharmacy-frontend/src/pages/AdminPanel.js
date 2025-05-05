// AdminPanel.js (modified to handle URL parameters)
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import '../styles/Admin.css';
import CustomerAnalytics from '../pages/CustomerAnalytics';
import InventoryManagement from '../pages/InventoryManagement';

const AdminPanel = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'inventory' ? 'inventory' : 'analytics');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  useEffect(() => {
    if (tabFromUrl === 'inventory' || tabFromUrl === 'analytics') {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'analytics' ? 'active' : ''} 
          onClick={() => setActiveTab('analytics')}
        >
          Customer Analytics
        </button>
        <button 
          className={activeTab === 'inventory' ? 'active' : ''} 
          onClick={() => setActiveTab('inventory')}
        >
          Inventory Management
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'analytics' && <CustomerAnalytics />}
        {activeTab === 'inventory' && <InventoryManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;