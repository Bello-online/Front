const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from 'lucide-react';

const CustomerEvents = () => {
  const userRole = "customer";
  const [userId, setUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

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

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchJoinedEvents = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/events/participants/user/${userId}`
        );
        setJoinedEvents(response.data.map((e) => e.eventId));
      } catch (error) {
        console.error("Error fetching joined events:", error);
      }
    };

    fetchEvents();
    fetchJoinedEvents();
  }, [userId]);

  const joinEvent = async (eventId) => {
    try {
      await axios.post(`${API_URL}/api/events/participants`, {
        userId,
        eventId,
      });
      setJoinedEvents([...joinedEvents, eventId]);
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const leaveEvent = async (eventId) => {
    try {
      await axios.delete(`${API_URL}/api/events/participants/${userId}/${eventId}`);
      setJoinedEvents(joinedEvents.filter((id) => id !== eventId));
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Available Events/Appointments</h1>
        {userId ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {new Date(event.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{event.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  {joinedEvents.includes(event.id) ? (
                    <div className="flex space-x-2 w-full">
                      <Badge variant="secondary" className="flex-grow text-center">Joined</Badge>
                      <Button variant="destructive" onClick={() => leaveEvent(event.id)}>
                        Leave
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => joinEvent(event.id)}>
                      Join
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default CustomerEvents;