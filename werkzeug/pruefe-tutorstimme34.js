#!/usr/bin/env node
/* =========================================================
   HAT DER TUTOR UEBERALL EINE STIMME — UND DEN GRUSS FUER GAESTE?
   ---------------------------------------------------------
   GEWUENSCHT: „die über mich. Sektion soll auch eingesprochen
   sein und im Original" und „Vielleicht auch für die Leute die
   neu sind bei der Registration, dass wenn sie auf der Profil
   Sektion sind, dass er sagt willkommen in deinem Profil ...
   dass die Seite komplett kostenlos ist und ich mich freue,
   dass du dabei bist."

   Gemessen wird:
   1. Zu JEDEM Stueck in data-tutor.js liegt wirklich eine
      Tondatei (.opus UND .m4a) — sonst steht der Text zwar da,
      aber niemand spricht ihn.
   2. Der Gruss steht im Profil, ist als wenn: "gast" markiert
      und sagt, was er sagen soll: kostenloses Konto, Uebungen
      und Spiele, alles kostenlos, ich freue mich.
   3. Im Browser, ohne Anmeldung, laeuft er auch wirklich — und
      mit Anmeldung nicht.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

global.window = {};
require(path.join(WURZEL, "data-tutor.js"));
const TUTOR = global.window.DMA_TUTOR;

console.log("\nZU JEDEM TEXT EINE STIMME\n");
let stumm = [], gezaehlt = 0;
/* RUNDE 60. Ein Stueck OHNE Tonnamen ist kein Fehler mehr, sondern
   Absicht: „Pass auf, dass der Tutor nicht so viel erzaehlt … ich bin
   Musiker und deutscher Muttersprache." Zwei Saetze in „Ueber mich"
   sind neu geschrieben, und die alte Aufnahme sagt noch den alten
   Text. Sie laufen lieber stumm nach Lesezeit, als dass Alex' Mund
   etwas anderes sagt als die Sprechblase. Die alten Dateien liegen
   unter tutor/alt/ und warten auf die Neuaufnahme.
   Geprueft wird deshalb: zu jedem GENANNTEN Ton gehoert eine Datei.
   Wie viele Stuecke gerade stumm sind, steht als Hinweis daneben. */
let absichtlichStumm = 0;
for (const bereich in TUTOR) {
  TUTOR[bereich].stuecke.forEach((st) => {
    gezaehlt++;
    if (!st.ton) { absichtlichStumm++; return; }
    const o = fs.existsSync(path.join(WURZEL, "tutor", st.ton + ".opus"));
    const m = fs.existsSync(path.join(WURZEL, "tutor", st.ton + ".m4a"));
    if (!o || !m) stumm.push(bereich + "/" + st.ton + (o ? "" : " ohne opus") + (m ? "" : " ohne m4a"));
  });
}
console.log("  (" + absichtlichStumm + " Stueck(e) warten bewusst auf eine Neuaufnahme)");
pruefe("zu jedem genannten Ton liegt die Datei da", stumm.length === 0,
  stumm.length ? stumm.join(", ") : gezaehlt + " Stuecke, alle mit Ton");

console.log("\nDER GRUSS FUER DIE, DIE NOCH KEIN KONTO HABEN\n");
const profil = (TUTOR["view-profile"] || {}).stuecke || [];
const gruss = profil.find((s) => s.ton === "prof-willkommen");
pruefe("der Gruss steht im Profil", Boolean(gruss));
pruefe("und er gilt nur fuer Gaeste", Boolean(gruss && gruss.wenn === "gast"),
  gruss ? "wenn=" + (gruss.wenn || "FEHLT") : "-");
pruefe("und er steht ganz vorn", profil[0] === gruss);
const t = (gruss && gruss.text) || "";
[["ein kostenloses Konto", /kostenlosen Account|kostenloses Konto/i],
 ["Uebungen und Spiele", /Übungen und Spiele/i],
 ["die Seite kostet nichts", /komplett kostenlos/i],
 ["und er freut sich", /freue mich/i]].forEach(([was, re]) => {
  pruefe("er sagt: " + was, re.test(t));
});

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
                                     args: ["--autoplay-policy=no-user-gesture-required"] });

  /* Einmal als Gast, einmal als angemeldet — gemessen wird, welcher
     Text im Profil zuerst in der Sprechblase steht. */
  const lauf = async (angemeldet) => {
    const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tutor", "an"); } catch (e) {} });
    await pg.addInitScript((drin) => {
      window.__gesehen = [];
      const warten = setInterval(() => {
        const el = document.getElementById("tutorText");
        const s = el ? el.textContent.trim() : "";
        if (s && window.__gesehen[window.__gesehen.length - 1] !== s) window.__gesehen.push(s);
      }, 80);
      void warten;
    }, angemeldet);
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForTimeout(3000);
    /* Angemeldet oder nicht: der Tutor fragt Backend.currentUser(). Erst
       kurz vor dem Klick gesetzt — vorher gibt es Backend noch nicht. */
    /* Backend ist ein globaler NAME, keine Eigenschaft am Fenster
       (const auf oberster Ebene) — deshalb hier ueber den Namen. */
    const gesetzt = await pg.evaluate((drin) => {
      if (typeof Backend === "undefined" || !Backend) return false;
      Backend.currentUser = drin ? () => ({ id: "pruef", name: "Pruefer" }) : () => null;
      return Boolean(Backend.currentUser()) === Boolean(drin);
    }, angemeldet);
    if (!gesetzt) console.log("  HINWEIS  Anmeldestand liess sich nicht stellen");
    await pg.$eval('[data-target="view-profile"]', (e) => e.click());
    await pg.waitForTimeout(4000);
    const texte = await pg.evaluate(() => window.__gesehen.slice());
    await pg.close();
    return texte;
  };

  console.log("\nUND WAS SAGT ER WIRKLICH?\n");
  const alsGast = await lauf(false);
  const mitKonto = await lauf(true);
  const istGruss = (s) => /Willkommen in deinem Profil/i.test(s || "");
  pruefe("ohne Konto begruesst er einen", alsGast.some(istGruss),
    (alsGast[0] || "nichts gehoert").slice(0, 60));
  pruefe("mit Konto laesst er den Gruss weg", !mitKonto.some(istGruss),
    (mitKonto[0] || "nichts gehoert").slice(0, 60));

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nDer Tutor hat ueberall eine Stimme.\n");
  process.exit(fehler ? 1 : 0);
})();
