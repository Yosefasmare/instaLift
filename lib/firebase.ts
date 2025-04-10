// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_HSOz-BfRJ2c-ilb7hkluKyS15zV5hFQ",
  authDomain: "instafollo.firebaseapp.com",
  projectId: "instafollo",
  storageBucket: "instafollo.firebasestorage.app",
  messagingSenderId: "607054849343",
  appId: "1:607054849343:web:1eaefc21a48961209e9f8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)