import { useEffect, useRef } from "react";
import { C } from "../utils/colors";

export default function Confetti() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    c.width = c.offsetWidth || 400;
    c.height = c.offsetHeight || 500;
    let ps = Array.from({ length: 100 }, () => ({
      x: Math.random() * c.width, y: -20 - Math.random() * 150,
      sz: 8 + Math.random() * 12,
      col: [C.orange, C.yellow, C.blue, C.green, C.pink, C.peach][~~(Math.random() * 6)],
      vx: (Math.random() - 0.5) * 4, vy: 3 + Math.random() * 4,
      rot: Math.random() * 360, rv: (Math.random() - 0.5) * 8,
      sh: Math.random() > 0.5 ? "r" : "c",
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ps = ps.filter(p => p.y < c.height + 30);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rv;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.col;
        if (p.sh === "r") ctx.fillRect(-p.sz / 2, -p.sz / 4, p.sz, p.sz / 2);
        else { ctx.beginPath(); ctx.arc(0, 0, p.sz / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      if (ps.length) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 }}
    />
  );
}
