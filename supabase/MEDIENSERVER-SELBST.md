# Können wir den Medienserver selbst nachbauen?

> „Kannst du eigentlich diese Medienserver-Sache simulieren, ohne dass wir
> diesen Dienst brauchen — also praktisch das nachbauen, was die da
> anbieten, diesen eigenen Server innerhalb von GitHub oder so? Ich
> möchte wissen, ob wir davon unabhängig sein können, was Geld kostet."

Kurz: **Die Software ja, den laufenden Rechner nein — und in GitHub gar
nicht.** Aber du brauchst für das, was du wirklich machst, wahrscheinlich
überhaupt keinen.

---

## 1. Warum es in GitHub nicht geht

Das ist keine Bequemlichkeit, sondern ein Unterschied in der Art der Sache.

**GitHub Pages liefert Dateien aus.** Es bekommt eine Anfrage, sucht eine
Datei, schickt sie zurück, fertig. Es führt nichts aus und es hält nichts
offen. Unsere ganze Seite ist genau deshalb dort zu Hause: `app.js`,
`livechat.js`, die Bilder — alles Dateien.

**Ein Medienserver ist ein laufendes Programm.** Er hat eine feste Adresse,
an der ununterbrochen Video und Ton ankommen, und er schiebt beides in
Echtzeit an alle weiter, die zuhören. Er läuft, auch wenn gerade niemand
etwas anfragt. Das kann ein Dateiablieferer nicht — es ist nicht dieselbe
Art von Ding.

**GitHub Actions ist auch keins.** Die Rechner dort starten für einen
Auftrag, machen ihn, und verschwinden. Sie haben keine feste Adresse, unter
der ein Browser sie erreichen könnte, und ein Dauerdienst darauf ist
ausdrücklich nicht erlaubt.

**Supabase auch nicht.** Der Realtime-Kanal, über den unser Chat läuft,
trägt kleine Textnachrichten. Video geht da nicht durch; dafür ist er nicht
gebaut.

---

## 2. Die Software ist frei — der Rechner nicht

Das Programm, das so eine Vermittlung macht, gibt es mehrfach umsonst und
quelloffen: **mediasoup**, **LiveKit**, **Janus**, **Galène**, **ion-sfu**.
Da zahlt niemand etwas.

Was kostet, ist der Rechner, auf dem es läuft, und die Datenmenge, die
durch ihn geht. Zwei Wege, ohne monatliche Rechnung an eine Firma wie
Cloudflare:

- **Ein kleiner eigener Server.** Bei den üblichen Anbietern ein paar Euro
  im Monat, mit reichlich Datenvolumen inklusive. Dafür musst du ihn
  einrichten und gelegentlich aktualisieren.
- **Ein dauerhaft kostenloses Kontingent.** Manche Anbieter haben so etwas
  (Oracle Cloud ist das bekannteste Beispiel). Das wäre wirklich 0 Euro,
  ist aber an deren Bedingungen gebunden, und die ändern sich.

> **Was ich hier nicht prüfen konnte:** die aktuellen Preise und
> Bedingungen. `developers.cloudflare.com` und die Preisseiten sind aus
> meiner Arbeitsumgebung gesperrt. Was oben über Kosten steht, ist
> Größenordnung aus Erfahrung, kein nachgelesener Preis. Bevor du dich
> festlegst, schau bitte selbst auf die Seite des Anbieters.

Wenn du diesen Weg willst, schreibe ich dir die komplette Einrichtung auf —
und die Seite spricht dann mit **deinem** Server statt mit Cloudflare. Der
Unterschied im Code ist klein; das Schwierige ist nicht das Programm,
sondern der laufende Rechner.

---

## 3. Der Weg ganz ohne Server — und warum er für dich wahrscheinlich reicht

Das Klassenzimmer verbindet heute jeden mit jedem. Deshalb hört es bei sechs
bis acht Leuten auf: bei zwanzig Personen müsste **jeder** sein Bild
neunzehnmal hochladen.

Aber ein Unterricht ist nicht „jeder mit jedem". Meistens redet **einer**,
und die anderen hören zu. Dann fallen alle Leitungen zwischen den Zuhörern
weg, und es bleibt nur die Frage, wie oft **du** hochladen musst. Und da
macht es einen gewaltigen Unterschied, ob Bild dabei ist:

| Was du sendest | je Zuhörer | 10 Zuhörer | 30 Zuhörer |
|---|---|---|---|
| **Nur Ton** (Opus, wie jetzt) | ~32 kbit/s | ~0,3 Mbit/s | ~1 Mbit/s |
| Ton + kleines Bild (320×180) | ~230 kbit/s | ~2,3 Mbit/s | ~7 Mbit/s |
| Ton + normales Bild (640×360) | ~600 kbit/s | ~6 Mbit/s | ~18 Mbit/s |

Ein gewöhnlicher Anschluss in Deutschland hat nach oben irgendwo zwischen
10 und 40 Mbit/s. Das heißt:

- **Nur Ton an dreißig oder fünfzig Leute — das geht heute schon, ohne
  irgendeinen Server und ohne einen Cent.** Das ist kein Trick, das ist
  einfach die Rechnung.
- Mit kleinem Bild sind zehn bis fünfzehn realistisch.
- Mit gutem Bild an hundert Leute: dafür braucht es die Vermittlung. Da
  führt kein Weg dran vorbei.

**Für Deutschunterricht ist das eine gute Nachricht.** Was zählt, ist deine
Stimme, der Chat, die Aufgaben, die Bilder, die man sich schickt. Das trägt
weit. Ein Videobild von dir in Fernsehqualität an hundert Leute gleichzeitig
ist der einzige Fall, der wirklich eine Vermittlung braucht.

---

## 4. Was ich vorschlage

1. **Jetzt nichts kaufen und nichts einrichten.** Wir wissen noch nicht, wie
   viele gleichzeitig kommen.
2. **Wenn es mehr als acht werden:** zuerst den Ton-Weg ausbauen — also
   einen Modus, in dem die Zuhörer nur zuhören und kein eigenes Bild
   schicken. Das kostet nichts und ist eine Sache von einer Runde.
3. **Erst wenn das nicht mehr reicht:** eigener Server mit freier Software.
   Dann bist du von niemandem abhängig, zahlst nur den Rechner, und wenn
   der Anbieter dir nicht passt, ziehst du um.

Cloudflare wäre nur die bequeme Abkürzung — nicht die einzige Tür.
