import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ICONS = {
  Dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </>
  ),
  Inventory: (
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  ),
  Orders: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>
  ),
  Users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  Reports: (
    <>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </>
  ),
  Analytics: (
    <>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>
  ),
  Settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  "Pick & pack": (
    <>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  "Stock updates": (
    <>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </>
  ),
  Notifications: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  "My orders": (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>
  ),
  "Track shipment": (
    <>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </>
  ),
  "Saved items": (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  Addresses: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  Account: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  "Help & support": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
};

const NAV_BY_ROLE = {
  admin: [
    ["Dashboard", "/admin"],
    ["Inventory", "/admin/inventory"],
    ["Orders", "/admin/orders"],
    ["Users", "/admin/users"],
    ["Reports", "/admin/reports"],
    ["Analytics", "/admin/analytics"],
    ["Settings", "/admin/settings"],
  ],
  staff: [
    ["Dashboard", "/staff"],
    ["Pick & pack", "/staff/pick-pack"],
    ["Inventory", "/staff/inventory"],
    ["Stock updates", "/staff/stock-updates"],
    ["Notifications", "/staff/notifications"],
    ["Analytics", "/staff/analytics"],
    ["Account", "/staff/account"],
    ["Help & support", "/staff/help"],
  ],
  customer: [
    ["My orders", "/customer"],
    ["Track shipment", "/customer/track-shipment"],
    ["Saved items", "/customer/saved-items"],
    ["Addresses", "/customer/addresses"],
    ["Analytics", "/customer/analytics"],
    ["Account", "/customer/account"],
    ["Help & support", "/customer/help"],
  ],
};

// Renders a divider line in the sidebar right after this nav label, per role
const DIVIDER_AFTER = {
  customer: "Analytics",
  staff: "Analytics",
};

const SIDEBAR_ROLE_LABEL = {
  customer: "Customer",
  staff: "Warehouse Staff · Zone B",
};

const STYLES = `
  .dl * { box-sizing: border-box; }
  .dl { min-height: 100vh; background: #FAFAF8; font-family: 'Inter', sans-serif; color: #111827; display: grid; grid-template-columns: 240px 1fr; }
  .dl.collapsed { grid-template-columns: 76px 1fr; }

  .dl .sidebar { background: #F3F2EC; border-right: 1px solid #E5E5E0; padding: 24px 16px; overflow: hidden; display: flex; flex-direction: column; }
  .dl .logo-group { display: flex; align-items: center; gap: 8px; padding: 8px; margin-bottom: 28px; }
  .dl .logo-mark { width: 32px; height: 32px; flex-shrink: 0; background: #2F6FED; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .dl .logo-mark svg { width: 18px; height: 18px; }
  .dl .logo-text { font-size: 16px; font-weight: 700; white-space: nowrap; }
  .dl.collapsed .logo-text { display: none; }

  .dl .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; color: #4B5563; margin-bottom: 2px; text-decoration: none; white-space: nowrap; overflow: hidden; }
  .dl .nav-item svg { width: 18px; height: 18px; flex-shrink: 0; stroke: #4B5563; }
  .dl .nav-item.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }
  .dl .nav-item.active svg { stroke: #2F6FED; }
  .dl .nav-item:hover:not(.active) { background: #EDEBE4; }
  .dl.collapsed .nav-item span { display: none; }

  .dl .nav-divider { height: 1px; background: #E5E5E0; margin: 14px 4px; flex-shrink: 0; }

  .dl .sidebar-profile { margin-top: auto; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: #FFFFFF; border: 1px solid #E5E5E0; flex-shrink: 0; }
  .dl .sp-avatar { width: 32px; height: 32px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
  .dl .sp-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dl .sp-role { font-size: 11.5px; color: #6B7280; text-transform: capitalize; }
  .dl.collapsed .sidebar-profile { padding: 8px; justify-content: center; }
  .dl.collapsed .sp-name, .dl.collapsed .sp-role { display: none; }

  .dl .logo-group { justify-content: flex-start; }
  .dl.collapsed .logo-group { flex-direction: column; gap: 10px; align-items: center; }
  .dl .side-toggle { width: 28px; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background: transparent; cursor: pointer; }
  .dl .side-toggle svg { width: 16px; height: 16px; stroke: #6B7280; transition: transform 0.2s ease; }
  .dl .side-toggle:hover { background: #EDEBE4; }
  .dl.collapsed .side-toggle svg { transform: rotate(180deg); }

  .dl .main { padding: 32px 40px; min-width: 0; }
  .dl .breadcrumb { font-size: 13px; color: #9CA3AF; margin-bottom: 8px; }
  .dl .breadcrumb a { color: #2F6FED; text-decoration: none; }
  .dl .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
  .dl .topbar h1 { font-size: 26px; font-weight: 700; }
  .dl .topbar .sub { font-size: 13px; color: #6B7280; margin-top: 2px; }
  .dl .topbar-right { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
  .dl .bell { background: none; border: none; cursor: pointer; padding: 4px; display: flex; flex-shrink: 0; position: relative; }
  .dl .bell svg { width: 20px; height: 20px; stroke: #4B5563; }
  .dl .bell-dot { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; border-radius: 50%; background: #A32D2D; border: 1.5px solid #FAFBFA; }
  .dl .avatar { width: 36px; height: 36px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; cursor: pointer; border: none; flex-shrink: 0; }

  .dl .topbar-btn { height: 40px; padding: 0 18px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; white-space: nowrap; flex-shrink: 0; }
  .dl .topbar-btn svg { width: 16px; height: 16px; stroke: #FFFFFF; flex-shrink: 0; }
  .dl .topbar-btn:hover { background: #255BC7; }
  .dl .topbar-btn-outline { height: 40px; padding: 0 16px; background: #FFFFFF; color: #111827; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; white-space: nowrap; flex-shrink: 0; }
  .dl .topbar-btn-outline svg { width: 16px; height: 16px; stroke: #111827; flex-shrink: 0; }

  .dl .topbar-filter-tabs { display: flex; gap: 6px; flex-shrink: 0; }
  .dl .topbar-filter-tab { padding: 7px 14px; border-radius: 8px; font-size: 12.5px; color: #6B7280; cursor: pointer; background: none; border: none; font-family: inherit; white-space: nowrap; }
  .dl .topbar-filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }

  .dl .mobile-toggle { display: none; }
  .dl .backdrop { display: none; }

  @media (max-width: 900px) {
    .dl { grid-template-columns: 1fr; }
    .dl.collapsed { grid-template-columns: 1fr; }
    .dl .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 240px; z-index: 40; transform: translateX(-100%); transition: transform 0.2s ease; }
    .dl .sidebar.open { transform: translateX(0); }
    .dl.collapsed .sidebar { width: 240px; }
    .dl.collapsed .logo-text, .dl.collapsed .nav-item span { display: block; }
    .dl .side-toggle { display: none; }
    .dl .mobile-toggle { display: flex; width: 36px; height: 36px; border: 1px solid #D1D5DB; border-radius: 8px; background: #FFFFFF; align-items: center; justify-content: center; cursor: pointer; }
    .dl .mobile-toggle svg { width: 18px; height: 18px; stroke: #111827; }
    .dl .backdrop.show { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 30; }
    .dl .main { padding: 20px; }
    .dl .topbar h1 { font-size: 20px; }
  }

  @media (max-width: 560px) {
    .dl .topbar-btn span.btn-label, .dl .topbar-btn-outline span.btn-label { display: none; }
    .dl .topbar-btn, .dl .topbar-btn-outline { width: 40px; padding: 0; justify-content: center; }
    .dl .topbar-right { width: 100%; justify-content: space-between; }
    .dl .topbar-filter-tabs { overflow-x: auto; }
  }
`;

function Icon({ children, size = 18, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      {children}
    </svg>
  );
}

const LogoMark = () => (
  <div className="logo-mark">
    <Icon stroke="#fff">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </Icon>
  </div>
);

export default function DashboardLayout({ title, subtitle, breadcrumb, actions, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV_BY_ROLE[user?.role] || [];
  const notifPath = items.find(([label]) => label === "Notifications")?.[1] || "/admin/notifications";
  const initials = (user?.name || "??").slice(0, 2).toUpperCase();
  // TODO: replace with a real unread count from your notifications API/context
  const unreadCount = 6;

  const handleAvatarClick = () => {
    if (window.confirm("Log out of StockFlow WMS?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className={`dl${collapsed ? " collapsed" : ""}`}>
      <style>{STYLES}</style>

      <div className={`backdrop${mobileOpen ? " show" : ""}`} onClick={() => setMobileOpen(false)} />

      <aside className={`sidebar${mobileOpen ? " open" : ""}`}>
        <div className="logo-group">
          <button className="side-toggle" onClick={() => setCollapsed((c) => !c)} aria-label="Collapse sidebar">
            <Icon stroke="#6B7280"><polyline points="15 18 9 12 15 6" /></Icon>
          </button>
          <LogoMark />
          <div className="logo-text">StockFlow WMS</div>
        </div>

        {items.map(([label, path]) => (
          <React.Fragment key={path}>
            <Link
              to={path}
              className={`nav-item${location.pathname === path ? " active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon>{ICONS[label]}</Icon>
              <span>{label}</span>
            </Link>
            {DIVIDER_AFTER[user?.role] === label && <div className="nav-divider" />}
          </React.Fragment>
        ))}

        {(user?.role === "customer" || user?.role === "staff") && (
          <div className="sidebar-profile">
            <div className="sp-avatar">{initials}</div>
            <div>
              <div className="sp-name">{user?.name || "User"}</div>
              <div className="sp-role">{SIDEBAR_ROLE_LABEL[user?.role] || user?.role}</div>
            </div>
          </div>
        )}
      </aside>

      <div className="main">
        {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="mobile-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
              <Icon stroke="#111827"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></Icon>
            </button>
            <div>
              <h1>{title}</h1>
              {subtitle && <p className="sub">{subtitle}</p>}
            </div>
          </div>

          <div className="topbar-right">
            {actions}
            {(user?.role === "admin" || user?.role === "staff") && (
              <button className="bell" aria-label="Notifications" onClick={() => navigate(notifPath)}>
                <Icon stroke="#4B5563">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </Icon>
                {unreadCount > 0 && <span className="bell-dot" />}
              </button>
            )}
            <button className="avatar" onClick={handleAvatarClick} title="Log out">{initials}</button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}