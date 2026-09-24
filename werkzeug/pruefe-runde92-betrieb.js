#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 92 — RUECKSTAENDE, WENN DER BETRIEB DAZWISCHENFUNKT
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Rueckstaende in Animationen sind immer
   noch, wenn man den Platz verlaesst."

   WARUM DIE BISHERIGEN SONDEN DAS NICHT GEFUNDEN HABEN: sie loesen
   einen Effekt aus und sehen ihm zu. Im Klassenzimmer passiert
   waehrenddessen aber staendig etwas anderes:
     · eine Praesenzmeldung kommt an  -> livechatPlaetzeAuffrischen()
     · jemand betritt/verlaesst, eine Nachricht kommt -> renderLiveChat()
   Beides greift mitten in eine laufende Animation. Genau dort entsteht
   das, was er sieht: ein Bild, das nicht zurueckkommt, eine Schicht,
   die liegenbleibt, eine Nummer, die fehlt.

   GEPRUEFT WIRD DESHALB JEDER EFFEKT DREIMAL:
     A) ungestoert,
     B) mit einem Auffrischen mitten in der Animation,
     C) mit einem kompletten Neuzeichnen mitten in der Animation.
   Und danach jedes Mal: liegt etwas herum, fehlt ein Bild, fehlt die
   Nummer, steht der Platz wieder wie vorher?
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg",
  ".m4a": "audio/mp4", ".webm": "video/webm" };

const NUR = process.argv[2] || "";
let fehler = 0;
const zeilen = [];

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

  const hebel = await pg.evaluate(() => ({
    auffrischen: typeof window.DMA_PRUEF.auffrischen === "function",
    neuZeichnen: typeof window.DMA_PRUEF.neuZeichnen === "function"
  }));
  if (!hebel.auffrischen || !hebel.neuZeichnen) {
    console.log("  FEHL die Sonde kann den Betrieb nicht nachstellen "
      + "(DMA_PRUEF.auffrischen/neuZeichnen fehlen)");
    await br.close(); srv.close(); process.exit(1);
  }

  const reisen = await pg.evaluate(() => window.DMA_PRUEF.reiseArten());
  const wirkungen = await pg.evaluate(() => window.DMA_PRUEF.platzWirkungen());
  /* RUNDE 101 — „ab:Name" setzt dort fort (der ganze Lauf dauert
     ueber 30 Minuten; so kann man ihn in Stuecken laufen lassen). */
  const ab = /^ab:/.test(NUR) ? NUR.slice(3) : "";
  let alle = [...new Set([...reisen, ...wirkungen])].filter((a) => !NUR || ab || a === NUR);
  if (ab) { const i = alle.indexOf(ab); alle = i >= 0 ? alle.slice(i) : alle; }
  console.log("\nRUNDE 92 — " + alle.length + " Effekte, jeder dreimal "
    + "(ungestoert / Auffrischen / Neuzeichnen)\n");

  const lauf = (art, stoerung) => pg.evaluate(async ([art, stoerung]) => {
    document.querySelectorAll(".lc-zp, .lc-reise, .lc-greif, .lc-riesenhand, .lc-flieger")
      .forEach((x) => x.remove());
    window.DMA_PRUEF.effektBuehne();
    /* =================================================================
       RUNDE 97 — WARUM HIER ERST AUFGEFRISCHT UND DANN GEZAEHLT WIRD
       -----------------------------------------------------------------
       Beim ersten vollstaendigen Durchlauf meldete diese Sonde ab dem
       Kopfhoerer bei JEDEM weiteren Effekt „38 Bausteine mehr" — und
       das war ein Fehler der SONDE, nicht des Klassenzimmers.
       Der Grund: vier Dinge bleiben ABSICHTLICH liegen, weil XANDER es
       so wollte — die Kopfhoerer („bis sie sie von selber abnimmt"),
       die Gluehbirne, die Kleidung und der Spruehlack („das geht nur
       durch den Scheibenwischer wieder weg"). Sie haengen an der
       PERSON und kommen nach jedem Neuaufbau der Buehne zurueck,
       sobald der Betrieb auffrischt. Die Sonde zaehlte sie dann als
       Rueckstand, weil ihr Vorher-Bild von der frisch gebauten Buehne
       stammte — also von einem Zustand, den es im Betrieb gar nicht
       gibt.
       Deshalb wird jetzt ERST aufgefrischt und DANN gezaehlt: das
       Vorher-Bild enthaelt, was bleiben darf. Was danach noch
       dazukommt, ist ein echter Rueckstand.
       ================================================================= */
    window.DMA_PRUEF.auffrischen();
    await new Promise((f) => setTimeout(f, 120));
    const reihe = document.getElementById("lcPlaetze");
    const vorher = reihe.querySelectorAll("*").length;
    window.DMA_PRUEFUNG.wirkung(art, "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 700));
    if (stoerung === "auffrischen") window.DMA_PRUEF.auffrischen();
    if (stoerung === "neuzeichnen") window.DMA_PRUEF.neuZeichnen();
    /* Bis deutlich hinter das Ende des laengsten Effekts (7,2 s). */
    await new Promise((f) => setTimeout(f, 8000));
    const reihe2 = document.getElementById("lcPlaetze");
    const plaetze = [...document.querySelectorAll(".lc-platz")];
    const schaden = [];
    if (!reihe2 || !plaetze.length) { schaden.push("die Sitzreihe ist weg"); return schaden; }
    /* 1. Liegt etwas herum, das vorher nicht da war?
       ABGEZOGEN WIRD, WAS ABSICHTLICH LIEGEN BLEIBT — und das ist
       jedes Mal sein eigener Wunsch:
         .lc-kopfhoerer  „sollen die Kopfhoerer auch so lange auf der
                          Person bleiben, bis sie sie von SELBER abnimmt"
         .lc-sprayfarbe  „dass es bleibt die ganze Zeit … es geht nur
                          durch den Scheibenwischer wieder weg"
         .lc-kleid       „was man jemandem aufsetzt, hat er an, bis es
                          jemand abnimmt"
         .lc-hschaden    der Hammerschaden: er bleibt 22 Sekunden und
                          waechst mit jedem Schlag („der Schaden soll
                          auch dann stimmen, wenn der Platz zwischen-
                          durch neu aufgebaut wurde"). Diese Sonde
                          wartet nur 8,7 s — der Schaden MUSS hier also
                          noch da sein. Dass er wieder heilt, misst
                          werkzeug/pruefe-runde86.js.
       Ohne diesen Abzug meldet die Sonde genau das als Fehler, was er
       ausdruecklich bestellt hat. */
    const bleibtErlaubt = [".lc-kopfhoerer", ".lc-sprayfarbe", ".lc-kleid", ".lc-hschaden",
      /* RUNDE 98 — das zerschlagene Bild und sein Scherbenhaufen
         bleiben ebenfalls absichtlich liegen, bis „/pflaster" kommt. */
      ".lc-zerschlagen", ".lc-scherbenhaufen",
      /* RUNDE 98 — UND DER DRECK BLEIBT AUCH LIEGEN.
         XANDER (23.09.2026): „saemtlicher Dreck, der erzeugt wird wie
         durch die Vogelkacke oder irgendwas anderes — das koennen wir
         wieder sauber putzen … dann ist es insgesamt viel witziger."
         Bis Runde 98 war Dreck ein Effekt, der von selbst wieder ging;
         genau das hat er abbestellt. Diese Sonde hat den Vogelkot
         danach als Rueckstand gemeldet („3 Bausteine mehr") — also
         genau das, was er bestellt hat. Dass der Dreck wirklich
         liegenbleibt UND sich wegputzen laesst, misst
         werkzeug/pruefe-runde98-putzen.js. */
      ".lc-dreckschicht"];
    let erlaubt = 0;
    bleibtErlaubt.forEach((wahl) => {
      reihe2.querySelectorAll(wahl).forEach((el) => {
        erlaubt += 1 + el.querySelectorAll("*").length;
      });
    });
    const nachher = reihe2.querySelectorAll("*").length - erlaubt;
    if (nachher > vorher + 2) schaden.push("liegengeblieben: " + (nachher - vorher) + " Bausteine mehr");
    /* 2. Steht jedes Bild wieder an seinem Platz — unverformt? */
    plaetze.slice(0, 2).forEach((pl, i) => {
      const wo = i === 0 ? "der verlassene Platz" : "das Ziel";
      const kreis = pl.querySelector(".lc-kreis");
      if (!kreis) { schaden.push(wo + ": kein Bild mehr"); return; }
      const cs = getComputedStyle(kreis);
      if (cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)")
        schaden.push(wo + ": das Bild steht verformt (" + cs.transform + ")");
      if (Number(cs.opacity) < 0.9) schaden.push(wo + ": das Bild ist blass (" + cs.opacity + ")");
      const nr = pl.querySelector(".lc-nummer");
      if (!nr || getComputedStyle(nr).display === "none")
        schaden.push(wo + ": die Nummer fehlt");
      const schild = pl.querySelector(".lc-schild");
      if (!schild) schaden.push(wo + ": die geschuetzte Ebene fehlt");
    });
    /* 3. Keine Reise-Schicht darf uebrig sein. */
    const uebrig = document.querySelectorAll(".lc-reise, .lc-flieger, .lc-greif").length;
    if (uebrig) schaden.push(uebrig + " Reise-Schicht(en) liegen noch da");
    return schaden;
  }, [art, stoerung]);

  for (const art of alle) {
    const stufen = [["ungestoert", ""], ["Auffrischen", "auffrischen"],
                    ["Neuzeichnen", "neuzeichnen"]];
    const schlecht = [];
    for (const [wie, stoerung] of stufen) {
      const schaden = await lauf(art, stoerung);
      schaden.forEach((x) => schlecht.push(wie + ": " + x));
    }
    if (schlecht.length) {
      fehler++;
      console.log("  FEHL /" + art + "   " + schlecht[0]);
      zeilen.push("  /" + art + "\n        " + [...new Set(schlecht)].join("\n        "));
    } else {
      console.log("  ok   /" + art);
    }
  }

  await br.close();
  srv.close();
  if (fehler) {
    console.log("\n" + fehler + " Effekt(e) hinterlassen etwas, wenn der Betrieb dazwischenfunkt:\n");
    zeilen.forEach((z) => console.log(z));
  } else {
    console.log("\nalles gruen");
  }
  process.exit(fehler ? 1 : 0);
})();
