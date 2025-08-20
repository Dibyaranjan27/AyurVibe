import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DietProps {
  chartData: { name: string; value: number; color: string; }[];
  foodsToAvoid: string[];
}

const DietDonutChart: React.FC<DietProps> = ({ chartData, foodsToAvoid }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3}>
              {/* CHANGE: Using entry.name for a stable key instead of index */}
              {chartData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.color} />))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="font-bold text-xl mb-3 text-red-500">Foods to Limit or Avoid</h4>
        <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
            {foodsToAvoid.map(food => <li key={food}>{food}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default DietDonutChart;