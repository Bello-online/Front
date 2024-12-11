import React from 'react';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const BusinessAbout = () => {
  const userRole = 'business_owner';
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">About Our Application</h1>
        <Card>
          <CardHeader>
            <CardTitle>WaitlistApp</CardTitle>
            <CardDescription>Streamline your business operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              WaitlistApp is a comprehensive solution designed to help businesses manage their waitlists and events efficiently. 
              Our platform provides tools for creating and managing waitlists, scheduling events, and keeping your customers informed.
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
              <li>Easy waitlist creation and management</li>
              <li>Event scheduling and participant tracking</li>
              <li>Real-time updates for your customers</li>
              <li>Intuitive dashboard for business owners</li>
              <li>Customizable notifications</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessAbout;