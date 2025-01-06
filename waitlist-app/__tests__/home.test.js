import { render, fireEvent } from '@testing-library/react';
import HomePage from '../pages/index';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('Home Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush
    }));
  });

  test('renders welcome message', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('Welcome to WaitlistApp')).toBeInTheDocument();
  });

  test('navigates to login page when login button is clicked', () => {
    const { getByText } = render(<HomePage />);
    fireEvent.click(getByText('Login'));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('navigates to signup page when signup button is clicked', () => {
    const { getByText } = render(<HomePage />);
    fireEvent.click(getByText('Sign Up'));
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });
}); 