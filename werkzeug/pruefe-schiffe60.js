#!/usr/bin/env node
/* =========================================================
   RUNDE 60 — PADDELN UND DAS SEITENRAD
   ---------------------------------------------------------
   XANDER: „Ich will bei dem Segelboot, dass ich zusaetzlich
   paddle. Und bei dem Raddampfer vom Mississippi: da muss in
   der Mitte so ein grosses Rad sein, wie das klassisch ist,
   nicht hinten."

   Ein Bild sagt hier nichts, ein Klassenname auch nicht — die
   Frage ist, WO die Teile liegen. Deshalb wird gemessen:
     · steht das Paddel wirklich da, und bewegt es sich?
     · reicht das Blatt bis unter den Rumpf, also ins Wasser?
       (Beim ersten Versuch steckte es IM Boot.)
     · liegt die Mitte des Schaufelrads in der Schiffsmitte
       und nicht mehr am Heck?
     · ist das Rad rund und nicht oval?
     · ist der Radkasten wieder da (er stand auf display:none)
       und sitzt er UEBER der Radachse?
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 900, height: 760 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    /* Eine Reise braucht ein FREIES Ziel, sonst zeichnet sie zu Recht
       nichts. Die Pruefbuehne besetzt alle fuenf Plaetze. */
    const r = document.getElementById("lcPlaetze"), v = document.querySelector(".lc-platz");
    if (r && v && !r.querySelector(".lc-platz-frei")) {
      const f = v.cloneNode(true);
      f.className = "lc-platz lc-platz-frei"; f.dataset.lcPlatz = "6";
      r.appendChild(f);
    }
  });

  const messen = async (wirkung, klasse) => pg.evaluate(async ({ w, k }) => {
    document.querySelectorAll(".lc-boot").forEach((x) => x.remove());
    const n = (document.querySelector(".lc-platz .lc-platz-name") || {}).textContent || "";
    window.DMA_PRUEFUNG.wirkung(w, "6", String(n).trim());
    await new Promise((f) => setTimeout(f, 320));
    const el = document.querySelector("." + k);
    if (!el) return null;
    const kasten = (sel) => {
      const e = el.querySelector(sel);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, mx: r.x + r.width / 2, my: r.y + r.height / 2 };
    };
    const laeuft = (sel) => {
      const e = el.querySelector(sel);
      return e ? e.getAnimations().length : 0;
    };
    const ganz = el.getBoundingClientRect();
    return {
      schiff: { x: ganz.x, y: ganz.y, w: ganz.width, h: ganz.height,
                mx: ganz.x + ganz.width / 2, unten: ganz.y + ganz.height },
      rumpf: kasten(".lc-boot-rumpf"),
      paddel: kasten(".lc-boot-paddel"),
      blatt: kasten(".lc-paddel-blatt"),
      /* DREHUNGSFREI GEMESSEN. getBoundingClientRect() liefert bei
         einem gedrehten Element den gedrehten Kasten — daran ist
         schon einmal eine Messung gescheitert (Runde 59, die Liane).
         getBBox() gibt die Masse im SVG-Koordinatensystem, und die
         drehen sich nicht mit. */
      blattEigen: (() => {
        const e = el.querySelector(".lc-paddel-blatt");
        const sv = el.querySelector(".lc-boot-paddel svg");
        if (!e || !sv || !e.getBBox) return null;
        const bb = e.getBBox();
        const vb = sv.viewBox.baseVal;
        return { breit: bb.width, hoch: bb.height, feldBreit: vb.width };
      })(),
      platsch: kasten(".lc-boot-platsch"),
      rad: kasten(".lc-dampfer-rad"),
      kastenRad: kasten(".lc-dampfer-kasten"),
      spritzer: kasten(".lc-dampfer-spritzer"),
      paddelLaeuft: laeuft(".lc-boot-paddel"),
      platschLaeuft: laeuft(".lc-boot-platsch"),
      radLaeuft: laeuft(".lc-dampfer-rad")
    };
  }, { w: wirkung, k: klasse });

  console.log("\nDAS SEGELBOOT PADDELT\n");
  const b = await messen("boot", "lc-boot");
  pruefe("das Segelboot steht da", Boolean(b));
  if (b) {
    pruefe("es hat ein Paddel", Boolean(b.paddel));
    pruefe("und das Paddel bewegt sich", b.paddelLaeuft > 0, b.paddelLaeuft + " Animation(en)");
    pruefe("es hat einen Platscher", Boolean(b.platsch) && b.platschLaeuft > 0);
    if (b.blatt && b.rumpf) {
      /* Das Blatt muss UNTER den Rumpfboden reichen — sonst paddelt
         er im Boot und nicht im Wasser. Gemessen an der Unterkante. */
      const rumpfUnten = b.rumpf.y + b.rumpf.h;
      pruefe("das Blatt reicht bis ins Wasser, nicht nur ins Boot",
        b.blatt.y + b.blatt.h >= rumpfUnten - 2,
        "Blatt endet bei " + Math.round(b.blatt.y + b.blatt.h)
        + ", Rumpfboden bei " + Math.round(rumpfUnten));
      pruefe("und das Blatt ist breit genug, um ein Paddel zu sein",
        Boolean(b.blattEigen) && b.blattEigen.breit >= b.blattEigen.feldBreit * 0.7,
        b.blattEigen
          ? b.blattEigen.breit.toFixed(1) + " von " + b.blattEigen.feldBreit + " Einheiten"
          : "nicht messbar");
    } else {
      pruefe("Blatt und Rumpf sind messbar", false);
    }
  }

  console.log("\nDER RADDAMPFER HAT DAS RAD IN DER MITTE\n");
  const d = await messen("dampfer", "lc-dampfer");
  pruefe("der Raddampfer steht da", Boolean(d));
  if (d && d.rad) {
    const ab = (d.rad.mx - d.schiff.mx) / d.schiff.w;
    pruefe("das Rad sitzt mittschiffs, nicht am Heck",
      Math.abs(ab) <= 0.06, "Mitte um " + (ab * 100).toFixed(1) + " % versetzt");
    pruefe("das Rad ist rund, kein Ei",
      Math.abs(d.rad.w - d.rad.h) <= Math.max(2, d.rad.h * 0.08),
      Math.round(d.rad.w) + " breit auf " + Math.round(d.rad.h) + " hoch");
    pruefe("und es dreht sich", d.radLaeuft > 0, d.radLaeuft + " Animation(en)");
    pruefe("es ist gross: mindestens ein Drittel der Schiffshoehe",
      d.rad.h >= d.schiff.h * 0.33,
      Math.round(d.rad.h) + " von " + Math.round(d.schiff.h) + " px");
  } else if (d) {
    pruefe("das Rad ist messbar", false);
  }
  if (d && d.kastenRad && d.rad) {
    pruefe("der Radkasten ist wieder da", d.kastenRad.w > 0 && d.kastenRad.h > 0);
    pruefe("und er sitzt UEBER der Radachse",
      d.kastenRad.y + d.kastenRad.h <= d.rad.my + d.rad.h * 0.15,
      "Kasten endet bei " + Math.round(d.kastenRad.y + d.kastenRad.h)
      + ", Achse bei " + Math.round(d.rad.my));
    pruefe("er deckt das Rad auch wirklich ab",
      d.kastenRad.w >= d.rad.w,
      Math.round(d.kastenRad.w) + " zu " + Math.round(d.rad.w) + " px");
  } else if (d) {
    pruefe("der Radkasten ist messbar", false, "fehlt");
  }
  if (d && d.spritzer && d.rad) {
    pruefe("die Gischt steht unter dem Rad",
      Math.abs((d.spritzer.mx - d.rad.mx) / d.schiff.w) <= 0.06,
      "um " + (((d.spritzer.mx - d.rad.mx) / d.schiff.w) * 100).toFixed(1) + " % versetzt");
  }

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nPaddel und Seitenrad sitzen.\n");
  process.exit(fehler ? 1 : 0);
})();
