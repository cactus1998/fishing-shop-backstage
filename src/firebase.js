// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7G13s9RMQ6uQceCTVTNoTYf34wbxozQM",
  authDomain: "fishing-shop-6b75d.firebaseapp.com",
  projectId: "fishing-shop-6b75d",
  storageBucket: "fishing-shop-6b75d.firebasestorage.app",
  messagingSenderId: "861719439303",
  appId: "1:861719439303:web:15a1d1c3dd367266175be2",
  measurementId: "G-2TZR1M0ZNN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
