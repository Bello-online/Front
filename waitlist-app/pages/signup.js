import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from '@/components/modal';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'customer',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmButton: 'OK'
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Phone number is required and should be at least 10 digits';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    if (!formData.username) validationErrors.username = 'Username is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (!formData.phone) validationErrors.phone = 'Phone number is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.role) validationErrors.role = 'Role is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setModalState({
        isOpen: true,
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        confirmButton: 'OK'
      });
      return;
    }

    try {
      const response = await axios.post('https://backend-deploy-0d782579924c.herokuapp.com/api/users/signup', formData);
      if (response.data.success) {
        setModalState({
          isOpen: true,
          title: 'Success',
          description: 'Account created successfully! Please log in.',
          confirmButton: 'OK'
        });
        router.push('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setModalState({
        isOpen: true,
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create account',
        confirmButton: 'OK'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" value={formData.role} onValueChange={(value) => handleChange({ target: { name: 'role', value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="business_owner">Business Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
      <Modal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        description={modalState.description}
        confirmButton={modalState.confirmButton}
      />
    </div>
  );
};

export default SignupPage;