import React from 'react';
import Navbar from '../../components/Navbar';

const CustomerAbout = () => {
  const userRole = 'customer';
  return (
    <div>
    <Navbar userRole={userRole} />
    
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">About</h1>
      <p>Information about the application.</p>
    </div>
    </div>
  );
};

export default CustomerAbout;