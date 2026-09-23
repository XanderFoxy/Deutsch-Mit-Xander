#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DAS LIEDER-PANEL
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Musik kann ich immer noch nicht in
   Einzelteil-Buttons anlegen, um eine History zu haben beziehungsweise
   ein abgespeichertes Panel, wo ich direkt auf meine Textzeilen und
   Refrains zu den jeweiligen dazugehoerigen Liedern kriegen kann."

   Die benannten Abschnitte gab es seit Runde 88 — aber drei Ebenen
   tief: Note antippen, Lied aussuchen, dann erst standen sie da. Wer
   einen Refrain auflegen wollte, musste also wissen, in welchem Lied
   er steckt. Einen Verlauf gab es ueberhaupt nicht.

   GEMESSEN WIRD:
     1  Im Musikmenue steht der Weg zum Panel ganz oben.
     2  Das Panel zeigt den Verlauf als einzelne Knoepfe.
     3  Es zeigt ALLE benannten Abschnitte, nach Liedern geordnet —
        auch die aus einem Lied, das man gar nicht aufgeschlagen hat.
     4  Ein Knopf legt wirklich auf.
     5  Der Verlauf ueberlebt das Schliessen (er liegt im Geraet und
        im Profil).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.liedPanel,
    { timeout: 20000 });

  console.log("\nWAS IM LIEDER-PANEL STEHT\n");
  const m = await pg.evaluate(() => {
    /* Zwei Abschnitte in ZWEI verschiedenen Liedern und zwei
       Verlaufseintraege — genau der Fall, um den es geht. */
    let lieder = [];
    try { lieder = (window.LiveChat.lieder && window.LiveChat.lieder()) || []; } catch (e) {}
    const a = lieder[0], b = lieder[1] || lieder[0];
    if (!a) return { keineLieder: true };
    window.DMA_PRUEF.liedStelleMerken(a.datei, "Refrain", 78, 113);
    window.DMA_PRUEF.liedStelleMerken(b.datei, "Bridge", 140, 162);
    window.DMA_PRUEF.liedVerlaufMerken(a.datei, a.titel, 0, 0, "");
    window.DMA_PRUEF.liedVerlaufMerken(b.datei, b.titel, 78, 113, "Refrain");

    /* Erst das Musikmenue: steht der Weg dorthin ueberhaupt drin? */
    window.DMA_PRUEF.musikWaehler("");
    const imMenue = Boolean(document.querySelector(".lc-musik-panel"));
    const menueText = (document.querySelector(".lc-musik-panel") || {}).textContent || "";
    /* Und ganz oben? Gezaehlt wird, wie viele Knoepfe davor stehen. */
    const kasten = document.getElementById("lcPlatzMenue");
    const knoepfe = kasten ? Array.from(kasten.querySelectorAll("button")) : [];
    const platzImMenue = knoepfe.findIndex((x) => x.classList.contains("lc-musik-panel"));

    window.DMA_PRUEF.liedPanel("");
    const k = document.getElementById("lcPlatzMenue");
    const alleKnoepfe = Array.from(k.querySelectorAll("button"));
    const stellen = Array.from(k.querySelectorAll(".lc-lied-stelle"))
      .map((x) => x.textContent.trim());
    const titel = Array.from(k.querySelectorAll(".lc-liedpanel-titel"))
      .map((x) => x.textContent.trim());
    const ueberschriften = Array.from(k.querySelectorAll(".eyebrow"))
      .map((x) => x.textContent.trim());
    /* Und was passiert, wenn man einen Abschnitt antippt? */
    let gesendet = "";
    const alt = window.LiveChat.schreiben;
    window.LiveChat.schreiben = function (t) { gesendet = t; };
    const refrain = Array.from(k.querySelectorAll(".lc-lied-stelle"))
      .filter((x) => /Refrain/.test(x.textContent))[0];
    if (refrain) refrain.click();
    window.LiveChat.schreiben = alt;
    return { imMenue, menueText, platzImMenue, stellen, titel, ueberschriften,
      gesendet, knoepfe: alleKnoepfe.length,
      verlauf: window.DMA_PRUEF.liedVerlauf().length,
      gespeichert: (JSON.parse(localStorage.getItem("dma_liedverlauf") || "[]")).length,
      liedA: a.titel, liedB: b.titel, dateiA: a.datei, dateiB: b.datei };
  });

  if (m.keineLieder) {
    sage(false, "im Musikordner liegt nichts — so laesst sich das nicht messen");
  } else {
    sage(m.imMenue, "im Musikmenue steht der Weg zum Panel", m.menueText.trim());
    sage(m.platzImMenue >= 0 && m.platzImMenue <= 1,
      "und zwar ganz oben, vor den Liedern",
      "als " + (m.platzImMenue + 1) + ". Knopf");
    sage(m.ueberschriften.indexOf("ZULETZT GESPIELT") >= 0,
      "das Panel hat einen Verlauf", m.ueberschriften.join(" / "));
    sage(m.ueberschriften.indexOf("MEINE ABSCHNITTE") >= 0,
      "und ein Fach fuer die eigenen Abschnitte", m.ueberschriften.join(" / "));
    const hatRefrain = m.stellen.some((t) => /Refrain/.test(t));
    const hatBridge = m.stellen.some((t) => /Bridge/.test(t));
    sage(hatRefrain && hatBridge,
      "beide Abschnitte stehen da — auch der aus dem anderen Lied",
      m.stellen.join(" | "));
    sage(m.titel.length >= (m.dateiA === m.dateiB ? 1 : 2),
      "nach Liedern geordnet, mit dem Liedtitel darueber",
      m.titel.join(" / "));
    sage(m.stellen.some((t) => /1:18/.test(t)),
      "und mit der Zeit dahinter", m.stellen.join(" | "));
    sage(/^\/musik\s+\d+\s+1:18-1:53$/.test(m.gesendet),
      "ein Tipp auf den Abschnitt legt ihn wirklich auf",
      "„" + m.gesendet + "“");
    sage(m.verlauf >= 2, "der Verlauf merkt sich, was lief",
      m.verlauf + " Eintraege");
    sage(m.gespeichert >= 2, "und er liegt im Geraet, nicht nur im Fenster",
      m.gespeichert + " Eintraege in localStorage");
  }

  /* Und dass /abschnitte dasselbe Panel oeffnet. */
  const ueberBefehl = await pg.evaluate(() => {
    const liste = (window.LiveChat.befehlsliste && window.LiveChat.befehlsliste()) || [];
    return liste.some((x) => x.w === "abschnitte");
  });
  sage(ueberBefehl, "und /abschnitte steht in der Befehlsliste");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
