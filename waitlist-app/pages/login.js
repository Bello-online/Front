import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    // Other validation Logic
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await axios.post('https://backend-deploy-0d782579924c.herokuapp.com/api/users/login', formData);
      const { role, userId, username } = response.data;

      // Store user information in local storage
      localStorage.setItem('userId', userId)
      localStorage.setItem('username', username) // User Name for header 

      if (role === 'business_owner') {
        router.push('/business-dashboard');
      } else {
        router.push('/customer-dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="bg-black p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-2 border rounded text-black"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded text-black"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
