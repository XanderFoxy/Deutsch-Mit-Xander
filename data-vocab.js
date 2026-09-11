/* =========================================================
   DATA — VOKABELN, KOMPASS, MATERIALIEN, LINKS
   ========================================================= */

const VocabData = (function () {
  "use strict";

  // Vokabeltrainer — Starter-Set der nützlichsten Wörter.
  // stress: Betonungssilbe fett markiert über Großschreibung im Kommentar-Feld "syl".
  const WORDS = [];
  /* ============================================================
     Das Wörterbuch wird NICHT mehr beim Start geladen.
     ------------------------------------------------------------
     Die Liste ist auf über 15.000 Einträge gewachsen; als eine
     Datei waren das 3,6 MB, die das Handy bei JEDEM Start
     herunterladen und parsen musste — die mit Abstand teuerste
     Datei der App. Gebraucht wird sie aber erst, wenn jemand das
     Wörterbuch, den Vokabeltrainer, den Betonungs-Trainer oder
     ein Wortspiel öffnet.

     Jetzt liegt jedes Thema in vokabeln/<datei>.js (rund 130 kB)
     und wird bei Bedarf nachgeladen. Wer nur eine Kategorie
     ansieht, lädt auch nur diese eine Datei; wer den
     Vokabeltrainer startet, bekommt über ladeWoerter() alle
     Themen parallel.

     WORDS bleibt dabei dasselbe Array-Objekt — es wird gefüllt,
     nie ersetzt. Wer eine Referenz darauf hält, sieht die Wörter
     also, sobald sie da sind. Zwischenspeicher, die aus WORDS
     aufgebaut werden, merken sich zusätzlich WORDS.length und
     bauen sich nach dem Nachladen neu auf.
     ============================================================ */
  const VOKABEL_THEMEN = [["Alltag & Zuhause","teil-1"],["Bildung & Lernen","teil-1"],["Denken & Argumentieren","teil-4"],["Essen & Trinken","teil-1"],["Familie & Menschen","teil-2"],["Freizeit & Sport","teil-5"],["Gefühle & Charakter","teil-3"],["Geschichte & Erinnerung","teil-4"],["Gesundheit & Körper","teil-2"],["Grundwörter & Struktur","teil-2"],["Kleidung & Einkaufen","teil-4"],["Kunst & Musik","teil-2"],["Länder & Welt","teil-6"],["Literatur & Schreiben","teil-5"],["Medien & Öffentlichkeit","teil-5"],["Natur & Wetter","teil-5"],["Politik & Gesellschaft","teil-2"],["Recht & Verwaltung","teil-3"],["Reisen & Unterwegs","teil-1"],["Sprache & Kommunikation","teil-4"],["Stadt & Verkehr","teil-3"],["Technik & Erfindung","teil-3"],["Umwelt & Klima","teil-5"],["Wirtschaft & Arbeit","teil-3"],["Wissenschaft & Forschung","teil-4"],["Zeit & Kalender","teil-1"]];
  const geladeneThemen = {};
  const laufendeThemen = {};
  function themaDatei(thema) {
    const t = VOKABEL_THEMEN.find((x) => x[0] === thema);
    return t ? t[1] : null;
  }
  function themaEinfuegen(thema) {
    const teil = (window.DMA_VOKABELN || {})[thema];
    if (!teil || geladeneThemen[thema]) return;
    geladeneThemen[thema] = true;
    for (let i = 0; i < teil.length; i++) WORDS.push(teil[i]);
  }
  function ladeThema(thema) {
    if (geladeneThemen[thema]) return Promise.resolve(true);
    if (laufendeThemen[thema]) return laufendeThemen[thema];
    const datei = themaDatei(thema);
    if (!datei) return Promise.resolve(false);
    laufendeThemen[thema] = new Promise((fertig) => {
      const s = document.createElement('script');
      s.src = 'vokabeln/' + datei + '.js?v=' + (window.DMA_VERSION || '1');
      s.async = true;
      s.onload = () => {
        // Eine Datei enthält mehrere Themen — alle einhängen, nicht nur das
        // angefragte, sonst würde dieselbe Datei später erneut geladen.
        VOKABEL_THEMEN.forEach((t) => { if (t[1] === datei) themaEinfuegen(t[0]); });
        fertig(true);
      };
      s.onerror = () => {
        // Fehlt eine Datei, bleibt dieses Thema leer statt die App zu brechen.
        console.warn('Vokabelteil fehlt: ' + datei);
        laufendeThemen[thema] = null;
        fertig(false);
      };
      document.head.appendChild(s);
    });
    return laufendeThemen[thema];
  }
  let alleLaufen = null;
  function ladeWoerter() {
    if (alleLaufen) return alleLaufen;
    alleLaufen = Promise.all(VOKABEL_THEMEN.map((t) => ladeThema(t[0]))).then(() => WORDS.length > 0);
    return alleLaufen;
  }
  function woerterDa() { return WORDS.length > 0; }
  // Läuft das Nachladen schon? Ansichten, die sich nachzeichnen wollen,
  // fragen das ab, damit sie das Laden nicht selbst auslösen — angestoßen
  // wird es genau einmal, beim Wechsel nach „Lernen" oder „Wissen".
  function ladenLaeuft() { return Boolean(alleLaufen); }
  function alleThemenDa() { return VOKABEL_THEMEN.every((t) => geladeneThemen[t[0]]); }
  function themenListe() { return VOKABEL_THEMEN.map((t) => t[0]); };

  // Kompass — Partikeln & Nuancen
  const PARTIKELN = [
    { word: "doch", explain: "Widerspruch, Bestätigung oder Nachdruck.", example: "„Kommst du nicht?“ – „Doch, ich komme!“", syl: "doch" },
    { word: "ja", explain: "Betont etwas als bekannt/offensichtlich.", example: "Das ist ja wunderschön hier!", syl: "ja" },
    { word: "denn", explain: "Macht Fragen freundlicher/interessierter.", example: "Wie geht es dir denn?", syl: "denn" },
    { word: "mal", explain: "Macht Aufforderungen beiläufiger, weniger streng.", example: "Komm mal her.", syl: "mal" },
    { word: "eben", explain: "Drückt Zustimmung zu einer nicht änderbaren Tatsache aus.", example: "So ist das eben.", syl: "E-ben" },
    { word: "halt", explain: "Ähnlich wie „eben“ — süddeutsch geprägt.", example: "Das ist halt so.", syl: "halt" },
    { word: "eigentlich", de: "im Grunde genommen, ursprünglich gedacht", explain: "Leitet eine Einschränkung oder Themenwechsel ein.", example: "Eigentlich wollte ich früher gehen.", syl: "EI-gent-lich" , level: "A2", theme: "Grundwörter & Struktur" },
    { word: "na ja", explain: "Zögern, leichte Skepsis oder Relativierung.", example: "Na ja, so toll war es auch nicht.", syl: "NA ja" },
    { word: "ach so", explain: "Plötzliches Verstehen.", example: "Ach so, jetzt verstehe ich!", syl: "ACH so" },
    { word: "tja", explain: "Resignation oder Ratlosigkeit.", example: "Tja, das war's dann wohl.", syl: "tja" },
    { word: "ruhig", explain: "Erlaubnis, etwas ohne Bedenken zu tun.", example: "Du kannst ruhig fragen.", syl: "RU-hig" },
    { word: "wohl", explain: "Vermutung, Unsicherheit.", example: "Das wird wohl stimmen.", syl: "wohl" },
    { word: "nah", explain: "Umgangssprachliches, kurzes „Nein“ — eine lockere Reaktion, kein förmliches „Nein, danke“.", example: "„Kommst du mit ins Kino?“ – „Nah, keine Lust heute.“", syl: "nah" , level: "A2", theme: "Grundwörter & Struktur" },
    { word: "ja ja", explain: "Als kurze, genervte Reaktion: Zweifel oder Ungeduld — man glaubt der Person gerade nicht wirklich (z. B. wenn jemand ständig verspricht, sich zu bessern, aber es nie tut). Diese leicht abwertende Verwendung ist stark durch den deutschen Kultfilm „Werner – Beinhart!“ aus den 1990ern geprägt und dadurch bis heute Teil der Popkultur — viele jüngere Menschen kennen den Ton, weil ihre Eltern mit dem Film aufgewachsen sind. Vorsicht: „ja ja“ kann je nach Tonfall auch ganz anders gemeint sein — nämlich als warme, wohlwollende Bestätigung (etwa: „Ja ja, mach ich gerne für dich.“). Der Klang entscheidet über die Bedeutung.", example: "„Ich fang morgen wirklich mit dem Sport an!“ – „Ja ja, das kenn ich schon…“", syl: "ja ja" },
  ];

  // Materialien — kompakte Grammatik-Referenzkarten
  const MATERIALS = [
    {
      title: "Peter und der Wolf",
      body: "Eine klassische Geschichte zum Deutschlernen — auf das Cover tippen, um die ganze Erzählung zu lesen.",
      type: "story",
      coverImage: "https://github.com/XanderFoxy/Deutsch/blob/main/Bilder2/IMG_1206.jpeg?raw=true",
      fullImage: "https://github.com/XanderFoxy/Deutsch/blob/main/Bilder2/08F0448F-C2C5-44E1-B80D-7BA5E0525FE9.png?raw=true",
    },
    {
      title: "Deutschland-Toolbox",
      body: "Eine visuelle Übersicht der wichtigsten Alltagsbegriffe — antippen für die Großansicht.",
      type: "preview",
      image: "https://github.com/XanderFoxy/Deutsch/blob/main/Bilder2/9C6B2BCE-2AE7-486A-B0F0-D62D1D3701EA.png?raw=true",
    },
    {
      title: "Die 4 Fälle (Kasus)",
      body: "Nominativ (wer/was — Subjekt), Akkusativ (wen/was — direktes Objekt), Dativ (wem — indirektes Objekt), Genitiv (wessen — Besitz). Beispiel: Der Mann (Nom.) gibt der Frau (Dat.) den Blumenstrauß (Akk.) des Nachbarn (Gen.).",
    },
    {
      title: "Verbstellung im Satz",
      body: "Hauptsatz: Verb an Position 2 (Ich gehe heute ins Kino). Nebensatz: Verb am Ende (…, weil ich heute ins Kino gehe). W-Frage: Verb an Position 2 nach dem Fragewort.",
    },
    {
      title: "Perfekt bilden",
      body: "haben/sein + Partizip II. Die meisten Verben nutzen „haben“. „Sein“ nutzen Bewegungsverben (gehen, fahren, kommen) und Zustandsänderungen (aufwachen, sterben, werden).",
    },
    {
      title: "Adjektivendungen (Grundmuster)",
      body: "Nach „der/die/das“: schwache Endung meist -e/-en. Nach „ein/kein“ + Possessiv: gemischte Deklination. Ohne Artikel: starke Endung, die den Artikel „ersetzt“.",
    },
  ];

  // Kompass — kleine Auswahl beliebter Redewendungen (Kurzüberblick;
  // die vollständigen 30 mit Multiple-Choice-Abfrage stecken in der Übungskategorie "Redewendungen")
  const REDEWENDUNGEN_KURZ = [
    { phrase: "Da liegt der Hund begraben.", explain: "Das ist der eigentliche Grund für ein Problem.", example: "Ah, da liegt also der Hund begraben!" },
    { phrase: "Die Daumen drücken.", explain: "Jemandem Glück wünschen.", example: "Ich drück dir die Daumen für die Prüfung." },
    { phrase: "Ins kalte Wasser springen.", explain: "Etwas Neues ohne viel Vorbereitung wagen.", example: "Beim neuen Job bin ich einfach ins kalte Wasser gesprungen." },
    { phrase: "Die Nase voll haben.", explain: "Von etwas genervt sein.", example: "Ich hab die Nase voll von dem Regen." },
    { phrase: "Schwein haben.", explain: "Glück haben.", example: "Da hast du aber Schwein gehabt!" },
    { phrase: "Kein Blatt vor den Mund nehmen.", explain: "Offen und direkt seine Meinung sagen.", example: "Sie nimmt nie ein Blatt vor den Mund." },
  ];

  // Kompass — Umgangssprache & Jugendsprache
  const JUGENDSPRACHE = [
    { word: "chillen", explain: "sich entspannen, nichts tun", example: "Lass uns heute einfach chillen." },
    { word: "Digga / Alter", explain: "lockere, freundschaftliche Anrede", example: "Was geht, Digga?" },
    { word: "Bock haben (auf)", explain: "Lust haben auf etwas", example: "Ich hab keinen Bock auf Hausaufgaben." },
    { word: "flexen", explain: "mit etwas angeben, protzen", example: "Er flext mit seinem neuen Handy." },
    { word: "krass", explain: "beeindruckend oder heftig (positiv wie negativ)", example: "Das war echt krass, dieser Film!" },
    { word: "läuft bei dir", explain: "anerkennende Reaktion auf etwas Gutes", example: "Neuer Job? Läuft bei dir!" },
    { word: "cringe", explain: "fremdschämen, unangenehm peinlich", example: "Der Auftritt war so cringe." },
    { word: "Babo", explain: "der Chef, die Anführerin/der Anführer", example: "Sie ist die Babo in der Gruppe." },
    { word: "auf jeden (Fall)", explain: "klare Zustimmung", example: "Kommst du mit? – Auf jeden!" },
    { word: "sus", explain: "verdächtig, komisch (aus dem Spiel Among Us)", example: "Der Typ ist voll sus." },
    { word: "Sigma", explain: "(ironisch) ein unabhängiger, cooler Typ", example: "Er tut so, als wäre er der Sigma der Klasse." },
    { word: "low-key", explain: "irgendwie, ein bisschen, heimlich", example: "Ich bin low-key genervt davon." },
    { word: "high-key", explain: "total, ganz offensichtlich", example: "Ich hab high-key keine Lust mehr." },
    { word: "Aura", explain: "Ausstrahlung/Coolness-Punkte (oft ironisch gezählt)", example: "Das hat ihm richtig Aura gebracht." },
    { word: "goofy", explain: "albern, tollpatschig auf sympathische Art", example: "Er ist manchmal richtig goofy." },
    { word: "NPC", explain: "jemand, der sich uninteressant/vorhersehbar verhält", example: "Hör auf, dich wie ein NPC zu verhalten." },
    { word: "mid", explain: "mittelmäßig, nicht besonders gut", example: "Der Film war ehrlich gesagt mid." },
    { word: "Rizz", explain: "Charisma, Charme beim Flirten", example: "Er hat einfach Rizz." },
    { word: "krank (positiv gemeint)", explain: "beeindruckend, verrückt gut", example: "Das Konzert war einfach krank." },
    { word: "based", explain: "(ironisch) mutig die eigene Meinung vertretend, cool", example: "Ehrliche Antwort, das ist based." },
  ];

  // Hobbys & Interessen fürs Profil — bewusst mit Artikel gezeigt,
  // damit man das Genus nebenbei mitlernt (kleiner Lern-Kniff).
  // Herkunftsländer fürs Profil — Land + Sprache, damit man sieht wer woher kommt
  // Vollständige, alphabetisch sortierte Liste aller anerkannten Staaten der Welt (UN-Mitglieder
  // plus einige weitere wie Vatikanstadt/Taiwan) — vorher waren nur 26 der häufigsten Länder
  // gelistet, was z. B. Ägypten fehlen ließ. "Deutschland", "Österreich" und "Schweiz" stehen
  // bewusst ZUERST (vor der alphabetischen Liste), da sie für Deutschlernende am relevantesten
  // sind und so nicht in einer langen Liste gesucht werden müssen.
  const COUNTRIES = [
    { name: "Deutschland", flag: "🇩🇪", syl: "DEUTSCH-land" }, { name: "Österreich", flag: "🇦🇹", syl: "ÖS-ter-reich" }, { name: "Schweiz", flag: "🇨🇭", syl: "Schweiz" },
    { name: "Afghanistan", flag: "🇦🇫", syl: "Af-GHA-ni-stan" }, { name: "Ägypten", flag: "🇪🇬", syl: "Ä-GYP-ten" }, { name: "Albanien", flag: "🇦🇱", syl: "Al-BA-ni-en" },
    { name: "Algerien", flag: "🇩🇿", syl: "Al-GE-ri-en" }, { name: "Andorra", flag: "🇦🇩", syl: "An-DOR-ra" }, { name: "Angola", flag: "🇦🇴", syl: "An-GO-la" },
    { name: "Antigua und Barbuda", flag: "🇦🇬", syl: "an-TI-gua und bar-BU-da" }, { name: "Äquatorialguinea", flag: "🇬🇶", syl: "Ä-qua-to-ri-AL-gui-nea" }, { name: "Argentinien", flag: "🇦🇷", syl: "Ar-gen-TI-ni-en" },
    { name: "Armenien", flag: "🇦🇲", syl: "Ar-ME-ni-en" }, { name: "Aserbaidschan", flag: "🇦🇿", syl: "A-ser-bai-DSCHAN" }, { name: "Äthiopien", flag: "🇪🇹", syl: "Ä-thi-O-pi-en" },
    { name: "Australien", flag: "🇦🇺", syl: "Aus-TRA-li-en" }, { name: "Bahamas", flag: "🇧🇸", syl: "Ba-HA-mas" }, { name: "Bahrain", flag: "🇧🇭", syl: "Bah-RAIN" },
    { name: "Bangladesch", flag: "🇧🇩", syl: "BANG-la-desch" }, { name: "Barbados", flag: "🇧🇧", syl: "Bar-BA-dos" }, { name: "Belgien", flag: "🇧🇪", syl: "BEL-gi-en" },
    { name: "Belize", flag: "🇧🇿", syl: "Be-LI-ze" }, { name: "Benin", flag: "🇧🇯", syl: "Be-NIN" }, { name: "Bhutan", flag: "🇧🇹", syl: "BHU-tan" },
    { name: "Bolivien", flag: "🇧🇴", syl: "Bo-LI-vi-en" }, { name: "Bosnien und Herzegowina", flag: "🇧🇦", syl: "BOS-ni-en und Her-tze-go-WI-na" }, { name: "Botsuana", flag: "🇧🇼", syl: "Bo-tsu-A-na" },
    { name: "Brasilien", flag: "🇧🇷", syl: "Bra-SI-li-en" }, { name: "Brunei", flag: "🇧🇳", syl: "Bru-NEI" }, { name: "Bulgarien", flag: "🇧🇬", syl: "Bul-GA-ri-en" },
    { name: "Burkina Faso", flag: "🇧🇫", syl: "Bur-KI-na FA-so" }, { name: "Burundi", flag: "🇧🇮", syl: "Bu-RUN-di" }, { name: "Chile", flag: "🇨🇱", syl: "CHI-le" },
    { name: "China", flag: "🇨🇳", syl: "CHI-na" }, { name: "Costa Rica", flag: "🇨🇷", syl: "COS-ta RI-ca" }, { name: "Dänemark", flag: "🇩🇰", syl: "DÄ-ne-mark" },
    { name: "Dominica", flag: "🇩🇲", syl: "Do-MI-ni-ca" }, { name: "Dominikanische Republik", flag: "🇩🇴", syl: "Do-mi-ni-KA-ni-sche Re-pu-BLIK" }, { name: "Dschibuti", flag: "🇩🇯", syl: "Dschi-BU-ti" },
    { name: "Ecuador", flag: "🇪🇨", syl: "E-cua-DOR" }, { name: "El Salvador", flag: "🇸🇻", syl: "El SAL-va-dor" }, { name: "Elfenbeinküste", flag: "🇨🇮", syl: "EL-fen-bein-küs-te" },
    { name: "Eritrea", flag: "🇪🇷", syl: "E-ri-TRE-a" }, { name: "Estland", flag: "🇪🇪", syl: "EST-land" }, { name: "Eswatini", flag: "🇸🇿", syl: "Es-wa-TI-ni" },
    { name: "Fidschi", flag: "🇫🇯", syl: "FID-schi" }, { name: "Finnland", flag: "🇫🇮", syl: "FINN-land" }, { name: "Frankreich", flag: "🇫🇷", syl: "FRANK-reich" },
    { name: "Gabun", flag: "🇬🇦", syl: "Ga-BUN" }, { name: "Gambia", flag: "🇬🇲", syl: "GAM-bi-a" }, { name: "Georgien", flag: "🇬🇪", syl: "Ge-OR-gi-en" },
    { name: "Ghana", flag: "🇬🇭", syl: "GHA-na" }, { name: "Grenada", flag: "🇬🇩", syl: "Gre-NA-da" }, { name: "Griechenland", flag: "🇬🇷", syl: "GRIE-chen-land" },
    { name: "Guatemala", flag: "🇬🇹", syl: "Gua-te-MA-la" }, { name: "Guinea", flag: "🇬🇳", syl: "Gui-NE-a" }, { name: "Guinea-Bissau", flag: "🇬🇼", syl: "Gui-NE-a-Bis-SAU" },
    { name: "Guyana", flag: "🇬🇾", syl: "Guy-A-na" }, { name: "Haiti", flag: "🇭🇹", syl: "HA-i-ti" }, { name: "Honduras", flag: "🇭🇳", syl: "HON-du-ras" },
    { name: "Indien", flag: "🇮🇳", syl: "IN-di-en" }, { name: "Indonesien", flag: "🇮🇩", syl: "In-do-NE-si-en" }, { name: "Irak", flag: "🇮🇶", syl: "I-RAK" },
    { name: "Iran", flag: "🇮🇷", syl: "I-RAN" }, { name: "Irland", flag: "🇮🇪", syl: "IR-land" }, { name: "Island", flag: "🇮🇸", syl: "IS-land" },
    { name: "Israel", flag: "🇮🇱", syl: "IS-ra-el" }, { name: "Italien", flag: "🇮🇹", syl: "I-TA-li-en" }, { name: "Jamaika", flag: "🇯🇲", syl: "Ja-MAI-ka" },
    { name: "Japan", flag: "🇯🇵", syl: "JA-pan" }, { name: "Jemen", flag: "🇾🇪", syl: "JE-men" }, { name: "Jordanien", flag: "🇯🇴", syl: "Jor-DA-ni-en" },
    { name: "Kambodscha", flag: "🇰🇭", syl: "Kam-BOD-scha" }, { name: "Kamerun", flag: "🇨🇲", syl: "Ka-me-RUN" }, { name: "Kanada", flag: "🇨🇦", syl: "KA-na-da" },
    { name: "Kap Verde", flag: "🇨🇻", syl: "Kap VER-de" }, { name: "Kasachstan", flag: "🇰🇿", syl: "Ka-SACH-stan" }, { name: "Katar", flag: "🇶🇦", syl: "KA-tar" },
    { name: "Kenia", flag: "🇰🇪", syl: "KE-ni-a" }, { name: "Kirgisistan", flag: "🇰🇬", syl: "Kir-GI-si-stan" }, { name: "Kiribati", flag: "🇰🇮", syl: "Ki-ri-BA-ti" },
    { name: "Kolumbien", flag: "🇨🇴", syl: "Ko-LUM-bi-en" }, { name: "Komoren", flag: "🇰🇲", syl: "Ko-MO-ren" }, { name: "Kongo, Demokratische Republik", flag: "🇨🇩", syl: "KON-go, De-mo-KRA-ti-sche Re-pu-BLIK" },
    { name: "Kongo, Republik", flag: "🇨🇬", syl: "KON-go, Re-pu-BLIK" }, { name: "Nordkorea", flag: "🇰🇵", syl: "NORD-ko-re-a" }, { name: "Südkorea", flag: "🇰🇷", syl: "SÜD-ko-re-a" },
    { name: "Kosovo", flag: "🇽🇰", syl: "KO-so-vo" }, { name: "Kroatien", flag: "🇭🇷", syl: "Kro-A-ti-en" }, { name: "Kuba", flag: "🇨🇺", syl: "KU-ba" },
    { name: "Kuwait", flag: "🇰🇼", syl: "Ku-WAIT" }, { name: "Laos", flag: "🇱🇦", syl: "LA-os" }, { name: "Lesotho", flag: "🇱🇸", syl: "Le-SO-tho" },
    { name: "Lettland", flag: "🇱🇻", syl: "LETT-land" }, { name: "Libanon", flag: "🇱🇧", syl: "LI-ba-non" }, { name: "Liberia", flag: "🇱🇷", syl: "Li-BE-ri-a" },
    { name: "Libyen", flag: "🇱🇾", syl: "LI-by-en" }, { name: "Liechtenstein", flag: "🇱🇮", syl: "LIECH-ten-stein" }, { name: "Litauen", flag: "🇱🇹", syl: "LI-tau-en" },
    { name: "Luxemburg", flag: "🇱🇺", syl: "LU-xem-burg" }, { name: "Madagaskar", flag: "🇲🇬", syl: "Ma-da-GAS-kar" }, { name: "Malawi", flag: "🇲🇼", syl: "Ma-LA-wi" },
    { name: "Malaysia", flag: "🇲🇾", syl: "Ma-LAY-si-a" }, { name: "Malediven", flag: "🇲🇻", syl: "Ma-le-DI-ven" }, { name: "Mali", flag: "🇲🇱", syl: "MA-li" },
    { name: "Malta", flag: "🇲🇹", syl: "MAL-ta" }, { name: "Marokko", flag: "🇲🇦", syl: "Ma-ROK-ko" }, { name: "Marshallinseln", flag: "🇲🇭", syl: "MAR-shall-in-seln" },
    { name: "Mauretanien", flag: "🇲🇷", syl: "Mau-re-TA-ni-en" }, { name: "Mauritius", flag: "🇲🇺", syl: "Mau-RI-ti-us" }, { name: "Mexiko", flag: "🇲🇽", syl: "ME-xi-ko" },
    { name: "Mikronesien", flag: "🇫🇲", syl: "Mi-kro-NE-si-en" }, { name: "Moldau", flag: "🇲🇩", syl: "MOL-dau" }, { name: "Monaco", flag: "🇲🇨", syl: "MO-na-co" },
    { name: "Mongolei", flag: "🇲🇳", syl: "Mon-go-LEI" }, { name: "Montenegro", flag: "🇲🇪", syl: "Mon-te-NE-gro" }, { name: "Mosambik", flag: "🇲🇿", syl: "Mo-sam-BIK" },
    { name: "Myanmar", flag: "🇲🇲", syl: "MYAN-mar" }, { name: "Namibia", flag: "🇳🇦", syl: "Na-MI-bi-a" }, { name: "Nauru", flag: "🇳🇷", syl: "Na-U-ru" },
    { name: "Nepal", flag: "🇳🇵", syl: "NE-pal" }, { name: "Neuseeland", flag: "🇳🇿", syl: "NEU-see-land" }, { name: "Nicaragua", flag: "🇳🇮", syl: "Ni-ca-RA-gua" },
    { name: "Niederlande", flag: "🇳🇱", syl: "NIE-der-lan-de" }, { name: "Niger", flag: "🇳🇪", syl: "NI-ger" }, { name: "Nigeria", flag: "🇳🇬", syl: "Ni-GE-ri-a" },
    { name: "Nordmazedonien", flag: "🇲🇰", syl: "NORD-ma-ze-do-ni-en" }, { name: "Norwegen", flag: "🇳🇴", syl: "NOR-we-gen" }, { name: "Oman", flag: "🇴🇲", syl: "O-MAN" },
    { name: "Pakistan", flag: "🇵🇰", syl: "PA-ki-stan" }, { name: "Palau", flag: "🇵🇼", syl: "Pa-LAU" }, { name: "Palästina", flag: "🇵🇸", syl: "Pa-läs-TI-na" },
    { name: "Panama", flag: "🇵🇦", syl: "PA-na-ma" }, { name: "Papua-Neuguinea", flag: "🇵🇬", syl: "PA-pu-a-Neu-gui-NE-a" }, { name: "Paraguay", flag: "🇵🇾", syl: "PA-ra-guay" },
    { name: "Peru", flag: "🇵🇪", syl: "Pe-RU" }, { name: "Philippinen", flag: "🇵🇭", syl: "Phi-lip-PI-nen" }, { name: "Polen", flag: "🇵🇱", syl: "PO-len" },
    { name: "Portugal", flag: "🇵🇹", syl: "POR-tu-gal" }, { name: "Ruanda", flag: "🇷🇼", syl: "Ru-AN-da" }, { name: "Rumänien", flag: "🇷🇴", syl: "Ru-MÄ-ni-en" },
    { name: "Russland", flag: "🇷🇺", syl: "RUSS-land" }, { name: "Salomonen", flag: "🇸🇧", syl: "Sa-lo-MO-nen" }, { name: "Sambia", flag: "🇿🇲", syl: "SAM-bi-a" },
    { name: "Samoa", flag: "🇼🇸", syl: "Sa-MO-a" }, { name: "San Marino", flag: "🇸🇲", syl: "San Ma-RI-no" }, { name: "São Tomé und Príncipe", flag: "🇸🇹", syl: "São To-MÉ und PRIN-ci-pe" },
    { name: "Saudi-Arabien", flag: "🇸🇦", syl: "SAU-di-A-ra-bi-en" }, { name: "Schweden", flag: "🇸🇪", syl: "SCHWE-den" }, { name: "Senegal", flag: "🇸🇳", syl: "Se-ne-GAL" },
    { name: "Serbien", flag: "🇷🇸", syl: "SER-bi-en" }, { name: "Seychellen", flag: "🇸🇨", syl: "Sey-CHEL-len" }, { name: "Sierra Leone", flag: "🇸🇱", syl: "Si-ER-ra Le-O-ne" },
    { name: "Simbabwe", flag: "🇿🇼", syl: "Sim-BAB-we" }, { name: "Singapur", flag: "🇸🇬", syl: "SIN-ga-pur" }, { name: "Slowakei", flag: "🇸🇰", syl: "Slo-wa-KEI" },
    { name: "Slowenien", flag: "🇸🇮", syl: "Slo-WE-ni-en" }, { name: "Somalia", flag: "🇸🇴", syl: "So-MA-li-a" }, { name: "Spanien", flag: "🇪🇸", syl: "SPA-ni-en" },
    { name: "Sri Lanka", flag: "🇱🇰", syl: "Sri LAN-ka" }, { name: "St. Kitts und Nevis", flag: "🇰🇳", syl: "St. Kitts und NE-vis" }, { name: "St. Lucia", flag: "🇱🇨", syl: "St. LU-ci-a" },
    { name: "St. Vincent und die Grenadinen", flag: "🇻🇨", syl: "St. VIN-cent und die Gre-na-DI-nen" }, { name: "Südafrika", flag: "🇿🇦", syl: "SÜD-a-fri-ka" }, { name: "Sudan", flag: "🇸🇩", syl: "Su-DAN" },
    { name: "Südsudan", flag: "🇸🇸", syl: "SÜD-su-dan" }, { name: "Suriname", flag: "🇸🇷", syl: "Su-ri-NA-me" }, { name: "Syrien", flag: "🇸🇾", syl: "SY-ri-en" },
    { name: "Tadschikistan", flag: "🇹🇯", syl: "Ta-DSCHI-ki-stan" }, { name: "Taiwan", flag: "🇹🇼", syl: "TAI-wan" }, { name: "Tansania", flag: "🇹🇿", syl: "Tan-sa-NI-a" },
    { name: "Thailand", flag: "🇹🇭", syl: "THAI-land" }, { name: "Timor-Leste", flag: "🇹🇱", syl: "TI-mor-LES-te" }, { name: "Togo", flag: "🇹🇬", syl: "TO-go" },
    { name: "Tonga", flag: "🇹🇴", syl: "TON-ga" }, { name: "Trinidad und Tobago", flag: "🇹🇹", syl: "TRI-ni-dad und To-BA-go" }, { name: "Tschad", flag: "🇹🇩", syl: "Tschad" },
    { name: "Tschechien", flag: "🇨🇿", syl: "TSCHE-chi-en" }, { name: "Tunesien", flag: "🇹🇳", syl: "Tu-NE-si-en" }, { name: "Türkei", flag: "🇹🇷", syl: "Tür-KEI" },
    { name: "Turkmenistan", flag: "🇹🇲", syl: "Turk-ME-ni-stan" }, { name: "Tuvalu", flag: "🇹🇻", syl: "Tu-VA-lu" }, { name: "Uganda", flag: "🇺🇬", syl: "U-GAN-da" },
    { name: "Ukraine", flag: "🇺🇦", syl: "Ukra-I-ne" }, { name: "Ungarn", flag: "🇭🇺", syl: "UN-garn" }, { name: "Uruguay", flag: "🇺🇾", syl: "U-ru-guay" },
    { name: "USA", flag: "🇺🇸", syl: "U-S-A" }, { name: "Usbekistan", flag: "🇺🇿", syl: "Us-BE-ki-stan" }, { name: "Vanuatu", flag: "🇻🇺", syl: "Va-nu-A-tu" },
    { name: "Vatikanstadt", flag: "🇻🇦", syl: "Va-ti-KAN-stadt" }, { name: "Venezuela", flag: "🇻🇪", syl: "Ve-ne-tzu-E-la" }, { name: "Vereinigte Arabische Emirate", flag: "🇦🇪", syl: "Ver-EI-nig-te A-RA-bi-sche E-mi-RA-te" },
    { name: "Vereinigtes Königreich", flag: "🇬🇧", syl: "Ver-EI-nig-tes KÖ-nig-reich" }, { name: "Vietnam", flag: "🇻🇳", syl: "Viet-NAM" }, { name: "Weißrussland", flag: "🇧🇾", syl: "WEISS-russ-land" },
    { name: "Zentralafrikanische Republik", flag: "🇨🇫", syl: "Zen-tral-a-fri-KA-ni-sche Re-pu-BLIK" },
    { name: "Zypern", flag: "🇨🇾", syl: "TZY-pern" },
    { name: "Sonstiges", flag: "🌍", syl: "SON-sti-ges" },
  ];

  const HOBBIES = [
    { noun: "Kunst", article: "die", emoji: "🎨", syl: "Kunst" },
    { noun: "Sport", article: "der", emoji: "⚽", syl: "Sport" },
    { noun: "Lesen", article: "das", emoji: "📚", syl: "LE-sen" },
    { noun: "Musik", article: "die", emoji: "🎵", syl: "Mu-SIK" },
    { noun: "Kochen", article: "das", emoji: "🍳", syl: "KO-chen" },
    { noun: "Reisen", article: "das", emoji: "✈️", syl: "REI-sen" },
    { noun: "Fotografie", article: "die", emoji: "📷", syl: "Foto-gra-FIE" },
    { noun: "Tanzen", article: "das", emoji: "💃", syl: "TAN-zen" },
    { noun: "Natur", article: "die", emoji: "🌳", syl: "Na-TUR" },
    { noun: "Gaming", article: "das", emoji: "🎮", syl: "GEI-ming" },
    { noun: "Yoga", article: "das", emoji: "🧘", syl: "YO-ga" },
    { noun: "Handarbeit", article: "die", emoji: "🧵", syl: "HAND-ar-beit" },
    { noun: "Backen", article: "das", emoji: "🧁", syl: "BA-cken" },
    { noun: "Gartenarbeit", article: "die", emoji: "🌱", syl: "GAR-ten-ar-beit" },
  ];

  const LINKS = [
    { title: "Duden", url: "https://www.duden.de", desc: "Rechtschreibung, Grammatik & Bedeutungen nachschlagen." },
    { title: "DWDS", url: "https://www.dwds.de", desc: "Digitales Wörterbuch der deutschen Sprache." },
    { title: "Goethe-Institut", url: "https://www.goethe.de", desc: "Offizielle Sprachkurse & Prüfungsvorbereitung." },
    { title: "Deutsche Welle – Deutsch lernen", url: "https://www.dw.com/de/deutsch-lernen/s-2055", desc: "Kostenlose Kurse, Podcasts & Nachrichten in einfacher Sprache." },
    { title: "Redensarten-Index", url: "https://www.redensarten-index.de", desc: "Nachschlagewerk für deutsche Redewendungen und ihre Bedeutung." },
    { title: "Reverso Context", url: "https://context.reverso.net/übersetzung/deutsch-englisch/", desc: "Wörter und Redewendungen in echten Beispielsätzen nachschlagen." },
    { title: "Bundeskampf", url: "https://www.bundeskampf.com", desc: "Augenzwinkerndes Browsergame über die deutschen Bundesländer — mit Gartenzwergen als Sammelobjekt." },
  ];

  // Sprachen fürs Profil — welche Sprachen jemand spricht oder gerade lernt
  const LANGUAGES = [
    "Deutsch", "Englisch", "Französisch", "Spanisch", "Italienisch", "Portugiesisch",
    "Türkisch", "Arabisch", "Hebräisch", "Russisch", "Polnisch", "Niederländisch", "Persisch/Farsi",
    "Kurdisch", "Ukrainisch", "Griechisch", "Chinesisch", "Japanisch", "Koreanisch", "Hindi",
    "Schwedisch", "Norwegisch", "Dänisch", "Finnisch", "Rumänisch", "Bulgarisch", "Tschechisch",
    "Serbisch/Kroatisch", "Albanisch", "Vietnamesisch", "Thailändisch", "Suaheli", "Urdu",
    "Dari", "Paschtu", "Somali", "Tigrinya", "Amharisch", "Bengalisch", "Panjabi", "Tamil",
    "Indonesisch", "Tagalog/Filipino", "Georgisch", "Armenisch", "Aserbaidschanisch", "Mongolisch",
    "Ungarisch", "Slowakisch", "Slowenisch", "Litauisch", "Lettisch", "Estnisch",
    "Nepalesisch", "Malaiisch", "Birmanisch", "Yoruba", "Haussa", "Wolof",
  ];
  // Betonung der Sprachnamen (Duden-Muster) — für die Betonungs-Anzeige im ganzen Wortschatz
  const LANGUAGE_SYL = {
    "Deutsch": "Deutsch", "Englisch": "ENG-lisch", "Französisch": "Fran-ZÖ-sisch", "Spanisch": "SPA-nisch",
    "Italienisch": "I-ta-LIE-nisch", "Portugiesisch": "Por-tu-GIE-sisch", "Türkisch": "TÜR-kisch",
    "Arabisch": "A-RA-bisch", "Hebräisch": "He-BRÄ-isch", "Russisch": "RUS-sisch", "Polnisch": "POL-nisch",
    "Niederländisch": "NIE-der-län-disch", "Persisch/Farsi": "PER-sisch/FAR-si", "Kurdisch": "KUR-disch",
    "Ukrainisch": "U-kra-I-nisch", "Griechisch": "GRIE-chisch", "Chinesisch": "Chi-NE-sisch",
    "Japanisch": "Ja-PA-nisch", "Koreanisch": "Ko-re-A-nisch", "Hindi": "HIN-di", "Schwedisch": "SCHWE-disch",
    "Norwegisch": "Nor-WE-gisch", "Dänisch": "DÄ-nisch", "Finnisch": "FIN-nisch", "Rumänisch": "Ru-MÄ-nisch",
    "Bulgarisch": "Bul-GA-risch", "Tschechisch": "TSCHE-chisch", "Serbisch/Kroatisch": "SER-bisch/Kro-A-tisch",
    "Albanisch": "Al-BA-nisch", "Vietnamesisch": "Viet-na-ME-sisch", "Thailändisch": "Thai-LÄN-disch",
    "Suaheli": "Sua-HE-li", "Urdu": "Ur-DU",
    "Dari": "DA-ri", "Paschtu": "PASCH-tu", "Somali": "So-MA-li", "Tigrinya": "Ti-GRIN-ya",
    "Amharisch": "Am-HA-risch", "Bengalisch": "Ben-GA-lisch", "Panjabi": "PAN-ja-bi", "Tamil": "TA-mil",
    "Indonesisch": "In-do-NE-sisch", "Tagalog/Filipino": "Ta-GA-log/Fi-li-PI-no", "Georgisch": "GEOR-gisch",
    "Armenisch": "Ar-ME-nisch", "Aserbaidschanisch": "A-ser-bai-DSCHA-nisch", "Mongolisch": "Mon-GO-lisch",
    "Ungarisch": "UN-ga-risch", "Slowakisch": "Slo-WA-kisch", "Slowenisch": "Slo-WE-nisch",
    "Litauisch": "Li-TAU-isch", "Lettisch": "LET-tisch", "Estnisch": "EST-nisch",
    "Nepalesisch": "Ne-pa-LE-sisch", "Malaiisch": "Ma-LAI-isch", "Birmanisch": "Bir-MA-nisch",
    "Yoruba": "YO-ru-ba", "Haussa": "HAU-ssa", "Wolof": "WO-lof",
  };

  /* ============================================================
     Hobbys auf Italienisch
     ------------------------------------------------------------
     Im Italienisch-Raum werden dieselben Hobbys mit italienischem
     Artikel und Wort angezeigt. Der Artikel steht bewusst dabei —
     genau daran gewöhnt man sich beim Lesen am schnellsten.
     ============================================================ */
  const HOBBIES_IT = {
    "Kunst": { article: "l'", noun: "arte", syl: "AR-te" },
    "Sport": { article: "lo", noun: "sport", syl: "sport" },
    "Lesen": { article: "la", noun: "lettura", syl: "let-TU-ra" },
    "Musik": { article: "la", noun: "musica", syl: "MU-si-ca" },
    "Kochen": { article: "la", noun: "cucina", syl: "cu-CI-na" },
    "Reisen": { article: "i", noun: "viaggi", syl: "VIAG-gi" },
    "Fotografie": { article: "la", noun: "fotografia", syl: "fo-to-gra-FI-a" },
    "Tanzen": { article: "la", noun: "danza", syl: "DAN-za" },
    "Natur": { article: "la", noun: "natura", syl: "na-TU-ra" },
    "Gaming": { article: "i", noun: "videogiochi", syl: "vi-de-o-GIO-chi" },
    "Yoga": { article: "lo", noun: "yoga", syl: "YO-ga" },
    "Handarbeit": { article: "il", noun: "lavoro a maglia", syl: "la-VO-ro a MA-glia" },
    "Backen": { article: "la", noun: "pasticceria", syl: "pa-stic-ce-RI-a" },
    "Gartenarbeit": { article: "il", noun: "giardinaggio", syl: "giar-di-NAG-gio" },
  };

  return { WORDS, ladeWoerter, ladeThema, woerterDa, ladenLaeuft, alleThemenDa, themenListe, HOBBIES_IT, PARTIKELN, REDEWENDUNGEN_KURZ, JUGENDSPRACHE, MATERIALS, LINKS, HOBBIES, COUNTRIES, LANGUAGES, LANGUAGE_SYL };
})();
