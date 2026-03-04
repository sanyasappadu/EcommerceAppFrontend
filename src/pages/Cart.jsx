import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
// const url = "http://localhost:4000";
const DELIVERY_CHARGE = 10;

const Cart = () => {
  const { isLoggedIn, user, token, pendingCoupon, clearPendingCoupon } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [orderLoading, setOrderLoading]   = useState(false);
  const [orderSuccess, setOrderSuccess]   = useState(false);
  const [orderDetails, setOrderDetails]   = useState(null);
  const [error, setError]                 = useState('');
  const [couponInput, setCouponInput]     = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData, setCouponData]       = useState(null);
  const [couponError, setCouponError]     = useState('');
  const [currentCoupon, setCurrentCoupon] = useState(null);
const [selectedSizes, setSelectedSizes] = useState({});
const handleSizeChange = (productId, size) => {
  setSelectedSizes(prev => ({ ...prev, [productId]: size }));
};
  // ── Initial load ──────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !user || !token) { navigate('/login'); return; }
    fetchCart();
    fetchCurrentCoupon();
  }, []);

  // ── Auto-apply coupon from banner click ───────────────────
  useEffect(() => {
    if (pendingCoupon && token) {
      setCouponInput(pendingCoupon);
      autoApplyCoupon(pendingCoupon);
      clearPendingCoupon();
    }
  }, [pendingCoupon, token]);

  // ── API calls ─────────────────────────────────────────────
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/cart/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      setCartItems(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

// ── Replace fetchCurrentCoupon ────────────────────────────
const fetchCurrentCoupon = async () => {
  try {
    const res = await fetch(`${API_URL}/api/offers/season`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();

    // Pick highest discount offer from current season
    const offers = data.offers || (Array.isArray(data) ? data : []);
    if (offers.length > 0) {
      const best = offers.reduce((a, b) => a.discount > b.discount ? a : b);
      setCurrentCoupon({
        code:        best.code,
        discount:    best.discount,
        description: best.name,
      });
    }
  } catch (err) {
    console.error('fetchCurrentCoupon error:', err);
  }
};

// ── Replace autoApplyCoupon to use /api/offers/validate ──
const autoApplyCoupon = async (code) => {
  if (!code?.trim()) return;
  setCouponLoading(true);
  setCouponError('');
  setCouponData(null);
  try {
    const res = await fetch(`${API_URL}/api/offers/validate/${code.trim().toUpperCase()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok && data.valid) {
      setCouponData({
        code:        data.code,
        discount:    data.discount,
        description: data.description,
      });
      setCouponInput(data.code);
    } else {
      setCouponError(data.message || 'Invalid coupon code');
    }
  } catch (err) {
    setCouponError('Failed to validate coupon');
  } finally {
    setCouponLoading(false);
  }
};

  const handleApplyCoupon = () => autoApplyCoupon(couponInput);

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponInput('');
    setCouponError('');
  };

  // ── Price calculations ────────────────────────────────────
  const subtotal    = cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
  const discountAmt = couponData ? parseFloat(((subtotal * couponData.discount) / 100).toFixed(2)) : 0;
  const total       = subtotal - discountAmt + DELIVERY_CHARGE;

  // ── Place order ───────────────────────────────────────────
  const handlePlaceOrder = async () => {
      const missingSizes = cartItems.filter(
    item => item.product?.sizes?.length > 0 && !selectedSizes[item.product._id]
  );
  if (missingSizes.length > 0) {
    setError(`Please select a size for: ${missingSizes.map(i => i.product.name).join(', ')}`);
    return;
  }

  setOrderLoading(true);
  setError('');
    try {
      const products = cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
          size:      selectedSizes[item.product._id] || null,
      }));
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          products,
          couponCode:     couponData?.code || null,
          discountAmount: discountAmt,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setOrderSuccess(true);
        setOrderDetails(result);
        setCartItems([]);
      } else {
        setError(result.message || 'Failed to place order');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Loading your cart...</p>
    </div>
  );

  // ── Order Success ─────────────────────────────────────────
  if (orderSuccess && orderDetails) return (
    <div style={styles.page}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>🎉</div>
        <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
        <p style={styles.successSubtitle}>Thank you for your purchase. Here are your order details:</p>

        <div style={styles.orderSummaryBox}>
          {[
            { label: 'Order ID', value: `#${orderDetails._id?.slice(-8).toUpperCase()}` },
            { label: 'Status',   value: orderDetails.status, badge: true },
            { label: 'Subtotal', value: `$${orderDetails.totalPrice?.toFixed(2)}` },
            ...(orderDetails.discountAmount > 0 ? [{
              label: `🏷️ Discount (${orderDetails.couponCode})`,
              value: `-$${orderDetails.discountAmount?.toFixed(2)}`,
              green: true,
            }] : []),
            { label: '🚚 Delivery', value: '$10.00' },
            { label: 'Total Paid',  value: `$${orderDetails.finalPrice?.toFixed(2)}`, bold: true },
            { label: 'Date', value: new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })
            },
          ].map((row, i) => (
            <div key={i} style={styles.orderInfoRow}>
              <span style={styles.orderInfoLabel}>{row.label}</span>
              <span style={{
                ...styles.orderInfoValue,
                ...(row.badge ? styles.statusBadge : {}),
                ...(row.bold  ? { fontWeight: '800', color: '#667eea', fontSize: '16px' } : {}),
                ...(row.green ? { color: '#166534', fontWeight: '700' } : {}),
              }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={styles.orderedItems}>
          <h3 style={styles.sectionTitle}>Items Ordered</h3>
         {orderDetails.products?.map((item, idx) => (
  <div key={idx} style={styles.orderedItem}>
    <span style={styles.orderedItemName}>
      {item.product?.name || `Product #${idx + 1}`}
      {item.size && (
        <span style={styles.orderedItemSize}> [{item.size}]</span>
      )}
    </span>
    <span style={styles.orderedItemQty}>x{item.quantity}</span>
    <span style={styles.orderedItemPrice}>
      ${item.product?.price ? (item.product.price * item.quantity).toFixed(2) : '—'}
    </span>
  </div>
))}
          <div style={styles.orderedItem}>
            <span style={styles.orderedItemName}>🚚 Delivery</span>
            <span style={styles.orderedItemQty} />
            <span style={styles.orderedItemPrice}>${DELIVERY_CHARGE.toFixed(2)}</span>
          </div>
        </div>

        <button style={styles.continueBtn} onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  // ── Main Cart UI ──────────────────────────────────────────
  return (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p style={styles.emptyIcon}>🛒</p>
          <p style={styles.emptyText}>Your cart is empty</p>
          <p style={styles.emptySubtext}>Add some products to get started</p>
          <button style={styles.continueBtn} onClick={() => navigate('/products')}>Browse Products</button>
        </div>
      ) : (
        <div style={styles.layout}>

          {/* ── Cart Table ── */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Subtotal</th>
                </tr>
              </thead>
            <tbody>
  {cartItems.map((item, idx) => (
    <tr key={idx} style={styles.tableRow}>

      {/* Product */}
      <td style={styles.td}>
        <div style={styles.productCell}>
          <img
            src={item.product?.image}
            alt={item.product?.name}
            style={styles.productImage}
            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60?text=N/A'; }}
          />
          <div>
            <p style={styles.productName}>{item.product?.name}</p>
            <p style={styles.productCategory}>{item.product?.category}</p>

            {/* ✅ Size selector — only show if product has sizes */}
            {item.product?.sizes?.length > 0 && (
              <div style={styles.sizeRow}>
                <span style={styles.sizeRowLabel}>Size:</span>
                <div style={styles.sizeBtns}>
                  {item.product.sizes.map(size => (
                    <button
                      key={size}
                      style={{
                        ...styles.sizeBtn,
                        ...(selectedSizes[item.product._id] === size
                          ? styles.sizeBtnActive
                          : {}),
                      }}
                      onClick={() => handleSizeChange(item.product._id, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Show selected size badge */}
            {selectedSizes[item.product._id] && (
              <span style={styles.selectedSizeBadge}>
                ✓ Size: {selectedSizes[item.product._id]}
              </span>
            )}

            {/* ✅ Warning if sizes exist but none selected */}
            {item.product?.sizes?.length > 0 && !selectedSizes[item.product._id] && (
              <span style={styles.sizeWarning}>⚠ Please select a size</span>
            )}
          </div>
        </div>
      </td>

      <td style={styles.td}>${item.product?.price?.toFixed(2)}</td>
      <td style={styles.td}><span style={styles.qtyBadge}>{item.quantity}</span></td>
      <td style={{ ...styles.td, fontWeight: '700', color: '#1a1a2e' }}>
        ${(item.product?.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>

          {/* ── Order Summary ── */}
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>

            {/* Festival coupon hint */}
            {currentCoupon && !couponData && (
              <div style={styles.couponHint}>
                <span style={styles.couponHintIcon}>🎁</span>
                <div>
                  <p style={styles.couponHintTitle}>Festival offer active!</p>
                  <p style={styles.couponHintSub}>
                    Use{' '}
                    <strong
                      style={styles.couponHintCode}
                      onClick={() => autoApplyCoupon(currentCoupon.code)}
                    >
                      {currentCoupon.code}
                    </strong>{' '}
                    for {currentCoupon.discount}% off
                  </p>
                </div>
              </div>
            )}

            {/* Coupon input / applied */}
            <div style={styles.couponSection}>
              <p style={styles.couponLabel}>🏷️ Apply Coupon</p>

              {couponData ? (
                <div style={styles.appliedCoupon}>
                  <div style={styles.appliedLeft}>
                    <span style={styles.appliedIcon}>✅</span>
                    <div>
                      <p style={styles.appliedCode}>{couponData.code}</p>
                      <p style={styles.appliedDesc}>{couponData.description} — {couponData.discount}% OFF</p>
                    </div>
                  </div>
                  <button style={styles.removeCouponBtn} onClick={handleRemoveCoupon}>✕</button>
                </div>
              ) : (
                <div style={styles.couponInputRow}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    style={styles.couponInput}
                  />
                  <button
                    style={{ ...styles.applyBtn, opacity: couponLoading ? 0.7 : 1, cursor: couponLoading ? 'not-allowed' : 'pointer' }}
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}

              {couponError && <p style={styles.couponError}>⚠️ {couponError}</p>}
            </div>

            <hr style={styles.summaryDivider} />

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</span>
              <span style={styles.summaryValue}>${subtotal.toFixed(2)}</span>
            </div>

            {couponData && (
              <div style={styles.summaryRow}>
                <span style={{ ...styles.summaryLabel, color: '#166534' }}>
                  🏷️ Discount ({couponData.discount}%)
                </span>
                <span style={{ ...styles.summaryValue, color: '#166534', fontWeight: '700' }}>
                  −${discountAmt.toFixed(2)}
                </span>
              </div>
            )}

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>🚚 Delivery</span>
              <span style={styles.summaryValue}>${DELIVERY_CHARGE.toFixed(2)}</span>
            </div>

            <hr style={styles.summaryDivider} />

            <div style={styles.summaryRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>${total.toFixed(2)}</span>
            </div>

            {couponData && (
              <div style={styles.savingsRow}>
                🎉 You save ${discountAmt.toFixed(2)} with this order!
              </div>
            )}

{error && (
  <div style={styles.errorMsg}>
    <p style={{ margin: '0 0 8px' }}>⚠️ {error}</p>
    {error.includes('address') && (
      <button
        style={styles.addAddressBtn}
        onClick={() => navigate('/profile')}
      >
        📍 Add Address in Profile
      </button>
    )}
  </div>
)}
            <button
              style={{ ...styles.orderBtn, opacity: orderLoading ? 0.7 : 1, cursor: orderLoading ? 'not-allowed' : 'pointer' }}
              onClick={handlePlaceOrder}
              disabled={orderLoading}
            >
              {orderLoading ? 'Placing Order...' : '✅ Place Order'}
            </button>

            <button style={styles.continueShoppingBtn} onClick={() => navigate('/products')}>
              ← Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

const styles = {
  page: { flexGrow: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', fontFamily: "'Segoe UI', sans-serif", width: '100%' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', marginBottom: '28px' },
  centered: { flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '12px', fontFamily: "'Segoe UI', sans-serif" },
  spinner: { width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loadingText: { color: '#888', fontSize: '14px' },
  layout: { display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' },
  tableWrapper: { flex: 2, minWidth: '300px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: 'linear-gradient(135deg, #667eea, #764ba2)' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#555', verticalAlign: 'middle' },
  productCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  productImage: { width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', background: '#f8f9fa' },
  productName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  productCategory: { fontSize: '12px', color: '#aaa', margin: '2px 0 0' },
  qtyBadge: { background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: '#1a1a2e' },
  summaryCard: { flex: 1, minWidth: '280px', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '14px' },
  summaryTitle: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: '14px', color: '#666' },
  summaryValue: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  summaryDivider: { border: 'none', borderTop: '2px dashed #e5e7eb', margin: '4px 0' },
  totalLabel: { fontSize: '16px', fontWeight: '800', color: '#1a1a2e' },
  totalValue: { fontSize: '22px', fontWeight: '800', color: '#667eea' },
  savingsRow: { background: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  couponHint: { background: 'linear-gradient(135deg, #fef9c3, #fef3c7)', border: '1px dashed #f59e0b', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' },
  couponHintIcon: { fontSize: '20px', flexShrink: 0 },
  couponHintTitle: { fontSize: '13px', fontWeight: '700', color: '#92400e', margin: '0 0 2px' },
  couponHintSub: { fontSize: '12px', color: '#78350f', margin: 0 },
  couponHintCode: { cursor: 'pointer', textDecoration: 'underline', color: '#b45309', letterSpacing: '1px' },
  couponSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  couponLabel: { fontSize: '13px', fontWeight: '700', color: '#444', margin: 0 },
  couponInputRow: { display: 'flex', gap: '8px' },
  couponInput: { flex: 1, padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: "'Segoe UI', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1a2e' },
  applyBtn: { padding: '10px 16px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif", whiteSpace: 'nowrap' },
  appliedCoupon: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '10px 14px' },
  appliedLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  appliedIcon: { fontSize: '18px' },
  appliedCode: { fontSize: '14px', fontWeight: '800', color: '#166534', margin: 0, letterSpacing: '1px' },
  appliedDesc: { fontSize: '12px', color: '#4ade80', margin: '2px 0 0' },
  removeCouponBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' },
  couponError: { color: '#e53e3e', fontSize: '12px', margin: 0, background: '#fff5f5', padding: '6px 10px', borderRadius: '6px' },
  errorMsg: { color: '#e53e3e', fontSize: '13px', background: '#fff5f5', padding: '10px 14px', borderRadius: '8px', margin: 0 },
  orderBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  continueShoppingBtn: { width: '100%', padding: '12px', background: 'transparent', color: '#667eea', border: '2px solid #667eea', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  emptyCart: { textAlign: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: '64px', margin: '0 0 8px' },
  emptyText: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 6px' },
  emptySubtext: { fontSize: '14px', color: '#888', margin: '0 0 24px' },
  continueBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  successCard: { maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', textAlign: 'center' },
  successIcon: { fontSize: '56px', marginBottom: '12px' },
  successTitle: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  successSubtitle: { fontSize: '14px', color: '#888', margin: '0 0 24px' },
  orderSummaryBox: { background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' },
  orderInfoRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' },
  orderInfoLabel: { fontSize: '13px', color: '#888' },
  orderInfoValue: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e' },
  statusBadge: { background: '#dcfce7', color: '#166534', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' },
  orderedItems: { textAlign: 'left', marginBottom: '24px' },
  sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e', marginBottom: '12px' },
  orderedItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' },
  orderedItemName: { color: '#1a1a2e', flex: 2 },
  orderedItemQty: { color: '#888', flex: 1, textAlign: 'center' },
  orderedItemPrice: { fontWeight: '700', color: '#667eea', flex: 1, textAlign: 'right' },
  // Add to styles:
sizeRow: {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '6px',
  flexWrap: 'wrap',
},
sizeRowLabel: {
  fontSize: '11px',
  fontWeight: '700',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  flexShrink: 0,
},
sizeBtns: {
  display: 'flex',
  gap: '4px',
  flexWrap: 'wrap',
},
sizeBtn: {
  padding: '3px 8px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '6px',
  background: '#fff',
  fontSize: '11px',
  fontWeight: '700',
  color: '#555',
  cursor: 'pointer',
  fontFamily: "'Segoe UI', sans-serif",
  transition: 'all 0.15s',
},
sizeBtnActive: {
  border: '1.5px solid #667eea',
  background: '#667eea',
  color: '#fff',
},
selectedSizeBadge: {
  display: 'inline-block',
  marginTop: '4px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#166534',
  background: '#dcfce7',
  padding: '2px 8px',
  borderRadius: '20px',
},
sizeWarning: {
  display: 'inline-block',
  marginTop: '4px',
  fontSize: '11px',
  fontWeight: '600',
  color: '#92400e',
  background: '#fef9c3',
  padding: '2px 8px',
  borderRadius: '20px',
},
orderedItemSize: {
  fontSize: '12px',
  color: '#667eea',
  fontWeight: '600',
},
// Add to styles:
addAddressBtn: {
  width: '100%',
  padding: '8px',
  background: '#667eea',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: "'Segoe UI', sans-serif",
  marginTop: '4px',
},
};