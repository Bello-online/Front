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
  const [eventsCount, setEventsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCounts = async () => {
      // Fetch waitlist count
      try {
        const waitlistResponse = await axios.get(`${API_URL}/api/waitlists/joined`, {
          params: { 
            userId,
            includeWaitlist: true
          }
        });
        setHistoryCount(waitlistResponse.data.length);
      } catch (error) {
        console.error('Error fetching waitlist count:', error);
        setHistoryCount(0);
      }

      // Fetch events count
      try {
        const eventsResponse = await axios.get(
          `${API_URL}/api/events/participants/user/${userId}`
        );
        setEventsCount(eventsResponse.data.length);
      } catch (error) {
        console.error('Error fetching events count:', error);
        setEventsCount(0);
      }

      // Fetch notifications count
      try {
        const notificationsResponse = await axios.get(`${API_URL}/api/waitlists/notifications`);
        setNotificationsCount(notificationsResponse.data.length);
      } catch (error) {
        console.error('Error fetching notifications count:', error);
        setNotificationsCount(0);
      }
    };

    fetchCounts();
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
                <div className="text-2xl font-bold">{historyCount}</div>
                <p className="text-xs text-muted-foreground">
                  You're currently in {historyCount} waitlist{historyCount !== 1 ? 's' : ''}
                </p>
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
                <div className="text-2xl font-bold">{eventsCount}</div>
                <p className="text-xs text-muted-foreground">
                  You have {eventsCount} upcoming event{eventsCount !== 1 ? 's' : ''}
                </p>
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
                <div className="text-2xl font-bold">{notificationsCount}</div>
                <p className="text-xs text-muted-foreground">
                  You have {notificationsCount} unread notification{notificationsCount !== 1 ? 's' : ''}
                </p>
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