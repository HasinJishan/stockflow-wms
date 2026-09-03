import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  Package, 
  Truck, 
  AlertCircle, 
  RotateCcw, 
  User 
} from "lucide-react";

export default function CustomerNotifications() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("All");

  const initials = (user?.name || "PR").slice(0, 2).toUpperCase();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      category: "Shipping",
      title: "Order #10245 has shipped",
      description: "Your package left the Austin facility and is on its way.",
      time: "10 minutes ago",
      icon: <Package size={18} style={{ color: "#374151" }} />,
      iconBg: "#f8fafc",
      isRead: false,
    },
    {
      id: 2,
      category: "Shipping",
      title: "Out for delivery",
      description: "Order #10231 is out for delivery, expected by 6:00 PM today.",
      time: "1 hour ago",
      icon: <Truck size={18} style={{ color: "#374151" }} />,
      iconBg: "#f8fafc",
      isRead: false,
    },
    {
      id: 3,
      category: "Account",
      title: "Payment method expiring soon",
      description: "Your Visa ending in 4821 expires this month. Update it to avoid delays.",
      time: "3 hours ago",
      icon: <AlertCircle size={18} style={{ color: "#374151" }} />,
      iconBg: "#f8fafc",
      isRead: false,
    },
    {
      id: 4,
      category: "Order updates",
      title: "Order #10198 delivered",
      description: "Delivered and signed for at your address.",
      time: "Yesterday",
      icon: <Package size={18} style={{ color: "#64748b" }} />,
      iconBg: "#f8fafc",
      isRead: true,
    },
    {
      id: 5,
      category: "Order updates",
      title: "Item back in stock",
      description: "Ceramic Storage Jar is back in stock — it's still in your saved items.",
      time: "Yesterday",
      icon: <RotateCcw size={18} style={{ color: "#64748b" }} />,
      iconBg: "#f8fafc",
      isRead: true,
    },
    {
      id: 6,
      category: "Account",
      title: "Password changed",
      description: "Your account password was changed successfully.",
      time: "2 days ago",
      icon: <User size={18} style={{ color: "#64748b" }} />,
      iconBg: "#f8fafc",
      isRead: true,
    },
    {
      id: 7,
      category: "Order updates",
      title: "Order #10176 delivered",
      description: "Delivered and signed for at your address.",
      time: "4 days ago",
      icon: <Package size={18} style={{ color: "#64748b" }} />,
      iconBg: "#f8fafc",
      isRead: true,
    },
  ]);

  const tabs = [
    { name: "All", count: 18 },
    { name: "Order updates", count: 9 },
    { name: "Shipping", count: 5 },
    { name: "Account", count: 4 },
  ];

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleLogout = () => {
    if (window.confirm("Log out of StockFlow WMS?")) {
      logout();
    }
  };

  const filteredNotifications = activeTab === "All"
    ? notifications
    : notifications.filter((n) => n.category === activeTab);

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#111827", padding: "28px 40px", boxSizing: "border-box" }}>
      
      {/* HEADER TOPBAR */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#111827" }}>Notifications</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0 0" }}>
            Order updates, shipping alerts, and account activity in one place.
          </p>
        </div>

        {/* Profile Avatar */}
        <button
          onClick={handleLogout}
          title="Log out"
          style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#DCE9FD", color: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: "none" }}
        >
          {initials}
        </button>
      </header>

      {/* FILTER TABS */}
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
                transition: "all 0.15s ease",
              }}
            >
              {tab.name} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* NOTIFICATIONS CONTAINER CARD */}
      <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #E5E5E0", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #F1F0EA" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>Recent</h2>
          <button
            onClick={handleMarkAllRead}
            style={{ fontSize: "12.5px", fontWeight: "600", color: "#2F6FED", background: "none", border: "none", cursor: "pointer" }}
          >
            Mark all as read
          </button>
        </div>

        <div>
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 24px",
                borderBottom: "1px solid #F1F0EA",
                backgroundColor: "#ffffff",
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: notif.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: "1px solid #E5E5E0",
                }}
              >
                {notif.icon}
              </div>

              {/* Text Area */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "13.5px", margin: "0 0 2px 0", fontWeight: "700", color: "#111827" }}>
                  {notif.title}
                </h3>
                <p style={{ fontSize: "12.5px", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
                  {notif.description}
                </p>
                <span style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px", display: "block" }}>
                  {notif.time}
                </span>
              </div>

              {/* Blue Unread Dot */}
              {!notif.isRead && (
                <div style={{ width: "7px", height: "7px", backgroundColor: "#2F6FED", borderRadius: "50%", flexShrink: 0 }} />
              )}
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
              No notifications in this category.
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "60px", paddingTop: "16px", borderTop: "1px solid #E5E5E0", fontSize: "11.5px", color: "#9CA3AF", textAlign: "center" }}>
        © 2026 StockFlow WMS. All rights reserved. · <a href="#privacy" style={{ color: "#9CA3AF", textDecoration: "none" }}>Privacy Policy</a> · <a href="#terms" style={{ color: "#9CA3AF", textDecoration: "none" }}>Terms of Service</a>
      </div>
    </div>
  );
}