let AC = null;

function getAC() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === "suspended") AC.resume();
  return AC;
}

function tone(f, t = "sine", d = 0.15, v = 0.3, dl = 0) {
  try {
    const ac = getAC(), o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(v, ac.currentTime + dl);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dl + d);
    o.start(ac.currentTime + dl);
    o.stop(ac.currentTime + dl + d + 0.05);
  } catch {}
}

export const playPop   = () => { tone(600, "sine", 0.08, 0.25); tone(900, "sine", 0.1, 0.2, 0.04); };
export const playMatch = () => { tone(440, "sine", 0.1, 0.2); tone(660, "sine", 0.15, 0.25, 0.08); };
export const playWrong = () => tone(200, "sawtooth", 0.15, 0.15);
export const playWin   = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, "sine", 0.2, 0.3, i * 0.1));
export const playCatch = () => { tone(800, "sine", 0.08, 0.2); tone(1000, "sine", 0.1, 0.15, 0.05); };
export const playMiss  = () => tone(180, "sawtooth", 0.12, 0.15);
export const playTick  = () => { tone(523, "sine", 0.1, 0.2); tone(659, "sine", 0.12, 0.2, 0.06); };
