import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBxVKl4ugp2WwqCSisHG2zAMPJg4zHFtcU",
  authDomain: "auth-praktikum-ca405.firebaseapp.com",
  projectId: "auth-praktikum-ca405",
  storageBucket: "auth-praktikum-ca405.firebasestorage.app",
  messagingSenderId: "855437349221",
  appId: "1:855437349221:web:806eb49b1498b89358118c",
  measurementId: "G-JH5D01ST5N"
};


const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});