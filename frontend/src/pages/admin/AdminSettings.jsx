import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const TABS = ["General", "Notifications", "Security", "Billing"];

const LOCATIONS = [
  { name: "Coimbatore — Main warehouse", meta: "14 Industrial Estate Road, Coimbatore, TN · 18 staff", status: "Active", badge: "green" },
  { name: "Chennai — Overflow facility", meta: "Ambattur Industrial Estate, Chennai, TN · 9 staff", status: "Active", badge: "green" },
  { name: "Bengaluru — Regional hub", meta: "Peenya Industrial Area, Bengaluru, KA · Onboarding", status: "Pending setup", badge: "amber" },
];

const NOTIF_TOGGLES = [
  ["lowStock", "Low stock alerts", "Get notified when any product falls below its reorder level.", true],
  ["orderStatus", "Order status updates", "Notify staff when an order changes status.", true],
  ["weeklySummary", "Weekly summary email", "A digest of KPIs sent every Monday morning.", false],
  ["newUsers", "New user sign-ups", "Notify admins when a new account is created.", true],
  ["failedLogins", "Failed login attempts", "Notify admins of repeated failed login attempts on any account.", true],
  ["quietHours", "Quiet hours", "Pause non-urgent notifications between 9 PM and 7 AM local time.", false],
];

const ROLE_RECEIVES = [
  ["Admins receive", "Low stock · New users · Failed logins · Billing"],
  ["Managers receive", "Low stock · Order status · Weekly summary"],
  ["Warehouse staff receive", "Assigned orders · Restock tasks"],
];

const CHANNELS = [
  { channel: "Email — admin@stockflow.com", status: "Connected", badge: "green", action: "Manage", actionBadge: "gray" },
  { channel: "SMS — +91 98765 43210", status: "Connected", badge: "green", action: "Manage", actionBadge: "gray" },
  { channel: "Slack workspace", status: "Not connected", badge: "gray", action: "Connect", actionBadge: "blue" },
];

const RECENT_NOTIFS = [
  ["Low stock: Pallet wrap 20\"", "4 admins", "12 min ago"],
  ["Order #10432 shipped", "Priya Raman", "40 min ago"],
  ["Weekly KPI summary", "4 admins, 3 managers", "Mon, 7:00 AM"],
  ["New user invited: Daniel Lopez", "4 admins", "Yesterday"],
];

const SESSIONS = [
  { device: "Chrome on Windows", meta: "Coimbatore, IN · Current session", badge: "This device", badgeColor: "green", revocable: false },
  { device: "Safari on iPhone", meta: "Coimbatore, IN · Last active 2 hr ago", badge: "Revoke", badgeColor: "gray", revocable: true },
  { device: "Chrome on macOS", meta: "Chennai, IN · Last active 3 days ago", badge: "Revoke", badgeColor: "gray", revocable: true },
];

const PLANS = [
  { name: "Starter", users: "Up to 10", storage: "2 GB", price: "$29/mo", action: "Downgrade", current: false },
  { name: "Business", users: "Up to 50", storage: "10 GB", price: "$149/mo", action: null, current: true },
  { name: "Enterprise", users: "Unlimited", storage: "100 GB", price: "Custom", action: "Contact sales", current: false },
];

const INVOICES = [
  ["INV-2026-07", "Jul 12, 2026", "$149.00"],
  ["INV-2026-06", "Jun 12, 2026", "$149.00"],
  ["INV-2026-05", "May 12, 2026", "$142.00"],
];

const STYLES = `
  .st * { box-sizing: border-box; }
  .st { font-family: 'Inter', sans-serif; max-width: 1400px; }

  .st .settings-nav { display: flex; gap: 4px; border-bottom: 1px solid #E5E5E0; margin-bottom: 24px; overflow-x: auto; }
  .st .settings-tab { padding: 12px 18px; font-size: 14px; color: #6B7280; cursor: pointer; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; font-family: inherit; white-space: nowrap; }
  .st .settings-tab.active { color: #2F6FED; font-weight: 600; border-bottom: 2px solid #2F6FED; }

  .st .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; overflow-x: auto; }
  .st .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; }
  .st .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 12px; flex-wrap: wrap; }

  .st table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 420px; }
  .st th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .st th.num, .st td.num { text-align: right; }
  .st td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; }
  .st tr:last-child td { border-bottom: none; }

  .st .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; border: none; cursor: default; font-family: inherit; }
  .st .badge.green { background: #EAF6EE; color: #1F9D55; }
  .st .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .st .badge.gray { background: #F1F0EA; color: #6B7280; }
  .st .badge.amber { background: #FAEEDA; color: #854F0B; }
  .st .badge.clickable { cursor: pointer; }

  .st .btn-primary { height: 40px; padding: 0 18px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; }
  .st .btn-outline { height: 40px; padding: 0 16px; background: #FFFFFF; color: #111827; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; white-space: nowrap; }
  .st .btn-outline svg, .st .btn-primary svg { width: 16px; height: 16px; }
  .st .btn-danger { height: 38px; padding: 0 16px; background: #FFFFFF; color: #A32D2D; border: 1px solid #E8A9A9; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; font-family: inherit; }

  .st .form-row { margin-bottom: 18px; max-width: 480px; }
  .st .form-row label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .st .form-row input, .st .form-row select { width: 100%; height: 42px; padding: 0 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-family: inherit; font-size: 14px; }
  .st .form-row input:focus, .st .form-row select:focus { outline: none; border-color: #2F6FED; }

  .st .settings-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-bottom: 16px; }

  .st .profile-card { display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; gap: 16px; flex-wrap: wrap; }
  .st .profile-left { display: flex; align-items: center; gap: 16px; }
  .st .profile-avatar { width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; }
  .st .profile-name { font-size: 16px; font-weight: 600; }
  .st .profile-role { font-size: 13px; color: #6B7280; margin-top: 2px; }

  .st .usage-block { margin-bottom: 16px; }
  .st .usage-block:last-child { margin-bottom: 0; }
  .st .usage-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
  .st .usage-label { color: #4B5563; }
  .st .usage-value { color: #6B7280; }
  .st .progress-track { width: 100%; height: 6px; background: #F1F0EA; border-radius: 4px; overflow: hidden; }
  .st .progress-fill { height: 100%; background: #2F6FED; border-radius: 4px; }

  .st .location-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F0EA; gap: 12px; }
  .st .location-row:last-child { border-bottom: none; }
  .st .location-name { font-size: 14px; font-weight: 500; }
  .st .location-meta { font-size: 12px; color: #6B7280; margin-top: 2px; }

  .st .danger-zone { border: 1px solid #F3D0D0; background: #FEF6F6; border-radius: 12px; padding: 20px 24px; }
  .st .danger-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; gap: 12px; flex-wrap: wrap; }
  .st .danger-title { font-size: 14px; font-weight: 600; color: #A32D2D; }
  .st .danger-desc { font-size: 13px; color: #6B7280; margin-top: 2px; max-width: 460px; }

  .st .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #F1F0EA; max-width: 560px; gap: 12px; }
  .st .toggle-row:last-child { border-bottom: none; }
  .st .toggle-title { font-size: 14px; font-weight: 500; }
  .st .toggle-desc { font-size: 13px; color: #6B7280; margin-top: 2px; }
  .st .toggle { width: 40px; height: 22px; border-radius: 999px; background: #D1D5DB; position: relative; flex-shrink: 0; border: none; cursor: pointer; padding: 0; }
  .st .toggle.on { background: #2F6FED; }
  .st .toggle-dot { width: 18px; height: 18px; border-radius: 50%; background: #FFFFFF; position: absolute; top: 2px; left: 2px; transition: left 0.15s ease; }
  .st .toggle.on .toggle-dot { left: 20px; }

  .st .role-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
  .st .role-card { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 10px; padding: 14px 16px; }
  .st .role-card-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
  .st .role-card-desc { font-size: 12px; color: #6B7280; line-height: 1.7; }

  .st .session-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F0EA; gap: 12px; }
  .st .session-row:last-child { border-bottom: none; }
  .st .session-device { font-size: 14px; font-weight: 500; }
  .st .session-meta { font-size: 12px; color: #6B7280; margin-top: 2px; }

  .st .plan-card { display: flex; justify-content: space-between; align-items: center; background: #EFF4FF; border: 1px solid #DCE9FD; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; gap: 16px; flex-wrap: wrap; }
  .st .plan-name { font-size: 18px; font-weight: 700; color: #2F6FED; }
  .st .plan-meta { font-size: 13px; color: #4B5563; margin-top: 4px; }

  .st .payment-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; }
  .st .card-icon { width: 44px; height: 30px; flex-shrink: 0; background: #111827; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 10px; font-weight: 700; }

  .st .password-check { font-size: 13px; color: #4B5563; line-height: 2; }

  .st .invoice-total { border-top: 1px solid #F1F0EA; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: 600; font-size: 14px; }

  .st .app-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .st .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 900px) {
    .st .settings-grid, .st .role-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .st .profile-card, .st .danger-row, .st .plan-card { flex-direction: column; align-items: flex-start; }
  }
`;

function Toggle({ on, onClick }) {
  return (
    <button type="button" className={`toggle${on ? " on" : ""}`} onClick={onClick} aria-pressed={on}>
      <span className="toggle-dot" />
    </button>
  );
}

function GeneralTab({ user }) {
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    name: "StockFlow Logistics Pvt. Ltd.",
    email: "ops@stockflow.com",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-avatar">{(user?.name || "??").slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="profile-name">{user?.name || "Alex Rivera"}</div>
            <div className="profile-role">Admin · {user?.email || "alex@stockflow.com"} · Joined Jan 2026</div>
          </div>
        </div>
        <button className="btn-outline" onClick={() => navigate("/admin/settings/edit-profile")}>Edit profile</button>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <div className="panel-title">Company profile</div>
          <div className="form-row">
            <label>Company name</label>
            <input value={company.name} onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Primary contact email</label>
            <input value={company.email} onChange={(e) => setCompany((c) => ({ ...c, email: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Time zone</label>
            <select defaultValue="chennai">
              <option value="chennai">(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi</option>
            </select>
          </div>
          <div className="form-row">
            <label>Default currency</label>
            <select defaultValue="inr">
              <option value="inr">INR — Indian Rupee</option>
            </select>
          </div>
          <button className="btn-primary" style={{ marginTop: 6 }} onClick={handleSave}>
            {saved ? "Saved ✓" : "Save changes"}
          </button>
        </div>

        <div className="panel">
          <div className="panel-title">Plan &amp; usage</div>
          <div className="usage-block">
            <div className="usage-row"><span className="usage-label">Team members</span><span className="usage-value">37 / 50</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: "74%" }} /></div>
          </div>
          <div className="usage-block">
            <div className="usage-row"><span className="usage-label">Products tracked</span><span className="usage-value">1,284 / Unlimited</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: "40%" }} /></div>
          </div>
          <div className="usage-block">
            <div className="usage-row"><span className="usage-label">Storage used</span><span className="usage-value">2.1 GB / 10 GB</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: "21%" }} /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 14, borderTop: "1px solid #F1F0EA" }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Business plan · renews Aug 12, 2026</div>
            <button className="badge blue clickable" onClick={() => alert("Navigate to Billing tab")}>Manage plan</button>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title" style={{ marginBottom: 0 }}>Warehouse locations</div>
          <button className="btn-outline" onClick={() => alert("Wire this up to your add-location modal")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add location
          </button>
        </div>
        {LOCATIONS.map((l) => (
          <div className="location-row" key={l.name}>
            <div>
              <div className="location-name">{l.name}</div>
              <div className="location-meta">{l.meta}</div>
            </div>
            <span className={`badge ${l.badge}`}>{l.status}</span>
          </div>
        ))}
      </div>

      <div className="danger-zone">
        <div className="panel-title" style={{ color: "#A32D2D" }}>Danger zone</div>
        <div className="danger-row">
          <div>
            <div className="danger-title">Transfer ownership</div>
            <div className="danger-desc">Move account ownership to another admin. This cannot be undone by you afterward.</div>
          </div>
          <button className="btn-danger" onClick={() => window.confirm("Transfer account ownership? This cannot be undone by you afterward.")}>Transfer</button>
        </div>
        <div className="danger-row">
          <div>
            <div className="danger-title">Deactivate account</div>
            <div className="danger-desc">Temporarily suspend access for all users while keeping your data intact.</div>
          </div>
          <button className="btn-danger" onClick={() => window.confirm("Deactivate this account? All users will lose access until reactivated.")}>Deactivate</button>
        </div>
      </div>
    </>
  );
}

function NotificationsTab() {
  const [toggles, setToggles] = useState(
    Object.fromEntries(NOTIF_TOGGLES.map(([key, , , def]) => [key, def]))
  );

  const flip = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-title">Alert preferences</div>
        {NOTIF_TOGGLES.map(([key, title, desc]) => (
          <div className="toggle-row" key={key}>
            <div>
              <div className="toggle-title">{title}</div>
              <div className="toggle-desc">{desc}</div>
            </div>
            <Toggle on={toggles[key]} onClick={() => flip(key)} />
          </div>
        ))}
      </div>

      <div className="role-grid">
        {ROLE_RECEIVES.map(([title, desc]) => (
          <div className="role-card" key={title}>
            <div className="role-card-title">{title}</div>
            <div className="role-card-desc">{desc.split(" · ").join(" · ")}</div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-title">Delivery channels</div>
        <table>
          <thead><tr><th>Channel</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {CHANNELS.map((c) => (
              <tr key={c.channel}>
                <td>{c.channel}</td>
                <td><span className={`badge ${c.badge}`}>{c.status}</span></td>
                <td className="num">
                  <button className={`badge ${c.actionBadge} clickable`} onClick={() => alert(`Wire up: ${c.action} ${c.channel}`)}>
                    {c.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel-title">Recent notifications sent</div>
        <table>
          <thead><tr><th>Notification</th><th>Recipients</th><th>Sent</th></tr></thead>
          <tbody>
            {RECENT_NOTIFS.map(([n, r, t]) => (
              <tr key={n}><td>{n}</td><td>{r}</td><td>{t}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SecurityTab() {
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState(SESSIONS);

  const update = (key) => (e) => setPw((p) => ({ ...p, [key]: e.target.value }));

  const handleUpdatePassword = () => {
    setError("");
    if (!pw.current || !pw.next || !pw.confirm) {
      setError("Please fill in all password fields.");
      return;
    }
    if (pw.next !== pw.confirm) {
      setError("New passwords don't match.");
      return;
    }
    if (pw.next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    alert("Wire this up to your real password-update API.");
    setPw({ current: "", next: "", confirm: "" });
  };

  const revokeSession = (device) => {
    if (window.confirm(`Revoke session on ${device}?`)) {
      setSessions((s) => s.filter((sess) => sess.device !== device));
    }
  };

  return (
    <>
      <div className="settings-grid">
        <div className="panel">
          <div className="panel-title">Change password</div>
          <div className="form-row">
            <label>Current password</label>
            <input type="password" placeholder="Enter current password" value={pw.current} onChange={update("current")} />
          </div>
          <div className="form-row">
            <label>New password</label>
            <input type="password" placeholder="Enter new password" value={pw.next} onChange={update("next")} />
          </div>
          <div className="form-row">
            <label>Confirm new password</label>
            <input type="password" placeholder="Re-enter new password" value={pw.confirm} onChange={update("confirm")} />
            {error && <p style={{ color: "#DC2626", fontSize: 13, marginTop: 6 }}>{error}</p>}
          </div>
          <button className="btn-primary" onClick={handleUpdatePassword}>Update password</button>
        </div>

        <div className="panel">
          <div className="panel-title">Password policy</div>
          <div className="password-check">
            ✓ Minimum 8 characters<br />
            ✓ At least one number<br />
            ✓ At least one uppercase letter<br />
            ✓ Password expires every 90 days
          </div>
          <div className="toggle-row" style={{ paddingTop: 18, marginTop: 10, borderTop: "1px solid #F1F0EA" }}>
            <div>
              <div className="toggle-title">Two-factor authentication</div>
              <div className="toggle-desc">Require a verification code with your password.</div>
            </div>
            <Toggle on={twoFA} onClick={() => setTwoFA((v) => !v)} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Active sessions</div>
        {sessions.map((s) => (
          <div className="session-row" key={s.device}>
            <div>
              <div className="session-device">{s.device}</div>
              <div className="session-meta">{s.meta}</div>
            </div>
            {s.revocable ? (
              <button className={`badge ${s.badgeColor} clickable`} onClick={() => revokeSession(s.device)}>
                {s.badge}
              </button>
            ) : (
              <span className={`badge ${s.badgeColor}`}>{s.badge}</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function BillingTab({ onChangePlan }) {
  const [billingEmail, setBillingEmail] = useState("billing@stockflow.com");

  return (
    <>
      <div className="plan-card">
        <div>
          <div className="plan-name">Business plan</div>
          <div className="plan-meta">Up to 50 users · Unlimited products · Renews Aug 12, 2026</div>
        </div>
        <button className="btn-outline" onClick={onChangePlan}>Change plan</button>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <div className="panel-title">Payment method</div>
          <div className="payment-row">
            <div className="card-icon">VISA</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Visa ending in 4242</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Expires 08/28</div>
            </div>
            <button className="badge gray clickable" style={{ marginLeft: "auto" }} onClick={() => alert("Wire this up to your payment-method update flow")}>
              Update
            </button>
          </div>
          <div className="form-row" style={{ marginTop: 14, marginBottom: 0 }}>
            <label>Billing email</label>
            <input value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} />
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Upcoming invoice</div>
          <div className="usage-row"><span className="usage-label">Business plan (37 seats)</span><span className="usage-value">$129.00</span></div>
          <div className="usage-row"><span className="usage-label">Extra storage (2 GB)</span><span className="usage-value">$8.00</span></div>
          <div className="usage-row"><span className="usage-label">SMS notifications (340 sent)</span><span className="usage-value">$12.00</span></div>
          <div className="invoice-total"><span>Due Aug 12, 2026</span><span>$149.00</span></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-title">Compare plans</div>
        <table>
          <thead><tr><th>Plan</th><th>Users</th><th>Storage</th><th>Price</th><th></th></tr></thead>
          <tbody>
            {PLANS.map((p) => (
              <tr key={p.name}>
                <td>{p.name}{p.current && <span className="badge blue" style={{ marginLeft: 6 }}>Current</span>}</td>
                <td>{p.users}</td>
                <td>{p.storage}</td>
                <td>{p.price}</td>
                <td className="num">
                  {p.action && (
                    <button className="badge blue clickable" onClick={() => alert(`Wire up: ${p.action} to ${p.name}`)}>
                      {p.action}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel-title">Billing history</div>
        <table>
          <thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {INVOICES.map(([id, date, amount]) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{date}</td>
                <td>{amount}</td>
                <td className="num">
                  <button className="badge blue clickable" onClick={() => alert(`Wire this up to download ${id}`)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminSettings() {
  const { user } = useAuth();
  const [tab, setTab] = useState("General");

  return (
    <DashboardLayout title="Settings" subtitle="Manage your company profile, notifications, and security.">
      <div className="st">
        <style>{STYLES}</style>

        <div className="settings-nav">
          {TABS.map((t) => (
            <button
              key={t}
              className={`settings-tab${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "General" && <GeneralTab user={user} />}
        {tab === "Notifications" && <NotificationsTab />}
        {tab === "Security" && <SecurityTab />}
        {tab === "Billing" && <BillingTab onChangePlan={() => setTab("Billing")} />}

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}