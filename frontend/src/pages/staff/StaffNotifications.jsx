import React, { useState, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "assignment",
    category: "assigned",
    message: "You've been assigned to pick",
    highlight: "Order #10436",
    time: "12 min ago",
    unread: true,
    iconColor: "notif-blue",
  },
  {
    id: 2,
    type: "alert",
    category: "alerts",
    message: "Low stock: Pallet wrap 20\" in bin C-11 — 3 left",
    highlight: "",
    time: "40 min ago",
    unread: true,
    iconColor: "notif-amber",
  },
  {
    id: 3,
    type: "update",
    category: "all",
    message: "Your stock update on Barcode scanner X200 was approved",
    highlight: "",
    time: "1 hr ago",
    unread: false,
    iconColor: "notif-green",
  },
  {
    id: 4,
    type: "reminder",
    category: "all",
    message: "Shift reminder: Zone B closes for stock count at 3:30 PM",
    highlight: "",
    time: "2 hr ago",
    unread: true,
    iconColor: "notif-blue",
  },
  {
    id: 5,
    type: "alert",
    category: "alerts",
    message: "Low stock: Shipping labels in bin A-06 — 8 left",
    highlight: "",
    time: "Yesterday",
    unread: true,
    iconColor: "notif-amber",
  },
  {
    id: 6,
    type: "update",
    category: "all",
    message: "Order #10435 marked as shipped",
    highlight: "",
    time: "Yesterday",
    unread: false,
    iconColor: "notif-green",
  },
  {
    id: 7,
    type: "alert",
    category: "alerts",
    message: "Low stock: Stretch film dispenser in bin B-07 — 6 left",
    highlight: "",
    time: "2 days ago",
    unread: false,
    iconColor: "notif-amber",
  },
  {
    id: 8,
    type: "assignment",
    category: "assigned",
    message: "You were assigned to pack",
    highlight: "Order #10439",
    time: "2 days ago",
    unread: false,
    iconColor: "notif-blue",
  },
];

const ICONS = {
  assignment: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  update: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  reminder: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
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
  .notif-row { display: flex; gap: 14px; padding: 16px 20px; border-bottom: 1px solid #F1F0EA; align-items: flex-start; transition: background 0.2s; }
  .notif-row:last-child { border-bottom: none; }
  .notif-row:hover { background: #FAFAFA; }
  
  .notif-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .notif-icon svg { width: 18px; height: 18px; }
  
  .notif-blue { background: #EFF4FF; stroke: #2F6FED; }
  .notif-amber { background: #FAEEDA; stroke: #854F0B; }
  .notif-green { background: #EAF6EE; stroke: #1F9D55; }

  .notif-content { flex: 1; min-width: 0; }
  .notif-text { font-size: 14px; color: #374151; line-height: 1.4; }
  .notif-time { font-size: 12px; color: #9CA3AF; margin-top: 4px; }
  
  .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #2F6FED; margin-top: 6px; flex-shrink: 0; }

  .mark-read-btn { background: none; border: none; color: #2F6FED; font-size: 13px; font-weight: 600; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
  .mark-read-btn:hover { background: #DCE9FD; }

  @media (max-width: 768px) {
    .kpi-row { grid-template-columns: 1fr; }
    .filter-tabs { overflow-x: auto; white-space: nowrap; }
  }
`;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("all");

  // Logic to filter notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((n) => n.category === activeFilter);
  }, [activeFilter, notifications]);

  // Handle Mark All as Read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  // KPIs derived from state
  const unreadCount = notifications.filter((n) => n.unread).length;
  const assignedCount = notifications.filter((n) => n.category === "assigned").length;
  const alertCount = notifications.filter((n) => n.category === "alerts").length;

  return (
    <DashboardLayout 
      title="Notifications" 
      subtitle="Updates assigned to you and Zone B alerts."
      actions={
        <button className="mark-read-btn" onClick={markAllAsRead}>
          Mark all as read
        </button>
      }
    >
      <div className="notif-container">
        <style>{STYLES}</style>

        {/* KPI Section */}
        <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-label">Unread</div>
            <div className="kpi-value">{unreadCount}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Assigned to you</div>
            <div className="kpi-value">{assignedCount}</div>
          </div>
          <div className="kpi-card warning">
            <div className="kpi-label">Active alerts</div>
            <div className="kpi-value">{alertCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button 
            className={`filter-tab ${activeFilter === "assigned" ? "active" : ""}`}
            onClick={() => setActiveFilter("assigned")}
          >
            Assigned to me
          </button>
          <button 
            className={`filter-tab ${activeFilter === "alerts" ? "active" : ""}`}
            onClick={() => setActiveFilter("alerts")}
          >
            Alerts
          </button>
        </div>

        {/* Notifications List */}
        <div className="panel">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div key={n.id} className="notif-row">
                <div className={`notif-icon ${n.iconColor}`}>
                  {ICONS[n.type]}
                </div>
                <div className="notif-content">
                  <div className="notif-text">
                    {n.message} {n.highlight && <strong>{n.highlight}</strong>}
                  </div>
                  <div className="notif-time">{n.time}</div>
                </div>
                {n.unread && <div className="unread-dot"></div>}
              </div>
            ))
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>
              No notifications found in this category.
            </div>
          )}
        </div>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "12px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved.
        </div>
      </div>
    </DashboardLayout>
  );
}