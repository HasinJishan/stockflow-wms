import React, { useState, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const ZONES = ["All bins", "Zone A", "Zone B", "Zone C"];

const ITEMS = [
  { product: "Corrugated box (M)", bin: "B-14", zone: "Zone B", expected: 25, counted: 15 },
  { product: "Pallet wrap 20\"", bin: "C-11", zone: "Zone C", expected: 20, counted: 3 },
  { product: "Barcode scanner X200", bin: "D-05", zone: "Zone A", expected: 48, counted: 48 },
  { product: "Warehouse gloves (L)", bin: "C-02", zone: "Zone C", expected: 210, counted: 210 },
  { product: "Shipping labels (roll)", bin: "A-06", zone: "Zone A", expected: 30, counted: 8 },
  { product: "Packing tape (48mm)", bin: "A-09", zone: "Zone A", expected: 40, counted: 18 },
  { product: "Handheld RF terminal", bin: "D-08", zone: "Zone A", expected: 32, counted: 32 },
  { product: "Hi-vis safety vest", bin: "C-05", zone: "Zone C", expected: 15, counted: 0 },
  { product: "Bubble wrap roll", bin: "A-12", zone: "Zone A", expected: 22, counted: 22 },
  { product: "Stretch film dispenser", bin: "B-07", zone: "Zone B", expected: 10, counted: 6 },
];

function statusFor(expected, counted) {
  if (expected === counted) return { label: "Matches", color: "green" };
  if (counted === 0 || expected - counted >= expected * 0.6) return { label: "Flagged", color: "red" };
  return { label: "Recount", color: "amber" };
}

const STYLES = `
  .si * { box-sizing: border-box; }
  .si { font-family: 'Inter', sans-serif; }

  .si .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
  .si .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 16px; }
  .si .kpi-card.warning { background: #FAEEDA; }
  .si .kpi-card.danger { background: #FCEBEB; }
  .si .kpi-label { font-size: 12.5px; color: #6B7280; margin-bottom: 5px; }
  .si .kpi-card.warning .kpi-label { color: #854F0B; }
  .si .kpi-card.danger .kpi-label { color: #A32D2D; }
  .si .kpi-value { font-size: 24px; font-weight: 700; }
  .si .kpi-card.warning .kpi-value { color: #854F0B; }
  .si .kpi-card.danger .kpi-value { color: #A32D2D; }

  .si .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 12px; flex-wrap: wrap; }
  .si .search-box { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 8px; padding: 0 12px; height: 38px; width: 280px; max-width: 100%; }
  .si .search-box svg { width: 15px; height: 15px; stroke: #9CA3AF; flex-shrink: 0; }
  .si .search-box input { border: none; outline: none; font-family: inherit; font-size: 13.5px; width: 100%; }
  .si .filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
  .si .filter-tab { padding: 7px 14px; border-radius: 8px; font-size: 12.5px; color: #6B7280; cursor: pointer; background: none; border: none; font-family: inherit; white-space: nowrap; }
  .si .filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }

  .si .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px 20px; overflow-x: auto; }
  .si table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 520px; }
  .si th { text-align: left; font-weight: 500; color: #6B7280; padding: 7px 8px; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .si th.num, .si td.num { text-align: right; }
  .si td { padding: 10px 8px; border-bottom: 1px solid #F1F0EA; }
  .si tr:last-child td { border-bottom: none; }

  .si .badge { font-size: 11.5px; padding: 3px 11px; border-radius: 7px; font-weight: 600; display: inline-block; }
  .si .badge.green { background: #EAF6EE; color: #1F9D55; }
  .si .badge.amber { background: #FAEEDA; color: #854F0B; }
  .si .badge.red { background: #FCEBEB; color: #A32D2D; }

  .si .empty { text-align: center; padding: 40px 20px; color: #6B7280; font-size: 13.5px; }

  .si .app-footer { margin-top: 16px; padding-top: 14px; border-top: 1px solid #E5E5E0; font-size: 11.5px; color: #9CA3AF; text-align: center; }
  .si .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 900px) {
    .si .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .si .kpi-row { grid-template-columns: 1fr; }
    .si .search-box { width: 100%; }
  }
`;

export default function StaffInventory() {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("All bins");

  const filtered = useMemo(() => {
    return ITEMS.filter((i) => {
      const matchesZone = zone === "All bins" || i.zone === zone;
      const matchesQuery =
        i.product.toLowerCase().includes(query.toLowerCase()) ||
        i.bin.toLowerCase().includes(query.toLowerCase());
      return matchesZone && matchesQuery;
    });
  }, [query, zone]);

  const flaggedCount = ITEMS.filter((i) => statusFor(i.expected, i.counted).label === "Flagged").length;
  const recountCount = ITEMS.filter((i) => statusFor(i.expected, i.counted).label === "Recount").length;

  return (
    <DashboardLayout title="Inventory" subtitle="Zone B stock levels · read access, request recounts as needed.">
      <div className="si">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">SKUs in Zone B</div><div className="kpi-value">412</div></div>
          <div className="kpi-card danger"><div className="kpi-label">Discrepancies flagged</div><div className="kpi-value">{flaggedCount}</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Pending recounts</div><div className="kpi-value">{recountCount}</div></div>
          <div className="kpi-card"><div className="kpi-label">Last full count</div><div className="kpi-value" style={{ fontSize: 17 }}>Jul 20, 2026</div></div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input placeholder="Search by product or bin…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {ZONES.map((z) => (
              <button key={z} className={`filter-tab${zone === z ? " active" : ""}`} onClick={() => setZone(z)}>
                {z}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          {filtered.length === 0 ? (
            <div className="empty">No items match your search or filter.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Product</th><th>Bin</th><th>Expected</th><th>Counted</th><th className="num">Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((i) => {
                  const s = statusFor(i.expected, i.counted);
                  return (
                    <tr key={i.bin + i.product}>
                      <td>{i.product}</td>
                      <td>{i.bin}</td>
                      <td>{i.expected}</td>
                      <td>{i.counted}</td>
                      <td className="num"><span className={`badge ${s.color}`}>{s.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}