import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { db } from '../data/firebase'; // Ensure you have this import
import { doc, getDoc } from 'firebase/firestore'; // Ensure you have these imports
import FloatingLeaves from '../components/FloatingLeaves';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView';
import ProfileView from '../pages/ProfileView';
import FeedbackView from '../pages/FeedbackView';
import NotificationView from '../pages/NotificationView';

// Define the Reminder type for better state management
type Reminder = { 
  id: number; 
  text: string; 
  completed: boolean; 
  dateTime: Date | null 
};

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Hooks are at the top ---
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'feedback' | 'notifications'>('dashboard');
  
  // CHANGE: State is now initialized as empty. Data will be fetched from Firebase.
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; score: number }[]>([]);
  const [streakDays, setStreakDays] = useState<Date[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activePlanTab, setActivePlanTab] = useState('recommendations');
  const [isLoading, setIsLoading] = useState(true); // State to handle loading
  
  const { user, setUser } = context || {};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view') as 'profile' | 'feedback' | 'notifications';
    if (view && ['profile', 'feedback', 'notifications'].includes(view)) {
      setActiveView(view);
    } else {
      setActiveView('dashboard');
    }
  }, [location.search]);

  // This useEffect redirects if the user is not logged in
  useEffect(() => {
    if (context && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate, context]);

  // CHANGE: New useEffect to fetch all user data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          // Set balance history
          setBalanceHistory(data.balanceHistory || []);

          // Set streak days, converting Firebase Timestamps to JS Dates
          const streakData = data.streakDays || [];
          setStreakDays(streakData.map((d: any) => new Date(d.seconds * 1000)));

          // Set reminders, converting Firebase Timestamps to JS Dates
          const reminderData = data.reminders || [];
          setReminders(reminderData.map((r: any) => ({
            ...r,
            dateTime: r.dateTime ? new Date(r.dateTime.seconds * 1000) : null,
          })));
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // --- Conditional returns are now AFTER all hooks ---
  if (!context) {
    return <div className="min-h-screen flex items-center justify-center">Loading App...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900">Redirecting to login...</div>;
  }

  const handleLogout = () => {
    if (setUser) {
      setUser(null);
    }
    navigate('/login');
  };
  
  // Display a loading screen while fetching data from Firestore
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-white">Loading Your Dashboard...</div>;
  }

  return (
    <div className="relative h-screen bg-gray-200 dark:bg-gray-900 overflow-hidden font-openSans">
      <FloatingLeaves />
      <div className="relative mt-24 z-10 flex h-full">
        <Sidebar user={user} activeView={activeView} setActiveView={setActiveView} handleLogout={handleLogout} />
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-ayurGreen scrollbar-track-gray-100 dark:scrollbar-thumb-ayurBeige dark:scrollbar-track-gray-800">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <DashboardView
                  user={user}
                  balanceHistory={balanceHistory}
                  setBalanceHistory={setBalanceHistory}
                  streakDays={streakDays}
                  setStreakDays={setStreakDays}
                  reminders={reminders}
                  setReminders={setReminders}
                  activePlanTab={activePlanTab}
                  setActivePlanTab={setActivePlanTab}
                />
              </motion.div>
            )}
            {activeView === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <ProfileView />
              </motion.div>
            )}
            {activeView === 'feedback' && (
              <motion.div key="feedback" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <FeedbackView />
              </motion.div>
            )}
            {activeView === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <NotificationView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;