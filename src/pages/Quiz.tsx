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

  if (!context) return null;
  const { user } = context;

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, { dosha: string; text: string }>>({});
  const [selectedDosha, setSelectedDosha] = useState<string | null>(null);
  const [customText, setCustomText] = useState<string>('');
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);

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

  const handleOptionSelect = (option: Question['options'][0]) => {
    setSelectedDosha(option.dosha);
    if (option.dosha === 'Other') {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
      const currentId = questions[currentQuestion].id;
      setAnswers({
        ...answers,
        [currentId]: { dosha: option.dosha, text: option.text },
      });
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
      } else {
        processResults();
      }
    }
  };

  const handleCustomSubmit = () => {
    if (!customText.trim()) {
      alert(t('customRequired', { defaultValue: 'Please provide a custom description for Other.' }));
      return;
    }
    const currentId = questions[currentQuestion].id;
    setAnswers({
      ...answers,
      [currentId]: { dosha: 'Other', text: customText },
    });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      processResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const processResults = async () => {
    if (user && user.id) {
      const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
      Object.values(answers).forEach((answer) => {
        if (answer.dosha !== 'Other') {
          doshaCounts[answer.dosha as keyof typeof doshaCounts]++;
        }
      });
      const primaryDosha = Object.keys(doshaCounts).reduce((a, b) =>
        doshaCounts[a as keyof typeof doshaCounts] > doshaCounts[b as keyof typeof doshaCounts] ? a : b
      );
      const secondaryDosha = Object.keys(doshaCounts)
        .filter((d) => d !== primaryDosha)
        .reduce(
          (a, b) =>
            doshaCounts[a as keyof typeof doshaCounts] > doshaCounts[b as keyof typeof doshaCounts] ? a : b,
          primaryDosha
        );
      const prakriti =
        doshaCounts[primaryDosha as keyof typeof doshaCounts] ===
        doshaCounts[secondaryDosha as keyof typeof doshaCounts]
          ? 'Tridoshic'
          : `${primaryDosha}-${secondaryDosha}`;
      await saveQuizAnswers(user.id, answers, prakriti);
      const updatedDoc = await getDoc(doc(db, 'users', user.id));
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data() as typeof user;
        context.setUser({ ...user, prakriti: updatedData.prakriti });
      }
      navigate('/results', { state: { answers } });
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

  const currentQuestionData = questions[currentQuestion];
  const currentOptions = [...currentQuestionData.options];

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
                  {currentQuestionData.text}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {currentOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`group p-4 pt-6 rounded-xl shadow-sm text-center transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                      selectedDosha === option.dosha
                        ? 'bg-ayurGreen/20 border-ayurGreen dark:bg-ayurGreen/30'
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

              <div className="flex justify-center items-center">
                <button
                  onClick={() => handleOptionSelect({ text: t('other', { defaultValue: 'Other (please specify)' }), dosha: 'Other', illustration: '/illustrations/other.svg' })}
                  className={`group p-4 pt-6 rounded-xl shadow-sm text-center transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                    isOtherSelected
                      ? 'bg-ayurGreen/20 border-ayurGreen dark:bg-ayurGreen/30'
                      : 'bg-gray-100/80 hover:bg-white border-transparent dark:bg-gray-700/80 dark:hover:bg-gray-700'
                  }`}
                  aria-label={t('other', { defaultValue: 'Other (please specify)' })}
                >
                  <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
                    {t('other', { defaultValue: 'Other (please specify)' })}
                  </span>
                </button>
                {isOtherSelected && (
                  <div className="ml-4 flex items-center">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full max-w-xs p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen text-gray-900 dark:text-gray-100"
                      placeholder={t('enterCustom', { defaultValue: 'Enter your custom description' })}
                    />
                    <button
                      onClick={handleCustomSubmit}
                      className="ml-2 bg-ayurGreen text-white px-4 py-2 rounded-full hover:bg-ayurGreen/80 transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-5 py-2.5 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            disabled={currentQuestion === 0}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Previous
          </button>
          <button
            onClick={handleCustomSubmit}
            className="flex items-center gap-2 bg-ayurGreen text-white px-5 py-2.5 rounded-full hover:bg-ayurGreen/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!isOtherSelected || !customText.trim()}
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