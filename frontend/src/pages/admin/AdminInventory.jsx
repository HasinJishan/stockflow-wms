import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

// Constant for UI filters
const CATEGORIES = ["All", "Packaging", "Electronics", "Apparel", "Low stock"];

const BADGE_CLASS = {
  "Low stock": "amber",
  Critical: "red",
  "In stock": "green",
  "Out of stock": "red",
};

// --- ICONS ---
const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// --- STYLES ---
const STYLES = `
  .inv * { box-sizing: border-box; }
  .inv { font-family: 'Inter', sans-serif; }
  .inv .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .inv .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .inv .kpi-card.danger { background: #FCEBEB; }
  .inv .kpi-card.warning { background: #FAEEDA; }
  .inv .kpi-card.success { background: #EAF6EE; }
  .inv .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .inv .kpi-value { font-size: 26px; font-weight: 700; }
  .inv .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
  .inv .search-box { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 8px; padding: 0 14px; height: 40px; width: 320px; }
  .inv .search-box input { border: none; outline: none; width: 100%; font-size: 14px; }
  .inv .filter-tabs { display: flex; gap: 8px; }
  .inv .filter-chip { padding: 6px 14px; border-radius: 999px; font-size: 13px; border: 1px solid #D1D5DB; background: #fff; cursor: pointer; }
  .inv .filter-chip.active { background: #2F6FED; color: #fff; border-color: #2F6FED; }
  .inv .panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; }
  .inv table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .inv th { text-align: left; color: #6B7280; padding: 8px 10px; border-bottom: 1px solid #E5E5E0; font-size: 12px; }
  .inv td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; }
  .inv .clickable-row:hover { background: #F9FAFB; cursor: pointer; }
  .inv .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; }
  .inv .badge.green { background: #EAF6EE; color: #1F9D55; }
  .inv .badge.amber { background: #FAEEDA; color: #854F0B; }
  .inv .badge.red { background: #FCEBEB; color: #A32D2D; }
  .inv .empty { text-align: center; padding: 40px; color: #6B7280; }
`;

export default function AdminInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Fetch data from real backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || (category === "Low stock" ? p.status === "Low stock" || p.status === "Critical" : p.category === category);
      return matchesQuery && matchesCategory;
    });
  }, [query, category, products]);

  // KPI Calculations
  const totalSkus = products.length;
  const lowStock = products.filter((p) => p.status === "Low stock" || p.status === "Critical").length;
  const outOfStock = products.filter((p) => p.status === "Out of stock").length;
  const inStock = products.filter((p) => p.status === "In stock").length;

  return (
    <DashboardLayout
      title="Inventory"
      subtitle={`${totalSkus} products in system`}
      actions={
        <button className="topbar-btn" onClick={() => navigate("/admin/inventory/add")}>
          <AddIcon /> <span className="btn-label">Add product</span>
        </button>
      }
    >
      <div className="inv">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Total SKUs</div><div className="kpi-value">{totalSkus}</div></div>
          <div className="kpi-card danger"><div className="kpi-label">Low stock</div><div className="kpi-value">{lowStock}</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Out of stock</div><div className="kpi-value">{outOfStock}</div></div>
          <div className="kpi-card success"><div className="kpi-label">In stock</div><div className="kpi-value">{inStock}</div></div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <SearchIcon />
            <input placeholder="Search SKU or Name..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {CATEGORIES.map((c) => (
              <button key={c} className={`filter-chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          {loading ? (
            <div className="empty">Fetching database...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No products found.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Product</th><th>SKU</th><th>Category</th><th>Stock</th><th>Price</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="clickable-row" onClick={() => navigate(`/admin/products/${p._id}`)}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.category}</td>
                    <td>{p.quantity}</td>
                    <td>${p.price}</td>
                    <td><span className={`badge ${BADGE_CLASS[p.status]}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}