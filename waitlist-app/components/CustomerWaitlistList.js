import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerWaitlistList = () => {
  const [waitlists, setWaitlists] = useState([]);
  const [joinedWaitlists, setJoinedWaitlists] = useState([]); // Track waitlists the customer has joined
  const [userId, setUserId] = useState(null);

  // Fetch userId from localStorage once the component mounts (client side)
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');  // Get the userId from localStorage after login
    if (storedUserId) {
      setUserId(storedUserId);
    }else{
      console.error('User ID not found in localStorage');
    }
  }, []); 
  // Fetch all waitlists
  useEffect(() => {

    const fetchWaitlists = async () => {
      try {
        const response = await axios.get('https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists');
        setWaitlists(response.data);
      } catch (error) {
        console.error('Error fetching waitlists:', error);
      }
    };

    fetchWaitlists();
  }, []);

  // Fetch joined waitlists
  useEffect(() => {
    if (userId) {
      const fetchJoinedWaitlists = async () => {
        try {
          const response = await axios.get('https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/joined', {
            params: { userId },  // Pass userId as a query parameter
          });
          setJoinedWaitlists(response.data);
        } catch (error) {
          console.error('Error fetching joined waitlists:', error);
        }
      };

      fetchJoinedWaitlists();
    }
  }, [userId]);  // Fetch joined waitlists when userId is available

  // Handle joining a waitlist
  const handleJoinWaitlist = async (waitlistId) => {
    if (!userId) {
      alert('User ID not found');
      return;
    }
  
    // Optimistically update UI
    setJoinedWaitlists((prev) => [...prev, waitlistId]);
  
    try {
      await axios.post(`https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/${waitlistId}/join`, { userId });
    } catch (error) {
      console.error('Error joining waitlist:', error);
      // Revert UI on error
      setJoinedWaitlists((prev) => prev.filter(id => id !== waitlistId));
      alert('Could not join the waitlist.');
    }
  };
  
  const handleLeaveWaitlist = async (waitlistId) => {
    if (!userId) {
      alert('User ID not found');
      return;
    }
  
    // Optimistically update UI
    setJoinedWaitlists((prev) => prev.filter(id => id !== waitlistId));
  
    try {
      await axios.delete(`https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/${waitlistId}/leave`, { data: { userId } });
    } catch (error) {
      console.error('Error leaving waitlist:', error);
      // Revert UI on error
      setJoinedWaitlists((prev) => [...prev, waitlistId]);
      alert('Could not leave the waitlist.');
    }
  };
  return (
    <ul>
      {waitlists.map((waitlist) => (
        <li key={waitlist.id} className="mb-4">
          {waitlist.serviceName} - {waitlist.waitTime} mins - {waitlist.status}

          {/* If the customer is not on the waitlist, show the "Join" button */}
          {!joinedWaitlists.includes(waitlist.id) && (
            <button
              onClick={() => handleJoinWaitlist(waitlist.id)}
              className="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Join Waitlist
            </button>
          )}

          {/* If the customer is on the waitlist, show the "Leave" button */}
          {joinedWaitlists.includes(waitlist.id) && (
            <button
              onClick={() => handleLeaveWaitlist(waitlist.id)}
              className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
            >
              Leave Waitlist
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};
export default CustomerWaitlistList;