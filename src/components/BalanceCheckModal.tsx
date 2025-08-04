import { motion } from 'framer-motion';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  onClose: () => void;
  setBalanceScore: (score: number) => void;
}

const BalanceCheckModal: React.FC<Props> = ({ onClose, setBalanceScore }) => {
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);

  const handleSubmit = () => {
    if (mood > 0 && energy > 0) {
      const score = Math.round(((mood + energy) / 6) * 100);
      setBalanceScore(score);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-lora font-bold text-ayurGreen mb-6">Daily Check-in</h2>
        <div className="space-y-6">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">How would you rate your mood?</p>
            <div className="flex space-x-2">
                {['Low', 'Neutral', 'Great'].map((label, i) => (
                    <button key={label} onClick={() => setMood(i + 1)} className={`flex-1 p-3 rounded-lg text-sm transition-all ${mood === i + 1 ? 'bg-ayurGreen text-white font-bold ring-2 ring-ayurGreen' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>{label}</button>
                ))}
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">How are your energy levels?</p>
            <input type="range" min="1" max="3" step="1" value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-ayurSaffron"/>
            <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Tired</span>
                <span>Okay</span>
                <span>Energized</span>
            </div>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!mood || !energy} className="w-full mt-8 bg-logoGreen text-white font-bold py-3 rounded-lg hover:bg-ayurSaffron/80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">Log Today</button>
      </motion.div>
    </motion.div>
  );
};

export default BalanceCheckModal;