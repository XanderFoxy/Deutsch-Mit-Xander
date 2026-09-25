# Spielsystem „Deutsch zum Überleben" – Vorgabe

Diese Vorgabe bündelt alles, was Xander zum Spielsystem gesagt hat (Funk 84, 89, 90, 95 und den Verlauf seit dem 17.09.). Jede Regel nennt ihre Quelle. Zahlen, die er nicht festgelegt hat, sind mit **[gesetzt]** markiert. Sie stehen im Walkie zur Abstimmung.

## Leitidee
> „wenn man fleißig Deutsch lernt dann kann man gut überleben … dass sie Deutsch zum Überleben benutzen und davon abhängig sind gut deutsch zu sprechen" (Funk 89)
> „so ein Spielprinzip gibt es noch nicht und ich möchte dass wir die ersten sind" (Funk 89)
> „generell soll es aber lustig bleiben dass man halt immer alle gegen alle" (Funk 84)

## 1. Punkte nur aus Deutsch
- Deutschpunkte gibt es **nur** für Deutschaufgaben, die der **Server** prüft. Grundlage ist die vorhandene Aufgabensammlung (A1–C2). > „durch die Punkte die man in der Aufgaben sammelt" (Funk 84)
- Je nach Niveau gibt es mehr Punkte **[gesetzt: A1 3 · A2 4 · B1 5 · B2 6 · C1 7 · C2 8]**.
- Wer die Aufgaben dicht hintereinander löst, wird gebremst: höchstens eine Antwort alle 3 s und höchstens 300 Punkte pro Stunde **[gesetzt]**.
- Der Lehrer kann zusätzlich Punkte geben (Noten 1–6). Das prüft der Server. > „bekommen die anderen diese Punkte gutgeschrieben" (18.09.)
- Punkte aus Kämpfen sind klein. > „das soll einen nicht diese extrem Vorteile verschaffen" (Funk 90)
  - **[gesetzt]** 1 Punkt pro Treffer, höchstens 20 pro Stunde.
  - **[gesetzt]** +3 Punkte, wenn man jemanden kaputt macht.
  - **[gesetzt]** +5 Punkte für den Sieg im Duell.

## 2. Stärke durch Deutsch
- Wer insgesamt mehr Deutschpunkte verdient hat, ist schwerer zu verletzen. > „wenn man gut Deutschunterricht macht wird man stärker … nicht so leicht verletzbar" (Funk 84)
- **[gesetzt]** Die Höchst-Lebenspunkte steigen von 100 bis 200 (+5 je 50 verdiente Punkte).
- **[gesetzt]** Die Rüstung steigt bis 30 % weniger Schaden.
- Die Stärksten stehen in einer Rangliste. > „der stärkste im Chat hat natürlich die wenigste Gefahr" (Funk 84)

## 3. Lebenspunkte, Schaden, Heilung
- Jeder Treffer zeigt **rote Zahlen** am Bild, Heilung **grüne Zahlen**, die hochblinken. > (Funk 84)
- Wer lange in Ruhe bleibt, heilt von selbst. > „wenn er einfach nur lange in Ruhe bleibt … seine Wunden von selbst" (Funk 84)
  - **[gesetzt]** 60 s nach dem letzten Treffer +1 LP alle 20 s, bis 60 % der Höchst-LP.
- Bei 0 LP ist man **kaputt**. Das Bild liegt als Scherben da, man kann nicht reisen und nicht den Platz wechseln. > „du kannst nicht reisen oder du kannst nicht wechseln du bist kaputt" (Funk 89)
- Das **Pflaster** repariert. Man hat nur begrenzt viele Pflaster, neue muss man sich erspielen. > (Funk 89) · „zwei Pflaster über Kreuz" (23.09.)
  - **[gesetzt]** Zu Beginn 3 Pflaster.
  - **[gesetzt]** Ein Pflaster bringt einen kaputten Spieler auf 40 LP, sonst +25 LP.
- **Heiltrank** (Potion). > „heilungs Potion oder Flaschen" (Funk 89) · **[gesetzt]** +60 LP.

## 4. Waffen
- Eine gewählte Waffe **bleibt aktiv**, bis man einen anderen Profil-Effekt wählt. > „dass ich praktisch mit einer Armbrust da stehe die ganze Zeit" (Funk 89)
- Neue Waffen werden mit Punkten **freigeschaltet**. > (Funk 84)
- Verschiedene Waffen und Schusstechniken machen verschieden viel Schaden. > (Funk 89)
- **[gesetzt]** Die Waffenliste:

| Waffe | Preis | Schaden |
|---|---|---|
| Zwille | frei | 6 |
| Pfeil und Bogen | frei | 8 |
| Laser (Farbe wählbar) | frei | 7 |
| Armbrust | 40 | 12 |
| Tomahawk | 60 | 15 |
| Bazooka | 150 | 28 |
| Zielfernrohr | 100 | 35, langsam, Ziel kann ausweichen |

  > Farbe wählbar: Funk 89 · Tomahawk: Funk 89 · Bazooka: Funk 84 · Zielfernrohr: Funk 84

- Feinwerkzeuge (Hammer, Pfanne …) bleiben Spaß-Effekte außerhalb dieser Regel. > (Funk 89)

## 5. Treffer-Zonen am Profilbild (Funk 90, Funk 95)
> „wenn man z.B direkt in die Mitte oben schießt das ist wie ein Kopfschuss … Maximalschaden oder ins Herz … da musst du so Punkte definieren" (Funk 90)
> „je nachdem wo man hin zielt auf den Winkel vom Profilbild desto viel Punkte kriegt man" (Funk 90)

Der Tippunkt wird auf den Kreis umgerechnet: dx und dy liegen je zwischen −1 und +1, Mitte = 0, oben = −1. Der **Server** rechnet die Zone nach:

| Zone | Bereich | Faktor |
|---|---|---|
| Kopfschuss | Abstand zu (0 / −0,3) ≤ 0,3 | ×2,0 |
| Herz | Abstand zu (0,18 / 0,35) ≤ 0,2 (vom Betrachter rechts, beim Menschen links) | ×1,6 |
| Körper | Abstand zur Mitte ≤ 0,7 | ×1,0 |
| Streifschuss | Abstand zur Mitte ≤ 1,0 | ×0,5 |
| Daneben | außerhalb des Kreises | 0 |

## 6. Kampfmodus, Antippen, Ausweichen
- **Ohne** Kampfmodus tauscht ein Tipp auf ein fremdes Bild wie bisher die Plätze.
- **Im** Kampfmodus trifft man die Person dort, wo man hintippt. Nichts öffnet sich, nichts wird markiert. > (Funk 89, Funk 90)
- Das Geschoss fliegt dorthin, wo die Person gerade sitzt. Wer vor dem Einschlag den Platz wechselt, **weicht aus**. > „sie kann ausweichen" (Funk 89)
- Kampfmodus heißt, man hat eine aktive Waffe oder ist in einem Duell.
- **Duell:** Man fordert heraus, der andere nimmt an oder lehnt ab. > „fordert dich zum Duell heraus annehmen oder nicht" (Funk 90)
  - **[gesetzt]** Unbeteiligte bleiben außen vor.
  - **[gesetzt]** Das Duell endet, wenn einer kaputt ist, oder nach 3 Minuten.
  - Außerhalb von Duellen darf man trotzdem „witzig abschießen". > (Funk 90)

## 7. Schutz
- **Schutzschild/Aura** reist mit. **[gesetzt]** Fängt 60 Schaden ab, hält 10 min. > „magischen Schutzschild mitnehmen … wie so eine Aura" (Funk 84)
- **Mauer** bleibt am Platz. Beim Platzwechsel ist sie weg. Es gibt Holz, Stein und Stahl. > „Schutzmauer … durchbrechen muss" (Funk 84) · „verschiedenen Materialstärken" (Funk 89)
  - **[gesetzt]** Holz 40, Stein 90, Stahl 160 Punkte Haltbarkeit.
- **Scheibenwischer/Dreckschutz** löst automatisch aus, wenn jemand dich dreckig macht. **[gesetzt]** 3 Ladungen. > „dass man vor dreimal bewerfen … sicher ist" (Funk 84)
- **Geschütz** schießt automatisch zurück, wenn man angegriffen wird. > „Geschütze … die dann automatisch auslösen" (Funk 84)
- **Haustier** (kleines schwarzes Fellmonster mit Augen und Krallen) verteidigt sein Herrchen. > (Funk 90)
- **Anfängerschutz** **[gesetzt]**: Die ersten 10 Minuten kann man nicht getroffen werden.
- **Missbrauchsschutz** **[gesetzt]**: Dieselbe Person trifft dieselbe höchstens alle 3 s. Man verliert höchstens 60 LP pro Minute.

## 8. Waffenstillstand
> „wenn wir eine gemeinsame unterrichtssektion haben weil ich das Whiteboard aufmache … Waffenstillstand" (Funk 89)

Ist die Tafel offen, nimmt der Server keine Treffer an.

## 9. Missionen (Funk 84)
> „fahre zu der und der Person und löse diese deutschaufgabe mit ihr … wo er dann die Punkte kriegt wenn er diese Mission erfüllt hat"

Eine Mission nennt eine anwesende Person. Man reist zu ihr und löst dort eine Aufgabe. **[gesetzt]** Das bringt +8 Bonus, höchstens eine Mission alle 10 Minuten.

## 10. Anti-Schummel
Lebenspunkte, Punkte, Inventar und Treffer liegen in der Datenbank. Schreiben darf nur der Server über geprüfte Funktionen; Browser dürfen nur lesen. Wer spielt, wird über die Supabase-Anmeldung erkannt, Gäste über eine anonyme Sitzung.

## Später (genannt, noch nicht in diesem Paket)
- Strategiemodus mit geplanten Zügen und Tower-Defense-Wellen (Funk 84)
- Panzer mit Spuren (Funk 89/90), Kettensäge, Schwertkampf (Funk 90)
- Haustier Einhorn/Frosch (Funk 90)
- Salve auf mehrere Ziele (21.09.)
- Punkte für Aufprallwinkel wie bei Worms (23.09.)

## Stand der Umsetzung (Fassung 618, ergänzt bis 631)
- **Server** (Supabase, `spiel_*`): Konten, Aufgabenbank (Lösung für Browser unsichtbar), Antwort prüfen, Lehrerpunkte, Treffer mit Zonen und Rüstung, Mauer → Schild → LP, Gegenwehr (Geschütz, Fellmonster), Selbstheilung, kaputt, Pflaster, Trank, Laden, Platzwechsel (Mauer bleibt zurück), Wischer, Waffenstillstand, Duell, Mission, Rangliste. Geprüft mit einem Probelauf, der sich selbst zurückrollt.
- **Browser** (`spiel.js`, `spiel.css`): Lebensbalken unter jedem Namen, Schild-Aura, Mauer (Holz/Stein/Stahl), Fellmonster, Geschütz, Risse bei kaputt, rote/grüne Zahlen über dem Bild, gezeichnete Geschosse (Stein, Pfeil, Bolzen, Tomahawk, Rakete, Laserstrahl in Wunschfarbe, Fadenkreuz), Ausweichen, Spielfenster (`/spiel`, Kachel „Spiel"), Deutsch-Aufgaben (`/lernen`), Duell-Anfrage, Waffenstillstand bei offener Tafel.
- **Sonde:** `werkzeug/pruefe-spielsystem.js`.
- **Aufgabenbank:** 300 A1-Aufgaben liegen schon auf dem Server. Den Rest der Sammlung (rund 28.000) spielt der Betreiber-Browser beim nächsten Betreten des Klassenzimmers selbst ein.
- **Gäste:** Die anonyme Anmeldung ist in Supabase aus. Mitspielen geht deshalb nur mit Konto; Gäste bekommen einen Hinweis.

### Fassung 619–631
- **Übungspuppen** (Funk 100): Kampf gegen Puppe und Dummy nur auf dem eigenen Gerät; Übungsduell, in dem die Puppe zurückschießt. Seit 631 hat die Puppe ein Fellmonster und der Dummy ein Geschütz, damit sich die Gegenwehr üben lässt.
- **Mana und Zaubertränke** (Funk 106): +6 Mana je richtiger Aufgabe, höchstens 100. Trinken kostet 30 Mana. Seit 631 sechs Tränke:
  - Kraftelixier ×1,5 Schaden, 60 s
  - Zielwasser: Schuss zieht zum Kopf, 60 s
  - Blitztrank: halbe Flugzeit und 1,2 s Pause, 60 s
  - Manatrank: +50 Mana, kostet kein Mana
  - Eisenhaut: halber Schaden, 60 s
  - Tarntrank: 20 s nicht zu treffen, endet beim eigenen Schuss
- **Kampfmodus-Leiste** oben, **Betonung** als eigene Aufgabenart (Funk 106).
- **Treffertöne** (Funk 108): Jede Waffe hat einen Abschuss- und einen Trefferton. Beide klingen auf jedem Gerät, das den Schuss sieht.
- **Andere heilen** (Funk 108): im Reiter „Duell & Heilen“, mit dem eigenen Pflaster oder Heiltrank (`spiel_heilen(p_art, p_ziel)`).
- **Gegenwehr verhältnismäßig** (Funk 109). Vorher gab es immer 6 (Geschütz) bzw. 4 (Fellmonster) zurück. Jetzt:
  - Geschütz: 50/70/90 % des Schadens je Stufe, 2–18 pro Schuss, 12 Schuss.
  - Fellmonster: 30 %, 2–10.
  - Stachelmonster: 20 %, 1–8; fängt zusätzlich 1/5 des Treffers ab.
  - Drache: 50 %, 3–16.
  - Die Rüstung des Angreifers zählt mit. Die Gegenwehr beträgt höchstens 4/5 dessen, was der Angreifer anrichtet.
- **Abnutzung** (Funk 110): Fellmonster 30, Stachelmonster 35, Drache 25 Einsätze, danach zieht es weiter.
- **Gegenwehr sichtbar** (Funk 110): Das Geschütz feuert Kugeln, das Monster springt zum Angreifer und beißt bzw. faucht, jeweils mit eigenem Ton.
- **Neue Waffen** (Funk 110): Eierwerfer (5 Schaden, 20 Punkte), Hühnerwerfer (10, 55).
- **Lebens- und Manaring** (Funk 110): zwei Bögen auf dem Rand des Bildes statt Balken unter dem Namen.
- **Minen und Falltüren** (Funk 111):
  - Man legt sie auf einen Platz: Mine 30 Punkte/20 Schaden, Falltür 25 Punkte/12 Schaden.
  - Höchstens drei gleichzeitig; sie liegen 30 Minuten.
  - Nur wer sie gelegt hat, sieht sie.
  - Ausgelöst wird auf dem Gerät dessen, der dort ankommt (`spiel_falle_pruefen`). So kann niemand eine Falle auf jemanden abfeuern, der nicht dort sitzt.
  - Wer die Falle gelegt hat, bekommt +2 Punkte.
- **Töne** (631): 12 neue Geräusche aus ElevenLabs (Hühnerwurf und -aufprall, Monsterbiss, Stachel, Drachenfeuer, Falltür, Mine, Geschütz, Pfeil- und Axttreffer, Trank, Tarnung).
- **Sonden:** `werkzeug/pruefe-funk108-spiel.js`, `pruefe-dummy.js`, `pruefe-spielsystem.js`. Der Server ist jeweils mit einem Probelauf geprüft, der sich selbst zurückrollt.

### Fassung 633 (Xander, 25.09.)
- **Mitspielen ist freiwillig.** Nur wer „Mitspielen“ an hat, kann angreifen und angegriffen werden. Wer nicht mitspielt, hat einen grauen Ring. Aussteigen geht nicht innerhalb von 60 s nach einem Treffer. Der Stand liegt auf dem Server und reist mit; die Bühne zu verlassen ändert nichts.
- **Schnellleiste** über der Chat-Eingabe, nur auf dem eigenen Gerät: Mitspielen, alle eigenen Waffen (Tipp = anlegen, nochmal = ablegen), Herz (heilt schonend), Tränke, Sparring, Menü. Die obere Kampfmodus-Leiste verschwindet, solange die Schnellleiste da ist.
- **Kartoffel** ist die Standardwaffe (Schaden 6), alle haben sie.
- **Erholung:** 60 s nach dem letzten Treffer +1 LP alle 20 s bis 60 %, dann +1 alle 40 s bis voll. Kaputt: nach 5 min Ruhe wieder auf mit 25 LP.
- **Heilen ohne Verschwendung:** Bei vollen LP lehnt der Server ab. Das Herz wählt: kaputt → Pflaster, ≥ 45 verloren → Heiltrank, sonst Pflaster.
- **Sparringspartner:** Strohpuppe auf einem freien Platz, nur auf dem eigenen Gerät, belegt keinen Sitz. „Er schießt zurück“ startet ein Übungsduell.
- **Aufgaben** schalten nach 1,6 s (richtig) bzw. 3,5 s (falsch) weiter. Die Punkteregel steht im Reiter „Deutsch“, die Spielanleitung im Reiter „Anleitung“.
- **Kapsel:** Auf der Reise verschwinden Ring, Tier, Geschütz und Aura am verlassenen Platz und erscheinen am Ziel.
- **Sonde:** `werkzeug/pruefe-633-schnellleiste.js`.

### Fassung 634 (Xander, 25.09.)
- **Erfahrung und Level.**
  - Erfahrung gibt es für Deutsch (doppelt so viel wie die Punkte, mindestens 1, auch über der Stundengrenze), für jeden Treffer (+1), fürs Heilen anderer (+3), fürs Tagesgeschenk (+20) und für Seitenübungen (2 je umgetauschtem Punkt).
  - Level = ⌊(1 + √(1 + xp/12,5)) / 2⌋, höchstens 50. Die Schwellen liegen bei 100, 300, 600 … Erfahrung.
  - Beim Einführen bekam jeder verdient × 2 Erfahrung gutgeschrieben.
- **Können (Skills).**
  - Jedes Level über 1 gibt einen Skillpunkt. Es gibt sechs Fertigkeiten mit je bis zu 5 Stufen: Zähigkeit (+10 Höchst-LP), Panzerhaut (+3 % Rüstung, gesamt höchstens 45 %), Treffsicher (+5 % Schaden), Heilkunst (+10 % Heilung), Tierfreund (+10 % Monster-Gegenwehr), Ingenieur (+10 % Geschütz-Gegenwehr).
  - Ein Training dauert 5 min × Stufe und läuft nebenher; es gibt immer nur eines gleichzeitig. Was fertig trainiert ist, bleibt (`spiel_trainieren`; abgeschlossen wird in `spiel_frisch`).
- **Rüstung kaufen.**
  - Helm und Brustpanzer gibt es in je drei Stufen für 40, 60 und 90 Punkte. Jeder hält 40 Treffer auf die geschützte Stelle; Reparieren kostet 10 Punkte.
  - Helm: Kopf ×max(1,25; 2 − 0,25 × Stufe). Brustpanzer: Herz ×(1,6 − 0,15 × Stufe), Körper ×(1 − 0,07 × Stufe).
  - Probelauf mit Kartoffel (Schaden 6): Kopftreffer mit Helm 1 → 11 statt 12, Herztreffer mit Brust 1 → 9 statt 10.
- **Superkraft (dämonisch).**
  - Die Ladung steigt mit Deutsch (+8), Treffern (+2) und Einstecken (+3). Bei 100 % gibt es 45 s lang ×1,5 Schaden, man steckt nur 70 % ein, und auch Gegenwehr trifft nur zu 70 %.
  - Probelauf: 12 → 18.
- **Tagesgeschenk.**
  - Es wird beim Betreten automatisch abgeholt: 10 + 2 × Serie Punkte, +20 Erfahrung, 1 Bratwurst (an Tag 7 drei), jeden dritten Tag ein Pflaster. Die Serie geht bis 7.
  - Übungen auf der Seite: 5 Seitenpunkte ergeben 1 Spielpunkt (höchstens 40 am Tag), 50 Seitenpunkte eine Bratwurst (höchstens 3). Abgeholt wird alle 5 Minuten.
  - `profiles.points` kann der Browser selbst beschreiben. Deshalb die Tagesgrenze.
- **Am Bild sieht jeder:**
  - oben den goldenen Ladebogen (dämonisch: rot-violett, das Bild glüht)
  - links die Levelzahl
  - außen oben den Helm und außen unten den Brustpanzer (Bronze, Silber, Gold)
  - Alles liegt auf dem Rand über Hut und Kleidung; die inneren 70 % bleiben frei.
- **Schnellleiste:** zeigt „Lv N“ und eine Flamme, die ab 100 % antippbar ist. Neuer Reiter „Können“. Helm und Brustpanzer stehen oben in „Schutz & Laden“.
- **Sonde:** `werkzeug/pruefe-634-level-ruestung.js`. Der Server ist mit einem Probelauf geprüft, der sich selbst zurückrollt.
