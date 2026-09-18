/* PRÜFT DAS BEFEHLS-PANEL AM SCHRÄGSTRICH.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Sobald ich den / schreibe, sollen die Kategorien alle
   da sein — Favoriten und was man so machen möchte … und da steht
   dann ein kleiner Hinweis, aus welcher Sektion das kommt, oder die
   Rändchen um den Befehl sind farbmarkiert und man hat eine Legende
   daneben."

   Gemessen wird, ob wirklich dasteht, was er verlangt hat:
     1. Kommen bei „/" die Kategorien?
     2. Steht jeder Befehl mit seinem Zeichen da?
     3. Hat jeder Befehl einen FARBIGEN Rand — und ist die Farbe
        dieselbe wie in der Legende?
     4. Filtert ein Klick auf eine Kategorie wirklich?
     5. Schickt „🐧" die Pinguine — und „🐧 schau mal" nicht? */
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
  const pg = await br.newPage({ viewport: { width: 460, height: 820 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  const erg = await pg.evaluate(async () => {
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    /* Die Chatleiste bauen, ohne dafür anmelden zu müssen. */
    const halter = document.createElement("div");
    halter.innerHTML = '<form id="lcForm"><input type="text" id="lcFeld">'
      + '<button id="lcSenden"></button>'
      + '<div class="lc-tipps" id="lcTipps" hidden></div></form>';
    halter.style.cssText = "position:fixed;left:0;bottom:0;width:440px;z-index:99999;background:#222;padding:6px";
    document.body.appendChild(halter);
    window.__tippsBinden(halter);
    const feld = halter.querySelector("#lcFeld");
    const kasten = halter.querySelector("#lcTipps");
    const tippen = async (t) => {
      feld.value = t;
      feld.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 60));
    };
    const lesen = () => ({
      offen: !kasten.hidden,
      kategorien: [...kasten.querySelectorAll(".lc-tipp-kat")].map((b) => b.textContent),
      favoriten: [...kasten.querySelectorAll(".lc-tipp-favoriten .lc-tipp")].map((b) => b.textContent),
      treffer: [...kasten.querySelectorAll(".lc-tipp[data-gr]")].map((b) => ({
        text: b.textContent, gr: b.dataset.gr,
        rand: getComputedStyle(b).borderLeftColor,
        randBreit: getComputedStyle(b).borderLeftWidth
      })),
      legende: [...kasten.querySelectorAll(".lc-tipp-legende span")].map((e) => ({
        text: e.textContent, gr: e.dataset.gr,
        farbe: getComputedStyle(e, "::before").backgroundColor
      }))
    });
    await tippen("/");
    const beiStrich = lesen();
    await tippen("/c");
    const beiC = lesen();
    /* Eine Kategorie anklicken. */
    const kat = kasten.querySelector('.lc-tipp-kat[data-gr]');
    const katName = kat ? kat.textContent : "";
    if (kat) { kat.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })); await new Promise((r) => setTimeout(r, 60)); }
    const nachFilter = lesen();

    return { beiStrich, beiC, katName, nachFilter,
             zeichen: {
               pinguinAllein: LiveChat.befehlAusZeichen("🐧"),
               pinguinImSatz: LiveChat.befehlAusZeichen("🐧 schau mal"),
               raute: LiveChat.befehlAusZeichen("#pinguine"),
               unbekannt: LiveChat.befehlAusZeichen("🥚")
             } };
  });

  const f = (x) => JSON.stringify(x);
  console.log("=== Bei „/" + "“ ===");
  console.log("  Kategorien (" + erg.beiStrich.kategorien.length + "): " + erg.beiStrich.kategorien.join(" · "));
  console.log("  Favoriten: " + (erg.beiStrich.favoriten.length ? erg.beiStrich.favoriten.join(" ") : "— noch keine benutzt —"));
  console.log("  Treffer: " + erg.beiStrich.treffer.length);
  console.log("  Legende: " + erg.beiStrich.legende.map((l) => l.text).join(" · "));
  console.log("\n=== Bei „/c“ ===");
  erg.beiC.treffer.slice(0, 8).forEach((t) =>
    console.log("  " + t.text.padEnd(22) + " [" + t.gr + "]  Rand " + t.randBreit + " " + t.rand));
  console.log("\n=== Ein Klick auf „" + erg.katName + "“ ===");
  console.log("  danach nur noch: " + erg.nachFilter.treffer.map((t) => t.gr).filter((v, i, a) => a.indexOf(v) === i).join(", ")
    + "  (" + erg.nachFilter.treffer.length + " Treffer)");
  console.log("\n=== Zeichen als Befehl ===");
  console.log("  🐧 allein     → " + f(erg.zeichen.pinguinAllein));
  console.log("  🐧 im Satz    → " + f(erg.zeichen.pinguinImSatz));
  console.log("  #pinguine     → " + f(erg.zeichen.raute));
  console.log("  🥚 (unbekannt)→ " + f(erg.zeichen.unbekannt));

  /* Stimmen Rand- und Legendenfarbe überein? */
  const legMap = {};
  erg.beiC.legende.forEach((l) => { legMap[l.gr] = l.farbe; });
  const passt = erg.beiC.treffer.every((t) => !legMap[t.gr] || legMap[t.gr] === t.rand);
  const ok = erg.beiStrich.kategorien.length > 1 && erg.beiC.treffer.length > 0
    && erg.beiC.treffer.every((t) => t.randBreit === "4px")
    && passt
    && erg.zeichen.pinguinAllein === "pinguine" && erg.zeichen.pinguinImSatz === ""
    && erg.zeichen.raute === "pinguine" && erg.zeichen.unbekannt === "";
  console.log(ok ? "\n✅ Kategorien, Zeichen, farbige Ränder passend zur Legende — und das Emoji löst aus."
                 : "\n❌ Etwas passt noch nicht.");
  await br.close(); srv.close();
})();
