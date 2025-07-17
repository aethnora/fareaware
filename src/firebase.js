import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: Use environment variables for this in a real production build
const firebaseConfig = {
  apiKey: "AIzaSyDlWqSgPQF5aqrdR_LD8VJAa9ESWp7KN4U",
  authDomain: "flight-tracker-live.firebaseapp.com",
  projectId: "flight-tracker-live",
  storageBucket: "flight-tracker-live.appspot.com",
  messagingSenderId: "825975528991",
  appId: "1:825975528991:web:e102ebd5e95b2904157f2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth service to be used in other parts of the app
export const auth = getAuth(app);

