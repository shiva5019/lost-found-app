// frontend/src/firebase.js
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWX1k4uNa8TPl7w5vbp_nSlcW19OHtE4k",
  authDomain: "lostfound-api.firebaseapp.com",
  projectId: "lostfound-api",
  storageBucket: "lostfound-api.appspot.com",
  messagingSenderId: "461112286783",
  appId: "1:461112286783:web:369ce7e89f6ad636baa28a",
  measurementId: "G-KE9MRH4SGF",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

// ✅ Google Auth Provider
const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(); // after your firebase `app` is initialized
// ✅ Export core auth utilities
export {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
};
