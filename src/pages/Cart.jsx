
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { isLoggedIn , user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const url = "http://localhost:4000"
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else {
      // Fetch the cart data
      const fetchCart = async () => {
        try {
          const response = await fetch(`${url}/api/users/cart/${user._id}`);
          // console.log(await response.json());
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
            console.log(data);
          } else {
            console.error('Failed to fetch cart data');
          } 
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      };
      fetchCart();
    }
  }, [isLoggedIn, navigate, user]);

  return (
    <div>
      <h1>Cart</h1>
        {/* <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item}
            </li>
          ))}
        </ul> */}
    </div>
  );
}

export default Cart;
