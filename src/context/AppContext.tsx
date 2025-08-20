import React, { createContext, useState, useEffect, ReactNode } from 'react';
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
        // ... english translations
      },
    },
    hi: {
      translation: {
        // ... hindi translations
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
          const userData = {
            id: firebaseUser.uid,
            name: userDoc.data().name,
            email: firebaseUser.email || '',
          } as User;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
            // Handle case where user exists in auth but not firestore
            console.warn("User document not found in Firestore for UID:", firebaseUser.uid);
            setUser(null); // Or create a default user object
            localStorage.removeItem('user');
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });
    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const value = {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};