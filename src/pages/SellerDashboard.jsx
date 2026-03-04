import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { API_URL } from '../config';
// const url = "http://localhost:4000";

export default function SellerDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/products");
      return;
    }
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Filter only this seller's products
      const mine = data.filter(
        (p) => p.seller?._id === user.id || p.seller === user.id,
      );
      setProducts(mine);
      setStats({
        total: mine.length,
        lowStock: mine.filter((p) => p.stock > 0 && p.stock <= 5).length,
        outOfStock: mine.filter((p) => p.stock === 0).length,
        totalValue: mine.reduce((sum, p) => sum + p.price * p.stock, 0),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { label: "Out of Stock", bg: "#fee2e2", color: "#991b1b" };
    if (stock <= 5)
      return { label: "Low Stock", bg: "#fef9c3", color: "#854d0e" };
    return { label: "In Stock", bg: "#dcfce7", color: "#166534" };
  };

  if (loading)
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading your store...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏪 My Store</h1>
          <p style={styles.subtitle}>
            Welcome back, {user?.name}! Here's your store overview.
          </p>
        </div>
        <div style={styles.headerBtns}>
          <button
            style={styles.festivalBtn}
            onClick={() => navigate("/seller/add-festivel-offer")}
          >
            🎉 Create Festival Offer
          </button>
          <button
            style={styles.addBtn}
            onClick={() => navigate("/seller/add-product")}
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div style={styles.statsGrid}>
        {[
          {
            label: "Total Products",
            value: stats.total,
            icon: "📦",
            bg: "#ede9fe",
            color: "#7c3aed",
          },
          {
            label: "Low Stock",
            value: stats.lowStock,
            icon: "⚠️",
            bg: "#fef9c3",
            color: "#854d0e",
          },
          {
            label: "Out of Stock",
            value: stats.outOfStock,
            icon: "❌",
            bg: "#fee2e2",
            color: "#991b1b",
          },
          {
            label: "Inventory Value",
            value: `$${stats.totalValue.toFixed(0)}`,
            icon: "💰",
            bg: "#dcfce7",
            color: "#166534",
          },
        ].map((stat, i) => (
          <div key={i} style={{ ...styles.statCard, background: stat.bg }}>
            <span style={styles.statIcon}>{stat.icon}</span>
            <div>
              <p style={{ ...styles.statValue, color: stat.color }}>
                {stat.value}
              </p>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Low Stock Alert ── */}
      {(stats.lowStock > 0 || stats.outOfStock > 0) && (
        <div style={styles.alertBanner}>
          <span style={styles.alertIcon}>🔔</span>
          <p style={styles.alertText}>
            You have <strong>{stats.outOfStock}</strong> out-of-stock and{" "}
            <strong>{stats.lowStock}</strong> low-stock products. Click on them
            to update stock.
          </p>
        </div>
      )}

      {/* ── Products Section ── */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Your Products</h2>
        <span style={styles.count}>{products.length} products</span>
      </div>

      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: "48px" }}>📦</p>
          <p style={styles.emptyTitle}>No products yet</p>
          <p style={styles.emptySubtext}>
            Start selling by adding your first product
          </p>
          <button
            style={styles.addBtn}
            onClick={() => navigate("/seller/add-product")}
          >
            + Add Product
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => {
            const status = getStockStatus(product.stock);
            const isUrgent = product.stock <= 5;
            return (
              <div
                key={product._id}
                style={{
                  ...styles.card,
                  ...(isUrgent ? styles.cardUrgent : {}),
                }}
                onClick={() => navigate(`/seller/product/${product._id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {/* Urgent badge */}
                {isUrgent && (
                  <div style={styles.urgentBadge}>
                    {product.stock === 0 ? "❌ Out of Stock" : "⚠️ Low Stock"}
                  </div>
                )}

                {/* Image */}
                <div style={styles.imageWrapper}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.image}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/300x200?text=No+Image";
                    }}
                  />
                  <span style={styles.categoryBadge}>{product.category}</span>
                </div>

                {/* Info */}
                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productDesc}>{product.description}</p>

                  <div style={styles.cardFooter}>
                    <span style={styles.price}>${product.price}</span>
                    <span
                      style={{
                        ...styles.stockBadge,
                        background: status.bg,
                        color: status.color,
                      }}
                    >
                      {status.label}: {product.stock}
                    </span>
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      style={styles.editBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/seller/product/${product._id}`);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={styles.stockBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/seller/product/${product._id}?tab=stock`);
                      }}
                    >
                      📦 Update Stock
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    flexGrow: 1,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
    fontFamily: "'Segoe UI', sans-serif",
    width: "100%",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
    gap: "12px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f0f0f0",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#888", fontSize: "14px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a1a2e",
    margin: "0 0 4px",
  },
  subtitle: { fontSize: "14px", color: "#888", margin: 0 },
  addBtn: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    whiteSpace: "nowrap",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  statIcon: { fontSize: "28px" },
  statValue: { fontSize: "22px", fontWeight: "800", margin: 0 },
  statLabel: {
    fontSize: "12px",
    color: "#666",
    margin: "2px 0 0",
    fontWeight: "600",
  },
  alertBanner: {
    background: "#fef9c3",
    border: "1px solid #f59e0b",
    borderRadius: "12px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  alertIcon: { fontSize: "20px", flexShrink: 0 },
  alertText: { fontSize: "14px", color: "#78350f", margin: 0 },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1a1a2e",
    margin: 0,
  },
  count: {
    fontSize: "13px",
    color: "#888",
    background: "#f3f4f6",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
  },
  cardUrgent: {
    boxShadow: "0 2px 12px rgba(239,68,68,0.2)",
    border: "1px solid #fca5a5",
  },
  urgentBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
    zIndex: 1,
  },
  imageWrapper: {
    position: "relative",
    height: "180px",
    overflow: "hidden",
    background: "#f8f9fa",
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  categoryBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(102,126,234,0.9)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardBody: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  productName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  productDesc: {
    fontSize: "12px",
    color: "#888",
    margin: 0,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "4px",
  },
  price: { fontSize: "18px", fontWeight: "800", color: "#1a1a2e" },
  stockBadge: {
    fontSize: "12px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
  },
  cardActions: { display: "flex", gap: "8px", marginTop: "4px" },
  editBtn: {
    flex: 1,
    padding: "8px",
    background: "#f3f4f6",
    color: "#1a1a2e",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif' ",
  },
  stockBtn: {
    flex: 1,
    padding: "8px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  emptyState: { textAlign: "center", padding: "60px 0" },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "8px 0 4px",
  },
  emptySubtext: { fontSize: "14px", color: "#888", margin: "0 0 20px" },
  festivalBtn: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #f093fb, #f5576c)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    whiteSpace: "nowrap",
  },
};
