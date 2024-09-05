import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const url = "https://ecommerceappbackend-obm7.onrender.com";
  console.log(user)
  useEffect(() => {
    if (!isLoggedIn || !user || !token) {
      navigate('/login'); // Redirect to login if not logged in
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch(`${url}/api/users/cart/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }

        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCart();
  }, [isLoggedIn, navigate, user, token]);

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <li key={item.id}>
              {item.product.name}
            </li>
          ))
        ) : (
          <p>No items in the cart</p>
        )}
      </ul>
    </div>
  );
};

export default Cart;
  