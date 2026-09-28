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
| Zielfernrohr | 100 | 22 (bis 696: 35), langsam, Ziel kann ausweichen |

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

### Fassung 637 (Xander, Funk 113 und 25.09.)
- **Deutsche Wurfsachen.**
  - Brezel: 5 Schaden, 20 Punkte.
  - Bierkrug: 11 Schaden, 45 Punkte.
  - Spätzle-Kanone: 14 Schaden, 90 Punkte, eine Salve aus fünf Spätzle.
  - Jede hat ihren eigenen Trefferton (brezelknack, krugklirr, platsch).
- **Bratwurst und Sauerkraut sind Vorräte.** Man bekommt sie aus dem Tagesgeschenk, aus den Seitenübungen oder im Laden (je 3 Stück für 15 bzw. 12 Punkte).
  - Werfen: Bratwurst 9 Schaden (wurstklatsch), Sauerkraut 4 Schaden (krautmatsch). Jeder Wurf verbraucht eins; der Server prüft den Vorrat.
  - Essen (`spiel_essen`): Bratwurst +15 LP, Sauerkraut +10 LP und +10 Mana. Wer satt und voll ist, isst nicht; wer kaputt ist, braucht erst ein Pflaster.
- **Sauerkraut nimmt die Sicht.** Am getroffenen Bild klatscht es oben auf, rutscht in 4 s nach unten, hängt dort und fällt nach 20 s ab.
  - Beim Getroffenen laufen zusätzlich Krautfäden über die Bühne. Einmal tippen wischt die Hälfte weg, zweimal alles; der gekaufte Scheibenwischer wischt von selbst. Nach 15 s ist es ohnehin weg.
- **Das Herz isst zuerst,** wenn wenig fehlt: bis 15 LP eine Bratwurst, bis 10 LP Sauerkraut. Bei mehr nimmt es wie bisher Pflaster oder Heiltrank.
- **Töne** (ElevenLabs): brezelknack, krugklirr, wurstklatsch, krautmatsch, spaetzlesalve, mampf. Für die Tiere in der nächsten Fassung schon da: chihuahuaknurr, bisszerren.
- **Sonde:** `werkzeug/pruefe-637-deutsche-waffen.js`. Der Server ist mit einem Probelauf geprüft, der sich selbst zurückrollt.

### Fassung 638 (Xander, 25.09.)
- **Zwei Tierplätze.**
  - Am Boden: Fellmonster (120), Stachelmonster (160), Chihuahua (100, neu).
  - In der Luft: Babydrache (250, neu gezeichnet: großer Kopf, Kulleraugen, rosa Bäckchen, schlagende Flügel) und Eule (150, neu).
  - Das Flugtier schwebt rechts oben neben dem Bild, das Bodentier sitzt rechts unten.
  - Wer vorher einen Drachen hatte, hat ihn jetzt auf dem Luft-Platz.
- **Tiere sterben nicht mehr.** Jede Abwehr kostet 1 Kraft. Bei 0 Kraft ist das Tier schwach (blass, wehrt nicht ab), bleibt aber.
  - Füttern (`spiel_fuettern`): Bratwurst +12, Sauerkraut +8, nie über voll.
  - Höchste Kraft: 30 (Stachelmonster 35, Drache 25), dazu +10 je Stufe.
- **Aufwerten** bis Stufe 3 für 60 × Stufe Punkte: +15 % Gegenwehr je Stufe. Ab Stufe 2 kommt eine zweite Fähigkeit dazu:
  - Fellmonster kuschelt sein Herrchen (+3 LP)
  - Stachelmonster fängt 1/3 statt 1/5 ab
  - Chihuahua lässt nicht los (+2)
  - Babydrache glüht nach (+2)
  - Eule warnt (1/10 weniger Schaden)
- **Gegenwehr:** Chihuahua 25 % (2–9), Eule 25 % (2–8), sonst wie bisher. Beide Tiere wehren ab, zusammen mit dem Geschütz höchstens 4/5 dessen, was der Angreifer anrichtet.
- **Biss mit Festbeißen und Zerren.** Der Chihuahua springt zum Angreifer, knurrt (chihuahuaknurr), beißt sich unten am Bild fest und zerrt fünfmal hin und her (bisszerren). Das Bild des Angreifers ruckt mit, und es bleibt ein Bissmal.
- **Flugtiere** holen oben Schwung und stoßen von oben ans Gesicht.
- **Neuer Reiter „Tiere“:** beide Plätze mit Kraftbalken, Füttern, Aufwerten, Holen und Tauschen.
- **Sonde:** `werkzeug/pruefe-638-tiere.js`. Der Server ist mit einem Probelauf geprüft, der sich selbst zurückrollt. In `pruefe-funk108-spiel.js` wird der Drache jetzt an seinem neuen Platz gemessen.

### Fassung 640 (Xander, Funk 112 und 25.09.)
- **Die Mauer gehört einem, bis sie zerstört ist.** Vorher verschwand sie beim Platzwechsel. Jetzt zieht sie mit (`spiel_platzwechsel` setzt `mauer_ab`) und baut sich am neuen Platz in 8 s wieder auf: Man sieht sie hochwachsen, und so lange fängt sie nichts ab.
- **Geschütz-Turm.**
  - Einmal kaufen (60). Danach nachladen für 20 statt neu kaufen; ein zweiter Kauf wird abgelehnt.
  - Stufen bis 5 (Preis 50 + 20 × Stufe). Schuss: 12 + 4 je Stufe. Obergrenze je Schuss: 18, ab Stufe 4 22, auf Stufe 5 26.
  - Am Bild: goldene Ringe am Sockel, ab Stufe 4 ein zweites Rohr, und der Turm wird größer.
- **Abnutzung.** Gekaufte Waffen halten je 60 Treffer (`waffen_halt`), danach sind sie stumpf und machen halben Schaden.
  - Reparieren: 15 Punkte für alle, per Schraubenschlüssel in der Leiste, ohne Menü. Er erscheint, sobald eine Waffe höchstens 15 Treffer hält.
  - Probelauf: eine stumpfe Armbrust macht 12 → 6.
- **Sonde:** `werkzeug/pruefe-640-turm-mauer.js`. Der Server ist mit einem Probelauf geprüft, der sich selbst zurückrollt. `pruefe-funk108-spiel.js` misst den Sprung jetzt über das ganze Zeitfenster statt an einem einzigen Bild; vorher schwankte der Wert je nach Takt zwischen 0,33 und 1,25 Radien.

### Fassung 641 (Xander, 25.09. nachts)
- **Tiere bleiben Besitz** (`tiere` = {Art: {kraft, stufe}}).
  - Alles Gekaufte bleibt: Ein neues Tier stellt das aktive nur weg, samt Kraft und Stufe. `spiel_tier_wechseln` holt ein anderes raus, kostenlos.
  - Rückwirkend aus den Kaufprotokollen: Xanders Fellmonster (von der Drache-Umstellung ersetzt) ist wieder draußen, der Drache fliegt zusätzlich.
- **Keine Stundengrenze mehr für Punkte** (vorher höchstens 300 je Stunde). Die 3 Sekunden zwischen zwei Antworten bleiben.
- **Tränke wirken 3 Minuten** (vorher 60 s), Tarnung 45 s, Superkraft 90 s.
- **Neue Leiste.** Sie schwebt über dem Chat (nimmt keine Zeile weg, scrollt nicht) und hat nur: Spiel an/aus · Waffe 1 · Waffe 2 · Herz · Flamme · (Schraubenschlüssel) · Menü.
  - Das Menü klappt nach oben auf, mit den Reitern Waffen (Standard, Lustig, Stark; ein Tipp legt die Waffe auf Waffe 1 oder 2), Heilen, Tiere (wechseln) und Mehr (Sparring, Ton testen, Laden, großes Menü).
  - Ein Tipp daneben klappt es zu. Level, LP, Punkte und Mana stehen oben im Menü.
- **Sparring bleibt an.** Der Partner schießt zurück, bis man ihn ausschaltet. Nach einem K.o. stehen beide wieder auf.
  - Die eigenen Tiere und der Turm wehren sich dabei (lokal gerechnet wie `spiel_treffer`, `eigeneGegenwehr`).
- **Waffen-Abzeichen** am eigenen Bild jetzt links oben; vorher verdeckte es den Babydrachen.
- **Ringe wie Flüssigkeit:** dunkler Saum für jeden Hintergrund, darin fließende helle Bläschen.
- **Töne.**
  - Die Liste der vorhandenen Töne wurde beim ersten Aufruf fest gemerkt. War sie da noch leer, klang kein einziges Geräusch mehr. Eine leere Liste wird jetzt nie gemerkt.
  - „Ton testen“ (Menü → Mehr) sagt auf dem Gerät, woran es liegt: Töne aus (schaltet ein), Liste nicht geladen, Browser blockiert (Ersatzweg) oder Ton läuft.
- **Sonde:** `werkzeug/pruefe-641-tiere-sparring-leiste.js`. Die Sonden 633, 634 und 637 sind an die neue Leiste angepasst.

### Fassung 642 (Xander, 25.09. nachts)
- **Döner-Katapult** (13 Schaden, 70 Punkte): eine echte Dönertasche (Brot mit Sesam, Fleisch, Salat, Tomate, rote Zwiebel, weiße Soße). Sie fliegt im hohen Bogen; Töne katapult4 und doenerklatsch.
- **Arcade-Waffen**, Turrican-artig:
  - Maschinengewehr (12, 110): Salve aus sechs Kugeln (mgsalve).
  - Laser-Salve (10, 80): drei farbige Blitze (lasersalve).
  - Beide nutzen sich ab wie die anderen gekauften Waffen.
- **Menü → Waffen** in Gruppen: Standard, Lustig, Arcade, Stark.
- **Sauerkraut feiner:** viele dünne, gewellte Fäden (0,5–1 breit) mit Saftspur und Kümmel statt breiter Streifen.
- **Babydrache:** gleiche Form, dazu Schuppen, Flügeladern, Bauchstreifen und Rückenzacken; er blinzelt alle paar Sekunden.
- **Sonde:** `werkzeug/pruefe-642-doener-salven.js`.

### Fassung 643 (Xander, 25.09.: „Schatzsuche … Schaufel … graben … Bodenschätze … Waffenproduktion“)
- **Graben.** Menü → Mehr → „Graben (Schaufel)“. Mit der Schaufel in der Hand gilt ein Tipp auf einen Platz dem Graben, nicht dem Hinsetzen. Die Schaufel in der Leiste legt sie wieder weg.
  - Server `spiel_graben(p_raum, p_platz)`: nur wer mitspielt und nicht kaputt ist; derselbe Platz erst nach 10 min wieder; höchstens 30 Löcher pro Stunde; +1 Erfahrung.
  - Funde: nichts 42 %, Münzen 1–4 Punkte, 1 Erz, Bratwurst, Sauerkraut, selten eine Truhe (+10 Punkte, 1 Erz). Tabelle `spiel_grabung`.
  - Bild: Erdhaufen, Schaufel sticht zweimal und Krumen fliegen, alles am unteren Rand des Platzes. Ton „graben“ startet gleichzeitig; der Fund steigt nach 0,9 s über dem Kreis auf.
- **Missionen, fünf Arten** (`spiel_mission(p_ziel_name, p_art, p_raum, p_plaetze)`, 3 min Pause dazwischen):
  - neben jemandem eine Aufgabe lösen (+8, nur wenn jemand da ist)
  - Schatz ausgraben (+25 und 2 Erz, 10 min): die Karte nennt die obere oder untere Reihe; nach jedem Loch „heiß“, „warm“ oder „kalt“
  - drei Aufgaben am Stück richtig (+15; ein Fehler setzt auf 3 zurück)
  - jemand anderen heilen (+10)
  - 20 Punkte in den Übungen der Seite sammeln (+12, 30 min; wird mit dem Seitenpunkte-Abholen alle 5 min gutgeschrieben)
  - Erfüllt der Server eine Mission, verschwindet sie aus dem Stand und es gibt Jubel (`missionPruefen`).
- **Werkstatt** (Reiter Schutz, `spiel_schmieden`):
  - Pflaster: 1 Erz
  - alle Waffen schärfen: 2 Erz
  - Turm voll laden: 3 Erz
  - Erz steht in der Statuszeile.
- **Lücke geschlossen** (Migration `spiel_643b_turm_nur_mit_turm`): Turm-Nachladen (20) und Turm-Munition (Erz) gehen nur mit einem Turm. Vorher ersetzte „Nachladen“ den Kauf für 20 statt 60.
- **Fehler behoben:** In `panelAuffrischen` überdeckte die lokale Variable `vorrat` die gleichnamige Funktion.
- **Bekannt:** Die Mission steht im eigenen Stand, also kennt der eigene Browser den Schatz-Platz. Den Lohn prüft trotzdem der Server.
- **Sonde:** `werkzeug/pruefe-643-graben-missionen.js`.

### Fassung 644 (Xander: „der gemeinsame Verlauf ließ sich nicht laden … das Laden etwas optimieren“)
- `livechat.js` (Commit „Fassung 642: Gemeinsamer Verlauf lädt in Happen“, eingespielt als 644):
  - **Ursache:** Jede Verlaufsabfrage holte bis zu 20 000 Zeilen, jede mit Profilfoto (bis 140 000 Zeichen). Die Datenbank brach ab (57014); das erschien als leerer Raum, daraus wurde die Meldung.
  - **Jetzt:** erst 300 Zeilen ohne Foto, dann Seiten zu 2000 im Hintergrund; Fotos einmal je Person; 12 s Zeitgrenze.
  - **Meldung:** kommt nur bei echtem Ausfall, einmal, als Einblendung.
  - **Zusammenführen** linear (2,2 s → 13 ms).
  - **Verlaufspaket an Neue:** 394 KB → 23 KB.
- **Datenbank:** Teilindizes `klassenzimmer_chat_raum_offen_zeit` und `klassenzimmer_chat_raum_bild_zeit`.
- **Sonde:** `werkzeug/pruefe-642-verlauf-laden.js` (alt 11× rot, neu grün).
- **Noch offen:**
  - Der Kanalbeitritt wartet auf Mikrofon und Relais, bis zu 8 s.
  - Neben Cloudflare stehen 6 öffentliche Vermittlungsserver in der Liste; ab 5 wird die Wegesuche langsamer.

### Fassung 645 (Xander, 25.09.: „der Sound geht immer noch nicht … das Menü auf Android ist unmöglich … wenn ich auf Ton testen gehe passiert gar nix“)
- **Warum das Menü nicht reagierte** (gemessen mit echten Fingertipps im Android-Format):
  1. Jede Spielaktion zeigte eine App-Blase (Toast): fest unten, Ebene 999, bis zu dreizeilig und 5,5 s lang. Sie lag über dem unteren Teil des Menüs, und ein Tipp schloss nur die Blase. Auch unsichtbare, gerade ein- oder ausblendende Blasen fingen Tipps ab.
  2. Die Leiste zeichnete sich laufend neu (Sekundenzähler), auch während der Finger auf einem Knopf lag.
  3. Das Menü war bis 46 % der Bildschirmhöhe hoch und wurde oben vom Rahmen abgeschnitten.
- **Jetzt:**
  - Spielmeldungen stehen in einer eigenen, durchlässigen Zeile über der Leiste (`pointer-events: none`), bei offenem Menü in dessen Kopfzeile.
  - App-Blasen nehmen nur noch Tipps an, solange sie sichtbar sind.
  - Kein Neuzeichnen, solange der Finger liegt; der Tipp selbst zeichnet sofort.
  - Menühöhe = Platz über der Leiste; Listen zweispaltig, dadurch halb so hoch.
- **Ton:**
  - Das Spiel spielt seine Töne selbst über Web Audio. 44 Spieltöne werden nach dem ersten Tipp vorgeladen und dekodiert und klingen dann ohne Verzögerung.
  - Freigeschaltet wird bei jedem pointerup, touchend, click und keydown. Auf Android zählen touchstart und pointerdown nicht als Nutzergeste.
  - Klappt Web Audio nicht, übernimmt der alte `<audio>`-Weg.
  - In app.js wurde der gemeinsame Tonkontext beim touchstart gesperrt angelegt und dann nie wieder freigeschaltet (`once`). Er wird jetzt bei jedem Tipp geprüft.
- **Diagnose:**
  - „Ton testen“ misst jeden Schritt: Töne an, Kontextzustand, Laden/Dekodieren, Web Audio, Ersatzweg. Das Ergebnis geht über `spiel_diagnose_senden` in die Tabelle `spiel_diagnose` (RLS an, keine Policies, nur der Betreiber liest per SQL, höchstens 40 am Tag).
  - Nach einer Minute Spiel meldet jedes Gerät einmal den „tonstand“.
  - Sind die Töne aus, zeigt die Leiste einen roten Lautsprecher; ein Tipp schaltet sie ein.
- **Waffen-Abzeichen am eigenen Bild entfernt** („der Bierkrug … so riesig“); die Waffe steht in der Leiste.
- **Auswertung einer Aufgabe mit festem Platz** (54 px, schon vor der Antwort da): Ergebnis, Mana und EP in einer Zeile, „Weiter“ rechts, Erklärung einzeilig. Darunter verschiebt sich nichts.
- **Sonde:** `werkzeug/pruefe-645-ton-telefon.js` (Android-Telefon, echte Fingertipps). Die Sonden 634, 641 und spielsystem sind an Auswertung und Abzeichen angepasst.

### Fassung 646 (Xander, 25.09.: „die Tiere … bleiben gleichzeitig mit an ihrem Platz … der Kleine muss sich richtig fest beißen … der Drache … von allen Seiten mit seinem Feuer … das soll an mir kleben“)
- **Tiere verlassen beim Angriff ihren Platz.** Solange sie angreifen, ist das Tier am eigenen Platz ausgeblendet (`sp-boden-aus` / `sp-luft-aus`). Es startet genau von dort und landet am Ende wieder dort.
- **Bodentiere (2,6 s):** Sprung im Bogen, Festbeißen am unteren Bildrand (die Gesichtsmitte bleibt frei), zwölfmal Zerren mit drei Kratzspuren, das Bild des Angreifers ruckt. Das Einhorn hinterlässt einen Regenbogen.
  - **Chihuahua:** 2,8 s, 14-mal Zerren.
- **Flugtiere (3,4 s):** Sie fliegen hin, umkreisen das Bild einmal ganz und greifen dreimal von verschiedenen Seiten an.
  - Drache und Phönix speien Feuerstrahlen (`sp-feuerstrahl`) vom Maul ins Bild.
  - Eule und Fee stoßen Funken.
  - Jeder Stoß hat seinen Ton.
- Die rote Gegenwehr-Zahl erscheint im Moment des ersten Bisses bzw. Feuerstoßes.
- **„Kleben“:**
  - Ring, Tiere und Turm wurden nur im 0,7-s-Takt neu gezeichnet. Nach einem Platzwechsel saßen sie deshalb noch am alten Platz (sie wirkten wie fremde Angreifer) und fehlten am neuen.
  - Jetzt zeichnet ein MutationObserver im selben Bild neu, in dem sich die Besetzung eines Platzes ändert oder eine Reise endet. Er reagiert nicht auf die eigenen Änderungen (`takeRecords`).
  - Gegenprobe: Die Sonde ist mit der alten spiel.js rot (Tier am alten Platz, am neuen keins) und mit der neuen grün.
- **Neue Tiere** (Server: `spiel_646_neue_tiere`; kaufen, doppelt verhindert und Wechsel mit Kraft per Rollback geprüft):

  | Tier | Ort | Preis | Gegenwehr | Stufe 2 |
  |---|---|---|---|---|
  | Schäferhund | Boden | 180 | 35 %, max. 14 | +2 |
  | Babyfuchs | Boden | 90 | 20 % | – |
  | Fuchs | Boden | 170 | 30 % | – |
  | Einhorn | Boden | 300 | 35 % | Regenbogen heilt +2 LP |
  | Phönix | Luft | 340 | 45 %, max. 15 | heilt +2 LP |
  | Fee | Luft | 200 | 25 % | – |

  - Eigene Zeichnungen und eigene Töne (ElevenLabs): hundbellen, babyfuchs, fuchskeckern, einhorn, phoenix, feenzauber.
- **Tierliste:**
  - Das Tier, das draußen ist, steht nur noch einmal (oben). Darunter „Deine Tiere“ und „Zu kaufen“.
  - Kacheln zeigen den Ausschnitt um das Tier statt des ganzen Platzbilds; magische Tiere sind markiert.
- **Sonde:** `werkzeug/pruefe-646-tiere-angriff.js`. Die Sonden 638 und funk108 sind an die längeren Angriffe angepasst; Kriterien und Messung bleiben, nur die Zeitfenster sind länger.

### Fassung 647 (Xander, Funk 123/124: „warum habe ich meine Mauer immer noch nicht zurück … die Sounds … ohrenbetäubt“)
- **Ton-Diagnose von seinem Handy** (spiel_diagnose, Samsung Internet 30 / Android 10): Web Audio läuft, 44 Töne geladen, der Tontest spielt. Und er hört die Töne jetzt.
- **Leiser und weicher:**
  - Alle Spieltöne gehen durch einen Kompressor (−24 dB, 6:1) und eine gemeinsame Grundlautstärke von 0,62; die frühere Anhebung ×1,5 ist weg.
  - Neue, runde Töne für Fellmonster (`monsterbiss2`) und Babydrache (`drachenpuste`).
  - Alle neuen Tiertöne sind auf −21 LUFS angeglichen.
- **Mauer:**
  - Das Protokoll zeigt: 00:22 Stein, 02:02 noch einmal Stein (die erste stand noch, getroffen wurde er seit 23:54 nicht), 04:34 Stahl. Jeder Kauf ersetzte die vorhandene Mauer ohne Anrechnung.
  - Erstattet: 90 Punkte (Protokoll-Eintrag „erstattung“).
  - Jetzt rechnet der Server eine vorhandene Mauer an (halber Punkt je Haltepunkt). Eine gleich gute oder schlechtere wird abgelehnt.
  - Der Reiter Schutz zeigt „Deine Mauer: Stahl · hält noch 160/160“ und den angerechneten Preis.
- **Sicherheitslücke geschlossen** (`spiel_646b_kaufen_punkte_zuerst_mauer_anrechnen`): Ein Tier wurde in den Besitz geschrieben, bevor die Punkte geprüft wurden. Mit zu wenig Punkten kam „zu wenig Punkte“, das Tier gehörte einem trotzdem. Jetzt werden die Punkte zuerst geprüft. Im Bestand gibt es kein Tier ohne bezahlten Kauf (geprüft).
- „Babyfuchs“ heißt jetzt „Kleiner Fuchs“.

### Fassung 648 (Xander: „mehr Spiele bei Art … Artikel Trainer … Aussage Check ob etwas richtig oder falsch ist … den Aussprache Trainer ganz klein mit einbringen … dafür Punkte kriegt“)
- **Aufgabenarten:**
  - Knöpfe: Alles, Artikel, Fälle, Präpositionen, das/dass, ss/ß, Betonung, Aussprache.
  - „Weitere …“ (Auswahlliste) mit 31 weiteren Arten aus der Datenbank (je … desto, Relativsätze, Konnektoren …). Vorher gab es nur „Alles“ und „Betonung“.
- **„Stimmt der Satz?“** (Kategorie `richtig-falsch`):
  - Erzeugt aus geprüften Lückensätzen. „Falsch“-Sätze entstehen nur aus Formfehlern (gleicher Wortanfang wie die Lösung: kennt/kennen, dessen/deren, dem/den) oder aus das/dass, ss/ß, je … desto.
  - Drei Stichproben mussten nachgebessert werden. Grammatisch korrekte „falsche“ Sätze wie „zum Freibad“, „euch … einen Esstisch“, „spielte“, „keine Onkel“, „den Kalkül“ flogen raus; Zeitform, Verneinung, Modalverben, Possessiv, Lückentext und Konnektoren sind ausgeschlossen.
  - Jeder der 930 „falsch“-Sätze wird einzeln geprüft (sperrgrund `pruefung648` → aktiv bzw. `grammatisch648`). Bis dahin ist der Knopf verborgen (`ARTEN_FREI`).
  - Nur zwei Antworten: halbe Punkte (`spiel_antwort`).
- **Aussprache im Spiel:**
  - `spiel_aussprache_wort` stellt ein Wort aus den Betonungs-Wörtern (Tabelle `spiel_sprechen`, je Spieler eins). Der Browser nimmt nur Wörter mit Alex' Aufnahme (`DMA_TON`, wird bei Bedarf nachgeladen).
  - Ablauf: „Alex hören“, „Nachsprechen“ (stoppt bei Stille, höchstens 4 s), Vergleich mit `AusspracheP.freieBewertung`.
  - `spiel_aussprache_fertig`: ab 60 % 2 (A1/A2) bzw. 3 Punkte, +EP, +4 Mana. Jedes Wort nur einmal, höchstens 40 je Stunde.
  - Die Note meldet der Browser, deshalb gibt es wenige Punkte und eine feste Grenze.
- **Sonde:** `werkzeug/pruefe-648-aufgabenarten.js`.

## Fassung 649 — Waffenrad („Tachometer") und „Stimmt's?" freigegeben

XANDER: „das Waffen Menü vielleicht so klassisch, wie man das so bei Diablo … so ne Art Tachometer … ganz schnell wechseln … ohne vier Text lesen zu müssen"

- Nochmal auf die gewählte Waffe in der Schnellleiste tippen öffnet das Rad: ein Halbkreis über dem Knopf, zwei Ringe (innen höchstens 7, Rest außen), nur Bilder, keine Texte.
- Tippen auf ein Bild rüstet diese Waffe aus und schließt das Rad; die Mitte legt die Waffe ab; ein Tipp daneben schließt.
- Das Rad bleibt immer ganz im Bild (seitlich eingeklemmt), Knöpfe überlappen nicht.
- „Stimmt's?" (Richtig/Falsch) ist jetzt freigegeben: jeder Satz einzeln geprüft — 804 falsche und 1386 richtige aktiv, 193 gesperrt (grammatisch648, erklaerung648, kaputt648, richtigfalsch648).
- Sonden: pruefe-649-waffenrad.js (neu), pruefe-633-schnellleiste.js (Rad statt Ablegen beim zweiten Tipp), pruefe-648-aufgabenarten.js (Stimmt's sichtbar).

## Fassung 650 — Zauber: Nebel, Erdbeben, Orkan (ab Level)

XANDER: „Zauber oder Erdbeben Orkane … Gegner von der Bildfläche werfen oder durcheinanderbringen … Nebeln" · Funk 125: „Updates ab einem bestimmten Level"

| Zauber | ab Level | Mana | Wirkung (Server: `spiel_zaubern`, Regeln in `spiel_zauber_regel`) |
|---|---|---|---|
| Nebel | 3 | 25 | 15 s `nebel_bis`: Schüsse streuen stark (±1,2), nur 60 % Schaden |
| Erdbeben | 5 | 35 | 10 Schaden an der Mauer vorbei, reißt 25 an der Mauer, 6 s `wackel_bis` |
| Orkan | 7 | 50 | 15 Schaden (Mauer fängt), Schild weg, 10 s `wackel_bis` |

- Ein Zauber je 20 s, Mana nötig, Schutzregeln wie beim Treffer (Mitspielen, Anfängerschutz, Tarnung, kaputt, Waffenstillstand, Duell, 60 je Minute). Magie geht an der Rüstung vorbei; Eisenhaut halbiert, Dämonisch zählt.
- `spiel_treffer` liest `wackel_bis`/`nebel_bis` des Schützen; `spiel_oeffentlich` liefert `nebel_s`/`wackel_s` (Restsekunden), damit Nachzügler den Nebel sehen.
- Client: Zauberstab in der Schnellleiste → Zauberrad (gesperrte zeigen „Lv N"), Zauber wählen → Tipp auf ein Gesicht. Ereignis `zauber` an alle. Nebel als Ring ums Bild (Mitte frei), eigener Nebel macht die anderen unscharf. Erdbeben 3,6 s, Orkan 3,8 s – so lang wie die Töne `erdbeben`/`orkan` (4 s, vorgeladen).
- Meldungen rücken über ein offenes Rad, statt es zu verdecken.
- Sonde: `pruefe-650-zauber.js` (22 Prüfungen, Telefon mit Fingertipps); Server im Rollback getestet.

## Fassung 651 — Aussprache mit sauberer Stimme, Mauer, Android-Menü, Controller-Ei

- XANDER: „was meinst du mit Alex Aufnahmen? Wir haben die doch rausgenommen … weil sie teilweise englisch ausgesprochen wurden." Die Aussprache-Karte im Spiel (648) spielte die eigenen Aufnahmen (`aussprache/…mp3`). Jetzt spricht dieselbe saubere Stimme wie im Aussprachekurs vor: `window.DMA_AUSSPR_BRUECKE.original(wort)` in app.js → `aussprSpriteLadenOderAzure` (Sammeldatei, sonst Azure). Verglichen wird mit `freieBewertungAusPuffern`. Die Sonde 648 prüft, dass keine eigene Aufnahme mehr geladen wird.
- XANDER: „die Mauer verdeckt … unseren Lebensstand … und unser kleines Fellmonster". Die Mauer ist halb so hoch (unterstes Siebtel) und liegt hinter Ringen und Tieren (z: Mauer 5 · Ringe 6 · Tiere/Turm 9).
- XANDER: „im Android immer noch abgeschnitten rechts … ein kleines Ei mit dem Gaming Controller … das Burger Menü eher oben drüber". Das Controller-Ei ganz links ist der Menüknopf, das Menü klappt darüber auf. Leiste und Menü sind höchstens so breit wie der Chat-Rahmen. „Mehr → Leiste einklappen" lässt nur das Ei stehen.
- XANDER: „ich habe immer noch nicht das Tacho Menü". Die angelegte Waffe trägt einen kleinen Tacho; der Hinweis beim Anlegen sagt „Nochmal auf die Waffe tippen: Waffenrad".
- XANDER: „Schutz und Laden … springt der Link wieder hinter den Frame". Die Reiterleiste im großen Menü behält ihre Stelle, der gewählte Reiter steht immer ganz im Bild.
- Sonde: `pruefe-651-mauer-menue.js` (15 Prüfungen, 360 px Android, echte Fingertipps; auf dem alten Stand 11 rot).

## Fassung 652 — Spiel nur für Mitspieler, Töne, Controller-Knopf, Waffenrad nach Klassen, Doppeltipp, Kanone

- XANDER: „bist du dir sicher, dass die anderen normalen Chat Teilnehmer die spielenden nicht sehen … wirklich so intern". Bisher sah jeder Angemeldete Ringe, Mauern, Tiere, Schüsse und Zauber. Jetzt gilt `spielSichtbar()` = eingeloggt UND „Mitspielen" an: sonst keine Spielbilder an den Plätzen, keine Ereignisbilder, keine Töne (Ausnahme: man bedient gerade selbst das Spielmenü). Offen: Das Platzwechseln (Ausweichen) sehen alle – dafür braucht es eigene Spielplätze.
- XANDER: „ein Menü, wo man die Sounds … regeln kann". „Mehr" → Töne: aus / leise / mittel / laut (gemerkt, `dma_spiel_laut`; Master-Gain 0,62 × Stufe).
- XANDER: „ein kleines viereckiges Symbol mit dem Game Controller". Der Menüknopf ganz links ist ein eckiger Controller-Knopf; das Menü klappt darüber auf.
- XANDER: „welcher Regelung folgt das?" Waffenrad neu: volles Rad (position: fixed, nie abgeschnitten), vier farbige, beschriftete Sektoren im Uhrzeigersinn ab oben – Standard, Lustig, Arcade, Stark –, in jedem Sektor stärker werdend.
- XANDER: „wenn man sich selbst doppelt antippt … die Waffe wechselt … dreimal tippen irgendwas anderes". 2× aufs eigene Bild = Waffe 1 ↔ 2; 3× = Makro nach Wahl („Mehr": Heilen / Superkraft / Zauberrad). Der erste Tipp geht wie immer an die App (dort tut er auf dem eigenen Bild nichts).
- XANDER: „die Kanone feuert nicht … nicht animiert". Sie feuert als Gegenwehr, wenn man selbst getroffen wird (20 Schuss auf Stufe 3 bei Xander). Jetzt sichtbar: der Turm dreht sich zum Angreifer, ruckt zurück, Mündungsfeuer.
- Sonden: `pruefe-652-intern-rad-tippen.js` (15 Prüfungen, Android 360 px); 645 scrollt im längeren „Mehr" wie ein Mensch; 17 Spiel-Sonden grün.

## Fassung 653 — Tiere neu gezeichnet

XANDER: „überarbeite mal den Baby Fuchs und den Schäferhund … nicht alle nur so Dreiecks oder Kreisköpfe" · „das Einhorn und den Phoenix besser gestalten … die Form bisschen realistischer … richtig süß und liebreizend".

- Kleiner Fuchs: sitzendes Fuchsjunges mit Fuchskopf (breite Wangen, spitze Schnauze, weiße Maske), großen Ohren mit schwarzen Spitzen, Lätzchen, dunklen Söckchen, Schwanz mit weißer Spitze um die Pfoten.
- Schäferhund: von vorn sitzend, Stehohren, langer Fang mit schwarzer Maske, Brauenflecken, schwarzer Sattel, heller Brustlatz, Zunge, buschige Rute.
- Einhorn: kleines Pony im Profil (Pferdekopf, weiche Schnauze, Wimpern, gedrehtes Goldhorn, Regenbogenmähne und -schweif, schlanke Beine, Goldhufe).
- Phönix: schlanker Feuervogel im Flug (Hakenschnabel, Flammenschopf, erhobene Flammenschwingen rot → orange → gelb, drei lange Schwanzfedern mit Pfauenaugen, Glut).
- Kacheln mit etwas mehr Luft (Stehohren, Horn). `schmuck()` lässt beim Neuzeichnen die Klasse `sp-feuert` stehen (sonst brach das Turmfeuer ab, gefunden von Sonde 652).
- Bildprobe: `pruefe-653-tiergalerie.js` (BILD=… für ein Bild von Kacheln und Tieren am Platz).

## Fassung 654 — deutsche Zauber, Zauberer-Ränge, Fairness

XANDER: „ein Mückenschwarm losschicken … typische deutsche Krankheiten … jemanden verwandelt in irgendwas anderes … Stopft den Gegner mit Brezeln voll" · „wie können wir den Zauberlehrling oder die einzelnen Stufen des Zauberers … entwickeln" · „ob es da so einen Fairnessfaktor gibt".

| Zauber | Level | Mana | Wirkung (Server `spiel_zaubern`) |
|---|---|---|---|
| Brezelflut | 2 | 20 | 6 Schaden (Mauer fängt), 10 s vollgestopft: nur alle 6 s ein Schuss (`brezel_bis`) |
| Nebel | 3 | 25 | 15 s Schüsse streuen, 60 % Schaden |
| Kaffeeklatsch | 4 | 30 | +20 LP für den Eingeladenen und für einen selbst; auch auf sich selbst |
| Mückenschwarm | 4 | 30 | 10 Schaden, über jede Mauer |
| Erdbeben | 5 | 35 | 10 Schaden an der Mauer vorbei, −25 Mauer, 6 s Zittern |
| Hexenschuss | 6 | 40 | 4 Schaden, 20 s kein Platzwechsel (`spiel_platzwechsel` darf=false, Client `gesperrt()`), Bild sitzt schief |
| Orkan | 7 | 50 | 15 Schaden, Schild weg, wirbelt vom Platz |
| Gartenzwerg | 9 | 60 | 12 s kein Schuss, kein Zauber; Zipfelmütze und Bart (Gesichtsmitte frei) |
| Behördengang | 12 | 70 | kein Schuss, bis eine Deutschaufgabe richtig gelöst ist (höchstens 60 s; `spiel_antwort` löscht `formular_bis`) |

- Zauberer-Ränge aus der Zahl gelungener Zauber: Zauberlehrling (0), Zaubergeselle (10), Magier (30), Zaubermeister (75), Erzmagier (150). Je Rang −5 % Mana, +10 % Wirkung und Dauer. Rang steht in der Mitte des Zauberrads und in „Mehr"; ein Aufstieg wird gefeiert.
- Fairness (`spiel_fair`): ab 5 Level Abstand macht der Stärkere halben Schaden und bekommt keine Punkte; der Kleinere macht 25 % mehr. Gilt für Treffer und Zauber.
- Zauberrad: volles Rad wie das Waffenrad, neun Zauber nach Level im Uhrzeigersinn, gesperrte mit „Lv N".
- Töne neu (ElevenLabs, weich): muecken, kaffeeklatsch, hexenschuss, gartenzwerg, stempel; Brezelflut nutzt brezelknack. 329 Geräusche.
- Sonde: `pruefe-654-deutsche-zauber.js` (15 Prüfungen); 650 und 651 angepasst; 18 Spiel-Sonden grün. Server im Rollback getestet (Fairness 0,5, Mauer, Hexenschuss-Sperre, Zwerg- und Formular-Sperre, Kaffeeklatsch +20/+20).

## Fassung 655 — Controller = Mitspielen, Doppeltipp sofort, lang drücken = Zauberrad, Superkraft spürbar, Kanonenrohr zielt

- XANDER: „Der Gaming Controller bedeutet doch schon spielen … leuchtet er schon grün … über dem Controller im Burger Menü". Der Controller-Knopf IST „Mitspielen" (grün = an, Tipp = Pause); der grüne Punkt ist weg; ☰ sitzt direkt darüber, das Menü klappt darüber auf. Das Einklappen der Leiste entfällt.
- XANDER: „Doppelklick ist Waffe umschalten. Das könnte aber bisschen schneller reagieren". Der zweite Tipp aufs eigene Bild wechselt SOFORT (vorher wartete er 430 ms auf einen dritten). Der Dreifachtipp entfällt.
- XANDER: „ein langes Drücken würde … das Zaubermenü aufrufen". Langer Druck aufs eigene Bild öffnet beim Mitspielen das Zauberrad (app.js `lcPlatzMenue` fragt `DMA_SPIEL.langAufEigen`); das Platzmenü gibt es dann unter „Mehr → Mein Platzmenü". Der Loslass-Klick schließt das Rad nicht mehr sofort.
- XANDER: „wo meine Superkraft aufgeladen ist, hat sich nicht das Gefühl, dass irgendwas passiert". Beim Auslösen: lila Doppelwelle vom Bild, der Bildschirmrand glüht lila, Gong + Knall, Erklärung (×1,5 austeilen, 70 % einstecken). Solange sie wirkt: lila-rote Flammen um das Bild; Treffer zeigen große lila Zahlen „×1,5".
- XANDER: „mit der Gummipuppe probiere ich das. Ich sehe kein Erdbeben". Zauber auf Puppe und Sparringspartner: Übung, gleiches Bild und gleicher Ton, kein Mana, kein Server.
- XANDER: „Warum hab ich da so viele Erdbeben und so viele Orkan". Die Zauber stehen nur noch im Zauberrad, nicht zusätzlich als Liste in „Mehr".
- XANDER: „diese kleine Kanonenrohr richtet sich nicht aus … zwei gelbe Punkte darunter". Der Sockel steht, nur das Rohr dreht sich zum Angreifer und ruckt zurück; Kugeln und Mündungsfeuer kommen aus der Rohrspitze. Die Stufe zeigt die Farbe (Eisen, Bronze, Silber, Gold mit Doppelrohr, Gold mit Glut) statt der gelben Punkte.
- XANDER: „was bedeutet das grüne Symbol". Waffenrad: kräftigere Klassenfarben, in der Mitte „angelegt: Name", die angelegte Waffe mit Goldring und Haken.
- Sonde: `pruefe-655-superkraft-kanone.js` (10 Prüfungen); 650, 651, 652, spielsystem an den neuen Aufbau angepasst; 19 Spiel-Sonden grün.

## Fassung 656 — Phönix mit eigenem Sturzflug, Fellmonster beißt fest und zerrt

- XANDER: „den Schwanz von dem Phoenix … feiner … filigraner, nicht so weit auseinander". Fünf dünne, dicht geführte Schleppfedern (rot → gelb) mit kleinen Flammenaugen, die leicht wehen.
- XANDER: „ich möchte, dass der Phoenix eine eigene Effekt-Animation hat, dass das nicht gleich aussieht mit dem von dem Baby-Drachen". Der Phönix steigt über das Bild und stürzt dreimal über Kreuz als Feuerschweif hindurch, mit Glutspur und Goldfeuer; am Ende regnen goldene Federn. Der Drache kreist weiter mit Feuerstrahl.
- XANDER: „der kleine Fellkerl kann sich richtig fest beißen mit seinen Zähnen, so dass man sieht, dass er da dran reißt". Beim Biss schnappen Zähne am Bissort zu; das Tier zerrt sechsmal nach hinten, und das Bild des Gegners wird bei jedem Ruck mitgezogen (alle Bodentiere außer dem Einhorn, das mit dem Horn sticht).
- Sonde: `pruefe-656-phoenix-biss.js` (6 Prüfungen); 655 tippt ein zweites Mal, falls der erste Tipp nur den Rahmen ausrichtet.

## Fassung 657 — Level und Tiere auch ohne Spiel (Schalter)

- XANDER: „Wie ist es denn im normalen Modus? Können wir da irgendwie über den Schalter entscheiden, was wir anzeigen wollen kann man da unsere Level auch anzeigen wenn man mit normalen Leuten chatten oder Livestream machen ohne dass wir spielen … die find ich schon ganz süß … wenn die immer mit dabei sind".
- Menü → Mehr → „Auch ohne Spiel zeigen": zwei Schalter, **Level** und **Tiere**. Sie gelten für alle im Raum, auch für die, die nicht mitspielen. Standard: beide aus.
- Wer nicht mitspielt, sieht bei so jemandem nur das Schaufenster: die Levelzahl am linken Rand (wie im Ring, Gesichtsmitte frei) und die Tiere, friedlich atmend. Kein Ring, keine Mauer, kein Turm, keine Angriffe, keine Töne.
- Wer mitspielt, sieht wie bisher das volle Spiel; das Schaufenster verschwindet dort.
- Server: Spalte `spiel_spieler.zeigen` (jsonb), Funktion `spiel_zeigen(p_level, p_tiere)` (SECURITY DEFINER, nur angemeldet), `spiel_oeffentlich` liefert `zeigen` mit. Im Rollback getestet.
- Sonde: `pruefe-657-zeigen-ohne-spiel.js` (15 Prüfungen); alle 21 Spiel-Sonden grün.

## Fassung 658 — Superkraft am Gegner sichtbar, Feuer filigran, Deutsch-Reiter, erschöpfte Tiere, weniger Vermittler

- XANDER: „ich sehe keinen Effekt den es macht durch das Feuer, was ich auf den Gegner schicke, ob das irgendein Einfluss auf den Gegner hat". Hat es (×1,5 Schaden). Jetzt sichtbar: Mit Superkraft fliegt jede Kugel mit lila Feuerschweif (auch bei anderen, deren Stand `daemon` trägt); beim Treffer züngeln 14 lila Flammen in der unteren Bildhälfte des Gegners hoch, Glutfunken steigen, sein Bild glüht kurz lila, dazu das Drachenfeuer-Geräusch.
- XANDER: „mein Fell … irgendwie schwächer dargestellt. Woran liegt das? Verliert es an Leben". Ja: jeder Gegenbiss kostet das Tier 1 Kraft (spiel_treffer), bei 0 wehrt es nicht mehr ab. Erschöpft = grau mit aufsteigendem „Zzz"; im Tiere-Reiter steht der Grund und „Jetzt füttern".
- XANDER: „die Blasen … einfach nur Punkte die hoch und runter wandern — kann man das schöner gestalten". In den Ringen gleitet statt der Punkte ein weicher Lichtglanz durch die Flüssigkeit.
- XANDER: „diese Feuereffekte noch filigran … effektvoll". Drache und Phönix: zusätzlich zum Glutball schmale Flammenzungen (rot bzw. gold) und Glutfunken; der Feuerstrahl flackert an den Rändern. Die Flammen entstehen nur in der unteren Bildhälfte, das Gesicht bleibt frei.
- XANDER: „Irgendwie sieht man aus dem Bürger nicht sofort heraus, dass man die Deutsch Aufgaben machen kann". Eigener grüner Reiter „Deutsch" (Waffen · Heilen · Tiere · Deutsch · Mehr): „Aufgabe lösen" plus alle Aufgabenarten als Knöpfe; unter „Mehr" nicht mehr doppelt.
- Verbindung (Mark, Firefox/Linux laut spiel_diagnose): Mit eigenem Relais standen sieben Vermittler in der Liste; Firefox wird ab fünf langsam. Jetzt: Cloudflare + ein Google-STUN (`mitRelais` in livechat.js). Ohne eigenes Relais unverändert.
- Sonde: `pruefe-658-superkraft-feuer-deutsch.js` (20 Prüfungen); alle 22 Spiel-Sonden und Runde 27 (Relais) grün.

## Fassung 659 — Verbindung schneller, Spiel direkt von Gerät zu Gerät

- XANDER: „speziell auch die Geschwindigkeit von der Verbindung generell mit Leuten … bei HelloTalk geht es doch auch … wie wir … auch flüssig spielen können … optimiere alles was du rausholen kannst damit die Verbindungen in Zukunft schneller steht."
- Kerzen gebündelt (livechat.js `kerzeRaus`/`kerzeAnnehmen`): Die gefundenen Wege gehen 90 ms gesammelt als EIN Paket „kerzen" statt einzeln über den Supabase-Kanal (der steht auf 20 Nachrichten/s). Wer eine ältere Fassung hat (Pakete ohne `kf`), bekommt sie weiter einzeln. Gemessen: Aufbau mit 5 statt bisher 10+ Paketen.
- `iceCandidatePoolSize: 1`: Der Browser sammelt Wege schon beim Anlegen der Leitung.
- Wache alle 2 statt 4 s; bei „disconnected" folgt dem restartIce jetzt ein neues Angebot (vorher tat restartIce allein nichts).
- Relais höchstens 2,5 s abwarten; kommt es später, bekommen noch nicht stehende Leitungen die neue Liste (`setConfiguration`).
- Spiel-Datenkanal (`datenkanalAnlegen`, negotiated id 7, ungeordnet): Spielereignisse gehen zusätzlich direkt durch die Leitung, der Supabase-Weg bleibt als Sicherheit; Doppel werden an `gid` erkannt. Direkt gesendet wird erst nach „dc-hallo" der Gegenseite. Gerechnet wird weiter nur auf dem Server.
- Sonde: `pruefe-659-verbindung.js` — zwei echte Browser-Seiten, echte WebRTC-Leitung (steht in ~0,15 s lokal), Bündel, Datenkanal vor dem Server-Weg, keine Doppel, alte Fassung verbindet weiter. Alle 118 Chat-Sonden: gleiche 9 alte Rote wie vorher (2 wechselten, einzeln grün = Zeitlast im Parallellauf).

## Fassung 660 — Kleine farbige Bilder auf allen Kacheln

- XANDER: „hast du mal die kleinen SVG Grafiken gemacht für unseren Bagger und Schaufelradbagger und alle Sachen, die wir bei uns in den Profileffekten haben, dass die auf den Kacheln so ihre großen Version in ganz kleinen Miniatur sind auch in Farbe … damit das schöner aussieht und auch Wiedererkennungswert hat".
- 193 eigene Mini-Zeichnungen (32×32, farbig, gleiche Farben wie die großen Fassungen): Platzmenü (66/66), Transport (Schaufelradbagger, Bagger, Kran, Angel, Lasso), Reisen, alle Untermenüs (Werfen, Trommeln, Sport, Anziehen, Putzen, Bombe, Gesichter, Aufziehen …) und die Sprechbilder. „… 2"-Fassungen tragen das Bild ihres Vorbilds.
- `LC_MINI_BILD` + `lcMiniBilderSetzen` in app.js: zugeordnet über das Wort auf der Kachel, ein Wächter auf den direkten Kindern von body setzt die Bilder in JEDEM Menü, sobald es erscheint. Fehlt ein Bild, bleibt das Emoji (bewusst bei „Ups!" und „Klaps").
- Höhe genau eine Zeile wie vorher (1em), damit das Menü aufs Telefon passt (Runde-98-Sonden Blume/Leiter und Gesichter wieder grün).
- Sonde: `pruefe-660-kachelbilder.js` (6 Prüfungen, 360 px).

## Fassung 661 — Trophäen und Fundstücke auf dem Feld

- XANDER: „wenn man irgendwie Mission auch zusätzlich erfüllt, indem man den Gegner nur mit Hühnern vernichtet oder irgendwie so Aufgaben, wo man noch Trophäen bekommt … irgendwas raffiniertes".
- 16 Trophäen, gezählt auf dem Server (`spiel_trophaeen()`, Tabelle `spiel_trophaeen` mit RLS nur-lesen-eigene): Hühnerbaron (25 Hühnerwerfer-Treffer), Kartoffelkönig, Brezelbäcker, Bierkrug-Held, Scharfschütze (20 Kopftreffer), Unverwüstlich, Musterschüler (50 richtige Aufgaben), Grammatik-Genie (250), Hexenmeister (30 Zauber), Sanitäter, Schatzsucher, Glückspilz (10 Fundstücke), Tierfreund, Stammgast (7 Tage), Auftragsheld (10 Missionen), Deutsch-Profi (Level 10). Jede bringt einmalig 40–150 Punkte.
- Anzeige: Menü → Mehr → „Trophäen n/16" mit Fortschrittsbalken; eine neue Trophäe steigt als goldener Pokal über dem eigenen Bild auf (Jubel, Goldflammen). Nachgesehen wird gebündelt nach Treffern, Zaubern und richtigen Antworten.
- XANDER: „auf dem Feld … das darf man aber nur für sich sehen … zwischendurch ne Artikel Aufgabe, wo man auf dem Feld zwischendurch noch Sachen einsammeln kann". Fundstücke: alle 2–4 Minuten glitzert beim Mitspielen auf einem freien Platz ein Säckchen (nur auf dem eigenen Gerät, 45 s lang). Antippen → `spiel_fund_heben()` (höchstens alle 3 Minuten, der Server wählt den Inhalt: Erz, Bratwurst, 15 Mana, 10 Punkte, Pflaster, 20 % Superkraft) → Artikel-Aufgabe; richtig gelöst, schreibt `spiel_antwort` den Fund gut. Danach gilt wieder die eigene Aufgabenwahl.
- Server im Rollback getestet (6 Trophäen für XanderFox erkannt, Fund-Sperre, Gutschrift bei richtiger Antwort).
- Sonde: `pruefe-661-trophaeen-funde.js` (13 Prüfungen, 360 px); alle Spiel-Sonden grün.

## Fassung 662 — Das Dorf, Titan- und Diamantmauer, Wassergraben, Turm auf freiem Platz

- XANDER: „was man für Gebäude bauen kann um welche Sachen zu machen für Ausbildung oder für Lebensmittel … uns irgendwie auch so ein kleines Dorf bauen können, was vielleicht auch angegriffen werden kann von dem anderen, dass unsere Infrastruktur geschädigt wird … oder seine Sachen … repariert werden können."
- Mehr → „Mein Dorf": Bäckerei (100/200/300 P, 2 Bratwürste je Stufe), Schule (ab Level 4, 150/300/450 P, 20 Erfahrung je Stufe), Schmiede (120/240/360 P, 1 Erz je Stufe). Alle 4 Stunden „Ernten" (`spiel_dorf_abholen`). Jedes Gebäude hält 20 je Stufe.
- Angreifbar: Ein Erdbeben reißt ein zufälliges Gebäude an (−10). Ein kaputtes liefert nichts, bis es mit 1 Erz repariert ist. Der Getroffene wird gewarnt, der Angreifer erfährt, was er getroffen hat.
- XANDER: „kann mir noch ne Titanium Mauer machen irgendwie oder Diamanten". Titanmauer (ab Level 8, 130 P, hält 260) und Diamantmauer (ab Level 12, 200 P, hält 400), eigene Zeichnungen (Titanplatten mit Nieten, funkelnde Kristallblöcke).
- Wassergraben (60 P): fängt 5 Erdbeben ab, Mauer und Dorf bleiben heil; liegt als blaues, welliges Band unter dem Bild.
- Turm auf freiem Platz: Laden → Geschütz-Turm → „Auf freien Platz", dann auf einen freien Platz tippen (`spiel_turm_platz`, gilt nur im aktuellen Raum). Der Turm steht dort groß in der Mitte, schießt von dort zurück; setzt sich jemand hin, steht er wieder am eigenen Bild. „Zurück ans Bild" holt ihn heim.
- Server: Spalten `dorf`, `dorf_ab`, `graben_lp`, `turm_platz`, `turm_raum`; `spiel_bauen`, `spiel_dorf_abholen`, `spiel_turm_platz`; `spiel_kaufen` (Titan, Diamant, Graben, Level-Sperre), `spiel_zaubern` (Graben, Dorf-Riss), `spiel_oeffentlich` (graben, turm_platz, turm_raum, dorf). Im Rollback getestet.
- Sonde: `pruefe-662-dorf-mauern-turm.js` (15 Prüfungen, 360 px); alle Spiel-Sonden grün (652/656 einzeln, im Parallellauf zeitweise zu langsam).

## Fassung 663 — Klassen wie auf der Webseite, Deutschland-Wissen

- XANDER: „kann man in anderen Klassen spielen? … wie wir das in unserem Hauptsystem haben auf der Webseite, dass man als Deutsch Profi spielt". Fünf Klassen nach der Stärke im Deutschen, benannt wie die Charaktere der Webseite:
  - Grammatik-Profi (Artikel, Fälle, Präpositionen, das/dass, ss/ß …): +50 % Erfahrung und +1 Punkt
  - Sprachkünstler (Aussprache, Betonung, Stimmt's?, Wortpaare …): +50 % Erfahrung und +4 Mana
  - Logiker (je…desto, Relativsätze, Konnektoren, als/wie …): +50 % Erfahrung, Zauber 10 % billiger
  - Wissenschaftler (Deutschland-Wissen): doppelte Erfahrung und +2 Punkte
  - Abenteurer: +20 % Erfahrung überall, Fundstücke nach 2 statt 3 Minuten
- Ab Level 5 in Mehr → Klasse; erste Wahl frei, Wechsel 50 Punkte, einmal am Tag. Die Klasse steht oben im Menü neben dem Level und im Ring-Tooltip bei den anderen. Gerechnet auf dem Server (`spiel_klasse`, `spiel_antwort`, `spiel_zaubern`, `spiel_fund_heben`).
- Deutschland-Wissen: 51 geprüfte Landeskunde-Fragen (A1–B2: Hauptstadt, Flüsse, Bundesländer, Feiertage, Geschichte, Politik, berühmte Deutsche, Alltag wie Pfand und Sonntagsruhe), Kategorie „deutschland", im Deutsch-Reiter als eigener Knopf.
- Im Rollback getestet (Wahl, Wechsel-Sperre, Wissenschaftler +2 Punkte/doppelte EP bei einer Deutschland-Frage).
- Sonde: `pruefe-663-klassen-deutschland.js` (9 Prüfungen); Spiel-Sonden einzeln grün.

## Fassung 664 — Meisterwaffen ab einem Level

- XANDER: „Updates ab einem bestimmten Level irgendwelche Sachen, die dann freigeschaltet werden können, die wir sonst nicht haben".
- Drei typisch deutsche Meisterwaffen: Weißwurst-Bumerang (ab Level 6, 85 P, 14 Schaden, hoher Bogen und dreifache Drehung), Nudelholz (ab Level 8, 110 P, 18 Schaden, rotiert, „Holzklopf"), Kuckucksuhr-Bombe (ab Level 10, 160 P, 24 Schaden, tickt im Flug, großer Einschlag mit „Kuckuck!" und Goldfunken).
- Im Laden bis zum Level gesperrt („ab Level N"), im Waffenrad als eigener goldener Sektor „Meister", im Waffen-Menü als Gruppe „Meister".
- Server: `spiel_waffe_schaden`, `spiel_treffer` (Abnutzung), `spiel_kaufen` (Preis, Level-Sperre). Im Rollback getestet (Kauf, Treffer mit Fairness-Faktor).
- Sonde: `pruefe-664-meisterwaffen.js` (5 Prüfungen); alle Spiel-Sonden grün (auch parallel).

## Fassung 665 — Tier-Fusion

- Funk: „Fusion". Zwei eigene Tiere, beide ab Stufe 2, verschmelzen zu einem neuen, stärkeren Tier (200 Punkte, ab Level 6). Die beiden Zutaten gehen im neuen Tier auf; das neue startet mit Stufe 1 und voller Kraft und kommt sofort raus.
  - Feuerfuchs (Boden) = Fuchs + Phönix: beißt mit Glut, 45 % zurück, ab Stufe 2 +2 Glut; Flammen am Biss.
  - Greif (Luft) = Eule + Schäferhund: Adlerkopf, Löwenleib, 50 % zurück, ab Stufe 2 warnt er (1/10 weniger Schaden).
  - Regenbogendrache (Luft) = Babydrache + Einhorn: Regenbogenfeuer, 55 % zurück, ab Stufe 2 heilt er (+3 LP).
- Reiter Tiere → Abschnitt „Fusion": jedes Rezept mit Bildern der Zutaten (grau, solange sie fehlen oder zu schwach sind), der Knopf sagt, was fehlt. Nachfrage vor dem Verschmelzen. Fusionstiere stehen nicht zum Kaufen da.
- Feier: beide Tiere fliegen über dem eigenen Bild zusammen, drehen sich umeinander, Lichtblitz mit Ton genau im Moment der Verschmelzung, dann erscheint das neue Tier.
- Drei neue Zeichnungen, jede ganz in ihrer Kachel (geprüft mit getBBox).
- Server: `spiel_fusion(p_rezept)` (neu), `spiel_tier_max`, `spiel_tier_wechseln` (Greif/Regenbogendrache fliegen), `spiel_treffer` (Gegenwehr, Warnung, Heilung). Im Rollback getestet (Fuchs draußen + Phönix im Besitz → Feuerfuchs draußen, beide Zutaten weg, 200 Punkte abgezogen; fehlende Stufe 2 wird abgelehnt).
- Sonde: `pruefe-665-tier-fusion.js` (14 Prüfungen, 360 px). Alle Spiel-Sonden grün (in Vierergruppen; 28 gleichzeitig sind dem Rechner zu viel). `pruefe-658` misst jetzt vor dem Foto (das Glühen hält nur 1,3 s).

## Fassung 666 — Xanders Fehlerliste vom 25.09. nachmittags

- **Effekte links oben** („da wo Deutsch mit Alex steht"): Lief ein Angriff, während das Klassenzimmer nicht zu sehen war (anderer Bereich offen), hatte jeder Platz die Größe 0 an der Stelle 0|0 – Geschoss, Flammen, Einschlag, Tier und Kratzer landeten links oben. `mittelpunkt()` gibt dann nichts mehr zurück; es wird nicht gezeichnet. Nachgestellt und geprüft.
- **Schaufel ging nicht**: Der Wassergraben (662) hieß `.sp-graben` – dieselbe Klasse bekommt der `body`, wenn man die Schaufel nimmt. Die ganze Seite war dann `pointer-events: none` und `position: absolute` (nichts tippbar, Leiste verrutscht). Der Graben heißt jetzt `.sp-wassergraben`.
- **Schaufel schneller**: lange auf einen freien Platz drücken = Schaufel nehmen, noch einmal lange drücken = weglegen (statt des Reise-Menüs, solange man mitspielt).
- **„Waffe anlegen" trotz angelegter Waffe**: Der Satz in der Übersicht richtet sich jetzt danach, ob eine Waffe angelegt ist.
- **Pokale übereinander**: Beim ersten Mal kamen 6 Trophäen auf einmal (Server: 13:40) – das waren 6 Feiern hintereinander über dem Bild und dem Menü. Jetzt ein Pokal und eine Meldung („6 Trophäen: …"); nur eine Abfrage zur Zeit.
- **Lange Namen**: unter dem Platz immer eine Zeile, Ende mit „…" (der volle Name bleibt im Text).
- **Werkstatt**: holt `data-werkstatt.js` frisch nach – beim Öffnen, beim Zurückkehren in den Tab und alle drei Minuten.
- **Deutsch-Menü wie vorher**: der grüne Reiter führt direkt ins große Deutsch-Menü; unter „Mehr" steht wieder „Deutsch-Aufgaben".
- Sonde: `pruefe-666-fehler.js` (13 Prüfungen, 360 px); `pruefe-658` auf das alte Deutsch-Menü umgestellt. Alle Spiel-Sonden grün (642/656 unter Last bei Tönen zeitweise zu langsam, einzeln grün).

## Fassung 667 — Kampf ohne Nachhängen, flüssige Tiere, runde Mauern, echter Orkan

- XANDER: „Die Latenz ist noch schwierig … ohne dass die Effekte hinterher hängen … die Tiere nicht mitziehen man gar nicht weiß, wohin man schießt".
  - Gemessen (Server 400 ms): die Treffer-Zahl kam 465 ms NACH dem Einschlag – gefragt wurde erst beim Einschlag. Jetzt geht die Frage schon im Flug los (so früh, wie der Server gerade braucht; gleitender Mittelwert), gezeigt wird genau beim Einschlag: 465 → ~0 ms (erster Schuss ~90 ms, bis die Messung eingeschwungen ist). Die Treffer-Meldung geht im Moment des Einschlags an die anderen – dort landet ihr Geschoss gleichzeitig.
  - Ruckeln (CPU achtfach gedrosselt, wie ein einfaches Android): Phönix und Drache halbierten die Bildrate, und zwar durch die Feuerteilchen. Jetzt ein gemeinsames Teilchen-Budget (30, bei Rucklern 14 – das Spiel misst es selbst), die Phönix-Glutspur seltener, fliegende Tiere auf eigener Ebene. Gleiche Szene: ~73 → ~110 Bilder; schnelle Geräte bleiben bei 60 Bildern pro Sekunde mit allen Teilchen.
- Mauern als filigraner Bogen unter dem Ring (XANDER: „Holzstriche … Diamant … Gläser … glitzert … Titan durchgängig … Steinmauer durchgängige Blöcke"): Holz = Lattenzaun, Stein = versetzte Blöcke, Stahl = Band mit Nieten, Titan = gebürstetes Band, Diamant = Glasfacetten, die funkeln. Mit Brustpanzer rückt der Bogen nach außen und lässt unten Platz für den Namen.
- Orkan (XANDER: „sieht nicht aus wie ein Orkan und … wirbelt … nicht herum"): Trichter aus 11 drehenden Luftringen, schwankend, mit kreisenden Blättern und Staub; der Getroffene wird sichtbar hochgehoben, dreimal herumgewirbelt und landet federnd wieder.
- Sonde: `pruefe-667-latenz.js` (7 Prüfungen). `pruefe-651` misst die Mauer als Bogen; `pruefe-654` schließt vor dem Tippen das Deutsch-Fenster. Alle Spiel-Sonden grün.

## Fassung 668 — Energie-Waffen, Ziegelmauer, neue Tiere und Fusionen, mehr Gebäude

- XANDER: „mehr Laser Arten … wie kann man zwischen diesen Salven und multiple Feuern unterscheiden? … Kugelblitz". Neue Klasse „Energie" (eigener Sektor im Waffenrad), im Laden steht jeweils die Art:
  - SALVE = mehrere Schüsse nacheinander (Laser-Salve, MG, Spätzle – wie bisher)
  - Doppellaser (Lv 4, 70 P, 15 Schaden): MEHRFACHFEUER – zwei Strahlen gleichzeitig, Ton „laserblau"
  - Fächerlaser (Lv 6, 120 P, 17): MEHRFACHFEUER – fünf bunte Strahlen im Fächer
  - Plasmastrahl (Lv 8, 150 P, 20): DAUERSTRAHL, der anschwillt und brummt
  - Kugelblitz (Lv 11, 190 P, 26): knisternde Elektrokugel im Zickzack, beim Einschlag drei Blitze und Donner („gewitter")
- Ziegelmauer (32 P, hält 65): viele kleine rote Ziegel mit hellen Fugen, als Bogen unter dem Ring.
- Neue Tiere: Dackel (Boden, 110 P, zerrt, 25 %) und Storch (Luft, 170 P, pickt, 35 %). Neue Fusionen: Wolpertinger (Dackel + Fee: Hasenleib, Geweih, Flügel, 50 %) und Lindwurm (Babydrache + Stachelmonster: Schlangenschwanz, goldene Flügel, speit Feuer, 60 %).
- Dorf (XANDER: „Wir brauchen noch mehr Gebäude"): Brauerei (Lv 5, 15 Mana je Stufe), Bibliothek (Lv 6, 30 Erfahrung je Stufe), Rathaus (Lv 8, 15 Punkte je Stufe); die Ernte nennt alles.
- Server: `spiel_waffe_schaden`, `spiel_treffer` (Abnutzung, Tiere), `spiel_kaufen` (Preise, Level-Sperren, Ziegel, Tiere), `spiel_tier_max`, `spiel_tier_wechseln`, `spiel_fusion`, `spiel_bauen`, `spiel_dorf_abholen`. Im Rollback getestet (Kugelblitz, Ziegelmauer 65, Dackel, Wolpertinger, Lindwurm, Rathaus-Ernte +15).
- Sonde: `pruefe-668-energie-tiere-dorf.js` (15 Prüfungen); `pruefe-665` erwartet jetzt 5 Rezepte. Alle Spiel-Sonden grün.

## Fassung 669 — Extra-Spiele: Tower Defense und Rundenkampf

- XANDER: „du solltest einen Strategie Modus einbauen, wo wir dann mit Zügen so spielen kann und ein Tower Defense Modus. Das extra Spiele". Menü → Mehr → Extra-Spiele.
- Tower Defense „Fehlerteufel-Abwehr": Fehlerteufel mit typischen Fehlern („der Mädchen", „seid 3 Jahren", „wegen dem" …) laufen einen Weg zum Tor. Türme: Kartoffelkanone (2 BP), Laserturm (3 BP), Brezel-Bremse (3 BP, bremst). Baupunkte für richtige Deutsch-Antworten (+3, vom Server geprüft), jeden zweiten Teufel (+1) und jede geschaffte Welle (+2). 10 Wellen, 10 Leben, Rekord im Gerät.
- Strategie „Rundenkampf": Zug um Zug gegen Professor Grammatikus (Computer) oder gegen jemanden im Raum (Einladung, Annehmen/Ablehnen). Aktionen Angriff (12), Schild (+10), Heilen (+12), Donnerwort (22, kostet 2 Sterne) – jede wirkt nur mit richtiger Antwort, jede richtige Antwort bringt einen Stern. Züge laufen als Ereignisse zwischen den Geräten (doppelt angekommen zählt einmal); wer schließt, gibt auf.
- Nichts davon zählt in der Datenbank (außer den echten Deutschaufgaben selbst) – so lässt sich nichts schummeln. Meldungen erscheinen im Spielfenster.
- Sonde: `pruefe-669-extraspiele.js` (15 Prüfungen). Alle 32 Spiel-Sonden grün.

## Fassung 670 — Jedes Tier mit eigenem, starkem Effekt (Einhorn als Deluxe)

- XANDER (Funk 132): „Verbessere bitte mal das Einhorn und das Effekt vom Einhorn es ist sein Deluxe Tier … die Tiere die so teuer sind die müssen irgendwie glänzen … die Tiere die man kauft die sollen alle einen individuellen schönen starken Effekt".
- Einhorn: Regenbogenstrahl aus dem Horn, drei Farbringe, Sternenregen, „Glitzer!"-Puff und ein Glanz um das Tier beim Sprung (ebenso der Regenbogendrache).
- Jedes gekaufte Tier hat eine eigene Signatur: Stachelmonster schießt Stacheln, Schäferhund bellt Schallwellen („Wuff!"), Dackel knurrt („Grrr!"), Füchse und Wolpertinger funkeln, Fellmonster stampft, Eule und Greif verlieren Federn, Storch klappert („Klapper!").
- Alles läuft über das gemeinsame Teilchen-Budget (Fassung 667), bleibt also auch auf einfachen Android-Geräten flüssig.
- Sonde: `pruefe-670-tier-effekte.js`. 638, 646, 656, 667 weiter grün.

## Fassung 671 — Zauber und Superkraft, die man spürt; kein Nachhängen beim Zaubern

- XANDER (Funk 132, zweiter Teil): „verbessere dabei auch den Effekt der Schüsse wenn man mit der Superkraft schießt … den Sound zu jeder Superkraft … die Animation von den Zauberkräften … die können wir zehnmal so geil machen dass sie richtig effektiv wird … immersiv … wenn zwei Leute miteinander spielen … dass die Bilder nicht irgendwie eine Sekunde zurückhängen".
- Superkraft-Schuss: jeder Abschuss knallt (Peitschenknall), lila Mündungsring, dunkle Flammen am eigenen Bild, die Kugel ist größer; beim Aufprall ein lila Krater-Blitz, zwei Druckwellen und ein dumpfer Schlag – genau beim Einschlag (gemessen: Flug 620 ms, Krater bei 627 ms).
- Jeder Zauber in drei Teilen:
  1. Beschwören SOFORT beim Tippen: drehender Zauberkreis mit Runen und Sechsstern unter dem eigenen Bild, Ton „feenzauber".
  2. Eine leuchtende Kugel in der Farbe des Zaubers fliegt mit Funkenschweif zum Ziel – so lange, wie der Server gerade braucht. Die anderen bekommen „zauberstart" sofort und sehen Kreis und Kugel gleichzeitig; die Wartezeit auf den Server ist jetzt Flugzeit statt Stillstand.
  3. Einschlag: Lichtblitz, zwei Druckwellen, Sterne, das Bild leuchtet in der Zauberfarbe; wer getroffen ist, sieht den Bildschirmrand leuchten, bei Schaden ruckt der Raum. Der Ton des Zaubers beginnt genau beim Einschlag.
- Zugaben: Erdbeben mit Felsbrocken, Bodenwellen und Nachbeben; Brezelflut 14 Brezeln und „Mahlzeit!"; Mückenschwarm 20 Mücken; Kaffeeklatsch steigende Herzen; Hexenschuss ein lila Blitz und „Aua, mein Rücken!"; Gartenzwerg Zauberstaub und „Plopp!"; Behördengang ein Stempel „ANTRAG!" und wirbelnde Formulare; Nebel dichter.
- Lehnt der Server ab, verpufft die Kugel – auch bei den anderen („zauberab").
- Sonde: `pruefe-671-zauber-superkraft.js` (22 Prüfungen). `pruefe-650/654/655` warten jetzt den Flug der Kugel ab. Alle 36 Spiel-Sonden grün.

## Fassung 673 — Wassergraben nur einmal, Deutsch-Fenster kompakt, Fundstück immer erreichbar

- XANDER: „der Wassergraben … egal wo ich mich hinsetze, taucht der plötzlich auf … ich hab den hier zweimal". GEFUNDEN: seit 666 heißt er `sp-wassergraben`, beim Aufräumen verlassener Plätze wurde aber noch `sp-graben` gesucht – er blieb an jedem alten Platz liegen. Ebenso die Dämonenflammen. Beides wird jetzt weggeräumt.
- XANDER: „wenn ich im Deutsch Lernmenü bin und dann taucht oben plötzlich was zum einsammeln auf dann komme ich nicht schnell genug … beim klicken auf das leere im Hintergrund … direkt auf das Hauptmenü … Kartoffel angelegt … Diese Zeile könnte man rausnehmen … komprimieren".
  - Liegt ein Fundstück auf dem Feld, leuchtet oben im Deutsch-Fenster „Fundstück" und in der Schnellleiste ein Säckchen; ein Tipp hebt es auf, die Artikel-Aufgabe kommt gleich im Fenster.
  - Ein Tipp neben das Fenster schließt es (und wirkt dort, wo er landet); ☰ oben führt direkt ins Hauptmenü.
  - Status in einer Zeile (LP, Level, Mana), Werte in einer Wischzeile; die „… ist angelegt"-Zeile ist weg. Im Deutsch-Reiter steht die Aufgabe oben, Niveau und Arten darunter.
- Sonde: `pruefe-673-graben-deutschfenster.js` (9 Prüfungen). Alle 37 Spiel-Sonden grün.

## Fassung 675 — Ein Punktesystem: Klassenzimmer-Spiel zählt im Ranking der Seite

- XANDER: „Das, was die Leute in dem Livestream Spiel machen muss Ihnen alles belohnt werden in ihrem ganz normalen Rankings. So können Sie auch Fuchs des Tages werden … ich bin schon Level 14, und es macht sich in meiner Gesamtpunktzahl irgendwie überhaupt noch nicht bemerkbar … Alles was wir jetzt bisher schon verdient haben, dass das alles mit angerechnet wird".
- Datenbank (Migrationen `spiel_675_*`): Trigger `spiel_verdient_ins_ranking` auf `spiel_spieler.verdient`. Jeder echte Spielgewinn (Deutschaufgaben, Aussprache, Missionen, Trophäen, Lehrernoten, Extra-Spiele) geht 1:1 in `profiles.points` (Gesamt), `results` (eine Zeile „Klassenzimmer-Spiel" je Tag → Heute-Ranking und Fuchs des Tages/Woche/…) und `daily_ranking`. `seiten_stand` steigt mit, damit `spiel_seite_abholen` nichts zurücktauscht. `spiel_seite_gutschrift` ist für Browser gesperrt.
- Nachgebucht (aus `spiel_protokoll`, tageweise): XanderFox 5290 (Profil 5831 → 11121), Maram 4292, Emy 162. Geprüft: Spielzeilen = verdient bei allen drei.
- Extra-Spiele: `spiel_extra_lohn` am Ende von Tower Defense und Rundenkampf – aus den richtigen, vom Server geprüften Antworten seit Spielbeginn (2 je Antwort + Ergebnis), je Spiel höchstens 25, je Tag 60, jeder Spielbeginn nur einmal. Ohne richtige Antwort kein Lohn.
- Seite: der Fuchs-Bonus las einen veralteten Punktestand und hätte Spielpunkte überschrieben – er liest jetzt frisch.
- Sonde: `pruefe-675-punkte-ranking.js` (5 Prüfungen); Datenbank im Rollback geprüft (Profil +10, seiten_stand +10, Heute +10, Tagesstand +10, Extra-Lohn +6 und nur einmal, kein Rücktausch).

## Fassung 676 — Verkaufen und sichtbare Rüstung

- XANDER: „Wenn man sich Dinge kauft und die nicht mehr haben möchte, weil man sich etwas anderes Besseres kaufen möchte, dann gib den Benutzern die Möglichkeiten die Waffen zu zerstören und das Geld dafür zu bekommen".
  - Server `spiel_verkaufen`: Waffe = halber Kaufpreis × Zustand (mindestens 5), Tier = halber Preis (Fusionstiere 100), Helm/Brustpanzer = eine Stufe zurück für den halben Stufenpreis. Startwaffen bleiben. Der Erlös geht auf die Spielpunkte, NICHT auf „verdient" – kein Punkten im Ranking durch Kaufen und Verkaufen. Im Rollback geprüft (Bazooka +74, Drache +125, Helm Stufe 3 +45, verdient und Profil unverändert).
  - In den Reitern Waffen, Tiere und Schutz: „Verkaufen · +N"; erster Tipp fragt „Wirklich?", zweiter verkauft.
- XANDER: „dass die Rüstung, die wir uns kaufen sichtbar ist, dass sie angelegt wird". Statt eines dünnen Bogens: ein Helm als Kuppel über dem Bild (Nieten, Glanz, ab Stufe 3 roter Federbusch) und ein Brustpanzer aus Plattenreihen unter dem Bild – Bronze, Stahl, Gold. Gesichtsmitte bleibt frei (Sonde 634).
- Sonde: `pruefe-676-verkaufen-ruestung.js` (8 Prüfungen). Alle Spiel-Sonden grün.

## Fassung 677 — Feld, Sense, Saat, Mühle, Bäckerei, Markt

- XANDER: „dass wir auf dem Feld arbeiten ernten können genauso wie mit der Schaufel … mit einer Sense arbeite und das Getreide, eben Absen … überall auf jeden Platz Getreide … pflanzen … dass ich das Werkzeug wechseln kann, indem ich zweimal … auf den Festplatz klicke".
  - Werkzeug in der Hand: Schaufel, Sense oder Saatbeutel (gemerkt). Die Leiste zeigt es direkt hinter dem Controller (Tipp = weglegen) und daneben ⇄ für die Werkzeugwahl. 2× schnell auf denselben Platz öffnet die Wahl ebenfalls; der erste Tipp arbeitet trotzdem sofort.
  - Mit Sense oder Saat wächst auf JEDEM freien Platz Getreide (im Kreis des Platzes): reif = goldene Ähren und „+2", sonst Stoppeln bzw. grüne Halme mit Uhr.
  - Sense: schwingt mit „swoosh", Halme fliegen, +2 Getreide (gesät +5). Nach 4 Minuten ist das Feld wieder reif. Wer schneller tippt als die Sense (1,5 s), dessen Schnitt wartet kurz.
  - Saat: nur auf gemähte Felder (ein reifes wird nicht verschenkt), 1 Getreide → nach 4 Minuten 5.
- XANDER: „in der Bäckerei irgendwas backen … Stationen … beliefern, damit sie die Sachen verarbeiten … einsammeln … verkaufen … auf dem Markt".
  - Neues Gebäude Mühle (ab Level 3, 90 × Stufe): Getreide → Mehl in 8 Minuten. Bäckerei: Mehl → Brot (1 Mehl) oder Kuchen (2 Mehl) in 10 Minuten. Je Gebäude ein Auftrag, höchstens 5 × Stufe. „Abholen", wenn fertig.
  - Mein Dorf zeigt Lager, laufende Aufträge („fertig um …") und den Markt: Getreide 1, Mehl 3, Brot 6, Kuchen 14 Punkte. Brot +12 LP, Kuchen +30 LP und +10 Mana (auch im Heilen-Menü).
  - Server: `spiel_ernten`, `spiel_saeen`, `spiel_beliefern`, `spiel_werk_abholen`, `spiel_markt` (Migrationen `spiel_677_*`), im Rollback geprüft. XANDER: „Nicht nur durch die Deutsch Aufgaben, sondern auch durch solche Sachen … bisschen bemerkbar machen": Marktgeld zählt bis 40 Punkte je Tag auch im Ranking der Seite (`spiel_677_markt_zaehlt_im_ranking`, im Rollback geprüft: 28 + 12, dann Schluss); der Rest nur als Spielpunkte.
- Sonde: `pruefe-677-feld-muehle-markt.js` (30 Prüfungen, Android-Telefon mit Fingertipps). Alle 40 Spiel-Sonden grün.

## Fassung 678 — Menü wie vorher (flach), Schmerzstimmen, Erinnerungen, Graben, Zauberrad

- XANDER: „Das Menü vorher war besser … nimmt noch mehr Sicht auf den Chat weg … durch die Werte scrollen … Die Werte sollen im Auge bleiben … bei der Rangliste ist es im Prinzip fast so wie ich es bräuchte".
  - Das Spielfenster ist höchstens 58 % hoch und klebt unten. Kopf, Werte und Reiter bleiben stehen, nur der Inhalt scrollt. Die Werte brechen wieder um (kein Seitwärts-Wischen).
  - Das ☰ im Fenster ist weg (✕ legt ab).
  - „Fundstück!" hebt nicht mehr auf: der Knopf legt das Fenster ab und lässt das Säckchen am Platz aufleuchten – aufheben muss man selbst.
- XANDER: „immer noch diesen Fluss graben egal wo ich hingehe". Der Wassergraben schützt das Dorf, nicht den Platz: er zeigt sich nur noch 6 Sekunden, wenn er gerade ein Beben schluckt.
- XANDER: „der Sound von magische Menü … klingt so verspielt, kommt auch zweimal". Eigener ruhiger Zauberklang (`ton/zauberrad`), nur einmal je Öffnen.
- XANDER: „der Amtsweg das sind 70 bei mir. Ich kann die fast endlos einsetzen". Die Zahl ist der Mana-Preis, kein Vorrat (sein Mana: 5). Das Rad zeigt jetzt blau „Mana N" und „Zahl = Mana-Preis". Auf Puppe und Sparringspartner ist Zaubern kostenlose Übung (seit 655).
- XANDER: „Wenn ich Schätze auf der Platzkarte einsammle dann geht das nicht in meine Punkte über". Münzen, Truhe und Schatz beim Graben zählen jetzt auch als „verdient" → Ranking (`spiel_678_schaetze_ins_ranking`).
- XANDER: „gar kein Schmerzgeräusche … zwischen Frau und Mann … schlimm getroffen … leicht … bei mehr Beschuss … ausrasten … kurz vom Ende … Stöhnen … ich brauche Hilfe … das tut weh oder hör auf oder hau ab … nicht übertrieben".
  - GEFUNDEN: die App rechnete den Namen des Schmerzlauts nur aus und spielte ihn nie ab.
  - 24 neue Stimmdateien (Mann „Harry", Frau „Sarah", ElevenLabs v3, Deutsch, per Spracherkennung geprüft): Au, Autsch, Ah, Schrei, „Aua! Das tut weh!", „Hör auf!", Stöhnen „mir geht's gar nicht gut", „Hilfe! Ich brauche Hilfe!", „Ich brauche Medizin", „Ich habe Hunger", „Ich habe keine Kraft mehr", „das war's". Dazu das vorhandene „Hau ab!".
  - Leichter Treffer: kurzer Laut, nicht jedes Mal; schwer (ab 15 oder Kopf): Schrei oder „Aua!"; jeder 4. Treffer in Folge: „Hör auf!"/„Hau ab!"; unter 25 % LP: Stöhnen/Hilfe (je Person höchstens alle 20 s); kaputt: „das war's". Höchstens eine Stimme je Person und 1,1 s. Auch bei Zaubern und Gegenwehr.
- XANDER: „dass man erinnert wird, wenn man Medizin braucht … Hunger … aber nicht jetzt alle 5 Sekunden … die Tiere … Drachen Grummeln". Nur für einen selbst, frühestens nach 1 Minute, höchstens alle 90 s eine: Medizin (unter 30 % LP, 4 min Pause), Hunger (unter 60 % und Essen da, 6 min), kein Mana (8 min), Tier fast ohne Kraft: Hund winselt, Drache/Phönix grummelt (5 min) – jeweils mit Hinweis, wo es Hilfe gibt.
- Sonden: `pruefe-678-schmerz-stimmen.js` (19 Prüfungen); 666 und 673 auf das neue Verhalten angepasst. Alle 41 Spiel-Sonden grün (665 wackelt nur unter Last).

## Fassung 679 — Eigene Sitzordnung im Spiel, Menü wie zuerst, Ablegen

- XANDER: „Sie soll noch nicht meinen Platzwechsel sehen. Im Chat bin ich immer noch auf der Position wo ich auf dem Chat bin … das muss getrennt voneinander behandelt werden".
  - GEFUNDEN: ein Platzwechsel im Spiel war ein echter Chat-Platzwechsel (Chat-Sitzordnung + Zeile „… setzt sich auf Platz …") – alle sahen ihn.
  - Jetzt gibt es in `livechat.js` eine eigene Spiel-Sitzordnung (`spielSitz`, Nachricht `spielsitz`, still, fährt im Puls mit). Wer mitspielt und im Spiel den Platz wechselt oder tauscht, ändert NUR sie. Angewendet wird sie nur auf Geräten, die selbst mitspielen, und nur für Mitspieler. Wer nicht mitspielt (oder Pause macht), sieht alle auf ihren Chat-Plätzen.
  - Kämpfe, Schüsse, Tiere im Angriff sieht ohnehin nur, wer mitspielt (seit 652). In der Datenbank steht bei XanderFox „Tiere auch ohne Spiel zeigen" an – dann sieht jeder die Tiere friedlich am Platz (abschaltbar: Mehr → „Auch ohne Spiel zeigen").
- XANDER: „Mache bitte wieder die erste Version von vorher … wo die Punkte und das alles untereinander steht … das oben über der Aufgabe die Niveau standen und die Aufgaben und die Mission auch in Griffweite … mit der Möglichkeit das … temporär abzulegen".
  - Statusblock wieder wie vor Fassung 673 (LP, Level, Werte, Mana untereinander); das flache 58-%-Fenster aus 678 ist zurückgenommen. Deutsch: Niveau → Arten → Aufgabe → Mission.
  - Neu: ▾ legt das Fenster ab; in der Schnellleiste liegt dann ein Griff, der es im selben Reiter wieder öffnet. Ein Tipp neben das Fenster legt ebenfalls ab; ✕ schließt ganz. Der Fundstück-Knopf legt ab und zeigt das Säckchen.
- Scheibenwischer gegen Chat-Dreck gibt es seit Funk 84 (`dreckAbwehren`); aufrüstbar und haltbarere Waffen stehen auf der Liste.
- Sonden: `pruefe-679-spielsitz.js` (10 Prüfungen); 673 auf das erste Layout + Ablegen angepasst. Alle Spiel-Sonden grün.

## Fassung 680 — Waffen verstärken, Scheibenwischer aufrüsten

- XANDER: „diese Scheibenwischer die man sich kauft im Spiel die soll natürlich auch für den Chat dann funktionieren … und sowas immer upgraden kann ja wie lange das hält und genau auch wie lange die Lebensdauer der Waffen hält, dass man die stabiler bauen kann, dass man die anders fertigen kann oder dass die Zusatzfunktionen bekommen".
- Waffen (Reiter Waffen, bei jeder gekauften, abnutzbaren Waffe): „Verstärken ★" (30 P + 2 Erz) → hält 100 statt 60 Treffer; „★★" (60 P + 4 Erz) → 140 Treffer und geschliffen: +10 % Schaden. Reparatur (Laden) und Schärfen (Werkstatt) füllen bis zur eigenen Haltbarkeit auf. Verkaufen rechnet weiter mit höchstens 60.
- Scheibenwischer (Schutz → Werkstatt): wischt Dreck im Chat automatisch weg (seit Funk 84). Stufe 2 (40 P + 1 Erz) spart bei 30 % der Wischer die Ladung, Stufe 3 (80 P + 2 Erz) bei 60 %; jedes Aufrüsten gibt 2 Ladungen.
- Server: Migration `spiel_680_veredeln_waffen_wischer` – Spalten `waffen_stufe`, `wischer_stufe`, `spiel_halt_max`, `spiel_veredeln`; `spiel_wischer`, `spiel_treffer`, `spiel_kaufen` (Reparatur), `spiel_schmieden` (Schärfen), `spiel_ich` angepasst. Im Rollback geprüft: ★ → ★★ → „schon ganz verstärkt", Reparatur bis 140, Wischer Stufe 3 sparte 22 von 40, Treffer mit ★★-Bazooka läuft (Haltbarkeit 140 → 139).
- Sonde: `pruefe-680-verstaerken.js` (7 Prüfungen). Alle Spiel-Sonden grün (656/658/667 wackeln nur unter Last).

## Fassung 681 — Siegeslohn

- XANDER: „wenn ich gegen jemanden kämpfe und ich gewinne, dass da auch ne Punktzahl kommt und ich da auch irgendwie Geld verdienen, wovon ich mir wieder was kaufen kann. Das muss aber alles im Verhältnis stehen … nicht zu reich wird … man nimmt dem anderen auch nichts weg … stärke Punkte vielleicht oder Erfahrungspunkte".
- Vorher: 1 Punkt je Treffer (höchstens 20 je Stunde), K.o. +3, Duellsieg +5 – nur Geld, nichts im Ranking, keine Erfahrung extra.
- Jetzt zusätzlich (nur in fairen Kämpfen, nicht gegen 5+ Level Kleinere): K.o. +10 Erfahrung und +2 Punkte, Duellsieg +25 Erfahrung und +8 Punkte. Diese Siegespunkte zählen auch im Ranking der Seite, höchstens 30 am Tag. Dem Verlierer wird nichts abgezogen.
- Meldung: „🏆 Bea ist K.o.! +6 Punkte, +10 Erfahrung – 2 davon zählen im Ranking." mit Jubel.
- Server: `spiel_681_siegeslohn` (in `spiel_treffer`), im Rollback geprüft (K.o.: Erfahrung +11 = Treffer +1 und Sieg +10, verdient +2).
- Sonde: `pruefe-681-siegeslohn.js`. Alle Spiel-Sonden grün (656/658/665 wackeln nur unter Last).

## Fassung 682 — Schatzpunkte, Felder überall, Deutsch-Fenster, Handel, Spaß im Chat

- XANDER: „Die Punkte, die ich bei den normalen Schätzen einsammeln, sehe ich nicht in meinen Münzen". Vorher gab es Punkte erst nach der Artikel-Aufgabe (und nur bei 1 von 6 Inhalten). Jetzt: Heben +3 Punkte sofort (zählen im Ranking), nach der Aufgabe +5 dazu. Server: `spiel_682_fundstueck_punkte`.
- XANDER: „überall auf jeden Platz unabhängig davon, ob da jemand sitzt … Erde umgraben … Getreide ernten … Saat sehen". Graben, Mähen, Säen gehen auf jedem Platz; auf besetzten Plätzen sieht man das Feld unten am Bild (Gesicht bleibt frei).
- Deutsch-Fenster: die Aufgabe steht oben; statt „Tippe die richtige Antwort" links „Mission holen", rechts „📚 Neue Aufgabe ▾". Niveau/Arten klappen darunter auf; nach der Wahl springt das Fenster wieder nach oben.
- Skillpunkte: Status zeigt „Skillpunkte: alle N verteilt", wenn keiner frei ist.
- Glitch: das Schatz-Symbol in der Leiste wurde riesig (`width:100%`) – jetzt feste 22 px.
- Handel (Mein Dorf): Markt-Tagespreis = Grundpreis × Laune des Tages × Nachfrage (je mehr heute verkauft, desto billiger) × Beliebtheit (wer viel angreift, bekommt weniger, bis −30 %). Schenken an Mitspieler (höchstens 50 Stück am Tag), eigene Angebote (bis 5, Preis 1–99, der Käufer zahlt dem Verkäufer), Dünger (8 Punkte, ein Feld wird 2 Minuten schneller reif). Server: `spiel_682_handel_markt_duenger` (Tabelle `spiel_angebote` nur über Server-Funktionen).
- Im Chat (Mehr → „Im Chat"): Spaßwaffen (Tipp auf eine Person schießt zum Spaß, ohne Schaden, ohne Platzwechsel), Chat-Mauer (hält Effekte auf meinen Platz ab), Tiere reagieren auf Treffer und Streicheln (lecken, kuscheln, hüpfen) und spielen in Pausen miteinander. Server: `spiel_682_zeigen_chatschutz`.
- Sonden: `pruefe-682-handel-chat.js` (21 Prüfungen); 673 und 677 an das neue Verhalten angepasst.

## Fassung 683 — Makroknopf, Dorf-Wirtschaft, Volk, Plündern, Holz, Fisch, Eier, Milch, Chips

- XANDER: „Mein Dorf hätte ich gern zusätzlich … in dem Shortcut Menü unten … dass der letzte wie ein Makroknopf ist … dass ich selber bestimmen kann, was dort unten für Symbole zu sehen sind … dann ist auch wirklich nur das Layout von dem Dorf da und was in dem Dorf grad passiert". Neuer letzter Knopf in der Leiste (hinter dem Zauberstab), belegbar unter Menü → Mehr → „Letzter Knopf": Dorf, Markt & Handel, Werkzeug, Deutsch-Aufgabe, Tiere, Heilen. Die Dorf-Ansicht: Szene mit allen Gebäuden und was dort läuft (Uhr, fertig, Eier, Milch, kaputt), Volk, Ernte, Werkstätten, Lager, Nachbardörfer; Bauen und Markt klappen darunter auf. Wird die Leiste eng, rücken die Knöpfe zusammen (Superkraft als Füllstand).
- „diese kleinen Zahlen, die Gesundheitspunkte, wenn er einfach steht … und sich regeneriert": beim Erholen steigt eine grüne „+N erholt" (bzw. „+N Krankenhaus") über dem Bild, das Bild leuchtet kurz grün.
- Neue Gebäude: Hühnerstall (Lv 2, legt Eier auf freie Plätze – antippen), Kuhstall (Lv 3, Melken), Krankenhaus (Lv 5, +35 % schneller heilen je Stufe, nach K.o. 1 min früher auf den Beinen), Bergwerk (Lv 7: Erz, Quarz, Gold, Goldader, Öl), Labor (Lv 10: Chips).
- Werkzeuge: Axt (auf jedem Platz ein Baum, 2 Holz, 6 min nachwachsen, manchmal Vogelnest mit Ei), Angel (Teich, alle 8 s, 60 % Fisch, Stiefel oder Münze; Ton: Wurf – Platsch – Kurbel).
- Preise (echtes Leben: Weizen ~0,25 €/kg, Mehl ~0,60–1 €/kg, Brot ~3–4 €/kg; in Anno ebenso): jede Stufe mehr wert als die Zutaten. Getreide 1 → Mehl 3 → Brot 6 · Kuchen 14 · Torte 30 (2 Mehl + 2 Eier + 1 Milch = 12) · Quarz 2 ×2 + Holz 2 → Silizium 15 · Silizium + Gold 25 → Chip 60.
- Forschung: ★★★ nur für Energiewaffen (Lasersalve, Doppel-, Streulaser, Plasmastrahl, Kugelblitz): Labor + 2 Chips + 100 P → 180 Treffer, +20 % Schaden.
- Plündern (wie Clash of Clans / Forge of Empires recherchiert): das Gebäude bleibt stehen, wird beschädigt (halbe Haltbarkeit); der Angreifer nimmt 20 % der passenden Vorräte (höchstens 8 je Ware), der Besitzer verliert genau das. Je eigener Ritter +5 %, je Ritter des Verteidigers −5 %. 10 Mana, 6× am Tag, 4 h Schutz je Gebäude, nur faire Gegner, keine Anfänger; Schule, Bibliothek, Krankenhaus plündert man nicht. Reparieren: 1 Erz oder 2 Holz.
- Volk: je Gebäudestufe 2 Arbeiter, dazu bis 5 Ritter (40 P). Je Ernte essen sie (Fisch, Brot, Bratwurst, Kuchen, Torte) und bekommen Lohn. Zufriedenheit = 40 % satt + 20 % bezahlt + 40 % Deutsch-Quote der letzten 7 Tage (falsche Antworten werden ab jetzt mitgezählt) → Ertrag × 0,5 bis × 1,5.
- Server: `spiel_683_dorf_wirtschaft` (+ `spiel_683_pluendern_lp_fix`, `spiel_683_ich_dorf_ab`), alles im Rollback geprüft (Bau, Eier, Milch, Holz, Angeln, Torte, Silizium, Chip, Ernte mit Volk 80 %, Plündern 30 % mit Ritter, 4-h-Schutz, ★★★, Reparatur mit Holz, Krankenhaus-Heilung 13 statt 10 LP in 200 s).
- Sonde: `pruefe-683-dorf-wirtschaft.js` (29 Prüfungen); 677 an die Werkzeugwahl mit 6 Werkzeugen angepasst (zweispaltig, bleibt im Rahmen).

## Fassung 684 — Brustpanzer als echter Kürass

- XANDER: „Brustpanzer realistisch angelegt". Statt eines Plattenbogens sitzt jetzt ein Kürass unten am Bild: Halsberge, gewölbte Brustplatte mit Mittelgrat und Glanzlicht, zwei Bauchreifen, Schulterstücke, Nieten; Bronze (Stufe 1), Stahl (2), Gold mit rotem Adler (3). Das Gesicht bleibt frei.
- Sonde 676 prüft den Kürass.

## Fassung 686 — Hauptmenü wie vorher, Dorf als Bild, Trank-Knopf, Zauber oder Waffen

- XANDER: „Das mit dem Dorf hast du falsch verstanden ich wollte das nicht im Hauptmenü haben. Das Hauptmenü soll so sein wie vorher". Ursache: der Makroknopf setzte den Reiter des Hauptmenüs auf die Dorf-Ansicht, danach zeigte auch ☰ nur noch das Dorf ohne Reiter. Jetzt hat die Dorf-Ansicht einen eigenen Zustand; ☰ zeigt immer Waffen, Heilen, Tiere, Deutsch, Mehr (bei offenem Dorf wechselt ☰ direkt ins Hauptmenü).
- „diese grafischen Sachen … klickbar machen, dass sie zu den jeweiligen Station kommen, wo man dann weiter aufrüsten kann … wie bei Anno … detailverliebt … organische Strukturen": der Makroknopf „Mein Dorf" zeigt eine Landschaft (Berge mit Schnee, Wald, Fluss mit Steinbrücke, Teich, Felder, Weide mit Kühen, Wege, Wolken) und alle 12 Gebäude an festen Orten als eigene Zeichnungen: Fachwerk mit Balken, Andreaskreuzen, Fensterläden, Blumenkästen, Ziegeln, rauchendem Schornstein (Bäckerei, Schule, Schmiede, Brauerei, Krankenhaus, Rathaus mit Uhrturm), Mühle mit drehenden Flügeln, Bergwerk mit Lore, rote Scheune mit Silo, Hühnerstall mit Hühnern, Bibliothek mit Säulen, Labor mit Kuppel. Stufe 2 bekommt eine Gaube, Stufe 3 eine goldene Wetterfahne. Nicht gebaute Gebäude stehen als Bauplatz da.
- Tipp auf ein Gebäude: seine Station ragt unten ins Bild – Stufe, Haltbarkeit, was es gerade tut (Beliefern, Abholen, Melken, Eier), „Bauen"/„Ausbauen auf Stufe N", „Reparieren".
- „unten in der Hauptschnellleiste meine Manatränke": neue Flasche in der Leiste mit der Zahl aller Tränke (+ Torten, Kuchen); Tipp öffnet Heiltrank, alle Tränke, Torte und Kuchen zum sofortigen Trinken/Essen.
- „wenn ich lange auf mein Profilbild gedrückt halte … erst mal die zwei Optionen … Zauber und Waffen und dann dort noch mal wechseln … zwei Räder in sich … das Mana mit drin, dass ich Torten Shortcut habe": langer Druck zeigt zuerst „Zauber | Waffen"; im Zauberrad oben „⇄ Waffen", im Waffenrad „⇄ Zauber". Im Zauberrad: Mana als Bogen, darunter Torte, Manatrank, Kuchen zum Auffüllen.
- „die Rüstung muss die Level Anzeige und die Magie oben drüber haben": Helm und Kürass werden jetzt zuerst gezeichnet; Lebenspunkte, Mana, Ladung und Levelzahl liegen darüber.
- Kein Server-Umbau nötig (Bauen, Beliefern, Trinken, Essen nutzen die bestehenden Funktionen).
- Sonde: `pruefe-686-dorfbild-traenke-rad.js` (19 Prüfungen); 633, 651 (acht Knöpfe mit Flasche), 652 (Wahl vor dem Rad), 678 (Mana-Zeile) und 683 (Dorfbild) angepasst. Alle 47 Spiel-Sonden grün (682 wackelt nur unter Last).

## Fassung 690 — Die Tiere spielen bei den Profileffekten mit

- XANDER (Funk 137): die Tiere am Platz sollen auf jeden Profileffekt reagieren. `chatEffekt(platz, klasse, von)` ordnet jede Effekt-Klasse über `TIER_REAKTION` einer Reaktion zu; app.js reicht jetzt auch den Absender mit (`lcEffektVon`, gesetzt am Anfang von `lcWirkung`).
- Sabber: aufsaugen, dem Absender auf den Kopf zurückspucken (Flugbahn, Fleck, „Hihi!"). Spucke: fangen und schlucken, manchmal rülpsen. Sahne/Zucker/Kekse: Zunge, lecken, schmatzen, rülpsen. Streicheln/Kuss/Herz: das Fellmonster (und Hunde) hecheln mit Zunge, Drache und andere machen „mmmh". Münze/Geld: Euro-Scheine in den Augen, breites Grinsen, Ka-tsching. Eimer/Waschen: nass, schütteln sich, spritzen die Nachbarn an (deren Tiere: „Hey!"). Strohhalm: wundern sich, leeres Glas daneben. Blubbern: hochschauen, „wow". Pflaster: zufriedene, wechselnde Laute. Blume: schnüffeln, dann „mmmh". Klaps: erst „?", dann dreht sich der Drache um, klapst dem Fellmonster auf den Po („Au!"), beide kichern. Kopfhörer: tanzen mit Noten, solange die Hörer sitzen. Billard/Bowling: zuschauen, am Platz bleiben. Zauber/Birne/Pumpe: staunen. Wecker/Störung/Gong: erschrecken. Schnee: zittern. Applaus: freuen. Angriffe: aufspringen, knurren.
- Tierstimmen (Hecheln, „mmmh", „wow", „ooh", Kichern, Schnüffeln, Schütteln, Schlucken) werden mit Web Audio erzeugt und bei jedem Mal etwas anders gestimmt. Sprechblasen der Tiere stehen klein neben dem Tier, nie über dem Gesicht.
- Mitkommen: Angel, Kran, Lasso, Leiter, Bagger, Rakete, Ballon → Doppelgänger der Tiere hängen am Bild und baumeln. Reisen (`lc-platz-unterwegs`): eine Wache folgt Bild für Bild dem Profilbild oder dem Fahrzeug (Boot, Lok, Fahrstuhl, Hut …), am Ziel springen die Tiere sofort auf ihren Platz, danach wird gleich neu gezeichnet (vorher erst beim nächsten Neuzeichnen). Beamen: Beam-Glühen, Ankunft kurz vertauscht (Fellmonster oben, Drache unten), „Hä?", zurücktauschen. Fahrstuhl: sie quetschen sich rein.
- Einzug (`lcAuftritt`): im Wagen auf dem Rücksitz, steigen nach dem Profilbild aus; Magie: sie erscheinen nach dem Profilbild aus dem Zauber; Abschied: sie fahren mit weg.
- Weggeschossen (Katapult, Tritt, Zielfernrohr): die Tiere bleiben, suchen („Wo bist du?"), schnüffeln, freuen sich bei der Rückkehr. Fährt ein Fahrzeug über einen Platz (`lc-ueberfahren`): die Tiere jagen hinterher und knurren/bellen; beim Boot schütteln sie sich das Wasser ab.
- Fellmonster-Biss: „manchmal bleiben nur die Zähne sichtbar, während das Monster schon weg ist". Die Zähne lagen fest auf der Seite und hingen an zwei setTimeout-Uhren, das Monster an einer Browser-Animation; unter Last liefen die Uhren nach. Jetzt sitzen die Zähne im Monster und laufen auf derselben Zeitleiste.
- `schmuck()` bewahrt beim Neuzeichnen die laufenden Reaktionsklassen (vorher löschte das sekündliche Neuzeichnen z. B. das Hecheln mittendrin).
- Sonde: `pruefe-690-tiere-effekte.js` (29 Prüfungen); 682 an das neue Streicheln (Hecheln/„mmmh" statt Schnurren) angepasst.

## Fassung 691 — Eigene Tier-Reaktionen für die übrigen Effekte

- XANDER (Funk 137, Schluss): „für alle anderen Profil-Effekte auch noch eigene Animationen einfallen lassen". Bisher fielen viele Effekte auf „kuscheln" oder „knurren" zurück. Jetzt:
  - Waschmaschine, Strudel, Hammer: schwindelig mit kreisenden Sternchen.
  - Sonnenbrille: die Tiere bekommen selbst eine (heller Rand, damit man sie auf dem schwarzen Fellmonster sieht) und nicken cool.
  - Rollo, Lamellen: verstecken sich, dann „Kuckuck!".
  - Scheibenwischer, Putzen: glänzen blitzblank.
  - Kratzen: es juckt sie auch.
  - Feuer: „Feuer!", dann pusten sie es aus.
  - Vogelkot: „Bäh!", Kopfschütteln.
  - Farbklecks: sie bekommen bunte Punkte ab.
  - Cowboyhut: eigene kleine Hüte, „Yeehaw!".
  - Grimasse: lachen. Schallplatte, Bongo: kurz tanzen. Zorro: erschrecken, dann „Olé!". Ei: abschlecken.
- Klaps wie gewünscht: „der untere gibt ihm auch einen Klaps auf seinen Po" — nach dem Klaps des Drachen springt das Fellmonster hoch und klapst zurück („Autsch!"), dann lachen beide.
- Beamen: jedes Tier bekommt eine eigene kleine Transporter-Säule („kleine Transporterstrahlen zusätzlich für die Tiere").
- Sonde `pruefe-690-tiere-effekte.js` um 14 Prüfungen erweitert (jetzt 43).

## Fassung 692 — Dorf-Menü bleibt stehen, Taschen modular, Mana kaufen und brauen, Effekte ziehen mit

- XANDER: „Das Dorf spinnt manchmal rum … wenn man aus dem Mehr-Menü dahin scrollen will, dann springt es meistens zurück … Man kriegt ein Haus, dann wählt sich das sofort wieder ab." GEMESSEN: die Leiste wird jede Sekunde neu geschrieben, sobald sich ein Countdown ändert; dabei fiel das Menü auf Scrollposition 0 zurück (76 → 0, 200 → 0 nach ~1 s) und die gerade geöffnete Station rutschte aus dem Blick. Jetzt bleibt die Position jedes rollbaren Teils beim Neuzeichnen erhalten, und solange jemand scrollt (auch das Nachgleiten), wird nicht neu gezeichnet; ein Tipp hebt diese Sperre sofort auf.
- „den Zauberstab unten kannst du eigentlich wegmachen … wie viele Taschen sichtbar sind … mit einem + hinzufügen … wieder wegnehmen": 1–6 Taschen (gemerkt auf dem Gerät), jede mit einer anderen eigenen Waffe, dahinter klein + und −. Der Zauberstab erscheint nur noch, wenn ein Zauber bereitliegt; das Zauberrad öffnet der Makroknopf „Zauber“ (neu) oder der lange Druck aufs eigene Bild. Doppeltipp aufs eigene Bild wechselt reihum durch alle Taschen.
- „Es gibt keine Art, generelles Mana zu kaufen … herstellen in der Brauerei": „Manatrank kaufen“ (25 P, kauft und trinkt sofort) steht jetzt im Zauberrad, in der Trank-Wahl und im Reiter Heilen. Die Brauerei braut Manatränke (3 Getreide + 1 Holz je Trank, 15 min, bis 5 × Stufe auf einmal); abgeholt landen sie bei den Tränken. Server: `spiel_692_brauerei_manatrank` (spiel_beliefern, spiel_werk_abholen), im Rollback geprüft.
- „die Effekte sollen auch mitreisen, wenn irgendjemand den Platz wechselt": jede Effekt-Schicht (lcAmPlatz) merkt sich, wem sie gehört und welche Klassen sie am Bild gesetzt hat; beim Platzwechsel zieht beides zum neuen Platz um (livechatPlaetzeAuffrischen).
- „wenn ich auf jemanden Zauber lege und ich hab ihn korrekt anvisiert, dann soll der Zauber den auch erreichen": die Zauberkugel misst ihr Ziel in jedem Bild neu und biegt ihre Bahn dorthin (vorher: feste Koordinaten beim Tippen).
- „wenn ich … den Zug fahren lasse, dann folgen die Tiere nicht komplett … sie sollen richtig hinter ihm her rennen, die ganze Fahrt über": hinter Lok, Boot und Wagen laufen die Tiere-Doppelgänger in Fahrtrichtung hinterher (Galopp).
- Sonden: `pruefe-692-dorf-taschen-mana.js` (13 Prüfungen); 690 um Lok und Zauberziel erweitert; 633, 650, 683 an die Leiste ohne Zauberstab angepasst.

### Fassung 694 (Xander, 26.09.: „wenn die Ladl nicht so groß wäre oder man das alles so ein bisschen professioneller aufteilen könnte … ohne dass jemand ne Grafikeinbuße" · „sobald ich drei oder vier Mitspieler hab wird das alles ganz schwer")
- **Verkleinerte Kopien (`min/`)**: `werkzeug/fassung-setzen.js` baut zu jeder Skript- und Stildatei eine Kopie ohne Kommentare und Leerraum (esbuild; oberste Namen bleiben, damit die Dateien einander weiter finden). Die Seite lädt `min/…`, solange es dafür einen Stempel gibt (`DMA_Q`). `min/.quelle.json` merkt den Quellstand: passt er nicht und kann nicht neu verkleinert werden, wird die Kopie gelöscht → die Seite lädt die Quelle. Lädt eine Kopie nicht (404), merkt sich das Gerät „Quellen" für diese Fassung und lädt einmal neu. `?quelle` erzwingt die Quellen. Der pre-commit-Haken baut mit.
- Gemessen: Startdateien 12,1 MB → 6,65 MB, gepackt 3,48 → 1,88 MB. Erstes Laden bei 10 Mbit/s, vierfach gebremster Rechner: 1868 KB, 2,9 s; nach einem Update nur die geänderte Datei (112 KB).
- **Zwischenspeicher `sw.js`** (Service Worker): gestempelte Dateien kommen ohne Nachfrage aus dem Speicher (ältere Fassung derselben Datei wird weggeräumt), die Seite selbst immer zuerst aus dem Netz (nach 6 s oder offline die zuletzt geladene), fassung.json/Supabase/Filme mit Teilanfragen laufen vorbei. Angemeldet erst nach dem Laden; `?ohne-sw` meldet ab; in Prüfläufen nur mit `?mit-sw`.
- **Fassungsfrage klein**: der zweite Wächter holte bei jedem Vordergrund die ganze index.html (69 KB) — weg; app.js fragt fassung.json. Die Leiste „Neue Fassung" kommt über `dmaFassungZeigen`.
- **Schriften blockieren das erste Bild nicht mehr** (media=print → all).
- **Nachgeladene Dateien** (Übungen, Wortkategorien, Szenen, Baukasten …) ebenfalls aus `min/` mit eigenem Stempel statt Fassungsnummer.
- **Leerlauf**: Magic-Knopf glänzt und atmet jetzt über zwei Deckkraft-Schichten (Grafikkarte) statt background-position/box-shadow; der Farbschein hinter dem Chat ruht, wenn 3+ Plätze belegt sind. Gemessen mit 4 Leuten: 51 → 2,5 ms Rechenzeit je Sekunde.
- **Video bei 3–4 Leuten** (`bildBremse` in livechat.js): jedes Gerät schickt sein Bild an jeden einzeln; bei 3 Leuten höchstens 450 kbit/s je Bild, ab 4 350 kbit/s und 20 Bilder/s. Ton unangetastet, zu zweit keine Grenze.
- Sonde: `werkzeug/pruefe-694-leistung.js` (min/, Rückfall, Service Worker, fassung.json, Leerlauf). Angepasst: `pruefe-neue-fassung.js`, `pruefe-ladezeit.js`, `pruefe-runde99-haende.js`, `pruefe-642-verlauf-laden.js` (tauschen jetzt auch `min/…`).
- Vollständiger Lauf (300 Sonden): 290 grün; rot nur die bekannten (dummy, namensvorschlaege, runde69, runde88-pac, runde87-strichlinien, runde92-betrieb, runde92-grundebene) und anziehen (allein grün).

### Fassung 695 (Xander, 26.09.: „diese Sprechblasen sollen verschwinden … in einer süßen Tierstimme … jedes Tier seinen eigenen Sound … die Sahne ablecken … realistisch mit der Zunge … Hunger … Magen … müde … Spezialfähigkeit, die man ausrüsten kann … der Wolpertinger bewegt sich kaum, hat keinen eigenen Zahn, klingt wie der Phönix")
- **Keine Sprechblasen mehr**: `tierSagt` zeigt keinen Text; aus dem Wort wird eine Stimmung (Freude, Frage, Schreck, Genuss, Ekel, Knurren), das Tier gibt SEINEN Laut (`ton/tier-<art>-<ruf|frage|au|genuss>`, 18 Tiere × 4, ElevenLabs) und neben dem Maul erscheint ein gezeichnetes Zeichen (Schallbögen, Fragehaken, Schreckstern, Herzchen, Stinkwellen, Zackenlinien). Jeder Laut wird zufällig 0,90–1,12-fach gestimmt. Auch die Angriffs-Schriften („Wuff!", „Wolpi!", „klapper" …) sind Zeichen. Eigene Angriffstöne statt geteilter: Dackel, Storch, Greif, Regenbogendrache, Lindwurm, Feuerfuchs, Wolpertinger.
- **Sahne ablecken** (`reaktionSchlecken`/`sahneAblecken`): während gesprüht wird, schauen die Tiere hoch und schnuppern; bei 2,9 s wird die fertige Haube als ruhende Kopie übernommen; das Bodentier klettert am Rand des Profilbilds hoch (geneigt, in Bögen), das Flugtier schwebt an die obere Flanke; sieben Zungenschläge (Zunge schnellt vor, bringt einen Tupfer mit, `tier-schlecken`), nach jedem ist die Haube kleiner (Spitze, Ring 3, Ring 2, Ring 1), die Kirsche wird geschnappt, dann Schnauze ablecken, zufriedener Laut, zurück. Gemessen: Zungenspitze in der Haube bei 12 von 12 Schlägen.
- **Hunger/Müdigkeit**: < 40 % Kraft hungrig (Knurrwellen am Bauch, Bauch zieht sich), < 20 % müde (Augen halb zu, langsamer Atem, Schlafblase statt „Zzz"), 0 schläft (grau, Schlafblase). Hörbar nur bei den eigenen Tieren: Magenknurren (klein/groß), Gähnen (Hund/Vogel/Drache/klein), höchstens alle 70–80 s.
- **Fähigkeiten** (Server: `spiel_tier_faehigkeit`, `spiel_faehigkeit_setzen`, Spalten `faehigkeit`, `faehig_ab`; im Rollback geprüft): je Tier eine, eine ausgerüstet (Menü → Tiere), 15 Mana, 90 s Pause. Auf sich: Kuschelpanzer (+15 Schild), Stachelkugel (Eisenhaut), Eulenblick (Zielwasser), Wachhund (10 s geschützt), Schlaue List (getarnt), Regenbogenheilung (+20 LP), Aus der Asche (+12 LP, Tiere +10), Feenstaub (+25 Mana), Storchenpost (Pflaster). Auf andere (Knopf, dann Gesicht): Knöchelbiss, Glutatem, Flinke Pfote (5 Punkte klauen), Glutbiss, Sturzflug (durch den Schild), Regenbogenfeuer, Hosenbein (12 s Stuhl), Wolpi-Wirrwarr (Nebel), Würgegriff — mit denselben Schutzregeln wie Zauber (Waffenstillstand, Schutz, Tarnung, Duell, 60 Schaden je Minute, Fairness). Alle im Raum sehen Sprung/Bild sofort („faehigkeit"), die Zahlen nach der Antwort.
- **Wolpertinger** neu gezeichnet (Hase mit Geweih vor den Ohren, zwei Federflügeln, Puschelschwanz, großem Hasenzahn, 44 × 43 statt 41 × 32), hoppelt alle 4 s, Ohren zucken; greift mit drei Hasensprüngen an und beißt mit SEINEM Zahn; eigener Laut, `tier-hops`.
- Sonde: `werkzeug/pruefe-695-tiere.js`. Angepasst (gleiches Kriterium, neue Form): 658 (Schlafblase), 670 (Zeichen statt Schrift), 682/690 (erst schnuppern, dann lecken; Laute aus __tierLaute statt Blasen).

### Fassung 696 (Xander, 26.09.: „Monstertruck … wie bei Colt Seavers … K.I.T.T. mit dem roten Scanner … eine rote Dodge Viper … Liane … Transformers … Lass dir da Zeit")
- **Colt-Seavers-Truck** (ersetzt den Monstertruck): brauner GMC-Pick-up auf großen Reifen, Lampenbügel auf dem Dach. Kommt nicht angefahren, sondern SPRINGT herein (über eine unsichtbare Rampe von links oben), landet schwer auf den Federn mit Staub, wippt nach; das Bild hüpft aus dem Fahrerhaus; Vollgas davon. Ton `auftritt-colt`.
- **K.I.T.T.**: schwarzer Firebird, vorn das rote Lauflicht, das hin und her läuft (`.lc-rw-scanner`). Ton `auftritt-kitt`.
- **Rote Dodge Viper**: flache lange Haube, Seitenkiemen. Ton `auftritt-viper`.
- **Liane**: Dschungelliane hängt von oben — immer auf der Bildschirmseite mit mehr Platz (bei Platz 1 von rechts); man schwingt als Pendel herein, lässt über dem Platz los und landet; die Liane schwingt leer nach und zieht sich hoch. Beim Gehen rückwärts. Ton `auftritt-liane`.
- **Transformer** (6,4 s): blaues Auto fährt vor, hält, verwandelt sich Teil für Teil (Heck/Front → Beine, Fahrerhaus → Brust mit dem Bild, Türen → Arme, Kopf mit leuchtenden Augen fährt aus), setzt das Bild ab, winkt, verwandelt sich zurück und fährt davon. Beim Gehen nimmt er das Bild auf. Töne `rennauto`, `auftritt-trafo`, `aufsetzen`.
- Die Liste unter „Mein Auftritt": Ohne, Roter Sportwagen, Hot Rod, Colt-Seavers-Truck, KITT, Rote Dodge Viper, An der Liane, Transformer, Rakete, Zauberwolke. livechat.js nimmt die neuen Namen im Gruß an.
- Gefunden beim Prüfen: die Bühne heißt `lc-auftritt-<art>` — das Seil darf deshalb nicht `lc-auftritt-liane` heißen (sonst rutschte die ganze Bühne 8 px); und die Anfahrkurve darf nur am ersten Stück hängen, nicht an der ganzen Animation (sonst rollte der Transformer beim Verwandeln weiter).
- Sonde: `werkzeug/pruefe-696-auftritte.js` (5 Arten × rein/raus: Bühne entsteht, Bild unterwegs → am Ende genau auf dem Platz bzw. fort, Ton läuft, danach aufgeräumt). 687 an die neue Liste angepasst.

### Fassung 697 (Xander, 26.09.: „jedes Upload/Upgrade/Gebäude/Waffe soll eine echte Wirkung haben" — Prüfung der Spiellogik)
Server: `spiel_697_audit` (im Rollback geprüft). Browser: `werkzeug/pruefe-697-spiellogik.js`.
- **Waffenschaden nach Preis und Level** (Server `spiel_waffe_schaden` und `WAFFEN` gleich). GEFUNDEN: das Zielfernrohr (100 P) machte 35 und schlug damit Bazooka (150 P, 28) und die Level-10/11-Waffen; Eierwerfer und Brezel (20 P) machten 5, weniger als die Gratis-Kartoffel (6); MG (110 P) 12 und Laser-Salve (80 P) 10 lagen unter der Armbrust-Klasse.

  | Waffe | Preis | vorher | jetzt |
  |---|---|---|---|
  | Eierwerfer / Brezel | 20 | 5 | 8 |
  | Hühnerwerfer | 55 | 10 | 13 |
  | Bierkrug | 45 | 11 | 13 |
  | Döner-Katapult | 70 | 13 | 16 |
  | Laser-Salve | 80 | 10 | 15 |
  | Spätzle-Kanone | 90 | 14 | 17 |
  | Zielfernrohr | 100 | 35 | 22 |
  | Maschinengewehr | 110 | 12 | 18 |
  | Doppellaser (Lv 4) | 70 | 15 | 16 |
  | Weißwurst-Bumerang (Lv 6) | 85 | 14 | 18 |
  | Fächerlaser (Lv 6) | 120 | 17 | 21 |
  | Nudelholz (Lv 8) | 110 | 18 | 22 |
  | Plasmastrahl (Lv 8) | 150 | 20 | 26 |
  | Kuckucksuhr-Bombe (Lv 10) | 160 | 24 | 30 |
  | Kugelblitz (Lv 11) | 190 | 26 | 32 |

  Unverändert: Kartoffel/Zwille 6, Laser 7, Bogen 8, Bratwurst 9, Sauerkraut 4, Armbrust 12, Tomahawk 15, Bazooka 28. Obergrenzen bleiben: 60 Schaden je Ziel und Minute, Fairness nach Level.
- **Gegenwehr** höchstens vier Fünftel des angerichteten Schadens — jetzt auch bei 1 Schaden (vorher kamen mindestens 2 zurück, mehr als man anrichtete).
- **Turm**: „Stufe" kaufen ging ohne Turm (70 P), danach „Nachladen" (20 P) = voller Turm für 90 statt 130. Jetzt: ausbauen erst mit Turm. Ein ausgebauter, leer geschossener Turm zeigt „Nachladen · 20" statt „Kaufen · 60". Stufe 4/5 bleiben sinnvoll: mehr Schuss (24/28) und höhere Grenze je Schuss (22/26).
- **Verarbeitende Gebäude** (Mühle, Bäckerei, Schmiede, Labor, Brauerei): eine höhere Stufe gab nur „mehr auf einmal" (5 je Stufe). Jetzt arbeitet sie auch schneller: Stufe 2 85 %, Stufe 3 70 % der Zeit (Mühle 8 → 7 → 6 min, Labor 15 → 13 → 11 min); die Zeilen im Dorf zeigen die echte Zeit.
- **Heilkunst** wirkt (wie der Server rechnet) auf Pflaster und Heiltrank, auch beim Heilen anderer — der Text sagt das jetzt so, statt „+10 % Heilung" allgemein.
- **Übungspuppe**: die eigene Gegenwehr in der Übung kannte nur 5 Tiere; Schäferhund, Babyfuchs, Einhorn, Dackel, Wolpertinger, Feuerfuchs, Phönix, Storch, Lindwurm, Greif, Regenbogendrache wehrten sich dort schwächer (als „Fellmonster"/„Eule") als im echten Kampf. Jetzt dieselben Zahlen und Heilungen wie `spiel_treffer`.

### Fassung 698 (Funk 139–142, 26.09. früh)
Sonde: `werkzeug/pruefe-698-funk139-142.js` (Wetter, Schiffe versenken, Stadt-Land-Fluss, Anziehen, Auftritt/Nachbarn, Walkie-Mikrofon). Server: `spiel_698_mauer_gegen_waffe` (im Rollback geprüft).
- **142 Update-Anzeige**: wieder die kleine runde Blase oben („↻ Neue Fassung … – jetzt laden"), wie vor 694; 694 hatte auf die breite Leiste umgeleitet. `pruefe-neue-fassung.js` prüft die Blase.
- **140 Gesicht beim Auftritt**: GEFUNDEN (Bildschirmfotos, Pixelvergleich): die Auftritts-Bühne liegt über der Seite, Fahrzeuge/Liane/Transformer fuhren ÜBER die Gesichter der Nachbarn (bis 56 % des Gesichts verdeckt, Gegenprobe mit dem alten Stand). Jetzt liegen Kopien der Nachbarbilder auf der Bühne — alles fährt dahinter durch (1 %). Die Zauberwolke steigt hinter dem Bild auf. Das mitfahrende Bild hat jetzt die echte Farbe des Anfangsbuchstabens (vorher Creme). Die Tiere sitzen bei allen Fahrzeugen hinten, an der Rakete unten (nachgemessen: sie lagen auch vorher nicht vor dem Gesicht — das war nicht die Ursache).
- **141 Wetter**: open-meteo liefert keine Bilder, nur den WMO-Code und `is_day`. Jetzt eigene Zeichnungen nach Code UND Tag/Nacht (Sonne in den Wolken, nachts der Mond dahinter; Regen, Schnee, Nebel, Gewitter) statt Emojis (die nur Sonnen kannten und auf Android als Kachel erscheinen). Ein Tipp aufs Wetter: Berlin, Döbeln oder „Mein Standort" (auf 2 Stellen gerundet), gemerkt auf dem Gerät und im Profil.
- **141 Schraubenschlüssel**: erscheint in der Leiste, sobald eine Waffe ≤ 15 Treffer hält (vorher nicht — es gibt nichts zu reparieren); die Anleitung sagt das jetzt so.
- **141 Mauer gegen Waffe** (`spiel_mauer_faktor`): Wurfsachen 0,9 gegen Holz … 0,12 gegen Diamant; Sprengstoff 1,5 gegen Ziegel/Stein; Energiewaffen 1,2 gegen Stahl; Titan/Diamant richtig nur mit Energiewaffe ★★★ (Labor-Chips): 1,4/1,2. ★★ +15 %. Geprüft: Kartoffel gegen Diamant 1 LP, Bazooka 9, Plasmastrahl ★★★ 34. Prallt eine Waffe ab, sagt ein Hinweis, womit es geht.
- **139 Schiffe versenken**: auf dem Brett kein Sprechbild mehr (es wanderte mit dem Sprecher auf ein Feld); nach dem Spiel wieder da.
- **139 Stadt · Land · Fluss**: das Blatt schwebt über dem Chat (absolut), nichts verschiebt sich mehr.
- **139 Walkie im Livestream**: die Meldungen „aborted" (Funk 81, 99) kamen, weil der Livestream das Mikrofon hält. Fürs Diktat leiht der Livestream es aus (`LiveChat.mikrofonLeihen/-Zurueck`), danach ist es wieder da — im alten Zustand (an oder stumm).
- **139 Anziehen**: NACHGESTELLT — kommt das ältere „/anziehen" nach dem neueren „/ausziehen" an (Gerätespeicher + Server), war man nach dem Login wieder angezogen. Jetzt gilt immer die zeitlich letzte Zeile je Person.
- Rückfragen im Walkie (277–281): Beta-Freigabe, Kämpferklassen, Strategie gegen Mitspieler, Bezahlen/Premium, Dorf-Berufe.

### Fassung 699 (Funk 139: Kämpferklassen, 26.09.)
Sonde: `werkzeug/pruefe-699-kampfklassen.js` (Beta-Schalter, Menü, Wahl, Kraft aufs Ziel, Ton je Klasse, Gesichtsmitte frei – 4× grün). Server: `spiel_699_kampfklassen` (Klassenwahl, Kraft und alle Stärken im Rollback geprüft, danach Treffer/Heilen/Antwort gegen die eingespielte Fassung).
- **Sechs Klassen** (Walkie 278: alle): Magier, Dieb, Titan, Heiler, Ingenieur, Deutsch-Gelehrter. Spalten `kampfklasse`, `klassen_xp` (Erfahrung JE Klasse), `klassen_ab` (Pause der Kraft), `kampfklasse_ab` (letzter Wechsel). Stufe 1–10: `spiel_kampf_stufe(xp) = 1 + ⌊√(xp/15)⌋` (15 → 2, 60 → 3, 135 → 4 … 1215 → 10).
- **Wechseln** (`spiel_kampfklasse_waehlen`): kostenlos, alle 10 Minuten; die Erfahrung jeder Klasse bleibt – man levelt jede für sich.
- **Kraft** (`spiel_klassen_schlag`, 20 Mana, 2 Minuten Pause, dieselben Schutzregeln wie die Tier-Fähigkeit: Anfängerschutz, Tarnung, Waffenstillstand, Duell, 60 je Minute, Fairness nach Level):
  | Klasse | Kraft | Wirkung (st = Klassenstufe) |
  |---|---|---|
  | Magier | Arkanblitz | 10 + 2·st Schaden, geht durch den Schild |
  | Dieb | Taschendiebstahl | 4 + st Schaden, klaut 3 + st Punkte, 8 s getarnt |
  | Titan | Bollwerk | Eisenhaut 8 + st s, Schild +10 + 2·st |
  | Heiler | Segen | +20 + 3·st LP für sich oder andere; ab Stufe 5 belebt er Kaputte wieder (20 + 2·st LP) |
  | Ingenieur | Schnellbau | Turm voll geladen, Mauer +10 + 3·st |
  | Deutsch-Gelehrter | Wortgewalt | 6 + 2·st Schaden, 10 s wackelt die Hand |
- **Stärken** (wirken immer): Titan steckt ×(0,85 − 0,01·st) ein; Gelehrter teilt ×(1 + 0,02·st) aus und bekommt +1 Punkt je richtiger Antwort (nur innerhalb der Stundengrenze); Magier zaubert ×(0,85 − 0,01·st) Mana; Heiler +25 % (+2 %/st) auf Pflaster und Trank; Ingenieur: Turm schießt ×1,25 zurück; Dieb: bei Treffern 12 % (+1 %/st) Chance, 1 + st/4 Punkte zu klauen.
- **Klassen-Erfahrung**: jede Kraft +3; Magier +2 je Zauber; Heiler +3 je Heilung anderer (+1 selbst); Gelehrter +2 je richtiger Antwort, +1 je Treffer; Dieb +1 je Treffer; Titan +1 je eingestecktem Treffer; Ingenieur +1 je Turmschuss. `spiel_kampf_xp` ist nicht von außen aufrufbar.
- **Bild und Ton**: je Klasse ein eigenes Geräusch (`ton/klasse-*.opus/.m4a`, ElevenLabs, 1,5 s) und eine eigene Animation (Wappenring am Bildrand; Arkankugel + Blitz neben dem Kopf; Rauchring + Diebeshand; goldener Schildumriss; Lichtsäule über dem Kopf + grüne Kreuze; Zahnräder über dem Kopf; Buch + fliegende Buchstaben). Pixelvergleich: die Gesichtsmitte bleibt frei (≤ 12 %, gemessen 0–11 %). Die anderen sehen Bild und Ton über den Datenkanal im selben Augenblick („start"), die Zahlen danach.
- **Beta**: sichtbar nur mit dem Schalter `kampfklassen_neu` (Einstellungen → Freigaben); Betreiber und Beta-Tester (profiles.is_beta_tester) sehen es sofort. Der Server nimmt die Aufrufe von allen an – die Klassen wirken erst, wenn jemand eine wählt.
- **Nebenbei gefunden (695)**: die fliegenden Münzen („Flinke Pfote") und der Storch hatten keine CSS-Regel und lagen unsichtbar am Seitenende; jetzt fliegen sie.

### Fassung 700 (Funk 143/144, 26.09. vormittags)
Sonde: `werkzeug/pruefe-700-dorf-ruhig.js` (echte Fingergesten über CDP; Gegenprobe mit 699: 3 rot).
- **144 Dorf-Menü ruckelt, springt, Gebäude flackert an/aus**: GEMESSEN – die Leiste samt Menü wurde jede Sekunde (Restzeiten der Werkstätten) per `innerHTML` als NEUES Element geschrieben: 5× in 3,5 s, die Station eines angetippten Hauses 4× neu („an und aus"). Auf dem Telefon bricht das außerdem das Nachgleiten beim Scrollen ab. Jetzt `domAngleichen`: das bestehende DOM wird nur angeglichen (gleiche Stelle + gleicher Tag = dasselbe Element; Text und Attribute werden ersetzt; per Programm gesetzte Höhe/Breite bleibt; Auswahlfelder behalten ihre Wahl). Der Scrollstand wird nur noch gesetzt, wenn er wirklich abweicht. 34 Leisten-Sonden (633–699) grün.
- **143 Dorf organisch**: ohne SVG-Filter (die liefen bei jedem Rauchwölkchen mit) – die Formen selbst sind „von Hand": Fachwerk mit Feldstein-Sockel, Putz mit Körnung und Wetterflecken, Balken mit Holzglanz und leichtem Durchhang, Fenster mit Glanz, Läden aus Brettern und Blumenkasten, Bohlentür mit Beschlägen, Stufe und Blumentopf, Ziegel in Reihen (einzelne heller), Moos, Efeu, Traufschatten, Schornstein aus Ziegeln. Mühle aus Stein mit Schindelhaube, Kuhstall aus Brettern, Hühnerstall mit Schindeln, Bergwerk mit Fels, Labor mit Putz, Bibliothek mit Steingiebel. Licht von der Sonne rechts oben, Schatten fallen weich nach links (auch bei Bäumen). Bäume mit Astgabel und Krone aus acht Ballen, Tannen in gezackten Stufen; Gras auf Wiese und Hügeln, Kies auf den Wegen, Ufer am Fluss, Felsbänder und Dunst an den Bergen, Wolken mit Schattenseite, Heuhaufen, Ziehbrunnen, Hecke am Feldrain; warmes Sonnenlicht und ein feines Papierkorn (einmal gerechnetes Kachelbild) über der Landschaft. Leistung bei 4× gedrosselter CPU wie vorher (Neuzeichnen 70–82 ms statt 67–102, lange Bilder 3–4 statt 3).

### Fassung 701 (Funk 139 + Walkie 279: Rundenkampf gegen echte Mitspieler, „wie bei Street Fighter")
Sonde: `werkzeug/pruefe-701-strategie-zwei.js` – ZWEI Browserfenster (Alex Lv 12, Bea Lv 3), die Sonde stellt die Raumnachrichten gegenseitig zu wie der Datenkanal; eine ganze Partie in Zügen, dann in Echtzeit bis zum K.O. Gegenprobe mit 700: 3 rot, dann Abbruch. `pruefe-669-extraspiele.js` an das neue Protokoll angepasst (kein gemeinsamer Zugzähler; Schaden kommt mit dem Zug).
- **Warum es gegen Menschen nicht ging** (echte zwei Geräte sind von hier aus nicht erreichbar; gefunden in der Simulation und im Code): (1) der Server nimmt Antworten erst 2 s nach der Frage an – wer schneller richtig antwortete, dessen Zug verpuffte still als „falsch"; jetzt wartet `deutschFrage` und schickt dieselbe Antwort noch einmal (gilt auch für Tower Defense). (2) Einladen konnte man nur, wer schon eine Spielkennung gesendet hatte – jetzt jeden auf der Bühne. (3) Ging EIN Zug im Netz verloren, hing die Partie für immer – jetzt wird jeder Zug quittiert und bis dahin alle 2,5 s wiederholt (höchstens 10-mal, dann ein Hinweis); Doppeltes wird erkannt.
- **Protokoll**: jeder rechnet nur seine EIGENEN Werte (LP, Schild, Sterne, Konter) und schickt sie mit; den Schaden eines Angriffs rechnet der Getroffene (er kennt Schild und Konter) und antwortet mit seinem Stand (`typ: "stand"`, zugleich die Quittung). So bleiben beide Geräte gleich, auch in Echtzeit.
- **Arena**: beide Profilbilder mit kleinem Körper auf einer Bühne, Lebensbalken oben wie im Kampfspiel (knapp = rot blinkend), VS. Angriff: Anlauf, Schlag, Funken, Rückstoß, rote Zahl; Donnerwort: Blitz von oben; Schild: blauer Ring solange er hält; Heilen: grünes Leuchten; Konter: goldener Ring; falsch beantwortet: Stolpern + „Daneben!"; am Ende „K.O." bzw. „SIEG!", der Verlierer kippt um, der Sieger hüpft.
- **Modus** (beim Einladen): Züge (wie Schach) oder Echtzeit (beide zugleich, nach jeder Aktion 2,5 s Pause). Auch gegen den Computer.
- **Neue Aktion Konter** (1 Stern): der nächste Angriff prallt zur Hälfte auf den Angreifer zurück.
- **Fairness nach Level**: Schaden × (1 + 0,035 × Levelabstand), zwischen 0,6 und 1,4; wer 5/10 Level tiefer ist, startet mit 1/2 Sternen. Die Arena sagt es an („du −32 % Schaden, Bea +32 %"). Höhere bleiben gefährlich.

### Fassung 702 (Funk 139 + Walkie 281: Dorf – Berufe, Ausbildung, Automatik, Hunger)
Sonde: `werkzeug/pruefe-702-dorf-berufe.js` (Android-Telefon, echte Fingertipps; Server-Regeln in der Attrappe nachgebaut). Server: Migration `spiel_702_dorf_berufe_automatik`, vorher in einem zurückgerollten Durchlauf mit echten Daten geprüft.
- **Dorfbewohner**: jedes Gebäude bringt je Stufe zwei (`spiel_arbeiter`). Freie bildet man aus (`spiel_ausbilden(beruf, menge)`, −1 entlässt): Bauer 5 P, Müller/Bäcker/Schmied 15 P, Wissenschaftler 30 P. Höchstens je Beruf (`spiel_beruf_max`): Bauern 4 + 2 je Mühlenstufe, Müller 2 je Mühlenstufe, Bäcker 2 je Bäckereistufe, Schmiede 2 je Schmiedestufe, Wissenschaftler 2 je Stufe von Schule, Bibliothek und Labor zusammen. Ohne Gebäude: „dafür fehlt das Gebäude".
- **Was sie tun**: Bauern ernten je Ernte 2 Getreide (× Zufriedenheit), Bäcker backen nebenbei 1 Brot, Wissenschaftler forschen (je Wissenschaftler Deutsch-Quote/100 × (1 + Bibliotheksstufe), gesammelt in `volk.forschung` – für die Forschung in 703). Müller/Bäcker/Schmied/Wissenschaftler machen Mühle/Bäckerei/Schmiede/Labor je 10 % schneller (höchstens 30 %).
- **Hunger ernster**: Fachleute essen mit (je zwei eine Portion mehr). Wird das Volk zweimal hintereinander nicht satt, zieht einer aus dem größten Beruf weg. Rote Warnung im Dorf nach dem ersten Hunger.
- **Automatik** (`spiel_dorf_automatik`, `spiel_dorf_takt`): ab Mühle und Bäckerei Stufe 2 mit je einem Müller und Bäcker. Ein Fuhrwerk holt Fertiges ab, bringt Getreide zur Mühle (2 bleiben als Saat) und Mehl zur Bäckerei (Brot). Der Takt läuft beim Öffnen des Dorfs, danach alle 30 s (offen) bzw. 90 s, und bei jeder Ernte. Was er schafft, steht in der Meldung (mit Pferdegeräusch).
- **Im Bild**: wer einen Beruf hat, steht an seinem Haus und arbeitet (Bauer mäht, Schmied hämmert, Bäcker, Müller, Wissenschaftler mit Brille); bei laufender Automatik fährt das Fuhrwerk auf dem neuen Mühlweg hin und zurück. Alles nur per `transform` bewegt (Grafikkarte) – als SVG-Animation waren es bei 4× gedrosselter CPU 97–111 statt 145 Bilder in 3 s, jetzt 142–159.

### Fassung 703 (Funk 139 + Walkie 281: Forschung mit geheimen Entdeckungen, Sehenswürdigkeiten mit Besuchern)
Sonde: `werkzeug/pruefe-703-forschung-wunder.js`. Server: Migration `spiel_703_forschung_wunder`, vorher zurückgerollt mit Xanders Konto geprüft (alle Forschungen, Dom, Fernsehturm ohne Chips abgelehnt, Ernte mit allen Wirkungen).
- **Forschung** (`spiel_erforschen`, Punkte aus `volk.forschung`, gespeichert in `volk.erforscht`): Dreifelderwirtschaft 20 (Getreide ×1,5), Sauerteig 30 (Brot bei der Ernte ×2), Wasserrad an der Mühle 40 (Mühle 25 % schneller, auch bei der Automatik), Buchdruck 60 (Forschung ×1,5). **Geheim** – Name und Wirkung erst sichtbar, wenn Deutsch-Quote und Wissenschaftler reichen: Der Duden 80 (Quote 85 %, 3 Wiss.; Deutsch zählt für die Zufriedenheit +10), Dampfmaschine 120 (Quote 90 %, 5 Wiss., Labor; das Fuhrwerk fährt 10 statt 5 je Stufe).
- **Sehenswürdigkeiten** (`spiel_wunder_bauen`, `volk.wunder`): Holstentor ab Lv 4 (250 P, 10 Holz, 5 Erz; 2 Besucher, +2 %), Brandenburger Tor ab 8 (500 P, 10 Erz, 6 Quarz; 4, +2 %), Kölner Dom ab 12 (900 P, 20 Erz, 10 Quarz, 2 Gold; 7, +5 %), Schloss Neuschwanstein ab 16 (1400 P, 25 Quarz, 5 Gold, 10 Holz; 10, +3 %), Berliner Fernsehturm ab 20 (2000 P, 30 Erz, 4 Silizium, 2 Chips; 14, +3 %). Besucher zahlen je Ernte 3 P Eintritt und kaufen, was das Volk an Brot, Bratwurst, Kuchen übrig lässt (5 P je Stück) – erst isst das Volk.
- **Im Bild**: unter dem Dorf ein Wahrzeichen-Band mit allen fünf (gebaute in Farbe, die anderen als Schatten „ab Level …"); Besucher spazieren hindurch (nur per transform). Antippen öffnet die Liste. Neue Klappen „Forschung" und „Wahrzeichen".
- **Leistung**: `domAngleichen` überspringt Teile mit gleicher Unterschrift (`data-sig`), das Band wird nur neu gebaut, wenn ein Wahrzeichen dazukommt. Median aus 15× Neuzeichnen (4× gedrosselt): 79–82 ms mit, 76 ms ohne 703. `pruefe-700` misst jetzt den Median aus 9 statt eines einzelnen Durchgangs (der schwankte bei gleichem Code zwischen 71 und 143 ms).

### Fassung 704 (Funk 145/146/148: das Dorf richtig gemalt, Haus schließen, lesbare Station)
Sonde: `werkzeug/pruefe-704-dorf-gemalt.js` (Android, 360 px, echte Finger). `pruefe-700` und `pruefe-686` prüfen die Vektor-Einzelheiten jetzt in der Rückfallansicht.
- **Warum 700 „nicht zu sehen" war** (ehrlich): 700 hat die Vektorzeichnungen verfeinert (Feldsteine, Ziegelreihen, Moos) – live und ohne Schalter. Aber auf dem Telefon war ein Haus nur etwa 25 px breit; die Feinheiten gingen unter. Es war also wirklich kaum ein Unterschied zu sehen.
- **Jetzt gemalt, als Rasterbild** (mit eigenem Code, ohne ElevenLabs – Funk 146 „mit deinen eigenen Credits"): Stoffe als Kacheln aus Rauschen gerechnet (Gras mit Halmen und Blumen, Erde mit Kieseln, Putz mit Körnung, Holzmaserung, Bretter, Dachziegel mit Moos, Schiefer, Feldstein, Backstein, Fels, Acker, Wasser, Schindeln). Jedes Haus ist ein Körper mit Vorderseite, Giebelseite und Dachfläche; die Stoffe liegen perspektivisch auf den Flächen. Licht von rechts oben, weiche Schatten nach links, dunkle Fuge am Boden. Stufe 2: Dachgaube, Stufe 3: Anbau. Kaputte Häuser mit Ruß und Schutt. Landschaft: Berge mit Licht- und Schattenflanke und Schnee, Dunst, Wiese mit großen hellen/dunklen Flecken, Wald, Äcker, Fluss mit Ufer, Teich mit Schilf, Wege mit Fahrspuren, Steinbrücke, Brunnen, Heu, Büsche.
- **Doppelt so groß**: das Dorf ist doppelt so breit wie sein Fenster; man schiebt es mit dem Finger (wie bei Anno), am Anfang auf die Dorfmitte. Ein Haus ist auf dem Telefon jetzt über 50 px breit.
- **Leistung**: gemalt wird einmal je Dorfzustand (Stufen, kaputt) und im Speicher behalten; beim Neuzeichnen (jede Sekunde die Uhren) bleibt die Leinwand unangetastet (`data-sig`). Rauch und Mühlenflügel bewegen sich darüber nur per transform. Neuzeichnen (Median, 4× gedrosselt) 29–40 ms statt ~80 ms mit Vektorhäusern.
- **Rückfall**: `localStorage.dma_dorf_vektor = "1"` (oder ein Browser ohne Canvas) zeigt das bisherige Vektorbild.
- **Funk 148**: ein Tipp in die leere Landschaft schließt das offene Haus. Die Hausstation hat eigene, feste Farben (dunkle Holzknöpfe mit heller Schrift, „Abholen" grün, gesperrt deutlich grau, ✕ dunkel) – vorher weiße Schrift auf fast weißem Glas, im Galaxie-Design unlesbar.

### Fassung 705 (Funk 147: Wetter mit den ursprünglichen Bildern, nachts Mond)
Sonde: `werkzeug/pruefe-698-funk139-142.js` (angepasst: Tag = ursprüngliches Bild, Nacht = Mond statt Sonne, Regen bleibt).
- **Nachgesehen im Verlauf**: bis Fassung 697 waren die Wettersymbole Emojis (`WEATHER_ICONS`, seit dem ersten Hochladen am 10.09.; im Kopf stand anfangs „⛅"). 698 hatte sie durch eigene Zeichnungen ersetzt – die sind wieder raus.
- **Jetzt**: tagsüber genau die ursprünglichen Bilder (☀️ 🌤️ ⛅ ☁️ 🌫️ 🌦️ 🌧️ ⛈️ 🌨️ ❄️). Nachts nur dort, wo eine Sonne zu sehen wäre, der Mond an ihrer Stelle: klar 🌙, leicht/halb bewölkt der Mond mit einer Wolke davor, Schauer/Niesel der Mond hinter der Regenwolke. Tag oder Nacht sagt weiter der Dienst (`is_day`). Die Ortswahl (Berlin, Döbeln, Standort) bleibt.

### Fassung 706 (Dorf: Berge und Wiese natürlicher)
- **Berge**: statt glatter Dreiecke gebrochene Grate (jede Strecke viermal geteilt und zufällig verschoben); jede kleine Flanke wird nach ihrer Neigung belichtet (der Sonne rechts oben zugewandt hell, abgewandt blau-dunkel) – so entstehen Rinnen und Rippen wie in den Alpen. Schnee nur über der Schneegrenze, unten kurz zerfranst. Davor bewaldete Vorberge im Dunst.
- **Wiese**: gedämpftes Sommergrün mit Oliv; großflächig dunkle, satte Mulden und trockene, gelbliche Kuppen statt eines gleichmäßigen Grüns.
- Malen bleibt einmalig je Dorfzustand; `pruefe-704` grün (Neuzeichnen Median 24 ms bei 4× gedrosselter CPU).

### Fassung 707 (Funk 146: Schatz, Eier, langer Druck, schnelles Ernten, 8 Angeln, Taschen im Menü)
Sonde: `werkzeug/pruefe-707-funk146.js` (Android, 360 px, echte Finger, jede Server-Antwort 180 ms verzögert). Angepasst an das neue Verhalten: `pruefe-661`, `-673`, `-677`, `-682`, `-692`. Server: Migration `spiel_707_fluessig_schatz_angeln`, vorher zurückgerollt mit Xanders Konto geprüft.
- **Schatz ohne Deutsch-Menü**: `spiel_fund_heben` gibt den Inhalt sofort (Erz/Bratwurst +1, Mana +15, Pflaster +1, Ladung +20 oder 10 Punkte) plus 3 Punkte; es wird keine Aufgabe mehr geholt, kein Fenster geht auf. Meldung: „🎁 Fundstück eingesammelt: +3 Punkte und 1 Erz."
- **Der Zeiger-Knopf tut etwas**: der Fundstück-Knopf in der Leiste und oben im Deutsch-Fenster („Einsammeln!") sammelt selbst ein, statt nur hinzuzeigen.
- **Eier springen nicht mehr**: jedes Ei für sich (keine gemeinsame Sperre, die den zweiten Tipp schluckte); Eier, die gerade eingesammelt werden, zählen weiter mit, damit kein Ersatz-Ei woanders auftaucht; das Fundstück landet nicht mehr auf einem Ei (sonst musste das Ei weichen – das sah aus wie ein Sprung).
- **Langer Druck**: Zeitgeber und Kontextmenü lösten beide aus (an und gleich wieder aus). Jetzt zählt derselbe lange Druck innerhalb von 0,9 s nur einmal; es kommt das vorgewählte Werkzeug (Schaufel, wenn nichts gewählt).
- **Schnell ernten**: jeder Tipp auf ein Feld kommt in eine Schlange (jedes Feld nur einmal), der Server lässt alle 0,25 s einen Schnitt zu (vorher 1,5 s, und der Tipp dazwischen ging still verloren). Holzen genauso; Säen und Graben sperren nur noch das eigene Feld.
- **Angeln**: in jedem Teich eine eigene Angel (Server: je Teich 12 s), mehrere Teiche gleichzeitig. Derselbe Teich zu früh: „In diesem Teich ist die Angel noch im Wasser – noch X s. Die anderen Teiche sind frei."
- **Dünger**: hatte keine Sperre; unverändert.
- **Taschen**: die winzigen + / − (18×14 px) sind aus der Leiste raus. Im Waffen-Menü stehen die Taschen groß (Waffenbild und „1. Name"); darunter „◀ nach links", „nach rechts ▶", „+ Tasche", „− Tasche". Die gewählte Tasche wandert mit, die Reihenfolge wird auf dem Gerät gemerkt, die Leiste unten zeigt dieselbe Reihenfolge.

### Fassung 708 (Funk 150, Teil 1: das Dorf mit dem echten Wetter, Tag und Nacht, Vögel, Geräusche nur im Dorf)
Sonde: `werkzeug/pruefe-708-dorf-wetter.js` (Android, 360 px, 4× gedrosselt für die Leistung). Server: Migration `spiel_708_wetter_ernte`, vorher zurückgerollt mit Xanders Konto geprüft (Regen 3 statt 2, Schnee 1, unbekannter Code abgelehnt).
- **Echtes Wetter**: das Dorf liest dieselbe Messung wie das Wettersymbol oben (open-meteo, gewählter Ort, `weather_code` und `is_day`). `app.js` legt sie in `DMA_WETTER.jetzt` ab und meldet „dma-wetter".
- **Über dem Dorf**: Regen als schräge Striche (Niesel feiner), Schnee als Flocken, die fallen und schaukeln, Nebel als ziehende Schwaden, dunkler Himmel je nach Lage. Gewitter: ein verästelter, verjüngter Blitz (dieselbe Form wie bei den Sprechbildern), der Himmel leuchtet auf, der Donner kracht mit dem Blitz (nah sofort, weiter weg bis 0,7 s später); alle 5–15 s. Alles bewegt sich nur per transform – 151 Bilder in 3 s bei 4× gedrosselter CPU.
- **Nacht**: das Bild wird dunkelblau, in jedem heilen Haus brennt ein warmes Licht (kaputte bleiben dunkel), bei klarem Himmel Sterne und Mond.
- **Vögel**: ab und zu zieht ein Schwarm (3–7) übers Dorf, jeder Vogel schlägt in seinem eigenen Takt; das Zwitschern kommt, wenn er ins Bild fliegt. Nicht bei Regen, Schnee, Gewitter oder nachts.
- **Geräusche nur bei offenem Dorf**: Regen- und Windrauschen (Web Audio, in Böen), Donner, Zwitschern, das Treiben (Hammer aus der Schmiede, Enten am Teich, Hund, Pferd des Fuhrwerks), nachts die Eule. Dorf zu → sofort still.
- **Wetterschild** oben links: „🌧️ Regen · 12° · Döbeln · Felder +1 Getreide".
- **Wirkung auf die Ernte** (Server): das Spiel meldet die Messung (`spiel_wetter_melden`, höchstens alle 10 min oder bei Änderung); `spiel_ernten` rechnet mit einer Meldung der letzten 90 Minuten: Regen, Niesel, Gewitter +1 Getreide, Schnee −1 (mindestens 1). Die Ernte-Meldung sagt es („Der Regen hilft: +1.").
- **Ehrlich**: die Wettermeldung kommt vom Gerät; der Server prüft nur, ob der Code ein echter WMO-Code ist. Mehr als ±1 Getreide je Feld kann man damit nicht gewinnen.
- **Noch offen (709/710)**: Kompass mit Kartensymbolen und Zoom; Schnee liegt noch nicht auf Dächern und Wiese; feinere Texturen, weichere Häuser, Figuren und Pferdewagen realistischer.

### Fassung 709 (Funk 150/152: das Dorf klein wie vorher, Kompass mit Kartenzeichen)
Sonde: `werkzeug/pruefe-709-dorf-kompass.js` (Android, 360 px, echte Finger). `pruefe-704` prüft jetzt ausdrücklich die Ansicht „näher ran".
- **Grundansicht = das ganze Dorf**, so groß wie vor 704 (volle Breite, 16:10, nichts zu wischen). XANDER (Funk 152): „die Karte des Dorfes ist immer noch nicht so klein wie sie vorher war … kleiner und kompakter so wie es vorher war".
- **Kartenzeichen wie bei Google Maps**: an jedem Gebäude ein farbiger Kreis mit weißem Bild (Brezel = Bäckerei, Windmühle = Mühle, Doktorhut = Schule, Buch = Bibliothek, Säulen = Rathaus, Amboss = Schmiede, Krug = Brauerei, H = Krankenhaus, Milchkanne = Kuhstall, Ei = Hühnerstall, Spitzhacke = Bergwerk, Kolben = Labor). Im ganzen Dorf nur das Zeichen, näher dran Zeichen mit Namen. Bauplätze grau.
- **Kompass** unten rechts (34 px, die Nadel pendelt leicht): öffnet die Karte – das gemalte Dorf in klein, alle 12 Gebäude mit Zeichen und Namen. Tipp auf ein Zeichen: man fliegt dorthin (doppelt so groß, weich per transform) und das Gebäude ist gleich offen. Ist man nah dran, zeigt ein roter Rahmen in der Karte den Ausschnitt und wandert beim Wischen mit. „Näher ran" / „Ganzes Dorf" in der Karte.
- **Doppeltipp** in die Landschaft: näher ran an genau diese Stelle (oder zurück aufs ganze Dorf). Erkannt an den Fingerpunkten – Chrome rastet einen Tipp sonst auf ein nahes Haus ein.
- **Kein neues Malen beim Zoomen**: das Bild wird immer in der Schärfe für „näher ran" gemalt und im ganzen Dorf nur verkleinert. Die Zoomstufe wird auf dem Gerät gemerkt (`dma_dorf_nah`).
- **Nebenbei gefunden**: `domAngleichen` ließ beim Wiederverwenden eines Elements anderer Art dessen alten `style` stehen (der Kompass übernahm so `left: 91,25 %` eines Hausknopfs aus dem Vektorbild und ragte 2 px heraus). Jetzt wird `style` entfernt, wenn der erste Klassenname wechselt; per Skript gesetzte Maße an gleichartigen Elementen bleiben.

### Fassung 710 (Funk 157, 156, 154, Teil von 152)
Sonden: `werkzeug/pruefe-710-leiste.js`, `werkzeug/pruefe-710-auftritt.js`.
- **Das leere Feld in der Leiste (Funk 157)**: es war die ausgerüstete Tier-Fähigkeit – bei Xander der Regenbogendrache (Server: `faehigkeit = regenbogendrache`). Die Bildhülle hatte `height: 100 %` in einem Knopf ohne feste Höhe, also 0 px: das Tier war unsichtbar, das Feld leer. Jetzt 22 × 22 px wie die anderen Bilder. Das erklärt auch Funk 152 („man weiß gar nicht ob man das jetzt ausgewählt hat"): die Auswahl war gespeichert, nur nicht zu sehen. Ein Tipp aufs Feld macht „Regenbogenfeuer" bereit (dann aufs Gesicht tippen).
- **Leiste unten ordnen (Funk 157)**: Menü → Mehr → „Leiste unten ordnen": alle Felder als große Kacheln (Taschen, Heilen, Tränke, Superkraft, Tier-Fähigkeit, Klassenkraft, Zauber, Makroknopf, Reparieren); antippen, dann ◀ / ▶. Unten steht die Leiste sofort genauso; gemerkt auf dem Gerät (`dma_spiel_leiste`). Was gerade nicht gebraucht wird, ist unten nicht zu sehen, sein Platz bleibt gemerkt. Der Controller bleibt vorn.
- **Auftritt: Ton und Bild zusammen (Funk 156)**: die Töne liefen ab dem Aufruf, die Animation erst ab ihrem ersten gezeichneten Bild – das kam spät, wenn das Foto noch entpackt werden musste oder die Seite beim Betreten beschäftigt war. Jetzt wartet der Auftritt, bis das Foto entpackt ist (höchstens 0,4 s), startet dann alle Teile gemeinsam, und jeder Ton zählt ab dem echten Start der Animation. Gemessen: normal Bild 34 ms / Ton 56 ms; Foto 0,3 s langsamer Bild 366 / Ton 398; Seite 0,45 s blockiert Bild 504 / Ton 530; die Bremse quietscht auf 2 ms genau, wenn der Wagen hält.
- **Gesicht im Kreis (Funk 156)**: der runde Ausschnitt nahm die Mitte des Fotos – bei einem Hochformat-Porträt Hals und Brust. Jetzt liegt er oben (`object-position: 50% 22%`), im Platz und beim mitfahrenden Bild. Quadratische Bilder ändern sich nicht. Ehrlich: Xanders eigenes Foto habe ich nicht (es liegt nur auf seinem Gerät); geprüft mit einem Hochformat-Testbild.
- **Klassen (Funk 154)**: Antwort per Walkie (283): nichts wird zurückgesetzt; die Kämpferklasse kommt dazu, Wechsel kostenlos alle 10 Minuten, jede Klasse behält ihre Erfahrung; keine Pflicht für neue Spieler.

### Fassung 711 (Funk 158, Teil 1: Dorf-Bedienung und Nacht)
Sonde: `werkzeug/pruefe-711-dorf-bedienung.js` (Android, 360 px, echte Finger). `pruefe-708` prüft die Nacht jetzt im gemalten Bild.
- **Scrollen bricht nicht mehr ab** („wenn man oben ist kommt man z.B nicht ganz runter"): das Dorfbild hielt jedes Wischen fest (`overscroll-behavior: contain`) – wer auf dem Bild wischte, bewegte das Menü nicht, und das Bild ist fast so hoch wie das Menü. Jetzt gehört senkrechtes Wischen im ganzen Dorf immer dem Menü (gemessen: 0 → 105 px); näher dran scrollt erst das Dorf, am Rand geht es im Menü weiter.
- **Kleine Sicht ohne Zeichen**, im Kompass „Zeichen an/aus" (gemerkt).
- **„fertig" antippen sammelt ein**: steht an einem Haus „fertig" (oder liegen Eier/Milch bereit), holt ein Tipp aufs Haus es ab bzw. melkt/sammelt – ohne Station. Der nächste Tipp öffnet das Haus wie gewohnt.
- **Schließen und zurück**: unten im Dorf steht immer (klebt am unteren Rand) „↑ Zum Dorfbild" und „✕ Dorf schließen".
- **Nacht ins Bild gemalt** („realistischer Himmel der wie Nacht aussieht", „mit den Laternen"): Himmel tiefschwarzblau mit Sternen und Mond hinter den Bergen, die Szene nachtblau (unten heller – man erkennt alles), 14 Laternen an den Wegen mit Lichtkegeln, warme Fenster in jedem heilen Haus; Mühlenflügel, Rauch, Leute und Fuhrwerk nachts ebenfalls im Dunkeln. Tag und Nacht sind zwei gemalte Bilder (je einmal gemalt, dann aus dem Speicher). Gemessen: Himmel RGB 2/4/13, Wiese 3× so hell, Laterne 255/250/178.
- **Doppeltipp** rein/raus war seit 709 da; im ganzen Dorf ist jetzt `touch-action: pan-y` gesetzt, der Browser zoomt dabei nicht mehr selbst.
- **Noch offen aus Funk 158**: Häuser/Berge/Wiese/Neuschwanstein realistischer, Effekt-Kacheln mit den echten Zeichnungen (AirPods Max als „Musik", Lok, Delfin, Frosch), Viper/Firebird/Optimus Prime nach Vorbild, Eisenbahn für Export/Import, Angeln am See im Dorf, kleine Menschen/Kutsche/Beladen.
- Die feste Zeile unten verdeckt nichts: das Dorf-Menü hat `scroll-padding-bottom`, was ins Bild geholt wird, bleibt über ihr stehen (vorher lagen „Ritter +", „Ausbilden", „Bauen" unter ihr – gefunden von den Sonden 683/686/702/703).
- Sonden 704 und 709 prüfen jetzt ausdrücklich das Tagbild (bzw. eingeschaltete Zeichen) – sonst hing ihr Ergebnis von der Uhrzeit ab.

### Fassung 712 (Funk 158, Teil 2: echte Zeichnungen auf den Effekt-Kacheln)
Sonde: `werkzeug/pruefe-712-kachel-zeichnungen.js` (Android, 360 px, mit vergrößerter Lupe). `pruefe-runde85b` tippt jetzt „Musik".
- **„Hörer" heißt „Musik"** und zeigt die AirPods Max aus der Kopfhörer-Animation (Brücke, zwei Metallbügel, Muscheln, Digital Crown), verkleinert. Die Sprühdosen-Kachel „Musik" behält ihre Noten: das Bild gilt nur zusammen mit dem Kopfhörer-Zeichen.
- **Dampflok, Delfin, Frosch** im Anreise-Menü (freien Platz halten) zeigen dieselbe Zeichnung wie die Reise – Lok mit drei Speichenrädern, Messing und Laterne; Frosch mit berechneten sitzenden Hinterbeinen.
- Technisch: Die Zeichnungen stehen jetzt in eigenen Funktionen (`lcLokSeiteSvg`, `lcDelfinFormSvg`, `lcFroschBildSvg`, `lcApmSvg`). Animation und Kachel teilen dasselbe Bild; ändert sich die Zeichnung, ändert sich die Kachel mit. Auf der Kachel läuft keine Bewegung.
- Gegengeprüft: Die Sonden für Kacheln (660), Kopfhörer (hoerer-klammern, runde74, runde85b), Frosch (runde88), Delfin (runde95), Lok (runde97) und Wegfahrzeuge (runde98) sind grün.

### Fassung 713 (Funk 158, Teil 3: alle Kacheln mit echter Zeichnung, Viper und K.I.T.T. nach Vorbild)
Sonde: `werkzeug/pruefe-712-kachel-zeichnungen.js` (erweitert: Galerie aller Kacheln mit echter Zeichnung, Auftritts-Kacheln, Autos).
- **„bei sämtlichen Sachen wo wir das Bild dazu haben"**: Flugzeug, Segelboot/Boot, Raddampfer, Helikopter, UFO, Katze, Hut, Bumerang, Eimer, Zwille, Hammer, Waschmaschine, Tennis, Sonnenbrille, Gong und Tritt zeigen jetzt ihre echte Zeichnung (dazu Musik, Dampflok, Delfin, Frosch aus 712). Im Auftritt-Menü zeigen Sportwagen, Hot Rod, Colt-Seavers-Truck, K.I.T.T. und Viper ihren echten Wagen.
- Nicht übernommen: „Wecker" (die Animation zeichnet nur das Zifferblatt als SVG, der rote Wecker ist CSS), Greifvogel, Pferd, Hand, Maulwurf, Pfeil und Bogen, Sahne, Katapult (ihre Zeichnung hängt an Hilfsfunktionen und Werten, die nur während der Animation existieren — beim Greifvogel zuerst versucht, beim Laden fehlte `greifReihe`, deshalb zurückgenommen).
- **Dodge Viper neu** („das sieht nicht aus wie ein Dodge Viber … recherchiere den vorher und dann baue den wirklich so nach wie er im Original ist"): Viper SRT GTS (5. Generation) in der Seitenansicht — sehr lange Haube mit hochgezogenen Kotflügel-Buckeln, Kabine weit hinten mit Doppelbuckel-Dach, Kiemen hinter dem Vorderrad, Seitenauspuff im Schweller vor dem Hinterrad, kräftige Hüfte über dem Hinterrad, Entenbürzel, Fünf-Doppelspeichen-Felgen mit rotem Bremssattel. Proportionen aus Länge, Radstand, Höhe und Überhängen gerechnet.
- **K.I.T.T. neu** („recherchiert diese Modelle noch mal und mach sie so nah wie möglich am Original"): Pontiac Firebird Trans Am 1982 — vorher sah er aus wie eine viertürige Limousine. Jetzt zwei Türen, flache Keilnase mit dem roten Lauflicht, lange flache Haube mit Klappscheinwerfer-Fuge, steile Scheibe, T-Top, große gewölbte Heckscheibe, Seitensicke, Turbinen-Felgen. Lauflicht und drehende Räder bleiben (gleiche Klassen).

### Fassung 714 (Funk 158, Teil 4: der Transformer ist Optimus Prime)
Sonde: `werkzeug/pruefe-714-optimus.js` (Android, 360 px, Bildschirmfotos der Verwandlung).
- XANDER (wörtlich): „der soll nicht einfach so transformieren und dann ist das Bild da plötzlich sondern da soll noch ein bisschen weiter gehen die Animation und er soll praktisch nicht mein Bild dahin setzen mit seinen Händen oder irgendwas und dann als Transformer weiteren und nicht als Auto weiterfahren vielleicht kannst du da den originalen Optimus Prime nehmen". Das „nicht" vor „mein Bild dahin setzen" lese ich als Diktierfehler (vermutlich „noch"): der Satz davor beklagt genau, dass das Bild „plötzlich" da ist. Deshalb setzt er es jetzt sichtbar mit den Händen ab. Falls anders gemeint: Rückfrage im Walkie.
- **Neu gezeichnet nach G1-Optimus-Prime**: roter Frontlenker-Truck (Chrom-Auspuffrohre, fünf Dachlampen, Lufthorn, blauer Rahmen, Chrom-Tank); als Roboter von vorn: blauer Helm mit Ohrflossen und Kamm, silberne Mundplatte, rote Brust mit den zwei Fahrerhaus-Scheiben, Kühlergrill als Bauch, Auspuffrohre an den Schultern, blaue Beine mit Rädern und Knieplatten.
- **Ablauf beim Kommen**: der Truck fährt vor, das Bild sitzt im Seitenfenster → Verwandlung (Beine fahren aus, Arme klappen heraus, der Kopf steigt aus der Brust) → er hält das Bild zwischen beiden Händen → geht in die Knie und setzt es auf den Platz → richtet sich auf, nickt, grüßt → **geht als Roboter davon** (sechs Schritte, Beine im Wechsel, der Körper wippt, jeder Schritt hörbar).
- **Beim Gehen**: er kommt zu Fuß, nimmt das Bild in die Hände, verwandelt sich zurück und fährt mit dem Bild im Fenster davon.
- Die Auftritt-Kachel „Transformer" zeigt Optimus Prime als Roboter.

### Fassung 715 (Funk 158, Teil 5: das Dorf natürlicher gemalt, Neuschwanstein, Fuhrwerk mit Leuten)
Sonden: 704, 708, 709, 711, 702, 703, 700, 686, 683 grün; Malzeit 1232 px bei 4× gedrosselter CPU: 479 ms (Grenze 1,5 s).
- **Keine Lineal-Kanten** („die Häuser sollen keine perfekten Vektor Geometrien sein … es soll ganz natürlich sein"): nach dem Malen geht ein Pinsel über das Bild und verschiebt jede Stelle um einen Hauch (weiches Rauschen, höchstens ±0,35 Welt-Einheiten). Mauern stehen minimal schief, Dachkanten, Wege und Ufer werden unregelmäßig.
- **Berge** („die Struktur der Berge sollte verbessert werden"): Licht und Schatten der Flanken laufen nach unten weich aus (vorher harte Streifen bis zum Fuß); kurze, schräge Rinnen unter den Graten mit belichteter Rippe daneben, Geröllkegel am Fuß.
- **Wiese** („dass die Wiese nicht so gerendert aussieht"): gemalte Halme in fünf Grüntönen, in Büscheln gehäuft, nach hinten kleiner.
- **Neuschwanstein** („muss viel echter am Original sein"): neu nach dem Blick von der Marienbrücke — weißer Palas mit Steildach und Rundbogenfenstern, Balkon, der schlanke Treppenturm als höchster Punkt, Ecktürme mit spitzen Hauben, der Ritterhaus-Flügel, der rötliche Torbau mit Zinnen, der Fels mit Nadelwald.
- **Schnee** (aus Funk 150/152): schneit es draußen, bekommt das Dorf ein eigenes Bild — Schneedecken auf den Dächern (unten an der Traufe unregelmäßig), verschneite Wiese und Äcker; die Wege bleiben ausgetreten.
- **Fuhrwerk** („so richtig sehen dass die kleinen Räder rollen … und man soll auch die Leute sehen die das gerade beladen"): die Räder drehen sich nur während der Fahrt, das Pferd trabt nur in Fahrt; an der Mühle trägt der Müller einen Sack zum Wagen, an der Bäckerei trägt der Bäcker ihn hinein — auf demselben 18-s-Takt wie die Fahrt.

### Fassung 716 (Funk 158, Teil 6: die Eisenbahn im Dorf mit Export und Import, Angeln am See)
Sonde: `werkzeug/pruefe-716-bahn-see.js` (Android, 360 px, echte Finger, verstellte Uhr; Zug mit Rauch bei 4× gedrosselter CPU: 53 Bilder/s). Gegengeprüft: 683, 686, 692, 700, 702, 703, 704, 707, 708, 709, 711, 712, 660, 714, 696, runde71, runde88-frosch, runde97-lok, runde92 (/lok) grün. Server: `spiel_bahn_zug`, `spiel_bahn_info`, `spiel_bahn`, `spiel_angeln` mit Platz 99 (Migration `spiel_716_bahn_see`, im Rücksetz-Versuch geprüft).
- XANDER (wörtlich): „im Übrigen kann auch in meiner Stadt eine Eisenbahn fahren und die könnte z.B Export ermöglichen oder Import das da waren behandelt werden und dass wir die beliefern müssen und und rausschicken müssen und dann können wir ja die Eisenbahn nehmen die wir schon haben mit realistischen schönen Rauch" und „dass man irgendwo angeln kann im Dorf einfach auf den See klickt und die Angler dann Angeln".
- **Die Strecke** läuft vorn am unteren Bildrand durchs ganze Dorf (dort steht der Zug vor allem anderen, nichts muss ihn verdecken): Schotterbett, Holzschwellen, Schienen mit hellem Kopf, eine Steinbrücke über den Fluss, unten am See entlang. **Bahnhof** rechts neben den Feldern: Backsteinhaus mit Schieferdach, Bahnsteig mit weißer Kante, Stationsschild, Kisten und Säcke, Formsignal.
- **Der Zug** ist die Lok vom Platz (dieselbe Zeichnung wie beim Einzug), dahinter Tender, gedeckter Güterwagen, Rungenwagen mit Stämmen und Kesselwagen. Er fährt nach der Uhr, für alle gleich, jede Minute: rollt ein, bremst, hält 14 s am Bahnhof, fährt wieder an und verlässt das Dorf. Die Räder drehen sich genau so weit, wie der Zug rollt (Strecke ÷ Radius), im Stehen stehen sie; die Kuppelstange wandert mit dem Kurbelzapfen im Kreis.
- **Rauch**: Stoß für Stoß aus dem Schlot — beim Anfahren genau im Takt des „lokstampf"-Tons (sieben Stöße, 460 → 200 ms), die ersten dunkel; dazu Dampf aus den Zylindern. Jede Wolke quillt aus drei Ballen, steigt gebremst auf, wird breiter, verweht nach hinten und vergeht. Im Stehen nur ein dünner Faden.
- **Töne im Takt**: Glocke kurz vor dem Stillstand, vor der Abfahrt der Pfiff, 350 ms später das Stampfen, dann das Schienengeräusch (wie beim Einzug, Runde 99). Nur solange das Dorf offen ist.
- **Bahnhof antippen**: je Zug (alle 20 Minuten) ein Export-Auftrag (z. B. „3 Brot verladen", bringt das 1,6-fache des Marktwerts) und ein Import-Angebot (z. B. „4 Erz kaufen", kostet das 1,3-fache). Jeder nur einmal je Zug; danach steht „verladen ✓". Beim Verladen steigt die Ware über dem Bahnhof auf und die Kasse klingelt.
- **See antippen**: die zwei Angler am Ufer werfen aus (Schwung zurück, Pose fliegt im Bogen und klatscht nach 0,45 s ins Wasser, Ring auf dem Wasser), bei 1,2 s beißt etwas, dann holt einer den Fang ein — der Fisch hängt an der Schnur, „+2 Fisch" steigt auf. Danach 12 s Pause wie bei den Teichen.
- **Mitbehoben**: Die Lok auf der Kachel „Dampflok" (seit 712) war nur ein Umriss — ihre Lackfarbe hängt im Stylesheet an `url(#lokLack)`, und die Kachel benennt die ids um. Solche Teile bekommen den umbenannten Verlauf jetzt direkt am Element (auch die Katze). Und `pruefe-runde92-betrieb` kannte die Gleisspuren im Gesicht nach „/lok" nicht (Funk 84: „dann muss er das Pflaster nehmen") und meldete sie als Rückstand; das war schon in Fassung 711 so und ist jetzt in der Liste dessen, was bleiben darf.
- Bahnhof und See sind keine Gebäude des Dorfs: sie haben eine eigene Tippfläche (`sp-dl-ort`) und zählen nicht zu den zwölf Bauplätzen. Die Zug-Ebene rechnet höchstens 25 Bilder je Sekunde und im Leerlauf (kein Zug, kein Rauch, niemand angelt) nur fünf – beim ersten Lauf war das Gewitter im Dorf sonst unter 40 Bilder/s gefallen.

### Fassung 717 (Funk 165: die Lok fährt hinten durch die Stadt, Menschen kleiner als die Lok)
Sonde: `werkzeug/pruefe-716-bahn-see.js` (erweitert). Gegengeprüft: 683, 686, 692, 700, 702, 703, 704, 707, 708, 709, 711 grün.
- XANDER (wörtlich): „die Lok soll aber mehr hinten lang fahren hinten in der Stadt nicht vorne wo man sie kam noch sieht unten ein Bild hat und es soll die originale Lok sein die wir eh schon gebaut haben" und „die Lok muss auch in Relation sein die größten Relation müssen stimmen die die Leute können nicht größer sein als die Lokomotive die Menschen sollen klein sein".
- **Strecke hinten**: sie folgt dem hinteren Rand der Wiese vor den bewaldeten Vorbergen (tiefster Punkt y = 67 von 200 statt vorher 197). Der Bahnhof steht hinter dem Gleis zwischen Mühle und Rathaus; die Lok bleibt dieselbe wie am Platz.
- **Verdecken**: der Waldrand, die Mühle, das Bergwerk und die Türme von Rathaus und Schule stehen vor der Strecke. Der Zug verschwindet genau hinter ihren Umrissen: die Zug-Ebene bekommt eine Maske, die mit denselben Malfunktionen aus diesen Bäumen und Gebäuden ausgespart wird.
- **Menschen kleiner**: die Dorfbewohner waren 13 Einheiten groß (höher als ein Stockwerk), jetzt 7,4 – knapp so hoch wie eine Haustür und kleiner als die Lok. Müller und Bäcker beim Beladen ebenso (ihr Weg bleibt gleich lang), die Angler am See auf 68 %.
- Die Steinbrücke vorn entfällt (die Strecke kreuzt den Fluss jetzt oberhalb seiner Quelle).

### Fassung 718 (Funk 161/163/164/165: Ton, Mikrofon, Verbindung, Profilbild)
Sonden: 710-auftritt (umgeschrieben: Mitte statt oben, mitfahrendes Bild füllt den Kreis), 698, runde94-anruf, runde99-privat, runde99-rueckfrage, tonriegel, 659-verbindung, 645-ton-telefon, 687, 696, 714, reisen34, runde92-reisenummern, 710-leiste, runde66/71/73/74 grün. Ein echter Test mit zwei Geräten ist von hier aus nicht möglich.
- XANDER (wörtlich): „ich kann den anderen Spiel überhaupt nicht hören" (Funk 161), „hast du mal geschaut warum ich mit niemanden mehr sprechen kann auch das Mikrofon im Chat wenn ich dir etwas übers Walkie-Talkie schicken will sobald ich da mit jemanden spreche … schaltet sich das wieder aus wenn jemand da ist" (Funk 163), „kümmere Dich auch um die Verbindung weil ich konnte mit Emmi vorhin überhaupt nicht spielen" (Funk 165), „Mein Profilbild hängt von Grund auf zu tief und es wird immer noch zu tief hineintransportiert es ist nicht mehr wie vorher" (Funk 161).
- **Sprechen nach dem Walkie-Diktat** (Fehler seit 698): das Diktat lieh sich nur die Live-Spur, zwei weitere Mikrofon-Nutzer (warm gehaltene Sprachnachricht-Spur, „Dauernd an") blieben offen → Android brach mit „aborted" ab. Zurückgeholt wurde genau einmal, sofort – schlug das fehl, war man stumm, ohne es zu merken. Jetzt werden alle drei abgegeben, das Diktat startet 350 ms später und versucht es bei „aborted" einmal nach, das Live-Mikrofon kommt mit drei Versuchen zurück (0,4 / 1,2 / 3 s), „Dauernd an" wird wiederhergestellt, und klappt es nicht, steht es im Chat. Während des Diktats hören die anderen einen nicht (Android erlaubt nur einen Mikrofon-Nutzer).
- **Relais-Zugangsdaten** liefen mitten in der Sitzung ab und wurden nie erneuert: aus dem Gerät nur noch unter einer Stunde alt, alle fünf Minuten geprüft und nach einer Stunde frisch geholt, sofort an alle Leitungen gegeben; bei „failed" erst frische Daten, dann Neustart der Wegesuche.
- **Die Wache je Leitung lief nie** (zwei Funktionen hießen „wacheStarten", die spätere gewann): /verbindung zeigte immer „Ton KEINER", die Warnung „kommt kein Ton an" kam nie, und der Neustart bei „failed" griff nie. Umbenannt.
- **Stimmen, die Android pausiert** (Spracherkennung, Anruf), werden alle 4 s, beim Zurückkehren auf die Seite und nach dem Diktat wieder angespielt.
- **Ton-Vorrat**: eine neue Stimme nahm blind das erste Element – auch eines, auf dem gerade eine Sprachnachricht lief; zurückgelegte Elemente blieben „belegt" oder stumm. Beides behoben.
- **Ein Telefonat endet**, wenn einer der beiden geht oder man selbst den Raum verlässt (vorher hörte man danach niemanden mehr).
- **Profilbild**: der Ausschnitt „oben" aus Fassung 710 schob bei Hochformat-Fotos das Gesicht nach unten (quadratische Bilder wie Emmis Fuchs merkten nichts) – zurück auf die Mitte wie vorher. Das Bild, das beim Auftritt mitfährt, füllte seinen Kreis nicht (man sah nur den oberen Teil des Fotos, beim Landen sprang es) – jetzt füllt es ihn wie auf dem Platz.
- **Helikopter** („dass du es unten beschneiden sollst", Funk 163): das Bild hat im Fenster die Größe des Platz-Ausschnitts, steht oben an und wird nur unten von der Kanzel abgeschnitten.

### Fassung 719 (Funk 152/163/165: der kleine Doppelring, Minen & Bomben, Leiste mit + und −)
Sonden: `werkzeug/pruefe-719-ring.js` (neu, Android 360 px, echte Finger), 710-leiste (erweitert um − und +), dazu umgestellt auf den Ring: 649, 652, 655, 664, 668, 686. Gegengeprüft: 633, 650, 651, 654, 678, 692, 709 grün.
- XANDER (wörtlich, Funk 165): „der Ring muss deutlich kleiner sein ich habe auch gesagt dass die zwei Ringe Zauber und und Waffen in einem Modul sind aber nicht so mit diesen äh dass man erste die Tür öffnen muss und dahin zu kommen außerdem möchte ich dass man es mit einem langen gehaltenen Tipp anschaltet dass man es mit einem langen gehaltenen Tipp wieder ausschalten kann der Sound dafür ist okay aber diese Türen sind nicht gut ich möchte dass es zwei Ringe ineinander sind bzw dass man das logisch so aus auswählen kann also man legt sich sowieso für jeden Bereich eine Waffe fest oder zwei keine Ahnung und auch in dem kleinen Kreis kann man dann auf den Bereich einer Waffe klicken und dann andere Waffen aus diesen Bereich auszuwählen die dann in einem waagerechten Lehrer über dieser Position zu finden sind" und „was für die Minen und Bomben überlegen wie die in diesem Kreis zu finden sind die sind ja nicht unter den generellen Waffen".
- **Ein Modul, 216 px** statt bis zu 360 px (Waffenrad) bzw. 236 px (Tür-Wahl). Außen ein Feld je Bereich (Standard, Lustig, Arcade, Stark, Meister, Energie, Minen & Bomben – nur die, in denen man etwas hat), jedes mit der Waffe, die man für diesen Bereich festgelegt hat; innen die neun Zauber mit Mana-Preis (gesperrte mit „Lv"); dazwischen der Mana-Bogen; in der Mitte die Hand (Waffe und Zauber ablegen), der Zauberer-Rang und „Mana … Zahl = Preis"; oben Torte/Kuchen/Manatrank.
- **Langer Druck** aufs eigene Bild öffnet den Ring sofort (keine Tür „Zauber | Waffen" mehr), ein zweiter langer Druck schließt ihn, mit demselben Klang. Auch der Tipp auf die angelegte Waffe in der Leiste und der Makroknopf „Zauber" öffnen denselben Ring.
- **Bereich antippen**: dessen Waffe ist sofort angelegt; hat der Bereich mehr als eine, schneidet eine waagerechte Leiste den Ring genau auf der Höhe dieses Feldes und zeigt von links nach rechts alle Waffen des Bereichs – fehlende blass mit Preis (antippen: Hinweis auf den Laden). Tipp auf eine Waffe in der Leiste: für den Bereich festgelegt (auf dem Gerät gemerkt), angelegt, Ring zu. „Lustig ✕" über der Leiste klappt nur die Leiste zu.
- **Minen & Bomben**: eigener Bereich mit Mine (30 P), Falltür (25 P) und der Kuckucksuhr-Bombe (vorher bei „Meister"). Mine oder Falltür antippen startet das Legen – danach auf den Platz tippen, wie aus dem Laden.
- **Leiste** (Funk 163: „die Superkraft von meinem Tier … die möchte ich an dritter Stelle haben ja standardmäßig auch … danach kommen die Tränke und die Gesundheit … und dann weitere Sachen wenn ich möchte per Pluszeichen hinzufügen"): ab Werk Controller, Waffen, Tier-Fähigkeit, Gesundheit, Tränke, Superkraft, Klassenkraft, Zauber, Makroknopf, Reparieren. Wer schon selbst geordnet hatte, behält seine Ordnung – nur die Tier-Fähigkeit rückt einmal an Platz 3. Im Menü (Mehr → Leiste unten ordnen) nimmt „− … herausnehmen" ein Feld heraus; es steht dann unter „Weitere" mit +, und unten am Ende der Leiste erscheint ein kleines +, das direkt dorthin führt.
- **3× aufs eigene Bild = Tierkraft** (Funk 163: „bei dreimal teppen den tierpower aufruft"): der zweite Tipp wechselt weiter sofort die Waffe; kommt innerhalb von 0,38 s ein dritter, wird der Wechsel zurückgenommen und die ausgerüstete Tier-Fähigkeit ausgelöst.
- **4× = Gesundheit, 5× = Manatrank** (Walkie 287, gewählt: „Trotzdem 3×/4×/5× tippen", „Gesundheit und Trank in den Ring, nur 3× für Tierkraft" und „Beides: Ring und Mehrfachtipp" – also beides): nach dem 3. und 4. Tipp wartet es 0,38 s, ob noch einer kommt; der 5. wirkt sofort. 4× heilt mit dem, was gerade passt (wie das Herz in der Leiste); 5× trinkt den Manatrank, und ohne Manatrank geht die Tränke-Auswahl auf (dort „Manatrank kaufen"). Im Ring stehen oben in der Lücke Herz (Gesundheit), Tränke, Torte/Kuchen und Manatrank.
- **Noch offen**: „jedes Tier soll seine Power aufladen können nicht nur bei einem Tier" – bisher lädt nur die eine ausgerüstete Fähigkeit.

### Fassung 720 (Funk 159/160/163/165: Laternen mit Lichtkegel, klarere Nacht, größerer See, Wasser, runde Dachkanten, Vögel in der Nacht)
Sonden: 711 (Laternenpunkt auf die neue hohe Laterne umgestellt), 716, 708, 704, 700, 709, 686, 683 grün. Malzeit des ganzen Dorfs gemessen: 144 ms (einmal je Zustand).
- XANDER (wörtlich, Funk 163): „die Laternen müssen realistischer werden die sind ein normales ein bisschen höher die können nicht so flach sein … du sollst nicht beim Haus überall ein Licht haben du sollst es dort wo es realistisch ist und der Lichtkegel soll das ganze Haus bestrahlen … aber nicht mit so einem diffusen Licht arbeiten sondern realistisch dass man dort diesen Lichtkegel hat" – (Funk 165): „die Laternen soll nicht immer direkt im Gesicht des Hauses sein man soll die schöne Struktur des Hauses noch erkennen" – (Funk 159): „die Nacht kann etwas deutlicher sein man sieht die Häuser kaum noch weil sie ein bisschen verwaschen wirken".
- **Laternen**: statt 14 kleiner Funzeln (6 Einheiten) steht neben jedem gebauten Haus eine hohe Laterne (13 Einheiten: Sockel, Gusseisen-Mast, Laternenhaus mit Glas, Dach mit Knauf), auf der Seite mit mehr Platz; dazu drei an den Wegen. Ein kaputtes Haus hat eine dunkle Laterne.
- **Lichtkegel statt Lichtflecken**: die Lichtflecken mitten auf den Häusern sind weg. Nachts liegt im Kegel jeder Laterne das Bild so, wie es am Tag gemalt ist – warm gefärbt –, mit allen Balken, Fenstern und Ziegeln: ein Lichtfleck am Boden und ein Kegel, der sich zum Haus neigt und die Front ausleuchtet. Im Dunst ist der Kegel als feiner Schein zu sehen.
- **See** (Funk 165: „der See ist viel zu klein"): gut viermal so groß, eine unregelmäßige Bucht am unteren Rand, mit Schilf und Rohrkolben in Büscheln, Seerosenblättern und einer Blüte. Die Angler stehen an den neuen Ufern, die Tippfläche ist mitgewachsen.
- **Wasser** (Funk 165: „der Fluss hat noch keine schöne Struktur … das Wasser in der Natur ist ja auch nicht perfekt das hat jetzt zufällige Strukturen"): Grundton zur Tiefe dunkler, großflächig ungleichmäßig (ein über die ganze Fläche gezogenes Rauschen statt Kacheln), einzelne Kräuselungen jede anders, flaches grünlich-braunes Wasser am Ufer, heller Ufersaum, Himmel-Widerschein. Die Kachel ist nur noch zu einem Drittel zu sehen.
- **Runde Dachkanten** (Funk 165: „ich möchte auch nicht dass die häuserkanten so eckig sind an den Dächern"): Dachflächen mit runden Ecken an der Traufe, die Traufe hängt in der Mitte einen Hauch durch; First und Ortgang mit runden Enden.
- **Keine Treppen mehr an schrägen Kanten** (Funk 163: „du sollst nicht mehr so harte unterbrochene Pixel Linien haben … dort habe ich jetzt Stufungen im Dach"): gefunden im „Pinsel" aus Fassung 715 – er nahm für jeden Bildpunkt den nächsten Nachbarn, schräge Kanten bekamen Treppen und Lücken. Jetzt mischt er weich zwischen vier Nachbarn.
- **Vögel in der Nacht** (Funk 165: „die Vögel sind auch noch nicht da die zufällig am Himmel so durch die Nacht segeln"): nachts ziehen seltener ein bis drei Vögel vorbei, langsamer, mehr segelnd, vom Mond hell angestrahlt; dazu ein leiser Flügelschlag statt Zwitschern.
- **Noch offen**: Berge und Wiese noch zufälliger (Funk 165), Stadt selbst benennen (Funk 160), echte kleine Menschen mit Animation (Funk 160/165), Kompass im Miniaturbild und Symbole/Labels-Schalter (Funk 159).

### Fassung 721 (Funk 159/160: ein Bild mit Lupe und kleiner Karte, Symbole/Namen-Schalter, kleines Haus statt Knopfzeile, Stadt benennen)
Sonden: 709 (umgestellt: Kompass = Lupe, kleine Karte mit Punkten), 711 (umgestellt und erweitert: Symbole/Namen-Schalter, kleines Haus, Ortsschild), dazu 683, 686, 692, 700, 702, 703, 704, 707, 708, 716 grün. Server: Spalte `dorf_name`, `spiel_dorf_name(p_name)` (SECURITY DEFINER), `spiel_oeffentlich` gibt den Namen mit (Migration `spiel_721_dorf_name`; mit dem Testkonto geprüft und wieder geleert).
- XANDER (wörtlich, Funk 159): „Diese kleinen Panels sollen nicht da stehen mit zum Dorf und Dorf schließen da kannst du einfach das kleine Haus Symbol noch haben wo man dann automatisch dahin springt und ich möchte dass das kleine Bild was wir haben schon den Kompass hat nicht dass das drei unterschiedliche Bilder sind … diese Lupe wie in den anderen Spielen mit den kleinen Punkten auf der Karte wo man hinkriegen kann … und dann kann man so entweder Zeichen oder Labels oder ohne … dann soll in dem Zustand natürlich die Option vorgeschlagen werden ob man es ausschalten möchte und nicht umgekehrt … wenn man keine Symbole hat soll man gefragt werden Symbole an oder Labels an oder beides an oder alles aus".
- **Ein Bild statt drei**: der Kompass ist die Lupe (mit „+“ bzw. „−“): ein Tipp holt näher ran oder zeigt wieder das ganze Dorf (wie der Doppeltipp). Das eigene Kartenfenster entfällt. Ist man nah dran, liegt unten in der Ecke eine kleine Karte: das ganze Dorf, ein farbiger Punkt je Gebäude, ein roter Rahmen, wo man gerade ist (er wandert beim Wischen mit); ein Tipp auf einen Punkt fährt dorthin und öffnet das Gebäude.
- **Symbole und Namen** getrennt: unten links im Übersichtsbild ein kleiner Knopf; er bietet nur an, was zum jetzigen Zustand passt – alles aus: „Symbole an“, „Namen an“, „Beides an“; Symbole an: „Symbole aus“, „Namen an“ …; beides an: „Alles aus“, „Symbole aus“, „Namen aus“. Gemerkt auf dem Gerät.
- **Kleines Haus** statt „↑ Zum Dorfbild / ✕ Dorf schließen“: schwebt unten rechts, ein Tipp springt hinauf zum Dorfbild. Schließen: ✕ oben oder das Haus in der Leiste.
- **Stadt benennen** (Funk 160): oben im Bild ein gelbes Ortsschild wie an deutschen Ortseinfahrten; Tipp → kleines Fenster, 2–24 Zeichen (Buchstaben mit Umlauten, Zahlen, Leerzeichen, Bindestrich, Punkt, Apostroph – der Server prüft). Die Nachbarn sehen den Namen neben dem Spielernamen.
- **Mitbehoben**: der Klick, der nach einem Tipp aufs Schild auf dem neuen Fenster landete, schloss das Dorf dahinter (der allgemeine „Tipp daneben schließt“-Wächter kannte das Fenster nicht).
- **Diktat „aborted“ (Funk 166, automatisch, Samsung Internet, nach 718)**: der zweite Versuch galt nur, wenn das Livestream-Mikrofon ausgeliehen war und die Erkennung noch nicht lief. Jetzt bei jedem „aborted“, solange noch kein Wort angekommen ist; eine ältere, noch laufende Erkennung wird vor dem Start beendet; der automatische Bericht nennt jetzt den Zustand (geliehen, an, zweiter Versuch, ms seit dem Tipp). Sonde runde99-rueckfrage grün. Auf dem Samsung-Gerät selbst nicht prüfbar.

### Fassung 722 (Funk 167: Rundenkampf mit Höchstwerten, Schild zuerst, Superkraft, Rüstung, Fairness; Fragen nach dem Lernprofil; Laterne hinter dem Haus)
Sonden: 701 (Rundenkampf zu zweit, erweitert um 722), neu 722-fragenart, dazu 669, 675, 694, 704, 711, 716, 719 grün. Server: `spiel_extra_lohn` gibt Mut-Punkte fürs höhere Niveau (Migration `spiel_722_extra_lohn_niveau`).
- XANDER (wörtlich, Funk 167): „das Schild was man sich aufbaut das darf nicht endlos Sterne haben … Maximalwert … die Schilde müssen auch eine Funktion haben dass man erst durch die Schilde kämpfen muss und dann das Leben angreift … der blaue Wagen liegt über dem eigentlichen roten bzw grünen was die Lebensanzeige darstellt ja wenn sie schwächer wird wird sie gelb … super Power mit dazu erspielen … Figuren könnten besser ausgestaltet sein … Rüstung erspielen durch irgendwelche Fragen … auf C2 und trotzdem muss mich das genauso beeinträchtigen … vielleicht gibt's dann extra Punkte wenn man sich mehr traut … fair … adaptiere diese Denkweisen bitte auch auf das Schach Prinzip … kontrolliere alles ob da irgendwas unlogisch ist".
- **Höchstwerte**: höchstens 3 Sterne (★/☆ in drei Feldern), Schild höchstens 30 („Schild 2/3“). Auch der Stand, den das andere Gerät schickt, wird auf diese Grenzen gekappt.
- **Erst das Schild, dann das Leben**: jeder Treffer geht erst durchs Schild. Über dem Lebensbalken liegt ein blauer Schildbalken; der Lebensbalken ist grün, unter der Hälfte gelb, unter einem Viertel rot und blinkt.
- **Superkraft** (neu, 3 Sterne): 26 Schaden, geht an jedem Schild vorbei. Mit Leuchten um das Bild, Donner und Schlag.
- **Rüstung erspielen**: je 3 richtige Antworten hintereinander eine Stufe Rüstung (höchstens 3); jede Stufe nimmt jedem Treffer 2 Schaden (mindestens 1 bleibt). Eine falsche Antwort setzt die Serie zurück.
- **Fair über das Niveau**: eine falsche Antwort wirkt auf jedem Niveau gleich (die Aktion verpufft). Wer sich mehr traut, bekommt mehr: schon bisher bringt jede richtige Antwort 3 (A1) bis 8 (C2) Punkte; der Lohn am Ende des Rundenkampfs (und der Fehlerteufel-Abwehr) gibt jetzt zusätzlich die Hälfte des Mehrwerts über A1 obendrauf (höchstens 10, vom Server aus den wirklich beantworteten Aufgaben gerechnet).
- **Beide Arten geprüft**: Züge (wie Schach) und Echtzeit rechnen mit denselben Regeln; der Computer-Gegner nimmt die Superkraft bei 3 Sternen (gern, wenn man Schild hat) und baut Schild nur bis zur Grenze.
- **Unlogisch war**: (1) Sterne und Schild wuchsen ohne Ende; (2) die Superkraft-Kosten wurden vor dem Stern der richtigen Antwort abgezogen – jetzt bringt auch die Superkraft-Antwort ihren Stern; (3) „Schild n/3“ zeigte bei einem angeschlagenen Schild 0 – jetzt aufgerundet.
- **Fragen nach dem Lernprofil** (Funk 167: „in Interaktion mit dem System was wir in den Einstellungen haben global auf der Webseite in welchen Bereichen wir gut oder nicht so gut sind … Fragen eher vorgeschlagen … Bereichen zu üben wo sie nicht gut sind … einstellen ob sie … die leichten Sachen … das soll aber beides möglich sein"): im Deutsch-Menü „Schwächen üben“ (vorgewählt), „Stärken (leichter)“, „Gemischt“. Das Spiel liest die Selbsteinschätzung aus dem Konto (Einstellungen der Webseite). „Schwächen“ fragt aus den als schwach markierten Bereichen, jede vierte Frage gemischt; „Stärken“ nur aus den starken. Wer eine Kategorie fest gewählt hat, behält sie. Gilt für Aufgaben, Rundenkampf und Fehlerteufel-Abwehr.
- **Laterne hinter dem Haus** (Funk 167: „immer eine Laterne die hinter deinem Haus steht die die Zeit irgendwie übers Haus"): Laternen wurden nach allen Häusern gemalt und lagen damit immer obenauf. Jetzt werden Häuser und Laternen gemeinsam von hinten nach vorn gemalt – eine Laterne hinter einem Haus verschwindet hinter ihm.
- **Nachgefragt**: „außerdem könnte man so drei Leben haben“ und „Figuren könnten besser ausgestaltet sein“ – per Walkie.

### Fassung 723 (Funk 169/170: Licht aus den Häusern, Fluss bis in den See, Äcker antippen, Angler bleiben sitzen, Fledermäuse, Lok mit Scheinwerfer)
Sonden: 711 (umgestellt: Ortsschild oben rechts, kein Haus-Knopf; neu: Äcker ernten und beim Wachsen helfen), 716 (neu: Angler bleiben sitzen und werfen nach 12 s von selbst wieder aus), 704, 709, 708, 686, 683 grün. Server: `spiel_ernten` kennt die Dorfäcker 91/92, neu `spiel_feld_helfen(p_platz)` (SECURITY DEFINER; Migration `spiel_723_dorffelder`).
- XANDER (wörtlich, Funk 169): „Dieses Extra Häuser Symbol dieses braune hat keine Funktion es verschiebt auch das Layout wenn man da drauf klickt das kannst du wegmachen und im übrigen sind da immer noch Lichter an den Häusern mach lieber so dass Lichter in den Häusern sind … vielleicht nur die hauslampe an also die über dem Eingang … aber nicht dass das Haus so wirkt als ob es brennt … wenn die Lokomotive fährt … der hat ja auch so Scheinwerfer … der Bahnhof braucht dann auch noch entsprechende Beleuchtung … auf dem Feld kann man übrigens noch nicht ernten da muss man auch draufklicken können und wenn die Angler Angeln dann Angeln sie erstmal eine Weile … und die Vögel in der Nacht die sollten nicht weiß sein … du kannst auch Fledermäuse machen". (Funk 170): „Der Fluss vom Dorf ist übrigens nicht ganz durchgängig … dieses Menü mit dem mit der Stecknadel … das verdeckt das Feld … Hybrid … dass ich ihnen helfe und mit meinen Antippen das ganze beschleunigen kann mit meinem göttlichen Finger".
- **Kleines Haus weg** (aus 721).
- **Licht aus den Häusern**: der Lichtkegel, der die ganze Hausfront ausleuchtete, ist weg; die Laternen beleuchten nur noch den Boden um sich. Dafür merkt sich jedes gemalte Fenster und jede Tür, wo es liegt: nachts leuchten etwa zwei von drei Fenstern warm von innen (Fensterkreuz bleibt als Schatten), über jeder zweiten Tür brennt die Hauslampe mit einem kleinen Schein auf der Schwelle. Kaputte Häuser bleiben dunkel. Am Bahnsteig steht eine Laterne.
- **Lok bei Nacht**: vorn der Scheinwerfer mit Lichtkegel auf die Gleise, im Führerhaus Licht.
- **Fluss**: lief unten neben dem See aus dem Bild; jetzt biegt er unter der Bibliothek nach rechts und mündet in den See. Der Weg von der Brauerei zur Bibliothek lief mitten durchs Wasser – dort steht jetzt eine zweite Steinbrücke. (Oben fließt er weiter hinter dem Rathaus – dafür müsste das Rathaus umziehen; offen.)
- **Äcker im Bild antippen**: reif → die Sense erntet (Felder 91/92 auf dem Server). Wachsend → „göttlicher Finger“: jeder Tipp holt das Feld 5 s näher an die Reife (höchstens alle 0,3 s). Abgeerntet liegen Stoppeln darauf, die mit dem Wachsen blasser werden.
- **Angler**: ein Tipp auf den See – sie bleiben eine Minute sitzen und werfen fünfmal von selbst aus (alle 12 s, so oft der Server es erlaubt), am Ende „Die Angler packen ein: n Fisch“. Fisch geht auf dem Markt.
- **Nachtvögel** dunkel (nur ein Hauch Mondlicht an der Kante); meist flattern nachts Fledermäuse – schneller Flügelschlag, Zickzack.
- **Stecknadel-Knopf** (Symbole/Namen) sitzt oben links unter dem Wetter und öffnet nach unten, das Ortsschild oben rechts – nichts liegt mehr über den Äckern oder über dem Wetterschild.

### Fassung 724 (Funk 172/171/168: Lichter wie im echten Leben, Zug und Bahnhof beleuchtet, Wetter der eigenen Stadt, Stärken & Schwächen im Spiel mit Mut-Bonus)
Sonden: 711 (neu: Fensterlichter als eigene Lichter, gehen an und aus; Stadtwetter Köln/ausgedachter Name), 722-fragenart (neu: Tabelle im Spiel, Kreuz speichert ins Konto, gemessene Schwäche wird gefragt), 716 (Einholen robust), 701, 669, 675, 683, 686, 704, 709, 719, runde99-rueckfrage grün. Server: `spiel_antwort` merkt die Kategorie und gibt den Mut-Bonus, neu `spiel_lernstand()` (Migration `spiel_724_lernprofil_bonus`).
- XANDER (wörtlich, Funk 172): „Vergiss bitte nicht den Zug entsprechend zu beleuchten realistisch da wo er beleuchtet werden könnte und den Bahnhof und überleg dir mal das nachts ja normalerweise die Menschen schlafen es muss nicht jedes Fensterlicht an sein … wenn nachts noch jemand auf Toilette muss … jemand muss auf Nachtschicht muss früh raus … da ist dann in der Küche noch Licht … jemand da ist eine Nachteule … ich habe mein Dorf schon benannt aber da steht im Hintergrund immer noch Döbeln … diese Tabelle anzeigen lassen die wir in den Einstellungen haben wo sie ihre Stärken haben wo sie ihre Schwächen haben … dass die Übersicht halt vom System erkannt wird … prozentual ausgewertet … diese Aufgaben werden halt am besten belohnt weil sie sich den stellen".
- **Lichter wie im echten Leben**: die Fenster sind nicht mehr ins Bild gemalt, sondern eigene kleine Lichter, die im Lauf der Nacht an- und ausgehen – abends etwa die Hälfte, gegen Mitternacht wenige, tief in der Nacht fast keine; die Nachteule bleibt bis drei Uhr wach; zwischendurch geht irgendwo für eine Minute Licht an (jemand steht auf); ab vier Uhr die Frühschicht. Hauslampen über der Tür abends bei knapp der Hälfte, nachts bei wenigen.
- **Bahnhof**: eigene Fensterlichter (länger Dienst: bis 23 Uhr drei Viertel an), Lampe über der Tür, zwei Laternen am Bahnsteig. **Zug**: vorn Scheinwerfer (723), hinten am letzten Wagen das rote Schlusslicht.
- **Kein „Döbeln“ mehr im Dorf**: im Wetterschild steht der Name der eigenen Stadt. Heißt die Stadt wie ein echter Ort in Deutschland, Österreich oder der Schweiz (z. B. Köln, München), kommt das Wetter von genau dort (open-meteo, alle 15 Minuten neu) – auch für die Ernte. Ein ausgedachter Name bekommt das Wetter vom eigenen Ort.
- **Stärken & Schwächen im Spiel**: im Deutsch-Menü klappt „Meine Stärken & Schwächen“ die Tabelle aus den Einstellungen auf (dieselben Daten, im Konto). Zu jedem Bereich steht, was das Spiel gemessen hat („4/10 richtig“, farbig). Ohne Kreuz zählt die Messung (ab 6 Antworten: unter 60 % schwach, unter 80 % mittel) – auch für „Schwächen üben“.
- **Mut-Bonus** (Server): Aufgaben aus schwachen Bereichen bringen +50 % Punkte, aus mittleren +20 %. Im Ergebnis steht „davon +n Mut-Bonus“.
- **Diktat** (Funk 171, automatisch): „aborted“ nach 41 s, nachdem schon Wörter angekommen waren – so beendet Samsung lange Diktate. Jetzt: der Text bleibt, keine Fehlermeldung, kein Bericht.
- **Angeln**: das Einholen blieb manchmal ganz aus (Rechenrest: 1700 ms ergaben 1,6999… s). Behoben.
- **Nachgedacht, noch offen** (Funk 172): Feuerwehr (Brand nach Angriff löschen), Bauphasen mit Kran und Bagger, Kaserne mit Training, Stadt-Spezialität (z. B. Kuckucksuhren, Metall, Touristen-Magnet), Tierprodukte verkaufen.

### Fassung 725 (Funk 168: Figur im Baukasten ziehen wie in einer App; Bilderwelten und Aussprache-Bilder auf die Tafel)
Sonden: neu 725-baukasten-ziehen (Maus, Finger nach langem Druck, knapp daneben greifen), neu 725-tafel-mappe (Ordner, NG-Bild, Bilderwelt-Szene, beides geht an alle). runde69 hat einen roten Punkt („Bildbauen steht einmal da“), der schon vor 725 rot war.
- XANDER (wörtlich, Funk 168): „im Baukasten für unsere Bilderwelt … dass man die Person von einem Punkt zum anderen ziehen kann ohne dass man zufällig aus Versehen mal etwas markiert und dann die Person nicht versetzen kann das soll immer funktionieren das ist so per Drag & Drop wie in einer App geht … hast du dich schon darum gekümmert dass wir diese Inhalte von den Bilderwelten auch auf unserem Whiteboard nutzen können und ja auch die anderen Sachen die … wir so als Tutorial für die richtige Aussprache haben diese Tricks wie man das NG produziert … dass man die auf diese Tafel legen kann … dafür muss es irgendwie extra Ordner geben".
- **Baukasten**: Ziehen mit Pointer-Ereignissen und „Capture“ (der Finger bleibt an der Figur), Zugriff auch knapp neben der Figur, ein gestrichelter Ring zeigt beim Ziehen den Platz, auf dem sie landet. Nichts im Bild lässt sich markieren, ein langer Druck öffnet kein Menü. Vorher kamen bei jedem Neuzeichnen neue Lauscher am Fenster dazu – jetzt hängen sie am Bild selbst.
- **Tafel-Mappe**: der Bild-Knopf 🖼️ öffnet drei Ordner – „Vom Gerät“, „Bilderwelten“ (30 Themen-Ordner, jede Szene mit allen Teilen) und „Aussprache“ (NG, K, ICH, ACH, Ü, Ö, lang/kurz, Dehnungs-h, Konsonanten am Stück – mit Vorschau). Ein Tipp legt das Bild auf die Tafel und schickt es allen im Raum (als JPEG, 70–110 kB).
- **Noch offen aus Funk 168**: Häuser im Dorf per Ziehen versetzen (kommt mit dem Stadt-Gestalten), Wetter-Klima für ausgedachte Städte.

### Fassung 726 (Funk 173/175: keine Lichtflecken ohne Lampe, Ortsschild mittig, Beschriftung unter dem Bild, Schild schützt immer das Leben, Schauplätze, Einwohner/Stärke)
Sonden: 701 (umgestellt: Superkraft zerschlägt das Schild; neu: „Du“ am eigenen Balken, gemeinsamer Schauplatz), 711 (umgestellt: Schalter unter dem Bild, Ortsschild mittig, Wetterschild ohne Ort; Wettlauf in der Sonde behoben), 686, 669, 683, 704, 709, 716, 722-fragenart grün.
- XANDER (wörtlich, Funk 173): „Diese einzelnen Lichtflecken sind immer noch auf dem Haus die so aussehen als würde da irgendetwas brennen sie kommen von nirgendwo her … weil das gar keine Lampe sichtbar ist die sollen verschwinden". (Funk 175): „Das startschild soll weiterhin in der Mitte sein damit es nicht den schönen Nachthimmel verdeckt und diese Stecknadel soll nicht an der Stelle sein wo du sie hast weil jetzt verdeckt sie den Bahnhof … ich möchte nicht dass da irgendwas überlappt … wenn ich das Wetter von Döbeln da eingestellt habe … dann muss das nicht Döbeln dort noch da stehen … wenn man auf das dorfschild geklickt soll die Einwohnerzahl angezeigt werden die Stärke oder das Level … es fehlt immer noch die Hintergrundgestaltung von dem Spiel … der Schauplatz des Kampfes den man auswählen kann und ob derjenige der mit mir kämpft dass auf seiner Seite individuell für sich einstellen kann … oder ob wir einen einheitlichen Schauplatz auswählen … außerdem macht es keinen Sinn weil mein Schild noch an ist und noch ein Viertel Leiste hat und mein Leben schon total verbraucht ist das Schild ist doch da und das Leben zu schützen".
- **Lichtflecken**: der kleine Schein, den die Laterne auf den Hausfuß warf, ist weg. Die Hauslampe über der Tür ist jetzt eine sichtbare Wandleuchte (Halter und Glas) mit kleinem Schein.
- **Ortsschild** wieder oben mittig; das Wetterschild links daneben ist schmaler (Zeichen, Temperatur, Wetter; die Wirkung auf die Felder als zweite kleine Zeile) und überlappt nicht.
- **Kein „Döbeln“** im Wetterschild, sobald die Stadt benannt ist – woher das Wetter kommt, steht im Hinweis beim Antippen/Überfahren („Wetter aus Döbeln“ bzw. „Wetter aus Köln“).
- **Beschriftung unter dem Bild**: die Stecknadel im Bild ist weg; unter dem Bild stehen zwei Schalter „Symbole an/aus“ und „Namen an/aus“. Im Bild liegt nichts mehr über Bahnhof oder Äckern.
- **Einwohner, Stärke, Level**: im Fenster beim Tipp aufs Ortsschild und in der Liste der Nachbardörfer (Einwohner: je Gebäudestufe 4 plus Arbeiter und Ritter; Stärke: Gebäudestufen ×3, Ritter ×6, Mauer, Graben, Turm).
- **Rundenkampf – das Schild schützt immer das Leben**: die Superkraft geht nicht mehr am Schild vorbei, sie zerschlägt es (das Schild fängt dabei noch die Hälfte ab und ist danach weg). Auch der Rückprall eines Konters trifft erst das Schild. So ist nie Leben weg, solange noch Schild steht. Der eigene Balken heißt „Du · Name“.
- **Schauplätze**: Abendrot, Dein Dorf (das eigene gemalte Dorf), Wiese, Arena, Burghof, Traumwelt, Sternennacht. „Für beide gleich“ schickt den Schauplatz mit der Einladung; sonst sieht jeder seinen eigenen und kann ihn im Kampf mit einem Tipp oben rechts weiterschalten.
- **Noch offen aus Funk 173/175**: Meldungen „fertig/angegriffen“ mit Sprung ins Dorf, Handel und Beziehungen zwischen Dörfern (OGame/Anno), realistische Rüstung und Skins, Superkräfte über Fragen erspielen, die vollständige Ideenliste (in Arbeit).

### Fassung 727 (Funk 176: ein System für Fischer, Holzfäller, Jäger und Bergleute; Fortschritt im Bild; Wetter weg vom Bahnhof)
Sonden: 716 (umgestellt: kein Dauerangeln von selbst; neu: Trupps am See und im Wald, Fortschrittsbalken, Abholen per Tipp, Wetter oben rechts), 683 (Uhr mit Ware), 708 (Testwetter vor der Ernte-Prüfung zurücksetzen – war seit 724 rot), 711, 686, 697, 700, 702, 707, 709, 722 grün. Server-Test (Rollback): Angeln holt aus der Fischer-Menge, leergefischt → 150 s Ruhe, Mithelfen −15 s.
- XANDER (wörtlich, Funk 176): „ich kann auf der Bühne endlos Fische angeln aber die am See machen gar nichts … schickst du die Fischer für eine Zeit an den See dass sie dort in Ruhe Angeln und die haben einen Standard Betrag den innerhalb von fünf Minuten … ich könnte ja helfen das und dann beschleunigt dass die Geschwindigkeit wenn ich selber aktiv werde aber das muss alles in ein System laufen und darf nicht mehr als das sein“ · „kann ich die Leute selber in den Wald schicken um Holz zu sagen oder solche Sachen ins Bergwerk … die Leute auf die Jagd schickt … haben wir überhaupt einen Wald“ · „es soll Anzeigen geben für Fortschritte im Bau oder für Fortschritte der Ernte und was geerntet wird“ · „ich möchte nicht dass diese Kompassnadel da im Weg ist wenn ich zum Bahnhof möchte“.
- **Trupps** (Server `spiel_trupp`, `spiel_trupp_helfen`, intern `spiel_trupp_s`; Stand in `werk.trupp_<ort>`): Fischer am See (6 Fisch), Holzfäller im Wald (8 Holz), Jäger (3 Fleisch), Bergleute (4 Erz, nur mit Bergwerk, je Stufe +1). Freie Dorfbewohner gehen mit: je zwei +1 (höchstens +3). Eine Fahrt dauert 5 Minuten; danach liegt der Fang zum Abholen bereit.
- **Ein System**: jedes Angeln – auf der Bühne (alle Teiche) und am See – holt aus der Menge der Fischer und macht die Fahrt 20 s kürzer; Holzhacken auf der Bühne ebenso aus der Menge der Holzfäller. Mithelfen im Bild/Menü: −15 s, Holz und Erz sofort ins Lager. Schneller als die halbe Zeit (2,5 min) geht es nicht, mehr als die Menge gibt es nie. Ist alles geholt, hat der Ort Ruhe bis zum Ende der Fahrt („leergefischt – neue Fische kommen“). Endloses Angeln ist damit vorbei. Wer angelt, ohne dass Fischer unterwegs sind, schickt sie damit los.
- **Menü und Bild gleich**: die Trupps stehen in derselben Liste wie Werkstätten und Ställe (Losschicken, Mithelfen, Abholen). Im Bild zeigen See, Waldrand (neu antippbar, rechts vom Rathaus) und Bergwerk den Stand: „Fisch 3:12“ mit grünem Fortschrittsbalken, „5 Fisch fertig“ – ein Tipp bringt es heim, genau wie „Abholen“ im Menü. Milch und Eier waren schon ein Stand (Menü und Bild rufen dasselbe `spiel_melken`/Einsammeln).
- **Der See lebt**: solange die Fischer unterwegs sind, werfen die zwei Angler sichtbar aus und holen ab und zu einen Fisch ein (nur Bild, kein Serverruf). Ein Tipp auf den See ist dein eigener Wurf (die Minute am Stück aus 723 übernimmt jetzt der Trupp).
- **Fortschritt im Bild**: an den Häusern steht, WAS entsteht („Brot 2:10“, „4 Brot fertig“), an den Äckern „Getreide 2:57“ mit Balken oder „Getreide reif“.
- **Fleisch** als neue Ware: Markt 6, essen +14 LP, macht das Volk satt wie Fisch.
- **Wetter oben rechts** in einer Zeile (Zeichen und Grad; Wetterart und Quelle im Hinweis). Links oben lag es auf dem Bahnhof.
- **Noch offen aus Funk 176**: Städte als Kette zum Durchblättern und aus dem Profil in die Stadt springen, Stadt selbst gestalten (Flüsse, Berge, Häuser), Wall/Verteidigungsanlage/Kaserne, Chat-Waffen richtig halten und gerichtet feuern (Plasmakanone zum Ziel), Tomahawk im Chat ohne Auswahl, Effekte noch schneller beim Platzwechsel, Profilbild-Effekte mit Trefferzonen.

### Fassung 728 (Funk 177: die Lichtflecken auf den Häusern und die falschen Bahnhofsfenster – Ursache gefunden)
Sonden: 711 (neu: jedes Fensterlicht liegt auf seinem Haus – im ganzen Dorf und nah dran –, keine Türlampen; gegen Fassung 727 rot mit 17 Lichtern neben Mühle, Schule und Rathaus), 708 (umgestellt: kein Schein mitten auf dem Haus, Licht nur in den Fenstern).
- XANDER (wörtlich, Funk 177): „Beim Bahnhof wegen zwei Reihen Fenster individuell jeweils eine komplett links neben dem Haus eine komplett rechts neben dem Haus die gehören da gar nicht hin und in der Mitte vom Bahnhof scheint auch irgendwie so ein übergroßes Fenster zu sein“ · „es gibt immer noch diese Lichtflecken auf jedem Haus … auf jedem Haus hast du in der Mitte irgendwo so ein lichtsymbol wo gar keine Lampe ist man sieht nur Schein und das soll weg … warum sollte denn der Eingang beleuchtet sein oder das Haus frontal beleuchtet sein wenn die Leute nachts schlafen … ich habe das jetzt schon drei oder vier Mal adressiert“.
- **Ursache 1 – der Schein mitten auf jedem Haus**: seit Fassung 711 lag in der Nacht auf jedem heilen Haus ein flackernder Schein (`.sp-dn-licht`, damals als Ersatz für Fensterlicht). Seit 724 leuchten die Fenster selbst; dieser Schein blieb aber liegen. Er ist jetzt weg.
- **Ursache 2 – Fenster neben den Häusern**: die Maske für den Zug malt Bahnhof, Mühle, Bergwerk und die Türme ein zweites Mal (in anderem Maßstab). Dabei merkten sich deren Fenster ein zweites Mal als Licht – an falscher Stelle (links neben dem Bahnhof, auf Wiese und Dächern). Die Lichter werden jetzt vor der Maske genommen.
- **Keine Türlampen mehr**: Licht gibt es nur hinter Fenstern (je nach Uhrzeit, nachts wenige) und an den Straßenlaternen.
- **Verdeckte Laternen**: eine Laterne, die hinter einem Haus steht, wirft keinen Schein mehr über das Haus.

### Fassung 729 (Funk 155/173: Meldungen oben mit Sprung ins Dorf)
Sonden: 716 (neu: Angriff zuerst, „+1 weitere“, „Ansehen“ öffnet das Dorf an der richtigen Station, keine Wiederholung, neu Fertiges meldet sich, ✕ schließt), 711, 686, 683, 700, 697 grün.
- XANDER (wörtlich, Funk 173): „es soll auch immer wieder oben eine Meldung kommen wenn irgendwas fertig ist dass man das Antippen kann und direkt in dieses Dorf Mini springt auch wenn man angegriffen wird“.
- **Band oben** (`.sp-sprung`): fertige Werkstätten („4 Brot fertig in der Bäckerei“), heimgekehrte Trupps („Die Fischer sind zurück: 5 Fisch“), reife Äcker, volle Ställe (Milch, Eier) und Plünderungen („Bea hat deine Mühle geplündert“, rot, zuerst). Mehrere Meldungen: „+n weitere“, sie kommen nacheinander.
- **„Ansehen“** öffnet das Dorfbild und gleich die betroffene Station (Mühle, Bäckerei, Wald …). ✕ schließt alle.
- **Nur einmal**: jede Sache wird genau einmal gemeldet (gemerkt auf dem Gerät, auch nach dem Neuladen). Ist das Dorf gerade offen, kommt kein Band – man sieht es im Bild.

### Fassung 730 (Funk 176: Städte als Kette durchblättern, aus dem Profil in die Stadt)
Sonden: 716 (neu: Kette „‹ Dein Dorf · 1/2 ›“, › zu Beas Dorf mit ihrem Schild und ihren Häusern, Tipp auf ihre Mühle → „Plündern“, Plündern trifft sie, „Zurück zu meinem Dorf“, langer Druck auf Beas Bild → „Stadt ansehen“), 711, 686, 683, 709, 719 grün.
- XANDER (wörtlich, Funk 176): „dass man sich durch andere stellte so nach links und rechts so durchklicken kann z.B von den Leuten die natürlich gerade da sind die Städte sollen in einer Kette aneinander sein und durchklickbar sein … oder man geht auf ihr Profil und geht einfach in ihre Stadt und greift sie an aber das muss aus jedem Menü heraus bzw ob aus dem Menü oder ob aus dem Bild direkt oder auf jede Weise hin und her in jede Richtung möglich sein“.
- **Kette** über dem Dorfbild: ‹ Name · Stadt · Einwohner/Stärke/Level · n/m › – blättert durch die Dörfer aller, die gerade im Raum sind (das eigene zuerst, dann in Sitzreihenfolge).
- **Fremdes Dorf**: gemalt wie das eigene (ihre Gebäude und Stufen), ihr Ortsschild (nicht umbenennbar), keine eigenen Orte (See, Wald, Äcker, Bahnhof). Tipp auf ein Haus: Stufe, Zustand, „Plündern“ (10 Mana; nicht, wenn sie nicht mitspielen, das Haus kaputt oder 4 h geschützt ist).
- **Wege hinein**: ‹ › im Dorfbild, „Stadt ansehen“ in der Nachbarliste des Dorf-Menüs und im Profil (langer Druck auf das Bild der Person). „Mein Dorf“ in der Leiste führt immer ins eigene.

### Fassung 731 (Funk 176: eine Waffe im Chat halten, zielen, an der getippten Stelle treffen – der Tomahawk-Fehler)
Design-Prüfung vorab (Design-Agent, kritisch): der alte Schalter „Spaßwaffen“ nahm still die Spielwaffe (daher der Tomahawk, den er nie im Chat gewählt hatte) und legte das Geschoss groß über das eigene Gesicht; der Schuss startete in der Bildmitte. Empfohlen und gebaut: ausdrückliches Halten, Gerät am Bildrand, Schuss aus der Mündung, Treffstelle, Sperre gegen Dauerbeschuss, Chat-Mauer bleibt.
Sonden: neu 731-waffe-halten (alter Schalter gelöscht, ohne Waffe kein Schuss, „Waffe halten“ im eigenen Platzmenü, Gesicht frei ≥ 0,9 r, Treffstelle dx/dy gesendet, Winkel zum Ziel ±4°, Strahl aus der Mündung ≥ 1,5 r von der Mitte, Chat-Mauer, höchstens 8 Schüsse je Person in 30 s, Tipp aufs eigene Bild legt ab), 682 (umgestellt), 692, 719, 716, 711 grün.
- XANDER (wörtlich, Funk 176): „ich habe festgestellt dass ich im Chat eine Waffe habe die ich gar nicht angewählt habe z.B Tomahawk aus dem Spiel … wenn man eine Waffe … wählt dass man die dort so halten kann so lange bis man sie wieder abwählt … dass ich realistisch die Waffen halte und nicht einfach nur deine Mama so über meinen Kopf klebt … wenn ich eine Plasma können ohne habe dann muss das so aussehen als wenn die so waagerecht aus meinem Bild rauskommt in die Richtung wo der andere Sitze entweder schräg nach oben Schreck nach unten oder nach gerade nach rechts gerade nach links … du musst das mit der deinen Design Agenten kritisch überprüfen“.
- **Halten**: langer Druck aufs eigene Bild → „Waffe halten“ (oder Menü → Mehr → „Waffe halten“) → eine der eigenen Waffen. Sie bleibt, bis man sie weglegt (auch nach dem Neuladen). Nur ohne Mitspielen – beim Mitspielen gilt der Ring.
- **Aussehen**: das Gerät (Zwille, Bogen, Armbrust, Gewehr/Laser, Plasmakanone, Rohr, Kugelblitz, Wurfsachen in der Hand) hängt am Rand des eigenen Bildes, das Gesicht bleibt frei; der eigene Platz liegt dabei vorn, damit die Waffe nicht unter dem Nachbarbild verschwindet.
- **Schießen**: Tipp auf eine Person – die Waffe dreht sich genau dorthin (schräg, waagerecht, oben, unten; nach links gespiegelt), Rückstoß und Mündungsblitz, der Schuss fliegt aus der Mündung an die getippte Stelle. Alle im Raum sehen es; bei anderen erscheint das Gerät kurz am Rand des Schützen. Kein Schaden, keine Punkte. Chat-Mauer: prallt ab. Höchstens 8 Schüsse je Person in 30 s.
- **Weglegen**: Tipp aufs eigene Bild oder „Waffe weglegen“ im Platzmenü.
- **Noch offen (Phase 2 der Design-Prüfung)**: Chat-Effekt-Waffen (Hammer, Zwille, Laser …) ebenfalls halten – mit zusammengefassten Chatzeilen, damit der Verlauf nicht zugemüllt wird; Trefferstelle auch für Chat-Effekte; alle Effekt-Schichten ziehen beim Platzwechsel ohne Neustart der Animation mit.

### Fassung 732 (Walkie 274: Kartoffel 3 Schaden)
- Walkie 274 (Frage: „Soll ich auf 3 senken?“ – Antwort: „okay“): die Kartoffel, die Standardwaffe, macht 3 statt 6 Schaden (Server `spiel_waffe_schaden` und Spiel). Sonden 697 (Server-Tabelle), 633, 641, 662, 666, 678, 681 grün.

### Fassung 733 (Funk 169: Jahreszeiten und Feste im Dorf, Vorschau für den Betreiber)
Sonden: neu 733-jahreszeiten (Jahreszeit/Fest für 11 Stichtage, Ostersonntag 2026–2028 nach Gauß, Knopf „Saison“ nur für den Betreiber, jede der 8 Stufen malt ein eigenes Bild, Kürbisgesichter und Christbaumkerzen leuchten nachts, Herbst ohne Halloween leuchtet nicht), 711, 716, 686, 708 grün.
- XANDER (wörtlich, Funk 169): „ich möchte das schon mal in der Vorschau sehen wie sowas aussieht wenn die Stadt dann geschmückt ist“.
- **Nach dem echten Datum**: März–Mai Frühling (Blüten in den Laubbäumen), Juni–August Sommer, September–November Herbst (bunte Laubbäume, Kürbisse vor jedem Haus), sonst Winter (kahle Laubbäume; Tannen bleiben grün).
- **Feste**: Erntedank 25.9.–10.10. (zwei Garben rechts vom Rathaus), Halloween 15.10.–2.11. (Kürbisse mit Gesichtern, nachts leuchtend), Advent 27.11.–6.1. (Christbaum mit Kugeln, Stern und Kerzen rechts vom Rathaus, nachts leuchtend), Ostern Palmsonntag bis Ostermontag (bunte Eier auf der Wiese).
- **Vorschau**: unter dem Dorfbild „Saison: echt“ – nur beim Betreiber. Jeder Tipp blättert weiter: Herbst → Erntedank → Halloween → Advent → Winter → Ostern → Frühling → Sommer → echt. Die Vorschau gilt nur auf seinem Gerät und nur bis zum Neuladen.

### Fassung 734 (Walkie 288/289: Rundenkampf in drei Runden, ganze Kämpferfiguren)
Sonden: neu 734-runden-figuren (Computer: Figuren nach Klasse/Rüstung/Waffe, Kopf mittig auf dem Hals, Hut über der Stirn, nichts überlappt; Runde 1 → Pause → Runde 2 mit vollem Leben, Verlierer beginnt, 1:1 → „Entscheidungsrunde“, Sieg 2:1 mit genau einem Lohn; zu zweit: Figur des anderen aus der Einladung, K.O. und neue Runde auf beiden Geräten gleich), 701 (umgestellt: K.O. = Runde, ganze Partie 2:0), 669, 675, 694 grün.
- XANDER (wörtlich, Walkie 288): „Na so wie das früher in dieser Art von Computerspielen üblich war ich glaube man macht die erste Runde und dann hat man eine zweite Runde und deine Entscheidungsrunde basierend auf den Ergebnis der ersten beiden Runden vielleicht kannst du dir da was überlegen dann kümmere Dich jetzt mal bitte intensiv darum für mich.“
- **Runden**: ein K.O. entscheidet die Runde; wer zuerst zwei Runden hat, gewinnt. Bei 1:1 kommt die „Entscheidungsrunde“. Zwischen den Runden 2,6 s Pause (K.O.-Bild, Verlierer liegt, Sieger jubelt), dann „Runde 2 – Kampf!“ mit Gong. Leben und Schild wieder voll, Konter weg; Sterne und Rüstung (mit Deutsch erspielt) bleiben. Wer die Runde verloren hat, beginnt die nächste. Oben neben „VS“: Runde; unter jedem Balken zwei Rundenpunkte. Lohn nur am Ende des ganzen Kampfes.
- **Zu zweit**: beide Geräte erkennen das K.O. selbst; Züge und Stände tragen die Rundennummer – ein Zug aus der alten Runde trifft in der neuen nicht mehr, ein Zug aus der neuen Runde wartet, bis die Pause auch beim anderen vorbei ist.
- Walkie 289 (Antwort: alle drei Punkte): **ganze Figur** mit Armen und Beinen, das Profilbild ist der Kopf. **Klasse**: Magier (Robe mit Sternen, spitzer Hut, Stab), Dieb (Kapuze, Umhang, Dolch), Titan (Bronzeplatten, Schulterstücke, Hörnerhelm), Heiler (weißes Gewand, grünes Kreuz, Stirnband), Ingenieur (Overall, Werkzeuggurt, Bauhelm, Schraubenschlüssel), Deutsch-Gelehrter (Talar, Doktorhut, Buch); ohne Klasse ein Kämpfer im Hemd der eigenen Farbe. **Rüstung**: der angelegte Brustpanzer (Leder, Eisen, Stahl mit Goldrand) sitzt auf dem Rumpf, der Helm aus dem Spiel geht vor den Klassenhut (Stufe 3 mit Busch). **Waffe**: die gewählte (oder gehaltene) Waffe liegt in der vorderen Hand. Beim Schlag stößt der Arm vor, beim Schild geht er in Deckung. Hut und Helm sitzen über der Stirn – die Gesichtsmitte bleibt frei. Der Gegner schaut gespiegelt nach links; seine Figur kommt mit der Einladung.

### Fassung 735 (Funk 176, Phase 2 – Teil 1: Effekte ziehen nahtlos mit um)
Sonden: 731, 692, 690 grün.
- Das gehaltene Gerät der Chat-Effekte (Spuckrohr, Zwille, Pusterohr) hing am alten Platz fest, wenn der Schütze umzog – es trägt jetzt, wem es gehört und wie lange es bleibt, und zieht mit.
- Nach jedem Umzug (Schütze oder Ziel) zielt das Gerät neu auf sein Ziel.
- Effekte, die beim Umzug in den neuen Platz gehängt werden, fingen ihre Animation von vorn an (der Hammer holte zweimal aus). Die laufenden Animationszeiten werden jetzt mitgenommen – der Effekt läuft nahtlos weiter.

### Fassung 736 (Funk 176, Phase 2 – Teil 2: Chat-Effekte halten, Trefferstelle, gebündelte Zeilen)
Sonden: neu 736-chatwaffen-phase2 (13 Chat-Effekte im Halte-Menü mit eigener Zeichnung; Hammer halten, Tipp rechts unten auf Bea → echter „/hammer" an alle mit Trefferstelle 0,51/0,41, Hammer schlägt dort ein; vier Schläge = eine Zeile „×4", ein anderer Effekt dazwischen trennt; Wassereimer läuft beim Platztausch nahtlos weiter; Zwille des Chat-Effekts gehört dem Schützen, zielt nach dem Umzug neu, keine doppelte Zwille; Tipp aufs eigene Bild legt ab), zusatzfelder, 731, 690, platzmenue, runde77, runde82, runde98 grün.
- XANDER (wörtlich, Funk 176): „dass ich realistisch die Waffen halte … in die Richtung wo der andere Sitze … du musst das mit der deinen Design Agenten kritisch überprüfen“ – Phase 2 der Design-Prüfung.
- **Halten**: „Waffe halten“ (langer Druck aufs eigene Bild) zeigt oben die **Chat-Effekte**: Hammer, Zwille, Spuckrohr, Pusterohr, Schneebälle, Saugnapf-Bogen, Paintball, Eier, Sahnedose, Wassereimer, Bumerang, Konfetti-Granate, Boxhandschuh – darunter die eigenen Spielwaffen. Chat-Effekte gehen auch ohne Spielkonto.
- **Tippen**: das Gerät dreht sich zur Stelle, holt aus, und der echte Chat-Effekt geht an alle – so, als hätte man „/hammer Bea“ geschrieben.
- **Trefferstelle** (neues Feld „treff“): der Effekt erscheint auf jedem Gerät dort, wo getippt wurde (bis ein gutes Drittel des Bildes aus der Mitte). Gilt für jeden Effekt auf genau eine Person.
- **Verlauf**: gleiche Treffer (gleicher Absender, gleicher Effekt, gleiches Ziel) direkt hintereinander und höchstens 90 s auseinander stehen als EINE Zeile mit „×4“. Jede Animation läuft trotzdem; ein Tipp auf die Zeile spielt sie noch einmal.
- Zwille, Spuckrohr und Pusterohr zeichnet der Chat-Effekt selbst am Schützen – das gehaltene Gerät blendet sich dann kurz aus (keine zwei Zwillen).

### Fassung 737 (Funk 155: weitere Meldungen – Entdeckung, Unzufriedenheit, Touristen, Angebote, Verkauf)
Sonden: 716 (neu: Unzufriedenheit zuerst und bernsteinfarben mit „es fehlt …“, Forschung bereit, Angebot von Bea – ältere/eigene nicht, Verkauf an Bea +18 P – älterer nicht, Entdeckung des Duden, Touristen am Holstentor, nichts doppelt, „Ansehen“ springt zur Volks-Zeile bzw. klappt die Forschung auf), 683, 702, 703, 711 grün. Server: spiel_angebote_liste liefert zusätzlich „verkauft“ (eigene Verkäufe der letzten 24 h aus spiel_protokoll), geprüft mit eingeschobenem Verkauf und Rückrollen.
- XANDER (Funk 155): Meldungen mit Sprung-Knopf für „Entdeckung, Einsammeln, Mine voll, Angriff, Unzufriedenheit, Touristen, Angebote, Verkauf“ – die letzten fünf fehlten.
- **Unzufriedenheit** (unter 50 %, noch einmal unter 30 %; je Tag einmal): „Volk unzufrieden (41 %): es fehlt Essen, Lohn“ – bernsteinfarben, kommt gleich nach Angriffen. Ansehen → Volks-Zeile leuchtet.
- **Entdeckung**: taucht eine geheime Forschung auf („Entdeckung! Geheime Forschung gefunden: Der Duden“) oder kann eine Forschung begonnen werden („Dreifelderwirtschaft kann jetzt erforscht werden“). Ansehen → Forschung klappt auf.
- **Touristen**: stehen Wahrzeichen und ist die Dorf-Ernte bereit: „2 Touristen warten in deiner Stadt – ernte, dann zahlen sie Eintritt“. Ansehen → Ernte-Knopf.
- **Angebote**: alle 2 Minuten wird still nachgesehen; neue Angebote anderer („Bea bietet 5 Erz je 2 P an – billiger als beim Händler“, bei mehreren „3 neue Angebote im Handel“). Beim allerersten Mal wird nur gemerkt, was schon da ist.
- **Verkauf**: „Bea hat dir Brot abgekauft: +18 Punkte“ (mehrere: „3 Verkäufe: +75 Punkte“). Ansehen → Markt & Handel klappt auf.
- Kommen Meldungen dazu, während eine steht, zählt „+N weitere“ sofort mit. Das Volk zählt jetzt auch Fleisch als Essen (wie die Ernte).

### Fassung 738 (Funk 153, Teil 1: Controller am Bild, nur Mitspieler hören)
Sonden: neu 738-controller-leise (Controller bei mir und Bea, nicht bei Cem; oben links, klein, Gesicht frei; auch wer nicht mitspielt sieht ihn; Schalter „Nur Mitspieler hören“ gemerkt; Cem trägt „stumm für dich“; Filter: Bea hörbar, Cem stumm, ohne eigenes Mitspielen wieder alle; Schalter-Reihen ohne Überlappung), 657, 679, 682, 710-auftritt, 710-leiste, 731 grün.
- XANDER (wörtlich, Funk 153): „Die Leute die im Chat sichtbar sind falls Sie in dem Spielmodus drin sind sollen denselben kleinen Controller grünen Kontrolle … dargestellt haben an ihrem Profilbild wahrscheinlich so an der Stelle wo es noch hin passt dass die anderen stadtteilnehmer sehen sie sind gerade in dem Spiel sie sind aber genauso zu hören … sie können es aber auch gerne stumm schalten es steht ihnen eine Option zur Verfügung wo sie die normalen stadtteilnehmer stumm schalten können dass sie sich auf das Spiel konzentrieren“.
- **Controller am Bild**: wer mitspielt, trägt oben links am Profilbild einen kleinen grünen Controller – für alle im Raum sichtbar.
- **Nur Mitspieler hören** (Menü → Mehr → Im Chat): solange man selbst mitspielt, sind alle, die nicht mitspielen, nur für einen selbst stumm (sie hören einen weiter, und sie hören alle anderen). Ihr Bild trägt oben rechts ein graues „stumm für dich“. Der Schalter bleibt gemerkt; wer das Spiel verlässt, hört wieder alle.
- Nebenbei: die Schalter-Reihen im Menü „Mehr“ (vor allem „Letzter Knopf“ mit sieben Knöpfen) liefen ineinander – jetzt höchstens drei je Reihe.

### Fassung 739 (Funk 153, Teil 2: Magic Button – Siri-Farbwirbel, eigene Felder wie AssistiveTouch)
Sonden: 687 (umgestellt: statt „Belegen“ jetzt Anpassen – lang drücken, ✕ nimmt heraus, + fügt hinzu, Antippen tauscht aus, gemerkt, das neue Feld wirkt; Galaxie ohne Gelb, Farbwirbel „lcSiriDreh“), 694 (Leerlauf 3,3 ms/s; der Wirbel läuft nur über transform), platzmenue grün.
- XANDER (wörtlich, Funk 153): „dann kannst du den Auswahlknopf den Marco Knopf in der Mitte ein bisschen besser Design vielleicht so eine bewegte Animation reinmachen die impliziert dass es irgendwie so ein Magic Button ist … und das was man dort festlegt das kann man gar nicht wirklich festlegen es hat gar keine richtige Funktion schau mal dass man da wirklich im Menü hat wo man da wirklich die Sachen selbstständige einstellen kann wie bei wie bei Apple … mit diesem plus Symbolen da irgendwas hinzufügen oder irgendwas ändern oder irgendwas austauschen … wie bei Siri ist bist du mit schönen Farben … bei dem Design Galaxy ist der so komisch gelb das soll nicht so sein“.
- **Aussehen**: dunkle Glaskugel, darin kreist ein weicher Farbwirbel aus den Akzentfarben des Designs (Rosa, Violett, Türkis, Blau), dazu ein atmender Lichtkern. Kein Gelb mehr (auch im Galaxie-Design). Nur Drehung und Deckkraft laufen – die Grafikkarte macht es allein.
- **Menü mit eigenen Feldern** (für alle, nicht nur den Betreiber): bis zu 8 Felder. „Anpassen“ (oder lang drücken): die Felder wackeln, ✕ nimmt eines heraus, Antippen tauscht es aus, „+ Hinzufügen“ zeigt alles, was noch frei ist. Zur Wahl: Bilder, Lesetext, Spiele, Stadt Land Fluss, Schiffe versenken, Aufdecken, Konfetti, Waffe halten, Mein Dorf – für Lehrer die Tafel, für den Betreiber das Lehrer-Menü. Gemerkt auf dem Gerät.
- Die alte feste Belegung der Mitte (nur Betreiber) ist darin aufgegangen – der Tipp öffnet immer das eigene Menü.

### Fassung 740 (Funk 153, Teil 3: Postfach aufgeräumt)
Sonden: postfach-knopf, einladungslink, 687, 694 grün; Bildschirmfoto mit angemeldetem Postfach (4 Nachrichten) auf 360 px.
- XANDER (wörtlich, Funk 153): „außerhalb des Systems vom Livestream in Postfach möchte ich mehr Ordnung haben … die emojis kleiner … kompakter nicht so dass es die ganze Leiste aufreißt … dass die Leute wenn sie es Postfach aufmachen gar nicht sehen dass sie im Postfach sind … Orientierung … Navigationssystem aufgeräumter“.
- **Navigation im Profil**: statt zehn breiter Pillen über fünf Zeilen ein festes Raster 5 × 2 mit kleinem Symbol über kurzem Wort (97 px statt 202 px hoch). „Sticker-Album“ heißt dort „Sticker“, „Einstellungen“ heißt „Optionen“ (voller Name beim Drüberfahren).
- **Postfach**: oben steht jetzt groß „✉️ Postfach“. Zuerst kommen die Nachrichten (Reiter Eingang / Ausgang / Wichtig in einer Zeile, flachere Zeilen), darunter eingeklappt „✏️ Neue Nachricht schreiben“. Die Sticker liegen darin in einer eigenen, einklappbaren Reihe. Antworten klappt das Schreibfeld von selbst auf; ein angefangener Entwurf hält es offen.

### Fassung 741 (Funk 152, Reste: Taschen erkennbar, Doppeltipp mit der Schaufel)
Sonden: 643 (umgestellt: ein Tipp gräbt nach 300 ms, Doppeltipp gräbt nicht und öffnet die Werkzeugwahl, Schatzsuche mit längerer Wartezeit), 692 (neu: Tasche zeigt das Gerät, Namensschild über der Tasche), 633, 649, 677, 683, 710-leiste, 719, 736 grün.
- XANDER (wörtlich, Funk 152): „Unten in der Tasche ist ein Symbol so hell angezeigt da passiert doch irgendwas wenn ich da drauf klicke aber es ist nicht klar auf was ich drücke weil das Symbol nicht zu erkennen ist … man erkennt nicht was der Inhalt dieser Kachel ist oder dieser Tasche ist und es passiert auch nicht wirklich etwas wenn man drauf drückt wenn man in dem Modus des umgrabens ist wo man die Schaufel benutzt und man macht dann einen doppeltap soll beidem doppeltepp nicht die Schaufel reagieren und noch mal Umgraben sondern es soll sich das Menü öffnen“.
- **Taschen**: zeigen jetzt das Gerät selbst (Gewehr, Laser, Bogen, Zwille, Kanone) statt des Geschosses – das Maschinengewehr war vorher nur ein goldener Strich. Wurfsachen (Kartoffel, Brezel, Spätzle …) bleiben das Ding selbst. Jeder Tipp auf eine Tasche zeigt 1,8 s ein Namensschild darüber. Eine stumpfe Waffe (halber Schaden) trägt unten rechts einen roten Schraubenschlüssel; ihr Schild ist rot und der Hinweis sagt, wie man repariert.
- **Schaufel**: ein Tipp gräbt nach 300 ms; kommt in der Zeit ein zweiter Tipp auf denselben Platz, wird nicht gegraben, sondern die Werkzeugwahl geht auf. Sense, Saat, Axt und Angel arbeiten weiter sofort (schnelles Ernten).
- **Tier-Fähigkeit** („stellt sich das gar nicht ein bzw stellt sich das wieder zurück“): in der Sonde nicht nachzustellen – die gewählte Fähigkeit trägt im Menü den Stern, steht als Knopf in der Leiste und bleibt nach dem Neuladen des Stands; der Server speichert sie (spiel_faehigkeit_setzen). Wenn es bei dir noch zurückspringt: bitte melden, bei welchem Tier.

### Fassung 742 (Walkie 273: das Tagesgeschenk für alle, die eingeloggt bleiben)
Sonden: 692 (neu: Meldung gemerkt, Menü-Zeile „heute abgeholt · nächstes in …“), 716 grün.
- XANDER (wörtlich, Walkie 273): „Wie sieht man das und wo findet man das wenn man die ganze Zeit z.B eingeloggt bleibt.“
- **So war es**: Das Geschenk holte sich schon nach Mitternacht (Berliner Zeit) beim nächsten stillen Nachsehen selbst ab – aber nur als kurzer Hinweis, den man leicht verpasst.
- **Jetzt**: Es kommt zusätzlich als Meldung oben im Band (mit Geschenk-Bild, ohne „Ansehen“, ✕ zum Wegtippen), einmal am Tag. Im Spiel-Menü steht statt „Serie 3/7“: „🎁 Heute abgeholt · Tag 3/7 · nächstes in 5 h 20 min“ bzw. „Tagesgeschenk kommt gleich“.

### Fassung 743 (Funk 139: Bonuspunkte für schnelle Antworten)
Server: Migration `spiel_743_schnell_bonus` (spiel_antwort). Geprüft mit Rollback als Xander: A1-Aufgabe nach 3 s → 5 Punkte (+2 schnell), nach 9 s → 4 (+1), nach 20 s → 3 (+0). Sonden: 648, 645, 634, spielsystem grün; Bildschirmfoto der Auswertung auf 360 px.
- XANDER (wörtlich, Funk 139): „dann könntest du Bonuspunkte mit einbauen wenn man die Sachen sehr schnell beantwortet“.
- **Regel** (auf dem Server, nicht fälschbar): Die Zeit läuft ab dem Stellen der Aufgabe. Bis 6 s gibt es +50 %, bis 12 s +25 % der Punkte, mindestens 1. Bei „Stimmt der Satz?“ gibt es keinen Schnell-Bonus, weil man bei zwei Antworten blind schnell raten könnte. Die bestehende Sperre (frühestens nach 2 s antworten) bleibt.
- **Anzeige**: In der Auswertung steht „⚡ +2 schnell“ (mit Sekunden beim Drüberfahren); im Deutsch-Menü steht „⚡ Schnell (bis 6 s) gibt es die Hälfte extra.“
- **Mitbehoben**: Die Extras (Mut-Bonus, Mana, EP, Mission) schoben bei vielen Boni den „Weiter“-Knopf aus dem Bild. Jetzt stehen sie in einer Zeile, die sich notfalls mit „…“ kürzt; „Weiter“ bleibt immer sichtbar.

### Fassung 744 (Funk 162: eine Klasse wieder ablegen)
Server: Migrationen `spiel_744_klasse_ablegen` (spiel_klasse, spiel_kampfklasse_waehlen nehmen „keine“) und `spiel_744_ich_klasse_ab` (spiel_ich liefert klasse_ab). Geprüft mit Rollback als Xander: Deutsch-Klasse ablegen → frei; sofort neu wählen → „wechseln geht einmal am Tag“; einen Tag später → 50 Punkte; Kämpferklasse ablegen → frei; sofort neu → „alle 10 Minuten“; danach wieder möglich. Sonden 663, 699, 734 grün; Menü-Knöpfe im Browser geprüft.
- XANDER (wörtlich, Funk 162): „Und was passiert dann wenn man das nicht mehr haben will kommt dass man dann jemals auf den Originalzustand zurück“.
- **Deutsch-Klasse** (Menü → Mehr → Klasse): unten „Klasse ablegen – zurück zum Anfang“. Ablegen kostet nichts. Wer danach wieder eine Klasse will, zahlt wie beim Wechseln 50 Punkte, einmal am Tag – sonst könnte man die Wechselgebühr mit Ablegen umgehen.
- **Kämpferklasse** (Menü → Mehr → Kämpferklasse): unten „Ohne Klasse kämpfen (ablegen)“. Dann gibt es keine Klassenkraft und keine Stärke, wie am Anfang. Die Stufen jeder Klasse bleiben gespeichert; nach 10 Minuten kann man wieder wählen.
- Noch offen aus derselben Nachricht: „mit einem Charakter komplett neu anfangen … zwei Charaktere“ – das ist eine Grundsatzfrage (Punktewertung, Ranking) und steht bei den Fragen an Xander.

### Fassung 745 (Funk 139: das Halloween-Paket – vorbereitet, Xander schaltet es frei)
Server: Migration `spiel_745_halloween_paket` – Tabelle `spiel_saison` (RLS an, nur Lesen für alle), `spiel_saison_setzen` (nur Besitzer/Admin), `spiel_saison_an`; Waffen `kuerbis` (14 Schaden, 60 P) und `geist` (11, 45 P) in allen Waffenlisten (Kaufen, Treffer, Verstärken, Verkaufen) und in `spiel_waffe_schaden`; Zauber `spinnen` (Level 3, 25 Mana, 8 Schaden, über jede Mauer); `spiel_ich` meldet `saison`; 20 Halloween-Aufgaben (A1–B1, inaktiv). Geprüft mit Rollback als Xander: aus → Kaufen und Zauber abgelehnt („nur zu Halloween“); Schalter an → 20 Aufgaben aktiv, Kürbisbombe kaufbar (500 → 440, hält 60), Spinnenplage wirkt, Aufgabe „Halloween ist am 31. ___.“ kommt; Verkaufen geht. **Halloween ist aus** – nichts ist sichtbar, bis Xander es einschaltet.
Sonden: 637, 648, 649, 650, 654, 686, 692, 719, spielsystem grün; Laden, Zauberrad, Aufgabenart und Spinnen-Bild im Browser geprüft (aus: nichts zu sehen; an: alles da).
- XANDER (wörtlich, Funk 139): „dass du schon mal ein Paket vorbereitet was ich dann in dem Moment wenn halloween ist freischaltet … Spinnen auf jemand schicken mit Zauber“.
- **Schalter**: im Dorf-Fenster bei den Knöpfen „Symbole/Namen“, gleich neben „Saison: …“ – „Halloween-Paket: aus/an“ – nur der Betreiber sieht ihn; er gilt sofort für alle.
- **Im Paket**: Kürbisbombe (Kürbis mit Gesicht, platscht) und Glibbergeist (kleines Gespenst, zerglibbert) im Laden und in „Lustig“; der Zauber „Spinnenplage“ (Spinnen seilen sich am Rand des Bildes ab und krabbeln nach außen weg – das Gesicht bleibt frei; Ton „spinnen“); 20 Halloween-Aufgaben (auch als eigene Aufgabenart „Halloween“). Wer eine Halloween-Waffe gekauft hat, behält sie nach dem Fest; neu kaufen geht dann nicht mehr.
- **Mitbehoben (aus 742)**: Das Tagesgeschenk-Band lag beim Betreten 8 s über den oberen Plätzen und schluckte Tipps (Sonde 650: Erdbeben und Orkan kamen nicht an). Reine Info-Bänder lassen Tipps jetzt durch (nur ✕ ist antippbar) und gehen nach 5 s.
- Für Weihnachten ist der Schalter schon im Server angelegt (`weihnachten`), das Paket selbst folgt.

### Fassung 746 (Funk 178: Postfach wieder im alten Design)
Sonde: pruefe-postfach-knopf grün. app.js, korrekturen.css und index.html stehen für das Postfach wieder genau auf dem Stand vor Fassung 740 (Commit c8666d8); Sicherungen in `.sicherung/*.vor-fassung746`.
- XANDER (wörtlich, Funk 178): „stell es erstmal auf das alte Design zurück und dann diskutieren wir erstmal Schritt für Schritt auch die Buttons wie sie waren stellt das alles wieder her wie es war … du musst mir Fragen dazu stellen“.
- **Zurückgenommen**: das Knopf-Raster oben im Postfach, die neue Titelzeile und das eigene „Schreiben“-Fenster aus 740. Die Knöpfe sind wieder die alten, an den alten Stellen.
- **Weiter**: Nichts am Postfach wird geändert, bevor Xander die Fragen im Walkie beantwortet hat.

### Fassung 747 (Funk 178: Rundenkampf – Konter nach Leben, Ausdauer-Erfahrung, Niveau vorher wählen)
Server: Migration `spiel_747_ausdauer_ep` (spiel_extra_lohn). Geprüft mit Rollback als Xander: 12 richtige in 20 Minuten → +16 Ausdauer-EP, auch wenn der Tages-Lohn (60 Punkte) schon voll ist; derselbe Kampf ein zweites Mal → „schon den Lohn“. Sonden: neu 747, 701 (angepasst), 734 grün; Bilder der Auswahl und der Fehlerteufel-Abwehr auf 360 px geprüft.
- XANDER (wörtlich, Funk 178): „deswegen müsste der Konto prozentual mit sinkender Lebensenergie auch schwächer werden dann hätte man auch eine Chance das Spiel mal zu gewinnen weil sonst dauert das so ewig lang“.
- **Konter**: prallt jetzt so stark zurück, wie man noch Leben hat – voll 50 %, halb 25 %, fast leer fast nichts. Neben dem Leben steht „Konter 25 %“.
- XANDER: „wenn jemand … in dem Kampf der kein Ende findet wenigstens viel Erfahrung mitnehmen die Erfahrungspunkte wenn der Kampf länger dauert“.
- **Ausdauer-Erfahrung** (Rundenkampf und Fehlerteufel-Abwehr): ab 5 richtigen Antworten je richtige über 8 eine EP und je Minute über 5 eine EP (die Minuten höchstens so viele wie richtige Antworten), höchstens 25. Nur Erfahrung, keine Punkte – darum auch über der Tagesgrenze.
- XANDER: „dass jeder sein Niveau vorher wählen kann auch in der Echtheit Runde … wenn man höheres Niveau kämpft und man gewinnt kriegt man trotzdem … mehr Punkte“.
- **Vor dem Kampf** (Züge und Echtzeit) und vor der Fehlerteufel-Abwehr: Niveau A1–C2 und Fragen-Art (Schwächen üben / Stärken / Gemischt) – dieselbe Einstellung wie im Deutsch-Menü. Schaden ist auf jedem Niveau gleich (fair); höheres Niveau bringt mehr Punkte (das rechnete der Server schon), Schwächen +50 %.
- **Mitbehoben**: Wer den Rundenkampf in den 0,4 s nach einem Konter-Rückprall schloss, bekam einen Skriptfehler („reading 'lp'“) – der verspätete Rückprall prüft jetzt, ob die Partie noch da ist.
- **Noch offen aus Funk 178**: „bei den Fragen … da ist doch viel Quatsch dabei“ – die Aufgabenbank wird als Nächstes durchgesehen.

### Fassung 748 (Walkie 295/297/298: Postfach Schritt 1 – „Neue Nachricht“ oben)
Sonden: neu 748, postfach-knopf grün; Bilder auf 360 px (zu und aufgeklappt) geprüft.
- XANDER (wörtlich, Walkie 295): „an sich war das System ziemlich cool allerdings hattest du diesen einen Link wo man das Nachrichten Schreiben aufsetzen konnte inklusive der Belohnungspunkte und der emoji sind Sticker das war ja da unten unter den ganzen Nachrichten … wenn dieser Link einfach oben drüber wäre dann wäre das glaube ich viel aufgeräumt und viel logischer“.
- **Aufbau**: „✉️ Postfach“ → darunter ein deutlicher Knopf „✏️ Neue Nachricht schreiben“ (klappt auf; offen, wenn ein Entwurf wartet oder man auf „Antworten“ tippt) → Posteingang/Postausgang/Wichtig. Die Profil-Reiter oben bleiben wie früher.
- **Im Schreiben**: An wen (wie immer: bestimmte Personen oder Rundmail, Suchfeld, Liste), Text, darunter die Knopfreihe **📷 Bild · 📎 Datei · 🙂 Sticker · 🦊 Fuchs** (Walkie 298) – jeder klappt nur seine Auswahl auf. Neben „Senden“ der Knopf **🎁 Punkte** (Walkie 297, nur Betreiber): klappt den Punkte-Kasten auf; sind Punkte eingestellt, steht es am Knopf („🎁 +50 Punkte“).
- **Sticker** (Walkie 295: „kann man die nicht einfach kleiner darstellen … scrollen verhindern auch auf kleinem Display … an der Größe wie etwas gesendet wird sollst du nichts ändern“): Vorschau 22 px im Raster, alle 32 Sticker in vier Reihen auf 360 px, kein Scrollen. Gesendet wird wie bisher.
- Noch offen: Walkie 296 (Empfänger-Auswahl) ist unbeantwortet – sie bleibt wie früher.

### Fassung 749 (Funk 180: Controller nur für den Chat, Makroknopf, Lesetext ohne Goldrahmen)
Sonden: neu 749; 738 (angepasst), jeder-befehl, 687, fokus-betreiber, fokus-merker, runde98-fokus, runde98-lesekopf grün; Makroknopf im Bild geprüft.
- XANDER (wörtlich, Funk 180): „Der Game Controller … soll nur beim Chat zu sehen sein … im Spiel selber sollen die Leute die spielen diesen Controller nicht im Hintergrund dran geklebt haben“. **Jetzt**: Wer selbst mitspielt, sieht keine Controller-Abzeichen. Wer nicht mitspielt, sieht sie an den Spielern.
- XANDER: „wenn ich auf Tafel … dort keine Tafel auf“. **Ursache**: Bei den Befehlen gewann der letzte Treffer. „/kratzen“ hat die Kurzform „tafel“ und steht weiter hinten, darum zeigte „Tafel“ die Anleitung von /kratzen. **Jetzt** geht der volle Befehlsname immer vor einer Kurzform. Geprüft: Nur „tafel“ war davon betroffen. Alle Felder des Makroknopfs öffnen etwas.
- XANDER: „in dem makroknopf verlinke bitte alles dazugehörige“. **Neu im Makroknopf** (über „Anpassen“ → „+“): „Deutsch-Aufgabe“ und „Spielmenü“.
- XANDER: „zu wenig Animationen … so Siri Style mäßig … mehr Kontrast mehr Sättigung mehr Action … Profi Level“. **Jetzt**: kräftiger Farbwirbel (Magenta, Violett, Cyan, Blau, Orange), dazu ein zweiter, gegenläufiger Wirbel und ein Lichtkranz, der seine Farbe wechselt.
- XANDER: „das reißt das Ganze nach unten immer den Chat runter … ich möchte dass das nicht erst in dem goldenen Rahmen kommt nur weil wir eine Zeile markieren die Zeile soll alleine markiert sein“. **Ursache**: Jeder Tipp auf eine Lesezeile setzte zugleich den Fokus, und der Text sprang mit Goldrahmen unter den Chat. Außerdem rollte `scrollIntoView` die ganze Seite mit. **Jetzt**: Der Tipp markiert nur die Zeile. Es rollt nur der Chatverlauf. Festhalten geht allein über den Knopf „Fokus“.

### Fassung 750 (Walkie 293: Mitjagen/Mithauen auf den Plätzen, überlappende Zeile im Dorf-Menü)
Sonden: 716 (neuer Teil „Mithelfen auf den Plätzen“), 643, 692, 709, 711 grün. In 716 fällt nur die Bildraten-Messung durch (38 statt 40 Bilder/s); der Stand vor 750 fällt dort genauso durch, das liegt am Container. Bild der Plätze mit Wild geprüft.
- XANDER (wörtlich, Walkie 293): „bei dem unteren Knopf hört man aber keinen Sound das scheint es nicht zu gehen … irgendwie scheint es nicht verlinkt zu sein“. **Ursache**: „Mitjagen“ (der untere Knopf im Wald) verkürzt nur die Zeit und bringt nichts sofort ins Lager. Darum erschien keine Zahl. Der Knopf wurde auch nicht mitgegeben, und der Ton war ein leises „pling“. **Jetzt**: Mitjagen knallt (Schuss), Mithacken klingt nach Axt, Mithauen nach Hammer. Am Knopf steht „−15 s“ bzw. „+1 Holz/Erz“. Der Hinweis heißt „Du hilfst den Jägern/Holzfällern/Bergleuten“, vorher stand dort falsch „den Jäger“.
- XANDER: „soll das auf den positionsfeldern eher geschehen dass man das optisch auch ein bisschen sieht … in den Einstellungen … ob man nur durch den Button mit jagen möchte oder ob man grafisch mit jagen möchte“ und (Funk 178) „beim Jagen … mit unseren eigenen Waffen … die Tiere jagen“. **Jetzt**: Mithacken, Mitjagen und Mithauen legen gleich das passende Werkzeug in die Hand, und das Dorf-Fenster geht zu. Auf den Plätzen stehen dann Bäume, **Wild** (Reh, äst) oder **Fels mit Erzadern**. Beim Tipp aufs Reh erscheint ein Zielkreuz, das Geschoss der eigenen Waffe fliegt hin, es blitzt, und das Reh flüchtet (Spuren, 20 s). Beim Tipp auf den Fels schlägt die Spitzhacke zu, Funken fliegen, es gibt +1 Erz. Jeder Treffer holt den Trupp 15 s früher zurück. Auf besetzten Plätzen liegt das Bild nur unten, die Gesichtsmitte bleibt frei. **Schalter** unter den Trupps: „Mithelfen: auf den Plätzen / nur Knopf“ (Voreinstellung: auf den Plätzen). Beide Werkzeuge stehen auch in der Werkzeugwahl (2× auf einen Platz).
- XANDER: „dann gibt's im Menü irgendwo noch unten so Buttons die eine Zeile überlappen … bei den Wahrzeichen“. **Ursache**: Die Liste mit Werkstätten, Ställen und Trupps war im Dorf-Menü ein eigener kleiner Scrollkasten. Die letzte Zeile wurde halb abgeschnitten, und direkt darunter standen „Bauen / Markt / Forschung / Wahrzeichen“. **Jetzt** zeigt die Liste alles in voller Höhe, das Menü scrollt als Ganzes. Mitbehoben: Beim Knopf „Wahrzeichen“ fehlte ein Anführungszeichen, das Attribut war kaputt.
- Noch offen aus Walkie 293 (gewählt: Ausbildung für Bergleute, Holzfäller, Jäger; Kaserne für Soldaten): kommt als eigene Fassung.

### Fassung 751 (Funk 181–183: Spitzhacke klingt, Kuh muht, ein Werkzeug-Knopf statt zwei)
Sonden: 716 (+2 Prüfungen), 643, 677 (Werkzeugliste angepasst), 682, 692 grün.
- XANDER (wörtlich, Funk 182): „fürs hacken im Bergwerk gibt's nur einen schwachen Sound das müsste er so ein klingen sein für so eine Spitzhacke gegen Stein“. **Neu**: eigener Klang „spitzhacke“ (Stahl klingt auf Fels, Steinchen rieseln). Er setzt sofort ein und startet darum genau, wenn die Hacke aufschlägt (480 ms). Er gilt für „Mithauen“ und für die Spitzhacke auf den Plätzen. (Der fehlende Ton beim Mitjagen aus demselben Funk ist seit 750 da: Schuss.)
- XANDER (Funk 183): „Der Sound für das Kühe melken … könnte ein eigener sein z.B das Muhen von einer Kuh“. **Neu**: „kuhmuh“ beim Melken, danach leise das Eimerfüllen.
- XANDER (Funk 181): „diese zwei Pfeile wo man dann … das Werkzeug tauschen kann aber gleichzeitig ist auch das aktive Werkzeug ein … Button … der irgendwie gar keine Funktion hat … das ist doppelt gemoppelt“. **Jetzt** gibt es EINEN Knopf: das Werkzeug in der Hand mit einem kleinen ⇄. Tippen öffnet die Werkzeugwahl, dort steht auch „Weglegen“.
- **Mitbehoben (vor dem Hochladen gefunden)**: Das Skript, das neue Geräusche holt, schrieb die Geräuschliste nur aus seinen eigenen Namen neu. 294 andere Töne (Graben, Axt, Tierstimmen …) wären stumm geworden. Sonde 643 hat das gemerkt. Das Skript ergänzt die Liste jetzt, alle 449 Töne sind da.

### Fassung 753 (Funk 183: Kompass oben links mit deutscher Uhrzeit, sichtbarer Wald, Tafel-Ordner, Schiffe versenken im Makroknopf)
Sonden: neu 753 (auf dem Stand vor 753: 12 rot, jetzt alles grün); 708, 709 (Kompass-Lage angepasst), 711, 716, 725, 687 (Standardfelder angepasst), 749 grün. Dorfbild auf 360 px geprüft.
- XANDER (wörtlich, Funk 183): „der Kompass der … rechts unten ist der kann links oben hin so dass er unten nicht den … Zugriff auf das Feld versperrt und dann kann neben den Kompass … noch die deutsche Uhrzeit so haben wir links die Uhrzeit rechts das Wetter und in der Mitte den Namen von der Stadt“. **Jetzt** oben: links Kompass (Lupe, 31 px) und daneben die Uhrzeit in Deutschland (Zeitzone Berlin, gleich wo das Gerät steht; stellt sich jede Minute selbst nach), Mitte Ortsschild, rechts Wetter. Nichts überlappt, unten liegt nichts mehr über den Feldern. Die kleine Karte (nah dran) sitzt jetzt unten rechts in der Ecke.
- XANDER: „wir brauchen noch einen sichtbaren Wald wo wir die Leute hinschicken zum Jagen und Holzfällen der muss noch grafisch im Bild sein“. **Neu**: rechts vom Rathaus, zwischen Bergen und Strecke, ein dichter Nadelwald in fünf Reihen (hinten kleiner und blasser) mit Waldboden. Der Wald-Knopf liegt genau darauf; der Zug fährt davor vorbei. Gemessen: an der Stelle des Knopfes 71 % Waldgrün (vorher 5 %).
- XANDER: „bei unserer Tafel haben wir immer noch nicht diese Beispieldateien für die Übungen wie man einen ng Sound erzeugt oder diese Bilderwelt … das sollten ja eigene Kategorien bei den Ordner da sein“. **Ursache**: Seit 725 lagen sie nur hinter dem Bild-Knopf; der Ordner-Knopf zeigte allein die gesicherten Tafeln. **Jetzt** stehen im Ordner oben „Aussprache-Übungen“ (NG, K, ICH/ACH, Ü, Ö, lang/kurz, Dehnungs-h, Konsonanten am Stück) und „Bilderwelten“ (30 Themen), darunter „Meine gesicherten Tafeln“.
- XANDER: „der makrobaten in der Mitte von der Bühne hat … noch nicht alle Verlinkungen schau mal dass du das Schiffe versenken auch verlinkt ist“. **Jetzt** ist „Schiffe versenken“ ein eigenes Feld im Makroknopf (bisher nur unter „Spiele“). Wer seine Felder schon angepasst hat, bekommt es einmal hinten dazu; nimmt er es heraus, bleibt es weg.

### Fassung 754 (Funk 181: das Kampf-Symbol in der Leiste)
(Die Nummer 752 war dafür vorgesehen; weil 753 schon oben war, heißt sie 754 – eine kleinere Nummer würde die Update-Anzeige verwirren.)
Sonden: neu 754 (alles grün); 633, 692, 707, 710 laufen jetzt mit ausgeschaltetem Kampf-Symbol (= die alte, ganz offene Leiste) und sind grün; 643, 649, 650, 651, 677, 682, 716, 719, 738, 753 grün. Leiste auf 360 px zu und offen angesehen.
- XANDER (wörtlich, Funk 181): „das will im Prinzip eigentlich nur ein kampfsymbol und ein Dorf Symbol haben ja dass wir wenn wir auf das kampfsymbol Klicken sich diese Elemente erweitern in der Leiste … wenn man auf das Camp Symbol klickt dann ist sofort auch die primäre Wasser aktiv weil man dadurch in den Kampf geht … und das Dorf ist trotzdem noch als letztes Symbol da … das kampfsymbol rutscht … nach oben rechts neben das bürgermenü so dass es praktisch die Überschrift darstellt für die unteren Elemente und immer dann wenn man es noch mal klickt rutscht es wieder nach unten und schließt diese Taschen“.
- **Außerhalb des Kampfes**: in der Leiste nur Controller, Kampf-Symbol (gezeichnete gekreuzte Schwerter) und Dorf.
- **Tipp aufs Kampf-Symbol**: Schwert-Klang („kampfauf“, neu), die Primärwaffe ist sofort angelegt, die Kampf-Taschen klappen auf (Primär, Sekundär, Tier-Fähigkeit, Heilen, Tränke, dazu Superkraft/Klassenkraft/Reparieren, wenn vorhanden), das Dorf bleibt dabei. Das Symbol rutscht in 0,4 s hoch rechts neben das Menü (☰) und ist dort die Überschrift.
- **Tipp auf die Überschrift**: Klang des Einsteckens („kampfzu“, neu), die Waffe wird eingesteckt, das Symbol rutscht zurück in die Leiste, die Taschen schließen.
- Wer ohnehin schon kämpft (Waffe übers Rad angelegt, Zauber bereit), sieht die Taschen automatisch. Abschaltbar im Menü unter „Leiste unten ordnen“ → „Kampf-Symbol: aus“ (dann alles wie früher immer offen).
- Die eigene Reihenfolge der Leiste bleibt gültig; in der Grundordnung steht nur der Schraubenschlüssel (erscheint nur bei beschädigten Waffen) hinter dem Dorf.

### Fassung 755 (Walkie 294: Plündern mit Folgen – Scheitern, Rache, Ticker)
Server: Migration `spiel_755_pluendern_folgen` (spiel_pluendern neu). Servertest in einer zurückgerollten Transaktion: 40 Versuche gegen 3 Ritter → 11 abgewehrt, 29 geplündert (erwartet 30 %); jede Abwehr bucht 10 Mana und die Strafpunkte richtig um; Rache ohne Mana gelingt trotz Anfängerschutz, eine zweite Rache kostet wieder 10 Mana; jeder Versuch schreibt eine Ticker-Zeile.
Sonden: neu 755 (alles grün); 754 (+ Hinweispunkt), 683 (Werkzeugliste seit 750), 686, 634, 640 (Kampf-Symbol aus), 692, 699, 700 grün.
- XANDER (wörtlich, Walkie 294 – er wählte alle drei): „Plündern kann scheitern – Wachen/Ritter wehren ab, der Plünderer verliert Mana und Punkte“, „Rache: 24 Stunden lang kann man den Plünderer ohne Mana-Kosten zurückplündern“, „Das ganze Dorf sieht im Ticker, wer geplündert hat“.
- **Scheitern**: 12 % Grundchance, jeder Ritter des Verteidigers +6 %, jeder eigene −4 % (zwischen 5 und 60 %). Dann sind die 10 Mana weg und 3 % der eigenen Punkte (2 bis 20) gehen an den Verteidiger. Am Platz des Verteidigers springt ein gezeichneter Schild hoch, im selben Moment klirrt der Schlag („schildblock“, neu). Abwehrversuche zählen zu den 6 Plünderungen am Tag.
- **Rache**: Wer geplündert wurde, sieht bei diesem Nachbarn „Rache · ohne Mana“ (Nachbarliste und in seinem Dorf). 24 Stunden lang einmal ohne Mana, auch wenn der Plünderer noch Anfängerschutz hat; danach wieder normal. Auch eine Rache kann scheitern.
- **Ticker**: Jede Plünderung, Rache und Abwehr steht im Laufband oben auf der Seite („⚔️ XanderFox hat die Bäckerei von Emy geplündert“, „⚔️ Emy rächt sich und plündert die Bäckerei von XanderFox“, „🛡️ Emy hat einen Plünderversuch von XanderFox abgewehrt (3 Ritter)“) und sofort als Meldung bei allen im Raum.
- **Nachgebessert an 754**: Rüstet man eine Tier-Fähigkeit oder Kämpferklasse aus, klappen die Kampf-Taschen auf – die Meldung sagt ja „der Knopf steht in der Leiste“. Wartet in den zugeklappten Taschen etwas (Waffe stumpf, Superkraft voll), trägt das Kampf-Symbol einen gelben Punkt.

### Fassung 756 (Walkie 293: Berufe mit Ausbildung, Kaserne für die Ritter)
Server: Migration `spiel_756_berufe_kaserne` (spiel_beruf_max, spiel_ausbilden, spiel_trupp_s, spiel_ritter, spiel_bauen). Servertest in einer zurückgerollten Transaktion: ohne Kaserne „Ritter brauchen eine Kaserne zum Trainieren“; Kaserne Stufe 1 (140 P) fasst 2 Ritter, der dritte wird abgelehnt; zwei ausgebildete Holzfäller: 15 statt 11 Holz je Fahrt; Bergleute höchstens 2 je Bergwerk-Stufe; Jäger höchstens 4; unbekannter Beruf abgelehnt.
Sonden: neu 756 (alles grün); 683 (Test-Dorf mit Kaserne), 686 (13 Gebäude), 702 (9 Berufe), 709 (13 Kartenpunkte), 704 (Leerstellen-Suche hält jetzt 22 px Abstand zu allen Knöpfen – seit 753 lag sie neben dem Kompass; war schon vor 756 rot) angepasst und grün; 692, 700, 703, 708, 711, 716, 753, 755 grün. Dorfbild mit allen Gebäuden auf Stufe 3 angesehen.
- XANDER (Walkie 293, gewählt): „Ja – Ausbildung, ausgebildete bringen mehr als freie Bewohner“ und „Ja, und Soldaten brauchen eine Kaserne zum Trainieren“.
- **Neue Berufe** (Dorf-Ansicht → Berufe, je 15 Punkte): Fischer, Holzfäller, Jäger (je höchstens 4) und Bergleute (2 je Bergwerk-Stufe), jeder mit eigener Figur (Südwester, rote Mütze mit Axt, Jägerhut mit Feder, Grubenhelm mit Lampe und Spitzhacke). Ein Ausgebildeter bringt je Fahrt 2 Holz bzw. 2 Fische oder 1 Fleisch bzw. 1 Erz mehr – ein freier Bewohner nur eine halbe Einheit. Die Trupp-Zeile sagt es: „bringen 15 Holz · davon 2 ausgebildete Holzfäller (+4)“.
- **Kaserne** (neues Gebäude ab Level 4, 140 Punkte je Stufe): steht zwischen Schmiede und Krankenhaus, mit Weg, Fahnenmast in Schwarz-Rot-Gold, Strohpuppe und Zielscheibe. Ritter werden nur noch dort ausgebildet, 2 je Stufe (bis 6); ein Tipp auf die Kaserne zeigt „1 von 6 Rittern“ und den Knopf „Ritter ausbilden · 40 P“. Ohne Kaserne heißt der Knopf in der Volks-Zeile „Ritter · braucht Kaserne“. Wer schon mehr Ritter hat, behält sie.

### Fassung 757 (Walkie 291/292: die Grundklasse „Gründer“, Klassen-Waffen)
Server: Migration `spiel_757_klassenwaffen` (spiel_klassen_waffe, spiel_klassen_name, spiel_waffe_schaden, spiel_kaufen, spiel_treffer, spiel_veredeln, spiel_verkaufen). Servertest in einer zurückgerollten Transaktion: Gründer kauft Arkanstab → „benötigt Magier-Klasse“; Magier kauft ihn (110 P); nochmal → „hast du schon“; als Titan damit schießen → „benötigt Magier-Klasse“; als Magier → Treffer mit Schaden 28; Magier kauft den Duden → „benötigt Deutsch-Gelehrter-Klasse“.
Sonden: neu 757 (alles grün).
- XANDER (Walkie 291): „Deutscher oder Gründer … such dir das aus was gut in die Spiele Ästhetik passt“. **Gewählt: „Gründer“** – jeder gründet ja sein Dorf, und es klingt nach Anfang statt nach Herkunft. Im Menü Kämpferklasse steht „Gründer · Grundklasse“ jetzt oben als eigene Zeile mit gezeichnetem Zeichen (Haus mit Fahne); ohne Klasse steht dort „du“, sonst „Zurück“. Im Mehr-Menü steht „Kämpferklasse · Gründer“ statt „wählen“.
- XANDER (Walkie 292): Klassen-Waffen, die man im Laden sieht, mit dem Hinweis „benötigt Magier-Klasse“. **Neu**, je Klasse eine Waffe, alle gezeichnet: Arkanstab (Magier, 20 Schaden, 110 P), Wurfdolch (Dieb, 16, 80 P), Streithammer (Titan, 23, 130 P), Kräuterschleuder (Heiler, 14, 70 P), Nietenkanone (Ingenieur, 19, 110 P), Duden-Wurf (Deutsch-Gelehrter, 18, 100 P – der gelbe Duden). In der falschen Klasse steht statt des Preises ein grauer Knopf mit dem Klassenzeichen: „benötigt Titan-Klasse“. Wer die Klasse wechselt, behält die Waffe, kann sie aber erst wieder anlegen und abfeuern, wenn er zurückwechselt (auch der Server lehnt den Treffer ab).
- **Nebenbei behoben**: Bei gekauften Waffen mit drei Knöpfen (Anlegen, Verstärken, Verkaufen) wurde auf 360 px das Waffenbild auf 0 px zusammengedrückt. Es bleibt jetzt 38 px breit.
- **Noch nicht drin (kommt als 758)**: mehrere Charaktere (bis zu fünf, einer je Klasse, umschaltbar).

### Fassung 758 (Walkie 290/292: mehrere Figuren)
Server: Migrationen `spiel_758_figuren` und `spiel_758_figuren_rechte`. Neue Tabelle `spiel_charaktere` mit RLS; lesen darf man nur die eigenen Zeilen, schreiben geht nur über die Funktionen. Neue Funktionen: spiel_figuren, spiel_figur_neu, spiel_figur_wechseln. Geändert: spiel_ich (meldet die aktive Figur), spiel_kampfklasse_waehlen (eine Klassen-Figur bleibt in ihrer Klasse), spiel_rangliste (es zählt die beste Figur). Die Hilfsfunktionen, die eine fremde Kennung annehmen, darf der Browser nicht aufrufen (geprüft: `authenticated` und `anon` haben kein Ausführungsrecht).
Servertest in einer zurückgerollten Transaktion mit Xanders Konto:
- Neue Magier-Figur: Level 1, 0 Punkte, 100 LP, 3 Pflaster, die vier Startwaffen. Dorf, Vorräte und Ranking-Punkte sind unverändert.
- Sofort zurück wechseln: „Figurwechsel geht alle 2 Minuten“. Die Magier-Figur zum Titan machen: abgelehnt. 10 Sekunden nach einem Treffer: „Mitten im Kampf“.
- Zurück zur Hauptfigur: Erfahrung, Punkte, Waffen und Klassen-Erfahrung genau wie vorher. Die Magier-Figur behält ihre 7 Punkte.
- Eine zweite Magier-Figur anlegen: abgelehnt.
Sonden: neu 758 (alles grün); 633, 634, 650, 683, 692, 699, 719, 734, 754, 755, 757 grün. Figurenliste auf 360 px angesehen.
- XANDER (Walkie 292, Notiz): „zu jeder Klasse noch mal einen neuen Spieler anfangen und den dann individuell aufleveln … wir können immer mit unserem Hauptaccount … die Klasse wechseln … für jede Klasse ein Account“. Walkie 290: „Andere sehen es nicht“.
- **So ist es jetzt**:
  - Unter Mehr → „Figuren“ steht die Hauptfigur (dein bisheriger Stand, wechselt die Kämpferklasse frei wie bisher). Dazu kommt höchstens eine Figur je Kämpferklasse, also bis zu sieben.
  - Eine neue Figur ist fest an ihre Klasse gebunden und beginnt bei Level 1, mit 0 Punkten, den Startwaffen und ohne Tiere.
  - Neu anfangen will bestätigt sein: Der erste Tipp fragt „Ja, als Magier neu anfangen“, erst der zweite legt die Figur an.
- **Eigen je Figur**: Level und Erfahrung, Punkte, Leben, Mana, Waffen samt Abnutzung und Sternen, Rüstung, Tiere, Tränke, Pflaster, Mission, Tier-Fähigkeit, Kämpferklasse samt Klassen-Stufen.
- **Gemeinsam**:
  - Dorf, Vorräte, Felder, Werkstatt, Volk, Deutsch-Klasse, Mauer, Graben, Geschütz, Tagesgeschenk, Schutzzeit und Flüche. So entkommt man einem Fluch nicht durch Wechseln.
  - Die Ranking-Punkte der Webseite („verdient“): du lernst ja als Person.
  - In der Rangliste im Spiel zählt die beste Figur. Andere sehen nur deinen Namen.
- **Wechseln**: alle 2 Minuten, nicht in der ersten Minute nach einem Treffer. Beim Wechsel wird die Waffe eingesteckt, der Klassenklang spielt, und die neue Figur fliegt in der Liste ein (0,5 s, Klang und Bewegung beginnen zusammen). Die anderen im Raum bekommen sofort den neuen Stand (Level, Leben).
- **Nebenbei behoben**: „Stufe 3“ im Kämpferklassen-Menü (seit 699) und „Grundklasse“ (seit 757) wurden von einem 4 px hohen Balken halb verdeckt. Das Zeichen war als Fortschrittsbalken gestylt. Jetzt ist es wieder normaler Text.

### Fassung 759 (Walkie 293: Einzug in der Kurve und von vorn; Optimus Prime nach G1)
Sonden: neu 759 (alles grün). 696 (Viper und KITT kommen jetzt in 5,4 s statt 3,6 s) und 710 (prüft den Ton-Bild-Gleichlauf jetzt am roten Sportwagen, der den alten Ablauf behält) angepasst und grün; 687, 690, 698, 714 grün. Abläufe auf 360 px Bild für Bild angesehen.
- XANDER (wörtlich, Walkie 293): „bei den Einstiegs Animationen hätte ich in Zukunft gerne auch dass dieser Dodge Viber oder der Kit halt wirklich so eine geile Kurve rein fährt und dann nach vorne zu sehen ist so so mit seinen Lichtern … mit Schwung reinfährt und um die Kurve quietscht und dann kommt der angefahren man sieht den voll im Bild von vorn mit seiner ganzen Schönheit den Wagen und dann steige ich halt aus“.
- **Viper und KITT** (5,4 s):
  - Von links oben in weitem Bogen herein. Das Heck bricht aus (bis 24° schräg), Reifenqualm steigt auf, dazu das neue Geräusch „reifenquietschen“ (ElevenLabs).
  - Dann schwenkt der Wagen zum Betrachter: Die Seitenansicht wird schmal, die neue Frontansicht geht auf.
  - Von vorn fährt er mit Scheinwerferkegeln heran, bremst und federt ein. Bei KITT wandert das rote Lauflicht in der Nase, und die Klappscheinwerfer leuchten.
  - Man sitzt sichtbar hinter der Frontscheibe, steigt aus und hüpft auf den Platz. Der Wagen schwenkt zur Seite und fährt rechts davon.
  - Die Frontansicht steht immer ganz im Bild, auch am Rand-Platz; dann ist sie etwas seitlich versetzt.
  - Die Nachbarn bleiben vor dem Wagen, ihr Gesicht bleibt frei. Der Abgang (beim Gehen) ist wie bisher.
- XANDER: „den Optimus Prime kannst du mal noch viel besser … nach seinem originalen Vorbild gestalten und auch wenn er verwandelt ist … wieder richtige Optimus Prime aussieht … nimm dir das Original als komplette Vorlage“. **Neu gezeichnet nach dem G1-Vorbild** (1984):
  - **Truck**: roter Frontlenker mit Chromrahmen ums Seitenfenster, zwei Auspuffrohren (vorn mit Hitzeschutz), Lufthörnern und fünf Dachleuchten, dazu großer Chrom-Außenspiegel, Chromgrill mit Scheinwerfer und Blinker an der Front, Chrom-Stoßstange, Trittstufen, Chromtank, blauer Rahmen mit Sattelkupplung, Felgen mit acht Radmuttern.
  - **Roboter**: blauer Helm mit hohen Ohrantennen und Stirnkamm, blau leuchtende Augen, silberne Mundplatte mit Rillen. Die Brust ist rot, mit den zwei Scheiben des Fahrerhauses in Chromrahmen. Darunter der Kühlergrill als Bauch mit den Scheinwerfern links und rechts und die Stoßstange als Gürtel.
  - Rote Schultern mit den Auspuffrohren dahinter, graue Oberarme, rote Unterarme mit Rillen, graue Fäuste.
  - Graue Oberschenkel, blaue Schienbeine mit hellblauem Fenster, Chromtank außen und Rad an der Wade, blaue Füße.
  - Die Verwandlung, das Absetzen des Bildes mit beiden Händen und das Weggehen laufen unverändert.

### Fassung 760 (Walkie 290: „viel Quatsch dabei“ – Aufgabenbank durchgesehen, Aufgaben melden)
Server: Migration `spiel_760_aufgabe_melden`: neue Tabelle `spiel_aufgabe_meldungen` mit RLS (man liest nur die eigenen Meldungen) und die Funktion spiel_aufgabe_melden. Servertest in einer zurückgerollten Transaktion:
- Emy meldet: 1 Meldung, die Aufgabe bleibt. Meldet sie noch einmal, zählt es nicht doppelt. Ein unbekannter Grund wird abgelehnt.
- Xander meldet: Die Aufgabe ist sofort aus dem Spiel, mit dem Sperrgrund „Meldung 760 (Betreiber): Lösung ist falsch“.
Sonden: neu 760 (alles grün); 645, 648, 673, 682, 747 grün. Deutsch-Fenster auf 360 px angesehen.
- XANDER (wörtlich, Walkie 290): „bei den Fragen das kann man noch mal überarbeiten da ist doch viel Quatsch dabei der gar nicht funktioniert“.
- **Durchsicht**: Aktiv sind 14.609 Aufgaben, gesperrt waren schon 2.079.
  - Die fehleranfälligen Kategorien hat je ein Prüfer Satz für Satz gelesen, zusammen rund 7.800 Aufgaben: richtig/falsch A1–C2, ß/ss, Wortpaare, Sinn, Konnektoren, Nebensätze, wenn/ob, kennen/wissen, Possessiv, das/dass, als/wie, Modalverben, Präfixverben, Präpositionen, Relativsätze. Jeder Treffer wurde von Hand nachgeprüft.
  - Maschinell zusätzlich geprüft: leere Felder, kaputte Zeichen, fehlende Lücken und doppelte Antworten. Dabei kam nichts Echtes heraus; die Treffer bei „Betonung“ unterscheiden sich nur in der Großschreibung, und das ist dort gewollt.
- **Gefunden und repariert** (statt gesperrt, damit die Übungen bleiben):
  - 26 Nebensatz-Aufgaben, bei denen „als“ ebenso passte wie „nachdem“ (z. B. „Als der Film zu Ende war, sind alle nach Hause gegangen“ ist richtig). Die zweite passende Antwort ist jetzt „ob“.
  - Bei „Tom/Lea zögerte noch, ___ die Frist bereits abgelaufen war“ passten auch „nachdem“ und „während“ (im Sinn von „wohingegen“). Sie sind jetzt durch „damit“ und „bevor“ ersetzt.
  - In 17 Sätzen stand der Name doppelt („Nachdem Tom gegessen hatte, hat Tom die Küche aufgeräumt“). Jetzt heißt es „hat er …“ bzw. „hat sie …“.
  - „Ein juristischer ___ kann sehr teuer werden“: „Vertrag“ und „Termin“ passten neben „Prozess“ ebenfalls. Jetzt stehen dort „Prozeß“, „Kessel“ und „Schirm“.
  - Zwei Meldungen der Prüfer habe ich verworfen: „bei Ihren Wagen“ ist als Mehrzahl richtig, und „seine Nachbarn“ ist Mehrzahl.
- **Aufgabe melden** (neu, damit Fehler künftig sofort rausfliegen):
  - Unter jeder aufgelösten Aufgabe steht klein „Stimmt was nicht? Melden“. Vorher steht dort nichts, weil man die Lösung noch nicht kennt.
  - Ein Tipp zeigt drei Gründe nebeneinander: „Lösung falsch“, „Zwei passen“ und „Satz unklar“.
  - Meldet der Betreiber, ist die Aufgabe sofort aus dem Spiel; bei anderen Spielern ab zwei Meldungen. Solange man meldet, springt die Aufgabe nicht weiter; nach dem Dank kommt die nächste.
  - Die Zeile hat immer ihren festen Platz, damit beim Auflösen nichts springt (gemessen: Aufgabe vorher und nachher 245 px). Alle Knöpfe sind mindestens 32 px hoch.
- **Nachtrag Durchsicht** (Präfixverben, Präpositionen, Relativsätze, 1.460 Aufgaben): 5 Treffer, alle echt, alle repariert:
  - „___ des Regens sind wir spazieren gegangen“: „Während“ passte neben „Trotz“ und ist jetzt durch „Außerhalb“ ersetzt.
  - „Bitte hör jetzt ___!“: „zu“ passte neben „auf“ und ist durch „um“ ersetzt.
  - Zweimal „nachgeben/aufgeben“: „auf“ ist durch „um“ ersetzt.
  - „Wessen Aussage widerlegt wird, ___ verliert …“: Die Lösung war falsch („dessen“), richtig ist „der“.
  - Insgesamt sind rund 7.800 Aufgaben geprüft und 34 repariert.

### Fassung 761 (Walkie 290: Rundenkampf „Faustkampf“ oder „Mit Ausrüstung“)
Sonden: neu 761 (alles grün); 701, 722, 734, 747 grün. 669 hat 4 rote Punkte im Tower-Defense-Teil. Die waren schon vor 761 rot (Gegenprobe mit der Sicherung) und werden noch untersucht. Auswahl und Kampf auf 360 px angesehen.
- XANDER (wörtlich, Walkie 290): „vorher ein Set von Waffen festlegen oder Eigenschaften Primärwaffen Sekundärwaffe die mir mitten im Kampf nehmen und wie machen wir das dass es dann trotzdem fair bleibt ich weiß ja nicht wie das in anderen Spielen ist oder wir machen halt zwei Versionen da ist eine normale … vielleicht ein Faustkampf und dann gibt es das mit mit Waffen“.
- **Zwei Kampfarten** vor jedem Rundenkampf (gegen den Computer und bei Einladungen):
  - **Faustkampf** (vorgewählt): wie bisher, nur Deutsch zählt.
  - **Mit Ausrüstung**: Man legt vorher ein Set fest. Es wird gemerkt, und jeder bringt sein eigenes Set mit.
- **Das Set**:
  - **Primärwaffe** (bringt dem Angriff +0 bis +4 Schaden, je nach Stärke der Waffe; die Bazooka z. B. +4).
  - **Zweitwaffe**: ein eigener Schlag mit 16 Schaden plus Waffenbonus, kostet 1 Stern.
  - **Drei von sechs Eigenschaften**: Eisenhaut (jede Runde mit Rüstung 1), Sternenglück (jede Runde mit 1 Stern), Heilkunde (Heilen +18 statt +12), Schildwall (Schild +15 statt +10), Wut (unter halbem Leben +4 Schaden), Konterprofi (Konter prallt 15 % stärker zurück). Eine vierte geht erst, wenn man eine abwählt.
  - Die Knöpfe im Kampf zeigen die echten Zahlen („Angriff 16 Schaden · Bazooka“). Unter der Bühne steht das Set; der Computer kämpft mit Armbrust, Schildwall, Heilkunde und Wut.
- **Fair bleibt es**:
  - Jede Aktion wirkt weiter nur mit richtiger Antwort.
  - Die Waffe bringt höchstens +4.
  - Alle können dieselben Eigenschaften wählen, und der Level-Ausgleich gilt weiter.
  - Klassen-Waffen gehen nur in der passenden Klasse (757).
  - Wer eingeladen wird, liest „mit Ausrüstung – dein Set aus dem Rundenkampf-Menü“.
- **Noch offen aus Walkie 290**: Skins, Tiere im Set, Arena und Teams (zwei gegen einen, jemand schließt sich an).

### Fassung 762 (Tower Defense passt aufs Telefon; Sonde 669 wieder grün)
Sonden: neu 762 (alles grün, 360×640 und 360×740); 669, 675, 747, 761 grün.
- **Ursache der 4 roten Punkte in 669**: Seit Fassung 747 stand die Fragen-Vorwahl (168 px hoch) über dem Tower-Defense-Feld. Auf einem 360×740-Telefon lagen „Deutsch-Frage“ und „Welle starten“ dadurch 27 px unter dem Rand (oben bei 767 px). Der Fingertipp der Sonde ging ins Leere. Das war kein Fehler der Sonde: Auch ein Mensch musste mitten in einer Welle scrollen und sah dabei das Feld nicht.
- **Vorwahl einklappbar**: In der Tower Defense ist die Vorwahl jetzt eine Zeile („Niveau A1 · Schwächen üben · ändern“, 32 px hoch). Ein Tipp klappt Niveau und Fragenart auf, ein zweiter klappt sie wieder zu. Die Zeile zeigt die Wahl sofort. Im Rundenkampf-Menü bleibt die Vorwahl offen wie bisher.
- **Feld nach Höhe**: Das Feld richtet sich jetzt auch nach der Bildschirmhöhe (Reserve 300 px für Kopf, Vorwahl, Stand und Knöpfe; ein Kästchen ist mindestens 26 px groß). Bei 640 px Höhe liegt „Welle starten“ bei 594 px, bei 740 px Höhe bleibt das Feld so groß wie vorher.

### Fassung 763 (Funk 184, erster Teil: Fehler)
Sonden: neu 763 (alles grün); 643, 716, 760 grün (716 und 760 an die neue Lage angepasst).
- **Versehentliche Meldung**: Aufgabe 45984 („Diesen Genuss ließ er sich, allen Widrigkeiten zum Trotz, nicht nehmen.“ – richtig) ist wieder im Spiel. Die Aufgabe stimmt, die Lösung „richtig“ auch.
- **Rückgängig**: Nach dem Melden steht 6 s lang „Danke! … Rückgängig“ (32 px hoch). Erst danach kommt die nächste Aufgabe.
  - Der Server (`spiel_aufgabe_melden_zurueck`) löscht nur die eigene Meldung.
  - Eine durch Meldungen gesperrte Aufgabe ist wieder im Spiel, wenn danach keine Betreiber-Meldung mehr da ist und es weniger als zwei Meldungen sind.
- **„Stimmt der Satz?“ zählt voll**: Bisher gab es halbe Punkte (Fassung 648) und keinen Schnell-Bonus (743), weil man bei zwei Antworten leicht rät. XANDER: „bei C2 … Standard 8 und wenn man schnell 15 wenn man weniger schnell 12 das gibt es dort nicht“. Jetzt wie jede Aufgabe: C2 8 Punkte, bis 6 s 12, bis 12 s 10. Mit der Übung eigener Schwächen und Klassen-Boni kommt mehr dazu. Am Server geprüft (12 bei 4 s, 10 bei 9 s).
- **Schaufel griffbereit**: „Schaufel nehmen“ in der Schatz-Mission gibt jetzt immer die Schaufel in die Hand. Bisher blieb das zuletzt benutzte Werkzeug (z. B. die Sense) drin, und man musste doppelt tippen und im Menü wechseln. Mit der Schaufel in der Hand heißt der Knopf „Schaufel weglegen“.
- **Mithelfen-Wahl nur global**: „Mithelfen: auf den Plätzen / nur Knopf“ steht nur noch im Dorf-Menü, nicht mehr im Fenster von Wald, Bergwerk oder See.

### Fassung 764 (Funk 184, zweiter Teil: Dorf)
Sonden: neu 764 (alles grün); 677, 682, 703, 704, 708, 709, 716, 755, 756 grün. 677, 682 und 703 wurden an die Mengenwahl bzw. die Platz-Knöpfe angepasst.
- **Knöpfe überdecken nichts mehr**: Der goldene Rand aktiver Knöpfe lag 2 px außen um den Knopf, und die Überschrift („Sehenswürdigkeiten“, „Markt“) begann ohne Abstand direkt darunter. Jetzt liegt der Rand im Menü innen, und unter der Knopfreihe sind 10 px Luft. „Bauen & ausbauen“ war 5 px zu breit und heißt jetzt „Bau & Ausbau“.
- **Verkaufen mit Menge**: Ein Tipp auf „Brot verkaufen · 12 da · 6 P je Stück“ klappt 1× / 5× / 10× / alle auf, jeweils mit dem Erlös. Erst dann wird verkauft. Der Server (`spiel_markt`) konnte das schon, der Knopf schickte aber immer „alles“.
- **Wahrzeichen im Dorfbild**: Gebaute Wahrzeichen stehen jetzt im Dorf, auf fünf Plätzen hinter der Bahn wie eine Skyline, und unter der Nacht- und Wetterebene. Ein Tipp öffnet die Sehenswürdigkeiten. Dort steht bei jedem gebauten „Platz im Dorf: 1 2 3 4 5“. Ein belegter Platz tauscht, das andere Wahrzeichen weicht aus. Server: `spiel_wunder_platz` (in `volk.wunder_platz`, geprüft).
- **Bringt das Geld? (geprüft)**:
  - Markt: Der ganze Erlös geht auf die Punkte. Ins Ranking zählen davon höchstens 40 am Tag.
  - Handel mit Mitspielern: Der Verkäufer bekommt genau Menge × seinen Preis.
  - Bahn-Export zahlt mehr als der Markt (3 Brot: 29 P statt 18 P).
  - Die Stadt selbst hat keine eigene Kasse. Reicher wird der Spieler, der damit baut.

### Fassung 765 (Funk 184, dritter Teil: Tourismus mit dem Zug)
Sonden: neu 765 (alles grün); 716 grün. Der Server ist am Server geprüft (Rückrollen).
- XANDER (wörtlich, Funk 184): „praktisch können wir mit dem Zug auch Tourismus in die Stadt bringen oder aus der Stadt um eine andere Stadt zu sehen und wie können wir das in unserer Logik oder in unsere verdienst du mit einbauen weil dadurch kann man doch Geld verdienen überleg dir da mal bitte was“.
- **Touristen steigen aus** (einmal je Zug, alle 20 min):
  - Es kommen 2 Neugierige, dazu je 3 Wahrzeichen-Besucher einer, höchstens 10.
  - Jeder zahlt 2 P Kurtaxe und kauft ein Stück Brot, Bratwurst, Kuchen oder Fisch für 5 P, solange das Lager reicht.
  - Der Knopf zeigt vorher den Betrag, z. B. „+34 P (14 Kurtaxe + 4 × Essen)“. Beim Aussteigen erscheinen am Bahnhof die Reisenden, und die Kasse klingelt.
  - Wer Wahrzeichen baut, verdient also auch am Bahnhof. Ohne Essen im Lager bleibt es bei der Kurtaxe.
- **Ausflug** (einmal je Zug): 3 eigene Bewohner fahren in ein Nachbardorf im Raum.
  - Die Fahrkarten kosten 12 P, dafür gibt es 6 Forschung („Reisen bildet“).
  - Das besuchte Dorf bekommt 9 P Eintritt. Am Bahnhof steht „Zu Besuch waren: Bea (3, 19:39)“, und neue Gäste werden einmal gemeldet.
  - Absichtlich kostet der Ausflug mehr (12 P), als das Ziel bekommt (9 P). So lohnt es sich nicht, Punkte über ein Zweitkonto hin- und herzuschieben.
- Server: `spiel_bahn_zug` liefert jetzt auch `touristen`, `reise` und `gaeste`, `spiel_bahn('touristen')` ist neu, ebenso `spiel_bahn_reise(uuid)`.
- **Stand „modularer Aufbau“ (Frage aus Funk 184)**: Die Wahrzeichen kann man seit 764 auf fünf Plätze stellen. Die Häuser selbst stehen noch fest. Frei verschieben ist der nächste größere Schritt und steht offen.

### Fassung 766 (Funk 186 und 188: Dorf bleibt offen, Aussprache mit Laut-Bewertung)
Sonden: neu 766 (alles grün; mit der Sicherung sind genau die neuen Punkte rot); 641, 648, 649, 651, 673, 686, 711, 716 grün.
- **Dorf bleibt offen** (XANDER, Funk 186: „Wenn man auf der Bühne etwas einsammelt wie Eier oder diesen Schatz … dann soll das nicht das Dorfmenü beeinflussen … das schließt sich nur wenn ich auf den Makroknopf vom Dorf klicke“). Bisher schloss jeder Tipp außerhalb des Menüs alles. Ist das Dorf offen, schließt ein Tipp daneben jetzt nur Räder und Wahlen. Das Ei wird eingesammelt, und das Dorf bleibt stehen. Zu geht es mit ✕ in der Leiste (dort steht bei offenem Dorf der Makroknopf). Andere Menüs schließt ein Tipp daneben wie bisher.
- **Aussprache im Spiel wie im Kurs** (XANDER, Funk 188: „dass wir das wie im Aussprache Training auf der Seite auch in diesem Spiel nutzen können und dann müssen Sie die korrekte Aussprache machen und kriegen dann auch die Punkte dafür“).
  - Geprüft: Vorgesprochen wird im Spiel seit Fassung 651 schon mit der Azure-Stimme. Deine eigenen 23.534 Aufnahmen liegen noch im Ordner `aussprache/`, werden aber nirgends mehr abgespielt. Einen Verweis darauf habe ich im Spiel nicht gefunden.
  - Neu ist die Bewertung. Bisher verglich das Spiel nur den Klang. Jetzt misst es, wie im Aussprachekurs, zuerst mit der Laut-Bewertung von Azure, Laut für Laut. Die Anzeige lautet „88 / 100 · Laut für Laut“, darunter steht der schwächste Laut als Tipp („Dein øː …“). Punkte gibt es ab 60 wie bisher.
  - Ohne Anmeldung oder wenn Azure nicht antwortet, bleibt es beim Klangvergleich.

### Fassung 767 (Funk 185 und 187: Bauern bringen Getreide, Bäckerei backt reihum)
Sonden: neu 767 (alles grün; mit der Sicherung sind genau die neuen Punkte rot); 677, 702, 703, 716 grün. Der Server ist am Server geprüft (Rückrollen).
- XANDER (wörtlich, Funk 187): „Ist das Absicht dass ich nur so wenig Getreide habe bei so vielen Bauern“ und „im Automatikmodus wird nur Brot gebacken“.
- **Ursache, an deinen echten Daten geprüft**: 10 Bauern, Zufriedenheit 96, Automatik an. Im Lager lagen 2 Getreide, 0 Mehl und 42 Brot. Die Bauern lieferten nur bei der Ernte alle 4 Stunden ein paar Körner, und die Automatik hat jedes Korn sofort zu Brot verarbeitet.
- **Bauern arbeiten laufend**, auch ohne Automatik:
  - Alle 20 Minuten bringt jeder Bauer 1 Getreide, mal Zufriedenheit (0,5 bis 1,5), mit Dreifelderwirtschaft mal 1,5.
  - Aufgeholt werden höchstens 12 Takte (4 Stunden).
  - Das ergibt rund 3 je Stunde und Bauer. Bei dir wären es in 3 Stunden etwa 197 Getreide.
  - Die Ernte zählt die Bauern nicht mehr ein zweites Mal.
- **Die Mühle lässt 30 % liegen** (mindestens 4 Getreide). So bleibt Getreide für Saat, Markt und Handel.
- **Die Bäckerei backt reihum Brot, Kuchen und Torte.** Die Torte braucht 2 Mehl, 2 Eier und 1 Milch. Fehlt etwas, backt sie das Nächste.
- Die Meldung beginnt jetzt mit „Dorf:“, z. B. „Dorf: 10 Bauern bringen 197 Getreide“.

### Fassung 768 (Funk 189–191: Fehler zuerst)
Sonden: neu 768 (alles grün; mit der Sicherung sind genau die neuen Punkte rot); 648, 651, 666, 669, 678, 686, 703, 711, 716, 764, 766 grün. Angepasst, weil sich das Verhalten gewollt ändert: 673, 682, 707 (Fund-Knopf) und 764 (Wahrzeichen-Plätze).
- **Aussprache-Übung ohne Wort** (XANDER, Funk 190: „man kriegt kein Wort präsentiert … die ersten beiden Fällen sind ausgegraut … dass die Verbindung zu der sauberen Stimme nicht aufgebaut werden kann").
  - Ursache: Ob Azure bereitsteht, weiß die Seite erst, wenn der „Stand“ einmal geladen ist. Das geschah nur im Aussprachekurs. Wer direkt ins Spiel ging, hatte nie Azure. Dann gab es weder Vorsprechen noch Laut-Bewertung, und die Knöpfe blieben grau.
  - Jetzt lädt die Brücke den Stand zuerst.
  - Beim Herausschneiden aus der Sammeldatei entstand außerdem je Wort ein neuer AudioContext. Telefone erlauben davon nur wenige. Jetzt entsteht keiner mehr.
  - Fehlt das Vorsprechen, geht „Nachsprechen“ trotzdem, solange die Laut-Bewertung erreichbar ist. „Melde dich an“ erscheint nur noch, wenn man wirklich nicht angemeldet ist.
- **Nicht mehr schließen können**: Das Fenster springt zur Aufgabe hoch, und die Kopfzeile mit ▾ und ✕ verschwand dabei oben. Die Kopfzeile bleibt jetzt stehen.
- **Schatz nur auf der Bühne** (Funk 189: „ich sammle ihn nur auf der Bühne ein und nicht über einen anderen Button“; Funk 190: „das Dorf schließt sich auch immer noch“).
  - Der Knopf im Deutsch-Fenster heißt jetzt „Zur Bühne“: Er legt das Fenster ab und zeigt, wo das Säckchen liegt. Einsammeln muss man selbst.
  - Der Knopf unten in der Leiste ist weg.
  - Ein offenes Dorf bleibt dabei offen.
- **Wahrzeichen im Grünen** (Funk 191: „der soll lieber irgendwo im Grünen stehen … die Zeichen verdecken das alles“; Funk 192: „dass der Fernsehturm egal wo er steht diese Eingabe an den Orten nicht behindern kann“).
  - Gemessen: Der Fernsehturm lag über dem Bahnhof, Platz 4 über dem Wald, der Dom unter dem Kompass.
  - Die fünf Plätze liegen jetzt auf freier Wiese: unten links, unten rechts, am linken Rand, bei der Schule und am Fluss. Keiner berührt Bahnhof, Wald, See oder Feld.
  - Nur die gemalte Form fängt den Tipp, das leere Kästchen drumherum lässt ihn durch.
- **Der „Schein“**: Hinter jedem Wahrzeichen lag die helle Knopffarbe des Menüs als Kasten. Die ist weg. Nachts wird das Wahrzeichen dunkler wie die Häuser.
- **Kompass kleiner** (Funk 191): 26 statt 31 px. Die Tippfläche bleibt über einen unsichtbaren Rand bei 32 px.

### Fassung 769 (Funk 191–194: träge Plätze, Ton bei Sprachnachricht, Vorrat, Handel, Bauern-Rechnung)
Sonden: neu 769 (alles grün). Mit der Sicherung bricht sie ab, weil dort die Prüfhaken fehlen. 673, 677, 702, 703, 707, 711, 716, 764–768 grün, 682 angepasst (Preisvorschlag). Der Server ist geprüft (Rückrollen: 120 Brot auf einmal angeboten).
- **Träge Plätze** (XANDER, Funk 191: „wenn man auf den Plätzen … mitgraben will mit Angel will mit jagen will oder mit abbauen will oder mit düngen will oder mit sehen will dann reagiert das viel zu träge“).
  - Gemessen, mit auf ein Viertel gebremstem Prozessor (wie ein Handy): Nach dem ersten Mähen kamen die nächsten Tipps gar nicht an.
  - Die Meldung oben („Fundstück eingesammelt …“, „+3 weitere“) lag 8 Sekunden und länger über der oberen Platzreihe und schluckte jeden Tipp.
  - Jetzt geht ein Tipp durch die Meldung auf den Platz, nur „Ansehen“ und ✕ bleiben Knöpfe. Mit einem Werkzeug in der Hand ist die Meldung halb durchsichtig.
  - Danach: Tipp → Ton 17–130 ms, jeder Tipp kommt an.
- **Still bei Sprachnachricht** (Funk 192: „dass vorübergehend die Sounds von doof ausgeschaltet werden wenn ich eine Sprachnachricht schicke“). livechat.js meldet Beginn und Ende der Aufnahme. Das Spiel blendet seinen ganzen Klang aus (Wind, Vögel, Hammer, Zug, Werkzeuge) und danach wieder ein. So landet nichts davon in der Aufnahme.
- **Vorrat an jeder Station** (Funk 192: „wie viel Mehl da ist wie viel Kuchen wie viel Brote … wie viel Holz … wie viel Fleisch … wie viel Erz“).
  - Bäckerei: Mehl, Eier, Milch, Brot, Kuchen, Torten.
  - Mühle: Getreide, Mehl. Wald: Holz, Fleisch. Bergwerk: Erz, Quarz, Gold, Öl, Silizium.
  - Schmiede, Labor, Brauerei, Ställe und Rathaus ebenso.
- **Handel** (Funk 192: „ich kann da nicht noch mehr verkaufen … ich möchte mehr verkaufen können“ und „wer legt das fest woher weiß ich wie viel es beim Händler kostet“).
  - Die Grenze lag in der Auswahl: nur 1/5/10/20 und nur vier Waren. Der Server nahm höchstens 50 und 5 Angebote.
  - Jetzt lässt sich alles anbieten, was im Lager liegt, bis „alle“. Der Server nimmt bis 500 je Angebot und 10 Angebote gleichzeitig.
  - Unter der Wahl steht, was der Händler (Markt) heute zahlt. Der Preis wird knapp darunter vorgeschlagen.
  - „Billiger als beim Händler“ vergleicht jetzt mit diesem Tagespreis statt mit einer festen Tabelle.
- **Bauern-Rechnung** (Funk 193/194: „Was meinst du damit dass die Bauern dreimal Getreide pro Stunde bringen … 12 x 5 Minuten würde ja 12 mal Getreide bedeuten“).
  - „3 je Stunde“ war die Menge EINES Bauern bei mittlerer Laune. Jetzt steht die Summe des eigenen Dorfs da, mit derselben Rechnung wie der Server: je Bauer 1 Sack alle 20 Minuten, mal Laune (0,5 + Zufriedenheit/100), mit Dreifelderwirtschaft ×1,5.
  - Bei Xander (10 Bauern, Zufriedenheit 96) sind das ≈ 44 Sack pro Stunde, mit Dreifelder ≈ 66, ohne Klicken.
  - Dazu kommt, was man selbst mäht: Ein Feld ist in 4 Minuten reif und bringt 5 Sack.
  - 1 Sack Getreide ergibt 1 Sack Mehl, 1 Sack Mehl ergibt 1 Brot (Markt heute etwa 6 P). Ein Bauer bringt also rund 4 Brote pro Stunde für einmal 5 P Ausbildung.

### Fassung 770 (Funk 192: Meldung draußen führt ins Dorf, Newsticker mit Dorf-Ereignissen)
Sonden: neu 770 (alles grün); 711, 755, 765, 766, 768, 769 grün. Der Server ist geprüft (Rückrollen).
- **Meldung draußen** (XANDER: „wenn man oben eine Benachrichtigung bekommt und man ist gerade nicht im Klassenzimmer … dass ich direkt in meinen Livestream zurückkomme an die Stelle in meinem Dorf“).
  - Wer schon einmal mitgespielt hat, bekommt die Dorf-Meldungen jetzt auch außerhalb des Klassenzimmers: „10 Mehl fertig in der Mühle“, Trupps zurück, Stall voll, Acker reif, Plünderung.
  - Dafür wird alle 90 Sekunden still der eigene Stand geholt, nur wenn die Seite zu sehen ist. spiel_ich(null) ändert dabei nichts.
  - Der Knopf heißt draußen „Zum Dorf“. Er führt in den zuletzt benutzten Raum, und dort geht das Dorf gleich an der richtigen Stelle auf (z. B. die Mühle).
- **Newsticker** (Funk 192: „dass Emmys doof angegriffen wurde oder … Alex hat gerade was zum Verkauf angeboten ja irgendwie das günstig ist“).
  - Plünderungen standen schon drin.
  - Neu: „🏷️ Xander bietet 20 Brot je 2 P an – günstiger als beim Händler“ (höchstens einmal in 10 Minuten je Spieler).
  - Neu: „🏛️ … hat im Dorf Holstentor gebaut – Besucher willkommen“.
- Walkies zu den offenen Fragen aus Funk 191/192: 300 (Bündnis, Überfall auf Abwesende), 301 (Geldfluss beim Tourismus), 302 (alte Schuhe verwerten).

### Fassung 771 (Funk 195: Aussprache im Spiel mit Niveau und Prozent, Tafel-Ordner, Zungenbilder sch/st/sp/r)
Sonden: neu 771 (alles grün); 725 und 753 angepasst und grün; 749, 766, runde53 grün. runde69 („Bildbauen einmal“) war schon vor 771 rot, das gleiche Ergebnis mit der Sicherung.
- **Aussprache im Spiel** (XANDER: „Die Aussprache Übungen im Spiel hat kein Niveau und keine prozentuale Anzeige wie wir sie global auf der Webseite auch haben“).
  - Oben in der Karte stehen die Niveaus A1–C2. Ein Tipp holt ein Wort auf diesem Niveau und merkt sich die Wahl.
  - Nach dem Nachsprechen: ein Balken mit der Prozentzahl, darunter die Laute eingefärbt wie im Aussprachekurs (grün sitzt, gelb fast, rot daneben).
  - Der Ergebnisplatz ist fest hoch, die Karte springt nicht.
- **Tafel-Ordner** (XANDER: „beim Whiteboard hat man immer noch nicht die Auswahl im Ordner mit den Bilderwelten“).
  - Gefunden auf 360 px:
    - Die Ordner waren da, aber hinter zwei namenlosen Bildchen (🖼️, 📂).
    - Der Ordner begann über dem oberen Bildschirmrand.
    - Im Aussprache-Ordner waren die Bilder auf 0 Höhe gedrückt: leere Pillen.
  - Jetzt:
    - EIN Knopf mit gezeichnetem Ordner und dem Wort „Ordner“.
    - Darin „Vom Gerät“, „Aussprache-Übungen“ und „Bilderwelten“, darunter die gesicherten Tafeln.
    - Der Ordner steht in der Bildschirmmitte, die Kacheln zeigen Bild und Namen.
  - Der Griff ⌄ stand fest 2,1 rem über dem Rand, mitten auf dem Schwamm. Jetzt misst die Tafel ihre Leiste und stellt den Griff darüber.
- **Makroknopf** (XANDER: „schau auch dass das mit dem makroknopf richtig verlinkt ist“).
  - Neue Felder „Aussprache-Bilder“ und „Bilderwelten“ (für Lehrer): Tafel auf und gleich der richtige Ordner.
  - Wer seine Felder schon angepasst hat, bekommt „Aussprache-Bilder“ einmal angehängt.
- **Zungenbilder** (XANDER: „bei ST SP oder … den ch an dem s c h auch die Stellung der Zunge verdeutlichen über diese Vektorgrafik … als Tipps und Tricks“).
  - Neue Schnittbilder in derselben Bauart wie ng/ich/ach:
    - sch: Lippen rund vor, Enge hinter dem Zahndamm.
    - s zum Vergleich.
    - st: erst sch, dann t.
    - sp: erst sch, dann p.
    - r: am Zäpfchen.
  - Im Aussprachekurs sind sie neue Tricks: „SCH“ (mit s-Vergleich), „ST und SP am Wortanfang“; „R“ hat jetzt ein Bild. Auf der Tafel liegen sie im Aussprache-Ordner.
  - Nebenbei korrigiert: „der Fenster“ → „das Fenster“.

### Fassung 772 (Funk 198/190: Aussprache im Spiel wie auf der Seite, persönliches Aussprache-Wörterbuch)
Sonden: neu 772 (alles grün); 766, 768, 771, 749 grün (766/768/771 prüfen den Ablauf von Hand und schalten die neue Automatik dafür ab).
Server geprüft mit Rückrollen: C2 bei 93 % → 12 Punkte, A1 bei 70 % → 3. Das Wörterbuch speichert, ersetzt dasselbe Wort (Groß/klein egal) und liefert den Ton zurück.
- **Punkte** (XANDER: „man kriegt dort offenbar nur drei Punkte auf Stufe C2“).
  - Stimmt: A1/A2 gaben fest 2, alles darüber fest 3, egal wie gut.
  - Jetzt wie bei den Aufgaben nach Niveau: A1 3, A2 4, B1 5, B2 6, C1 7, C2 8. Ab 80 % gibt es +25 %, ab 90 % +50 %. C2 mit 93 % = 12 Punkte.
  - Die Grenze bleibt bei 40 Aussprache-Wertungen pro Stunde.
- **Runder Kreisel** (XANDER: „diese kreisrunde Prozentanzeige … wie wir das in der globalen Webseite in der Aussprache Übung auch haben“).
  - Derselbe Kreisel wie im Aussprachetrainer (aussprache-kreisel.js), links im Ergebnis.
  - Rechts davon: Note, Punkte, „Weiter“, die Laute eingefärbt.
- **Automatisch** (XANDER: „dass wir das Wort automatisch vorgelesen bekommen und direkt nachsprechen können und direkt bewertet bekommen“).
  - Neues Wort → es wird vorgesprochen → gleich danach hört das Mikrofon zu → Stille beendet die Aufnahme → Bewertung, ohne einen Tipp.
  - Schalter in der Karte „Automatisch vorsprechen und zuhören: an/aus“, auf dem Gerät gemerkt.
- **Persönliches Aussprache-Wörterbuch** (Funk 190: „das eine perfekt erkannte Aussprache die mindestens über 95% liegt da gekoppt wird und als Vorschlag kommt“; Funk 198: „sauber ausgeschnitten ist und auch entrauscht … seitenweit“).
  - Ab 95 % (nur mit Laut-Bewertung) erscheint „In mein Aussprache-Wörterbuch übernehmen“, im Spiel und im Aussprachetrainer der Seite.
  - Im Gerät, vor dem Speichern:
    - Brummen weg (Hochpass).
    - Rauschboden messen.
    - Anfang und Ende des Wortes suchen: Atempause und Stille fallen weg (80 ms Luft vorn, 140 ms hinten).
    - Weiches Rauschtor gegen Grundrauschen.
    - Ein-/Ausblenden, gleiche Lautstärke.
    - Ergebnis im Test: aus 1,5 s Aufnahme bleiben 0,82 s, der Rand ist leise.
  - Gespeichert als kleine WAV am eigenen Konto (Tabelle aussprache_eigen, nur über SECURITY-DEFINER-Funktionen, RLS an ohne direkte Zugriffe, höchstens 500 Wörter).
  - Danach steht in Spiel und Trainer „Meine Stimme“ zum Nachsprechen mit sich selbst (Shadowing).
  - Im Aussprachetrainer gibt es den Bereich „Mein Aussprache-Wörterbuch (n)“ mit Anhören und Löschen.
  - Ehrlich: Das Entrauschen ist ein Rauschtor, keine Spektral-Entrauschung. Gegen gleichmäßiges Rauschen in den Pausen hilft es, Rauschen unter dem Wort selbst bleibt.
  - Noch offen aus Funk 188/190: die Lehrer-Freigabe über Sprachnachrichten im Chat, die eigene Stimme als Vorsprecher-Ersatz im Trainer und die Liste im Profil.

### Fassung 773 (Funk 199: Aussprache läuft von selbst weiter, Spiel still beim Sprechen, andere Übung wählen)
Sonden: neu 773 (alles grün); 766, 768, 769, 771, 772 grün.
Funk 199 kam um 23:19, noch vor Fassung 772. Kreisel statt Strichbalken, automatisches Vorlesen und die Punkte (C2 Grundwert 8, dazu ein Zuschlag nach Prozent statt nach Zeit, wie XANDER vorschlägt: „je nach Prozent … dann kriegt man extra Punkte denn die Zeit bleibt ja dieselbe“) sind seit 772 da.
- **Weiter** (XANDER: „ich will das automatisch vorlesen und das sofort automatische nachsprechen und dann geht die Aufgabe weiter“).
  - Nach der Bewertung läuft ein dünner Balken, dann kommt von selbst das nächste Wort. Ab 80 % nach 2,2 s, darunter nach 4 s, damit man den Tipp lesen kann.
  - Es wird wieder vorgesprochen und zugehört, ohne einen Tipp.
  - Steht das Wörterbuch-Angebot da (ab 95 %), wartet die Karte. Nach dem Übernehmen geht es weiter.
- **Spiel still** (XANDER: „die Töne des Spiels werden immer noch nicht stumm geschalten wenn ich mit dir spreche innerhalb des Livestreams“).
  - livechat.js meldet jetzt, wenn man selbst am offenen Mikrofon spricht. Solange bleibt der ganze Spielklang auf 0 und kommt danach weich zurück.
  - Ebenso still ist das Spiel, solange die Aussprache-Übung zuhört (sonst landen Wind, Vögel und Hammer in der Bewertung) und bei Sprachnachrichten (seit 769).
- **Andere Übung** (XANDER: „man kann keine anderen Aufgaben mehr auswählen wenn man in die Aussprache Übung reingegangen ist“).
  - In der Aussprache-Karte steht „Andere Übung“. Der Knopf klappt die Wahl mit allen Aufgabenarten auf, und die Übung springt so lange nicht weiter.

### Fassung 774 (Funk 197: Diktat im Samsung-Browser „kein-start“)
Sonde runde99 angepasst und erweitert, alles grün.
- Meldung (automatisch, Samsung Internet 30, Android 10): Das Walkie-Diktat galt als „nicht angesprungen“.
- Ursache: Der Wächter brach nach 4 s ab, wenn der Browser kein onstart/onaudiostart schickte. Samsung meldet den Start teils nur über onsoundstart/onspeechstart, oder erst nach der Mikrofon-Freigabe.
- Jetzt:
  - Alle vier Startzeichen zählen.
  - Der Wächter wartet 6 s und startet dann EINMAL neu („Das Mikrofon braucht noch einen Moment …“).
  - Erst wenn auch das nach 5 s nichts bringt, kommt der Hinweis. Der Bericht an mich enthält dann den Zustand (Mikro geliehen, zweiter Versuch, Dauer).

### Fassung 775 (Walkie 299: Gasthaus mit Koch und Gefängnis für Plünderer)
Sonden: neu 775 (17/17 grün); 755, 756, 764, 765 (Erwartung um „à 5 P“ ergänzt), 767, 769, 770 grün.
- **Gasthaus** (ab Level 6, 150 P je Stufe).
  - Je Stufe steigt ein Tourist mehr aus dem Zug.
  - Jedes Gericht bringt 5 + 2 × Stufe Punkte (ohne Gasthaus wie bisher 5 P).
  - Neuer Beruf **Koch** (15 P, 2 je Gasthaus-Stufe): +3 P je Gericht, und die Gäste essen dann auch Fleisch und Eier.
  - Beispiel Stufe 2 mit Koch: 12 P je Gericht, und aus 7 Gästen werden 8. Die Station zeigt „12 P je Gericht · +2 Gast je Zug“, der Bahnhof „Essen à 12 P im Gasthaus“.
- **Gefängnis** (ab Level 7, 170 P je Stufe).
  - Die Wachen machen Plündern um 4 % je Stufe schwerer (höchstens 70 % Scheitern).
  - Wer scheitert, sitzt: 2 h je Stufe (höchstens 6 h), Kaution 10 + 10 × Stufe P.
  - Wer sitzt, kann nicht plündern. Oben im Dorf steht ein Band „Du sitzt im Gefängnis von … · noch 2 h“ mit **Freikaufen**, und die Plündern-Knöpfe sind gesperrt.
  - Im eigenen Gefängnis steht, wer einsitzt und wie lange noch. Im Gefängnis eines anderen Dorfs kann man für jeden Gefangenen **Kaution zahlen**.
  - Die Kaution geht an den, der eingesperrt hat. Das steht im Newsticker („🔓 …“), die Festnahme ebenso („🔒 …“).
- Server:
  - spiel_bauen, spiel_beruf_max, spiel_ausbilden (Koch), spiel_gasthaus, spiel_bahn_zug/spiel_bahn (Gäste und Preis), spiel_pluendern (Haft, Wachen) und neu spiel_kaution.
  - spiel_oeffentlich zeigt jetzt „haft“ und „gefangene“, damit Mitspieler die Kaution zahlen können.
  - Servertest: Bau und Koch klappen; 7 → 8 Gäste; Preis 10 je Gericht (Stufe 1 mit Koch: 5 + 2 + 3); Festnahme mit Kaution 20; ein zweiter Versuch wird abgelehnt („du sitzt im Gefängnis von …“); nach der Kaution ist man frei und die Liste leer.
- Bild: Das Gasthaus ist Fachwerk mit Wirtshausschild, Tisch, Bank und Fass und steht oben zwischen Mühle und Rathaus. Das Gefängnis ist Feldstein mit Wachturm, Zinnen, Gitterfenstern und Pranger und steht oben rechts neben dem Wald.

### Fassung 776 (Funk 196: Folgen aus gemalten Wegen – Runde, ×, zweites Modul, Merken, Platzieren)
Sonden: neu 776 (alles grün); runde98-wegfahrzeuge, runde98-lok, runde97-lok, lok-gleise grün; runde22 grün (Erwartung an den neuen Hinweistext angepasst).
XANDER: „dass man den Weg im zweiten Modul verändern kann wie sie weiter fährt nachdem sie eine Runde gemacht hat und dass man das multiplizieren kann … das sollte für alle Bewegungen gelten … die Sequenz auch … fixieren kann platzieren kann multiplizieren kann".
- **Runde malen**: Beim Weg-Zeichnen darf man jetzt zurück auf den Startplatz ziehen. Das schließt die Runde (Kreispfeil-Zeichen), danach ist der Weg fertig.
- **Folge im Reisemenü** (nach dem Malen, über den Fahrzeugen):
  - Jede Zeile ist ein Modul: „1 · 1–2–6–5–1  − ×2 +“.
  - **Weiter-Weg** malt Modul 2, beginnend dort, wo Modul 1 endet (höchstens 4 Module, jedes außer dem ersten mit ✕ entfernbar).
  - **alles − ×n +** wiederholt die ganze Folge.
  - Oben steht „Deine Folge: 22 Halte“.
  - Eine Runde schließt bei Wiederholung nahtlos an; ein offener Weg fährt vom Ende zurück zum Anfang. Höchstens 80 Halte.
- **Für alle Fahrzeuge**: Fahren, Laufen, Hot Rod, Monstertruck und jede Reise mit Weg (Lok, Flugzeug, Boot, Delfin, Pferd, Heli, Frosch …) bekommen die ganze Kette. Weil es EINE Kette ist, sehen alle Geräte dieselbe Fahrt, auch mit älterem Stand.
- **Merken** (Stecknadel) fixiert die Folge auf dem Gerät (bis 8). Öffnet man das Reisemenü ohne gemalten Weg, stehen die gemerkten Folgen oben.
  - Ein Tipp **platziert** sie: gleiche Form, verschoben auf den eigenen Platz.
  - Passt sie dort nicht ins Raster, fährt man erst zum alten Start und dann die Folge.
- Empfänger:
  - Die Lok und alle Reisen dürfen am Startplatz enden. Vorher brach `lcReise` ab, wenn Ziel = Start war.
  - Beim Auto wird der eigene Platz am Ende nicht mehr „überfahren“.
  - Der Chat-Satz zählt bei mehr als 8 Halten nicht jeden Platz auf („über 20 Halte“).
- Noch nicht: Pac-Man, Mario und das gemeinsame Reisen senden ihren gemalten Weg weiter sofort beim Loslassen, ohne Folgen-Leiste.

### Fassung 777 (Walkie 300, Teil 1: Diplomatie – Bündnis, Vertrauen, Verrat, Verhandeln)
Sonden: neu 777 (13/13 grün); 755, 765, 770, 775 grün (775: Überschrift „Nachbardörfer · …“ angepasst).
XANDER: „Man kann im Prinzip jeden überfallen egal mit wem man einen Bündnis hat aber es beschädigt halt das Bündnis und das Vertrauen … die Vertrauensbasis die muss dann wieder durch Verhandlungen hergestellt werden … ob es dazu eine Sperre gibt … wie das mit der allgemeinen Infrastruktur und dem Rathaus … zusammenhängt".
Vorbilder: Travian (Nichtangriffspakt, Allianzplätze wachsen mit der Botschaft), Civilization (die anderen merken sich Verrat), Clash of Clans (Schilde).
- **Vertrauen** 0–100 je Dorfpaar, Start 50. Neben jedem Nachbardorf: Balken (rot < 40, gelb, grün ≥ 70) und Stand.
- **Bündnis** ab 40 Vertrauen: einer bietet an, der andere nimmt an (Angebot gilt 3 Tage). Annahme: Vertrauen +10.
  - Wie viele Bündnisse, trägt das **Rathaus**: 1 + Rathaus-Stufe (so wie die Botschaft in Travian).
  - Wirkung: Verbündete helfen bei der Abwehr (die Hälfte ihrer Ritter, höchstens 3, macht Plündern schwerer). Ausflüge zu Verbündeten bringen +10 % (Eintritt 10 statt 9 P, Forschung 7 statt 6) und Vertrauen +2.
  - Kündigen geht friedlich (Vertrauen −5, keine Sperre).
- **Verrat**: Wer einen Verbündeten plündert, bricht das Bündnis. Vertrauen −40, 48 Stunden kein neues Bündnis mit diesem Dorf, Ticker „💔 … bricht das Bündnis“.
  - Im Spiel fragt der erste Tipp auf ein Gebäude des Verbündeten nach („Tipp noch einmal, wenn du es wirklich willst“). Die Knöpfe sind rot umrandet.
- Plündern ohne Bündnis kostet −10 Vertrauen (Rache nicht).
- **Verhandeln**: Friedensgeschenk 15 P an das andere Dorf, je 3 P +1 Vertrauen, höchstens +20 am Tag. Das geht auch während der Sperre.
  - Eine Kaution für jemanden zu zahlen (Gefängnis, Fassung 775) bringt +10 Vertrauen zu ihm.
- Server:
  - Tabelle `dorf_beziehung` (RLS an, keine direkten Zugriffe).
  - Neue Funktionen: `spiel_diplomatie`, `spiel_buendnis`, `spiel_verhandeln`.
  - Erweitert: `spiel_pluendern` (Verrat, −10, Hilfe der Verbündeten), `spiel_bahn_reise` (+10 %), `spiel_kaution` (+10).
  - Servertest (zurückgerollt): anbieten → Geschenk +10 (60) → zweites Geschenk +10 (Tageslimit) → Emy sieht das Angebot und nimmt an (80) → Rathaus Stufe 3: 4 Plätze, 1 belegt → Ausflug 7 Forschung → Plündern = Verrat → Vertrauen 42, Sperre 48 h → neues Angebot abgelehnt.
- Behoben vor dem Commit: Liefert der Server für ein Dorf nichts, lud die Zeile endlos nach. Jetzt höchstens alle 5 s, fehlende Dörfer gelten als neutral (50).
- Als Nächstes (778): Überfälle auf Abwesende (1× am Tag, höchstens 10 % Beute, 8 h Schutz, Anfänger unter Level 5 nie, Verbündete nie, Meldung beim Wiederkommen). Danach (779): Beliebtheit, Touristenwellen mit Meldung, Kurtaxe wie in Venedig.

### Fassung 778 (Walkie 300, Teil 2: Überfall auf Abwesende)
Sonden: neu 778 (11/11 grün); 755, 767, 770, 775, 777 grün.
XANDER: „Bündnis wie oben UND Abwesende dürfen überfallen werden, aber nur 1× am Tag, höchstens 10 % Beute, mit Meldung beim Wiederkommen (Schutz: 8 h nach einem Überfall, Anfänger bis Level 5 nie)" · „ich möchte natürlich dass das auch ein Abwesenheit geht".
- Im Dorf unter den Nachbarn steht ein aufklappbarer Kasten **„Abwesende Dörfer überfallen“** (1× am Tag · höchstens 10 % · 10 Mana).
  - Er listet Dörfer, die in den letzten 14 Tagen gespielt haben und gerade nicht im Raum sitzen. Wer da ist, steht oben bei den Nachbarn (normal plündern, 20 %).
- **Regeln** (Server `spiel_ueberfall`):
  - Höchstens 1 Überfall am Tag, 10 Mana.
  - Beute: 10 % je Ware, höchstens 5 je Ware (Rathaus 2 % der Punkte bis 10, Brauerei bis 8 Mana). Schaden am Gebäude: 5 je Stufe.
  - Danach hat das Dorf **8 h Schutz** vor weiteren Überfällen und 24 h Rache ohne Mana.
  - **Nie**: Anfänger unter Level 5, Verbündete, Dörfer mit „Mitspielen aus“. Schule, Bibliothek, Krankenhaus, Gasthaus, Gefängnis und Kaserne sind tabu.
  - Scheitern wie beim Plündern: Ritter, Gefängnis (Haft mit Kaution) und die Hilfe der Verbündeten zählen. Vertrauen −10.
- **Meldung beim Wiederkommen**: Das Opfer bekommt beim nächsten Öffnen „Während du weg warst, hat Dora deine Bäckerei überfallen (2 Brot) – 24 h Rache ohne Mana, 8 h Schutz“.
  - Wurde der Überfall abgewehrt, lautet die Meldung „… haben deine Wachen einen Überfall abgewehrt (+Strafe) – … sitzt jetzt in deinem Gefängnis“.
  - Danach meldet der Client „gesehen“ (`spiel_ueberfaelle_gesehen`), damit es auf keinem Gerät doppelt kommt. Es erscheint keine zweite „geplündert“-Meldung für denselben Überfall.
- Servertest (zurückgerollt):
  - Emy steht in der Liste. Der Überfall bringt 3 von 30 Brot.
  - Ein zweiter Überfall am selben Tag wird abgelehnt. Emy hat 8 h Schutz, das Vertrauen fällt von 50 auf 40.
  - Emy bekommt beim Wiederkommen 1 Meldung, beim zweiten Abruf 0.
  - Verbündete und Anfänger werden abgelehnt.
- Als Nächstes (779): Beliebtheit, Touristenwellen mit Meldung, Kurtaxe wie in Venedig, Überfüllung.

### Fassung 779 (Walkie 300, Teil 3: Beliebtheit, Touristenwellen, Kurtaxe, Überfüllung)
Sonden: neu 779 (10/10 grün); 765, 770, 775, 777, 778 grün.
XANDER: „gib mir … Benachrichtigungen wenn ein neuer Touristenstrom in meine Stadt kommt … Mund zum Mund … dass ich dann mehr produzieren muss aber auch mehr Geld verdienen kann … wenn die Leute hören das ist bei mir den Fernsehturm … aktiv bleiben muss … oder gerade noch mehr Deutsch lernen muss … wie in Italien … tourismussteuer … Venedig … Beliebtheitsfaktor".
- **Beliebtheit** 0–100 (Server `spiel_beliebtheit`) = Grundwert 10 + Wahrzeichen (Besucher × 1,5, bis 40; Fernsehturm allein +21) + Gasthaus (6 je Stufe) + Deutsch geübt in den letzten 24 h (+12) + Ruf (−20 … +20). Am Bahnhof steht sie mit Balken und Aufschlüsselung.
- **Ruf = Mundpropaganda**:
  - Alle Gäste satt: +1.
  - Je 3 Gäste ohne Essen: −1.
  - Mehr Gäste als Platz (6 + 4 je Gasthaus-Stufe): −1.
- **Touristenwelle**: Je Zug (alle 20 min) ist die Chance Beliebtheit × 0,4 % (bei 55 etwa 22 %, gemessen 46 von 200; höchstens 40 %). Dann kommen doppelt so viele Gäste.
  - Meldung oben: „Touristenwelle! 16 Gäste kommen mit diesem Zug – sie wollen Berliner Fernsehturm sehen. Hast du genug Essen?“ (Tipp öffnet den Bahnhof). Der Knopf zeigt vorher „5 bleiben hungrig · zu voll (Platz für 14)“.
- **Kurtaxe wie in Venedig**: 1–6 P je Gast (bisher fest 2 P), einstellbar am Bahnhof mit − / +.
  - Höhere Taxe bringt weniger Gäste. Je beliebter die Stadt, desto weniger schreckt sie ab: Gäste × (1 − (Taxe − 2) · 0,12 · (1 − Beliebtheit/150)).
  - Rechenbeispiel (Server, Beliebtheit 55): Taxe 2 → 9 Gäste (18 P Taxe), Taxe 6 → 6 Gäste (36 P Taxe), aber weniger Essen verkauft. Hohe Taxe lohnt, wenn wenig Essen da ist; niedrige, wenn die Vorratskammer voll ist.
- Nach dem Aussteigen steht, was passiert ist: „🌊 Das war eine Touristenwelle! 2 blieben hungrig – das spricht sich herum (Ruf −1). Die Stadt war zu voll (Ruf −1) – ein größeres Gasthaus schafft Platz.“ oder „Alle satt – sie empfehlen dich weiter (Ruf +1).“
- Server: `spiel_beliebtheit`, `spiel_kurtaxe` neu; `spiel_bahn_zug` (Taxe, Welle, Platz, Beliebtheit) und `spiel_bahn` (Ruf, hungrig, zu voll) erweitert.
- Damit ist Walkie 300 umgesetzt: 777 Bündnis/Vertrauen/Verrat, 778 Überfall auf Abwesende, 779 Tourismus.

### Fassung 780 (Funk 200: Aussprache-Karte kompakt, Piepton, Punkte nach Prozent und Niveau)
Sonden: 766, 768, 771, 772, 773 grün (773 um Piepton/„keine Strichlinie“ erweitert, der Weiter-Balken wird jetzt an `data-weiter` gemessen).
XANDER: „möchte ich dass das Design kompakter ist dass die prozentuale Anzeige etwas kleiner ist … diese Striche Linie braucht es nicht zusätzlich … nachdem der Sprecher gesprochen hat soll es einen kleinen Piepton geben … mit demselben Signalton wie wir das in Originalspiel auch haben … klein und kompakt und niedlich und augenfreundlich … so gut wie ich in Prozentwert bin so gut soll ich belohnt werden … 50% auf A1 bedeutet etwas anderes wie 50% auf C2".
- **Kompakt**:
  - Oben eine Zeile mit den Niveaus A1–C2 und „Auto: an“ (statt der großen Schalter-Pille). Das Wort ist kleiner (22 px).
  - Darunter eine **Statuszeile** mit farbigem Punkt: „Hör gut zu …“ (blau) → „Piep – jetzt du!“ (rot, pulsiert) → „Ich höre zu …“ (gelb) → „Gleich kommt das nächste Wort“ (grün).
  - Vier kleine Symbolknöpfe: Anhören, Sprechen, Nächstes, Übungen.
  - Ergebnis mit kleinem Kreisel (56 px, ohne Schwellenstrich): „88 / 100 · +11 Punkte von 13“, Laute, Tipp.
  - Die Weiter-Linie ist weg; die Wartezeit läuft unsichtbar weiter. Das Wörterbuch-Angebot ab 95 % darf die Karte wachsen lassen.
- **Piepton**: Sobald das Mikrofon offen ist, kommt derselbe Ton wie im Aussprachetrainer der Seite (`Core.sound.sprichJetzt`). Ablauf mit „Auto: an“: vorlesen → Piep → sprechen → Bewertung → nächstes Wort, so lange man will.
- **Punkte nach Prozent und Niveau** (Server `spiel_aussprache_fertig`):
  - Höchstmaß je Niveau: A1 6 · A2 8 · B1 10 · B2 13 · C1 16 · C2 20. Man bekommt seinen Prozentanteil davon, ab 30 %.
  - Servertest: A1 50 % → 3, A1 100 % → 6, C2 50 % → 10, C2 100 % → 20, C2 25 % → 0, B2 88 % → 11.
  - Ein schweres Niveau lohnt sich also: C2 mit 50 % bringt mehr als A1 mit 100 %. Weiter gilt: höchstens 40 Wertungen je Stunde.

### Fassung 781 (Walkie 301: Ausflug zum Wahrzeichen hebt die Laune)
Sonden: neu 781 (10/10 grün); 765 (Ausflugstext angepasst), 775, 777, 778, 779 grün. Servertest: Ausflug nach XanderFox (Fernsehturm) → +5, bis in 4 h; Ausflug in ein Dorf ohne Wahrzeichen → 0.
XANDER (Walkie 301): „Ausflug zum Fernsehturm/Wahrzeichen eines anderen: Zufriedenheit +5 für 4 h – als Alternative zum Deutschüben, wenn die Laune sinkt" und in der Notiz: „verdient man denn dann überhaupt etwas … verdiene ich mehr als ich ausgebe".
- **Wirkung**: Steht im Zieldorf ein Wahrzeichen, kommen die Bewohner froh zurück: Zufriedenheit **+5 % für 4 Stunden**.
  - Das hebt den Ertrag jeder Ernte (Faktor 0,5 + Zufriedenheit/100, also +0,05).
  - Ein neuer Ausflug verlängert die 4 Stunden, stapelt aber nicht.
  - Server: `spiel_ausflug_freude(volk)` neu; `spiel_dorf_abholen` zählt sie mit; `spiel_bahn_reise` setzt `volk.ausflug_bis` / `ausflug_ziel`; `spiel_oeffentlich` zeigt `wahrzeichen` (welche stehen).
- **Bahnhof**: Ziele mit Wahrzeichen stehen vorn und sind golden umrandet: „Beastadt · Bea · Berliner Fernsehturm · Laune +5 %“ (das größte Wahrzeichen wird genannt).
- **Die Rechnung steht offen da**: „3 Bewohner: −12 P Fahrkarten → +6 Forschung, bei einem Wahrzeichen +5 % Zufriedenheit (4 h). Geld bringt das nicht – 9 P Eintritt verdient das Zieldorf; dein Geld kommt von Touristen.“
- **Anzeige**: Die Volk-Zeile zeigt „Ausflug Berliner Fernsehturm: +5 % bis 5:39“. Nach der Fahrt kommt die Meldung „Sie haben Berliner Fernsehturm gesehen: Zufriedenheit +5 % bis …“.
- Die Meldung „Volk unzufrieden“ nennt jetzt als Tipp „Ausflug per Zug zu einem Wahrzeichen (+5 % für 4 h)“, solange kein Ausflug wirkt.

### Fassung 782 (Walkie 302: Flickstube mit Wanderstiefeln)
Sonden: neu 782 (12/12 grün); 704, 707, 716, 763, 765, 775, 779, 781 grün. Servertest: 7 alte Schuhe → 2 Paar Wanderstiefel (1 Schuh bleibt übrig); der nächste Trupp dauert 240 statt 300 s, Haltbarkeit danach 7; ohne Flickstube kommt „erst eine Flickstube bauen“.
XANDER (Walkie 302): „Ja, Flickstube mit Wanderstiefeln“. Seine zweite Wahl („lieber etwas anderes, bitte in der Notiz“) hat eine leere Notiz; die Frage steht jetzt als Walkie 303 mit Vorschlägen (Flohmarkt, Schrott zu Erz, Kuriositäten-Vitrine).
- **Alte Schuhe** (Vorrat `altschuh`):
  - Beim **Graben** wird aus „nur Erde“ jetzt 12-mal von 100 ein alter Schuh (nur Erde 30 statt 42 von 100).
  - Beim **Angeln** kommt der alte Stiefel ins Lager statt zurück in den See.
  - Die Meldung sagt, wie viele man hat und wie viele bis zum nächsten Paar fehlen.
- **Flickstube** (ab Level 6, 110 P je Stufe, am Weg zwischen Mühle und Gasthaus):
  - Stufe 1: 3 alte Schuhe → 1 Paar Wanderstiefel; ab Stufe 2: 2 → 1.
  - Knopf „Flicken“ in der Station, dazu das Lager (alte Schuhe, Wanderstiefel).
  - Im Bild: kleines Fachwerkhaus, links am Ausleger ein Stiefel als Zunftzeichen, vorn eine Schusterbank und ein Häufchen alter Schuhe.
- **Wanderstiefel**:
  - Ein Paar hält 8 Trupp-Fahrten (Fischer, Holzfäller, Jäger, Bergleute). Jede Fahrt dauert 4 statt 5 Minuten, also 20 % schneller.
  - Die Trupp-Zeile zeigt „4 Minuten mit Wanderstiefeln“ und unterwegs „fällen Bäume in Wanderstiefeln“.
  - Für den Ausflug per Zug gibt es keine Dauer, die schneller werden könnte; dort wirken die Stiefel nicht. Dafür ist Walkie 303 da.
- Server: `spiel_flicken()` neu (SECURITY DEFINER, nur angemeldete Spieler). Erweitert wurden `spiel_bauen` (Flickstube), `spiel_graben` (alter Schuh), `spiel_angeln` (Stiefel ins Lager) und `spiel_trupp_s` (Stiefel verbrauchen, 4 min).
- **Fehler nebenbei**: Nach einem Fehlversuch sperrte `bahnLaden` 4 s lang und versuchte es danach nicht selbst wieder. Der Bahnhof konnte dann auf „Der Fahrplan wird geholt …“ stehen bleiben (Sonde 716 war dadurch rot, auch ohne diese Fassung). Jetzt kommt nach der Sperre ein eigener zweiter Versuch.

### Fassung 783 (Funk 201: Aussprache geht wirklich immer weiter, nur Azure)
Sonden: neu 783 (10/10 grün; Gegenprobe mit der Sicherung: 5 rot, genau die Stillstände); 766 (Erwartung angepasst), 771, 772, 773 grün.
XANDER: „Die Aussprache Übung geht immer noch nicht automatisch weiter ich habe das jetzt schon dreimal gesagt … ich möchte nur die prozentuale Bewertung von Azure haben nicht diese strichellinienbewertung … es soll automatisch weitergehen … bis ich selber entscheide die Aufgabe zu beenden".
- **Ursache gefunden** (Serverprotokoll: um 01:42 und 01:43 je 19 von 20 Punkten, danach nichts mehr):
  - Ab 95 % stand das Angebot „In mein Aussprache-Wörterbuch übernehmen“ da, und die Karte **wartete auf eine Entscheidung**.
  - Wer gut spricht, blieb also fast bei jedem Wort stehen. Die Sonden hatten mit 88 % geprüft, darum fiel es nicht auf.
- **Jetzt**:
  - Das Angebot bleibt 6 s stehen („Übernehmen? Gleich geht es weiter“), dann kommt das nächste Wort. Übernehmen geht in dieser Zeit mit einem Tipp.
  - Nach einem Fehler (Aufnahme kaputt, keine Verbindung) steht „… – gleich das nächste Wort.“, und nach 3 s geht es weiter.
  - Nur „Auto: aus“ hält an.
- **Nur Azure**:
  - Der Klangvergleich (im Trainer die Strichreihe „Wo es abweicht“, in der Karte „… % ähnlich“) ist aus der Spiel-Karte entfernt.
  - Antwortet Azure nicht, steht „Azure hat diesmal nicht geantwortet – keine Note für dieses Wort.“ Der Server bekommt dann nichts gemeldet, also gibt es keine Punkte aus einem anderen Verfahren. Danach geht es weiter.

### Fassung 784 (Walkie 303: Flohmarkt und Schrott zu Erz)
Sonden: neu 784 (9/9 grün); 765, 779, 782 grün. Servertest: ohne Flickstube keine Wirkung; 10 alte Schuhe → Einschmelzen: +1 Erz, 7 übrig; Flohmarkt an, 2 Touristen: 1 Fundstück à 5 P (Stufe 2), Erlös 4 P Kurtaxe + 5 = 9 P, 6 Schuhe übrig.
XANDER (Walkie 303): „Flohmarkt-Stand: Fundsachen an Touristen verkaufen (mehr Geld pro Gast)“ und „Schrott zu Erz einschmelzen (3 alte Dinge = 1 Erz) für die Schmiede“.
- **Einschmelzen** (Flickstube): 3 alte Schuhe → 1 Erz. Server `spiel_einschmelzen()`.
- **Flohmarkt** (Flickstube, Schalter „Öffnen/Schließen“, Server `spiel_flohmarkt(p_an)`):
  - Ist er offen, kaufen die Touristen am Bahnhof bis 1 Fundstück je 3 Gäste, für 3 P + 1 P je Flickstuben-Stufe.
  - Ist er zu, bleiben die Schuhe fürs Flicken und Einschmelzen.
  - Der Touristen-Knopf rechnet es vorher mit („+ 3 × Flohmarkt à 4 P“), die Meldung danach auch.
  - Server: `spiel_bahn` zählt `floh` und `floh_preis` in den Erlös.
- Die Flickstuben-Zeile ist kürzer geworden.

### Fassung 785 (Funk 188/190: eigene Stimme als Vorsprecher, Wörterbuch im Profil)
Sonden: neu 785 (7/7 grün); 766, 771, 772, 773, 783 grün.
XANDER (Funk 190): „die Option haben den Aussprachetrainer an der Stelle mit ihrer eigenen Stimme … in Zukunft mit nutzen zu können … dass Sie sich entscheiden können ob diese Wörter … ersetzt werden sollen … platzhaltermäßig austauschen dass die Leute sich immer selbst hören können beim Lernen“. Funk 188: „einen privaten Bereich in ihrem Profil … wo sie ganz leicht auf dieses Wörterbuch zugreifen können“.
- **Je Wort „Spricht vor: Azure / ich“** im persönlichen Aussprache-Wörterbuch (Server: Spalte `vorbild`, `aussprache_eigen_vorbild(p_id, p_an)`, `aussprache_eigen_liste` liefert sie mit).
  - Steht es auf „ich“, spricht im Aussprachetrainer und im Spiel die eigene, geschnittene Aufnahme vor („Vorgesprochen wird mit deiner eigenen Stimme …“ bzw. „Vorbild: deine Stimme“ in der Spiel-Karte).
  - Alle anderen Wörter spricht weiter Azure. Nichts wird gelöscht, es ist nur ein Platzhalter-Tausch.
- **Profil**: Neue Karte „🎙️ Mein Aussprache-Wörterbuch · privat“ auf der eigenen Profilseite mit Anhören, „Spricht vor“ und Löschen. Sie lädt beim Öffnen frisch.
  - Ehrlich: Die ganze Profilseite ist in der Sonde nicht gezeichnet, geprüft ist die Liste selbst (gleiches HTML).
- Offen aus Funk 188/190: die **Lehrer-Freigabe über Sprachnachrichten im Livestream** (Xander gibt ein Wort vor, die Leute schicken Sprachnachrichten, Xander gibt die gute frei, die Leute übernehmen sie geschnitten ins Wörterbuch) und die Meldung unbekannter Wörter an Claude.

### Fassung 786 (Funk 188/190: Nachsprechen im Livestream, der Lehrer gibt frei)
Sonden: neu 786 (14/14 grün); „jeder Befehl“, 772, 785 grün.
XANDER (Funk 188): „dass ich z.B ein Wort vorgebe … und dann sollen die Leute versuchen das auszusprechen und dann kontrolliere ich die Aussprache anhand der Sprachnachrichten … und das freigebe … haben Sie die Möglichkeit dass in ihr persönliches Aussprache Wörterbuch zu übernehmen … und dann müssen wir diese Wörter die ich da im Chat vorgebe auch wenn die noch nicht im Wörterbuch sind … an Dich geschickt … zu überprüfen und zu updaten“. Funk 190: „falls Sie dann bisschen rumgeeiert haben und eine lange Atempause davor … das System automatisch diesen Teil sauber kroppen“.
- **/sprich Wort** (nur Lehrer, auch /nachsprechen; /sprich allein beendet):
  - Alle bekommen im Chat „🎤 Nachsprechen: „Wort“ — halte das Mikrofon und sprich es nach …“. Das Wort wird einmal mit der sauberen Stimme vorgesprochen.
  - Steht das Wort nicht im Wörterbuch, geht automatisch eine Funk-Meldung an Claude („[automatisch] Wort fürs Wörterbuch prüfen … mit Artikel, Plural, Erklärung und Betonungsregel“), einmal je Wort und Sitzung.
- **✓ zum Freigeben**: Beim Lehrer steht an jeder fremden Sprachnachricht, die nach /sprich kommt, ein ✓ neben dem Herunterladen. Ein Tipp schickt die Freigabe an genau diese Person, der Knopf wird „✓ frei“.
- **Beim Lernenden**:
  - Unten erscheint „XanderFox hat deine Aussprache von „Wort“ freigegeben“ mit „In mein Wörterbuch“ und „Nein danke“.
  - Die eigene Aufnahme wird wie gewohnt sauber geschnitten (Atempause und Stille weg) und mit Quelle „lehrer“ gespeichert. In der Sonde wurden aus 1,5 s Aufnahme 0,83 s.
  - Ist die Aufnahme auf dem Gerät nicht mehr da, steht das ehrlich dabei statt eines Knopfes.
- Die Freigabe ist nur an die eigene Wörterbuch-Liste gebunden; ein nachgemachtes „frei“ könnte höchstens das eigene private Wörterbuch füllen, darum ohne Serverprüfung.
- Nicht geprüft: echte zwei Geräte im Livestream (hier nur mit eingespielten Nachrichten).
- Noch offen aus Funk 188: Spiele mit der eigenen Stimme (Wort hören → Artikel / Bedeutung) und die Wortauswahl aus dem Wörterbuch per Tipp statt Tippen.

## Fassung 787 — /sprich aus dem Wörterbuch, Hörspiel mit der eigenen Stimme (Funk 188)

XANDER: „dass ich z.B ein Wort vorgebe oder mir das aussuchen kann aus dem Wörterbuch" und „Spiele damit machen mit ihrer eigenen Stimme … wo sie das Wort einfach nur hören und sagen müssen welchen Artikel das hat … oder welche Bedeutung dieses Wort hat".

- **/sprich mit Auswahl (nur Lehrer):** Beim Tippen von `/sprich Ti…` stehen passende Wörterbuch-Wörter unter dem Feld (Artikel, Niveau, Bedeutung als Hinweis). Ohne Anfang: zufällige Auswahl A1–B1. Ein Tipp schickt sofort ab. Das selbst getippte Wort steht immer mit dabei („nicht im Wörterbuch – Claude bekommt Bescheid").
- **Wortschatz wird nachgeladen:** vokabeln/*.js kommen erst auf Anfrage. Ohne sie fehlten die Artikel, und ein Wort galt fälschlich als unbekannt – das betraf auch die Wörterbuch-Meldung aus 786. `DMA_AUSSPR_BRUECKE.laden()/geladen()` lädt zuerst.
- **Hörspiel mit meiner Stimme** (Profil und Aussprachetrainer, im privaten Wörterbuch): bis zu 5 Fragen; man hört nur die eigene Aufnahme, das Wort steht nicht da; der/die/das oder eine von drei Bedeutungen; Auflösung mit Artikel und Wort, dann geht es von selbst weiter; Endstand und „Nochmal". Wörter ohne Artikel/Erklärung im Wörterbuch bleiben draußen, sonst ein ehrlicher Hinweis. Keine Punkte (sonst ließe es sich mit wenigen Wörtern endlos abholen).
- **Erzeugte Erklärungen zählen nicht als Bedeutung** („von „X" abgeleitet, mit der Nachsilbe …", „eine Form von …"). Gefunden an „Dringlichkeit – von „drin" abgeleitet" – falsch; nach Duden korrigiert. 1.047 solcher „abgeleitet, mit der Nachsilbe"-Einträge stehen noch im Wortschatz und gehören geprüft.
- **Vorschlagsliste lesbar:** Die Chips der Befehlsvorschläge erbten die dunkle Seitenschrift auf dunklem Kasten (gemessen rgb(46,42,37) auf rgb(34,28,26)). Jetzt helle Schrift.
- Ein Abspieler für die eigene Stimme (iPhone/Android spielen nach dem ersten Tipp weiter).
- Sonde `werkzeug/pruefe-787-sprich-auswahl-hoerspiel.js`: 19/19. `pruefe-namensvorschlaege.js`: veraltete Erwartung (regenbogen2 seit Funk 75, auch vor 787 rot) angepasst.

## Fassung 788 — Festschmuck, den man sieht (Funk 202)

XANDER (Funk 202): „warum sehe ich immer noch nicht die Halloween an sich die weihnachtsansicht und für den einzelnen Jahreszeiten keine Dekoration du hast mal mit Schnee angefangen und getestet aber ich sehe nichts davon".

Gemessen: Fassung 733 malte die Deko, aber winzig – Kürbisse mit 1,8 Einheiten Radius sind auf dem Handy rund 3 Pixel. Die Sonde 733 prüfte nur „wird gemalt", nicht „sieht man es". Schnee lag nur bei echtem Schneewetter.

- **Winter und Advent:** Schnee auf Dächern, Wiese und Wegen, auch ohne Schneewetter.
- **Advent/Weihnachten:** Christbaum fast doppelt so groß, zwei Weihnachtsmarktbuden (rot-weiße Dächer, Lichterketten), warme Lichterketten an jedem Haus – nachts leuchten sie.
- **Winter ohne Advent:** Schneemann am Platz.
- **Halloween:** violett-oranger Himmel, Vollmond, Fledermäuse, zwei Geister, Kürbisberg am Platz, Kürbisse mit Gesicht an jedem Haus, orange/violette Lichterketten; nachts leuchten Gesichter und Ketten (Schein begrenzt, damit kein greller Fleck entsteht).
- **Herbst/Erntedank:** größere Kürbisse vor jedem Haus, doppelt so große Garben.
- **Ostern:** Osterstrauch, Osterhase, Wimpelkette, 14 große Eier im Gras.
- **Frühling:** Maibaum (blau-weiß, Kranz, Bänder) mit Wimpelkette, Blumenbeete vor den Häusern. **Sommer:** Biergarten mit zwei Sonnenschirmen am Gasthaus.
- **Vorschau:** „Saison: …" unter dem Dorfbild (nur Betreiber) bleibt nach dem Neuladen stehen, bis wieder „echt" gewählt wird. „Advent" heißt jetzt „Advent/Weihnachten".
- Sonde `werkzeug/pruefe-788-festschmuck-sichtbar.js`: misst per Bildpunkten, dass jede Stufe sichtbar anders ist (Halloween 17 %, Winter/Advent 54 % anders als Herbst), dass Christbaum und Buden unter keinem Schild liegen und die Vorschau gemerkt bleibt.

Prüfung Funk 202 (Plan aus dem Dorf-Gesamtkonzept, Stand 731): Paket D1 „Das modulare Dorf" (Raster, Häuser ziehen/drehen, Wege, Gärten, Wohnhäuser, Bauphasen mit Bagger und Kran) ist **nicht gebaut** – es hätte laut Plan als Erstes kommen sollen. Es folgt ab Fassung 789.

## Fassung 789 — Paket D1 „Das modulare Dorf", Schritt 1: Häuser versetzen (Funk 202)

XANDER (Funk 202): „vor ein paar Iterationen hast du mir im Walkie-Talkie noch gesagt dass wir den modularen Aufbau als nächstes machen und viele andere Dinge die hast du alle verschluckt … was ist mit dem modularen System".

Nach meinem Rat im Dorf-Gesamtkonzept (Teil C, Frage 1 „feste Kacheln", Frage 3 „zwei Ansichten"):

- **Umbauen** (Schalter unter dem Dorfbild): Gebäude antippen, dann den neuen Platz – oder mit dem Finger dorthin ziehen (es hängt am Finger, losgelassen wird gesetzt). Steht dort schon ein Gebäude oder ein Bauplatz, **tauschen** die beiden. So führen Wege und Laternen weiter zu jedem Haus.
- **Grün** = passt, **rot** = der Platz ist zu klein (große Häuser wie Schule oder Krankenhaus nicht auf den Platz des Hühnerstalls). **Rathaus und Bergwerk bleiben** (Mitte, Berg).
- **Spiegeln**: das gewählte Gebäude steht seitenverkehrt (zweite Ansicht). Fensterlichter, Rauch und Mühlenflügel gehen mit.
- Die Leute (Müller, Bäcker, Schmied, Wissenschaftler) gehen mit ihrem Haus mit. Das Fuhrwerk fährt nur, wenn Mühle und Bäckerei an ihrem gemalten Weg stehen.
- **Server**: `spiel_spieler.dorf_plan` (platz, spiegel), `spiel_dorf_umsetzen(p_was, p_ziel)` prüft Platzgröße und tauscht, `spiel_dorf_spiegeln(p_was)`. `spiel_oeffentlich` gibt den Plan mit – Nachbarn und Besucher sehen das Dorf so, wie man es gestellt hat.
- Die Schalter unter dem Dorfbild (Symbole, Namen, Umbauen, Saison) sind jetzt mindestens 30 px hoch.
- Sonde `werkzeug/pruefe-789-haeuser-versetzen.js`: 13/13 (Tippen, Ziehen, Tauschen, Spiegeln, Rathaus fest, neu gemalt, 360 px). Sonden 709/711: veraltete Erwartungen angepasst (16 Gebäude auf der Karte, Kompass seit Funk 191 kleiner, dritter Schalter „Umbauen").

Noch offen aus D1: Bauzeit mit Bauphasen (Bagger, Kran) – Fassung 790; Wege/Gärten/Zäune/Wohnhaus als eigene Module; Landschaftswahl.
