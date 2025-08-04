// src/components/DoshaQuadrant.tsx
import { motion } from 'framer-motion';

interface Props {
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  percentage: number;
  imageSrc: string;
  color: string;
  className?: string;
}

const DoshaQuadrant: React.FC<Props> = ({ dosha, percentage, imageSrc, color, className }) => {
  return (
    <motion.div
      className={`relative w-full h-64 sm:h-80 overflow-hidden bg-white/50 dark:bg-gray-800/50 flex flex-col items-center justify-center p-4 border border-gray-200/50 dark:border-gray-700/50 ${className}`}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
      }}
    >
      {/* Liquid Fill Layer */}
      <motion.div
        className="absolute bottom-0 left-0 w-full z-0"
        style={{ backgroundColor: color }}
        initial={{ height: '0%' }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} // Smooth ease-out
      >
        {/* Animated Wave SVG */}
        <motion.svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 100"
          style={{ color }}
          initial={{ x: '-50%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        >
          <path
            fill="currentColor"
            d="M1440,56.8C1200,56.8,960,28.4,720,28.4S240,56.8,0,56.8V100h1440V56.8z"
          />
        </motion.svg>
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <img src={imageSrc} alt={dosha} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mb-4 border-4 border-white/50 shadow-lg" />
        <h3 className="text-3xl sm:text-4xl font-lora font-bold text-gray-800 dark:text-white drop-shadow-md">{dosha}</h3>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 drop-shadow-md">{Math.round(percentage)}%</p>
      </div>
    </motion.div>
  );
};

export default DoshaQuadrant;