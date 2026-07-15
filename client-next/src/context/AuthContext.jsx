"use client";
import React, { createContext, useState, useEffect } from 'react';
import { SessionProvider, useSession, signOut as nextAuthSignOut } from 'next-auth/react';

export const AuthContext = createContext();

const AuthProviderInner = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    // If NextAuth has a session, use it
    if (status === 'authenticated' && session?.user) {
      const { userId, role } = session.user;
      if (userId) {
        setUser({ userId, role: role || 'user' });
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role || 'user');
      }
    } else if (status === 'unauthenticated') {
      // Fallback to local storage if no NextAuth session
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      if (userId) {
        setUser({ userId, role });
      }
    }
  }, [session, status]);

  const login = (userId, role) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
    setUser({ userId, role });
  };

  const logout = async () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setUser(null);
    if (status === 'authenticated') {
      await nextAuthSignOut({ redirect: false });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  );
};
