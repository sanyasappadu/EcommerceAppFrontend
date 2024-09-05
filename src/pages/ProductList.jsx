import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const products = {
  "New In": [
    { id: 1, name: 'Product 1', price: '$100' },
    { id: 2, name: 'Product 2', price: '$200' },
  ],
  "Clothing": [
    { id: 3, name: 'Product 3', price: '$150' },
    { id: 4, name: 'Product 4', price: '$250' },
  ],
  "Shoes": [
    { id: 5, name: 'Product 5', price: '$300' },
    { id: 6, name: 'Product 6', price: '$350' },
  ],
  "Accessories": [
    { id: 7, name: 'Product 7', price: '$400' },
    { id: 8, name: 'Product 8', price: '$450' },
  ],
  "Active Wear": [
    { id: 9, name: 'Product 9', price: '$500' },
    { id: 10, name: 'Product 10', price: '$550' },
  ],
  "Gifts & Living": [
    { id: 11, name: 'Product 11', price: '$600' },
    { id: 12, name: 'Product 12', price: '$650' },
  ],
  "Electronics": [
    { id: 13, name: 'Product 13', price: '$300' },
    { id: 14, name: 'Product 14', price: '$350' },
  ],
};

const ProductList = ({ category }) => {
  return (
    <div>
      <h2>{category}</h2>
      <ul>
        {products[category].map(product => (
          <li key={product.id}>
            <Link to={`/productdetails/${product.id}`}>
              {product.name} - {product.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

ProductList.propTypes = {
  category: PropTypes.oneOf([
    'New In',
    'Clothing',
    'Shoes',
    'Accessories',
    'Active Wear',
    'Gifts & Living',
    'Electronics'
  ]).isRequired
};

export default ProductList;
