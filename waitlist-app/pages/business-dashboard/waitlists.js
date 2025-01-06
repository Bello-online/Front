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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { sanitizeSearchParams } from '../../utils/sanitizeQuery';

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
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmButton: '',
    onConfirm: null
  });

  const searchFields = [
    { name: 'serviceName', label: 'Service Name', type: 'text', placeholder: 'Search by service name' },
    { name: 'waitTime', label: 'Wait Time', type: 'range', placeholder: 'Search by wait time' },
    { name: 'status', label: 'Status', type: 'text', placeholder: 'Search by status' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Search by location' }
  ];

  const handleSearch = async (searchParams) => {
    // Sanitize the search parameters first
    const sanitizedParams = sanitizeSearchParams(searchParams);
    
    try {
      const queryParams = new URLSearchParams();
      if (sanitizedParams.query) queryParams.append('query', sanitizedParams.query);
      if (sanitizedParams.ranges) queryParams.append('ranges', JSON.stringify(sanitizedParams.ranges));
      
      Object.entries(sanitizedParams).forEach(([key, value]) => {
        if (key !== 'query' && key !== 'ranges' && value) {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`${API_URL}/api/waitlists/search?${queryParams}`);
      setFilteredWaitlists(response.data);
    } catch (error) {
      console.error('Error searching waitlists:', error);
      // Keep existing fallback logic
      let results = waitlists;

      if (sanitizedParams.query) {
        const query = sanitizedParams.query.toLowerCase();
        results = results.filter(waitlist => 
          waitlist.serviceName.toLowerCase().includes(query) ||
          waitlist.status.toLowerCase().includes(query) ||
          waitlist.location?.toLowerCase().includes(query)
        );
      }

      // Keep existing range filtering logic
      if (sanitizedParams.ranges) {
        Object.entries(sanitizedParams.ranges).forEach(([field, range]) => {
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

  useEffect(() => {
    if (userId) {
      fetchWaitlists();
    }
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

  const handleRemoveCustomer = async (waitlistId, customerId, customerName) => {
    setModalState({
      isOpen: true,
      title: 'Remove Customer',
      description: `Are you sure you want to remove ${customerName} from the waitlist?`,
      confirmButton: 'Remove',
      onConfirm: async () => {
        try {
          // First, remove the customer
          await axios.delete(`${API_URL}/api/waitlists/${waitlistId}/leave`, {
            data: { userId: customerId }
          });
          
          // Then refresh the customers list for this waitlist
          const updatedCustomers = await axios.get(`${API_URL}/api/waitlists/${waitlistId}/customers`);
          
          // Update the state with new customer list
          setCustomersByWaitlist(prev => ({
            ...prev,
            [waitlistId]: updatedCustomers.data
          }));
          
          // Close the modal
          setModalState({
            isOpen: false,
            title: '',
            description: '',
            confirmButton: '',
            onConfirm: null
          });
        } catch (error) {
          console.error('Error details:', {
            waitlistId,
            customerId,
            error: error.response?.data || error.message
          });
          
          setModalState({
            isOpen: true,
            title: 'Error',
            description: 'Could not remove customer from the waitlist.',
            confirmButton: 'OK',
            onConfirm: () => setModalState({
              isOpen: false,
              title: '',
              description: '',
              confirmButton: '',
              onConfirm: null
            })
          });
        }
      }
    });
  };

  const handleNotifyCustomer = (customerId) => {
    console.log(`Notifying customer with ID ${customerId}`);
    // Add API call here
  };

  const validateWaitlistData = (formData) => {
    const errors = {};
    
    // Service Name validation
    if (!formData.serviceName?.trim()) {
      errors.serviceName = 'Service name is required';
    }

    // Wait Time validation
    const waitTime = Number(formData.waitTime);
    if (!formData.waitTime || isNaN(waitTime)) {
      errors.waitTime = 'Wait time is required and must be a number';
    } else if (waitTime < 0) {
      errors.waitTime = 'Wait time cannot be negative';
    }

    // Max Capacity validation
    const maxCapacity = Number(formData.maxCapacity);
    if (!formData.maxCapacity || isNaN(maxCapacity)) {
      errors.maxCapacity = 'Maximum capacity is required and must be a number';
    } else if (maxCapacity <= 0) {
      errors.maxCapacity = 'Maximum capacity must be greater than 0';
    }

    // Status validation
    if (!formData.status?.trim()) {
      errors.status = 'Status is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleCreateWaitlist = async (formData) => {
    const validation = validateWaitlistData(formData);
    
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors).join('\n');
      setModalState({
        isOpen: true,
        title: 'Validation Error',
        description: errorMessage,
        confirmButton: 'OK'
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/waitlists`, {
        ...formData,
        ownerId: userId,
        waitTime: Number(formData.waitTime),
        maxCapacity: Number(formData.maxCapacity)
      });
      setWaitlists(prevWaitlists => [...prevWaitlists, response.data]);
      setFilteredWaitlists(prevFiltered => [...prevFiltered, response.data]);
      setShowCreateModal(false);
      fetchWaitlists();
    } catch (error) {
      console.error('Error creating waitlist:', error);
      setModalState({
        isOpen: true,
        title: 'Error',
        description: 'Could not create the waitlist.',
        confirmButton: 'OK'
      });
    }
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
                        {/* <TableHead>Actions</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginateCustomers(waitlist.id).map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.User.username}</TableCell>
                          <TableCell>{waitlist.status}</TableCell>
                          <TableCell>{waitlist.waitTime} mins</TableCell>
                          <TableCell>{customer.User.phone}</TableCell>
                          {/* <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveCustomer(waitlist.id, customer.User.id, customer.User.username)}
                            >
                              Remove
                            </Button>
                          </TableCell> */}
                          
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
      {modalState.isOpen && (
        <Dialog open={modalState.isOpen} onOpenChange={() => setModalState({ isOpen: false })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modalState.title}</DialogTitle>
              <DialogDescription>{modalState.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalState({ isOpen: false })}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={modalState.onConfirm}>
                {modalState.confirmButton}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BusinessWaitlistList;