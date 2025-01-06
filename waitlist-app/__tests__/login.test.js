import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/login';
import axios from 'axios';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/login',
    query: {},
    asPath: '/login',
  }),
}));

// Mock axios
jest.mock('axios');

describe('Login Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
    axios.post.mockClear();
  });

  test('validates required fields', async () => {
    const { getByRole, findByText } = render(<LoginPage />);
    
    // Click login without entering data
    fireEvent.click(getByRole('button', { name: /login/i }));
    
    // Check for validation messages
    expect(await findByText('Username is required')).toBeInTheDocument();
    expect(await findByText('Password is required')).toBeInTheDocument();
  });

  test('successful business owner login', async () => {
    // Mock successful login response to match actual API structure
    axios.post.mockResolvedValueOnce({
      data: {
        role: 'business_owner',
        userId: '123',
        username: 'Dare'
      }
    });

    const { getByLabelText, getByRole } = render(<LoginPage />);
    
    // Fill in login form
    fireEvent.change(getByLabelText(/username/i), { 
      target: { value: 'Dare' }
    });
    fireEvent.change(getByLabelText(/password/i), { 
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(getByRole('button', { name: /login/i }));

    // Wait for localStorage to be updated
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'business_owner');
      expect(localStorage.setItem).toHaveBeenCalledWith('username', 'Dare');
    });
  });

  test('handles login error', async () => {
    // Mock failed login response
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid username or password'
        }
      }
    });

    const { getByLabelText, getByRole, findByText } = render(<LoginPage />);
    
    // Fill in login form
    fireEvent.change(getByLabelText(/username/i), { 
      target: { value: 'wronguser' }
    });
    fireEvent.change(getByLabelText(/password/i), { 
      target: { value: 'wrongpass' }
    });
    
    // Submit form
    fireEvent.click(getByRole('button', { name: /login/i }));

    // Verify error message appears
    expect(await findByText('Invalid username or password')).toBeInTheDocument();
  });

  test('successful customer login', async () => {
    // Mock successful login response for customer
    axios.post.mockResolvedValueOnce({
      data: {
        role: 'customer',
        userId: '456',
        username: 'customer1'
      }
    });

    const { getByLabelText, getByRole } = render(<LoginPage />);
    
    // Fill in login form
    fireEvent.change(getByLabelText(/username/i), { 
      target: { value: 'customer1' }
    });
    fireEvent.change(getByLabelText(/password/i), { 
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(getByRole('button', { name: /login/i }));

    // Wait for localStorage to be updated
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('userId', '456');
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'customer');
      expect(localStorage.setItem).toHaveBeenCalledWith('username', 'customer1');
    });
  });

  test('form validation for invalid input', async () => {
    const { getByLabelText, getByRole, findByText } = render(<LoginPage />);
    
    // Fill in form with invalid data
    fireEvent.change(getByLabelText(/username/i), { 
      target: { value: 'a' }
    });
    fireEvent.change(getByLabelText(/password/i), { 
      target: { value: '123' }
    });
    
    // Submit form
    fireEvent.click(getByRole('button', { name: /login/i }));
    
    // Check for the actual error message used in the component
    expect(await findByText('Invalid username or password')).toBeInTheDocument();
  });
}); 