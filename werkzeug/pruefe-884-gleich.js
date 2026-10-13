#!/usr/bin/env node
/* =====================================================================
   SONDE 884-GLEICH — ALLE SEHEN DASSELBE, AUCH WER SPÄTER KOMMT
   ---------------------------------------------------------------------
   XANDER (Walkie 128/129/138, Abnahme 24.09.): „Andere sehen den Fokus
   nicht" · „Andere sehen es anders" (Aufdecken) · „Strichlinie/Lesetafel/
   Ei: Andere sehen es nicht" · Notiz: „Das Ei hat immer noch zu kleine
   Schalen nach dem Aufmachen."
   Zwei getrennte Chromium-Kontexte aus den QUELLEN (index.html?quelle):
   A = Lehrer (Betreiber, Häuptling), B = Späterkommender. Den Raumkanal
   spielt die Sonde (LiveChat.pruefPost fängt jedes Paket ab, zugestellt
   wird mit pruefEmpfangen) – sie bestimmt selbst, welche Pakete
   „verloren gehen". Geprüft:
     1  FOKUS + LESEZEILE beim Späterkommenden: A stellt eine Lesetafel,
        tippt Zeile 3 an und drückt „Fokus"; B bekommt NUR die Textzeile
        (lesefest, lesezeile, raumstand gehen verloren), dann grüsst B
        („hallo") und bekommt A's „auch-da": Fokus, Tafel im Fokusband,
        Zeile 3 markiert, Fokus-Knopf 📌
     2  VERLORENES PAKET: A wechselt auf Zeile 2 (alle Pakete verloren),
        A's Puls heilt es bei B; ein ÄLTERER Puls danach dreht nichts
        zurück. Eine Fokus-Meldung ohne Stempel (ältere Fassung) gilt
        sofort und wird von einem älteren Puls nicht zurückgedreht.
     3  VERLAUF FÜR GÄSTE: 90 lange Zeilen nach der Tafel – das Verlaufs-
        paket an einen Neuen (24 000 Zeichen) enthält trotzdem die fest-
        gehaltene Tafel
     4  AUFDECKEN GLEICH: /raten bei A, B bekommt nur die Aufgabenzeile;
        A tippt H und Q (Pakete verloren), A's Puls → B hat dieselben
        offenen Felder, Q „daneben", denselben Hinweistext. Direkter Weg:
        A tippt W, die raumstand-Pakete (mit Nachsendungen) an B → W offen
     5  NICHT DOPPELT: nach 1,8 s (Takt 1,5 s) bleibt Q gesperrt, ein
        zweiter Tipp zählt nicht noch einmal „daneben"
     6  DRAN: Bea antwortet (pruefAufgabeVersuch) → die Runde rückt bei A
        weiter; das dran-Paket geht verloren, A's Puls → B.dranZu = A's
     7  KEIN ECHO: B hat nie selbst einen Raumstand geschickt; Grösse
        des Raumstands im Puls (Auskunft, < 700 Zeichen)
     8  VERSCHMELZEN: die Tabellen-Abschrift (ohne Zusatzfelder, zeitlich
        vorn) verliert die Sätze der Lesetafel / den Aufdeck-Satz nicht
     9  EIERSCHALEN: Länge der Schalenzeichnung ÷ Breite des Eis (aus
        getBBox, auf CSS-Pixel umgerechnet) zwischen 0,97 und 1,15 (alt
        ≈ 0,84); Elementbreite bleibt 26 % (Sonde runde99-kleinkram);
        der Mittelpunkt der Schale bleibt (−16,25 % ± 1,5)
    10  Quelltext: beim Betreten wird der Raumstand geleert
   NACHBESSERUNG 1 (Prüfung der 884) – die Wege, die vorher fehlten:
    12  DATENKANAL: zwei Seiten mit ECHTER WebRTC-Leitung (wie 884-sitz);
        der „Server" verwirft jedes lesefest/lesezeile/raumstand und nimmt
        rs aus Puls und „auch-da" – der Fokus kommt beim anderen nur über
        den Kanal (dc.onmessage) an
    13  GEMISCHTER RAUM: O läuft auf der LIVE-FASSUNG (ALTGERAET, Vorgabe
        876cc04 = 883: livechat.js und app.js aus git, nur für diese
        Seite), F hat eine um 10 min VORGEHENDE Uhr, G eine richtige.
        O hält Tafel X fest (Meldung ohne Stempel), dann Y – das zweite
        Paket verliert F. F's Puls darf G nicht auf X zurückdrehen (der
        Fall aus der Prüfung). F's Raumstand trägt keinen Fokus (ohne
        Absender-Stempel fährt nichts mit). O versteht die neuen Pakete
        (lesefest mit rt, raumstand, auch-da mit rs) ohne Fehler.
    14  UHREN (nur neue Fassungen): F (+10 min) setzt die Lesezeile, G
        danach – G's Wechsel setzt sich trotz der vorgehenden Uhr von F
        durch, ein älterer Puls von F dreht nichts zurück
    15  EINMAL ZEICHNEN: „auch-da" mit vier neuen dran-Einträgen zeichnet
        nicht öfter voll (melden) als ein „auch-da" ohne; ein Puls und ein
        raumstand mit vier dran-Einträgen zeichnen höchstens einmal
    16  ALTERSGRENZE: A's Fokus und Lesezeile fahren mit, nach 3 h + 1 min
        (A's Uhr vorgestellt) nicht mehr – die Anzeige bei A bleibt; ein
        empfangener Eintrag älter als 3 h wird nicht weitergegeben
    17  keine Fehler auf allen Seiten (auch O auf der Live-Fassung)
   GEGENPROBE: ALT=<Ordner> – livechat.js, app.js, korrekturen.css, die
   dort liegen, liefert der Sonden-Server statt der Repo-Dateien aus (auch
   die Quelltext-Prüfung liest sie). Erwartet gegen b9aebd3 (vor 884-gleich):
   rot in 1–10, 12, 15 (angekommen) und 16 – gemessen 32 rot; 13 und 14
   bleiben grün (vor 884 fuhr nichts mit, also auch nichts Falsches).
   Gegen a7e9447 (884-gleich vor der Nachbesserung): rot nur in 13 (F trägt
   den Fokus, G springt auf X zurück), 15 und 16 – gemessen 7 rot. Die Sonde stürzt auf dem alten Stand nicht ab
   (neue Schnittstellen werden vorher abgefragt).
   ALTGERAET=<Revision>: aus welcher Revision O (Fall 13) livechat.js und
   app.js bekommt (Vorgabe 876cc04, die Live-Fassung 883). Ohne git wird
   Fall 13 übersprungen und das gesagt.
   BILD=<Ordner>: Bildschirmfotos des Eis bei 360, 412 und 760 px.
   MIN=1: dieselben Fälle mit min/ (Raum-Stücke von app.js) statt ?quelle.
   Aufruf: node werkzeug/pruefe-884-gleich.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const ALT = process.env.ALT || "";
const BILD = process.env.BILD || "";
const ALTGERAET = process.env.ALTGERAET || "876cc04";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
/* Datei aus ALT (falls dort vorhanden), sonst aus dem Repo */
const datei = (name) => {
  const a = ALT && path.join(ALT, name);
  return fs.readFileSync(a && fs.existsSync(a) ? a : path.join(WURZEL, name), "utf8");
};

(async () => {
  if (ALT) console.log("GEGENPROBE: Dateien aus " + ALT + " (" + fs.readdirSync(ALT).join(", ") + ")");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    let f = path.join(WURZEL, p);
    if (ALT) {
      const g = path.join(ALT, p);
      if (g.startsWith(ALT) && fs.existsSync(g) && !fs.statSync(g).isDirectory()) f = g;
    }
    if (!f.startsWith(WURZEL) && !(ALT && f.startsWith(ALT))) { a.writeHead(404); return a.end(); }
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  /* MIN=1: die verkleinerten Dateien aus min/ (nach fassung-setzen.js --nur-stempel) statt der Quellen */
  const URL = "http://127.0.0.1:" + srv.address().port + "/index.html" + (process.env.MIN ? "" : "?quelle");
  /* Fall 12 baut eine echte WebRTC-Leitung (wie 884-sitz) – dafür die nachgestellten Geräte */
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns"] });

  const fehlerJe = { A: [], B: [], E: [] };
  /* o.versatz: die Uhr dieser Seite geht so viele ms vor (Date.now; window.__uhr(ms) stellt sie um).
     o.altQuelle: { "livechat.js": Text, "app.js": Text } – diese Seite bekommt die Dateien einer älteren Fassung
     (immer ?quelle, damit genau diese Dateien laden). */
  const seite = async (wer, breite, o) => {
    o = o || {};
    if (!fehlerJe[wer]) fehlerJe[wer] = [];
    const ctx = await br.newContext({ viewport: { width: breite || 460, height: 900 } });
    if (o.altQuelle) {
      await ctx.route(/\/(livechat|app)\.js(\?.*)?$/, (r) => {
        const pfad = new globalThis.URL(r.request().url()).pathname.slice(1);
        if (o.altQuelle[pfad]) r.fulfill({ status: 200, contentType: "text/javascript", body: o.altQuelle[pfad] });
        else r.continue();
      });
    }
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => fehlerJe[wer].push(String(e).slice(0, 200)));
    await pg.addInitScript((v) => {
      try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
      const echt = Date.now.bind(Date); let versatz = v || 0;
      Date.now = () => echt() + versatz;
      window.__uhr = (ms) => { versatz = ms; };
    }, o.versatz || 0);
    await pg.goto(o.altQuelle ? URL.split("?")[0] + "?quelle" : URL, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction((alt) => window.LiveChat && window.LiveChat.pruefSitz && window.LiveChat.pruefPost
      && window.DMA_LESEFEST && (alt || (window.DMA_PRUEFUNG && window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne)),
      Boolean(o.altQuelle), { timeout: 30000 });
    return pg;
  };
  const A = await seite("A"), B = await seite("B");

  /* Beide drin, A ist Betreiber und damit Häuptling; jeder Raumkanal ist abgefangen. */
  await A.evaluate(() => {
    LiveChat.pruefSitz({ lage: "drin", ichId: "a", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { b: { id: "b", name: "Bea", seit: 2000 } } });
    LiveChat.kontoNachladen({ betreiber: true });
  });
  await B.evaluate(() => {
    LiveChat.pruefSitz({ lage: "drin", ichId: "b", ichName: "Bea", seit: 2000, zuruecksetzen: true,
      leute: { a: { id: "a", name: "Alex", seit: 1000 } } });
  });
  for (const pg of [A, B]) {
    await pg.evaluate(() => {
      window.__raus = [];
      LiveChat.pruefPost((p) => { try { window.__raus.push(JSON.parse(JSON.stringify(p))); } catch (e) {} });
      const t = document.querySelector('[data-sub="sub-livechat"]'); if (t) t.click();
    });
    await pg.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });
  }
  await schlaf(400);
  const abholen = (pg) => pg.evaluate(() => window.__raus.splice(0));
  const zustellen = async (pg, pakete) => {
    await pg.evaluate((ps) => { ps.forEach((p) => { try { LiveChat.pruefEmpfangen(p); } catch (e) {} }); }, pakete);
    await schlaf(350);
  };
  const haeuptling = await A.evaluate(() => Boolean((LiveChat.lage() || {}).haeuptling));
  console.log("  A ist Häuptling: " + haeuptling);

  /* ================================================================== */
  console.log("\n1  FOKUS UND LESEZEILE BEIM SPÄTERKOMMENDEN\n");
  await abholen(A);
  await A.evaluate(() => LiveChat.leseTextSenden({ titel: "Probe", niveau: "A1", zeilen: ["Eins.", "Zwei.", "Drei."] }));
  await schlaf(500);
  let raus = await abholen(A);
  const textZeile = raus.find((p) => p.art === "text" && p.chatArt === "lesen");
  const leseId = textZeile ? textZeile.id : "";
  /* A tippt Zeile 3 an und drückt „Fokus" – über die Oberfläche, wie der Lehrer. */
  const aTippt = await A.evaluate(async (id) => {
    const tafel = document.querySelector('.lc-lesetafel[data-lese-id="' + id + '"]');
    if (!tafel) return { grund: "keine Tafel bei A" };
    tafel.querySelector('.lc-lese-zeile[data-nr="2"]').click();
    await new Promise((f) => setTimeout(f, 150));
    const fk = [...tafel.querySelectorAll(".lc-lese-schalter")].find((k) => /Fokus/.test(k.textContent));
    if (fk) fk.click();
    await new Promise((f) => setTimeout(f, 300));
    return { fest: LiveChat.leseFestWelche(), zeile: LiveChat.leseZeile(id) };
  }, leseId);
  sage(Boolean(leseId) && aTippt.fest === leseId && aTippt.zeile === 2, "A: Lesetafel steht, Zeile 3 und Fokus gesetzt",
    JSON.stringify(aTippt));
  await schlaf(1500);   // auch die Nachsendungen (0,35 s / 1,2 s) gehen ins Leere
  raus = await abholen(A);
  sage(raus.filter((p) => p.art === "lesefest" || p.art === "lesezeile").length >= 2,
    "A schickt weiter die alten Meldungen (für ältere Fassungen im Raum)",
    raus.map((p) => p.art).join(","));
  const rsRaus = raus.filter((p) => p.art === "raumstand");
  sage(rsRaus.length >= 2 && rsRaus.length <= 8, "und den Raumstand, nachgesendet und zusammengelegt",
    rsRaus.length + " raumstand-Pakete für 2 Änderungen");
  /* B bekommt NUR die Textzeile. */
  await zustellen(B, [textZeile]);
  const bVorher = await B.evaluate((id) => ({ tafel: Boolean(document.querySelector('.lc-lesetafel[data-lese-id="' + id + '"]')),
    fest: LiveChat.leseFestWelche() }), leseId);
  sage(bVorher.tafel && !bVorher.fest, "B hat die Tafel, aber (Pakete verloren) keinen Fokus", JSON.stringify(bVorher));
  /* B grüsst, A antwortet mit „auch-da" – nur das geht an B. */
  await A.evaluate(() => LiveChat.pruefEmpfangen({ art: "hallo", von: "b", name: "Bea", seit: 2000, buehne: true }));
  await schlaf(300);
  raus = await abholen(A);
  const auchDa = raus.filter((p) => p.art === "auch-da" && p.an === "b");
  sage(auchDa.length === 1, "A antwortet dem Späterkommenden mit „auch-da\"", auchDa.length + "×, rs: " + JSON.stringify((auchDa[0] || {}).rs || null));
  await zustellen(B, auchDa);
  const bNach = await B.evaluate((id) => {
    const tafel = document.querySelector('.lc-lesetafel[data-lese-id="' + id + '"]');
    const band = document.getElementById("lcFokusband");
    const fk = tafel ? [...tafel.querySelectorAll(".lc-lese-schalter")].find((k) => /Fokus/.test(k.textContent)) : null;
    const hier = tafel ? tafel.querySelector(".lc-lese-zeile.lc-lese-hier") : null;
    return { fest: LiveChat.leseFestWelche(), welche: window.DMA_LESEFEST.welche(),
      imBand: Boolean(tafel && band && (tafel.closest(".lc-zeile") || {}).parentElement === band),
      zeile: LiveChat.leseZeile(id), hier: hier ? hier.dataset.nr : "-", knopf: fk ? fk.textContent : "-" };
  }, leseId);
  sage(bNach.fest === leseId && bNach.welche === leseId, "B hat den Fokus des Raums", bNach.fest || "(leer)");
  sage(bNach.imBand, "die Tafel liegt bei B im Fokusband unter dem Chat");
  sage(bNach.zeile === 2 && bNach.hier === "2", "B markiert dieselbe Zeile (3)", "leseZeile " + bNach.zeile + ", markiert " + bNach.hier);
  sage(/📌/.test(bNach.knopf), "der Fokus-Knopf zeigt bei B 📌 (vorher blieb er 📎)", bNach.knopf);

  /* ================================================================== */
  console.log("\n2  VERLORENES PAKET: DER PULS HEILT, EIN ALTER PULS DREHT NICHTS ZURÜCK\n");
  await A.evaluate(() => LiveChat.pruefPuls());
  const pulsAlt = (await abholen(A)).filter((p) => p.art === "puls");
  await A.evaluate(async (id) => {
    await new Promise((f) => setTimeout(f, 5));
    document.querySelector('.lc-lesetafel[data-lese-id="' + id + '"] .lc-lese-zeile[data-nr="1"]').click();
  }, leseId);
  await schlaf(1500);
  await abholen(A);                                            // alles verloren
  const b2 = await B.evaluate((id) => LiveChat.leseZeile(id), leseId);
  sage(b2 === 2, "die Zeile ist bei B noch die alte (Paket verloren)", "leseZeile " + b2);
  await A.evaluate(() => LiveChat.pruefPuls());
  const pulsNeu = (await abholen(A)).filter((p) => p.art === "puls");
  sage(pulsNeu.length === 1 && Boolean(pulsNeu[0].rs), "A's Puls trägt den Raumstand",
    pulsNeu[0] && pulsNeu[0].rs ? JSON.stringify(pulsNeu[0].rs).length + " Zeichen" : "kein rs");
  await zustellen(B, pulsNeu);
  const b3 = await B.evaluate((id) => ({ z: LiveChat.leseZeile(id),
    hier: (document.querySelector('.lc-lesetafel[data-lese-id="' + id + '"] .lc-lese-zeile.lc-lese-hier') || { dataset: {} }).dataset.nr }), leseId);
  sage(b3.z === 1 && b3.hier === "1", "nach A's Puls steht bei B Zeile 2", JSON.stringify(b3));
  await zustellen(B, pulsAlt);
  const b4 = await B.evaluate((id) => ({ z: LiveChat.leseZeile(id), fest: LiveChat.leseFestWelche() }), leseId);
  sage(b4.z === 1 && b4.fest === leseId, "ein älterer Puls danach dreht nichts zurück", JSON.stringify(b4));
  /* Eine Fokus-Meldung ohne Stempel (ältere Fassung): gilt sofort, ein älterer Puls holt den alten Fokus nicht zurück. */
  await zustellen(B, [{ art: "lesefest", von: "a", leseId: "" }]);
  const b5 = await B.evaluate(() => ({ fest: LiveChat.leseFestWelche(), band: document.getElementById("lcFokusband").children.length }));
  await zustellen(B, pulsNeu);
  const b6 = await B.evaluate(() => ({ fest: LiveChat.leseFestWelche(), band: document.getElementById("lcFokusband").children.length }));
  sage(b5.fest === "" && b5.band === 0 && b6.fest === "" && b6.band === 0,
    "„lesefest\" einer älteren Fassung (ohne Stempel) gilt, ein älterer Puls dreht es nicht zurück",
    JSON.stringify([b5, b6]));

  /* ================================================================== */
  console.log("\n3  DER VERLAUF FÜR GÄSTE ENTHÄLT DIE FESTGEHALTENE TAFEL\n");
  await A.evaluate(() => {
    const t0 = Date.now();
    for (let i = 0; i < 90; i++) {
      LiveChat.pruefEmpfangen({ art: "text", von: "b", name: "Bea", id: "lang" + i, zeit: t0 + i, chatArt: "text",
        text: ("Zeile " + i + " ").padEnd(290, "x") });
    }
  });
  await schlaf(500);
  await abholen(A);
  await A.evaluate(() => LiveChat.pruefEmpfangen({ art: "hallo", von: "c", name: "Cem", seit: 3000, buehne: true }));
  await schlaf(2600);
  raus = await abholen(A);
  const verlauf = raus.find((p) => p.art === "verlauf" && p.an === "c");
  const vText = verlauf ? JSON.stringify(verlauf) : "";
  sage(Boolean(verlauf) && vText.length <= 24000 + 400, "A schickt dem Neuen ein Verlaufspaket in der alten Grösse",
    verlauf ? verlauf.zeilen.length + " Zeilen, " + vText.length + " Zeichen" : "keins");
  sage(Boolean(verlauf) && verlauf.zeilen.some((z) => z.id === leseId && Array.isArray(z.leseZeilen) && z.leseZeilen.length === 3),
    "darin steht die festgehaltene Lesetafel (mit ihren Sätzen)", verlauf ? "jüngste: " + (verlauf.zeilen[verlauf.zeilen.length - 1] || {}).id : "-");
  await A.evaluate(() => LiveChat.pruefEmpfangen({ art: "tschuess", von: "c" }));   // Cem geht wieder
  await schlaf(200); await abholen(A);

  /* ================================================================== */
  console.log("\n4  AUFDECKEN: ALLE SEHEN DIESELBEN BUCHSTABEN\n");
  await A.evaluate(() => LiveChat.pruefBefehl("/raten Hallo Welt wie geht es dir"));
  await schlaf(500);
  raus = await abholen(A);
  const aufgZeile = raus.find((p) => p.art === "text" && p.chatArt === "aufgabe" && p.raten);
  const zid = aufgZeile ? aufgZeile.id : "";
  await zustellen(B, aufgZeile ? [aufgZeile] : []);
  const tafelStand = (pg) => pg.evaluate((z) => {
    const k = [...document.querySelectorAll(".lc-raten")].find((x) => x.dataset.aufgabeId === z);
    if (!k) return null;
    const taste = (b) => [...k.querySelectorAll(".lc-raten-taste")].find((x) => x.textContent === b);
    const q = taste("Q"), w = taste("W"), h = taste("H");
    return { offen: k.querySelectorAll(".lc-raten-feld.offen").length, alle: k.querySelectorAll(".lc-raten-feld").length,
      hinweis: (k.querySelector(".lc-betonung-hinweis") || {}).textContent || "",
      q: q ? (q.classList.contains("daneben") ? "daneben" : "") + (q.disabled ? "/zu" : "/frei") : "-",
      h: h ? (h.classList.contains("offen") ? "offen" : "") : "-",
      w: w ? (w.classList.contains("offen") ? "offen" : "") : "-" };
  }, zid);
  const tipp = (pg, b) => pg.evaluate(({ z, b }) => {
    const k = [...document.querySelectorAll(".lc-raten")].find((x) => x.dataset.aufgabeId === z);
    const t = k && [...k.querySelectorAll(".lc-raten-taste")].find((x) => x.textContent === b);
    if (t) t.click();
    return Boolean(t);
  }, { z: zid, b });
  const a0 = await tafelStand(A), b0 = await tafelStand(B);
  sage(Boolean(a0 && b0) && a0.offen === b0.offen, "beide Tafeln stehen, gleich viele Felder offen (Vorgabe)",
    a0 && b0 ? a0.offen + "/" + a0.alle + " bei A, " + b0.offen + "/" + b0.alle + " bei B" : "fehlt");
  await tipp(A, "H"); await tipp(A, "Q");
  await schlaf(1500);
  raus = await abholen(A);                                     // alles verloren
  const a1 = await tafelStand(A), b1 = await tafelStand(B);
  sage(Boolean(a1) && a1.h === "offen" && /daneben/.test(a1.q), "A hat H aufgedeckt und Q daneben", JSON.stringify(a1));
  sage(Boolean(b1) && b1.h !== "offen", "B (Pakete verloren) noch nicht", b1 ? "H: " + (b1.h || "zu") : "-");
  sage(raus.some((p) => p.art === "raumstand" && p.rs && p.rs.rb && p.rs.rb[zid]),
    "die Tipps gingen als Raumstand hinaus (vorher: kein einziges Paket)", raus.map((p) => p.art).join(",") || "nichts");
  await A.evaluate(() => LiveChat.pruefPuls());
  await zustellen(B, (await abholen(A)).filter((p) => p.art === "puls"));
  await schlaf(200);
  const b2r = await tafelStand(B), a2r = await tafelStand(A);
  sage(Boolean(b2r && a2r) && b2r.offen === a2r.offen && b2r.h === "offen", "nach A's Puls: dieselben Felder offen",
    b2r && a2r ? b2r.offen + " bei B, " + a2r.offen + " bei A" : "-");
  sage(Boolean(b2r) && /daneben/.test(b2r.q), "Q steht bei B als daneben", b2r ? b2r.q : "-");
  sage(Boolean(b2r && a2r) && b2r.hinweis === a2r.hinweis, "derselbe Hinweistext", b2r ? "„" + b2r.hinweis + "\"" : "-");
  /* Direkter Weg: W tippen, die raumstand-Pakete (mit Nachsendungen) gehen an B */
  await tipp(A, "W");
  await schlaf(1500);
  const wPakete = (await abholen(A)).filter((p) => p.art === "raumstand");
  await zustellen(B, wPakete);
  const b3r = await tafelStand(B);
  sage(Boolean(b3r) && b3r.w === "offen", "W, über den Raumstand direkt geschickt, ist bei B offen",
    wPakete.length + " raumstand-Pakete (1 + Nachsendungen)");

  /* ================================================================== */
  console.log("\n5  EIN FEHLBUCHSTABE ZÄHLT NUR EINMAL\n");
  await schlaf(1800);                                          // länger als der 1,5-s-Takt
  const vorTipp = await tafelStand(A);
  await tipp(A, "Q");
  await schlaf(150);
  const nachTipp = await tafelStand(A);
  sage(Boolean(vorTipp) && /\/zu/.test(vorTipp.q), "Q bleibt nach dem Takt gesperrt", vorTipp ? vorTipp.q : "-");
  sage(Boolean(vorTipp && nachTipp) && vorTipp.hinweis === nachTipp.hinweis, "ein zweiter Tipp auf Q zählt nicht noch einmal",
    nachTipp ? "„" + nachTipp.hinweis + "\"" : "-");
  await abholen(A);

  /* ================================================================== */
  console.log("\n6  WER DRAN IST, STEHT ÜBERALL GLEICH\n");
  const dranVor = await A.evaluate((z) => LiveChat.dranZu(z), zid);
  await A.evaluate(() => LiveChat.pruefAufgabeVersuch("b", "Falsche Antwort"));
  await schlaf(1500);
  raus = await abholen(A);                                     // „dran" + raumstand verloren
  const dranA = await A.evaluate((z) => LiveChat.dranZu(z), zid);
  sage(dranA && dranA !== dranVor, "bei A ist die Runde weitergerückt", dranVor + " → " + dranA
    + " (" + raus.map((p) => p.art).join(",") + ")");
  await A.evaluate(() => LiveChat.pruefPuls());
  await zustellen(B, (await abholen(A)).filter((p) => p.art === "puls"));
  const dranB = await B.evaluate((z) => LiveChat.dranZu(z), zid);
  sage(dranB === dranA, "nach A's Puls weiss B dasselbe", "B: " + (dranB || "(leer)") + ", A: " + dranA);
  await schlaf(1700);                                          // die Tafel fragt alle 1,5 s nach
  const dranZeileB = await B.evaluate((z) => {
    const k = [...document.querySelectorAll(".lc-raten")].find((x) => x.dataset.aufgabeId === z);
    return k ? (k.querySelector(".lc-raten-dran") || {}).textContent || "" : "";
  }, zid);
  sage(dranZeileB.indexOf(dranA) >= 0, "und B's Tafel zeigt es an", "„" + dranZeileB + "\"");

  /* ================================================================== */
  console.log("\n7  KEIN ECHO, KLEINER PULS\n");
  const bRaus = await abholen(B);
  sage(!bRaus.some((p) => p.art === "raumstand"), "B schickt Übernommenes nicht weiter (kein Echo)",
    bRaus.length + " Pakete von B: " + [...new Set(bRaus.map((p) => p.art))].join(","));
  const groesse = await A.evaluate(() => (LiveChat.pruefRaumStand ? JSON.stringify(LiveChat.pruefRaumStand()).length : -1));
  sage(groesse > 0 && groesse < 700, "der Raumstand im Puls bleibt klein", groesse + " Zeichen");

  /* ================================================================== */
  console.log("\n8  VERSCHMELZEN: DIE TABELLEN-ABSCHRIFT FRISST KEINE ZUSATZFELDER\n");
  const merge = await A.evaluate(() => {
    const l = LiveChat.pruefVerschmelzen([{ id: "z1", art: "lesen", text: "📖 Probe", name: "Alex", zeit: 99000 }],
      [{ id: "z1", art: "lesen", text: "📖 Probe", name: "Alex", zeit: 100000, leseZeilen: ["Eins.", "Zwei."], leseTitel: "Probe" }]);
    const r = LiveChat.pruefVerschmelzen([{ id: "z2", art: "aufgabe", text: "🔡 Aufdecken", name: "Alex", zeit: 99000 }],
      [{ id: "z2", art: "aufgabe", text: "🔡 Aufdecken", name: "Alex", zeit: 100000, raten: "Hallo Welt", dran: "Bea" }]);
    return { n1: l.length, lese: (l[0] || {}).leseZeilen || null, n2: r.length, raten: (r[0] || {}).raten || null };
  });
  sage(merge.n1 === 1 && Array.isArray(merge.lese) && merge.lese.length === 2, "die Lesetafel behält ihre Sätze", JSON.stringify(merge));
  sage(merge.n2 === 1 && merge.raten === "Hallo Welt", "die Aufdeck-Zeile behält ihren Satz");

  /* ================================================================== */
  console.log("\n9  DIE EIERSCHALEN SIND SO GROSS WIE DAS EI\n");
  for (const breite of [360, 412, 760]) {
    const E = await seite("E", breite);
    const ei = await E.evaluate(async () => {
      window.DMA_PRUEF.effektBuehne();
      await new Promise((f) => setTimeout(f, 200));
      window.DMA_PRUEFUNG.wirkung("ei", "Bea", "Alex", {});
      let g = null, h = null;
      for (let i = 0; i < 40 && !(g && h); i++) {
        await new Promise((f) => setTimeout(f, 60));
        g = document.querySelector(".lc-zei-ganz"); h = document.querySelector(".lc-zei-schale-links");
      }
      if (!g || !h) return null;
      const skal = (svg) => parseFloat(getComputedStyle(svg).width) / svg.viewBox.baseVal.width;
      const eiB = g.querySelector("ellipse").getBBox().width * skal(g);
      const schaleL = h.querySelector("path").getBBox().height * skal(h);
      const cs = getComputedStyle(h), eltern = h.parentElement.getBoundingClientRect();
      const mitte = (parseFloat(cs.top) + parseFloat(cs.height) / 2) / eltern.height * 100;
      return { eiB: Math.round(eiB * 10) / 10, schaleL: Math.round(schaleL * 10) / 10,
        breiteEi: Math.round(parseFloat(getComputedStyle(g).width)), breiteSchale: Math.round(parseFloat(cs.width)),
        mitte: Math.round(mitte * 100) / 100 };
    });
    if (BILD && ei) {
      await schlaf(1500);   // Schale offen (34–62 % von 3,8 s)
      const k = await E.$("#lcPruefBuehne");
      try { fs.mkdirSync(BILD, { recursive: true }); await (k || E).screenshot({ path: path.join(BILD, "ei-" + breite + (ALT ? "-alt" : "") + ".png") }); } catch (e) {}
    }
    const v = ei ? ei.schaleL / ei.eiB : 0;
    sage(Boolean(ei) && v >= 0.97 && v <= 1.15, breite + " px: Schale so lang, wie das Ei breit ist",
      ei ? "Schale " + ei.schaleL + " px, Ei " + ei.eiB + " px, Verhältnis " + v.toFixed(2) + " (alt ≈ 0,84)" : "-");
    sage(Boolean(ei) && Math.abs(ei.breiteSchale - ei.breiteEi) <= 2, breite + " px: Elementbreite wie das Ei (Runde 99 bleibt)",
      ei ? ei.breiteSchale + " / " + ei.breiteEi + " px" : "-");
    sage(Boolean(ei) && Math.abs(ei.mitte - -16.25) <= 1.5, breite + " px: der Mittelpunkt der Schale bleibt",
      ei ? ei.mitte + " % der Platzhöhe (vorher −16,25 %)" : "-");
    await E.context().close();
  }

  /* ================================================================== */
  console.log("\n10 QUELLTEXT\n");
  const lc = datei("livechat.js");
  sage(/spielSitz = \{\};\s*\n\s*raumStand = \{ lf: null, lz: \{\}, dr: \{\}, rb: \{\} \};/.test(lc),
    "beim Betreten wird der Raumstand geleert (sonst wanderte er von Raum A nach B)");

  /* ================================================================== */
  console.log("\n12 DATENKANAL: DER FOKUS KOMMT AUCH OHNE SERVER AN\n");
  {
    /* Zwei frische Seiten mit echter Leitung (Aufbau wie 884-sitz: B grüsst, die kleinere Kennung ruft an). */
    const P = await seite("P"), Q = await seite("Q");
    await P.evaluate(() => {
      LiveChat.pruefSitz({ lage: "drin", ichId: "aaa", ichName: "Paul", seit: 1000, buehne: true, zuruecksetzen: true,
        leute: { bbb: { id: "bbb", name: "Quirin", seit: 2000, gesehen: 9e15, buehne: true, bild: "" } } });
      LiveChat.kontoNachladen({ betreiber: true });
    });
    await Q.evaluate(() => {
      LiveChat.pruefSitz({ lage: "drin", ichId: "bbb", ichName: "Quirin", seit: 2000, buehne: true, zuruecksetzen: true,
        leute: { aaa: { id: "aaa", name: "Paul", seit: 1000, gesehen: 9e15, buehne: true, bild: "" } } });
    });
    for (const pg of [P, Q]) {
      await pg.evaluate(() => {
        window.__raus = [];
        LiveChat.pruefPost((p) => { try { window.__raus.push(JSON.parse(JSON.stringify(p))); } catch (e) {} });
        const t = document.querySelector('[data-sub="sub-livechat"]'); if (t) t.click();
      });
      await pg.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });
    }
    /* Der „Server": trägt alles hinüber – nur Fokus, Lesezeile und Raumstand verwirft er (und zählt sie), und aus
       Puls und „auch-da" nimmt er den Raumstand (rs) heraus. So bleibt für den Fokus NUR der Datenkanal. */
    let laeuft = true;
    const verworfen = { lesefest: 0, lesezeile: 0, raumstand: 0, rs: 0 };
    const tragen = async (von, nach) => {
      while (laeuft) {
        let ps = [];
        try { ps = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
        for (const p of ps) {
          if (p.art !== "rs" && Object.prototype.hasOwnProperty.call(verworfen, p.art)) { verworfen[p.art]++; continue; }
          if (p.rs) { delete p.rs; verworfen.rs++; }
          try { await nach.evaluate((p) => LiveChat.pruefEmpfangen(p), p); } catch (e) {}
        }
        await schlaf(15);
      }
    };
    tragen(P, Q); tragen(Q, P);
    await P.evaluate(() => LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "Quirin", seit: 2000, kf: 1 }));
    const bereit = async (pg, id) => ((await pg.evaluate(() => LiveChat.pruefKanal())).bereit || []).indexOf(id) >= 0;
    let steht = false;
    for (let i = 0; i < 300 && !steht; i++) { steht = (await bereit(P, "bbb")) && (await bereit(Q, "aaa")); if (!steht) await schlaf(50); }
    sage(steht, "die Leitung steht, der Datenkanal ist auf beiden Seiten bereit");
    await P.evaluate(() => LiveChat.leseTextSenden({ titel: "Kanal", niveau: "A1", zeilen: ["Eins.", "Zwei."] }));
    let pid = "";
    for (let i = 0; i < 100 && !pid; i++) {
      pid = await Q.evaluate(() => { const t = document.querySelector(".lc-lesetafel"); return t ? t.dataset.leseId : ""; });
      if (!pid) await schlaf(30);
    }
    const gesetzt = await P.evaluate((id) => LiveChat.leseFestSetzen(id), pid);
    let qFest = "";
    for (let i = 0; i < 60 && qFest !== pid; i++) { qFest = await Q.evaluate(() => LiveChat.leseFestWelche()); if (qFest !== pid) await schlaf(50); }
    await schlaf(1500);   // auch die Nachsendungen gehen beim Server ins Leere
    sage(Boolean(pid) && gesetzt && qFest === pid && verworfen.lesefest >= 1,
      "der Fokus kommt bei Q über den Datenkanal an (dc.onmessage, art „raumstand\"); der Server verwarf jede Meldung",
      "Tafel " + (pid || "-") + ", Q: " + (qFest || "(leer)") + ", verworfen " + JSON.stringify(verworfen));
    laeuft = false; await schlaf(120);
    await P.context().close(); await Q.context().close();
  }

  /* ================================================================== */
  console.log("\n13 GEMISCHTER RAUM: DIE LIVE-FASSUNG UND EINE VORGEHENDE UHR\n");
  /* Wer im Raum sitzt, ohne neu geladen zu haben, läuft auf der Live-Fassung. O bekommt livechat.js und app.js
     daraus (git), F eine um 10 min vorgehende Uhr, G eine richtige. */
  let altQuelle = null;
  try {
    altQuelle = {};
    for (const d of ["livechat.js", "app.js"]) {
      altQuelle[d] = execFileSync("git", ["show", ALTGERAET + ":" + d], { cwd: WURZEL, maxBuffer: 256 << 20 }).toString("utf8");
    }
  } catch (e) { altQuelle = null; }
  const drin = (pg, ich, name, seit, leute) => pg.evaluate(({ ich, name, seit, leute }) => {
    LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: name, seit: seit, zuruecksetzen: true, leute: leute });
    window.__raus = [];
    LiveChat.pruefPost((p) => { try { window.__raus.push(JSON.parse(JSON.stringify(p))); } catch (e) {} });
    const t = document.querySelector('[data-sub="sub-livechat"]'); if (t) t.click();
  }, { ich, name, seit, leute });
  const LEUTE = { o: { id: "o", name: "Olaf", seit: 500 }, f: { id: "f", name: "Finn", seit: 2500 }, g: { id: "g", name: "Gina", seit: 2600 } };
  const ohne = (id) => { const l = JSON.parse(JSON.stringify(LEUTE)); delete l[id]; return l; };
  const F = await seite("F", 460, { versatz: 10 * 60 * 1000 }), G = await seite("G");
  await drin(F, "f", "Finn", 2500, ohne("f")); await drin(G, "g", "Gina", 2600, ohne("g"));
  for (const pg of [F, G]) await pg.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });
  const fUhr = await F.evaluate(() => Date.now()) - Date.now();
  console.log("  F's Uhr geht " + Math.round(fUhr / 60000) + " min vor");
  let X = "", Y = "";
  if (!altQuelle) {
    console.log("  ??   übersprungen: livechat.js/app.js aus " + ALTGERAET + " nicht lesbar (kein git?) – Fall 13 NICHT geprüft");
  } else {
    const O = await seite("O", 460, { altQuelle });
    await drin(O, "o", "Olaf", 500, ohne("o"));
    await O.evaluate(() => LiveChat.kontoNachladen({ betreiber: true }));
    await O.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });
    const oAlt = await O.evaluate(() => typeof LiveChat.pruefRaumStand !== "function");
    await O.evaluate(() => {
      LiveChat.leseTextSenden({ titel: "Erste", niveau: "A1", zeilen: ["Eins."] });
      LiveChat.leseTextSenden({ titel: "Zweite", niveau: "A1", zeilen: ["Zwei."] });
    });
    await schlaf(400);
    const tafeln = (await abholen(O)).filter((p) => p.art === "text" && p.chatArt === "lesen");
    X = (tafeln[0] || {}).id || ""; Y = (tafeln[1] || {}).id || "";
    await zustellen(F, tafeln); await zustellen(G, tafeln);
    const oHaeupt = await O.evaluate(() => Boolean((LiveChat.lage() || {}).haeuptling));
    await O.evaluate((x) => LiveChat.leseFestSetzen(x), X);
    await schlaf(1500);
    const festX = (await abholen(O)).filter((p) => p.art === "lesefest");
    sage(oAlt && oHaeupt && Boolean(X && Y) && festX.length === 1 && festX[0].rt === undefined,
      "O (" + ALTGERAET + ", ohne Raumstand) hält X fest – eine Meldung, ohne Stempel",
      "Häuptling " + oHaeupt + ", " + festX.length + "× lesefest, rt " + (festX[0] ? festX[0].rt : "-"));
    await zustellen(F, festX); await zustellen(G, festX);
    const fg1 = [await F.evaluate(() => LiveChat.leseFestWelche()), await G.evaluate(() => LiveChat.leseFestWelche())];
    sage(fg1[0] === X && fg1[1] === X, "F und G halten X fest (die Meldung ohne Stempel gilt)", JSON.stringify(fg1));
    const fRs = await F.evaluate(() => (LiveChat.pruefRaumStand ? LiveChat.pruefRaumStand() : {}));
    sage(!fRs.lf, "F's Raumstand trägt diesen Fokus NICHT (ohne Absender-Stempel fährt nichts mit)", JSON.stringify(fRs));
    await O.evaluate((y) => LiveChat.leseFestSetzen(y), Y);
    await schlaf(400);
    const festY = (await abholen(O)).filter((p) => p.art === "lesefest");
    await zustellen(G, festY);                                   // F verliert dieses Paket
    const gY = await G.evaluate(() => LiveChat.leseFestWelche());
    await abholen(F);
    await F.evaluate(() => LiveChat.pruefPuls());
    const fPuls = (await abholen(F)).filter((p) => p.art === "puls");
    await zustellen(G, fPuls);
    const gNach = await G.evaluate(() => LiveChat.leseFestWelche());
    sage(gY === Y && gNach === Y, "F's Puls (Uhr 10 min vor, Y verpasst) dreht G NICHT auf X zurück",
      "G vor dem Puls " + (gY === Y ? "Y" : gY) + ", danach " + (gNach === Y ? "Y" : gNach === X ? "X (zurückgedreht)" : gNach)
      + ", rs im Puls: " + JSON.stringify((fPuls[0] || {}).rs || null));
    const fNoch = await F.evaluate(() => LiveChat.leseFestWelche());
    console.log("  Auskunft: F zeigt " + (fNoch === X ? "weiter X" : fNoch === Y ? "Y" : fNoch)
      + " – wie vor 884: bis O das nächste Mal etwas ändert (O schickt keinen Raumstand)");
    /* O (Live-Fassung) bekommt die Pakete der neuen Fassung */
    const j = Date.now();
    await zustellen(O, [{ art: "lesefest", von: "g", leseId: X, rt: j },
      { art: "raumstand", von: "g", rs: { lf: [X, j], lz: { [X]: [0, j] } } },
      { art: "puls", von: "g", name: "Gina", seit: 2600, rs: { lf: [X, j] } },
      { art: "auch-da", von: "f", an: "o", name: "Finn", seit: 2500, rs: { lf: [X, j], dr: { zz: ["Gina", j] } } }]);
    await schlaf(300);
    const oX = await O.evaluate(() => LiveChat.leseFestWelche());
    sage(oX === X && fehlerJe.O.length === 0, "O versteht „lesefest\" mit Stempel und überhört raumstand und rs ohne Fehler",
      "O hält " + (oX === X ? "X" : oX || "(leer)") + ", Fehler: " + (fehlerJe.O.slice(0, 2).join(" | ") || "keine"));
    await O.context().close();
  }

  /* ================================================================== */
  console.log("\n14 UHREN: EINE VORGEHENDE UHR DRÄNGT NIEMANDEN AUS\n");
  {
    const T = X || "tafel-uhr";
    await abholen(F); await abholen(G);
    await F.evaluate((t) => LiveChat.leseZeileSetzen(t, 1), T);
    await schlaf(1500);
    await zustellen(G, (await abholen(F)).filter((p) => p.art === "raumstand" || p.art === "lesezeile"));
    await F.evaluate(() => LiveChat.pruefPuls());
    const fPulsAlt = (await abholen(F)).filter((p) => p.art === "puls");
    const g1 = await G.evaluate((t) => LiveChat.leseZeile(t), T);
    await G.evaluate((t) => LiveChat.leseZeileSetzen(t, 2), T);
    await schlaf(1500);
    await zustellen(F, (await abholen(G)).filter((p) => p.art === "raumstand" || p.art === "lesezeile"));
    const f2 = await F.evaluate((t) => LiveChat.leseZeile(t), T);
    await zustellen(G, fPulsAlt);
    const g2 = await G.evaluate((t) => LiveChat.leseZeile(t), T);
    sage(g1 === 1, "G übernimmt die Zeile von F (dessen Uhr 10 min vorgeht)", "G: " + g1);
    sage(f2 === 2, "G wechselt danach – bei F setzt sich G's Wechsel durch (Stempel = bekannter + 1, nicht G's Uhr)", "F: " + f2);
    sage(g2 === 2, "ein älterer Puls von F dreht G nicht zurück", "G: " + g2);
  }

  /* ================================================================== */
  console.log("\n15 EINMAL ZEICHNEN: WER DRAN IST, ZEICHNET JE PAKET HÖCHSTENS EINMAL\n");
  {
    const jetzt = Date.now();
    const vierDran = (z) => { const o = {}; ["Bea", "Cem", "Dana", "Emil"].forEach((nm, i) => { o[z + i] = [nm, jetzt + i]; }); return o; };
    /* Volle Neuzeichnungen (melden ohne art = renderLiveChat) je Paket, im selben Takt gezählt */
    const zahlen = await G.evaluate((ps) => {
      let voll = 0;
      LiveChat.beiAenderung((l, art) => { if (!art) voll++; });
      return ps.map((p) => { voll = 0; try { LiveChat.pruefEmpfangen(p); } catch (e) {} return voll; });
    }, [
      { art: "auch-da", von: "h1", an: "g", name: "Hanna", seit: 4000 },
      { art: "auch-da", von: "h2", an: "g", name: "Hugo", seit: 4100, rs: { dr: vierDran("za") } },
      { art: "puls", von: "h1", name: "Hanna", seit: 4000, rs: { dr: vierDran("zb") } },
      { art: "raumstand", von: "h1", rs: { dr: vierDran("zc") } }]);
    const da = await G.evaluate(() => [LiveChat.dranZu("za0"), LiveChat.dranZu("zb3"), LiveChat.dranZu("zc2")].join(","));
    sage(zahlen[1] <= zahlen[0], "„auch-da\" mit vier neuen dran-Einträgen zeichnet nicht öfter voll als eins ohne",
      zahlen[1] + " gegen " + zahlen[0] + " (vorher je Eintrag ein volles Neuzeichnen direkt nach anrufen)");
    sage(zahlen[2] <= 1, "ein Puls mit vier neuen dran-Einträgen zeichnet höchstens einmal voll", zahlen[2] + "×");
    sage(zahlen[3] <= 1, "ein raumstand mit vier neuen dran-Einträgen ebenso", zahlen[3] + "×");
    sage(da === "Bea,Emil,Dana", "und alle Einträge sind angekommen", da);
  }

  /* ================================================================== */
  console.log("\n16 ALTERSGRENZE: NICHTS ÄLTER ALS 3 STUNDEN FÄHRT MIT\n");
  {
    const alter = await A.evaluate(() => {
      if (!LiveChat.pruefRaumStand || !window.__uhr) return null;
      const vorher = LiveChat.pruefRaumStand();
      window.__uhr(3 * 3600 * 1000 + 60 * 1000);
      let nach;
      try { nach = LiveChat.pruefRaumStand(); } finally { window.__uhr(0); }
      return { vorher: vorher, nach: nach, fest: LiveChat.leseFestWelche() };
    });
    sage(Boolean(alter && alter.vorher.lf && alter.vorher.lz), "A's Fokus und Lesezeile fahren im Raumstand mit",
      alter ? Object.keys(alter.vorher).join(",") : "kein pruefRaumStand");
    sage(Boolean(alter) && Object.keys(alter.nach).length === 0,
      "3 h + 1 min später fährt nichts mehr mit (ein vergessener Fokus landet nicht stundenlang bei jedem Neuen)",
      alter ? JSON.stringify(alter.nach) : "-");
    sage(Boolean(alter) && alter.fest === leseId, "bei A selbst bleibt der Fokus stehen", alter ? alter.fest || "(leer)" : "-");
    const gAlt = await G.evaluate(() => {
      const j = Date.now();
      LiveChat.pruefEmpfangen({ art: "raumstand", von: "h1", rs: { lz: { uralt: [1, j - 4 * 3600 * 1000], frisch: [1, j] } } });
      const rs = LiveChat.pruefRaumStand ? LiveChat.pruefRaumStand() : {};
      return { uralt: Boolean(rs.lz && rs.lz.uralt), frisch: Boolean(rs.lz && rs.lz.frisch), angezeigt: LiveChat.leseZeile("uralt") };
    });
    sage(gAlt.frisch && !gAlt.uralt, "G gibt einen empfangenen Eintrag älter als 3 h nicht weiter (der frische fährt mit)",
      JSON.stringify(gAlt));
  }

  console.log("\n17 KEINE FEHLER\n");
  const alleFehler = [].concat.apply([], Object.keys(fehlerJe).map((k) => fehlerJe[k].map((f) => k + ": " + f)));
  sage(alleFehler.length === 0, "keine Fehler auf den Seiten (" + Object.keys(fehlerJe).join(", ") + ")",
    alleFehler.slice(0, 3).join(" | ") || "keine");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
