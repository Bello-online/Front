import React from 'react';
import Navbar from '../../components/Navbar';
const BusinessEvents = () => {
  const userRole = 'business_owner';
  return (
    <div>
       <Navbar userRole={userRole} />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Your Events/Appointments</h1>
      <p>View and create events/appointments for customers to join.</p>
      {/* Add functionality for creating and viewing events */}
    </div>
    </div>
  );
};

export default BusinessEvents;