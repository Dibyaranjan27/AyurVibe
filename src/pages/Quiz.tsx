import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { questions } from '../data/questions';
import { useTranslation } from 'react-i18next';
import { Question } from '../types';
import { saveQuizAnswers } from '../data/firebase';

interface ChatMessage {
  sender: 'AI' | 'User';
  text: string;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  if (!context) return null;
  const { user, darkMode } = context;

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'AI', text: questions[0].text },
  ]);

  const handleAnswer = async (option: Question['options'][0]) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: option.dosha };
    setAnswers(newAnswers);
    setChatMessages([...chatMessages, { sender: 'User', text: option.text }]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setChatMessages([
        ...chatMessages,
        { sender: 'User', text: option.text },
        { sender: 'AI', text: questions[currentQuestion + 1].text },
      ]);
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
      navigate('/login', { state: { answers: newAnswers } });
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      } flex items-center justify-center p-4`}
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-lora font-bold text-ayurGreen mb-4">{t('quiz')}</h2>
        <div className="h-64 overflow-y-auto mb-4">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'AI' ? 'text-left' : 'text-right'}`}>
              <span
                className={`inline-block p-2 rounded font-openSans ${
                  msg.sender === 'AI' ? 'bg-ayurGreen text-white' : 'bg-ayurBeige text-gray-900'
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        {currentQuestion < questions.length &&
          questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full bg-ayurSaffron text-white p-2 mb-2 rounded hover:bg-orange-600"
              aria-label={option.text}
            >
              {option.text}
            </button>
          ))}
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-4">
          <div
            className="bg-ayurGreen h-2.5 rounded-full"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;