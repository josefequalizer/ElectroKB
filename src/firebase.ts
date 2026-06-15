import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQU80_1mHDh1phexPLf4RCrGEWfkShb8k",
  authDomain: "electrokb-db.firebaseapp.com",
  projectId: "electrokb-db",
  storageBucket: "electrokb-db.firebasestorage.app",
  messagingSenderId: "418197248004",
  appId: "1:418197248004:web:a304500f1b0a3483b2fd51",
  measurementId: "G-7JYGE04KF0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);