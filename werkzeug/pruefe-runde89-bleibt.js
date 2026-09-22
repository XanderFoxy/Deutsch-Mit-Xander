/* =====================================================================
   SONDE RUNDE 89 — WAS BLEIBEN SOLL, BLEIBT AUCH
   ---------------------------------------------------------------------
   XANDER: „Du sagst, dass ich mir ein Lied anhoeren kann. Ich kann's mir
   immer noch nicht anhoeren … Die Kopfhoerer bleiben auch nicht auf
   meinem Kopf, waehrend ich das Lied anhoeren koennte."

   NACHGEMESSEN, und der zweite Teil stimmt genau: Kopfhoerer aufgesetzt,
   Lied laeuft — dann einmal aus dem Klassenzimmer heraus und wieder
   hinein, und die Karte wird komplett neu gebaut. Danach:

                        vorher   nachher
     Kopfhoerer auf     nein     ja
     Birne brennt       nein     ja
     Musik laeuft       ja       ja

   Die Musik lief also weiter, und die Kopfhoerer waren weg — genau das
   Bild, das er beschreibt.

   WARUM: beides haengt als Element bzw. als Klasse AM PLATZ, und der
   Platz wird beim Neuaufbau der Karte neu erzeugt. Fuer die KLEIDUNG
   war das in Runde 76 schon geloest (lcKleiderliste +
   lcKleiderAuffrischen); fuer die Kopfhoerer und den Schein der Birne
   fehlte dasselbe. Jetzt gibt es lcHoererListe, lcBirneListe und
   lcBleibendesAuffrischen, aufgerufen an derselben Stelle.

   Was liegen bleiben SOLL, ist dreierlei, und jedes davon ist sein Satz:
     Kleidung    „was man jemandem aufsetzt, hat er an, bis es jemand
                  abnimmt"
     Kopfhoerer  „sollen so lange auf der Person bleiben, bis sie sie
                  von selber abnimmt"
     Birne       „es kann nicht sein, dass beim zweiten Betaetigen von
                  Birne an die Birne ausgeht"
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

(async () => {
  console.log("RUNDE 89 — was bleiben soll, bleibt auch\n");
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
  await pg.waitForFunction(() => window.LiveChat && window.DMA_PRUEF, { timeout: 20000 });

  const m = await pg.evaluate(async () => {
    for (let i = 0; i < 50; i++) {
      let n = 0;
      try { n = ((LiveChat.lieder && LiveChat.lieder()) || []).length; } catch (e) { n = 0; }
      if (n) break;
      await new Promise((f) => setTimeout(f, 100));
    }
    try {
      LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                           buehne: true, zuruecksetzen: true });
      LiveChat.pruefPersonSetzen("bea-1", "Bea");
      LiveChat.pruefRaum("klassenzimmer");
    } catch (e) {}
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.getElementById("view-knowledge")?.classList.add("active");
    document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]')?.click();
    await new Promise((f) => setTimeout(f, 900));
    const meiner = () => document.querySelector("#livechatKarte .lc-platz-ich");
    if (!meiner()) return { platzFehlt: true };
    const aus = {};
    const lieder = (LiveChat.lieder && LiveChat.lieder()) || [];
    if (lieder.length) LiveChat.schreiben("/kopfhoerer ich 1");
    else LiveChat.schreiben("/kopfhoerer ich");
    await new Promise((f) => setTimeout(f, 700));
    aus.hoererGleich = Boolean(meiner().querySelector(".lc-kopfhoerer"));
    LiveChat.schreiben("/anziehen ich krone");
    await new Promise((f) => setTimeout(f, 300));
    aus.kleidGleich = Boolean(meiner().querySelector(".lc-kleid"));
    LiveChat.schreiben("/gluehbirne ich");
    await new Promise((f) => setTimeout(f, 4600));
    aus.birneGleich = Boolean(meiner().querySelector(".lc-kreis.lc-birne-an"));
    /* DER FALL, UM DEN ES GEHT: hinausgehen und zurueckkommen. Dann
       wird die ganze Karte neu gebaut, nicht nur aufgefrischt. */
    const area = document.getElementById("livechatArea");
    if (area) area.innerHTML = "";
    document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]')?.click();
    await new Promise((f) => setTimeout(f, 1200));
    aus.hoererDanach = Boolean(meiner() && meiner().querySelector(".lc-kopfhoerer"));
    aus.kleidDanach = Boolean(meiner() && meiner().querySelector(".lc-kleid"));
    aus.birneDanach = Boolean(meiner() && meiner().querySelector(".lc-kreis.lc-birne-an"));
    const a = [...document.querySelectorAll("audio")].find((x) => /music/.test(x.src || ""));
    aus.musikLaeuft = Boolean(a && !a.paused);
    /* Und abgenommen heisst abgenommen — auch nach dem Neuaufbau. */
    LiveChat.schreiben("/kopfhoerer ich");
    await new Promise((f) => setTimeout(f, 300));
    aus.hoererAb = !meiner().querySelector(".lc-kopfhoerer");
    if (area) area.innerHTML = "";
    document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]')?.click();
    await new Promise((f) => setTimeout(f, 1000));
    aus.hoererBleibtAb = !(meiner() && meiner().querySelector(".lc-kopfhoerer"));
    return aus;
  });

  if (m.platzFehlt) {
    sage(false, "mein Platz steht im Klassenzimmer");
  } else {
    console.log("GLEICH NACH DEM BEFEHL\n");
    sage(m.hoererGleich, "die Kopfhörer sitzen auf");
    sage(m.kleidGleich, "die Krone sitzt auf");
    sage(m.birneGleich, "die Birne brennt");
    console.log("\nUND NACH DEM VERLASSEN UND WIEDERBETRETEN\n");
    sage(m.hoererDanach, "die Kopfhörer sind IMMER NOCH auf — genau das war der Fehler");
    sage(m.kleidDanach, "die Krone auch (das war seit Runde 76 in Ordnung)");
    sage(m.birneDanach, "und die Birne brennt weiter");
    sage(m.musikLaeuft, "während das Lied durchgehend läuft");
    console.log("\nUND WER SIE ABNIMMT, BEHÄLT SIE NICHT\n");
    sage(m.hoererAb, "ein zweites „/kopfhörer“ nimmt sie ab");
    sage(m.hoererBleibtAb, "und sie kommen auch nach dem Neuaufbau nicht zurück");
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
