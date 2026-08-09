import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg7CwV8FNGbsWZFlacPo5EV0-9apG8l_k",
  authDomain: "kisanai-ba290.firebaseapp.com",
  projectId: "kisanai-ba290",
  storageBucket: "kisanai-ba290.firebasestorage.app",
  messagingSenderId: "46788943502",
  appId: "1:46788943502:web:2785a7dbbb7896013cb3df",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);