#!/usr/bin/env node
/* =========================================================
   TUT JEDER BEFEHL, DER IN DER LISTE STEHT, AUCH ETWAS?
   ---------------------------------------------------------
   Die Sonde pruefe-befehl-unbekannt.js prueft die eine
   Richtung: dass ein Befehl, den es NICHT gibt, nicht
   hinausgeht. Die andere Richtung stand nie unter Aufsicht —
   dass jeder Befehl, den es GIBT, auch wirklich etwas tut.

   Und genau dort lagen fuenf Blindgaenger: /route66, /lok2,
   /gglok2, /meteor2 und /schuss2 taten gar nichts. Kein
   Effekt, keine Zeile, nicht einmal eine Fehlermeldung. Der
   Grund war ein Muster ohne Ziffern in befehlAusfuehren,
   waehrend befehlBekannt Ziffern kannte: die Sperre gegen
   erfundene Befehle liess die Zeile durch, und dahinter fiel
   sie ins Leere. Wer /route66 tippte, sah nichts — und dass
   /highway dasselbe hätte tun sollen, weiss ja niemand.

   Hier wird deshalb JEDE Schreibweise getippt: die Langform
   jedes Befehls, seine Kurzform und jeder Alias. Gemessen
   wird nicht, ob das Richtige passiert — das pruefen die
   Sonden der einzelnen Ecken —, sondern ob UEBERHAUPT etwas
   passiert: entweder geht ein Paket hinaus, oder es kommt
   eine Zeile in den Chat.

   Dazu drei Fragen an die Tabellen selbst, denn ein Alias,
   der von einem Befehl verdeckt wird, ist eine Luege in der
   Hilfe:
     * steht eine Kurzform zweimal in der Befehlsliste?
     * zeigt ein Alias woandershin als der gleichnamige
       Befehl oder seine Kurzform?
     * steht ein Alias zweimal in der Aliastabelle?
   Gefunden wurden sechs: /gift versprach das kleine Geschenk
   und gab das grosse, /farbe versprach die Schriftfarbe und
   gab Paintball, /wueste, /wasser, /stumm und /diagnose
   zeigten ins Leere.

   Aufruf:  node werkzeug/pruefe-jeder-befehl.js
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".mp4": "video/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Die Aliastabelle steht im Modul und kommt nicht nach aussen. Sie
   wird deshalb aus der Datei gelesen — dasselbe Stueck Text, das der
   Browser ausfuehrt, also kein zweiter Stand, der veralten koennte. */
function tabellen() {
  const s = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const i = s.indexOf("  var KURZ = {"), j = s.indexOf("};", i);
  const blk = s.slice(i + 13, j + 1);
  const re = /([a-zäöüß0-9?]+|"[^"]+")\s*:\s*"([a-zäöüß0-9]+)"/g;
  const alias = []; let m;
  while ((m = re.exec(blk))) alias.push([m[1].replace(/"/g, ""), m[2]]);

  const a = s.indexOf("  var BEFEHLE = ["), b = s.indexOf("\n  ];", a);
  const bb = s.slice(a, b);
  const rb = /w: "([a-zäöüß0-9]+)"(?:,\s*kurz: "([a-zäöüß0-9]*)")?/g;
  const wort = {}, kurz = {}, kurzDoppelt = []; let mb;
  while ((mb = rb.exec(bb))) {
    wort[mb[1]] = true;
    if (mb[2]) {
      if (kurz[mb[2]] && kurz[mb[2]] !== mb[1]) kurzDoppelt.push("/" + mb[2] + ": " + kurz[mb[2]] + " und " + mb[1]);
      kurz[mb[2]] = mb[1];
    }
  }
  return { alias, wort, kurz, kurzDoppelt };
}

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const t = tabellen();

  console.log("\nDIE TABELLEN — verspricht die Hilfe etwas, das nicht eintritt?\n");
  pruefe("keine Kurzform ist zweimal vergeben", t.kurzDoppelt.length === 0, t.kurzDoppelt.join(" | "));

  const verdeckt = [], doppelt = [], gesehen = {};
  t.alias.forEach(([k, z]) => {
    if (t.wort[k]) verdeckt.push("/" + k + " -> " + z + " (es gibt den Befehl /" + k + " selbst)");
    else if (t.kurz[k] && t.kurz[k] !== z) verdeckt.push("/" + k + " -> " + z + " (Kurzform von /" + t.kurz[k] + ")");
    if (gesehen[k] && gesehen[k] !== z) doppelt.push("/" + k + ": " + gesehen[k] + " und " + z);
    gesehen[k] = z;
  });
  pruefe("kein Alias wird von einem Befehl verdeckt", verdeckt.length === 0, verdeckt.join(" | "));
  pruefe("kein Alias steht zweimal in der Tabelle", doppelt.length === 0, doppelt.join(" | "));

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.befehlsliste, { timeout: 20000 });

  /* Alles in EINEM Gang durch die Seite: 500 einzelne Aufrufe von
     aussen dauern Minuten, der Sammellauf ein paar Sekunden — und die
     Sammlung hat 120 Sekunden je Sonde. */
  const ergebnis = await pg.evaluate((alias) => {
    const liste = window.LiveChat.befehlsliste();
    const nach = {}; liste.forEach((b) => { nach[b.w] = b; });
    const probe = [];
    liste.forEach((b) => {
      /* „/me/" ist der Namenstrick mitten im Satz, kein Befehl, und
         „/leave" wuerde den Raum wechseln und alles Folgende
         verfaelschen. Beide haben eigene Sonden. */
      if (b.w !== "me/" && b.w !== "leave") probe.push([b.w, b]);
      if (b.kurz) probe.push([b.kurz, b]);
    });
    alias.forEach(([k, z]) => { const b = nach[z]; if (b && b.w !== "leave") probe.push([k, b]); });

    const tot = [];
    probe.forEach(([w, b]) => {
      let zeile = "/" + w;
      if (b.brauchtName) zeile += " Emmy";
      if (b.brauchtText) zeile += " hallo";
      let raus = null;
      window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
      const vor = (window.LiveChat.pruefZeilen(999) || []).length;
      /* NACHGEBESSERT IN RUNDE 21 — und zwar, weil die Messung zu eng
         war, nicht weil sie stoerte:
         „Tut etwas" hiess bisher nur zweierlei: es ging ein Rundruf
         hinaus, ODER es kam eine Zeile in den Chat. Es gibt aber eine
         dritte, voellig richtige Art: der Befehl OEFFNET EIN MENUE.
         /lesen tut genau das — man waehlt darin Niveau und Text, und
         eine Chatzeile waere dabei nur Laerm. Die Sonde hat das als
         Blindgaenger gemeldet, obwohl der Befehl arbeitet. Jetzt
         zaehlt auch ein aufgegangenes Menue als Wirkung. */
      const menueVor = document.querySelectorAll("#lcPlatzMenue, .lc-waehler, dialog[open]").length;
      let kaputt = "";
      try { window.LiveChat.schreiben(zeile); } catch (e) { kaputt = String(e).slice(0, 100); }
      const menueNach = document.querySelectorAll("#lcPlatzMenue, .lc-waehler, dialog[open]").length;
      const menueAuf = menueNach > menueVor;
      /* Wieder zumachen, sonst steht es dem naechsten Befehl im Weg. */
      if (menueAuf) {
        document.querySelectorAll("#lcPlatzMenue, .lc-waehler").forEach((x) => x.remove());
      }
      const zz = window.LiveChat.pruefZeilen(999) || [];
      const letzte = String(zz[zz.length - 1] || "");
      if (kaputt) tot.push(zeile + " — bricht ab: " + kaputt);
      else if (!raus && !menueAuf && zz.length === vor) tot.push(zeile + " — tut gar nichts (" + b.was + ")");
      else if (!raus && /kenne ich nicht/.test(letzte)) tot.push(zeile + " — gilt als unbekannt, steht aber in der Liste");
    });
    return { geprueft: probe.length, tot: tot };
  }, t.alias);

  console.log("\nJEDE SCHREIBWEISE EINMAL GETIPPT\n");
  pruefe("alle " + ergebnis.geprueft + " Schreibweisen tun etwas", ergebnis.tot.length === 0,
    ergebnis.tot.length ? ergebnis.tot.length + " Blindgaenger" : "kein Blindgaenger");
  ergebnis.tot.slice(0, 20).forEach((x) => console.log("         " + x));

  /* Und die Gegenprobe zum Ziffern-Muster: was WIRKLICH kommen muss. */
  console.log("\nDIE FUENF MIT ZIFFERN — und dass sie das Richtige ausloesen\n");
  /* Welche Wirkung jeweils die richtige ist, steht nicht im Namen:
     /lok2 und /gglok2 sind der zweite Zug-Film und tragen die Wirkung
     „zug", /meteor2 gehoert zu „armageddon". Nachgesehen, nicht
     geraten — und genau so aufgeschrieben, damit ein spaeterer Umbau
     hier auffaellt. */
  /* /lok2 und /gglok2 hiessen frueher „zug" — seit Fassung 349 gibt
     es nur noch EINE Lok (die bunte, traditionelle), und alle alten
     Namen zeigen auf sie. Die schwarze ist heraus, das spart 1,84 MB. */
  for (const [wort, soll] of [["route66", "route66"], ["lok2", "lok"], ["gglok2", "lok"],
                              ["meteor2", "armageddon"], ["schuss2", "tritt"]]) {
    const r = await pg.evaluate((w) => {
      let raus = null;
      window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
      window.LiveChat.schreiben("/" + w + " Emmy");
      return raus ? String(raus.wirkung || "") : "";
    }, wort);
    pruefe("/" + wort + " loest „" + soll + "“ aus", r === soll, r || "nichts");
  }

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Jeder Befehl in der Liste tut auch etwas.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
