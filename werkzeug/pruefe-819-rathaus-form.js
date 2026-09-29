#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 819: DER GRUNDRISS DES DÖBELNER RATHAUSES
   ---------------------------------------------------------------------
   XANDER (Funk 206): „Stelle dir mal ein ganz simples Kirchengebäude vor
   dann hat man links den Turm und rechts das Seitenschiff … die Rückseite
   von dem Turm hat auch noch mal so ein Hausschiff abgehen … und das geht
   offenbar ein bisschen länger … auf der linken Seite ist es nicht direkt
   nach links zur Seite sondern eher schräg nach vorne … deswegen darfst du
   niemals den Eingang irgendwie verbauen … im Prinzip ist das ganze wie ein
   dreizackiger Stern … in der Draufsicht … das seitliche rechts vom Eingang
   abgehend und das was hinter dem Turm ist ein perfekter rechter Winkel wie
   ein L und das einzige was schräg ist ist das seitliche Schiff".
   Walkie 305: „vor dem Brunnen siehst du praktisch den Eingang … rechts
   neben dem Eingang gibt es nichts was wie eine Mauer neben dem Eingang
   nach vorne geht sondern die Seite geht zur Seite nach rechts".
   Geprüft:
   - Modell (stadt/modelle/rathaus_doebeln.js, def.grundriss): Turm und
     drei Flügel – A nach rechts, B nach hinten (länger als A), C schräg
     nach vorn links; A–B genau 90°, C 25–50° zur Front; rechts neben dem
     Portal springt nichts vor (A hinter der Turmfront), C bleibt links
     der Turmkante
   - dorf.js: D.GRUNDRISS und die Grundfläche passen zum Modell, dreh 3,5
   - im Dorf (?demo=1): das Portal schaut zum Brunnen, liegt frontal
     dahinter (von vorn gesehen), zwischen Brunnen und Portal kein Flügel
   - kein Flügel auf einem Haus, Wahrzeichen, Weg, der Pferdebahn-Straße
     oder dem Fluss; Leute vor dem Portal werden vor dem Rathaus gemalt
   AUFRUF: node werkzeug/pruefe-819-rathaus-form.js   (QUELLE=1: Einzeldateien,
           BILD=präfix: Bildschirmfotos Karte nah, Winter-Nacht, Draufsicht)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), vm = require("vm");
const W = path.join(__dirname, "..");
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log("  " + (gut ? "ok  " : "FEHL") + " " + was + (zusatz ? "   " + zusatz : "")); };
const r1 = (z) => Math.round(z * 10) / 10;

/* ---------- Geometrie ---------- */
const mitte = (P) => { let x = 0, y = 0; for (const p of P) { x += p[0]; y += p[1]; } return [x / P.length, y / P.length]; };
const winkel = (v) => Math.atan2(v[1], v[0]) * 180 / Math.PI;
const zwischen = (a, b) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
/* Trennachsen-Test zweier konvexer Vielecke (Überlappung tiefer als tol) */
const ueberlappen = (A, B, tol) => {
  for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[(i + 1) % P.length], nx = q[1] - p[1], ny = p[0] - q[0], l = Math.hypot(nx, ny) || 1;
    const pr = (Q) => Q.map((e) => (e[0] * nx + e[1] * ny) / l);
    const a = pr(A), b = pr(B);
    if (Math.max(...a) < Math.min(...b) + tol || Math.max(...b) < Math.min(...a) + tol) return false;
  }
  return true;
};
const schneiden = (p1, p2, q1, q2) => {
  const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = d(q1, q2, p1), d2 = d(q1, q2, p2), d3 = d(p1, p2, q1), d4 = d(p1, p2, q2);
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
};
const strecheTrifft = (a, b, poly) => {
  for (let i = 0; i < poly.length; i++) if (schneiden(a, b, poly[i], poly[(i + 1) % poly.length])) return true;
  return false;
};
const abstandPunktPoly = (p, poly) => {
  let innen = false, d = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) innen = !innen;
    const dx = xj - xi, dy = yj - yi, l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((p[0] - xi) * dx + (p[1] - yi) * dy) / l2));
    d = Math.min(d, Math.hypot(p[0] - xi - dx * t, p[1] - yi - dy * t));
  }
  return innen ? -d : d;
};

(async () => {
  console.log("\nDÖBELNER RATHAUS — GRUNDRISS (Fassung 819)\n");
  /* ---------- 1. Das Modell selbst ---------- */
  const MOD = {};
  const ctx = { window: { STADT: { pinsel: {}, KX: 1, KY: 0.5, KZ: 1, modell: (id, def) => { MOD[id] = def; }, hash2: () => 0.5 } }, Math, Object, Array, console, Map, document: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(W, "stadt", "modelle", "rathaus_doebeln.js"), "utf8"), ctx);
  const G = MOD.rathaus_doebeln && MOD.rathaus_doebeln.grundriss;
  sage(!!G && G.teile && ["turm", "A", "B", "C"].every((k) => G.teile[k] && G.teile[k].length), "das Modell hat Turm und drei Flügel A, B, C (def.grundriss)", G ? Object.keys(G.teile).join(", ") : "kein grundriss");
  if (!G) { console.log("\n" + fehler + " FEHLER\n"); process.exit(1); }
  const turm = G.teile.turm[0], tm = mitte(turm);
  const tX0 = Math.min(...turm.map((p) => p[0])), tX1 = Math.max(...turm.map((p) => p[0])), tY0 = Math.min(...turm.map((p) => p[1])), tY1 = Math.max(...turm.map((p) => p[1]));
  const alle = (k) => G.teile[k].flat();
  const richtung = (k) => { const m = mitte(alle(k)); return [m[0] - tm[0], m[1] - tm[1]]; };
  const wA = winkel(richtung("A")), wB = winkel(richtung("B")), wC = winkel(richtung("C"));
  /* Modell: +y = vorn (Portal), +x = rechts (von vorn gesehen) */
  sage(zwischen(wA, 0) < 30 && zwischen(wB, -90) < 30 && wC > 90 && wC < 180, "dreizackiger Stern: A geht nach rechts, B nach hinten, C nach vorn links", JSON.stringify({ A: r1(wA), B: r1(wB), C: r1(wC) }));
  const kanten = (k) => G.teile[k].flatMap((P) => P.map((p, i) => { const q = P[(i + 1) % P.length]; return [q[0] - p[0], q[1] - p[1]]; })).filter((v) => Math.hypot(v[0], v[1]) > 1.5);
  const achsig = (k) => kanten(k).every((v) => Math.min(zwischen(winkel(v), 0), zwischen(winkel(v), 90), zwischen(winkel(v), 180), zwischen(winkel(v), -90)) < 0.5);
  const aB = G.achsen.A, bB = G.achsen.B, cB = G.achsen.C;
  const wAB = Math.acos(Math.abs(aB[0] * bB[0] + aB[1] * bB[1]) / Math.hypot(...aB) / Math.hypot(...bB)) * 180 / Math.PI;
  sage(achsig("A") && achsig("B") && Math.abs(wAB - 90) < 0.5, "A und B stehen im perfekten rechten Winkel (L-Form, alle Wände achsparallel)", "A–B " + r1(wAB) + "°");
  const wCfront = zwischen(winkel(cB), 180);
  const schraeg = kanten("C").filter((v) => Math.min(zwischen(winkel(v), 0), zwischen(winkel(v), 90), zwischen(winkel(v), 180), zwischen(winkel(v), -90)) > 10);
  sage(wCfront >= 25 && wCfront <= 50 && cB[1] > 0 && schraeg.length >= 3, "C ist das einzige schräge Schiff: " + r1(wCfront) + "° zur Front, nach vorn", schraeg.length + " schräge Wände");
  const lang = (k, fn) => Math.max(...alle(k).map(fn));
  const laengeA = lang("A", (p) => p[0]) - tX1, laengeB = tY0 - Math.min(...alle("B").map((p) => p[1]));
  sage(laengeB > laengeA && laengeB < laengeA * 1.5, "B hinter dem Turm ist etwas länger als A", JSON.stringify({ A: r1(laengeA), B: r1(laengeB) }));
  const vorA = Math.max(...alle("A").map((p) => p[1]));
  sage(vorA <= tY1 + 0.01, "rechts neben dem Portal springt nichts vor (A liegt hinter der Turmfront)", JSON.stringify({ turmfront: r1(tY1), frontA: r1(vorA) }));
  sage(Math.max(...alle("C").map((p) => p[0])) <= tX0 + 0.01 && Math.max(...alle("B").map((p) => p[1])) <= tY0 + 0.01, "C liegt ganz links der Turmkante, B ganz hinter dem Turm: das Portal ist frei", JSON.stringify({ C_rechts: r1(Math.max(...alle("C").map((p) => p[0]))), turmLinks: r1(tX0) }));
  sage(Math.abs(G.portal[0] - tm[0]) < 0.01 && Math.abs(G.portal[1] - tY1) < 0.01, "das Portal liegt mitten in der Turmfront", JSON.stringify(G.portal));

  /* ---------- 2. Im Dorf ---------- */
  const srv = http.createServer((q, a) => { const p = decodeURIComponent(q.url.split("?")[0]); const f = path.join(W, p); if (!f.startsWith(W) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(e.message));
  const laden = async (zusatz) => {
    await pg.goto(`http://127.0.0.1:${srv.address().port}/stadt-leicht.html?demo=1${process.env.QUELLE ? "&quelle=1" : ""}${zusatz || ""}`);
    await pg.waitForFunction(() => window.__fertig, { timeout: 120000 }).catch(() => {});
    await pg.waitForTimeout(600);
  };
  const warteBilder = () => pg.waitForFunction(() => window.STADT.bilder.offen() === 0, { timeout: 60000 }).catch(() => {});
  await laden("&zeit=tag&jahr=herbst");
  const d = await pg.evaluate(() => {
    const ST = window.STADT, D = ST.dorf, SZ = ST.szene;
    const o = SZ.objekte.find((x) => x.spiel === "rathaus");
    const brunnen = SZ.objekte.find((x) => x.bild === "d_brunnen");
    const andere = SZ.objekte.filter((x) => x !== o && (x.art === "haus" || x.art === "wunder" || (x.art === "kulisse" && /bahnhof|bootshaus/.test(x.bild || "")))).map((x) => ({ k: x.spiel || x.bild, e: SZ.ecken(x) }));
    const Tw = o.grundriss.map((poly) => poly.map(([x, y]) => { const a = o.dreh * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), k = o.stufe; return [o.x + (x * c - y * s) * k, o.y + (x * s + y * c) * k]; }));
    const P = D.GRUNDRISS.rathaus.portal, a = o.dreh * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), k = o.stufe;
    const welt = (x, y) => [o.x + (x * c - y * s) * k, o.y + (x * s + y * c) * k];
    const portal = welt(P[0], P[1]), portalL = welt(P[0] - 0.85, P[1]), portalR = welt(P[0] + 0.85, P[1]), vorPortal = welt(P[0], P[1] + 0.3);
    const vorPunkt = welt(P[0], P[1] + 3 / k), hinterB = welt(-3.6, -20);
    const pa = ST.drehXY(vorPunkt[0], vorPunkt[1], ST.kamera.dreh), pb = ST.drehXY(hinterB[0], hinterB[1], ST.kamera.dreh);
    const R = o._R || null;
    return {
      o: { x: o.x, y: o.y, dreh: o.dreh, stufe: o.stufe, fuss: o.fuss, bild: o.bild }, bildFuss: D.BILD.rathaus[2], mass: D.MASS.rathaus, grundDorf: D.GRUNDRISS.rathaus,
      Tw, portal, portalL, portalR, vorPortal, facing: [c * 0 - s * 1, s * 0 + c * 1], brunnen: brunnen && [brunnen.x, brunnen.y], andere,
      pferdebahn: D.PFERDEBAHN, wege: D.WEGE, fluss: D.FLUSS, tuerWeg: D.tuer("rathaus", 2.2),
      leuteVor: !!R && !!R.teile && SZ.vorTeilen(R.teile, pa[0], pa[1]), leuteHinten: !!R && !!R.teile && SZ.vorTeilen(R.teile, pb[0], pb[1]),
      basis: SZ.basis(o, "tag")
    };
  });
  /* Dorf ↔ Modell */
  const gleich = ["turm", "A", "B", "C"].flatMap((k) => G.teile[k]);
  let abw = gleich.length === d.grundDorf.teile.length ? 0 : Infinity;
  if (isFinite(abw)) gleich.forEach((P, i) => { const Q = d.grundDorf.teile[i]; if (!Q || Q.length !== P.length) abw = Infinity; else P.forEach((p, j) => { abw = Math.max(abw, Math.hypot(p[0] - Q[j][0], p[1] - Q[j][1])); }); });
  abw = Math.max(abw, Math.hypot(G.portal[0] - d.grundDorf.portal[0], G.portal[1] - d.grundDorf.portal[1]));
  sage(abw < 0.03, "D.GRUNDRISS.rathaus in dorf.js passt zum Modell (Flügel und Portal)", "größte Abweichung " + (isFinite(abw) ? abw.toFixed(3) : "—") + " m");
  sage(Math.abs(d.bildFuss[0] - G.grund[0]) < 0.05 && Math.abs(d.bildFuss[1] - G.grund[1]) < 0.05 && Math.abs(d.o.fuss[0] - G.grund[0] * d.mass) < 0.05, "Grundfläche (D.BILD.rathaus) = Umriss des Modells, mit Maßstab in der Welt", JSON.stringify({ fussBild: d.bildFuss, grund: G.grund, fussWelt: d.o.fuss.map(r1) }));
  sage(d.o.dreh === 3.5 && /_f_315$/.test(d.basis), "das Rathaus schaut wie alle Häuser zum Betrachter (dreh 3,5, Bild von vorn)", JSON.stringify({ dreh: d.o.dreh, bild: d.basis }));
  /* Portal ↔ Brunnen */
  const zumBr = [d.brunnen[0] - d.portal[0], d.brunnen[1] - d.portal[1]], ab = Math.hypot(...zumBr);
  const wBr = zwischen(winkel(zumBr), winkel(d.facing));
  const uP = d.portal[0] - d.portal[1], uB = d.brunnen[0] - d.brunnen[1], vP = d.portal[0] + d.portal[1], vB = d.brunnen[0] + d.brunnen[1];
  sage(wBr < 6 && Math.abs(uP - uB) / Math.SQRT2 < 0.6 && vB > vP && ab > 3.5 && ab < 9, "das Portal schaut zum Brunnen und liegt von vorn gesehen genau dahinter", JSON.stringify({ winkel: r1(wBr), seitlich: r1((uP - uB) / Math.SQRT2), abstand: r1(ab) }));
  const blockiert = [];
  d.Tw.forEach((poly, i) => { if (i === 0) return; for (const ziel of [d.vorPortal, d.portalL, d.portalR]) if (strecheTrifft(d.brunnen, ziel, poly)) blockiert.push(i); });
  const inBr = d.Tw.some((poly) => abstandPunktPoly(d.brunnen, poly) < 2.3 + 0.5);
  sage(!blockiert.length && !inBr, "vom Brunnen aus ist das Portal frei zu sehen (kein Flügel dazwischen, der Brunnen steht frei)", blockiert.length ? "Flügel " + blockiert.join(",") : "");
  /* Kollisionen */
  const ueber = [];
  for (const h of d.andere) for (const poly of d.Tw) if (ueberlappen(poly, h.e, 0.05)) ueber.push(h.k);
  sage(!ueber.length, "kein Flügel steht auf einem anderen Haus, Wahrzeichen, Bahnhof oder Bootshaus", [...new Set(ueber)].join(", ") || d.andere.length + " geprüft");
  const minAb = (pts, rand) => Math.min(...pts.map((q) => Math.min(...d.Tw.map((poly) => abstandPunktPoly(q, poly)))));
  const aPB = minAb(d.pferdebahn), aFl = (() => { const f = []; for (let i = 0; i + 1 < d.fluss.length; i++) for (let t = 0; t < 1; t += 0.1) f.push([d.fluss[i][0] + (d.fluss[i + 1][0] - d.fluss[i][0]) * t, d.fluss[i][1] + (d.fluss[i + 1][1] - d.fluss[i][1]) * t]); return minAb(f); })();
  sage(aPB > 3, "die Pferdebahn-Straße läuft frei links am Rathaus vorbei", "kleinster Abstand " + r1(aPB) + " m");
  sage(aFl > 2.5, "der Fluss fließt frei am Rathaus vorbei", "kleinster Abstand " + r1(aFl) + " m");
  const aufWeg = [];
  d.wege.forEach((w, i) => { if (w === d.pferdebahn) return; for (const q of w) if (Math.hypot(q[0] - d.tuerWeg[0], q[1] - d.tuerWeg[1]) > 2 && d.Tw.some((poly) => abstandPunktPoly(q, poly) < 0.4)) { aufWeg.push(i); break; } });
  sage(!aufWeg.length, "kein Weg läuft durch einen Flügel", aufWeg.length ? "Wege " + aufWeg.join(",") : d.wege.length + " Wege");
  sage(d.leuteVor && !d.leuteHinten, "wer vor dem Portal steht, wird vor dem Rathaus gemalt, wer hinter Flügel B steht, dahinter", JSON.stringify({ vor: d.leuteVor, hinterB: d.leuteHinten }));

  /* ---------- 3. Bilder ---------- */
  if (process.env.BILD) {
    /* Draufsicht aus dem Grundriss: Welt gedreht wie die Karte (u = x − y nach rechts, v = x + y nach unten) */
    const svgPunkt = (p) => [((p[0] - p[1]) + 60) * 9, ((p[0] + p[1]) + 80) * 9];
    const pfad = (pts, zu) => pts.map((p, i) => (i ? "L" : "M") + svgPunkt(p).map((z) => z.toFixed(1)).join(",")).join("") + (zu ? "Z" : "");
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="990"><rect width="1080" height="990" fill="#9fbf7f"/>`;
    svg += `<path d="${pfad(d.fluss)}" stroke="#4d7fb8" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    for (const w of d.wege) svg += `<path d="${pfad(w)}" stroke="${w === d.pferdebahn ? "#8a6a48" : "#cdbf9f"}" stroke-width="${w === d.pferdebahn ? 16 : 13}" fill="none" stroke-linejoin="round"/>`;
    for (const h of d.andere) svg += `<path d="${pfad(h.e, true)}" fill="#c9a07a" stroke="#6b4b2b" stroke-width="2"/><text x="${svgPunkt(mitte(h.e))[0]}" y="${svgPunkt(mitte(h.e))[1]}" font-size="16" text-anchor="middle" font-family="sans-serif">${h.k}</text>`;
    const farben = ["#555", "#d9534f", "#e8903a", "#3a7bd5", "#2f9e5b"], namen = ["Turm", "A", "A", "B", "C"];
    d.Tw.forEach((poly, i) => { svg += `<path d="${pfad(poly, true)}" fill="${farben[i]}" fill-opacity="0.75" stroke="#222" stroke-width="2"/>`; const m = svgPunkt(mitte(poly)); svg += `<text x="${m[0]}" y="${m[1]}" font-size="22" font-weight="bold" fill="#fff" text-anchor="middle" font-family="sans-serif">${namen[i]}</text>`; });
    const bP = svgPunkt(d.brunnen), pP = svgPunkt(d.portal);
    svg += `<circle cx="${bP[0]}" cy="${bP[1]}" r="${2.3 * Math.SQRT2 * 9}" fill="#7fb6e0" stroke="#345" stroke-width="2"/><line x1="${bP[0]}" y1="${bP[1]}" x2="${pP[0]}" y2="${pP[1]}" stroke="#fff" stroke-dasharray="6 4" stroke-width="2"/><circle cx="${pP[0]}" cy="${pP[1]}" r="6" fill="#ff0"/>`;
    svg += `<text x="10" y="24" font-size="18" font-family="sans-serif">Draufsicht (wie die Karte gedreht): Turm, A rechts, B hinten, C schräg vorn links · gelb = Portal, blau = Brunnen, braun = Pferdebahn</text></svg>`;
    const sp = await br.newPage({ viewport: { width: 1080, height: 990 } });
    await sp.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await sp.screenshot({ path: process.env.BILD + "-draufsicht.png" }); await sp.close();
    const zeig = async (zusatz, name, s) => {
      await laden(zusatz);
      await pg.evaluate(([pt, s]) => { const K = window.STADT.kamera; K.x = pt[0]; K.y = pt[1]; K.s = s * K.dpr; window.STADT.leicht && (window.STADT.leicht.unruhe = 3); }, [[(d.portal[0] + d.o.x) / 2, (d.portal[1] + d.o.y) / 2], s || 14]);
      await warteBilder(); await pg.waitForTimeout(1200);
      await pg.screenshot({ path: process.env.BILD + "-" + name + ".png" });
    };
    await zeig("&zeit=tag&jahr=herbst", "karte");
    await zeig("&zeit=tag&jahr=herbst", "nah", 26);
    await zeig("&zeit=nacht&jahr=winter", "winternacht");
    await zeig("&zeit=tag&jahr=winter", "wintertag");
  }
  sage(seitenfehler.length === 0, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gut") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
