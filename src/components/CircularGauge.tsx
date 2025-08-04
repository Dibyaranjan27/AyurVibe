// src/components/CircularGauge.tsx
import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface Props {
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  percentage: number;
  imageSrc: string;
  color: string;
}

const CircularGauge: React.FC<Props> = ({ dosha, percentage, imageSrc, color }) => {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayPercentage = useTransform(spring, (latest) => `${Math.round(latest)}%`);

  useEffect(() => {
    spring.set(percentage);
  }, [percentage, spring]);

  return (
    <motion.div
      className="relative w-48 h-48 sm:w-56 sm:h-56"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-300/50 dark:bg-gray-700/50 border-4 border-white/50 dark:border-gray-700/50 shadow-lg">
        {/* The background image */}
        <img src={imageSrc} alt={dosha} className="absolute inset-0 w-full h-full object-cover opacity-20" />
        
        {/* Liquid Fill Layer */}
        <motion.div
          className="absolute bottom-0 left-0 w-full z-10"
          initial={{ height: '0%' }}
          whileInView={{ height: `${percentage}%` }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wave is now a separate element on top of the fill */}
          <div className="absolute inset-x-0 top-0 h-full" style={{ backgroundColor: color, opacity: 0.7 }}></div>
          
          {/* Animated Wave SVG at the TOP of the liquid */}
          <motion.svg
            className="absolute top-0 left-0 w-[200%] h-5 -translate-y-1/2"
            viewBox="0 0 800 20"
            initial={{ x: '-50%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
          >
            <path
              fill={`${color}A0`} // Semi-transparent wave crest
              d="M0,10 C200,20 200,0 400,10 S600,0 800,10 V20 H0 Z"
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Text Content in the center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <h3 className="text-3xl font-lora font-bold text-gray-800 dark:text-white drop-shadow-lg">{dosha}</h3>
        <motion.p className="text-xl font-semibold text-gray-700 dark:text-gray-200 drop-shadow-lg">
          {displayPercentage}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CircularGauge;