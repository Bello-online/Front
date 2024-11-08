import React from 'react';
import { useSession } from 'next-auth/react';
import SignupPage from './pages/auth/signup';
import SignIn from './pages/auth/signin';
import WaitlistForm from './components/WaitlistForm';
import WaitlistList from './components/WaitlistList';

const App = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Waitlist Management System</h1>
      {!session ? (
        <>
          <h2>Sign Up</h2>
          <SignupPage /> {/* Sign-up form */}
          <h2>Login</h2>
          <SignIn /> {/* Login form from NextAuth.js */}
        </>
      ) : (
        <>
          <h2>Create a Waitlist</h2>
          <WaitlistForm /> {/* Waitlist creation form, accessible after login */}
          <h2>Available Waitlists</h2>
          <WaitlistList /> {/* List of waitlists */}
        </>
      )}
    </div>
  );
};

export default App;
