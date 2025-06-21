import React from 'react';


import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin dashboard!</p>
      <button onClick={() => navigate('/admin/request-form')}>Create New Request</button>
    </div>
  );
};

export default AdminDashboard;