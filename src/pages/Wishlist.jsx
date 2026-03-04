import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_URL } from '../config';
// const url = "http://localhost:4000";

export default function Wishlist() {
  const { user, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movingToCart, setMovingToCart] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!isLoggedIn || !user || !token) { navigate('/login'); return; }
    fetchWishlist();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/users/wishlist/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.status}`);
      const data = await res.json();
      console.log('Wishlist raw data:', data); // ✅ debug

      // ✅ Normalize — handle both flat and nested product shapes
      const normalized = data.map(item =>
        item.name ? item           // already a product object
        : item.product ? item.product  // nested { product: {...} }
        : item                         // fallback
      ).filter(Boolean);

      setWishlist(normalized);
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItem(productId);
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/wishlist`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(item => item._id !== productId));
        showToast('✅ Removed from wishlist');
      } else {
        const err = await res.json();
        showToast(`❌ ${err.message || 'Failed to remove'}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingItem(null);
    }
  };

  const handleMoveToCart = async (productId) => {
    setMovingToCart(productId);
    try {
      const cartRes = await fetch(`${API_URL}/api/users/cart/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (cartRes.ok) {
        // Remove from wishlist
        await fetch(`${API_URL}/api/users/${user.id}/wishlist`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });
        setWishlist(prev => prev.filter(item => item._id !== productId));
        showToast('🛒 Moved to cart successfully!');
      } else {
        const err = await cartRes.json();
        showToast(`❌ ${err.message || 'Failed to add to cart'}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMovingToCart(null);
    }
  };

  // ── Loading ──
  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Loading wishlist...</p>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div style={styles.centered}>
      <p style={{ fontSize: '40px' }}>😕</p>
      <p style={styles.errorText}>{error}</p>
      <button style={styles.browseBtn} onClick={fetchWishlist}>Retry</button>
    </div>
  );

  return (
    <div style={styles.page}>

      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>🤍 My Wishlist</h2>
        <span style={styles.count}>{wishlist.length} items</span>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🤍</p>
          <p style={styles.emptyTitle}>Your wishlist is empty</p>
          <p style={styles.emptySubtext}>Save items you love and come back to them anytime</p>
          <button style={styles.browseBtn} onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {wishlist.map(product => (
            <div key={product._id} style={styles.card}>

              {/* Image */}
              <div style={styles.imageWrapper} onClick={() => navigate(`/product/${product._id}`)}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={styles.image}
                  onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200?text=No+Image'; }}
                />
                <span style={styles.categoryBadge}>{product.category}</span>
                <button
                  style={styles.removeIconBtn}
                  onClick={e => { e.stopPropagation(); handleRemoveFromWishlist(product._id); }}
                >
                  {removingItem === product._id ? '...' : '✕'}
                </button>
              </div>

              {/* Info */}
              <div style={styles.info}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.description}>{product.description}</p>

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div style={styles.sizes}>
                    {product.sizes.map(size => (
                      <span key={size} style={styles.sizeTag}>{size}</span>
                    ))}
                  </div>
                )}

                {/* Stock */}
                <span style={{
                  ...styles.stockBadge,
                  background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
                  color: product.stock > 0 ? '#166534' : '#991b1b',
                }}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
                </span>

                <div style={styles.footer}>
                  <span style={styles.price}>${product.price}</span>
                </div>

                <div style={styles.actions}>
                  <button
                    style={{
                      ...styles.moveToCartBtn,
                      opacity: (movingToCart === product._id || product.stock === 0) ? 0.7 : 1,
                      cursor: (movingToCart === product._id || product.stock === 0) ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => handleMoveToCart(product._id)}
                    disabled={movingToCart === product._id || product.stock === 0}
                  >
                    {movingToCart === product._id ? 'Moving...' : '🛒 Move to Cart'}
                  </button>

                  <button
                    style={{
                      ...styles.removeBtn,
                      opacity: removingItem === product._id ? 0.7 : 1,
                    }}
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={removingItem === product._id}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { flexGrow: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', fontFamily: "'Segoe UI', sans-serif", width: '100%', position: 'relative' },
  centered: { flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '12px', fontFamily: "'Segoe UI', sans-serif" },
  spinner: { width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loadingText: { color: '#888', fontSize: '14px' },
  errorText: { fontSize: '15px', color: '#e53e3e', fontFamily: "'Segoe UI', sans-serif" },
  toast: { position: 'fixed', bottom: '24px', right: '24px', background: '#1a1a2e', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  count: { fontSize: '14px', color: '#888', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px' },
  emptyState: { textAlign: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: '64px', margin: '0 0 8px' },
  emptyTitle: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 6px' },
  emptySubtext: { fontSize: '14px', color: '#888', margin: '0 0 24px' },
  browseBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' },
  imageWrapper: { position: 'relative', height: '200px', overflow: 'hidden', background: '#f8f9fa', cursor: 'pointer' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  categoryBadge: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(102,126,234,0.9)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  removeIconBtn: { position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(229,62,62,0.9)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 },
  productName: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  description: { fontSize: '13px', color: '#888', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' },
  sizes: { display: 'flex', gap: '4px', flexWrap: 'wrap' },
  sizeTag: { fontSize: '11px', fontWeight: '600', color: '#667eea', border: '1px solid #667eea', padding: '2px 8px', borderRadius: '4px' },
  stockBadge: { fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', width: 'fit-content' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
  price: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e' },
  actions: { display: 'flex', gap: '8px', marginTop: '4px' },
  moveToCartBtn: { flex: 1, padding: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  removeBtn: { padding: '10px 12px', background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
};