#!/usr/bin/env node
/* =========================================================
   PRUEFT DIE BETONUNGSUEBUNG — AN DER ECHTEN SEITE
   ---------------------------------------------------------
   GEWUENSCHT: „Bau gleich noch eine Betonungsuebung ein: wenn
   ich ein Wort oder einen Satz schreibe, wird im Woerterbuch
   danach gescannt, ob es diese Woerter gibt … dass die Leute die
   anklicken koennen, die betont werden … und dass ich das auch
   benoten kann ganz normal."

   Gemessen wird deshalb genau das, und nichts davon geglaubt:
   1. Der Befehl stellt eine Aufgabe.
   2. Die Silben kommen aus dem WOERTERBUCH (Probe an bekannten
      Woertern, deren Betonung dort geprueft steht).
   3. Ein Wort, das nicht im Woerterbuch steht, wird nicht
      geraten, sondern steht fest und unklickbar da.
   4. Die LOESUNG reist nicht mit — im Paket steht nur der Text.
   5. Die Antwort traegt die Kennung der Aufgabe, damit der
      Notenstift daneben steht.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webm": "video/webm", ".mp4": "video/mp4",
  ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

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
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });

  console.log("\nSTEHT DER BEFEHL DA?\n");
  const inListe = await pg.evaluate(() =>
    (window.LiveChat.befehlsliste() || []).some((b) => b.w === "betonung"));
  pruefe("„/betonung“ steht in der Befehlsliste", inListe);

  /* Das Woerterbuch muss geladen sein, sonst gibt es keine Silben.
     Es laedt sonst erst, wenn jemand den Wortschatz oeffnet — also
     hier von Hand anstossen. */
  await pg.evaluate(() => {
    /* VocabData ist ein Skript-Global, KEINE Eigenschaft von window —
       „window.VocabData" ist undefined, „VocabData" nicht. Daran ist
       der erste Entwurf dieser Sonde haengengeblieben. */
    try { if (typeof VocabData !== "undefined" && VocabData.ladeWoerter) VocabData.ladeWoerter(); } catch (e) {}
  });
  const wort = await pg.waitForFunction(() => {
    /* Auf ALLE Themen warten, nicht nur auf die ersten — sonst haengt
       es vom Zufall ab, ob ein Probewort schon dabei ist. */
    try { return Boolean(typeof VocabData !== "undefined" && VocabData.alleThemenDa
      && VocabData.alleThemenDa() && VocabData.WORDS.length > 200); }
    catch (e) { return false; }
  }, { timeout: 30000 }).then(() => true).catch(() => false);
  pruefe("das Woerterbuch ist geladen", wort);

  console.log("\nWAS GEHT HINAUS — UND WAS NICHT?\n");
  const paket = await pg.evaluate(() => {
    /* pruefPost faengt den RUNDRUF ab (pruefPostAbfangen waere die
       Direktpost an eine Person — ein anderer Weg). */
    let raus = null;
    window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
    window.LiveChat.pruefBefehl("/betonung Fahrrad Gemüse Blubberquark");
    return raus;
  });
  pruefe("die Aufgabe geht hinaus", Boolean(paket),
    paket ? String(paket.art || paket.chatArt || "") : "nichts abgefangen");
  const alsText = JSON.stringify(paket || {});
  pruefe("der Text reist mit", /Fahrrad/.test(alsText));
  /* Die Loesung waere die betonte Silbe in Grossbuchstaben —
     „FAHR-rad". Genau das darf NICHT im Paket stehen. */
  pruefe("die Loesung reist NICHT mit", !/FAHR-rad|GE-?MÜ|MÜ-se/i.test(alsText.replace(/Fahrrad|Gemüse/g, "")),
    "geprueft auf Silbenschreibung im Paket");

  console.log("\nDIE TAFEL IM CHAT\n");
  const tafel = await pg.evaluate(() => {
    /* Die Zeile so zeichnen, wie sie beim Empfaenger ankaeme. */
    const n = { id: "t1", von: "x", name: "Alex", art: "aufgabe",
                text: "🔠 Wo liegt die Betonung?  Fahrrad Gemüse Blubberquark",
                betonung: "Fahrrad Gemüse Blubberquark", zeit: Date.now() };
    /* Ohne offenes Klassenzimmer gibt es keinen Verlaufskasten — also
       einen aufstellen, wie es die anderen Sonden auch tun, und dann
       ueber chatStand zeichnen lassen. Das ist derselbe Weg, den der
       Empfang nimmt. */
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    window.DMA_PRUEFUNG.chatStand([n]);
    return true;
  });
  void tafel;
  await pg.waitForTimeout(1200);

  const t = await pg.evaluate(() => {
    const k = document.querySelector(".lc-betonung");
    if (!k) return null;
    const woerter = Array.from(k.querySelectorAll(".lc-betonung-wort")).map((g) => ({
      silben: Array.from(g.querySelectorAll(".lc-betonung-silbe")).map((b) => b.textContent),
      fest: Boolean(g.querySelector(".lc-betonung-fest")),
      festText: (g.querySelector(".lc-betonung-fest") || {}).textContent || ""
    }));
    return { woerter: woerter, knopf: Boolean(k.querySelector(".lc-betonung-fertig")) };
  });
  pruefe("die Tafel wird gezeichnet", Boolean(t));
  if (t) {
    const fahrrad = t.woerter[0];
    pruefe("„Fahrrad“ wird in Silben zerlegt",
      fahrrad && fahrrad.silben.length >= 2 && fahrrad.silben.join("").toLowerCase() === "fahrrad",
      fahrrad ? fahrrad.silben.join("-") : "-");
    const gemuese = t.woerter[1];
    pruefe("„Gemüse“ wird in Silben zerlegt",
      gemuese && gemuese.silben.length >= 2 && gemuese.silben.join("").toLowerCase() === "gemüse",
      gemuese ? gemuese.silben.join("-") : "-");
    const quark = t.woerter[2];
    pruefe("ein erfundenes Wort wird NICHT geraten",
      quark && quark.fest && !quark.silben.length, quark ? quark.festText : "-");
    pruefe("es gibt einen „Fertig“-Knopf", t.knopf);
  }

  console.log("\nUND DIE ANTWORT — IST SIE BENOTBAR?\n");
  const antwort = await pg.evaluate(() => {
    const k = document.querySelector(".lc-betonung");
    if (!k) return null;
    /* In jedem Wort die erste Silbe antippen und abschicken. */
    k.querySelectorAll(".lc-betonung-wort").forEach((g) => {
      const b = g.querySelector(".lc-betonung-silbe");
      if (b) b.click();
    });
    const knopf = k.querySelector(".lc-betonung-fertig");
    if (!knopf) return { paket: null, hinweis: "kein Fertig-Knopf" };
    let raus = null;
    window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
    knopf.click();
    return { paket: raus, hinweis: (k.querySelector(".lc-betonung-hinweis") || {}).textContent || "" };
  });
  pruefe("die Antwort geht als gewoehnliche Zeile hinaus", Boolean(antwort && antwort.paket));
  pruefe("sie traegt die Kennung der Aufgabe (darum der Notenstift)",
    Boolean(antwort && antwort.paket && antwort.paket.aufgabeId),
    antwort && antwort.paket ? "aufgabeId=" + (antwort.paket.aufgabeId || "FEHLT") : "-");
  pruefe("die Auswertung steht darunter", /von .* richtig/.test((antwort && antwort.hinweis) || ""),
    (antwort && antwort.hinweis) || "-");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Die Betonungsuebung tut, was sie soll.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
