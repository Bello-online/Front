import React from 'react';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const CustomerAbout = () => {
  const userRole = 'customer';
  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">About WaitlistApp</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to WaitlistApp</CardTitle>
            <CardDescription>Your go-to solution for efficient queue management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              WaitlistApp is designed to streamline your waiting experience. Whether you're visiting a restaurant, 
              a doctor's office, or any service provider, our app helps you manage your time effectively.
            </p>
            <h2 className="text-2xl font-semibold mb-2">Key Features:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Join waitlists remotely</li>
              <li>Receive real-time updates on your position</li>
              <li>View estimated wait times</li>
              <li>Easily cancel or modify your spot in line</li>
              <li>Participate in events and appointments</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerAbout;