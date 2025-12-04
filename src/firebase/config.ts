// This configuration is intended for use with the Firebase JS SDK v9 and later.
// It is NOT a service account key and is safe to expose on the client-side.
// Your Firestore security rules are the primary mechanism for securing your data.

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA1MJ1qUOzXJCJ104Rcgtj3zQ9xZ0MWJbo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-6366847068-87a24.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-6366847068-87a24",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-6366847068-87a24.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "468674344394",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:468674344394:web:7f3bd015860729771a0b33",
  measurementId: "",
};
