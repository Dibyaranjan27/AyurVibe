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

// In a file like src/types.ts or directly in your questions file
export interface Option {
  text: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Other';
  illustration: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
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