import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const STYLES = `
  .sa * { box-sizing: border-box; }
  .sa { font-family: 'Inter', sans-serif; }
  .sa .settings-grid { display: grid; grid-template-columns: 320px 1fr; gap: 20px; }
  
  .sa .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .sa .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; color: #111827; }
  
  .sa .profile-card { text-align: center; }
  .sa .profile-avatar { width: 64px; height: 64px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; margin: 0 auto 12px; }
  
  .sa .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .sa .form-row { margin-bottom: 16px; }
  .sa .form-row label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .sa .form-row input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; font-family: inherit; }
  
  .sa .btn-primary { background: #2F6FED; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .sa .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .sa .btn-outline { background: #fff; border: 1px solid #D1D5DB; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; font-family: inherit; }

  .sa .success-msg { font-size: 13px; color: #1F9D55; margin-bottom: 10px; }
  .sa .error-msg { font-size: 13px; color: #DC2626; margin-bottom: 10px; }

  .sa .info-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
  .sa .info-row span:first-child { color: #6B7280; }
  .sa .info-row b { font-weight: 600; }

  .sa .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F0EA; }
  .sa .toggle-row:last-child { border-bottom: none; }
  .sa .toggle-title { font-size: 14px; font-weight: 500; }
  .sa .toggle-desc { font-size: 12px; color: #6B7280; margin-top: 2px; }
  
  .sa .switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
  .sa .switch input { opacity: 0; width: 0; height: 0; }
  .sa .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #D1D5DB; transition: .3s; border-radius: 24px; }
  .sa .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
  .sa input:checked + .slider { background-color: #2F6FED; }
  .sa input:checked + .slider:before { transform: translateX(20px); }

  .sa .note { font-size: 11.5px; color: #9CA3AF; margin-top: 10px; }

  @media (max-width: 1024px) {
    .sa .settings-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .sa .form-2col { grid-template-columns: 1fr; }
  }
`;

export default function StaffAccount() {
  const { user, updateUser } = useAuth();

  // Profile form
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password form
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  // Notification preferences (local only — not persisted, see note below)
  const [notifPrefs, setNotifPrefs] = useState({ tasks: true, stock: true, shifts: false });

  useEffect(() => {
    if (user) {
      const [first, ...rest] = (user.name || "").split(" ");
      setForm({ firstName: first || "", lastName: rest.join(" ") || "", email: user.email || "" });
    }
    setLoading(false);
  }, [user]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const initials = (user?.name || "??").slice(0, 2).toUpperCase();

  const handleSaveProfile = async () => {
    setProfileError("");
    if (!form.firstName.trim() || !form.email.trim()) {
      setProfileError("First name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("sf_token");
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      await axios.put(
        "https://stockflow-wms-backend.onrender.com/api/users/me/profile",
        { fullName, email: form.email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser({ name: fullName, email: form.email.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPwError("");
    if (!pw.next || !pw.confirm) {
      setPwError("Please fill in both password fields.");
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwError("New passwords don't match.");
      return;
    }
    if (pw.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    setPwSaving(true);
    try {
      const token = localStorage.getItem("sf_token");
      // Note: your backend's password-update route requires currentPassword.
      // Since this design omits a "current password" field, we ask for it via a quick prompt
      // instead of redesigning the form — keeps the UI exactly as designed.
      const currentPassword = window.prompt("For security, please re-enter your current password to confirm this change:");
      if (!currentPassword) {
        setPwSaving(false);
        return;
      }
      await axios.put(
        "https://stockflow-wms-backend.onrender.com/api/users/me/password",
        { currentPassword, newPassword: pw.next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPw({ next: "", confirm: "" });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  };

  const toggleNotif = (key) => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <DashboardLayout title="Account" subtitle="Manage your personal details and preferences.">
      <div className="sa">
        <style>{STYLES}</style>
        <div className="settings-grid">
          <div>
            <div className="panel profile-card">
              <div className="profile-avatar">{initials}</div>
              <div style={{ fontWeight: 600 }}>{user?.name || "Staff"}</div>
              <div style={{ fontSize: 13, color: "#6B7280", textTransform: "capitalize" }}>{user?.role || "staff"}</div>
            </div>

            <div className="panel">
              <div className="panel-title">Account details</div>
              <div className="info-row"><span>Role</span><b style={{ textTransform: "capitalize" }}>{user?.role}</b></div>
              <div className="info-row"><span>Email</span><b>{user?.email}</b></div>
            </div>
          </div>

          <div>
            <div className="panel">
              <div className="panel-title">Personal information</div>
              {loading ? (
                <p style={{ fontSize: 13, color: "#9CA3AF" }}>Loading…</p>
              ) : (
                <>
                  <div className="form-2col">
                    <div className="form-row">
                      <label>First name</label>
                      <input value={form.firstName} onChange={update("firstName")} />
                    </div>
                    <div className="form-row">
                      <label>Last name</label>
                      <input value={form.lastName} onChange={update("lastName")} />
                    </div>
                  </div>
                  <div className="form-row">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={update("email")} />
                  </div>
                  {saved && <p className="success-msg">Profile updated ✓</p>}
                  {profileError && <p className="error-msg">{profileError}</p>}
                  <button className="btn-primary" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </>
              )}
            </div>

            <div className="panel">
              <div className="panel-title">Change password</div>
              <div className="form-2col">
                <div className="form-row">
                  <label>New password</label>
                  <input type="password" placeholder="Enter new password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
                </div>
                <div className="form-row">
                  <label>Confirm password</label>
                  <input type="password" placeholder="Re-enter new password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
                </div>
              </div>
              {pwSaved && <p className="success-msg">Password updated ✓</p>}
              {pwError && <p className="error-msg">{pwError}</p>}
              <button className="btn-primary" onClick={handleUpdatePassword} disabled={pwSaving}>
                {pwSaving ? "Updating…" : "Update password"}
              </button>
            </div>

            <div className="panel">
              <div className="panel-title">Notification preferences</div>
              {[
                { id: "tasks", title: "Task assignment", desc: "Notify me when I'm assigned to pick or pack an order." },
                { id: "stock", title: "Low stock alerts", desc: "Notify me of low stock in my assigned zone." },
                { id: "shifts", title: "Shift reminders", desc: "Reminders for shift start, breaks, and stock counts." },
              ].map((item) => (
                <div className="toggle-row" key={item.id}>
                  <div>
                    <div className="toggle-title">{item.title}</div>
                    <div className="toggle-desc">{item.desc}</div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={notifPrefs[item.id]} onChange={() => toggleNotif(item.id)} />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
              <p className="note">These preferences are saved for this session only — they'll reset next time you log in, since preference storage isn't connected to your account yet.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "24px 0 0", fontSize: "12px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; Privacy Policy &middot; Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}