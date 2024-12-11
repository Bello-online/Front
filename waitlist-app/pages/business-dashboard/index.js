import React from 'react';
import WaitlistForm from '../../components/WaitlistForm';
import WaitlistList from '../../components/WaitlistList';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const BusinessDashboard = () => {
  const userRole = 'business_owner';

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Business Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Waitlist</CardTitle>
              <CardDescription>Add a new waitlist for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <WaitlistForm />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manage Waitlists</CardTitle>
              <CardDescription>View, edit, and delete your current waitlists</CardDescription>
            </CardHeader>
            <CardContent>
              <WaitlistList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;