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
  const [doshaDetails, setDoshaDetails] = useState<Record<string, number>>({ Vata: 0, Pitta: 0, Kapha: 0 });

  useEffect(() => {
    const fetchPrakriti = async () => {
      if (user && user.id) {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPrakriti(data.prakriti || 'Unknown');
        } else if (Object.keys(answers).length > 0) {
          const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
          Object.values(answers).forEach((dosha) => counts[dosha as keyof typeof counts]++);
          setDoshaDetails(counts);
          const primaryDosha = Object.keys(counts).reduce((a, b) =>
            counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b
          );
          const secondaryDosha = Object.keys(counts)
            .filter((d) => d !== primaryDosha)
            .reduce((a, b) => (counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b), primaryDosha);
          const newPrakriti = counts[primaryDosha as keyof typeof counts] === counts[secondaryDosha as keyof typeof counts]
            ? 'Tridoshic'
            : `${primaryDosha}-${secondaryDosha}`;
          setPrakriti(newPrakriti);
        }
      }
    };
    fetchPrakriti();
  }, [user, answers]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'} flex flex-col items-center p-4 relative overflow-hidden`}>
      {/* Nature Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-ayurGreen/10 to-ayurBeige/20 dark:from-gray-800/30 dark:to-gray-900"></div>
        <div className="absolute top-10 left-10 w-12 h-12 animate-float">
          <svg className="text-ayurGreen/50 dark:text-ayurGreen/20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <h2 className="text-4xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-8 text-center">
          {t('results', { defaultValue: 'Your Results' })}
        </h2>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-lora text-ayurGreen dark:text-ayurBeige mb-4">
            {t('prakriti', { defaultValue: 'Your Prakriti: ' })}{prakriti}
          </h3>
          {prakriti !== 'Unknown' && (
            <div className="space-y-4">
              <p className="font-openSans">
                {t('doshaBreakdown', { defaultValue: 'Dosha Breakdown:' })}
              </p>
              <ul className="list-disc pl-5 font-openSans">
                <li>{t('vata')}: {doshaDetails.Vata} {t('points')}</li>
                <li>{t('pitta')}: {doshaDetails.Pitta} {t('points')}</li>
                <li>{t('kapha')}: {doshaDetails.Kapha} {t('points')}</li>
              </ul>
              <p className="font-openSans">
                {t('recommendation', { defaultValue: 'Recommendation: Balance your dominant dosha with a diet and lifestyle suited to your Prakriti.' })}
              </p>
            </div>
          )}
        </div>
        <DietChart className="mb-8" />
        <Schedule className="mb-8" />
      </div>
    </div>
  );
};

export default Results;