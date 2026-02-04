import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Analytics is optional for MVPs; we focus on the Database (Firestore)
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBeezlAC_Ej-1Dyg_jxvvnWlAUUI5ZjUlg",
  authDomain: "freezylestore.firebaseapp.com",
  projectId: "freezylestore",
  storageBucket: "freezylestore.firebasestorage.app",
  messagingSenderId: "761263446214",
  appId: "1:761263446214:web:8104f073fe73bd90cfdfc7",
  measurementId: "G-PSNMJJZNLP"
};

// Initialize Firebase Core
const app = initializeApp(firebaseConfig);

/**
 * ENTERPRISE EXPORTS
 * We export 'db' so App.tsx can record transactions.
 */
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;