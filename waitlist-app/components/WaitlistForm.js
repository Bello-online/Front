const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

const WaitlistForm = () => {
  const [formData, setFormData] = useState({
    serviceName: '',
    waitTime: '',
    status: '',
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set the ownerId to the current user's ID
    const ownerId = localStorage.getItem('userId');
    
    if (!ownerId) {
      console.error('No user ID found in local storage');
      return;
    }
    const dataToSend = { ...formData, ownerId };
    // console.log('Sending form data: ', formData);

    try {
      const response = await axios.post(`${API_URL}/api/waitlists/create`, dataToSend);
      console.log('Waitlist Created:', response.data);
      // Reset form after successful submission
      setFormData({
        serviceName: '',
        waitTime: '',
        status: '',
        address: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error creating waitlist:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceName">Service Name</Label>
            <Input
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="Enter service name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waitTime">Wait Time (mins)</Label>
            <Input
              id="waitTime"
              name="waitTime"
              type="number"
              value={formData.waitTime}
              onChange={handleChange}
              placeholder="Enter wait time in minutes"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Enter status"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>
          <Button asChild type="submit">
            <Link href="/business-dashboard/waitlists">
              Create Waitlist
            </Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WaitlistForm;