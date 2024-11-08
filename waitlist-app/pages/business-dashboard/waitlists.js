import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessWaitlistList = ({ userId }) => {
  const [waitlists, setWaitlists] = useState([]);
  const [customersByWaitlist, setCustomersByWaitlist] = useState({});
  const [visibleWaitlists, setVisibleWaitlists] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [notifications, setNotifications] = useState([]); // Notifications for new joins
  const customersPerPage = 4; // Number of customers per page

  // Fetch waitlists created by the business owner
  useEffect(() => {
    const fetchWaitlists = async () => {
      try {
        const response = await axios.get('https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists', {
          params: { ownerId: userId }, // Assuming `userId` identifies the business owner
        });
        setWaitlists(response.data);
      } catch (error) {
        console.error('Error fetching waitlists:', error);
      }
    };

    fetchWaitlists();
  }, [userId]);

  // Polling function to fetch new join notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/notifications');
      if (response.data.length > 0) {
        setNotifications(response.data.map(join => `New join: ${join.User.username} joined waitlist ${join.waitlistId}`));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Polling for notifications every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const toggleCustomersForWaitlist = async (waitlistId) => {
    setVisibleWaitlists((prevVisible) => ({
      ...prevVisible,
      [waitlistId]: !prevVisible[waitlistId],
    }));

    if (!customersByWaitlist[waitlistId]) {
      try {
        const response = await axios.get(`https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/${waitlistId}/customers`);
        setCustomersByWaitlist((prev) => ({
          ...prev,
          [waitlistId]: response.data,
        }));
        setCurrentPage((prev) => ({ ...prev, [waitlistId]: 1 }));
      } catch (error) {
        console.error(`Error fetching customers for waitlist ${waitlistId}:`, error);
      }
    }
  };

  // Pagination for customers
  const paginateCustomers = (waitlistId) => {
    const startIndex = (currentPage[waitlistId] - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    return customersByWaitlist[waitlistId].slice(startIndex, endIndex);
  };

  const handleNextPage = (waitlistId) => {
    setCurrentPage((prev) => ({
      ...prev,
      [waitlistId]: (prev[waitlistId] || 1) + 1,
    }));
  };

  const handlePreviousPage = (waitlistId) => {
    setCurrentPage((prev) => ({
      ...prev,
      [waitlistId]: Math.max((prev[waitlistId] || 1) - 1, 1),
    }));
  };

  const handleRemoveCustomer = (customerId) => {
    console.log(`Removing customer with ID ${customerId}`);
    // Add API call here
  };

  const handleNotifyCustomer = (customerId) => {
    console.log(`Notifying customer with ID ${customerId}`);
    // Add API call here
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Waitlists</h2>
        {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="notifications bg-green-100 p-3 rounded mb-4">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.map((notification, index) => (
            <p key={index} className="text-green-800">{notification}</p>
        ))}
      </div>
    )}
      <ul>
        {waitlists.map((waitlist) => (
          <li key={waitlist.id} className="mb-6 border p-4 rounded">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{waitlist.serviceName}</h3>
              <button
                onClick={() => toggleCustomersForWaitlist(waitlist.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {visibleWaitlists[waitlist.id] ? 'Hide Joined Customers' : 'View Joined Customers'}
              </button>
            </div>

            {visibleWaitlists[waitlist.id] && customersByWaitlist[waitlist.id] && (
              <div className="mt-4">
                <h4 className="font-semibold">Customers:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-black-300">
                    <thead className="bg-gray-700 text-white">
                      <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Wait Time</th>
                        <th className="py-2 px-4 text-left">Phone Number</th>
                        <th className="py-2 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginateCustomers(waitlist.id).map((customer) => (
                        <tr key={customer.id} className="border-t">
                          <td className="py-2 px-4 text-black">{customer.User.username}</td>
                          <td className="py-2 px-4 text-black">{waitlist.status}</td>
                          <td className="py-2 px-4 text-black">{waitlist.waitTime} mins</td>
                          <td className="py-2 px-4 text-black">{customer.User.phone}</td>
                          <td className="py-2 px-4 text-center">
                            <button
                              className="bg-red-500 text-white px-3 py-1 mr-2 rounded"
                              onClick={() => handleRemoveCustomer(customer.id)}
                            >
                              Remove
                            </button>
                            <button
                              className="bg-orange-500 text-white px-3 py-1 rounded"
                              onClick={() => handleNotifyCustomer(customer.id)}
                            >
                              Notify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handlePreviousPage(waitlist.id)}
                    disabled={currentPage[waitlist.id] === 1}
                    className="bg-gray-300 px-2 py-1 mx-1 rounded"
                  >
                    &lt;
                  </button>
                  {[...Array(Math.ceil(customersByWaitlist[waitlist.id].length / customersPerPage)).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => setCurrentPage((prev) => ({ ...prev, [waitlist.id]: page + 1 }))}
                      className={`px-3 py-1 mx-1 rounded ${currentPage[waitlist.id] === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNextPage(waitlist.id)}
                    disabled={currentPage[waitlist.id] === Math.ceil(customersByWaitlist[waitlist.id].length / customersPerPage)}
                    className="bg-gray-300 px-2 py-1 mx-1 rounded"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessWaitlistList;