import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ICON_MAP = {
  inventory: { bg: "#FAEEDA", stroke: "#854F0B", d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" },
  orders: { bg: "#EFF4FF", stroke: "#2F6FED", d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" },
  users: { bg: "#EAF6EE", stroke: "#1F9D55", d: "M20 6 9 17 4 12" },
  system: { bg: "#F1F0EA", stroke: "#6B7280", d: "M9 12l2 2 4-4M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" },
};

const STYLES = `
  .notif-container { font-family: 'Inter', sans-serif; }
  
  .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
  .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 16px; border: 1px solid transparent; }
  .kpi-card.warning { background: #FAEEDA; }
  .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 4px; }
  .kpi-value { font-size: 24px; font-weight: 700; color: #111827; }
  .kpi-card.warning .kpi-label, .kpi-card.warning .kpi-value { color: #854F0B; }

  .filter-tabs { display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid #E5E5E0; padding-bottom: 12px; }
  .filter-tab { padding: 8px 16px; border-radius: 8px; font-size: 14px; color: #6B7280; cursor: pointer; background: transparent; border: none; font-weight: 500; transition: all 0.2s; }
  .filter-tab:hover { background: #F1F0EA; }
  .filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }

  .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; overflow: hidden; }
  .notif-row { display: flex; gap: 14px; padding: 16px 20px; border-bottom: 1px solid #F1F0EA; align-items: flex-start; transition: background 0.2s; cursor: pointer; }
  .notif-row:last-child { border-bottom: none; }
  .notif-row:hover { background: #FAFAFA; }
  
  .notif-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .notif-icon svg { width: 18px; height: 18px; }

  .notif-content { flex: 1; min-width: 0; }
  .notif-text { font-size: 14px; color: #374151; line-height: 1.4; }
  .notif-text.unread { font-weight: 600; color: #111827; }
  .notif-desc { font-size: 13px; color: #6B7280; margin-top: 3px; line-height: 1.4; }
  .notif-time { font-size: 12px; color: #9CA3AF; margin-top: 4px; }
  
  .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #2F6FED; margin-top: 6px; flex-shrink: 0; }

  .mark-read-btn { background: none; border: none; color: #2F6FED; font-size: 13px; font-weight: 600; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
  .mark-read-btn:hover { background: #DCE9FD; }

  .empty { padding: 40px; text-align: center; color: #6B7280; }

  @media (max-width: 768px) {
    .kpi-row { grid-template-columns: 1fr; }
    .filter-tabs { overflow-x: auto; white-space: nowrap; }
  }
`;

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

export default function StaffNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "assigned") return []; // No order-assignment system exists yet
    if (activeFilter === "alerts") return notifications.filter((n) => n.category === "inventory");
    if (activeFilter === "archived") return notifications.filter((n) => !n.unread);
    return notifications;
  }, [activeFilter, notifications]);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("sf_token");
      await axios.patch("https://stockflow-wms-backend.onrender.com/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const markRead = async (n) => {
    if (n.unread) {
      try {
        const token = localStorage.getItem("sf_token");
        await axios.patch(`https://stockflow-wms-backend.onrender.com/api/notifications/${n._id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, unread: false } : x)));
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
    if (n.link) navigate(n.link);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const alertCount = notifications.filter((n) => n.category === "inventory").length;

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stock alerts and order activity across the warehouse."
      actions={
        <button className="mark-read-btn" onClick={markAllAsRead}>
          Mark all as read
        </button>
      }
    >
      <div className="notif-container">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-label">Unread</div>
            <div className="kpi-value">{unreadCount}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Assigned to you</div>
            <div className="kpi-value">0</div>
          </div>
          <div className="kpi-card warning">
            <div className="kpi-label">Active alerts</div>
            <div className="kpi-value">{alertCount}</div>
          </div>
        </div>

        <div className="filter-tabs">
          <button className={`filter-tab ${activeFilter === "all" ? "active" : ""}`} onClick={() => setActiveFilter("all")}>All</button>
          <button className={`filter-tab ${activeFilter === "assigned" ? "active" : ""}`} onClick={() => setActiveFilter("assigned")}>Assigned to me</button>
          <button className={`filter-tab ${activeFilter === "alerts" ? "active" : ""}`} onClick={() => setActiveFilter("alerts")}>Alerts</button>
          <button className={`filter-tab ${activeFilter === "archived" ? "active" : ""}`} onClick={() => setActiveFilter("archived")}>Archived</button>
        </div>

        <div className="panel">
          {loading ? (
            <div className="empty">Loading notifications…</div>
          ) : activeFilter === "assigned" ? (
            <div className="empty">Task assignment isn't set up yet — no orders are currently linked to individual staff.</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No notifications found in this category.</div>
          ) : (
            filtered.map((n) => {
              const icon = ICON_MAP[n.category] || ICON_MAP.system;
              return (
                <div key={n._id} className="notif-row" onClick={() => markRead(n)}>
                  <div className="notif-icon" style={{ background: icon.bg }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={icon.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon.d} />
                    </svg>
                  </div>
                  <div className="notif-content">
                    <div className={`notif-text${n.unread ? " unread" : ""}`}>{n.title}</div>
                    {n.description && <div className="notif-desc">{n.description}</div>}
                    <div className="notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                  {n.unread && <div className="unread-dot"></div>}
                </div>
              );
            })
          )}
        </div>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "12px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved.
        </div>
      </div>
    </DashboardLayout>
  );
}