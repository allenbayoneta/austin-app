// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFGA6ZNvoJpqjwPDmNKKyoihX-09XA0_Q",
  authDomain: "fir-austin.firebaseapp.com",
  projectId: "fir-austin",
  storageBucket: "fir-austin.appspot.com",
  messagingSenderId: "965419104952",
  appId: "1:965419104952:web:ea78dce7a693503b50524d",
  measurementId: "G-JCXLNQL496",
  databaseURL:'https://fir-austin-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Access the Firebase Authentication service
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, storage, database };