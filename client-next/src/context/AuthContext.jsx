"use client";
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (userId) {
      setUser({ userId, role });
    }
  }, []);

  const login = (userId, role) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
    setUser({ userId, role });
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
