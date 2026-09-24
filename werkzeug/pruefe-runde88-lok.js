/* RUNDE 100 — gemessen werden nur die Schienen, auf denen die Lok FAEHRT.
   Der Rueckweg, der die Strecke zum Rundkurs schliesst (XANDER: „die Strecke
   immer automatisch und logisch geschlossen"), traegt „lc-lok-rund". */
/* =====================================================================
   SONDE RUNDE 88 — DIE LOK IN DER KURVE
   ---------------------------------------------------------------------
   XANDER: „Die Lok dreht sich immer noch auf der Stelle. Bevor sie
   zurueckfaehrt, dreht sie sich einmal rum."
   Und: „Bei der Lokomotive moechte ich, dass die Gleise an den
   Eckpunkten, die ich einzeichne, realistische Kurvenmodule haben wie
   bei einer Modelleisenbahn … brauchst du ne Physik in der Lokomotive,
   wo die Lok realistisch dreht an dem Eckpunkt … dass sie, wenn sie
   nach unten faehrt, nur von oben zu sehen ist, von der Draufsicht —
   da musst du eine Draufsicht generieren und denk dabei an alles, an
   die Kessel und an die Esse … und wenn sie nach oben faehrt, muss die
   Draufsicht so zu sehen sein, dass sie mit der Nase nach vorne nach
   oben faehrt … und die Gleise, so wie ich sie male, und wenn Personen
   im Weg sind, dann werden die Gleise unter der Person lang gezogen …
   aber trotzdem beim Ueberfahren der Person die Schreie ausloesen,
   gemessen an ihrem Geschlecht."

   WORAN MAN „DREHT SICH AUF DER STELLE" ERKENNT. Die Richtung steckte
   in einem scaleX(±1). Zwischen zwei Bildern rechnet der Browser das
   stetig aus — der Weg von +1 nach -1 fuehrt durch die Null, und genau
   das sieht man als Drehung. Diese Sonde misst deshalb nicht, ob
   irgendwo „rotate" steht, sondern das, was man SIEHT: solange die
   Seitenansicht sichtbar ist, darf ihr scaleX nie in der Naehe der
   Null liegen. Eine einzige Messung unter 0,9 waere die Drehung.

   GEMESSEN WIRD AUSSERDEM, alles an der laufenden Seite:
     · die Nase zeigt in die Fahrtrichtung (Schlot vor Fuehrerhaus),
     · auf der Senkrechten sieht man NUR die Draufsicht, um 90 Grad
       gedreht — nach unten mit der Nase nach unten,
     · das Kurvenmodul ist wirklich ein Bogen (Schienen mit
       A-Befehl) und seine Schwellen stehen strahlenfoermig,
     · die Spurweite bleibt im Bogen gleich,
     · das Gleis liegt UNTER den Plaetzen und laeuft durch deren
       Mitte hindurch,
     · es gibt keine Schiebebuehne mehr,
     · wer ueberfahren wird, schreit mit der Stimme seines
       Geschlechts.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};
const winkelAus = (m) => {
  if (!m || m === "none") return 0;
  const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
  return Number((Math.atan2(z[1], z[0]) * 180 / Math.PI).toFixed(2));
};

(async () => {
  console.log("RUNDE 88 — die Lok in der Kurve\n");
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
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  /* Jeden Abspielbefehl mitschreiben — nur so laesst sich sagen, WER
     geschrien hat. */
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push((this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a)$/, ""));
      return ap.call(this);
    };
  });

  const fahren = async (ziel, von) => {
    await pg.evaluate(() => {
      document.querySelectorAll(".lc-lok, .lc-lok-gleis").forEach((x) => x.remove());
      window.DMA_PRUEF.effektBuehne();
      window.__toene = [];
    });
    await pg.evaluate(([z, v]) => window.DMA_PRUEFUNG.wirkung("lok", z, v), [ziel, von]);
    await pg.waitForTimeout(350);
  };
  /* Die Uhren aller drei Ebenen auf denselben Zeitpunkt stellen. */
  const beiMs = async (t) => {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-lok, .lc-lok-seite, .lc-lok-oben").forEach((el) =>
        el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
    }, t);
    await pg.waitForTimeout(45);
    return pg.evaluate(() => {
      const l = document.querySelector(".lc-lok");
      const se = document.querySelector(".lc-lok .lc-lok-seite");
      const ob = document.querySelector(".lc-lok .lc-lok-oben");
      if (!l || !se || !ob) return null;
      const r = l.getBoundingClientRect();
      const sm = getComputedStyle(se).transform;
      const z = sm && sm !== "none" ? sm.slice(sm.indexOf("(") + 1, -1).split(",").map(Number) : [1, 0, 0, 1];
      const mess = (k) => {
        const e = l.querySelector("." + k);
        if (!e) return null;
        const q = e.getBoundingClientRect();
        return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
      };
      return {
        x: r.left + r.width / 2, y: r.top + r.height / 2,
        seite: Number((+getComputedStyle(se).opacity).toFixed(3)),
        spiegel: Number(z[0].toFixed(3)),
        oben: Number((+getComputedStyle(ob).opacity).toFixed(3)),
        obenM: getComputedStyle(ob).transform,
        schlot: mess("lc-lok-schlot"), haus: mess("lc-lok-haus"),
        oSchlot: mess("lc-lok-o-esse"), oHaus: mess("lc-lok-o-dach"),
      };
    });
  };

  /* =================================================================
     DIE FAHRT UM DIE ECKE: von Platz 1 nach Platz 8, also erst nach
     rechts und dann nach unten.
     ================================================================= */
  console.log("DIE FAHRT UM DIE ECKE — Platz 1 nach Platz 8\n");
  await fahren("8", "Alex");
  const da = await pg.evaluate(() => ({
    seite: !!document.querySelector(".lc-lok .lc-lok-seite"),
    oben: !!document.querySelector(".lc-lok .lc-lok-oben"),
    buehne: !!document.querySelector(".lc-lok-buehne"),
  }));
  sage(da.seite && da.oben, "die Lok hat zwei Zeichnungen: Seitenansicht und Draufsicht");
  sage(!da.buehne, "die Schiebebuehne ist weg — an ihrer Stelle liegt jetzt eine Kurve");

  /* 60 Messpunkte ueber die ganze Fahrt. */
  const bilder = [];
  for (let i = 0; i <= 60; i++) bilder.push(await beiMs(Math.round(i * 6400 / 60)));
  const echt = bilder.filter(Boolean);
  sage(echt.length === bilder.length, "die Lok liess sich an jedem Punkt messen",
    echt.length + " von " + bilder.length);

  console.log("\nKEIN DREHEN AUF DER STELLE\n");
  const geplaettet = echt.filter((b) => b.seite > 0.05 && Math.abs(b.spiegel) < 0.9);
  sage(geplaettet.length === 0,
    "solange man die Seitenansicht sieht, ist sie nie zusammengedrueckt",
    geplaettet.length
      ? geplaettet.map((b) => "klar " + b.seite + " bei scaleX " + b.spiegel).join(", ")
      : "kleinster |scaleX| bei sichtbarer Lok: "
        + Math.min.apply(null, echt.filter((b) => b.seite > 0.05)
            .map((b) => Math.abs(b.spiegel))).toFixed(3));

  console.log("\nDIE NASE ZEIGT NACH VORN\n");
  /* Auf der waagerechten Strecke nach rechts: der Schornstein muss
     RECHTS vom Fuehrerhaus stehen. Frueher war es umgekehrt — „Die Lok
     faehrt auch falsch rum." */
  const rechtsWeg = echt.filter((b, i) => i > 2 && b.seite > 0.9 && b.schlot && b.haus
    && i < echt.length - 2 && echt[i + 1] && echt[i + 1].x > b.x + 2);
  const falsch = rechtsWeg.filter((b) => b.schlot.x <= b.haus.x);
  sage(rechtsWeg.length > 3 && falsch.length === 0,
    "faehrt sie nach rechts, ist der Schornstein rechts vom Fuehrerhaus",
    rechtsWeg.length + " Messpunkte, davon " + falsch.length + " verkehrt herum"
      + (rechtsWeg.length ? " — Abstand " + (rechtsWeg[0].schlot.x - rechtsWeg[0].haus.x).toFixed(1) + " px" : ""));

  console.log("\nSENKRECHT HEISST DRAUFSICHT\n");
  /* Die senkrechten Messpunkte: y aendert sich, x nicht. */
  /* Ein Punkt gilt nur dann als „senkrecht", wenn auch sein Vorgaenger
     UND sein Nachfolger auf derselben Senkrechten liegen. Sonst faengt
     der Filter die ersten Punkte des Bogens mit ein (die weichen nur
     rund einen Pixel zur Seite ab, deshalb die enge Schranke) — dort
     ist die Lok
     zu Recht noch nicht bei 90 Grad, und die Messung waere unfair. */
  const nurSenk = (reihe, runter) => reihe.filter((b, i) => {
    const v = reihe[i - 1], n = reihe[i + 1];
    if (!v || !n) return false;
    if (Math.abs(b.x - v.x) > 0.6 || Math.abs(n.x - b.x) > 0.6) return false;
    return runter ? (b.y - v.y > 4 && n.y - b.y > 4) : (v.y - b.y > 4 && b.y - n.y > 4);
  });
  const senk = nurSenk(echt, true);
  sage(senk.length >= 4, "die Fahrt hat ein senkrechtes Stueck", senk.length + " Messpunkte");
  const nochSeitlich = senk.filter((b) => b.seite > 0.05);
  sage(nochSeitlich.length === 0,
    "auf der Senkrechten sieht man die Seitenansicht ueberhaupt nicht mehr",
    nochSeitlich.length ? nochSeitlich.map((b) => b.seite).join(", ")
      : "alle " + senk.length + " Punkte bei Klarheit 0");
  const obenDa = senk.filter((b) => b.oben > 0.95);
  sage(obenDa.length === senk.length,
    "stattdessen sieht man die Draufsicht", obenDa.length + " von " + senk.length);
  const winkelRunter = senk.map((b) => winkelAus(b.obenM));
  const runterFalsch = winkelRunter.filter((w) => Math.abs(w - 90) > 3);
  sage(runterFalsch.length === 0,
    "und sie zeigt mit der Nase nach UNTEN — genau 90 Grad",
    "gemessen " + winkelRunter.map((w) => w.toFixed(1)).join(", "));
  const naseUnten = senk.filter((b) => b.oSchlot && b.oHaus && b.oSchlot.y > b.oHaus.y);
  sage(naseUnten.length === senk.length,
    "auch in der Zeichnung selbst: die Esse liegt unter dem Fuehrerhausdach",
    naseUnten.length + " von " + senk.length);

  /* =================================================================
     UND DIE GEGENRICHTUNG: nach oben, Nase voran.
     ================================================================= */
  console.log("\nNACH OBEN — MIT DER NASE VORAN\n");
  /* In der Pruefbuehne ist kein Platz der oberen Reihe frei; eine
     Reise nach oben gaebe es also gar nicht. Platz 3 wird deshalb
     freigemacht — im echten Raum ist das ein ganz gewoehnlicher
     leerer Stuhl. */
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-lok, .lc-lok-gleis").forEach((x) => x.remove());
    window.DMA_PRUEF.effektBuehne();
    const p3 = document.querySelector('.lc-platz[data-lc-platz="3"]');
    p3.classList.remove("lc-platz-belegt");
    p3.classList.add("lc-platz-frei");
    p3.querySelector(".lc-platz-name").textContent = "";
    window.__toene = [];
  });
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("lok", "3", "Emmi"));
  await pg.waitForTimeout(350);
  const hoch = [];
  for (let i = 0; i <= 60; i++) {
    const b = await beiMs(Math.round(i * 6400 / 60));
    if (b) hoch.push(b);
  }
  const hochSenk = nurSenk(hoch, false);
  sage(hochSenk.length >= 3, "es geht wirklich nach oben", hochSenk.length + " Messpunkte");
  const winkelHoch = hochSenk.map((b) => winkelAus(b.obenM));
  const hochFalsch = winkelHoch.filter((w) => Math.abs(Math.abs(w) - 90) > 3 || w > 0);
  sage(hochSenk.length >= 3 && hochFalsch.length === 0,
    "die Draufsicht zeigt nach OBEN — minus 90 Grad, nicht plus",
    "gemessen " + winkelHoch.map((w) => w.toFixed(1)).join(", "));
  const naseOben = hochSenk.filter((b) => b.oSchlot && b.oHaus && b.oSchlot.y < b.oHaus.y);
  sage(hochSenk.length >= 3 && naseOben.length === hochSenk.length,
    "die Esse liegt ueber dem Fuehrerhausdach — sie faehrt nicht rueckwaerts hinauf",
    naseOben.length + " von " + hochSenk.length);

  /* =================================================================
     DIE GLEISE
     ================================================================= */
  console.log("\nDIE KURVENMODULE\n");
  await fahren("8", "Alex");
  const gleis = await pg.evaluate(() => {
    const svg = document.querySelector(".lc-lok-gleis");
    if (!svg) return null;
    const schienen = Array.from(svg.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)"))
      .map((p) => p.getAttribute("d"));
    const schwellen = Array.from(svg.querySelectorAll(".lc-lok-schwelle:not(.lc-lok-rund)")).map((l) => {
      const g = (k) => Number(l.getAttribute(k));
      let w = Math.atan2(g("y2") - g("y1"), g("x2") - g("x1")) * 180 / Math.PI;
      if (w < 0) w += 180;
      return Number(w.toFixed(1));
    });
    const platz = document.querySelector('.lc-platz[data-lc-platz="2"]');
    return {
      schienen: schienen,
      boegen: schienen.filter((d) => /A/.test(d)),
      schwellenWinkel: schwellen,
      gleisZ: Number(getComputedStyle(svg).zIndex) || 0,
      platzZ: Number(getComputedStyle(platz).zIndex) || 0,
      /* Laeuft das Gleis durch die Mitte der Plaetze? Gemessen am
         kleinsten Abstand der Schienenpunkte zu jeder Platzmitte. */
      naheAmPlatz: Array.from(document.querySelectorAll(".lc-platz")).map((pl) => {
        const r = pl.querySelector(".lc-kreis").getBoundingClientRect();
        const mx = r.left + r.width / 2, my = r.top + r.height / 2;
        let best = Infinity;
        svg.querySelectorAll(".lc-lok-schwelle:not(.lc-lok-rund)").forEach((l) => {
          const x = (Number(l.getAttribute("x1")) + Number(l.getAttribute("x2"))) / 2;
          const y = (Number(l.getAttribute("y1")) + Number(l.getAttribute("y2"))) / 2;
          const q = svg.getBoundingClientRect();
          best = Math.min(best, Math.hypot(q.left + x - mx, q.top + y - my));
        });
        return { nr: pl.dataset.lcPlatz, d: Number(best.toFixed(1)) };
      }),
    };
  });
  if (!gleis) { sage(false, "das Gleis liess sich nicht messen"); }
  else {
    sage(gleis.boegen.length === 2,
      "die Ecke traegt ein echtes Kurvenmodul: zwei gebogene Schienen",
      gleis.boegen.length + " Bogenschienen von " + gleis.schienen.length + " Schienen");
    /* Die Spurweite im Bogen: die beiden Radien duerfen sich nur um
       die Spurweite unterscheiden — sonst liefe die Lok aus dem
       Gleis. */
    const radien = gleis.boegen.map((d) => Number(d.split("A")[1].trim().split(" ")[0]));
    sage(radien.length === 2 && Math.abs((radien[1] - radien[0])) > 4,
      "die beiden Bogenschienen haben verschiedene Radien — das ist die Spurweite",
      radien.map((r) => r.toFixed(1)).join(" und ") + " px");
    /* Strahlenfoermige Schwellen: auf den Geraden stehen sie bei 0
       oder 90 Grad, im Bogen dazwischen. */
    const dazwischen = gleis.schwellenWinkel
      .filter((w) => w > 8 && w < 82).concat(gleis.schwellenWinkel.filter((w) => w > 98 && w < 172));
    sage(dazwischen.length >= 3,
      "die Schwellen im Bogen stehen strahlenfoermig, nicht parallel",
      dazwischen.length + " schraege Schwellen: " + dazwischen.slice(0, 6).join("°, ") + "°");
    sage(gleis.gleisZ < gleis.platzZ,
      "das Gleis liegt UNTER den Plaetzen — man sieht es in den Zwischenraeumen",
      "Gleis z-index " + gleis.gleisZ + ", Platz " + gleis.platzZ);
    const drunter = gleis.naheAmPlatz.filter((p) => p.d < 26);
    sage(drunter.length >= 3,
      "und es laeuft durch die Mitte der ueberfahrenen Plaetze hindurch",
      drunter.map((p) => "Platz " + p.nr + " " + p.d + " px").join(", "));
  }

  /* =================================================================
     WER UEBERFAHREN WIRD, SCHREIT — MIT SEINER STIMME
     ================================================================= */
  console.log("\nDER SCHREI RICHTET SICH NACH DEM GESCHLECHT\n");
  for (const [g, erwartet] of [["w", "aufrau"], ["m", "aumann"]]) {
    await pg.evaluate((gg) => {
      document.querySelectorAll(".lc-lok, .lc-lok-gleis").forEach((x) => x.remove());
      window.DMA_PRUEF.effektBuehne();
      document.querySelectorAll('.lc-platz[data-lc-platz="2"], .lc-platz[data-lc-platz="3"],'
        + ' .lc-platz[data-lc-platz="4"]').forEach((p) => {
        p.dataset.lcGeschlecht = gg;
      });
      window.__toene = [];
    }, g);
    await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("lok", "8", "Alex"));
    await pg.waitForTimeout(5200);
    const toene = await pg.evaluate(() => window.__toene || []);
    const schreie = toene.filter((n) => n === "aufrau" || n === "aumann");
    sage(schreie.length > 0 && schreie.every((n) => n === erwartet),
      "als " + (g === "w" ? "Frau" : "Mann") + " eingetragen, ruft „" + erwartet + "\"",
      schreie.length ? schreie.join(", ") : "kein Schrei gehoert");
  }

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
    : "\nSie dreht nicht mehr auf der Stelle — sie faehrt um die Kurve.\n");
  process.exit(fehler ? 1 : 0);
})();
