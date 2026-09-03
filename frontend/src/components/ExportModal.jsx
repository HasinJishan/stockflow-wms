import React, { useState, useEffect, useRef } from "react";

const FORMATS = [
  { id: "pdf", name: "PDF", desc: "Formatted document", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" },
  { id: "xlsx", name: "Excel (XLSX)", desc: "Editable spreadsheet", icon: "M3 3h18v18H3zM3 9h18M9 21V9" },
  { id: "csv", name: "CSV", desc: "Raw data only", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6" },
];

const DATE_RANGES = ["Last 30 days", "Last 90 days", "This year", "Custom range"];

const STYLES = `
  .expm * { box-sizing: border-box; }
  .expm-overlay { position: fixed; inset: 0; background: rgba(17,24,39,0.35); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Inter', sans-serif; }
  .expm-modal { width: 480px; max-width: 100%; background: #FFFFFF; border-radius: 16px; box-shadow: 0 20px 60px rgba(17,24,39,0.18); padding: 28px 28px 24px; }
  .expm-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .expm-title { font-size: 18px; font-weight: 700; color: #111827; }
  .expm-sub { font-size: 12.5px; color: #6B7280; margin-top: 3px; }
  .expm-close { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #9CA3AF; background: none; border: none; flex-shrink: 0; }
  .expm-close:hover { background: #F3F2EC; }
  .expm-close svg { width: 16px; height: 16px; }

  .expm-section-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px; margin-top: 18px; }
  .expm-section-label:first-of-type { margin-top: 0; }

  .expm-format-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .expm-format-card { border: 1.5px solid #D1D5DB; border-radius: 10px; padding: 12px 10px; text-align: center; cursor: pointer; background: #FFFFFF; font-family: inherit; }
  .expm-format-card.selected { border-color: #2F6FED; background: #EFF4FF; }
  .expm-format-icon { width: 30px; height: 30px; margin: 0 auto 6px; display: flex; align-items: center; justify-content: center; }
  .expm-format-icon svg { width: 22px; height: 22px; }
  .expm-format-name { font-size: 12.5px; font-weight: 600; color: #111827; }
  .expm-format-desc { font-size: 10.5px; color: #9CA3AF; margin-top: 1px; }

  .expm select { width: 100%; height: 38px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 7px; font-family: inherit; font-size: 13px; }
  .expm select:focus { outline: none; border-color: #2F6FED; }

  .expm-checkbox-row { display: flex; align-items: center; gap: 9px; padding: 7px 0; font-size: 13px; cursor: pointer; }
  .expm-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #D1D5DB; flex-shrink: 0; }
  .expm-checkbox.checked { background: #2F6FED; border-color: #2F6FED; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 10px; }

  .expm-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
  .expm-btn-primary { height: 38px; padding: 0 18px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .expm-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .expm-btn-outline { height: 38px; padding: 0 16px; background: #FFFFFF; color: #111827; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13.5px; font-weight: 500; cursor: pointer; font-family: inherit; }

  .expm-loading-modal { width: 380px; max-width: 100%; background: #FFFFFF; border-radius: 16px; box-shadow: 0 20px 60px rgba(17,24,39,0.18); padding: 36px 32px; text-align: center; }
  .expm-spinner { width: 44px; height: 44px; border: 4px solid #DCE9FD; border-top-color: #2F6FED; border-radius: 50%; margin: 0 auto 20px; animation: expm-spin 0.9s linear infinite; }
  @keyframes expm-spin { to { transform: rotate(360deg); } }
  .expm-loading-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; color: #111827; }
  .expm-loading-sub { font-size: 13px; color: #6B7280; margin-bottom: 20px; }
  .expm-file-chip { display: inline-flex; align-items: center; gap: 8px; background: #F3F2EC; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; color: #4B5563; margin-bottom: 20px; }
  .expm-file-chip svg { width: 15px; height: 15px; stroke: #2F6FED; flex-shrink: 0; }
  .expm-progress-track { width: 100%; height: 6px; background: #F1F0EA; border-radius: 4px; overflow: hidden; margin-bottom: 16px; }
  .expm-progress-fill { height: 100%; background: #2F6FED; border-radius: 4px; transition: width 0.15s linear; }
  .expm-cancel-link { font-size: 12.5px; color: #9CA3AF; cursor: pointer; background: none; border: none; font-family: inherit; }
  .expm-cancel-link:hover { color: #6B7280; text-decoration: underline; }

  .expm-done { color: #1F9D55; }
`;

const FILE_EXT = { pdf: "pdf", xlsx: "xlsx", csv: "csv" };

function Icon({ d, ...p }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d={d} />
    </svg>
  );
}

/**
 * Reusable export modal used by Reports and Analytics pages.
 *
 * Props:
 * - open: bool - whether the modal is shown
 * - onClose: () => void - called when the modal should close
 * - title: string - e.g. "Export report" / "Export analytics"
 * - subtitle: string - defaults to "Choose a format and what to include."
 * - includeItems: string[] - checkbox labels, e.g. ["KPI summary", "Charts & graphs", "Saved reports table"]
 * - filePrefix: string - used to build the fake filename shown while "preparing", e.g. "stockflow-report"
 */
export default function ExportModal({
  open,
  onClose,
  title = "Export",
  subtitle = "Choose a format and what to include.",
  includeItems = ["KPI summary", "Charts & graphs"],
  filePrefix = "stockflow-export",
}) {
  const [format, setFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);
  const [checks, setChecks] = useState(() => Object.fromEntries(includeItems.map((i) => [i, true])));
  const [phase, setPhase] = useState("form"); // 'form' | 'loading' | 'done'
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setProgress(0);
      clearInterval(intervalRef.current);
    }
  }, [open]);

  if (!open) return null;

  const toggleCheck = (item) => setChecks((c) => ({ ...c, [item]: !c[item] }));

  const monthStamp = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).replace(" ", "").toLowerCase();
  const fileName = `${filePrefix}-${monthStamp}.${FILE_EXT[format]}`;

  const startExport = () => {
    setPhase("loading");
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18 + 8;
        if (next >= 100) {
          clearInterval(intervalRef.current);
          setPhase("done");
          // Replace with your real export/download trigger, e.g.:
          // window.location.href = `/api/export?format=${format}&range=${dateRange}`;
          setTimeout(() => onClose(), 900);
          return 100;
        }
        return next;
      });
    }, 220);
  };

  const cancelExport = () => {
    clearInterval(intervalRef.current);
    setPhase("form");
    setProgress(0);
  };

  return (
    <div className="expm-overlay" onMouseDown={(e) => e.target === e.currentTarget && phase === "form" && onClose()}>
      <style>{STYLES}</style>

      {phase === "form" && (
        <div className="expm-modal">
          <div className="expm-head">
            <div>
              <div className="expm-title">{title}</div>
              <div className="expm-sub">{subtitle}</div>
            </div>
            <button className="expm-close" onClick={onClose} aria-label="Close">
              <Icon d="M18 6 6 18M6 6l12 12" />
            </button>
          </div>

          <div className="expm-section-label">File format</div>
          <div className="expm-format-grid">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`expm-format-card${format === f.id ? " selected" : ""}`}
                onClick={() => setFormat(f.id)}
              >
                <div className="expm-format-icon">
                  <Icon d={f.icon} stroke={format === f.id ? "#2F6FED" : "#4B5563"} />
                </div>
                <div className="expm-format-name">{f.name}</div>
                <div className="expm-format-desc">{f.desc}</div>
              </button>
            ))}
          </div>

          <div className="expm-section-label">Date range</div>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            {DATE_RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>

          <div className="expm-section-label">Include in export</div>
          {includeItems.map((item) => (
            <div className="expm-checkbox-row" key={item} onClick={() => toggleCheck(item)}>
              <div className={`expm-checkbox${checks[item] ? " checked" : ""}`}>{checks[item] && "✓"}</div>
              {item}
            </div>
          ))}

          <div className="expm-actions">
            <button className="expm-btn-outline" onClick={onClose}>Cancel</button>
            <button className="expm-btn-primary" onClick={startExport}>
              Export {format.toUpperCase()}
            </button>
          </div>
        </div>
      )}

      {(phase === "loading" || phase === "done") && (
        <div className="expm-loading-modal">
          {phase === "loading" ? (
            <div className="expm-spinner" />
          ) : (
            <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01 9 11.01" width={44} height={44} stroke="#1F9D55" style={{ margin: "0 auto 20px" }} />
          )}
          <div className={`expm-loading-title${phase === "done" ? " expm-done" : ""}`}>
            {phase === "loading" ? "Preparing your export" : "Export ready"}
          </div>
          <div className="expm-loading-sub">
            {phase === "loading" ? "This usually takes a few seconds." : "Your download should start automatically."}
          </div>
          <div className="expm-file-chip">
            <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />
            {fileName}
          </div>
          {phase === "loading" && (
            <>
              <div className="expm-progress-track">
                <div className="expm-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <button className="expm-cancel-link" onClick={cancelExport}>Cancel export</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}