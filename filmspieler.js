/* =========================================================
   DER FILMSPIELER — eine Animation legt sich über die Seite
   ---------------------------------------------------------
   GEWÜNSCHT: „Wie bei TikTok, wo plötzlich ein Löwe herumläuft
   … und das liegt einfach nur über dem Chat."

   Genau das macht diese Datei: sie legt ein freigestelltes Video
   über alles, spielt es einmal ab und räumt sich selbst wieder
   weg. Erzeugt werden die Videos mit werkzeug/film-freistellen.sh,
   die Anleitung steht in filme/LIESMICH.md.

   WARUM ZWEI WEGE
   Chrome, Firefox und Android können WebM mit Alphakanal — dann
   ist es ein <video> und sonst nichts.
   Safari kann das NICHT. Ohne einen zweiten Weg sähen alle
   iPhone-Leute einen grünen Kasten, und das sind die meisten.
   Für sie liegt daneben ein MP4, in dem Bild und Maske
   NEBENEINANDER stehen. Beides wieder zusammenzusetzen geht
   erstaunlich einfach: EIN Bild, zweimal abgetastet — links die
   Farbe, rechts die Deckung. Das macht die Grafikkarte in einem
   Zug, ohne dass ein einziger Bildpunkt durch JavaScript muss.

   Aufruf:
     DMA_FILM.spielen("loewe")                  einmal abspielen
     DMA_FILM.spielen("loewe", { ton: true })   mit Ton
   ========================================================= */
(function () {
  "use strict";
  var DA = {};                     // schon geladene Beschreibungen
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

  function holen(name) {
    if (DA[name]) return Promise.resolve(DA[name]);
    return fetch("filme/" + name + ".json", { cache: "force-cache" })
      .then(function (a) { if (!a.ok) throw new Error("kein Film: " + name); return a.json(); })
      .then(function (d) { DA[name] = d; return d; });
  }

  function schicht() {
    var s = document.createElement("div");
    s.className = "dma-film";
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;"
      + "display:flex;align-items:center;justify-content:center;";
    return s;
  }

  /* ---- Weg 1: das Video kann Durchsichtigkeit selbst ---- */
  function direkt(d, s, opt) {
    var v = document.createElement("video");
    v.src = d.webm;
    v.autoplay = true; v.playsInline = true; v.muted = !opt.ton;
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

  function zusammensetzen(d, s, opt) {
    var v = document.createElement("video");
    v.src = d.maske;
    v.autoplay = true; v.playsInline = true; v.muted = !opt.ton; v.loop = false;
    v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;";
    s.appendChild(v);

    var c = document.createElement("canvas");
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
     DIE DRAMATIK — BEBEN, AUSSTRAHLUNG, STAUB
     ---------------------------------------------------------
     GEWÜNSCHT: „dass der Chat durch das Trampeln vibriert …
     dass der Boden unter ihm bebt und Staub aufwirbelt … und so
     eine Ausstrahlung, dass es mit dem Raum ineinander übergeht."

     Alle drei folgen EINER gemessenen Zahl: der Heftigkeit des
     Films an dieser Stelle (siehe werkzeug/stoesse-finden.js).
     Sie steht als Kurve in der Beschreibung, steigt, wenn das
     Tier näher kommt, und gipfelt beim Brüllen.

     Warum nicht einfach im Takt wackeln: ein erfundener Takt
     wackelt dann, wenn gerade nichts passiert, und das sieht
     jeder sofort.

     Der Staub entsteht HIER und nicht im Video: halbdurchsichtiger
     Staub vor einem Greenscreen wird beim Freistellen matschig
     und zieht einen grünen Schleier mit. Gezeichnet ist er sauber.
     ========================================================= */
  function kraftBei(kurve, t) {
    if (!kurve || !kurve.length) return 0;
    var a = 0, b = kurve.length - 1;
    if (t <= kurve[0][0]) return kurve[0][1];
    if (t >= kurve[b][0]) return kurve[b][1];
    while (b - a > 1) { var m = (a + b) >> 1; if (kurve[m][0] <= t) a = m; else b = m; }
    var f = (t - kurve[a][0]) / Math.max(0.001, kurve[b][0] - kurve[a][0]);
    return kurve[a][1] + (kurve[b][1] - kurve[a][1]) * f;
  }

  function staubSchicht(s) {
    var c = document.createElement("canvas");
    c.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    s.appendChild(c);
    var x = c.getContext("2d");
    var koerner = [];
    function groesse() {
      c.width = Math.min(900, s.clientWidth || 400);
      c.height = Math.min(1600, s.clientHeight || 800);
    }
    groesse();
    window.addEventListener("resize", groesse);
    return {
      leinwand: c,
      zeichnen: function (k) {
        /* Neue Körner nur, wenn wirklich etwas los ist. */
        var neu = Math.round(k * 5);
        for (var i = 0; i < neu; i++) {
          koerner.push({
            x: c.width * (0.16 + Math.random() * 0.68),
            y: c.height * (0.86 + Math.random() * 0.06),
            vx: (Math.random() - 0.5) * 3.6 * (0.4 + k),
            vy: -(0.4 + Math.random() * 1.6) * (0.4 + k),
            r: 2 + Math.random() * 9 * (0.5 + k),
            leben: 1,
          });
        }
        x.clearRect(0, 0, c.width, c.height);
        for (var j = koerner.length - 1; j >= 0; j--) {
          var p = koerner[j];
          p.x += p.vx; p.y += p.vy; p.vy += 0.045; p.r += 0.5;
          p.leben -= 0.013;
          if (p.leben <= 0) { koerner.splice(j, 1); continue; }
          var g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, "rgba(206,178,138," + (0.19 * p.leben).toFixed(3) + ")");
          g.addColorStop(1, "rgba(206,178,138,0)");
          x.fillStyle = g;
          x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.2832); x.fill();
        }
        /* Und ein flacher Dunst am Boden, solange es heftig ist. */
        if (k > 0.05) {
          var b = x.createRadialGradient(c.width / 2, c.height * 0.93, 0,
                                         c.width / 2, c.height * 0.93, c.width * 0.55);
          b.addColorStop(0, "rgba(206,184,148," + (0.22 * k).toFixed(3) + ")");
          b.addColorStop(1, "rgba(206,184,148,0)");
          x.fillStyle = b;
          x.fillRect(0, c.height * 0.72, c.width, c.height * 0.28);
        }
      },
    };
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
        /* Der Körper darf auf keinen Fall verschoben stehen
           bleiben — das wäre ein schiefer Bildschirm für immer. */
        try { document.body.style.transform = ""; } catch (e) {}
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

      var v = kannAlphaWebm() ? direkt(d, s, opt) : zusammensetzen(d, s, opt);

      /* ---- Beben, Ausstrahlung, Staub ---- */
      var bild = s.querySelector("video:not([style*=\"-9999\"])") || s.querySelector("canvas") || v;
      var staub = (d.staerke && d.staerke.length) ? staubSchicht(s) : null;
      var koerperVorher = document.body.style.transform || "";
      var laeuftDramatik = Boolean(d.staerke && d.staerke.length);
      function dramatik() {
        if (!laeuftDramatik || !document.body.contains(s)) {
          document.body.style.transform = koerperVorher;
          return;
        }
        var t = v.currentTime || 0;
        var k = kraftBei(d.staerke, t);
        /* Das Beben. Zwei Schwingungen mit krummem Verhältnis —
           eine einzelne Frequenz klänge wie ein Motor. */
        var a1 = k * k * 7;
        var dx = Math.sin(t * 61) * a1 + Math.sin(t * 37) * a1 * 0.6;
        var dy = Math.cos(t * 53) * a1 * 0.8 + Math.sin(t * 89) * a1 * 0.4;
        document.body.style.transform = k > 0.02
          ? "translate3d(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px,0)"
          : koerperVorher;
        /* Die Ausstrahlung: ein warmer Schein um das Tier, der in
           den Raum ausläuft. drop-shadow folgt der Durchsichtigkeit,
           legt sich also um den Umriss und nicht um den Kasten. */
        if (bild && bild.style) {
          bild.style.filter = "drop-shadow(0 0 " + (8 + 46 * k).toFixed(1) + "px rgba(255,168,72,"
            + (0.18 + 0.46 * k).toFixed(3) + ")) drop-shadow(0 2px "
            + (4 + 14 * k).toFixed(1) + "px rgba(0,0,0,.45))";
        }
        if (staub) staub.zeichnen(k);
        requestAnimationFrame(dramatik);
      }
      if (laeuftDramatik && !ruhig) requestAnimationFrame(dramatik);
      var dramatikAus = function () {
        laeuftDramatik = false;
        document.body.style.transform = koerperVorher;
      };
      v.addEventListener("ended", dramatikAus);
      v.addEventListener("ended", weg);
      /* GEHT DAS VIDEO NICHT, DANN WENIGSTENS DAS STANDBILD.
         Vorher verschwand die Schicht einfach — und damit sah man
         gar nichts und wusste auch nicht, warum. Ein Browser, der
         den Film nicht abspielen kann (ein altes Geraet, ein
         fehlender Codec), soll trotzdem etwas zu sehen bekommen. */
      v.addEventListener("error", function () {
        try {
          if (!s.querySelector("img")) {
            var c = s.querySelector("canvas"); if (c) c.remove();
            var i = document.createElement("img");
            i.src = d.bild; i.alt = "";
            i.style.cssText = "max-width:70%;max-height:70%;object-fit:contain;";
            s.appendChild(i);
          }
        } catch (e) {}
        setTimeout(weg, 2200);
      });
      /* Notbremse: bleibt das Video hängen, verschwindet die Schicht
         trotzdem. Eine Schicht über der ganzen Seite, die nicht mehr
         weggeht, wäre schlimmer als gar keine Animation. */
      setTimeout(weg, Math.max(3000, ((d.sekunden || 5) + 2) * 1000));
      var start = v.play();
      if (start && start.catch) start.catch(function () { /* stumm weiter */ });
      return { art: kannAlphaWebm() ? "webm" : "maske", schicht: s, video: v };
    });
  }

  window.DMA_FILM = {
    spielen: spielen,
    kannAlphaWebm: kannAlphaWebm,
    /* Für die Sonde: von aussen prüfbar, welcher Weg genommen würde. */
    pruefWeg: function (erzwinge) {
      if (erzwinge === "maske") kannAlphaWebm = function () { return false; };
      if (erzwinge === "webm") kannAlphaWebm = function () { return true; };
      return kannAlphaWebm();
    },
  };
})();
