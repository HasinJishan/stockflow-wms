import { useEffect, useRef } from 'react';

const STYLE = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #E9E9E9; display: flex; justify-content: center; padding: 40px 0; }
.frame { width: 1440px; height: 1024px; background: #FAFAF8; font-family: 'Inter', sans-serif; color: #111827; display: flex; flex-direction: column; }
.nav { height: 80px; display: flex; align-items: center; padding: 0 56px; border-bottom: 1px solid #E5E5E0; }
.logo-group { display: flex; align-items: center; gap: 10px; }
.logo-mark { width: 32px; height: 32px; background: #2F6FED; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.logo-mark svg { width: 18px; height: 18px; }
.logo-text { font-size: 16px; font-weight: 700; }
.center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.error-code { font-size: 120px; font-weight: 800; color: #DCE9FD; line-height: 1; letter-spacing: -0.03em; }
.error-icon { width: 64px; height: 64px; background: #EFF4FF; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: -40px auto 24px; position: relative; }
.error-icon svg { width: 30px; height: 30px; stroke: #2F6FED; }
h1 { font-size: 26px; font-weight: 700; margin-bottom: 10px; }
p { font-size: 15px; color: #6B7280; max-width: 380px; line-height: 1.6; margin-bottom: 28px; }
.actions { display: flex; gap: 12px; }
.btn-primary { height: 46px; padding: 0 26px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 999px; font-size: 15px; font-weight: 600; cursor: pointer; }
.btn-outline { height: 46px; padding: 0 26px; background: #FFFFFF; color: #111827; border: 1px solid #D1D5DB; border-radius: 999px; font-size: 15px; font-weight: 500; cursor: pointer; }
.help-link { margin-top: 28px; font-size: 13.5px; color: #9CA3AF; }
.help-link span { color: #2F6FED; cursor: pointer; font-weight: 500; }

`;
const HTML = `
<div class="frame">
  <div class="nav">
    <div class="logo-group"><div class="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div><div class="logo-text">StockFlow WMS</div></div>
  </div>
  <div class="center">
    <div class="error-code">404</div>
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </div>
    <h1>Page not found</h1>
    <p>The page you're looking for doesn't exist, may have been moved, or the link might be broken.</p>
    <div class="actions">
      <button class="btn-outline">Go back</button>
      <button class="btn-primary">Back to dashboard</button>
    </div>
    <div class="help-link">Still stuck? <span>Contact support</span></div>
  </div>
</div>
`;

export default function NotFound() {
  const rootRef = useRef(null);

  return (
    <div ref={rootRef}>
      <style>{STYLE}</style>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </div>
  );
}
