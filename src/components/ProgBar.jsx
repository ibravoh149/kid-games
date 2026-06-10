import { C } from "../utils/colors";

export default function ProgBar({ val, max, col = C.blue }) {
  return (
    <div style={{
      width: "100%", maxWidth: 340, height: 13,
      background: "rgba(0,0,0,.08)", borderRadius: 8, overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{
        height: "100%", width: `${Math.min((val / max) * 100, 100)}%`,
        background: col, borderRadius: 8, transition: "width .3s",
      }} />
    </div>
  );
}
