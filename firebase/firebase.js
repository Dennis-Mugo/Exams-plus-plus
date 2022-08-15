// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR API KEY",
  authDomain: "educate-6542c.firebaseapp.com",
  projectId: "educate-6542c",
  storageBucket: "educate-6542c.appspot.com",
  messagingSenderId: "442648859460",
  appId: "1:442648859460:web:cd598a27dfd7109eb33d11",
  measurementId: "G-1FWM9P82JK",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default db;
