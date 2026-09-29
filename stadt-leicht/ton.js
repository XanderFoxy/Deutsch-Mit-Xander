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

  /* =====================================================================
     FASSUNG 825 — ALTE AUFNAHMEN, RATHAUSUHR (WESTMINSTER), BAUSTELLE
     ---------------------------------------------------------------------
     XANDER (wörtlich): „der Sound von alten Spiel von der Lokomotive den
     fand ich schöner als den jetzigen. Vielleicht kannst du den
     wiederherstellen" – „ich möchte wie gesagt meinen alten Lokomotiven
     Sound". Das alte gemalte Dorf (spiel.js, bahnLauf) spielte die
     Aufnahmen ton/lokpfeife, lokstampf, lokschiene und lokglocke – genau
     die kommen hier wieder (T.datei; geladen nur, wenn Töne erlaubt sind).
     Fehlen sie (kein Netz, Prüf-Attrappe), bleibt der selbst erzeugte
     Klang der Fassung 818 als Ersatz.

     XANDER: „Da gibt's doch so ein ganz typischen den haben wir glaub ich
     in Döbeln auch da geht so und Damm dumm da Dam Damm dumm da Dam … das
     ist so ne Melodie, die einmal hingeht und dann wieder zurückkommt …
     Big Ben". Das ist der Westminster-Schlag: vier Glocken in E-Dur
     (gis', fis', e', h) in fünf Wechseln; zur Viertelstunde 1 Wechsel,
     zur halben 2, zur Dreiviertelstunde 3, zur vollen Stunde 4 und danach
     die große Stundenglocke (e) so oft, wie es Uhr ist. Die Glocken
     entstehen mit Web Audio aus den Teiltönen einer Glocke (Unterton,
     Prime, kleine Terz, Quinte, Nominal …) mit Klöppelanschlag. Sie
     schlagen nur, wenn ein Rathaus steht, nach deutscher Uhr (ST.uhr),
     nachts (22–7 Uhr) nicht, und leiser, je weiter die Kamera vom Rathaus
     weg ist. Warum auch die Viertelstunden: so klingt eine echte
     Westminster-Uhr (ohne sie hört man die „hin und zurück"-Melodie nur
     zur vollen Stunde); leise ist sie trotzdem, nur nah am Rathaus kräftig.

     XANDER: „bei der Baustelle jetzt etwas Neues gebaut aber man hört gar
     keine Baugeräten in dem Sinne". Solange ein Haus im Bau ist und die
     Kamera nah genug ist: Bagger (Baugrube, Phase b8), Hämmern in kleinen
     Gruppen, Kran-Surren (ab Phase b30), Säge und Spitzhacke dazwischen –
     leise, nach Nähe und Zoom, tagsüber (Nachtruhe 20–7 Uhr: still). Die
     Geräusche sind die Aufnahmen, die schon das alte Dorf für seine
     Baustellen hatte (ton/hammerschlag, bagger, schaufelbagger, kran,
     spitzhacke); die Säge ist selbst erzeugt.
     Test-Haken: T.glockenPlan(h, viertel), T.glockenLog, T.bauInfo, T.log.
     ===================================================================== */
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);
  /* verdeckte Seite: die Tonanlage schläft (auch Schleifen und geplante Glockenschläge) */
  try {
    document.addEventListener("visibilitychange", () => {
      const k = T.ctx; if (!k) return;
      try { const v = document.hidden ? k.suspend && k.suspend() : T.darf() && k.resume && k.resume(); if (v && v.catch) v.catch(() => {}); } catch (e) {}
    });
  } catch (e) {}

  /* ---------------- Aufnahmen aus dem Repo (ton/…) ---------------- */
  const DATEI = {};
  let endungW = null;
  function endung() {
    if (endungW) return endungW;
    let e = ".m4a";
    try { const a = document.createElement("audio"); if (a.canPlayType && a.canPlayType('audio/ogg; codecs="opus"')) e = ".opus"; } catch (x) {}
    return (endungW = e);
  }
  T.laden = function (name) {
    const d = DATEI[name] || (DATEI[name] = {});
    if (d.puffer || d.laedt || d.kaputt) return;
    const k = anlage();
    if (!k || !window.fetch) { d.kaputt = "keine Tonanlage"; return; }
    if (typeof k.decodeAudioData !== "function") { d.kaputt = "kein decodeAudioData"; return; }
    d.laedt = true;
    fetch("ton/" + name + endung()).then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.arrayBuffer(); })
      .then((roh) => new Promise((ok, nein) => { const v = k.decodeAudioData(roh, ok, nein); if (v && v.then) v.then(ok, nein); }))
      .then((p) => { d.puffer = p; d.laedt = false; }, (e) => { d.kaputt = String((e && e.message) || e || "Fehler"); d.laedt = false; });
  };
  T.vorladen = function (namen) { if (!T.darf()) return; for (const n of namen) T.laden(n); };
  T.hat = (name) => !!(DATEI[name] && DATEI[name].puffer);
  T.kaputt = (name) => !!(DATEI[name] && DATEI[name].kaputt);
  T.dateien = DATEI;
  /* eine Aufnahme (oder ein Stück daraus: ab, dauer in s) spielen; opt.rate Tempo, opt.spaeter Verzögerung, opt.log Name */
  T.datei = function (name, laut, pan, opt) {
    opt = opt || {};
    const d = DATEI[name];
    if (!d || !d.puffer) { T.laden(name); return false; }
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const rate = opt.rate || 1, t = k.currentTime + 0.01 + (opt.spaeter || 0), ab = opt.ab || 0;
    const s = k.createBufferSource(), g = k.createGain();
    s.buffer = d.puffer;
    try { s.playbackRate.value = rate; } catch (e) {}
    g.gain.setValueAtTime(v, t);
    if (opt.dauer) {
      /* Stück: am Ende weich ausblenden (kein Knacken) */
      g.gain.setValueAtTime(v, t + Math.max(0.01, opt.dauer - (opt.aus || 0.07)));
      g.gain.linearRampToValueAtTime(0.0001, t + opt.dauer);
    }
    s.connect(g); g.connect(ausgang(k, pan));
    try { if (opt.dauer) s.start(t, ab, opt.dauer * rate + 0.02); else s.start(t, ab); } catch (e) { try { s.start(t); } catch (x) { return false; } }
    merk(opt.log || name, v);
    return true;
  };
  /* eine Aufnahme als Schleife (Schienenrollen): h.setzen(laut, pan, tempo), h.aus() */
  T.schleife = function (name) {
    const d = DATEI[name];
    if (!d || !d.puffer) { T.laden(name); return null; }
    const k = bereit(); if (!k) return null;
    const s = k.createBufferSource(), g = k.createGain();
    let p = null;
    s.buffer = d.puffer; s.loop = true; g.gain.value = 0.0001;
    try { if (k.createStereoPanner) { p = k.createStereoPanner(); g.connect(p); p.connect(master); } else g.connect(master); } catch (e) { g.connect(master); }
    s.connect(g);
    try { s.start(k.currentTime + 0.01, Math.random() * d.puffer.duration * 0.8); } catch (e) { s.start(); }
    merk(name + "-schleife", 0);
    const h = {
      laut: 0,
      setzen(laut, pan, rate) {
        const v = Math.max(0.0001, laut * T.faktor()); h.laut = v;
        try { g.gain.setTargetAtTime(v, k.currentTime, 0.12); if (p) p.pan.setTargetAtTime(klemm(pan || 0, -0.9, 0.9), k.currentTime, 0.2); if (rate) s.playbackRate.setTargetAtTime(rate, k.currentTime, 0.3); } catch (e) {}
      },
      aus() {
        try { g.gain.setTargetAtTime(0.0001, k.currentTime, 0.15); } catch (e) {}
        setTimeout(() => { try { s.stop(); s.disconnect(); g.disconnect(); if (p) p.disconnect(); } catch (e) {} }, 900);
        h.laut = 0; merk(name + "-ende", 0);
      }
    };
    return h;
  };

  /* ---------------- Rathausuhr: Westminster-Schlag ---------------- */
  /* Teiltöne einer Glocke, bezogen auf den Schlagton (Nominal): [Verhältnis, Stärke, Anteil am Nachklang] */
  const GL_TEILE = [[0.25, 0.2, 1.0], [0.5, 0.32, 0.72], [0.6, 0.24, 0.5], [0.75, 0.1, 0.36], [1, 0.42, 0.34], [1.25, 0.1, 0.22], [1.5, 0.1, 0.18], [2, 0.07, 0.13], [2.61, 0.05, 0.09], [3.23, 0.03, 0.06]];
  const WM_TOENE = { gis: 415.3, fis: 369.99, e: 329.63, h: 246.94, E: 164.81 };
  /* die fünf Wechsel des Westminster-Schlags */
  const WM_WECHSEL = [null, ["gis", "fis", "e", "h"], ["e", "gis", "fis", "h"], ["e", "fis", "gis", "e"], ["gis", "e", "fis", "h"], ["h", "fis", "gis", "e"]];
  /* Viertel (1 = Viertel nach, 2 = halb, 3 = dreiviertel, 0 = volle Stunde) → Wechsel */
  const WM_VIERTEL = { 1: [1], 2: [2, 3], 3: [4, 5, 1], 0: [2, 3, 4, 5] };
  T.WESTMINSTER = { toene: WM_TOENE, wechsel: WM_WECHSEL, viertel: WM_VIERTEL };
  const NOTE = 0.8, WECHSEL_PAUSE = 1.6, STUNDE_ABSTAND = 2.9;
  T.glockenPlan = function (h, viertel) {
    const plan = [];
    let t = 0;
    for (const w of WM_VIERTEL[viertel]) {
      WM_WECHSEL[w].forEach((n, i) => plan.push({ t: t + i * NOTE, ton: n, f: WM_TOENE[n], laut: i === 3 ? 1 : 0.88, nach: i === 3 ? 5.5 : 4, art: "viertel", wechsel: w }));
      t += 4 * NOTE + WECHSEL_PAUSE;
    }
    if (viertel === 0) {
      const n = h % 12 || 12;
      t += 1.4;
      for (let i = 0; i < n; i++) plan.push({ t: t + i * STUNDE_ABSTAND, ton: "E", f: WM_TOENE.E, laut: 1.3, nach: 10, art: "stunde" });
    }
    return plan;
  };
  T.glockeNachts = (h) => h >= 22 || h < 7;
  function glockeSchlag(k, ziel, t0, f, laut, nach) {
    for (const [r, a, d] of GL_TEILE) {
      const fr = f * r;
      if (fr > 9000) continue;
      const o = k.createOscillator(), g = k.createGain(), dauer = Math.max(0.35, nach * d);
      o.type = "sine"; o.frequency.value = fr * (1 + (Math.random() - 0.5) * 0.0016);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(laut * a, t0 + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dauer);
      o.connect(g); g.connect(ziel); o.start(t0); o.stop(t0 + dauer + 0.05);
    }
    /* Schwebung im Unterton (die Glocke „wummert") */
    const o2 = k.createOscillator(), g2 = k.createGain();
    o2.type = "sine"; o2.frequency.value = f * 0.25 + 0.9;
    g2.gain.setValueAtTime(0.0001, t0); g2.gain.exponentialRampToValueAtTime(laut * 0.12, t0 + 0.02); g2.gain.exponentialRampToValueAtTime(0.0001, t0 + nach * 0.9);
    o2.connect(g2); g2.connect(ziel); o2.start(t0); o2.stop(t0 + nach);
    /* Anschlag des Klöppels: ein kurzes, helles Klicken */
    const n = rauschQuelle(k, t0), bp = k.createBiquadFilter(), gn = k.createGain();
    bp.type = "bandpass"; bp.frequency.value = Math.min(6000, f * 5); bp.Q.value = 1.4;
    gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(laut * 0.22, t0 + 0.002); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.035);
    n.connect(bp); bp.connect(gn); gn.connect(ziel); n.stop(t0 + 0.06);
  }
  function rathaus() {
    const SZ = ST.szene; if (!SZ) return null;
    for (const o of SZ.objekte) if (o.spiel === "rathaus" && !o.versteckt && !(o.bau && o.bau.p < 1)) return o;
    return null;
  }
  /* Lautstärke der Glocken nach dem Abstand Kamera–Rathaus (über die ganze Stadt hörbar, aber leiser) */
  function glockeLaut(o) {
    const K = ST.kamera, c = ST.aufBoden(K.W / 2, K.H / 2), d = Math.hypot(o.x - c[0], o.y - c[1]);
    const sc = K.s / (K.dpr || 1), nah = Math.pow(klemm(1 - d / 300, 0, 1), 1.4), zoom = klemm(0.55 + sc / 40, 0.55, 1);
    const P = ST.proj(o.x, o.y, 0);
    return { laut: 0.5 * (0.05 + 0.95 * nah) * zoom, pan: klemm((P[0] / K.W - 0.5) * 1.2, -0.7, 0.7), abstand: d };
  }
  T.glockeLaut = function () { const o = rathaus(); return o ? glockeLaut(o) : null; };
  T.glockenLog = [];
  let glSlot = null, glG = null, glP = null, glO = null, glBis = 0;
  const zwei = (n) => ("0" + n).slice(-2);
  function glockeLaeuten(u, viertel) {
    const h = u.h;
    const e = { uhr: zwei(u.h) + ":" + zwei(u.m) + ":" + zwei(u.s), viertel: viertel, stunde: h, gespielt: false, grund: "" };
    T.glockenLog.push(e); if (T.glockenLog.length > 40) T.glockenLog.shift();
    const plan = T.glockenPlan(h, viertel);
    e.folge = plan.map((p) => p.ton).join(" ");
    if (T.glockeNachts(h)) { e.grund = "nachts still"; return; }
    const o = rathaus(); if (!o) { e.grund = "kein Rathaus"; return; }
    const k = bereit(); if (!k) { e.grund = "Ton aus"; return; }
    const L = glockeLaut(o);
    e.laut = Math.round(L.laut * 1000) / 1000;
    const g = k.createGain(); g.gain.value = Math.max(0.0001, L.laut * T.faktor());
    let p = null;
    try { if (k.createStereoPanner) { p = k.createStereoPanner(); p.pan.value = L.pan; g.connect(p); p.connect(master); } else g.connect(master); } catch (x) { g.connect(master); }
    const t0 = k.currentTime + 0.05;
    for (const s of plan) glockeSchlag(k, g, t0 + s.t, s.f, s.laut * 0.24, s.nach);
    if (glG) try { glG.disconnect(); } catch (x) {}
    glG = g; glP = p; glO = o; glBis = performance.now() + (plan[plan.length - 1].t + 12) * 1000;
    e.gespielt = true;
    merk(viertel === 0 ? "glocke-stunde" : "glocke-viertel" + viertel, L.laut * T.faktor());
  }
  T.glockeTesten = function (h, viertel) { glockeLaeuten({ h: h, m: viertel ? viertel * 15 : 0, s: 0 }, viertel); };
  function glockenTakt() {
    if (!ST.uhr) return;
    const u = ST.uhr(), slot = Math.floor(u.sek / 900);
    if (glSlot !== slot) {
      const erst = glSlot == null;
      glSlot = slot;
      /* zur Viertelstunde (nicht beim Öffnen mitten in der Viertelstunde; hing die Seite kurz, bis 45 s später) */
      if (!erst && u.sek - slot * 900 < 45) glockeLaeuten(u, slot % 4);
    }
    /* während sie läuft: der Kamera folgen */
    if (glG && glO) {
      if (performance.now() > glBis) { const alt = glG; setTimeout(() => { try { alt.disconnect(); } catch (x) {} }, 100); glG = glP = glO = null; return; }
      if (T.ctx) try { const L = glockeLaut(glO); glG.gain.setTargetAtTime(Math.max(0.0001, L.laut * T.faktor()), T.ctx.currentTime, 0.3); if (glP) glP.pan.setTargetAtTime(L.pan, T.ctx.currentTime, 0.3); } catch (x) {}
    }
  }

  /* ---------------- Baustelle ---------------- */
  const BAU_DATEIEN = ["hammerschlag", "bagger", "schaufelbagger", "kran", "spitzhacke"];
  const bauPhase = (p) => (p < 0.2 ? 8 : p < 0.42 ? 30 : p < 0.7 ? 55 : 80);   // wie szene.js (b8 Baugrube … b80 Dach)
  T.bauRuhe = (h) => h >= 20 || h < 7;
  function bauLaut(o) {
    const K = ST.kamera, c = ST.aufBoden(K.W / 2, K.H / 2), d = Math.hypot(o.x - c[0], o.y - c[1]);
    const sc = K.s / (K.dpr || 1), R = klemm(700 / Math.max(1, sc), 28, 80);
    const nah = Math.pow(klemm(1 - d / R, 0, 1), 1.6), zoom = klemm(sc / 16, 0.3, 1);
    const P = ST.proj(o.x, o.y, 0);
    return { laut: 0.42 * nah * zoom, pan: klemm((P[0] / K.W - 0.5) * 1.6, -0.85, 0.85), abstand: d };
  }
  /* Ersatz, falls die Aufnahmen fehlen: selbst erzeugte Schläge und Motoren */
  T.klopf = function (laut, pan, spaeter) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const t = k.currentTime + 0.01 + (spaeter || 0), ziel = ausgang(k, pan);
    const n = rauschQuelle(k, t), bp = k.createBiquadFilter(), g = k.createGain();
    bp.type = "bandpass"; bp.frequency.value = 1500 + Math.random() * 600; bp.Q.value = 2;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * 0.5, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    n.connect(bp); bp.connect(g); g.connect(ziel); n.stop(t + 0.1);
    const o = k.createOscillator(), go = k.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.06);
    go.gain.setValueAtTime(0.0001, t); go.gain.exponentialRampToValueAtTime(v * 0.3, t + 0.004); go.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    o.connect(go); go.connect(ziel); o.start(t); o.stop(t + 0.1);
    return true;
  };
  T.motor = function (laut, pan, dauer, art) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const t = k.currentTime + 0.01, d = dauer || 3, ziel = ausgang(k, pan);
    const g = k.createGain(); g.connect(ziel);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * 0.28, t + 0.4); g.gain.setValueAtTime(v * 0.28, t + d - 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    const o = k.createOscillator(), lp = k.createBiquadFilter();
    o.type = "sawtooth"; o.frequency.setValueAtTime(art === "kran" ? 70 : 38, t); o.frequency.linearRampToValueAtTime(art === "kran" ? 84 : 46, t + d * 0.4); o.frequency.linearRampToValueAtTime(art === "kran" ? 72 : 40, t + d);
    lp.type = "lowpass"; lp.frequency.value = art === "kran" ? 900 : 420;
    o.connect(lp); lp.connect(g); o.start(t); o.stop(t + d + 0.05);
    if (art === "kran") {
      /* das Surren des Hubwerks */
      const w = k.createOscillator(), gw = k.createGain();
      w.type = "sine"; w.frequency.setValueAtTime(310, t); w.frequency.linearRampToValueAtTime(460, t + d * 0.5); w.frequency.linearRampToValueAtTime(400, t + d);
      gw.gain.value = 0.35; w.connect(gw); gw.connect(g); w.start(t); w.stop(t + d + 0.05);
    }
    return true;
  };
  /* Handsäge: Rauschen in Zügen (hin und her) */
  T.saege = function (laut, pan) {
    const k = bereit(); if (!k) return false;
    const v = laut * T.faktor(); if (v < 0.004) return false;
    const t = k.currentTime + 0.01, zuege = 5 + (Math.random() * 4 | 0), zug = 0.36 + Math.random() * 0.08;
    const n = rauschQuelle(k, t), bp = k.createBiquadFilter(), g = k.createGain();
    bp.type = "bandpass"; bp.frequency.value = 2900; bp.Q.value = 1.1;
    g.gain.setValueAtTime(0.0001, t);
    for (let i = 0; i < zuege; i++) {
      const a = t + i * zug, stark = i % 2 ? 0.7 : 1;
      g.gain.exponentialRampToValueAtTime(v * 0.2 * stark, a + zug * 0.45); g.gain.exponentialRampToValueAtTime(v * 0.02, a + zug * 0.95);
    }
    g.gain.exponentialRampToValueAtTime(0.0001, t + zuege * zug + 0.05);
    n.connect(bp); bp.connect(g); g.connect(ausgang(k, pan)); n.stop(t + zuege * zug + 0.1);
    merk("bau-saege", v);
    return true;
  };
  const bauNaechst = {};
  let bauGeladen = false, bauBagger = 0;
  T.bauInfo = null;
  function bauGeraet(name, laut, pan, opt, ersatz) {
    if (T.hat(name)) return T.datei(name, laut, pan, opt);
    if (T.kaputt(name)) { const ok = ersatz && ersatz(); if (ok) merk(opt.log, laut * T.faktor()); return ok; }
    T.laden(name);
    return false;
  }
  function bauTakt(jetzt) {
    const SZ = ST.szene; if (!SZ) return;
    let best = null;
    for (const o of SZ.objekte) if (o.bau && o.bau.p < 1 && !o.versteckt) { const L = bauLaut(o); if (!best || L.laut > best.L.laut) best = { o: o, L: L }; }
    if (!best) { T.bauInfo = null; bauNaechst.an = false; return; }
    const u = ST.uhr ? ST.uhr() : { stunde: 12 }, ph = bauPhase(best.o.bau.p), ruhe = T.bauRuhe(u.stunde);
    const L = best.L, t = jetzt / 1000;
    T.bauInfo = { spiel: best.o.spiel, phase: ph, laut: Math.round(L.laut * 1000) / 1000, ruhe: ruhe };
    if (ruhe || L.laut < 0.01 || !T.darf()) { bauNaechst.an = false; return; }
    if (!bauGeladen) { bauGeladen = true; T.vorladen(BAU_DATEIEN); }
    if (!bauNaechst.an) {
      /* gerade hergekommen: nicht alles auf einmal */
      bauNaechst.an = true;
      bauNaechst.hammer = t + 0.3 + Math.random() * 1.2; bauNaechst.bagger = t + 0.8 + Math.random() * 2;
      bauNaechst.kran = t + 2 + Math.random() * 5; bauNaechst.saege = t + 4 + Math.random() * 6; bauNaechst.hacke = t + 3 + Math.random() * 5;
    }
    const pz = () => L.pan + (Math.random() - 0.5) * 0.15;
    if (t >= bauNaechst.hammer) {
      /* Hämmern in kleinen Gruppen (in der Baugrube selten) */
      const n = ph === 8 ? 1 + (Math.random() * 2 | 0) : 2 + (Math.random() * 4 | 0), abst = 0.34 + Math.random() * 0.2, rate = 0.9 + Math.random() * 0.25;
      for (let i = 0; i < n; i++) bauGeraet("hammerschlag", L.laut * (0.7 + Math.random() * 0.3), pz(), { spaeter: i * abst, rate: rate, dauer: 0.55, log: "bau-hammer" }, () => T.klopf(L.laut, L.pan, i * abst));
      bauNaechst.hammer = t + n * abst + (ph === 8 ? 5 + Math.random() * 6 : 1.4 + Math.random() * 3.4);
    }
    if (ph === 8 && t >= bauNaechst.bagger) {
      /* Baugrube: der Bagger gräbt (abwechselnd Motor und Schaufel) */
      const name = bauBagger++ % 2 ? "schaufelbagger" : "bagger";
      bauGeraet(name, L.laut * 0.8, pz(), { log: "bau-bagger" }, () => T.motor(L.laut, L.pan, 4.5, "bagger"));
      bauNaechst.bagger = t + 6.5 + Math.random() * 5;
    }
    if (ph >= 30 && t >= bauNaechst.kran) {
      bauGeraet("kran", L.laut * 0.55, pz(), { log: "bau-kran" }, () => T.motor(L.laut * 0.8, L.pan, 3, "kran"));
      bauNaechst.kran = t + 9 + Math.random() * 10;
    }
    if (ph >= 30 && ph <= 55 && t >= bauNaechst.saege) { T.saege(L.laut * 0.7, pz()); bauNaechst.saege = t + 8 + Math.random() * 9; }
    if ((ph === 8 || ph === 30) && t >= bauNaechst.hacke) {
      bauGeraet("spitzhacke", L.laut * 0.6, pz(), { log: "bau-spitzhacke" }, () => T.klopf(L.laut * 0.8, L.pan, 0));
      bauNaechst.hacke = t + 7 + Math.random() * 9;
    }
  }

  /* ---------------- Einsammeln: ein kurzes „Pling" für jede Ware ----------------
     XANDER (wörtlich): „beim Einsammeln von Fisch kommt glaub ich sogar das Geräusch aber bei den anderen bei Ei … kommt
     da gar nix … so dieses Haptik-Geräusch fehlt vielleicht noch". Für JEDE eingesammelte Ware (Ei, Milch, Fleisch, Holz,
     Brot, Getreide, Fisch …) derselbe kurze Ton: ein weicher Klick und zwei helle Glöckchen-Töne nach oben (Quinte),
     dazu ein kurzes Zittern (navigator.vibrate(12)), wo das Gerät es kann. Der Tipp selbst weckt die Tonanlage – ist sie
     noch nicht wach, spielt der Ton, sobald sie läuft. */
  T.einsammeln = function (ware) {
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
    if (!T.darf()) return false;
    const k = anlage(); if (!k || !master) return false;
    const spielen = () => {
      const v = 0.5 * T.faktor(); if (v < 0.004) return;
      const t = k.currentTime + 0.005, ziel = ausgang(k, 0);
      /* Klick */
      const n = rauschQuelle(k, t), hp = k.createBiquadFilter(), gn = k.createGain();
      hp.type = "highpass"; hp.frequency.value = 3500;
      gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(v * 0.25, t + 0.002); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      n.connect(hp); hp.connect(gn); gn.connect(ziel); n.stop(t + 0.05);
      /* Pling: zwei Töne (e'' → h''), jeder mit einem leisen Oberton */
      [[659.3, 0], [987.8, 0.07]].forEach(([f, a]) => {
        for (const [r, s] of [[1, 1], [2.76, 0.18]]) {
          const o = k.createOscillator(), g = k.createGain();
          o.type = "sine"; o.frequency.value = f * r;
          g.gain.setValueAtTime(0.0001, t + a); g.gain.exponentialRampToValueAtTime(v * 0.3 * s, t + a + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + a + 0.32);
          o.connect(g); g.connect(ziel); o.start(t + a); o.stop(t + a + 0.35);
        }
      });
      merk("einsammeln" + (ware ? "-" + ware : ""), v);
    };
    if (k.state === "running") { spielen(); return true; }
    try { const r = k.resume(); if (r && r.then) r.then(() => { if (k.state === "running") spielen(); }, () => {}); } catch (e) {}
    return true;
  };

  /* ---------------- Motor der Autos (autos.js) ----------------
     XANDER: „am Tag möchte ich auch Autos fahren sehen … vielleicht auch mit Fahrgeräusche". Ein leiser, laufender Motor
     je Auto: Sägezahn + Unterton durch einen Tiefpass, leicht unrund (Zündfolge); mit dem Tempo steigen Drehzahl und
     Helligkeit, beim Gasgeben etwas mehr. „v10" (Dodge Viper) brummt tief, „turbine" (Batmobil) hat dazu ein helles
     Turbinensingen. h.setzen(laut, pan, tempo 0…1, gas 0…1), h.aus(). */
  T.motorSchleife = function (art) {
    const k = bereit(); if (!k) return null;
    const g = k.createGain(), lp = k.createBiquadFilter(), o1 = k.createOscillator(), o2 = k.createOscillator(), g2 = k.createGain();
    const lfo = k.createOscillator(), lg = k.createGain();
    let p = null, o3 = null, g3 = null;
    g.gain.value = 0.0001;
    try { if (k.createStereoPanner) { p = k.createStereoPanner(); g.connect(p); p.connect(master); } else g.connect(master); } catch (e) { g.connect(master); }
    lp.type = "lowpass"; lp.frequency.value = 420; lp.Q.value = 1.6;
    o1.type = "sawtooth"; o2.type = "square"; g2.gain.value = 0.45;
    lfo.type = "sine"; lfo.frequency.value = art === "turbine" ? 3.1 : 6.7; lg.gain.value = art === "turbine" ? 1.2 : 3.5;
    lfo.connect(lg); lg.connect(o1.frequency);
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g);
    if (art === "turbine") { o3 = k.createOscillator(); g3 = k.createGain(); o3.type = "sine"; g3.gain.value = 0.12; o3.connect(g3); g3.connect(g); }
    const t = k.currentTime + 0.01;
    for (const o of [o1, o2, lfo, o3]) if (o) o.start(t);
    merk("motor-" + art, 0);
    const h = {
      art: art, laut: 0,
      setzen(laut, pan, tempo, gas) {
        const tt = k.currentTime, v = Math.max(0.0001, laut * T.faktor()), te = klemm(tempo || 0, 0, 1.3), ga = klemm(gas || 0, 0, 1);
        const f = (art === "turbine" ? 48 : 38) + te * (art === "turbine" ? 70 : 88) + ga * 10;
        h.laut = v; h.f = f;
        try {
          g.gain.setTargetAtTime(v, tt, 0.15);
          o1.frequency.setTargetAtTime(f, tt, 0.25); o2.frequency.setTargetAtTime(f / 2, tt, 0.25);
          lp.frequency.setTargetAtTime(320 + te * 900 + ga * 400, tt, 0.2);
          if (o3) o3.frequency.setTargetAtTime(1150 + te * 900, tt, 0.4);
          if (p) p.pan.setTargetAtTime(klemm(pan || 0, -0.85, 0.85), tt, 0.2);
        } catch (e) {}
      },
      aus() {
        try { g.gain.setTargetAtTime(0.0001, k.currentTime, 0.2); } catch (e) {}
        setTimeout(() => { for (const o of [o1, o2, lfo, o3]) if (o) try { o.stop(); o.disconnect(); } catch (e) {} try { g.disconnect(); if (p) p.disconnect(); } catch (e) {} }, 1200);
        h.laut = 0; merk("motor-aus", 0);
      }
    };
    return h;
  };

  /* jedes Bild (start.js): Rathausuhr und Baustelle */
  T.takt = function (jetzt) {
    try { glockenTakt(); } catch (e) {}
    try { bauTakt(jetzt); } catch (e) {}
  };
})();
