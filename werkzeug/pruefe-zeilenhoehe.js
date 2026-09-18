/* MISST, OB NAME UND TEXT AUF DERSELBEN GRUNDLINIE STEHEN.
   ---------------------------------------------------------------
   GEMELDET: „Die Schrift ist manchmal nicht auf einer Linie mit dem
   Namen — zum Beispiel wenn ich normal schreibe, ist das ,Hallo'
   tiefer gesetzt als mein Nickname."

   Gemessen wird nicht das Aussehen, sondern die Grundlinie: wo die
   Unterkante der Buchstaben liegt. Dafür bekommt jeder Text ein
   winziges Mass-Zeichen (ein leeres <i> mit einem Buchstaben), und
   dessen Unterkante wird verglichen. Gleich heisst: derselbe Wert,
   auf ein halbes Pixel genau. */
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
  const pg = await br.newPage({ viewport: { width: 520, height: 800 } });
  const vorher = process.argv.indexOf("--vorher") >= 0;
  await pg.addInitScript(`window.__vorher = ${vorher};`);
  await pg.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "domcontentloaded" });
  if (vorher) console.log("(so war es VORHER)");
  await pg.waitForTimeout(2000);

  const erg = await pg.evaluate(() => {
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    /* Mit --vorher wird der ALTE Stand nachgestellt, damit der
       Unterschied nicht behauptet, sondern gezeigt werden kann.
       GEMESSEN damit: eine gewoehnliche Nachricht mit echtem
       Profilbild stand 4,8 Pixel tiefer als der Name — genau das
       gemeldete „manchmal". */
    if (window.__vorher) {
      const alt = document.createElement("style");
      alt.textContent = ".lc-nick{align-items:center!important}"
        + ".lc-nick>.lc-zeilenbild{align-self:auto!important}"
        + ".lc-zeile-ruf>.lc-zeit,.lc-zeile-ruf>.lc-nick,.lc-zeile-ruf>.lc-zeilentext{align-self:auto!important}"
        + ".lc-zeile-ruf .lc-zeilentext{contain:layout!important}"
        + ".lc-ruf-wort{line-height:1!important}";
      document.head.appendChild(alt);
    }
    const halter = document.createElement("div");
    halter.className = "lc-chat-verlauf";
    halter.style.cssText = "position:fixed; left:0; top:0; width:480px; background:#222; z-index:99999;";
    document.body.appendChild(halter);

    const bauen = (klasse, mitBild) => {
      const z = document.createElement("div");
      z.className = "lc-zeile " + klasse;
      const uhr = document.createElement("span");
      uhr.className = "lc-zeit"; uhr.textContent = "12:34";
      z.appendChild(uhr);
      const kopf = document.createElement("span");
      kopf.className = "lc-nick";
      if (mitBild === "emoji") {
        const i = document.createElement("span");
        i.className = "lc-zeilenbild lc-zeilenbild-emoji";
        i.textContent = "🦊";
        kopf.appendChild(i);
      } else if (mitBild === "foto") {
        /* Ein echtes Bild — das ist der haeufige Fall, und ein <img>
           setzt seine UNTERKANTE auf die Grundlinie. */
        const i = document.createElement("img");
        i.className = "lc-zeilenbild";
        i.alt = "";
        i.src = "tutor/alex-comic.png";
        kopf.appendChild(i);
      }
      const nm = document.createElement("b");
      nm.innerHTML = 'Alex<i class="mass" style="font-size:0;">H</i>';
      kopf.appendChild(nm);
      z.appendChild(kopf);
      const t = document.createElement("span");
      t.className = "lc-zeilentext";
      t.innerHTML = 'Hallo<i class="mass" style="font-size:0;">H</i>';
      z.appendChild(t);
      halter.appendChild(z);
      /* Die Grundlinie: Unterkante eines echten Buchstabens im
         jeweiligen Text. Ein 0-Pixel-Zeichen erbt die Grundlinie
         seines Elternteils und verrät sie so. */
      const mess = (el) => {
        /* Der Massstab: ein inline-block mit NULL Hoehe und
           verstecktem Ueberlauf. Ein solcher Kasten setzt seine
           Unterkante genau auf die Grundlinie der Zeile — und weil er
           weder Schrift noch Hoehe hat, haengt das Ergebnis NICHT von
           der Schriftgroesse ab. Mit einem Kasten voller Text misst
           man dagegen nur, wie gross die Schrift ist. */
        const s = document.createElement("span");
        s.style.cssText = "display:inline-block; width:0; height:0; overflow:hidden;";
        el.appendChild(s);
        const r = s.getBoundingClientRect();
        s.remove();
        return Math.round(r.bottom * 10) / 10;
      };
      return { klasse: klasse || "normal", mitBild,
               name: mess(nm), text: mess(t) };
    };
    return [bauen("", "foto"), bauen("", "emoji"), bauen("", ""),
            bauen("lc-zeile-ruf", "foto"), bauen("lc-zeile-ruf", "emoji"), bauen("lc-zeile-ruf", "")];
  });

  erg.forEach((e) => {
    const d = Math.round((e.text - e.name) * 10) / 10;
    console.log((e.klasse + " [" + (e.mitBild || "kein Bild") + "]").padEnd(30)
      + " Name " + String(e.name).padStart(7) + "   Text " + String(e.text).padStart(7)
      + "   Unterschied " + String(d).padStart(6) + " px  "
      + (Math.abs(d) <= 0.6 ? "✅ auf einer Linie" : "❌ verschoben"));
  });
  await br.close(); srv.close();
})();
