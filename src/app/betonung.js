/* =====================================================================
   MODUL-UMBAU M4 (MODULE-PLAN.md Abschnitt 3) — BETONUNG (aus app.js)
   ---------------------------------------------------------------------
   Die Betonung: geprüfte Silben nachschlagen (KLEINE_WOERTER, Wortschatz),
   Betonung durch Tippen in einen Textkasten, Wiederherstellen nach dem
   Neuzeichnen.
   Gezogen mit werkzeug/app-modul-ziehen.js: der Code unten ist der aus
   app.js, Zeichen für Zeichen (zwei Leerzeichen weniger eingerückt,
   nicht in Strings).
   Eingänge (export) stellt src/bruecke.js unter dem alten Namen auf
   window; app.js ruft sie über dünne Weiterleitungen (dmaModul, aus der
   eigenen Tabelle DMA_BRUECKE.fn).
   ===================================================================== */
/* Helfer aus app.js – über window.DMA_APP, erst beim Aufruf gelesen (dieses Modul läuft VOR app.js) */
function applyStressToTree(...a) { return window.DMA_APP.applyStressToTree(...a); }
function betonungAnzeigen(...a) { return window.DMA_APP.betonungAnzeigen(...a); }
function grossMitEszett(...a) { return window.DMA_APP.grossMitEszett(...a); }
function grundformKandidaten(...a) { return window.DMA_APP.grundformKandidaten(...a); }
function removeStressFromTree(...a) { return window.DMA_APP.removeStressFromTree(...a); }
function showToast(...a) { return window.DMA_APP.showToast(...a); }
function wortschatzBereit(...a) { return window.DMA_APP.wortschatzBereit(...a); }
function wortschatzHolenFuer(...a) { return window.DMA_APP.wortschatzHolenFuer(...a); }
function wortschatzNachziehen(...a) { return window.DMA_APP.wortschatzNachziehen(...a); }

/* Ein schneller Zugriff „Wortform → geprüfte Silbenangabe". Wird
   einmal gebaut und an der Wortzahl gemessen zwischengespeichert;
   ein Lesetext fragt sonst für jedes Wort einzeln nach. */
let betonungIndex = null;
let betonungIndexStand = -1;
/* ============================================================
   KLEINE WÖRTER — damit ein Text lückenlos gelesen werden kann
   ------------------------------------------------------------
   GEWÜNSCHT: „Die seitenweite Betonungsanzeige war für jedes Wort,
   sogar die Links, alles war punktiert oder unterstrichen, sodass
   man die komplette Webseite richtig lesen konnte."

   Artikel, Pronomen, Präpositionen und Hilfsverben stehen nicht im
   Wortschatz — sie sind keine Vokabeln. Genau sie machen aber die
   Hälfte jedes Satzes aus. Ohne sie blieb ein Lesetext löchrig.

   Diese Tabelle ist von Hand geprüft, Wort für Wort, gegen die
   Aussprache: langer Vokal = Strich, kurzer = Punkt. Sie steht
   ausdrücklich hier und nicht im Wörterbuch, weil „der" keine
   Vokabel ist, die man lernt, sondern ein Wort, das man liest.
   ============================================================ */
const KLEINE_WOERTER = {
  // Artikel und Begleiter
  der: "DER", die: "DIE", das: "DAS", den: "DEN", dem: "DEM", des: "DES",
  ein: "EIN", eine: "EI-ne", einen: "EI-nen", einem: "EI-nem", einer: "EI-ner",
  eines: "EI-nes", kein: "KEIN", keine: "KEI-ne", keinen: "KEI-nen", keiner: "KEI-ner",
  // Pronomen
  ich: "ICH", du: "DU", er: "ER", sie: "SIE", es: "ES", wir: "WIR", ihr: "IHR",
  mich: "MICH", dich: "DICH", uns: "UNS", euch: "EUCH", sich: "SICH",
  mir: "MIR", dir: "DIR", ihm: "IHM", ihn: "IHN", ihnen: "IH-nen",
  mein: "MEIN", dein: "DEIN", sein: "SEIN", unser: "UN-ser", euer: "EU-er",
  man: "MAN", wer: "WER", wen: "WEN", wem: "WEM", was: "WAS", wie: "WIE",
  wo: "WO", wann: "WANN", warum: "wa-RUM", wieso: "wie-SO", welche: "WEL-che",
  dieser: "DIE-ser", diese: "DIE-se", dieses: "DIE-ses", jener: "JE-ner",
  alle: "AL-le", allen: "AL-len", alles: "AL-les", jeder: "JE-der", jede: "JE-de",
  // Präpositionen
  an: "AN", auf: "AUF", aus: "AUS", bei: "BEI", bis: "BIS", durch: "DURCH",
  für: "FÜR", gegen: "GE-gen", hinter: "HIN-ter", in: "IN", mit: "MIT",
  nach: "NACH", neben: "NE-ben", ohne: "OH-ne", seit: "SEIT", über: "Ü-ber",
  um: "UM", unter: "UN-ter", von: "VON", vor: "VOR", während: "WÄH-rend",
  wegen: "WE-gen", zu: "ZU", zwischen: "ZWI-schen",
  am: "AM", ans: "ANS", beim: "BEIM", im: "IM", ins: "INS", vom: "VOM",
  zum: "ZUM", zur: "ZUR",
  // Konjunktionen und Partikeln
  und: "UND", oder: "O-der", aber: "A-ber", denn: "DENN", sondern: "SON-dern",
  dass: "DASS", weil: "WEIL", wenn: "WENN", als: "ALS", ob: "OB", damit: "da-MIT",
  obwohl: "ob-WOHL", also: "AL-so", doch: "DOCH", noch: "NOCH", nur: "NUR",
  auch: "AUCH", schon: "SCHON", nicht: "NICHT", nichts: "NICHTS", sehr: "SEHR",
  mehr: "MEHR", immer: "IM-mer", nie: "NIE", oft: "OFT", dann: "DANN",
  hier: "HIER", dort: "DORT", heute: "HEU-te", gestern: "GES-tern",
  morgen: "MOR-gen", jetzt: "JETZT", bald: "BALD", eben: "E-ben",
  // Hilfs- und Modalverben, die man ständig liest
  bin: "BIN", bist: "BIST", ist: "IST", sind: "SIND", seid: "SEID",
  war: "WAR", warst: "WARST", waren: "WA-ren", wart: "WART",
  habe: "HA-be", hast: "HAST", hat: "HAT", haben: "HA-ben", habt: "HABT",
  hatte: "HAT-te", hatten: "HAT-ten",
  werde: "WER-de", wirst: "WIRST", wird: "WIRD", werden: "WER-den",
  wurde: "WUR-de", wurden: "WUR-den", worden: "WOR-den",
  kann: "KANN", kannst: "KANNST", können: "KÖN-nen", konnte: "KONN-te",
  muss: "MUSS", musst: "MUSST", müssen: "MÜS-sen", musste: "MUSS-te",
  will: "WILL", willst: "WILLST", wollen: "WOL-len", wollte: "WOLL-te",
  soll: "SOLL", sollst: "SOLLST", sollen: "SOL-len", sollte: "SOLL-te",
  darf: "DARF", dürfen: "DÜR-fen", durfte: "DURF-te",
  mag: "MAG", mögen: "MÖ-gen", mochte: "MOCH-te",
};

function betonungNachschlagen(wort) {
  /* Erst die kleinen Wörter — sie stehen nicht im Wortschatz, machen
     aber den halben Satz aus. */
  const klein = String(wort).toLowerCase();
  if (Object.prototype.hasOwnProperty.call(KLEINE_WOERTER, klein)) return KLEINE_WOERTER[klein];
  if (!VocabData.WORDS || !VocabData.WORDS.length) return null;
  if (!betonungIndex || betonungIndexStand !== VocabData.WORDS.length) {
    betonungIndex = new Map();
    VocabData.WORDS.forEach((w) => {
      if (!w.word || !w.syl) return;
      /* Nur Angaben, die wirklich zur Schreibung passen. Bei
         Fremdwörtern steht in syl absichtlich eine Lautschrift
         („die Pizza" → „PIT-za"); die ist im Wörterbuch richtig, im
         Fließtext würde sie aber das geschriebene Wort verfälschen. */
      const nackt = String(w.word).replace(/^(der|die|das|sich)\s+/i, "").replace(/\s+/g, "");
      const ausSilben = String(w.syl).split("-").map((t) => t.replace(/^\*/, "")).join("");
      if (nackt.toLowerCase() !== ausSilben.toLowerCase()) return;
      const k = nackt.toLowerCase();
      if (!betonungIndex.has(k)) betonungIndex.set(k, w.syl);
    });
    betonungIndexStand = VocabData.WORDS.length;
  }
  return betonungIndex.get(String(wort).toLowerCase()) || null;
}

/* Gebeugte Formen tragen ihre Betonung an derselben Stelle wie die
   Grundform: „ABend" → „ABende", „ABbauen" → „er baut AB" bleibt am
   Stamm. Das ist keine Regel, die etwas errät — die betonte Silbe
   kommt weiter aus dem geprüften Wörterbucheintrag, sie wird nur auf
   die tatsächlich geschriebene Form übertragen. Übertragen wird
   ausschließlich dann, wenn die Buchstaben bis zum Ende der betonten
   Silbe wirklich übereinstimmen. */
function betonungAusGrundform(word) {
  const kandidaten = grundformKandidaten(word) || [];
  for (const kand of kandidaten) {
    const syl = betonungNachschlagen(kand);
    if (!syl) continue;
    const roh = String(syl).split("-");
    const silben = roh.map((x) => x.replace(/^\*/, ""));
    const idx = Core.betonteSilbenIndex(roh);
    if (idx < 0) continue;
    const bisEnde = silben.slice(0, idx + 1).join("").length;
    if (word.length < bisEnde) continue;
    if (word.slice(0, bisEnde).toLowerCase() !== silben.slice(0, idx + 1).join("").toLowerCase()) continue;
    /* Auch hier dieselbe Bildsprache wie überall: Punkt für kurz,
       Strich für lang — nicht der graue Unterstrich von früher. Die
       Silben bis zur betonten kommen aus dem Wörterbuch, der Rest der
       gebeugten Form hängt als eine Silbe hinten dran. */
    const bis = [];
    let k = 0;
    for (let i = 0; i <= idx; i++) {
      const stueck = word.slice(k, k + silben[i].length);
      k += silben[i].length;
      bis.push(i === idx ? grossMitEszett(stueck) : stueck.toLowerCase());
    }
    if (k < word.length) bis.push(word.slice(k).toLowerCase());
    const gesetzt = betonungAnzeigen(bis.join("-"));
    return word[0] === word[0].toUpperCase()
      ? gesetzt
      : gesetzt.replace(/(>|^)([A-ZÄÖÜ])/, (m, vor, b) => vor + b.toLowerCase());
  }
  return null;
}
/* ============================================================
   DER BETONUNGSSCHALTER IN JEDER SEKTION
   ------------------------------------------------------------
   GEWÜNSCHT: „Auch wenn man das in den Einstellungen nicht
   einstellt, soll man global in JEDER Sektion die Möglichkeit
   haben, die Betonung dazuzuschalten."

   Bisher gab es den Schalter nur in drei Lesebereichen. Jetzt
   hängt er von selbst oben in jeder Unteransicht — man muss nicht
   erst in die Einstellungen, um beim Vorlesen mit einer Klasse
   die Punkte und Striche zu sehen. Der Schalter wirkt genau in
   der Ansicht, in der er steht. */
/* Die Leiste, die sich früher von selbst oben in jede Ansicht setzte,
   gibt es nicht mehr. GEWÜNSCHT: „nimm dafür diese alten
   Betonungs-Buttons raus, die dem Nutzer impliziert haben, dass man
   über die Schaltfläche das an- und ausschaltet — die haben keine
   Funktion mehr … es soll halt alles intuitiv wie bei iOS sein, dass
   man einfach darauf klickt und dann bekommt man die Betonung
   angezeigt."  Die Funktion bleibt als leerer Platzhalter stehen,
   damit die bestehenden Aufrufe nicht ins Leere greifen. */
function betonungsSchalterEinhaengen(wurzel) {
  const ziel = wurzel || document;
  ziel.querySelectorAll(".sektion-betonung, .lese-betonung-knopf")
      .forEach((el) => el.remove());
}

/* ============================================================
   BETONUNG DURCH TIPPEN IN DEN TEXTKASTEN
   ------------------------------------------------------------
   GEWÜNSCHT: „dieser Buchstabe oben aus dem Head, dieses A — das
   ist total hässlich und deplatziert an der Stelle, das möchte ich
   nicht. Ich möchte, dass es eher wie bei Apple vom Design
   funktioniert, dass wenn man in einen Beitrag klickt, einfach in
   das Panel von dem Beitrag, in diese CSS-Box, dass sich die
   Betonung automatisch einschalten soll, ohne dass man einen Knopf
   dafür braucht — wenn man den noch mal anklickt, geht es wieder
   aus."

   Also: kein Knopf. Ein Tippen mitten in den Kasten schaltet die
   Betonung für GENAU DIESEN Kasten ein, ein zweites Tippen wieder
   aus. Damit dabei nichts kaputtgeht, bleibt alles ausgenommen, was
   selbst auf Berührung reagiert: Knöpfe, Links, Eingabefelder,
   Auswahlkästen, die antippbaren Wörter im Sammelmodus, und ein
   Tippen, mit dem gerade Text markiert wird.
   ============================================================ */
const BETONUNG_TIPP_HINWEIS = "dma_betonung_tipp_gesehen";
/* WELCHE KÄSTEN GERADE BETONT SIND.
   Gemerkt wird nicht am Element (das überlebt kein Neuzeichnen),
   sondern an einem Schlüssel, der den Kasten benennt. Genau darum ging
   es in der Meldung: „wenn man zuletzt auf den Zustand gekriegt hat,
   dass man die Betonung anzeigt, und dann auf dieser Basis sich Wörter
   heraussucht, die man in seinen Wortschatz übernehmen will, dann soll
   das möglich sein und bei dieser Anzeige auch bleiben, ohne dass sich
   die Anzeige ändert." Beim Umschalten des Sammelmodus wird der Text
   neu gezeichnet — mit diesem Gedächtnis kommt die Betonung danach von
   selbst zurück. Die beiden Systeme heben sich also nicht mehr auf. */
const betonungOffen = new Set();
function betonungSchluessel(kasten) {
  if (kasten.id) return "#" + kasten.id;
  const ansicht = kasten.closest(".subview, .view");
  const geschwister = ansicht ? [...ansicht.querySelectorAll(BETONUNG_KASTEN)] : [];
  const i = geschwister.indexOf(kasten);
  return (ansicht ? ansicht.id : "?") + ":" + (i >= 0 ? i : 0);
}
/* Woran ein Kasten erkannt wird. Bewusst weit gefasst: die Meldung war
   „bei sämtlichen anderen Texten, zum Beispiel in der Übersicht-Sektion,
   wenn man da in den Frame klickt, wird das nicht mit der Betonung
   übersetzt". Deshalb zählt jetzt auch jede Karte, jeder Beitrag und
   jeder Kasten mit erkennbarem Rahmen. */
const BETONUNG_KASTEN = [
  ".question-card", ".sammel-text", ".kal-karte", ".lesetext",
  ".about-card", ".profile-modal-card", ".tile-detail", ".kompass-karte",
  ".bw-wortkarte", ".dlg-satz", ".breakdown-list", ".witz-karte",
  ".material-card", ".link-card", ".tip-card", ".guestbook-entry",
  ".inbox-message", ".community-text", ".fst-karte", ".weg-karte",
].join(", ");
function betonungKastenTaugt(kasten) {
  if (!kasten) return false;
  const text = (kasten.innerText || "").trim();
  if (text.length < 40) return false;
  // Ein Kasten, der fast nur aus Knöpfen besteht, ist keine Lesefläche.
  const knoepfe = kasten.querySelectorAll("button, a, input, select, textarea").length;
  return knoepfe < 12;
}
/* Den passenden Kasten zu einer Berührung finden: den INNERSTEN, der
   genug Text hat. Sonst fänge die äußerste Karte alles ab und man
   könnte einzelne Beiträge nicht getrennt anschalten. */
function betonungKastenFinden(start) {
  let n = start;
  while (n && n !== document.body) {
    if (n.matches && n.matches(BETONUNG_KASTEN) && betonungKastenTaugt(n)) return n;
    n = n.parentElement;
  }
  return null;
}
/* Kästen, die jemand AUSDRÜCKLICH ausgeschaltet hat.
   ------------------------------------------------------------
   GEMELDET: „Wenn sie einmal da ist, kann man sie nicht wieder
   abwählen. Erst wenn man die Seite aktualisiert."

   Hier stand die Ursache:
       if (!isStressModeOn() && !leseBetonungAn()) removeStressFromTree(kasten);
   Das Ausschalten wurde also ÜBERSPRUNGEN, sobald irgendein
   globaler Betonungsmodus an war — und in „Es war einmal in
   Deutschland" ist er an. Der Klick tat dann sichtbar nichts.

   Die Regel muss andersherum lauten: ein Tipp auf den Kasten ist
   eine ausdrückliche Ansage für DIESEN Kasten und schlägt jede
   allgemeine Einstellung. Wer hier nichts sehen will, sieht hier
   nichts — auch wenn „überall anzeigen" an ist.

   Damit das ein Neuzeichnen überlebt (die Seite baut Ansichten
   ständig neu), wird es doppelt festgehalten: als Klasse am
   Kasten, damit applyStressToTree() ihn überspringt, und im
   Verzeichnis betonungAus, damit betonungWiederherstellen() die
   Klasse nach dem Neuzeichnen wieder anbringt. */
const betonungAus = new Set();

function betonungSetzen(kasten, an) {
  const schl = betonungSchluessel(kasten);
  kasten.classList.toggle("betonung-hier", an);
  kasten.classList.toggle("betonung-aus", !an);
  if (an) {
    betonungAus.delete(schl);
    betonungOffen.add(schl);
    const setzen = () => { if (kasten.isConnected && kasten.classList.contains("betonung-hier")) applyStressToTree(kasten); };
    /* holenFuer statt nachziehen: hier wird der Wortschatz auch
       angestossen, wenn er noch gar nicht lädt. */
    if (wortschatzHolenFuer(setzen) && !(VocabData.WORDS && VocabData.WORDS.length)) {
      kasten.classList.add("betonung-laedt");
      wortschatzBereit().then(() => kasten.classList.remove("betonung-laedt"))
                        .catch(() => kasten.classList.remove("betonung-laedt"));
    } else setzen();
  } else {
    betonungOffen.delete(schl);
    betonungAus.add(schl);
    /* IMMER entfernen. Ohne Bedingung — das war der Fehler. */
    removeStressFromTree(kasten);
  }
}
/* Nach jedem Neuzeichnen: was vorher betont war, ist es wieder. */
function betonungWiederherstellen(wurzel) {
  const ziel0 = wurzel || document;
  /* Zuerst das Ausgeschaltete: sonst legt ein globaler Modus die
     Betonung im selben Augenblick wieder darüber. */
  if (betonungAus.size) {
    ziel0.querySelectorAll(BETONUNG_KASTEN).forEach((kasten) => {
      if (!betonungAus.has(betonungSchluessel(kasten))) return;
      kasten.classList.add("betonung-aus");
      kasten.classList.remove("betonung-hier");
      removeStressFromTree(kasten);
    });
  }
  if (!betonungOffen.size) return;
  const ziel = wurzel || document;
  ziel.querySelectorAll(BETONUNG_KASTEN).forEach((kasten) => {
    if (!betonungKastenTaugt(kasten)) return;
    if (!betonungOffen.has(betonungSchluessel(kasten))) return;
    kasten.classList.add("betonung-hier");
    const setzen = () => { if (kasten.isConnected) applyStressToTree(kasten); };
    if (wortschatzNachziehen(setzen) && !(VocabData.WORDS && VocabData.WORDS.length)) { /* später */ }
    else setzen();
  });
}
function betonungTippen(ev) {
  // Alles, was selbst auf Berührung reagiert, bleibt unangetastet —
  // besonders .sammel-wort: dort sucht man sich Wörter für den eigenen
  // Wortschatz aus, und das darf die Betonung weder an- noch ausschalten.
  if (ev.target.closest("button, a, input, select, textarea, label, summary, [role='button'], [contenteditable], .sammel-wort, .speak-btn, svg")) return;
  // Wer Text markiert, will lesen, nicht schalten.
  const auswahl = window.getSelection && window.getSelection();
  if (auswahl && String(auswahl).trim().length > 1) return;
  const kasten = betonungKastenFinden(ev.target);
  if (!kasten) return;
  const an = !kasten.classList.contains("betonung-hier");
  betonungSetzen(kasten, an);
  if (an) {
    let gesehen = false;
    try { gesehen = localStorage.getItem(BETONUNG_TIPP_HINWEIS) === "1"; } catch (e) {}
    if (!gesehen) {
      showToast("🔤 Betonung an — Punkt heißt kurz, Strich heißt lang. Noch einmal in den Kasten tippen macht sie wieder aus.");
      try { localStorage.setItem(BETONUNG_TIPP_HINWEIS, "1"); } catch (e) {}
    }
  }
}
/* Die Seite zeichnet ständig Teile neu (Sammelmodus, Niveauwechsel,
   Sprachwechsel). Ein Beobachter stellt die Betonung danach wieder her,
   ohne dass jede einzelne Render-Stelle daran denken muss. */
function betonungBeobachten() {
  let geplant = false;
  const beobachter = new MutationObserver(() => {
    if (geplant || (!betonungOffen.size && !betonungAus.size)) return;
    geplant = true;
    setTimeout(() => { geplant = false; betonungWiederherstellen(); }, 120);
  });
  beobachter.observe(document.body, { childList: true, subtree: true });
}

export { betonungAusGrundform, betonungBeobachten, betonungNachschlagen, betonungTippen, betonungsSchalterEinhaengen };
