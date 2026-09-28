/* =====================================================================
   BAUKASTEN-STADT — DER BODEN (Wiese, Rasen, Weg, Bach, Erde, Schnee)
   ---------------------------------------------------------------------
   XANDER: „mit schönen Texturen einer Wiese, die sich nicht repetitive
   wiederholt … wo, wenn man die Module aneinander steckt, gar nicht mehr
   erkennt, dass es getrennte Puzzle Teile sind, sondern wirklich so
   aussieht, als wenn das ne organische echte Wiese wäre."

   SO GEHT DAS: Der Boden ist keine Kachel, die sich wiederholt, sondern
   eine Rechnung über die Weltkoordinate — an jedem Punkt der Welt ergibt
   sich die Farbe aus mehreren übereinanderliegenden Rauschmustern (große
   Flächen, Büschel, einzelne Halme). Weil die Rechnung an Stelle 10,3 m
   dieselbe ist, egal zu welchem Stück sie gehört, gibt es keine Nähte.
   Die Grafikkarte rechnet das für jeden Bildpunkt neu (WebGL) — auch
   ganz nah herangezoomt bleibt es scharf.

   Wege, Bach, Rasen und Beete liegen in einer Karte (4 Punkte je Meter).
   Ihre Ränder werden in der Rechnung mit Rauschen verwackelt: Gras
   wächst in den Weg hinein, das Ufer ist unregelmäßig.
   ===================================================================== */
(function () {
  "use strict";
  const ST = (window.STADT = window.STADT || {});
  const B = (ST.boden = {});

  /* Weltgröße und Kartenauflösung */
  B.GROESSE = 144;                // Meter (3 × 3 Bereiche à 48 m)
  B.RAND = 40;                    // Meter Wald/Wiese rundherum
  B.AUFL = 4;                     // Kartenpunkte je Meter
  const N = (B.GROESSE + 2 * B.RAND) * B.AUFL;   // 896
  B.N = N;
  /* Karte: R = Weg (Pflaster), G = Wasser, B = Beet/Erde, A = Rasen */
  const karte = document.createElement("canvas");
  karte.width = karte.height = N;
  const kg = karte.getContext("2d", { willReadFrequently: true });
  B.karte = karte;
  let daten = new Uint8ClampedArray(N * N * 4);
  B.daten = daten;
  let geaendert = true;

  /* Weltpunkt → Kartenpunkt */
  B.zuKarte = function (x, y) { return [(x + B.GROESSE / 2 + B.RAND) * B.AUFL, (y + B.GROESSE / 2 + B.RAND) * B.AUFL]; };

  /* Malen mit weichem Pinsel: art = 0 Weg, 1 Wasser, 2 Beet, 3 Rasen;
     wert 1 = setzen, 0 = wegnehmen */
  B.pinsel = function (x, y, radius, art, wert) {
    const [cx, cy] = B.zuKarte(x, y);
    const r = radius * B.AUFL;
    const x0 = Math.max(0, Math.floor(cx - r - 1)), x1 = Math.min(N - 1, Math.ceil(cx + r + 1));
    const y0 = Math.max(0, Math.floor(cy - r - 1)), y1 = Math.min(N - 1, Math.ceil(cy + r + 1));
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) {
      const d = Math.hypot(i + 0.5 - cx, j + 0.5 - cy);
      if (d > r + 1) continue;
      const k = Math.max(0, Math.min(1, r + 0.5 - d));      // weiche Kante über einen Kartenpunkt
      const idx = (j * N + i) * 4 + art;
      const alt = daten[idx], ziel = wert ? 255 : 0;
      daten[idx] = Math.round(alt + (ziel - alt) * k);
      /* Wasser verdrängt Weg und Beet, Weg verdrängt Rasen */
      if (wert && k > 0.5) {
        if (art === 1) { daten[idx - 1] = Math.min(daten[idx - 1], 255 - daten[idx]); daten[idx + 1] = 0; }
        if (art === 0) { daten[idx + 3] = Math.min(daten[idx + 3], 255 - daten[idx]); }
      }
    }
    geaendert = true;
  };
  /* Linie aus Pinselpunkten (für Wege und Bachlauf) */
  B.linie = function (pts, radius, art, wert) {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (0.25)));
      for (let k = 0; k <= n; k++) B.pinsel(ax + (bx - ax) * k / n, ay + (by - ay) * k / n, typeof radius === "function" ? radius(i, k / n) : radius, art, wert);
    }
  };
  B.wert = function (x, y, art) {
    const [cx, cy] = B.zuKarte(x, y);
    const i = Math.max(0, Math.min(N - 1, Math.floor(cx))), j = Math.max(0, Math.min(N - 1, Math.floor(cy)));
    return daten[(j * N + i) * 4 + art] / 255;
  };
  B.leeren = function () { daten.fill(0); geaendert = true; };
  B.speichern = function () {
    /* Je Kanal für sich lauflängen-kodiert (Weg, Wasser, Beet, Rasen) –
       die Karte ist meist leer, so bleibt der Text klein */
    const aus = ["p"];
    const n = N * N;
    for (let c = 0; c < 4; c++) {
      let alt = daten[c], z = 0;
      for (let i = 0; i < n; i++) {
        const v = daten[i * 4 + c];
        if (v === alt) z++; else { aus.push(alt.toString(36) + "." + z.toString(36)); alt = v; z = 1; }
      }
      aus.push(alt.toString(36) + "." + z.toString(36));
      aus.push("|");
    }
    return aus.join(",");
  };
  B.laden = function (txt) {
    if (txt.slice(0, 2) !== "p,") {
      /* altes Format: verschränkt */
      const z = txt.split(",").map(Number); let p = 0;
      for (let i = 0; i < z.length; i += 2) { daten.fill(z[i], p, p + z[i + 1]); p += z[i + 1]; }
      geaendert = true; return;
    }
    const teile = txt.slice(2).split(",|");
    for (let c = 0; c < 4 && c < teile.length; c++) {
      let i = 0;
      for (const e of teile[c].split(",")) {
        if (!e) continue;
        const [v, z] = e.split(".").map((x) => parseInt(x, 36));
        for (let k = 0; k < z; k++) daten[(i + k) * 4 + c] = v;
        i += z;
      }
    }
    geaendert = true;
  };

  /* =====================================================================
     WEBGL
     ===================================================================== */
  const VS = `#version 300 es
  in vec2 p; out vec2 v_p;
  void main(){ v_p = p; gl_Position = vec4(p, 0.0, 1.0); }`;

  const FS = `#version 300 es
  precision highp float;
  in vec2 v_p; out vec4 farbe;
  uniform vec2 u_bild;        // Bildgröße (Gerätepixel)
  uniform vec2 u_kam;         // Kameramitte (Welt)
  uniform float u_s;          // Pixel je Meter
  uniform int u_dreh;
  uniform float u_zeit;       // Sekunden
  uniform float u_schnee;     // 0…1
  uniform float u_fruehling;  // 0…1 Blüten
  uniform float u_herbst;     // 0…1
  uniform vec3 u_amb, u_sonne; uniform float u_nacht;
  uniform vec3 u_licht;       // Kameraraum
  uniform sampler2D u_karte;
  uniform float u_groesse, u_rand;

  // ---------- Rauschen ----------
  float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
  vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p+n+17.0)); }
  float vn(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x), u.y); }
  float fbm(vec2 p){ float s=0.0, a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s+=a*vn(p); p=m*p; a*=0.5; } return s; }
  float fbm3(vec2 p){ float s=0.0, a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<3;i++){ s+=a*vn(p); p=m*p; a*=0.5; } return s; }
  // Zellen (Pflastersteine): Abstand zum nächsten und zweitnächsten Punkt
  vec3 zellen(vec2 p){ vec2 i=floor(p), f=fract(p); float d1=8.0, d2=8.0; vec2 id=vec2(0);
    for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(x,y); vec2 o=0.5+0.38*(h22(i+g)-0.5)*2.0*0.5;
      vec2 r=g+o-f; float d=dot(r,r); if(d<d1){ d2=d1; d1=d; id=i+g; } else if(d<d2) d2=d; }
    return vec3(sqrt(d1), sqrt(d2), h21(id)); }

  // Grashalme im Bildraum: Wurzel unten, Spitze oben, leicht geneigt.
  // q in „Bildmetern" (x nach rechts, y nach unten). Ergebnis: (Deckung, Höhe am Halm 0…1, Zufall)
  vec3 halme(vec2 q, float breite, float hoehe, float saat) {
    vec2 zelle = vec2(breite, hoehe * 0.42);
    vec2 id = floor(q / zelle);
    float bestY = -1e9; vec3 r = vec3(0.0);
    for (int j = 0; j <= 2; j++) for (int i = -1; i <= 1; i++) {
      vec2 c = id + vec2(float(i), float(j));
      vec2 h = h22(c + saat);
      float rx = (c.x + h.x) * zelle.x;
      float ry = (c.y + 1.0 - h.y * 0.35) * zelle.y;
      float hb = hoehe * (0.5 + 0.5 * h21(c + saat + 7.0));
      float t = (ry - q.y) / hb;
      if (t < 0.0 || t > 1.0) continue;
      float neig = (h21(c + saat + 3.0) - 0.5) * hb * 0.8;
      float cx = rx + neig * t * t;
      float hw = breite * 0.36 * (1.0 - t * 0.9);
      if (abs(q.x - cx) < hw && ry > bestY) { bestY = ry; r = vec3(1.0, t, h21(c + saat + 11.0)); }
    }
    return r;
  }

  vec2 dreh(vec2 a, int d){ if(d==1) return vec2(-a.y,a.x); if(d==2) return -a; if(d==3) return vec2(a.y,-a.x); return a; }

  vec4 karte(vec2 w){ vec2 k = (w + u_groesse*0.5 + u_rand) / (u_groesse + 2.0*u_rand); return texture(u_karte, k); }

  void main(){
    // Bildpunkt → Weltpunkt am Boden
    vec2 px = vec2((v_p.x*0.5+0.5)*u_bild.x, (0.5-v_p.y*0.5)*u_bild.y);
    float uu = (px.x - u_bild.x*0.5) / (0.70710678*u_s);
    float vv = (px.y - u_bild.y*0.5) / (0.35355339*u_s);
    vec2 a = vec2((uu+vv)*0.5, (vv-uu)*0.5);
    int rueck = (4 - u_dreh) & 3;
    vec2 w = dreh(a, rueck) + u_kam;
    // Pixelgröße in Metern (für saubere Übergänge beim Herauszoomen)
    float pm = 1.0 / u_s;

    // ---------- Karte mit verwackelten Rändern ----------
    vec2 wack = vec2(fbm3(w*1.7+3.1), fbm3(w*1.7+9.4)) - 0.5;
    vec4 k = karte(w + wack*0.55);
    vec4 kf = karte(w + wack*0.25);
    float weg = smoothstep(0.35, 0.65, k.r);
    float wasser = kf.g;
    float beet = smoothstep(0.3, 0.7, k.b);
    float rasen = smoothstep(0.3, 0.7, k.a);

    // ---------- Gelände-Relief (sanfte Wellen) → Licht ----------
    float hh = fbm(w*0.08)*1.2 + fbm(w*0.6)*0.25 + vn(w*4.0)*0.04;
    float e = 0.15;
    float hx = fbm(w*0.08+vec2(e*0.08,0.0))*1.2 + fbm((w+vec2(e,0.0))*0.6)*0.25 - (fbm(w*0.08)*1.2 + fbm(w*0.6)*0.25);
    float hy = fbm(w*0.08+vec2(0.0,e*0.08))*1.2 + fbm((w+vec2(0.0,e))*0.6)*0.25 - (fbm(w*0.08)*1.2 + fbm(w*0.6)*0.25);
    vec3 nw = normalize(vec3(-hx/e*0.9, -hy/e*0.9, 1.0));
    vec2 nr = dreh(nw.xy, u_dreh);
    vec3 n = vec3(nr, nw.z);
    float dif = max(0.0, dot(n, u_licht));

    // ---------- Wiese ----------
    // XANDER: „eine Wiese, die sich nicht repetitive wiederholt … so aussieht, als wenn das ne organische echte Wiese wäre."
    // Drei Größenordnungen: große Farbflächen (sanft, eher Farbton als Helligkeit), Büschel (mittlerer Zoom),
    // Einzelhalme (ganz nah). Alles hängt an der Weltkoordinate – es gibt keine Kachel, die sich wiederholt.
    float gross = fbm(w*0.045);
    float mittel = fbm(w*0.23+7.0);
    float fein = vn(w*3.1) * 0.6 + vn(w*7.3)*0.4;
    vec3 gGruen = vec3(0.31, 0.44, 0.17), gSatt = vec3(0.23, 0.39, 0.13), gTrocken = vec3(0.47, 0.50, 0.25), gKuehl = vec3(0.26, 0.42, 0.22);
    vec3 wiese = mix(gGruen, gSatt, smoothstep(0.3, 0.8, mittel) * 0.7);
    wiese = mix(wiese, gTrocken, smoothstep(0.55, 0.8, gross) * 0.35);
    wiese = mix(wiese, gKuehl, smoothstep(0.5, 0.2, gross) * 0.3);
    wiese *= 0.95 + 0.1 * fein;
    // Büschel: klumpige Struktur, hell die Spitzen, dunkel die Lücken
    float bue = vn(w*8.0) * 0.55 + vn(w*21.0) * 0.3 + vn(w*47.0) * 0.15;
    float bueSicht = smoothstep(0.06, 0.02, pm);
    wiese *= mix(1.0, 0.9 + 0.18 * smoothstep(0.2, 0.85, bue), bueSicht);
    // Klee und Moos in Inseln
    float klee = smoothstep(0.62, 0.7, fbm3(w*0.9+21.0));
    wiese = mix(wiese, vec3(0.22, 0.41, 0.19), klee*0.4);
    // Einzelhalme (Bildraum, Wurzel unten): zwei Lagen
    vec2 ac = dreh(w, u_dreh);
    vec2 q = vec2((ac.x - ac.y) * 0.70710678, (ac.x + ac.y) * 0.35355339);
    float halmSicht = smoothstep(0.024, 0.008, pm);
    vec3 hA = vec3(0.0), hB = vec3(0.0);
    float halm = 0.5;
    if (halmSicht > 0.0) {
      hA = halme(q, 0.034, 0.085, 1.0);
      hB = halme(q + vec2(0.013, 0.021), 0.024, 0.06, 5.0);
      vec3 grund = wiese * 0.5;
      vec3 hal = grund;
      vec3 halmA = mix(wiese * 0.72, wiese * 1.22 + vec3(0.03, 0.03, 0.0), hA.y) * (0.85 + 0.3 * hA.z);
      vec3 halmB = mix(wiese * 0.62, wiese * 1.1, hB.y) * (0.85 + 0.3 * hB.z);
      hal = mix(hal, halmB, hB.x);
      hal = mix(hal, halmA, hA.x);
      wiese = mix(wiese, hal, halmSicht);
      halm = max(hA.x * hA.y, hB.x * hB.y * 0.8);
    }
    // Frühling: Wildblumen in Nestern – Gänseblümchen, Löwenzahn, Klee, Hahnenfuß
    if (u_fruehling > 0.0) {
      float nest = smoothstep(0.45, 0.75, fbm3(w*0.35 + 40.0));
      vec2 zi = floor(w*7.0); vec2 zf = fract(w*7.0) - 0.5 - (h22(zi)-0.5)*0.7;
      float art = h21(zi+9.0);
      float gr = art > 0.75 ? 0.17 : 0.12;
      float dd = length(zf * vec2(1.0, 1.6));
      float bl = step(1.0 - 0.18*nest - 0.03, h21(zi+3.0)) * smoothstep(gr, gr*0.55, dd) * smoothstep(0.03, 0.01, pm);
      vec3 bf = art > 0.75 ? vec3(0.98,0.82,0.14) : art > 0.5 ? vec3(0.99,0.97,0.94) : art > 0.3 ? vec3(0.95,0.93,0.35) : vec3(0.93,0.72,0.82);
      // Blütenmitte bei Gänseblümchen
      if (art <= 0.75 && art > 0.5) bf = mix(vec3(0.98,0.85,0.2), bf, smoothstep(gr*0.25, gr*0.45, dd));
      wiese = mix(wiese, bf, bl*u_fruehling);
    }
    // Herbst: gelbe Töne und Laub
    wiese = mix(wiese, wiese*vec3(1.25,1.0,0.6), u_herbst*0.4*smoothstep(0.4,0.8,gross));

    // ---------- Rasen: gemäht, Streifen ----------
    float streifen = step(0.5, fract(w.x*0.5 + vn(w*0.3)*0.1));
    vec3 ras = mix(vec3(0.33, 0.52, 0.19), vec3(0.28, 0.47, 0.16), streifen);
    ras *= 0.93 + 0.14*vn(w*6.0) + 0.08*(halm - 0.5)*halmSicht;
    vec3 boden = mix(wiese, ras, rasen);

    // ---------- Erde / Beet ----------
    vec3 erde = mix(vec3(0.30, 0.22, 0.15), vec3(0.22, 0.15, 0.10), vn(w*5.0));
    erde *= 0.9 + 0.2*vn(w*20.0);
    float furche = smoothstep(0.3, 0.5, abs(fract(w.y*3.0)-0.5)*2.0);
    erde *= 0.85 + 0.15*furche;
    boden = mix(boden, erde, beet);

    // ---------- Pflasterweg (Kopfsteinpflaster) ----------
    vec3 z = zellen(w*4.2);
    float fuge = smoothstep(0.02, 0.09, z.y - z.x);
    vec3 stein = mix(vec3(0.52, 0.49, 0.45), vec3(0.62, 0.58, 0.52), z.z);
    stein = mix(stein, vec3(0.45, 0.43, 0.42), step(0.8, h21(vec2(z.z*91.0, 3.0)))*0.6);
    stein *= 0.9 + 0.18*(1.0 - z.x*1.4);          // Wölbung: Mitte heller
    stein *= 0.92 + 0.16*vn(w*18.0);
    vec3 sand = vec3(0.40, 0.36, 0.30);
    vec3 pflaster = mix(sand, stein, mix(1.0, fuge, smoothstep(0.03, 0.012, pm)));
    // Gras in den Fugen am Wegrand
    float randWeg = weg * (1.0 - smoothstep(0.65, 0.95, k.r));
    pflaster = mix(pflaster, wiese*0.9, (1.0-fuge)*smoothstep(0.2,0.8,randWeg)*0.8);
    boden = mix(boden, pflaster, weg);

    // ---------- Licht auf dem Boden ----------
    vec3 lf = u_amb*(0.9+0.1*n.z) + u_sonne*dif*1.35;
    vec3 col = boden * min(lf, vec3(1.0));

    // ---------- Schnee ----------
    float schneeDicke = 0.0;
    if (u_schnee > 0.0) {
      float s1 = fbm(w*0.12+40.0), s2 = vn(w*2.6), s3 = vn(w*11.0);
      // dünne Stellen: Gras schaut heraus (vor allem auf Büscheln)
      float decke = u_schnee * (0.78 + 0.35*s1) - mittel*0.18*(1.0-u_schnee);
      float frei = smoothstep(0.66, 0.6, decke + s2*0.08 + s3*0.03);
      schneeDicke = 1.0 - frei;
      // auf dem Weg geräumt, am Rand Wälle
      float geraeumt = smoothstep(0.55, 0.85, k.r);
      float wall = smoothstep(0.2, 0.45, k.r) * (1.0 - smoothstep(0.5, 0.75, k.r));
      schneeDicke = max(schneeDicke*(1.0 - geraeumt*0.85), wall*u_schnee);
      schneeDicke *= (1.0 - smoothstep(0.1, 0.5, wasser));
      // Schneelicht: Relief stark sichtbar, blaue Schatten
      /* XANDER: „in aller ersten Schnee, wo du gesagt hast er wäre zu fleckig
         der war perfekt für Winter. Das sah so realistisch aus." – also wieder
         das kräftige Relief der ersten Fassung (Wellen ×1,6, ungeglättet),
         nur für den Schnee; die Wiese behält das sanfte Licht. */
      vec3 nws = normalize(vec3(-hx/e*1.6, -hy/e*1.6, 1.0));
      vec3 ns = vec3(dreh(nws.xy, u_dreh), nws.z);
      float sdif = max(0.0, dot(ns, u_licht));
      vec3 schneeFarbe = vec3(0.93, 0.95, 0.99);
      vec3 schneeLicht = u_amb*vec3(0.97,0.99,1.05) + u_sonne*sdif*1.45;
      vec3 sc = schneeFarbe * min(schneeLicht, vec3(1.05));
      sc *= 0.965 + 0.05*s3 + 0.03*vn(w*30.0);
      // Glitzern: winzige Kristalle, die aufblitzen
      vec2 gz = floor(w*26.0);
      float gl = step(0.985, h21(gz)) * (0.5+0.5*sin(u_zeit*2.0 + h21(gz+5.0)*40.0));
      sc += gl * smoothstep(0.01, 0.004, pm) * 0.35 * (1.0 - u_nacht*0.6);
      col = mix(col, sc, clamp(schneeDicke, 0.0, 1.0));
      // Wo der Schnee dünn ist, stechen trockene Halmspitzen heraus
      float duenn = smoothstep(0.86, 0.66, decke + s2*0.1) * (1.0 - weg) * (1.0 - smoothstep(0.1, 0.4, wasser));
      if (halmSicht > 0.0) {
        float spitze = max(hA.x * smoothstep(0.35, 0.7, hA.y), hB.x * smoothstep(0.4, 0.75, hB.y) * 0.7);
        vec3 stroh = vec3(0.62, 0.56, 0.36) * min(lf, vec3(1.0)) * (0.8 + 0.3*hA.z);
        col = mix(col, stroh, spitze * duenn * halmSicht * 0.85);
      }
    }

    // ---------- Wasser ----------
    if (wasser > 0.02) {
      // Tiefe = wie weit das Ufer entfernt ist: Wasser in zwei Ringen ringsum abtasten
      float r1 = 0.0, r2 = 0.0;
      for (int i = 0; i < 6; i++) { float a = float(i) * 1.0472 + 0.3; vec2 d = vec2(cos(a), sin(a));
        r1 += karte(w + wack*0.1 + d*0.8).g; r2 += karte(w + wack*0.1 + d*1.7).g; }
      float tiefe = smoothstep(0.35, 1.0, (r1 / 6.0) * 0.45 + (r2 / 6.0) * 0.55) * smoothstep(0.2, 0.9, kf.g);
      vec2 fl = w + vec2(u_zeit*0.18, u_zeit*0.05);
      float wel = fbm3(fl*2.2) * 0.6 + vn(fl*6.0 - u_zeit*0.3)*0.4;
      vec3 flach = vec3(0.36, 0.40, 0.30);   // Kies unter Wasser
      flach *= 0.85 + 0.3*zellen(w*7.0).x;
      vec3 tief = vec3(0.06, 0.18, 0.22);
      vec3 wf = mix(flach, tief, tiefe);
      // Himmel spiegelt sich
      vec3 himmel = mix(vec3(0.55,0.66,0.78), vec3(0.24,0.30,0.52), u_nacht);
      float fres = 0.25 + 0.25*wel;
      wf = mix(wf, himmel, fres*(0.4+0.6*tiefe));
      // Glanzlichter der Sonne
      float gl = pow(max(0.0, wel*1.2 - 0.62), 3.0) * 6.0 * (1.0 - u_nacht);
      wf += vec3(1.0,0.95,0.85) * gl * 0.45;
      wf *= min(u_amb + u_sonne*0.8, vec3(1.0));
      // Ufer: nasser Rand und helle Schaumlinie
      float ufer = smoothstep(0.02, 0.25, wasser) * (1.0 - smoothstep(0.25, 0.5, wasser));
      vec3 nass = col * 0.62;
      vec3 wc = mix(u_schnee > 0.0 ? col : nass, wf, smoothstep(0.18, 0.4, wasser));
      wc += vec3(0.9) * ufer * smoothstep(0.55, 0.8, vn(w*8.0 + u_zeit*0.6)) * 0.25 * (1.0-u_nacht*0.5);
      // Eis im Winter: der See friert ganz zu (Schlittschuhbahn), der Bach
      // nur am Rand – in der Mitte fließt dunkles Wasser zwischen Eisschollen
      if (u_schnee > 0.0) {
        float see = 0.0;
        for (int i = 0; i < 8; i++) { float a = float(i) * 0.7854; see += karte(w + vec2(cos(a), sin(a))*4.5).g; }
        float breit = smoothstep(0.3, 0.55, see / 8.0);
        float offen = (1.0 - breit) * smoothstep(0.55, 0.9, tiefe + (vn(w*1.3 + u_zeit*0.05) - 0.5)*0.35);
        float eis = u_schnee * (1.0 - offen);
        vec2 wv = w + vec2(fbm3(w*0.4), fbm3(w*0.4+5.0))*3.0;
        vec3 z1 = zellen(wv*0.32); vec3 z2 = zellen(wv*1.3+11.0);
        vec3 eisF = mix(vec3(0.66,0.78,0.86), vec3(0.84,0.90,0.95), vn(w*2.0)*0.7 + z1.z*0.3);
        // dunkle Tiefe schimmert durch, Risse, Luftblasen
        eisF = mix(eisF, vec3(0.30,0.42,0.52), smoothstep(0.5, 1.0, tiefe) * 0.35 * (1.0 - vn(w*0.6)));
        float riss = smoothstep(0.02, 0.0, z1.y - z1.x) * 0.22 * step(0.45, z1.z) + smoothstep(0.012, 0.0, z2.y - z2.x) * 0.10 * step(0.7, z2.z) * smoothstep(0.02, 0.008, pm);
        eisF *= 1.0 - riss;
        // Kufenspuren auf dem See: lange, sanft gebogene helle Linien
        float spur = 0.0;
        for (int i = 0; i < 5; i++) { float fi = float(i); vec2 m = vec2(52.0, 50.0) + vec2(sin(fi*2.1)*4.0, cos(fi*1.7)*3.0);
          float r = length((w - m) * vec2(1.0, 1.35)) - (3.0 + fi*1.6); spur += smoothstep(0.05, 0.0, abs(r)) * 0.5; }
        eisF += vec3(spur) * breit * 0.18 * smoothstep(0.03, 0.01, pm);
        // Schneeverwehungen auf dem Eis
        float sd = smoothstep(0.45, 0.75, fbm(w*0.35 + 17.0));
        vec3 schneeAufEis = vec3(0.94, 0.96, 0.99);
        eisF = mix(eisF, schneeAufEis, sd * 0.85);
        eisF *= min(u_amb*vec3(0.97,0.99,1.05) + u_sonne*1.2, vec3(1.05));
        // Glanz auf blankem Eis
        eisF += vec3(1.0,0.97,0.9) * pow(max(0.0, vn(w*0.9 + 3.0) - 0.55), 2.0) * 1.2 * (1.0 - sd) * (1.0 - u_nacht);
        wc = mix(wc, eisF, smoothstep(0.15, 0.5, eis) * smoothstep(0.03, 0.2, wasser));
        // offene Stellen: dunkler, ein schmaler Eisrand
        wc = mix(wc, wc*0.8 + vec3(0.1), smoothstep(0.02, 0.0, abs(eis - 0.5)) * 0.6);
      }
      col = mix(col, wc, smoothstep(0.02, 0.3, wasser));
    }

    // ---------- Rand der Stadt: sanft abdunkeln (Wald und Hügel dahinter) ----------
    float halbe = u_groesse*0.5;
    float aussen = max(abs(w.x), abs(w.y)) - halbe;
    col *= 1.0 - smoothstep(-2.0, 30.0, aussen) * 0.18;
    // Bauplatzgrenze: feine Linie aus Punkten im Schnee/Gras (nur nah)
    // Nacht: Mondlicht bläulich
    col = mix(col, col*vec3(0.8,0.88,1.1), smoothstep(0.5, 1.0, u_nacht)*0.5);
    farbe = vec4(col, 1.0);
  }`;

  let gl = null, prog = null, tex = null, ort = {};
  B.gl = function () { return gl; };
  B.start = function (canvas) {
    gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
    if (!gl) return false;
    const sh = (typ, src) => { const s = gl.createShader(typ); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); throw new Error("Boden-Shader: " + gl.getShaderInfoLog(s)); } return s; };
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
    ["u_bild", "u_kam", "u_s", "u_dreh", "u_zeit", "u_schnee", "u_fruehling", "u_herbst", "u_amb", "u_sonne", "u_nacht", "u_licht", "u_karte", "u_groesse", "u_rand"].forEach((n) => { ort[n] = gl.getUniformLocation(prog, n); });
    tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    geaendert = true;
    return true;
  };

  B.zeichnen = function (zeit, Z, jahr) {
    if (!gl) return;
    const k = ST.kamera;
    const c = gl.canvas;
    /* B.skala < 1: der Boden wird mit weniger Bildpunkten gerechnet und
       gestreckt (leichte Stadt auf schwachen Telefonen). Winterhausen: 1. */
    const sk = B.skala || 1, bw = Math.round(k.W * sk), bh = Math.round(k.H * sk);
    if (c.width !== bw || c.height !== bh) { c.width = bw; c.height = bh; }
    gl.viewport(0, 0, c.width, c.height);
    if (geaendert) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, daten);
      geaendert = false;
    }
    gl.uniform2f(ort.u_bild, c.width, c.height);
    gl.uniform2f(ort.u_kam, k.x, k.y);
    gl.uniform1f(ort.u_s, k.s * sk);
    gl.uniform1i(ort.u_dreh, k.dreh & 3);
    gl.uniform1f(ort.u_zeit, zeit);
    gl.uniform1f(ort.u_schnee, jahr === "winter" ? 1 : 0);
    gl.uniform1f(ort.u_fruehling, jahr === "fruehling" ? 1 : 0);
    gl.uniform1f(ort.u_herbst, jahr === "herbst" ? 1 : 0);
    gl.uniform3fv(ort.u_amb, Z.amb); gl.uniform3fv(ort.u_sonne, Z.sonne);
    gl.uniform1f(ort.u_nacht, Z.nacht);
    gl.uniform3fv(ort.u_licht, ST.LICHT);
    gl.uniform1i(ort.u_karte, 0);
    gl.uniform1f(ort.u_groesse, B.GROESSE); gl.uniform1f(ort.u_rand, B.RAND);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
})();
