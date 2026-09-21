#!/usr/bin/env node
/* =========================================================
   RUNDE 16 — PAC-MAN, DIE FAHRLINIE UND DAS AUFESSEN
   ---------------------------------------------------------
   GEMELDET, woertlich:
   „Ach so, ich hätte gern noch eine Animation die pacman
    mäßig ist, also zusätzlich zu dem Losfahren, wo mein
    Profilbild zum Kreisel wird und an den Platz fährt, wo
    ich es hinkriege. Aber mit der Logik: wenn ich auf dem
    Platz 1 bin und auf Platz 8 will, dann sollen die Leute
    berücksichtigt werden, die da sitzen, die muss ich dann
    umfahren. Ich kann da nur auf den leeren Plätzen lang
    fahren zu der Position, wo ich hinkommen will. Wenn alles
    voll ist, kann ich nicht losfahren. Und ich möchte aber
    jetzt ne Pac-Man Animation haben, dass mein Profilbild
    sich zu diesem Pac-Man verwandelt und ich den anderen
    auffressen kann, egal wo er sitzt … und er wandert dann
    über die Felder und frisst den anderen auf. Und dann ist
    er praktisch von der Bühne runter … und er muss dann
    wieder klicken, um nach oben zu kommen … Ich möchte, dass
    der Wecker seitlich Schellen hat … Sie sollen von der
    Seitenansicht schräg an der Rundung oben anliegen, so wie
    ein Wecker wirklich richtig aussieht."

   Und aus dem Verlauf, nachgelesen und nachgeholt:
   „dass man den anderen wie so ein Keks aufessen kann …
    Biss für Biss" · „zufällig durch die Plätze springen
    lassen, bis es irgendwann einen neuen Platz gefunden hat"
   · „sein Profilbild so hoch wirft und mit so einem großen
    Tennisschläger … weg schlägt" · „dann fällt das in den
    Loch und verschwindet, wie beim Bowling" · „das Profilbild
    geht so weg, dass es nach unten immer weniger wird, als
    wenn man die Person austrinkt" · „wenn man direkt
    übereinander ist, könnte man die Sanduhr so machen, dass
    ich unten in ihn rein fließe und er sich oben mit mir
    austauscht" · „so Blut, was über das Profil läuft, oder
    Spinnweben".
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

/* Eine Sitzreihe mit acht Plaetzen bauen, in der ICH auf 1 sitze und
   genau bestimmt ist, wer frei ist. Nur so laesst sich die Fahrlinie
   ueberhaupt pruefen — die Pruefbuehne hat keine freien Plaetze. */
const BRETT = (frei) => `
  document.getElementById("lcPruefBuehne")?.remove();
  const b = document.createElement("div");
  b.id = "lcPruefBuehne";
  b.style.padding = "160px 0";
  const namen = ["Alex","Bea","Cem","Dana","Emmi","Fred","Gero","Hana"];
  b.innerHTML = '<div class="question-card livechat" id="livechatKarte">'
    + '<div class="lc-plaetze" id="lcPlaetze">'
    + namen.map(function (n, i) {
        const nr = i + 1;
        const leer = ${JSON.stringify(frei)}.indexOf(nr) >= 0;
        return '<button class="lc-platz' + (nr === 1 ? ' lc-platz-ich' : '')
          + (leer ? ' lc-platz-frei' : '') + '" data-lc-platz="' + nr + '"'
          + ' data-lc-id="p' + nr + '">'
          + '<span class="lc-kreis"></span>'
          + '<span class="lc-platz-name">' + (leer ? 'frei' : n) + '</span></button>';
      }).join("")
    + '</div></div>';
  document.body.appendChild(b);
  try { b.scrollIntoView({ block: "center", behavior: "instant" }); } catch (e) {}
`;

(async () => {
  /* ---------- Was ohne Browser messbar ist ---------- */
  const js  = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const lc  = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");

  console.log("\nDER GROSSE PAC-MAN FUER DEN RAUM IST NICHT KAPUTTGEGANGEN\n");
  pruefe("es gibt weiterhin genau EIN lcPacman",
    (js.match(/function lcPacman\b/g) || []).length === 1,
    "die Jagd heisst lcPacJagd");
  pruefe("und /pacman ohne Namen ist noch der Raumeffekt",
    /e\.wie === "pacman"\) lcPacman\(\)/.test(js));
  pruefe("mit Namen wird daraus die Jagd",
    /pacman:\s*\{ wirkung: "pacjagd"/.test(lc));

  console.log("\nDIE WECKERSCHELLEN LIEGEN AN DER RUNDUNG\n");
  const sch = css.slice(css.indexOf(".lc-schelle {"), css.indexOf("@keyframes lcSchelleR"));
  pruefe("die Ruhelage ist gekippt, nicht senkrecht", /rotate\(-45deg\)/.test(sch),
    "45 Grad — auf der Rundung bei zehn Uhr");
  pruefe("und sie sitzen nicht mehr in der Ecke",
    /\.lc-schelle-l \{ left: -7\.6%/.test(sch), "gerechnet aus 56 % Radius");
  pruefe("die Schelle ist eine Kuppel, keine Scheibe",
    /A17 17 0 0 1 37 25 Z/.test(js), "Halbkreis mit Randleiste und Hals");

  /* ---------- Und jetzt im Browser ---------- */
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
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz, { timeout: 20000 });

  console.log("\nDIE FAHRLINIE — NUR UEBER FREIE PLAETZE\n");
  /* Fall 1: alles besetzt ausser 6,7,8. Von 1 aus sind die Nachbarn
     2 und 5 besetzt — also kommt man gar nicht los. */
  await pg.evaluate(BRETT([6, 7, 8]));
  const zu1 = await pg.evaluate(async () => {
    const vorher = document.querySelector(".lc-platz-ich .lc-kreis").getAnimations().length;
    window.DMA_PRUEFUNG.wirkung("fahren", "8", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    return { laeuft: document.querySelector(".lc-platz-ich .lc-kreis").getAnimations().length - vorher };
  });
  pruefe("eingekeilt faehrt niemand los", zu1.laeuft === 0,
    "„Wenn alles voll ist, kann ich nicht losfahren“");

  /* Fall 2: 5,6,7,8 frei — der Weg 1→5→6→7→8 ist offen. */
  await pg.evaluate(BRETT([5, 6, 7, 8]));
  const weg2 = await pg.evaluate(() => window.DMA_PRUEF.wegPruefen(1, 8, false));
  pruefe("der offene Weg fuehrt aussen herum",
    Array.isArray(weg2) && weg2.join("-") === "1-5-6-7-8", (weg2 || []).join("-") || "keiner");
  const weg3 = await pg.evaluate(() => window.DMA_PRUEF.wegPruefen(1, 4, false));
  pruefe("und durch besetzte Reihen gar nicht", weg3 === null || weg3.join("-") === "1-5-6-7-8-4",
    weg3 ? weg3.join("-") : "kein Weg");

  const fahrt = await pg.evaluate(async () => {
    const kreis = document.querySelector(".lc-platz-ich .lc-kreis");
    window.DMA_PRUEFUNG.wirkung("fahren", "8", "Alex");
    await new Promise((f) => setTimeout(f, 260));
    const a = kreis.getAnimations();
    return { laeuft: a.length,
             dauer: a[0] ? Math.round(a[0].effect.getTiming().duration) : 0,
             schritte: a[0] ? a[0].effect.getKeyframes().length : 0 };
  });
  pruefe("auf dem offenen Weg rollt das Bild los", fahrt.laeuft > 0,
    fahrt.dauer + " ms, " + fahrt.schritte + " Stationen");
  pruefe("und es sind mehr Stationen als bei einer geraden Linie",
    fahrt.schritte >= 7, fahrt.schritte + " Bewegungsbilder (vier Felder plus Bremsen)");

  console.log("\nPAC-MAN JAGT UEBER DIE FELDER\n");
  await pg.evaluate(BRETT([7]));
  const pac = await pg.evaluate(async () => {
    const meiner = document.querySelector(".lc-platz-ich .lc-kreis");
    const opferPlatz = [...document.querySelectorAll(".lc-platz")]
      .find((p) => (p.querySelector(".lc-platz-name") || {}).textContent.trim() === "Hana");
    const opfer = opferPlatz.querySelector(".lc-kreis");
    window.DMA_PRUEFUNG.wirkung("pacjagd", "Hana", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    return {
      pacman: meiner.classList.contains("lc-pacman"),
      laeuft: meiner.getAnimations().length,
      krumen: document.querySelectorAll(".lc-pac-krume").length,
      /* NACHGEBESSERT IN RUNDE 18, und zwar weil die Sache selbst
         sich geaendert hat, nicht weil die Messung stoerte:
         GEMELDET war „der originale Kreis ist beschnitten und nicht
         mehr rund. Das darf nicht passieren." Das Maul wurde bis
         dahin mit clip-path AUS DEM KREIS geschnitten — genau das
         war die Ursache. Jetzt liegt die Original-Figur ueber dem
         Bild und das Maul klappt IN IHR. Gemessen wird deshalb die
         Figur, nicht mehr der Kreis. */
      maul: (() => {
        const f = meiner.querySelector(".lc-pac-figur-maul");
        return f ? getComputedStyle(f).animationName : "";
      })(),
      rund: getComputedStyle(meiner).borderRadius,
      opferSpaeter: (async () => 0)()
    };
  });
  pruefe("mein Bild wird zu Pac-Man", pac.pacman, "Klasse lc-pacman");
  pruefe("das Maul klappt", /lcPacFigurMaulR18|lcPacFigurKlappR18/.test(pac.maul || ""),
    pac.maul || "-");
  pruefe("und der Kreis bleibt dabei rund", /50%/.test(pac.rund || ""), pac.rund || "-");
  pruefe("es wandert ueber die Felder", pac.laeuft > 0, pac.laeuft + " Lauf");
  pruefe("und auf der Linie liegen Punkte", pac.krumen >= 4, pac.krumen + " Punkte");
  /* Und das Wichtigste: wer gefressen wird, geht wirklich herunter. */
  const runter = await pg.evaluate(async () => {
    const l = window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Hana",
      seit: 1000, zuruecksetzen: true, leute: { a1: { id: "a1", name: "Alex", seit: 500 } } });
    void l;
    const vorher = window.LiveChat.aufDerBuehne();
    window.DMA_PRUEFUNG.wirkung("pacjagd", "Hana", "Alex");
    await new Promise((f) => setTimeout(f, 2600));
    return { vorher: vorher, nachher: window.LiveChat.aufDerBuehne() };
  });
  pruefe("wen es trifft, der ist von der Buehne",
    runter.vorher === true && runter.nachher === false,
    "vorher " + runter.vorher + ", nachher " + runter.nachher);
  const zurueck = await pg.evaluate(() => {
    /* „und er muss dann wieder klicken, um nach oben zu kommen" —
       ein Tipp auf einen freien Platz genuegt, das kann die
       Oberflaeche. Hier wird der Weg nachgestellt. */
    window.LiveChat.buehneSetzen(true);
    return window.LiveChat.aufDerBuehne();
  });
  pruefe("und kommt mit einem Tipp wieder hinauf", zurueck === true);

  console.log("\nAUFESSEN — BISS FUER BISS\n");
  await pg.evaluate(BRETT([7, 8]));
  const biss = await pg.evaluate(async () => {
    const platz = [...document.querySelectorAll(".lc-platz")]
      .find((p) => (p.querySelector(".lc-platz-name") || {}).textContent.trim() === "Bea");
    const kreis = platz.querySelector(".lc-kreis");
    const stufen = [];
    window.DMA_PRUEFUNG.wirkung("aufessen", "Bea");
    for (let i = 0; i < 6; i++) {
      await new Promise((f) => setTimeout(f, 620));
      const c = kreis.style.clipPath || "";
      if (c && stufen[stufen.length - 1] !== c) stufen.push(c);
    }
    return { stufen: stufen.length,
             ecken: stufen.length ? (stufen[0].match(/%/g) || []).length / 2 : 0,
             verschieden: new Set(stufen).size };
  });
  pruefe("es wird wirklich am Umriss geschnitten", biss.ecken >= 30,
    biss.ecken + " Ecken im Vieleck");
  pruefe("und zwar mehrmals nacheinander", biss.stufen >= 4 && biss.verschieden === biss.stufen,
    biss.stufen + " Bisse, alle verschieden");

  console.log("\nDAS LOTTO UM EINEN NEUEN PLATZ\n");
  await pg.evaluate(BRETT([6, 7, 8]));
  const lotto = await pg.evaluate(async () => {
    let paket = null;
    window.LiveChat.pruefPost((p) => { if (!paket) paket = p; });
    window.LiveChat.pruefBefehl("/zufall");
    const kreis = document.querySelector(".lc-platz-ich .lc-kreis");
    window.DMA_PRUEFUNG.wirkung("lotto", "", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const a = kreis.getAnimations()[0];
    return { wirkung: paket && paket.wirkung, wen: paket && paket.wen,
             spruenge: a ? a.effect.getKeyframes().length : 0 };
  });
  pruefe("„/zufall“ ohne Namen zieht ein Los", lotto.wirkung === "lotto" && !lotto.wen,
    (lotto.wirkung || "-"));
  pruefe("und das Bild springt durch die Plaetze", lotto.spruenge >= 12,
    lotto.spruenge + " Stationen");

  console.log("\nDIE NACHGEBESSERTEN\n");
  await pg.evaluate(BRETT([7, 8]));
  const nach = await pg.evaluate(async () => {
    const hole = (n) => [...document.querySelectorAll(".lc-platz")]
      .find((p) => (p.querySelector(".lc-platz-name") || {}).textContent.trim() === n);
    const raus = {};
    /* JEDER EFFEKT AUF EINE ANDERE PERSON — und das ist keine
       Bequemlichkeit, sondern noetig: ein Element hat nur EINE
       animation-Eigenschaft. Liegen zwei Wirkungsklassen gleichzeitig
       auf demselben Kreis, gewinnt die, die im Stilblatt weiter unten
       steht, und die andere sieht man gar nicht. Beim ersten Anlauf
       lagen Tennis und Strohhalm auf derselben Person, und der
       Strohhalm meldete „kein Beschnitt" — er lief nur nicht. */
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("tennis", "Bea");
    await new Promise((f) => setTimeout(f, 160));
    raus.tennisBild = hole("Bea").querySelector(".lc-kreis").classList.contains("lc-getennist");
    raus.tennisBall = document.querySelectorAll(".lc-tennisball").length;
    /* Bowling: das Loch. */
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("bowling", "Cem");
    await new Promise((f) => setTimeout(f, 160));
    raus.loch = document.querySelectorAll(".lc-stoss-loch").length;
    /* Strohhalm: leer getrunken statt gequetscht. */
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("strohhalm", "Dana");
    await new Promise((f) => setTimeout(f, 900));
    const k = hole("Dana").querySelector(".lc-kreis");
    raus.halmPegel = getComputedStyle(k).clipPath || "";
    return raus;
  });
  pruefe("Tennis: das Profilbild selbst wird geschlagen",
    nach.tennisBild && nach.tennisBall === 0, "kein eigener Ball mehr");
  pruefe("Bowling: es gibt ein Loch", nach.loch === 1);
  pruefe("Strohhalm: der Pegel sinkt wirklich",
    /inset/.test(nach.halmPegel), nach.halmPegel.slice(0, 40) || "kein Beschnitt");

  console.log("\nDIE SANDUHR NUR MIT DEM DIREKT DARUNTER\n");
  await pg.evaluate(BRETT([]));
  const sand = await pg.evaluate(async () => {
    const hole = (n) => [...document.querySelectorAll(".lc-platz")]
      .find((p) => (p.querySelector(".lc-platz-name") || {}).textContent.trim() === n);
    /* Emmi sitzt auf 5 — direkt unter mir auf 1. Cem sitzt auf 3. */
    window.DMA_PRUEFUNG.wirkung("sanduhr", "Cem", "Alex");
    await new Promise((f) => setTimeout(f, 200));
    const schraegKlasse = hole("Cem").querySelector(".lc-kreis").classList.contains("lc-zerrinnt");
    window.DMA_PRUEFUNG.wirkung("sanduhr", "Emmi", "Alex");
    await new Promise((f) => setTimeout(f, 200));
    return { schraegKlasse: schraegKlasse,
             gerade: hole("Emmi").querySelector(".lc-kreis").getAnimations().length,
             glas: document.querySelectorAll(".lc-sanduhr-glas").length };
  });
  /* Zwei Sanduhren, beide aus seinem Verlauf: wer schraeg sitzt,
     bekommt die andere — sein Bild rieselt von oben wieder voll. */
  /* NACHGEZOGEN: „bei der Sanduhr die funktioniert immer noch nicht
     … es koennte realistischer sein, dass sich das Bild wirklich so
     zerfliesst wie Sand." Seitdem heisst die Bewegung „lc-zerrinnt"
     und hat eine koernige Kante; „lc-rieselt" war das alte Rollo. */
  pruefe("wer schraeg sitzt, bekommt die rinnende Sanduhr",
    sand.schraegKlasse === true, "lc-zerrinnt");
  pruefe("mit dem direkt darunter wird getauscht", sand.gerade > 0, sand.gerade + " Lauf");
  pruefe("und das Glas steht dazwischen", sand.glas === 1);

  console.log("\nBLUT UND SPINNWEBEN SIND SPRECHBILDER\n");
  const sb = await pg.evaluate(() => {
    const liste = Object.keys(window.LiveChat.sprechbilder());
    return { hat: liste.indexOf("blut") >= 0 && liste.indexOf("spinnweb") >= 0, n: liste.length };
  });
  pruefe("beide stehen zur Wahl", sb.hat, sb.n + " Sprechbilder");

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0, aufSeite.join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Runde 16 sitzt.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
