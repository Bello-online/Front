const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users } from 'lucide-react'

const CustomerWaitlistList = () => {
  const [waitlists, setWaitlists] = useState([]);
  const [joinedWaitlists, setJoinedWaitlists] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('User ID not found in localStorage');
    }
  }, []);

  useEffect(() => {
    const fetchWaitlists = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/waitlists`);
        setWaitlists(response.data);
      } catch (error) {
        console.error('Error fetching waitlists:', error);
      }
    };

    fetchWaitlists();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchJoinedWaitlists = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/waitlists/joined`, {
            params: { userId }
          });
          const joinedIds = response.data.map(waitlist => waitlist.id);
          setJoinedWaitlists(joinedIds);
          console.log('Joined waitlists:', joinedIds);
        } catch (error) {
          console.error('Error fetching joined waitlists:', error);
        }
      };

      fetchJoinedWaitlists();
    }
  }, [userId]);

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
  
    try {
      await axios.post(`${API_URL}/api/waitlists/${waitlistId}/join`, { userId });
      setJoinedWaitlists(prev => [...prev, waitlistId]);
      console.log('Joined waitlist:', waitlistId);
    } catch (error) {
      console.error('Error joining waitlist:', error);
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
      alert('User ID not found');
      return;
    }
  
    try {
      await axios.delete(`${API_URL}/api/waitlists/${waitlistId}/leave`, { data: { userId } });
      setJoinedWaitlists(prev => prev.filter(id => id !== waitlistId));
    } catch (error) {
      console.error('Error leaving waitlist:', error);
      alert('Could not leave the waitlist.');
    }
  };

  return (
    <div className="space-y-4">
      {waitlists.map((waitlist) => (
        <Card key={waitlist.id}>
          <CardHeader>
            <CardTitle>{waitlist.serviceName}</CardTitle>
            <CardDescription>Status: {waitlist.status}</CardDescription>
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
              <Button onClick={() => handleJoinWaitlist(waitlist.id)} variant="default">
                Join Waitlist
              </Button>
            ) : (
              <Button onClick={() => handleLeaveWaitlist(waitlist.id)} variant="destructive">
                Leave Waitlist
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomerWaitlistList;