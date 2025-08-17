import React from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { XMarkIcon } from '@heroicons/react/24/outline';

type StreakCalendarModalProps = {
  onClose: () => void;
  streakDays: Date[];
  setStreakDays: (dates: Date[]) => void;
};

const StreakCalendarModal: React.FC<StreakCalendarModalProps> = ({ onClose, streakDays, setStreakDays }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-sm w-full relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <XMarkIcon className="w-6 h-6" />
      </button>
      <h2 className="text-xl font-lora font-bold text-ayurGreen mb-4">Log Your Streak</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Click dates to add or remove them from your streak.</p>
      <DayPicker mode="multiple" selected={streakDays} onSelect={(dates) => setStreakDays(dates || [])} styles={{ day: { borderRadius: '100%' } }} modifiersStyles={{ selected: { backgroundColor: '#346B4A', color: 'white' } }} />
    </motion.div>
  </motion.div>
);

export default StreakCalendarModal;