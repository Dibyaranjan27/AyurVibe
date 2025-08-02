import React, { createContext, useState, useEffect, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { auth } from '../data/firebase';
import { User } from '../types';
import { onAuthStateChanged } from 'firebase/auth';

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
        // ... other translations ...
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
        // ... other translations ...
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
});

interface AppContextType {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
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
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await import('../data/firebase').then(({ getDoc, doc, db }) => getDoc(doc(db, 'users', firebaseUser.uid)));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    darkMode,
    setDarkMode,
    user,
    setUser,
    language,
    setLanguage,
    heroContent: {
      heading: 'Discover Your AyurVibe',
      subheading: 'Unlock your Ayurvedic constitution with a simple quiz',
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};