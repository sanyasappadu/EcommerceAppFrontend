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

const App = () => {
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={logout} />
        <Sidebar />
        <div className="content-container">
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
            <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/new-in" element={<ProductList category="New In" />} />
            <Route path="/clothing" element={<ProductList category="Clothing" />} />
            <Route path="/shoes" element={<ProductList category="Shoes" />} />
            <Route path="/electronics" element={<ProductList category="Electronics" />} />
            <Route path="/accessories" element={<ProductList category="Accessories" />} />
            <Route path="/active-wear" element={<ProductList category="Active Wear" />} />
            <Route path="/gifts-living" element={<ProductList category="Gifts & Living" />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} /> {/* Add this route */}
            <Route path="/" element={<Navigate to="/new-in" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
