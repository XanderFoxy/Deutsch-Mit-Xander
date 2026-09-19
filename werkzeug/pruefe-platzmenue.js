#!/usr/bin/env node
/* =========================================================
   DAS MENUE AM PROFILBILD — UND WAS ES AUSLOEST
   ---------------------------------------------------------
   GEWUENSCHT: „Wenn man jemand anderen gedrückt hält, dann
   sollen nur diese Befehle sein … es könnte noch ein Kick
   sein, wo man gegen das Profilbild tritt und das dann wie
   so ein Fussball wegfliegt … Man kann auch die Herzen direkt
   an die Person schicken … oder dass man Wassereimer drüber
   kippt … oder eine Wolke über denjenigen, wo man es regnen
   lässt … Aber das sind dann nur ganz kleine Symbole, die
   halt passend in der Größe vom Profilbild sind."

   Gemessen wird:
   1. Jeder neue Befehl ist da und schickt die richtige Wirkung
      MIT NAMEN los (ohne Namen trifft sie niemanden).
   2. Jede Animation haengt danach wirklich AM PLATZ — und
      nicht irgendwo im Dokument.
   3. Sie ist nicht groesser als der Platz: „in der Groesse vom
      Profilbild".
   4. Der lange Druck oeffnet das Menue, und ein Tipp daneben
      macht es wieder zu.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Befehl -> erwartete Wirkung -> Klasse, die am Platz haengen muss */
const PAARE = [
  ["/tritt Emmi",    "tritt",       "lc-tritt"],
  ["/herz Emmi",     "zherz",       "lc-zherz"],
  ["/wasser Emmi",   "eimer",       "lc-eimer"],
  ["/wecker Emmi",   "wecker",      "lc-wecker"],
  ["/regen Emmi",    "regenwolke",  "lc-zwolke"],
  ["/gewitter Emmi", "donnerwolke", "lc-zdonner"],
  ["/geld Emmi",     "reichtum",    "lc-zgeld"],
  ["/bonbon Emmi",   "zucker",      "lc-zzucker"],
  ["/hammer Emmi",   "hammer",      "lc-zhammer"]
];

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 760 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nDIE BEFEHLE — UND WAS SIE SCHICKEN\n");
  for (const [zeile, wirkung] of PAARE) {
    const paket = await pg.evaluate((z) => {
      let raus = null;
      window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
      window.LiveChat.pruefBefehl(z);
      return raus;
    }, zeile);
    pruefe("„" + zeile + "“ schickt die Wirkung „" + wirkung + "“",
      Boolean(paket) && String(paket.wirkung || "") === wirkung,
      paket ? (paket.wirkung || "ohne Wirkung") + " · " + String(paket.text || "") : "nichts abgefangen");
    pruefe("… und sagt, WEN es meint", Boolean(paket && paket.wen === "Emmi"),
      paket ? "wen=" + (paket.wen || "FEHLT") : "-");
  }

  console.log("\nDIE ANIMATION HAENGT AM PLATZ\n");
  for (const [, wirkung, klasse] of PAARE) {
    const d = await pg.evaluate(async (w) => {
      document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(w, "Emmi");
      await new Promise((f) => setTimeout(f, 160));
      const schicht = document.querySelector(".lc-zp");
      if (!schicht) return { da: false };
      const platz = schicht.closest(".lc-platz");
      const kreis = schicht.closest(".lc-kreis");
      const sr = schicht.getBoundingClientRect();
      /* Gemessen wird am KREIS — das ist das Profilbild, und „in der
         Groesse vom Profilbild" war die Ansage. */
      const pr = kreis ? kreis.getBoundingClientRect() : null;
      return {
        da: true,
        amPlatz: Boolean(platz),
        name: platz ? (platz.querySelector(".lc-platz-name") || {}).textContent : "",
        klassen: schicht.className,
        imKreis: Boolean(kreis),
        breiter: pr ? Math.round(sr.width - pr.width) : 999,
        kinder: schicht.children.length
      };
    }, wirkung);
    pruefe(wirkung + " zeichnet etwas", d.da && d.kinder > 0,
      d.da ? d.kinder + " Teile" : "nichts");
    pruefe(wirkung + " haengt am richtigen Platz", Boolean(d.amPlatz) && /Emmi/i.test(d.name || ""),
      (d.name || "-").trim());
    pruefe(wirkung + " sitzt im Profilbild und ist nicht groesser",
      Boolean(d.imKreis) && d.breiter <= 2,
      d.imKreis ? d.breiter + " px breiter als das Bild" : "haengt nicht im Kreis");
    pruefe(wirkung + " traegt ihre eigene Klasse", String(d.klassen || "").indexOf(klasse) >= 0,
      d.klassen || "-");
  }

  console.log("\nDER LANGE DRUCK\n");
  const menue = await pg.evaluate(async () => {
    const platz = document.querySelector('.lc-platz[data-lc-platz="2"]');
    if (!platz) return { fehlt: "kein Platz 2" };
    /* Den langen Druck nachstellen: das Menue direkt rufen, so wie es
       der Halte-Zeitgeber tut. */
    const auf = window.DMA_PRUEFUNG.platzMenue(platz);
    const k = document.getElementById("lcPlatzMenue");
    const r = k ? k.getBoundingClientRect() : null;
    return {
      auf: auf,
      da: Boolean(k),
      knoepfe: k ? k.querySelectorAll(".lc-platzmenue-knopf").length : 0,
      kopf: k ? (k.querySelector(".lc-platzmenue-kopf") || {}).textContent : "",
      imBild: r ? (r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth + 1) : false
    };
  });
  pruefe("der lange Druck oeffnet das Menue", Boolean(menue.da), menue.fehlt || "");
  pruefe("es nennt die Person", /Emmi/i.test(menue.kopf || ""), (menue.kopf || "-").trim());
  pruefe("es hat alle Spielzeuge", menue.knoepfe >= 12, menue.knoepfe + " Knoepfe");
  pruefe("es steht ganz im Bild", Boolean(menue.imBild));

  const zu = await pg.evaluate(async () => {
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await new Promise((f) => setTimeout(f, 60));
    return !document.getElementById("lcPlatzMenue");
  });
  pruefe("ein Tipp daneben macht es wieder zu", zu);

  /* Und auf dem eigenen Platz steht das Bild obenan. */
  const eigen = await pg.evaluate(() => {
    const platz = document.querySelector('.lc-platz[data-lc-platz="1"]');
    platz.classList.add("lc-platz-ich");
    window.DMA_PRUEFUNG.platzMenue(platz);
    const k = document.getElementById("lcPlatzMenue");
    const erster = k ? k.querySelector(".lc-platzmenue-wort") : null;
    const wort = erster ? erster.textContent : "";
    if (k) k.remove();
    return wort;
  });
  pruefe("auf dem eigenen Platz steht das Profilbild obenan",
    /Profilbild/i.test(eigen), eigen || "-");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Das Profilbild laesst mit sich spielen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
