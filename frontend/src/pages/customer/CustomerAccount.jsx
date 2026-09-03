import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const STYLES = `
  .acc * { box-sizing: border-box; }
  .acc .settings-grid { display: grid; grid-template-columns: 320px 1fr; gap: 20px; }
  .acc .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .acc .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; }

  .acc .profile-card { text-align: center; }
  .acc .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; margin: 0 auto 12px; }
  
  .acc .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .acc .form-row { margin-bottom: 16px; }
  .acc .form-row label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .acc .form-row input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; font-family: inherit; }
  
  .acc .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F0EA; }
  .acc .toggle-row:last-child { border-bottom: none; }
  .acc .toggle-title { font-size: 14px; font-weight: 500; }
  .acc .toggle-desc { font-size: 12px; color: #6B7280; margin-top: 2px; }

  .acc .switch { position: relative; display: inline-block; width: 40px; height: 22px; }
  .acc .switch input { opacity: 0; width: 0; height: 0; }
  .acc .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 22px; }
  .acc .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
  .acc input:checked + .slider { background-color: #2F6FED; }
  .acc input:checked + .slider:before { transform: translateX(18px); }

  @media (max-width: 900px) {
    .acc .settings-grid { grid-template-columns: 1fr; }
  }
`;

export default function CustomerAccount() {
  const [prefs, setPrefs] = useState({ orders: true, stock: true, promo: false });

  return (
    <DashboardLayout title="Account" subtitle="Manage your personal details and preferences.">
      <div className="acc">
        <style>{STYLES}</style>
        <div className="settings-grid">
          {/* Profile Sidebar */}
          <div>
            <div className="panel profile-card">
              <div className="profile-avatar">PR</div>
              <div style={{fontSize: 16, fontWeight: 700}}>Priya Raman</div>
              <div style={{fontSize: 13, color: '#6B7280', marginTop: 4}}>Customer &middot; Since Feb 2026</div>
              <button className="topbar-btn-outline" style={{marginTop: 16, width: '100%', justifyContent: 'center'}}>Change photo</button>
            </div>
            
            <div className="panel">
              <div className="panel-title">Account summary</div>
              <div style={{fontSize: 13, color: '#4B5563', lineHeight: 2.2}}>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Total orders</span><b>24</b></div>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Saved addresses</span><b>3</b></div>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Saved items</span><b>6</b></div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div>
            <div className="panel">
              <div className="panel-title">Personal information</div>
              <div className="form-2col">
                <div className="form-row"><label>First name</label><input defaultValue="Priya" /></div>
                <div className="form-row"><label>Last name</label><input defaultValue="Raman" /></div>
              </div>
              <div className="form-2col">
                <div className="form-row"><label>Email</label><input defaultValue="priya@warehouse.com" /></div>
                <div className="form-row"><label>Phone</label><input defaultValue="+91 98765 43210" /></div>
              </div>
              <button className="topbar-btn" onClick={() => alert("Profile Saved")}>Save changes</button>
            </div>

            <div className="panel">
              <div className="panel-title">Change password</div>
              <div className="form-2col">
                <div className="form-row"><label>New password</label><input type="password" placeholder="••••••••" /></div>
                <div className="form-row"><label>Confirm password</label><input type="password" placeholder="••••••••" /></div>
              </div>
              <button className="topbar-btn-outline">Update password</button>
            </div>

            <div className="panel">
              <div className="panel-title">Notification preferences</div>
              <div className="toggle-row">
                <div><div className="toggle-title">Order status updates</div><div className="toggle-desc">Notify me when status changes.</div></div>
                <label className="switch">
                  <input type="checkbox" checked={prefs.orders} onChange={() => setPrefs({...prefs, orders: !prefs.orders})} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div><div className="toggle-title">Back-in-stock alerts</div><div className="toggle-desc">When saved items are restocked.</div></div>
                <label className="switch">
                  <input type="checkbox" checked={prefs.stock} onChange={() => setPrefs({...prefs, stock: !prefs.stock})} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div><div className="toggle-title">Promotional emails</div><div className="toggle-desc">Offers and product updates.</div></div>
                <label className="switch">
                  <input type="checkbox" checked={prefs.promo} onChange={() => setPrefs({...prefs, promo: !prefs.promo})} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}