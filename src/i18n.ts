import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Discover Your AyurVibe',
          startQuiz: 'Take Quiz',
          intro: 'Unlock your Ayurvedic constitution with a simple quiz',
          quiz: 'Take Quiz',
          loginRequired: 'Please log in to view your results',
          results: 'Your Results',
          prakriti: 'Your Prakriti: ',
          // Add other translations as needed
        },
      },
      hi: {
        translation: {
          welcome: 'अपनी आयुर्वेदिक संतुलन की खोज करें',
          startQuiz: 'प्रश्नोत्तरी लें',
          intro: 'एक साधारण प्रश्नोत्तरी के साथ अपनी आयुर्वेदिक संरचना को अनलॉक करें',
          quiz: 'प्रश्नोत्तरी लें',
          loginRequired: 'कृपया लॉगिन करें ताकि आप अपने परिणाम देख सकें',
          results: 'आपके परिणाम',
          prakriti: 'आपकी प्रकृति: ',
          // Add other translations as needed
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
  });

export default i18n;