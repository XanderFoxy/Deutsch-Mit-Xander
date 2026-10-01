#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 829 (Arbeitsnummer 849): DAS QUEST-FENSTER SCHWEBT
   ÜBER DEM STADTBILD
   ---------------------------------------------------------------------
   XANDER (Funk 255, wörtlich): „wenn jemand mich nach einer Mission fragt
   … das sollte ein schwebendes Fenster sein was sich wenn nach
   Möglichkeit über den Positionsfenstern öffnet also kurz über dem Bild
   der Stadt das ist niemals die Stadt verdeckt das habe ich schon mal
   gesagt".

   Elternseite 360 × 740: oben 260 px „Plätze", darunter der Stadtrahmen
   360 × 225, darunter der Chat. Das Ersatz-Spiel macht, was spiel.js tut:
   auf „leicht-unten" mit oben: 1 wächst der Rahmen nach OBEN und antwortet
   mit oben: 1.
   Geprüft:
     - die Stadt wünscht den Streifen oben (oben: 1)
     - der Rahmen wächst nach oben (über die Plätze), höchstens 190 px;
       das Stadtbild bleibt 225 px hoch und an seiner Stelle
     - der Dialog liegt im Streifen ÜBER dem Bild, nichts davon im Bild
     - ein Tipp ins Bild trifft weiter das Haus darunter (die Leinwand
       ist um den Streifen verschoben, die Fingerposition auch)
     - nach der Antwort: Dialog weg, Rahmen wieder 225 px an alter Stelle
     - spiel.js versucht zuerst oben und fällt sonst auf unten zurück
   Mit dem Stand 828 ist das rot (der Dialog lag unter dem Bild).
   Aufruf: node werkzeug/pruefe-849-quest-oben.js
   ===================================================================== */
const fs = require("fs"), path = require("path"), http = require("http");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const ELTERN = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<body style="margin:0;background:#223"><div id="plaetze" style="height:260px;color:#fff;font:14px system-ui;padding:8px;box-sizing:border-box">Plätze</div>
<div id="platz" style="height:225px"></div>
<iframe id="r" src="/stadt-leicht.html?eingebettet=1&mini=1&demo=1&zeit=tag&jahr=herbst&uhr=12:00&quest=1&questnur=1" style="position:absolute;left:0;top:260px;width:360px;height:225px;border:0;display:block;z-index:5"></iframe>
<div id="chat" style="height:400px;background:#eee;font:14px system-ui;padding:8px">Chat …</div>
<script>window.__unten=[];window.__haus=[];addEventListener("message",function(e){var f=document.getElementById("r");if(!e.data||e.source!==f.contentWindow)return;
if(e.data.typ==="leicht-haus")__haus.push(e.data.g);
if(e.data.typ==="leicht-unten"){var px=Math.max(0,Math.min(240,+e.data.px||0));__unten.push({px:px,oben:e.data.oben});
var oben=px&&e.data.oben&&260-px>=0;f.style.top=(260-(oben?px:0))+"px";f.style.height=(225+px)+"px";
if(px)f.contentWindow.postMessage({typ:"leicht-unten-lage",geht:1,px:px,oben:oben?1:0},location.origin);}});</script></body>`;

(async () => {
  const srv = http.createServer((q, a) => { if (q.url.split("?")[0] === "/__eltern849.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(ELTERN); } const f = path.join(WURZEL, decodeURIComponent(q.url.split("?")[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  try {
    const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const el = await ctx.newPage();
    const seitenFehler = [];
    el.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    await el.goto("http://127.0.0.1:" + srv.address().port + "/__eltern849.html");
    await el.waitForFunction(() => { const f = document.getElementById("r"); return f && f.contentWindow && f.contentWindow.__fertig; }, null, { timeout: 120000 });
    const f = el.frames().find((x) => /stadt-leicht\.html/.test(x.url()));
    await f.waitForFunction(() => window.STADT && STADT.quests && STADT.quests.pruef, null, { timeout: 120000 });
    await f.evaluate(() => STADT.quests.pruef.schnell(4));
    const id = await f.evaluate(() => STADT.quests.pruef.neu("weg_bahnhof"));
    await f.waitForFunction((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return q && q.zustand === "wartet"; }, id, { timeout: 120000 }).catch(() => {});
    await f.evaluate((i) => STADT.quests.pruef.tipp(i), id);
    await f.waitForFunction(() => !!document.querySelector(".lq-dialog"), null, { timeout: 30000 }).catch(() => {});
    await el.waitForTimeout(1800);
    const wunsch = await el.evaluate(() => window.__unten.slice());
    sage(wunsch.some((w) => w.px > 0 && w.oben === 1), "die Stadt wünscht den Streifen über dem Bild (oben: 1)", JSON.stringify(wunsch));
    const rahmen = await el.evaluate(() => { const r = document.getElementById("r").getBoundingClientRect(); return { top: r.top, h: r.height }; });
    const m = await f.evaluate(() => {
      const d = document.querySelector(".lq-dialog"), K = STADT.kamera, s = document.getElementById("lStadt").getBoundingClientRect();
      const r = d ? d.getBoundingClientRect() : null;
      return { innerH: innerHeight, bildH: K.H / K.dpr, stadtTop: Math.round(s.top), oben: STADT.obenPlatz || 0, px: STADT.quests.untenPx(), cls: document.documentElement.classList.contains("lq-oben"),
        dialog: r && { top: Math.round(r.top), unten: Math.round(r.bottom), h: Math.round(r.height) }, knoepfe: d ? [...d.querySelectorAll("button")].map((b) => Math.round(b.getBoundingClientRect().height)) : [] };
    });
    sage(m.cls && m.px > 60 && m.px <= 190 && Math.abs(rahmen.h - (225 + m.px)) < 1.5 && Math.abs(rahmen.top - (260 - m.px)) < 1.5,
      "der Rahmen wächst nach oben über die Plätze (höchstens 190 px), unten bleibt er, wo er war", JSON.stringify({ rahmen, px: m.px }));
    sage(Math.abs(m.bildH - 225) < 1.5 && Math.abs(m.stadtTop - m.px) < 1.5, "das Stadtbild bleibt 225 px hoch, genau an seiner alten Stelle", JSON.stringify({ bildH: m.bildH, stadtTop: m.stadtTop, px: m.px }));
    sage(!!m.dialog && m.dialog.top >= -0.5 && m.dialog.unten <= m.px + 0.5, "der Dialog liegt im Streifen ÜBER dem Bild – nichts davon im Stadtbild", JSON.stringify(m.dialog));
    sage(m.knoepfe.length >= 4 && m.knoepfe.every((h) => h >= 28), "Antworten und Knöpfe bleiben tippbar (≥ 28 px)", JSON.stringify(m.knoepfe));
    if (process.env.BILD) await el.screenshot({ path: process.env.BILD + "-oben.png" });

    /* ein Tipp ins verschobene Bild trifft das Haus darunter */
    const ziel = await f.evaluate(() => {
      const K = STADT.kamera, SZ = STADT.szene, ob = STADT.obenPlatz || 0;
      for (const e of SZ.sichtbare.slice().reverse()) {
        if (!e.o.spiel || e.o.art === "natur" || e.o.bau) continue;
        const mm = e.meta;
        for (let fy = 0.35; fy < 0.85; fy += 0.1) for (let fx = 0.35; fx < 0.7; fx += 0.1) {
          const px = e.X - mm.ax * e.k + mm.w * e.k * fx, py = e.Y - mm.ay * e.k + mm.h * e.k * fy;
          if (px < 40 * K.dpr || py < 30 * K.dpr || px > K.W - 40 * K.dpr || py > K.H - 20 * K.dpr) continue;
          if (SZ.treffer(px, py) !== e.o) continue;
          return { g: e.o.spiel, x: px / K.dpr, y: py / K.dpr + ob };
        }
      }
      return null;
    });
    if (ziel) {
      await el.evaluate(() => { window.__haus.length = 0; });
      await el.waitForTimeout(700);
      await el.touchscreen.tap(ziel.x, rahmen.top + ziel.y);
      await el.waitForTimeout(900);
    }
    const haus = await el.evaluate(() => window.__haus.slice());
    sage(!!ziel && haus.includes(ziel.g), "ein Tipp ins Bild trifft weiter das Haus darunter (Fingerposition um den Streifen verschoben)", JSON.stringify({ ziel, haus }));

    await f.evaluate((i) => STADT.quests.pruef.tipp(i), id).catch(() => {});
    await f.waitForFunction(() => !!document.querySelector(".lq-dialog"), null, { timeout: 8000 }).catch(() => {});
    const ri = await f.evaluate(() => STADT.quests.pruef.zustand()[0].antworten.findIndex((a) => a.richtig));
    await f.evaluate((i) => { const b = document.querySelector('.lq-antwort[data-i="' + i + '"]'); if (b) b.click(); }, ri);
    await el.waitForTimeout(2800);
    const nach = await el.evaluate(() => { const r = document.getElementById("r").getBoundingClientRect(); return { top: r.top, h: r.height }; });
    const nachF = await f.evaluate(() => ({ dialog: !!document.querySelector(".lq-dialog"), bildH: STADT.kamera.H / STADT.kamera.dpr, oben: STADT.obenPlatz || 0, cls: document.documentElement.classList.contains("lq-oben") }));
    sage(!nachF.dialog && Math.abs(nach.h - 225) < 1 && Math.abs(nach.top - 260) < 1 && Math.abs(nachF.bildH - 225) < 1.5 && !nachF.oben && !nachF.cls,
      "nach der richtigen Antwort: Dialog weg, Rahmen wieder 225 px an alter Stelle", JSON.stringify({ nach, nachF }));
    sage(!seitenFehler.length, "keine Skriptfehler", JSON.stringify(seitenFehler.slice(0, 3)));
    await ctx.close();

    const sj = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
    sage(/ev\.data\.oben/.test(sj) && /L\.obenGeht/.test(sj) && /st\.top = \(r\.top - ob\)/.test(sj) && /oben: lgOben \? 1 : 0/.test(sj),
      "spiel.js versucht zuerst oben (Rahmen wächst nach oben), sonst unten, und sagt es der Stadt");
  } finally { await br.close(); srv.close(); }
  console.log("\n" + (fehler ? fehler + " Fehler" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
