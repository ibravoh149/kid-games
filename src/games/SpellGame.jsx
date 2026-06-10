import { useState, useEffect, useCallback } from "react";
import { C } from "../utils/colors";
import { playTick, playWrong } from "../utils/audio";
import ProgBar from "../components/ProgBar";
import WinPopup from "../components/WinPopup";

const WORDS = [
  { emoji: "🐱", word: "CAT",   hint: "Meow!"      },
  { emoji: "🐶", word: "DOG",   hint: "Woof!"      },
  { emoji: "🌞", word: "SUN",   hint: "So bright!" },
  { emoji: "🐟", word: "FISH",  hint: "Blub blub!" },
  { emoji: "🐸", word: "FROG",  hint: "Ribbit!"    },
  { emoji: "🍎", word: "APPLE", hint: "Yummy!"     },
  { emoji: "🐝", word: "BEE",   hint: "Buzz!"      },
  { emoji: "⭐", word: "STAR",  hint: "Twinkle!"   },
  { emoji: "🐮", word: "COW",   hint: "Moo!"       },
  { emoji: "🦆", word: "DUCK",  hint: "Quack!"     },
  { emoji: "🚗", word: "CAR",   hint: "Vroom!"     },
  { emoji: "🌈", word: "RAIN",  hint: "Pretty!"    },
];

export default function SpellGame({ onAddStar, onWin }) {
  const [idx, setIdx]         = useState(0);
  const [answers, setAnswers] = useState([]);
  const [used, setUsed]       = useState(new Set());
  const [shake, setShake]     = useState(false);
  const [win, setWin]         = useState(false);

  const p = WORDS[idx], word = p.word;

  const mkLetters = useCallback(() => {
    const c = [...word];
    const ex = "BCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(l => !c.includes(l));
    return [...c, ...ex.sort(() => Math.random() - 0.5).slice(0, Math.min(5, word.length))].sort(() => Math.random() - 0.5);
  }, [word]);

  const [letters, setLetters] = useState(mkLetters);

  useEffect(() => { setLetters(mkLetters()); setAnswers([]); setUsed(new Set()); }, [mkLetters]);

  const place = (letter, i) => {
    if (used.has(i) || answers.length >= word.length) return;
    if (word[answers.length] === letter) {
      playTick(); onAddStar(1);
      const na = [...answers, letter], nu = new Set(used); nu.add(i);
      setAnswers(na); setUsed(nu);
      if (na.join("") === word) {
        if (idx + 1 >= WORDS.length) setTimeout(() => setWin(true), 600);
        else setTimeout(() => setIdx(n => n + 1), 700);
      }
    } else {
      playWrong(); setShake(true); setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 8px" }}>
      <ProgBar val={idx} max={WORDS.length} col={C.purple} />
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#aaa" }}>{idx + 1}/{WORDS.length}</div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "14px 22px", border: `4px solid ${C.purple}`, boxShadow: `0 4px 0 #a070d0`, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 52 }}>{p.emoji}</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "#9966cc" }}>{p.hint}</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {word.split("").map((_, i) => (
          <div key={i} style={{
            width: 52, height: 52, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontFamily: "'Fredoka One',cursive",
            background: answers[i] ? "#f0ffe0" : "rgba(255,255,255,.7)",
            border: `4px ${answers[i] ? "solid" : "dashed"} ${answers[i] ? C.green : C.purple}`,
            boxShadow: answers[i] ? `0 3px 0 #78c033` : "none",
            color: "#3a8c3a",
            transform: shake && i === answers.length ? "scale(1.2)" : "scale(1)",
            transition: "all .18s",
          }}>{answers[i] || ""}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
        {letters.map((l, i) => (
          <button key={i} onClick={() => place(l, i)} style={{
            width: 56, height: 56, borderRadius: 12, border: `4px solid ${C.purple}`,
            background: used.has(i) ? "#eee" : "#fff",
            fontSize: 22, fontFamily: "'Fredoka One',cursive",
            color: used.has(i) ? "#bbb" : "#6633cc",
            boxShadow: used.has(i) ? "none" : `0 4px 0 #a070d0`,
            cursor: used.has(i) ? "default" : "pointer",
            opacity: used.has(i) ? 0.35 : 1,
          }}
            onMouseDown={e => { if (!used.has(i)) e.currentTarget.style.transform = "translateY(3px)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "none"}
          >{l}</button>
        ))}
      </div>
      <WinPopup show={win} emoji="🎉" text="You spelled them all!" onNext={() => { setWin(false); setIdx(0); onWin(); }} />
    </div>
  );
}
