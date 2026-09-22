# DIE REGELN FÜR JEDE ANIMATION

Xander, wörtlich:

> „Ich habe dir gesagt, dass du dir eine Regel machen sollst für sämtliche
> Animationen, die du in der Zukunft anstellst, dass nichts von den Dingen,
> die wir schon adressiert haben, jemals wieder auftaucht bei einer
> Bearbeitung in einer Animation, es sei denn, ich will es so wie bei den
> Maulwurfhügeln."

> „Überprüfe bitte sämtliche Glitches beim Verlassen eines Platzes in jeder
> Animation und mach selbstständig bei jeder Animation die Prüfung, dass
> diese Glitches dort nicht sind — niemals, auch bei neuen Animationen, die
> du machst."

Das hier ist diese Regel. Sie steht nicht nur als Text da: zu jeder Zeile
gehört eine Sonde, die sie misst. Wer eine neue Animation baut, lässt die
Sonden laufen, bevor er hochlädt.

---

## 1. Das Schild bleibt, wo es ist

Die gestrichelte Linie und die Positionsnummer eines Platzes sind **Design
des Platzes, nicht Teil der Animation**. Sie dürfen sich während einer
Animation nicht verschieben, nicht wachsen, nicht schrumpfen, nicht blasser
werden und nicht verschwinden — weder am Zielplatz noch am verlassenen.

> „Die Striche und Positionsnummer soll immer von jeglicher Animation
> ausbleiben."

**Sonde:** `werkzeug/pruefe-runde87-strichlinien.js`
Sie geht über **alle** Platz-Wirkungen und **alle** Reisen, misst **beide**
Plätze — den verlassenen und den angesteuerten — und zwar bei 260, 900,
1700, 2600, 3600, 5000 und 7000 ms, also **bis zum Ende jeder Animation
einschließlich des Aufräumens**.

### Die drei erlaubten Ausnahmen — und nur diese

| Ausnahme | Was erlaubt ist | Sein Wort dazu |
|---|---|---|
| Während einer Reise | Der **Name** unter dem verlassenen Platz darf verschwinden. Schild und Nummer nie. | „mein Platz, der verlassen wird, trägt noch meinen Namen — der soll natürlich auch nicht mehr da stehen" |
| Pac-Man | Die **Nummer** darf unsichtbar werden (nicht verschoben, nicht blasser, nicht ausgebaut). | „in dem Moment braucht man auch keine Zahlen zu sehen, damit das wie das klassische Spiel aussieht" |
| Maulwurf | Schild, Nummer und Platz dürfen aufgebrochen werden und umkippen — **aber am Ende steht alles wieder da, wo es stand**. | „dort sollen die Plätze richtig aufgebrochen werden … dass da wirklich das mit sich umkippt realistisch" |

Eine neue Ausnahme gibt es nur, wenn er sie **ausdrücklich nennt**. Dann
kommt sie mit seinem Zitat in die Sonde — nicht ohne.

## 2. Wer wegreist, reist in voller Größe weg

Beim **Start** des Verlassens darf das Profilbild nicht kleiner werden.

> „nicht, dass beim Verlassen des Platzes das Profilbild kleiner wird oder in
> irgendeiner Art und Weise beeinträchtigt wird."

Gemessen wird die **erste** Probe am **verlassenen** Platz (nicht am Ziel —
dort steht das Bild ohnehin still). Ausnahme: Wirkungen, bei denen das Bild
selbst der Ball ist (Tennis, Katapult) — dort ist das Kleinerwerden
Perspektive und kein Fehler; solche Wirkungen sind keine Reisen.

## 3. Keine Rückstände

Nach dem Ende einer Animation ist **nichts** mehr übrig: kein Element im
Platz, keine Klasse am Platz, keine `transform` auf Kreis, Schild oder Name.

> „Außerdem sind die Rückstände noch in der Strichlinie zu sehen und der
> Zahl — so was soll generell bei Animationen vermieden werden."

Die 7000-ms-Probe der Strichlinien-Sonde ist genau dafür da: Sie misst
**nach** dem Aufräumen.

## 4. Jede Animation hat drei Türen

Ein Effekt braucht **drei** Einträge, sonst ist er von irgendwo aus nicht
erreichbar:

1. `LC_EFFEKTE` in `app.js`,
2. eine Kachel in der passenden Tabelle in `livechat.js`,
3. eine Zeile in `BEFEHLE`.

Wirkungen, deren Tür in keiner Tabelle steht, müssen in
`LiveChat.effektBefehle()` mit `w.push("…")` angemeldet werden.

**Sonden:** `werkzeug/pruefe-effekttueren.js`, `werkzeug/pruefe-jeder-befehl.js`

## 5. Jeder Ton, den der Plan nennt, muss klingen

Jeder Name aus `LC_TON_PLAN` und aus jedem `lcTonSpaeter(...)` braucht eine
Datei in `ton/` — als `.opus` **und** `.m4a` — und muss in
`data-geraeusche.js` stehen. Was dort nicht steht, sucht der Browser gar
nicht erst.

**Sonde:** `werkzeug/pruefe-tonliste.js`

## 6. Kein Ton wird abgeschnitten

Die Animation ist so lang wie der Ton, nicht kürzer.

> „das YIHAAH Geräusch von Cowboy ist immer noch abgeschnitten … Du musst
> nicht jede Animation extrem kurz machen."

## 7. Panels gehen mit einem Tipp ins Leere zu

Kein Schließen-Knopf im Rahmen. Ein Tipp auf beschrifteten, nicht
bedienbaren Platz **innerhalb** des Panels schließt es, ohne den Hintergrund
zu beeinflussen. Ein Rollen der Seite schließt **nicht**.

> „Ich möchte das intuitiv wie bei Apple … Das bei allen aufklappbaren
> Panels."

**Sonde:** `werkzeug/pruefe-runde88-panels.js`

## 8. Jedes Feld, das ein Effekt liest, muss auch ankommen

In `livechat.js` entscheidet **eine** Liste — `ZUSATZ_FELDER` —, welche
Zusatzfelder eine Chatzeile behält. `anAlle()` schickt zwar alles über die
Leitung, aber `zusatzUebernehmen()` lässt nur durch, was in dieser Liste
steht — auf dem eigenen Gerät genauso wie beim Empfänger. Was fehlt, fällt
still weg, und der Effekt bekommt einen leeren Wert.

So war „ich kann mich immer noch nicht anziehen" kein Zeichenfehler,
sondern ein fehlendes `stueck`.

**Sonde:** `werkzeug/pruefe-zusatzfelder.js` — sie liest aus `app.js` jedes
`nachricht.<feld>` heraus und vergleicht es mit der Liste.

## 9. Keine Abzweigung hinter ihrer Tabelle

`befehlAusfuehren()` hat grosse Tabellen (`AM_PLATZ`, `AUCH_AM_PLATZ`,
`WETTER`), die ein Wort mit einem Standardsatz erledigen. Ein Spezialfall
für dasselbe Wort muss **davor** stehen, sonst kommt er nie dran — und von
aussen sieht man nur, dass der Befehl etwas Falsches tut.

So waren `/kopfhoerer Name Lied` (470 Zeilen zu spät) und
`/ballonpumpe Name helium` (380 Zeilen zu spät) monatelang unerreichbar.

**Sonde:** `werkzeug/pruefe-befehlsreihenfolge.js`

---

## Vor jedem Hochladen

```
bash werkzeug/alle-pruefen.sh
```

Die langen Sonden haben dort ihre eigene Frist (siehe `case "$n"` in
`alle-pruefen.sh`) — die Strichlinien-Sonde braucht rund eine Viertelstunde,
weil sie 122 Effekte einzeln bis zum Ende misst. Wer eine neue lange Sonde
schreibt, trägt sie dort ein.
