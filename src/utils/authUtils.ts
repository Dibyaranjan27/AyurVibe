import { auth, db } from '../data/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { saveGuestDataToFirebase } from './guestUtils';

export const registerUser = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const newUser = userCredential.user;
  await updateProfile(newUser, { displayName: name });
  await setDoc(doc(db, 'users', newUser.uid), {
    name,
    email,
    createdAt: new Date().toISOString(),
  });
  await saveGuestDataToFirebase(newUser.uid);
  return newUser;
};

export const loginUser = async (email: string, password: string, rememberMe: boolean) => {
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const googleUser = result.user;
  await setDoc(doc(db, 'users', googleUser.uid), {
    name: googleUser.displayName || 'Google User',
    email: googleUser.email || '',
    createdAt: new Date().toISOString(),
  }, { merge: true });
  await saveGuestDataToFirebase(googleUser.uid);
  return googleUser;
};

export const loginAnonymously = async () => {
  const result = await signInAnonymously(auth);
  const anonUser = result.user;
  await setDoc(doc(db, 'users', anonUser.uid), {
    name: 'Anonymous User',
    email: '',
    createdAt: new Date().toISOString(),
    isAnonymous: true,
  }, { merge: true });
  await saveGuestDataToFirebase(anonUser.uid);
  return anonUser;
};