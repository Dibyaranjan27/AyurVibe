import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import PageUpButton from '../components/PageUpButton';
import FloatingLeaves from '../components/FloatingLeaves'; // Corrected path alias if you use it
import { motion } from 'framer-motion';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState(6);

  const toggleCard = (cardId: string) => {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
  };

  const toggleShowMore = () => {
    if (visibleCards < lifestyleTips.length) {
      setVisibleCards((prev) => prev + 3);
    } else {
      setVisibleCards(6);
      document.getElementById('lifestyle-tips')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!context) return null;

  const lifestyleTips = [
    {
      id: 'diet',
      title: 'Diet',
      icon: 'src/icons/icons8-salad.gif',
      image: 'src/assets/diet.jpg',
      tip: t('dietTip', { defaultValue: 'Enjoy warm, cooked meals tailored to your Dosha...' }),
      extraTip: t('dietTipExtra', { defaultValue: 'Try adding spices like cumin or coriander...' })
    },
    {
      id: 'yoga',
      title: 'Yoga',
      icon: 'src/icons/icons8-yoga-64.png',
      image: 'src/assets/yoga.jpg',
      tip: t('yogaTip', { defaultValue: 'Practice gentle poses like Surya Namaskar or Tree Pose...' }),
      extraTip: t('yogaTipExtra', { defaultValue: 'Focus on grounding poses for Vata or cooling ones for Pitta...' })
    },
    {
      id: 'meditation',
      title: 'Meditation',
      icon: 'src/icons/icons8-meditation-100.png',
      image: 'src/assets/meditation.jpg',
      tip: t('meditationTip', { defaultValue: 'Spend 10-20 minutes daily with mindfulness or mantra meditation...' }),
      extraTip: t('meditationTipExtra', { defaultValue: 'Use a quiet space with incense to deepen your practice.' })
    },
    {
      id: 'herbal',
      title: 'Herbal Remedies',
      icon: 'src/icons/icons8-supplement-bottle.gif',
      image: 'src/assets/herbal_medicine.jpg',
      tip: t('herbalTip', { defaultValue: 'Incorporate turmeric, ashwagandha, or triphala to strengthen immunity...' }),
      extraTip: t('herbalTipExtra', { defaultValue: 'Steep herbs in warm water for a soothing tea blend.' })
    },
    {
      id: 'sleep',
      title: 'Sleep Routine',
      icon: 'src/icons/icons8-sleeping.gif',
      image: 'src/assets/sleeping.jpg',
      tip: t('sleepTip', { defaultValue: 'Aim for 7-8 hours of sleep with a consistent schedule...' }),
      extraTip: t('sleepTipExtra', { defaultValue: 'Avoid screens an hour before bed to improve sleep quality.' })
    },
    {
      id: 'breathing',
      title: 'Breathing Exercises',
      icon: 'src/icons/icons8-breath-100.png',
      image: 'src/assets/breathiing_exercise.jpg',
      tip: t('breathingTip', { defaultValue: 'Try Pranayama techniques like Anulom Vilom to enhance lung function...' }),
      extraTip: t('breathingTipExtra', { defaultValue: 'Practice in a ventilated area for best results.' })
    },
    {
      id: 'massage',
      title: 'Massage Therapy',
      icon: 'src/icons/icons8-massage-100.png',
      image: 'src/assets/massage_theropy.jpg',
      tip: t('massageTip', { defaultValue: 'Regular self-massage with warm oils helps balance doshas and improve circulation.' }),
      extraTip: t('massageTipExtra', { defaultValue: 'Use sesame oil for Vata, coconut oil for Pitta, and mustard oil for Kapha.' })
    },
    {
      id: 'routine',
      title: 'Daily Routine',
      icon: 'src/icons/icons8-schedule.gif',
      image: 'src/assets/daily_routine.jpg',
      tip: t('routineTip', { defaultValue: 'Follow a consistent daily schedule aligned with natural rhythms.' }),
      extraTip: t('routineExtra', { defaultValue: 'Wake up before sunrise and sleep by 10 PM for optimal health.' })
    }
  ];

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      <FloatingLeaves />
      <Navbar />
      
      {/* Hero Section with Background Blob Cut */}
      <div 
        className="relative min-h-[100vh] flex items-center"
        style={{
          backgroundImage: `url('src/assets/grigory-SYiUGZcyGvs-unsplash.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay with Blob Cut */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 clip-blob-right"></div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center relative z-10">
          <div className="text-center w-full max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">
              Embrace Wellness with AyurVibe
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Journey into Ayurveda with personalized quizzes, natural remedies, and a holistic lifestyle tailored to your unique Prakriti.
            </p>
            <button
              onClick={() => navigate('/quiz')}
              className="bg-logoGreen text-white px-12 py-6 rounded-full text-xl md:text-2xl hover:bg-ayurGreen/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('startQuiz')}
            </button>
          </div>
        </div>
      </div>

      {/* Ayurveda Services Section */}
      <div className="relative w-full py-16 -mt-28">
        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Left Text Content */}
              <div className="flex-1 text-left">
  <h2 className="text-4xl font-bold text-ayurGreen dark:text-ayurBeige mb-6">
    What is Prakriti?
  </h2>
  <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
    Prakriti, in Ayurveda, is your unique mind-body constitution, determined at birth by the balance of the three Doshas: Vata, Pitta, and Kapha. It reflects your inherent traits, strengths, and tendencies, shaping how you interact with the world and maintain health. Understanding your Prakriti helps tailor lifestyle choices for optimal well-being and harmony.</p> 
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
    These Doshas are deeply connected to the human body: Vata governs movement and is linked to the nervous system and circulation; Pitta controls metabolism and digestion, influencing the endocrine and digestive systems; Kapha provides structure and lubrication, supporting the musculoskeletal and immune systems. This interplay ensures a balanced state when in harmony.
  </p>
</div>

              {/* Right Image */}
              <div className="flex-1 h-[500px] relative">
                <div className="absolute inset-0 w-[450px] rounded-b-[20rem] overflow-hidden">
                  <img 
                    src="src\assets\hero4.webp" 
                    alt={t('ayurvedicTea')} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ayurveda Services Section */}
      
      <div className="px-36 py-16 bg-logoGreen dark:bg-gray-800 shadow-md relative z-10 mb-8">
        <h2 className="text-4xl font-bold text-center text-ayurBeige dark:text-ayurBeige mb-10">
          {t('ayurvedaServices', { defaultValue: 'Discover Your Prakriti Dosha' })}
        </h2>
        <p className="text-center text-lg text-ayurBeige dark:text-gray-300 mb-12 max-w-4xl mx-auto">
          {t('servicesIntro', { defaultValue: 'Prakriti Dosha defines your unique mind-body constitution in Ayurveda, shaped by Vata, Pitta, and Kapha. Take our quiz to uncover yours and embrace a balanced lifestyle!' })}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {/* Detoxify Card */}
          <div className="bg-white dark:bg-gray-700 rounded-t-[10rem] pt-16 pb-8 px-8 text-center shadow-lg w-72 h-72 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-24 h-24 mx-auto -mt-24 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src="src\assets\vatta.png"
                alt="Detoxify"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Vata</h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Characterized by air and ether, Vata governs movement, creativity, and flexibility.
            </p>
          </div>

          {/* Revitalize Card */}
          <div className="bg-white dark:bg-gray-700 rounded-t-[10rem] pt-16 pb-8 px-8 text-center shadow-lg w-72 h-72 flex flex-col items-center justify-center animate-fade-in delay-200">
            <div className="w-24 h-24 mx-auto -mt-24 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src="src\assets\pitta.png"
                alt="Revitalize"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Pitta</h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Driven by fire and water, Pitta controls metabolism and determination.
            </p>
          </div>

          {/* Restore Card */}
          <div className="bg-white dark:bg-gray-700 rounded-t-[10rem] pt-16 pb-8 px-8 text-center shadow-lg w-72 h-72 flex flex-col items-center justify-center animate-fade-in delay-400">
            <div className="w-24 h-24 mx-auto -mt-24 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src="src\assets\kapha.png"
                alt="Restore"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Kapha</h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Rooted in earth and water, Kapha brings stability and strength.
            </p>
          </div>
        </div>
      </div>

      {/* Ayurvedic Lifestyle Tips Section */}
      <div id="lifestyle-tips" className="max-w-7xl mx-auto px-6 py-16 relative z-10 mx-4 mb-8">
        <h2 className="text-4xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-10 text-center">
          {t('lifestyleTips', { defaultValue: 'Ayurvedic Lifestyle Tips' })}
        </h2>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto">
          {t('lifestyleIntro', { defaultValue: 'Incorporate these practices into your daily life to align with your Prakriti and enhance well-being.' })}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {lifestyleTips.slice(0, visibleCards).map((tip) => (
            <div 
              key={tip.id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02]"
              onClick={() => toggleCard(tip.id)}
            >
             <div className="relative w-full h-48 overflow-hidden">
  <img 
    src={tip.image} 
    alt={tip.title} 
    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
  />
  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
      <img 
        src={tip.icon} 
        alt={`${tip.title} Icon`} 
        className="w-12 h-12 object-contain overflow-hidden"
      />
    </div>
  </div>
</div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{tip.title}</h3>
                <div className="transition-all duration-500 ease-in-out overflow-hidden" 
                     style={{ maxHeight: expandedCard === tip.id ? '400px' : '80px' }}>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{tip.tip}</p>
                  {expandedCard === tip.id && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{tip.extraTip}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {lifestyleTips.length > 6 && (
          <button
            onClick={toggleShowMore}
            className="mx-auto flex flex-col items-center gap-2 text-ayurGreen dark:text-ayurBeige hover:text-ayurGreen/80 transition-all duration-300 group"
          >
            <span className="text-lg font-medium">
              {visibleCards < lifestyleTips.length ? 'Show More Tips' : 'Show Less'}
            </span>
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                visibleCards < lifestyleTips.length 
                  ? 'animate-bounce group-hover:translate-y-1' 
                  : 'rotate-180 group-hover:-translate-y-1'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      <PageUpButton />
    </div>
  );
};

export default Homepage;