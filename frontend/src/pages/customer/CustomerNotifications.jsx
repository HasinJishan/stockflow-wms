import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const STATUS_ICON = {
  Pending: <Clock size={18} style={{ color: "#64748b" }} />,
  Processing: <Package size={18} style={{ color: "#374151" }} />,
  Shipped: <Truck size={18} style={{ color: "#374151" }} />,
  Delivered: <CheckCircle size={18} style={{ color: "#1F9D55" }} />,
};

const STATUS_TITLE = {
  Pending: (o) => `Order #${o.orderNumber} placed`,
  Processing: (o) => `Order #${o.orderNumber} is being processed`,
  Shipped: (o) => `Order #${o.orderNumber} has shipped`,
  Delivered: (o) => `Order #${o.orderNumber} delivered`,
};

const STATUS_DESC = {
  Pending: (o) => `Your order for $${o.total.toFixed(2)} has been received.`,
  Processing: (o) => `Your order is now being prepared for shipping.`,
  Shipped: (o) => `Your order is on its way to ${o.deliveryAddress}.`,
  Delivered: (o) => `Your order was delivered. We hope you enjoy it!`,
};

const READ_STORAGE_KEY = "sf_read_notifications";

function loadReadIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveReadIds(idSet) {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...idSet]));
}

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

export default function CustomerNotifications() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Initialize from localStorage so read state survives navigation/reload,
  // instead of resetting every time this component mounts.
  const [readIds, setReadIds] = useState(loadReadIds);

  const initials = (user?.name || "PR").slice(0, 2).toUpperCase();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders for notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Derive one notification per order, reflecting its current status
  const notifications = orders.map((o) => ({
    id: o._id,
    category: "Order updates",
    title: STATUS_TITLE[o.status](o),
    description: STATUS_DESC[o.status](o),
    time: timeAgo(o.updatedAt),
    icon: STATUS_ICON[o.status],
    isRead: readIds.has(o._id),
  }));

  const tabs = [
    { name: "All", count: notifications.length },
    { name: "Order updates", count: notifications.length },
  ];

  const handleMarkAllRead = () => {
    const allIds = new Set(orders.map((o) => o._id));
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  const handleMarkOneRead = (id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  };

 const handleLogout = () => {
    if (window.confirm("Log out of StockFlow WMS?")) {
      logout();
      navigate("/login");
    }
  };

  const filtered = activeTab === "All" ? notifications : notifications.filter((n) => n.category === activeTab);

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#111827", padding: "28px 40px", boxSizing: "border-box" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#111827" }}>Notifications</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0 0" }}>
            Updates on your orders, from placement to delivery.
          </p>
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#DCE9FD", color: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: "none" }}
        >
          {initials}
        </button>
      </header>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              style={{
                padding: "6px 14px",
                borderRadius: "99px",
                fontSize: "12.5px",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                backgroundColor: isActive ? "#2F6FED" : "transparent",
                color: isActive ? "#ffffff" : "#6B7280",
              }}
            >
              {tab.name} ({tab.count})
            </button>
          );
        })}
      </div>

      <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #E5E5E0", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #F1F0EA" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>Recent</h2>
          <button onClick={handleMarkAllRead} style={{ fontSize: "12.5px", fontWeight: "600", color: "#2F6FED", background: "none", border: "none", cursor: "pointer" }}>
            Mark all as read
          </button>
        </div>

        <div>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
              No notifications yet — they'll appear here once you place an order.
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && handleMarkOneRead(notif.id)}
                style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: "1px solid #F1F0EA", cursor: notif.isRead ? "default" : "pointer" }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #E5E5E0" }}>
                  {notif.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "13.5px", margin: "0 0 2px 0", fontWeight: "700", color: "#111827" }}>{notif.title}</h3>
                  <p style={{ fontSize: "12.5px", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>{notif.description}</p>
                  <span style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px", display: "block" }}>{notif.time}</span>
                </div>
                {!notif.isRead && <div style={{ width: "7px", height: "7px", backgroundColor: "#2F6FED", borderRadius: "50%", flexShrink: 0 }} />}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: "60px", paddingTop: "16px", borderTop: "1px solid #E5E5E0", fontSize: "11.5px", color: "#9CA3AF", textAlign: "center" }}>
        © 2026 StockFlow WMS. All rights reserved. · <a href="#privacy" style={{ color: "#9CA3AF", textDecoration: "none" }}>Privacy Policy</a> · <a href="#terms" style={{ color: "#9CA3AF", textDecoration: "none" }}>Terms of Service</a>
      </div>
    </div>
  );
}