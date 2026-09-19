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

      var v = kannAlphaWebm() ? direkt(d, s, opt) : zusammensetzen(d, s, opt);
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
