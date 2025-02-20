import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDqT32J33jMAYmt3u7VbUz7ijAe_OjB5sE",
  authDomain: "task-management-89aed.firebaseapp.com",
  projectId: "task-management-89aed",
  storageBucket: "task-management-89aed.firebasestorage.app",
  messagingSenderId: "560615912418",
  appId: "1:560615912418:web:b8c640a58e554dbb627fbb",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const fbFunctions = getFunctions(app);

