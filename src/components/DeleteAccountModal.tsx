import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { deleteUserAccount } from '../data/firebase';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onDeleteSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);
    try {
      await deleteUserAccount(password);
      onDeleteSuccess(); // This will trigger the logout and redirect in ProfileView
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6"
          >
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white">
                  Delete Account
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  This action is irreversible. To confirm, please enter your password.
                </p>
              </div>
            </div>
            <div className="mt-4">
                <label htmlFor="delete-password" className="sr-only">Password</label>
                <input
                    id="delete-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm disabled:opacity-50"
                onClick={handleDelete}
                disabled={isDeleting || !password}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;