// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-8d10a.firebaseapp.com",
  projectId: "real-estate-8d10a",
  storageBucket: "real-estate-8d10a.appspot.com",
  messagingSenderId: "67213659896",
  appId: "1:67213659896:web:44889bb97a6130602db50d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);