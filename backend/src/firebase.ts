// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "chef-claude-599fd.firebaseapp.com",
  projectId: "chef-claude-599fd",
  storageBucket: "chef-claude-599fd.firebasestorage.app",
  messagingSenderId: "393846335440",
  appId: "1:393846335440:web:cac951e22b3c51b8463bd5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
