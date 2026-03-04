import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import FestivalBanner from '../components/FestivalBanner';
import { API_URL } from '../config';
// const url = "http://localhost:4000";

export default function ProductList() {
  const { selectedCategory, searchQuery } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  // Filter by category AND search query
  const filtered = products.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Loading products...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
          <FestivalBanner />
      <div style={styles.header}>
        <h2 style={styles.title}>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </h2>
        <span style={styles.count}>{filtered.length} items</span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🔍</p>
          <p style={styles.emptyText}>No products found</p>
          <p style={styles.emptySubtext}>Try a different search or category</p>
        </div>
      )}

      {/* Product Grid */}
      <div style={styles.grid}>
        {filtered.map(product => (
          <div
            key={product._id}
            style={styles.card}
            onClick={() => navigate(`/product/${product._id}`)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Image */}
            <div style={styles.imageWrapper}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
onError={e => {
  e.target.onerror = null; // ✅ prevents infinite loop
  e.target.src = 'https://placehold.co/300x200?text=No+Image';
}}
              />
              <span style={styles.categoryBadge}>{product.category}</span>
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

              <div style={styles.footer}>
                <span style={styles.price}>${product.price}</span>
                <button
                  style={styles.btn}
                  onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5a6fd6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#667eea'}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
page: {
  flexGrow: 1,           // ✅ stretches to fill available space
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '32px 24px',
  fontFamily: "'Segoe UI', sans-serif",
  width: '100%',
},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  count: {
    fontSize: '14px',
    color: '#888',
    background: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imageWrapper: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    background: '#f8f9fa',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(102,126,234,0.9)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  info: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
  },
  sizes: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  sizeTag: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#667eea',
    border: '1px solid #667eea',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
  },
  price: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  btn: {
    background: '#667eea',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    gap: '12px',
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
  empty: {
    textAlign: 'center',
    padding: '60px 0',
  },
  emptyIcon: { fontSize: '48px', margin: '0 0 8px' },
  emptyText: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  emptySubtext: { fontSize: '14px', color: '#888', margin: 0 },
};