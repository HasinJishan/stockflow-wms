import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

// 1. Import the local image from your assets folder
import defaultScannerImg from "../../assets/Laser Handheld Barcode Scanner.jpg";

const STYLES = `
  .pd-container { font-family: 'Inter', sans-serif; color: #111827; }
  .pd-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
  .pd-card { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .pd-card-title { font-size: 15px; font-weight: 600; margin: 0 0 16px 0; color: #111827; }

  .pd-image-box { 
    background: #F8FAFC; 
    border-radius: 8px; 
    height: 200px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    margin-bottom: 16px; 
    border: 1px solid #F1F5F9; 
    overflow: hidden;
  }
  .pd-image-box img { width: 100%; height: 100%; object-fit: contain; }
  
  .pd-row { display: flex; padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; align-items: flex-start; }
  .pd-row:last-child { border-bottom: none; }
  .pd-label { color: #6B7280; width: 110px; flex-shrink: 0; }
  .pd-val { font-weight: 500; color: #111827; flex: 1; text-align: right; }

  .pd-badge { padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
  .status-low { background: #FEF3C7; color: #92400E; }
  .status-shipped { background: #DBEAFE; color: #1E40AF; }
  .status-delivered { background: #D1FAE5; color: #065F46; }

  .pd-progress-bg { background: #E5E7EB; height: 6px; border-radius: 3px; margin: 10px 0; overflow: hidden; }
  .pd-progress-fill { background: #D97706; height: 100%; border-radius: 3px; }

  .pd-price-row { display: flex; gap: 48px; margin-top: 15px; }
  .pd-price-val { font-size: 24px; font-weight: 700; color: #111827; margin-top: 4px; }
  .pd-price-val.blue { color: #2563EB; }

  .pd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .pd-table th { text-align: left; color: #6B7280; font-weight: 500; border-bottom: 1px solid #E5E7EB; padding: 10px 8px; font-size: 11px; text-transform: uppercase; }
  .pd-table td { padding: 12px 8px; border-bottom: 1px solid #F1F5F9; color: #374151; }
  .text-red { color: #DC2626; font-weight: 600; }
  .text-green { color: #16A34A; font-weight: 600; }

  .pd-btn-edit { background: #2563EB; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; }
`;

export default function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get(`http://   stockflow-wms-backend.onrender.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(res.data);
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <DashboardLayout title="Loading..."><div>Please wait...</div></DashboardLayout>;
  if (!product) return <DashboardLayout title="Error"><div>Product Not Found</div></DashboardLayout>;

  return (
    <DashboardLayout
      title={product.name}
      subtitle={`SKU: ${product.sku} · ${product.category}`}
      actions={<button className="pd-btn-edit" onClick={() => navigate(`/admin/products/${id}/edit`)}>Edit product</button>}
    >
      <div className="pd-container">
        <style>{STYLES}</style>
        <div className="pd-grid">
          
          <aside>
            <div className="pd-card">
              <div className="pd-image-box">
                {/* 2. Priority logic: If DB has a URL, use it. If not, use the imported local image */}
                <img 
                    src={product.imageUrl || defaultScannerImg} 
                    alt={product.name} 
                />
              </div>
              <div className="pd-row"><span className="pd-label">Status</span><span className="pd-badge status-low">{product.status}</span></div>
              <div className="pd-row"><span className="pd-label">Category</span><span className="pd-val">{product.category}</span></div>
              <div className="pd-row"><span className="pd-label">Unit</span><span className="pd-val">{product.unit || "Each"}</span></div>
              <div className="pd-row"><span className="pd-label">Added</span><span className="pd-val">Mar 3, 2026</span></div>
            </div>

            <div className="pd-card">
              <h3 className="pd-card-title">Stock level</h3>
              <div className="pd-row"><span className="pd-label">Current stock</span><span className="pd-val">{product.quantity} / {product.reorderLevel}</span></div>
              <div className="pd-progress-bg"><div className="pd-progress-fill" style={{ width: '60%' }}></div></div>
              <div className="pd-row"><span className="pd-label">Reorder level</span><span className="pd-val">{product.reorderLevel}</span></div>
              <div className="pd-row"><span className="pd-label">Max stock</span><span className="pd-val">{product.maxStock || 100}</span></div>
            </div>

            <div className="pd-card">
              <h3 className="pd-card-title">Supplier & location</h3>
              <div className="pd-row"><span className="pd-label">Supplier</span><span className="pd-val">{product.supplier || "Global Logistics"}</span></div>
              <div className="pd-row"><span className="pd-label">Lead time</span><span className="pd-val">{product.leadTime || "5 days"}</span></div>
              <div className="pd-row"><span className="pd-label">Warehouse</span><span className="pd-val">{product.warehouseLocation || "Main Hub"}</span></div>
              <div className="pd-row"><span className="pd-label">Bin location</span><span className="pd-val">{product.binLocation || "A-1"}</span></div>
            </div>
          </aside>

          <main>
            <div className="pd-card">
              <h3 className="pd-card-title">Description</h3>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#4B5563', margin: 0 }}>{product.description || "No description provided."}</p>
              <div className="pd-price-row">
                <div><div className="pd-label" style={{fontSize: '12px'}}>Cost price</div><div className="pd-price-val">${product.costPrice}</div></div>
                <div><div className="pd-label" style={{fontSize: '12px'}}>Selling price</div><div className="pd-price-val blue">${product.price}</div></div>
              </div>
            </div>

            <div className="pd-card">
              <h3 className="pd-card-title">Stock history</h3>
              <table className="pd-table">
                <thead><tr><th>Date</th><th>Type</th><th>Change</th><th>By</th></tr></thead>
                <tbody>
                   <tr><td>Aug 31, 2026</td><td>System Entry</td><td className="text-green">+{product.quantity}</td><td>Admin</td></tr>
                </tbody>
              </table>
            </div>

            <div className="pd-card">
              <h3 className="pd-card-title">Recent orders</h3>
              <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF', fontSize: '13px' }}>
                 No orders found for this SKU yet.
              </div>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}