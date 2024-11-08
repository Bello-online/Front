import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Header = () => {
  const [username, setUsername] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State to toggle the modal
  const router = useRouter();

  useEffect(() => {
    // Get the username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Handle logout by clearing local storage and redirecting to the login page
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setShowLogoutModal(false); // Close modal on logout
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          WaitlistApp
        </Link>

        <div className="flex items-center space-x-4">
          {username && <p className="text-sm">Welcome, {username}!</p>}

          {/* Show Login/Signup if not logged in, else show Logout */}
          {username ? (
            <button
              onClick={() => setShowLogoutModal(true)} // Show modal on click
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <nav>
              <Link href="/login" className="mr-4 hover:underline">Login</Link>
              <Link href="/signup" className="hover:underline">Sign Up</Link>
            </nav>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
