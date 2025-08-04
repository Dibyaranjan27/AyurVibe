import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// In a real app, you would pass this data as a prop
const sampleData = [
    { name: 'Jul 28', score: 65 }, { name: 'Jul 29', score: 70 },
    { name: 'Jul 30', score: 60 }, { name: 'Jul 31', score: 75 },
    { name: 'Aug 1', score: 80 }, { name: 'Aug 2', score: 78 },
    { name: 'Aug 3', score: 85 },
];

const ProgressLineChart = () => {
    const [timeframe, setTimeframe] = useState('Weekly');

    return (
        <motion.div 
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Your Balance Progress</h3>
                <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                    {['Daily', 'Weekly', 'Monthly'].map(tf => (
                        <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${timeframe === tf ? 'bg-white dark:bg-gray-800 shadow text-ayurGreen' : 'text-gray-500 hover:bg-gray-100/50'}`}>
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full h-64">
                <ResponsiveContainer>
                    <LineChart data={sampleData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
                        <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(0,0,0,0.1)',
                                borderRadius: '1rem',
                            }}
                        />
                        <Line type="monotone" dataKey="score" stroke="#346B4A" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ProgressLineChart;