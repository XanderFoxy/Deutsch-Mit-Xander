# Grok Imagine selbst ansteuern — was du dafür brauchst

Recherchiert am 19. September 2026 auf den Seiten von xAI selbst.
Preise und Modellnamen ändern sich; im Zweifel dort nachsehen.

## Kurz

Ja, Grok Imagine hat eine echte Programmierschnittstelle. Der Schlüssel
kommt **nicht** aus der Grok-App und **nicht** aus deinem 89-€-Abo —
das ist die App-Nutzung. Die Schnittstelle wird getrennt abgerechnet.

## Wo du den Schlüssel bekommst

1. **console.x.ai** öffnen und mit demselben Konto anmelden, mit dem du
   Grok benutzt.
2. Ein Team anlegen, falls noch keines da ist, und unter **Billing**
   ein Guthaben einzahlen. Ohne Guthaben gibt die Schnittstelle nur
   Fehler zurück, auch wenn das App-Abo läuft.
3. Unter **API Keys** einen neuen Schlüssel erzeugen. Er wird **genau
   einmal** angezeigt.

## Was er kostet

Abgerechnet wird nach Sekunden erzeugtem Video:

| Auflösung | Preis je Sekunde | 15 Sekunden |
|---|---|---|
| 480p | rund 0,05 $ | rund 0,75 $ |
| 720p | rund 0,07 $ | rund 1,05 $ |

Der Ton ist im Preis enthalten. Ein Bild als Vorlage kostet zusätzlich
rund 0,002 $.

## Wie ein Aufruf aussieht

```bash
curl -X POST https://api.x.ai/v1/videos/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-imagine-video-1.5",
    "prompt": "…",
    "duration": 10,
    "aspect_ratio": "9:16",
    "resolution": "720p"
  }'
```

Die Antwort enthält eine `request_id`; den Stand holt man unter
`https://api.x.ai/v1/videos/<request_id>` ab, bis dort `done` steht.

## WICHTIG: der Schlüssel gehört nicht hierher

* **Nicht in dieses Verzeichnis, nicht in eine Datei, nicht in den
  Chat.** Ein Schlüssel, der einmal in einem öffentlichen Repository
  stand, gilt als verbrannt — auch wenn man ihn wieder löscht, steht er
  in der Versionsgeschichte.
* Der richtige Weg: als Umgebungsvariable in der Sitzung, in der er
  gebraucht wird:
  ```
  export XAI_API_KEY=…
  ```
* Ist einer versehentlich irgendwo gelandet: in console.x.ai
  widerrufen und einen neuen erzeugen. Das dauert eine Minute.

## Was sich damit ändert

Mit gesetztem `XAI_API_KEY` lässt sich ein neuer Film in einem Zug
erzeugen und freistellen, ohne Umweg über die App. Der feste
Prompt-Schluss aus `LIESMICH.md` bleibt derselbe — er ist es, der den
Look über alle Geschenke gleich hält, und die Regel „kein Boden, ein
flächiges Grün" entscheidet über alles Weitere.

720p ist nicht nötig: die Filme werden hier ohnehin auf 400 Punkte
Breite heruntergerechnet. **480p reicht, ist billiger und spart einen
Rechenschritt.**
