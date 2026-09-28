#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 814: JAHRESZEITEN UND BILDREGLER DER LEICHTEN STADT
   ---------------------------------------------------------------------
   XANDER: „die Bäume sollen grün bleiben, bis der Herbst wirklich anfängt
   (Wetter oder Datum) … automatische Jahreszeiten … als Betreiber alle
   Jahreszeiten vorschauen inkl. Schnee" und „Farbverhältnis und
   Kontrastverhältnis … Regler … generell kannst du den Leuten diese
   Möglichkeit auch einräumen".
   Geprüft (Beispielstadt, ?demo=1&zeit=tag, festes Datum mit ?datum=):
   - 28.09.: Sommer, alle Laub- und Obstbäume grün (Bildname und Pixelfarbe)
   - 20.10.: gemischt – manche Bäume noch grün, manche gefärbt
   - 15.11.: Laubfall – kahle Bäume neben gefärbten
   - 10.12.: Winter mit Schnee (Bäume, Boden hell), Schneeflocken
   - 05.10. mit ?wetter=schnee: Winter schon im Oktober
   - ?jahr=herbst wie bisher: alles im Herbstbild
   - kein Ding ohne Bild (Gebäude nehmen im Sommer das Herbstbild)
   - Regler Helligkeit, Sättigung, Kontrast ändern das Bild (Boden und
     Dinge), bleiben nach dem Neuladen, „Zurücksetzen" stellt alles zurück
   - der Jahreszeit-Knopf nur für den Betreiber: Frühling → Sommer →
     Frühherbst → Spätherbst → Winter → Schneefall → Automatisch, mit Ansage
   - 360 px: Regler, Knöpfe, Karte und Schmücken ohne Überlappung,
     Tippflächen ≥ 30 px, keine Emoji-Grafiken
   - eingebettet im Spiel (Vollbild): Regler da; Wetter „schnee" vom Spiel
     (postMessage leicht-kopf, wetterArt) macht Winter
   AUFRUF:  node werkzeug/pruefe-814-jahreszeiten.js
            BILD=<ordner>  legt Bildschirmfotos dort ab
            ALT=1          Gegenprobe mit dem Stand von HEAD (muss rot sein)
            QUELLE=1       lädt die Einzeldateien statt des Bündels
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const W = path.join(__dirname, "..");
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml" };
const BILD = process.env.BILD || "";
if (BILD) fs.mkdirSync(BILD, { recursive: true });
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log("  " + (gut ? "ok  " : "FEHL") + " " + was + (zusatz ? "   " + zusatz : "")); };
/* Gegenprobe: die Dateien so ausliefern, wie sie in HEAD stehen (neue, unversionierte Bilder fehlen dann) */
const altSpeicher = new Map();
function altLesen(rel) {
  if (altSpeicher.has(rel)) return altSpeicher.get(rel);
  let b = null;
  try { b = execFileSync("git", ["-C", W, "show", "HEAD:" + rel], { maxBuffer: 64e6, stdio: ["ignore", "pipe", "ignore"] }); } catch (e) { b = null; }
  altSpeicher.set(rel, b);
  return b;
}
const ELTERN = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#222">'
  + '<iframe id="f" src="/stadt-leicht.html?eingebettet=1&demo=1&zeit=tag&datum=2026-10-10" style="border:0;display:block;width:360px;height:640px"></iframe></body></html>';

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/__eltern814.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(ELTERN); }
    const rel = p.replace(/^\/+/, ""), f = path.join(W, rel);
    if (!f.startsWith(W)) { a.writeHead(404); return a.end(); }
    if (process.env.ALT) {
      const b = altLesen(rel);
      if (!b) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); return a.end(b);
    }
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const URL0 = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const seitenfehler = [];
  const hilfe = await br.newPage();
  /* Mittlere Helligkeit und Sättigung eines Bildschirmfotos (so, wie man es sieht – mit CSS-Filtern) */
  const mittel = (buf) => hilfe.evaluate(async (b64) => {
    const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let L = 0, S = 0, K = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) { const r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b); const l = 0.3 * r + 0.59 * gg + 0.11 * b; L += l; K += l * l; S += mx ? (mx - mn) / mx : 0; n++; }
    L /= n; return { hell: +L.toFixed(1), satt: +(S / n).toFixed(3), streu: +Math.sqrt(Math.max(0, K / n - L * L)).toFixed(1) };
  }, buf.toString("base64"));

  const ctx = await br.newContext({ viewport: { width: 900, height: 700 } });
  const pg = await ctx.newPage();
  pg.setDefaultTimeout(120000);
  pg.on("pageerror", (e) => seitenfehler.push(e.message));
  const laden = async (suche, seite) => {
    const s = seite || pg;
    await s.goto(URL0 + "/stadt-leicht.html?demo=1&zeit=tag" + suche + (process.env.QUELLE ? "&quelle=1" : ""), { waitUntil: "load" });
    await s.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 }).catch(() => {});
    await s.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
    await s.waitForTimeout(700);
    await s.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 60000 }).catch(() => {});
  };
  /* Bäume im Bild: Name des gezeigten Bilds und mittlere Farbe der Krone (nur unverdeckte, ganz im Bild) */
  const baeume = (s) => (s || pg).evaluate(() => {
    const ST = window.STADT, SZ = ST.szene;
    SZ.zeichnen(performance.now());
    const c = document.getElementById("lDinge"), g = c.getContext("2d"), S = SZ.sichtbare, erg = [];
    for (let i = 0; i < S.length; i++) {
      const e = S[i]; if (!/^n_(laubbaum|obstbaum)/.test(e.o.bild)) continue;
      const m = e.meta, x0 = e.X - m.ax * e.k, y0 = e.Y - m.ay * e.k, w = m.w * e.k, h = m.h * e.k;
      const bx = [x0 + w * 0.3, y0 + h * 0.1, x0 + w * 0.7, y0 + h * 0.45];
      if (bx[0] < 0 || bx[1] < 0 || bx[2] > c.width || bx[3] > c.height) continue;
      let verdeckt = false;
      for (let j = i + 1; j < S.length && !verdeckt; j++) { const f = S[j], n = f.meta, fx = f.X - n.ax * f.k, fy = f.Y - n.ay * f.k; if (!(fx > bx[2] || fx + n.w * f.k < bx[0] || fy > bx[3] || fy + n.h * f.k < bx[1])) verdeckt = true; }
      if (verdeckt) continue;
      const d = g.getImageData(Math.round(bx[0]), Math.round(bx[1]), Math.max(1, Math.round(bx[2] - bx[0])), Math.max(1, Math.round(bx[3] - bx[1]))).data;
      let r = 0, gg = 0, b = 0, n = 0;
      for (let k = 0; k < d.length; k += 4) if (d[k + 3] > 240) { r += d[k]; gg += d[k + 1]; b += d[k + 2]; n++; }
      erg.push({ name: e.lagen[0][0], n: n, r: n ? r / n : 0, g: n ? gg / n : 0, b: n ? b / n : 0 });
    }
    return erg;
  });
  const gruen = (t) => t.n >= 30 && t.g > t.r * 1.05 && t.g > t.b;
  const gelb = (t) => t.n >= 30 && t.r >= t.g * 0.98;
  /* Jahreszeit aller Laub- und Obstbäume (am Bildnamen), dazu Tannen und Gebäude */
  const stand = (s) => (s || pg).evaluate(() => {
    const SZ = STADT.szene, LB = STADT.bilder, z = {}, fehlt = [];
    for (const o of SZ.objekte) {
      if (o.versteckt) continue;
      const b = SZ.basis(o, "tag"), j = (/_(fruehling|sommer|herbst|kahl|winter)_/.exec(b) || [])[1] || "?";
      const art = /^n_(laubbaum|obstbaum)/.test(o.bild) ? "laub" : /^n_tanne/.test(o.bild) ? "tanne" : o.art === "haus" ? "haus" : "sonst";
      z[art] = z[art] || {}; z[art][j] = (z[art][j] || 0) + 1;
      if (!(LB.vz[b + "_k"] || LB.vz[b + "_m"] || LB.vz[b + "_z"])) fehlt.push(b);
    }
    return { jahr: SZ.jahr, modus: SZ.modus, schneefall: SZ.schneefall, z: z, fehlt: fehlt.slice(0, 5), nFehlt: fehlt.length };
  });
  const foto = async (name, s) => { if (BILD) await (s || pg).screenshot({ path: path.join(BILD, name) }); };
  /* Bildschirmfoto nur der Karte (Bedienung ausgeblendet), gemittelt */
  const kartenMittel = async (s) => {
    s = s || pg;
    await s.evaluate(() => { document.getElementById("lOber").style.visibility = "hidden"; STADT.leicht.unruhe = 3; });
    await s.waitForTimeout(250);
    const m = await mittel(await s.screenshot());
    await s.evaluate(() => { document.getElementById("lOber").style.visibility = ""; });
    return m;
  };
  const versuch = async (was, fn) => { try { await fn(); } catch (e) { sage(false, was, "Fehler: " + String(e.message || e).split("\n")[0].slice(0, 160)); } };

  console.log("\nJAHRESZEITEN UND BILDREGLER (Fassung 814)" + (process.env.ALT ? " — GEGENPROBE mit HEAD" : "") + "\n");

  /* ---------- 28.09.: alles grün ---------- */
  let sep = null;
  await versuch("28.09.", async () => {
    await laden("&datum=2026-09-28");
    const st = await stand();
    const lb = st.z.laub || {};
    sage(st.jahr === "sommer", "28.09.: die Stadt ist noch im Sommer", "jahr=" + st.jahr + " modus=" + st.modus);
    sage((lb.sommer || 0) > 5 && Object.keys(lb).length === 1, "28.09.: alle Laub- und Obstbäume zeigen das Sommerbild", JSON.stringify(lb));
    const t = await baeume(), g = t.filter(gruen).length, y = t.filter(gelb).length;
    sage(t.length >= 4 && g >= t.length * 0.8 && y === 0, "28.09.: die Kronen im Bild sind grün (Pixelfarbe)", g + " grün, " + y + " gelb von " + t.length + (t[0] ? " – z. B. rgb(" + [t[0].r, t[0].g, t[0].b].map((v) => v | 0).join(",") + ")" : ""));
    sage(st.nFehlt === 0 && (st.z.haus || {}).herbst > 0, "kein Ding ohne Bild – Gebäude und Tannen nehmen im Sommer das Herbstbild", st.nFehlt + " fehlen " + st.fehlt.join(",") + " · Häuser " + JSON.stringify(st.z.haus) + " · Tannen " + JSON.stringify(st.z.tanne));
    const lage = await pg.evaluate(() => { const b = document.querySelector(".lk-kopf-rechts .lk-knopf[title='Jahreszeit']"); const f = document.querySelector(".lk-kopf-rechts .lk-knopf[title='Farbstimmung']"); return { jahrVersteckt: !!b && b.hidden, farbDa: !!f && !f.hidden && f.getBoundingClientRect().width > 0 }; });
    sage(lage.jahrVersteckt && lage.farbDa, "ohne Betreiber: kein Jahreszeit-Knopf, der Bildregler-Knopf ist für alle da", JSON.stringify(lage));
    sep = await kartenMittel();
    await foto("814-0928.png");
  });

  /* ---------- 20.10.: gemischt ---------- */
  await versuch("20.10.", async () => {
    await laden("&datum=2026-10-20");
    const st = await stand(), lb = st.z.laub || {};
    sage(st.jahr === "herbst" && (lb.sommer || 0) > 0 && (lb.herbst || 0) > 0 && (lb.herbst || 0) > (lb.sommer || 0), "20.10.: gestaffelt – die meisten Bäume gefärbt, einige noch grün", JSON.stringify(lb));
    const t = await baeume(), g = t.filter(gruen).length, y = t.filter(gelb).length;
    sage(g >= 1 && y >= 1, "20.10.: im Bild grüne und gelbe Kronen nebeneinander (Pixelfarbe)", g + " grün, " + y + " gelb von " + t.length);
    const tage = await pg.evaluate(() => { const L = STADT.szene.objekte.filter((o) => /^n_(laubbaum|obstbaum)/.test(o.bild)).map((o) => STADT.szene.baumTage(o)[0]); return { min: Math.min(...L), max: Math.max(...L), verschieden: new Set(L).size, n: L.length }; });
    sage(tage.min >= 1 && tage.max <= 25 && tage.verschieden >= 8, "jeder Baum färbt sich an seinem eigenen Tag zwischen 1. und 25. Oktober", JSON.stringify(tage));
    await foto("814-1020.png");
    await laden("&datum=2026-10-12");
    const st12 = await stand();
    await laden("&datum=2026-10-12");
    const st12b = await stand();
    sage(JSON.stringify(st12.z.laub) === JSON.stringify(st12b.z.laub), "fester Zufall: am selben Tag färben sich dieselben Bäume (nach Neuladen gleich)", JSON.stringify(st12.z.laub));
  });

  /* ---------- 15.11.: Laubfall ---------- */
  await versuch("15.11.", async () => {
    await laden("&datum=2026-11-15");
    const st = await stand(), lb = st.z.laub || {};
    sage(st.jahr === "herbst" && (lb.kahl || 0) > 0 && (lb.herbst || 0) > 0 && !lb.sommer, "15.11.: Laubfall – kahle Bäume neben gefärbten, keiner mehr grün", JSON.stringify(lb));
    await foto("814-1115.png");
  });

  /* ---------- 10.12.: Winter ---------- */
  await versuch("10.12.", async () => {
    await laden("&datum=2026-12-10");
    const st = await stand(), lb = st.z.laub || {};
    sage(st.jahr === "winter" && (lb.winter || 0) > 0 && Object.keys(lb).length === 1 && st.schneefall, "10.12.: Winter – Schnee auf den Bäumen, Flocken fallen", JSON.stringify({ lb, schneefall: st.schneefall }));
    const dez = await kartenMittel();
    sage(!!sep && dez.hell > sep.hell + 20, "10.12.: das Bild ist schneehell (heller als am 28.09.)", JSON.stringify({ sep, dez }));
    await foto("814-1210.png");
  });

  /* ---------- Schnee nach Wetter, Herbst fest ---------- */
  await versuch("Wetter", async () => {
    await laden("&datum=2026-10-05&wetter=schnee");
    const st = await stand();
    sage(st.jahr === "winter" && (st.z.laub || {}).winter > 0 && st.schneefall, "05.10. mit Wetter „Schnee“: Winter schon im Oktober", JSON.stringify({ jahr: st.jahr, lb: st.z.laub }));
    await laden("&jahr=herbst");
    const h = await stand();
    sage(h.jahr === "herbst" && Object.keys(h.z.laub || {}).join() === "herbst", "?jahr=herbst wie bisher: alle Bäume im Herbstbild", JSON.stringify(h.z.laub));
  });

  /* ---------- Regler ---------- */
  await versuch("Regler", async () => {
    await laden("&datum=2026-09-28");
    const vor = await kartenMittel();
    await pg.click(".lk-kopf-rechts .lk-knopf[title='Farbstimmung']");
    await pg.waitForSelector("#lkRegler_hell", { state: "visible", timeout: 5000 });
    const stell = (id, v) => pg.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); }, [id, v]);
    await stell("lkRegler_hell", 60);
    const dunkel = await kartenMittel();
    sage(dunkel.hell < vor.hell * 0.8, "Helligkeit 60 %: das Bild wird dunkler", vor.hell + " → " + dunkel.hell);
    await stell("lkRegler_hell", 100); await stell("lkRegler_satt", 0);
    const grau = await kartenMittel();
    sage(grau.satt < vor.satt * 0.35, "Sättigung 0 %: das Bild wird grau", vor.satt + " → " + grau.satt);
    await stell("lkRegler_satt", 100); await stell("lkRegler_kontrast", 150);
    const hart = await kartenMittel();
    sage(hart.streu > vor.streu * 1.15, "Kontrast 150 %: die Unterschiede werden größer", vor.streu + " → " + hart.streu);
    const f = await pg.evaluate(() => [document.getElementById("lBoden").style.filter, document.getElementById("lDinge").style.filter]);
    sage(f[0] === f[1] && /contrast\(1\.5\)/.test(f[0]), "Boden und Dinge bekommen denselben Filter", f[0]);
    await stell("lkRegler_hell", 80); await stell("lkRegler_satt", 120);
    await laden("&datum=2026-09-28");
    const nach = await pg.evaluate(() => ({ hell: document.getElementById("lkRegler_hell").value, satt: document.getElementById("lkRegler_satt").value, kontrast: document.getElementById("lkRegler_kontrast").value, filter: document.getElementById("lDinge").style.filter }));
    sage(nach.hell === "80" && nach.satt === "120" && nach.kontrast === "150" && /brightness\(0\.8\)/.test(nach.filter), "die Regler bleiben nach dem Neuladen, wie man sie gestellt hat", JSON.stringify(nach));
    await pg.click(".lk-kopf-rechts .lk-knopf[title='Farbstimmung']");
    await foto("814-regler.png");
    await pg.click(".lk-regler-zurueck");
    const zur = await pg.evaluate(() => ({ werte: ["farbe", "hell", "satt", "kontrast"].map((k) => document.getElementById("lkRegler_" + k).value).join(","), filter: document.getElementById("lDinge").style.filter, merk: ["leicht_hell", "leicht_satt", "leicht_kontrast"].map((k) => localStorage.getItem(k)) }));
    sage(zur.werte === "100,100,100,100" && !/brightness|contrast\(1\.5\)/.test(zur.filter) && zur.merk.every((v) => v == null), "„Zurücksetzen“ stellt alles auf 100 % und vergisst die Werte", JSON.stringify(zur));
  });

  /* ---------- Betreiber-Vorschau ---------- */
  await versuch("Betreiber", async () => {
    await laden("&datum=2026-09-28");
    await pg.evaluate(() => { STADT.spiel.betreiber = true; STADT.oberflaeche.betreiberDa(); });
    const knopf = ".lk-kopf-rechts .lk-knopf[title='Jahreszeit']";
    sage(await pg.evaluate((k) => !document.querySelector(k).hidden, knopf), "der Betreiber sieht den Jahreszeit-Knopf");
    const erwartet = [["fruehling", "Frühling", "fruehling"], ["sommer", "Sommer", "sommer"], ["fruehherbst", "Frühherbst", null], ["spaetherbst", "Spätherbst", null], ["winter", "Winter", "winter"], ["schneefall", "Schneefall", "winter"], ["auto", "Automatisch", "sommer"]];
    const gesehen = [];
    let gut = true;
    for (const [modus, ansage, baum] of erwartet) {
      await pg.click(knopf);
      await pg.waitForTimeout(150);
      const r = await pg.evaluate(() => ({ modus: STADT.szene.modus, jahr: STADT.szene.jahr, fall: STADT.szene.schneefall, ansage: (document.querySelector(".lk-ansage") || {}).textContent || "" }));
      const st = await stand(), lb = st.z.laub || {};
      let ok = r.modus === modus && r.ansage.indexOf(ansage) === 0;
      if (baum) ok = ok && Object.keys(lb).join() === baum;
      if (modus === "fruehherbst") ok = ok && r.jahr === "herbst" && lb.sommer > 0 && lb.herbst > 0;
      if (modus === "spaetherbst") ok = ok && r.jahr === "herbst" && lb.kahl > 0;
      if (modus === "winter") ok = ok && r.fall === false;
      if (modus === "schneefall") ok = ok && r.fall === true;
      if (!ok) gut = false;
      gesehen.push(r.ansage + " " + JSON.stringify(lb) + (ok ? "" : " <- falsch"));
      if (BILD && (modus === "fruehling" || modus === "fruehherbst" || modus === "spaetherbst")) { await pg.waitForFunction(() => STADT.bilder.offen() === 0, null, { timeout: 30000 }).catch(() => {}); await pg.waitForTimeout(400); await foto("814-vorschau-" + modus + ".png"); }
    }
    sage(gut, "der Knopf schaltet Frühling → Sommer → Frühherbst → Spätherbst → Winter → Schneefall → Automatisch, mit Ansage", gesehen.join(" | "));
  });

  /* ---------- 360 px ---------- */
  await versuch("360 px", async () => {
    const ctx2 = await br.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const p2 = await ctx2.newPage(); p2.setDefaultTimeout(120000);
    p2.on("pageerror", (e) => seitenfehler.push(e.message));
    await laden("&datum=2026-09-28", p2);
    await p2.evaluate(() => { STADT.spiel.betreiber = true; STADT.oberflaeche.betreiberDa(); });
    await p2.tap(".lk-kopf-rechts .lk-knopf[title='Farbstimmung']");
    await p2.waitForTimeout(300);
    const r = await p2.evaluate(() => {
      const k = (s) => { const e = document.querySelector(s); if (!e || e.hidden) return null; const b = e.getBoundingClientRect(); return { s, x: b.left, y: b.top, r: b.right, u: b.bottom, w: b.width, h: b.height }; };
      const alle = [".lk-kopf-links", ".lk-kopf-rechts", ".lk-farbfeld", ".lk-mini-rahmen", ".lk-schmuck:not(.lk-bauen)", ".lk-bauen"].map(k).filter(Boolean);
      const tipp = [...document.querySelectorAll(".lk-farbfeld input[type=range], .lk-farbfeld button, .lk-spar, .lk-kopf-rechts .lk-knopf:not([hidden])")].map((e) => { const b = e.getBoundingClientRect(); return { t: e.id || e.className || e.tagName, w: b.width, h: b.height }; });
      const zeilen = [...document.querySelectorAll(".lk-farbfeld .lk-regler, .lk-regler-zurueck, .lk-spar")].map((e) => { const b = e.getBoundingClientRect(); return { y: b.top, u: b.bottom }; });
      const text = document.getElementById("lOber").textContent;
      return { alle, tipp, zeilen, breit: document.documentElement.scrollWidth, emoji: (text.match(/\p{Extended_Pictographic}/gu) || []).join("") };
    });
    const ueber = (a, b) => !(a.r <= b.x + 0.5 || b.r <= a.x + 0.5 || a.u <= b.y + 0.5 || b.u <= a.y + 0.5);
    const paare = [];
    for (let i = 0; i < r.alle.length; i++) for (let j = i + 1; j < r.alle.length; j++) if (ueber(r.alle[i], r.alle[j])) paare.push(r.alle[i].s + "/" + r.alle[j].s);
    const ff = r.alle.find((a) => a.s === ".lk-farbfeld");
    sage(!!ff && paare.length === 0 && ff.x >= 0 && ff.r <= 360 && r.breit <= 360, "360 px: Regler, Knöpfe, Karte und Schmücken überlappen nicht, nichts ragt hinaus", paare.join(", ") || JSON.stringify(ff && [ff.x | 0, ff.y | 0, ff.r | 0, ff.u | 0]) + " Seite " + r.breit);
    const klein = r.tipp.filter((t) => t.w < 30 || t.h < 30);
    sage(r.tipp.length >= 8 && klein.length === 0, "360 px: alle Tippflächen mindestens 30 px", klein.map((t) => t.t + " " + (t.w | 0) + "×" + (t.h | 0)).join(", ") || r.tipp.length + " geprüft");
    let zOk = true; for (let i = 1; i < r.zeilen.length; i++) if (r.zeilen[i].y < r.zeilen[i - 1].u - 0.5) zOk = false;
    sage(zOk && r.zeilen.length >= 6, "die Zeilen im Reglerfeld stehen untereinander, ohne sich zu überdecken", r.zeilen.length + " Zeilen");
    sage(!r.emoji, "keine Emoji-Grafiken in der Bedienung", r.emoji);
    await foto("814-360.png", p2);
    await ctx2.close();
  });

  /* ---------- eingebettet im Spiel ---------- */
  await versuch("eingebettet", async () => {
    const ctx3 = await br.newContext({ viewport: { width: 360, height: 640 } });
    const p3 = await ctx3.newPage(); p3.setDefaultTimeout(120000);
    p3.on("pageerror", (e) => seitenfehler.push(e.message));
    await p3.goto(URL0 + "/__eltern814.html");
    const fr = await (await p3.waitForSelector("#f")).contentFrame();
    await fr.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
    await p3.evaluate(() => document.getElementById("f").contentWindow.postMessage({ typ: "leicht-modus", voll: true }, location.origin));
    await p3.waitForTimeout(500);
    const da = await fr.evaluate(() => { const f = document.querySelector(".lk-kopf-rechts .lk-knopf[title='Farbstimmung']"); const b = f && f.getBoundingClientRect(); return { sichtbar: !!f && !f.hidden && getComputedStyle(f).display !== "none" && b.width >= 30, jahr: STADT.szene.jahr }; });
    await fr.click(".lk-kopf-rechts .lk-knopf[title='Farbstimmung']").catch(() => {});
    const offen = await fr.evaluate(() => { const f = document.querySelector(".lk-farbfeld"); return !!f && !f.hidden && f.getBoundingClientRect().height > 100 && !!document.getElementById("lkRegler_kontrast"); });
    sage(da.sichtbar && offen, "eingebettet im Vollbild: die Regler sind für alle da", JSON.stringify(Object.assign(da, { offen })));
    await p3.evaluate(() => document.getElementById("f").contentWindow.postMessage({ typ: "leicht-kopf", name: "Teststadt", wetter: "", wetterArt: "schnee" }, location.origin));
    await p3.waitForTimeout(400);
    const w1 = await fr.evaluate(() => ({ jahr: STADT.szene.jahr, fall: STADT.szene.schneefall, baum: STADT.szene.basis(STADT.szene.objekte.find((o) => /^n_laubbaum/.test(o.bild)), "tag") }));
    sage(da.jahr === "herbst" && w1.jahr === "winter" && w1.fall && /_winter_/.test(w1.baum), "10.10.: meldet das Spiel Schnee (wetterArt), liegt Schnee und es schneit", JSON.stringify({ vorher: da.jahr, nachher: w1 }));
    await p3.evaluate(() => document.getElementById("f").contentWindow.postMessage({ typ: "leicht-kopf", name: "Teststadt", wetter: "", wetterArt: "klar" }, location.origin));
    await p3.waitForTimeout(400);
    const w2 = await fr.evaluate(() => ({ jahr: STADT.szene.jahr, fall: STADT.szene.schneefall }));
    sage(w2.jahr === "winter" && w2.fall === false, "danach klares Wetter: der Schnee bleibt liegen, es schneit nicht mehr", JSON.stringify(w2));
    await foto("814-eingebettet.png", p3);
    await ctx3.close();
  });

  sage(seitenfehler.length === 0, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
