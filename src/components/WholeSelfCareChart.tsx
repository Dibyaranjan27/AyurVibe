import Quadrant from './Quadrant';
import { motion } from 'framer-motion';

// This data is taken directly from your image
const quadrantData = [
  {
    title: 'Empathy',
    text: 'At the core of everything we do is an authentic yearning to understand—and consider—your unique needs in developing a care plan.',
    color: 'bg-leaf-medium',
    // SVG path for top-left leaf shape
    svgPath: 'M 100 100 V 50 C 100 0, 0 0, 0 0 H 50 C 100 0, 100 100, 100 100 Z',
  },
  {
    title: 'Innovation',
    text: 'We possess a deep knowledge of traditional psychiatric care while also pursuing new and emerging methods of treatment.',
    color: 'bg-leaf-light',
    // SVG path for top-right leaf shape
    svgPath: 'M 0 100 V 50 C 0 0, 100 0, 100 0 H 50 C 0 0, 0 100, 0 100 Z',
  },
  {
    title: 'Prevention',
    text: 'Sometimes the best treatments occur before there’s even a problem. We practice preventative rather than reactionary care whenever possible.',
    color: 'bg-leaf-dark',
    // SVG path for bottom-left leaf shape
    svgPath: 'M 100 0 V 50 C 100 100, 0 100, 0 100 H 50 C 100 100, 100 0, 100 0 Z',
  },
  {
    title: 'Personalization',
    text: 'Every person is unique, something we never lose sight of. We develop personalized care plans aimed at treating the individual.',
    color: 'bg-leaf-bright',
    // SVG path for bottom-right leaf shape
    svgPath: 'M 0 0 V 50 C 0 100, 100 100, 100 100 H 50 C 0 100, 0 0, 0 0 Z',
  },
];

const WholeSelfCareChart: React.FC = () => {
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl sm:text-5xl font-lora font-bold text-gray-800 dark:text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          [cite_start]Whole Self-Care [cite: 1]
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          [cite_start]Roots Behavioral Health takes a unique approach to well-being. [cite: 1] [cite_start]Combining empathy, innovation, personalization, and preventative mental healthcare, we treat the whole individual to help people live happier, healthier, more fulfilling lives. [cite: 1]
        </motion.p>
      </div>

      {/* The 2x2 Grid for the Quadrants */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {quadrantData.map((data, index) => (
          <Quadrant
            key={index}
            title={data.title}
            text={data.text}
            // Note: The color is passed as a Tailwind class name
            color={`var(--tw-color-${data.color.replace('bg-', '')})`}
            svgPath={data.svgPath}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default WholeSelfCareChart;