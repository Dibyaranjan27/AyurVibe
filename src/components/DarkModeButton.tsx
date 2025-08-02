import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeButton: React.FC = () => {
  const context = useContext(AppContext);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    if (context) {
      context.setDarkMode(!isDark); // Sync with AppContext
    }
  };

  if (!context) return null;

  return (
    <button 
      onClick={toggleDarkMode}
      className="fixed top-32 right-6 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg z-50"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-700" />}
    </button>
  );
};

export default DarkModeButton;