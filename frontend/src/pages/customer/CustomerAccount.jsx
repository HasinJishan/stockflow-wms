import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const STYLES = `
  .acc * { box-sizing: border-box; }
  .acc { font-family: 'Inter', sans-serif; }
  .acc .settings-grid { display: grid; grid-template-columns: 320px 1fr; gap: 20px; }
  .acc .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .acc .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; }

  .acc .profile-card { text-align: center; }
  .acc .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; margin: 0 auto 12px; }
  
  .acc .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .acc .form-row { margin-bottom: 16px; }
  .acc .form-row label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .acc .form-row input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; font-family: inherit; }

  .acc .success-msg { font-size: 13px; color: #1F9D55; margin-bottom: 10px; }
  .acc .error-msg { font-size: 13px; color: #DC2626; margin-bottom: 10px; }
  
  .acc .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F0EA; }
  .acc .toggle-row:last-child { border-bottom: none; }
  .acc .toggle-title { font-size: 14px; font-weight: 500; }
  .acc .toggle-desc { font-size: 12px; color: #6B7280; margin-top: 2px; }

  .acc .switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
  .acc .switch input { opacity: 0; width: 0; height: 0; }
  .acc .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 22px; }
  .acc .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
  .acc input:checked + .slider { background-color: #2F6FED; }
  .acc input:checked + .slider:before { transform: translateX(18px); }

  .acc .note { font-size: 11.5px; color: #9CA3AF; margin-top: 10px; }

  @media (max-width: 900px) {
    .acc .settings-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .acc .form-2col { grid-template-columns: 1fr; }
  }
`;

export default function CustomerAccount() {
  const { user, updateUser } = useAuth();

  // Profile
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Account summary (real counts)
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [savedItemsCount, setSavedItemsCount] = useState(0);

  // Password
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  // Notification preferences (session-only, see note)
  const [prefs, setPrefs] = useState({ orders: true, stock: true, promo: false });

  useEffect(() => {
    if (user) {
      const [first, ...rest] = (user.name || "").split(" ");
      setForm({ firstName: first || "", lastName: rest.join(" ") || "", email: user.email || "" });
    }

    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const [ordersRes, addressesRes, savedRes] = await Promise.all([
          axios.get("https://stockflow-wms-backend.onrender.com/api/orders/my-orders", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("https://stockflow-wms-backend.onrender.com/api/addresses", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("https://stockflow-wms-backend.onrender.com/api/saved-items", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setOrderCount(ordersRes.data.length);
        setAddressCount(addressesRes.data.length);
        setSavedItemsCount(savedRes.data.length);
      } catch (err) {
        console.error("Failed to load account summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
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
    const currentPassword = window.prompt("For security, please re-enter your current password to confirm this change:");
    if (!currentPassword) return;

    setPwSaving(true);
    try {
      const token = localStorage.getItem("sf_token");
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

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <DashboardLayout title="Account" subtitle="Manage your personal details and preferences.">
      <div className="acc">
        <style>{STYLES}</style>
        <div className="settings-grid">
          <div>
            <div className="panel profile-card">
              <div className="profile-avatar">{initials}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{user?.name || "Customer"}</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Customer</div>
            </div>

            <div className="panel">
              <div className="panel-title">Account summary</div>
              {loading ? (
                <p style={{ fontSize: 13, color: "#9CA3AF" }}>Loading…</p>
              ) : (
                <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 2.2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total orders</span><b>{orderCount}</b></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Saved addresses</span><b>{addressCount}</b></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Saved items</span><b>{savedItemsCount}</b></div>
                </div>
              )}
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
                    <div className="form-row"><label>First name</label><input value={form.firstName} onChange={update("firstName")} /></div>
                    <div className="form-row"><label>Last name</label><input value={form.lastName} onChange={update("lastName")} /></div>
                  </div>
                  <div className="form-row"><label>Email</label><input type="email" value={form.email} onChange={update("email")} /></div>
                  {saved && <p className="success-msg">Profile updated ✓</p>}
                  {profileError && <p className="error-msg">{profileError}</p>}
                  <button className="topbar-btn" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </>
              )}
            </div>

            <div className="panel">
              <div className="panel-title">Change password</div>
              <div className="form-2col">
                <div className="form-row"><label>New password</label><input type="password" placeholder="••••••••" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} /></div>
                <div className="form-row"><label>Confirm password</label><input type="password" placeholder="••••••••" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} /></div>
              </div>
              {pwSaved && <p className="success-msg">Password updated ✓</p>}
              {pwError && <p className="error-msg">{pwError}</p>}
              <button className="topbar-btn-outline" onClick={handleUpdatePassword} disabled={pwSaving}>
                {pwSaving ? "Updating…" : "Update password"}
              </button>
            </div>

            <div className="panel">
              <div className="panel-title">Notification preferences</div>
              <div className="toggle-row">
                <div><div className="toggle-title">Order status updates</div><div className="toggle-desc">Notify me when status changes.</div></div>
                <label className="switch">
                  <input type="checkbox" checked={prefs.orders} onChange={() => togglePref("orders")} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div><div className="toggle-title">Back-in-stock alerts</div><div className="toggle-desc">When saved items are restocked.</div></div>
                <label className="switch">
                  <input type="checkbox" checked={prefs.stock} onChange={() => togglePref("stock")} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div><div className="toggle-title">Promotional emails</div><div className="toggle-desc">Offers and product updates.</div></div>
                <label className="switch">
                  <input type="checkbox" checked={prefs.promo} onChange={() => togglePref("promo")} />
                  <span className="slider"></span>
                </label>
              </div>
              <p className="note">These preferences are saved for this session only — they'll reset next time you log in.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "24px 0", fontSize: "12px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}