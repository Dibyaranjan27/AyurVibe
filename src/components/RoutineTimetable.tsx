interface RoutineItem {
  time: string;
  activity: string;
  description: string;
}
interface RoutineProps { routine: RoutineItem[] }

const RoutineTimetable: React.FC<RoutineProps> = ({ routine }) => {
  return (
    <div className="relative pl-8">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-ayurGreen/30"></div>
      <div className="space-y-8">
        {routine.map((item, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-ayurGreen border-4 border-white dark:border-gray-800"></div>
            <p className="font-bold text-ayurGreen text-md">{item.time}</p>
            <h4 className="font-semibold text-xl text-gray-800 dark:text-white">{item.activity}</h4>
            <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineTimetable;