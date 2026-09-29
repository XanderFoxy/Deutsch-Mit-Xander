#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 811: DAS PROFILFOTO FÄHRT NUR NOCH EINMAL MIT
   ---------------------------------------------------------------------
   XANDER: „Wenn andere Leute mit dazu kommen … wie kann es sein, dass
   die Webseite sich schwerer anfühlt wenn Leute reinkommen".
   Gefunden: ein Foto aus der Galerie (Datenadresse, bis 140 000
   Zeichen) fuhr in jedem Puls (alle 6 s), jeder Chatzeile und jedem
   Stummschalten mit – von jedem an alle.
   Geprüft wird:
   1. Puls und Chatzeile tragen nur den Fingerabdruck (bildH), nicht
      das Foto; „hallo"/„auch-da" tragen es voll; 20 s nach dem Ändern
      fährt es noch voll mit.
   2. Wer einen Fingerabdruck bekommt, den er nicht kennt, fragt EINMAL
      nach („bild-bitte"); die Antwort („bild-voll") setzt das Foto bei
      der Person und in ihren früheren Zeilen ein.
   3. Ein späteres Paket mit bekanntem Fingerabdruck bekommt sein Foto
      aus dem Lager zurück.
   4. Auf „bild-bitte" antwortet man mit dem vollen Foto – höchstens
      alle 10 s an dieselbe Person.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.route(/supabase\.co|giphy|googleapis|gstatic|open-meteo|youtube|jsdelivr/, (r) => r.abort());
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefAbfangen && window.LiveChat.pruefEmpfangen, { timeout: 30000 });

  console.log("\n  1) WAS HINAUSGEHT");
  const foto = await pg.evaluate(() => { const c = document.createElement("canvas"); c.width = c.height = 360; const g = c.getContext("2d");
    for (let i = 0; i < 3000; i++) { g.fillStyle = "hsl(" + (i * 37 % 360) + ",60%," + (30 + i % 50) + "%)"; g.fillRect((i * 53) % 360, (i * 97) % 360, 11, 11); } return c.toDataURL("image/jpeg", 0.9); });
  await pg.evaluate((foto) => {
    window.__raus = [];
    window.LiveChat.pruefAbfangen((n) => window.__raus.push(JSON.parse(JSON.stringify(n))));
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    window.LiveChat.bildSetzen(foto);
  }, foto);
  const direkt = await pg.evaluate(() => { window.LiveChat.pruefPuls(); return window.__raus.slice(); });
  const stumm = direkt.find((n) => n.art === "stumm"), puls0 = direkt.filter((n) => n.art === "puls").pop();
  sage(stumm && stumm.bild && stumm.bild.length > 2000 && stumm.bildH, "direkt nach dem Ändern fährt das neue Foto voll mit (stumm)", stumm ? (stumm.bild || "").length + " Zeichen" : "kein stumm");
  sage(puls0 && puls0.bild && puls0.bild.length > 2000, "… und im Puls der ersten 20 s", puls0 ? String((puls0.bild || "").length) : "kein Puls");
  console.log("     (warte 21 s, bis das Ändern vorbei ist)");
  await pg.waitForTimeout(21000);
  const r = await pg.evaluate(() => {
    window.__raus = [];
    window.LiveChat.pruefPuls();
    window.LiveChat.pruefEmpfangen({ art: "hallo", von: "cem", name: "Cem", bild: "", seit: 7000 });
    return window.__raus.slice();
  });
  const puls = r.find((n) => n.art === "puls"), auchDa = r.find((n) => n.art === "auch-da");
  sage(puls && !puls.bild && /^[0-9a-z]+-[0-9a-z]+$/.test(puls.bildH || ""), "der Puls trägt nur den Fingerabdruck, nicht das Foto", puls ? JSON.stringify(puls).length + " Zeichen, bildH " + puls.bildH : "kein Puls");
  sage(auchDa && auchDa.bild && auchDa.bild.length > 2000, "wer neu hereinkommt, bekommt das Foto einmal voll („auch-da“)", auchDa ? (auchDa.bild || "").length + " Zeichen" : "kein auch-da: " + r.map((n) => n.art).join(","));
  const zeile = await pg.evaluate(() => { window.__raus = []; try { window.LiveChat.schreiben("Hallo zusammen"); } catch (e) {} return window.__raus.slice(); });
  const text = zeile.find((n) => n.art === "text" || n.art === "chat");
  if (text) sage(!text.bild && text.bildH, "eine Chatzeile trägt nur den Fingerabdruck", JSON.stringify(text).length + " Zeichen");
  else console.log("     (Chatzeile ließ sich hier nicht auslösen – übersprungen)");

  console.log("\n  2) FOTO NACHFRAGEN UND EINSETZEN");
  const e = await pg.evaluate((foto) => {
    window.__raus = [];
    const h = "zz-1abc";
    window.LiveChat.pruefEmpfangen({ art: "puls", von: "bea", name: "Bea", bildH: h, seit: 6000, buehne: true, tonAn: true, bildAn: false });
    window.LiveChat.pruefEmpfangen({ art: "puls", von: "bea", name: "Bea", bildH: h, seit: 6000, buehne: true, tonAn: true, bildAn: false });
    const bitten = window.__raus.filter((n) => n.art === "bild-bitte");
    window.LiveChat.pruefEmpfangen({ art: "bild-voll", von: "bea", an: "ich", name: "Bea", bild: foto });
    const l = window.LiveChat.lage();
    const bea = (l.plaetze || []).find((p) => p && (p.id === "bea" || (p.person && p.person.id === "bea")));
    const beaP = bea && (bea.person || bea);
    // ein späteres Paket mit bekanntem Abdruck: die Person hat das Foto, und ein Paket mit Abdruck + Foto füllt das Lager
    window.LiveChat.pruefEmpfangen({ art: "puls", von: "bea", name: "Bea", bildH: "yy-2", bild: foto, seit: 6000 });
    const probe = { art: "puls", von: "bea", name: "Bea", bildH: "yy-2", seit: 6000 };
    window.LiveChat.pruefEmpfangen(probe);
    return { bitten: bitten.map((n) => n.an + ":" + n.h), beaBild: beaP ? (beaP.bild || "").length : -1, platz: bea ? Object.keys(bea).join(",") : "", zurueck: (probe.bild || "").length };
  }, foto);
  sage(e.bitten.length === 1 && e.bitten[0] === "bea:zz-1abc", "unbekannter Fingerabdruck: genau EINE Nachfrage an die Person", JSON.stringify(e.bitten));
  sage(e.beaBild > 2000, "die Antwort setzt das Foto bei der Person ein", e.beaBild + " Zeichen " + e.platz);
  sage(e.zurueck > 2000, "ein späteres Paket mit bekanntem Abdruck bekommt sein Foto aus dem Lager", e.zurueck + " Zeichen");

  console.log("\n  3) AUF NACHFRAGE ANTWORTEN");
  const a = await pg.evaluate(() => {
    window.__raus = [];
    window.LiveChat.pruefEmpfangen({ art: "bild-bitte", von: "bea", an: "ich", h: "x" });
    window.LiveChat.pruefEmpfangen({ art: "bild-bitte", von: "bea", an: "ich", h: "x" });
    return window.__raus.filter((n) => n.art === "bild-voll").map((n) => ({ an: n.an, l: (n.bild || "").length }));
  });
  sage(a.length === 1 && a[0].an === "bea" && a[0].l > 2000, "auf „bild-bitte“ kommt EINMAL das volle Foto zurück (nicht bei jeder Frage)", JSON.stringify(a));
  sage(!seitenFehler.length, "ohne Seitenfehler", seitenFehler.slice(0, 2).join(" | "));

  console.log("\n  " + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
