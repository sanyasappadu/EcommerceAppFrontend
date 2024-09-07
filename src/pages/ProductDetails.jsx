import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://ecommerceappbackend-obm7.onrender.com/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async (product) => {
    if (!user || !token) {
      navigate('/login'); // Redirect to login if user is not logged in
    } else {
      try {
        console.log('User ID:', user.id);
        console.log('Product ID:', product._id);
        console.log('Token:', token);

        const response = await fetch(`https://ecommerceappbackend-obm7.onrender.com/api/users/cart/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Pass the token from AuthContext
          },
          body: JSON.stringify({ productId: product._id }) // Pass the product ID in the request body
        });

        // Log the entire response for debugging
        const responseData = await response.json();
        console.log('Response Data:', responseData);

        if (response.ok) {
          console.log('Product added to cart successfully');
        } else {
          console.error('Failed to add product to cart:', responseData.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Product Details</h1>
      {product && (
        <>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
          <p>Category: {product.category}</p>
          <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
          {/* Make sure `addToWishlist` function is defined */}
          {/* <button onClick={() => addToWishlist(product)}>Add to Wishlist</button> */}
        </>
      )}
    </div>
  );
};

export default ProductDetails;



// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext'; // Import useAuth to get user and token

// const products = [
//   { id: 1, name: 'Product 1', price: '$100' },
//   { id: 2, name: 'Product 2', price: '$200' },
//   { id: 3, name: 'Product 3', price: '$150' },
//   { id: 4, name: 'Product 4', price: '$250' },
//   { id: 5, name: 'Product 5', price: '$300' },
//   { id: 6, name: 'Product 6', price: '$350' },
//   { id: 7, name: 'Product 7', price: '$400' },
//   { id: 8, name: 'Product 8', price: '$450' },
//   { id: 9, name: 'Product 9', price: '$500' },
//   { id: 10, name: 'Product 10', price: '$550' },
//   { id: 11, name: 'Product 11', price: '$600' },
//   { id: 12, name: 'Product 12', price: '$650' },
//   { id: 13, name: 'Product 13', price: '$300' },
//   { id: 14, name: 'Product 14', price: '$350' },
// ];

// const ProductDetails = ({ addToWishlist }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user, token } = useAuth(); // Get user and token from AuthContext
//   const product = products.find(p => p.id === parseInt(id, 10));

//   if (!product) {
//     return <div>Product not found</div>;
//   }

//   const handleAddToCart = async (product) => {
//     if (!user || !token) {
//       // Redirect to login if user is not logged in
//       navigate('/login');
//     } else {
//       try {
//         const response = await fetch(`https://ecommerceappbackend-obm7.onrender.com/api/users/cart/${user.id}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}` // Use the token from AuthContext
//           },
//           body: JSON.stringify({ productId: product.id })
//         });

//         if (response.ok) {
//           console.log('Product added to cart successfully');
//         } else {
//           console.error('Failed to add product to cart');
//         }
//       } catch (error) {
//         console.error('Error adding product to cart:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>{product.name}</h2>
//       <p>Price: {product.price}</p>
//       <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
//       <button onClick={() => addToWishlist(product)}>Add to Wishlist</button>
//     </div>
//   );
// }

// export default ProductDetails;
