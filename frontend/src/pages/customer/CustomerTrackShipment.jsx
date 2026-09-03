import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

const SHIPMENTS = [
  { id: "#10432", carrier: "BlueDart", tracking: "BD84920133IN", items: 3, status: "Out for delivery", type: "blue" },
  { id: "#10425", carrier: "Delhivery", tracking: "DL10293841IN", items: 2, status: "In transit", type: "amber" },
  { id: "#10418", carrier: "BlueDart", tracking: "BD84811902IN", items: 1, status: "In transit", type: "amber" },
  { id: "#10401", carrier: "Delhivery", tracking: "DL10281123IN", items: 1, status: "Delivered", type: "green" },
  { id: "#10388", carrier: "BlueDart", tracking: "BD84790112IN", items: 5, status: "Delivered", type: "green" },
];

const STYLES = `
  .track * { box-sizing: border-box; }
  .track .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
  .track .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .track .kpi-card.warning { background: #FAEEDA; }
  .track .kpi-card.success { background: #EAF6EE; }
  .track .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .track .kpi-value { font-size: 26px; font-weight: 700; }
  .track .kpi-card.warning .kpi-value { color: #854F0B; }
  .track .kpi-card.success .kpi-value { color: #1F9D55; }

  .track .track-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
  .track .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .track .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;}
  
  .track .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .track .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .track .badge.amber { background: #FAEEDA; color: #854F0B; }
  .track .badge.green { background: #EAF6EE; color: #1F9D55; }

  .track .track-timeline { display: flex; align-items: flex-start; padding: 10px 0; margin-top: 10px;}
  .track .track-step { flex: 1; text-align: center; position: relative; }
  .track .track-dot { width: 28px; height: 28px; border-radius: 50%; background: #2F6FED; color: #FFFFFF; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 14px; position: relative; z-index: 1; }
  .track .track-dot.pending { background: #E5E5E0; color: #9CA3AF; }
  .track .track-line { position: absolute; top: 14px; left: -50%; width: 100%; height: 2px; background: #2F6FED; z-index: 0; }
  .track .track-line.pending { background: #E5E5E0; }
  .track .track-step:first-child .track-line { display: none; }
  .track .track-label { font-size: 12px; font-weight: 600; }
  .track .track-time { font-size: 11px; color: #9CA3AF; margin-top: 4px; }

  .track table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .track th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px; font-size: 12px; border-bottom: 1px solid #E5E5E0; text-transform: uppercase;}
  .track td { padding: 12px 8px; border-bottom: 1px solid #F1F0EA; }

  @media (max-width: 1024px) {
    .track .track-grid { grid-template-columns: 1fr; }
    .track .track-timeline { flex-direction: column; text-align: left; padding-left: 20px; }
    .track .track-line { width: 2px; height: 100%; left: 13px; top: 28px; }
    .track .track-step { padding-bottom: 20px; display: flex; gap: 15px; }
    .track .track-dot { margin: 0; }
  }
`;

export default function CustomerTrackShipment() {
  return (
    <DashboardLayout title="Track shipment" subtitle="Follow your orders from warehouse to doorstep.">
      <div className="track">
        <style>{STYLES}</style>
        
        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Active shipments</div><div className="kpi-value">3</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Out for delivery</div><div className="kpi-value">1</div></div>
          <div className="kpi-card success"><div className="kpi-label">Delivered this month</div><div className="kpi-value">9</div></div>
        </div>

        <div className="track-grid">
          <div>
            <div className="panel">
              <div className="panel-title">
                Order #10432
                <span className="badge blue">Out for delivery</span>
              </div>
              <div className="track-timeline">
                <div className="track-step">
                  <div className="track-dot">✓</div>
                  <div><div className="track-label">Order placed</div><div className="track-time">Jul 24, 9:02 AM</div></div>
                </div>
                <div className="track-step">
                  <div className="track-line"></div>
                  <div className="track-dot">✓</div>
                  <div><div className="track-label">Packed</div><div className="track-time">Jul 24, 2:14 PM</div></div>
                </div>
                <div className="track-step">
                  <div className="track-line"></div>
                  <div className="track-dot">✓</div>
                  <div><div className="track-label">Shipped</div><div className="track-time">Jul 25, 8:30 AM</div></div>
                </div>
                <div className="track-step">
                  <div className="track-line"></div>
                  <div className="track-dot">✓</div>
                  <div><div className="track-label">Out for delivery</div><div className="track-time">Today, 8:15 AM</div></div>
                </div>
                <div className="track-step">
                  <div className="track-line pending"></div>
                  <div className="track-dot pending">5</div>
                  <div><div className="track-label" style={{color: '#9CA3AF'}}>Delivered</div><div className="track-time">Expected today</div></div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">All shipments</div>
              <table>
                <thead>
                  <tr><th>Order</th><th>Carrier</th><th>Tracking ID</th><th style={{textAlign:'right'}}>Status</th></tr>
                </thead>
                <tbody>
                  {SHIPMENTS.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.carrier}</td>
                      <td style={{fontFamily: 'monospace'}}>{s.tracking}</td>
                      <td style={{textAlign:'right'}}><span className={`badge ${s.type}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="panel">
              <div className="panel-title">Delivery instructions</div>
              <p style={{fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 15}}>
                "Leave with security guard if not home. Ring the bell twice."
              </p>
              <button style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer', fontWeight: 600}}>
                Edit instructions
              </button>
            </div>
            <div className="panel" style={{background: '#2F6FED', color: '#fff', border: 'none'}}>
              <div className="panel-title" style={{color: '#fff'}}>Need help?</div>
              <p style={{fontSize: 13, opacity: 0.9, marginBottom: 15}}>
                Issue with a delivery or tracking number not updating?
              </p>
              <button style={{width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#fff', color: '#2F6FED', cursor: 'pointer', fontWeight: 700}}>
                Contact support
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}