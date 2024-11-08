import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const Navbar = ({ userRole, userId }) => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  // Navigation options for customers
  const customerLinks = [
    { label: 'Waitlists', path: '/customer-dashboard/waitlists' },
    { label: 'Events/Appointments', path: '/customer-dashboard/events' },
    { label: 'About', path: '/customer-dashboard/about' },
    { label: 'History', path: '/customer-dashboard/history' },
  ];

  // Navigation options for business owners
  const businessLinks = [
    { label: 'Waitlists', path: '/business-dashboard/waitlists' },
    { label: 'Events/Appointments', path: '/business-dashboard/events' },
    { label: 'About', path: '/business-dashboard/about' },
    { label: 'Reports', path: '/business-dashboard/reports' },
  ];

  // Conditionally show navigation links based on user role
  const links = userRole === 'business_owner' ? businessLinks : customerLinks;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`https://backend-deploy-0d782579924c.herokuapp.com/api/notifications/unread-count/${userId}`);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    };
    fetchUnreadCount();
  }, [userId]);

  const handleNotificationsClick = async () => {
    try {
      await axios.put(`https://backend-deploy-0d782579924c.herokuapp.com/api/notifications/mark-all-as-read/${userId}`);
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
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4 container mx-auto">
        {links.map((link) => (
          <li key={link.label}>
            <button
              onClick={() => router.push(link.path)}
              className="hover:text-blue-400"
            >
              {link.label}
            </button>
          </li>
        ))}
        <li className="ml-auto relative">
          <button onClick={handleNotificationsClick} className="hover:text-blue-400">
          <NotificationsIcon />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
