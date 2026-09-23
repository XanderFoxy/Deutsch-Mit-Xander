/* =====================================================================
   SONDE RUNDE 99 — DURCHGAENGIGE HAENDE, UND SECHS DAVON
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die von Gott und die Gorilla sind immer noch
   nicht durchgaengige Haende … Es koennen auch mehr Haende sein, eine
   Mann-Hand, eine Frauen-Hand."

   ZWEI FRAGEN WERDEN HIER BEANTWORTET, BEIDE MIT ZAHLEN:

   1. IST DIE HAND DURCHGAENGIG?
      „Durchgaengig" heisst nachpruefbar: ueber der Fuellung darf kein
      Umriss mehr liegen. Deshalb wird die Hand zweimal gezeichnet —
      erst die dunkle, etwas groessere Silhouette, dann die Fuellung
      darueber. Gemessen wird
        a) im Fuelldurchgang: wie viele Teile noch einen eigenen
           Umriss in der Kantenfarbe tragen (soll: 0),
        b) am BILD: wie viele dunkle Querlinien ein senkrechter
           Schnitt durch den Mittelfinger trifft — einmal mit der
           ALTEN Zeichnung und einmal mit der neuen. Das ist der
           eigentliche Beweis: derselbe Schnitt, zwei Fassungen.
      Dafuer laeuft der Messplatz zweimal: /app.js liefert beim
      zweiten Durchlauf die Sicherung von vor der Aenderung.

   2. SIND ES WIRKLICH SECHS VERSCHIEDENE HAENDE?
      Gemessen an dem, was eine Hand unterscheidet: Fingerbreite,
      Fingerlaenge und was an der Kuppe sitzt (Nagel, Lack, Kralle,
      Platte). Sechsmal dieselbe Hand in sechs Farben waere genau der
      „Trick 17", den er nicht will.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const ALT_APP = "/tmp/claude-0/app-vor-r99d.js";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

/* Die sechs Haende mit dem, was sie unterscheiden soll. */
const HAENDE = [
  { art: "gotteshand", wort: "Gott",      spitze: "nagel" },
  { art: "pranke",     wort: "King Kong", spitze: "nagel" },
  { art: "mannhand",   wort: "Mann",      spitze: "nagel" },
  { art: "frauenhand", wort: "Frau",      spitze: "lack" },
  { art: "hexenhand",  wort: "Hexe",      spitze: "kralle" },
  { art: "roboterhand",wort: "Android",   spitze: "platte" }
];

(async () => {
  console.log("RUNDE 99 — durchgaengige Haende, und sechs davon\n");
  let alteFassung = false;
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    /* Der Schalter fuer den Vorher-Nachher-Vergleich. */
    let f = (alteFassung && p === "/app.js" && fs.existsSync(ALT_APP))
      ? ALT_APP : path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) && f !== ALT_APP) { a.writeHead(404); return a.end(); }
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const hafen = srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  const neueSeite = async () => {
    const pg = await br.newPage({ viewport: { width: 900, height: 900 } });
    pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + hafen + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne
      && window.DMA_PRUEFUNG, { timeout: 25000 });
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.waitForTimeout(250);
    return pg;
  };

  /* Eine Hand ausloesen und die Bewegung an einer festen Stelle
     ANHALTEN — sonst misst man bei jedem Lauf etwas anderes. */
  const handStellen = async (pg, art, anteil) => {
    await pg.evaluate((a) => {
      document.querySelectorAll(".lc-riesenhand").forEach((e) => e.remove());
      window.DMA_PRUEFUNG.wirkung(a, 4, "Alex");
    }, art);
    await pg.waitForSelector(".lc-riesenhand-vorn", { timeout: 6000 });
    await pg.waitForTimeout(120);
    await pg.evaluate((t) => {
      document.getAnimations().forEach((an) => {
        try {
          const d = (an.effect && an.effect.getTiming().duration) || 0;
          if (d) { an.currentTime = d * t; an.pause(); }
        } catch (e) {}
      });
    }, anteil);
    await pg.waitForTimeout(80);
  };

  /* ---------------------------------------------------------------
     1  DER BAU: KEIN UMRISS UEBER DER FUELLUNG
     --------------------------------------------------------------- */
  console.log("1  DER BAU — liegt ueber der Fuellung noch ein Umriss?\n");
  const pg = await neueSeite();
  for (const h of HAENDE) {
    await handStellen(pg, h.art, 0.12);
    const m = await pg.evaluate(() => {
      const vorn = document.querySelector(".lc-riesenhand-vorn svg");
      const hint = document.querySelector(".lc-riesenhand:not(.lc-riesenhand-vorn) svg");
      if (!vorn || !hint) return null;
      const zaehl = (wurzel) => {
        const k = wurzel.querySelector(".lc-rh-kante");
        const f = wurzel.querySelector(".lc-rh-fuell");
        if (!k || !f) return null;
        /* Wie viele Teile im FUELLDURCHGANG tragen noch einen
           eigenen Umriss? Nur echte Umrisse zaehlen: Falten, Haare
           und Naegel sind Zeichnungen darauf, keine Kanten — sie
           sind durchsichtig oder duenner als 1,2. */
        const kantenFarben = {};
        k.querySelectorAll("[stroke]").forEach((e) => {
          kantenFarben[(e.getAttribute("stroke") || "").trim().toLowerCase()] = 1;
        });
        let nahtstriche = 0;
        f.querySelectorAll("[stroke]").forEach((e) => {
          const s = (e.getAttribute("stroke") || "").trim().toLowerCase();
          const w = parseFloat(e.getAttribute("stroke-width") || "1");
          if (kantenFarben[s] && w >= 1.2) nahtstriche++;
        });
        return {
          kanteTeile: k.querySelectorAll("path,rect,ellipse,circle").length,
          fuellTeile: f.querySelectorAll("path,rect,ellipse,circle").length,
          nahtstriche: nahtstriche,
          kanteVorFuell: !!(k.compareDocumentPosition(f)
            & Node.DOCUMENT_POSITION_FOLLOWING),
          gelenkeKante: k.querySelectorAll(".lc-rf-mcp,.lc-rf-pip,.lc-rf-dip,.lc-rd-cmc,.lc-rd-mcp").length,
          gelenkeFuell: f.querySelectorAll(".lc-rf-mcp,.lc-rf-pip,.lc-rf-dip,.lc-rd-cmc,.lc-rd-mcp").length
        };
      };
      const v = zaehl(vorn), r = zaehl(hint);
      /* Bewegen sich BEIDE Durchgaenge gleich? Gemessen an den
         Mittelpunkten des Mittelfingers in beiden Gruppen. */
      let versatz = -1;
      try {
        const a = vorn.querySelector('.lc-rh-kante .lc-rf-dip[data-rf="1"]');
        const b = vorn.querySelector('.lc-rh-fuell .lc-rf-dip[data-rf="1"]');
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        versatz = Math.round(Math.hypot((ra.left + ra.width / 2) - (rb.left + rb.width / 2),
          (ra.top + ra.height / 2) - (rb.top + rb.height / 2)) * 10) / 10;
      } catch (e) {}
      return { vorn: v, hinten: r, versatz: versatz };
    });
    if (!m || !m.vorn || !m.hinten) { sage(false, h.wort + ": Hand gar nicht gefunden"); continue; }
    sage(m.vorn.nahtstriche === 0 && m.hinten.nahtstriche === 0,
      h.wort + ": kein eigener Umriss ueber der Fuellung",
      "vorn " + m.vorn.nahtstriche + ", hinten " + m.hinten.nahtstriche + " Nahtstriche");
    sage(m.vorn.kanteVorFuell && m.hinten.kanteVorFuell,
      h.wort + ": die dunkle Silhouette liegt UNTER der Fuellung");
    sage(m.vorn.gelenkeKante === m.vorn.gelenkeFuell && m.vorn.gelenkeKante >= 12,
      h.wort + ": beide Durchgaenge haben dieselben Gelenke",
      m.vorn.gelenkeKante + " / " + m.vorn.gelenkeFuell);
    sage(m.versatz >= 0 && m.versatz <= 2.5,
      h.wort + ": Silhouette und Fuellung bewegen sich gemeinsam",
      m.versatz + " px Versatz");
  }

  /* ---------------------------------------------------------------
     2  SECHS HAENDE, NICHT SECHS FARBEN
     --------------------------------------------------------------- */
  console.log("\n2  SIND ES WIRKLICH SECHS VERSCHIEDENE HAENDE?\n");
  const masse = {};
  for (const h of HAENDE) {
    await handStellen(pg, h.art, 0.12);
    masse[h.art] = await pg.evaluate(() => {
      const f = document.querySelector(".lc-riesenhand-vorn .lc-rh-fuell");
      /* NUR DAS GLIED messen, nicht die Gruppe: die Gruppe enthaelt
         bei der Hexe auch die Kralle, und dann waere eine duenne Hand
         ploetzlich die breiteste. Gemessen wurde das: Gruppe 30,7 px,
         Glied allein 23,3 px. */
      const grund = f.querySelector('.lc-rf-mcp[data-rf="1"] > path');
      const kuppe = f.querySelector('.lc-rf-dip[data-rf="1"] > path');
      const r = grund.getBoundingClientRect();
      const rk = kuppe.getBoundingClientRect();
      return {
        breite: Math.round(r.width * 10) / 10,
        laenge: Math.round((rk.bottom - r.top) * 10) / 10,
        naegel: f.querySelectorAll(".lc-rhand-nagel").length,
        lack: f.querySelectorAll(".lc-rhand-lack").length,
        krallen: f.querySelectorAll(".lc-rhand-kralle").length,
        platten: f.querySelectorAll(".lc-rhand-platte").length,
        warzen: document.querySelectorAll(".lc-rhand-warzen circle").length
      };
    });
  }
  HAENDE.forEach((h) => {
    const m = masse[h.art];
    const passt = h.spitze === "lack" ? (m.lack === 4)
      : h.spitze === "kralle" ? (m.krallen === 4)
      : h.spitze === "platte" ? (m.platten === 4)
      : (m.naegel === 4 && m.lack === 0);
    sage(passt, h.wort + ": an jeder der vier Kuppen sitzt " + h.spitze,
      "Nagel " + m.naegel + ", Lack " + m.lack + ", Kralle " + m.krallen
      + ", Platte " + m.platten);
  });
  sage(masse.frauenhand.breite < masse.gotteshand.breite
    && masse.gotteshand.breite < masse.mannhand.breite,
    "Frauenhand schmaler als Gotteshand, Mannhand breiter",
    masse.frauenhand.breite + " < " + masse.gotteshand.breite
    + " < " + masse.mannhand.breite + " px");
  sage(masse.hexenhand.breite < masse.frauenhand.breite
    && masse.hexenhand.laenge > masse.gotteshand.laenge,
    "Hexenhand: duennere und laengere Finger",
    masse.hexenhand.breite + " px breit, " + masse.hexenhand.laenge + " px lang"
    + " (Gott: " + masse.gotteshand.breite + " / " + masse.gotteshand.laenge + ")");
  sage(masse.hexenhand.warzen === 3, "Die Hexe hat drei Warzen",
    masse.hexenhand.warzen + "");
  sage(masse.gotteshand.warzen === 0, "Die Gotteshand hat keine",
    masse.gotteshand.warzen + "");

  /* ---------------------------------------------------------------
     3  DAS BILD ENTSCHEIDET — VORHER UND NACHHER AM SELBEN SCHNITT
     ---------------------------------------------------------------
     Gezaehlt werden die DUNKLEN PUNKTE INNERHALB des Mittelfingers:
     fuer jede Bildzeile die beiden Aussenkanten suchen und dann
     zaehlen, was zwischen ihnen noch dunkel ist — drei Punkte
     Sicherheitsabstand zu jeder Kante, damit die Silhouette selbst
     nicht mitgezaehlt wird. Was da uebrig bleibt, ist genau das, was
     er „Module" nennt: Umrisse MITTEN im Finger.
     Gemessen wird zweimal dieselbe Stelle, einmal mit der gesicherten
     alten Zeichnung (/tmp/claude-0/app-vor-r99d.js) und einmal mit
     der neuen.
     --------------------------------------------------------------- */
  console.log("\n3  DUNKLE PUNKTE MITTEN IM MITTELFINGER — ALT GEGEN NEU\n");
  const schnitt = async (seite) => {
    await handStellen(seite, "gotteshand", 0.12);
    /* Die Hand faehrt durchs Bild; bei 12 % steht sie hoch ueber dem
       Platz und haengt halb aus dem Fenster. Fuer die Messung wird
       deshalb NUR ihre Fahrt abgebrochen — die Finger bleiben genau
       dort stehen, wo sie gerade sind. */
    const kasten = await seite.evaluate(() => {
      document.querySelectorAll(".lc-riesenhand").forEach((h) => {
        h.getAnimations().forEach((a) => { try { a.cancel(); } catch (e) {} });
        h.style.left = "320px";
        h.style.top = "430px";
        h.style.transform = "translate(-50%, -50%)";
        h.style.opacity = "1";
      });
      const s = document.querySelector(".lc-riesenhand-vorn svg");
      const r = s.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    });
    if (!kasten.w || !kasten.h) return null;
    const png = "/tmp/claude-0/r99-hand.png";
    await seite.screenshot({ path: png, clip: { x: kasten.x, y: kasten.y,
      width: kasten.w, height: kasten.h } });
    const pgm = "/tmp/claude-0/r99-hand.pgm";
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", png, "-pix_fmt", "gray", pgm]);
    /* PGM einlesen: P5, Breite Hoehe, Maximalwert, dann die Bytes. */
    const roh = fs.readFileSync(pgm);
    let pos = 0; const felder = [];
    while (felder.length < 4) {
      let t = "";
      while (roh[pos] === 32 || roh[pos] === 10 || roh[pos] === 13 || roh[pos] === 9) pos++;
      if (roh[pos] === 35) { while (roh[pos] !== 10) pos++; continue; }
      while (pos < roh.length && roh[pos] > 32) { t += String.fromCharCode(roh[pos]); pos++; }
      felder.push(t);
    }
    pos++;
    const bw = parseInt(felder[1], 10), bh = parseInt(felder[2], 10);
    const sx = (x) => Math.round(bw * x / 120), sy = (y) => Math.round(bh * y / 150);
    const werte = [];
    for (let y = sy(92); y < sy(138); y++)
      for (let x = sx(54); x < sx(65); x++) werte.push(roh[pos + y * bw + x]);
    werte.sort((p, q) => p - q);
    const haut = werte[Math.floor(werte.length / 2)];
    const schwelle = haut - 45;
    let innen = 0, zeilen = 0;
    for (let y = sy(92); y < sy(138); y++) {
      let erst = -1, letzt = -1;
      for (let x = sx(52); x < sx(67); x++) {
        if (roh[pos + y * bw + x] < schwelle) { if (erst < 0) erst = x; letzt = x; }
      }
      if (erst < 0 || letzt - erst < 8) continue;
      zeilen++;
      for (let x = erst + 3; x <= letzt - 3; x++) if (roh[pos + y * bw + x] < schwelle) innen++;
    }
    return { innen: innen, zeilen: zeilen, haut: haut };
  };

  const jetzt = await schnitt(pg);
  await pg.close();

  alteFassung = true;
  const pgAlt = await neueSeite();
  const vorher = await schnitt(pgAlt);
  await pgAlt.close();
  alteFassung = false;

  if (!jetzt || !vorher) {
    sage(false, "Der Schnitt liess sich nicht messen");
  } else {
    console.log("     ALT   " + vorher.innen + " dunkle Punkte mitten im Finger"
      + "  (" + vorher.zeilen + " Zeilen, Haut " + vorher.haut + ")");
    console.log("     NEU   " + jetzt.innen + " dunkle Punkte mitten im Finger"
      + "  (" + jetzt.zeilen + " Zeilen, Haut " + jetzt.haut + ")");
    sage(vorher.innen >= 18,
      "Die ALTE Zeichnung hatte mitten im Finger wirklich Umrisse",
      vorher.innen + " Punkte");
    sage(jetzt.innen <= vorher.innen / 2,
      "Die NEUE hat dort weniger als die Haelfte",
      jetzt.innen + " statt " + vorher.innen + " Punkte");
    /* Was uebrig bleibt, sind die beiden Gelenkfalten — die SOLLEN
       da sein. Eine Hand ohne Falten ist ein Schlauch. */
    sage(jetzt.innen >= 4,
      "Die Gelenkfalten sind trotzdem noch zu sehen",
      jetzt.innen + " Punkte — das sind die beiden Falten");
  }

  /* ---------------------------------------------------------------
     4  SIE GREIFT VON DER SEITE ZU
     ---------------------------------------------------------------
     XANDER: „Die Hand kann auch seitlich zugreifen, schraeg."
     Gemessen wird der Drehwinkel der Hand (aus ihrer Matrix) und ihr
     seitlicher Abstand zum Platz, ueber den ganzen Lauf verteilt.
     Erwartet: beim Herunterkommen deutlich schraeg und seitlich
     versetzt, beim Tragen wieder gerade — sonst haenge das Bild
     schief in der Hand.
     --------------------------------------------------------------- */
  console.log("\n4  KOMMT SIE SCHRAEG VON DER SEITE?\n");
  const pgS = await neueSeite();
  await pgS.evaluate(() => {
    document.querySelectorAll(".lc-riesenhand").forEach((e) => e.remove());
    window.DMA_PRUEFUNG.wirkung("gotteshand", 4, "Alex");
  });
  await pgS.waitForSelector(".lc-riesenhand-vorn", { timeout: 6000 });
  await pgS.waitForTimeout(120);
  const bahn = [];
  for (let k = 0; k <= 40; k++) {
    const t = k / 40;
    const p = await pgS.evaluate((tt) => {
      document.getAnimations().forEach((an) => {
        try {
          const d = an.effect && an.effect.getTiming().duration;
          if (d) { an.currentTime = d * tt; an.pause(); }
        } catch (e) {}
      });
      const h = document.querySelector(".lc-riesenhand:not(.lc-riesenhand-vorn)");
      if (!h) return null;
      const m = new DOMMatrixReadOnly(getComputedStyle(h).transform);
      const winkel = Math.atan2(m.b, m.a) * 180 / Math.PI;
      const rh = h.getBoundingClientRect();
      const platz = document.querySelectorAll("#lcPlaetze .lc-platz")[0];
      const rp = platz.getBoundingClientRect();
      return {
        winkel: Math.round(winkel * 10) / 10,
        quer: Math.round(((rh.left + rh.width / 2) - (rp.left + rp.width / 2)) * 10) / 10,
        platzBreit: Math.round(rp.width)
      };
    }, t);
    if (p) bahn.push(Object.assign({ t: t }, p));
  }
  await pgS.close();
  if (bahn.length < 30) {
    sage(false, "Die Bahn der Hand liess sich nicht abtasten", bahn.length + " Punkte");
  } else {
    const fruh = bahn.filter((p) => p.t <= 0.16);
    const mitte = bahn.filter((p) => p.t >= 0.42 && p.t <= 0.60);
    const maxWinkel = Math.max.apply(null, fruh.map((p) => Math.abs(p.winkel)));
    const maxQuer = Math.max.apply(null, fruh.map((p) => Math.abs(p.quer)));
    const mittelWinkel = Math.max.apply(null, mitte.map((p) => Math.abs(p.winkel)));
    const breit = bahn[0].platzBreit;
    sage(maxWinkel >= 18, "Beim Herunterkommen steht sie schraeg",
      maxWinkel.toFixed(1) + " Grad");
    sage(maxQuer >= breit * 0.5, "Und sie kommt wirklich von der SEITE",
      maxQuer.toFixed(0) + " px neben dem Platz (Platz " + breit + " px breit)");
    sage(mittelWinkel <= 10, "Beim Tragen haengt das Bild nicht schief",
      mittelWinkel.toFixed(1) + " Grad");
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
