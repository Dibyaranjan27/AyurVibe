import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from '../data/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Mail, Eye, EyeOff, Lock } from 'lucide-react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import FloatingLeaves from '@/components/FloatingLeaves';
import { saveGuestDataToFirebase } from '../utils/guestUtils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { user, theme } = context || {};

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  if (!context) return null;

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError(t('emailError', { defaultValue: 'A valid email is required.' }));
      return false;
    }
    if (!password) {
      setError(t('passwordError', { defaultValue: 'Password is required.' }));
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      await saveGuestDataToFirebase(loggedInUser.uid);
      navigate('/dashboard');

    } catch (err: any) {
      setError(t('loginError.invalidCredentials', { defaultValue: "Invalid email or password. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const userDocRef = doc(db, 'users', googleUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: googleUser.displayName || 'Google User',
          email: googleUser.email || '',
          createdAt: new Date().toISOString(),
        });
      }
      
      await saveGuestDataToFirebase(googleUser.uid);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(t('loginError.google', { defaultValue: 'Google login failed. Please try again.' }));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsAnonymousLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const anonUser = result.user;

      await setDoc(doc(db, 'users', anonUser.uid), {
        name: 'Anonymous User',
        email: '',
        createdAt: new Date().toISOString(),
        isAnonymous: true,
      }, { merge: true });

      await saveGuestDataToFirebase(anonUser.uid);
      navigate('/dashboard');
    } catch (err: any) {
      setError(t('anonymousError', { defaultValue: 'Anonymous login failed. Please try again.' }));
    } finally {
      setIsAnonymousLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen p-4">
      <FloatingLeaves />
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 relative hidden lg:block animate-slideLeft">
            <img 
              src="/src/assets/leaves_background.jpg"
              alt="Ayurveda"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white z-10 max-w-sm px-6">
                <h2 className="text-3xl font-bold mb-4">Discover Your Balance</h2>
                <p className="text-lg">Begin your journey to wellness with ancient Ayurvedic wisdom</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-8 animate-slideRight">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Log in</h1>
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-10 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen dark:focus:border-ayurGreen/70 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isLoading}
                  maxLength={128}
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen dark:focus:border-ayurGreen/70 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isLoading}
                  maxLength={128}
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-ayurGreen focus:ring-ayurGreen"
                    disabled={isLoading}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button type="button" className="text-sm text-ayurGreen hover:underline" disabled={isLoading}>
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-gradient-to-r from-ayurGreen to-green-400 text-white font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </form>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-[40%] before:h-[1px] before:bg-gray-300 dark:before:bg-gray-600 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-[40%] after:h-[1px] after:bg-gray-300 dark:after:bg-gray-600">OR</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleGoogleLogin}
                  className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  )}
                </button>
                <button
                  onClick={handleAnonymousLogin}
                  className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                  disabled={isAnonymousLoading}
                >
                  {isAnonymousLoading ? (
                    <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" /></svg>
                  ) : (
                    <UserCircleIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Don’t have an account?{' '}
                <Link to={`/register?theme=${theme}`} className="text-ayurGreen hover:underline font-medium">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;