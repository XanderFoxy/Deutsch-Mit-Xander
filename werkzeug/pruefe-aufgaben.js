/* PRÜFT DIE KLASSENZIMMER-AUFGABEN.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Einmal, dass man die Wörter verdrehen kann … und die
   Leute sollen richtig schreiben, wie es richtig geschrieben wird …
   und das gibt Punkte."

   Gemessen wird dreierlei, und zwar ohne zu raten:
     1. Ist die Aufgabe WIRKLICH verdreht — oder kam zufällig die
        Ursprungsreihenfolge heraus?
     2. Enthält sie genau dieselben Teile wie die Lösung?
     3. Erkennt die Prüfung die richtige Antwort — und weist sie
        die falsche ab, auch bei anderer Gross-/Kleinschreibung? */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const port = srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage();
  await pg.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  const erg = await pg.evaluate(() => {
    const raus = [];
    const gestellt = [];
    /* Die Aufgabe geht als Rundruf hinaus — den fangen wir ab, statt
       einen echten Raum zu betreten. */
    if (LiveChat.pruefAbfangen) LiveChat.pruefAbfangen((p) => gestellt.push(p));
    const versuch = (typ, text, antworten) => {
      gestellt.length = 0;
      let fehler = "";
      try { LiveChat.pruefAufgabeStellen(typ, text); } catch (e) { fehler = String(e.message || e); }
      const a = LiveChat.pruefAufgabe();
      const rundruf = gestellt.filter((p) => p.chatArt === "aufgabe").pop();
      const gezeigt = rundruf ? String(rundruf.text).split(":")[1] : "";
      const teile = gezeigt.split("·").map((x) => x.trim()).filter(Boolean);
      const soll = typ === "satz" ? text.split(/\s+/) : Array.from(text);
      const antw = [];
      (antworten || []).forEach((w, i) => {
        const vorher = LiveChat.pruefAufgabe();
        LiveChat.pruefAufgabeAntwort("pruef" + i, "Prüfer" + i, w);
        const nachher = LiveChat.pruefAufgabe();
        antw.push({ text: w, angenommen: (nachher ? nachher.richtige : 0) > (vorher ? vorher.richtige : 0) });
      });
      return { typ, text, fehler,
               loesungGemerkt: a ? a.loesung : null,
               gezeigt: teile.join(" · "),
               verdreht: teile.join("") !== soll.join(""),
               gleicheTeile: teile.slice().sort().join("|") === soll.slice().sort().join("|"),
               antworten: antw };
    };
    raus.push(versuch("satz", "Der Hund läuft über die Wiese",
      ["Der Hund sitzt", "der hund läuft über die wiese"]));
    raus.push(versuch("wort", "Fahrrad", ["Fahhrad", "fahrrad"]));
    return raus;
  });

  erg.forEach((e) => {
    console.log("\n=== /" + e.typ + " " + e.text + " ===");
    if (e.fehler) console.log("  Fehler beim Stellen: " + e.fehler);
    console.log("  gezeigt:        " + e.gezeigt);
    console.log("  verdreht:       " + (e.verdreht ? "ja" : "NEIN — steht wie im Original"));
    console.log("  gleiche Teile:  " + (e.gleicheTeile ? "ja" : "NEIN — es fehlt oder es ist zu viel"));
    console.log("  Lösung gemerkt: " + JSON.stringify(e.loesungGemerkt));
    console.log("  Lösung im Rundruf: " + (e.gezeigt.replace(/ · /g, e.typ === "wort" ? "" : " ") === e.text ? "JA — schlecht" : "nein"));
    e.antworten.forEach((a) => console.log("    „" + a.text + "“ → " + (a.angenommen ? "✅ angenommen" : "✗ abgelehnt")));
  });
  const ok = erg.every((e) => e.verdreht && e.gleicheTeile
    && e.antworten.length === 2 && !e.antworten[0].angenommen && e.antworten[1].angenommen);
  console.log(ok ? "\n✅ Beide Aufgaben verdreht, vollständig, und nur die richtige Antwort zählt."
                 : "\n❌ Etwas stimmt nicht.");
  await br.close(); srv.close();
})();
