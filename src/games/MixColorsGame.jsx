import { useState, useCallback } from "react";
import { playMatch, playWrong } from "../utils/audio";
import ProgBar from "../components/ProgBar";
import WinPopup from "../components/WinPopup";

const MIXES = [
  { c1: "#FF0000", n1: "Red",    c2: "#FFFF00", n2: "Yellow", r: "#FF8C00", rn: "Orange"     },
  { c1: "#FF0000", n1: "Red",    c2: "#0000FF", n2: "Blue",   r: "#800080", rn: "Purple"     },
  { c1: "#FFFF00", n1: "Yellow", c2: "#0000FF", n2: "Blue",   r: "#228B22", rn: "Green"      },
  { c1: "#FF0000", n1: "Red",    c2: "#FFFFFF", n2: "White",  r: "#FFB6C1", rn: "Pink"       },
  { c1: "#0000FF", n1: "Blue",   c2: "#FFFFFF", n2: "White",  r: "#ADD8E6", rn: "Sky Blue"   },
  { c1: "#000000", n1: "Black",  c2: "#FFFFFF", n2: "White",  r: "#808080", rn: "Gray"       },
  { c1: "#FF8C00", n1: "Orange", c2: "#FF0000", n2: "Red",    r: "#FF4500", rn: "Red-Orange" },
  { c1: "#228B22", n1: "Green",  c2: "#FFFF00", n2: "Yellow", r: "#9ACD32", rn: "Lime"       },
  { c1: "#800080", n1: "Purple", c2: "#FFFFFF", n2: "White",  r: "#DDA0DD", rn: "Lavender"   },
  { c1: "#0000FF", n1: "Blue",   c2: "#228B22", n2: "Green",  r: "#008080", rn: "Teal"       },
  { c1: "#FF0000", n1: "Red",    c2: "#000000", n2: "Black",  r: "#8B0000", rn: "Dark Red"   },
  { c1: "#FFFF00", n1: "Yellow", c2: "#FFFFFF", n2: "White",  r: "#FFFACD", rn: "Cream"      },
];

export default function MixColorsGame({ onAddStar, onWin }) {
  const mkQ = useCallback(() => {
    const q = MIXES[~~(Math.random() * MIXES.length)];
    const wrs = MIXES.filter(m => m.rn !== q.rn).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [{ r: q.r, rn: q.rn }, ...wrs.map(m => ({ r: m.r, rn: m.rn }))].sort(() => Math.random() - 0.5);
    return { ...q, opts };
  }, []);

  const [qn, setQn]       = useState(0);
  const [q, setQ]         = useState(mkQ);
  const [flash, setFlash] = useState(null);
  const [win, setWin]     = useState(false);

  const pick = opt => {
    if (flash) return;
    if (opt.rn === q.rn) {
      playMatch(); onAddStar(1); setFlash("y");
      setTimeout(() => {
        setFlash(null);
        const n = qn + 1;
        if (n >= 12) setWin(true);
        else { setQn(n); setQ(mkQ()); }
      }, 500);
    } else {
      playWrong(); setFlash("n"); setTimeout(() => setFlash(null), 400);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 12px" }}>
      <ProgBar val={qn} max={12} col="#ff8833" />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#555", textAlign: "center" }}>What color do these make? 🤔</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: q.c1, border: "4px solid rgba(0,0,0,.12)", margin: "0 auto" }} />
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 14, color: "#666", marginTop: 4 }}>{q.n1}</div>
        </div>
        <div style={{ fontSize: 30, color: "#aaa", fontWeight: "bold" }}>+</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: q.c2, border: "4px solid rgba(0,0,0,.12)", margin: "0 auto" }} />
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 14, color: "#666", marginTop: 4 }}>{q.n2}</div>
        </div>
        <div style={{ fontSize: 26, color: "#aaa", fontWeight: "bold" }}>=</div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "#f0f0f0",
            border: "3px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto",
            transform: flash === "y" ? "scale(1.15)" : flash === "n" ? "scale(.9)" : "scale(1)",
            transition: "transform .2s",
          }}>?</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 300 }}>
        {q.opts.map((opt, i) => (
          <button key={`${qn}-${i}`} onClick={() => pick(opt)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            padding: "12px 8px", background: "#fff",
            border: `4px solid ${opt.r}55`, borderRadius: 16, boxShadow: `0 4px 0 ${opt.r}66`, cursor: "pointer",
          }}
            onMouseDown={e => e.currentTarget.style.transform = "translateY(3px)"}
            onMouseUp={e => e.currentTarget.style.transform = "none"}
          >
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: opt.r, border: "2px solid rgba(0,0,0,.1)" }} />
            <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 13, color: "#555", textAlign: "center" }}>{opt.rn}</span>
          </button>
        ))}
      </div>
      <WinPopup show={win} emoji="🌈" text="Amazing color mixing!" onNext={() => { setWin(false); setQn(0); setQ(mkQ()); onWin(); }} />
    </div>
  );
}
