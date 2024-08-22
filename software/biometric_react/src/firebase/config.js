import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDDWNZ6N3Mka2lgbsPCXMWkVOmqdyQSlSs",
  authDomain: "biometric-based-voting.firebaseapp.com",
  databaseURL: "https://biometric-based-voting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "biometric-based-voting",
  storageBucket: "biometric-based-voting.appspot.com",
  messagingSenderId: "172265278171",
  appId: "1:172265278171:web:f22aa71d5b240d074fdafe",
  measurementId: "G-ZD5FX9VRJ8"
};

// init firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const rtdb = getDatabase();
const auth = getAuth();
const storage = getStorage();

// timestamp
const timestamp = Timestamp;

export { db, rtdb, auth, storage, timestamp };
