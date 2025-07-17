import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Import from our new firebase config

const AuthContext = createContext();

// Custom hook to use the auth context easily in any component
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
      console.log('Auth state changed, user:', user ? user.uid : null);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    logout,
  };

  // We don't render the app until Firebase has checked the auth state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
