import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_URL } from '../config';
// const url = "http://localhost:4000";

const CATEGORIES = ['Electronics', 'Active Wear', 'Clothes', 'Shoes', 'Footwear'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const SAMPLE_IMAGES = {
  Electronics:   'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
  'Active Wear': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
  Clothes:       'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
  Shoes:         'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  Footwear:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
};

const DEFAULT_DESCRIPTIONS = {
  Electronics:   'High-quality electronic device with premium features and modern design.',
  'Active Wear': 'Comfortable and stylish activewear designed for performance and everyday use.',
  Clothes:       'Trendy and comfortable clothing made from high-quality materials.',
  Shoes:         'Stylish and comfortable footwear crafted for everyday wear.',
  Footwear:      'Durable and comfortable footwear suitable for all occasions.',
};

export default function SellerAddProduct() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const [form, setForm] = useState({
    name:        '',
    price:       '',
    description: '',
    category:    '',
    stock:       '10',
    image:       '',
    sizes:       [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');

    // Auto-fill image and description when category changes
    if (name === 'category') {
      setForm(prev => ({
        ...prev,
        category:    value,
        image:       prev.image       || SAMPLE_IMAGES[value]       || '',
        description: prev.description || DEFAULT_DESCRIPTIONS[value] || '',
      }));
      setImageError(false);
      return;
    }

    if (name === 'image') setImageError(false);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const validate = () => {
    if (!form.name.trim())        return 'Product name is required';
    if (!form.price || form.price <= 0) return 'Valid price is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.category)           return 'Category is required';
    if (!form.stock && form.stock !== '0') return 'Stock is required';
    if (!form.image.trim())       return 'Image URL is required';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name:        form.name.trim(),
          price:       Number(form.price),
          description: form.description.trim(),
          category:    form.category,
          stock:       Number(form.stock),
          image:       form.image.trim(),
          sizes:       form.sizes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('✅ Product created successfully!');
        setTimeout(() => navigate('/seller/dashboard'), 1500);
      } else {
        setError(data.message || 'Failed to create product');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({ name: '', price: '', description: '', category: '', stock: '10', image: '', sizes: [] });
    setError('');
    setSuccess('');
    setImageError(false);
  };

  return (
    <div style={styles.page}>

      {/* ── Back ── */}
      <button style={styles.backBtn} onClick={() => navigate('/seller/dashboard')}>
        ← Back to Dashboard
      </button>

      {/* ── Page Header ── */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>➕ Add New Product</h1>
          <p style={styles.pageSubtitle}>Fill in the details below to list a new product in your store</p>
        </div>
      </div>

      {/* ── Toast ── */}
      {success && <div style={styles.successMsg}>{success}</div>}
      {error   && <div style={styles.errorMsg}>⚠️ {error}</div>}

      <div style={styles.layout}>

        {/* ══ LEFT — Form ══ */}
        <div style={styles.formCard}>

          {/* Basic Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📝 Basic Information</h3>
            <div style={styles.formGrid}>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g. Premium Wireless Headphones"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                  <option value="">— Select Category —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }}
                  placeholder="Describe your product — materials, features, use case..."
                />
              </div>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Pricing & Stock */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💰 Pricing & Inventory</h3>
            <div style={styles.formGrid}>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Price (USD) *</label>
                <div style={styles.inputPrefix}>
                  <span style={styles.prefix}>$</span>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingLeft: '32px' }}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Initial Stock *</label>
                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  style={styles.input}
                  type="number"
                  min="0"
                  placeholder="0"
                />
                {/* Quick stock buttons */}
                <div style={styles.quickBtns}>
                  {[5, 10, 25, 50, 100].map(v => (
                    <button
                      key={v}
                      type="button"
                      style={{
                        ...styles.quickBtn,
                        ...(Number(form.stock) === v ? styles.quickBtnActive : {})
                      }}
                      onClick={() => setForm(prev => ({ ...prev, stock: String(v) }))}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Image */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🖼️ Product Image</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Image URL *</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                style={styles.input}
                placeholder="https://example.com/image.jpg"
              />
              <p style={styles.inputHint}>
                Tip: Select a category above to auto-fill a sample image URL
              </p>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Sizes */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📐 Sizes <span style={styles.optional}>(optional)</span></h3>
            <p style={styles.inputHint}>Select sizes if your product comes in multiple sizes</p>
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
            {form.sizes.length > 0 && (
              <p style={styles.selectedSizes}>
                Selected: {form.sizes.join(', ')}
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={styles.formActions}>
            <button style={styles.resetBtn} onClick={handleReset} type="button">
              🔄 Reset Form
            </button>
            <button style={styles.cancelBtn} onClick={() => navigate('/seller/dashboard')} type="button">
              Cancel
            </button>
            <button
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
              onClick={handleSubmit}
              disabled={saving}
              type="button"
            >
              {saving ? 'Creating...' : '🚀 Create Product'}
            </button>
          </div>
        </div>

        {/* ══ RIGHT — Live Preview ══ */}
        <div style={styles.previewPanel}>
          <h3 style={styles.previewTitle}>👁️ Live Preview</h3>
          <p style={styles.previewSubtitle}>This is how your product card will look</p>

          <div style={styles.previewCard}>
            {/* Image */}
            <div style={styles.previewImageWrapper}>
              {form.image && !imageError ? (
                <img
                  src={form.image}
                  alt="preview"
                  style={styles.previewImage}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={styles.previewImagePlaceholder}>
                  <span style={{ fontSize: '32px' }}>🖼️</span>
                  <p style={{ fontSize: '12px', color: '#aaa', margin: '4px 0 0' }}>
                    {imageError ? 'Invalid image URL' : 'Image preview'}
                  </p>
                </div>
              )}
              {form.category && (
                <span style={styles.previewCategoryBadge}>{form.category}</span>
              )}
            </div>

            {/* Info */}
            <div style={styles.previewBody}>
              <h4 style={styles.previewName}>
                {form.name || <span style={{ color: '#ccc' }}>Product Name</span>}
              </h4>
              <p style={styles.previewDesc}>
                {form.description
                  ? form.description.slice(0, 80) + (form.description.length > 80 ? '...' : '')
                  : <span style={{ color: '#ccc' }}>Product description will appear here...</span>
                }
              </p>

              {form.sizes.length > 0 && (
                <div style={styles.previewSizes}>
                  {form.sizes.map(s => (
                    <span key={s} style={styles.previewSizeTag}>{s}</span>
                  ))}
                </div>
              )}

              <div style={styles.previewFooter}>
                <span style={styles.previewPrice}>
                  {form.price ? `$${Number(form.price).toFixed(2)}` : <span style={{ color: '#ccc' }}>$0.00</span>}
                </span>
                <span style={{
                  ...styles.previewStock,
                  background: Number(form.stock) === 0 ? '#fee2e2' : Number(form.stock) <= 5 ? '#fef9c3' : '#dcfce7',
                  color:      Number(form.stock) === 0 ? '#991b1b' : Number(form.stock) <= 5 ? '#854d0e' : '#166534',
                }}>
                  {Number(form.stock) === 0 ? '✗ Out of Stock' : `✓ ${form.stock} in stock`}
                </span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div style={styles.checklist}>
            <p style={styles.checklistTitle}>Completion checklist</p>
            {[
              { label: 'Product name',  done: !!form.name.trim() },
              { label: 'Category',      done: !!form.category },
              { label: 'Description',   done: !!form.description.trim() },
              { label: 'Price',         done: !!form.price && form.price > 0 },
              { label: 'Stock',         done: form.stock !== '' },
              { label: 'Image URL',     done: !!form.image.trim() && !imageError },
            ].map((item, i) => (
              <div key={i} style={styles.checkItem}>
                <span style={{ ...styles.checkDot, background: item.done ? '#22c55e' : '#e5e7eb' }}>
                  {item.done ? '✓' : ''}
                </span>
                <span style={{ ...styles.checkLabel, color: item.done ? '#166534' : '#aaa' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { flexGrow: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', fontFamily: "'Segoe UI', sans-serif", width: '100%' },
  backBtn: { background: 'none', border: 'none', color: '#667eea', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '0 0 20px', display: 'block', fontFamily: "'Segoe UI', sans-serif" },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#888', margin: 0 },
  successMsg: { background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', marginBottom: '16px' },
  errorMsg: { background: '#fff5f5', color: '#e53e3e', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', marginBottom: '16px' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  formCard: { flex: 2, minWidth: '320px', background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  section: { marginBottom: '4px' },
  sectionTitle: { fontSize: '16px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px' },
  optional: { fontSize: '12px', fontWeight: '400', color: '#aaa' },
  divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1a1a2e', fontFamily: "'Segoe UI', sans-serif", width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  inputHint: { fontSize: '11px', color: '#aaa', margin: '4px 0 0', fontStyle: 'italic' },
  inputPrefix: { position: 'relative' },
  prefix: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#888', fontWeight: '700', pointerEvents: 'none' },
  quickBtns: { display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' },
  quickBtn: { padding: '4px 10px', border: '1.5px solid #e5e7eb', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: '600', color: '#666', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  quickBtnActive: { border: '1.5px solid #667eea', background: '#ede9fe', color: '#667eea' },
  sizesRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  sizeBtn: { width: '48px', height: '48px', border: '2px solid #e5e7eb', borderRadius: '10px', background: '#fff', fontSize: '13px', fontWeight: '700', color: '#444', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif", transition: 'all 0.15s' },
  sizeBtnActive: { border: '2px solid #667eea', background: '#667eea', color: '#fff' },
  selectedSizes: { fontSize: '12px', color: '#667eea', fontWeight: '600', margin: '8px 0 0' },
  formActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px', flexWrap: 'wrap' },
  resetBtn: { padding: '11px 16px', background: 'transparent', border: '1.5px solid #e5e7eb', color: '#888', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  cancelBtn: { padding: '11px 16px', background: 'transparent', border: '1.5px solid #e5e7eb', color: '#666', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  saveBtn: { padding: '11px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', fontFamily: "'Segoe UI', sans-serif" },

  // Preview panel
  previewPanel: { flex: 1, minWidth: '260px', position: 'sticky', top: '24px' },
  previewTitle: { fontSize: '16px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  previewSubtitle: { fontSize: '12px', color: '#aaa', margin: '0 0 16px' },
  previewCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '16px' },
  previewImageWrapper: { position: 'relative', height: '170px', background: '#f8f9fa', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', objectFit: 'cover' },
  previewImagePlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' },
  previewCategoryBadge: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(102,126,234,0.9)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' },
  previewBody: { padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' },
  previewName: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  previewDesc: { fontSize: '12px', color: '#888', margin: 0, lineHeight: '1.4' },
  previewSizes: { display: 'flex', gap: '4px', flexWrap: 'wrap' },
  previewSizeTag: { fontSize: '11px', fontWeight: '600', color: '#667eea', border: '1px solid #667eea', padding: '2px 8px', borderRadius: '4px' },
  previewFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
  previewPrice: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e' },
  previewStock: { fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' },

  // Checklist
  checklist: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  checklistTitle: { fontSize: '13px', fontWeight: '700', color: '#444', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  checkItem: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  checkDot: { width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff', flexShrink: 0, transition: 'background 0.2s' },
  checkLabel: { fontSize: '13px', fontWeight: '500', transition: 'color 0.2s' },
};