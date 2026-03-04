import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const CATEGORIES = [
  { label: '🏠 All Products', value: 'All' },
  { label: '📱 Electronics', value: 'Electronics' },
  { label: '👕 Clothes', value: 'Clothes' },
  { label: '🏃 Active Wear', value: 'Active Wear' },
  { label: '👟 Shoes', value: 'Shoes' },
];

const Navbar = () => {
  const { user, logout, isLoggedIn, selectCategory, setSearchQuery } = useAuth() || {};
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('🏠 All Products');
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const categoryRef = React.useRef(null);
  const profileRef  = React.useRef(null);

  const isSeller = user?.role === 'seller';

  React.useEffect(() => {
    const handler = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
      if (profileRef.current  && !profileRef.current.contains(e.target))  setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat.label);
    selectCategory(cat.value);
    setCategoryOpen(false);
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    setSearchQuery(val);
  };

  const handleCartClick = () => {
    isLoggedIn ? navigate('/cart') : navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate(isSeller ? '/seller/dashboard' : '/products');
    setProfileOpen(false);
  };

  const handleLogoClick = () => {
    navigate(isSeller ? '/seller/dashboard' : '/products');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* ── Logo ── */}
        <button style={styles.logoBtn} onClick={handleLogoClick}>
          🛍️ E-SHOP {isSeller && <span style={styles.sellerTag}>Seller</span>}
        </button>

        {/* ── Search Bar (visible for all roles) ── */}
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder={isSeller ? 'Search your products...' : 'Search products...'}
            value={searchValue}
            onChange={handleSearch}
            style={styles.searchInput}
          />
          {searchValue && (
            <button style={styles.clearBtn} onClick={() => { setSearchValue(''); setSearchQuery(''); }}>✕</button>
          )}
        </div>

        {/* ── Desktop Links ── */}
        <div style={styles.desktopLinks}>

          {/* Buyer only — category dropdown */}
          {!isSeller && (
            <div ref={categoryRef} style={styles.dropdownWrapper}>
              <button style={styles.dropdownTrigger} onClick={() => setCategoryOpen(!categoryOpen)}>
                {selectedCategory} <span style={{ fontSize: '10px' }}>▼</span>
              </button>
              {categoryOpen && (
                <div style={styles.dropdownMenu}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      style={styles.dropdownItem}
                      onClick={() => handleCategorySelect(cat)}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seller only — quick nav links */}
          {isSeller && (
            <>
              <button style={styles.navLink} onClick={() => navigate('/seller/dashboard')}>
                🏪 My Store
              </button>
              <button style={styles.navLink} onClick={() => navigate('/seller/add-product')}>
                ➕ Add Product
              </button>
              <button style={styles.festivalBtn} onClick={() => navigate('/seller/add-festivel-offer')}>
                🎉 Create Offer
              </button>
            </>
          )}
        </div>

        {/* ── Right Side ── */}
        <div style={styles.rightSide}>

          {/* Buyer only — wishlist & cart */}
          {!isSeller && isLoggedIn && (
            <button style={styles.navLink} onClick={() => navigate('/wishlist')}>
              🤍 Wishlist
            </button>
          )}
          {!isSeller && (
            <button style={styles.navLink} onClick={handleCartClick}>
              🛒 Cart
            </button>
          )}

          {/* Profile dropdown — both roles */}
          {user ? (
            <div ref={profileRef} style={styles.dropdownWrapper}>
              <button style={styles.avatarBtn} onClick={() => setProfileOpen(!profileOpen)}>
                <div style={{
                  ...styles.avatar,
                  background: isSeller ? 'rgba(255,200,0,0.3)' : 'rgba(255,255,255,0.3)'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span style={styles.userName}>{user.name || user.email}</span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>▼</span>
              </button>

              {profileOpen && (
                <div style={{ ...styles.dropdownMenu, right: 0, left: 'auto', minWidth: '200px' }}>

                  {/* Profile header */}
                  <div style={styles.profileHeader}>
                    <span style={styles.profileEmail}>{user.email}</span>
                    <span style={{
                      ...styles.roleBadge,
                      color: isSeller ? '#b45309' : '#667eea',
                      background: isSeller ? '#fef9c3' : '#ede9fe',
                    }}>
                      {isSeller ? '🏪 Seller' : '🛍️ Buyer'}
                    </span>
                  </div>

                  <hr style={styles.divider} />

                  {/* Buyer links */}
                  {!isSeller && (
                    <>
                      <button style={styles.dropdownItem}
                        onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        👤 My Profile
                      </button>
                      <button style={styles.dropdownItem}
                        onClick={() => { navigate('/cart'); setProfileOpen(false); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        🛒 My Cart
                      </button>
                      <button style={styles.dropdownItem}
                        onClick={() => { navigate('/wishlist'); setProfileOpen(false); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        🤍 Wishlist
                      </button>
                    </>
                  )}

                  {/* Seller links */}
                  {isSeller && (
                    <>
                      <button style={styles.dropdownItem}
                        onClick={() => { navigate('/seller/dashboard'); setProfileOpen(false); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        🏪 My Store
                      </button>
                      <button style={styles.dropdownItem}
                        onClick={() => { navigate('/seller/add-product'); setProfileOpen(false); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        ➕ Add Product
                      </button>
                      <button style={styles.dropdownItem}
                        onClick={() => { navigate('/seller/add-festivel-offer'); setProfileOpen(false); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(102,126,234,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        🎉 Create Festival Offer
                      </button>
                    </>
                  )}

                  <hr style={styles.divider} />

                  <button
                    style={{ ...styles.dropdownItem, color: '#e53e3e' }}
                    onClick={handleLogout}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" style={styles.loginBtn}>Log In</Link>
            </div>
          )}

          {/* Hamburger */}
          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div style={styles.mobileMenu}>

          {/* Mobile Search */}
          <div style={{ ...styles.searchWrapper, background: 'rgba(0,0,0,0.05)', margin: '0 0 8px' }}>
            <span style={{ ...styles.searchIcon, color: '#444' }}>🔍</span>
            <input
              type="text"
              placeholder={isSeller ? 'Search your products...' : 'Search products...'}
              value={searchValue}
              onChange={handleSearch}
              style={{ ...styles.searchInput, color: '#1a1a2e', background: 'transparent' }}
            />
          </div>

          {/* Buyer mobile links */}
          {!isSeller && (
            <>
              <Link to="/products" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>🏠 Home</Link>
              <hr style={styles.divider} />
              <p style={styles.mobileSectionTitle}>Categories</p>
              {CATEGORIES.map(cat => (
                <button key={cat.value} style={styles.mobileLink} onClick={() => handleCategorySelect(cat)}>
                  {cat.label}
                </button>
              ))}
              <hr style={styles.divider} />
              <button style={styles.mobileLink} onClick={() => { handleCartClick(); setMenuOpen(false); }}>🛒 Cart</button>
              <button style={styles.mobileLink} onClick={() => { navigate('/wishlist'); setMenuOpen(false); }}>🤍 Wishlist</button>
            </>
          )}

          {/* Seller mobile links */}
          {isSeller && (
            <>
              <button style={styles.mobileLink} onClick={() => { navigate('/seller/dashboard'); setMenuOpen(false); }}>🏪 My Store</button>
              <button style={styles.mobileLink} onClick={() => { navigate('/seller/add-product'); setMenuOpen(false); }}>➕ Add Product</button>
              <button style={styles.mobileLink} onClick={() => { navigate('/seller/add-festivel-offer'); setMenuOpen(false); }}>🎉 Create Offer</button>
            </>
          )}

          <hr style={styles.divider} />

          {user ? (
            <button style={{ ...styles.mobileLink, color: '#e53e3e' }} onClick={handleLogout}>🚪 Logout</button>
          ) : (
            <>
              <Link to="/login"  style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/signup" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

const styles = {
  nav: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: "'Segoe UI', sans-serif", position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 20px rgba(102,126,234,0.4)' },
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px' },

  logoBtn: { background: 'none', border: 'none', fontSize: '20px', fontWeight: '800', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Segoe UI', sans-serif", display: 'flex', alignItems: 'center', gap: '8px', padding: 0 },
  sellerTag: { fontSize: '11px', fontWeight: '700', background: 'rgba(255,200,0,0.3)', color: '#ffd700', padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' },

  searchWrapper: { flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0 12px', gap: '8px', maxWidth: '400px' },
  searchIcon: { fontSize: '14px', color: 'rgba(255,255,255,0.8)' },
  searchInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', padding: '10px 0', fontFamily: "'Segoe UI', sans-serif" },
  clearBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '12px', padding: '2px' },

  desktopLinks: { display: 'flex', alignItems: 'center', gap: '4px' },
  navLink: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', fontFamily: "'Segoe UI', sans-serif" },
  festivalBtn: { background: 'rgba(255,200,0,0.2)', border: '1px solid rgba(255,200,0,0.4)', color: '#ffd700', fontSize: '13px', fontWeight: '700', cursor: 'pointer', padding: '7px 12px', borderRadius: '8px', fontFamily: "'Segoe UI', sans-serif", whiteSpace: 'nowrap' },

  dropdownWrapper: { position: 'relative' },
  dropdownTrigger: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Segoe UI', sans-serif", whiteSpace: 'nowrap' },
  dropdownMenu: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: '6px', minWidth: '200px', zIndex: 999 },
  dropdownItem: { display: 'block', width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', borderRadius: '8px', fontSize: '14px', color: '#1a1a2e', cursor: 'pointer', textAlign: 'left', fontFamily: "'Segoe UI', sans-serif" },

  rightSide: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' },
  avatarBtn: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif" },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#fff', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  profileHeader: { padding: '10px 14px 6px', display: 'flex', flexDirection: 'column', gap: '4px' },
  profileEmail: { fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  roleBadge: { fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '0.5px' },
  divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '4px 0' },

  authBtns: { display: 'flex', gap: '8px', alignItems: 'center' },
  loginBtn: { color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '8px 14px' },

  hamburger: { display: 'none', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', padding: '8px', borderRadius: '8px' },
  mobileMenu: { background: '#fff', padding: '12px 16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' },
  mobileSectionTitle: { fontSize: '11px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0', padding: '0 12px' },
  mobileLink: { background: 'none', border: 'none', textDecoration: 'none', color: '#1a1a2e', fontSize: '15px', fontWeight: '500', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontFamily: "'Segoe UI', sans-serif", display: 'block' },
};