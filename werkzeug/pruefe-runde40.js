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
    /* NACHGEZOGEN (Runde 58). Hier stand vorher „der Winkel waechst im
       Uhrzeigersinn" — gemessen an matrix(). Das war MEINE Regel, und
       sie war falsch: eine Drehung in der Bildebene laesst das Bild
       wie eine Schallplatte kreiseln. XANDER: „Die Birne dreht sich
       immer noch nicht realistisch auf der waagerechten Achse … Die
       Birne soll sich mit der Fassung von links nach rechts drehen."
       Das ist eine Drehung um die SENKRECHTE Achse, und die erkennt
       man daran, dass die Matrix dreidimensional ist, die Breite
       schrumpft und die Schraeglage null bleibt. */
    let raeumlich = false, breit = 1, schraeg = 0;
    if (k) {
      const m = new DOMMatrixReadOnly(getComputedStyle(k).transform);
      raeumlich = m.is2D === false;
      breit = m.m11; schraeg = m.m12;
    }
    return { gewinde: Boolean(g), raeumlich: raeumlich, breit: breit, schraeg: schraeg,
             bewegt: g ? getComputedStyle(g).animationName : "" };
  });
  pruefe("das Gewinde ist gezeichnet", gb.gewinde === true);
  pruefe("und es bewegt sich mit hinein",
    Boolean(gb.bewegt) && gb.bewegt !== "none", String(gb.bewegt));
  pruefe("das Bild dreht raeumlich, nicht in der Bildebene", gb.raeumlich === true);
  pruefe("und zwar um die senkrechte Achse — von links nach rechts",
    Math.abs(gb.breit) < 0.999 && Math.abs(gb.schraeg) < 0.02,
    "Breite " + gb.breit.toFixed(3) + ", Schraeglage " + gb.schraeg.toFixed(3));

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
  /* HIER STAND EINE REGEL, DIE ICH MIR SELBST GEGEBEN HATTE — und
     sie war falsch. „je laenger ich spreche am Stueck, dass die
     Spinne tiefer krabbelt" hiess fuer mich: EIN langer Durchlauf,
     keine Schleife. Genau daraus wurde aber der Fehler, den er
     danach gemeldet hat: „Das Sprechen bricht die Animation einfach
     irgendwann ab. Das soll nicht so sein." Nach 26 Sekunden war der
     Durchlauf zu Ende und die Spinne hing bewegungslos da.
     Richtig ist BEIDES: ein langer Abstieg — und danach etwas, das
     weitergeht. Deshalb jetzt zwei Animationen: das Abseilen einmal,
     und im Anschluss das Krabbeln ohne Ende.
     „Sie krabbelt auch nicht auf ihrem Netz nach laengerem
     Sprechen." */
  const teile = String(sb.spinne.wiederholung).split(",").map((x) => x.trim());
  pruefe("Spinne: der Abstieg laeuft genau einmal",
    teile[0] === "1", teile.join(" / ") + " — " + sb.spinne.dauer);
  pruefe("Spinne: danach krabbelt sie weiter, ohne Ende",
    teile.length === 2 && teile[1] === "infinite", teile.join(" / "));
  /* UND HIER STAND DIE ZWEITE SELBSTGEMACHTE REGEL. Sie beschrieb
     die Fassung, die ich in Runde 41 gebaut hatte — nicht die, die
     er wollte. XANDER, danach, woertlich: „Du hast die Stoerung
     jetzt schon zum zweiten Mal geaendert. Ich habe niemals gesagt,
     dass du die Stoerung im Sprechbild jemals aendern solltest. Die
     erste Version, die du hattest, war perfekt."
     Gemessen wird deshalb ab Runde 55 die Fassung 357: das BILD
     springt (steps), die Zeilen WANDERN gleichmaessig (linear), und
     EIN Band rutscht durchs Bild statt drei zu flackern. */
  pruefe("Störung: das Bild springt, es gleitet nicht",
    /steps/.test(sb.stoerung.bild), String(sb.stoerung.bild));
  pruefe("Störung: die Empfangszeilen wandern gleichmäßig",
    /linear/.test(sb.stoerung.rausch), String(sb.stoerung.rausch));
  /* Das Band rutscht in einem Zug durchs Bild — ein Ruckeln waere
     die Fassung aus Runde 41. */
  pruefe("Störung: das Band rutscht durch, es ruckelt nicht",
    /cubic-bezier|ease/.test(sb.stoerung.band) && !/steps/.test(sb.stoerung.band),
    String(sb.stoerung.band));
  pruefe("Störung: es ist EIN Band, nicht drei",
    sb.stoerung.lagen === 1, sb.stoerung.lagen + " Lagen");

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nSanduhr, Glühbirne und die vier Sprechbilder sitzen.\n");
  process.exit(fehler ? 1 : 0);
})();
