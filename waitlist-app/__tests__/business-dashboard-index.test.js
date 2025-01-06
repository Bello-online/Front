import { render } from '@testing-library/react';
import BusinessDashboard from '../pages/business-dashboard/index';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/business-dashboard',
  }),
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div className="card">{children}</div>,
  CardHeader: ({ children }) => <div className="card-header">{children}</div>,
  CardTitle: ({ children }) => <div className="card-title">{children}</div>,
  CardDescription: ({ children }) => <div className="card-description">{children}</div>,
  CardContent: ({ children }) => <div className="card-content">{children}</div>,
}));

// Mock components
jest.mock('../components/WaitlistForm', () => ({
  __esModule: true,
  default: () => <div>Waitlist Form</div>,
}));

jest.mock('../components/WaitlistList', () => ({
  __esModule: true,
  default: () => <div>Waitlist List</div>,
}));

jest.mock('../components/Navbar', () => ({
  __esModule: true,
  default: () => <nav>Navbar</nav>,
}));

describe('Business Dashboard Index', () => {
  test('renders main dashboard components', () => {
    const { getByText } = render(<BusinessDashboard />);
    
    expect(getByText('Business Dashboard')).toBeInTheDocument();
    expect(getByText('Create New Waitlist')).toBeInTheDocument();
    expect(getByText('Manage Waitlists')).toBeInTheDocument();
    expect(getByText('Waitlist Form')).toBeInTheDocument();
    expect(getByText('Waitlist List')).toBeInTheDocument();
  });

  test('renders navbar', () => {
    const { getByText } = render(<BusinessDashboard />);
    expect(getByText('Navbar')).toBeInTheDocument();
  });

  test('renders card descriptions', () => {
    const { getByText } = render(<BusinessDashboard />);
    expect(getByText('Add a new waitlist for your business')).toBeInTheDocument();
    expect(getByText('View, edit, and delete your current waitlists')).toBeInTheDocument();
  });
}); 