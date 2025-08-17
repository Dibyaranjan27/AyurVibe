import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { prakritiPlans } from '../data/prakritiPlans';
import BalanceCheckModal from './BalanceCheckModal';
import ProgressLineChart from './ProgressLineChart';
import QuoteCard from './QuoteCard';
import RemindersCard from './RemindersCard';
import StreakCalendarModal from './StreakCalendarModal';
import StatCard from './StatCard';
import DietDonutChart from '@/components/DietDonutChart';
import RecommendationCard from '@/components/RecommendationCard';
import RoutineTimetable from '@/components/RoutineTimetable';
import { CalendarDaysIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { AppContext } from '../context/AppContext';
import { db } from '../data/firebase'; // Assume firebase config file
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const dailyQuotes = [
  { quote: 'The greatest wealth is health.', author: 'Virgil' },
  { quote: 'He who has health has hope; and he who has hope, has everything.', author: 'Thomas Carlyle' },
  { quote: 'Wellness is the complete integration of body, mind, and spirit.', author: 'B.K.S. Iyengar' },
];

type DashboardViewProps = {
  user: any;
  balanceHistory: { date: string; score: number }[];
  setBalanceHistory: React.Dispatch<React.SetStateAction<{ date: string; score: number }[]>>;
  streakDays: Date[];
  setStreakDays: React.Dispatch<React.SetStateAction<Date[]>>;
  reminders: { id: number; text: string; completed: boolean; dateTime: Date | null }[];
  setReminders: React.Dispatch<React.SetStateAction<{ id: number; text: string; completed: boolean; dateTime: Date | null }[]>>;
  activePlanTab: string;
  setActivePlanTab: React.Dispatch<React.SetStateAction<string>>;
};

const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  balanceHistory,
  setBalanceHistory,
  streakDays,
  setStreakDays,
  reminders,
  setReminders,
  activePlanTab,
  setActivePlanTab,
}) => {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  const { setUser } = useContext(AppContext);

  useEffect(() => {
    const loadData = async () => {
      if (user.id) {
        const userDoc = doc(db, 'users', user.id);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setBalanceHistory(data.balanceHistory || []);
          setStreakDays(data.streakDays ? data.streakDays.map((d: string) => new Date(d)) : []);
          setReminders(data.reminders || []);
        }
      }
    };
    loadData();
  }, [user.id]);

  useEffect(() => {
    const updateFirebase = async () => {
      if (user.id) {
        const userDoc = doc(db, 'users', user.id);
        await updateDoc(userDoc, {
          balanceHistory,
          streakDays: streakDays.map((d) => d.toISOString()),
          reminders,
        });
      }
    };
    updateFirebase();
  }, [balanceHistory, streakDays, reminders, user.id]);

  const handleLogBalance = (newScore: number) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newHistory = balanceHistory.filter((entry) => entry.date !== todayStr);
    setBalanceHistory([...newHistory.slice(-29), { date: todayStr, score: newScore }]);
    const todayAlreadyLogged = streakDays.some((d) => new Date(d).toDateString() === new Date().toDateString());
    if (!todayAlreadyLogged) {
      setStreakDays((prev) => [...prev, new Date()]);
    }
  };

  const currentBalanceScore = balanceHistory.length > 0 ? balanceHistory[balanceHistory.length - 1].score : 0;
  const prakritiString = user.prakriti || 'Vata-Pitta';
  const primaryDosha = prakritiString.split('-')[0];
  const plan = prakritiPlans[prakritiString] || prakritiPlans[primaryDosha];
  const quoteIndex = new Date().getDate() % dailyQuotes.length;
  const todayQuote = dailyQuotes[quoteIndex];

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-8 mb-20">
        <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-lora font-bold text-gray-800 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name || 'User'}!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Primary Dosha" value={primaryDosha} icon={<SparklesIcon className="w-6 h-6" />} />
            <StatCard title="Daily Balance" value={`${currentBalanceScore}%`} icon={<CheckCircleIcon className="w-6 h-6" />} onClick={() => setIsBalanceModalOpen(true)} />
            <StatCard title="Wellness Streak" value={`${streakDays.length} Days`} icon={<CalendarDaysIcon className="w-6 h-6" />} onClick={() => setIsStreakModalOpen(true)} />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <div className="lg:col-span-2">
            <ProgressLineChart data={balanceHistory} />
          </div>
          <div className="lg:col-span-1">
            <RemindersCard reminders={reminders} setReminders={setReminders} />
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <QuoteCard {...todayQuote} />
        </motion.div>

        <motion.div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <h3 className="text-3xl font-lora text-center text-ayurGreen dark:text-ayurBeige mb-6">Your Personalized Plan</h3>
          <div className="border-b border-gray-300 dark:border-gray-600 mb-6 flex justify-center space-x-4 sm:space-x-8">
            {['recommendations', 'diet', 'routine'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePlanTab(tab)}
                className={`py-2 px-4 font-semibold capitalize transition-colors duration-300 ${activePlanTab === tab ? 'text-ayurGreen border-b-2 border-ayurGreen' : 'text-gray-500 hover:text-ayurGreen'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4 min-h-[400px]">
            {plan && activePlanTab === 'recommendations' && (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                {plan.recommendations.map((rec, index) => (
                  <RecommendationCard key={index} {...rec} />
                ))}
              </motion.div>
            )}
            {plan && activePlanTab === 'diet' && <DietDonutChart {...plan.diet} />}
            {plan && activePlanTab === 'routine' && <RoutineTimetable routine={plan.routine} />}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isBalanceModalOpen && <BalanceCheckModal onLog={handleLogBalance} onClose={() => setIsBalanceModalOpen(false)} />}
        {isStreakModalOpen && <StreakCalendarModal streakDays={streakDays} setStreakDays={setStreakDays} onClose={() => setIsStreakModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default DashboardView;