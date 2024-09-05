// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/new-in">New In</Link></li>
        <li><Link to="/clothing">Clothing</Link></li>
        <li><Link to="/shoes">Shoes</Link></li>
        <li><Link to="/electronics">Electronics</Link></li>
        <li><Link to="/accessories">Accessories</Link></li>
        <li><Link to="/active-wear">Active Wear</Link></li>
        <li><Link to="/gifts-living">Gifts & Living</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
