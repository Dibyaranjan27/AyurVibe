import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { questions } from '../data/questions';
import { useTranslation } from 'react-i18next';
import { Question } from '../types';
import { saveQuizAnswers } from '../data/firebase';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  if (!context) return null;
  const { user, darkMode } = context;

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
      }
      navigate('/results', { state: { answers: newAnswers } });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'} flex flex-col items-center p-4 relative overflow-hidden`}>
      {/* Animated Nature Background */}
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
          {t('quiz')}
        </h2>
        <div className="mb-8 text-center">
          <p className="text-lg font-openSans">{questions[currentQuestion].text}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-4">
            <div
              className="bg-ayurSaffron h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-4"
              aria-label={option.text}
            >
              <span className="text-4xl">
                {option.dosha === 'Vata' ? '🌬️' : option.dosha === 'Pitta' ? '🔥' : '🌱'}
              </span>
              <span className="text-lg font-openSans">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;