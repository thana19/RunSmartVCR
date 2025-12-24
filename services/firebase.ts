// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvDVvrvkueNiI_voPXBuTb9MI-2f64qI4",
  authDomain: "runsmart-vcr.firebaseapp.com",
  projectId: "runsmart-vcr",
  storageBucket: "runsmart-vcr.firebasestorage.app",
  messagingSenderId: "522191021360",
  appId: "1:522191021360:web:bb213fd86e87a1c5ed14f5",
  measurementId: "G-35TZWJKEVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics: Analytics | null = null;

// Initialize analytics only if supported and in a browser environment
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Firebase Analytics initialization failed:", e);
      }
    }
  }).catch((e) => {
    console.warn("Firebase Analytics support check failed:", e);
  });
}

export { app, analytics };