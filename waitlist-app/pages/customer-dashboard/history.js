const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Clock } from "lucide-react";

const CustomerHistory = () => {
  const userRole = 'customer';
  const [joinedWaitlists, setJoinedWaitlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchJoinedWaitlists = async () => {
      try {
        setLoading(true);
        // First, get the IDs of joined waitlists
        const joinedResponse = await axios.get(`${API_URL}/api/waitlists/joined`, {
          params: { userId }
        });

        // Then, get all waitlists
        const allWaitlistsResponse = await axios.get(`${API_URL}/api/waitlists`);
        
        // Filter the waitlists to only show the ones the user has joined
        const joinedIds = joinedResponse.data.map(join => join.waitlistId);
        const joinedWaitlistsData = allWaitlistsResponse.data.filter(waitlist => 
          joinedIds.includes(waitlist.id)
        );

        setJoinedWaitlists(joinedWaitlistsData);
      } catch (error) {
        console.error("Error fetching joined waitlists:", error);
        setError("Failed to load history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedWaitlists();
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Your Waitlist History</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : joinedWaitlists.length > 0 ? (
            joinedWaitlists.map((waitlist) => (
              <Card key={waitlist.id}>
                <CardHeader>
                  <CardTitle>{waitlist.serviceName}</CardTitle>
                  <CardDescription>
                    {waitlist.location && `Location: ${waitlist.location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{waitlist.waitTime} mins</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              You haven't joined any waitlists yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;