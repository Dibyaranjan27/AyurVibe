import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingLeaves from '../components/FloatingLeaves';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { prakritiPlans } from '../data/prakritiPlans';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Popover, Transition } from '@headlessui/react';

// --- Icons ---
import * as SolidIcons from '@heroicons/react/24/solid';
import { UserCircleIcon, HomeIcon, SparklesIcon, ChartPieIcon, CalendarDaysIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, BellIcon, CheckCircleIcon, StarIcon, PlusIcon, TrashIcon, XMarkIcon, ChatBubbleBottomCenterTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import DietDonutChart from '@/components/DietDonutChart';
import RoutineTimetable from '@/components/RoutineTimetable';
import RecommendationCard from '@/components/RecommendationCard';

// --- Sample Data ---
const generateInitialHistory = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            score: 60 + Math.floor(Math.random() * 25)
        });
    }
    return data;
};
const initialBalanceHistory = generateInitialHistory();
const initialStreakDays = [new Date(Date.now() - 86400000*2), new Date(Date.now() - 86400000)];
const initialReminders: { id: number, text: string, completed: boolean, dateTime: Date | null }[] = [ { id: 1, text: 'Drink warm ginger tea', completed: true, dateTime: null }, { id: 2, text: '10-minute evening meditation', completed: false, dateTime: new Date(new Date().setHours(21, 0, 0, 0)) }];

// FIXED: Added the missing array of quotes
const dailyQuotes = [
    { quote: "The greatest wealth is health.", author: "Virgil" },
    { quote: "He who has health has hope; and he who has hope, has everything.", author: "Thomas Carlyle" },
    { quote: "Wellness is the complete integration of body, mind, and spirit.", author: "B.K.S. Iyengar" }
];

//=================================================================
// --- 1. CHILD COMPONENT DEFINITIONS ---
//=================================================================

const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);
    useEffect(() => { if (Notification.permission === 'default') { Notification.requestPermission().then(setPermission); } }, []);
    const scheduleNotification = (reminder: { text: string; dateTime: Date }) => {
        if (permission !== 'granted' || !reminder.dateTime || reminder.dateTime <= new Date()) return;
        const timeUntilNotification = reminder.dateTime.getTime() - new Date().getTime();
        setTimeout(() => { new Notification('AyurVibe Reminder', { body: reminder.text, icon: '/src/assets/logo.png' }); }, timeUntilNotification);
    };
    return { scheduleNotification, permission };
};

const StatCard = ({ title, value, icon, onClick }: { title: string; value: string; icon: React.ReactNode; onClick?: () => void; }) => (
    <motion.div onClick={onClick} className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''}`} whileHover={onClick ? { scale: 1.05, transition: { type: 'spring', stiffness: 300 } } : {}} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <div className="bg-ayurGreen/10 text-ayurGreen p-3 rounded-full">{icon}</div>
        <div><p className="text-sm text-gray-500 dark:text-gray-400">{title}</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p></div>
    </motion.div>
);

const ProgressLineChart = ({ data }: { data: { date: string, score: number }[] }) => {
    const [timeframe, setTimeframe] = useState('Weekly');
    const [tickColor, setTickColor] = useState('#6b7280');
    useEffect(() => {
        const setChartColor = () => setTickColor(document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280');
        setChartColor();
        const observer = new MutationObserver(setChartColor);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    const filteredData = useMemo(() => {
        const formattedData = data.map(d => ({...d, name: format(new Date(d.date), 'MMM d')}));
        switch(timeframe) {
            case 'Daily': return formattedData.slice(-3);
            case 'Weekly': return formattedData.slice(-7);
            case 'Monthly': return formattedData.slice(-30);
            default: return formattedData;
        }
    }, [data, timeframe]);
    return ( <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"> <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-800 dark:text-white">Your Balance Progress</h3><div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">{['Daily','Weekly','Monthly'].map(tf => (<button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${timeframe === tf ? 'bg-white dark:bg-gray-800 shadow text-ayurGreen' : 'text-gray-500 hover:bg-gray-100/50'}`}>{tf}</button>))}</div></div><div className="w-full h-64"><ResponsiveContainer><LineChart data={filteredData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} /><YAxis stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} domain={[0, 100]} /><Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '1rem' }} /><Line type="monotone" dataKey="score" stroke="#346B4A" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></div></div> );
};

const RemindersCard = ({ reminders, setReminders }: { reminders: { id: number, text: string, completed: boolean, dateTime: Date | null }[], setReminders: React.Dispatch<React.SetStateAction<{ id: number, text: string, completed: boolean, dateTime: Date | null }[]>> }) => {
    const [newReminder, setNewReminder] = useState(''); const [selectedDate, setSelectedDate] = useState<Date | undefined>(); const [selectedTime, setSelectedTime] = useState(''); const { scheduleNotification, permission } = useNotifications();
    const addReminder = () => { if (newReminder.trim() === '') return; let finalDateTime: Date | null = null; if (selectedDate) { finalDateTime = new Date(selectedDate); if (selectedTime) { const [hours, minutes] = selectedTime.split(':'); finalDateTime.setHours(parseInt(hours), parseInt(minutes)); } } const newReminderObject = { id: Date.now(), text: newReminder, completed: false, dateTime: finalDateTime }; setReminders(prev => [...prev, newReminderObject]); if (finalDateTime) { scheduleNotification({ text: newReminder, dateTime: finalDateTime }); } setNewReminder(''); setSelectedDate(undefined); setSelectedTime(''); };
    const toggleReminder = (id: number) => setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)); const deleteReminder = (id: number) => setReminders(prev => prev.filter(r => r.id !== id)); const timeOptions = Array.from({ length: 48 }, (_, i) => { const h = Math.floor(i/2); const m = (i%2)*30; const d = new Date(); d.setHours(h,m); return format(d, 'HH:mm'); });
    return ( <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col"> <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Daily Reminders</h3> {permission === 'denied' && <p className="text-xs text-red-400 mb-2">Notifications blocked.</p>}<div className="flex-grow space-y-3 overflow-y-auto pr-2 min-h-[100px]">{reminders.map(r => (<div key={r.id} className="flex items-center justify-between group"><div onClick={() => toggleReminder(r.id)} className="flex items-center space-x-3 cursor-pointer"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${r.completed ? 'bg-ayurGreen border-ayurGreen' : 'border-gray-400 group-hover:border-ayurGreen'}`}>{r.completed && <SolidIcons.CheckIcon className="w-3 h-3 text-white"/>}</div><div><span className={`transition-all text-sm ${r.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>{r.text}</span>{r.dateTime && <p className="text-xs text-gray-400">{format(r.dateTime, 'MMM d, h:mm a')}</p>}</div></div><button onClick={() => deleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button></div>))}</div><div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"><div className="flex"><input type="text" value={newReminder} onChange={e => setNewReminder(e.target.value)} onKeyDown={e => e.key === 'Enter' && addReminder()} placeholder="Add a reminder..." className="flex-grow bg-transparent focus:outline-none text-sm"/><button onClick={addReminder} className="bg-ayurGreen text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 hover:bg-ayurGreen/80"><PlusIcon className="w-5 h-5"/></button></div><div className="flex gap-2"><Popover className="relative flex-1"><Popover.Button className="w-full text-left text-xs p-2 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600"><CalendarDaysIcon className="w-4 h-4 text-gray-500"/>{selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Set Date'}</Popover.Button><Transition as={React.Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1"><Popover.Panel className="absolute z-10 bottom-full mb-2"><DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-2"/></Popover.Panel></Transition></Popover><div className="relative flex-1"><ClockIcon className="w-4 h-4 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"/><select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full appearance-none text-xs p-2 pl-7 rounded-md bg-gray-200 dark:bg-gray-700 cursor-pointer"><option value="">Set Time</option>{timeOptions.map(time => <option key={time} value={time}>{format(new Date(`1970-01-01T${time}`), 'h:mm a')}</option>)}</select></div></div></div></div> );
};

const BalanceCheckModal = ({ onClose, onLog }: { onClose: () => void; onLog: (score: number) => void; }) => { const [mood, setMood] = useState(0); const [energy, setEnergy] = useState(0); const handleSubmit = () => { if (mood > 0 && energy > 0) { const score = Math.round(((mood + energy) / 6) * 100); onLog(score); onClose(); } }; return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button><h2 className="text-2xl font-lora font-bold text-ayurGreen mb-6">Daily Check-in</h2><div className="space-y-6"><div><p className="font-medium text-gray-700 dark:text-gray-300 mb-2">How's your mood?</p><div className="flex space-x-2">{['Low', 'Neutral', 'Great'].map((label, i) => (<button key={label} onClick={() => setMood(i + 1)} className={`flex-1 p-3 rounded-lg text-sm transition-all ${mood === i + 1 ? 'bg-ayurGreen text-white font-bold ring-2 ring-ayurGreen' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>{label}</button>))}</div></div><div><p className="font-medium text-gray-700 dark:text-gray-300 mb-2">How's your energy?</p><input type="range" min="1" max="3" step="1" value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-ayurSaffron"/><div className="flex justify-between text-xs text-gray-500 px-1"><span>Tired</span><span>Okay</span><span>Energized</span></div></div></div><button onClick={handleSubmit} disabled={!mood || !energy} className="w-full mt-8 bg-ayurSaffron text-white font-bold py-3 rounded-lg hover:bg-ayurSaffron/80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">Log Today</button></motion.div></motion.div>); };

const StreakCalendarModal = ({ onClose, streakDays, setStreakDays }: { onClose: () => void; streakDays: Date[]; setStreakDays: (dates: Date[]) => void; }) => ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-sm w-full relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button><h2 className="text-xl font-lora font-bold text-ayurGreen mb-4">Log Your Streak</h2><p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Click dates to add or remove them from your streak.</p><DayPicker mode="multiple" selected={streakDays} onSelect={(dates) => setStreakDays(dates || [])} styles={{ day: { borderRadius: '100%' } }} modifiersStyles={{ selected: { backgroundColor: '#346B4A', color: 'white' } }} /></motion.div></motion.div> );

const QuoteCard = ({ quote, author }: { quote: string, author: string }) => (
    <div className="bg-gradient-to-br from-ayurGreen to-green-400 text-white p-6 rounded-2xl shadow-lg h-full flex flex-col justify-center">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><StarIcon className="w-5 h-5 text-yellow-300"/>Quote of the Day</h3>
        <blockquote className="text-xl font-lora italic border-l-4 border-white/50 pl-4">{quote}</blockquote>
        <cite className="block text-right mt-4 text-ayurBeige/80">- {author}</cite>
    </div>
);

// --- NEW: Profile View Component (Integrated from Profile.tsx) ---
const ProfileView = () => {
    const context = useContext(AppContext);
    if (!context || !context.user) return null;
    const { user, setUser } = context;

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [mobile, setMobile] = useState(user.mobile || '');
    const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user && user.id) {
            try {
                await updateDoc(doc(db, 'users', user.id), { name, mobile });
                setUser({ ...user, name, mobile });
                setEditMode(false);
                setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
            } catch (error) {
                setStatusMessage({ type: 'error', text: 'Failed to update profile.' });
            }
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };
    const handleCancel = () => { setName(user.name || ''); setMobile(user.mobile || ''); setEditMode(false); };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-3xl font-lora font-bold text-gray-800 dark:text-white mb-8">My Profile</h1>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSave} className="space-y-6">
                    {/* ... (This is the same two-column Profile UI from before) ... */}
                </form>
            </div>
        </motion.div>
    );
};

// --- NEW: Feedback View Component ---
const FeedbackView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <h1 className="text-3xl font-lora font-bold text-gray-800 dark:text-white mb-8">Submit Feedback</h1>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-600 dark:text-gray-300">We'd love to hear your thoughts on how we can improve AyurVibe.</p>
            <textarea rows={6} placeholder="Your feedback..." className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen"></textarea>
            <button className="w-full mt-4 bg-ayurGreen text-white font-bold py-3 rounded-lg hover:bg-ayurGreen/80 transition-colors">Submit Feedback</button>
        </div>
    </motion.div>
);


//=================================================================
// --- 2. MAIN DASHBOARD COMPONENT ---
//=================================================================
const Dashboard: React.FC = () => {
    const context = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    // --- NEW: State to control the active view ---
    const [activeView, setActiveView] = useState('dashboard');

    const [balanceHistory, setBalanceHistory] = useState(initialBalanceHistory);
    const [streakDays, setStreakDays] = useState(initialStreakDays);
    const [reminders, setReminders] = useState(initialReminders);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
    const [activePlanTab, setActivePlanTab] = useState('recommendations');

    if (!context) return <div className="min-h-screen flex items-center justify-center">Loading App...</div>;
    const { user, setUser } = context;

    useEffect(() => { if (!user) { navigate('/login', { replace: true }); } }, [user, navigate]);
    if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900">Loading User...</div>;

    const handleLogBalance = (newScore: number) => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const newHistory = balanceHistory.filter(entry => entry.date !== todayStr);
        setBalanceHistory([...newHistory.slice(-29), { date: todayStr, score: newScore }]);
        const todayAlreadyLogged = streakDays.some(d => new Date(d).toDateString() === new Date().toDateString());
        if (!todayAlreadyLogged) { setStreakDays(prev => [...prev, new Date()]); }
    };
    
    const currentBalanceScore = balanceHistory.length > 0 ? balanceHistory[balanceHistory.length - 1].score : 0;
    const prakritiString = user.prakriti || 'Vata-Pitta';
    const primaryDosha = prakritiString.split('-')[0];
    const plan = prakritiPlans[prakritiString] || prakritiPlans[primaryDosha];
    const handleLogout = () => { setUser(null); navigate('/login'); };
    const sidebarLinks = [ { name: 'Dashboard', icon: <HomeIcon className="w-6 h-6"/>, path: '/dashboard' }, { name: 'Take Quiz', icon: <ChartPieIcon className="w-6 h-6"/>, path: '/quiz' }, { name: 'Profile', icon: <Cog6ToothIcon className="w-6 h-6"/>, path: '/profile' }, { name: 'Feedback', icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6"/>, path: '/feedback' } ];
    const quoteIndex = new Date().getDate() % dailyQuotes.length;
    const todayQuote = dailyQuotes[quoteIndex];

    return (
      <div className="relative mt-24 h-screen bg-gray-200 dark:bg-gray-900 overflow-hidden font-openSans">
        <FloatingLeaves />
        <div className="relative z-10 flex h-full">
            <aside className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex-col hidden lg:flex">
                <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700"><UserCircleIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500"/><h3 className="mt-2 font-bold text-lg text-gray-800 dark:text-white truncate">Hi, {user.name || 'User'}</h3></div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">{sidebarLinks.map(link => (<Link key={link.name} to={link.path} className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${ location.pathname === link.path ? 'bg-ayurGreen/10 text-ayurGreen font-bold dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50' }`}>{link.icon}<span>{link.name}</span></Link>))}</nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700"><button onClick={handleLogout} className="w-full flex items-center space-x-4 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"><ArrowLeftOnRectangleIcon className="w-6 h-6"/><span className="font-medium">Logout</span></button></div>
            </aside>
            
            <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-8">
                    <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
                        <div className="flex justify-between items-start mb-8">
                            <div><h1 className="text-3xl font-lora font-bold text-gray-800 dark:text-white">Dashboard</h1><p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name || 'User'}!</p></div>
                            <button className="p-2 rounded-full hover:bg-gray-300/50 dark:hover:bg-gray-700/50 mr-4"><BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard title="Primary Dosha" value={primaryDosha} icon={<SparklesIcon className="w-6 h-6"/>} />
                            <StatCard title="Daily Balance" value={`${currentBalanceScore}%`} icon={<CheckCircleIcon className="w-6 h-6"/>} onClick={() => setIsBalanceModalOpen(true)} />
                            <StatCard title="Wellness Streak" value={`${streakDays.length} Days`} icon={<CalendarDaysIcon className="w-6 h-6"/>} onClick={() => setIsStreakModalOpen(true)} />
                        </div>
                    </motion.div>

                     <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <div className="lg:col-span-2"><ProgressLineChart data={balanceHistory} /></div>
                        <div className="lg:col-span-1"><RemindersCard reminders={reminders} setReminders={setReminders} /></div>
                    </motion.div>

                    <motion.div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>

<h3 className="text-3xl font-lora text-center text-ayurGreen dark:text-ayurBeige mb-6">Your Personalized Plan</h3>

<div className="border-b border-gray-300 dark:border-gray-600 mb-6 flex justify-center space-x-4 sm:space-x-8">{['recommendations', 'diet', 'routine'].map(tab => (<button key={tab} onClick={() => setActivePlanTab(tab)} className={`py-2 px-4 font-semibold capitalize transition-colors duration-300 ${activePlanTab === tab ? 'text-ayurGreen border-b-2 border-ayurGreen' : 'text-gray-500 hover:text-ayurGreen'}`}>{tab}</button>))}</div>

<div className="p-4 min-h-[400px]">

{plan && activePlanTab === 'recommendations' && (<motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>{plan.recommendations.map((rec, index) => <RecommendationCard key={index} {...rec} />)}</motion.div>)}

{plan && activePlanTab === 'diet' && <DietDonutChart {...plan.diet} />}

{plan && activePlanTab === 'routine' && <RoutineTimetable routine={plan.routine} />}

</div>

</motion.div>
                </motion.div>
            </main>
        </div>

        <AnimatePresence>
            {isBalanceModalOpen && <BalanceCheckModal onLog={handleLogBalance} onClose={() => setIsBalanceModalOpen(false)} />}
            {isStreakModalOpen && <StreakCalendarModal streakDays={streakDays} setStreakDays={setStreakDays} onClose={() => setIsStreakModalOpen(false)} />}
        </AnimatePresence>
      </div>
    );
};

export default Dashboard;