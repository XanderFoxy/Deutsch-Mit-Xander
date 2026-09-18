const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const port = srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 740 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tutor", "an"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  const erg = await pg.evaluate(async () => {
    /* Ein Willkommens-Vorhang liegt beim Start ueber allem — der gehoert nicht zur Messung. */
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    /* Den Reiter erzwingen, als stuende man irgendwo auf der Seite. */
    let r = document.getElementById("tutorReiter");
    if (!r) {
      r = document.createElement("button");
      r.id = "tutorReiter"; r.className = "tutor-reiter"; r.textContent = "🎓";
      document.body.appendChild(r);
    }
    /* Eine Schreibzeile, wie sie der Chat baut. */
    const f = document.createElement("input");
    f.id = "lcFeld"; f.type = "text";
    f.style.cssText = "position:fixed; right:44px; bottom:22vh; width:120px;";
    document.body.appendChild(f);
    /* Ein Senden-Knopf GENAU unter dem Reiter — der gemeldete Fall. */
    const k = document.createElement("button");
    k.id = "lcSenden"; k.textContent = "➤";
    const rr = r.getBoundingClientRect();
    k.style.cssText = "position:fixed; left:" + rr.left + "px; top:" + rr.top
                    + "px; width:" + rr.width + "px; height:" + rr.height + "px; z-index:10;";
    document.body.appendChild(k);
    const mitte = { x: rr.left + rr.width / 2, y: rr.top + rr.height / 2 };

    const lesen = () => {
      const s = getComputedStyle(r);
      const oben = document.elementFromPoint(mitte.x, mitte.y);
      return { klasse: document.body.classList.contains("lc-schreibt"),
               deckkraft: s.opacity, zeiger: s.pointerEvents,
               werOben: oben ? (oben.id || oben.className || oben.tagName) : "nichts" };
    };
    const vorher = lesen();
    f.focus();
    await new Promise((w) => setTimeout(w, 260));
    const beim = lesen();
    f.blur();
    await new Promise((w) => setTimeout(w, 800));
    const nachher = lesen();
    return { vorher, beim, nachher };
  });
  console.log("vor dem Schreiben :", JSON.stringify(erg.vorher));
  console.log("beim Schreiben    :", JSON.stringify(erg.beim));
  console.log("nach dem Schreiben:", JSON.stringify(erg.nachher));
  const ok = erg.beim.zeiger === "none" && erg.beim.werOben === "lcSenden"
          && erg.nachher.zeiger !== "none";
  console.log(ok ? "\n✅ Beim Schreiben liegt der Senden-Knopf oben, danach ist der Reiter wieder da."
                 : "\n❌ Der Reiter liegt immer noch im Weg.");
  await br.close(); srv.close();
})();
