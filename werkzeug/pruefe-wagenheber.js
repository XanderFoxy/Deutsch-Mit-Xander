#!/usr/bin/env node
/* =========================================================
   JEMANDEN AUF EINEN ANDEREN PLATZ SETZEN
   ---------------------------------------------------------
   GEWUENSCHT: „Mal so ein Wagenheber-Effekt, wenn jemand
   unten ist … man kann den anderen irgendwie auf einen
   anderen Sitzplatz ziehen. Von unten nach oben waere es
   dann so ein Heber, von rechts nach links waere so ein
   Lasso … und das System soll dann erkennen, welche Plaetze
   hebelbar sind."

   UND DIE REGEL, DIE ER AUSDRUECKLICH GENANNT HAT:
   „Wenn ich auf Platz 1 bin, dann kann man den nicht vom
    Platz 5 zu Platz 1 heben, sondern nur aus der Position,
    wo man selber sich nicht befindet."

   Gemessen wird an einer nachgestellten Sitzordnung:
   1. Ohne Nummer zaehlt der Befehl die moeglichen Plaetze
      auf — und laesst den eigenen weg.
   2. Auf den eigenen Platz wird niemand gehoben; die Absage
      sagt, warum.
   3. Nach oben ist es ein Heber, zur Seite ein Lasso.
   4. Die neue Sitzordnung geht wirklich hinaus.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

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
  const pg = await br.newPage({ viewport: { width: 420, height: 800 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz, { timeout: 20000 });

  /* Eine Sitzordnung nachstellen. Wichtig: es muessen genug Leute
     sein, damit jemand in der ZWEITEN Reihe sitzt — sonst gaebe es
     nichts zu heben, und die halbe Pruefung liefe ins Leere.
     Die Reihenfolge kommt aus „seit": wer zuerst da war, sitzt vorn.
     Ich selbst sitze also auf 1, Emmi auf 5. */
  const sitz = await pg.evaluate(() => {
    const leute = {};
    ["Bea", "Cem", "Dana"].forEach((n, i) => {
      leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 };
    });
    leute.e1 = { id: "e1", name: "Emmi", seit: 9000 };
    const s = window.LiveChat.pruefSitz({
      lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: leute
    });
    return (s.plaetze || []).filter((p) => !p.leer).map((p) => p.nummer + ":" + p.name);
  });
  pruefe("die Sitzordnung steht", sitz.length === 5, sitz.join("  "));

  console.log("\nOHNE NUMMER: WELCHE PLAETZE GEHEN?\n");
  const liste = await pg.evaluate(() => {
    window.LiveChat.pruefBefehl("/heb Emmi");
    return (window.LiveChat.pruefZeilen(2) || []).join("\n");
  });
  pruefe("er zaehlt die moeglichen Plaetze auf", /Diese Pl(ae|ä)tze gehen/.test(liste),
    liste.split("\n").pop().slice(0, 80));
  /* Wer sitzt wo? Nicht raten — ablesen. */
  const wo = {};
  sitz.forEach((x) => { const [n, name] = x.split(":"); wo[name] = +n; });
  const meinPlatz = wo["Alex"];
  const ihrPlatz = wo["Emmi"];
  pruefe("der eigene Platz steht NICHT dabei",
    liste.indexOf(" " + meinPlatz + " (") < 0 && liste.indexOf("  " + meinPlatz + " (") < 0,
    "eigener Platz ist " + meinPlatz + ", Emmi sitzt auf " + ihrPlatz);

  console.log("\nAUF DEN EIGENEN PLATZ GEHT NICHT\n");
  const absage = await pg.evaluate((n) => {
    window.LiveChat.pruefBefehl("/heb Emmi " + n);
    return (window.LiveChat.pruefZeilen(1) || []).join("\n");
  }, meinPlatz);
  pruefe("die Absage kommt", /eigenen Platz/.test(absage), absage.slice(0, 90));

  console.log("\nHEBER UND LASSO\n");
  /* Die Reihe ergibt sich aus der Nummer: vier Plaetze je Reihe.
     Hier wird sie unabhaengig noch einmal gerechnet, damit die Sonde
     nicht einfach dasselbe glaubt wie der Code. */
  const reihe = (n) => Math.ceil(n / 4);
  const suchZiel = (wollenHoeher) => {
    for (let n = 1; n <= 8; n++) {
      if (n === meinPlatz || n === ihrPlatz) continue;
      if (wollenHoeher ? reihe(n) < reihe(ihrPlatz) : reihe(n) >= reihe(ihrPlatz)) return n;
    }
    return 0;
  };
  /* ACHTUNG: der Befehl schickt ZWEI Pakete — erst die neue
     Sitzordnung, dann die Zeile mit der Animation. Wer nur das erste
     nimmt, findet nie eine Wirkung und haelt es fuer kaputt. */
  const schicken = (n) => pg.evaluate((z) => {
    const alle = [];
    window.LiveChat.pruefPost((p) => alle.push(p));
    window.LiveChat.pruefBefehl("/heb Emmi " + z);
    return alle.find((p) => p && p.wirkung) || alle[alle.length - 1] || null;
  }, n);

  const zielHoch = suchZiel(true);
  if (zielHoch) {
    const hoch = await schicken(zielHoch);
    pruefe("nach oben ist es ein HEBER",
      Boolean(hoch) && hoch.wirkung === "heber",
      "Platz " + ihrPlatz + " \u2192 " + zielHoch + ": "
        + (hoch ? (hoch.wirkung || "-") : "nichts abgefangen"));
    pruefe("und es steht dabei, wen es meint", Boolean(hoch && hoch.wen === "Emmi"),
      hoch ? "wen=" + (hoch.wen || "FEHLT") : "-");
  } else {
    /* Sitzt die Person schon oben, gibt es nichts zu heben — dann
       wird diese Haelfte ehrlich uebersprungen statt gruen gemeldet. */
    console.log("  --   kein Platz weiter oben frei (Emmi sitzt in Reihe "
      + reihe(ihrPlatz) + ") — Heber hier nicht pruefbar");
  }
  const zielQuer = suchZiel(false);
  const quer = await schicken(zielQuer);
  pruefe("in derselben Reihe oder tiefer ist es ein LASSO",
    Boolean(quer) && quer.wirkung === "lasso",
    "Platz \u2192 " + zielQuer + ": " + (quer ? (quer.wirkung || "-") : "nichts abgefangen"));
  pruefe("die neue Sitzordnung geht hinaus", Boolean(quer && /Platz/.test(String(quer.text || ""))),
    quer ? String(quer.text || "") : "-");

  console.log("\nUND DIE ZEICHNUNGEN?\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  for (const [art, klasse] of [["heber", "lc-heber"], ["lasso", "lc-lasso"]]) {
    const d = await pg.evaluate(async (a) => {
      document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(a, "Emmi");
      await new Promise((f) => setTimeout(f, 160));
      const sch = document.querySelector(".lc-zp");
      /* Den Kreis nehmen, an dem die Schicht wirklich haengt — nicht
         irgendeinen. Sonst misst man den Nachbarplatz. */
      const kreis = sch ? sch.closest(".lc-kreis") : null;
      return { klassen: sch ? sch.className : "",
        bewegt: kreis ? getComputedStyle(kreis).animationName : "none" };
    }, art);
    pruefe(art + " wird gezeichnet", String(d.klassen).indexOf(klasse) >= 0, d.klassen || "nichts");
    pruefe(art + " bewegt das Profilbild", d.bewegt !== "none", d.bewegt);
  }

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Heber und Lasso setzen um, wen sie duerfen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
