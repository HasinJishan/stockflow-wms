import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const HELP_CATEGORIES = [
  { title: "Getting started", desc: "Your first shift, dashboard basics", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
  )},
  { title: "Pick & pack", desc: "Picking orders, packing stations", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  )},
  { title: "Stock updates", desc: "Logging counts, discrepancies", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  )},
  { title: "Account & access", desc: "Password, permissions", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
];

const ARTICLES = [
  {
    id: 1,
    title: "How to mark an order as packed",
    tag: "Pick & pack",
    desc: "Open the order in Pick & pack, confirm every line item is checked off, then use the action button to advance the order. The order status updates automatically."
  },
  {
    id: 2,
    title: "What happens after I submit a stock update",
    tag: "Stock updates",
    desc: "Stock updates apply to live inventory immediately once submitted. The product's quantity and status update right away, and a low-stock alert fires automatically if needed."
  },
  {
    id: 3,
    title: "Understanding bin locations",
    tag: "Inventory",
    desc: "Each product's bin location is shown on the Inventory page. Use the search box to find a product by name or bin code."
  },
  {
    id: 4,
    title: "Resetting your password",
    tag: "Account",
    desc: "Use 'Forgot password' on the login screen — a reset link will be sent to the email on your account."
  },
  {
    id: 5,
    title: "Updating your profile",
    tag: "Account",
    desc: "Go to Account, edit your name or email under Personal information, and click Save changes."
  }
];

const STYLES = `
  .help-page { font-family: 'Inter', sans-serif; color: #111827; }
  
  .search-container { width: 100%; height: 48px; background: #fff; border: 1px solid #E5E5E0; border-radius: 8px; display: flex; align-items: center; padding: 0 16px; margin-bottom: 20px; }
  .search-container input { border: none; outline: none; flex: 1; font-size: 14px; margin-left: 12px; }
  .search-container svg { width: 18px; height: 18px; stroke: #9CA3AF; }

  .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .cat-card { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 16px; }
  .cat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .cat-icon { width: 36px; height: 36px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; }
  .cat-icon svg { width: 18px; height: 18px; }
  .cat-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .cat-desc { font-size: 11.5px; color: #6B7280; line-height: 1.4; }

  .support-content { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
  
  .articles-panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; }
  .panel-header { margin-bottom: 20px; }
  .panel-title { font-size: 15px; font-weight: 700; }
  
  .article-item { padding: 20px 0; border-bottom: 1px solid #F1F0EA; }
  .article-item:last-child { border-bottom: none; padding-bottom: 0; }
  .article-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; }
  .article-name { font-size: 14px; font-weight: 600; color: #111827; }
  .badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: #F1F0EA; color: #6B7280; white-space: nowrap; }
  .article-desc { font-size: 12.5px; color: #6B7280; line-height: 1.6; }

  .side-panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .side-panel-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; }
  
  .contact-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F1F0EA; }
  .contact-item:last-child { border-bottom: none; }
  .contact-icon { width: 34px; height: 34px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; flex-shrink: 0; }
  .contact-icon svg { width: 16px; height: 16px; }
  .contact-info b { font-size: 13px; display: block; }
  .contact-info span { font-size: 11px; color: #6B7280; }

  @media (max-width: 1100px) {
    .cat-grid { grid-template-columns: repeat(2, 1fr); }
    .support-content { grid-template-columns: 1fr; }
  }
`;

export default function StaffHelp() {
  const [query, setQuery] = useState("");

  const filteredArticles = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.desc.toLowerCase().includes(query.toLowerCase()) ||
      a.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout title="Help & support" subtitle="Find answers or get in touch with your team.">
      <div className="help-page">
        <style>{STYLES}</style>

        <div className="search-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            placeholder="Search help articles, e.g. 'how to update stock count'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="cat-grid">
          {HELP_CATEGORIES.map((cat) => (
            <div className="cat-card" key={cat.title}>
              <div className="cat-head">
                <div className="cat-icon">{cat.icon}</div>
              </div>
              <div className="cat-title">{cat.title}</div>
              <div className="cat-desc">{cat.desc}</div>
            </div>
          ))}
        </div>

        <div className="support-content">
          <div className="articles-panel">
            <div className="panel-header">
              <h2 className="panel-title">Help articles</h2>
            </div>
            {filteredArticles.length === 0 ? (
              <div style={{ padding: 20, color: "#9CA3AF", fontSize: 13 }}>No articles match your search.</div>
            ) : (
              filteredArticles.map((art) => (
                <div className="article-item" key={art.id}>
                  <div className="article-top">
                    <span className="article-name">{art.title}</span>
                    <span className="badge">{art.tag}</span>
                  </div>
                  <p className="article-desc">{art.desc}</p>
                </div>
              ))
            )}
          </div>

          <div>
            <div className="side-panel">
              <h2 className="side-panel-title">Get in touch</h2>
              <div className="contact-item">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div className="contact-info">
                  <b>Email support</b>
                  <span>support@stockflow.com</span>
                </div>
              </div>
              <a href="mailto:support@stockflow.com?subject=StockFlow%20WMS%20Support%20Request" style={{ textDecoration: "none" }}>
                <button className="btn-outline" style={{ width: "100%", marginTop: 14, height: 40, background: "#2F6FED", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                  Email us
                </button>
              </a>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "40px 0", fontSize: "11px", color: "#9CA3AF" }}>
          © 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}