import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import DarkModeButton from '../components/DarkModeButton';
import PageUpButton from '../components/PageUpButton';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  if (!context) return null;
  const { heroContent } = context;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 mt-16">
      <DarkModeButton />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center">
        <div className="w-1/2 pr-12">
          <h1 className="text-5xl font-bold dark:text-white mb-6">
            {heroContent.heading}
          </h1>
          <p className="text-lg dark:text-gray-300 mb-8">
            {heroContent.subheading}
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="bg-ayurGreen text-white px-8 py-3 rounded-full text-lg hover:bg-ayurGreen/90 transition-colors"
          >
            {t('startQuiz')}
          </button>
        </div>
        <div className="w-1/2 relative">
          <div className="aspect-square rounded-full bg-ayurBeige/20 relative overflow-hidden">
            <img 
              src="src/assets/hero2-removebg-preview.png" 
              alt={t('ayurvedicProducts', { defaultValue: 'Ayurvedic Products' })} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <PageUpButton />
    </div>
  );
};

export default Homepage;