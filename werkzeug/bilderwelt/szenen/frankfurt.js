#!/usr/bin/env node
/* =====================================================================
   FRANKFURT AM MAIN (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (visitfrankfurt.travel, frankfurt.de „Römer“ und „Eiserner
   Steg“, Structurae „Eiserner Steg“, Commerzbank „Hochhaus“,
   maintower.de, Kaiserdom-Führer, Wikipedia Römer/Paulskirche):
   - STANDORT: echte Kamera am Sachsenhäuser Ufer gleich westlich der
     Alten Brücke (dort beginnt Alt-Sachsenhausen, das Apfelweinviertel),
     im Apfelweingarten auf der unteren Uferpromenade (2,2 m über dem
     Wasser); man sitzt am Tisch, Auge 3,4 m über dem Wasser, Blick nach
     Westnordwest (Peilung 294°), Brennweite 260 Einheiten (Bildwinkel 63°). Weltkoordinaten in Metern ab Mainkai/
     Saalgasse; Lagen nach Stadtplan (±30 m). Echte Peilungen von hier:
     Silberturm 270°, ONE 272°, Tower 185 274°, Messeturm 283°, Westend
     Tower 284°, Trianon 285°, Eiserner Steg 269°–293° (über den Fluss,
     360–430 m), Commerzbank-Tower 290°, Main Tower 298°, Omniturm 298°,
     FOUR 299°, Rententurm 299°, Römer 311°, Paulskirche 311°, Dom 333°.
     Der Main kommt von rechts (Osten) und biegt hinter dem Steg nach
     Südwesten ab; dort sieht man die Untermainbrücke.
     BEWUSSTE ABWEICHUNG: Die Kamera steht ≈ 120 m flussaufwärts des
     wörtlichen Punkts (CAM = [280, −66]), d. h. östlich der Alten Brücke;
     von dort läge der Dom bei ≈ 320° — er ist (wie der Römer) um ≈ 13°
     nach links gerückt, damit Römer, Dom und Skyline in einem Bild
     stehen. Die Alte Brücke, die sonst quer durchs Bild liefe, ist bewusst
     weggelassen. Das Ufer, auf dem wir sitzen, flieht 28° nach links aus
     dem Bild; deshalb sieht man von seiner oberen Ebene nur die Kronen der
     Bäume im Apfelweingarten über uns.
   - SKYLINE („Mainhattan“, Stand 2026): COMMERZBANK-TOWER (Foster 1997)
     259 m, Mast 300 m — Grundriss Dreieck mit gerundeten Ecken, neun
     viergeschossige Himmelsgärten spiralförmig an den drei Seiten; die
     Fassade läuft gerade durch, über dem Dach stehen die drei gerundeten
     Eckkerne etwas höher, dazwischen der Mast. MAIN TOWER 200 m (Antenne
     240 m): runder Glasturm vor einem eckigen dunklen Steinturm, oben
     die Aussichtsplattform (198 m). FOUR (2024/25): T1 233 m, T2 178 m,
     hell gerippt, gleich rechts neben dem Main Tower. OMNITURM 190 m mit
     dem „Hüftschwung“. MESSETURM 257 m (roter Granit, Pyramide,
     „Bleistift“). WESTEND TOWER 208 m mit der weißen Strahlenkrone,
     TRIANON 186 m mit dreieckigem Kopf, DEUTSCHE BANK „Soll und Haben“,
     OPERNTURM, TAUNUSTURM, MARIENTURM, JAPAN CENTER (Dach wie eine
     Steinlaterne), SILBERTURM, TOWER 185 und ONE (190 m, 2022) an der
     Messe. Am Horizont der Taunus mit dem Großen Feldberg.
   - EISERNER STEG (1869, Tragwerk 1911/12, wieder aufgebaut 1946):
     genietete Stahlfachwerkträger, 170 m, zwei Pfeiler, Felder 49,3 –
     82,5 – 41,8 m; über den Pfeilern am höchsten, dazwischen hängt der
     Obergurt durch; Gehweg zwischen den Trägern; Treppen und Aufzüge an
     beiden Enden (1993); Liebesschlösser am Geländer. Die Pfeilerköpfe
     zeigen flussaufwärts (nach Osten, zu uns).
   - RÖMER: Rathaus seit 1405; Schauseite mit drei TREPPENGIEBELN: links
     (Süden) Alt-Limpurg, Mitte Haus zum Römer (Kaiserbalkon, darüber
     vier Kaiserfiguren in Nischen, oben die Uhr zwischen zwei Stadt-
     wappen: weißer, gekrönter Adler auf Rot), rechts Löwenstein; dann
     Frauenstein und Salzhaus. Die Schauseite blickt nach Osten auf den
     Römerberg; von hier aus sähe man sie schräg — sie steht aber hinter
     den Häusern am Mainkai. Darum (wie die Schauseiten in Berlin und
     Dresden) frei gezeigt, 1,8-fach vergrößert und die Häuser davor
     (Saalgasse) niedriger. Paulskirche und Nikolaikirche stehen in
     Wirklichkeit fast genau hinter bzw. vor dem Römer; sie sind um 4°
     nach rechts bzw. links gerückt, damit man alle drei sieht.
   - PAULSKIRCHE: ovaler Saalbau aus rotem Sandstein (1789–1833), Turm an
     der Südseite; 1848/49 Sitz der Nationalversammlung.
   - KAISERDOM ST. BARTHOLOMÄUS: roter Mainsandstein, Westturm 95 m
     (Madern Gerthener, vollendet 1867–77): quadratischer Unterbau mit
     Eckstrebepfeilern, Maßwerkgalerie mit Fialen, Oktogon mit hohen
     zweibahnigen Fenstern unter Wimpergen, steinerne Kuppel mit Krabben
     auf den Rippen, achteckige Laterne mit Fialen und Spitze; Querhaus
     mit großem Maßwerkfenster, Schieferdächer.
   - MAINKAI: Saalhof mit RENTENTURM (1456, Zeltdach mit vier
     Ecktürmchen), Historisches Museum (Neubau 2017, zwei steile Giebel),
     Leonhardskirche (zwei achteckige Türme), Platanen, Kaimauer aus
     rotem Sandstein. Sachsenhäuser Ufer: Mauer, Straße mit parkenden
     Autos, Platanen, Gründerzeithäuser mit Mansarddächern.
   - TYPISCH: Apfelwein („Äppler“, „Ebbelwoi“) aus dem BEMBEL (graues
     Salzglasur-Steinzeug, kobaltblau bemalt) im GERIPPTEN (Rautenschliff),
     der grüne KRANZ (Fichtenkranz) zeigt den Ausschank an; GRÜNE SOSSE
     aus sieben Kräutern mit Eiern und Kartoffeln; FRANKFURTER WÜRSTCHEN
     (reines Schweinefleisch, im heißen Wasser nur erhitzt) mit Senf und
     Brot. Ausflugsschiffe, Höckerschwäne.
   Licht: 3. Oktober, 16 Uhr — Sonne im Südwesten (Azimut 232°, 22° hoch,
   links außerhalb des Bildes); Schatten fallen lang nach Nordosten.
   UNSICHER (Websuche erschöpft, aus Fachwissen): Form der Spitzen von FOUR
   und ONE, Lage der Kuppel-Krabben, Breite der Mainkai-Häuser.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "frankfurt", titel: "Frankfurt am Main", emoji: "🏙️", thema: "Deutschland", kuerzel: "ffm", fassung: 854 });
const rnd = zufall(1405);
const r = B.r;

/* ---------- Kamera (Meter: x Ost, y Nord, z Höhe über dem Wasser) ---------- */
const HOR = 96, FOC = 260, CAM = [280, -66, 3.4], BLICK = -66 * Math.PI / 180;
const FV = [Math.sin(BLICK), Math.cos(BLICK)], RV = [Math.cos(BLICK), -Math.sin(BLICK)];
const tief = (x, y) => (x - CAM[0]) * FV[0] + (y - CAM[1]) * FV[1];
const pr = (x, y, z) => { const dx = x - CAM[0], dy = y - CAM[1], f = dx * FV[0] + dy * FV[1], l = dx * RV[0] + dy * RV[1]; return [160 + FOC * l / f, HOR - FOC * (z - CAM[2]) / f]; };
const P = (p) => `${r(p[0])} ${r(p[1])}`;
const NAH = 0.4, RAHMEN = [-1, -1, 321, 201];
const tiefe3 = (p) => tief(p[0], p[1]);
const nahClip = (pts, offen) => {
  const raus = [];
  const n = pts.length, m = offen ? n - 1 : n;
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % n], fa = tiefe3(a) - NAH, fb = tiefe3(b) - NAH;
    if (fa >= 0) { if (!offen || i === 0 || raus.length === 0) raus.push(a); }
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); raus.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
    if (offen && fb >= 0) raus.push(b);
  }
  return raus;
};
const randClip = (pts) => {
  let out = pts;
  const kanten = [[(p) => p[0] >= RAHMEN[0], (a, b) => (RAHMEN[0] - a[0]) / (b[0] - a[0])], [(p) => p[0] <= RAHMEN[2], (a, b) => (RAHMEN[2] - a[0]) / (b[0] - a[0])],
    [(p) => p[1] >= RAHMEN[1], (a, b) => (RAHMEN[1] - a[1]) / (b[1] - a[1])], [(p) => p[1] <= RAHMEN[3], (a, b) => (RAHMEN[3] - a[1]) / (b[1] - a[1])]];
  for (const [innen, t] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i], b = inp[(i + 1) % inp.length];
      if (innen(a)) { out.push(a); if (!innen(b)) { const k = t(a, b); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); } }
      else if (innen(b)) { const k = t(a, b); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
    }
    if (!out.length) break;
  }
  return out;
};
const poly = (pts) => {
  const q = randClip(nahClip(pts, false).map((p) => pr(p[0], p[1], p[2])));
  if (q.length < 3) return "M0 0";
  let a = 0; for (let i = 0; i < q.length; i++) { const u = q[i], v = q[(i + 1) % q.length]; a += u[0] * v[1] - v[0] * u[1]; }
  return Math.abs(a) < 0.02 ? "M0 0" : "M" + q.map(P).join(" L") + " Z";
};
const linie = (pts) => { const q = nahClip(pts, true).map((p) => pr(p[0], p[1], p[2])); return q.length > 1 ? "M" + q.map(P).join(" L") : "M0 0"; };
const mass = (x, y) => FOC / tief(x, y);
/* Alles, was über den Bildrand hinausgeht, geometrisch abschneiden: sonst würde die
   Trefferfläche (Umriss des Teils) weit aus dem Bild ragen. */
const imRahmen = (svg0) => {
  const schutz = [];
  let svg = svg0.replace(/<g[^>]*transform="[^"]*"[^>]*>[\s\S]*?<\/g>/g, (m) => { schutz.push(m); return `@@${schutz.length - 1}@@`; });
  const X0 = -0.5, Y0 = -0.5, X1 = 320.5, Y1 = 200.5;
  const innen = ([x, y]) => x >= X0 && x <= X1 && y >= Y0 && y <= Y1;
  const strecke = (a, b) => {   /* Liang-Barsky */
    let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
    for (const [pp, qq] of [[-dx, a[0] - X0], [dx, X1 - a[0]], [-dy, a[1] - Y0], [dy, Y1 - a[1]]]) {
      if (pp === 0) { if (qq < 0) return null; continue; }
      const t = qq / pp; if (pp < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
    }
    return [[a[0] + dx * t0, a[1] + dy * t0], [a[0] + dx * t1, a[1] + dy * t1]];
  };
  const kreisPoly = (cx, cy, rx, ry) => { const q = []; for (let i = 0; i < 20; i++) { const w = i / 20 * Math.PI * 2; q.push([cx + Math.cos(w) * rx, cy + Math.sin(w) * ry]); } return q; };
  const pfad = (pts) => { const q = randClip(pts); return q.length > 2 ? "M" + q.map(P).join(" L") + " Z" : ""; };
  svg = svg.replace(/<path d="([^"]*)"([^>]*)\/>/g, (m, d, rest) => {
    if (/transform=/.test(rest)) return m;
    if (/^[MLZ0-9.\s-]+$/.test(d)) {
      let aus = "";
      for (const teil of d.split("M").filter((x) => x.trim())) {
        const zu = /Z\s*$/.test(teil), zahlen = teil.replace(/[LZ]/g, " ").trim().split(/\s+/).map(Number), pts = [];
        for (let i = 0; i + 1 < zahlen.length; i += 2) pts.push([zahlen[i], zahlen[i + 1]]);
        if (pts.every(innen)) { aus += "M" + teil; continue; }
        if (zu) { aus += pfad(pts); continue; }
        let offen = null;
        for (let i = 0; i + 1 < pts.length; i++) {
          const c = strecke(pts[i], pts[i + 1]);
          if (!c) { offen = null; continue; }
          if (!offen || Math.abs(offen[0] - c[0][0]) > 0.01 || Math.abs(offen[1] - c[0][1]) > 0.01) aus += `M${P(c[0])}`;
          aus += ` L${P(c[1])}`; offen = c[1];
        }
      }
      return aus ? `<path d="${aus}"${rest}/>` : "";
    }
    const z = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number), pts = [];
    for (let i = 0; i + 1 < z.length; i += 2) pts.push([z[i], z[i + 1]]);
    if (pts.length && pts.every((q) => q[0] < X0) || pts.every((q) => q[0] > X1) || pts.every((q) => q[1] < Y0) || pts.every((q) => q[1] > Y1)) return "";
    if (!/[a-z]/.test(d.replace(/e-?\d/g, "")) && pts.some((q) => !innen(q))) return "";
    return m;
  });
  svg = svg.replace(/<(ellipse|circle) ([^>]*)\/>/g, (m, tag, at) => {
    if (/transform=/.test(at)) return m;
    const g = (n) => { const v = at.match(new RegExp(`(?:^|\\s)${n}="([^"]*)"`)); return v ? +v[1] : 0; };
    const cx = g("cx"), cy = g("cy"), rx = tag === "circle" ? g("r") : g("rx"), ry = tag === "circle" ? g("r") : g("ry");
    if (cx - rx >= X0 && cx + rx <= X1 && cy - ry >= Y0 && cy + ry <= Y1) return m;
    if (cx + rx < X0 || cx - rx > X1 || cy + ry < Y0 || cy - ry > Y1) return "";
    const rest = at.replace(/(?:^|\s)(cx|cy|rx|ry|r)="[^"]*"/g, "");
    const d = pfad(kreisPoly(cx, cy, rx, ry));
    return d ? `<path d="${d}"${rest.startsWith(" ") ? rest : " " + rest}/>` : "";
  });
  return svg.replace(/@@(\d+)@@/g, (m, i) => schutz[+i]);
};

/* Figuren: Pfaddaten auf ganze Zahlen runden (unsichtbar klein, halbiert die Datei) */
const rundeFigurFein = (svg) => svg.replace(/<path[^>]*fill="none"[^>]*opacity="[^"]*"[^>]*\/>/g, "").replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 2) / 2))}"`);
const rundeFigur = (svg) => svg.replace(/ d="([^"]*)"/g, (m, d) => {
  let q = d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)));
  q = q.replace(/(L-?\d+ -?\d+)(?:\1)+/g, "$1");                                   /* doppelte Punkte */
  q = q.replace(/M(-?\d+) (-?\d+)Q\1 \2 \1 \2(?=M|$)/g, "");                      /* Nullstriche */
  q = q.replace(/(M-?\d+ -?\d+Q-?\d+ -?\d+ -?\d+ -?\d+)(?:\1)+/g, "$1");          /* gleiche Haarstriche */
  return ` d="${q || "M0 0"}"`;
});
/* Sonne: Azimut 232°, Höhe 22° — Richtung zur Sonne (waagrecht) und Schattenlänge */
const SONNE = [Math.sin(232 * Math.PI / 180), Math.cos(232 * Math.PI / 180)], SCHATTEN_K = 1 / Math.tan(22 * Math.PI / 180);
const SCH = (x, y, h) => [x - SONNE[0] * h * SCHATTEN_K, y - SONNE[1] * h * SCHATTEN_K];
/* Ufer (Wasserlinie) */
const SUED = [[420, -50], [300, -58], [170, -68], [0, -80], [-245, -84], [-420, -95], [-600, -170], [-750, -280], [-1000, -470], [-1600, -880], [-3000, -1800]];
const NORD = [[420, 165], [300, 150], [170, 138], [0, 118], [-229, 96], [-420, 92], [-600, 20], [-750, -90], [-1000, -300], [-1600, -700], [-3000, -1650]];
const anX = (L, x) => { for (let i = 1; i < L.length; i++) if (x >= L[i][0]) { const [a, ya] = L[i - 1], [b, yb] = L[i]; return ya + (yb - ya) * (x - a) / (b - a); } return L[L.length - 1][1]; };

{
  const leer = (svg) => svg.replace(/<path d="M0 0"[^>]*\/>/g, "");
  const teil0 = S.teil, hinten0 = S.hinten;
  S.teil = (t) => { t.kunst = leer(t.kunst); if (!t.x && !t.y) t.kunst = imRahmen(t.kunst); return teil0(t); };
  S.hinten = (svg) => hinten0(leer(svg));
}
/* Fensterraster als Muster (für ferne Häuser, spart Tausende Einzelteile) */
S.def(`<pattern id="ffm_fenster" width="1.7" height="1.9" patternUnits="userSpaceOnUse"><rect x=".45" y=".5" width=".7" height=".95" fill="#55616c"/></pattern>`);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".45"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation=".35 .15"/></filter>`);
S.def(`<filter id="${S.id("weich2")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".5"/></filter>`);
S.def(`<pattern id="ffm_vierpass" width="1.1" height="1.1" patternUnits="userSpaceOnUse"><g fill="none" stroke="#6e3529" stroke-width=".09"><circle cx=".55" cy=".33" r=".2"/><circle cx=".55" cy=".77" r=".2"/><circle cx=".33" cy=".55" r=".2"/><circle cx=".77" cy=".55" r=".2"/></g><path d="M0 0 H1.1 M0 1.1 H1.1" stroke="#6e3529" stroke-width=".08"/></pattern>`);
/* Werkstoffe: Sonne von links (Südwesten) — Südseiten hell, Ostseiten im Schatten */
const ROT_L = S.lg("rotl", [[0, "#d48a74"], [1, "#b8654f"]], 0, 0, 1, 0);       /* roter Mainsandstein, Sonnenseite */
const ROT_S = S.lg("rots", [[0, "#93503f"], [1, "#7a4034"]], 0, 0, 1, 0);       /* … Schattenseite */
const SCHIEFER = S.lg("schiefer", [[0, "#5f6a76"], [1, "#454e58"]]);
const SCHIEFER_L = S.lg("schieferl", [[0, "#808b96"], [1, "#5f6a76"]]);
const LOCH = "#2c2622";
S.def(`<pattern id="${S.id("quader")}" width="2.6" height="1.3" patternUnits="userSpaceOnUse"><rect width="2.6" height="1.3" fill="none"/><path d="M0 .65 H2.6 M0 1.3 H2.6 M.7 0 V.65 M2 .65 V1.3" stroke="#4a1f16" stroke-width=".09" opacity=".35"/><rect x=".2" y=".1" width=".5" height=".3" fill="#000" opacity=".06"/><rect x="1.6" y=".8" width=".6" height=".3" fill="#fff" opacity=".07"/></pattern>`);
const QUADER = `url(#${S.id("quader")})`;
/* Laub als Muster (unregelmäßig, mit Lichtballen und Schattenhöhlen) */
{
  const kronen = (n, w, h, r0, r1, farben, licht) => {
    let m = "";
    for (let i = 0; i < n; i++) {
      const cx = rnd() * w, cy = rnd() * h, rr = r0 + rnd() * (r1 - r0), f = farben[Math.floor(rnd() * farben.length)];
      for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) {
        if (dx && (cx + dx < -rr || cx + dx > w + rr)) continue;
        if (dy && (cy + dy < -rr || cy + dy > h + rr)) continue;
        m += `<ellipse cx="${r(cx + dx)}" cy="${r(cy + dy)}" rx="${r(rr)}" ry="${r(rr * 0.8)}" fill="${f}"/>`;
        if (licht) m += `<ellipse cx="${r(cx + dx - rr * 0.3)}" cy="${r(cy + dy - rr * 0.3)}" rx="${r(rr * 0.45)}" ry="${r(rr * 0.35)}" fill="${licht}" opacity=".4"/>`;
      }
    }
    return m;
  };
  S.def(`<pattern id="${S.id("laub")}" width="9" height="6.4" patternUnits="userSpaceOnUse"><rect width="9" height="6.4" fill="#4d6b36"/>${kronen(16, 9, 6.4, 0.7, 1.5, ["#3f5a2c", "#5a7a3e", "#6b8c45", "#4a6634", "#7a9a4c", "#8a9a44"], "#c7d88a")}</pattern>`);
  S.def(`<pattern id="${S.id("laubf")}" width="4" height="2.8" patternUnits="userSpaceOnUse"><rect width="4" height="2.8" fill="#5f7650"/>${kronen(12, 4, 2.8, 0.35, 0.7, ["#55704a", "#6d8658", "#7b9160", "#4e6644"], "#b9c99a")}</pattern>`);
}
const LAUB = `url(#${S.id("laub")})`, LAUB_F = `url(#${S.id("laubf")})`;

/* unregelmäßiger Lappen (nur M/L/Z, damit ihn der Bildrand sauber beschneiden kann) */
const lappen = (lx, ly, lr, f, n = 8) => { const p = []; for (let i = 0; i < n; i++) { const w = i / n * Math.PI * 2 + rnd() * 0.35, q = lr * (0.7 + 0.45 * rnd()); p.push(`${r(lx + Math.cos(w) * q)} ${r(ly + Math.sin(w) * q * 0.8)}`); } return `<path d="M${p.join(" L")} Z" fill="${f}"/>`; };
/* Krone einer Platane: gelappter Umriss aus Wolkenballen, Schattenhöhle unten,
   Lichtballen links (Sonne), Himmelslöcher; Stamm mit Plattenborke */
const platane = (x, fuss, s, hoch, breit, himmel = "#a9c6e0", nb = 15) => {
  let g = "";
  const st = 0.45 * s;
  /* Stamm und zwei Hauptäste */
  g += `<path d="M${r(x - st)} ${r(fuss)} C${r(x - st * 0.9)} ${r(fuss - hoch * 0.25)} ${r(x - st * 0.6)} ${r(fuss - hoch * 0.4)} ${r(x - st * 1.8)} ${r(fuss - hoch * 0.62)} L${r(x - st * 1.1)} ${r(fuss - hoch * 0.64)} C${r(x - st * 0.2)} ${r(fuss - hoch * 0.48)} ${r(x + st * 0.2)} ${r(fuss - hoch * 0.48)} ${r(x + st * 1.4)} ${r(fuss - hoch * 0.66)} L${r(x + st * 2)} ${r(fuss - hoch * 0.63)} C${r(x + st * 0.8)} ${r(fuss - hoch * 0.4)} ${r(x + st * 0.9)} ${r(fuss - hoch * 0.25)} ${r(x + st)} ${r(fuss)} Z" fill="${S.lg("rinde", [[0, "#d8d0b4"], [0.45, "#b3aa8c"], [1, "#7c7562"]], 0, 0, 1, 0)}"/>`;
  /* Plattenborke: unregelmäßige Flecken in Oliv, Creme und Grau */
  for (let i = 0; i < (nb > 10 ? 5 : 0); i++) {
    const yy = fuss - rnd() * hoch * 0.55, xx = x - st * 0.7 + rnd() * st * 1.2, w = st * (0.35 + rnd() * 0.4), h = st * (0.5 + rnd() * 0.9);
    g += `<path d="M${r(xx)} ${r(yy)} L${r(xx + w)} ${r(yy - h * 0.2)} L${r(xx + w * 0.8)} ${r(yy - h * 1.2)} L${r(xx - w * 0.1)} ${r(yy - h * 1.05)} Z" fill="${["#9d9a6a", "#e9e3cb", "#8f8c80", "#c7c09e"][Math.floor(rnd() * 4)]}" opacity=".75"/>`;
  }
  /* Krone: gelappte Laubpartien (unregelmäßige Vielecke), Schattenhöhle unten rechts, Licht von links,
     erstes Herbstgelb (3. Oktober), Himmelslöcher */
  const cx = x, cy = fuss - hoch * 0.78, R = breit / 2;
  g += lappen(cx + R * 0.05, cy + R * 0.06, R, "#3a5130", 9);
  for (let i = 0; i < Math.min(nb, 9); i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 0.62, lx = cx + Math.cos(a) * d * R, ly = cy + Math.sin(a) * d * R * 0.62, lr = R * (0.24 + rnd() * 0.16);
    const links = lx < cx + R * 0.1, herbst = rnd() < 0.2;
    g += lappen(lx, ly, lr, herbst ? "#b39a3c" : links ? "#6f8c46" : "#4e6a38");
    if (links) g += lappen(lx - lr * 0.25, ly - lr * 0.25, lr * 0.5, herbst ? "#d9bf5a" : "#a3bc66");
  }
  for (let i = 0; i < (nb > 10 ? 5 : 1); i++) { const a = rnd() * Math.PI * 2, d = 0.3 + rnd() * 0.4; g += lappen(cx + Math.cos(a) * d * R, cy + Math.sin(a) * d * R * 0.6, R * 0.06 + 0.15, himmel, 5); }
  return g;
};

/* =====================================================================
   KULISSE — Himmel, Taunus, Stadt im Dunst, Wasser hinter dem Steg,
   Untermainbrücke
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 8}" fill="${S.lg("himmel", [[0, "#4b80bd"], [0.5, "#8db4da"], [0.85, "#d2e0ea"], [1, "#efe7d6"]])}"/>`);
S.hinten(`<rect width="320" height="${HOR + 8}" fill="${S.lg("sonnenseite", [[0, "#fff1cc", 0.45], [0.35, "#fff1cc", 0], [1, "#fff1cc", 0]], 0, 0, 1, 0)}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[96, 16, 1], [196, 26, 1.15], [282, 12, 0.85], [150, 50, 0.6], [246, 52, 0.55], [40, 38, 0.7]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4.6], [-11, 1.4, 10, 3.6], [11, 1, 12, 4.2], [-3, -3.2, 9, 4.6], [6, -3.6, 7, 4]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${r(x + 2 * s)}" cy="${r(y + 3 * s)}" rx="${r(17 * s)}" ry="${r(2 * s)}" fill="#d9e2ec"/><ellipse cx="${r(x - 7 * s)}" cy="${r(y - 2 * s)}" rx="${r(6 * s)}" ry="${r(2.4 * s)}" fill="#fff7e2"/></g>`;
  }
  S.hinten(w);
}
/* Taunus: Altkönig und Großer Feldberg (mit Fernmeldeturm) im Dunst, 20 km */
{
  const kamm = [];
  for (let b = -104; b <= -20; b += 2) {
    const a = b * Math.PI / 180, d = 22000 + 4000 * Math.sin((b + 60) / 9);
    let h = 380 + 200 * Math.exp(-Math.pow((b + 49) / 10, 2)) + 260 * Math.exp(-Math.pow((b + 52) / 4, 2)) + 300 * Math.exp(-Math.pow((b + 49.6) / 3, 2)) + 120 * Math.sin(b / 7);
    if (b < -85) h -= (-85 - b) * 14;
    kamm.push(pr(CAM[0] + Math.sin(a) * d, CAM[1] + Math.cos(a) * d, h - 91));
  }
  let t = `<path d="M${kamm.map(P).join(" L")} L330 ${HOR + 1} L-10 ${HOR + 1} Z" fill="${S.lg("taunus", [[0, "#8ea4ba"], [1, "#b6c5d2"]])}" opacity=".9"/>`;
  const fb = pr(CAM[0] + Math.sin(-49.6 * Math.PI / 180) * 21600, CAM[1] + Math.cos(-49.6 * Math.PI / 180) * 21600, 790);
  t += `<line x1="${r(fb[0])}" y1="${r(fb[1] - 0.2)}" x2="${r(fb[0])}" y2="${r(fb[1] - 1.8)}" stroke="#8597a9" stroke-width=".3"/><line x1="${r(fb[0] - 0.8)}" y1="${r(fb[1])}" x2="${r(fb[0] - 0.8)}" y2="${r(fb[1] - 1)}" stroke="#8597a9" stroke-width=".2"/>`;
  S.hinten(t);
}
/* ferne Stadt (Gallus, Niederrad) flach im Dunst */
{
  let c = "";
  for (let x = 0; x < 236;) {
    const w = 3 + rnd() * 6, h = 1.5 + rnd() * 4;
    c += `<rect x="${r(x)}" y="${r(HOR - h - 0.5)}" width="${r(w + 0.3)}" height="${r(h + 1.5)}" fill="${rnd() < 0.5 ? "#a8b6c2" : "#b8c3cc"}"/>`;
    x += w;
  }
  S.hinten(`<g filter="url(#${S.id("dunst")})">${c}</g>`);
}
/* Wasser hinter dem Steg (flussabwärts) und die Untermainbrücke */
{
  const fern = [...NORD.filter(([x]) => x <= -229), ...SUED.filter(([x]) => x <= -245).reverse()].map(([x, y]) => [x, y, 0]);
  let k = `<path d="${poly(fern)}" fill="${S.lg("fernwasser", [[0, "#c6d4da"], [1, "#9fb5bf"]])}"/>`;
  /* Untermainbrücke: flaches dunkles Band mit drei Bögen, dahinter blass der Holbeinsteg */
  const ub = (t) => [-668 + 26 * t, -222 + 210 * t];
  const hb = (t) => [-800 + 20 * t, -330 + 200 * t];
  k += `<path d="${linie([[...hb(0), 9], [...hb(1), 9]])}" stroke="#c9d3d8" stroke-width=".5"/>`;
  k += `<path d="${poly([[...ub(0), 0], [...ub(1), 0], [...ub(1), 8.6], [...ub(0), 8.6]])}" fill="#5a646c"/>`;
  for (let i = 0; i < 3; i++) {
    const t0 = 0.12 + i * 0.27, t1 = t0 + 0.22;
    const pts = [];
    for (let j = 0; j <= 8; j++) { const t = t0 + (t1 - t0) * j / 8, h = 5.2 * Math.sin(Math.PI * j / 8); pts.push([...ub(t), h]); }
    k += `<path d="${poly([...pts.map(([x, y, z]) => [x, y, z]), [...ub(t1), 0], [...ub(t0), 0]])}" fill="#b3c4cc"/>`;
  }
  k += `<path d="${poly([[...ub(0), 0], [...ub(1), 0], [...ub(1), 5.2], [...ub(0), 5.2]])}" fill="none" stroke="#6d7880" stroke-width=".2"/>`;
  k += `<path d="${linie([[...ub(0), 9.4], [...ub(1), 9.4]])}" stroke="#9aa3aa" stroke-width=".35"/>`;
  S.hinten(`<g opacity=".95">${k}</g>`);
}

/* =====================================================================
   1 — DER MAIN (Wasser vom Steg bis zu uns, Spiegelungen, Wellen)
   ===================================================================== */
{
  const wasser = [...NORD.filter(([x]) => x >= -229), ...SUED.filter(([x]) => x >= -245).reverse()].map(([x, y]) => [x, y, 0]);
  const flaecheW = poly(wasser);
  let k = `<path d="${flaecheW}" fill="${S.lg("wasser", [[0, "#b7c9d0"], [0.15, "#8fa8b1"], [0.5, "#5f7f88"], [1, "#3f5d64"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${HOR}" x2="0" y2="150"`)}"/>`;
  /* Himmelsglanz: weicher Verlauf, keine Kante */
  k += `<path d="${flaecheW}" fill="${S.lg("glanz", [[0, "#eef4f6", 0.5], [0.3, "#eef4f6", 0.12], [1, "#eef4f6", 0]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${HOR + 1}" x2="0" y2="${HOR + 14}"`)}"/>`;
  /* Spiegelbilder: waagrechte Wellenstreifen in den Farben der Bauten, unten zerfasert */
  const spiegel = (x0, x1, y0, laenge, farbe, dichte = 1) => {
    const b = ["", "", ""];
    for (let y = y0; y < y0 + laenge; y += 0.75) {
      const t = (y - y0) / laenge, n = Math.max(1, Math.round((x1 - x0) / 4.5 * dichte));
      for (let i = 0; i < n; i++) {
        if (rnd() < t * 0.75) continue;
        const xa = x0 + (x1 - x0) * rnd(), w = 0.6 + rnd() * 2.6 * (1 - t * 0.5);
        b[Math.min(2, Math.floor(t * 3))] += `M${r(xa + (rnd() - 0.5) * t * 2)} ${r(y)} h${r(w)} `;
      }
    }
    return b.map((d, i) => d ? `<path d="${d}" stroke="${farbe}" stroke-width=".32" opacity="${[0.6, 0.42, 0.25][i]}"/>` : "").join("");
  };
  k += `<g>`;
  k += spiegel(127, 140, 104.6, 13, "#a9bccb") + spiegel(147, 158, 104.6, 9, "#5d86ad") + spiegel(161, 172, 104.6, 9, "#d9d6c8");
  k += spiegel(268, 300, 105.6, 16, "#a85a4a") + spiegel(286, 296, 105.6, 20, "#9a4d3e", 0.6);
  k += spiegel(152, 320, 104.8, 4, "#e2d6c2", 1.4) + spiegel(56, 145, 103.2, 2.4, "#2f3a44", 1.2);
  k += `</g>`;
  /* rechts dunkleres Wasser (Gegenseite zur Sonne), links die Glitzerbahn der tiefen Sonne */
  k += `<path d="${flaecheW}" fill="${S.lg("wasserdunkel", [[0, "#1c3036", 0], [0.45, "#1c3036", 0], [1, "#1c3036", 0.3]], 0, 0, 1, 0, ` gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="320" y2="0"`)}"/>`;
  {
    let gl = "", gl2 = "";
    for (let i = 0; i < 170; i++) {
      const t = Math.pow(rnd(), 1.6), y = 99.5 + t * 30 + rnd() * 2, mitte = 95 - t * 70 + (rnd() - 0.5) * (30 + t * 90), w = 0.3 + t * 2.2 * rnd();
      if (mitte < 30 || mitte > 300) continue;
      const seg = `M${r(mitte)} ${r(y)} h${r(w)} `;
      if (rnd() < 0.55) gl += seg; else gl2 += seg;
    }
    k += `<path d="${gl}" stroke="#fffbe8" stroke-width=".22" opacity=".85"/><path d="${gl2}" stroke="#ffffff" stroke-width=".14" opacity=".55"/>`;
    let dk = "";
    for (let i = 0; i < 60; i++) { const t = Math.pow(rnd(), 1.3), y = 103 + t * 34, x = 160 + rnd() * 160, w = 0.8 + t * 5 * rnd(); dk += `M${r(x)} ${r(y)} h${r(w)} `; }
    k += `<path d="${dk}" stroke="#1d323a" stroke-width=".22" opacity=".35"/>`;
  }
  /* Schatten der Kaimauer gegenüber und des Stegs auf dem Wasser (Sonne von links) */
  k += `<path d="${poly(NORD.filter(([x]) => x >= -229).map(([x, y]) => [x, y - 0.1, 0]).concat(NORD.filter(([x]) => x >= -229).reverse().map(([x, y]) => [x + 4, y - 7, 0])))}" fill="#1f343a" opacity=".22"/>`;
  S.teil({ id: "main", de: "der Main", syl: "MAIN", it: "il Meno", itSyl: "ME-no", en: "River Main", x: 0, y: 0, kunst: `<g clip-path="url(#${S.id("wclip")})">${k}</g>`,
    tipp: "Der Main fließt mitten durch Frankfurt und mündet bei Mainz in den Rhein." });
  S.def(`<clipPath id="${S.id("wclip")}"><path d="${flaecheW}"/></clipPath>`);
}

/* ---------- Turm-Hilfen für die Skyline: Grundriss als Vieleck, sichtbare Seiten ---------- */
const turmSeiten = (ecken, z0, z1, farbeL, farbeS, fn) => {
  /* ecken: [[x,y]…] gegen den Uhrzeigersinn; zeichnet die zur Kamera gewandten Seiten,
     fn(seite, t, z) → Bildpunkt auf der Seite für Details */
  let g = "";
  const n = ecken.length, seiten = [];
  for (let i = 0; i < n; i++) {
    const a = ecken[i], b = ecken[(i + 1) % n], nx = b[1] - a[1], ny = -(b[0] - a[0]);
    const zuCam = (CAM[0] - (a[0] + b[0]) / 2) * nx + (CAM[1] - (a[1] + b[1]) / 2) * ny;
    if (zuCam <= 0) continue;
    const len = Math.hypot(nx, ny), sonne = (nx * SONNE[0] + ny * SONNE[1]) / len;
    seiten.push({ a, b, sonne });
    g += `<path d="${poly([[...a, z0], [...b, z0], [...b, z1], [...a, z1]])}" fill="${sonne > 0.1 ? farbeL : farbeS}"/>`;
    if (fn) g += fn({ a, b, sonne, at: (t, z) => pr(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z) });
  }
  return g;
};
const rechteck = (cx, cy, w, d, dreh = 0) => {
  const c = Math.cos(dreh), s = Math.sin(dreh);
  return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c]);
};
const geschossLinien = (seite, z0, z1, schritt, farbe, dicke = 0.12, op = 0.5) => {
  let g = "";
  for (let z = z0; z < z1; z += schritt) g += `M${P(seite.at(0, z))} L${P(seite.at(1, z))} `;
  return g ? `<path d="${g}" stroke="${farbe}" stroke-width="${dicke}" opacity="${op}"/>` : "";
};
const glas = (name, hell) => S.lg(name, hell ? [[0, "#d4e3ec"], [0.5, "#a6c0d2"], [1, "#86a4bb"]] : [[0, "#8aa3b6"], [0.5, "#6c879d"], [1, "#58718a"]], 0, 0, 0, 1);

/* =====================================================================
   2 — DER MESSETURM (ganz hinten, 2,4 km)
   ===================================================================== */
{
  const X0 = -2290, Y0 = 470, G = 12;
  let k = "";
  const GRANIT_L = S.lg("granitl", [[0, "#cf9282"], [1, "#b37264"]]), GRANIT_S = S.lg("granits", [[0, "#9c6157"], [1, "#84524a"]]);
  k += turmSeiten(rechteck(X0, Y0, 41, 41), G, G + 200, GRANIT_L, GRANIT_S, (s) => {
    let g = "";
    for (const t of [0.2, 0.4, 0.6, 0.8]) g += `<path d="M${P(s.at(t, G + 4))} L${P(s.at(t, G + 198))}" stroke="#3e3e4a" stroke-width=".55" opacity=".75"/>`;
    return g;
  });
  /* Zylinder und Pyramide */
  const zyl = rechteck(X0, Y0, 34, 34);
  k += turmSeiten(zyl, G + 200, G + 222, GRANIT_L, GRANIT_S, (s) => `<path d="M${P(s.at(0.5, G + 202))} L${P(s.at(0.5, G + 220))}" stroke="#3e3e4a" stroke-width=".4"/>`);
  const spitze = pr(X0, Y0, G + 257), basis = zyl.map(([x, y]) => pr(x, y, G + 222));
  k += `<path d="M${P(basis[0])} L${P(spitze)} L${P(basis[1])} Z" fill="#c9cfd4"/><path d="M${P(basis[1])} L${P(spitze)} L${P(basis[2])} Z" fill="#8f979e"/><path d="M${P(basis[3])} L${P(spitze)} L${P(basis[0])} Z" fill="#dfe3e6"/>`;
  k += `<path d="${poly([...rechteck(X0, Y0, 41, 41).map(([x, y]) => [x, y, G]), ...[]])}" fill="none"/>`;
  S.teil({ id: "messeturm", de: "der Messeturm", syl: "MES-se-turm", it: "la Torre della Fiera", itSyl: "TOR-re del-la FIE-ra", en: "Trade Fair Tower", x: 0, y: 0,
    kunst: `<g opacity=".92">${k}</g>`, tipp: "Wegen seiner spitzen Pyramide nennen ihn die Frankfurter „Bleistift“." });
}

/* =====================================================================
   3 — DIE SKYLINE (die übrigen Hochhäuser, von hinten nach vorn)
   ===================================================================== */
{
  let k = "";
  const dunst = (tiefe) => Math.min(0.32, tiefe / 7000);
  const turm = (cx, cy, w, d, z0, h, hell, dunkel, fenster, dreh = 0, extra) => {
    let g = turmSeiten(rechteck(cx, cy, w, d, dreh), z0, z0 + h, hell, dunkel, (s) => (fenster ? geschossLinien(s, z0 + 4, z0 + h - 2, fenster * 2.2, "#34424f", 0.12, 0.45) : "") + (extra ? extra(s) : ""));
    return g;
  };
  /* Kopf mit schräg angeschnittenem Dach: Höhen je Ecke */
  const schiefKopf = (ecken, z0, hz, fL, fS) => {
    let g = "";
    for (let i = 0; i < ecken.length; i++) {
      const a = ecken[i], b = ecken[(i + 1) % ecken.length], nx = b[1] - a[1], ny = -(b[0] - a[0]);
      if ((CAM[0] - (a[0] + b[0]) / 2) * nx + (CAM[1] - (a[1] + b[1]) / 2) * ny <= 0) continue;
      const son = (nx * SONNE[0] + ny * SONNE[1]) / Math.hypot(nx, ny);
      g += `<path d="${poly([[...a, z0], [...b, z0], [...b, hz[(i + 1) % ecken.length]], [...a, hz[i]]])}" fill="${son > 0.1 ? fL : fS}"/>`;
    }
    return g + `<path d="${poly(ecken.map((e, i) => [...e, hz[i]]))}" fill="#cfdbe4"/>`;
  };
  /* ONE (190 m, Messe): Glas, senkrechte Fuge, schräg angeschnittener Kopf */
  k += turm(-2109, 11, 40, 30, 12, 172, glas("onel", 1), glas("ones", 0), 3.6, 0.3, (s) => `<path d="M${P(s.at(0.55, 12))} L${P(s.at(0.55, 184))}" stroke="#41566b" stroke-width=".6"/>`);
  k += schiefKopf(rechteck(-2109, 11, 40, 30, 0.3), 184, [184, 202, 202, 184], glas("onel2", 1), glas("ones2", 0));
  /* Tower 185 (200 m): heller Stein mit Glasbändern, breiter Sockelbau, gespaltener Kopf */
  k += turm(-1838, 67, 36, 30, 12, 182, S.lg("t185l", [[0, "#efe8da"], [1, "#d6cdbb"]]), S.lg("t185s", [[0, "#b9b0a0"], [1, "#a39b8c"]]), 3.4);
  for (const [dx, hh] of [[-10, 18], [10, 12]]) k += turm(-1838 + dx, 67, 14, 30, 194, hh, "#f4efe4", "#b9b0a0", 0);
  k += turm(-1838, 40, 70, 30, 12, 50, S.lg("t185f", [[0, "#e4dccb"], [1, "#d0c6b4"]]), "#a59d8e", 4);
  /* Silberturm (166 m): Aluminiumbänder, abgeschrägte und eingekerbte Ecken */
  {
    const c0 = [-1344, -44], ec = [[-18, -10], [-10, -18], [10, -18], [18, -10], [18, 10], [10, 18], [-10, 18], [-18, 10]];
    const e = ec.map(([u, v]) => { const a = 0.45, cs = Math.cos(a), sn = Math.sin(a); return [c0[0] + u * cs - v * sn, c0[1] + u * sn + v * cs]; });
    k += turmSeiten(e, 10, 176, S.lg("silberl", [[0, "#eef1f4"], [1, "#c8cfd6"]]), S.lg("silbers", [[0, "#a3abb3"], [1, "#8c949c"]]), (s) => geschossLinien(s, 12, 175, 2.6, "#6c757e", 0.2, 0.6));
  }
  /* Westend Tower (208 m) mit der weißen Strahlenkrone */
  {
    const cx = -1682, cy = 430;
    k += turm(cx, cy, 38, 38, 12, 200, S.lg("westl", [[0, "#e6e2d8"], [1, "#c9c6bd"]]), S.lg("wests", [[0, "#a7a69f"], [1, "#8f8f8a"]]), 3.4);
    const ring = [];
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; ring.push([cx + Math.cos(a) * 24, cy + Math.sin(a) * 24]); }
    for (const [x, y] of ring) { const p0 = pr(cx + (x - cx) * 0.75, cy + (y - cy) * 0.75, 212), p1 = pr(x, y, 226); if (tief(x, y) < tief(cx, cy) + 8) k += `<path d="M${P(p0)} L${P(p1)}" stroke="#fbfbf7" stroke-width=".45"/>`; }
    k += `<path d="${linie([...ring.map(([x, y]) => [cx + (x - cx) * 0.8, cy + (y - cy) * 0.8, 212]), [cx + 19.2, cy, 212]])}" stroke="#f4f4ef" stroke-width=".6" fill="none"/>`;
  }
  /* Trianon (186 m): dreieckiger Kopf */
  {
    const cx = -1409, cy = 409;
    k += turmSeiten([[cx - 22, cy - 15], [cx + 22, cy - 15], [cx, cy + 22]], 11, 172, S.lg("trianl", [[0, "#ead0c0"], [1, "#d1b3a5"]]), S.lg("trians", [[0, "#a88f86"], [1, "#917b74"]]), (s) => geschossLinien(s, 14, 170, 3.4, "#5e4f4c", 0.12, 0.4));
    k += turmSeiten([[cx - 27, cy - 18], [cx + 27, cy - 18], [cx, cy + 27]], 172, 197, "#5f6c79", "#47525d");
    k += turmSeiten([[cx - 27, cy - 18], [cx + 27, cy - 18], [cx, cy + 27]], 197, 199, "#ecebe6", "#c9c8c2");
  }
  /* Deutsche Bank „Soll und Haben“: zwei Spiegelglastürme mit schrägen Köpfen */
  for (const [cx, cy] of [[-1086, 834], [-1046, 869]]) {
    k += turmSeiten([[cx - 15, cy - 12], [cx + 15, cy - 12], [cx + 15, cy + 12], [cx - 15, cy + 12]], 11, 158, S.lg("dbl", [[0, "#bcd2e4"], [1, "#7fa2c2"]]), S.lg("dbs", [[0, "#5f83a6"], [1, "#4b6c8f"]]), (s) => geschossLinien(s, 14, 156, 3.6, "#2c4560", 0.12, 0.5));
    const a = pr(cx - 15, cy - 12, 158), b = pr(cx + 15, cy - 12, 158), c = pr(cx + 15, cy + 12, 158), t = pr(cx - 15, cy - 12, 166);
    k += `<path d="M${P(a)} L${P(t)} L${P(c)} L${P(b)} Z" fill="#9dbcd6"/>`;
  }
  /* Opernturm (170 m): heller Naturstein, regelmäßiges Raster */
  k += turm(-930, 834, 44, 30, 12, 170, S.lg("operl", [[0, "#f1eadb"], [1, "#d9d0be"]]), S.lg("opers", [[0, "#b1a895"], [1, "#9a917f"]]), 3.4, 0.1,
    (s) => { let g = ""; for (const t of [0.2, 0.4, 0.6, 0.8]) g += `<path d="M${P(s.at(t, 14))} L${P(s.at(t, 180))}" stroke="#9a907e" stroke-width=".2" opacity=".6"/>`; return g; });
  /* Marienturm (155 m), Taunusturm (170 m), Japan Center (115 m, Laternendach) */
  k += turm(-1087, 489, 34, 26, 10, 155, S.lg("marienl", [[0, "#9fb4c6"], [1, "#7d95ab"]]), S.lg("mariens", [[0, "#5f7488"], [1, "#4e6276"]]), 3.4, 0.2);
  k += turm(-987, 423, 36, 30, 10, 170, S.lg("taunl", [[0, "#ddd6c6"], [1, "#c2b9a6"]]), S.lg("tauns", [[0, "#a49b88"], [1, "#8d8573"]]), 3.4, -0.1);
  {
    const cx = -880, cy = 356;
    k += turm(cx, cy, 30, 30, 10, 108, S.lg("japl", [[0, "#d7c3a7"], [1, "#bfa98b"]]), S.lg("japs", [[0, "#9a8670"], [1, "#84725e"]]), 3.4, 0.785);
    k += turmSeiten(rechteck(cx, cy, 42, 42, 0.785), 118, 121, "#4f5a63", "#3e474f");
    k += turmSeiten(rechteck(cx, cy, 18, 18, 0.785), 108, 118, "#c9b79c", "#8f7f6a");
  }
  /* Omniturm (190 m) mit dem „Hüftschwung“ in der Mitte */
  {
    const cx = -769, cy = 565;
    const band = (z0, z1, dx) => turmSeiten(rechteck(cx + dx, cy, 40, 30, 0), z0, z1, S.lg("omnil" + dx, [[0, "#c8dcea"], [1, "#94b4cb"]]), S.lg("omnis" + dx, [[0, "#6f8ea6"], [1, "#5b7890"]]),
      (s) => geschossLinien(s, z0 + 0.4, z1, 3.4, "#f4f7f9", 0.35, 0.95));
    k += band(10, 90, 0) + band(90, 125, 9) + band(125, 200, 0);
  }
  /* FOUR (2024/25): T2 178 m und T1 233 m, hell gerippt, gestufte Köpfe */
  {
    const rippen = (s) => { let g = ""; for (let t = 0.08; t < 1; t += 0.12) g += `<path d="M${P(s.at(t, 12))} L${P(s.at(t, 228))}" stroke="#f7f3ea" stroke-width=".38" opacity=".9"/>`; return g; };
    k += turmSeiten(rechteck(-660, 428, 30, 28, 0.1), 10, 182, S.lg("f2l", [[0, "#e9e4da"], [1, "#cfc8bb"]]), S.lg("f2s", [[0, "#a8a296"], [1, "#938d82"]]), rippen);
    k += turmSeiten(rechteck(-660, 428, 24, 22, 0.1), 182, 188, "#dcd6ca", "#a39c8f", rippen);
    k += turmSeiten(rechteck(-700, 410, 32, 28, 0.1), 10, 226, S.lg("f1l", [[0, "#efe9de"], [1, "#d5cdbf"]]), S.lg("f1s", [[0, "#aca597"], [1, "#958e81"]]), rippen);
    k += turmSeiten(rechteck(-700, 410, 26, 22, 0.1), 226, 236, "#e6e0d4", "#aaa396", rippen);
    k += turmSeiten(rechteck(-700, 410, 20, 16, 0.1), 236, 243, "#ece6da", "#b2ab9e", rippen);
  }
  /* Dunst der Entfernung über allem */
  k = `<g>${k}</g>`;
  S.teil({ id: "skyline", de: "die Skyline", syl: "SKY-line", it: "lo skyline", itSyl: "SKY-line", en: "skyline", x: 0, y: 0, kunst: k,
    tipp: "Wegen der vielen Hochhäuser am Main nennt man Frankfurt auch „Mainhattan“." });
}

/* =====================================================================
   4 — DER MAIN TOWER (runder Glasturm vor eckigem Steinturm)
   ===================================================================== */
{
  const cx = -955, cy = 470, G = 10;
  let k = "";
  /* eckiger Steinturm hinten (170 m) */
  k += turmSeiten(rechteck(cx - 12, cy + 18, 30, 30, 0.2), G, G + 172, S.lg("mtsl", [[0, "#6f747a"], [1, "#5a5f65"]]), S.lg("mtss", [[0, "#45494e"], [1, "#383c40"]]),
    (s) => { let g = ""; for (let z = G + 4; z < G + 170; z += 7) g += `<path d="M${P(s.at(0.08, z))} L${P(s.at(0.92, z))}" stroke="#a9bccb" stroke-width=".3" stroke-dasharray=".5 .6" opacity=".6"/>`; return g; });
  /* runder Glasturm: Zylinder, 16-eckig angenähert */
  const R = 17, ring = (z) => { const p = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; p.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); } return p; };
  const pts = ring(0);
  /* sichtbarer Umriss: links und rechts die Tangentenpunkte */
  let lmin = 1e9, lmax = -1e9, pa = null, pb = null;
  for (const [x, y] of pts) { const p = pr(x, y, G); if (p[0] < lmin) { lmin = p[0]; pa = [x, y]; } if (p[0] > lmax) { lmax = p[0]; pb = [x, y]; } }
  const a0 = pr(...pa, G), a1 = pr(...pa, G + 200), b0 = pr(...pb, G), b1 = pr(...pb, G + 200);
  k += `<path d="M${P(a0)} L${P(a1)} L${P(b1)} L${P(b0)} Z" fill="${S.lg("mtglas", [[0, "#dbe9f2"], [0.25, "#a9c7dd"], [0.6, "#6e95b6"], [1, "#46698a"]], 0, 0, 1, 0)}"/>`;
  for (let z = G + 4; z < G + 199; z += 5.2) { const l = pr(...pa, z), m = pr(cx, cy - R * 0.9, z), rr = pr(...pb, z); k += `<path d="M${P(l)} Q${P(m)} ${P(rr)}" stroke="#2f4a63" stroke-width=".12" fill="none" opacity=".5"/>`; }
  k += `<path d="M${P(pr(cx - R * 0.55, cy - R * 0.83, G))} L${P(pr(cx - R * 0.55, cy - R * 0.83, G + 199))}" stroke="#fff" stroke-width=".7" opacity=".4"/>`;
  /* Plattform mit Brüstung, Technik, Antenne rot-weiß */
  const pl0 = pr(...pa, G + 200), pl1 = pr(...pb, G + 200), s = mass(cx, cy);
  k += `<rect x="${r(pl0[0] - 0.5)}" y="${r(pl0[1] - 1.1)}" width="${r(pl1[0] - pl0[0] + 1)}" height="1.1" rx=".3" fill="#e6eaee"/>`;
  k += `<path d="M${r(pl0[0] - 0.4)} ${r(pl0[1] - 2.1)} H${r(pl1[0] + 0.4)}" stroke="#9aa3aa" stroke-width=".2"/>`;
  for (let i = 0; i <= 6; i++) k += `<path d="M${r(pl0[0] - 0.4 + i * (pl1[0] - pl0[0] + 0.8) / 6)} ${r(pl0[1] - 1.1)} v-1" stroke="#9aa3aa" stroke-width=".15"/>`;
  const am = pr(cx, cy, G + 200);
  k += `<rect x="${r(am[0] - 1.8)}" y="${r(am[1] - 3.6)}" width="3.6" height="2.5" fill="#c4cbd1"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(am[0] - 0.45)}" y="${r(am[1] - 3.6 - (i + 1) * 0.95)}" width=".9" height=".95" fill="${i % 2 ? "#f2f2f0" : "#c9302c"}"/>`;
  /* Helaba-Rot am Steinturm */
  const hl = pr(cx - 2, cy + 3, G + 165);
  k += `<rect x="${r(hl[0])}" y="${r(hl[1])}" width="1.6" height=".8" fill="#c9302c"/>`;
  S.teil({ id: "maintower", de: "der Main Tower", syl: "MAIN TOW-er", it: "il Main Tower", itSyl: "MAIN TOW-er", en: "Main Tower", x: 0, y: 0, kunst: k,
    tipp: "Auf den Main Tower fährt man mit dem Aufzug zur Aussichtsplattform – fast 200 Meter hoch." });
}

/* =====================================================================
   5 — DAS HOCHHAUS (Commerzbank-Tower: Dreieck, Himmelsgärten, Mast)
   ===================================================================== */
const CB = { x: -744, y: 256, G: 10 };
const CBM = {};
{
  const { x: cx, y: cy, G } = CB;
  let k = "";
  /* gleichseitiges Dreieck (Seite 60 m) mit gerundeten Ecken: Ecke nach Süden */
  const ecke = (a) => [cx + Math.sin(a) * 34, cy + Math.cos(a) * 34];
  const E = [ecke(Math.PI * 1.0 + 0.35), ecke(Math.PI * 1.0 + 0.35 + 2.094), ecke(Math.PI * 1.0 + 0.35 + 4.189)];
  const gaerten = { 0: [7, 19, 31], 1: [11, 23, 35], 2: [15, 27, 39] };
  let seitenNr = 0;
  const H = 259;
  k += turmSeiten([E[0], E[1], E[2]], G, G + H, S.lg("cbl", [[0, "#e2ecf2"], [0.6, "#bfd2de"], [1, "#a3b9c8"]]), S.lg("cbs", [[0, "#9fb4c3"], [0.5, "#869cad"], [1, "#6e8597"]]), (s) => {
    let g = geschossLinien(s, G + 3, G + H, 4.6, "#4a5e70", 0.1, 0.5);
    for (const t of [0.12, 0.3, 0.5, 0.7, 0.88]) g += `<path d="M${P(s.at(t, G))} L${P(s.at(t, G + H))}" stroke="#5c7184" stroke-width=".14" opacity=".45"/>`;
    /* Himmelsgärten: je vier Geschosse, Bäume hinter Glas */
    const nr = seitenNr++ % 3;
    for (const f of gaerten[nr]) {
      const z0 = G + f * 4.6, z1 = z0 + 4 * 4.6;
      g += `<path d="M${P(s.at(0.08, z0))} L${P(s.at(0.92, z0))} L${P(s.at(0.92, z1))} L${P(s.at(0.08, z1))} Z" fill="${S.lg("garten", [[0, "#5d7a6a"], [1, "#3f5a4c"]])}"/>`;
      for (let i = 0; i < 7; i++) {
        const p = s.at(0.14 + i * 0.12, z0 + 3 + rnd() * 5), q = s.at(0.14 + i * 0.12, z0 + 0.2), rx = 0.55 + rnd() * 0.35, ry = 0.6 + rnd() * 0.45;
        g += `<path d="M${P(q)} L${r(p[0])} ${r(p[1])}" stroke="#4a3a2a" stroke-width=".18"/><ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(rx)}" ry="${r(ry)}" fill="#3f6638"/><ellipse cx="${r(p[0] - rx * 0.25)}" cy="${r(p[1] - ry * 0.25)}" rx="${r(rx * 0.6)}" ry="${r(ry * 0.55)}" fill="${rnd() < 0.3 ? "#b9a648" : "#86a95e"}"/>`;
      }
      g += `<path d="M${P(s.at(0.08, z0))} L${P(s.at(0.92, z0))} L${P(s.at(0.92, z1))} L${P(s.at(0.08, z1))} Z" fill="${S.lg("reflex", [[0, "#ffffff", 0.32], [0.35, "#ffffff", 0.04], [0.6, "#ffffff", 0.18], [1, "#ffffff", 0]], 0, 0, 1, 1)}"/>`;
      g += `<path d="M${P(s.at(0.08, z1))} L${P(s.at(0.92, z1))}" stroke="#e6eef2" stroke-width=".3" opacity=".7"/>`;
      if ((!CBM.garten || CBM.gf < 15) && f >= 15 && f <= 31) { CBM.garten = s.at(0.5, z0); CBM.gf = f; }
    }
    return g;
  });
  /* gerundete Ecken als Lichtkante */
  for (const e of E) { const p0 = pr(...e, G), p1 = pr(...e, G + H + 6); if (tief(...e) < tief(cx, cy) + 5) k += `<path d="M${P(p0)} L${P(p1)}" stroke="#f2f7fa" stroke-width=".8" opacity=".55"/>`; }
  /* über dem Dach: die drei gerundeten Eckkerne etwas höher, dazwischen der Mast */
  for (const e of E) {
    const k0 = [cx + (e[0] - cx) * 0.9, cy + (e[1] - cy) * 0.9];
    const kern = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; kern.push([k0[0] + Math.cos(a) * 5, k0[1] + Math.sin(a) * 5]); }
    k += turmSeiten(kern, G + 30, G + H + 7, "#e3ecf1", "#a9bccb");
    const t = pr(...k0, G + H + 7); k += `<ellipse cx="${r(t[0])}" cy="${r(t[1])}" rx="${r(5 * mass(...k0))}" ry=".25" fill="#c9d6de"/>`;
  }
  k += `<path d="${poly([[...E[0], G + H], [...E[1], G + H], [...E[2], G + H]])}" fill="#b9c9d4"/>`;
  const m0 = pr(cx, cy, G + H), m1 = pr(cx, cy, G + 300);
  k += `<path d="M${r(m0[0] - 0.5)} ${r(m0[1])} L${r(m1[0] - 0.12)} ${r(m1[1])} L${r(m1[0] + 0.12)} ${r(m1[1])} L${r(m0[0] + 0.5)} ${r(m0[1])} Z" fill="#eef2f4"/>`;
  k += `<circle cx="${r(m1[0])}" cy="${r(m1[1] - 0.3)}" r=".35" fill="#e0312c"/>`;
  /* gelbes Firmenband oben an der Sonnenseite */
  const lb = pr(...E[0].map((v, i) => v * 0.6 + [cx, cy][i] * 0.4), G + H - 12);
  k += `<path d="M${r(lb[0] - 2.2)} ${r(lb[1])} q2 -1.4 4.2 0 l-.4 1 q-1.7 -1 -3.4 0 Z" fill="#f2c200"/>`;
  CBM.top = m1;
  S.teil({ id: "hochhaus", de: "das Hochhaus", syl: "HOCH-haus", it: "il grattacielo", itSyl: "grat-ta-CIE-lo", en: "high-rise", x: 0, y: 0, kunst: k,
    tipp: "Der Commerzbank-Tower ist 259 Meter hoch, mit Antenne 300 Meter – das höchste Hochhaus Deutschlands.",
    zoom: { x: r(CBM.garten[0] - 18), y: r(CBM.garten[1] - 14), w: 36, h: 24 },
    unter: [
      { id: "garten", de: "der Garten", syl: "GAR-ten", it: "il giardino", itSyl: "giar-DI-no", en: "garden",
        x: CBM.garten[0], y: CBM.garten[1], kunst: flaeche(-5, -4.2, 10, 4.6, 0.4), tipp: "Im Hochhaus gibt es neun Gärten, hoch über der Stadt." },
    ] });
}

/* =====================================================================
   6 — DIE PAULSKIRCHE (ovaler Saalbau, Turm an der Südseite)
   ===================================================================== */
const PK = { x: -262, y: 379, G: 8 };
{
  const { x: cx, y: cy, G } = PK;
  let k = "";
  /* Oval: 24 Seiten, Wand 22 m, flache Kuppel bis 34 m, Laterne */
  const ov = (z, s = 1) => { const p = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; p.push([cx + Math.cos(a) * 22 * s, cy + Math.sin(a) * 27 * s]); } return p; };
  k += turmSeiten(ov(0), G, G + 22, ROT_L, ROT_S, (s) => {
    const p0 = s.at(0.3, G + 6), p1 = s.at(0.7, G + 6), q = s.at(0.5, G + 18);
    return s.sonne > -0.3 ? `<path d="M${P(p0)} L${P(s.at(0.3, G + 15))} Q${P(s.at(0.5, G + 18.5))} ${P(s.at(0.7, G + 15))} L${P(p1)} Z" fill="${LOCH}" opacity=".8"/>` : "";
  });
  const rand = ov(0).map(([x, y]) => pr(x, y, G + 22));
  let lmin = 1e9, lmax = -1e9, li = 0, ri = 0;
  rand.forEach((p, i) => { if (p[0] < lmin) { lmin = p[0]; li = i; } if (p[0] > lmax) { lmax = p[0]; ri = i; } });
  const top = pr(cx, cy, G + 34);
  k += `<path d="M${P(rand[li])} Q${r(rand[li][0] + 1)} ${r(top[1] + 1)} ${r(top[0])} ${r(top[1])} Q${r(rand[ri][0] - 1)} ${r(top[1] + 1)} ${P(rand[ri])} Z" fill="${S.lg("pkdach", [[0, "#7f8c90"], [0.5, "#5e6c72"], [1, "#46535a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${P(rand[li])} L${P(rand[ri])}" stroke="#d8a493" stroke-width=".5"/>`;
  const lat = pr(cx, cy, G + 38);
  k += `<rect x="${r(lat[0] - 1)}" y="${r(lat[1])}" width="2" height="${r(top[1] - lat[1] + 0.3)}" fill="#cfd4d6"/><path d="M${r(lat[0] - 1.2)} ${r(lat[1])} Q${r(lat[0])} ${r(lat[1] - 1.6)} ${r(lat[0] + 1.2)} ${r(lat[1])} Z" fill="#5e6c72"/>`;
  /* Turm vor dem Oval: Unterbau, Uhrgeschoss, offene Glockenstube, Haube */
  const T = rechteck(cx, cy - 31, 10, 10);
  k += turmSeiten(T, G, G + 40, ROT_L, ROT_S, (s) => s.sonne > 0.1 ? `<path d="M${P(s.at(0.38, G + 22))} L${P(s.at(0.38, G + 31))} L${P(s.at(0.62, G + 31))} L${P(s.at(0.62, G + 22))} Z" fill="${LOCH}"/>` : "");
  const uhr = pr(cx - 2, cy - 36.1, G + 36), us = mass(cx, cy);
  k += `<circle cx="${r(uhr[0])}" cy="${r(uhr[1])}" r="${r(2.6 * us)}" fill="#f4efe6" stroke="#5a3a2c" stroke-width=".2"/><path d="M${r(uhr[0])} ${r(uhr[1])} v${r(-1.8 * us)} M${r(uhr[0])} ${r(uhr[1])} l${r(1.2 * us)} ${r(0.5 * us)}" stroke="#222" stroke-width=".2"/>`;
  k += turmSeiten(rechteck(cx, cy - 31, 11, 11), G + 40, G + 41.5, "#e2b4a2", "#b98a7a");
  k += turmSeiten(rechteck(cx, cy - 31, 8.4, 8.4), G + 41.5, G + 50, ROT_L, ROT_S, (s) => `<path d="M${P(s.at(0.25, G + 42.5))} L${P(s.at(0.25, G + 48))} L${P(s.at(0.45, G + 48))} L${P(s.at(0.45, G + 42.5))} Z M${P(s.at(0.55, G + 42.5))} L${P(s.at(0.55, G + 48))} L${P(s.at(0.75, G + 48))} L${P(s.at(0.75, G + 42.5))} Z" fill="${LOCH}"/>`);
  const h0 = pr(cx - 4.2, cy - 35.2, G + 50), h1 = pr(cx + 4.2, cy - 26.8, G + 50), hs = pr(cx, cy - 31, G + 57);
  k += `<path d="M${P(h0)} Q${r(h0[0] + 0.2)} ${r(hs[1] + 1.4)} ${r(hs[0])} ${r(hs[1])} Q${r(h1[0] - 0.2)} ${r(hs[1] + 1.4)} ${P(h1)} Z" fill="#55636a"/>`;
  const kz = pr(cx, cy - 31, G + 59);
  k += `<path d="M${r(hs[0])} ${r(hs[1])} L${r(kz[0])} ${r(kz[1])}" stroke="#55636a" stroke-width=".3"/><circle cx="${r(kz[0])}" cy="${r(kz[1])}" r=".35" fill="#c7a640"/>`;
  S.teil({ id: "paulskirche", de: "die Paulskirche", syl: "PAULS-kir-che", it: "la chiesa di San Paolo", itSyl: "CHIE-sa di san PA-o-lo", en: "St Paul's Church", x: 0, y: 0, kunst: k,
    tipp: "1848 tagte in der Paulskirche das erste frei gewählte Parlament für ganz Deutschland." });
}

/* =====================================================================
   7 — DER RÖMER (Schauseite nach Osten, drei Treppengiebel, Kaiserbalkon)
   ===================================================================== */
const RO = { x: -207, y0: 246, y1: 300, G: 8, K: 1.8 };
const ROM = {};
{
  /* Schauseite in der Ebene x = RO.x; u = Meter nach Norden ab Südecke, v = Höhe; 1,8-fach */
  const F = (u, v) => pr(RO.x, RO.y0 + u * RO.K, RO.G + v * RO.K);
  const PF = (pts) => "M" + pts.map(([u, v]) => P(F(u, v))).join(" L") + " Z";
  const s = mass(RO.x, 270) * RO.K;   /* Einheiten je Meter an der Fassade */
  let k = "";
  /* Häuser: [u0, u1, Traufe, Giebelspitze, Wand, Stufen] — Alt-Limpurg etwas breiter */
  const H = [[0, 13, 15, 26.5, "#e4ab97", 6], [13, 23.5, 16, 28, "#d99682", 5], [23.5, 31, 14.5, 23.5, "#e2a490", 4]];
  /* Dächer dahinter: Firste laufen nach Westen (vom Betrachter weg) */
  for (const [u0, u1, tr, sp] of H) {
    const m = (u0 + u1) / 2;
    k += `<path d="${poly([[RO.x, RO.y0 + u1 * RO.K, RO.G + tr * RO.K], [RO.x, RO.y0 + m * RO.K, RO.G + sp * RO.K], [RO.x - 26, RO.y0 + m * RO.K, RO.G + sp * RO.K], [RO.x - 26, RO.y0 + u1 * RO.K, RO.G + tr * RO.K]])}" fill="${SCHIEFER}"/>`;
  }
  /* Frauenstein und Salzhaus rechts, schlichter */
  k += `<path d="${PF([[31, 0], [41, 0], [41, 15], [31, 15]])}" fill="#ede1cc"/>`;
  k += `<path d="${poly([[RO.x, RO.y0 + 31 * RO.K, RO.G + 15 * RO.K], [RO.x, RO.y0 + 41 * RO.K, RO.G + 15 * RO.K], [RO.x - 8, RO.y0 + 41 * RO.K, RO.G + 21 * RO.K], [RO.x - 8, RO.y0 + 31 * RO.K, RO.G + 21 * RO.K]])}" fill="${SCHIEFER_L}"/>`;
  for (let i = 0; i < 3; i++) for (const v of [4, 8.5, 12.5]) k += `<path d="${PF([[32.4 + i * 3, v], [33.8 + i * 3, v], [33.8 + i * 3, v + 2.2], [32.4 + i * 3, v + 2.2]])}" fill="#4f5963"/>`;
  /* die drei Giebelhäuser */
  /* gotische Fenster: Spitzbogen mit Mittelpfosten und Maßwerk (Pass im Bogenfeld); sonst Kreuzstock */
  const fenster = (u, v, w, h, spitz) => {
    const sw = r(0.11 * s), RAH = "#e9d8c8";
    if (!spitz) return `<path d="${PF([[u, v], [u, v + h], [u + w, v + h], [u + w, v]])}" fill="#3c4650" stroke="${RAH}" stroke-width="${sw}"/><path d="M${P(F(u + w / 2, v))} L${P(F(u + w / 2, v + h))} M${P(F(u, v + h * 0.66))} L${P(F(u + w, v + h * 0.66))}" stroke="${RAH}" stroke-width="${sw}"/>`;
    const k0 = v + h - w * 0.62;
    let g = `<path d="M${P(F(u, v))} L${P(F(u, k0))} Q${P(F(u, v + h - w * 0.12))} ${P(F(u + w / 2, v + h))} Q${P(F(u + w, v + h - w * 0.12))} ${P(F(u + w, k0))} L${P(F(u + w, v))} Z" fill="#3c4650" stroke="${RAH}" stroke-width="${sw}"/>`;
    g += `<path d="M${P(F(u + w / 2, v))} L${P(F(u + w / 2, k0))} M${P(F(u, k0))} Q${P(F(u + w * 0.25, k0 + w * 0.3))} ${P(F(u + w / 2, k0))} Q${P(F(u + w * 0.75, k0 + w * 0.3))} ${P(F(u + w, k0))}" stroke="${RAH}" stroke-width="${sw}" fill="none"/>`;
    const pc = F(u + w / 2, k0 + w * 0.36); g += `<circle cx="${r(pc[0])}" cy="${r(pc[1])}" r="${r(w * 0.16 * s)}" fill="none" stroke="${RAH}" stroke-width="${sw}"/>`;
    return g;
  };
  H.forEach(([u0, u1, tr, sp, wand, st], hi) => {
    const w = u1 - u0, sw = w / 2 / (st + 0.6), sh = (sp - tr) / (st + 1);
    const pts = [[u0, 0], [u0, tr]];
    for (let i = 0; i < st; i++) pts.push([u0 + i * sw, tr + (i + 1) * sh], [u0 + (i + 1) * sw, tr + (i + 1) * sh]);
    pts.push([u0 + w / 2 - sw * 0.6, sp], [u0 + w / 2 + sw * 0.6, sp]);
    for (let i = st - 1; i >= 0; i--) pts.push([u1 - (i + 1) * sw, tr + (i + 1) * sh], [u1 - i * sw, tr + (i + 1) * sh]);
    pts.push([u1, tr], [u1, 0]);
    k += `<path d="${PF(pts)}" fill="${wand}"/>`;
    k += `<path d="${PF(pts)}" fill="${QUADER}" opacity=".5"/><path d="${PF(pts)}" fill="${S.lg("roelicht", [[0, "#fff1d8", 0.2], [0.6, "#fff1d8", 0], [1, "#1d2a3a", 0.1]], 0, 0, 1, 0)}"/>`;
    k += `<path d="${PF(pts)}" fill="none" stroke="#9a5446" stroke-width="${r(0.18 * s)}"/>`;
    /* Zierknäufe auf den Stufen */
    for (let i = 0; i < st; i++) for (const uu of [u0 + (i + 1) * sw - 0.15, u1 - (i + 1) * sw + 0.15]) { const p = F(uu, tr + (i + 1) * sh + 0.5); k += `<circle cx="${r(p[0])}" cy="${r(p[1])}" r="${r(0.35 * s)}" fill="#8f4c40"/>`; }
    const tp = F(u0 + w / 2, sp + 1.2); k += `<path d="M${P(F(u0 + w / 2 - 0.4, sp))} L${P(tp)} L${P(F(u0 + w / 2 + 0.4, sp))} Z" fill="#8f4c40"/>`;
    /* Sandsteingewände: Gesimse */
    for (const v of [4.6, 9.8, tr]) k += `<path d="M${P(F(u0, v))} L${P(F(u1, v))}" stroke="#b9695a" stroke-width="${r(0.3 * s)}"/>`;
    if (hi === 1) {
      /* Haus zum Römer: Erdgeschoss zwei Spitzbogenportale, Kaiserbalkon, vier Kaiser in Nischen, Uhr mit zwei Wappen */
      k += `<path d="${PF([[u0 + 1.6, 0], [u0 + 1.6, 2.6], [u0 + 3.2, 4], [u0 + 4.8, 2.6], [u0 + 4.8, 0]])}" fill="#2e2622"/><path d="${PF([[u1 - 4.8, 0], [u1 - 4.8, 2.6], [u1 - 3.2, 4], [u1 - 1.6, 2.6], [u1 - 1.6, 0]])}" fill="#2e2622"/>`;
      /* Balkon: Brüstung mit Maßwerk auf Konsolen, Fahnenstangen */
      k += `<path d="${PF([[u0 + 1.4, 5], [u1 - 1.4, 5], [u1 - 1.4, 6.4], [u0 + 1.4, 6.4]])}" fill="#c98a76"/>`;
      for (let i = 0; i < 8; i++) { const uu = u0 + 1.9 + i * (w - 3.8) / 7; k += `<path d="M${P(F(uu, 5.2))} L${P(F(uu, 6.2))}" stroke="#7d4135" stroke-width="${r(0.18 * s)}"/>`; }
      k += `<path d="M${P(F(u0 + 1.4, 6.4))} L${P(F(u1 - 1.4, 6.4))}" stroke="#f0d2c4" stroke-width="${r(0.2 * s)}"/>`;
      for (const uu of [u0 + 2.2, u1 - 2.2]) { const a = F(uu, 6.4), b = F(uu + (uu < u0 + 5 ? -1.4 : 1.4), 9.4); k += `<path d="M${P(a)} L${P(b)}" stroke="#d8d8d0" stroke-width="${r(0.12 * s)}"/>`; }
      { const a = F(u0 + 0.8, 9.4), b = F(u0 + 0.8, 8.2), c = F(u0 - 0.6, 8.4); k += `<path d="M${P(a)} L${P(b)} L${P(c)} Z" fill="#c62d2a"/>`; }
      for (let i = 0; i < 5; i++) k += fenster(u0 + 1.9 + i * 1.4, 6.6, 1.1, 3, true);
      /* zweites Obergeschoss: Fenster mit Spitzbögen, dazwischen vier Kaiser in Nischen */
      for (let i = 0; i < 3; i++) k += fenster(u0 + 2.3 + i * 2.6, 10.6, 1.4, 3.6, true);
      /* vier Kaiser: stehende Figuren mit Krone, Zepter bzw. Reichsapfel, Mantel mit Falten, in Nischen unter Baldachinen */
      for (let i = 0; i < 4; i++) {
        const uu = u0 + 1.4 + i * 2.6, mf = ["#c9a24a", "#b8473a", "#5b6fa0", "#8a3a5a"][i];
        k += `<path d="${PF([[uu - 0.5, 10.8], [uu - 0.5, 13.7], [uu + 0.5, 13.7], [uu + 0.5, 10.8]])}" fill="#6e3a30"/>`;
        k += `<path d="${PF([[uu - 0.62, 13.7], [uu, 14.7], [uu + 0.62, 13.7]])}" fill="#e7c6b4"/><path d="M${P(F(uu, 14.7))} L${P(F(uu, 15.1))}" stroke="#e7c6b4" stroke-width="${r(0.12 * s)}"/>`;
        k += `<path d="${PF([[uu - 0.62, 13.7], [uu - 0.62, 13.55], [uu + 0.62, 13.55], [uu + 0.62, 13.7]])}" fill="#c9a490"/>`;
        k += `<path d="${PF([[uu - 0.36, 11], [uu - 0.24, 12.45], [uu, 12.6], [uu + 0.24, 12.45], [uu + 0.36, 11]])}" fill="${mf}"/>`;
        k += `<path d="M${P(F(uu - 0.12, 11.05))} L${P(F(uu - 0.08, 12.3))} M${P(F(uu + 0.12, 11.05))} L${P(F(uu + 0.1, 12.3))}" stroke="#3a2a22" stroke-width="${r(0.05 * s)}" opacity=".6"/>`;
        const kopf = F(uu, 12.82); k += `<circle cx="${r(kopf[0])}" cy="${r(kopf[1])}" r="${r(0.19 * s)}" fill="#e2c19a"/>`;
        k += `<path d="${PF([[uu - 0.19, 12.98], [uu - 0.21, 13.26], [uu - 0.1, 13.12], [uu, 13.3], [uu + 0.1, 13.12], [uu + 0.21, 13.26], [uu + 0.19, 12.98]])}" fill="#e6c25a"/>`;
        if (i % 2) { const ap = F(uu - 0.3, 12.15); k += `<circle cx="${r(ap[0])}" cy="${r(ap[1])}" r="${r(0.1 * s)}" fill="#e6c25a"/>`; }
        else k += `<path d="M${P(F(uu + 0.28, 11.8))} L${P(F(uu + 0.38, 13.25))}" stroke="#e6c25a" stroke-width="${r(0.07 * s)}"/>`;
      }
      /* Giebel: Uhr zwischen zwei Wappen (weißer, gekrönter Adler auf Rot) */
      const uc = F(u0 + w / 2, 21.4);
      ROM.uhr = uc;
      k += `<circle cx="${r(uc[0])}" cy="${r(uc[1])}" r="${r(1.25 * s)}" fill="#f6f1e4" stroke="#6b3b2c" stroke-width="${r(0.18 * s)}"/>`;
      k += `<path d="M${r(uc[0])} ${r(uc[1])} l0 ${r(-0.9 * s)} M${r(uc[0])} ${r(uc[1])} l${r(0.6 * s)} ${r(0.3 * s)}" stroke="#222" stroke-width="${r(0.12 * s)}"/>`;
      ROM.wappen = [];
      for (const du of [-2.7, 2.7]) {
        const c = F(u0 + w / 2 + du, 21.4); ROM.wappen.push(c);
        const q = 0.85 * s;
        k += `<path d="M${r(c[0] - q)} ${r(c[1] - q * 1.1)} h${r(2 * q)} v${r(q * 1.1)} q0 ${r(q * 0.9)} ${r(-q)} ${r(q * 1.2)} q${r(-q)} ${r(-q * 0.3)} ${r(-q)} ${r(-q * 1.2)} Z" fill="#c62d2a" stroke="#e6c25a" stroke-width="${r(0.08 * s)}"/>`;
        /* Adler: Kopf, gespreizte Flügel mit Federn, Schwanz, Krone */
        k += `<g fill="#fbfbf8" transform="translate(${r(c[0])} ${r(c[1] - q * 0.05)}) scale(${r(q * 0.95)})"><path d="M0 -.62 Q.18 -.6 .16 -.42 L.05 -.3 L.62 -.62 L.56 -.4 L.68 -.38 L.5 -.18 L.6 -.12 L.32 .02 L.12 -.05 L.18 .3 L.32 .5 L0 .38 L-.32 .5 L-.18 .3 L-.12 -.05 L-.32 .02 L-.6 -.12 L-.5 -.18 L-.68 -.38 L-.56 -.4 L-.62 -.62 L-.05 -.3 L-.16 -.42 Q-.18 -.6 0 -.62 Z"/><path d="M-.13 -.62 L-.13 -.76 L-.05 -.68 L0 -.8 L.05 -.68 L.13 -.76 L.13 -.62 Z" fill="#e6c25a"/></g>`;
      }
      k += fenster(u0 + w / 2 - 0.6, 23.4, 1.2, 1.9, true);
    } else {
      /* Alt-Limpurg und Löwenstein: Laden-Arkaden, Fenstergruppen mit Spitzbögen */
      for (let i = 0; i < 3; i++) k += `<path d="${PF([[u0 + 0.9 + i * (w - 1.8) / 3, 0], [u0 + 0.9 + i * (w - 1.8) / 3, 2.4], [u0 + 0.9 + (i + 0.5) * (w - 1.8) / 3, 3.6], [u0 + 0.9 + (i + 1) * (w - 1.8) / 3 - 0.5, 2.4], [u0 + 0.9 + (i + 1) * (w - 1.8) / 3 - 0.5, 0]])}" fill="#3a302a"/>`;
      for (const v of [5.4, 10.6]) for (let i = 0; i < 3; i++) k += fenster(u0 + 1.2 + i * (w - 2) / 3, v, (w - 2) / 3 - 0.8, 3.4, v > 10);
      k += fenster(u0 + w / 2 - 1.6, tr + 1.4, 1.2, 2.6, true) + fenster(u0 + w / 2 + 0.4, tr + 1.4, 1.2, 2.6, true) + fenster(u0 + w / 2 - 0.5, tr + 5.4, 1, 1.9, true);
    }
  });
  /* Römerberg davor: heller Platz mit dem Gerechtigkeitsbrunnen (Justitia) */
  k += `<path d="${poly([[RO.x, RO.y0, RO.G], [RO.x, RO.y0 + 41 * RO.K, RO.G], [RO.x + 40, RO.y0 + 41 * RO.K, RO.G], [RO.x + 40, RO.y0, RO.G]])}" fill="#cfc4b4"/>`;
  const br = pr(RO.x + 24, RO.y0 + 12 * RO.K, RO.G), bs = mass(RO.x + 24, 270) * RO.K;
  k += `<ellipse cx="${r(br[0])}" cy="${r(br[1])}" rx="${r(3.4 * bs)}" ry="${r(0.7 * bs)}" fill="#a8604f"/><rect x="${r(br[0] - 0.35 * bs)}" y="${r(br[1] - 4.6 * bs)}" width="${r(0.7 * bs)}" height="${r(4.6 * bs)}" fill="#a8604f"/>`;
  k += `<path d="M${r(br[0])} ${r(br[1] - 6.6 * bs)} l${r(0.4 * bs)} ${r(2 * bs)} h${r(-0.8 * bs)} Z" fill="#5f6a5c"/><path d="M${r(br[0] - 1.2 * bs)} ${r(br[1] - 6 * bs)} h${r(2.4 * bs)}" stroke="#c9a44a" stroke-width="${r(0.2 * bs)}"/>`;

  ROM.basis = F(15, 0); ROM.oben = F(15, 28); ROM.links = F(0, 0); ROM.rechts = F(41, 0);
  ROM.giebelL = F(6.5, 18); ROM.balkon = F(18.25, 5.6);
  S.teil({ id: "roemer", de: "der Römer", syl: "RÖ-mer", it: "il Römer (il municipio)", itSyl: "RÖ-mer", en: "Römer (city hall)", x: 0, y: 0, kunst: k,
    tipp: "Der Römer ist seit über 600 Jahren das Rathaus von Frankfurt.",
    zoom: { x: r(ROM.links[0] - 5), y: r(ROM.oben[1] - 1.5), w: 36, h: 24 },
    unter: [
      { id: "treppengiebel", de: "der Treppengiebel", syl: "TREP-pen-gie-bel", it: "il frontone a gradoni", itSyl: "fron-TO-ne a gra-DO-ni", en: "stepped gable",
        x: ROM.giebelL[0], y: ROM.giebelL[1], kunst: flaeche(-3, -6.2, 6, 6.4, 0.3), tipp: "Die Giebel haben Stufen wie eine Treppe: Treppengiebel." },
      { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony",
        x: ROM.balkon[0], y: ROM.balkon[1], kunst: flaeche(-3.4, -1.6, 6.8, 2.2, 0.3), tipp: "Vom Kaiserbalkon winken Gäste der Stadt und die Fußballer der Eintracht." },
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms",
        x: ROM.uhr[0], y: ROM.uhr[1], kunst: flaeche(ROM.wappen[0][0] - ROM.uhr[0] - 1.2, -1.4, 2.4, 2.8, 0.3) + flaeche(ROM.wappen[1][0] - ROM.uhr[0] - 1.2, -1.4, 2.4, 2.8, 0.3),
        tipp: "Das Wappen von Frankfurt: ein weißer, gekrönter Adler auf Rot." },
    ] });
}
function lichtSchraeg(F, u0, u1, v0, v1) {
  return `<path d="M${P(F(u0, v0))} L${P(F(u1, v0))} L${P(F(u1, v1))} L${P(F(u0, v1))} Z" fill="${S.lg("roelicht", [[0, "#fff1d8", 0.22], [0.6, "#fff1d8", 0], [1, "#1d2a3a", 0.12]], 0, 0, 1, 0)}"/>`;
}

/* =====================================================================
   8 — DER KAISERDOM (Westturm 95 m, Querhaus, Chor)
   ===================================================================== */
const DOM = { x: -14, y: 278, G: 7 };
const DOMM = {};
{
  const { x: cx, y: cy, G } = DOM;
  let k = "";
  const s = mass(cx, cy);
  /* Kirchenkörper: Langhaus (Ost), Querhaus mit Südgiebel, Chor */
  const kasten = (x0, y0, x1, y1, z1) => turmSeiten([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], G, G + z1, ROT_L, ROT_S, (sd) => `<path d="M${P(sd.at(0, G))} L${P(sd.at(1, G))} L${P(sd.at(1, G + z1))} L${P(sd.at(0, G + z1))} Z" fill="${QUADER}"/>`);
  const satteldach = (x0, y0, x1, y1, z0, z1, laengsX) => {
    if (laengsX) {
      const ym = (y0 + y1) / 2;
      return `<path d="${poly([[x0, y0, G + z0], [x1, y0, G + z0], [x1, ym, G + z1], [x0, ym, G + z1]])}" fill="${SCHIEFER_L}"/><path d="${poly([[x1, y0, G + z0], [x1, y1, G + z0], [x1, ym, G + z1]])}" fill="${ROT_S}"/>`;
    }
    const xm = (x0 + x1) / 2;
    return `<path d="${poly([[x1, y0, G + z0], [x1, y1, G + z0], [xm, y1, G + z1], [xm, y0, G + z1]])}" fill="${SCHIEFER}"/>`;
  };
  /* Chor (Osten) */
  k += kasten(45, 266, 92, 290, 24) + satteldach(45, 266, 92, 290, 24, 36, true);
  /* Langhaus */
  k += kasten(6, 262, 30, 294, 22) + satteldach(6, 262, 30, 294, 22, 36, true);
  /* Querhaus mit Südgiebel und großem Maßwerkfenster */
  k += kasten(30, 244, 45, 312, 25) + satteldach(30, 244, 45, 312, 25, 40, false);
  {
    const F = (u, v) => pr(30 + u, 244, G + v);
    k += `<path d="M${P(F(0, 25))} L${P(F(7.5, 40))} L${P(F(15, 25))} Z" fill="${ROT_L}"/><path d="M${P(F(0, 25))} L${P(F(7.5, 40))} L${P(F(15, 25))} Z" fill="${QUADER}"/>`;
    k += `<path d="M${P(F(3.4, 6))} L${P(F(3.4, 23))} Q${P(F(3.6, 29))} ${P(F(7.5, 30.5))} Q${P(F(11.4, 29))} ${P(F(11.6, 23))} L${P(F(11.6, 6))} Z" fill="#33404b"/>`;
    for (const u of [5.4, 7.5, 9.6]) k += `<path d="M${P(F(u, 6))} L${P(F(u, 24))}" stroke="#d7a08e" stroke-width="${r(0.3 * s)}"/>`;
    const rc = F(7.5, 26.4); k += `<circle cx="${r(rc[0])}" cy="${r(rc[1])}" r="${r(1.8 * s)}" fill="none" stroke="#d7a08e" stroke-width="${r(0.3 * s)}"/>`;
    for (const u of [0, 15]) k += `<path d="M${P(F(u - 0.8, 25))} L${P(F(u, 32))} L${P(F(u + 0.8, 25))} Z" fill="#a95c4e"/>`;
  }
  /* Westturm: quadratischer Unterbau (20 m) mit Eck-Strebepfeilern und Absätzen */
  const W0 = 10;
  k += turmSeiten([[cx - W0, cy - W0], [cx + W0, cy - W0], [cx + W0, cy + W0], [cx - W0, cy + W0]], G, G + 40, ROT_L, ROT_S, (sd) => {
    let g = `<path d="M${P(sd.at(0, G))} L${P(sd.at(1, G))} L${P(sd.at(1, G + 40))} L${P(sd.at(0, G + 40))} Z" fill="${QUADER}"/>`;
    /* zwei hohe Fenster je Seite, oben die Schallarkaden */
    for (const t of [0.3, 0.7]) {
      g += `<path d="M${P(sd.at(t - 0.07, G + 22))} L${P(sd.at(t - 0.07, G + 33))} L${P(sd.at(t, G + 36))} L${P(sd.at(t + 0.07, G + 33))} L${P(sd.at(t + 0.07, G + 22))} Z" fill="${LOCH}"/>`;
      g += `<path d="M${P(sd.at(t, G + 22))} L${P(sd.at(t, G + 34))}" stroke="${sd.sonne > 0 ? "#e2a593" : "#a8604f"}" stroke-width="${r(0.25 * s)}"/>`;
      g += `<path d="M${P(sd.at(t - 0.05, G + 6))} L${P(sd.at(t - 0.05, G + 15))} L${P(sd.at(t, G + 17))} L${P(sd.at(t + 0.05, G + 15))} L${P(sd.at(t + 0.05, G + 6))} Z" fill="${LOCH}"/>`;
    }
    g += `<path d="M${P(sd.at(0, G + 20))} L${P(sd.at(1, G + 20))}" stroke="${sd.sonne > 0 ? "#e2a593" : "#a8604f"}" stroke-width="${r(0.6 * s)}"/>`;
    return g;
  });
  /* Strebepfeiler an den Ecken, nach oben mit Absätzen schmaler */
  for (const [ex, ey] of [[cx - W0, cy - W0], [cx + W0, cy - W0], [cx + W0, cy + W0]]) {
    for (const [z0, z1, d] of [[0, 14, 2.6], [14, 28, 2], [28, 40, 1.4]]) {
      k += turmSeiten([[ex - d, ey - d], [ex + d, ey - d], [ex + d, ey + d], [ex - d, ey + d]], G + z0, G + z1, "#c47a66", "#7e4134");
    }
    const sp = pr(ex, ey, G + 47);
    const b0 = pr(ex - 1.2, ey - 1.2, G + 40), b1 = pr(ex + 1.2, ey + 1.2, G + 40);
    k += `<path d="M${P(b0)} L${P(sp)} L${P(b1)} Z" fill="#a95c4e"/>`;
  }
  /* Maßwerkgalerie mit 8 Fialen am Übergang zum Oktogon */
  {
    const g0 = G + 40, g1 = G + 42.4;
    k += turmSeiten([[cx - W0 - 0.6, cy - W0 - 0.6], [cx + W0 + 0.6, cy - W0 - 0.6], [cx + W0 + 0.6, cy + W0 + 0.6], [cx - W0 - 0.6, cy + W0 + 0.6]], g0, g1, "#e0a08c", "#9a5446", (sd) => {
      let g = "";
      g += `<path d="M${P(sd.at(0, g0 + 0.3))} L${P(sd.at(1, g0 + 0.3))} L${P(sd.at(1, g1 - 0.3))} L${P(sd.at(0, g1 - 0.3))} Z" fill="url(#${S.id("vierpass")})"/>`;
      return g;
    });
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8, px = cx + Math.cos(a) * 9.4, py = cy + Math.sin(a) * 9.4;
      if (tief(px, py) > tief(cx, cy) + 4) continue;
      const b = pr(px, py, g1), t = pr(px, py, g1 + 7);
      k += `<path d="M${r(b[0] - 0.55 * s)} ${r(b[1])} L${r(t[0])} ${r(t[1])} L${r(b[0] + 0.55 * s)} ${r(b[1])} Z" fill="#b8695a"/>`;
      for (let j = 1; j < 4; j++) { const q = pr(px, py, g1 + j * 1.6); k += `<circle cx="${r(q[0] + 0.32 * s * (1 - j / 4))}" cy="${r(q[1])}" r="${r(0.18 * s)}" fill="#c98472"/>`; }
    }
  }
  /* Oktogon (Durchmesser 16 m): Fenster unter Wimpergen, Wimperge ragen in den Kuppelfuß */
  const okto = (z, R) => { const p = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + Math.PI / 8; p.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); } return p; };
  const O0 = G + 42.4, O1 = G + 66, WIMP = [];
  k += turmSeiten(okto(0, 8.2), O0, O1, S.lg("oktol", [[0, "#d99886"], [1, "#c27a66"]]), S.lg("oktos", [[0, "#9a5446"], [1, "#834436"]]), (sd) => {
    let g = `<path d="M${P(sd.at(0, O0))} L${P(sd.at(1, O0))} L${P(sd.at(1, O1))} L${P(sd.at(0, O1))} Z" fill="${QUADER}"/>`;
    g += `<path d="M${P(sd.at(0.22, O0 + 3))} L${P(sd.at(0.22, O1 - 6))} Q${P(sd.at(0.24, O1 - 3))} ${P(sd.at(0.5, O1 - 2))} Q${P(sd.at(0.76, O1 - 3))} ${P(sd.at(0.78, O1 - 6))} L${P(sd.at(0.78, O0 + 3))} Z" fill="#2f2a2a"/>`;
    g += `<path d="M${P(sd.at(0.5, O0 + 3))} L${P(sd.at(0.5, O1 - 4))}" stroke="${sd.sonne > 0 ? "#f0b6a2" : "#b46a5a"}" stroke-width="${r(0.3 * s)}"/>`;
    const tc = sd.at(0.5, O1 - 4.4); g += `<circle cx="${r(tc[0])}" cy="${r(tc[1])}" r="${r(0.75 * s)}" fill="none" stroke="${sd.sonne > 0 ? "#f0b6a2" : "#b46a5a"}" stroke-width="${r(0.2 * s)}"/>`;
    /* Wimperg: spitzer Ziergiebel mit Krabben, ragt über die Traufe */
    WIMP.push(sd);
    return g;
  });
  const wimperg = (sd) => {
    let g = "";
    const hell = sd.sonne > 0;
    g += `<path d="M${P(sd.at(0.12, O1 - 3.5))} L${P(sd.at(0.5, O1 + 6.5))} L${P(sd.at(0.88, O1 - 3.5))} Z" fill="${hell ? "#df9c86" : "#9a5446"}"/>`;
    g += `<path d="M${P(sd.at(0.26, O1 - 2.4))} L${P(sd.at(0.5, O1 + 3.8))} L${P(sd.at(0.74, O1 - 2.4))} Z" fill="${hell ? "#a85a4a" : "#6e3529"}"/>`;
    const pc = sd.at(0.5, O1 - 0.2); g += `<circle cx="${r(pc[0])}" cy="${r(pc[1])}" r="${r(0.7 * s)}" fill="none" stroke="${hell ? "#f0b6a2" : "#b46a5a"}" stroke-width="${r(0.18 * s)}"/>`;
    for (let i = 1; i < 7; i++) for (const sg of [-1, 1]) { const q = sd.at(0.5 + sg * (0.38 - i * 0.054), O1 - 3.5 + i * 1.43); g += `<circle cx="${r(q[0] + sg * 0.15 * s)}" cy="${r(q[1] - 0.2 * s)}" r="${r(0.2 * s)}" fill="#c98472"/>`; }
    const kb = sd.at(0.5, O1 + 6.8); g += `<circle cx="${r(kb[0])}" cy="${r(kb[1])}" r="${r(0.35 * s)}" fill="#c98472"/>`;
    return g;
  };
  /* Fialen an den Oktogon-Ecken */
  for (const [px, py] of okto(0, 8.6)) {
    if (tief(px, py) > tief(cx, cy) + 4) continue;
    const b = pr(px, py, O1 - 2), t = pr(px, py, O1 + 8);
    k += `<path d="M${r(b[0] - 0.5 * s)} ${r(b[1])} L${r(t[0])} ${r(t[1])} L${r(b[0] + 0.5 * s)} ${r(b[1])} Z" fill="#b8695a"/>`;
  }
  /* steinerne Kuppel: acht Rippen mit dichten Krabben */
  {
    const K0 = O1, K1 = G + 86, prof = (t) => 2.2 + 4.6 * Math.pow(Math.cos(t * Math.PI / 2), 1.05) * (1 + 0.05 * Math.sin(t * Math.PI));
    const rand = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, z = K0 + (K1 - K0) * t, rr = prof(t); rand.push([pr(cx - rr * RV[0], cy - rr * RV[1], z), pr(cx + rr * RV[0], cy + rr * RV[1], z)]); }
    k += `<path d="M${rand.map((q) => P(q[0])).join(" L")} L${rand.slice().reverse().map((q) => P(q[1])).join(" L")} Z" fill="${S.lg("kuppel", [[0, "#dfa08c"], [0.35, "#c47a66"], [0.7, "#9a5446"], [1, "#7b4136"]], 0, 0, 1, 0)}"/>`;
    for (let j = 0; j < 16; j++) {
      const a = j / 16 * Math.PI * 2 + Math.PI / 8;
      const rib = [];
      for (let i = 0; i <= 14; i++) { const t = i / 14, z = K0 + (K1 - K0) * t, rr = prof(t); rib.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z]); }
      if (tief(rib[0][0], rib[0][1]) > tief(cx, cy) + 1) continue;
      k += `<path d="M${rib.map((p) => P(pr(...p))).join(" L")}" stroke="#7a3e33" stroke-width="${r(0.45 * s)}" fill="none"/>`;
      let kr = ""; for (let i = 2; i < 14; i += 2) { const q = pr(...rib[i]); kr += `M${r(q[0])} ${r(q[1])} q${r(0.45 * s)} ${r(-0.1 * s)} ${r(0.35 * s)} ${r(-0.55 * s)} `; }
      k += `<path d="${kr}" stroke="#d48b77" stroke-width="${r(0.22 * s)}" fill="none"/>`;
    }
    for (const sd of WIMP) k += wimperg(sd);
    /* Kranz kleiner Fialen am Kuppelfuß */
    for (let j = 0; j < 16; j++) { const a = j / 16 * Math.PI * 2, px = cx + Math.cos(a) * 7, py = cy + Math.sin(a) * 7; if (tief(px, py) > tief(cx, cy) + 1) continue; const b = pr(px, py, K0), t = pr(px, py, K0 + 2.6); k += `<path d="M${r(b[0] - 0.3 * s)} ${r(b[1])} L${P(t)} L${r(b[0] + 0.3 * s)} ${r(b[1])} Z" fill="#b8695a"/>`; }
    /* Laterne: achteckig, mit Fialen und schlanker Spitze */
    const L0 = K1, L1 = K1 + 5;
    k += turmSeiten(okto(0, 2.4), L0, L1, "#c98472", "#8f4c40", (sd) => `<path d="M${P(sd.at(0.3, L0 + 0.8))} L${P(sd.at(0.3, L1 - 1))} L${P(sd.at(0.7, L1 - 1))} L${P(sd.at(0.7, L0 + 0.8))} Z" fill="${LOCH}"/>`);
    for (const [px, py] of okto(0, 2.6)) { if (tief(px, py) > tief(cx, cy)) continue; const b = pr(px, py, L1), t = pr(px, py, L1 + 2.2); k += `<path d="M${r(b[0] - 0.25 * s)} ${r(b[1])} L${P(t)} L${r(b[0] + 0.25 * s)} ${r(b[1])} Z" fill="#b8695a"/>`; }
    const sb = pr(cx, cy, L1), st = pr(cx, cy, G + 95);
    k += `<path d="M${r(sb[0] - 1.6 * s)} ${r(sb[1])} L${P(st)} L${r(sb[0] + 1.6 * s)} ${r(sb[1])} Z" fill="${S.lg("spitze", [[0, "#cf8a76"], [1, "#8f4c40"]], 0, 0, 1, 0)}"/>`;
    k += `<circle cx="${r(st[0])}" cy="${r(st[1] + 0.3)}" r="${r(0.5 * s)}" fill="#c7a640"/>`;
    DOMM.kuppel = pr(cx, cy, K0); DOMM.kuppelOben = pr(cx, cy, K1 + 2);
  }
  S.teil({ id: "kaiserdom", de: "der Kaiserdom", syl: "KAI-ser-dom", it: "il Duomo imperiale", itSyl: "DUO-mo im-pe-RIA-le", en: "Imperial Cathedral", x: 0, y: 0, kunst: k,
    tipp: "Im Kaiserdom wurden die deutschen Könige gewählt und die Kaiser gekrönt. Sein Turm ist 95 Meter hoch.",
    zoom: { x: r(DOMM.kuppel[0] - 16), y: r(DOMM.kuppelOben[1] - 6), w: 32, h: 21.3 },
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome",
        x: DOMM.kuppel[0], y: DOMM.kuppel[1], kunst: flaeche(-5, DOMM.kuppelOben[1] - DOMM.kuppel[1], 10, DOMM.kuppel[1] - DOMM.kuppelOben[1] + 0.5, 0.5),
        tipp: "Die Kuppel oben auf dem Domturm ist aus Stein – mit Krabben auf den Rippen." },
    ] });
}

/* =====================================================================
   9 — DIE ALTSTADT (Mainkai: Kaimauer, Platanen, Häuser, Saalhof mit
       Rententurm, Historisches Museum, Nikolaikirche, Leonhardskirche)
   ===================================================================== */
{
  let k = "";
  const KAI = 6;   /* Straßenhöhe am Mainkai über dem Wasser */
  const roemerBild = [ROM.links[0] - 1, ROM.rechts[0] + 1];
  /* Häuser von hinten (Westen, weit) nach vorn (Osten, nah) */
  const haeuser = [];
  for (let x = -460; x < 104;) {
    if (x > -238 && x < -176) { x = -176; continue; }          /* Platz für Saalhof und Museum */
    const w = 9 + rnd() * 9, xm = x + w / 2, y0 = anX(NORD, xm) + 24;
    let h = 14 + rnd() * 7;
    const pm = pr(xm, y0, KAI + h);
    if (pm[0] > roemerBild[0] - 7 && pm[0] < roemerBild[1] - 4 && x > -180) { x += w; continue; }   /* Blick über den Römerberg frei */   /* Saalgasse: niedrig, damit der Römer zu sehen ist */
    haeuser.push([x, y0, w, h, ["#efe6d6", "#e8d2bf", "#f2ead9", "#d9c7b3", "#e6dccb", "#dcc0aa", "#f0e2cc", "#e2d6c6", "#cfd6d8"][Math.floor(rnd() * 9)], rnd() < 0.3]);
    x += w;
  }
  /* Leonhardskirche (hinter dem Steg): zwei achteckige Türme, Schiff */
  const LK = [-400, 150];
  k += turmSeiten([[LK[0] - 14, LK[1] - 7], [LK[0] + 14, LK[1] - 7], [LK[0] + 14, LK[1] + 7], [LK[0] - 14, LK[1] + 7]], KAI, KAI + 14, ROT_L, ROT_S);
  k += `<path d="${poly([[LK[0] - 14, LK[1] - 7, KAI + 14], [LK[0] + 14, LK[1] - 7, KAI + 14], [LK[0] + 14, LK[1], KAI + 22], [LK[0] - 14, LK[1], KAI + 22]])}" fill="${SCHIEFER_L}"/>`;
  for (const dx of [-17, -9]) {
    const c = [LK[0] + dx, LK[1] + 6];
    k += turmSeiten(rechteck(c[0], c[1], 5, 5, 0.4), KAI, KAI + 30, ROT_L, ROT_S);
    const b0 = pr(c[0] - 2.8, c[1], KAI + 30), b1 = pr(c[0] + 2.8, c[1], KAI + 30), t = pr(c[0], c[1], KAI + 38);
    k += `<path d="M${P(b0)} L${P(t)} L${P(b1)} Z" fill="${SCHIEFER}"/>`;
  }
  /* Nikolaikirche (am Römerberg, etwas nach links gerückt): schlanker Turm mit Galerie und Spitzhelm */
  {
    const NK = [-186, 192];
    k += turmSeiten([[NK[0], NK[1] - 6], [NK[0] + 26, NK[1] - 6], [NK[0] + 26, NK[1] + 6], [NK[0], NK[1] + 6]], KAI + 2, KAI + 16, ROT_L, ROT_S);
    k += `<path d="${poly([[NK[0], NK[1] - 6, KAI + 16], [NK[0] + 26, NK[1] - 6, KAI + 16], [NK[0] + 26, NK[1], KAI + 24], [NK[0], NK[1], KAI + 24]])}" fill="${SCHIEFER_L}"/>`;
    const T = [NK[0] + 3, NK[1] - 3];
    k += turmSeiten(rechteck(T[0], T[1], 6, 6), KAI + 2, KAI + 34, ROT_L, ROT_S, (sd) => `<path d="M${P(sd.at(0.4, KAI + 26))} L${P(sd.at(0.4, KAI + 31))} L${P(sd.at(0.6, KAI + 31))} L${P(sd.at(0.6, KAI + 26))} Z" fill="${LOCH}"/>`);
    k += turmSeiten(rechteck(T[0], T[1], 8, 8), KAI + 34, KAI + 35, "#e2a593", "#a8604f");
    for (const [ex, ey] of rechteck(T[0], T[1], 8, 8)) { if (tief(ex, ey) > tief(...T) + 2) continue; const b = pr(ex, ey, KAI + 35), t = pr(ex, ey, KAI + 39); k += `<path d="M${r(b[0] - 0.3)} ${r(b[1])} L${P(t)} L${r(b[0] + 0.3)} ${r(b[1])} Z" fill="#b8695a"/>`; }
    const h0 = pr(T[0] - 3, T[1], KAI + 35), h1 = pr(T[0] + 3, T[1], KAI + 35), hs = pr(T[0], T[1], KAI + 54);
    k += `<path d="M${P(h0)} L${P(hs)} L${P(h1)} Z" fill="${S.lg("nkhelm", [[0, "#7d8893"], [1, "#4b545e"]], 0, 0, 1, 0)}"/>`;
  }
  /* Häuser am Mainkai */
  const haus = ([x, y0, w, h, f, giebel]) => {
    let g = turmSeiten([[x, y0], [x + w, y0], [x + w, y0 + 14], [x, y0 + 14]], KAI, KAI + h, f, S.lg("hs" + f.slice(1), [[0, f], [1, "#8d877e"]], 0, 0, 1, 0), (sd) => {
      if (sd.sonne <= 0.1) return "";
      return `<path d="M${P(sd.at(0.06, KAI + 1))} L${P(sd.at(0.94, KAI + 1))} L${P(sd.at(0.94, KAI + h - 0.8))} L${P(sd.at(0.06, KAI + h - 0.8))} Z" fill="url(#ffm_fenster)"/>`;
    });
    if (giebel) g += `<path d="${poly([[x, y0, KAI + h], [x + w, y0, KAI + h], [x + w / 2, y0, KAI + h + w * 0.55]])}" fill="${f}"/><path d="${poly([[x + w, y0, KAI + h], [x + w / 2, y0, KAI + h + w * 0.55], [x + w / 2, y0 + 14, KAI + h + w * 0.55], [x + w, y0 + 14, KAI + h]])}" fill="${SCHIEFER}"/>`;
    else g += `<path d="${poly([[x, y0, KAI + h], [x + w, y0, KAI + h], [x + w, y0 + 7, KAI + h + 4], [x, y0 + 7, KAI + h + 4]])}" fill="${SCHIEFER_L}"/>`;
    return g;
  };
  for (const hs of haeuser.filter(([x]) => x < -229)) k += haus(hs);
  /* Saalhof: Burnitzbau (klassizistisch, hell) und Rententurm (1456) */
  {
    const y0 = anX(NORD, -205) + 22;
    k += turmSeiten([[-232, y0], [-206, y0], [-206, y0 + 16], [-232, y0 + 16]], KAI, KAI + 15, S.lg("burnitz", [[0, "#f3efe8"], [1, "#ddd6ca"]]), "#b9b1a4", (sd) => {
      if (sd.sonne <= 0.1) return "";
      let q = ""; for (let e = 0; e < 3; e++) for (let i = 0; i < 6; i++) q += `<path d="M${P(sd.at((i + 0.35) / 6, KAI + 1.6 + e * 4.4))} L${P(sd.at((i + 0.65) / 6, KAI + 1.6 + e * 4.4))} L${P(sd.at((i + 0.65) / 6, KAI + 4.2 + e * 4.4))} L${P(sd.at((i + 0.35) / 6, KAI + 4.2 + e * 4.4))} Z" fill="#55606a"/>`; return q;
    });
    k += `<path d="${poly([[-232, y0, KAI + 15], [-206, y0, KAI + 15], [-206, y0 + 6, KAI + 19], [-232, y0 + 6, KAI + 19]])}" fill="${SCHIEFER}"/>`;
    /* Historisches Museum, Neubau: zwei steile Giebelhäuser dahinter */
    for (const [x0, w] of [[-226, 14], [-210, 14]]) {
      const yy = y0 + 30;
      k += turmSeiten([[x0, yy], [x0 + w, yy], [x0 + w, yy + 24], [x0, yy + 24]], KAI, KAI + 17, S.lg("hmf", [[0, "#e6cbbd"], [1, "#cfae9f"]]), "#a98a7c");
      k += `<path d="${poly([[x0, yy, KAI + 17], [x0 + w, yy, KAI + 17], [x0 + w / 2, yy, KAI + 28]])}" fill="#dcbcad"/><path d="${poly([[x0 + w, yy, KAI + 17], [x0 + w / 2, yy, KAI + 28], [x0 + w / 2, yy + 24, KAI + 28], [x0 + w, yy + 24, KAI + 17]])}" fill="#9f8274"/>`;
      for (let i = 0; i < 3; i++) for (let e = 0; e < 3; e++) k += `<path d="${poly([[x0 + 2.4 + i * 4, yy, KAI + 3 + e * 4.4], [x0 + 3.6 + i * 4, yy, KAI + 3 + e * 4.4], [x0 + 3.6 + i * 4, yy, KAI + 6 + e * 4.4], [x0 + 2.4 + i * 4, yy, KAI + 6 + e * 4.4]])}" fill="#4b4a4f"/>`;
    }
    /* Rententurm: Sandstein, steiles Zeltdach, vier Ecktürmchen */
    const T = [-200, y0 + 4];
    k += turmSeiten(rechteck(T[0], T[1], 9, 9), KAI, KAI + 24, ROT_L, ROT_S, (sd) => {
      let q = `<path d="M${P(sd.at(0, KAI))} L${P(sd.at(1, KAI))} L${P(sd.at(1, KAI + 24))} L${P(sd.at(0, KAI + 24))} Z" fill="${QUADER}"/>`;
      for (const z of [5, 11, 17]) q += `<path d="M${P(sd.at(0.42, KAI + z))} L${P(sd.at(0.42, KAI + z + 2.6))} L${P(sd.at(0.58, KAI + z + 2.6))} L${P(sd.at(0.58, KAI + z))} Z" fill="${LOCH}"/>`;
      return q;
    });
    k += turmSeiten(rechteck(T[0], T[1], 10, 10), KAI + 24, KAI + 25, "#e2a593", "#a8604f");
    const ecken = rechteck(T[0], T[1], 10, 10), spitze = pr(T[0], T[1], KAI + 42);
    const pe = ecken.map(([x, y]) => pr(x, y, KAI + 25));
    k += `<path d="M${P(pe[0])} L${P(spitze)} L${P(pe[1])} Z" fill="${SCHIEFER_L}"/><path d="M${P(pe[1])} L${P(spitze)} L${P(pe[2])} Z" fill="${SCHIEFER}"/>`;
    for (const [ex, ey] of ecken) {
      if (tief(ex, ey) > tief(...T) + 3) continue;
      k += turmSeiten(rechteck(ex, ey, 2.6, 2.6), KAI + 24, KAI + 29, ROT_L, ROT_S);
      const a = pr(ex - 1.5, ey, KAI + 29), b = pr(ex + 1.5, ey, KAI + 29), c = pr(ex, ey, KAI + 34);
      k += `<path d="M${P(a)} L${P(c)} L${P(b)} Z" fill="${SCHIEFER}"/>`;
    }
    k += `<circle cx="${r(spitze[0])}" cy="${r(spitze[1])}" r=".3" fill="#c7a640"/>`;
  }
  for (const hs of haeuser.filter(([x]) => x >= -229)) k += haus(hs);
  /* Platanen am Mainkai */
  for (let x = -440; x < 104; x += 13 + rnd() * 4) {
    if (x > -240 && x < -178) continue;
    const y = anX(NORD, x) + 10, f = pr(x, y, KAI), s = mass(x, y);
    if (f[0] > roemerBild[0] - 6 && f[0] < roemerBild[1] + 4) continue;
    const R = 6 * s * (0.85 + rnd() * 0.3), ct = pr(x, y, KAI + 11);
    k += `<path d="M${r(f[0] - 0.25 * s)} ${r(f[1])} L${r(ct[0] - 0.2 * s)} ${r(ct[1] + R * 0.3)} L${r(ct[0] + 0.2 * s)} ${r(ct[1] + R * 0.3)} L${r(f[0] + 0.25 * s)} ${r(f[1])} Z" fill="#b3aa8c"/>`;
    k += lappen(ct[0], ct[1], R, "#4f6744", 8) + lappen(ct[0] - R * 0.35, ct[1] - R * 0.2, R * 0.5, rnd() < 0.3 ? "#b3a24a" : "#7f9858", 6) + lappen(ct[0] + R * 0.3, ct[1] - R * 0.35, R * 0.4, "#66804c", 6);
    if (R > 3) k += lappen(ct[0] + R * 0.1, ct[1] + R * 0.1, R * 0.1 + 0.2, "#b9cfe2", 5);
  }
  /* Kaimauer aus rotem Sandstein bis zur Wasserlinie, Mainkai-Straße mit Geländer */
  const nk = NORD.filter(([x]) => x >= -470 && x <= 200);
  k += `<path d="${poly([...nk.map(([x, y]) => [x, y, 0]), ...nk.slice().reverse().map(([x, y]) => [x, y, KAI])])}" fill="${S.lg("kaimauer", [[0, "#d4a08c"], [1, "#a8705f"]])}"/>`;
  k += `<path d="${poly([...nk.map(([x, y]) => [x, y, 0]), ...nk.slice().reverse().map(([x, y]) => [x, y, KAI])])}" fill="${QUADER}"/>`;
  k += `<path d="${linie(nk.map(([x, y]) => [x, y, KAI]))}" stroke="#ead2c4" stroke-width=".5" fill="none"/>`;
  k += `<path d="${linie(nk.map(([x, y]) => [x, y + 0.5, KAI + 1.1]))}" stroke="#3a4741" stroke-width=".25" fill="none"/>`;
  /* Mündung des Fahrtors: kleine Treppe zum Wasser beim Saalhof */
  k += `<path d="${poly([[-212, 95.5, 0], [-196, 96.5, 0], [-196, 96.5, KAI], [-212, 95.5, KAI]])}" fill="#b8806e" opacity=".6"/>`;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town", x: 0, y: 0, kunst: k,
    tipp: "Am Mainkai steht der Rententurm von 1456. Zwischen Dom und Römer wurde die Altstadt neu aufgebaut – 2018 war sie fertig." });
}

/* =====================================================================
   10 — DER EISERNE STEG (Stahlfachwerk über den Main, zwei Pfeiler)
   ===================================================================== */
const STEGM = {};
{
  const S1 = [-243, -84], N1 = [-229, 96];
  const len = Math.hypot(N1[0] - S1[0], N1[1] - S1[1]);
  const ax = [(N1[0] - S1[0]) / len, (N1[1] - S1[1]) / len], qv = [ax[1], -ax[0]];   /* qv zeigt nach Osten (zu uns) */
  const p1 = 49.3 / 173.6, p2 = 131.8 / 173.6, pm = (p1 + p2) / 2;
  const deck = (t) => 6.6 + 2.2 * Math.sin(Math.PI * t);
  const hoch = (t) => {
    const H = 9.4, N = 1.7;
    let u;
    if (t <= p1) u = Math.pow(t / p1, 1.8);
    else if (t <= pm) u = Math.pow((pm - t) / (pm - p1), 1.7);
    else if (t <= p2) u = Math.pow((t - pm) / (p2 - pm), 1.7);
    else u = Math.pow((1 - t) / (1 - p2), 1.8);
    return N + (H - N) * u;
  };
  const W = (t, q, z) => [S1[0] + ax[0] * len * t + qv[0] * q, S1[1] + ax[1] * len * t + qv[1] * q, z];
  let k = "";
  /* Schatten des Stegs auf dem Wasser (Sonne von links): versetzt nach Nordosten */
  {
    const sh = [];
    for (let t = 0; t <= 1.001; t += 0.05) { const [x, y] = SCH(...W(t, 0, 0).slice(0, 2), deck(t)); sh.push([x, y, 0]); }
    k += `<path d="${linie(sh)}" stroke="#1d3238" stroke-width=".9" opacity=".25" fill="none"/>`;
  }
  /* Pfeiler aus Sandstein, Pfeilerkopf nach Osten (flussaufwärts), Spiegelung */
  STEGM.pfeiler = [];
  for (const t of [p1, p2]) {
    const c = W(t, 0, 0);
    const fp = [[c[0] - 2.2, c[1] - 4], [c[0] + 2.2, c[1] - 4], [c[0] + 5.2, c[1]], [c[0] + 2.2, c[1] + 4], [c[0] - 2.2, c[1] + 4]];
    k += turmSeiten(fp.slice().reverse(), 0, deck(t) - 0.4, "#c79482", "#8e6255");
    const a = pr(c[0], c[1] - 4, 0), b = pr(c[0] + 5.2, c[1], 0);
    for (let i = 0; i < 6; i++) k += `<rect x="${r(a[0] + (i % 2) * 0.4 - 0.2)}" y="${r(Math.max(a[1], b[1]) + 0.2 + i * 0.42)}" width="${r(b[0] - a[0] + 0.6 - i * 0.18)}" height=".2" fill="#8e6255" opacity="${r(0.3 - i * 0.04)}"/>`;
    STEGM.pfeiler.push(pr(c[0] + 2, c[1], 0));
  }
  /* Fachwerk: hinterer (westlicher) Träger dünn und dunkel, dann Gehweg, vorderer Träger */
  const traeger = (q, farbe, dicke) => {
    let g = "", ober = [], unter = [];
    const n = 52;
    for (let i = 0; i <= n; i++) { const t = i / n; ober.push(W(t, q, deck(t) + hoch(t))); unter.push(W(t, q, deck(t))); }
    let f = "";
    for (let i = 0; i < n; i++) f += `M${P(pr(...unter[i]))} L${P(pr(...ober[i]))} M${P(pr(...unter[i]))} L${P(pr(...ober[i + 1]))} M${P(pr(...ober[i]))} L${P(pr(...unter[i + 1]))} `;
    g += `<path d="${f}" stroke="${farbe}" stroke-width="${r(dicke * 0.3)}" fill="none"/>`;
    g += `<path d="M${ober.map((p) => P(pr(...p))).join(" L")}" stroke="${farbe}" stroke-width="${dicke}" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="M${unter.map((p) => P(pr(...p))).join(" L")}" stroke="${farbe}" stroke-width="${dicke * 1.3}" fill="none"/>`;
    return g;
  };
  k += traeger(-2.7, "#4e5a64", 0.45);
  /* Gehweg (Unterseite) */
  const g0 = [], g1 = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24; g0.push(W(t, -2.7, deck(t) - 0.5)); g1.push(W(t, 2.7, deck(t) - 0.5)); }
  k += `<path d="${poly([...g0, ...g1.reverse()])}" fill="#3d4850"/>`;
  k += traeger(2.7, "#33414c", 0.62);
  k += `<path d="M${Array.from({ length: 25 }, (_, i) => P(pr(...W(i / 24, 2.7, deck(i / 24) + hoch(i / 24))))).join(" L")}" stroke="#a9bccb" stroke-width=".2" fill="none" transform="translate(0 -.2)" opacity=".7"/>`;
  /* Liebesschlösser am Geländer (Nordhälfte) */
  for (let t = p2 + 0.02; t < 0.97; t += 0.006) { const q = pr(...W(t, 2.7, deck(t) + 0.9)); k += `<circle cx="${r(q[0])}" cy="${r(q[1] + (rnd() - 0.5) * 0.3)}" r=".16" fill="${["#d9443a", "#e8c13a", "#c9ccd0", "#3f7fd0", "#e47fb0"][Math.floor(rnd() * 5)]}"/>`; }
  STEGM.schloss = pr(...W((p2 + 0.97) / 2, 2.7, deck((p2 + 0.97) / 2) + 0.9));
  /* Treppen- und Aufzugtürme an beiden Enden */
  for (const [t, dq] of [[0, -1], [1, 1]]) {
    const c = W(t, 6.5, 0);
    k += turmSeiten(rechteck(c[0], c[1] + dq * 3, 3.2, 3.2), 0, 12, S.lg("aufzug", [[0, "#d6e3ea"], [1, "#8ea6b6"]], 0, 0, 1, 0), "#6f8796");
    k += turmSeiten(rechteck(c[0], c[1] + dq * 3, 3.6, 3.6), 12, 12.6, "#33414c", "#252f37");
    k += `<path d="${poly([W(t, -2.7, 6), W(t, 2.7, 6), W(t, 2.7, deck(t)), W(t, -2.7, deck(t))])}" fill="#a87566"/>`;
  }
  STEGM.mitte = pr(...W(0.5, 0, deck(0.5) + 4));
  S.teil({ id: "eisernersteg", de: "der Eiserne Steg", syl: "EI-ser-ne STEG", it: "il Ponte di Ferro", itSyl: "PON-te di FER-ro", en: "Iron Footbridge", x: 0, y: 0, kunst: k,
    tipp: "Der Eiserne Steg ist eine Brücke nur für Fußgänger – es gibt ihn seit 1869.",
    zoom: { x: r(STEGM.schloss[0] - 21), y: r(STEGM.schloss[1] - 9), w: 30, h: 20 },
    unter: [
      { id: "liebesschloss", de: "das Liebesschloss", syl: "LIE-bes-schloss", it: "il lucchetto dell'amore", itSyl: "luc-CHET-to del-la-MO-re", en: "love lock",
        x: STEGM.schloss[0], y: STEGM.schloss[1], kunst: flaeche(-8, -1.2, 16, 2.2, 0.3),
        tipp: "Verliebte hängen ein Schloss an das Geländer und werfen den Schlüssel in den Main." },
    ] });
}

/* =====================================================================
   11 — DAS SCHIFF (Mainrundfahrt, fährt flussabwärts nach Westen)
   ===================================================================== */
{
  const c = [40, 40], L = 44, Bq = 8.4;
  const ax = [-0.995, -0.1], qv = [ax[1], -ax[0]];   /* qv zeigt nach Süden (zu uns) */
  const W = (u, q, z) => [c[0] + ax[0] * u + qv[0] * q, c[1] + ax[1] * u + qv[1] * q, z];
  const box = (u0, u1, q0, q1, z0, z1, fs, fh, fn) => {
    /* sichtbar: Südseite (q = q1) und Heck (u = u0, Osten) */
    let g = `<path d="${poly([W(u0, q1, z0), W(u1, q1, z0), W(u1, q1, z1), W(u0, q1, z1)])}" fill="${fs}"/>`;
    g += `<path d="${poly([W(u0, q0, z0), W(u0, q1, z0), W(u0, q1, z1), W(u0, q0, z1)])}" fill="${fh}"/>`;
    g += `<path d="${poly([W(u0, q0, z1), W(u1, q0, z1), W(u1, q1, z1), W(u0, q1, z1)])}" fill="#e9edef"/>`;
    if (fn) g += fn((u, z) => pr(...W(u, q1, z)));
    return g;
  };
  let k = "";
  /* Bugwelle vorn (Westen) und Kielwasser hinten */
  k += `<path d="${linie([W(L / 2 + 1, Bq / 2 + 1, 0), W(L / 2 - 6, Bq / 2 + 3, 0), W(L / 2 - 14, Bq / 2 + 5, 0)])}" stroke="#f2f8fa" stroke-width=".5" fill="none" opacity=".85"/>`;
  k += `<path d="${linie([W(-L / 2, -1, 0), W(-L / 2 - 12, -2.6, 0), W(-L / 2 - 30, -3.4, 0)])}" stroke="#e6f0f2" stroke-width=".6" fill="none" opacity=".7"/>`;
  k += `<path d="${linie([W(-L / 2, Bq / 2, 0), W(-L / 2 - 14, Bq / 2 + 2, 0), W(-L / 2 - 34, Bq / 2 + 4, 0)])}" stroke="#e6f0f2" stroke-width=".4" fill="none" opacity=".6"/>`;
  /* Rumpf: unten dunkelblau, oben weiß, spitzer Bug */
  const bug = pr(...W(L / 2 + 2.6, 0, 2.4)), bugU = pr(...W(L / 2 + 1.2, 0, 0.2));
  k += box(-L / 2, L / 2, -Bq / 2, Bq / 2, 0, 1.2, "#1e3e70", "#183462");
  k += box(-L / 2, L / 2, -Bq / 2, Bq / 2, 1.2, 2.4, "#f4f6f7", "#d9dfe3");
  const s1 = pr(...W(L / 2, Bq / 2, 0)), s2 = pr(...W(L / 2, Bq / 2, 2.4));
  k += `<path d="M${P(s1)} L${P(bugU)} L${P(bug)} L${P(s2)} Z" fill="#eef1f3"/>`;
  k += `<path d="${linie([W(-L / 2, Bq / 2, 1.3), W(L / 2, Bq / 2, 1.3)])}" stroke="#c9302c" stroke-width=".3"/>`;
  /* Salondeck mit Panoramafenstern */
  k += box(-L / 2 + 2, L / 2 - 3, -Bq / 2 + 0.4, Bq / 2 - 0.4, 2.4, 5, "#f7f8f8", "#dfe4e7", (at) => {
    let g = "";
    for (let u = -L / 2 + 3; u < L / 2 - 4; u += 2.6) { const a = at(u, 2.9), b = at(u + 2, 4.6); g += `<rect x="${r(a[0])}" y="${r(b[1])}" width="${r(Math.abs(b[0] - a[0]))}" height="${r(a[1] - b[1])}" fill="${S.lg("salon", [[0, "#8aa7bb"], [1, "#384f63"]])}"/>`; }
    return g;
  });
  /* Sonnendeck: Reling, Fahrgäste, Steuerhaus vorn, Fahne hinten */
  k += `<path d="${linie([W(-L / 2 + 2, Bq / 2 - 0.4, 6), W(L / 2 - 3, Bq / 2 - 0.4, 6)])}" stroke="#a7b0b6" stroke-width=".22"/>`;
  for (let u = -L / 2 + 4; u < L / 2 - 10; u += 3.4) { const p = pr(...W(u, 0, 5)), s = mass(...W(u, 0, 5).slice(0, 2)); const f = ["#b8473a", "#2f5f95", "#d8ad3a", "#4f8a46", "#eeefec", "#d98aa6"][Math.floor(rnd() * 6)]; k += `<rect x="${r(p[0] - 0.22 * s)}" y="${r(p[1] - 1.05 * s)}" width="${r(0.44 * s)}" height="${r(0.6 * s)}" rx="${r(0.15 * s)}" fill="${f}"/><circle cx="${r(p[0])}" cy="${r(p[1] - 1.25 * s)}" r="${r(0.14 * s)}" fill="#d9a07a"/>`; }
  k += box(L / 2 - 9, L / 2 - 4, -2.4, 2.4, 5, 7.6, "#fbfcfc", "#e0e5e8", (at) => { const a = at(L / 2 - 8.6, 6.1), b = at(L / 2 - 4.4, 7.2); return `<rect x="${r(Math.min(a[0], b[0]))}" y="${r(b[1])}" width="${r(Math.abs(b[0] - a[0]))}" height="${r(a[1] - b[1])}" fill="#2e4658"/>`; });
  const fs = pr(...W(-L / 2 + 0.5, 0, 5)), ft = pr(...W(-L / 2 + 0.5, 0, 9));
  k += `<path d="M${P(fs)} L${P(ft)}" stroke="#8a8f94" stroke-width=".22"/><path d="M${P(ft)} l2.2 .2 l0 .9 l-2.2 -.2 Z" fill="#d7262b"/><path d="M${r(ft[0])} ${r(ft[1] + 0.9)} l2.2 .2 l0 .9 l-2.2 -.2 Z" fill="#fbfbf8"/>`;
  /* Spiegelung des Schiffs */
  const sp0 = pr(...W(-L / 2, Bq / 2, 0)), sp1 = pr(...W(L / 2, Bq / 2, 0));
  for (let i = 0; i < 6; i++) k += `<rect x="${r(sp0[0] + (rnd() - 0.5))}" y="${r(sp0[1] + 0.6 + i * 0.55)}" width="${r(sp1[0] - sp0[0])}" height=".3" fill="${i < 3 ? "#f0f3f4" : "#1e3e70"}" opacity="${r(0.45 - i * 0.06)}"/>`;
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "il battello", itSyl: "bat-TEL-lo", en: "boat", x: 0, y: 0, kunst: k,
    tipp: "Mit dem Schiff macht man eine Rundfahrt auf dem Main." });
}

/* =====================================================================
   12 — DER SCHWAN (zwei Höckerschwäne nahe am Ufer)
   ===================================================================== */
{
  const schwan = (wx, wy, sp) => {
    const p = pr(wx, wy, 0), s = mass(wx, wy) * 1.2;
    const X = (u) => r(p[0] + u * s * sp), Y = (v) => r(p[1] - v * s);
    const Q = (u, v) => `${X(u)} ${Y(v)}`;
    /* Spiegelung: zerfaserte helle Streifen direkt unter dem Körper */
    let g = "";
    for (let i = 0; i < 5; i++) g += `<rect x="${X(-0.55 + i * 0.04)}" y="${r(p[1] + 0.08 * s + i * 0.07 * s)}" width="${r((1.0 - i * 0.12) * s)}" height="${r(0.035 * s)}" fill="#f2f6f7" opacity="${r(0.5 - i * 0.08)}" transform="${sp < 0 ? `translate(${r(-(1.0 - i * 0.12) * s)} 0)` : ""}"/>`;
    g += `<path d="M${Q(-0.62, 0)} Q${Q(0, -0.05)} ${Q(0.55, 0)}" stroke="#1f343a" stroke-width="${r(0.04 * s)}" fill="none" opacity=".35"/>`;
    /* Körper: Schwanz leicht angehoben, Brust vorn, unten Schatten */
    g += `<path d="M${Q(-0.72, 0.26)} Q${Q(-0.5, 0.42)} ${Q(-0.15, 0.44)} Q${Q(0.35, 0.46)} ${Q(0.56, 0.28)} Q${Q(0.6, 0.08)} ${Q(0.46, 0)} L${Q(-0.52, 0)} Q${Q(-0.66, 0.08)} ${Q(-0.72, 0.26)} Z" fill="${S.lg("feder", [[0, "#ffffff"], [0.6, "#eef2f3"], [1, "#b3c0c5"]])}"/>`;
    /* angehobene Flügel mit Federstaffelung */
    g += `<path d="M${Q(-0.5, 0.36)} Q${Q(-0.42, 0.66)} ${Q(-0.08, 0.64)} Q${Q(0.24, 0.62)} ${Q(0.34, 0.44)} Q${Q(0, 0.4)} ${Q(-0.5, 0.36)} Z" fill="#fdfefe"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${Q(-0.46 + i * 0.13, 0.4 + i * 0.012)} q${r(0.06 * s * sp)} ${r(0.07 * s)} ${r(0.13 * s * sp)} ${r(0.05 * s)}" stroke="#c4cfd3" stroke-width="${r(0.022 * s)}" fill="none"/>`;
    g += `<path d="M${Q(-0.5, 0.36)} Q${Q(0, 0.39)} ${Q(0.34, 0.44)}" stroke="#d3dcdf" stroke-width="${r(0.025 * s)}" fill="none"/>`;
    /* Hals als S-Kurve (unten dicker), Kopf, oranger Schnabel mit schwarzem Höcker und Maske */
    const hals = `M${Q(0.42, 0.34)} C${Q(0.62, 0.6)} ${Q(0.36, 0.82)} ${Q(0.5, 1.0)} Q${Q(0.55, 1.06)} ${Q(0.62, 1.05)}`;
    g += `<path d="${hals}" stroke="#e3e9eb" stroke-width="${r(0.13 * s)}" fill="none" stroke-linecap="round"/><path d="${hals}" stroke="#fbfcfc" stroke-width="${r(0.09 * s)}" fill="none" stroke-linecap="round"/>`;
    g += `<ellipse cx="${X(0.6)}" cy="${Y(1.04)}" rx="${r(0.1 * s)}" ry="${r(0.065 * s)}" fill="#fbfcfc"/>`;
    g += `<path d="M${Q(0.66, 1.07)} L${Q(0.86, 0.99)} L${Q(0.66, 1.0)} Z" fill="#e0782e"/>`;
    g += `<circle cx="${X(0.675)}" cy="${Y(1.075)}" r="${r(0.028 * s)}" fill="#1d1d1d"/><path d="M${Q(0.59, 1.05)} L${Q(0.67, 1.07)} L${Q(0.67, 1.0)} Z" fill="#1d1d1d"/>`;
    return g;
  };
  const k = schwan(250.5, -45.4, 1) + schwan(242, -42.6, -1);
  S.teil({ oben: true, id: "schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x: 0, y: 0, kunst: k,
    tipp: "Auf dem Main schwimmen viele Höckerschwäne – man erkennt sie am schwarzen Höcker auf dem Schnabel." });
}

/* =====================================================================
   13 — DAS MAINUFER (unsere Promenade, Ufermauer, Straße, Gründerzeithäuser)
   ===================================================================== */
const PROM = 2.2;
const HUT = { c: [268.4, -68.4], w: 3.6, d: 2.6 };
const GARTEN_TISCHE = [[262.6, -66.6], [253.5, -67.6]];
const KELLNER = (() => { const th = -95.5 * Math.PI / 180, d = 9; return [CAM[0] + Math.sin(th) * d, CAM[1] + Math.cos(th) * d]; })();
{
  let k = "";
  const xs = [330, 300, 280, 260, 240, 200, 170, 120, 60, 0, -120, -245, -330, -420];
  const kante = xs.map((x) => [x, anX(SUED, x), PROM]);
  const mauer = xs.map((x) => [x, anX(SUED, x) - 15, PROM]);
  /* Häuserzeile am Sachsenhäuser Ufer (Gründerzeit, Mansarddächer) */
  for (let x = -430; x < -140; x += 14) {
    const y = anX(SUED, x + 7) - 44, h = 17 + rnd() * 4;
    const f = ["#efe2c8", "#e6d6c0", "#f2ece0", "#dccbb0", "#e9dccb"][Math.floor(rnd() * 5)];
    k += turmSeiten([[x, y - 12], [x + 14, y - 12], [x + 14, y], [x, y]], 6.5, 6.5 + h, f, "#a8a090", (sd) => {
      return sd.sonne > -0.2 ? `<path d="M${P(sd.at(0.05, 8))} L${P(sd.at(0.95, 8))} L${P(sd.at(0.95, 6.5 + h - 1))} L${P(sd.at(0.05, 6.5 + h - 1))} Z" fill="url(#ffm_fenster)"/>` : "";
    });
    k += `<path d="${poly([[x, y, 6.5 + h], [x + 14, y, 6.5 + h], [x + 14, y - 3, 6.5 + h + 5], [x, y - 3, 6.5 + h + 5]])}" fill="#6c6670"/>`;
  }
  /* Straße mit parkenden Autos, Platanen am Straßenrand, Hecke */
  k += `<path d="${poly([...mauer.map(([x, y]) => [x, y, 6.5]), ...mauer.slice().reverse().map(([x, y]) => [x, y - 22, 6.5])])}" fill="#8d8c88"/>`;
  for (let x = -430; x < 140; x += 14) {
    const y = anX(SUED, x) - 16.5, f = pr(x, y, 6.5), s = mass(x, y);
    if (f[0] + 7 * s < 22 || f[0] > 340 || tief(x, y) < 5) continue;
    k += platane(f[0], f[1], s * 0.9, 15 * s, 13 * s, "#b9cfe2", 5);
  }
  k += `<path d="${poly([...mauer.map(([x, y]) => [x, y + 0.2, 6.5]), ...mauer.slice().reverse().map(([x, y]) => [x, y - 1, 7.4])])}" fill="#5f7a44"/>`;
  /* Ufermauer zur Straße (Sandstein), Boden der Promenade */
  k += `<path d="${poly([...mauer.map(([x, y]) => [x, y, PROM]), ...mauer.slice().reverse().map(([x, y]) => [x, y, 6.5])])}" fill="${S.lg("ufermauer", [[0, "#c9a08f"], [1, "#a77d6c"]])}"/>`;
  k += `<path d="${poly([...mauer.map(([x, y]) => [x, y, PROM]), ...mauer.slice().reverse().map(([x, y]) => [x, y, 6.5])])}" fill="${QUADER}"/>`;
  const boden = poly([...kante, ...mauer.slice().reverse()]);
  k += `<path d="${boden}" fill="${S.lg("pflaster", [[0, "#cbc2b2"], [0.45, "#b9ae9c"], [1, "#a39785"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${HOR}" x2="0" y2="200"`)}"/>`;
  /* Fugen der Granitplatten: längs zum Fluss und quer */
  { let fu = ""; for (let q = 0.6; q < 15; q += 1.6) fu += linie(xs.filter((x, i) => i % 2 === 0 || x > 200).map((x) => [x, anX(SUED, x) - q, PROM])) + " ";
    for (let x = -240; x < 300; x += x > 240 ? 1.6 : x > 120 ? 5 : 12) fu += linie([[x, anX(SUED, x), PROM], [x, anX(SUED, x) - 15, PROM]]) + " ";
    k += `<path d="${fu.replace(/M0 0 ?/g, "")}" stroke="#8d8270" stroke-width=".22" opacity=".52" fill="none"/>`; }
  /* Lange Schatten der Mauer und der Straßenbäume auf dem Pflaster */
  for (let x = -200; x < 150; x += 12) {
    const y = anX(SUED, x) - 16.5, [sx, sy] = SCH(x, y, 10);
    k += `<path d="${poly([[x - 3, y + 1, PROM], [x + 3, y + 1, PROM], [Math.min(sx + 4, x + 30), Math.min(sy, anX(SUED, x) - 0.5), PROM], [Math.min(sx - 4, x + 22), Math.min(sy, anX(SUED, x) - 0.5), PROM]])}" fill="#3a3024" opacity=".14"/>`;
  }
  /* über uns: die Krone eines Baums im Apfelweingarten (Stamm links außerhalb des Bilds) */
  {
    k += `<path d="M-1 46 L8 30 L22 16 L26 18 L12 32 L1 50 Z" fill="#5a4a38"/><path d="M14 26 L34 10 L36 12 L18 28 Z" fill="#5a4a38"/>`;
    k += lappen(16, 4, 36, "#33482a", 12);
    for (const [lx, ly, lr, f] of [[4, 18, 9, 0], [20, 24, 8, 1], [36, 14, 9, 0], [48, 6, 7, 1], [10, 4, 10, 0], [28, 2, 9, 2], [42, 22, 6, 1], [2, 30, 6, 1], [30, 22, 5, 0], [14, 14, 6, 2]]) {
      const zw = lappen(lx, ly, lr, LAUB, 10);
      k += zw;
      if (f) k += zw.replace(LAUB, f === 2 ? "#d2b54a" : "#cfe08e").replace("/>", ` opacity="${f === 2 ? 0.55 : 0.3}"/>`);
    }
    for (const [lx, ly] of [[30, 16], [44, 12], [16, 12]]) k += lappen(lx, ly, 1.2, "#b9cfe2", 5);
  }
  /* Schatten der Ausschankhütte, der Gartentische und des Kellners (gehören zum Boden, nicht zu den Dingen) */
  {
    const { c, w, d } = HUT;
    const sh = [[c[0] - w / 2, c[1] + d / 2], [c[0] + w / 2, c[1] + d / 2], [c[0] + w / 2, c[1] - d / 2]].map(([x, y]) => [...SCH(x, y, 3), PROM]);
    k += `<path d="${poly([[c[0] - w / 2, c[1] + d / 2, PROM], [c[0] + w / 2, c[1] - d / 2, PROM], sh[2], sh[1], sh[0]])}" fill="#2e2418" opacity=".2"/>`;
    for (const [gx, gy] of GARTEN_TISCHE) { const a = SCH(gx - 1.1, gy, 0.75), b = SCH(gx + 1.1, gy, 0.75); k += `<path d="${poly([[gx - 1.1, gy - 0.3, PROM], [gx + 1.1, gy - 0.3, PROM], [b[0], b[1] - 0.3, PROM], [a[0], a[1] - 0.3, PROM]])}" fill="#2e2418" opacity=".18"/>`; }
    const [wx, wy] = KELLNER, s2 = mass(wx, wy), sh2 = SCH(wx, wy, 1.78), a = pr(wx, wy, PROM), b = pr(sh2[0], sh2[1], PROM);
    k += `<path d="M${r(a[0] - 0.25 * s2)} ${r(a[1])} L${r(b[0] - 0.12 * s2)} ${r(b[1])} L${r(b[0] + 0.25 * s2)} ${r(b[1] + 0.1 * s2)} L${r(a[0] + 0.25 * s2)} ${r(a[1])} Z" fill="#2e2418" opacity=".25"/>`;
  }
  /* Steinkante am Wasser */
  k += `<path d="${linie(kante.map(([x, y]) => [x, y - 0.3, PROM]))}" stroke="#e1d5c0" stroke-width="1" fill="none"/>`;
  S.teil({ id: "mainufer", de: "das Mainufer", syl: "MAIN-u-fer", it: "la riva del Meno", itSyl: "RI-va del ME-no", en: "Main riverbank", x: 0, y: 0, kunst: k,
    tipp: "Am Mainufer gehen die Frankfurter spazieren, joggen, fahren Rad und trinken Apfelwein." });
}

/* =====================================================================
   14 — DAS GELÄNDER (Eisengeländer an der Kaikante, dunkelgrün)
   ===================================================================== */
{
  let k = "";
  const xs = [];
  for (let x = 300; x > -245; x -= (x > 220 ? 2.5 : x > 100 ? 5 : 10)) xs.push(x);
  const R = (x, z) => [x, anX(SUED, x) - 0.4, z];
  const EISEN = "#24382c";
  k += `<path d="${linie(xs.map((x) => R(x, PROM + 1.1)))}" stroke="${EISEN}" stroke-width="1" fill="none"/>`;
  k += `<path d="${linie(xs.map((x) => R(x, PROM + 1.14)))}" stroke="#6f8a74" stroke-width=".3" fill="none"/>`;
  k += `<path d="${linie(xs.map((x) => R(x, PROM + 0.55)))}" stroke="${EISEN}" stroke-width=".5" fill="none"/>`;
  k += `<path d="${linie(xs.map((x) => R(x, PROM + 0.12)))}" stroke="${EISEN}" stroke-width=".45" fill="none"/>`;
  const bucket = {};
  for (const x of xs) {
    const a = pr(...R(x, PROM)), b = pr(...R(x, PROM + 1.15)), s = mass(x, anX(SUED, x));
    if (a[0] > 322) continue;
    const w = r(Math.max(0.2, 0.07 * s)); bucket[w] = (bucket[w] || "") + `M${P(a)} L${P(b)} `;
    if (s > 6) k += `<circle cx="${r(b[0])}" cy="${r(b[1])}" r="${r(0.06 * s)}" fill="${EISEN}"/>`;
  }
  for (const w in bucket) k += `<path d="${bucket[w]}" stroke="${EISEN}" stroke-width="${w}"/>`;
  /* senkrechte Stäbe nur vorn (hinten verschwimmen sie) */
  { let st = ""; for (let x = 300; x > 230; x -= 0.9) { const a = pr(...R(x, PROM + 0.12)), b = pr(...R(x, PROM + 0.55)); if (a[0] < 322) st += `M${P(a)} L${P(b)} `; } k += `<path d="${st}" stroke="${EISEN}" stroke-width=".18" opacity=".8"/>`; }
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 0, kunst: k,
    tipp: "Das Geländer schützt: Die Kaimauer ist hoch, und das Wasser ist tief." });
}

/* =====================================================================
   15 — DIE BANK (Parkbank am Geländer, Blick auf den Fluss)
   ===================================================================== */
const BANK_K = (() => {
  const c = [266.5, -63.6], L = 1.9;
  const W = (u, q, z) => [c[0] + u, c[1] + q, z];
  let k = "";
  const sh = (u) => SCH(c[0] + u, c[1] + 0.2, 0.85);
  k += `<path d="${poly([W(-L / 2, 0.25, PROM), W(L / 2, 0.25, PROM), [...sh(L / 2), PROM], [...sh(-L / 2), PROM]])}" fill="#2e2418" opacity=".22"/>`;
  for (const u of [-L / 2 + 0.15, L / 2 - 0.15]) k += `<path d="${linie([W(u, -0.2, PROM), W(u, -0.2, PROM + 0.45), W(u, -0.25, PROM + 0.9)])}" stroke="#2f3532" stroke-width="1.2" fill="none"/><path d="${linie([W(u, 0.25, PROM), W(u, 0.25, PROM + 0.45)])}" stroke="#2f3532" stroke-width="1.2"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="${poly([W(-L / 2, -0.25 + i * 0.13, PROM + 0.45), W(L / 2, -0.25 + i * 0.13, PROM + 0.45), W(L / 2, -0.15 + i * 0.13, PROM + 0.45), W(-L / 2, -0.15 + i * 0.13, PROM + 0.45)])}" fill="${i % 2 ? "#8a6038" : "#9a6d42"}"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="${poly([W(-L / 2, -0.25, PROM + 0.55 + i * 0.13), W(L / 2, -0.25, PROM + 0.55 + i * 0.13), W(L / 2, -0.25, PROM + 0.64 + i * 0.13), W(-L / 2, -0.25, PROM + 0.64 + i * 0.13)])}" fill="${i % 2 ? "#7a5532" : "#946840"}"/>`;
  return k;
})();

/* =====================================================================
   16 — DIE APFELWEINWIRTSCHAFT (Ausschank am Ufer, Gartengarnituren, der grüne Kranz)
   ===================================================================== */
{
  const c = HUT.c, w = HUT.w, d = HUT.d;
  let k = "";
  /* zwei lange Gartentische mit Bänken zwischen Hütte und Geländer, dazu die Bank am Geländer */
  const kiste = (x0, x1, y0, y1, z0, z1, f1, f2) => turmSeiten([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, f1, f2) + `<path d="${poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])}" fill="${f1}"/>`;
  const HELL = "#b98a57", DUNK = "#7a5228", BEIN = "#4a3018";
  const garnitur = (gx, gy) => {
    let g = "";
    const bein = (x, y, z1) => kiste(x - 0.025, x + 0.025, y - 0.025, y + 0.025, PROM, z1, "#6a6f72", "#3e4346");
    const bank = (dy) => { let b = ""; for (const dx of [-0.85, 0.85]) for (const e of [-0.08, 0.08]) b += bein(gx + dx, gy + dy + e, PROM + 0.42); return b + kiste(gx - 1.1, gx + 1.1, gy + dy - 0.13, gy + dy + 0.13, PROM + 0.42, PROM + 0.46, "#a8763f", DUNK); };
    g += bank(0.62);
    for (const dx of [-0.85, 0.85]) for (const e of [-0.2, 0.2]) g += bein(gx + dx, gy + e, PROM + 0.72);
    g += kiste(gx - 1.1, gx + 1.1, gy - 0.3, gy + 0.3, PROM + 0.72, PROM + 0.76, HELL, DUNK);
    g += bank(-0.62);
    return g;
  };
  k += garnitur(...GARTEN_TISCHE[1]) + garnitur(...GARTEN_TISCHE[0]);
  for (const [u, v] of [[-0.5, 0.05], [0.2, -0.1], [0.6, 0.12]]) { const a = pr(GARTEN_TISCHE[0][0] + u, GARTEN_TISCHE[0][1] + v, PROM + 0.76), s2 = mass(GARTEN_TISCHE[0][0], GARTEN_TISCHE[0][1]); k += `<path d="M${r(a[0] - 0.035 * s2)} ${r(a[1])} L${r(a[0] - 0.038 * s2)} ${r(a[1] - 0.13 * s2)} L${r(a[0] + 0.038 * s2)} ${r(a[1] - 0.13 * s2)} L${r(a[0] + 0.035 * s2)} ${r(a[1])} Z" fill="#efe6c2" opacity=".85"/>`; }
  k += BANK_K;
  const HOLZ = S.lg("hutte", [[0, "#9a6a3e"], [1, "#7a5230"]], 0, 0, 1, 0);
  k += turmSeiten(rechteck(c[0], c[1], w, d), PROM, PROM + 2.5, HOLZ, S.lg("hutte2", [[0, "#7a5230"], [1, "#5e3e22"]], 0, 0, 1, 0), (sd) => {
    let g = "";
    for (let t = 0.1; t < 1; t += 0.1) g += `<path d="M${P(sd.at(t, PROM))} L${P(sd.at(t, PROM + 2.5))}" stroke="#5a3a1f" stroke-width=".2" opacity=".6"/>`;
    /* Ausschankfenster mit Theke; im Regal kleine Bembel mit Henkel */
    g += `<path d="M${P(sd.at(0.15, PROM + 1.05))} L${P(sd.at(0.85, PROM + 1.05))} L${P(sd.at(0.85, PROM + 2.1))} L${P(sd.at(0.15, PROM + 2.1))} Z" fill="#2c2018"/>`;
    g += `<path d="M${P(sd.at(0.17, PROM + 1.5))} L${P(sd.at(0.83, PROM + 1.5))}" stroke="#6b4a2a" stroke-width=".35"/>`;
    for (let i = 0; i < 4; i++) { const p = sd.at(0.26 + i * 0.16, PROM + 1.5); if (p[0] < 1 || p[0] > 319) continue; g += `<path d="M${r(p[0] - 0.45)} ${r(p[1])} Q${r(p[0] - 0.75)} ${r(p[1] - 0.6)} ${r(p[0] - 0.25)} ${r(p[1] - 1)} L${r(p[0] + 0.25)} ${r(p[1] - 1)} Q${r(p[0] + 0.75)} ${r(p[1] - 0.6)} ${r(p[0] + 0.45)} ${r(p[1])} Z" fill="#aeb3b7"/><path d="M${r(p[0] + 0.5)} ${r(p[1] - 0.85)} q.45 .2 .1 .6" stroke="#aeb3b7" stroke-width=".18" fill="none"/><path d="M${r(p[0] - 0.55)} ${r(p[1] - 0.45)} h1.1" stroke="#2c4fa0" stroke-width=".16"/>`; }
    g += `<path d="M${P(sd.at(0.1, PROM + 1.05))} L${P(sd.at(0.9, PROM + 1.05))}" stroke="#c99a66" stroke-width=".8"/>`;
    return g;
  });
  /* Dach aus Holzschindeln */
  const R0 = [c[0] - w / 2 - 0.4, c[1] - d / 2 - 0.5, PROM + 2.5], R1 = [c[0] + w / 2 + 0.4, c[1] - d / 2 - 0.5, PROM + 2.5], R2 = [c[0] + w / 2 + 0.4, c[1] + d / 2 + 0.3, PROM + 3.1], R3 = [c[0] - w / 2 - 0.4, c[1] + d / 2 + 0.3, PROM + 3.1];
  k += `<path d="${poly([R0, R1, R2, R3])}" fill="${S.lg("schindel", [[0, "#6a4526"], [1, "#4e321b"]])}"/>`;
  let sch = "";
  for (let t = 0.12; t < 1; t += 0.12) { const a = R0.map((v, i) => v + (R3[i] - v) * t), b = R1.map((v, i) => v + (R2[i] - v) * t); sch += `M${P(pr(...a))} L${P(pr(...b))} `; }
  k += `<path d="${sch}" stroke="#2e1d0e" stroke-width=".3" opacity=".7"/><path d="${linie([R0, R1])}" stroke="#8a6038" stroke-width=".5"/>`;
  /* Wirtshausschild: grünes Brett mit gemaltem Bembel und Glas */
  const xF = c[0] + w / 2 + 0.05;
  k += `<path d="${poly([[xF, c[1] - 1.2, PROM + 2.6], [xF, c[1] + 1.2, PROM + 2.6], [xF, c[1] + 1.2, PROM + 3.3], [xF, c[1] - 1.2, PROM + 3.3]])}" fill="#1f3d2a"/>`;
  {
    const B = (u, v) => [xF + 0.01, c[1] - 0.45 + u, PROM + 2.95 + v];
    const bem = [[-0.16, -0.25], [-0.22, -0.05], [-0.14, 0.12], [-0.08, 0.17], [-0.09, 0.24], [0.09, 0.24], [0.08, 0.17], [0.14, 0.12], [0.22, -0.05], [0.16, -0.25]].map(([u, v]) => B(u, v));
    k += `<path d="${poly(bem)}" fill="#e9dcae"/><path d="${linie([B(0.18, 0.12), B(0.32, 0.06), B(0.3, -0.1), B(0.2, -0.14)])}" stroke="#e9dcae" stroke-width=".3" fill="none"/>`;
    k += `<path d="${poly([B(0.5, -0.25), B(0.66, -0.25), B(0.68, 0.12), B(0.48, 0.12)])}" fill="#e9dcae"/><path d="${poly([B(0.51, -0.2), B(0.65, -0.2), B(0.66, 0.02), B(0.5, 0.02)])}" fill="#d9b24a"/>`;
    k += `<path d="${poly([[xF, c[1] - 1.2, PROM + 2.6], [xF, c[1] + 1.2, PROM + 2.6], [xF, c[1] + 1.2, PROM + 3.3], [xF, c[1] - 1.2, PROM + 3.3]])}" fill="none" stroke="#c9a44a" stroke-width=".25"/>`;
  }
  /* der grüne Kranz aus Fichtenzweigen am Ausleger: dicht, Zweigspitzen nach außen, rot-weiße Bänder */
  const kz = pr(c[0] + w / 2 + 0.62, c[1] + d / 2 + 0.28, PROM + 2.05), ks = mass(c[0] + w / 2, c[1] + d / 2);
  const ka = pr(c[0] + w / 2, c[1] + d / 2, PROM + 2.55), kb2 = pr(c[0] + w / 2 + 0.7, c[1] + d / 2 + 0.3, PROM + 2.55);
  k += `<path d="M${P(ka)} L${P(kb2)}" stroke="#3a2a1a" stroke-width="${r(0.06 * ks)}"/>`;
  k += `<path d="M${r(kb2[0] - 0.2 * ks)} ${r(kb2[1])} L${r(kz[0] - 0.12 * ks)} ${r(kz[1] - 0.2 * ks)} M${r(kb2[0] + 0.05 * ks)} ${r(kb2[1])} L${r(kz[0] + 0.12 * ks)} ${r(kz[1] - 0.2 * ks)}" stroke="#6b5a40" stroke-width=".15"/>`;
  {
    const R = 0.23 * ks, zz = zufall(4242);
    k += `<ellipse cx="${r(kz[0])}" cy="${r(kz[1])}" rx="${r(R)}" ry="${r(R * 0.95)}" fill="none" stroke="#1f3a1e" stroke-width="${r(0.13 * ks)}"/>`;
    for (const [dr, f, sw, da] of [[0.05, "#2f5a2c", 0.05, "0.4 0.25"], [-0.04, "#3f6e36", 0.045, "0.3 0.3"], [0.0, "#5f8f4c", 0.03, "0.15 0.35"], [0.06, "#6fa05a", 0.02, "0.1 0.5"]])
      k += `<ellipse cx="${r(kz[0])}" cy="${r(kz[1])}" rx="${r(R + dr * ks)}" ry="${r((R + dr * ks) * 0.95)}" fill="none" stroke="${f}" stroke-width="${r(sw * ks)}" stroke-dasharray="${da.split(" ").map((v) => r(+v * ks * 0.2)).join(" ")}" stroke-linecap="round"/>`;
    let z1 = "", z2 = "", z3 = "";
    for (let i = 0; i < 80; i++) {
      const a = i / 80 * Math.PI * 2 + zz() * 0.1, rr = R + (zz() - 0.5) * 0.12 * ks, x0 = kz[0] + Math.cos(a) * rr, y0 = kz[1] + Math.sin(a) * rr * 0.95;
      const aus = (zz() < 0.5 ? 1 : -1) * (0.03 + zz() * 0.035) * ks, wi = a + (zz() - 0.5) * 0.9;
      const seg = `M${r(x0)} ${r(y0)} l${r(Math.cos(wi) * aus)} ${r(Math.sin(wi) * aus)} `;
      if (i % 3 === 0) z1 += seg; else if (i % 3 === 1) z2 += seg; else z3 += seg;
    }
    k += `<path d="${z1}" stroke="#24461f" stroke-width="${r(0.014 * ks)}" stroke-linecap="round"/><path d="${z2}" stroke="#35602e" stroke-width="${r(0.012 * ks)}" stroke-linecap="round"/><path d="${z3}" stroke="#7fae64" stroke-width="${r(0.009 * ks)}" stroke-linecap="round"/>`;
    const bx = kz[0], by = kz[1] + R * 0.95;
    k += `<path d="M${r(bx)} ${r(by)} l${r(-0.1 * ks)} ${r(-0.05 * ks)} l0 ${r(0.1 * ks)} Z M${r(bx)} ${r(by)} l${r(0.1 * ks)} ${r(-0.05 * ks)} l0 ${r(0.1 * ks)} Z" fill="#c62d2a"/><path d="M${r(bx - 0.02 * ks)} ${r(by)} q${r(-0.04 * ks)} ${r(0.08 * ks)} ${r(-0.02 * ks)} ${r(0.16 * ks)} M${r(bx + 0.02 * ks)} ${r(by)} q${r(0.04 * ks)} ${r(0.08 * ks)} ${r(0.02 * ks)} ${r(0.16 * ks)}" stroke="#f4f1ea" stroke-width="${r(0.03 * ks)}" fill="none"/>`;
  }
  S.teil({ id: "wirtschaft", de: "die Apfelweinwirtschaft", syl: "AP-fel-wein-wirt-schaft", it: "l'osteria del sidro", itSyl: "o-ste-RI-a del SI-dro", en: "cider tavern", x: 0, y: 0, kunst: k,
    tipp: "In der Apfelweinwirtschaft sitzt man an langen Tischen und trinkt Apfelwein aus dem Bembel.",
    zoom: { x: r(Math.max(0, kz[0] - 18)), y: r(kz[1] - 12), w: 36, h: 24 },
    unter: [
      { id: "kranz", de: "der Kranz", syl: "KRANZ", it: "la ghirlanda", itSyl: "ghir-LAN-da", en: "wreath",
        x: kz[0], y: kz[1], kunst: flaeche(-0.34 * ks, -0.32 * ks, 0.68 * ks, 0.62 * ks, 0.4),
        tipp: "Hängt ein grüner Kranz aus Fichtenzweigen draußen, gibt es hier selbst gekelterten Apfelwein." },
    ] });
}

/* =====================================================================
   18 — DER KELLNER (bringt den Bembel aus der Wirtschaft an den Tisch)
   ===================================================================== */
{
  const [wx, wy] = KELLNER;
  const f = pr(wx, wy, PROM), s = mass(wx, wy);
  const m = B.mensch({ id: "ffm_kellner", geschlecht: "m", pose: "gehen", blick: 62, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "kellnerhemd" }, schuerze: { stueck: "schuerze", farbe: "#2c4a7a" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.78 * s);
  const hand = m.z.handR.y > m.z.handL.y ? m.z.handR : m.z.handL;
  const hx = hand.x * m.k, hy = hand.y * m.k, q = 0.28 * s;
  /* Bembel am Henkel getragen: bauchig, graues Steinzeug, blaue Bemalung */
  const bem = `<g transform="translate(${r(hx + 0.12 * q)} ${r(hy + 0.08 * q)}) scale(${r(q / 23)})"><path d="M2 0 Q11 -1 9 8" stroke="#a9adb0" stroke-width="1.6" fill="none"/><path d="M-5 25 Q-9 18 -7.6 12 Q-6.6 7 -3.4 5.6 L-3 2.4 Q-3.2 .8 -4 .2 L4 .2 Q3.2 .8 3 2.4 L3.4 5.6 Q6.6 7 7.6 12 Q9 18 5 25 Z" fill="${S.lg("bemk", [[0, "#d8dcdf"], [0.6, "#a9adb0"], [1, "#7c8186"]], 0, 0, 1, 0)}"/><path d="M-7.4 12 Q0 13.6 7.4 12 M-6.8 19 Q0 20.4 6.8 19" stroke="#2c4fa0" stroke-width=".8" fill="none"/><path d="M-4.6 15.6 q1.4 -2 2.8 0 q1.4 2 2.8 0 q1.4 -2 2.8 0" stroke="#2c4fa0" stroke-width=".7" fill="none"/></g>`;
  const sh = SCH(wx, wy, 1.78), a = pr(wx, wy, PROM), b = pr(sh[0], sh[1], PROM);
  const schattenK = `<path d="M${r(a[0] - 0.25 * s)} ${r(a[1])} L${r(b[0] - 0.12 * s)} ${r(b[1])} L${r(b[0] + 0.25 * s)} ${r(b[1] + 0.1 * s)} L${r(a[0] + 0.25 * s)} ${r(a[1])} Z" fill="#2e2418" opacity=".25"/>`;
  S.teil({ id: "kellner", de: "der Kellner", syl: "KELL-ner", it: "il cameriere", itSyl: "ca-me-RIE-re", en: "waiter", x: r(f[0]), y: r(f[1]),
    kunst: rundeFigurFein(m.svg) + bem,
    tipp: "Der Kellner bringt den Apfelwein im Bembel an den Tisch." });
}

/* =====================================================================
   19 — DER TISCH (langer Holztisch im Apfelweingarten) und das Essen
   ===================================================================== */
const TC = [CAM[0] + FV[0] * 1.5, CAM[1] + FV[1] * 1.5], TZ = PROM + 0.75;
const T = (u, v, z = TZ) => [TC[0] + RV[0] * u + FV[0] * v, TC[1] + RV[1] * u + FV[1] * v, z];   /* u nach rechts, v nach hinten (Meter) */
const TP = (u, v, z = TZ) => pr(...T(u, v, z));
const TS = (v) => FOC / (1.5 + v);
/* Ding auf dem Tisch: Fußpunkt, Maßstab und Schlagschatten nach rechts vorn */
const aufTisch = (u, v) => ({ p: TP(u, v), s: TS(v) });
const tischSchatten = (u, v, h, breit) => {
  const [sx, sy] = SCH(...T(u, v).slice(0, 2), h), a = TP(u, v), b = pr(sx, sy, TZ), s = TS(v);
  return `<path d="M${r(a[0] - breit * s / 2)} ${r(a[1])} L${r(b[0] - breit * s / 2.5)} ${r(b[1])} L${r(b[0] + breit * s / 2.5)} ${r(b[1] + 0.02 * s)} L${r(a[0] + breit * s / 2)} ${r(a[1] + 0.01 * s)} Z" fill="#3a2410" opacity=".28" filter="url(#${S.id("weich2")})"/>`;
};
{
  let k = "";
  const L = 2.2, D = 0.4;
  k += `<path d="${poly([T(-L, -D), T(L, -D), T(L, D), T(-L, D)])}" fill="${S.lg("tischholz", [[0, "#b98a57"], [0.5, "#a67745"], [1, "#8f6239"]], 0, 0, 0, 1)}"/>`;
  /* Bretter längs, Maserung, Kante */
  for (let i = 1; i < 5; i++) { const v = -D + i * 2 * D / 5; k += `<path d="${linie([T(-L, v), T(L, v)])}" stroke="#6e4826" stroke-width=".45" opacity=".55"/>`; }
  for (let i = 0; i < 30; i++) { const u = -L + rnd() * 2 * L, v = -D + rnd() * 2 * D, a = TP(u, v), b = TP(u + 0.08 + rnd() * 0.12, v); k += `<path d="M${P(a)} Q${r((a[0] + b[0]) / 2)} ${r(a[1] - 0.4)} ${P(b)}" stroke="#c99a66" stroke-width=".3" fill="none" opacity=".5"/>`; }
  k += `<path d="${linie([T(-L, D), T(L, D)])}" stroke="#d6a873" stroke-width=".8"/>`;
  k += `<path d="${poly([T(-L, -D, TZ), T(L, -D, TZ), T(L, -D, TZ - 0.05), T(-L, -D, TZ - 0.05)])}" fill="#6b4524"/>`;
  /* Licht von links; die Schlagschatten aller Dinge auf dem Tisch (damit ihre Trefferflächen klein bleiben) */
  k += `<path d="${poly([T(-L, -D), T(L, -D), T(L, D), T(-L, D)])}" fill="${S.lg("tischlicht", [[0, "#fff3d6", 0.2], [0.5, "#fff3d6", 0], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  k += tischSchatten(-0.6, 0.24, 0.28, 0.16) + tischSchatten(-0.22, 0.02, 0.13, 0.08) + tischSchatten(0.36, 0.3, 0.13, 0.08) + tischSchatten(0.6, 0.22, 0.03, 0.24) + tischSchatten(0.16, -0.12, 0.04, 0.28) + tischSchatten(0.9, 0.3, 0.12, 0.3);
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 0, y: 0, kunst: k });
}
{
  /* DER BEMBEL: graues Steinzeug, Kobaltmalerei, Henkel, Ausguss */
  const { p, s } = aufTisch(-0.6, 0.24), q = 0.28 * s / 23;
  let k = "";
  const STEIN = S.lg("steinzeug", [[0, "#dfe3e6"], [0.35, "#c4c9cd"], [0.75, "#9a9fa4"], [1, "#7c8186"]], 0, 0, 1, 0);
  let g = `<path d="M-5.4 0 Q-8.6 -6 -7.4 -12 Q-6.4 -16 -3.4 -17.4 L-3 -20.6 Q-3.2 -22.4 -4 -23 L4 -23 Q3.2 -22.4 3 -20.6 L3.4 -17.4 Q6.4 -16 7.4 -12 Q8.6 -6 5.4 0 Z" fill="${STEIN}"/>`;
  g += `<path d="M5.8 -16.6 Q11.4 -16.4 10.6 -10.4 Q10 -6.4 6.8 -5.2" stroke="${S.lg("henkel", [[0, "#c5cacd"], [1, "#8d9297"]])}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M-4 -23 L-6.6 -24 L-4.4 -21.6 Z" fill="#b6bbbf"/>`;
  g += `<path d="M-6.9 -6 Q0 -4.6 6.9 -6 M-7.4 -13.4 Q0 -12 7.4 -13.4" stroke="#2c4fa0" stroke-width=".55" fill="none"/>`;
  g += `<path d="M-5 -9.6 q1.4 -2.4 2.8 0 q1.4 2.4 2.8 0 q1.4 -2.4 2.8 0 q1.2 2 2.4 0" stroke="#2c4fa0" stroke-width=".5" fill="none"/>`;
  g += `<path d="M0 -10.6 q-1.6 -1.6 0 -2.6 q1.6 1 0 2.6 Z" fill="#2c4fa0"/><path d="M-3 -19.6 L3 -19.6" stroke="#2c4fa0" stroke-width=".45"/>`;
  g += `<path d="M-6 -12 Q-6.6 -6 -4.4 -1.4" stroke="#fff" stroke-width=".8" opacity=".5" fill="none"/><rect x="-4" y="-23.4" width="8" height=".8" rx=".4" fill="#c9cdd0"/>`;
  k += `<g transform="translate(${r(p[0])} ${r(p[1])}) scale(${r(q * 100) / 100})">${g}</g>`;
  S.teil({ oben: true, id: "bembel", de: "der Bembel", syl: "BEM-bel", it: "la brocca del sidro", itSyl: "BROC-ca del SI-dro", en: "cider jug", x: 0, y: 0, kunst: k,
    tipp: "Aus dem Bembel, einem grau-blauen Steinkrug, schenkt man Apfelwein aus." });
}
{
  /* DAS GERIPPTE: Apfelweinglas mit Rautenschliff (0,3 l), darin der Apfelwein */
  const { p, s } = aufTisch(-0.22, 0.02);
  const w = 0.037 * s, h = 0.13 * s;
  let k = "";
  k += `<path d="M${r(p[0] - w)} ${r(p[1])} L${r(p[0] - w * 1.06)} ${r(p[1] - h)} L${r(p[0] + w * 1.06)} ${r(p[1] - h)} L${r(p[0] + w)} ${r(p[1])} Z" fill="#e8f0ee" opacity=".45"/>`;
  k += `<path d="M${r(p[0] - w * 0.97)} ${r(p[1] - 0.6)} L${r(p[0] - w * 1.04)} ${r(p[1] - h * 0.82)} L${r(p[0] + w * 1.04)} ${r(p[1] - h * 0.82)} L${r(p[0] + w * 0.97)} ${r(p[1] - 0.6)} Z" fill="${S.lg("aeppler", [[0, "#f2d77e"], [1, "#d8b24a"]])}" opacity=".9"/>`;
  k += `<ellipse cx="${r(p[0])}" cy="${r(p[1] - h * 0.82)}" rx="${r(w * 1.04)}" ry="${r(w * 0.3)}" fill="#f7e7a8"/>`;
  for (let j = 0; j < 6; j++) for (let i = 0; i < 4; i++) {
    const cx = p[0] - w * 0.75 + i * w * 0.5, cy = p[1] - h * 0.1 - j * h * 0.15, d = h * 0.07;
    k += `<path d="M${r(cx)} ${r(cy - d)} L${r(cx + d * 0.75)} ${r(cy)} L${r(cx)} ${r(cy + d)} L${r(cx - d * 0.75)} ${r(cy)} Z" fill="none" stroke="#ffffff" stroke-width=".22" opacity=".75"/>`;
  }
  k += `<ellipse cx="${r(p[0])}" cy="${r(p[1] - h)}" rx="${r(w * 1.06)}" ry="${r(w * 0.32)}" fill="none" stroke="#f4f8f7" stroke-width=".3"/>`;
  k += `<path d="M${r(p[0] - w * 0.8)} ${r(p[1] - h * 0.9)} L${r(p[0] - w * 0.72)} ${r(p[1] - 1)}" stroke="#fff" stroke-width=".45" opacity=".6"/>`;
  {
    /* das zweite Gerippte, halb leer */
    const q = TP(0.36, 0.3), t = TS(0.3), w2 = 0.037 * t, h2 = 0.13 * t;
    k += `<path d="M${r(q[0] - w2)} ${r(q[1])} L${r(q[0] - w2 * 1.06)} ${r(q[1] - h2)} L${r(q[0] + w2 * 1.06)} ${r(q[1] - h2)} L${r(q[0] + w2)} ${r(q[1])} Z" fill="#e8f0ee" opacity=".55"/>`;
    k += `<path d="M${r(q[0] - w2 * 0.97)} ${r(q[1] - 0.4)} L${r(q[0] - w2)} ${r(q[1] - h2 * 0.4)} L${r(q[0] + w2)} ${r(q[1] - h2 * 0.4)} L${r(q[0] + w2 * 0.97)} ${r(q[1] - 0.4)} Z" fill="${S.lg("aeppler2", [[0, "#f2d77e"], [1, "#d8b24a"]])}" opacity=".9"/><ellipse cx="${r(q[0])}" cy="${r(q[1] - h2 * 0.4)}" rx="${r(w2)}" ry="${r(w2 * 0.3)}" fill="#f7e7a8"/>`;
    for (let j = 0; j < 6; j++) for (let i = 0; i < 4; i++) { const cx = q[0] - w2 * 0.75 + i * w2 * 0.5, cy = q[1] - h2 * 0.1 - j * h2 * 0.15, d = h2 * 0.07; k += `<path d="M${r(cx)} ${r(cy - d)} L${r(cx + d * 0.75)} ${r(cy)} L${r(cx)} ${r(cy + d)} L${r(cx - d * 0.75)} ${r(cy)} Z" fill="none" stroke="#ffffff" stroke-width=".2" opacity=".7"/>`; }
    k += `<ellipse cx="${r(q[0])}" cy="${r(q[1] - h2)}" rx="${r(w2 * 1.06)}" ry="${r(w2 * 0.32)}" fill="none" stroke="#f4f8f7" stroke-width=".3"/>`;
  }
  S.teil({ oben: true, id: "geripptes", de: "das Gerippte", syl: "ge-RIPP-te", it: "il bicchiere a rombi", itSyl: "bic-CHIE-re a ROM-bi", en: "ribbed cider glass", x: 0, y: 0, kunst: k,
    tipp: "Das Apfelweinglas heißt „Geripptes“ – wegen seines Rautenmusters.",
    zoom: { x: r(p[0] - 18), y: 143, w: 36, h: 24 },
    unter: [
      { id: "apfelwein", de: "der Apfelwein", syl: "AP-fel-wein", it: "il sidro", itSyl: "SI-dro", en: "cider",
        x: r(p[0]), y: r(p[1] - 0.6), kunst: flaeche(-w, -h * 0.8, 2 * w, h * 0.8, 0.3), tipp: "Die Frankfurter sagen „Äppler“ oder „Ebbelwoi“." },
    ] });
}
{
  /* DIE FRANKFURTER WÜRSTCHEN: ein Paar, Senf, Brot */
  const { p, s } = aufTisch(0.6, 0.22), q = s / 100;
  let k = "";
  k += `<ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(12 * q)}" ry="${r(3.4 * q)}" fill="${S.lg("teller2", [[0, "#ffffff"], [1, "#dcdcd6"]])}"/>`;
  for (const dy of [-1.4, 0.1]) k += `<path d="M${r(p[0] - 8.4 * q)} ${r(p[1] + dy * q)} Q${r(p[0])} ${r(p[1] + (dy - 1.8) * q)} ${r(p[0] + 8.4 * q)} ${r(p[1] + dy * q)} Q${r(p[0] + 9 * q)} ${r(p[1] + (dy + 0.7) * q)} ${r(p[0] + 8.4 * q)} ${r(p[1] + (dy + 1) * q)} Q${r(p[0])} ${r(p[1] + (dy - 0.6) * q)} ${r(p[0] - 8.4 * q)} ${r(p[1] + (dy + 1) * q)} Q${r(p[0] - 9 * q)} ${r(p[1] + (dy + 0.6) * q)} ${r(p[0] - 8.4 * q)} ${r(p[1] + dy * q)} Z" fill="${S.lg("wurst", [[0, "#e7a77a"], [0.6, "#cf8457"], [1, "#a85f3c"]])}"/>`;
  k += `<ellipse cx="${r(p[0] + 7 * q)}" cy="${r(p[1] + 1.6 * q)}" rx="${r(2 * q)}" ry="${r(0.7 * q)}" fill="#e3b52e"/>`;
  k += `<path d="M${r(p[0] - 11 * q)} ${r(p[1] + 0.4 * q)} Q${r(p[0] - 10.6 * q)} ${r(p[1] - 2.2 * q)} ${r(p[0] - 7.6 * q)} ${r(p[1] - 2.4 * q)} L${r(p[0] - 5.8 * q)} ${r(p[1] + 1.8 * q)} Q${r(p[0] - 9.4 * q)} ${r(p[1] + 2.2 * q)} ${r(p[0] - 11 * q)} ${r(p[1] + 0.4 * q)} Z" fill="#c99a5c"/>`;
  S.teil({ oben: true, id: "wuerstchen", de: "das Frankfurter Würstchen", syl: "FRANK-fur-ter WÜRST-chen", it: "il würstel di Francoforte", itSyl: "WÜR-stel di fran-co-FOR-te", en: "frankfurter sausage", x: 0, y: 0, kunst: k,
    tipp: "Frankfurter Würstchen sind aus Schweinefleisch. Man erwärmt sie nur im heißen Wasser." });
}
{
  /* DAS BROT: geflochtener Brotkorb mit Serviette, Bauernbrot und Brötchen */
  const { p, s } = aufTisch(0.9, 0.3), q = s / 100;
  S.def(`<pattern id="${S.id("flecht")}" width="1.6" height="1.1" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.1" fill="#b98a4c"/><path d="M0 .55 Q.4 .15 .8 .55 T1.6 .55" stroke="#8a5f2c" stroke-width=".22" fill="none"/><path d="M0 .55 Q.4 .95 .8 .55 T1.6 .55" stroke="#d9ad6c" stroke-width=".18" fill="none"/></pattern>`);
  const X = (u) => r(p[0] + u * q), Y = (v) => r(p[1] + v * q);
  let k = `<path d="M${X(-13)} ${Y(-5)} Q${X(-12.4)} ${Y(1.6)} ${X(-9)} ${Y(2.4)} L${X(9)} ${Y(2.4)} Q${X(12.4)} ${Y(1.6)} ${X(13)} ${Y(-5)} Z" fill="url(#${S.id("flecht")})" stroke="#7a5228" stroke-width=".3"/>`;
  k += `<path d="M${X(-13)} ${Y(-5)} Q${X(0)} ${Y(-1.6)} ${X(13)} ${Y(-5)}" stroke="#d9ad6c" stroke-width="${r(1.1 * q)}" fill="none"/>`;
  k += `<path d="M${X(-11)} ${Y(-5.6)} L${X(-14.6)} ${Y(-2.4)} L${X(-8)} ${Y(-4.2)} Z M${X(10)} ${Y(-5.8)} L${X(15)} ${Y(-3.4)} L${X(8)} ${Y(-4.4)} Z" fill="#f4f1ea" stroke="#d4cfc3" stroke-width=".2"/>`;
  for (const [u, v, a] of [[-6, -6.4, -12], [-1, -7.2, 8]]) k += `<g transform="translate(${X(u)} ${Y(v)}) rotate(${a}) scale(${r(q * 10) / 10})"><path d="M-5 2 Q-5.6 -3 0 -3.6 Q5.6 -3 5 2 Z" fill="#7a4a22"/><path d="M-4.2 1.6 Q-4.6 -2.2 0 -2.8 Q4.6 -2.2 4.2 1.6 Z" fill="${S.rg("krume", [[0, "#efe0c0"], [1, "#d6bf92"]])}"/><circle cx="-1.4" cy="-.6" r=".35" fill="#c9b082"/><circle cx="1.6" cy=".2" r=".3" fill="#c9b082"/></g>`;
  k += `<ellipse cx="${X(6)}" cy="${Y(-6.6)}" rx="${r(4.2 * q)}" ry="${r(2.8 * q)}" fill="${S.rg("broetchen", [[0, "#f0c98a"], [0.7, "#c98a44"], [1, "#a2652a"]], 0.4, 0.35, 0.7)}"/><path d="M${X(3.6)} ${Y(-7.4)} Q${X(6)} ${Y(-8.6)} ${X(8.4)} ${Y(-7.2)}" stroke="#f6dfae" stroke-width="${r(0.5 * q)}" fill="none"/>`;
  S.teil({ oben: true, id: "brot", de: "das Brot", syl: "BROT", it: "il pane", itSyl: "PA-ne", en: "bread", x: 0, y: 0, kunst: k,
    tipp: "Zum Frankfurter Würstchen isst man Brot oder ein Brötchen und Senf." });
}
{
  /* DIE GRÜNE SOSSE: tiefer Teller, sieben Kräuter, halbe Eier, Kartoffeln */
  const { p, s } = aufTisch(0.16, -0.12), q = s / 100;
  let k = "";
  k += `<ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(14 * q)}" ry="${r(4.2 * q)}" fill="${S.lg("teller", [[0, "#ffffff"], [1, "#dcdcd6"]])}"/>`;
  k += `<ellipse cx="${r(p[0])}" cy="${r(p[1] - 0.5 * q)}" rx="${r(11 * q)}" ry="${r(3 * q)}" fill="${S.rg("gruen", [[0, "#cfe08f"], [0.6, "#a9c464"], [1, "#86a64a"]], 0.45, 0.4, 0.7)}"/>`;
  for (let i = 0; i < 30; i++) k += `<circle cx="${r(p[0] + (-9.4 + rnd() * 18.8) * q)}" cy="${r(p[1] + (-2.4 + rnd() * 3.4) * q)}" r="${r(0.28 * q)}" fill="${rnd() < 0.5 ? "#5f8a3a" : "#3f6a2a"}"/>`;
  for (const [x, y] of [[-5.4, -1.4], [-1.6, -0.4], [2.4, -1.6]]) k += `<ellipse cx="${r(p[0] + x * q)}" cy="${r(p[1] + y * q)}" rx="${r(2.3 * q)}" ry="${r(1.3 * q)}" fill="#fbfbf6"/><ellipse cx="${r(p[0] + (x + 0.2) * q)}" cy="${r(p[1] + (y - 0.1) * q)}" rx="${r(1.1 * q)}" ry="${r(0.7 * q)}" fill="#f2b43a"/>`;
  for (const [x, y] of [[6.4, -1.1], [8.6, -0.2], [5.6, 0.6]]) k += `<ellipse cx="${r(p[0] + x * q)}" cy="${r(p[1] + y * q)}" rx="${r(1.9 * q)}" ry="${r(1.2 * q)}" fill="${S.rg("kartoffel", [[0, "#f6dc92"], [1, "#d9b158"]], 0.4, 0.35, 0.7)}"/>`;
  k += `<ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(14 * q)}" ry="${r(4.2 * q)}" fill="none" stroke="#c9c9c2" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "gruenesosse", de: "die Grüne Soße", syl: "GRÜ-ne SO-ße", it: "la salsa verde", itSyl: "SAL-sa VER-de", en: "green sauce", x: 0, y: 0, kunst: k,
    tipp: "Grüne Soße macht man aus sieben Kräutern. Dazu gibt es Eier und Kartoffeln." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/frankfurt.js"));
console.log(aus);
