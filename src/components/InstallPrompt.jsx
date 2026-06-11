import { useState, useEffect } from "react";
import { C } from "../utils/colors";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setVisible(false));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, width: "calc(100% - 32px)", maxWidth: 380,
      background: "#fff", borderRadius: 20,
      border: `4px solid ${C.yellow}`,
      boxShadow: `0 8px 0 ${C.orange}, 0 12px 32px rgba(0,0,0,0.15)`,
      padding: "16px 18px",
      display: "flex", alignItems: "center", gap: 14,
      fontFamily: "'Fredoka One', cursive",
      animation: "slideUp 0.35s cubic-bezier(.34,1.56,.64,1)",
    }}>
      <style>{`@keyframes slideUp{from{transform:translateX(-50%) translateY(120px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>

      <img src="/pwa-192.png" alt="icon" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, color: C.orange, lineHeight: 1.2 }}>Play offline! 🎮</div>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "'Nunito', sans-serif", fontWeight: 700, marginTop: 2 }}>
          Add to home screen for instant access
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        <button onClick={handleInstall} style={{
          background: C.orange, color: "#fff", border: "none",
          borderRadius: 50, padding: "8px 16px", fontSize: 14,
          cursor: "pointer", boxShadow: `0 3px 0 #c04000`,
          fontFamily: "'Fredoka One', cursive",
        }}>
          Install ⭐
        </button>
        <button onClick={() => setVisible(false)} style={{
          background: "transparent", color: "#aaa", border: "none",
          fontSize: 12, cursor: "pointer", padding: "2px 0",
          fontFamily: "'Nunito', sans-serif", fontWeight: 700,
        }}>
          Not now
        </button>
      </div>
    </div>
  );
}
