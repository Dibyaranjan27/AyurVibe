import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// CHANGE: Added query and orderBy for the feedback function
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, Timestamp, updateDoc, query, orderBy } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  prakriti: string | null;
  mobile?: string;
  balanceHistory?: { date: string; score: number }[];
  streakDays?: string[];
  reminders?: { id: number; text: string; completed: boolean; dateTime: Date | null }[];
  healthDetails?: HealthDetails;
  quizAnswers?: Record<string, { dosha: string; text: string }>;
}

export interface HealthDetails {
  [key: string]: any;
}

const firebaseConfig = {
  // NOTE: Your variable names in .env.local must match these exactly
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

// Re-exporting for convenience
export { doc, getDoc, setDoc, updateDoc, collection, getDocs, Timestamp, signInWithPopup, GoogleAuthProvider, query, orderBy };

// --- Authentication functions ---
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
  
  // CHANGE: The returned object now includes the user's ID to match the User interface.
  return { id: userCredential.user.uid, ...userDoc.data() } as User;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// --- Firestore functions ---
export const saveHealthDetails = async (userId: string, healthDetails: HealthDetails): Promise<void> => {
  // CHANGE: Using updateDoc is safer for updating a field without overwriting the whole document.
  await updateDoc(doc(db, 'users', userId), { healthDetails });
};

export const saveQuizAnswers = async (userId: string, answers: Record<string, { dosha: string; text: string }>, prakriti: string): Promise<void> => {
  // CHANGE: The 'answers' type is updated to match the actual data structure.
  await updateDoc(doc(db, 'users', userId), { prakriti, quizAnswers: answers });
};

export const getAllUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  // CHANGE: The mapped objects now include the document ID.
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as User);
};

export const updatePrakritiPlan = async (userId: string, prakriti: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), { prakriti });
};

// This function was missing but is required for the Admin Dashboard
export const getAllFeedback = async () => {
  const feedbackCol = collection(db, 'feedback');
  const feedbackQuery = query(feedbackCol, orderBy('submittedAt', 'desc'));
  const feedbackSnapshot = await getDocs(feedbackQuery);
  
  const feedbackList = feedbackSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      submittedAt: data.submittedAt.toDate(), 
    };
  });
  
  return feedbackList;
};