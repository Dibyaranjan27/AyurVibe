import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  prakriti: string | null;
  mobile: string;
  balanceHistory?: { date: string; score: number }[];
  streakDays?: string[];
  reminders?: { id: number; text: string; completed: boolean; dateTime: Date | null }[];
}

export interface HealthDetails {
  // Define health details structure as needed
  [key: string]: any;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { doc, getDoc, setDoc, collection, getDocs, Timestamp, signInWithPopup, GoogleAuthProvider };

// Authentication functions
export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = {
    id: userCredential.user.uid,
    name,
    email,
    prakriti: null,
    mobile: ''
  };
  await setDoc(doc(db, 'users', user.id), user);
  return user;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  if (!userDoc.exists()) throw new Error('User data not found');
  return userDoc.data() as User;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Firestore functions
export const saveHealthDetails = async (userId: string, healthDetails: HealthDetails): Promise<void> => {
  await setDoc(doc(db, 'users', userId), { healthDetails }, { merge: true });
};

export const saveQuizAnswers = async (userId: string, answers: Record<number, string>, prakriti: string): Promise<void> => {
  await setDoc(doc(db, 'users', userId), { prakriti, quizAnswers: answers }, { merge: true });
};

export const getAllUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => doc.data() as User);
};