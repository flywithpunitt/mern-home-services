// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDj_uNOOEkQ6jL226kFBNcTz4h76Yv-LsU",
    authDomain: "mern-home-service-app.firebaseapp.com",
    projectId: "mern-home-service-app",
    storageBucket: "mern-home-service-app.firebasestorage.app",
    messagingSenderId: "364030454320",
    appId: "1:364030454320:web:cdad851e945ff1b99e5bf5",
    measurementId: "G-HZM7873MHT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
