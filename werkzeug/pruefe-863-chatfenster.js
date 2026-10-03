#!/usr/bin/env node
/* =====================================================================
   SONDE 863 — DAS CHAT-FENSTER (FASSUNG 844)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".
   Beim Betreten zeichnete der Chat JEDE Zeile des Raums (Hauptraum: über
   7.000) – genau in den Sekunden, in denen das Gespräch aufgebaut wird.
   Jetzt stehen nur die letzten LC_FENSTER Zeilen im Verlauf.

   GEMESSEN WIRD (Rechner 4× gebremst wie ein einfaches Telefon):
     1. 7.400 alte Zeilen: wie lange das erste Zeichnen dauert, wie viele
        Zeilen im Verlauf stehen, oben der Hinweis auf die älteren.
     2. Ein „anziehen" weit vor dem Fenster wird trotzdem still nachgeholt
        (Bea trägt die Krone), das letzte „ausziehen" gewinnt.
     3. Eine neue Zeile kommt ans Ende, nichts fällt heraus.
     4. Nach oben rollen lädt die nächsten älteren Zeilen dazu – in der
        richtigen Reihenfolge, und die Stelle, an der man liest, bleibt
        stehen.
     5. Antippen des Hinweises lädt ebenso nach.
     6. Ein zweites Auffrischen mit 7.400 Zeilen ist billig.
     7. Keine Fehler in der Konsole.
   Mit VERGLEICH=<Verzeichnis> wird nur die Zeit von 1 an einem anderen
   Stand gemessen (z. B. dem vorigen, um vorher/nachher zu sehen).
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.resolve(process.env.VERGLEICH || path.join(__dirname, ".."));
const NUR_ZEIT = Boolean(process.env.VERGLEICH);
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 860 } });
  const konsole = [];
  pg.on("pageerror", (e) => konsole.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => {
    if (m.type() !== "error") return;
    const ort = (m.location() && m.location().url) || "";
    if (/Failed to load resource/.test(m.text()) && ort.indexOf(HIER) !== 0) return;
    konsole.push("console.error: " + m.text().slice(0, 160));
  });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne
    && window.DMA_PRUEFUNG && window.DMA_PRUEFUNG.chatStandAb, null, { timeout: 30000 });
  await pg.waitForTimeout(1500);
  const vorLaden = konsole.length;
  const cdp = await pg.context().newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  /* 7.400 alte Zeilen, eine Stunde bis vor einer Minute. Zeile 5 setzt Bea die Krone auf, Zeile 9 die Brille,
     Zeile 12 nimmt die Brille wieder ab – alles weit vor dem Fenster. */
  const erst = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const N = 7400, vor = Date.now() - 3600000;
    const zeilen = [];
    for (let i = 0; i < N; i++) {
      const z = { id: "z" + String(i).padStart(5, "0"), von: "u" + (i % 7), name: ["Alex", "Bea", "Cem", "Dana", "Emmi"][i % 5],
        art: "text", text: "Zeile Nummer " + i + " – ein ganz gewöhnlicher Satz im Klassenzimmer.", zeit: vor + i * 400 };
      if (i === 5) Object.assign(z, { art: "aktion", text: "Cem zieht Bea etwas an", wirkung: "anziehen", wen: "Bea", stueck: "krone" });
      if (i === 9) Object.assign(z, { art: "aktion", text: "Cem zieht Bea etwas an", wirkung: "anziehen", wen: "Bea", stueck: "brille" });
      if (i === 12) Object.assign(z, { art: "aktion", text: "Cem zieht Bea etwas aus", wirkung: "anziehen", wen: "Bea", stueck: "aus:brille" });
      zeilen.push(z);
    }
    window.__zeilen = zeilen;
    const t0 = performance.now();
    window.DMA_PRUEFUNG.chatStandAb(zeilen, Date.now());
    const ms = performance.now() - t0;
    return { ms: Math.round(ms), zeilen: document.querySelectorAll("#lcVerlauf .lc-zeile").length };
  });
  if (NUR_ZEIT) {
    console.log("VERGLEICH " + WURZEL + ": erstes Zeichnen von 7400 Zeilen " + erst.ms + " ms, " + erst.zeilen + " Zeilen im Verlauf");
    await br.close(); srv.close(); return;
  }
  await pg.waitForTimeout(300);
  const f1 = await pg.evaluate(() => window.DMA_PRUEFUNG.chatFenster());
  console.log("\n1) Betreten mit 7.400 Zeilen\n");
  sage(erst.ms < 350, "erstes Zeichnen geht schnell (4× gebremst)", erst.ms + " ms");
  sage(f1.zeilen === f1.fenster, "im Verlauf stehen nur die letzten " + f1.fenster + " Zeilen", f1.zeilen + " Zeilen");
  const id = (i) => "z" + String(i).padStart(5, "0");
  const ab1 = 7400 - f1.fenster, ab4 = ab1 - f1.mehr, ab5 = ab4 - f1.mehr;
  sage(f1.letzte === "z07399" && f1.erste === id(ab1), "es sind die NEUESTEN", f1.erste + " … " + f1.letzte);
  sage(new RegExp("\\b" + ab1 + "\\b").test(f1.aeltere), "oben steht, wie viele ältere es gibt", f1.aeltere);
  const unten = await pg.evaluate(() => { const v = document.getElementById("lcVerlauf"); return Math.round(v.scrollHeight - v.scrollTop - v.clientHeight); });
  sage(unten < 4, "der Chat steht unten", "Rest " + unten + " px");

  console.log("\n2) Anziehen außerhalb des Fensters\n");
  const bea = await pg.evaluate(() => [...document.querySelectorAll(".lc-platz")[1].querySelectorAll(".lc-kleid")].map((k) => k.dataset.lcKleid).sort().join(","));
  sage(bea === "krone", "Bea trägt die Krone (Zeile 5), die Brille ist wieder ab (Zeile 12)", bea || "nichts");

  console.log("\n3) Eine neue Zeile\n");
  const t2 = await pg.evaluate(() => {
    const z = window.__zeilen.slice();
    z.push({ id: "z07400", von: "u1", name: "Bea", art: "text", text: "Ganz neu!", zeit: Date.now(), angekommen: Date.now() });
    window.__zeilen = z;
    const t0 = performance.now();
    window.DMA_PRUEFUNG.chatWeiter(z);
    return Math.round(performance.now() - t0);
  });
  const f3 = await pg.evaluate(() => window.DMA_PRUEFUNG.chatFenster());
  sage(f3.letzte === "z07400" && f3.erste === id(ab1) && f3.zeilen === f1.fenster + 1, "kommt ans Ende, oben fällt nichts heraus", f3.erste + " … " + f3.letzte + ", " + f3.zeilen + " Zeilen");
  sage(t2 < 120, "weiterzeichnen mit 7.401 Zeilen ist billig", t2 + " ms");

  console.log("\n4) Nach oben rollen\n");
  const rollen = await pg.evaluate(async (a) => {
    const v = document.getElementById("lcVerlauf");
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    const anker = v.querySelector('[data-lc-id="' + a + '"]');
    v.dispatchEvent(new WheelEvent("wheel", { deltaY: -400, bubbles: true }));
    v.style.scrollBehavior = "auto";
    anker.scrollIntoView({ block: "start" });
    v.scrollTop = Math.min(v.scrollTop, 250);
    const vorher = anker.getBoundingClientRect().top;
    v.dispatchEvent(new Event("scroll"));
    await warte(400);
    return { vorher: Math.round(vorher), nachher: Math.round(anker.getBoundingClientRect().top) };
  }, id(ab1 + 10));
  const f4 = await pg.evaluate(() => window.DMA_PRUEFUNG.chatFenster());
  const geordnet = f4.ids.every((id, i) => i === 0 || id > f4.ids[i - 1]);
  sage(f4.erste === id(ab4) && f4.zeilen === f1.fenster + 1 + f4.mehr, "die nächsten " + f4.mehr + " älteren sind da", f4.erste + ", " + f4.zeilen + " Zeilen");
  sage(geordnet, "alles in der richtigen Reihenfolge");
  sage(Math.abs(rollen.nachher - rollen.vorher) <= 2, "die Stelle, an der man liest, bleibt stehen", rollen.vorher + " → " + rollen.nachher + " px");
  sage(new RegExp("\\b" + ab4 + "\\b").test(f4.aeltere), "der Hinweis zählt richtig", f4.aeltere);

  console.log("\n5) Hinweis antippen\n");
  await pg.evaluate(() => document.querySelector("#lcVerlauf .lc-aeltere").click());
  await pg.waitForTimeout(200);
  const f5 = await pg.evaluate(() => window.DMA_PRUEFUNG.chatFenster());
  sage(f5.erste === id(ab5) && f5.ids.every((id, i) => i === 0 || id > f5.ids[i - 1]), "Antippen lädt die nächsten dazu", f5.erste + ", " + f5.zeilen + " Zeilen");
  const doppelt = f5.ids.length - new Set(f5.ids).size;
  sage(doppelt === 0, "keine Zeile doppelt", doppelt + " doppelt");

  console.log("\n6) Auffrischen ohne Änderung\n");
  const t6 = await pg.evaluate(() => { const t0 = performance.now(); window.DMA_PRUEFUNG.chatWeiter(window.__zeilen); return Math.round(performance.now() - t0); });
  sage(t6 < 80, "ein Auffrischen mit 7.401 Zeilen ist billig", t6 + " ms");

  console.log("\n7) Quelltext\n");
  const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/lcLeseFest && String\(n\.id\) === lcLeseFest\) welche\.push/.test(quelle), "die festgehaltene Lesetafel wird auch außerhalb des Fensters gezeichnet");
  sage(/var LC_FENSTER = \d+/.test(quelle), "Fenstergröße als var (keine tote Zone)");

  const neu = konsole.slice(vorLaden);
  sage(neu.length === 0, "keine Fehler in der Konsole", neu.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
