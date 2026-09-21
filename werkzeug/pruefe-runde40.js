#!/usr/bin/env node
/* =========================================================
   RUNDE 40 — SANDUHR UND GLÜHBIRNE
   ---------------------------------------------------------
   XANDER:
   · „bei der Sanduhr die funktioniert immer noch nicht … es
     könnte realistischer sein, dass sich das Bild wirklich so
     zerfließt wie Sand."
   · „wenn man die Glühbirne dreht, dann soll sie sich
     natürlich von links nach rechts rum drehen … Das muss von
     links nach rechts mit der Fassung mit drehen … und da
     hört man auch dieses realistische Quietschegeräusch."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

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
  const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nDAS BILD ZERRINNT WIE SAND\n");
  const sd = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-sandwerk").forEach((x) => x.remove());
    const namen = [...document.querySelectorAll(".lc-platz .lc-platz-name")]
      .map((x) => x.textContent.trim());
    window.DMA_PRUEFUNG.wirkung("sanduhr", namen[2], namen[0]);
    await new Promise((f) => setTimeout(f, 800));
    const w = document.querySelector(".lc-sandwerk");
    const k = document.querySelector(".lc-zerrinnt");
    if (!w || !k) return { da: false };
    const rw = w.getBoundingClientRect(), rk = k.getBoundingClientRect();
    /* Die Kante muss UNRUHIG sein — eine gerade Linie ist ein Rollo,
       kein Sand. Also: hat der clip-path mehr als vier Ecken, und
       liegen die nicht alle auf derselben Hoehe? */
    const cp = getComputedStyle(k).clipPath;
    /* Der berechnete clip-path kann in px ODER in % stehen — je
       nachdem, wie der Browser das Vieleck aufloest. Beides zaehlt. */
    const zahlen = (cp.match(/-?[\d.]+(px|%)/g) || []).map(parseFloat);
    const hoehen = zahlen.filter((_, i) => i % 2 === 1);
    const oben = hoehen.slice(0, hoehen.length - 2);
    const unruhe = oben.length ? Math.max.apply(null, oben) - Math.min.apply(null, oben) : 0;
    return { da: true, ecken: zahlen.length / 2, unruhe: unruhe,
             korn: w.querySelectorAll(".lc-sandkorn").length,
             haufen: w.querySelectorAll(".lc-sandhaufen").length,
             deckt: Math.abs(rw.top - rk.top) < 2 && Math.abs(rw.width - rk.width) < 2,
             schnitt: getComputedStyle(w).overflow };
  });
  pruefe("die Sanduhr zeichnet wirklich etwas", sd.da === true);
  pruefe("die Kante hat viele Ecken (kein gerades Rollo)",
    sd.da && sd.ecken >= 10, (sd.ecken || 0) + " Ecken");
  pruefe("und sie ist unruhig, wie eine Sandoberfläche",
    sd.da && sd.unruhe > 2, (sd.unruhe || 0).toFixed(1) + " px Höhenunterschied");
  pruefe("Körner fallen herunter", sd.da && sd.korn >= 10, (sd.korn || 0) + " Körner");
  pruefe("und unten sammelt sich ein Haufen", sd.da && sd.haufen === 1);
  pruefe("der Sand liegt genau über dem Bild", Boolean(sd.deckt));
  pruefe("und wird am Bildrand abgeschnitten", sd.schnitt === "hidden", String(sd.schnitt));

  console.log("\nDIE GLÜHBIRNE\n");
  const gb = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-birne").forEach((x) => x.remove());
    const name = ((document.querySelectorAll(".lc-platz .lc-platz-name")[1] || {}).textContent || "").trim();
    window.DMA_PRUEFUNG.wirkung("gluehbirne", name);
    await new Promise((f) => setTimeout(f, 500));
    const g = document.querySelector(".lc-birne-gewinde");
    const k = document.querySelector(".lc-eingedreht");
    let dreht = 0;
    if (k) {
      const cs = getComputedStyle(k).transform;
      const m = cs.match(/matrix\(([^)]+)\)/);
      if (m) {
        const z = m[1].split(",").map(Number);
        dreht = Math.atan2(z[1], z[0]) * 180 / Math.PI;
      }
    }
    return { gewinde: Boolean(g), dreht: dreht,
             bewegt: g ? getComputedStyle(g).animationName : "" };
  });
  pruefe("das Gewinde ist gezeichnet", gb.gewinde === true);
  pruefe("und es bewegt sich mit hinein",
    Boolean(gb.bewegt) && gb.bewegt !== "none", String(gb.bewegt));
  /* Rechtsherum eindrehen heisst: der Winkel waechst im Uhrzeigersinn.
     Steht er bei 0, dreht gar nichts. */
  pruefe("das Bild dreht sich beim Eindrehen", Math.abs(gb.dreht) > 1,
    gb.dreht.toFixed(0) + "°");

  console.log("\nUND DER TON DAZU\n");
  const plan = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  pruefe("die Glühbirne nimmt ihr EIGENES Quietschgeräusch",
    /gluehbirne:\s*\{\s*ton:\s*"gluehbirne"/.test(plan));
  pruefe("es gibt die Datei dazu",
    fs.existsSync(path.join(WURZEL, "ton", "gluehbirne.opus")));

  /* ---------- DIE SPRECHBILDER AUS DIESER RUNDE ---------- */
  console.log("\nBLUT, EIS, SPINNE UND DIE ALTE VHS-STÖRUNG\n");
  const sb = await pg.evaluate(async () => {
    const setzen = async (art) => {
      document.querySelectorAll(".lc-platz").forEach((p) => {
        p.classList.remove("lc-platz-spricht"); p.removeAttribute("data-sprechbild");
      });
      const pl = document.querySelectorAll(".lc-platz")[1];
      pl.classList.add("lc-platz-spricht");
      pl.setAttribute("data-sprechbild", art);
      await new Promise((f) => setTimeout(f, 400));
      return pl;
    };
    const erg = {};
    let pl = await setzen("blut");
    let k = pl.querySelector(".lc-kreis");
    let cs = getComputedStyle(k, "::after");
    erg.blut = { lagen: (cs.backgroundImage.match(/gradient/g) || []).length,
                 ani: cs.animationName };
    pl = await setzen("eis");
    cs = getComputedStyle(pl, "::after");
    erg.eis = { anzeige: cs.display, ani: cs.animationName,
                svg: cs.backgroundImage.indexOf("svg") >= 0 };
    pl = await setzen("spinnweb");
    k = pl.querySelector(".lc-kreis");
    cs = getComputedStyle(k, "::after");
    erg.spinne = { wiederholung: cs.animationIterationCount, dauer: cs.animationDuration,
                   richtung: cs.animationDirection };
    pl = await setzen("stoerung");
    k = pl.querySelector(".lc-kreis");
    erg.stoerung = { bild: getComputedStyle(k).animationTimingFunction,
                     rausch: getComputedStyle(k, "::before").animationTimingFunction,
                     band: getComputedStyle(k, "::after").animationTimingFunction,
                     lagen: (getComputedStyle(k, "::after").backgroundImage.match(/gradient/g) || []).length };
    return erg;
  });
  /* XANDER: „das ist mehr runter tropft und dann unten auch sich
     bisschen sammelt." Ein Tropfen und keine Lache waere eine Lage. */
  pruefe("Blut: mehrere Tropfen plus die Lache unten",
    sb.blut.lagen >= 6, sb.blut.lagen + " Lagen");
  pruefe("Blut: beide Bewegungen laufen (Fallen und Sammeln)",
    (sb.blut.ani || "").split(",").length === 2, String(sb.blut.ani));
  pruefe("Eis: die Zapfen liegen auf der freien Schicht",
    sb.eis.anzeige === "block" && sb.eis.svg === true, sb.eis.anzeige);
  /* „je länger ich spreche am Stück, dass die Spinne tiefer krabbelt" —
     das geht nur mit EINEM langen Durchlauf, nicht mit einer
     Endlosschleife, die immer wieder nach oben zurückspringt. */
  pruefe("Spinne: ein einziger langer Abstieg, keine Schleife",
    sb.spinne.wiederholung === "1", sb.spinne.wiederholung + "×, " + sb.spinne.dauer);
  pruefe("Spinne: und kein Hin und Her",
    sb.spinne.richtung === "normal", String(sb.spinne.richtung));
  /* Die ORIGINAL-VHS-Störung springt (steps), sie gleitet nicht. */
  pruefe("Störung: das Bild springt, es gleitet nicht",
    /steps/.test(sb.stoerung.bild), String(sb.stoerung.bild));
  pruefe("Störung: das Rauschen springt ebenso",
    /steps/.test(sb.stoerung.rausch), String(sb.stoerung.rausch));
  pruefe("Störung: und die Bänder auch",
    /steps/.test(sb.stoerung.band), String(sb.stoerung.band));
  pruefe("Störung: drei Bänder in drei Farben",
    sb.stoerung.lagen >= 3, sb.stoerung.lagen + " Lagen");

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nSanduhr, Glühbirne und die vier Sprechbilder sitzen.\n");
  process.exit(fehler ? 1 : 0);
})();
