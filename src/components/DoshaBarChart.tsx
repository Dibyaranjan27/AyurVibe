// src/components/DoshaBarChart.tsx
import { motion } from 'framer-motion';

interface ChartProps {
  data: {
    Vata: number;
    Pitta: number;
    Kapha: number;
  };
}

const DoshaBarChart: React.FC<ChartProps> = ({ data }) => {
  const doshas = [
    { name: 'Vata', value: data.Vata, color: 'bg-blue-400' },
    { name: 'Pitta', value: data.Pitta, color: 'bg-red-400' },
    { name: 'Kapha', value: data.Kapha, color: 'bg-green-400' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-lora font-bold text-center text-gray-800 dark:text-white mb-6">Dosha Composition</h3>
      <div className="space-y-4">
        {doshas.map((dosha) => (
          <div key={dosha.name} className="flex items-center">
            <span className="w-16 font-semibold text-gray-700 dark:text-gray-300">{dosha.name}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 mx-4 overflow-hidden">
              <motion.div
                className={`${dosha.color} h-full rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${dosha.value}%` }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="w-12 text-right font-semibold text-gray-700 dark:text-gray-300">{Math.round(dosha.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoshaBarChart;