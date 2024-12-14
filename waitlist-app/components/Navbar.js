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
  const [notifications, setNotifications] = useState([]);

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
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notifications/${userId}`);
        const unreadNotifications = response.data;
        setNotifications(unreadNotifications);
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <ul className="flex space-x-4">
            {links.map((link) => (
              <li key={link.label}>
                <Button variant="ghost" onClick={() => router.push(link.path)}>
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
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id}>
                    {notification.message}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;