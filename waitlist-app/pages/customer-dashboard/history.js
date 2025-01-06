const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const CustomerHistory = () => {
  const userRole = 'customer';
  const [waitlists, setWaitlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID not found. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchJoinedWaitlists = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/waitlists/joined`, {
          params: { userId }
        });
        
        // Map the response to include the waitlist details
        const joinedWaitlists = response.data.map(join => ({
          id: join.id,
          serviceName: join.serviceName,
          location: join.location,
          joinedAt: new Date(join.createdAt).toLocaleString()
        }));
        
        setWaitlists(joinedWaitlists);
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
          ) : waitlists.length > 0 ? (
            waitlists.map((waitlist) => (
              <Card key={waitlist.id}>
                <CardHeader>
                  <CardTitle>{waitlist.serviceName}</CardTitle>
                  <CardDescription>
                    Joined on: {waitlist.joinedAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {waitlist.location && (
                    <p className="text-sm text-muted-foreground">
                      Location: {waitlist.location}
                    </p>
                  )}
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