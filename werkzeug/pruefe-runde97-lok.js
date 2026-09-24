#!/usr/bin/env node
/* RUNDE 100 — gemessen werden nur die Schienen, auf denen die Lok FAEHRT.
   Der Rueckweg, der die Strecke zum Rundkurs schliesst (XANDER: „die Strecke
   immer automatisch und logisch geschlossen"), traegt „lc-lok-rund". */
/* =====================================================================
   SONDE RUNDE 97 — DIE LOK STEHT AUF IHREM GLEIS
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Lokomotive hat immer noch keine
   Schienenfuehrung."

   Die Gleise waren da — gezeichnet aus denselben Modulen, auf denen
   die Lok faehrt. Was fehlte, war das VERHAELTNIS. Zwei Zahlen, beide
   am laufenden Bild nachgemessen:

     SPURWEITE   Das Gleis war 0,34 Platzbreiten breit, die Radkanten
                 der Lok standen 0,72 auseinander. Die Raeder liefen
                 also weit neben den Schienen. Ein Fahrzeug, dessen
                 Raeder neben dem Gleis stehen, wird von ihm nicht
                 gefuehrt — genau das sah man.
     LAENGE      Die Lok war 1,77 Platzbreiten lang, der Kurvenradius
                 eine halbe. Sie war damit laenger als der ganze
                 Kurvendurchmesser und konnte der Kurve gar nicht
                 folgen; sie legte sich quer darueber.

   Diese Sonde misst beides nach: den Abstand der Schienen gegen den
   Abstand der Radkanten, und die Laenge der Lok gegen den Radius.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
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
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nGLEIS UND LOK, IN PIXELN GEMESSEN\n");
  const mess = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    /* RUNDE 98 — HIER WIRD EIN GEZEICHNETER WEG MIT ECKE GEFAHREN.
       XANDER: „sie soll generell ueber alle Leute immer fahren
       koennen, egal wo ich hinfahren moechte."
       Seit die Lok jeden Platz anfaehrt (auch besetzte), liegt die
       Strecke von Emmi aus GERADE nach oben — und auf einer geraden
       Strecke gibt es gar kein Kurvenmodul. Die Messung unten
       verglich die Loklaenge dann mit einem Kurvendurchmesser von
       0 px und meldete einen Fehler, den es nicht gab. Deshalb wird
       jetzt ausdruecklich ein Weg mit Ecke gezeichnet: 5 → 6 → 7 → 3.
       Dort gibt es beides, Gerade und Kurve. */
    window.DMA_PRUEFUNG.wirkung("lok", "5-6-7-3", "Alex", {});
    await new Promise((f) => setTimeout(f, 700));
    const gleis = document.querySelector(".lc-lok-gleis");
    const lok = document.querySelector(".lc-lok");
    if (!gleis || !lok) return { fehlt: true };
    const platz = document.querySelector(".lc-platz .lc-kreis");
    const d = platz ? platz.getBoundingClientRect().width : 0;

    /* Die Spurweite: die beiden Schienen eines GERADEN Stuecks liegen
       parallel; ihr Abstand ist die Spur. */
    const gerade = [...gleis.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)")]
      .map((p) => p.getAttribute("d"))
      .filter((s) => s.indexOf("A") < 0)
      .map((s) => s.match(/M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)/))
      .filter(Boolean)
      .map((m) => ({ x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4] }));
    let spurweite = 0;
    for (let i = 0; i < gerade.length; i++) {
      for (let k = i + 1; k < gerade.length; k++) {
        const a = gerade[i], b = gerade[k];
        const waag = Math.abs(a.y1 - a.y2) < 1 && Math.abs(b.y1 - b.y2) < 1;
        const senk = Math.abs(a.x1 - a.x2) < 1 && Math.abs(b.x1 - b.x2) < 1;
        if (waag && Math.abs(a.x1 - b.x1) < 1) spurweite = Math.abs(a.y1 - b.y1);
        else if (senk && Math.abs(a.y1 - b.y1) < 1 && !spurweite) spurweite = Math.abs(a.x1 - b.x1);
      }
    }

    /* Die Radkanten der Lok: in der Draufsicht die linke und die
       rechte Reihe.
       RUNDE 98 — WARUM NICHT MEHR AUF DEM BILDSCHIRM GEMESSEN WIRD.
       Vorher stand hier der Abstand der Radmitten in Bildschirm-
       Hoehe. Das ging nur gut, solange die Lok WAAGERECHT fuhr.
       Seit sie jeden Platz anfaehrt, faehrt sie auch senkrecht und
       durch Kurven — dann liegt ihre Spur quer zum Bildschirm, und
       die alte Messung las den ACHSABSTAND (52,9 px) statt der Spur
       und meldete „16,7 px Unterschied". Nachgemessen war die Spur
       in Wahrheit 36,25 px bei 36,2 px Gleis — also genau richtig.
       Jetzt wird im Zeichenraster der Lok gemessen (getBBox, also
       ohne jede Drehung) und mit demselben Massstab umgerechnet,
       mit dem der Browser die Zeichnung einpasst. Das Ergebnis
       stimmt in jeder Fahrtrichtung. */
    const raeder = [...lok.querySelectorAll(".lc-lok-o-rad")];
    const kasten = lok.getBoundingClientRect();
    const form = lok.querySelector(".lc-lok-form");
    const vb = String((form && form.getAttribute("viewBox")) || "0 0 120 60")
      .trim().split(/[\s,]+/).map(Number);
    const fr = form ? form.getBoundingClientRect() : kasten;
    const massstab = Math.min(fr.width / (vb[2] || 1), fr.height / (vb[3] || 1));
    let obenY = Infinity, untenY = -Infinity;
    raeder.forEach((r) => {
      const b = r.getBBox();
      obenY = Math.min(obenY, b.y + b.height / 2);
      untenY = Math.max(untenY, b.y + b.height / 2);
    });
    const radspur = raeder.length ? (untenY - obenY) * massstab : 0;
    /* RUNDE 100 — der RADSTAND (vorderste bis hinterste Radkante, in
       Fahrtrichtung): er muss in den Bogen passen, nicht die ganze Lok. */
    let vornX = Infinity, hintenX = -Infinity;
    raeder.forEach((r) => {
      const b = r.getBBox();
      vornX = Math.min(vornX, b.x + b.width / 2);
      hintenX = Math.max(hintenX, b.x + b.width / 2);
    });
    const radstand = raeder.length ? (hintenX - vornX) * massstab : 0;
    const radbreite = raeder.length ? raeder[0].getBBox().height * massstab : 0;

    /* Der Kurvenradius: aus dem Bogen-Pfad. */
    const bogen = [...gleis.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)")]
      .map((p) => p.getAttribute("d"))
      .filter((s) => s.indexOf("A") >= 0)
      .map((s) => Number(s.match(/A([\d.]+)/)[1]));
    const radius = bogen.length ? (Math.min.apply(null, bogen) + Math.max.apply(null, bogen)) / 2 : 0;

    return { d: d, spurweite: spurweite, radspur: radspur,
      lokLang: kasten.width, lokHoch: kasten.height, radius: radius,
      raeder: raeder.length, radstand: radstand, radbreite: radbreite };
  });

  if (mess.fehlt) { sage(false, "die Lok faehrt ueberhaupt"); }
  else {
    console.log("  Platzbreite " + mess.d.toFixed(0) + " px"
      + " | Spurweite " + mess.spurweite.toFixed(1)
      + " | Radkanten " + mess.radspur.toFixed(1)
      + " | Lok " + mess.lokLang.toFixed(0) + " x " + mess.lokHoch.toFixed(0)
      + " | Kurvenradius " + mess.radius.toFixed(1) + "\n");
    sage(mess.raeder >= 6, "die Lok hat ihre Radkanten", mess.raeder + " Stueck");
    const weg = Math.abs(mess.radspur - mess.spurweite);
    sage(weg <= mess.spurweite * 0.12,
      "die Raeder stehen AUF den Schienen, nicht daneben",
      weg.toFixed(1) + " px Unterschied");
    /* RUNDE 100 — XANDER (Walkie-Talkie): „DIE Lok muss wieder groesser."
       Die alte Regel hier („die ganze Lok kuerzer als der Kurven-
       durchmesser") liess genau das nicht zu. Was fuer die FUEHRUNG
       zaehlt, ist aber der Radstand: liegt seine Mitte auf dem Bogen,
       weichen die aeussersten Raeder um die Pfeilhoehe
       r - sqrt(r^2 - (Radstand/2)^2) nach innen ab. Solange das weniger
       ist als die halbe Spur, stehen sie noch auf dem Gleis. Dass die
       Lok vorn und hinten ueber die Kurve ragt, tut jede lange Lok. */
    const halb = mess.radstand / 2;
    const pfeil = mess.radius > halb ? mess.radius - Math.sqrt(mess.radius * mess.radius - halb * halb) : Infinity;
    /* Ein Rad hat eine BREITE: es beruehrt die Schiene noch, solange
       es um weniger als halbe Spur plus halbe Radbreite abweicht. */
    const tol = mess.spurweite / 2 + mess.radbreite / 2;
    sage(pfeil < tol,
      "und im Bogen bleiben die Raeder auf dem Gleis (Radstand passt in die Kurve)",
      "Pfeilhoehe " + pfeil.toFixed(1) + " px, erlaubt " + tol.toFixed(1)
        + " px (halbe Spur + halbe Radbreite), Lok " + mess.lokLang.toFixed(0) + " px lang");
    sage(mess.lokLang >= mess.d * 1.65,
      "... und die Lok ist groesser als vorher (mind. 1,65 Platzbreiten)",
      (mess.lokLang / mess.d).toFixed(2) + " Platzbreiten");
  }

  /* =====================================================================
     UND JETZT DIE FUEHRUNG SELBST: BLEIBT SIE WAEHREND DER FAHRT AUF
     DEM GLEIS?
     ---------------------------------------------------------------------
     Die beiden Zahlen oben sagen, dass Lok und Gleis zusammenpassen.
     Sie sagen noch nicht, dass sie waehrend der Fahrt auch daraufbleibt
     — gerade in der Kurve. Deshalb wird die Mitte der Lok Bild fuer
     Bild gegen die naechstgelegene Schiene gemessen. Der Abstand muss
     ungefaehr die halbe Spurweite sein und darf sich nicht veraendern:
     genau das heisst „gefuehrt".
     ===================================================================== */
  /* RUNDE 100 — XANDER (Walkie-Talkie): „Die Lok sitzt von der
     Seitenansicht noch nicht richtig auf den Gleisen. Die Gleise sind
     teilweise schief auf der geraden Strecke."
     GEMESSEN vorher: Anfang und Ende lagen auf der Platzmitte statt
     der Bildmitte — das erste Stueck fiel 12 px auf 133 px ab. Und die
     Treibraeder der Seitenansicht hingen 19 px unter der nahen Schiene.
     Gefahren wird von Platz 1 in derselben Reihe nach rechts: jede
     Gerade muss waagerecht sein, und die Raeder stehen auf der Schiene. */
  console.log("\nSEITENANSICHT: GERADE GLEISE, RAEDER AUF DER SCHIENE\n");
  const seite = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    window.DMA_PRUEFUNG.wirkung("lok", "8", "Alex", {});
    await new Promise((f) => setTimeout(f, 1500));
    const gleis = document.querySelector(".lc-lok-gleis");
    const lok = document.querySelector(".lc-lok");
    if (!gleis || !lok) return null;
    const g = gleis.getBoundingClientRect();
    const geraden = [...gleis.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)")].map((p) => p.getAttribute("d"))
      .filter((s) => s.indexOf("A") < 0)
      .map((s) => s.match(/M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)/)).filter(Boolean)
      .map((m) => ({ x1: +m[1], y1: +m[2] + g.top, x2: +m[3], y2: +m[4] + g.top }));
    /* schief = weder waagerecht noch senkrecht */
    const schief = geraden.filter((a) => Math.abs(a.y1 - a.y2) > 0.5 && Math.abs(a.x1 - a.x2) > 0.5);
    const waag = geraden.filter((a) => Math.abs(a.y1 - a.y2) <= 0.5);
    const nah = Math.max.apply(null, waag.map((a) => a.y1));      /* die nahe (untere) Schiene */
    /* Radmitte plus Radius, ueber die Bildschirm-Matrix — NICHT der
       Kasten: ein sich drehendes Rad hat einen groesseren Kasten. */
    const zeichnung = lok.querySelector(".lc-lok-seite svg");
    const mat = zeichnung.getScreenCTM();
    const reifen = [...zeichnung.querySelectorAll(".lc-lok-reifen")].map((c) => {
      const sw = parseFloat(getComputedStyle(c).strokeWidth) || 0;
      return new DOMPoint(+c.getAttribute("cx"), +c.getAttribute("cy") + +c.getAttribute("r") + sw / 2)
        .matrixTransform(mat).y;
    });
    const staerke = parseFloat(getComputedStyle(gleis.querySelector(".lc-lok-schiene:not(.lc-lok-rund)")).strokeWidth) || 0;
    return { schief: schief.length, geraden: geraden.length,
      treib: Math.max.apply(null, reifen), schieneOben: nah - staerke / 2 };
  });
  sage(seite && seite.schief === 0, "keine Gerade liegt schief",
    seite ? seite.schief + " von " + seite.geraden + " schief" : "keine Fahrt");
  sage(seite && Math.abs(seite.treib - seite.schieneOben) <= 1,
    "die Treibraeder der Seitenansicht stehen AUF der nahen Schiene",
    seite ? "Radunterkante " + seite.treib.toFixed(1) + ", Schienenoberkante " + seite.schieneOben.toFixed(1) : "-");

  console.log("\nDIE FAHRT — ABSTAND ZUR SCHIENE, BILD FUER BILD\n");
  const fahrt = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("lok", "Emmi", "Alex", {});
    await new Promise((f) => setTimeout(f, 600));
    const spur = [];
    for (let i = 0; i < 14; i++) {
      await new Promise((f) => setTimeout(f, 200));
      const lok = document.querySelector(".lc-lok");
      const gleis = document.querySelector(".lc-lok-gleis");
      if (!lok || !gleis) { spur.push(null); continue; }
      const lb = lok.getBoundingClientRect(), gb = gleis.getBoundingClientRect();
      const mx = lb.left + lb.width / 2, my = lb.top + lb.height / 2;
      let nah = Infinity;
      gleis.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)").forEach((pfad) => {
        const lang = pfad.getTotalLength();
        for (let k = 0; k <= 24; k++) {
          const pt = pfad.getPointAtLength(lang * k / 24);
          const d = Math.hypot(gb.left + pt.x - mx, gb.top + pt.y - my);
          if (d < nah) nah = d;
        }
      });
      spur.push(Math.round(nah));
    }
    return spur.filter((x) => x !== null);
  });
  console.log("  " + fahrt.join("  ") + " px\n");
  const grosster = Math.max.apply(null, fahrt);
  const kleinster = Math.min.apply(null, fahrt);
  sage(fahrt.length >= 8, "die Lok faehrt wirklich", fahrt.length + " Messpunkte");
  sage(grosster - kleinster <= 8,
    "und ihre Mitte bleibt die ganze Fahrt ueber gleich weit von der Schiene",
    kleinster + " bis " + grosster + " px");

  console.log("\nFUNK 76 — KREIS ODER TUNNEL\n");
  /* XANDER (Walkie #84): „Wenn man die Lok einmal im Kreis fahren läßt,
     soll die Strecke mit einer runden Kurve abschließen und generell soll
     die Strecke immer automatisch und logisch geschlossen werden, egal
     wie kurz die Strecke ist, die man einzeichnet."
     Gemessen: jedes Schienenende muss auf ein anderes treffen (1,5 px).
     Ein offenes Gleis hat vier freie Enden. */
  /* Ein gemalter Weg beginnt immer am eigenen Platz (1). „5-6-7-3" oben
     springt schraeg von 1 nach 6 — an schraegen Ecken gibt es kein
     Kurvenmodul, dort klaffen die Schienen (auch vor Runde 100 schon:
     8 freie Enden). Das bleibt eine eigene Baustelle. */
  /* FUNK 76 (24.09.) — XANDER: „wenn sie von der 1 bis zur vier über die
     acht zur fünf fährt, dass der Kreis geschlossen ist … immer wo es kein
     einfacher geschlossener Kreis ist, sollen Tunnel sein."
     Die Regel aus Walkie #84 („immer geschlossen") gilt damit nur noch
     fuer den Kreis. Eine offene Strecke endet in zwei Tunneln: jedes
     freie Schienenende muss IM Berg liegen (hoechstens eine halbe
     Platzbreite hinter dem Portal). */
  const d97 = await pg.evaluate(() => (document.querySelector(".lc-kreis") || {}).offsetWidth || 64);
  for (const [weg, kreisErwartet] of [["1-2-6-5", true], ["1-2-3-4-8-7-6-5", true],
                                       ["2", false], ["1-5-6-7-3", false], ["1-5-6-7-8-4", false],
                                       ["1-5-6-2-3-7-8-4", false]]) {
    const kreis = await pg.evaluate(async (w) => {
      window.DMA_PRUEF.effektBuehne();
      await new Promise((f) => setTimeout(f, 250));
      window.DMA_PRUEFUNG.wirkung("lok", w, "Alex", {});
      await new Promise((f) => setTimeout(f, 700));
      const g = document.querySelector(".lc-lok-gleis");
      if (!g) return null;
      const gr = g.getBoundingClientRect();
      const enden = [];
      g.querySelectorAll(".lc-lok-schiene").forEach((pf) => {
        const z = (pf.getAttribute("d").match(/-?[0-9.]+/g) || []).map(Number);
        if (z.length >= 4) enden.push([z[0], z[1]], [z[z.length - 2], z[z.length - 1]]);
      });
      const frei = enden.filter((e, i) => !enden.some((f, j) => j !== i
        && Math.hypot(e[0] - f[0], e[1] - f[1]) < 1.5)).map((e) => [e[0] + gr.left, e[1] + gr.top]);
      const portale = [...document.querySelectorAll(".lc-lok-tunnel .lc-tn-mauer")].map((m) => {
        const r = m.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
      /* „Im Berg": das Schienenende liegt naeher an einem Portal als an
         jedem Platz — es laeuft also HINTER dem Portal weiter (die Maske
         verbirgt es), statt vor ihm offen aufzuhoeren. */
      const sitze = [...document.querySelectorAll(".lc-platz .lc-kreis")].map((k) => {
        const r = k.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];
      });
      const naechst = (e, liste) => Math.min.apply(null, liste.map((p) => Math.hypot(e[0] - p[0], e[1] - p[1])));
      const imBerg = frei.filter((e) => portale.length && naechst(e, portale) < naechst(e, sitze)).length;
      const maske = getComputedStyle(g).maskImage || getComputedStyle(g).webkitMaskImage || "";
      return { frei: frei.length, imBerg: imBerg, tunnel: portale.length, maske: /svg/.test(maske),
               schienen: g.querySelectorAll(".lc-lok-schiene").length };
    }, weg);
    if (!kreis) { sage(false, "Weg " + weg + ": es liegt ein Gleis"); continue; }
    if (kreisErwartet) {
      sage(kreis.frei === 0 && kreis.tunnel === 0, "Weg " + weg + ": geschlossener Kreis, kein offenes Schienenende, kein Tunnel",
        kreis.frei + " freie Enden, " + kreis.tunnel + " Tunnel");
    } else {
      sage(kreis.tunnel === 2 && kreis.frei > 0 && kreis.imBerg === kreis.frei && kreis.maske,
        "Weg " + weg + ": offen — beide Enden verschwinden in einem Tunnel",
        kreis.tunnel + " Tunnel, " + kreis.imBerg + " von " + kreis.frei + " Schienenenden im Berg"
        + (kreis.maske ? ", Gleis maskiert" : ", Gleis NICHT maskiert"));
    }
    await pg.waitForTimeout(100);
  }

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
