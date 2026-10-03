#!/usr/bin/env node
/* =====================================================================
   ERINNERN: 1933–1945 (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   STANDORT: Berlin-Mitte, Gehweg vor einem Wohnhaus nahe dem Denkmal für
   die ermordeten Juden Europas. Vorne der Hauseingang mit Stolpersteinen
   und Gedenktafel, links die Straße hinunter das Stelenfeld.
   Ruhig, sachlich, würdevoll: ein Novembertag (Gedenktag 9. November),
   Kerzen und Blumen an den Stolpersteinen.

   RECHERCHE (Stiftung Denkmal, Stolpersteine-Projekt, berlin.de):
   - Das MAHNMAL (Peter Eisenman, 2005): 2711 graue Betonstelen in einem
     strengen Raster, 0,95 m breit, 2,38 m lang, 0 bis 4,7 m hoch; der
     Boden wellt sich, man geht zwischen ihnen hinein.
   - Darunter der ORT DER INFORMATION (Gedenkstätte mit Ausstellung),
     Eingang mit Treppe am Rand des Feldes.
   - STOLPERSTEINE (Gunter Demnig): 10 × 10 cm Messingplatten im Gehweg vor
     dem letzten frei gewählten Wohnort eines Opfers, Text „HIER WOHNTE …“.
     Am 9. November reinigen Menschen sie und stellen Kerzen und Blumen
     dazu; nach jüdischem Brauch legt man kleine Steine ab.
   - GEDENKTAFELN an Häusern nennen sachlich Jahre und Ereignisse; zu
     Gedenktagen hängt oder steht ein KRANZ mit Schleife davor.
   - Schulklassen besuchen das Denkmal und die Gedenkstätte.
   Hinweis: Auf den Stolpersteinen stehen hier keine erfundenen Namen —
   nur „HIER WOHNTE“ und die Jahreszahl; die Gravur ist angedeutet.
   Perspektive: Augenhöhe 1,6 m, Fluchtpunkt (150 | 108), Brennweite 260:
   x = 150 + 260·L/d, Boden y = 108 + 416/d. Hauswand frontal bei d = 7 m
   (≈ 37 Einheiten je Meter).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "gedenken", titel: "Erinnern: 1933–1945", emoji: "🕯️", thema: "Geschichte", kuerzel: "gdk", fassung: 852 });
const rnd = zufall(1109);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glimm")}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
const VX = 150, VY = 108, F = 260, AUGE = 1.6;
const px = (L, d) => VX + F * L / d;
const py = (h, d) => VY - (h - AUGE) * F / d;
const D_HAUS = 7, SH = F / D_HAUS, Y_HAUS = py(0, D_HAUS);      /* ≈ 37,1 je Meter, Hausfuß y ≈ 167,4 */
const X_ECKE = Math.round(VX + F * 0.3 / 7);
const BETON = S.lg("stele", [[0, "#9a9c9d"], [1, "#7d8081"]]);
const MESSING = S.lg("messing", [[0, "#f1d78a"], [0.5, "#d2a94a"], [1, "#a77d2a"]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Himmel (Novembertag), Bäume des Tiergartens, Straße
   ===================================================================== */
S.hinten(`<rect width="320" height="${VY + 4}" fill="${S.lg("himmel", [[0, "#9db3c8"], [0.7, "#cfd8df"], [1, "#e6e8e6"]])}"/>`);
S.hinten(`<g fill="#fff" opacity=".55"><ellipse cx="60" cy="18" rx="40" ry="5"/><ellipse cx="80" cy="40" rx="30" ry="3"/></g>`);
{
  /* Bäume hinter dem Feld: Herbstlaub, gedämpft */
  let g = "";
  for (let i = 0; i < 26; i++) {
    const x = -6 + i * 4.6 + rnd() * 3, y = 86 + rnd() * 10, rr = 5 + rnd() * 5;
    g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${["#a08a5a", "#8d8556", "#b39a62", "#7f7a52", "#9c7b4a"][Math.floor(rnd() * 5)]}" opacity=".9"/>`;
  }
  for (let i = 0; i < 8; i++) { const x = 4 + i * 14; g += `<line x1="${x}" y1="${r(98 + rnd() * 4)}" x2="${x}" y2="110" stroke="#5a4a3a" stroke-width=".8"/>`; }
  /* Bürohäuser rechts hinten am Ende der Straße */
  g += `<rect x="86" y="74" width="30" height="36" fill="#d8d3c8"/><rect x="86" y="74" width="30" height="1.4" fill="#b8b2a6"/>`;
  for (let j = 0; j < 6; j++) for (let i = 0; i < 5; i++) g += `<rect x="${88 + i * 5.6}" y="${77 + j * 5.4}" width="3" height="3.4" fill="#7d8790"/>`;
  S.hinten(g);
  /* Boden: Straße und Gehwege (Kulisse unter den Teilen) */
  S.hinten(`<rect y="${VY}" width="320" height="${200 - VY}" fill="#b9b3a8"/>`);
}

/* =====================================================================
   13 — DIE STRASSE (links, zwischen Haus und Stelenfeld)
   ===================================================================== */
{
  let k = `<path d="M${r(px(-0.3, D_HAUS) - VX)} ${r(py(0, D_HAUS) - VY)} L${r(px(-0.3, 90) - VX)} ${r(py(0, 90) - VY)} L${r(px(-3.4, 90) - VX)} ${r(py(0, 90) - VY)} L${-VX} ${r(py(0, 260 * 3.4 / VX) - VY)} L${-VX} 92 L${r(px(-0.3, 4.6) - VX)} 92 Z" fill="${S.lg("asph", [[0, "#7a7874"], [1, "#605e5a"]])}"/>`;
  k += `<path d="M${r(px(-2, 90) - VX)} ${r(py(0, 90) - VY)} L${r(px(-2, 4.6) - VX)} 92" stroke="#e9e7e1" stroke-width=".6" stroke-dasharray="3 4"/>`;
  /* Gehweg am Feld */
  k += `<path d="M${r(px(-3.4, 90) - VX)} ${r(py(0, 90) - VY)} L${r(px(-4.6, 90) - VX)} ${r(py(0, 90) - VY)} L${-VX} ${r(py(0, 260 * 4.6 / VX) - VY)} L${-VX} ${r(py(0, 260 * 3.4 / VX) - VY)} Z" fill="#b9b3a8"/>`;
  S.teil({ id: "strasse", de: "die Straße", syl: "STRA-ße", it: "la strada", itSyl: "STRA-da", en: "street", x: VX, y: VY, kunst: k });
}

/* =====================================================================
   12 — DER GEHWEG mit den Stolpersteinen (Lupe: Stolperstein, Kerze,
        weiße Rose, kleiner Stein)
   ===================================================================== */
const STS = { x: 286, d: 5.6 };   /* vor der Haustür */
{
  const unter = [];
  let k = "";
  /* Gehweg: Granitplatten in der Mitte, Mosaikpflaster an Haus und Bordstein */
  const yA = py(0, D_HAUS), yB = 200;
  k += `<path d="M${r(X_ECKE - 160)} ${r(yA - 200)} L160 ${r(yA - 200)} L160 0 L${r(px(-0.3, 4.6) - 160)} 0 L${r(px(-0.3, D_HAUS) - 160)} ${r(yA - 200)} Z" fill="#a9a398"/>`;
  for (const d of [6.6, 6.1, 5.6, 5.1, 4.7]) k += `<line x1="${r(X_ECKE - 160 - 10)}" y1="${r(py(0, d) - 200)}" x2="160" y2="${r(py(0, d) - 200)}" stroke="#8f897e" stroke-width=".5"/>`;
  for (let L = 0.4; L < 4.5; L += 0.6) k += `<line x1="${r(px(L, D_HAUS) - 160)}" y1="${r(yA - 200)}" x2="${r(Math.min(320, px(L, 4.6)) - 160)}" y2="0" stroke="#8f897e" stroke-width=".4"/>`;
  /* Herbstlaub */
  for (let i = 0; i < 26; i++) { const x = -40 + rnd() * 196, y = -28 + rnd() * 26; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="1.6" ry=".7" fill="${["#c98b3a", "#a8632a", "#d9a64a"][Math.floor(rnd() * 3)]}" transform="rotate(${Math.round(rnd() * 180)} ${r(x)} ${r(y)})" opacity=".85"/>`; }
  /* Stolpersteine: drei Messingplatten nebeneinander */
  const sx = STS.x - 160, sy = py(0, STS.d) - 200, sw = 9.2, sh = 3.8;
  for (let i = 0; i < 3; i++) {
    const x = sx - 10.4 + i * 10.4;
    k += `<path d="M${r(x - sw / 2)} ${r(sy)} L${r(x + sw / 2)} ${r(sy)} L${r(x + sw / 2 + 0.4)} ${r(sy + sh)} L${r(x - sw / 2 - 0.4)} ${r(sy + sh)} Z" fill="${MESSING}" stroke="#7a5a20" stroke-width=".3"/>`;
    k += `<text x="${r(x)}" y="${r(sy + 1.1)}" font-size=".9" text-anchor="middle" fill="#3a2a10" font-family="Arial,sans-serif" font-weight="bold">HIER WOHNTE</text>`;
    for (let j = 0; j < 4; j++) k += `<rect x="${r(x - sw / 2 + 0.8)}" y="${r(sy + 1.5 + j * 0.45)}" width="${r(sw - 1.6 - (j % 2) * 2)}" height=".22" fill="#5a4210" opacity=".75"/>`;
    k += `<path d="M${r(x - sw / 2 + 0.4)} ${r(sy + 0.3)} L${r(x - sw / 2 + 2.4)} ${r(sy + 0.3)}" stroke="#fff6cc" stroke-width=".3"/>`;
    if (i === 1) unter.push({ id: "stolperstein", de: "der Stolperstein", syl: "STOL-per-stein", it: "la pietra d'inciampo", itSyl: "PIE-tra d'in-CIAM-po", en: "stumbling stone",
      x: x + 160, y: sy + 200 + sh, kunst: flaeche(-sw / 2 - 0.6, -sh - 0.6, sw + 1.2, sh + 1.2),
      tipp: "Eine Messingplatte im Gehweg, vor dem letzten frei gewählten Wohnort eines Menschen, der verschleppt wurde." });
  }
  /* Kerzen (Gedenklichter im Glas) */
  const kerze = (x, y) => `<ellipse cx="${x}" cy="${r(y - 2.6)}" rx="3" ry="2.6" fill="#ffd27a" opacity=".45" filter="url(#${S.id("glimm")})"/>` +
    `<path d="M${r(x - 1.3)} ${r(y)} L${r(x - 1.4)} ${r(y - 3.6)} L${r(x + 1.4)} ${r(y - 3.6)} L${r(x + 1.3)} ${r(y)} Z" fill="#b8282a" opacity=".85"/><ellipse cx="${x}" cy="${r(y - 3.6)}" rx="1.4" ry=".4" fill="#d24a3a"/>` +
    `<path d="M${x} ${r(y - 3.4)} q-.6 -1 0 -2 q.6 1 0 2 Z" fill="#ffe9a8"/><path d="M${r(x - 1)} ${r(y - 3.2)} v2.8" stroke="#fff" stroke-width=".25" opacity=".5"/>`;
  k += kerze(sx - 19, sy + 3) + kerze(sx + 17, sy + 3.4);
  unter.push({ id: "kerze", de: "die Kerze", syl: "KER-ze", it: "la candela", itSyl: "can-DE-la", en: "candle", x: sx - 19 + 160, y: sy + 3 + 200, kunst: flaeche(-2, -6, 4, 6.4),
    tipp: "Am 9. November stellen Menschen Kerzen zu den Stolpersteinen." });
  /* weiße Rose quer über den Steinen */
  const rx = sx + 2, ry = sy + 4.6;
  k += `<path d="M${r(rx - 7)} ${r(ry)} L${r(rx + 3)} ${r(ry - 1.4)}" stroke="#4f7d3a" stroke-width=".5"/><path d="M${r(rx - 3)} ${r(ry - 0.6)} q-1 -1.4 .4 -1.6" fill="#5f8f45"/>`;
  k += `<circle cx="${r(rx + 4.2)}" cy="${r(ry - 1.6)}" r="1.7" fill="#fbfaf5"/><path d="M${r(rx + 3.4)} ${r(ry - 1.8)} q.8 -.8 1.6 0 q-.8 .6 -1.6 0" stroke="#d8d4c6" stroke-width=".25" fill="none"/>`;
  unter.push({ id: "rose", de: "die weiße Rose", syl: "WEIS-se RO-se", it: "la rosa bianca", itSyl: "RO-sa BIAN-ca", en: "white rose", x: rx + 2, y: ry + 0.4 + 200 - 200 + 0, kunst: flaeche(-9, -4, 13, 4.6),
    tipp: "Die Weiße Rose war eine Widerstandsgruppe von Studenten in München." });
  /* kleine Steine (jüdischer Brauch) */
  for (const [dx, dy] of [[6.4, -0.4], [7.6, 0.2], [-5.2, 0.6]]) k += `<ellipse cx="${r(sx + dx)}" cy="${r(sy + dy)}" rx=".7" ry=".45" fill="#8d8a84"/>`;
  unter.push({ id: "stein", de: "der kleine Stein", syl: "KLEI-ne STEIN", it: "il sassolino", itSyl: "sas-so-LI-no", en: "small stone", x: sx + 7 + 160, y: sy + 0.6 + 200, kunst: flaeche(-2, -1.4, 4, 2),
    tipp: "Nach jüdischem Brauch legt man einen kleinen Stein ab: Ich war hier und denke an dich." });
  /* unter-Positionen in Szenenkoordinaten (Ursprung des Gehwegs: 160 | 200) */
  unter.forEach((u) => { if (u.id === "rose") { u.x = rx + 2 + 160; u.y = ry + 0.4 + 200; } });
  /* Bordstein links zur Straße */
  k += `<path d="M${r(px(-0.3, D_HAUS) - 160)} ${r(yA - 200)} L${r(px(-0.3, 4.6) - 160)} 0" stroke="#d9d4ca" stroke-width="1.4"/>`;
  S.teil({ id: "gehweg", de: "der Gehweg", syl: "GEH-weg", it: "il marciapiede", itSyl: "mar-cia-PIE-de", en: "pavement", x: 160, y: 200, kunst: k,
    zoom: { x: STS.x - 30, y: py(0, STS.d) - 16, w: 54, h: 36 }, unter,
    tipp: "Stolpersteine liegen im Gehweg. Man soll beim Gehen innehalten und lesen." });
}

/* =====================================================================
   1 — DAS MAHNMAL (Stelenfeld, links die Straße entlang) — mit Lupe
   ===================================================================== */
{
  /* Feld: Spalten (seitlich) L = -7.4 … -40, Reihen (Tiefe) d = 12 … 90 */
  let k = "";
  const raster = [];
  const hoehe = (L, d) => {
    const u = Math.min(1, (-L - 4.6) / 7), t = Math.min(1, (d - 8) / 24);
    return 0.3 + 4.2 * u * (0.55 + 0.45 * t) * (0.8 + 0.2 * Math.sin(d * 0.6 + L * 0.8));
  };
  /* Boden des Feldes (Pflaster, gewellt) */
  const kx = (v) => r(Math.max(-VX, v));
  k += `<path d="M${kx(px(-4.6, 8) - VX)} ${r(py(0, 8) - VY)} L${kx(px(-4.6, 90) - VX)} ${r(py(0, 90) - VY)} L${kx(px(-60, 90) - VX)} ${r(py(0, 90) - VY)} L${-VX} ${r(py(0, 90) - VY)} L${-VX} ${r(py(0, 8) - VY)} Z" fill="#8f918f"/>`;
  /* von hinten nach vorne und von außen nach innen zeichnen */
  for (let d = 88; d >= 8; d -= 3.33) {
    for (let L = -40; L <= -4.6; L += 1.9) {
      const h = hoehe(L, d), w = 0.95, tief = 2.38;
      const xL = px(L, d), xR = px(L + w, d), yB = py(0, d), yT = py(h, d);
      const xL2 = px(L, d + tief), xR2 = px(L + w, d + tief), yT2 = py(h, d + tief);
      if (xL < 0 || xR2 < 0 || xL > X_ECKE) continue;
      /* Oberseite */
      k += `<path d="M${r(xL - VX)} ${r(yT - VY)} L${r(xR - VX)} ${r(yT - VY)} L${r(xR2 - VX)} ${r(yT2 - VY)} L${r(xL2 - VX)} ${r(yT2 - VY)} Z" fill="#b7b9b9"/>`;
      /* rechte Seitenfläche (zur Straße hin sichtbar) */
      k += `<path d="M${r(xR - VX)} ${r(yT - VY)} L${r(xR2 - VX)} ${r(yT2 - VY)} L${r(xR2 - VX)} ${r(py(0, d + tief) - VY)} L${r(xR - VX)} ${r(yB - VY)} Z" fill="#6f7273"/>`;
      /* Stirnfläche */
      k += `<rect x="${r(xL - VX)}" y="${r(yT - VY)}" width="${r(xR - xL)}" height="${r(yB - yT)}" fill="${BETON}"/>`;
      raster.push([L, d, h, xL, xR, yT, yB]);
    }
  }
  /* Dunst der Tiefe */
  k += `<path d="M${r(px(-4.6, 40) - VX)} ${r(py(5, 40) - VY)} L${r(px(-4.6, 90) - VX)} ${r(py(5, 90) - VY)} L${r(px(-4.6, 90) - VX)} ${r(py(0, 90) - VY)} L${-VX} ${r(py(0, 90) - VY)} L${-VX} ${r(py(5, 40) - VY)} Z" fill="#e6e8e6" opacity=".2"/>`;
  /* eine Stele vorne für die Lupe */
  const st = raster.filter((s) => s[1] < 16 && s[2] > 2 && s[3] > 4).sort((a, b) => a[1] - b[1] || b[3] - a[3])[0];
  const unter = [];
  if (st) unter.push({ id: "stele", de: "die Stele", syl: "STE-le", it: "la stele", itSyl: "STE-le", en: "stele", x: (st[3] + st[4]) / 2, y: st[6],
    kunst: flaeche(-(st[4] - st[3]) / 2, -(st[6] - st[5]), st[4] - st[3], st[6] - st[5]), tipp: "Eine Stele ist ein aufrechter Steinblock. Hier gibt es 2711 Stelen — jede ist anders hoch." });
  S.teil({ id: "mahnmal", de: "das Mahnmal", syl: "MAHN-mal", it: "il memoriale", itSyl: "me-mo-RIA-le", en: "memorial", x: VX, y: VY, steht: true, kunst: k,
    zoom: { x: 0, y: 64, w: 96, h: 64 }, unter,
    tipp: "Ein Feld aus Betonquadern. Man geht hinein und steht zwischen ihnen — das ist der Sinn." });
}

/* =====================================================================
   2 — DIE GEDENKSTÄTTE (Eingang zum Ort der Information)
   ===================================================================== */
{
  const d = 30, L = -4.4, s = F / d;
  let k = schatten(0, 0.3, 8, 0.8, 0.3);
  /* Treppenabgang mit Glasbrüstung und Schild */
  k += `<path d="M-7 0 L7 0 L5 -2.4 L-5 -2.4 Z" fill="#4a4d4f"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${-5 + i * 0.4}" y1="${-0.6 - i * 0.5}" x2="${5 - i * 0.4}" y2="${-0.6 - i * 0.5}" stroke="#76797b" stroke-width=".4"/>`;
  k += `<rect x="-7" y="-4.6" width="14" height="2.2" fill="#d9e6ea" opacity=".6" stroke="#9aa3aa" stroke-width=".3"/>`;
  k += `<rect x="-6" y="${r(-2.1 * s)}" width="12" height="${r(0.7 * s)}" fill="#2c2f31"/><text x="0" y="${r(-2.1 * s + 3)}" font-size="2.4" text-anchor="middle" fill="#f0f0ee" font-family="Arial,sans-serif">Ort der</text><text x="0" y="${r(-2.1 * s + 5.6)}" font-size="2.4" text-anchor="middle" fill="#f0f0ee" font-family="Arial,sans-serif">Information</text>`;
  k += `<rect x="-.5" y="${r(-1.4 * s)}" width="1" height="${r(1.4 * s - 4.6)}" fill="#2c2f31"/>`;
  S.teil({ id: "gedenkstaette", de: "die Gedenkstätte", syl: "Ge-DENK-stät-te", it: "il luogo della memoria", itSyl: "LUO-go del-la me-MO-ria", en: "memorial site", x: px(L, d) + 4, y: py(0, d), steht: true, kunst: k,
    tipp: "In Gedenkstätten wird gezeigt und erklärt, was an diesem Ort geschehen ist." });
}

/* =====================================================================
   3 — DIE SCHULKLASSE und 4 — DIE LEHRERIN (am Rand des Feldes)
   ===================================================================== */
{
  const d = 17.5, s = F / d;
  const kind = (id, g, farbe, haar, blick, frisur) => B.mensch({ id, geschlecht: g, alter: "jugendlich", pose: "stehen", blick, frisur, haarfarbe: haar, haut: g === "w" ? "hell" : "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe }, jacke: { stueck: "jacke", farbe: farbe === "grau" ? "blau" : "grau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "schwarz" } } }, 1.55 * s);
  const a = kind("gdk_k1", "w", "rot", "blond", 150, "zopf"), b = kind("gdk_k2", "m", "grau", "schwarz", 210, "kurz");
  S.teil({ id: "besucher_ns", de: "die Schulklasse", syl: "SCHUL-klas-se", it: "la classe", itSyl: "CLAS-se", en: "school class", x: px(-4.1, d), y: py(0, d),
    kunst: `<g transform="translate(-5 0)">${a.svg}</g><g transform="translate(6 .6)">${b.svg}</g>`,
    tipp: "Fast jede Schulklasse in Deutschland besucht einmal eine Gedenkstätte." });
  const m = B.mensch({ id: "gdk_lehr", geschlecht: "w", pose: "zeigen", blick: 250, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "rollkragen", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "braun" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "schal", farbe: "rot" } } }, 1.68 * F / 16);
  S.teil({ id: "lehrerin", de: "die Lehrerin", syl: "LEH-re-rin", it: "l'insegnante", itSyl: "in-se-GNAN-te", en: "teacher", x: px(-4, 13), y: py(0, 13), kunst: m.svg,
    tipp: "Die Lehrerin erklärt: „Jede Stele ist anders. Geht hinein und schaut, wie es sich anfühlt.“" });
}

/* =====================================================================
   5 — DIE LATERNE (an der Ecke)
   ===================================================================== */
{
  const d = 9, s = F / d;
  let k = schatten(0, 0.3, 4, 0.8, 0.3);
  const mast = S.lg("mast", [[0, "#3d464c"], [0.5, "#6f7a82"], [1, "#2f363b"]], 0, 0, 1, 0);
  k += `<path d="M-2.6 0 L2.6 0 L1.6 -8 L-1.6 -8 Z" fill="${mast}"/><rect x="-.9" y="${r(-4.6 * s)}" width="1.8" height="${r(4.6 * s - 8)}" fill="${mast}"/>`;
  k += `<path d="M-.9 ${r(-4.6 * s)} q0 -6 7 -6 h6" stroke="#3d464c" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M9 ${r(-4.6 * s - 7.4)} h10 l-1.6 3.4 h-6.8 Z" fill="#3d464c"/><rect x="11" y="${r(-4.6 * s - 4)}" width="6" height="1" fill="#fff6d8"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: px(-0.9, d), y: py(0, d), steht: true, kunst: k });
}

/* =====================================================================
   6 — DAS WOHNHAUS (frontal, rechts) mit 7 Haustür, 8 Fenster
   ===================================================================== */
const yH = Y_HAUS;
{
  const W = 320 - X_ECKE;
  let k = `<rect x="0" y="${r(-yH)}" width="${W}" height="${r(yH)}" fill="${S.lg("putz", [[0, "#e7e1d4"], [1, "#d5cdbd"]])}"/>`;
  /* Sockel aus Granit, Gesims über dem Erdgeschoss */
  k += `<rect x="0" y="${r(-0.6 * SH)}" width="${W}" height="${r(0.6 * SH)}" fill="${S.lg("sockel", [[0, "#8a8783"], [1, "#6f6c68"]])}"/>`;
  k += `<rect x="0" y="${r(-4.15 * SH)}" width="${W}" height="${r(0.25 * SH)}" fill="#c9c0ae"/><rect x="0" y="${r(-3.9 * SH)}" width="${W}" height="1.2" fill="#b0a690"/>`;
  /* Putzfugen im Erdgeschoss */
  for (let h = 1.1; h < 3.9; h += 0.5) k += `<line x1="0" y1="${r(-h * SH)}" x2="${W}" y2="${r(-h * SH)}" stroke="#c7bea9" stroke-width=".4"/>`;
  /* Ecke zur Straße mit Kantenlicht */
  k += `<rect x="0" y="${r(-yH)}" width="2" height="${r(yH)}" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "wohnhaus", de: "das Wohnhaus", syl: "WOHN-haus", it: "il condominio", itSyl: "con-do-MI-nio", en: "apartment building", x: X_ECKE, y: yH, kunst: k,
    tipp: "Vor diesem Haus liegen Stolpersteine: Hier wohnten Menschen, die von den Nationalsozialisten verfolgt wurden." });
}
const TUER = { x: 286, w: 1.25 * SH, h: 2.65 * SH };
{
  const w = TUER.w, h = TUER.h;
  let k = `<rect x="${r(-w / 2 - 4)}" y="${r(-h - 6)}" width="${r(w + 8)}" height="${r(h + 6)}" fill="#c9c0ae"/>`;
  k += `<path d="M${r(-w / 2)} 0 L${r(-w / 2)} ${r(-h + w / 2)} A${r(w / 2)} ${r(w / 2)} 0 0 1 ${r(w / 2)} ${r(-h + w / 2)} L${r(w / 2)} 0 Z" fill="${S.lg("tuer", [[0, "#4a3426"], [1, "#2f2017"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-w / 2 + 3)} ${r(-h + w / 2)} A${r(w / 2 - 3)} ${r(w / 2 - 3)} 0 0 1 ${r(w / 2 - 3)} ${r(-h + w / 2)} Z" fill="${S.lg("oberlicht", [[0, "#8fa3b3"], [1, "#5d7181"]])}"/>`;
  k += `<line x1="0" y1="0" x2="0" y2="${r(-h + w / 2)}" stroke="#1f150e" stroke-width=".8"/>`;
  for (const s of [-1, 1]) k += `<rect x="${r(s * w / 4 - 7)}" y="${r(-h * 0.62)}" width="14" height="${r(h * 0.3)}" rx="1" fill="none" stroke="#5a4232" stroke-width=".8"/><rect x="${r(s * w / 4 - 7)}" y="${r(-h * 0.26)}" width="14" height="${r(h * 0.18)}" rx="1" fill="none" stroke="#5a4232" stroke-width=".8"/>`;
  k += `<rect x="-5" y="${r(-h * 0.46)}" width="1.4" height="6" rx=".6" fill="#c9a24a"/><rect x="3.6" y="${r(-h * 0.46)}" width="1.4" height="6" rx=".6" fill="#c9a24a"/>`;
  /* Stufe */
  k += `<rect x="${r(-w / 2 - 6)}" y="-1.6" width="${r(w + 12)}" height="3.2" fill="#9b9893"/>`;
  S.teil({ oben: true, id: "haustuer", de: "die Haustür", syl: "HAUS-tür", it: "il portone", itSyl: "por-TO-ne", en: "front door", x: TUER.x, y: yH, kunst: k });
}
{
  /* zwei Fenster im Erdgeschoss links der Tür */
  let k = "";
  for (const x of [0]) {
    const w = 1.15 * SH * 0.8, h = 1.8 * SH * 0.8;
    k += `<rect x="${x - 3}" y="${r(-h - 3)}" width="${r(w + 6)}" height="${r(h + 6)}" fill="#cfc6b3"/>`;
    k += `<rect x="${x}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("fglas", [[0, "#7f93a3"], [1, "#4b5c6a"]])}" stroke="#f1ede4" stroke-width="1.6"/>`;
    k += `<path d="M${r(x + w / 2)} ${r(-h)} v${r(h)} M${x} ${r(-h * 0.7)} h${r(w)}" stroke="#f1ede4" stroke-width="1.1"/>`;
    k += `<path d="M${x + 2} ${r(-h * 0.1)} L${r(x + w * 0.4)} ${r(-h * 0.66)}" stroke="#fff" stroke-width="1" opacity=".22"/>`;
    k += `<rect x="${x - 4}" y="0" width="${r(w + 8)}" height="2.4" fill="#bdb4a1"/>`;
  }
  S.teil({ oben: true, id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 178, y: yH - 1.75 * SH, kunst: k });
}

/* =====================================================================
   9 — DIE GEDENKTAFEL (an der Hauswand neben der Tür)
   ===================================================================== */
{
  const w = 0.75 * SH, h = 0.55 * SH;
  let k = `<rect x="${r(-w / 2 - 1)}" y="${r(-h - 1)}" width="${r(w + 2)}" height="${r(h + 2)}" rx="1" fill="#5a5f63"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" rx=".6" fill="${S.lg("tafel", [[0, "#f6f3ea"], [1, "#e4ded0"]])}"/>`;
  k += `<text x="0" y="${r(-h + 4.4)}" font-size="3" text-anchor="middle" fill="#1e3a5f" font-family="Georgia,serif" font-weight="bold">1933 – 1945</text>`;
  k += `<line x1="${r(-w / 2 + 4)}" y1="${r(-h + 6)}" x2="${r(w / 2 - 4)}" y2="${r(-h + 6)}" stroke="#1e3a5f" stroke-width=".3"/>`;
  const zeilen = ["In diesem Haus lebten", "bis 1942 jüdische Familien.", "Sie wurden deportiert", "und ermordet.", "Wir erinnern an sie."];
  zeilen.forEach((t, i) => { k += `<text x="0" y="${r(-h + 9.4 + i * 2.6)}" font-size="1.9" text-anchor="middle" fill="#1e3a5f" font-family="Georgia,serif">${t}</text>`; });
  S.teil({ oben: true, id: "gedenktafel", de: "die Gedenktafel", syl: "Ge-DENK-ta-fel", it: "la targa commemorativa", itSyl: "TAR-ga com-me-mo-ra-TI-va", en: "memorial plaque", x: 238, y: r(yH - 1.45 * SH), kunst: k,
    tipp: "Sachliche Jahreszahlen — damit man weiß, was wann geschah." });
}

/* =====================================================================
   10 — DER KRANZ (auf einem Ständer unter der Tafel) und
   11 — DER BLUMENSTRAUSS (an die Wand gelehnt)
   ===================================================================== */
{
  const R = 0.32 * SH;
  let k = schatten(0, 0.3, 8, 1, 0.3);
  /* Dreibein-Ständer */
  k += `<path d="M-6 0 L0 ${r(-R * 2.2)} L6 0 M0 ${r(-R * 2.2)} L0 0" stroke="#3a3a3a" stroke-width=".7" fill="none"/>`;
  const cy = -R * 2.2;
  /* Kranz aus Tannengrün mit weißen Blüten */
  k += `<circle cx="0" cy="${r(cy)}" r="${r(R)}" fill="none" stroke="${S.lg("tanne", [[0, "#3f6a45"], [1, "#24432b"]])}" stroke-width="${r(R * 0.42)}"/>`;
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; k += `<path d="M${r(Math.cos(a) * R * 0.8)} ${r(cy + Math.sin(a) * R * 0.8)} l${r(Math.cos(a + 1.2) * 2.2)} ${r(Math.sin(a + 1.2) * 2.2)}" stroke="#4f7d55" stroke-width=".7"/>`; }
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + 0.2; k += `<circle cx="${r(Math.cos(a) * R)}" cy="${r(cy + Math.sin(a) * R)}" r="1.5" fill="#f7f6f0"/><circle cx="${r(Math.cos(a) * R)}" cy="${r(cy + Math.sin(a) * R)}" r=".5" fill="#e8d98a"/>`; }
  /* Schleife */
  k += `<path d="M-1.6 ${r(cy + R * 0.9)} L-4.6 ${r(cy + R * 2.1)} L-2.4 ${r(cy + R * 2)} L-.6 ${r(cy + R * 1.1)} Z M1.6 ${r(cy + R * 0.9)} L4.8 ${r(cy + R * 2.2)} L2.6 ${r(cy + R * 2.1)} L.6 ${r(cy + R * 1.1)} Z" fill="#f2f0ea" stroke="#c9c4b8" stroke-width=".3"/>`;
  k += `<rect x="-2" y="${r(cy + R * 0.7)}" width="4" height="2.4" rx=".6" fill="#f2f0ea" stroke="#c9c4b8" stroke-width=".3"/>`;
  S.teil({ id: "kranz", de: "der Kranz", syl: "KRANZ", it: "la corona di fiori", itSyl: "co-RO-na di FIO-ri", en: "wreath", x: 238, y: yH + 0.6, steht: true, kunst: k,
    tipp: "Am 9. November und am 27. Januar legen Menschen Kränze nieder." });
}
{
  let k = schatten(0, 0.2, 5, 0.7, 0.3);
  k += `<path d="M-1 0 L-3 -12 M0 0 L0 -13 M1 0 L3 -12 M.4 0 L1.6 -13" stroke="#4f7d3a" stroke-width=".55"/>`;
  k += `<path d="M-4.4 -9 L4.4 -9 L1.6 0 L-1.6 0 Z" fill="#e8e2d2" opacity=".9"/><path d="M-4.4 -9 L0 -6 L4.4 -9" stroke="#cfc6b2" stroke-width=".3" fill="none"/>`;
  for (const [x, y, c] of [[-3, -13, "#f6f5ef"], [0, -14.6, "#f2f0e8"], [3, -13.2, "#f6f5ef"], [-1.4, -11.4, "#d9c5e6"], [1.6, -11.8, "#f6f5ef"]]) k += `<circle cx="${x}" cy="${y}" r="1.7" fill="${c}"/><circle cx="${x}" cy="${y}" r=".6" fill="#e1d6a8" opacity=".7"/>`;
  S.teil({ id: "blumenstrauss", de: "der Blumenstrauß", syl: "BLU-men-strauß", it: "il mazzo di fiori", itSyl: "MAZ-zo di FIO-ri", en: "bouquet", x: 258, y: yH + 0.4, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/gedenken.js"));
console.log(aus);
