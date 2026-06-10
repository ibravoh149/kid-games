import { useState, useEffect, useCallback } from "react";
import { C } from "../utils/colors";
import { playPop, playMatch, playWrong } from "../utils/audio";
import WinPopup from "../components/WinPopup";

const MEM_ROUNDS = [
  ["🐱","🐶","🐸","🦋","🌟","🎈"],
  ["🍭","🐠","🦄","🐣","🌈","🍎"],
  ["🐥","🌸","🦊","🐨","🦁","🐧"],
];

export default function MemoryGame({ onAddStar, onWin }) {
  const [round, setRound]     = useState(0);
  const [cards, setCards]     = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [locked, setLocked]   = useState(false);
  const [win, setWin]         = useState(false);

  const initRound = useCallback(r => {
    const pairs = [...MEM_ROUNDS[r], ...MEM_ROUNDS[r]]
      .sort(() => Math.random() - 0.5)
      .map((e, i) => ({ id: i, emoji: e }));
    setCards(pairs); setFlipped([]); setMatched(new Set()); setLocked(false);
  }, []);

  useEffect(() => { initRound(0); }, [initRound]);

  const flip = card => {
    if (locked || flipped.some(c => c.id === card.id) || matched.has(card.id)) return;
    const nf = [...flipped, card];
    setFlipped(nf); playPop();
    if (nf.length === 2) {
      setLocked(true);
      setTimeout(() => {
        if (nf[0].emoji === nf[1].emoji) {
          const nm = new Set(matched); nm.add(nf[0].id); nm.add(nf[1].id);
          setMatched(nm); playMatch(); onAddStar(2);
          if (nm.size === cards.length) {
            const nr = round + 1;
            if (nr >= 3) setTimeout(() => setWin(true), 400);
            else setTimeout(() => { setRound(nr); initRound(nr); }, 700);
          }
        } else playWrong();
        setFlipped([]); setLocked(false);
      }, 750);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i <= round ? C.orange : "#ddd", border: `2px solid ${i <= round ? "#cc5500" : "#bbb"}` }} />
        ))}
        <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: C.orange }}>Round {round + 1}/3</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, width: "100%", maxWidth: 320 }}>
        {cards.map(card => (
          <div key={card.id} onClick={() => flip(card)} style={{
            aspectRatio: "1", borderRadius: 13,
            background: flipped.some(c => c.id === card.id) || matched.has(card.id) ? "#fff" : "#ff9f6b",
            border: `4px solid ${matched.has(card.id) ? "#a8e063" : flipped.some(c => c.id === card.id) ? "#ffd0b0" : "#ff7040"}`,
            boxShadow: `0 4px 0 ${matched.has(card.id) ? "#78c033" : "#c04020"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "clamp(20px,6vw,32px)", cursor: "pointer",
          }}>
            {(flipped.some(c => c.id === card.id) || matched.has(card.id)) ? card.emoji : ""}
          </div>
        ))}
      </div>
      <WinPopup show={win} emoji="🃏" text="You matched all 3 rounds!" onNext={() => { setWin(false); setRound(0); initRound(0); onWin(); }} />
    </div>
  );
}
