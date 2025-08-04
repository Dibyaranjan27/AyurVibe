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
import RecommendationCard from '../components/RecommendationCard'; // <-- Import the new card
import vataImage from '../assets/vatta.png';
import pittaImage from '../assets/pitta.png';
import kaphaImage from '../assets/kapha.png';

const Results: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as { state: { answers?: Record<number, string> } };
  const answers = state?.answers || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [prakritiString, setPrakritiString] = useState<string>('');
  const [primaryDosha, setPrimaryDosha] = useState<string>('');
  const [doshaPercentages, setDoshaPercentages] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [activeTab, setActiveTab] = useState('recommendations');
  const { user } = context || {};

  useEffect(() => {
    const processResults = () => {
      if (!answers || Object.keys(answers).length === 0) {
        setIsLoading(false);
        return;
      }
      const totalQuestions = questions.length;
      const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
      Object.values(answers).forEach((dosha) => doshaCounts[dosha as keyof typeof doshaCounts]++);
      const percentages = {
        Vata: (doshaCounts.Vata / totalQuestions) * 100,
        Pitta: (doshaCounts.Pitta / totalQuestions) * 100,
        Kapha: (doshaCounts.Kapha / totalQuestions) * 100,
      };
      setDoshaPercentages(percentages);

      const sortedDoshas = Object.entries(doshaCounts).sort(([, a], [, b]) => b - a);
      if (sortedDoshas.length < 2) { setIsLoading(false); return; }
      
      const primary = sortedDoshas[0][0];
      const secondary = sortedDoshas[1][0];
      const scores = sortedDoshas.map(d => d[1]);
      
      // Check for Tridoshic (e.g., scores are 5, 5, 5)
      if (scores[0] === scores[1] && scores[1] === scores[2]) {
        setPrimaryDosha('Tridoshic');
        setPrakritiString('Tridoshic');
      } else {
        setPrimaryDosha(primary);
        setPrakritiString(`${primary}-${secondary}`);
      }
      setIsLoading(false);
    }
    processResults();
  }, [location.state, user]);

  const plan = prakritiPlans[prakritiString] || prakritiPlans[primaryDosha];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900"><p>Calculating your results...</p></div>;
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
    <div className="min-h-screen mt-24 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 sm:p-8 pt-24 relative overflow-hidden">
      <FloatingLeaves />
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        
        <motion.div className="text-center" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p className="text-lg text-gray-600 dark:text-gray-400">Your Primary Dosha is</p>
          <h1 className="text-7xl sm:text-9xl font-lora font-extrabold text-ayurGreen dark:text-ayurBeige my-4 tracking-tighter">{primaryDosha}</h1>
          <p className="max-w-xl mx-auto text-gray-700 dark:text-gray-300">This is the most dominant energy in your constitution, shaping your blueprint for health.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            <CircularGauge dosha="Vata" percentage={doshaPercentages.Vata} imageSrc={vataImage} color="#38bdf8" />
            <CircularGauge dosha="Pitta" percentage={doshaPercentages.Pitta} imageSrc={pittaImage} color="#f87171" />
            <CircularGauge dosha="Kapha" percentage={doshaPercentages.Kapha} imageSrc={kaphaImage} color="#4ade80" />
        </div>
        
        <AnimatePresence>
          {user ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
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
      </div>
    </div>
  );
};

export default Results;