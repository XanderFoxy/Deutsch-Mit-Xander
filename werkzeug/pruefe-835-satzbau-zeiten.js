#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 835: SATZBAUKASTEN — ZEITFORMEN, NIVEAUS, MEHRERE SÄTZE
   ---------------------------------------------------------------------
   XANDER (Funk 217, wörtlich): „was ist im Unterschied zwischen den
   einzelnen Niveaus und wenn ich z.B Vergangenheit habe sagte er z.B ich
   bin am Wochenende in den Bergen gewesen warum gibt's da keine
   natürliche Variante wie z.B ich war am Wochenende in den Bergen und
   braucht es dafür eine andere Zeitform können wir das mit einbauen dass
   die Leute gemessen auf ihrem Niveau alle Sachen benutzen können dass
   sie mehrere Sätze bilden können und kommen da jetzt wirklich keine
   Unsinnigkeiten mehr raus“

   A  FORMEN (Node, satzbau.js): jedes Verb hat ein Präteritum, und zwar
      das aus der Tabelle hier (von Hand nach Duden geschrieben, NICHT aus
      der Engine abgeleitet): 3. Person, du, ihr — ging, gingst, gingt;
      aß, aßest, aßt … Dazu jedes Partizip, das Hilfsverb (sein bei
      Bewegung/Zustandswechsel) und die Modalverben.
   B  MASSENPROBE (Node): für jedes Niveau × jede freigeschaltete Zeitform
      × jede Satzart (Aussage, Frage, Nebensatz mit jedem Bindewort) ×
      zufällige Bereiche viele tausend Zufallssätze — gebaut wie in der
      Oberfläche (dieselben Auswahl-Funktionen). Geprüft: Verbstellung,
      Satzklammer, Kasus nach Präposition (Dativ/Akkusativ, wo/wohin),
      Artikel und Genus des Objekts, Hilfsverb sein/haben, Partizip,
      Präteritum-Form, Verb am Ende im Nebensatz, doppelte Wörter,
      Groß-/Kleinschreibung, Satzzeichen, Zeitangabe zur Zeitform, Sinn
      (Objekt/Ort/Grund/Modalverb aus den Sinn-Listen, keine Pflicht mit
      „gern“, kein Passiv mit Person).
   C  NATÜRLICHE VERGANGENHEIT: sein/haben/Modalverben → Präteritum vorn,
      Perfekt als Variante mit Erklärung; andere Verben → Perfekt vorn,
      Präteritum als Variante erst ab B1.
   D  NIVEAUS: A1 ohne Futur/Nebensatz, A2 mit Futur/weil/dass/wenn, B1
      mit Plusquamperfekt/Konjunktiv II/obwohl/damit, B2 mit Passiv,
      Konjunktiv II der Vergangenheit, um … zu.
   E  GESCHICHTEN (Node): 2–3 verbundene Sätze mit und/aber/dann/deshalb/
      weil/obwohl/um … zu — Komma, Großschreibung, Verb am Ende.
   F  OBERFLÄCHE (Chromium, 360 × 740 Finger und 1280 × 800): Niveau-
      Zeile, Vergangenheit mit Variante („Ich war am Wochenende in den
      Bergen.“ + „Ich bin … gewesen.“), Modalverb, „+ zweiter Satz“ mit
      Bindewort, im Deutsch-Raum keine italienische Zeile, keine
      Überlappung, Tippflächen ≥ 30 px, keine waagrechte Rollleiste.
   Beispielsätze fürs Lesen: LESEN=1 druckt 40 je Zeitform.
   NUR=A,B,…  nur diese Teile.  BILD=/pfad/praefix  Bildschirmfotos.
   WURZEL=…   anderer Stand (Gegenprobe).
   Aufruf: node werkzeug/pruefe-835-satzbau-zeiten.js
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const NUR = (process.env.NUR || "A,B,C,D,E,F").split(",");
const LESEN = process.env.LESEN === "1";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

/* Zufall mit Samen — damit ein roter Lauf sich wiederholen lässt. */
let samen = Number(process.env.SAMEN || 835);
const zufall = () => { samen = (samen * 1103515245 + 12345) % 2147483648; return samen / 2147483648; };
const eins = (l) => l[Math.floor(zufall() * l.length)];

global.window = {};
try { require(path.join(WURZEL, "satzbau.js")); } catch (e) { console.log("satzbau.js lädt nicht: " + e.message); }
const S = window.Satzbau || {};
const neu = typeof S.zeitformenFuer === "function";

/* ---------------------------------------------------------------------
   Die Tabellen — von Hand, nach Duden. Präteritum: er/sie/es | du | ihr,
   dann das Partizip II.
   --------------------------------------------------------------------- */
const TAFEL = {
  sein: "war warst wart gewesen", gehen: "ging gingst gingt gegangen", fahren: "fuhr fuhrst fuhrt gefahren",
  kommen: "kam kamst kamt gekommen", wohnen: "wohnte wohntest wohntet gewohnt", arbeiten: "arbeitete arbeitetest arbeitetet gearbeitet",
  essen: "aß aßest aßt gegessen", trinken: "trank trankst trankt getrunken", kochen: "kochte kochtest kochtet gekocht",
  kaufen: "kaufte kauftest kauftet gekauft", lesen: "las lasest last gelesen", schreiben: "schrieb schriebst schriebt geschrieben",
  sehen: "sah sahst saht gesehen", hoeren: "hörte hörtest hörtet gehört", spielen: "spielte spieltest spieltet gespielt",
  lernen: "lernte lerntest lerntet gelernt", sprechen: "sprach sprachst spracht gesprochen", verstehen: "verstand verstandest verstandet verstanden",
  treffen: "traf trafst traft getroffen", helfen: "half halfst halft geholfen", warten: "wartete wartetest wartetet gewartet",
  machen: "machte machtest machtet gemacht", haben: "hatte hattest hattet gehabt", schlafen: "schlief schliefst schlieft geschlafen",
  fragen: "fragte fragtest fragtet gefragt", antworten: "antwortete antwortetest antwortetet geantwortet", suchen: "suchte suchtest suchtet gesucht",
  finden: "fand fandest fandet gefunden", oeffnen: "öffnete öffnetest öffnetet geöffnet", schliessen: "schloss schlossest schlosst geschlossen",
  bringen: "brachte brachtest brachtet gebracht", geben: "gab gabst gabt gegeben", nehmen: "nahm nahmst nahmt genommen",
  bezahlen: "bezahlte bezahltest bezahltet bezahlt", bestellen: "bestellte bestelltest bestelltet bestellt", brauchen: "brauchte brauchtest brauchtet gebraucht",
  bekommen: "bekam bekamst bekamt bekommen", vergessen: "vergaß vergaßest vergaßt vergessen", verlieren: "verlor verlorst verlort verloren",
  benutzen: "benutzte benutztest benutztet benutzt", reparieren: "reparierte repariertest repariertet repariert", waschen: "wusch wuschest wuscht gewaschen",
  putzen: "putzte putztest putztet geputzt", aufraeumen: "räumte räumtest räumtet aufgeräumt", packen: "packte packtest packtet gepackt",
  buchen: "buchte buchtest buchtet gebucht", erklaeren: "erklärte erklärtest erklärtet erklärt", zeigen: "zeigte zeigtest zeigtet gezeigt",
  ueben: "übte übtest übtet geübt", wiederholen: "wiederholte wiederholtest wiederholtet wiederholt", denken: "dachte dachtest dachtet gedacht",
  glauben: "glaubte glaubtest glaubtet geglaubt", wissen: "wusste wusstest wusstet gewusst", moegen: "mochte mochtest mochtet gemocht",
  reisen: "reiste reistest reistet gereist", laufen: "lief liefst lieft gelaufen", fliegen: "flog flogst flogt geflogen",
  tragen: "trug trugst trugt getragen", schenken: "schenkte schenktest schenktet geschenkt", mitbringen: "brachte brachtest brachtet mitgebracht",
  feiern: "feierte feiertest feiertet gefeiert", tanzen: "tanzte tanztest tanztet getanzt", singen: "sang sangst sangt gesungen",
  schwimmen: "schwamm schwammst schwammt geschwommen", wandern: "wanderte wandertest wandertet gewandert", einkaufen: "kaufte kauftest kauftet eingekauft",
  telefonieren: "telefonierte telefoniertest telefoniertet telefoniert", anrufen: "rief riefst rieft angerufen", schicken: "schickte schicktest schicktet geschickt",
  lachen: "lachte lachtest lachtet gelacht", weinen: "weinte weintest weintet geweint", bleiben: "blieb bliebst bliebt geblieben",
  sitzen: "saß saßest saßt gesessen", stehen: "stand standest standet gestanden", liegen: "lag lagst lagt gelegen",
  aufstehen: "stand standest standet aufgestanden", anfangen: "fing fingst fingt angefangen", aufhoeren: "hörte hörtest hörtet aufgehört",
  steigen: "stieg stiegst stiegt gestiegen", besuchen: "besuchte besuchtest besuchtet besucht", erzaehlen: "erzählte erzähltest erzähltet erzählt",
  vorbereiten: "bereitete bereitetest bereitetet vorbereitet",
};
// Bewegung und Zustandswechsel: Perfekt mit „sein“.
const MIT_SEIN = new Set(["sein", "gehen", "fahren", "kommen", "reisen", "laufen", "fliegen", "schwimmen", "wandern", "bleiben", "aufstehen", "steigen"]);
const MODAL_TAFEL = {
  koennen: "kann kannst konnte konntest können", muessen: "muss musst musste musstest müssen", wollen: "will willst wollte wolltest wollen",
  moechten: "möchte möchtest wollte wolltest wollen", duerfen: "darf darfst durfte durftest dürfen", sollen: "soll sollst sollte solltest sollen",
};
const IDX = { "1sg": 0, "2sg": 1, "3sgm": 2, "3sgf": 2, "1pl": 3, "2pl": 4, "3pl": 5 };
function praetErwartet(id, i) {
  const [er, du, ihr] = TAFEL[id].split(" ");
  const pl = er + (/e$/.test(er) ? "n" : "en");
  return [er, du, er, pl, ihr, pl][i];
}
const SEIN_PR = ["bin", "bist", "ist", "sind", "seid", "sind"], HABEN_PR = ["habe", "hast", "hat", "haben", "habt", "haben"];
const SEIN_PT = ["war", "warst", "war", "waren", "wart", "waren"], HABEN_PT = ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"];
const SEIN_K2 = ["wäre", "wärst", "wäre", "wären", "wärt", "wären"], HABEN_K2 = ["hätte", "hättest", "hätte", "hätten", "hättet", "hätten"];

(async () => {
  /* ================================================================ A */
  if (NUR.includes("A")) {
    console.log("\nA · FORMEN: Präteritum, Partizip, Hilfsverb, Modalverben\n");
    const verben = S.VERBEN || [];
    const ohne = verben.filter((v) => !Array.isArray(v.praeteritum) || v.praeteritum.length !== 6);
    sage(verben.length >= 80 && !ohne.length, "jedes der " + verben.length + " Verben hat alle sechs Präteritum-Formen", ohne.slice(0, 6).map((v) => v.id).join(","));
    const falschP = [], falschPart = [], falschHilf = [], unbekannt = [];
    verben.forEach((v) => {
      if (!TAFEL[v.id]) { unbekannt.push(v.id); return; }
      for (let i = 0; i < 6; i++) {
        const soll = praetErwartet(v.id, i), ist = (v.praeteritum || [])[i];
        if (ist !== soll) falschP.push(v.id + "[" + i + "] " + ist + "≠" + soll);
      }
      const part = TAFEL[v.id].split(" ")[3];
      if (v.partizip !== part) falschPart.push(v.id + ": " + v.partizip + "≠" + part);
      if ((v.hilfsverb === "sein") !== MIT_SEIN.has(v.id)) falschHilf.push(v.id + ": " + v.hilfsverb);
    });
    sage(!unbekannt.length, "die Sonde kennt jedes Verb der Engine (keins ungeprüft)", unbekannt.join(","));
    sage(!falschP.length, "jede Präteritum-Form stimmt mit der Duden-Tabelle (ging, lief, aß, las, trank, fuhr, schlief, kam, sah, nahm …)", falschP.slice(0, 6).join(" | "));
    sage(!falschPart.length, "jedes Partizip II stimmt", falschPart.slice(0, 6).join(" | "));
    sage(!falschHilf.length, "Perfekt mit „sein“ genau bei Bewegung/Zustandswechsel (gehen, fahren, bleiben, aufstehen …)", falschHilf.join(" | "));
    const woher = verben.filter((v) => v.deWoherInf === "kommen");
    sage(woher.length && woher.every((v) => (v.deWoherPraeteritum || [])[2] === "kam"), "„woher“-Verben (gehen/fahren → kommen) haben „kam“");
    const mv = S.MODALVERBEN || [];
    const mFalsch = [];
    Object.entries(MODAL_TAFEL).forEach(([id, t]) => {
      const [p1, p2, pt1, pt2, ersatz] = t.split(" ");
      const m = mv.find((x) => x.id === id);
      if (!m) { mFalsch.push(id + " fehlt"); return; }
      if (m.formen[0] !== p1 || m.formen[1] !== p2 || m.praeteritum[2] !== pt1 || m.praeteritum[1] !== pt2 || m.ersatz !== ersatz) mFalsch.push(id);
    });
    sage(mv.length === 6 && !mFalsch.length, "Modalverben können, müssen, wollen, möchten, dürfen, sollen mit Präsens, Präteritum und Ersatzinfinitiv", mFalsch.join(","));
  }

  /* ================================================================ B */
  const beispiele = {};                 // zeitform → [Sätze]
  if (NUR.includes("B")) {
    console.log("\nB · MASSENPROBE (Zufallssätze wie in der Oberfläche)\n");
    if (!neu) { sage(false, "die Engine kennt Zeitformen je Niveau (zeitformenFuer)"); }
    else {
      const NIV = ["A1", "A2", "B1", "B2", "C1", "C2"];
      const KAT = [null].concat((S.KATEGORIEN || []).map((k) => k.id));
      const probleme = {};
      const melde = (art, satz, w) => { (probleme[art] = probleme[art] || []).push(satz + "   [" + w.verb.id + (w.modal ? "+" + w.modal.id : "") + (w.passiv ? "+passiv" : "") + ", " + w.zeitform + ", " + w.satzart + (w.konjunktion ? "/" + w.konjunktion : "") + ", " + w.niveau + "]"); };
      const nomenGross = new Set();
      (S.DINGE || []).concat(S.ORTE || []).forEach((d) => String(d.nomen || "").split(/\s+/).forEach((x) => { if (/^[A-ZÄÖÜ]/.test(x) && x.length > 3) nomenGross.add(x.toLowerCase()); }));
      // Verbformen sind keine Nomen: „ich frage“ gegen „die Frage“.
      const verbInf = new Set((S.VERBEN || []).flatMap((v) => [v.inf].concat(v.formen || [], v.praeteritum || [], [v.partizip]).map((x) => String(x).toLowerCase())));
      verbInf.forEach((x) => nomenGross.delete(x));
      ["essen", "laufen", "leben", "spielen", "lesen"].forEach((x) => nomenGross.delete(x));
      let anzahl = 0;
      const zaehler = {};
      const bau = (niveau, zeitform, satzart, konj) => {
        const kat = eins(KAT);
        let verben = S.verbenFuer(kat, niveau);
        if (!verben.length) verben = S.VERBEN;
        let verb, subjekt, modal;
        /* Wie in der Oberfläche: ein Bindewort (damit, um … zu) steht nur
           zur Wahl, wenn es zu Verb und Modalverb passt. */
        for (let v = 0; v < 40; v++) {
          verb = eins(verben);
          subjekt = eins(S.SUBJEKTE);
          const modalListe = satzart === "umzu" ? [] : S.modalverbenFuer(verb, niveau, zeitform, {});
          modal = modalListe.length && zufall() < 0.4 ? eins(modalListe) : null;
          if (satzart === "nebensatz" && !S.nebensatzBindewoerterFuer(niveau, zeitform, { verb, modal }).some((b) => b.id === konj)) continue;
          if (satzart === "umzu" && !S.bindewoerterFuer(niveau, zeitform, { verb, modal, subjekt, vorherSubjekt: subjekt }).some((b) => b.id === "umzu")) continue;
          break;
        }
        const passiv = S.passivMoeglich(verb, niveau, zeitform, { modal }) && zufall() < 0.35;
        const rollen = S.ortRollenFuer(verb);
        const ortRolle = rollen.length ? eins(rollen) : "";
        const dinge = verb.objekt ? S.dingeFuer(verb, null, niveau) : [];
        const objekt = dinge.length && (verb.objektPflicht || passiv || zufall() < 0.6) ? eins(dinge) : null;
        const orte = ortRolle ? S.orteFuer(kat, niveau, verb, ortRolle, objekt) : [];
        const ort = orte.length && (verb.ortPflicht || zufall() < 0.6) ? eins(orte) : null;
        const personen = verb.personFall && !passiv ? S.personenFuer(null, niveau, verb, subjekt) : [];
        const person = personen.length && (verb.personPflicht || zufall() < 0.5) ? eins(personen) : null;
        const bl = S.begleiterFuer(objekt, verb, { person });
        const objektBegleiter = bl.length ? eins(bl).id : "";
        const adj = S.adjektiveFuer(objekt, niveau);
        const objektAdjektiv = adj.length && zufall() < 0.25 ? eins(adj) : null;
        const begl = passiv ? [] : S.begleitungFuer(verb, niveau, { person, subjekt });
        const begleitung = begl.length && zufall() < 0.3 ? eins(begl) : null;
        const fs2 = passiv ? [] : S.fragesaetzeFuer(verb, niveau, { objekt });
        const fragesatz = fs2.length && zufall() < 0.3 ? eins(fs2) : null;
        const zeiten = S.zeitenFuer(zeitform, niveau, { ort, ortRolle, objekt, objektBegleiter, modal, passiv, satzart }, verb).filter((z) => z.id !== "keine");
        const zeit = zeiten.length && zufall() < 0.7 ? eins(zeiten) : null;
        const gruende = S.gruendeFuer(verb, niveau, { ort, ortRolle, objekt, objektBegleiter, zeit, modal, passiv, zeitform, satzart }).filter((g) => g.id !== "keiner");
        const grund = gruende.length && zufall() < 0.4 ? eins(gruende) : null;
        const arten = S.artenFuer(verb, niveau, subjekt, objekt, { ort, objekt, objektBegleiter, grund, zeit, modal, passiv, konjunktion: konj, satzart }).filter((a) => a.id !== "keine");
        const art = arten.length && zufall() < 0.4 ? eins(arten) : null;
        const vf = satzart === "aussage" ? eins(["subjekt", "subjekt"].concat(zeit ? ["zeit"] : [], ort ? ["ort"] : [])) : "subjekt";
        const w = { subjekt, verb, modal, passiv, objekt, objektBegleiter, objektAdjektiv, person, ort, ortRolle, zeit, grund, art,
          begleitung, fragesatz, zeitform, satzart, konjunktion: konj || "", vorfeld: vf, niveau, pronomen: false };
        return { w, r: S.bauSatz(w) };
      };
      const pruefe = ({ w, r }) => {
        anzahl++;
        const de = r.de, teile = r.deTeile;
        const zf = r.zeitform;
        zaehler[zf] = (zaehler[zf] || 0) + 1;
        (beispiele[w.zeitform] = beispiele[w.zeitform] || []).push(r.de + (r.variante ? "   ⟶ " + r.variante.de : ""));
        if (/undefined|null|NaN|\[object/.test(de + r.it)) melde("kaputte Wörter", de, w);
        if (/\s{2,}/.test(de) || /\s[,.?!]/.test(de) || /,,|\.\.(?!\.)/.test(de)) melde("Satzzeichen/Leerraum", de, w);
        if (!/^[A-ZÄÖÜ]/.test(de)) melde("Großschreibung am Anfang", de, w);
        const schluss = w.satzart === "frage" ? /\?$/ : w.satzart === "nebensatz" || w.satzart === "umzu" ? / …$/ : /[^.]\.$/;
        if (!schluss.test(de)) melde("Schlusszeichen", de, w);
        // doppelte Wörter
        if (/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu.test(de)) melde("doppeltes Wort", de, w);
        if ((de.match(/\bweil\b/g) || []).length > 1) melde("zweimal weil", de, w);
        // Pronomen mitten im Satz groß
        if (/\s(Ich|Du|Er|Wir|Ihr)\b/.test(de.slice(1))) melde("Pronomen groß", de, w);
        // Nomen klein
        de.split(/[\s,.?…]+/).forEach((tok) => { if (tok && /^[a-zäöü]/.test(tok) && nomenGross.has(tok)) melde("Nomen klein: " + tok, de, w); });
        // Verbstellung
        const fi = teile.findIndex((x) => x.finit);
        const verbIdx = teile.map((x, i) => x.rolle === "verb" && !x.finit ? i : -1).filter((i) => i >= 0);
        const angehaengt = teile.map((x, i) => /^\s*,/.test(x.t) ? i : -1).filter((i) => i >= 0);
        const ersterAnhang = angehaengt.length ? angehaengt[0] : teile.length;
        if (w.satzart === "aussage" && fi !== 1) melde("Verb nicht an 2. Stelle", de, w);
        if (w.satzart === "frage" && fi !== 0) melde("Verb in der Frage nicht vorn", de, w);
        if (w.satzart === "nebensatz") {
          if (teile[0].rolle !== "konj") melde("Nebensatz ohne Bindewort vorn", de, w);
          const hinterFinit = teile.slice(fi + 1);
          if (fi < 0 || hinterFinit.some((x) => x.rolle !== "verb")) melde("Nebensatz: Verb nicht am Ende", de, w);
          if (hinterFinit.length && !(hinterFinit.length === 2 || (hinterFinit.length === 1 && w.modal))) {
            // finit vorn nur vor zwei Infinitiven (Ersatzinfinitiv)
            melde("Nebensatz: gebeugtes Verb vor einem einzelnen Verbteil", de, w);
          }
        }
        // Satzklammer: alle nicht gebeugten Verbteile hinter dem Mittelfeld
        if (w.satzart === "aussage" || w.satzart === "frage") {
          const mittelEnde = teile.slice(0, ersterAnhang).reduce((m, x, i) => (x.rolle !== "verb" ? i : m), -1);
          if (verbIdx.some((i) => i < mittelEnde && i > fi)) melde("Satzklammer: Verbteil mitten im Satz", de, w);
          if (angehaengt.some((i) => i < (verbIdx.length ? verbIdx[verbIdx.length - 1] : 0))) melde("Satzklammer: Anhang vor dem Verbteil", de, w);
        }
        // Kasus nach Präposition
        const low = de.toLowerCase();
        const dat = low.match(/\b(mit|bei|nach|aus|von|zu|seit|gegenüber)\s+(das|die|einen|eine|ein|meine|deine|seine|ihre|unsere|eure|keine|den|meinen|deinen|seinen|ihren|unseren|euren|keinen)\s+(\p{L}+)/u);
        if (dat && !(/^(den|meinen|deinen|seinen|ihren|unseren|euren|keinen)$/.test(dat[2]) && /n$/.test(dat[3]))) melde("Dativ-Präposition mit falschem Kasus: " + dat[0], de, w);
        const akk = low.match(/\b(für|durch|gegen|ohne)\s+(dem|einem|einer|meinem|deinem|seinem|ihrem|unserem|eurem|meiner|deiner|seiner|ihrer|unserer|eurer|keinem|keiner|der)\b/);
        if (akk) melde("Akkusativ-Präposition mit Dativ: " + akk[0], de, w);
        const ortTeil = teile.find((x) => ["wo", "wohin", "woher"].includes(x.rolle));
        if (ortTeil && w.ort) {
          const o = ortTeil.t.toLowerCase();
          if (ortTeil.rolle === "wo" && (/^(ins|ans|aufs)\b/.test(o) || /^(in|an|auf|unter|über|vor|hinter|neben) (das|einen|ein)\b/.test(o) || (/^(in|an|auf) den (\p{L}+)/u.test(o) && !/^(in|an|auf) den \p{L}+n\b/u.test(o)))) melde("„wo“ mit Akkusativ: " + ortTeil.t, de, w);
          if (ortTeil.rolle === "wohin" && (/^(im|am)\b/.test(o) || /^(in|an|auf|unter|über|vor|hinter|neben) (dem|einem|der)\b/.test(o))) melde("„wohin“ mit Dativ: " + ortTeil.t, de, w);
          if (ortTeil.rolle === "woher" && !/^(von|vom|aus)\b/.test(o)) melde("„woher“ ohne von/aus: " + ortTeil.t, de, w);
        }
        // Artikel und Genus des Objekts (aktiv, Akkusativ)
        const wasTeil = teile.find((x) => x.rolle === "was");
        if (wasTeil && w.objekt && !r.passiv && w.verb.objekt === "akk") {
          const g = w.objekt.plural ? "pl" : (w.objekt.genus || "n");
          const erstes = wasTeil.t.split(" ")[0];
          // welcher Begleiter dasteht, sagt das erste Wort — dazu muss das Genus passen
          const b = /^(kein|keine|keinen|keinem|keiner)$/.test(erstes) ? "kein" : /^(ein|eine|einen|einem|einer)$/.test(erstes) ? "unbestimmt"
            : /^(der|die|das|den|dem|des)$/.test(erstes) ? "bestimmt" : "";
          const SOLL = { bestimmt: { m: "den", f: "die", n: "das", pl: "die" }, unbestimmt: { m: "einen", f: "eine", n: "ein", pl: null }, kein: { m: "keinen", f: "keine", n: "kein", pl: "keine" } };
          if (SOLL[b] && SOLL[b][g] && erstes !== SOLL[b][g] && !(b === "unbestimmt" && g === "pl")) melde("Artikel/Genus: " + wasTeil.t + " (" + g + ", " + b + ")", de, w);
        }
        // Passiv: niemand handelt
        if (r.passiv) {
          if (/(^|\s)(ich|du|er|wir|ihr|mich|mir|dich|dir|uns|euch|mein\p{L}*|dein\p{L}*|unser\p{L}*|euer|eur\p{L}+)(?=[\s,.?]|$)/iu.test(de)) melde("Passiv mit handelnder Person", de, w);
          if (!/\b(wird|werden|wurde|wurden|worden)\b/i.test(de)) melde("Passiv ohne werden", de, w);
        }
        // Hilfsverb, Partizip, Präteritum
        const i = IDX[(r.passiv ? { id: "3sgm" } : w.subjekt).id];
        const finit = fi >= 0 ? teile[fi].t : "";
        const woher = w.ortRolle === "woher" && w.verb.deWoherInf === "kommen" && w.ort;
        const vid = woher ? "kommen" : w.verb.id;
        const aktivVoll = !r.modal && !r.passiv;
        if (aktivVoll && w.satzart !== "umzu") {
          const letzte = verbIdx.length ? teile[verbIdx[verbIdx.length - 1]].t : "";
          const nimmtSein = MIT_SEIN.has(vid);
          if (zf === "perfekt") {
            if (finit !== (nimmtSein ? SEIN_PR : HABEN_PR)[i]) melde("Perfekt: falsches Hilfsverb „" + finit + "“", de, w);
            if (letzte !== TAFEL[vid].split(" ")[3]) melde("Perfekt: falsches Partizip „" + letzte + "“", de, w);
          }
          if (zf === "plusquamperfekt" && finit !== (nimmtSein ? SEIN_PT : HABEN_PT)[i]) melde("Plusquamperfekt: falsches Hilfsverb „" + finit + "“", de, w);
          if (zf === "konjunktiv2v" && finit !== (nimmtSein ? SEIN_K2 : HABEN_K2)[i]) melde("Konjunktiv II Verg.: falsches Hilfsverb „" + finit + "“", de, w);
          if (zf === "praeteritum") {
            const soll = praetErwartet(vid, i);
            const trenn = woher ? "" : (w.verb.trennbar || "");
            const ist = w.satzart === "nebensatz" && trenn ? finit.replace(new RegExp("^" + trenn), "") : finit;
            if (ist !== soll) melde("Präteritum falsch: „" + finit + "“ statt „" + soll + "“", de, w);
            if (trenn && w.satzart !== "nebensatz" && !teile.some((x) => x.rolle === "verb" && x.t === trenn)) melde("Präteritum: Vorsilbe fehlt am Ende", de, w);
          }
        }
        if (r.modal && zf === "praeteritum" && finit !== w.modal.praeteritum[i]) melde("Modalverb-Präteritum falsch „" + finit + "“", de, w);
        // Zeitangabe zur Zeitform
        if (w.zeit && teile.some((x) => x.rolle === "wann")) {
          const z = w.zeit;
          if (z.nurVergangenheit && !S.istVergangen(zf)) melde("Vergangenheitswort in Nicht-Vergangenheit", de, w);
          if (z.nurZukunft && !["praesens", "futur", "konjunktiv2"].includes(zf)) melde("Zukunftswort in der Vergangenheit", de, w);
          if (/^seit /.test(z.de) && zf !== "praesens") melde("„seit“ außerhalb des Präsens", de, w);
        }
        // Sinn: aus den Sinn-Listen
        if (w.objekt && teile.some((x) => x.rolle === "was") && w.verb.passtDinge && w.verb.passtDinge.length && !w.verb.passtDinge.includes(w.objekt.id)) melde("Objekt passt nicht zum Verb", de, w);
        if (w.ort && w.verb.passtOrte && w.verb.passtOrte[w.ortRolle] && !w.verb.passtOrte[w.ortRolle].includes(w.ort.id)) melde("Ort passt nicht zum Verb", de, w);
        if (w.modal && !S.modalPasst(w.modal, w.verb)) melde("Modalverb passt nicht zum Verb", de, w);
        if (/\b(muss|musst|müssen|müsst|musste|musstest|mussten|musstet|soll|sollst|sollen|sollt|sollte|solltest|sollten|solltet)\b.*\b(gern|mit Freude)\b/.test(de)) melde("Pflicht mit „gern“", de, w);
        if (w.modal && /weil \S+ das (muss|musst|müssen|müsst|will|willst|wollen|wollt|soll|sollst|sollen|sollt|musste|mussten|wollte|wollten|sollte|sollten)\b/.test(de)) melde("Modalverb doppelt im Grund", de, w);
        if (w.modal && ["muessen", "sollen", "duerfen"].includes(w.modal.id) && /weil \S+ (Lust|keine Lust|Zeit|keine Zeit|frei) /.test(de)) melde("Pflicht mit Lust/Zeit als Grund", de, w);
        if (w.subjekt.zahl === "pl" && /\b(unser|unseren|unserem|euer|euren|eurem|ihren|ihrem)\s+Mann\b|\b(unsere|unserer|eure|eurer)\s+Frau\b/.test(de)) melde("„unser Mann“ bei mehreren", de, w);
        if (/weil \S+ keine (Zeit|Lust)/.test(de) && !/\b(kein|keine|keinen|keinem|keiner|nie|nicht)\b/i.test(de.replace(/weil .*/, ""))) melde("„keine Zeit/Lust“ als Grund für eine bejahte Handlung", de, w);
        if (/^Damit\b/.test(de) && w.verb && ["moegen", "vergessen", "verlieren", "glauben", "lachen", "weinen"].includes(w.verb.id)) melde("„damit“ ohne echtes Ziel", de, w);
        if (/\bmit dem (Bus|Zug|Auto|Fahrrad)\b.*\b(in den Flur|in die Küche|ins Wohnzimmer|ins Badezimmer|ins Schlafzimmer|in den Keller)/.test(de)) melde("Fahrzeug ins Zimmer", de, w);
        // Italienisch sauber
        if (/\s{2,}|undefined/.test(r.it) || !/^[A-ZÀ-Ý]/.test(r.it)) melde("Italienisch unsauber", r.it, w);
      };
      NIV.forEach((niveau) => {
        const zfs = S.zeitformenFuer(niveau);
        zfs.forEach((zf) => {
          const arten = [["aussage"], ["frage"]];
          S.nebensatzBindewoerterFuer(niveau, zf).forEach((k) => arten.push(["nebensatz", k.id]));
          if (S.niveauAb("B2", niveau)) arten.push(["umzu"]);
          arten.forEach(([sa, k]) => {
            const n = sa === "aussage" ? 260 : 110;
            for (let j = 0; j < n; j++) pruefe(bau(niveau, sa === "umzu" ? "praesens" : zf, sa, k));
          });
        });
      });
      const arten = Object.keys(probleme);
      sage(anzahl > 5000, anzahl.toLocaleString("de-DE") + " Zufallssätze gebaut und geprüft", Object.entries(zaehler).map(([k, v]) => k + ":" + v).join(" "));
      if (!arten.length) sage(true, "keine Auffälligkeit (Verbstellung, Klammer, Kasus, Artikel, Hilfsverb, Partizip, Präteritum, Nebensatz, Wörter, Schreibung, Zeichen, Zeit, Sinn)");
      arten.forEach((a) => sage(false, a + " — " + probleme[a].length + "×", probleme[a].slice(0, 3).join("  ||  ")));
      if (LESEN) {
        Object.entries(beispiele).forEach(([zf, l]) => {
          console.log("\n  --- 40 Beispiele: " + zf + " ---");
          for (let k = 0; k < 40 && l.length; k++) console.log("   " + l[Math.floor(zufall() * l.length)]);
        });
      }
    }
  }

  /* ================================================================ C */
  if (NUR.includes("C")) {
    console.log("\nC · NATÜRLICHE VERGANGENHEIT\n");
    const V = (id) => (S.VERBEN || []).find((v) => v.id === id), O = (id) => (S.ORTE || []).find((v) => v.id === id);
    const Z = (id) => (S.ZEITEN || []).find((v) => v.id === id), D = (id) => (S.DINGE || []).find((v) => v.id === id);
    const M = (id) => (S.MODALVERBEN || []).find((v) => v.id === id);
    const ich = (S.SUBJEKTE || [])[0];
    const b = (o) => { try { return S.bauSatz(Object.assign({ subjekt: ich, zeitform: "vergangenheit", satzart: "aussage", vorfeld: "subjekt", niveau: "A2" }, o)); } catch (e) { return { de: "FEHLER " + e.message }; } };
    const berge = b({ verb: V("sein"), ort: O("berge"), ortRolle: "wo", zeit: Z("wochenende") });
    sage(berge.de === "Ich war am Wochenende in den Bergen." && berge.variante && berge.variante.de === "Ich bin am Wochenende in den Bergen gewesen." && /Beides ist richtig/.test(berge.variante.erklaerung),
      "„Vergangenheit“ mit sein: vorn „Ich war am Wochenende in den Bergen.“, darunter das Perfekt mit Erklärung", berge.de + " / " + (berge.variante && berge.variante.de));
    const zeit = b({ verb: V("haben"), objekt: D("zeit"), objektBegleiter: "kein" });
    sage(zeit.de === "Ich hatte keine Zeit.", "haben: „Ich hatte keine Zeit.“", zeit.de);
    const musste = b({ verb: V("arbeiten"), modal: M("muessen") });
    sage(musste.de === "Ich musste arbeiten." && musste.variante && musste.variante.de === "Ich habe arbeiten müssen.", "Modalverb: „Ich musste arbeiten.“ (Perfekt „Ich habe arbeiten müssen.“)", musste.de + " / " + (musste.variante && musste.variante.de));
    const kino2 = b({ verb: V("gehen"), ort: O("kino"), ortRolle: "wohin", zeit: Z("gestern") });
    sage(kino2.de === "Ich bin gestern ins Kino gegangen." && !kino2.variante, "andere Verben auf A2: nur das Perfekt („Ich bin gestern ins Kino gegangen.“)", kino2.de);
    const kino3 = b({ verb: V("gehen"), ort: O("kino"), ortRolle: "wohin", zeit: Z("gestern"), niveau: "B1" });
    sage(kino3.variante && kino3.variante.de === "Ich ging gestern ins Kino." && /Präteritum/.test(kino3.variante.titel), "ab B1 darunter „geschrieben/erzählt“: „Ich ging gestern ins Kino.“", kino3.variante && kino3.variante.de);
    const neben = b({ verb: V("arbeiten"), modal: M("muessen"), zeit: Z("wochenende"), satzart: "nebensatz", konjunktion: "weil" });
    sage(neben.de === "Weil ich am Wochenende arbeiten musste …" && neben.variante && neben.variante.de === "Weil ich am Wochenende habe arbeiten müssen …", "Nebensatz: „weil ich … arbeiten musste“, Perfekt mit dem Hilfsverb vor den zwei Infinitiven", neben.de + " / " + (neben.variante && neben.variante.de));
    const auf = b({ verb: V("aufraeumen"), objekt: D("wohnung"), objektBegleiter: "possessiv", niveau: "B1" });
    sage(auf.variante && auf.variante.de === "Ich räumte meine Wohnung auf.", "trennbar im Präteritum: „Ich räumte meine Wohnung auf.“", auf.variante && auf.variante.de);
    const it = b({ verb: V("sein"), ort: O("berge"), ortRolle: "wo", zeit: Z("wochenende") }).it;
    sage(/sono stat/.test(it || ""), "Italienisch: „sono stato/a in montagna“ (passato prossimo)", it);
    const itH = zeit.it || "";
    sage(/avevo/.test(itH), "Italienisch: „Non avevo tempo“ (imperfetto)", itH);
  }

  /* ================================================================ D */
  if (NUR.includes("D")) {
    console.log("\nD · NIVEAUS SCHALTEN GRAMMATIK FREI\n");
    if (!neu) sage(false, "Engine kennt die Niveau-Grammatik");
    else {
      const zf = (l) => S.zeitformenFuer(l).join(",");
      sage(zf("A1") === "praesens,vergangenheit", "A1: Gegenwart und Vergangenheit", zf("A1"));
      sage(zf("A2") === "praesens,vergangenheit,futur", "A2: + Futur", zf("A2"));
      sage(zf("B1") === "praesens,vergangenheit,futur,plusquamperfekt,konjunktiv2", "B1: + Plusquamperfekt, Konjunktiv II", zf("B1"));
      sage(zf("B2") === "praesens,vergangenheit,futur,plusquamperfekt,konjunktiv2,konjunktiv2v", "B2: + Konjunktiv II der Vergangenheit", zf("B2"));
      const nk = (l) => S.nebensatzBindewoerterFuer(l, "praesens").map((b) => b.id).join(",");
      sage(nk("A1") === "" && nk("A2") === "weil,dass,wenn" && nk("B1") === "weil,dass,wenn,obwohl,damit", "Nebensätze: A1 keine, A2 weil/dass/wenn, B1 + obwohl/damit", nk("A1") + " | " + nk("A2") + " | " + nk("B1"));
      const bw = (l) => S.bindewoerterFuer(l, "praesens", {}).map((b) => b.id).join(",");
      sage(bw("A1") === "und,aber,oder,dann" && /deshalb/.test(bw("A2")) && /obwohl/.test(bw("B1")) && /umzu/.test(bw("B2")) && !/umzu/.test(bw("B1")), "Sätze verbinden: A1 und/aber/oder/dann, A2 + denn/deshalb/weil, B1 + obwohl/damit/trotzdem, B2 + um … zu", bw("A1") + " | " + bw("B2"));
      const V = (id) => S.VERBEN.find((v) => v.id === id);
      sage(S.modalverbenFuer(V("arbeiten"), "A1", "praesens").length === 4 && !S.modalverbenFuer(V("arbeiten"), "A1", "vergangenheit").length && S.modalverbenFuer(V("arbeiten"), "A2", "vergangenheit").length === 6,
        "Modalverben: A1 im Präsens (können, müssen, wollen, möchten), Präteritum ab A2");
      sage(!S.passivMoeglich(V("kochen"), "B1", "praesens", {}) && S.passivMoeglich(V("kochen"), "B2", "praesens", {}) && !S.passivMoeglich(V("gehen"), "C2", "praesens", {}), "Passiv ab B2, nur bei Verben mit Objekt");
      sage(!S.praeteritumErlaubt(V("gehen"), null, "A2") && S.praeteritumErlaubt(V("gehen"), null, "B1") && S.praeteritumErlaubt(V("sein"), null, "A1"), "Präteritum: sein/haben ab A1, alle Verben ab B1");
      const info = ["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => S.niveauInfo(l));
      sage(info.every((x) => x.length >= 2), "zu jedem Niveau eine kurze Liste, was man bauen kann");
      sage(S.gruendeFuer(V("gehen"), "A1", {}).every((g) => g.id === "keiner") && S.gruendeFuer(V("gehen"), "A2", {}).length > 3, "Gründe mit „weil“ erst ab A2");
    }
  }

  /* ================================================================ E */
  if (NUR.includes("E")) {
    console.log("\nE · KLEINE GESCHICHTEN (2–3 Sätze)\n");
    if (!neu || !S.verbindeSaetze) sage(false, "Engine kann Sätze verbinden (verbindeSaetze)");
    else {
      const V = (id) => S.VERBEN.find((v) => v.id === id), O = (id) => S.ORTE.find((v) => v.id === id);
      const Z = (id) => S.ZEITEN.find((v) => v.id === id), D = (id) => S.DINGE.find((v) => v.id === id);
      const ich = S.SUBJEKTE[0];
      const s = (o) => S.bauSatz(Object.assign({ subjekt: ich, zeitform: "vergangenheit", satzart: "aussage", vorfeld: "subjekt", niveau: "B2" }, o));
      const g1 = S.verbindeSaetze([
        { satz: s({ verb: V("sein"), ort: O("berge"), ortRolle: "wo", zeit: Z("wochenende") }) },
        { satz: s({ verb: V("wandern"), vorfeldWort: "dann" }), bindewort: "dann" },
      ]).de;
      sage(g1 === "Ich war am Wochenende in den Bergen. Dann bin ich gewandert.", "„dann“ beginnt einen neuen Satz, das Verb steht gleich dahinter", g1);
      const g2 = S.verbindeSaetze([
        { satz: s({ verb: V("haben"), objekt: D("zeit"), objektBegleiter: "kein" }) },
        { satz: s({ verb: V("bleiben"), ort: O("zuhause"), ortRolle: "wo", vorfeldWort: "deshalb" }), bindewort: "deshalb" },
      ]).de;
      sage(g2 === "Ich hatte keine Zeit. Deshalb bin ich zu Hause geblieben.", "„deshalb“: „Deshalb bin ich zu Hause geblieben.“", g2);
      const g3 = S.verbindeSaetze([
        { satz: s({ verb: V("bleiben"), ort: O("zuhause"), ortRolle: "wo" }) },
        { satz: s({ verb: V("sein"), ort: O("krankenhaus") || O("arzt"), ortRolle: "wo", satzart: "nebensatz", konjunktion: "weil", zeitform: "vergangenheit" }), bindewort: "weil" },
      ]).de;
      sage(/^Ich bin zu Hause geblieben, weil ich .+ war\.$/.test(g3), "„weil“: Komma davor, gebeugtes Verb am Ende", g3);
      const g4 = S.verbindeSaetze([
        { satz: s({ verb: V("fahren"), ort: O("stadt"), ortRolle: "wohin", zeitform: "praesens" }) },
        { satz: s({ verb: V("kaufen"), objekt: D("buch"), objektBegleiter: "unbestimmt", satzart: "umzu", zeitform: "praesens" }), bindewort: "umzu" },
      ]).de;
      sage(g4 === "Ich fahre in die Stadt, um ein Buch zu kaufen.", "„um … zu“: „Ich fahre in die Stadt, um ein Buch zu kaufen.“", g4);
      const g5 = S.verbindeSaetze([
        { satz: s({ verb: V("sein"), ort: O("kino"), ortRolle: "wo" }) },
        { satz: s({ verb: V("sein"), ort: O("zuhause"), ortRolle: "wo", subjekt: S.SUBJEKTE[3] }), bindewort: "aber" },
      ]).de;
      sage(g5 === "Ich war im Kino, aber sie war zu Hause.", "„aber“: Komma, Verb an zweiter Stelle", g5);
      /* Zufallsgeschichten: jede Verbindung, jeder zweite/dritte Satz */
      let kaputt = [], n = 0;
      for (let k = 0; k < 600; k++) {
        const niveau = eins(["A1", "A2", "B1", "B2"]);
        const zf = eins(S.zeitformenFuer(niveau).filter((z) => z !== "konjunktiv2v"));
        const liste = [];
        const anz = zufall() < 0.5 ? 2 : 3;
        let vorher = null;
        for (let t = 0; t < anz; t++) {
          const verb = eins(S.VERBEN.filter((v) => (v.lokal || []).length));
          const rolle = eins(verb.lokal);
          const orte = S.orteFuer(null, niveau, verb, rolle, null);
          const subjekt = eins(S.SUBJEKTE);
          const bl = t ? S.bindewoerterFuer(niveau, zf, { subjekt, vorherSubjekt: vorher, verb }) : [];
          const b = t ? eins(bl) : null;
          const sa = b ? (b.art === "unter" ? "nebensatz" : b.art === "umzu" ? "umzu" : "aussage") : "aussage";
          const satz = S.bauSatz({ subjekt, verb, ort: orte.length ? eins(orte) : null, ortRolle: rolle, zeitform: sa === "umzu" ? "praesens" : zf,
            satzart: sa, konjunktion: b && b.art === "unter" ? b.id : "", vorfeldWort: b && b.art === "adverb" ? b.de : "", vorfeld: "subjekt", niveau });
          liste.push({ satz, bindewort: b ? b.id : "" });
          vorher = subjekt;
        }
        const g = S.verbindeSaetze(liste).de;
        n++;
        const schlecht = /\s[,.]|,,|\.\.|[^.]$|\. [a-zäöü]|, (Weil|Dass|Wenn|Obwohl|Damit|Um|Und|Aber|Denn)\b| (und|oder), | (aber|denn) [A-ZÄÖÜ]/.test(g)
          || /(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu.test(g) || !/^[A-ZÄÖÜ]/.test(g);
        if (schlecht) kaputt.push(g);
        // Im Nebensatz steht das gebeugte Verb am Ende (letztes Teil ist finit)
        liste.forEach((e) => { if (e.satz.satzart === "nebensatz") { const t = e.satz.deTeile; if (!t[t.length - 1].finit && !t.slice(t.findIndex((x) => x.finit) + 1).every((x) => x.rolle === "verb")) kaputt.push("Verb nicht am Ende: " + g); } });
      }
      sage(n === 600 && !kaputt.length, n + " Zufallsgeschichten aus 2–3 Sätzen: Kommas, Großschreibung nach dem Punkt, Verb am Ende im Nebensatz", kaputt.slice(0, 3).join(" || "));
    }
  }

  /* ================================================================ F */
  if (NUR.includes("F")) {
    console.log("\nF · OBERFLÄCHE (360 × 740 Finger, 1280 × 800 Maus)\n");
    const { chromium } = require("/tmp/claude-0/node_modules/playwright");
    const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg" };
    const srv = http.createServer((q, a) => {
      let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
      const f = path.join(WURZEL, p);
      if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
    }).listen(0);
    const basis = "http://127.0.0.1:" + srv.address().port + "/index.html";
    const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
    const seite = async (vp, telefon) => {
      const pg = await br.newPage({ viewport: vp, deviceScaleFactor: telefon ? 2 : 1, hasTouch: !!telefon, isMobile: !!telefon });
      pg.setDefaultTimeout(90000);
      pg.fehler = [];
      pg.on("pageerror", (e) => pg.fehler.push(String(e.message || e)));
      await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
      await pg.goto(basis, { waitUntil: "domcontentloaded" });
      await pg.waitForFunction(() => window.Satzbau && document.querySelector(".tape-tab[data-target=view-learn]"), null, { timeout: 90000 });
      await pg.evaluate(() => document.querySelector(".tape-tab[data-target=view-learn]").click());
      await pg.evaluate(() => document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]').click());
      await pg.waitForFunction(() => document.querySelector("#satzbaukastenDeArea .baustein-satz"), null, { timeout: 30000 });
      return pg;
    };
    const klick = (pg, sel) => pg.evaluate((s) => { const e = document.querySelector("#satzbaukastenDeArea " + s); if (!e) return false; e.click(); return true; }, sel);
    const satzText = (pg) => pg.evaluate(() => document.querySelector("#satzbaukastenDeArea .sbk-klebe .baustein-satz").textContent.replace(/\s+/g, " ").trim());
    const layout = (pg) => pg.evaluate(() => {
      const area = document.getElementById("satzbaukastenDeArea");
      const knoepfe = [...area.querySelectorAll("button, summary")].filter((b) => b.offsetParent && b.getBoundingClientRect().width > 0);
      const zuKlein = knoepfe.filter((b) => { const r = b.getBoundingClientRect(); return r.height < 30 || r.width < 30; }).map((b) => b.textContent.trim().slice(0, 20) + " " + Math.round(b.getBoundingClientRect().height));
      const rs = knoepfe.map((b) => b.getBoundingClientRect());
      const ueber = [];
      for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
        const a = rs[i], c = rs[j];
        const x = Math.min(a.right, c.right) - Math.max(a.left, c.left), y = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (x > 2 && y > 2 && !knoepfe[i].contains(knoepfe[j]) && !knoepfe[j].contains(knoepfe[i])) ueber.push(knoepfe[i].textContent.trim().slice(0, 16) + " / " + knoepfe[j].textContent.trim().slice(0, 16));
      }
      const texte = [...area.querySelectorAll(".sbk-variante, .sbk-niveau-info, .baustein-satz, .sbk-hinweis")].filter((e) => e.offsetParent)
        .filter((e) => e.getBoundingClientRect().right > innerWidth + 1).map((e) => e.className);
      return { zuKlein, ueber, breit: document.documentElement.scrollWidth, fenster: innerWidth, texte, anzahl: knoepfe.length };
    });

    try {
      const pg = await seite({ width: 360, height: 740 }, true);
      sage(await klick(pg, '[data-sbk-niveau="A1"]'), "Niveau A1 wählbar");
      const a1 = await pg.evaluate(() => ({
        info: (document.querySelector("#satzbaukastenDeArea [data-sbk-niveau-info]") || {}).textContent || "",
        zf: [...document.querySelectorAll("#satzbaukastenDeArea [data-sbk-zeitform]")].map((b) => b.dataset.sbkZeitform).join(","),
        neben: !!document.querySelector('#satzbaukastenDeArea [data-sbk-satzart="nebensatz"]'),
        alle: !!document.querySelector("#satzbaukastenDeArea .sbk-niveau-alle"),
      }));
      sage(/Auf A1 baust du/.test(a1.info) && a1.alle, "unter dem Niveau steht, was man auf A1 bauen kann (und die Übersicht A1–C2)", a1.info.slice(0, 90));
      sage(a1.zf === "praesens,vergangenheit" && !a1.neben, "A1: Gegenwart und Vergangenheit, noch kein Nebensatz", a1.zf);
      await klick(pg, '[data-sbk-niveau="B1"]');
      const b1 = await pg.evaluate(() => [...document.querySelectorAll("#satzbaukastenDeArea [data-sbk-zeitform]")].map((b) => b.dataset.sbkZeitform).join(","));
      sage(/plusquamperfekt/.test(b1) && /konjunktiv2/.test(b1), "B1: Vorvergangenheit und Konjunktiv II sind da", b1);

      /* Xanders Satz: Ich war am Wochenende in den Bergen. */
      await klick(pg, '[data-sbk-kat="alle"]');
      await klick(pg, '[data-sbk-niveau="A2"]');
      await klick(pg, '[data-sbk-feld="subjekt"][data-sbk-wert="1sg"]');
      await klick(pg, '[data-sbk-feld="verb"][data-sbk-wert="sein"]');
      await klick(pg, '[data-sbk-feld="begleitung"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="ort"][data-sbk-wert="berge"]');
      await klick(pg, '[data-sbk-zeitform="vergangenheit"]');
      await klick(pg, '[data-sbk-feld="zeit"][data-sbk-wert="wochenende"]');
      await klick(pg, '[data-sbk-feld="grund"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="art"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="vorfeld"][data-sbk-wert="subjekt"]');
      const berge = await satzText(pg);
      const variante = await pg.evaluate(() => { const v = document.querySelector("#satzbaukastenDeArea [data-sbk-variante]"); return v ? v.textContent.replace(/\s+/g, " ").trim() : ""; });
      sage(berge === "Ich war am Wochenende in den Bergen.", "Vergangenheit mit sein zeigt „Ich war am Wochenende in den Bergen.“", berge);
      sage(/Ich bin am Wochenende in den Bergen gewesen\./.test(variante) && /Beides ist richtig/.test(variante), "darunter die Perfekt-Variante mit einem Satz Erklärung", variante.slice(0, 120));
      const italienisch = await pg.evaluate(() => !!document.querySelector("#satzbaukastenDeArea .baustein-satz-de"));
      sage(!italienisch, "im Deutsch-Raum keine italienische Zeile");
      if (BILD) await (await pg.$("#satzbaukastenDeArea")).screenshot({ path: BILD + "-360-berge.png" });

      /* Modalverb: Ich musste arbeiten. */
      await klick(pg, '[data-sbk-feld="verb"][data-sbk-wert="arbeiten"]');
      await klick(pg, '[data-sbk-feld="ort"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="begleitung"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-modal="muessen"]');
      await klick(pg, '[data-sbk-feld="zeit"][data-sbk-wert="wochenende"]');
      const musste = await satzText(pg);
      sage(musste === "Ich musste am Wochenende arbeiten.", "Modalverb in der Vergangenheit: „Ich musste am Wochenende arbeiten.“", musste);

      /* Mehrere Sätze */
      await klick(pg, '[data-sbk-modal=""]');
      await klick(pg, '[data-sbk-feld="verb"][data-sbk-wert="haben"]');
      await klick(pg, '[data-sbk-feld="objekt"][data-sbk-wert="zeit"]');
      await klick(pg, '[data-sbk-feld="objektBegleiter"][data-sbk-wert="kein"]');
      await klick(pg, '[data-sbk-feld="zeit"][data-sbk-wert=""]');
      const s1 = await satzText(pg);
      const plus = await klick(pg, "#sbkPlusSatz");
      sage(plus, "Knopf „+ zweiter Satz“ ist da");
      const binde = await pg.evaluate(() => [...document.querySelectorAll("#satzbaukastenDeArea [data-sbk-binde]")].map((b) => b.dataset.sbkBinde).join(","));
      sage(/und/.test(binde) && /deshalb/.test(binde) && /weil/.test(binde) && !/obwohl/.test(binde), "Bindewörter passend zu A2 (und, aber, dann, deshalb, weil … — noch kein obwohl)", binde);
      await klick(pg, '[data-sbk-binde="deshalb"]');
      await klick(pg, '[data-sbk-feld="verb"][data-sbk-wert="bleiben"]');
      await klick(pg, '[data-sbk-feld="ort"][data-sbk-wert="zuhause"]');
      await klick(pg, '[data-sbk-feld="art"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="begleitung"][data-sbk-wert=""]');
      const s2 = await satzText(pg);
      sage(s2 === s1.replace(/\.$/, "") + ". Deshalb bin ich zu Hause geblieben.", "zweiter Satz mit „deshalb“: Verb gleich dahinter", s2);
      await klick(pg, "#sbkPlusSatz");
      await klick(pg, '[data-sbk-binde="weil"]');
      await klick(pg, '[data-sbk-feld="verb"][data-sbk-wert="sein"]');
      await klick(pg, '[data-sbk-feld="ort"][data-sbk-wert="zuhause"]');
      await klick(pg, '[data-sbk-feld="ort"][data-sbk-wert="krankenhaus"]');
      await klick(pg, '[data-sbk-feld="grund"][data-sbk-wert=""]');
      const s3 = await satzText(pg);
      sage(/Deshalb bin ich zu Hause geblieben, weil ich im Krankenhaus war\.$/.test(s3), "dritter Satz mit „weil“: Komma, Verb am Ende — eine kleine Geschichte aus drei Sätzen", s3);
      if (BILD) await (await pg.$("#satzbaukastenDeArea")).screenshot({ path: BILD + "-360-geschichte.png" });
      const l360 = await layout(pg);
      sage(l360.breit <= l360.fenster, "keine waagrechte Rollleiste (360 px)", l360.breit + " / " + l360.fenster);
      sage(!l360.zuKlein.length, "alle " + l360.anzahl + " Tippflächen ≥ 30 px", l360.zuKlein.slice(0, 4).join(" | "));
      sage(!l360.ueber.length, "nichts überlappt", l360.ueber.slice(0, 3).join(" | "));
      sage(!l360.texte.length, "kein Text ragt über den Rand", l360.texte.join(","));
      await klick(pg, "#sbkSatzZurueck");
      const zurueck = await satzText(pg);
      sage(zurueck === s2, "„letzten Satz zurück“ stellt den vorigen Stand her", zurueck);
      await klick(pg, "#sbkGeschichteNeu");
      /* B2: Passiv */
      await klick(pg, '[data-sbk-niveau="B2"]');
      await klick(pg, '[data-sbk-zeitform="praesens"]');
      await klick(pg, '[data-sbk-feld="verb"][data-sbk-wert="kochen"]');
      await klick(pg, '[data-sbk-passiv="1"]');
      await klick(pg, '[data-sbk-feld="objekt"][data-sbk-wert="suppe"]');
      await klick(pg, '[data-sbk-feld="zeit"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="ort"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="grund"][data-sbk-wert=""]');
      await klick(pg, '[data-sbk-feld="art"][data-sbk-wert=""]');
      const passiv = await satzText(pg);
      sage(passiv === "Die Suppe wird gekocht.", "B2 Passiv: „Die Suppe wird gekocht.“", passiv);
      await klick(pg, '[data-sbk-passiv="0"]');
      sage(!pg.fehler.length, "keine Seitenfehler", pg.fehler.slice(0, 2).join(" | "));
      await pg.close();

      const pg2 = await seite({ width: 1280, height: 800 }, false);
      await klick(pg2, '[data-sbk-kat="alle"]');
      await klick(pg2, '[data-sbk-niveau="B1"]');
      await klick(pg2, '[data-sbk-feld="verb"][data-sbk-wert="gehen"]');
      await klick(pg2, '[data-sbk-zeitform="vergangenheit"]');
      await klick(pg2, '[data-sbk-feld="ort"][data-sbk-wert="kino"]');
      const kino = await satzText(pg2);
      const v2 = await pg2.evaluate(() => { const v = document.querySelector("#satzbaukastenDeArea [data-sbk-variante]"); return v ? v.textContent.replace(/\s+/g, " ").trim() : ""; });
      sage(/^Ich bin .*ins Kino gegangen\.$/.test(kino) && /Präteritum/.test(v2) && /ging/.test(v2), "B1, gehen: Perfekt vorn, darunter „Geschrieben oder erzählt (Präteritum): … ging …“", kino + " / " + v2.slice(0, 80));
      if (BILD) await (await pg2.$("#satzbaukastenDeArea")).screenshot({ path: BILD + "-1280.png" });
      const l1280 = await layout(pg2);
      sage(!l1280.ueber.length && l1280.breit <= l1280.fenster, "1280 px: nichts überlappt, keine Rollleiste", l1280.ueber.slice(0, 2).join(" | "));
      sage(!pg2.fehler.length, "keine Seitenfehler (1280)", pg2.fehler.slice(0, 2).join(" | "));
      await pg2.close();
    } catch (e) { sage(false, "Oberfläche lässt sich bis zum Ende bedienen", String(e.message || e).split("\n")[0]); }
    await br.close(); srv.close();
  }

  console.log("\nFassung 835 (Satzbaukasten: Zeitformen, Niveaus, mehrere Sätze): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})();
