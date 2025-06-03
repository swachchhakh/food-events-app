// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { get, getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDjAWg8R3ecUozDfyoQ-Fkw1_UBm2r8mkg",
    authDomain: "foodeventapp-52f5e.firebaseapp.com",
    databaseURL: "https://foodeventapp-52f5e-default-rtdb.firebaseio.com",
    projectId: "foodeventapp-52f5e",
    storageBucket: "foodeventapp-52f5e.firebasestorage.app",
    messagingSenderId: "725899448915",
    appId: "1:725899448915:web:ba376cea3692f58dd8eca6",
    measurementId: "G-NGPREZV6Y4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
export { auth, db, storage };
