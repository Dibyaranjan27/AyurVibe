import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { loginUser } from '../utils/authUtils';
import { validateEmail} from '../utils/validationUtils';
import { useTranslation } from 'react-i18next';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthLayout from '../components/AuthLayout';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { user, theme } = context ?? {};

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
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
    if (!validateEmail(email)) {
      setError(t('emailError', { defaultValue: 'A valid email is required.' }));
      return false;
    }
    // Simple password presence check for login
    if (!password) {
      setError(t('passwordError', { defaultValue: 'Password is required.' }));
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await loginUser(email, password, rememberMe);
      navigate('/');
    } catch (err: any) {
      console.error("Login Error:", err.code);
      setError(t('loginError.generic', { defaultValue: 'Login failed. Invalid credentials.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      error={error}
      isGoogleLoading={false}
      setIsGoogleLoading={() => {}}
      setError={setError}
      isAnonymousLoading={false}
      setIsAnonymousLoading={() => {}}
      footerLink={{
        text: "Don’t have an account?",
        to: `/register?theme=${theme}`,
        linkText: "Register Now",
      }}
      imageSide="left"
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <AuthInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          icon="mail"
          disabled={isLoading}
          maxLength={128}
        />
        <AuthInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          icon="lock"
          disabled={isLoading}
          maxLength={128}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
              disabled={isLoading}
            />
            {t('rememberMe', { defaultValue: 'Remember Me' })}
          </label>
          <Link to="/forgot-password" className="text-sm text-ayurGreen hover:underline">
            {t('forgotPassword', { defaultValue: 'Forgot Password?' })}
          </Link>
        </div>

        {/* CHANGE: "Login" text is now nested as a child, and redundant onClick is removed. */}
        <AuthButton
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        >
          Login
        </AuthButton>

      </form>
    </AuthLayout>
  );
};

export default Login;