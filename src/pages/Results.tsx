import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../data/firebase';
import DietChart from '../components/DietChart';
import Schedule from '../components/Schedule';
import { useTranslation } from 'react-i18next';

const Results: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = location as { state: { answers?: Record<number, string> } };
  const answers = state?.answers || {};

  if (!context || !context.user) return <p className="text-center">{t('loginRequired', { defaultValue: 'Please log in to view your results' })}</p>;

  const { user, darkMode } = context;
  const [prakriti, setPrakriti] = useState<string>('');

  useEffect(() => {
    const fetchPrakriti = async () => {
      if (user && user.id) {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPrakriti(data.prakriti || 'Unknown');
        } else if (Object.keys(answers).length > 0) {
          const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
          Object.values(answers).forEach((dosha) => doshaCounts[dosha as keyof typeof doshaCounts]++);
          const primaryDosha = Object.keys(doshaCounts).reduce((a, b) =>
            doshaCounts[a as keyof typeof doshaCounts] > doshaCounts[b as keyof typeof doshaCounts] ? a : b
          );
          const secondaryDosha = Object.keys(doshaCounts)
            .filter((d) => d !== primaryDosha)
            .reduce((a, b) => (doshaCounts[a as keyof typeof doshaCounts] > doshaCounts[b as keyof typeof doshaCounts] ? a : b), primaryDosha);
          const newPrakriti = doshaCounts[primaryDosha as keyof typeof doshaCounts] === doshaCounts[secondaryDosha as keyof typeof doshaCounts]
            ? 'Tridoshic'
            : `${primaryDosha}-${secondaryDosha}`;
          setPrakriti(newPrakriti);
        }
      }
    };
    fetchPrakriti();
  }, [user, answers]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'
      } flex flex-col items-center p-4`}
    >
      <h2 className="text-2xl font-lora font-bold text-ayurGreen mb-6">{t('results', { defaultValue: 'Your Results' })}</h2>
      <p className="mb-4 font-openSans">{t('prakriti', { defaultValue: 'Your Prakriti: ' })}{prakriti}</p>
      <DietChart />
      <Schedule className="mt-6" />
    </div>
  );
};

export default Results;