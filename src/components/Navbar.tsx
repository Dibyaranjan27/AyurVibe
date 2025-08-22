import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link, NavLink as RouterNavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { auth } from '../data/firebase';
import { signOut } from 'firebase/auth';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  ChartBarIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/solid';
import DarkModeButton from './DarkModeButton';
import logo from '/src/assets/logo.png';

const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <RouterNavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `text-gray-800 hover:text-ayurGreen dark:text-white dark:hover:text-ayurBeige transition-colors duration-200 font-medium ${
        isActive ? 'text-ayurGreen dark:text-ayurBeige' : ''
      }`
    }
  >
    {children}
  </RouterNavLink>
);

const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (context?.user?.name) {
      setUserName(context.user.name);
    } else {
      setUserName('');
    }
  }, [context?.user]);

  if (!context) return null;
  const { user} = context;

  const handleLogout = async () => {
    // FIX: The condition should check if a 'user' exists, not if 'setUser' function exists.
    if (user) {
      try {
        await signOut(auth);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-8 mx-auto shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-8">
          <Link to="/"><img src={logo} alt="AyurVibe" className="h-20 sm:h-24" /></Link>
          <div className="hidden md:flex space-x-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <DarkModeButton />
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-ayurGreen focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  <div className="w-10 h-10 rounded-full bg-ayurGreen flex items-center justify-center text-white font-bold text-lg">{userName ? userName[0].toUpperCase() : <UserCircleIcon className="w-6 h-6"/>}</div>
                  <ChevronDownIcon className={`h-5 w-5 text-gray-800 dark:text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 origin-top-right py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                        <p className="font-semibold text-gray-800 dark:text-white truncate">{userName}</p>
                      </div>
                      <div className="py-1">
                        {/* CHANGE: Updated dropdown links to use correct paths */}
                        <Link to="/dashboard?view=profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700">
                          <UserCircleIcon className="h-5 w-5 mr-3" /> Profile
                        </Link>
                        <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700">
                          <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
                        </Link>
                        <Link to="/dashboard?view=notifications" onClick={() => setIsDropdownOpen(false)} className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700">
                          <BellIcon className="h-5 w-5 mr-3" /> Notifications
                        </Link>
                        <Link to="/feedback" onClick={() => setIsDropdownOpen(false)} className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-ayurBeige dark:hover:bg-gray-700">
                          <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-3" /> Feedback
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-gray-800 hover:text-ayurGreen dark:text-white font-medium">Login</Link>
                <Link to="/register" className="px-4 py-2 text-gray-800 hover:text-ayurGreen dark:text-white font-medium">Register</Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col p-4">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}><img src="/src/assets/logo.png" alt="AyurVibe" className="h-20" /></Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md text-gray-800 dark:text-white"><XMarkIcon className="h-7 w-7" /></button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-grow space-y-8 text-2xl">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>Quiz</NavLink>
              {user && <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>}
              
              <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-8 mt-4 flex flex-col items-center space-y-6">
                {user ? (
                  <>
                    <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</NavLink>
                    {/* CHANGE: Added Notifications and Feedback links to the mobile menu */}
                    <NavLink to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>Notifications</NavLink>
                    <NavLink to="/feedback" onClick={() => setIsMobileMenuOpen(false)}>Feedback</NavLink>
                    <button onClick={handleLogout} className="text-red-600 dark:text-red-400 font-medium">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs text-center px-4 py-3 text-gray-800 dark:text-white font-medium border-2 border-gray-300 dark:border-gray-600 rounded-full">Login</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs text-center px-4 py-3 text-gray-800 dark:text-white font-medium border-2 border-gray-300 dark:border-gray-600 rounded-full">Register</Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;