// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0lQjOibZYGj4GJFi8b3OYU5zb8h0bXF4",
  authDomain: "housing-marketplace-cd67f.firebaseapp.com",
  projectId: "housing-marketplace-cd67f",
  storageBucket: "housing-marketplace-cd67f.appspot.com",
  messagingSenderId: "288725267599",
  appId: "1:288725267599:web:c325bc337b54a7cf796cfa"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()

