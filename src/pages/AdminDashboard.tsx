import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getAllUsers, getAllFeedback } from '../data/firebase'; // We'll add getAllFeedback
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface DisplayUser { id: string; name: string; email: string; prakriti?: string; }
interface Feedback { id: string; name: string; email: string; rating: number; category: string; message: string; submittedAt: Date; }

const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'feedback'>('users');
  const [isLoading, setIsLoading] = useState(true);

  const { user, darkMode } = context || {};

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const [userList, feedbackList] = await Promise.all([
            getAllUsers(),
            getAllFeedback()
          ]);
          setUsers(userList);
          setFeedback(feedbackList);
        } catch (error) {
          console.error("Failed to fetch admin data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (!context || !user) {
    return <p className="text-center p-8">{t('loginRequired')}</p>;
  }
  
  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading Admin Data...</div>
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'} p-4 sm:p-6 md:p-8`}>
      <div className="max-w-7xl mt-24 mx-auto">
        <h2 className="text-3xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-6">Admin Dashboard</h2>
        
        <div className="border-b border-gray-300 dark:border-gray-700 mb-6">
          <nav className="flex space-x-4">
            <button onClick={() => setActiveTab('users')} className={`py-2 px-4 font-semibold ${activeTab === 'users' ? 'border-b-2 border-ayurGreen text-ayurGreen dark:text-ayurBeige' : 'text-gray-500'}`}>User Management</button>
            <button onClick={() => setActiveTab('feedback')} className={`py-2 px-4 font-semibold ${activeTab === 'feedback' ? 'border-b-2 border-ayurGreen text-ayurGreen dark:text-ayurBeige' : 'text-gray-500'}`}>Feedback</button>
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
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.name}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.email}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.prakriti || 'N/A'}</td>
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
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-gray-800 dark:text-gray-200">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;