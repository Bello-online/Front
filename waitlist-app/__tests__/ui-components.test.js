import { render } from '@testing-library/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';

describe('UI Components', () => {
  test('renders Card component', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(getByText('Test Card')).toBeInTheDocument();
  });

  test('renders Button component', () => {
    const { getByText } = render(
      <Button>Click Me</Button>
    );
    expect(getByText('Click Me')).toBeInTheDocument();
  });

  test('renders Alert component', () => {
    const { getByText } = render(
      <Alert>
        <AlertTitle>Test Alert</AlertTitle>
        Alert Message
      </Alert>
    );
    expect(getByText('Test Alert')).toBeInTheDocument();
    expect(getByText('Alert Message')).toBeInTheDocument();
  });

  test('renders multiple components together', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card with Button</CardTitle>
        </CardHeader>
        <Button>Test Button</Button>
      </Card>
    );
    expect(getByText('Card with Button')).toBeInTheDocument();
    expect(getByText('Test Button')).toBeInTheDocument();
  });
}); 