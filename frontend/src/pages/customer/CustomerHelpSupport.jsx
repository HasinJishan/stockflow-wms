import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const HELP_CATEGORIES = [
  { title: "Orders & shipping", desc: "Tracking, delays, delivery issues", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
  )},
  { title: "Returns & refunds", desc: "Return window, refund timing", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  )},
  { title: "Payments & billing", desc: "Cards, promo codes, receipts", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  )},
  { title: "Account & access", desc: "Password, saved items, addresses", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
];

const ARTICLES = [
  { id: 1, title: "How to track my order", tag: "Orders & shipping", desc: "Go to Track shipment and select the order — the timeline updates automatically as its status changes." },
  { id: 2, title: "How to apply a promo code", tag: "Payments & billing", desc: "Enter the code in the cart before checkout. Only one promo code can be applied per order." },
  { id: 3, title: "Updating your saved address", tag: "Account & access", desc: "Go to Addresses to add, edit, or set a default delivery or billing address." },
  { id: 4, title: "Managing saved items", tag: "Account & access", desc: "Go to Saved items to view products you've bookmarked, add them to your cart, or remove them." },
  { id: 5, title: "Resetting your password", tag: "Account & access", desc: "Use 'Forgot password' on the login screen — a reset link will be sent to the email on your account." },
];

const STYLES = `
  .help-user { font-family: 'Inter', sans-serif; color: #111827; }
  
  .search-box { width: 100%; height: 48px; background: #fff; border: 1px solid #E5E5E0; border-radius: 8px; display: flex; align-items: center; padding: 0 16px; margin-bottom: 24px; }
  .search-box input { border: none; outline: none; flex: 1; font-size: 14px; margin-left: 12px; }
  .search-box svg { width: 18px; height: 18px; stroke: #9CA3AF; }

  .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .cat-card { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; }
  .cat-icon { width: 36px; height: 36px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; margin-bottom: 12px; }
  .cat-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .cat-desc { font-size: 11.5px; color: #6B7280; line-height: 1.4; }

  .content-split { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
  
  .articles-panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; }
  .panel-head { margin-bottom: 24px; }
  .panel-title { font-size: 16px; font-weight: 700; }

  .art-item { padding: 20px 0; border-bottom: 1px solid #F1F0EA; }
  .art-item:last-child { border-bottom: none; padding-bottom: 0; }
  .art-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; }
  .art-title { font-size: 14px; font-weight: 600; color: #111827; }
  .tag { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: #F1F0EA; color: #6B7280; white-space: nowrap; }
  .art-desc { font-size: 13px; color: #6B7280; line-height: 1.6; }

  .side-card { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
  .side-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; }
  
  .contact-link { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid #F1F0EA; text-decoration: none; }
  .contact-link:last-child { border-bottom: none; }
  .contact-icon { width: 34px; height: 34px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; flex-shrink: 0; }
  .contact-icon svg { width: 18px; height: 18px; }
  .contact-text b { font-size: 13px; display: block; color: #111827; }
  .contact-text span { font-size: 11px; color: #6B7280; }

  @media (max-width: 1024px) {
    .cat-grid { grid-template-columns: repeat(2, 1fr); }
    .content-split { grid-template-columns: 1fr; }
  }
`;

export default function CustomerHelp() {
  const [query, setQuery] = useState("");

  const filteredArticles = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.desc.toLowerCase().includes(query.toLowerCase()) ||
      a.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout title="Help & support" subtitle="Find answers about your orders, returns, and account.">
      <div className="help-user">
        <style>{STYLES}</style>

        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            placeholder="Search help articles, e.g. 'where is my order'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="cat-grid">
          {HELP_CATEGORIES.map((cat) => (
            <div className="cat-card" key={cat.title}>
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-title">{cat.title}</div>
              <div className="cat-desc">{cat.desc}</div>
            </div>
          ))}
        </div>

        <div className="content-split">
          <div className="articles-panel">
            <div className="panel-head">
              <h2 className="panel-title">Help articles</h2>
            </div>
            {filteredArticles.length === 0 ? (
              <div style={{ padding: 20, color: "#9CA3AF", fontSize: 13 }}>No articles match your search.</div>
            ) : (
              filteredArticles.map((art) => (
                <div className="art-item" key={art.id}>
                  <div className="art-top">
                    <span className="art-title">{art.title}</span>
                    <span className="tag">{art.tag}</span>
                  </div>
                  <p className="art-desc">{art.desc}</p>
                </div>
              ))
            )}
          </div>

          <div>
            <div className="side-card">
              <h2 className="side-title">Get in touch</h2>
              <a href="mailto:help@stockflow.com?subject=StockFlow%20WMS%20Support%20Request" className="contact-link">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div className="contact-text">
                  <b>Email us</b>
                  <span>help@stockflow.com</span>
                </div>
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