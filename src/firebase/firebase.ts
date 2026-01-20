import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfDyT7cyFfQtT3xw03F_Fn2xbkpQSw-j0",
  authDomain: "lp-comercio-miriany.firebaseapp.com",
  projectId: "lp-comercio-miriany",
  storageBucket: "lp-comercio-miriany.firebasestorage.app",
  messagingSenderId: "310421640309",
  appId: "1:310421640309:web:c71fdbe7704c4a8bb6943c",
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
