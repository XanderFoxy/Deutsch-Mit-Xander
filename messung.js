/* =====================================================================
   FASSUNG 884 — MESSUNG BEI ECHTEN NUTZERN
   ---------------------------------------------------------------------
   XANDER (Funk 255): „… das auf beiden Seiten immer alles spielbar ist
   und niemals abstürzt und alles optimiert ist".
   ZUGESAGT (Funk 258, Punkt 5): „Echte Messung bei echten Nutzern
   (Ladezeit, Abbrüche) statt nur bei mir."

   Bisher gab es nur die Leitungs-Zeitleisten (spiel_diagnose „leitung"
   und „verbindung", ab 836/840). Wie lange die Seite bei Xanders Leuten
   bis „bereit" braucht, welche Fehler dort auftreten, ob eine Seite
   abstürzt und ob das Klassenzimmer ruckelt, wusste niemand. Jetzt:

     mess-start   einmal je Seite, 20 s nach dem Laden: Zeiten (ttfb,
                  erstes Bild, größtes Bild, bereit, load), Tipp →
                  Wissen/Klassenzimmer, Kilobyte und Dateien bis
                  „bereit", Langläufer beim Start, Netz und Gerät, was
                  mit der vorigen Seite war (vorher), Fehler bis dahin.
     mess-fehler  Fehler, die erst danach auftreten (gebündelt).
     mess-raum    je Aufenthalt im Klassenzimmer: Betreten bis drin,
                  Langläufer je 30 s (Summe, längster, Anzahl), die
                  längsten Bilder (LoAF) und Eingaben, Leute, Kamera.

   Mitgeschrieben wird von Anfang an in index.html (DMA_MESS: Fehler,
   Langläufer, Tipps, Raumwechsel). Diese Datei kommt erst 4 s nach dem
   Laden in einer Ruhepause und wertet aus. Der Start wird dadurch nicht
   langsamer; die Sonde pruefe-884-messung.js misst das nach.

   ABSTURZ-INDIZ: jede Seite führt ein kleines Laufbuch (localStorage
   „dma-mess-lauf"): wann zuletzt gesehen, sichtbar oder im Hintergrund,
   sauber geschlossen (pagehide) oder nicht. Findet die nächste Seite
   einen Eintrag, der nie geschlossen wurde und nicht mehr antwortet
   (BroadcastChannel), meldet sie ihn in „vorher": „weg" (war sichtbar –
   Absturz, Akku, Zwangsbeenden), „hinten" (im Hintergrund weggeräumt)
   oder „laden" (die Seite brach schon beim Laden ab). Das ist eine
   Schätzung, kein Beweis (siehe SPIELSYSTEM.md, Fassung 884).

   WAS BEWUSST NICHT GESENDET WIRD: Namen, Raumnamen, Chat-Inhalte,
   Kennungen, Adressen. Fehlertexte werden gereinigt (E-Mail, IDs, lange
   Zahlen, Adressen → Platzhalter, höchstens 140 Zeichen). Gäste senden
   nichts (der Server verlangt eine Anmeldung); ihre Zeilen warten in
   einer kleinen Kiste, bis sie sich anmelden.

   SPARSAM: höchstens 8 Zeilen „mess-*" je Kalendertag und Gerät (3,
   solange der Server sie noch mit den Leitungs-Zeilen zusammenzählt –
   siehe supabase/fassung-884-messung.sql), je Seite höchstens 1 Start,
   2 Fehler-, 3 Raumzeilen. Gesendet wird in Ruhepausen; Fehler beim
   Senden werden still geschluckt. Nie console.*.
   ===================================================================== */
(function () {
  "use strict";
  var M = window.DMA_MESS;
  if (!M || M.da) return;
  M.da = 1;
  var P = window.performance, tInit = P.now();

  /* Prüfläufe (navigator.webdriver) senden nur, wenn die Sonde es will – alle anderen Sonden bleiben unberührt. */
  var PRUEF = navigator.webdriver ? "" : "x";
  if (navigator.webdriver) { try { PRUEF = localStorage.getItem("dma-mess-pruef") || ""; } catch (e) {} }
  var ZEIT = PRUEF === "schnell"
    ? { start: 500, fenster: 1000, herz: 500, tot: 3000, teil: 2000, ping: 300, fehler: 1000, fehler2: 3000, zeile: 2000, warte: [0, 300, 900] }
    : { start: 20000, fenster: 30000, herz: 30000, tot: 180000, teil: 120000, ping: 1000, fehler: 20000, fehler2: 300000, zeile: 600000, warte: [0, 30000, 90000] };
  var TAG = 8, TAG_ALT = 3;
  var JE_SEITE = { "mess-start": 1, "mess-fehler": 2, "mess-raum": 3 };

  function jetzt() { return P.now(); }
  function rund(x) { return x == null || isNaN(x) ? null : Math.round(x); }
  function lesen(k) { try { var s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function schreiben(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function zufall(n) { var s = ""; while (s.length < n) s += Math.random().toString(36).slice(2); return s.slice(0, n); }
  function heute() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function ruhig(f) { if (window.requestIdleCallback) requestIdleCallback(f, { timeout: 5000 }); else setTimeout(f, 0); }
  function sichtbar() { return document.visibilityState !== "hidden"; }
  function speicherMb() { try { var m = P.memory; return m && m.usedJSHeapSize ? Math.round(m.usedJSHeapSize / 1048576) : null; } catch (e) { return null; } }
  var FASSUNG = String(window.DMA_VERSION || "");

  /* =========================================================
     SENDEN — wie leitungSenden (livechat.js), nur angemeldet
     ========================================================= */
  var gesendet = [], jeSeite = {}, tagMerk = null;
  function zugang() {
    try {
      var be = (typeof Backend !== "undefined" && Backend) || window.Backend;
      var k = be && be.zugang && be.zugang();
      return k && k.rpc && be.currentUser && be.currentUser() ? k : null;
    } catch (e) { return null; }
  }
  function tagStand() {
    var t = lesen("dma-mess-tag") || tagMerk || {};
    if (t.tag !== heute()) t = { tag: heute(), n: 0, srv: t.srv || 0 };
    tagMerk = t;
    return t;
  }
  function tagSetzen(f) { var t = tagStand(); f(t); tagMerk = t; schreiben("dma-mess-tag", t); }
  function tagFrei() { var t = tagStand(); return t.n < (t.srv ? TAG : TAG_ALT); }
  function kisteRein(art, d) {
    var k = kisteLesen();
    if (k.length >= 3) return;
    k.push({ a: art, d: d, t: Date.now() });
    schreiben("dma-mess-kiste", k);
  }
  function kisteLesen() {
    var k = lesen("dma-mess-kiste");
    return (k && k.filter ? k : []).filter(function (x) { return x && x.a && Date.now() - x.t < 3 * 864e5; });
  }
  function senden(art, d, ausKiste) {
    if (!PRUEF) return false;
    if (!ausKiste) {
      if ((jeSeite[art] || 0) >= (JE_SEITE[art] || 1)) return false;
      jeSeite[art] = (jeSeite[art] || 0) + 1;
    }
    d.f = d.f || FASSUNG;
    var k = zugang();
    if (!k) { kisteRein(art, d); return false; }
    if (!tagFrei()) return false;
    tagSetzen(function (t) { t.n++; });
    gesendet.push(art);
    ruhig(function () {
      try {
        k.rpc("spiel_diagnose_senden", { p_art: art, p_daten: d }).then(function (a) {
          var r = a && a.data;
          if (!a || a.error) { kisteRein(art, d); return; }
          if (r && r.ok === false) { if (r.grund) tagSetzen(function (t) { t.n = 99; }); else kisteRein(art, d); return; }
          /* Der Server mit eigenem Zähler für „mess-*" (fassung-884-messung.sql) sagt es mit „mess" – erst dann 8 am Tag. */
          if (r && r.mess && !tagStand().srv) tagSetzen(function (t) { t.srv = 1; });
        }, function () {});
      } catch (e) {}
    });
    return true;
  }
  function kisteLeeren() {
    var k = kisteLesen();
    if (!k.length) return;
    schreiben("dma-mess-kiste", null);
    k.forEach(function (x) { x.d.alt = Math.round((Date.now() - x.t) / 60000); senden(x.a, x.d, true); });
  }

  /* =========================================================
     FEHLER — gezählt, gereinigt, gebündelt
     ========================================================= */
  var fehler = {}, fehlerZahl = 0, fehlerMehr = 0, fehlerGemeldet = {}, fehlerMehrGemeldet = 0;
  var startRaus = false, fehlerGeplant = false, fehlerZuletzt = 0;
  function datei(u) {
    var m = /\/((?:min\/)?[\w.-]+\.(?:js|css|json))(?:[?#][^:\s]*)?$/.exec(String(u || "").split(/[?#]/)[0]);
    if (m) return m[1];
    var s = String(u || "").split(/[?#]/)[0].split("/");
    return s[s.length - 1] || s[2] || "";
  }
  function sauber(t) {
    t = String(t == null ? "" : t)
      .replace(/data:[^\s'"]+/g, "‹data›")
      .replace(/\b(?:https?|wss?|blob|file):\/\/[^\s'"<>()]+/g, function (u) { return "‹" + (datei(u) || "url") + "›"; })
      .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "‹mail›")
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "‹id›")
      .replace(/\d{5,}/g, "‹zahl›");
    return t.length > 140 ? t.slice(0, 139) + "…" : t;
  }
  function stapelOrt(st) {
    var re = /\/((?:min\/)?[\w.-]+\.js)(?:\?[^:\s]*)?:(\d+):(\d+)/, zeilen = String(st || "").split("\n"), m = null;
    for (var i = 0; i < zeilen.length && !m; i++) if (zeilen[i].indexOf(location.origin) >= 0) m = re.exec(zeilen[i]);
    if (!m) m = re.exec(String(st || ""));
    return m ? m[1] + ":" + m[2] + ":" + m[3] : "";
  }
  function zaehlen(a) {
    try {
      var art = a[0], text, ort;
      if (art === "js" && /ResizeObserver loop/.test(a[1])) return;
      if (art === "js" && /^Script error\.?$/.test(a[1])) art = "fremd";
      if (art === "laden") { text = a[1]; ort = sauber(datei(a[2])); }
      else if (art === "versprechen") { text = sauber(a[1]); ort = stapelOrt(a[2]); }
      else { text = sauber(a[1]); ort = a[2] ? sauber(datei(a[2])) + ":" + (a[3] || 0) + ":" + (a[4] || 0) : ""; }
      var schl = art + "|" + text + "|" + ort, e = fehler[schl];
      if (e) { e[0]++; return; }
      if (fehlerZahl >= 8) { fehlerMehr++; return; }
      fehler[schl] = [1, art, text, ort, rund(a[5])];
      fehlerZahl++;
      if (startRaus) fehlerPlanen();
    } catch (x) {}
  }
  function fehlerNeu() {
    return Object.keys(fehler).filter(function (s) { return !fehlerGemeldet[s]; });
  }
  function fehlerPlanen() {
    if (fehlerGeplant || (jeSeite["mess-fehler"] || 0) >= JE_SEITE["mess-fehler"]) return;
    fehlerGeplant = true;
    var warte = fehlerZuletzt ? Math.max(ZEIT.fehler, fehlerZuletzt + ZEIT.fehler2 - jetzt()) : ZEIT.fehler;
    setTimeout(function () {
      fehlerGeplant = false;
      var neu = fehlerNeu();
      if (!neu.length) return;
      var d = { fehler: neu.map(function (s) { fehlerGemeldet[s] = 1; return fehler[s]; }), fehlerMehr: fehlerMehr - fehlerMehrGemeldet };
      fehlerMehrGemeldet = fehlerMehr;
      fehlerZuletzt = jetzt();
      senden("mess-fehler", d);
    }, warte);
  }
  M.an = zaehlen;
  M.fe.splice(0).forEach(zaehlen);

  /* =========================================================
     KLASSENZIMMER — Langläufer je Fenster (30 s)
     ========================================================= */
  var nav = (P.getEntriesByType && P.getEntriesByType("navigation")[0]) || {};
  var bereitT = nav.domContentLoadedEventEnd || M.dcl || 0;
  var startLt = [0, 0, 0], raum = null, raumZuletzt = -1e12, drinAb = null, lueckeAnfang = M.lt.length >= 300;
  var TYPEN = (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes) || [];
  var mitLongtask = TYPEN.indexOf("longtask") >= 0, loafObs = null, evObs = null, uhr = null;
  function neuerRaum(t, haupt) {
    return { v: t, ab: null, seit: null, drin: null, haupt: haupt, f: {}, ges: [0, 0, 0], loaf: [], inp: [], leute: 0, bild: 0,
             uhr: mitLongtask ? 0 : 1, luecke: lueckeAnfang ? 1 : 0, teil: 0 };
  }
  function lang(s, d) {
    if (s < bereitT + 5000) { startLt[0]++; startLt[1] += d; if (d > startLt[2]) startLt[2] = d; }
    if (!raum || raum.seit == null || s < raum.seit) return;
    var i = Math.floor((s - raum.ab) / ZEIT.fenster), w = raum.f[i] || (raum.f[i] = [0, 0, 0]);
    w[0] += d; if (d > w[1]) w[1] = d; w[2]++;
    raum.ges[0]++; raum.ges[1] += d; if (d > raum.ges[2]) raum.ges[2] = d;
  }
  function oben3(liste, e) {
    liste.push(e);
    liste.sort(function (a, b) { return b[0] - a[0]; });
    if (liste.length > 3) liste.length = 3;
  }
  function ziel(el) {
    try {
      if (!el || !el.tagName) return "";
      if (el.id) return "#" + String(el.id).slice(0, 40);
      var k = typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "";
      return el.tagName.toLowerCase() + (k ? "." + k.slice(0, 40) : "");
    } catch (e) { return ""; }
  }
  function beobachterAn() {
    try {
      if (TYPEN.indexOf("long-animation-frame") >= 0 && !loafObs) {
        loafObs = new PerformanceObserver(function (l) {
          if (!raum || raum.seit == null) return;
          l.getEntries().forEach(function (x) {
            if (x.startTime < raum.seit || x.duration < 50) return;
            var sc = (x.scripts || []).slice().sort(function (a, b) { return b.duration - a.duration; })[0] || {};
            oben3(raum.loaf, [rund(x.duration), datei(sc.sourceURL || ""), sc.sourceCharPosition == null ? -1 : sc.sourceCharPosition, String(sc.invokerType || "")]);
          });
        });
        loafObs.observe({ type: "long-animation-frame", buffered: true });
      }
      if (TYPEN.indexOf("event") >= 0 && !evObs) {
        evObs = new PerformanceObserver(function (l) {
          if (!raum || raum.seit == null) return;
          l.getEntries().forEach(function (x) {
            if (x.startTime < raum.seit) return;
            oben3(raum.inp, [rund(x.duration), String(x.name || ""), ziel(x.target)]);
          });
        });
        evObs.observe({ type: "event", durationThreshold: 104, buffered: true });
      }
    } catch (e) {}
    /* Ohne longtask (iPhone, Firefox): grob über den Versatz eines 500-ms-Takts, nur im Raum und bei sichtbarer Seite. */
    if (!mitLongtask && !uhr) {
      var zuletzt = jetzt();
      uhr = setInterval(function () {
        var t = jetzt(), d = t - zuletzt - 500;
        zuletzt = t;
        if (sichtbar() && d > 50) lang(t - d, d);
      }, 500);
    }
  }
  function beobachterAus() {
    try { if (loafObs) loafObs.disconnect(); if (evObs) evObs.disconnect(); } catch (e) {}
    loafObs = evObs = null;
    if (uhr) { clearInterval(uhr); uhr = null; }
  }
  function raumBauen() {
    var r = raum, t = jetzt(), fen = [], zaeh = 0, kz = null;
    Object.keys(r.f).forEach(function (i) {
      var w = r.f[i];
      fen.push([+i, rund(w[0]), rund(w[1]), w[2]]);
      if (w[0] >= 300 || w[1] >= 200) zaeh++;
    });
    if (fen.length > 60) fen = fen.sort(function (a, b) { return b[1] - a[1]; }).slice(0, 60);
    fen.sort(function (a, b) { return a[0] - b[0]; });
    (M.tipp.kz || []).forEach(function (x) { if (x[0] <= r.ab && x[0] >= (r.v != null ? r.v : r.ab) - 60000) kz = x; });
    return { haupt: r.haupt, dauer: rund((t - r.seit) / 1000), drin: rund(r.drin), ab: rund(r.ab), kz: kz,
             fenster: fen, anzahl: Math.max(1, Math.ceil((t - r.seit) / ZEIT.fenster)), zaeh: zaeh,
             ges: [r.ges[0], rund(r.ges[1]), rund(r.ges[2])], uhr: r.uhr, luecke: r.luecke, loaf: r.loaf, inp: r.inp,
             mb: speicherMb(), leute: r.leute, bild: r.bild, teil: r.teil, f: FASSUNG };
  }
  function raumSenden(grund) {
    if (!raum || raum.seit == null) return;
    var t = jetzt();
    if (grund === "hidden") {
      if (t - raum.seit < ZEIT.teil || t - raumZuletzt < ZEIT.zeile) return;
      raum.teil = 1;
    }
    senden("mess-raum", raumBauen());
    raumZuletzt = t;
    /* Nach einer Teilzeile zählt das nächste Mal nur die Zeit seitdem. */
    raum.seit = t; raum.f = {}; raum.ges = [0, 0, 0]; raum.loaf = []; raum.inp = [];
    eigen({ ro: null });
  }
  function hoch(leute, bild) {
    if (!raum) return;
    if (leute > raum.leute) raum.leute = leute;
    if (bild > raum.bild) raum.bild = bild;
  }
  function lageWechsel(lage, t, leute, bild, haupt) {
    if (lage === "verbindet") {
      if (raum && raum.ab != null) raumSenden("wechsel");   /* Raumwechsel ohne „aus" dazwischen */
      raum = neuerRaum(t, haupt);
      return;
    }
    if (lage === "drin") {
      if (!raum) raum = neuerRaum(null, haupt);
      if (raum.ab == null) {
        raum.ab = raum.seit = t;
        raum.drin = raum.v != null ? t - raum.v : null;
        raum.haupt = haupt;
        if (drinAb == null) drinAb = rund(t);
        beobachterAn();
      }
      hoch(leute, bild);
      return;
    }
    if (lage === "aus" || lage === "fehler") {
      if (raum && raum.ab != null) raumSenden("aus");
      raum = null;
      beobachterAus();
      eigen({ ro: null });
    }
  }
  /* =========================================================
     LAUFBUCH — das Absturz-Indiz
     ========================================================= */
  var tab = "", pid = zufall(6), vorher = [], kanal = null, startT0 = Math.round(Date.now() - jetzt());
  try { tab = sessionStorage.getItem("dma-mess-tab") || ""; if (!tab) { tab = zufall(6); sessionStorage.setItem("dma-mess-tab", tab); } } catch (e) { tab = tab || zufall(6); }
  function buch(aendern) {
    var b = lesen("dma-mess-lauf");
    if (!b || typeof b !== "object") b = {};
    if (aendern) aendern(b);
    var ks = Object.keys(b);
    if (ks.length > 6) ks.sort(function (x, y) { return (b[x].z || 0) - (b[y].z || 0); }).slice(0, ks.length - 6).forEach(function (x) { delete b[x]; });
    if (aendern) schreiben("dma-mess-lauf", b);
    return b;
  }
  function eigen(felder) {
    buch(function (b) {
      var e = b[pid] || (b[pid] = { tab: tab, t0: startT0, f: FASSUNG, zu: 0, kz: 0 });
      for (var k in felder) if (Object.prototype.hasOwnProperty.call(felder, k)) e[k] = felder[k];
      e.z = Date.now();
      e.s = sichtbar() ? "v" : "h";
      e.mb = speicherMb();
      e.kz = raum && raum.ab != null ? 1 : 0;
    });
  }
  function offenerRaum() { return raum && raum.seit != null ? raumBauen() : null; }
  function einordnen() {
    var b = buch(), fremd = [], ab = Date.now();
    Object.keys(b).forEach(function (id) { if (id !== pid) fremd.push(id); });
    if (!fremd.length) return;
    var leben = {};
    try {
      if (kanal) {
        kanal.addEventListener("message", function (e) { if (e.data && e.data.lebt) leben[e.data.lebt] = 1; });
        kanal.postMessage({ frage: pid });
      }
    } catch (e) {}
    setTimeout(function () {
      var raus = [], spaet = [];
      buch(function (b2) {
        fremd.forEach(function (id) {
          var e = b2[id];
          if (!e || leben[id]) return;
          if (e.zu === 1) { if (e.ro) spaet.push(e.ro); delete b2[id]; return; }
          var alt = ab - (e.z || 0), tot = e.tab === tab
            || (e.s === "v" && alt > ZEIT.tot)
            || (e.s === "h" && (kanal ? true : alt > 12 * 36e5));
          if (!tot) return;
          raus.push({ ende: e.s === "v" ? "weg" : "hinten", dauer: rund(((e.z || 0) - (e.t0 || 0)) / 1000), vor: rund(alt / 60000),
                      kz: e.kz || 0, mb: e.mb == null ? null : e.mb, f: e.f || "", eigen: e.tab === tab ? 1 : 0,
                      verworfen: e.tab === tab && document.wasDiscarded ? 1 : 0 });
          if (e.ro) spaet.push(e.ro);
          delete b2[id];
        });
      });
      raus.forEach(function (x) { if (vorher.length < 3) vorher.push(x); });
      spaet.slice(0, 2).forEach(function (ro) { ro.spaet = 1; senden("mess-raum", ro); });
    }, ZEIT.ping);
  }
  try {
    if (window.BroadcastChannel) {
      kanal = new BroadcastChannel("dma-mess");
      kanal.addEventListener("message", function (e) { if (e.data && e.data.frage && e.data.frage !== pid) { try { kanal.postMessage({ lebt: pid }); } catch (x) {} } });
    }
  } catch (e) { kanal = null; }
  var abbruch = lesen("dma-mess-abbruch");
  if (abbruch) {
    schreiben("dma-mess-abbruch", null);
    vorher.push({ ende: "laden", ms: rund(abbruch.ms), bild: abbruch.bild ? 1 : 0, s: abbruch.s === "hidden" ? "h" : "v", f: String(abbruch.f || "") });
  }
  einordnen();
  eigen({});
  /* Erst jetzt (das Laufbuch steht) die gepufferten Langläufer und Raumwechsel aus index.html nachspielen – auch die
     Rückkehr in den Raum gleich nach dem Laden zählt so mit. */
  M.lang = lang;
  M.lt.splice(0).forEach(function (x) { lang(x[0], x[1]); });
  M.raumNeu = hoch;
  M.lage = lageWechsel;
  M.lg.splice(0).forEach(function (a) { lageWechsel.apply(null, a); });
  setInterval(function () { if (sichtbar()) eigen({ ro: offenerRaum() }); }, ZEIT.herz);
  document.addEventListener("visibilitychange", function () {
    if (!sichtbar()) raumSenden("hidden");
    eigen({ ro: offenerRaum() });
  });
  window.addEventListener("pagehide", function () { eigen({ zu: 1, ro: offenerRaum() }); });
  window.addEventListener("pageshow", function (e) { if (e.persisted) eigen({ zu: 0 }); });
  document.addEventListener("resume", function () { eigen({}); });

  /* =========================================================
     STARTZEILE
     ========================================================= */
  var lcp = null;
  try {
    if (TYPEN.indexOf("largest-contentful-paint") >= 0) {
      var lcpObs = new PerformanceObserver(function (l) { var e = l.getEntries(); if (e.length) lcp = e[e.length - 1].startTime; });
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
    }
  } catch (e) {}
  function startBauen() {
    var st = window.DMA_STEMPEL || {}, kb = 0, n = 0, cache = 0, eigenHost = location.origin;
    try {
      [nav].concat(P.getEntriesByType("resource")).forEach(function (r) {
        if (!r || !r.name || r.name.indexOf(eigenHost) !== 0 || (r.startTime || 0) >= bereitT) return;
        n++;
        kb += r.transferSize || 0;
        if (!r.transferSize && r.decodedBodySize > 0) cache++;
      });
    } catch (e) {}
    var neu = 0, c = navigator.connection, fcp = null, tipp = {};
    try { neu = sessionStorage.getItem("dma-neu-geladen") === FASSUNG ? 1 : 0; } catch (e) {}
    try { fcp = (P.getEntriesByName("first-contentful-paint")[0] || {}).startTime; } catch (e) {}
    Object.keys(M.tipp).forEach(function (w) { tipp[w] = M.tipp[w].slice(0, 3); });
    var minQ = typeof DMA_Q === "function" && DMA_Q("app.js") !== "app.js";
    return {
      f: FASSUNG, bau: minQ ? (st["min/app.js"] || "?") : "quelle", ua: String(navigator.userAgent || "").slice(0, 120),
      typ: nav.type || "", neu: neu, sw: navigator.serviceWorker && navigator.serviceWorker.controller ? 1 : 0, hinten: M.hinten,
      t: { ttfb: rund(nav.responseStart), fcp: rund(fcp), lcp: rund(lcp), bereit: rund(bereitT), load: rund(nav.loadEventEnd), drinAb: drinAb },
      tipp: tipp, kb: Math.round(kb / 1024), n: n, cache: cache,
      lt: [startLt[0], rund(startLt[1]), rund(startLt[2])],
      teile: [(window.DMA_TEIL_SOFORT || []).length, (window.DMA_TEIL_FEHLER || []).length],
      netz: c ? [c.effectiveType || "", c.rtt == null ? null : c.rtt, c.downlink == null ? null : c.downlink, c.saveData ? 1 : 0] : null,
      ger: [navigator.deviceMemory || null, navigator.hardwareConcurrency || null],
      vorher: vorher.slice(0, 3),
      fehler: fehlerNeu().map(function (s) { fehlerGemeldet[s] = 1; return fehler[s]; }), fehlerMehr: fehlerMehr,
      kosten: [M.kosten == null ? null : M.kosten, Math.round(kostenInit * 10) / 10]
    };
  }
  function startSenden() {
    var i = 0;
    (function versuch() {
      var los = zugang() || i >= ZEIT.warte.length - 1;
      if (!los) { i++; setTimeout(versuch, ZEIT.warte[i] - ZEIT.warte[i - 1]); return; }
      if (zugang()) kisteLeeren();
      fehlerMehrGemeldet = fehlerMehr;
      senden("mess-start", startBauen());
      startRaus = true;
      if (fehlerNeu().length) fehlerPlanen();
      try { if (lcpObs) lcpObs.disconnect(); } catch (e) {}
    })();
  }
  setTimeout(function () { ruhig(startSenden); }, ZEIT.start);

  /* Prüfhaken für die Sonde (pruefe-884-messung.js) */
  M.stand = function () {
    return { tab: tab, pid: pid, buch: buch(), fehler: fehler, fehlerMehr: fehlerMehr, raum: raum ? raumBauen() : null, raumRoh: raum,
             gesendet: gesendet.slice(), kiste: kisteLesen(), tag: tagStand(), vorher: vorher.slice(), zeit: ZEIT, startRaus: startRaus };
  };
  var kostenInit = jetzt() - tInit;
})();
