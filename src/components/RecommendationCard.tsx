// src/components/RecommendationCard.tsx
import { motion } from 'framer-motion';
import * as SolidIcons from '@heroicons/react/24/solid';

interface Props {
  category: string;
  advice: string;
  icon: string;
  className?: string; // FIX: Add the optional className prop here
}

// A helper function to dynamically render the correct icon
const DynamicHeroIcon = ({ icon }: { icon: string }) => {
  const IconComponent = (SolidIcons as any)[icon];
  if (!IconComponent) return <SolidIcons.SparklesIcon className="h-8 w-8" />; // Default icon
  return <IconComponent className="h-8 w-8" />;
};


const RecommendationCard: React.FC<Props> = ({ category, advice, icon }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-700/60 p-6 rounded-xl shadow-md flex items-start space-x-4"
      variants={cardVariants}
    >
      <div className="flex-shrink-0 bg-ayurGreen/10 dark:bg-ayurGreen/20 text-ayurGreen dark:text-ayurBeige p-3 rounded-full">
        <DynamicHeroIcon icon={icon} />
      </div>
      <div>
        <h4 className="font-bold text-lg text-ayurGreen dark:text-ayurBeige">{category}</h4>
        <p className="text-gray-700 dark:text-gray-300">{advice}</p>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;