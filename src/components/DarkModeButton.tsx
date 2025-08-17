import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeButton: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { darkMode, toggleDarkMode } = context;

  return (
    <button
      onClick={() => {
        toggleDarkMode();
        document.documentElement.classList.toggle('dark');
      }}
      className="fixed top-32 right-6 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg z-50"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="text-yellow-500" />
      ) : (
        <Moon className="text-gray-700" />
      )}
    </button>
  );
};

export default DarkModeButton;