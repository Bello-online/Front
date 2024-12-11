const API_URL = process.env.NEXT_PUBLIC_API_URL;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const CustomerHistory = () => {
  const userRole = 'customer';
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/history/${userId}`);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching waitlist history:", error);
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
            {history.length > 0 ? (
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
                      <TableCell>{new Date(item.dateJoined).toLocaleString()}</TableCell>
                      <TableCell>{item.waitTime} mins</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>You haven't joined any waitlists yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerHistory;