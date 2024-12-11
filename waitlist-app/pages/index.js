import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const HomePage = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <div className="container mx-auto px-4 h-[calc(100vh-theme(spacing.16))] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome to WaitlistApp</CardTitle>
          <CardDescription className="text-center">
            Manage your waitlists efficiently, whether you're a business owner or a customer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button onClick={handleLoginClick} variant="default">
            Login
          </Button>
          <Button onClick={handleSignupClick} variant="outline">
            Sign Up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;