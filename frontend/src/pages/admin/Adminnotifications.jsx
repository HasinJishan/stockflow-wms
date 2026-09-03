import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const NOTIFICATIONS = [
  {
    id: 1, category: "inventory", unread: true, iconBg: "#FCEBEB", iconColor: "#A32D2D",
    icon: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    title: "Critical stock shortage", badge: ["Action needed", "red"],
    desc: "Corrugated Box (M) is down to 8 units across all zones — below the 20-unit reorder threshold.",
    time: "12 minutes ago", actions: [["Reorder now", "primary"], ["View item", "outline"]],
  },
  {
    id: 2, category: "system", unread: true, iconBg: "#FCEBEB", iconColor: "#A32D2D",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Unusual login detected", badge: ["Action needed", "red"],
    desc: "A login to David Chen's staff account was made from a new device in Chicago, IL.",
    time: "40 minutes ago", actions: [["Review activity", "primary"], ["Dismiss", "outline"]],
  },
  {
    id: 3, category: "orders", unread: true, iconBg: "#FAEEDA", iconColor: "#854F0B",
    icon: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
    title: "Order #10432 escalated", badge: ["High priority", "amber"],
    desc: "Delayed 2 days past expected ship date — flagged by warehouse staff for review.",
    time: "1 hour ago", actions: [],
  },
  {
    id: 4, category: "users", unread: true, iconBg: "#EFF4FF", iconColor: "#2F6FED",
    icon: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6",
    title: "3 new staff signups awaiting approval", badge: null,
    desc: "Marcus Lee, Priya Raman, and Jordan Ellis requested staff accounts for the Austin facility.",
    time: "2 hours ago", actions: [["Review requests", "primary"]],
  },
  {
    id: 5, category: "system", unread: true, iconBg: "#F1F0EA", iconColor: "#6B7280",
    icon: "M9 12l2 2 4-4M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
    title: "Weekly report ready", badge: null,
    desc: "Your Inventory & Fulfillment report for Aug 4–10 has been generated.",
    time: "3 hours ago", actions: [["View report", "outline"]],
  },
  {
    id: 6, category: "system", unread: true, iconBg: "#EAF6EE", iconColor: "#1F9D55",
    icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01 9 11.01",
    title: "Backup completed successfully", badge: null,
    desc: "Nightly database backup finished in 4 minutes with no errors.",
    time: "6 hours ago", actions: [],
  },
  {
    id: 7, category: "users", unread: false, iconBg: "#F1F0EA", iconColor: "#6B7280",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    title: "Nora Haddad updated permissions for Alex Rivera", badge: null,
    desc: "Role changed from Staff to Zone Supervisor.",
    time: "Yesterday", actions: [],
  },
  {
    id: 8, category: "orders", unread: false, iconBg: "#F1F0EA", iconColor: "#6B7280",
    icon: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
    title: "246 orders fulfilled yesterday", badge: null,
    desc: "Daily fulfillment summary: 98.6% on-time, 2.1% return rate.",
    time: "Yesterday", actions: [],
  },
];

const CATEGORIES = [
  ["all", "All"],
  ["inventory", "Inventory"],
  ["users", "Users"],
  ["orders", "Orders"],
  ["system", "System & security"],
];

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
  .an2 .notif-actions { display: flex; gap: 6px; margin-top: 8px; }
  .an2 .btn-sm { height: 28px; padding: 0 11px; border-radius: 6px; font-size: 11.5px; font-weight: 500; cursor: pointer; font-family: inherit; }
  .an2 .btn-sm.outline { background: #FFFFFF; border: 1px solid #D1D5DB; color: #111827; }
  .an2 .btn-sm.primary { background: #2F6FED; border: none; color: #FFFFFF; }
  .an2 .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #2F6FED; margin-top: 5px; flex-shrink: 0; }
  .an2 .unread-spacer { width: 8px; flex-shrink: 0; }
  .an2 .badge { font-size: 10.5px; padding: 2px 8px; border-radius: 6px; font-weight: 600; margin-left: 8px; display: inline-block; }
  .an2 .badge.red { background: #FCEBEB; color: #A32D2D; }
  .an2 .badge.amber { background: #FAEEDA; color: #854F0B; }

  .an2 .app-footer { padding: 10px 0 20px; border-top: 1px solid #E5E5E0; font-size: 11.5px; color: #9CA3AF; text-align: center; flex-shrink: 0; }
  .an2 .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 900px) {
    .an2 .main { padding: 20px; }
    .an2 .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .an2 .kpi-row { grid-template-columns: 1fr; }
    .an2 .notif-actions { flex-wrap: wrap; }
  }
`;

const Icon = ({ d, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

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

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

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
              <div className="kpi-sub" style={{ color: "#A32D2D" }}>
                {notifs.filter((n) => n.unread && n.badge?.[1] === "red").length} need action today
              </div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Low stock alerts</div>
              <div className="kpi-value">{lowStockCount}</div>
              <div className="kpi-sub" style={{ color: "#854F0B" }}>3 critical</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">New signups</div>
              <div className="kpi-value">12</div>
              <div className="kpi-sub">This week</div>
            </div>
            <div className="kpi-card success">
              <div className="kpi-label">System status</div>
              <div className="kpi-value">Operational</div>
              <div className="kpi-sub" style={{ color: "#1F9D55" }}>All services online</div>
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

            {filtered.map((n) => (
              <div className="notif-row" key={n.id} onClick={() => n.unread && markRead(n.id)}>
                {n.unread ? <div className="unread-dot" /> : <div className="unread-spacer" />}
                <div className="notif-icon" style={{ background: n.iconBg }}>
                  <Icon stroke={n.iconColor} d={n.icon} />
                </div>
                <div className="notif-body">
                  <div className={`notif-title${n.unread ? " unread" : ""}`}>
                    {n.title}
                    {n.badge && <span className={`badge ${n.badge[1]}`}>{n.badge[0]}</span>}
                  </div>
                  <div className="notif-desc">{n.desc}</div>
                  <div className="notif-time">{n.time}</div>
                  {n.actions.length > 0 && (
                    <div className="notif-actions" onClick={(e) => e.stopPropagation()}>
                      {n.actions.map(([label, style]) => (
                        <button
                          key={label}
                          className={`btn-sm ${style}`}
                          onClick={() => alert(`Wire this up to: ${label}`)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}