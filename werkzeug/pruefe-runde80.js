/* =====================================================================
   SONDE RUNDE 80 — was Xander am 22. September gemeldet hat
   ---------------------------------------------------------------------
   Jede Regel hier steht fuer einen Satz von ihm. Sie misst, statt zu
   glauben: Toene werden dekodiert und ihre Huellkurve gerechnet, Bahnen
   werden Bild fuer Bild abgetastet, und die Sitzplatz-Auszeichnung wird
   waehrend jeder Wirkung mit ihrem Ruhezustand verglichen.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text); };

/* --- Ein Geraeusch messen: Laenge und Huellkurve in 50-ms-Schritten -- */
function tonMessen(name) {
  const roh = "/tmp/claude-0/pr80-" + name + ".raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", name + ".opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const n = b.length / 2, st = 1200, huelle = [];
  let spitze = 0;
  for (let i = 0; i < n; i += st) {
    let x = 0;
    for (let j = i; j < Math.min(n, i + st); j++) {
      const v = Math.abs(b.readInt16LE(j * 2)); if (v > x) x = v;
    }
    if (x > spitze) spitze = x;
    huelle.push(x ? Math.round(20 * Math.log10(x / 32768)) : -99);
  }
  return { dauer: n / 24000, huelle: huelle,
           spitze: spitze ? 20 * Math.log10(spitze / 32768) : -99 };
}

(async () => {
  console.log("RUNDE 80 — Xanders Liste vom 22. September");

  /* =================================================================
     1. DIE TOENE
     ================================================================= */
  console.log("\nToene");

  /* „Der Regen ist von der Animation laenger als sein Sound … beim
     Gewitter ist es dasselbe. Das muss getimet sein und perfekt
     passen." Die Animation dauert 12 000 bzw. 11 000 ms. */
  const regen = tonMessen("regen");
  sage(Math.abs(regen.dauer - 12) < 0.25,
    "regen ist " + regen.dauer.toFixed(2) + " s lang (Animation: 12,00 s)");
  const gewitter = tonMessen("gewitter");
  sage(Math.abs(gewitter.dauer - 11) < 0.25,
    "gewitter ist " + gewitter.dauer.toFixed(2) + " s lang (Animation: 11,00 s)");
  /* Und es darf keine Stille mittendrin geben — sonst hoert man die
     Schleife, die es frueher war. */
  const gLuecke = gewitter.huelle.slice(0, -4).filter((d) => d < -40).length;
  sage(gLuecke === 0, "gewitter hat keine stille Stelle (" + gLuecke + " Proben unter -40 dB)");

  /* „bist du dir sicher, dass es die Stoerung ist, die wir
     urspruenglich hatten?" — sie hat jetzt ein eigenes Rauschen. */
  sage(fs.existsSync(path.join(WURZEL, "ton", "rauschen.opus")),
    "ton/rauschen.opus gibt es");
  const app = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/stoerung:\s*\{\s*ton:\s*"rauschen"/.test(app),
    "die Stoerung benutzt rauschen statt des Gewittertons");

  /* „am Ende ist so ein Klick Sound zu hoeren." Der lag bei 1,90 s. */
  const hammer = tonMessen("hammerbonk");
  const hLetzte = hammer.huelle.slice(-6);
  sage(hammer.dauer < 1.6 && Math.max(...hLetzte) < -50,
    "hammerbonk endet nach " + hammer.dauer.toFixed(2) + " s ohne Klick"
    + " (letzte 0,3 s hoechstens " + Math.max(...hLetzte) + " dB)");

  /* „Bei dem Pfeilbogen ist das immer noch nicht synchron mit dem
     Sound." In der Aufnahme steckten ZWEI Einschlaege. */
  const pfeil = tonMessen("pfeilschuss");
  const laut = pfeil.huelle.filter((d) => d > -18).length;
  sage(pfeil.huelle.indexOf(Math.max(...pfeil.huelle)) <= 1 && laut <= 4,
    "pfeilschuss hat nur EINEN Einschlag, und der liegt am Anfang"
    + " (" + laut + " laute Proben)");

  /* „Peitschen knallen … koennte man den Sound ein bisschen fester,
     haerter machen." Der Knall muss deutlich ueber dem Ausholen
     liegen. */
  const peitsche = tonMessen("peitschehieb");
  const pKnall = Math.max(...peitsche.huelle);
  const pVor = Math.max(...peitsche.huelle.slice(0, 8));
  sage(pKnall - pVor >= 22,
    "peitschehieb: der Knall liegt " + (pKnall - pVor) + " dB ueber dem Ausholen");

  /* „Der Spuck Strohhalm hat immer noch zwei Sounds." */
  const spuck = tonMessen("spuckkugel");
  sage(spuck.dauer < 1.1,
    "spuckkugel ist auf " + spuck.dauer.toFixed(2) + " s gekuerzt (vorher 2,00 s mit Ekel darin)");

  /* „Bei der Trommel koenntest du noch einen Gong hinzufuegen … und
     vielleicht mit zwei Haenden so Bongo." */
  for (const n of ["gong", "bongo"]) {
    sage(fs.existsSync(path.join(WURZEL, "ton", n + ".opus")), "ton/" + n + ".opus gibt es");
  }
  const gong = tonMessen("gong");
  sage(gong.dauer > 3 && gong.huelle[gong.huelle.length - 6] > -40,
    "der Gong klingt " + gong.dauer.toFixed(2) + " s lang aus");

  /* =================================================================
     2. DIE ZEICHNUNG — gerechnet, nicht angesehen
     ================================================================= */
  /* „unter der Kategorie Bombe kannst du auch noch ne Granate machen." */
  sage(fs.existsSync(path.join(WURZEL, "ton", "granate.opus")), "ton/granate.opus gibt es");
  const gran = tonMessen("granate");
  const knallBei = gran.huelle.indexOf(Math.max(...gran.huelle)) * 0.05;
  sage(gran.dauer > 3 && knallBei > 1.5 && knallBei < 2.4,
    "die Granate zischt und knallt dann bei " + knallBei.toFixed(2) + " s");

  console.log("\nZeichnung");

  /* „Bei den Armen, die einen umarmen … die haben immer noch ein
     Knick." Die Mittellinie des Arms darf ihre Richtung nirgends
     springen lassen. Dieselbe Rechnung wie in lcArmSvg. */
  const rippe = (t) => {
    const u = 1 - t;
    const dx = 3*u*u*14 + 6*u*t*(31-14) + 3*t*t*(46-31);
    const dy = 3*u*u*(53.6-52) + 6*u*t*(57.6-53.6) + 3*t*t*(60.9-57.6);
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };
  let sprung = 0, vor = null;
  for (let i = 0; i <= 22; i++) {
    const w = rippe(i / 22);
    if (vor !== null) sprung = Math.max(sprung, Math.abs(w - vor));
    vor = w;
  }
  sage(sprung < 2,
    "der Umarmungsarm knickt nicht: groesster Richtungssprung " + sprung.toFixed(2) + " Grad");
  sage(/const rippe = \(t\)/.test(app),
    "der Arm wird aus einer Rueckgratlinie gerechnet, nicht aus Handkanten");

  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");

  /* „Die Boxhandschuhe … sollen von links unten und von rechts unten
     kommen … mit der Flaeche und nicht seitlich." */
  sage(/lcFaustLinksUnten/.test(css) && /lcFaustRechtsUnten/.test(css),
    "die Boxhandschuhe kommen von links unten und rechts unten");
  sage(/translate\(-150%, 150%\) rotate\(40deg\)/.test(css),
    "und sie sind um 40 Grad gedreht, zeigen also in ihre Flugrichtung");

  /* „das lecken … zeigt noch zu viel Kontrastkante." */
  sage(/\.lc-leck-nass\s*\{[^}]*aspect-ratio: 1/.test(css),
    "der Glanzfilm sitzt auf dem runden Bild, nicht auf dem ganzen Knopf");
  sage(/\.lc-leck-nass\s*\{[^}]*mask-image: radial-gradient/.test(css),
    "und er laeuft zum Rand hin weich aus");

  /* „Der Wecker … koennte er links und rechts unten so schraeg diese
     kleinen Stand Fuesse noch haben." */
  sage(/lc-wecker-fuss/.test(app) && /lcFussWipptL/.test(css),
    "der Wecker hat zwei schraege Standfuesse");

  /* „Die Eierschalen … haben am anderen Ende nicht diese Verjuengung." */
  sage(/M24 1 C14 0 5 6 2 15/.test(app),
    "die Eierschale laeuft aussen rund und spitz zu");

  /* „der Katapult ist immer noch nicht gross genug." */
  const kat = /\.lc-katapult-bild\s*\{[^}]*width:\s*(\d+)%/.exec(css);
  sage(kat && Number(kat[1]) >= 120,
    "der Katapult ist " + (kat ? kat[1] : "?") + " % der Bildbreite breit (vorher 78 %)");

  /* „beim Strohhalm, der die Blasen macht, der ist immer noch nicht im
     Glas." Sein Fuss muss INNERHALB des Bildes liegen, also right > 0. */
  const halm = /\.lc-blubber-rohr\s*\{[^}]*right:\s*(-?\d+)%/.exec(css);
  sage(halm && Number(halm[1]) > 0,
    "der Blubber-Halm steckt im Glas (right: " + (halm ? halm[1] : "?") + " %)");

  /* „Der Name von der King Kong Hand kann einfach nur King Kong
     heissen … Dann sag lieber Gott und King Kong." */
  sage(/"Gott", "gotteshand"/.test(app) && /"King Kong", "pranke"/.test(app),
    "die Handkacheln heissen Gott und King Kong");

  /* --- Die Bombe, die Granate und das Pferd ------------------------ */
  console.log("\nBombe, Granate, Pferd");

  /* „der Zeitzuender der Bombe soll bei der digitalen Uhr eigentlich
     auch eine digitale Anzeige sein, die runterlaeuft." */
  sage(/lc-bombe-anzeige/.test(app) && /lc-bombe-zehntel/.test(app),
    "die digitale Bombe hat eine Anzeige, die in Zehntelsekunden laeuft");
  sage(/for \(let t = 1; t <= 30; t\+\+\)/.test(app),
    "und sie zaehlt dreissig Zehntel herunter, nicht drei Ziffern");

  /* „Bei der analogen Bombe sind zwei Lunten da." */
  sage(/\(lunte \? "" : '<span class="lc-bombe-schnur">/.test(app),
    "die analoge Bombe hat nur noch EINE Zuendschnur");

  /* „und am Ende hat man auch kein Aschehaeufchen." Gemessen war das
     Haeufchen da, nur zu blass: 150|142|130 auf einem Grund von
     246|241|231. Jetzt dunkler und groesser. */
  sage(/\.lc-asche-punkt \{[\s\S]{0,240}?background: rgba\(104, 97, 86/.test(css)
    && /\.lc-bombe-asche::before/.test(css),
    "das Aschehaeufchen hebt sich vom hellen Grund ab");

  /* „es soll hier auch nicht Buehne legen stehen, sondern Bombe legen." */
  sage(/"Bombe legen", "bombe", "alle"/.test(app) && !/B\\u00fchne leeren/.test(app),
    "die Kachel heisst „Bombe legen\u201c");
  sage(/\["\\ud83e\\uddaf", "Granate",     "granate"\]\]\],/.test(app),
    "die Granate steht im Bomben-Untermenue");

  /* „Das Pferd hat immer noch hinten diese Wulst … die Beine sind so
     komisch gefaltet wie so eine Ziehharmonika … achte auf den Arsch,
     dass die Beine am Arsch sind."
     Gemessen wird am Pfad: das Hinterbein setzt hinter x = 56 an
     (das Hinterteil endet bei x = 45), und das VORDERBEIN weicht auf
     seiner ganzen Laenge um hoechstens zwei Einheiten von der
     Senkrechten ab — es ist also kein Zickzack mehr. */
  /* RUNDE 80, ZWEITER ANLAUF — er hat es noch einmal gemeldet, und er
     hatte recht: das Bein war EIN Strich von gleichbleibender Dicke,
     der dreimal scharf umklappte. Jetzt kommt es aus einer gefuellten
     Muskelpartie (lc-pferd-hand / lc-pferd-schulter) und schwingt in
     weichen Bogen (Q) statt zu knicken. Gemessen wird deshalb:
     · Die Hinterhand sitzt am Hinterteil (der Rumpf endet bei x = 45).
     · Beide Beine sind Bogen, keine Knicklinien — kein „L" mehr darin.
     · Und ihr seitlicher Ausschlag bleibt klein. */
  sage(/class="lc-pferd-hand" d="M(\d+) /.test(app) && Number(RegExp.$1) <= 50,
    "die Hinterhand sitzt am Hinterteil (x = " + RegExp.$1 + ", Kruppe bei 45)");
  const beine = [...app.matchAll(/lc-pferd-b\d" d="([^"]+)"/g)].map((m) => m[1]);
  sage(beine.length === 4 && beine.every((d) => !/ L/.test(d) && /Q/.test(d)),
    "alle vier Beine schwingen in Bogen statt zu knicken",
    beine.length + " Beine geprueft");
  const ausschlaege = beine.map((d) => {
    const xs = (d.match(/[MQ]?\s*([\d.]+) [\d.]+/g) || [])
      .map((t) => Number((t.match(/([\d.]+) [\d.]+/) || [])[1]));
    return xs.length ? Math.max(...xs) - Math.min(...xs) : 99;
  });
  sage(Math.max(...ausschlaege) <= 8,
    "und ihr seitlicher Ausschlag bleibt klein",
    "groesster Ausschlag " + Math.max(...ausschlaege).toFixed(1) + " Einheiten");

  /* =================================================================
     3. DER BROWSER — Bahnen und Sitzplatz-Auszeichnung
     ================================================================= */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 820 }, deviceScaleFactor: 2 });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nBahnen");

  /* „der Tritt beim Fussball. Wenn der Ball zurueckkommt, dann faellt
     er einmal bei einem anderen Platz irgendwie, als wenn er da
     stoppt." Also: der Ball darf auf seiner ganzen Bahn nirgends
     stehen bleiben. Gemessen wird der Weg je 50 ms. */
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("tritt", "2"));
  await new Promise((f) => setTimeout(f, 140));
  const bahn = await pg.evaluate(() => {
    const k = document.querySelectorAll(".lc-platz")[1].querySelector(".lc-kreis");
    const an = k.getAnimations()[0];
    if (!an) return null;
    an.pause();
    const aus = [];
    for (let ms = 0; ms <= 1600; ms += 50) {
      an.currentTime = ms;
      const m = new DOMMatrix(getComputedStyle(k).transform);
      aus.push([m.e, m.f]);
    }
    return aus;
  });
  if (!bahn) { sage(false, "die Ballbahn liess sich nicht messen"); }
  else {
    let kleinster = 1e9;
    for (let i = 1; i < bahn.length - 4; i++) {
      kleinster = Math.min(kleinster,
        Math.hypot(bahn[i][0] - bahn[i-1][0], bahn[i][1] - bahn[i-1][1]));
    }
    sage(kleinster >= 4,
      "der Ball bleibt nirgends stehen: kleinster Schritt je 50 ms " + kleinster.toFixed(1) + " px");
  }
  await new Promise((f) => setTimeout(f, 1800));

  /* „wenn ich jemanden mit Wasser voll laufen lasse mit dem Eimer,
     dann ist vorher unten im Profilbild schon eine kleine Pfuetze zu
     sehen." Vor 700 ms darf im unteren Bildviertel nichts Blaues
     stehen. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("eimer", "2"));
  await new Promise((f) => setTimeout(f, 320));
  const pfuetze = await pg.evaluate(() => {
    const st = document.querySelector(".lc-wasserstand");
    if (!st) return { da: false };
    const cs = getComputedStyle(st);
    return { da: true, hoehe: st.getBoundingClientRect().height, deck: +cs.opacity };
  });
  sage(pfuetze.da && pfuetze.deck < 0.05,
    "vor dem Giessen ist kein Wasser zu sehen (Deckkraft " + (pfuetze.deck ?? "?") + ")");
  await new Promise((f) => setTimeout(f, 6200));

  /* --- Die Sprechbilder ------------------------------------------- */
  console.log("\nSprechbilder");

  /* „Die Noten sind immer noch nicht am Pfad des Rahmens orientiert."
     Gemessen wird der Drehwinkel jeder Note gegen ihre Lage auf dem
     Kreis: er muss der Tangente entsprechen. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const notenLage = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    pl.classList.add("lc-platz-spricht");
    pl.setAttribute("data-sprechbild", "noten");
    window.DMA_PRUEFUNG.sprechFeld(pl, "noten");
    const feld = pl.querySelector(".lc-sprechfeld");
    if (!feld) return null;
    const fr = feld.getBoundingClientRect();
    const mx = fr.left + fr.width / 2, my = fr.top + fr.height / 2;
    return [...feld.querySelectorAll(".lc-teilchen")].map((t) => {
      const r = t.getBoundingClientRect();
      const dx = (r.left + r.width / 2) - mx, dy = (r.top + r.height / 2) - my;
      const lage = Math.atan2(dy, dx) * 180 / Math.PI;
      const m = new DOMMatrix(getComputedStyle(t).transform);
      const dreh = Math.atan2(m.b, m.a) * 180 / Math.PI;
      /* Erwartet: Tangente = Lage + 90, gegebenenfalls um 180 gewendet. */
      let ab = ((dreh - (lage + 90)) % 360 + 360) % 360;
      if (ab > 180) ab = 360 - ab;
      if (ab > 90) ab = 180 - ab;
      return { ab: +ab.toFixed(1), abstand: +Math.hypot(dx, dy).toFixed(1) };
    });
  });
  if (!notenLage || !notenLage.length) sage(false, "die Noten liessen sich nicht messen");
  else {
    const schief = notenLage.filter((n) => n.ab > 4).length;
    sage(schief === 0,
      "jede Note steht auf dem Pfad des Rahmens (" + schief + " von "
      + notenLage.length + " weichen um mehr als 4 Grad ab)");
    const rad = notenLage.map((n) => n.abstand);
    const spanne = Math.max(...rad) - Math.min(...rad);
    sage(spanne < 14,
      "und alle sitzen auf demselben Ring (Spanne " + spanne.toFixed(1) + " px)");
  }

  /* „bei den Herzen … sollten kleiner sein und am kreisrunden Rahmen." */
  const herzLage = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    pl.querySelectorAll(".lc-sprechfeld").forEach((x) => x.remove());
    pl.setAttribute("data-sprechbild", "herzen");
    window.DMA_PRUEFUNG.sprechFeld(pl, "herzen");
    const feld = pl.querySelector(".lc-sprechfeld");
    if (!feld) return null;
    const fr = feld.getBoundingClientRect();
    const mx = fr.left + fr.width / 2, my = fr.top + fr.height / 2;
    const t = [...feld.querySelectorAll(".lc-teilchen")];
    const rad = t.map((e) => {
      const r = e.getBoundingClientRect();
      return Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
    });
    return { spanne: Math.max(...rad) - Math.min(...rad), anzahl: t.length };
  });
  sage(herzLage && herzLage.spanne < 14,
    "die Herzen sitzen auf dem Ring (Spanne "
    + (herzLage ? herzLage.spanne.toFixed(1) : "?") + " px)");

  /* „Die Schallwellen haben immer noch diese grosse Luecke … sollen
     nicht wie ein Impuls gesendet werden." */
  sage(/@keyframes lcSfWelleR80/.test(css)
    && /0 0 0 13px rgba\(120, 220, 255, \.42\)/.test(css),
    "die Schallwellen laufen ohne Luecke (vier Ringe, die einander nachruecken)");

  /* „Allerdings durchwandert es die Farben nicht." */
  sage(/hue-rotate\(360deg\)/.test(css) && /lcSfRegenbogenR77 6\.4s linear/.test(css),
    "der Regenbogen wandert einmal ganz durch die Farben");

  /* „der gruene Ring … koennte auch ein bisschen mehr Weichheit haben
     … dem Benutzer ne Moeglichkeit geben, ne eigene Farbe auszuwaehlen." */
  sage(/:root \{ --sprechton: 90, 168, 107; \}/.test(css)
    && !/border: 2px solid rgba\(90, 168, 107, \.75\)/.test(css),
    "der Sprechring hat keinen harten Rand mehr und nimmt --sprechton");
  const farben = await pg.evaluate(() => {
    document.getElementById("lcPlatzMenue")?.remove();
    window.DMA_PRUEFUNG.sprechbildMenue(document.querySelectorAll(".lc-platz")[0]);
    const k = document.getElementById("lcPlatzMenue");
    if (!k) return null;
    const reihe = k.querySelector(".lc-sprechfarben");
    const p = [...k.querySelectorAll(".lc-sprechfarbe")].map((x) => x.getBoundingClientRect());
    const zeilen = new Set(p.map((r) => Math.round(r.top))).size;
    return { anzahl: p.length, zeilen: zeilen, reihe: Boolean(reihe) };
  });
  sage(farben && farben.anzahl >= 8,
    "unter den Kacheln stehen " + (farben ? farben.anzahl : 0) + " Farben zur Wahl");
  sage(farben && farben.zeilen <= 2,
    "und sie stehen nebeneinander, nicht untereinander ("
    + (farben ? farben.zeilen : "?") + " Zeile(n))");
  await pg.evaluate(() => document.getElementById("lcPlatzMenue")?.remove());

  console.log("\nSitzplatz bleibt unberuehrt");

  /* „Die Zahl blendet weg, und dann taucht sie zuerst wieder auf, das
     soll niemals beruehrt sein, wenn ich es nicht ausdruecklich sage."
     Gemessen wird waehrend jeder Wirkung: Schild und Nummer muessen
     genau so gross bleiben wie in Ruhe. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const ruhe = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    return [Math.round(pl.querySelector(".lc-schild").getBoundingClientRect().width),
            Math.round(pl.querySelector(".lc-nummer").getBoundingClientRect().width)];
  });
  for (const art of ["sog", "knuelle", "flugzeug", "tennis", "wecker", "gong", "bongo", "zucker"]) {
    await pg.evaluate((a) => {
      document.querySelectorAll(".lc-platz")[1].querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(a, "2", "Dana");
    }, art);
    await new Promise((f) => setTimeout(f, 900));
    const jetzt = await pg.evaluate(() => {
      const pl = document.querySelectorAll(".lc-platz")[1];
      return [Math.round(pl.querySelector(".lc-schild").getBoundingClientRect().width),
              Math.round(pl.querySelector(".lc-nummer").getBoundingClientRect().width)];
    });
    sage(jetzt[0] === ruhe[0] && jetzt[1] === ruhe[1],
      art + ": Schild " + jetzt[0] + "/" + ruhe[0] + " px, Nummer " + jetzt[1] + "/" + ruhe[1] + " px");
    await new Promise((f) => setTimeout(f, 3800));
  }

  console.log("\nReisen lassen nichts zurueck");

  /* „immer wenn man landet, ist das Profilbild kurz noch mal auf der
     Seite zu sehen, von der aus man startet. Das ist sehr oft bei den
     Animationen der Fall. Bei der Lok ist dasselbe Problem."
     Gemessen wird die Deckkraft des Kreises am STARTPLATZ, waehrend
     die Reise laeuft. Sie darf in der zweiten Haelfte nicht wieder
     steigen. */
  for (const art of ["boot", "lok", "flug", "feder", "kran", "beamen", "heli"]) {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    const gibt = await pg.evaluate((a) => {
      window.DMA_PRUEFUNG.wirkung(a, "7", "Alex");
      return true;
    }, art);
    /* Gezaehlt wird nur, SOLANGE die Reise laeuft — der Startplatz
       traegt dann die Klasse „lc-platz-unterwegs". Danach zeichnet im
       echten Raum die Sitzreihe neu; in der Pruefbuehne gibt es diesen
       Schritt nicht, dort stuende das Bild sonst zu Recht wieder da
       und die Messung waere wertlos. */
    let wieder = 0, gesehen = false, proben = 0;
    for (let t = 0; t < 26; t++) {
      await new Promise((f) => setTimeout(f, 110));
      const m = await pg.evaluate(() => {
        const pl = document.querySelectorAll(".lc-platz")[0];
        const k = pl.querySelector(".lc-kreis");
        return { op: k ? +getComputedStyle(k).opacity : 1,
                 laeuft: pl.classList.contains("lc-platz-unterwegs") };
      });
      if (!m.laeuft) { if (gesehen) break; else continue; }
      proben++;
      if (m.op < 0.2) gesehen = true;
      else if (gesehen) wieder++;
    }
    sage(gibt && gesehen && wieder === 0,
      art + ": das Bild am Startplatz bleibt weg (" + wieder + " von " + proben
      + " Proben waehrend der Reise wieder sichtbar)");
    /* Warten, bis die Reise wirklich zu Ende ist — die laengste
       (Turm/UFO) braucht gut vier Sekunden. Eine Reise, die noch
       laeuft, waehrend die naechste beginnt, macht die Messung
       wertlos. */
    await new Promise((f) => setTimeout(f, 4600));
  }

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
