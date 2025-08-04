// src/data/prakritiPlans.ts

// Interface for structured recommendations
interface RecommendationItem {
  category: string;
  advice: string;
  icon: string; // The name of a Heroicon from @heroicons/react/24/solid
}

// Interface for the diet donut chart
interface DietChartData {
  name: string;
  value: number;
  color: string;
}

// Interface for the routine timetable
interface RoutineItem {
  time: string;
  activity: string;
  description: string;
}

interface Plan {
  recommendations: RecommendationItem[];
  diet: {
    chartData: DietChartData[];
    foodsToAvoid: string[];
  };
  routine: RoutineItem[];
}

export const prakritiPlans: Record<string, Plan> = {
  // --- SINGLE DOSHA PLANS ---
  'Vata': {
    recommendations: [
      { category: 'Routine', advice: 'Establish a consistent daily routine (Dinacharya) to ground your mobile energy.', icon: 'ClockIcon' },
      { category: 'Environment', advice: 'Prioritize warmth in all aspects: food, drink, and environment.', icon: 'FireIcon' },
      { category: 'Mindfulness', advice: 'Practice calming, grounding exercises like gentle yoga and daily meditation.', icon: 'HeartIcon' },
      { category: 'Rest', advice: 'Ensure adequate rest and sleep to prevent nervous system exhaustion.', icon: 'MoonIcon' },
    ],
    diet: {
      chartData: [
        { name: 'Warm, Cooked Grains', value: 35, color: '#FBBF24' }, { name: 'Cooked Root Vegetables', value: 30, color: '#F87171' },
        { name: 'Healthy Fats & Oils', value: 20, color: '#34D399' }, { name: 'Sweet Fruits & Soups', value: 15, color: '#A78BFA' },
      ],
      foodsToAvoid: ['Dry/light foods (crackers, popcorn)', 'Raw vegetables & salads', 'Iced/carbonated drinks', 'Excessive caffeine'],
    },
    routine: [
      { time: '6:30 AM', activity: 'Wake & Hydrate', description: 'Drink a large glass of warm water, perhaps with lemon.' },
      { time: '7:00 AM', activity: 'Self-Massage (Abhyanga)', description: 'Use warm sesame oil to nourish skin and calm the nervous system.' },
      { time: '8:00 AM', activity: 'Warm Breakfast', description: 'Eat a warm, nourishing meal like cooked oatmeal.' },
      { time: '10:00 PM', activity: 'Bedtime', description: 'Wind down with calming music or reading. Aim for sleep by 10 PM.' },
    ],
  },
  'Pitta': {
    recommendations: [
      { category: 'Lifestyle', advice: 'Keep cool. Avoid excessive sun exposure and intense, competitive situations.', icon: 'SunIcon' },
      { category: 'Mindset', advice: 'Cultivate moderation in work and exercise to prevent burnout and intensity.', icon: 'ScaleIcon' },
      { category: 'Leisure', advice: 'Schedule leisure time in nature, especially near water, to calm your inner fire.', icon: 'SparklesIcon' },
      { category: 'Diet', advice: 'Favor sweet, bitter, and astringent tastes to pacify your inner fire.', icon: 'CakeIcon' },
    ],
    diet: {
      chartData: [
        { name: 'Sweet & Bitter Veggies', value: 40, color: '#4ADE80' }, { name: 'Cooling Grains (Rice)', value: 25, color: '#FBBF24' },
        { name: 'Sweet, Juicy Fruits', value: 20, color: '#60A5FA' }, { name: 'Lean Proteins & Legumes', value: 15, color: '#A78BFA' },
      ],
      foodsToAvoid: ['Pungent/spicy foods (chiles, cayenne)', 'Sour foods (vinegar)', 'Excessively salty or fried foods', 'Red meat, alcohol, and caffeine'],
    },
    routine: [
        { time: '6:00 AM', activity: 'Wake & Cool Down', description: 'Wake before sunrise. Drink room temperature water with mint.' },
        { time: '7:00 AM', activity: 'Moderate Exercise', description: 'Engage in calming activities like swimming or hiking in a cool environment.' },
        { time: '12:30 PM', activity: 'Largest Meal', description: 'Eat your main meal when your digestive fire (Agni) is strongest.' },
        { time: '10:30 PM', activity: 'Bedtime', description: 'Cool down with a brief walk or by reading something pleasant.' },
    ],
  },
  'Kapha': {
    recommendations: [
        { category: 'Activity', advice: 'Embrace stimulation and regular, vigorous activity to counter slowness.', icon: 'BoltIcon' },
        { category: 'Environment', advice: 'Keep warm and dry. Avoid cold, damp environments and daytime naps.', icon: 'CloudIcon' },
        { category: 'Lifestyle', advice: 'Regularly declutter your physical space and mind to promote lightness.', icon: 'TrashIcon' },
        { category: 'Growth', advice: 'Challenge yourself with new hobbies, learning, and new experiences.', icon: 'AcademicCapIcon' },
    ],
    diet: {
      chartData: [
        { name: 'Light & Bitter Greens', value: 40, color: '#22C55E' }, { name: 'Legumes & Beans', value: 25, color: '#F97316' },
        { name: 'Light Grains (Barley)', value: 20, color: '#EAB308' }, { name: 'Pungent Spices', value: 15, color: '#EF4444' },
      ],
      foodsToAvoid: ['Heavy, oily, and cold foods', 'Dairy products (milk, cheese)', 'Sweet and salty foods', 'Excessive water with meals'],
    },
    routine: [
      { time: '5:30 AM', activity: 'Wake Up Early', description: 'Wake before sunrise to counter sluggishness. Drink warm ginger tea.' },
      { time: '6:30 AM', activity: 'Vigorous Exercise', description: 'Engage in stimulating exercise like running or dancing for 30-60 minutes.' },
      { time: '1:00 PM', activity: 'Main Meal', description: 'Eat your main meal, focusing on warm, spicy, and light foods.' },
      { time: '6:30 PM', activity: 'Very Light Dinner', description: 'A simple vegetable soup or steamed vegetables is ideal.' },
    ],
  },

  // --- DUAL DOSHA PLANS ---
  'Vata-Pitta': {
      recommendations: [
        { category: 'Balance', advice: 'Ground Vata\'s mobility with routine, without aggravating Pitta\'s heat.', icon: 'AdjustmentsHorizontalIcon' },
        { category: 'Diet', advice: 'Choose foods that are both nourishing and cooling.', icon: 'ShoppingCartIcon' },
        { category: 'Activity', advice: 'Engage in activities that are calming yet moderately challenging, like vinyasa yoga.', icon: 'HeartIcon' },
      ],
      diet: {
        chartData: [ { name: 'Nourishing Grains', value: 35, color: '#60A5FA' }, { name: 'Sweet & Cooked Veggies', value: 30, color: '#34D399' }, { name: 'Cooling Fats & Oils', value: 20, color: '#FBBF24' }, { name: 'Ripe, Sweet Fruits', value: 15, color: '#F87171' }],
        foodsToAvoid: ['Highly spicy or pungent foods', 'Excessively dry or raw foods', 'Sour fermented foods', 'Stimulants like coffee'],
       },
      routine: [
        { time: '6:30 AM', activity: 'Wake & Meditate', description: 'Start with 10 minutes of mindfulness to calm both doshas.' },
        { time: '8:00 AM', activity: 'Substantial Breakfast', description: 'Have a nourishing breakfast like oatmeal with sweet spices.' },
        { time: '12:30 PM', activity: 'Main Meal', description: 'Eat a well-balanced lunch, avoiding extreme flavors.' },
      ],
  },
  'Pitta-Vata': {
      recommendations: [
        { category: 'Balance', advice: 'Prioritize cooling Pitta with a calm mindset, while maintaining Vata\'s need for stability.', icon: 'ScaleIcon' },
        { category: 'Diet', advice: 'Avoid skipping meals to keep both doshas happy and your energy stable.', icon: 'NoSymbolIcon' },
        { category: 'Activity', advice: 'Engage in mindful, non-competitive activities like swimming or walking in nature.', icon: 'SparklesIcon' },
      ],
      diet: {
        chartData: [ { name: 'Cooling Grains (Rice)', value: 35, color: '#60A5FA' }, { name: 'Sweet Vegetables', value: 30, color: '#34D399' }, { name: 'Sweet Fruits', value: 20, color: '#FBBF24' }, { name: 'Coconut & Ghee', value: 15, color: '#F87171' }],
        foodsToAvoid: ['Spicy foods (chiles, radishes)', 'Excessive salt and vinegar', 'Highly processed foods', 'Caffeine and alcohol'],
       },
      routine: [
        { time: '6:00 AM', activity: 'Gentle Awakening', description: 'Wake gently and drink room temperature water.' },
        { time: '8:00 AM', activity: 'Calm Breakfast', description: 'Eat a calming, substantial breakfast in a peaceful environment.' },
        { time: '12:00 PM', activity: 'Main Meal', description: 'Eat your main meal consistently around noon.' },
      ],
  },
    'Pitta-Kapha': {
      recommendations: [
        { category: 'Metabolism', advice: 'Focus on stimulating Kapha\'s digestion without overheating Pitta.', icon: 'FireIcon' },
        { category: 'Activity', advice: 'Embrace regular, stimulating exercise that is also enjoyable and non-aggressive.', icon: 'BoltIcon' },
        { category: 'Mindful Eating', advice: 'Satisfy Pitta\'s strong appetite with healthy foods to avoid Kapha-style overindulgence.', icon: 'BeakerIcon' },
      ],
      diet: {
        chartData: [ { name: 'Bitter & Astringent Greens', value: 40, color: '#22C55E' }, { name: 'Lean Proteins & Legumes', value: 30, color: '#F97316' }, { name: 'Light Grains (Barley)', value: 20, color: '#EAB308' }, { name: 'Pungent Spices', value: 10, color: '#EF4444' } ],
        foodsToAvoid: ['Heavy, oily, or fried foods', 'Excessive sweets and salt', 'Red meat and most dairy products', 'Iced foods and drinks'],
      },
      routine: [
        { time: '6:00 AM', activity: 'Active Start', description: 'Wake early and start with stimulating exercise like a brisk walk or jog.' },
        { time: '12:30 PM', activity: 'Satisfying Lunch', description: 'Have your largest meal, focusing on well-spiced, easy-to-digest foods.' },
        { time: '7:00 PM', activity: 'Light Dinner', description: 'Keep the evening meal very light, such as a hearty vegetable soup.' },
      ],
  },
  'Kapha-Pitta': {
      recommendations: [
        { category: 'Balance', advice: 'Prioritize keeping Kapha moving and light, without adding excess heat to aggravate Pitta.', icon: 'AdjustmentsHorizontalIcon' },
        { category: 'Variety', advice: 'Incorporate new challenges and variety into your routine to prevent stagnation.', icon: 'SparklesIcon' },
        { category: 'Diet', advice: 'Favor warm, light, and dry foods over cold, heavy, and oily ones.', icon: 'ShoppingCartIcon' },
      ],
      diet: {
        chartData: [ { name: 'Spicy & Bitter Veggies', value: 40, color: '#22C55E' }, { name: 'Legumes', value: 30, color: '#F97316' }, { name: 'Light Grains', value: 20, color: '#EAB308' }, { name: 'Astringent Fruits', value: 10, color: '#EF4444' } ],
        foodsToAvoid: ['Dairy, especially in the morning', 'Oily and heavy meats', 'Refined sugars and processed foods', 'Cold beverages'],
      },
      routine: [
        { time: '5:30 AM', activity: 'Vigorous Wake-Up', description: 'Wake before sunrise and get your body moving immediately.' },
        { time: '1:00 PM', activity: 'Main Meal', description: 'Eat a well-spiced, warm lunch to fuel your metabolism.' },
        { time: '6:30 PM', activity: 'Lightest Meal', description: 'Dinner should be minimal to allow for proper digestion overnight.' },
      ],
  },
  'Vata-Kapha': {
      recommendations: [
        { category: 'Warmth', advice: 'Warmth is the primary key for balancing both of these cold doshas.', icon: 'FireIcon' },
        { category: 'Routine', advice: 'A regular routine provides Vata stability and motivates Kapha out of inertia.', icon: 'ClockIcon' },
        { category: 'Nourishment', advice: 'Focus on light but nourishing and moist foods to avoid weighing down Kapha.', icon: 'BeakerIcon' },
      ],
      diet: {
        chartData: [ { name: 'Warm Cooked Veggies', value: 35, color: '#34D399' }, { name: 'Well-Spiced Legumes', value: 25, color: '#F97316' }, { name: 'Nourishing Grains', value: 25, color: '#FBBF24' }, { name: 'Warm Soups & Teas', value: 15, color: '#F87171' }],
        foodsToAvoid: ['Cold, raw, or dry foods', 'Heavy dairy and iced drinks', 'Excessive sweets', 'Processed or leftover food'],
      },
      routine: [
        { time: '6:30 AM', activity: 'Warm Water & Movement', description: 'Start with warm lemon water, followed by gentle, warming yoga.' },
        { time: '8:30 AM', activity: 'Warm, Light Breakfast', description: 'A small bowl of cooked spiced oatmeal or quinoa porridge.' },
        { time: '12:30 PM', activity: 'Main Meal', description: 'Enjoy a well-cooked, well-spiced lunch like kitchari.' },
      ],
  },
  'Kapha-Vata': {
      recommendations: [
        { category: 'Stimulation', advice: 'Focus on light, warm, and stimulating activities to energize both doshas.', icon: 'BoltIcon' },
        { category: 'Consistency', advice: 'A consistent daily schedule is crucial to balance both Kapha\'s inertia and Vata\'s variability.', icon: 'CalendarDaysIcon' },
        { category: 'Lifestyle', advice: 'Avoid daytime naps and cold, damp weather which can aggravate both doshas.', icon: 'CloudIcon' },
      ],
      diet: {
        chartData: [ { name: 'Spiced Veggies', value: 40, color: '#34D399' }, { name: 'Legumes & Lentils', value: 30, color: '#F97316' }, { name: 'Light Grains (Millet)', value: 20, color: '#FBBF24' }, { name: 'Herbal Teas', value: 10, color: '#F87171' }],
        foodsToAvoid: ['Heavy, oily foods', 'Cold dairy products', 'Wheat and refined sugars', 'Raw foods of any kind'],
      },
      routine: [
        { time: '6:00 AM', activity: 'Active Start', description: 'Wake early and do some invigorating exercise to get the blood flowing.' },
        { time: '9:00 AM', activity: 'Light Breakfast', description: 'A light breakfast of stewed apples or a small bowl of barley.' },
        { time: '1:00 PM', activity: 'Warm, Spiced Lunch', description: 'This should be your most substantial meal of the day.' },
      ],
  },
  'Tridoshic': {
    recommendations: [
      { category: 'Maintenance', advice: 'Your constitution is naturally balanced; the primary goal is to maintain it through awareness.', icon: 'CheckBadgeIcon' },
      { category: 'Seasons', advice: 'Pay close attention to the seasons and adjust your diet and lifestyle accordingly.', icon: 'CalendarIcon' },
      { category: 'Moderation', advice: 'A moderate, consistent routine is your key to long-term wellness.', icon: 'ScaleIcon' },
    ],
    diet: {
      chartData: [
        { name: 'Seasonal Vegetables', value: 40, color: '#4ADE80' }, { name: 'Whole Grains', value: 25, color: '#FBBF24' },
        { name: 'Lean Proteins', value: 20, color: '#A78BFA' }, { name: 'Seasonal Fruits', value: 15, color: '#60A5FA' },
      ],
      foodsToAvoid: ['Extreme flavors (overly spicy, sour, sweet)', 'Highly processed or artificial foods', 'Foods that are out of season', 'Excessive stimulants'],
    },
    routine: [
      { time: '6:00 AM', activity: 'Wake with the Sun', description: 'Align your sleep cycle with nature\'s rhythm.' },
      { time: '7:30 AM', activity: 'Moderate Exercise', description: 'Choose exercise based on the season: calming in summer, warming in winter.' },
      { time: '12:30 PM', activity: 'Balanced Lunch', description: 'Eat a wholesome meal that includes all six tastes if possible.' },
    ],
  },
};