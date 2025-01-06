import { render } from '@testing-library/react';
import CustomerWaitlists from '../pages/customer-dashboard/waitlists';
import axios from 'axios';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/customer-dashboard/waitlists',
  }),
}));

// Mock axios
jest.mock('axios');

// Mock UI components
jest.mock('../components/ui/card', () => ({
  Card: ({ children }) => <div className="card">{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardDescription: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
}));

jest.mock('../components/ui/button', () => ({
  Button: ({ children }) => <button>{children}</button>,
}));

jest.mock('../components/navbar', () => ({
  __esModule: true,
  default: () => <nav>Navbar</nav>,
}));

// Mock SearchBar component
jest.mock('../components/SearchBar', () => ({
  __esModule: true,
  default: () => <input placeholder="Search by service name" />,
}));

// Mock @/components/modal
jest.mock('@/components/modal', () => ({
  Modal: ({ children, title, isOpen }) => (
    isOpen ? (
      <div data-testid="modal">
        <div>{title}</div>
        {children}
      </div>
    ) : null
  )
}));

// Mock Icons
jest.mock('lucide-react', () => ({
  Clock: () => <span>Clock Icon</span>,
  Users: () => <span>Users Icon</span>
}));

describe('Customer Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('userId', 'test-customer-id');
    localStorage.setItem('userRole', 'customer');
  });

  test('renders header and search bar', () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const { getByText, getByPlaceholderText } = render(<CustomerWaitlists />);
    expect(getByText('Available Waitlists')).toBeInTheDocument();
    expect(getByPlaceholderText('Search by service name')).toBeInTheDocument();
  });

  test('renders navbar', () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const { getByText } = render(<CustomerWaitlists />);
    expect(getByText('Navbar')).toBeInTheDocument();
  });
}); 