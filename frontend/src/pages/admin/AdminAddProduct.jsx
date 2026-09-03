import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const CATEGORIES = ["Packaging", "Electronics", "Apparel", "Other"];
const UNITS = ["Each", "Box", "Pallet", "Roll"];
const WAREHOUSES = [
  "Coimbatore — Main warehouse",
  "Chennai — Overflow facility",
  "Bengaluru — Regional hub",
];

const STYLES = `
  .ap * { box-sizing: border-box; }
  .ap { font-family: 'Inter', sans-serif; }
  .ap .grid { display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: start; }
  .ap .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; }
  .ap .panel-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
  .ap .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ap .form-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .ap .form-row { margin-bottom: 14px; }
  .ap .form-row label { display: block; font-size: 12.5px; font-weight: 500; color: #374151; margin-bottom: 5px; }
  .ap .form-row input, .ap .form-row select { width: 100%; height: 38px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 7px; font-size: 13.5px; }
  .ap .form-row textarea { width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 7px; font-size: 13.5px; resize: none; height: 60px; }
  .ap .input-prefix { position: relative; }
  .ap .input-prefix span { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13.5px; color: #9CA3AF; }
  .ap .input-prefix input { padding-left: 26px; }
  .ap .status-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
  .ap .toggle { width: 38px; height: 21px; border-radius: 999px; background: #D1D5DB; position: relative; cursor: pointer; border:none; }
  .ap .toggle.on { background: #2F6FED; }
  .ap .toggle-dot { width: 17px; height: 17px; border-radius: 50%; background: #fff; position: absolute; top: 2px; left: 2px; transition: 0.2s; }
  .ap .toggle.on .toggle-dot { left: 19px; }
  .ap .badge { font-size: 11.5px; padding: 3px 10px; border-radius: 7px; font-weight: 600; }
  .ap .badge.green { background: #EAF6EE; color: #1F9D55; }
  .ap .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .ap .preview-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
  .ap .error { font-size: 12px; color: #DC2626; margin-top: 10px; background: #FEF2F2; padding: 8px; border-radius: 6px; border: 1px solid #FCA5A5; }
`;

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "", sku: "", category: "Packaging", description: "",
    costPrice: "", sellPrice: "", unit: "Each",
    openingStock: "", reorderLevel: "", maxStock: "",
    supplier: "", leadTime: "", warehouse: WAREHOUSES[0], binLocation: "",
  });
  
  const [publish, setPublish] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => {
    setError("");
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const stockValue = () => {
    const cost = parseFloat(form.costPrice);
    const qty = parseFloat(form.openingStock);
    return !cost || !qty ? "—" : `$${(cost * qty).toLocaleString()}`;
  };

  // --- FORMAL SAVE LOGIC ---
  const handleSave = async () => {
    setError("");
    if (!form.name.trim() || !form.sku.trim() || !form.sellPrice || !form.openingStock) {
      setError("Please fill in Name, SKU, Price, and Opening Stock.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("sf_token");
      
      // Map UI fields to your MongoDB schema
      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        description: form.description,
        costPrice: Number(form.costPrice),
        price: Number(form.sellPrice),
        unit: form.unit,
        quantity: Number(form.openingStock),
        reorderLevel: Number(form.reorderLevel),
        warehouseLocation: `${form.warehouse} - ${form.binLocation}`,
        // Set initial status based on logic
        status: Number(form.openingStock) <= Number(form.reorderLevel) ? "Low stock" : "In stock"
      };

      await axios.post('http://localhost:5000/api/products', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Product added to warehouse successfully!");
      navigate("/admin/inventory");

    } catch (err) {
    // This will now show the exact field that failed (e.g., "SKU must be unique")
    const serverMessage = err.response?.data?.message || "Connection error.";
    setError(`Error: ${serverMessage}`);
}
 finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Add product"
      subtitle="Create a new entry in your warehouse catalog."
      actions={
        <>
          <button className="topbar-btn-outline" onClick={() => navigate("/admin/inventory")}>Cancel</button>
          <button className="topbar-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save product"}
          </button>
        </>
      }
    >
      <div className="ap">
        <style>{STYLES}</style>
        <div className="grid">
          <div>
            <div className="panel">
              <div className="panel-title">Basic information</div>
              <div className="form-row">
                <label>Product name</label>
                <input placeholder="e.g. Corrugated box (Medium)" value={form.name} onChange={update("name")} />
              </div>
              <div className="form-2col">
                <div className="form-row"><label>SKU</label><input placeholder="PKG-100" value={form.sku} onChange={update("sku")} /></div>
                <div className="form-row"><label>Category</label>
                  <select value={form.category} onChange={update("category")}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row"><label>Description</label>
                <textarea placeholder="Usage notes..." value={form.description} onChange={update("description")} />
              </div>
              {error && <p className="error">{error}</p>}
            </div>

            <div className="panel">
              <div className="panel-title">Pricing & Stock</div>
              <div className="form-3col">
                <div className="form-row"><label>Cost Price</label><div className="input-prefix"><span>$</span><input value={form.costPrice} onChange={update("costPrice")} /></div></div>
                <div className="form-row"><label>Sell Price</label><div className="input-prefix"><span>$</span><input value={form.sellPrice} onChange={update("sellPrice")} /></div></div>
                <div className="form-row"><label>Unit</label>
                  <select value={form.unit} onChange={update("unit")}>{UNITS.map(u => <option key={u}>{u}</option>)}</select>
                </div>
              </div>
              <div className="form-3col">
                <div className="form-row"><label>Opening Stock</label><input value={form.openingStock} onChange={update("openingStock")} /></div>
                <div className="form-row"><label>Reorder Level</label><input value={form.reorderLevel} onChange={update("reorderLevel")} /></div>
                <div className="form-row"><label>Max Stock</label><input value={form.maxStock} onChange={update("maxStock")} /></div>
              </div>
            </div>
          </div>

          <div>
            <div className="panel">
              <div className="panel-title">Status & Preview</div>
              <div className="status-row">
                <div className="status-title">Publish immediately</div>
                <button className={`toggle ${publish ? "on" : ""}`} onClick={() => setPublish(!publish)}>
                  <span className="toggle-dot" />
                </button>
              </div>
              <div className="preview-row"><span>Status</span><span><span className={`badge ${publish ? "green" : "blue"}`}>{publish ? "Active" : "Draft"}</span></span></div>
              <div className="preview-row"><span>Stock Value</span><span>{stockValue()}</span></div>
            </div>
            
            <div className="panel">
                <div className="panel-title">Warehouse Location</div>
                <div className="form-row">
                    <label>Warehouse</label>
                    <select value={form.warehouse} onChange={update("warehouse")}>
                        {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                    </select>
                </div>
                <div className="form-row">
                    <label>Bin / Shelf</label>
                    <input placeholder="A-101" value={form.binLocation} onChange={update("binLocation")} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}