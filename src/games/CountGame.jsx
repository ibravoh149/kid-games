import { useState, useCallback } from "react";
import { C } from "../utils/colors";
import { playMatch, playWrong } from "../utils/audio";
import ProgBar from "../components/ProgBar";
import WinPopup from "../components/WinPopup";

const CNT_EMOJIS = ["🐱","🌟","🍎","🦋","🎈","🐸","🍭","🐠","🐥","⭐","🌸","🦄"];
const ANS_COLORS = [["#7ecef4","#4aaad4"],["#a8e063","#78c033"],["#f4a26d","#d47a3d"],["#f4b8e4","#d488c4"]];

export default function CountGame({ onAddStar, onWin }) {
  const mkQ = useCallback(n => {
    const mx = Math.min(3 + ~~(n / 3), 9);
    const cnt = 1 + ~~(Math.random() * mx);
    const emo = CNT_EMOJIS[~~(Math.random() * CNT_EMOJIS.length)];
    const ws = new Set();
    while (ws.size < 3) {
      const w = Math.max(1, cnt + (Math.random() > 0.5 ? 1 : -1) * (1 + ~~(Math.random() * 2)));
      if (w !== cnt && w <= 11) ws.add(w);
    }
    return { cnt, emo, opts: [cnt, ...ws].sort(() => Math.random() - 0.5) };
  }, []);

  const [qn, setQn]       = useState(0);
  const [q, setQ]         = useState(() => mkQ(0));
  const [shake, setShake] = useState(null);
  const [flash, setFlash] = useState(false);
  const [win, setWin]     = useState(false);

  const answer = n => {
    if (flash) return;
    if (n === q.cnt) {
      playMatch(); onAddStar(1); setFlash(true);
      setTimeout(() => {
        setFlash(false);
        const nx = qn + 1;
        if (nx >= 15) setWin(true);
        else { setQn(nx); setQ(mkQ(nx)); }
      }, 480);
    } else {
      playWrong(); setShake(n); setTimeout(() => setShake(null), 380);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 12px" }}>
      <ProgBar val={qn} max={15} col={C.yellow} />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#555" }}>How many {q.emo}?</div>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "12px 14px",
        border: `4px solid ${C.blue}`, boxShadow: `0 4px 0 #4aaad4`,
        display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
        maxWidth: 320, minHeight: 70,
        transform: flash ? "scale(1.05)" : "scale(1)", transition: "transform .2s",
      }}>
        {Array.from({ length: q.cnt }).map((_, i) => (
          <span key={i} style={{ fontSize: "clamp(20px,6vw,30px)" }}>{q.emo}</span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 290 }}>
        {q.opts.map((a, i) => (
          <button key={`${qn}-${i}`} onClick={() => answer(a)} style={{
            padding: "14px 0", background: ANS_COLORS[i][0],
            border: `4px solid ${ANS_COLORS[i][1]}`, borderRadius: 16,
            fontSize: 28, color: "#fff", boxShadow: `0 5px 0 ${ANS_COLORS[i][1]}`,
            cursor: "pointer",
            transform: shake === a ? "scale(.88)" : "scale(1)", transition: "transform .15s",
          }}
            onMouseDown={e => e.currentTarget.style.transform = "translateY(3px)"}
            onMouseUp={e => e.currentTarget.style.transform = "none"}
          >{a}</button>
        ))}
      </div>
      <WinPopup show={win} emoji="🔢" text="You counted them all!" onNext={() => { setWin(false); setQn(0); setQ(mkQ(0)); onWin(); }} />
    </div>
  );
}
