// This code will now work as you intended.

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import FloatingLeaves from '../components/FloatingLeaves';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView'; // Corrected path assuming it's a view
import ProfileView from '../pages/ProfileView';
import FeedbackView from '../pages/FeedbackView';
import NotificationView from '../pages/NotificationView'; // Corrected path assuming it's a view

const generateInitialHistory = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      score: 60 + Math.floor(Math.random() * 25),
    });
  }
  return data;
};

const initialBalanceHistory = generateInitialHistory();
const initialStreakDays = [new Date(Date.now() - 86400000 * 2), new Date(Date.now() - 86400000)];
const initialReminders: { id: number; text: string; completed: boolean; dateTime: Date | null }[] = [
  { id: 1, text: 'Drink warm ginger tea', completed: true, dateTime: null },
  { id: 2, text: '10-minute evening meditation', completed: false, dateTime: new Date(new Date().setHours(21, 0, 0, 0)) },
];

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'feedback' | 'notifications'>('dashboard');
  const [balanceHistory, setBalanceHistory] = useState(initialBalanceHistory);
  const [streakDays, setStreakDays] = useState(initialStreakDays);
  const [reminders, setReminders] = useState(initialReminders);
  const [activePlanTab, setActivePlanTab] = useState('recommendations');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view') as 'profile' | 'feedback' | 'notifications';
    if (view && ['profile', 'feedback', 'notifications'].includes(view)) {
      setActiveView(view);
    } else {
      setActiveView('dashboard');
    }
  }, [location.search]);

  if (!context) return <div className="min-h-screen flex items-center justify-center">Loading App...</div>;
  const { user, setUser } = context;

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900">Loading User...</div>;

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="relative h-screen bg-gray-200 dark:bg-gray-900 overflow-hidden font-openSans">
      <FloatingLeaves />
      <div className="relative z-10 flex h-full mt-24">
        <Sidebar user={user} activeView={activeView} setActiveView={setActiveView} handleLogout={handleLogout} />
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
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
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileView />
              </motion.div>
            )}
            {activeView === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FeedbackView />
              </motion.div>
            )}
            {activeView === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
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