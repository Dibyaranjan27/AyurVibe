import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../data/firebase';
import FloatingLeaves from '@/components/FloatingLeaves';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await userCredential.user.getIdTokenResult();
      
      if (tokenResult.claims.admin) {
        navigate('/admin');
      } else {
        await auth.signOut();
        setError('Access denied. This is not an admin account.');
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
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
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen focus:outline-none bg-transparent text-gray-900 dark:text-white"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-ayurGreen text-white font-bold rounded-full hover:bg-ayurGreen/80 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;