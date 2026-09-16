/* =========================================================
   DIE WERKSTATT — was gerade gebaut wird
   ---------------------------------------------------------
   GEWÜNSCHT: „Irgendwie möchte ich eine kurze Info haben, an was
   du gerade arbeitest, dass ich das auf der Webseite sehen kann,
   dass ich weiß, wie weit du bist — aber ich will das nicht
   dauerhaft im Newsticker haben. Vielleicht eher so ein
   Zeitlimit, dass es wieder verschwindet."

   Darum diese Datei und nicht der Ticker: der Ticker läuft
   endlos und gehört den Lernenden. Hier steht etwas, das von
   selbst wieder geht.

   SO WIRD SIE GEPFLEGT
   Oben „inArbeit" — woran gerade gebaut wird. Diese Zeilen
   verschwinden, sobald die Sache fertig ist und nach unten
   wandert.
   Unten „fertig" — was neu ist, mit Datum. Jede Zeile
   verschwindet von selbst, wenn sie älter als „tage" ist
   (Standard 14). Kein Aufräumen von Hand, kein Zettel, der
   ein halbes Jahr hängen bleibt.

   WER SIEHT WAS
   „nurBetreiber: true" heisst: nur der Betreiber sieht die
   Zeile. Damit lässt sich etwas ankündigen, das die Lernenden
   noch nicht sehen sollen.
   ========================================================= */
window.DMA_WERKSTATT = {
  /* Wie lange eine fertige Meldung stehen bleibt, in Tagen. */
  tage: 14,

  inArbeit: [
    { text: "Die Menschen in der Bilderwelt werden überarbeitet — Körperbau, Haltung und die Stellen, an denen Figuren neben statt in den Möbeln sitzen.", nurBetreiber: false },
    { text: "Der Hund, der Welpe und der Tyrannosaurus bekommen wieder mehr Form und Schattierung.", nurBetreiber: false },
    { text: "Im Aussprache-Trainer werden „noch einmal sprechen“ und „nebeneinander anhören“ sauber getrennt.", nurBetreiber: false },
    { text: "Blockierte Stellen in den Szenen: Dinge, die hinter einem Regalbrett liegen und sich nicht antippen lassen.", nurBetreiber: false },
    { text: "Die Wolken im Kopf der Seite: weicher, mit mehr Struktur — und ohne den Sprung beim Laden.", nurBetreiber: false },
    { text: "Bilder im Klassenzimmer-Chat verschicken, und Platzhalter-Bilder für alle ohne Kamera.", nurBetreiber: false },
    { text: "Das Wörterbuch mit eigener Stimme über ElevenLabs, Niveau für Niveau ab A1.", nurBetreiber: true },
  ],

  fertig: [
    { datum: "2026-09-17", text: "🖼️ Die Geschlechtsteile werden jetzt auf den ORIGINALZEICHNUNGEN beschriftet — den detailreichen aus dem Übersichtsbild, nicht auf vereinfachten Nachbauten." },
    { datum: "2026-09-17", text: "🔊 Die neuronale Stimme liest jetzt auch in der Bilderwelt vor, nicht nur im Aussprache-Trainer. Geholtes bleibt für die Sitzung im Speicher." },
    { datum: "2026-09-17", text: "🗣️ „Der Schwanz“ und „die Muschi“ stehen jetzt da, wo man sie erwartet — mit der Angabe, wie derb sie sind und wo man sie besser nicht sagt." },
    { datum: "2026-09-17", text: "🎓 Das Klassenzimmer hat einen Hauptraum: einmal tippen, und du bist drin — kein Link nötig. Wer gerade da ist, siehst du sofort." },
    { datum: "2026-09-17", text: "🟢 Solange du im Klassenzimmer bist, bleibt unten ein Streifen sichtbar. Ein Tipp darauf bringt dich zurück — du kannst also in Ruhe weiterblättern." },
    { datum: "2026-09-17", text: "★ Gemerkte Wörter landen jetzt richtig in „Mein Wortschatz“. Bisher wurde die Alltagsform gespeichert („der Kitzler“ statt „die Klitoris“), und die Spiele fanden sie deshalb nie wieder." },
    { datum: "2026-09-17", text: "🪨 Bei „Fuchs am Fluss“ sehen die Steine auf schmalen Telefonen wieder wie Steine aus statt wie flache Ellipsen." },
    { datum: "2026-09-17", text: "🎤 Der Aussprache-Trainer legt keine falschen Wörter mehr vor. 1.102 Einträge waren Fehlerformen aus Übungen („Baad“, „Blumesstopf“), 27 waren gar keine deutschen Wörter („die Kriteriene“). Beide sind aus dem Üben heraus." },
    { datum: "2026-09-17", text: "🔊 Ein Ton sagt jetzt, wann du sprechen sollst — und einer, wann die Aufnahme zu Ende ist." },
    { datum: "2026-09-17", text: "🌸 Die Geschlechtsteile sind bis ins Einzelne benannt und anwählbar, außen wie innen — zu finden im Bild „Die Geschlechtsorgane“." },
    { datum: "2026-09-17", text: "🗣️ „Die Muschi“ hing fälschlich am Kanal im Inneren. Jetzt steht sie bei der Vulva, und bei der Scheide steht der Unterschied." },
    { datum: "2026-09-16", text: "🎯 Die Aussprachenote steht in einem Kreisel wie bei Rosetta Stone, und die Runde läuft von selbst weiter — vorsprechen, nachsprechen, weiter, ohne Knopfdruck." },
    { datum: "2026-09-16", text: "💬 Der Live-Chat mit acht runden Plätzen ist da — Gesichter zum Anklicken und ein Chat zum Schreiben." },
  ],
};
