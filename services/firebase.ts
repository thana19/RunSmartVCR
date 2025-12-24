// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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

// --- Mock Auth State for Demo/Fallback ---
let mockUser: User | null = null;
const listeners = new Set<(user: User | null) => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener(mockUser));
};

// Wrapper for auth state changes that handles both Real and Mock auth
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  // 1. Subscribe to real Firebase
  const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
    if (user) {
      // If real auth is working, use it
      callback(user);
    } else {
      // If real auth is null, check if we are in mock mode
      callback(mockUser);
    }
  });

  // 2. Add to mock listeners
  listeners.add(callback);

  // Return unsubscribe function
  return () => {
    unsubscribeFirebase();
    listeners.delete(callback);
  };
};

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.warn("Firebase Sign-In Error:", error.code);
    
    // Check for common configuration/setup errors and fallback to Mock Mode
    if (
      error.code === 'auth/configuration-not-found' || 
      error.code === 'auth/operation-not-allowed' ||
      error.code === 'auth/unauthorized-domain' ||
      error.code === 'auth/internal-error'
    ) {
      console.info("Falling back to Mock Authentication mode for demonstration.");
      
      // Create a mock user
      mockUser = {
        uid: 'mock-user-123',
        displayName: 'Demo Runner',
        email: 'runner@example.com',
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        phoneNumber: null,
      } as unknown as User;
      
      notifyListeners();
    } else {
      // If it's a different error (e.g., popup closed by user), rethrow it
      throw error;
    }
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Error signing out from Firebase", error);
  }
  // Clear mock state regardless
  mockUser = null;
  notifyListeners();
};

export { app, analytics, auth };
