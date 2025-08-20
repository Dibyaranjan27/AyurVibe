import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getAllUsers } from '../data/firebase'; // Assuming this function returns users with an 'id'
import { useTranslation } from 'react-i18next';

// Define a type for the user data for better TypeScript support
interface DisplayUser {
  id: string;
  name: string;
  email: string;
  prakriti?: string;
}

const AdminDashboard: React.FC = () => {
  // --- All Hooks are now at the top of the component ---
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const [users, setUsers] = useState<DisplayUser[]>([]);
  
  // Safely destructure context after the hook calls
  const { user, darkMode } = context || {};

  useEffect(() => {
    const fetchUsers = async () => {
      // CHANGE: Used optional chaining for a cleaner check
      if (user?.id) {
        const userList = await getAllUsers();
        setUsers(userList);
      }
    };
    fetchUsers();
  }, [user?.id]); // Dependency is now safely chained

  // --- Conditional returns are now AFTER all hooks ---
  if (!context || !user) {
    return <p className="text-center p-8">{t('loginRequired', { defaultValue: 'Please log in to view the admin dashboard' })}</p>;
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'
      } p-4 sm:p-6 md:p-8`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-6">{t('adminDashboard', { defaultValue: 'Admin Dashboard' })}</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ayurGreen/90 text-white">
                <th className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold">{t('name')}</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold">{t('email')}</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold">{t('prakriti')}</th>
              </tr>
            </thead>
            <tbody>
              {/* CHANGE: Using u.id for a stable key instead of index */}
              {users.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.name}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.email}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700">{u.prakriti || t('notDetermined', { defaultValue: 'Not determined yet' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="p-4 text-center text-gray-500">{t('noUsers', { defaultValue: 'No users found.'})}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;