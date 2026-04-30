import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AppState } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { auth } from "../config/firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);
  const timeExited = useRef(null);
  const appState = useRef(AppState.currentState);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); 
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {}
 };

  const startAutoLogoutTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeExited.current = Date.now(); 

    timeoutRef.current = setTimeout(async () => {
      await logout();
    }, 10000); 
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken();
        await SecureStore.setItemAsync('auth_token', token);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextState) => {

      if (!user) return;
      if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        startAutoLogoutTimer();
      }

      if (nextState === "active") {
        const diff = Date.now() - (timeExited.current || 0);
        if (timeExited.current && diff >= 10000) {
          await logout();
        } else if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        timeExited.current = null;
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}