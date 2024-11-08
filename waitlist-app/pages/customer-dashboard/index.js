import React from 'react';
// import CustomerWaitlistList from '../components/CustomerWaitlistList';
import Navbar from '../../components/Navbar';
const CustomerDashboard = () => {
  const userRole = 'customer';
  return (
    <div>
      <Navbar userRole={userRole} />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
      <p>Welcome to your dashboard! Select an option from the navigation bar above.</p>
    </div>
    </div>
  );
};

export default CustomerDashboard;
