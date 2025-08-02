import { Question } from '../types';

// Sample questions (expand to 24 later)
export const questions: Question[] = [
  {
    id: 1,
    text: 'How would you describe your skin?',
    options: [
      { text: 'Dry and rough', dosha: 'Vata' },
      { text: 'Oily and sensitive', dosha: 'Pitta' },
      { text: 'Soft and moist', dosha: 'Kapha' },
    ],
  },
  {
    id: 2,
    text: 'What is your body frame like?',
    options: [
      { text: 'Thin and light', dosha: 'Vata' },
      { text: 'Medium and muscular', dosha: 'Pitta' },
      { text: 'Large and sturdy', dosha: 'Kapha' },
    ],
  },
  {
    id: 3,
    text: 'How would you describe your mind?',
    options: [
      { text: 'Restless and anxious', dosha: 'Vata' },
      { text: 'Intense and focused', dosha: 'Pitta' },
      { text: 'Calm and steady', dosha: 'Kapha' },
    ],
  },
  {
    id: 4,
    text: 'How is your sleep pattern?',
    options: [
      { text: 'Light and irregular', dosha: 'Vata' },
      { text: 'Moderate but intense', dosha: 'Pitta' },
      { text: 'Deep and prolonged', dosha: 'Kapha' },
    ],
  },
  {
    id: 5,
    text: 'How do you handle stress?',
    options: [
      { text: 'Easily overwhelmed', dosha: 'Vata' },
      { text: 'Irritable and impatient', dosha: 'Pitta' },
      { text: 'Relaxed and slow to react', dosha: 'Kapha' },
    ],
  },
];