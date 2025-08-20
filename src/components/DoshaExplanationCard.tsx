import { motion } from 'framer-motion';

interface Props {
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  score: number;
  answers: string[];
  imageSrc: string;
  className?: string;
}

const DoshaExplanationCard: React.FC<Props> = ({ dosha, score, answers, imageSrc, className }) => {
  return (
    <motion.div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 h-full flex flex-col ${className}`}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
      }}
    >
      <div className="flex items-center mb-4">
        <img src={imageSrc} alt={dosha} className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-white/50" />
        <div>
          <h4 className="text-2xl font-lora font-bold text-gray-800 dark:text-white">{dosha}</h4>
          <p className="text-ayurGreen dark:text-ayurBeige font-semibold">{score} points</p>
        </div>
      </div>
      <div className="flex-grow space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p className="font-semibold mb-2">Your traits reflecting {dosha}:</p>
        <ul className="space-y-1 pl-1 list-inside">
          {/* CHANGE: Using the 'answer' string for a stable key instead of index */}
          {answers.map((answer) => (
            <li key={answer} className="flex items-start">
              <span className="mr-2 mt-1 text-sm text-ayurGreen">&#10003;</span>
              <span>{answer}</span>
            </li>
          ))}
          {answers.length === 0 && <p className="text-gray-500 italic text-xs">No answers selected for this dosha.</p>}
        </ul>
      </div>
    </motion.div>
  );
};

export default DoshaExplanationCard;