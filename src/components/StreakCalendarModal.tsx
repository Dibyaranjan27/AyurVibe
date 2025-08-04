import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  onClose: () => void;
  streakDays: Date[];
}

const StreakCalendarModal: React.FC<Props> = ({ onClose, streakDays }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
        <h2 className="text-xl font-lora font-bold text-ayurGreen mb-4">Wellness Streak</h2>
        <DayPicker
          mode="multiple"
          selected={streakDays}
          styles={{
            day: { borderRadius: '100%' },
          }}
          modifiersStyles={{
            selected: { backgroundColor: '#346B4A', color: 'white' },
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default StreakCalendarModal;