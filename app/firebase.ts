// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDnq8w4Uu1kmpd0QpOjurMDzuC8wTyShis",
  authDomain: "test-proj-e080f.firebaseapp.com",
  projectId: "test-proj-e080f",
  storageBucket: "test-proj-e080f.firebasestorage.app",
  messagingSenderId: "869098295777",
  appId: "1:869098295777:web:123eb89e9a46dce2a182a0",
  measurementId: "G-YZ0KXSWQY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export  {auth ,  db};

// fear my wrath noobs!!