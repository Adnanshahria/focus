import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyAkJJk_uA3JQ9tIA6z7f6NpN-USBBE_zmo",
 authDomain: "management-fd361.firebaseapp.com",
 projectId: "management-fd361",
 storageBucket: "management-fd361.appspot.com",
 messagingSenderId: "308481171739",
 appId: "1:308481171739:web:82e278da89f98d4f0673be",
 measurementId: "G-4CQR52RFC4"
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);

export { app, auth, firestore };
