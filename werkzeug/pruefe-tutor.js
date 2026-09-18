/* MISST, OB DER TUTOR SPRINGT ODER DOPPELT SPRICHT.
   ---------------------------------------------------------------
   GEMELDET: „In der Übersicht-Sektion springt der Tutor. Ich weiss
   nicht, ob er in einer anderen Sektion auch noch spricht. Aber
   überprüft das bitte mal, dass so etwas nicht passiert."

   Geraten wird hier nichts. Gemessen wird:

     1. WIE OFT die Bühne entsteht und wieder verschwindet, während
        man EINEN Bereich aufmacht. Mehr als einmal heisst: er
        springt — er kommt herein, geht wieder und kommt neu.
     2. OB je zwei Tonspuren GLEICHZEITIG laufen. Dazu wird das
        Audio-Element abgefangen; jedes play() und jedes Ende wird
        gezaehlt. Hoechststand > 1 heisst: zwei Alexe reden.
     3. WIE OFT der Text in der Blase wechselt, ohne dass ein Ton
        dazu lief — das ist das stille Durchrauschen.

   Der Ton selbst wird stummgeschaltet (volume 0), sonst muesste die
   Messung in Echtzeit warten. Gezaehlt wird trotzdem echt: die
   Dateien werden wirklich geladen und wirklich abgespielt. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
              ".json":"application/json", ".png":"image/png", ".svg":"image/svg+xml",
              ".opus":"audio/ogg", ".m4a":"audio/mp4", ".mp3":"audio/mpeg",
              ".webp":"image/webp", ".jpg":"image/jpeg", ".gif":"image/gif" };

const SPITZEL = () => {
  window.__T = { buehne: [], ton: [], text: [], gleichzeitig: 0, laufen: 0 };
  const t0 = Date.now();
  const zeit = () => Date.now() - t0;

  /* Jede Tonspur des Tutors abfangen. */
  const EchtAudio = window.Audio;
  window.Audio = function (src) {
    const a = new EchtAudio(src);
    if (String(src || "").indexOf("tutor/") >= 0) {
      a.volume = 0;
      const echtPlay = a.play.bind(a);
      a.play = function () {
        window.__T.laufen++;
        window.__T.gleichzeitig = Math.max(window.__T.gleichzeitig, window.__T.laufen);
        window.__T.ton.push({ t: zeit(), was: "an", src: String(src).split("/").pop().split("?")[0],
                              zugleich: window.__T.laufen });
        const fertig = (grund) => {
          if (a.__weg) return;
          a.__weg = true;
          window.__T.laufen--;
          window.__T.ton.push({ t: zeit(), was: "aus", grund: grund,
                                bei: Math.round((a.currentTime || 0) * 1000),
                                src: String(src).split("/").pop().split("?")[0] });
        };
        a.addEventListener("ended", () => fertig("zu Ende"));
        a.addEventListener("error", () => fertig("Datei fehlt"));
        const echtPause = a.pause.bind(a);
        a.pause = function () { fertig("ABGEWÜRGT"); return echtPause(); };
        return echtPlay();
      };
    }
    return a;
  };

  /* Bühne kommt und geht. Erst wenn es einen Körper gibt — beim
     Seitenstart gibt es ihn noch nicht, und ein Fehler hier würde
     den ganzen Spitzel abwürgen. */
  const anhaengen = () => { new MutationObserver((ls) => {
    ls.forEach((l) => {
      [...l.addedNodes].forEach((n) => { if (n.id === "tutorBuehne") window.__T.buehne.push({ t: zeit(), was: "kommt" }); });
      [...l.removedNodes].forEach((n) => { if (n.id === "tutorBuehne") window.__T.buehne.push({ t: zeit(), was: "geht" }); });
    });
  }).observe(document.body, { childList: true }); };
  if (document.body) anhaengen();
  else document.addEventListener("DOMContentLoaded", anhaengen);

  /* Was in der Blase steht. */
  setInterval(() => {
    const p = document.getElementById("tutorText");
    const jetzt = p ? p.textContent.trim().slice(0, 40) : "";
    const letzt = window.__T.text.length ? window.__T.text[window.__T.text.length - 1].s : null;
    if (jetzt && jetzt !== letzt) window.__T.text.push({ t: zeit(), s: jetzt, tonLief: window.__T.laufen > 0 });
  }, 60);
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
  const port = srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
                                     args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  await pg.addInitScript(SPITZEL);
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tutor", "an"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "domcontentloaded" });

  const runden = [];
  /* Runde 0: die Seite kommt hoch — das ist „Über mich". */
  await pg.waitForTimeout(6000);
  runden.push(["Start (Über mich)", await pg.evaluate(() => JSON.parse(JSON.stringify(window.__T)))]);

  for (const ziel of ["view-learn", "view-knowledge", "view-profile", "view-about"]) {
    await pg.evaluate(() => { window.__T.buehne = []; window.__T.ton = []; window.__T.text = []; window.__T.gleichzeitig = window.__T.laufen; });
    await pg.$eval(`[data-target="${ziel}"]`, (e) => e.click());
    await pg.waitForTimeout(6000);
    runden.push([ziel, await pg.evaluate(() => JSON.parse(JSON.stringify(window.__T)))]);
  }

  /* ZWEITER DURCHGANG NACH DEM NEULADEN.
     GEWUENSCHT: „Das System soll wissen, dass man ihn heute schon
     verwendet hat, auch wenn man die Seite aktualisiert." Also:
     dieselbe Runde noch einmal — und diesmal darf NICHTS mehr
     kommen. */
  await pg.reload({ waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(6000);
  runden.push(["nach dem Neuladen (Über mich)", await pg.evaluate(() => JSON.parse(JSON.stringify(window.__T)))]);
  for (const ziel of ["view-learn", "view-knowledge"]) {
    await pg.evaluate(() => { window.__T.buehne = []; window.__T.ton = []; window.__T.text = []; });
    await pg.$eval(`[data-target="${ziel}"]`, (e) => e.click());
    await pg.waitForTimeout(5000);
    runden.push(["nach dem Neuladen " + ziel, await pg.evaluate(() => JSON.parse(JSON.stringify(window.__T)))]);
  }

  runden.forEach(([name, d]) => {
    console.log("\n=== " + name + " ===");
    console.log("  Bühne:        " + (d.buehne.map((b) => b.was + "@" + b.t).join("  ") || "— nichts —"));
    const kommt = d.buehne.filter((b) => b.was === "kommt").length;
    console.log("  kommt " + kommt + "x  →  " + (kommt > 1 ? "SPRINGT" : "ruhig"));
    console.log("  Ton:");
    d.ton.forEach((x) => console.log("    " + String(x.t).padStart(6) + " ms  " + (x.was === "an" ? "▶ " : "■ ")
      + x.src.padEnd(18) + (x.was === "aus" ? x.grund + " (nach " + x.bei + " ms Ton)" : "")));
    if (!d.ton.length) console.log("    — kein Ton —");
    /* Nicht jedes Abwuergen ist ein Springen. Wer den Bereich
       wechselt, SOLL den vorigen Satz abschneiden — das ist richtig
       so. Ein Springen ist es erst, wenn ein Satz nach weniger als
       einer halben Sekunde abgeraeumt wird: dann hat ihn niemand
       gehoert, und es sah aus, als faenge Alex zweimal an. */
    const wuerg = d.ton.filter((x) => x.grund === "ABGEWÜRGT" && x.bei < 500).length;
    console.log("  zu frueh abgewürgt: " + wuerg + "  →  " + (wuerg ? "SPRINGT" : "keiner"));
    console.log("  gleichzeitig: " + d.gleichzeitig + "  →  " + (d.gleichzeitig > 1 ? "ZWEI STIMMEN" : "eine Stimme"));
    console.log("  Sätze (" + d.text.length + "):");
    d.text.forEach((x) => console.log("    " + String(x.t).padStart(5) + " ms  " + (x.tonLief ? "🔊" : "🔇") + "  " + x.s));
  });

  await br.close(); srv.close();
})();
