import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_URL } from '../config';

// const url = "http://localhost:4000";
const CATEGORIES = ['Electronics', 'Active Wear', 'Clothes', 'Shoes', 'Footwear'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function SellerProductEdit() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stockSaving, setStockSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'stock' ? 'stock' : 'details');

  // Form state
  const [form, setForm] = useState({
    name: '', price: '', description: '', category: '',
    image: '', sizes: [], stock: '',
  });
  const [newStock, setNewStock] = useState('');
  const [stockAction, setStockAction] = useState('set'); // 'set' | 'add'

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/products'); return; }
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();

      // Verify ownership
      if (data.seller?._id !== user.id && data.seller !== user.id) {
        navigate('/seller/dashboard');
        return;
      }

      setProduct(data);
      setForm({
        name:        data.name        || '',
        price:       data.price       || '',
        description: data.description || '',
        category:    data.category    || '',
        image:       data.image       || '',
        sizes:       data.sizes       || [],
        stock:       data.stock       || 0,
      });
      setNewStock(String(data.stock || 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSizeToggle = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name:        form.name,
          price:       Number(form.price),
          description: form.description,
          category:    form.category,
          image:       form.image,
          sizes:       form.sizes,
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProduct(data);
        setSuccess('✅ Product updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update product');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!newStock && newStock !== '0') return;
    setStockSaving(true);
    setError('');
    setSuccess('');
    try {
      const currentStock = product.stock || 0;
      const updatedStock = stockAction === 'add'
        ? currentStock + Number(newStock)
        : Number(newStock);

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stock: updatedStock })
      });
      const data = await res.json();
      if (res.ok) {
        setProduct(data);
        setForm(prev => ({ ...prev, stock: updatedStock }));
        setSuccess(`✅ Stock updated to ${updatedStock} units!`);
        setTimeout(() => setSuccess(''), 3000);
        if (stockAction === 'add') setNewStock('');
      } else {
        setError(data.message || 'Failed to update stock');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setStockSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product?.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) navigate('/seller/dashboard');
      else {
        const data = await res.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={styles.centered}>
      <p style={{ fontSize: '40px' }}>😕</p>
      <p style={styles.errorText}>Product not found</p>
      <button style={styles.backBtn} onClick={() => navigate('/seller/dashboard')}>← Back</button>
    </div>
  );

  const stockStatus = product.stock === 0 ? { label: 'Out of Stock', bg: '#fee2e2', color: '#991b1b' }
    : product.stock <= 5 ? { label: 'Low Stock', bg: '#fef9c3', color: '#854d0e' }
    : { label: 'In Stock', bg: '#dcfce7', color: '#166534' };

  return (
    <div style={styles.page}>

      {/* Back */}
      <button style={styles.backBtn} onClick={() => navigate('/seller/dashboard')}>
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderLeft}>
          <img
            src={product.image}
            alt={product.name}
            style={styles.headerImage}
            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80?text=N/A'; }}
          />
          <div>
            <h1 style={styles.pageTitle}>{product.name}</h1>
            <div style={styles.headerMeta}>
              <span style={styles.headerCategory}>{product.category}</span>
              <span style={{ ...styles.headerStock, background: stockStatus.bg, color: stockStatus.color }}>
                {stockStatus.label}: {product.stock} units
              </span>
            </div>
          </div>
        </div>
        <button style={styles.deleteBtn} onClick={handleDelete}>🗑️ Delete Product</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['details', 'stock'].map(tab => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'details' ? '✏️ Edit Details' : '📦 Update Stock'}
          </button>
        ))}
      </div>

      {/* Toast */}
      {success && <div style={styles.successMsg}>{success}</div>}
      {error   && <div style={styles.errorMsg}>⚠️ {error}</div>}

      {/* ══ DETAILS TAB ══ */}
      {activeTab === 'details' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Product Details</h3>
          <div style={styles.formGrid}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Product Name</label>
              <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="Product name" />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Price ($)</label>
              <input name="price" value={form.price} onChange={handleChange} style={styles.input} type="number" min="0" placeholder="0.00" />
            </div>

            <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }}
                placeholder="Product description"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} style={styles.input} placeholder="https://..." />
            </div>

            <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Sizes Available</label>
              <div style={styles.sizesRow}>
                {SIZES.map(size => (
                  <button
                    key={size}
                    type="button"
                    style={{
                      ...styles.sizeBtn,
                      ...(form.sizes.includes(size) ? styles.sizeBtnActive : {})
                    }}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Image preview */}
            {form.image && (
              <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Image Preview</label>
                <img
                  src={form.image}
                  alt="preview"
                  style={styles.imagePreview}
                  onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x150?text=Invalid+URL'; }}
                />
              </div>
            )}
          </div>

          <div style={styles.formActions}>
            <button style={styles.cancelBtn} onClick={() => navigate('/seller/dashboard')}>Cancel</button>
            <button
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
              onClick={handleSaveDetails}
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ══ STOCK TAB ══ */}
      {activeTab === 'stock' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Update Stock</h3>

          {/* Current stock display */}
          <div style={styles.currentStockBox}>
            <div style={styles.currentStockLeft}>
              <p style={styles.currentStockLabel}>Current Stock</p>
              <p style={{ ...styles.currentStockValue, color: stockStatus.color }}>
                {product.stock} units
              </p>
            </div>
            <span style={{ ...styles.stockStatusBadge, background: stockStatus.bg, color: stockStatus.color }}>
              {stockStatus.label}
            </span>
          </div>

          {/* Action selector */}
          <div style={styles.actionSelector}>
            <p style={styles.label}>Stock Action</p>
            <div style={styles.actionBtns}>
              <button
                style={{ ...styles.actionBtn, ...(stockAction === 'set' ? styles.actionBtnActive : {}) }}
                onClick={() => { setStockAction('set'); setNewStock(String(product.stock)); }}
              >
                🎯 Set to exact value
              </button>
              <button
                style={{ ...styles.actionBtn, ...(stockAction === 'add' ? styles.actionBtnActive : {}) }}
                onClick={() => { setStockAction('add'); setNewStock(''); }}
              >
                ➕ Add to current stock
              </button>
            </div>
          </div>

          {/* Stock input */}
          <div style={styles.stockInputSection}>
            <label style={styles.label}>
              {stockAction === 'set' ? 'New Stock Value' : 'Units to Add'}
            </label>
            <div style={styles.stockInputRow}>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={e => setNewStock(e.target.value)}
                style={{ ...styles.input, fontSize: '20px', fontWeight: '700', textAlign: 'center', maxWidth: '150px' }}
                placeholder="0"
              />
              {stockAction === 'add' && newStock && (
                <div style={styles.stockPreview}>
                  <span style={styles.stockPreviewLabel}>New total:</span>
                  <span style={styles.stockPreviewValue}>
                    {product.stock + Number(newStock)} units
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick set buttons */}
          <div style={styles.quickSet}>
            <p style={styles.label}>Quick Set</p>
            <div style={styles.quickBtns}>
              {[0, 10, 25, 50, 100].map(val => (
                <button
                  key={val}
                  style={styles.quickBtn}
                  onClick={() => { setStockAction('set'); setNewStock(String(val)); }}
                >
                  {val === 0 ? '❌ 0' : val}
                </button>
              ))}
            </div>
          </div>

          <button
            style={{
              ...styles.saveBtn,
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              opacity: stockSaving ? 0.7 : 1,
            }}
            onClick={handleUpdateStock}
            disabled={stockSaving}
          >
            {stockSaving ? 'Updating...' : '📦 Update Stock'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { flexGrow: 1, maxWidth: '800px', margin: '0 auto', padding: '32px 24px', fontFamily: "'Segoe UI', sans-serif", width: '100%' },
  centered: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '12px', fontFamily: "'Segoe UI', sans-serif" },
  spinner: { width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loadingText: { color: '#888', fontSize: '14px' },
  errorText: { color: '#e53e3e', fontSize: '15px' },
  backBtn: { background: 'none', border: 'none', color: '#667eea', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '0 0 20px', display: 'block', fontFamily: "'Segoe UI', sans-serif" },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  pageHeaderLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  headerImage: { width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', background: '#f8f9fa' },
  pageTitle: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 6px' },
  headerMeta: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  headerCategory: { fontSize: '12px', fontWeight: '700', color: '#667eea', background: '#ede9fe', padding: '3px 10px', borderRadius: '20px' },
  headerStock: { fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' },
  deleteBtn: { padding: '10px 16px', background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  tabs: { display: 'flex', background: '#f3f4f6', borderRadius: '12px', padding: '4px', marginBottom: '24px', gap: '4px' },
  tab: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#888', fontFamily: "'Segoe UI', sans-serif" },
  tabActive: { background: '#fff', color: '#667eea', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  successMsg: { background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', marginBottom: '16px' },
  errorMsg: { background: '#fff5f5', color: '#e53e3e', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1a1a2e', fontFamily: "'Segoe UI', sans-serif", width: '100%', boxSizing: 'border-box' },
  sizesRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  sizeBtn: { width: '44px', height: '44px', border: '2px solid #e5e7eb', borderRadius: '10px', background: '#fff', fontSize: '13px', fontWeight: '700', color: '#444', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  sizeBtnActive: { border: '2px solid #667eea', background: '#667eea', color: '#fff' },
  imagePreview: { width: '200px', height: '150px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e5e7eb' },
  formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  cancelBtn: { padding: '12px 20px', background: 'transparent', border: '1.5px solid #e5e7eb', color: '#666', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  saveBtn: { padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  currentStockBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' },
  currentStockLeft: {},
  currentStockLabel: { fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', margin: '0 0 4px' },
  currentStockValue: { fontSize: '28px', fontWeight: '800', margin: 0 },
  stockStatusBadge: { fontSize: '13px', fontWeight: '700', padding: '6px 14px', borderRadius: '20px' },
  actionSelector: { marginBottom: '20px' },
  actionBtns: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' },
  actionBtn: { padding: '10px 16px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: '600', color: '#666', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  actionBtnActive: { border: '1.5px solid #667eea', background: '#ede9fe', color: '#667eea' },
  stockInputSection: { marginBottom: '20px' },
  stockInputRow: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' },
  stockPreview: { display: 'flex', flexDirection: 'column', gap: '2px' },
  stockPreviewLabel: { fontSize: '11px', color: '#888', fontWeight: '600' },
  stockPreviewValue: { fontSize: '18px', fontWeight: '800', color: '#667eea' },
  quickSet: { marginBottom: '24px' },
  quickBtns: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' },
  quickBtn: { padding: '8px 16px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: '700', color: '#1a1a2e', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  headerBtns:             { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },

};