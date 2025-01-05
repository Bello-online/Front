const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users } from 'lucide-react';
import { Modal } from '@/components/modal';

const CustomerWaitlists = () => {
  const userRole = 'customer';
  const [userId, setUserId] = useState(null);
  const [waitlists, setWaitlists] = useState([]);
  const [filteredWaitlists, setFilteredWaitlists] = useState([]);
  const [joinedWaitlists, setJoinedWaitlists] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmButton: ''
  });

  const searchFields = [
    { name: 'serviceName', label: 'Service Name', type: 'text', placeholder: 'Search by service name' },
    { name: 'waitTime', label: 'Wait Time', type: 'range', placeholder: 'Search by wait time' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Search by location' }
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchWaitlists = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/waitlists`);
        setWaitlists(response.data);
        setFilteredWaitlists(response.data);
      } catch (error) {
        console.error('Error fetching waitlists:', error);
      }
    };

    const fetchJoinedWaitlists = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/waitlists/joined`, {
          params: { userId }
        });
        setJoinedWaitlists(response.data);
      } catch (error) {
        console.error('Error fetching joined waitlists:', error);
      }
    };

    fetchWaitlists();
    fetchJoinedWaitlists();
  }, [userId]);

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

  const handleJoinWaitlist = async (waitlistId) => {
    if (!userId) {
      setModalState({
        isOpen: true,
        title: 'Login Required',
        description: 'Please log in to join a waitlist',
        confirmButton: 'OK'
      });
      return;
    }

    setJoinedWaitlists(prev => [...prev, waitlistId]);

    try {
      await axios.post(`${API_URL}/api/waitlists/${waitlistId}/join`, { userId });
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setJoinedWaitlists(prev => prev.filter(id => id !== waitlistId));
      setModalState({
        isOpen: true,
        title: 'Error',
        description: 'Could not join the waitlist.',
        confirmButton: 'OK'
      });
    }
  };

  const handleLeaveWaitlist = async (waitlistId) => {
    if (!userId) {
      setModalState({
        isOpen: true,
        title: 'Error',
        description: 'User ID not found',
        confirmButton: 'OK'
      });
      return;
    }

    setJoinedWaitlists(prev => prev.filter(id => id !== waitlistId));

    try {
      await axios.delete(`${API_URL}/api/waitlists/${waitlistId}/leave`, { 
        data: { userId } 
      });
    } catch (error) {
      console.error('Error leaving waitlist:', error);
      setJoinedWaitlists(prev => [...prev, waitlistId]);
      setModalState({
        isOpen: true,
        title: 'Error',
        description: 'Could not leave the waitlist.',
        confirmButton: 'OK'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Available Waitlists</h1>

        <SearchBar 
          onSearch={handleSearch}
          fields={searchFields}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWaitlists.map((waitlist) => (
            <Card key={waitlist.id}>
              <CardHeader>
                <CardTitle>{waitlist.serviceName}</CardTitle>
                <CardDescription>
                  {waitlist.location && `Location: ${waitlist.location}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{waitlist.waitTime} mins</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{waitlist.currentCapacity || 0} / {waitlist.maxCapacity || 'N/A'}</span>
                  </div>
                </div>
                {!joinedWaitlists.includes(waitlist.id) ? (
                  <Button 
                    onClick={() => handleJoinWaitlist(waitlist.id)} 
                    variant="default"
                    className="w-full"
                  >
                    Join Waitlist
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleLeaveWaitlist(waitlist.id)} 
                    variant="destructive"
                    className="w-full"
                  >
                    Leave Waitlist
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Modal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        description={modalState.description}
        confirmButton={modalState.confirmButton}
      />
    </div>
  );
};

export default CustomerWaitlists;