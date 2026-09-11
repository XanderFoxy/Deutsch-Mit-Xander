/* =========================================================
   DIALOGE — formell und informell
   ---------------------------------------------------------
   GEWÜNSCHT: „Gibt es diese Formulare, wo man ausfüllt, wo man
   so eine Begrüßung durchspielt … dass man so einen Formular-
   Ablauf hat, wie man mit jemandem ins Gespräch kommt, locker,
   wie man das formell macht, wie man das informell macht."

   Drei Bausteine:

   1. BAUSTEINE — das Formular selbst. Ein Gespräch hat immer
      dieselben Schritte: begrüßen, sagen worum es geht, nachfragen,
      antworten, danken, verabschieden. Zu jedem Schritt stehen hier
      fertige Sätze bereit — einmal in der Sie-Form, einmal in der
      du-Form. Man setzt sich sein eigenes Gespräch zusammen.

   2. SITUATIONEN — ausgespielte Gespräche. Die andere Person redet,
      man wählt selbst, was man antwortet. Falsche Antworten sind
      nicht falsch, weil sie unverständlich wären, sondern weil sie
      in der Situation nicht passen — und genau das wird erklärt.

   3. REGISTER — dieselbe Aussage in beiden Formen nebeneinander.

   Alle Namen sind erfunden.
   ========================================================= */
window.DMA_DIALOGE = (() => {

  /* =========================================================
     1. DAS FORMULAR: die Schritte eines Gesprächs
     ========================================================= */
  const SCHRITTE_DE = [
    {
      id: "gruss", name: "1. Begrüßen",
      erklaerung: "Wer zuerst grüßt, hat den Anfang gemacht. In Deutschland grüßt man auch Fremde — im Laden, im Treppenhaus, beim Arzt.",
      formell: [
        "Guten Morgen.", "Guten Tag.", "Guten Abend.",
        "Guten Tag, Frau Wieland.", "Guten Tag, Herr Osterkamp.",
        "Hallo, guten Tag.",
      ],
      informell: [
        "Hallo!", "Hi!", "Moin!", "Servus!", "Grüß dich!",
        "Na, alles klar?", "Hallo, Yusra!",
      ],
      hinweis: "„Moin“ hört man im Norden, „Servus“ und „Grüß Gott“ im Süden. Beides ist überall verständlich.",
    },
    {
      id: "vorstellen", name: "2. Sich vorstellen",
      erklaerung: "Name zuerst, dann was man hier will. In der Sie-Form gehört meistens der Nachname dazu.",
      formell: [
        "Mein Name ist Farhad Nouri.", "Ich heiße Farhad Nouri.",
        "Nouri, guten Tag.", "Ich bin die neue Kollegin, Aynur Demirci.",
        "Darf ich mich vorstellen? Mein Name ist Thomas Ehrlicher.",
      ],
      informell: [
        "Ich bin Farhad.", "Ich heiße Farhad.", "Farhad.",
        "Ich bin neu hier, ich heiße Aynur.",
      ],
      hinweis: "„Mein Name ist …“ klingt förmlicher als „Ich heiße …“. Beides ist richtig.",
    },
    {
      id: "anliegen", name: "3. Sagen, worum es geht",
      erklaerung: "Der wichtigste Satz. Er kommt gleich nach dem Gruß — nicht erst nach fünf Minuten Smalltalk.",
      formell: [
        "Ich habe einen Termin um zehn Uhr.",
        "Ich möchte mich anmelden.",
        "Ich hätte eine Frage.",
        "Ich rufe an wegen der Wohnung in der Lindenstraße.",
        "Ich würde gern einen Termin vereinbaren.",
        "Könnten Sie mir bitte helfen?",
      ],
      informell: [
        "Ich wollte mal fragen, ob …",
        "Ich bräuchte kurz deine Hilfe.",
        "Kannst du mir kurz helfen?",
        "Sag mal, hast du Zeit am Samstag?",
        "Ich hab eine Frage.",
      ],
      hinweis: "„Ich hätte“, „ich würde gern“ und „könnten Sie“ sind Höflichkeitsformen. Sie sind nicht unsicher, sondern freundlich.",
    },
    {
      id: "nachfragen", name: "4. Nachfragen, wenn man etwas nicht versteht",
      erklaerung: "Der Satz, der am meisten wert ist. Niemand findet ihn unhöflich — im Gegenteil.",
      formell: [
        "Entschuldigung, das habe ich nicht verstanden.",
        "Könnten Sie das bitte noch einmal sagen?",
        "Könnten Sie bitte etwas langsamer sprechen?",
        "Wie meinen Sie das genau?",
        "Habe ich das richtig verstanden: …?",
        "Was bedeutet „Meldebescheinigung“?",
      ],
      informell: [
        "Wie bitte?", "Das hab ich nicht verstanden.",
        "Kannst du das noch mal sagen?",
        "Nicht so schnell, bitte.",
        "Was heißt das?",
      ],
      hinweis: "Nicht nicken, wenn man nichts verstanden hat. Zweimal nachfragen ist normal.",
    },
    {
      id: "angeben", name: "5. Angaben machen",
      erklaerung: "Bei Ämtern, Ärzten und am Telefon kommen immer dieselben Fragen.",
      formell: [
        "Mein Geburtsdatum ist der 14. März 1991.",
        "Ich wohne in der Kastanienallee 7, 45127 Essen.",
        "Meine Telefonnummer ist null-zwei-null-eins …",
        "Ich buchstabiere: N wie Nordpol, O wie Otto, U wie Ulrich …",
        "Hier ist mein Ausweis.",
      ],
      informell: [
        "Ich wohn in der Kastanienallee.",
        "Ich schreib dir die Nummer auf.",
        "Warte, ich buchstabier das mal.",
      ],
      hinweis: "Buchstabieren lernt sich schnell und rettet jedes Telefonat. Am Telefon fragt fast jeder danach.",
    },
    {
      id: "bitten", name: "6. Um etwas bitten",
      erklaerung: "„Bitte“ allein reicht oft nicht — die Form des Satzes macht die Höflichkeit.",
      formell: [
        "Könnten Sie mir bitte sagen, wo …?",
        "Wäre es möglich, den Termin zu verschieben?",
        "Dürfte ich Sie um etwas bitten?",
        "Ich wäre Ihnen sehr dankbar.",
      ],
      informell: [
        "Kannst du mir mal helfen?",
        "Geht das auch am Freitag?",
        "Machst du das für mich?",
        "Wär super, wenn du das machen könntest.",
      ],
      hinweis: "„Ich will“ klingt im Deutschen fordernd. „Ich möchte“ oder „ich hätte gern“ ist der Alltagston.",
    },
    {
      id: "danken", name: "7. Danken",
      erklaerung: "Kurz, aber es gehört dazu.",
      formell: [
        "Vielen Dank für Ihre Hilfe.",
        "Herzlichen Dank.",
        "Das ist sehr freundlich, danke.",
        "Danke schön.",
      ],
      informell: ["Danke!", "Danke dir!", "Super, danke!", "Voll lieb, danke."],
      hinweis: "Die Antwort darauf: „Gern geschehen“, „Bitte schön“, „Kein Problem“, „Nichts zu danken“.",
    },
    {
      id: "verabschieden", name: "8. Sich verabschieden",
      erklaerung: "Ohne Verabschiedung wirkt ein Gespräch abgebrochen — auch am Telefon.",
      formell: [
        "Auf Wiedersehen.", "Auf Wiederhören. (am Telefon)",
        "Schönen Tag noch.", "Einen schönen Abend noch.",
        "Vielen Dank und auf Wiedersehen.",
      ],
      informell: [
        "Tschüss!", "Bis dann!", "Bis morgen!", "Mach's gut!",
        "Ciao!", "Wir sehen uns!",
      ],
      hinweis: "Am Telefon sagt man „Auf Wiederhören“, nicht „Auf Wiedersehen“ — man sieht sich ja nicht.",
    },
  ];

  const SCHRITTE_IT = [
    {
      id: "gruss", name: "1. Salutare",
      erklaerung: "Im Italienischen entscheidet die Tageszeit: „buongiorno“ bis zum späten Nachmittag, danach „buonasera“.",
      formell: ["Buongiorno.", "Buonasera.", "Buongiorno, signora Ferri.", "Buongiorno, dottor Ranieri."],
      informell: ["Ciao!", "Ehi!", "Ciao, Matteo!", "Come va?"],
      hinweis: "„Ciao“ ist nur die du-Form. Zu Fremden und in Ämtern immer „buongiorno“.",
    },
    {
      id: "vorstellen", name: "2. Presentarsi",
      erklaerung: "Wie im Deutschen: Name zuerst.",
      formell: ["Mi chiamo Farhad Nouri.", "Sono Farhad Nouri.", "Piacere, Nouri.", "Molto lieto."],
      informell: ["Sono Farhad.", "Mi chiamo Farhad.", "Piacere!"],
      hinweis: "„Piacere“ heißt „freut mich“ und passt in beiden Formen.",
    },
    {
      id: "anliegen", name: "3. Dire di che si tratta",
      erklaerung: "Die Sie-Form ist im Italienischen die dritte Person Einzahl: „Lei“.",
      formell: ["Ho un appuntamento alle dieci.", "Vorrei un'informazione.", "Avrei una domanda.", "Potrebbe aiutarmi?"],
      informell: ["Volevo chiederti una cosa.", "Mi puoi aiutare?", "Senti, hai tempo sabato?"],
      hinweis: "„Vorrei“ (ich hätte gern) statt „voglio“ (ich will) — genau wie im Deutschen.",
    },
    {
      id: "nachfragen", name: "4. Chiedere di ripetere",
      erklaerung: "Derselbe unbezahlbare Satz wie im Deutschen.",
      formell: ["Scusi, non ho capito.", "Potrebbe ripetere, per favore?", "Può parlare più lentamente?", "Che cosa significa?"],
      informell: ["Come?", "Non ho capito.", "Puoi ripetere?", "Più piano, per favore."],
      hinweis: "„Scusi“ ist die Sie-Form, „scusa“ die du-Form.",
    },
    {
      id: "danken", name: "5. Ringraziare",
      erklaerung: "",
      formell: ["Grazie mille.", "La ringrazio.", "Molto gentile, grazie."],
      informell: ["Grazie!", "Grazie mille!", "Sei un grande, grazie!"],
      hinweis: "Die Antwort: „prego“, „di niente“, „figurati“ (du-Form).",
    },
    {
      id: "verabschieden", name: "6. Salutare andando via",
      erklaerung: "",
      formell: ["Arrivederci.", "ArrivederLa.", "Buona giornata.", "Buona serata."],
      informell: ["Ciao!", "A domani!", "Ci vediamo!", "A presto!"],
      hinweis: "„ArrivederLa“ ist die besonders höfliche Form gegenüber einer einzelnen Person.",
    },
  ];

  /* =========================================================
     2. DIE SITUATIONEN
     ========================================================= */
  const S = (id, titel, ort, register, niveau, worum, gegenueber, zeilen) =>
    ({ id, titel, ort, register, niveau, worum, gegenueber, zeilen });
  // kurze Schreibweisen
  const sagt = (wer, text) => ({ wer, text });
  const wahl = (optionen) => ({ wer: "du", optionen });

  const SITUATIONEN_DE = [
    S("buergeramt", "Beim Bürgeramt: sich anmelden", "Bürgeramt, Zimmer 14", "formell", "A2",
      "Wer in Deutschland umzieht, muss sich innerhalb von zwei Wochen bei der Stadt anmelden. Man braucht den Ausweis und die Wohnungsgeberbestätigung vom Vermieter.",
      "Frau Wieland, Sachbearbeiterin",
      [
        sagt("Frau Wieland", "Guten Tag. Bitte nehmen Sie Platz. Was kann ich für Sie tun?"),
        wahl([
          { text: "Guten Tag. Ich möchte mich anmelden — ich bin letzte Woche umgezogen.", ok: true, warum: "Gruß, Anliegen, Grund. Mehr braucht der erste Satz nicht." },
          { text: "Hi. Ich will mich anmelden.", ok: false, warum: "„Hi“ und „ich will“ sind für ein Amt zu locker. „Guten Tag“ und „ich möchte“." },
          { text: "Anmeldung.", ok: false, warum: "Verständlich, aber unhöflich. Ein ganzer Satz kostet zwei Sekunden." },
        ]),
        sagt("Frau Wieland", "Sehr gern. Haben Sie die Wohnungsgeberbestätigung dabei?"),
        wahl([
          { text: "Ja, hier bitte. Und hier ist mein Ausweis.", ok: true, warum: "Gefragt war nur eine Sache — den Ausweis gleich mitzugeben, spart einen Schritt." },
          { text: "Was ist das?", ok: false, warum: "Die Frage ist erlaubt, aber freundlicher: „Entschuldigung, was bedeutet das genau?“" },
          { text: "Nein, habe ich nicht. Ist das schlimm?", ok: false, warum: "Inhaltlich möglich — dann fehlt aber das Papier und man muss noch einmal kommen." },
        ]),
        sagt("Frau Wieland", "Danke. Ihr Geburtsdatum bitte?"),
        wahl([
          { text: "Der vierzehnte März neunzehnhunderteinundneunzig.", ok: true, warum: "Datum immer mit Ordnungszahl: „der vierzehnte“, nicht „vierzehn“." },
          { text: "Vierzehn drei einundneunzig.", ok: false, warum: "So liest man eine Zahl, kein Datum. „Der vierzehnte März“." },
          { text: "1991.", ok: false, warum: "Gefragt war das ganze Datum, nicht nur das Jahr." },
        ]),
        sagt("Frau Wieland", "Sie bekommen gleich die Meldebescheinigung. Die brauchen Sie später für die Bank."),
        wahl([
          { text: "Vielen Dank. Entschuldigung — was ist eine Meldebescheinigung genau?", ok: true, warum: "Danken und nachfragen in einem Satz. Genau so macht man es." },
          { text: "Ja, ja, alles klar.", ok: false, warum: "Nicken, ohne verstanden zu haben, rächt sich später bei der Bank." },
          { text: "Brauche ich nicht.", ok: false, warum: "Doch — ohne Meldebescheinigung gibt es kein Konto." },
        ]),
        sagt("Frau Wieland", "Das ist der Nachweis, dass Sie hier gemeldet sind. Hier, bitte schön."),
        wahl([
          { text: "Vielen Dank für Ihre Hilfe. Auf Wiedersehen.", ok: true, warum: "Danken und verabschieden — das Gespräch ist rund." },
          { text: "Tschüss!", ok: false, warum: "Zu locker fürs Amt. „Auf Wiedersehen“ oder „Schönen Tag noch“." },
          { text: "Okay.", ok: false, warum: "Ein Gespräch ohne Verabschiedung wirkt abgebrochen." },
        ]),
      ]),

    S("arzt-anmeldung", "Beim Arzt: an der Anmeldung", "Hausarztpraxis Dr. Osterkamp", "formell", "A2",
      "Beim ersten Besuch braucht man die Versichertenkarte. Ohne Termin wartet man oft lange — fragen kostet nichts.",
      "Herr Lindtner, Praxismitarbeiter",
      [
        sagt("Herr Lindtner", "Guten Morgen. Waren Sie schon einmal bei uns?"),
        wahl([
          { text: "Guten Morgen. Nein, ich bin zum ersten Mal hier.", ok: true, warum: "Gruß zurück, dann die Antwort. Die Reihenfolge ist im Deutschen fest." },
          { text: "Nein.", ok: false, warum: "Der Gruß fehlt. Ein „Guten Morgen“ davor ändert den ganzen Ton." },
          { text: "Ich bin krank.", ok: false, warum: "Das war nicht die Frage. Erst antworten, dann das Anliegen." },
        ]),
        sagt("Herr Lindtner", "Dann brauche ich bitte Ihre Versichertenkarte."),
        wahl([
          { text: "Hier bitte.", ok: true, warum: "Kurz und passend. Mehr muss man nicht sagen." },
          { text: "Moment, die muss ich suchen.", ok: true, warum: "Auch richtig — ehrlich und freundlich. Niemand erwartet, dass alles sofort in der Hand liegt." },
          { text: "Ich habe keine Karte, aber ich zahle bar.", ok: false, warum: "Ohne Karte wird es kompliziert. Wenn sie fehlt: sagen, dass man sie nachreicht." },
        ]),
        sagt("Herr Lindtner", "Danke. Was führt Sie zu uns?"),
        wahl([
          { text: "Ich habe seit drei Tagen Halsschmerzen und Fieber.", ok: true, warum: "Was und seit wann — die zwei Angaben, die immer gebraucht werden." },
          { text: "Mir geht es schlecht.", ok: false, warum: "Zu allgemein. Sag, was weh tut und seit wann." },
          { text: "Das erzähle ich nur dem Arzt.", ok: false, warum: "Verständlich, aber an der Anmeldung wird nur grob eingeordnet — dafür reicht ein Stichwort." },
        ]),
        sagt("Herr Lindtner", "Ohne Termin kann es heute etwa zwei Stunden dauern."),
        wahl([
          { text: "Das ist in Ordnung, ich warte. Danke.", ok: true, warum: "Klare Entscheidung, freundlich gesagt." },
          { text: "Zwei Stunden? Das geht doch nicht!", ok: false, warum: "Der Ärger ist verständlich — hilft aber nicht. Besser nach einem Termin morgen fragen." },
          { text: "Könnte ich stattdessen morgen einen Termin bekommen?", ok: true, warum: "Auch richtig: nach der Alternative fragen, statt sich zu ärgern." },
        ]),
        sagt("Herr Lindtner", "Gut. Bitte nehmen Sie im Wartezimmer Platz, wir rufen Sie auf."),
        wahl([
          { text: "Vielen Dank.", ok: true, warum: "Kurz danken reicht. Der Rest kommt beim Aufruf." },
          { text: "Wo ist das Wartezimmer?", ok: true, warum: "Auch gut — eine Frage ist besser als ziellos herumzulaufen." },
          { text: "Auf Wiedersehen.", ok: false, warum: "Noch zu früh: man bleibt ja in der Praxis." },
        ]),
      ]),

    S("wohnung", "Wohnungsbesichtigung", "Kastanienallee 7, dritter Stock", "formell", "B1",
      "Bei einer Besichtigung sind oft viele Leute gleichzeitig da. Wer freundlich fragt und sich die Antworten merkt, bleibt im Gedächtnis.",
      "Frau Radtke, Vermieterin",
      [
        sagt("Frau Radtke", "Guten Tag. Sie sind sicher wegen der Wohnung?"),
        wahl([
          { text: "Guten Tag, ja. Mein Name ist Aynur Demirci, wir haben telefoniert.", ok: true, warum: "Name nennen und an das Telefonat erinnern — dann ordnet sie einen sofort ein." },
          { text: "Ja.", ok: false, warum: "Die Gelegenheit, sich vorzustellen, kommt so schnell nicht wieder." },
          { text: "Genau, ich will die Wohnung.", ok: false, warum: "Zu früh und zu direkt. Erst sehen, dann entscheiden." },
        ]),
        sagt("Frau Radtke", "Ah, Frau Demirci, richtig. Kommen Sie herein. Das ist das Wohnzimmer."),
        wahl([
          { text: "Sehr schön hell. Darf ich fragen, wie hoch die Nebenkosten sind?", ok: true, warum: "Ein freundlicher Satz, dann die wichtigste Frage. Nebenkosten stehen oft nicht in der Anzeige." },
          { text: "Ist das alles?", ok: false, warum: "Das klingt abfällig, auch wenn es nicht so gemeint ist." },
          { text: "…", ok: false, warum: "Schweigen wirkt desinteressiert. Ein Satz genügt." },
        ]),
        sagt("Frau Radtke", "Die Nebenkosten liegen bei zweihundertzwanzig Euro, Heizung ist dabei."),
        wahl([
          { text: "Danke. Und ist die Kaltmiete von neunhundert Euro verhandelbar?", ok: false, warum: "Über die Miete verhandelt man in Deutschland bei einer Besichtigung praktisch nie." },
          { text: "Danke. Gibt es einen Keller zur Wohnung?", ok: true, warum: "Eine sachliche Frage nach dem, was man wirklich wissen will." },
          { text: "Das ist zu teuer.", ok: false, warum: "Wenn es zu teuer ist, geht man — man sagt es nicht in den Raum." },
        ]),
        sagt("Frau Radtke", "Ja, ein Kellerabteil gehört dazu. Haben Sie sonst noch Fragen?"),
        wahl([
          { text: "Ja — bis wann brauchen Sie eine Entscheidung, und welche Unterlagen soll ich mitbringen?", ok: true, warum: "Zwei Fragen, die zeigen: Man meint es ernst und ist organisiert." },
          { text: "Nein, danke.", ok: false, warum: "Schade — die Unterlagenfrage entscheidet oft, wer die Wohnung bekommt." },
          { text: "Wann kann ich einziehen?", ok: false, warum: "Zu früh. Erst die Zusage, dann der Termin." },
        ]),
        sagt("Frau Radtke", "Bis Freitag. Ich brauche die letzten drei Gehaltsnachweise und eine Schufa-Auskunft."),
        wahl([
          { text: "Alles klar, das schicke ich Ihnen bis Mittwoch. Vielen Dank für die Besichtigung.", ok: true, warum: "Eine eigene Frist nennen ist stark — das merkt sich jeder Vermieter." },
          { text: "Okay, mal sehen.", ok: false, warum: "Klingt unentschlossen. Wer sich nicht festlegt, wird nicht genommen." },
          { text: "Was ist eine Schufa-Auskunft?", ok: true, warum: "Auch richtig — lieber nachfragen als das falsche Papier bringen." },
        ]),
      ]),

    S("bewerbung", "Vorstellungsgespräch", "Büro der Firma Hellweg & Sohn", "formell", "B1",
      "Die ersten drei Minuten entscheiden viel. Man muss nicht perfekt sprechen — man muss verständlich und freundlich sein.",
      "Herr Kettler, Abteilungsleiter",
      [
        sagt("Herr Kettler", "Guten Tag, schön dass Sie da sind. Kettler, angenehm."),
        wahl([
          { text: "Guten Tag, Herr Kettler. Farhad Nouri, freut mich.", ok: true, warum: "Namen zurückgeben und den Gruß erwidern. Genau das Muster." },
          { text: "Hallo, ich bin der Farhad.", ok: false, warum: "Der Vorname allein und „Hallo“ sind hier zu locker." },
          { text: "Danke, dass ich kommen durfte.", ok: false, warum: "Höflich, aber der eigene Name fehlt — und der ist das Wichtigste." },
        ]),
        sagt("Herr Kettler", "Erzählen Sie doch kurz etwas über sich."),
        wahl([
          { text: "Gern. Ich bin gelernter Elektriker, habe sechs Jahre in Isfahan gearbeitet und seit einem Jahr meine Anerkennung in Deutschland.", ok: true, warum: "Beruf, Erfahrung, Stand der Anerkennung — in drei Sätzen das Wichtigste." },
          { text: "Was möchten Sie denn wissen?", ok: false, warum: "Die Frage zurückzugeben wirkt unvorbereitet. Zwei, drei Sätze über sich hat man sich vorher zurechtgelegt." },
          { text: "Ich bin 34 Jahre alt und verheiratet.", ok: false, warum: "Privates ist hier nicht gefragt. Es geht um Beruf und Erfahrung." },
        ]),
        sagt("Herr Kettler", "Und warum möchten Sie zu uns?"),
        wahl([
          { text: "Weil Sie viel mit Photovoltaik arbeiten. Das habe ich in Isfahan gemacht und würde es gern weiterführen.", ok: true, warum: "Ein konkreter Grund, der mit der eigenen Erfahrung zusammenhängt." },
          { text: "Weil ich Arbeit brauche.", ok: false, warum: "Ehrlich, aber es sagt nichts über die Stelle. Jeder Bewerber braucht Arbeit." },
          { text: "Das ist die einzige Firma, die geantwortet hat.", ok: false, warum: "Auch ehrlich — und für das Gespräch tödlich." },
        ]),
        sagt("Herr Kettler", "Haben Sie noch Fragen an uns?"),
        wahl([
          { text: "Ja: Wie sieht ein normaler Arbeitstag hier aus, und wer würde mich einarbeiten?", ok: true, warum: "Zwei gute Fragen. Sie zeigen Interesse an der Arbeit selbst." },
          { text: "Nein, alles klar.", ok: false, warum: "„Keine Fragen“ liest fast jeder als „kein Interesse“." },
          { text: "Wie viel Urlaub bekomme ich?", ok: false, warum: "Berechtigt, aber nicht als erste Frage. Das klärt man, wenn es konkret wird." },
        ]),
        sagt("Herr Kettler", "Wir melden uns bis Ende der Woche. Vielen Dank für Ihre Zeit."),
        wahl([
          { text: "Ich danke Ihnen für das Gespräch. Auf Wiedersehen.", ok: true, warum: "Kurz, warm, fertig." },
          { text: "Wann genau rufen Sie an?", ok: false, warum: "„Ende der Woche“ war die Antwort. Nachhaken wirkt ungeduldig." },
          { text: "Tschüss.", ok: false, warum: "Zu locker für den Schluss eines Vorstellungsgesprächs." },
        ]),
      ]),

    S("telefon-amt", "Am Telefon: einen Termin verschieben", "am Telefon", "formell", "B1",
      "Am Telefon sieht niemand das Gesicht — deshalb ist der Aufbau besonders wichtig: melden, Anliegen, Daten, Bestätigung.",
      "Frau Sperling, Terminvergabe",
      [
        sagt("Frau Sperling", "Ausländerbehörde, Sperling, guten Tag."),
        wahl([
          { text: "Guten Tag, Frau Sperling. Mein Name ist Yusra Haddad. Ich rufe an wegen meines Termins am Donnerstag.", ok: true, warum: "Gruß, Name, Anliegen — die drei Teile, mit denen jedes deutsche Telefonat anfängt." },
          { text: "Hallo, ich habe da einen Termin.", ok: false, warum: "Ohne Namen kann sie nichts nachsehen. Der Name gehört in den ersten Satz." },
          { text: "Ja, hallo? Hören Sie mich?", ok: false, warum: "Sie hat sich gerade gemeldet — die Leitung steht." },
        ]),
        sagt("Frau Sperling", "Einen Moment … ja, Donnerstag um neun. Was kann ich für Sie tun?"),
        wahl([
          { text: "Ich kann leider nicht kommen. Könnte ich den Termin verschieben?", ok: true, warum: "Absage und Bitte in einem Zug — und mit „könnte“ statt „ich will“." },
          { text: "Ich komme nicht.", ok: false, warum: "Richtig, aber schroff. Und ohne neuen Termin steht man wieder am Anfang." },
          { text: "Muss ich da wirklich hin?", ok: false, warum: "Das führt vom Anliegen weg." },
        ]),
        sagt("Frau Sperling", "Das geht. Ich hätte den elften um vierzehn Uhr oder den achtzehnten um zehn Uhr."),
        wahl([
          { text: "Der elfte um vierzehn Uhr passt mir gut.", ok: true, warum: "Eine klare Entscheidung, die Angabe wiederholt — so entstehen keine Missverständnisse." },
          { text: "Ist egal.", ok: false, warum: "Am Telefon muss eine der beiden Möglichkeiten benannt werden." },
          { text: "Haben Sie nichts am Wochenende?", ok: false, warum: "Ämter arbeiten am Wochenende nicht." },
        ]),
        sagt("Frau Sperling", "Gut, ich trage Sie ein. Sie bekommen eine Bestätigung per Post."),
        wahl([
          { text: "Vielen Dank. Auf Wiederhören.", ok: true, warum: "Am Telefon heißt es „Auf Wiederhören“ — man sieht sich ja nicht." },
          { text: "Vielen Dank. Auf Wiedersehen.", ok: false, warum: "Fast richtig: am Telefon „Auf Wiederhören“." },
          { text: "Okay, tschüss.", ok: false, warum: "Zu locker für eine Behörde." },
        ]),
      ]),

    S("beschwerde", "Im Geschäft: etwas umtauschen", "Elektromarkt, Kundendienst", "formell", "B1",
      "Ärger bekommt man am schnellsten geregelt, wenn man ruhig bleibt und sagt, was man will.",
      "Frau Bergmann, Kundendienst",
      [
        sagt("Frau Bergmann", "Guten Tag, was kann ich für Sie tun?"),
        wahl([
          { text: "Guten Tag. Ich habe vorgestern diesen Wasserkocher hier gekauft, er heizt aber nicht.", ok: true, warum: "Was, wann, welches Problem. Ohne Vorwurf — der hilft nie." },
          { text: "Ihr habt mir Schrott verkauft!", ok: false, warum: "Die Frau am Tresen hat nichts verkauft. Ärger an der falschen Stelle blockiert nur." },
          { text: "Der ist kaputt.", ok: false, warum: "Zu wenig. Wann gekauft und was genau nicht geht — das braucht sie." },
        ]),
        sagt("Frau Bergmann", "Das tut mir leid. Haben Sie den Kassenbon dabei?"),
        wahl([
          { text: "Ja, hier bitte.", ok: true, warum: "Genau danach war gefragt." },
          { text: "Nein, brauche ich den?", ok: true, warum: "Auch richtig gefragt — ohne Bon wird es schwerer, aber nicht unmöglich." },
          { text: "Den habe ich weggeworfen, aber das ist Ihr Problem.", ok: false, warum: "Der Bon ist der Kaufnachweis. Ohne ihn hat man keine Handhabe." },
        ]),
        sagt("Frau Bergmann", "Danke. Möchten Sie das Geld zurück oder ein neues Gerät?"),
        wahl([
          { text: "Ein neues Gerät wäre mir am liebsten.", ok: true, warum: "Eine Entscheidung nennen — dann geht es schnell." },
          { text: "Was schlagen Sie vor?", ok: false, warum: "Sie hat schon zwei Möglichkeiten genannt. Jetzt ist man dran." },
          { text: "Beides.", ok: false, warum: "Das eine schließt das andere aus." },
        ]),
        sagt("Frau Bergmann", "Gern. Ich hole Ihnen das gleiche Modell aus dem Lager."),
        wahl([
          { text: "Vielen Dank für Ihre Hilfe.", ok: true, warum: "Danken, auch wenn man im Recht war. Das kostet nichts und wirkt." },
          { text: "Wurde ja auch Zeit.", ok: false, warum: "Unnötig. Das Problem ist gerade gelöst worden." },
          { text: "Nichts zu danken.", ok: false, warum: "Das sagt die andere Seite — hier passt es nicht." },
        ]),
      ]),

    S("bank", "Bei der Bank: ein Konto eröffnen", "Sparkasse, Schalter 3", "formell", "A2",
      "Für ein Girokonto braucht man Ausweis und Meldebescheinigung. Ohne Konto gibt es weder Gehalt noch Miete.",
      "Herr Tuchel, Kundenberater",
      [
        sagt("Herr Tuchel", "Guten Tag, nehmen Sie Platz. Wie kann ich helfen?"),
        wahl([
          { text: "Guten Tag. Ich möchte ein Girokonto eröffnen.", ok: true, warum: "Ein Satz, ein Anliegen. Perfekt." },
          { text: "Ich brauche Geld.", ok: false, warum: "Das heißt etwas anderes. Gemeint ist ein Konto." },
          { text: "Konto.", ok: false, warum: "Verständlich, aber ohne Satz und ohne Gruß." },
        ]),
        sagt("Herr Tuchel", "Sehr gern. Haben Sie Ihren Ausweis und eine Meldebescheinigung dabei?"),
        wahl([
          { text: "Ja, beides. Hier bitte.", ok: true, warum: "Kurz und vollständig." },
          { text: "Den Ausweis ja, die Meldebescheinigung habe ich nicht.", ok: true, warum: "Ehrlich — dann sagt er, wie es weitergeht. Besser als raten." },
          { text: "Ich habe einen Reisepass, reicht das?", ok: true, warum: "Gute Frage. Ein Pass wird meistens akzeptiert." },
        ]),
        sagt("Herr Tuchel", "Gut. Das Konto kostet monatlich vier Euro neunzig, Karte inklusive."),
        wahl([
          { text: "Gibt es auch ein Konto ohne Grundgebühr?", ok: true, warum: "Fragen ist erlaubt und üblich. Viele Banken haben ein günstigeres Modell." },
          { text: "Das ist Wucher.", ok: false, warum: "Der Berater macht die Preise nicht." },
          { text: "Egal, ich unterschreibe.", ok: false, warum: "Erst verstehen, dann unterschreiben — immer." },
        ]),
        sagt("Herr Tuchel", "Ja, für Auszubildende und Studierende ist es kostenlos. Trifft das auf Sie zu?"),
        wahl([
          { text: "Nein, ich arbeite. Dann nehme ich das normale Konto.", ok: true, warum: "Klar geantwortet und entschieden." },
          { text: "Ich sage einfach ja.", ok: false, warum: "Falsche Angaben gegenüber der Bank sind keine Kleinigkeit." },
          { text: "Was ist ein Auszubildender?", ok: true, warum: "Auch richtig — lieber nachfragen als raten." },
        ]),
      ]),

    S("schule", "In der Schule: Elterngespräch", "Grundschule am Lindenweg", "formell", "B1",
      "Zum Elternsprechtag geht man auch dann, wenn alles gut läuft. Die Lehrerin erwartet Fragen.",
      "Frau Kortmann, Klassenlehrerin",
      [
        sagt("Frau Kortmann", "Guten Tag, schön dass Sie da sind. Sie sind die Mutter von Elias?"),
        wahl([
          { text: "Guten Tag. Ja, genau — mein Name ist Yusra Haddad.", ok: true, warum: "Bestätigen und den eigenen Namen nennen." },
          { text: "Ja.", ok: false, warum: "Der Name fehlt. Die Lehrerin hat dreißig Kinder in der Klasse." },
          { text: "Was hat er gemacht?", ok: false, warum: "Ein Elterngespräch ist kein schlechtes Zeichen — erst zuhören." },
        ]),
        sagt("Frau Kortmann", "Elias macht sich gut. Beim Lesen braucht er noch etwas Übung."),
        wahl([
          { text: "Danke für die Rückmeldung. Was können wir zu Hause tun?", ok: true, warum: "Die beste Frage überhaupt. Lehrer antworten darauf gern und konkret." },
          { text: "Zu Hause liest er doch ständig.", ok: false, warum: "Das klingt nach Verteidigung. Erst fragen, was gemeint ist." },
          { text: "Das ist Ihre Aufgabe.", ok: false, warum: "Schule und Elternhaus arbeiten hier zusammen — das erwartet jede Lehrerin." },
        ]),
        sagt("Frau Kortmann", "Zehn Minuten täglich laut vorlesen reicht schon. Am besten etwas, das ihn interessiert."),
        wahl([
          { text: "Das machen wir. Gibt es Bücher, die Sie empfehlen?", ok: true, warum: "Zusagen und weiterfragen. So nimmt man etwas Konkretes mit." },
          { text: "Zehn Minuten sind zu wenig.", ok: false, warum: "Sie kennt die Klasse. Zehn Minuten täglich sind mehr, als es klingt." },
          { text: "Okay.", ok: false, warum: "Verschenkt. Die Frage nach Büchern kostet fünf Sekunden." },
        ]),
        sagt("Frau Kortmann", "Ich schreibe Ihnen drei Titel auf. Melden Sie sich jederzeit, wenn etwas ist."),
        wahl([
          { text: "Vielen Dank, das mache ich. Auf Wiedersehen.", ok: true, warum: "Freundlich und mit Zusage." },
          { text: "Vielen Dank. Tschüss!", ok: false, warum: "Zu locker. Lehrerinnen siezt man in Deutschland." },
          { text: "Ich hoffe, das reicht dann.", ok: false, warum: "Klingt zweifelnd, wo gerade Hilfe angeboten wurde." },
        ]),
      ]),

    S("nachbarn", "Im Treppenhaus: die neuen Nachbarn", "Hausflur, zweiter Stock", "informell", "A1",
      "Das erste Gespräch im Haus entscheidet oft über die nächsten Jahre. Es darf ganz kurz sein.",
      "Timo, Nachbar",
      [
        sagt("Timo", "Hallo! Du bist neu hier, oder?"),
        wahl([
          { text: "Hallo! Ja, seit Samstag. Ich bin Farhad.", ok: true, warum: "Gruß, Antwort, Name. Drei Teile, ein Atemzug." },
          { text: "Ja.", ok: false, warum: "Zu knapp. Er hat gerade das Gespräch angefangen — das kann man erwidern." },
          { text: "Guten Tag. Mein Name ist Farhad Nouri.", ok: false, warum: "Nicht falsch, aber steif. Er hat geduzt — dann duzt man zurück." },
        ]),
        sagt("Timo", "Timo. Wohnst du allein oder mit Familie?"),
        wahl([
          { text: "Mit meiner Frau und unserem Sohn. Und du?", ok: true, warum: "Antworten und zurückfragen — so läuft ein Gespräch weiter." },
          { text: "Mit Familie.", ok: false, warum: "Geht, aber ohne Rückfrage bricht es gleich wieder ab." },
          { text: "Das ist privat.", ok: false, warum: "Die Frage ist im Treppenhaus ganz normaler Smalltalk." },
        ]),
        sagt("Timo", "Ich wohne da drüben, mit meiner Freundin. Sag Bescheid, wenn du was brauchst — Bohrmaschine oder so."),
        wahl([
          { text: "Danke, das ist nett! Vielleicht komme ich drauf zurück.", ok: true, warum: "Das Angebot annehmen, ohne sofort etwas zu wollen." },
          { text: "Ja, ich brauche eine Bohrmaschine. Jetzt gleich.", ok: false, warum: "Zu direkt. Das Angebot war freundlich gemeint, nicht als Sofort-Termin." },
          { text: "Nein danke, ich komme klar.", ok: false, warum: "Klingt abweisend. „Danke, gut zu wissen“ hält die Tür offen." },
        ]),
        sagt("Timo", "Alles klar. Dann bis bald!"),
        wahl([
          { text: "Bis bald, Timo!", ok: true, warum: "Mit Namen zurück — das merkt sich jeder." },
          { text: "Auf Wiedersehen.", ok: false, warum: "Zu förmlich für einen Nachbarn, der gerade geduzt hat." },
          { text: "Ja.", ok: false, warum: "Ein Gruß zum Abschied gehört dazu." },
        ]),
      ]),

    S("sprachkurs", "Im Sprachkurs: jemanden kennenlernen", "Volkshochschule, Raum B2", "informell", "A1",
      "In der Pause reden ist der schnellste Weg zum Sprechen. Und der einzige, bei dem Fehler nichts kosten.",
      "Marisol, Mitschülerin",
      [
        sagt("Marisol", "Hi! Ist der Platz frei?"),
        wahl([
          { text: "Klar, setz dich. Ich bin Aynur.", ok: true, warum: "Kurz, offen, mit Namen." },
          { text: "Ja.", ok: false, warum: "Geht — verschenkt aber den Anfang eines Gesprächs." },
          { text: "Ich weiß nicht.", ok: false, warum: "Der Platz ist offensichtlich frei." },
        ]),
        sagt("Marisol", "Marisol. Woher kommst du?"),
        wahl([
          { text: "Aus der Türkei, aus Izmir. Und du?", ok: true, warum: "Antwort mit Detail, dann zurückfragen." },
          { text: "Aus der Türkei.", ok: false, warum: "Fast gut — die Rückfrage fehlt." },
          { text: "Warum fragst du?", ok: false, warum: "Die Frage ist im Sprachkurs die normalste der Welt." },
        ]),
        sagt("Marisol", "Aus Peru. Ich bin seit zwei Jahren hier. Und wie lange bist du schon in Deutschland?"),
        wahl([
          { text: "Erst seit acht Monaten. Deutsch fällt mir noch schwer.", ok: true, warum: "Ehrlich, und es gibt ihr etwas zum Anknüpfen." },
          { text: "Acht Monate.", ok: false, warum: "Richtig, aber trocken. Ein halber Satz mehr macht ein Gespräch daraus." },
          { text: "Mein Deutsch ist sehr schlecht, entschuldige.", ok: false, warum: "Sich für sein Deutsch zu entschuldigen ist unnötig — ihr sitzt im selben Kurs." },
        ]),
        sagt("Marisol", "Am Anfang ging's mir genauso. Wollen wir mal zusammen üben?"),
        wahl([
          { text: "Ja, gern! Hast du Donnerstag nach dem Kurs Zeit?", ok: true, warum: "Zusagen und gleich konkret werden — sonst bleibt es beim „mal“." },
          { text: "Vielleicht.", ok: false, warum: "Aus „vielleicht“ wird selten etwas." },
          { text: "Ich weiß nicht, ob ich gut genug bin.", ok: false, warum: "Genau darum geht es beim Üben." },
        ]),
      ]),

    S("einladung", "Eine Verabredung ausmachen", "per Nachricht", "informell", "A2",
      "Verabredungen scheitern meistens nicht am Wollen, sondern daran, dass niemand einen Tag nennt.",
      "Jonas, Freund",
      [
        sagt("Jonas", "Hey! Lange nichts gehört. Wie geht's dir?"),
        wahl([
          { text: "Hey Jonas! Ganz gut, viel zu tun. Und selbst?", ok: true, warum: "Antworten und zurückfragen. Der Standard unter Freunden." },
          { text: "Gut.", ok: false, warum: "Das Gespräch ist damit zu Ende, bevor es angefangen hat." },
          { text: "Mir geht es gut, danke der Nachfrage.", ok: false, warum: "Korrekt, aber steif für eine Nachricht an einen Freund." },
        ]),
        sagt("Jonas", "Auch viel los. Wollen wir mal wieder was machen?"),
        wahl([
          { text: "Unbedingt! Samstag Nachmittag hätte ich Zeit — passt dir das?", ok: true, warum: "Ein konkreter Tag. Ohne Tag wird aus „mal wieder“ nie etwas." },
          { text: "Ja, gern mal.", ok: false, warum: "„Mal“ ist der Feind jeder Verabredung." },
          { text: "Wann denn?", ok: false, warum: "Besser selbst einen Vorschlag machen, statt zurückzuschieben." },
        ]),
        sagt("Jonas", "Samstag ist schlecht, ich arbeite. Sonntag?"),
        wahl([
          { text: "Sonntag geht auch. So gegen drei im Park?", ok: true, warum: "Zusagen und gleich Uhrzeit und Ort dazu." },
          { text: "Okay.", ok: false, warum: "Ohne Uhrzeit und Ort steht die Verabredung auf einem Bein." },
          { text: "Sonntag ist doof.", ok: false, warum: "Wenn Sonntag nicht geht: sagen, wann es geht." },
        ]),
        sagt("Jonas", "Perfekt. Bring deinen Sohn ruhig mit, meine Kleine ist auch dabei."),
        wahl([
          { text: "Super, mache ich. Bis Sonntag!", ok: true, warum: "Zusagen und verabschieden." },
          { text: "Mal sehen.", ok: false, warum: "Nach einer festen Verabredung klingt das wie ein Rückzieher." },
          { text: "Auf Wiedersehen.", ok: false, warum: "Unter Freunden: „Bis Sonntag“ oder „Ciao“." },
        ]),
      ]),

    S("spielplatz", "Auf dem Spielplatz ins Gespräch kommen", "Spielplatz am Stadtpark", "informell", "A2",
      "Über die Kinder kommt man am leichtesten ins Gespräch — das ist überall auf der Welt so.",
      "Nadine, andere Mutter",
      [
        sagt("Nadine", "Ist das Ihrer? Der klettert ja ganz schön mutig."),
        wahl([
          { text: "Ja, das ist Elias. Er ist vier. Und Ihre?", ok: true, warum: "Sie hat gesiezt — dann siezt man zurück, bis jemand das Du anbietet." },
          { text: "Ja, das ist Elias. Er ist vier. Und deine?", ok: false, warum: "Sie hat gesiezt. Das Du kommt später, oft ganz von allein." },
          { text: "Ja.", ok: false, warum: "Sie hat das Gespräch angefangen — ein Satz zurück gehört dazu." },
        ]),
        sagt("Nadine", "Die Kleine da mit der roten Jacke, Mira. Sie wird im Mai drei."),
        wahl([
          { text: "Süß. Kommen Sie öfter hierher?", ok: true, warum: "Eine harmlose Frage, die das Gespräch offenhält." },
          { text: "Aha.", ok: false, warum: "Damit ist es vorbei." },
          { text: "Meiner ist schon viel weiter.", ok: false, warum: "Kinder vergleichen ist der schnellste Weg, ein Gespräch zu beenden." },
        ]),
        sagt("Nadine", "Fast jeden Nachmittag. Ach, sagen Sie ruhig du — ich bin Nadine."),
        wahl([
          { text: "Gern, ich bin Yusra.", ok: true, warum: "Das Du wurde angeboten — dann nimmt man es an und nennt seinen Vornamen." },
          { text: "Danke, aber ich bleibe beim Sie.", ok: false, warum: "Möglich, wirkt hier aber abweisend. Auf dem Spielplatz ist das Du üblich." },
          { text: "Okay, Nadine. Ich heiße Frau Haddad.", ok: false, warum: "Wer das Du annimmt, nennt den Vornamen." },
        ]),
        sagt("Nadine", "Schön! Dann sieht man sich bestimmt öfter."),
        wahl([
          { text: "Bestimmt. Bis bald, Nadine!", ok: true, warum: "Freundlich, kurz, mit Namen." },
          { text: "Auf Wiedersehen, Frau …?", ok: false, warum: "Ihr habt euch gerade geduzt." },
          { text: "Ja.", ok: false, warum: "Ein Abschiedsgruß fehlt." },
        ]),
      ]),

    S("kollegen", "Erster Arbeitstag: das Du und das Sie", "Pausenraum der Firma", "informell", "A2",
      "In vielen Betrieben duzt man sich, in anderen nicht. Die Regel: Wer länger da ist, bietet das Du an.",
      "Sonja, Kollegin",
      [
        sagt("Sonja", "Du bist die Neue, oder? Ich bin Sonja, wir duzen uns hier alle."),
        wahl([
          { text: "Schön! Ich bin Aynur. Seit heute dabei.", ok: true, warum: "Das Du annehmen, Vorname nennen, kurz einordnen." },
          { text: "Guten Tag, Frau …?", ok: false, warum: "Sie hat sich mit Vornamen vorgestellt und das Du genannt." },
          { text: "Aynur Demirci, freut mich.", ok: false, warum: "Der Nachname passt hier nicht mehr — im Du-Betrieb reicht der Vorname." },
        ]),
        sagt("Sonja", "Willkommen! Warst du schon beim Chef?"),
        wahl([
          { text: "Noch nicht. Wie ist er denn so?", ok: true, warum: "Ehrlich und neugierig — genau der Ton für die erste Pause." },
          { text: "Nein.", ok: false, warum: "Kurz, aber die Gelegenheit zum Weiterfragen ist weg." },
          { text: "Das geht dich nichts an.", ok: false, warum: "Sie meint es freundlich." },
        ]),
        sagt("Sonja", "Streng, aber fair. Den siezt übrigens jeder — das ist hier die einzige Ausnahme."),
        wahl([
          { text: "Gut zu wissen, danke für den Tipp!", ok: true, warum: "Genau darum geht es in einer Pause: Wissen, das nirgends aufgeschrieben steht." },
          { text: "Ich duze sowieso alle.", ok: false, warum: "Am ersten Tag ist das keine gute Idee." },
          { text: "Warum denn?", ok: false, warum: "Kann man fragen — hier zählt aber erst mal, dass man es weiß." },
        ]),
      ]),

    S("hilfe-fragen", "Jemanden auf der Straße ansprechen", "Bahnhofsvorplatz", "formell", "A1",
      "Fremde spricht man mit „Entschuldigung“ an und siezt sie — auch wenn sie jünger aussehen.",
      "eine Passantin",
      [
        wahl([
          { text: "Entschuldigung, darf ich Sie kurz etwas fragen?", ok: true, warum: "Der Standardanfang. Kurz, höflich, niemand fühlt sich überfallen." },
          { text: "Hey, du!", ok: false, warum: "Fremde duzt man nicht, und „hey“ klingt fordernd." },
          { text: "Hallo, wo ist die Post?", ok: false, warum: "Ohne „Entschuldigung“ wirkt es abrupt." },
        ]),
        sagt("Passantin", "Ja, bitte?"),
        wahl([
          { text: "Wissen Sie, wo hier die Post ist?", ok: true, warum: "Direkte Frage, Sie-Form, fertig." },
          { text: "Post!", ok: false, warum: "Ein Wort ist keine Frage." },
          { text: "Können Sie mich zur Post bringen?", ok: false, warum: "Zu viel verlangt. Nach dem Weg fragt man, begleitet werden muss man nicht." },
        ]),
        sagt("Passantin", "Ja — da vorne rechts, dann die zweite Straße links. Ungefähr fünf Minuten."),
        wahl([
          { text: "Also vorne rechts und dann die zweite links? Vielen Dank!", ok: true, warum: "Den Weg wiederholen — so merkt man ihn sich und merkt Fehler sofort." },
          { text: "Danke.", ok: true, warum: "Auch richtig, nur ohne die Sicherheit der Wiederholung." },
          { text: "Das verstehe ich nicht.", ok: false, warum: "Besser: „Entschuldigung, könnten Sie das noch einmal sagen?“" },
        ]),
      ]),

    S("restaurant", "Im Restaurant bestellen", "Gasthaus Zur Linde", "formell", "A1",
      "Im Restaurant wird gesiezt, aber der Ton ist locker. „Ich hätte gern“ passt immer.",
      "Kellner",
      [
        sagt("Kellner", "Guten Abend. Haben Sie schon gewählt?"),
        wahl([
          { text: "Guten Abend. Ich hätte gern die Kartoffelsuppe, bitte.", ok: true, warum: "„Ich hätte gern“ ist die freundlichste Bestellform im Deutschen." },
          { text: "Ich will die Suppe.", ok: false, warum: "„Ich will“ klingt fordernd. „Ich hätte gern“ oder „ich nehme“." },
          { text: "Geben Sie mir die Suppe.", ok: false, warum: "Ein Befehl. Im Deutschen sehr unhöflich." },
        ]),
        sagt("Kellner", "Gern. Und zu trinken?"),
        wahl([
          { text: "Ein stilles Wasser, bitte.", ok: true, warum: "Kurz und mit „bitte“." },
          { text: "Wasser.", ok: false, warum: "Er fragt gleich nach: mit oder ohne Kohlensäure. Gleich dazusagen spart eine Runde." },
          { text: "Nichts.", ok: false, warum: "Möglich — in Deutschland bestellt man aber fast immer etwas zu trinken." },
        ]),
        sagt("Kellner", "Kommt sofort. … So, die Suppe. Guten Appetit!"),
        wahl([
          { text: "Danke schön!", ok: true, warum: "Genau das erwartet er." },
          { text: "Guten Appetit.", ok: false, warum: "Er isst ja nicht mit. Wenn jemand am Tisch sitzt, sagt man es sich gegenseitig." },
          { text: "Endlich.", ok: false, warum: "Unnötig." },
        ]),
        sagt("Kellner", "Hat es geschmeckt? Möchten Sie noch etwas?"),
        wahl([
          { text: "Sehr gut, danke. Ich würde gern zahlen.", ok: true, warum: "Loben und zahlen wollen — der übliche Abschluss." },
          { text: "Rechnung.", ok: false, warum: "Zu knapp. „Ich würde gern zahlen“ oder „Die Rechnung, bitte“." },
          { text: "Nein.", ok: false, warum: "Dann bleibt offen, ob man noch sitzen bleibt oder gehen will." },
        ]),
      ]),

    S("absage", "Eine Einladung absagen", "per Nachricht", "informell", "B1",
      "Absagen ist nicht unhöflich — nicht antworten schon. Drei Teile: danken, absagen, neuen Vorschlag.",
      "Lea, Freundin",
      [
        sagt("Lea", "Wir grillen Samstag bei uns. Kommst du?"),
        wahl([
          { text: "Oh, lieb dass du fragst! Samstag geht bei mir leider nicht, ich arbeite. Nächstes Mal gern!", ok: true, warum: "Danken, absagen, Tür offen lassen — alle drei Teile." },
          { text: "Nein.", ok: false, warum: "Ohne Grund und ohne Freundlichkeit wirkt es wie Desinteresse." },
          { text: "Vielleicht, ich melde mich.", ok: false, warum: "Wer grillt, muss einkaufen. Ein klares Nein ist hilfreicher als ein offenes Vielleicht." },
        ]),
        sagt("Lea", "Schade! Arbeitest du samstags jetzt immer?"),
        wahl([
          { text: "Nur diesen Monat. Ab Juli habe ich die Wochenenden wieder frei.", ok: true, warum: "Kurze Erklärung, kein langes Rechtfertigen." },
          { text: "Ja, leider.", ok: true, warum: "Auch gut. Man muss sich nicht erklären." },
          { text: "Das ist eine lange Geschichte …", ok: false, warum: "Sie hat eine einfache Frage gestellt." },
        ]),
        sagt("Lea", "Okay! Dann machen wir was, wenn du wieder frei hast."),
        wahl([
          { text: "Sehr gern. Ich melde mich, sobald der Plan für Juli steht.", ok: true, warum: "Mit einer Zusage, die man auch halten kann." },
          { text: "Ja, mal sehen.", ok: false, warum: "Klingt, als wolle man nicht." },
          { text: "Danke, aber ich habe eigentlich nie Zeit.", ok: false, warum: "Das beendet die Freundschaft schneller als jede Absage." },
        ]),
      ]),
  ];

  const SITUATIONEN_IT = [
    S("bar", "Al bar: ordinare un caffè", "Bar Centrale", "formell", "A1",
      "In der Bar steht man meistens an der Theke. Bestellen geht schnell — und „per favore“ gehört dazu.",
      "il barista",
      [
        sagt("Il barista", "Buongiorno! Prego?"),
        wahl([
          { text: "Buongiorno. Un caffè, per favore.", ok: true, warum: "Gruß und Bestellung. In Italien heißt „un caffè“ immer Espresso." },
          { text: "Ciao, un caffè.", ok: false, warum: "„Ciao“ ist die du-Form. Zu Fremden „buongiorno“." },
          { text: "Voglio un caffè.", ok: false, warum: "„Voglio“ (ich will) klingt fordernd. „Vorrei“ oder einfach „un caffè, per favore“." },
        ]),
        sagt("Il barista", "Subito. Qualcos'altro? Un cornetto?"),
        wahl([
          { text: "Sì, grazie. Un cornetto alla crema.", ok: true, warum: "Annehmen und genau sagen, welchen." },
          { text: "No, grazie. Solo il caffè.", ok: true, warum: "Auch richtig — höflich abgelehnt." },
          { text: "No.", ok: false, warum: "Ohne „grazie“ klingt es schroff." },
        ]),
        sagt("Il barista", "Ecco. Sono due euro e cinquanta."),
        wahl([
          { text: "Ecco a Lei. Grazie!", ok: true, warum: "„Ecco a Lei“ — hier, bitte schön, in der Sie-Form." },
          { text: "Ecco a te.", ok: false, warum: "Das ist die du-Form. Zum Barista „a Lei“." },
          { text: "Troppo caro!", ok: false, warum: "Zweifünfzig ist ein normaler Preis." },
        ]),
      ]),

    S("negozio", "In un negozio: chiedere una taglia", "Negozio di abbigliamento", "formell", "A2",
      "Im Laden wird gesiezt. Die wichtigste Frage: „Ce l'ha in un'altra taglia?“",
      "la commessa",
      [
        sagt("La commessa", "Buongiorno, posso aiutarLa?"),
        wahl([
          { text: "Buongiorno. Sì, cerco una giacca.", ok: true, warum: "Gruß und Anliegen." },
          { text: "No, guardo solo.", ok: true, warum: "Auch richtig und völlig normal: „ich schaue nur“." },
          { text: "Ciao, cerco una giacca.", ok: false, warum: "„Ciao“ passt nicht zu einer fremden Verkäuferin." },
        ]),
        sagt("La commessa", "Certo. Che taglia porta?"),
        wahl([
          { text: "La quarantotto, credo.", ok: true, warum: "Größe nennen, mit „credo“ (glaube ich) abschwächen." },
          { text: "Non lo so.", ok: true, warum: "Ehrlich — sie hilft dann beim Suchen." },
          { text: "Grande.", ok: false, warum: "Zu ungenau. Italienische Größen sind Zahlen." },
        ]),
        sagt("La commessa", "Questa è la quarantotto. Vuole provarla?"),
        wahl([
          { text: "Sì, grazie. Dov'è il camerino?", ok: true, warum: "Annehmen und nach der Umkleide fragen." },
          { text: "Sì. Dove?", ok: false, warum: "Verständlich, aber sehr knapp." },
          { text: "No, la prendo così.", ok: false, warum: "Möglich — anprobieren ist trotzdem klüger." },
        ]),
      ]),

    S("amici", "Conoscere qualcuno a una festa", "a casa di Giulia", "informell", "A1",
      "Auf einer Party wird geduzt. „Ciao, come ti chiami?“ reicht als Anfang.",
      "Matteo",
      [
        sagt("Matteo", "Ciao! Non ci conosciamo, vero? Sono Matteo."),
        wahl([
          { text: "Ciao Matteo, io sono Farhad. Piacere!", ok: true, warum: "Gruß, eigener Name, „piacere“ — das komplette Muster." },
          { text: "Buonasera. Mi chiamo Farhad Nouri.", ok: false, warum: "Zu förmlich für eine Party unter Freunden." },
          { text: "Sì.", ok: false, warum: "Er hat sich gerade vorgestellt." },
        ]),
        sagt("Matteo", "Piacere! Come conosci Giulia?"),
        wahl([
          { text: "Lavoriamo insieme. E tu?", ok: true, warum: "Antworten und zurückfragen." },
          { text: "Lavoriamo insieme.", ok: false, warum: "Fast — die Rückfrage fehlt." },
          { text: "Non la conosco bene.", ok: false, warum: "Klingt, als wolle man nicht reden." },
        ]),
        sagt("Matteo", "Siamo andati a scuola insieme. Da dove vieni?"),
        wahl([
          { text: "Vengo dall'Iran, da Isfahan. Vivo in Germania da un anno.", ok: true, warum: "Herkunft und Situation — genug zum Weiterreden." },
          { text: "Dall'Iran.", ok: false, warum: "Richtig, aber das Gespräch stockt." },
          { text: "È complicato.", ok: false, warum: "Eine einfache Frage verdient eine einfache Antwort." },
        ]),
      ]),

    S("medico", "Dal medico: prendere un appuntamento", "al telefono", "formell", "B1",
      "Am Telefon meldet man sich mit dem Namen und sagt gleich, worum es geht.",
      "la segretaria",
      [
        sagt("La segretaria", "Studio del dottor Ranieri, buongiorno."),
        wahl([
          { text: "Buongiorno. Sono Aynur Demirci, vorrei un appuntamento.", ok: true, warum: "Gruß, Name, Anliegen — wie im Deutschen." },
          { text: "Buongiorno, un appuntamento.", ok: false, warum: "Ohne Namen kann sie nichts eintragen." },
          { text: "Pronto?", ok: false, warum: "Sie hat sich bereits gemeldet." },
        ]),
        sagt("La segretaria", "Certo. È già nostra paziente?"),
        wahl([
          { text: "No, è la prima volta.", ok: true, warum: "Klar und kurz." },
          { text: "Non ho capito, può ripetere?", ok: true, warum: "Auch richtig — nachfragen ist nie falsch." },
          { text: "Forse.", ok: false, warum: "Das weiß man selbst am besten." },
        ]),
        sagt("La segretaria", "Va bene. Ho un posto martedì alle undici."),
        wahl([
          { text: "Martedì alle undici va benissimo. Grazie.", ok: true, warum: "Termin wiederholen — so entstehen keine Fehler." },
          { text: "Va bene.", ok: false, warum: "Fast gut. Den Termin zu wiederholen ist sicherer." },
          { text: "Non posso.", ok: false, warum: "Dann sagen, wann es geht." },
        ]),
      ]),
  ];

  /* =========================================================
     3. DIESELBE AUSSAGE, ZWEI FORMEN
     ========================================================= */
  const REGISTER_DE = [
    { was: "Begrüßung", sie: "Guten Tag.", du: "Hallo!" },
    { was: "Wie geht es?", sie: "Wie geht es Ihnen?", du: "Wie geht's dir?" },
    { was: "Name erfragen", sie: "Wie heißen Sie?", du: "Wie heißt du?" },
    { was: "Herkunft erfragen", sie: "Woher kommen Sie?", du: "Woher kommst du?" },
    { was: "Um Hilfe bitten", sie: "Könnten Sie mir bitte helfen?", du: "Kannst du mir mal helfen?" },
    { was: "Nicht verstanden", sie: "Entschuldigung, könnten Sie das wiederholen?", du: "Wie bitte? Sag das noch mal." },
    { was: "Langsamer sprechen", sie: "Könnten Sie bitte langsamer sprechen?", du: "Nicht so schnell, bitte." },
    { was: "Etwas anbieten", sie: "Möchten Sie einen Kaffee?", du: "Willst du 'nen Kaffee?" },
    { was: "Etwas ablehnen", sie: "Nein danke, sehr freundlich.", du: "Nee, danke." },
    { was: "Zustimmen", sie: "Ja, sehr gern.", du: "Klar, mach ich." },
    { was: "Um einen Termin bitten", sie: "Ich würde gern einen Termin vereinbaren.", du: "Wann hast du Zeit?" },
    { was: "Sich entschuldigen", sie: "Entschuldigen Sie bitte die Verspätung.", du: "Sorry, ich bin zu spät." },
    { was: "Danken", sie: "Vielen Dank für Ihre Hilfe.", du: "Danke dir!" },
    { was: "Auf Dank antworten", sie: "Gern geschehen.", du: "Kein Ding." },
    { was: "Verabschieden", sie: "Auf Wiedersehen.", du: "Tschüss, bis dann!" },
    { was: "Am Telefon verabschieden", sie: "Auf Wiederhören.", du: "Ciao, bis später!" },
    { was: "Nach dem Weg fragen", sie: "Entschuldigung, wissen Sie, wo der Bahnhof ist?", du: "Sag mal, wo ist der Bahnhof?" },
    { was: "Etwas bestellen", sie: "Ich hätte gern einen Kaffee, bitte.", du: "Einen Kaffee, bitte." },
    { was: "Nachfragen, ob es passt", sie: "Passt es Ihnen am Freitag?", du: "Freitag okay bei dir?" },
    { was: "Gute Wünsche", sie: "Ich wünsche Ihnen einen schönen Tag.", du: "Schönen Tag noch!" },
  ];

  const REGISTER_IT = [
    { was: "Begrüßung", sie: "Buongiorno.", du: "Ciao!" },
    { was: "Wie geht es?", sie: "Come sta?", du: "Come stai?" },
    { was: "Name erfragen", sie: "Come si chiama?", du: "Come ti chiami?" },
    { was: "Herkunft erfragen", sie: "Di dov'è?", du: "Di dove sei?" },
    { was: "Um Hilfe bitten", sie: "Potrebbe aiutarmi?", du: "Mi puoi aiutare?" },
    { was: "Nicht verstanden", sie: "Scusi, può ripetere?", du: "Scusa, puoi ripetere?" },
    { was: "Etwas anbieten", sie: "Vuole un caffè?", du: "Vuoi un caffè?" },
    { was: "Danken", sie: "La ringrazio.", du: "Grazie!" },
    { was: "Auf Dank antworten", sie: "Prego.", du: "Figurati." },
    { was: "Verabschieden", sie: "Arrivederci.", du: "Ciao, a presto!" },
    { was: "Sich entschuldigen", sie: "Mi scusi per il ritardo.", du: "Scusa il ritardo." },
    { was: "Etwas bestellen", sie: "Vorrei un caffè, per favore.", du: "Un caffè, per favore." },
  ];

  /* Wann duzt man, wann siezt man? Kurz und ohne Wenn und Aber. */
  const REGELN_ANREDE_DE = [
    { wann: "Fremde auf der Straße, im Laden, im Amt, beim Arzt", form: "Sie", warum: "Auch wenn die Person jünger aussieht." },
    { wann: "Vorgesetzte, Lehrer:innen, Ärzt:innen, Behörden", form: "Sie", warum: "Bis ausdrücklich das Du angeboten wird." },
    { wann: "Nachbarn beim ersten Mal", form: "Sie", warum: "Oft kommt das Du nach ein paar Wochen von selbst." },
    { wann: "Kinder und Jugendliche bis etwa 16", form: "du", warum: "Auch fremde Kinder duzt man." },
    { wann: "Freunde, Familie, enge Kolleg:innen", form: "du", warum: "" },
    { wann: "Im Sportverein, im Sprachkurs, auf Partys", form: "du", warum: "Dort wird fast überall geduzt." },
    { wann: "In vielen Betrieben unter Kolleg:innen", form: "du", warum: "Aber nicht überall — am ersten Tag zuhören, wie die anderen reden." },
    { wann: "Im Internet, in Foren, bei Werbung", form: "du", warum: "Firmen duzen ihre Kundschaft heute oft." },
  ];

  const DU_ANBIETEN = {
    titel: "Wer bietet das Du an?",
    text: "Die ältere Person der jüngeren, die Vorgesetzte der Angestellten, die Frau dem Mann — so die alte Regel. In der Praxis: Wer länger da ist, bietet es an. Man kann es auch selbst vorschlagen.",
    saetze: [
      "Wollen wir uns nicht duzen? Ich bin Nadine.",
      "Sagen Sie ruhig du.",
      "Ich bin übrigens Timo — wir können uns gern duzen.",
      "Gern! Ich bin Aynur.",
      "Sehr gern, danke. Ich heiße Farhad.",
    ],
    ablehnen: "Ablehnen ist erlaubt und muss nicht unfreundlich klingen: „Danke, ich bleibe lieber beim Sie — das bin ich so gewohnt.“",
  };

  return {
    SCHRITTE: { de: SCHRITTE_DE, it: SCHRITTE_IT },
    SITUATIONEN: { de: SITUATIONEN_DE, it: SITUATIONEN_IT },
    REGISTER: { de: REGISTER_DE, it: REGISTER_IT },
    ANREDE: { de: REGELN_ANREDE_DE },
    DU_ANBIETEN: DU_ANBIETEN,
  };
})();
