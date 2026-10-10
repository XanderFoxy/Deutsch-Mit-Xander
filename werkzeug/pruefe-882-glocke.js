#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 882: WESTMINSTER-GLOCKE (Funk 303)
   ---------------------------------------------------------------------
   XANDER (wörtlich): „Der Westminster Sound der kommt manchmal um viertel
   nach … und er ist ganz leise und abgehakt … der soll natürlich schön
   und deutlich schön sein und die Glockenklänge sollen ausklingen und
   nicht nur so stakkato und so mega leise … offenbar hast du da jetzt
   zwei Sounds".
   Geprüft:
   EIN KLANG  spiel.js: die alte Dorfkirche (dorfGlocken) schweigt, solange
              die neue Stadt im Dorf-Fenster steht (.sp-dl-neustadt).
   AUSKLANG   die fünf gegossenen Glocken (stadt-leicht/ton.js) klingen
              wirklich nach: Viertelglocken nach 3 s höchstens 22 dB unter
              dem Anschlag, die Stundenglocke nach 6 s höchstens 22 dB;
              der Puffer endet still (weich ausgeblendet, kein Knacken).
   DEUTLICH   fern vom Rathaus mindestens 0,15 (früher 0,014), nah lauter.
   AUFRUF  node werkzeug/pruefe-882-glocke.js   (WURZEL=<Ordner>: anderer Stand)
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

(async () => {
  console.log("\nEIN KLANG (spiel.js)\n");
  const sp = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
  const dg = sp.slice(sp.indexOf("function dorfGlocken("), sp.indexOf("function dorfGlocken(") + 400);
  sage(/function dorfNeustadtImBild\(\)[^}]*sp-dl-neustadt/.test(sp) && /^function dorfGlocken\(w\) \{\s*var u = berlinUhr\(\)[^\n]*\n\s*if \(dorfNeustadtImBild\(\)\) \{[^}]*return; \}/.test(dg),
    "alte Dorfkirche schweigt, solange die neue Stadt im Dorf-Fenster steht", dg.split("\n").slice(0, 3).join(" ").slice(0, 160));

  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  const seitenFehler = []; pg.on("pageerror", (e) => seitenFehler.push(e.message));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&leute=0&ton=1" + (process.env.QUELLE ? "&quelle=1" : ""), { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
  await pg.mouse.click(450, 350);
  await pg.waitForTimeout(1200);
  const r = await pg.evaluate(async () => {
    const ST = window.STADT, T = ST.ton;
    T.glockeTesten(15, 0);
    for (let i = 0; i < 80 && !(T.glockenGuss && T.glockenGuss.E); i++) await new Promise((ok) => setTimeout(ok, 100));
    const guss = {};
    for (const [ton, b] of Object.entries(T.glockenGuss || {})) {
      const d = b.getChannelData(0), sr = b.sampleRate;
      const rms = (a, z) => { let s = 0, n = 0; for (let j = Math.floor(a * sr); j < Math.min(d.length, Math.floor(z * sr)); j++) { s += d[j] * d[j]; n++; } return n ? Math.sqrt(s / n) : 0; };
      const db = (v, w) => Math.round(20 * Math.log10((v + 1e-9) / (w + 1e-9)));
      const an = rms(0, 0.3);
      guss[ton] = { dauer: +b.duration.toFixed(1), nach3: db(rms(3, 3.5), an), nach6: db(rms(6, 6.5), an), ende: db(rms(b.duration - 0.05, b.duration), an) };
    }
    const K = ST.kamera, o = ST.szene.objekte.find((o) => o.spiel === "rathaus"), x0 = K.x, y0 = K.y;
    K.x = o.x; K.y = o.y + 5; const nah = T.glockeLaut().laut; K.x = o.x + 260; K.y = o.y + 220; const fern = T.glockeLaut().laut; K.x = x0; K.y = y0;
    return { guss: guss, log: T.glockenLog.slice(-1)[0], nah: nah, fern: fern };
  });
  console.log("\nAUSKLANG UND LAUTSTÄRKE (stadt-leicht/ton.js)\n");
  const g = r.guss, viertel = ["gis", "fis", "e", "h"].map((t) => g[t]).filter(Boolean);
  sage(viertel.length === 4 && !!g.E, "fünf Glocken gegossen (gis' fis' e' h + Stundenglocke E)", Object.keys(g).join(" "));
  sage(viertel.length === 4 && viertel.every((x) => x.nach3 >= -22), "Viertelglocken klingen aus: nach 3 s höchstens 22 dB leiser als der Anschlag", JSON.stringify(viertel.map((x) => x.nach3)));
  sage(!!g.E && g.E.nach6 >= -22 && g.E.dauer >= 15, "Stundenglocke klingt lange nach (nach 6 s höchstens 22 dB leiser, Puffer ≥ 15 s)", g.E ? JSON.stringify(g.E) : "");
  sage(Object.values(g).every((x) => x.ende <= -60), "jeder Puffer endet still (weich ausgeblendet, kein Knacken)", JSON.stringify(Object.values(g).map((x) => x.ende)));
  sage(!!r.log && r.log.gespielt === true && r.log.art === "gegossen", "15:00 – gespielt mit den gegossenen Glocken", JSON.stringify(r.log));
  sage(r.fern >= 0.15 && r.nah > r.fern, "fern vom Rathaus deutlich (≥ 0,15), nah lauter", JSON.stringify({ nah: +r.nah.toFixed(3), fern: +r.fern.toFixed(3) }));
  sage(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " FEHLER" : "\nALLES GRÜN");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
