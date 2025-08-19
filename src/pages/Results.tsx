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
import { db, updatePrakritiPlan, updateDoc, doc } from '../data/firebase';

const Results: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as { state: { answers?: Record<number, { dosha: string, text: string }> } };
  const answers = state?.answers || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [prakritiString, setPrakritiString] = useState<string>('');
  const [primaryDosha, setPrimaryDosha] = useState<string>('');
  const [doshaPercentages, setDoshaPercentages] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [activeTab, setActiveTab] = useState('recommendations');
  const { user } = context || {};

  const [groupedTraits, setGroupedTraits] = useState<Record<string, string[]>>({ Vata: [], Pitta: [], Kapha: [], Other: [] });
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const processResults = async () => {
      if (!answers || Object.keys(answers).length === 0) {
        setIsLoading(false);
        return;
      }
      const totalQuestions = questions.length;
      const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
      let otherCount = 0;
      const traits: Record<string, string[]> = { Vata: [], Pitta: [], Kapha: [], Other: [] };
      const quizAnswers: Record<string, string> = {}; // To store quiz responses mapped to healthDetails keys

      // Define mapping from question text to healthDetails keys
      const fieldMapping: Record<string, string> = {
        "Body Frame": "bodyFrame",
        "Skin": "skin",
        "Hair": "hair",
        "Eyes": "eyes",
        "Appetite": "appetite",
        "Sleep": "sleep",
        "Energy": "energy",
        "Climate Preference": "climate",
        "Stress Response": "stress",
        "Memory": "memory",
        "Activity Pace": "pace",
        "Mood": "mood",
        "Money Handling": "money",
        "Communication Style": "communication",
        "Response to Change": "change",
      };

      Object.entries(answers).forEach(([idStr, answer]) => {
        const question = questions.find(q => q.id === parseInt(idStr));
        if (question) {
          const traitText = `${question.text}: ${answer.text}`;
          if (answer.dosha !== 'Other') {
            doshaCounts[answer.dosha as 'Vata' | 'Pitta' | 'Kapha']++;
            traits[answer.dosha].push(traitText);
          } else {
            otherCount++;
            traits['Other'].push(traitText);
          }
          // Map question text to the corresponding healthDetails key and store the answer
          const fieldKey = fieldMapping[question.text] || question.text.toLowerCase().replace(/\s+/g, '');
          quizAnswers[fieldKey] = answer.text;
        }
      });

      const total = totalQuestions - otherCount;
      const percentages = {
        Vata: (doshaCounts.Vata / total) * 100 || 0,
        Pitta: (doshaCounts.Pitta / total) * 100 || 0,
        Kapha: (doshaCounts.Kapha / total) * 100 || 0,
      };
      setDoshaPercentages(percentages);
      setGroupedTraits(traits);

      const sortedDoshas = Object.keys(doshaCounts).sort((a, b) => doshaCounts[b as keyof typeof doshaCounts] - doshaCounts[a as keyof typeof doshaCounts]);
      let primary = sortedDoshas[0];
      let secondary = sortedDoshas[1];
      let prakriti = total === 0 ? 'Balanced' : `${primary}-${secondary}`;
      if (total > 0 && doshaCounts[primary as keyof typeof doshaCounts] === doshaCounts[secondary as keyof typeof doshaCounts] === doshaCounts[sortedDoshas[2] as keyof typeof doshaCounts]) {
        prakriti = 'Tridoshic';
      }
      setPrimaryDosha(primary);
      setPrakritiString(prakriti);

      // Save prakriti and mapped quiz answers to Firestore
      if (user?.id) {
        await updatePrakritiPlan(user.id, prakriti);
        await updateDoc(doc(db, 'users', user.id), {
          healthDetails: {
            ...user.healthDetails,
            ...quizAnswers,
          },
        });
        // Update user context with new healthDetails
        context?.setUser({ ...user, prakriti, healthDetails: { ...user.healthDetails, ...quizAnswers } });
      }

      setPlan(prakritiPlans[prakriti] || prakritiPlans['Tridoshic']);
      setIsLoading(false);
    };

    processResults();
  }, [location.state, user, context]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:text-white"><p>Calculating your results...</p></div>;
  }

  if (!primaryDosha) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-200 dark:bg-gray-900 p-4">
        <h2 className="text-2xl font-lora mb-4">No results found.</h2>
        <p className="mb-6">Please complete the quiz to discover your Prakriti.</p>
        <button onClick={() => navigate('/quiz')} className="bg-ayurGreen text-white px-8 py-3 rounded-full font-bold hover:bg-ayurGreen/80">Take the Quiz</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 sm:p-8 pt-24 relative overflow-hidden">
      <FloatingLeaves />
      <div className="max-w-4xl md:mt-24 w-full mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        
        <motion.div className="text-center" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p className="text-lg text-gray-600 dark:text-gray-400">Your Primary Dosha is</p>
          <h1 className="text-7xl sm:text-9xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-4 tracking-tighter">{primaryDosha}</h1>
          <p className="max-w-xl mx-auto text-gray-700 dark:text-gray-300">Journey into Ayurveda with personalized quizzes, natural remedies, and a holistic lifestyle tailored to your unique Prakriti.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          <CircularGauge dosha="Vata" percentage={doshaPercentages.Vata} imageSrc={vataImage} color="#38bdf8" />
          <CircularGauge dosha="Pitta" percentage={doshaPercentages.Pitta} imageSrc={pittaImage} color="#f87171" />
          <CircularGauge dosha="Kapha" percentage={doshaPercentages.Kapha} imageSrc={kaphaImage} color="#4ade80" />
        </div>
        
        <AnimatePresence>
          {user ? (
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <h3 className="text-3xl font-lora text-center text-ayurGreen dark:text-ayurBeige mb-6">Your Personalized Plan</h3>
              
              {!plan && <p className="text-center text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 p-4 rounded-lg">A plan for your unique constitution is being prepared. Please check back later!</p>}
              
              {plan && (
                <>
                  <div className="border-b border-gray-300 dark:border-gray-600 mb-6 flex justify-center space-x-4 sm:space-x-8">
                    {['recommendations', 'diet', 'routine'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 font-semibold capitalize transition-colors duration-300 ${activeTab === tab ? 'text-ayurGreen border-b-2 border-ayurGreen' : 'text-gray-500 hover:text-ayurGreen'}`}>{t(tab)}</button>
                    ))}
                  </div>
                  <div className="p-4 min-h-[400px]">
                    {activeTab === 'recommendations' && (
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        {plan.recommendations.map((rec, index) => <RecommendationCard key={index} category={rec.category} advice={rec.advice} icon={rec.icon} />)}
                      </motion.div>
                    )}
                    {activeTab === 'diet' && <DietDonutChart chartData={plan.diet.chartData} foodsToAvoid={plan.diet.foodsToAvoid} />}
                    {activeTab === 'routine' && <RoutineTimetable routine={plan.routine} />}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 text-center p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-4">Unlock Your Full Potential</h3>
              <p className="text-gray-800 dark:text-gray-200 mb-6 max-w-2xl mx-auto">Log in or create an account to receive personalized recommendations, a custom diet chart, and a daily routine designed to bring your doshas into perfect balance.</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => navigate('/login')} className="bg-ayurGreen text-white px-8 py-3 rounded-full font-bold hover:bg-ayurGreen/80 transition-all duration-300 transform hover:scale-105">Login</button>
                <button onClick={() => navigate('/register')} className="bg-white text-ayurGreen px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border border-ayurGreen">Sign Up</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 mt-8">
          <h3 className="text-3xl font-lora text-center text-ayurGreen dark:text-ayurBeige mb-6">Your Dosha Traits</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">You have {prakritiString} dosha because of these traits from your answers:</p>
          {['Vata', 'Pitta', 'Kapha'].map(dosha => (
            groupedTraits[dosha].length > 0 && (
              <div key={dosha} className="mb-8">
                <h4 className="text-xl font-semibold text-ayurGreen dark:text-ayurBeige mb-4">{t('traitsFor', { defaultValue: 'Traits for' })} {dosha}</h4>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                  {groupedTraits[dosha].map((trait, index) => (
                    <RecommendationCard
                      key={index}
                      category={trait.split(':')[0]}
                      advice={trait.split(':')[1].trim()}
                      icon="SparklesIcon"
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-ayurGreen/10 dark:hover:bg-ayurBeige/10 transition-colors duration-300"
                    />
                  ))}
                </motion.div>
              </div>
            )
          ))}
          {groupedTraits['Other'].length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-ayurGreen dark:text-ayurBeige mb-4">{t('customAnswers', { defaultValue: 'Custom Answers' })}</h4>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                {groupedTraits['Other'].map((trait, index) => (
                  <RecommendationCard
                    key={index}
                    category={trait.split(':')[0]}
                    advice={trait.split(':')[1].trim()}
                    icon="SparklesIcon"
                    className="bg-white/80 dark:bg-gray-800/80 hover:bg-ayurGreen/10 dark:hover:bg-ayurBeige/10 transition-colors duration-300"
                  />
                ))}
              </motion.div>
            </div>
          )}
          {Object.keys(groupedTraits).every(d => groupedTraits[d].length === 0) && (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">{t('noTraits', { defaultValue: 'No traits for this dosha' })}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;