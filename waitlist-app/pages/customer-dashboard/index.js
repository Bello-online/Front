const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar, Bell, Clock } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios';

const CustomerDashboard = () => {
  const userRole = 'customer';
  const [historyCount, setHistoryCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchJoinedWaitlists = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/waitlists/joined`, {
          params: { userId }
        });
        setHistoryCount(response.data.length);
      } catch (error) {
        console.error('Error fetching history count:', error);
        setHistoryCount(0);
      }
    };

    fetchJoinedWaitlists();
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Customer Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>Manage your waitlists and events from here</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Waitlists</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">You're currently in 3 waitlists</p>
                <Button asChild className="w-full mt-4">
                  <Link href="/customer-dashboard/waitlists">View Waitlists</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">You have 2 upcoming events</p>
                <Button asChild className="w-full mt-4">
                  <Link href="/customer-dashboard/events">View Events</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">You have 5 unread notifications</p>
                <Button asChild className="w-full mt-4">
                  <Link href="/customer-dashboard/notifications">View Notifications</Link>
                </Button>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waitlist History</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{historyCount}</div>
                <p className="text-xs text-muted-foreground">
                  You've joined {historyCount} waitlists in total
                </p>
                <Button asChild className="w-full mt-4">
                  <Link href="/customer-dashboard/history">View History</Link>
                </Button>
              </CardContent>
            </Card> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;