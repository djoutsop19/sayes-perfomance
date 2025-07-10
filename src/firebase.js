// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB24cQOCB9cht6NeB-C8whVfSjnl58KmQk",
  authDomain: "sayes-performance.firebaseapp.com",
  projectId: "sayes-performance",
  storageBucket: "sayes-performance.firebasestorage.app",
  messagingSenderId: "76340843629",
  appId: "1:76340843629:web:3e5d2dc334e5e7f3a4db64",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
