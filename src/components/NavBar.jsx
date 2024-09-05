import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout, token, isLoggedIn } = useAuth() || {}; // Use isLoggedIn to check login status
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user && token) {
      navigate(`/profile`, { state: { userId: user.id } });
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate(`/cart`); // Navigate to the cart page
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  };

  const handleLogout = () => {
    logout(); // Clear user data and token from context
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="navbar">
      <ul>
        {user ? (
          <>
            <li>
              <button onClick={handleProfileClick}>User Profile</button>
            </li>
            <li>
              <button onClick={handleCartClick}>Cart</button>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <button onClick={handleCartClick}>Cart</button> {/* Show Cart link even when not logged in */}
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
