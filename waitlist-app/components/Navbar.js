const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = ({ userRole, userId }) => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const customerLinks = [
    { label: 'Waitlists', path: '/customer-dashboard/waitlists' },
    { label: 'Events/Appointments', path: '/customer-dashboard/events' },
    { label: 'About', path: '/customer-dashboard/about' },
    { label: 'History', path: '/customer-dashboard/history' },
  ];

  const businessLinks = [
    { label: 'Waitlists', path: '/business-dashboard/waitlists' },
    { label: 'Events/Appointments', path: '/business-dashboard/events' },
    { label: 'About', path: '/business-dashboard/about' },
    { label: 'Reports', path: '/business-dashboard/reports' },
  ];

  const links = userRole === 'business_owner' ? businessLinks : customerLinks;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_URL}/api/notifications/${userId}`);
        const unreadNotifications = response.data.filter(notif => !notif.isRead);
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
    // Set up polling to check for new notifications
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const handleNotificationsClick = async () => {
    try {
      await axios.put(`${API_URL}/api/notifications/mark-all-as-read/${userId}`);
      setUnreadCount(0);

      if (userRole === 'business_owner') {
        router.push('/business-dashboard/notifications');
      } else if (userRole === 'customer') {
        router.push('/customer-dashboard/notifications');
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <ul className="flex space-x-4">
            {links.map((link) => (
              <li key={link.label}>
                <Button
                  variant="ghost"
                  onClick={() => router.push(link.path)}
                >
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleNotificationsClick}>
                View Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;