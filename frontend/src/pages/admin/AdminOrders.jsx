import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const ORDERS = [
  { id: "#10432", customer: "Priya Raman", items: 3, total: "$142.00", date: "Jul 24", status: "Shipped" },
  { id: "#10433", customer: "Daniel Osei", items: 1, total: "$38.50", date: "Jul 24", status: "Processing" },
  { id: "#10434", customer: "Wei Zhang", items: 5, total: "$276.20", date: "Jul 23", status: "Pending" },
  { id: "#10435", customer: "Amara Okafor", items: 2, total: "$91.00", date: "Jul 23", status: "Delivered" },
  { id: "#10436", customer: "Lucas Ferreira", items: 4, total: "$203.40", date: "Jul 22", status: "Delivered" },
  { id: "#10437", customer: "Nora Haddad", items: 1, total: "$52.00", date: "Jul 22", status: "Shipped" },
  { id: "#10438", customer: "Kenji Sato", items: 6, total: "$318.90", date: "Jul 21", status: "Pending" },
];

const STATUS_TABS = ["All", "Pending", "Processing", "Shipped", "Delivered"];

const BADGE_CLASS = {
  Shipped: "blue",
  Processing: "amber",
  Pending: "gray",
  Delivered: "green",
};

const STYLES = `
  .ord * { box-sizing: border-box; }
  .ord { font-family: 'Inter', sans-serif; }

  .ord .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .ord .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .ord .kpi-card.danger { background: #FCEBEB; }
  .ord .kpi-card.warning { background: #FAEEDA; }
  .ord .kpi-card.success { background: #EAF6EE; }
  .ord .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .ord .kpi-card.danger .kpi-label { color: #A32D2D; }
  .ord .kpi-card.warning .kpi-label { color: #854F0B; }
  .ord .kpi-card.success .kpi-label { color: #1F9D55; }
  .ord .kpi-value { font-size: 26px; font-weight: 700; }
  .ord .kpi-card.danger .kpi-value { color: #A32D2D; }
  .ord .kpi-card.warning .kpi-value { color: #854F0B; }
  .ord .kpi-card.success .kpi-value { color: #1F9D55; }

  .ord .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
  .ord .search-box { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 8px; padding: 0 14px; height: 40px; width: 320px; max-width: 100%; }
  .ord .search-box svg { width: 16px; height: 16px; stroke: #9CA3AF; flex-shrink: 0; }
  .ord .search-box input { border: none; outline: none; font-family: inherit; font-size: 14px; width: 100%; }
  .ord .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
  .ord .filter-tab { padding: 8px 16px; border-radius: 8px; font-size: 13px; color: #6B7280; cursor: pointer; border: none; background: transparent; font-family: inherit; }
  .ord .filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }

  .ord .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; overflow-x: auto; }
  .ord table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 640px; }
  .ord th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .ord td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; }
  .ord tr.clickable-row { cursor: pointer; transition: background 0.15s ease; }
  .ord tr.clickable-row:hover { background: #F9FAFB; }
  .ord tr:last-child td { border-bottom: none; }

  .ord .order-link { color: #2F6FED; text-decoration: none; font-weight: 600; }
  .ord .order-link:hover { text-decoration: underline; }

  .ord .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .ord .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .ord .badge.green { background: #EAF6EE; color: #1F9D55; }
  .ord .badge.amber { background: #FAEEDA; color: #854F0B; }
  .ord .badge.red { background: #FCEBEB; color: #A32D2D; }
  .ord .badge.gray { background: #F1F0EA; color: #6B7280; }

  .ord .empty { text-align: center; padding: 48px 20px; color: #6B7280; font-size: 14px; }

  .ord .top-actions { display: flex; gap: 10px; align-items: center; }
  .ord .btn-create { background: #2563EB; color: #FFFFFF; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; text-decoration: none; }
  .ord .btn-create:hover { background: #1D4ED8; }

  .ord .app-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .ord .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .ord .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .ord .kpi-row { grid-template-columns: 1fr; }
    .ord .search-box { width: 100%; }
  }
`;

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function AdminOrders() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      const matchesQuery =
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All" || o.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const handleRowClick = (rawId) => {
    const cleanId = rawId.replace("#", "");
    navigate(`/admin/orders/${cleanId}`);
  };

  return (
    <DashboardLayout
      title="Orders"
      subtitle="Manage and track every customer order."
      actions={
        <div className="ord" style={{ display: "inline-block" }}>
          <div className="top-actions">
            <button className="topbar-btn-outline" onClick={() => alert("Wire this up to your export/API logic")}>
              <ExportIcon /> <span className="btn-label">Export</span>
            </button>
            <Link to="/admin/orders/create" className="btn-create">
              + Create order
            </Link>
          </div>
        </div>
      }
    >
      <div className="ord">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Total orders</div><div className="kpi-value">3,842</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Processing</div><div className="kpi-value">28</div></div>
          <div className="kpi-card"><div className="kpi-label">Shipped today</div><div className="kpi-value">96</div></div>
          <div className="kpi-card success"><div className="kpi-label">Delivered this week</div><div className="kpi-value">512</div></div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <SearchIcon />
            <input
              placeholder="Search by order ID or customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                className={`filter-tab${status === tab ? " active" : ""}`}
                onClick={() => setStatus(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          {filtered.length === 0 ? (
            <div className="empty">No orders match your search or filter.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr 
                    key={o.id} 
                    className="clickable-row" 
                    onClick={() => handleRowClick(o.id)}
                  >
                    <td>
                      <Link to={`/admin/orders/${o.id.replace("#", "")}`} className="order-link" onClick={(e) => e.stopPropagation()}>
                        {o.id}
                      </Link>
                    </td>
                    <td>{o.customer}</td>
                    <td>{o.items}</td>
                    <td>{o.total}</td>
                    <td>{o.date}</td>
                    <td><span className={`badge ${BADGE_CLASS[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
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