import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoggedIn = !!token;

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const selectCategory = (category) => setSelectedCategory(category);
const [pendingCoupon, setPendingCoupon] = useState(
  localStorage.getItem('pendingCoupon') || ''
);

const applyPendingCoupon = (code) => {
  setPendingCoupon(code);
  localStorage.setItem('pendingCoupon', code);
};

const clearPendingCoupon = () => {
  setPendingCoupon('');
  localStorage.removeItem('pendingCoupon');
};

  return (
    <AuthContext.Provider value={{
      user, token, isLoggedIn,
      login, logout,
      selectedCategory, selectCategory,
      searchQuery, setSearchQuery,   pendingCoupon,
  applyPendingCoupon,
  clearPendingCoupon,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);