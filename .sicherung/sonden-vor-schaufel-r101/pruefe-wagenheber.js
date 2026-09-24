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
  const schicken = (n, befehl) => pg.evaluate(([z, b]) => {
    const alle = [];
    window.LiveChat.pruefPost((p) => alle.push(p));
    window.LiveChat.pruefBefehl((b || "/heb") + " Emmi " + z);
    return alle.find((p) => p && p.wirkung) || alle[alle.length - 1] || null;
  }, [n, befehl]);

  /* RUNDE 75 — HIER STAND DIE ALTE REGEL, UND SIE IST ÜBERHOLT.
     ------------------------------------------------------------------
     Bis Runde 73 entschied die SITZREIHE, ob aus „/heb" ein Heber oder
     ein Lasso wurde: nach oben heben, in derselben Reihe oder tiefer
     zu sich ziehen. Diese Sonde hat genau das festgeschrieben.

     XANDER in Runde 74: „Der Angelhaken funktioniert immer noch nicht
     unabhängig vom Lasso … Das sollen zwei unterschiedliche Dinge
     sein. Mit dem Angelhaken soll ich jeden Menschen an eine
     x-beliebige Stelle hin angeln können, und mit dem Lasso soll ich
     den einfach nur zu mir ranziehen."

     Damit darf die Sitzreihe gar nichts mehr entscheiden. „/heb" ist
     IMMER der Heber (die Angel, an einen beliebigen Platz), „/lasso"
     ist IMMER das Lasso (zu mir). Genau das wird jetzt gemessen — und
     zwar an beiden Zielen, dem höheren und dem tieferen, damit die
     Unabhängigkeit von der Reihe wirklich belegt ist. */
  const zielHoch = suchZiel(true);
  if (zielHoch) {
    const hoch = await schicken(zielHoch);
    pruefe("nach oben ist „/heb\u201c ein HEBER",
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
  pruefe("und in derselben Reihe oder tiefer AUCH — die Reihe entscheidet nichts mehr",
    Boolean(quer) && quer.wirkung === "heber",
    "Platz \u2192 " + zielQuer + ": " + (quer ? (quer.wirkung || "-") : "nichts abgefangen"));
  /* Und die Gegenprobe: „/lasso" ist immer ein Lasso. Es bekommt
     KEINE Platznummer — es zieht ja zu mir, das Ziel steht damit
     schon fest. Genau darin liegt der Unterschied zur Angel. */
  const lasso = await pg.evaluate(() => {
    const alle = [];
    window.LiveChat.pruefPost((p) => alle.push(p));
    window.LiveChat.pruefBefehl("/lasso Emmi");
    return alle.find((p) => p && p.wirkung) || alle[alle.length - 1] || null;
  });
  pruefe("„/lasso\u201c bleibt ein LASSO und zieht zu mir",
    Boolean(lasso) && lasso.wirkung === "lasso",
    lasso ? (lasso.wirkung || "-") : "nichts abgefangen");
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
      /* Den Kreis nehmen, der zu DIESER Schicht gehoert — nicht
         irgendeinen. Sonst misst man den Nachbarplatz.
         Frueher stand hier closest(".lc-kreis"), weil die Schicht IM
         Kreis hing. Seit Fassung 345 haengt sie am Platz: der Kreis
         schnitt alles ab, was ueber das Profilbild hinausragt (vom
         Hammer blieben 64 %, vom Eimer 33 %). Der Weg zum Kreis geht
         deshalb jetzt ueber den Platz. */
      const platz = sch ? sch.closest(".lc-platz") : null;
      const kreis = platz ? platz.querySelector(".lc-kreis") : null;
      /* RUNDE 99: die Angel bewegt das Bild mit animate() (Wurf, Biss,
         Einholen) statt mit einer CSS-Klasse — beides zaehlt. */
      const lauf = kreis && kreis.getAnimations
        ? kreis.getAnimations().filter((x) => !(x instanceof CSSAnimation)).length : 0;
      const css = kreis ? getComputedStyle(kreis).animationName : "none";
      return { klassen: sch ? sch.className : "",
        bewegt: css !== "none" ? css : (lauf ? lauf + " Bewegung(en) per animate()" : "none") };
    }, art);
    pruefe(art + " wird gezeichnet", String(d.klassen).indexOf(klasse) >= 0, d.klassen || "nichts");
    pruefe(art + " bewegt das Profilbild", d.bewegt !== "none", d.bewegt);
  }

  /* =========================================================
     UND DER WEG OHNE TIPPEN
     ---------------------------------------------------------
     GEMELDET: „Das mit dem Haken funktioniert auch noch nicht.
     Man kann jemand nicht auf einen anderen Profilplatz neben
     sich ziehen … das muss moeglich sein, den anderen dann zu
     sich heranzuziehen."

     Moeglich WAR es — nur zeigte der Menueknopf bloss die Liste
     der Plaetze an, und die Nummer musste man danach selbst
     tippen. Jetzt klappt eine Kachelwand auf, ein Tipp setzt um,
     und ganz vorn steht „Zu mir". Genau das wird hier gemessen.
     ========================================================= */
  console.log("\nUMSETZEN OHNE TIPPEN\n");
  const menue = await pg.evaluate(async () => {
    /* Die Buehne der Sonde zeichnet nur die BELEGTEN Plaetze. Im
       echten Raum stehen immer acht da, auch die freien — und genau
       die braucht das Umsetzen. Drei kommen deshalb hier dazu.

       NACHGEBESSERT: hier standen die Nummern 3, 4, 5. Seit die
       Pruefbuehne fuenf Plaetze hat, sind das GENAU die Nummern von
       Cem, Dana und Emmi — es gab jede Nummer doppelt, und die Wahl
       der Zielplaetze fand deshalb nichts mehr („0 Plaetze"). Die
       freien Plaetze bekommen jetzt die Nummern, die noch frei sind.
       Zur Sicherheit wird das nicht geraten, sondern nachgesehen. */
    const reihe = document.querySelector("#lcPlaetze") || document.querySelector(".lc-plaetze");
    if (reihe && reihe.querySelectorAll(".lc-platz-frei").length === 0) {
      const belegt = new Set([...reihe.querySelectorAll(".lc-platz")]
        .map((b) => b.dataset.lcPlatz).filter(Boolean));
      const frei = [];
      for (let n = 1; n <= 8 && frei.length < 3; n++) {
        if (!belegt.has(String(n))) frei.push(n);
      }
      frei.forEach((n) => {
        const f = document.createElement("button");
        f.type = "button";
        f.className = "lc-platz lc-platz-frei";
        f.dataset.lcPlatz = String(n);
        f.innerHTML = '<span class="lc-kreis"></span><span class="lc-platz-name">frei</span>';
        reihe.appendChild(f);
      });
    }
    const plaetze = [...document.querySelectorAll(".lc-platz")];
    const meiner = plaetze[0], seiner = plaetze[1];
    if (!meiner || !seiner) return { zuWenig: true };
    if (!meiner.dataset.lcPlatz) meiner.dataset.lcPlatz = "1";
    if (!seiner.dataset.lcPlatz) seiner.dataset.lcPlatz = "2";
    meiner.classList.add("lc-platz-ich");
    window.DMA_PRUEFUNG.platzMenue(seiner);
    /* RUNDE 98 — DIE ANGEL LIEGT JETZT EINE EBENE TIEFER.
       XANDER: „Dann haette ich gerne den Kran dafuer, dass man jemand
       anderen noch auf einen Platz heben kann und repariere noch das
       Lasso und die Angel."
       Seitdem gibt es drei Werkzeuge zum Holen (Angel, Lasso, Kran),
       und sie stehen zusammen unter der Kachel „Holen" — sonst waere
       das Platzmenue noch eine Zeile laenger geworden. Diese Sonde
       hat danach „keine Kachel" gemeldet: sie suchte die Angel noch
       ganz oben. Also wird jetzt erst „Holen" geoeffnet. */
    const oben = document.getElementById("lcPlatzMenue");
    const holen = oben ? [...oben.querySelectorAll(".lc-platzmenue-knopf")]
      /* Gesucht wird das WORT der Kachel, nicht ihr ganzer Text: davor
         steht noch das Zeichen (🪝), und mit dem passt kein „^Holen$". */
      .filter((b) => /^Holen$/i.test(
        ((b.querySelector(".lc-platzmenue-wort") || {}).textContent || "").trim()))[0] : null;
    if (holen) {
      holen.click();
      await new Promise((f) => setTimeout(f, 140));
    }
    const k = document.getElementById("lcPlatzMenue");
    const um = k ? [...k.querySelectorAll(".lc-platzmenue-knopf")]
      /* NACHGEZOGEN IN RUNDE 22 — die Sache hat sich geaendert:
         GEMELDET: „Es springt immer zwischen Angeln und Lasso hin und
         her." Aus dem einen Knopf „Holen", der je nach Sitzordnung
         mal so und mal so hiess, sind ZWEI Werkzeuge geworden:
         „Angeln" fragt, wohin; „Lasso" zieht sofort zu mir. Gesucht
         wird deshalb die Angel — sie ist die mit der Platzliste. */
      .filter((b) => /Angeln/i.test(b.textContent))[0] : null;
    if (!um) return { keinKnopf: true };
    um.click();
    await new Promise((f) => setTimeout(f, 140));
    const m = document.getElementById("lcPlatzMenue");
    if (!m) return { keinMenue: true };
    const woerter = [...m.querySelectorAll(".lc-platzmenue-wort")].map((x) => x.textContent);
    /* RUNDE 100 — die Plaetze stehen jetzt als Abbild der Buehne da
       (.lc-hebenwahl), mit Nummer und Name statt „Platz N". */
    const wahlbar = m.querySelectorAll(".lc-hebenwahl-platz:not(:disabled)").length;
    /* „Zu mir" antippen und nachsehen, WAS dabei hinausgeht. */
    /* ALLE Pakete einsammeln, nicht nur das erste: beim Umsetzen gehen
       zwei hinaus — die neue Sitzordnung und die Zeile mit der
       Animation. Das erste ist die Sitzordnung und traegt keine
       Wirkung; gesucht ist die Zeile. */
    const alle = [];
    window.LiveChat.pruefPost((p) => alle.push(p));
    /* Die erste Kachel im Angel-Menue schlaegt den naechsten freien
       Platz vor; sie heisst jetzt immer „Angeln". */
    const zuMir = [...m.querySelectorAll(".lc-platzmenue-knopf")]
      .filter((b) => /Angeln/i.test(b.textContent))[0];
    if (zuMir) zuMir.click();
    await new Promise((f) => setTimeout(f, 160));
    const mitWirkung = alle.filter((p) => p && /heber|lasso/.test(String(p.wirkung || "")))[0]
                    || alle.filter((p) => /hebt|zieht/.test(String(p.text || "")))[0] || null;
    return { woerter: woerter, wahlbar: wahlbar, kopf: (m.querySelector(".lc-platzmenue-kopf") || {}).textContent || "",
             paket: mitWirkung ? { wirkung: mitWirkung.wirkung || "", text: String(mitWirkung.text || "") } : null,
             wieviele: alle.length,
             zu: !document.getElementById("lcPlatzMenue") };
  });
  pruefe("bei einem fremden Platz gibt es die Angel",
    !menue.keinKnopf && !menue.keinMenue,
    menue.keinKnopf ? "keine Kachel" : (menue.keinMenue ? "kein Menue" : menue.kopf));
  pruefe("und ganz vorn steht der vorgeschlagene Platz",
    Array.isArray(menue.woerter) && /Angeln/i.test(menue.woerter[0] || ""),
    (menue.woerter || []).slice(0, 4).join(", "));
  pruefe("es stehen auch die einzelnen Plaetze zur Wahl",
    (menue.wahlbar || 0) >= 2, (menue.wahlbar || 0) + " Plaetze");
  pruefe("ein Tipp setzt wirklich um, ohne dass man tippt",
    Boolean(menue.paket) && /hebt|zieht/.test(menue.paket.text),
    menue.paket ? (menue.paket.wirkung || "ohne Wirkung") + " · " + menue.paket.text.slice(0, 60)
                : "nichts abgefangen (" + menue.wieviele + " Pakete)");
  pruefe("und das Menue geht danach zu", menue.zu === true, String(menue.zu));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Heber und Lasso setzen um, wen sie duerfen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
