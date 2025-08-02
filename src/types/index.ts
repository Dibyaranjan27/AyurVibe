// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  prakriti?: string;
  healthDetails?: {
    skin: string;
    build: string;
    mindset: string;
  };
  quizHistory?: QuizResult[];
}

export interface Question {
  id: number;
  text: {
    en: string;
    hi: string;
  };
  options: {
    vata: string;
    pitta: string;
    kapha: string;
  };
  category: 'physical' | 'mental' | 'habits' | 'environment';
}

export interface QuizResult {
  date: Date;
  prakriti: string;
  scores: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  answers: Record<number, string>;
}

export interface Recommendation {
  prakriti: string;
  diet: string[];
  schedule: string[];
  lifestyle: string[];
}