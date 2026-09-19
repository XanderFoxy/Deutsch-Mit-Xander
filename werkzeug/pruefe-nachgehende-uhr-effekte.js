/* PRÜFT DEN FALL, DER SECHS RUNDEN GEKOSTET HAT.
   ---------------------------------------------------------------
   SEIN BEFUND:
     „Die Uhr von Emmy geht 5 Sekunden nach."
     „Emmi boxt alle … Die Box-Animation ist immer noch nicht da,
      auch die von der Umarmung nicht, auch die von dem Lecken nicht."

   Und da war es. Ob eine Zeile „gerade eben" ist, wurde an der Uhrzeit
   DES ABSENDERS gemessen und mit dem Augenblick des Betretens
   verglichen. Geht ihre Uhr fünf Sekunden nach, sieht JEDE ihrer
   Nachrichten aus, als wäre sie fünf Sekunden VOR meinem Betreten
   geschrieben worden — also Vergangenheit. Und Vergangenheit bleibt
   absichtlich still, damit einen Neuankömmling nicht das halbe Archiv
   anspringt.

   Keine einzige Animation war kaputt. Deshalb lief im Prüfstand auch
   immer alles grün: dort geht keine Uhr nach.

   Gemessen wird deshalb jetzt mit einer nachgehenden Uhr. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 780 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    const raus = {};
    /* Die Bühne: zwei besetzte Plätze, ein Chatverlauf. */
    const bauen = () => {
      document.querySelectorAll("#lcPruefBuehne, .lc-chat").forEach((e) => e.remove());
      const b = document.createElement("div");
      b.id = "lcPruefBuehne";
      b.innerHTML = '<div class="question-card livechat" id="livechatKarte">'
        + '<div class="lc-plaetze" id="lcPlaetze">'
        + '<button class="lc-platz" data-lc-platz="1"><span class="lc-kreis"></span><span class="lc-platz-name">Alex</span></button>'
        + '<button class="lc-platz" data-lc-platz="2"><span class="lc-kreis"></span><span class="lc-platz-name">Emmy</span></button>'
        + "</div>"
        + '<div class="lc-chat"><div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div></div>'
        + "</div>";
      document.body.appendChild(b);
    };

    /* Ihre Uhr geht fünf Sekunden nach — genau wie gemeldet. */
    const NACH = 5000;
    const zeilen = (jetzt) => ([{
      id: "b" + jetzt, von: "emmy", name: "Emmi", art: "aktion",
      text: "Emmi boxt alle", wirkung: "boxen", wen: "",
      /* Geschrieben „jetzt" — aber auf IHRER nachgehenden Uhr. */
      zeit: jetzt - NACH,
      /* Angekommen ist sie JETZT, auf meiner Uhr. Genau diese Angabe
         hat gefehlt. */
      angekommen: jetzt
    }]);

    /* --- Ohne die Ankunftszeit: so war es vorher --- */
    bauen();
    window.DMA_PRUEFUNG.chatStandAb
      ? window.DMA_PRUEFUNG.chatStandAb(zeilen(Date.now()).map((z) => {
          const k = Object.assign({}, z); delete k.angekommen; return k;
        }), Date.now())
      : null;
    raus.hatNaht = Boolean(window.DMA_PRUEFUNG.chatStandAb);
    await warte(350);
    raus.ohne = document.querySelectorAll(".lc-box").length;

    /* --- Mit Ankunftszeit: so ist es jetzt --- */
    bauen();
    if (window.DMA_PRUEFUNG.chatStandAb) {
      window.DMA_PRUEFUNG.chatStandAb(zeilen(Date.now()), Date.now());
    }
    await warte(350);
    raus.mit = document.querySelectorAll(".lc-box").length;
    raus.geboxt = document.querySelectorAll(".lc-wird-geboxt").length;

    /* --- Und was WIRKLICH alt ist, bleibt still --- */
    bauen();
    if (window.DMA_PRUEFUNG.chatStandAb) {
      window.DMA_PRUEFUNG.chatStandAb([{
        id: "alt1", von: "emmy", name: "Emmi", art: "aktion",
        text: "Emmi boxt alle", wirkung: "boxen", wen: "",
        zeit: Date.now() - 3600000            // eine Stunde her, keine Ankunftszeit
      }], Date.now());
    }
    await warte(350);
    raus.wirklichAlt = document.querySelectorAll(".lc-box").length;
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  if (!erg.hatNaht) { console.log("  Testnaht chatStandAb fehlt."); await br.close(); srv.close(); process.exit(1); }

  console.log("\n  IHRE UHR GEHT FÜNF SEKUNDEN NACH, SIE BOXT");
  ok(erg.ohne === 0, "ohne Ankunftszeit kam NICHTS — das war sein Fehler, sechs Runden lang",
     erg.ohne + " Animationen");
  ok(erg.mit >= 1, "mit Ankunftszeit läuft die Animation", erg.mit + " Animationen");
  ok(erg.geboxt >= 1, "und ein Platz wackelt", erg.geboxt + " Plätze");

  console.log("\n  UND WAS WIRKLICH ALT IST");
  ok(erg.wirklichAlt === 0, "eine Stunde alte Zeile bleibt still — kein Archiv-Gewitter beim Betreten",
     erg.wirklichAlt + " Animationen");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Eine nachgehende Uhr macht die Animationen nicht mehr stumm.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
