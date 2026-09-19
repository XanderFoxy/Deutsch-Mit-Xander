/* PRÜFT: GESCHRIEEN WIRD AUCH OHNE DEUTSCHE STIMME.
   ---------------------------------------------------------------
   GEMELDET: „Du hattest gesagt, dass du eine Echoüberlagerung von den
   Stimmen erzeugen kannst … aber ich höre immer noch den alten
   Sound."

   Der Grund stand im Code als hartes Nein: fand sich keine DEUTSCHE
   Stimme, wurde gar nicht gesprochen — es blieb beim alten Hall. Auf
   dem Telefon passiert genau das ständig: die Stimmenliste ist beim
   ersten Aufruf noch leer (sie kommt erst mit „voiceschanged" nach),
   und manche Geräte haben überhaupt keine deutsche Stimme.

   Gemessen werden beide Fälle — nur englische Stimmen, und eine Liste,
   die erst verspätet eintrifft. */
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

  await pg.addInitScript(() => {
    /* Ein Telefon OHNE deutsche Stimme — und die Liste kommt auch
       noch verspätet, genau wie auf Android. */
    window.__spaet = [];
    let stimmen = [];
    const gesagt = [];
    window.__gesagt = gesagt;
    window.__stimmenNachreichen = () => {
      stimmen = [{ name: "Microsoft Katja - German (Germany)", lang: "de-DE" }];
      (window.__spaet || []).forEach((f) => { try { f(); } catch (e) {} });
      window.__spaet = [];
    };
    window.__nurEnglisch = () => { stimmen = [{ name: "Samantha", lang: "en-US" }]; };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      getVoices: () => stimmen,
      cancel: () => {},
      speak: (u) => {
        gesagt.push({ text: u.text, stimme: (u.voice && u.voice.name) || "(Standardstimme)",
                      sprache: u.lang, hoehe: u.pitch, laut: u.volume });
        setTimeout(() => { if (u.onend) u.onend(); }, 10);
      },
      addEventListener: (art, f) => { if (art === "voiceschanged") window.__spaet.push(f); }
    } });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true,
      value: function (t) { this.text = t; this.pitch = 1; this.rate = 1; this.volume = 1; } });
  });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2600);

  const erg = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    if (!window.__schallStoss) return null;
    const raus = {};

    /* 1. Die Liste ist noch leer — wie beim ersten Schrei auf dem
          Telefon. */
    window.__gesagt.length = 0;
    window.__schallStoss("HALLO", "weiblich");
    await warte(120);
    raus.sofort = window.__gesagt.length;
    /* Jetzt kommt die Liste nach — und es MUSS geschrien werden. */
    window.__stimmenNachreichen();
    await warte(400);
    raus.nachgereicht = window.__gesagt.map((g) => g.stimme + " / " + g.sprache);

    /* 2. Ein Gerät, das nur Englisch kann. */
    await warte(300);
    window.__nurEnglisch();
    window.__gesagt.length = 0;
    window.__schallStoss("HALLO", "maennlich");
    await warte(400);
    raus.nurEnglisch = window.__gesagt.map((g) => g.stimme + " / " + g.sprache);
    raus.hoehen = window.__gesagt.map((g) => g.hoehe);
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  if (!erg) { console.log("  Testnaht fehlt — nur auf localhost."); process.exit(1); }

  console.log("\n  DIE STIMMENLISTE KOMMT ERST SPÄTER (Android)");
  ok(erg.sofort === 0, "beim ersten Anlauf wird noch nicht gesprochen", erg.sofort + "×");
  ok(erg.nachgereicht.length >= 2,
     "sobald die Liste da ist, wird geschrien — mit Echo",
     erg.nachgereicht.length + " Durchgänge: " + erg.nachgereicht.join(" · "));

  console.log("\n  EIN GERÄT OHNE DEUTSCHE STIMME");
  ok(erg.nurEnglisch.length >= 2, "es wird trotzdem gesprochen, mit Echo",
     erg.nurEnglisch.length + " Durchgänge");
  ok(erg.nurEnglisch.every((x) => x.indexOf("(Standardstimme)") === 0),
     "und zwar mit der Standardstimme des Geräts");
  ok(erg.nurEnglisch.every((x) => / \/ de-DE$/.test(x)), "auf Deutsch gestellt",
     erg.nurEnglisch[0]);
  ok(erg.hoehen[0] < 0.5, "ein Mann klingt dabei tief", "Tonhöhe " + erg.hoehen[0]);
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Geschrien wird überall.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
