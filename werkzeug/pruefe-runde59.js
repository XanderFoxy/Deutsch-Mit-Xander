#!/usr/bin/env node
/* =========================================================
   RUNDE 59 — TOENE ZUR RICHTIGEN ZEIT, BLITZE MIT ÄSTEN
   ---------------------------------------------------------
   Diese Sonde misst NICHT, ob es einen Ton gibt — das war nie
   das Problem. Sie misst, WANN er klingt und WAS in der Datei
   steht. Genau daran lag naemlich jede einzelne Meldung:

   · „Das Schmerzgeraeusch kommt viel zu spaet." — im Code stand
     200 ms Abstand, in den Dateien lagen 0,25 s und 0,54 s
     Stille davor.
   · „Bei der Zwille hoert man vorher schon das Schmerzgeraeusch,
     bevor die Zwille ueberhaupt los schiesst." — „zwille.opus"
     war 1,52 s lang still.
   · „Der Sound von der Muenze faengt erst danach an." — er stand
     auf 3700 ms.
   · „Das Geld hat immer noch kein Registerkassenklingeln." — die
     Kasse lief, ging aber im Geldbett unter.
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
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* Der Mitschnitt: welche Datei faengt wann an? */
  await pg.evaluate(() => {
    window.__toene = [];
    const O = window.Audio;
    window.Audio = function (src) { return new O(src); };
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene.push({ t: Math.round(performance.now()),
        n: (this.currentSrc || this.src || "").split("/").pop().split("?")[0].replace(/\.(opus|m4a)$/, "") });
      return ap.call(this);
    };
  });
  const mit = async (wirkung, warte) => pg.evaluate(async (a) => {
    window.__toene = [];
    const t0 = performance.now();
    window.DMA_PRUEFUNG.wirkung(a[0], "Cem", "Alex");
    await new Promise((f) => setTimeout(f, a[1]));
    return window.__toene.map((x) => ({ n: x.n, t: Math.round(x.t - t0) }));
  }, [wirkung, warte]);
  const wann = (liste, name) => {
    const t = liste.find((x) => x.n === name);
    return t ? t.t : -1;
  };

  console.log("\nDIE OHRFEIGE: ERST DER SCHLAG, DANN DER SCHMERZ — DICHT DAHINTER\n");
  const oh = await mit("ohrfeige", 2200);
  const klatsch = wann(oh, "klatsch"), au = Math.max(wann(oh, "aumann"), wann(oh, "aufrau"));
  pruefe("der Schlag klingt", klatsch >= 0, klatsch + " ms");
  pruefe("und der Schmerzlaut kommt danach", au > klatsch, au + " ms");
  /* „Das muss in dem Moment, wenn es aufprallt, schon weh tun." */
  pruefe("aber dicht dahinter, nicht zwei Sekunden spaeter",
    au - klatsch <= 120, (au - klatsch) + " ms Abstand");

  console.log("\nDIE ZWILLE: DEHNEN, SCHUSS, SCHREI — IN DIESER REIHENFOLGE\n");
  const zw = await mit("zwille", 2400);
  const dehn = wann(zw, "gummizug"), schuss = wann(zw, "zwille3");
  const schrei = Math.max(wann(zw, "schreimann"), wann(zw, "schreifrau"));
  pruefe("das Gummi dehnt sich von Anfang an", dehn >= 0 && dehn <= 60, dehn + " ms");
  pruefe("dann kommt der Schuss", schuss > dehn, schuss + " ms");
  pruefe("und ERST DANN der Schrei", schrei > schuss, schrei + " ms");

  console.log("\nDIE MUENZE KLINGT BEIM DREHEN, NICHT DANACH\n");
  const mu = await mit("muenze", 900);
  pruefe("der Ton faengt mit der Drehung an", wann(mu, "muenze") >= 0 && wann(mu, "muenze") <= 60,
    wann(mu, "muenze") + " ms (vorher: 3700)");

  console.log("\nDER HAMMER TRIFFT UND KLINGT ZUR GLEICHEN ZEIT\n");
  const ha = await mit("hammer", 900);
  pruefe("der Hammer hat einen eigenen Ton", wann(ha, "hammerbonk") >= 0);
  pruefe("und er liegt auf dem Aufschlag bei 300 ms",
    Math.abs(wann(ha, "hammerbonk") - 300) <= 40, wann(ha, "hammerbonk") + " ms");

  console.log("\nDIE KASSE KLINGELT, BEVOR DAS GELD FAELLT\n");
  const ge = await mit("geld", 1600);
  pruefe("die Registerkasse klingelt", wann(ge, "kasse") >= 0, wann(ge, "kasse") + " ms");
  pruefe("und das Geldbett kommt erst danach",
    wann(ge, "geld") - wann(ge, "kasse") >= 600,
    (wann(ge, "geld") - wann(ge, "kasse")) + " ms spaeter");

  console.log("\nLICHT AUS: EINE GEIGE, KEIN ORCHESTER\n");
  const li = await mit("licht", 1200);
  pruefe("die Horrorgeige klingt", wann(li, "horrorgeige") >= 0, wann(li, "horrorgeige") + " ms");
  pruefe("und die alte Datei nicht mehr", wann(li, "horror") < 0);

  console.log("\nDIE SPRUNGFEDER KLINGT BEI JEDEM AUFSETZEN\n");
  await pg.evaluate(() => {
    const r = document.getElementById("lcPlaetze"), v = document.querySelector(".lc-platz");
    if (r && v && !r.querySelector(".lc-platz-frei")) {
      const f = v.cloneNode(true); f.className = "lc-platz lc-platz-frei";
      f.dataset.lcPlatz = "6";
      const n = f.querySelector(".lc-platz-name"); if (n) n.textContent = "frei";
      r.appendChild(f);
    }
  });
  const fe = await pg.evaluate(async () => {
    window.__toene = [];
    const t0 = performance.now();
    window.DMA_PRUEFUNG.wirkung("feder", "6", "Alex");
    await new Promise((f) => setTimeout(f, 3200));
    return window.__toene.filter((x) => x.n === "feder").map((x) => Math.round(x.t - t0));
  });
  /* „Der Sound muss fuer jedes Feld, auf das sie huepft, immer wieder
     dieses Sprungfedergeraeusch haben und nicht nur einmal." */
  pruefe("sie federt mehrfach, nicht einmal", fe.length >= 4,
    fe.length + " Aufsetzer bei " + fe.join(", ") + " ms");

  console.log("\nDIE LIANE RUFT WIE TARZAN\n");
  const ta = await pg.evaluate(async () => {
    window.__toene = [];
    const t0 = performance.now();
    window.DMA_PRUEFUNG.wirkung("liane", "6", "Alex");
    await new Promise((f) => setTimeout(f, 1200));
    return window.__toene.map((x) => ({ n: x.n, t: Math.round(x.t - t0) }));
  });
  pruefe("der Tarzan-Ruf kommt", wann(ta, "tarzan") >= 0, wann(ta, "tarzan") + " ms");

  console.log("\nUND AM ENDE EINER REISE KEIN FALSCHES GERAEUSCH MEHR\n");
  const ank = await pg.evaluate(() => window.DMA_PRUEFUNG.ankunftsTon());
  /* „Beim Raddampfer, wenn er ankommt, kommt wieder so ein komisches
     Peitsch-Geraeusch … das kannst du ueberhaupt bei allen Sachen
     rausnehmen, wo es gar nicht reingehoert." */
  pruefe("das Segelboot platscht nicht mehr beim Ankommen", !ank.boot);
  pruefe("der Raddampfer auch nicht", !ank.dampfer);
  pruefe("das Flugzeug bremst nicht mehr", !ank.flug);
  pruefe("und die Lok quietscht nicht mehr", !ank.lok);
  pruefe("der Kran setzt seine Last aber weiterhin ab", ank.kran === "bonk");

  console.log("\nDIE BLITZE HABEN ÄSTE UND VERJUENGUNG\n");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const bild = /--lc-strom-0: url\("data:image\/svg\+xml,([^"]*)"\)/.exec(css);
  pruefe("es gibt das Blitzbild", Boolean(bild));
  if (bild) {
    const svg = decodeURIComponent(bild[1]);
    const breiten = [...svg.matchAll(/stroke-width="([\d.]+)"/g)].map((m) => Number(m[1]));
    const striche = (svg.match(/<path/g) || []).length;
    /* EINE geknickte Linie hat EINE Strichstaerke. Ein Blitz, der sich
       verjuengt, hat viele verschiedene — und weil er sich verzweigt,
       besteht er aus vielen Abschnitten. */
    pruefe("ein Blitz besteht aus vielen Abschnitten, nicht aus einer Linie",
      striche >= 120, striche + " Abschnitte");
    pruefe("und sie sind verschieden dick — das ist die Verjuengung",
      new Set(breiten.map((b) => b.toFixed(2))).size >= 30,
      new Set(breiten.map((b) => b.toFixed(2))).size + " verschiedene Staerken");
    pruefe("filigran bleibt er trotzdem", Math.max(...breiten) <= 3.4,
      "dickster Strich " + Math.max(...breiten));
  }

  console.log("\nDIE AIRPODS MAX LIEGEN NEBEN DEM BILD\n");
  const kh = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-kopfhoerer").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Cem", "Alex");
    await new Promise((f) => setTimeout(f, 600));
    const pl = [...document.querySelectorAll(".lc-platz")]
      .find((p) => (p.querySelector(".lc-platz-name") || {}).textContent.trim() === "Cem");
    const sv = pl.querySelector(".lc-kopfhoerer-bild");
    if (!sv) return null;
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    const g = [...sv.querySelectorAll("g")].map((x) => x.getBoundingClientRect());
    if (g.length < 2) return { muscheln: g.length };
    return { muscheln: g.length,
             /* Wie viel von der linken Muschel liegt AUSSERHALB des Bildes? */
             linksDraussen: Math.round((Math.min(k.left, g[0].right) - g[0].left)
                                       / g[0].width * 100),
             rechtsDraussen: Math.round((g[1].right - Math.max(k.right, g[1].left))
                                        / g[1].width * 100),
             /* Kein Blick IN die Muschel: keine grosse dunkle Flaeche. */
             keinLoch: !sv.querySelector('rect[fill="#39404f"]') };
  });
  pruefe("es gibt zwei Muscheln", kh && kh.muscheln === 2, kh ? kh.muscheln + "" : "-");
  if (kh && kh.muscheln === 2) {
    pruefe("die linke liegt groesstenteils NEBEN dem Bild",
      kh.linksDraussen >= 55, kh.linksDraussen + " % draussen");
    pruefe("die rechte auch", kh.rechtsDraussen >= 55, kh.rechtsDraussen + " % draussen");
    pruefe("und man guckt nicht mehr in die Hoermuschel hinein", kh.keinLoch);
  }

  console.log("\nDER LOKFILM IST WIEDER ZU ERREICHEN\n");
  const lk = await pg.evaluate(async () => {
    let paket = null;
    window.LiveChat.pruefPost((p) => { if (!paket) paket = p; });
    window.LiveChat.pruefBefehl("/lok");
    window.LiveChat.pruefPost(null);
    return paket ? { w: paket.wirkung, t: String(paket.text || "") } : null;
  });
  /* „Uebrigens ist unser Film-Lok auch gar nicht mehr da." */
  pruefe("„/lok" + "“ ohne Namen zeigt wieder den Film",
    lk && lk.w === "gglok", lk ? lk.w : "nichts");

  console.log("\nUND DIE STOERUNG IST NOCH IMMER DIE ALLERERSTE\n");
  /* XANDER: „Schau bitte auch, dass wir die erste Stoerung als
     Profileffekt haben, die wir ganz zuerst hatten … kontrolliere,
     dass das immer noch so ist." Geprueft wird die Zeichnung von
     Fassung 356: sechs Baender, ein Rauschen, und das Bild verliert
     die Farbe. */
  pruefe("sechs Baender, wie damals",
    /for \(let i = 0; i < 6; i\+\+\) \{\s*\n\s*const b = document\.createElement\("i"\);\s*\n\s*b\.className = "lc-stoer-band";/
      .test(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8")));
  pruefe("das Rauschen liegt darueber",
    /\.lc-stoer-rauschen \{[\s\S]{0,260}?repeating-linear-gradient\(0deg, rgba\(255,255,255,\.14\) 0 1px/.test(css));
  pruefe("und das Bild verliert kurz die Farbe",
    /\.lc-gestoert \{ animation: lcEmpfangWeg 3s steps\(1\) both; \}/.test(css));

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nRunde 59 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
