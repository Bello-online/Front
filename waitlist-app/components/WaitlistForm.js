import { useState } from 'react';
import axios from 'axios';

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
    console.log('Sending form data: ', formData);

    try {
      const response = await axios.post('https://backend-deploy-0d782579924c.herokuapp.com/api/waitlists/create', formData);
      console.log('Waitlist Created:', response.data);
    } catch (error) {
      console.error('Error creating waitlist:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-lg ">
      <input
        type="text"
        name="serviceName"
        value={formData.serviceName}
        onChange={handleChange}
        placeholder="Service Name"
        className="p-2 border rounded w-full text-black"
      />
      <input
        type="number"
        name="waitTime"
        value={formData.waitTime}
        onChange={handleChange}
        placeholder="Wait Time (mins)"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="status"
        value={formData.status}
        onChange={handleChange}
        placeholder="Status"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="p-2 border rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Create Waitlist
      </button>
    </form>
  );
};

export default WaitlistForm;