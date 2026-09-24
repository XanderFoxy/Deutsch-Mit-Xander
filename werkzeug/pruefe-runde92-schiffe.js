#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 92 — VERSTECKEN, COUNTDOWN, SUCHEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Das Schiffe versenken hast du nicht so gemacht,
   wie ich es dir gesagt habe … Das Schiffe versenken sollte 16 Plaetze
   haben, und es darf nicht sein, dass man die Animation desjenigen
   sieht, der sich versteckt, denn dann wird er direkt verraten. In dem
   Moment darf man nichts hoeren. Man darf ihn nur sprechen hoeren, aber
   man soll keine Animation an dem Platz sehen, wo das passiert. In dem
   Modus muss man wirklich versteckt bleiben koennen. Man muss sich
   erst einen Platz suchen, dann beginnt die Runde mit einem Countdown,
   und dann muss man sich gegenseitig suchen, der Reihe nach."

   Gemessen wird das Spielbrett in allen drei Abschnitten an der
   laufenden Seite.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_SCHIFFE && window.DMA_PRUEF
    && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  const brett = (stand) => pg.evaluate((stand) => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_SCHIFFE(stand);
    const karte = document.getElementById("livechatKarte");
    const kopf = document.querySelector(".lc-schiffe-kopfzeile");
    const felder = document.querySelectorAll(".lc-platz.lc-schiff-feld").length;
    const meins = document.querySelectorAll(".lc-schiff-meins").length;
    /* RUNDE 100 — die Zeichen sind gezeichnet statt Emoji (seine Regel:
       keine Emoji als Grafik). Ihre Art steht in data-art; fuer die
       Pruefungen unten wird sie in das alte Zeichen zurueckuebersetzt. */
    const alt = { meins: "🚢", daneben: "🌊", treffer: "💥" };
    const zeichen = [...document.querySelectorAll(".lc-schiff-zeichen")]
      .map((z) => z.textContent || alt[z.dataset.art] || "").filter(Boolean);
    return { kopf: kopf ? kopf.textContent : "",
             felder: felder, meins: meins, zeichen: zeichen,
             still: karte ? karte.classList.contains("lc-schiffe-still") : false,
             an: karte ? karte.classList.contains("lc-schiffe-an") : false };
  }, stand);

  console.log("\n1) DAS VERSTECKEN — heimlich\n");
  let b = await brett({ phase: "verstecken", plaetze: 16, tafel: {}, meins: 0,
                        reihe: [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }],
                        ichBin: "a", text: "Such dir heimlich einen Platz" });
  sage(b.felder === 16, "sechzehn Felder stehen bereit", b.felder + " Felder");
  sage(/heimlich|Such dir/.test(b.kopf), "und oben steht, was zu tun ist", b.kopf);
  sage(b.still === true, "die Sitzreihe ist still gestellt");
  sage(b.zeichen.length === 0, "kein einziges Feld verraet jemanden",
    b.zeichen.join(" ") || "nichts zu sehen");

  console.log("\n2) MEIN EIGENES VERSTECK — nur auf MEINEM Geraet\n");
  b = await brett({ phase: "verstecken", plaetze: 16, tafel: {}, meins: 7,
                    reihe: [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }],
                    ichBin: "a", text: "Du liegst auf Platz 7." });
  sage(b.meins === 1 && b.zeichen.filter((z) => z === "🚢").length === 1,
    "genau EIN Schiff ist markiert — meines", b.zeichen.join(" "));
  sage(/Platz 7/.test(b.kopf), "und oben steht, wo ich liege", b.kopf);
  sage(b.still === true, "die Sitzreihe bleibt still");

  console.log("\n3) DER COUNTDOWN\n");
  b = await brett({ phase: "countdown", countdown: 3, plaetze: 16, tafel: {}, meins: 7,
                    reihe: [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }],
                    ichBin: "a", text: "Alle sind versteckt" });
  sage(/3/.test(b.kopf), "er zaehlt herunter", b.kopf);
  sage(b.still === true, "und bis dahin bleibt die Reihe still");

  console.log("\n4) DIE SUCHE — der Reihe nach\n");
  b = await brett({ phase: "schiessen", plaetze: 16, tafel: { 3: "daneben" }, meins: 7,
                    reihe: [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }],
                    dran: "a", dranName: "Alex", ichBin: "a",
                    text: "Alex schießt auf Platz 3 — daneben." });
  sage(/dran/.test(b.kopf), "jetzt steht da, wer dran ist", b.kopf);
  sage(b.still === false, "und die Reihe darf sich wieder bewegen");
  sage(b.zeichen.indexOf("🌊") >= 0, "ein Fehlschuss steht auf dem Brett",
    b.zeichen.join(" "));

  sage(aufSeite.length === 0, "keine Fehler auf der Seite",
    aufSeite.slice(0, 2).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
