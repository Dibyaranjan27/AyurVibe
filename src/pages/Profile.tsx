import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FloatingLeaves from '../components/FloatingLeaves';
import { UserCircleIcon, EnvelopeIcon, DevicePhoneMobileIcon, SparklesIcon, PencilIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const context = useContext(AppContext);
  const { t } = useTranslation();

  // Redirect if user is not logged in
  if (!context || !context.user) {
    // You can also use useNavigate() here inside a useEffect if preferred
    return <p className="text-center p-8">{t('loginRequired', { defaultValue: 'Please log in to view your profile' })}</p>;
  }

  const { user, setUser } = context;

  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name || '');
  const [mobile, setMobile] = useState<string>(user.mobile || '');
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (user && user.id) {
        try {
            await updateDoc(doc(db, 'users', user.id), { name, mobile });
            // Update context immediately for a snappy UI response
            setUser({ ...user, name, mobile });
            setEditMode(false);
            setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Error updating profile: ", error);
            setStatusMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setTimeout(() => setStatusMessage(null), 3000); // Clear message after 3 seconds
        }
    }
  };
  
  const handleCancel = () => {
    // Reset fields to original state from context
    setName(user.name || '');
    setMobile(user.mobile || '');
    setEditMode(false);
  };

  // Placeholder for profile picture logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload this file to a service like Firebase Storage
      // and then update the user's photoURL.
      // For now, we'll just log it.
      console.log('Selected file:', e.target.files[0]);
      alert('Profile picture functionality requires a backend implementation.');
    }
  };

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
    <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="text-ayurGreen dark:text-ayurBeige">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-lg">{value || 'Not set'}</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingLeaves />
      
      <motion.div 
        className="max-w-4xl w-full mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Left Column: Avatar & Identity */}
            <div className="lg:col-span-1 bg-ayurGreen/10 dark:bg-gray-700/50 p-8 flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-ayurGreen flex items-center justify-center text-white text-5xl font-bold ring-4 ring-white/50 dark:ring-gray-800/50">
                  {user.name ? user.name[0].toUpperCase() : <UserCircleIcon className="w-20 h-20"/>}
                </div>
                {/* Placeholder for image upload button */}
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-white dark:bg-gray-600 rounded-full p-2 cursor-pointer shadow-md hover:scale-110 transition-transform">
                  <PencilIcon className="w-5 h-5 text-ayurGreen dark:text-ayurBeige" />
                  <input id="photo-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
              <h2 className="text-2xl font-lora font-bold text-gray-800 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>

            {/* Right Column: Details & Form */}
            <div className="lg:col-span-2 p-8">
              <form onSubmit={handleSave}>
                <h3 className="text-xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-6">Profile Details</h3>
                
                {editMode ? (
                  // --- EDIT MODE ---
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                      <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-ayurGreen focus:outline-none"/>
                    </div>
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mobile Number</label>
                      <input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full p-2 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-ayurGreen focus:outline-none"/>
                    </div>
                  </div>
                ) : (
                  // --- DISPLAY MODE ---
                  <div>
                    <InfoRow icon={<EnvelopeIcon className="w-6 h-6"/>} label="Email Address" value={user.email} />
                    <InfoRow icon={<UserCircleIcon className="w-6 h-6"/>} label="Full Name" value={user.name} />
                    <InfoRow icon={<DevicePhoneMobileIcon className="w-6 h-6"/>} label="Mobile Number" value={user.mobile} />
                    <InfoRow icon={<SparklesIcon className="w-6 h-6"/>} label="Your Prakriti" value={user.prakriti} />
                  </div>
                )}
                
                {/* --- Action Buttons --- */}
                <div className="mt-8 flex items-center gap-4">
                  {editMode ? (
                    <>
                      <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-ayurGreen text-white px-6 py-3 rounded-full font-bold hover:bg-ayurGreen/80 transition-all">
                        <CheckCircleIcon className="w-5 h-5" /> Save Changes
                      </button>
                      <button type="button" onClick={handleCancel} className="flex-1 flex items-center justify-center gap-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-full font-bold hover:bg-gray-400 dark:hover:bg-gray-500 transition-all">
                        <XCircleIcon className="w-5 h-5" /> Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setEditMode(true)} className="flex items-center justify-center gap-2 bg-ayurSaffron text-white px-6 py-3 rounded-full font-bold hover:bg-ayurSaffron/80 transition-all">
                      <PencilIcon className="w-5 h-5" /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {statusMessage.type === 'success' ? <CheckCircleIcon className="w-5 h-5"/> : <XCircleIcon className="w-5 h-5"/>}
                        {statusMessage.text}
                    </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;