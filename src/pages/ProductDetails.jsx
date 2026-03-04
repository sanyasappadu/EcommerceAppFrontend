import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_URL } from '../config';
// const url = "http://localhost:4000";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
const [addedToWishlist, setAddedToWishlist] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product details');
        return res.json();
      })
      .then(data => { setProduct(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

const handleAddToCart = async () => {
  if (!user || !token) return navigate('/login');
  setCartLoading(true);
  try {
    const response = await fetch(`${API_URL}/api/users/cart/${user.id}`, { // ✅ fixed
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId: product._id, quantity: 1 })
    });
    if (response.ok) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
  } finally {
    setCartLoading(false);
  }
};

const handleAddToWishlist = async () => {
  if (!user || !token) return navigate('/login');
  try {
    const res = await fetch(`${API_URL}/api/users/wishlist/${user.id}`, { // ✅ fixed
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId: product._id })
    });
    if (res.ok) setAddedToWishlist(true);
  } catch (err) {
    console.error(err);
  }
};
  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Loading product...</p>
    </div>
  );

  if (error) return (
    <div style={styles.centered}>
      <p style={{ fontSize: '48px' }}>😕</p>
      <p style={styles.errorText}>{error}</p>
      <button style={styles.backBtn} onClick={() => navigate('/products')}>← Back to Products</button>
    </div>
  );

  if (!product) return null;

  return (
    <div style={styles.page}>

      {/* Back Button */}
      <button style={styles.backBtn} onClick={() => navigate('/products')}>
        ← Back to Products
      </button>

      <div style={styles.container}>

        {/* Left - Image */}
        <div style={styles.imageSection}>
          <div style={styles.imageWrapper}>
            <img
              src={product.image}
              alt={product.name}
              style={styles.image}
onError={e => {
  e.target.onerror = null;
  e.target.src = 'https://placehold.co/500x500?text=No+Image';
}}            />
            <span style={styles.categoryBadge}>{product.category}</span>
          </div>
        </div>

        {/* Right - Info */}
        <div style={styles.infoSection}>

          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.description}>{product.description}</p>

          {/* Price & Stock */}
          <div style={styles.priceRow}>
            <span style={styles.price}>${product.price}</span>
            <span style={{
              ...styles.stockBadge,
              background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
              color: product.stock > 0 ? '#166534' : '#991b1b',
            }}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </span>
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div style={styles.sizeSection}>
              <p style={styles.sizeLabel}>Select Size</p>
              <div style={styles.sizeOptions}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeBtn,
                      ...(selectedSize === size ? styles.sizeBtnActive : {})
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seller */}
          {product.seller && (
            <div style={styles.sellerRow}>
              <span style={styles.sellerLabel}>Sold by</span>
              <span style={styles.sellerName}>{product.seller.name || 'E-SHOP Seller'}</span>
            </div>
          )}

          {/* Success message */}
          {addedToCart && (
            <div style={styles.successMsg}>
              ✅ Added to cart successfully!
            </div>
          )}

          {/* Actions */}
<div style={styles.actions}>
  <button
    style={{
      ...styles.addToCartBtn,
      opacity: (cartLoading || product.stock === 0) ? 0.7 : 1,
      cursor: (cartLoading || product.stock === 0) ? 'not-allowed' : 'pointer',
    }}
    onClick={handleAddToCart}
    disabled={cartLoading || product.stock === 0}
  >
    {cartLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
  </button>

  <button
    style={{
      ...styles.wishlistBtn,
      background: addedToWishlist ? '#fff0f6' : '#fff',
      color: addedToWishlist ? '#e53e3e' : '#667eea',
      border: `2px solid ${addedToWishlist ? '#e53e3e' : '#667eea'}`,
    }}
    onClick={handleAddToWishlist}
  >
    {addedToWishlist ? '❤️ Wishlisted' : '🤍 Wishlist'}
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

const styles = {
  page: {
    flexGrow: 1,
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: "'Segoe UI', sans-serif",
    width: '100%',
  },
  centered: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    gap: '12px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f0f0f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#888',
    fontSize: '14px',
  },
  errorText: {
    fontSize: '16px',
    color: '#e53e3e',
    fontFamily: "'Segoe UI', sans-serif",
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0 0 24px 0',
    display: 'block',
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    display: 'flex',
    gap: '48px',
    flexWrap: 'wrap',
  },
  imageSection: {
    flex: '1',
    minWidth: '300px',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#f8f9fa',
    aspectRatio: '1',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'rgba(102,126,234,0.9)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoSection: {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  name: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: 0,
    lineHeight: '1.2',
  },
  description: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.7',
    margin: 0,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  price: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  stockBadge: {
    fontSize: '13px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  sizeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sizeLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: 0,
  },
  sizeOptions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  sizeBtn: {
    width: '44px',
    height: '44px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    background: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    color: '#444',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: "'Segoe UI', sans-serif",
  },
  sizeBtnActive: {
    border: '2px solid #667eea',
    background: '#667eea',
    color: '#fff',
  },
  sellerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#f8f9fa',
    borderRadius: '10px',
  },
  sellerLabel: {
    fontSize: '13px',
    color: '#888',
  },
  sellerName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  successMsg: {
    background: '#dcfce7',
    color: '#166534',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  addToCartBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', sans-serif",
    transition: 'opacity 0.2s',
  },
  wishlistBtn: {
    padding: '14px 20px',
    background: '#fff',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', sans-serif",
  },
};