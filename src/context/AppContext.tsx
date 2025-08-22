import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { auth, db } from '../data/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

// Define User type
interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  prakriti?: string; 
  healthDetails?: Record<string, any>;
}

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

// Your i18n initialization
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        heroHeading: 'Embrace Wellness with AyurVibe',
        heroSubheading: 'Journey into Ayurveda with personalized quizzes, natural remedies, and a holistic lifestyle tailored to your unique Prakriti.',
        // ... other english translations
      },
    },
    hi: {
      translation: {
        heroHeading: 'आयुर्विब के साथ कल्याण को गले लगाओ', // Example translation
        heroSubheading: 'व्यक्तिगत क्विज़, प्राकृतिक उपचार और अपनी अनूठी प्रकृति के अनुरूप एक समग्र जीवन शैली के साथ आयुर्वेद की यात्रा।', // Example translation
        // ... other hindi translations
      },
    },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en'
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      return JSON.parse(savedDarkMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [user, setUser] = useState<User | null>(null);
  
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          const userData: User = {
            id: firebaseUser.uid,
            name: firestoreData.name,
            email: firebaseUser.email || '',
            prakriti: firestoreData.prakriti,
            healthDetails: firestoreData.healthDetails,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
            console.warn("User document not found in Firestore for UID:", firebaseUser.uid);
            setUser(null);
            localStorage.removeItem('user');
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });
    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const value = useMemo(() => ({
    darkMode,
    toggleDarkMode,
    user,
    setUser,
    language,
    setLanguage,
    heroContent: {
      heading: i18n.t('heroHeading'),
      subheading: i18n.t('heroSubheading'),
    },
  }), [darkMode, user, language]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};