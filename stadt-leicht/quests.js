/* =====================================================================
   LEICHTE STADT — QUESTS: LEUTE, DIE IN DEUTSCH HILFE BRAUCHEN
   ---------------------------------------------------------------------
   FASSUNG 832 — XANDER (Funk 213, wörtlich): „Bitte gestalte überall
   Quest innerhalb der Stadt mit Leuten die in Deutsch Hilfe brauchen …
   z.B Touristen und du musst den helfen … immer mal ein paar Missionen
   … für die man Punkte kriegt dann kriegt man auch Geschenke dafür Deko
   für die Stadt … dann leuchtet es immer irgendwo und da ist ein Zeichen
   Fragezeichen und da geht mal dahin … und wenn Emmi z.B bei ihren
   Schwächen die Betonung hat dann kommen solche Aufgaben auch in den
   Quests … witzige und unterhaltsame Situation … irgendwas ist mit dem
   Hund passiert der entlaufen ist … der Eisverkäufer kommt mit seinem
   Wagen … mit einer kleinen Animation … so ein weicher Übergang".
   XANDER (Funk 214): „dann ist da entweder ein Fragezeichen oder ein
   Ausrufezeichen über der Stadt … so leuchtend … wenn man da drauf geht
   dann sucht es so in die Stadt … da steht dann z.B eine weinende Frau
   … wie sie den Weg zum Rathaus findet weil sie die Orientierung
   verloren hat … dann muss sie halt einen Satz auswählen … dass die Frau
   dann realistisch auch zu dem Rathaus läuft … sieht es so eine Linie
   die … rot geht oder grün geht … wenn sie dann da ist ist die Aufgabe
   gelöst und wir kriegen die Punkte … vielleicht bräuchten wir dann ein
   Wegesystem … dass wir sie immer als Connector haben immer da wo ein
   Haus an einem Weg steht dass da dann auch diese Verbindung gedacht
   wird in der Logik".
   Mit Xander abgestimmt: gelbes „!" = jemand braucht Hilfe (neue Quest),
   „?" = die Person wartet auf deine Antwort oder ist unterwegs.

   Aufbau:
   • WEGENETZ: ein Graph aus den Wegen der Stadt (dorf.js D.WEGE, mit den
     Brücken von 826). Punkte, die sich treffen, werden ein Knoten; lose
     Teile (die Pferdebahn am Markt) bekommen eine Verbindung. Kreuzungen
     (Knoten mit drei und mehr Wegen, dicht beieinander zusammengefasst)
     sind die Stellen, an denen man abbiegt. Jedes Haus, Wahrzeichen, der
     Bahnhof, der Bootsverleih und der Brunnen haben einen EINGANG (Tür
     vorn, beim Rathaus das Turmportal – auch versetzt oder gedreht) und
     hängen mit einem CONNECTOR am nächsten Wegstück. Die Wegsuche
     (Dijkstra) läuft vom Eingang aus über das Netz.
   • WEGBESCHREIBUNG aus der echten Route: an jeder Kreuzung der Winkel
     zwischen Ankunft und Weiterweg (links/rechts relativ zur
     Laufrichtung, geradeaus), dazu „über die Brücke" und wo das Ziel am
     Ende liegt. Nur Routen, deren Abzweige eindeutig sind. Falsche
     Antworten sind veränderte Beschreibungen; `folgen()` geht sie auf
     dem Netz ab – die falsche endet woanders (rote Linie), die richtige
     am Ziel (grüne Linie, die Person läuft sie ab).
   • FIGUREN: Leute-Blätter aus leute.js (l_geher0–5; Kinder kleiner),
     dazu selbst gezeichnet: Hund, Eiswagen, Regenschirm, Tränen, Konfetti.
     Im kleinen Rahmen wird ein Blatt erst nach dem Tipp aufs „!" geladen.
   • BELOHNUNG: Helferpunkte (lokal gezählt, ans Spiel gemeldet:
     postMessage „leicht-quest"), jede dritte Quest ein Schmuck-Geschenk
     für die Stadt (wird neben dem Ziel aufgestellt und gespeichert).
   • SCHWÄCHEN: das Spiel schickt mit „leicht-kopf" die schwachen Bereiche
     (Einstellungen oder gemessen). Quests dieser Art kommen öfter und
     bringen +50 % Mut-Bonus.
   Prüfen: ?quest=1 (sofort eine Quest), ?questtakt=Sekunden,
   werkzeug/pruefe-832-quests.js.

   FASSUNG 875 — XANDER (Funk 257): „die Missionen müssen Variation haben
   und dürfen nicht zu repetitiv sein … vielleicht sind sie auch gekoppelt
   an den gewissen Stand des Dorfes wie das Dorf sich entwickelt so
   erwachsen auch die Aufgaben und Fragen oder die Leute denen man
   unterwegs begegnet z.B ein Wissenschaftler der etwas über den aktuellen
   Entwicklungsstand wissen möchte vielleicht von A1 bis C2 dass man das in
   den Einstellungen hat … dass man das auf seinem Niveau lernen kann zu
   kommunizieren“ · „dieses fast kannst du nur schreiben wenn er die
   Grammatik fast richtig hat aber dazu muss die Erkennung auch korrekt
   sein weil er hat meine Worte oft nicht richtig erkannt“.
   • NIVEAU A1–C2: ein kleiner Wähler im Kopf des Quest-Fensters (die Quests
     haben kein eigenes Menü). Gespeichert im Browser (dma_quest_niveau),
     Vorgabe = das Niveau des Spiels (dma_spiel_niveau), sonst A2. Jede
     Mission hat ein Niveau; es kommen Missionen bis zum eigenen Niveau,
     gut die Hälfte auf dem eigenen (Teil 5b).
   • MISSIONEN NACH STAND DER STADT (Teil 4b): 33 neue, A1 bis C2 – die
     Forscherin, die nach dem Entwicklungsstand fragt, Reisende am Bahnhof,
     der Fischer am See, Brauerei, Krankenhaus, Rathaus, Sternwarte,
     Bergwerk. Sie kommen nur, wenn das Gebäude steht (braucht/stand), und
     ihre Fragen lesen die echte Stadt: was gebaut ist, was gerade gebaut
     wird, was noch fehlt, wie die Stadt heißt. Wer etwas Falsches über die
     eigene Stadt sagt, bekommt es gesagt.
   • ABWECHSLUNG: nie dieselbe Mission zweimal hintereinander, die letzten
     zwölf kommen seltener, dieselbe Art direkt danach nur halb so oft.
   • ERKENNUNG (Teil 11): jede Mission hat eine Wortliste. Sie geht mit an
     „erkennen“ (für eine Phrase List, sobald der Server sie weitergibt) und
     wird schon jetzt im Browser genutzt: verhörte Schlüsselwörter werden
     nach Klang (Kölner Phonetik) und Schreibung auf die Wortliste gezogen –
     aber nie Endungen, Umlaute oder Verbformen, die über richtig und falsch
     entscheiden.
   Prüfen: werkzeug/pruefe-875-quest-niveau.js.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  if (!ST || (ST.quests && !ST.quests.vertretung)) return;
  const K = ST.kamera, SZ = ST.szene, LB = ST.bilder, D = ST.dorf;
  const q = new URLSearchParams(location.search);
  /* ohne Vertretung (?quelle=1): dieselben Regeln wie quests-laden.js */
  if (!ST.quests && (q.get("quest") === "0" || (q.get("quest") !== "1" && (q.get("still") === "1" || navigator.webdriver)))) return;
  const Q = (ST.quests = { liste: [], echt: true });
  const info = (ST.questInfo = ST.questInfo || { schwach: [] });
  const L = () => ST.leicht || {};
  const O = () => ST.oberflaeche || {};
  const rad = (g) => g * Math.PI / 180;
  const zufall = Math.random;
  const mischen = (l) => { l = l.slice(); for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(zufall() * (i + 1)); const t = l[i]; l[i] = l[j]; l[j] = t; } return l; };
  const wahl = (l) => l[Math.floor(zufall() * l.length)];
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const mini = () => document.body.classList.contains("lk-mini-modus");
  const imRahmen = window.parent !== window;

  /* =====================================================================
     1. WEGENETZ
     ===================================================================== */
  const N = { wege: null, kn: [], nb: [], cl: [], cls: [] };
  function netz() {
    if (N.wege === D.WEGE && N.kn.length) return N;
    const kn = [], nb = [], raster = new Map(), R = 2;
    const zelle = (x, y) => Math.floor(x / R) + "," + Math.floor(y / R);
    const neu = (x, y) => { kn.push([x, y]); nb.push([]); const z = zelle(x, y); if (!raster.has(z)) raster.set(z, []); raster.get(z).push(kn.length - 1); return kn.length - 1; };
    const finde = (x, y, tol) => {
      const cx = Math.floor(x / R), cy = Math.floor(y / R); let best = -1, bd = tol;
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const k of raster.get((cx + i) + "," + (cy + j)) || []) { const d = Math.hypot(kn[k][0] - x, kn[k][1] - y); if (d < bd) { bd = d; best = k; } }
      return best >= 0 ? best : neu(x, y);
    };
    const kante = (a, b) => { if (a === b || nb[a].indexOf(b) >= 0) return; nb[a].push(b); nb[b].push(a); };
    for (const w of D.WEGE || []) {
      if (!w || w.length < 2) continue;
      let v = finde(w[0][0], w[0][1], 0.9), lx = w[0][0], ly = w[0][1];
      for (let i = 1; i < w.length; i++) {
        const p = w[i];
        if (i < w.length - 1 && Math.hypot(p[0] - lx, p[1] - ly) < 0.8) continue;
        const n = finde(p[0], p[1], 0.9); kante(v, n); v = n; lx = p[0]; ly = p[1];
      }
    }
    /* lose Teile ans Hauptnetz (z. B. die Pferdebahn, die 5 m neben dem Markt beginnt) */
    for (let runde = 0; runde < 12; runde++) {
      const komp = new Array(kn.length).fill(-1); let nk = 0; const groesse = [];
      for (let s = 0; s < kn.length; s++) {
        if (komp[s] >= 0) continue;
        const st = [s]; komp[s] = nk; let g = 0;
        while (st.length) { const u = st.pop(); g++; for (const v of nb[u]) if (komp[v] < 0) { komp[v] = nk; st.push(v); } }
        groesse.push(g); nk++;
      }
      if (nk <= 1) break;
      const haupt = groesse.indexOf(Math.max.apply(null, groesse));
      let verbunden = false;
      for (let c = 0; c < nk; c++) {
        if (c === haupt) continue;
        let best = null;
        for (let i = 0; i < kn.length; i++) if (komp[i] === c) for (let j = 0; j < kn.length; j++) if (komp[j] === haupt) {
          const d = Math.hypot(kn[i][0] - kn[j][0], kn[i][1] - kn[j][1]); if (!best || d < best[2]) best = [i, j, d];
        }
        if (best && best[2] < 30) { kante(best[0], best[1]); verbunden = true; }
      }
      if (!verbunden) break;
    }
    /* Kreuzungen: Knoten mit ≥ 3 Wegen, dichter als 5 m beieinander – oder über ein Wegstück ≤ 8 m verbunden (am Markt
       laufen mehrere Wege im Bogen um den Brunnen und treffen sich gleich wieder) – sind eine Kreuzung */
    const cl = new Array(kn.length).fill(-1), eltern = [];
    const J = []; for (let i = 0; i < kn.length; i++) if (nb[i].length >= 3) J.push(i);
    const wurzel = (i) => { while (eltern[i] !== i) i = eltern[i] = eltern[eltern[i]]; return i; };
    for (const i of J) eltern[i] = i;
    for (let a = 0; a < J.length; a++) for (let b = a + 1; b < J.length; b++) {
      if (Math.hypot(kn[J[a]][0] - kn[J[b]][0], kn[J[a]][1] - kn[J[b]][1]) < 5) eltern[wurzel(J[a])] = wurzel(J[b]);
    }
    const zwischen = [];
    for (const j of J) for (const w0 of nb[j]) {
      let a = j, b = w0, weg = Math.hypot(kn[b][0] - kn[a][0], kn[b][1] - kn[a][1]); const innen = [];
      while (nb[b].length === 2 && weg <= 8) { innen.push(b); const w = nb[b][0] === a ? nb[b][1] : nb[b][0]; weg += Math.hypot(kn[w][0] - kn[b][0], kn[w][1] - kn[b][1]); a = b; b = w; }
      if (weg <= 8 && nb[b].length >= 3 && b !== j) { eltern[wurzel(j)] = wurzel(b); zwischen.push([j, innen]); }
    }
    const cls = [], nr = new Map();
    for (const i of J) { const r = wurzel(i); if (!nr.has(r)) { nr.set(r, cls.length); cls.push({ glieder: [], x: 0, y: 0 }); } const c = nr.get(r); cl[i] = c; cls[c].glieder.push(i); }
    /* Knoten zwischen zwei Gliedern derselben Kreuzung (kurze Stücke darin) gehören auch dazu */
    for (const [j, innen] of zwischen) for (const i of innen) if (cl[i] < 0) { cl[i] = cl[j]; cls[cl[j]].glieder.push(i); }
    for (let i = 0; i < kn.length; i++) if (cl[i] < 0 && nb[i].length === 2 && cl[nb[i][0]] >= 0 && cl[nb[i][0]] === cl[nb[i][1]]) { cl[i] = cl[nb[i][0]]; cls[cl[i]].glieder.push(i); }
    for (const c of cls) { for (const i of c.glieder) { c.x += kn[i][0]; c.y += kn[i][1]; } c.x /= c.glieder.length; c.y /= c.glieder.length; }
    Object.assign(N, { wege: D.WEGE, kn: kn, nb: nb, cl: cl, cls: cls });
    return N;
  }
  const bruecke = (x, y) => (D.BRUECKEN || []).some((b) => Math.hypot(b.x - x, b.y - y) < 1.6);
  const naheBruecke = (x, y, d) => (D.BRUECKEN || []).some((b) => Math.hypot(b.x - x, b.y - y) < d);
  /* nächstes Wegstück zu einem Punkt: [a, b, t, Punkt, Abstand] */
  function naechstesStueck(x, y) {
    const n = netz(); let best = null;
    for (let a = 0; a < n.kn.length; a++) for (const b of n.nb[a]) {
      if (b < a) continue;
      const A = n.kn[a], B = n.kn[b], dx = B[0] - A[0], dy = B[1] - A[1], l2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((x - A[0]) * dx + (y - A[1]) * dy) / l2)), px = A[0] + dx * t, py = A[1] + dy * t, d = Math.hypot(x - px, y - py);
      if (!best || d < best[4]) best = [a, b, t, [px, py], d];
    }
    return best;
  }
  /* Dijkstra von einem Anschluss (Quellen mit Anfangswerten) über das ganze Netz */
  function dijkstra(quellen) {
    const n = netz(), M = n.kn.length, dist = new Float64Array(M).fill(Infinity), vor = new Int32Array(M).fill(-1), heap = [];
    const rein = (d, i) => { heap.push([d, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; const t = heap[p]; heap[p] = heap[k]; heap[k] = t; k = p; } };
    const raus = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; const t = heap[m]; heap[m] = heap[k]; heap[k] = t; k = m; } } return top; };
    for (const [i, d] of quellen) if (d < dist[i]) { dist[i] = d; rein(d, i); }
    while (heap.length) {
      const [d, u] = raus(); if (d > dist[u]) continue;
      for (const v of n.nb[u]) { const nd = d + Math.hypot(n.kn[u][0] - n.kn[v][0], n.kn[u][1] - n.kn[v][1]); if (nd < dist[v]) { dist[v] = nd; vor[v] = u; rein(nd, v); } }
    }
    return { dist: dist, vor: vor };
  }

  /* =====================================================================
     2. ZIELE MIT EINGANG (Connector)
     ===================================================================== */
  /* Name mit Geschlecht (der/die/das) – für „zum Rathaus", „vor der Bäckerei" … */
  const NAMEN = {
    baeckerei: ["die", "Bäckerei"], schule: ["die", "Schule"], schmiede: ["die", "Schmiede"], brauerei: ["die", "Brauerei"], bibliothek: ["die", "Bibliothek"],
    rathaus: ["das", "Rathaus"], muehle: ["die", "Mühle"], huehnerstall: ["der", "Hühnerstall"], kuhstall: ["der", "Kuhstall"], krankenhaus: ["das", "Krankenhaus"],
    bergwerk: ["das", "Bergwerk"], labor: ["das", "Labor"], kaserne: ["die", "Kaserne"], gasthaus: ["das", "Gasthaus"], gefaengnis: ["das", "Gefängnis"], flickstube: ["die", "Flickstube"],
    koelner_dom: ["der", "Kölner Dom"], holstentor: ["das", "Holstentor"], brandenburger: ["das", "Brandenburger Tor"], neuschwanstein: ["das", "Schloss Neuschwanstein"],
    fernsehturm: ["der", "Fernsehturm"], bahnhof: ["der", "Bahnhof"], bootsverleih: ["der", "Bootsverleih"], brunnen: ["der", "Brunnen"]
  };
  /* FASSUNG 875 — die späten Häuser (dorf.js D.SPAET) kennt die Stadt für den Stand und die Texte; Ziele zum Hinlaufen
     bleiben die aus NAMEN (die späten liegen weit draußen auf dem Bauland) */
  const NAMEN_ALLE = Object.assign({ sternwarte: ["die", "Sternwarte"], marktstand: ["der", "Marktstand"], holzhuette: ["die", "Holzfällerhütte"],
    jagdhuette: ["die", "Jagdhütte"], schweinestall: ["der", "Schweinestall"] }, NAMEN);
  const ART = { der: { nom: "der", akk: "den", dat: "dem", zu: "zum", falsch: "der" }, die: { nom: "die", akk: "die", dat: "der", zu: "zur", falsch: "dem" }, das: { nom: "das", akk: "das", dat: "dem", zu: "zum", falsch: "der" } };
  const nom = (z) => ART[z.g].nom + " " + z.name, Nom = (z) => { const t = nom(z); return t[0].toUpperCase() + t.slice(1); };
  const akk = (z) => ART[z.g].akk + " " + z.name, dat = (z) => ART[z.g].dat + " " + z.name, zum = (z) => ART[z.g].zu + " " + z.name;
  /* Eingang eines Dings: vorn vor der Tür (Front = Drehung + 90°, wie dorf.js „vor"), sonst die Seite, die dem Weg am
     nächsten liegt; das Rathaus vor dem Turmportal (D.GRUNDRISS, auch versetzt/gedreht) */
  function eingang(o) {
    const a = rad((o.dreh || 0) * 90 + 90), fx = Math.cos(a), fy = Math.sin(a);
    if (o.spiel === "rathaus" && D.GRUNDRISS && D.GRUNDRISS.rathaus) {
      const G = D.GRUNDRISS.rathaus, m = (D.MASS || {}).rathaus || 1, w = (o.dreh || 0) * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), x = G.portal[0], y = G.portal[1] + 2.4 / m;
      return [o.x + (x * c - y * s) * m, o.y + (x * s + y * c) * m];
    }
    const f = o.fuss || [4, 4], hw = f[0] / 2 + 1.6, hd = f[1] / 2 + 1.6;
    const kand = [[o.x + fx * hd, o.y + fy * hd, 0], [o.x - fy * hw, o.y + fx * hw, 6], [o.x + fy * hw, o.y - fx * hw, 6], [o.x - fx * hd, o.y - fy * hd, 10]];
    let best = null;
    for (const k of kand) { const st = naechstesStueck(k[0], k[1]); const w = (st ? st[4] : 99) + k[2]; if (!best || w < best[1]) best = [k, w]; }
    return [best[0][0], best[0][1]];
  }
  /* alle Ziele, die gerade in der Stadt stehen */
  function ziele() {
    const aus = {};
    for (const o of SZ.objekte) {
      if (o.versteckt || o.geist) continue;
      let key = null;
      if ((o.art === "haus" && o.spiel && !o.bau) || (o.art === "wunder" && o.spiel)) key = o.spiel;
      else if (o.art === "kulisse" && o.name === "Bahnhof") key = "bahnhof";
      else if (o.art === "kulisse" && o.name === "Bootsverleih") key = "bootsverleih";
      if (!key || !NAMEN[key] || aus[key]) continue;
      aus[key] = { key: key, g: NAMEN[key][0], name: NAMEN[key][1], o: o, x: o.x, y: o.y, tuer: eingang(o), wunder: o.art === "wunder" };
    }
    if (D.BRUNNEN) aus.brunnen = { key: "brunnen", g: "der", name: "Brunnen", o: null, x: D.BRUNNEN[0], y: D.BRUNNEN[1], tuer: [D.BRUNNEN[0] + 2.7, D.BRUNNEN[1] + 2.7] };
    return aus;
  }
  /* Anschluss eines Ziels ans Netz und alle Wege dorthin */
  function anschluss(z) {
    const st = naechstesStueck(z.tuer[0], z.tuer[1]); if (!st || st[4] > 25) return null;
    const n = netz(), A = st[3], a = st[0], b = st[1];
    const dj = dijkstra([[a, Math.hypot(n.kn[a][0] - A[0], n.kn[a][1] - A[1])], [b, Math.hypot(n.kn[b][0] - A[0], n.kn[b][1] - A[1])]]);
    return { z: z, a: a, b: b, A: A, abst: st[4], dist: dj.dist, vor: dj.vor };
  }
  /* Knotenfolge vom Start bis zum Anschluss */
  function knotenweg(an, s) {
    const R = [s]; let u = s, g = 0;
    while (u !== an.a && u !== an.b && g++ < 5000) { u = an.vor[u]; if (u < 0) return null; R.push(u); }
    return R;
  }

  /* =====================================================================
     3. WEGBESCHREIBUNG AUS DER ROUTE
     ===================================================================== */
  /* Punkt d Meter entlang des Wegs von m über n hinaus (durch Knoten mit zwei Wegen) */
  function entlang(m, n, d) {
    const N0 = netz(); let a = m, b = n, weg = 0, p = N0.kn[b];
    for (let g = 0; g < 400; g++) {
      weg += Math.hypot(N0.kn[b][0] - N0.kn[a][0], N0.kn[b][1] - N0.kn[a][1]); p = N0.kn[b];
      if (weg >= d || N0.nb[b].length !== 2 || N0.cl[b] >= 0) break;
      const w = N0.nb[b][0] === a ? N0.nb[b][1] : N0.nb[b][0]; a = b; b = w;
    }
    return p;
  }
  const winkel = (ax, ay, bx, by) => Math.atan2(ax * by - ay * bx, ax * bx + ay * by) * 180 / Math.PI;   // > 0: rechts (im Bild im Uhrzeigersinn)
  const klasse = (w) => Math.abs(w) <= 35 ? "geradeaus" : w > 150 || w < -150 ? "zurueck" : w > 0 ? "rechts" : "links";
  /* feiner, nur wenn an einer Kreuzung zwei Wege in dieselbe grobe Richtung gehen (am Markt): halb links/rechts bis 75° */
  const fein = (w) => Math.abs(w) <= 30 ? "geradeaus" : w > 150 || w < -150 ? "zurueck" : Math.abs(w) <= 75 ? (w > 0 ? "halb rechts" : "halb links") : w > 0 ? "rechts" : "links";
  /* welcher Abzweig ist mit diesem Wort gemeint? grob eindeutig, sonst fein eindeutig, sonst keiner */
  function gemeint(ab, wort) {
    const g = ab.filter((x) => x.k === wort); if (g.length === 1 && wort !== "zurueck") return g[0];
    const f = ab.filter((x) => fein(x.w) === wort); if (f.length === 1 && wort !== "zurueck") return f[0];
    return null;
  }
  /* das Wort für einen Abzweig: das grobe, wenn es eindeutig ist, sonst das feine (oder keins) */
  function wortFuer(ab, x) {
    if (gemeint(ab, x.k) === x) return x.k;
    const f = fein(x.w);
    /* „halb" nur, wenn der andere Weg in dieselbe Richtung deutlich anders abgeht (≥ 25°) */
    if (gemeint(ab, f) !== x || ab.some((y) => y !== x && y.k === x.k && Math.abs(y.w - x.w) < 25)) return null;
    return f;
  }
  /* Abzweige einer Kreuzung, von der Ankunft (m ← n außen) aus gesehen */
  function abzweige(c, rein) {
    const n = netz(), C = n.cls[c], P = entlang(rein[0], rein[1], 7), din = [C.x - P[0], C.y - P[1]], aus = [];
    for (const m of C.glieder) for (const w of n.nb[m]) {
      if (n.cl[w] === c || (m === rein[0] && w === rein[1])) continue;
      const Q0 = entlang(m, w, 7), w0 = winkel(din[0], din[1], Q0[0] - C.x, Q0[1] - C.y);
      aus.push({ m: m, n: w, w: w0, k: klasse(w0) });
    }
    return aus;
  }
  /* Entscheidungen entlang einer Knotenfolge: [{c, k, w, eindeutig, i}] und die Brücken je Abschnitt */
  function entscheidungen(R) {
    const n = netz(), aus = [], gesehen = new Set(); let brueckeSeit = false;
    for (let i = 0; i < R.length; i++) {
      if (bruecke(n.kn[R[i]][0], n.kn[R[i]][1])) brueckeSeit = true;
      const c = n.cl[R[i]];
      if (c < 0 || i === 0 || n.cl[R[i - 1]] === c) continue;
      let j = i; while (j < R.length && n.cl[R[j]] === c) j++;
      if (j >= R.length) break;   // endet in der Kreuzung (Anschluss dort)
      const ab = abzweige(c, [R[i], R[i - 1]]), weiter = ab.find((x) => x.m === R[j - 1] && x.n === R[j]);
      if (!weiter) { aus.push({ c: c, k: "?", w: 0, eindeutig: false, i: i, bruecke: brueckeSeit }); brueckeSeit = false; i = j - 1; continue; }
      const wort = gesehen.has(c) ? null : wortFuer(ab, weiter); gesehen.add(c);   // (zweimal durch dieselbe Kreuzung: zu verwirrend)
      aus.push({ c: c, k: wort || weiter.k, w: weiter.w, eindeutig: !!wort, i: i, j: j, bruecke: brueckeSeit, zahl: ab.length });
      brueckeSeit = false; i = j - 1;
    }
    return { schritte: aus, brueckeZuletzt: brueckeSeit };
  }
  /* Wo liegt das Ziel am Ende: links, rechts oder vor einem */
  function endeSeite(pts, A, tuer) {
    let i = pts.length - 1, P = pts[i], weg = 0;
    while (i > 0 && weg < 4) { i--; weg += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); P = pts[i]; }
    const d = [A[0] - P[0], A[1] - P[1]], v = [tuer[0] - A[0], tuer[1] - A[1]];
    if (Math.hypot(v[0], v[1]) < 1 || Math.hypot(d[0], d[1]) < 0.3) return "vorn";
    const w = winkel(d[0], d[1], v[0], v[1]);
    return Math.abs(w) < 40 ? "vorn" : w > 0 ? "rechts" : "links";
  }
  /* Route vom Startknoten s zum Ziel (über den Anschluss an) */
  function route(an, s) {
    const n = netz(), R = knotenweg(an, s); if (!R) return null;
    const pts = R.map((i) => n.kn[i].slice());
    const ende = endeSeite(pts.concat([an.A]), an.A, an.z.tuer);
    pts.push(an.A.slice(), an.z.tuer.slice());
    const E = entscheidungen(R);
    return { R: R, pts: pts, schritte: E.schritte, brueckeZuletzt: E.brueckeZuletzt, ende: ende, laenge: an.dist[s] + an.abst };
  }
  /* Text der Wegbeschreibung (Sie-Form, A1–A2) */
  const WORT = { links: "links", rechts: "rechts", geradeaus: "weiter geradeaus", "halb links": "halb links", "halb rechts": "halb rechts" };
  function wegText(schritte, ende, z, brueckeZuletzt) {
    const s = [];
    schritte.forEach((x, i) => {
      if (i === 0) s.push("Gehen Sie geradeaus" + (x.bruecke ? " über die Brücke" : "") + " bis zur Kreuzung, dann " + WORT[x.k] + ".");
      else s.push((x.bruecke ? "Nach der Brücke an der Kreuzung " : "An der nächsten Kreuzung ") + WORT[x.k] + ".");
    });
    if (!schritte.length) s.push("Gehen Sie einfach geradeaus" + (brueckeZuletzt ? " über die Brücke." : "."));
    else if (brueckeZuletzt) s.push("Dann über die Brücke.");
    s.push("Dann ist " + nom(z) + " " + (ende === "links" ? "links" : ende === "rechts" ? "rechts" : "direkt vor Ihnen") + ".");
    return s.join(" ");
  }
  /* Einer Beschreibung auf dem Netz folgen (start: Knoten, erster Schritt nach „weiter"): wohin kommt man? */
  function folgen(an, start, weiter, klassen) {
    const n = netz(), R = [start]; let prev = start, cur = weiter, i = 0, grund = "";
    const zielDa = (u) => u === an.a || u === an.b;
    const clZiel = (c) => n.cl[an.a] === c || n.cl[an.b] === c;
    for (let g = 0; g < 4000; g++) {
      R.push(cur);
      if (zielDa(cur) && i === klassen.length) return { ok: true, R: R };
      const c = n.cl[cur];
      if (c >= 0 && n.cl[prev] !== c) {
        if (i >= klassen.length) { if (clZiel(c)) return { ok: true, R: R }; grund = "kreuzung"; break; }
        const g = gemeint(abzweige(c, [cur, prev]), klassen[i]), ab = g ? [g] : [];
        if (ab.length !== 1) { grund = "keinWeg"; break; }
        /* durch die Kreuzung zum gewählten Abzweig */
        if (ab[0].m !== cur) { const innen = kreuzungsWeg(c, cur, ab[0].m); for (const u of innen.slice(1)) R.push(u); }
        i++; prev = ab[0].m; cur = ab[0].n; continue;
      }
      if (n.nb[cur].length === 1) { grund = "ende"; break; }
      const w = n.nb[cur].filter((x) => x !== prev);
      if (w.length !== 1) { grund = "kreuzung"; break; }
      prev = cur; cur = w[0];
    }
    return { ok: false, R: R, grund: grund, rest: klassen.length - i };
  }
  function kreuzungsWeg(c, von, nach) {
    const n = netz(), vor = new Map([[von, -1]]), st = [von];
    while (st.length) { const u = st.shift(); if (u === nach) break; for (const v of n.nb[u]) if (n.cl[v] === c && !vor.has(v)) { vor.set(v, u); st.push(v); } }
    const R = []; for (let u = nach; u !== -1 && u != null; u = vor.get(u)) R.unshift(u);
    return R[0] === von ? R : [von, nach];
  }

  /* =====================================================================
     4. QUEST-VORLAGEN (Duden, A1–B1)
     ===================================================================== */
  /* Betonung: Silben, betonte Silbe (Index) – nach Duden */
  const SILBEN = {
    baeckerei: [["Bä", "cke", "rei"], 2], bibliothek: [["Bi", "bli", "o", "thek"], 3], krankenhaus: [["Kran", "ken", "haus"], 0], brauerei: [["Brau", "e", "rei"], 2],
    kaserne: [["Ka", "ser", "ne"], 1], gefaengnis: [["Ge", "fäng", "nis"], 1], fernsehturm: [["Fern", "seh", "turm"], 0], neuschwanstein: [["Neu", "schwan", "stein"], 1],
    holstentor: [["Hol", "sten", "tor"], 0], huehnerstall: [["Hüh", "ner", "stall"], 0], flickstube: [["Flick", "stu", "be"], 0]
  };
  const WOERTER = [["Entschuldigung", ["Ent", "schul", "di", "gung"], 1], ["Kartoffel", ["Kar", "tof", "fel"], 1], ["Tomate", ["To", "ma", "te"], 1], ["Schokolade", ["Scho", "ko", "la", "de"], 2],
    ["Banane", ["Ba", "na", "ne"], 1], ["Polizei", ["Po", "li", "zei"], 2], ["Museum", ["Mu", "se", "um"], 1], ["Information", ["In", "for", "ma", "tion"], 3], ["Mineralwasser", ["Mi", "ne", "ral", "was", "ser"], 2], ["Restaurant", ["Res", "tau", "rant"], 2]];
  const silbenHtml = (s, b) => s.map((x, i) => (i === b ? "<b class=\"lq-betont\">" + esc(x.toUpperCase()) + "</b>" : esc(x.toLowerCase()))).join("·");
  const silbenText = (s, b) => s.map((x, i) => (i === b ? x.toUpperCase() : x.toLowerCase())).join("-");
  function betonungsAntworten(s, b) {
    const andere = mischen(s.map((x, i) => i).filter((i) => i !== b)).slice(0, 2);
    return [{ html: silbenHtml(s, b), richtig: true }].concat(andere.map((i) => ({ html: silbenHtml(s, i), hinweis: "Nicht ganz – man sagt „" + silbenText(s, b) + "“: betont ist die Silbe „" + s[b].toLowerCase() + "“." })));
  }
  const STAEDTE = ["Leipzig", "Dresden", "Berlin", "Hamburg", "München", "Köln"];
  /* person: Blatt (l_geher0–5), klein = Kind; ziel: mögliche Ziele (erstes vorhandenes nach Zufall); richtung: Wegbeschreibung */
  const VORLAGEN = [
    { id: "weg_rathaus", kat: "praepositionen", titel: "Eine Touristin hat sich verlaufen", person: { art: 4, weint: true }, richtung: true, ziel: ["rathaus"],
      text: (z) => "Eine Touristin weint: „Entschuldigung! Ich habe die Orientierung verloren. Wie komme ich " + zum(z) + "?“", danke: "„Vielen Dank! Jetzt finde ich es.“" },
    { id: "weg_bahnhof", kat: "praepositionen", titel: "Ein Mann mit Koffer ist in Eile", person: { art: 2, er: true }, richtung: true, ziel: ["bahnhof"],
      text: (z) => "Ein Mann mit Koffer ruft: „Mein Zug fährt gleich! Wie komme ich " + zum(z) + "?“", danke: "„Danke! Dann schaffe ich den Zug noch.“" },
    { id: "weg_krankenhaus", kat: "praepositionen", titel: "Ein Radfahrer ist gestürzt", person: { art: 3, er: true }, richtung: true, ziel: ["krankenhaus"],
      text: (z) => "Ein Radfahrer hält sich das Knie: „Aua! Ich bin gestürzt. Wie komme ich " + zum(z) + "?“", danke: "„Danke, das ist nett von Ihnen!“" },
    { id: "weg_gasthaus", kat: "praepositionen", titel: "Ein Wanderer hat Hunger", person: { art: 5, er: true }, richtung: true, ziel: ["gasthaus", "baeckerei"],
      text: (z) => "Ein Wanderer seufzt: „Ich habe riesigen Hunger! Wie komme ich " + zum(z) + "?“", danke: "„Danke! Mein Bauch freut sich schon.“" },
    { id: "weg_wahrzeichen", kat: "praepositionen", titel: "Eine Touristin möchte ein Foto machen", person: { art: 1 }, richtung: true, ziel: ["fernsehturm", "koelner_dom", "holstentor", "brandenburger", "neuschwanstein"],
      text: (z) => "Eine Touristin mit Kamera fragt: „Ich möchte ein Foto vom " + z.name + " machen. Wie komme ich dorthin?“", danke: "„Toll, danke! Das wird ein schönes Foto.“" },
    { id: "hund", kat: "faelle", titel: "Ein Hund ist weggelaufen", person: { art: 3, klein: true, weint: true }, hund: true, ziel: ["baeckerei", "schule", "rathaus", "bibliothek", "gasthaus", "brunnen", "schmiede"],
      text: (z) => "Ein Kind weint: „Mein Hund Bello ist weggelaufen!“ Du hast Bello gerade gesehen: Er sitzt vor " + dat(z) + ".",
      frage: "Was sagst du? Welcher Satz ist richtig?",
      antworten: (z) => [
        { html: "„Keine Sorge! Dein Hund sitzt vor " + dat(z) + ".“", richtig: true },
        { html: "„Keine Sorge! Dein Hund sitzt vor " + akk(z) + ".“", hinweis: "Fast! „Wo?“ braucht den Dativ: vor " + dat(z) + "." },
        { html: "„Keine Sorge! Dein Hund sitzt vor " + ART[z.g].falsch + " " + z.name + ".“", hinweis: "Achtung, Artikel: " + nom(z) + " – im Dativ „vor " + dat(z) + "“." }
      ], danke: "„Bello! Da bist du ja! Danke, danke!“" },
    { id: "eis", kat: "artikel", titel: "Der Eiswagen ist da!", person: { art: 3, klein: true }, eis: true, ziel: ["brunnen"],
      text: () => "Der Eisverkäufer kommt mit seinem Wagen. Ein Kind hat kein Geld dabei. Der Verkäufer lacht: „Wer richtig bestellt, bekommt ein Eis geschenkt!“",
      frage: "Hilf dem Kind: Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich möchte bitte eine Kugel Erdbeereis.“", richtig: true },
        { html: "„Ich möchte bitte ein Kugel Erdbeereis.“", hinweis: "Fast! Es heißt „die Kugel“ – also „eine Kugel“." },
        { html: "„Ich möchten bitte eine Kugel Erdbeereis.“", hinweis: "Fast! Es heißt „ich möchte“ – ohne n." }
      ], danke: "„Juhu, Erdbeereis! Danke!“" },
    { id: "schirm", kat: "artikel", titel: "Ein Tourist wird nass", person: { art: 5 }, schirm: true, ziel: ["bahnhof", "holstentor", "rathaus", "fernsehturm"],
      text: () => "Es nieselt, und ein Tourist hat keinen Regenschirm. Du hast einen übrig und verkaufst ihn. Er fragt: „Was kostet der Regenschirm?“",
      frage: "Was antwortest du?",
      antworten: () => [
        { html: "„Er kostet fünf Euro.“", richtig: true },
        { html: "„Sie kostet fünf Euro.“", hinweis: "Nicht ganz: der Regenschirm – also „er“." },
        { html: "„Es kostet fünf Euro.“", hinweis: "Nicht ganz: der Regenschirm – also „er“." }
      ], danke: "„Super, danke! Jetzt bleibe ich trocken.“" },
    { id: "baeckerei", kat: "stil", titel: "Ein Gast möchte Brötchen kaufen", person: { art: 2 }, ziel: ["baeckerei"],
      text: () => "Ein Gast aus Spanien möchte in der Bäckerei Brötchen kaufen. Er fragt dich: „Wie sage ich das höflich?“",
      frage: "Welcher Satz passt?",
      antworten: () => [
        { html: "„Ich hätte gern vier Brötchen, bitte.“", richtig: true },
        { html: "„Ich will vier Brötchen. Schnell!“", hinweis: "Das klingt unhöflich. Höflich ist: „Ich hätte gern …, bitte.“" },
        { html: "„Ich hätte gern vier Brötchens, bitte.“", hinweis: "Fast! Plural: das Brötchen – die Brötchen, ohne s." }
      ], danke: "„Gracias – äh, danke schön!“" },
    { id: "fahrkarte", kat: "praepositionen", titel: "Eine Dame möchte verreisen", person: { art: 0 }, ziel: ["bahnhof"],
      text: (z, v) => "Eine ältere Dame möchte mit dem Zug nach " + v.stadt + " fahren. Sie fragt: „Was sage ich am Fahrkartenschalter?“",
      frage: "Welcher Satz ist richtig?",
      antworten: (z, v) => [
        { html: "„Eine Fahrkarte nach " + v.stadt + ", bitte.“", richtig: true },
        { html: "„Eine Fahrkarte zu " + v.stadt + ", bitte.“", hinweis: "Bei Städten ohne Artikel sagt man „nach“: nach " + v.stadt + "." },
        { html: "„Eine Fahrkarte in " + v.stadt + ", bitte.“", hinweis: "Wohin? Bei Städten: „nach " + v.stadt + "“." }
      ], danke: "„Danke, junger Mensch! Gute Reise für mich!“" },
    { id: "betonung_haus", kat: "betonung", titel: "Wie spricht man das aus?", person: { art: 1 }, ziel: Object.keys(SILBEN),
      text: (z) => "Eine Touristin liest das Schild „" + z.name + "“ und fragt: „Welche Silbe betont man?“",
      frage: "Wo liegt die Betonung? (Groß = betont)",
      antworten: (z) => betonungsAntworten(SILBEN[z.key][0], SILBEN[z.key][1]),
      danke: (z) => "„Ah, " + silbenText(SILBEN[z.key][0], SILBEN[z.key][1]) + "! Danke, da gehe ich jetzt hin.“" },
    { id: "betonung_wort", kat: "betonung", titel: "Ein Kellner übt Deutsch", person: { art: 3 }, ziel: ["gasthaus", "baeckerei", "brunnen"],
      text: (z, v) => "Ein Kellner aus Frankreich übt für die Speisekarte. Er fragt: „Wie betont man ‚" + v.wort[0] + "‘?“",
      frage: "Wo liegt die Betonung? (Groß = betont)",
      antworten: (z, v) => betonungsAntworten(v.wort[1], v.wort[2]),
      danke: "„Merci – äh, danke schön!“" },
    { id: "artikel_ort", kat: "artikel", titel: "Der, die oder das?", person: { art: 3, klein: true }, ziel: ["rathaus", "bahnhof", "baeckerei", "bibliothek", "krankenhaus", "schule", "fernsehturm", "holstentor", "gasthaus", "labor", "kaserne", "bergwerk", "muehle"],
      text: (z) => "Ein Schüler aus Italien zeigt auf ein Gebäude und fragt: „Heißt es der, die oder das " + z.name + "?“",
      frage: "Was antwortest du?",
      antworten: (z) => ["der", "die", "das"].map((g) => (g === z.g ? { html: "„Es heißt " + g + " " + z.name + ".“", richtig: true } : { html: "„Es heißt " + g + " " + z.name + ".“", hinweis: "Nein – es heißt „" + nom(z) + "“." })),
      danke: (z) => "„Danke! Dann gehe ich jetzt " + zum(z) + ".“" },
    { id: "sie_du", kat: "stil", titel: "Ein älterer Herr bittet um Hilfe", person: { art: 0 }, ziel: ["fernsehturm", "koelner_dom", "rathaus", "bibliothek", "holstentor", "krankenhaus"],
      text: (z) => "Ein älterer Herr mit Hut fragt: „Entschuldigung, können Sie mir helfen? Ich suche " + akk(z) + ".“",
      frage: "Wie antwortest du höflich?",
      antworten: () => [
        { html: "„Gern! Kommen Sie mit, ich zeige Ihnen den Weg.“", richtig: true },
        { html: "„Gern! Komm mit, ich zeige dir den Weg.“", hinweis: "Einen fremden Erwachsenen sprichst du mit „Sie“ an." },
        { html: "„Gern! Kommen Sie mit, ich zeige dir den Weg.“", hinweis: "Nicht mischen: Bei „Sie“ heißt es „Ihnen“." }
      ], danke: "„Sehr freundlich, vielen Dank!“" },
    { id: "tretboot", kat: "wortstellung", titel: "Am Bootsverleih", person: { art: 3, klein: true }, ziel: ["bootsverleih"],
      text: () => "Ein Junge möchte zum ersten Mal ein Tretboot mieten. Er ist schüchtern und fragt dich: „Wie frage ich richtig?“",
      frage: "Welche Frage ist richtig?",
      antworten: () => [
        { html: "„Kann ich bitte ein Tretboot mieten?“", richtig: true },
        { html: "„Ich kann bitte ein Tretboot mieten?“", hinweis: "Bei einer Ja/Nein-Frage steht das Verb vorn: „Kann ich …?“" },
        { html: "„Kann ich bitte ein Tretboot mietet?“", hinweis: "Nach „kann“ steht der Infinitiv am Ende: mieten." }
      ], danke: "„Danke! Jetzt traue ich mich.“" },
    { id: "postkarten", kat: "wortbildung", titel: "Postkarten für Oma", person: { art: 4 }, ziel: ["rathaus", "bahnhof"],
      text: (z) => "Eine Touristin möchte Postkarten für ihre Oma kaufen. " + (z.key === "rathaus" ? "Im Rathaus" : "Am Bahnhof") + " gibt es welche. Sie fragt: „Wie sage ich das richtig?“",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich möchte zwei Postkarten, bitte.“", richtig: true },
        { html: "„Ich möchte zwei Postkarte, bitte.“", hinweis: "Zwei – also Plural: die Postkarten." },
        { html: "„Ich möchte zwei Postkartes, bitte.“", hinweis: "Der Plural hat ein -n: die Postkarte – die Postkarten." }
      ], danke: "„Danke! Oma wird sich freuen.“" }
  ];
  /* FASSUNG 846 — XANDER (Walkie 315): die Bibliothek der Quests ist zu klein und wiederholt sich, es sind fast nur
     Wegbeschreibungen; die Leute sollen den Weg auch selbst finden. Dazu kommen
     • SUCHEN („zeigen"): jemand fragt nach einem Ort, einem Beruf oder etwas, das er erledigen will – man sucht das
       Gebäude selbst in der Stadt (verschieben, zoomen) und tippt es an; ein falsches Haus sagt, was es ist.
     • UHRZEIT: die Rathausuhr zeigt die echte Zeit in Deutschland („die Turmuhr … die richtige Uhrzeit … die Uhrzeit
       trainieren") – wie spät ist es, Termine umgangssprachlich sagen.
     • weitere Satz-Aufgaben: Perfekt, Modalverben, Plural, Steigerung, Dativ, trennbare Verben, Datum, Preise … */
  const BERUF = { baeckerei: ["Bäckerin", "Bäcker"], schule: ["Lehrerin", "Lehrer"], krankenhaus: ["Ärztin", "Arzt"], schmiede: ["Schmiedin", "Schmied"],
    bibliothek: ["Bibliothekarin", "Bibliothekar"], muehle: ["Müllerin", "Müller"], bergwerk: ["Bergarbeiterin", "Bergarbeiter"], rathaus: ["Bürgermeisterin", "Bürgermeister"],
    bahnhof: ["Lokführerin", "Lokführer"], gasthaus: ["Köchin", "Koch"], kuhstall: ["Bäuerin", "Bauer"], brauerei: ["Brauerin", "Brauer"], labor: ["Forscherin", "Forscher"] };
  const ERLEDIGEN = { bibliothek: "ein Buch ausleihen", baeckerei: "frische Brötchen kaufen", krankenhaus: "zum Arzt – mir tut der Bauch weh", bahnhof: "mit dem Zug nach Leipzig fahren",
    gasthaus: "zu Mittag essen", rathaus: "meinen neuen Ausweis abholen", schule: "meine Tochter von der Schule abholen", bootsverleih: "ein Tretboot mieten",
    muehle: "einen Sack Mehl kaufen", kuhstall: "frische Milch holen", huehnerstall: "frische Eier holen", schmiede: "mein Hufeisen reparieren lassen" };
  const ZAHL = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
  const stunde12 = (h) => { const x = ((h % 12) + 12) % 12; return x === 0 ? "zwölf" : x === 1 ? "eins" : ZAHL[x]; };
  /* Uhrzeit, wie man sie im Alltag sagt (auf fünf Minuten): „Viertel nach drei", „fünf vor halb vier", „halb vier" */
  function uhrText(h, m) {
    m = Math.round(m / 5) * 5; if (m === 60) { m = 0; h++; }
    const n = stunde12(h + 1), j = stunde12(h);
    if (m === 0) return (j === "eins" ? "ein" : j) + " Uhr";
    if (m === 15) return "Viertel nach " + j;
    if (m === 30) return "halb " + n;
    if (m === 45) return "Viertel vor " + n;
    if (m === 25) return "fünf vor halb " + n;
    if (m < 30) return (m === 20 ? "zwanzig" : ZAHL[m]) + " nach " + j;
    if (m > 30 && m < 45) return ZAHL[m - 30] + " nach halb " + n;
    return (60 - m === 20 ? "zwanzig" : ZAHL[60 - m]) + " vor " + n;
  }
  Q.uhrText = uhrText;
  function uhrAntworten(h, m) {
    m = Math.round(m / 5) * 5; if (m === 60) { m = 0; h++; }
    const richtig = uhrText(h, m), texte = new Set([richtig]), falsch = [];
    const kand = m === 30 ? [[h - 1, 30, "„Halb“ zählt zur nächsten Stunde: halb " + stunde12(h + 1) + " ist " + (((h % 12) + 12) % 12 || 12) + ":30."], [h, 0, "Schau auf den großen Zeiger: er steht unten auf der Sechs – also halb."]]
      : [[h, (m + 30) % 60, "Schau genau: der große Zeiger zeigt die Minuten."], [h + 1, m, "Schau genau: der kleine Zeiger zeigt die Stunde."], [h - 1, m, "Schau genau: der kleine Zeiger zeigt die Stunde."]];
    for (const [hh, mm, hin] of kand) { const t = uhrText(hh, mm); if (!texte.has(t) && falsch.length < 2) { texte.add(t); falsch.push({ html: "„Es ist " + t + ".“", hinweis: hin }); } }
    return [{ html: "„Es ist " + richtig + ".“", richtig: true }].concat(falsch);
  }
  const ORDINAL = ["", "erste", "zweite", "dritte", "vierte", "fünfte", "sechste", "siebte", "achte", "neunte", "zehnte", "elfte", "zwölfte", "dreizehnte", "vierzehnte", "fünfzehnte",
    "sechzehnte", "siebzehnte", "achtzehnte", "neunzehnte", "zwanzigste", "einundzwanzigste", "zweiundzwanzigste", "dreiundzwanzigste", "vierundzwanzigste", "fünfundzwanzigste",
    "sechsundzwanzigste", "siebenundzwanzigste", "achtundzwanzigste", "neunundzwanzigste", "dreißigste", "einunddreißigste"];
  const MONAT = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const heuteDE = () => { try { const t = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", day: "numeric", month: "numeric" }).formatToParts(new Date()); return { tag: +t.find((x) => x.type === "day").value, monat: +t.find((x) => x.type === "month").value - 1 }; } catch (e) { const d = new Date(); return { tag: d.getDate(), monat: d.getMonth() }; } };
  const kardinal = (n) => n <= 12 ? ZAHL[n] : ["dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "einundzwanzig", "zweiundzwanzig", "dreiundzwanzig", "vierundzwanzig", "fünfundzwanzig", "sechsundzwanzig", "siebenundzwanzig", "achtundzwanzig", "neunundzwanzig", "dreißig", "einunddreißig"][n - 13];
  const ALLE_ORTE = ["baeckerei", "schule", "schmiede", "brauerei", "bibliothek", "rathaus", "muehle", "huehnerstall", "kuhstall", "krankenhaus", "bergwerk", "labor", "gasthaus", "bahnhof", "bootsverleih", "fernsehturm", "koelner_dom", "holstentor", "brandenburger", "neuschwanstein"];
  VORLAGEN.push(
    { id: "such_ort", kat: "wortschatz", titel: "Wo ist das?", person: { art: 4 }, zeigen: true, ziel: ALLE_ORTE,
      text: (z) => "Eine Touristin hält ihren Stadtplan verkehrt herum: „Entschuldigung, wo ist hier " + nom(z) + "?“",
      frage: (z) => "Zeig es ihr: Such " + akk(z) + " in der Stadt und tippe darauf.", danke: "„Ach, da! Vielen Dank!“" },
    { id: "such_beruf", kat: "wortschatz", titel: "Wo arbeite ich?", person: { art: 2, er: true }, zeigen: true, ziel: Object.keys(BERUF),
      text: (z) => "Ein Mann lacht: „Ich bin neu hier und heute ist mein erster Arbeitstag. Ich bin " + BERUF[z.key][1] + ". Weißt du, wo ich arbeite?“",
      frage: () => "Such seinen Arbeitsplatz in der Stadt und tippe darauf.", danke: "„Genau! Da arbeite ich ab heute.“" },
    { id: "such_beruf_sie", kat: "wortschatz", titel: "Der erste Arbeitstag", person: { art: 1 }, zeigen: true, ziel: Object.keys(BERUF),
      text: (z) => "Eine Frau fragt: „Ich bin die neue " + BERUF[z.key][0] + ". Wo muss ich hin?“",
      frage: () => "Such ihren Arbeitsplatz in der Stadt und tippe darauf.", danke: "„Danke! Dann komme ich nicht zu spät.“" },
    { id: "such_erledigen", kat: "wortschatz", titel: "Wohin muss ich?", person: { art: 0 }, zeigen: true, ziel: Object.keys(ERLEDIGEN),
      text: (z) => "Ein älterer Herr fragt: „Ich möchte " + ERLEDIGEN[z.key] + ". Wohin muss ich gehen?“",
      frage: () => "Such den richtigen Ort in der Stadt und tippe darauf.", danke: "„Wunderbar, das ist ja ganz nah!“" },
    { id: "uhr_jetzt", kat: "uhrzeit", titel: "Wie spät ist es?", person: { art: 5, er: true }, ziel: ["rathaus"], uhr: true,
      text: () => "Ein Tourist hat sein Handy verloren und fragt: „Entschuldigung, wie spät ist es?“ Schau auf die Uhr am Rathausturm.",
      frage: "Was sagst du?", antworten: () => { const u = ST.uhr ? ST.uhr() : { h: new Date().getHours(), m: new Date().getMinutes() }; return uhrAntworten(u.h, u.m); },
      danke: "„Danke! Dann habe ich noch Zeit für einen Kaffee.“" },
    { id: "uhr_termin", kat: "uhrzeit", titel: "Ein Termin im Rathaus", person: { art: 1 }, ziel: ["rathaus"], uhr: true,
      text: (z, v) => "Eine Frau hat einen Termin im Rathaus. Auf ihrem Zettel steht „" + v.termin[0] + ":" + String(v.termin[1]).padStart(2, "0") + " Uhr“. Sie fragt: „Wie sagt man das im Alltag?“",
      frage: "Was antwortest du?", antworten: (z, v) => uhrAntworten(v.termin[0], v.termin[1]).map((a) => Object.assign({}, a, { html: a.html.replace("„Es ist ", "„Um ").replace(".“", ".“") })),
      danke: "„Danke! Dann bin ich pünktlich.“" },
    { id: "perfekt_kino", kat: "zeiten", titel: "Was hast du gestern gemacht?", person: { art: 3, klein: true }, ziel: ["brunnen", "schule", "rathaus"],
      text: () => "Ein Junge will seiner Lehrerin erzählen, was er gestern gemacht hat. Er fragt dich: „Wie sagt man das richtig?“",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich bin gestern ins Kino gegangen.“", richtig: true },
        { html: "„Ich habe gestern ins Kino gegangen.“", hinweis: "Fast! Bei „gehen“ (Bewegung) bildet man das Perfekt mit „sein“: ich bin gegangen." },
        { html: "„Ich bin gestern ins Kino gegeht.“", hinweis: "Fast! „gehen“ ist unregelmäßig: gegangen." }
      ], danke: "„Danke! Jetzt kann ich es erzählen.“" },
    { id: "modal_brunnen", kat: "verben", titel: "Nicht in den Brunnen!", person: { art: 1 }, ziel: ["brunnen"],
      text: () => "Ein Kind will in den Brunnen klettern. Die Mutter ruft – aber welches Wort ist richtig?",
      frage: "„Nein! Du … nicht in den Brunnen klettern!“",
      antworten: () => [
        { html: "„Du darfst nicht in den Brunnen klettern!“", richtig: true },
        { html: "„Du darf nicht in den Brunnen klettern!“", hinweis: "Bei „du“ hat das Verb ein -st: du darfst." },
        { html: "„Du dürfen nicht in den Brunnen klettern!“", hinweis: "„dürfen“ ist der Infinitiv. Mit „du“: du darfst." }
      ], danke: "„Siehst du? Jetzt bleibst du trocken.“" },
    { id: "plural_aepfel", kat: "wortbildung", titel: "Äpfel zählen", person: { art: 3, klein: true }, ziel: ["baeckerei", "brunnen", "kuhstall"],
      text: () => "Ein Mädchen hat auf dem Markt Äpfel gekauft und möchte es seiner Oma erzählen.",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich habe drei Äpfel gekauft.“", richtig: true },
        { html: "„Ich habe drei Apfel gekauft.“", hinweis: "Drei – also Plural: der Apfel, die Äpfel." },
        { html: "„Ich habe drei Äpfeln gekauft.“", hinweis: "Das -n kommt nur im Dativ dazu (mit den Äpfeln). Hier: drei Äpfel." }
      ], danke: "„Danke! Oma backt jetzt Apfelkuchen.“" },
    { id: "steigerung", kat: "wortbildung", titel: "Was ist höher?", person: { art: 3, klein: true }, ziel: ["fernsehturm", "koelner_dom"],
      text: (z) => "Zwei Kinder streiten: Was ist höher – " + nom(z) + " oder das Rathaus? Du weißt es.",
      frage: "Welcher Satz ist richtig?",
      antworten: (z) => [
        { html: "„" + Nom(z) + " ist höher als das Rathaus.“", richtig: true },
        { html: "„" + Nom(z) + " ist hoher als das Rathaus.“", hinweis: "„hoch“ ist besonders: hoch – höher – am höchsten." },
        { html: "„" + Nom(z) + " ist mehr hoch als das Rathaus.“", hinweis: "Im Deutschen steigert man mit -er: höher." }
      ], danke: "„Siehst du, ich hatte recht!“" },
    { id: "arzt", kat: "faelle", titel: "Beim Arzt", person: { art: 2, er: true }, ziel: ["krankenhaus"],
      text: () => "Ein Mann hat Kopfschmerzen und muss es gleich der Ärztin im Krankenhaus sagen. Er fragt dich: „Wie sage ich das?“",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Mir tut der Kopf weh.“", richtig: true },
        { html: "„Ich tut der Kopf weh.“", hinweis: "Bei „wehtun“ steht die Person im Dativ: mir." },
        { html: "„Mir tun der Kopf weh.“", hinweis: "Der Kopf – eins, also: tut. (Die Füße tun weh.)" }
      ], danke: "„Danke! Hoffentlich geht es mir bald besser.“" },
    { id: "vorstellen", kat: "verben", titel: "Das neue Kind", person: { art: 3, klein: true }, ziel: ["schule"],
      text: () => "Ein neues Mädchen soll sich morgen in der Klasse vorstellen. Es ist nervös und übt mit dir.",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich heiße Mia und bin acht Jahre alt.“", richtig: true },
        { html: "„Ich heiße Mia und habe acht Jahre.“", hinweis: "Im Deutschen „ist“ man so alt: ich bin acht Jahre alt." },
        { html: "„Ich heiße Mia und bin acht Jahren alt.“", hinweis: "Fast! Es heißt „acht Jahre“ – ohne n." }
      ], danke: "„Danke! Jetzt bin ich nicht mehr so aufgeregt.“" },
    { id: "zurueckgeben", kat: "wortstellung", titel: "In der Bibliothek", person: { art: 2, er: true }, ziel: ["bibliothek"],
      text: () => "Ein Student möchte ein Buch zurückgeben. Er fragt dich, wie er das an der Theke sagt.",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich möchte das Buch zurückgeben.“", richtig: true },
        { html: "„Ich möchte das Buch geben zurück.“", hinweis: "Nach „möchte“ steht das ganze Verb zusammen am Ende: zurückgeben." },
        { html: "„Ich möchte zurück das Buch geben.“", hinweis: "Das Verb steht am Ende und bleibt zusammen: … das Buch zurückgeben." }
      ], danke: "„Danke! Das Buch war übrigens sehr spannend.“" },
    { id: "schnitzel", kat: "artikel", titel: "Im Gasthaus bestellen", person: { art: 5, er: true }, ziel: ["gasthaus"],
      text: () => "Ein Wanderer aus England möchte im Gasthaus ein Schnitzel bestellen.",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich hätte gern ein Schnitzel, bitte.“", richtig: true },
        { html: "„Ich hätte gern einen Schnitzel, bitte.“", hinweis: "Es heißt „das Schnitzel“ – also „ein Schnitzel“." },
        { html: "„Ich hätte gern eine Schnitzel, bitte.“", hinweis: "Es heißt „das Schnitzel“ – also „ein Schnitzel“." }
      ], danke: "„Lecker! Danke schön!“" },
    { id: "zug_an", kat: "wortstellung", titel: "Der Zug hat Verspätung", person: { art: 0 }, ziel: ["bahnhof"],
      text: () => "Der Zug hat Verspätung. Eine ältere Dame möchte am Schalter fragen, wann er kommt.",
      frage: "Welche Frage ist richtig?",
      antworten: () => [
        { html: "„Wann kommt der Zug an?“", richtig: true },
        { html: "„Wann der Zug kommt an?“", hinweis: "Bei einer W-Frage steht das Verb an zweiter Stelle: Wann kommt …?" },
        { html: "„Wann kommt an der Zug?“", hinweis: "„an“ gehört zu „ankommen“ und steht ganz am Ende." }
      ], danke: "„Danke, junger Mensch!“" },
    { id: "mehl", kat: "wortbildung", titel: "Beim Müller", person: { art: 1 }, ziel: ["muehle"],
      text: () => "Eine Frau möchte beim Müller Mehl für einen Kuchen kaufen.",
      frage: "Welcher Satz ist richtig?",
      antworten: () => [
        { html: "„Ich brauche zwei Kilo Mehl.“", richtig: true },
        { html: "„Ich brauche zwei Kilos Mehl.“", hinweis: "Maßangaben bleiben ohne Plural: zwei Kilo." },
        { html: "„Ich brauche zwei Kilo Mehls.“", hinweis: "Nach der Menge folgt das Wort einfach so: zwei Kilo Mehl." }
      ], danke: "„Danke! Jetzt kann ich backen.“" },
    { id: "schluessel", kat: "faelle", titel: "Der Schlüssel ist weg", person: { art: 4, weint: true }, ziel: ["gasthaus", "rathaus", "bibliothek", "brunnen"],
      text: (z) => "Eine Frau sucht verzweifelt ihren Schlüssel. Du hast ihn gesehen: Er liegt auf dem Tisch vor " + dat(z) + ".",
      frage: "Was sagst du ihr?",
      antworten: (z) => [
        { html: "„Ihr Schlüssel liegt auf dem Tisch vor " + dat(z) + ".“", richtig: true },
        { html: "„Ihr Schlüssel liegt auf den Tisch vor " + dat(z) + ".“", hinweis: "Wo? → Dativ: auf dem Tisch." },
        { html: "„Ihr Schlüssel liegt auf der Tisch vor " + dat(z) + ".“", hinweis: "Es heißt „der Tisch“, im Dativ: auf dem Tisch." }
      ], danke: "„Oh, danke! Ohne Schlüssel komme ich nicht nach Hause.“" },
    { id: "preis", kat: "zahlen", titel: "Was kostet die Führung?", person: { art: 5, er: true }, ziel: ["koelner_dom", "holstentor", "neuschwanstein", "fernsehturm", "brandenburger"],
      text: (z) => "Auf einem Schild steht: „Führung durch " + akk(z) + ": 7,50 €“. Ein Tourist fragt: „Wie liest man den Preis?“",
      frage: "Was sagst du?",
      antworten: () => [
        { html: "„Sieben Euro fünfzig.“", richtig: true },
        { html: "„Sieben Komma fünfzig Euro.“", hinweis: "Bei Preisen sagt man die Euro und dann die Cent: sieben Euro fünfzig." },
        { html: "„Sieben Euros fünfzig.“", hinweis: "„Euro“ bleibt im Plural ohne s: sieben Euro." }
      ], danke: "„Danke! Das ist ein guter Preis.“" },
    { id: "datum", kat: "zahlen", titel: "Welcher Tag ist heute?", person: { art: 0 }, ziel: ["rathaus", "bahnhof", "bibliothek"],
      text: () => "Ein älterer Herr möchte ein Formular ausfüllen und fragt: „Welches Datum haben wir heute?“",
      frage: "Was antwortest du?",
      antworten: () => { const d = heuteDE(), mo = MONAT[d.monat]; return [
        { html: "„Heute ist der " + ORDINAL[d.tag] + " " + mo + ".“", richtig: true },
        { html: "„Heute ist der " + kardinal(d.tag) + " " + mo + ".“", hinweis: "Beim Datum braucht man die Ordnungszahl: der " + ORDINAL[d.tag] + "." },
        { html: "„Heute ist die " + ORDINAL[d.tag] + " " + mo + ".“", hinweis: "Es heißt „der Tag“ – also: der " + ORDINAL[d.tag] + " " + mo + "." }
      ]; }, danke: "„Vielen Dank, das hatte ich ganz vergessen!“" },
    { id: "geburtstag", kat: "stil", titel: "Ein Geburtstag am Brunnen", person: { art: 3, klein: true }, ziel: ["brunnen"],
      text: () => "Am Brunnen feiert ein Kind Geburtstag. Seine Freundin aus Polen möchte gratulieren.",
      frage: "Was sagt man?",
      antworten: () => [
        { html: "„Alles Gute zum Geburtstag!“", richtig: true },
        { html: "„Alles Gut zum Geburtstag!“", hinweis: "Fast! Es heißt „Alles Gute“ – mit e." },
        { html: "„Guten Geburtstag!“", hinweis: "So sagt man das nicht. Richtig ist: „Alles Gute zum Geburtstag!“" }
      ], danke: "„Danke! Willst du ein Stück Kuchen?“" }
  );
  /* =====================================================================
     4b. FASSUNG 875 — NIVEAU A1–C2 UND MISSIONEN NACH STAND DER STADT
     XANDER (Funk 257): „wie das Dorf sich entwickelt so erwachsen auch die Aufgaben und Fragen oder die Leute denen man
     unterwegs begegnet z.B ein Wissenschaftler der etwas über den aktuellen Entwicklungsstand wissen möchte vielleicht
     von A1 bis C2“.
     Die bisherigen Missionen sind A1 und A2 (Kannbeschreibungen Goethe/telc: Alltag, Zahlen, Wege, einfache Sätze).
     Die neuen steigen: A1/A2 kurze Hauptsätze, B1 Perfekt, Nebensätze (weil, wenn, damit), Ratschläge, Höflichkeit;
     B2 Meinung begründen, Konjunktiv II, Passiv mit Modalverb, obwohl/denn; C1 Fachgespräch (Entwicklungsstand,
     Handlungsbedarf, Antrag im Nominalstil, zu-Infinitiv, Rektion); C2 Hypothesen, Ironie, indirekte Rede im
     Konjunktiv I, feine Rektion („dazu raten“), „es sei denn“.
     Jede neue Mission: braucht (eines dieser Gebäude muss stehen), stand (Bedingung an die Stadt), vars (liest die
     Stadt), pruefe (FREI-Prüfung: Aufgabe erfüllt? Stimmt es für deine Stadt? Grammatik?), woerter (Wortliste für
     die Erkennung) und frei (Tipp, wenn ein Satz nicht zur Aufgabe passt).
     ===================================================================== */
  const NIVEAUS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const NIVEAU_ALT = { weg_rathaus: "A2", weg_bahnhof: "A2", weg_krankenhaus: "A2", weg_gasthaus: "A2", weg_wahrzeichen: "A2", hund: "A2", eis: "A1", schirm: "A1",
    baeckerei: "A1", fahrkarte: "A1", betonung_haus: "A1", betonung_wort: "A2", artikel_ort: "A1", sie_du: "A2", tretboot: "A1", postkarten: "A1", such_ort: "A1",
    such_beruf: "A1", such_beruf_sie: "A1", such_erledigen: "A2", uhr_jetzt: "A1", uhr_termin: "A2", perfekt_kino: "A2", modal_brunnen: "A1", plural_aepfel: "A1",
    steigerung: "A2", arzt: "A2", vorstellen: "A1", zurueckgeben: "A2", schnitzel: "A1", zug_an: "A2", mehl: "A1", schluessel: "A2", preis: "A1", datum: "A2", geburtstag: "A1" };
  for (const v of VORLAGEN) v.niveau = NIVEAU_ALT[v.id] || "A2";
  /* Gebäude als { key, g, name } – auch die späten und solche, die (noch) nicht stehen */
  const GEB = (k) => (NAMEN_ALLE[k] ? { key: k, g: NAMEN_ALLE[k][0], name: NAMEN_ALLE[k][1] } : null);
  /* unbestimmter Artikel: Nominativ, Akkusativ, Dativ, „kein“ im Akkusativ; der falsche Akkusativ der ein-Familie */
  const EINF = { der: ["ein", "einen", "einem", "keinen"], die: ["eine", "eine", "einer", "keine"], das: ["ein", "ein", "einem", "kein"] };
  const FALSCH_A = { der: "ein", die: "einen", das: "einen" }, FALSCH_K = { der: "kein", die: "keinen", das: "keinen" };
  const einN = (z) => EINF[z.g][0] + " " + z.name, einA = (z) => EINF[z.g][1] + " " + z.name, einD = (z) => EINF[z.g][2] + " " + z.name, keinA = (z) => EINF[z.g][3] + " " + z.name;
  const PRON = { der: "er", die: "sie", das: "es" };
  /* wie ein Gebäude im gesprochenen Satz vorkommt (klein, ohne Satzzeichen) */
  const ALIAS = { koelner_dom: ["kölner dom", "dom"], neuschwanstein: ["schloss neuschwanstein", "neuschwanstein"], brandenburger: ["brandenburger tor", "brandenburger"],
    holzhuette: ["holzfällerhütte", "holzhütte"], krankenhaus: ["krankenhaus", "klinik"], bibliothek: ["bibliothek", "bücherei"], gasthaus: ["gasthaus", "gasthof", "wirtshaus"],
    sternwarte: ["sternwarte", "observatorium"], labor: ["labor", "forschungslabor"], bahnhof: ["bahnhof"], bergwerk: ["bergwerk", "mine"] };
  const namenVon = (k) => ALIAS[k] || (NAMEN_ALLE[k] ? [fw(NAMEN_ALLE[k][1]).trim()] : [k]);
  const nennt = (T, k) => namenVon(k).some((a) => T.indexOf(" " + a + " ") >= 0 || T.indexOf(" " + a + "s ") >= 0);
  const genannt = (T) => Object.keys(NAMEN_ALLE).filter((k) => nennt(T, k));
  /* Zahlen im Satz: Ziffern und Zahlwörter (nicht „ein/eine“) */
  function zahlenIn(T) {
    const aus = [];
    for (const w of T.trim().split(" ")) {
      if (/^\d+$/.test(w)) aus.push(parseInt(w, 10));
      else if (w === "eins") aus.push(1);
      else { const i = ZAHL.indexOf(w); if (i >= 2) aus.push(i); else for (let n = 13; n <= 31; n++) if (kardinal(n) === w) aus.push(n); }
    }
    return aus;
  }
  const woerterZahl = (T) => T.trim().split(" ").length;
  /* „es gibt / haben / bauen“ + unbestimmter Artikel vor dem Gebäude: stimmt der Akkusativ? */
  function artikelAkk(T, H, wozu) {
    const m = new RegExp(" (ein|eine|einen|einem|einer|kein|keine|keinen|keinem|keiner) (?:[a-zäöüß]+ )?" + namenVon(H.key)[0] + " ").exec(T);
    if (!m) return null;
    const soll = m[1][0] === "k" ? EINF[H.g][3] : EINF[H.g][1];
    return m[1] === soll ? null : "Fast! " + wozu + " braucht den Akkusativ: " + nom(H) + " → " + soll + " " + H.name + ".";
  }
  /* was der Stadt noch fehlt (nicht gebaut, nicht im Bau) – in dieser Reihenfolge */
  const PRIO = ["labor", "sternwarte", "krankenhaus", "bibliothek", "schule", "gasthaus", "brauerei", "marktstand", "muehle", "baeckerei"];
  const fehltDer = (S) => GEB(PRIO.find((k) => !S.da.has(k) && !S.bau.some((b) => b.key === k)) || "");
  const FORSCH = ["labor", "bibliothek", "schule", "sternwarte"];
  const ausLabor = (z) => (z.key === "labor" ? "aus dem Labor" : "von der Universität");
  /* warum man ein Gebäude bauen sollte: als Nebensatz (Verb am Ende) und als Hauptsatz (der typische Fehler nach „weil“) */
  const GRUND = { labor: ["die Forschung für die Zukunft wichtig ist", "die Forschung ist für die Zukunft wichtig"],
    sternwarte: ["die Kinder dort viel über die Sterne lernen könnten", "die Kinder könnten dort viel über die Sterne lernen"],
    krankenhaus: ["die Menschen eine gute Versorgung brauchen", "die Menschen brauchen eine gute Versorgung"],
    bibliothek: ["Bücher für alle zugänglich sein sollten", "Bücher sollten für alle zugänglich sein"], schule: ["Bildung das Wichtigste ist", "Bildung ist das Wichtigste"],
    gasthaus: ["Besucher einen Ort zum Übernachten brauchen", "Besucher brauchen einen Ort zum Übernachten"], brauerei: ["ein eigenes Bier Arbeitsplätze schafft", "ein eigenes Bier schafft Arbeitsplätze"],
    marktstand: ["frisches Obst und Gemüse in jede Stadt gehören", "frisches Obst und Gemüse gehören in jede Stadt"], muehle: ["die Bäckerei Mehl braucht", "die Bäckerei braucht Mehl"],
    baeckerei: ["frisches Brot jeden Morgen dazugehört", "frisches Brot gehört jeden Morgen dazu"], park: ["Grünflächen gut für die Gesundheit sind", "Grünflächen sind gut für die Gesundheit"] };
  const BEREICH = { labor: "bei der Forschung", sternwarte: "bei der Wissenschaft", krankenhaus: "bei der Gesundheitsversorgung", bibliothek: "bei der Bildung",
    schule: "bei der Bildung", gasthaus: "beim Tourismus", brauerei: "bei der Wirtschaft", marktstand: "bei der Nahversorgung", muehle: "bei der Versorgung", baeckerei: "bei der Versorgung" };
  const MIT_GRUND = / (weil|da|denn|deshalb|deswegen|darum|daher|schließlich|nämlich|damit|sodass|obwohl|zwar|aber) /;

  const NEU = [
    /* ---------- A1 ---------- */
    { id: "forscher_gibt", niveau: "A1", kat: "artikel", titel: "Eine Forscherin zählt Gebäude", person: { art: 1 }, braucht: FORSCH, ziel: ["labor", "bibliothek", "schule"],
      vars: (S, z) => {
        const kand = ["krankenhaus", "bibliothek", "schule", "gasthaus", "baeckerei", "brauerei", "muehle", "schmiede", "labor", "sternwarte", "kaserne", "bergwerk", "marktstand", "gefaengnis", "kuhstall", "huehnerstall", "flickstube"]
          .filter((k) => k !== z.key && !S.bau.some((b) => b.key === k));
        const ja = kand.filter((k) => S.da.has(k)), nein = kand.filter((k) => !S.da.has(k));
        const l = (zufall() < 0.5 && ja.length) || !nein.length ? ja : nein; if (!l.length) return null;
        const k = wahl(l); return { haus: GEB(k), da: S.da.has(k) };
      },
      text: (z, v) => "Eine Forscherin " + ausLabor(z) + " macht eine Studie über deine Stadt. Sie fragt: „Gibt es hier " + einA(v.haus) + "?“",
      frage: "Schau in deine Stadt. Was antwortest du?",
      antworten: (z, v) => { const H = v.haus, akk = "Fast! „es gibt“ braucht den Akkusativ: " + nom(H) + " → " + einA(H) + "."; return v.da ? [
        { html: "„Ja, es gibt " + einA(H) + ".“", richtig: true },
        { html: "„Ja, es gibt " + FALSCH_A[H.g] + " " + H.name + ".“", hinweis: akk },
        { html: "„Nein, es gibt " + keinA(H) + ".“", hinweis: "Schau noch einmal in deine Stadt: " + Nom(H) + " steht schon da." }] : [
        { html: "„Nein, es gibt " + keinA(H) + ".“", richtig: true },
        { html: "„Nein, es gibt " + FALSCH_K[H.g] + " " + H.name + ".“", hinweis: "Fast! „es gibt“ braucht den Akkusativ: " + nom(H) + " → " + keinA(H) + "." },
        { html: "„Ja, es gibt " + einA(H) + ".“", hinweis: "Schau noch einmal: " + Nom(H) + " gibt es in deiner Stadt noch nicht." }]; },
      danke: "„Danke! Das schreibe ich in meine Studie.“",
      pruefe: (T, qu) => {
        const H = qu.vars.haus, da = qu.vars.da;
        const nein = / (nein|kein|keine|keinen|keiner|nicht|leider) /.test(T), ja = !nein && / (ja|klar|natürlich|genau|gibt|haben|steht|hat) /.test(T);
        if (!ja && !nein) return null;
        if (!nennt(T, H.key) && !/ (gibt|haben|hat|steht) /.test(T)) return { fehlt: "Antworte mit einem ganzen Satz: „" + (da ? "Ja, es gibt " + einA(H) : "Nein, es gibt " + keinA(H)) + ".“" };
        if (nein && da) return { falsch: "Schau noch einmal in deine Stadt: " + Nom(H) + " steht schon da." };
        if (ja && !da) return { falsch: "Schau noch einmal: " + Nom(H) + " gibt es in deiner Stadt noch nicht." };
        const f = artikelAkk(T, H, "„es gibt“"); if (f) return { fehler: f };
        return { ok: true, antwort: da ? "„Prima – " + nom(H) + " kommt auf meine Liste.“" : "„Danke! Vielleicht baut die Stadt ja bald " + einA(H) + ".“" };
      },
      woerter: (z, v) => [v.haus.name, "Forscherin", "Studie"], frei: "Sag, ob es das Gebäude in deiner Stadt gibt: „Ja, es gibt …“ oder „Nein, es gibt kein …“." },
    { id: "bahnhof_gleis", niveau: "A1", kat: "zahlen", titel: "Welches Gleis?", person: { art: 2, er: true }, ziel: ["bahnhof"],
      vars: () => ({ gleis: 1 + Math.floor(zufall() * 9) }),
      text: (z, v) => "Ein Reisender mit Koffer fragt: „Entschuldigung, von welchem Gleis fährt der Zug nach " + v.stadt + "?“ Auf der Anzeigetafel steht: " + v.stadt + " · 14:10 Uhr · Gleis " + v.gleis + ".",
      frage: "Lies die Tafel. Was sagst du?",
      antworten: (z, v) => [
        { html: "„Der Zug fährt von Gleis " + ZAHL[v.gleis] + ".“", richtig: true },
        { html: "„Der Zug fahrt von Gleis " + ZAHL[v.gleis] + ".“", hinweis: "Fast! „fahren“ hat bei er, sie, es einen Umlaut: Der Zug fährt …" },
        { html: "„Der Zug fährt nach Gleis " + ZAHL[v.gleis] + ".“", hinweis: "Fast! Der Zug fährt „von“ Gleis " + ZAHL[v.gleis] + " ab – nicht „nach“." }],
      danke: "„Danke! Dann muss ich mich beeilen.“",
      pruefe: (T, qu) => {
        const g = qu.vars.gleis, z = zahlenIn(T), ORD = ["", "erste", "zweite", "dritte", "vierte", "fünfte", "sechste", "siebte", "achte", "neunte"];
        const ord = ORD.findIndex((o, i) => i && new RegExp(" " + o + "n? ").test(T));
        if (!/ (gleis|gleise|bahnsteig|fährt|fahrt|zug) /.test(T) && !z.length) return null;
        if (z.indexOf(g) < 0) { if (ord === g) return { fehler: "Fast! Bei Gleisen sagt man die Grundzahl: Gleis " + ZAHL[g] + "." }; return z.length || ord > 0 ? { falsch: "Schau noch einmal auf die Tafel: Gleis " + g + "." } : { fehlt: "Sag auch, von welchem Gleis: „Der Zug fährt von Gleis " + ZAHL[g] + ".“" }; }
        if (/ fahrt /.test(T)) return { fehler: "Fast! „fahren“ hat bei er, sie, es einen Umlaut: Der Zug fährt …" };
        if (/ nach gleis /.test(T)) return { fehler: "Fast! Der Zug fährt „von“ (oder „auf“) Gleis " + ZAHL[g] + " ab – nicht „nach“." };
        return { ok: true, antwort: "„Gleis " + ZAHL[g] + " – danke! Dann muss ich mich beeilen.“" };
      },
      woerter: (z, v) => ["Gleis", v.stadt, "Anzeigetafel"], frei: "Sag, von welchem Gleis der Zug fährt – die Tafel hilft dir." },
    { id: "fischer_fang", niveau: "A1", kat: "wortbildung", titel: "Ein guter Fang", person: { art: 5, er: true }, ziel: ["bootsverleih"],
      vars: () => ({ n: 2 + Math.floor(zufall() * 5) }),
      text: (z, v) => "Ein Fischer kommt vom See und zeigt dir seinen Eimer. Er lacht: „Rate mal! Wie viele Fische habe ich heute gefangen?“ Im Eimer: " + "🐟".repeat(v.n),
      frage: "Zähl nach. Was antwortest du?",
      antworten: (z, v) => [
        { html: "„Du hast " + ZAHL[v.n] + " Fische gefangen.“", richtig: true },
        { html: "„Du hast " + ZAHL[v.n] + " Fisch gefangen.“", hinweis: "Fast! Mehr als einer – also Plural: der Fisch, die Fische." },
        { html: "„Du hast " + ZAHL[v.n] + " Fischen gefangen.“", hinweis: "Fast! Das -n gehört nur in den Dativ (mit den Fischen). Hier: " + ZAHL[v.n] + " Fische." }],
      danke: "„Richtig! Heute Abend gibt es Fisch.“",
      pruefe: (T, qu) => {
        const n = qu.vars.n, z = zahlenIn(T);
        if (!/ (fisch|fische|fischen|fischs|gefangen) /.test(T) && !z.length) return null;
        if (!z.length) return { fehlt: "Sag auch, wie viele: Zähl die Fische im Eimer." };
        if (z.indexOf(n) < 0) return { falsch: "Zähl noch einmal: Im Eimer sind " + ZAHL[n] + " Fische." };
        if (/ fischen /.test(T) && !/ (den|mit|von|zu|bei|aus) fischen /.test(T)) return { fehler: "Fast! Das -n gehört nur in den Dativ (mit den Fischen). Hier: " + ZAHL[n] + " Fische." };
        if (new RegExp(" (" + ZAHL[n] + "|" + n + ") fischs? ").test(T)) return { fehler: "Fast! Mehr als einer – also Plural: der Fisch, die Fische." };
        return { ok: true, antwort: n >= 5 ? "„Genau! Heute Abend gibt es Fisch für alle.“" : "„Richtig! Nicht viel – aber lecker.“" };
      },
      woerter: ["Eimer", "gefangen", "See"], frei: "Sag, wie viele Fische der Fischer gefangen hat." },
    { id: "krankenhaus_befinden", niveau: "A1", kat: "faelle", titel: "Wie geht es Ihnen?", person: { art: 1 }, ziel: ["krankenhaus"],
      text: () => "Du warst krank und gehst zur Kontrolle ins Krankenhaus. Die Ärztin fragt: „Guten Tag! Wie geht es Ihnen heute?“",
      frage: "Was antwortest du?",
      antworten: () => [
        { html: "„Mir geht es gut, danke.“", richtig: true },
        { html: "„Ich geht es gut, danke.“", hinweis: "Fast! Bei „Wie geht es …?“ steht die Person im Dativ: Mir geht es gut." },
        { html: "„Mich geht es gut, danke.“", hinweis: "Fast! Nicht „mich“ (Akkusativ), sondern „mir“ (Dativ): Mir geht es gut." }],
      danke: "„Das freut mich! Dann machen wir nur eine kurze Kontrolle.“",
      pruefe: (T) => {
        if (/ (ich|mich) geht /.test(T)) return { fehler: "Fast! Bei „Wie geht es …?“ steht die Person im Dativ: Mir geht es gut." };
        if (/ ich bin (gut|super|okay|ok|prima|toll) /.test(T) && !/ geht /.test(T)) return { fehler: "Fast! „Ich bin gut“ heißt: Ich kann etwas gut. Beim Befinden sagt man: Mir geht es gut." };
        if (!/ (geht|gut|schlecht|besser|super|prima|toll|okay|ok|müde|krank|lala|bestens|wunderbar|ausgezeichnet|schlimm) /.test(T)) return null;
        return { ok: true, antwort: / (schlecht|nicht so gut|nicht gut|müde|krank|schlimm|weh) /.test(T) ? "„Oh, das tut mir leid. Ich schaue mir das gleich genau an.“" : "„Das freut mich! Dann machen wir nur eine kurze Kontrolle.“" };
      },
      woerter: ["Ärztin", "Kontrolle", "danke"], frei: "Sag der Ärztin, wie es dir geht: „Mir geht es …“." },
    { id: "rathaus_stadtname", niveau: "A1", kat: "artikel", titel: "Ein Formular im Rathaus", person: { art: 1 }, ziel: ["rathaus"],
      stand: (S) => !!S.name, vars: (S) => (S.name ? { name: S.name } : null),
      text: () => "Eine Beamtin im Rathaus füllt ein Formular für dich aus. Sie fragt: „Wie heißt Ihre Stadt?“",
      frage: "Was antwortest du?",
      antworten: (z, v) => [
        { html: "„Meine Stadt heißt " + esc(v.name) + ".“", richtig: true },
        { html: "„Mein Stadt heißt " + esc(v.name) + ".“", hinweis: "Fast! Es heißt „die Stadt“ – also „meine Stadt“." },
        { html: "„Meine Stadt heiße " + esc(v.name) + ".“", hinweis: "Fast! „meine Stadt“ ist „sie“ – also „heißt“: Meine Stadt heißt …" }],
      danke: "„Danke, das trage ich gleich ein.“",
      pruefe: (T, qu) => {
        const name = qu.vars.name, nm = fw(name).trim();
        if (/ mein stadt /.test(T)) return { fehler: "Fast! Es heißt „die Stadt“ – also „meine Stadt“." };
        if (/ stadt heiße /.test(T)) return { fehler: "Fast! „meine Stadt“ ist „sie“ – also „heißt“: Meine Stadt heißt " + name + "." };
        if (T.indexOf(" " + nm + " ") < 0) return / (heißt|heiße|heißen|name|stadt|wohne) /.test(T) ? { fehlt: "Sag den Namen deiner Stadt: " + name + "." } : null;
        if (woerterZahl(T) < 3) return { fehlt: "Sag es als ganzen Satz: „Meine Stadt heißt " + name + ".“" };
        return { ok: true, antwort: "„" + name + " – ein schöner Name! Das trage ich gleich ein.“" };
      },
      woerter: (z, v) => [v.name, "Formular", "Rathaus"], frei: "Sag, wie deine Stadt heißt: „Meine Stadt heißt …“." },
    /* ---------- A2 ---------- */
    { id: "bau_kran", niveau: "A2", kat: "artikel", titel: "Was baut ihr da?", person: { art: 3, klein: true }, ziel: ["rathaus", "schule", "brunnen", "baeckerei"],
      stand: (S) => S.bau.some((b) => GEB(b.key)),
      vars: (S) => { const b = S.bau.find((x) => x.neu && GEB(x.key)) || S.bau.find((x) => GEB(x.key)); return b ? { bau: GEB(b.key), neu: b.neu } : null; },
      text: () => "Ein Kind zeigt auf den Baukran: „Was baut ihr da?“",
      frage: "Schau, was in deiner Stadt gerade gebaut wird. Was sagst du?",
      antworten: (z, v) => { const B = v.bau; return v.neu ? [
        { html: "„Wir bauen gerade " + einA(B) + ".“", richtig: true },
        { html: "„Wir bauen gerade " + FALSCH_A[B.g] + " " + B.name + ".“", hinweis: "Fast! „bauen“ braucht den Akkusativ: " + nom(B) + " → " + einA(B) + "." },
        { html: "„Wir baut gerade " + einA(B) + ".“", hinweis: "Fast! Mit „wir“ heißt es „wir bauen“." }] : [
        { html: "„Wir bauen " + akk(B) + " aus.“", richtig: true },
        { html: "„Wir ausbauen " + akk(B) + ".“", hinweis: "Fast! „ausbauen“ ist trennbar: Wir bauen " + akk(B) + " aus." },
        { html: "„Wir baut " + akk(B) + " aus.“", hinweis: "Fast! Mit „wir“ heißt es „wir bauen“." }]; },
      danke: "„Cool! Darf ich zuschauen, wenn die Bauleute arbeiten?“",
      pruefe: (T) => {
        const S = stadtStand(), im = S.bau.map((b) => GEB(b.key)).filter(Boolean), B = im.find((h) => nennt(T, h.key));
        if (!B) {
          const fertig = genannt(T).find((k) => S.da.has(k) && !S.bau.some((b) => b.key === k));
          if (fertig) return { falsch: Nom(GEB(fertig)) + " steht schon fertig da. Gebaut wird gerade: " + im.map(nom).join(", ") + "." };
          return / (bauen|baut|bau|kran|baustelle) /.test(T) ? { fehlt: "Sag auch, was gebaut wird – schau auf die Baustelle." } : null;
        }
        if (/ wir baut /.test(T)) return { fehler: "Fast! Mit „wir“ heißt es „wir bauen“." };
        if (/ wir ausbauen /.test(T)) return { fehler: "Fast! „ausbauen“ ist trennbar: Wir bauen " + akk(B) + " aus." };
        const f = artikelAkk(T, B, "„bauen“"); if (f) return { fehler: f };
        return { ok: true, antwort: "„Cool! Darf ich zuschauen, wenn die Bauleute arbeiten?“" };
      },
      woerter: (z, v) => [v.bau.name, "Baukran", "gerade"], frei: "Sag, was in deiner Stadt gerade gebaut wird: „Wir bauen gerade …“." },
    { id: "reisende_uebernachten", niveau: "A2", kat: "praepositionen", titel: "Der letzte Zug ist weg", person: { art: 4 }, ziel: ["gasthaus"],
      text: () => "Eine Reisende kommt vom Bahnhof: „Mein Zug ist ausgefallen. Wo kann ich hier übernachten?“",
      frage: "Was empfiehlst du ihr?",
      antworten: () => [
        { html: "„Im Gasthaus können Sie übernachten.“", richtig: true },
        { html: "„Im Gasthaus Sie können übernachten.“", hinweis: "Fast! Das Verb steht an zweiter Stelle: Im Gasthaus können Sie übernachten." },
        { html: "„In Gasthaus können Sie übernachten.“", hinweis: "Fast! in + dem = im: im Gasthaus." }],
      danke: "„Super, danke! Dann schlafe ich heute im Gasthaus.“",
      pruefe: (T) => {
        if (/ (hotel|pension|hostel|jugendherberge) /.test(T) && !/ (gasthaus|gasthof) /.test(T)) return { fehlt: "Ein Hotel gibt es in deiner Stadt nicht – wo kann man hier übernachten?" };
        if (!/ (gasthaus|gasthof|wirtshaus|zimmer) /.test(T)) return null;
        if (/ (im|in dem) (gasthaus|gasthof) (sie|du|man) (können|kannst|kann|könnten|könnte|dürfen) /.test(T)) return { fehler: "Fast! Das Verb steht an zweiter Stelle: Im Gasthaus können Sie übernachten." };
        if (/ in (gasthaus|gasthof) /.test(T)) return { fehler: "Fast! in + dem = im: im Gasthaus." };
        if (/ in das (gasthaus|gasthof) /.test(T) && / übernacht/.test(T)) return { fehler: "Fast! Wo? → Dativ: im Gasthaus übernachten." };
        return { ok: true, antwort: "„Super, danke! Dann schlafe ich heute im Gasthaus.“" };
      },
      woerter: ["Gasthaus", "übernachten", "Zimmer"], frei: "Sag ihr, wo man in deiner Stadt übernachten kann." },
    { id: "krankenhaus_besuch", niveau: "A2", kat: "uhrzeit", titel: "Blumen für Oma", person: { art: 3, klein: true }, ziel: ["krankenhaus"],
      vars: () => ({ zeit: wahl([[14, 18], [15, 19], [10, 12], [16, 20]]) }),
      text: (z, v) => "Ein Junge mit Blumen fragt: „Meine Oma liegt im Krankenhaus. Wann kann ich sie besuchen?“ Am Eingang steht: Besuchszeit " + v.zeit[0] + " bis " + v.zeit[1] + " Uhr.",
      frage: "Was antwortest du?",
      antworten: (z, v) => [
        { html: "„Du kannst sie von " + v.zeit[0] + " bis " + v.zeit[1] + " Uhr besuchen.“", richtig: true },
        { html: "„Du kannst sie von " + v.zeit[0] + " bis " + v.zeit[1] + " Uhr besuchst.“", hinweis: "Fast! Nach „kannst“ steht der Infinitiv am Ende: … besuchen." },
        { html: "„Du kannst sie seit " + v.zeit[0] + " bis " + v.zeit[1] + " Uhr besuchen.“", hinweis: "Fast! Für eine Zeitspanne sagt man „von … bis …“." }],
      danke: "„Danke! Oma freut sich bestimmt.“",
      pruefe: (T, qu) => {
        const [a, b] = qu.vars.zeit, z = zahlenIn(T), passt = (h) => z.indexOf(h) >= 0 || z.indexOf(h - 12) >= 0;
        if (!z.length) return / (besuchen|besuch|kannst|darfst|uhr|nachmittag|heute|abends) /.test(T) ? { fehlt: "Sag auch, wann: von " + a + " bis " + b + " Uhr." } : null;
        if (!passt(a) || !passt(b)) return { falsch: "Schau noch einmal aufs Schild: Besuchszeit von " + a + " bis " + b + " Uhr." };
        if (/ besuchst /.test(T) && / (kannst|darfst|kann|darf) /.test(T)) return { fehler: "Fast! Nach „kannst“ steht der Infinitiv am Ende: … besuchen." };
        if (/ seit [^ ]+ (uhr )?bis /.test(T)) return { fehler: "Fast! Für eine Zeitspanne sagt man „von … bis …“." };
        return { ok: true, antwort: "„Danke! Dann bringe ich Oma die Blumen um " + a + " Uhr.“" };
      },
      woerter: ["Besuchszeit", "Oma", "Krankenhaus", "Uhr"], frei: "Sag ihm, wann er seine Oma besuchen kann – das Schild hilft dir." },
    { id: "bibliothek_ausleihe", niveau: "A2", kat: "verben", titel: "Wie lange darf ich es behalten?", person: { art: 2, er: true }, ziel: ["bibliothek"],
      vars: () => ({ wochen: wahl([2, 3, 4]) }),
      text: (z, v) => "Ein Student leiht ein dickes Buch aus und fragt: „Wie lange darf ich das Buch behalten?“ Auf dem Zettel steht: Leihfrist " + v.wochen + " Wochen.",
      frage: "Was antwortest du?",
      antworten: (z, v) => [
        { html: "„Sie dürfen das Buch " + ZAHL[v.wochen] + " Wochen behalten.“", richtig: true },
        { html: "„Sie dürft das Buch " + ZAHL[v.wochen] + " Wochen behalten.“", hinweis: "Fast! Mit „Sie“ heißt es „Sie dürfen“." },
        { html: "„Sie dürfen das Buch " + ZAHL[v.wochen] + " Woche behalten.“", hinweis: "Fast! Mehrere – also Plural: die Woche, die Wochen." }],
      danke: "„Danke! Das reicht mir.“",
      pruefe: (T, qu) => {
        const w = qu.vars.wochen, z = zahlenIn(T);
        if (!/ (woche|wochen|behalten|dürfen|darfst|dürft|lange|leihfrist) /.test(T)) return null;
        if (!z.length) return { fehlt: "Sag auch, wie lange: " + ZAHL[w] + " Wochen." };
        if (z.indexOf(w) < 0) return { falsch: "Schau noch einmal auf den Zettel: " + ZAHL[w] + " Wochen." };
        if (/ sie dürft /.test(T)) return { fehler: "Fast! Mit „Sie“ heißt es „Sie dürfen“." };
        if (new RegExp(" (" + ZAHL[w] + "|" + w + ") woche ").test(T)) return { fehler: "Fast! Mehrere – also Plural: die Woche, die Wochen." };
        return { ok: true, antwort: "„" + GROSS(ZAHL[w]) + " Wochen – das reicht mir. Danke!“" };
      },
      woerter: ["Leihfrist", "Buch", "behalten"], frei: "Sag ihm, wie lange er das Buch behalten darf – der Zettel hilft dir." },
    { id: "brauerei_fuehrung", niveau: "A2", kat: "uhrzeit", titel: "Eine Führung durch die Brauerei", person: { art: 5, er: true }, ziel: ["brauerei"],
      vars: () => ({ h: wahl([11, 14, 15, 16]) }),
      text: (z, v) => "Ein Tourist steht vor der Brauerei: „Ich möchte die Brauerei besichtigen. Wann beginnt die nächste Führung?“ Am Tor hängt ein Schild: Führung heute um " + v.h + " Uhr.",
      frage: "Was sagst du?",
      antworten: (z, v) => [
        { html: "„Die Führung beginnt um " + kardinal(v.h) + " Uhr.“", richtig: true },
        { html: "„Die Führung beginnt am " + kardinal(v.h) + " Uhr.“", hinweis: "Fast! Bei der Uhrzeit sagt man „um“: um " + kardinal(v.h) + " Uhr." },
        { html: "„Die Führung beginnen um " + kardinal(v.h) + " Uhr.“", hinweis: "Fast! „die Führung“ ist eins – also „beginnt“." }],
      danke: "„Danke! Dann trinke ich vorher noch einen Kaffee.“",
      pruefe: (T, qu) => {
        const h = qu.vars.h, z = zahlenIn(T);
        if (!/ (uhr|führung|beginnt|beginnen|fängt|anfängt|los) /.test(T) && !z.length) return null;
        if (!z.length) return { fehlt: "Sag auch die Uhrzeit: um " + kardinal(h) + " Uhr." };
        if (z.indexOf(h) < 0 && z.indexOf(h - 12) < 0) return { falsch: "Schau noch einmal aufs Schild: um " + h + " Uhr." };
        if (/ führung beginnen /.test(T)) return { fehler: "Fast! „die Führung“ ist eins – also „beginnt“." };
        return { ok: true, antwort: "„Um " + kardinal(h) + " – perfekt! Dann trinke ich vorher noch einen Kaffee.“" };
      },
      woerter: ["Führung", "Brauerei", "Uhr"], frei: "Sag ihm, wann die Führung beginnt – das Schild hilft dir." },
    /* ---------- B1 ---------- */
    { id: "forscher_veraendert", niveau: "B1", kat: "zeiten", titel: "Eine Chronik der Stadt", person: { art: 2, er: true }, braucht: FORSCH, ziel: ["labor", "bibliothek", "schule"],
      vars: (S) => { const l = Array.from(S.haeuser).filter((k) => GEB(k) && k !== "brunnen"); return l.length ? { haus: GEB(wahl(l)) } : null; },
      text: () => "Ein Wissenschaftler schreibt eine Chronik über deine Stadt. Er fragt: „Was hat sich in Ihrer Stadt in letzter Zeit verändert?“",
      frage: "Erzähl im Perfekt, was neu ist (schau in deine Stadt).",
      antworten: (z, v) => [
        { html: "„Wir haben " + einA(v.haus) + " gebaut, und die Stadt ist gewachsen.“", richtig: true },
        { html: "„Wir sind " + einA(v.haus) + " gebaut, und die Stadt ist gewachsen.“", hinweis: "Fast! „bauen“ bildet das Perfekt mit „haben“: Wir haben … gebaut." },
        { html: "„Wir haben " + einA(v.haus) + " gebaut, und die Stadt hat gewachsen.“", hinweis: "Fast! „wachsen“ ist eine Veränderung – das Perfekt mit „sein“: Die Stadt ist gewachsen." }],
      danke: "„Interessant! Das kommt in die Chronik.“",
      pruefe: (T, qu) => {
        const S = stadtStand(), namen = genannt(T);
        const aenderung = / (gebaut|eröffnet|erweitert|vergrößert|verändert|gewachsen|größer|schöner|neu|neue|neues|neuen|mehr|renoviert|ausgebaut|angelegt|bekommen|entstanden|aufgestellt) /.test(T);
        if (!aenderung && !namen.length) return null;
        if (/ gebaut /.test(T)) for (const k of namen) {
          if (S.da.has(k)) continue; const H = GEB(k); if (!H) continue;
          return S.bau.some((b) => b.key === k) ? { falsch: Nom(H) + " ist noch nicht fertig – " + PRON[H.g] + " wird gerade gebaut." } : { falsch: Nom(H) + " gibt es in deiner Stadt noch nicht." };
        }
        if (/ (wir|ich|man) (sind|bin|ist) ([^ ]+ ){0,4}gebaut /.test(T) || / (sind|bin) (wir|ich) ([^ ]+ ){0,4}gebaut /.test(T)) return { fehler: "Fast! „bauen“ bildet das Perfekt mit „haben“: Wir haben … gebaut." };
        if (/ (stadt|sie|es|dorf|bevölkerung) (hat|haben) ([^ ]+ ){0,3}gewachsen /.test(T)) return { fehler: "Fast! „wachsen“ ist eine Veränderung – das Perfekt mit „sein“: Die Stadt ist gewachsen." };
        const perfekt = / (habe|haben|hat|hast|habt|sind|ist|bin|bist) /.test(T) && (/ ge[a-zäöüß]+(t|en) /.test(T) || / [a-zäöüß]+iert /.test(T) || / (eröffnet|erweitert|vergrößert|verändert|bekommen|entstanden|renoviert|ausgebaut|angelegt|aufgestellt) /.test(T));
        if (!perfekt) return { fehlt: "Erzähl es im Perfekt – was ist schon passiert? Zum Beispiel: „Wir haben " + einA(qu.vars.haus) + " gebaut.“" };
        const H = namen.length ? GEB(namen[0]) : null;
        return { ok: true, antwort: H ? "„" + Nom(H) + " – das kommt in die Chronik. Vielen Dank!“" : "„Interessant! Das schreibe ich in die Chronik.“" };
      },
      woerter: (z, v) => [v.haus.name, "Chronik", "gebaut", "gewachsen"], frei: "Erzähl im Perfekt, was in deiner Stadt neu ist: „Wir haben … gebaut.“" },
    { id: "reisende_empfehlung", niveau: "B1", kat: "faelle", titel: "Nur ein Tag in der Stadt", person: { art: 4 }, ziel: ["koelner_dom", "fernsehturm", "holstentor", "brandenburger", "neuschwanstein"],
      text: () => "Eine Reisende kommt mit dem Zug an: „Ich habe nur einen Tag hier. Was sollte ich mir unbedingt ansehen?“",
      frage: "Empfiehl ihr etwas aus deiner Stadt – mit Begründung (weil …).",
      antworten: (z) => { const p = PRON[z.g]; return [
        { html: "„Sie sollten sich " + akk(z) + " ansehen, weil " + p + " wirklich beeindruckend ist.“", richtig: true },
        { html: "„Sie sollten sich " + akk(z) + " ansehen, weil " + p + " ist wirklich beeindruckend.“", hinweis: "Fast! Nach „weil“ steht das Verb am Ende: … weil " + p + " wirklich beeindruckend ist." },
        { html: "„Sie sollten sich " + (z.g === "der" ? "der" : "dem") + " " + z.name + " ansehen, weil " + p + " wirklich beeindruckend ist.“", hinweis: "Fast! „sich etwas ansehen“ braucht den Akkusativ: sich " + akk(z) + " ansehen." }]; },
      danke: "„Danke für den Tipp – da gehe ich zuerst hin!“",
      pruefe: (T, qu) => {
        const S = stadtStand(), namen = genannt(T);
        const rat = / (sollten|solltest|sollte|müssen|musst|können|kannst|empfehle|empfehlen|lohnt|unbedingt|besten|schauen|besuchen|ansehen|anschauen|gehen) /.test(T);
        if (!namen.length) return rat ? { fehlt: "Nenn ihr einen Ort aus deiner Stadt, den sie sich ansehen sollte." } : null;
        const da = namen.filter((k) => S.da.has(k));
        if (!da.length) return { falsch: Nom(GEB(namen[0])) + " gibt es in deiner Stadt nicht – empfiehl etwas, das es wirklich gibt." };
        if (!MIT_GRUND.test(T)) return { fehlt: "Gut! Und warum? Begründe es kurz – mit „weil …“." };
        const H = GEB(da[0]);
        if (new RegExp(" sich (der|dem) (?:[a-zäöüß]+ )?" + namenVon(H.key)[0] + " ").test(T)) return { fehler: "Fast! „sich etwas ansehen“ braucht den Akkusativ: sich " + akk(H) + " ansehen." };
        return { ok: true, antwort: H.key === qu.ziel.key ? "„" + Nom(H) + " – genau da wollte ich hin. Danke für den Tipp!“" : "„" + Nom(H) + "? Das merke ich mir! Zuerst schaue ich mir aber " + akk(qu.ziel) + " an.“" };
      },
      woerter: (z) => [z.name, "ansehen", "beeindruckend", "unbedingt"], frei: "Empfiehl ihr ein Wahrzeichen oder Gebäude deiner Stadt und sag, warum (weil …)." },
    { id: "fischer_wetter", niveau: "B1", kat: "wortstellung", titel: "Der Fischer und das Wetter", person: { art: 5, er: true }, ziel: ["bootsverleih"],
      text: () => "Ein Fischer am See: „Morgen früh will ich hinaus auf den See. Was soll ich tun, wenn es regnet?“",
      frage: "Gib ihm einen Rat – zum Beispiel mit „Wenn es regnet, …“.",
      antworten: () => [
        { html: "„Wenn es regnet, sollten Sie lieber an Land bleiben.“", richtig: true },
        { html: "„Wenn es regnet, Sie sollten lieber an Land bleiben.“", hinweis: "Fast! Nach dem wenn-Satz kommt zuerst das Verb: Wenn es regnet, sollten Sie …" },
        { html: "„Wenn regnet es, sollten Sie lieber an Land bleiben.“", hinweis: "Fast! Im wenn-Satz steht das Verb am Ende: wenn es regnet." }],
      danke: "„Gute Idee. Dann flicke ich eben meine Netze.“",
      pruefe: (T) => {
        if (/ (wenn|falls) (regnet|stürmt|schneit|gewittert|ist|gibt|kommt) (es|das|der|ein) /.test(T)) return { fehler: "Fast! Im wenn-Satz steht das Verb am Ende: wenn es regnet." };
        if (!/ (sollten|solltest|sollte|sollen|soll|können|kannst|könnten|müssen|musst|würde|würden|bleiben|bleib|bleibe|nehmen|nimm|nehme|warten|warte|anziehen|zieh|regenjacke|regenmantel|schirm|regenschirm|hause|daheim|land|lieber|besser|verschieben) /.test(T)) return null;
        return { ok: true, antwort: / (jacke|regenjacke|mantel|regenmantel|schirm|regenschirm|anziehen|zieh) /.test(T) ? "„Stimmt – mit Regenjacke geht es auch. Danke!“" : "„Gute Idee. Dann flicke ich eben meine Netze.“" };
      },
      woerter: ["Fischer", "regnet", "an Land", "Regenjacke"], frei: "Gib dem Fischer einen Rat für Regenwetter: „Wenn es regnet, sollten Sie …“." },
    { id: "gasthaus_beschwerde", niveau: "B1", kat: "stil", titel: "Die Suppe ist kalt", person: { art: 5, er: true }, ziel: ["gasthaus"],
      text: () => "Im Gasthaus bringt dir der Kellner eine Suppe – sie ist kalt. Er fragt freundlich: „Schmeckt es Ihnen?“",
      frage: "Beschwer dich höflich.",
      antworten: () => [
        { html: "„Entschuldigung, die Suppe ist leider kalt. Könnten Sie sie bitte noch einmal warm machen?“", richtig: true },
        { html: "„Die Suppe ist kalt! Bringen Sie sofort eine neue!“", hinweis: "Inhaltlich richtig – aber unhöflich. Besser: „Könnten Sie bitte …?“" },
        { html: "„Entschuldigung, die Suppe ist leider kalt. Könnten Sie sie bitte noch einmal warm machen können?“", hinweis: "Fast! Ein Modalverb reicht: Könnten Sie sie bitte warm machen?" }],
      danke: "„Oh, das tut mir leid! Ich bringe Ihnen sofort eine heiße Suppe.“",
      pruefe: (T) => {
        if (!/ (suppe|essen|kalt|lauwarm|warm|heiß|aufwärmen|wärmen|schmeckt) /.test(T)) return null;
        if (!/ (kalt|lauwarm|warm|heiß|aufwärmen|wärmen|neue|zurück|nicht) /.test(T)) return { fehlt: "Die Suppe ist aber kalt – sag es dem Kellner, freundlich und höflich." };
        if (/ (könnten|können|kann|könnte|würden|würde) ([^ ]+ ){1,6}(machen|wärmen|aufwärmen|bringen|holen) (können|könnten) /.test(T)) return { fehler: "Fast! Ein Modalverb reicht: Könnten Sie sie bitte warm machen?" };
        if (/ (sofort|schnell|gefälligst) /.test(T) || !/ (bitte|könnten|könnte|würden|würde|entschuldigung|entschuldigen|leider|wäre|dürfte|möglich|vielleicht) /.test(T)) return { fehler: "Inhaltlich richtig – aber so klingt es unhöflich. Höflicher: „Entschuldigung, die Suppe ist leider kalt. Könnten Sie sie bitte warm machen?“" };
        return { ok: true, antwort: "„Oh, das tut mir leid! Ich bringe Ihnen sofort eine heiße Suppe.“" };
      },
      woerter: ["Suppe", "kalt", "warm machen", "Entschuldigung"], frei: "Sag dem Kellner höflich, dass die Suppe kalt ist." },
    { id: "rathaus_anmelden", niveau: "B1", kat: "verben", titel: "Neu in der Stadt", person: { art: 2, er: true }, ziel: ["rathaus"],
      text: () => "Ein Mann ist gerade mit seiner Familie hergezogen. Er fragt: „Was muss ich als Erstes im Rathaus erledigen?“",
      frage: "Was rätst du ihm?",
      antworten: () => [
        { html: "„Sie müssen sich im Rathaus anmelden.“", richtig: true },
        { html: "„Sie müssen im Rathaus anmelden.“", hinweis: "Fast! „sich anmelden“ ist reflexiv: Sie müssen sich im Rathaus anmelden." },
        { html: "„Sie müssen sich im Rathaus melden an.“", hinweis: "Fast! Nach „müssen“ steht das ganze Verb am Ende: … anmelden." }],
      danke: "„Danke! Dann gehe ich gleich mit meinem Ausweis hin.“",
      pruefe: (T) => {
        if (!/ (anmelden|anmeldung|melden|melde|meldet|ummelden|wohnsitz|meldebescheinigung|meldeamt|bürgeramt|formular|ausweis|registrieren) /.test(T)) return null;
        if (/ (müssen|muss|musst|sollten|sollte|solltest|können|kann|kannst) ([^ ]+ ){0,4}melden ([^ ]+ ){0,3}an $/.test(T)) return { fehler: "Fast! Nach „müssen“ steht das ganze Verb am Ende: … sich im Rathaus anmelden." };
        if (/ anmelden /.test(T) && !/ (sich|mich|dich|uns|euch) /.test(T) && !/ (ihr|ihre|ihren|das|den|die|ein|eine|einen|mein|meine|meinen|sein|seine|seinen|euer|eure) [^ ]+ ([^ ]+ ){0,3}anmelden /.test(T)) return { fehler: "Fast! „sich anmelden“ ist reflexiv: Sie müssen sich im Rathaus anmelden." };
        return { ok: true, antwort: "„Danke! Dann gehe ich gleich mit meinem Ausweis hin.“" };
      },
      woerter: ["Rathaus", "Ausweis", "Meldebescheinigung", "Wohnsitz"], frei: "Sag ihm, was er im Rathaus tun muss (sich anmelden …)." },
    { id: "schule_wozu", niveau: "B1", kat: "wortstellung", titel: "Wozu eine Schule?", person: { art: 4 }, ziel: ["schule"],
      text: () => "Eine Besucherin aus dem Ausland staunt: „Bei uns lernen die Kinder zu Hause. Wozu braucht Ihre Stadt eine Schule?“",
      frage: "Erkläre es ihr (damit …, weil …).",
      antworten: () => [
        { html: "„Wir brauchen eine Schule, damit die Kinder zusammen lernen können.“", richtig: true },
        { html: "„Wir brauchen eine Schule, um die Kinder zusammen lernen können.“", hinweis: "Fast! „um … zu“ geht nur ohne eigenes Subjekt. Hier passt „damit“: damit die Kinder zusammen lernen können." },
        { html: "„Wir brauchen eine Schule, damit die Kinder können zusammen lernen.“", hinweis: "Fast! Im damit-Satz steht das Verb am Ende: … lernen können." }],
      danke: "„Zusammen lernen – das gefällt mir!“",
      pruefe: (T) => {
        if (!/ (lernen|lesen|schreiben|rechnen|bildung|wissen|lehrer|lehrerin|freunde|zusammen|beruf|zukunft|kinder|klasse|schule|unterricht) /.test(T)) return null;
        if (!/ (damit|um|weil|denn|da|sodass|deshalb|deswegen|dort) /.test(T)) return { fehlt: "Begründe es: „…, damit die Kinder …“ oder „…, weil …“." };
        return { ok: true, antwort: "„Zusammen lernen – das gefällt mir. Vielleicht machen wir das bei uns auch so!“" };
      },
      woerter: ["Schule", "Kinder", "zusammen", "Bildung"], frei: "Erkläre, wozu die Stadt eine Schule braucht: „…, damit die Kinder …“." },
    /* ---------- B2 ---------- */
    { id: "forscher_bauen", niveau: "B2", kat: "stil", titel: "Was fehlt der Stadt?", person: { art: 1 }, braucht: FORSCH, ziel: ["labor", "bibliothek", "schule"],
      vars: (S) => { const F = fehltDer(S); return F ? { fehlt: F, verb: "bauen", grund: GRUND[F.key] } : { fehlt: { key: "park", g: "der", name: "Park" }, verb: "anlegen", grund: GRUND.park }; },
      text: () => "Eine Stadtforscherin untersucht, wie sich Städte entwickeln: „Was sollte Ihre Stadt als Nächstes bauen – und warum?“",
      frage: "Sag deine Meinung und begründe sie (Meiner Meinung nach …, weil …).",
      antworten: (z, v) => { const o = einA(v.fehlt) + " " + v.verb; return [
        { html: "„Meiner Meinung nach sollte die Stadt " + o + ", weil " + v.grund[0] + ".“", richtig: true },
        { html: "„Meiner Meinung nach die Stadt sollte " + o + ", weil " + v.grund[0] + ".“", hinweis: "Fast! „Meiner Meinung nach“ steht auf Position 1 – danach kommt das Verb: Meiner Meinung nach sollte die Stadt …" },
        { html: "„Meiner Meinung nach sollte die Stadt " + o + ", weil " + v.grund[1] + ".“", hinweis: "Fast! Nach „weil“ steht das Verb am Ende: … weil " + v.grund[0] + "." }]; },
      danke: "„Ein überzeugendes Argument – das nehme ich in meine Studie auf.“",
      pruefe: (T, qu) => {
        const S = stadtStand();
        const meinung = / (meiner meinung nach|ich finde|ich denke|ich glaube|ich meine|meines erachtens|aus meiner sicht|ich bin der meinung|ich bin überzeugt|meiner ansicht nach|ich würde|ich schlage|am wichtigsten|sollte|sollten|wäre|bräuchte) /.test(T);
        if (!meinung && !/ (bauen|errichten|eröffnen|anlegen|brauchen|braucht|fehlt|bekommen) /.test(T)) return null;
        if (/ (meiner meinung nach|meiner ansicht nach|aus meiner sicht|meines erachtens) (ich|die stadt|wir|man|sie|es|er|unsere stadt) /.test(T)) return { fehler: "Fast! „Meiner Meinung nach“ steht auf Position 1 – danach kommt das Verb: Meiner Meinung nach sollte die Stadt …" };
        const schon = genannt(T).find((k) => S.da.has(k) && new RegExp(" (ein|eine|einen) " + namenVon(k)[0] + " ").test(T) && / (bauen|errichten|eröffnen|bekommen) /.test(T));
        if (schon) return { falsch: Nom(GEB(schon)) + " hat deine Stadt doch schon – was fehlt noch?" };
        if (!MIT_GRUND.test(T)) return { fehlt: "Begründe deine Meinung: „…, weil …“." };
        if (T.indexOf(" weil " + fw(qu.vars.grund[1]).trim() + " ") >= 0) return { fehler: "Fast! Nach „weil“ steht das Verb am Ende: … weil " + qu.vars.grund[0] + "." };
        return { ok: true, antwort: "„Ein überzeugendes Argument – das nehme ich in meine Studie auf.“" };
      },
      woerter: (z, v) => [v.fehlt.name, "Meinung", "Stadtforscherin", "Zukunft"], frei: "Sag, was deine Stadt als Nächstes bauen sollte, und begründe es: „Meiner Meinung nach …, weil …“." },
    { id: "reisende_zug_auto", niveau: "B2", kat: "verben", titel: "Zug oder Auto?", person: { art: 4 }, ziel: ["bahnhof"],
      text: (z, v) => "Eine Reisende überlegt laut: „Soll ich morgen mit dem Zug oder mit dem Auto nach " + v.stadt + " fahren? Was würden Sie an meiner Stelle machen?“",
      frage: "Gib ihr einen Rat und begründe ihn.",
      antworten: () => [
        { html: "„Ich würde den Zug nehmen, weil man entspannter reist und keinen Parkplatz suchen muss.“", richtig: true },
        { html: "„Ich würde den Zug genommen, weil man entspannter reist und keinen Parkplatz suchen muss.“", hinweis: "Fast! Nach „würde“ steht der Infinitiv: Ich würde den Zug nehmen." },
        { html: "„Ich würde den Zug nehmen, weil man entspannter reist und muss keinen Parkplatz suchen.“", hinweis: "Fast! Auch im zweiten Teil des weil-Satzes steht das Verb am Ende: … und keinen Parkplatz suchen muss." }],
      danke: "„Stimmt, im Zug kann ich sogar noch lesen. Danke für den Rat!“",
      pruefe: (T) => {
        if (!/ (zug|bahn|auto|wagen|bus|fernbus|fahrrad|rad) /.test(T)) return null;
        if (!/ (würde|würden|nehmen|nimm|nehme|fahren|fahre|empfehle|empfehlen|rate|raten|besser|lieber|sollten|solltest|stelle) /.test(T)) return null;
        if (!MIT_GRUND.test(T) && !/ (außerdem|dann) /.test(T)) return { fehlt: "Und warum? Begründe deinen Rat (weil, denn, da …)." };
        return { ok: true, antwort: / auto /.test(T) && !/ (zug|bahn) /.test(T) ? "„Mit dem Auto bin ich flexibler – guter Punkt!“" : "„Stimmt, im Zug kann ich sogar noch lesen. Danke für den Rat!“" };
      },
      woerter: (z, v) => ["Zug", "Auto", "Parkplatz", "entspannter", v.stadt], frei: "Rate ihr zum Zug oder zum Auto – und sag, warum." },
    { id: "brauerei_laerm", niveau: "B2", kat: "wortstellung", titel: "Streit um die Brauerei", person: { art: 0, er: true }, ziel: ["brauerei"],
      text: () => "Ein Nachbar der Brauerei ist verärgert: „Die Brauerei ist laut und riecht. Man sollte sie schließen! Was meinen Sie?“",
      frage: "Sag deine Meinung – und wäge ab (obwohl …, denn …).",
      antworten: () => [
        { html: "„Obwohl die Brauerei manchmal laut ist, sollte man sie nicht schließen, denn sie schafft Arbeitsplätze.“", richtig: true },
        { html: "„Obwohl die Brauerei manchmal laut ist, man sollte sie nicht schließen, denn sie schafft Arbeitsplätze.“", hinweis: "Fast! Nach dem obwohl-Satz kommt zuerst das Verb: …, sollte man sie nicht schließen." },
        { html: "„Trotzdem die Brauerei manchmal laut ist, sollte man sie nicht schließen, denn sie schafft Arbeitsplätze.“", hinweis: "Fast! „trotzdem“ leitet keinen Nebensatz ein – hier passt „obwohl“." }],
      danke: "„Hm, die Arbeitsplätze … Vielleicht rede ich erst einmal mit dem Braumeister.“",
      pruefe: (T) => {
        if (/^ trotzdem (die|der|das|es|sie|er|wir|man|ich|unsere) /.test(T)) return { fehler: "Fast! „trotzdem“ leitet keinen Nebensatz ein – hier passt „obwohl“: Obwohl die Brauerei manchmal laut ist, …" };
        if (!/ (brauerei|lärm|laut|lauter|leiser|geruch|riecht|gestank|arbeitsplätze|arbeitsplatz|schließen|zumachen|bier|nachbarn) /.test(T)) return null;
        if (!/ (obwohl|trotzdem|aber|denn|weil|da|zwar|jedoch|allerdings|dennoch|deshalb|deswegen|einerseits|andererseits|wenn|sondern) /.test(T)) return { fehlt: "Begründe deine Meinung – zum Beispiel mit „obwohl …“ oder „denn …“." };
        return { ok: true, antwort: "„Hm, die Arbeitsplätze … Vielleicht rede ich erst einmal mit dem Braumeister.“" };
      },
      woerter: ["Brauerei", "Arbeitsplätze", "Lärm", "schließen"], frei: "Sag, ob man die Brauerei schließen sollte, und begründe es (obwohl …, denn …)." },
    { id: "krankenhaus_rat", niveau: "B2", kat: "verben", titel: "Ein erschöpfter Arzt", person: { art: 2, er: true }, ziel: ["krankenhaus"],
      text: () => "Ein Arzt kommt müde aus dem Krankenhaus: „Ich arbeite jeden Tag zwölf Stunden und schlafe kaum noch. Was würden Sie an meiner Stelle tun?“",
      frage: "Gib ihm einen Rat (An Ihrer Stelle würde ich …).",
      antworten: () => [
        { html: "„An Ihrer Stelle würde ich mit der Klinikleitung sprechen und öfter Pausen machen.“", richtig: true },
        { html: "„An Ihrer Stelle ich würde mit der Klinikleitung sprechen und öfter Pausen machen.“", hinweis: "Fast! „An Ihrer Stelle“ steht auf Position 1 – dann kommt das Verb: An Ihrer Stelle würde ich …" },
        { html: "„An Ihrer Stelle werde ich mit der Klinikleitung sprechen und öfter Pausen machen.“", hinweis: "Fast! Für einen Rat braucht man den Konjunktiv II: An Ihrer Stelle würde ich …" }],
      danke: "„Sie haben recht. Morgen spreche ich mit der Leitung.“",
      pruefe: (T) => {
        if (/ an (ihrer|deiner|seiner) stelle (ich|wir|man|du) /.test(T)) return { fehler: "Fast! „An Ihrer Stelle“ steht auf Position 1 – dann kommt das Verb: An Ihrer Stelle würde ich …" };
        if (/ an (ihrer|deiner) stelle (werde|will|möchte) /.test(T)) return { fehler: "Fast! Für einen Rat braucht man den Konjunktiv II: An Ihrer Stelle würde ich …" };
        if (!/ (würde|würden|sollten|solltest|könnten|wäre|empfehle|rate|raten|vorschlagen|pause|pausen|urlaub|schlaf|schlafen|weniger|hilfe|kollegen|leitung|klinikleitung|chef|chefin|sprechen|reden|erholen|sport|krank|arzt|stunden) /.test(T)) return null;
        return { ok: true, antwort: "„Sie haben recht. Morgen spreche ich mit der Leitung – und gönne mir eine Pause.“" };
      },
      woerter: ["Klinikleitung", "Pausen", "Urlaub", "Stelle"], frei: "Gib dem Arzt einen Rat: „An Ihrer Stelle würde ich …“." },
    { id: "rathaus_verkehr", niveau: "B2", kat: "verben", titel: "Bürgerversammlung", person: { art: 0 }, ziel: ["rathaus"], stand: (S) => S.haeuser.size >= 10,
      text: () => "Die Bürgermeisterin fragt bei der Bürgerversammlung: „Unsere Stadt wächst, und die Straßen werden voll. Was könnte man gegen den Verkehr tun?“",
      frage: "Mach einen Vorschlag und begründe ihn.",
      antworten: () => [
        { html: "„Es sollten mehr Radwege gebaut werden, damit weniger Leute mit dem Auto fahren.“", richtig: true },
        { html: "„Es sollten mehr Radwege gebaut worden, damit weniger Leute mit dem Auto fahren.“", hinweis: "Fast! Passiv mit Modalverb: … gebaut werden (nicht „worden“)." },
        { html: "„Es sollten mehr Radwege gebaut werden, damit weniger Leute fahren mit dem Auto.“", hinweis: "Fast! Im damit-Satz steht das Verb am Ende: … mit dem Auto fahren." }],
      danke: "„Ein guter Vorschlag – das kommt ins Protokoll.“",
      pruefe: (T) => {
        if (!/ (rad|radweg|radwege|radwegen|fahrrad|fahrräder|bus|busse|bahn|straßenbahn|zug|züge|parkplatz|parkplätze|parkhaus|ampel|ampeln|tempo|fußgänger|fußgängerzone|autofrei|carsharing|autos|auto|öffentlich|öffentliche|nahverkehr|umgehungsstraße|brücke|wege|straße|straßen|kreisel|verkehr|tempolimit|zebrastreifen) /.test(T)) return null;
        if (!/ (sollte|sollten|könnte|könnten|müsste|müssten|man|vorschlagen|schlage|würde|würden|bauen|gebaut|einführen|eingeführt|mehr|weniger) /.test(T)) return null;
        return { ok: true, antwort: "„Ein guter Vorschlag – das nehmen wir ins Protokoll auf.“" };
      },
      woerter: ["Radwege", "Verkehr", "Bürgerversammlung", "Busse"], frei: "Mach einen Vorschlag gegen den Verkehr – zum Beispiel: „Es sollten mehr … gebaut werden, damit …“." },
    { id: "bibliothek_internet", niveau: "B2", kat: "stil", titel: "Braucht man noch Bücher?", person: { art: 2, er: true }, ziel: ["bibliothek"],
      text: () => "Ein junger Mann vor der Bibliothek: „Im Internet steht doch alles. Brauchen wir überhaupt noch eine Bibliothek?“",
      frage: "Sag deine Meinung und begründe sie.",
      antworten: () => [
        { html: "„Ja, denn in der Bibliothek kann man in Ruhe lernen, und nicht jeder hat zu Hause einen Computer.“", richtig: true },
        { html: "„Ja, denn in der Bibliothek man kann in Ruhe lernen, und nicht jeder hat zu Hause einen Computer.“", hinweis: "Fast! Nach „denn“ beginnt ein Hauptsatz – das Verb steht an Position 2: in der Bibliothek kann man …" },
        { html: "„Ja, weil in der Bibliothek kann man in Ruhe lernen, und nicht jeder hat zu Hause einen Computer.“", hinweis: "Fast! Nach „weil“ steht das Verb am Ende: … weil man in der Bibliothek in Ruhe lernen kann." }],
      danke: "„Hm, in Ruhe lernen … Da haben Sie eigentlich recht.“",
      pruefe: (T) => {
        if (/ denn (in|im|an|am|auf|bei|beim|zu|mit|dort|da|hier|heute)( [^ ]+){0,2} (man|ich|wir|sie|du|er|es) (kann|können|könnte|kannst|ist|sind|hat|haben|gibt|findet|findest|muss|lernt|lernen|bekommt) /.test(T)) return { fehler: "Fast! Nach „denn“ beginnt ein Hauptsatz – das Verb steht an Position 2: denn in der Bibliothek kann man …" };
        if (!/ (bibliothek|bücher|buch|lernen|ruhe|internet|computer|beratung|treffpunkt|kinder|kostenlos|lesen|wissen|zeitungen|bücherei|arbeitsplatz|wlan) /.test(T)) return null;
        if (!/ (denn|weil|da|deshalb|außerdem|nämlich|schließlich|beispiel|darum|deswegen|aber|trotzdem) /.test(T)) return { fehlt: "Begründe deine Meinung – mit „denn …“ oder „weil …“." };
        return { ok: true, antwort: "„Hm, in Ruhe lernen … Da haben Sie eigentlich recht.“" };
      },
      woerter: ["Bibliothek", "Internet", "Computer", "Ruhe"], frei: "Sag, ob die Stadt noch eine Bibliothek braucht, und begründe es (denn …, weil …)." },
    /* ---------- C1 ---------- */
    { id: "forscher_stand", niveau: "C1", kat: "stil", titel: "Der Entwicklungsstand der Stadt", person: { art: 1 }, braucht: FORSCH, ziel: ["labor", "bibliothek", "schule", "rathaus"],
      stand: (S) => S.haeuser.size >= 6,
      vars: (S) => {
        const F = fehltDer(S), P = GEB(["schule", "krankenhaus", "bibliothek", "baeckerei", "rathaus"].find((k) => S.da.has(k) && (!F || k !== F.key)) || "");
        if (!P) return null;
        return { fehlt: F, da: P, haeuser: S.haeuser.size, wunder: S.wunder, imBau: S.bau.map((b) => GEB(b.key)).filter(Boolean).map((h) => h.name) };
      },
      text: (z, v) => "Eine Stadtforscherin der Universität: „Wie würden Sie den aktuellen Entwicklungsstand Ihrer Stadt einschätzen, und wo sehen Sie den größten Handlungsbedarf?“ (Deine Stadt: " +
        v.haeuser + " Gebäude, " + v.wunder + " Wahrzeichen" + (v.imBau.length ? ", im Bau: " + v.imBau.join(", ") : "") + ".)",
      frage: "Antworte im Fachgespräch: Einschätzung und Handlungsbedarf.",
      antworten: (z, v) => { const anf = "„Ich würde sagen, die Stadt ist schon recht weit entwickelt; Handlungsbedarf sehe ich vor allem ", F = v.fehlt, P = v.da; return F ? [
        { html: anf + BEREICH[F.key] + ", da es noch an " + einD(F) + " mangelt.“", richtig: true },
        { html: anf + BEREICH[F.key] + ", da es noch an " + einA(F) + " mangelt.“", hinweis: "Fast! „mangeln an“ verlangt den Dativ: an " + einD(F) + "." },
        { html: anf + BEREICH[P.key] + ", da es noch an " + einD(P) + " mangelt.“", hinweis: "Schau in deine Stadt: " + Nom(P) + " gibt es schon – es fehlt aber noch " + einN(F) + "." }] : [
        { html: anf + "beim Verkehr, da es noch an Radwegen mangelt.“", richtig: true },
        { html: anf + "beim Verkehr, da es noch an Radwege mangelt.“", hinweis: "Fast! „mangeln an“ verlangt den Dativ – im Plural mit -n: an Radwegen." },
        { html: anf + BEREICH[P.key] + ", da es noch an " + einD(P) + " mangelt.“", hinweis: "Schau in deine Stadt: " + Nom(P) + " gibt es schon." }]; },
      danke: "„Eine differenzierte Einschätzung – genau solche Stimmen brauche ich für meine Studie.“",
      pruefe: (T) => {
        const S = stadtStand();
        const urteil = / (entwickelt|entwicklung|entwicklungsstand|stand|fortgeschritten|anfang|aufbau|solide|ausbaufähig|aufgestellt|weit|wächst|gewachsen|modern|zufrieden|beachtlich|bemerkenswert|gut|stark|schwach|lebendig|attraktiv) /.test(T);
        const bedarf = / (handlungsbedarf|bedarf|fehlt|fehlen|mangelt|mangel|ausbauen|ausbau|investieren|investitionen|verbessern|verbesserung|brauchen|braucht|benötigt|benötigen|priorität|prioritäten|defizit|defizite|nachholbedarf|lücke|lücken|schwachstelle|schwachstellen|verbesserungsbedarf|handeln|optimieren) /.test(T);
        if (!urteil && !bedarf) return null;
        if (!urteil || !bedarf) return { fehlt: "Beantworte beide Teile: Wie weit ist die Stadt – und wo sehen Sie Handlungsbedarf?" };
        for (const k of genannt(T)) {
          if (!S.da.has(k)) continue; const H = GEB(k), nm = namenVon(k)[0];
          if (new RegExp(" an (einem|einer|ein|eine|einen) " + nm + " ").test(T) || new RegExp(" (kein|keine|keinen|keinem|keiner) " + nm + " ").test(T) || new RegExp(" (fehlt|fehlen|fehle) (noch )?(ein|eine|einen) " + nm + " ").test(T)) return { falsch: "Schau in deine Stadt: " + Nom(H) + " gibt es schon." };
        }
        if (/ (mangelt|mangeln|fehlt|fehlen|bedarf|mangel) (es )?(noch )?an (ein|eine|einen|kein|keine|keinen) /.test(T) || / an (ein|eine|einen) ([^ ]+ ){1,2}(mangelt|mangeln|fehlt|fehlen) /.test(T)) return { fehler: "Fast! „mangeln an“ und „Bedarf an“ verlangen den Dativ: an einem …, an einer …" };
        if (/ an (radwege|parkplätze|ärzte|bäume|wege|plätze|grünflächen) (mangelt|fehlt|mangeln|fehlen) /.test(T)) return { fehler: "Fast! „mangeln an“ verlangt den Dativ – im Plural mit -n: an Radwegen, an Parkplätzen …" };
        return { ok: true, antwort: "„Eine differenzierte Einschätzung – genau solche Stimmen brauche ich für meine Studie.“" };
      },
      woerter: (z, v) => ["Entwicklungsstand", "Handlungsbedarf", "Stadtforscherin", v.fehlt ? v.fehlt.name : "Radwegen"], frei: "Schätz den Stand deiner Stadt ein und nenn den größten Handlungsbedarf." },
    { id: "bahnhof_ausbau", niveau: "C1", kat: "verben", titel: "Die Bahn plant", person: { art: 2, er: true }, ziel: ["bahnhof"],
      text: () => "Ein Verkehrsplaner der Bahn: „Wir überlegen, die Strecke zu Ihrer Stadt auszubauen. Inwiefern würde Ihre Stadt davon profitieren?“",
      frage: "Erkläre es ihm genau.",
      antworten: () => [
        { html: "„Die Stadt würde insofern profitieren, als mehr Besucher kämen und die Betriebe schneller beliefert werden könnten.“", richtig: true },
        { html: "„Die Stadt würde insofern profitieren, als mehr Besucher kämen und die Betriebe schneller beliefert worden könnten.“", hinweis: "Fast! Passiv mit Modalverb: beliefert werden könnten (nicht „worden“)." },
        { html: "„Die Stadt würde insofern profitieren, als mehr Besucher kämen und die Betriebe könnten schneller beliefert werden.“", hinweis: "Fast! „insofern …, als“ leitet einen Nebensatz ein – auch nach „und“ steht das Verb am Ende: … beliefert werden könnten." }],
      danke: "„Mehr Besucher, kürzere Lieferwege – das überzeugt mich.“",
      pruefe: (T) => {
        if (/ insofern .* als .* und (die|der|das|den|mehr|viele|neue) [^ ]+ (könnten|können|würden|werden|wären|hätten|sind|haben|müssten) [^ ]+/.test(T)) return { fehler: "Fast! „insofern …, als“ leitet einen Nebensatz ein – auch nach „und“ steht das Verb am Ende: … beliefert werden könnten." };
        if (!/ (profitieren|profitiert|vorteil|vorteile|nutzen|besucher|touristen|tourismus|wirtschaft|betriebe|unternehmen|firmen|arbeitsplätze|pendler|pendeln|anbindung|erreichbar|erreichbarkeit|handel|güter|waren|beliefert|lieferung|lieferungen|schneller|attraktiver|wachstum|einwohner|gäste|umsatz|kunden|verbindung|verbindungen) /.test(T)) return null;
        if (woerterZahl(T) < 6) return { fehlt: "Antworte ausführlicher: Inwiefern genau – und wer würde profitieren?" };
        return { ok: true, antwort: "„Mehr Besucher, kürzere Lieferwege – das überzeugt mich. Ich nehme es in den Bericht auf.“" };
      },
      woerter: ["Strecke", "profitieren", "Besucher", "Betriebe", "beliefert", "Pendler"], frei: "Erkläre, inwiefern deine Stadt von einer besseren Bahnstrecke profitieren würde." },
    { id: "forschung_geld", niveau: "C1", kat: "wortstellung", titel: "Mehr Geld für die Forschung?", person: { art: 2, er: true }, braucht: ["labor", "sternwarte", "bibliothek"], ziel: ["labor", "bibliothek", "schule"],
      text: (z) => "Ein Forscher " + ausLabor(z) + " wirbt: „Die Stadt sollte viel mehr Geld in die Forschung stecken. Wie sehen Sie das?“",
      frage: "Wäge ab: Zwar …, aber …",
      antworten: () => [
        { html: "„Zwar ist Forschung wichtig, aber zuerst sollten wir in die Schulen investieren, damit überhaupt Nachwuchs da ist.“", richtig: true },
        { html: "„Zwar Forschung ist wichtig, aber zuerst sollten wir in die Schulen investieren, damit überhaupt Nachwuchs da ist.“", hinweis: "Fast! Steht „zwar“ am Satzanfang, folgt direkt das Verb: Zwar ist Forschung wichtig, aber …" },
        { html: "„Zwar ist Forschung wichtig, aber zuerst sollten wir in den Schulen investieren, damit überhaupt Nachwuchs da ist.“", hinweis: "Fast! „investieren in“ verlangt den Akkusativ: in die Schulen investieren." }],
      danke: "„Ein berechtigter Einwand – darüber sollten wir weiter sprechen.“",
      pruefe: (T) => {
        const w = T.trim().split(" ");
        if (w[0] === "zwar" && w[1] && !FINIT.has(w[1]) && w.slice(2, 5).some((x) => FINIT.has(x))) return { fehler: "Fast! Steht „zwar“ am Satzanfang, folgt direkt das Verb: Zwar ist Forschung wichtig, aber …" };
        const inv = / investier/.test(T) && / in (der|dem|den) (schulen|schule|forschung|bildung|wissenschaft|infrastruktur|labor|kindergärten|kindergarten|zukunft|ausbildung) /.exec(T);
        if (inv) return { fehler: "Fast! „investieren in“ verlangt den Akkusativ: in " + ({ der: "die", dem: "das", den: "die" })[inv[1]] + " " + GROSS(inv[2]) + " investieren." };
        if (!/ (forschung|wissenschaft|geld|investieren|investition|investitionen|labor|zukunft|bildung|schule|schulen|haushalt|budget|wichtig|sinnvoll|stimme|zustimmen|einverstanden|teuer|kosten|mittel) /.test(T)) return null;
        if (!/ (zwar|aber|jedoch|allerdings|weil|da|denn|deshalb|einerseits|andererseits|trotzdem|obwohl|zunächst|zuerst|sondern) /.test(T)) return { fehlt: "Wäge ab: „Zwar …, aber …“ – oder begründe mit „weil …“." };
        return { ok: true, antwort: "„Ein berechtigter Einwand – ohne Nachwuchs keine Forschung. Darüber sollten wir weiter sprechen.“" };
      },
      woerter: ["Forschung", "investieren", "Nachwuchs", "Schulen"], frei: "Sag, ob die Stadt mehr Geld in die Forschung stecken sollte – und wäge ab (zwar …, aber …)." },
    { id: "rathaus_antrag", niveau: "C1", kat: "stil", titel: "Ein Antrag für das Straßenfest", person: { art: 1 }, ziel: ["rathaus"],
      text: () => "Du möchtest am Brunnen ein Straßenfest feiern. Die Sachbearbeiterin im Rathaus sagt: „Formulieren Sie Ihr Anliegen bitte kurz und förmlich – ich nehme es zu Protokoll.“",
      frage: "Formuliere deinen Antrag förmlich.",
      antworten: () => [
        { html: "„Hiermit beantrage ich die Genehmigung eines Straßenfestes am kommenden Samstag auf dem Marktplatz.“", richtig: true },
        { html: "„Hiermit ich beantrage die Genehmigung eines Straßenfestes am kommenden Samstag auf dem Marktplatz.“", hinweis: "Fast! Nach „Hiermit“ auf Position 1 kommt das Verb: Hiermit beantrage ich …" },
        { html: "„Hiermit beantrage ich die Genehmigung eines Straßenfest am kommenden Samstag auf dem Marktplatz.“", hinweis: "Fast! Genitiv: eines Straßenfestes – mit -es." }],
      danke: "„Sehr gut formuliert. Ich prüfe den Antrag und melde mich bei Ihnen.“",
      pruefe: (T) => {
        if (/ hiermit (ich|wir) /.test(T)) return { fehler: "Fast! Nach „Hiermit“ auf Position 1 kommt das Verb: Hiermit beantrage ich …" };
        if (!/ (beantrage|beantragen|antrag|genehmigung|erlaubnis|genehmigen|bitte|möchte|würde|anmelden|anmeldung|will|wollen|machen|feiern|veranstalten|organisieren) /.test(T) || !/ [a-zäöüß]*(fest|festes|fests|feier|veranstaltung|party|markt) /.test(T)) return null;
        if (/ (eines|des) [a-zäöüß]*fest /.test(T)) return { fehler: "Fast! Genitiv: eines Straßenfestes – mit -es." };
        if (/ (hey|hi|na|krieg|kriege|kriegen|will|wollen|gib) /.test(T)) return { fehler: "Inhaltlich passt es – aber für einen Antrag zu locker. Förmlich: „Hiermit beantrage ich die Genehmigung …“" };
        return { ok: true, antwort: "„Sehr gut formuliert. Ich prüfe den Antrag und melde mich bis Mittwoch bei Ihnen.“" };
      },
      woerter: ["Genehmigung", "beantrage", "hiermit", "Marktplatz", "Samstag"], frei: "Beantrage das Straßenfest förmlich – zum Beispiel: „Hiermit beantrage ich …“." },
    { id: "krankenhaus_personal", niveau: "C1", kat: "verben", titel: "Zu wenig Pflegekräfte", person: { art: 1 }, ziel: ["krankenhaus"],
      text: () => "Die Pflegedirektorin des Krankenhauses seufzt: „Uns fehlen Pflegekräfte. Welche Maßnahmen würden Sie vorschlagen, um dem Personalmangel entgegenzuwirken?“",
      frage: "Schlag Maßnahmen vor.",
      antworten: () => [
        { html: "„Ich würde vorschlagen, die Arbeitsbedingungen zu verbessern, etwa durch flexiblere Arbeitszeiten und eine bessere Bezahlung.“", richtig: true },
        { html: "„Ich würde vorschlagen, die Arbeitsbedingungen verbessern, etwa durch flexiblere Arbeitszeiten und eine bessere Bezahlung.“", hinweis: "Fast! Nach „vorschlagen, …“ steht der Infinitiv mit „zu“: … die Arbeitsbedingungen zu verbessern." },
        { html: "„Ich würde vorschlagen, dass man verbessert die Arbeitsbedingungen, etwa durch flexiblere Arbeitszeiten und eine bessere Bezahlung.“", hinweis: "Fast! Im dass-Satz steht das Verb am Ende: … dass man die Arbeitsbedingungen verbessert." }],
      danke: "„Flexiblere Arbeitszeiten – das wünschen sich viele im Team. Danke!“",
      pruefe: (T) => {
        const w = T.trim().split(" ");
        let iV = w.findIndex((x) => /^(vorschlagen|empfehlen|empfehle|raten|anregen)$/.test(x));
        if (iV < 0) { const s = w.indexOf("schlage"); if (s >= 0) iV = w.indexOf("vor", s); }
        if (iV >= 0) for (let i = iV + 1; i < w.length; i++) {
          if (/^(dass|um|damit|weil|wenn)$/.test(w[i])) break;
          if (INF_ZU.test(w[i]) && w[i - 1] !== "zu") return { fehler: "Fast! Nach „vorschlagen, …“ steht der Infinitiv mit „zu“: … zu " + w[i] + "." };
        }
        if (!/ (bezahlung|gehalt|gehälter|lohn|löhne|arbeitszeit|arbeitszeiten|arbeitsbedingungen|ausbildung|personal|pflegekräfte|anwerben|ausland|entlasten|entlastung|schicht|schichten|kita|kinderbetreuung|wertschätzung|attraktiver|einstellen|azubis|prämie|prämien|wohnung|wohnungen|teilzeit|digitalisierung|bürokratie|stellen|mitarbeiter|bezahlen|verdienen|urlaub|weiterbildung) /.test(T)) return null;
        return { ok: true, antwort: "„Flexiblere Arbeitszeiten – das wünschen sich viele im Team. Danke für den Vorschlag!“" };
      },
      woerter: ["Pflegekräfte", "Arbeitsbedingungen", "Bezahlung", "Arbeitszeiten", "Personalmangel"], frei: "Schlag Maßnahmen gegen den Personalmangel vor: „Ich würde vorschlagen, … zu …“." },
    { id: "sternwarte_licht", niveau: "C1", kat: "verben", titel: "Wo sind die Sterne?", person: { art: 4 }, braucht: ["sternwarte"], ziel: ["rathaus", "schule", "bibliothek"],
      text: (z) => "Die Astronomin der Sternwarte ist auf dem Weg " + zum(z) + ": „Seit die Stadt wächst, sehen wir kaum noch Sterne. Wie ließe sich die Lichtverschmutzung verringern?“",
      frage: "Mach einen Vorschlag.",
      antworten: () => [
        { html: "„Man könnte die Straßenlaternen nachts dimmen, damit der Himmel wieder dunkler wird.“", richtig: true },
        { html: "„Man könnte die Straßenlaternen nachts gedimmt werden, damit der Himmel wieder dunkler wird.“", hinweis: "Fast! Entweder aktiv – „Man könnte die Laternen dimmen“ – oder Passiv – „Die Laternen könnten gedimmt werden“." },
        { html: "„Man könnte die Straßenlaternen nachts dimmen, um der Himmel wieder dunkler wird.“", hinweis: "Fast! „um … zu“ braucht einen Infinitiv; mit eigenem Subjekt heißt es „damit“: damit der Himmel wieder dunkler wird." }],
      danke: "„Gedimmte Laternen – das schlage ich im Stadtrat vor.“",
      pruefe: (T) => {
        if (/ man (könnte|kann|sollte|soll|müsste|muss) ([^ ]+ ){0,5}ge[^ ]+ werden /.test(T)) return { fehler: "Fast! Entweder aktiv – „Man könnte die Laternen dimmen“ – oder Passiv – „Die Laternen könnten gedimmt werden“." };
        if (!/ (licht|lichter|laterne|laternen|straßenlaternen|lampe|lampen|beleuchtung|dimmen|gedimmt|ausschalten|abschalten|ausmachen|nachts|led|bewegungsmelder|abschirmen|unten|weniger|dunkel|dunkler|zeitschaltuhr|reklame|leuchtreklame|schaufenster|lichtverschmutzung) /.test(T)) return null;
        return { ok: true, antwort: "„Gedimmte Laternen – das schlage ich im Stadtrat vor. Vielen Dank!“" };
      },
      woerter: ["Lichtverschmutzung", "Straßenlaternen", "dimmen", "Sternwarte", "Himmel"], frei: "Schlag vor, wie die Stadt nachts dunkler werden könnte." },
    /* ---------- C2 ---------- */
    { id: "forscher_hypothese", niveau: "C2", kat: "zeiten", titel: "Was wäre, wenn …?", person: { art: 2, er: true }, braucht: FORSCH, ziel: ["labor", "bibliothek", "schule"],
      text: () => "Ein Stadtsoziologe fragt: „Angenommen, Ihre Stadt hätte von Anfang an konsequent auf Wissenschaft gesetzt – wo stünde sie heute?“",
      frage: "Antworte hypothetisch und wäge ab.",
      antworten: () => [
        { html: "„Hätte man früher in die Wissenschaft investiert, wäre die Stadt heute womöglich innovativer, hätte aber vielleicht weniger Wohnraum.“", richtig: true },
        { html: "„Hätte man früher in die Wissenschaft investiert, die Stadt wäre heute womöglich innovativer, hätte aber vielleicht weniger Wohnraum.“", hinweis: "Fast! Nach dem vorangestellten Bedingungssatz kommt zuerst das Verb: …, wäre die Stadt heute …" },
        { html: "„Hätte man früher in die Wissenschaft investiert, wäre die Stadt heute womöglich innovativer geworden sein, hätte aber vielleicht weniger Wohnraum.“", hinweis: "Fast! Eine Zeitform zu viel: wäre … heute innovativer – oder: wäre … innovativer geworden." }],
      danke: "„Eine kluge Abwägung – Fortschritt hat eben immer seinen Preis.“",
      pruefe: (T) => {
        if (/ (investiert|gesetzt|gebaut|gefördert|konzentriert|entschieden|geforscht)( hätte| hätten| wäre)? (die stadt|sie|es|man|wir|unsere stadt) (wäre|hätte|würde|könnte|stünde|wären|hätten|würden|könnten) /.test(T)) return { fehler: "Fast! Nach dem vorangestellten Bedingungssatz kommt zuerst das Verb: …, wäre die Stadt heute …" };
        if (/ (wäre|wären) ([^ ]+ ){0,5}geworden sein /.test(T)) return { fehler: "Fast! Eine Zeitform zu viel: wäre … heute innovativer – oder: wäre … innovativer geworden." };
        if (!/ (stadt|sie|heute|forschung|wissenschaft|innovativ|innovativer|weiter|entwickelt|moderner|wohnraum|wohlstand|vielleicht|womöglich|vermutlich|wahrscheinlich|schwer|darauf|lässt|reicher|ärmer|anders|besser|schlechter) /.test(T)) return null;
        if (!/ (hätte|hätten|wäre|wären|würde|würden|könnte|könnten|müsste|müssten|stünde|stände|gäbe|ginge|läge|dürfte) /.test(T)) return { fehlt: "Antworte hypothetisch – mit „hätte“, „wäre“ oder „würde“: Hätte man früher …, wäre die Stadt heute …" };
        return { ok: true, antwort: "„Eine kluge Abwägung – Fortschritt hat eben immer seinen Preis.“" };
      },
      woerter: ["Wissenschaft", "innovativer", "Wohnraum", "womöglich", "investiert"], frei: "Antworte hypothetisch: Wo stünde die Stadt heute, wenn sie früher auf Wissenschaft gesetzt hätte?" },
    { id: "bahnhof_ironie", niveau: "C2", kat: "stil", titel: "Pünktlich wie immer", person: { art: 4 }, ziel: ["bahnhof"],
      vars: () => ({ min: wahl([35, 40, 50, 55]) }),
      text: (z, v) => "Eine Pendlerin am Bahnhof verdreht die Augen: „Na großartig, schon wieder " + v.min + " Minuten Verspätung. Auf die Bahn ist eben Verlass!“",
      frage: "Sie meint das nicht wörtlich. Wie reagierst du passend?",
      antworten: () => [
        { html: "„Tja, da ist wohl Geduld gefragt. Wollen wir uns die Wartezeit mit einem Kaffee vertreiben?“", richtig: true },
        { html: "„Stimmt, die Bahn ist wirklich sehr zuverlässig.“", hinweis: "Achtung, Ironie: Sie meint genau das Gegenteil – die Bahn ist gerade alles andere als zuverlässig." },
        { html: "„Tja, da ist wohl Geduld gefragt. Wollen wir die Wartezeit mit einem Kaffee vertreiben?“", hinweis: "Fast! „sich die Zeit vertreiben“ ist reflexiv: Wollen wir uns die Wartezeit … vertreiben?" }],
      danke: "„Gute Idee – am Bahnhof gibt es einen Kiosk.“",
      pruefe: (T) => {
        const verstanden = / (nicht|kaum|leider|ironisch|ironie|witzig|scherz|tja|ärgerlich|nervig|typisch|wieder|wohl|gegenteil|naja|haha|ach|oje|verlass|geduld|kaffee|café|warten|wartezeit|unpünktlich|verspätet|verspätung|ärgern|mist|schade|genervt|glück|immerhin) /.test(T);
        if (/ (stimmt|genau|richtig|ja|recht|zuverlässig|pünktlich|super|toll) /.test(T) && !verstanden) return { falsch: "Achtung, Ironie: Sie meint genau das Gegenteil – die Bahn ist gerade alles andere als zuverlässig." };
        if (/ vertreib/.test(T) && !/ (uns|sich|mir|dir|euch) /.test(T)) return { fehler: "Fast! „sich die Zeit vertreiben“ ist reflexiv: Wollen wir uns die Wartezeit … vertreiben?" };
        if (!verstanden) return null;
        return { ok: true, antwort: "„Ha, genau! Ein Kaffee rettet den Tag – kommen Sie mit?“" };
      },
      woerter: ["Geduld", "Wartezeit", "Verspätung", "Kaffee", "Verlass"], frei: "Sie meint es ironisch – reagier mit Verständnis oder Humor." },
    { id: "brauerei_konzern", niveau: "C2", kat: "praepositionen", titel: "Ein Angebot für die Brauerei", person: { art: 0, er: true }, ziel: ["brauerei"],
      text: () => "Der alte Braumeister: „Ein Konzern will unsere Brauerei kaufen. Die Arbeitsplätze wären sicher, aber unser Rezept ginge verloren. Wozu würden Sie mir raten?“",
      frage: "Rate ihm – gern mit einer Bedingung.",
      antworten: () => [
        { html: "„Ich würde Ihnen dazu raten, das Angebot abzulehnen – es sei denn, der Konzern garantiert vertraglich, das Rezept beizubehalten.“", richtig: true },
        { html: "„Ich würde Ihnen dafür raten, das Angebot abzulehnen – es sei denn, der Konzern garantiert vertraglich, das Rezept beizubehalten.“", hinweis: "Fast! Man rät jemandem „zu“ etwas: dazu raten (oder: davon abraten)." },
        { html: "„Ich würde Ihnen dazu raten, das Angebot abzulehnen – es sei denn, der Konzern vertraglich garantiert, das Rezept beizubehalten.“", hinweis: "Fast! Nach „es sei denn“ folgt ein Hauptsatz – das Verb steht an zweiter Stelle: es sei denn, der Konzern garantiert vertraglich …" }],
      danke: "„Ein Vertrag mit Bedingungen … so könnte unser Rezept überleben. Ich danke Ihnen!“",
      pruefe: (T) => {
        if (/ (dafür|für) raten /.test(T) || / rate ([^ ]+ ){0,2}dafür /.test(T)) return { fehler: "Fast! Man rät jemandem „zu“ etwas: dazu raten (oder: davon abraten)." };
        const w = T.trim().split(" "), i = w.findIndex((x, k) => x === "es" && w[k + 1] === "sei" && w[k + 2] === "denn");
        if (i >= 0) {
          let j = i + 3; j = SUBJ_PRON.has(w[j]) ? j + 1 : DET.test(w[j] || "") ? j + 2 : -1;
          if (j > 0 && w[j] && !FINIT.has(w[j]) && w.slice(j + 1, j + 4).some((x) => FINIT.has(x))) return { fehler: "Fast! Nach „es sei denn“ folgt ein Hauptsatz – das Verb steht an zweiter Stelle: es sei denn, der Konzern garantiert vertraglich …" };
        }
        if (!/ (angebot|ablehnen|abzulehnen|annehmen|anzunehmen|verkaufen|behalten|abraten|raten|rate|konzern|rezept|tradition|arbeitsplätze|vertrag|vertraglich|garantie|garantiert|bedingung|bedingungen|kompromiss|verhandeln|nachverhandeln|anwalt) /.test(T)) return null;
        if (!/ (rate|raten|empfehle|empfehlen|würde|sollten|stelle|ablehnen|abzulehnen|annehmen|anzunehmen|verkaufen|behalten|nicht) /.test(T)) return { fehlt: "Gib ihm einen klaren Rat: annehmen, ablehnen – oder nur unter Bedingungen?" };
        return { ok: true, antwort: "„Ein Vertrag mit Bedingungen … ja, so könnte unser Rezept überleben. Ich danke Ihnen!“" };
      },
      woerter: ["Konzern", "Rezept", "Angebot", "vertraglich", "Braumeister"], frei: "Rate dem Braumeister: Angebot annehmen oder ablehnen – und unter welcher Bedingung?" },
    { id: "rathaus_zeitung", niveau: "C2", kat: "verben", titel: "Für die Stadtzeitung", person: { art: 4 }, ziel: ["rathaus"],
      vars: (S) => ({ fehlt: fehltDer(S) || { key: "umgehung", g: "die", name: "Umgehungsstraße" } }),
      text: (z, v) => "Eine Journalistin der Stadtzeitung: „Der Stadtforscher hat gestern gesagt: ‚Die Stadt wächst schnell, aber es fehlt " + einN(v.fehlt) + ".‘ Wie gebe ich das im Artikel korrekt wieder?“",
      frage: "Gib es in indirekter Rede wieder.",
      antworten: (z, v) => [
        { html: "„Der Stadtforscher sagte, die Stadt wachse schnell, es fehle aber " + einN(v.fehlt) + ".“", richtig: true },
        { html: "„Der Stadtforscher sagte, die Stadt wächst schnell, es fehlt aber " + einN(v.fehlt) + ".“", hinweis: "Fast! In der Zeitung steht die indirekte Rede im Konjunktiv I: die Stadt wachse, es fehle …" },
        { html: "„Der Stadtforscher sagte, die Stadt würde schnell wachsen, es würde aber " + einN(v.fehlt) + " fehlen.“", hinweis: "Fast! „würde“ ist hier nur ein Ersatz. Wo der Konjunktiv I eindeutig ist, nimmt die Zeitung ihn: die Stadt wachse, es fehle …" }],
      danke: "„Perfekt – genau so schreibe ich es.“",
      pruefe: (T) => {
        if (!/ (sagte|meinte|erklärte|betonte|sagt|gesagt|zufolge|laut|äußerte|behauptete|gab|teilte|ansicht|angaben|berichtete|stellte|so der) /.test(T)) return null;
        if (!/ (wachse|wächst|wachsen|fehle|fehlt|fehlen|würde|wüchse|fehlte|sei|ist) /.test(T)) return null;
        if (/ würde ([^ ]+ ){0,4}(wachsen|fehlen) /.test(T)) return { fehler: "Fast! „würde“ ist hier nur ein Ersatz. Wo der Konjunktiv I eindeutig ist, nimmt die Zeitung ihn: die Stadt wachse, es fehle …" };
        if (!/ (laut|zufolge|angaben|ansicht) /.test(T) && / (wächst|fehlt) /.test(T)) return { fehler: "Fast! In der Zeitung steht die indirekte Rede im Konjunktiv I: die Stadt wachse, es fehle …" };
        if (/ (wüchse|fehlte) /.test(T)) return { fehler: "Fast! Der Konjunktiv I ist hier eindeutig – ihn nimmt die Zeitung: die Stadt wachse, es fehle …" };
        return { ok: true, antwort: "„Perfekt – genau so schreibe ich es. Sie haben ein Händchen für Zeitungsdeutsch!“" };
      },
      woerter: (z, v) => ["Stadtforscher", "Stadtzeitung", "Artikel", v.fehlt.name], frei: "Gib den Satz des Forschers in indirekter Rede wieder: „Der Stadtforscher sagte, die Stadt …“." },
    { id: "bergwerk_wandel", niveau: "C2", kat: "wortstellung", titel: "Die Zukunft des Bergwerks", person: { art: 5, er: true }, ziel: ["bergwerk"],
      text: () => "Ein Bergmann sitzt vor dem Stollen: „Die Mine lohnt sich bald nicht mehr. Was soll dann bloß aus uns werden?“",
      frage: "Zeig Verständnis und eine Perspektive.",
      antworten: () => [
        { html: "„Ich kann Ihre Sorge gut nachvollziehen. Vielleicht ließe sich das Bergwerk in ein Museum umwandeln, sodass neue Arbeitsplätze im Tourismus entstünden.“", richtig: true },
        { html: "„Ich kann Ihre Sorge gut nachvollziehen. Vielleicht ließe sich das Bergwerk in ein Museum umwandeln, sodass entstünden neue Arbeitsplätze im Tourismus.“", hinweis: "Fast! „sodass“ leitet einen Nebensatz ein – das Verb ans Ende: … sodass neue Arbeitsplätze im Tourismus entstünden." },
        { html: "„Ich kann Ihre Sorge gut nachvollziehen. Vielleicht ließe sich das Bergwerk in ein Museum umwandeln lassen, sodass neue Arbeitsplätze im Tourismus entstünden.“", hinweis: "Fast! Ein „lassen“ zu viel: Vielleicht ließe sich das Bergwerk in ein Museum umwandeln." }],
      danke: "„Ein Besucherbergwerk … Danke für die Hoffnung!“",
      pruefe: (T) => {
        if (/ (ließe|lässt) sich ([^ ]+ ){1,8}lassen /.test(T)) return { fehler: "Fast! Ein „lassen“ zu viel: Vielleicht ließe sich das Bergwerk in ein Museum umwandeln." };
        if (!/ (sorge|sorgen|verstehe|nachvollziehen|verständlich|schwer|leid|museum|umschulung|umschulen|weiterbildung|tourismus|touristen|arbeit|arbeitsplätze|jobs|job|strukturwandel|chance|chancen|zukunft|perspektive|perspektiven|solar|solaranlagen|windkraft|windpark|windräder|besucherbergwerk|führungen|förderung|unterstützung|hilfe|umwandeln|umnutzen|umbauen|nutzen|energie|neue|neuen|neues) /.test(T)) return null;
        if (!/ (museum|umschulung|umschulen|weiterbildung|tourismus|touristen|neue|neuen|neues|arbeitsplätze|jobs|job|solaranlagen|windräder|chance|chancen|zukunft|perspektive|perspektiven|solar|windkraft|windpark|besucherbergwerk|führungen|förderung|fördern|unterstützung|unterstützen|hilfe|umwandeln|umnutzen|umbauen|nutzen|energie|ausbildung|anders) /.test(T)) return { fehlt: "Zeig ihm auch eine Perspektive: Was könnte aus dem Bergwerk – oder aus den Bergleuten – werden?" };
        return { ok: true, antwort: "„Ein Besucherbergwerk … dann könnte ich selbst die Führungen machen. Danke für die Hoffnung!“" };
      },
      woerter: ["Bergwerk", "Museum", "Tourismus", "Arbeitsplätze", "nachvollziehen", "Strukturwandel"], frei: "Zeig dem Bergmann Verständnis und eine Perspektive für das Bergwerk." }
  ];
  for (const v of NEU) VORLAGEN.push(v);
  Q.VORLAGEN = VORLAGEN;
  const KAT_NAME = { betonung: "Betonung", artikel: "Artikel", praepositionen: "Präpositionen", faelle: "Fälle", stil: "Stil", wortstellung: "Wortstellung", wortbildung: "Wortbildung",
    wortschatz: "Wortschatz", uhrzeit: "Uhrzeit", zeiten: "Zeitformen", verben: "Verben", zahlen: "Zahlen" };

  /* =====================================================================
     5. STAND, PUNKTE, GESCHENKE
     ===================================================================== */
  const SPEICHER = () => "leicht_quest_v1" + (ST.spiel && ST.spiel.uid ? "_" + ST.spiel.uid : "");
  function standLesen() { try { const s = JSON.parse(localStorage.getItem(SPEICHER()) || "{}"); return { punkte: +s.punkte || 0, geschafft: +s.geschafft || 0, geschenke: Array.isArray(s.geschenke) ? s.geschenke.slice(-50) : [], letzte: Array.isArray(s.letzte) ? s.letzte.slice(-12) : [] }; } catch (e) { return { punkte: 0, geschafft: 0, geschenke: [], letzte: [] }; } }
  function standSchreiben(s) { try { localStorage.setItem(SPEICHER(), JSON.stringify(s)); } catch (e) {} }
  Q.stand = standLesen;

  /* ---------- 5b. FASSUNG 875 — STAND DER STADT UND NIVEAU ----------
     Stand: was steht (da), wohin man laufen kann (ziel: wie ziele(), ohne Eingänge zu rechnen), was gerade gebaut wird
     (bau: neu oder Ausbau), welche Häuser fertig sind, wie viele Wahrzeichen, der Name der Stadt. Einmal je 0,8 s gezählt –
     die Auswahl fragt oft (Sonde: 3000-mal hintereinander). */
  let standCache = null, standZeit = -1e9;
  function stadtStand(frisch) {
    const jetzt = performance.now();
    if (standCache && !frisch && jetzt - standZeit < 800) return standCache;
    const S = { da: new Set(), ziel: new Set(), bau: [], haeuser: new Set(), wunder: 0, name: "" };
    for (const o of SZ.objekte) {
      if (o.versteckt || o.geist) continue;
      if (o.art === "haus" && o.spiel) {
        if (o.bau) S.bau.push({ key: o.spiel, neu: !o.stufenZahl });
        if (o.bau && !o.stufenZahl) continue;
        S.da.add(o.spiel); S.haeuser.add(o.spiel);
        if (!o.bau && NAMEN[o.spiel]) S.ziel.add(o.spiel);
      } else if (o.art === "wunder" && o.spiel) { S.da.add(o.spiel); S.wunder++; if (NAMEN[o.spiel]) S.ziel.add(o.spiel); }
      else if (o.art === "kulisse" && (o.name === "Bahnhof" || o.name === "Bootsverleih")) { const k = o.name === "Bahnhof" ? "bahnhof" : "bootsverleih"; S.da.add(k); S.ziel.add(k); }
    }
    if (D.BRUNNEN) { S.da.add("brunnen"); S.ziel.add("brunnen"); }
    try { const ich = L().ich || {}; S.name = String(ich.dorf_name || "").trim().slice(0, 40); } catch (e) {}
    standCache = S; standZeit = jetzt;
    return S;
  }
  /* kann die Mission in dieser Stadt kommen? (ein Gebäude aus braucht, ein erreichbares Ziel, die Bedingung) */
  const standPasst = (v, S) => (!v.braucht || v.braucht.some((k) => S.da.has(k))) && (!v.stand || v.stand(S));
  const verfuegbar = (v, S) => standPasst(v, S) && v.ziel.some((k) => S.ziel.has(k));
  /* Niveau: eigene Wahl (dma_quest_niveau) – sonst das Niveau des Spiels – sonst A2; ?questniveau=B2 zum Ausprobieren */
  const NIV_SPEICHER = "dma_quest_niveau";
  function niveau() {
    const u = (q.get("questniveau") || "").toUpperCase(); if (NIVEAUS.indexOf(u) >= 0) return u;
    try { const n = localStorage.getItem(NIV_SPEICHER); if (NIVEAUS.indexOf(n) >= 0) return n; const s = localStorage.getItem("dma_spiel_niveau"); if (NIVEAUS.indexOf(s) >= 0) return s; } catch (e) {}
    return "A2";
  }
  function niveauSetzen(n) { if (NIVEAUS.indexOf(n) < 0) return; try { localStorage.setItem(NIV_SPEICHER, n); } catch (e) {} }
  const nivIdx = (n) => Math.max(0, NIVEAUS.indexOf(n));
  /* Anteil je Stufe: das eigene Niveau voll, eins darunter knapp die Hälfte, zwei darunter ein Fünftel, weiter unten ein Zehntel
     (je Stufe, egal wie viele Missionen sie hat) – auf C2 kommt so gut die Hälfte aus C2, auf A2 gut zwei Drittel aus A2 */
  const STUFE_ANTEIL = [1, 0.45, 0.2, 0.1];
  Q.niveau = niveau;
  /* Geschenke (Schmuck aus oberflaeche.js SCHMUCK): Name, Bild, Grundfläche, Höhe, Artikel */
  const GESCHENKE = [["eine Bank", "d_bank", [1.9, 0.75], 0.9], ["eine Laterne", "d_laterne", [0.8, 0.8], 4.4], ["einen Apfelbaum", "n_obstbaum0", [3, 3], 6],
    ["eine Bank", "d_bank", [1.9, 0.75], 0.9], ["einen Laubbaum", "n_laubbaum0", [4.5, 4.5], 13], ["einen Brunnen", "d_brunnen", [4.6, 4.6], 5.4], ["einen Apfelbaum", "n_obstbaum1", [3, 3], 6]];
  function freiePlatz(x0, y0, r) {
    const n = netz();
    for (let ring = 0; ring < 7; ring++) for (let k = 0; k < 12; k++) {
      const a = k / 12 * Math.PI * 2 + ring * 0.7, d = 5 + ring * 2.5, x = x0 + Math.cos(a) * d, y = y0 + Math.sin(a) * d;
      if (ST.boden && ST.boden.wert && (ST.boden.wert(x, y, 1) > 0.2 || ST.boden.wert(x, y, 0) > 0.3)) continue;
      if (SZ.objekte.some((o) => !o.versteckt && o.art !== "natur" && Math.hypot(o.x - x, o.y - y) < r + Math.hypot((o.fuss || [1, 1])[0], (o.fuss || [1, 1])[1]) / 2 + 0.6)) continue;
      if (SZ.objekte.some((o) => o.art === "natur" && !o.versteckt && Math.hypot(o.x - x, o.y - y) < r + 1.5)) continue;
      let naheWeg = false; for (const p of n.kn) if (Math.hypot(p[0] - x, p[1] - y) < r + 1.8) { naheWeg = true; break; }
      if (naheWeg || naheBruecke(x, y, 9)) continue;
      if (D.imGrundriss && D.imGrundriss("rathaus", x, y, r + 1)) continue;
      return [x, y];
    }
    return null;
  }
  function geschenkGeben(qu, st) {
    const G = GESCHENKE[Math.floor(st.geschafft / 3 - 1) % GESCHENKE.length] || GESCHENKE[0];
    const p = freiePlatz(qu.ziel.tuer[0], qu.ziel.tuer[1], Math.max(G[2][0], G[2][1]) / 2);
    if (!p) return null;
    const o = SZ.neu({ art: "eigen", bild: G[1], x: +p[0].toFixed(2), y: +p[1].toFixed(2), dreh: 0, fuss: G[2], hoehe: G[3] });
    o.questGeschenk = performance.now();
    try { if (L().dekoSpeichern) L().dekoSpeichern(); } catch (e) {}
    L().unruhe = 2;
    funken(p[0], p[1], 1.5, 26, ["#ffe27a", "#fff6c8", "#ffc93c"]);
    st.geschenke.push(G[1]);
    return G[0];
  }

  /* =====================================================================
     6. FIGUREN, REQUISITEN, KONFETTI
     ===================================================================== */
  const GEHER = { zw: 160, zh: 104, ax: 36, ay: 82, n: 12, s: 40 };
  Q.blattErlaubt = !LB.nurKlein;
  const blatt = (art, Z) => "l_geher" + art + "_" + (SZ.jahr === "winter" ? "winter" : "herbst") + "_" + (Z.nacht > 0.5 ? "nacht" : "tag");
  const gierReihe = (h) => { const gier = Math.atan2(-Math.cos(h), Math.sin(h)) * 180 / Math.PI + K.dreh * 90; return ((Math.round(gier / 45) % 8) + 8) % 8; };
  /* Blickrichtung zur Kamera (die Richtung, in der der Punkt im Bild am weitesten nach unten wandert) */
  function zurKamera(x, y) { let best = 0, bw = -Infinity; const P0 = ST.proj(x, y, 0); for (let k = 0; k < 8; k++) { const h = k * Math.PI / 4, P = ST.proj(x + Math.cos(h), y + Math.sin(h), 0); if (P[1] - P0[1] > bw) { bw = P[1] - P0[1]; best = h; } } return best; }
  function weg(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts: pts, cum: cum, len: cum[cum.length - 1] }; }
  function aufWeg(w, s) {
    s = Math.max(0, Math.min(w.len, s));
    let i = 1; while (i < w.cum.length - 1 && w.cum[i] < s) i++;
    const a = w.pts[i - 1], b = w.pts[i], l = (w.cum[i] - w.cum[i - 1]) || 1, t = (s - w.cum[i - 1]) / l;
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, h: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }
  const bruecke3 = (x, y) => (ST.fuhrwerk && ST.fuhrwerk.aufBruecke ? ST.fuhrwerk.aufBruecke(x, y) : null);
  const funkenListe = [];
  function funken(x, y, z, n, farben) {
    for (let i = 0; i < n; i++) { const a = zufall() * Math.PI * 2, v = 1.2 + zufall() * 2.2; funkenListe.push({ x: x, y: y, z: z, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vz: 3 + zufall() * 3.5, t: 0, f: wahl(farben || ["#ff5a5a", "#ffd23c", "#4ec3ff", "#6ee07a", "#ff8ad8"]), d: 1.6 + zufall() * 0.8 }); }
  }
  /* Figur als Eintrag für szene.js (zwischen die Dinge einsortiert) */
  function figurEintrag(f, Z) {
    const br = bruecke3(f.x, f.y), hopp = f.hopp || 0, P = ST.proj(f.x, f.y, (br ? br.z : 0) + hopp);
    if (P[0] < -80 || P[0] > K.W + 80 || P[1] < -80 || P[1] > K.H + 200) return null;
    const r = ST.drehXY(f.x, f.y, K.dreh), gr = f.klein ? 0.72 : 1;
    const name = blatt(f.art, Z), meta = LB.vz[name] || GEHER, img = Q.blattErlaubt ? LB.bild(name) : null;
    const schritt = f.laeuft ? Math.floor((f.ph || 0) * meta.n) % meta.n : 0;
    return { X: P[0], Y: P[1], a: r[0], b: r[1], bx: 0.6, bh: (br ? 2 + br.z : 2) * gr, auf: br ? br.o : null, f: f,
      malen: (g, p) => {
        g.save(); g.globalAlpha = Math.max(0, Math.min(1, f.alpha == null ? 1 : f.alpha));
        if (img) { const k = K.s / meta.s * gr; g.drawImage(img, schritt * meta.zw, gierReihe(f.h) * meta.zh, meta.zw, meta.zh, p.X - meta.ax * k, p.Y - meta.ay * k, meta.zw * k, meta.zh * k); }
        else ersatzFigur(g, p.X, p.Y, gr, f);
        if (f.schirm) schirmMalen(g, p.X, p.Y, gr);
        if (f.weint && f.zustand !== "unterwegs" && f.zustand !== "jubel") traenenMalen(g, p.X, p.Y, gr);
        g.restore();
      } };
  }
  const FARBE = ["#556b4a", "#2f5a3c", "#35553a", "#2c3e66", "#b3262e", "#46583c"];
  function ersatzFigur(g, X, Y, gr, f) {
    const u = K.s * gr;
    g.fillStyle = "rgba(20,30,40,.25)"; g.beginPath(); g.ellipse(X + 0.35 * u, Y, 0.45 * u, 0.16 * u, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = FARBE[f.art % FARBE.length]; g.beginPath(); g.ellipse(X, Y - 0.85 * u, 0.27 * u, 0.62 * u, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f0c9a4"; g.beginPath(); g.arc(X, Y - 1.62 * u, 0.2 * u, 0, Math.PI * 2); g.fill();
  }
  function schirmMalen(g, X, Y, gr) {
    const u = K.s * gr, cx = X + 0.1 * u, cy = Y - 2.05 * u, r = 0.72 * u;
    g.strokeStyle = "#3a3a3a"; g.lineWidth = Math.max(1, 0.05 * u); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy + 0.75 * u); g.stroke();
    g.fillStyle = "#c8312b"; g.beginPath(); g.moveTo(cx - r, cy + 0.12 * u); g.quadraticCurveTo(cx, cy - 0.75 * u, cx + r, cy + 0.12 * u); g.closePath(); g.fill();
    g.fillStyle = "#f3ead8"; g.beginPath(); g.moveTo(cx - r * 0.33, cy + 0.12 * u); g.quadraticCurveTo(cx, cy - 0.62 * u, cx + r * 0.33, cy + 0.12 * u); g.closePath(); g.fill();
  }
  function traenenMalen(g, X, Y, gr) {
    const u = K.s * gr; if (u < 5) return;
    const t = performance.now() / 1000;
    g.fillStyle = "rgba(120,190,255,.95)";
    for (const [dx, ph] of [[-0.12, 0], [0.12, 0.5]]) {
      const k = ((t * 0.9 + ph) % 1), x = X + dx * u, y = Y - 1.62 * u + k * 0.55 * u, s = 0.07 * u;
      g.globalAlpha = 1 - k; g.beginPath(); g.moveTo(x, y - s * 1.6); g.quadraticCurveTo(x + s, y, x, y + s); g.quadraticCurveTo(x - s, y, x, y - s * 1.6); g.fill();
    }
    g.globalAlpha = 1;
  }
  /* Hund (selbst gezeichnet): sitzt, wedelt, springt beim Wiedersehen */
  function hundEintrag(hd) {
    const P = ST.proj(hd.x, hd.y, hd.hopp || 0); if (P[0] < -60 || P[0] > K.W + 60 || P[1] < -60 || P[1] > K.H + 100) return null;
    const r = ST.drehXY(hd.x, hd.y, K.dreh);
    return { X: P[0], Y: P[1], a: r[0], b: r[1], bx: 0.5, bh: 0.8, malen: (g, p) => {
      const u = K.s * 1.3, t = performance.now() / 1000, s = hd.seite || 1, wedel = Math.sin(t * (hd.froh ? 22 : 9)) * 0.5;
      g.save(); g.globalAlpha = hd.alpha == null ? 1 : hd.alpha; g.translate(p.X, p.Y); g.scale(s, 1);
      g.fillStyle = "rgba(20,30,40,.25)"; g.beginPath(); g.ellipse(0.1 * u, 0, 0.5 * u, 0.13 * u, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#7a4a22"; g.lineWidth = Math.max(1, 0.09 * u); g.lineCap = "round";
      g.beginPath(); g.moveTo(-0.32 * u, -0.38 * u); g.quadraticCurveTo(-0.55 * u, -0.55 * u, -0.5 * u + wedel * 0.12 * u, -0.78 * u); g.stroke();
      g.fillStyle = "#a0662e"; g.beginPath(); g.ellipse(-0.05 * u, -0.34 * u, 0.36 * u, 0.2 * u, 0, 0, Math.PI * 2); g.fill();
      g.fillRect(-0.3 * u, -0.3 * u, 0.1 * u, 0.3 * u); g.fillRect(0.12 * u, -0.3 * u, 0.1 * u, 0.3 * u);
      g.beginPath(); g.ellipse(0.3 * u, -0.6 * u, 0.19 * u, 0.17 * u, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#6b3f19"; g.beginPath(); g.ellipse(0.22 * u, -0.66 * u, 0.07 * u, 0.14 * u, 0.4, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#2a1a0e"; g.beginPath(); g.arc(0.47 * u, -0.6 * u, 0.045 * u, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#c8312b"; g.fillRect(0.14 * u, -0.49 * u, 0.2 * u, 0.05 * u);
      g.restore();
    } };
  }
  /* Eiswagen (selbst gezeichnet): Kasten mit Streifen, zwei Räder, Sonnenschirm */
  function wagenEintrag(w) {
    const P = ST.proj(w.x, w.y, 0); if (P[0] < -90 || P[0] > K.W + 90 || P[1] < -90 || P[1] > K.H + 120) return null;
    const r = ST.drehXY(w.x, w.y, K.dreh);
    return { X: P[0], Y: P[1], a: r[0], b: r[1], bx: 1.2, bh: 2.6, malen: (g, p) => {
      const u = K.s, rollt = w.rollt ? performance.now() / 1000 * 6 : 0;
      g.save(); g.globalAlpha = w.alpha == null ? 1 : w.alpha; g.translate(p.X, p.Y);
      g.fillStyle = "rgba(20,30,40,.25)"; g.beginPath(); g.ellipse(0.2 * u, 0, 1.2 * u, 0.3 * u, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#f7f1e1"; g.fillRect(-0.95 * u, -1.25 * u, 1.9 * u, 0.9 * u);
      g.fillStyle = "#f29bb4"; for (let i = 0; i < 4; i++) g.fillRect((-0.95 + i * 0.5) * u, -1.25 * u, 0.24 * u, 0.9 * u);
      g.fillStyle = "#7a4a22"; g.fillRect(-1.05 * u, -1.35 * u, 2.1 * u, 0.12 * u);
      for (const x of [-0.6, 0.6]) { g.fillStyle = "#2b2b2b"; g.beginPath(); g.arc(x * u, -0.3 * u, 0.3 * u, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#bbb"; g.lineWidth = Math.max(1, 0.05 * u); g.beginPath(); g.moveTo(x * u, -0.3 * u); g.lineTo(x * u + Math.cos(rollt) * 0.25 * u, -0.3 * u + Math.sin(rollt) * 0.25 * u); g.stroke(); }
      g.strokeStyle = "#555"; g.lineWidth = Math.max(1, 0.06 * u); g.beginPath(); g.moveTo(0, -1.35 * u); g.lineTo(0, -2.5 * u); g.stroke();
      for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "#fff" : "#e8443a"; g.beginPath(); g.moveTo(0, -2.9 * u); g.lineTo((-1.1 + i * 0.367) * u, -2.35 * u); g.lineTo((-1.1 + (i + 1) * 0.367) * u, -2.35 * u); g.closePath(); g.fill(); }
      g.fillStyle = "#ffd6e0"; g.beginPath(); g.arc(0.55 * u, -1.55 * u, 0.2 * u, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#d9a55a"; g.beginPath(); g.moveTo(0.4 * u, -1.5 * u); g.lineTo(0.7 * u, -1.5 * u); g.lineTo(0.55 * u, -1.2 * u); g.closePath(); g.fill();
      g.restore();
    } };
  }
  SZ.figurQuellen.push(function (Z) {
    const aus = [];
    for (const qu of Q.liste) {
      const e = figurEintrag(qu.f, Z); if (e) aus.push(e);
      if (qu.hund) { const h = hundEintrag(qu.hund); if (h) aus.push(h); }
      if (qu.wagen && qu.wagen.alpha > 0) { const w = wagenEintrag(qu.wagen); if (w) aus.push(w); }
    }
    return aus;
  });
  /* Linien flach auf dem Boden: grün = unterwegs (der Rest des Wegs), rot = so wäre sie falsch gelaufen */
  function linie(g, pts, farbe, rand, alpha, strich, t) {
    if (!pts || pts.length < 2) return;
    const P = pts.map((p) => { const br = bruecke3(p[0], p[1]); return ST.proj(p[0], p[1], br ? br.z : 0); });
    const b = Math.max(3 * K.dpr, 0.8 * K.s);
    g.save(); g.globalAlpha = alpha; g.lineJoin = "round"; g.lineCap = "round";
    g.beginPath(); P.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
    g.strokeStyle = rand; g.lineWidth = b + 2.5 * K.dpr; g.stroke();
    g.strokeStyle = farbe; g.lineWidth = b;
    if (strich) { g.setLineDash([b * 1.6, b * 1.3]); g.lineDashOffset = -t * b * 4; }
    g.stroke(); g.restore();
  }
  SZ.bodenMaler.push(function (g, t) {
    if (Q._ohneLinie) return;   // (nur die Sonde: Vergleichsbild ohne Linien)
    for (const qu of Q.liste) {
      if (qu.rot && performance.now() < qu.rot.bis) {
        const rest = (qu.rot.bis - performance.now()) / 1000, a = Math.min(1, rest / 0.8), n = Math.max(2, Math.ceil(qu.rot.pts.length * Math.min(1, (performance.now() - qu.rot.ab) / 1400)));
        linie(g, qu.rot.pts.slice(0, n), "rgba(226,58,48,.95)", "rgba(90,10,10,.35)", 0.9 * a, true, t);
      }
      if (qu.f.zustand === "unterwegs" && qu.weg) {
        const pts = [[qu.f.x, qu.f.y]]; for (let i = 0; i < qu.weg.pts.length; i++) if (qu.weg.cum[i] > qu.f.s) pts.push(qu.weg.pts[i]);
        linie(g, pts, "rgba(64,205,96,.95)", "rgba(10,70,30,.35)", 0.9, true, t);
      }
    }
  });
  /* Konfetti und Funken (vor allem, in Bildkoordinaten) */
  SZ.zuhoerer.push(function (g) {
    if (!funkenListe.length) return;
    const jetzt = performance.now(), dt = Math.min(0.05, (jetzt - (Q._fz || jetzt)) / 1000); Q._fz = jetzt;
    for (let i = funkenListe.length - 1; i >= 0; i--) {
      const p = funkenListe[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vz -= 9 * dt; p.z = Math.max(0, p.z + p.vz * dt);
      if (p.t > p.d) { funkenListe.splice(i, 1); continue; }
      const P = ST.proj(p.x, p.y, p.z), s = Math.max(2, 0.18 * K.s);
      g.globalAlpha = Math.max(0, 1 - p.t / p.d); g.fillStyle = p.f; g.fillRect(P[0] - s / 2, P[1] - s / 2, s, s * 0.7);
    }
    g.globalAlpha = 1; L().unruhe = 2;
  });

  /* =====================================================================
     7. ZEICHEN („!" und „?") UND DIALOG
     ===================================================================== */
  const stil = document.createElement("style");
  stil.textContent = [
    "#lOber > .lq-ebene { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 2; }",
    ".lq-zeichen { position: absolute; left: 0; top: 0; width: 30px; height: 34px; display: flex; align-items: flex-end; justify-content: center; margin: 0; padding: 0; border: 0; background: none; pointer-events: auto; cursor: pointer; will-change: transform; -webkit-tap-highlight-color: transparent; isolation: isolate; }",
    ".lq-zeichen::before { content: ''; position: absolute; left: 50%; top: 57%; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; z-index: -1; background: radial-gradient(circle, rgba(255,240,150,.9) 0 18%, rgba(255,210,50,.38) 42%, rgba(255,205,50,0) 68%); animation: lq-leuchten 1.9s ease-in-out infinite; }",
    ".lq-zeichen.lq-frage::before { background: radial-gradient(circle, rgba(225,242,255,.9) 0 18%, rgba(120,190,255,.38) 42%, rgba(120,190,255,0) 68%); }",
    ".lq-zeichen svg { width: 22px; height: 29px; display: block; filter: drop-shadow(0 1px 1.5px rgba(0,0,0,.55)); }",
    ".lq-zeichen.lq-rand svg { transform: scale(.82); }",
    "@keyframes lq-leuchten { 0%, 100% { opacity: .6; transform: scale(.82); } 50% { opacity: 1; transform: scale(1.14); } }",
    "body.lk-gestalten .lq-zeichen { display: none; }",
    ".lq-dialog { position: absolute; left: 50%; transform: translateX(-50%); bottom: calc(max(12px, env(safe-area-inset-bottom)) + 6px); width: min(360px, calc(100vw - 16px)); box-sizing: border-box; max-height: min(44%, calc(100% - 96px)); overflow: auto; overscroll-behavior: contain; padding: 6px 10px 8px; border-radius: 14px; background: rgba(22,28,48,.94); border: 1px solid rgba(255,255,255,.16); color: #f3ead8; box-shadow: 0 8px 26px rgba(0,0,0,.4); font: 12.5px/1.3 system-ui, sans-serif; z-index: 6; animation: lq-auf .26s ease-out; touch-action: pan-y; }",
    "@keyframes lq-auf { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }",
    ".lk-mini-modus .lq-dialog { left: 4px; right: 4px; bottom: 4px; width: auto; transform: none; max-height: 58%; padding: 4px 7px 5px; font-size: 11.5px; line-height: 1.25; border-radius: 10px; }",
    /* FASSUNG 827 — schwebend unter dem Bild (über dem Chat des Spiels): das Bild bleibt frei */
    "html.lq-unten, html.lq-unten body { background: transparent; }",
    "html.lq-unten #lStadt { bottom: var(--lq-unten); }",
    "html.lq-unten .lk-mini-modus .lq-dialog.lq-schwebe { position: fixed; top: auto; bottom: 0; left: 0; right: 0; max-height: var(--lq-unten, 190px); border-radius: 0 0 12px 12px; animation: none; background: rgba(22,28,48,.97); }",
    "html.lq-unten .lk-mini-modus .lq-schwebe .lq-text { margin: 1px 0 3px; }",
    "html.lq-unten .lk-mini-modus .lq-schwebe .lq-frage { margin: 0 0 4px; }",
    /* FASSUNG 829 — schwebend ÜBER dem Bild (über den Plätzen): #lStadt rückt per transform nach unten, der Dialog darin
       (position: fixed bezieht sich dann auf #lStadt) steht im Streifen darüber */
    "html.lq-oben, html.lq-oben body { background: transparent; }",
    "html.lq-oben #lStadt { bottom: var(--lq-unten); transform: translateY(var(--lq-unten)); }",
    "html.lq-oben .lk-mini-modus .lq-dialog.lq-schwebe { position: fixed; top: calc(-1 * var(--lq-unten)); bottom: auto; left: 0; right: 0; max-height: var(--lq-unten, 190px); border-radius: 12px 12px 0 0; animation: none; background: rgba(22,28,48,.97); }",
    "html.lq-oben .lk-mini-modus .lq-schwebe .lq-text { margin: 1px 0 3px; }",
    "html.lq-oben .lk-mini-modus .lq-schwebe .lq-frage { margin: 0 0 4px; }",
    /* FASSUNG 846 — XANDER (Walkie 315): die Fragetafeln sind zu groß und verdecken alles; jetzt kompakt (höchstens gut
       die Hälfte des kleinen Bilds, im Vollbild 44 %), die Person bleibt darüber zu sehen */
    ".lq-suche { position: absolute; left: 50%; transform: translateX(-50%); top: 36px; max-width: calc(100% - 16px); box-sizing: border-box; display: flex; align-items: center; gap: 6px; padding: 3px 4px 3px 9px; border-radius: 12px; background: rgba(22,28,48,.9); color: #f3ead8; font: 600 11.5px/1.25 system-ui, sans-serif; z-index: 6; pointer-events: auto; box-shadow: 0 3px 10px rgba(0,0,0,.35); }",
    ".lq-suche b { color: #ffd75e; }",
    ".lq-suche .lq-hinweis { margin: 0; font-weight: 600; }",
    ".lk-mini-modus .lq-suche { top: 32px; font-size: 11px; }",
    ".lq-los { min-height: 30px; margin-top: 4px; padding: 4px 12px; border: 0; border-radius: 10px; background: #2f7d46; color: #fff; font: 700 12px/1 system-ui, sans-serif; cursor: pointer; }",
    ".lq-kopf { display: flex; align-items: center; gap: 6px; }",
    /* FASSUNG 828 — die Mikro-Leiste */
    ".lq-mik { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 0 0 5px; }",
    ".lq-mik button { min-height: 30px; padding: 4px 11px; border: 0; border-radius: 10px; background: #2f6fb5; color: #fff; font: 700 12px/1 system-ui, sans-serif; cursor: pointer; }",
    ".lq-mik button.lq-hoert { background: #c0392b; box-shadow: 0 0 0 calc(var(--pegel, 0) * 7px + 1px) rgba(231,76,60,.35); }",
    ".lq-mik button:disabled { opacity: .75; cursor: default; }",
    ".lq-mik-status { flex: 1 1 140px; min-width: 0; font-size: 11.5px; color: #cfe3ff; font-style: italic; }",
    ".lq-mik-status:empty { display: none; }",
    ".lq-titel { flex: 1; min-width: 0; font-weight: 800; font-size: 13px; color: #ffd75e; }",
    ".lk-mini-modus .lq-titel { font-size: 12px; }",
    ".lq-klein { flex: none; min-width: 32px; min-height: 32px; padding: 0 8px; border: 0; border-radius: 10px; background: rgba(255,255,255,.12); color: #f3ead8; font: 700 13px/1 system-ui, sans-serif; cursor: pointer; }",
    /* FASSUNG 875 — der Niveau-Wähler: ein kleiner Knopf im Kopf („A2“), darunter auf Tipp eine Zeile A1 … C2 */
    ".lq-klein.lq-niv { min-width: 34px; padding: 0 6px; background: rgba(255,215,94,.14); border: 1px solid rgba(255,215,94,.5); color: #ffd75e; font-size: 12px; }",
    ".lq-niveaus { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: 4px 0 2px; }",
    ".lq-niveaus .lq-niv-text { flex: 1 1 100%; font-size: 11.5px; color: #cfe3ff; }",
    ".lq-niveaus button { min-width: 38px; min-height: 30px; padding: 0 6px; border: 1px solid rgba(255,255,255,.22); border-radius: 9px; background: rgba(255,255,255,.08); color: #fff; font: 700 12px/1 system-ui, sans-serif; cursor: pointer; }",
    ".lq-niveaus button.lq-an { background: #ffd75e; border-color: #ffd75e; color: #1d2340; }",
    ".lq-text { margin: 3px 0 5px; }",
    ".lq-frage { margin: 0 0 6px; font-weight: 700; color: #fff; }",
    ".lq-antworten { display: flex; flex-direction: column; gap: 6px; }",
    ".lk-mini-modus .lq-antworten { gap: 4px; }",
    ".lq-antwort { min-height: 30px; text-align: left; padding: 4px 9px; border-radius: 10px; border: 1px solid rgba(255,255,255,.22); background: rgba(255,255,255,.08); color: #fff; font: inherit; cursor: pointer; }",
    ".lk-mini-modus .lq-antwort { min-height: 28px; padding: 3px 7px; }",
    ".lq-antwort:disabled { cursor: default; }",
    ".lq-antwort.lq-falsch { background: rgba(200,60,50,.32); border-color: rgba(255,120,110,.6); color: #ffd9d4; }",
    ".lq-antwort.lq-richtig { background: rgba(50,170,90,.45); border-color: rgba(140,240,170,.8); }",
    ".lq-betont { color: #ffd75e; text-decoration: underline; text-underline-offset: 2px; }",
    ".lq-hinweis { margin: 6px 0 0; color: #ffe3a3; }",
    ".lq-hinweis:empty { display: none; }",
    ".lq-hinweis.lq-gut { color: #b8f5c8; font-weight: 700; }",
    ".lq-plus { position: absolute; left: 0; top: 0; pointer-events: none; translate: -50% -100%; font: 800 15px/1 system-ui, sans-serif; color: #ffe27a; text-shadow: 0 1px 2px rgba(0,0,0,.8), 0 0 4px rgba(0,0,0,.5); white-space: nowrap; animation: lq-plus 2.4s ease-out forwards; }",
    "@keyframes lq-plus { 0% { opacity: 0; transform: translateY(6px) scale(.8); } 15% { opacity: 1; transform: translateY(0) scale(1.1); } 100% { opacity: 0; transform: translateY(-42px) scale(1); } }"
  ].join("\n");
  document.head.appendChild(stil);
  const wurzelEl = document.getElementById("lOber") || document.body;
  const ebene = document.createElement("div"); ebene.className = "lq-ebene"; wurzelEl.appendChild(ebene);
  const SVG_AUSRUF = '<svg viewBox="0 0 34 44" aria-hidden="true"><path d="M13 5.5h8l-1.4 22h-5.2z" fill="#ffd23c" stroke="#5a3a00" stroke-width="2" stroke-linejoin="round"/><circle cx="17" cy="34.5" r="4.3" fill="#ffd23c" stroke="#5a3a00" stroke-width="2"/><path d="M15 8h3" stroke="#fff6c8" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const SVG_FRAGE = '<svg viewBox="0 0 34 44" aria-hidden="true"><path d="M10 13.5c0-4.6 3.4-7.6 7.4-7.6 4.4 0 7.6 2.8 7.6 6.8 0 3.4-2 5-4.2 6.5-1.6 1.1-2.2 2-2.2 3.8v1.6h-5v-2c0-3 1.2-4.6 3.4-6.1 1.6-1.1 2.6-1.8 2.6-3.4 0-1.4-1-2.4-2.4-2.4-1.6 0-2.6 1.1-2.6 2.8z" fill="#e4f2ff" stroke="#123a66" stroke-width="2" stroke-linejoin="round"/><circle cx="16.2" cy="34.5" r="4.1" fill="#e4f2ff" stroke="#123a66" stroke-width="2"/></svg>';
  function zeichenFuer(qu) {
    if (qu.el) return qu.el;
    const b = document.createElement("button"); b.type = "button"; b.className = "lq-zeichen"; b.dataset.q = qu.id;
    b.addEventListener("pointerdown", (e) => { e.stopPropagation(); b._pd = { x: e.clientX, y: e.clientY }; });
    b.addEventListener("pointerup", (e) => { e.stopPropagation(); const p = b._pd; b._pd = null; if (!p || Math.hypot(e.clientX - p.x, e.clientY - p.y) > 14) return; b._pf = e.timeStamp; zeichenTipp(qu); });
    b.addEventListener("click", (e) => { e.stopPropagation(); e.preventDefault(); if (e.timeStamp - (b._pf || -1e9) < 800) return; zeichenTipp(qu); });
    b.addEventListener("contextmenu", (e) => e.preventDefault());
    ebene.appendChild(b); qu.el = b;
    return b;
  }
  /* Knöpfe und Karten der Oberfläche (Kompass, Leisten, kleine Karte …): ein Zeichen legt sich nie darunter, sonst ginge
     der Tipp an den Knopf (alle 0,4 s neu gemessen) */
  let hindZeit = 0, hind = [];
  function hindernisse() {
    const jetzt = performance.now(); if (jetzt - hindZeit < 400) return hind; hindZeit = jetzt;
    hind = [];
    for (const e of wurzelEl.querySelectorAll("button, .lk-karte, .lk-mini-rahmen, .lk-leiste, .lk-wahl, .lk-ortsschild, .lk-uhr")) {
      if (e.closest(".lq-ebene, .lq-dialog, .lk-zeichen-ebene")) continue;
      const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || e.hidden) continue;
      const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || cs.pointerEvents === "none" && e.tagName !== "BUTTON") continue;
      hind.push(r);
    }
    return hind;
  }
  function freiLegen(x, y, W, oben, unten) {
    const H = hindernisse(), bw = 30, bh = 34;   // FASSUNG 846 — die Zeichen sind kleiner (die Tippfläche bleibt 30 × 34 px)
    const deckt = (cx, cy) => H.some((r) => Math.min(r.right, cx + bw / 2) - Math.max(r.left, cx - bw / 2) > 1 && Math.min(r.bottom, cy) - Math.max(r.top, cy - bh) > 1);
    if (!deckt(x, y)) return [x, y];
    for (let d = 12; d < 400; d += 12) for (const [dx, dy] of [[0, -d], [0, d], [d, 0], [-d, 0]]) {
      const cx = Math.max(20, Math.min(W - 20, x + dx)), cy = Math.max(oben + bh, Math.min(unten, y + dy));
      if (!deckt(cx, cy)) return [cx, cy];
    }
    return [x, y];
  }
  /* je Bild: Zeichen über den Köpfen (außerhalb des Bilds an den Rand geklemmt) */
  SZ.zuhoerer.push(function () {
    const W = K.W / K.dpr, H = K.H / K.dpr, oben = mini() ? 34 : 64, unten = mini() ? 40 : 70;
    for (const qu of Q.liste) {
      /* FASSUNG 846 — XANDER (Walkie 315): die „!“ und „?“ sind zu groß und bleiben, wenn die Aufgabe erledigt ist. Nach
         der richtigen Antwort (die Person geht los) ist das Zeichen weg; „?“ nur, solange sie auf dich wartet. */
      const f = qu.f, art = f.zustand === "wartet" ? "!" : f.zustand === "offen" || f.zustand === "gefragt" || f.zustand === "sucht" ? "?" : "";
      if (!art || (f.alpha != null && f.alpha < 0.6)) { if (qu.el) qu.el.style.display = "none"; continue; }
      const b = zeichenFuer(qu);
      if (b.dataset.a !== art) { b.dataset.a = art; b.innerHTML = art === "!" ? SVG_AUSRUF : SVG_FRAGE; b.classList.toggle("lq-frage", art === "?"); const t = art === "!" ? qu.v.titel + " – tippe, um zu helfen" : f.zustand === "unterwegs" ? qu.v.titel + " – unterwegs" : qu.v.titel + " – wartet auf deine Antwort"; b.title = t; b.setAttribute("aria-label", t); }
      const br = bruecke3(f.x, f.y), P = ST.proj(f.x, f.y, (br ? br.z : 0) + (f.klein ? 1.6 : 2.15) + (f.hopp || 0));
      let x = P[0] / K.dpr, y = P[1] / K.dpr - 2;
      const drin = x > 8 && x < W - 8 && y > oben && y < H - 8;
      if (!drin) { x = Math.max(20, Math.min(W - 20, x)); y = Math.max(oben + 34, Math.min(H - unten, y)); }
      [x, y] = freiLegen(x, y, W, oben, H - 8);
      b.classList.toggle("lq-rand", !drin);
      if (b.style.display) b.style.display = "";
      const tr = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translate(-50%,-100%)";
      if (b._t !== tr) { b._t = tr; b.style.transform = tr; }
    }
    for (const p of Array.from(ebene.querySelectorAll(".lq-plus"))) {
      const P = ST.proj(p._x, p._y, p._z); p.style.left = (P[0] / K.dpr).toFixed(1) + "px"; p.style.top = (P[1] / K.dpr).toFixed(1) + "px";
    }
  });
  function plusZeigen(x, y, z, text) {
    const p = document.createElement("div"); p.className = "lq-plus"; p.textContent = text; p._x = x; p._y = y; p._z = z;
    ebene.appendChild(p); setTimeout(() => p.remove(), 2500);
  }
  /* Kamera weich hin: die Person oben im Bild, darunter Platz für den Dialog */
  /* dialogOben: Oberkante des Dialogs (CSS-Pixel) – die Person kommt in die Mitte des freien Streifens darüber */
  /* FASSUNG 846 — XANDER (Walkie 315): „zuerst … auf die maximale Stufe auf die Person zoomen und ihre Orientierung,
     dann den Nutzer browsen lassen". Beim Tipp aufs „!“ fliegt die Kamera ganz nah an die Person (im kleinen Rahmen die
     zweite Stufe, im Vollbild bis 26 Bildpunkte je Meter). Bei einer Wegbeschreibung dreht sich die Karte so, dass ihr
     erster Schritt im Bild nach oben zeigt, und sie schaut in diese Richtung: links und rechts im Bild sind dann auch
     ihr Links und Rechts. Danach kann man frei verschieben, zoomen und drehen. */
  function blickFuer(qu) {
    const f = qu.f, n = netz(), p = n.kn[qu.s], e = n.kn[qu.route.R[1]] || p, h = Math.atan2(e[1] - p[1], e[0] - p[0]);
    const alt = K.dreh; let best = alt, bw = -Infinity;
    for (let d = 0; d < 4; d += 0.5) {
      K.dreh = d; const P0 = ST.proj(f.x, f.y, 0), P1 = ST.proj(f.x + Math.cos(h), f.y + Math.sin(h), 0);
      const dx = P1[0] - P0[0], dy = P1[1] - P0[1], w = -dy / (Math.hypot(dx, dy) || 1);
      if (w > bw + 1e-6) { bw = w; best = d; }
    }
    K.dreh = alt;
    return { dreh: best, h: h };
  }
  function hinFliegen(qu, dialogOben, erst) {
    const f = qu.f; let s = K.s;
    if (erst && qu.v.richtung && ST.drehen && ST.drehen.setzen) {
      const b = blickFuer(qu); f.h = b.h; f.blickt = true;
      if (Math.abs(ST.drehMod(b.dreh - K.dreh)) > 0.01) ST.drehen.setzen(b.dreh);
    }
    if (mini()) s = erst && O().miniGanzNah ? O().miniGanzNah() : O().miniNah ? O().miniNah() : K.s;
    else s = erst ? Math.min(K.max || 60, Math.max(K.s, 26 * K.dpr)) : Math.max(K.s, 14 * K.dpr);
    /* FASSUNG 827 — liegt der Dialog außerhalb des Bilds (untenPx), steht die Person in der Mitte des freien Bilds */
    const H = K.H / K.dpr, frei = untenPx || untenWunsch ? H * 0.45 : dialogOben && !mini() ? Math.max(70, (64 + dialogOben) / 2 + 22) : H * (mini() ? 0.2 : 0.3);
    const alt = { x: K.x, y: K.y, s: K.s }; K.x = f.x; K.y = f.y; K.s = s;
    let z = ST.aufBoden(K.W / 2, K.H / 2 + (H / 2 - frei) * K.dpr);
    K.x = alt.x; K.y = alt.y; K.s = alt.s;
    if (O().klemmZiel) z = O().klemmZiel(z[0], z[1], s);
    if (L().fliegeZu) L().fliegeZu(z[0], z[1], s, 750);
  }
  /* Kamera so, dass ein Weg (rot oder grün) ganz im freien Teil des Bilds liegt (oben .. unten in CSS-Pixeln) */
  function wegZeigen(pts, oben, unten) {
    if (!pts || pts.length < 2 || !L().fliegeZu) return;
    const alt = { x: K.x, y: K.y, s: K.s };
    K.x = 0; K.y = 0; K.s = 1;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) { const P = ST.proj(p[0], p[1], 0); x0 = Math.min(x0, P[0]); x1 = Math.max(x1, P[0]); y0 = Math.min(y0, P[1] - 2.2 * ST.KZ); y1 = Math.max(y1, P[1]); }
    const mitte = ST.aufBoden((x0 + x1) / 2, (y0 + y1) / 2 + 1.1 * ST.KZ);
    const hFrei = Math.max(60, unten - oben) * K.dpr;
    let s = Math.min(K.W * 0.84 / Math.max(1e-6, x1 - x0), hFrei * 0.82 / Math.max(1e-6, y1 - y0));
    s = Math.max(K.min || 1, Math.min(alt.s, 16 * K.dpr, s));
    K.x = mitte[0]; K.y = mitte[1]; K.s = s;
    let z = ST.aufBoden(K.W / 2, K.H / 2 + (K.H / K.dpr / 2 - (oben + unten) / 2) * K.dpr);
    K.x = alt.x; K.y = alt.y; K.s = alt.s;
    if (O().klemmZiel) z = O().klemmZiel(z[0], z[1], s);
    L().fliegeZu(z[0], z[1], s, 700);
  }
  let dialog = null;
  /* FASSUNG 827 — XANDER (Funk 248): „die Suchquests können bleiben aber das Menü sollte ein kleines kompaktes schwebendes
     Menü über dem Chat sein damit man die Richtungen herausfinden kann und im Bild bleibt". Im kleinen Rahmen des Spiels lag
     der Dialog über der halben Stadt – Weg und Person waren verdeckt. Jetzt wächst der Rahmen für die Frage nach unten (das
     Spiel legt ihn über den Chat darunter, spiel.js „leicht-unten"); das Stadtbild behält seine Größe und bleibt ganz frei.
     Reicht der Platz unten nicht (Antwort „leicht-unten-lage" mit geht: 0), bleibt der Dialog wie bisher im Bild. */
  /* FASSUNG 829 — XANDER (Funk 255): „das sollte ein schwebendes Fenster sein was sich wenn nach Möglichkeit über den
     Positionsfenstern öffnet also kurz über dem Bild der Stadt das ist niemals die Stadt verdeckt das habe ich schon mal
     gesagt". Gewünscht wird jetzt zuerst ein Streifen ÜBER dem Bild (oben: 1); das Spiel legt den Rahmen dafür nach oben
     über die Plätze. Passt er oben nicht auf den Bildschirm, kommt er darunter (wie 827), sonst bleibt der Dialog im Bild.
     Oben: #lStadt rückt per transform um den Streifen nach unten (alles darin – Zeichen, Knöpfe, Dialog – wandert mit),
     die Leinwand wird um ihn kürzer, Fingerpositionen zählen ab ihrer Oberkante (start.js, ST.obenPlatz). */
  let untenPx = 0, untenWunsch = 0, untenH0 = 0, untenOben = false, obenLage = null;
  function untenAnwenden(px, oben) {
    oben = px > 0 && !!oben;
    if (px === untenPx && oben === untenOben) return;
    untenPx = px; untenOben = oben;
    const h = document.documentElement;
    h.classList.toggle("lq-unten", px > 0 && !oben);
    h.classList.toggle("lq-oben", oben);
    h.style.setProperty("--lq-unten", px + "px");
    ST.untenPlatz = px;
    ST.obenPlatz = oben ? px : 0;
    if (L().groesse) L().groesse();
    L().unruhe = 2;
  }
  /* erst wenn das Spiel den Rahmen wirklich vergrößert hat (Antwort oder Größenänderung), gehört der Streifen dem Dialog –
     antwortet niemand (älteres Spiel, Sonde ohne Spiel), bleibt der Dialog im Bild wie bisher */
  function platzUnten(px) {
    px = Math.max(0, Math.round(px || 0));
    if (px > 0 && !(mini() && imRahmen)) return;
    untenWunsch = px; untenH0 = window.innerHeight - untenPx; obenLage = null;
    if (!px) untenAnwenden(0);
    try { window.parent.postMessage({ typ: "leicht-unten", px: px, oben: 1 }, location.origin); } catch (e) {}
  }
  const untenBereit = () => { if (untenWunsch > 0 && dialog && dialog.el.classList.contains("lq-schwebe")) untenAnwenden(untenWunsch, obenLage); };
  window.addEventListener("resize", () => { if (untenWunsch > 0 && obenLage !== null && untenPx !== untenWunsch && window.innerHeight >= untenH0 + untenWunsch - 1) untenBereit(); });
  window.addEventListener("message", (ev) => {
    if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data) return;
    /* ins Vollbild: der Dialog kommt zurück ins (große) Bild */
    if (ev.data.typ === "leicht-modus" && ev.data.voll && dialog && (untenPx > 0 || untenWunsch > 0)) { dialog.el.classList.remove("lq-schwebe"); platzUnten(0); return; }
    if (ev.data.typ !== "leicht-unten-lage") return;
    if (ev.data.geht === 1 && Number(ev.data.px) === untenWunsch) { obenLage = ev.data.oben === 1; untenBereit(); }
    else if (ev.data.geht === 0 && dialog) { dialog.el.classList.remove("lq-schwebe"); platzUnten(0); }
  });
  Q.untenPx = () => untenPx;
  function dialogZu() { if (dialog) { try { if (Q.sprechen) { Q.sprechen.stopp(); Q.sprechen.still(); } } catch (e) {} dialog.el.remove(); const qu = dialog.qu; dialog = null; platzUnten(0); if (qu.f.zustand === "offen") qu.f.zustand = "gefragt"; } }
  Q.dialogZu = dialogZu;
  function zeichenTipp(qu) {
    if (qu.f.zustand === "unterwegs" || qu.f.zustand === "jubel") { hinFliegen(qu); return; }
    if (qu.f.zustand === "sucht") { sucheZeigen(qu); hinFliegen(qu); return; }
    if (qu.f.zustand !== "wartet" && qu.f.zustand !== "gefragt") return;
    try { if (O().wahlZu) O().wahlZu(); if (O().dingZu) O().dingZu(); } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
    Q.blattErlaubt = true;   // ab dem ersten Tipp darf auch der kleine Rahmen das Blatt der Person laden
    const erst = qu.f.zustand === "wartet";
    dialogOeffnen(qu);
    hinFliegen(qu, dialog ? dialog.el.getBoundingClientRect().top : 0, erst);
  }
  function dialogOeffnen(qu) {
    dialogZu();
    qu.f.zustand = "offen";
    const d = document.createElement("div"); d.className = "lq-dialog"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", qu.v.titel);
    const kopf = document.createElement("div"); kopf.className = "lq-kopf";
    const titel = document.createElement("span"); titel.className = "lq-titel"; titel.textContent = qu.v.titel;
    kopf.appendChild(titel);
    /* FASSUNG 875 — XANDER (Funk 257): „vielleicht von A1 bis C2 dass man das in den Einstellungen hat“. Die Quests haben
       kein eigenes Menü – der Wähler sitzt deshalb klein im Kopf jedes Quest-Fensters. */
    const niv = document.createElement("button"); niv.type = "button"; niv.className = "lq-klein lq-niv"; niv.textContent = niveau();
    const nivTitel = () => "Dein Niveau für die Missionen: " + niveau() + (qu.v.niveau ? " (diese Mission: " + qu.v.niveau + ")" : "") + " – tippen zum Ändern";
    niv.title = nivTitel(); niv.setAttribute("aria-label", nivTitel());
    kopf.appendChild(niv);
    if (mini() && imRahmen) {
      const voll = document.createElement("button"); voll.type = "button"; voll.className = "lq-klein lq-voll"; voll.textContent = "Groß"; voll.title = "Im Vollbild weiter"; voll.setAttribute("aria-label", "Im Vollbild weiter");
      voll.addEventListener("click", (e) => { e.stopPropagation(); try { window.parent.postMessage({ typ: "leicht-voll" }, location.origin); } catch (x) {} });
      kopf.appendChild(voll);
    }
    const zu = document.createElement("button"); zu.type = "button"; zu.className = "lq-klein lq-zu"; zu.innerHTML = "&#x2715;"; zu.title = "Später"; zu.setAttribute("aria-label", "Später helfen (schließen)");
    /* FASSUNG 813 — Geisterklick: das „!“ öffnet beim Loslassen (pointerup); der Klick, den das
       Handy danach nachschiebt, prüft neu, was unter dem Finger liegt – und traf manchmal eine Antwort
       des gerade aufgegangenen Dialogs (Fehlversuch, Erstversuch-Bonus weg; Sonde 832: [8,8,6]).
       Kurz nach dem Aufgehen zählen Klicks nur, wenn der Finger im Dialog auch aufgesetzt hat. */
    const aufZeit = performance.now(); let gedrueckt = false;
    const geisterKlick = () => !gedrueckt && performance.now() - aufZeit < 500;
    zu.addEventListener("click", (e) => { e.stopPropagation(); if (geisterKlick()) return; dialogZu(); });
    kopf.appendChild(zu);
    /* FASSUNG 875 — Tipp auf das Niveau: eine Zeile A1 … C2 unter dem Kopf; die Wahl gilt ab der nächsten Mission */
    niv.addEventListener("click", (e) => {
      e.stopPropagation(); if (geisterKlick()) return;
      const alt = d.querySelector(".lq-niveaus"); if (alt) { alt.remove(); return; }
      const reihe = document.createElement("div"); reihe.className = "lq-niveaus"; reihe.setAttribute("role", "group"); reihe.setAttribute("aria-label", "Niveau für die Missionen");
      const t = document.createElement("span"); t.className = "lq-niv-text"; t.textContent = "Dein Deutsch-Niveau für die Missionen:";
      reihe.appendChild(t);
      for (const n of NIVEAUS) {
        const b = document.createElement("button"); b.type = "button"; b.textContent = n; b.dataset.niv = n; if (n === niveau()) b.classList.add("lq-an");
        b.addEventListener("click", (ev) => {
          ev.stopPropagation(); niveauSetzen(n); niv.textContent = n; niv.title = nivTitel(); niv.setAttribute("aria-label", nivTitel());
          for (const x of reihe.querySelectorAll("button")) x.classList.toggle("lq-an", x.dataset.niv === n);
          t.textContent = "Gespeichert: ab der nächsten Mission bis " + n + " – vor allem auf " + n + ".";
          setTimeout(() => reihe.remove(), 2200);
        });
        reihe.appendChild(b);
      }
      kopf.after(reihe);
    });
    const text = document.createElement("p"); text.className = "lq-text"; text.textContent = qu.text;
    const frage = document.createElement("p"); frage.className = "lq-frage"; frage.textContent = qu.frage;
    const liste = document.createElement("div"); liste.className = "lq-antworten";
    const hinweis = document.createElement("p"); hinweis.className = "lq-hinweis"; hinweis.setAttribute("aria-live", "polite");
    /* FASSUNG 846 — Suchen: statt Antworten ein Knopf; danach bleibt oben nur eine schmale Zeile, das Bild ist frei */
    if (qu.v.zeigen) {
      const los = document.createElement("button"); los.type = "button"; los.className = "lq-los"; los.textContent = "Los, ich suche!";
      los.addEventListener("click", (e) => { e.stopPropagation(); if (geisterKlick()) return; sucheStarten(qu); });
      liste.appendChild(los);
    }
    qu.antworten.forEach((a, i) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "lq-antwort"; b.innerHTML = a.html; b.dataset.i = i;
      if (a.falschGetippt) { b.disabled = true; b.classList.add("lq-falsch"); }
      b.addEventListener("click", (e) => { e.stopPropagation(); if (geisterKlick()) return; antworten(qu, i, b, hinweis, liste); });
      liste.appendChild(b);
    });
    /* FASSUNG 828 — Funk 249: antworten durch Sprechen (siehe 11. SPRECHEN) */
    let mik = null;
    if (!qu.v.zeigen && SPR.moeglich()) {
      mik = document.createElement("div"); mik.className = "lq-mik";
      const mk = document.createElement("button"); mk.type = "button"; mk.textContent = "🎤 Antwort sprechen"; mk.setAttribute("aria-label", "Antwort sprechen");
      const ms = document.createElement("span"); ms.className = "lq-mik-status"; ms.setAttribute("aria-live", "polite");
      mk.addEventListener("click", (e) => { e.stopPropagation(); if (geisterKlick()) return; sprechenLos(qu, mk, ms, hinweis, liste); });
      mik.append(mk, ms);
    }
    d.append(kopf, text, frage);
    if (mik) d.append(mik);
    d.append(liste, hinweis);
    ["pointerdown", "pointerup", "wheel"].forEach((t) => d.addEventListener(t, (e) => e.stopPropagation(), { passive: true }));
    d.addEventListener("pointerdown", () => { gedrueckt = true; }, { passive: true });
    wurzelEl.appendChild(d);
    dialog = { el: d, qu: qu };
    /* FASSUNG 827 — im kleinen Rahmen: der Dialog unter dem Bild, höchstens 190 px hoch, rollbar */
    if (mini() && imRahmen) { d.classList.add("lq-schwebe"); platzUnten(Math.min(190, d.scrollHeight + 2)); }
    /* FASSUNG 828 — wer schon einmal gesprochen hat: die Person fragt laut, danach geht das Mikro von selbst an */
    if (mik && SPR.auto()) {
      SPR.vorlesen(qu.text, qu.v.person && qu.v.person.er).then(() => {
        const mk = mik.querySelector("button");
        if (dialog && dialog.qu === qu && qu.f.zustand === "offen" && !SPR.laeuft() && mk && !mk.disabled) sprechenLos(qu, mk, mik.querySelector(".lq-mik-status"), dialog.el.querySelector(".lq-hinweis"), dialog.el.querySelector(".lq-antworten"));
      });
    }
  }
  /* FASSUNG 836 — BETREIBER-DIAGNOSE (nur für den Betreiber oder mit ?sprdiag=1): die letzte Aufnahme anhören, so wie
     sie an Azure ging (16 kHz), und sehen, was Azure geliefert hat. Dann ist klar, ob das Audio selbst schlecht ist
     oder Azure falsch rät. Gespeichert wird nichts, alles bleibt im Browser. */
  let sprDiagUrl = "";
  function sprDiagnose(wo) {
    try {
      const darf = (ST.spiel && ST.spiel.betreiber) || /[?&]sprdiag=1/.test(location.search);
      const L0 = SPR.letzte; if (!darf || !wo || !L0 || !L0.wav) return;
      let el = wo.querySelector(".lq-sprdiag"); if (!el) { el = document.createElement("div"); el.className = "lq-sprdiag"; el.style.cssText = "font-size:11px;opacity:.75;margin-top:3px;line-height:1.3"; wo.appendChild(el); }
      if (sprDiagUrl) URL.revokeObjectURL(sprDiagUrl);
      const b = atob(L0.wav), u8 = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u8[i] = b.charCodeAt(i);
      sprDiagUrl = URL.createObjectURL(new Blob([u8], { type: "audio/wav" }));
      const az = L0.azure || {}, nb = (az.nbest || []).map((x) => x.d + (x.l && x.l !== x.d ? " / " + x.l : "") + (x.c != null ? " (" + Math.round(x.c * 100) + " %)" : "")).join(" · ");
      el.innerHTML = "";
      const a = document.createElement("a"); a.href = sprDiagUrl; a.target = "_blank"; a.rel = "noopener"; a.textContent = "▶ Aufnahme"; a.addEventListener("click", (ev) => ev.stopPropagation());
      el.append(a, document.createTextNode(" · Gerät " + L0.rate + " Hz → 16 kHz · Azure: " + (nb || az.text || "–")));
    } catch (e) {}
  }
  const SPR_FEHLER = { "nichts-gehoert": "Ich habe nichts gehört. Tippe auf 🎤 und sprich.", "nicht-angemeldet": "Zum Sprechen bitte anmelden.", "tagesgrenze": "Für heute ist das Sprechen aufgebraucht – morgen geht es wieder.", "kontingent": "Die Spracherkennung ist gerade ausgelastet.", "kein-zentraler-schluessel": "Die Spracherkennung ist noch nicht eingerichtet." };
  function sprechenLos(qu, mk, ms, hinweis, liste) {
    if (SPR.laeuft()) { SPR.stopp(); return; }
    if (qu.f.zustand !== "offen") return;
    SPR.still(); SPR.autoSetzen(true);
    const zurueck = () => { mk.classList.remove("lq-hoert"); mk.textContent = "🎤 Noch einmal sprechen"; mk.disabled = false; };
    mk.classList.add("lq-hoert"); mk.textContent = "● Mikro geht an …"; ms.textContent = "";
    SPR.aufnehmen((p) => mk.style.setProperty("--pegel", p.toFixed(2)), () => { if (mk.classList.contains("lq-hoert")) mk.textContent = "● Ich höre zu … (tippen = fertig)"; })
      .then((wav) => { mk.classList.remove("lq-hoert"); mk.textContent = "… ich verstehe"; mk.disabled = true; return SPR.erkennen(wav, wortliste(qu)); })
      .then((les) => {
        if (!dialog || dialog.qu !== qu || qu.f.zustand !== "offen") return;
        const e = SPR.pruefen(qu, les);
        const zeig = e.text && les && les.anzeige && les.anzeige[e.text] || e.text;
        ms.textContent = zeig ? "Du: „" + zeig + "“" : "";
        sprDiagnose(mk.parentNode);
        hinweis.classList.toggle("lq-gut", e.stufe > 0);
        if (e.stufe > 0) {
          qu.gesprochen = e.stufe;
          if (e.i >= 0 && liste.children[e.i]) liste.children[e.i].classList.add("lq-richtig");
          for (const x of liste.children) x.disabled = true;
          mk.textContent = e.stufe === 1 ? "✓ Richtig gesagt" : "✓ Fast";
          /* FASSUNG 830 — bei freien Antworten antwortet die Person auf das, was man gesagt hat */
          hinweis.textContent = (e.stufe === 1 ? "Richtig! " : "Fast! ") + e.grund + " " + (e.antwort || qu.danke);
          qu.rot = null;
          losgehen(qu);
          setTimeout(() => { if (dialog && dialog.qu === qu) { dialog.el.remove(); dialog = null; platzUnten(0); } wegZeigen(qu.weg.pts, mini() ? 34 : 64, K.H / K.dpr - (mini() ? 8 : 70)); }, 2600);
          return;
        }
        zurueck();
        hinweis.textContent = e.grund;
        if (e.stufe === 0) {
          /* FASSUNG 830 — was nicht zur Aufgabe passt oder falsch verstanden wurde, kostet keinen Versuch (Funk 257: „dazu muss
             die Erkennung auch korrekt sein“); nur ein klar falscher Satz zählt */
          if (!e.ohneVersuch) qu.versuche++;
          if (e.i >= 0 && liste.children[e.i]) { const b = liste.children[e.i]; b.disabled = true; b.classList.add("lq-falsch"); if (qu.antworten[e.i]) qu.antworten[e.i].falschGetippt = true; }
          if (e.weg) { qu.rot = { pts: e.weg, ab: performance.now(), bis: performance.now() + (Q.rotDauer || 5200) }; L().unruhe = 2; }
        }
      })
      .catch((err) => { zurueck(); const m = String(err && (err.name === "NotAllowedError" ? "mikro" : err.message) || ""); ms.textContent = m === "mikro" ? "Das Mikrofon ist gesperrt – bitte im Browser erlauben." : SPR_FEHLER[m] || "Die Spracherkennung antwortet gerade nicht."; });
  }
  /* FASSUNG 846 — SUCHEN: die Person wartet, man sucht das Gebäude selbst (verschieben, zoomen, drehen) und tippt es an.
     oberflaeche.js fragt bei jedem Tipp auf ein Haus zuerst Q.tippAuf(o). */
  let suche = null;
  function sucheZu() { if (suche) { suche.el.remove(); suche = null; } }
  function sucheZeigen(qu, hinweisText) {
    sucheZu();
    const el = document.createElement("div"); el.className = "lq-suche"; el.setAttribute("role", "status");
    const t = document.createElement("span"); t.innerHTML = "Such <b>" + esc(akk(qu.ziel)) + "</b> und tippe darauf.";
    const h = document.createElement("span"); h.className = "lq-hinweis"; h.setAttribute("aria-live", "polite"); if (hinweisText) h.textContent = hinweisText;
    const zu = document.createElement("button"); zu.type = "button"; zu.className = "lq-klein"; zu.innerHTML = "&#x2715;"; zu.title = "Später"; zu.setAttribute("aria-label", "Suche abbrechen");
    zu.addEventListener("click", (e) => { e.stopPropagation(); sucheZu(); if (qu.f.zustand === "sucht") qu.f.zustand = "gefragt"; });
    const box = document.createElement("span"); box.style.display = "flex"; box.style.flexDirection = "column"; box.append(t, h);
    el.append(box, zu);
    ["pointerdown", "pointerup", "wheel"].forEach((ty) => el.addEventListener(ty, (e) => e.stopPropagation(), { passive: true }));
    wurzelEl.appendChild(el);
    suche = { el: el, qu: qu, hinweis: h };
  }
  function sucheStarten(qu) {
    if (dialog && dialog.qu === qu) { dialog.el.remove(); dialog = null; platzUnten(0); }
    qu.f.zustand = "sucht"; L().unruhe = 2;
    sucheZeigen(qu);
  }
  const keyVon = (o) => (o.art === "haus" && o.spiel && !o.bau) || (o.art === "wunder" && o.spiel) ? o.spiel
    : o.art === "kulisse" && o.name === "Bahnhof" ? "bahnhof" : o.art === "kulisse" && o.name === "Bootsverleih" ? "bootsverleih" : null;
  Q.tippAuf = function (o) {
    const qu = Q.liste.find((x) => x.f.zustand === "sucht");
    if (!qu || !o) return false;
    const k = keyVon(o);
    if (!k) return false;
    if (k === qu.ziel.key) {
      sucheZu();
      try { if (navigator.vibrate) navigator.vibrate(14); } catch (e) {}
      try { if (O().ansage) O().ansage("Richtig! " + qu.danke); } catch (e) {}
      losgehen(qu);
      wegZeigen(qu.weg.pts, mini() ? 34 : 64, K.H / K.dpr - (mini() ? 8 : 70));
      return true;
    }
    qu.versuche++;
    const w = NAMEN[k] ? { g: NAMEN[k][0], name: NAMEN[k][1] } : null;
    const text = (w ? "Das ist " + nom(w) + "." : "Das ist es nicht.") + " Gesucht ist " + nom(qu.ziel) + ".";
    if (suche && suche.qu === qu) suche.hinweis.textContent = text; else sucheZeigen(qu, text);
    try { if (ST.ton && ST.ton.klick) ST.ton.klick(); } catch (e) {}
    return true;
  };
  function antworten(qu, i, b, hinweis, liste) {
    const a = qu.antworten[i];
    if (!a || qu.f.zustand !== "offen") return;
    if (!a.richtig) {
      qu.versuche++; a.falschGetippt = true; b.disabled = true; b.classList.add("lq-falsch");
      hinweis.classList.remove("lq-gut"); hinweis.textContent = a.hinweis || "Hm, das stimmt noch nicht. Versuch es noch einmal!";
      const dl = hinweis.parentElement; if (dl) dl.scrollTop = dl.scrollHeight;   // (nicht scrollIntoView: das rollte im Rahmen auch die Seite des Spiels)
      if (a.weg) {
        qu.rot = { pts: a.weg, ab: performance.now(), bis: performance.now() + (Q.rotDauer || 5200) }; L().unruhe = 2;
        if (!mini() && dialog) wegZeigen(a.weg, 60, dialog.el.getBoundingClientRect().top - 8);
      }
      try { if (ST.ton && ST.ton.klick) ST.ton.klick(); } catch (e) {}
      return;
    }
    b.classList.add("lq-richtig"); for (const x of liste.children) x.disabled = true;
    hinweis.classList.add("lq-gut"); hinweis.textContent = "Richtig! " + qu.danke;
    const dl = hinweis.parentElement; if (dl) dl.scrollTop = dl.scrollHeight;   // (nicht scrollIntoView: das rollte im Rahmen auch die Seite des Spiels)
    qu.rot = null;
    losgehen(qu);
    setTimeout(() => { if (dialog && dialog.qu === qu) { dialog.el.remove(); dialog = null; platzUnten(0); } wegZeigen(qu.weg.pts, mini() ? 34 : 64, K.H / K.dpr - (mini() ? 8 : 70)); }, 1900);
  }
  function losgehen(qu) {
    const f = qu.f; qu.antwortZeit = performance.now();
    f.zustand = "unterwegs"; f.laeuft = true; f.s = 0; f.weint = false;
    if (qu.v.schirm) f.schirm = true;
    L().unruhe = 2;
    if (qu.wagen) qu.wagen.geht = true;
  }

  /* =====================================================================
     8. EINE QUEST ERZEUGEN
     ===================================================================== */
  const schwach = () => { const s = new Set(info.schwach || []); return s; };
  /* FASSUNG 875 — XANDER (Funk 257): „die Missionen müssen Variation haben und dürfen nicht zu repetitiv sein“.
     Gewählt wird bis zum eigenen Niveau (Anteil je Stufe, STUFE_ANTEIL), nur was in dieser Stadt gehen kann (verfuegbar),
     nie die zuletzt gestellte, die letzten zwölf nur ein Fünftel so oft, dieselbe Art (kat) wie eben nur halb so oft und
     zwei Wegbeschreibungen nacheinander ebenfalls nur halb so oft. Schwächen bleiben dreifach (Mut-Bonus, 832). */
  function vorlageWaehlen(nurId) {
    if (nurId) return VORLAGEN.find((v) => v.id === nurId) || null;
    const st = standLesen(), sw = schwach(), aktiv = new Set(Q.liste.map((x) => x.v.id)), S = stadtStand(), eigen = nivIdx(niveau());
    const vorher = st.letzte[st.letzte.length - 1], vv = VORLAGEN.find((v) => v.id === vorher) || null;
    const geht = VORLAGEN.map((v) => nivIdx(v.niveau) <= eigen && !aktiv.has(v.id) && v.id !== vorher && verfuegbar(v, S));
    const anzahl = [0, 0, 0, 0, 0, 0]; VORLAGEN.forEach((v, i) => { if (geht[i]) anzahl[nivIdx(v.niveau)]++; });
    let gew = VORLAGEN.map((v, i) => !geht[i] ? 0 : STUFE_ANTEIL[Math.min(3, eigen - nivIdx(v.niveau))] / anzahl[nivIdx(v.niveau)] * (st.letzte.indexOf(v.id) >= 0 ? 0.2 : 1) *
      (sw.has(v.kat) ? 3 : 1) * (v.richtung ? 1.3 : 1) * (vv && vv.kat === v.kat ? 0.5 : 1) * (vv && vv.richtung && v.richtung ? 0.5 : 1));
    /* (geht in dieser Stadt gar nichts auf dem Niveau: dann irgendeine, die hier geht – nur nicht dieselbe wie eben) */
    if (!gew.some((x) => x > 0)) gew = VORLAGEN.map((v) => (!aktiv.has(v.id) && v.id !== vorher && verfuegbar(v, S) ? 1 : 0));
    let s = gew.reduce((a, b) => a + b, 0) * zufall();
    for (let i = 0; i < VORLAGEN.length; i++) { s -= gew[i]; if (s <= 0 && gew[i] > 0) return VORLAGEN[i]; }
    return VORLAGEN.find((v, i) => gew[i] > 0) || VORLAGEN[0];
  }
  /* Kern der Stadt (im Überblick sichtbar): 80 m um den Markt, im Bauraum, nicht im Wasser */
  function guterStart(n, i, belegt, rMax) {
    const p = n.kn[i];
    if (n.nb[i].length !== 2 || n.cl[i] >= 0) return false;
    if (Math.hypot(p[0], p[1]) > (rMax || 80)) return false;
    if (naheBruecke(p[0], p[1], 9)) return false;
    /* nicht im Wasser (Ufer), nicht auf dem Gleis der Pferdebahn */
    if (ST.boden && ST.boden.wert && ST.boden.wert(p[0], p[1], 1) > 0.15) return false;
    if (D.PFERDEBAHN && D.PFERDEBAHN.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 3)) return false;
    for (const c of n.cls) if (Math.hypot(c.x - p[0], c.y - p[1]) < 8) return false;
    for (const b of belegt) if (Math.hypot(b[0] - p[0], b[1] - p[1]) < 14) return false;
    if (SZ.objekte.some((o) => (o.art === "haus" || o.art === "wunder") && !o.versteckt && Math.abs(o.x - p[0]) < (o.fuss || [4, 4])[0] / 2 + 1.2 && Math.abs(o.y - p[1]) < (o.fuss || [4, 4])[1] / 2 + 1.2)) return false;
    return true;
  }
  /* Route mit eindeutigen Abzweigen und passenden falschen Beschreibungen */
  function richtungsRoute(an, n, belegt) {
    /* erst 28–95 m Weg; liegt das Ziel weit draußen (Bahnhof hinter der Pferdebahn), auch bis 150 m */
    for (const [d0, d1, rMax, sMax] of [[28, 95, 80, 3], [24, 150, 95, 4]]) {
      const kand = [];
      for (let i = 0; i < n.kn.length; i++) { const d = an.dist[i]; if (d >= d0 && d <= d1 && guterStart(n, i, belegt, rMax)) kand.push(i); }
      const rr = richtungsAus(an, n, kand, sMax);
      if (rr) return rr;
    }
    return null;
  }
  function richtungsAus(an, n, kand, sMax) {
    const G = Q._gruende;   // (nur für die Sonde: warum Startpunkte nicht passen)
    if (G) G.kandidaten = (G.kandidaten || 0) + kand.length;
    const gut = [];
    for (const s of mischen(kand).slice(0, 260)) {
      if (gut.length >= 8 || (gut.length && gut[0].r.schritte.length <= 2 && gut.length >= 3)) break;
      const r = route(an, s); if (!r || r.schritte.length < 1 || r.schritte.length > sMax) { if (G) G["schritte" + (r ? r.schritte.length : "?")] = (G["schritte" + (r ? r.schritte.length : "?")] || 0) + 1; continue; }
      if (!r.schritte.every((x) => x.eindeutig) || !r.schritte.some((x) => x.k !== "geradeaus")) { if (G) G.uneindeutig = (G.uneindeutig || 0) + 1; continue; }
      const klassen = r.schritte.map((x) => x.k), weiter = r.R[1];
      const probe = folgen(an, s, weiter, klassen); if (!probe.ok) { if (G) G["folgen_" + probe.grund] = (G["folgen_" + probe.grund] || 0) + 1; continue; }
      /* falsche Beschreibungen: einen Abzweig ändern, einen weglassen oder einen dazu – sie dürfen nicht ans Ziel führen */
      const varianten = [];
      klassen.forEach((k, i) => { for (const w of ["links", "rechts", "geradeaus"].concat(/halb/.test(k) ? [k.replace("halb ", "")] : [])) if (w !== k) { const v = klassen.slice(); v[i] = w; varianten.push(v); } });
      if (klassen.length > 1) varianten.push(klassen.slice(0, -1));
      varianten.push(klassen.concat([klassen[klassen.length - 1] === "links" ? "rechts" : "links"]));
      const falsch = [], texte = new Set([wegText(r.schritte, r.ende, an.z, r.brueckeZuletzt)]);
      for (const v of mischen(varianten)) {
        const sim = folgen(an, s, weiter, v); if (sim.ok) continue;
        const sch = v.map((k, i) => ({ k: k, bruecke: (r.schritte[i] || {}).bruecke || false }));
        const t = wegText(sch, r.ende, an.z, v.length === klassen.length && r.brueckeZuletzt); if (texte.has(t)) continue;
        texte.add(t); falsch.push({ klassen: v, text: t, sim: sim });
        if (falsch.length === 2) break;
      }
      if (falsch.length < 2) { if (G) G.falsch = (G.falsch || 0) + 1; continue; }
      gut.push({ s: s, r: r, falsch: falsch });
      gut.sort((a, b) => a.r.schritte.length - b.r.schritte.length);
    }
    /* möglichst wenige Abzweige (kurze Sätze): unter den kürzesten zufällig */
    const kurz = gut.filter((x) => x.r.schritte.length === (gut[0] && gut[0].r.schritte.length));
    return kurz.length ? wahl(kurz) : null;
  }
  function wohinGekommen(pts) {
    const e = pts[pts.length - 1], Z = ziele(); let best = null;
    for (const k in Z) { const z = Z[k], d = Math.hypot(z.tuer[0] - e[0], z.tuer[1] - e[1]); if (d < 16 && (!best || d < best[1])) best = [z, d]; }
    return best ? best[0] : null;
  }
  function questBauen(v, opt) {
    opt = opt || {};
    const Z = ziele(), n = netz();
    const moegl = (opt.ziel ? [opt.ziel] : v.ziel).filter((k) => Z[k]);
    if (!moegl.length) return null;
    /* FASSUNG 875 — Missionen nach Stand: ohne das Gebäude (braucht) oder die Lage (stand) gibt es sie nicht, auch nicht
       auf Wunsch (Sonde) */
    const S = stadtStand(true);
    if (!standPasst(v, S)) return null;
    const belegt = Q.liste.map((x) => [x.f.x, x.f.y]);
    for (const zk of mischen(moegl)) {
      const z = Z[zk], an = anschluss(z); if (!an) continue;
      let s, r, falsch = null;
      if (v.richtung) {
        const rr = richtungsRoute(an, n, belegt); if (!rr) continue;
        s = rr.s; r = rr.r; falsch = rr.falsch;
      } else {
        let kand = [];
        for (const [d0, d1, rMax] of [[22, 70, 80], [18, 130, 95]]) { for (let i = 0; i < n.kn.length; i++) { const d = an.dist[i]; if (d >= d0 && d <= d1 && guterStart(n, i, belegt, rMax)) kand.push(i); } if (kand.length) break; }
        if (!kand.length) continue;
        s = wahl(kand); r = route(an, s); if (!r) continue;
      }
      const vars = { stadt: wahl(STAEDTE), wort: wahl(WOERTER), termin: wahl([[14, 30], [9, 15], [16, 45], [11, 30], [8, 45], [10, 0], [15, 30], [13, 15], [17, 50], [12, 25]]) };
      if (v.vars) { const x = v.vars(S, z); if (!x) continue; Object.assign(vars, x); }   // FASSUNG 875 — die Mission liest die Stadt
      let antworten;
      if (v.richtung) {
        antworten = [{ html: esc(wegText(r.schritte, r.ende, z, r.brueckeZuletzt)), richtig: true }].concat(falsch.map((fa) => {
          const pts = fa.sim.R.map((i) => n.kn[i].slice()), wo = wohinGekommen(pts);
          const sie = v.person.er ? "er" : "sie", ihr = v.person.er ? "seiner" : "ihrer";
          return { html: esc(fa.text), weg: pts, hinweis: (wo && wo.key !== z.key ? "Hm – so käme " + sie + " " + zum(wo) + ", nicht " + zum(z) + "." : "Hm – so würde " + sie + " sich wieder verlaufen.") + " Schau genau auf die Karte: Links und rechts gelten in " + ihr + " Laufrichtung." };
        }));
      } else antworten = v.zeigen ? [] : v.antworten(z, vars).map((a) => Object.assign({}, a));
      const p = n.kn[s], erster = n.kn[r.R[1]] || p, hWeg = Math.atan2(erster[1] - p[1], erster[0] - p[0]);
      const f = { art: v.person.art, klein: !!v.person.klein, weint: !!v.person.weint, x: p[0], y: p[1], h: hWeg, zustand: "kommt", alpha: 0, laeuft: true, ph: 0, s: 0 };
      /* Auftritt: aus 8 m Entfernung auf dem Weg herein (weich eingeblendet) */
      const her = [p.slice()]; { let a = s, b = n.nb[s].find((x) => x !== r.R[1]) != null ? n.nb[s].find((x) => x !== r.R[1]) : r.R[1], lang = 0; for (let g = 0; g < 60 && lang < 8; g++) { her.push(n.kn[b].slice()); lang += Math.hypot(n.kn[b][0] - n.kn[a][0], n.kn[b][1] - n.kn[a][1]); const w = n.nb[b].filter((x) => x !== a); if (!w.length) break; a = b; b = w[0]; } }
      her.reverse();
      const qu = { id: (Q._nr = (Q._nr || 0) + 1), v: v, vars: vars, ziel: z, an: an, s: s, route: r, weg: weg(r.pts), auftritt: weg(her), f: f, versuche: 0,
        text: v.text(z, vars), frage: typeof v.frage === "function" ? v.frage(z, vars) : v.frage || "Welche Wegbeschreibung stimmt? Die Karte hilft dir.", antworten: mischen(antworten),
        danke: typeof v.danke === "function" ? v.danke(z, vars) : v.danke, mut: schwach().has(v.kat), zeit: performance.now() };
      /* der Hund sitzt am Eingang, etwas zur Seite (das Kind kommt daneben an) */
      if (v.hund) { const t = z.tuer, dx = t[0] - an.A[0], dy = t[1] - an.A[1], l = Math.hypot(dx, dy) || 1; qu.hund = { x: t[0] - dy / l * 1.1, y: t[1] + dx / l * 1.1, seite: 1 }; }
      if (v.eis) {
        /* der Eiswagen rollt auf dem Weg heran und hält neben dem Kind */
        const wpts = her.slice().map((x) => x.slice()); const letzte = wpts[wpts.length - 1]; const stop = [letzte[0] + 1.6, letzte[1] - 1.6];
        const vorn = []; { let a = s, b = n.nb[s].find((x) => x !== r.R[1]), lang = 0; if (b == null) b = r.R[1]; for (let g = 0; g < 80 && lang < 26; g++) { vorn.push(n.kn[b].slice()); lang += Math.hypot(n.kn[b][0] - n.kn[a][0], n.kn[b][1] - n.kn[a][1]); const w = n.nb[b].filter((x) => x !== a); if (!w.length) break; a = b; b = w[0]; } }
        vorn.reverse(); vorn.push(stop);
        qu.wagen = { weg: weg(vorn), s: 0, x: vorn[0][0], y: vorn[0][1], alpha: 0, rollt: true };
        f.zustand = "wartetAufWagen"; f.alpha = 0; f.laeuft = false; f.h = zurKamera(p[0], p[1]);
      }
      return qu;
    }
    return null;
  }
  function questNeu(nurId, opt) {
    if (Q.liste.filter((x) => x.f.zustand !== "weg").length >= 2 && !(opt && opt.zwingen)) return null;
    for (let i = 0; i < 8; i++) {
      const v = vorlageWaehlen(nurId); if (!v) return null;
      const qu = questBauen(v, opt); if (!qu) { if (nurId) return null; continue; }
      Q.liste.push(qu);
      const st = standLesen(); st.letzte = st.letzte.concat([v.id]).slice(-12); standSchreiben(st);   // FASSUNG 875 — zwölf statt sechs
      L().unruhe = 2;
      return qu;
    }
    return null;
  }

  /* =====================================================================
     9. BEWEGUNG, ANKUNFT, BELOHNUNG
     ===================================================================== */
  /* FASSUNG 846 — XANDER (Walkie 315): „das Laufen dauert zu lange" – gut doppelt so schnell wie vorher (1,45 m/s) */
  const TEMPO = 3.2;
  function bewegen(dt) {
    for (const qu of Q.liste.slice()) {
      const f = qu.f;
      if (qu.wagen) {
        const w = qu.wagen;
        if (!w.geht && w.s < w.weg.len) { w.s = Math.min(w.weg.len, w.s + 2.2 * dt); const p = aufWeg(w.weg, w.s); w.x = p.x; w.y = p.y; w.alpha = Math.min(1, w.alpha + dt / 1.2); w.rollt = w.s < w.weg.len; if (!w.rollt && f.zustand === "wartetAufWagen") f.zustand = "wartet"; }
        else if (w.geht) { w.rollt = true; w.s = Math.max(0, w.s - 2.2 * dt); const p = aufWeg(w.weg, w.s); w.x = p.x; w.y = p.y; w.alpha = Math.max(0, w.alpha - dt / 4); if (w.alpha <= 0) qu.wagen = null; }
      }
      if (f.zustand === "wartetAufWagen") f.alpha = Math.min(1, f.alpha + dt / 1.2);
      if (f.zustand === "kommt") {
        f.s += TEMPO * dt; f.alpha = Math.min(1, f.alpha + dt / 1.2);
        const p = aufWeg(qu.auftritt, f.s); f.x = p.x; f.y = p.y; f.h = p.h; f.ph = (f.ph + TEMPO * dt / 2.2) % 1;
        if (f.s >= qu.auftritt.len) { f.zustand = "wartet"; f.laeuft = false; f.alpha = 1; f.s = 0; f.h = zurKamera(f.x, f.y); }
      } else if (f.zustand === "unterwegs") {
        const v = f.klein ? 3.6 : TEMPO;
        f.s += v * dt; f.ph = (f.ph + v * dt / 2.2) % 1;
        const p = aufWeg(qu.weg, f.s); f.x = p.x; f.y = p.y; f.h = p.h;
        if (f.s >= qu.weg.len) ankunft(qu);
      } else if (f.zustand === "jubel") {
        const t = (performance.now() - qu.jubelAb) / 1000;
        f.hopp = Math.abs(Math.sin(t * Math.PI * 2.2)) * 0.45 * Math.max(0, 1 - t / 2.4);
        if (qu.hund) qu.hund.hopp = Math.abs(Math.sin(t * Math.PI * 2.6 + 1)) * 0.35 * Math.max(0, 1 - t / 2.4);
        if (t > 2.6) { f.zustand = "geht"; f.hopp = 0; }
      } else if (f.zustand === "geht") {
        f.alpha -= dt / 1.4; if (qu.hund) qu.hund.alpha = f.alpha;
        if (f.alpha <= 0) {
          f.zustand = "weg"; if (qu.el) qu.el.remove(); Q.liste.splice(Q.liste.indexOf(qu), 1);
          /* FASSUNG 846 — XANDER (Walkie 315): mit Stecknadel fällt das Bild danach in die festgesteckte Ansicht zurück (Nähe
             und Winkel), ohne Nadel in die ganze Stadt – aber nur, wenn man seit der Antwort nichts selbst angefasst hat */
          if (mini() && !dialog && !suche && !(L().letzterFinger > (qu.antwortZeit || 0)) && O().zurStartAnsicht) O().zurStartAnsicht(true);
        }
      }
    }
  }
  function ankunft(qu) {
    const f = qu.f; f.zustand = "jubel"; f.laeuft = false; f.schirm = false; qu.jubelAb = performance.now();
    f.h = zurKamera(f.x, f.y);
    if (qu.hund) qu.hund.froh = true;
    funken(f.x, f.y, 1.8, 34);
    try { if (ST.ton && ST.ton.einsammeln) ST.ton.einsammeln("stern"); } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate([12, 60, 12]); } catch (e) {}
    /* Punkte: 6, Wegbeschreibung 8, beim ersten Versuch +2, Schwäche +50 % (Mut-Bonus) */
    let pk = qu.v.richtung || qu.v.zeigen ? 8 : 6; if (!qu.versuche) pk += 2;
    /* FASSUNG 828 — gesprochen: ein ganzer Satz +4 (Sprech-Bonus), nur ungefähr die halbe Punktzahl */
    if (qu.gesprochen === 1) pk += 4; else if (qu.gesprochen === 0.5) pk = Math.ceil(pk / 2);
    const mut = qu.mut ? Math.ceil(pk * 0.5) : 0; pk += mut;
    const st = standLesen(); st.punkte += pk; st.geschafft++;
    let geschenk = null;
    if (st.geschafft % 3 === 0) geschenk = geschenkGeben(qu, st);
    standSchreiben(st);
    plusZeigen(f.x, f.y, 2.6, "+" + pk + (mut ? " (Mut-Bonus)" : qu.gesprochen === 1 ? " (gesprochen)" : ""));
    const text = "Geschafft: +" + pk + " Helferpunkte" + (qu.gesprochen === 1 ? " – mit Sprech-Bonus" : qu.gesprochen === 0.5 ? " – gesprochen, halbe Punktzahl" : "") + (mut ? " – mit Mut-Bonus für " + (KAT_NAME[qu.v.kat] || qu.v.kat) : "") + (geschenk ? ". Geschenk für deine Stadt: " + geschenk + "!" : ".");
    try { if (O().ansage) O().ansage(text); } catch (e) {}
    Q.letzteMeldung = { typ: "leicht-quest", id: qu.v.id, titel: qu.v.titel, kat: qu.v.kat, punkte: pk, mut: mut, gesamt: st.punkte, geschafft: st.geschafft, geschenk: geschenk || "", versuche: qu.versuche, gesprochen: qu.gesprochen || 0 };
    try { if (imRahmen) window.parent.postMessage(Q.letzteMeldung, location.origin); } catch (e) {}
    L().unruhe = 2;
  }

  /* =====================================================================
     10. TAKT: alle paar Minuten eine neue Quest (höchstens zwei)
     ===================================================================== */
  const takt = +q.get("questtakt") || 0;
  let naechste = performance.now() + (q.get("quest") === "1" ? 0 : (30 + zufall() * 30) * 1000);
  let letzt = performance.now();
  function schritt() {
    const jetzt = performance.now(), dt = Math.min(0.1, (jetzt - letzt) / 1000); letzt = jetzt;
    if (!L().ich || !D.WEGE) { requestAnimationFrame(schritt); return; }
    for (let i = 0, fak = Q._schnell || 1; i < fak; i++) bewegen(dt);   // (Zeitraffer nur für die Sonde)
    const offen = Q.liste.filter((x) => x.f.zustand !== "weg").length;
    if (jetzt >= naechste && document.visibilityState !== "hidden" && !document.body.classList.contains("lk-gestalten") && !Q.aus) {
      if (offen < 2 && !q.get("questnur")) questNeu();
      naechste = jetzt + (takt ? takt * 1000 : (180 + zufall() * 180) * 1000);
    }
    requestAnimationFrame(schritt);
  }
  requestAnimationFrame(schritt);
  /* Schwächen: das Spiel schickt sie mit der Kopfzeile; außerhalb des Spiels (angemeldet) die gemessenen */
  window.addEventListener("message", (ev) => {
    if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-kopf") return;
    if (Array.isArray(ev.data.schwach)) info.schwach = ev.data.schwach.filter((x) => typeof x === "string").slice(0, 40);
  });
  if (!imRahmen && ST.spiel && ST.spiel.angemeldet && ST.spiel.rpc) {
    ST.spiel.rpc("spiel_lernstand", {}).then((r) => {
      if (!r || typeof r !== "object" || (info.schwach && info.schwach.length)) return;
      info.schwach = Object.keys(r).filter((k) => r[k] && r[k].n >= 6 && r[k].r / r[k].n < 0.6);
    }).catch(() => {});
  }

  /* =====================================================================
     11. SPRECHEN
     FASSUNG 828 — XANDER (Funk 249): „ein System … auf der Basis von Azure … wo wir innerhalb der Stadtmissionen … in
     echt mit den Menschen sprechen … nachdem die Person dich gefragt hat in der Mission antwortest du einfach was du
     antworten möchtest und das System erkennt dann ob es logisch ist grammatikalisch korrektes Deutsch ist … wenn einer
     dieser Sätze getriggert wird dann kriegt man die Punktzahl bzw kriege nur eine halbe Punktzahl wenn es nur in etwa der
     Satz ist … um denen die Angst zu nehmen zu kommunizieren".
     Ablauf: die Person stellt ihre Frage (Azure-Stimme, Edge Function „aussprache" / vorlesen), danach geht das Mikro von
     selbst an (nach dem ersten Mal; das erste Mal tippt man 🎤). Man antwortet frei; Azure schreibt auf, was gesagt wurde
     („erkennen"), und die Stadt prüft:
       · Wegbeschreibung: die Richtungswörter (links, rechts, geradeaus, halb links …) werden auf dem echten Wegenetz
         nachgegangen (dieselbe Prüfung wie bei den Antwortknöpfen, folgen()). Kommt die Person so ans Ziel, stimmt es –
         egal wie der Satz gebaut ist („Gehen Sie …", „Du gehst …", „Biegen Sie …"). Auch eine Lagebeschreibung zählt
         („Die Bäckerei ist neben dem Rathaus", „gegenüber vom Brunnen", „hinter …"), wenn das genannte Haus wirklich in
         der Nähe steht.
       · andere Fragen: der gesprochene Satz wird mit den Antworten verglichen (Wörter, Reihenfolge egal).
     Volle Punkte (+ Sprech-Bonus) für einen ganzen Satz; die halbe Punktzahl, wenn es nur ungefähr passt (nur „links,
     rechts" ohne Satz, oder der Satz weicht deutlich ab). Führt die Beschreibung woandershin, zeigt die rote Linie wohin. */
  const SPR = (Q.sprechen = {});
  const SPR_AUTO = "dma_quest_sprechen";
  SPR.auto = () => { try { return localStorage.getItem(SPR_AUTO) === "1"; } catch (e) { return false; } };
  SPR.autoSetzen = (an) => { try { localStorage.setItem(SPR_AUTO, an ? "1" : "0"); } catch (e) {} };
  /* (die Anmeldung braucht es erst beim Sprechen: ohne sie sagt die Leiste „Zum Sprechen bitte anmelden") */
  SPR.moeglich = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (window.AudioContext || window.webkitAudioContext) && (window.SUPABASE_CONFIG || Q._sprTest));
  let sprKlient = null;
  function sprMarke() {
    try {
      if (!window.supabase) return Promise.resolve("");
      if (!sprKlient) sprKlient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
      return sprKlient.auth.getSession().then((a) => (a && a.data && a.data.session && a.data.session.access_token) || "").catch(() => "");
    } catch (e) { return Promise.resolve(""); }
  }
  /* eine Anfrage an die Edge Function „aussprache" (roh: Antwort als Blob, sonst JSON) */
  function sprRufen(koerper, roh) {
    if (Q._sprTest) return Q._sprTest(koerper, roh);   // (Sonde: Azure-Antwort nachgestellt)
    return sprMarke().then((m) => {
      if (!m) throw new Error("nicht-angemeldet");
      return fetch(window.SUPABASE_CONFIG.url + "/functions/v1/aussprache", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + m, apikey: window.SUPABASE_CONFIG.anonKey }, body: JSON.stringify(koerper)
      }).then((r) => {
        if (!r.ok) return r.json().catch(() => ({})).then((j) => { throw new Error(j.fehler || ("status-" + r.status)); });
        return roh ? r.blob() : r.json();
      });
    });
  }
  /* Die Person stellt ihre Frage laut (der Teil in „…" aus dem Text) – Promise, wenn fertig gesprochen */
  let sprAudio = null;
  SPR.vorlesen = function (text, er) {
    const m = /„([^“]+)“/.exec(text || ""), satz = (m ? m[1] : text || "").slice(0, 280);
    if (!satz) return Promise.resolve();
    return sprRufen({ aktion: "vorlesen", text: satz, sprache: "de-DE", stimme: er ? "m" : "w" }, true).then((blob) => new Promise((fertig) => {
      try {
        if (sprAudio) { sprAudio.pause(); sprAudio = null; }
        const a = new Audio(URL.createObjectURL(blob)); sprAudio = a;
        a.onended = a.onerror = () => fertig();
        const p = a.play(); if (p && p.catch) p.catch(() => fertig());
        setTimeout(fertig, 15000);
      } catch (e) { fertig(); }
    })).catch(() => {});
  };
  SPR.still = () => { try { if (sprAudio) sprAudio.pause(); } catch (e) {} sprAudio = null; };
  /* Aufnehmen bis zur Pause nach dem Sprechen (höchstens 9 s) → WAV 16 kHz, Base64 */
  let sprLauf = null;
  SPR.laeuft = () => !!sprLauf;
  SPR.stopp = () => { if (sprLauf) sprLauf.stopp(); };
  /* FASSUNG 836 — XANDER (Funk 263): „dann ist die Spracherkennung von Azure noch … unmöglich … sie hört oft falsche
     Wörter". Die Diagnose fand den größten Teil in der eigenen Aufnahme, nicht bei Azure:
     - Rauschunterdrückung und Pegelautomatik waren an. Der Aussprachetrainer hat beide längst aus, gemessen: „die
       Rauschunterdrückung schneidet Reibelaute (s, sch, ch, f) weg, weil sie wie Rauschen aussehen" (57 % → 65 %).
       Genau diese Laute tragen die Endungen (-st, -s, -en). Jetzt wie im Trainer: Echo weg, sonst nichts verbiegen.
     - Die Umrechnung auf 16 kHz nahm einfach den nächsten Abtastwert: bei 48 kHz falten sich Zischlaute über 8 kHz
       ungedämpft ins Sprachband zurück, bei 44,1 kHz kommt ein Zeitversatz dazu (siehe auf16k).
     - Die Stadt spielte während der Aufnahme weiter (siehe T.still in ton.js) – und das Spiel drumherum auch.
     - „Ich höre zu" stand schon da, bevor das Mikro lief; wer gleich losredete, verlor die erste Silbe. Jetzt steht
       es erst, wenn wirklich aufgenommen wird (bereit). */
  function stilleSetzen(an) {
    try { if (ST.ton && ST.ton.still) ST.ton.still(an); } catch (e) {}
    try { if (imRahmen) window.parent.postMessage({ typ: "leicht-mikro", an: !!an }, location.origin); } catch (e) {}
  }
  SPR.aufnehmen = function (pegel, bereit) {
    return navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: false, autoGainControl: false } }).then((strom) => new Promise((fertig, fehler) => {
      const AC = window.AudioContext || window.webkitAudioContext, ctx = new AC();
      const quelle = ctx.createMediaStreamSource(strom), proz = ctx.createScriptProcessor(4096, 1, 1), stumm = ctx.createGain(); stumm.gain.value = 0;
      stilleSetzen(true);
      /* FASSUNG 830 — XANDER (Funk 257): „Es fehlt der Signalton beim einsprechen bei den Aufgaben". Zwei kurze helle Töne
         (aufwärts) = jetzt sprechen; die ersten 0,3 s (der Ton selbst) werden nicht aufgenommen. Am Ende zwei Töne abwärts. */
      try { if (ctx.resume) ctx.resume(); } catch (e) {}
      signal(ctx, true);
      const teile = []; let sprach = false, stilleSeit = 0, ab = performance.now() + 300, aus = false, gemeldet = false;
      const stopp = () => {
        if (aus) return; aus = true; sprLauf = null;
        try { proz.disconnect(); quelle.disconnect(); stumm.disconnect(); } catch (e) {}
        strom.getTracks().forEach((t) => t.stop());
        const rate = ctx.sampleRate; signal(ctx, false); setTimeout(() => { try { ctx.close(); } catch (e) {} }, 400);
        setTimeout(() => stilleSetzen(false), 350);
        if (!sprach) { fehler(new Error("nichts-gehoert")); return; }
        const wav = wavBase64(teile, rate);
        SPR.letzte = { wav: wav, rate: rate, azure: null };   // FASSUNG 836 — für die Betreiber-Diagnose
        fertig(wav);
      };
      sprLauf = { stopp: stopp };
      proz.onaudioprocess = (e) => {
        const jetzt = performance.now();
        if (jetzt < ab || aus) return;
        if (!gemeldet) { gemeldet = true; try { if (bereit) bereit(); } catch (x) {} }
        const d = e.inputBuffer.getChannelData(0); teile.push(new Float32Array(d));
        let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i];
        const rms = Math.sqrt(s / d.length);
        if (pegel) pegel(Math.min(1, rms * 12));
        if (rms > 0.02) { sprach = true; stilleSeit = 0; } else if (sprach && !stilleSeit) stilleSeit = jetzt;
        /* (830: 1,8 s Pause statt 1,3 s – wer beim Sprechen kurz nachdenkt, wird nicht mehr abgeschnitten; höchstens 12 s) */
        if ((sprach && stilleSeit && jetzt - stilleSeit > 1800) || jetzt - ab > 12000 || (!sprach && jetzt - ab > 6000)) stopp();
      };
      quelle.connect(proz); proz.connect(stumm); stumm.connect(ctx.destination);
    }));
  };
  /* zwei kurze Töne: an = aufwärts (jetzt sprechen), aus = abwärts (fertig) */
  function signal(ctx, an) {
    try {
      const t0 = ctx.currentTime + 0.02, fr = an ? [880, 1320] : [1100, 740];
      fr.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = t0 + i * 0.11;
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.12);
      });
    } catch (e) {}
  }
  SPR.signal = signal;
  /* FASSUNG 836 — SAUBER AUF 16 kHz. Vorher: der nächste Abtastwert, ohne Filter. Das faltet alles über 8 kHz (die
     Zischlaute) zurück ins Sprachband – ein 11-kHz-Anteil kam bei 48 kHz mit voller Stärke als 5 kHz an. Jetzt ein
     Tiefpass bei 7 kHz (Sinc mit Blackman-Fenster, 24 Ausgabe-Abtastwerte breit) und Zwischenwerte an der genauen
     Stelle, auch bei 44,1 kHz. Die Tabelle wird je Gerätefrequenz einmal gebaut; 12 s Aufnahme ≈ 9 Mio. Schritte. */
  const SINC = {};
  function auf16k(teile, rate) {
    let n = 0; for (const t of teile) n += t.length;
    const x = new Float32Array(n); let o = 0; for (const t of teile) { x.set(t, o); o += t.length; }
    const f = rate / 16000, m = Math.floor(n / f), pcm = new Int16Array(m);
    const zu = (v) => { v = v > 1 ? 1 : v < -1 ? -1 : v; return v < 0 ? v * 0x8000 : v * 0x7fff; };
    if (Math.abs(f - 1) < 1e-6) { for (let i = 0; i < m; i++) pcm[i] = zu(x[i]); return pcm; }
    const R = 32, N = Math.ceil(12 * Math.max(1, f)), fc = Math.min(7000, 0.44 * rate) / rate;
    let h = SINC[rate];
    if (!h) {
      h = SINC[rate] = new Float32Array(2 * N * R + 2);
      for (let j = 0; j < h.length; j++) {
        const t = j / R - N; if (Math.abs(t) > N) continue;
        const s = t === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * t) / (Math.PI * t);
        h[j] = s * (0.42 + 0.5 * Math.cos(Math.PI * t / N) + 0.08 * Math.cos(2 * Math.PI * t / N));
      }
    }
    for (let i = 0; i < m; i++) {
      const pos = i * f, k0 = Math.floor(pos), fr = pos - k0;
      let s = 0, ws = 0;
      for (let k = 1 - N; k <= N; k++) {
        const j = k0 + k; if (j < 0 || j >= n) continue;
        const t = (k - fr + N) * R, ti = t | 0, w = h[ti] + (h[ti + 1] - h[ti]) * (t - ti);
        s += x[j] * w; ws += w;
      }
      pcm[i] = zu(ws > 1e-6 ? s / ws : 0);
    }
    return pcm;
  }
  SPR.auf16k = auf16k;   // für die Sonde
  function wavBase64(teile, rate) {
    const pcm = auf16k(teile, rate);
    const buf = new ArrayBuffer(44 + pcm.length * 2), dv = new DataView(buf), w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    w(0, "RIFF"); dv.setUint32(4, 36 + pcm.length * 2, true); w(8, "WAVE"); w(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
    dv.setUint32(24, 16000, true); dv.setUint32(28, 32000, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, "data"); dv.setUint32(40, pcm.length * 2, true);
    new Int16Array(buf, 44).set(pcm);
    const b = new Uint8Array(buf); let s = ""; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
  }
  /* Azure: was wurde gesagt? (die besten Lesarten) */
  /* FASSUNG 836 — Azure schreibt im Display-Feld Zahlen als Ziffern: „Heute ist der 2. Oktober" passt dann gleich gut
     zu „zweite" wie zu „zwei", und „7,50 €" verdeckt „Komma" oder „Euros". Darum zählt jetzt auch die Lexical-Lesart
     (so, wie es gesprochen wurde: „heute ist der zweite oktober"). Angezeigt wird weiter die Display-Fassung. */
  /* FASSUNG 875 — XANDER (Funk 257/263): „dazu muss die Erkennung auch korrekt sein weil er hat meine Worte oft nicht
     richtig erkannt“ · „die Spracherkennung von Azure … hört so oft falsche Sachen“. Die Wortliste der Mission (phrasen)
     geht mit. Die Edge Function „aussprache“ ruft heute den REST-Weg für kurze Aufnahmen auf
     (…/speech/recognition/conversation/cognitiveservices/v1); der kennt keine Phrase List und das Feld wird dort nicht
     gelesen. Gibt der Server sie später weiter (Speech SDK mit PhraseListGrammar oder Fast Transcription mit phraseList),
     wirkt sie sofort, ohne dass die Stadt sich ändert. Bis dahin nutzt die Stadt die Liste selbst (anpassen, unten). */
  SPR.erkennen = function (wav, phrasen) {
    const koerper = { aktion: "erkennen", wav: wav, sprache: "de-DE" };
    if (Array.isArray(phrasen) && phrasen.length) koerper.phrasen = phrasen.slice(0, 100).map((x) => String(x).slice(0, 60));
    return sprRufen(koerper).then((j) => {
      const nb = Array.isArray(j && j.NBest) ? j.NBest : [];
      const lesarten = [], anzeige = {};
      const dazu = (t, zeig) => { t = String(t || "").trim(); if (!t || lesarten.indexOf(t) >= 0) return; lesarten.push(t); anzeige[t] = String(zeig || t); };
      if (j && j.DisplayText) dazu(j.DisplayText);
      nb.slice(0, 4).forEach((x) => { dazu(x.Display || x.Lexical); if (x.Lexical) dazu(x.Lexical, x.Display || x.Lexical); });
      if (SPR.letzte) SPR.letzte.azure = { text: j && j.DisplayText || "", nbest: nb.slice(0, 3).map((x) => ({ d: x.Display || "", l: x.Lexical || "", c: x.Confidence })) };
      const r = lesarten.slice(0, 8); r.anzeige = anzeige;
      return r;
    });
  };

  /* ---------- FASSUNG 830 — freie Antworten ----------
     XANDER (Funk 257, wörtlich): „es sollen auch eigene Antworten möglich sein die müssen nicht festgenagelt an den Antworten
     sein … z.B ich möchte 95 Brötchen kaufen bitte … dann muss das genauso gültig sein wie wenn man sagt ich möchte Brötchen
     kaufen oder ich möchte ein Brot kaufen je nach Kontext der Aufgabe … es geht nur darum ob sie grammatikalisch richtig sind
     aber die Variation soll groß sein … und dieses fast kannst du nur schreiben wenn er die Grammatik fast richtig hat".
     Deshalb zwei getrennte Fragen statt „ähnelt der Satz einer Antwort?":
       1. Erfüllt der Satz die Aufgabe? (FREI[id]: was in der Situation gesagt werden muss – eine Ware beim Bäcker, ein
          Gericht im Gasthaus, „nach" + Stadt am Schalter, „Sie" beim fremden Herrn …; jede Formulierung zählt)
       2. Stimmt die Grammatik? (grammatikPruefen: Verbformen nach der Person, Plural nach Zahlen, Artikel im Akkusativ
          beim Bestellen, Infinitiv ans Ende nach „möchte/kann …", Perfekt mit „sein" bei Bewegung, trennbare Verben)
     Beides ja → richtig (volle Punkte + Sprech-Bonus). Aufgabe erfüllt, aber ein Grammatikfehler → „Fast!" mit genau diesem
     Fehler und wie es richtig heißt. Aufgabe nicht erfüllt → kein Abzug, nur ein Hinweis, was noch fehlt. */
  const fw = (s) => " " + String(s || "").toLowerCase().replace(/[„“"'.,!?;:–—()]/g, " ").replace(/\s+/g, " ").trim() + " ";
  /* Nomen der Situationen: Geschlecht und Plural (Duden) */
  const NOMEN = { "brötchen": ["n", "brötchen"], "brot": ["n", "brote"], "brezel": ["f", "brezeln"], "breze": ["f", "brezen"], "kuchen": ["m", "kuchen"], "torte": ["f", "torten"],
    "croissant": ["n", "croissants"], "semmel": ["f", "semmeln"], "schrippe": ["f", "schrippen"], "berliner": ["m", "berliner"], "krapfen": ["m", "krapfen"], "baguette": ["n", "baguettes"],
    "schnitzel": ["n", "schnitzel"], "suppe": ["f", "suppen"], "salat": ["m", "salate"], "bratwurst": ["f", "bratwürste"], "wurst": ["f", "würste"], "kaffee": ["m", "kaffees"],
    "tee": ["m", "tees"], "bier": ["n", "biere"], "saft": ["m", "säfte"], "kugel": ["f", "kugeln"], "waffel": ["f", "waffeln"], "fahrkarte": ["f", "fahrkarten"],
    "ticket": ["n", "tickets"], "fahrschein": ["m", "fahrscheine"], "buch": ["n", "bücher"], "tretboot": ["n", "tretboote"], "boot": ["n", "boote"], "postkarte": ["f", "postkarten"],
    "karte": ["f", "karten"], "apfel": ["m", "äpfel"], "regenschirm": ["m", "regenschirme"], "schirm": ["m", "schirme"], "pizza": ["f", "pizzen"], "knödel": ["m", "knödel"],
    /* FASSUNG 875 — Nomen der neuen Missionen */
    "fisch": ["m", "fische"], "woche": ["f", "wochen"], "stunde": ["f", "stunden"], "minute": ["f", "minuten"], "gleis": ["n", "gleise"], "radweg": ["m", "radwege"],
    "laterne": ["f", "laternen"], "museum": ["n", "museen"], "labor": ["n", "labore"], "bibliothek": ["f", "bibliotheken"], "schule": ["f", "schulen"],
    "krankenhaus": ["n", "krankenhäuser"], "bahnhof": ["m", "bahnhöfe"], "gasthaus": ["n", "gasthäuser"], "brauerei": ["f", "brauereien"], "sternwarte": ["f", "sternwarten"] };
  const PLURAL = {}; for (const k in NOMEN) PLURAL[NOMEN[k][1]] = k;
  const GROSS = (w) => w[0].toUpperCase() + w.slice(1);
  /* eine Zahl über eins (Ziffern, Zahlwörter, „ein paar", „viele" …) */
  const MEHRERE = /^(\d+|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|\w+zehn|\w*zig|\w*ßig|\w*hundert\w*|\w*tausend\w*|paar|viele|einige|mehrere)$/;
  const BESTELLEN = /\b(hätte|hätten|möchte|möchten|nehme|nehmen|kaufe|kaufen|brauche|brauchen|bestelle|bestellen|bekomme|bekommen|kriege|kriegen|gib|geben|will|wollen|miete|mieten|leihen)\b/;
  const PRAEP = /^(mit|von|vom|zu|zum|zur|aus|bei|beim|nach|in|im|an|am|auf|vor|für|ohne|um|neben|hinter|über|unter)$/;
  const KONJ = [
    [/ ich (möchten|möchtest|möchtet) /, "Mit „ich“ heißt es „ich möchte“."], [/ ich (bist|ist|sind|seid) /, "Mit „ich“ heißt es „ich bin“."],
    [/ ich (hast|hat|haben) /, "Mit „ich“ heißt es „ich habe“."], [/ ich (kannst|können) /, "Mit „ich“ heißt es „ich kann“."],
    [/ ich (musst|müssen) /, "Mit „ich“ heißt es „ich muss“."], [/ ich (willst|wollen) /, "Mit „ich“ heißt es „ich will“."],
    [/ ich (darfst|dürfen) /, "Mit „ich“ heißt es „ich darf“."], [/ ich (kauft|kaufst|geht|gehst|braucht|brauchst|bestellt|nimmt|nimmst|kommt|macht|heißt|wohnt|sucht) /, "Mit „ich“ endet das Verb auf -e: ich kaufe, ich gehe, ich heiße …"],
    [/ du (bin|ist|sind) /, "Mit „du“ heißt es „du bist“."], [/ du (darf|dürfen) /, "Mit „du“ hat das Verb ein -st: du darfst."], [/ du (kann|können) /, "Mit „du“: du kannst."],
    [/ du (muss|müssen) /, "Mit „du“: du musst."], [/ du (will|wollen) /, "Mit „du“: du willst."], [/ du (möchte|möchten) /, "Mit „du“: du möchtest."], [/ du (habe|haben|hat) /, "Mit „du“: du hast."],
    [/ (er|es) (bin|bist|sind) /, "Mit „er/es“ heißt es „ist“."], [/ wir (bin|bist|ist) /, "Mit „wir“ heißt es „wir sind“."]
  ];
  const PARTIZIP_FALSCH = { gegeht: "gegangen", gefahrt: "gefahren", gelauft: "gelaufen", gekommt: "gekommen", gesehet: "gesehen", geesst: "gegessen", getrinkt: "getrunken", geschwimmt: "geschwommen", gefliegt: "geflogen", geschreibt: "geschrieben",
    /* FASSUNG 875 */ gebauen: "gebaut", gewachst: "gewachsen", gefangt: "gefangen", gebringt: "gebracht", gedenkt: "gedacht", gewisst: "gewusst", geschlaft: "geschlafen", genehmt: "genommen", gegebt: "gegeben", gesprecht: "gesprochen", gefindet: "gefunden", geinvestiert: "investiert", gebesucht: "besucht", geerklärt: "erklärt", geverändert: "verändert" };
  const INF_LISTE = /^(kaufen|haben|mieten|zurückgeben|abgeben|fahren|bestellen|gehen|essen|trinken|bezahlen|leihen|ausleihen|klettern|sehen|bekommen|nehmen|bauen|besuchen|behalten|übernachten|anmelden|investieren|verbessern|bringen|holen|dimmen|ablehnen|verkaufen)$/;
  /* ---------- FASSUNG 875 — Satzbau für B1 bis C2 ----------
     Nebensätze (weil, dass, wenn, obwohl, damit, sodass …): das Verb steht am Ende; nach einem vorangestellten Nebensatz
     kommt im Hauptsatz zuerst das Verb; nach „denn“ steht es an zweiter Stelle; „um … zu“ braucht „zu“ und kein eigenes
     Subjekt; nach „würde“ der Infinitiv; Passiv mit Modalverb „werden“, nicht „worden“; Uhrzeit mit „um“; Dativ Plural
     nach seit/vor/in …; Komparativ mit -er und „als“. Die Wortlisten sind klein und sicher gehalten: lieber ein Fehler
     unbemerkt als ein richtiger Satz als „Fast“ (Funk 257: „dieses fast kannst du nur schreiben wenn er die Grammatik
     fast richtig hat“). */
  const SUBORD = new Set(["weil", "dass", "obwohl", "wenn", "ob", "damit", "bevor", "nachdem", "sodass", "falls", "sobald", "solange"]);
  const SUBJ_PRON = new Set(["ich", "du", "er", "sie", "es", "wir", "ihr", "man"]);
  const DET = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|kein|keine|keinen|mein|meine|meinen|dein|deine|unser|unsere|unseren|ihr|ihre|ihren|sein|seine|seinen|diese|dieser|dieses|diesen|jede|jeder|jedes|viele|mehr|weniger|alle|einige|manche|beide)$/;
  const PRAEP_ADV = new Set(["mit", "von", "vom", "zu", "zum", "zur", "aus", "bei", "beim", "nach", "in", "im", "an", "am", "auf", "vor", "für", "ohne", "neben", "hinter", "über", "unter",
    "dort", "da", "hier", "heute", "morgen", "gestern", "jetzt", "dann", "deshalb", "zuerst", "oft", "immer", "nie", "auch", "nur", "schon", "noch", "gerade", "zu hause"]);
  const FINIT = new Set(("bin bist ist sind seid war warst waren wäre wären sei habe hast hat haben habt hatte hatten hätte hätten kann kannst können könnt konnte konnten könnte könnten " +
    "muss musst müssen müsst musste mussten müsste müssten soll sollst sollen sollt sollte sollten will willst wollen wollt wollte wollten möchte möchtest möchten mag darf darfst dürfen dürft " +
    "durfte dürfte wird wirst werden werdet wurde wurden würde würdest würden gibt gab gäbe fehlt fehlen fehle fehlte braucht brauchst brauche brauchen finde findet findest finden glaube " +
    "glaubt glauben denke denkt denken meint weiß liegt liegen steht stehen kommt kommen komme kommst kämen käme geht gehen gehe gehst fährt fahren fahre fährst wächst wachsen wachse " +
    "macht machen mache sieht sehen sehe kostet bringt bringen hilft helfen arbeitet lernt lernen lerne regnet schneit stürmt wohnt wohnen spielt bekommt bekommen nimmt nehmen nehme " +
    "läuft bleibt bleiben bleibe passt passen lohnt profitiert profitieren schafft schaffen zeigt zeigen gehört gehören verbessert verbessern investiert investieren baut bauen baue fördert " +
    "fördern bietet bieten garantiert verspricht sichert übernimmt zahlt behält entstehen entsteht entstünden entstünde reist sucht heißt heißen kauft kaufen kaufe trinkt schmeckt mangelt tut tun").split(" "));
  /* (sicher finit auch direkt nach der Konjunktion – keine Formen, die auch Nomen oder Infinitive sein können) */
  const FINIT_V1 = new Set("bin bist ist sind war waren wäre wären hat hätte hätten kann kannst könnte könnten muss müsste müssten soll sollte sollten will darf dürfte wird würde würden gibt gäbe fehlt fehle braucht kommt geht fährt wächst sieht kostet liegt steht regnet schneit stürmt entstehen entstünden entsteht entstünde".split(" "));
  const GRENZE = new Set(["und", "aber", "oder", "denn", "sondern", "doch", "jedoch", "wie", "was", "wo", "wer", "wann", "warum", "als", "etwa", "also"].concat(Array.from(SUBORD)));
  const MODAL = new Set("kann können könnte könnten muss müssen müsste müssten soll sollen sollte sollten darf dürfen dürfte will wollen".split(" "));
  const MODAL_AUX = new Set("muss kann soll ist sind hat haben wird werden darf will möchte".split(" "));
  const PART_INF = { genommen: "nehmen", gemacht: "machen", gebaut: "bauen", gefahren: "fahren", gegangen: "gehen", gekauft: "kaufen", gesprochen: "sprechen", geblieben: "bleiben",
    gebracht: "bringen", gesagt: "sagen", gesehen: "sehen", gegeben: "geben", geholfen: "helfen", gearbeitet: "arbeiten", gespielt: "spielen", gelernt: "lernen", gewartet: "warten",
    gefragt: "fragen", geschlafen: "schlafen", gelesen: "lesen", geschrieben: "schreiben", gefunden: "finden", gekommen: "kommen", gelaufen: "laufen", gegessen: "essen", getrunken: "trinken", gewählt: "wählen" };
  const INF_ZU = /^(verbessern|erhöhen|einstellen|anwerben|bezahlen|ausbauen|schaffen|senken|einführen|fördern|entlasten|anbieten|gewinnen|investieren|ausbilden|reduzieren|verkürzen|steigern|zahlen)$/;
  const UMZU_VERB = new Set("kann können könnte könnten wird werden ist sind bleibt bleiben hat haben lernen lernt muss müssen darf dürfen soll sollen".split(" "));
  const KOMP = { hoch: "höher", groß: "größer", gut: "besser", nah: "näher", alt: "älter", jung: "jünger", kurz: "kürzer", lang: "länger", warm: "wärmer", kalt: "kälter", teuer: "teurer" };
  /* Wörter mit Kommas aus dem rohen Satz (Azure setzt sie in der Display-Fassung) – klein und wie gesprochen */
  function satzWoerter(t) {
    const roh = String(t || "").replace(/[„“"'.!?;:–—()]/g, " ").replace(/,/g, " , ").split(/\s+/).filter(Boolean);
    return { roh: roh, w: roh.map((x) => x.toLowerCase()) };
  }
  function satzbau(t) {
    const { roh, w } = satzWoerter(t), n = w.length, nx = (k) => { while (k < n && w[k] === ",") k++; return k; };
    const ende = (k) => { while (k < n && w[k] !== "," && !GRENZE.has(w[k])) k++; return k; };
    const zeig = (a, b) => roh.slice(a, b).join(" ");
    for (let i = 0; i < n; i++) {
      const c = w[i];
      if (SUBORD.has(c)) {
        const a = nx(i + 1); if (a >= n) continue;
        /* Verb direkt nach der Konjunktion: „wenn regnet es“, „sodass entstünden …“ */
        /* („Damit ist …“ am Satzanfang ist das Adverb, kein Nebensatz) */
        if (FINIT_V1.has(w[a]) && !(c === "damit" && i === 0)) { const e = ende(a + 1); return "Fast! Im Nebensatz mit „" + c + "“ steht das Verb am Ende: … " + c + " " + (e - a <= 7 ? zeig(a + 1, e) + " " + roh[a] : "… " + roh[a]) + "."; }
        let j = -1;
        if (SUBJ_PRON.has(w[a])) j = a;
        else if (DET.test(w[a])) { j = a + 1; if (j + 1 < n && /(e|en|es|er|em)$/.test(w[j]) && !FINIT.has(w[j + 1]) && !GRENZE.has(w[j + 1]) && w[j + 1] !== ",") j++; }
        else if (!PRAEP_ADV.has(w[a]) && FINIT.has(w[a + 1])) j = a;
        else if (!PRAEP_ADV.has(w[a]) && /(e|en|es|er)$/.test(w[a]) && FINIT.has(w[a + 2])) j = a + 1;
        if (j >= 0 && j + 1 < n && FINIT.has(w[j + 1])) {
          const v = j + 1, m = nx(v + 1);
          if (m < n && !FINIT.has(w[m]) && !GRENZE.has(w[m])) {
            if (SUBJ_PRON.has(w[m]) && FINIT.has(w[nx(m + 1)])) return "Fast! Nach dem vorangestellten „" + c + "“-Satz kommt zuerst das Verb: …, " + roh[nx(m + 1)] + " " + roh[m] + " …";
            const e = ende(v + 1);
            return "Fast! Nach „" + c + "“ steht das Verb am Ende: … " + c + " " + (e - a <= 8 ? zeig(a, v) + " " + zeig(v + 1, e) + " " + roh[v] : zeig(a, v) + " … " + roh[v]) + ".";
          }
        }
        /* das Verb am Ende des Nebensatzes (das erste finite) – und was danach kommt */
        let k = j >= 0 ? j + 1 : a; while (k < n && !FINIT.has(w[k]) && w[k] !== ",") k++;
        if (k < n && FINIT.has(w[k])) {
          const m = nx(k + 1);
          if (i === 0 && m < n && ((SUBJ_PRON.has(w[m]) && FINIT.has(w[nx(m + 1)])) || (DET.test(w[m]) && FINIT.has(w[nx(m + 2)]))))
            return "Fast! Nach dem vorangestellten „" + c + "“-Satz kommt zuerst das Verb: …, " + roh[SUBJ_PRON.has(w[m]) ? nx(m + 1) : nx(m + 2)] + " " + zeig(m, SUBJ_PRON.has(w[m]) ? m + 1 : m + 2) + " …";
          if (PRAEP_ADV.has(w[a]) && k - a <= 4 && SUBJ_PRON.has(w[m]) && nx(m + 1) < n && !FINIT.has(w[nx(m + 1)]) && !GRENZE.has(w[nx(m + 1)])) {
            const e = ende(m + 1);
            return "Fast! Auch hier steht das Verb im Nebensatz am Ende: … " + c + " " + (e - a <= 9 ? roh[m] + " " + zeig(a, k) + " " + zeig(m + 1, e) + " " + roh[k] : roh[m] + " … " + roh[k]) + ".";
          }
          if ((w[k + 1] === "und" || w[k + 1] === "oder") && MODAL_AUX.has(w[k + 2]) && k + 3 < n && w[k + 3] !== ",")
            return "Fast! Auch nach „" + w[k + 1] + "“ geht der " + c + "-Satz weiter – das Verb kommt ans Ende: … " + w[k + 1] + " " + zeig(k + 3, ende(k + 3)) + " " + roh[k + 2] + ".";
        }
      }
      if (c === "denn") {
        const a = nx(i + 1); let j = -1;
        if (SUBJ_PRON.has(w[a])) j = a; else if (DET.test(w[a] || "")) j = a + 1;
        if (j >= 0 && j + 1 < n && !FINIT.has(w[j + 1]) && w[j + 1] !== ",") {
          let k = j + 1; while (k < n && !FINIT.has(w[k]) && w[k] !== "," && !GRENZE.has(w[k])) k++;
          const nach = k + 1;
          if (k < n && FINIT.has(w[k]) && (nach >= n || w[nach] === "," || GRENZE.has(w[nach]))) return "Fast! Nach „denn“ steht das Verb an zweiter Stelle: … denn " + zeig(a, j + 1) + " " + roh[k] + " " + zeig(j + 1, k) + ".";
        }
      }
      /* „um … zu“ mit eigenem Subjekt und ohne „zu“ */
      if (c === "um" && w[i + 1] && (DET.test(w[i + 1]) || SUBJ_PRON.has(w[i + 1]))) {
        const e = ende(i + 1), teil = w.slice(i + 1, e);
        if (teil.indexOf("zu") < 0 && teil.indexOf("uhr") < 0 && teil.some((x) => UMZU_VERB.has(x)))
          return "Fast! „um … zu“ braucht „zu“ und einen Infinitiv ohne eigenes Subjekt. Mit eigenem Subjekt nimmt man „damit“: … damit " + zeig(i + 1, e) + ".";
      }
      /* nach „würde“ der Infinitiv, nicht das Partizip („Ich würde den Zug genommen“) */
      if (/^würde(n|st|t)?$/.test(c)) {
        const e = ende(i + 1), l = w[e - 1];
        if (e - 1 > i + 1 && PART_INF[l] && !w.slice(i + 1, e - 1).some((x) => FINIT.has(x))) return "Fast! Nach „" + c + "“ steht der Infinitiv: … " + PART_INF[l] + " (nicht „" + l + "“).";
      }
      /* Passiv mit Modalverb: „gebaut werden“, nicht „gebaut worden“ */
      if (c === "worden") {
        let b = i - 1, modal = false; while (b >= 0 && w[b] !== "," && !GRENZE.has(w[b])) { if (MODAL.has(w[b])) modal = true; b--; }
        if (MODAL.has(w[i + 1]) || (modal && w[i + 1] !== "sein")) return "Fast! Passiv mit Modalverb: … werden (nicht „worden“) – zum Beispiel „gebaut werden“, „beliefert werden könnten“.";
      }
    }
    return null;
  }
  function grammatikPruefen(T, t) {
    for (const k of KONJ) if (k[0].test(T)) return k[1];
    const w = T.trim().split(" ");
    for (let i = 0; i < w.length; i++) {
      /* falsche Partizipien */
      if (PARTIZIP_FALSCH[w[i]]) return "„" + w[i] + "“ gibt es nicht – es heißt „" + PARTIZIP_FALSCH[w[i]] + "“.";
      /* Plural nach einer Zahl: „vier Brötchen“, „drei Äpfel“, „zwei Postkarten“ (nicht „Brötchens“, „Apfel“, „Postkarte“) */
      if (MEHRERE.test(w[i]) && !(w[i] === "paar" && w[i - 1] !== "ein") && !PRAEP.test(w[i - 1] || "")) {
        for (const n of [w[i + 1], w[i + 2]]) {
          if (!n) continue;
          if (PLURAL[n]) break;
          const sing = NOMEN[n] ? n : Object.keys(NOMEN).find((k) => n !== NOMEN[k][1] && n.length > k.length && n.length <= k.length + 2 && n.indexOf(k) === 0);
          if (sing && NOMEN[sing][1] !== sing) return "Mehrere – also Plural: " + (NOMEN[sing][0] === "m" ? "der " : NOMEN[sing][0] === "f" ? "die " : "das ") + GROSS(sing) + " – die " + GROSS(NOMEN[sing][1]) + ".";
          if (sing && n !== NOMEN[sing][1]) return "Mehrere – also Plural: die " + GROSS(NOMEN[sing][1]) + ".";
          if (sing) break;
        }
      }
      /* Artikel beim Bestellen/Kaufen (Akkusativ): einen Kuchen, eine Brezel, ein Brot */
      if ((w[i] === "ein" || w[i] === "eine" || w[i] === "einen") && !PRAEP.test(w[i - 1] || "") && BESTELLEN.test(T)) {
        let n = w[i + 1]; if (n && !NOMEN[n] && /(e|en|es|er)$/.test(n) && NOMEN[w[i + 2]]) n = w[i + 2];
        if (NOMEN[n]) {
          const g = NOMEN[n][0], soll = g === "m" ? "einen" : g === "f" ? "eine" : "ein";
          if (w[i] !== soll) return "Es heißt „" + (g === "m" ? "der" : g === "f" ? "die" : "das") + " " + GROSS(n) + "“ – also „" + soll + " " + GROSS(n) + "“.";
        }
      }
    }
    /* Nach „möchte, kann, will …“ (FASSUNG 875: auch „würde, könnte, sollte …“) steht das zweite Verb am Ende – bis zum
       nächsten Nebensatz oder „und“ (sonst hielt „… nehmen, weil die Bahn …“ das „die“ für ein Objekt nach dem Verb) */
    const m = / (möchte|möchtest|möchten|will|willst|wollen|kann|kannst|können|muss|musst|müssen|darf|darfst|dürfen|soll|sollst|würde|würden|könnte|könnten|sollte|sollten|müsste|müssten) (.*)$/.exec(T);
    if (m) {
      let rest = m[2].trim().split(" "); const g = rest.findIndex((x) => GRENZE.has(x)); if (g >= 0) rest = rest.slice(0, g);
      for (let i = 0; i < rest.length - 1; i++) if (INF_LISTE.test(rest[i]) && rest.slice(i + 1).some((x) => NOMEN[x] || PLURAL[x] || /^(ein|eine|einen|das|die|der|den|\d+)$/.test(x)))
        return "Nach „" + m[1] + "“ steht das zweite Verb ganz am Ende: … " + rest.filter((x, j) => j !== i).join(" ") + " " + rest[i] + ".";
    }
    if (/ geben zurück /.test(T) || / zurück (das|die|den) /.test(T)) return "„zurückgeben“ bleibt nach „möchte“ zusammen am Ende: … das Buch zurückgeben.";
    if (/ (habe|hab|hast|hat|haben|habt) /.test(T) && / (gegangen|gefahren|gelaufen|gekommen|geflogen|geschwommen|gerannt|gewandert) /.test(T)) return "Bei Bewegung bildet man das Perfekt mit „sein“: ich bin gegangen, ich bin gefahren.";
    /* ---------- FASSUNG 875 ---------- */
    const sb = satzbau(t != null ? t : T); if (sb) return sb;
    let x;
    if ((x = / am (\d{1,2}|ein|eins|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig|einundzwanzig|zweiundzwanzig|dreiundzwanzig) uhr /.exec(T))) return "Fast! Bei der Uhrzeit sagt man „um“: um " + x[1] + " Uhr.";
    if ((x = / (seit|vor|nach|in|mit) (zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwanzig|dreißig|\d+|vielen|einigen|wenigen|mehreren|paar) (jahre|monate|tage) /.exec(T))) return "Fast! Nach „" + x[1] + "“ steht der Dativ – im Plural mit -n: " + x[1] + " " + x[2] + " " + GROSS(x[3]) + "n.";
    if ((x = / mehr (schnell|bequem|billig|günstig|entspannt|teuer|einfach|schön|groß|klein|hoch|wichtig|praktisch|sicher|gesund|leise|laut|ruhig|modern|sauber|gut|alt|jung|kurz|lang|warm|kalt) (als|wie) /.exec(T))) return "Fast! Den Komparativ bildet man mit -er: " + (KOMP[x[1]] || x[1] + "er") + " als (nicht „mehr " + x[1] + "“).";
    if ((x = / (schneller|bequemer|billiger|günstiger|teurer|besser|lieber|einfacher|größer|kleiner|höher|schöner|wichtiger|sicherer|leiser|lauter|ruhiger|moderner|praktischer|älter|jünger|länger|kürzer|näher|entspannter) wie /.exec(T))) return "Fast! Nach dem Komparativ steht „als“: " + x[1] + " als …";
    if ((x = / wir (baut|macht|kauft|geht|kommt|hat|ist|braucht|sucht|fährt|nimmt|arbeitet|lernt|spielt|wohnt|bleibt|sieht|liest) /.exec(T))) return "Fast! Mit „wir“ heißt es „wir " + ({ hat: "haben", ist: "sind", fährt: "fahren", nimmt: "nehmen", sieht: "sehen", liest: "lesen", arbeitet: "arbeiten" }[x[1]] || x[1].replace(/t$/, "en")) + "“.";
    return null;
  }
  /* Höflich? (beim Bestellen und Kaufen) */
  const hoeflich = (T) => / (bitte|hätte|hätten|möchte|möchten|würde|würden|könnte|könnten|dürfte|gern|gerne) /.test(T);
  const unhoeflich = (T) => / (schnell|sofort|gib|gebt) /.test(T) || (/ (will|wollen) /.test(T) && !/ bitte /.test(T));
  const bestellung = (T, ware, wo) => {
    if (!ware.test(T)) return null;
    if (unhoeflich(T)) return { fehler: "Das Richtige bestellt – aber so klingt es unhöflich. Mit „bitte“ oder „Ich hätte gern …“ wird es freundlich." };
    const z = /( \d+ | \w*zig | \w*hundert\w* )/.exec(T), zahl = z ? parseInt(z[1], 10) : 0;
    return { ok: true, antwort: zahl >= 20 ? "„" + zahl + " Stück? Dafür brauche ich eine große Tüte – kommt sofort!“" : hoeflich(T) ? "„Gern, kommt sofort!“" : "„Kommt sofort!“" };
  };
  const FREI = {
    baeckerei: (T) => bestellung(T, / (brötchen\w*|brot|brote\w*|brezel\w*|breze\w*|kuchen\w*|torte\w*|croissant\w*|semmel\w*|schrippe\w*|berliner|krapfen|baguette\w*|laugenstange\w*|hörnchen|plätzchen|keks\w*|teilchen|stück) /),
    schnitzel: (T) => bestellung(T, / (schnitzel|suppe|salat|bratwurst|wurst|würstchen|pommes|braten|knödel|spätzle|bier|wasser|kaffee|tee|saft|schorle|apfelschorle|limo|limonade|pizza|nudeln|fisch|steak|kartoffeln|kuchen|eis|menü|tagesgericht|speisekarte|rechnung) /),
    eis: (T) => bestellung(T, / (eis|kugel|kugeln|waffel|becher|\w+eis|eistüte|softeis) /),
    fahrkarte: (T, qu) => {
      const st = fw(qu.vars.stadt).trim();
      if (T.indexOf(" zu " + st + " ") >= 0 || T.indexOf(" in " + st + " ") >= 0 || T.indexOf(" nach " + st) < 0 && T.indexOf(" " + st + " ") >= 0 && / (zu|in) /.test(T)) return { fehler: "Bei Städten ohne Artikel sagt man „nach“: nach " + qu.vars.stadt + "." };
      if (!/ (fahrkarte|fahrkarten|ticket|tickets|fahrschein|karte|zug|fahren|fahre|reisen|einmal|zweimal) /.test(T) && T.indexOf(" nach " + st + " ") < 0) return null;
      if (T.indexOf(" " + st + " ") < 0) return { fehlt: "Sag auch, wohin sie fährt: „… nach " + qu.vars.stadt + ", bitte.“" };
      return { ok: true, antwort: "„Nach " + qu.vars.stadt + " – gern. Hin und zurück?“" };
    },
    sie_du: (T) => {
      if (/ (du|dir|dich|dein|deine|komm|zeig) /.test(T)) return { fehler: "Einen fremden Erwachsenen sprichst du mit „Sie“ an: Kommen Sie mit, ich zeige Ihnen den Weg." };
      if (/ (sie|ihnen|ihr|gern|gerne|natürlich|klar|ja|helfe|zeige|kommen|mitkommen|folgen) /.test(T)) return { ok: true };
      return null;
    },
    tretboot: (T, qu, t) => / (tretboot|boot|tretboote) /.test(T) ? (/ mietet /.test(T) ? { fehler: "Nach „kann“ steht der Infinitiv am Ende: … mieten." }
      : /\?\s*$/.test(t) && /^ ich (kann|darf|könnte|dürfte) /.test(T) ? { fehler: "Bei einer Ja/Nein-Frage steht das Verb vorn: „Kann ich …?“" } : { ok: true, antwort: "„Klar! Eine Stunde kostet fünf Euro.“" }) : null,
    postkarten: (T) => / (postkarte\w*|karten?|ansichtskarte\w*) /.test(T) ? (/ postkartes /.test(T) ? { fehler: "Der Plural hat ein -n: die Postkarte – die Postkarten." } : { ok: true }) : null,
    zurueckgeben: (T) => / (buch|bücher) /.test(T) && /(zurück|abgeben|abgebe|bringe)/.test(T) ? { ok: true, antwort: "„Danke! Hat es Ihnen gefallen?“" } : null,
    arzt: (T) => {
      if (!/ (kopf|kopfschmerzen|kopfweh|schmerzen|weh) /.test(T)) return null;
      if (/ ich tut /.test(T)) return { fehler: "Bei „wehtun“ steht die Person im Dativ: Mir tut der Kopf weh." };
      if (/ tun (der|mein) kopf /.test(T)) return { fehler: "Der Kopf – eins, also: Mir tut der Kopf weh." };
      return { ok: true, antwort: "„Oh, das tut mir leid. Seit wann haben Sie die Schmerzen?“" };
    },
    vorstellen: (T) => {
      if (!/ (heiße|heiß|name|bin|komme) /.test(T)) return null;
      if (/ habe \w+ jahre /.test(T)) return { fehler: "Im Deutschen „ist“ man so alt: Ich bin acht Jahre alt." };
      if (/ jahren alt /.test(T)) return { fehler: "Es heißt „acht Jahre alt“ – ohne n." };
      return { ok: true };
    },
    geburtstag: (T) => {
      if (/ guten geburtstag /.test(T)) return { fehler: "So sagt man das nicht. Richtig ist: „Alles Gute zum Geburtstag!“" };
      if (/ alles gut zum /.test(T)) return { fehler: "Es heißt „Alles Gute“ – mit e." };
      return /(geburtstag|gratuliere|glückwunsch|alles gute|happy birthday)/.test(T) ? { ok: true } : null;
    },
    hund: (T, qu) => {
      const z = qu.ziel, nm = fw(z.name).trim();
      if (!/ (hund|bello|er|sitzt|ist) /.test(T) || T.indexOf(nm) < 0) return null;
      const gut = z.g === "die" ? new RegExp(" (der|deiner|bei der|an der|vor der|neben der|hinter der) (\\w+ )?" + nm) : new RegExp(" (dem|beim|am|im|vom) (\\w+ )?" + nm);
      return gut.test(T) ? { ok: true } : { fehler: "„Wo?“ braucht den Dativ: vor " + dat(z) + "." };
    },
    schirm: (T) => / (\d+|euro|kostet|kosten|\w+zig|fünf|zehn|drei|vier|sechs|sieben|acht|neun|zwei|eins) /.test(T) ? (/ (sie|es) kostet /.test(T) ? { fehler: "der Regenschirm – also „er kostet …“." } : { ok: true }) : null,
    mehl: (T) => / mehl / .test(T) ? (/ kilos /.test(T) ? { fehler: "Maßangaben bleiben ohne Plural: zwei Kilo." } : / mehls /.test(T) ? { fehler: "Nach der Menge folgt das Wort einfach so: zwei Kilo Mehl." } : { ok: true }) : null,
    schluessel: (T) => / (schlüssel|er|liegt) /.test(T) && / (tisch|liegt|da|dort|drüben|hier|vor) /.test(T) ? (/ auf (den|der) tisch /.test(T) ? { fehler: "Wo? → Dativ: auf dem Tisch." } : { ok: true }) : null,
    perfekt_kino: (T) => / (bin|bist|ist|sind|habe|hab|hast|hat|haben|war|waren) /.test(T) && (/ ge\w+(t|en) /.test(T) || / (war|waren) /.test(T)) ? { ok: true } : null,
    modal_brunnen: (T) => / (nicht|kein|keine|nein|halt|stopp) /.test(T) && /(brunnen|klettern|klettere|kletterst|rein|hinein|wasser)/.test(T) ? { ok: true } : null,
    plural_aepfel: (T) => / (äpfel|apfel|äpfeln|apfels) /.test(T) ? (/ \w+ äpfeln /.test(T) && !/ (den|mit|von) äpfeln /.test(T) ? { fehler: "Das -n kommt nur im Dativ dazu (mit den Äpfeln). Hier: drei Äpfel." } : { ok: true }) : null,
    steigerung: (T, qu) => {
      if (/ (hoher|mehr hoch) /.test(T)) return { fehler: "„hoch“ ist besonders: hoch – höher – am höchsten." };
      if (!/ (höher|größer|am höchsten|kleiner|niedriger) /.test(T)) return null;
      const nm = fw(qu.ziel.name).trim(), iz = T.indexOf(nm), ir = T.indexOf("rathaus"), komp = T.search(/ (höher|größer|am höchsten) /), klein = T.search(/ (kleiner|niedriger) /);
      const recht = komp >= 0 ? (iz >= 0 && (ir < 0 || iz < ir || (ir < komp && iz < komp && iz < ir))) : (ir >= 0 && klein >= 0 && ir < klein);
      return recht ? { ok: true } : { fehlt: "Schau noch einmal: " + Nom(qu.ziel) + " ist höher als das Rathaus." };
    },
    zug_an: (T) => {
      if (/ wann der zug kommt /.test(T)) return { fehler: "Bei einer W-Frage steht das Verb an zweiter Stelle: Wann kommt der Zug an?" };
      if (/ kommt an der /.test(T)) return { fehler: "„an“ gehört zu „ankommen“ und steht ganz am Ende: Wann kommt der Zug an?" };
      return / (wann|verspätung|wie lange|wie spät|wie viel) /.test(T) && / (zug|kommt|ankommt|fährt) /.test(T) ? { ok: true, antwort: "„Der Zug kommt etwa zehn Minuten später.“" } : null;
    },
    artikel_ort: (T, qu) => {
      const nm = fw(qu.ziel.name).trim(), m = new RegExp(" (der|die|das) " + nm).exec(T);
      if (!m) return null;
      return m[1] === qu.ziel.g ? { ok: true } : { fehler: "Es heißt „" + nom(qu.ziel) + "“." };
    },
    preis: (T) => {
      if (/ euros /.test(T)) return { fehler: "„Euro“ bleibt im Plural ohne s: sieben Euro." };
      if (/ komma /.test(T)) return { fehler: "Bei Preisen sagt man die Euro und dann die Cent: sieben Euro fünfzig." };
      return / (sieben|7) /.test(T) && / (fünfzig|50) /.test(T) ? { ok: true } : null;
    }
  };
  /* FASSUNG 875 — die neuen Missionen bringen ihre Prüfung selbst mit (v.pruefe); „falsch“ = stimmt nicht für deine Stadt
     (oder die Ironie nicht verstanden): 0 Punkte und ein Versuch, wie eine falsche Antwort */
  function freiPruefen(qu, t) {
    const f = FREI[qu.v.id] || qu.v.pruefe; if (!f) return null;
    const T = fw(t), r = f(T, qu, String(t || "").trim()); if (!r) return null;
    if (r.fehlt) return { stufe: 0, text: t, grund: r.fehlt, frei: true, ohneVersuch: true };
    if (r.falsch) return { stufe: 0, text: t, grund: r.falsch, frei: true };
    const fehler = r.fehler || grammatikPruefen(T, t);
    if (fehler) return { stufe: 0.5, text: t, grund: fehler, frei: true };
    return { stufe: 1, text: t, grund: "So kann man das sagen – gut gemacht!", frei: true, antwort: r.antwort };
  }
  Q.freiPruefen = freiPruefen; Q.grammatikPruefen = (t) => grammatikPruefen(fw(t), t);

  /* ---------- Prüfen ---------- */
  const klein = (s) => String(s || "").toLowerCase().replace(/ß/g, "ss").replace(/[„“"'.,!?;:–—-]/g, " ").replace(/\s+/g, " ").trim();
  /* Richtungswörter in der Reihenfolge des Satzes */
  function richtungen(t) {
    const w = klein(t).replace(/grade ?aus|gerade aus/g, "geradeaus").split(" "), aus = [];
    for (let i = 0; i < w.length; i++) {
      const a = w[i];
      if ((a === "halb" || a === "schräg" || a === "schraeg") && /^(links|rechts|linke|rechte)/.test(w[i + 1] || "")) { aus.push({ k: "halb " + (/^link/.test(w[i + 1]) ? "links" : "rechts"), i: i }); i++; continue; }
      if (/^(links|linke[nrs]?)$/.test(a)) aus.push({ k: "links", i: i });
      else if (/^(rechts|rechte[nrs]?)$/.test(a)) aus.push({ k: "rechts", i: i });
      else if (a === "geradeaus") aus.push({ k: "geradeaus", i: i });
      else if (a === "zurück" || a === "zurueck" || a === "umdrehen") aus.push({ k: "zurueck", i: i });
    }
    return { worte: w, r: aus };
  }
  /* sind das ganze Sätze? (ein Verb in einer passenden Form und genug Wörter) */
  const VERB = /\b(gehen|gehst|geh|gehe|geht|biegen|biegst|bieg|biege|laufen|läufst|laeufst|lauf|laufe|fahren|fährst|faehrst|nehmen|nimm|nimmst|ist|sind|liegt|befindet|findest|finden|siehst|sehen|kommst|kommen|folgen|folge|folgst|überqueren|ueberqueren|abbiegen)\b/;
  const ganzerSatz = (t) => { const k = klein(t); return VERB.test(k) && k.split(" ").length >= 4; };
  /* Wegbeschreibung auf dem Netz nachgehen: welche Lesarten der Richtungswörter führen ans Ziel? */
  function wegPruefen(qu, text) {
    const R = richtungen(text).r.map((x) => x.k), n = netz(), weiter = qu.route.R[1], kand = [];
    if (!R.length) return null;
    /* Lesarten: wie gesagt; ohne das „geradeaus bis zur Kreuzung" am Anfang; ohne das letzte Wort (Seite am Ziel) */
    const ohneAnf = R[0] === "geradeaus" ? R.slice(1) : R;
    for (const v of [R, ohneAnf, R.slice(0, -1), ohneAnf.slice(0, -1)]) {
      const k = v.filter((x) => x !== "zurueck");
      if (k.length && !kand.some((y) => y.join() === k.join())) kand.push(k);
    }
    for (const k of kand) { const sim = folgen(qu.an, qu.s, weiter, k); if (sim.ok) return { ok: true, klassen: k }; }
    /* keine führt hin: die wörtlichste zeigen (rote Linie, wohin sie führt) */
    const k = kand[1] || kand[0], sim = folgen(qu.an, qu.s, weiter, k);
    const pts = sim && sim.R ? sim.R.map((i) => n.kn[i].slice()) : null;
    return { ok: false, klassen: k, weg: pts, wo: pts ? wohinGekommen(pts) : null };
  }
  /* Lagebeschreibung: „neben/gegenüber/hinter/vor/bei/in der Nähe" + ein Haus, das wirklich nah am Ziel steht */
  const LAGE = /\b(neben|gegenüber|gegenueber|hinter|vor|bei|nähe|naehe|nahe|zwischen|an)\b/;
  function lagePruefen(qu, text) {
    const k = klein(text); if (!LAGE.test(k)) return null;
    const Z = ziele(), z = qu.ziel; let genannt = null;
    for (const key in Z) { if (key === z.key) continue; const nm = klein(Z[key].name); if (nm && k.indexOf(nm) >= 0) { genannt = Z[key]; break; } }
    if (!genannt) return null;
    const d = Math.hypot(genannt.x - z.x, genannt.y - z.y);
    const naechste = Object.values(Z).filter((y) => y.key !== z.key).map((y) => Math.hypot(y.x - z.x, y.y - z.y)).sort((a, b) => a - b);
    const nah = d <= Math.max(38, (naechste[2] || 38) + 4);
    return { ok: nah, genannt: genannt, abstand: Math.round(d) };
  }
  /* Wörter-Übereinstimmung (Dice) */
  function aehnlich(a, b) {
    const A = klein(a).split(" ").filter((x) => x.length > 1), B = klein(b).split(" ").filter((x) => x.length > 1);
    if (!A.length || !B.length) return 0;
    const rest = B.slice(); let g = 0;
    for (const x of A) { const i = rest.indexOf(x); if (i >= 0) { g++; rest.splice(i, 1); } }
    return 2 * g / (A.length + B.length);
  }
  const ohneHtml = (h) => String(h || "").replace(/<[^>]+>/g, "");
  const vonDat = (z) => (z.g === "die" ? "von der " : "vom ") + z.name;   // vom Rathaus, von der Bäckerei
  /* Ergebnis: { stufe: 1 (ganz) | 0.5 (in etwa) | 0 (falsch) | -1 (nicht verstanden), text, grund, weg, i } */
  SPR.pruefen = function (qu, lesarten) {
    lesarten = (lesarten || []).filter(Boolean);
    if (!lesarten.length) return { stufe: -1, text: "", grund: "Ich habe dich nicht verstanden. Sprich noch einmal – etwas lauter." };
    let bestes = null;
    const bewerte = (t) => {
      let e;
      if (qu.v.richtung) {
        const w = wegPruefen(qu, t), l = lagePruefen(qu, t);
        if (w && w.ok) e = { stufe: ganzerSatz(t) ? 1 : 0.5, text: t, grund: ganzerSatz(t) ? "Genau so kommt " + (qu.v.person.er ? "er" : "sie") + " hin!" : "Die Richtung stimmt – als ganzer Satz gäbe es alle Punkte." };
        else if (l && l.ok) e = { stufe: ganzerSatz(t) ? 1 : 0.5, text: t, grund: "Stimmt – " + nom(qu.ziel) + " ist ganz nah " + (l.genannt.g === "die" ? "bei der " : "beim ") + l.genannt.name + "." };
        else if (w && !w.ok) e = { stufe: 0, text: t, weg: w.weg, grund: (w.wo && w.wo.key !== qu.ziel.key ? "Hm – so käme " + (qu.v.person.er ? "er" : "sie") + " " + zum(w.wo) + ", nicht " + zum(qu.ziel) + "." : "Hm – so würde " + (qu.v.person.er ? "er" : "sie") + " sich verlaufen.") + " Links und rechts gelten in der Laufrichtung." };
        else if (l && !l.ok) e = { stufe: 0, text: t, grund: Nom(l.genannt) + " ist zu weit weg " + vonDat(qu.ziel) + "." };
        else e = { stufe: 0, text: t, grund: "Sag, wie " + (qu.v.person.er ? "er" : "sie") + " gehen soll: geradeaus, links, rechts … oder wo " + nom(qu.ziel) + " ist (neben …)." };
      } else {
        let bi = -1, bs = 0, bR = 0, bF = 0;
        qu.antworten.forEach((a, i) => { const s = aehnlich(t, ohneHtml(a.html)); if (s > bs) { bs = s; bi = i; } if (a.richtig) bR = Math.max(bR, s); else bF = Math.max(bF, s); });
        const a = qu.antworten[bi];
        /* FASSUNG 836 — liegen die beste richtige und die beste falsche Antwort gleichauf (weniger als 0,1 auseinander),
           entschied bisher die Reihenfolge der Knöpfe. Jetzt: kein Urteil, kein Versuch weg – noch einmal sagen
           (die Lexical-Lesart entscheidet meist schon vorher). */
        const knapp = bR >= 0.45 && bF >= 0.45 && Math.abs(bR - bF) < 0.1;
        /* (830: die freie Prüfung entscheidet, wo es sie gibt – „Eine Fahrkarte, bitte.“ ähnelt dem Vorschlag, sagt aber nicht wohin;
           nur der Vorschlag selbst, Wort für Wort, zählt ohne sie) */
        const genau = a && a.richtig && klein(t) === klein(ohneHtml(a.html)), fr = !genau && freiPruefen(qu, t);
        /* FASSUNG 875 — Sicherung: klingt der Satz wie ein falscher Vorschlag (fast Wort für Wort) und hält ihn die freie
           Prüfung trotzdem für richtig, gilt der Hinweis des Vorschlags */
        const wieFalsch = a && !a.richtig && bs >= 0.92 && bs - bR >= 0.08;
        if (genau) e = { stufe: 1, text: t, i: bi, grund: "Genau richtig!" };
        else if (fr && fr.stufe === 1 && wieFalsch) e = { stufe: 0, text: t, i: bi, weg: a.weg, grund: a.hinweis || "Hm, das stimmt noch nicht." };
        else if (fr) e = fr;
        else if (knapp) e = { stufe: 0, text: t, ohneVersuch: true, unsicher: true, grund: "Das habe ich nicht sicher verstanden – sag es bitte noch einmal, etwas deutlicher." };
        else if (a && a.richtig && bs >= 0.75) e = { stufe: 1, text: t, i: bi, grund: "Genau richtig!" };
        else if (a && a.richtig && bs >= 0.45) e = { stufe: 0.5, text: t, i: bi, grund: "In etwa richtig – genau hieße es: „" + ohneHtml(a.html) + "“" };
        else if (a && !a.richtig && bs >= 0.45) e = { stufe: 0, text: t, i: bi, weg: a.weg, grund: a.hinweis || "Hm, das stimmt noch nicht." };
        else e = { stufe: 0, text: t, ohneVersuch: true, grund: "Das passt noch nicht zur Aufgabe. " + (qu.v.frei || "Sag es in einem ganzen Satz – mit deinen eigenen Worten.") };
      }
      return e;
    };
    for (const t of lesarten) {
      const e = bewerte(t);
      /* (836: eine eindeutige Lesart schlägt eine unsichere gleicher Stufe – sagt die Lexical-Fassung klar „zwei", zählt das) */
      if (!bestes || e.stufe > bestes.stufe || (e.stufe === bestes.stufe && bestes.unsicher && !e.ohneVersuch)) bestes = e;
      if (bestes.stufe === 1) break;
    }
    /* FASSUNG 875 — reicht keine Lesart, werden verhörte Schlüsselwörter auf die Wortliste der Mission gezogen (anpassen).
       Eine angepasste Lesart zählt nur, wenn sie wirklich besser ist; Endungen, Umlaute und Verbformen fasst sie nie an –
       ein „Fast“ für einen echten Grammatikfehler bleibt also ein „Fast“. */
    if (bestes.stufe < 1) {
      const liste = wortliste(qu), gesehen = new Set(lesarten);
      for (const t of lesarten) {
        const neu = anpassen(t, liste); if (!neu || gesehen.has(neu)) continue; gesehen.add(neu);
        const e = bewerte(neu); e.angepasst = t;
        if (e.stufe > bestes.stufe) bestes = e;
        if (bestes.stufe === 1) break;
      }
    }
    return bestes;
  };

  /* ---------- FASSUNG 875 — Wortliste und Lautähnlichkeit ----------
     Wortliste je Mission: was die Mission selbst nennt (v.woerter), das Ziel, die Stadt im Text, der Name der eigenen
     Stadt, bei Wegbeschreibungen die Häuser der Stadt und die Richtungswörter – dazu die Nomen der richtigen Antwort,
     aber nur die, die NICHT über richtig und falsch entscheiden: steht in einer falschen Antwort eine Abwandlung
     („Fische“ – „Fisch“, „Fischen“; „fährt“ – „fahrt“; „anmelden“ – „melden … an“), bleibt das Wort draußen. Eine Phrase
     List mit „Fische“ würde Azure sonst dazu bringen, aus einem gesprochenen „Fisch“ ein „Fische“ zu machen – und der
     Fehler, um den es geht, wäre unsichtbar. */
  const STOPP = new Set(("aber alle allem allen aller alles als also am an auch auf aus bei beim bin bis bist bitte da dabei damit dann darum das dass dein deine dem den denn der des dich die dies " +
    "diese diesem diesen dieser dieses dir doch dort du durch ein eine einem einen einer eines er es etwa euch euer für gern gerne gibt habe haben hast hat hatte hier ich ihm ihn ihnen ihr " +
    "ihre ihrem ihren ihrer im immer in ins ist ja jetzt kann kein keine keinen man mehr mein meine meinem meinen mich mir mit muss nach nein nicht noch nun nur ob oder ohne schon sehr sein " +
    "seine sich sie sind so soll über um und uns unser unsere vom von vor war was weil wenn wer wie wieder wir wird wo zu zum zur zwar heute gestern morgen danke hallo genau gut ganz viel " +
    "viele wirklich vielleicht leider natürlich klar okay gleich lieber besser einmal noch").split(" "));
  const umlautfrei = (x) => x.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
  /* ist b eine Abwandlung von a (gleicher Anfang, Endung, Umlaut)? */
  const abwandlung = (a, b) => { const A = umlautfrei(a), B = umlautfrei(b); if (A === B) return true; if (A.length < 4 || B.length < 4) return false; return A.slice(0, 4) === B.slice(0, 4) || A.endsWith(B) || B.endsWith(A); };
  function wortliste(qu) {
    const aus = [], v = qu.v, dazu = (w) => { w = String(w || "").trim(); if (w.length >= 3 && aus.indexOf(w) < 0) aus.push(w); };
    const r = (qu.antworten || []).find((a) => a.richtig), falsch = (qu.antworten || []).filter((a) => !a.richtig).map((a) => klein(ohneHtml(a.html)).split(" "));
    const rw = r ? klein(ohneHtml(r.html)).split(" ") : [];
    /* entscheidet dieses Wort zwischen richtig und falsch? (es steht in der richtigen Antwort; eine falsche hat statt seiner eine Abwandlung) */
    const strittig = (w) => { const k = klein(w); if (rw.indexOf(k) < 0 && !k.split(" ").some((x) => rw.indexOf(x) >= 0)) return false;
      return falsch.some((f) => f.indexOf(k) < 0 && f.some((x) => x !== k && abwandlung(x, k))); };
    try { if (v.woerter) (typeof v.woerter === "function" ? v.woerter(qu.ziel, qu.vars || {}) : v.woerter).forEach((w) => { if (!strittig(w)) dazu(w); }); } catch (e) {}
    if (qu.ziel && qu.ziel.name) dazu(qu.ziel.name);
    if (qu.vars && qu.vars.stadt && String(qu.text || "").indexOf(qu.vars.stadt) >= 0) dazu(qu.vars.stadt);
    const S = stadtStand(); if (S.name && String(qu.text || "").indexOf(S.name) >= 0) dazu(S.name);
    if (v.richtung) { for (const k of S.ziel) if (NAMEN[k]) dazu(NAMEN[k][1]); ["links", "rechts", "geradeaus", "Kreuzung", "Brücke"].forEach(dazu); }
    else if (r) {
      /* (am Satzanfang steht alles groß – „Meiner“, „Obwohl“, „Könnten“ sind keine Schlüsselwörter) */
      const ws = ohneHtml(r.html).replace(/[„“‚‘"'()]/g, " ").replace(/([.!?;:–—])/g, " $1 ").replace(/,/g, " ").split(/\s+/).filter(Boolean);
      ws.forEach((w, i) => { if (i === 0 || /^[.!?;:–—]$/.test(ws[i - 1]) || /^[.!?;:–—]$/.test(w)) return; if (/^[A-ZÄÖÜ]/.test(w) && w.length >= 4 && !STOPP.has(w.toLowerCase()) && !FINIT.has(w.toLowerCase()) && !strittig(w)) dazu(w); });
    }
    return aus.slice(0, 60);
  }
  /* Kölner Phonetik (Postel 1969): gleich klingende deutsche Wörter bekommen denselben Code (Meier/Mayer → 67) */
  function koelner(w) {
    w = umlautfrei(String(w || "")).replace(/ph/g, "f").replace(/[^a-z]/g, "");
    let c = "";
    for (let i = 0; i < w.length; i++) {
      const x = w[i], v = w[i - 1] || "", n = w[i + 1] || "";
      if ("aeijouy".indexOf(x) >= 0) c += "0";
      else if (x === "b") c += "1";
      else if (x === "p") c += n === "h" ? "3" : "1";
      else if (x === "d" || x === "t") c += "csz".indexOf(n) >= 0 && n ? "8" : "2";
      else if ("fvw".indexOf(x) >= 0) c += "3";
      else if ("gkq".indexOf(x) >= 0) c += "4";
      else if (x === "c") c += i === 0 ? ("ahkloqrux".indexOf(n) >= 0 && n ? "4" : "8") : ("sz".indexOf(v) >= 0 && v ? "8" : "ahkoqux".indexOf(n) >= 0 && n ? "4" : "8");
      else if (x === "x") c += "ckq".indexOf(v) >= 0 && v ? "8" : "48";
      else if (x === "l") c += "5";
      else if (x === "m" || x === "n") c += "6";
      else if (x === "r") c += "7";
      else if (x === "s" || x === "z") c += "8";
    }
    let o = ""; for (const ch of c) if (ch !== o[o.length - 1]) o += ch;
    return o ? o[0] + o.slice(1).replace(/0/g, "") : "";
  }
  function lev(a, b) {
    if (a === b) return 0; const m = a.length, n = b.length; if (!m || !n) return m || n;
    let p = Array.from({ length: n + 1 }, (x, j) => j);
    for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
    return p[n];
  }
  /* Endung oder Umlaut – das ist Grammatik, keine Verhörung („Kilo“/„Kilos“, „Apfel“/„Äpfel“, „möchte“/„möchten“) */
  const nurEndung = (a, b) => { const A = umlautfrei(a), B = umlautfrei(b); if (A === B) return true;
    return ["e", "n", "en", "s", "es", "er", "em", "ern", "st", "t", "te", "ten"].some((x) => A === B + x || B === A + x); };
  /* verhörte Wörter auf die Wortliste ziehen: zusammengezogen („Neu Schwan Stein“ → Neuschwanstein, „Rad aus“ → Rathaus)
     oder einzeln, wenn Klang (Kölner Phonetik) und Schreibung nah sind („Labo“ → Labor). Nie Funktionswörter, nie Verbformen. */
  function anpassen(text, liste) {
    const kw = [];
    for (const p of liste || []) for (const w of String(p).split(/\s+/)) { const l = w.toLowerCase().replace(/[^a-zäöüß]/g, ""); if (l.length >= 4 && !STOPP.has(l) && !kw.some((x) => x.l === l)) kw.push({ w: w.replace(/[^A-Za-zÄÖÜäöüß]/g, ""), l: l, k: koelner(l) }); }
    if (!kw.length) return null;
    const roh = String(text || "").split(/\s+/).filter(Boolean), kern = (x) => x.toLowerCase().replace(/[^a-zäöüß]/g, ""), zeichen = (x) => (/[.,!?;:]+$/.exec(x) || [""])[0];
    const aus = []; let anders = false;
    for (let i = 0; i < roh.length; i++) {
      let fertig = false;
      for (const n of [3, 2]) {
        if (i + n > roh.length) continue;
        const teile = roh.slice(i, i + n).map(kern); if (teile.some((x) => !x)) continue;
        const j = teile.join(""); if (j.length < 6) continue;
        const t = kw.find((x) => x.l.length >= 6 && (x.l === j || (koelner(j) === x.k && lev(j, x.l) <= Math.max(2, Math.floor(x.l.length / 4)))));
        if (t && teile.indexOf(t.l) < 0) { aus.push(t.w + zeichen(roh[i + n - 1])); i += n - 1; fertig = true; anders = true; break; }
      }
      if (fertig) continue;
      const w = roh[i], l = kern(w);
      if (l.length >= 4 && !STOPP.has(l) && !FINIT.has(l) && !kw.some((x) => x.l === l)) {
        const k = koelner(l);
        const t = kw.find((x) => !nurEndung(l, x.l) && Math.abs(x.l.length - l.length) <= 2 &&
          ((x.l.length >= 5 && lev(l, x.l) <= Math.max(1, Math.floor(x.l.length / 5))) || (x.k === k && lev(l, x.l) <= Math.max(2, Math.floor(x.l.length / 3)))));
        if (t) { aus.push(t.w + zeichen(w)); anders = true; continue; }
      }
      aus.push(w);
    }
    return anders ? aus.join(" ") : null;
  }
  SPR.anpassen = anpassen; SPR.koelner = koelner;

  /* =====================================================================
     12. FÜR DIE SONDE (werkzeug/pruefe-832-quests.js)
     ===================================================================== */
  Q.pruef = {
    tempo: () => TEMPO,   // FASSUNG 846
    tipp: (id) => { const qu = Q.liste.find((x) => x.id === id); if (qu) zeichenTipp(qu); return !!qu; },   // FASSUNG 827
    netz: () => { const n = netz(); let k = 0; for (const l of n.nb) k += l.length; return { knoten: n.kn.length, kanten: k / 2, kreuzungen: n.cls.length }; },
    komponenten: () => { const n = netz(), komp = new Array(n.kn.length).fill(-1); let nk = 0; for (let s = 0; s < n.kn.length; s++) { if (komp[s] >= 0) continue; const st = [s]; komp[s] = nk; while (st.length) { const u = st.pop(); for (const v of n.nb[u]) if (komp[v] < 0) { komp[v] = nk; st.push(v); } } nk++; } return nk; },
    ziele: () => { const Z = ziele(), n = netz(); let markt = 0, md = Infinity; n.kn.forEach((p, i) => { const d = Math.hypot(p[0] + 1, p[1] + 1); if (d < md) { md = d; markt = i; } });
      return Object.keys(Z).map((k) => { const z = Z[k], an = anschluss(z); const r = an && isFinite(an.dist[markt]) ? route(an, markt) : null;
        return { key: k, name: z.name, x: +z.x.toFixed(2), y: +z.y.toFixed(2), tuer: z.tuer.map((v) => +v.toFixed(2)), abst: an ? +an.abst.toFixed(2) : null, laenge: r ? +r.laenge.toFixed(1) : null, pts: r ? r.pts : null, fuss: z.o ? z.o.fuss : null, dreh: z.o ? z.o.dreh : null }; }); },
    /* Beschreibung und Probe für ein Ziel: Route, Klassen, Text, Nachlaufen der richtigen und der falschen */
    kreuzungen: (key, xy) => { const Z = ziele(), an = anschluss(Z[key]), n = netz(); let s = 0, d0 = Infinity; n.kn.forEach((p, i) => { const d = Math.hypot(p[0] - xy[0], p[1] - xy[1]); if (d < d0) { d0 = d; s = i; } });
      const r = route(an, s); if (!r) return null;
      return r.schritte.map((x) => ({ k: x.k, w: +x.w.toFixed(0), eindeutig: x.eindeutig, bei: [+n.cls[x.c].x.toFixed(1), +n.cls[x.c].y.toFixed(1)], glieder: n.cls[x.c].glieder.length, ab: abzweige(x.c, [r.R[x.i], r.R[x.i - 1]]).map((a) => [+a.w.toFixed(0), a.k, fein(a.w)]) })); },
    gruende: (key) => { Q._gruende = {}; const Z = ziele(), an = anschluss(Z[key]); const rr = an && richtungsRoute(an, netz(), []); const g = Q._gruende; Q._gruende = null; return { ok: !!rr, g: g }; },
    richtung: (key) => { const Z = ziele(), z = Z[key]; if (!z) return null; const an = anschluss(z), n = netz(); const rr = richtungsRoute(an, n, []); if (!rr) return null;
      const r = rr.r; return { start: n.kn[rr.s], pts: r.pts, R: r.R.map((i) => n.kn[i]), schritte: r.schritte.map((x) => ({ k: x.k, w: +x.w.toFixed(1), eindeutig: x.eindeutig, i: x.i, j: x.j, kreuzung: [n.cls[x.c].x, n.cls[x.c].y], bruecke: x.bruecke })),
        ende: r.ende, text: wegText(r.schritte, r.ende, z, r.brueckeZuletzt), tuer: z.tuer, A: an.A, richtigNach: folgen(an, rr.s, r.R[1], r.schritte.map((x) => x.k)).ok,
        falsch: rr.falsch.map((f) => ({ text: f.text, klassen: f.klassen, ok: f.sim.ok, ende: n.kn[f.sim.R[f.sim.R.length - 1]] })) }; },
    neu: (id, opt) => { const qu = questNeu(id, Object.assign({ zwingen: true }, opt || {})); return qu ? qu.id : null; },
    zustand: () => Q.liste.map((qu) => ({ id: qu.id, vorlage: qu.v.id, ziel: qu.ziel.key, zustand: qu.f.zustand, x: qu.f.x, y: qu.f.y, s: qu.f.s, weglaenge: qu.weg.len, weg: qu.weg.pts, versuche: qu.versuche,
      antworten: qu.antworten.map((a) => ({ richtig: !!a.richtig, text: a.html.replace(/<[^>]+>/g, "") })), zeichen: qu.el ? { art: qu.el.dataset.a, sicht: qu.el.style.display !== "none" } : null, rot: !!(qu.rot && performance.now() < qu.rot.bis), hund: !!qu.hund, wagen: !!qu.wagen, blatt: Q.blattErlaubt })),
    stand: standLesen,
    /* n-mal eine Vorlage wählen (ohne sie zu bauen): wie oft kommt welche Art? */
    waehlen: (n) => { const z = {}; for (let i = 0; i < n; i++) { const v = vorlageWaehlen(); z[v.kat] = (z[v.kat] || 0) + 1; } return z; },
    dialog: () => { if (!dialog) return null; const r = (e) => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
      return { rahmen: r(dialog.el), scrollH: dialog.el.scrollHeight, clientH: dialog.el.clientHeight, text: dialog.el.querySelector(".lq-text").textContent, hinweis: dialog.el.querySelector(".lq-hinweis").textContent,
        knoepfe: Array.from(dialog.el.querySelectorAll("button")).map((b) => Object.assign(r(b), { klasse: b.className, i: b.dataset.i, aus: b.disabled, text: b.textContent, sw: b.scrollWidth, cw: b.clientWidth })) }; },
    meldung: () => Q.letzteMeldung || null,
    /* FASSUNG 875 — Niveau, Stand der Stadt, Auswahl, Wortliste (werkzeug/pruefe-875-quest-niveau.js) */
    niveau: (n) => { if (n) niveauSetzen(n); return niveau(); },
    stadt: () => { const S = stadtStand(true); return { da: Array.from(S.da), ziel: Array.from(S.ziel), bau: S.bau.slice(), haeuser: S.haeuser.size, wunder: S.wunder, name: S.name }; },
    waehlenIds: (n) => { stadtStand(true); const z = {}; for (let i = 0; i < n; i++) { const v = vorlageWaehlen(); z[v.id] = (z[v.id] || 0) + 1; } return z; },
    folge: (n) => { const aus = []; for (let i = 0; i < n; i++) { const v = vorlageWaehlen(); aus.push(v.id); const st = standLesen(); st.letzte = st.letzte.concat([v.id]).slice(-12); standSchreiben(st); } return aus; },
    niveauVon: (id) => { const v = VORLAGEN.find((x) => x.id === id); return v ? v.niveau : null; },
    wortliste: (i) => { const qu = Q.liste.find((x) => x.id === i); return qu ? wortliste(qu) : null; },
    vars: (i) => { const qu = Q.liste.find((x) => x.id === i); return qu ? JSON.parse(JSON.stringify(qu.vars)) : null; },
    schnell: (f) => { Q._schnell = f; },
    aus: (a) => { Q.aus = a; },
    folgen: (key, startXY, klassen) => { const Z = ziele(), an = anschluss(Z[key]), n = netz(); let s = 0, d0 = Infinity; n.kn.forEach((p, i) => { const d = Math.hypot(p[0] - startXY[0], p[1] - startXY[1]); if (d < d0) { d0 = d; s = i; } }); const r = route(an, s); if (!r) return null; const sim = folgen(an, s, r.R[1], klassen); return { ok: sim.ok, ende: n.kn[sim.R[sim.R.length - 1]] }; }
  };
})();
