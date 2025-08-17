import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ProgressLineChartProps = {
  data: { date: string; score: number }[];
};

const ProgressLineChart: React.FC<ProgressLineChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState('Weekly');
  const [tickColor, setTickColor] = useState('#6b7280');

  useEffect(() => {
    const setChartColor = () => setTickColor(document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280');
    setChartColor();
    const observer = new MutationObserver(setChartColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const filteredData = useMemo(() => {
    const formattedData = data.map((d) => ({ ...d, name: format(new Date(d.date), 'MMM d') }));
    switch (timeframe) {
      case 'Daily':
        return formattedData.slice(-3);
      case 'Weekly':
        return formattedData.slice(-7);
      case 'Monthly':
        return formattedData.slice(-30);
      default:
        return formattedData;
    }
  }, [data, timeframe]);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Your Balance Progress</h3>
        <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
          {['Daily', 'Weekly', 'Monthly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${timeframe === tf ? 'bg-white dark:bg-gray-800 shadow text-ayurGreen' : 'text-gray-500 hover:bg-gray-100/50'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={filteredData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} />
            <YAxis stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '1rem' }} />
            <Line type="monotone" dataKey="score" stroke="#346B4A" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressLineChart;