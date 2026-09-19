#!/usr/bin/env node
/* =========================================================
   DAS GALGENMAENNCHEN — BUCHSTABE FUER BUCHSTABE
   ---------------------------------------------------------
   GEMELDET: „Einige Aufgaben gehen noch nicht wie das
   Galgenmaennchen. Da ist einfach ein ganzer Satz angezeigt
   und den kann man nur einmal auswaehlen, aber die einzelnen
   Buchstaben sind nicht auswaehlbar, einzutragen, auch keine
   voreingestellten Buchstaben, die schon da sind, die man
   ausfuellen kann."

   Nachgesehen: bei den Lueckentext-Geschichten stand die
   ganze Mini-Geschichte da und darunter ZWEI Woerter zur
   Wahl. Buchstaben gab es nirgends — die Uebungen kannten nur
   Antwortknoepfe.

   Diese Sonde spielt die Aufgabe wirklich durch: einmal
   richtig eintragen, einmal falsch. Gemessen wird, ob die
   Kaesten da sind, ob ein Teil schon ausgefuellt ist, ob
   Buchstaben zur Wahl stehen, ob ein gesetzter Buchstabe
   wieder herausgeht — und ob am Ende richtig gezaehlt wird.

   Aufruf:  node werkzeug/pruefe-galgenmaennchen.js
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
  const pg = await br.newPage({ viewport: { width: 420, height: 860 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.galgenAufgabe, { timeout: 25000 });
  await pg.evaluate(() => {
    const t = document.querySelector('.tape-tab[data-target="view-learn"]');
    if (t) t.click();
  });
  await pg.waitForTimeout(700);

  console.log("\nDIE AUFGABE SIEHT AUS WIE EIN GALGENMAENNCHEN\n");
  const bau = await pg.evaluate(() => window.DMA_PRUEF.galgenAufgabe());
  pruefe("es gibt Kaesten statt zwei Knoepfen", Boolean(bau) && bau.felder >= 4,
    bau ? bau.felder + " Kaesten fuer „" + bau.wort + "“" : "keine Kaesten gebaut");
  pruefe("ein Teil der Buchstaben steht schon da",
    Boolean(bau) && bau.fest >= 1 && bau.fest < bau.felder,
    bau ? bau.fest + " von " + bau.felder + " vorgegeben" : "-");
  pruefe("es stehen Buchstaben zur Wahl", Boolean(bau) && bau.tasten >= 5,
    bau ? bau.tasten + " Buchstaben" : "-");
  pruefe("die Antwortknoepfe sind weg",
    await pg.evaluate(() => document.querySelectorAll(".option-btn").length === 0));
  pruefe("mehr Buchstaben zur Wahl als Luecken",
    Boolean(bau) && bau.tasten > (bau.felder - bau.fest),
    bau ? bau.tasten + " Buchstaben fuer " + (bau.felder - bau.fest) + " Luecken" : "-");

  console.log("\nEIN GESETZTER BUCHSTABE GEHT WIEDER HERAUS\n");
  const zurueck = await pg.evaluate(() => {
    const g = document.querySelector(".galgen");
    const frei = () => Array.from(g.querySelectorAll(".galgen-feld"))
      .filter((f) => !f.dataset.fest && !f.textContent.trim()).length;
    const vor = frei();
    g.querySelector(".galgen-taste").click();
    const nachSetzen = frei();
    const gesetzt = Array.from(g.querySelectorAll(".galgen-feld"))
      .filter((f) => !f.dataset.fest && f.textContent.trim())[0];
    if (gesetzt) gesetzt.click();
    return { vor: vor, nachSetzen: nachSetzen, nachWeg: frei() };
  });
  pruefe("ein Buchstabe fuellt genau einen Kasten", zurueck.nachSetzen === zurueck.vor - 1,
    zurueck.vor + " -> " + zurueck.nachSetzen + " offene Kaesten");
  pruefe("der Kasten laesst sich wieder leeren", zurueck.nachWeg === zurueck.vor,
    zurueck.nachSetzen + " -> " + zurueck.nachWeg);

  console.log("\nRICHTIG EINGETRAGEN ZAEHLT ALS RICHTIG\n");
  const richtig = await pg.evaluate(async () => {
    window.DMA_PRUEF.galgenAufgabe();
    const g = document.querySelector(".galgen");
    const wort = g.dataset.wort.split("");
    const felder = Array.from(g.querySelectorAll(".galgen-feld"));
    /* Der Reihe nach das richtige Wort eintragen: fuer jeden offenen
       Kasten den Buchstaben anklicken, der dort hingehoert. */
    for (let i = 0; i < felder.length; i++) {
      if (felder[i].dataset.fest) continue;
      const taste = Array.from(g.querySelectorAll(".galgen-taste"))
        .filter((t) => t.dataset.b === wort[i] && !t.disabled)[0];
      if (taste) taste.click();
    }
    await new Promise((f) => setTimeout(f, 120));
    return { getippt: g.dataset.getippt || "", soll: g.dataset.wort,
             gruen: g.querySelectorAll(".galgen-richtig").length,
             rot: g.querySelectorAll(".galgen-falsch").length,
             luecke: (document.getElementById("blankSlot") || {}).textContent || "" };
  });
  pruefe("das Wort steht vollstaendig da", richtig.getippt === richtig.soll,
    "„" + richtig.getippt + "“ gegen „" + richtig.soll + "“");
  pruefe("die Kaesten werden gruen", richtig.gruen > 0 && richtig.rot === 0,
    richtig.gruen + " gruen, " + richtig.rot + " rot");
  pruefe("das Wort steht danach in der Luecke im Satz",
    richtig.luecke.toLowerCase() === richtig.soll, "„" + richtig.luecke + "“");

  console.log("\nFALSCH EINGETRAGEN ZAEHLT ALS FALSCH\n");
  const falsch = await pg.evaluate(async () => {
    window.DMA_PRUEF.galgenAufgabe();
    const g = document.querySelector(".galgen");
    const wort = g.dataset.wort.split("");
    const felder = Array.from(g.querySelectorAll(".galgen-feld"));
    let erster = true;
    for (let i = 0; i < felder.length; i++) {
      if (felder[i].dataset.fest) continue;
      const tasten = Array.from(g.querySelectorAll(".galgen-taste")).filter((t) => !t.disabled);
      /* Beim ERSTEN offenen Kasten mit Absicht daneben greifen. */
      const taste = erster
        ? (tasten.filter((t) => t.dataset.b !== wort[i])[0] || tasten[0])
        : (tasten.filter((t) => t.dataset.b === wort[i])[0] || tasten[0]);
      erster = false;
      if (taste) taste.click();
    }
    await new Promise((f) => setTimeout(f, 120));
    return { getippt: g.dataset.getippt || "", soll: g.dataset.wort,
             gruen: g.querySelectorAll(".galgen-richtig").length,
             rot: g.querySelectorAll(".galgen-falsch").length,
             korrektur: (document.querySelector(".blank-correction") || {}).textContent || "" };
  });
  pruefe("ein falscher Buchstabe macht die Antwort falsch",
    falsch.getippt !== falsch.soll && falsch.rot > 0 && falsch.gruen === 0,
    "„" + falsch.getippt + "“ statt „" + falsch.soll + "“, " + falsch.rot + " rot");
  pruefe("und das richtige Wort wird genannt",
    falsch.korrektur.toLowerCase().indexOf(falsch.soll) >= 0, falsch.korrektur || "keine Korrektur");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Das Galgenmaennchen laesst sich ausfuellen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
