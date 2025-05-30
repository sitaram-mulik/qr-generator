import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading state
  
  const addUser = (newUser) => {
    setUser(newUser);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

  const removeUser = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  // Initialize user from sessionStorage if available
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);  // Set loading to false after initialization
  }, []);

  // Update sessionStorage when user changes
  useEffect(() => {
    console.log("user changed", user);
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, addUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};
