import { useState } from "react";
import { playMatch, playWrong } from "../utils/audio";
import ProgBar from "../components/ProgBar";
import WinPopup from "../components/WinPopup";

const GCOLS = [
  { name: "Red",    col: "#ff4444" },
  { name: "Blue",   col: "#4488ff" },
  { name: "Green",  col: "#44cc44" },
  { name: "Yellow", col: "#ffcc00" },
  { name: "Orange", col: "#ff8833" },
  { name: "Purple", col: "#9944cc" },
  { name: "Pink",   col: "#ff88cc" },
  { name: "Teal",   col: "#22ccaa" },
];

const mkQ = () => {
  const t = GCOLS[~~(Math.random() * GCOLS.length)];
  const opts = [t, ...GCOLS.filter(c => c.name !== t.name).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
  return { t, opts };
};

export default function ColorMatchGame({ onAddStar, onWin }) {
  const [qn, setQn]       = useState(0);
  const [q, setQ]         = useState(mkQ);
  const [flash, setFlash] = useState(null);
  const [win, setWin]     = useState(false);

  const pick = c => {
    if (flash) return;
    if (c.name === q.t.name) {
      playMatch(); onAddStar(1); setFlash("y");
      setTimeout(() => {
        setFlash(null);
        const n = qn + 1;
        if (n >= 15) setWin(true);
        else { setQn(n); setQ(mkQ()); }
      }, 480);
    } else {
      playWrong(); setFlash("n"); setTimeout(() => setFlash(null), 420);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 12px" }}>
      <ProgBar val={qn} max={15} col={q.t.col} />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#555", textAlign: "center" }}>Tap this color! 👇</div>
      <div style={{
        width: 110, height: 110, borderRadius: "50%", background: q.t.col,
        border: "6px solid rgba(255,255,255,.8)", boxShadow: `0 8px 0 ${q.t.col}88`,
        transform: flash === "y" ? "scale(1.18)" : flash === "n" ? "scale(.88)" : "scale(1)",
        transition: "transform .18s",
      }} />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: q.t.col, textShadow: "2px 2px 0 rgba(0,0,0,.1)" }}>{q.t.name}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 290 }}>
        {q.opts.map((c, i) => (
          <button key={`${qn}-${i}`} onClick={() => pick(c)} style={{
            height: 68, borderRadius: 16, background: c.col,
            border: "5px solid rgba(255,255,255,.55)", boxShadow: `0 5px 0 ${c.col}99`,
            cursor: "pointer", transition: "transform .1s",
          }}
            onMouseDown={e => e.currentTarget.style.transform = "translateY(3px)"}
            onMouseUp={e => e.currentTarget.style.transform = "none"}
          />
        ))}
      </div>
      <WinPopup show={win} emoji="🌈" text="You know all the colors!" onNext={() => { setWin(false); setQn(0); setQ(mkQ()); onWin(); }} />
    </div>
  );
}
