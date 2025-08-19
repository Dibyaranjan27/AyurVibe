import React from 'react';
import { motion } from 'framer-motion';

type StatCardProps = {
    title: string;
    value: string;
    icon: React.ReactNode;
    onClick?: () => void;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => (
    <motion.div
        onClick={onClick}
        className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''}`}
        whileHover={onClick ? { scale: 1.05, transition: { type: 'spring', stiffness: 300 } } : {}}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
        <div className="bg-ayurGreen/10 text-ayurGreen p-3 rounded-full">{icon}</div>
        <div>
            {/* CHANGE: Added dark mode text color */}
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </motion.div>
);

export default StatCard;