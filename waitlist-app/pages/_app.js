import '../styles/globals.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';  // Import Navbar
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  // Assuming userRole can be determined here, or passed dynamically to each page component
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : 'guest';  // Fetching userRole from localStorage
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* <Navbar userRole={userRole} /> Include Navbar here */}
      <main className="flex-grow container mx-auto p-4">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;