import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "../utils/colors";
import { playPop } from "../utils/audio";
import WinPopup from "../components/WinPopup";

const B_EMOJIS = ["😊","🐸","🌟","🎈","🐣","🦋","🐠","🍭","🌈","🐱","🐶","🦄","🐥","🌸","🍦","🐙"];
const B_COLS   = ["#7ecef4","#f4b8e4","#a8e063","#ffcc00","#f4a26d","#c9b0f0","#ff9999","#aaffcc"];

export default function BubbleGame({ onAddStar, onWin }) {
  const cvs = useRef();
  const S = useRef({ bs: [], score: 0, t: 0, raf: null, won: false });
  const addRef = useRef(onAddStar); addRef.current = onAddStar;
  const [win, setWin] = useState(false);

  const spawn = useCallback(() => {
    const r = 26 + Math.random() * 32;
    S.current.bs.push({
      x: r + Math.random() * (360 - r * 2), y: 430 + r, r,
      col: B_COLS[~~(Math.random() * B_COLS.length)],
      emoji: B_EMOJIS[~~(Math.random() * B_EMOJIS.length)],
      speed: 0.55 + Math.random() * 1.1,
      wobble: Math.random() * Math.PI * 2,
      ws: 0.014 + Math.random() * 0.026,
      wa: 10 + Math.random() * 22,
      alpha: 1, popping: false, ps: 1,
    });
  }, []);

  useEffect(() => {
    const c = cvs.current, ctx = c.getContext("2d"), s = S.current;
    s.bs = []; s.score = 0; s.t = 0; s.won = false;
    for (let i = 0; i < 5; i++) spawn();
    const loop = () => {
      ctx.clearRect(0, 0, 360, 420);
      s.bs.forEach(b => {
        if (!b.popping) { b.y -= b.speed; b.wobble += b.ws; }
        else { b.ps += 0.15; b.alpha -= 0.12; }
        const dx = Math.sin(b.wobble) * b.wa;
        ctx.save();
        ctx.globalAlpha = Math.max(0, b.alpha);
        ctx.translate(b.x + dx, b.y);
        ctx.scale(b.ps, b.ps);
        const g = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.35, b.r * 0.05, -b.r * 0.3, -b.r * 0.35, b.r * 0.85);
        g.addColorStop(0, "rgba(255,255,255,.85)");
        g.addColorStop(0.4, b.col + "cc");
        g.addColorStop(1, b.col + "44");
        ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.font = `${b.r * 0.9}px serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(b.emoji, 0, 2);
        ctx.restore();
      });
      ctx.font = "bold 19px 'Fredoka One',cursive";
      ctx.fillStyle = C.orange; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(`🫧 ${s.score}/25`, 10, 10);
      ctx.fillStyle = "rgba(0,0,0,.08)";
      ctx.beginPath(); ctx.roundRect(10, 36, 340, 10, 5); ctx.fill();
      ctx.fillStyle = C.blue;
      ctx.beginPath(); ctx.roundRect(10, 36, 340 * (s.score / 25), 10, 5); ctx.fill();
      s.bs = s.bs.filter(b => b.y + b.r > -60 && b.alpha > 0);
      s.t++;
      if (s.t > 48 && s.bs.filter(b => !b.popping).length < 10) { spawn(); s.t = 0; }
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.raf);
  }, [spawn]);

  const tap = (px, py) => {
    if (win) return;
    const s = S.current;
    for (let i = s.bs.length - 1; i >= 0; i--) {
      const b = s.bs[i];
      if (b.popping) continue;
      if (Math.hypot(px - (b.x + Math.sin(b.wobble) * b.wa), py - b.y) <= b.r + 12) {
        b.popping = true; playPop(); s.score++;
        addRef.current(1);
        if (s.score >= 25 && !s.won) { s.won = true; setTimeout(() => setWin(true), 400); }
        return;
      }
    }
  };

  const pos = (e, t) => {
    const r = e.target.getBoundingClientRect(), cl = t || e;
    return [(cl.clientX - r.left) * (360 / r.width), (cl.clientY - r.top) * (420 / r.height)];
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <canvas
        ref={cvs} width={360} height={420}
        style={{ width: "100%", maxWidth: 380, borderRadius: 20, cursor: "pointer", touchAction: "none" }}
        onMouseDown={e => { const [x, y] = pos(e); tap(x, y); }}
        onTouchStart={e => { e.preventDefault(); const [x, y] = pos(e, e.touches[0]); tap(x, y); }}
      />
      <WinPopup show={win} emoji="🫧" text="You popped all the bubbles!" onNext={() => { setWin(false); onWin(); }} />
    </div>
  );
}
