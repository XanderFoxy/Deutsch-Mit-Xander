/* PRÜFT: EINE ZEILE OHNE LEITUNG GEHT NICHT VERLOREN.
   ---------------------------------------------------------------
   GEMELDET: „Wenn Emmy die alte Aufgabe aus dem Verlauf noch mal
   löst, kommt sie nicht an, sie schickt nicht ab."

   Eine Erklärung dafür stand in einer einzigen Zeile im Absender:
       if (!kanal) return;
   Steht die Leitung gerade nicht — Telefon kurz im Schlaf, Netzwechsel,
   Kanal wird neu aufgebaut —, war die Zeile weg. Beim Absender stand
   sie im Chat (sie entsteht dort lokal), bei allen anderen kam sie nie
   an. Jetzt wartet sie und geht hinaus, sobald der Raum wieder steht.

   Gemessen wird: was wartet, was NICHT wartet (ein Pulsschlag von
   vorgestern hilft niemandem), und dass es hinterher wirklich
   hinausgeht. */
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
  await pg.waitForTimeout(2300);

  const erg = await pg.evaluate(() => {
    /* Ohne Raum steht keine Leitung — genau der Zustand, um den es
       geht. Geschrieben wird trotzdem. */
    LiveChat.pruefRaum("probe-warten");
    LiveChat.schreiben("Der Hund läuft über die Wiese");
    LiveChat.schreiben("Und noch ein Satz");
    const wartend = LiveChat.pruefWartend();
    /* Ein Pulsschlag soll NICHT warten. */
    LiveChat.pruefAbfangen(null);
    const vorPuls = LiveChat.pruefWartend().length;
    return { wartend: wartend, wieviel: wartend.length, vorPuls: vorPuls };
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  console.log("\n  OHNE LEITUNG GESCHRIEBEN");
  ok(erg.wieviel === 2, "beide Zeilen warten, statt verlorenzugehen", erg.wieviel + " Zeilen");
  ok(erg.wartend.includes("Der Hund läuft über die Wiese"),
     "die erste steht wörtlich in der Warteschlange", "„" + (erg.wartend[0] || "") + "“");
  ok(erg.wartend.every((t) => t !== "puls"), "und kein Pulsschlag hängt mit drin");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Nichts geht mehr still verloren.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
