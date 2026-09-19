#!/usr/bin/env node
/* =========================================================
   PRUEFT DAS GLUECKSRAD — AN DER ECHTEN SEITE
   ---------------------------------------------------------
   GEWUENSCHT: „Dann noch als Variante fuer einen gesuchten
   Satz wie bei Gluecksrad — dass ich einen Satz oder eine
   Redewendung schreibe und ein paar Buchstaben schon in den
   Feldern stehen, ohne den Chat irgendwie in seinem
   Designfluss zu beeintraechtigen."

   Gemessen wird deshalb genau das:
   1. Der Befehl stellt eine Aufgabe.
   2. Der gesuchte Satz steht NICHT im sichtbaren Text der Zeile.
   3. Ein paar Buchstaben liegen von Anfang an offen — und auf
      jedem Geraet dieselben.
   4. Ein Tipp auf eine Taste deckt genau diesen Buchstaben auf;
      ein Buchstabe, den es nicht gibt, zaehlt als Fehlversuch.
   5. DER DESIGNFLUSS: kein Wort bricht mitten durch, und die
      Tafel steht nicht breiter als der Chat.
   6. Die Antwort traegt die Kennung der Aufgabe.
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

const SATZ = "Der Apfel fällt nicht weit vom Stamm";

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
    (window.LiveChat.befehlsliste() || []).some((b) => b.w === "raten"));
  pruefe("„/raten“ steht in der Befehlsliste", inListe);

  console.log("\nWAS GEHT HINAUS?\n");
  const paket = await pg.evaluate((satz) => {
    let raus = null;
    window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
    window.LiveChat.pruefBefehl("/raten " + satz);
    return raus;
  }, SATZ);
  pruefe("die Aufgabe geht hinaus", Boolean(paket));
  pruefe("der gesuchte Satz steht NICHT im sichtbaren Text",
    Boolean(paket) && String(paket.text || "").indexOf("Apfel") < 0,
    paket ? String(paket.text || "") : "-");
  pruefe("der Satz reist im eigenen Feld mit (sonst gaebe es nichts aufzudecken)",
    Boolean(paket) && String(paket.raten || "") === SATZ);

  console.log("\nDIE TAFEL IM CHAT\n");
  await pg.evaluate((satz) => {
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.style.width = "360px";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    window.DMA_PRUEFUNG.chatStand([{ id: "r1", von: "x", name: "Alex", art: "aufgabe",
      text: "🎡 Glücksrad — welcher Satz ist das?", raten: satz, zeit: Date.now() }]);
  }, SATZ);
  await pg.waitForTimeout(800);

  const stand = await pg.evaluate(() => {
    const k = document.querySelector(".lc-raten");
    if (!k) return null;
    const felder = Array.from(k.querySelectorAll(".lc-raten-feld"));
    return {
      felder: felder.length,
      offen: felder.filter((f) => f.classList.contains("offen")).length,
      text: felder.map((f) => f.textContent || "_").join(""),
      tasten: k.querySelectorAll(".lc-raten-taste").length,
      knopf: Boolean(k.querySelector(".lc-betonung-fertig"))
    };
  });
  pruefe("die Tafel wird gezeichnet", Boolean(stand));
  const buchstaben = (SATZ.match(/\p{L}/gu) || []).length;
  if (stand) {
    pruefe("für jeden Buchstaben ein Feld", stand.felder === buchstaben,
      stand.felder + " Felder, " + buchstaben + " Buchstaben");
    pruefe("ein paar Buchstaben liegen schon offen",
      stand.offen > 0 && stand.offen < stand.felder, stand.offen + " von " + stand.felder);
    pruefe("der Satz steht NICHT lesbar da",
      stand.text.replace(/_/g, "").length < buchstaben, stand.text);
    pruefe("es gibt eine Tastenreihe", stand.tasten >= 26, stand.tasten + " Tasten");
    pruefe("es gibt einen Knopf für die Lösung", stand.knopf);
  }

  console.log("\nDER DESIGNFLUSS — BRICHT ETWAS UM, WAS NICHT DARF?\n");
  const fluss = await pg.evaluate(() => {
    const k = document.querySelector(".lc-raten");
    const verlauf = document.getElementById("lcVerlauf");
    const wb = verlauf.getBoundingClientRect();
    /* Ein Wort, das umbricht, hat Felder auf ZWEI Höhen. */
    let gebrochen = 0;
    k.querySelectorAll(".lc-raten-wort").forEach((w) => {
      const hoehen = new Set(Array.from(w.children).map((c) => Math.round(c.getBoundingClientRect().top)));
      if (hoehen.size > 1) gebrochen++;
    });
    const kb = k.getBoundingClientRect();
    return { gebrochen: gebrochen,
      breiter: Math.round(kb.width - wb.width),
      ueber: Math.round(kb.right - wb.right),
      waagerecht: verlauf.scrollWidth - verlauf.clientWidth };
  });
  pruefe("kein Wort bricht mitten durch", fluss.gebrochen === 0, fluss.gebrochen + " gebrochen");
  pruefe("die Tafel bleibt im Chat", fluss.ueber <= 1, "ragt " + fluss.ueber + " px hinaus");
  pruefe("es entsteht kein waagerechter Rollbalken", fluss.waagerecht <= 1,
    fluss.waagerecht + " px");

  console.log("\nRATEN — TRIFFT UND DANEBEN\n");
  const nach = await pg.evaluate(() => {
    const k = document.querySelector(".lc-raten");
    const taste = (b) => Array.from(k.querySelectorAll(".lc-raten-taste"))
      .find((t) => t.textContent === b);
    const vorher = k.querySelectorAll(".lc-raten-feld.offen").length;
    const tA = taste("A"); if (tA && !tA.disabled) tA.click();
    const nachA = k.querySelectorAll(".lc-raten-feld.offen").length;
    const tQ = taste("Q"); if (tQ && !tQ.disabled) tQ.click();
    return { vorher: vorher, nachA: nachA,
      qDaneben: Boolean(tQ && tQ.classList.contains("daneben")),
      hinweis: (k.querySelector(".lc-betonung-hinweis") || {}).textContent || "" };
  });
  pruefe("„A“ deckt Felder auf", nach.nachA > nach.vorher,
    nach.vorher + " → " + nach.nachA);
  pruefe("„Q“ steht nicht im Satz und zählt als Fehlversuch", nach.qDaneben, nach.hinweis);

  console.log("\nUND DIE ANTWORT?\n");
  const antwort = await pg.evaluate(() => {
    const k = document.querySelector(".lc-raten");
    /* Alles aufdecken, dann die Lösung sagen. */
    k.querySelectorAll(".lc-raten-taste").forEach((t) => { if (!t.disabled) t.click(); });
    let raus = null;
    window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
    const knopf = k.querySelector(".lc-betonung-fertig");
    if (knopf) knopf.click();
    return { paket: raus, offen: k.querySelectorAll(".lc-raten-feld:not(.offen)").length };
  });
  pruefe("alle Felder lassen sich aufdecken", antwort.offen === 0, antwort.offen + " zu");
  pruefe("die Lösung geht als gewöhnliche Zeile hinaus", Boolean(antwort.paket),
    antwort.paket ? String(antwort.paket.text || "") : "-");
  pruefe("sie trägt die Kennung der Aufgabe (darum der Notenstift)",
    Boolean(antwort.paket && antwort.paket.aufgabeId),
    antwort.paket ? "aufgabeId=" + (antwort.paket.aufgabeId || "FEHLT") : "-");

  console.log("\nDIE FERTIGEN REDEWENDUNGEN\n");
  const liste = await pg.evaluate(() => {
    window.LiveChat.pruefBefehl("/raten liste");
    return (window.LiveChat.pruefZeilen(3) || []).join("\n");
  });
  pruefe("„/raten liste“ zeigt Redewendungen", /Übung macht den Meister/.test(liste),
    liste.split("\n")[0] || "-");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Das Glücksrad tut, was es soll.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
