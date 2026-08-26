/* =========================================================
   DATA — EXERCISES
   Jede Kategorie liefert eine Funktion getBank(), die ein
   Array von Fragen zurückgibt:
   { prompt, options:[...], correct:[idx,...], explain }
   `correct` kann mehrere Indizes enthalten -> Bonuspunkt-Logik.
   ========================================================= */

const ExerciseData = (function () {
  "use strict";

  /* ---------------------------------------------------------
     1) ARTIKEL (der/die/das) — Wortliste -> Fragen generiert
     --------------------------------------------------------- */
  const ARTIKEL_WORDS = [
    ["Tisch","der"],["Lampe","die"],["Fenster","das"],["Stuhl","der"],["Tür","die"],
    ["Auto","das"],["Baum","der"],["Blume","die"],["Haus","das"],["Hund","der"],
    ["Katze","die"],["Pferd","das"],["Apfel","der"],["Banane","die"],["Brot","das"],
    ["Käse","der"],["Milch","die"],["Wasser","das"],["Wein","der"],["Suppe","die"],
    ["Fleisch","das"],["Zucker","der"],["Butter","die"],["Salz","das"],["Löffel","der"],
    ["Gabel","die"],["Messer","das"],["Teller","der"],["Tasse","die"],["Glas","das"],
    ["Schrank","der"],["Kommode","die"],["Bett","das"],["Spiegel","der"],["Uhr","die"],
    ["Bild","das"],["Computer","der"],["Tastatur","die"],["Handy","das"],["Drucker","der"],
    ["Maus","die"],["Kabel","das"],["Rucksack","der"],["Tasche","die"],["Portemonnaie","das"],
    ["Schlüssel","der"],["Brille","die"],["Buch","das"],["Stift","der"],["Zeitung","die"],
    ["Heft","das"],["Bahnhof","der"],["Straße","die"],["Zug","der"],["Ampel","die"],
    ["Fahrrad","das"],["Bus","der"],["Flugzeug","das"],["Flughafen","der"],["Brücke","die"],
    ["Rathaus","das"],["Park","der"],["Bank","die"],["Museum","das"],["Supermarkt","der"],
    ["Bäckerei","die"],["Krankenhaus","das"],["Arzt","der"],["Kind","das"],["Lehrer","der"],
    ["Lehrerin","die"],["Mädchen","das"],["Junge","der"],["Frau","die"],["Baby","das"],
    ["Mann","der"],["Familie","die"],["Jahr","das"],["Monat","der"],["Woche","die"],
    ["Wochenende","das"],["Sommer","der"],["Sonne","die"],["Wetter","das"],["Regen","der"],
    ["Wolke","die"],["Schnee","der"],["Eis","das"],["Wind","der"],["Kälte","die"],
    ["Frühling","der"],["Herbst","der"],["Winter","der"],["Garten","der"],["Wiese","die"],
    ["Berg","der"],["Fluss","der"],["Stadt","die"],["Land","das"],["Wald","der"],
    ["Insel","die"],["Schiff","das"],["Vogel","der"],["Fisch","der"],["Blatt","das"],
  ];

  function bankArtikel() {
    return Core.shuffle(ARTIKEL_WORDS).map(([word, correct]) => {
      const opts = ["der", "die", "das"];
      return {
        prompt: `___ ${word}`,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain: `Richtig heißt es „${correct} ${word}“.`,
      };
    });
  }

  /* ---------------------------------------------------------
     2) SINGULAR & PLURAL — Wortliste -> Fragen generiert
     --------------------------------------------------------- */
  const PLURAL_WORDS = [
    ["Tisch","Tische"],["Lampe","Lampen"],["Fenster","Fenster"],["Stuhl","Stühle"],["Tür","Türen"],
    ["Auto","Autos"],["Baum","Bäume"],["Blume","Blumen"],["Haus","Häuser"],["Hund","Hunde"],
    ["Katze","Katzen"],["Pferd","Pferde"],["Apfel","Äpfel"],["Banane","Bananen"],["Brot","Brote"],
    ["Löffel","Löffel"],["Gabel","Gabeln"],["Messer","Messer"],["Teller","Teller"],["Tasse","Tassen"],
    ["Glas","Gläser"],["Schrank","Schränke"],["Kommode","Kommoden"],["Bett","Betten"],["Spiegel","Spiegel"],
    ["Uhr","Uhren"],["Bild","Bilder"],["Computer","Computer"],["Handy","Handys"],["Drucker","Drucker"],
    ["Maus","Mäuse"],["Kabel","Kabel"],["Rucksack","Rucksäcke"],["Tasche","Taschen"],["Schlüssel","Schlüssel"],
    ["Brille","Brillen"],["Buch","Bücher"],["Stift","Stifte"],["Zeitung","Zeitungen"],["Heft","Hefte"],
    ["Bahnhof","Bahnhöfe"],["Straße","Straßen"],["Zug","Züge"],["Ampel","Ampeln"],["Fahrrad","Fahrräder"],
    ["Bus","Busse"],["Flugzeug","Flugzeuge"],["Flughafen","Flughäfen"],["Brücke","Brücken"],["Rathaus","Rathäuser"],
    ["Park","Parks"],["Bank","Bänke"],["Museum","Museen"],["Supermarkt","Supermärkte"],["Bäckerei","Bäckereien"],
    ["Krankenhaus","Krankenhäuser"],["Arzt","Ärzte"],["Kind","Kinder"],["Lehrer","Lehrer"],["Mädchen","Mädchen"],
    ["Junge","Jungen"],["Frau","Frauen"],["Mann","Männer"],["Jahr","Jahre"],["Monat","Monate"],
    ["Woche","Wochen"],["Wolke","Wolken"],["Garten","Gärten"],["Wiese","Wiesen"],["Freund","Freunde"],
    ["Ball","Bälle"],["Ei","Eier"],["Vogel","Vögel"],["Fisch","Fische"],["Blatt","Blätter"],
    ["Berg","Berge"],["See","Seen"],["Fluss","Flüsse"],["Stadt","Städte"],["Land","Länder"],
    ["Dorf","Dörfer"],["Wald","Wälder"],["Insel","Inseln"],["Stein","Steine"],["Schiff","Schiffe"],
    ["Koffer","Koffer"],["Regenschirm","Regenschirme"],["Kissen","Kissen"],["Decke","Decken"],["Sofa","Sofas"],
    ["Teppich","Teppiche"],["Vorhang","Vorhänge"],["Ofen","Öfen"],["Kühlschrank","Kühlschränke"],["Regal","Regale"],
    ["Vase","Vasen"],["Kerze","Kerzen"],["Socke","Socken"],["Schuh","Schuhe"],["Waschmaschine","Waschmaschinen"],
  ];

  function makeDistractors(singular, correct) {
    const guesses = [singular + "s", singular + "en", singular, correct + "s", singular + "e"];
    const uniq = [...new Set(guesses)].filter((g) => g !== correct);
    return Core.shuffle(uniq).slice(0, 2);
  }

  function bankPlural() {
    return Core.shuffle(PLURAL_WORDS).map(([singular, correct]) => {
      const distractors = makeDistractors(singular, correct);
      const opts = Core.shuffle([correct, ...distractors]);
      return {
        prompt: `Wie lautet der Plural von „${singular}“?`,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain: `Der Plural von „${singular}“ ist „${correct}“.`,
      };
    });
  }

  /* ---------------------------------------------------------
     3) SYNONYME — Wort, richtiges Synonym, 2 Distraktoren
     --------------------------------------------------------- */
  const SYNONYME = [
    ["schön","hübsch","hässlich","traurig"],
    ["schnell","rasch","langsam","müde"],
    ["anfangen","beginnen","aufhören","warten"],
    ["Antwort","Erwiderung","Frage","Anfang"],
    ["groß","riesig","winzig","leise"],
    ["klein","winzig","riesig","laut"],
    ["froh","glücklich","traurig","müde"],
    ["Angst","Furcht","Mut","Freude"],
    ["reden","sprechen","schweigen","singen"],
    ["gucken","schauen","hören","riechen"],
    ["kaufen","erwerben","verkaufen","schenken"],
    ["Wohnung","Bleibe","Auto","Garten"],
    ["Freund","Kumpel","Feind","Fremder"],
    ["essen","verzehren","hungern","kochen"],
    ["arbeiten","schuften","faulenzen","schlafen"],
    ["müde","erschöpft","munter","hungrig"],
    ["billig","preiswert","teuer","kostenlos"],
    ["teuer","kostspielig","billig","gratis"],
    ["schlau","klug","dumm","müde"],
    ["dumm","töricht","klug","nett"],
    ["nett","freundlich","unfreundlich","traurig"],
    ["wichtig","bedeutend","unwichtig","klein"],
    ["sofort","gleich","später","nie"],
    ["oft","häufig","selten","nie"],
    ["selten","rar","oft","immer"],
    ["laut","lärmend","leise","ruhig"],
    ["leise","still","laut","hell"],
    ["hell","licht","dunkel","kalt"],
    ["dunkel","finster","hell","warm"],
    ["kalt","kühl","warm","heiß"],
    ["warm","mild","kalt","kühl"],
    ["Weg","Pfad","Ziel","Auto"],
    ["Idee","Einfall","Ende","Fehler"],
    ["helfen","unterstützen","schaden","ignorieren"],
    ["verstehen","begreifen","vergessen","fragen"],
    ["stark","kräftig","schwach","müde"],
    ["schwach","kraftlos","stark","gesund"],
    ["traurig","betrübt","fröhlich","wütend"],
    ["glücklich","froh","unglücklich","müde"],
    ["wütend","zornig","ruhig","froh"],
    ["ruhig","gelassen","laut","nervös"],
    ["langsam","gemächlich","schnell","hektisch"],
    ["hübsch","attraktiv","hässlich","langweilig"],
    ["hässlich","unschön","hübsch","elegant"],
    ["alt","betagt","jung","neu"],
    ["jung","jugendlich","alt","erwachsen"],
    ["neu","frisch","alt","gebraucht"],
    ["sauber","rein","schmutzig","nass"],
    ["schmutzig","dreckig","sauber","trocken"],
    ["leicht","einfach","schwer","kompliziert"],
    ["schwer","schwierig","leicht","einfach"],
    ["mutig","tapfer","feige","ängstlich"],
    ["feige","ängstlich","mutig","stark"],
    ["reich","wohlhabend","arm","bescheiden"],
    ["arm","bedürftig","reich","wohlhabend"],
  ];

  function bankSynonyme() {
    return Core.shuffle(SYNONYME).map(([word, correct, d1, d2]) => {
      const opts = Core.shuffle([correct, d1, d2]);
      return {
        prompt: `Welches Wort bedeutet dasselbe wie „${word}“?`,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain: `„${correct}“ ist ein Synonym für „${word}“.`,
      };
    });
  }

  /* ---------------------------------------------------------
     4) WENN / OB
     --------------------------------------------------------- */
  const WENN_OB = [
    ["Ich weiß nicht, ___ er heute kommt.","ob","„ob“ leitet eine indirekte Frage ein."],
    ["___ es regnet, bleibe ich zu Hause.","wenn","„wenn“ drückt eine Bedingung aus."],
    ["Sie fragt, ___ ich Zeit habe.","ob","Nach „fragen“ steht meist „ob“."],
    ["___ ich Zeit habe, rufe ich dich an.","wenn","Bedingung/Zeitpunkt -> „wenn“."],
    ["Er überlegt, ___ er das Angebot annimmt.","ob","Unsicherheit -> „ob“."],
    ["___ du müde bist, solltest du schlafen gehen.","wenn","Bedingung -> „wenn“."],
    ["Ich bin mir nicht sicher, ___ das stimmt.","ob","Zweifel -> „ob“."],
    ["___ die Sonne scheint, gehen wir spazieren.","wenn","Bedingung -> „wenn“."],
    ["Kannst du mir sagen, ___ der Zug pünktlich ist?","ob","Indirekte Frage -> „ob“."],
    ["___ ich groß bin, möchte ich Astronautin werden.","wenn","Zeitlicher Bezug -> „wenn“."],
    ["Wir wissen noch nicht, ___ die Party stattfindet.","ob","Unsicherheit -> „ob“."],
    ["___ du Hilfe brauchst, melde dich.","wenn","Bedingung -> „wenn“."],
    ["Sie fragte mich, ___ ich verheiratet bin.","ob","Indirekte Frage -> „ob“."],
    ["___ es kalt wird, ziehe ich eine Jacke an.","wenn","Bedingung -> „wenn“."],
    ["Ich überprüfe, ___ alles korrekt ist.","ob","Prüfung/Unsicherheit -> „ob“."],
    ["___ man höflich ist, kommt man weiter.","wenn","Bedingung -> „wenn“."],
    ["Er wollte wissen, ___ wir mitkommen.","ob","Indirekte Frage -> „ob“."],
    ["___ ihr Lust habt, könnt ihr vorbeikommen.","wenn","Bedingung -> „wenn“."],
    ["Ich bin gespannt, ___ das Projekt klappt.","ob","Unsicherheit -> „ob“."],
    ["___ jemand fragt, sag einfach die Wahrheit.","wenn","Bedingung -> „wenn“."],
    ["Niemand weiß, ___ das Wetter morgen gut wird.","ob","Unsicherheit -> „ob“."],
    ["___ ich Geld spare, kann ich reisen.","wenn","Bedingung -> „wenn“."],
    ["Sag mir, ___ du einverstanden bist.","ob","Indirekte Frage -> „ob“."],
    ["___ man früh aufsteht, hat man mehr vom Tag.","wenn","Bedingung -> „wenn“."],
    ["Ich zweifle daran, ___ das die beste Lösung ist.","ob","Zweifel -> „ob“."],
    ["Ich möchte wissen, ___ das Geschäft heute geöffnet hat.","ob","Indirekte Frage -> „ob“."],
    ["___ du Zeit hast, lass uns telefonieren.","wenn","Bedingung -> „wenn“."],
    ["Er checkt, ___ die Tür abgeschlossen ist.","ob","Prüfung/Unsicherheit -> „ob“."],
    ["___ es dunkel wird, gehen wir nach Hause.","wenn","Zeitlicher Bezug -> „wenn“."],
    ["Ich bin neugierig, ___ das Rezept funktioniert.","ob","Unsicherheit -> „ob“."],
    ["___ du fertig bist, sag Bescheid.","wenn","Bedingung -> „wenn“."],
    ["Sie testet, ___ die Batterie noch funktioniert.","ob","Prüfung -> „ob“."],
    ["___ wir Glück haben, sehen wir das Feuerwerk.","wenn","Bedingung -> „wenn“."],
    ["Ich erkundige mich, ___ der Kurs noch Plätze hat.","ob","Indirekte Frage -> „ob“."],
    ["___ er anruft, gib mir Bescheid.","wenn","Bedingung -> „wenn“."],
    ["Weißt du, ___ der Laden sonntags offen ist?","ob","Indirekte Frage -> „ob“."],
    ["___ ihr mögt, können wir morgen weitermachen.","wenn","Bedingung -> „wenn“."],
    ["Ich bin unsicher, ___ ich die Prüfung bestanden habe.","ob","Unsicherheit -> „ob“."],
    ["___ du willst, helfe ich dir beim Umzug.","wenn","Bedingung -> „wenn“."],
    ["Er fragt sich, ___ er den Job annehmen soll.","ob","Unsicherheit -> „ob“."],
    ["___ die Kinder müde sind, schlafen sie schnell ein.","wenn","Bedingung -> „wenn“."],
    ["Ich prüfe nach, ___ alles bezahlt wurde.","ob","Prüfung -> „ob“."],
    ["___ man freundlich fragt, hilft man gerne.","wenn","Bedingung -> „wenn“."],
    ["Sag mir bitte, ___ du noch kommst.","ob","Indirekte Frage -> „ob“."],
    ["___ es so weitergeht, wird alles gut.","wenn","Bedingung -> „wenn“."],
  ];

  function bankWennOb() {
    return Core.shuffle(WENN_OB).map(([sentence, correct, explain]) => {
      const opts = ["wenn", "ob"];
      return {
        prompt: sentence,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain,
      };
    });
  }

  /* ---------------------------------------------------------
     5) ALS / WIE
     --------------------------------------------------------- */
  const ALS_WIE = [
    ["Sie ist größer ___ ich.","als","Bei Ungleichheit (Komparativ) steht „als“."],
    ["Er ist so groß ___ sein Vater.","wie","Bei Gleichheit steht „wie“."],
    ["Das war schneller ___ erwartet.","als","Komparativ -> „als“."],
    ["Mach es genauso ___ ich.","wie","Gleichheit -> „wie“."],
    ["Nichts ist so wichtig ___ Gesundheit.","wie","Gleichheit -> „wie“."],
    ["Er kam später ___ geplant.","als","Komparativ -> „als“."],
    ["Sie kocht so gut ___ ihre Mutter.","wie","Gleichheit -> „wie“."],
    ["Das Auto ist teurer ___ mein Fahrrad.","als","Komparativ -> „als“."],
    ["So schön ___ heute war das Wetter selten.","wie","Gleichheit -> „wie“."],
    ["Er läuft schneller ___ du.","als","Komparativ -> „als“."],
    ["Ich fühle mich heute besser ___ gestern.","als","Komparativ -> „als“."],
    ["Alles lief genauso ___ geplant.","wie","Gleichheit -> „wie“."],
    ["Sie ist klüger ___ sie denkt.","als","Komparativ -> „als“."],
    ["Das Konzert war lauter ___ erwartet.","als","Komparativ -> „als“."],
    ["Er benimmt sich ___ ein kleines Kind.","wie","Vergleich ohne Steigerung -> „wie“."],
    ["Das schmeckt genauso ___ bei meiner Oma.","wie","Gleichheit -> „wie“."],
    ["Der Film war interessanter ___ das Buch.","als","Komparativ -> „als“."],
    ["Ich mag Tee genauso gern ___ Kaffee.","wie","Gleichheit -> „wie“."],
    ["Die Prüfung war leichter ___ gedacht.","als","Komparativ -> „als“."],
    ["Er spielt Klavier so gut ___ ein Profi.","wie","Gleichheit -> „wie“."],
    ["Sie ist älter ___ ich dachte.","als","Komparativ -> „als“."],
    ["Das Zimmer ist genauso groß ___ meins.","wie","Gleichheit -> „wie“."],
    ["Der Zug war pünktlicher ___ sonst.","als","Komparativ -> „als“."],
    ["Er redet so viel ___ ein Papagei.","wie","Gleichheit -> „wie“."],
    ["Die Party war lustiger ___ ich erwartet hatte.","als","Komparativ -> „als“."],
    ["Sie tanzt eleganter ___ alle anderen.","als","Komparativ -> „als“."],
    ["Er ist genauso nett ___ sein Bruder.","wie","Gleichheit -> „wie“."],
    ["Das Wetter wurde schlechter ___ vorhergesagt.","als","Komparativ -> „als“."],
    ["Iss so viel Gemüse ___ möglich.","wie","Gleichheit -> „wie“."],
    ["Der Kaffee hier ist stärker ___ zu Hause.","als","Komparativ -> „als“."],
    ["Sie singt so schön ___ eine Profisängerin.","wie","Gleichheit -> „wie“."],
    ["Die Miete ist höher ___ letztes Jahr.","als","Komparativ -> „als“."],
    ["Er fährt so vorsichtig ___ ein Fahrlehrer.","wie","Gleichheit -> „wie“."],
    ["Das Spiel war spannender ___ erwartet.","als","Komparativ -> „als“."],
    ["Sie ist so geduldig ___ ihre Mutter.","wie","Gleichheit -> „wie“."],
    ["Die Aufgabe war komplizierter ___ gedacht.","als","Komparativ -> „als“."],
    ["Er kocht genauso gern ___ sie.","wie","Gleichheit -> „wie“."],
    ["Das Hotel war teurer ___ im Internet angegeben.","als","Komparativ -> „als“."],
    ["Sie läuft so schnell ___ ein Hase.","wie","Gleichheit -> „wie“."],
    ["Der Test war einfacher ___ die letzten Male.","als","Komparativ -> „als“."],
    ["Er ist so müde ___ ich.","wie","Gleichheit -> „wie“."],
    ["Die Schlange war länger ___ gedacht.","als","Komparativ -> „als“."],
    ["Sie kann genauso gut kochen ___ backen.","wie","Gleichheit -> „wie“."],
    ["Das Buch war spannender ___ der Film.","als","Komparativ -> „als“."],
    ["Er ist so groß ___ ein Basketballspieler.","wie","Gleichheit -> „wie“."],
  ];

  function bankAlsWie() {
    return Core.shuffle(ALS_WIE).map(([sentence, correct, explain]) => {
      const opts = ["als", "wie"];
      return {
        prompt: sentence,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain,
      };
    });
  }

  /* ---------------------------------------------------------
     6) KENNEN / WISSEN
     --------------------------------------------------------- */
  const KENNEN_WISSEN = [
    ["Ich ___ ihn schon seit der Schulzeit.","kenne","weiß",0],
    ["___ du, wie spät es ist?","Kennst","Weißt",1],
    ["Er ___ nicht, wo seine Schlüssel sind.","kennt","weiß",1],
    ["___ ihr diese Stadt?","Kennt","Wisst",0],
    ["Ich ___ nicht, ob das stimmt.","kenne","weiß",1],
    ["Sie ___ viele interessante Leute.","kennt","weiß",0],
    ["___ du diesen Film?","Kennst","Weißt",0],
    ["Wir ___ nicht, wann der Bus kommt.","kennen","wissen",1],
    ["Er ___ die Antwort genau.","kennt","weiß",1],
    ["___ Sie diese Adresse?","Kennen","Wissen",0],
    ["Ich ___ mich hier nicht aus.","kenne","weiß",0],
    ["Sie ___ ganz genau, was sie will.","kennt","weiß",1],
    ["___ du meinen Bruder?","Kennst","Weißt",0],
    ["Wir ___ die Regeln des Spiels.","kennen","wissen",0],
    ["Er ___ nicht, wie man das macht.","kennt","weiß",1],
    ["___ ihr, wo das Museum ist?","Kennt","Wisst",1],
    ["Ich ___ dieses Lied gut.","kenne","weiß",0],
    ["Sie ___ nicht, wer angerufen hat.","kennt","weiß",1],
    ["___ du dich mit Computern aus?","Kennst","Weißt",0],
    ["Er ___ alle Hauptstädte Europas auswendig.","kennt","weiß",1],
    ["Ich ___ dieses Restaurant, es ist sehr gut.","kenne","weiß",0],
    ["___ Sie, wann der Zug abfährt?","Kennen","Wissen",1],
    ["Wir ___ diese Gegend sehr gut.","kennen","wissen",0],
    ["Sie ___ nicht genau, wie alt er ist.","kennt","weiß",1],
    ["___ du den Weg zum Bahnhof?","Kennst","Weißt",0],
    ["Ich ___ die Stadt in- und auswendig.","kenne","weiß",0],
    ["___ du, wie man das Programm installiert?","Kennst","Weißt",1],
    ["Sie ___ nicht, dass die Party abgesagt wurde.","kennt","weiß",1],
    ["___ ihr euch schon lange?","Kennt","Wisst",0],
    ["Ich ___ nicht genau, wie das funktioniert.","kenne","weiß",1],
    ["Er ___ jeden im Büro persönlich.","kennt","weiß",0],
    ["___ du das neue Café in der Stadt?","Kennst","Weißt",0],
    ["Wir ___ nicht, ob der Zug Verspätung hat.","kennen","wissen",1],
    ["Sie ___ das Land sehr gut, sie ist dort aufgewachsen.","kennt","weiß",0],
    ["___ Sie, wie spät der Laden schließt?","Kennen","Wissen",1],
    ["Ich ___ diese Melodie, aber nicht den Titel.","kenne","weiß",0],
    ["Er ___ nicht, wer die Nachricht geschickt hat.","kennt","weiß",1],
    ["___ ihr die Regeln dieses Kartenspiels?","Kennt","Wisst",0],
    ["Ich ___ nicht, wie viel das kostet.","kenne","weiß",1],
    ["Sie ___ die Künstlerin persönlich.","kennt","weiß",0],
    ["___ du, warum der Bus nicht kommt?","Kennst","Weißt",1],
    ["Wir ___ das Restaurant, es ist wirklich gut.","kennen","wissen",0],
    ["Er ___ genau, was zu tun ist.","kennt","weiß",1],
    ["___ Sie diesen Autor?","Kennen","Wissen",0],
    ["Ich ___ nicht, ob ich morgen Zeit habe.","kenne","weiß",1],
  ];

  function bankKennenWissen() {
    return Core.shuffle(KENNEN_WISSEN).map(([sentence, formA, formB, correctIdx]) => {
      const options = [formA, formB];
      return {
        prompt: sentence,
        options,
        correct: [correctIdx],
        explain:
          correctIdx === options.indexOf(formA)
            ? `„${formA}“ passt hier — man kennt Personen/Orte oder ist mit etwas vertraut.`
            : `„${formB}“ passt hier — man weiß Fakten oder Informationen.`,
      };
    });
  }

  /* ---------------------------------------------------------
     7) DAS / DASS
     --------------------------------------------------------- */
  const DAS_DASS = [
    ["Ich glaube, ___ er recht hat.","dass","Konjunktion vor Nebensatz -> „dass“."],
    ["___ ist mein Buch.","das","Artikel/Pronomen -> „das“."],
    ["Sie sagt, ___ sie müde ist.","dass","Konjunktion -> „dass“."],
    ["___ Auto dort ist neu.","das","Artikel -> „das“."],
    ["Ich hoffe, ___ alles gut wird.","dass","Konjunktion -> „dass“."],
    ["___ Haus gehört meinen Eltern.","das","Artikel -> „das“."],
    ["Er meint, ___ wir uns beeilen sollten.","dass","Konjunktion -> „dass“."],
    ["___ Mädchen dort ist meine Schwester.","das","Artikel -> „das“."],
    ["Ich weiß, ___ du recht hast.","dass","Konjunktion -> „dass“."],
    ["___ ist wirklich interessant.","das","Pronomen -> „das“."],
    ["Sie freut sich, ___ du kommst.","dass","Konjunktion -> „dass“."],
    ["___ Kind spielt im Garten.","das","Artikel -> „das“."],
    ["Ich finde, ___ das eine gute Idee ist.","dass","Konjunktion -> „dass“."],
    ["___ Wetter heute ist schön.","das","Artikel -> „das“."],
    ["Er behauptet, ___ er unschuldig ist.","dass","Konjunktion -> „dass“."],
    ["Ist ___ dein Handy?","das","Pronomen -> „das“."],
    ["Ich bin sicher, ___ es klappt.","dass","Konjunktion -> „dass“."],
    ["Ich habe gehört, ___ die Prüfung schwer war.","dass","Konjunktion -> „dass“."],
    ["___ war ein toller Tag.","das","Pronomen -> „das“."],
    ["Sie erklärt, ___ sie später kommt.","dass","Konjunktion -> „dass“."],
    ["___ Restaurant hier ist sehr gut.","das","Artikel -> „das“."],
    ["Ich vermute, ___ er schon zu Hause ist.","dass","Konjunktion -> „dass“."],
    ["___ ist alles, was ich weiß.","das","Pronomen -> „das“."],
    ["Es ist schade, ___ du nicht kommen kannst.","dass","Konjunktion -> „dass“."],
    ["___ Fahrrad dort gehört mir.","das","Artikel -> „das“."],
    ["Er sagt, ___ er das Meeting verschiebt.","dass","Konjunktion -> „dass“."],
    ["___ Café dort macht den besten Kaffee.","das","Artikel -> „das“."],
    ["Ich bin froh, ___ du da bist.","dass","Konjunktion -> „dass“."],
    ["___ ist wirklich eine tolle Nachricht.","das","Pronomen -> „das“."],
    ["Sie glaubt, ___ es morgen regnet.","dass","Konjunktion -> „dass“."],
    ["___ neue Handy ist ziemlich teuer.","das","Artikel -> „das“."],
    ["Ich denke, ___ wir früher losfahren sollten.","dass","Konjunktion -> „dass“."],
    ["___ Mädchen da drüben ist meine Cousine.","das","Artikel -> „das“."],
    ["Er hofft, ___ die Prüfung nicht so schwer wird.","dass","Konjunktion -> „dass“."],
    ["___ Bild an der Wand hat mein Opa gemalt.","das","Artikel -> „das“."],
    ["Ich habe bemerkt, ___ die Tür offen war.","dass","Konjunktion -> „dass“."],
    ["___ war ein wirklich langer Tag.","das","Pronomen -> „das“."],
    ["Sie meint, ___ das Projekt gut läuft.","dass","Konjunktion -> „dass“."],
    ["___ Zimmer dort ist frei.","das","Artikel -> „das“."],
    ["Ich fürchte, ___ wir den Flug verpassen.","dass","Konjunktion -> „dass“."],
    ["Ist ___ deine Jacke?","das","Pronomen -> „das“."],
    ["Er betont, ___ Pünktlichkeit ihm wichtig ist.","dass","Konjunktion -> „dass“."],
    ["___ Auto hat mein Vater gekauft.","das","Artikel -> „das“."],
    ["Ich bin überzeugt, ___ das die richtige Entscheidung war.","dass","Konjunktion -> „dass“."],
    ["___ Baby schläft schon.","das","Artikel -> „das“."],
  ];

  function bankDasDass() {
    return Core.shuffle(DAS_DASS).map(([sentence, correct, explain]) => {
      const opts = ["das", "dass"];
      return {
        prompt: sentence,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain,
      };
    });
  }

  /* ---------------------------------------------------------
     8) REDEWENDUNGEN — Bedeutung auswählen
     --------------------------------------------------------- */
  const REDEWENDUNGEN = [
    ["Da liegt der Hund begraben.","Das ist der eigentliche Grund/das Problem.","Der Hund ist gestorben.","Man sollte einen Hund kaufen."],
    ["Ins Gras beißen.","Sterben.","Picknicken gehen.","Vegetarier werden."],
    ["Die Katze im Sack kaufen.","Etwas kaufen, ohne es vorher zu prüfen.","Ein Haustier adoptieren.","Ein Schnäppchen machen."],
    ["Jemandem einen Bären aufbinden.","Jemandem etwas Falsches erzählen.","Jemandem ein Geschenk machen.","Jemanden erschrecken."],
    ["Tomaten auf den Augen haben.","Etwas Offensichtliches nicht sehen.","Rote Augen haben.","Gerne Tomaten essen."],
    ["Die Nase voll haben.","Genervt/wütend über etwas sein.","Erkältet sein.","Zufrieden sein."],
    ["Ins kalte Wasser springen.","Etwas Neues ohne Vorbereitung wagen.","Schwimmen gehen.","Sich abkühlen."],
    ["Alles in Butter.","Alles ist in Ordnung.","Alles ist teuer.","Alles ist verdorben."],
    ["Jemanden auf den Arm nehmen.","Jemanden necken/veräppeln.","Jemandem helfen.","Jemanden tragen."],
    ["Den Nagel auf den Kopf treffen.","Genau das Richtige sagen.","Etwas kaputt machen.","Sich verletzen."],
    ["Um den heißen Brei reden.","Nicht direkt zum Punkt kommen.","Kochen lernen.","Über Essen sprechen."],
    ["Die Daumen drücken.","Jemandem Glück wünschen.","Sich streiten.","Applaudieren."],
    ["Schwein haben.","Glück haben.","Ein Haustier besitzen.","Viel essen."],
    ["Jemandem die kalte Schulter zeigen.","Jemanden ignorieren.","Jemandem helfen.","Jemanden umarmen."],
    ["Aus einer Mücke einen Elefanten machen.","Etwas Kleines übertreiben.","In den Zoo gehen.","Ein Problem lösen."],
    ["Ein Auge zudrücken.","Etwas nachsichtig übersehen.","Schlafen gehen.","Genau hinschauen."],
    ["Nicht alle Tassen im Schrank haben.","Verrückt sein.","Kein Geschirr besitzen.","Sehr ordentlich sein."],
    ["Butter bei die Fische.","Jetzt zur Sache kommen / ehrlich sein.","Fisch mit Butter braten.","Ein Geschenk machen."],
    ["Da steppt der Bär.","Da ist richtig viel los / eine gute Party.","Da ist ein Zoo.","Da ist es gefährlich."],
    ["Ich verstehe nur Bahnhof.","Ich verstehe gar nichts.","Ich bin am Bahnhof.","Ich fahre Zug."],
    ["Jemandem Honig um den Mund schmieren.","Jemandem schmeicheln.","Jemandem Essen geben.","Jemanden küssen."],
    ["Das ist mir Wurst.","Das ist mir egal.","Ich mag Wurst.","Ich bin Vegetarier."],
    ["Da beißt die Maus keinen Faden ab.","Daran gibt es nichts zu ändern.","Mäuse fressen keine Fäden.","Das Nähen ist schwierig."],
    ["Jemanden über den Tisch ziehen.","Jemanden betrügen/übervorteilen.","Jemandem beim Umzug helfen.","Etwas gemeinsam feiern."],
    ["Kein Blatt vor den Mund nehmen.","Offen und direkt seine Meinung sagen.","Schüchtern sein.","Sich verstecken."],
    ["Auf großem Fuß leben.","Verschwenderisch/luxuriös leben.","Große Schuhe tragen.","Sportlich sein."],
    ["Sich zum Affen machen.","Sich lächerlich machen.","In den Zoo gehen.","Sich verkleiden."],
    ["Wie ein Elefant im Porzellanladen.","Sehr ungeschickt/tollpatschig.","Sehr stark sein.","Sehr vorsichtig sein."],
    ["Jemandem den Kopf waschen.","Jemanden ausschimpfen.","Jemandem beim Duschen helfen.","Jemanden loben."],
    ["Klar wie Kloßbrühe.","Sarkastisch für „überhaupt nicht klar“.","Sehr klar und einfach.","Sehr lecker."],
    ["Den Löffel abgeben.","Sterben (salopp).","Das Besteck wegräumen.","Aufgeben beim Essen."],
    ["Jemandem auf die Nerven gehen.","Jemanden nerven, lästig sein.","Jemandem helfen.","Jemanden trösten."],
    ["Die Flinte ins Korn werfen.","Vorzeitig aufgeben.","Zur Jagd gehen.","Erfolgreich sein."],
    ["Ein Dorn im Auge sein.","Jemanden stören oder ärgern.","Verletzt sein.","Etwas bewundern."],
    ["Mit dem falschen Bein aufgestanden sein.","Schlecht gelaunt in den Tag starten.","Einen Unfall haben.","Zu spät kommen."],
    ["Etwas auf die lange Bank schieben.","Etwas immer wieder verschieben.","Etwas im Garten verstauen.","Sich ausruhen."],
    ["Jemandem ins Wort fallen.","Jemanden beim Sprechen unterbrechen.","Jemandem zustimmen.","Jemanden loben."],
    ["Sich etwas hinter die Ohren schreiben.","Sich etwas gut merken.","Sich verletzen.","Etwas vergessen."],
    ["Auf dem Holzweg sein.","Sich irren, falsch liegen.","Im Wald spazieren gehen.","Recht haben."],
    ["Die Kirche im Dorf lassen.","Nicht übertreiben, realistisch bleiben.","Zur Kirche gehen.","Umziehen."],
    ["Jemandem Löcher in den Bauch fragen.","Jemanden mit vielen Fragen löchern.","Jemanden verletzen.","Jemandem Essen geben."],
    ["Sich ins Fäustchen lachen.","Heimlich schadenfroh sein.","Weinen.","Laut lachen."],
    ["Alle Hände voll zu tun haben.","Sehr beschäftigt sein.","Nichts zu tun haben.","Etwas fallen lassen."],
    ["Unter die Haut gehen.","Emotional sehr berühren.","Eine Spritze bekommen.","Sich tätowieren lassen."],
    ["Die Katze aus dem Sack lassen.","Ein Geheimnis verraten.","Ein Haustier freilassen.","Einkaufen gehen."],
    ["Sich am Riemen reißen.","Sich zusammenreißen, diszipliniert sein.","Sich einen Gürtel kaufen.","Sich entspannen."],
    ["Jemanden im Regen stehen lassen.","Jemanden im Stich lassen.","Jemandem einen Schirm geben.","Mit jemandem spazieren gehen."],
    ["Da steckt der Teufel im Detail.","Kleinigkeiten machen die eigentliche Schwierigkeit aus.","Etwas ist gruselig.","Etwas ist sehr einfach."],
    ["Sich in Schale werfen.","Sich besonders fein anziehen.","Etwas zerbrechen.","Kochen gehen."],
    ["Jemandem die Show stehlen.","Mehr Aufmerksamkeit bekommen als jemand anderes.","Ein Ticket kaufen.","Applaudieren."],
  ];

  function bankRedewendungen() {
    return Core.shuffle(REDEWENDUNGEN).map(([phrase, correct, d1, d2]) => {
      const opts = Core.shuffle([correct, d1, d2]);
      return {
        prompt: `Was bedeutet: „${phrase}“`,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain: `„${phrase}“ bedeutet: ${correct}`,
      };
    });
  }

  /* ---------------------------------------------------------
     9) HÄUFIGE FEHLER — richtige Form erkennen
     --------------------------------------------------------- */
  const HAEUFIGE_FEHLER = [
    ["einzigste","einzige","„einzig“ ist bereits ein Superlativ, „einzigste“ existiert nicht."],
    ["gewunken","gewinkt","„winken“ ist ein regelmäßiges Verb: winken – winkte – gewinkt."],
    ["er ladet","er lädt","3. Person Singular von „laden“ ist „er lädt“."],
    ["wegen dem Regen","wegen des Regens","„wegen“ verlangt (standardsprachlich) den Genitiv."],
    ["größer wie du","größer als du","Vergleich bei Ungleichheit: „als“, nicht „wie“."],
    ["trotzdem er müde war, kam er","obwohl er müde war, kam er","„trotzdem“ ist Adverb, keine Konjunktion — hier „obwohl“."],
    ["besser wie erwartet","besser als erwartet","Komparativ + „als“, nicht „wie“."],
    ["ich habe kalt","mir ist kalt","Unpersönliche Konstruktion mit Dativ: „mir ist kalt“."],
    ["das Auto von meinem Vater","das Auto meines Vaters","Genitiv statt „von“ in der Standardsprache."],
    ["seit 2 Jahre","seit 2 Jahren","„seit“ verlangt den Dativ: „seit 2 Jahren“."],
    ["er ist älter wie ich","er ist älter als ich","Vergleich bei Ungleichheit -> „als“."],
    ["brauchst nicht kommen","brauchst nicht zu kommen","„brauchen“ + Infinitiv verlangt „zu“."],
    ["er hat gesagt, dass er kommt morgen","er hat gesagt, dass er morgen kommt","Im Nebensatz steht das Verb am Ende."],
    ["ich bin am Deutsch lernen","ich lerne gerade Deutsch","Die „am“-Verlaufsform ist umgangssprachlich, standardsprachlich „gerade + Verb“."],
    ["gehen wir in die Kino","gehen wir ins Kino","Es heißt „das Kino“ -> „in das Kino“ = „ins Kino“."],
    ["ich freue mich für das Geschenk","ich freue mich über das Geschenk","„sich freuen über“ (bereits geschehen), nicht „für“."],
    ["der Junge, der ich gesehen habe","der Junge, den ich gesehen habe","Akkusativ-Relativpronomen: „den“."],
    ["ich bin fertig mit meine Hausaufgaben","ich bin fertig mit meinen Hausaufgaben","Nach „mit“ steht der Dativ: „meinen Hausaufgaben“."],
    ["größer als wie erwartet","größer als erwartet","„als“ und „wie“ nicht kombinieren."],
    ["ich bin 20 Jahre alt geworden gestern","ich bin gestern 20 Jahre alt geworden","Zeitangabe steht meist früher im Satz."],
    ["sie hat geschwommt","sie ist geschwommen","Bewegungsverben wie „schwimmen“ bilden das Perfekt mit „sein“."],
    ["er hat gefahren","er ist gefahren","Bewegungsverben wie „fahren“ bilden das Perfekt mit „sein“."],
    ["ich habe gedacht das er kommt","ich habe gedacht, dass er kommt","Vor dem Nebensatz steht ein Komma und „dass“."],
    ["das Buch von die Frau","das Buch der Frau","Genitiv statt „von + Nominativ“."],
    ["ich bin interessiert von Musik","ich bin interessiert an Musik","Feste Präposition: „interessiert an“."],
    ["er wartet auf sie seit Stunden","er wartet seit Stunden auf sie","„seit“-Angabe steht meist vor dem Präpositionalobjekt."],
    ["ich habe Angst von Spinnen","ich habe Angst vor Spinnen","Feste Präposition: „Angst vor“."],
    ["sie ist verheiratet mit einem Mann seit 10 Jahre","sie ist seit 10 Jahren mit einem Mann verheiratet","„seit“ + Dativ, andere Satzstellung."],
    ["ich freue mich auf dich zu sehen","ich freue mich darauf, dich zu sehen","Verb + Präposition braucht ein Pronominaladverb (da(r)-)."],
    ["ich bin fertig meine Arbeit","ich bin fertig mit meiner Arbeit","„fertig sein mit“ + Dativ."],
    ["ich bin am Warten auf dich","ich warte auf dich","Die „am“-Verlaufsform ist umgangssprachlich; standardsprachlich reicht das Präsens."],
    ["er hat mir geholfen bei der Arbeit","er hat mir bei der Arbeit geholfen","Satzglieder stehen meist vor dem Partizip am Satzende."],
    ["das Wetter ist gut für Laufen","das Wetter ist gut zum Laufen","Feste Wendung „gut zum“ + Infinitiv-Nomen."],
    ["ich habe geschrieben ihm einen Brief","ich habe ihm einen Brief geschrieben","Dativobjekt vor Akkusativobjekt, Partizip ans Satzende."],
    ["sie ist gut in Mathe als er","sie ist besser in Mathe als er","Vergleich braucht den Komparativ „besser“, nicht „gut“ + „als“."],
    ["ich möchte, dass du gehst nicht","ich möchte, dass du nicht gehst","Im Nebensatz steht die Verneinung vor dem Verb am Satzende."],
    ["er hat drei Kinder, die sind alle klug","er hat drei Kinder, die alle klug sind","Im Relativsatz steht das Verb am Ende."],
    ["ich bin fertig zu essen","ich bin fertig mit dem Essen","Feste Wendung „fertig sein mit“."],
    ["sie hat Angst zu Hunde","sie hat Angst vor Hunden","Feste Präposition „Angst vor“ + Dativ Plural."],
    ["wir sind gefahren mit dem Auto nach Berlin","wir sind mit dem Auto nach Berlin gefahren","Das Partizip steht am Satzende."],
    ["er ist besser als ich in Fußball","er ist besser als ich im Fußball","„in“ + „dem“ verschmilzt vor Substantiven zu „im“."],
    ["ich bin süchtig von Kaffee","ich bin süchtig nach Kaffee","Feste Präposition „süchtig nach“."],
    ["sie wartet für den Bus","sie wartet auf den Bus","Feste Präposition „warten auf“."],
    ["ich denke über dich","ich denke an dich","Feste Präposition „denken an“."],
    ["er ist stolz von seiner Tochter","er ist stolz auf seine Tochter","Feste Präposition „stolz auf“."],
    ["ich interessiere mich für Musik seit Jahre","ich interessiere mich seit Jahren für Musik","„seit“ + Dativ Plural; Zeitangabe steht meist früher im Satz."],
    ["er hat Angst dass er verliert das Spiel","er hat Angst, dass er das Spiel verliert","Im dass-Satz steht das Verb am Ende."],
    ["wir haben viel Spaß gehabt in dem Urlaub","wir haben im Urlaub viel Spaß gehabt","„in dem“ verschmilzt zu „im“; Zeitangabe steht meist früher."],
    ["sie kümmert sich um ihre Kinder gut","sie kümmert sich gut um ihre Kinder","Das Adverb steht meist vor der Präpositionalphrase."],
    ["ich bin gewöhnt an das Wetter hier","ich bin an das Wetter hier gewöhnt","Das Partizip „gewöhnt“ steht am Satzende."],
  ];

  function bankHaeufigeFehler() {
    return Core.shuffle(HAEUFIGE_FEHLER).map(([wrong, correct, explain]) => {
      const opts = Core.shuffle([correct, wrong]);
      return {
        prompt: `Welche Form ist richtig?`,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain,
      };
    });
  }

  /* ---------------------------------------------------------
     11) ß ODER SS — richtige Schreibweise im Satzkontext
     --------------------------------------------------------- */
  const SS_ESZETT = [
    ["Wir laufen die ___ entlang.","Straße","Strasse","Nach langem Vokal (a) steht ß."],
    ["Er hat einen großen ___.","Fuß","Fuss","Nach langem Vokal (u) steht ß."],
    ["Das Haus ist sehr ___.","groß","gross","Nach langem Vokal (o) steht ß."],
    ["Wir hatten viel ___ im Urlaub.","Spaß","Spass","Nach langem Vokal (a) steht ß."],
    ["Sie schickt einen herzlichen ___.","Gruß","Gruss","Nach langem Vokal (u) steht ß."],
    ["Von ___ hört man Musik.","außen","aussen","Nach einem Diphthong (au) steht ß."],
    ["Es ist heute sehr ___.","heiß","heiss","Nach einem Diphthong (ei) steht ß."],
    ["Der Schnee ist ___.","weiß","weiss","Nach einem Diphthong (ei) steht ß."],
    ["Ein ___ Bier, bitte!","Maß","Mass","Nach langem Vokal (a) steht ß."],
    ["Das war ___ Zufall.","bloß","bloss","Nach langem Vokal (o) steht ß."],
    ["Ich habe kalte ___.","Füße","Fuße","Nach langem Vokal (ü) steht ß."],
    ["Herzliche ___ aus Berlin!","Grüße","Grüsse","Nach langem Vokal (ü) steht ß."],
    ["Pass auf, nicht an die Tür zu ___!","stoßen","stossen","Nach langem Vokal (o) steht ß."],
    ["Kannst du bitte das Fenster ___?","schließen","schliessen","Nach langem Vokal (ie) steht ß."],
    ["Die Kinder spielen ___ im Garten.","draußen","draussen","Nach einem Diphthong (au) steht ß."],
    ["Gib mir bitte nur ein ___.","bisschen","bißchen","Nach kurzem Vokal (i) steht ss — moderne Rechtschreibung."],
    ["Mir ist nicht ganz ___, was er meint.","bewusst","bewußt","Nach kurzem Vokal (u) steht ss — moderne Rechtschreibung."],
    ["Er gab ihr einen ___ auf die Wange.","Kuss","Kuß","Nach kurzem Vokal (u) steht ss."],
    ["Der ___ führt mitten durch die Stadt.","Fluss","Fluß","Nach kurzem Vokal (u) steht ss."],
    ["Ich hätte gern noch eine ___.","Nuss","Nuß","Nach kurzem Vokal (u) steht ss."],
    ["Damit ist die Diskussion zum ___ gekommen.","Schluss","Schluß","Nach kurzem Vokal (u) steht ss."],
    ["Der ___ dauerte drei Jahre.","Prozess","Prozeß","Nach kurzem Vokal (e) steht ss."],
    ["Wir ___ heute noch früh los.","müssen","müßen","Nach kurzem Vokal (ü) steht ss."],
    ["Wir ___ nicht genau, wann er kommt.","wissen","wißen","Nach kurzem Vokal (i) steht ss."],
    ["Ich habe das Datum leider ___.","vergessen","vergeßen","Nach kurzem Vokal (e) steht ss."],
  ];

  function bankSsEszett() {
    return Core.shuffle(SS_ESZETT).map(([sentence, correct, wrong, explain]) => {
      const opts = Core.shuffle([correct, wrong]);
      return {
        prompt: sentence,
        options: opts,
        correct: [opts.indexOf(correct)],
        explain,
      };
    });
  }

  /* ---------------------------------------------------------
     10) DEUTSCHLAND-QUIZ — Multiple Choice, teils 2 richtige
     --------------------------------------------------------- */
  const DEUTSCHLAND_QUIZ = [
    ["Wie heißt die Hauptstadt von Deutschland?",["Berlin","Bonn","München","Hamburg"],[0]],
    ["Wie viele Bundesländer hat Deutschland?",["13","16","20","9"],[1]],
    ["Wie heißt der bekannteste Fluss, der durch Köln fließt?",["Rhein","Elbe","Donau","Main"],[0]],
    ["In welchem Jahr fiel die Berliner Mauer?",["1985","1989","1991","1979"],[1]],
    ["Wie heißt das deutsche Parlament?",["Bundestag","Senat","Reichstag (heute)","Kongress"],[0]],
    ["Welche Stadt ist bekannt für das Oktoberfest?",["München","Stuttgart","Berlin","Köln"],[0]],
    ["Wer war der erste Bundeskanzler der BRD?",["Konrad Adenauer","Willy Brandt","Helmut Kohl","Ludwig Erhard"],[0]],
    ["In welchen Städten steht eine berühmte „Frauenkirche“?",["Dresden","Hamburg","München","Bremen"],[0,2]],
    ["Wie heißt der höchste Berg Deutschlands?",["Zugspitze","Watzmann","Brocken","Feldberg"],[0]],
    ["Welches Tier ist das Wappentier Deutschlands?",["Adler","Löwe","Bär","Hirsch"],[0]],
    ["Wie viele Einwohner hat Deutschland ungefähr?",["60 Millionen","83 Millionen","120 Millionen","40 Millionen"],[1]],
    ["Welche Farben hat die deutsche Flagge (von oben nach unten)?",["Schwarz-Rot-Gold","Rot-Gold-Schwarz","Gold-Schwarz-Rot","Schwarz-Gold-Rot"],[0]],
    ["In welcher Stadt steht der berühmte Kölner Dom?",["Köln","Aachen","Bonn","Düsseldorf"],[0]],
    ["Welches Bundesland ist flächenmäßig das größte?",["Bayern","Nordrhein-Westfalen","Niedersachsen","Hessen"],[0]],
    ["Welches Bundesland hat die meisten Einwohner?",["Nordrhein-Westfalen","Bayern","Berlin","Sachsen"],[0]],
    ["Wann wurde Deutschland wiedervereinigt?",["3. Oktober 1990","9. November 1989","17. Juni 1953","23. Mai 1949"],[0]],
    ["In welchen Städten liegen die zwei größten Flughäfen Deutschlands?",["Frankfurt","Köln","München","Bremen"],[0,2]],
    ["Woher stammt die Currywurst ursprünglich?",["Berlin","München","Hamburg","Stuttgart"],[0]],
    ["Wie heißt das berühmte deutsche Märchen-Autorenduo?",["Gebrüder Grimm","Gebrüder Mann","Gebrüder Humboldt","Gebrüder Schlegel"],[0]],
    ["In welcher Stadt wurde Johann Wolfgang von Goethe geboren?",["Frankfurt am Main","Weimar","Leipzig","Bonn"],[0]],
    ["In welcher Region liegt der Schwarzwald?",["Baden-Württemberg","Bayern","Sachsen","Hessen"],[0]],
    ["Wie heißt die deutsche Zentralbank?",["Bundesbank","Sparkasse","Reichsbank","Landesbank"],[0]],
    ["Was feiert man am 3. Oktober in Deutschland?",["Tag der Deutschen Einheit","Tag der Arbeit","Erntedankfest","Verfassungstag"],[0]],
    ["Welcher Verein ist deutscher Rekordmeister im Fußball?",["FC Bayern München","Borussia Dortmund","Schalke 04","Werder Bremen"],[0]],
    ["Welche ist die älteste Universität Deutschlands?",["Universität Heidelberg","LMU München","Uni Berlin","Uni Hamburg"],[0]],
    ["Wofür steht die Abkürzung TÜV?",["Technischer Überwachungsverein","Technische Union Verkehr","Technischer Umwelt-Verband","Transport- und Verkehrsunion"],[0]],
    ["In welchem Bundesland liegt Dresden?",["Sachsen","Sachsen-Anhalt","Thüringen","Brandenburg"],[0]],
    ["Welches Getränk ist durch das Reinheitsgebot geregelt?",["Bier","Wein","Schnaps","Kaffee"],[0]],
    ["Wer komponierte die „Ode an die Freude“?",["Ludwig van Beethoven","Johann Sebastian Bach","Wolfgang Amadeus Mozart","Johannes Brahms"],[0]],
    ["Welche Stadt war bis 1990 „Hauptstadt“ der BRD (vor Berlin)?",["Bonn","Frankfurt","Köln","Hamburg"],[0]],
    ["Welche Stadt ist für ihre Brezeln und das Cannstatter Volksfest bekannt?",["Stuttgart","Hamburg","Leipzig","Kiel"],[0]],
    ["Wie heißt einer der ältesten und bekanntesten Weihnachtsmärkte Deutschlands?",["Dresdner Striezelmarkt","Kölner Lichtermarkt","Hamburger Winterzauber","Frankfurter Wintertraum"],[0]],
    ["In welchem Meer liegt die deutsche Insel Helgoland?",["Nordsee","Ostsee","Mittelmeer","Bodensee"],[0]],
    ["Welche zwei Städte liegen direkt am Rhein?",["Köln","Leipzig","Düsseldorf","Dresden"],[0,2]],
    ["Welches Bauwerk hat den höchsten Kirchturm der Welt?",["Ulmer Münster","Kölner Dom","Frauenkirche Dresden","Berliner Dom"],[0]],
    ["Wie nennt man das deutsche Grundgesetz auch?",["Verfassung","Bundesgesetzbuch","Staatsvertrag","Länderordnung"],[0]],
    ["In welcher Stadt hat das Bundesverfassungsgericht seinen Sitz?",["Karlsruhe","Berlin","Leipzig","München"],[0]],
    ["Welches Bundesland grenzt an Frankreich und die Schweiz?",["Baden-Württemberg","Bayern","Saarland","Hessen"],[0]],
    ["Aus welcher Stadt stammt der Automobilhersteller Volkswagen?",["Wolfsburg","München","Stuttgart","Köln"],[0]],
    ["Welche Stadt gilt als heimliche deutsche Modehauptstadt?",["Düsseldorf","Dortmund","Bremen","Kiel"],[0]],
    ["Wie viele Sterne zeigt die EU-Flagge, die auch in Deutschland gehisst wird?",["12","15","10","27"],[0]],
    ["In welchem Jahr wurde der Euro in Deutschland als Bargeld eingeführt?",["2002","1999","2005","1998"],[0]],
    ["Welcher deutsche Physiker entwickelte die Relativitätstheorie?",["Albert Einstein","Max Planck","Werner Heisenberg","Wilhelm Röntgen"],[0]],
    ["Wie heißt die bekannte deutsche Zeichentrickserie über einen kleinen Wikingerjungen?",["Wickie","Heidi","Biene Maja","Käpt'n Blaubär"],[0]],
    ["Welche deutsche Stadt ist besonders für ihren Karneval berühmt?",["Köln","Leipzig","Kiel","Rostock"],[0]],
    ["Welches deutsche Brettspiel wurde international besonders erfolgreich?",["Die Siedler von Catan","Monopoly","Scrabble","Risiko"],[0]],
    ["In welchem deutschen Mittelgebirge liegt der Brocken?",["Harz","Schwarzwald","Erzgebirge","Alpen"],[0]],
    ["Welche Farben zeigt die Flagge der Hansestadt Hamburg überwiegend?",["Rot-Weiß","Blau-Gelb","Grün-Weiß","Schwarz-Gold"],[0]],
    ["Welcher Bundestrainer holte 2014 den WM-Titel für Deutschland?",["Joachim Löw","Jürgen Klinsmann","Rudi Völler","Berti Vogts"],[0]],
  ];

  function bankQuiz() {
    return Core.shuffle(DEUTSCHLAND_QUIZ).map(([prompt, options, correctIdx]) => {
      // Optionen mischen, aber korrekte Indizes mitverschieben
      const withIdx = options.map((o, i) => ({ o, correct: correctIdx.includes(i) }));
      const shuffled = Core.shuffle(withIdx);
      return {
        prompt,
        options: shuffled.map((x) => x.o),
        correct: shuffled.reduce((acc, x, i) => (x.correct ? [...acc, i] : acc), []),
        explain:
          correctIdx.length > 1
            ? `Richtig sind: ${correctIdx.map((i) => options[i]).join(" und ")}.`
            : `Richtig ist: ${options[correctIdx[0]]}.`,
        multi: correctIdx.length > 1,
      };
    });
  }

  /* ---------------------------------------------------------
     KATEGORIEN-REGISTER
     --------------------------------------------------------- */
  const CATEGORIES = [
    { id: "artikel", title: "Artikel (der/die/das)", icon: "🔤", group: "grammatik",
      info: "Jedes deutsche Substantiv hat ein Genus (der/die/das). Es gibt Tendenzen (z. B. Wörter auf -ung sind meist „die“), aber viele Ausnahmen — am besten mit dem Wort mitlernen.",
      getBank: bankArtikel },
    { id: "plural", title: "Singular & Plural", icon: "🔢", group: "grammatik",
      info: "Der Plural wird auf verschiedene Weisen gebildet (-e, -er, -en, -s, Umlaut …). Es gibt keine feste Regel — Übung hilft am meisten.",
      getBank: bankPlural },
    { id: "synonyme", title: "Alternative Wörter / Synonyme", icon: "🔁", group: "wortschatz",
      info: "Synonyme sind Wörter mit ähnlicher Bedeutung. Ein größerer Wortschatz macht deine Sprache abwechslungsreicher.",
      getBank: bankSynonyme },
    { id: "wenn-ob", title: "wenn / ob", icon: "❓", group: "logik",
      info: "„Wenn“ beschreibt eine Bedingung oder einen wiederkehrenden Zeitpunkt. „Ob“ leitet eine indirekte Frage ein (Unsicherheit).",
      getBank: bankWennOb },
    { id: "als-wie", title: "als / wie", icon: "⚖️", group: "logik",
      info: "„Als“ benutzt man beim Vergleich von Ungleichem (größer als), „wie“ bei Gleichheit (so groß wie).",
      getBank: bankAlsWie },
    { id: "kennen-wissen", title: "kennen / wissen", icon: "🧠", group: "logik",
      info: "„Kennen“ benutzt man für Personen, Orte oder Dinge, mit denen man vertraut ist. „Wissen“ benutzt man für Fakten und Informationen.",
      getBank: bankKennenWissen },
    { id: "das-dass", title: "das / dass", icon: "✍️", group: "logik",
      info: "„Das“ ist Artikel oder Pronomen (ersetzbar durch „dieses/welches“). „Dass“ ist eine Konjunktion, die einen Nebensatz einleitet.",
      getBank: bankDasDass },
    { id: "redewendungen", title: "Redewendungen", icon: "💬", group: "wortschatz",
      info: "Redewendungen sind feste Ausdrücke, deren Bedeutung man oft nicht wörtlich verstehen darf.",
      getBank: bankRedewendungen },
    { id: "haeufige-fehler", title: "Häufige Fehler", icon: "⚠️", group: "grammatik",
      info: "Typische Stolperfallen, die auch Muttersprachlern passieren — hier erkennst du die richtige Form.",
      getBank: bankHaeufigeFehler },
    { id: "ss-eszett", title: "ß oder ss", icon: "🔡", group: "grammatik",
      info: "Nach einem langen Vokal oder einem Diphthong (au, ei, eu …) steht ß. Nach einem kurzen Vokal steht ss.",
      getBank: bankSsEszett },
    { id: "quiz", title: "Deutschland-Quiz", icon: "🏆", group: "quiz",
      info: "Allgemeinwissen rund um Deutschland — im Stil von „Wer wird Millionär“. Manche Fragen haben zwei richtige Antworten für Bonuspunkte!",
      getBank: bankQuiz },
  ];

  function getCategory(id) {
    return CATEGORIES.find((c) => c.id === id);
  }

  // Rein deutsche Wort-Synonym-Paare fürs Memory-Spiel (kein Englisch)
  function getSynonymPairs() {
    return SYNONYME.map(([word, synonym]) => [word, synonym]);
  }

  return { CATEGORIES, getCategory, getSynonymPairs };
})();
