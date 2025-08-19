import React, { useRef } from 'react'; // CHANGE: Import useRef
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useOnClickOutside } from '../hooks/useOnClickOutside'; // CHANGE: Import the hook

type DoshaInfoModalProps = {
  onClose: () => void;
  dosha: string;
};

const doshaDetails: Record<string, { title: string; elements: string; qualities: string[]; description: string; }> = {
  Vata: {
    title: 'Vata (Air & Ether)',
    elements: 'The principle of movement.',
    qualities: ['Dry', 'Light', 'Cold', 'Rough', 'Subtle', 'Mobile'],
    description: 'Vata types are often creative, energetic, and lively. When in balance, they are flexible and enthusiastic. Out of balance, they may experience anxiety, insomnia, and dry skin.'
  },
  Pitta: {
    title: 'Pitta (Fire & Water)',
    elements: 'The principle of digestion and metabolism.',
    qualities: ['Hot', 'Sharp', 'Light', 'Liquid', 'Spreading'],
    description: 'Pitta individuals are typically intelligent, focused, and ambitious. When in balance, they are warm and decisive leaders. Out of balance, they can be irritable, impatient, and suffer from inflammation.'
  },
  Kapha: {
    title: 'Kapha (Earth & Water)',
    elements: 'The principle of structure and lubrication.',
    qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Stable'],
    description: 'Kapha types are known for being calm, loving, and grounded. When in balance, they are supportive and stable. Out of balance, they may experience sluggishness, weight gain, and congestion.'
  }
};

const DoshaInfoModal: React.FC<DoshaInfoModalProps> = ({ onClose, dosha }) => {
  // CHANGE: Create a ref for the modal content
  const modalRef = useRef<HTMLDivElement>(null);

  // CHANGE: Call the hook to close the modal on outside click
  useOnClickOutside(modalRef, onClose);

  const details = doshaDetails[dosha] || { title: 'Dosha', elements: '', qualities: [], description: 'Details not found.' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      {/* CHANGE: Attach the ref to this div */}
      <motion.div ref={modalRef} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-2">{details.title}</h2>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-4">{details.elements}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{details.description}</p>
        <div>
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Key Qualities:</h4>
          <div className="flex flex-wrap gap-2">
            {details.qualities.map(q => (
              <span key={q} className="bg-ayurGreen/10 text-ayurGreen text-xs font-medium px-3 py-1 rounded-full">{q}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoshaInfoModal;