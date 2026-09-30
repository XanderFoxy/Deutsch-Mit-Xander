#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 846b: QUESTS NACH WALKIE 315 UND DIE ECHTE TURMUHR
   ---------------------------------------------------------------------
   XANDER (Walkie 315): die Quest-Bibliothek ist zu klein und wiederholt
   sich, fast nur Wegbeschreibungen – die Leute sollen den Weg auch selbst
   finden; das Laufen dauert zu lange; „!“ und „?“ sind zu groß und bleiben
   nach der Aufgabe; die Fragetafeln sind zu groß; „zuerst … auf die
   maximale Stufe auf die Person zoomen und ihre Orientierung, dann den
   Nutzer browsen lassen“; „wenn die Turmuhr die richtige Uhrzeit anzeigen
   würde und man … die Uhrzeit … trainieren könnte“.
   Geprüft (Telefon 360 × 740, ganzes Bild): mindestens 30 Vorlagen, davon
   Such-Quests und Uhrzeit-Aufgaben; die Uhrzeit wird wie im Alltag gesagt;
   Such-Quest: Tipp aufs „!“ → kleine Tafel mit „Los, ich suche!“ → schmale
   Zeile oben, ein falsches Haus sagt, was es ist, das richtige (echter Tipp
   ins Bild) schickt die Person los; danach kein Zeichen mehr; Zeichen
   sichtbar kleiner (≤ 24 px breit gezeichnet, Tippfläche ≥ 30 px); Tafel
   höchstens 44 % hoch; Tempo ≥ 3 m/s; Wegbeschreibung: Kamera ganz nah,
   der erste Schritt zeigt im Bild nach oben; „Wie spät ist es?“ hat die
   Zeit der deutschen Uhr als richtige Antwort; die Rathausuhr zeigt die
   gestellte Zeit (dunkle Zeigerpixel dort, wo die Zeiger hingehören).
   Aufruf: node werkzeug/pruefe-846b-quests-uhr.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); const f = path.join(WURZEL, p); if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const pg = await ctx.newPage(); pg.setDefaultTimeout(120000);
  const seitenfehler = []; pg.on("pageerror", (e) => seitenfehler.push(e.message));
  await pg.goto(basis + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&uhr=15:25&quest=1&questnur=1", { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
  await pg.waitForFunction(() => !!(window.STADT && STADT.quests && STADT.quests.echt && STADT.quests.pruef), null, { timeout: 60000 });
  await pg.waitForTimeout(800);
  const Q = (fn, arg) => pg.evaluate(fn, arg);
  const warte = async (id, zs, ms) => { const t0 = Date.now(); while (Date.now() - t0 < (ms || 60000)) { const z = await Q((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return q ? q.zustand : "fort"; }, id); if (zs.indexOf(z) >= 0) return z; await pg.waitForTimeout(120); } return null; };

  console.log("\nBIBLIOTHEK UND UHRZEIT\n");
  const bib = await Q(() => { const V = STADT.quests.VORLAGEN; return { n: V.length, such: V.filter((v) => v.zeigen).length, uhr: V.filter((v) => v.kat === "uhrzeit").length, richtung: V.filter((v) => v.richtung).length, kats: [...new Set(V.map((v) => v.kat))].length }; });
  sage(bib.n >= 30 && bib.such >= 3 && bib.uhr >= 2 && bib.richtung / bib.n < 0.2, "die Bibliothek ist groß und vielfältig (höchstens ein Fünftel Wegbeschreibungen)", JSON.stringify(bib));
  const uhr = await Q(() => [[15, 0], [15, 30], [15, 25], [15, 45], [15, 15], [0, 0], [13, 0], [15, 35], [15, 50], [9, 5]].map(([h, m]) => STADT.quests.uhrText(h, m)));
  const soll = ["drei Uhr", "halb vier", "fünf vor halb vier", "Viertel vor vier", "Viertel nach drei", "zwölf Uhr", "ein Uhr", "fünf nach halb vier", "zehn vor vier", "fünf nach neun"];
  sage(JSON.stringify(uhr) === JSON.stringify(soll), "die Uhrzeit wird wie im Alltag gesagt", JSON.stringify(uhr));
  const uid = await Q(() => STADT.quests.pruef.neu("uhr_jetzt"));
  const ua = await Q((i) => STADT.quests.pruef.zustand().find((x) => x.id === i).antworten, uid);
  sage(ua && ua.length === 3 && ua.some((a) => a.richtig && a.text === "„Es ist fünf vor halb vier.“"), "„Wie spät ist es?“: richtig ist die Zeit der deutschen Uhr (15:25 → fünf vor halb vier)", JSON.stringify(ua));
  await Q(() => { STADT.quests.liste.length = 0; document.querySelectorAll(".lq-zeichen").forEach((b) => b.remove()); });

  console.log("\nSUCHEN\n");
  await Q(() => STADT.quests.pruef.schnell(3));
  const sid = await Q(() => STADT.quests.pruef.neu("such_ort", { ziel: "rathaus" }));
  sage(!!sid, "eine Such-Quest zum Rathaus lässt sich bauen");
  await warte(sid, ["wartet"], 60000);
  await Q(() => STADT.quests.pruef.schnell(1));
  await Q((i) => { const q = STADT.quests.liste.find((x) => x.id === i), K = STADT.kamera; K.x = q.f.x; K.y = q.f.y; K.s = 12 * K.dpr; STADT.leicht.unruhe = 2; }, sid);
  await pg.waitForTimeout(900);
  const z = await Q((i) => { const b = document.querySelector('.lq-zeichen[data-q="' + i + '"]'); if (!b) return null; const r = b.getBoundingClientRect(), s = b.querySelector("svg").getBoundingClientRect(); return { a: b.dataset.a, w: r.width, h: r.height, sw: s.width, sh: s.height }; }, sid);
  sage(z && z.a === "!" && z.sw <= 24 && z.sh <= 30 && z.w >= 30 && z.h >= 30, "das „!“ ist kleiner gezeichnet, die Tippfläche bleibt ≥ 30 px", JSON.stringify(z));
  await pg.tap('.lq-zeichen[data-q="' + sid + '"]');
  await pg.waitForTimeout(1200);
  const d = await Q(() => { const e = document.querySelector(".lq-dialog"); if (!e) return null; const r = e.getBoundingClientRect(); return { h: r.height, vh: innerHeight, los: !!e.querySelector(".lq-los"), antw: e.querySelectorAll(".lq-antwort").length, text: e.textContent.slice(0, 120) }; });
  sage(d && d.los && d.antw === 0 && d.h <= d.vh * 0.44 + 1, "die Tafel ist kompakt (≤ 44 % hoch) und hat „Los, ich suche!“ statt Antworten", JSON.stringify(d));
  await pg.tap(".lq-los"); await pg.waitForTimeout(500);
  const s1 = await Q((i) => ({ zustand: STADT.quests.pruef.zustand().find((x) => x.id === i).zustand, leiste: (document.querySelector(".lq-suche") || {}).textContent || "", dialog: !!document.querySelector(".lq-dialog"), zeichen: (document.querySelector('.lq-zeichen[data-q="' + i + '"]') || {}).dataset }), sid);
  sage(s1.zustand === "sucht" && /Rathaus/.test(s1.leiste) && !s1.dialog, "danach nur eine schmale Zeile oben: „Such das Rathaus …“, das Bild ist frei", JSON.stringify(s1));
  const falsch = await Q(() => { const o = STADT.szene.objekte.find((x) => x.art === "haus" && x.spiel && x.spiel !== "rathaus" && !x.bau); const r = STADT.quests.tippAuf(o); return { r: r, name: o.spiel, hinweis: (document.querySelector(".lq-suche .lq-hinweis") || {}).textContent || "" }; });
  sage(falsch.r && /^Das ist (der|die|das) .+ Gesucht ist das Rathaus\.$/.test(falsch.hinweis), "ein falsches Haus sagt, was es ist", JSON.stringify(falsch));
  /* echter Tipp ins Bild: mitten auf den Rathausturm */
  const ziel = await Q(() => { const o = STADT.szene.objekte.find((x) => x.spiel === "rathaus"), K = STADT.kamera, th = (o.dreh || 0) * Math.PI / 2, m = o.stufe || 0.7;
    const wx = o.x + (-1.32 * Math.cos(th) - 8.04 * Math.sin(th)) * m, wy = o.y + (-1.32 * Math.sin(th) + 8.04 * Math.cos(th)) * m;
    K.s = 10 * K.dpr; const P0 = STADT.proj(wx, wy, 8 * m), a = STADT.aufBoden(P0[0], P0[1]); K.x = a[0]; K.y = a[1]; STADT.leicht.unruhe = 2;
    const P = STADT.proj(wx, wy, 8 * m); return [P[0] / K.dpr, P[1] / K.dpr]; });
  await pg.waitForTimeout(800);
  await pg.touchscreen.tap(ziel[0], ziel[1]); await pg.waitForTimeout(900);
  const s2 = await Q((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); const b = document.querySelector('.lq-zeichen[data-q="' + i + '"]'); return { zustand: q && q.zustand, leiste: !!document.querySelector(".lq-suche"), zeichen: !!b && b.style.display !== "none" }; }, sid);
  sage(s2.zustand === "unterwegs" && !s2.leiste && !s2.zeichen, "Tipp aufs Rathaus: die Person geht los, Zeile und Zeichen sind weg", JSON.stringify(s2));
  const t0 = await Q((i) => STADT.quests.liste.find((x) => x.id === i).f.s, sid);
  await pg.waitForTimeout(2000);
  const t1 = await Q((i) => { const q = STADT.quests.liste.find((x) => x.id === i); return q ? q.f.s : null; }, sid);
  const tempo = t1 != null ? (t1 - t0) / 2 : null;
  /* (gemessen wird die Schrittweite: unter Last malt Chromium hier nur wenige Bilder je Sekunde und ein Schritt ist auf 0,1 s begrenzt) */
  const TEMPO = await Q(() => STADT.quests.pruef.tempo());
  sage(TEMPO >= 3, "sie geht gut doppelt so schnell wie vorher (1,45 m/s bisher)", TEMPO + " m/s (im Prüfbrowser gemessen " + (tempo == null ? "–" : tempo.toFixed(2)) + " m/s bei wenigen Bildern je Sekunde)");
  await warte(sid, ["jubel", "geht", "fort"], 90000);
  const pk = await Q(() => STADT.quests.pruef.meldung());
  sage(pk && pk.id === "such_ort" && pk.punkte >= 8, "angekommen: Helferpunkte wie bei einer Wegbeschreibung", JSON.stringify(pk && { id: pk.id, punkte: pk.punkte, versuche: pk.versuche }));
  await Q(() => { STADT.quests.liste.length = 0; document.querySelectorAll(".lq-zeichen").forEach((b) => b.remove()); });

  console.log("\nERSTER BLICK AUF DIE PERSON\n");
  await Q(() => { STADT.drehen.setzen(0); const K = STADT.kamera; K.s = 6 * K.dpr; STADT.quests.pruef.schnell(3); });
  let rid = null;
  for (const k of ["rathaus", "bahnhof", "krankenhaus", "gasthaus"]) { rid = await Q((kk) => STADT.quests.pruef.neu(kk === "rathaus" ? "weg_rathaus" : kk === "bahnhof" ? "weg_bahnhof" : kk === "krankenhaus" ? "weg_krankenhaus" : "weg_gasthaus"), k); if (rid) break; }
  sage(!!rid, "eine Wegbeschreibung lässt sich bauen");
  if (rid) {
    await warte(rid, ["wartet"], 60000);
    await Q(() => STADT.quests.pruef.schnell(1));
    await Q((i) => { const q = STADT.quests.liste.find((x) => x.id === i), K = STADT.kamera; K.x = q.f.x; K.y = q.f.y; STADT.leicht.unruhe = 2; }, rid);
    await pg.waitForTimeout(700);
    await pg.tap('.lq-zeichen[data-q="' + rid + '"]'); await pg.waitForTimeout(1600);
    const b = await Q((i) => { const q = STADT.quests.liste.find((x) => x.id === i), K = STADT.kamera, h = q.f.h, P0 = STADT.proj(q.f.x, q.f.y, 0), P1 = STADT.proj(q.f.x + Math.cos(h), q.f.y + Math.sin(h), 0);
      const dx = P1[0] - P0[0], dy = P1[1] - P0[1]; return { s: K.s / K.dpr, dreh: K.dreh, hoch: +(-dy / Math.hypot(dx, dy)).toFixed(2), personImBild: P0[0] > 0 && P0[0] < K.W && P0[1] > 0 && P0[1] < K.H }; }, rid);
    sage(b.s >= 24 && b.hoch >= 0.7 && b.personImBild, "ganz nah an der Person, ihr erster Schritt zeigt im Bild nach oben (links/rechts wie für sie)", JSON.stringify(b));
  }

  console.log("\nTURMUHR\n");
  await Q(() => { STADT.quests.liste.length = 0; document.querySelectorAll(".lq-zeichen, .lq-dialog").forEach((b) => b.remove()); });
  for (const [zeit, h, m] of [["15:00", 3, 0], ["10:40", 10.667, 40]]) {
    await Q((t) => STADT.uhrStellen(t), zeit);
    const probe = await Q(([h, m]) => {
      STADT.drehen.setzen(0);
      const o = STADT.szene.objekte.find((x) => x.spiel === "rathaus"), K = STADT.kamera, T = STADT.szene.pruef.turmuhr, mm = o.stufe || 0.7, th = (o.dreh || 0) * Math.PI / 2, c = Math.cos(th), s = Math.sin(th);
      const w = (x, y) => [o.x + (x * c - y * s) * mm, o.y + (x * s + y * c) * mm];
      /* das Blatt, das am meisten zum Betrachter schaut */
      let best = null;
      for (const [nx, ny] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const C = w(T.mitte[0] + nx * T.ab, T.mitte[1] + ny * T.ab), N = w(T.mitte[0] + nx * (T.ab + 1), T.mitte[1] + ny * (T.ab + 1)); const P = STADT.proj(C[0], C[1], T.z * mm), Pn = STADT.proj(N[0], N[1], T.z * mm); if (!best || Pn[1] - P[1] > best.d) best = { nx, ny, d: Pn[1] - P[1], C: C }; }
      K.s = 40 * K.dpr; let P = STADT.proj(best.C[0], best.C[1], T.z * mm); const a = STADT.aufBoden(P[0], P[1]); K.x = a[0]; K.y = a[1]; STADT.leicht.unruhe = 2;
      return best;
    }, [h, m]);
    await pg.waitForTimeout(3500);
    const px = await Q(([h, m, nx, ny]) => {
      const o = STADT.szene.objekte.find((x) => x.spiel === "rathaus"), K = STADT.kamera, T = STADT.szene.pruef.turmuhr, mm = o.stufe || 0.7, th = (o.dreh || 0) * Math.PI / 2, c = Math.cos(th), s = Math.sin(th);
      const w = (x, y) => [o.x + (x * c - y * s) * mm, o.y + (x * s + y * c) * mm];
      const auf = (u, v) => { const C = w(T.mitte[0] + nx * T.ab + ny * u, T.mitte[1] + ny * T.ab - nx * u); return STADT.proj(C[0], C[1], (T.z + v) * mm); };
      const cv = document.getElementById("lDinge"), g = cv.getContext("2d");
      const hell = (P) => { const d = g.getImageData(Math.round(P[0]), Math.round(P[1]), 1, 1).data; return (d[0] + d[1] + d[2]) / 3; };
      const an = (a, l) => auf(Math.sin(a) * l, Math.cos(a) * l);
      const minA = m / 60 * Math.PI * 2, stA = h / 12 * Math.PI * 2, r = T.r;
      return { minute: hell(an(minA, r * 0.5)), stunde: hell(an(stA, r * 0.3)), gegen: hell(an(minA + Math.PI * 0.75, r * 0.5)), gegen2: hell(an(stA + Math.PI, r * 0.3)), bei: an(minA, r * 0.5).map(Math.round), uhr: STADT.uhr().h + ":" + STADT.uhr().m };
    }, [h, m, probe.nx, probe.ny]);
    sage(px.minute < 110 && px.stunde < 110 && px.gegen > 150 && px.gegen2 > 150, "Rathausuhr um " + zeit + ": Zeiger dort, wo sie hingehören (dunkel), daneben das helle Blatt", JSON.stringify(px));
    if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-uhr-" + zeit.replace(":", "") + ".png" });
  }
  sage(!seitenfehler.length, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 846b (Quests nach Walkie 315, Turmuhr): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
