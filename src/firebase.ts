import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-WBe6hVNsFP5Nr4RLfZ0DQ4H4rbq5EDA",
  authDomain: "mockforgeai.firebaseapp.com",
  projectId: "mockforgeai",
  storageBucket: "mockforgeai.firebasestorage.app",
  messagingSenderId: "666285741676",
  appId: "1:666285741676:web:413d8d0feb70f6aaa6aa49"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
