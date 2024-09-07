import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Import the custom hook
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography, Avatar } from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { selectedCategory } = useAuth(); // Get the selected category from context

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecommerceappbackend-obm7.onrender.com/api/products'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initially show all products
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the selected category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]); // Run when selectedCategory or products change

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {filteredProducts.map((product) => (
          <Link key={product._id} to={`/product/${product._id}`} style={{ textDecoration: 'none' }}> {/* Link to ProductDetails with product ID */}
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {product.name[0]} {/* Show the first letter of the product name */}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <ExpandMoreIcon />
                  </IconButton>
                }
                title={product.name}
                subheader={`Category: ${product.category}`}
              />
              <CardMedia
                component="img"
                height="194"
                image={product.image || '/static/images/cards/paella.jpg'} // Fallback image
                alt={product.name}
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <IconButton aria-label="show more">
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;




// import React, { useState, useEffect } from 'react';
 
// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState('All');
 
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch('https://ecommerceappbackend-obm7.onrender.com/api/products'); // Replace with your actual API endpoint
//         if (!response.ok) {
//           throw new Error('Failed to fetch products');
//         }
//         const data = await response.json();
//         setProducts(data);
//         setFilteredProducts(data); // Initially show all products
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchProducts();
//   }, []);
 
//   const handleCategoryFilter = (category) => {
//     setSelectedCategory(category);
//     if (category === 'All') {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter((product) => product.category === category);
//       setFilteredProducts(filtered);
//     }
//   };
 
//   if (loading) {
//     return <div>Loading...</div>;
//   }
 
//   if (error) {
//     return <div>Error: {error}</div>;
//   }
 
//   return (
//     <div>
//       <h1>Product List</h1>
//       {/* Category Filter Buttons */}
//       <div>
//         <button onClick={() => handleCategoryFilter('All')}>All</button>
//         <button onClick={() => handleCategoryFilter('electronic')}>Electronics</button>
//         <button onClick={() => handleCategoryFilter('clothing')}>Clothes</button>
//         <button onClick={() => handleCategoryFilter('activewear')}>Activewear</button>
//         <button onClick={() => handleCategoryFilter('shoes')}>Shoes</button>
//         {/* Add more buttons as needed */}
//       </div>
 
//       <ul>
//         {filteredProducts.map((product) => (
//           <li>
//             <h2> {product.id}</h2>
//             <h2>{product.name}</h2>
//             <p>{product.description}</p>
//             <p>Price: {product.price}</p>
//             <p>Category: {product.category}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
 
// export default ProductList;
