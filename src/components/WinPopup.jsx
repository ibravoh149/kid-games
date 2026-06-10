import { useEffect } from "react";
import { C } from "../utils/colors";
import { playWin } from "../utils/audio";
import Confetti from "./Confetti";

export default function WinPopup({ show, emoji, text, onNext }) {
  useEffect(() => { if (show) playWin(); }, [show]);
  if (!show) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 60,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      background: "rgba(255,255,255,.9)", backdropFilter: "blur(6px)", borderRadius: 20,
    }}>
      <Confetti />
      <div style={{ fontSize: 76, zIndex: 61 }}>{emoji}</div>
      <div style={{
        fontSize: "clamp(20px,5vw,32px)", fontFamily: "'Fredoka One',cursive",
        color: C.orange, textShadow: `2px 3px 0 ${C.pink}`,
        textAlign: "center", padding: "0 20px", zIndex: 61,
      }}>{text}</div>
      <button
        onClick={onNext}
        style={{
          padding: "14px 36px", background: C.yellow, border: "4px solid #ffaa00",
          borderRadius: 60, fontSize: 24, color: "#fff", boxShadow: "0 5px 0 #cc8800",
          cursor: "pointer", zIndex: 61,
        }}
        onMouseDown={e => e.currentTarget.style.transform = "translateY(3px)"}
        onMouseUp={e => e.currentTarget.style.transform = "none"}
      >
        Play Again! 🎮
      </button>
    </div>
  );
}
