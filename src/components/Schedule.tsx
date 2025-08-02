import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useTranslation } from 'react-i18next';

const Schedule: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();

  if (!context || !context.user) return <p className="text-center">{t('loginRequired', { defaultValue: 'Please log in to view your schedule' })}</p>;

  const { user, darkMode } = context;
  const [schedule, setSchedule] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (user && user.id && user.prakriti) {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Mock schedule based on Prakriti (expand with real data later)
          const schedules: Record<string, string[]> = {
            'Vata-Pitta': ['6:00 AM - Meditation', '7:00 AM - Warm breakfast', '6:00 PM - Gentle yoga', '9:00 PM - Sleep'],
            'Pitta-Kapha': ['5:30 AM - Exercise', '8:00 AM - Light meal', '7:00 PM - Relaxation', '10:00 PM - Sleep'],
            'Kapha-Vata': ['6:30 AM - Brisk walk', '7:30 AM - Spicy tea', '6:00 PM - Workout', '9:30 PM - Sleep'],
            'Tridoshic': ['6:00 AM - Stretch', '7:30 AM - Balanced meal', '6:30 PM - Walk', '10:00 PM - Sleep'],
          };
          setSchedule(schedules[user.prakriti] || ['Default daily schedule']);
        }
      }
    };
    fetchSchedule();
  }, [user]);

  return (
    <div
      className={`p-4 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-ayurBeige text-gray-900'
      } rounded-lg shadow-lg`}
    >
      <h3 className="text-xl font-lora font-bold text-ayurGreen mb-4">{t('dailySchedule', { defaultValue: 'Your Daily Schedule' })}</h3>
      <ul className="list-disc pl-5 space-y-2 font-openSans">
        {schedule.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;