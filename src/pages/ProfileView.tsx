import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useTranslation } from 'react-i18next';
import FloatingLeaves from '../components/FloatingLeaves';
import {
  UserCircleIcon, EnvelopeIcon, DevicePhoneMobileIcon, SparklesIcon, PencilIcon,
  CheckCircleIcon, XCircleIcon, UserIcon, FaceSmileIcon, EyeIcon, HeartIcon,
  ClockIcon, FireIcon, SunIcon, BoltIcon, AcademicCapIcon, CurrencyDollarIcon,
  ChatBubbleLeftIcon, ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/24/outline';

const InfoRow = ({ icon, label, value, t }: { icon: React.ReactNode, label: string, value: string | undefined, t: Function }) => (
  <div className="flex items-center space-x-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <div className="text-ayurGreen dark:text-ayurBeige flex-shrink-0">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-base text-gray-800 dark:text-gray-200">{value || t('notSet', { defaultValue: 'Not set' })}</p>
    </div>
  </div>
);

const EditableField = ({ label, value, onChange, type = 'text' }: { label: string, value: string | undefined, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={onChange}
      className="w-full p-2 bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen dark:focus:border-ayurBeige focus:outline-none text-gray-800 dark:text-gray-200 transition-all"
    />
  </div>
);

const ProfileView: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();
  
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [healthDetails, setHealthDetails] = useState<any>({});
  const [prakriti, setPrakriti] = useState<string>('-');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showMoreHealth, setShowMoreHealth] = useState<boolean>(false);

  const { user, setUser } = context || {};

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.mobile || '');
      setHealthDetails(user.healthDetails || {});
      setPrakriti(user.prakriti || '-');
    }
  }, [user]);

  if (!context || !user) {
    return <p className="text-center p-8 text-gray-800 dark:text-gray-200 text-lg font-lora">{t('loginRequired', { defaultValue: 'Please log in to view your profile' })}</p>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      try {
        const updatedData = { name, mobile, healthDetails, prakriti: prakriti === '-' ? null : prakriti };
        await updateDoc(doc(db, 'users', user.id), updatedData);
        if (setUser) {
          setUser({ ...user, ...updatedData });
        }
        setEditMode(false);
        setStatusMessage({ type: 'success', text: t('profileUpdated', { defaultValue: 'Profile updated successfully!' }) });
      } catch (error) {
        console.error("Error updating profile: ", error);
        setStatusMessage({ type: 'error', text: t('profileUpdateFailed', { defaultValue: 'Failed to update profile.' }) });
      } finally {
        setTimeout(() => setStatusMessage(null), 3000);
      }
    }
  };

  const handleCancel = () => {
    setName(user.name || '');
    setMobile(user.mobile || '');
    setHealthDetails(user.healthDetails || {});
    setPrakriti(user.prakriti || '-');
    setEditMode(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      console.log('Selected file:', e.target.files[0]);
      alert('Profile picture functionality requires a backend implementation.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 relative overflow-hidden">
      <FloatingLeaves />
      
      <motion.div 
        className="max-w-5xl w-full mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-ayurGreen/20 to-ayurSaffron/20 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-ayurGreen flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white/50 dark:ring-gray-800/50 shadow-lg">
              {name ? name[0].toUpperCase() : <UserCircleIcon className="w-14 h-14 sm:w-16 sm:h-16" />}
            </div>
            <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-ayurBeige dark:bg-gray-600 rounded-full p-2 cursor-pointer shadow-md hover:scale-110 transition-transform">
              <PencilIcon className="w-5 h-5 text-ayurGreen dark:text-ayurBeige" />
              <input id="photo-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>
          <h2 className="text-xl sm:text-2xl font-lora font-bold text-gray-800 dark:text-gray-200">{name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
          {!editMode && (
            <button 
              type="button" 
              onClick={() => setEditMode(true)} 
              className="mt-4 flex items-center justify-center gap-2 bg-ayurGreen text-white px-6 py-2 rounded-full font-bold hover:bg-ayurGreen/80 transition-all shadow-md hover:shadow-lg"
            >
              <PencilIcon className="w-5 h-5" /> {t('editProfile', { defaultValue: 'Edit Profile' })}
            </button>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-12">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 ">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('personalInformation', { defaultValue: 'Personal Information' })}</h4>
              {editMode ? (
                <div className="space-y-4">
                  <EditableField label={t('fullName', { defaultValue: 'Full Name' })} value={name} onChange={(e) => setName(e.target.value)} />
                  <EditableField label={t('mobileNumber', { defaultValue: 'Mobile Number' })} value={mobile} onChange={(e) => setMobile(e.target.value)} type="tel" />
                </div>
              ) : (
                <div className="space-y-2">
                  <InfoRow t={t} icon={<EnvelopeIcon className="w-5 h-5" />} label={t('emailAddress', { defaultValue: 'Email Address' })} value={user.email} />
                  <InfoRow t={t} icon={<UserCircleIcon className="w-5 h-5" />} label={t('fullName', { defaultValue: 'Full Name' })} value={name} />
                  <InfoRow t={t} icon={<DevicePhoneMobileIcon className="w-5 h-5" />} label={t('mobileNumber', { defaultValue: 'Mobile Number' })} value={mobile} />
                </div>
              )}
            </div>

            <div className={`flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6`}>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('healthDetails', { defaultValue: 'Health Details' })}</h4>
              {editMode ? (
                <div className="space-y-4">
                  <EditableField label={t('bodyFrame', { defaultValue: 'Body Frame' })} value={healthDetails.bodyFrame} onChange={(e) => setHealthDetails({ ...healthDetails, bodyFrame: e.target.value })} />
                  <EditableField label={t('skin', { defaultValue: 'Skin' })} value={healthDetails.skin} onChange={(e) => setHealthDetails({ ...healthDetails, skin: e.target.value })} />
                  <EditableField label={t('hair', { defaultValue: 'Hair' })} value={healthDetails.hair} onChange={(e) => setHealthDetails({ ...healthDetails, hair: e.target.value })} />
                </div>
              ) : (
                <div className="space-y-2">
                  <InfoRow t={t} icon={<UserIcon className="w-5 h-5" />} label={t('bodyFrame', { defaultValue: 'Body Frame' })} value={healthDetails.bodyFrame} />
                  <InfoRow t={t} icon={<FaceSmileIcon className="w-5 h-5" />} label={t('skin', { defaultValue: 'Skin' })} value={healthDetails.skin} />
                  <InfoRow t={t} icon={<FaceSmileIcon className="w-5 h-5" />} label={t('hair', { defaultValue: 'Hair' })} value={healthDetails.hair} />
                </div>
              )}
              {/* CHANGE: Restored your original "Show More" button placement */}
              {!showMoreHealth && (
                <button
                  type="button"
                  onClick={() => setShowMoreHealth(true)}
                  className="mt-4 flex items-center justify-center gap-2 text-ayurGreen dark:text-ayurBeige hover:text-ayurGreen/80 dark:hover:text-ayurBeige/80 font-medium transition-colors"
                >
                  <ChevronDownIcon className="w-5 h-5" /> {t('showMore', { defaultValue: 'Show More' })}
                </button>
              )}
            </div>

            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('quizResults', { defaultValue: 'Quiz Results' })}</h4>
              <InfoRow t={t} icon={<SparklesIcon className="w-5 h-5" />} label={t('yourPrakriti', { defaultValue: 'Your Prakriti' })} value={prakriti} />
            </div>
          </div>
          
          <AnimatePresence>
          {showMoreHealth && (
            <motion.div
              key="more-health-details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-12 mt-[-1.5rem] overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {editMode ? (
                  <>
                    <EditableField label={t('eyes')} value={healthDetails.eyes} onChange={(e) => setHealthDetails({ ...healthDetails, eyes: e.target.value })} />
                    <EditableField label={t('appetite')} value={healthDetails.appetite} onChange={(e) => setHealthDetails({ ...healthDetails, appetite: e.target.value })} />
                    <EditableField label={t('sleep')} value={healthDetails.sleep} onChange={(e) => setHealthDetails({ ...healthDetails, sleep: e.target.value })} />
                    <EditableField label={t('energy')} value={healthDetails.energy} onChange={(e) => setHealthDetails({ ...healthDetails, energy: e.target.value })} />
                    <EditableField label={t('climate')} value={healthDetails.climate} onChange={(e) => setHealthDetails({ ...healthDetails, climate: e.target.value })} />
                    <EditableField label={t('stress')} value={healthDetails.stress} onChange={(e) => setHealthDetails({ ...healthDetails, stress: e.target.value })} />
                    <EditableField label={t('memory')} value={healthDetails.memory} onChange={(e) => setHealthDetails({ ...healthDetails, memory: e.target.value })} />
                    <EditableField label={t('pace')} value={healthDetails.pace} onChange={(e) => setHealthDetails({ ...healthDetails, pace: e.target.value })} />
                    <EditableField label={t('mood')} value={healthDetails.mood} onChange={(e) => setHealthDetails({ ...healthDetails, mood: e.target.value })} />
                    <EditableField label={t('money')} value={healthDetails.money} onChange={(e) => setHealthDetails({ ...healthDetails, money: e.target.value })} />
                    <EditableField label={t('communication')} value={healthDetails.communication} onChange={(e) => setHealthDetails({ ...healthDetails, communication: e.target.value })} />
                    <EditableField label={t('change')} value={healthDetails.change} onChange={(e) => setHealthDetails({ ...healthDetails, change: e.target.value })} />
                  </>
                ) : (
                  <>
                    <InfoRow t={t} icon={<EyeIcon className="w-5 h-5" />} label={t('eyes')} value={healthDetails.eyes} />
                    <InfoRow t={t} icon={<HeartIcon className="w-5 h-5" />} label={t('appetite')} value={healthDetails.appetite} />
                    <InfoRow t={t} icon={<ClockIcon className="w-5 h-5" />} label={t('sleep')} value={healthDetails.sleep} />
                    <InfoRow t={t} icon={<FireIcon className="w-5 h-5" />} label={t('energy')} value={healthDetails.energy} />
                    <InfoRow t={t} icon={<SunIcon className="w-5 h-5" />} label={t('climate')} value={healthDetails.climate} />
                    <InfoRow t={t} icon={<BoltIcon className="w-5 h-5" />} label={t('stress')} value={healthDetails.stress} />
                    <InfoRow t={t} icon={<AcademicCapIcon className="w-5 h-5" />} label={t('memory')} value={healthDetails.memory} />
                    <InfoRow t={t} icon={<ClockIcon className="w-5 h-5" />} label={t('pace')} value={healthDetails.pace} />
                    <InfoRow t={t} icon={<FaceSmileIcon className="w-5 h-5" />} label={t('mood')} value={healthDetails.mood} />
                    <InfoRow t={t} icon={<CurrencyDollarIcon className="w-5 h-5" />} label={t('money')} value={healthDetails.money} />
                    <InfoRow t={t} icon={<ChatBubbleLeftIcon className="w-5 h-5" />} label={t('communication')} value={healthDetails.communication} />
                    <InfoRow t={t} icon={<BoltIcon className="w-5 h-5" />} label={t('change')} value={healthDetails.change} />
                  </>
                )}
              </div>
              {/* CHANGE: Restored your original "Show Less" button placement */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowMoreHealth(false)}
                  className="flex items-center gap-2 text-ayurGreen dark:text-ayurBeige hover:text-ayurGreen/80 dark:hover:text-ayurBeige/80 font-medium transition-colors"
                >
                  <ChevronUpIcon className="w-5 h-5" /> {t('showLess', { defaultValue: 'Show Less' })}
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {editMode && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <button type="submit" className="w-full sm:w-40 flex items-center justify-center gap-2 bg-ayurGreen text-white px-6 py-3 rounded-full font-bold hover:bg-ayurGreen/80 transition-all shadow-md">
                <CheckCircleIcon className="w-5 h-5" /> {t('saveChanges')}
              </button>
              <button type="button" onClick={handleCancel} className="w-full sm:w-40 flex items-center justify-center gap-2 bg-ayurSaffron text-white px-6 py-3 rounded-full font-bold hover:bg-ayurSaffron/80 transition-all shadow-md">
                <XCircleIcon className="w-5 h-5" /> {t('cancel')}
              </button>
            </div>
          )}

          {statusMessage && (
            <motion.div 
              className={`mt-4 p-3 rounded-lg text-sm flex items-center justify-center gap-2 max-w-md mx-auto ${statusMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} >
              {statusMessage.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
              {statusMessage.text}
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileView;