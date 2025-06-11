import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const addUser = newUser => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const removeUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Initialize user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after initialization
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    console.log('user changed', user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, addUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};
