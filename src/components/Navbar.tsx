import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DarkModeButton from './DarkModeButton';

const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!context) return null;
  const { user, darkMode } = context;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    if (context && context.setUser) {
      context.setUser(null); // Assuming logout clears user state
      navigate('/login');
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 mx-auto shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center space-x-8">
        <a href="/" ><img src="src/assets/logo.png" alt="AyurVibe" className="h-24" /></a>
        <div className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-800 hover:text-ayurGreen dark:text-white dark:hover:text-ayurGreen">Home</a>
          <a href="/quiz" className="text-gray-800 hover:text-ayurGreen dark:text-white dark:hover:text-ayurGreen">Quiz</a>
          <a href="/dashboard" className="text-gray-800 hover:text-ayurGreen dark:text-white dark:hover:text-ayurGreen">Dashboard</a>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <DarkModeButton />
        {user ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
              aria-label="Toggle user menu"
            >
              <div className="w-10 h-10 rounded-full bg-ayurGreen flex items-center justify-center text-white font-bold">
                {user.name ? user.name[0] : 'U'}
              </div>
              <ChevronDown className="h-5 w-5 text-gray-800 dark:text-white" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out origin-top-right">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700"
                >
                  Profile
                </a>
                <a
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700"
                >
                  Dashboard
                </a>
                <a
                  href="/notifications"
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700"
                >
                  Notifications
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <a href="/login" className="text-gray-800 hover:text-ayurGreen dark:text-white">Login</a>
            <a href="/register" className="text-gray-800 hover:text-ayurGreen dark:text-white">Register</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;