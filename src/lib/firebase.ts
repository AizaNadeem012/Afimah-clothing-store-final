// src/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTBVKmrKP-WJcfLhFiZClcTn6bufzfOks",
  authDomain: "afimah-e37ec.firebaseapp.com",
  projectId: "afimah-e37ec",
  storageBucket: "afimah-e37ec.firebasestorage.app",
  messagingSenderId: "842117382241",
  appId: "1:842117382241:web:4a236d4b7cd8fa87252a20",
  measurementId: "G-HPMJKX17GY"
};

// Avoid duplicate initialization error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore & Auth instances
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
