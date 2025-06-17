import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

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

    // get updated details from server if user exists
    axiosInstance
      .get('/user/profile')
      .then(response => {
        console.log('response.data profile ', response.data);
        if (response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      })
      .catch(error => {
        console.error('Failed to fetch user profile:', error);
        // Optionally handle error, e.g., show a notification
      });

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
