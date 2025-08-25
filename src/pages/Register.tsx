import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { registerUser } from '../utils/authUtils';
import { validateEmail, validatePassword, validateConfirmPassword, validateName } from '../utils/validationUtils';
import { useTranslation } from 'react-i18next';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthLayout from '../components/AuthLayout';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, theme } = context ?? {};

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!context) return null;

  const validateForm = () => {
    if (!validateName(name)) {
      setError(t('nameError', { defaultValue: 'Name is required and must be at least 2 characters.' }));
      return false;
    }
    if (!validateEmail(email)) {
      setError(t('emailError', { defaultValue: 'A valid email is required.' }));
      return false;
    }
    if (!validatePassword(password)) {
      // Assuming validatePassword returns a specific error message or a generic boolean
      setError(t('passwordError.generic', { defaultValue: 'Password does not meet the requirements.' }));
      return false;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
      setError(t('passwordMismatch', { defaultValue: 'Passwords do not match.' }));
      return false;
    }
    setError('');
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerUser(email, password, name);
      navigate('/');
    } catch (err: any) {
      console.error("Registration Error:", err.code);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError(t('registerError.emailInUse', { defaultValue: 'This email address is already in use.' }));
          break;
        case 'auth/weak-password':
          setError(t('registerError.weakPassword', { defaultValue: 'The password is too weak.' }));
          break;
        case 'auth/invalid-email':
          setError(t('registerError.invalidEmail', { defaultValue: 'The email address is not valid.' }));
          break;
        default:
          setError(t('registerError.generic', { defaultValue: 'Registration failed. Please try again.' }));
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Register"
      error={error}
      isGoogleLoading={false}
      setIsGoogleLoading={() => {}}
      setError={setError}
      isAnonymousLoading={false}
      setIsAnonymousLoading={() => {}}
      footerLink={{
        text: "Already have an account?",
        to: `/login?theme=${theme}`,
        linkText: "Log in",
      }}
      imageSide="right"
    >
      <form onSubmit={handleRegister} className="space-y-6">
        <AuthInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          icon="user"
          disabled={isLoading}
          maxLength={100}
        />
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
        <AuthInput
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          icon="lock"
          disabled={isLoading}
          maxLength={128}
        />

        {/* CHANGE: "Register" text is now nested as a child, and redundant onClick is removed. */}
        <AuthButton
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          loadingText="Registering..." // Add this line
        >
          Register
        </AuthButton>

      </form>
    </AuthLayout>
  );
};

export default Register;