/* =========================================================
   CORE — geteilte Hilfsfunktionen für alle Module
   ========================================================= */
const Core = (function () {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Zieht `count` einzigartige Elemente aus `pool`, ohne Wiederholung.
  // Wenn der Pool kleiner ist als `count`, wird der ganze (gemischte) Pool zurückgegeben.
  function drawUnique(pool, count) {
    const shuffled = shuffle(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (v !== undefined && v !== null && v !== false) {
          node.setAttribute(k, v);
        }
      });
    }
    children.flat().forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "de-DE";
    utter.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10);
  }

  // Wandelt "HA-ben" in Duden-Stil um: betonte Silbe fett + Punkt darunter.
  function formatStress(syl) {
    if (!syl || !syl.includes("-")) return syl || "";
    const parts = syl.split("-");
    return parts.map((part, i) => {
      const isStressed = part === part.toUpperCase() && /[A-ZÄÖÜ]/.test(part);
      let shown = part.toLowerCase();
      if (i === 0) shown = shown.charAt(0).toUpperCase() + shown.slice(1);
      return isStressed ? `<span class="stress-mark">${shown}</span>` : shown;
    }).join("");
  }

  // ---------- Soundeffekte (synthetisiert, keine Audiodateien nötig) ----------
  let audioCtx = null;
  function getCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function tone(freq, start, duration, type = "sine", volume = 0.15) {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  }

  const sound = {
    correct() { tone(880, 0, 0.12, "sine"); tone(1318, 0.08, 0.18, "sine"); },
    wrong() { tone(180, 0, 0.22, "sawtooth", 0.12); },
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.25, "triangle", 0.14));
    },
    okay() {
      [523, 587].forEach((f, i) => tone(f, i * 0.12, 0.18, "triangle", 0.12));
    },
    fail() {
      // "Sad trombone" — absteigende Töne
      [400, 360, 320, 260].forEach((f, i) => tone(f, i * 0.18, 0.24, "sawtooth", 0.12));
    },
  };

  return { shuffle, drawUnique, el, speak, clamp, uid, formatStress, sound };
})();
