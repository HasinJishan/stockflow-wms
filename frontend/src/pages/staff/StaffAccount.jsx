import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

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
  .sa .btn-outline { background: #fff; border: 1px solid #D1D5DB; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; font-family: inherit; }

  .sa .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F0EA; }
  .sa .toggle-row:last-child { border-bottom: none; }
  .sa .toggle-title { font-size: 14px; font-weight: 500; }
  .sa .toggle-desc { font-size: 12px; color: #6B7280; }
  
  .sa .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
  .sa .switch input { opacity: 0; width: 0; height: 0; }
  .sa .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #D1D5DB; transition: .3s; border-radius: 24px; }
  .sa .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
  .sa input:checked + .slider { background-color: #2F6FED; }
  .sa input:checked + .slider:before { transform: translateX(20px); }

  .sa table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .sa th { text-align: left; color: #6B7280; font-weight: 500; font-size: 12px; padding: 8px; border-bottom: 1px solid #E5E5E0; }
  .sa td { padding: 12px 8px; border-bottom: 1px solid #F1F0EA; }

  @media (max-width: 1024px) {
    .sa .settings-grid { grid-template-columns: 1fr; }
  }
`;

export default function StaffAccount() {
  const [profile, setProfile] = useState({
    firstName: "James",
    lastName: "Smith",
    email: "james@stockflow.com",
    phone: "+91 91234 56789"
  });

  const [notifications, setNotifications] = useState({
    tasks: true,
    stock: true,
    shifts: false
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert("Profile changes saved successfully!");
  };

  return (
    <DashboardLayout title="Account" subtitle="Manage your personal details and preferences.">
      <div className="sa">
        <style>{STYLES}</style>
        <div className="settings-grid">
          {/* Left Column */}
          <div>
            <div className="panel profile-card">
              <div className="profile-avatar">JS</div>
              <div style={{ fontWeight: 600 }}>{profile.firstName} {profile.lastName}</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>Warehouse Staff &middot; Zone B</div>
              <button className="btn-outline" style={{ marginTop: 15, width: "100%" }}>Change photo</button>
            </div>

            <div className="panel">
              <div className="panel-title">Shift summary</div>
              <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 2.2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Current shift</span><b>8 AM – 4 PM</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Assigned zone</span><b>Zone B</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Badge ID</span><b>WH-00214</b></div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="panel">
              <div className="panel-title">Personal information</div>
              <div className="form-2col">
                <div className="form-row">
                  <label>First name</label>
                  <input type="text" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
                </div>
                <div className="form-row">
                  <label>Last name</label>
                  <input type="text" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-2col">
                <div className="form-row">
                  <label>Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                </div>
                <div className="form-row">
                  <label>Phone</label>
                  <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                </div>
              </div>
              <button className="btn-primary" onClick={handleSave}>Save changes</button>
            </div>

            <div className="panel">
              <div className="panel-title">Notification preferences</div>
              {[
                { id: 'tasks', title: 'Task assignments', desc: 'When assigned to pick or pack.' },
                { id: 'stock', title: 'Low stock alerts', desc: 'Alerts for your assigned zone.' },
                { id: 'shifts', title: 'Shift reminders', desc: 'Breaks and stock count start times.' }
              ].map((item) => (
                <div className="toggle-row" key={item.id}>
                  <div>
                    <div className="toggle-title">{item.title}</div>
                    <div className="toggle-desc">{item.desc}</div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={notifications[item.id]} onChange={() => handleToggle(item.id)} />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Recent account activity</div>
              <table>
                <thead>
                  <tr><th>Event</th><th>Device</th><th style={{ textAlign: 'right' }}>Time</th></tr>
                </thead>
                <tbody>
                  <tr><td>Signed in</td><td>Handheld scanner #4</td><td style={{ textAlign: 'right' }}>Today, 8:02 AM</td></tr>
                  <tr><td>Password changed</td><td>Warehouse kiosk</td><td style={{ textAlign: 'right' }}>Jul 20, 2026</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}