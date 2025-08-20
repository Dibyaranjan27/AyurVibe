import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { db } from '../data/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Data
import { prakritiPlans } from '../data/prakritiPlans';

// Child Components
import BalanceCheckModal from '../components/BalanceCheckModal';
import ProgressLineChart from '../components/ProgressLineChart';
import QuoteCard from '../components/QuoteCard';
import RemindersCard from '../components/RemindersCard';
import StreakCalendarModal from '../components/StreakCalendarModal';
import DoshaInfoModal from '../components/DoshaInfoModal';
import StatCard from '../components/StatCard';
import DietDonutChart from '../components/DietDonutChart';
import RecommendationCard from '../components/RecommendationCard';
import RoutineTimetable from '../components/RoutineTimetable';

// Icons
import { CalendarDaysIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const dailyQuotes = [
  { quote: 'The greatest wealth is health.', author: 'Virgil' },
  { quote: 'He who has health has hope; and he who has hope, has everything.', author: 'Thomas Carlyle' },
  { quote: 'Wellness is the complete integration of body, mind, and spirit.', author: 'B.K.S. Iyengar' },
  { quote: 'To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.', author: 'Buddha' },
  { quote: 'The body is your temple. Keep it pure and clean for the soul to reside in.', author: 'B.K.S. Iyengar' },
  { quote: 'Health is a state of body. Wellness is a state of being.', author: 'J. Stanford' },
  { quote: 'The part can never be well unless the whole is well.', author: 'Plato' },
  { quote: 'A calm mind brings inner strength and self-confidence, so that\'s very important for good health.', author: 'Dalai Lama' },
  { quote: 'The preservation of health is a duty. Few seem conscious that there is such a thing as physical morality.', author: 'Herbert Spencer' },
  { quote: 'Your body hears everything your mind says.', author: 'Naomi Judd' },
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
  const [isDoshaModalOpen, setIsDoshaModalOpen] = useState(false);
  
  // CHANGE: Removed the unused 'setUser' variable.
  // The user object is passed in via props, so we don't need to get it from context here.

  // Effect to load data from Firebase on component mount
  useEffect(() => {
    const loadData = async () => {
      // CHANGE: Used optional chaining for a cleaner check.
      if (user?.id) {
        const userDoc = doc(db, 'users', user.id);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setBalanceHistory(data.balanceHistory || []);
          setStreakDays(data.streakDays ? data.streakDays.map((d: any) => new Date(d.seconds * 1000)) : []);
          const formattedReminders = (data.reminders || []).map((r: any) => ({
            ...r,
            dateTime: r.dateTime ? new Date(r.dateTime.seconds * 1000) : null,
          }));
          setReminders(formattedReminders);
        }
      }
    };
    loadData();
  }, [user?.id, setBalanceHistory, setReminders, setStreakDays]);

  // Effect to update Firebase when local data changes
  useEffect(() => {
    const updateFirebase = async () => {
      // CHANGE: Used optional chaining.
      if (user?.id) {
        const userDoc = doc(db, 'users', user.id);
        await updateDoc(userDoc, {
          balanceHistory,
          streakDays,
          reminders,
        }).catch(err => console.error("Firebase update failed:", err));
      }
    };
    // Only run the update if the user exists and data is not empty, to prevent unnecessary writes on load.
    if (user?.id && (balanceHistory.length > 0 || streakDays.length > 0 || reminders.length > 0)) {
        updateFirebase();
    }
  }, [balanceHistory, streakDays, reminders, user?.id]);

  const handleLogBalance = (newScore: number) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newHistory = balanceHistory.filter((entry) => entry.date !== todayStr);
    setBalanceHistory([...newHistory.slice(-29), { date: todayStr, score: newScore }]);
    
    const todayAlreadyLogged = streakDays.some((d) => format(d, 'yyyy-MM-dd') === todayStr);
    if (!todayAlreadyLogged) {
      setStreakDays((prev) => [...prev, new Date()]);
    }
  };

  const processBalanceHistoryForChart = (history: { date: string; score: number }[], days: number = 30) => {
    const processedData: { date: string; score: number }[] = [];
    const historyMap = new Map(history.map(item => [item.date, item.score]));
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      processedData.push({
        date: dateStr,
        score: historyMap.get(dateStr) || 0,
      });
    }
    return processedData;
  };
  
  const chartData = processBalanceHistoryForChart(balanceHistory);
  const currentBalanceScore = balanceHistory.length > 0 ? balanceHistory[balanceHistory.length - 1].score : 0;
  const prakritiString = user?.prakriti || 'Vata-Pitta';
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
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name || 'User'}!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Primary Dosha" value={primaryDosha} icon={<SparklesIcon className="w-6 h-6" />} onClick={() => setIsDoshaModalOpen(true)} />
            <StatCard title="Daily Balance" value={`${currentBalanceScore}%`} icon={<CheckCircleIcon className="w-6 h-6" />} onClick={() => setIsBalanceModalOpen(true)} />
            <StatCard title="Wellness Streak" value={`${streakDays.length} Days`} icon={<CalendarDaysIcon className="w-6 h-6" />} onClick={() => setIsStreakModalOpen(true)} />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <div className="lg:col-span-2">
            <ProgressLineChart data={chartData} />
          </div>
          <div className="lg:col-span-1">
            <RemindersCard />
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
                className={`py-2 px-4 font-semibold capitalize transition-colors duration-300 ${activePlanTab === tab ? 'text-ayurGreen dark:text-ayurBeige border-b-2 border-ayurGreen dark:border-ayurBeige' : 'text-gray-500 hover:text-ayurGreen dark:hover:text-ayurBeige'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4 min-h-[400px]">
            {plan && activePlanTab === 'recommendations' && (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                {/* CHANGE: Using a more stable key than the array index. */}
                {plan.recommendations.map((rec: any, index: number) => (
                  <RecommendationCard key={`${rec.category}-${index}`} {...rec} />
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
        {isStreakModalOpen && <StreakCalendarModal streakDays={streakDays} onClose={() => setIsStreakModalOpen(false)} />}
        {isDoshaModalOpen && <DoshaInfoModal dosha={primaryDosha} onClose={() => setIsDoshaModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default DashboardView;