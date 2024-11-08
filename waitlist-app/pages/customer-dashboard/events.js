import React from 'react';
import Navbar from '../../components/Navbar';
const CustomerEvents = () => {
  const userRole = 'customer';
  return (
    <div>
    <Navbar userRole={userRole} />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Your Events/Appointments</h1>
      <p>List of events and appointments available for you to join.</p>
      {/* Add your events and appointments listing here */}
    </div>
    </div>
  );
};

export default CustomerEvents;