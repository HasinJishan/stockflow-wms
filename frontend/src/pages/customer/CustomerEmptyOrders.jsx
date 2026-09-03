import { useEffect, useRef } from 'react';

const STYLE = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #E9E9E9; display: flex; justify-content: center; padding: 40px 0; }
.frame { width: 1440px; height: 1024px; background: #FAFAF8; font-family: 'Inter', sans-serif; color: #111827; }
.panel-wrap { padding: 32px 40px; }
.empty-state { border: 1px dashed #D9D6CC; border-radius: 16px; padding: 80px 40px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.empty-icon { width: 64px; height: 64px; background: #EFF4FF; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.empty-icon svg { width: 30px; height: 30px; stroke: #2F6FED; }
h2 { font-size: 19px; font-weight: 700; margin-bottom: 8px; }
p { font-size: 14px; color: #6B7280; max-width: 340px; line-height: 1.6; margin-bottom: 22px; }
.btn-primary { height: 42px; padding: 0 22px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }

`;
const HTML = `
<div class="frame">
  <div class="panel-wrap">
    <div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      </div>
      <h2>No orders yet</h2>
      <p>When you place your first order, it'll show up here so you can track it from checkout to delivery.</p>
      <button class="btn-primary">Start shopping</button>
    </div>
  </div>
</div>
`;

export default function CustomerEmptyOrders() {
  const rootRef = useRef(null);

  return (
    <div ref={rootRef}>
      <style>{STYLE}</style>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </div>
  );
}
