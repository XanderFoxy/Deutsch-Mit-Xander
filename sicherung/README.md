# Sicherungskopien

Hier liegen unveränderte Kopien der Dateien, BEVOR eine Änderung an ihnen
gemacht wurde. Der Ordnername sagt, wann gesichert wurde und welche
Programmfassung (`window.DMA_VERSION` in `index.html`) darin steckt.

## Wenn etwas kaputt ist — so kommt der alte Stand zurück

Eine einzelne Datei zurückholen: die Datei aus dem Sicherungsordner
in den Hauptordner kopieren und die dortige überschreiben. Beispiel:

    cp sicherung/2026-09-16-v175/app.js app.js

Alle gesicherten Dateien auf einmal:

    cp sicherung/2026-09-16-v175/*.js  .
    cp sicherung/2026-09-16-v175/index.html  .

Danach die Seite einmal neu laden (Strg+F5 bzw. Cmd+Shift+R), damit der
Browser die alten Dateien wirklich holt und nicht die gemerkten neuen.

## Was liegt wo

### 2026-09-16-v175 — vor dem Umbau „Aussprache-Kreisel + Live-Chat"

| Datei                    | Was daran geändert wurde                                    |
|--------------------------|-------------------------------------------------------------|
| `app.js`                 | Aussprache-Trainer: Kreiselanzeige, automatischer Ablauf, Laut-Pellets nur noch auf Wunsch. Neuer Bereich Live-Chat. |
| `aussprache-pruefung.js` | Azure-Antwort wird jetzt in beiden Schreibweisen gelesen (das war der Grund für „0 %"). Aufnahme erkennt Sprechpausen selbst. |
| `klassenzimmer.js`       | unverändert gelassen — der Jitsi-Raum bleibt als zweiter Weg bestehen. |
| `index.html`             | neue Dateien eingebunden, neuer Unterpunkt „Live-Chat", Fassung 176. |

Neu hinzugekommen (hatten vorher keinen alten Stand, darum keine Kopie):
`aussprache-kreisel.js`, `aussprache-kreisel.css`, `livechat.js`, `livechat.css`.
