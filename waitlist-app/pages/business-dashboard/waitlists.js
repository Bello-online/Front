const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell } from 'lucide-react'

const BusinessWaitlistList = () => {
  const [waitlists, setWaitlists] = useState([]);
  const [customersByWaitlist, setCustomersByWaitlist] = useState({});
  const [visibleWaitlists, setVisibleWaitlists] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [filteredWaitlists, setFilteredWaitlists] = useState([]);
  const customersPerPage = 4;
  const userRole = 'business_owner';
  const [userId, setUserId] = useState(null);

  const searchFields = [
    { name: 'serviceName', label: 'Service Name', type: 'text', placeholder: 'Search by service name' },
    { name: 'waitTime', label: 'Wait Time', type: 'range', placeholder: 'Search by wait time' },
    { name: 'status', label: 'Status', type: 'text', placeholder: 'Search by status' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Search by location' }
  ];

  const handleSearch = async (searchParams) => {
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.query) queryParams.append('query', searchParams.query);
      if (searchParams.ranges) queryParams.append('ranges', JSON.stringify(searchParams.ranges));
      
      Object.entries(searchParams).forEach(([key, value]) => {
        if (key !== 'query' && key !== 'ranges' && value) {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`${API_URL}/api/waitlists/search?${queryParams}`);
      setFilteredWaitlists(response.data);
    } catch (error) {
      console.error('Error searching waitlists:', error);
      // Fallback to frontend filtering
      let results = waitlists;

      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        results = results.filter(waitlist => 
          waitlist.serviceName.toLowerCase().includes(query) ||
          waitlist.status.toLowerCase().includes(query) ||
          waitlist.location?.toLowerCase().includes(query)
        );
      }

      if (searchParams.ranges) {
        Object.entries(searchParams.ranges).forEach(([field, range]) => {
          if (range.min) {
            results = results.filter(waitlist => waitlist[field] >= Number(range.min));
          }
          if (range.max) {
            results = results.filter(waitlist => waitlist[field] <= Number(range.max));
          }
        });
      }

      setFilteredWaitlists(results);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchWaitlists = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/waitlists`, {
          params: { ownerId: userId },
        });
        setWaitlists(response.data);
        setFilteredWaitlists(response.data);
      } catch (error) {
        console.error('Error fetching waitlists:', error);
      }
    };

    fetchWaitlists();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/waitlists/notifications`);
      if (response.data.length > 0) {
        setNotifications(response.data.map(join => `New join: ${join.User.username} joined waitlist ${join.waitlistId}`));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleCustomersForWaitlist = async (waitlistId) => {
    setVisibleWaitlists((prevVisible) => ({
      ...prevVisible,
      [waitlistId]: !prevVisible[waitlistId],
    }));

    if (!customersByWaitlist[waitlistId]) {
      try {
        const response = await axios.get(`${API_URL}/api/waitlists/${waitlistId}/customers`);
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
    <div className="min-h-screen bg-background">
      <Navbar userRole="business_owner" userId={userId} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Your Waitlists</h1>
        
        <SearchBar 
          onSearch={handleSearch}
          fields={searchFields}
        />

        {notifications.length > 0 && (
          <Alert className="mb-6">
            <Bell className="h-4 w-4" />
            <AlertTitle>New Notifications</AlertTitle>
            <AlertDescription>
              {notifications.map((notification, index) => (
                <p key={index}>{notification}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {filteredWaitlists.map((waitlist) => (
          <Card key={waitlist.id} className="mb-6">
            <CardHeader>
              <CardTitle>{waitlist.serviceName}</CardTitle>
              <CardDescription>Status: {waitlist.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => toggleCustomersForWaitlist(waitlist.id)}>
                {visibleWaitlists[waitlist.id] ? 'Hide Joined Customers' : 'View Joined Customers'}
              </Button>

              {visibleWaitlists[waitlist.id] && customersByWaitlist[waitlist.id] && (
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Wait Time</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginateCustomers(waitlist.id).map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.User.username}</TableCell>
                          <TableCell>{waitlist.status}</TableCell>
                          <TableCell>{waitlist.waitTime} mins</TableCell>
                          <TableCell>{customer.User.phone}</TableCell>
                          <TableCell>
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveCustomer(customer.id)} className="mr-2">
                              Remove
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleNotifyCustomer(customer.id)}>
                              Notify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePreviousPage(waitlist.id)} />
                      </PaginationItem>
                      {[...Array(Math.ceil(customersByWaitlist[waitlist.id].length / customersPerPage)).keys()].map((page) => (
                        <PaginationItem key={page + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage((prev) => ({ ...prev, [waitlist.id]: page + 1 }))}
                            isActive={currentPage[waitlist.id] === page + 1}
                          >
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext onClick={() => handleNextPage(waitlist.id)} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessWaitlistList;