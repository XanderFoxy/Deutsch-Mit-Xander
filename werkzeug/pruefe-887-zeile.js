#!/usr/bin/env node
/* PRÜFT FASSUNG 887 (L3): EINE CHATZEILE KOSTET NUR DIE CHATZEILE.
   ---------------------------------------------------------------
   Bis 886 zeichnete jede empfangene Chatzeile das ganze Klassenzimmer neu (Kopf, Plätze, Hintergrund, Chat, großes
   Bild) und sprang mit scrollTop = scrollHeight direkt nach dem Schreiben ans Ende – ein erzwungenes Layout je Zeile
   (Profil: ¾ der Zeit einer Zeile). Jetzt meldet livechat.js „zeile", die Oberfläche frischt nur den Verlauf auf, und
   der Sprung ans Ende kommt einmal je Bild im nächsten Bildaufbau.
   Raum mit 7 000 Zeilen, Klassenzimmer offen, CPU 4×, je Baum 12 Zeilen.
     Z  eine Zeile ≤ 40 ms (Median, synchron)
     D  die Zeile steht nach einem Bild im Verlauf, mit Name und Text
     H  Halten am Ende: nach zwei Bildern steht der Verlauf unten; wer hochgerollt hat, wird NICHT heruntergerissen,
        und der Knopf „↓ Neueste" erscheint
     P  die Plätze werden bei einer gewöhnlichen Zeile nicht angefasst (keine Änderung in #lcPlaetze)
     A  läuft eine Aufgabe, wird wie bisher alles gezeichnet (die Antwort bekommt ihren Notenknopf)
   Vergleich: VERGLEICH=<886-Baum> (sonst git archive 7e23e157). Gegenprobe: WURZEL=<886-Baum> → Z rot. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), { execSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : null; };
function vergleichsBaum() {
  if (process.env.VERGLEICH) return path.resolve(process.env.VERGLEICH);
  const ziel = path.join(os.tmpdir(), "dma-887-zeile-886");
  if (fs.existsSync(path.join(ziel, "app.js"))) return ziel;
  fs.mkdirSync(ziel, { recursive: true });
  const repo = path.join(__dirname, "..");
  const dateien = execSync("git -C " + JSON.stringify(repo) + " ls-tree --name-only 7e23e157", { encoding: "utf8" }).split("\n").filter(Boolean);
  const blobs = dateien.filter((f) => execSync("git -C " + JSON.stringify(repo) + " cat-file -t 7e23e157:" + JSON.stringify(f), { encoding: "utf8" }).trim() === "blob");
  execSync("git -C " + JSON.stringify(repo) + " archive 7e23e157 " + blobs.concat(["min"]).map((f) => JSON.stringify(f)).join(" ") + " | tar -x -C " + JSON.stringify(ziel));
  dateien.filter((f) => !blobs.includes(f) && !["min", "werkzeug", ".sicherung"].includes(f)).forEach((d) => { try { fs.symlinkSync(path.join(repo, d), path.join(ziel, d)); } catch (e) {} });
  return ziel;
}
function server(wurzel) {
  return new Promise((ok) => {
    const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(wurzel, p);
      if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0, () => ok(srv));
  });
}
async function lauf(br, wurzel) {
  const srv = await server(wurzel);
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75 });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && LiveChat.pruefSitz && window.DMA_PRUEF, null, { timeout: 60000 });
  await schlaf(4000);
  await pg.evaluate(() => {
    LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Xander", seit: 1000, zuruecksetzen: true, leute: { p1: { id: "p1", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    LiveChat.pruefRaum("klassenzimmer");
    const l = [], t0 = Date.now() - 7000 * 30000;
    for (let i = 0; i < 7000; i++) { const a = i % 30; l.push({ id: "z" + i, von: "p" + a, name: "Schüler" + a, text: "Hallo zusammen, Zeile " + i + (i % 7 ? "" : " lang ".repeat(20)), art: "text", zeit: t0 + i * 30000 }); }
    LiveChat.pruefVerlaufAusLager("klassenzimmer");
    LiveChat.pruefVerlaufSetzen(l);
    window.DMA_PRUEF.neuZeichnen();
  });
  await schlaf(3000);
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await schlaf(500);
  const erg = await pg.evaluate(async () => {
    const bild = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    const v = document.getElementById("lcVerlauf"), plaetze = document.getElementById("lcPlaetze");
    const unten = () => v.scrollHeight - v.scrollTop - v.clientHeight;
    let platzAenderungen = 0;
    const mo = new MutationObserver((m) => { platzAenderungen += m.length; });
    const o = { zeiten: [], da: 0, untenNach: [] };
    for (let i = 0; i < 12; i++) {
      await bild(); await new Promise((r) => setTimeout(r, 120));
      mo.observe(plaetze, { subtree: true, childList: true, attributes: true, characterData: true });
      const t = performance.now();
      LiveChat.pruefEmpfangen({ art: "text", von: "p1", name: "Bea", text: "Messung " + i + " – kurzer Satz.", id: "m" + Date.now() + i, zeit: Date.now(), chatArt: "text", kf: 1 });
      o.zeiten.push(performance.now() - t);
      mo.takeRecords().forEach(() => platzAenderungen++);
      mo.disconnect();
      await bild();
      if ([...v.querySelectorAll(".lc-zeile")].some((z) => /Messung \d+ – kurzer Satz/.test(z.textContent) && z.textContent.indexOf("Messung " + i + " ") >= 0)) o.da++;
      await bild();
      o.untenNach.push(Math.round(unten()));
    }
    o.platz = platzAenderungen;
    /* hochgerollt: nicht herunterreissen */
    v.dispatchEvent(new WheelEvent("wheel", { deltaY: -400, bubbles: true }));
    v.style.scrollBehavior = "auto"; v.scrollTop = Math.max(0, v.scrollTop - 1500);
    await new Promise((r) => setTimeout(r, 400));
    const vorher = v.scrollTop;
    LiveChat.pruefEmpfangen({ art: "text", von: "p1", name: "Bea", text: "Während ich lese", id: "lesen" + Date.now(), zeit: Date.now(), chatArt: "text", kf: 1 });
    await bild(); await bild(); await bild();
    o.hochBleibt = Math.abs(v.scrollTop - vorher) < 5;
    o.knopf = Boolean(document.getElementById("lcNachUnten"));
    return o;
  });
  /* A: eine Aufgabe läuft → volle Zeichnung, die Antwort trägt ihren Notenknopf (wie pruefe-notenknopf-aufgabe) */
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const auf = await pg.evaluate(async () => {
    const bild = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    try { LiveChat.pruefHaeuptling(true); } catch (e) {}
    let gestellt = false;
    try { LiveChat.pruefAufgabeStellen("wort", "Fahrrad"); gestellt = true; } catch (e) {}
    await bild();
    LiveChat.pruefEmpfangen({ art: "text", von: "p1", name: "Bea", text: "Fahrrad", id: "antw" + Date.now(), zeit: Date.now(), chatArt: "text", kf: 1 });
    await bild(); await bild();
    const z = [...document.querySelectorAll("#lcVerlauf .lc-zeile")].pop();
    return { gestellt, text: z ? z.textContent.slice(0, 60) : "", knopf: z ? z.querySelectorAll("button").length : -1, html: z ? z.className : "" };
  });
  await ctx.close(); srv.close();
  return { erg, auf, kf };
}
(async () => {
  const VGL = vergleichsBaum();
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const a = await lauf(br, WURZEL);
  const b = await lauf(br, VGL);
  await br.close();
  let fehler = 0;
  const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  const ma = med(a.erg.zeiten), mb = med(b.erg.zeiten);
  console.log("\n  Z  Kosten einer Zeile (7 000 Zeilen, CPU 4×)");
  ok(ma <= 40, "eine Zeile ≤ 40 ms (Median)", ma.toFixed(1) + " ms (886: " + mb.toFixed(1) + " ms); alle " + JSON.stringify(a.erg.zeiten.map(Math.round)));
  console.log("\n  D  die Zeile steht da");
  ok(a.erg.da === 12, "alle 12 Zeilen nach einem Bild im Verlauf", a.erg.da + " (886: " + b.erg.da + ")");
  console.log("\n  H  Halten am Ende");
  ok(a.erg.untenNach.every((x) => x < 5), "nach zwei Bildern unten", JSON.stringify(a.erg.untenNach) + " (886: " + JSON.stringify(b.erg.untenNach) + ")");
  ok(a.erg.hochBleibt && a.erg.knopf, "wer hochgerollt hat, bleibt oben, und „↓ Neueste“ erscheint", "bleibt " + a.erg.hochBleibt + ", Knopf " + a.erg.knopf + " (886: " + b.erg.hochBleibt + ", " + b.erg.knopf + ")");
  console.log("\n  P  Plätze");
  ok(a.erg.platz === 0, "eine gewöhnliche Zeile ändert nichts an den Plätzen", a.erg.platz + " Änderungen (886: " + b.erg.platz + ")");
  console.log("\n  A  mit Aufgabe");
  ok(a.auf.text === b.auf.text && a.auf.knopf === b.auf.knopf && a.auf.html === b.auf.html, "die Antwort wird gezeichnet wie in 886", JSON.stringify(a.auf) + " / " + JSON.stringify(b.auf));
  ok(a.kf.length === 0, "keine Seitenfehler", a.kf.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Eine Zeile kostet nur noch die Zeile.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
