# Recraft, HelloTalk und die Frage nach der Profi-Qualität

**Xander (23.09.2026):** „… ob wir mit Recraft was anfangen können oder den
anderen Tools … und sag mir, ob wir Recraft verwenden können und wie wir die
Effekte von HelloTalk machen, wie wir so ne Qualität erreichen, wie die Profis
das machen."

Hier steht die Antwort, damit sie nicht in einem Chat verlorengeht. Sie ist so
knapp wie möglich und so ehrlich wie nötig: nichts davon ist ausprobiert
worden, es ist der Stand der Technik, keine Messung. Was gemessen ist, steht
in den Sonden.

---

## 1 · Recraft — ja, aber für die Vorlage, nicht für die Animation

**Was Recraft kann:** Bilder erzeugen, und zwar auch als **echtes SVG**
(Vektor, nicht Pixel). Genau das ist der Punkt, warum es hier überhaupt in
Frage kommt: das ganze Klassenzimmer ist aus SVG gebaut. Eine PNG-Datei aus
einem Bildgenerator kann man nicht beleuchten, nicht umfärben und nicht in
Gelenke zerlegen — ein SVG schon.

**Wie es hier hineinpasst:**

1. Recraft zeichnet die **Vorlage** (eine Hand, eine Lok, ein Hut) als SVG.
2. Die Vorlage wird von Hand **aufgeräumt**: Pfade zusammenfassen, Namen
   vergeben, Gelenke als eigene Gruppen anlegen — genau das, was die
   Riesenhand heute schon hat (`lc-rf-mcp`, `lc-rf-pip`, `lc-rf-dip`).
3. **Animiert wird weiter hier**, im Code. Kein Generator weiß, wann eine
   Hand zugreift.

**Was dagegen spricht:** Recraft ist kostenpflichtig, und was von dort kommt,
ist beim ersten Wurf selten anatomisch richtig — die Fehler, die Xander an den
Händen gesehen hat (Module statt durchgehender Finger), macht ein Generator
genauso. Der Gewinn liegt in der FORM, nicht in der Korrektheit.

**Regel für den Schlüssel:** falls wir ihn nutzen, nie in eine Datei im
Projekt, sondern nur in der Umgebung:

    export RECRAFT_API_KEY=…

## 2 · Wie HelloTalk (und TikTok, und Duolingo) ihre Effekte machen

Es ist kein Geheimnis und keine Zauberei — es sind drei Dinge:

**a) Lottie.** Die Animation wird in **After Effects** von einem Menschen
gezeichnet und mit *Bodymovin* als **JSON** exportiert. Im Browser spielt
`lottie-web` sie ab. Das JSON enthält Vektorpfade und Zeitkurven, ist also
klein, scharf auf jedem Bildschirm und läuft überall gleich. So sehen alle
großen Apps aus.

**b) Echte Zeitkurven statt gleichmäßiger Bewegung.** Nichts in der Natur
bewegt sich linear. Profis arbeiten mit *Anticipation* (kurz zurück, bevor es
losgeht), *Overshoot* (über das Ziel hinaus und zurück) und *Settle*
(auspendeln). Das ist genau das, was der Cowboyhut seit Runde 97 tut, und
was die Riesenhand in ihren sieben Stationen tut.

**c) Eine Bibliothek statt Einzelstücke.** Eine Haut, ein Schattenwinkel, eine
Kantenstärke — für ALLE Zeichnungen. Genau das ist in dieser Runde passiert
(`--lc-haut` in `korrekturen.css`, `lcHaut()` in `app.js`).

**Was das für uns heißt:**

| Weg | Was er kostet | Was er bringt |
|-----|---------------|---------------|
| **Weitermachen wie bisher** (SVG + CSS/WAAPI von Hand) | Zeit pro Effekt, dafür kein fremder Code | Volle Kontrolle, alles messbar durch die Sonden, keine zusätzliche Ladezeit |
| **Lottie dazunehmen** (`lottie-web`, rund 250 KB) | Eine fremde Bibliothek; die Animationen müssen jemand in After Effects zeichnen (oder eingekauft werden) | Genau die Qualität, die er bei HelloTalk sieht — aber nur für fertige Clips, nicht für Effekte, die auf ein Profilbild reagieren |
| **Recraft für Vorlagen** | Schlüssel + Geld | Bessere Formen als Ausgangspunkt, Arbeit bleibt |

**Die ehrliche Einschätzung:** Für alles, was MIT dem Profilbild rechnet — die
Hand, die es greift; die Lok, die es transportiert; der Lack, der darauf
liegen bleibt — ist Lottie der falsche Weg: ein Lottie-Clip weiß nichts von
dem Bild, das er anfassen soll. Für alles, was nur SCHÖN sein muss und immer
gleich abläuft (Konfetti, ein Feuerwerk, ein Geschenkband, ein Begrüßungs-
banner), ist Lottie der kürzere und bessere Weg.

**Vorschlag, wenn er ihn will:** wir nehmen EINEN solchen Effekt (zum Beispiel
das große Geschenk) als Versuch, bauen ihn mit Lottie und vergleichen ihn
nebeneinander mit dem heutigen. Erst danach entscheiden — nicht vorher.
