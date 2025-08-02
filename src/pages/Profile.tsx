import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useTranslation } from 'react-i18next';

const Profile: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!context || !context.user) return <p className="text-center">{t('loginRequired', { defaultValue: 'Please log in to view your profile' })}</p>;

  const { user, darkMode } = context;
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name || '');
  const [mobile, setMobile] = useState<string>(user.mobile || '');

  const handleSave = async () => {
    if (user && user.id) {
      await updateDoc(doc(db, 'users', user.id), { name, mobile });
      setEditMode(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-ayurBeige text-gray-900'
      } flex items-center justify-center p-4`}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-lora font-bold text-ayurGreen mb-4">{t('profile', { defaultValue: 'Your Profile' })}</h2>
        <div className="space-y-4">
          <p><strong>{t('email')}:</strong> {user.email}</p>
          <div>
            <strong>{t('name')}:</strong>
            {editMode ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ml-2 p-1 border rounded w-full"
              />
            ) : (
              <span className="ml-2">{name}</span>
            )}
          </div>
          <div>
            <strong>{t('mobile')}:</strong>
            {editMode ? (
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="ml-2 p-1 border rounded w-full"
              />
            ) : (
              <span className="ml-2">{mobile}</span>
            )}
          </div>
          <p><strong>{t('prakriti')}:</strong> {user.prakriti || t('notDetermined', { defaultValue: 'Not determined yet' })}</p>
          {editMode ? (
            <button
              onClick={handleSave}
              className="bg-ayurSaffron text-white p-2 rounded hover:bg-orange-600 w-full"
              aria-label={t('save')}
            >
              {t('save')}
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-ayurGreen text-white p-2 rounded hover:bg-green-700 w-full"
              aria-label={t('edit')}
            >
              {t('edit')}
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-700 w-full"
            aria-label={t('back')}
          >
            {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;