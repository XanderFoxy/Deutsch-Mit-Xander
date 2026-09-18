/* PRÜFT: DIESELBE ZEILE STEHT NICHT ZWEIMAL DA.
   ---------------------------------------------------------------
   Eine Nachricht nimmt ZWEI Wege: sofort über die Leitung zu allen im
   Raum, und einmal in die Tabelle, damit sie auch morgen noch da ist.
   Beim nächsten Betreten treffen beide aufeinander. Bisher musste das
   Zusammenführen raten — über Name, Text und Zeit, mit vier Sekunden
   Spielraum. Gehen die Uhren zweier Geräte weiter auseinander (und das
   tun sie), stand dieselbe Nachricht zweimal da.

   Jetzt trägt die Tabelle die Kennung des Absenders mit (quelle_id).
   Gemessen wird: kommt sie aus der Tabelle zurück, findet ihr Bild sie
   noch, und bleibt beim Zusammenführen genau EINE Zeile übrig — auch
   wenn die Uhren eine Minute auseinandergehen. */
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

  const erg = await pg.evaluate(async () => {
    /* Eine Attrappe der Tabelle: drei Zeilen aus dem Raum, eine davon
       mit Bild, dazu eine alte Zeile ohne Kennung (so lagen sie dort,
       bevor es quelle_id gab). */
    const raumZeilen = [
      { id: 101, raum: "klassenzimmer", autor: "u1", name: "Emmy", text: "Guten Morgen!",
        art: "text", farbe: "", farbe_name: "", bild: "", quelle_id: "m-42",
        erstellt: "2026-09-18T08:00:00Z" },
      { id: 102, raum: "klassenzimmer", autor: "u1", name: "Emmy", text: "Schau mal",
        art: "text", farbe: "", farbe_name: "", bild: "", quelle_id: "m-43",
        erstellt: "2026-09-18T08:01:00Z" },
      { id: 103, raum: "klassenzimmer", autor: "u1", name: "Emmy", text: "von früher",
        art: "text", farbe: "", farbe_name: "", bild: "", quelle_id: "",
        erstellt: "2026-09-18T07:00:00Z" }
    ];
    const bilder = [{ id: 102, quelle_id: "m-43", bild_im_chat: "data:image/png;base64,AAAA" }];
    const bauer = (welche) => {
      const b = {
        select: (f) => { b._f = f; return b; },
        eq: () => b, is: () => b, not: () => b, or: () => b,
        neq: () => { b._bilder = true; return b; },
        order: () => b, limit: () => b,
        then: (ok) => Promise.resolve(ok({
          data: (b._bilder ? bilder : raumZeilen).slice().reverse(), error: null }))
      };
      return b;
    };
    Backend.zugang = () => ({ from: () => bauer() });
    Backend.currentUser = () => ({ id: "u9" });

    const vomServer = await LiveChat.pruefServerLaden("klassenzimmer");

    /* Und jetzt dieselbe Nachricht, wie sie live hereinkam — mit einer
       Uhr, die eine Minute vorgeht. */
    const live = [{ id: "m-42", von: "kemmy", name: "Emmy", text: "Guten Morgen!",
                    art: "text", zeit: new Date("2026-09-18T08:01:00Z").getTime(), eigen: false }];
    const zusammen = LiveChat.pruefVerschmelzen(vomServer, live);
    return {
      /* Die Attrappe kennt keine Filter und liefert dieselben Zeilen
         auch der Flüster-Abfrage — deshalb hier ohne Wiederholungen. */
      ids: [...new Set(vomServer.map((n) => n.id))],
      mitBild: [...new Set(vomServer.filter((n) => n.bildImChat).map((n) => n.id))],
      zusammen: zusammen.map((n) => ({ id: n.id, text: n.text }))
    };
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  console.log("\n  WAS VOM SERVER ZURÜCKKOMMT");
  ok(erg.ids.includes("m-42") && erg.ids.includes("m-43"),
     "die Zeilen tragen die Kennung ihres Absenders", erg.ids.join(", "));
  ok(erg.ids.includes("s103"), "eine alte Zeile ohne Kennung behält ihre Tabellennummer");
  ok(JSON.stringify(erg.mitBild) === JSON.stringify(["m-43"]),
     "und das Bild findet seine Zeile", erg.mitBild.join(", ") || "keins");

  console.log("\n  UND ZUSAMMENGEFÜHRT");
  const morgen = erg.zusammen.filter((n) => n.text === "Guten Morgen!");
  ok(morgen.length === 1, "„Guten Morgen!“ steht genau einmal da — trotz einer Minute Uhrunterschied",
     morgen.length + "×");
  ok(erg.zusammen.length === 3, "drei Zeilen insgesamt, keine verloren", erg.zusammen.length + " Zeilen");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Nichts steht doppelt, nichts fehlt.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
