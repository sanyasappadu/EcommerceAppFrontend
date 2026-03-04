import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_URL } from '../config';
// const url = "http://localhost:4000";

const SEASONS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December','All Year'
];

const SEASON_PRESETS = {
  January:   { name: "🎇 Happy New Year!", subtitle: "Start the year with amazing deals!", gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", accent: "#e94560", emoji: ["✨","🎆","🎇","🥂","🎊"], code: "NEW" },
  February:  { name: "💝 Happy Valentine's Day!", subtitle: "Share the love — Romantic deals await!", gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)", accent: "#fff", emoji: ["💝","💖","🌹","💌","🍫"], code: "LOVE" },
  March:     { name: "🌈 Happy Holi!", subtitle: "Play with colors, shop with joy!", gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 30%, #48dbfb 60%, #ff9ff3 100%)", accent: "#1a1a2e", emoji: ["🌈","🎨","💦","🌸","🥳"], code: "HOLI" },
  April:     { name: "🌸 Spring Sale!", subtitle: "Fresh season, fresh deals — Bloom into savings!", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)", accent: "#fff", emoji: ["🌸","🌷","🦋","🌼","🌿"], code: "SPRING" },
  May:       { name: "🌙 Eid Mubarak!", subtitle: "Celebrate with exclusive festive offers!", gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", accent: "#ffd700", emoji: ["🌙","⭐","🌹","💐","🎁"], code: "EID" },
  June:      { name: "☀️ Summer Mega Sale!", subtitle: "Hot deals for hot days — Up to 60% OFF!", gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", accent: "#1a1a2e", emoji: ["☀️","🏖️","🌊","🍦","🕶️"], code: "SUMMER" },
  July:      { name: "🇮🇳 Independence Day!", subtitle: "Celebrate freedom with patriotic deals!", gradient: "linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)", accent: "#000080", emoji: ["🇮🇳","🎉","✨","🥳","🎊"], code: "INDIA" },
  August:    { name: "🎀 Happy Raksha Bandhan!", subtitle: "Celebrate bonds with festive gifts!", gradient: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)", accent: "#ffd700", emoji: ["🎀","💛","🌺","🎁","🥥"], code: "RAKHI" },
  September: { name: "🐘 Ganesh Chaturthi!", subtitle: "Blessings & Big Deals — Ganpati Bappa!", gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%)", accent: "#8b0000", emoji: ["🐘","🪔","🌺","🍬","✨"], code: "GANPATI" },
  October:   { name: "🎃 Navratri & Halloween!", subtitle: "Garba nights & spooky savings!", gradient: "linear-gradient(135deg, #eb5757 0%, #000000 100%)", accent: "#ff8c00", emoji: ["🎃","🕷️","🪔","💃","🌙"], code: "SPOOKY" },
  November:  { name: "🪔 Happy Diwali!", subtitle: "Festival of lights — Biggest sale of the year!", gradient: "linear-gradient(135deg, #7c3700 0%, #c85000 50%, #ff8c00 100%)", accent: "#ffd700", emoji: ["🪔","✨","🎆","🌟","🪅"], code: "DIWALI" },
  December:  { name: "🎄 Merry Christmas!", subtitle: "Season's greetings — Holiday deals await!", gradient: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)", accent: "#ff6b6b", emoji: ["🎄","🎅","⭐","🎁","❄️"], code: "XMAS" },
  'All Year':{ name: "🎉 Mega Sale!", subtitle: "Shop your favorites — Limited time offers!", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", accent: "#ffd700", emoji: ["🎉","🛍️","💥","🔥","⚡"], code: "SALE" },
};

const EMOJI_OPTIONS = ["🎉","🎊","🎁","🎃","🎄","🎆","🎇","🪔","🌈","💝","💖","🌹","☀️","🌸","🌙","⭐","🏖️","🎀","🐘","🇮🇳","🛍️","💥","🔥","⚡","✨","🥂","🎨","💦","🌺","🍬","🕷️","💃","🌊","🦋","🌷","🌼","💌","🍫","🥥","🌿","🎅","❄️","🎁","🥳"];

export default function SellerCreateFestivalOffer() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name:        '',
    subtitle:    '',
    code:        '',
    discount:    '20',
    gradient:    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent:      '#ffffff',
    emoji:       ['🎉', '✨', '🛍️'],
    season:      '',
    isActive:    true,
    startDate:   today,
    endDate:     '',
    usageLimit:  '',
    hasDateRange: false,
    hasUsageLimit: false,
  });

  const [gradientFrom, setGradientFrom] = useState('#667eea');
  const [gradientTo,   setGradientTo]   = useState('#764ba2');
  const [gradientDir,  setGradientDir]  = useState('135deg');

  // Apply season preset
  const applyPreset = (season) => {
    const preset = SEASON_PRESETS[season];
    if (!preset) return;

    // Calculate default date range for season
    const year  = new Date().getFullYear();
    const month = SEASONS.indexOf(season);
    let startDate = today;
    let endDate   = '';

    if (season !== 'All Year' && month >= 0) {
      const lastDay = new Date(year, month + 1, 0).getDate();
      startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      endDate   = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`;
    }

    // Parse gradient colors
    const fromMatch = preset.gradient.match(/#[a-fA-F0-9]{6}/);
    const toMatch   = preset.gradient.match(/#[a-fA-F0-9]{6}/g);
    if (fromMatch) setGradientFrom(fromMatch[0]);
    if (toMatch && toMatch[1]) setGradientTo(toMatch[toMatch.length - 1]);

    setForm(prev => ({
      ...prev,
      season,
      name:       preset.name,
      subtitle:   preset.subtitle,
      gradient:   preset.gradient,
      accent:     preset.accent,
      emoji:      preset.emoji,
      code:       `${preset.code}${prev.discount || '20'}`,
      startDate,
      endDate,
      hasDateRange: season !== 'All Year',
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError('');
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const updateGradient = (from, to, dir) => {
    const g = `linear-gradient(${dir}, ${from} 0%, ${to} 100%)`;
    setForm(prev => ({ ...prev, gradient: g }));
  };

  const handleGradientFrom = (v) => { setGradientFrom(v); updateGradient(v, gradientTo, gradientDir); };
  const handleGradientTo   = (v) => { setGradientTo(v);   updateGradient(gradientFrom, v, gradientDir); };
  const handleGradientDir  = (v) => { setGradientDir(v);  updateGradient(gradientFrom, gradientTo, v); };

  const toggleEmoji = (e) => {
    setForm(prev => ({
      ...prev,
      emoji: prev.emoji.includes(e)
        ? prev.emoji.filter(x => x !== e)
        : prev.emoji.length < 5
          ? [...prev.emoji, e]
          : prev.emoji,
    }));
  };

  const validate = () => {
    if (!form.name.trim())     return 'Offer name is required';
    if (!form.subtitle.trim()) return 'Subtitle is required';
    if (!form.code.trim())     return 'Coupon code is required';
    if (!form.discount || form.discount < 1 || form.discount > 100) return 'Discount must be 1–100%';
    if (!form.season)          return 'Season is required';
    if (form.hasDateRange) {
      if (!form.startDate)     return 'Start date is required';
      if (!form.endDate)       return 'End date is required';
      if (new Date(form.startDate) > new Date(form.endDate)) return 'End date must be after start date';
    }
    if (form.emoji.length === 0) return 'Select at least one emoji';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    setError('');
    try {
      const payload = {
        name:       form.name.trim(),
        subtitle:   form.subtitle.trim(),
        code:       form.code.trim().toUpperCase(),
        discount:   Number(form.discount),
        gradient:   form.gradient,
        accent:     form.accent,
        emoji:      form.emoji,
        season:     form.season,
        isActive:   form.isActive,
        startDate:  form.hasDateRange ? form.startDate : null,
        endDate:    form.hasDateRange ? form.endDate   : null,
        usageLimit: form.hasUsageLimit && form.usageLimit ? Number(form.usageLimit) : null,
      };

      const res = await fetch(`${API_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('✅ Festival offer created successfully!');
        setTimeout(() => navigate('/seller/dashboard'), 1500);
      } else {
        setError(data.message || 'Failed to create offer');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Live banner preview
  const BannerPreview = () => (
    <div style={{ ...styles.bannerPreview, background: form.gradient }}>
      <div style={styles.bannerFloating}>
        {form.emoji.map((e, i) => (
          <span key={i} style={{ ...styles.floatEmoji, left: `${15 + i * 18}%`, animationDelay: `${i * 0.6}s` }}>{e}</span>
        ))}
      </div>
      <div style={styles.bannerContent}>
        <span style={{ ...styles.bannerBadge, background: form.accent, color: '#1a1a2e' }}>🔥 Limited Time</span>
        <h3 style={styles.bannerTitle}>{form.name || 'Your Festival Name'}</h3>
        <p style={styles.bannerSubtitle}>{form.subtitle || 'Your subtitle here...'}</p>
        <div style={styles.bannerCodeRow}>
          <span style={styles.bannerCodeLabel}>Use code:</span>
          <span style={{ ...styles.bannerCode, borderColor: form.accent, color: form.accent }}>
            {form.code || 'YOURCODE'}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes floatUp {
          0%,100% { transform: translateY(0) rotate(0deg); opacity:.8; }
          50%      { transform: translateY(-16px) rotate(8deg); opacity:1; }
        }
      `}</style>
    </div>
  );

  return (
    <div style={styles.page}>

      <button style={styles.backBtn} onClick={() => navigate('/seller/dashboard')}>
        ← Back to Dashboard
      </button>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>🎉 Create Festival Offer</h1>
          <p style={styles.pageSubtitle}>Design a festive discount campaign for your customers</p>
        </div>
      </div>

      {success && <div style={styles.successMsg}>{success}</div>}
      {error   && <div style={styles.errorMsg}>⚠️ {error}</div>}

      <div style={styles.layout}>

        {/* ══ LEFT FORM ══ */}
        <div style={styles.formCol}>

          {/* Season & Presets */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📅 Season & Festival</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Season *</label>
              <select
                name="season"
                value={form.season}
                onChange={e => { handleChange(e); applyPreset(e.target.value); }}
                style={styles.select}
              >
                <option value="">— Pick a season to auto-fill —</option>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <p style={styles.hint}>Selecting a season auto-fills all fields with a preset</p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Offer Name *</label>
              <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="e.g. 🎃 Navratri & Halloween Deals!" />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Subtitle *</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} style={styles.input} placeholder="e.g. Garba nights & spooky savings!" />
            </div>
          </div>

          {/* Coupon & Discount */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🏷️ Coupon & Discount</h3>
            <div style={styles.twoCol}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Coupon Code *</label>
                <input
                  name="code"
                  value={form.code}
                  onChange={e => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  style={{ ...styles.input, letterSpacing: '2px', fontWeight: '700' }}
                  placeholder="FEST50"
                  maxLength={20}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Discount % *</label>
                <div style={styles.discountWrapper}>
                  <input
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingRight: '36px', fontWeight: '800', fontSize: '16px' }}
                    type="number" min="1" max="100"
                    placeholder="20"
                  />
                  <span style={styles.discountSuffix}>%</span>
                </div>
                <div style={styles.discountQuick}>
                  {[10, 20, 25, 30, 40, 50].map(v => (
                    <button key={v} type="button"
                      style={{ ...styles.quickChip, ...(Number(form.discount) === v ? styles.quickChipActive : {}) }}
                      onClick={() => setForm(prev => ({ ...prev, discount: String(v) }))}
                    >{v}%</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Time Period */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>⏰ Time Period</h3>

            <label style={styles.toggleRow}>
              <div style={styles.toggleLeft}>
                <span style={styles.toggleTitle}>Set date range</span>
                <span style={styles.toggleDesc}>Offer will only be valid between these dates</span>
              </div>
              <div
                style={{ ...styles.toggle, background: form.hasDateRange ? '#667eea' : '#e5e7eb' }}
                onClick={() => setForm(prev => ({ ...prev, hasDateRange: !prev.hasDateRange }))}
              >
                <div style={{ ...styles.toggleDot, transform: form.hasDateRange ? 'translateX(20px)' : 'translateX(2px)' }} />
              </div>
            </label>

            {form.hasDateRange && (
              <div style={styles.twoCol}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Start Date *</label>
                  <input name="startDate" value={form.startDate} onChange={handleChange} style={styles.input} type="date" min={today} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>End Date *</label>
                  <input name="endDate" value={form.endDate} onChange={handleChange} style={styles.input} type="date" min={form.startDate || today} />
                </div>
              </div>
            )}

            {/* Duration preview */}
            {form.hasDateRange && form.startDate && form.endDate && (
              <div style={styles.durationBadge}>
                📅 Offer runs for{' '}
                <strong>
                  {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days
                </strong>
                {' '}· {new Date(form.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                {' '}→ {new Date(form.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            )}

            {!form.hasDateRange && (
              <div style={styles.noDateNote}>
                🔄 No date range set — offer is active until manually deactivated
              </div>
            )}

            <hr style={styles.divider} />

            <label style={styles.toggleRow}>
              <div style={styles.toggleLeft}>
                <span style={styles.toggleTitle}>Limit usage</span>
                <span style={styles.toggleDesc}>Set max number of times this coupon can be used</span>
              </div>
              <div
                style={{ ...styles.toggle, background: form.hasUsageLimit ? '#667eea' : '#e5e7eb' }}
                onClick={() => setForm(prev => ({ ...prev, hasUsageLimit: !prev.hasUsageLimit }))}
              >
                <div style={{ ...styles.toggleDot, transform: form.hasUsageLimit ? 'translateX(20px)' : 'translateX(2px)' }} />
              </div>
            </label>

            {form.hasUsageLimit && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Max Uses</label>
                <input name="usageLimit" value={form.usageLimit} onChange={handleChange} style={{ ...styles.input, maxWidth: '160px' }} type="number" min="1" placeholder="e.g. 100" />
              </div>
            )}

            <hr style={styles.divider} />

            <label style={styles.toggleRow}>
              <div style={styles.toggleLeft}>
                <span style={styles.toggleTitle}>Activate immediately</span>
                <span style={styles.toggleDesc}>Offer goes live as soon as it's created</span>
              </div>
              <div
                style={{ ...styles.toggle, background: form.isActive ? '#22c55e' : '#e5e7eb' }}
                onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
              >
                <div style={{ ...styles.toggleDot, transform: form.isActive ? 'translateX(20px)' : 'translateX(2px)' }} />
              </div>
            </label>
          </div>

          {/* Appearance */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎨 Appearance</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Banner Gradient</label>
              <div style={styles.gradientRow}>
                <div style={styles.colorPickerGroup}>
                  <span style={styles.colorLabel}>From</span>
                  <input type="color" value={gradientFrom} onChange={e => handleGradientFrom(e.target.value)} style={styles.colorInput} />
                  <span style={styles.colorHex}>{gradientFrom}</span>
                </div>
                <span style={styles.gradientArrow}>→</span>
                <div style={styles.colorPickerGroup}>
                  <span style={styles.colorLabel}>To</span>
                  <input type="color" value={gradientTo} onChange={e => handleGradientTo(e.target.value)} style={styles.colorInput} />
                  <span style={styles.colorHex}>{gradientTo}</span>
                </div>
              </div>
              <div style={styles.gradientDirRow}>
                {['90deg','135deg','180deg','45deg'].map(d => (
                  <button key={d} type="button"
                    style={{ ...styles.dirBtn, ...(gradientDir === d ? styles.dirBtnActive : {}) }}
                    onClick={() => handleGradientDir(d)}
                  >
                    {d === '90deg' ? '→' : d === '135deg' ? '↘' : d === '180deg' ? '↓' : '↗'}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Accent Color</label>
              <div style={styles.accentRow}>
                <input type="color" value={form.accent === '#fff' || form.accent === '#ffffff' ? '#ffffff' : form.accent} onChange={e => setForm(prev => ({ ...prev, accent: e.target.value }))} style={styles.colorInput} />
                <span style={styles.colorHex}>{form.accent}</span>
                {['#ffffff','#ffd700','#ff8c00','#1a1a2e','#e94560','#000080'].map(c => (
                  <div key={c} style={{ ...styles.accentChip, background: c, outline: form.accent === c ? '2px solid #667eea' : 'none' }} onClick={() => setForm(prev => ({ ...prev, accent: c }))} />
                ))}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Emojis (pick up to 5)</label>
              <div style={styles.emojiGrid}>
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} type="button"
                    style={{ ...styles.emojiBtn, ...(form.emoji.includes(e) ? styles.emojiBtnActive : {}) }}
                    onClick={() => toggleEmoji(e)}
                  >{e}</button>
                ))}
              </div>
              {form.emoji.length > 0 && (
                <p style={styles.selectedEmoji}>Selected: {form.emoji.join(' ')}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button style={styles.cancelBtn} onClick={() => navigate('/seller/dashboard')}>Cancel</button>
            <button
              style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Creating...' : '🚀 Launch Offer'}
            </button>
          </div>
        </div>

        {/* ══ RIGHT PREVIEW ══ */}
        <div style={styles.previewCol}>
          <div style={styles.previewSticky}>
            <h3 style={styles.previewTitle}>👁️ Live Banner Preview</h3>
            <p style={styles.previewSubtitle}>Customers will see this on the shop & login page</p>

            <BannerPreview />

            {/* Summary card */}
            <div style={styles.summaryCard}>
              <p style={styles.summaryTitle}>Offer Summary</p>
              {[
                { label: 'Code',     value: form.code     || '—', mono: true },
                { label: 'Discount', value: form.discount ? `${form.discount}%` : '—', bold: true, color: '#166534' },
                { label: 'Season',   value: form.season   || '—' },
                { label: 'Status',   value: form.isActive ? '🟢 Active' : '⭕ Inactive' },
                ...(form.hasDateRange && form.startDate && form.endDate ? [{
                  label: 'Valid',
                  value: `${new Date(form.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})} – ${new Date(form.endDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`
                }] : [{ label: 'Valid', value: 'Always active' }]),
                ...(form.hasUsageLimit && form.usageLimit ? [{ label: 'Max uses', value: form.usageLimit }] : [{ label: 'Max uses', value: 'Unlimited' }]),
              ].map((row, i) => (
                <div key={i} style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>{row.label}</span>
                  <span style={{
                    ...styles.summaryValue,
                    ...(row.mono  ? { fontFamily: 'monospace', letterSpacing: '1px', fontWeight: '800' } : {}),
                    ...(row.bold  ? { fontWeight: '800' } : {}),
                    ...(row.color ? { color: row.color } : {}),
                  }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div style={styles.checklist}>
              {[
                { label: 'Offer name',  done: !!form.name.trim() },
                { label: 'Subtitle',    done: !!form.subtitle.trim() },
                { label: 'Coupon code', done: !!form.code.trim() },
                { label: 'Discount %',  done: !!form.discount && form.discount > 0 },
                { label: 'Season',      done: !!form.season },
                { label: 'Emoji',       done: form.emoji.length > 0 },
              ].map((item, i) => (
                <div key={i} style={styles.checkItem}>
                  <span style={{ ...styles.checkDot, background: item.done ? '#22c55e' : '#e5e7eb' }}>
                    {item.done ? '✓' : ''}
                  </span>
                  <span style={{ fontSize: '13px', color: item.done ? '#166534' : '#aaa', fontWeight: item.done ? '600' : '400' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
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
  formCol: { flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' },
  previewCol: { flex: 1, minWidth: '280px' },
  previewSticky: { position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1a1a2e', fontFamily: "'Segoe UI', sans-serif", boxSizing: 'border-box', width: '100%' },
  select: { padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1a1a2e', fontFamily: "'Segoe UI', sans-serif", background: '#fff', cursor: 'pointer' },
  hint: { fontSize: '11px', color: '#aaa', margin: 0, fontStyle: 'italic' },
  divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '4px 0' },

  // Discount
  discountWrapper: { position: 'relative' },
  discountSuffix: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', fontWeight: '800', color: '#667eea', pointerEvents: 'none' },
  discountQuick: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' },
  quickChip: { padding: '4px 10px', border: '1.5px solid #e5e7eb', borderRadius: '20px', background: '#fff', fontSize: '12px', fontWeight: '600', color: '#666', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  quickChipActive: { border: '1.5px solid #667eea', background: '#ede9fe', color: '#667eea' },

  // Toggle
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' },
  toggleLeft: { display: 'flex', flexDirection: 'column', gap: '2px' },
  toggleTitle: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  toggleDesc: { fontSize: '12px', color: '#888' },
  toggle: { width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 },
  toggleDot: { width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', transition: 'transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' },
  durationBadge: { background: '#ede9fe', color: '#5b21b6', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' },
  noDateNote: { background: '#f0fdf4', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' },

  // Gradient
  gradientRow: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  colorPickerGroup: { display: 'flex', alignItems: 'center', gap: '6px' },
  colorLabel: { fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase' },
  colorInput: { width: '36px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, background: 'none' },
  colorHex: { fontSize: '12px', color: '#666', fontFamily: 'monospace', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' },
  gradientArrow: { fontSize: '18px', color: '#aaa' },
  gradientDirRow: { display: 'flex', gap: '6px', marginTop: '8px' },
  dirBtn: { width: '36px', height: '36px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '16px', fontFamily: "'Segoe UI', sans-serif" },
  dirBtnActive: { border: '1.5px solid #667eea', background: '#ede9fe' },

  // Accent
  accentRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  accentChip: { width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', border: '2px solid #e5e7eb' },

  // Emoji
  emojiGrid: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  emojiBtn: { width: '36px', height: '36px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emojiBtnActive: { border: '1.5px solid #667eea', background: '#ede9fe' },
  selectedEmoji: { fontSize: '13px', color: '#667eea', fontWeight: '600', margin: '4px 0 0' },

  // Actions
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '12px 20px', background: 'transparent', border: '1.5px solid #e5e7eb', color: '#666', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  submitBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', fontFamily: "'Segoe UI', sans-serif" },

  // Preview
  previewTitle: { fontSize: '16px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  previewSubtitle: { fontSize: '12px', color: '#aaa', margin: 0 },
  bannerPreview: { borderRadius: '16px', padding: '28px 24px', position: 'relative', overflow: 'hidden', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
  bannerFloating: { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' },
  floatEmoji: { position: 'absolute', top: '8%', fontSize: '18px', animation: 'floatUp 3s ease-in-out infinite', userSelect: 'none' },
  bannerContent: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  bannerBadge: { fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' },
  bannerTitle: { fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' },
  bannerSubtitle: { fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: 0 },
  bannerCodeRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  bannerCodeLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  bannerCode: { fontSize: '14px', fontWeight: '800', padding: '3px 12px', borderRadius: '6px', border: '2px dashed', background: 'rgba(255,255,255,0.1)', letterSpacing: '2px' },

  // Summary
  summaryCard: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  summaryTitle: { fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5' },
  summaryLabel: { fontSize: '12px', color: '#888' },
  summaryValue: { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },

  // Checklist
  checklist: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px' },
  checkItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  checkDot: { width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff', flexShrink: 0, transition: 'background 0.2s' },
};