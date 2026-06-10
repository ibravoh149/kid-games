import { useState, useEffect, useRef } from "react";
import { C } from "../utils/colors";
import { playPop } from "../utils/audio";
import ProgBar from "../components/ProgBar";
import WinPopup from "../components/WinPopup";

const MOLE_FACES = ["🦔","🐭","🐹","🦫","🐰"];
const DIRTS = ["#8B6914","#7a5c10","#9a7018","#6b4e0e","#a07820","#7c5c12","#8e6416","#6a4c0c","#9c7622"];
const DARKS = ["#5a4008","#4a3808","#6a4808","#3a2808","#705408","#4c3808","#5e3808","#3a2606","#6a4808"];

export default function MoleGame({ onAddStar, onWin }) {
  const holesRef  = useRef(Array(9).fill(false));
  const scoreRef  = useRef(0);
  const alive     = useRef(true);
  const face      = useRef(MOLE_FACES[~~(Math.random() * MOLE_FACES.length)]);
  const [display, setDisplay] = useState(Array(9).fill(false));
  const [score, setScore]     = useState(0);
  const [win, setWin]         = useState(false);

  const setHole = (i, v) => {
    if (!alive.current) return;
    holesRef.current[i] = v;
    setDisplay([...holesRef.current]);
  };

  useEffect(() => {
    alive.current = true;
    holesRef.current = Array(9).fill(false);
    scoreRef.current = 0;
    const timers = [];
    const iv = setInterval(() => {
      if (!alive.current) return;
      const h = ~~(Math.random() * 9);
      if (!holesRef.current[h]) {
        setHole(h, true);
        const dur = Math.max(1350 - scoreRef.current * 22, 480);
        const t = setTimeout(() => setHole(h, false), dur);
        timers.push(t);
        if (scoreRef.current > 8 && Math.random() > 0.6) {
          const h2 = (h + 3 + ~~(Math.random() * 4)) % 9;
          if (!holesRef.current[h2]) {
            setHole(h2, true);
            const t2 = setTimeout(() => setHole(h2, false), dur + 80);
            timers.push(t2);
          }
        }
      }
    }, 620);
    return () => { alive.current = false; clearInterval(iv); timers.forEach(clearTimeout); };
  }, []); // eslint-disable-line

  const whack = i => {
    if (!holesRef.current[i] || win) return;
    setHole(i, false); playPop();
    scoreRef.current++; setScore(scoreRef.current); onAddStar(1);
    if (scoreRef.current >= 20) setWin(true);
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <ProgBar val={score} max={20} col={C.green} />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: C.orange }}>🔨 {score} / 20</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, width: "100%", maxWidth: 310, padding: "0 4px" }}>
        {display.map((up, i) => (
          <div key={i} onClick={() => whack(i)} style={{
            aspectRatio: "1", borderRadius: 18,
            background: DIRTS[i], border: `4px solid ${DARKS[i]}`, boxShadow: `0 5px 0 ${DARKS[i]}`,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            overflow: "hidden", cursor: up ? "pointer" : "default",
            padding: "0 0 2px",
            transform: up ? "scale(1.06)" : "scale(1)", transition: "transform .1s",
          }}>
            <span style={{
              fontSize: "clamp(28px,9vw,44px)", display: "block",
              transform: up ? "translateY(0)" : "translateY(110%)",
              transition: "transform .18s ease-out", lineHeight: 1,
            }}>{face.current}</span>
          </div>
        ))}
      </div>
      <WinPopup show={win} emoji="🔨" text="You whacked 20 moles!" onNext={() => { setWin(false); onWin(); }} />
    </div>
  );
}
