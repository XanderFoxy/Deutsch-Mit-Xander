#!/usr/bin/env node
/* PRÜFT FASSUNG 889: DAS CHAT-LAGER IN STÜCKEN (Livestream, Vorrang 1).
   ---------------------------------------------------------------
   Bis 888 schrieb jede Sicherung den GANZEN Verlauf als einen Text ins Lager („chat:<raum>"): im Nachbau ein Bild von
   70–170 ms alle ≥ 20 s (das put von 1,7 Mio. Zeichen allein 67 ms bei CPU 4×). Jetzt: Verzeichnis „chatix:<raum>" +
   Stücke „chatst:<Länge>:<raum>:<n>" (je ≤ 600 Zeilen); die Sicherung im Leerlauf schreibt nur, was sich geändert hat,
   Stück für Stück in EINER Transaktion; die sofortige Sicherung schreibt alles in einer Transaktion.
     A  Format: 1 500 Zeilen → Verzeichnis mit 3 Stücken (600/600/300), genau diese 3 im Bereich des Raums, Zeilen gleich.
     N  Nur das Geänderte: 7 000 Zeilen, 1 neue Zeile → im Leerlauf 1 Stück + Verzeichnis, kein put über 200 000 Zeichen;
        450 neue Zeilen → höchstens 3 Stücke; das Lager danach genau der Verlauf.
     Z  Kein langes Bild aus der Sicherung (CPU 4×, 7 000 Zeilen, Profilfotos bei 3 von 30): jede Aufgabe des Hauptfadens,
        in der die Leerlauf-Sicherung lief (Leerlauf-/IndexedDB-Rückruf samt der Mikroaufgaben danach, aus der Chromium-
        Spur), ≤ 16 ms – auch, wenn ein anderer Tab geschrieben hat und darum alles neu geschrieben wird.
     K  Kappen bei 20 000 Zeilen: eine neue Zeile → höchstens 2 Stücke (das erste wird kürzer, das letzte bekommt sie).
     V  Altes Format (888, ein Text) wird gelesen und verlustfrei überführt (sofort und im Leerlauf, dabei verschwindet
        „chat:<raum>"); bricht die Überführung mittendrin ab, steht das alte vollständig da.
     B  Liegen altes und neues Format da (eine offene 888-Seite schrieb nach der Umstellung): beide werden vereinigt,
        keine Zeile doppelt, keine verloren; die nächste Sicherung räumt das alte weg.
     T  Abbruch mitten im Schreiben (kleine Stücke, ~140 Schritte): Tab zu (page.close), Absturz (Page.crash), pagehide –
        danach liegt immer ein vollständiger Stand im Lager (alt oder neu, nie gemischt); nach pagehide der neueste.
     M  Mehrere Tabs: zwei Seiten im selben Raum schreiben abwechselnd (Leerlauf und pagehide) – das Lager ist jedes Mal
        genau der Verlauf dessen, der zuletzt schrieb; zwei Räume („m", „m:1") mischen sich nicht; Aufräumen nimmt
        verwaiste Stücke und mit einem 60 Tage alten Verzeichnis dessen Stücke weg, sonst nichts.
     Q  Speicher voll (Quota über CDP): Schreiben scheitert ohne Fehler, der vorige Stand bleibt vollständig, der
        localStorage-Teil wird geschrieben; ist wieder Platz, geht die nächste Sicherung durch.
     F  localStorage-Teil und Fototafel aus der Leerlauf-Sicherung Byte für Byte wie aus der sofortigen; die Zeilen im
        Lager gleich.
     L  Laden beim Betreten nicht langsamer: 7 000 Zeilen im neuen Format lesen gegen dieselben im alten Format (CPU 4×,
        abwechselnd, Median aus 9; eigenes Profil, das Lager auf der Platte wie auf einem Gerät).
   Gegenprobe: WURZEL=/tmp/claude-0/v888 (Fassung 888) → A N K V1 V2 B T M Q F(Zeilen) L(Format) rot (34 Prüfungen).
   (Z maß zuerst nur die Rückrufe selbst und war damit auf 888 grün: 888 legt den Text in einem .then NACH dem
   Leerlauf-Rückruf ins Lager – das sieht nur die ganze Aufgabe. Jetzt aus der Spur, siehe Ergebnis der Gegenprobe.) */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
const NUR = (process.env.NUR || "ANZUSKVBTMQFL").split("");
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : null; };

/* Vor dem Seitencode: Leerlauf- und IndexedDB-Rückrufe aus livechat.js messen, puts ins Chat-Lager mitschreiben */
function messen() {
  window.__m = { an: false, dauer: [], puts: [] };
  const vonChat = () => /livechat/.test(new Error().stack || "");
  const ric = window.requestIdleCallback;
  if (ric) window.requestIdleCallback = function (f, o) {
    const chat = vonChat();
    return ric.call(window, function (d) { const rest = d && typeof d.timeRemaining === "function" ? d.timeRemaining() : null, zeitlimit = Boolean(d && d.didTimeout);
      const t = performance.now(); try { return f(d); } finally { if (chat && window.__m.an) window.__m.dauer.push(["leerlauf", performance.now() - t, t, rest, zeitlimit]); } }, o);
  };
  const huellen = (proto, namen) => namen.forEach((p) => {
    const d = Object.getOwnPropertyDescriptor(proto, p);
    if (!d || !d.set) return;
    Object.defineProperty(proto, p, { configurable: true, enumerable: d.enumerable, get: d.get, set(f) {
      if (typeof f !== "function" || !vonChat()) return d.set.call(this, f);
      d.set.call(this, function (e) { const t = performance.now(); try { return f.call(this, e); } finally { if (window.__m.an) window.__m.dauer.push(["idb-" + p, performance.now() - t, t]); } });
    } });
  });
  huellen(IDBRequest.prototype, ["onsuccess", "onerror"]);
  huellen(IDBTransaction.prototype, ["oncomplete", "onabort", "onerror"]);
  const put = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (v) {
    if (window.__m.an && v && typeof v.id === "string" && /^chat(ix|st)?:/.test(v.id)) window.__m.puts.push([v.id, typeof v.daten === "string" ? v.daten.length : JSON.stringify(v.daten).length]);
    if (window.__m.wirf && v && typeof v.id === "string" && v.id.indexOf("chatst:") === 0 && --window.__m.wirf === 0) throw new DOMException("Nachgestellt: kein Platz", "QuotaExceededError");
    /* eine Anfrage, die erst später scheitert (wie ein voller Speicher beim Schreiben): derselbe Schlüssel zweimal mit add */
    if (window.__m.fehl && v && typeof v.id === "string" && v.id.indexOf("chatst:") === 0 && --window.__m.fehl === 0) { put.apply(this, arguments); return this.add(v); }
    return put.apply(this, arguments);
  };
}
/* In der Seite: Zeilen bauen, Lager roh lesen/schreiben */
function helfer() {
  window.__foto = (seed, groesse) => { let s = "data:image/png;base64,iVBORw0KGgo"; let x = seed * 7919; const z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    while (s.length < groesse) { x = (x * 1103515245 + 12345) % 2147483648; s += z[x % 64]; } return s; };
  window.__zeilen = (n, wo, ab, fotos) => { const l = [], t0 = Date.now() - 1e9; for (let i = 0; i < n; i++) { const a = i % 30;
    l.push({ id: wo + (ab + i), von: "p" + a, name: "Schüler" + a, art: "text", text: "Hallo zusammen, " + wo + " Zeile " + (ab + i) + (i % 7 ? "" : " lang ".repeat(20)), zeit: t0 + (ab + i) * 1000, bild: fotos && a < 3 ? fotos[a] : (a % 2 ? "emoji:🦊" : "") }); } return l; };
  window.__db = () => new Promise((ok) => { const a = indexedDB.open("dma_klassenzimmer", 1);
    a.onupgradeneeded = () => { const f = a.result.createObjectStore("bilder", { keyPath: "id" }); f.createIndex("zeit", "zeit"); };
    a.onsuccess = () => ok(a.result); a.onerror = () => ok(null); });
  /* der Verlauf eines Raums im Lager, gleich welches Format; dazu, was im Bereich des Raums liegt */
  window.__roh = async (raum) => { const db = await window.__db(); return new Promise((ok) => { try {
    const t = db.transaction("bilder", "readonly"), f = t.objectStore("bilder"), o = {}, v = "chatst:" + raum.length + ":" + raum + ":";
    f.get("chatix:" + raum).onsuccess = (e) => { o.ix = e.target.result || null; };
    f.get("chat:" + raum).onsuccess = (e) => { o.alt = e.target.result || null; };
    f.getAll(IDBKeyRange.bound(v, v + "\uffff")).onsuccess = (e) => { o.st = e.target.result || []; };
    t.oncomplete = () => { const r = { index: o.ix ? o.ix.daten : null, alt: o.alt ? JSON.parse(o.alt.daten) : null, bereich: o.st.map((x) => x.id.slice(v.length)), zeilen: null, fehlt: [] };
      if (r.index) { const je = {}; o.st.forEach((x) => { je[x.id.slice(v.length)] = x.daten; }); r.zeilen = []; r.texte = [];
        for (const e of r.index.stuecke) { const d = je[String(e[0])]; if (typeof d !== "string") { r.fehlt.push(e[0]); continue; } r.texte.push(d); r.zeilen = r.zeilen.concat(JSON.parse(d)); } }
      ok(r); };
  } catch (e) { ok({ fehler: String(e) }); } }); };
  window.__legen = async (eintraege) => { const db = await window.__db(); return new Promise((ok) => { const t = db.transaction("bilder", "readwrite"), f = t.objectStore("bilder");
    eintraege.forEach((e) => { if (e.weg) f.delete(e.weg); else f.put(e); }); t.oncomplete = () => ok(true); t.onerror = t.onabort = () => ok(false); }); };
  window.__ids = (l) => (l || []).map((n) => n.id).join(",");
  window.__fertig = async (raum, ms) => { const bis = Date.now() + (ms || 30000);
    while (Date.now() < bis) { const s = LiveChat.pruefSichernStand(), l = LiveChat.pruefLager ? LiveChat.pruefLager(raum) : { unterwegs: null };
      if (!s.schmutzig && !s.geplant && !s.laeuft && !l.unterwegs) break; await new Promise((r) => setTimeout(r, 40)); }
    await new Promise((r) => setTimeout(r, LiveChat.pruefLager ? 60 : 600)); };
}
function server() {
  return new Promise((ok) => {
    const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
      if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0, () => ok(srv));
  });
}
(async () => {
  const srv = await server();
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const wachhund = setTimeout(() => { console.log("\n  FEHL Sonde hing (15 min) – abgebrochen"); process.exit(3); }, 15 * 60000);
  async function kontext() {
    const c = await br.newContext({ viewport: { width: 390, height: 780 }, serviceWorkers: "block" });
    await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await c.addInitScript(messen);
    await c.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
    return c;
  }
  const ctx = await kontext();
  const seitenFehler = [];
  async function seite(c) {
    const p = await (c || ctx).newPage();
    p.on("pageerror", (e) => seitenFehler.push(String(e.message || e).slice(0, 160)));
    await p.goto(adresse, { waitUntil: "domcontentloaded" });
    await p.waitForFunction(() => window.LiveChat && LiveChat.pruefVerlaufSetzen, null, { timeout: 60000 });
    await p.waitForTimeout(1200);
    await p.evaluate(helfer);
    return p;
  }
  let pg = await seite();
  const neu = await pg.evaluate(() => typeof LiveChat.pruefLager === "function");
  console.log("\n  Baum " + WURZEL + (neu ? "" : "   (ohne pruefLager – Fassung vor 889)"));
  let fehler = 0;
  const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  const hat = (t) => NUR.includes(t);

  if (hat("A")) {
    console.log("\n  A  Format: Verzeichnis und Stücke");
    const r = await pg.evaluate(async () => {
      const raum = "l-a"; LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      const l = window.__zeilen(1500, "A", 0, null);
      LiveChat.pruefVerlaufSetzen(l);
      await new Promise((f) => setTimeout(f, 400));
      const roh = await window.__roh(raum);
      const gelesen = await LiveChat.pruefVerlaufAusLager(raum);
      return { index: roh.index, bereich: roh.bereich, gleich: window.__ids(roh.zeilen) === window.__ids(l), alt: Boolean(roh.alt), gelesen: window.__ids(gelesen) === window.__ids(l), n: gelesen.length };
    });
    const st = r.index && r.index.stuecke ? r.index.stuecke.map((e) => e[1]) : null;
    ok(st && st.join(",") === "600,600,300", "1 500 Zeilen → Verzeichnis „chatix:“ mit 3 Stücken 600/600/300", JSON.stringify(st));
    ok(r.bereich.length === 3 && r.index && r.bereich.slice().sort().join() === r.index.stuecke.map((e) => String(e[0])).sort().join(), "im Bereich des Raums genau diese 3 Stücke", JSON.stringify(r.bereich));
    ok(r.gleich && !r.alt, "Zeilen im Lager = Verlauf, kein „chat:<raum>“ mehr", "gleich " + r.gleich + ", alt " + r.alt);
    ok(r.gelesen, "pruefVerlaufAusLager liefert genau den Verlauf", r.n + " Zeilen");
  }

  if (hat("N")) {
    console.log("\n  N  Nur das Geänderte (Leerlauf)");
    const r = await pg.evaluate(async () => {
      const raum = "l-n"; LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      const l = window.__zeilen(7000, "N", 0, null);
      LiveChat.pruefVerlaufSetzen(l);
      await window.__fertig(raum);
      const abstand = LiveChat.pruefSichernAbstand(); LiveChat.pruefSichernAbstand(0);
      window.__m.puts = []; window.__m.an = true;
      LiveChat.pruefAnhaengen({ id: "N-neu", von: "p1", name: "Bea", art: "text", text: "eine neue Zeile", zeit: Date.now() });
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum);
      const eins = window.__m.puts.slice();
      window.__m.puts = [];
      for (let i = 0; i < 450; i++) LiveChat.pruefAnhaengen({ id: "N-viel" + i, von: "p2", name: "Cem", art: "text", text: "viele " + i, zeit: Date.now() + i });
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum);
      const viele = window.__m.puts.slice();
      /* eine Zeile mitten im Verlauf wird an Ort und Stelle geändert (wie z. B. das Nachtragen des Profilfotos an allen
         Zeilen eines Autors) – gleiche Länge, damit nur der Inhalt sie verrät */
      window.__m.puts = [];
      const mitte = LiveChat.lage().nachrichten[3501];
      const vorText = mitte.text; mitte.text = vorText.replace(/\d$/, (d) => String((Number(d) + 1) % 10));
      LiveChat.pruefAnhaengen({ id: "N-nach", von: "p3", name: "Dora", art: "text", text: "danach", zeit: Date.now() + 1000 });
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum);
      const geaendert = window.__m.puts.slice();
      const rohMitte = await window.__roh(raum);
      const mitteImLager = (rohMitte.zeilen || []).find((n) => n.id === mitte.id);
      window.__m.an = false;
      LiveChat.pruefSichernAbstand(abstand);
      const roh = await window.__roh(raum);
      const soll = LiveChat.lage().nachrichten;
      return { eins, viele, geaendert, mitte: { vorher: vorText, jetzt: mitte.text, lager: mitteImLager ? mitteImLager.text : null }, gleich: window.__ids(roh.zeilen) === window.__ids(soll), n: roh.zeilen ? roh.zeilen.length : -1, sollN: soll.length, fehlt: roh.fehlt, letzte: LiveChat.pruefLager ? LiveChat.pruefLager(raum).letzte.slice(-2) : null };
    });
    const stueckPuts = (p) => p.filter((x) => x[0].indexOf("chatst:") === 0);
    const groesste = (p) => Math.max(0, ...p.map((x) => x[1]));
    ok(stueckPuts(r.eins).length === 1 && r.eins.filter((x) => x[0].indexOf("chatix:") === 0).length === 1, "1 neue Zeile → 1 Stück + Verzeichnis geschrieben", JSON.stringify(r.eins.map((x) => x[0].replace(/^chatst:\d+:/, "st:") + "=" + x[1])));
    ok(r.eins.length > 0 && groesste(r.eins) < 200000, "kein put über 200 000 Zeichen", "größtes " + groesste(r.eins) + " Zeichen (888: der ganze Verlauf)");
    ok(stueckPuts(r.viele).length >= 1 && stueckPuts(r.viele).length <= 3 && groesste(r.viele) < 200000, "450 neue Zeilen → höchstens 3 Stücke", stueckPuts(r.viele).length + " Stücke, größtes " + groesste(r.viele));
    ok(stueckPuts(r.geaendert).length === 2 && r.mitte.lager === r.mitte.jetzt && r.mitte.jetzt !== r.mitte.vorher && r.mitte.jetzt.length === r.mitte.vorher.length,
       "Zeile mitten im Verlauf an Ort und Stelle geändert (gleiche Länge) → ihr Stück und das letzte geschrieben, Lager hat die Änderung",
       stueckPuts(r.geaendert).length + " Stücke, „" + r.mitte.vorher + "“ → „" + r.mitte.lager + "“");
    ok(r.gleich && r.fehlt.length === 0, "das Lager ist danach genau der Verlauf", r.n + " / " + r.sollN + " Zeilen" + (r.letzte ? ", Schreiben " + JSON.stringify(r.letzte) : ""));
  }

  if (hat("Z")) {
    console.log("\n  Z  Kein langes Bild aus der Sicherung (CPU 4×, 7 000 Zeilen, Profilfotos 3/30)");
    const cdp = await ctx.newCDPSession(pg);
    await pg.evaluate(async () => {
      const raum = "l-z"; LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      const fotos = [window.__foto(1, 16000), window.__foto(2, 16000), window.__foto(3, 16000)];
      LiveChat.pruefVerlaufSetzen(window.__zeilen(7000, "Z", 0, fotos));
      await window.__fertig(raum);
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    /* Die Rückrufe allein sehen nicht, was danach in DERSELBEN Aufgabe als Mikroaufgabe läuft (888 legt den ganzen Text
       in einem .then nach dem Leerlauf-Rückruf ins Lager). Darum zählt je Schritt die ganze Aufgabe aus der Chromium-Spur. */
    await br.startTracing(pg, { categories: ["toplevel", "blink.user_timing"] });
    const marke = await pg.evaluate(() => { performance.mark("p889:z"); return performance.getEntriesByName("p889:z")[0].startTime; });
    const runde = (fremd) => pg.evaluate(async (fremd) => {
      const raum = "l-z";
      if (fremd) {   /* ein anderer Tab hat geschrieben: Stand im Verzeichnis ändern → die nächste Sicherung schreibt alles */
        const db = await window.__db(); await new Promise((ok) => { const t = db.transaction("bilder", "readwrite"), f = t.objectStore("bilder");
          const g = f.get("chatix:" + raum); g.onsuccess = () => { if (g.result) { g.result.daten.stand = "fremd-" + Date.now(); f.put(g.result); } }; t.oncomplete = () => ok(); t.onabort = () => ok(); });
      }
      const abstand = LiveChat.pruefSichernAbstand(); LiveChat.pruefSichernAbstand(0);
      window.__m.dauer = []; window.__m.puts = []; window.__m.an = true;
      const t0 = performance.now();
      LiveChat.pruefAnhaengen({ id: "Z-" + Date.now(), von: "p1", name: "Bea", art: "text", text: "Messzeile", zeit: Date.now() });
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum, 60000);
      window.__m.an = false;
      LiveChat.pruefSichernAbstand(abstand);
      const d = window.__m.dauer.map((x) => x[1]);
      const groesst = window.__m.dauer.slice().sort((a, b) => b[1] - a[1]).slice(0, 4).map((x) => x[0] + " " + x[1].toFixed(1));
      return { roh: window.__m.dauer.slice(), max: Math.max(0, ...d), summe: d.reduce((a, b) => a + b, 0), schritte: d.length, groesst, dauer: performance.now() - t0, puts: window.__m.puts.length,
               letzte: LiveChat.pruefLager ? LiveChat.pruefLager(raum).letzte.slice(-1)[0] : null };
    }, fremd);
    const a = await runde(false), b = await runde(true), c = await runde(false);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    const spur = JSON.parse(String(await br.stopTracing()));
    const ev = spur.traceEvents || spur;
    const mk = ev.find((e) => e.name === "p889:z" && /user_timing/.test(e.cat || ""));
    let tid = null;
    ev.forEach((e) => { if (mk && e.ph === "M" && e.name === "thread_name" && e.pid === mk.pid && e.args && e.args.name === "CrRendererMain") tid = e.tid; });
    const oben = []; let bis = -1;
    ev.filter((e) => mk && e.ph === "X" && e.pid === mk.pid && e.tid === tid && /RunTask/.test(e.name || "") && e.dur != null).sort((x, y) => x.ts - y.ts).forEach((e) => { if (e.ts >= bis) { oben.push(e); bis = e.ts + e.dur; } });
    const versatz = mk ? mk.ts - marke * 1000 : null;
    const ganz = (x) => { const m = new Map(); (x.roh || []).forEach((st) => { const tt = (st[2] + st[1] / 2) * 1000 + versatz; const f = oben.find((e) => e.ts <= tt && e.ts + e.dur >= tt); if (f) m.set(f, f.dur / 1000); });
      x.aufgaben = [...m.values()]; x.maxAufgabe = x.aufgaben.length ? Math.max(...x.aufgaben) : -1; return x; };
    [a, b, c].forEach(ganz);
    const zeig = (x) => "längste Aufgabe " + x.maxAufgabe.toFixed(1) + " ms (" + x.aufgaben.length + " Aufgaben, zusammen " + Math.round(x.aufgaben.reduce((p, q) => p + q, 0)) + " ms); Rückrufe: längster " + x.max.toFixed(1) + " ms, " + x.schritte + ", puts " + x.puts + (x.letzte ? " " + JSON.stringify(x.letzte) : "");
    ok(versatz != null && oben.length > 0, "Chromium-Spur gelesen (Aufgaben des Hauptfadens)", oben.length + " Aufgaben");
    ok(a.aufgaben.length > 0 && a.maxAufgabe <= 16, "eine neue Zeile: jede Aufgabe der Sicherung ≤ 16 ms", zeig(a));
    ok(b.aufgaben.length > 0 && b.maxAufgabe <= 16 && (!b.letzte || b.letzte[1] === true), "anderer Tab hat geschrieben → alles neu, trotzdem jede Aufgabe ≤ 16 ms", zeig(b));
    ok(c.aufgaben.length > 0 && c.maxAufgabe <= 16, "danach wieder nur das Geänderte, jede Aufgabe ≤ 16 ms", zeig(c));
  }

  if (hat("U")) {
    console.log("\n  U  Hauptfaden voll ausgelastet (CPU 4×, je Bild 20 ms belegt, 2 000 Zeilen): die Sicherung kommt trotzdem voran");
    /* NACHGEBESSERT (Prüfung 889, Runde 1): ohne Leerlaufpause springt requestIdleCallback nur über sein Zeitlimit (2 s)
       an, timeRemaining() ist 0. 889 machte dann je Rückruf EINEN Happen (50 Zeilen): 93,8 s bis ins Lager, 45 Rückrufe;
       888 16,2 s, 9 Rückrufe (400 Zeilen je Rückruf). */
    const P = await seite();
    const cdp = await ctx.newCDPSession(P);
    await P.evaluate(async () => { const raum = "l-u"; LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      LiveChat.pruefVerlaufSetzen(window.__zeilen(2000, "U", 0, null)); await window.__fertig(raum); });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const r = await P.evaluate(async () => {
      const raum = "l-u", GRENZE = 60000;
      const abstand = LiveChat.pruefSichernAbstand(); LiveChat.pruefSichernAbstand(0);
      let an = true;
      const brennen = () => { if (!an) return; const t = performance.now(); while (performance.now() - t < 20) {} requestAnimationFrame(brennen); };
      requestAnimationFrame(brennen);
      await new Promise((f) => setTimeout(f, 300));
      window.__m.dauer = []; window.__m.an = true;
      const t0 = performance.now();
      LiveChat.pruefAnhaengen({ id: "U-neu", von: "p1", name: "Bea", art: "text", text: "neu unter Last", zeit: Date.now() });
      let fertig = -1;
      await new Promise((f) => setTimeout(f, 200));
      while (performance.now() - t0 < GRENZE) {
        const s = LiveChat.pruefSichernStand(), l = LiveChat.pruefLager ? LiveChat.pruefLager(raum) : { unterwegs: null };
        if (!s.schmutzig && !s.geplant && !s.laeuft && !l.unterwegs) { fertig = performance.now() - t0; break; }
        await new Promise((f) => setTimeout(f, 100));
      }
      window.__m.an = false; an = false;
      LiveChat.pruefSichernAbstand(abstand);
      const leer = window.__m.dauer.filter((x) => x[0] === "leerlauf");
      const roh = await window.__roh(raum), ls = JSON.parse(localStorage.getItem("dma_livechat_chat_" + raum) || "[]");
      const zeilen = roh.zeilen || roh.alt || [];
      return { fertig: Math.round(fertig), grenze: GRENZE, rueckrufe: leer.length, ohneRest: leer.filter((x) => x[3] === 0).length, zeitlimit: leer.filter((x) => x[4]).length,
               laengster: Math.max(0, ...leer.map((x) => x[1])), lagerN: zeilen.length, lagerLetzte: (zeilen.slice(-1)[0] || {}).id, lsN: ls.length, lsLetzte: (ls.slice(-1)[0] || {}).id };
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    await P.close();
    ok(r.rueckrufe > 0 && r.ohneRest >= r.rueckrufe * 0.8, "nachgestellt: kein Leerlauf (timeRemaining 0)", "bei " + r.ohneRest + " von " + r.rueckrufe + " Leerlauf-Rückrufen, über das Zeitlimit " + r.zeitlimit);
    ok(r.fertig > 0 && r.fertig <= 40000 && r.lagerN === 2001 && r.lagerLetzte === "U-neu" && r.lsN === 300 && r.lsLetzte === "U-neu",
       "die neue Zeile ist nach ≤ 40 s im Lager und im localStorage (888: 16,2 s; 889 vor der Nachbesserung 93,8 s)",
       (r.fertig < 0 ? "nach " + r.grenze / 1000 + " s noch nicht fertig" : r.fertig + " ms") + ", Lager " + r.lagerN + " (" + r.lagerLetzte + "), localStorage " + r.lsN + " (" + r.lsLetzte + ")");
    ok(r.rueckrufe > 0 && r.rueckrufe <= 20, "höchstens 20 Leerlauf-Rückrufe für 2 000 Zeilen (je Rückruf das Budget, nicht nur ein Happen)", r.rueckrufe + " Rückrufe");
    ok(r.laengster <= 16, "trotzdem jeder Rückruf ≤ 16 ms", "längster " + r.laengster.toFixed(1) + " ms");
  }

  if (hat("S")) {
    console.log("\n  S  Arbeitsspeicher: der Stand eines verlassenen Raums wird freigegeben (20 000 Zeilen)");
    /* NACHGEBESSERT (Prüfung 889, Runde 1): lagerStand hielt den Text aller Stücke JEDES besuchten Raums für immer
       (bei 20 000 Zeilen rund 6 MB mehr als 888). Im Raum braucht es ihn (nur das Geänderte schreiben), danach nicht. */
    const P = await seite();
    const cdp = await ctx.newCDPSession(P);
    const heap = async () => { await cdp.send("HeapProfiler.collectGarbage"); await cdp.send("HeapProfiler.collectGarbage"); return (await cdp.send("Runtime.getHeapUsage")).usedSize / 1048576; };
    const stand = (raum) => P.evaluate((raum) => LiveChat.pruefLager ? LiveChat.pruefLager(raum).stuecke !== null : null, raum);
    /* Aufwärmen (derselbe Weg einmal mit einem anderen Raum: übersetzter Code, Rückrufe), dann der Ausgangsstand. Nach dem
       Wechsel kommt im neuen Raum eine Zeile: erst dann gibt das Kennungs-Verzeichnis (kennungSchonDa, seit 887) die alte
       Liste frei – das war schon in 888 so und gilt hier für beide Messungen gleich. */
    const zyklus = async (raum, wo) => P.evaluate(async ({ raum, wo }) => {
      LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      LiveChat.pruefVerlaufSetzen(window.__zeilen(20000, wo, 0, null)); await window.__fertig(raum);
      const abstand = LiveChat.pruefSichernAbstand(); LiveChat.pruefSichernAbstand(0);
      LiveChat.pruefAnhaengen({ id: wo + "-neu", von: "p1", name: "Bea", art: "text", text: "neu", zeit: Date.now() });
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum);
      LiveChat.pruefSichernAbstand(abstand);
    }, { raum, wo });
    const hinaus = async (wo) => P.evaluate(async (wo) => {
      LiveChat.pruefRaum("l-s-leer"); await LiveChat.pruefVerlaufAusLager("l-s-leer"); LiveChat.pruefVerlaufSetzen([]); await window.__fertig("l-s-leer");
      LiveChat.pruefAnhaengen({ id: "leer-" + wo + "-" + Date.now(), von: "p2", name: "Cem", art: "text", text: "im anderen Raum", zeit: Date.now() });
      await window.__fertig("l-s-leer");
    }, wo);
    await zyklus("l-s-warm", "W"); await hinaus("W");
    const vorher = await heap();
    await zyklus("l-s", "S");
    const drin = await heap(), standDrin = await stand("l-s");
    /* Raum verlassen: anderer Raum, dessen (leerer) Verlauf, eine Zeile dort */
    await hinaus("S");
    const weg = await heap(), standWeg = await stand("l-s");
    /* ein später Rückläufer: das Lager des verlassenen Raums wird gelesen, während man woanders ist */
    const spaet = await P.evaluate(async () => { const g = await LiveChat.pruefVerlaufAusLager("l-s"); return { n: g.length, letzte: (g.slice(-1)[0] || {}).id }; });
    const standSpaet = await stand("l-s");
    /* zurück, eine Zeile, und gleich wieder hinaus, während das Schreiben noch läuft */
    const raus = await P.evaluate(async () => {
      LiveChat.pruefRaum("l-s"); const g = await LiveChat.pruefVerlaufAusLager("l-s"); LiveChat.pruefVerlaufSetzen(g); await window.__fertig("l-s");
      LiveChat.pruefAnhaengen({ id: "S-raus", von: "p1", name: "Bea", art: "text", text: "kurz vor dem Gehen", zeit: Date.now() });
      LiveChat.pruefRaum("l-s-leer");   // sichert sofort (Raumwechsel), das Schreiben endet erst nach dem Wechsel
      const unterwegs = LiveChat.pruefLager ? LiveChat.pruefLager("l-s").unterwegs : null;
      LiveChat.pruefVerlaufSetzen([]); await window.__fertig("l-s-leer"); await new Promise((f) => setTimeout(f, 200));
      LiveChat.pruefAnhaengen({ id: "leer-raus", von: "p2", name: "Cem", art: "text", text: "im anderen Raum", zeit: Date.now() });
      await window.__fertig("l-s-leer");
      const roh = await window.__roh("l-s"), z = roh.zeilen || roh.alt || [];
      return { unterwegs, n: z.length, letzte: (z.slice(-1)[0] || {}).id, stand: LiveChat.pruefLager ? LiveChat.pruefLager("l-s").stuecke !== null : null };
    });
    const zurueck = await heap();
    await P.close();
    const mb = (x) => (x >= 0 ? "+" : "") + x.toFixed(1) + " MB";
    if (standDrin !== null) ok(standDrin === true, "im Raum: der Stand (Text der Stücke) ist da – die nächste Sicherung schreibt nur das Geänderte");
    if (standWeg !== null) ok(standWeg === false && standSpaet === false && raus.stand === false, "verlassen: der Stand ist weg – auch nach einem späten Lesen und nach einem Schreiben, das erst nach dem Wechsel endet",
       "nach dem Wechsel " + standWeg + ", nach spätem Lesen " + standSpaet + ", Schreiben beim Gehen (" + raus.unterwegs + ") " + raus.stand);
    ok(spaet.n === 20000 && spaet.letzte === "S-neu" && raus.n === 20000 && raus.letzte === "S-raus", "das Lager des verlassenen Raums ist vollständig (die Zeile kurz vor dem Gehen drin)",
       "gelesen " + spaet.n + " (" + spaet.letzte + "), nach dem zweiten Gehen " + raus.n + " (" + raus.letzte + ")");
    ok(weg - vorher <= 2 && zurueck - vorher <= 2, "Arbeitsspeicher nach dem Verlassen wieder wie vorher (≤ 2 MB darüber)",
       "im Raum " + mb(drin - vorher) + ", nach dem Verlassen " + mb(weg - vorher) + ", nach Wiederkommen und Gehen " + mb(zurueck - vorher) + " (Heap nach GC, vorher " + vorher.toFixed(1) + " MB)");
  }

  if (hat("K")) {
    console.log("\n  K  Kappen bei 20 000 Zeilen");
    const r = await pg.evaluate(async () => {
      const raum = "l-k"; LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      LiveChat.pruefVerlaufSetzen(window.__zeilen(20000, "K", 0, null));
      await window.__fertig(raum);
      const abstand = LiveChat.pruefSichernAbstand(); LiveChat.pruefSichernAbstand(0);
      const o = { runden: [] };
      for (let k = 0; k < 2; k++) {
        window.__m.puts = []; window.__m.an = true;
        LiveChat.pruefAnhaengen({ id: "K-neu" + k, von: "p1", name: "Bea", art: "text", text: "neu " + k, zeit: Date.now() + k });
        await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum);
        window.__m.an = false;
        o.runden.push(window.__m.puts.filter((x) => x[0].indexOf("chatst:") === 0).length);
      }
      LiveChat.pruefSichernAbstand(abstand);
      const roh = await window.__roh(raum), soll = LiveChat.lage().nachrichten;
      o.n = roh.zeilen ? roh.zeilen.length : -1; o.erste = roh.zeilen && roh.zeilen[0] ? roh.zeilen[0].id : null; o.letzte = roh.zeilen ? roh.zeilen.slice(-1)[0].id : null;
      o.gleich = window.__ids(roh.zeilen) === window.__ids(soll); o.stuecke = roh.index ? roh.index.stuecke.length : 0;
      return o;
    });
    ok(r.runden.every((n) => n >= 1 && n <= 2), "je neue Zeile höchstens 2 Stücke geschrieben", JSON.stringify(r.runden));
    ok(r.n === 20000 && r.erste === "K2" && r.letzte === "K-neu1" && r.gleich, "Lager = die jüngsten 20 000 Zeilen", r.n + " Zeilen, " + r.erste + " … " + r.letzte + ", " + r.stuecke + " Stücke");
  }

  if (hat("V")) {
    console.log("\n  V  Altes Format (888) lesen und verlustfrei überführen");
    const altLegenText = `async (raum, n) => { const foto = window.__foto(7, 12000); const l = window.__zeilen(n, raum + "-", 0, [foto, foto, foto]);
        await window.__legen([{ id: "chat:" + raum, raum, daten: JSON.stringify(l), zeit: Date.now() }]);
        localStorage.setItem("dma_livechat_chat_" + raum, JSON.stringify(l.slice(-300))); return l; }`;
    /* V2 auf einer frischen Seite (leerer Verlauf im Arbeitsspeicher, wie nach dem Laden): im Leerlauf überführt */
    const P2 = await seite();
    const v2 = await P2.evaluate(async (alt) => {
      const altLegen = eval(alt);
      const l2 = await altLegen("l-v2", 3000);
      LiveChat.pruefSichernAbstand(0);
      LiveChat.pruefRaum("l-v2");
      const zeilen2 = await LiveChat.pruefVerlaufAusLager("l-v2");
      LiveChat.pruefVerlaufFensterAuf();
      LiveChat.pruefEmpfangen({ art: "verlauf", von: "lager-nachbau", name: "Lager", zeilen: zeilen2 });
      LiveChat.pruefVerlaufFensterZu();
      LiveChat.pruefAnhaengen({ id: "v2-neu", von: "p1", name: "Bea", art: "text", text: "neu", zeit: Date.now() });
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig("l-v2");
      const r2 = await window.__roh("l-v2");
      return { index: Boolean(r2.index), alt: Boolean(r2.alt), n: r2.zeilen ? r2.zeilen.length : -1, gleich: window.__ids(r2.zeilen) === window.__ids(l2.concat([{ id: "v2-neu" }])), fehlt: r2.fehlt.length,
               art: LiveChat.pruefLager ? LiveChat.pruefLager("l-v2").letzte.slice(-1)[0] : null };
    }, altLegenText);
    await P2.close();
    const r = await pg.evaluate(async (alt) => {
      const o = {};
      const foto = window.__foto(7, 12000);
      const altLegen = eval(alt);
      /* V1: sofort überführt */
      const l1 = await altLegen("l-v1", 3000);
      LiveChat.pruefRaum("l-v1");
      const g1 = await LiveChat.pruefVerlaufAusLager("l-v1");
      o.v1gelesen = g1.length === 3000 && window.__ids(g1) === window.__ids(l1) && g1.filter((n) => n.bild === foto).length === 300;
      LiveChat.pruefVerlaufSetzen(g1); await window.__fertig("l-v1");
      const r1 = await window.__roh("l-v1");
      o.v1 = { index: Boolean(r1.index), alt: Boolean(r1.alt), gleich: window.__ids(r1.zeilen) === window.__ids(l1), fehlt: r1.fehlt.length };
      const w1 = await LiveChat.pruefVerlaufAusLager("l-v1");
      o.v1wieder = w1.length === 3000 && w1.filter((n) => n.bild === foto).length === 300;
      /* V3: Überführung bricht beim 3. Stück ab (nachgestellt: kein Platz) → das Alte steht vollständig da */
      const l3 = await altLegen("l-v3", 3000);
      LiveChat.pruefRaum("l-v3");
      const g3 = await LiveChat.pruefVerlaufAusLager("l-v3");
      window.__m.wirf = 3;
      let wurf = "";
      try { LiveChat.pruefVerlaufSetzen(g3); } catch (e) { wurf = String(e); }
      await new Promise((f) => setTimeout(f, 400));
      window.__m.wirf = 0;
      const r3 = await window.__roh("l-v3");
      o.v3 = { wurf, index: Boolean(r3.index), bereich: r3.bereich.length, alt: r3.alt ? r3.alt.length : 0, gleich: window.__ids(r3.alt) === window.__ids(l3) };
      const g3b = await LiveChat.pruefVerlaufAusLager("l-v3");
      o.v3gelesen = g3b.length;
      return o;
    }, altLegenText);
    r.v2 = v2;
    ok(r.v1gelesen, "V1  3 000 Zeilen im alten Format gelesen (mit Fotos in der Zeile)");
    ok(r.v1.index && !r.v1.alt && r.v1.gleich && r.v1.fehlt === 0, "V1  sofort gesichert: neues Format, „chat:<raum>“ weg, alle Zeilen gleich", JSON.stringify(r.v1));
    ok(r.v1wieder, "V1  wieder gelesen: 3 000 Zeilen, Fotos da");
    ok(r.v2.index && !r.v2.alt && r.v2.n === 3001 && r.v2.gleich && r.v2.fehlt === 0 && (!r.v2.art || r.v2.art[0] === "geprueft"), "V2  im Leerlauf überführt: neues Format, altes weg, 3 001 Zeilen in Reihenfolge", JSON.stringify(r.v2));
    ok(!r.v3.wurf && !r.v3.index && r.v3.bereich === 0 && r.v3.alt === 3000 && r.v3.gleich && r.v3gelesen === 3000, "V3  Abbruch beim 3. Stück: kein Teil des neuen Formats, das alte vollständig (3 000), lesbar", JSON.stringify(r.v3) + ", gelesen " + r.v3gelesen);
  }

  if (hat("B")) {
    console.log("\n  B  Altes und neues Format zugleich (888-Seite schrieb nach der Umstellung)");
    const r = await pg.evaluate(async () => {
      const raum = "l-b"; LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      const l = window.__zeilen(2000, "B", 0, null);
      LiveChat.pruefVerlaufSetzen(l); await window.__fertig(raum);
      /* die 888-Seite kannte nur die kurze Liste (300) und hat zwei Zeilen dazubekommen */
      const kurz = l.slice(-300).concat([{ id: "alt-neu-1", von: "p9", name: "Ida", art: "text", text: "aus 888 (1)", zeit: l[1999].zeit + 10 },
                                         { id: "alt-neu-2", von: "p9", name: "Ida", art: "text", text: "aus 888 (2)", zeit: l[1999].zeit + 20 }]);
      await window.__legen([{ id: "chat:" + raum, raum, daten: JSON.stringify(kurz), zeit: Date.now() }]);
      LiveChat.pruefLagerVergessen();
      const g = await LiveChat.pruefVerlaufAusLager(raum);
      const ids = g.map((n) => n.id), doppelt = ids.length - new Set(ids).size;
      LiveChat.pruefVerlaufSetzen(g); await window.__fertig(raum);
      const roh = await window.__roh(raum);
      return { n: g.length, doppelt, beide: ids.includes("alt-neu-1") && ids.includes("alt-neu-2") && ids.includes("B0"), alt: Boolean(roh.alt), lagerN: roh.zeilen ? roh.zeilen.length : -1 };
    });
    ok(r.n === 2002 && r.doppelt === 0 && r.beide, "vereinigt: 2 002 Zeilen, keine doppelt, alte wie neue Zeilen da", r.n + " Zeilen, " + r.doppelt + " doppelt");
    ok(!r.alt && r.lagerN === 2002, "nächste Sicherung: nur noch das neue Format, 2 002 Zeilen", "alt " + r.alt + ", " + r.lagerN + " Zeilen");
  }

  if (hat("T")) {
    console.log("\n  T  Abbruch mitten im Schreiben (Tab zu, Absturz, pagehide)");
    /* B schreibt 7 000+1 Zeilen in Stücken zu 50 Zeilen, je Schritt ein Stück (~140 Schritte), weil ein „anderer Tab"
       geschrieben hat (alles neu). Nach dem 3. Stück-put: Tab zu / Absturz / pagehide. */
    for (const art of ["zu", "absturz", "pagehide"]) {
      const raum = "l-t-" + art;
      /* eigener Kontext: ein Absturz soll nur diesen Renderer treffen; gelesen wird danach von einer neuen Seite darin */
      const cT = await kontext();
      const B = await seite(cT);
      let abgestuerzt = false;
      B.on("crash", () => { abgestuerzt = true; });
      const vorbereitet = await B.evaluate(async (raum) => {
        LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
        if (LiveChat.pruefLager) LiveChat.pruefLager(raum, { stueck: 50, glied: 1 });
        LiveChat.pruefVerlaufSetzen(window.__zeilen(7000, "T", 0, null)); await window.__fertig(raum);
        const db = await window.__db(); await new Promise((ok) => { const t = db.transaction("bilder", "readwrite"), f = t.objectStore("bilder");
          const g = f.get("chatix:" + raum); g.onsuccess = () => { if (g.result) { g.result.daten.stand = "fremd"; f.put(g.result); } }; t.oncomplete = () => ok(); t.onabort = () => ok(); });
        window.__mitten = false; window.__stueckPuts = 0;
        const put = IDBObjectStore.prototype.put;
        IDBObjectStore.prototype.put = function (v) { const r = put.apply(this, arguments); if (v && typeof v.id === "string" && v.id.indexOf("chatst:") === 0 && ++window.__stueckPuts === 3) window.__mitten = true; return r; };
        LiveChat.pruefSichernAbstand(0);
        LiveChat.pruefAnhaengen({ id: "T-neu", von: "p1", name: "Bea", art: "text", text: "neu", zeit: Date.now() });
        return true;
      }, raum);
      let mitten = false;
      try { await B.waitForFunction(() => window.__mitten === true, null, { timeout: 15000, polling: 1 }); mitten = true; } catch (e) {}
      const stand = await B.evaluate((raum) => ({ puts: window.__stueckPuts, unterwegs: LiveChat.pruefLager ? LiveChat.pruefLager(raum).unterwegs : null }), raum).catch(() => ({}));
      if (art === "zu") await B.close();
      else if (art === "absturz") {
        const c = await cT.newCDPSession(B);
        c.send("Page.crash").catch(() => {});
        for (let k = 0; k < 60 && !abgestuerzt; k++) await schlaf(50);
        await Promise.race([B.close().catch(() => {}), schlaf(3000)]);
      } else { await B.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false }))); await schlaf(800); await B.close(); }
      await schlaf(500);
      const C = await seite(cT);
      const r = await C.evaluate(async (raum) => { const roh = await window.__roh(raum); const ids = (roh.zeilen || []).map((n) => n.id);
        return { n: ids.length, fehlt: roh.fehlt, erste: ids[0], letzte: ids[ids.length - 1], doppelt: ids.length - new Set(ids).size, bereich: roh.bereich.length, stuecke: roh.index ? roh.index.stuecke.length : 0,
                 lueckenlos: ids.slice(0, 7000).every((x, i) => x === "T" + i) }; }, raum);
      const vollstaendig = r.fehlt.length === 0 && r.doppelt === 0 && r.lueckenlos && r.bereich === r.stuecke && (r.n === 7000 || (r.n === 7001 && r.letzte === "T-neu"));
      await Promise.race([cT.close().catch(() => {}), schlaf(5000)]);
      ok(mitten && vorbereitet && (art !== "absturz" || abgestuerzt), art + ": nachgestellt – mitten im Schreiben in Stücken", "Stück-puts bis dahin " + stand.puts + ", unterwegs " + stand.unterwegs + (art === "absturz" ? ", abgestürzt " + abgestuerzt : ""));
      ok(vollstaendig, art + ": danach ein vollständiger Stand im Lager", r.n + " Zeilen (" + r.erste + " … " + r.letzte + "), fehlend " + JSON.stringify(r.fehlt) + ", Bereich " + r.bereich + "/" + r.stuecke);
      if (art === "pagehide") ok(r.n === 7001 && r.letzte === "T-neu", "pagehide: der neueste Stand (mit der neuen Zeile)", r.n + " Zeilen");
    }
  }

  if (hat("M")) {
    console.log("\n  M  Mehrere Tabs, mehrere Räume");
    const A = pg, B = await seite();
    const raum = "l-m";
    await A.evaluate(async (raum) => { LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum); LiveChat.pruefVerlaufSetzen(window.__zeilen(3000, "M", 0, null)); await window.__fertig(raum); LiveChat.pruefSichernAbstand(0); }, raum);
    await B.evaluate(async (raum) => { LiveChat.pruefSichernAbstand(0); LiveChat.pruefRaum(raum); const g = await LiveChat.pruefVerlaufAusLager(raum);
      LiveChat.pruefVerlaufFensterAuf(); LiveChat.pruefEmpfangen({ art: "verlauf", von: "lager-nachbau", name: "Lager", zeilen: g }); LiveChat.pruefVerlaufFensterZu(); await window.__fertig(raum); LiveChat.pruefSichernAbstand(0); }, raum);
    const schritt = async (P, id, weg, vorn) => {
      await P.evaluate(async ({ raum, id, weg, vorn }) => {
        if (vorn) {   /* so viele ältere Zeilen vorn dazu, wie sie ein Ankömmling mitbringt */
          const z0 = LiveChat.lage().nachrichten[0].zeit, alt = [];
          for (let i = 0; i < vorn; i++) alt.push({ id: "Mv" + i, von: "p" + (i % 30), name: "Schüler" + (i % 30), art: "text", text: "älter " + i, zeit: z0 - (vorn - i) * 1000 });
          LiveChat.pruefVerlaufFensterAuf(); LiveChat.pruefEmpfangen({ art: "verlauf", von: "m-ankoemmling", name: "Ankömmling", zeilen: alt }); LiveChat.pruefVerlaufFensterZu();
        } else LiveChat.pruefAnhaengen({ id, von: "p1", name: "Bea", art: "text", text: id, zeit: Date.now() });
        if (weg) window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false }));
        await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum);
      }, { raum, id, weg, vorn: vorn || 0 });
      await schlaf(150);
      const soll = await P.evaluate(() => LiveChat.lage().nachrichten.map((n) => n.id).join(","));
      const roh = await A.evaluate(async (raum) => { const r = await window.__roh(raum); return { ids: window.__ids(r.zeilen), fehlt: r.fehlt.length, bereich: r.bereich.length, stuecke: r.index ? r.index.stuecke.length : 0 }; }, raum);
      /* wie der Schreibende geschrieben hat (art, alles neu?, Stücke, ok, raum) – aus SEINER Seite */
      const letzte = await P.evaluate((raum) => LiveChat.pruefLager ? LiveChat.pruefLager(raum).letzte.slice(-1)[0] : null, raum);
      return { gleich: roh.ids === soll, fehlt: roh.fehlt, bereich: roh.bereich, stuecke: roh.stuecke, n: soll.split(",").length, letzte };
    };
    const s1 = await schritt(A, "a1"), s2 = await schritt(B, "b1"), s3 = await schritt(A, "a2"), s4 = await schritt(B, "b2", true), s5 = await schritt(A, "a3");
    /* NACHGEBESSERT (Prüfung 889, Runde 1): bis hier läuft die Stück-Einteilung der beiden Tabs nie auseinander – eine
       Mutante, die den fremden Stand übergeht (immer nur das Geänderte schreiben), war damit grün. Jetzt bekommt A 700
       ältere Zeilen vorn dazu (Verlauf eines Ankömmlings) und teilt neu ein; B kennt sie nicht und schreibt danach eine
       Zeile – B muss ALLES schreiben (sonst bliebe A's Einteilung mit B's Verzeichnis liegen), danach wieder A. */
    const s6 = await schritt(A, null, false, 700), s7 = await schritt(B, "b3"), s8 = await schritt(A, "a4");
    [["A Leerlauf (a1)", s1], ["B Leerlauf (b1, A schrieb vorher)", s2], ["A Leerlauf (a2, B schrieb vorher)", s3], ["B pagehide (b2)", s4], ["A Leerlauf (a3, B schrieb vorher)", s5],
     ["A Leerlauf (700 ältere Zeilen vorn, neu eingeteilt)", s6], ["B Leerlauf (b3, kennt die 700 nicht, A schrieb vorher)", s7], ["A Leerlauf (a4, B schrieb vorher)", s8]].forEach(([was, s]) =>
      ok(s.gleich && s.fehlt === 0 && s.bereich === s.stuecke, was + ": Lager = Verlauf dieses Tabs, vollständig", s.n + " Zeilen, Bereich " + s.bereich + "/" + s.stuecke + (s.letzte ? ", " + JSON.stringify(s.letzte) : "")));
    ok(s6.n === 3703 && s7.n === 3003 && s8.n === 3704 && (!s7.letzte || s7.letzte[1] === true), "… die Einteilungen liefen auseinander, B schrieb alles neu", "A " + s6.n + " / B " + s7.n + " / A " + s8.n + " Zeilen" + (s7.letzte ? ", B " + JSON.stringify(s7.letzte) : ""));
    await B.close();
    /* zwei Räume, deren Namen ineinander passen; Aufräumen */
    const r = await A.evaluate(async () => {
      const o = {};
      LiveChat.pruefRaum("m"); await LiveChat.pruefVerlaufAusLager("m"); LiveChat.pruefVerlaufSetzen(window.__zeilen(900, "m", 0, null));
      LiveChat.pruefRaum("m:1"); await LiveChat.pruefVerlaufAusLager("m:1"); LiveChat.pruefVerlaufSetzen(window.__zeilen(500, "m1-", 0, null));
      await window.__fertig("m:1");
      const a = await LiveChat.pruefVerlaufAusLager("m"), b = await LiveChat.pruefVerlaufAusLager("m:1");
      o.getrennt = a.length === 900 && b.length === 500 && a.every((n) => /^m\d/.test(n.id)) && b.every((n) => /^m1-/.test(n.id));
      if (!LiveChat.pruefLagerAufraeumen) return o;
      /* verwaiste Stücke (Raum ohne Verzeichnis) und ein 60 Tage altes Verzeichnis mit Stücken */
      const alt = Date.now() - 61 * 86400000;
      await window.__legen([{ id: "chatst:7:m-waise:0", raum: "m-waise", daten: "[]" }, { id: "chatst:7:m-waise:1", raum: "m-waise", daten: "[]" },
                            { id: "chatix:m-alt", raum: "m-alt", zeit: alt, daten: { v: 1, stand: "x", zeilen: 0, stuecke: [[0, 0]], naechste: 1 } }, { id: "chatst:5:m-alt:0", raum: "m-alt", daten: "[]" }]);
      await LiveChat.pruefLagerAufraeumen();
      await new Promise((f) => setTimeout(f, 300));
      const w = await window.__roh("m-waise"), al = await window.__roh("m-alt"), m = await window.__roh("m"), m1 = await window.__roh("m:1"), lm = await window.__roh("l-m");
      o.waise = w.bereich.length; o.alt = al.bereich.length + (al.index ? 1 : 0);
      o.bleibt = m.zeilen && m.zeilen.length === 900 && m1.zeilen && m1.zeilen.length === 500 && lm.zeilen && lm.zeilen.length > 3000 && m.fehlt.length + m1.fehlt.length + lm.fehlt.length === 0;
      return o;
    });
    ok(r.getrennt, "Räume „m“ und „m:1“ getrennt (900 / 500 Zeilen)");
    ok(r.waise === 0 && r.alt === 0, "Aufräumen: verwaiste Stücke und das 60 Tage alte Verzeichnis samt Stücken weg", "verwaist " + r.waise + ", alt " + r.alt);
    ok(r.bleibt === true, "… alle anderen Räume unberührt und vollständig");
  }

  if (hat("Q")) {
    console.log("\n  Q  Speicher voll (nachgestellt: das put wirft sofort / die Anfrage scheitert später)");
    /* Storage.overrideQuotaForOrigin wirkt in diesem Chromium nicht (Quote bleibt 10 GB, auch im festen Profil) – darum
       am Lager selbst nachgestellt: QuotaExceededError aus put (synchron) bzw. eine Anfrage, die nachträglich scheitert. */
    const r = await pg.evaluate(async () => {
      const raum = "l-q", o = {};
      LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      LiveChat.pruefVerlaufSetzen(window.__zeilen(1000, "Q", 0, null)); await window.__fertig(raum);
      const stand = async () => { const r = await window.__roh(raum); return { n: r.zeilen ? r.zeilen.length : -1, fehlt: r.fehlt.length, bereich: r.bereich.length, stuecke: r.index ? r.index.stuecke.length : 0,
        letzteZeile: r.zeilen && r.zeilen.length ? r.zeilen[r.zeilen.length - 1].id : null, ls: (JSON.parse(localStorage.getItem("dma_livechat_chat_" + raum) || "[]").slice(-1)[0] || {}).id }; };
      for (const art of ["wirf", "fehl"]) {
        /* sofort: 7 000 Zeilen, das 2. Stück scheitert */
        window.__m[art] = 2;
        let wurf = "";
        try { LiveChat.pruefVerlaufSetzen(window.__zeilen(7000, "Q", 0, null)); } catch (e) { wurf = String(e); }
        await window.__fertig(raum); await new Promise((f) => setTimeout(f, 300));
        o[art + "Sofort"] = Object.assign({ wurf, rest: window.__m[art] }, await stand());
        window.__m[art] = 0;
        /* Leerlauf: eine neue Zeile, das 1. Stück scheitert */
        LiveChat.pruefSichernAbstand(0);
        window.__m[art] = 1;
        LiveChat.pruefAnhaengen({ id: "Q-" + art, von: "p1", name: "Bea", art: "text", text: "neu", zeit: Date.now() });
        await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum); await new Promise((f) => setTimeout(f, 300));
        o[art + "Leerlauf"] = Object.assign({ rest: window.__m[art], letzte: LiveChat.pruefLager ? LiveChat.pruefLager(raum).letzte.slice(-1)[0] : null }, await stand());
        window.__m[art] = 0;
        LiveChat.pruefSichernAbstand(20000);
        /* zurück auf den vollständigen 1 000er-Stand für die zweite Art */
        if (art === "wirf") { LiveChat.pruefVerlaufSetzen(window.__zeilen(1000, "Q", 0, null)); await window.__fertig(raum); }
      }
      /* wieder Platz: die nächste Sicherung geht durch */
      LiveChat.pruefSichernAbstand(0);
      LiveChat.pruefAnhaengen({ id: "Q-wieder", von: "p1", name: "Bea", art: "text", text: "wieder", zeit: Date.now() });
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum); await new Promise((f) => setTimeout(f, 300));
      LiveChat.pruefSichernAbstand(20000);
      o.wieder = await stand();
      return o;
    });
    for (const art of ["wirf", "fehl"]) {
      const s = r[art + "Sofort"], l = r[art + "Leerlauf"], wie = art === "wirf" ? "put wirft" : "Anfrage scheitert später";
      ok(s.rest === 0 && !s.wurf && s.n === 1000 && s.fehlt === 0 && s.bereich === s.stuecke && s.ls === "Q6999", "sofort, " + wie + ": kein Fehler, voriger Stand vollständig (1 000), localStorage geschrieben", JSON.stringify(s));
      ok(l.rest === 0 && l.n === 1000 && l.fehlt === 0 && l.bereich === l.stuecke && l.ls === "Q-" + art && (!l.letzte || l.letzte[3] === false), "Leerlauf, " + wie + ": voriger Stand vollständig, localStorage geschrieben", JSON.stringify(l));
    }
    ok(r.wieder.n === 7002 && r.wieder.fehlt === 0 && r.wieder.letzteZeile === "Q-wieder" && r.wieder.bereich === r.wieder.stuecke, "wieder Platz: die nächste Sicherung schreibt alles (7 002 Zeilen)", JSON.stringify(r.wieder));
  }

  if (hat("F")) {
    console.log("\n  F  localStorage-Teil und Fototafel wie bei der sofortigen Sicherung");
    const r = await pg.evaluate(async () => {
      const raum = "l-f"; LiveChat.pruefRaum(raum); await LiveChat.pruefVerlaufAusLager(raum);
      const fotos = [window.__foto(11, 16000), window.__foto(12, 16000), window.__foto(13, 16000)];
      const l = window.__zeilen(2000, "F", 0, fotos);
      LiveChat.pruefVerlaufSetzen(l.slice(0, -1)); await window.__fertig(raum);
      LiveChat.pruefSichernAbstand(0);
      LiveChat.pruefAnhaengen(Object.assign({}, l[l.length - 1]));
      await new Promise((f) => setTimeout(f, 100)); await window.__fertig(raum);
      LiveChat.pruefSichernAbstand(20000);
      const lsLeer = localStorage.getItem("dma_livechat_chat_" + raum), tafelLeer = localStorage.getItem("dma_livechat_chatfoto_" + raum), rohLeer = await window.__roh(raum);
      LiveChat.pruefVerlaufSetzen(LiveChat.lage().nachrichten); await window.__fertig(raum);
      const lsSofort = localStorage.getItem("dma_livechat_chat_" + raum), tafelSofort = localStorage.getItem("dma_livechat_chatfoto_" + raum), rohSofort = await window.__roh(raum);
      return { ls: lsLeer === lsSofort, lsN: JSON.parse(lsLeer || "[]").length, tafel: tafelLeer === tafelSofort && Boolean(tafelLeer), zeilen: JSON.stringify(rohLeer.zeilen) === JSON.stringify(rohSofort.zeilen), n: rohLeer.zeilen ? rohLeer.zeilen.length : -1 };
    });
    ok(r.ls && r.lsN === 300, "localStorage (300 Zeilen) aus dem Leerlauf = aus der sofortigen Sicherung", r.lsN + " Zeilen");
    ok(r.tafel, "Fototafel gleich");
    ok(r.zeilen && r.n === 2000, "Zeilen im Lager gleich", r.n + " Zeilen");
  }

  if (hat("L")) {
    console.log("\n  L  Laden beim Betreten nicht langsamer (CPU 4×, 7 000 Zeilen, Lager auf der Platte wie im Feld)");
    /* eigenes Profil auf der Platte: in den flüchtigen Kontexten von Playwright liegt die IndexedDB im Arbeitsspeicher,
       dort liest sich ein großer Wert anders als auf einem Gerät (gemessen: 7 000 Zeilen in Stücken zu 600 auf der Platte
       34 ms gegen 45 ms als ein Text, im Arbeitsspeicher umgekehrt). */
    const profil = fs.mkdtempSync(path.join(require("os").tmpdir(), "l889-"));
    const pctx = await chromium.launchPersistentContext(profil, { executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"], viewport: { width: 390, height: 780 }, serviceWorkers: "block" });
    await pctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pctx.addInitScript(messen);
    await pctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
    const lp = await seite(pctx);
    const cdp = await pctx.newCDPSession(lp);
    const vor = await lp.evaluate(async () => {
      const l = window.__zeilen(7000, "L", 0, null);
      LiveChat.pruefRaum("l-neu"); await LiveChat.pruefVerlaufAusLager("l-neu"); LiveChat.pruefVerlaufSetzen(l); await window.__fertig("l-neu");
      LiveChat.pruefRaum("l-zz");
      /* dasselbe im alten Format: der Text so, wie 888 ihn schrieb (die gespeicherten Zeilen aus dem neuen Format) */
      const roh = await window.__roh("l-neu");
      await window.__legen([{ id: "chat:l-alt", raum: "l-alt", daten: JSON.stringify(roh.zeilen || l), zeit: Date.now() }]);
      return { neuFormat: Boolean(roh.index), n: roh.zeilen ? roh.zeilen.length : -1 };
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const z = await lp.evaluate(async () => {
      const o = { alt: [], neu: [], altSchritt: [], neuSchritt: [] };
      for (let k = 0; k < 9; k++) for (const raum of (k % 2 ? ["l-alt", "l-neu"] : ["l-neu", "l-alt"])) {
        await new Promise((f) => setTimeout(f, 150));
        window.__m.dauer = []; window.__m.an = true;
        const t = performance.now(); const g = await LiveChat.pruefVerlaufAusLager(raum); const d = performance.now() - t;
        window.__m.an = false;
        if (g.length !== 7000) o.falsch = raum + " " + g.length;
        o[raum === "l-alt" ? "alt" : "neu"].push(d);
        o[raum === "l-alt" ? "altSchritt" : "neuSchritt"].push(Math.max(0, ...window.__m.dauer.map((x) => x[1])));
      }
      return o;
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    await pctx.close(); fs.rmSync(profil, { recursive: true, force: true });
    const ma = med(z.alt), mn = med(z.neu);
    ok(vor.neuFormat && vor.n === 7000, "Raum im neuen Format angelegt (7 000 Zeilen)", JSON.stringify(vor));
    ok(!z.falsch, "beide liefern 7 000 Zeilen", z.falsch || "");
    ok(mn <= ma * 1.2 + 5, "Lesen im neuen Format nicht langsamer (Median, bis +20 % + 5 ms Rauschen)", "neu " + mn.toFixed(1) + " ms, alt " + ma.toFixed(1) + " ms; längster Rückruf neu " + med(z.neuSchritt).toFixed(1) + " / alt " + med(z.altSchritt).toFixed(1) + " ms");
  }

  ok(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Das Chat-Lager liegt in Stücken, und es geht nichts verloren.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
