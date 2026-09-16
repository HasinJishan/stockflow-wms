import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
  ["all", "All"],
  ["inventory", "Inventory"],
  ["users", "Users"],
  ["orders", "Orders"],
  ["system", "System & security"],
];

const ICON_MAP = {
  inventory: { bg: "#FCEBEB", color: "#A32D2D", d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" },
  orders: { bg: "#FAEEDA", color: "#854F0B", d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" },
  users: { bg: "#EFF4FF", color: "#2F6FED", d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" },
  system: { bg: "#F1F0EA", color: "#6B7280", d: "M9 12l2 2 4-4M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" },
};

const STYLES = `
  .an2 * { box-sizing: border-box; }
  .an2 { font-family: 'Inter', sans-serif; color: #111827; background: #FAFAF8; min-height: 100vh; display: flex; flex-direction: column; }
  .an2 .main { padding: 28px 40px 0; display: flex; flex-direction: column; flex: 1; max-width: 1600px; width: 100%; margin: 0 auto; }

  .an2 .header-icons { display: flex; align-items: center; gap: 10px; }
  .an2 .icon-btn { width: 38px; height: 38px; border-radius: 9px; background: #FFFFFF; border: 1px solid #D1D5DB; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
  .an2 .icon-btn svg { width: 17px; height: 17px; }
  .an2 .icon-btn.active { background: #DCE9FD; border-color: #DCE9FD; }
  .an2 .bell-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: #A32D2D; border: 1.5px solid #FFFFFF; }

  .an2 .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0; gap: 16px; flex-wrap: wrap; }
  .an2 .topbar h1 { font-size: 25px; font-weight: 700; }
  .an2 .topbar .sub { font-size: 13px; color: #6B7280; margin-top: 2px; }
  .an2 .topbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .an2 .avatar { width: 34px; height: 34px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; cursor: pointer; border: none; }

  .an2 .content-scroll { flex: 1; padding-right: 4px; }

  .an2 .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 16px; }
  .an2 .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 16px; }
  .an2 .kpi-card.danger { background: #FCEBEB; }
  .an2 .kpi-card.warning { background: #FAEEDA; }
  .an2 .kpi-card.success { background: #EAF6EE; }
  .an2 .kpi-label { font-size: 12.5px; color: #6B7280; margin-bottom: 5px; }
  .an2 .kpi-card.danger .kpi-label { color: #A32D2D; }
  .an2 .kpi-card.warning .kpi-label { color: #854F0B; }
  .an2 .kpi-card.success .kpi-label { color: #1F9D55; }
  .an2 .kpi-value { font-size: 24px; font-weight: 700; }
  .an2 .kpi-card.danger .kpi-value { color: #A32D2D; }
  .an2 .kpi-card.warning .kpi-value { color: #854F0B; }
  .an2 .kpi-card.success .kpi-value { color: #1F9D55; }
  .an2 .kpi-sub { font-size: 11.5px; color: #9CA3AF; margin-top: 3px; }

  .an2 .filter-tabs { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
  .an2 .filter-tab { padding: 7px 14px; border-radius: 8px; font-size: 12.5px; color: #6B7280; cursor: pointer; background: #FFFFFF; border: 1px solid #E5E5E0; font-family: inherit; white-space: nowrap; }
  .an2 .filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; border-color: #DCE9FD; }

  .an2 .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; }
  .an2 .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .an2 .panel-title { font-size: 14.5px; font-weight: 600; }
  .an2 .mark-read { font-size: 12px; color: #2F6FED; cursor: pointer; font-weight: 500; background: none; border: none; font-family: inherit; }

  .an2 .notif-row { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid #F1F0EA; cursor: pointer; }
  .an2 .notif-row:last-child { border-bottom: none; }
  .an2 .notif-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .an2 .notif-icon svg { width: 17px; height: 17px; }
  .an2 .notif-body { flex: 1; min-width: 0; }
  .an2 .notif-title { font-size: 13.5px; }
  .an2 .notif-title.unread { font-weight: 600; }
  .an2 .notif-desc { font-size: 12.5px; color: #6B7280; margin-top: 2px; line-height: 1.4; }
  .an2 .notif-time { font-size: 11px; color: #9CA3AF; margin-top: 5px; }
  .an2 .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #2F6FED; margin-top: 5px; flex-shrink: 0; }
  .an2 .unread-spacer { width: 8px; flex-shrink: 0; }
  .an2 .badge { font-size: 10.5px; padding: 2px 8px; border-radius: 6px; font-weight: 600; margin-left: 8px; display: inline-block; }
  .an2 .badge.red { background: #FCEBEB; color: #A32D2D; }
  .an2 .badge.amber { background: #FAEEDA; color: #854F0B; }

  .an2 .empty { text-align: center; padding: 40px 20px; color: #9CA3AF; font-size: 13px; }

  .an2 .app-footer { padding: 10px 0 20px; border-top: 1px solid #E5E5E0; font-size: 11.5px; color: #9CA3AF; text-align: center; flex-shrink: 0; }
  .an2 .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 900px) {
    .an2 .main { padding: 20px; }
    .an2 .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .an2 .kpi-row { grid-template-columns: 1fr; }
  }
`;

const Icon = ({ d, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('sf_token');
        const res = await axios.get('https://stockflow-wms-backend.onrender.com/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifs(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? notifs : notifs.filter((n) => n.category === filter)),
    [notifs, filter]
  );

  const counts = useMemo(() => {
    const c = { all: notifs.length };
    for (const [key] of CATEGORIES) {
      if (key !== "all") c[key] = notifs.filter((n) => n.category === key).length;
    }
    return c;
  }, [notifs]);

  const unreadCount = notifs.filter((n) => n.unread).length;
  const lowStockCount = notifs.filter((n) => n.category === "inventory").length;
  const newSignupsCount = notifs.filter((n) => n.category === "users").length;

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('sf_token');
      await axios.patch('https://stockflow-wms-backend.onrender.com/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem('sf_token');
      await axios.patch(`https://stockflow-wms-backend.onrender.com/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifs((prev) => prev.map((n) => (n._id === id ? { ...n, unread: false } : n)));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="an2">
      <style>{STYLES}</style>
      <div className="main">
        <div className="topbar">
          <div>
            <h1>Notifications</h1>
            <p className="sub">System alerts, escalations, and account activity across the workspace.</p>
          </div>
          <div className="topbar-right">
            <div className="header-icons">
              <button className="icon-btn active" aria-label="Notifications">
                <Icon stroke="#2F6FED" d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0" />
                {unreadCount > 0 && <div className="bell-dot" />}
              </button>
              <button className="icon-btn" aria-label="Settings" onClick={() => navigate("/admin/settings")}>
                <Icon stroke="#4B5563" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </button>
            </div>
            <button className="avatar" onClick={() => navigate("/admin")} title="Back to dashboard">AD</button>
          </div>
        </div>

        <div className="content-scroll">
          <div className="kpi-row">
            <div className="kpi-card danger">
              <div className="kpi-label">Unread</div>
              <div className="kpi-value">{unreadCount}</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Inventory alerts</div>
              <div className="kpi-value">{lowStockCount}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">New signups</div>
              <div className="kpi-value">{newSignupsCount}</div>
            </div>
            <div className="kpi-card success">
              <div className="kpi-label">System status</div>
              <div className="kpi-value">Operational</div>
            </div>
          </div>

          <div className="filter-tabs">
            {CATEGORIES.map(([key, label]) => (
              <button
                key={key}
                className={`filter-tab${filter === key ? " active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label} ({counts[key] ?? 0})
              </button>
            ))}
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Recent</div>
              <button className="mark-read" onClick={markAllRead}>Mark all as read</button>
            </div>

            {loading ? (
              <div className="empty">Loading notifications…</div>
            ) : filtered.length === 0 ? (
              <div className="empty">No notifications yet.</div>
            ) : (
              filtered.map((n) => {
                const iconInfo = ICON_MAP[n.category] || ICON_MAP.system;
                return (
                  <div
                    className="notif-row"
                    key={n._id}
                    onClick={() => {
                      if (n.unread) markRead(n._id);
                      if (n.link) navigate(n.link);
                    }}
                  >
                    {n.unread ? <div className="unread-dot" /> : <div className="unread-spacer" />}
                    <div className="notif-icon" style={{ background: iconInfo.bg }}>
                      <Icon stroke={iconInfo.color} d={iconInfo.d} />
                    </div>
                    <div className="notif-body">
                      <div className={`notif-title${n.unread ? " unread" : ""}`}>
                        {n.title}
                        {n.priority !== "none" && (
                          <span className={`badge ${n.priority}`}>
                            {n.priority === "red" ? "Action needed" : "High priority"}
                          </span>
                        )}
                      </div>
                      {n.description && <div className="notif-desc">{n.description}</div>}
                      <div className="notif-time">{timeAgo(n.createdAt)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}