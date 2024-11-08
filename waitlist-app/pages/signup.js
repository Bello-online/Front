import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'customer',
    phoneNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) newErrors.phoneNumber = 'Phone number is required and should be at least 10 digits';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
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
      await axios.post('https://backend-deploy-0d782579924c.herokuapp.com/api/users/signup', formData);
      alert('Sign-up successful!');
      router.push('/login');
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="bg-black p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
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

          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded text-black"
          />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded text-black"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
          >
            <option value="customer">Customer</option>
            <option value="business_owner">Business Owner</option>
          </select>

          <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;