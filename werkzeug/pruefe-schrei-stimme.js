/* PRÜFT DEN SCHREI: STIMME NACH GESCHLECHT UND ECHTES ECHO.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Vielleicht je nach Person — wenn es ein Mann
   geschrieben hat, dass es dann männlich klingt, und wenn es eine
   Frau geschrieben hat, dass es dann weiblich klingt, aber halt
   wirklich mit dem dramatischen Effekt eines Schreis und nicht
   einfach nur wie ein Roboter … es soll auch dezent wie ein
   Nachhall sein."

   Dieses Gerät hat NULL Sprachausgabe-Stimmen installiert — man
   kann hier also nicht hören, ob es gut klingt. Was man prüfen
   kann, ist die Mechanik: wird die richtige Stimme gewählt, und
   wird daraus wirklich eine absteigende Echo-Kette gebaut? Dafür
   werden Stimmen untergeschoben, wie sie auf echten Geräten heißen. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 430, height: 860 } });
  await pg.addInitScript(() => {
    /* Stimmen, wie sie auf echten Geräten wirklich heißen. */
    const STIMMEN = [
      { name: "Google US English", lang: "en-US" },
      { name: "Anna",              lang: "de-DE" },
      { name: "Markus",            lang: "de-DE" },
      { name: "Microsoft Katja - German (Germany)", lang: "de-DE" },
      { name: "Microsoft Conrad - German (Germany)", lang: "de-DE" }
    ];
    const gesagt = [];
    window.__gesagt = gesagt;
    /* speechSynthesis ist am Fenster NUR LESBAR — eine einfache
       Zuweisung verpufft lautlos. Deshalb per defineProperty. */
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      getVoices: () => STIMMEN,
      cancel: () => {},
      speak: (u) => {
        gesagt.push({ text: u.text, stimme: u.voice && u.voice.name,
                      hoehe: u.pitch, tempo: u.rate, laut: u.volume });
        /* Sofort „fertig", damit die Kette weiterläuft. */
        setTimeout(() => { if (u.onend) u.onend(); }, 10);
      },
      addEventListener: () => {}
    } });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true,
      value: function (t) { this.text = t; this.pitch = 1; this.rate = 1; this.volume = 1; } });
  });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2600);

  const erg = await pg.evaluate(async () => {
    const aus = [];
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    if (!window.__schreiStimme) return ["Testnaht fehlt — nur auf localhost vorhanden."];

    aus.push("Stimmenwahl:");
    aus.push("  maennlich  -> " + (window.__schreiStimme("maennlich") || {}).name);
    aus.push("  weiblich   -> " + (window.__schreiStimme("weiblich") || {}).name);
    aus.push("  divers     -> " + (window.__schreiStimme("divers") || {}).name);
    aus.push("  nichts     -> " + (window.__schreiStimme("") || {}).name);

    async function kette(text, geschlecht) {
      /* Erst alles Laufende beruhigen, sonst faellt ein spaetes
         „fertig" des vorigen Rufs in die naechste Messung. */
      await warte(500);
      window.__gesagt.length = 0;
      try { window.__schallStoss(text, geschlecht); }
      catch (e) { return [{ text: "FEHLER: " + e.message, stimme: "-", hoehe: 0, tempo: 0, laut: 0 }]; }
      await warte(700);
      return window.__gesagt.slice();
    }

    const kurz = await kette("RUHE JETZT", "maennlich");
    aus.push("");
    aus.push("„RUHE JETZT\" von einem Mann — " + kurz.length + " Durchgänge:");
    kurz.forEach((g, i) => aus.push("  " + (i + 1) + ". " + g.stimme
      + "  Tonhöhe " + g.hoehe.toFixed(3) + "  Tempo " + g.tempo.toFixed(2)
      + "  Lautstärke " + g.laut.toFixed(2)));

    const frau = await kette("RUHE JETZT", "weiblich");
    aus.push("");
    aus.push("Derselbe Ruf von einer Frau:");
    frau.forEach((g, i) => aus.push("  " + (i + 1) + ". " + g.stimme
      + "  Tonhöhe " + g.hoehe.toFixed(3) + "  Lautstärke " + g.laut.toFixed(2)));

    const mittel = await kette("Kommt jetzt bitte alle ins Klassenzimmer zurueck", "maennlich");
    const lang = await kette("Kommt jetzt bitte alle ins Klassenzimmer zurueck, denn der Unterricht faengt gleich an und ich moechte niemanden verpassen", "maennlich");
    aus.push("");
    aus.push("Wie viel Echo, je nach Länge:");
    aus.push("  10 Zeichen  -> " + kurz.length + " Durchgänge");
    aus.push("  47 Zeichen  -> " + mittel.length + " Durchgänge");
    aus.push("  136 Zeichen -> " + lang.length + " Durchgänge");

    /* Fällt das Echo wirklich ab? */
    const fallend = kurz.length > 1
      && kurz.every((g, i) => i === 0 || (g.laut < kurz[i - 1].laut && g.hoehe < kurz[i - 1].hoehe));
    aus.push("");
    aus.push("Wird jedes Echo leiser UND tiefer: " + (fallend ? "ja" : "NEIN"));
    aus.push("Frauenstimme bleibt oberhalb der Männerstimme: "
      + ((frau[0] && kurz[0] && frau[0].hoehe > kurz[0].hoehe)
         ? "ja (" + frau[0].hoehe + " > " + kurz[0].hoehe + ")"
         : "NEIN — frau=" + JSON.stringify(frau[0]) + " mann=" + JSON.stringify(kurz[0])));
    return aus;
  });
  erg.forEach((z) => console.log("  " + z));
  await br.close(); srv.close();
})();
