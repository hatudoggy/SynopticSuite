import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyAjfqpilxlcSm3VBg7hvYFiTSKAI3Mk75k",
  authDomain: "synopticsuite.firebaseapp.com",
  projectId: "synopticsuite",
  storageBucket: "synopticsuite.appspot.com",
  messagingSenderId: "431126250567",
  appId: "1:431126250567:web:3c2dc348271d16c7df9d62"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
