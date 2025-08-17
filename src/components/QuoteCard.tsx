import React from 'react';
import { StarIcon } from '@heroicons/react/24/outline';

type QuoteCardProps = {
  quote: string;
  author: string;
};

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author }) => (
  <div className="bg-gradient-to-br from-ayurGreen/80 to-green-400 text-white p-6 rounded-2xl shadow-lg h-full flex flex-col justify-center">
    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
      <StarIcon className="w-5 h-5 text-yellow-300" />
      Quote of the Day
    </h3>
    <blockquote className="text-xl font-lora italic border-l-4 border-white/50 pl-4">{quote}</blockquote>
    <cite className="block text-right mt-4 text-ayurBeige/80">- {author}</cite>
  </div>
);

export default QuoteCard;