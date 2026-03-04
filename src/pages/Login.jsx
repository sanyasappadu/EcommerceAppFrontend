import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { API_URL } from '../config';
// const url = "http://localhost:4000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Store token and user in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // ✅ Update AuthContext
        login(result.user, result.token);

        // ✅ Redirect based on role
        if (result.user.role === "seller") {
          navigate("/seller/dashboard");
        } else {
          navigate("/products");
        }
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Log in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Forgot Password */}
          <div style={styles.forgotWrapper}>
            <Link to="#" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {error && <p style={styles.error}>⚠️ {error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.signupLink}>
            Sign Up
          </Link>
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
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  iconWrapper: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 6px",
  },
  subtitle: {
    color: "#888",
    fontSize: "14px",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#1a1a2e",
  },
  forgotWrapper: {
    textAlign: "right",
    marginTop: "-8px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
  },
  error: {
    color: "#e53e3e",
    fontSize: "13px",
    background: "#fff5f5",
    padding: "10px 14px",
    borderRadius: "8px",
    margin: 0,
  },
  submitBtn: {
    padding: "13px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    marginTop: "4px",
    transition: "opacity 0.2s",
  },
  signupText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#888",
  },
  signupLink: {
    color: "#667eea",
    fontWeight: "600",
    textDecoration: "none",
  },
};
