import React, { useState, useRef } from 'react'; // CHANGE: Import useRef
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useOnClickOutside } from '../hooks/useOnClickOutside'; // CHANGE: Import the hook

type BalanceCheckModalProps = {
  onClose: () => void;
  onLog: (score: number) => void;
};

const BalanceCheckModal: React.FC<BalanceCheckModalProps> = ({ onClose, onLog }) => {
  const [mood, setMood] = useState(50);
  const [energy, setEnergy] = useState(50);

  // CHANGE: Create a ref for the modal content
  const modalRef = useRef<HTMLDivElement>(null);

  // CHANGE: Call the hook
  useOnClickOutside(modalRef, onClose);

  const handleSubmit = () => {
    const score = Math.round((mood + energy) / 2);
    onLog(score);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      {/* CHANGE: Attach the ref to this div */}
      <motion.div ref={modalRef} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-6">Daily Check-in</h2>
        <div className="space-y-6">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">How's your mood? ({mood})</p>
            <input
              type="range"
              min="1"
              max="100"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-ayurGreen"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>Low</span>
              <span>Neutral</span>
              <span>Great</span>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">How's your energy? ({energy})</p>
            <input
              type="range"
              min="1"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-ayurSaffron"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>Tired</span>
              <span>Okay</span>
              <span>Energized</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-ayurSaffron text-white font-bold py-3 rounded-lg hover:bg-ayurSaffron/80 transition-colors"
        >
          Log Today
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BalanceCheckModal;