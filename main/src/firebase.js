// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
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
  measurementId: "G-JCXLNQL496"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth }; //TODO: Need Fix