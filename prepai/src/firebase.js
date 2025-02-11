import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDQtZU7beIxPguHCvdfxMoCh49Ikz2BeCw",
  authDomain: "prepai-5a3a5.firebaseapp.com",
  projectId: "prepai-5a3a5",
  storageBucket: "prepai-5a3a5.firebasestorage.app",
  messagingSenderId: "973445772963",
  appId: "1:973445772963:web:d6a4d77573e3c0d6dff116",
  measurementId: "G-Y8PX0W85ZS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);