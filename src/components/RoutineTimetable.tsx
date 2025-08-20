import { motion } from 'framer-motion';

interface RoutineItem {
  time: string;
  activity: string;
  description: string;
}
interface RoutineProps { routine: RoutineItem[] }

const RoutineTimetable: React.FC<RoutineProps> = ({ routine }) => {
  return (
    <motion.div 
      className="relative pl-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-ayurGreen/30"></div>
      <div className="space-y-8">
        {routine.map((item) => (
          // CHANGE: Using item.time as the key instead of index for a stable identity.
          <motion.div 
            key={item.time} 
            className="relative"
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
          >
            <div className="absolute -left-[22px] top-1 h-4 w-4 rounded-full bg-ayurGreen border-4 border-white dark:border-gray-800"></div>
            <p className="font-bold text-ayurGreen dark:text-ayurBeige text-md">{item.time}</p>
            <h4 className="font-semibold text-xl text-gray-800 dark:text-white">{item.activity}</h4>
            <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoutineTimetable;