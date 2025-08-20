import { useState, useContext, useEffect } from 'react';
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
  
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, { dosha: string; text: string }>>({});
  const [selectedDosha, setSelectedDosha] = useState<string | null>(null);
  const [customText, setCustomText] = useState<string>('');
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);

  const { user, setUser } = context || {};

  useEffect(() => {
    const currentId = questions[currentQuestion].id;
    const answer = answers[currentId];
    if (answer) {
      setSelectedDosha(answer.dosha);
      if (answer.dosha === 'Other') {
        setCustomText(answer.text);
        setIsOtherSelected(true);
      } else {
        setCustomText('');
        setIsOtherSelected(false);
      }
    } else {
      setSelectedDosha(null);
      setCustomText('');
      setIsOtherSelected(false);
    }
  }, [currentQuestion, answers]);

  if (!context) {
    return null;
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      processResults();
    }
  };

  const handleOptionSelect = (option: Question['options'][0]) => {
    setSelectedDosha(option.dosha);
    const currentId = questions[currentQuestion].id;
    if (option.dosha === 'Other') {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
      setAnswers({ ...answers, [currentId]: { dosha: option.dosha, text: option.text } });
      setTimeout(handleNext, 300);
    }
  };

  const handleCustomSubmit = () => {
    if (!customText.trim()) {
      alert(t('customRequired', { defaultValue: 'Please provide a custom description.' }));
      return;
    }
    const currentId = questions[currentQuestion].id;
    setAnswers({ ...answers, [currentId]: { dosha: 'Other', text: customText } });
    handleNext();
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const processResults = async () => {
    const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.values(answers).forEach((answer) => {
      if (answer.dosha !== 'Other') {
        doshaCounts[answer.dosha as keyof typeof doshaCounts]++;
      }
    });
    
    const sortedDoshas = Object.keys(doshaCounts).sort((a, b) => doshaCounts[b as keyof typeof doshaCounts] - doshaCounts[a as keyof typeof doshaCounts]);
    const primaryDosha = sortedDoshas[0] || 'Vata';
    const secondaryDosha = sortedDoshas[1] || 'Pitta';
    const prakriti = doshaCounts.Vata === doshaCounts.Pitta && doshaCounts.Pitta === doshaCounts.Kapha ? 'Tridoshic' : `${primaryDosha}-${secondaryDosha}`;

    if (user?.id) {
      await saveQuizAnswers(user.id, answers, prakriti);
      const updatedDoc = await getDoc(doc(db, 'users', user.id));
      if (updatedDoc.exists()) {
        // CHANGE: Removed the unnecessary type assertion
        const updatedData = updatedDoc.data();
        if (setUser) {
          setUser({ ...user, prakriti: updatedData.prakriti });
        }
      }
      navigate('/results', { state: { answers } });
    } else {
      const guestResults = { answers, prakriti };
      sessionStorage.setItem('guestQuizResults', JSON.stringify(guestResults));
      navigate('/results');
    }
  };

  const questionVariants = {
    enter: { x: 100, opacity: 0 },
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: { zIndex: 0, x: -100, opacity: 0 },
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-stone-50 to-amber-50 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center p-4 font-openSans transition-colors duration-500 overflow-hidden">
      <FloatingLeaves />

      <div className="relative md:mt-24 z-10 max-w-2xl w-full bg-white/70 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 sm:p-10 mx-auto">
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

        <div className="relative sm:h-80 flex items-center justify-center overflow-hidden">
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
                  {currentQuestionData.text}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.text}
                    onClick={() => handleOptionSelect(option)}
                    className={`group p-4 rounded-xl shadow-sm text-center transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                      selectedDosha === option.dosha && !isOtherSelected
                        ? 'bg-ayurGreen/20 border-ayurGreen dark:bg-ayurBeige/20 dark:border-ayurBeige'
                        : 'bg-gray-100/80 hover:bg-white border-transparent dark:bg-gray-700/80 dark:hover:bg-gray-700'
                    }`}
                    aria-label={option.text}
                  >
                    <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => handleOptionSelect({ text: 'Other', dosha: 'Other', illustration: '' })}
                  className={`w-full sm:w-auto p-4 rounded-xl shadow-sm text-center transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                    isOtherSelected
                      ? 'bg-ayurGreen/20 border-ayurGreen dark:bg-ayurBeige/20 dark:border-ayurBeige'
                      : 'bg-gray-100/80 hover:bg-white border-transparent dark:bg-gray-700/80 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
                   {t('other', { defaultValue: 'Specify another answer' })}
                  </span>
                </button>
                <AnimatePresence>
                  {isOtherSelected && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center w-full sm:w-auto"
                    >
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen text-gray-900 dark:text-gray-100"
                        placeholder={t('enterCustom', { defaultValue: 'Describe...' })}
                      />
                      <button
                        onClick={handleCustomSubmit}
                        className="ml-2 bg-ayurGreen text-white px-4 py-3 rounded-lg hover:bg-ayurGreen/80 transition-colors"
                      >
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-5 py-2.5 rounded-full font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentQuestion === 0}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-ayurGreen text-white px-5 py-2.5 rounded-full font-semibold hover:bg-ayurGreen/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!answers[currentQuestionData.id] || (answers[currentQuestionData.id]?.dosha === 'Other' && !customText.trim())}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;