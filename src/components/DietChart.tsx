import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useTranslation } from 'react-i18next';

const DietChart: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();

  if (!context || !context.user) return <p className="text-center">{t('loginRequired', { defaultValue: 'Please log in to view your diet chart' })}</p>;

  const { user, darkMode } = context;
  const [dietPlan, setDietPlan] = useState<string[]>([]);

  useEffect(() => {
    const fetchDietPlan = async () => {
      if (user && user.id && user.prakriti) {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Mock diet plan based on Prakriti (expand with real data later)
          const plans: Record<string, string[]> = {
            'Vata-Pitta': ['Warm soups', 'Cooked vegetables', 'Ghee', 'Avoid spicy foods'],
            'Pitta-Kapha': ['Cooling fruits', 'Leafy greens', 'Mild spices', 'Avoid heavy dairy'],
            'Kapha-Vata': ['Light grains', 'Spicy teas', 'Legumes', 'Avoid sweets'],
            'Tridoshic': ['Balanced diet', 'Whole grains', 'Fresh fruits', 'Moderate spices'],
          };
          setDietPlan(plans[user.prakriti] || ['Default diet plan']);
        }
      }
    };
    fetchDietPlan();
  }, [user]);

  return (
    <div
      className={`p-4 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-ayurBeige text-gray-900'
      } rounded-lg shadow-lg`}
    >
      <h3 className="text-xl font-lora font-bold text-ayurGreen mb-4">{t('dietChart', { defaultValue: 'Your Diet Chart' })}</h3>
      <ul className="list-disc pl-5 space-y-2 font-openSans">
        {dietPlan.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default DietChart;