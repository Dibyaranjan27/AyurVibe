import { Question } from '../types';

export const questions: Question[] = [
  // --- Physical Traits ---
  {
    id: 1,
    text: 'Which best describes your natural body frame?',
    options: [
      {
        text: 'Thin and slender, I find it hard to gain weight.',
        dosha: 'Vata',
        illustration: '/illustrations/body-thin.svg',
      },
      {
        text: 'Medium and muscular, with good definition.',
        dosha: 'Pitta',
        illustration: '/illustrations/body-medium.svg',
      },
      {
        text: 'Sturdy and well-built, I gain weight easily.',
        dosha: 'Kapha',
        illustration: '/illustrations/body-large.svg',
      },
    ],
  },
  {
    id: 2,
    text: 'How does your skin typically feel?',
    options: [
      {
        text: 'Dry, thin, and cool to the touch, especially in winter.',
        dosha: 'Vata',
        illustration: '/illustrations/skin-dry.svg',
      },
      {
        text: 'Warm and oily, prone to moles, freckles, or rashes.',
        dosha: 'Pitta',
        illustration: '/illustrations/skin-oily.svg',
      },
      {
        text: 'Thick, smooth, and well-hydrated, but can be oily.',
        dosha: 'Kapha',
        illustration: '/illustrations/skin-balanced.svg',
      },
    ],
  },
  {
    id: 3,
    text: 'What is your hair like naturally?',
    options: [
      {
        text: 'Dry, thin, or brittle, and can be frizzy.',
        dosha: 'Vata',
        illustration: '/illustrations/hair-dry.svg',
      },
      {
        text: 'Fine and soft, may be thinning or greying prematurely.',
        dosha: 'Pitta',
        illustration: '/illustrations/hair-oily.svg',
      },
      {
        text: 'Thick, lustrous, and abundant, perhaps a bit oily.',
        dosha: 'Kapha',
        illustration: '/illustrations/hair-thick.svg',
      },
    ],
  },
  {
    id: 4,
    text: 'Which of these best describes your eyes?',
    options: [
      {
        text: 'Small, active, and may feel dry or tired.',
        dosha: 'Vata',
        illustration: '/illustrations/eyes-small.svg',
      },
      {
        text: 'Medium-sized with a sharp, intense gaze.',
        dosha: 'Pitta',
        illustration: '/illustrations/eyes-sharp.svg',
      },
      {
        text: 'Large, calm, and pleasant with thick lashes.',
        dosha: 'Kapha',
        illustration: '/illustrations/eyes-large.svg',
      },
    ],
  },
  // --- Daily Habits & Preferences ---
  {
    id: 5,
    text: 'How is your appetite and digestion?',
    options: [
      {
        text: 'Irregular. I can be hungry one moment and forget to eat the next.',
        dosha: 'Vata',
        illustration: '/illustrations/appetite-irregular.svg',
      },
      {
        text: 'Strong and sharp. I get irritable if I miss a meal.',
        dosha: 'Pitta',
        illustration: '/illustrations/appetite-strong.svg',
      },
      {
        text: 'Slow but steady. I enjoy food but can easily skip a meal.',
        dosha: 'Kapha',
        illustration: '/illustrations/appetite-steady.svg',
      },
    ],
  },
  {
    id: 6,
    text: 'What are your typical sleep patterns?',
    options: [
      {
        text: 'Light and easily disturbed. I often have trouble falling asleep.',
        dosha: 'Vata',
        illustration: '/illustrations/sleep-light.svg',
      },
      {
        text: 'I sleep soundly but can be woken by heat. I do well on 6-7 hours.',
        dosha: 'Pitta',
        illustration: '/illustrations/sleep-moderate.svg',
      },
      {
        text: 'My sleep is deep and long. I love to sleep in and can feel groggy.',
        dosha: 'Kapha',
        illustration: '/illustrations/sleep-deep.svg',
      },
    ],
  },
  {
    id: 7,
    text: 'How would you describe your energy and stamina?',
    options: [
      {
        text: 'It comes in bursts. I am active but can tire easily.',
        dosha: 'Vata',
        illustration: '/illustrations/energy-bursts.svg',
      },
      {
        text: 'Focused and intense. I am competitive and have good stamina.',
        dosha: 'Pitta',
        illustration: '/illustrations/energy-focused.svg',
      },
      {
        text: 'Consistent and enduring. I move at a slower, methodical pace.',
        dosha: 'Kapha',
        illustration: '/illustrations/energy-steady.svg',
      },
    ],
  },
    {
    id: 8,
    text: 'What kind of climate do you prefer?',
    options: [
      {
        text: 'Warm and humid. I strongly dislike cold, dry, and windy weather.',
        dosha: 'Vata',
        illustration: '/illustrations/weather-warm.svg',
      },
      {
        text: 'Cool environments. I can\'t stand intense heat and humidity.',
        dosha: 'Pitta',
        illustration: '/illustrations/weather-cool.svg',
      },
      {
        text: 'I adapt well but prefer warm and dry climates over cold and damp.',
        dosha: 'Kapha',
        illustration: '/illustrations/weather-dry.svg',
      },
    ],
  },
  // --- Mental, Emotional & Behavioral Traits ---
  {
    id: 9,
    text: 'How do you typically react when under stress?',
    options: [
      {
        text: 'I become anxious, worried, and have trouble "switching off."',
        dosha: 'Vata',
        illustration: '/illustrations/stress-anxious.svg',
      },
      {
        text: 'I become irritable, impatient, and can be critical or demanding.',
        dosha: 'Pitta',
        illustration: '/illustrations/stress-irritable.svg',
      },
      {
        text: 'I tend to withdraw, feel unmotivated, or handle it calmly.',
        dosha: 'Kapha',
        illustration: '/illustrations/stress-calm.svg',
      },
    ],
  },
  {
    id: 10,
    text: 'How would you describe your memory?',
    options: [
      {
        text: 'I learn quickly, but also forget quickly. Good short-term memory.',
        dosha: 'Vata',
        illustration: '/illustrations/memory-short.svg',
      },
      {
        text: 'My memory is sharp and accurate. I remember details well.',
        dosha: 'Pitta',
        illustration: '/illustrations/memory-sharp.svg',
      },
      {
        text: 'I may learn slowly, but I have excellent long-term recall.',
        dosha: 'Kapha',
        illustration: '/illustrations/memory-long.svg',
      },
    ],
  },
  {
    id: 11,
    text: 'What is your general pace of activity?',
    options: [
      {
        text: 'Fast-paced. I walk and talk quickly and enjoy being on the move.',
        dosha: 'Vata',
        illustration: '/illustrations/pace-fast.svg',
      },
      {
        text: 'Determined and focused. I move with purpose to get things done.',
        dosha: 'Pitta',
        illustration: '/illustrations/pace-focused.svg',
      },
      {
        text: 'Slow and steady. I prefer a relaxed, graceful pace in my activities.',
        dosha: 'Kapha',
        illustration: '/illustrations/pace-slow.svg',
      },
    ],
  },
    {
    id: 12,
    text: 'When you are feeling balanced, what is your typical mood?',
    options: [
      {
        text: 'Enthusiastic, imaginative, and lively.',
        dosha: 'Vata',
        illustration: '/illustrations/mood-lively.svg',
      },
      {
        text: 'Intelligent, courageous, and a strong leader.',
        dosha: 'Pitta',
        illustration: '/illustrations/mood-leader.svg',
      },
      {
        text: 'Calm, compassionate, and agreeable.',
        dosha: 'Kapha',
        illustration: '/illustrations/mood-calm.svg',
      },
    ],
  },
  {
    id: 13,
    text: 'How do you typically handle money?',
    options: [
      {
        text: 'I spend it quickly and can be impulsive with purchases.',
        dosha: 'Vata',
        illustration: '/illustrations/money-spend.svg',
      },
      {
        text: 'I spend on quality, luxury items and plan my investments.',
        dosha: 'Pitta',
        illustration: '/illustrations/money-invest.svg',
      },
      {
        text: 'I am a natural saver and am cautious and deliberate with spending.',
        dosha: 'Kapha',
        illustration: '/illustrations/money-save.svg',
      },
    ],
  },
  {
    id: 14,
    text: 'What is your communication style like?',
    options: [
      {
        text: 'I am talkative and fast, sometimes jumping between topics.',
        dosha: 'Vata',
        illustration: '/illustrations/talk-fast.svg',
      },
      {
        text: 'I speak clearly, precisely, and can be very persuasive.',
        dosha: 'Pitta',
        illustration: '/illustrations/talk-clear.svg',
      },
      {
        text: 'I am a good listener and speak in a calm, thoughtful manner.',
        dosha: 'Kapha',
        illustration: '/illustrations/talk-calm.svg',
      },
    ],
  },
    {
    id: 15,
    text: 'How do you respond to changes in your routine?',
    options: [
      {
        text: 'I love change and new experiences, but can get unsettled by them.',
        dosha: 'Vata',
        illustration: '/illustrations/change-love.svg',
      },
      {
        text: 'I prefer an organized plan, but can adapt if the change is logical.',
        dosha: 'Pitta',
        illustration: '/illustrations/change-plan.svg',
      },
      {
        text: 'I am most comfortable with a steady routine and dislike change.',
        dosha: 'Kapha',
        illustration: '/illustrations/change-resist.svg',
      },
    ],
  },
];