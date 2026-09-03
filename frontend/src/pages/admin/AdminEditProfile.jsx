import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const PERMS = ["Manage inventory", "Manage orders", "Manage users", "View reports", "Manage billing", "Manage settings"];

const STYLES = `
  .ep * { box-sizing: border-box; }
  .ep { font-family: 'Inter', sans-serif; }

  .ep .grid { display: grid; grid-template-columns: 320px 1fr; gap: 16px; align-items: start; }
  .ep .col { display: flex; flex-direction: column; gap: 16px; }
  .ep .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; }
  .ep .panel-title { font-size: 14px; font-weight: 600; margin-bottom: 14px; }

  .ep .photo-wrap { text-align: center; padding: 6px 0 16px; }
  .ep .photo-avatar { width: 96px; height: 96px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 700; margin: 0 auto 14px; overflow: hidden; }
  .ep .photo-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .ep .photo-actions { display: flex; gap: 8px; justify-content: center; margin-bottom: 10px; }
  .ep .btn-sm { height: 34px; padding: 0 14px; border-radius: 7px; font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit; border: none; }
  .ep .btn-sm.outline { background: #FFFFFF; border: 1px solid #D1D5DB; color: #111827; }
  .ep .btn-sm.ghost { background: transparent; color: #A32D2D; }
  .ep .photo-hint { font-size: 12px; color: #9CA3AF; }

  .ep .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1F0EA; font-size: 13px; }
  .ep .detail-row:last-child { border-bottom: none; }
  .ep .detail-label { color: #6B7280; }
  .ep .detail-value { font-weight: 500; }

  .ep .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ep .form-row { margin-bottom: 16px; }
  .ep .form-row:last-child { margin-bottom: 0; }
  .ep .form-row label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .ep .form-row input, .ep .form-row select { width: 100%; height: 42px; padding: 0 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-family: inherit; font-size: 14px; }
  .ep .form-row input:focus, .ep .form-row select:focus, .ep .form-row textarea:focus { outline: none; border-color: #2F6FED; }
  .ep .form-row textarea { width: 100%; padding: 12px 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-family: inherit; font-size: 14px; resize: none; height: 72px; }

  .ep .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .ep .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .ep .badge.green { background: #EAF6EE; color: #1F9D55; }

  .ep .perm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; }
  .ep .perm-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13px; }
  .ep .perm-check { width: 16px; height: 16px; border-radius: 4px; background: #EAF6EE; color: #1F9D55; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }

  .ep .saved-msg { font-size: 13px; color: #1F9D55; margin-top: 8px; }

  .ep .app-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .ep .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 900px) {
    .ep .grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .ep .form-2col, .ep .perm-grid { grid-template-columns: 1fr; }
  }
`;

export default function AdminEditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "Alex",
    lastName: user?.name?.split(" ")[1] || "Rivera",
    email: user?.email || "alex@stockflow.com",
    phone: "+91 98765 43210",
    jobTitle: "Operations Administrator",
    department: "Operations",
    bio: "Managing inventory operations and system access across all StockFlow warehouse locations.",
  });
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const initials = () => ((form.firstName[0] || "") + (form.lastName[0] || "")).toUpperCase() || "?";

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSaving(true);
    // Replace with your real profile-update API call, e.g.:
    // await fetch('/api/profile', { method: 'PATCH', body: JSON.stringify(form) });
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  return (
    <DashboardLayout
      title="Edit profile"
      subtitle="Update your personal information and see your account details."
      breadcrumb={<><Link to="/admin/settings">Settings</Link> / Edit profile</>}
      actions={
        <>
          <button className="topbar-btn-outline" onClick={() => navigate("/admin/settings")}>Cancel</button>
          <button className="topbar-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </>
      }
    >
      <div className="ep">
        <style>{STYLES}</style>

        <div className="grid">
          <div className="col">
            <div className="panel">
              <div className="panel-title">Profile photo</div>
              <div className="photo-wrap">
                <div className="photo-avatar">
                  {photo ? <img src={photo} alt="Profile" /> : initials()}
                </div>
                <div className="photo-actions">
                  <button className="btn-sm outline" onClick={() => fileInputRef.current?.click()}>Upload new</button>
                  <button className="btn-sm ghost" onClick={() => setPhoto(null)}>Remove</button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  onChange={handlePhotoSelect}
                />
                <div className="photo-hint">JPG or PNG. Max 2MB.</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Account details</div>
              <div className="detail-row"><span className="detail-label">Account ID</span><span className="detail-value">USR-00214</span></div>
              <div className="detail-row"><span className="detail-label">Role</span><span className="badge blue">{user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : "Admin"}</span></div>
              <div className="detail-row"><span className="detail-label">Joined</span><span className="detail-value">Jan 14, 2026</span></div>
              <div className="detail-row"><span className="detail-label">Last login</span><span className="detail-value">Today, 9:02 AM</span></div>
              <div className="detail-row"><span className="detail-label">Status</span><span className="badge green">Active</span></div>
            </div>
          </div>

          <div className="col">
            <div className="panel">
              <div className="panel-title">Personal information</div>
              <div className="form-2col">
                <div className="form-row"><label>First name</label><input value={form.firstName} onChange={update("firstName")} /></div>
                <div className="form-row"><label>Last name</label><input value={form.lastName} onChange={update("lastName")} /></div>
              </div>
              <div className="form-2col">
                <div className="form-row"><label>Email address</label><input value={form.email} onChange={update("email")} /></div>
                <div className="form-row"><label>Phone number</label><input value={form.phone} onChange={update("phone")} /></div>
              </div>
              <div className="form-2col">
                <div className="form-row"><label>Job title</label><input value={form.jobTitle} onChange={update("jobTitle")} /></div>
                <div className="form-row">
                  <label>Department</label>
                  <select value={form.department} onChange={update("department")}>
                    <option>Operations</option>
                    <option>Warehouse</option>
                    <option>IT</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <label>Bio</label>
                <textarea value={form.bio} onChange={update("bio")} />
              </div>
              {saved && <p className="saved-msg">Profile updated ✓</p>}
            </div>

            <div className="panel">
              <div className="panel-title">Role &amp; access</div>
              <div className="perm-grid">
                {PERMS.map((p) => (
                  <div className="perm-row" key={p}>
                    <div className="perm-check">✓</div>{p}
                  </div>
                ))}
              </div>
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