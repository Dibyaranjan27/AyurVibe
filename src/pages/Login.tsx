import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { loginUser } from '../data/firebase';
import { useTranslation } from 'react-i18next';
import { Mail, Eye, EyeOff, Facebook, Moon, Sun, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  if (!context) return null;
  const { setUser } = context;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      setUser(user);
      navigate('/results', { state: { answers: {} } }); // Redirect to Results after login
    } catch (err) {
      setError(t('loginError', { defaultValue: 'Invalid email or password' }));
    }
  };

  return (
    <div className="min-h-[80dvh] w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 md:p-6">

      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Side */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <img 
              src="src/assets/leo-rivas-YJIEv6Gb0rI-unsplash.jpg"
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

          {/* Form Side */}
          <div className="w-full lg:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
              {isLogin ? 'Log in' : 'Register'}
            </h1>
            
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Phone Number"
                  className="w-full pl-10 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen dark:focus:border-ayurGreen/70 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showPassword ? 
                    <EyeOff className="w-5 h-5" /> : 
                    <Eye className="w-5 h-5" />
                  }
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-ayurGreen"
                  />
                  <span className="text-sm text-gray-600">remember me</span>
                </label>
                <button className="text-sm text-ayurGreen hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full p-3 bg-gradient-to-r from-ayurGreen to-green-400 text-white rounded-full hover:opacity-90 transition-all"
              >
                {isLogin ? 'Log in' : 'Register'}
              </button>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Log in with</p>
                <div className="flex justify-center space-x-4">
                  <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </button>
                  <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <Facebook className="w-5 h-5 text-[#3b5998]" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-ayurGreen hover:underline font-medium"
                  >
                    {isLogin ? 'Register Now' : 'Log in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;