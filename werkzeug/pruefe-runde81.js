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

  /* „das Spukgeraeusch koennte realistischer klingen."
     Der Fehler war messbar: der AUSWURF („ptt", 0,46 s) war mit
     -31 dB die LEISESTE Stelle — leiser als das Raeuspern davor.
     Jetzt muss er der lauteste Punkt des Geraeusches sein. */
  const ro = tonMessen("rotze");
  const bei = (s) => ro.huelle[Math.round(s / 0.05)];
  const raeuspern = Math.max(bei(0.10), bei(0.15), bei(0.20));
  sage(bei(0.45) > raeuspern,
    "rotze: der Auswurf ist lauter als das Raeuspern davor",
    "Auswurf " + bei(0.45).toFixed(1) + " dB, Raeuspern " + raeuspern.toFixed(1) + " dB");
  sage(bei(0.45) >= bei(0.60) - 1,
    "und er ist der lauteste Punkt des Geraeusches",
    "Auswurf " + bei(0.45).toFixed(1) + " dB, Aufschlag " + bei(0.60).toFixed(1) + " dB");

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
  sage(/const greifFluegel = \(k\) =>/.test(js)
    && /federn\.push\(/.test(js)
    && /class="lc-greif-schwinge"/.test(js),
    "der Greifvogel hat einzelne Handschwingen statt einer Flughaut");

  /* „achte dabei auf den Arsch, dass die Beine am Arsch sind und die
     Beine sind so komisch gefaltet wie so eine Ziehharmonika." */
  sage(/class="lc-pferd-hand"/.test(js) && /class="lc-pferd-schulter"/.test(js),
    "das Pferd hat Hinterhand und Schulter");
  sage(!/d="M49 56 L55 70 L46 80 L48 92"/.test(js)
    && /lc-pferd-b1" d="M54 68 Q55 75 49 80 Q48 86 50 91"/.test(js),
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

  /* „die lok soll man auch mehrmals im Kreis herumfahren lassen und
     kann die Menschen auch ueberfahren … sie sollen dann schreien." */
  sage(/function lcLokRunden\(/.test(js) && /const RUNDEN = 2;/.test(js),
    "die Lok faehrt zwei Runden");
  sage(/lcGeraeusch\(lcSchmerzTon\(g\.el\), "lokopfer", 0\.5\);/.test(js)
    && /@keyframes lcUeberfahrenR80/.test(css),
    "und wer ueberfahren wird, schreit");

  /* „Ich moechte den pacman zum ausprobieren auch wenn niemand da ist
     uebers Feld schicken koennen." */
  sage(/const probe = !zu \|\| zu\.nr === ab\.nr;/.test(js)
    && /if \(probe\) return;/.test(js),
    "Pac-Man faehrt auch ohne Ziel — und frisst dabei niemanden");

  /* „da moechte ich noch einen Song Ausschnitt definieren koennen." */
  sage(/liedAb: stueckK \? stueckK\.ab : 0,/.test(lc)
    && /function lcMusikSpielen\(datei, titel, ab, bis\)/.test(js),
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

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
