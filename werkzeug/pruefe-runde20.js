#!/usr/bin/env node
/* =========================================================
   RUNDE 20 — DOPPELTES HOEREN, DER PANIK-KNOPF UND DIE
   AUFGABEN, DIE WIRKLICH AUFGABEN SIND
   ---------------------------------------------------------
   GEMELDET, woertlich:
   „Dann wurde mir oft gemeldet, dass nach einiger Zeit die
    Leute sich irgendwie doppelt gehoert haben … Entweder du
    fixt es fuer die Zukunft generell, dass so etwas nie
    wieder passieren kann … oder du gibst den Leuten eine Art
    Panic-Button, wo sie ihr Audio selber fixen koennen."
   „Hast du auch das /aufgabe geloest? Also dass man da nicht
    einfach nur einen Satz schreibt und dieser Satz dann
    komplett anklickbar dasteht und eigentlich gar keine
    Aufgabenfunktion hat."
   „Dann moechte ich eine Kontextaufgabe … dass die Leute
    diese Saetze sortieren, damit die Geschichte von oben bis
    unten logisch Sinn macht."
   „Zum Beispiel sehe ich die Sprechbild-Animation von den
    anderen nicht, wenn sie sprechen."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");

  console.log("\nDAS DOPPELTE HOEREN — AN DER WURZEL\n");
  pruefe("eine neue Spur ERSETZT die alte, statt sich dazuzulegen",
    /if \(t\.kind !== e\.track\.kind \|\| t\.id === e\.track\.id\) return;/.test(lc),
    "in pc.ontrack");
  pruefe("und die alte wird auch wirklich angehalten",
    /p\.strom\.removeTrack\(t\)[\s\S]{0,80}t\.stop\(\)/.test(lc));

  console.log("\nDIE TONWACHE HEILT VON SELBST\n");
  pruefe("es gibt eine Wache", /function tonWacheStarten/.test(lc));
  pruefe("sie laeuft, solange man im Raum ist",
    /tonWacheStarten\(\);/.test(lc) && /tonWacheStoppen\(\);/.test(lc));
  pruefe("sie raeumt doppelte Spuren weg", /function tonSpurenAufraeumen/.test(lc));
  pruefe("und Elemente, zu denen niemand mehr gehoert",
    /function tonElementeAufraeumen/.test(lc));
  pruefe("sie schreibt dabei NICHT in den Chat",
    !/tonWacheTakt = setInterval[\s\S]{0,900}systemZeile\(/.test(lc),
    "der Sinn ist, dass niemand etwas merkt");

  console.log("\nDER PANIK-KNOPF\n");
  pruefe("es gibt ihn als Funktion", /function tonNeuAufbauen/.test(lc));
  pruefe("er ist nach aussen offen", /tonNeuAufbauen: function/.test(lc));
  pruefe("es gibt den Befehl /panik", /w: "panik", kurz: "tonneu"/.test(lc),
    "„/ton\u201c war schon fuer /verbindung vergeben");
  pruefe("und einen Knopf im Klassenzimmer",
    /id="lcTonNeu"/.test(js) && /#lcTonNeu"\)\?\.addEventListener/.test(js));
  pruefe("der Knopf hat auch ein Aussehen", /\.lc-tonknopf \{/.test(css));

  console.log("\nDAS SPRECHBILD FAEHRT SCHON IN DER BEGRUESSUNG MIT\n");
  pruefe("im hallo",
    /art: "hallo"[\s\S]{0,320}sprechbild: zustand\.sprechbild/.test(lc));
  pruefe("und in der Antwort darauf",
    /art: "auch-da"[\s\S]{0,420}sprechbild: zustand\.sprechbild/.test(lc));

  console.log("\nDIE FREIE AUFGABE IST KEIN PUZZLE MEHR\n");
  pruefe("bei einem einzigen Teil wird eine FRAGE gezeichnet",
    /if \(teile\.length < 2\) \{/.test(js));
  pruefe("mit einem Hinweis, was zu tun ist", /lc-aufgabe-hinweis/.test(js));
  pruefe("und einem Knopf zum Antworten", /"\\u270d\\ufe0f Antworten"/.test(js)
    || /Antworten/.test(js));

  console.log("\nDIE SORTIERAUFGABE\n");
  pruefe("es gibt den Befehl", /w: "sortieren"/.test(lc));
  pruefe("sie mischt die Saetze", /function sortierAufgabeStellen/.test(lc)
    && /var gemischt = mischen\(reihenfolge\);/.test(lc));
  pruefe("die Loesung reist NICHT mit",
    !/zusatz\.loesung/.test(lc) && /if \(zusatz && zusatz\.sortieren\) n\.sortieren/.test(lc),
    "nur die Mischung geht hinaus");
  pruefe("der Empfang traegt sie weiter",
    /sortieren: Array\.isArray\(n\.sortieren\)/.test(lc));
  pruefe("und es gibt eine Tafel dafuer", /function lcSortierTafel/.test(js));

  /* ---------- Im Browser ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz, { timeout: 20000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: { b: { id: "b", name: "Bea", seit: 500 } } });
    const t = document.querySelector('[data-sub="sub-livechat"]');
    if (t) t.click();
  });
  await pg.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });

  console.log("\nGEMESSEN: DIE FREIE AUFGABE\n");
  const auf = await pg.evaluate(async () => {
    window.LiveChat.schreiben("/aufgabe Schreib einen Satz mit weil");
    await new Promise((f) => setTimeout(f, 400));
    const zeile = [...document.querySelectorAll("#lcVerlauf .lc-zeile")]
      .reverse().find((z) => z.querySelector(".lc-aufgabe"));
    if (!zeile) return null;
    return {
      teilknoepfe: zeile.querySelectorAll(".lc-aufgabe-teil").length,
      frageText: (zeile.querySelector(".lc-aufgabe-frage") || {}).textContent || "",
      hinweis: Boolean(zeile.querySelector(".lc-aufgabe-hinweis")),
      antwortKnopf: Boolean(zeile.querySelector(".lc-aufgabe-los"))
    };
  });
  pruefe("die Frage steht als Text da, nicht als Knopf",
    auf && auf.teilknoepfe === 0, auf ? auf.teilknoepfe + " Puzzleknoepfe" : "keine Zeile");
  pruefe("und sie ist vollstaendig zu lesen",
    auf && /weil/.test(auf.frageText), auf ? auf.frageText.slice(0, 44) : "-");
  pruefe("darunter steht, was zu tun ist", Boolean(auf && auf.hinweis));
  pruefe("und ein Knopf fuehrt zur Schreibzeile", Boolean(auf && auf.antwortKnopf));

  console.log("\nGEMESSEN: DIE SORTIERAUFGABE\n");
  const sort = await pg.evaluate(async () => {
    window.LiveChat.schreiben("/sortieren Erst stand er auf. | Dann ass er. | Danach ging er zur Arbeit.");
    await new Promise((f) => setTimeout(f, 400));
    const zeile = [...document.querySelectorAll("#lcVerlauf .lc-zeile")]
      .reverse().find((z) => z.querySelector(".lc-sortier"));
    if (!zeile) return null;
    const knoepfe = [...zeile.querySelectorAll(".lc-sortier-zeile")];
    /* Zwei antippen und sehen, ob sie ihre Nummer bekommen. */
    knoepfe[1].click(); knoepfe[0].click();
    return {
      anzahl: knoepfe.length,
      nummern: knoepfe.map((b) => b.querySelector(".lc-sortier-nr").textContent),
      gewaehlt: zeile.querySelectorAll(".lc-sortier-gewaehlt").length,
      saetze: knoepfe.map((b) => b.textContent.replace(/^[\s·\d]+/, "").slice(0, 20))
    };
  });
  pruefe("drei Saetze stehen zur Wahl", sort && sort.anzahl === 3,
    sort ? sort.anzahl + " Saetze" : "keine Tafel");
  pruefe("das Antippen vergibt die Reihenfolge",
    sort && sort.nummern[1] === "1" && sort.nummern[0] === "2",
    sort ? sort.nummern.join(", ") : "-");
  pruefe("und man sieht, was schon gewaehlt ist", sort && sort.gewaehlt === 2,
    sort ? sort.gewaehlt + " markiert" : "-");
  pruefe("die Saetze sind wirklich gemischt worden",
    sort && new Set(sort.saetze).size === 3, sort ? sort.saetze.join(" / ") : "-");

  console.log("\nGEMESSEN: DER PANIK-KNOPF TUT ETWAS\n");
  const panik = await pg.evaluate(() => {
    const erg = window.LiveChat.tonNeuAufbauen();
    const stand = window.LiveChat.tonWacheStand();
    return { erg: erg, wache: stand };
  });
  pruefe("er laeuft durch und meldet ein Ergebnis",
    panik.erg && typeof panik.erg.doppelt === "number",
    JSON.stringify(panik.erg));
  pruefe("und die Wache laeuft im Raum", panik.wache && panik.wache.laeuft === true,
    JSON.stringify(panik.wache));

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0,
    aufSeite.length ? aufSeite.join(" | ") : "keine");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 20 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
