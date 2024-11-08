import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');  // Redirect to login page
  };

  const handleSignupClick = () => {
    router.push('/signup');  // Redirect to sign-up page
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to WaitlistApp</h1>
      <p className="text-center mb-6">Manage your waitlists efficiently, whether you're a business owner or a customer.</p>

      <div className="flex justify-center space-x-4">
        <button onClick={handleLoginClick} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        <button onClick={handleSignupClick} className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</button>
      </div>
    </div>
  );
};

export default HomePage;

