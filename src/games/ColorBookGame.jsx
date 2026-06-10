import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "../utils/colors";
import { playTick } from "../utils/audio";
import WinPopup from "../components/WinPopup";

const BOOK_SCENES = [
  { name: "Sunny Day ☀️", regions: [
    { id: "sky",  draw: ctx => { ctx.rect(0, 0, 360, 380); } },
    { id: "gnd",  draw: ctx => { ctx.rect(0, 265, 360, 115); } },
    { id: "tkA",  draw: ctx => { ctx.rect(42, 210, 32, 58); } },
    { id: "trA",  draw: ctx => { ctx.arc(58, 172, 50, 0, Math.PI * 2); } },
    { id: "hse",  draw: ctx => { ctx.rect(132, 158, 140, 112); } },
    { id: "rof",  draw: ctx => { ctx.moveTo(108, 160); ctx.lineTo(202, 84); ctx.lineTo(296, 160); ctx.closePath(); } },
    { id: "win",  draw: ctx => { ctx.rect(145, 176, 40, 36); } },
    { id: "win2", draw: ctx => { ctx.rect(218, 176, 40, 36); } },
    { id: "dor",  draw: ctx => { ctx.rect(181, 218, 42, 52); } },
    { id: "tkB",  draw: ctx => { ctx.rect(278, 214, 32, 54); } },
    { id: "trB",  draw: ctx => { ctx.arc(294, 172, 46, 0, Math.PI * 2); } },
    { id: "sun",  draw: ctx => { ctx.arc(55, 58, 36, 0, Math.PI * 2); } },
    { id: "cld",  draw: ctx => { ctx.ellipse(220, 52, 62, 26, 0, 0, Math.PI * 2); } },
  ]},
  { name: "Under the Sea 🐠", regions: [
    { id: "sea",  draw: ctx => { ctx.rect(0, 0, 360, 380); } },
    { id: "snd",  draw: ctx => { ctx.rect(0, 298, 360, 82); } },
    { id: "cf1",  draw: ctx => { ctx.ellipse(58, 258, 24, 48, 0, 0, Math.PI * 2); } },
    { id: "cf2",  draw: ctx => { ctx.ellipse(302, 252, 20, 44, 0, 0, Math.PI * 2); } },
    { id: "sw1",  draw: ctx => { ctx.ellipse(130, 278, 12, 36, 0.3, 0, Math.PI * 2); } },
    { id: "f1b",  draw: ctx => { ctx.ellipse(195, 148, 68, 38, 0, 0, Math.PI * 2); } },
    { id: "f1t",  draw: ctx => { ctx.moveTo(262, 148); ctx.lineTo(302, 118); ctx.lineTo(302, 178); ctx.closePath(); } },
    { id: "f2b",  draw: ctx => { ctx.ellipse(98, 238, 42, 24, 0.3, 0, Math.PI * 2); } },
    { id: "str",  draw: ctx => { ctx.arc(285, 298, 26, 0, Math.PI * 2); } },
    { id: "bb1",  draw: ctx => { ctx.arc(178, 68, 16, 0, Math.PI * 2); } },
    { id: "bb2",  draw: ctx => { ctx.arc(205, 34, 11, 0, Math.PI * 2); } },
    { id: "bb3",  draw: ctx => { ctx.arc(155, 48, 13, 0, Math.PI * 2); } },
  ]},
  { name: "Garden 🌸", regions: [
    { id: "sky",  draw: ctx => { ctx.rect(0, 0, 360, 380); } },
    { id: "gnd",  draw: ctx => { ctx.rect(0, 258, 360, 122); } },
    { id: "st1",  draw: ctx => { ctx.rect(74, 182, 12, 80); } },
    { id: "st2",  draw: ctx => { ctx.rect(174, 172, 12, 90); } },
    { id: "st3",  draw: ctx => { ctx.rect(274, 186, 12, 76); } },
    { id: "fc1",  draw: ctx => { ctx.arc(80, 152, 36, 0, Math.PI * 2); } },
    { id: "fc2",  draw: ctx => { ctx.arc(180, 142, 40, 0, Math.PI * 2); } },
    { id: "fc3",  draw: ctx => { ctx.arc(280, 156, 34, 0, Math.PI * 2); } },
    { id: "fy1",  draw: ctx => { ctx.arc(80, 152, 14, 0, Math.PI * 2); } },
    { id: "fy2",  draw: ctx => { ctx.arc(180, 142, 16, 0, Math.PI * 2); } },
    { id: "fy3",  draw: ctx => { ctx.arc(280, 156, 13, 0, Math.PI * 2); } },
    { id: "sun",  draw: ctx => { ctx.arc(310, 52, 36, 0, Math.PI * 2); } },
    { id: "bfly", draw: ctx => { ctx.ellipse(142, 92, 34, 20, 0.5, 0, Math.PI * 2); } },
  ]},
];

const BOOK_PAL = ["#FF4444","#FF8833","#FFD700","#90EE90","#4488FF","#9944CC","#FF69B4","#FFFFFF","#8B4513","#ADD8E6","#228B22","#FF6B6B","#FFA07A","#20B2AA","#808080"];

export default function ColorBookGame({ onAddStar, onWin }) {
  const cvs = useRef();
  const [si, setSi]       = useState(0);
  const [fills, setFills] = useState({});
  const [sel, setSel]     = useState("#FF69B4");
  const [win, setWin]     = useState(false);
  const scene = BOOK_SCENES[si];
  const colored = Object.keys(fills).length;
  const total = scene.regions.length;

  const goNext = useCallback(() => {
    onAddStar(3);
    const ns = si + 1;
    if (ns >= BOOK_SCENES.length) setWin(true);
    else { setSi(ns); setFills({}); }
  }, [si, onAddStar]);

  useEffect(() => { setFills({}); }, [si]);

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 360, 380);
    scene.regions.forEach(r => {
      ctx.beginPath(); r.draw(ctx);
      ctx.fillStyle = fills[r.id] || "#f8f8f8"; ctx.fill();
      ctx.strokeStyle = "#aaa"; ctx.lineWidth = 2; ctx.stroke();
    });
  }, [fills, si, scene]);

  const tap = (px, py) => {
    const c = cvs.current, ctx = c.getContext("2d");
    for (let i = scene.regions.length - 1; i >= 0; i--) {
      const r = scene.regions[i]; ctx.beginPath(); r.draw(ctx);
      if (ctx.isPointInPath(px, py)) { playTick(); setFills(prev => ({ ...prev, [r.id]: sel })); return; }
    }
  };
  const gp = (e, t) => {
    const r = e.target.getBoundingClientRect(), cl = t || e;
    return [(cl.clientX - r.left) * (360 / r.width), (cl.clientY - r.top) * (380 / r.height)];
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "0 6px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", justifyContent: "space-between", maxWidth: 380, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {BOOK_SCENES.map((_, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: i <= si ? C.orange : "#ddd" }} />)}
          <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 13, color: C.orange }}>{scene.name}</span>
        </div>
        <button onClick={goNext} style={{ padding: "6px 14px", background: C.yellow, border: `3px solid #ffaa00`, borderRadius: 30, fontFamily: "'Fredoka One',cursive", fontSize: 14, color: "#fff", boxShadow: "0 3px 0 #cc8800", cursor: "pointer", flexShrink: 0 }}>
          Next ➡️
        </button>
      </div>
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 13, color: "#aaa", flexShrink: 0 }}>
        {colored}/{total} colored {colored === total ? "✅" : "🖌️"}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", flexShrink: 0 }}>
        {BOOK_PAL.map(c => (
          <div key={c} onClick={() => setSel(c)} style={{
            width: 28, height: 28, borderRadius: "50%", background: c,
            border: sel === c ? "4px solid #333" : "2px solid rgba(0,0,0,.15)",
            cursor: "pointer", flexShrink: 0,
            boxShadow: sel === c ? "inset 0 0 0 3px #fff" : undefined,
            outline: c === "#FFFFFF" ? "2px solid #ddd" : undefined,
          }} />
        ))}
      </div>
      <canvas ref={cvs} width={360} height={380}
        style={{ width: "100%", maxWidth: 380, borderRadius: 16, border: "3px solid #e0d0c0", cursor: "crosshair", touchAction: "none", flexShrink: 0 }}
        onMouseDown={e => { const [x, y] = gp(e); tap(x, y); }}
        onTouchStart={e => { e.preventDefault(); const [x, y] = gp(e, e.touches[0]); tap(x, y); }}
      />
      <WinPopup show={win} emoji="🖼️" text="You colored all the scenes!" onNext={() => { setWin(false); setSi(0); setFills({}); onWin(); }} />
    </div>
  );
}
