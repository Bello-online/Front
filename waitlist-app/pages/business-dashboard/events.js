const API_URL = process.env.NEXT_PUBLIC_API_URL;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const BusinessEvents = () => {
  const userRole = "business_owner";
  const [userId, setUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState({});
  const [visibleParticipants, setVisibleParticipants] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  });

  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  // Fetch events created by the business owner
  const fetchEvents = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API_URL}/api/events/owner/${userId}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Create or update an event
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) {
      alert("Title and Date are required!");
    }
    if (!userId) {
      console.error("Cannot create or update event without userId");
      return;
    }

    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/api/events/${editingEvent.id}`, {
          ...newEvent,
        });
      } else {
        await axios.post(`${API_URL}/api/events`, { ...newEvent, ownerId: userId });
      }
      setNewEvent({ title: "", description: "", date: "", location: "", capacity: "" });
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error creating or updating event:", error);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`${API_URL}/api/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Fetch participants for a specific event
  const fetchParticipants = async (eventId) => {
    try {
      const response = await axios.get(`${API_URL}/api/events/${eventId}/participants`);
      setParticipants((prev) => ({
        ...prev,
        [eventId]: response.data,
      }));
      setVisibleParticipants((prev) => ({
        ...prev,
        [eventId]: true,
      }));
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // Toggle visibility of participants for a specific event
  const toggleParticipantsVisibility = (eventId) => {
    setVisibleParticipants((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Populate the form for editing an event
  const startEditingEvent = (event) => {
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
    });
    setEditingEvent(event);
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  return (
    <div>
      <Navbar userRole={userRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Manage Your Events</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingEvent ? "Edit Event" : "Create New Event"}</CardTitle>
            <CardDescription>
              {editingEvent ? "Update the details of your event." : "Fill in the details below to add an event."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <Input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Capacity"
                value={newEvent.capacity}
                onChange={(e) => {const value = parseInt(e.target.value, 10); if (value < 1) {
                  alert("Capacity must be at least 1");return;}
                  setNewEvent({ ...newEvent, capacity: value });
                }}
              />
              <Button type="submit">{editingEvent ? "Update Event" : "Create Event"}</Button>
            </form>
          </CardContent>
        </Card>
        <ul className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Date: {new Date(event.date).toLocaleString()}</p>
                <p>Location: {event.location}</p>
                <p>Capacity: {event.capacity}</p>
              </CardContent>
              <CardFooter className="space-x-4">
                <Button variant="secondary" onClick={() => startEditingEvent(event)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => deleteEvent(event.id)}>
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!participants[event.id]) fetchParticipants(event.id);
                    else toggleParticipantsVisibility(event.id);
                  }}
                >
                  {visibleParticipants[event.id] ? "Hide Participants" : "View Participants"}
                </Button>
              </CardFooter>
              {visibleParticipants[event.id] && participants[event.id] && (
                <CardContent>
                  <ul className="space-y-2">
                    {participants[event.id].map((participant) => (
                      <li key={participant.id} className="flex justify-between">
                        <span>{participant.user.username}</span>
                        <span>{participant.user.email || "No Email"}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BusinessEvents;
