import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider,     reauthenticateWithCredential, EmailAuthProvider,deleteUser } from 'firebase/auth';
// CHANGE: Added query and orderBy for the feedback function
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, Timestamp, updateDoc, query, orderBy, deleteDoc } from 'firebase/firestore';

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

// CHANGE: Add a function to update a user's details
export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, data);
};

// CHANGE: Add a function to delete a feedback document
export const deleteFeedback = async (feedbackId: string): Promise<void> => {
  const feedbackDocRef = doc(db, 'feedback', feedbackId);
  await deleteDoc(feedbackDocRef);
};

// IMPORTANT: Deleting a Firebase Auth user cannot be done securely from the client.
// This requires a Firebase Cloud Function. The function below is for client-side
// data deletion in Firestore only.
export const deleteUserDocument = async (userId: string): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  await deleteDoc(userDocRef);
};

/**
 * Securely deletes a user's account from Authentication and their data from Firestore.
 * Requires the user's password to re-authenticate them before deletion.
 * @param password The user's current password.
 */
export const deleteUserAccount = async (password: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("No user is currently signed in or user has no email.");
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteDoc(doc(db, 'users', user.uid));

  await deleteUser(user);
};