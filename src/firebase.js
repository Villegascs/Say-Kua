import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5HICfZkiycBJ8sTvCP5HARpr0HhmuEN8",
  authDomain: "say-kua.firebaseapp.com",
  projectId: "say-kua",
  storageBucket: "say-kua.firebasestorage.app",
  messagingSenderId: "883136517405",
  appId: "1:883136517405:web:3931db617d89dce71ebdf4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
