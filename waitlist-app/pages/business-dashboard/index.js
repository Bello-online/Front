import React from 'react';
import WaitlistForm from '../../components/WaitlistForm';
import WaitlistList from '../../components/WaitlistList';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { Bell, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BusinessDashboard = () => {
  const userRole = 'business_owner';

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} userId={localStorage.getItem("userId")} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Business Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Waitlists</CardTitle>
              <CardDescription>View and manage your waitlists</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/business-dashboard/waitlists">View Waitlists</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Manage your events and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/business-dashboard/events">View Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View your notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/business-dashboard/notifications">View Notifications</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;