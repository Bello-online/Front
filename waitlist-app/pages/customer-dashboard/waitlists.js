// frontend/pages/customer-dashboard/waitlists.js
import React from 'react';
import CustomerWaitlistList from '../../components/CustomerWaitlistList';
import Navbar from '../../components/Navbar';
const CustomerWaitlists = () => {
  const userRole = 'customer';
  return (
    <div>
    <Navbar userRole={userRole} />
    <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold">Your Waitlists</h1>
            <p>List of waitlists you can join or leave.</p>
      <CustomerWaitlistList />
    </div>
    </div>
  );
};

export default CustomerWaitlists;
