import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MOCK_USERS = {
  "alex-rivera": {
    name: "Alex Rivera", email: "alex@stockflow.com", initials: "AR",
    currentRole: "Admin", status: "Active", warehouse: "Coimbatore",
    joined: "Jan 14, 2026", lastActive: "2 min ago",
    history: [["Admin", "Jan 14, 2026"]],
  },
  "maria-kim": {
    name: "Maria Kim", email: "maria@stockflow.com", initials: "MK",
    currentRole: "Warehouse staff", status: "Active", warehouse: "Coimbatore",
    joined: "Mar 12, 2026", lastActive: "12 min ago",
    history: [["Warehouse staff", "Mar 12, 2026"]],
  },
  "james-osei": {
    name: "James Osei", email: "james@stockflow.com", initials: "JO",
    currentRole: "Manager", status: "Active", warehouse: "Chennai",
    joined: "Feb 3, 2026", lastActive: "1 hr ago",
    history: [["Warehouse staff", "Feb 3, 2026"], ["Manager", "May 18, 2026"]],
  },
  "priya-raman": {
    name: "Priya Raman", email: "priya@warehouse.com", initials: "PR",
    currentRole: "Customer", status: "Active", warehouse: "—",
    joined: "Apr 20, 2026", lastActive: "3 hr ago",
    history: [["Customer", "Apr 20, 2026"]],
  },
  "daniel-lopez": {
    name: "Daniel Lopez", email: "daniel@stockflow.com", initials: "DL",
    currentRole: "Warehouse staff", status: "Invited", warehouse: "Bengaluru",
    joined: "Aug 20, 2026", lastActive: "—",
    history: [["Warehouse staff", "Aug 20, 2026"]],
  },
  "nora-haddad": {
    name: "Nora Haddad", email: "nora@stockflow.com", initials: "NH",
    currentRole: "Admin", status: "Suspended", warehouse: "Coimbatore",
    joined: "Jan 20, 2026", lastActive: "2 days ago",
    history: [["Manager", "Jan 20, 2026"], ["Admin", "Apr 2, 2026"]],
  },
};

const ROLES = [
  ["Admin", "Full access to inventory, orders, users, reports, analytics, and settings."],
  ["Manager", "Manage inventory and orders, view reports and analytics. No billing or user management access."],
  ["Warehouse staff", "Pick and pack orders, update stock counts, view assigned zone inventory."],
  ["Customer", "Place orders, track shipments, manage their own account."],
];

const PERM_LABELS = [
  ["pick", "Pick & pack orders"],
  ["inv", "Manage inventory"],
  ["orders", "Manage orders"],
  ["reports", "View reports & analytics"],
  ["users", "Manage users"],
  ["billing", "Billing access"],
];

const PERMS = {
  Admin: { pick: true, inv: true, orders: true, reports: true, users: true, billing: true },
  Manager: { pick: false, inv: true, orders: true, reports: true, users: false, billing: false },
  "Warehouse staff": { pick: true, inv: false, orders: false, reports: false, users: false, billing: false },
  Customer: { pick: false, inv: false, orders: false, reports: false, users: false, billing: false },
};

const REASONS = ["Promotion", "Role reassignment", "Temporary coverage", "Other"];

const STYLES = `
  .aur * { box-sizing: border-box; }
  .aur { font-family: 'Inter', sans-serif; color: #111827; background: #FAFAF8; min-height: 100vh; display: flex; flex-direction: column; }

  .aur .topnav { display: flex; justify-content: space-between; align-items: center; padding: 0 48px; height: 72px; border-bottom: 1px solid #E5E5E0; flex-shrink: 0; }
  .aur .logo-group { display: flex; align-items: center; gap: 10px; }
  .aur .logo-mark { width: 30px; height: 30px; background: #2F6FED; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .aur .logo-mark svg { width: 16px; height: 16px; }
  .aur .logo-text { font-size: 15px; font-weight: 700; }
  .aur .back-link { display: flex; align-items: center; gap: 6px; font-size: 13.5px; color: #4B5563; cursor: pointer; background: none; border: none; font-family: inherit; }
  .aur .back-link svg { width: 15px; height: 15px; }
  .aur .avatar { width: 34px; height: 34px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }

  .aur .main { padding: 24px 48px 0; display: flex; flex-direction: column; flex: 1; }
  .aur .breadcrumb { font-size: 13px; color: #9CA3AF; margin-bottom: 8px; }
  .aur .breadcrumb span { color: #2F6FED; }
  .aur .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 16px; flex-wrap: wrap; }
  .aur .topbar h1 { font-size: 24px; font-weight: 700; }
  .aur .topbar .sub { font-size: 13px; color: #6B7280; margin-top: 2px; }
  .aur .topbar-actions { display: flex; gap: 10px; flex-shrink: 0; }
  .aur .btn-primary { height: 40px; padding: 0 20px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .aur .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .aur .btn-outline { height: 40px; padding: 0 18px; background: #FFFFFF; color: #111827; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; }

  .aur .content-scroll { flex: 1; max-width: 1600px; width: 100%; }
  .aur .grid { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }
  .aur .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 22px 24px; margin-bottom: 16px; }
  .aur .panel-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
  .aur .user-card { text-align: center; }
  .aur .user-avatar { width: 56px; height: 56px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; margin: 0 auto 10px; }

  .aur .badge { font-size: 11.5px; padding: 3px 10px; border-radius: 7px; font-weight: 600; display: inline-block; }
  .aur .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .aur .badge.green { background: #EAF6EE; color: #1F9D55; }
  .aur .badge.gray { background: #F1F0EA; color: #6B7280; }
  .aur .badge.red { background: #FCEBEB; color: #A32D2D; }

  .aur .info-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #F1F0EA; font-size: 13px; }
  .aur .info-row:last-child { border-bottom: none; }
  .aur .info-label { color: #6B7280; }
  .aur .info-value { font-weight: 500; }

  .aur .role-transition { display: flex; align-items: center; gap: 14px; background: #F9F9F7; border: 1px solid #E5E5E0; border-radius: 10px; padding: 16px 20px; margin-bottom: 16px; }
  .aur .role-chip { flex: 1; text-align: center; padding: 12px; border-radius: 8px; min-width: 0; }
  .aur .role-chip.current { background: #F1F0EA; color: #6B7280; }
  .aur .role-chip.new { background: #EFF4FF; color: #2F6FED; border: 1.5px dashed #2F6FED; }
  .aur .role-chip-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.7; margin-bottom: 4px; }
  .aur .role-chip-value { font-size: 14px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .aur .arrow-icon { flex-shrink: 0; }

  .aur .role-option { display: flex; align-items: flex-start; gap: 10px; border: 1px solid #D1D5DB; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; background: none; width: 100%; text-align: left; font-family: inherit; }
  .aur .role-option:last-child { margin-bottom: 0; }
  .aur .role-option.selected { border-color: #2F6FED; background: #EFF4FF; }
  .aur .role-radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #D1D5DB; flex-shrink: 0; margin-top: 2px; }
  .aur .role-radio.checked { border-color: #2F6FED; background: #2F6FED; box-shadow: inset 0 0 0 3px #FFFFFF; }
  .aur .role-title { font-size: 13.5px; font-weight: 600; color: #111827; }
  .aur .role-desc { font-size: 12px; color: #6B7280; margin-top: 2px; }

  .aur .perm-compare { display: grid; grid-template-columns: 1fr 40px 1fr; gap: 6px; align-items: center; font-size: 12.5px; padding: 7px 0; border-bottom: 1px solid #F1F0EA; }
  .aur .perm-compare:last-child { border-bottom: none; }
  .aur .perm-compare .label { color: #374151; }
  .aur .perm-compare .head { font-weight: 600; color: #9CA3AF; font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .aur .perm-yes { color: #1F9D55; text-align: center; font-weight: 700; }
  .aur .perm-no { color: #C1C0B8; text-align: center; font-weight: 700; }

  .aur .form-row { margin-bottom: 14px; }
  .aur .form-row:last-child { margin-bottom: 0; }
  .aur .form-row label { display: block; font-size: 12.5px; font-weight: 500; color: #374151; margin-bottom: 5px; }
  .aur .form-row input, .aur .form-row select { width: 100%; height: 38px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 7px; font-family: inherit; font-size: 13.5px; }
  .aur .form-row input:focus, .aur .form-row select:focus { outline: none; border-color: #2F6FED; }
  .aur .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .aur .history-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #F1F0EA; font-size: 12.5px; }
  .aur .history-row:last-child { border-bottom: none; }

  .aur .app-footer { padding: 12px 0 20px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .aur .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 900px) {
    .aur .topnav, .aur .main { padding-left: 20px; padding-right: 20px; }
    .aur .grid { grid-template-columns: 1fr; }
    .aur .logo-text { display: none; }
  }
  @media (max-width: 560px) {
    .aur .form-2col { grid-template-columns: 1fr; }
    .aur .role-transition { flex-direction: column; }
    .aur .arrow-icon { transform: rotate(90deg); }
  }
`;

const LogoMark = () => (
  <div className="logo-mark">
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  </div>
);

export default function AdminUpdateRole() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = MOCK_USERS[userId] || MOCK_USERS["maria-kim"];

  const [newRole, setNewRole] = useState(
    ROLES.find(([name]) => name !== user.currentRole)?.[0] || "Manager"
  );
  const [reason, setReason] = useState(REASONS[0]);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const currentPerms = PERMS[user.currentRole];
  const newPerms = PERMS[newRole];

  const handleSave = () => {
    if (newRole === user.currentRole) {
      alert("Select a different role to save a change.");
      return;
    }
    setSaving(true);
    // Replace with your real role-update API call, e.g.:
    // await fetch(`/api/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ newRole, reason, effectiveDate, notes }) });
    setTimeout(() => {
      setSaving(false);
      alert(`${user.name}'s role changed from ${user.currentRole} to ${newRole}. Wire this up to your API.`);
      navigate("/admin/users");
    }, 600);
  };

  return (
    <div className="aur">
      <style>{STYLES}</style>

      <div className="topnav">
        <div className="logo-group">
          <LogoMark />
          <div className="logo-text">StockFlow WMS</div>
        </div>
        <button className="back-link" onClick={() => navigate("/admin/users")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Users
        </button>
        <div className="avatar">AD</div>
      </div>

      <div className="main">
        <div className="breadcrumb"><span>Users</span> / {user.name} / Update role</div>
        <div className="topbar">
          <div>
            <h1>Update role</h1>
            <p className="sub">Change access level for {user.name}.</p>
          </div>
          <div className="topbar-actions">
            <button className="btn-outline" onClick={() => navigate("/admin/users")}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save role change"}
            </button>
          </div>
        </div>

        <div className="content-scroll">
          <div className="grid">
            <div>
              <div className="panel user-card">
                <div className="user-avatar">{user.initials}</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{user.email}</div>
              </div>

              <div className="panel">
                <div className="panel-title">User details</div>
                <div className="info-row"><span className="info-label">Current role</span><span className="badge gray">{user.currentRole}</span></div>
                <div className="info-row"><span className="info-label">Status</span><span className={`badge ${{ Active: "green", Invited: "gray", Suspended: "red" }[user.status]}`}>{user.status}</span></div>
                <div className="info-row"><span className="info-label">Warehouse</span><span className="info-value">{user.warehouse}</span></div>
                <div className="info-row"><span className="info-label">Joined</span><span className="info-value">{user.joined}</span></div>
                <div className="info-row"><span className="info-label">Last active</span><span className="info-value">{user.lastActive}</span></div>
              </div>

              <div className="panel">
                <div className="panel-title">Role change history</div>
                {user.history.map(([role, date]) => (
                  <div className="history-row" key={role + date}>
                    <span>{role}</span><span style={{ color: "#9CA3AF" }}>{date}</span>
                  </div>
                ))}
                {user.history.length <= 1 && (
                  <div className="history-row" style={{ color: "#9CA3AF" }}>No prior changes</div>
                )}
              </div>
            </div>

            <div>
              <div className="panel">
                <div className="panel-title">Role transition</div>
                <div className="role-transition">
                  <div className="role-chip current">
                    <div className="role-chip-label">Current</div>
                    <div className="role-chip-value">{user.currentRole}</div>
                  </div>
                  <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                  <div className="role-chip new">
                    <div className="role-chip-label">New role</div>
                    <div className="role-chip-value">{newRole}</div>
                  </div>
                </div>

                {ROLES.map(([name, desc]) => (
                  <button
                    key={name}
                    type="button"
                    className={`role-option${newRole === name ? " selected" : ""}`}
                    onClick={() => setNewRole(name)}
                  >
                    <div className={`role-radio${newRole === name ? " checked" : ""}`} />
                    <div>
                      <div className="role-title">{name}</div>
                      <div className="role-desc">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="panel">
                <div className="panel-title">What changes</div>
                <div className="perm-compare">
                  <span></span>
                  <span className="head" style={{ textAlign: "center" }}>{user.currentRole}</span>
                  <span className="head" style={{ textAlign: "right" }}>{newRole}</span>
                </div>
                {PERM_LABELS.map(([key, label]) => (
                  <div className="perm-compare" key={key}>
                    <span className="label">{label}</span>
                    <span className={currentPerms[key] ? "perm-yes" : "perm-no"}>{currentPerms[key] ? "✓" : "✕"}</span>
                    <span className={newPerms[key] ? "perm-yes" : "perm-no"}>{newPerms[key] ? "✓" : "✕"}</span>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-title">Change details</div>
                <div className="form-2col">
                  <div className="form-row">
                    <label>Reason for change</label>
                    <select value={reason} onChange={(e) => setReason(e.target.value)}>
                      {REASONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Effective date</label>
                    <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <label>Notes (optional)</label>
                  <input
                    placeholder="e.g. Promoted after 6-month performance review"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}