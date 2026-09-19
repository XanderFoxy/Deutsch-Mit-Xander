/* =========================================================
   DER FILMSPIELER — eine Animation legt sich über die Seite
   ---------------------------------------------------------
   GEWÜNSCHT: „Wie bei TikTok, wo plötzlich ein Löwe herumläuft
   … und das liegt einfach nur über dem Chat."

   Erzeugt werden die Filme mit werkzeug/film-freistellen.sh,
   die Anleitung steht in filme/LIESMICH.md.

   WAS IN FASSUNG 331 ANDERS IST — drei gemeldete Fehler:

   1. „Das Video bleibt nicht an Ort und Stelle, es springt nach
      oben über die Besucher und geht dort weiter, dann wieder
      nach unten."
      DAS WAR KEIN ZUFALL UND KEIN RUCKELN. Das Beben lag als
      transform auf <body>. Und eine CSS-Regel, die man leicht
      übersieht: sobald ein Vorfahr eine transform hat, gilt
      „position: fixed" NICHT MEHR gegenüber dem Bildschirm,
      sondern gegenüber diesem Vorfahren. Die Filmschicht hing
      also am Dokument statt am Fenster — beim ersten Stoss
      sprang sie hoch, beim Nachlassen zurück. Genau der
      beschriebene Wechsel zwischen oben und unten.
      Es bebt jetzt gar nichts mehr am Dokument.

   2. „Die Videos unterbrechen ständig zwei oder dreimal, die
      sind nicht vollständig."
      Der Film wurde abgespielt, WÄHREND er noch geladen hat.
      Reicht die Leitung nicht, hält das Bild an. Jetzt wird die
      Datei ERST GANZ GEHOLT und dann abgespielt — aus dem
      Speicher, nicht aus dem Netz. Der Schein war ausserdem ein
      drop-shadow ÜBER dem Video, also ein Filter über jedem
      einzelnen Bild; er liegt jetzt als eigene Fläche dahinter,
      die nur ihre Deckkraft ändert.

   3. „Man hört nicht den Sound von den Videos, man hört diesen
      Geschenk-Jubel von vorher."
      Die Tonspur wurde beim Freistellen weggeworfen (-an). Sie
      bleibt jetzt drin, und der Spieler spielt sie. Verweigert
      das Gerät den Ton (viele Telefone erlauben ihn nur nach
      einer Berührung), läuft der Film stumm weiter statt gar
      nicht — der Grund steht dann in /befund.

   WARUM ZWEI WEGE
   Chrome, Firefox und Android können WebM mit Alphakanal — dann
   ist es ein <video> und sonst nichts. Safari kann das NICHT.
   Für Safari liegt daneben ein MP4, in dem Bild und Maske
   NEBENEINANDER stehen; die Grafikkarte setzt beides in einem
   Zug wieder zusammen.

   Aufruf:
     DMA_FILM.spielen("loewe")                    mit Ton
     DMA_FILM.spielen("loewe", { stumm: true })   ohne
   ========================================================= */
(function () {
  "use strict";
  var DA = {};                     // schon geladene Beschreibungen
  var DATEIEN = {};                // schon ganz geholte Filme (Blob-Adressen)
  var LAEUFT = null;               // es läuft immer nur einer

  /* Kann dieser Browser WebM mit Alphakanal? canPlayType allein
     reicht nicht: neuere Safaris sagen bei VP9 „probably" und
     können den Alphakanal trotzdem nicht. Deshalb wird Safari
     ausdrücklich ausgenommen. */
  function kannAlphaWebm() {
    try {
      var v = document.createElement("video");
      var ok = v.canPlayType('video/webm; codecs="vp9"');
      if (!ok) return false;
      var ua = navigator.userAgent || "";
      var safari = /Safari/.test(ua) && !/Chrome|Chromium|Android|Edg/.test(ua);
      return !safari;
    } catch (e) { return false; }
  }

  /* WARUM HIER SO VIEL UEBER FEHLER STEHT
     GEMELDET: „Es ging beides nicht … erzähl mir sowas nicht."
     Ein Effekt, der stumm ausbleibt, kostet jede Runde eine
     Vermutung. Also sagt der Spieler in KLARTEXT, woran es lag. */
  function holen(name) {
    if (DA[name]) return Promise.resolve(DA[name]);
    return fetch("filme/" + name + ".json", { cache: "no-cache" })
      .then(function (a) {
        if (!a.ok) {
          var e = new Error("Die Datei filme/" + name + ".json ist nicht da (" + a.status + ").");
          e.grund = "fehlt"; throw e;
        }
        return a.json();
      })
      .then(function (d) { DA[name] = d; return d; })
      .catch(function (e) {
        if (!e.grund) { e.grund = "netz"; e.message = "filme/" + name + ".json liess sich nicht laden: " + e.message; }
        throw e;
      });
  }

  /* ERST GANZ HOLEN, DANN ABSPIELEN.
     Ein <video src="…"> fängt an, sobald genug Daten für den
     Anfang da sind — und bleibt stehen, sobald sie ausgehen. Ein
     Blob liegt fertig im Speicher; ab da kann nichts mehr
     dazwischenkommen. Beim zweiten Mal ist er schon da und der
     Film startet sofort. */
  function datei(url) {
    if (DATEIEN[url]) return Promise.resolve(DATEIEN[url]);
    return fetch(url, { cache: "force-cache" })
      .then(function (a) {
        if (!a.ok) {
          var e = new Error("Der Film " + url + " ist nicht da (" + a.status + ").");
          e.grund = "fehlt"; throw e;
        }
        return a.blob();
      })
      .then(function (b) {
        var u = URL.createObjectURL(b);
        DATEIEN[url] = u;
        return u;
      })
      .catch(function (e) {
        if (!e.grund) { e.grund = "netz"; e.message = url + " liess sich nicht laden: " + e.message; }
        throw e;
      });
  }

  /* DIE SCHICHT LIEGT AM FENSTER, NICHT AM DOKUMENT.
     inset:0 auf position:fixed heisst „genau der sichtbare
     Bildschirm" — solange kein Vorfahr eine transform hat. Genau
     das ist oben Punkt 1. */
  function schicht() {
    var s = document.createElement("div");
    s.className = "dma-film";
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;"
      + "display:flex;align-items:center;justify-content:center;overflow:hidden;";
    return s;
  }

  /* Ein Ring, solange geholt wird. Ohne ihn sieht es aus, als
     wäre der Befehl ins Leere gegangen. */
  function warten(s) {
    var w = document.createElement("i");
    w.className = "dma-film-warten";
    w.style.cssText = "width:42px;height:42px;border-radius:50%;"
      + "border:3px solid rgba(255,255,255,.25);border-top-color:rgba(255,255,255,.9);"
      + "animation:dmaFilmDreh .9s linear infinite;";
    if (!document.getElementById("dmaFilmStil")) {
      var st = document.createElement("style");
      st.id = "dmaFilmStil";
      st.textContent = "@keyframes dmaFilmDreh{to{transform:rotate(360deg)}}";
      document.head.appendChild(st);
    }
    s.appendChild(w);
    return w;
  }

  /* ---- Weg 1: das Video kann Durchsichtigkeit selbst ---- */
  function direkt(quelle, d, s) {
    var v = document.createElement("video");
    v.src = quelle;
    v.playsInline = true; v.preload = "auto";
    v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.style.cssText = "max-width:100%;max-height:100%;object-fit:contain;";
    s.appendChild(v);
    return v;
  }

  /* ---- Weg 2: Bild und Maske nebeneinander, wieder zusammengesetzt ---- */
  var SHADER_ECKE =
    "attribute vec2 p;varying vec2 t;void main(){t=vec2((p.x+1.0)/2.0,(1.0-p.y)/2.0);"
    + "gl_Position=vec4(p,0.0,1.0);}";
  var SHADER_FLAECHE =
    "precision mediump float;varying vec2 t;uniform sampler2D b;"
    /* Links im Bild steht die Farbe, rechts die Maske. Der
       Helligkeitswert rechts wird zur Deckung links. */
    + "void main(){vec3 c=texture2D(b,vec2(t.x*0.5,t.y)).rgb;"
    + "float a=texture2D(b,vec2(t.x*0.5+0.5,t.y)).r;"
    + "gl_FragColor=vec4(c*a,a);}";

  function shader(gl, art, quelle) {
    var s = gl.createShader(art);
    gl.shaderSource(s, quelle); gl.compileShader(s);
    return s;
  }

  function zusammensetzen(quelle, d, s) {
    var v = document.createElement("video");
    v.src = quelle;
    v.playsInline = true; v.loop = false; v.preload = "auto";
    v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;";
    s.appendChild(v);

    var c = document.createElement("canvas");
    c.className = "dma-film-bild";
    c.width = d.breite || 480; c.height = d.hoehe || 854;
    c.style.cssText = "max-width:100%;max-height:100%;object-fit:contain;";
    s.appendChild(c);

    var gl = c.getContext("webgl", { premultipliedAlpha: true, alpha: true })
      || c.getContext("experimental-webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) {
      /* Keine Grafikkarte erreichbar — dann wenigstens das
         Standbild, statt gar nichts zu zeigen. */
      c.remove();
      var i = document.createElement("img");
      i.src = d.bild; i.alt = "";
      i.style.cssText = "max-width:100%;max-height:100%;object-fit:contain;";
      s.appendChild(i);
      return v;
    }
    var pr = gl.createProgram();
    gl.attachShader(pr, shader(gl, gl.VERTEX_SHADER, SHADER_ECKE));
    gl.attachShader(pr, shader(gl, gl.FRAGMENT_SHADER, SHADER_FLAECHE));
    gl.linkProgram(pr); gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var p = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(p);
    gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var laeuft = true;
    function bild() {
      if (!laeuft) return;
      if (v.readyState >= 2) {
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        } catch (e) {}
      }
      requestAnimationFrame(bild);
    }
    requestAnimationFrame(bild);
    v.addEventListener("ended", function () { laeuft = false; });
    return v;
  }

  /* =========================================================
     DIE WIRKUNG — UND ZWAR DIE ZUR SZENE PASSENDE
     ---------------------------------------------------------
     GEMELDET: „Nicht bei jedem Video diesen Staubeffekt. Mach
     gemessen an dem, was es darstellen soll, einen passenden
     Effekt zur Szene." Und zur Lok: „Danach mit dem Staubeffekt
     und dem Wackeleffekt — das braucht eigentlich nicht da sein."
     Und zum Löwen: „Da brauchen wir den Staub eigentlich nicht."

     Also: Staub gehört unter schwere Füsse und sonst nirgends.
     Was dazukommt, entscheidet der Film selbst (Feld „wirkung"
     in seiner Beschreibung):

       erde   schwere Schritte  → Staub am Boden       (T-Rex)
       glanz  Raubtier im Satz  → warmer Schein        (Löwe)
       wind   Flug              → Luftstreifen         (Adler)
       dampf  Dampfmaschine     → Dampfwolken          (Lok)
       keiner nur der Film

     GEWACKELT WIRD NIRGENDS MEHR. Das Beben hat die Filmschicht
     von ihrem Platz gerissen (siehe Punkt 1 ganz oben) und war
     ausserdem nicht gewollt. Die gemessene Heftigkeit steuert
     jetzt nur noch Schein und Teilchen — dort tut sie, was sie
     soll, ohne irgendetwas zu verschieben.
     ========================================================= */
  var PROFILE = {
    erde:   { staub: 1.0, funken: 0,   streifen: 0,   dampf: 0,   schein: 0.9, farbe: "255,168,72" },
    glanz:  { staub: 0,   funken: 0.8, streifen: 0,   dampf: 0,   schein: 1.0, farbe: "255,190,96" },
    wind:   { staub: 0,   funken: 0,   streifen: 1.0, dampf: 0,   schein: 0.5, farbe: "190,214,255" },
    dampf:  { staub: 0,   funken: 0,   streifen: 0,   dampf: 1.0, schein: 0.6, farbe: "255,206,150" },
    keiner: { staub: 0,   funken: 0,   streifen: 0,   dampf: 0,   schein: 0,   farbe: "255,255,255" }
  };

  function kraftBei(kurve, t) {
    if (!kurve || !kurve.length) return 0;
    var a = 0, b = kurve.length - 1;
    if (t <= kurve[0][0]) return kurve[0][1];
    if (t >= kurve[b][0]) return kurve[b][1];
    while (b - a > 1) { var m = (a + b) >> 1; if (kurve[m][0] <= t) a = m; else b = m; }
    var f = (t - kurve[a][0]) / Math.max(0.001, kurve[b][0] - kurve[a][0]);
    return kurve[a][1] + (kurve[b][1] - kurve[a][1]) * f;
  }

  /* EINE Leinwand für alles Gezeichnete. Sie ist bewusst klein
     (höchstens 480 Punkte breit) und wird hochgezogen: ein
     Telefon zeichnet sonst über eine Million Punkte pro Bild. */
  function teilchenSchicht(s, profil) {
    var c = document.createElement("canvas");
    c.className = "dma-film-teilchen";
    c.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    s.appendChild(c);
    var x = c.getContext("2d");
    function groesse() {
      c.width = Math.min(480, s.clientWidth || 360);
      c.height = Math.min(854, s.clientHeight || 720);
    }
    groesse();
    window.addEventListener("resize", groesse);
    var teile = [];
    var GRENZE = 260;   // mehr sieht man nicht, es kostet nur
    return {
      leinwand: c,
      zeichnen: function (k) {
        x.clearRect(0, 0, c.width, c.height);

        /* --- Staub: Körner vom Boden, nur wo Füsse aufkommen --- */
        if (profil.staub) {
          for (var i = 0; i < Math.round(k * 4 * profil.staub) && teile.length < GRENZE; i++) {
            teile.push({ art: "staub",
              x: c.width * (0.16 + Math.random() * 0.68),
              y: c.height * (0.86 + Math.random() * 0.06),
              vx: (Math.random() - 0.5) * 3.0 * (0.4 + k),
              vy: -(0.4 + Math.random() * 1.5) * (0.4 + k),
              r: 2 + Math.random() * 8 * (0.5 + k), leben: 1 });
          }
        }
        /* --- Funken: warme Sprenkel um das Tier herum --- */
        if (profil.funken) {
          for (var f = 0; f < Math.round(k * 3 * profil.funken) && teile.length < GRENZE; f++) {
            teile.push({ art: "funke",
              x: c.width * (0.2 + Math.random() * 0.6),
              y: c.height * (0.3 + Math.random() * 0.5),
              vx: (Math.random() - 0.5) * 2.2,
              vy: -(0.6 + Math.random() * 1.8),
              r: 1.2 + Math.random() * 2.4, leben: 1 });
          }
        }
        /* --- Luftstreifen: der Flug zieht die Luft mit --- */
        if (profil.streifen) {
          for (var w = 0; w < Math.round((0.6 + k * 2.4) * profil.streifen) && teile.length < GRENZE; w++) {
            teile.push({ art: "streifen",
              x: c.width * (Math.random() < 0.5 ? -0.05 : 1.05),
              y: c.height * (0.12 + Math.random() * 0.7),
              vx: (Math.random() < 0.5 ? 1 : -1) * (3 + Math.random() * 5),
              vy: (Math.random() - 0.5) * 0.6,
              r: 16 + Math.random() * 44, leben: 1 });
          }
        }
        /* --- Dampf: weiche weisse Ballen, die aufsteigen --- */
        if (profil.dampf) {
          for (var p = 0; p < Math.round((0.3 + k * 1.6) * profil.dampf) && teile.length < GRENZE; p++) {
            teile.push({ art: "dampf",
              x: c.width * (0.34 + Math.random() * 0.32),
              y: c.height * (0.72 + Math.random() * 0.2),
              vx: (Math.random() - 0.5) * 0.9,
              vy: -(0.5 + Math.random() * 1.1),
              r: 8 + Math.random() * 16, leben: 1 });
          }
        }

        for (var j = teile.length - 1; j >= 0; j--) {
          var q = teile[j];
          q.x += q.vx; q.y += q.vy;
          if (q.art === "staub") { q.vy += 0.045; q.r += 0.5; q.leben -= 0.013; }
          else if (q.art === "funke") { q.vy += 0.03; q.leben -= 0.022; }
          else if (q.art === "streifen") { q.leben -= 0.03; }
          else { q.vy -= 0.006; q.r += 0.7; q.leben -= 0.011; }
          if (q.leben <= 0) { teile.splice(j, 1); continue; }

          if (q.art === "streifen") {
            x.strokeStyle = "rgba(210,228,255," + (0.16 * q.leben).toFixed(3) + ")";
            x.lineWidth = 1.4;
            x.beginPath(); x.moveTo(q.x, q.y); x.lineTo(q.x - q.vx * 6, q.y - q.vy * 6); x.stroke();
            continue;
          }
          var ton = q.art === "staub" ? "206,178,138"
                  : q.art === "funke" ? "255,196,110" : "236,240,244";
          var deck = q.art === "funke" ? 0.7 : (q.art === "dampf" ? 0.26 : 0.19);
          var g = x.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r);
          g.addColorStop(0, "rgba(" + ton + "," + (deck * q.leben).toFixed(3) + ")");
          g.addColorStop(1, "rgba(" + ton + ",0)");
          x.fillStyle = g;
          x.beginPath(); x.arc(q.x, q.y, q.r, 0, 6.2832); x.fill();
        }

        /* Flacher Dunst am Boden — nur beim Staub. */
        if (profil.staub && k > 0.05) {
          var b = x.createRadialGradient(c.width / 2, c.height * 0.93, 0,
                                         c.width / 2, c.height * 0.93, c.width * 0.55);
          b.addColorStop(0, "rgba(206,184,148," + (0.22 * k).toFixed(3) + ")");
          b.addColorStop(1, "rgba(206,184,148,0)");
          x.fillStyle = b;
          x.fillRect(0, c.height * 0.72, c.width, c.height * 0.28);
        }
      }
    };
  }

  /* Der Schein liegt HINTER dem Film, nicht als Filter darüber.
     Ein drop-shadow über dem Video rechnet jedes Bild neu durch;
     eine Fläche, die nur ihre Deckkraft ändert, macht die
     Grafikkarte nebenbei. */
  function scheinSchicht(s, profil) {
    var g = document.createElement("u");
    g.className = "dma-film-schein";
    g.style.cssText = "position:absolute;left:50%;top:50%;width:150%;height:150%;"
      + "transform:translate(-50%,-50%);opacity:0;will-change:opacity;"
      + "background:radial-gradient(closest-side, rgba(" + profil.farbe + ",.5), rgba("
      + profil.farbe + ",.14) 45%, rgba(" + profil.farbe + ",0) 72%);";
    s.insertBefore(g, s.firstChild);
    return g;
  }

  function spielen(name, opt) {
    opt = opt || {};
    /* Wer wenig Bewegung möchte, bekommt das Standbild — nicht
       nichts, und nicht das ganze Getöse. */
    var ruhig = false;
    try {
      ruhig = Boolean(window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {}

    return holen(name).then(function (d) {
      if (LAEUFT) { try { LAEUFT.remove(); } catch (e) {} LAEUFT = null; }
      var s = schicht();
      LAEUFT = s;
      document.body.appendChild(s);

      function weg() {
        if (LAEUFT === s) LAEUFT = null;
        s.style.transition = "opacity .5s";
        s.style.opacity = "0";
        setTimeout(function () { try { s.remove(); } catch (e) {} }, 520);
      }

      if (ruhig) {
        var i = document.createElement("img");
        i.src = d.bild; i.alt = "";
        i.style.cssText = "max-width:70%;max-height:70%;object-fit:contain;";
        s.appendChild(i);
        setTimeout(weg, 2600);
        return { art: "standbild", schicht: s };
      }

      /* ERST HOLEN. Solange dreht sich ein Ring. */
      var alphaWeg = kannAlphaWebm();
      var url = alphaWeg ? d.webm : d.maske;
      var ring = warten(s);
      return datei(url).then(function (quelle) {
        try { ring.remove(); } catch (e) {}
        if (!document.body.contains(s)) return { art: "abgebrochen" };

        var profil = PROFILE[d.wirkung] || PROFILE.keiner;
        var schein = profil.schein ? scheinSchicht(s, profil) : null;
        var v = alphaWeg ? direkt(quelle, d, s) : zusammensetzen(quelle, d, s);

        /* DER TON DES FILMS. Gewünscht: „Ich möchte den Sound von
           dem Video hören." Viele Telefone lassen Ton nur nach
           einer Berührung zu; verweigert das Gerät ihn, läuft der
           Film stumm weiter — lieber stumm als gar nicht. */
        v.muted = Boolean(opt.stumm);
        v.volume = typeof opt.laut === "number" ? opt.laut : 0.9;

        var teilchen = (profil.staub || profil.funken || profil.streifen || profil.dampf)
          ? teilchenSchicht(s, profil) : null;
        var laeuftWirkung = Boolean(d.staerke && d.staerke.length) && (teilchen || schein);

        function wirkung() {
          if (!laeuftWirkung || !document.body.contains(s)) return;
          var t = v.currentTime || 0;
          var k = kraftBei(d.staerke, t);
          if (schein) schein.style.opacity = (0.08 + 0.55 * k * profil.schein).toFixed(3);
          if (teilchen) teilchen.zeichnen(k);
          /* SANFT AUFHOEREN. „dass das nicht abrupt aufhört." */
          var rest = (d.sekunden || 0) - t;
          if (rest > 0 && rest < 0.9) s.style.opacity = Math.max(0, rest / 0.9).toFixed(3);
          requestAnimationFrame(wirkung);
        }
        if (laeuftWirkung) requestAnimationFrame(wirkung);

        v.addEventListener("ended", function () { laeuftWirkung = false; });
        v.addEventListener("ended", weg);

        /* GEHT DAS VIDEO NICHT, DANN WENIGSTENS DAS STANDBILD. */
        v.addEventListener("error", function () {
          try {
            if (!s.querySelector("img")) {
              var c = s.querySelector("canvas.dma-film-bild"); if (c) c.remove();
              var b = document.createElement("img");
              b.src = d.bild; b.alt = "";
              b.style.cssText = "max-width:70%;max-height:70%;object-fit:contain;";
              s.appendChild(b);
            }
          } catch (e) {}
          setTimeout(weg, 2200);
        });
        /* Notbremse: bleibt das Video hängen, verschwindet die
           Schicht trotzdem. Eine Schicht über der ganzen Seite,
           die nicht mehr weggeht, wäre schlimmer als gar keine
           Animation. Die Frist folgt der echten Länge. */
        setTimeout(weg, Math.max(3000, ((d.sekunden || 5) + 2.5) * 1000));

        window.DMA_FILM_TON = "mit Ton";
        var start = v.play();
        if (start && start.catch) {
          start.catch(function () {
            /* Fast immer die Ton-Sperre des Browsers. Also stumm
               nochmal — und der Grund bleibt nachlesbar. */
            window.DMA_FILM_TON = "stumm (das Geraet erlaubt Ton erst nach einer Berührung)";
            v.muted = true;
            var zweit = v.play();
            if (zweit && zweit.catch) zweit.catch(function () {});
          });
        }
        return { art: alphaWeg ? "webm" : "maske", schicht: s, video: v, wirkung: d.wirkung || "keiner" };
      }).catch(function (e) {
        try { ring.remove(); } catch (x) {}
        try { weg(); } catch (x) {}
        throw e;
      });
    });
  }

  /* Der letzte Fehler, damit ihn auch /befund zeigen kann. */
  window.DMA_FILM_FEHLER = "";
  window.DMA_FILM_TON = "";
  var spielenRoh = spielen;
  spielen = function (name, opt) {
    return spielenRoh(name, opt).then(function (r) {
      window.DMA_FILM_FEHLER = "";
      return r;
    }).catch(function (e) {
      window.DMA_FILM_FEHLER = String((e && e.message) || e);
      throw e;
    });
  };

  window.DMA_FILM = {
    spielen: spielen,
    letzterFehler: function () { return window.DMA_FILM_FEHLER; },
    letzterTon: function () { return window.DMA_FILM_TON; },
    kannAlphaWebm: kannAlphaWebm,
    /* Vorladen, ohne zu zeigen — damit der erste Film nicht der
       langsamste ist. */
    vorladen: function (n) {
      return holen(n).then(function (d) {
        return datei(kannAlphaWebm() ? d.webm : d.maske);
      }).catch(function () { return null; });
    },
    /* Für die Sonde: von aussen prüfbar, welcher Weg genommen würde. */
    pruefWeg: function (erzwinge) {
      if (erzwinge === "maske") kannAlphaWebm = function () { return false; };
      if (erzwinge === "webm") kannAlphaWebm = function () { return true; };
      return kannAlphaWebm();
    }
  };
})();
