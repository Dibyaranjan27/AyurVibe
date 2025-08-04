import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { questions } from '../data/questions';
import { useTranslation } from 'react-i18next';
import { Question } from '../types';
import { saveQuizAnswers, getDoc, doc, db } from '../data/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import FloatingLeaves from '../components/FloatingLeaves';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  if (!context) return null;
  const { user } = context;

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = async (option: Question['options'][0]) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: option.dosha };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      if (user && user.id) {
        const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
        Object.values(newAnswers).forEach((dosha) => doshaCounts[dosha as keyof typeof doshaCounts]++);
        const primaryDosha = Object.keys(doshaCounts).reduce((a, b) =>
          doshaCounts[a as keyof typeof doshaCounts] > doshaCounts[b as keyof typeof doshaCounts] ? a : b
        );
        const secondaryDosha = Object.keys(doshaCounts)
          .filter((d) => d !== primaryDosha)
          .reduce((a, b) => (doshaCounts[a as keyof typeof doshaCounts] > doshaCounts[b as keyof typeof doshaCounts] ? a : b), primaryDosha);
        const prakriti = doshaCounts[primaryDosha as keyof typeof doshaCounts] === doshaCounts[secondaryDosha as keyof typeof doshaCounts]
          ? 'Tridoshic'
          : `${primaryDosha}-${secondaryDosha}`;
        await saveQuizAnswers(user.id, newAnswers, prakriti);
        const updatedDoc = await getDoc(doc(db, 'users', user.id));
        if (updatedDoc.exists()) {
          const updatedData = updatedDoc.data() as typeof user;
          context.setUser({ ...user, prakriti: updatedData.prakriti });
        }
      }
      navigate('/results', { state: { answers: newAnswers } });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const questionVariants = {
    enter: {
      x: 100,
      opacity: 0,
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      x: -100,
      opacity: 0,
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-stone-50 to-amber-50 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center p-4 font-openSans transition-colors duration-500 overflow-hidden">
      <FloatingLeaves />

      <div className="relative z-10 max-w-2xl mt-24 w-full bg-white/70 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 sm:p-10 mx-auto">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-2">
            {t('quiz')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Discover Your Dosha Profile</p>
        </div>

        <div className="mb-8 px-2">
          <div className="flex justify-between items-center mb-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{t('progress')}</span>
            <span>Question {currentQuestion + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div
              className="bg-ayurGreen h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>
        
        <div className="relative h-96 sm:h-80 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              variants={questionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <p className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                  {questions[currentQuestion].text}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`group p-4 pt-6 rounded-xl shadow-sm text-center transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                      answers[questions[currentQuestion].id] === option.dosha
                        ? 'bg-ayurGreen/20 border-ayurGreen dark:bg-ayurGreen/30'
                        : 'bg-gray-100/80 hover:bg-white border-transparent dark:bg-gray-700/80 dark:hover:bg-gray-700'
                    }`}
                    aria-label={option.text}
                  >
                    {/* <div className="flex items-center justify-center h-20 mb-4">
                      <img 
                        src={option.illustration} 
                        alt={option.text} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div> */}
                    <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
            {/* FIXED: Corrected the typo here */}
            </AnimatePresence>
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-5 py-2.5 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            disabled={currentQuestion === 0}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-ayurGreen text-white px-5 py-2.5 rounded-full hover:bg-ayurGreen/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!answers[questions[currentQuestion].id] || currentQuestion === questions.length - 1}
          >
            Next
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;