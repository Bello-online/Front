const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const WaitlistList = () => {
  const [waitlists, setWaitlists] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    serviceName: '',
    waitTime: '',
    status: ''
  });

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

  const handleEditClick = (waitlist) => {
    setEditingId(waitlist.id);
    setEditFormData({
      serviceName: waitlist.serviceName,
      waitTime: waitlist.waitTime,
      status: waitlist.status
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/waitlists/${editingId}`, editFormData);
      setEditingId(null);
      const response = await axios.get(`${API_URL}/api/waitlists`);
      setWaitlists(response.data);
    } catch (error) {
      console.error('Error updating waitlist:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/waitlists/${id}`);
      const response = await axios.get(`${API_URL}/api/waitlists`);
      setWaitlists(response.data);
    } catch (error) {
      console.error('Error deleting waitlist:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Waitlists</CardTitle>
        <CardDescription>Manage your current waitlists</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Wait Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waitlists.map((waitlist) => (
              <TableRow key={waitlist.id}>
                <TableCell>
                  {editingId === waitlist.id ? (
                    <Input
                      name="serviceName"
                      value={editFormData.serviceName}
                      onChange={(e) => setEditFormData({ ...editFormData, serviceName: e.target.value })}
                    />
                  ) : (
                    waitlist.serviceName
                  )}
                </TableCell>
                <TableCell>
                  {editingId === waitlist.id ? (
                    <Input
                      name="waitTime"
                      type="number"
                      value={editFormData.waitTime}
                      onChange={(e) => setEditFormData({ ...editFormData, waitTime: e.target.value })}
                    />
                  ) : (
                    `${waitlist.waitTime} mins`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === waitlist.id ? (
                    <Input
                      name="status"
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    />
                  ) : (
                    waitlist.status
                  )}
                </TableCell>
                <TableCell>
                  {editingId === waitlist.id ? (
                    <Button onClick={handleEditSubmit} variant="default">Save</Button>
                  ) : (
                    <>
                      <Button onClick={() => handleEditClick(waitlist)} variant="outline" className="mr-2">Edit</Button>
                      <Button onClick={() => handleDelete(waitlist.id)} variant="destructive">Delete</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WaitlistList;