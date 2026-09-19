/* PRÜFT: NAMENSVORSCHLÄGE UND SELBST ANGEHEFTETE FAVORITEN.
   ---------------------------------------------------------------
   GEMELDET: „Wenn ich /w schreibe, sollen mir die anzuflüsternden
   Namen vorgeschlagen werden — egal, ob die Person in einem anderen
   Raum ist. Es soll alle Räume kennen, alle Personen, egal ob
   abgeschlossen oder nicht."
   Und: „Meine Favoriten kann ich immer noch nicht anlegen."

   Der Grund fürs erste stand in livechat.js: ob ein Befehl einen
   Namen braucht, wurde an der Schreibweise „/w <name> <text>"
   erkannt — und die spitzen Klammern hatte ich längst aus der Hilfe
   genommen (Emmy tippte sie mit). Seitdem traf das auf KEINEN Befehl
   mehr zu, und es kam kein einziger Namensvorschlag mehr.
   Gemessen wird beides in der echten Oberfläche. */
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
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2300);

  const erg = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((f) => setTimeout(f, ms));
    /* Ein Raum mit einer Person darin — und drei weitere Menschen, die
       gerade woanders sitzen, einer davon in einem abgeschlossenen
       Raum. */
    const echt = LiveChat.lage;
    LiveChat.lage = () => Object.assign({}, echt(), {
      ichName: "Xander",
      plaetze: [{ id: "p1", name: "Emmy", leer: false, ich: false },
                { id: "p0", name: "Xander", leer: false, ich: true }]
    });
    LiveChat.praesenzListe = () => ([
      { id: "r1", name: "Reza", raum: "langeweile" },
      { id: "r2", name: "Nina", raum: "geheimzimmer" },
      { id: "r3", name: "Tom", raum: "" }
    ]);

    document.querySelectorAll(".lc-probe").forEach((e) => e.remove());
    const huelle = document.createElement("div");
    huelle.className = "lc-probe lc-chat-fuss";
    huelle.style.cssText = "position:relative;padding:8px";
    huelle.innerHTML = '<input type="text" class="lc-chat-feld" id="lcFeld">'
      + '<div class="lc-tipps" id="lcTipps" role="listbox" hidden></div>';
    document.body.appendChild(huelle);
    window.__tippsBinden(huelle);
    const feld = huelle.querySelector("#lcFeld");
    const kasten = huelle.querySelector("#lcTipps");
    const tippen = (t) => { feld.value = t; feld.dispatchEvent(new Event("input", { bubbles: true })); };
    const sichtbar = () => [...kasten.querySelectorAll(".lc-tipp")].map((c) => ({
      name: (c.querySelector("strong") || {}).textContent || "",
      woher: (c.querySelector("small") || {}).textContent || "",
      meins: c.classList.contains("lc-tipp-meins")
    }));

    tippen("/w ");
    const beiW = sichtbar();
    tippen("/note ");
    const beiNote = sichtbar();
    tippen("/sprechbild ");
    const beiSprechbild = sichtbar();
    tippen("/sprechbild reg");
    const beiSprechbildReg = sichtbar();

    /* Und jetzt einen Befehl anheften: lang draufdrücken. */
    try { localStorage.removeItem("dma_lc_lieblinge"); } catch (e) {}
    tippen("/rw");
    /* Der erste Treffer in der Trefferzeile — nicht aus den
       Kategorien und nicht aus der Favoritenzeile. */
    const chip = [...kasten.children].filter((k) => k.classList.contains("lc-tipp"))[0];
    const chipName = chip ? (chip.querySelector("strong") || {}).textContent : "";
    let angeheftet = null;
    if (chip) {
      /* WIE EIN TELEFON ES TUT: Android schickt beim langen Druck
         zusaetzlich das Kontextmenue. Frueher hat das ein zweites Mal
         umgeschaltet — und es stand „ist kein Favorit mehr" da. */
      chip.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      await warte(750);
      chip.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
      chip.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      await warte(150);
      tippen("");
      tippen("/");
      const reihe = kasten.querySelector(".lc-tipp-favoriten");
      angeheftet = {
        ueberschrift: reihe ? (reihe.querySelector(".lc-tipp-favwort") || {}).textContent : "",
        sterne: reihe ? [...reihe.querySelectorAll(".lc-tipp-meins")]
          .map((c) => (c.querySelector("strong") || {}).textContent) : [],
        gemerkt: JSON.parse(localStorage.getItem("dma_lc_lieblinge") || "[]"),
        name: chipName
      };
    }
    return { beiW, beiNote, beiSprechbild, beiSprechbildReg, angeheftet };
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  console.log("\n  /w — WEN KANN ICH ANFLÜSTERN?");
  const namen = erg.beiW.map((c) => c.name);
  ok(erg.beiW.length > 0, "es kommen überhaupt Vorschläge", namen.join(", "));
  ok(namen.includes("Emmy"), "die Person im eigenen Raum");
  ok(namen.includes("Reza"), "jemand aus einem anderen Raum");
  ok(namen.includes("Nina"), "auch aus einem abgeschlossenen Raum");
  ok(namen.includes("Tom"), "und wer gerade nur auf der Seite ist");
  ok(!namen.includes("Xander"), "nur ich selbst stehe nicht dabei");

  console.log("\n  /note — DERSELBE WEG FÜR JEDEN BEFEHL MIT NAMEN");
  ok(erg.beiNote.map((c) => c.name).includes("Emmy"), "auch hier kommen die Namen");

  console.log("\n  /sprechbild — DIE AUSWAHL KOMMT VON SELBST");
  const sb = erg.beiSprechbild.map((c) => c.name.replace(/\s+\u2190.*$/, ""));
  ok(sb.length >= 4, "die Sprechbilder stehen zur Auswahl", sb.join(", "));
  ok(sb.includes("regenbogen"), "auch der Regenbogen");
  ok(erg.beiSprechbild.every((c) => c.woher), "und jedes sagt, wie es aussieht",
     "„" + (erg.beiSprechbild[0] || {}).woher + "“");
  ok(erg.beiSprechbildReg.length === 1
     && erg.beiSprechbildReg[0].name.indexOf("regenbogen") === 0,
     "beim Weitertippen bleibt nur der passende übrig",
     erg.beiSprechbildReg.map((c) => c.name).join(", "));

  console.log("\n  FAVORITEN ANHEFTEN (lang drücken)");
  const a = erg.angeheftet;
  ok(Boolean(a), "ein Befehl war zum Anheften da", a ? a.name : "");
  if (a) {
    ok(a.gemerkt.length === 1, "er ist gemerkt", JSON.stringify(a.gemerkt));
    ok(String(a.ueberschrift).includes("Favoriten"), "die Reihe heisst jetzt „Deine Favoriten“",
       "„" + a.ueberschrift + "“");
    ok(a.sterne.length === 1 && String(a.sterne[0]).indexOf("/" + a.gemerkt[0]) >= 0,
       "und er steht dort vorn", a.sterne.join(", "));
  }
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Namen und Favoriten sitzen.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
