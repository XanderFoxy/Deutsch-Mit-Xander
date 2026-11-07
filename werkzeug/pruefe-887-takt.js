#!/usr/bin/env node
/* PRÜFT FASSUNG 887 (L5): DER 700-MS-SPIELTAKT IM KLASSENZIMMER.
   ---------------------------------------------------------------
   Felddaten 20./22./28.10.: die längsten Bilder im Raum kamen aus spiel.js, user-callback an Zeichen 795509 – das ist
   genau dieser Takt (bis 856 ms). Er schrieb in JEDEM Takt zwei localStorage-Werte und las in schmuck()/Ring nach jedem
   Schreiben die Maße des Kreises (erzwungenes Layout, je Platz bis zu zehnmal).
   Nachgestellt wie pruefe-634-level-ruestung.js: 8 Plätze, 7 Mitspieler mit Ring, Tier, Rüstung; CPU 4×; 10 s Takt.
     L  localStorage im Takt: höchstens einmal geschrieben (886: zweimal je Takt)
     M  Maße der Kreise: je Takt höchstens einmal je Kreis gelesen (886: mehrmals je Kreis)
     G  das Ergebnis ist dasselbe wie in 886: Lage und Größe aller Schmuck-Ebenen, Ringe, Klassen der Plätze
     Z  ein Takt dauert nicht länger als in 886 (Median, Rauschgrenze 3 ms)
   Vergleich: VERGLEICH=<886-Baum> (sonst git archive 7e23e157 in TMPDIR). Gegenprobe: WURZEL=<886-Baum> → L, M rot. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), { execSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : null; };
function vergleichsBaum() {
  if (process.env.VERGLEICH) return path.resolve(process.env.VERGLEICH);
  const ziel = path.join(os.tmpdir(), "dma-887-takt-886");
  if (fs.existsSync(path.join(ziel, "spiel.js"))) return ziel;
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
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await ctx.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); localStorage.setItem("dma_spiel_kampfsymbol", "aus"); } catch (e) {}
    /* Zähler: localStorage im Takt, Maß-Lesen am Kreis, Dauer des 700-ms-Takts */
    window.__z = { ls: 0, mass: 0, takte: [], an: false };
    const si = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k) { if (window.__z.an && /^dma_spiel_(dabei|raum)$/.test(k)) window.__z.ls++; return si.apply(this, arguments); };
    ["offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"].forEach((n) => {
      const d = Object.getOwnPropertyDescriptor(HTMLElement.prototype, n);
      Object.defineProperty(HTMLElement.prototype, n, { configurable: true, get() { if (window.__z.an && this.classList && this.classList.contains("lc-kreis")) window.__z.mass++; return d.get.call(this); } });
    });
    const sI = window.setInterval;
    window.setInterval = function (f, ms) {
      if (ms === 700 && typeof f === "function") { const g = f; f = function () { const t = performance.now(); try { return g.apply(this, arguments); } finally { if (window.__z.an) window.__z.takte.push(performance.now() - t); } }; }
      return sI.call(this, f, ms);
    };
  });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL && window.DMA_SPIEL.pruef, null, { timeout: 30000 });
  await schlaf(4000);
  await pg.evaluate(() => {
    const namen = ["Bea", "Cem", "Dora", "Ezra", "Finn", "Gül", "Hana"], leute = {}, stand = {};
    const kenn = (i) => "1111111" + i + "-1111-4111-8111-11111111111" + i;
    namen.forEach((n, i) => { leute["p" + i] = { id: "p" + i, name: n, seit: 6000 + i * 100, gesehen: 9e15, buehne: true, bild: "" }; });
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000";
    window.LiveChat.spielIdVon = (id) => (/^p\d$/.test(id) ? kenn(id.slice(1)) : "");
    const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 200, pflaster: 3, traenke: 1, waffen: ["kartoffel"], mission: null,
      mana: 40, mana_max: 100, mitspielen: true, level: 3, xp: 260, xp_stufe: 100, xp_naechste: 300, skill_frei: 0, skills: {}, training: null, ladung: 40, helm: 0, brust: 0, vorraete: {}, tag_serie: 2, geschenk_offen: false };
    stand[ichId] = ich;
    namen.forEach((n, i) => { stand[kenn(i)] = { id: kenn(i), name: n, lp: 30 + i * 10, lp_max: 100, kaputt: false, schild: i % 2 ? 20 : 0, mauer_lp: 0, haustier: i % 3 ? "fellmonster" : "", flugtier: i === 4 ? "drache" : "",
      haustier_leben: 30, geschuetz: i === 2, mana: 10 * i, mana_max: 100, mitspielen: true, level: 2 + i, ladung: 10 * i, helm: i % 3, brust: i % 2, daemon: i === 5, zeigen: {} }; });
    const klient = { rpc: (name) => Promise.resolve({ data: name === "spiel_stand" ? Object.values(stand) : name === "spiel_ich" ? ich : { ok: true }, error: null }) };
    window.DMA_SPIEL.pruef.setzen({ klient, bereit: true, versucht: true, uid: ichId, ich, stand, letzterAbruf: Date.now() });
  });
  await schlaf(3000);
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await pg.evaluate(() => { window.__z.an = true; });
  await schlaf(10000);
  await pg.evaluate(() => { window.__z.an = false; });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await schlaf(1500);
  const erg = await pg.evaluate(() => {
    const reihe = document.getElementById("lcPlaetze");
    const bild = [];
    reihe.querySelectorAll(".lc-platz").forEach((el) => {
      const teile = [el.dataset.lcPlatz, el.dataset.lcId || "", [...el.classList].filter((c) => /^sp-/.test(c)).sort().join(".")];
      el.querySelectorAll(":scope > span, :scope > div").forEach((s) => { if (s.style.left || s.style.width) teile.push(s.className.split(" ")[0] + "@" + [s.style.left, s.style.top, s.style.width, s.style.height].join(",")); });
      bild.push(teile.join("|"));
    });
    return { z: window.__z, bild, takte: window.__z.takte.length };
  });
  await ctx.close(); srv.close();
  return { erg, kf };
}
(async () => {
  const VGL = vergleichsBaum();
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const a = await lauf(br, WURZEL);
  const b = await lauf(br, VGL);
  await br.close();
  let fehler = 0;
  const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  const ta = a.erg.z.takte.length, tb = b.erg.z.takte.length;
  console.log("\n  Takte in 10 s (CPU 4×): dieser " + ta + ", 886 " + tb);
  console.log("\n  L  localStorage");
  ok(ta >= 8 && a.erg.z.ls <= 1, "im Takt höchstens einmal geschrieben", a.erg.z.ls + " Mal in " + ta + " Takten (886: " + b.erg.z.ls + " in " + tb + ")");
  console.log("\n  M  Maße der Kreise");
  const kreise = 8;
  /* zeichnen() misst jeden Kreis einmal (8 × 4); ein paar Lesungen kommen aus anderen Pflegen des Takts (Loch, Tier …) */
  ok(a.erg.z.mass / Math.max(1, ta) <= kreise * 4 + 8 && a.erg.z.mass < b.erg.z.mass * 0.6, "je Takt etwa einmal je Kreis gelesen (erst lesen, dann schreiben)", (a.erg.z.mass / Math.max(1, ta)).toFixed(1) + " Lesungen je Takt (886: " + (b.erg.z.mass / Math.max(1, tb)).toFixed(1) + ")");
  console.log("\n  G  Ergebnis wie 886");
  const unterschied = a.erg.bild.findIndex((x, i) => x !== b.erg.bild[i]);
  ok(a.erg.bild.length === b.erg.bild.length && unterschied < 0, "Plätze, Klassen, Lage und Größe aller Schmuck-Ebenen gleich", unterschied < 0 ? a.erg.bild.length + " Plätze" : a.erg.bild[unterschied] + "  /  886: " + b.erg.bild[unterschied]);
  ok(a.erg.bild.some((x) => /sp-ring|sp-lp|@\d/.test(x)), "es gibt wirklich Ringe/Schmuck zu vergleichen", a.erg.bild[1]);
  console.log("\n  Z  Dauer eines Takts (CPU 4×)");
  const ma = med(a.erg.z.takte), mb = med(b.erg.z.takte);
  ok(ma != null && ma <= mb + 3, "nicht länger als 886", "Median " + (ma || 0).toFixed(1) + " ms gegen " + (mb || 0).toFixed(1) + " ms, längster " + Math.max(...a.erg.z.takte).toFixed(0) + " gegen " + Math.max(...b.erg.z.takte).toFixed(0));
  ok(a.kf.length === 0, "keine Seitenfehler", a.kf.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Spieltakt liest erst und schreibt dann – und nur, was sich ändert.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
