import { useState, useCallback } from "react";
import { C } from "./utils/colors";
import BubbleGame     from "./games/BubbleGame";
import MemoryGame     from "./games/MemoryGame";
import CatchGame      from "./games/CatchGame";
import SpellGame      from "./games/SpellGame";
import MoleGame       from "./games/MoleGame";
import CountGame      from "./games/CountGame";
import ColorMatchGame from "./games/ColorMatchGame";
import FreePaintGame  from "./games/FreePaintGame";
import ColorBookGame  from "./games/ColorBookGame";
import MixColorsGame  from "./games/MixColorsGame";
import ABCGame        from "./games/ABCGame";
import ShapeMatchGame from "./games/ShapeMatchGame";

const MENU = [
  { id: "bubbles",    emoji: "🫧", title: "Pop Bubbles!",  col: "#7ecef4", sh: "#4aaad4" },
  { id: "memory",     emoji: "🃏", title: "Memory Match",  col: "#f4a26d", sh: "#d47a3d" },
  { id: "catch",      emoji: "🍎", title: "Catch It!",     col: "#a8e063", sh: "#78c033" },
  { id: "spell",      emoji: "🔤", title: "Spell It!",     col: "#f4b8e4", sh: "#d488c4" },
  { id: "mole",       emoji: "🦔", title: "Whack-a-Mole!", col: "#c9a0f0", sh: "#a070d0" },
  { id: "count",      emoji: "🔢", title: "Count It!",     col: "#ffcc00", sh: "#cc9900" },
  { id: "colormatch", emoji: "🌈", title: "Colors!",       col: "#ff9999", sh: "#cc5555" },
  { id: "paint",      emoji: "🎨", title: "Free Paint!",   col: "#ffb347", sh: "#cc8822" },
  { id: "colorbook",  emoji: "🖼️", title: "Color It!",    col: "#87CEEB", sh: "#4499bb" },
  { id: "mixcolor",   emoji: "🧪", title: "Mix Colors!",   col: "#DDA0DD", sh: "#aa66bb" },
  { id: "abc",        emoji: "🔡", title: "ABC Order!",    col: "#98FB98", sh: "#55aa55" },
  { id: "shapes",     emoji: "🔷", title: "Shapes!",       col: "#FFB6C1", sh: "#cc7788" },
];

const BG = {
  menu:       "linear-gradient(160deg,#fff4e0,#ffe8f5)",
  bubbles:    "linear-gradient(180deg,#e8f4ff,#d0e8ff)",
  memory:     "linear-gradient(180deg,#fff0e8,#ffe0d0)",
  catch:      "linear-gradient(180deg,#e8fff0,#c8f0d8)",
  spell:      "linear-gradient(180deg,#f5e8ff,#e8d0ff)",
  mole:       "linear-gradient(180deg,#f0ffe8,#d8f0c0)",
  count:      "linear-gradient(180deg,#fffbe8,#fff0c0)",
  colormatch: "linear-gradient(180deg,#fff0ff,#ffe0ff)",
  paint:      "linear-gradient(180deg,#fff8e8,#fff0d0)",
  colorbook:  "linear-gradient(180deg,#e8f8ff,#d0ecff)",
  mixcolor:   "linear-gradient(180deg,#f8e8ff,#eeddf5)",
  abc:        "linear-gradient(180deg,#e8ffe8,#d0f0d0)",
  shapes:     "linear-gradient(180deg,#ffe8f8,#ffd0ec)",
};

const GAME_MAP = {
  bubbles:    BubbleGame,
  memory:     MemoryGame,
  catch:      CatchGame,
  spell:      SpellGame,
  mole:       MoleGame,
  count:      CountGame,
  colormatch: ColorMatchGame,
  paint:      FreePaintGame,
  colorbook:  ColorBookGame,
  mixcolor:   MixColorsGame,
  abc:        ABCGame,
  shapes:     ShapeMatchGame,
};

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [stars, setStars]   = useState(0);
  const [key, setKey]       = useState(0);

  const addStar  = useCallback(n => setStars(s => s + n), []);
  const nextGame = useCallback(() => setKey(k => k + 1), []);

  const g = MENU.find(x => x.id === screen);
  const GameComponent = GAME_MAP[screen];

  return (
    <div style={{ width: "100%", height: "100vh", background: BG[screen] || BG.menu, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Fredoka One',cursive", overflow: "hidden", position: "relative" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800;900&display=swap');@keyframes popIn{0%{transform:scale(0) rotate(-10deg)}70%{transform:scale(1.2)}100%{transform:scale(1)}}*{box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent;}button{font-family:'Fredoka One',cursive;}`}</style>

      {screen !== "menu" && (
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", flexShrink: 0 }}>
          <button onClick={() => setScreen("menu")} style={{ background: "#fff", border: `3px solid ${C.yellow}`, borderRadius: 50, padding: "8px 14px", fontSize: 20, color: C.orange, cursor: "pointer", boxShadow: "0 3px 0 #ffaa00" }}>🏠</button>
          <div style={{ fontSize: "clamp(13px,3.5vw,19px)", color: C.orange }}>{g?.emoji} {g?.title}</div>
          <div style={{ background: "#fff", border: `3px solid ${C.yellow}`, borderRadius: 50, padding: "7px 12px", fontSize: 18, color: C.orange, boxShadow: "0 3px 0 #ffaa00" }}>⭐{stars}</div>
        </div>
      )}

      {screen === "menu" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 14px 14px", gap: 8, width: "100%", overflowY: "auto" }}>
          <div style={{ fontSize: "clamp(24px,7vw,46px)", color: C.orange, textShadow: `3px 4px 0 ${C.pink}`, paddingTop: 2, flexShrink: 0 }}>🎮 Fun Games!</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "#c77", flexShrink: 0 }}>Pick a game! ✨</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", maxWidth: 420 }}>
            {MENU.map(g => (
              <button key={g.id}
                onClick={() => { setKey(0); setScreen(g.id); }}
                style={{ background: "#fff", borderRadius: 16, padding: "14px 8px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", border: `4px solid ${g.col}`, boxShadow: `0 5px 0 ${g.sh}` }}
                onMouseDown={e => { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = `0 1px 0 ${g.sh}`; }}
                onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 5px 0 ${g.sh}`; }}
                onTouchStart={e => e.currentTarget.style.transform = "translateY(4px)"}
                onTouchEnd={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 5px 0 ${g.sh}`; setKey(0); setScreen(g.id); }}
              >
                <span style={{ fontSize: 36 }}>{g.emoji}</span>
                <span style={{ fontSize: 13, color: "#444", textAlign: "center", lineHeight: 1.2 }}>{g.title}</span>
              </button>
            ))}
          </div>
          {stars > 0 && <div style={{ fontSize: 20, color: C.orange, paddingBottom: 4 }}>⭐ Stars: {stars}</div>}
        </div>
      )}

      {screen !== "menu" && GameComponent && (
        <div style={{ flex: 1, width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px 12px", overflow: "hidden", position: "relative" }}>
          <GameComponent key={key} onAddStar={addStar} onWin={nextGame} />
        </div>
      )}
    </div>
  );
}
