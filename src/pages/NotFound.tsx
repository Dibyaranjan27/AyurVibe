import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/solid';
import FloatingLeaves from '../components/FloatingLeaves';

// Import the background image for the text frame
import natureBackground from '../assets/nature-background.jpg'; // <-- Replace with your image path

const Leaf = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="m22 3.41l-.12-1.26l-1.2.4a13.84 13.84 0 0 1-6.41.64a11.87 11.87 0 0 0-6.68.9A7.23 7.23 0 0 0 3.3 9.5a9 9 0 0 0 .39 4.58a16.6 16.6 0 0 1 1.18-2.2a9.85 9.85 0 0 1 4.07-3.43a11.16 11.16 0 0 1 5.06-1A12.1 12.1 0 0 0 9.34 9.2a9.5 9.5 0 0 0-1.86 1.53a11.4 11.4 0 0 0-1.39 1.91a16.4 16.4 0 0 0-1.57 4.54A26.4 26.4 0 0 0 4 22h2a31 31 0 0 1 .59-4.32a9.25 9.25 0 0 0 4.52 1.11a11 11 0 0 0 4.28-.87C23 14.67 22 3.86 22 3.41"/>
  </svg>
);

const NotFound: React.FC = () => {
  const leaves = Array.from({ length: 15 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
  };

  const numberContainerVariants: Variants = {
    hidden: { opacity: 0, y: -200, scale: 0.5 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10, mass: 1, delay: 0.2 },
    },
  };

  const leafVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [1, 0.5, 0],
      scale: [1, 1.2, 0],
      x: (Math.random() - 0.5) * (300 + i * 20),
      y: (Math.random() - 0.5) * (300 + i * 20),
      rotate: Math.random() * 360,
      transition: { delay: 0.8, duration: 1.2 + Math.random(), ease: "easeOut" },
    }),
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-center p-4 overflow-hidden">
      <FloatingLeaves />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            variants={numberContainerVariants}
            className="relative"
            aria-label="404 Error"
          >
            <h1 
              className="text-[200px] md:text-[300px] leading-none font-anton font-black text-transparent bg-cover bg-center bg-clip-text"
              style={{ backgroundImage: `url(${natureBackground})` }}
            >
              404
            </h1>
            <h1
              className="absolute inset-0 text-[200px] md:text-[300px] leading-none font-anton font-black text-gray-500/30 dark:text-white/30"
              style={{ WebkitTextStroke: '2px currentColor', textStroke: '2px currentColor' }}
              aria-hidden="true"
            >
              404
            </h1>
          </motion.div>

          <AnimatePresence>
            <div className="absolute">
              {leaves.map((_, i) => (
                <motion.div
                  // CHANGE: The key is now more unique and stable.
                  key={`leaf-scatter-${i}`}
                  custom={i}
                  variants={leafVariants}
                  className="absolute"
                >
                  <Leaf className="w-8 h-8 text-ayurGreen/50 dark:text-ayurBeige/50" />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <motion.h2
          variants={textVariants}
          className="text-2xl md:text-4xl font-semibold text-gray-800 dark:text-white mt-8"
        >
          Oops! Page Not Found.
        </motion.h2>
        
        <motion.p
          variants={textVariants}
          className="text-gray-600 dark:text-gray-400 mt-4 max-w-md mx-auto"
        >
          The page you are looking for might have been moved, deleted, or it never existed in the first place.
        </motion.p>

        <motion.div variants={textVariants}>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 bg-ayurGreen text-white px-8 py-3 rounded-full font-bold hover:bg-ayurGreen/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <HomeIcon className="w-5 h-5" />
              Go Back Home
            </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;