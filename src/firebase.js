import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBm-6hshEliqQ8ZewLMNmxsTAjaP3HE0Zo",
  authDomain: "information-5b8c5.firebaseapp.com",
  databaseURL: "https://information-5b8c5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "information-5b8c5",
  storageBucket: "information-5b8c5.firebasestorage.app",
  messagingSenderId: "651163800781",
  appId: "1:651163800781:web:0ffe9aa943afbc39544584",
  measurementId: "G-EY21YTCXR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { getDatabase } from 'firebase/database';
const rtdb = getDatabase(app);
export { db, rtdb };
