import { useState, useEffect, useRef } from "react";
import { playCatch, playMiss } from "../utils/audio";
import WinPopup from "../components/WinPopup";

const FRUITS = ["🍎","🍊","🍋","🍇","🍓","🫐","🍉","🍒","🥝","🍑","🍌","🍍"];

export default function CatchGame({ onAddStar, onWin }) {
  const cvs = useRef();
  const S = useRef({ fs: [], bx: { x: 180, y: 400, w: 92, h: 52 }, score: 0, miss: 0, t: 0, tx: null, raf: null, won: false });
  const addRef = useRef(onAddStar); addRef.current = onAddStar;
  const [win, setWin] = useState(false);
  const [winMsg, setWinMsg] = useState("");

  useEffect(() => {
    const c = cvs.current, ctx = c.getContext("2d"), s = S.current;
    s.fs = []; s.score = 0; s.miss = 0; s.t = 0; s.bx.x = 180; s.won = false;
    const onMv = e => {
      const r = c.getBoundingClientRect();
      s.tx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    };
    c.addEventListener("mousemove", onMv);
    c.addEventListener("touchmove", e => { e.preventDefault(); onMv(e); }, { passive: false });
    const loop = () => {
      ctx.clearRect(0, 0, 360, 440);
      const b = s.bx;
      if (s.tx != null) b.x += (s.tx * (360 / (c.clientWidth || 360)) - b.x) * 0.2;
      b.x = Math.max(b.w / 2, Math.min(360 - b.w / 2, b.x));
      s.t++;
      if (s.t > Math.max(60 - s.score * 1.2, 24)) {
        s.fs.push({ x: 28 + Math.random() * 304, y: -22, speed: 2 + Math.random() * 2.2, emoji: FRUITS[~~(Math.random() * FRUITS.length)], sz: 34 + Math.random() * 14 });
        s.t = 0;
      }
      s.fs.forEach(f => f.y += f.speed);
      s.fs = s.fs.filter(f => {
        if (f.y + f.sz / 2 > b.y - b.h / 2 && f.y - f.sz / 2 < b.y + b.h / 2 && f.x > b.x - b.w / 2 && f.x < b.x + b.w / 2) {
          playCatch(); s.score++; addRef.current(1);
          if (s.score >= 20 && !s.won) { s.won = true; setWinMsg("Amazing catching! 🏆"); setTimeout(() => setWin(true), 300); }
          return false;
        }
        if (f.y > 450) {
          playMiss(); s.miss++;
          if (s.miss >= 5 && !s.won) { s.won = true; setWinMsg(`You caught ${s.score}! Try again!`); setTimeout(() => setWin(true), 300); }
          return false;
        }
        return true;
      });
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      s.fs.forEach(f => { ctx.font = `${f.sz}px serif`; ctx.fillText(f.emoji, f.x, f.y); });
      ctx.fillStyle = "#f4a26d"; ctx.strokeStyle = "#d47a3d"; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(b.x - b.w / 2, b.y - b.h / 2);
      ctx.lineTo(b.x - b.w / 2 + 8, b.y + b.h / 2);
      ctx.lineTo(b.x + b.w / 2 - 8, b.y + b.h / 2);
      ctx.lineTo(b.x + b.w / 2, b.y - b.h / 2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(b.x, b.y - b.h / 2, b.w / 2, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcc88"; ctx.fill(); ctx.stroke();
      ctx.font = "bold 20px 'Fredoka One',cursive";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillStyle = "#3a8c3a"; ctx.fillText(`🍎 ${s.score}/20`, 10, 10);
      ctx.fillStyle = "#cc3344"; ctx.fillText("❤️".repeat(Math.max(0, 5 - s.miss)), 10, 38);
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(s.raf); c.removeEventListener("mousemove", onMv); };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <canvas ref={cvs} width={360} height={440} style={{ width: "100%", maxWidth: 380, borderRadius: 20, touchAction: "none" }} />
      <WinPopup show={win} emoji="🍎" text={winMsg} onNext={() => { setWin(false); onWin(); }} />
    </div>
  );
}
