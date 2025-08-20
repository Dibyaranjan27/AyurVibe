import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  ChartPieIcon,
  ChatBubbleBottomCenterTextIcon,
  HomeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

type SidebarProps = {
  user: any;
  // CHANGE: Added 'notifications' to the activeView type
  activeView: string;
  setActiveView: React.Dispatch<React.SetStateAction<'dashboard' | 'profile' | 'feedback' | 'notifications'>>;
  handleLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView, handleLogout }) => {
  const sidebarLinks = [
    { name: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, action: () => setActiveView('dashboard') },
    // CHANGE: Added Notifications to the array with an action
    { name: 'Notifications', icon: <BellIcon className="w-6 h-6" />, action: () => setActiveView('notifications') },
    { name: 'Profile', icon: <UserCircleIcon className="w-6 h-6" />, action: () => setActiveView('profile') },
    { name: 'Feedback', icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />, action: () => setActiveView('feedback') },
    // "Take Quiz" remains a Link because it goes to a different URL
    { name: 'Take Quiz', icon: <ChartPieIcon className="w-6 h-6" />, path: '/quiz' },
  ];

  return (
    <aside className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex-col hidden lg:flex">
      <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
        <UserCircleIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 font-bold text-lg text-gray-800 dark:text-white truncate">Hi, {user.name || 'User'}</h3>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarLinks.map((link) => (
          link.path ? (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ) : (
            <button
              key={link.name}
              onClick={link.action}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                activeView === link.name.toLowerCase() 
                ? 'bg-ayurGreen/10 text-ayurGreen font-bold dark:bg-ayurBeige/10 dark:text-ayurBeige' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          )
        ))}
      </nav>
      
      <div className="p-4 border-t pb-28 border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-4 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;