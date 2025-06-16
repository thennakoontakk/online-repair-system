import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkmLBuXv70jmG_w9zGBS6rcIg2H8Txh1Y",
    authDomain: "onlinerepairsystem.firebaseapp.com",
    projectId: "onlinerepairsystem",
    storageBucket: "onlinerepairsystem.firebasestorage.app",
    messagingSenderId: "151307776718",
    appId: "1:151307776718:web:a4b1b382f9b8d7bb82d69f",
    measurementId: "G-DR125WWSX8"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };