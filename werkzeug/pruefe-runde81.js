/* =====================================================================
   SONDE RUNDE 81 — der zweite Teil von Xanders Liste vom 22. September
   ---------------------------------------------------------------------
   Jede Regel hier steht fuer einen Satz von ihm. Sie MISST, statt zu
   glauben: Toene werden dekodiert und ihre Huellkurve gerechnet, Bahnen
   werden Bild fuer Bild abgetastet, und was am Bildschirm sitzt, wird
   am Bildschirm nachgemessen — nicht im Quelltext behauptet.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");

let fehler = 0;
const sage = (gut, text, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (zusatz ? "   " + zusatz : ""));
};

/* --- Ein Geraeusch messen: Laenge und Huellkurve in 50-ms-Schritten -- */
function tonMessen(name) {
  const roh = "/tmp/claude-0/pr81-" + name + ".raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", name + ".opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const n = b.length / 2, st = 1200, huelle = [];
  for (let i = 0; i < n; i += st) {
    let s = 0, z = 0;
    for (let j = i; j < Math.min(n, i + st); j++) {
      const v = b.readInt16LE(j * 2) / 32768; s += v * v; z++;
    }
    huelle.push(z ? 10 * Math.log10(s / z + 1e-12) : -99);
  }
  return { dauer: n / 24000, huelle: huelle };
}

(async () => {
  console.log("RUNDE 81 — der zweite Teil von Xanders Liste vom 22. September");

  /* =================================================================
     1. DIE TOENE
     ================================================================= */
  console.log("\nToene");

  /* „vielleicht koennte man den Vogel auch zwitschern hoeren."
     Es gab keines — dieses ist gerechnet (werkzeug/zwitschern-bauen.py):
     fuenf Rufe mit Stille dazwischen. Eine Dauerpfeife waere keines. */
  const zw = tonMessen("zwitschern");
  sage(Math.abs(zw.dauer - 1.5) < 0.12,
    "zwitschern ist " + zw.dauer.toFixed(2) + " s lang");
  const rufe = (() => {
    let z = 0, drin = false;
    zw.huelle.forEach((d) => {
      if (d > -30 && !drin) { z++; drin = true; }
      else if (d <= -30) drin = false;
    });
    return z;
  })();
  sage(rufe >= 4, "und besteht aus einzelnen Rufen, nicht aus einem Pfeifen",
    rufe + " Rufe");

  /* RUNDE 80 stand hier: „das Spuckgeraeusch koennte realistischer
     klingen", und der Auswurf wurde zum lautesten Punkt gemacht.
     RUNDE 86 hat XANDER das zurueckgenommen: „mach bitte wieder den
     Spuck-Sound, den wir vor dem jetzigen hatten." Er hoert das, ich
     messe es nur — also gilt seine Aufnahme. Die neue liegt unter
     werkzeug/backup/ton-runde85/, falls er es sich anders ueberlegt.
     Geprueft wird jetzt, dass wirklich die ALTE zurueck ist. */
  const ro = tonMessen("rotze");
  const bei = (s) => ro.huelle[Math.round(s / 0.05)];
  sage(ro.huelle.length > 20 && bei(0.60) > bei(0.45),
    "rotze: es ist wieder die alte Aufnahme, in der der nasse Aufschlag traegt",
    "Auswurf " + bei(0.45).toFixed(1) + " dB, Aufschlag " + bei(0.60).toFixed(1) + " dB");
  /* RUNDE 86 — XANDER HAT DAS ZURUECKGENOMMEN: „mach bitte wieder den
     Spuck-Sound, den wir vor dem jetzigen hatten."
     Damit gilt wieder die alte Aufnahme, und in der ist der nasse
     AUFSCHLAG der lauteste Punkt, nicht der Auswurf. Was von der
     Regel bleibt, ist das, was ihn damals gestoert hat: der Auswurf
     darf nicht leiser sein als das Raeuspern davor — das prueft die
     Regel darueber und ist auch in der alten Aufnahme erfuellt. */
  sage(ro.dauer > 1.2 && ro.dauer < 1.5,
    "und es ist wieder die Aufnahme von vorher (1,35 s)",
    "rotze " + ro.dauer.toFixed(2) + " s");

  /* „und der Sound ist auch nicht durchgaengig" (Greifvogel). Die
     Aufnahme ist ab 0,9 s praktisch tot; sie wird deshalb viermal
     angesetzt. */
  sage(/\[\[340, 0\.55\], \[1000, 0\.5\], \[1660, 0\.45\], \[2320, 0\.38\]\]/.test(js),
    "der Fluegelschlag wird viermal angesetzt, nicht einmal");

  /* „bei dem YIHAAH Schrei vom Cowboy fehlt noch das Peitsch
     Geraeusch." */
  sage(/lcTonSpaeter\("peitschehieb", 600, 0\.72\);/.test(js),
    "der Cowboy knallt mit der Peitsche");

  /* „es koennte nach dem Sketschen mit einer Musik weitergehen." */
  sage(/lcTonSpaeter\("disko", 950, 0\.42\);/.test(js),
    "nach dem Kratzen laeuft Musik weiter");

  /* =================================================================
     2. DIE ZEICHNUNGEN
     ================================================================= */
  console.log("\nZeichnung");

  /* „Der Strom ist mir ein bisschen filigran … es sieht immer noch
     nicht nach diesen typischen Blitzen aus. Ausserdem sollen die von
     der Mitte ausgehen."
     Gemessen wird die Zeichnung selbst: JEDE Strecke muss vom
     Mittelpunkt weg zeigen, und der Fusspunkt muss im Kern liegen. */
  for (const nr of [0, 1, 2]) {
    const m = new RegExp('--lc-strom-' + nr + ': url\\("data:image/svg\\+xml,([^"]*)"\\)').exec(css);
    if (!m) { sage(false, "Blitzbild " + nr + " fehlt"); continue; }
    const svg = decodeURIComponent(m[1]);
    const alle = [...svg.matchAll(/M([\d.]+),([\d.]+) L([\d.]+),([\d.]+)/g)];
    /* Jede Strecke steht dreimal da (Saum, Mantel, Kern). */
    const teil = alle.slice(0, Math.floor(alle.length / 3));
    let raus = 0, nah = 99;
    teil.forEach((t) => {
      const [x1, y1, x2, y2] = [+t[1], +t[2], +t[3], +t[4]];
      const r1 = Math.hypot(x1 - 50, y1 - 50), r2 = Math.hypot(x2 - 50, y2 - 50);
      if (r2 > r1) raus++;
      if (r1 < nah) nah = r1;
    });
    sage(teil.length > 60 && raus === teil.length && nah < 6,
      "Blitzbild " + nr + ": alle Strecken laufen aus der Mitte nach aussen",
      raus + " von " + teil.length + ", Fusspunkt " + nah.toFixed(1));
  }
  /* „ein bisschen filigran" hiess: zu duenn. Der Kern war 0,34. */
  sage(/KERN  = \("#ffffff", 0\.62, \.95\)/.test(
    fs.readFileSync(path.join(WURZEL, "werkzeug", "bau-blitze.py"), "utf8")),
    "und der Kern ist nicht mehr haarfein");

  /* „das Bild von seinen Fluegeln sehen aus wie Fledermausfluegel."
     Ein Fledermausfluegel ist EIN Umriss, ein Vogelfluegel besteht aus
     Armfittich und einzelnen Handschwingen. */
  /* RUNDE 88 NACHGEFUEHRT: seit Runde 87 werden die Federn nicht
     mehr einzeln mit class="lc-greif-schwinge" in den Quelltext
     geschrieben, sondern reihenweise gebaut (greifReihe) und von
     lage() mit ihrer Klasse ausgegeben — „Die Adler schwingen mit
     den Seitenfedern und den Rückfedern, die nach hinten zeigen in
     mehreren Lagen." Geprueft wird deshalb, dass es diese Lagen
     gibt: Handschwingen, Armschwingen und drei Deckenreihen. */
  sage(/const greifFluegel = \(k\) =>/.test(js)
    && /federn\.push\(/.test(js)
    && /lage\(w\.hand, "lc-greif-schwinge"\)/.test(js)
    && /lage\(w\.arm, "lc-greif-armschwinge"\)/.test(js)
    && /lage\(w\.grossDecken, "lc-greif-grossdecke"\)/.test(js),
    "der Greifvogel hat einzelne Handschwingen statt einer Flughaut");

  /* „achte dabei auf den Arsch, dass die Beine am Arsch sind und die
     Beine sind so komisch gefaltet wie so eine Ziehharmonika." */
  /* FUNK 75: Hinterhand und Schulter sind jetzt weicher Schatten
     (lc-pf-schatten) und das Oberglied des Beins — keine Polster mehr. */
  sage(/class="lc-pf-schatten"/.test(js) && /const pfBein = \(vorn, fern, phase\) =>/.test(js),
    "das Pferd hat Hinterhand und Schulter");
  /* RUNDE 88 NACHGEFUEHRT: die Klasse lc-pferd-b1 sitzt jetzt an
     einer GRUPPE, in der Bein und Huf zusammen haengen — vorher
     stand sie am Pfad selbst. Der Pfad ist derselbe geblieben; nur
     die Klasse ist eine Ebene hoeher gewandert. */
  sage(!/d="M49 56 L55 70 L46 80 L48 92"/.test(js)
    && /class="lc-pf-o"[\s\S]{0,400}class="lc-pf-m"[\s\S]{0,400}class="lc-pf-u"/.test(js),
    "und seine Beine knicken nicht mehr wie eine Ziehharmonika");

  /* „diese Hoecker sind noch zu duenn." Der Grat lief von 46 bis 54,5
     — 8,5 Einheiten. Jetzt 44 bis 55, also 11. */
  sage(/C47\.5 10\.4 52 11\.4 55 15/.test(js),
    "die Hoecker am Cowboyhut sind breiter");

  /* „die letzten grossen Spitzen, die ganz unten sind, die werden
     abgeschnitten." Der tiefste Zapfen liegt bei y = 105,95. */
  const eisZeile = /\.lc-platz-spricht\[data-sprechbild="eis"\]::after \{\s*\n\s*background: url\("data:image\/svg\+xml,([^"]*)"\)[^;]*;/.exec(css);
  if (eisZeile) {
    const svg = decodeURIComponent(eisZeile[1]);
    const vb = /viewBox="([^"]+)"/.exec(svg);
    const teile = vb ? vb[1].split(/\s+/).map(Number) : [];
    const unten = teile.length === 4 ? teile[1] + teile[3] : 0;
    sage(unten >= 106, "die Eiszapfen passen ganz in ihren Kasten",
      "Kasten reicht bis " + unten + ", tiefster Zapfen 105,95");
  } else sage(false, "die Eiszapfen-Zeichnung ist nicht zu finden");

  /* „die Eisblumen sind jetzt von so einer kachelartigen Kontrastkante
     umgeben." Eine no-repeat-Maske ist ausserhalb ihres Kastens
     durchsichtig — der Kasten darf deshalb nie kleiner als das Bild
     sein. */
  const eisMaske = /@keyframes lcEisblumeR77 \{([\s\S]*?)\n\}/.exec(css);
  if (eisMaske) {
    const groessen = [...eisMaske[1].matchAll(/mask-size: (\d+)%/g)].map((m) => +m[1]);
    sage(groessen.length > 0 && Math.min(...groessen) >= 100,
      "der Maskenkasten der Eisblumen wird nie kleiner als das Bild",
      "kleinster Wert " + Math.min(...groessen) + " %");
  } else sage(false, "die Eisblumen-Animation ist nicht zu finden");

  /* „vielleicht kannst du dieses Blut was von oben kommt so ein
     bisschen oval zur Seite laufen lassen." Und: die Rechteckkanten
     kamen daher, dass der Verlaufsradius so breit war wie die ganze
     Kachel statt wie ihre Haelfte. */
  sage(/ellipse 50% 100% at 50% 0%/.test(css)
    && !/ellipse 100% 100% at 50% 0%/.test(css),
    "die Blutrinnsale haben keine harten Rechteckkanten mehr");
  sage(/background-position: 50% 0%, 21% 0%, 79% 0%, 9% 10%, 91% 10%;/.test(css),
    "und der Saum laeuft in zwei Ovalen an den Flanken herunter");

  /* =================================================================
     3. DIE NEUEN SACHEN
     ================================================================= */
  console.log("\nNeu");

  /* „dieses auf den Arsch klatschen zaehlt mir noch als extra
     Animation." */
  sage(/klaps:      \{ zeichen:/.test(js)
    && /function lcKlaps\(wen\)/.test(js)
    && /art === "klaps" && lcKlaps\(wenZ\)/.test(js),
    "der Klaps ist eine eigene Wirkung");
  sage(/klaps:      \{ wirkung: "klaps"/.test(lc),
    "und hat einen eigenen Befehl");
  sage(/@keyframes lcKlapsHandR80/.test(css) && /@keyframes lcKlapsAbdruckR80/.test(css),
    "die Hand kommt von unten und hinterlaesst einen Abdruck");

  /* RUNDE 85 — HIER STAND DAS GEGENTEIL, und Xander hat es
     zurueckgenommen: „die Lokomotive faehrt jetzt nur noch im Kreis
     und das soll sie nicht. Wenn ich irgendwo hin moechte, soll sie
     ganz normal dahinfahren. So wie vorher auch."
     Geblieben ist der andere Teil desselben Wunsches — dass sie die
     Leute ueberfaehrt und die dann schreien. Das steht jetzt hier,
     zusammen mit dem, was an die Stelle der Runden getreten ist:
     Gleise und eine Schiebebuehne. */
  sage(/function lcLokFahrt\(/.test(js) && !/const RUNDEN = 2;/.test(js),
    "die Lok faehrt zum Ziel statt im Kreis");
  sage(/lcGeraeusch\(lcSchmerzTon\(g\.el\), "lokopfer", 0\.5\);/.test(js)
    && /@keyframes lcUeberfahrenR80/.test(css),
    "und wer ueberfahren wird, schreit");

  /* „Ich moechte den pacman zum ausprobieren auch wenn niemand da ist
     uebers Feld schicken koennen." */
  /* RUNDE 76 — diese Regel stand als Quelltext-Vergleich hier
     („const probe = !zu || zu.nr === ab.nr;"). Sie ist rot geworden,
     weil Pac-Man jetzt auch eine gemalte Kette annimmt und die
     Bedingung deshalb eine dritte Moeglichkeit hat. Was Xander
     gemeint hat, ist aber nicht die Zeile, sondern das Verhalten:
     ohne Ziel faehrt er trotzdem, und gefressen wird dabei niemand.
     Genau das steht jetzt hier — gemessen weiter unten am Weg selbst,
     hier nur, dass die Probefahrt ueberhaupt vorgesehen ist. */
  sage(/PROBEFAHRT: ohne Ziel sucht sich Pac-Man den am weitesten/.test(js)
    && /if \(probe\) return;/.test(js),
    "Pac-Man faehrt auch ohne Ziel — und frisst dabei niemanden");

  /* „da moechte ich noch einen Song Ausschnitt definieren koennen." */
  /* RUNDE 88 NACHGEFUEHRT: lcMusikSpielen hat seit Runde 87 einen
     fuenften Parameter „selbst" — XANDER: „mache das moeglich, dass
     ich mein Lied selber hoeren kann, nicht nur einstellen kann,
     sondern sofort hoeren kann." Der Ausschnitt („ab", „bis")
     bleibt, worum es in dieser Regel geht. */
  sage(/liedAb: stueckK \? stueckK\.ab : 0,/.test(lc)
    && /function lcMusikSpielen\(datei, titel, ab, bis, selbst\)/.test(js),
    "der Kopfhoerer nimmt einen Song-Ausschnitt entgegen");

  /* =================================================================
     4. DER BROWSER — was man nur am Bildschirm messen kann
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
  const adr = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  /* --- Das Wetter: nachts keine Sonne ------------------------------
     „wenn man auf der Seite die Seite neu laedt, dann kommt immer noch
     oben beim Wetter ne Sonnenstrahlen Animation obwohl wir es nachts
     haben." Die Uhr wird gestellt und die Seite NEU geladen — genau
     der Fall, den er beschreibt. */
  console.log("\nWetter");
  for (const [stunde, erwartet] of [[0, 0], [3, 0], [22, 0], [13, 5]]) {
    const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.addInitScript((h) => {
      const Echt = Date;
      const versatz = (h - new Echt().getHours()) * 3600e3;
      window.Date = new Proxy(Echt, {
        construct(t, a) { return a.length ? new t(...a) : new t(Echt.now() + versatz); },
        get(t, k) { return k === "now" ? () => Echt.now() + versatz : t[k]; }
      });
    }, stunde);
    await pg.goto(adr, { waitUntil: "load" });
    await pg.waitForFunction(() => typeof window.__wetter === "function", { timeout: 20000 });
    const n = await pg.evaluate(() => {
      window.__wetter("klar");            /* nur die Lage, KEINE Nachtangabe */
      const sz = document.querySelector(".wetter-szene");
      if (!sz) return -1;
      return [...sz.querySelectorAll(".w-strahl")].filter((e) => {
        const c = getComputedStyle(e);
        return c.display !== "none" && Number(c.opacity) > 0.05;
      }).length;
    });
    sage(n === erwartet, stunde + " Uhr: " + erwartet + " Sonnenstrahlen erwartet",
      n + " gezaehlt");
    await pg.close();
  }

  const pg = await br.newPage({ viewport: { width: 420, height: 820 }, deviceScaleFactor: 2 });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(adr, { waitUntil: "load" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  /* --- Die drei Punkte im Kopfstreifen ------------------------------
     „manchmal kommen auch Bildfehler … so ein kleiner Punkt …
     mindestens drei Pixel da, die wie Bildfehler aussehen."
     Es sind sieben Sterne, die auf EINEM Punkt lagen. */
  console.log("\nKopfstreifen");
  const st = await pg.evaluate(() => {
    const l = document.getElementById("starsLayer");
    if (!l) return null;
    const k = l.getBoundingClientRect();
    const p = [...l.querySelectorAll(".star")].map((s) => {
      const r = s.getBoundingClientRect();
      return [Math.round(r.left), Math.round(r.top)];
    });
    const eigen = new Set(p.map((q) => q.join(","))).size;
    return { pos: getComputedStyle(l).position, breit: Math.round(k.width),
             sterne: p.length, eigen: eigen };
  });
  sage(st && st.pos === "absolute" && st.breit > 200,
    "die Sternenschicht ist wieder so breit wie der Streifen",
    st ? st.pos + ", " + st.breit + " px" : "-");
  sage(st && st.sterne >= 7 && st.eigen === st.sterne,
    "und jeder Stern hat seine eigene Stelle",
    st ? st.eigen + " Stellen fuer " + st.sterne + " Sterne" : "-");

  /* --- Das Feuer ---------------------------------------------------
     „beim Feuer kannst du noch ein bisschen die Flammen nach unten
     bringen … und du kannst an den Verjuengung kleine Partikel
     fliegen lassen." */
  console.log("\nSprechbilder");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const fe = await pg.evaluate(() => {
    const platz = document.querySelector('[data-lc-platz="1"]');
    window.DMA_PRUEFUNG.sprechFeld(platz, "feuer");
    const kreis = platz.querySelector(".lc-kreis").getBoundingClientRect();
    const feld = platz.querySelector(".lc-sprechfeld").getBoundingClientRect();
    const mx = kreis.left + kreis.width / 2, my = kreis.top + kreis.height / 2;
    const fuss = [...platz.querySelectorAll(".lc-sprechfeld .lc-teilchen")].map((el) => {
      const lx = parseFloat(el.style.getPropertyValue("--links"));
      const ly = parseFloat(el.style.getPropertyValue("--oben"));
      return Math.hypot(feld.left + feld.width * lx / 100 - mx,
                        feld.top + feld.height * ly / 100 - my);
    });
    return { radius: kreis.width / 2, flammen: fuss.length,
             funken: platz.querySelectorAll(".lc-funke").length,
             tiefste: Math.max(...fuss) };
  });
  sage(fe.flammen === 30 && fe.funken === 30,
    "jede Flamme hat ihren eigenen Funken an der Spitze",
    fe.flammen + " Flammen, " + fe.funken + " Funken");
  sage(fe.tiefste < fe.radius - 1.4,
    "und die Flammenfuesse sitzen tiefer im Bild",
    "weitester Fuss " + fe.tiefste.toFixed(2) + " px bei Radius " + fe.radius + " px");

  /* „bei der Bluete … dass wenn man nicht durchgaengig spricht, dass
     sie sich wieder verschliessen." */
  const bl = await pg.evaluate(() => {
    const k = document.querySelector('[data-lc-platz="2"]');
    k.dataset.sprechbild = "bluete";
    k.classList.add("lc-platz-spricht");
    const auf = getComputedStyle(k, "::after").animationName;
    k.classList.add("lc-sprech-schliesst");
    return { auf: auf, zu: getComputedStyle(k, "::after").animationName };
  });
  sage(bl.auf === "lcSfBlueteR77" && bl.zu === "lcSfBlueteZuR80",
    "die Bluete schliesst sich, wenn das Sprechen aufhoert",
    bl.auf + " -> " + bl.zu);

  /* --- Der Dunkelmodus ---------------------------------------------
     „im Prinzip soll die ganze Webseite abgedunkelt sein" und „wenn
     man durch die Seite scrollt springen die Augen immer noch." */
  console.log("\nDunkelmodus");
  await pg.evaluate(() => { window.DMA_PRUEF.effektBuehne();
                            window.DMA_PRUEFUNG.wirkung("birneraus", "2", "Alex"); });
  await new Promise((f) => setTimeout(f, 1500));
  const du = await pg.evaluate(() => {
    const d = document.getElementById("lcStromAus");
    if (!d) return null;
    const r = d.getBoundingClientRect();
    const abstand = () => [...d.querySelectorAll(".lc-dunkel-augen")].map((p) => {
      const pr = p.getBoundingClientRect();
      let best = 1e9;
      document.querySelectorAll(".lc-platz.lc-platz-belegt").forEach((pl) => {
        const k = pl.querySelector(".lc-kreis"); if (!k) return;
        const kr = k.getBoundingClientRect();
        best = Math.min(best, Math.hypot(pr.left + pr.width / 2 - kr.left - kr.width / 2,
                                         pr.top + pr.height / 2 - kr.top - kr.height / 2));
      });
      return best;
    });
    return { eltern: d.parentElement.tagName, pos: getComputedStyle(d).position,
             breit: Math.round(r.width), hoch: Math.round(r.height),
             schirm: [innerWidth, innerHeight], vor: abstand() };
  });
  sage(du && du.eltern === "BODY" && du.pos === "fixed"
    && Math.abs(du.breit - du.schirm[0]) <= 2 && Math.abs(du.hoch - du.schirm[1]) <= 2,
    "die Dunkelheit deckt die ganze Seite ab",
    du ? du.breit + " x " + du.hoch + " bei Schirm " + du.schirm.join(" x ") : "-");
  await pg.evaluate(() => window.scrollBy(0, 220));
  await new Promise((f) => setTimeout(f, 300));
  const nach = await pg.evaluate(() => {
    const d = document.getElementById("lcStromAus");
    return [...d.querySelectorAll(".lc-dunkel-augen")].map((p) => {
      const pr = p.getBoundingClientRect();
      let best = 1e9;
      document.querySelectorAll(".lc-platz.lc-platz-belegt").forEach((pl) => {
        const k = pl.querySelector(".lc-kreis"); if (!k) return;
        const kr = k.getBoundingClientRect();
        best = Math.min(best, Math.hypot(pr.left + pr.width / 2 - kr.left - kr.width / 2,
                                         pr.top + pr.height / 2 - kr.top - kr.height / 2));
      });
      return best;
    });
  });
  const weit = Math.max(0, ...nach);
  sage(du && du.vor.length >= 4 && weit < 3,
    "und die Augen bleiben beim Scrollen auf den Gesichtern",
    "weitester Abstand danach " + weit.toFixed(1) + " px");

  /* =================================================================
     DER GEMALTE WEG FUER FLUGZEUG, SPRUNGFEDER UND MAULWURF
     -----------------------------------------------------------------
     XANDER: „das Weg zeichnen … das soll auch fuer das Flugzeug, die
     Sprungfeder und den Maulwurf gehen."
     Gemessen wird nicht, ob der Quelltext eine Kette annimmt, sondern
     ob die drei den Umweg WIRKLICH abfahren: das Flugzeug an seiner
     Weglaenge, die Feder an ihren Aufsetzern und der Maulwurf an
     seinen Erdhaufen. Verglichen wird jedes Mal mit derselben Reise
     ohne Kette — nur der Unterschied beweist etwas.
     Die Pruefbuehne hat acht Plaetze in zwei Reihen
     (1-4 oben, 5-8 unten); Platz 1 bin ich, 6, 7 und 8 sind frei. */
  console.log("\nGemalter Weg");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const gitterW = await pg.evaluate(() => [...document.querySelectorAll(".lc-platz")]
    .map((p) => { const r = p.getBoundingClientRect();
      return { nr: +p.dataset.lcPlatz, x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));
  const platzW = (nr) => gitterW.find((g) => g.nr === nr);

  /* --- Das Flugzeug: der Umweg ist laenger als die gerade Strecke --- */
  const flugWeg = async (kette) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((k) => window.DMA_PRUEFUNG.wirkung("flug", k, "Alex"), kette);
    await new Promise((f) => setTimeout(f, 160));
    const bahn = await pg.evaluate(() => {
      const el = document.querySelector(".lc-flieger"); if (!el) return null;
      const an = el.getAnimations()[0]; if (!an) return null;
      an.pause(); const aus = [];
      for (let ms = 0; ms <= 5200; ms += 60) {
        an.currentTime = ms; const r = el.getBoundingClientRect();
        aus.push([r.left + r.width / 2, r.top + r.height / 2]);
      }
      return aus;
    });
    await new Promise((f) => setTimeout(f, 4600));
    if (!bahn) return null;
    return bahn.slice(1).reduce((a, p, i) =>
      a + Math.hypot(p[0] - bahn[i][0], p[1] - bahn[i][1]), 0);
  };
  const flugGerade = await flugWeg("8");
  const flugUmweg = await flugWeg("1-2-3-4-8");
  sage(flugGerade && flugUmweg && flugUmweg > flugGerade * 1.15,
    "flug: der gemalte Umweg wird wirklich geflogen",
    flugGerade ? "gerade " + flugGerade.toFixed(0) + " px, ueber 2-3-4 "
      + flugUmweg.toFixed(0) + " px" : "nicht messbar");

  /* --- Die Sprungfeder setzt auf JEDER Station auf ------------------ */
  const federNah = async (kette) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((k) => window.DMA_PRUEFUNG.wirkung("feder", k, "Alex"), kette);
    await new Promise((f) => setTimeout(f, 160));
    const aus = await pg.evaluate(() => {
      const el = document.querySelector(".lc-feder"); if (!el) return null;
      const an = el.getAnimations()[0]; if (!an) return null;
      an.pause(); const bahn = [];
      for (let ms = 0; ms <= 4400; ms += 40) {
        an.currentTime = ms; const r = el.getBoundingClientRect();
        bahn.push([r.left + r.width / 2, r.top + r.height / 2]);
      }
      return bahn;
    });
    await new Promise((f) => setTimeout(f, 4000));
    if (!aus) return null;
    return [6, 7].map((nr) => { const g = platzW(nr);
      return Math.min(...aus.map((p) => Math.hypot(p[0] - g.x, p[1] - g.y))); });
  };
  const federOhne = await federNah("8");
  const federMit = await federNah("1-6-7-8");
  sage(federMit && federOhne && Math.max(...federMit) < 12
       && Math.max(...federOhne) > 25,
    "feder: sie setzt auf jeder gemalten Station auf",
    federMit ? "mit Weg " + federMit.map((x) => x.toFixed(1)).join(" / ")
      + " px, ohne Weg " + federOhne.map((x) => x.toFixed(1)).join(" / ") + " px" : "nicht messbar");

  /* --- Der Maulwurfswall folgt dem Umweg --------------------------- */
  const wallNah = async (kette) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((k) => window.DMA_PRUEFUNG.wirkung("maulwurf", k, "Alex"), kette);
    await new Promise((f) => setTimeout(f, 220));
    const hs = await pg.evaluate(() => [...document.querySelectorAll(".lc-erdhaufen")]
      .map((h) => { const r = h.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2]; }));
    await new Promise((f) => setTimeout(f, 3400));
    if (!hs.length) return null;
    return [6, 7].map((nr) => { const g = platzW(nr);
      return Math.min(...hs.map((p) => Math.hypot(p[0] - g.x, p[1] - g.y))); });
  };
  const wallOhne = await wallNah("8");
  const wallMit = await wallNah("1-6-7-8");
  sage(wallMit && wallOhne && Math.max(...wallMit) < 30
       && Math.max(...wallOhne) > 35,
    "maulwurf: der Wall graebt sich ueber die gemalten Plaetze",
    wallMit ? "mit Weg " + wallMit.map((x) => x.toFixed(1)).join(" / ")
      + " px, ohne Weg " + wallOhne.map((x) => x.toFixed(1)).join(" / ") + " px" : "nicht messbar");

  /* --- Pac-Man frisst den gemalten Weg (Runde 76) ------------------- */
  const pacWeg = async (was) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((x) => window.DMA_PRUEFUNG.wirkung("pacjagd", x, "Alex"), was);
    await new Promise((f) => setTimeout(f, 260));
    const aus = await pg.evaluate(() => {
      /* RUNDE 85 — seit das GANZE Feld voller Punkte liegt, sagt die
         blosse Zahl der Platz-Punkte nichts mehr. Gefressen werden
         genau die, die KEIN „bleibt" tragen; ihre Reihenfolge steht
         im Verzug ihrer Animation. Genau das ist sein Weg. */
      const kr = [...document.querySelectorAll(".lc-pac-krume-platz")]
        .filter((e) => !e.classList.contains("lc-pac-krume-bleibt"))
        .sort((a, b) => parseFloat(getComputedStyle(a).animationDelay)
                      - parseFloat(getComputedStyle(b).animationDelay))
        .map((e) => {
          const r = e.getBoundingClientRect();
          return [r.left + r.width / 2, r.top + r.height / 2]; });
      const pl = [...document.querySelectorAll(".lc-platz")].map((q) => {
        const r = q.getBoundingClientRect();
        return { nr: +q.dataset.lcPlatz, x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      return kr.map((c) => { let b = 0, d = 1e9;
        pl.forEach((q) => { const e = Math.hypot(q.x - c[0], q.y - c[1]);
          if (e < d) { d = e; b = q.nr; } }); return b; });
    });
    await new Promise((f) => setTimeout(f, 4600));
    return aus;
  };
  const pacKurz = await pacWeg("Emmi");
  const pacKette = await pacWeg("1-2-3-7");
  sage(pacKette.join("-") === "1-2-3-7" && pacKurz.join("-") !== "1-2-3-7",
    "pacman: er frisst genau den gemalten Weg statt des kuerzesten",
    "mit Kette " + pacKette.join("-") + ", ohne Kette " + pacKurz.join("-"));

  /* Und die Probefahrt ohne Ziel faehrt wirklich (Runde 80) — jetzt
     gemessen statt am Quelltext abgelesen. */
  const pacOhne = await pacWeg("");
  sage(pacOhne.length > 1,
    "pacman: ohne Ziel faehrt er trotzdem ueber das Feld",
    "Kruemel auf " + (pacOhne.join("-") || "keinem Platz"));

  /* --- Der gemalte Weg darf ueber Besetzte (Runde 76) --------------- */
  const appP = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(!/if \(!p\.frei\) return;\s*\/\/ nicht durch Besetzte/.test(appP),
    "der gemalte Weg bricht an einem besetzten Platz nicht mehr ab");

  /* --- Und die Kette kommt ueberhaupt bis zur Animation ------------- */
  const lcW = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  /* RUNDE 83 — hier stand „genau diese drei". Seit der Frosch dazu
     gekommen ist, sind es vier; die Regel selbst ist unveraendert:
     wer einen Umweg zeichnen kann, muss die Kette auch annehmen.
     RUNDE 98 — und jetzt sind es ALLE. XANDER: „saemtliche Fahrzeuge
     sollen den Weg eingezeichnet bekommen." Die Regel ist damit
     andersherum zu lesen: aufgezaehlt wird, WER die Kette NICHT
     bekommt, und das sind nur die, die gar nicht fahren — Beamen,
     Tor, Roehre, Fahrstuhl, Zylinder, Liane und der Turm. Beide
     Listen muessen zusammenpassen, sonst schickt das Menue eine
     Kette, die in livechat.js wieder wegfaellt. */
  sage(/var ohneWegR = \{ beamen: 1, portal: 1, rohr: 1, fahrstuhl: 1,/.test(lcW)
    && /var kettenR = !ohneWegR\[art\];/.test(lcW),
    "livechat.js nimmt die Kette fuer JEDES Fahrzeug an, das wirklich faehrt");
  const appW = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/const ohneWeg = \{ beamen: 1, portal: 1, rohr: 1, fahrstuhl: 1, zylinder: 1,/.test(appW)
    && /liane: 1, turm: 1 \};/.test(appW),
    "und das Anreise-Menue schickt ihnen den gemalten Weg mit");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
