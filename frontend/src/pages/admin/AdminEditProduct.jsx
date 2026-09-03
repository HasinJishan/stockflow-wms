import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const STYLES = `
  .edit-product-container { font-family: 'Inter', sans-serif; color: #111827; max-width: 1200px; margin: 0 auto; }
  .edit-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
  .edit-card { background: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .card-title { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px 0; }
  .form-group { margin-bottom: 16px; }
  .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
  label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  input, textarea, select { width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; outline: none; }
  input:focus, textarea:focus { border-color: #2563EB; }
  .disabled-input { background-color: #F3F4F6; color: #6B7280; cursor: not-allowed; }
  .btn-secondary { background: #FFFFFF; border: 1px solid #D1D5DB; color: #374151; padding: 8px 16px; border-radius: 8px; cursor: pointer; width: 100%; }
  .danger-zone { border: 1px solid #FEE2E2; background: #FEF2F2; }
  .danger-text { font-size: 13px; color: #7F1D1D; margin-bottom: 16px; }
  .btn-danger { background: #FFFFFF; border: 1px solid #FCA5A5; color: #DC2626; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; width: 100%; }
  .action-buttons { display: flex; gap: 12px; }
  .btn-cancel { background: #FFFFFF; border: 1px solid #D1D5DB; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
  .btn-save { background: #2563EB; border: none; color: #FFFFFF; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
  @media (max-width: 900px) { .edit-grid { grid-template-columns: 1fr; } }
`;

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch current data from Backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get(`http://   stockflow-wms-backend.onrender.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Save Changes (PUT request)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("sf_token");
      await axios.put(`http://   stockflow-wms-backend.onrender.com/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product updated successfully!");
      navigate(`/admin/products/${id}`);
    } catch (err) {
      alert("Failed to update product");
    }
  };

  // 3. Delete Product (DELETE request)
  const handleDelete = async () => {
    if (window.confirm("Delete this product permanently? This cannot be undone.")) {
      try {
        const token = localStorage.getItem("sf_token");
        await axios.delete(`http://   stockflow-wms-backend.onrender.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate("/admin/inventory");
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  if (loading) return <DashboardLayout title="Loading..."><div>Fetching data...</div></DashboardLayout>;

  return (
    <DashboardLayout
      title="Edit product"
      subtitle={`SKU: ${formData.sku}`}
      actions={
        <div className="action-buttons">
          <button className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save changes</button>
        </div>
      }
    >
      <div className="edit-product-container">
        <style>{STYLES}</style>
        <form onSubmit={handleSave}>
          <div className="edit-grid">
            <div className="main-form-column">
              <div className="edit-card">
                <h2 className="card-title">Basic information</h2>
                <div className="form-group">
                  <label>Product name</label>
                  <input name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-row form-group">
                  <div><label>SKU (Locked)</label><input value={formData.sku} className="disabled-input" disabled /></div>
                  <div><label>Category</label><input name="category" value={formData.category} onChange={handleChange} /></div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows={4} value={formData.description} onChange={handleChange} />
                </div>
              </div>

              <div className="edit-card">
                <h2 className="card-title">Pricing & stock</h2>
                <div className="form-row form-group">
                  <div><label>Cost price ($)</label><input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} /></div>
                  <div><label>Selling price ($)</label><input type="number" name="price" value={formData.price} onChange={handleChange} /></div>
                  <div><label>Stock Quantity</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} /></div>
                </div>
              </div>
            </div>

            <div className="sidebar-column">
              <div className="edit-card danger-zone">
                <h2 className="card-title">Danger Zone</h2>
                <p className="danger-text">Permanently remove this product from the warehouse.</p>
                <button type="button" className="btn-danger" onClick={handleDelete}>Delete product</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}