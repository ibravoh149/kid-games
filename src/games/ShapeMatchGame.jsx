import { useState } from "react";
import { C } from "../utils/colors";
import { playMatch, playWrong } from "../utils/audio";
import ProgBar from "../components/ProgBar";
import WinPopup from "../components/WinPopup";

const SHAPES = [
  { name: "Circle",   render: (c, s) => <div style={{ width: s, height: s, borderRadius: "50%", background: c }} /> },
  { name: "Square",   render: (c, s) => <div style={{ width: s, height: s, background: c, borderRadius: 6 }} /> },
  { name: "Triangle", render: (c, s) => <div style={{ width: 0, height: 0, borderLeft: `${s / 2}px solid transparent`, borderRight: `${s / 2}px solid transparent`, borderBottom: `${s}px solid ${c}` }} /> },
  { name: "Star",     render: (c, s) => <div style={{ fontSize: s, lineHeight: 1, color: c }}>★</div> },
  { name: "Heart",    render: (_, s) => <div style={{ fontSize: s, lineHeight: 1 }}>❤️</div> },
  { name: "Diamond",  render: (c, s) => <div style={{ width: s * 0.7, height: s * 0.7, background: c, transform: "rotate(45deg)", borderRadius: 4 }} /> },
];

const SHAPE_COLS = ["#ff4444","#4488ff","#44cc44","#ff8833","#9944cc","#ff88cc"];
const OPT_COLS  = [["#7ecef4","#4aaad4"],["#a8e063","#78c033"],["#f4a26d","#d47a3d"],["#f4b8e4","#d488c4"]];

const mkQ = () => {
  const t = SHAPES[~~(Math.random() * SHAPES.length)];
  const wrs = SHAPES.filter(s => s.name !== t.name).sort(() => Math.random() - 0.5).slice(0, 3);
  const opts = [t, ...wrs].sort(() => Math.random() - 0.5);
  const col = SHAPE_COLS[~~(Math.random() * SHAPE_COLS.length)];
  return { t, opts, col };
};

export default function ShapeMatchGame({ onAddStar, onWin }) {
  const [qn, setQn]       = useState(0);
  const [q, setQ]         = useState(mkQ);
  const [flash, setFlash] = useState(null);
  const [win, setWin]     = useState(false);

  const pick = s => {
    if (flash) return;
    if (s.name === q.t.name) {
      playMatch(); onAddStar(1); setFlash("y");
      setTimeout(() => {
        setFlash(null);
        const n = qn + 1;
        if (n >= 15) setWin(true);
        else { setQn(n); setQ(mkQ()); }
      }, 500);
    } else {
      playWrong(); setFlash("n"); setTimeout(() => setFlash(null), 420);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 12px" }}>
      <ProgBar val={qn} max={15} col={C.peach} />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#555", textAlign: "center" }}>Find this shape! 👇</div>
      <div style={{
        width: 130, height: 130, borderRadius: 20, background: "#fff",
        border: `4px solid ${q.col}`, boxShadow: `0 6px 0 ${q.col}88`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: flash === "y" ? "scale(1.1)" : flash === "n" ? "scale(.9)" : "scale(1)",
        transition: "transform .18s",
      }}>{q.t.render(q.col, 80)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 290 }}>
        {q.opts.map((s, i) => (
          <button key={`${qn}-${i}`} onClick={() => pick(s)} style={{
            height: 90, borderRadius: 16,
            background: OPT_COLS[i][0], border: `4px solid ${OPT_COLS[i][1]}`,
            boxShadow: `0 5px 0 ${OPT_COLS[i][1]}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform .1s",
          }}
            onMouseDown={e => e.currentTarget.style.transform = "translateY(3px)"}
            onMouseUp={e => e.currentTarget.style.transform = "none"}
          >{s.render("#fff", 52)}</button>
        ))}
      </div>
      <WinPopup show={win} emoji="🔷" text="You matched all the shapes!" onNext={() => { setWin(false); setQn(0); setQ(mkQ()); onWin(); }} />
    </div>
  );
}
