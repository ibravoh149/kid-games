import { useState, useEffect, useRef } from "react";
import { C } from "../utils/colors";
import WinPopup from "../components/WinPopup";

const PCOLS = ["#ff4444","#ff8833","#ffdd00","#44cc44","#4488ff","#9944cc","#ff88cc","#8B4513","#222222","#ffffff","#aaffcc","#00ccff"];

export default function FreePaintGame({ onAddStar, onWin }) {
  const cvs = useRef();
  const ds  = useRef({ on: false, lx: 0, ly: 0, col: "#ff4444", sz: 14 });
  const [col, setCol]   = useState("#ff4444");
  const [sz, setSz]     = useState(14);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ctx = cvs.current.getContext("2d");
    ctx.fillStyle = "#fffdf5"; ctx.fillRect(0, 0, 360, 310);
  }, []);

  const gp = (e, t) => {
    const r = e.target.getBoundingClientRect(), c = t || e;
    return [(c.clientX - r.left) * (360 / r.width), (c.clientY - r.top) * (310 / r.height)];
  };
  const sd = (x, y) => {
    const s = ds.current, ctx = cvs.current.getContext("2d");
    s.on = true; s.lx = x; s.ly = y;
    ctx.beginPath(); ctx.arc(x, y, s.sz / 2, 0, Math.PI * 2);
    ctx.fillStyle = s.col; ctx.fill();
  };
  const md = (x, y) => {
    const s = ds.current; if (!s.on) return;
    const ctx = cvs.current.getContext("2d");
    ctx.beginPath(); ctx.moveTo(s.lx, s.ly); ctx.lineTo(x, y);
    ctx.strokeStyle = s.col; ctx.lineWidth = s.sz;
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    s.lx = x; s.ly = y;
  };
  const ed = () => { ds.current.on = false; };
  const clear = () => {
    const ctx = cvs.current.getContext("2d");
    ctx.fillStyle = "#fffdf5"; ctx.fillRect(0, 0, 360, 310);
  };
  const pc = c => { setCol(c); ds.current.col = c; };
  const ps = s => { setSz(s); ds.current.sz = s; };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 6px" }}>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 360 }}>
        {PCOLS.map(c => (
          <div key={c} onClick={() => pc(c)} style={{
            width: 30, height: 30, borderRadius: "50%", background: c,
            border: col === c ? "4px solid #333" : "3px solid rgba(0,0,0,.15)",
            cursor: "pointer", flexShrink: 0,
            boxShadow: col === c ? "inset 0 0 0 3px #fff" : undefined,
            outline: c === "#ffffff" ? "2px solid #ddd" : undefined,
          }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {[8, 14, 22].map(s => (
          <div key={s} onClick={() => ps(s)} style={{
            width: s + 10, height: s + 10, borderRadius: "50%",
            background: sz === s ? "#333" : "#ccc",
            cursor: "pointer", border: sz === s ? "2px solid #000" : "2px solid transparent", flexShrink: 0,
          }} />
        ))}
        <button onClick={clear} style={{ padding: "6px 12px", background: "#ffaaaa", border: "3px solid #cc6666", borderRadius: 20, fontSize: 13, cursor: "pointer", color: "#fff", fontFamily: "'Fredoka One',cursive", marginLeft: 4 }}>🗑️ Clear</button>
        <button onClick={() => { onAddStar(5); setDone(true); }} style={{ padding: "6px 12px", background: C.green, border: `3px solid #78c033`, borderRadius: 20, fontSize: 13, cursor: "pointer", color: "#fff", fontFamily: "'Fredoka One',cursive" }}>🎨 Done!</button>
      </div>
      <canvas ref={cvs} width={360} height={310}
        style={{ width: "100%", maxWidth: 380, borderRadius: 16, border: "3px solid #e0d0c0", touchAction: "none", cursor: "crosshair", flexShrink: 0 }}
        onMouseDown={e => { const [x, y] = gp(e); sd(x, y); }}
        onMouseMove={e => { if (ds.current.on) { const [x, y] = gp(e); md(x, y); } }}
        onMouseUp={ed} onMouseLeave={ed}
        onTouchStart={e => { e.preventDefault(); const [x, y] = gp(e, e.touches[0]); sd(x, y); }}
        onTouchMove={e => { e.preventDefault(); const [x, y] = gp(e, e.touches[0]); md(x, y); }}
        onTouchEnd={ed}
      />
      <WinPopup show={done} emoji="🎨" text="What a beautiful painting!" onNext={() => { setDone(false); clear(); onWin(); }} />
    </div>
  );
}
