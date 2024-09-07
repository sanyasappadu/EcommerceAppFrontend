import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Sidebar from './components/Sidebar';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import Navbar from './components/NavBar';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails'; // Import ProductDetails
import { useMediaQuery, useTheme } from '@mui/material';
import Footer from './components/Footer';

const App = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const theme = useTheme();
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md')); // Check if screen size is medium or larger

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} onLogout={logout} />
        <div style={{ display: 'flex', flexGrow: 1 }}>
          {/* Sidebar visible only on medium and larger screens */}
          {isMediumOrLarger && (
            <div style={{ width: '30%', borderRight: '1px solid #ddd' }}>
              <Sidebar />
            </div>
          )}
          {/* Content container with full width on small screens or 70% on larger screens */}
          <div style={{ width: isMediumOrLarger ? '70%' : '100%', padding: '16px' }}>
            <Routes>
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
              <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
              <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/productdetails/:id" element={<ProductDetails />} />
              <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </div>
        </div>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;
