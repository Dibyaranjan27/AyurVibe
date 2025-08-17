import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import FloatingLeaves from '../components/FloatingLeaves';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const FeedbackView: React.FC = () => {
    const context = useContext(AppContext);
    const { user } = context || {};

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [category, setCategory] = useState('General');
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message || rating === 0) {
            alert('Please provide a rating and a message.');
            return;
        }

        setIsSubmitting(true);

        // --- Backend Logic Placeholder ---
        // In a real application, you would send this data to your backend or Firestore here.
        // Example:
        // await addDoc(collection(db, 'feedback'), {
        //   name, email, category, rating, message, submittedAt: serverTimestamp()
        // });
        console.log({ name, email, category, rating, message });
        
        // Simulate network delay
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="relative min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
                <FloatingLeaves />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-12 rounded-2xl shadow-lg"
                >
                    <CheckCircleIcon className="w-16 h-16 text-ayurGreen mx-auto mb-4" />
                    <h2 className="text-3xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-2">Thank You!</h2>
                    <p className="text-gray-600 dark:text-gray-300">Your feedback has been received.</p>
                </motion.div>
            </div>
        );
    }
    
    return (
        <div className="relative min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden pb-20">
            <FloatingLeaves />
            <motion.div 
                className="relative z-10 w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-lora font-bold text-ayurGreen dark:text-ayurBeige">Share Your Feedback</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">We value your opinion to help improve AyurVibe.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen"/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen">
                                <option>General Feedback</option>
                                <option>Bug Report</option>
                                <option>Feature Request</option>
                                <option>Quiz & Results</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">How would you rate your experience?</label>
                            <div className="mt-2 flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button type="button" key={star} onClick={() => setRating(star)}>
                                        {star <= rating ? (
                                            <StarSolid className="w-8 h-8 text-yellow-400 transition-transform hover:scale-110" />
                                        ) : (
                                            <StarOutline className="w-8 h-8 text-gray-400 transition-transform hover:scale-110" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Message</label>
                            <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} required placeholder="Please provide details..." className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ayurGreen"></textarea>
                        </div>
                        
                        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-ayurGreen text-white px-6 py-3 rounded-full font-bold hover:bg-ayurGreen/80 transition-all disabled:bg-gray-400">
                            <PaperAirplaneIcon className="w-5 h-5" />
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default FeedbackView;