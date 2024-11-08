import React from 'react';
import Navbar from '../../components/Navbar';
const BusinessReports = () => {
  const userRole = 'business_owner';
  return (
    <div>
    <Navbar userRole={userRole} />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <p>Report of how many people joined your waitlists.</p>
      {/* Add functionality to display reports on waitlist statistics */}
    </div>
    </div>
  );
};

export default BusinessReports;