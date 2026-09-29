/* =====================================================================
   LEICHTE STADT — TÖNE (Dampflok: Schnaufen, Pfiff, Bremsen, Zischen)
   ---------------------------------------------------------------------
   FASSUNG 818 — XANDER (wörtlich): „unsere Lokomotive hat noch keinen
   Klang".

   Alles wird mit Web Audio erzeugt (keine Dateien, nichts zu laden):
     schnauf(laut, pan, kraft)  ein Dampfstoß aus dem Schlot: gefiltertes
                                Rauschen mit weichem Abklingen und einem
                                dumpfen Stoß darunter (kraft 0…1: beim
                                Anfahren schwer und langsam, in Fahrt leicht)
     pfiff(laut, pan, art)      die Dampfpfeife: ein Akkord aus drei Tönen
                                mit Hauch („ein" = ein langer Pfiff bei der
                                Einfahrt, „ab" = kurz–lang vor der Abfahrt)
     bremse(laut, pan, dauer)   das Quietschen der Bremsklötze am Halt
     zisch(laut, pan)           Dampf ablassen im Stand
     klack(laut, pan)           Schienenstoß (zwei Schläge, Drehgestell)
   Die Lautstärke rechnet bahn.js nach Nähe und Zoom aus, dazu kommt hier
   die Lautstärkestufe des Spiels (dma_spiel_laut: aus/leise/mittel/laut).

   WANN ES KLINGEN DARF: nur wenn die Seite sichtbar ist, der Browser den
   Ton freigegeben hat (erste Berührung auf der Seite weckt die Tonanlage)
   und die Töne nicht ausgeschaltet sind – im eingebetteten Rahmen des
   Spiels nur, wenn das Spiel selbst Töne an hat (DMA_SPIEL_BRUECKE.
   toeneAn() und die Lautstärkestufe des Spiels), sonst nach denselben
   Einstellungen (dma_livechat_toene, dma_spiel_laut). ?ton=0 schaltet
   stumm, ?ton=1 erlaubt ohne Einstellungen (Prüfbilder, Sonden).
   ST.ton.log zählt, was gespielt wurde (für die Sonde 818).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT = window.STADT || {};
  const q = (function () { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(""); } })();
  const ZWANG = q.get("ton");
  const STUFEN = [0, 0.45, 0.75, 1];
  const T = (ST.ton = { log: [], ctx: null, gespielt: 0 });
  let master = null, rausch = null;

  function eingebettet() { try { return window.parent && window.parent !== window; } catch (e) { return true; } }
  /* Lautstärkestufe des Spiels (0 = aus) */
  function stufe() {
    try { const v = localStorage.getItem("dma_spiel_laut"); return v == null ? 2 : Math.max(0, Math.min(3, Number(v) || 0)); } catch (e) { return 2; }
  }
  /* Darf die Seite klingen? */
  T.darf = function () {
    if (ZWANG === "0") return false;
    if (document.hidden) return false;
    if (ZWANG === "1") return true;
    if (eingebettet()) {
      /* im Rahmen des Spiels: nur wenn das Spiel Töne an hat */
      try {
        const b = window.parent.DMA_SPIEL_BRUECKE;
        if (b && b.toeneAn && b.toeneAn() === false) return false;
      } catch (e) { return false; }
    }
    try { if (localStorage.getItem("dma_livechat_toene") === "aus") return false; } catch (e) {}
    return stufe() > 0;
  };
  T.faktor = function () { return ZWANG === "1" ? 1 : STUFEN[stufe()]; };

  /* Tonanlage erst nach einer Berührung (Browser-Regel) */
  function anlage() {
    if (T.ctx) return T.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { T.ctx = new AC({ latencyHint: "interactive" }); } catch (e) { try { T.ctx = new AC(); } catch (x) { return null; } }
    try {
      const k = T.ctx, komp = k.createDynamicsCompressor();
      komp.threshold.value = -22; komp.knee.value = 16; komp.ratio.value = 5; komp.attack.value = 0.004; komp.release.value = 0.25;
      master = k.createGain(); master.gain.value = 0.5;
      master.connect(komp); komp.connect(k.destination);
      /* zwei Sekunden Rauschen, einmal gebaut */
      rausch = k.createBuffer(1, k.sampleRate * 2, k.sampleRate);
      const d = rausch.getChannelData(0);
      let b = 0;
      for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = 0.97 * b + 0.03 * w; d[i] = w * 0.7 + b * 2.2; }
    } catch (e) { master = null; }
    return T.ctx;
  }
  function wecken() {
    if (!T.darf()) return;
    const k = anlage();
    if (k && k.state !== "running") { try { const v = k.resume(); if (v && v.catch) v.catch(() => {}); } catch (e) {} }
  }
  ["pointerdown", "touchend", "click", "keydown"].forEach((a) => { try { document.addEventListener(a, wecken, { capture: true, passive: true }); } catch (e) {} });
  /* bereit zum Spielen? (Einstellung, Anlage läuft) */
  function bereit() {
    if (!T.darf()) return null;
    const k = anlage();
    if (!k || !master) return null;
    if (k.state !== "running") { try { const v = k.resume(); if (v && v.catch) v.catch(() => {}); } catch (e) {} if (k.state !== "running") return null; }
    return k;
  }
  function ausgang(k, pan) {
    let ziel = master;
    try { if (k.createStereoPanner) { const p = k.createStereoPanner(); p.pan.value = Math.max(-0.9, Math.min(0.9, pan || 0)); p.connect(master); ziel = p; } } catch (e) {}
    return ziel;
  }
  function merk(name, laut) {
    T.gespielt++;
    T.log.push({ name: name, laut: Math.round(laut * 1000) / 1000, t: Math.round(performance.now()) });
    if (T.log.length > 400) T.log.splice(0, 100);
  }
  function rauschQuelle(k, ab) {
    const s = k.createBufferSource(); s.buffer = rausch; s.loop = true;
    try { s.start(ab, Math.random() * 1.5); } catch (e) { s.start(ab); }
    return s;
  }

  /* ---------------- Die Klänge ---------------- */
  T.schnauf = function (laut, pan, kraft) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const t = k.currentTime + 0.005, kr = Math.max(0, Math.min(1, kraft || 0));
    const dauer = 0.12 + kr * 0.28;
    const n = rauschQuelle(k, t), bp = k.createBiquadFilter(), lp = k.createBiquadFilter(), g = k.createGain();
    bp.type = "bandpass"; bp.frequency.value = 560 + (1 - kr) * 380 + Math.random() * 90; bp.Q.value = 0.8;
    lp.type = "lowpass"; lp.frequency.value = 2400;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * (0.55 + kr * 0.45), t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    n.connect(bp); bp.connect(lp); lp.connect(g); g.connect(ausgang(k, pan));
    n.stop(t + dauer + 0.05);
    /* der dumpfe Stoß darunter */
    const o = k.createOscillator(), go = k.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(95 + kr * 20, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.1 + kr * 0.1);
    go.gain.setValueAtTime(0.0001, t); go.gain.exponentialRampToValueAtTime(v * 0.35 * (0.4 + kr), t + 0.01); go.gain.exponentialRampToValueAtTime(0.0001, t + 0.14 + kr * 0.12);
    o.connect(go); go.connect(ausgang(k, pan)); o.start(t); o.stop(t + 0.3 + kr * 0.15);
    merk("schnauf", v);
    return true;
  };
  T.pfiff = function (laut, pan, art) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const t0 = k.currentTime + 0.01;
    /* „ab": kurz – lang (Achtung, es geht los), „ein": ein langer Pfiff */
    const stoesse = art === "ab" ? [[0, 0.32], [0.48, 1.05]] : [[0, 1.35]];
    const ziel = ausgang(k, pan);
    for (const [a, d] of stoesse) {
      const t = t0 + a;
      const g = k.createGain(); g.connect(ziel);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * 0.34, t + 0.09); g.gain.setValueAtTime(v * 0.34, t + d - 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.18);
      /* Akkord der Dampfpfeife (drei Glocken), der Ton steigt am Anfang etwas an */
      for (const f of [466, 587, 698]) {
        const o = k.createOscillator(); o.type = "triangle";
        o.frequency.setValueAtTime(f * 0.94, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.12);
        const vib = k.createOscillator(), vg = k.createGain(); vib.frequency.value = 5.2; vg.gain.value = f * 0.004; vib.connect(vg); vg.connect(o.frequency);
        o.connect(g); o.start(t); o.stop(t + d + 0.25); vib.start(t); vib.stop(t + d + 0.25);
      }
      /* Hauch */
      const n = rauschQuelle(k, t), bp = k.createBiquadFilter(), gn = k.createGain();
      bp.type = "bandpass"; bp.frequency.value = 1400; bp.Q.value = 1.2;
      gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(v * 0.12, t + 0.06); gn.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.2);
      n.connect(bp); bp.connect(gn); gn.connect(ziel); n.stop(t + d + 0.3);
    }
    merk("pfiff-" + (art || "ein"), v);
    return true;
  };
  T.bremse = function (laut, pan, dauer) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const t = k.currentTime + 0.01, d = Math.max(0.6, dauer || 2.4);
    const ziel = ausgang(k, pan);
    const g = k.createGain(); g.connect(ziel);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * 0.1, t + 0.35); g.gain.exponentialRampToValueAtTime(v * 0.16, t + d * 0.75); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    for (const [f, w] of [[2870, 1], [3420, 0.6]]) {
      const o = k.createOscillator(), og = k.createGain(); o.type = "sine"; og.gain.value = w;
      o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 1.06, t + d);
      const lfo = k.createOscillator(), lg = k.createGain(); lfo.frequency.value = 7 + Math.random() * 3; lg.gain.value = 38; lfo.connect(lg); lg.connect(o.frequency);
      o.connect(og); og.connect(g); o.start(t); o.stop(t + d + 0.05); lfo.start(t); lfo.stop(t + d + 0.05);
    }
    const n = rauschQuelle(k, t), bp = k.createBiquadFilter(), gn = k.createGain();
    bp.type = "bandpass"; bp.frequency.value = 3000; bp.Q.value = 3;
    gn.gain.value = 0.5; n.connect(bp); bp.connect(gn); gn.connect(g); n.stop(t + d + 0.05);
    merk("bremse", v);
    return true;
  };
  T.zisch = function (laut, pan) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const t = k.currentTime + 0.01;
    const n = rauschQuelle(k, t), hp = k.createBiquadFilter(), g = k.createGain();
    hp.type = "highpass"; hp.frequency.value = 2200;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * 0.22, t + 0.08); g.gain.exponentialRampToValueAtTime(v * 0.12, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    n.connect(hp); hp.connect(g); g.connect(ausgang(k, pan)); n.stop(t + 1.7);
    merk("zisch", v);
    return true;
  };
  T.klack = function (laut, pan) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const ziel = ausgang(k, pan);
    for (const a of [0, 0.11]) {
      const t = k.currentTime + 0.01 + a;
      const n = rauschQuelle(k, t), bp = k.createBiquadFilter(), g = k.createGain();
      bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 2.5;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * 0.25, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      n.connect(bp); bp.connect(g); g.connect(ziel); n.stop(t + 0.08);
    }
    merk("klack", v);
    return true;
  };
})();
