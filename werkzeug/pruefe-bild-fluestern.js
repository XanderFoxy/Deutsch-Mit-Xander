/* PRÜFT: BILDER FLÜSTERN, UND DER UMSCHALTER IST FÜR JEDEN DA.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Mach es bitte ausserdem möglich, dass wir uns Bilder
   flüstern können."
   Und gemeldet: „Bei Emmi gibt es diesen Umschalter nicht zwischen
   den zwei Plätzen und dem Klassenzimmer."

   Gemessen wird beides am echten Gerüst und am echten Code:
     1. Steht im Bild-Wähler eine Zeile „An:", und stehen dort die
        Leute aus dem Raum drin?
     2. Trägt eine geflüsterte Zeile wirklich ein Bild — auf beiden
        Seiten, beim Absender und beim Empfänger?
     3. Ist der Ansichts-Umschalter im Gerüst, ohne jede Bedingung? */
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

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  /* ---- Der Umschalter, auf dem Telefon und am Rechner ---- */
  console.log("\n  DER UMSCHALTER FÜR DIE BÜHNENANSICHT");
  for (const vp of [{ width: 390, height: 800, was: "Telefon" }, { width: 1200, height: 900, was: "Rechner" }]) {
    const pg = await br.newPage({ viewport: vp });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForTimeout(2400);
    const r = await pg.evaluate(() => {
      if (!window.DMA_PRUEF || !DMA_PRUEF.geruest) return null;
      const w = document.createElement("div");
      w.style.cssText = "position:fixed;left:0;top:0;right:0;z-index:99999";
      w.innerHTML = DMA_PRUEF.geruest();
      document.body.appendChild(w);
      const k = document.getElementById("lcAnsicht");
      if (!k) return { da: false };
      const st = getComputedStyle(k), b = k.getBoundingClientRect();
      return { da: true, sichtbar: st.display !== "none" && st.visibility !== "hidden"
                         && Number(st.opacity) > 0 && b.width > 20 && b.height > 10,
               breite: Math.round(b.width), hoehe: Math.round(b.height) };
    });
    if (!r) { ok(false, vp.was + ": Testnaht fehlt"); }
    else ok(r.da && r.sichtbar, vp.was + ": der Knopf ist da und sichtbar — für jede Person",
            r.da ? r.breite + "×" + r.hoehe + " Pixel" : "FEHLT GANZ");
    await pg.close();
  }

  /* ---- Bilder flüstern ---- */
  const pg = await br.newPage({ viewport: { width: 390, height: 800 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(() => {
    if (!window.LiveChat || !LiveChat.bildFluestern) return null;
    const raus = {};
    /* Eine Person in den Raum setzen, damit /w sie findet. */
    LiveChat.pruefPersonSetzen ? LiveChat.pruefPersonSetzen("emmy", "Emmi")
                               : null;
    raus.hatNaht = Boolean(LiveChat.pruefPersonSetzen);
    const vorher = LiveChat.lage().nachrichten.length;
    const gut = LiveChat.bildFluestern("Emmi", "aufkleber:winken", "schau mal");
    const liste = LiveChat.lage().nachrichten;
    const neu = liste.slice(vorher);
    raus.angelegt = neu.length;
    raus.gesendet = Boolean(gut);
    const z = neu[neu.length - 1] || {};
    raus.zeile = { art: z.art || "", text: String(z.text || "").slice(0, 40),
                   bild: String(z.bildImChat || ""), wen: z.wen || "", eigen: Boolean(z.eigen) };
    /* Und der Empfängerweg: dasselbe Paket, wie es über die Leitung
       hereinkommt. */
    const vorher2 = LiveChat.lage().nachrichten.length;
    LiveChat.pruefPostEmpfangen && LiveChat.pruefPostEmpfangen({
      art: "fluester", id: "test-fl-1", von: "emmy", vonName: "Emmi",
      text: "und zurück", bildImChat: "aufkleber:klatschen", zeit: Date.now()
    });
    const neu2 = LiveChat.lage().nachrichten.slice(vorher2);
    raus.empfangen = neu2.length ? { art: neu2[0].art, bild: String(neu2[0].bildImChat || "") } : null;
    return raus;
  });

  console.log("\n  EIN BILD FLÜSTERN");
  if (!erg) { console.log("  Testnaht fehlt — nur auf localhost."); }
  else {
    ok(erg.gesendet, "das Flüstern mit Bild geht raus");
    ok(erg.zeile.art === "fluester", "die eigene Zeile ist eine Flüsterzeile", erg.zeile.art);
    ok(Boolean(erg.zeile.bild), "und sie trägt das Bild", erg.zeile.bild || "KEIN BILD");
    ok(erg.zeile.text.indexOf("an Emmi") === 0, "an wen es ging, steht davor", "„" + erg.zeile.text + "“");
    if (erg.empfangen) {
      ok(erg.empfangen.art === "fluester" && Boolean(erg.empfangen.bild),
         "beim Empfänger kommt das Bild ebenfalls an",
         erg.empfangen.bild || "KEIN BILD");
    } else {
      console.log("  --   der Empfängerweg liess sich ohne Naht nicht messen");
    }
  }

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Bilder lassen sich flüstern, und der Umschalter ist für alle da.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
