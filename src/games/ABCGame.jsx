import { useState, useEffect } from "react";
import { C } from "../utils/colors";
import { playTick, playWrong } from "../utils/audio";
import ProgBar from "../components/ProgBar";
import WinPopup from "../components/WinPopup";

const ABC_GROUPS = [["A","B","C","D"],["E","F","G","H"],["I","J","K","L"],["M","N","O","P"],["Q","R","S","T"],["U","V","W","X"],["Y","Z"]];

function makePts(n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    let x, y, ok, att = 0;
    do {
      x = 20 + Math.random() * 240;
      y = 20 + Math.random() * 170;
      ok = pts.every(p => Math.hypot(p.x - x, p.y - y) > 75);
      att++;
    } while (!ok && att < 60);
    pts.push({ x, y });
  }
  return pts;
}

export default function ABCGame({ onAddStar, onWin }) {
  const [gi, setGi]       = useState(0);
  const [next, setNext]   = useState(0);
  const [tapped, setTapped] = useState(new Set());
  const [pts, setPts]     = useState(() => makePts(4));
  const [shake, setShake] = useState(null);
  const [win, setWin]     = useState(false);
  const grp = ABC_GROUPS[gi];

  useEffect(() => { setPts(makePts(grp.length)); setNext(0); setTapped(new Set()); }, [gi, grp.length]);

  const tap = i => {
    if (tapped.has(i)) return;
    if (i === next) {
      playTick(); onAddStar(1);
      const nt = new Set(tapped); nt.add(i); setTapped(nt);
      const nn = next + 1;
      if (nn >= grp.length) {
        const ng = gi + 1;
        if (ng >= ABC_GROUPS.length) setTimeout(() => setWin(true), 600);
        else setTimeout(() => setGi(ng), 700);
      } else setNext(nn);
    } else {
      playWrong(); setShake(i); setTimeout(() => setShake(null), 400);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <ProgBar val={gi} max={ABC_GROUPS.length} col={C.blue} />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: C.orange }}>
        Tap: <span style={{ fontSize: 32, color: C.blue }}>{grp[next]}</span> 👆
      </div>
      <div style={{ position: "relative", width: "100%", maxWidth: 320, height: 240, background: "rgba(255,255,255,.6)", borderRadius: 20, border: `3px solid ${C.blue}`, overflow: "hidden" }}>
        {grp.map((letter, i) => (
          <div key={i} onClick={() => tap(i)} style={{
            position: "absolute", left: pts[i]?.x || 0, top: pts[i]?.y || 0,
            width: 68, height: 68, borderRadius: 16,
            background: tapped.has(i) ? C.green : "#fff",
            border: `4px solid ${tapped.has(i) ? "#78c033" : C.blue}`,
            boxShadow: `0 4px 0 ${tapped.has(i) ? "#78c033" : "#4aaad4"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, fontFamily: "'Fredoka One',cursive",
            color: tapped.has(i) ? "#fff" : "#4488ff",
            cursor: "pointer",
            transform: shake === i ? "scale(.85)" : tapped.has(i) ? "scale(.95)" : "scale(1)",
            transition: "all .18s",
          }}>{letter}</div>
        ))}
      </div>
      <WinPopup show={win} emoji="🎉" text="You know the alphabet!" onNext={() => { setWin(false); setGi(0); onWin(); }} />
    </div>
  );
}
