/* =====================================================================
   SONDE RUNDE 83 — Frosch-Sprung und Zylinder mit Kaninchen
   ---------------------------------------------------------------------
   Die letzten beiden ANIMATIONEN aus Xanders Liste von Runde 76.
   Gemessen wird das Verhalten im Browser, nicht der Quelltext: wo der
   Frosch aufsetzt, ob seine Beine im Takt der Spruenge arbeiten, und
   ob der Zaubertrick wirklich in der richtigen Reihenfolge ablaeuft —
   Hut, Rauch, Pause, Hut, Kaninchen, Person.
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
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

function tonMessen(name) {
  const roh = "/tmp/claude-0/pr83-" + name + ".raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", name + ".opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const n = b.length / 2, st = 1200, huelle = [];
  for (let i = 0; i < n; i += st) {
    let x = 0;
    for (let j = i; j < Math.min(n, i + st); j++) {
      const v = Math.abs(b.readInt16LE(j * 2)); if (v > x) x = v;
    }
    huelle.push(x ? Math.round(20 * Math.log10(x / 32768)) : -99);
  }
  return { dauer: n / 24000, huelle: huelle };
}

(async () => {
  console.log("RUNDE 83 — Frosch und Zauberzylinder");

  /* =================================================================
     1. DIE BEIDEN NEUEN GERAEUSCHE
     ================================================================= */
  console.log("\nToene");
  ["quaken", "zauberpuff"].forEach((n) => {
    sage(fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
      && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a")),
      "ton/" + n + " liegt als opus und m4a bereit");
  });
  const gl = fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8");
  sage(/\|quaken\|/.test(gl) && /\|zauberpuff\|/.test(gl),
    "und beide stehen in data-geraeusche.js");

  /* ACHTUNG, HIER STAND FRUEHER: „quaken sind drei getrennte Rufe in
     1,8 s". Das hat Xander in Runde 85 zurueckgenommen: „und er quakt
     nicht richtig." Der Grund war die Laenge — der Frosch spielte die
     Datei bei JEDEM Sprung neu an und schnitt sie nach der
     Sprungdauer ab, oft nach 320 ms. Man hoerte also immer denselben
     angeschnittenen ersten Ruf. Jetzt enthaelt die Datei EINEN Ruf,
     der ausklingen darf; gemessen wird deshalb: ein Ruf, kurz genug,
     um zu einem Sprung zu gehoeren, und trotzdem eine Pulsfolge und
     kein Dauerton. */
  const q = tonMessen("quaken");
  let inseln = 0, drin = false;
  q.huelle.forEach((d) => {
    if (d > -40 && !drin) { inseln++; drin = true; }
    else if (d <= -40) drin = false;
  });
  sage(inseln === 1 && q.dauer < 0.8,
    "quaken ist EIN Ruf, kurz genug fuer einen Sprung",
    inseln + " Ruf, " + q.dauer.toFixed(2) + " s");

  /* Der Zauberpuff hat ZWEI Puffs mit einer Stille dazwischen — sonst
     gibt es kein Verschwinden und kein Auftauchen, nur Geklingel. */
  const zp = tonMessen("zauberpuff");
  const mitte = zp.huelle.slice(24, 31).filter((d) => d < -40).length;
  sage(mitte >= 3 && Math.abs(zp.dauer - 2.4) < 0.15,
    "zauberpuff hat die Pause zwischen Verschwinden und Auftauchen",
    mitte + " stille Proben in der Mitte, " + zp.dauer.toFixed(2) + " s");

  /* =================================================================
     2. DER BROWSER
     ================================================================= */
  const srv = http.createServer((qq, a) => {
    let p = decodeURIComponent(qq.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  console.log("\nDer Frosch");
  const froschBahn = async (kette) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((k) => window.DMA_PRUEFUNG.wirkung("frosch", k, "Alex"), kette);
    await new Promise((f) => setTimeout(f, 180));
    const aus = await pg.evaluate(async () => {
      const el = document.querySelector(".lc-frosch");
      if (!el) return null;
      const an = el.getAnimations().find((a) => a.effect && a.effect.getKeyframes().length > 3);
      if (!an) return null;
      an.pause();
      const bahn = [];
      for (let ms = 0; ms <= 4600; ms += 40) {
        an.currentTime = ms;
        const r = el.getBoundingClientRect();
        bahn.push([r.left + r.width / 2, r.top + r.height / 2]);
      }
      /* RUNDE 101 — XANDER (Funk 90): „die Beine … müssen einen Knick
         in den Knien haben, der in die Richtung geht, wo man abspringt."
         Die Hinterbeine sind jetzt Glieder mit Gelenken (lcFroschBein),
         getrieben von der Sprunguhr — gemessen wird, ob sie sich ueber
         die Spruenge wirklich strecken UND wieder falten. */
      const winkel = [];
      for (let ms = 0; ms <= 4600; ms += 80) {
        an.currentTime = ms;
        await new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(() => f())));
        /* Jedes Bild baut das Bein neu — also jedes Mal neu suchen. */
        const hb = el.querySelector(".lc-frosch-hbein:not(.lc-frosch-hbein-fern) g");
        const m = hb && /rotate\(([-\d.]+)\)/.exec(hb.getAttribute("transform") || "");
        if (m) winkel.push(parseFloat(m[1]));
      }
      const beine = [el.querySelectorAll(".lc-frosch-hbein").length,
                     winkel.length ? Math.max.apply(null, winkel) : 0,
                     winkel.length ? Math.min.apply(null, winkel) : 0];
      return { bahn: bahn, beine: beine, last: !!el.querySelector(".lc-frosch-last"),
               auge: !!el.querySelector("circle[r='8.4']") };
    });
    await new Promise((f) => setTimeout(f, 4000));
    return aus;
  };
  /* Erst die Buehne bauen, DANN messen: ohne diesen Aufruf gibt es
     noch gar keine Plaetze, und die Messung sucht eine leere Liste ab. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* Die Plaetze der Pruefbuehne — nur die mit einer Nummer: im
     echten Raum stehen weitere .lc-platz ohne data-lc-platz, und ohne
     diesen Filter sucht die Messung einen Platz, den es nicht gibt. */
  const gitter = await pg.evaluate(() =>
    [...document.querySelectorAll("#lcPlaetze .lc-platz")]
      .map((p) => { const r = p.getBoundingClientRect();
        return { nr: +p.dataset.lcPlatz, x: r.left + r.width / 2, y: r.top + r.height / 2 }; })
      .filter((g) => g.nr > 0));
  const nahBei = (bahn, nr) => { const g = gitter.find((q2) => q2.nr === nr);
    return Math.min(...bahn.map((p) => Math.hypot(p[0] - g.x, p[1] - g.y))); };

  const gerade = await froschBahn("8");
  sage(gerade && gerade.last && gerade.auge,
    "der Frosch traegt das Profilbild und hat sein Auge oben auf dem Kopf");
  /* RUNDE 88 — aus zwei beweglichen Teilen sind drei geworden: seit
     Xanders „Der Frosch hat vorne keine Fuesse" hat er auch ein
     FERNES Hinterbein, und die Schwimmpfote haengt als eigene Gruppe
     daran. Gezaehlt wird deshalb „mindestens zwei"; worauf es
     ankommt, ist ohnehin die Dauer: alle muessen im Takt der Spruenge
     laufen. */
  sage(gerade && gerade.beine[0] === 2 && gerade.beine[1] > 150 && gerade.beine[2] < 30,
    "zwei Hinterbeine mit Gelenken: gefaltet der Fuss nach vorn (>150°), gestreckt nach hinten (<30°)",
    gerade ? gerade.beine[0] + " Beine, Fuss " + gerade.beine[2].toFixed(0) + "°–" + gerade.beine[1].toFixed(0) + "°" : "-");
  const mitWeg = await froschBahn("1-6-7-8");
  const trefferM = [6, 7].map((nr) => nahBei(mitWeg.bahn, nr));
  const trefferO = [6, 7].map((nr) => nahBei(gerade.bahn, nr));
  sage(Math.max(...trefferM) < 12 && Math.max(...trefferO) > 25,
    "mit gemaltem Weg setzt er auf jeder Station auf",
    "mit Weg " + trefferM.map((x) => x.toFixed(1)).join(" / ")
    + " px, ohne Weg " + trefferO.map((x) => x.toFixed(1)).join(" / ") + " px");

  console.log("\nDer Zauberzylinder");
  /* =================================================================
     RUNDE 86 — AUS DEM ZYLINDER IST EIN ZAUBERER GEWORDEN
     -----------------------------------------------------------------
     XANDER: „ueber dem Positionsfeld, wo die Leute sitzen, soll ein
     etwas groesserer Zauberer sein, der denjenigen an seinen
     imaginaeren Hasenohren packt … und ihn in seinen Hut steckt …
     zeigt dem Publikum seinen Zylinder, dass er leer ist … stellt
     ihn dann ab auf der Flaeche, wo derjenige hinreisen will, und
     zieht ihn dort magisch wieder raus."
     Die alten Regeln pruefen zwei Huete und ein Kaninchen, die es so
     nicht mehr gibt. Geprueft wird jetzt die REIHENFOLGE des Tricks,
     denn die ist sein eigentlicher Wunsch — und die Groesse und Lage
     des Zauberers, um die er ausdruecklich gebeten hat. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("zylinder", "8", "Alex"));
  await new Promise((f) => setTimeout(f, 180));
  const trick = await pg.evaluate(() => {
    const z = document.querySelector(".lc-zauberer");
    const h = document.querySelector(".lc-zauberhut");
    const l = document.querySelector(".lc-zauber-last");
    const o = document.querySelector(".lc-zauber-ohren");
    if (!z || !h || !l || !o) return null;
    const reihe = document.getElementById("lcPlaetze").getBoundingClientRect();
    const alle = [...z.getAnimations(), ...h.getAnimations(),
                  ...l.getAnimations(), ...o.getAnimations()];
    alle.forEach((a) => a.pause());
    const dauer = z.getAnimations()[0].effect.getTiming().duration;
    const zr = z.getBoundingClientRect();
    const proben = [];
    for (let f = 0.04; f <= 0.98; f += 0.02) {
      alle.forEach((a) => { a.currentTime = dauer * f; });
      const hr = h.getBoundingClientRect(), lr = l.getBoundingClientRect();
      proben.push({ t: +f.toFixed(2),
        hut: [hr.left + hr.width / 2 - reihe.left, hr.top + hr.height / 2 - reihe.top],
        person: [lr.left + lr.width / 2 - reihe.left, lr.top + lr.height / 2 - reihe.top],
        deck: +getComputedStyle(l).opacity,
        ohren: +getComputedStyle(o).opacity });
    }
    const pl = [...document.querySelectorAll("#lcPlaetze .lc-platz")].map((p) => {
      const r = p.getBoundingClientRect();
      return { nr: +p.dataset.lcPlatz, x: r.left + r.width / 2 - reihe.left,
               y: r.top + r.height / 2 - reihe.top };
    });
    return { proben: proben, pl: pl, feld: [reihe.width, reihe.height],
             zauber: { x: zr.left + zr.width / 2 - reihe.left, breit: zr.width } };
  });
  if (!trick) { sage(false, "der Zauberer liess sich nicht messen"); }
  else {
    const p1 = trick.pl.find((p) => p.nr === 1), p8 = trick.pl.find((p) => p.nr === 8);
    const nah = (a, b) => Math.hypot(a[0] - b.x, a[1] - b.y);
    sage(Math.abs(trick.zauber.x - trick.feld[0] / 2) < 6,
      "der Zauberer steht mittig ueber dem Positionsfeld",
      "Mitte " + trick.zauber.x.toFixed(0) + " von " + (trick.feld[0] / 2).toFixed(0));
    sage(trick.zauber.breit > trick.feld[0] * 0.2 && trick.zauber.breit < trick.feld[0] * 0.45,
      "und ist relativ zum Feld bemessen, nicht fest",
      trick.zauber.breit.toFixed(0) + " px bei " + trick.feld[0].toFixed(0) + " px Feldbreite");
    /* Die Ohren wachsen, BEVOR die Person hochgezogen wird. */
    const ohrenAb = trick.proben.find((p) => p.ohren > 0.5);
    const hochAb = trick.proben.find((p) => p.deck > 0.5 && p.person[1] < p1.y - 12);
    sage(ohrenAb && hochAb && ohrenAb.t < hochAb.t,
      "erst wachsen die Hasenohren, dann wird gezogen",
      ohrenAb ? "Ohren ab " + ohrenAb.t + ", Zug ab " + (hochAb ? hochAb.t : "nie") : "keine Ohren");
    /* Die Person verschwindet, und zwar dort, wo der Hut ist. */
    const weg2 = trick.proben.find((p) => p.t > 0.3 && p.deck < 0.1);
    sage(weg2 && nah(weg2.hut, { x: p1.x, y: p1.y }) < 120,
      "sie verschwindet im Hut ueber ihrem eigenen Platz",
      weg2 ? "bei t=" + weg2.t : "sie verschwindet nie");
    /* Dann wird der Hut gezeigt — er ist weit vom Startplatz weg und
       noch nicht am Ziel. */
    const zeigen = trick.proben.filter((p) => p.t > 0.4 && p.t < 0.62
      && nah(p.hut, p1) > 90 && nah(p.hut, p8) > 90);
    sage(zeigen.length >= 3, "dazwischen zeigt er den leeren Hut her",
      zeigen.length + " Proben");
    /* Und am Ziel steht der Hut, waehrend die Person herauskommt. */
    const raus = trick.proben.find((p) => p.t > 0.65 && p.deck > 0.5
      && p.person[1] < p8.y - 20);
    sage(raus && nah(raus.hut, p8) < 40,
      "am Ziel steht der Hut, und die Person kommt daraus hervor",
      raus ? "bei t=" + raus.t + ", Hut " + nah(raus.hut, p8).toFixed(0) + " px vom Platz"
           : "sie kommt nicht heraus");
    const ende2 = trick.proben[trick.proben.length - 1];
    sage(nah(ende2.person, p8) < 26, "und landet auf dem Zielplatz",
      nah(ende2.person, p8).toFixed(0) + " px daneben");
  }
  await new Promise((f) => setTimeout(f, 7000));

  /* --- Und die Befehle kommen an ---------------------------------- */
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/frosch:   \{ wirkung: "frosch"/.test(lc) && /zylinder: \{ wirkung: "zylinder"/.test(lc),
    "beide haben einen eigenen Befehl");
  /* RUNDE 98 — hier stand „art === \"frosch\")" mit Klammer dahinter.
     Die Klammer ist weg, seit hinter dem Frosch noch der Zylinder in
     derselben Aufzaehlung steht — der Frosch ist aber unveraendert
     dabei. Geprueft wird deshalb beides: dass er in der Aufzaehlung
     steht, die eine ZAHL hinter dem Befehl annimmt, und dass diese
     Aufzaehlung wirklich eine Kette von Platznummern liest.
     XANDER: „saemtliche Fahrzeuge sollen den Weg eingezeichnet
     bekommen." */
  const js2 = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/\|\| art === "frosch"/.test(lc)
    && /if \(\/\^\\d\+\(-\\d\+\)\+\$\/\.test\(kette\)\) \{/.test(js2),
    "und der Frosch nimmt auch den gemalten Weg an");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
