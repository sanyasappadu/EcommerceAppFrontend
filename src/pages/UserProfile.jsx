import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_URL } from '../config';
// const url = "http://localhost:4000";
const DELIVERY_CHARGE = 10;

// ─── Address Form Component ───────────────────────────────────────────────────
const AddressForm = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: initial.name || '',
    street: initial.street || '',
    city: initial.city || '',
    state: initial.state || '',
    zipCode: initial.zipCode || '',
    country: initial.country || '',
    phone: initial.phone || '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div style={formStyles.wrapper}>
      <div style={formStyles.grid}>
        {[
          { name: 'name',    label: 'Full Name',    placeholder: 'Jane Doe' },
          { name: 'phone',   label: 'Phone',        placeholder: '+91 9876543210' },
          { name: 'street',  label: 'Street',       placeholder: '123 Main Street' },
          { name: 'city',    label: 'City',         placeholder: 'Mumbai' },
          { name: 'state',   label: 'State',        placeholder: 'Maharashtra' },
          { name: 'zipCode', label: 'ZIP Code',     placeholder: '400001' },
          { name: 'country', label: 'Country',      placeholder: 'India' },
        ].map(field => (
          <div key={field.name} style={formStyles.inputGroup}>
            <label style={formStyles.label}>{field.label}</label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              style={formStyles.input}
              required
            />
          </div>
        ))}
      </div>
      <div style={formStyles.actions}>
        <button
          style={formStyles.cancelBtn}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          style={{ ...formStyles.saveBtn, opacity: loading ? 0.7 : 1 }}
          onClick={() => onSubmit(form)}
          disabled={loading}
          type="button"
        >
          {loading ? 'Saving...' : '💾 Save Address'}
        </button>
      </div>
    </div>
  );
};

// ─── Main UserProfile Component ───────────────────────────────────────────────
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('profile');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // address object being edited
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // ── Fetch user profile ──
  useEffect(() => {
    if (!token || !user) { navigate('/login'); return; }
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user data');
        setUserData(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token, user, navigate]);

  // ── Fetch orders ──
  useEffect(() => {
    if (view !== 'orders' || !token) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/orders/my-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        setOrderData(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [view, token]);

  // ── Fetch addresses ──
  useEffect(() => {
    if (view !== 'addresses' || !token) return;
    fetchAddresses();
  }, [view, token]);

  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch addresses');
      setAddresses(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setAddressLoading(false);
    }
  };

  // ── Add new address ──
  const handleAddAddress = async (form) => {
    setFormLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add address');
      setShowAddForm(false);
      await fetchAddresses(); // refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Update address ──
  const handleUpdateAddress = async (form) => {
    setFormLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/addresses/${editingAddress._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update address');
      setEditingAddress(null);
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Make default ──
  const handleMakeDefault = async (addressId) => {
    try {
      const res = await fetch(`${API_URL}/api/addresses/${addressId}/default`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to set default');
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Delete address ──
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await fetch(`${API_URL}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete address');
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Loading profile...</p>
    </div>
  );

  if (error) return (
    <div style={styles.centered}>
      <p style={{ fontSize: '48px' }}>😕</p>
      <p style={styles.errorText}>{error}</p>
    </div>
  );

  return (
    <div style={styles.page}>

      {/* ── Header Card ── */}
      <div style={styles.headerCard}>
        <div style={styles.avatarCircle}>
          {userData?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={styles.headerInfo}>
          <h2 style={styles.headerName}>{userData?.name || 'User'}</h2>
          <p style={styles.headerEmail}>{userData?.email}</p>
          <span style={styles.roleBadge}>{userData?.role || user?.role}</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={styles.tabs}>
        {['profile', 'orders', 'addresses'].map(t => (
          <button
            key={t}
            style={{ ...styles.tab, ...(view === t ? styles.tabActive : {}) }}
            onClick={() => { setView(t); setShowAddForm(false); setEditingAddress(null); }}
          >
            {t === 'profile' ? '👤 Profile' : t === 'orders' ? '📦 Orders' : '📍 Addresses'}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          PROFILE TAB
      ══════════════════════════════════════════════════ */}
      {view === 'profile' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Account Details</h3>
          <div style={styles.detailsGrid}>
            {[
              { label: 'Full Name',    value: userData?.name },
              { label: 'Email',        value: userData?.email },
              { label: 'Role',         value: userData?.role || user?.role },
              { label: 'User ID',      value: userData?._id || user?.id, small: true },
              { label: 'Wishlist',     value: `${userData?.wishlist?.length || 0} items` },
              { label: 'Cart',         value: `${userData?.cart?.length || 0} items` },
            ].map(d => (
              <div key={d.label} style={styles.detailItem}>
                <span style={styles.detailLabel}>{d.label}</span>
                <span style={{ ...styles.detailValue, ...(d.small ? { fontSize: '12px', color: '#aaa' } : {}) }}>
                  {d.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ORDERS TAB
      ══════════════════════════════════════════════════ */}
      {view === 'orders' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>My Orders</h3>
          {ordersLoading ? (
            <div style={styles.centered}><div style={styles.spinner} /></div>
          ) : orderData.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ fontSize: '40px' }}>📦</p>
              <p style={styles.emptyText}>No orders yet</p>
              <button style={styles.actionBtn} onClick={() => navigate('/products')}>Start Shopping</button>
            </div>
          ) : (
            <div style={styles.list}>
              {orderData.map(order => (
                <div key={order._id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <p style={styles.orderId}>#{order._id?.slice(-8).toUpperCase()}</p>
                      <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Cancelled' ? '#fee2e2' : '#fef9c3',
                      color: order.status === 'Delivered' ? '#166534' : order.status === 'Cancelled' ? '#991b1b' : '#854d0e',
                    }}>{order.status}</span>
                  </div>
                  <div style={styles.orderItems}>
                    {order.products?.map((item, idx) => (
                      <div key={idx} style={styles.orderItem}>
                        <img src={item.product?.image} alt={item.product?.name}
                          style={styles.orderItemImg}
                          onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48?text=N/A'; }} />
                        <div style={{ flex: 1 }}>
                          <p style={styles.orderItemName}>{item.product?.name || 'Product'}</p>
                          <p style={styles.orderItemMeta}>Qty: {item.quantity}{item.size ? ` • Size: ${item.size}` : ''}</p>
                        </div>
                        <span style={styles.orderItemPrice}>
                          ${item.product?.price ? (item.product.price * item.quantity).toFixed(2) : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.orderFooter}>
                    <span style={styles.orderFooterLabel}>🚚 Delivery: $10.00</span>
                    <span style={styles.orderTotal}>Total: ${(order.totalPrice + DELIVERY_CHARGE).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ADDRESSES TAB
      ══════════════════════════════════════════════════ */}
      {view === 'addresses' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Saved Addresses</h3>
            {!showAddForm && !editingAddress && (
              <button style={styles.addBtn} onClick={() => setShowAddForm(true)}>
                + Add New Address
              </button>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div style={styles.formSection}>
              <h4 style={styles.formTitle}>➕ New Address</h4>
              <AddressForm
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddForm(false)}
                loading={formLoading}
              />
            </div>
          )}

          {/* Address List */}
          {addressLoading ? (
            <div style={styles.centered}><div style={styles.spinner} /></div>
          ) : addresses.length === 0 && !showAddForm ? (
            <div style={styles.emptyState}>
              <p style={{ fontSize: '40px' }}>📍</p>
              <p style={styles.emptyText}>No saved addresses</p>
              <button style={styles.actionBtn} onClick={() => setShowAddForm(true)}>Add Address</button>
            </div>
          ) : (
            <div style={styles.list}>
              {addresses.map(addr => (
                <div key={addr._id}>
                  {/* Edit Form */}
                  {editingAddress?._id === addr._id ? (
                    <div style={styles.formSection}>
                      <h4 style={styles.formTitle}>✏️ Edit Address</h4>
                      <AddressForm
                        initial={addr}
                        onSubmit={handleUpdateAddress}
                        onCancel={() => setEditingAddress(null)}
                        loading={formLoading}
                      />
                    </div>
                  ) : (
                    <div style={{ ...styles.addressCard, ...(addr.isDefault ? styles.addressCardDefault : {}) }}>
                      <div style={styles.addressTop}>
                        <div>
                          <div style={styles.addressNameRow}>
                            <p style={styles.addressName}>{addr.name}</p>
                            {addr.isDefault && <span style={styles.defaultBadge}>✓ Default</span>}
                          </div>
                          <p style={styles.addressLine}>{addr.street}</p>
                          <p style={styles.addressLine}>{addr.city}, {addr.state} {addr.zipCode}</p>
                          <p style={styles.addressLine}>{addr.country}</p>
                          <p style={styles.addressLine}>📞 {addr.phone}</p>
                        </div>
                      </div>
                      <div style={styles.addressActions}>
                        {!addr.isDefault && (
                          <button
                            style={styles.defaultBtn}
                            onClick={() => handleMakeDefault(addr._id)}
                          >
                            ☆ Set Default
                          </button>
                        )}
                        <button
                          style={styles.editBtn}
                          onClick={() => { setEditingAddress(addr); setShowAddForm(false); }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteAddress(addr._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: { flexGrow: 1, maxWidth: '800px', margin: '0 auto', padding: '32px 24px', fontFamily: "'Segoe UI', sans-serif", width: '100%' },
  centered: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px', fontFamily: "'Segoe UI', sans-serif" },
  spinner: { width: '36px', height: '36px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loadingText: { color: '#888', fontSize: '14px' },
  errorText: { fontSize: '15px', color: '#e53e3e' },
  headerCard: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
  avatarCircle: { width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', color: '#fff', flexShrink: 0 },
  headerInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  headerName: { fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' },
  headerEmail: { fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0 },
  roleBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', width: 'fit-content' },
  tabs: { display: 'flex', background: '#f3f4f6', borderRadius: '12px', padding: '4px', marginBottom: '24px', gap: '4px' },
  tab: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#888', fontFamily: "'Segoe UI', sans-serif", transition: 'all 0.2s' },
  tabActive: { background: '#fff', color: '#667eea', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px', background: '#f8f9fa', borderRadius: '10px' },
  detailLabel: { fontSize: '11px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' },
  detailValue: { fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  orderCard: { border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f8f9fa' },
  orderId: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  orderDate: { fontSize: '12px', color: '#aaa', margin: '2px 0 0' },
  statusBadge: { fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' },
  orderItems: { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  orderItemImg: { width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#f0f0f0', flexShrink: 0 },
  orderItemName: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e', margin: 0 },
  orderItemMeta: { fontSize: '12px', color: '#aaa', margin: '2px 0 0' },
  orderItemPrice: { fontSize: '14px', fontWeight: '700', color: '#667eea' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' },
  orderFooterLabel: { fontSize: '13px', color: '#888' },
  orderTotal: { fontSize: '16px', fontWeight: '800', color: '#1a1a2e' },
  addBtn: { padding: '8px 16px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  formSection: { background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  formTitle: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' },
  addressCard: { border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' },
  addressCardDefault: { border: '2px solid #667eea', background: '#fafbff' },
  addressTop: { flex: 1 },
  addressNameRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  addressName: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  defaultBadge: { fontSize: '11px', fontWeight: '700', color: '#166534', background: '#dcfce7', padding: '2px 10px', borderRadius: '20px' },
  addressLine: { fontSize: '13px', color: '#666', margin: '2px 0' },
  addressActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  defaultBtn: { padding: '6px 12px', background: 'transparent', border: '1px solid #667eea', color: '#667eea', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  editBtn: { padding: '6px 12px', background: '#f3f4f6', border: 'none', color: '#1a1a2e', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  deleteBtn: { padding: '6px 12px', background: '#fff5f5', border: 'none', color: '#e53e3e', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  emptyState: { textAlign: 'center', padding: '40px 0' },
  emptyText: { fontSize: '16px', color: '#888', margin: '8px 0 16px' },
  actionBtn: { padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
};

const formStyles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '16px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1a1a2e', fontFamily: "'Segoe UI', sans-serif" },
  actions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', border: '1.5px solid #e5e7eb', color: '#666', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  saveBtn: { padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
};