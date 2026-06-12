import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVlg-vSz4aNIt1-AWeL1PmERfqmpsptT0",
  authDomain: "saykuapp.firebaseapp.com",
  projectId: "saykuapp",
  storageBucket: "saykuapp.firebasestorage.app",
  messagingSenderId: "486922645051",
  appId: "1:486922645051:web:d77af7b721b049c8bbf61e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
