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
  /* RUNDE 70 NACHGEZOGEN, und die alte Regel hielt einen Fehler fest:
     sie prueft, dass „zwille3" NACH dem Gummi kommt — das tat es auch
     (1150 ms). Nur liegt der EINSCHLAG in dieser Aufnahme erst bei
     1,50 s, er erklang also bei 2650 ms, nach dem Ende der Animation
     (2600 ms), und der Schrei bei 1480 ms lag 1170 ms davor. Genau
     das hat er gemeldet: „bei der Zwille kommt der Schmerz Sound
     immer noch vorher." Jetzt traegt EINE Aufnahme alles, und
     geprueft wird, was wirklich zaehlt: Gummi zuerst, Schrei zuletzt,
     und der Schrei erst nach dem Einschlag bei 1500 ms. */
  const dehn = wann(zw, "gummiband");
  const schrei = Math.max(wann(zw, "schreimann"), wann(zw, "schreifrau"));
  pruefe("das Gummi dehnt sich, bevor die Gummis auf dem Bild ziehen",
    dehn >= 0 && dehn <= 400, dehn + " ms");
  pruefe("und ERST DANN der Schrei", schrei > dehn, schrei + " ms");
  pruefe("der Schrei liegt hinter dem Einschlag (1500 ms)",
    schrei >= 1500, schrei + " ms");

  console.log("\nDIE MUENZE KLINGT BEIM DREHEN, NICHT DANACH\n");
  const mu = await mit("muenze", 900);
  /* RUNDE 70: „muenze.opus" war 2 s gleichmaessig laut, ohne Verlauf
     — XANDER: „die Muenze dreht sich so stottern." „muenze2" dreht,
     eiert und bleibt liegen. Der Zeitpunkt bleibt derselbe. */
  pruefe("der Ton faengt mit der Drehung an", wann(mu, "muenze2") >= 0 && wann(mu, "muenze2") <= 60,
    wann(mu, "muenze2") + " ms (vorher: 3700)");

  console.log("\nDER HAMMER TRIFFT UND KLINGT ZUR GLEICHEN ZEIT\n");
  const ha = await mit("hammer", 900);
  pruefe("der Hammer hat einen eigenen Ton", wann(ha, "hammerbonk") >= 0);
  pruefe("und er liegt auf dem Aufschlag bei 300 ms",
    Math.abs(wann(ha, "hammerbonk") - 300) <= 40, wann(ha, "hammerbonk") + " ms");
  /* RUNDE 70 — XANDER: „Schau dass der Animation Sound vom Hammer
     auch zu Bewegung passt." Der Treffer sass; das Ausholen fehlte. */
  pruefe("und davor holt er hoerbar aus",
    wann(ha, "swoosh") >= 0 && wann(ha, "swoosh") < wann(ha, "hammerbonk"),
    wann(ha, "swoosh") + " ms");

  console.log("\nDIE KASSE KLINGELT, BEVOR DAS GELD FAELLT\n");
  const ge = await mit("geld", 1600);
  /* RUNDE 72 NACHGEFUEHRT: die Datei heisst jetzt „kasse2".
     XANDER: „Das Geld braucht ein Registrierkassen-Geraeusch bevor
     die Muenzen fallen — immer noch nicht hoerbar." Die REIHENFOLGE
     stimmte (diese Sonde hat das ja gemessen), aber „kasse.opus"
     klingelte nur mit -23 dB und hatte ihren lautesten Punkt erst
     bei 0,9 s in der Schublade. „kasse2" ist selbst gebaut,
     klingelt mit -12 dB und ist bei 1,1 s fertig. */
  const kasseTon = wann(ge, "kasse2") >= 0 ? "kasse2" : "kasse";
  pruefe("die Registerkasse klingelt", wann(ge, kasseTon) >= 0,
    kasseTon + " bei " + wann(ge, kasseTon) + " ms");
  pruefe("und das Geldbett kommt erst danach",
    wann(ge, "geld") - wann(ge, kasseTon) >= 600,
    (wann(ge, "geld") - wann(ge, kasseTon)) + " ms spaeter");

  console.log("\nLICHT AUS: EINE GEIGE, KEIN ORCHESTER\n");
  /* RUNDE 70: das Fenster musste groesser werden — die vier
     Geigenstiche kommen erst, wenn es dunkel geworden ist
     (1780 ms), und bei 1200 ms war die Messung schon vorbei. */
  const li = await mit("licht", 2200);
  /* RUNDE 70 NACHGEZOGEN: „horrorgeige" war GEMESSEN ein 2 s
     DURCHGEHENDER Ton — die vier Stiche, die er verlangt hatte,
     waren darin gar nicht zu erkennen. XANDER jetzt: „Der
     Lichtschalter war ganz zuerst in unserer alten Fassung.
     Perfekt … zu dieser allerersten Fassung solltest du nur einen
     Staccato Geigenton hinzufuegen. Kein zupfen … was vier mal kurz
     hintereinander kommt in diesen Horrorfilm." Also: das KLACKEN
     des Schalters traegt wieder, und „geigenstich" bringt die vier
     Stiche (geschnitten, Spitzen bei 0,00/0,30/0,60/0,90 s). */
  pruefe("der Schalter klackt", wann(li, "lichtschalter") >= 0,
    wann(li, "lichtschalter") + " ms");
  /* RUNDE 73 — XANDER: „Die Geigen-Horror-Sache soll langsamer sein,
     wie ein Streichquartett." Gemessen setzte „geigenstich" vier
     Stiche in 1,10 s, also alle 0,30 s — ein Hacken. „geigenquartett"
     ist dieselbe Aufnahme auf 55 % Tempo mit zwei tieferen Lagen:
     vier Stiche in 4,11 s. */
  pruefe("und die vier Geigenstiche kommen danach",
    wann(li, "geigenquartett") > wann(li, "lichtschalter"),
    wann(li, "geigenquartett") + " ms");

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
    /* RUNDE 74: der Ton heisst jetzt „federboing". XANDER:
       „Irgendwie ist das nicht dieses typische Comicgeraeusch."
       „feder.opus" war 3,00 s lang und fiel gleichmaessig ab — ein
       Federklingeln, kein Boing. */
    return window.__toene.filter((x) => x.n === "federboing").map((x) => Math.round(x.t - t0));
  });
  /* „Der Sound muss fuer jedes Feld, auf das sie huepft, immer wieder
     dieses Sprungfedergeraeusch haben und nicht nur einmal."

     RUNDE 72 NACHGEFUEHRT — und zwar bewusst nach UNTEN, mit Grund.
     XANDER: „Der Sound der Sprungfeder ist nicht an die Position
     gebunden, auf die sie springt." Die Feder machte bis dahin IMMER
     genau drei Spruenge, ganz gleich wie weit die Reise ging; die
     vier Toene lagen also zwar auf ihren Aufsetzern, aber die
     Aufsetzer lagen nicht auf den Plaetzen. Jetzt richtet sich die
     Zahl nach der Strecke: ein Sprung je ueberquertem Platz,
     mindestens zwei. Bei der kurzen Reise dieser Sonde (ein Platz
     weit) sind das drei Toene statt vier — das ist die richtige
     Zahl, nicht ein Verlust.
     Die eigentliche Zusicherung ist deshalb jetzt eine andere: die
     Aufsetzer muessen GLEICHMAESSIG verteilt sein, denn nur dann
     liegen sie auf den Feldern. */
  /* RUNDE 74 — UND NOCH EINMAL NACH UNTEN, AUS DEMSELBEN GRUND.
     XANDER: „Bei der Sprungfeder fehlt mir die Kongruenz zu den
     Plaetzen, dass immer dann das Geraeusch kommt, wenn man auf
     einen Platz trifft." Mit `Math.max(2, plaetzeR)` machte sie beim
     Sprung auf den NACHBARPLATZ zwei Spruenge, und der erste setzte
     mitten zwischen zwei Plaetzen auf. Jetzt ist die Zahl der
     Spruenge gleich der Zahl der ueberquerten Plaetze — bei dieser
     Sonde (ein Platz weit) sind das ZWEI Toene: einer beim Abstossen,
     einer beim Aufsetzen auf dem Ziel. Das ist die richtige Zahl. */
  pruefe("sie federt auf jedem Platz, nicht nur einmal", fe.length >= 2,
    fe.length + " Aufsetzer bei " + fe.join(", ") + " ms");
  const abstaende = fe.slice(1).map((t, i) => t - fe[i]);
  const mittel = abstaende.reduce((a, b) => a + b, 0) / (abstaende.length || 1);
  pruefe("und die Aufsetzer liegen gleichmaessig — also auf den Feldern",
    abstaende.length >= 1 && abstaende.every((a) => Math.abs(a - mittel) <= mittel * 0.25),
    "Abstaende " + abstaende.join(", ") + " ms (Mittel " + Math.round(mittel) + ")");

  console.log("\nDIE LIANE RUFT WIE TARZAN\n");
  const ta = await pg.evaluate(async () => {
    window.__toene = [];
    const t0 = performance.now();
    window.DMA_PRUEFUNG.wirkung("liane", "6", "Alex");
    await new Promise((f) => setTimeout(f, 1200));
    return window.__toene.map((x) => ({ n: x.n, t: Math.round(x.t - t0) }));
  });
  /* RUNDE 70 — XANDER: „der Sound auch da klingt nicht nach Tarzan
     … und er koennte von Frauen und Mann auch verschieden sein." */
  pruefe("der Tarzan-Ruf kommt, und zwar nach Mann oder Frau",
    Math.max(wann(ta, "tarzanmann"), wann(ta, "tarzanfrau")) >= 0,
    Math.max(wann(ta, "tarzanmann"), wann(ta, "tarzanfrau")) + " ms");

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
    /* RUNDE 74 — DIESE ZWEI REGELN HAT ER SELBST WIDERRUFEN.
       XANDER: „Die koennen auch noch ein bisschen enger reingehen,
       dass jemand, der auf der rechten Seite sitzt oder links von
       mir, nicht mit meinem Design korreliert und seinen
       Kopfhoerern, falls er im selben Moment Kopfhoerer aufsetzt."
       NACHGERECHNET: ein Platzbild ist 84 px breit, der Abstand
       zweier Plaetze 91 px — dazwischen liegen 7 px. Eine Muschel,
       die zu 55 % neben dem Bild liegt, ragt bei 18 px Breite rund
       10 px hinaus und landet damit auf dem Nachbarn. Jetzt steht
       sie nur noch 3,1 px ueber den Bildrand.
       Die Regel verlangt deshalb das Gegenteil von vorher: die
       Muschel muss ueberwiegend AUF dem Bild liegen und darf
       hoechstens ein Drittel ihrer Breite heraussehen. */
    pruefe("die linke steht nur wenig ueber den Bildrand",
      kh.linksDraussen <= 34, kh.linksDraussen + " % draussen");
    pruefe("die rechte auch", kh.rechtsDraussen <= 34, kh.rechtsDraussen + " % draussen");
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
  /* „Uebrigens ist unser Film-Lok auch gar nicht mehr da."
     RUNDE 60 NACHGEFUEHRT: der Film hiess hier „gglok" — und genau
     das war der Fehler. „gglok" ist einer der alten Namen, die es
     als BEFEHL bewusst nicht geben darf; dadurch war die Wirkung
     „zug" gezeichnet, aber nicht mehr erreichbar (pruefe-effekttueren
     hat es gemeldet). Der Film heisst jetzt „/zug". */
  pruefe("„/lok" + "“ ohne Namen zeigt wieder den Film",
    lk && lk.w === "zug", lk ? lk.w : "nichts");

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
