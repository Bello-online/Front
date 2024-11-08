import React, { useEffect, useState } from 'react';
import axios from 'axios';


const NotificationsPage = ({ userId }) => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchNotifications = async () => {
        if (!userId){
            console.warn("User ID is missing");
            return;
        }
      try {
        const response = await axios.get(`https://backend-deploy-0d782579924c.herokuapp.com/api/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} className="mb-2 p-2 border rounded bg-black-100 text-white">
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;