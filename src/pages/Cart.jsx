import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  console.log(user.id)
  useEffect(() => {
    if (!isLoggedIn || !user || !token) {
      navigate('/login'); // Redirect to login if not logged in
      return;
    }
    console.log(user.id)

    const fetchCart = async () => {
      try {
        console.log(user.id)

        const response = await fetch(`https://ecommerceappbackend-obm7.onrender.com/api/users/cart/${user.id}`, {
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
              {item.product.price}
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
