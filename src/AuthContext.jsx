// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

// Create Auth Context
const AuthContext = createContext();

// AuthProvider component to provide authentication state to the app
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Function to handle login and set user data
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(true);

    // Save to localStorage to persist state
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  // Function to handle logout and clear user data
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
