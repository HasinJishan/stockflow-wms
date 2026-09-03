import React, { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  ["Features", "#features"],
  ["Pricing", "#cta"],
  ["About", "#testimonial"],
  ["Contact", "#footer"],
];
const STATS = [
  ["500+", "Warehouses onboarded"],
  ["2.3M", "Orders tracked monthly"],
  ["99.9%", "Platform uptime"],
  ["24/7", "Support coverage"],
];
const FEATURES = [
  ["M12 20V10M18 20V4M6 20v-4", "Live stock tracking", "See inventory levels update in real time as orders move through your warehouse floor."],
  ["M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0", "Low stock alerts", "Get notified automatically before shelves run empty, so you never miss a reorder point."],
  ["M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", "Order fulfillment", "Track every order from pick to pack to ship, with status visible to your whole team."],
];
const STEPS = [
  ["Import your inventory", "Upload your product catalog and current stock levels, or connect an existing system."],
  ["Set your team up", "Invite admins, managers, and warehouse staff, each with the access level they need."],
  ["Track in real time", "Watch stock, orders, and alerts update live as your team works the floor."],
];
const FOOTER_COLUMNS = [
  ["Product", [["Features", "#features"], ["Pricing", "#cta"], ["Integrations", "#footer"], ["Changelog", "#footer"]]],
  ["Company", [["About", "#testimonial"], ["Careers", "#footer"], ["Blog", "#footer"], ["Contact", "#footer"]]],
  ["Resources", [["Documentation", "#footer"], ["Help center", "#footer"], ["API status", "#footer"], ["Community", "#footer"]]],
  ["Legal", [["Privacy policy", "#footer"], ["Terms of service", "#footer"], ["Security", "#footer"]]],
];
const SOCIAL = [
  ["https://twitter.com", "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"],
  ["https://linkedin.com", "M2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM22 21v-6.5a4.5 4.5 0 0 0-4.5-4.5c-1.5 0-3 1-3.5 2.5V10h-4v11h4v-6c0-1.5 1-2.5 2-2.5s2 1 2 2.5v6h4z"],
  ["https://instagram.com", "M2 2h20v20H2zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"],
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  :root{--accent:#2F6FED;--accent-soft:#DCE9FD;--accent-tint:#EFF4FF;--ink:#111827;--body:#4B5563;--muted:#6B7280;--faint:#9CA3AF;--line:#E5E5E0;--border:#D1D5DB;--paper:#FAFAF8;}
  html { scroll-behavior: smooth; }
  .sf * { box-sizing: border-box; margin: 0; padding: 0; }
  .sf { background: var(--paper); font-family: 'Inter', sans-serif; color: var(--ink); overflow-x: hidden; }
  .sf section, .sf .nav { padding: 0 64px; }
  .sf a { text-decoration: none; color: inherit; }

  .sf .nav { height: 88px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); position: relative; z-index: 30; background: var(--paper); }
  .sf .brand { display: flex; align-items: center; gap: 12px; }
  .sf .mark { width: 34px; height: 34px; flex-shrink: 0; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .sf .mark svg { width: 20px; height: 20px; }
  .sf .brand-name { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
  .sf .links { display: flex; gap: 44px; }
  .sf .links a, .sf .menu a { font-size: 16px; color: var(--body); cursor: pointer; }
  .sf .links a:hover, .sf .menu a:hover { color: var(--accent); }
  .sf .actions { display: flex; gap: 14px; align-items: center; }

  .sf .btn { height: 44px; padding: 0 24px; border-radius: 999px; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; border: none; display: inline-flex; align-items: center; justify-content: center; }
  .sf .btn.ghost { background: #fff; border: 1px solid var(--border); color: var(--ink); font-weight: 500; }
  .sf .btn.ghost:hover { background: #F5F5F3; }
  .sf .btn.fill { background: var(--accent); color: #fff; }
  .sf .btn.fill:hover { background: #255BC7; }
  .sf .btn.lg { height: 52px; padding: 0 30px; font-size: 16px; }

  .sf .toggle { display: none; width: 40px; height: 40px; border: 1px solid var(--border); border-radius: 8px; background: #fff; align-items: center; justify-content: center; cursor: pointer; }
  .sf .toggle svg { width: 20px; height: 20px; stroke: var(--ink); }
  .sf .menu { display: none; }

  .sf .hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; padding-top: 80px; padding-bottom: 90px; }
  .sf .eyebrow { display: inline-block; background: var(--accent-soft); color: var(--accent); font-size: 14px; font-weight: 500; padding: 8px 18px; border-radius: 999px; }
  .sf .hero h1 { font-size: 46px; font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; margin: 22px 0 18px; }
  .sf .hero p { font-size: 17px; color: var(--muted); max-width: 480px; line-height: 1.6; margin-bottom: 32px; }
  .sf .row { display: flex; gap: 16px; }

  .sf .stats { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 40px 64px; background: #fff; }
  .sf .stat { text-align: center; border-right: 1px solid #EDEBE4; }
  .sf .stat:last-child { border-right: none; }
  .sf .stat b { display: block; font-size: 34px; font-weight: 800; color: var(--accent); }
  .sf .stat span { font-size: 14px; color: var(--muted); }

  .sf .head { text-align: center; padding: 70px 64px 8px; }
  .sf .head.tight { padding-top: 20px; }
  .sf .eyebrow-sm { font-size: 14px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.04em; }
  .sf .head h2 { font-size: 34px; font-weight: 700; letter-spacing: -0.01em; margin: 10px 0 12px; }
  .sf .head p { font-size: 16px; color: var(--muted); max-width: 560px; margin: 0 auto; }

  .sf .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 36px 64px 20px; scroll-margin-top: 100px; }
  .sf .card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 32px 28px; }
  .sf .icon-box { width: 44px; height: 44px; background: var(--accent-tint); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .sf .icon-box svg { width: 22px; height: 22px; }
  .sf .card h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .sf .card p, .sf .step p { font-size: 15px; color: var(--muted); line-height: 1.6; }

  .sf .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 40px 64px 90px; }
  .sf .step { text-align: center; padding: 0 20px; }
  .sf .num { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; }
  .sf .step h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
  .sf .step p { font-size: 14px; }

  .sf .testimonial { background: var(--ink); padding: 70px 64px; text-align: center; scroll-margin-top: 40px; }
  .sf .quote { font-size: 26px; font-weight: 600; color: #fff; max-width: 760px; margin: 0 auto 24px; line-height: 1.5; letter-spacing: -0.01em; }
  .sf .by { font-size: 15px; color: var(--faint); }
  .sf .by b { color: #fff; }

  .sf .cta { text-align: center; padding: 80px 64px; scroll-margin-top: 40px; }
  .sf .cta h2 { font-size: 32px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 14px; }
  .sf .cta p { font-size: 16px; color: var(--muted); margin-bottom: 32px; }

  .sf .footer { background: #F3F2EC; border-top: 1px solid var(--line); padding: 60px 64px 32px; scroll-margin-top: 40px; }
  .sf .foot-top { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr; gap: 24px; padding-bottom: 44px; }
  .sf .foot-brand p { font-size: 14px; color: var(--muted); margin-top: 14px; max-width: 260px; line-height: 1.6; }
  .sf .foot-col h4 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
  .sf .foot-col a { display: block; font-size: 14px; color: var(--muted); margin-bottom: 12px; }
  .sf .foot-col a:hover { color: var(--accent); }
  .sf .foot-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 24px; gap: 16px; flex-wrap: wrap; }
  .sf .foot-bottom span { font-size: 13px; color: var(--faint); }
  .sf .social { display: flex; gap: 14px; }
  .sf .social a { width: 34px; height: 34px; border-radius: 50%; background: #fff; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; }
  .sf .social a:hover { border-color: var(--accent); }
  .sf .social svg { width: 15px; height: 15px; stroke: var(--body); }

  @media (max-width: 1024px) {
    .sf section, .sf .nav { padding-left: 32px; padding-right: 32px; }
    .sf .hero h1 { font-size: 38px; }
    .sf .foot-top { grid-template-columns: 1.4fr 1fr 1fr; row-gap: 32px; }
  }

  @media (max-width: 768px) {
    .sf section, .sf .nav { padding-left: 20px; padding-right: 20px; }
    .sf .nav { height: 68px; }
    .sf .brand-name { font-size: 17px; }
    .sf .links, .sf .actions .btn.ghost { display: none; }
    .sf .toggle { display: flex; }
    .sf .menu.open { display: flex; flex-direction: column; position: absolute; top: 68px; left: 0; right: 0; background: var(--paper); border-bottom: 1px solid var(--line); padding: 8px 20px 20px; z-index: 20; }
    .sf .menu a { padding: 12px 0; border-bottom: 1px solid #EDEBE4; }
    .sf .menu .btn { display: block; width: 100%; margin-top: 12px; text-align: center; }

    .sf .hero { grid-template-columns: 1fr; padding-top: 44px; padding-bottom: 48px; gap: 40px; }
    .sf .hero h1 { font-size: 30px; margin: 18px 0 14px; }
    .sf .hero p { font-size: 15px; max-width: 100%; margin-bottom: 24px; }
    .sf .row { flex-wrap: wrap; }
    .sf .btn.lg { height: 48px; padding: 0 24px; font-size: 15px; flex: 1 1 auto; }

    .sf .stats { grid-template-columns: repeat(2, 1fr); row-gap: 28px; padding: 32px 20px; }
    .sf .stat { border-right: none; }
    .sf .stat b { font-size: 26px; }

    .sf .head { padding: 48px 20px 4px; }
    .sf .head h2 { font-size: 24px; }
    .sf .head p { font-size: 14px; }
    .sf .features { grid-template-columns: 1fr; padding: 24px 20px 8px; }
    .sf .card { padding: 24px 20px; }

    .sf .steps { grid-template-columns: 1fr; gap: 32px; padding: 24px 20px 56px; }
    .sf .step { padding: 0; }

    .sf .testimonial { padding: 44px 20px; }
    .sf .quote { font-size: 19px; }

    .sf .cta { padding: 48px 20px; }
    .sf .cta h2 { font-size: 24px; }
    .sf .cta .row { flex-direction: column; }

    .sf .footer { padding: 40px 20px 24px; }
    .sf .foot-top { grid-template-columns: 1fr 1fr; row-gap: 28px; padding-bottom: 32px; }
    .sf .foot-brand { grid-column: 1 / -1; }
    .sf .foot-bottom { flex-direction: column; align-items: flex-start; }
  }
`;

const Icon = ({ d, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

const BrandMark = () => (
  <div className="mark">
    <Icon stroke="#fff" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
  </div>
);

function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="nav">
      <Link to="/" className="brand" onClick={close}>
        <BrandMark />
        <div className="brand-name">StockFlow WMS</div>
      </Link>

      <div className="links">
        {NAV_LINKS.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </div>

      <div className="actions">
        <Link to="/login" className="btn ghost">Log in</Link>
        <Link to="/signup" className="btn fill">Sign up</Link>
        <button className="toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <Icon stroke="var(--ink)" d={open ? "M18 6 6 18M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} />
        </button>
      </div>

      <div className={`menu${open ? " open" : ""}`}>
        {NAV_LINKS.map(([label, href]) => <a key={label} href={href} onClick={close}>{label}</a>)}
        <Link to="/login" className="btn ghost" onClick={close}>Log in</Link>
      </div>
    </div>
  );
}

const HeroArt = () => (
  <svg viewBox="0 0 480 380" style={{ width: "100%", height: "auto" }}>
    <rect x="20" y="260" width="440" height="14" rx="4" fill="#E5E5E0" />
    <polygon points="240,60 380,120 240,180 100,120" fill="#DCE9FD" />
    <polygon points="100,120 240,180 240,260 100,200" fill="#BFD8FB" />
    <polygon points="380,120 240,180 240,260 380,200" fill="#A9CBFA" />
    <rect x="60" y="150" width="50" height="50" fill="#2F6FED" transform="skewY(-15) translate(20,10)" />
    <rect x="130" y="210" width="46" height="40" rx="4" fill="#2F6FED" />
    <rect x="60" y="210" width="46" height="40" rx="4" fill="#5C90F2" />
    <rect x="340" y="215" width="46" height="36" rx="4" fill="#5C90F2" />
    <rect x="400" y="180" width="46" height="46" rx="4" fill="#2F6FED" />
    <circle cx="240" cy="80" r="18" fill="#fff" stroke="#2F6FED" strokeWidth="3" />
    <path d="M234 80l4 4 8-8" stroke="#2F6FED" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Hero = () => (
  <section className="hero">
    <div>
      <span className="eyebrow">Real-time inventory, simplified</span>
      <h1>Run your warehouse with total visibility</h1>
      <p>Track stock, fulfill orders, and get alerted before you run out, all from one dashboard built for warehouse teams of every size.</p>
      <div className="row">
        <Link to="/signup" className="btn fill lg">Get started free</Link>
        <a href="#features" className="btn ghost lg">View demo</a>
      </div>
    </div>
    <HeroArt />
  </section>
);

const Stats = () => (
  <section className="stats">
    {STATS.map(([value, label]) => (
      <div className="stat" key={label}><b>{value}</b><span>{label}</span></div>
    ))}
  </section>
);

const Features = () => (
  <>
    <div className="head" id="features">
      <div className="eyebrow-sm">Features</div>
      <h2>Everything your warehouse team needs</h2>
      <p>From receiving to shipping, StockFlow keeps every part of your operation in sync.</p>
    </div>
    <section className="features">
      {FEATURES.map(([d, title, desc]) => (
        <div className="card" key={title}>
          <div className="icon-box"><Icon stroke="#2F6FED" d={d} /></div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      ))}
    </section>
  </>
);

const HowItWorks = () => (
  <>
    <div className="head tight">
      <div className="eyebrow-sm">How it works</div>
      <h2>Up and running in three steps</h2>
    </div>
    <section className="steps">
      {STEPS.map(([title, desc], i) => (
        <div className="step" key={title}>
          <div className="num">{i + 1}</div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      ))}
    </section>
  </>
);

const Testimonial = () => (
  <section className="testimonial" id="testimonial">
    <p className="quote">"We cut our stock-out incidents by half in the first month. StockFlow paid for itself before the trial even ended."</p>
    <p className="by"><b>Maria Chen</b> &middot; Operations Manager, Northbridge Logistics</p>
  </section>
);

const CTA = () => (
  <section className="cta" id="cta">
    <h2>Ready to streamline your warehouse?</h2>
    <p>Start free, no credit card required.</p>
    <div className="row" style={{ justifyContent: "center" }}>
      <Link to="/signup" className="btn fill lg">Get started free</Link>
      <a href="mailto:sales@stockflow.com" className="btn ghost lg">Talk to sales</a>
    </div>
  </section>
);

const Footer = () => (
  <section className="footer" id="footer">
    <div className="foot-top">
      <div className="foot-brand">
        <Link to="/" className="brand">
          <BrandMark />
          <div className="brand-name">StockFlow WMS</div>
        </Link>
        <p>Real-time inventory and warehouse management for teams that ship fast.</p>
      </div>
      {FOOTER_COLUMNS.map(([title, links]) => (
        <div className="foot-col" key={title}>
          <h4>{title}</h4>
          {links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </div>
      ))}
    </div>
    <div className="foot-bottom">
      <span>&copy; 2026 StockFlow WMS. All rights reserved.</span>
      <div className="social">
        {SOCIAL.map(([href, d], i) => (
          <a key={i} href={href} target="_blank" rel="noreferrer"><Icon stroke="#4B5563" d={d} /></a>
        ))}
      </div>
    </div>
  </section>
);

export default function Landing() {
  return (
    <div className="sf">
      <style>{STYLES}</style>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonial />
      <CTA />
      <Footer />
    </div>
  );
}