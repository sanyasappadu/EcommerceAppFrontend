import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
// const url = "http://localhost:4000";

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const userData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      role: role,
    };

    try {
      const response = await fetch(`${url}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Store token and user in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/'); // Redirect to home
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>🔒</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join us as a buyer or seller</p>
        </div>

        {/* Role Toggle */}
        <div style={styles.roleToggle}>
          <button
            type="button"
            onClick={() => setRole('buyer')}
            style={{ ...styles.roleBtn, ...(role === 'buyer' ? styles.roleBtnActive : {}) }}
          >
            🛒 Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            style={{ ...styles.roleBtn, ...(role === 'seller' ? styles.roleBtnActive : {}) }}
          >
            🏪 Seller
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="John Doe"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Min. 6 characters"
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>⚠️ {error}</p>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating account...' : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>Log In</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
page: {
  flexGrow: 1,           // ✅ instead of minHeight: '100vh'
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  fontFamily: "'Segoe UI', sans-serif",
},
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  iconWrapper: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 6px',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    margin: 0,
  },
  roleToggle: {
    display: 'flex',
    background: '#f3f4f6',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '24px',
    gap: '4px',
  },
  roleBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    color: '#888',
    transition: 'all 0.2s',
  },
  roleBtnActive: {
    background: '#fff',
    color: '#667eea',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
  },
  input: {
    padding: '12px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    color: '#1a1a2e',
  },
  error: {
    color: '#e53e3e',
    fontSize: '13px',
    background: '#fff5f5',
    padding: '10px 14px',
    borderRadius: '8px',
    margin: 0,
  },
  submitBtn: {
    padding: '13px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'opacity 0.2s',
  },
  loginText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#888',
  },
  loginLink: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none',
  },
};