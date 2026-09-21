import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ACTION_MAP = {
  "In stock": { label: "Matches", color: "green" },
  "Low stock": { label: "Recount", color: "amber" },
  "Out of stock": { label: "Flagged", color: "red" },
};

const STYLES = `
  .si * { box-sizing: border-box; }
  .si { font-family: 'Inter', sans-serif; }

  .si .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
  .si .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 16px; }
  .si .kpi-card.warning { background: #FAEEDA; }
  .si .kpi-card.danger { background: #FCEBEB; }
  .si .kpi-label { font-size: 12.5px; color: #6B7280; margin-bottom: 5px; }
  .si .kpi-card.warning .kpi-label { color: #854F0B; }
  .si .kpi-card.danger .kpi-label { color: #A32D2D; }
  .si .kpi-value { font-size: 24px; font-weight: 700; }
  .si .kpi-card.warning .kpi-value { color: #854F0B; }
  .si .kpi-card.danger .kpi-value { color: #A32D2D; }

  .si .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 12px; flex-wrap: wrap; }
  .si .search-box { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 8px; padding: 0 12px; height: 38px; width: 280px; max-width: 100%; }
  .si .search-box svg { width: 15px; height: 15px; stroke: #9CA3AF; flex-shrink: 0; }
  .si .search-box input { border: none; outline: none; font-family: inherit; font-size: 13.5px; width: 100%; }
  .si .filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
  .si .filter-tab { padding: 7px 14px; border-radius: 8px; font-size: 12.5px; color: #6B7280; cursor: pointer; background: none; border: none; font-family: inherit; white-space: nowrap; }
  .si .filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }

  .si .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px 20px; overflow-x: auto; }
  .si table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 520px; }
  .si th { text-align: left; font-weight: 500; color: #6B7280; padding: 7px 8px; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .si th.num, .si td.num { text-align: right; }
  .si td { padding: 10px 8px; border-bottom: 1px solid #F1F0EA; }
  .si tr:last-child td { border-bottom: none; }

  .si .badge { font-size: 11.5px; padding: 3px 11px; border-radius: 7px; font-weight: 600; display: inline-block; }
  .si .badge.green { background: #EAF6EE; color: #1F9D55; }
  .si .badge.amber { background: #FAEEDA; color: #854F0B; }
  .si .badge.red { background: #FCEBEB; color: #A32D2D; }

  .si .empty { text-align: center; padding: 40px 20px; color: #6B7280; font-size: 13.5px; }

  .si .app-footer { margin-top: 16px; padding-top: 14px; border-top: 1px solid #E5E5E0; font-size: 11.5px; color: #9CA3AF; text-align: center; }
  .si .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 900px) {
    .si .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .si .kpi-row { grid-template-columns: 1fr; }
    .si .search-box { width: 100%; }
  }
`;

export default function StaffInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("All bins");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Real warehouse locations, derived from actual product data (no fake "Zone A/B/C")
  const zones = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.warehouseLocation).filter(Boolean)));
    return ["All bins", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesZone = zone === "All bins" || p.warehouseLocation === zone;
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.binLocation || "").toLowerCase().includes(query.toLowerCase());
      return matchesZone && matchesQuery;
    });
  }, [products, query, zone]);

  const flaggedCount = products.filter((p) => p.status === "Out of stock").length;
  const recountCount = products.filter((p) => p.status === "Low stock").length;

  return (
    <DashboardLayout title="Inventory" subtitle="Live stock levels · read access, request recounts as needed.">
      <div className="si">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Total SKUs</div><div className="kpi-value">{products.length}</div></div>
          <div className="kpi-card danger"><div className="kpi-label">Discrepancies flagged</div><div className="kpi-value">{flaggedCount}</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Pending recounts</div><div className="kpi-value">{recountCount}</div></div>
          <div className="kpi-card"><div className="kpi-label">In stock</div><div className="kpi-value">{products.length - flaggedCount - recountCount}</div></div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input placeholder="Search by product or bin…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {zones.map((z) => (
              <button key={z} className={`filter-tab${zone === z ? " active" : ""}`} onClick={() => setZone(z)}>
                {z}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          {loading ? (
            <div className="empty">Loading inventory…</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No items match your search or filter.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Product</th><th>Bin</th><th>Reorder level</th><th>In stock</th><th className="num">Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const action = ACTION_MAP[p.status] || ACTION_MAP["In stock"];
                  return (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.binLocation || "—"}</td>
                      <td>{p.reorderLevel}</td>
                      <td>{p.quantity}</td>
                      <td className="num"><span className={`badge ${action.color}`}>{action.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}