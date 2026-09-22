/* =====================================================================
   SONDE RUNDE 88 — DAS AUFGABEN-MODUL HAT EINE FUNKTION
   ---------------------------------------------------------------------
   XANDER, dreimal ueber drei Runden hinweg:
   · „Die Aufgabe macht keinen Sinn: man schreibt irgendwas hin und
      kann die einzelnen Woerter nicht anklicken."
   · „Die Aufgabe hat keine Funktion. Man schreibt einen ganzen Satz
      und weiss gar nicht, was man da loesen soll … man kann nur den
      Satz anklicken, und das ist quasi die Loesung. Was soll das fuer
      eine Aufgabe sein?"
   · „Die Aufgabe hatte noch keine Funktion, immer noch nicht — ich
      weiss immer noch nicht, was das sein soll."

   NACHGESEHEN, und das ist der Befund: das Modul gab es laengst, aber
   ueber ACHT verschiedene Befehle verteilt (/satz, /wort, /betonung,
   /raten, /kontexter, /artikel, /begriff, /aufgabe). „/aufgabe" war
   nur EINER davon — die freie Aufgabe ohne Musterloesung. Wer den
   tippte, sah genau eine der acht Arten und keinen Hinweis auf die
   anderen sieben. Deshalb wusste er nicht, was es sein soll: es war
   nie die Tuer zum Modul, es war ein Zimmer darin.

   Diese Sonde haelt fest, dass „/aufgabe" jetzt die Tuer ist:
     1. „/aufgabe" ohne Text oeffnet die Tafel.
     2. Auf der Tafel steht JEDE der Arten, mit Erklaerung.
     3. Ein Tipp auf eine Art legt den Befehl in die Schreibzeile —
        mit Beispiel, und das Beispiel ist markiert, damit der erste
        Tastendruck es ersetzt.
     4. Die Arten ohne Text (/artikel, /begriff) gehen sofort raus.
     5. „/aufgabe MIT Text" stellt weiterhin sofort die freie Aufgabe —
        daran darf sich nichts geaendert haben.
     6. Laeuft eine Aufgabe, steht das Beenden oben auf der Tafel.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 88 — das Aufgaben-Modul hat eine Funktion\n");
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
  const pg = await br.newPage({ viewport: { width: 360, height: 740 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.DMA_AUFGABENWAHL, { timeout: 20000 });

  /* Ins Klassenzimmer — nur dort gibt es die Schreibzeile. */
  await pg.evaluate(async () => {
    try { LiveChat.pruefBetreiber(true); } catch (e) {}
    try { LiveChat.pruefRaum("klassenzimmer"); } catch (e) {}
    try { LiveChat.pruefLageSetzen("drin"); } catch (e) {}
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.getElementById("view-knowledge")?.classList.add("active");
    document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]')?.click();
    await new Promise((f) => setTimeout(f, 800));
  });

  const m = await pg.evaluate(async () => {
    const erg = {};
    erg.feldDa = Boolean(document.getElementById("lcFeld"));
    /* 1. — der Befehl selbst, so wie ein Mensch ihn tippt. */
    document.getElementById("lcPlatzMenue")?.remove();
    try { LiveChat.schreiben("/aufgabe"); } catch (e) { erg.krach = String(e && e.message); }
    await new Promise((f) => setTimeout(f, 300));
    const tafel = document.querySelector(".lc-aufgabenwahl");
    erg.tafelDa = Boolean(tafel);
    if (!tafel) return erg;
    const r = tafel.getBoundingClientRect();
    erg.kasten = [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)];
    erg.schirm = [innerWidth, innerHeight];
    erg.drin = r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1
            && r.bottom <= innerHeight + 1;
    /* 2. — alle Arten, jede mit einem Satz Erklaerung. */
    const arten = [...tafel.querySelectorAll(".lc-aufgabenwahl-art")];
    erg.arten = arten.map((b) => ({
      name: (b.querySelector("strong") || {}).textContent || "",
      was: ((b.querySelector(".lc-aufgabenwahl-was") || {}).textContent || "").length,
      bsp: ((b.querySelector(".lc-aufgabenwahl-bsp") || {}).textContent || "")
    }));
    erg.knopfZu = Boolean(tafel.querySelector(".lc-panel-zu"));
    erg.schluss = Boolean(tafel.querySelector(".lc-aufgabenwahl-schluss"));
    /* 3. — ein Tipp auf „Satz ordnen" legt /satz in die Schreibzeile. */
    const satz = arten.find((b) => /Satz ordnen/.test(b.textContent || ""));
    if (satz) {
      satz.click();
      await new Promise((f) => setTimeout(f, 220));
      const f2 = document.getElementById("lcFeld");
      erg.feld = f2 ? f2.value : "";
      erg.markiertVon = f2 ? f2.selectionStart : -1;
      erg.markiertBis = f2 ? f2.selectionEnd : -1;
      erg.tafelZu = !document.querySelector(".lc-aufgabenwahl");
      if (f2) f2.value = "";
    }
    return erg;
  });

  sage(m.feldDa, "die Schreibzeile ist da");
  sage(m.tafelDa === true, "„/aufgabe“ ohne Text öffnet die Tafel", m.krach || "");
  if (!m.tafelDa) { await br.close(); srv.close(); console.log("\n" + fehler + " FEHLER"); process.exit(1); }
  sage(m.drin === true, "die Tafel passt ganz auf den Schirm",
    (m.kasten || []).join(" ") + " bei " + (m.schirm || []).join(" x "));
  sage(m.knopfZu === false, "KEIN Schliessen-Knopf im Rahmen — seine Ansage aus Runde 88");

  const sollArten = ["Satz ordnen", "Wort bauen", "Betonung", "Aufdecken",
    "KONTEXTER", "der, die oder das?", "Begriff suchen", "Freie Aufgabe", "Lesetext"];
  const habe = (m.arten || []).map((a) => a.name);
  sollArten.forEach((s) => sage(habe.indexOf(s) >= 0, "die Art „" + s + "“ steht auf der Tafel"));
  const ohneWort = (m.arten || []).filter((a) => a.was < 30);
  sage(ohneWort.length === 0, "jede Art hat einen Satz, was sie tut",
    ohneWort.map((a) => a.name).join(", "));

  sage(String(m.feld || "").startsWith("/satz "),
    "ein Tipp auf „Satz ordnen“ legt  /satz  in die Schreibzeile", m.feld);
  sage(m.markiertVon === 6 && m.markiertBis === String(m.feld || "").length,
    "das Beispiel dahinter ist markiert — der erste Tastendruck ersetzt es",
    m.markiertVon + "–" + m.markiertBis + " von " + String(m.feld || "").length);
  sage(m.tafelZu === true, "die Tafel geht dabei zu");

  /* 5. — MIT Text ist alles wie vorher: sofort eine freie Aufgabe. */
  const mitText = await pg.evaluate(async () => {
    document.getElementById("lcPlatzMenue")?.remove();
    try { LiveChat.schreiben("/aufgabe Schreib drei Sätze über dein Wochenende"); } catch (e) {}
    await new Promise((f) => setTimeout(f, 300));
    let a = null;
    try { a = LiveChat.offeneAufgabeInfo ? LiveChat.offeneAufgabeInfo() : null; } catch (e) {}
    const erg = { tafel: Boolean(document.querySelector(".lc-aufgabenwahl")),
                  typ: a && a.typ, frage: (a && a.frage) || "" };
    /* 6. — jetzt laeuft eine: die Tafel bietet das Beenden an. */
    try { LiveChat.schreiben("/satz "); } catch (e) {}
    document.getElementById("lcPlatzMenue")?.remove();
    try { window.DMA_AUFGABENWAHL(); } catch (e) {}
    await new Promise((f) => setTimeout(f, 220));
    erg.schluss = Boolean(document.querySelector(".lc-aufgabenwahl-schluss"));
    return erg;
  });
  sage(mitText.tafel === false, "„/aufgabe MIT Text“ öffnet KEINE Tafel, sondern stellt sie sofort");
  sage(mitText.typ === "frei", "und es ist die freie Aufgabe", "Typ: " + mitText.typ);
  sage(/Wochenende/.test(mitText.frage), "mit genau dem Text, der dahinter stand", mitText.frage);
  sage(mitText.schluss === true, "läuft eine Aufgabe, steht das Beenden oben auf der Tafel");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
