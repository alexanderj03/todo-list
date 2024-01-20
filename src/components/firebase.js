import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBT943wlywSkM2LUv_H1i9oTwdRTEkKlpw",
  authDomain: "list-todo-proj.firebaseapp.com",
  projectId: "list-todo-proj",
  storageBucket: "list-todo-proj.appspot.com",
  messagingSenderId: "244250878847",
  appId: "1:244250878847:web:48ed78f93a9326f114704a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);