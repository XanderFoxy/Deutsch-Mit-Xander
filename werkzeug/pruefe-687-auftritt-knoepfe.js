#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 687: DER EIGENE AUFTRITT UND DIE NEUEN KNÖPFE
   ---------------------------------------------------------------------
   XANDER (Funk 85): „jeder so einen personalisierten Effekt hat wie er
   ankommt … mit einem Ferrari reinkomme" und „die Symbole … unter den
   Chatplätzen … sehen aus wie Behelfsknöpfe … Runterhol-Knopf …
   Chat-beenden-Knopf … Apple-Logik … in der Mitte … Bilder … Tafel …
   Lehrer-Menü … Magic Button … dann könnte auch das Buch dorthin".
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75 });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 25000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
  });

  let fehler = 0;
  const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  const tick = (ms) => pg.waitForTimeout(ms);
  const tippe = async (sel) => { const m = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(300); return true; };
  const B = process.env.BILD;
  await tick(500);

  console.log("\nDIE KNÖPFE UNTER DEN PLÄTZEN\n");
  const l = await pg.evaluate(() => { const le = document.getElementById("lcLeiste"); const k = [...le.querySelectorAll(".lc-rundknopf")].filter((b) => getComputedStyle(b).display !== "none");
    const r = k.map((b) => b.getBoundingClientRect());
    return { reihe: k.map((b) => b.dataset.lc).join(","), svg: k.every((b) => b.querySelector("svg")), emoji: k.some((b) => /[\u{1F300}-\u{1FAFF}✕]/u.test(b.textContent)),
      imBild: r.every((x) => x.left >= 0 && x.right <= innerWidth), einzeilig: new Set(r.map((x) => Math.round(x.top + x.height / 2))).size === 1,
      magic: Math.round(r[k.findIndex((b) => b.dataset.lc === "magic")].width), sonst: Math.round(r[0].width),
      buch: getComputedStyle(document.getElementById("lcLeseKnopf")).display }; });
  if (B) { await pg.evaluate(() => document.getElementById("lcLeiste").scrollIntoView({ block: "center" })); await pg.screenshot({ path: B + "-leiste.png" }); }
  sage(l.reihe === "ton,bild,magic,buehne,weg" && l.svg && !l.emoji, "fünf Glasknöpfe mit gezeichneten Zeichen: Mikrofon, Kamera, Magic, Platz verlassen, Tür", JSON.stringify(l));
  sage(l.imBild && l.einzeilig && l.magic > l.sonst, "alle in einer Reihe im Bild (360 px), die Mitte ist größer", JSON.stringify(l));
  sage(l.buch === "none", "das Buch ist aus der Eingabezeile verschwunden (steckt im Magic Button)", l.buch);
  const unten = await pg.evaluate(() => { const b = document.querySelector('[data-lc="buehne"]'); b.classList.add("ist-unten"); const d = getComputedStyle(b).display; b.classList.remove("ist-unten"); return d; });
  sage(unten === "none", "wer unten sitzt, sieht kein „Platz verlassen“ (hinauf: Tipp auf einen Platz)", unten);

  console.log("\nMAGIC BUTTON FÜR SCHÜLER\n");
  await pg.evaluate(() => { Backend.isOwner = () => false; window.DMA_MAGIC.zeichnen(); window.__zeilen = []; const alt = LiveChat.schreiben; LiveChat.schreiben = (z) => { window.__zeilen.push(z); }; window.__altSchreiben = alt; });
  await tippe('[data-lc="magic"]'); await tick(300);
  const m1 = await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); const r = k && k.getBoundingClientRect();
    return { da: Boolean(k), woerter: k ? [...k.querySelectorAll(".lc-platzmenue-wort")].map((w) => w.textContent).join(",") : "", imBild: r ? r.left >= 0 && r.right <= innerWidth && r.top >= 0 : false }; });
  if (B) await pg.screenshot({ path: B + "-magic-schueler.png" });
  sage(m1.da && m1.woerter === "Bilder,Lesetext,Spiele" && m1.imBild, "Tipp auf die Mitte: Bilder, Lesetext, Spiele (kein Lehrer-Menü)", JSON.stringify(m1));
  await tippe('#lcPlatzMenue .lc-platzmenue-knopf:nth-of-type(3)'); await tick(300);
  const sp = await pg.evaluate(() => [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")].map((w) => w.textContent).join(","));
  sage(/Stadt, Land, Fluss/.test(sp) && /Schiffe versenken/.test(sp), "Spiele: Stadt, Land, Fluss · Schiffe versenken · Aufdecken", sp);
  await tippe('#lcPlatzMenue .lc-platzmenue-knopf'); await tick(200);
  const z1 = await pg.evaluate(() => window.__zeilen.slice());
  sage(z1[0] === "/slf", "Stadt, Land, Fluss startet (/slf)", JSON.stringify(z1));

  console.log("\nMAGIC BUTTON FÜR DEN BETREIBER\n");
  await pg.evaluate(() => { Backend.isOwner = () => true; try { localStorage.removeItem("dma_magic"); } catch (e) {} window.DMA_MAGIC.zeichnen(); });
  await tippe('[data-lc="magic"]'); await tick(300);
  const m2 = await pg.evaluate(() => [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")].map((w) => w.textContent).join(","));
  if (B) await pg.screenshot({ path: B + "-magic-betreiber.png" });
  sage(/Tafel/.test(m2) && /Lehrer-Menü/.test(m2) && /Belegen/.test(m2), "Betreiber: dazu Tafel, Lehrer-Menü und „Belegen“ (die Mitte)", m2);
  await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); if (k) k.remove(); });
  /* lang drücken */
  const mm = await pg.evaluate(() => { const e = document.querySelector('[data-lc="magic"]'); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await pg.mouse.move(mm.x, mm.y); await pg.mouse.down(); await tick(750); await pg.mouse.up(); await tick(300);
  const bl = await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); return { kopf: k ? k.querySelector(".lc-platzmenue-kopf").textContent : "", woerter: k ? [...k.querySelectorAll(".lc-platzmenue-wort")].map((w) => w.textContent).join(",") : "" }; });
  sage(/Mitte/.test(bl.kopf) && bl.woerter === "Alles,Bilder,Tafel,Lehrer-Menü", "lang drücken: die Mitte belegen – Alles, Bilder, Tafel, Lehrer-Menü", JSON.stringify(bl));
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Tafel/.test(x.textContent)); b.click(); });
  await tick(300);
  const bt = await pg.evaluate(() => { let m = ""; try { m = localStorage.getItem("dma_magic"); } catch (e) {} return { merk: m, art: document.querySelector('[data-lc="magic"]').dataset.art }; });
  sage(bt.merk === "tafel" && bt.art === "tafel", "Tafel gewählt: die Mitte zeigt die Tafel (gemerkt)", JSON.stringify(bt));
  await pg.evaluate(() => { window.__zeilen.length = 0; });
  await tippe('[data-lc="magic"]'); await tick(300);
  const z2 = await pg.evaluate(() => window.__zeilen.slice());
  sage(z2[0] === "/tafel", "Tipp auf die Mitte öffnet jetzt sofort die Tafel", JSON.stringify(z2));
  await pg.evaluate(() => { try { localStorage.removeItem("dma_magic"); } catch (e) {} LiveChat.schreiben = window.__altSchreiben; window.DMA_MAGIC.zeichnen(); });

  console.log("\nDER EIGENE AUFTRITT\n");
  await pg.evaluate(() => { const p = document.querySelector("#lcPlaetze .lc-platz-ich"); window.DMA_PRUEFUNG.platzMenue(p); });
  await tick(300);
  const pm = await pg.evaluate(() => [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")].map((w) => w.textContent).indexOf("Mein Auftritt") >= 0);
  sage(pm, "eigenes Platzmenü: „Mein Auftritt“", String(pm));
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Mein Auftritt/.test(x.textContent)); b.click(); });
  await tick(300);
  const aw = await pg.evaluate(() => [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")].map((w) => w.textContent).join(","));
  if (B) await pg.screenshot({ path: B + "-auftritt-menue.png" });
  sage(aw === "Ohne,Roter Sportwagen,Hot Rod,Monstertruck,Rakete,Zauberwolke", "Auswahl: Ohne, Roter Sportwagen, Hot Rod, Monstertruck, Rakete, Zauberwolke", aw);
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Sportwagen/.test(x.textContent)); b.click(); });
  await tick(1300);
  const vor = await pg.evaluate(() => { let m = ""; try { m = localStorage.getItem("dma_auftritt"); } catch (e) {} const w = document.querySelector(".lc-auftritt .lc-reisewagen-sportwagen");
    return { merk: m, wagen: Boolean(w), bild: Boolean(document.querySelector(".lc-auftritt .lc-auftritt-bild")), api: window.LiveChat.auftritt() }; });
  if (B) await pg.screenshot({ path: B + "-auftritt-vorschau.png" });
  sage(vor.merk === "sportwagen" && vor.api === "sportwagen" && vor.wagen && vor.bild, "gewählt: gemerkt, und der Sportwagen fährt gleich zur Vorschau mit dem eigenen Bild ein", JSON.stringify(vor));
  await tick(2600);
  const weg = await pg.evaluate(() => ({ buehne: Boolean(document.querySelector(".lc-auftritt")), versteckt: getComputedStyle(document.querySelector("#lcPlaetze .lc-platz-ich .lc-kreis")).visibility }));
  sage(!weg.buehne && weg.versteckt === "visible", "danach ist alles aufgeräumt, das echte Bild wieder sichtbar", JSON.stringify(weg));

  /* Was die anderen schicken */
  await pg.evaluate(() => { window.__auf = []; const alt = window.DMA_AUFTRITT; window.DMA_AUFTRITT = (id, art, r) => { window.__auf.push(id + ":" + art + ":" + r); return alt(id, art, r); }; window.__raus = []; window.LiveChat.pruefAbfangen((p) => { window.__raus.push(p); }); });
  await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "cem", name: "Cem", buehne: true, seit: 7000, auftritt: "rakete" }));
  await tick(900);
  const rein = await pg.evaluate(() => ({ auf: window.__auf.slice(), platz: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="cem"]')), buehne: Boolean(document.querySelector(".lc-auftritt-rakete")) }));
  if (B) await pg.screenshot({ path: B + "-cem-rakete.png" });
  sage(rein.auf[0] === "cem:rakete:rein" && rein.platz && rein.buehne, "Cem kommt mit „Rakete“ im Gruß: bei mir landet er als Rakete auf seinem Platz", JSON.stringify(rein));
  await tick(2200);
  await pg.evaluate(() => { window.__auf.length = 0; window.LiveChat.pruefEmpfangen({ art: "tschuess", von: "cem", auftritt: "zauber" }); });
  await tick(300);
  const raus = await pg.evaluate(() => ({ auf: window.__auf.slice(), wolke: Boolean(document.querySelector(".lc-auftritt-zauber.lc-auftritt-raus")), platz: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="cem"]')) }));
  sage(raus.auf[0] === "cem:zauber:raus" && raus.wolke && !raus.platz, "Cem geht mit „Zauberwolke“: sein Bild verpufft, der Platz ist frei", JSON.stringify(raus));
  await pg.evaluate(() => { window.__raus.length = 0; window.LiveChat.verlassen(); });
  await tick(300);
  const tsch = await pg.evaluate(() => (window.__raus.find((p) => p.art === "tschuess") || {}).auftritt);
  sage(tsch === "sportwagen", "wenn ich gehe, fährt mein Auftritt im „tschüss“ mit", String(tsch));
  sage(kf.length === 0, "keine Fehler in der Konsole", kf.join(" | "));
  console.log("\nFassung 687 auf dem Telefon: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
