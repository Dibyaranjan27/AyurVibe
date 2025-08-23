import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getAllUsers, getAllFeedback, deleteUserDocument, deleteFeedback, updateUser } from '../data/firebase';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal'; // Import the new modal

// Interfaces for our data
interface DisplayUser { id: string; name: string; email: string; prakriti?: string | null; }
interface Feedback { id: string; name: string; email: string; rating: number; category: string; message: string; submittedAt: Date; }

const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'feedback'>('users');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the user edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<DisplayUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrakriti, setEditPrakriti] = useState('');

  // State for the delete confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'feedback' } | null>(null);

  const { user, darkMode } = context || {};

  // Fetch initial data for the dashboard
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const [userList, feedbackList] = await Promise.all([ getAllUsers(), getAllFeedback() ]);
          setUsers(userList as DisplayUser[]);
          setFeedback(feedbackList as Feedback[]);
        } catch (error) {
          console.error("Failed to fetch admin data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  // --- Modal and Action Handlers ---

  const openEditModal = (userToEdit: DisplayUser) => {
    setCurrentUser(userToEdit);
    setEditName(userToEdit.name);
    setEditPrakriti(userToEdit.prakriti || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, { name: editName, prakriti: editPrakriti });
      setUsers(users.map(u => u.id === currentUser.id ? { ...u, name: editName, prakriti: editPrakriti } : u));
      setIsEditModalOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setItemToDelete({ id: userId, type: 'user' });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    setItemToDelete({ id: feedbackId, type: 'feedback' });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'user') {
      try {
        await deleteUserDocument(itemToDelete.id);
        setUsers(users.filter(u => u.id !== itemToDelete.id));
      } catch (error) {
        console.error("Failed to delete user document:", error);
      }
    } else if (itemToDelete.type === 'feedback') {
      try {
        await deleteFeedback(itemToDelete.id);
        setFeedback(feedback.filter(f => f.id !== itemToDelete.id));
      } catch (error) {
        console.error("Failed to delete feedback:", error);
      }
    }
    setItemToDelete(null); // Clean up after deletion
  };


  if (!context || !user) {
    return <p className="text-center p-8">{t('loginRequired', { defaultValue: 'Please log in to view this page.'})}</p>;
  }
  
  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading Admin Data...</div>
  }

  return (
    <>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'} p-4 sm:p-6 md:p-8`}>
        <div className="max-w-7xl mt-24 mx-auto">
          <h2 className="text-3xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-6">Admin Dashboard</h2>
          
          <div className="border-b border-gray-300 dark:border-gray-700 mb-6">
            <nav className="flex space-x-4">
              <button onClick={() => setActiveTab('users')} className={`py-2 px-4 font-semibold ${activeTab === 'users' ? 'border-b-2 border-ayurGreen text-ayurGreen dark:text-ayurBeige' : 'text-gray-500'}`}>User Management ({users.length})</button>
              <button onClick={() => setActiveTab('feedback')} className={`py-2 px-4 font-semibold ${activeTab === 'feedback' ? 'border-b-2 border-ayurGreen text-ayurGreen dark:text-ayurBeige' : 'text-gray-500'}`}>Feedback ({feedback.length})</button>
            </nav>
          </div>

          {activeTab === 'users' && (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ayurGreen/90 text-white">
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Prakriti</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.name}</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.email}</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.prakriti || 'N/A'}</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700 text-right">
                        <button onClick={() => openEditModal(u)} className="p-1 text-blue-500 hover:text-blue-700 mr-2" aria-label={`Edit ${u.name}`}><PencilIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-1 text-red-500 hover:text-red-700" aria-label={`Delete ${u.name}`}><TrashIcon className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {feedback.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-ayurGreen">{item.category}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.name} ({item.email})</p>
                      <p className="text-xs text-gray-500">{format(item.submittedAt, 'MMM d, yyyy h:mm a')}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => i < item.rating ? <StarSolid key={`rating-${item.id}-${i}`} className="w-5 h-5 text-yellow-400" /> : <StarOutline key={`rating-${item.id}-${i}`} className="w-5 h-5 text-gray-300" />)}
                      <button onClick={() => handleDeleteFeedback(item.id)} className="p-1 text-red-500 hover:text-red-700 ml-4" aria-label={`Delete feedback from ${item.name}`}><TrashIcon className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-800 dark:text-gray-200">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${itemToDelete?.type}`}
        message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
      />
      
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit User</h3>
                <button onClick={() => setIsEditModalOpen(false)}><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prakriti</label>
                  <input type="text" value={editPrakriti} onChange={(e) => setEditPrakriti(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"/>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600">Cancel</button>
                <button onClick={handleUpdateUser} className="px-4 py-2 rounded-md text-white bg-ayurGreen">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminDashboard;