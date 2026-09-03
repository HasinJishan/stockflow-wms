import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

// --- Sub-Component: Address List View ---
const AddressListView = ({ onAddClick }) => {
  const addresses = [
    { id: 1, type: "Home", isDelivery: true, isBilling: false, details: "Priya Raman · 42 Race Course Road, RS Puram, Coimbatore, Tamil Nadu 641002 · +91 98765 43210" },
    { id: 2, type: "Office", isDelivery: false, isBilling: true, details: "Priya Raman · 3rd Floor, Tidel Park, Coimbatore, Tamil Nadu 641014 · +91 98765 43210" },
    { id: 3, type: "Parents' house", isDelivery: false, isBilling: false, details: "Lakshmi Raman · 18 Gandhi Nagar Main Road, Chennai, Tamil Nadu 600020 · +91 98450 11223" },
  ];

  const orders = [
    { id: "#10432", to: "Home", date: "Jul 24", status: "Out for delivery", type: "blue" },
    { id: "#10425", to: "Office", date: "Jul 21", status: "In transit", type: "amber" },
    { id: "#10401", to: "Home", date: "Jul 15", status: "Delivered", type: "green" },
    { id: "#10388", to: "Parents' house", date: "Jul 10", status: "Delivered", type: "green" },
  ];

  return (
    <div className="addr-page">
      <div className="kpi-row">
        <div className="kpi-card">
          <span className="kpi-label">Saved addresses</span>
          <div className="kpi-value">3</div>
        </div>
        <div className="kpi-card green">
          <span className="kpi-label">Default delivery</span>
          <div className="kpi-value text-green">Home</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Default billing</span>
          <div className="kpi-value">Office</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Saved addresses</div>
        {addresses.map((addr) => (
          <div className="addr-item" key={addr.id}>
            <div className="addr-content">
              <div className="addr-header">
                <span className="addr-type">{addr.type}</span>
                {addr.isDelivery && <span className="badge blue">Default delivery</span>}
                {addr.isBilling && <span className="badge green">Default billing</span>}
              </div>
              <p className="addr-text">{addr.details}</p>
            </div>
            <div className="addr-actions">
              <button className="btn-edit">Edit</button>
              <button className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title">Recent orders by address</div>
        <table className="addr-table">
          <thead>
            <tr><th>Order</th><th>Delivered to</th><th>Date</th><th className="text-right">Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.to}</td>
                <td>{o.date}</td>
                <td className="text-right"><span className={`badge ${o.type}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Sub-Component: Add Address Form ---
const AddAddressForm = ({ onCancel }) => {
  const [addressType, setAddressType] = useState("Home");

  return (
    <div className="add-addr-page">
      <div className="panel">
        <label className="form-section-label">Address type</label>
        <p className="form-section-sub">Choose a label so you can find this address quickly later.</p>
        <div className="type-selector">
          {["Home", "Office", "Other"].map((t) => (
            <button 
              key={t} 
              className={`type-btn ${addressType === t ? "active" : ""}`}
              onClick={() => setAddressType(t)}
            >
              <span className="icon">{t === 'Home' ? '🏠' : t === 'Office' ? '🏢' : '📍'}</span>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <label className="form-section-label">Contact details</label>
        <p className="form-section-sub">Who should the courier ask for at this address?</p>
        <div className="form-grid-2">
          <div className="input-group">
            <label>Full name</label>
            <input placeholder="e.g. Priya Raman" />
          </div>
          <div className="input-group">
            <label>Phone number</label>
            <input placeholder="e.g. +91 98765 43210" />
          </div>
        </div>
      </div>

      <div className="panel">
        <label className="form-section-label">Address</label>
        <p className="form-section-sub">Enter the full delivery address, including landmark if helpful.</p>
        <div className="input-group full">
          <label>Address line 1</label>
          <input placeholder="House / flat no., street, area" />
        </div>
        <div className="input-group full">
          <label>Address line 2 <span>[optional]</span></label>
          <input placeholder="Landmark, building name" />
        </div>
        <div className="form-grid-3">
          <div className="input-group">
            <label>City</label>
            <input placeholder="e.g. Coimbatore" />
          </div>
          <div className="input-group">
            <label>State</label>
            <input placeholder="e.g. Tamil Nadu" />
          </div>
          <div className="input-group">
            <label>Pincode</label>
            <input placeholder="e.g. 641002" />
          </div>
        </div>
        <div className="input-group full">
          <label>Country</label>
          <input value="India" disabled className="disabled-input" />
        </div>
      </div>

      <div className="panel">
        <label className="form-section-label">Set as default</label>
        <p className="form-section-sub">Defaults are used automatically at checkout unless you choose another address.</p>
        
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-icon">🚚</span>
            <div>
              <b>Default delivery address</b>
              <p>Used to pre-fill shipping at checkout</p>
            </div>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-icon">💳</span>
            <div>
              <b>Default billing address</b>
              <p>Used on invoices and payment receipts</p>
            </div>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="form-footer">
        <button className="btn-cancel-flat" onClick={onCancel}>Cancel</button>
        <button className="btn-save-main">Save address</button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function CustomerAddresses() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <DashboardLayout 
      title={isAdding ? "Add address" : "Addresses"} 
      subtitle={isAdding ? "Add a new delivery or billing address to your account." : "Manage delivery and billing addresses on your account."}
      actions={
        isAdding ? (
          <div style={{display:'flex', gap:'8px'}}>
            <button className="btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
            <button className="btn-save" onClick={() => setIsAdding(false)}>Save address</button>
          </div>
        ) : (
          <button className="btn-add" onClick={() => setIsAdding(true)}>+ Add address</button>
        )
      }
    >
      <style>{STYLES}</style>
      {isAdding ? <AddAddressForm onCancel={() => setIsAdding(false)} /> : <AddressListView onAddClick={() => setIsAdding(true)} />}
    </DashboardLayout>
  );
}

const STYLES = `
  /* Common */
  .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .panel-title { font-size: 14px; font-weight: 700; margin-bottom: 20px; color: #111827; }
  .badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
  .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .badge.green { background: #EAF6EE; color: #1F9D55; }
  .badge.amber { background: #FAEEDA; color: #854F0B; }
  
  /* List View */
  .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 20px; border: 1px solid #E5E5E0; }
  .kpi-card.green { background: #EAF6EE; border-color: #D1E7DD; }
  .kpi-label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .kpi-value { font-size: 20px; font-weight: 700; }
  .text-green { color: #1F9D55; }

  .addr-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px; border: 1px solid #F1F0EA; border-radius: 10px; margin-bottom: 12px; }
  .addr-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .addr-type { font-size: 14px; font-weight: 700; }
  .addr-text { font-size: 12px; color: #6B7280; line-height: 1.6; max-width: 500px; }
  .addr-actions { display: flex; gap: 12px; }
  .btn-edit { background: none; border: 1px solid #E5E5E0; padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
  .btn-delete { background: none; border: none; color: #A32D2D; font-size: 12px; font-weight: 600; cursor: pointer; }

  .addr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .addr-table th { text-align: left; color: #9CA3AF; font-size: 11px; text-transform: uppercase; padding: 12px; border-bottom: 1px solid #F1F0EA; }
  .addr-table td { padding: 16px 12px; border-bottom: 1px solid #F1F0EA; }
  .text-right { text-align: right; }

  /* Form View */
  .form-section-label { font-size: 14px; font-weight: 700; display: block; margin-bottom: 4px; }
  .form-section-sub { font-size: 12px; color: #6B7280; margin-bottom: 20px; }
  
  .type-selector { display: flex; gap: 12px; }
  .type-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid #E5E5E0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
  .type-btn.active { border-color: #2F6FED; color: #2F6FED; background: #EFF4FF; }
  
  .input-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .input-group label { font-size: 12px; font-weight: 600; color: #111827; }
  .input-group label span { color: #9CA3AF; font-weight: 400; }
  .input-group input { height: 40px; border: 1px solid #E5E5E0; border-radius: 8px; padding: 0 12px; font-size: 13px; font-family: inherit; }
  .disabled-input { background: #F3F2EC; color: #6B7280; }

  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid #F1F0EA; border-radius: 10px; margin-bottom: 12px; }
  .toggle-info { display: flex; align-items: center; gap: 16px; }
  .toggle-icon { font-size: 20px; }
  .toggle-info b { font-size: 13px; display: block; }
  .toggle-info p { font-size: 11px; color: #6B7280; margin-top: 2px; }

  /* Switch UI */
  .switch { position: relative; display: inline-block; width: 40px; height: 22px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
  .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
  input:checked + .slider { background-color: #2F6FED; }
  input:checked + .slider:before { transform: translateX(18px); }

  .form-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
  .btn-cancel-flat { background: none; border: 1px solid #E5E5E0; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-save-main { background: #2F6FED; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }

  /* Top Bar Buttons */
  .btn-add { background: #2F6FED; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-save { background: #2F6FED; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .btn-cancel { background: #fff; border: 1px solid #E5E5E0; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
`;