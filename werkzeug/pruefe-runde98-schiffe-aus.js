#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — SCHIFFE VERSENKEN LAESST SICH WIRKLICH BEENDEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „und das Schiffe versenken muss wirklich auf
   allen Seiten funktionieren. Ich muss es auch beenden koennen auf
   meiner Seite, falls irgendwas ist."

   GEFUNDEN: „/versenken aus" hat es gegeben, und auf dem Brett war
   danach auch nichts mehr zu sehen. Beim SCHIEDSRICHTER aber
   (demjenigen, der das Spiel gestartet hat) wurde nur das GEZEICHNETE
   geleert. Sein ganzes Wissen — schiffeSpiel mit allen Verstecken —
   blieb liegen, samt der Frist fuers Verstecken, die eine volle
   Minute laeuft. Beendete jemand anderes das Spiel, baute diese Uhr
   das Brett kurz darauf wieder auf.

   DREI MESSUNGEN:
     1. Beenden auf der eigenen Seite (der Schiedsrichter selbst).
     2. Beenden durch jemand anderen — auch dann muss beim
        Schiedsrichter nichts uebrig bleiben.
     3. Und die Frist ist wirklich abgestellt, nicht nur vergessen.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz
    && window.LiveChat.schiffeRichterStand, { timeout: 20000 });

  const aufbauen = () => pg.evaluate(() => {
    const L = window.LiveChat;
    L.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true,
      leute: { b: { id: "b", name: "Bea", seit: 2000 },
               c: { id: "c", name: "Cem", seit: 3000 } } });
    L.pruefBefehl("/versenken");
    return { brett: Boolean(L.schiffeStand()),
             richter: L.schiffeRichterStand() };
  });

  console.log("\nDER SCHIEDSRICHTER BEENDET SELBST\n");
  const eins = await pg.evaluate(async () => {
    const L = window.LiveChat;
    L.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true,
      leute: { b: { id: "b", name: "Bea", seit: 2000 },
               c: { id: "c", name: "Cem", seit: 3000 } } });
    L.pruefBefehl("/versenken");
    const vorher = { brett: Boolean(L.schiffeStand()), richter: L.schiffeRichterStand() };
    L.pruefBefehl("/versenken aus");
    return { vorher: vorher,
      brett: Boolean(L.schiffeStand()), richter: L.schiffeRichterStand() };
  });
  sage(eins.vorher.brett && eins.vorher.richter,
    "das Spiel laeuft: Brett da, Schiedsrichter weiss Bescheid",
    eins.vorher.richter ? eins.vorher.richter.mitspieler + " Mitspieler, Stand "
      + eins.vorher.richter.phase : "-");
  sage(!eins.brett, "nach dem Beenden ist das Brett weg");
  sage(eins.richter === null,
    "und beim Schiedsrichter liegt nichts mehr",
    eins.richter ? JSON.stringify(eins.richter) : "nichts");

  console.log("\nUND WENN JEMAND ANDERES BEENDET\n");
  const zwei = await pg.evaluate(async () => {
    const L = window.LiveChat;
    L.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true,
      leute: { b: { id: "b", name: "Bea", seit: 2000 },
               c: { id: "c", name: "Cem", seit: 3000 } } });
    L.pruefBefehl("/versenken");
    const vorher = { brett: Boolean(L.schiffeStand()), richter: L.schiffeRichterStand() };
    /* GENAU DAS WAR DER FEHLER: die Meldung kommt von DRAUSSEN, nicht
       vom eigenen Befehl. */
    L.pruefEmpfangen({ art: "spiel", spiel: { t: "aus" }, von: "b" });
    await new Promise((f) => setTimeout(f, 120));
    return { vorher: vorher,
      brett: Boolean(L.schiffeStand()), richter: L.schiffeRichterStand() };
  });
  sage(zwei.vorher.brett && zwei.vorher.richter, "das Spiel laeuft wieder");
  sage(!zwei.brett, "eine Beenden-Meldung von draussen raeumt das Brett ab");
  sage(zwei.richter === null,
    "UND beim Schiedsrichter bleibt auch nichts liegen",
    zwei.richter ? JSON.stringify(zwei.richter) : "nichts");

  console.log("\nUND DIE FRIST IST WIRKLICH ABGESTELLT\n");
  /* Die Frist fuers Verstecken laeuft 60 s. So lange wartet hier
     niemand — gemessen wird deshalb, dass nach dem Beenden ueber
     mehrere Sekunden NICHTS mehr auftaucht: kein Brett, kein Stand.
     Vor dem Umbau blieb das Wissen liegen, und genau daraus baute
     die Uhr das Brett wieder auf. */
  const drei = await pg.evaluate(async () => {
    const L = window.LiveChat;
    const spur = [];
    for (let i = 0; i < 12; i++) {
      await new Promise((f) => setTimeout(f, 250));
      spur.push((L.schiffeStand() ? "B" : ".") + (L.schiffeRichterStand() ? "R" : "."));
    }
    return spur.join(" ");
  });
  sage(!/B|R/.test(drei), "drei Sekunden lang taucht nichts wieder auf", drei);

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
