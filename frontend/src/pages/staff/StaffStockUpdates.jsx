import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const STYLES = `
  .su * { box-sizing: border-box; }
  .su { font-family: 'Inter', sans-serif; }

  .su .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
  .su .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .su .kpi-card.success { background: #EAF6EE; }
  .su .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .su .kpi-card.success .kpi-label { color: #1F9D55; }
  .su .kpi-value { font-size: 24px; font-weight: 700; }
  .su .kpi-card.success .kpi-value { color: #1F9D55; }

  .su .grid { display: grid; grid-template-columns: 1fr 360px; gap: 16px; }

  .su .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .su .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; }

  .su table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 460px; }
  .su th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; white-space: nowrap; }
  .su th.num, .su td.num { text-align: right; }
  .su td { padding: 12px 8px; border-bottom: 1px solid #F1F0EA; white-space: nowrap; }
  .su tr:last-child td { border-bottom: none; }
  .su .change.up { color: #1F9D55; font-weight: 600; }
  .su .change.down { color: #A32D2D; font-weight: 600; }

  .su .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .su .badge.blue { background: #DCE9FD; color: #2F6FED; }

  .su .form-row { margin-bottom: 14px; }
  .su .form-row label { display: block; font-size: 12.5px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .su .form-row input, .su .form-row select { width: 100%; height: 38px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 7px; font-family: inherit; font-size: 13.5px; background: #FFFFFF; }

  .su .submit-btn { width: 100%; height: 40px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 4px; }
  .su .submit-btn:hover { background: #255BC7; }
  .su .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .su .error-msg { font-size: 12.5px; color: #DC2626; margin-bottom: 10px; }
  .su .empty { text-align: center; padding: 30px; color: #9CA3AF; font-size: 13px; }

  .su .app-footer { margin-top: 20px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .su .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .su .kpi-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .su .grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .su .kpi-row { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
    .su .kpi-card { padding: 14px; border-radius: 10px; }
    .su .kpi-label { font-size: 12px; margin-bottom: 4px; }
    .su .kpi-value { font-size: 19px; }
    .su .grid { gap: 12px; }
    .su .panel { padding: 14px; border-radius: 10px; }
    .su .panel-title { font-size: 14px; }
    .su table { min-width: 400px; font-size: 13px; }
    .su td, .su th { padding: 10px 6px; }
    .su .submit-btn { height: 44px; font-size: 14px; }
  }
`;

const REASONS = ["Damaged", "Recount correction", "Received shipment", "Other"];

export default function StaffStockUpdates() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    productId: "",
    changeType: "remove",
    quantity: "",
    reason: REASONS[0],
    notes: ""
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("sf_token");
      const [productsRes, updatesRes] = await Promise.all([
        axios.get("https://stockflow-wms-backend.onrender.com/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://stockflow-wms-backend.onrender.com/api/stock-adjustments", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setProducts(productsRes.data);
      setUpdates(updatesRes.data);
      if (productsRes.data.length > 0 && !form.productId) {
        setForm((f) => ({ ...f, productId: productsRes.data[0]._id }));
      }
    } catch (err) {
      console.error("Failed to load stock updates page:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    const qty = parseInt(form.quantity, 10);
    if (!form.productId) return setError("Please select a product.");
    if (!qty || qty <= 0) return setError("Please enter a valid quantity.");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("sf_token");
      await axios.post(
        "https://stockflow-wms-backend.onrender.com/api/stock-adjustments",
        {
          productId: form.productId,
          changeType: form.changeType,
          quantity: qty,
          reason: form.reason,
          notes: form.notes,
          submittedByName: user?.name || "Staff"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm((f) => ({ ...f, quantity: "", notes: "" }));
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit stock update.");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toDateString();
  const updatesToday = updates.filter((u) => new Date(u.createdAt).toDateString() === today).length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = updates.filter((u) => new Date(u.createdAt).getTime() >= weekAgo).length;

  return (
    <DashboardLayout title="Stock updates" subtitle="Log stock adjustments and view recent changes.">
      <div className="su">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Updates today</div><div className="kpi-value">{updatesToday}</div></div>
          <div className="kpi-card success"><div className="kpi-label">Updates this week</div><div className="kpi-value">{thisWeek}</div></div>
          <div className="kpi-card"><div className="kpi-label">Total logged</div><div className="kpi-value">{updates.length}</div></div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="panel-title">Recent updates</div>
            {loading ? (
              <div className="empty">Loading…</div>
            ) : updates.length === 0 ? (
              <div className="empty">No stock updates logged yet.</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Product</th><th>SKU</th><th>Change</th><th>By</th><th className="num">Reason</th></tr>
                </thead>
                <tbody>
                  {updates.map((u) => (
                    <tr key={u._id}>
                      <td>{u.productName}</td>
                      <td>{u.sku}</td>
                      <td className={`change ${u.changeType === "add" ? "up" : "down"}`}>
                        {u.changeType === "add" ? `+${u.quantity}` : `-${u.quantity}`}
                      </td>
                      <td>{u.submittedByName}</td>
                      <td className="num"><span className="badge blue">{u.reason}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <div className="panel-title">Log a new update</div>
            {error && <p className="error-msg">{error}</p>}
            <div className="form-row">
              <label>Product</label>
              <select value={form.productId} onChange={update("productId")}>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Adjustment type</label>
              <select value={form.changeType} onChange={update("changeType")}>
                <option value="remove">Remove stock</option>
                <option value="add">Add stock</option>
              </select>
            </div>
            <div className="form-row">
              <label>Quantity</label>
              <input type="number" min="1" placeholder="e.g. 5" value={form.quantity} onChange={update("quantity")} />
            </div>
            <div className="form-row">
              <label>Reason</label>
              <select value={form.reason} onChange={update("reason")}>
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label>Notes (optional)</label>
              <input placeholder="e.g. Torn during transit" value={form.notes} onChange={update("notes")} />
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit update"}
            </button>
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}