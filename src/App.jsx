import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./AuthContext";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import Navbar from "./components/NavBar";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./components/Footer";
import Wishlist from "./pages/Wishlist";
import SellerAddProduct from "./pages/SellerAddProduct";

import SellerDashboard from "./pages/SellerDashboard";
import SellerProductEdit from "./pages/SellerProductEdit";
import SellerCreateFestivalOffer from "./pages/SellerCreateFestivalOffer";

const App = () => {
  const { logout, user, isLoggedIn } = useAuth();

  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#f3f4f6",
        }}
      >
        <Navbar user={user} onLogout={logout} />
        {/* ✅ No padding here — each page handles its own spacing */}
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isLoggedIn ? <Navigate to="/" /> : <Signup />}
            />
            <Route
              path="/cart"
              element={isLoggedIn ? <Cart /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" />}
            />
            <Route path="/products" element={<ProductList />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  user?.role === "seller" ? (
                    <Navigate to="/seller/dashboard" />
                  ) : (
                    <Navigate to="/products" />
                  )
                ) : (
                  <Navigate to="/products" />
                )
              }
            />{" "}
            <Route
              path="/wishlist"
              element={isLoggedIn ? <Wishlist /> : <Navigate to="/login" />}
            />
            <Route
              path="/seller/dashboard"
              element={
                isLoggedIn ? <SellerDashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/seller/product/:id"
              element={
                isLoggedIn ? <SellerProductEdit /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/seller/add-product"
              element={
                isLoggedIn ? <SellerAddProduct /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/seller/add-festivel-offer"
              element={
                isLoggedIn ? (
                  <SellerCreateFestivalOffer />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
