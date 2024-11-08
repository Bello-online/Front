import React from 'react';
import Navbar from '../../components/Navbar';
const CustomerHistory = () => {
  const userRole = 'customer'
  return (
    <div>
    <Navbar userRole={userRole} />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Your History</h1>
      <p>List of waitlists you have joined previously.</p>
      {/* Add functionality to show previously joined waitlists */}
    </div>
    </div>
  );
};

export default CustomerHistory;