// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5PIaJ7GChQ77POGxEEgeawYK7sc6zAwQ",
  authDomain: "merengue-fb964.firebaseapp.com",
  projectId: "merengue-fb964",
  storageBucket: "merengue-fb964.firebasestorage.app",
  messagingSenderId: "1022844406132",
  appId: "1:1022844406132:web:43f4bccdeff825f3fc0421",
  measurementId: "G-5KM937S9CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
