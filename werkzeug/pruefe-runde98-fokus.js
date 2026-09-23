#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER FOKUS BLEIBT, UND ER GILT FUER ALLE
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „ausserdem gibt es keinen gleichbleibenden
   Modus, der fuer alle dieses Ding festmacht. Wenn ich auf Fokus
   gehe, dann gehe ich davon aus, dass das unten am untersten im
   Chatraum ist, dass alle das immer lesen und dass das niemand
   stoeren kann … solange das festgepinnt ist, ist es in Platz und das
   kann niemand verhindern und den Fokus muessen alle immer sehen …
   alles, was geschrieben wird, kommt zwar in der History nach dem
   Modul zeitlich auch, aber solange man Unterricht hat, rutscht die
   Chatzeile deswegen nicht weiter … das Modul bleibt angepinnt, dass
   man fokussiert lesen kann."

   DREI MESSUNGEN:
     1. WO LIEGT DAS MODUL? Angepinnt gehoert es in das Fokusband
        UNTER dem rollenden Verlauf — nicht mehr hinein. Gemessen wird
        der Elternknoten UND die Lage auf dem Bildschirm.
     2. SCHIEBT ES IRGENDJEMAND WEG? Dreissig neue Chatzeilen werden
        hineingeschrieben. Vorher rutschte das Modul mit nach oben,
        sobald man nicht ganz unten stand. Gemessen wird seine
        Bildschirmlage vor und nach den dreissig Zeilen: sie muss
        dieselbe sein.
     3. GILT ER FUER ALLE? Eine Meldung „lesefest" aus dem Raum — so,
        wie sie von einem anderen Geraet kaeme — muss das Modul auch
        hier anpinnen, ohne dass jemand hier etwas angetippt hat.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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
  const pg = await br.newPage({ viewport: { width: 412, height: 860 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_LESEFEST
    && window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  console.log("\nDAS MODUL LIEGT UNTER DEM CHAT, NICHT DARIN\n");
  const lage = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    const verlauf = document.getElementById("lcVerlauf");
    const band = document.getElementById("lcFokusband");
    if (!verlauf || !band) return { grund: "kein Band" };
    /* Erst ein paar gewoehnliche Zeilen, damit es etwas zu
       verdraengen gibt. */
    const zeileBauen = (text) => {
      const z = document.createElement("p");
      z.className = "lc-zeile";
      const uhr = document.createElement("span");
      uhr.className = "lc-zeit"; uhr.textContent = "09:00";
      const nam = document.createElement("b");
      nam.className = "lc-nick"; nam.textContent = "Bea:";
      const t = document.createElement("span");
      t.className = "lc-zeilentext"; t.textContent = text;
      z.appendChild(uhr); z.appendChild(nam); z.appendChild(t);
      verlauf.appendChild(z);
      return z;
    };
    for (let i = 0; i < 8; i++) zeileBauen("Eine gewoehnliche Zeile " + i);
    /* Und dann die Lesetafel, wie sie aus einer Nachricht entsteht. */
    const z = document.createElement("p");
    z.className = "lc-zeile";
    const uhr = document.createElement("span");
    uhr.className = "lc-zeit"; uhr.textContent = "09:12";
    const nam = document.createElement("b");
    nam.className = "lc-nick"; nam.textContent = "Alex:";
    z.appendChild(uhr); z.appendChild(nam);
    verlauf.appendChild(z);
    window.DMA_PRUEFUNG.lesetafel({ id: "tf1", text: "Lies vor.", leseNiveau: "B1",
      leseTitel: "Die Reise nach Hamburg",
      leseZeilen: ["Erster Satz.", "Zweiter Satz.", "Dritter Satz."] }, z);
    await new Promise((f) => setTimeout(f, 200));
    const vorherEltern = (z.parentElement || {}).id || "";
    /* JETZT ANPINNEN. */
    window.DMA_LESEFEST.setzen("tf1");
    await new Promise((f) => setTimeout(f, 200));
    const tafel = document.querySelector('.lc-lesetafel[data-lese-id="tf1"]');
    const zeile = tafel && (tafel.closest(".lc-zeile") || tafel.parentElement);
    const rv = verlauf.getBoundingClientRect();
    const rt = tafel ? tafel.getBoundingClientRect() : null;
    return {
      vorherEltern: vorherEltern,
      nachherEltern: zeile ? ((zeile.parentElement || {}).id || "") : "",
      bandSichtbar: !band.hidden,
      hatKlasse: Boolean(tafel && tafel.classList.contains("lc-lese-fest")),
      /* Unter dem Verlauf heisst: sein oberer Rand liegt nicht ueber
         dem unteren Rand des rollenden Kastens. */
      obenVomModul: rt ? Math.round(rt.top) : 0,
      untenVomVerlauf: Math.round(rv.bottom),
      modulOben: rt ? Math.round(rt.top) : 0
    };
  });
  sage(lage.vorherEltern === "lcVerlauf",
    "vor dem Anpinnen steht die Tafel im Chatverlauf", lage.vorherEltern || "-");
  sage(lage.nachherEltern === "lcFokusband",
    "und danach im Fokusband unter dem Chat", lage.nachherEltern || "-");
  sage(lage.bandSichtbar && lage.hatKlasse, "das Band ist sichtbar und die Tafel markiert");
  sage(lage.obenVomModul >= lage.untenVomVerlauf - 2,
    "das Modul liegt wirklich UNTER dem rollenden Kasten",
    "Modul beginnt bei " + lage.obenVomModul
      + " px, der Verlauf endet bei " + lage.untenVomVerlauf + " px");

  console.log("\nUND NIEMAND SCHIEBT ES WEG\n");
  const bleibt = await pg.evaluate(async () => {
    const tafel = document.querySelector('.lc-lesetafel[data-lese-id="tf1"]');
    const verlauf = document.getElementById("lcVerlauf");
    if (!tafel || !verlauf) return null;
    const vorher = Math.round(tafel.getBoundingClientRect().top);
    /* Dreissig neue Zeilen — genau das, was vorher das Modul
       weggeschoben hat. */
    for (let i = 0; i < 30; i++) {
      const z = document.createElement("p");
      z.className = "lc-zeile";
      const uhr = document.createElement("span");
      uhr.className = "lc-zeit"; uhr.textContent = "09:2" + (i % 10);
      const nam = document.createElement("b");
      nam.className = "lc-nick"; nam.textContent = "Cem:";
      const t = document.createElement("span");
      t.className = "lc-zeilentext"; t.textContent = "Dazwischenreden Nummer " + i;
      z.appendChild(uhr); z.appendChild(nam); z.appendChild(t);
      verlauf.appendChild(z);
    }
    await new Promise((f) => setTimeout(f, 250));
    /* Und obendrein: der Verlauf wird nach oben gerollt, so wie
       jemand, der zurueckliest. Auch dann muss das Modul stehen. */
    verlauf.scrollTop = 0;
    await new Promise((f) => setTimeout(f, 200));
    const nachScrollen = Math.round(tafel.getBoundingClientRect().top);
    return { vorher: vorher, nachher: Math.round(tafel.getBoundingClientRect().top),
      nachScrollen: nachScrollen,
      nochImBand: (tafel.closest(".lc-zeile") || {}).parentElement
        === document.getElementById("lcFokusband"),
      zeilenImVerlauf: verlauf.querySelectorAll(".lc-zeile").length };
  });
  sage(bleibt && Math.abs(bleibt.nachher - bleibt.vorher) <= 2,
    "dreissig neue Chatzeilen ruecken das Modul nicht von der Stelle",
    bleibt ? "vorher " + bleibt.vorher + " px, nachher " + bleibt.nachher
      + " px (" + bleibt.zeilenImVerlauf + " Zeilen im Verlauf)" : "-");
  sage(bleibt && Math.abs(bleibt.nachScrollen - bleibt.vorher) <= 2,
    "und auch beim Zurueckblaettern bleibt es stehen",
    bleibt ? "nach dem Hochrollen " + bleibt.nachScrollen + " px" : "-");
  sage(bleibt && bleibt.nochImBand, "es liegt weiterhin im Fokusband");

  console.log("\nUND ER GILT FUER ALLE\n");
  const fuerAlle = await pg.evaluate(async () => {
    /* Erst wieder loesen — so, als haette niemand etwas angepinnt. */
    window.DMA_LESEFEST.setzen("");
    await new Promise((f) => setTimeout(f, 200));
    const band = document.getElementById("lcFokusband");
    const losgeloest = band.children.length === 0;
    /* Und jetzt die Meldung, wie sie von einem anderen Geraet
       hereinkaeme. Angetippt wird hier NICHTS. */
    window.DMA_LESEFEST.vonAussen("tf1");
    await new Promise((f) => setTimeout(f, 200));
    const tafel = document.querySelector('.lc-lesetafel[data-lese-id="tf1"]');
    return { losgeloest: losgeloest,
      angepinnt: Boolean(tafel && (tafel.closest(".lc-zeile") || {}).parentElement === band),
      welche: window.DMA_LESEFEST.welche() };
  });
  sage(fuerAlle.losgeloest, "loesen nimmt das Modul wieder aus dem Band");
  sage(fuerAlle.angepinnt && fuerAlle.welche === "tf1",
    "eine Fokus-Meldung aus dem Raum pinnt es hier an, ohne dass jemand tippt",
    "angepinnt: " + fuerAlle.welche);

  /* Und der Weg nach draussen: setzt der Fuehrende den Fokus, geht
     eine Meldung hinaus. Gemessen an LiveChat selbst. */
  const raus = await pg.evaluate(() => {
    if (!window.LiveChat || !LiveChat.leseFestSetzen) return { grund: "kein Weg" };
    return { gibtEs: true, welcheVorher: LiveChat.leseFestWelche
      ? LiveChat.leseFestWelche() : "?" };
  });
  sage(raus.gibtEs, "und es gibt den Weg hinaus in den Raum (LiveChat.leseFestSetzen)",
    raus.grund || "vorhanden");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
