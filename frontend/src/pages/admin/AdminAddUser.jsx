import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const WAREHOUSES = [
  "Coimbatore — Main warehouse",
  "Chennai — Overflow facility",
  "Bengaluru — Regional hub",
];

const ROLES = [
  ["Admin", "Full access to inventory, orders, users, reports, analytics, and settings."],
  ["Manager", "Manage inventory and orders, view reports and analytics. No billing or user management access."],
  ["Warehouse staff", "Pick and pack orders, update stock counts, view assigned zone inventory."],
  ["Customer", "Place orders, track shipments, manage their own account."],
];

const ROLE_PERMS = {
  Admin: [["Manage inventory", true], ["Manage orders", true], ["Manage users", true], ["View analytics & reports", true], ["Access billing", true], ["Change settings", true]],
  Manager: [["Manage inventory", true], ["Manage orders", true], ["View analytics & reports", true], ["Manage users", false], ["Access billing", false]],
  "Warehouse staff": [["Pick & pack orders", true], ["Update stock counts", true], ["View assigned zone inventory", true], ["Manage users", false], ["View analytics & reports", false], ["Access billing", false]],
  Customer: [["Place orders", true], ["Track shipments", true], ["Manage own account", true], ["Manage inventory", false], ["View analytics & reports", false], ["Access billing", false]],
};

const STYLES = `
  .au2 * { box-sizing: border-box; }
  .au2 { font-family: 'Inter', sans-serif; }

  .au2 .grid { display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: start; }
  .au2 .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; }
  .au2 .panel-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; }

  .au2 .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .au2 .form-row { margin-bottom: 14px; }
  .au2 .form-row:last-child { margin-bottom: 0; }
  .au2 .form-row label { display: block; font-size: 12.5px; font-weight: 500; color: #374151; margin-bottom: 5px; }
  .au2 .form-row input, .au2 .form-row select { width: 100%; height: 38px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 7px; font-family: inherit; font-size: 13.5px; }
  .au2 .form-row input:focus, .au2 .form-row select:focus { outline: none; border-color: #2F6FED; }

  .au2 .role-option { display: flex; align-items: flex-start; gap: 10px; border: 1px solid #D1D5DB; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; background: none; width: 100%; text-align: left; font-family: inherit; }
  .au2 .role-option:last-child { margin-bottom: 0; }
  .au2 .role-option.selected { border-color: #2F6FED; background: #EFF4FF; }
  .au2 .role-radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #D1D5DB; flex-shrink: 0; margin-top: 2px; }
  .au2 .role-radio.checked { border-color: #2F6FED; background: #2F6FED; box-shadow: inset 0 0 0 3px #FFFFFF; }
  .au2 .role-title { font-size: 13.5px; font-weight: 600; color: #111827; }
  .au2 .role-desc { font-size: 12px; color: #6B7280; margin-top: 2px; }

  .au2 .status-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; gap: 12px; }
  .au2 .status-title { font-size: 13.5px; font-weight: 500; }
  .au2 .toggle { width: 38px; height: 21px; border-radius: 999px; background: #D1D5DB; position: relative; flex-shrink: 0; border: none; cursor: pointer; padding: 0; }
  .au2 .toggle.on { background: #2F6FED; }
  .au2 .toggle-dot { width: 17px; height: 17px; border-radius: 50%; background: #FFFFFF; position: absolute; top: 2px; left: 2px; transition: left 0.15s ease; }
  .au2 .toggle.on .toggle-dot { left: 19px; }
  .au2 .panel-hint { font-size: 12px; color: #9CA3AF; margin-top: 4px; }

  .au2 .avatar-preview { width: 56px; height: 56px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; margin: 0 auto 10px; }
  .au2 .preview-hint { font-size: 13px; color: #6B7280; text-align: center; }

  .au2 .perm-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: 12.5px; }
  .au2 .perm-check { width: 16px; height: 16px; border-radius: 4px; background: #EAF6EE; color: #1F9D55; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
  .au2 .perm-check.off { background: #F1F0EA; color: #C1C0B8; }
  .au2 .perm-sub { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; margin-top: -6px; }

  .au2 .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .au2 .badge.gray { background: #F1F0EA; color: #6B7280; }

  .au2 .error { font-size: 12px; color: #DC2626; margin-top: 6px; }

  .au2 .app-footer { margin-top: 14px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .au2 .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1000px) {
    .au2 .grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .au2 .form-2col { grid-template-columns: 1fr; }
  }
`;

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    warehouse: WAREHOUSES[0], jobTitle: "",
  });
  const [role, setRole] = useState("Warehouse staff");
  const [sendInvite, setSendInvite] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const initials = () => {
    const a = form.firstName.trim()[0] || "";
    const b = form.lastName.trim()[0] || "";
    return (a + b).toUpperCase() || "?";
  };

  const handleSave = async () => {
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('sf_token');
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
      const res = await axios.post(
        'https://stockflow-wms-backend.onrender.com/api/users',
        { fullName, email: form.email.trim(), role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`User "${fullName}" added as ${role}.\n\nTemporary password: ${res.data.tempPassword}\n\nShare this with them securely — they can change it after logging in.`);
      navigate("/admin/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Add user"
      subtitle="Create an account and set access permissions for a new team member."
      breadcrumb={<><Link to="/admin/users">Users</Link> / Add user</>}
      actions={
        <>
          <button className="topbar-btn-outline" onClick={() => navigate("/admin/users")}>Cancel</button>
          <button className="topbar-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Adding…" : "Add user"}
          </button>
        </>
      }
    >
      <div className="au2">
        <style>{STYLES}</style>

        <div className="grid">
          <div>
            <div className="panel">
              <div className="panel-title">Basic information</div>
              <div className="form-2col">
                <div className="form-row"><label>First name</label><input placeholder="e.g. Daniel" value={form.firstName} onChange={update("firstName")} /></div>
                <div className="form-row"><label>Last name</label><input placeholder="e.g. Lopez" value={form.lastName} onChange={update("lastName")} /></div>
              </div>
              <div className="form-2col">
                <div className="form-row"><label>Email address</label><input placeholder="name@stockflow.com" value={form.email} onChange={update("email")} /></div>
                <div className="form-row"><label>Phone number</label><input placeholder="+91 00000 00000" value={form.phone} onChange={update("phone")} /></div>
              </div>
              <div className="form-2col">
                <div className="form-row">
                  <label>Warehouse location</label>
                  <select value={form.warehouse} onChange={update("warehouse")}>
                    {WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div className="form-row"><label>Job title</label><input placeholder="e.g. Warehouse Associate" value={form.jobTitle} onChange={update("jobTitle")} /></div>
              </div>
              {error && <p className="error">{error}</p>}
            </div>

            <div className="panel">
              <div className="panel-title">Role</div>
              {ROLES.map(([name, desc]) => (
                <button
                  key={name}
                  type="button"
                  className={`role-option${role === name ? " selected" : ""}`}
                  onClick={() => setRole(name)}
                >
                  <div className={`role-radio${role === name ? " checked" : ""}`} />
                  <div>
                    <div className="role-title">{name}</div>
                    <div className="role-desc">{desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Send invitation</div>
              <div className="status-row">
                <div className="status-title">Email invite to set up password</div>
                <button
                  type="button"
                  className={`toggle${sendInvite ? " on" : ""}`}
                  onClick={() => setSendInvite((v) => !v)}
                  aria-pressed={sendInvite}
                >
                  <span className="toggle-dot" />
                </button>
              </div>
              <p className="panel-hint">If off, you'll need to set a temporary password manually below.</p>
            </div>
          </div>

          <div>
            <div className="panel" style={{ textAlign: "center" }}>
              <div className="avatar-preview">{initials()}</div>
              <div className="preview-hint">Preview updates as you fill in the form.</div>
            </div>

            <div className="panel">
              <div className="panel-title">Permissions preview</div>
              <p className="perm-sub">Based on {role} role</p>
              {ROLE_PERMS[role].map(([label, allowed]) => (
                <div className="perm-row" key={label}>
                  <div className={`perm-check${allowed ? "" : " off"}`}>{allowed ? "✓" : "✕"}</div>
                  {label}
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Note</div>
              <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6 }}>
                New users appear as <span className="badge gray">Invited</span> until they accept and set a password. You can resend or revoke the invite anytime from the Users page.
              </p>
            </div>
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}