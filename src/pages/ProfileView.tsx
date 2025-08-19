import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useTranslation } from 'react-i18next';
import FloatingLeaves from '../components/FloatingLeaves';
import { UserCircleIcon, EnvelopeIcon, DevicePhoneMobileIcon, SparklesIcon, PencilIcon, CheckCircleIcon, XCircleIcon, UserIcon, FaceSmileIcon, EyeIcon, HeartIcon, ClockIcon, FireIcon, SunIcon, BoltIcon, AcademicCapIcon, CurrencyDollarIcon, ChatBubbleLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ProfileView: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();

  if (!context || !context.user) {
    return <p className="text-center p-8 text-gray-800 dark:text-gray-200 text-lg font-lora">{t('loginRequired', { defaultValue: 'Please log in to view your profile' })}</p>;
  }

  const { user, setUser } = context;

  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name || '');
  const [mobile, setMobile] = useState<string>(user.mobile || '');
  const [healthDetails, setHealthDetails] = useState<{
    bodyFrame?: string;
    skin?: string;
    hair?: string;
    eyes?: string;
    appetite?: string;
    sleep?: string;
    energy?: string;
    climate?: string;
    stress?: string;
    memory?: string;
    pace?: string;
    mood?: string;
    money?: string;
    communication?: string;
    change?: string;
  }>(user.healthDetails || {});
  const [prakriti, setPrakriti] = useState<string>(user.prakriti || '-');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showMoreHealth, setShowMoreHealth] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.id) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.id));
          if (userDoc.exists()) {
            const userData = userDoc.data() as any;
            setName(userData.name || '');
            setMobile(userData.mobile || '');
            // Fetch quiz answers and map to healthDetails
            const quizAnswers = userData.quizAnswers || {};
            const mappedHealthDetails = {
              bodyFrame: quizAnswers['1']?.text || quizAnswers['Body Frame']?.text || '',
              skin: quizAnswers['2']?.text || quizAnswers['Skin']?.text || '',
              hair: quizAnswers['3']?.text || quizAnswers['Hair']?.text || '',
              eyes: quizAnswers['4']?.text || quizAnswers['Eyes']?.text || '',
              appetite: quizAnswers['5']?.text || quizAnswers['Appetite']?.text || '',
              sleep: quizAnswers['6']?.text || quizAnswers['Sleep']?.text || '',
              energy: quizAnswers['7']?.text || quizAnswers['Energy']?.text || '',
              climate: quizAnswers['8']?.text || quizAnswers['Climate Preference']?.text || '',
              stress: quizAnswers['9']?.text || quizAnswers['Stress Response']?.text || '',
              memory: quizAnswers['10']?.text || quizAnswers['Memory']?.text || '',
              pace: quizAnswers['11']?.text || quizAnswers['Activity Pace']?.text || '',
              mood: quizAnswers['12']?.text || quizAnswers['Mood']?.text || '',
              money: quizAnswers['13']?.text || quizAnswers['Money Handling']?.text || '',
              communication: quizAnswers['14']?.text || quizAnswers['Communication Style']?.text || '',
              change: quizAnswers['15']?.text || quizAnswers['Response to Change']?.text || '',
            };
            setHealthDetails(mappedHealthDetails);
            setPrakriti(userData.prakriti || '-');
            setUser({ ...user, name: userData.name, mobile: userData.mobile, healthDetails: mappedHealthDetails, prakriti: userData.prakriti });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user.id, setUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user.id) {
      try {
        const updatedData = {
          name,
          mobile,
          healthDetails,
          prakriti: prakriti === '-' ? null : prakriti,
        };
        await updateDoc(doc(db, 'users', user.id), updatedData);
        setUser({ ...user, ...updatedData });
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
    if (e.target.files && e.target.files[0]) {
      console.log('Selected file:', e.target.files[0]);
      alert('Profile picture functionality requires a backend implementation.');
    }
  };

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 relative overflow-hidden">
      <FloatingLeaves />
      
      <motion.div 
        className="max-w-5xl w-full mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header: Avatar, Name, Email, Edit Profile Button */}
        <div className="bg-gradient-to-br from-ayurGreen/20 to-ayurSaffron/20 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-ayurGreen flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white/50 dark:ring-gray-800/50 shadow-lg">
              {user.name ? user.name[0].toUpperCase() : <UserCircleIcon className="w-14 h-14 sm:w-16 sm:h-16" />}
            </div>
            <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-ayurBeige dark:bg-gray-600 rounded-full p-2 cursor-pointer shadow-md hover:scale-110 transition-transform">
              <PencilIcon className="w-5 h-5 text-ayurGreen dark:text-ayurBeige" />
              <input id="photo-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>
          <h2 className="text-xl sm:text-2xl font-lora font-bold text-gray-800 dark:text-gray-200">{user.name}</h2>
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

        {/* Cards: Personal Information, Health Details, Quiz Results */}
        <form onSubmit={handleSave}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6">
            {/* Personal Information Card */}
            <div className="flex-1 mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('personalInformation', { defaultValue: 'Personal Information' })}</h4>
              {editMode ? (
                <div className="space-y-4">
                  <EditableField label={t('fullName', { defaultValue: 'Full Name' })} value={name} onChange={(e) => setName(e.target.value)} />
                  <EditableField label={t('mobileNumber', { defaultValue: 'Mobile Number' })} value={mobile} onChange={(e) => setMobile(e.target.value)} type="tel" />
                </div>
              ) : (
                <div className="space-y-2">
                  <InfoRow icon={<EnvelopeIcon className="w-5 h-5" />} label={t('emailAddress', { defaultValue: 'Email Address' })} value={user.email} />
                  <InfoRow icon={<UserCircleIcon className="w-5 h-5" />} label={t('fullName', { defaultValue: 'Full Name' })} value={user.name} />
                  <InfoRow icon={<DevicePhoneMobileIcon className="w-5 h-5" />} label={t('mobileNumber', { defaultValue: 'Mobile Number' })} value={user.mobile} />
                </div>
              )}
            </div>

            {/* Health Details Card */}
            <div className={`flex-1 bg-white mb-8 dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6`}>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('healthDetails', { defaultValue: 'Health Details' })}</h4>
              {editMode ? (
                <div className="space-y-4">
                  <EditableField label={t('bodyFrame', { defaultValue: 'Body Frame' })} value={healthDetails.bodyFrame} onChange={(e) => setHealthDetails({ ...healthDetails, bodyFrame: e.target.value })} />
                  <EditableField label={t('skin', { defaultValue: 'Skin' })} value={healthDetails.skin} onChange={(e) => setHealthDetails({ ...healthDetails, skin: e.target.value })} />
                  <EditableField label={t('hair', { defaultValue: 'Hair' })} value={healthDetails.hair} onChange={(e) => setHealthDetails({ ...healthDetails, hair: e.target.value })} />
                </div>
              ) : (
                <div className="space-y-2">
                  <InfoRow icon={<UserIcon className="w-5 h-5" />} label={t('bodyFrame', { defaultValue: 'Body Frame' })} value={healthDetails.bodyFrame} />
                  <InfoRow icon={<FaceSmileIcon className="w-5 h-5" />} label={t('skin', { defaultValue: 'Skin' })} value={healthDetails.skin} />
                  <InfoRow icon={<FaceSmileIcon className="w-5 h-5" />} label={t('hair', { defaultValue: 'Hair' })} value={healthDetails.hair} />
                </div>
              )}
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

            {/* Quiz Results Card */}
            <div className="flex-1 mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('quizResults', { defaultValue: 'Quiz Results' })}</h4>
              <InfoRow icon={<SparklesIcon className="w-5 h-5" />} label={t('yourPrakriti', { defaultValue: 'Your Prakriti' })} value={prakriti} />
            </div>
          </div>

          {showMoreHealth && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mt-[-2rem] sm:p-6 mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pl-8">
                {editMode ? (
                  <>
                    <EditableField label={t('eyes', { defaultValue: 'Eyes' })} value={healthDetails.eyes} onChange={(e) => setHealthDetails({ ...healthDetails, eyes: e.target.value })} />
                    <EditableField label={t('appetite', { defaultValue: 'Appetite' })} value={healthDetails.appetite} onChange={(e) => setHealthDetails({ ...healthDetails, appetite: e.target.value })} />
                    <EditableField label={t('sleep', { defaultValue: 'Sleep' })} value={healthDetails.sleep} onChange={(e) => setHealthDetails({ ...healthDetails, sleep: e.target.value })} />
                    <EditableField label={t('energy', { defaultValue: 'Energy' })} value={healthDetails.energy} onChange={(e) => setHealthDetails({ ...healthDetails, energy: e.target.value })} />
                    <EditableField label={t('climate', { defaultValue: 'Climate Preference' })} value={healthDetails.climate} onChange={(e) => setHealthDetails({ ...healthDetails, climate: e.target.value })} />
                    <EditableField label={t('stress', { defaultValue: 'Stress Response' })} value={healthDetails.stress} onChange={(e) => setHealthDetails({ ...healthDetails, stress: e.target.value })} />
                    <EditableField label={t('memory', { defaultValue: 'Memory' })} value={healthDetails.memory} onChange={(e) => setHealthDetails({ ...healthDetails, memory: e.target.value })} />
                    <EditableField label={t('pace', { defaultValue: 'Activity Pace' })} value={healthDetails.pace} onChange={(e) => setHealthDetails({ ...healthDetails, pace: e.target.value })} />
                    <EditableField label={t('mood', { defaultValue: 'Mood' })} value={healthDetails.mood} onChange={(e) => setHealthDetails({ ...healthDetails, mood: e.target.value })} />
                    <EditableField label={t('money', { defaultValue: 'Money Handling' })} value={healthDetails.money} onChange={(e) => setHealthDetails({ ...healthDetails, money: e.target.value })} />
                    <EditableField label={t('communication', { defaultValue: 'Communication Style' })} value={healthDetails.communication} onChange={(e) => setHealthDetails({ ...healthDetails, communication: e.target.value })} />
                    <EditableField label={t('change', { defaultValue: 'Response to Change' })} value={healthDetails.change} onChange={(e) => setHealthDetails({ ...healthDetails, change: e.target.value })} />
                  </>
                ) : (
                  <>
                    <InfoRow icon={<EyeIcon className="w-5 h-5" />} label={t('eyes', { defaultValue: 'Eyes' })} value={healthDetails.eyes} />
                    <InfoRow icon={<HeartIcon className="w-5 h-5" />} label={t('appetite', { defaultValue: 'Appetite' })} value={healthDetails.appetite} />
                    <InfoRow icon={<ClockIcon className="w-5 h-5" />} label={t('sleep', { defaultValue: 'Sleep' })} value={healthDetails.sleep} />
                    <InfoRow icon={<FireIcon className="w-5 h-5" />} label={t('energy', { defaultValue: 'Energy' })} value={healthDetails.energy} />
                    <InfoRow icon={<SunIcon className="w-5 h-5" />} label={t('climate', { defaultValue: 'Climate Preference' })} value={healthDetails.climate} />
                    <InfoRow icon={<BoltIcon className="w-5 h-5" />} label={t('stress', { defaultValue: 'Stress Response' })} value={healthDetails.stress} />
                    <InfoRow icon={<AcademicCapIcon className="w-5 h-5" />} label={t('memory', { defaultValue: 'Memory' })} value={healthDetails.memory} />
                    <InfoRow icon={<ClockIcon className="w-5 h-5" />} label={t('pace', { defaultValue: 'Activity Pace' })} value={healthDetails.pace} />
                    <InfoRow icon={<FaceSmileIcon className="w-5 h-5" />} label={t('mood', { defaultValue: 'Mood' })} value={healthDetails.mood} />
                    <InfoRow icon={<CurrencyDollarIcon className="w-5 h-5" />} label={t('money', { defaultValue: 'Money Handling' })} value={healthDetails.money} />
                    <InfoRow icon={<ChatBubbleLeftIcon className="w-5 h-5" />} label={t('communication', { defaultValue: 'Communication Style' })} value={healthDetails.communication} />
                    <InfoRow icon={<BoltIcon className="w-5 h-5" />} label={t('change', { defaultValue: 'Response to Change' })} value={healthDetails.change} />
                  </>
                )}
              </div>
              <div className="mt-4 flex justify-center mb-6">
                <button
                  type="button"
                  onClick={() => setShowMoreHealth(false)}
                  className="flex items-center gap-2 text-ayurGreen dark:text-ayurBeige hover:text-ayurGreen/80 dark:hover:text-ayurBeige/80 font-medium transition-colors"
                >
                  <ChevronUpIcon className="w-5 h-5" /> {t('showLess', { defaultValue: 'Show Less' })}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons (Save/Cancel) */}
          {editMode && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button 
                type="submit" 
                className="w-full sm:w-52 flex items-center justify-center gap-2 bg-ayurGreen text-white px-6 py-3 rounded-full font-bold hover:bg-ayurGreen/80 transition-all shadow-md hover:shadow-lg"
              >
                <CheckCircleIcon className="w-5 h-5" /> {t('saveChanges', { defaultValue: 'Save Changes' })}
              </button>
              <button 
                type="button" 
                onClick={handleCancel} 
                className="w-full sm:w-52 flex items-center justify-center gap-2 bg-ayurSaffron text-white px-6 py-3 rounded-full font-bold hover:bg-ayurSaffron/80 transition-all shadow-md hover:shadow-lg"
              >
                <XCircleIcon className="w-5 h-5" /> {t('cancel', { defaultValue: 'Cancel' })}
              </button>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <motion.div 
              className={`mt-4 p-3 rounded-lg text-sm flex items-center justify-center gap-2 max-w-md mx-auto ${statusMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
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