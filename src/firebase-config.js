// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAher7ecLbkaMrvLPxOHhQr51hMKaZ7MA0",
  authDomain: "collab-sphere-7758e.firebaseapp.com",
  projectId: "collab-sphere-7758e",
  storageBucket: "collab-sphere-7758e.firebasestorage.app",
  messagingSenderId: "17795483449",
  appId: "1:17795483449:web:684e69993a8e35f48ecae8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
