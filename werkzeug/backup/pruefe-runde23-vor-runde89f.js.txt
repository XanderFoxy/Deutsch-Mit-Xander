#!/usr/bin/env node
/* =========================================================
   RUNDE 23 — VORLADEN, BEVOR ES GEBRAUCHT WIRD, DIE
   TRANSPORTLEISTE UND DAS FRISCHE WETTER
   ---------------------------------------------------------
   GEMELDET, woertlich:
   „Die Tiere laden immer noch so lange … es soll auch kein
    Ladebalken mitten im Chat sein."
   · „Man soll in dem Moment, wo man / schreibt, bevor man ihn
     ueberhaupt absendet, sollen die Effekte sich schon
     anfangen zu laden, ohne dass man das spuert — im
     Hintergrund soll das passieren … /l laedt alle Inhalte
     mit L … in dem Moment, wo man die Sektion Tiere anklickt,
     sollen alle Tiere von den Animationen schon geladen sein,
     dass der Loewe sofort fluessig abspielt."
   · „Wenn ich bei jemand anderem die Kopfhoerer aufsetzen
     soll, einmal der normale Effekt, und einmal soll ich die
     Moeglichkeit haben, nur ihn alleine mein Lied hoeren zu
     lassen, was ich selber aussuchen kann."
   · „Ich brauche fuer das Lied entweder eine Art kleine
     Transportleiste oder auch einen Pause-Befehl irgendwo."
   · „Im Kopf, wenn man die Seite aktualisiert, soll nicht ein
     altes Wetter angezeigt werden … wenn ich jetzt einen
     Sternenhimmel habe und ich aktualisiere die Seite, soll
     ich auch den Sternenhimmel sehen."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4",
  ".webm": "video/webm", ".mp4": "video/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const js  = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const lc  = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const fsp = fs.readFileSync(path.join(WURZEL, "filmspieler.js"), "utf8");

  console.log("\nKEIN LADEBALKEN MEHR IM CHAT\n");
  pruefe("der Balken ist raus",
    !/dma-film-warten/.test(fsp) && !/animation:dmaFilmDreh/.test(fsp));
  pruefe("statt seiner steht das erste Bild des Films da",
    /dma-film-standbild/.test(fsp) && /bild\.src = d\.bild/.test(fsp));
  pruefe("und das Vorladen holt dieses Bild gleich mit",
    /var vb = new Image\(\); vb\.src = d\.bild/.test(fsp));

  console.log("\nDIE GROESSE WIRD AM RICHTIGEN WEG GEMESSEN\n");
  const liste = JSON.parse(fs.readFileSync(path.join(WURZEL, "filme/liste.json"), "utf8"));
  const ohneMaske = liste.filme.filter((f) => !f.maskeBytes);
  pruefe("jeder Film nennt auch die Groesse seiner Maske",
    ohneMaske.length === 0,
    liste.filme.length + " Filme" + (ohneMaske.length ? ", ohne: " + ohneMaske.map((f) => f.name) : ""));
  const trex = liste.filme.find((f) => f.name === "trex");
  pruefe("und die Maske ist wirklich der kleinere Weg",
    trex && trex.maskeBytes < trex.bytes,
    trex ? "T-Rex: " + (trex.maskeBytes / 1048576).toFixed(2) + " MB Maske gegen "
      + (trex.bytes / 1048576).toFixed(2) + " MB webm" : "-");
  pruefe("die Seite rechnet mit dem Weg, den sie wirklich nimmt",
    /function lcFilmWiegt/.test(js) && /const wiegt = lcFilmWiegt;/.test(js));

  console.log("\nVORLADEN, WAEHREND ER NOCH TIPPT\n");
  pruefe("die Tipphilfe stoesst das Vorladen an",
    /lcVorschauLaden\(wert\.slice\(1, bis < 0 \? undefined : bis\)\)/.test(js));
  pruefe("eine Sektion im Tippfenster laedt ihre Filme",
    /lcFilmeHolenJetzt\(lcFilmeZuGruppe\(schluessel\)\)/.test(js));
  pruefe("und eine aufgeklappte Sektion im Befehlskasten auch",
    /addEventListener\("toggle"/.test(js) && /lc-befehlsgruppe" \) === false|lc-befehlsgruppe/.test(js));
  pruefe("geholt wird einer nach dem anderen",
    /lcFilmKette = lcFilmKette\.then/.test(js));
  pruefe("und bei Datensparen gar nicht",
    /if \(n && n\.saveData\) return;/.test(js));

  console.log("\nZWEIMAL KOPFHOERER UND EINE TRANSPORTLEISTE\n");
  pruefe("am fremden Platz steht „Sein Lied“", /knopf\("\\ud83c\\udfb6", "Sein Lied"/.test(js));
  /* ACHTUNG, HIER STAND FRUEHER: „und es schickt den Kopfhoerer MIT
     Lied" — also SOFORT, sobald man ein Lied antippt. Genau das hat
     Xander in Runde 85 zurueckgenommen: „Wenn ich den Kopfhoerer
     einmal druecke, dass ich die Option angezeigt bekomme, ob ich ihn
     nur schicken will oder mit Audio-Ausschnitt." Zwischen Liedwahl
     und Senden steht jetzt eine Frage (lcAusschnittWahl), und erst
     die schickt — ganz oder als Ausschnitt. */
  pruefe("nach der Liedwahl wird gefragt: ganzes Lied oder Ausschnitt?",
    /if \(einer\) \{ lcAusschnittWahl\(einer, i \+ 1, l\.titel\); return; \}/.test(js)
    && /function lcAusschnittWahl/.test(js));
  pruefe("und beides schickt den Kopfhoerer mit Lied",
    /"\/kopfhoerer " \+ fuerWen \+ " " \+ nr \+ \(zusatz \? " " \+ zusatz : ""\)/.test(js));
  pruefe("die Leiste hat Pause und Aus",
    /data-tun="pause"/.test(js) && /data-tun="aus"/.test(js));
  pruefe("es gibt auch einen Befehl dafuer",
    /wirkung: "musikpause"/.test(lc) && /wirkung: "musikweiter"/.test(lc));

  console.log("\nDAS WETTER KOMMT FRISCH\n");
  pruefe("der Abruf nimmt nichts aus dem Zwischenspeicher",
    /cache: "no-store"/.test(js));
  pruefe("und beim Zurueckkommen wird nachgeholt",
    /visibilitychange[\s\S]{0,120}wetterFrischHolen/.test(js)
    && /pageshow[\s\S]{0,160}wetterFrischHolen/.test(js));

  /* ---------- Und jetzt im Browser ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  const geholt = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  pg.on("request", (r) => { if (/\/filme\//.test(r.url())) geholt.push(r.url().split("/").pop()); });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_VORSCHAU && window.DMA_VORSCHAU.laden, { timeout: 20000 });
  /* Die Filmliste muss da sein, sonst weiss die Seite noch nicht,
     welche Namen ueberhaupt Filme sind. */
  await pg.evaluate(() => window.DMA_PRUEFUNG && window.DMA_PRUEFUNG.filmListe
    ? window.DMA_PRUEFUNG.filmListe() : null).catch(() => null);
  await pg.waitForTimeout(1500);

  console.log("\nGEMESSEN: „/l“ HOLT DEN LOEWEN\n");
  const el = await pg.evaluate(async () => {
    const vorher = window.DMA_VORSCHAU.stand().length;
    window.DMA_VORSCHAU.laden("l");
    await new Promise((f) => setTimeout(f, 2500));
    return { vorher: vorher, stand: window.DMA_VORSCHAU.stand() };
  });
  pruefe("„/l“ stellt Filme mit L in die Schlange",
    el.stand.indexOf("loewe") >= 0 && el.stand.indexOf("lok2") >= 0,
    el.stand.join(", ") || "nichts");
  pruefe("und sie werden wirklich geholt",
    geholt.some((d) => /^loewe/.test(d)),
    geholt.slice(0, 6).join(", ") || "nichts geholt");

  console.log("\nGEMESSEN: DIE SEKTION TIERE\n");
  const tiere = await pg.evaluate(async () => {
    const f = window.DMA_VORSCHAU.gruppe("tiere");
    await new Promise((x) => setTimeout(x, 2500));
    return f;
  });
  pruefe("die Sektion kennt ihre Filme",
    tiere.indexOf("trex") >= 0 && tiere.indexOf("katze") >= 0 && tiere.indexOf("adler") >= 0,
    tiere.join(", "));
  pruefe("und sie liegen danach im Speicher des Browsers",
    geholt.some((d) => /^katze/.test(d)) && geholt.some((d) => /^adler/.test(d)),
    geholt.length + " Dateien geholt");

  console.log("\nGEMESSEN: DIE TRANSPORTLEISTE\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const band = await pg.evaluate(async () => {
    const lieder = window.LiveChat.lieder();
    window.DMA_PRUEFUNG.wirkung("musik", "", "Alex",
      { lied: lieder[0].datei, liedTitel: lieder[0].titel });
    await new Promise((f) => setTimeout(f, 600));
    const b = document.getElementById("lcMusikBand");
    if (!b) return null;
    const pause = b.querySelector('[data-tun="pause"]');
    pause.click();
    await new Promise((f) => setTimeout(f, 200));
    const nachPause = window.DMA_PRUEFUNG.musikStand().laeuft;
    pause.click();
    await new Promise((f) => setTimeout(f, 300));
    const erg = { knoepfe: b.querySelectorAll(".lc-musikband-knopf").length,
                  titel: b.querySelector(".lc-musikband-titel").textContent,
                  soll: lieder[0].titel,
                  nachPause: nachPause,
                  nachWeiter: window.DMA_PRUEFUNG.musikStand().laeuft };
    b.querySelector('[data-tun="aus"]').click();
    await new Promise((f) => setTimeout(f, 200));
    erg.weg = !document.getElementById("lcMusikBand");
    return erg;
  });
  /* Das erste Lied heisst schlicht „Du" — an der Laenge des Titels
     laesst sich also nichts pruefen, wohl aber daran, dass genau der
     Titel dasteht, der aufgelegt wurde. */
  pruefe("die Leiste ist da und sagt, was laeuft",
    Boolean(band && band.knoepfe === 2 && band.titel === band.soll),
    band ? band.knoepfe + " Knoepfe, „" + band.titel + "“" : "keine Leiste");
  pruefe("Pause haelt an", Boolean(band && band.nachPause === false));
  pruefe("und Weiter laesst weiterlaufen", Boolean(band && band.nachWeiter === true));
  pruefe("Aus raeumt die Leiste weg", Boolean(band && band.weg));

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0,
    aufSeite.slice(0, 3).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nRunde 23 sitzt.");
  process.exit(fehler ? 1 : 0);
})();
