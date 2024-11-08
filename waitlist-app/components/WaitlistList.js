import { useState, useEffect } from 'react';
import axios from 'axios';

const WaitlistList = () => {
  const [waitlists, setWaitlists] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    serviceName: '',
    waitTime: '',
    status: ''
  });

  // Fetch waitlists when component mounts
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

  // Start editing a waitlist
  const handleEditClick = (waitlist) => {
    setEditingId(waitlist.id);
    setEditFormData({
      serviceName: waitlist.serviceName,
      waitTime: waitlist.waitTime,
      status: waitlist.status
    });
  };

  // Update waitlist
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/${editingId}`, editFormData);
      setEditingId(null);
      window.location.reload();  // Reload to see updated data
    } catch (error) {
      console.error('Error updating waitlist:', error);
    }
  };

  // Delete waitlist
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/${id}`);
      window.location.reload();  // Reload to remove deleted item from view
    } catch (error) {
      console.error('Error deleting waitlist:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Waitlists</h2>
      <ul className="space-y-2">
        {waitlists.map((waitlist) => (
          <li key={waitlist.id} className="border p-1 rounded">
            {editingId === waitlist.id ? (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  name="serviceName"
                  value={editFormData.serviceName}
                  onChange={(e) => setEditFormData({ ...editFormData, serviceName: e.target.value })}
                  placeholder="Service Name"
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  name="waitTime"
                  value={editFormData.waitTime}
                  onChange={(e) => setEditFormData({ ...editFormData, waitTime: e.target.value })}
                  placeholder="Wait Time (mins)"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="status"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  placeholder="Status"
                  className="p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Save
                </button>
              </form>
            ) : (
              <>
                <span>{waitlist.serviceName} - {waitlist.waitTime} mins - {waitlist.status}</span>
                <button
                  className="ml-2 bg-yellow-500 text-white p-1 rounded"
                  onClick={() => handleEditClick(waitlist)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 bg-red-500 text-white p-1 rounded"
                  onClick={() => handleDelete(waitlist.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WaitlistList;