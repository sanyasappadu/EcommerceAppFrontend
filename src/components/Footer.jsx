  import React from 'react';
  import { Link } from 'react-router-dom';

  export default function Footer() {
    return (
      <footer style={styles.footer}>
        <div style={styles.inner}>

          {/* Brand */}
          <div style={styles.brand}>
            <span style={styles.logo}>🛍️ ShopApp</span>
            <p style={styles.tagline}>Your one-stop shop for everything.</p>
          </div>

          {/* Links */}
          <div style={styles.linksGroup}>
            <span style={styles.groupTitle}>Shop</span>
            <Link to="/products" style={styles.link}>All Products</Link>
            <Link to="/products?category=Electronics" style={styles.link}>Electronics</Link>
            <Link to="/products?category=Clothes" style={styles.link}>Clothes</Link>
            <Link to="/products?category=Shoes" style={styles.link}>Shoes</Link>
          </div>

          <div style={styles.linksGroup}>
            <span style={styles.groupTitle}>Account</span>
            <Link to="/login" style={styles.link}>Log In</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            <Link to="/wishlist" style={styles.link}>Wishlist</Link>
          </div>

          <div style={styles.linksGroup}>
            <span style={styles.groupTitle}>Company</span>
            <Link to="#" style={styles.link}>About Us</Link>
            <Link to="#" style={styles.link}>Privacy Policy</Link>
            <Link to="#" style={styles.link}>Terms of Service</Link>
            <Link to="#" style={styles.link}>Contact</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} ShopApp. All rights reserved.
          </p>
          <div style={styles.socials}>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.socialBtn} aria-label="GitHub">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={styles.socialBtn} aria-label="X">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={styles.socialBtn} aria-label="LinkedIn">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  const styles = {
    footer: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontFamily: "'Segoe UI', sans-serif",
      // marginTop: 'auto',
    },
    inner: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '48px 24px 32px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '40px',
      justifyContent: 'space-between',
    },
    brand: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '180px',
    },
    logo: {
      fontSize: '22px',
      fontWeight: '800',
      letterSpacing: '-0.5px',
    },
    tagline: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.7)',
      margin: 0,
      maxWidth: '180px',
      lineHeight: '1.5',
    },
    linksGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minWidth: '120px',
    },
    groupTitle: {
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: 'rgba(255,255,255,0.5)',
      marginBottom: '4px',
    },
    link: {
      color: 'rgba(255,255,255,0.85)',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s',
    },
    bottomBar: {
      borderTop: '1px solid rgba(255,255,255,0.2)',
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '20px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    copyright: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.6)',
      margin: 0,
    },
    socials: {
      display: 'flex',
      gap: '8px',
    },
    socialBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textDecoration: 'none',
      transition: 'background 0.2s',
    },
  };