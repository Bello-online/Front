const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check } from 'lucide-react'
import Link from 'next/link';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const userRole = 'business_owner';

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchNotifications = async () => {
      if (!userId) {
        console.warn("User ID is missing");
        return;
      }
      try {
        const response = await axios.get(`https://backend-deploy-0d782579924c.herokuapp.com/api/notifications/${userId}`);
        console.log('Notifications from backend:', response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/notifications/mark-as-read/${notificationId}`);
      if (response.status === 200) {
        setNotifications(prev => {
          const updatedNotifications = prev.filter(notif => notif.id !== notificationId);
          return updatedNotifications;
        });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Notifications</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2" />
              Your Notifications
            </CardTitle>
            <CardDescription>Stay updated with your business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      size="sm"
                      className="shrink-0 h-8"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No new notifications</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;