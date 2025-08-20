import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '../data/questions';
import { prakritiPlans } from '../data/prakritiPlans';
import FloatingLeaves from '../components/FloatingLeaves';
import CircularGauge from '../components/CircularGauge';
import DietDonutChart from '../components/DietDonutChart';
import RoutineTimetable from '../components/RoutineTimetable';
import RecommendationCard from '../components/RecommendationCard';
import vataImage from '../assets/vatta.png';
import pittaImage from '../assets/pitta.png';
import kaphaImage from '../assets/kapha.png';
import { db, updateDoc, doc } from '../data/firebase';

// CHANGE: Data processing logic is now in its own helper function outside of the useEffect hook.
const processQuizData = async (
    quizAnswers: Record<number, { dosha: string; text: string }>,
    guestPrakriti: string | null,
    user: any // Replace with a more specific user type if available
) => {
    const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
    const traits: Record<string, string[]> = { Vata: [], Pitta: [], Kapha: [], Other: [] };
    const healthDetailsUpdate: Record<string, string> = {};
    const fieldMapping: Record<string, string> = {
        "Body Frame": "bodyFrame", "Skin": "skin", "Hair": "hair", "Eyes": "eyes",
        "Appetite": "appetite", "Sleep": "sleep", "Energy": "energy", "Climate Preference": "climate",
        "Stress Response": "stress", "Memory": "memory", "Activity Pace": "pace", "Mood": "mood",
        "Money Handling": "money", "Communication Style": "communication", "Response to Change": "change",
    };

    Object.entries(quizAnswers).forEach(([idStr, answer]) => {
        const question = questions.find(q => q.id === parseInt(idStr));
        if (question) {
            const traitText = `${question.text}: ${answer.text}`;
            if (answer.dosha !== 'Other') {
                doshaCounts[answer.dosha as 'Vata' | 'Pitta' | 'Kapha']++;
                traits[answer.dosha].push(traitText);
            } else {
                traits['Other'].push(traitText);
            }
            if (fieldMapping[question.text]) {
                healthDetailsUpdate[fieldMapping[question.text]] = answer.text;
            }
        }
    });

    const totalDoshaAnswers = Object.values(doshaCounts).reduce((sum, count) => sum + count, 0);
    const percentages = {
        Vata: totalDoshaAnswers > 0 ? Math.round((doshaCounts.Vata / totalDoshaAnswers) * 100) : 0,
        Pitta: totalDoshaAnswers > 0 ? Math.round((doshaCounts.Pitta / totalDoshaAnswers) * 100) : 0,
        Kapha: totalDoshaAnswers > 0 ? Math.round((doshaCounts.Kapha / totalDoshaAnswers) * 100) : 0,
    };

    const sortedDoshas = Object.keys(doshaCounts).sort((a, b) => doshaCounts[b as keyof typeof doshaCounts] - doshaCounts[a as keyof typeof doshaCounts]);
    const primary = sortedDoshas[0] || 'Balanced';
    const finalPrakriti = guestPrakriti || `${primary}-${sortedDoshas[1] || 'Balanced'}`;

    if (user?.id && !guestPrakriti) {
        await updateDoc(doc(db, 'users', user.id), {
            prakriti: finalPrakriti,
            healthDetails: {
                ...user.healthDetails,
                ...healthDetailsUpdate
            }
        });
    }

    const plan = prakritiPlans[finalPrakriti] || prakritiPlans['Tridoshic'];

    return { percentages, traits, primary, finalPrakriti, plan };
};


const Results: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [prakritiString, setPrakritiString] = useState<string>('');
  const [primaryDosha, setPrimaryDosha] = useState<string>('');
  const [doshaPercentages, setDoshaPercentages] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [activeTab, setActiveTab] = useState('recommendations');
  const [groupedTraits, setGroupedTraits] = useState<Record<string, string[]>>({ Vata: [], Pitta: [], Kapha: [], Other: [] });
  const [plan, setPlan] = useState<any>(null);

  const { user } = context || {};

  // CHANGE: The useEffect hook is now much simpler.
  useEffect(() => {
    const loadResults = async () => {
        let quizAnswers: Record<number, { dosha: string, text: string }> | null = null;
        let guestPrakriti: string | null = null;

        if (location.state?.answers) {
            quizAnswers = location.state.answers;
        } else {
            const guestData = sessionStorage.getItem('guestQuizResults');
            if (guestData) {
                try {
                    const parsedData = JSON.parse(guestData);
                    quizAnswers = parsedData.answers;
                    guestPrakriti = parsedData.prakriti;
                } catch (e) {
                    console.error("Failed to parse guest quiz results:", e);
                }
            }
        }

        if (!quizAnswers) {
            setIsLoading(false);
            return;
        }

        // Call the helper function to process data and get state updates
        const results = await processQuizData(quizAnswers, guestPrakriti, user);

        // Set all state at once
        setDoshaPercentages(results.percentages);
        setGroupedTraits(results.traits);
        setPrimaryDosha(results.primary);
        setPrakritiString(results.finalPrakriti);
        setPlan(results.plan);
        setIsLoading(false);
    };

    loadResults();
  }, [location.state, user]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900"><p className="text-gray-800 dark:text-white">Calculating your results...</p></div>;
  }

  if (!primaryDosha) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-200 dark:bg-gray-900 p-4">
        <h2 className="text-2xl font-lora text-gray-800 dark:text-white mb-4">No results found.</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">Please complete the quiz to discover your Prakriti.</p>
        <button onClick={() => navigate('/quiz')} className="bg-ayurGreen text-white px-8 py-3 rounded-full font-bold hover:bg-ayurGreen/80">Take the Quiz</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 sm:p-8 pt-24 relative overflow-hidden">
      <FloatingLeaves />
      <div className="max-w-4xl mt-24 w-full mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        
        <motion.div className="text-center" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p className="text-lg text-gray-600 dark:text-gray-400">Your Primary Dosha is</p>
          <h1 className="text-7xl sm:text-9xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-4 tracking-tighter">{primaryDosha}</h1>
          <p className="max-w-xl mx-auto text-gray-700 dark:text-gray-300">This is your core nature. Understanding it is the first step toward a balanced and healthy life in harmony with yourself.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          <CircularGauge dosha="Vata" percentage={doshaPercentages.Vata} imageSrc={vataImage} color="#38bdf8" />
          <CircularGauge dosha="Pitta" percentage={doshaPercentages.Pitta} imageSrc={pittaImage} color="#f87171" />
          <CircularGauge dosha="Kapha" percentage={doshaPercentages.Kapha} imageSrc={kaphaImage} color="#4ade80" />
        </div>
        
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div key="user-plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-3xl font-lora text-center text-ayurGreen dark:text-ayurBeige mb-6">Your Personalized Plan</h3>
              {plan && (
                <>
                  <div className="border-b border-gray-300 dark:border-gray-600 mb-6 flex justify-center space-x-4 sm:space-x-8">
                    {['recommendations', 'diet', 'routine'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 font-semibold capitalize transition-colors duration-300 ${activeTab === tab ? 'text-ayurGreen dark:text-ayurBeige border-b-2 border-ayurGreen dark:border-ayurBeige' : 'text-gray-500 hover:text-ayurGreen dark:hover:text-ayurBeige'}`}>{t(tab)}</button>
                    ))}
                  </div>
                  <div className="p-4 min-h-[400px]">
                    {activeTab === 'recommendations' && <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">{plan.recommendations.map((rec:any, index:number) => <RecommendationCard key={index} {...rec} />)}</motion.div>}
                    {activeTab === 'diet' && <DietDonutChart {...plan.diet} />}
                    {activeTab === 'routine' && <RoutineTimetable routine={plan.routine} />}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="guest-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-gray-800 text-center p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-4">Unlock Your Full Potential</h3>
              <p className="text-gray-800 dark:text-gray-200 mb-6 max-w-2xl mx-auto">Log in or create an account to save these results and receive personalized recommendations, a custom diet chart, and a daily routine designed for you.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => navigate('/login')} className="bg-ayurGreen text-white px-8 py-3 rounded-full font-bold hover:bg-ayurGreen/80 transition-all duration-300 transform hover:scale-105">Login to View Plan</button>
                <button onClick={() => navigate('/register')} className="bg-white text-ayurGreen px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border border-ayurGreen dark:bg-gray-700 dark:text-ayurBeige dark:hover:bg-gray-600 dark:border-ayurBeige">Register to Save Results</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 mt-8">
          <h3 className="text-3xl font-lora text-center text-ayurGreen dark:text-ayurBeige mb-6">Your Dosha Traits</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">You have {prakritiString} dosha because of these traits from your answers:</p>
          {['Vata', 'Pitta', 'Kapha', 'Other'].map(dosha => (
            groupedTraits[dosha as keyof typeof groupedTraits].length > 0 && (
              <div key={dosha} className="mb-8">
                <h4 className="text-xl font-semibold text-ayurGreen dark:text-ayurBeige mb-4">{t('traitsFor', { defaultValue: `Traits for ${dosha}` })}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedTraits[dosha as keyof typeof groupedTraits].map((trait, index) => (
                    <RecommendationCard
                      key={index}
                      category={trait.split(':')[0]}
                      advice={trait.split(':')[1]?.trim() || ''}
                      icon="SparklesIcon"
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-ayurGreen/10 dark:hover:bg-ayurBeige/10 transition-colors duration-300"
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;