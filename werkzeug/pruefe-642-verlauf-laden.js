#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 642: DER GEMEINSAME VERLAUF LAEDT (UND LAESST REDEN)
   ---------------------------------------------------------------------
   XANDER (25.09.): „Jetzt steht irgendwas im Chat: der gemeinsame
   Verlauf ließ sich nicht laden. Du siehst gerade nur was auf diesem
   Gerät liegt. Kannst du das reparieren und kannst du generell das
   Laden etwas optimieren, weil manchmal dauert die Verbindung zwischen
   Leuten so lange, dass man ewig warten muss, bis man miteinander
   reden kann."

   Die Tabelle wird hier NACHGESTELLT (ein Klient, der wie PostgREST
   antwortet — oder eben scheitert, genau wie bestellt). Geprüft wird
   im Browser, mit der echten Seite:

     (a) Ein voruebergehender Fehler beim ersten Versuch fuehrt NICHT
         zur Meldung; der Verlauf steht nach dem zweiten Versuch da —
         und zwar gleich (Backoff), nicht erst beim naechsten Nachfassen.
     (b) Die Meldung kommt nur, wenn WIRKLICH alle Versuche scheitern —
         einmal, und dezent (Einblendung, keine Zeile im Verlauf).
     (c) Ein Raum, in dem noch nie etwas geschrieben wurde, ist kein
         Fehler: keine Meldung.
     (d) Der erste Zugriff ist klein: ohne Profilbild-Spalte, mit
         kleinem Limit.
     (e) Das Zusammenfuehren zweier grosser Verlaeufe dauert keine
         Sekunden mehr (und liefert dasselbe).
     (f) Wer schon drin sitzt, schickt dem Neuen ein kleines
         Verlaufspaket — ohne dabei sein Geraet anzuhalten.

   Jeder Fall laeuft zweimal: gegen die Fassung VOR 642 (aus
   .sicherung/livechat.js.vor-fassung642, erwartet ROT) und gegen die
   jetzige (erwartet GRUEN). Der Ausgang zaehlt nur fuer die jetzige.

   Aufruf:  node werkzeug/pruefe-642-verlauf-laden.js        (alt + neu)
            node werkzeug/pruefe-642-verlauf-laden.js --neu  (nur neu)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const ALT = path.join(WURZEL, ".sicherung", "livechat.js.vor-fassung642");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };
const NUR_NEU = process.argv.includes("--neu");

function server(welche) {
  return http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    let f = path.join(WURZEL, p);
    if (welche === "alt" && p === "/livechat.js") f = ALT;
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
}

/* Wird IN der Seite ausgefuehrt: der nachgestellte Tabellen-Klient.
   plan(q) entscheidet je Abfrage, was zurueckkommt. */
function buehneAufbauen(fall) {
  window.__abfragen = [];
  window.__hinweise = [];
  const ZEILEN = [
    { id: 1, raum: "klassenzimmer", autor: "u-emmy", name: "Emmi", text: "Guten Morgen, Xander!",
      art: "text", quelle_id: "e-1", bild: "data:image/png;base64," + "A".repeat(3000),
      erstellt: new Date(Date.now() - 90000).toISOString() },
    { id: 2, raum: "klassenzimmer", autor: "u-emmy", name: "Emmi", text: "Bist du noch da?",
      art: "text", quelle_id: "e-2", bild: "data:image/png;base64," + "A".repeat(3000),
      erstellt: new Date(Date.now() - 60000).toISOString() }
  ];
  const art = (q) => (q.spalten.indexOf("bild_im_chat") >= 0 && q.filter.some((f) => f[0] === "neq")) ? "bilder"
    : q.filter.some((f) => f[0] === "not" || f[0] === "or") ? "fluestern"
    : q.spalten === "bild" ? "profilbild" : "verlauf";
  let verlaufNr = 0;
  const plan = (q) => {
    const a = art(q);
    q.art = a;
    if (a === "verlauf") {
      verlaufNr += 1;
      if (fall === "alles-scheitert" || (fall === "erster-scheitert" && verlaufNr === 1)) {
        return { data: null, error: { code: "57014", message: "canceling statement due to statement timeout" } };
      }
      if (fall === "leer") return { data: [], error: null };
      return { data: ZEILEN.slice().reverse(), error: null };
    }
    if (a === "profilbild") return { data: [{ bild: ZEILEN[0].bild }], error: null };
    return { data: [], error: null };
  };
  const klient = { from: (tisch) => {
    const q = { tisch, spalten: "", filter: [], limitN: null };
    const b = {};
    ["eq", "is", "not", "or", "neq", "lt", "gte"].forEach((m) => {
      b[m] = (...args) => { q.filter.push([m].concat(args)); return b; };
    });
    b.select = (s) => { q.spalten = String(s || ""); return b; };
    b.order = () => b;
    b.limit = (n) => { q.limitN = n; return b; };
    b.abortSignal = () => b;
    b.then = (ok, schief) => {
      window.__abfragen.push(q);
      return new Promise((r) => setTimeout(r, 40)).then(() => plan(q)).then(ok, schief);
    };
    return b;
  } };
  window.Backend = window.Backend || {};
  Backend.currentUser = () => ({ id: "u-xander" });
  Backend.zugang = () => klient;
  LiveChat.beiHinweis((t) => window.__hinweise.push(String(t)));
  LiveChat.pruefRaum("klassenzimmer");
  LiveChat.pruefVerlaufSetzen([
    { id: "alt-1", von: "kuxander", name: "Xander", text: "Das lag nur auf meinem Gerät",
      art: "text", zeit: Date.now() - 300000, eigen: true }
  ]);
  LiveChat.pruefLageSetzen("drin");
}

/* Ein Fall in einer eigenen Seite: Verlauf holen, dann zusehen. */
async function fallLaufen(br, adresse, fall, wielang) {
  const pg = await br.newPage({ viewport: { width: 420, height: 800 } });
  const fehlerSeite = [];
  pg.on("pageerror", (e) => fehlerSeite.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(adresse, { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefVerlaufFrisch && typeof Backend !== "undefined", { timeout: 30000 });
  await pg.waitForTimeout(1500);
  await pg.evaluate(buehneAufbauen, fall);
  const erg = await pg.evaluate(async (wielang) => {
    const t0 = performance.now();
    let da = null, meldungZeit = null;
    const meldungIm = () => LiveChat.lage().nachrichten.filter((n) =>
      /gemeinsame Verlauf/.test(String(n.text || "")) && !/jetzt da/.test(String(n.text || "")));
    const meldungEin = () => window.__hinweise.filter((t) => /gemeinsame Verlauf/.test(t) && !/jetzt da/.test(t));
    LiveChat.pruefVerlaufFrisch(true);
    while (performance.now() - t0 < wielang) {
      await new Promise((r) => setTimeout(r, 50));
      if (da === null && LiveChat.lage().nachrichten.some((n) => n.text === "Bist du noch da?")) da = performance.now() - t0;
      if (meldungZeit === null && (meldungIm().length || meldungEin().length)) meldungZeit = performance.now() - t0;
    }
    const erste = window.__abfragen.find((q) => q.art === "verlauf") || {};
    const emmi = LiveChat.lage().nachrichten.find((n) => n.text === "Bist du noch da?");
    return {
      da, meldungZeit,
      imVerlauf: meldungIm().length,
      eingeblendet: meldungEin().length,
      verlaufAbfragen: window.__abfragen.filter((q) => q.art === "verlauf").length,
      ersteSpalten: erste.spalten || "", ersteLimit: erste.limitN,
      profilbild: Boolean(emmi && emmi.bild && emmi.bild.length > 1000),
      zeilen: LiveChat.lage().nachrichten.length
    };
  }, wielang);
  erg.seitenFehler = fehlerSeite;
  return { pg, erg };
}

/* (e) und (f) — in der Seite von (a), nachdem dort alles durch ist. */
async function schwereFaelle(pg) {
  return pg.evaluate(async () => {
    const raus = {};
    /* (e) Zwei grosse Verlaeufe: 10 000 aus der Tabelle, 10 000 aus dem
       Geraet, davon 5 000 gleiche Kennungen und 50 Zwillinge ohne
       gleiche Kennung (1,5 s Uhrversatz). Erwartet: 15 000 Zeilen. */
    const t = Date.UTC(2026, 8, 25, 8, 0, 0);
    const tabelle = [], geraet = [];
    for (let i = 0; i < 10000; i++) {
      tabelle.push({ id: "s" + i, von: "kemmi", name: "Emmi", text: "Zeile " + i, art: "text", zeit: t + i * 1000 });
    }
    for (let i = 5000; i < 15000; i++) {
      geraet.push({ id: "s" + i, von: "kemmi", name: "Emmi", text: "Zeile " + i, art: "text", zeit: t + i * 1000 });
    }
    for (let i = 0; i < 50; i++) {
      geraet.push({ id: "g" + i, von: "kemmi", name: "Emmi", text: "Zeile " + i, art: "text", zeit: t + i * 1000 + 1500 });
    }
    const t0 = performance.now();
    const zusammen = LiveChat.pruefVerschmelzen(tabelle, geraet);
    raus.verschmelzenMs = Math.round(performance.now() - t0);
    raus.verschmolzen = zusammen.length;

    /* (f) Ein Neuer kommt herein. Hier sitzt man mit 1 500 Zeilen, jede
       mit einem Profilfoto als Datenadresse, acht davon mit einem Bild
       im Chat. Gemessen: wie gross das Verlaufspaket ist, und wie lange
       das Geraet dabei am Stueck stillsteht. */
    const profil = "data:image/jpeg;base64," + "B".repeat(20000);
    const foto = "data:image/jpeg;base64," + "C".repeat(30000);
    const viele = [];
    for (let i = 0; i < 1500; i++) {
      viele.push({ id: "v" + i, von: i % 2 ? "kemmi" : "aa-ich", name: i % 2 ? "Emmi" : "Xander",
                   text: "Satz Nummer " + i, art: "text", bild: profil,
                   bildImChat: (i % 180 === 7) ? foto : "", zeit: Date.now() - (1500 - i) * 60000 });
    }
    LiveChat.pruefSitz({ lage: "drin", ichId: "aa-ich", ichName: "Xander", zuruecksetzen: true, leute: {} });
    LiveChat.pruefVerlaufSetzen(viele);
    const pakete = [];
    LiveChat.pruefAbfangen((p) => { if (p && p.art === "verlauf") pakete.push({ laenge: JSON.stringify(p).length, zeilen: (p.zeilen || []).length }); });
    let letzte = performance.now(), stau = 0;
    const takt = setInterval(() => { const j = performance.now(); stau = Math.max(stau, j - letzte); letzte = j; }, 5);
    LiveChat.pruefEmpfangen({ art: "hallo", von: "zz-neu", name: "Neu", tonAn: false, bildAn: false, seit: Date.now() });
    const bis = performance.now() + 5000;
    while (!pakete.length && performance.now() < bis) await new Promise((r) => setTimeout(r, 50));
    await new Promise((r) => setTimeout(r, 200));
    clearInterval(takt);
    LiveChat.pruefAbfangen(null);
    raus.paket = pakete[0] || null;
    raus.stauMs = Math.round(stau);
    return raus;
  });
}

/* (g) Ein langer Raum: 2 500 Zeilen in der Tabelle. Das erste Stueck
   muss sofort stehen, der Rest seitenweise nachkommen — vollstaendig,
   in der richtigen Reihenfolge. */
async function seitenFall(pg) {
  return pg.evaluate(async () => {
    const t = Date.now() - 2500 * 60000;
    const alle = [];
    for (let i = 1; i <= 2500; i++) {
      alle.push({ id: i, raum: "langer-raum", autor: "u-emmi", name: "Emmi", text: "Zeile " + i, art: "text",
                  quelle_id: "q" + i, bild: "data:image/png;base64,AAAA", erstellt: new Date(t + i * 60000).toISOString() });
    }
    const zugriffe = [];
    const klient = { from: () => {
      const q = { filter: [], limitN: 1e9, spalten: "" };
      const b = {};
      ["eq", "is", "not", "or", "neq", "lt", "gte"].forEach((m) => { b[m] = (...a) => { q.filter.push([m].concat(a)); return b; }; });
      b.select = (s) => { q.spalten = String(s || ""); return b; };
      b.order = () => b; b.abortSignal = () => b;
      b.limit = (n) => { q.limitN = n; return b; };
      b.then = (ok, schief) => new Promise((r) => setTimeout(r, 30)).then(() => {
        let daten = [];
        const offen = q.spalten.indexOf("text") >= 0 && !q.filter.some((f) => f[0] === "not" || f[0] === "or");
        if (offen) {
          zugriffe.push(q.limitN);
          const lt = q.filter.find((f) => f[0] === "lt");
          daten = alle.filter((r) => !lt || r.erstellt < lt[2]).slice().reverse().slice(0, q.limitN);
        } else if (q.spalten === "bild") daten = [{ bild: "data:image/png;base64,AAAA" }];
        return { data: daten, error: null };
      }).then(ok, schief);
      return b;
    } };
    Backend.zugang = () => klient;
    LiveChat.pruefRaum("langer-raum");
    LiveChat.pruefVerlaufSetzen([]);
    LiveChat.pruefLageSetzen("drin");
    const t0 = performance.now();
    let erstes = null;
    LiveChat.pruefVerlaufFrisch(true);
    const zahl = () => LiveChat.lage().nachrichten.filter((n) => /^Zeile \d+$/.test(n.text)).length;
    while (performance.now() - t0 < 10000 && zahl() < 2500) {
      await new Promise((r) => setTimeout(r, 30));
      if (erstes === null && zahl() > 0) erstes = { ms: Math.round(performance.now() - t0), zeilen: zahl() };
    }
    const texte = LiveChat.lage().nachrichten.filter((n) => /^Zeile \d+$/.test(n.text)).map((n) => Number(n.text.slice(6)));
    const geordnet = texte.every((x, i) => i === 0 || x > texte[i - 1]);
    /* Und beim Zurueckkommen auf die Seite: nur das juengste Stueck,
       nicht noch einmal alles. */
    const vorher = zugriffe.length;
    await LiveChat.pruefVerlaufFrisch(false);
    await new Promise((r) => setTimeout(r, 800));
    return { erstes, gesamt: texte.length, geordnet, zugriffe: zugriffe.slice(0, vorher),
             nochmal: zugriffe.slice(vorher) };
  });
}

async function durchlauf(welche) {
  const srv = server(welche);
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  console.log("\n==================== " + (welche === "alt" ? "FASSUNG VOR 642 (erwartet ROT)" : "JETZT (erwartet GRÜN)") + " ====================");
  const [a, b, c] = await Promise.all([
    fallLaufen(br, adresse, "erster-scheitert", 6000),
    fallLaufen(br, adresse, "alles-scheitert", 30000),
    fallLaufen(br, adresse, "leer", 27000)
  ]);
  const schwer = await schwereFaelle(a.pg);
  const seiten = await seitenFall(c.pg);
  await br.close(); srv.close();

  let rot = 0;
  const sage = (gut, was, zusatz) => {
    if (!gut) rot++;
    console.log((gut ? "  ok   " : "  ROT  ") + was + (zusatz ? "   " + zusatz : ""));
  };
  const s = (ms) => (ms === null || ms === undefined) ? "nie" : (ms / 1000).toFixed(1) + " s";

  console.log("\n  (a) DER ERSTE VERSUCH SCHEITERT (Zeitgrenze der Datenbank), DER ZWEITE NICHT");
  sage(a.erg.da !== null, "der gemeinsame Verlauf ist da", "nach " + s(a.erg.da));
  sage(a.erg.da !== null && a.erg.da < 2000, "und zwar gleich nach dem zweiten Versuch, nicht erst beim Nachfassen",
       "nach " + s(a.erg.da) + ", " + a.erg.verlaufAbfragen + " Verlaufsabfragen");
  sage(a.erg.meldungZeit === null, "keine Meldung", a.erg.meldungZeit === null ? "" : "Meldung nach " + s(a.erg.meldungZeit));

  console.log("\n  (b) JEDER VERSUCH SCHEITERT");
  sage(b.erg.meldungZeit !== null, "dann — und erst dann — kommt die Meldung", "nach " + s(b.erg.meldungZeit)
       + ", " + b.erg.verlaufAbfragen + " Verlaufsabfragen");
  sage(b.erg.verlaufAbfragen >= 6, "vorher wurde mehrfach nachgefasst, mit Wiederholungen", b.erg.verlaufAbfragen + " Abfragen");
  sage(b.erg.imVerlauf + b.erg.eingeblendet === 1, "genau einmal", (b.erg.imVerlauf + b.erg.eingeblendet) + "×");
  sage(b.erg.imVerlauf === 0 && b.erg.eingeblendet === 1, "dezent: als Einblendung, nicht als Zeile im Verlauf",
       "im Verlauf " + b.erg.imVerlauf + ", eingeblendet " + b.erg.eingeblendet);

  console.log("\n  (c) EIN RAUM, IN DEM NOCH NIE ETWAS GESCHRIEBEN WURDE");
  sage(c.erg.meldungZeit === null, "keine Meldung — leer ist kein Fehler",
       c.erg.meldungZeit === null ? "27 s zugesehen" : "Meldung nach " + s(c.erg.meldungZeit));

  console.log("\n  (d) DER ERSTE ZUGRIFF IST KLEIN");
  sage(!/(^|,)bild(,|$)/.test(a.erg.ersteSpalten), "ohne die Profilbild-Spalte „bild“ in jeder Zeile", a.erg.ersteSpalten);
  sage(a.erg.ersteLimit !== null && a.erg.ersteLimit <= 500, "mit kleinem Limit (der Rest kommt seitenweise nach)",
       "limit " + a.erg.ersteLimit);
  sage(a.erg.profilbild, "das Profilbild ist trotzdem an der Zeile (einmal je Person geholt)");

  console.log("\n  (e) ZWEI GROSSE VERLÄUFE ZUSAMMENFÜHREN (10 000 + 10 000)");
  sage(schwer.verschmolzen === 15000, "dasselbe Ergebnis: 15 000 Zeilen, Zwillinge erkannt", schwer.verschmolzen + " Zeilen");
  sage(schwer.verschmelzenMs < 500, "in einem Augenblick", schwer.verschmelzenMs + " ms");

  console.log("\n  (f) EIN NEUER KOMMT — DAS VERLAUFSPAKET DESSEN, DER SCHON DRIN SITZT");
  sage(schwer.paket && schwer.paket.zeilen > 0, "es geht ein Verlauf an den Neuen",
       schwer.paket ? schwer.paket.zeilen + " Zeilen" : "keins");
  sage(schwer.paket && schwer.paket.laenge <= 30000, "das Paket ist klein genug für eine langsame Leitung",
       schwer.paket ? Math.round(schwer.paket.laenge / 1024) + " KB" : "–");
  sage(schwer.stauMs < 400, "das Gerät steht dabei nicht still", "längste Blockade " + schwer.stauMs + " ms");

  console.log("\n  (g) EIN LANGER RAUM (2 500 ZEILEN IN DER TABELLE)");
  sage(seiten.gesamt === 2500, "alle Zeilen kommen an", seiten.gesamt + " Zeilen, Zugriffe mit limit " + seiten.zugriffe.join(" / "));
  sage(seiten.geordnet, "in der richtigen Reihenfolge");
  sage(seiten.erstes && seiten.erstes.zeilen <= 500, "zuerst nur ein kleines Stück, der Rest danach",
       seiten.erstes ? seiten.erstes.zeilen + " Zeilen nach " + seiten.erstes.ms + " ms" : "–");
  sage(seiten.nochmal.length === 1 && seiten.nochmal[0] <= 500,
       "beim erneuten Holen nur das jüngste Stück, nicht noch einmal alles",
       seiten.nochmal.length + " Zugriff(e), limit " + seiten.nochmal.join(" / "));

  const seitenFehler = [].concat(a.erg.seitenFehler, b.erg.seitenFehler, c.erg.seitenFehler);
  sage(seitenFehler.length === 0, "keine Fehler in der Konsole", seitenFehler.slice(0, 3).join(" | "));
  console.log("\n  " + (rot ? rot + "× ROT" : "alles GRÜN") + "\n");
  return rot;
}

(async () => {
  let altRot = null;
  if (!NUR_NEU && fs.existsSync(ALT)) altRot = await durchlauf("alt");
  const neuRot = await durchlauf("neu");
  console.log("ZUSAMMEN: vor 642 " + (altRot === null ? "nicht geprüft" : altRot + "× rot")
    + " · jetzt " + (neuRot ? neuRot + "× rot" : "alles grün"));
  process.exit(neuRot ? 1 : 0);
})();
