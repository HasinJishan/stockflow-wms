import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Bell } from "lucide-react";

export default function CustomerBrowseProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const userInitials = (user?.name || "PR").slice(0, 2).toUpperCase();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Log out of your account?")) {
      logout();
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const pagedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  const handleAddToCart = (product) => {
    addToCart({
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      productId: product._id
    });
    navigate("/customer/checkout");
  };

  const stockBadge = (status) => {
    if (status === "Out of stock") return { bg: "#fee2e2", color: "#991b1b" };
    if (status === "Low stock") return { bg: "#fef3c7", color: "#92400e" };
    return { bg: "#dcfce7", color: "#166534" };
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#FAFAF8", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto 40px auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", margin: 0 }}>Browse Products</h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: "4px 0 0 0" }}>Explore equipment, packaging, and safety supplies.</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => navigate("/customer/notifications")}
              title="Notifications"
              style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Bell size={26} color="#334155" strokeWidth={1.8} />
            </button>

            <button
              onClick={handleLogout}
              title={`Logged in as ${user?.name || "User"}. Click to logout.`}
              style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#DCE9FD", color: "#2563EB", border: "2px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              {userInitials}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input
            type="text"
            placeholder="Search by SKU or Name..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            style={{ width: "100%", padding: "16px 24px", borderRadius: "15px", border: "1px solid #d1d5db", fontSize: "16px", outline: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", boxSizing: "border-box" }}
          />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                style={{
                  padding: "10px 20px", borderRadius: "12px", border: "1px solid #d1d5db", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                  backgroundColor: activeCategory === cat ? "#2563eb" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#374151",
                  transition: "0.2s all",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px", color: "#6b7280" }}>Loading products…</div>
      ) : (
        <>
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
            {pagedProducts.length > 0 ? (
              pagedProducts.map((p) => {
                const badge = stockBadge(p.status);
                return (
                  <div key={p._id} style={{ background: "#fff", borderRadius: "24px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}>
                    <div style={{ height: "260px", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "25px", borderBottom: "1px solid #f1f5f9" }}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" width="72" height="72">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                      )}
                    </div>

                    <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.category}</span>
                        <h3 style={{ fontSize: "19px", fontWeight: "700", margin: "6px 0", color: "#1f2937" }}>{p.name}</h3>
                        <span style={{ fontSize: "13px", color: "#9ca3af" }}>SKU: {p.sku}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                        <span style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>${p.price.toFixed(2)}</span>
                        <span style={{ fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "100px", backgroundColor: badge.bg, color: badge.color }}>
                          {p.status === "In stock" ? "In stock" : p.status === "Low stock" ? `${p.quantity} left` : "Out of stock"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.status === "Out of stock"}
                        style={{
                          width: "100%", marginTop: "25px", padding: "18px",
                          background: p.status === "Out of stock" ? "#9CA3AF" : "#2563eb",
                          color: "#fff", border: "none", borderRadius: "16px", fontWeight: "700",
                          cursor: p.status === "Out of stock" ? "not-allowed" : "pointer",
                          fontSize: "16px", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)"
                        }}
                      >
                        {p.status === "Out of stock" ? "Out of stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "100px", color: "#6b7280" }}>
                <h2 style={{ fontSize: "24px" }}>No items found matching your search.</h2>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: "600", marginTop: "10px" }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ maxWidth: "1400px", margin: "30px auto 0", display: "flex", justifyContent: "center", gap: "8px" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pagerBtnStyle(page === 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)} style={pagerBtnStyle(false, page === n)}>{n}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pagerBtnStyle(page === totalPages)}>Next</button>
            </div>
          )}
        </>
      )}

      <div style={{ maxWidth: "1400px", margin: "40px auto 0", textAlign: "center", fontSize: "11.5px", color: "#9CA3AF", borderTop: "1px solid #E5E5E0", paddingTop: "16px" }}>
        &copy; 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
      </div>
    </div>
  );
}

function pagerBtnStyle(disabled, active) {
  return {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    background: active ? "#2563eb" : "#fff",
    color: active ? "#fff" : "#374151",
    fontWeight: 600,
    fontSize: 13,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };
}