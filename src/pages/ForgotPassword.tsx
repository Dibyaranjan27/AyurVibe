import { useState, useContext } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../data/firebase';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context/AppContext';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = context ?? {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(t('forgotPassword.userNotFound', { defaultValue: "No account found with this email address." }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        error=""
        isGoogleLoading={false}
        setIsGoogleLoading={() => {}}
        setError={() => {}}
        isAnonymousLoading={false}
        setIsAnonymousLoading={() => {}}
        footerLink={{
          text: "",
          to: "/login",
          linkText: "← Back to Login"
        }}
        imageSide="left"
        titleAlignment="center" // Center the title
        showSocialLogins={false}  // Hide social logins
      >
        <div className="text-center text-gray-700 dark:text-gray-300">
          <CheckCircle className="w-16 h-16 text-ayurGreen mx-auto mb-4" />
          <p>
            A password reset link has been sent to <span className="font-bold">{email}</span>.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      error={error}
      isGoogleLoading={false}
      setIsGoogleLoading={() => {}}
      setError={setError}
      isAnonymousLoading={false}
      setIsAnonymousLoading={() => {}}
      footerLink={{
        text: "Remember your password?",
        to: `/login?theme=${theme}`,
        linkText: "Log in"
      }}
      imageSide="left"
      titleAlignment="center" // Center the title
      showSocialLogins={false}  // Hide social logins
    >
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6 -mt-4">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          icon="mail"
          disabled={isLoading}
          maxLength={128}
        />
        <AuthButton
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        >
          Send Reset Link
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;