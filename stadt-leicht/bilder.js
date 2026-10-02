/* =====================================================================
   LEICHTE STADT — BILDER (fertig gemalte Gebäude laden und wählen)
   ---------------------------------------------------------------------
   XANDER: „dass man das weit aufziehen kann. Das ist schön aussieht und
   nicht pixelig und gut fürs Auge die Details zu erkennen sind sowie bei
   dem Spiel Simpsons Tapped Out."

   Jedes Gebäude gibt es in zwei Größen (verzeichnis.json):
     _k  klein  (≈ 18 Bildpunkte je Meter) – Übersicht, lädt schnell
     _g  groß   (≈ 56 Bildpunkte je Meter) – ganz nah, gestochen scharf
     _m  Baustellen (≈ 26 Bildpunkte je Meter)
   Beim Aufziehen wechselt die Stadt unsichtbar vom kleinen zum großen
   Bild; solange das große noch lädt, bleibt das kleine (gestreckt) stehen.
   Geladen wird nur, was im Bild ist – höchstens 6 Bilder gleichzeitig,
   das Nächstliegende zuerst.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const LB = (ST.bilder = {});
  const PFAD = "stadt-leicht/bilder/";
  LB.vz = {};
  const cache = new Map();          // Name → { img, fertig, fehler }
  const warte = [];                 // Namen, die geladen werden sollen
  let laufend = 0;
  const GLEICHZEITIG = 6;
  LB.version = "";
  /* FASSUNG 796 — XANDER: „Emmi aus Ägypten hatte gestern nur eine blaue
     Anzeige und diese Häuser mussten erst mal ewig laden … dass sogar Leute,
     die mit ihrer Verbindung überhaupt nicht spielen können, noch eine
     Variante tiefer gehen können." SPARMODUS: bei „Datensparen", 2G/3G oder
     ?spar=1 nur die kleinen Bilder (nie die großen), kein doppeltes
     Tag-und-Nacht-Bild in der Dämmerung, weniger Leute. */
  /* FASSUNG 805 — XANDER: „die neue Map in der Miniaturansicht fast noch kleiner als unsere alte … damit wir keinen
     Ladebalken haben". Im kleinen Rahmen des Spiels (mini=1) von Anfang an nur kleine Bilder, keine Leute, keine
     Baustellenbilder, kein Tag+Nacht zugleich – das Nötigste für den Überblick. */
  LB.nurKlein = (function () { try { return new URLSearchParams(location.search).get("mini") === "1"; } catch (e) { return false; } })();
  LB.spar = (function () {
    try {
      const q = new URLSearchParams(location.search);
      if (q.get("spar") === "1") return true;
      if (q.get("spar") === "0") return false;
      /* FASSUNG 806 — im Spiel eingebettet immer sparsam (auch im Vollbild): das iPhone warf die Seite sonst aus dem Speicher */
      if (q.get("eingebettet") === "1") return true;
      const gemerkt = localStorage.getItem("leicht_spar");
      if (gemerkt === "1") return true;
      if (gemerkt === "0") return false;
      const c = navigator.connection;
      return !!(c && (c.saveData || /(^|-)2g|3g/.test(c.effectiveType || "")));
    } catch (e) { return false; }
  })();

  /* Im kleinen Verzeichnis tragen nur die Zwergbilder ihre Fensterlichter; die _k-Bilder bekommen sie hochgerechnet.
     FASSUNG 812 — ein _k-Eintrag mit „kz" ist ganz aus seinem Zwerg (_z) hochgerechnet (kz = Bildpunkte je Meter des
     _k-Bilds): das spart ein Viertel des kleinen Verzeichnisses. */
  function kleinAuspacken(j) {
    for (const k in j) {
      const e = j[k], z = (e.lz || e.kz) && j[k.slice(0, -2) + "_z"];
      if (e.kz) {
        if (!z) { delete j[k]; continue; }
        const f = e.kz / z.s, n = { s: e.kz };
        for (const a of ["w", "h", "sw", "sh"]) if (z[a] != null) n[a] = Math.round(z[a] * f);
        for (const a of ["ax", "ay", "sax", "say"]) if (z[a] != null) n[a] = z[a] * f;
        if (z.r) n.r = z.r.map((r) => [r[0] * f, r[1] * f].concat(r.slice(2)));
        if (z.sn) n.sn = z.sn.replace(/_z_s$/, "_k_s");
        n.l = z.l ? z.l.map((l) => [l[0] * f, l[1] * f, l[2] * f].concat(l.slice(3))) : [];
        j[k] = n;
      } else if (e.lz) { const f = z ? e.s / z.s : 1; e.l = z && z.l ? z.l.map((l) => [l[0] * f, l[1] * f, l[2] * f].concat(l.slice(3))) : []; }
    }
    return j;
  }
  LB.laden = function (v) {
    LB.version = v || "";
    /* FASSUNG 805 — im kleinen Rahmen erst das kleine Verzeichnis (nur _z und _k); das große kommt erst im Vollbild. */
    /* FASSUNG 812 — im kleinen Rahmen nur das Verzeichnis der laufenden Jahreszeit (die andere kommt bei Bedarf nach) */
    const jz = LB.kleinJahr = (ST.szene && ST.szene.jahr === "winter") ? "winter" : "herbst";
    const datei = LB.nurKlein ? "verzeichnis-klein-" + jz + ".json" : "verzeichnis.json";
    LB.vzVoll = !LB.nurKlein;
    return fetch(PFAD + datei + (v ? "?v=" + v : "")).then((r) => r.json()).then((j) => {
      /* Im kleinen Verzeichnis tragen nur die Zwergbilder ihre Fensterlichter; die _k-Bilder bekommen sie hochgerechnet. */
      kleinAuspacken(j);
      LB.vz = j; return j;
    });
  };
  /* FASSUNG 812 — wechselt im kleinen Rahmen die Jahreszeit (Vorschau, Schnee), kommt ihr kleines Verzeichnis dazu */
  LB.jahrNachladen = function (jahr) {
    const jz = jahr === "winter" ? "winter" : "herbst";
    if (!LB.nurKlein || LB.vzVoll || !LB.kleinJahr || (LB.kleinJahre || (LB.kleinJahre = {}))[jz] || jz === LB.kleinJahr) return Promise.resolve(LB.vz);
    LB.kleinJahre[jz] = true;
    return fetch(PFAD + "verzeichnis-klein-" + jz + ".json" + (LB.version ? "?v=" + LB.version : "")).then((r) => r.json()).then((j) => {
      kleinAuspacken(j);
      LB.vz = Object.assign({}, j, LB.vz); LB.neu = true; if (ST.leicht) ST.leicht.unruhe = 2; return LB.vz;
    }).catch(() => { LB.kleinJahre[jz] = false; });
  };
  LB.vollLaden = function () {
    if (LB.vzVoll) return Promise.resolve(LB.vz);
    LB.vzVoll = true;
    return fetch(PFAD + "verzeichnis.json" + (LB.version ? "?v=" + LB.version : "")).then((r) => r.json()).then((j) => { LB.vz = Object.assign({}, LB.vz, j); LB.neu = true; return j; }).catch(() => { LB.vzVoll = false; });
  };

  function weiter() {
    while (laufend < GLEICHZEITIG && warte.length) {
      const name = warte.shift();
      const e = cache.get(name);
      if (!e || e.fertig || e.laedt) continue;
      e.laedt = true; laufend++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        const fertig = () => { e.img = img; e.fertig = true; e.laedt = false; laufend--; LB.neu = true; weiter(); };
        if (img.decode) img.decode().then(fertig, fertig); else fertig();
      };
      img.onerror = () => { e.fehler = true; e.fehlerT = Date.now(); e.versuche = (e.versuche || 0) + 1; e.laedt = false; laufend--; weiter(); };
      img.src = PFAD + name + ".webp" + (LB.version ? "?v=" + LB.version : "");
    }
  }
  /* Bild holen (lädt es, wenn nötig); gibt das Bild zurück, sobald es da ist */
  LB.bild = function (name, dringend) {
    let e = cache.get(name);
    if (!e) { e = { img: null, fertig: false }; cache.set(name, e); }
    if (e.fertig) { e.zuletzt = LB.takt; return e.img; }
    /* FASSUNG 836 — XANDER (Funk 263): „Kölner Dom … manchmal weiß in einer bestimmten Zoomstufe oder verschwindet einfach
       komplett". Ein Bild, das einmal nicht kam (Funkloch, Rahmen im Hintergrund), wurde bis zum Neuladen der Seite nie
       wieder geholt – in dieser Zoomstufe fehlte das Haus dann dauerhaft. Jetzt: neuer Versuch nach 4 s, 15 s und 60 s
       (höchstens vier), und sofort, wenn das Netz zurück ist oder die Seite wieder sichtbar wird. */
    if (e.fehler && (e.versuche || 0) < 4 && Date.now() - (e.fehlerT || 0) > [4000, 15000, 60000][Math.min(2, (e.versuche || 1) - 1)]) e.fehler = false;
    if (!e.laedt && !e.fehler && warte.indexOf(name) < 0) { if (dringend) warte.unshift(name); else warte.push(name); weiter(); }
    return null;
  };
  LB.takt = 0;
  const fehlerVergessen = () => { for (const [, e] of cache) if (e.fehler && (e.versuche || 0) < 6) e.fehler = false; LB.neu = true; };
  window.addEventListener("online", fehlerVergessen);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) fehlerVergessen(); });
  /* FASSUNG 836 — (Funk 263, Dom) die beste schon geladene Größe desselben Bildes. LB.wahl lieferte null, sobald die
     gewünschte Größe noch nicht da war – die Szene ließ das Haus dann ganz weg, samt Schatten (beim Hineinzoomen über
     die Schwelle von _z zu _k, gerade beim Dom mit seinen großen Bildern). Jetzt steht so lange die andere Größe da,
     gestreckt oder gestaucht, und die gewünschte wird vorn in die Warteschlange gestellt. */
  const GROESSEN = ["_k", "_g", "_z", "_m", "_n"];
  function ersatz(basis) {
    for (const gr of GROESSEN) { const meta = LB.vz[basis + gr]; if (meta && LB.fertig(basis + gr)) return { name: basis + gr, meta: meta }; }
    return null;
  }
  /* Große Bilder, die lange nicht gebraucht wurden, wieder freigeben
     (Speicher auf dem Telefon) */
  LB.aufraeumen = function () {
    let n = 0;
    for (const [k, e] of cache) if (e.fertig && /_g$/.test(k) && LB.takt - (e.zuletzt || 0) > 900) { cache.delete(k); n++; }
    return n;
  };

  /* Welche Größe? stufe = Maßstab des Objekts (Gebäudestufe 0,82…1,02) */
  LB.wahl = function (basis, s, stufe) {
    const k = LB.vz[basis + "_k"], g = LB.vz[basis + "_g"], m = LB.vz[basis + "_m"];
    /* FASSUNG 807 — Baustelle im kleinen Rahmen: das Zwergbild (_n) der Bauphase */
    const n = LB.nurKlein && LB.vz[basis + "_n"];
    /* FASSUNG 828 — in der zweiten Zoomstufe (große Bilder erlaubt) die schärfere Baustelle (_m), sobald sie geladen ist;
       bis dahin bleibt das Zwergbild stehen (nie ein leerer Platz). */
    if (n && m && LB.grossErlaubt && LB.bild(basis + "_m")) return { name: basis + "_m", meta: m };
    if (n) return { name: basis + "_n", meta: n };
    if (m) return { name: basis + "_m", meta: m };
    /* FASSUNG 805 — im kleinen Rahmen das Zwergbild (_z, 40 %), solange es scharf genug ist (bis 1,35-fach). */
    const z = LB.nurKlein && LB.vz[basis + "_z"];
    if (z && s * (stufe || 1) <= z.s * 1.35) {
      /* FASSUNG 836 — das Zwergbild wurde ohne Ladeprüfung gewählt: fehlte es, malte die Szene kein Haus, aber seine
         Lichter (beim Dom elf Bodenstrahler) – ein heller Fleck ohne Dom. Jetzt bis dahin eine geladene andere Größe. */
      if (LB.bild(basis + "_z", true)) return { name: basis + "_z", meta: z };
      /* (Sonde 857: ist gar keine Größe da, null – dann bleibt beim Drehen die alte Blickrichtung stehen, szene.js _gierDa) */
      return ersatz(basis);
    }
    if (!k && !g) return null;
    const bedarf = s * (stufe || 1);
    /* ab dem 1,6-fachen der kleinen Auflösung lohnt das große Bild
       (FASSUNG 796: vorher 1,3 – dann lud schon die Übersicht große Bilder).
       Erst wenn das kleine da ist, wird das große geholt: so steht das Bild
       sofort und wird danach scharf. Im Sparmodus nie groß. */
    /* FASSUNG 817 — Funk 207: in der zweiten Zoomstufe des kleinen Rahmens dürfen die großen Bilder kommen (LB.grossErlaubt);
       beim Herauszoomen gibt LB.freigeben sie wieder frei. */
    if (g && (!k || (bedarf > k.s * (LB.grossErlaubt ? 1.2 : 1.6) && (LB.grossErlaubt || (!LB.spar && !LB.nurKlein))))) {
      if (LB.fertig(basis + "_g")) return { name: basis + "_g", meta: g, img: LB.bild(basis + "_g") };
      if (k && !LB.bild(basis + "_k", true)) return ersatz(basis);
      LB.bild(basis + "_g");
      if (k) return { name: basis + "_k", meta: k };
      return ersatz(basis);
    }
    if (LB.bild(basis + "_k")) return { name: basis + "_k", meta: k };
    const er = ersatz(basis);
    if (er) LB.bild(basis + "_k", true);
    return er;
  };
  /* FASSUNG 817 — Bilder einer Größe freigeben, die seit ein paar Bildern nicht mehr gezeichnet wurden (Speicher im kleinen
     Rahmen: die großen nach der zweiten Zoomstufe, die kleinen nach dem Zurück in den Überblick). */
  LB.freigeben = function (muster) {
    let n = 0;
    for (const [k, e] of cache) if (e.fertig && muster.test(k) && LB.takt - (e.zuletzt || 0) > 3) { cache.delete(k); n++; }
    for (let i = warte.length - 1; i >= 0; i--) if (muster.test(warte[i])) { cache.delete(warte[i]); warte.splice(i, 1); }
    return n;
  };
  /* wie viele Bilder einer Größe gerade im Speicher liegen (für die Sonde) */
  LB.zahl = function (muster) { let n = 0; for (const [k, e] of cache) if (e.fertig && muster.test(k)) n++; return n; };
  LB.fertig = function (name) { const e = cache.get(name); return !!(e && e.fertig); };
  LB.offen = function () { return warte.length + laufend; };
})();
