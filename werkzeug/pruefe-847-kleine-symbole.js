#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 827 (Arbeitsnummer 847): KLEINE SYMBOLE AM HAUS
   ---------------------------------------------------------------------
   XANDER (Funk 248, wörtlich): „die Mühle produziert nicht sofort die
   geht immer erst ins große Menü … wenn in einer Sache an einer Stelle
   zwei Sachen produziert werden können dass diese zwei Symbole einfach
   nur da sind bei dem Haus und ich eins der Symbole halt anklicken kann".

   Geprüft (die Funktionen aus spiel.js, ohne Browser):
     - Mühle mit Getreide: ein Symbol Mehl (tippbar)
     - Mühle mahlt gerade: Symbol grau + „mahlt Mehl – noch …"
     - Mühle ohne Getreide: Symbol grau + „Es fehlt Getreide"
     - Bäckerei: drei Symbole (Brot, Kuchen, Torte) nebeneinander
     - Bergwerk mit Bergleuten unterwegs: grau + Restzeit
     - der Tipp aus der Stadt (klein: 1) nimmt diesen Weg auch im
       Vollbild (kein „!LSTADT.voll" mehr), die Stadt fragt im Vollbild
       mit klein: 1
   Teil B (Browser, stadt-leicht.html?demo=1): „die getreideäcker scheinen
   auf einem Gehweg zu sein" · „die Getreidefelder waren früher auf
   beiden Seiten" – die zwei Äcker liegen links und rechts der Stadt, und
   in keinem liegt ein Weg, Wasser oder Haus.
   Teil C (Browser, Elternseite 360 × 740 mit Rahmen 360 × 225, die wie
   spiel.js auf „leicht-unten" den Rahmen nach unten wachsen lässt):
   „ein kleines kompaktes schwebendes Menü über dem Chat … damit man die
   Richtungen herausfinden kann und im Bild bleibt" – der Quest-Dialog
   liegt unter dem Bild (über dem Chat), das Stadtbild bleibt 225 px hoch
   und ganz frei, die Person steht im Bild; nach der Antwort ist der
   Rahmen wieder 225 px. Ohne Antwort des Spiels bleibt es wie bisher.
   Mit dem alten Stand (lsEinzigeAufgabe allein, Acker 91 über dem Weg)
   ist das rot.
   Aufruf: node werkzeug/pruefe-847-kleine-symbole.js
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const js = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
const ob = fs.readFileSync(path.join(WURZEL, "stadt-leicht/oberflaeche.js"), "utf8");
function stueck(kopf) {
  const a = js.indexOf(kopf); if (a < 0) return "";
  let i = js.indexOf("{", a), t = 0;
  for (; i < js.length; i++) { if (js[i] === "{") t++; else if (js[i] === "}" && --t === 0) break; }
  return js.slice(a, i + 1);
}
const teile = ["var REZEPTE = ", "function rezeptMenge(", "function vorrat(", "function lsEinzigeAufgabe(", "function lsKleineWahl("].map(stueck);
sage(teile.every(Boolean), "spiel.js hat lsKleineWahl (und REZEPTE, rezeptMenge, lsEinzigeAufgabe)");
if (!teile[4]) { console.log("\n" + fehler + " Fehler"); process.exit(1); }
const kx = { S: { ich: {} }, WAREN: { mehl: "Mehl", getreide: "Getreide", brot: "Brot", kuchen: "Kuchen", torte: "Torte", ei: "Eier", milch: "Milch" } };
vm.createContext(kx);
vm.runInContext(teile[0] + ";" + teile.slice(1).join("\n") + `
  function wareName(x) { return WAREN[x] || x; }
  function dorfSt(ich, g) { var d = (ich.dorf || {})[g]; return d && d.stufe > 0 ? d.stufe : 0; }
  function baustelleVon() { return null; }
  function uhrText(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function truppStand(ich, ort) { var a = (ich.werk || {})["trupp_" + ort]; if (!a) return null; var r = Date.parse(a.fertig) - Date.now(); return { rest: Math.max(0, r), fertig: r <= 0 }; }
  this.lsKleineWahl = lsKleineWahl;`, kx);
const dorf = { muehle: { stufe: 1, lp: 100 }, baeckerei: { stufe: 1, lp: 100 }, bergwerk: { stufe: 1, lp: 100 }, schule: { stufe: 1, lp: 100 } };
const spaeter = new Date(Date.now() + 190000).toISOString();

kx.S.ich = { dorf, vorraete: { getreide: 6 }, werk: {} };
let r = kx.lsKleineWahl("muehle");
sage(r && r.wahl.length === 1 && r.wahl[0].w === "mehl" && r.wahl[0].n > 0 && !r.info, "Mühle mit Getreide: ein tippbares Symbol Mehl", JSON.stringify(r));

kx.S.ich = { dorf, vorraete: { getreide: 6 }, werk: { muehle: { ware: "mehl", menge: 5, fertig: spaeter } } };
r = kx.lsKleineWahl("muehle");
sage(r && r.wahl.length === 1 && r.wahl[0].n === 0 && /mahlt Mehl – noch 3:/.test(r.info || ""), "Mühle mahlt gerade: kleines graues Symbol + „mahlt Mehl – noch …“ statt großem Menü", JSON.stringify(r));

kx.S.ich = { dorf, vorraete: {}, werk: {} };
r = kx.lsKleineWahl("muehle");
sage(r && r.wahl.length === 1 && r.wahl[0].n === 0 && /Es fehlt Getreide/.test(r.info || ""), "Mühle ohne Getreide: graues Symbol + „Es fehlt Getreide“ statt großem Menü", JSON.stringify(r));

kx.S.ich = { dorf, vorraete: { mehl: 4, ei: 2, milch: 1 }, werk: {} };
r = kx.lsKleineWahl("baeckerei");
sage(r && r.wahl.map((x) => x.w).join() === "brot,kuchen,torte" && r.wahl.every((x) => x.n > 0), "Bäckerei: drei Symbole (Brot, Kuchen, Torte) am Haus, alle tippbar", JSON.stringify(r));
kx.S.ich = { dorf, vorraete: { mehl: 1 }, werk: {} };
r = kx.lsKleineWahl("baeckerei");
sage(r && r.wahl.length === 3 && r.wahl[0].n > 0 && r.wahl[1].n === 0 && r.wahl[2].n === 0, "Bäckerei mit wenig Mehl: Brot tippbar, Kuchen/Torte grau", JSON.stringify(r));

kx.S.ich = { dorf, vorraete: {}, werk: { trupp_berg: { fertig: spaeter } } };
r = kx.lsKleineWahl("bergwerk");
sage(r && r.wahl[0].w === "trupp" && r.wahl[0].n === 0 && /unterwegs – noch/.test(r.info || ""), "Bergwerk, Bergleute unterwegs: grau + Restzeit", JSON.stringify(r));
kx.S.ich = { dorf, vorraete: {}, werk: {} };
sage(kx.lsKleineWahl("schule") === null, "Häuser ohne Herstellen (Schule) öffnen weiter ihre Karte");

const zweig = js.slice(js.indexOf("if (ev.data.klein && !dorfBesuchStand()"), js.indexOf("if (ev.data.klein && !dorfBesuchStand()") + 400);
sage(/lsKleineWahl\(lg\)/.test(zweig) && !/LSTADT\.voll/.test(zweig.split("\n")[0]) && /info: kw\.info/.test(zweig), "der Tipp mit klein: 1 nimmt lsKleineWahl – auch im Vollbild – und schickt den Grund (info) mit");
sage(/typ: "leicht-haus", g: o\.spiel, voll: 1, klein: 1/.test(ob), "die Stadt fragt auch im Vollbild nach den kleinen Symbolen (klein: 1)");
sage(/ev\.data\.info/.test(ob) && /b\.disabled = !n/.test(ob), "die Stadt zeigt graue Symbole und den Grund in der kleinen Auswahl");

(async () => {
  console.log("\nTEIL B — Äcker frei von Wegen, links und rechts\n");
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const http = require("http");
  const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
  const ELTERN = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<body style="margin:0;background:#223"><div style="height:60px;color:#fff;font:14px system-ui;padding:8px">Spiel</div>
<div id="platz" style="position:relative;height:225px"><iframe id="r" src="/stadt-leicht.html?eingebettet=1&mini=1&demo=1&zeit=tag&jahr=herbst&uhr=12:00&quest=1&questnur=1" style="position:absolute;left:0;top:0;width:360px;height:225px;border:0;display:block;z-index:5"></iframe></div>
<div id="chat" style="height:400px;background:#eee;font:14px system-ui;padding:8px">Chat …</div>
<script>window.__unten=[];addEventListener("message",function(e){var f=document.getElementById("r");if(!e.data||e.source!==f.contentWindow)return;if(e.data.typ==="leicht-unten"){var px=Math.max(0,Math.min(240,+e.data.px||0));__unten.push(px);f.style.height=(225+px)+"px";if(px)f.contentWindow.postMessage({typ:"leicht-unten-lage",geht:1,px:px},location.origin);}});</script></body>`;
  const srv = http.createServer((q, a) => { if (q.url.split("?")[0] === "/__eltern847.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(ELTERN); } const f = path.join(WURZEL, decodeURIComponent(q.url.split("?")[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  try {
    const pg = await (await br.newContext({ viewport: { width: 900, height: 600 } })).newPage();
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst");
    await pg.waitForFunction(() => window.__fertig, null, { timeout: 120000 });
    const r = await pg.evaluate(() => {
      const B = STADT.boden, D = STADT.dorf, vw = (u, v) => [(u + v) / 2, (v - u) / 2];
      const obj = STADT.szene.objekte.filter((o) => o.art !== "natur" && o.art !== "mensch");
      return (D.FELD_ORTE || []).map((f) => {
        let weg = 0, wasser = 0, bau = 0;
        for (let u = f.u0; u <= f.u1; u += 1) for (let v = f.v0; v <= f.v1; v += 1) {
          const [x, y] = vw(u, v);
          if (B.wert(x, y, 0) > 0.03) weg++;
          if (B.wert(x, y, 1) > 0.03) wasser++;
          if (obj.some((o) => { const g = o.fuss || [3, 3]; return Math.hypot(o.x - x, o.y - y) < Math.max(g[0], g[1]) * (o.stufe || 1) / 2; })) bau++;
        }
        return { nr: f.nr, u: (f.u0 + f.u1) / 2, weg, wasser, bau };
      });
    });
    sage(r.length === 2, "zwei Äcker (91, 92)", JSON.stringify(r));
    sage(r.every((f) => !f.weg && !f.wasser && !f.bau), "kein Acker liegt auf einem Weg, im Wasser oder unter einem Haus", JSON.stringify(r));
    sage(r.some((f) => f.u < -60) && r.some((f) => f.u > 60), "ein Acker links, einer rechts der Stadt (wie früher)", JSON.stringify(r.map((f) => f.u)));

    console.log("\nTEIL C — Quest-Dialog schwebt unter dem Bild (über dem Chat)\n");
    const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const el = await ctx.newPage();
    await el.goto("http://127.0.0.1:" + srv.address().port + "/__eltern847.html");
    await el.waitForFunction(() => { const f = document.getElementById("r"); return f && f.contentWindow && f.contentWindow.__fertig; }, null, { timeout: 120000 });
    const f = el.frames().find((x) => /stadt-leicht\.html/.test(x.url()));
    await f.waitForFunction(() => window.STADT && STADT.quests && STADT.quests.pruef, null, { timeout: 120000 });
    await f.evaluate(() => STADT.quests.pruef.schnell(4));
    const id = await f.evaluate(() => STADT.quests.pruef.neu("weg_bahnhof"));
    await f.waitForFunction((i) => { const q = STADT.quests.pruef.zustand().find((x) => x.id === i); return q && q.zustand === "wartet"; }, id, { timeout: 120000 }).catch(() => {});
    await f.evaluate((i) => STADT.quests.pruef.tipp(i), id);
    await f.waitForFunction(() => !!document.querySelector(".lq-dialog"), null, { timeout: 30000 }).catch(() => {});
    await el.waitForTimeout(1800);
    const m = await f.evaluate(() => {
      const d = document.querySelector(".lq-dialog"), K = STADT.kamera, q = STADT.quests.pruef.zustand()[0];
      const r = d ? d.getBoundingClientRect() : null, P = q ? STADT.proj(q.x, q.y, 0) : [0, 0];
      return { innerH: innerHeight, bildH: K.H / K.dpr, dialog: r && { top: Math.round(r.top), unten: Math.round(r.bottom), h: Math.round(r.height) }, unten: STADT.quests.untenPx(),
        person: [Math.round(P[0] / K.dpr), Math.round(P[1] / K.dpr)], knoepfe: d ? [...d.querySelectorAll("button")].map((b) => Math.round(b.getBoundingClientRect().height)) : [] };
    });
    const rahmenH = await el.evaluate(() => document.getElementById("r").getBoundingClientRect().height);
    sage(m.unten > 60 && m.unten <= 190 && Math.abs(rahmenH - (225 + m.unten)) < 1.5, "der Rahmen wächst für den Dialog nach unten (über den Chat), höchstens 190 px", JSON.stringify({ rahmenH, unten: m.unten }));
    sage(Math.abs(m.bildH - 225) < 1.5 && m.dialog && m.dialog.top >= 224 && m.dialog.unten <= m.innerH + 0.5, "das Stadtbild bleibt 225 px hoch und ganz frei, der Dialog liegt darunter", JSON.stringify(m));
    sage(m.person[0] > 10 && m.person[0] < 350 && m.person[1] > 20 && m.person[1] < 215, "die Person steht mitten im freien Bild", JSON.stringify(m.person));
    sage(m.knoepfe.length >= 4 && m.knoepfe.every((h) => h >= 28), "Antworten und Knöpfe bleiben tippbar (≥ 28 px)", JSON.stringify(m.knoepfe));
    if (process.env.BILD) await el.screenshot({ path: process.env.BILD + "-schwebe.png" });
    const ri = await f.evaluate(() => STADT.quests.pruef.zustand()[0].antworten.findIndex((a) => a.richtig));
    await f.evaluate((i) => document.querySelector('.lq-antwort[data-i="' + i + '"]').click(), ri);
    await el.waitForTimeout(2600);
    const nach = await el.evaluate(() => ({ h: document.getElementById("r").getBoundingClientRect().height, unten: window.__unten }));
    const nachF = await f.evaluate(() => ({ dialog: !!document.querySelector(".lq-dialog"), bildH: STADT.kamera.H / STADT.kamera.dpr, cls: document.documentElement.classList.contains("lq-unten") }));
    sage(!nachF.dialog && Math.abs(nach.h - 225) < 1 && Math.abs(nachF.bildH - 225) < 1.5 && !nachF.cls, "nach der richtigen Antwort: Dialog weg, Rahmen wieder 225 px", JSON.stringify({ nach, nachF }));
    await ctx.close();
    const sj = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
    /* Teil D — Einzug (Funk 248: „mein Auto kommt nie flüssig … ich sehe mich nicht damit reinfahren") */
    const aj = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
    sage(/function lcRuhigDann/.test(aj) && /richtung === "rein" && !ruhig && !versuch\) \{ lcRuhigDann/.test(aj), "der Einzug wartet vor dem Kommen auf ruhige Bilder (höchstens 3 s)");
    sage(/Date\.now\(\) - ab < 15000/.test(aj), "die Blätter von Viper/Batmobil dürfen 15 s brauchen (vorher fiel der eigene Einzug nach 6 s aus)");
    sage(/lcStadtRuhe\(true\)/.test(aj) && /typ: "leicht-ruhe"/.test(aj), "während ein Einzug fährt, ruht die eingebettete Stadt (leicht-ruhe)");
    sage(/ev\.data\.typ === "leicht-unten"/.test(sj) && /r\.height \+ un/.test(sj) && /leicht-unten-lage/.test(sj), "spiel.js lässt den Rahmen für den Dialog wachsen und antwortet (leicht-unten / leicht-unten-lage)");
  } finally { await br.close(); srv.close(); }
  console.log("\n" + (fehler ? fehler + " Fehler" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
