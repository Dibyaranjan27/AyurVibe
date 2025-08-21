import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import FloatingLeaves from '../components/FloatingLeaves';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon, CheckCircleIcon,StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../data/firebase';

const FeedbackView: React.FC = () => {
    const context = useContext(AppContext);
    const { user } = context || {};

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [category, setCategory] = useState('General Feedback'); // Set a default value
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please provide a rating.');
            return;
        }
        if (!message) {
            setError('Please provide a message.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await addDoc(collection(db, 'feedback'), {
                name: name || 'Anonymous', // Handle empty name
                email: email || 'No email', // Handle empty email
                category,
                rating,
                message,
                submittedAt: serverTimestamp(),
                userId: user?.id || null, // Optionally store user ID
            });
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="relative min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
                <FloatingLeaves />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center bg-gradient-to-br from-white/80 to-ayurBeige/50 dark:from-gray-800/80 dark:to-gray-900/50 p-8 rounded-xl shadow-2xl"
                >
                    <CheckCircleIcon className="w-16 h-16 text-ayurGreen mx-auto mb-4" />
                    <h2 className="text-3xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-2">Thank You!</h2>
                    <p className="text-gray-600 dark:text-gray-300">Your feedback has been received.</p>
                </motion.div>
            </div>
        );
    }
    
    return (
        <div className="relative min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
            <FloatingLeaves />
            <motion.div 
                className="relative mb-12 z-10 w-full max-w-lg sm:max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gradient-to-br from-white/80 to-ayurBeige/50 dark:from-gray-800/80 dark:to-gray-900/50 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-lora font-bold text-ayurGreen dark:text-ayurBeige">Share Your Feedback</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">We value your opinion to help improve AyurVibe.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen dark:focus:ring-ayurBeige text-gray-900 dark:text-gray-100"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen dark:focus:ring-ayurBeige text-gray-900 dark:text-gray-100"/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full p-3 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen dark:focus:ring-ayurBeige text-gray-900 dark:text-gray-100">
                                <option>General Feedback</option>
                                <option>Bug Report</option>
                                <option>Feature Request</option>
                                <option>Quiz & Results</option>
                            </select>
                        </div>
                        
                        {/* CHANGE: Replaced the inaccessible label/button group with a semantically correct fieldset */}
                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                How would you rate your experience?
                            </legend>
                            <div className="mt-2 flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <React.Fragment key={star}>
                                        <input
                                            type="radio"
                                            id={`star-${star}`}
                                            name="rating"
                                            value={star}
                                            checked={rating === star}
                                            onChange={() => setRating(star)}
                                            className="sr-only" // This class visually hides the input
                                        />
                                        <label htmlFor={`star-${star}`} className="cursor-pointer">
                                            {star <= rating ? (
                                                <StarSolid className="w-8 h-8 text-yellow-400 transition-all duration-200 hover:scale-110" />
                                            ) : (
                                                <StarOutline className="w-8 h-8 text-gray-400 dark:text-gray-500 transition-all duration-200 hover:scale-110" />
                                            )}
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </fieldset>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
                            <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} required placeholder="Please provide details..." className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen dark:focus:ring-ayurBeige text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"></textarea>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-ayurGreen text-white px-6 py-3 rounded-full font-bold hover:bg-ayurGreen/80 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                    </form>
                    <div className="mt-6 border-t border-gray-300 dark:border-gray-600 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Your feedback helps us grow. Thank you!
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FeedbackView;