import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../data/firebase';
import FloatingLeaves from '@/components/FloatingLeaves';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await userCredential.user.getIdTokenResult();
      
      if (tokenResult.claims.admin) {
        navigate('/admin');
      } else {
        await auth.signOut();
        setError('Access denied. This is not an admin account.');
      }
    } catch (err: any) {
      // CHANGE: Expanded error handling for more specific feedback.
      console.error("Admin Login Error:", err.code);
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid credentials. Please try again.');
          break;
        default:
          setError('An unexpected error occurred during login.');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <FloatingLeaves />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 z-10">
        <h1 className="text-3xl font-lora font-bold text-ayurGreen dark:text-ayurBeige mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen focus:outline-none bg-transparent text-gray-900 dark:text-white"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen focus:outline-none bg-transparent text-gray-900 dark:text-white"
            required
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-ayurGreen text-white font-bold rounded-full hover:bg-ayurGreen/80 transition-colors flex items-center justify-center disabled:opacity-50"
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
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;