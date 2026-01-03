// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        // <-- Yeh line add ki hai
import { getFirestore } from "firebase/firestore"; // <-- Yeh line add ki hai

// Apki Config (Yeh bilkul theek hai)
const firebaseConfig = {
  apiKey: "AIzaSyDXZXWFTIZtHcRD-GUaUjRq4jWLFyQ15DY",
  authDomain: "explore-pakistan-app.firebaseapp.com",
  projectId: "explore-pakistan-app",
  storageBucket: "explore-pakistan-app.firebasestorage.app",
  messagingSenderId: "744086654968",
  appId: "1:744086654968:web:f593b701a61df3c27d900d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- YEH DO LINES BOHT ZAROORI HAIN ---
export const auth = getAuth(app);       // Login/Signup ke liye
export const db = getFirestore(app);    // Database ke liye