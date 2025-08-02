import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getAllUsers } from '../data/firebase';
import { useTranslation } from 'react-i18next';

const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();

  if (!context || !context.user) return <p className="text-center">{t('loginRequired', { defaultValue: 'Please log in to view the admin dashboard' })}</p>;

  const { user, darkMode } = context;
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        const userList = await getAllUsers();
        setUsers(userList);
      }
    };
    fetchUsers();
  }, [user]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'
      } p-4`}
    >
      <h2 className="text-2xl font-lora font-bold text-ayurGreen mb-6">{t('adminDashboard', { defaultValue: 'Admin Dashboard' })}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ayurGreen text-white">
              <th className="p-2 border">{t('name')}</th>
              <th className="p-2 border">{t('email')}</th>
              <th className="p-2 border">{t('prakriti')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'}>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.prakriti || t('notDetermined', { defaultValue: 'Not determined yet' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;