// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASJ4SQCwPWFhue5ADzy5C1uljlXa3TH7c",
  authDomain: "bookwise-beginnings.firebaseapp.com",
  projectId: "bookwise-beginnings",
  storageBucket: "bookwise-beginnings.firebasestorage.app",
  messagingSenderId: "764123563697",
  appId: "1:764123563697:web:cde46291f7974869d44490"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };