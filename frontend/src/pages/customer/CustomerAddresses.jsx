import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const STYLES = `
  .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .panel-title { font-size: 14px; font-weight: 700; margin-bottom: 20px; color: #111827; }
  .badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
  .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .badge.green { background: #EAF6EE; color: #1F9D55; }

  .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 20px; border: 1px solid #E5E5E0; }
  .kpi-card.green { background: #EAF6EE; border-color: #D1E7DD; }
  .kpi-label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .kpi-value { font-size: 20px; font-weight: 700; }
  .text-green { color: #1F9D55; }

  .addr-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px; border: 1px solid #F1F0EA; border-radius: 10px; margin-bottom: 12px; }
  .addr-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
  .addr-type { font-size: 14px; font-weight: 700; }
  .addr-text { font-size: 12px; color: #6B7280; line-height: 1.6; max-width: 500px; }
  .addr-actions { display: flex; gap: 12px; flex-shrink: 0; }
  .btn-edit { background: none; border: 1px solid #E5E5E0; padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
  .btn-delete { background: none; border: none; color: #A32D2D; font-size: 12px; font-weight: 600; cursor: pointer; }

  .empty { text-align: center; padding: 30px; color: #9CA3AF; font-size: 13px; }

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

  .switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
  .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
  input:checked + .slider { background-color: #2F6FED; }
  input:checked + .slider:before { transform: translateX(18px); }

  .form-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
  .error-msg { color: #DC2626; font-size: 13px; margin-bottom: 12px; }

  .btn-add { background: #2F6FED; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-save { background: #2F6FED; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-cancel { background: #fff; border: 1px solid #E5E5E0; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
`;

const emptyForm = {
  type: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefaultDelivery: false,
  isDefaultBilling: false
};

function AddressListView({ addresses, loading, onEdit, onDelete }) {
  const defaultDelivery = addresses.find((a) => a.isDefaultDelivery);
  const defaultBilling = addresses.find((a) => a.isDefaultBilling);

  return (
    <div className="addr-page">
      <div className="kpi-row">
        <div className="kpi-card">
          <span className="kpi-label">Saved addresses</span>
          <div className="kpi-value">{addresses.length}</div>
        </div>
        <div className="kpi-card green">
          <span className="kpi-label">Default delivery</span>
          <div className="kpi-value text-green">{defaultDelivery ? defaultDelivery.type : "—"}</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Default billing</span>
          <div className="kpi-value">{defaultBilling ? defaultBilling.type : "—"}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Saved addresses</div>
        {loading ? (
          <div className="empty">Loading…</div>
        ) : addresses.length === 0 ? (
          <div className="empty">No addresses saved yet. Click "Add address" to get started.</div>
        ) : (
          addresses.map((addr) => (
            <div className="addr-item" key={addr._id}>
              <div className="addr-content">
                <div className="addr-header">
                  <span className="addr-type">{addr.type}</span>
                  {addr.isDefaultDelivery && <span className="badge blue">Default delivery</span>}
                  {addr.isDefaultBilling && <span className="badge green">Default billing</span>}
                </div>
                <p className="addr-text">
                  {addr.fullName} · {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.state} {addr.pincode} · {addr.phone}
                </p>
              </div>
              <div className="addr-actions">
                <button className="btn-edit" onClick={() => onEdit(addr)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(addr._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AddressForm({ initial, onCancel, onSave, saving, error }) {
  const [form, setForm] = useState(initial || emptyForm);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="add-addr-page">
      <div className="panel">
        <label className="form-section-label">Address type</label>
        <p className="form-section-sub">Choose a label so you can find this address quickly later.</p>
        <div className="type-selector">
          {["Home", "Office", "Other"].map((t) => (
            <button
              key={t}
              type="button"
              className={`type-btn ${form.type === t ? "active" : ""}`}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
            >
              <span className="icon">{t === "Home" ? "🏠" : t === "Office" ? "🏢" : "📍"}</span>
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
            <input placeholder="e.g. Priya Raman" value={form.fullName} onChange={update("fullName")} />
          </div>
          <div className="input-group">
            <label>Phone number</label>
            <input placeholder="e.g. +91 98765 43210" value={form.phone} onChange={update("phone")} />
          </div>
        </div>
      </div>

      <div className="panel">
        <label className="form-section-label">Address</label>
        <p className="form-section-sub">Enter the full delivery address, including landmark if helpful.</p>
        <div className="input-group full">
          <label>Address line 1</label>
          <input placeholder="House / flat no., street, area" value={form.addressLine1} onChange={update("addressLine1")} />
        </div>
        <div className="input-group full">
          <label>Address line 2 <span>[optional]</span></label>
          <input placeholder="Landmark, building name" value={form.addressLine2} onChange={update("addressLine2")} />
        </div>
        <div className="form-grid-3">
          <div className="input-group">
            <label>City</label>
            <input placeholder="e.g. Coimbatore" value={form.city} onChange={update("city")} />
          </div>
          <div className="input-group">
            <label>State</label>
            <input placeholder="e.g. Tamil Nadu" value={form.state} onChange={update("state")} />
          </div>
          <div className="input-group">
            <label>Pincode</label>
            <input placeholder="e.g. 641002" value={form.pincode} onChange={update("pincode")} />
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
            <input type="checkbox" checked={form.isDefaultDelivery} onChange={(e) => setForm((f) => ({ ...f, isDefaultDelivery: e.target.checked }))} />
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
            <input type="checkbox" checked={form.isDefaultBilling} onChange={(e) => setForm((f) => ({ ...f, isDefaultBilling: e.target.checked }))} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="form-footer">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-save" onClick={() => onSave(form)} disabled={saving}>
          {saving ? "Saving…" : "Save address"}
        </button>
      </div>
    </div>
  );
}

export default function CustomerAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list"); // 'list' | 'add' | 'edit'
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("sf_token");
      const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (form) => {
    setError("");
    if (!form.fullName.trim() || !form.phone.trim() || !form.addressLine1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("sf_token");
      if (mode === "edit" && editingAddress) {
        await axios.put(`https://stockflow-wms-backend.onrender.com/api/addresses/${editingAddress._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("https://stockflow-wms-backend.onrender.com/api/addresses", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setMode("list");
      setEditingAddress(null);
      await fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const token = localStorage.getItem("sf_token");
      await axios.delete(`https://stockflow-wms-backend.onrender.com/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAddresses();
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

  const startEdit = (addr) => {
    setEditingAddress(addr);
    setMode("edit");
  };

  const isFormMode = mode === "add" || mode === "edit";

  return (
    <DashboardLayout
      title={isFormMode ? (mode === "edit" ? "Edit address" : "Add address") : "Addresses"}
      subtitle={isFormMode ? "Add a new delivery or billing address to your account." : "Manage delivery and billing addresses on your account."}
      actions={
        isFormMode ? null : (
          <button className="btn-add" onClick={() => { setEditingAddress(null); setMode("add"); }}>+ Add address</button>
        )
      }
    >
      <style>{STYLES}</style>
      {isFormMode ? (
        <AddressForm
          initial={mode === "edit" ? editingAddress : null}
          onCancel={() => { setMode("list"); setEditingAddress(null); setError(""); }}
          onSave={handleSave}
          saving={saving}
          error={error}
        />
      ) : (
        <AddressListView addresses={addresses} loading={loading} onEdit={startEdit} onDelete={handleDelete} />
      )}
      <div style={{ textAlign: "center", padding: "24px 0", fontSize: "12px", color: "#9CA3AF" }}>
        &copy; 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
      </div>
    </DashboardLayout>
  );
}