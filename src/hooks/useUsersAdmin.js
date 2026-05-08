import { useState, useEffect } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Firebase config for secondary app (same as primary)
const firebaseConfig = {
  apiKey: "AIzaSyB5PIaJ7GChQ77POGxEEgeawYK7sc6zAwQ",
  authDomain: "merengue-fb964.firebaseapp.com",
  projectId: "merengue-fb964",
  storageBucket: "merengue-fb964.firebasestorage.app",
  messagingSenderId: "1022844406132",
  appId: "1:1022844406132:web:43f4bccdeff825f3fc0421",
};

// Initialize secondary app for user management
const secondaryApp = !getApps().find(app => app.name === 'AdminApp') 
  ? initializeApp(firebaseConfig, 'AdminApp')
  : getApp('AdminApp');

const secondaryAuth = getAuth(secondaryApp);

export const useUsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createAdmin = async (email, password, name) => {
    try {
      // 1. Create in Firebase Auth using secondary instance
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;

      // 2. Store in Firestore 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        email,
        name,
        role: 'admin',
        createdAt: serverTimestamp(),
      });

      // 3. Sign out the secondary app immediately to prevent it from "remembering" the new user
      await secondaryAuth.signOut();

      return { success: true };
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  };

  const deleteAdmin = async (userId) => {
    try {
      // Note: We can't easily delete from Auth client-side without a cloud function
      // but we can remove them from our 'users' list and roles.
      await deleteDoc(doc(db, 'users', userId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting admin:", error);
      throw error;
    }
  };

  return { users, loading, createAdmin, deleteAdmin };
};
