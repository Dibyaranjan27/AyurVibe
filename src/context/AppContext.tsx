  import React, { createContext, useState, useEffect, ReactNode } from 'react';
  import i18n from 'i18next';
  import { initReactI18next } from 'react-i18next';
  import { auth } from '../data/firebase';
  import { User } from '../types';
  import { onAuthStateChanged } from 'firebase/auth';
  import { getDoc, doc, db } from '../data/firebase'; // Updated import

  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: {
          welcome: 'Discover Your AyurVibe',
          startQuiz: 'Take Quiz',
          intro: 'Unlock your Ayurvedic constitution with a simple quiz',
          profile: 'Profile',
          quiz: 'Take Quiz',
          userDashboard: 'User Dashboard',
          admin: 'Admin Dashboard',
          heroHeading: 'Embrace Wellness with AyurVibe',
          heroSubheading: 'Journey into Ayurveda with personalized quizzes, natural remedies, and a holistic lifestyle tailored to your unique Prakriti.',
          loginRequired: 'Please log in to view your profile',
          save: 'Save',
          edit: 'Edit',
          back: 'Back',
          results: 'Your Results',
          prakriti: 'Your Prakriti: ',
          doshaBreakdown: 'Dosha Breakdown:',
          vata: 'Vata',
          pitta: 'Pitta',
          kapha: 'Kapha',
          points: 'points',
          recommendation: 'Recommendation: Balance your dominant dosha with a diet and lifestyle suited to your Prakriti.',
          lifestyleTips: 'Ayurvedic Lifestyle Tips',
          lifestyleIntro: 'Incorporate these practices into your daily life to align with your Prakriti and enhance well-being.',
          ayurvedaServices: 'Discover Your Prakriti Dosha',
          servicesIntro: 'Prakriti Dosha defines your unique mind-body constitution in Ayurveda, shaped by Vata, Pitta, and Kapha. Take our quiz to uncover yours and embrace a balanced lifestyle!',
          dietTip: 'Enjoy warm, cooked meals tailored to your Dosha...',
          dietTipExtra: 'Try adding spices like cumin or coriander...',
          yogaTip: 'Practice gentle poses like Surya Namaskar or Tree Pose...',
          yogaTipExtra: 'Focus on grounding poses for Vata or cooling ones for Pitta...',
          meditationTip: 'Spend 10-20 minutes daily with mindfulness or mantra meditation...',
          meditationTipExtra: 'Use a quiet space with incense to deepen your practice.',
          herbalTip: 'Incorporate turmeric, ashwagandha, or triphala to strengthen immunity...',
          herbalTipExtra: 'Steep herbs in warm water for a soothing tea blend.',
          sleepTip: 'Aim for 7-8 hours of sleep with a consistent schedule...',
          sleepTipExtra: 'Avoid screens an hour before bed to improve sleep quality.',
          breathingTip: 'Try Pranayama techniques like Anulom Vilom to enhance lung function...',
          breathingTipExtra: 'Practice in a ventilated area for best results.',
          massageTip: 'Regular self-massage with warm oils helps balance doshas and improve circulation.',
          massageTipExtra: 'Use sesame oil for Vata, coconut oil for Pitta, and mustard oil for Kapha.',
          routineTip: 'Follow a consistent daily schedule aligned with natural rhythms.',
          routineExtra: 'Wake up before sunrise and sleep by 10 PM for optimal health.',
          footerText: '© 2025 AyurVibe. All rights reserved. Embrace a natural lifestyle.',
          loginError: "You don't have an account or you have entered invalid credentials.",
          registerError: 'Registration failed. Please try again or check your credentials.',
          nameError: 'Name is required and must be at least 2 characters.',
          emailError: 'A valid email is required.',
          passwordError: 'Password must be at least 6 characters and include uppercase, lowercase, number, and special character (e.g., !@#$%).',
          passwordMismatch: 'Passwords do not match.',
        },
      },
      hi: {
        translation: {
          welcome: 'अपनी आयुर्वेदिक संतुलन की खोज करें',
          startQuiz: 'प्रश्नोत्तरी लें',
          intro: 'एक साधारण प्रश्नोत्तरी के साथ अपनी आयुर्वेदिक संरचना को अनलॉक करें',
          profile: 'प्रोफाइल',
          quiz: 'प्रश्नोत्तरी लें',
          userDashboard: 'उपयोगकर्ता डैशबोर्ड',
          admin: 'प्रशासक डैशबोर्ड',
          heroHeading: 'आयुर्वाइब के साथ कल्याण को अपनाएं',
          heroSubheading: 'अपनी अनोखी प्रकृति के अनुसार व्यक्तिगत प्रश्नोत्तरी, प्राकृतिक उपचार और समग्र जीवनशैली के साथ आयुर्वेद की यात्रा करें।',
          loginRequired: 'कृपया अपने प्रोफाइल को देखने के लिए लॉगिन करें',
          save: 'सहेजें',
          edit: 'संपादित करें',
          back: 'वापस',
          results: 'आपके परिणाम',
          prakriti: 'आपकी प्रकृति: ',
          doshaBreakdown: 'दोष विश्लेषण:',
          vata: 'वात',
          pitta: 'पित्त',
          kapha: 'कफ',
          points: 'अंक',
          recommendation: 'सुझाव: अपने प्रमुख दोष को संतुलित करने के लिए अपनी प्रकृति के अनुसार आहार और जीवनशैली अपनाएं।',
          lifestyleTips: 'आयुर्वेदिक जीवनशैली सुझाव',
          lifestyleIntro: 'अपनी प्रकृति के साथ संरेखित करने और कल्याण को बढ़ाने के लिए इन अभ्यासों को अपने दैनिक जीवन में शामिल करें।',
          ayurvedaServices: 'अपनी प्रकृति दोष की खोज करें',
          servicesIntro: 'प्रकृति दोष आयुर्वेद में आपके अद्वितीय मन-शरीर संविधान को परिभाषित करता है, जो वात, पित्त और कफ द्वारा आकारित होता है। अपनी प्रकृति को उजागर करने के लिए हमारी प्रश्नोत्तरी लें और संतुलित जीवनशैली अपनाएं!',
          dietTip: 'अपने दोष के अनुसार गर्म, पके हुए भोजन का आनंद लें...',
          dietTipExtra: 'जीरा या धनिया जैसे मसालों को आजमाएं...',
          yogaTip: 'सूर्य नमस्कार या वृक्षासन जैसे हल्के आसनों का अभ्यास करें...',
          yogaTipExtra: 'वात के लिए ग्राउंडिंग आसन या पित्त के लिए ठंडक देने वाले आसन पर ध्यान दें...',
          meditationTip: 'प्रतिदिन 10-20 मिनट ध्यान या मंत्र ध्यान के साथ बिताएं...',
          meditationTipExtra: 'अपने अभ्यास को गहरा करने के लिए शांत स्थान और अगरबत्ती का उपयोग करें।',
          herbalTip: 'इम्यूनिटी को मजबूत करने के लिए हल्दी, अश्वगंधा या त्रिफला शामिल करें...',
          herbalTipExtra: 'जड़ी-बूटियों को गर्म पानी में भिगोकर एक सुखदायक चाय मिश्रण बनाएं।',
          sleepTip: '7-8 घंटे की नींद के लिए एक सुसंगत समय-सारणी बनाएं...',
          sleepTipExtra: 'सोने से एक घंटे पहले स्क्रीन से बचें ताकि नींद की गुणवत्ता में सुधार हो।',
          breathingTip: 'फेफड़ों की कार्यक्षमता बढ़ाने के लिए अनुलोम-विलोम जैसे प्राणायाम तकनीकों को आजमाएं...',
          breathingTipExtra: 'सर्वोत्तम परिणामों के लिए हवादार स्थान पर अभ्यास करें।',
          massageTip: 'गर्म तेलों के साथ नियमित आत्म-मालिश दोषों को संतुलित करने और परिसंचरण में सुधार करने में मदद करती है।',
          massageTipExtra: 'वात के लिए तिल का तेल, पित्त के लिए नारियल का तेल और कफ के लिए सरसों का तेल उपयोग करें।',
          routineTip: 'प्राकृतिक लय के साथ संरेखित एक सुसंगत दैनिक समय-सारणी का पालन करें।',
          routineExtra: 'सूर्योदय से पहले उठें और रात 10 बजे तक सो जाएं ताकि स्वास्थ्य अनुकूलित हो।',
          footerText: '© 2025 आयुर्वाइब। सर्वाधिकार सुरक्षित। प्राकृतिक जीवनशैली अपनाएं।',
          loginError: "आपके पास कोई खाता नहीं है या आपने अमान्य प्रमाणपत्र दर्ज किए हैं।",
          registerError: 'पंजीकरण विफल रहा। कृपया पुनः प्रयास करें या अपने प्रमाणपत्र जांचें।',
          nameError: 'नाम आवश्यक है और इसमें कम से कम 2 अक्षर होने चाहिए।',
          emailError: 'एक वैध ईमेल आवश्यक है।',
          passwordError: 'पासवर्ड में कम से कम 6 अक्षर होने चाहिए और इसमें अंग्रेजी के बड़े, छोटे अक्षर, संख्या और विशेष चिह्न (जैसे !@#$%) शामिल होने चाहिए।',
          passwordMismatch: 'पासवर्ड मेल नहीं खाते।',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
  });

  interface AppContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    user: User | null;
    setUser: (user: User | null) => void;
    language: string;
    setLanguage: (language: string) => void;
    heroContent: {
      heading: string;
      subheading: string;
    };
  }

  export const AppContext = createContext<AppContextType | null>(null);

  export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
      const savedDarkMode = localStorage.getItem('darkMode');
      return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });
    const [user, setUser] = useState<User | null>(() => {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    });
    const [language, setLanguage] = useState<string>(() => {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage || 'en';
    });

    useEffect(() => {
      i18n.changeLanguage(language);
      localStorage.setItem('language', language);
    }, [language]);

    const toggleDarkMode = () => {
      setDarkMode((prev) => {
        const newDarkMode = !prev;
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        return newDarkMode;
      });
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            userData.id = firebaseUser.uid; // Ensure id is set
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      });
      return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }, [user]);

    const heroContent = {
      heading: i18n.t('heroHeading'),
      subheading: i18n.t('heroSubheading'),
    };

    const value = {
      darkMode,
      toggleDarkMode,
      user,
      setUser,
      language,
      setLanguage,
      heroContent,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
  };