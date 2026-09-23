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

## 10. Eine Sonde misst die Sache, nicht den Wortlaut

Drei Sonden standen in Runde 89 auf ROT, obwohl im Klassenzimmer alles
richtig lief. Sie suchten im Quelltext nach einem *Wortlaut*:

* `pruefe-runde22` verlangte `if (art === "musik") {` **direkt gefolgt von**
  `lcMusikSpielen` — dazwischen stand seit Runde 88 die Begruendung als
  Kommentar.
* `pruefe-runde23` verlangte `if (einer) { lcAusschnittWahl(...); return; }` —
  seit Runde 88 geht **jede** Liedwahl durch diese Frage, auch die fuer den
  ganzen Raum, also ohne `if (einer)`.
* `pruefe-runde85b` verlangte **genau zwei** Eingabefelder — seit Runde 88
  steht daneben das Namensfeld, aus dem ein eigener Abschnitts-Knopf wird.

In allen drei Faellen war der Wunsch erfuellt und die *Regel* veraltet.
Eine rote Sonde, die nichts meldet, was kaputt ist, macht die naechste rote
Sonde wertlos — dann schaut niemand mehr hin.

**Also:** eine Sonde prueft, was der Benutzer merkt (was am Platz steht, was
hinausgeht, was zu hoeren ist). Muss sie doch in den Quelltext schauen, dann
so weit gefasst, dass ein Kommentar oder eine umgestellte Zeile sie nicht
umwirft. Und wenn ein spaeterer Wunsch die Regel ueberholt, wird die **Regel
nachgezogen** — mit dem neuen Zitat als Begruendung im Kopf der Sonde, nicht
mit einem stillen Loeschen.

**Sonden:** `werkzeug/pruefe-runde22.js`, `pruefe-runde23.js`,
`pruefe-runde85b.js` — jede traegt den Grund der Nachbesserung im Kommentar.

## 11. Zwei Varianten heissen zwei messbare Varianten

Der Luftballon ist das Beispiel: „da sollen auch zwei Animationen sein, ein,
dass man ihn aufblasen kann, bis er platzt, und ein, dass man ihn einfach nur
aufblasen kann wie ein Helium Luftballon und er fliegt dann von der Buehne
hoch und oder fliegt halt zur Seite weg" (21.09.2026, 19:31 Uhr).

Dass beide *Befehle* existieren, sagt noch nichts darueber, ob man sie
auseinanderhalten kann. Gemessen wird deshalb der Unterschied selbst:
das Platzen an den Fetzen und am Knall, das Helium am Steigen (ueber 150 px
ueber den eigenen Platz), am seitlichen Abtreiben und daran, dass **keine**
Luft entweicht.

**Sonde:** `werkzeug/pruefe-runde89-ballon.js`

## 12. Ein Aufschlagton muss sofort knallen

XANDER: „Man hoert das Ei auch vorher, bevor man es aufschlaegt … der
Katapult, den hoert man auch schon vorher, den Bumerang hoert man auch schon
vorher — nicht in dem Moment, wo die Animation aufschlaegt oder trifft."

Dafuer gibt es **zwei** Ursachen, und nur eine steht im Quelltext:

1. Der Ton wird zur falschen Millisekunde eingeplant — das ist eine Zahl in
   `app.js`.
2. Die **Datei** hat einen stummen Vorlauf. Dann ist „bei 860 ms" in
   Wirklichkeit 940 ms, und keine Zahl im Programm stimmt mehr.

Gefunden wurde so `ton/aufsetzen.opus` (der Ton, mit dem die Riesenhand und
die Gorillapranke jemanden absetzen): die ersten 62 ms waren praktisch still,
der Schlag kam erst bei 80 ms. Jetzt: 16 ms. Die Datei ist dieselbe, nur
vorne gekappt (`werkzeug/ton-vorlauf-kappen.sh`, jetzt mit setzbarer Grenze:
`GRENZE=0.05 bash werkzeug/ton-vorlauf-kappen.sh`).

**Sonde:** `werkzeug/pruefe-runde90-aufschlagtoene.js` — sie liest die
Ankunftstoene aus `LC_ANKUNFT_TON` und misst an der Wellenform, dass der
laute Teil innerhalb von 60 ms kommt.

**Werkzeug:** `node werkzeug/ton-zeitpunkte.js [wort]` rechnet fuer jede
Einplanung *geplant + Vorlauf = wirklich zu hoeren*. Damit ist eine Meldung
„der Ton kommt zu frueh/zu spaet" in einer Minute nachgemessen statt geraten.
So steht jetzt auch am Peitschenknall im Cowboyhut, dass seine 600 ms in
Wirklichkeit 1002 ms sind — die Zahl stimmt, sie bedeutet nur etwas anderes,
als sie aussieht.
Und `werkzeug/pruefe-runde90-bumerangton.js` misst dasselbe von der anderen
Seite: dass das Sausen **verklungen** ist, wenn es klopft.

---

## 13 · Eine Haut. Eine Quelle. Fuer alle Haende.

**Xander (23.09.2026):** „Du hast die Hand noch nicht vereinheitlicht."

Es gab zwei Hautfamilien im Haus: `#e9bda6` (Ohrfeige, Basketball,
Streicheln, Brueste) und `#eec0a8` (Riesenhand, Klaps, Popo), dazu die
Hut-Hand mit einer dritten, oraengeren Haut. Nebeneinander sieht das aus wie
drei verschiedene Leute.

**Regel:** Kein Hautton steht mehr als fester Wert in einer Zeichnung. Er
kommt aus **einer** Quelle:

```css
:root {
  --lc-haut: #eec0a8;          /* die Flaeche */
  --lc-haut-hell: #f3cbb6;     /* das Licht darauf */
  --lc-haut-kante: #bf9280;    /* die Umrisslinie */
  --lc-haut-schatten: #c99a84; /* Falten und Sehnen */
  --lc-haut-tief: #d9a68c;     /* der Rand eines Verlaufs */
}
```

Im Programm liest `lcHaut()` diese Werte **einmal** aus und gibt sie an jede
Zeichnung weiter. Warum nicht `fill="var(--lc-haut)"` direkt ins Bild? Weil
eine Zeichnung, die als Bilddatei irgendwo landet, von diesen Werten nichts
weiss — aus `lcHaut()` kommt immer eine fertige Farbe.

**Sonde:** `werkzeug/pruefe-runde97-haende.js` holt alle sechs Haende
gleichzeitig auf die Buehne und prueft jede Flaeche, jede Kante und jeden
Verlaufshalt gegen genau diese fuenf Werte.

## 14 · Ein Finger ist kein Stapel Module

**Xander:** „ohne dass sie nach einer Roboter Hand aussieht, ohne dass sie
nach einer Hand bestehend aus einzelnen Modulen aussieht. Eine durchgaengige
Hand mit Fingern."

Jedes Fingerglied war eine geschlossene Kapsel **mit Umrisslinie ringsherum**.
An jedem Gelenk lagen damit zwei Linien uebereinander — das ist der Ring, an
dem das Auge einen Roboter erkennt.

**Regel fuer jedes gegliederte Koerperteil:**

1. Jedes Glied reicht nach oben **unter** das vorige (rund ein halbes Glied).
   Dann klafft beim Beugen keine Luecke.
2. Die Kante wird **nur aussen** gezogen: eine Seite, die Kuppe, die andere
   Seite. Oben, wo das Glied unter dem Nachbarn verschwindet, **keine Linie**.
3. Dass dort ein Gelenk ist, sagen die **Falten**, nicht ein Umriss.

Gemessen wird das in derselben Sonde: kein Pfad eines Fingergliedes darf
Fuellung UND Kante tragen, und jedes Glied muss ueber seinem Drehpunkt
beginnen.

## 15 · Ein Fahrzeug muss auf sein Gleis passen

**Xander:** „Die Lokomotive hat immer noch keine Schienenfuehrung."

Die Gleise waren da und stimmten — die Lok passte nur nicht dazu. Zwei
Zahlen, beide nachgemessen:

* **Spurweite:** das Gleis war 0,34 Platzbreiten breit, die Radkanten der Lok
  standen 0,72 auseinander. Die Raeder liefen also neben den Schienen.
* **Laenge:** die Lok war 1,77 Platzbreiten lang, ihr Kurvenradius eine halbe.
  Sie war laenger als der ganze Kurvendurchmesser und konnte der Kurve
  geometrisch gar nicht folgen.

**Regel:** Wer ein Fahrzeug auf einen gezeichneten Weg setzt, prueft zwei
Verhaeltnisse — *Radstand zu Spurweite* und *Fahrzeuglaenge zu Kurvenradius*.
Beides steht in `werkzeug/pruefe-runde97-lok.js` und wird am laufenden Bild
gemessen, nicht am Quelltext.

---

## Vor jedem Hochladen

```
bash werkzeug/alle-pruefen.sh
```

Die langen Sonden haben dort ihre eigene Frist (siehe `case "$n"` in
`alle-pruefen.sh`) — die Strichlinien-Sonde braucht rund eine Viertelstunde,
weil sie 122 Effekte einzeln bis zum Ende misst. Wer eine neue lange Sonde
schreibt, trägt sie dort ein.
