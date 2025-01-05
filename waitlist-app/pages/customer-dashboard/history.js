const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const CustomerHistory = () => {
  const userRole = 'customer';
  const [history, setHistory] = useState([]);
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

    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Using the existing joined waitlists endpoint
        const response = await axios.get(`${API_URL}/api/waitlists/joined`, {
          params: { userId }
        });
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching waitlist history:", error);
        setError("Failed to load history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Your Waitlist History</h1>
        <Card>
          <CardHeader>
            <CardTitle>Previously Joined Waitlists</CardTitle>
            <CardDescription>A record of all the waitlists you've been part of</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : history.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.serviceName}</TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{item.waitTime} mins</TableCell>
                      <TableCell>{item.status || 'Completed'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                You haven't joined any waitlists yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerHistory;