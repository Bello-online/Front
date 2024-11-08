import WaitlistForm from '../../components/WaitlistForm';
import WaitlistList from '../../components/WaitlistList';
import React from 'react';
import Navbar from '../../components/Navbar';

const BusinessDashboard = () => {
  const userRole = 'business_owner';

  return (
    <div>
    <Navbar userRole={userRole} />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>

      <div className="mb-6">
        <WaitlistForm /> {/* Only business owners can create waitlists */}
      </div>

      <div>
        <WaitlistList /> {/* Business owners can edit and delete waitlists */}
      </div>
    </div>
    </div>
  );
};

export default BusinessDashboard;
