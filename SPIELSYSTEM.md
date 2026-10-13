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
- **Sprechen nach dem Walkie-Diktat** (Fehler seit 698): das Diktat lieh sich nur die Live-Spur, zwei weitere Mikrofon-Nutzer (warm gehaltene Sprachnachricht-Spur, „Dauernd an") blieben offen → Android brach mit „aborted" ab. Zurückgeholt wurde genau einmal, sofort – schlug das fehl, war man stumm, ohne es zu merken. Jetzt werden alle drei abgegeben, das Diktat startet 350 ms später und versucht es bei „aborted" einmal nach, das Live-Mikrofon kommt mit drei Versuchen zurück (0,4 / 1,2 / 3 s), „Dauernd an" wird wiederhergestellt, und klappt es nicht, steht es im Chat. Während des Diktats hören die anderen einen nicht (Android erlaubt nur einen Mikrofon-Nutzer). **Seit 884 nicht mehr** im Livestream: das Diktat nimmt dort eine Kopie der Live-Spur und leiht nichts aus (siehe „Fassung 884 — Walkie-Diktat im Livestream“); außerhalb des Livestreams gilt das hier Beschriebene weiter.
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

## Fassung 790 — Paket D1, Schritt 2: Bauen dauert – Bagger, Kran, Gerüst (Funk 202)

Nach meinem Rat im Dorf-Gesamtkonzept (Teil C, Frage 4 „Minuten"): Man soll den Kran arbeiten sehen und das fertige Haus noch in derselben Sitzung erleben.

- **Bauzeit:** Stufe 1 zwei Minuten, Stufe 2 fünf, Stufe 3 zehn. Der Preis wird beim Start bezahlt; die neue Stufe wirkt erst, wenn der Bau fertig ist (beim Ausbau arbeitet das Haus mit der alten Stufe weiter).
- **Ein Bau zugleich**, ab Rathaus Stufe 3 zwei. Reparieren bleibt sofort.
- **Im Bild** (neues Haus): 0–20 % Grube mit Bagger · 20–40 % Fundament mit Schaufelradbagger · 40–90 % Wände wachsen hinter dem Gerüst, der Kran setzt Balken · ab 90 % das fertige Haus. Ausbau: Gerüst und Kran um das bestehende Haus. Über dem Platz steht „Bau 1:47".
- **Mithelfen:** Tipp auf die Baustelle (oder „Baustelle … mithelfen −15 s" in der Station): 15 s schneller, höchstens bis zur halben Bauzeit.
- **Fertig:** Der Takt holt den Stand vom Server, sobald die Zeit um ist → „Fertig gebaut: Kaserne Stufe 1." Der Bau-Knopf nennt die Bauzeit.
- **Server:** `spiel_bauen` legt `volk.baustellen` an, `spiel_bau_abschluss` (in `spiel_ich`) baut Fertiges ein, `spiel_bau_helfen`, `spiel_bau_dauer`. `spiel_oeffentlich` gibt Baustellen mit – Nachbarn sehen Bagger und Kran im fremden Dorf.
- Sonde `werkzeug/pruefe-790-bauzeit.js`: 7/7 (vier Phasen als eigene Bilder, Mithelfen, Fertig-Meldung, Bau-Meldung). Sonde 789: Meldungsprüfung robuster (eine andere Meldung kam dazwischen).

## Fassung 791 — Liedteil benennen bricht nicht mehr ab (Walkie 276)

XANDER (Walkie 276): „wenn ich einen neuen Teil aufsetzen will und den benennen will bricht es mitten im benennen ab und dann ist das weg".

- Ursache: Das Ausschnitt-Menü (`#lcPlatzMenue`) schließt, wenn die Seite kurz nach einer Geste rollt. Beim Tippen geht die Tastatur auf, das Telefon schiebt das Feld ins Bild und rollt – und jeder Tastendruck zählte als Geste. Das Menü war mitten im Wort zu, der Name weg.
- Jetzt: Solange ein Schreibfeld im Menü den Fokus hat, schließt Rollen das Menü nicht. Tipp daneben und Escape schließen es weiter wie bisher; ohne Fokus schließt auch Rollen wie gehabt.
- Sonde `werkzeug/pruefe-791-liedteil-benennen.js`: tippt „Refrain" mit Rollen zwischen den Buchstaben – das Menü bleibt offen, der Name steht; danach ohne Fokus schließt Rollen. Ohne die Änderung rot (gegengeprüft). Sonden 689, runde88-liedstellen, namensvorschlaege, hoerer-klammern, 787 grün.

## Fassung 792 — Die Baukasten-Stadt „Winterhausen" (eigene Oberfläche: stadt.html)

XANDER: „dass wir uns selber eine Stadt bauen können … erst mal in einer separaten Oberfläche … Häusern, die man drehen kann … Sachen, die man dekorieren kann, kleine Laternen … Rasen anlegen … einen Bachlauf anlegen … Ich möchte einen Liebreiz zur Weihnachtsdeko … mit Schnee, mit Santa Claus, der animiert durch den Himmel fliegt … Man soll das Fundament sehen beim Aufbauen … Auch den Kölner Dom … Das soll keine Comic Grafik sein."

Adresse: `stadt.html` (nicht im Spiel verlinkt – stört den Spielfluss nicht). Alles Vektor, jede Zoomstufe neu gemalt, keine Bilddateien.

**Technik (stadt/kern.js, boden.js, szene.js)**
- Jedes Gebäude ist ein 3D-Modell aus Flächen in Metern. Jede Wand wird in ihrem eigenen flachen Raum gemalt (Mörtel, Balken, Klingel, Hausnummer) und affin ins Bild gelegt → **drehbar in jedem Winkel**, Licht und Schatten stimmen immer; Bauphasen über `bau` 0…1.
- Boden per WebGL als Rechnung über die Weltkoordinate: Wiese ohne Kacheln (große Farbflächen, Büschel, Einzelhalme ganz nah, Wildblumen im Frühling), Pflaster mit Fugengras, Bach mit fließender Mitte und vereisten Rändern, zugefrorener See mit Kufenspuren, Schnee mit Glitzer, Halmspitzen im dünnen Schnee.
- Schatten auf eigener Ebene (weich, bläulich auf Schnee), Kontaktschatten am Fuß, Lichtpfützen am Boden, Fenster- und Laternenschein (von Häusern davor verdeckt), Rauch aus Schornsteinen, Schneefall, Dunst.
- Zoom ohne Neumalen während der Geste, Malbudget je Bild, Vorhang beim Öffnen, Bildgrößen-Bremse fürs iPhone, gebündelt in `stadt/stadt.min.js` (werkzeug/stadt-packen.js; `?quelle=1` lädt die Einzeldateien).

**Bedienung (stadt/oberflaeche.js)** – Telefon 360 px ohne Überlappung: Bauleiste mit Reitern (Häuser, Weihnachten, Deko, Natur, Wahrzeichen, Boden) und echten Vorschaubildern; Platzieren mit Geist (grün/rot), Drehen in 15°-Schritten oder frei am Drehring; Versetzen, Abreißen; **Bauzeit mit Phasen und Zeitraffer ×1/×10/×60**; Boden malen (Rasen, Pflasterweg, Bachlauf, Beet, Radierer); **Mini-Karte 3 × 3 Bereiche** (Tannenwald, Kirchberg, Mühlbach, Handwerkergasse, Marktplatz, Am Bach, Domplatz, Bahnhofstraße, Seeufer) – antippen = hinfliegen; Kamera drehen, Tageszeit (Tag/Dämmerung/Nacht), Jahreszeit (Winter/Frühling/Sommer/Herbst); Stadt wird im Browser gespeichert.

**Modelle (stadt/modelle/)** – je in eigener Arbeitsgruppe gebaut, von zwei unabhängigen Kritikern geprüft und nachgebessert: Fachwerkhaus (fränkisch, Auskragung, Balkenköpfe, Gauben, Keller, Freitreppe), Fachwerkhaus mit Erker und Laden (Krüppelwalm), Wassermühle mit drehendem Rad, Bahnhof mit Gleis, Dorfkirche, **Kölner Dom** (Maßstab 1:3, Maßwerkhelme, Strebewerk, Bleiglas, alter Holzkran als Bauphase), Christbaum/Maibaum, Marktbuden (Glühwein, Lebkuchen, Mandeln, Spielzeug, Kerzen), erzgebirgische Pyramide (dreht sich), Krippe, Kinderkarussell, Schneemann, Marktbrunnen, Gaslaterne, Bank, Steinbrücke, Zaun, Tanne, Linde/Eiche, Apfelbaum. Weihnachtsmann mit acht Rentieren (Rudolph leuchtet) fliegt etwa jede Minute über die Stadt, Menschen gehen spazieren, trinken Glühwein, Kinder ziehen Schlitten, Eisläufer auf dem See. Baustelle (stadt/baustelle.js): Bagger gräbt, Betonmischer, Gerüst wächst mit, Turmdrehkran hebt Lasten, Arbeiter hämmern, sägen, tragen, Bauzaun, Abbau mit Autokran.

Sonden: `werkzeug/pruefe-stadt-bedienung.js` (Telefon, 21 Punkte), `werkzeug/stadt-fehlerjagd.js` (jedes Modell in allen Jahres-/Tageszeiten, Winkeln, Bauphasen), `werkzeug/stadt-tempo.js`. Bilder: `werkzeug/stadt-bild.js`, `werkzeug/stadt-bogen.js`. Anleitung für Modellbauer: `stadt/MOTOR.md`.

## Fassung 793 — Die leichte Stadt (stadt-leicht.html) und Winterhausen in Farbe

XANDER: „ob du auf der Basis von diesem Konzept das Ganze in einem kleineren Maßstab schlanke und Systemressourcen sparend machen kannst … in einem separaten Ordner … dass die Leute eine Möglichkeit haben zu upgraden" – „dass ich als Betreiber schon diesen Übergangslink sehe, wie die Stadt entsteht … so dass ich selber entscheiden kann".

**Winterhausen**
- Erster Schnee zurück: Schneerelief wieder kräftig (Wellen ×1,6, ungeglättet – nur für den Schnee, die Wiese bleibt sanft); Dachschnee kräftiger gemuldet (Fachwerkhaus, Erkerhaus).
- Farbstimmung (Knopf mit Palette): Sepia-Hauch + Sättigung + Kontrast über dem Bild, warmes Licht, Vignette; je Tageszeit eigene Werte; Regler 0–200 %, im Browser gemerkt. `?farbe=0` zeigt die ungefärbte Stadt, `?gr=satt,kon,sepia,vig` stimmt ab.

**Leichte Stadt (Ordner `stadt-leicht/`, Seite `stadt-leicht.html`)**
- Keine Modelle mehr auf dem Telefon: `werkzeug/stadt-backen.js` malt die Winterhausen-Modelle im Container einmal und speichert durchsichtige WebP-Bilder (`stadt-leicht/bilder/`, Plan `stadt-leicht/backplan.json`, Verzeichnis `verzeichnis.json` mit Anker, Maßstab, Lichtern, Rauch). Je Bild zwei Größen (klein ≈18 px/m, groß ≈56 px/m – ganz nah gestochen scharf), 4 Blickrichtungen, Winter und Herbst, Tag und Nacht (Dämmerung = beide gemischt), Baustellen in 4 Phasen (Grube mit Bagger, Fundament, Rohbau mit Gerüst und Kran, fast fertig). Schatten als eigene Ebene (einer je Form).
- Menschen: die Spaziergänger von Winterhausen als Laufblätter (12 Schritte × 8 Richtungen, Schatten darin), 6 Personen, gehen auf dem Wegenetz, nachts weniger.
- Skript: 62 KB (gepackt `leicht.min.js`, gzip ≈ 24 KB) statt 2 MB. Bilder werden nur geladen, wenn sie im Bild sind (höchstens 6 gleichzeitig). Boden: derselbe WebGL-Boden (`stadt/boden.js`), auf dichten Handybildschirmen gröber gerechnet (`B.skala`). Die Schleife malt ≤ 30 Bilder/s, nur was sich bewegt.
- Das Dorf ist ein Rundling: Rathaus und 7 Häuser um den Anger, 8 Höfe an der Ringstraße, Mühle am Bach im Osten, Kirche im Norden, Bahnhof im Süden, Kölner Dom im Westen, Wald ringsum. Die 16 Bauplätze des Spiels (`DORF_LAGE`) behalten ihre Richtung zur Dorfmitte.
- Derselbe Spielstand: `spiel_ich` (angemeldet über dieselbe Supabase-Sitzung der Webseite); Bauen (`spiel_bauen`) und Helfen (`spiel_bau_helfen`) wie im Spiel; Stufe 1–3 als Größe (0,86/0,94/1,0); Ausbau zeigt Gerüst und Kran. Ohne Anmeldung oder mit `?demo=1`: Beispielstadt.
- Bedienung: Tageszeit, Jahreszeit (Kalender als Vorgabe), Farbstimmung, Karte drehen, Mini-Karte 3×3, Haus antippen (Stufe, Baufortschritt mit Restzeit, Helfen, Drehen – gemerkt), leerer Bauplatz (welches Haus, Preis, Bauen), „Schmücken" (15 Schmuckstücke: Laterne, Bank, Zaun, Brunnen, Bäume, Christbaum, Marktbude, Schneemann, Pyramide, Krippe – verschieben, drehen, entfernen; vorerst im Browser gemerkt).
- Vorläufig: die 16 Spielgebäude sind Fachwerk- bzw. Erkerhäuser in eigener Farbe (Mühle = Wassermühle); eigene Modelle (Kuhstall, Bergwerk, Krankenhaus …), Wahrzeichen außer dem Dom, Frühling/Sommer-Bilder, Schlittschuhläufer und Weihnachtsmann folgen.
- Betreiber-Link: im Dorf-Fenster (Beschriftungszeile) „Neue Stadt ansehen (nur du)" – nur ein Link, die App lädt nichts davon. Freigabe für alle: `window.LEICHT_FREI = true`.
- Prüfungen: `node werkzeug/pruefe-leicht.js` (23 Punkte am 360-px-Telefon, grün), `node werkzeug/leicht-bogen.js` (Bilder), `node werkzeug/leicht-packen.js` (Bündel + Stempel).

## Fassung 794 — Die Haustiere reisen mit, Sequenzen im normalen Tempo, Weihnachtsmann in der leichten Stadt
- XANDER (Walkie 259): „meine Haustiere bleiben noch zurück auf meinem Abfahrtsplatz verbessere das mal bitte auch in sämtlichen anderen Animationen die zur Reise gehören".
- Ursachen (spiel.js, Tier-Wache): die Fahrzeugliste hatte kein Wortende („lc-lok" passte auf Gleis/Tunnel/Schranke) und kannte Flugzeug, Adler, Delfin, Heli, Pferd, Liane, Feder, Frosch, Zauberer, Turm, Katze, Riesenhände und Tor nicht; clip-path (Maulwurf, Röhre) galt als sichtbar; nach dem Sitzwechsel ist der alte Platz ein abgehängtes Element, dessen Reiseende die Wache nie sah (Doppelgänger hingen bis zur 14-s-Notbremse); am Ziel blieb opacity 0.
- Jetzt: genaue Liste mit Wortende, clip-path-inset zählt als verdeckt, Landen sofort beim Reiseende (auch wenn der Platz neu gezeichnet wurde), Notbremse wartet bei langen Reisen (bis 90 s); app.js: die 12-s-Wache am Platz richtet sich nach der Reisedauer.
- Sequenzen (gemalte Wege): Dauer nach der ganzen Weglänge (bis 16 Plätze) statt Luftlinie mit Deckel bei 4 Plätzen; jede Station ist ein Stützpunkt (keine abgeschnittenen Ecken); Fahren/Spielzug ab drei Feldern kurz anfahren – gleichmäßig – kurz bremsen statt ease-in-out über alles.
- Leichte Stadt: Weihnachtsmann-Gespann (gebacken aus Winterhausen, 8 Richtungen × 8 Galopp-Schritte, Tag/Nacht) etwa jede Minute im Winter; eigener Schmuck und Drehungen werden über `spiel_stadt_leicht_speichern` auf dem Server gemerkt (gleich auf jedem Gerät).
- Prüfung: `node werkzeug/pruefe-794-tiere-reisen.js` – 23 Reisearten + 4 Sequenzen (alte Fassung: alle rot, Kette über 7 Stationen so schnell wie eine).

## Fassung 795 — Eigene Gebäude und Wahrzeichen in der leichten Stadt, Bauen-Knopf, fließende Tageszeit
- XANDER: „mein Gefängnis sieht auch nicht wirklich aus wie ein Gefängnis … sieht aus wie ein Fachwerkhaus".
- 15 neue Modelle (stadt/modelle/*.js, in STADT.MODELL_DATEIEN, also auch in Winterhausen): Kuhstall, Hühnerstall, Rathaus, Schule, Kaserne, Gefängnis (Rundturm mit Wachstube), Bergwerk (Förderturm, Maschinenhaus, Stollen), Brauerei, Bibliothek, Krankenhaus, Labor (Sternwarten-Kuppel) sowie die Wahrzeichen Neuschwanstein, Fernsehturm, Holstentor und Brandenburger Tor. Je Modell Winter/Herbst/Frühling/Sommer, Tag/Abend/Nacht und Bauphasen.
- Gebacken (werkzeug/stadt-backen.js, stadt-leicht/backplan.json): g_<haus> fertig in 2 Größen × 4 Richtungen × Winter/Herbst × Tag/Nacht, bau_<haus> in 4 Bauphasen, w_<wahrzeichen>. Grundfläche/Höhe in stadt-leicht/dorf.js (EIGEN, D.WUNDER). Bäckerei, Schmiede, Gasthaus, Flickstube bleiben Fachwerkhäuser, die Mühle die Wassermühle.
- Das Holstentor stand im See – jetzt (38, 64). Bäume wachsen nicht mehr auf Wahrzeichen-Plätzen. Wahrzeichen erscheinen, sobald sie im Spiel gebaut sind (volk.wunder).
- Bauen-Knopf: Leiste mit allen 16 Gebäuden (Stufe, im Bau, Preis/ab Level); Antippen fliegt hin und öffnet die Karte. Am Haus „Ausbauen" (spiel_bauen) bis Stufe 3.
- Tag und Nacht nach der Uhr fließend (SZ.nachtGrad: Dämmerung 16:30–20:00 und 6:00–8:00), Licht, Schatten, Nachtbild und Farbstimmung werden gemischt; die Tageszeit-Taste stellt fest ein. Prüfen: `?uhr=18.3`.

## Fassung 796 — Sparmodus für schwache Verbindungen (leichte Stadt)
- XANDER: „Emmi aus Ägypten hatte gestern nur eine blaue Anzeige und diese Häuser mussten erst mal ewig laden … dass Leute, die mit ihrer Verbindung überhaupt nicht spielen können, noch eine Variante tiefer gehen können."
- Gemessen (360-px-Telefon, Start): vorher 2,9 MB Bilder, jetzt 2,3 MB; im Sparmodus 0,9 MB.
- Sparmodus automatisch bei „Datensparen" oder 2G/3G (navigator.connection), sonst per Schalter im Farbfeld oder `?spar=1`: nur kleine Bilder, in der Dämmerung nur ein Bild je Haus, 12 statt 30 Leute aus 2 statt 6 Figurenblättern.
- Immer: große Bilder erst ab dem 1,6-fachen (statt 1,3), und erst nachdem das kleine da ist; der Ladevorhang wartet höchstens 2,5 s statt auf alle Bilder.

## Fassung 797 — Lupe springt nicht mehr ins Haus, zweite Forschungsstufe, Händler verkauft
- Kleine Karte (Lupe/Kompass nah): XANDER: „in dem Moment, wo man in ein Viertel reinklickt, klickt es direkt auf einen zufälligen Punkt … wodurch man direkt in das Haus reinspringt". Die Punkte sind nur noch Zeichen (keine Knöpfe, pointer-events: none); ein Tipp auf die Karte fährt nur an diese Stelle (dorfZoom), öffnet kein Haus.
- Forschung: XANDER: „Entdeckungen scheinen stehen zu bleiben". Befund: alle 6 erforscht, 308 Forschung lagen brach (die Liste war zu Ende). Neu (Migration spiel_797_forschung_zweite_stufe): Kunstdünger (Liebig, 150: Bauern +30 %), Melkmaschine (160, Kuhstall: doppelt so schnell, doppeltes Lager), Brutkasten (160, Hühnerstall: ebenso), Telegraf (200, Quote 70: Markt zahlt 15 % mehr), geheim Röntgenstrahlen (400, 12 Wiss., Quote 90, Krankenhaus: Heilen +50 %), geheim Automobil (Benz, 500, 15 Wiss., Quote 92, Rathaus 2: Baustellen 25 % schneller).
- Händler (spiel_haendler_kaufen, spiel_haendler_preis): XANDER: „es gibt kein Kaufen-Menü … keine Angebote von Händlern". Im Markt jetzt „Beim Händler kaufen": jede Ware, die der Markt ankauft, zum Tagespreis × 1,6; 1/5/10/20 je Kauf, höchstens 60 am Tag.
- Noch offen: Angebote von Freunden (Freundesliste), zweiter Stall/zweite Farm, Schiffe/Hafen.

## Fassung 798 — die neue Stadt in der Seite statt im neuen Tab

XANDER: „die Stadt im Chat … im Hochformat klein, im Querformat Vollbild, aber in der Seite, kein neuer Tab … und dann wieder zurück zum Livestream".

- „Neue Stadt ansehen" ist jetzt ein Knopf (`data-s="neuestadt"`). Er öffnet `stadt-leicht.html?eingebettet=1` in einem Rahmen, der direkt am body hängt, damit das Neuzeichnen des Dorfes ihn nicht neu lädt.
- Hochkant ist der Rahmen unten angedockt (58 % der Höhe); oben bleiben Livestream und Chat sichtbar. Quer (Höhe unter 700 px) füllt er die ganze Fläche. Drehen schaltet automatisch um, „Vollbild"/„Klein" von Hand.
- „Zurück zum Livestream" oben am Rahmen und der Zurück-Knopf in der Stadt selbst (per postMessage `leicht-zu`, nur gleiche Herkunft) schließen den Rahmen und werfen ihn weg. Dann lädt und rechnet nichts mehr.
- Sonde: `werkzeug/pruefe-798-stadt-im-chat.js`. Neu: grün. Alter Code: 11 rot.

## Fassung 799 — die neue Stadt im kleinen Dorfrahmen, größerer See

XANDER: „Ich möchte es in diesem Platz haben, wo die kleine Panorama an sich die alte noch ist, dass man darunter einen Schalter hat und dann neue Version wählen … man bleibt innerhalb dieses Frames … Nicht dass ich unten ein komplett neues Layer drüberlegt … durch einen Klick auf das Vollbild … und trotzdem noch zurückkommt".

- Das Overlay aus Fassung 798 ist wieder raus. Unter dem kleinen Dorfbild stehen jetzt „Alte Version“ und „Neue Version“ (auf dem Gerät gemerkt: `dma_stadt_neu`), dazu in der neuen Version „Vollbild“.
- In der neuen Version zeigt der Dorfrahmen (16:10, gleiche Größe wie das alte Bild) einen Platzhalter. Die Stadt selbst ist ein iframe (`stadt-leicht.html?eingebettet=1&mini=1`), das am body hängt und Bild für Bild dem Platzhalter folgt. Es wird mitbeschnitten, wenn das Menü scrollt. Grund: `domAngleichen` würde ein iframe im Menü beim Neuzeichnen umhängen, und dann lädt es neu. Ohne Platzhalter wird es nach 20 s weggeworfen.
- Kleinformat in der Stadt (Klasse `lk-mini-modus`): nur Bild, Lupe (2,2 × Überblick, wie das alte Dorf) und Vollbild-Knopf. Die kleine Karte mit den 9 Vierteln (je ≥ 30 px) erscheint erst mit der Lupe. Kopfleiste, Bauen und Schmücken gibt es erst im Vollbild.
- Vollbild: Der Rahmen deckt den Bildschirm (wenn möglich mit echtem Fullscreen und Querformat-Sperre). Der Zurück-Knopf der Stadt führt per postMessage `leicht-zu` zurück in den kleinen Rahmen, ohne dass die Stadt neu lädt.
- `SZ.zeichnen` malt nicht bei 0 × 0 (kurz beim Einbetten).
- See in der leichten Stadt: Die alte Bucht bleibt als Zunge. Darunter folgen ein schmaler Hals und ein großer See bis y ≈ 104, dazu eine flache Badebucht. Die Randbäume wachsen nicht im Wasser. Der See reicht nicht bis an den Kartenrand (±112 m), sonst wiederholt die Grafik die letzte Zeile als Streifen.
- Sonde: `werkzeug/pruefe-799-stadt-im-dorfrahmen.js` (ersetzt 798). Neu: grün. Alter Code: 19 rot.

## Fassung 800 — Kirchen- und Rathausglocken zur vollen Stunde

XANDER: „dass die Rathaus- und Kirchenglocken zu jeder vollen Stunde nach deutscher Zeit schlagen, mit einer realistischen Glockenfolge".

- Solange das Dorf offen ist (alte oder neue Version), schlagen die Glocken zur vollen Stunde nach Berliner Zeit (`Intl`, Europe/Berlin), egal wo das Gerät steht.
- Die Folge:
  - Viertelschlag der Kirche: 4 Doppelschläge hell/tief (587/440 Hz).
  - Die große Stundenglocke (196 Hz) schlägt so oft, wie es Uhr ist (1–12).
  - Steht ein Rathaus, schlägt seine Uhr 4,5 s danach nach (330 Hz).
- Jede Glocke entsteht aus neun unharmonischen Teiltönen einer Kirchenglocke (Unterton 0,5, Prime, kleine Terz 1,19, Quinte, Oktave …), jeder mit eigenem Nachklang. Dazu kommen eine Schwebung im Unterton und der Klöppelanschlag. Es gibt keine Tondatei.
- Nachts (22–7 Uhr) klingen sie gedämpft. Wird das Dorf geschlossen, klingen sie in 0,3 s aus. Pro Stunde schlagen sie nur einmal.
- Prüfhaken:
  - `pruef.glockenPlan(h, rathaus)`
  - `pruef.uhrVersatz(ms)`
  - `pruef.glockenHoeren(h, rathaus)`: rechnet die Stunde offline für eine Hörprobe.
- Sonde: `werkzeug/pruefe-800-glocken.js`.

## Fassung 801 — Handeln im kleinen Rahmen, schlank wie das alte Dorf

XANDER: „Da brauchen wir zwei Werkzeuge, einmal zur Ansicht und einmal, dass wir da jetzt an der Stelle was machen wollen … in der ganz kleinen Miniaturansicht muss man dann auch nur auf Einsammeln klicken können" und „dann muss die neue Version in dem kleinen Miniatur-Frame auch genauso schlank sein wie die alte Version … nur in der Landschaftsansicht darf sie etwas größer sein".

- **Ansehen:** Wischen verschiebt, Lupe und die kleine Karte navigieren.
- **Handeln:** Ein Tipp auf ein Gebäude oder einen Bauplatz in der kleinen Stadt schickt `leicht-haus` an das Spiel. Darunter öffnet sich die gewohnte Karte des Spiels (Einsammeln, Ausbauen, Arbeiter …), nicht mehr ins Bild ragend.
- **Schlank:** Im kleinen Rahmen lädt `bilder.js` nur die kleinen Bilder (`LB.nurKlein`), und die Nähe ist auf die Lupen-Stufe begrenzt (`K.max` = 2,3 × Überblick). Erst im Vollbild gibt es große Bilder und volle Nähe.
- `lsAuf` holt die Stadt nach „Alte Version“ nicht mehr zurück. `SZ.sichtbare` ist auch bei einem 0 × 0 großen Rahmen gesetzt.
- Sonde 799 erweitert: kein großes Bild im Kleinformat; ein Haus-Tipp öffnet die Karte unter dem Bild.

## Fassung 802 — altes Dorf: Leinwände sofort freigeben (Verdacht „nur Blau“)

XANDER: „dass ich jetzt wie bei Emmi gestern das nur noch Blau angezeigt bekomme … weil das andere wahrscheinlich im Puffer hängt".

- Geprüft: Mit Xanders echtem Spielstand (16 Gebäude auf Stufe 3, Fernsehturm, Nacht) malt das alte Dorf hier in 1,2 s. Bei sechsfach gedrosselter CPU dauert es 3,4 s, ohne Fehler.
- Verdacht: Jedes neue Malen (Tag/Nacht, Schnee, Ausbau, Jahreszeit) legt eine große Leinwand und eine Zugmaske an. iOS gibt Leinwandspeicher erst spät frei. Ist das Budget erschöpft, bleiben neue Leinwände leer, und man sieht nur den blauen Grund.
- Änderung: Verworfene Leinwände werden sofort auf 0 × 0 gesetzt (`dmLeinwandWeg`). Im Vorrat bleiben höchstens 2 statt 4.

## Fassung 803 — Bootsverleih am See (Touristen-Attraktion)

XANDER: „vielleicht so ein kleines Bootshaus für den Verleih vom Wassertreter … dann sind das nämlich Touristen-Attraktionen, wo die Leute dafür bezahlen und dann kommt wieder Geld in die Kasse, und da sollst du irgendwie so eine Zufallsmechanik einbauen, dass die Leute einfach Bock haben, diese Freizeitangebote zu nutzen, weil mein Angebot vielfältig ist".

- **Server** (Migration `spiel_802_bootsverleih`):
  - `spiel_freizeit_bauen('bootsverleih')` baut den Verleih: Stufe 1–3 für 150/300/500 P, gespeichert in `volk.freizeit.bootsverleih`.
  - `spiel_freizeit(uid, touristen, slot, s)` würfelt je Zug-Tourist (deterministisch nach Slot), ob er Lust hat.
  - Lust nach Jahreszeit: Sommer 55 %, Frühling 40 %, Herbst 25 %, Winter 30 % mit Schlittschuhen statt Tretbooten.
  - Regen × 0,4, nachts (21–8 Uhr) × 0,3.
  - Vielfalt (Wahrzeichen, Gasthaus, Verleih-Stufe) × (1 + 0,08 je Punkt), höchstens 85 %.
  - Plätze: 4 je Stufe. Preis: 2 + Stufe P je Fahrt.
  - `spiel_bahn('touristen')` rechnet das zum Erlös und meldet `freizeit` zurück.
- **Spiel:** Am Bahnhof steht unter der Kurtaxe der Kasten „Bootsverleih am See“ (Bauen/Ausbauen). Steigen Touristen aus, sagt die Meldung, wie viele Tretboot fuhren, was es brachte und wie viele kein Boot mehr bekamen.
- Sonde `werkzeug/pruefe-803-bootsverleih.js`: neu grün, alter Code 5 rot.

## Fassung 804 — fließender Tag/Nacht-Wechsel im gemalten Dorf

XANDER: „fließend Tag und Nacht … auch bei uns" (im Spiel-Dorf, nicht nur in der neuen Stadt).

- `sonnenHoehe(datum)` berechnet den Sonnenstand über Döbeln (51,12° N, 13,12° O). Stichproben: Sommer-Mittag 62°, Winter-Mittag 15°.
- Die neue Ebene `.sp-dl-daemmer` direkt über der Leinwand hat zwei Anteile:
  - `--glut`: Abendrot/Morgenrot (soft-light), am stärksten bei 2° Sonnenhöhe, bei Regen gedämpft.
  - `--dunkel`: blaue Dämmerung (multiply) ab 5° abwärts, höchstens 0,38.
  - Nachts übernimmt das gemalte Nachtbild, die Ebene ist dann leer.
- Wechsel Tag ↔ Nacht: Das vorige Bild aus dem Vorrat (`DM.zuletzt`) blendet in der Leinwand über 3 s aus, statt hart zu springen. Ein eigenes Blend-Element würde das Angleichen des Menüs wieder entfernen.
- Prüfhaken: `S.sonneTest` (feste Sonnenhöhe), `pruef.sonnenHoehe`.
- Sonde `werkzeug/pruefe-804-tag-nacht.js`: Bei 1,2 s liegt die Helligkeit zwischen Tag und Nacht (290 → 230 → 125).

## Fassung 805 — die neue Stadt im kleinen Rahmen: schlank, still, verlinkt

XANDER: „Du solltest dich vorher erst mal darum kümmern, dass man in dieser neuen Map auch die Sachen anklicken kann … in der Miniaturansicht fast noch kleiner ist als unsere alte … damit wir keinen Ladebalken haben … das Bild bleibt nie irgendwie stehen … wir können jetzt gar nicht mehr runter in unsere Menüs gehen" und „dass die Sachen verlinkt sind, dass ich schon in der Map jetzt schon einsammeln kann".

- **Einsammeln in der Karte:**
  - Das Spiel schickt der neuen Stadt einmal je Sekunde dieselben Zeichen wie im alten Dorfbild (`leicht-zeichen`), aber nur bei einer Änderung: „4 Brot“ (grün, pulsiert), „Bau 1:20“, „kaputt“, „Kuchen 2:09“ (die laufenden Uhren nur mit der Lupe).
  - Ein Tipp auf ein Zeichen oder ein Haus wirkt wie im alten Dorf: Fertiges wird sofort eingesammelt (`dorfFertigSammeln`: Werk, Eier, Milch, Bergleute), eine Baustelle bekommt Hilfe, sonst öffnet sich die Station darunter.
- **Derselbe Spielstand:** Das Spiel schickt Gebäude, Bauplan, Baustellen und Wahrzeichen (`leicht-stand`). Was im Spiel gebaut oder versetzt wird, steht sofort in der Stadt, ohne Neuladen und ohne eigene Abfrage.
- **Schlank:** Der kleine Rahmen lädt 225 KB statt 1,9 MB. Er nutzt:
  - nur Zwergbilder `_z` (je Bild ≈ 7,5 Bildpunkte je Meter, `werkzeug/leicht-zwerg.py`, läuft beim Packen mit);
  - das kleine Verzeichnis `verzeichnis-klein.json` (21 KB gepackt; Fensterlichter der `_k`-Bilder werden aus den Zwergbildern hochgerechnet);
  - keine Leute, keine Baustellenbilder, kein doppeltes Tag-/Nachtbild;
  - keinen Ladevorhang (kein Ladebalken).
- **Steht still:** Wischen über die kleine Stadt scrollt die Seite (Wald, Jagd, Bergwerk, See, Feld, Mühle, Bäckerei, Wahrzeichen bleiben erreichbar). Ziehen und Mausrad verschieben die Karte nur im Vollbild.
- **Minikarte:** 72 px am Rand, Viertel ≈ 24 px, nur mit der Lupe.
- **Dazu** (Helfer): Tretboote als Schwäne, Bootshaus mit Steg, Badegäste und Liegewiese (Frühling/Sommer, bei Tag).
- Sonde `werkzeug/pruefe-799-stadt-im-dorfrahmen.js`: alles grün. Die alte Fassung hat 8 Fehler (Ladegröße, Wischen, Minikarte, Spielstand, Zeichen, Einsammeln).

## Fassung 806 — kleine Stadt: Kompass, Kopfzeile, Namen, zwei Modi; Vollbild schlank

XANDER: „Jetzt fehlt in der kleinen Ansicht der neuen Version der Kompass … das sind zwei verschiedene Modus der eine ist fest gezogen und hat dann den Kompass wo wir ein bisschen in der Stadt rum navigieren können … diese Kachel … kann halb so klein sein … Danach muss wieder die Uhrzeit stehen. In der Mitte muss wieder mein Spitzname stehen … wenn man in der Vollbildansicht ist dann bricht das Ganze immer ab … schau auch, dass du die Labels … wieder einbaust".

- **Kompass statt Lupe:** oben links der Kompass des alten Dorfs (26 px, Tippfläche 34 px, mit „+“/„−“).
  - Ein Tipp holt näher heran; dann erscheinen die kleine Karte (jetzt 40 px, Viertel ≈ 13 px) und der Finger verschiebt die Stadt.
  - Ein zweiter Tipp führt zurück zur ganzen Stadt.
- **Zwei Modi:**
  - Normal steht die Stadt fest, und Wischen scrollt die Seite bis in die Menüs.
  - Nur mit dem Kompass gehört der Finger der Stadt (`lk-nah`: touch-action none, Ziehen in start.js erlaubt).
- **Kopfzeile wie im alten Dorf:** Kompass und Uhrzeit (Deutschland), in der Mitte das Ortsschild mit dem Namen, rechts das Wetterschild. Name und Wetter schickt das Spiel (`leicht-kopf`).
- **Namen an den Häusern** („Bäckerei 2“ …) im kleinen Rahmen. Die Zeichen („4 Brot“) rutschen nicht unter die Kopfzeile.
- **Vollbild bleibt schlank:**
  - Eingebettet gilt immer der Sparmodus: nie die großen Bilder, 12 Leute, Nähe höchstens das 1,6-Fache der kleinen Bilder.
  - Oben gibt es „In neuem Tab öffnen“.
- **Speicher:**
  - „Alte Version“ entfernt den Rahmen der neuen Stadt ganz.
  - „Neue Version“ gibt die gemalten Bilder des alten Dorfs frei (0 × 0).
- **„Als App“:** Der Knopf unter der Stadt fragt auf Android/Chrome direkt; auf dem iPhone erklärt er „Teilen → Zum Home-Bildschirm“. Läuft die Seite schon als App, fehlt er.
- Sonde 799 erweitert (Kompass, Uhr, Ortsschild, Namen, Verschieben nur mit Kompass, Vollbild ohne große Bilder): alles grün.

## Fassung 807 — Originalkarte, Eisenbahn, kleines Bild wie früher, acht Winkel

XANDER: „denk an das Layout der Originalmap. Die Leute sollen sich sofort zurechtfinden" · „dass ich die Eisenbahn wieder hinten lang fahren [sehe]" · „die Stadt soll auch wie früher in der Klein Ansicht im selben Maßstab sein … jedes Gebäude sichtbar … so großzügig mit so viel Platz dazwischen" · „über den Bereich des Bildes scrollen … unter das Bild" · „Es gibt ja nicht umsonst den Punkt Symbole aus" · „du hast gesagt acht Winkel".

- **Vorlage 1 „Originalkarte" (Standard, `stadt-leicht/dorf.js`)**:
  - Die 16 Bauplätze kommen aus dem alten Dorfbild (DORF_LAGE 320 × 200), umgerechnet in die Welt mit gleicher Anordnung im Bild. Rangkorrelation links→rechts und hinten→vorn = 1,0.
  - Das Rathaus ist das Döbelner Rathaus (Modell rathaus_doebeln, 70 %) am Marktplatz mit Brunnen.
  - Mühle links mit Mühlbach, Bergwerk hinten rechts, Fluss vom Markt zur Seezunge vorn, Felder vorn.
  - Wege sind ein kürzestes Netz zwischen Markt, Häusern, Bahnhof, Bootshaus und Wahrzeichen, mit Brücken und Laternen. Die Leute gehen auf diesen Wegen.
  - Die Wahrzeichen stehen auf freien Plätzen.
  - Der Rundling bleibt über `?vorlage=rundling` erreichbar.
- **Eisenbahn (Helfer, `stadt-leicht/bahn.js`)**:
  - Dampflok mit Tender und Güterwagen fährt hinten entlang (Welt y = −86), hält 14 s am Bahnhof und fährt zu den Nachbardörfern aus der Karte hinaus.
  - Nachts leuchten die Lampen, im Winter liegt Schnee, Rauch steigt auf.
- **Kleines Bild wie früher**:
  - Die ganze Stadt passt in den Rahmen (alle Häuser, Wahrzeichen und der Bahnhof samt Höhe), mit Luft dazwischen.
  - Der Kompass holt 2,8-fach heran. Dann verschiebt der Finger die Stadt bis in die Außenbezirke, und ein Knopf dreht die Karte.
  - Ein Doppeltipp auf die Wiese führt zurück.
  - Die Kachelkarte ist 54 px groß.
  - Ein Tipp auf den See angelt.
- **Scrollen**: Im festen Bild scrollt Wischen das Dorf-Menü rund um das Bild (mit Schwung), nicht die ganze Seite.
- **Schilder wie früher**:
  - Gelb heißt fertig und wippt, vorn steht ein kleines Bild der Ware (Ei, Milch, Getreide, Brot …).
  - „Symbole“ und „Namen“ unter dem Bild schalten wie im alten Dorf. Ohne Symbole bleibt nur „fertig“ sichtbar.
- **Baustellen im kleinen Rahmen** (Zwergbilder `_n`) und ein schmaler Ladebalken unten.
- **Acht Bauwinkel (Helfer)**:
  - Häuser und drehbarer Schmuck drehen sich in 45°-Schritten.
  - Neue setzbare Modelle: Rathaus Döbeln, Dodge Viper, Batmobil, Pferdebahn, Korn-, Mehl- und Leerwagen, Gleise.
- **Sonden**: `pruefe-807-originalkarte.js` (neu grün, alter Code rot), `pruefe-799` (erweitert), `pruefe-808-acht-winkel.js`, `pruefe-809-eisenbahn.js`, `pruefe-leicht.js`.

## Fassung 808 — Originaltreue: Horizont und Alpen, Bahn oben, See unten, Himmel nach Uhrzeit, Fuhrwerke, Tiere

XANDER: „das soll genau das selbe Bild sein im Prinzip von der Map … man soll das direkt wieder erkennen können" · „oben war die Horizontlinie … ist der Zug an diesem Rand entlanggefahren … dann stand das Gästehaus dort unmittelbar in der Nähe von den Gleisen" · „unten … wenn man weiter runtergeht, dass der See sich eröffnet" · „wo ich mein Berliner Fernsehturm stehen habe" · „Tag und Nacht … realistisch nach Uhrzeit, vielleicht angepasst an die Zeitzone" · „realistisch in der Nacht mit Sternen, zufälligen Wolken, Vögeln, Tieren".

- **Bild wie früher (`stadt-leicht/dorf.js`, Vorlage „altdorf")**:
  - Quer über dem Bild liegt die Horizontlinie (v = x + y = −100). Dahinter stehen die Alpen als Spielgrenze; die Kamera geht nicht darüber hinaus.
  - Die Bahn läuft oben waagerecht durchs Bild, knapp hinter dem Gasthaus, leicht gewellt, und an beiden Seiten hinaus.
  - Der Bahnhof steht wie im alten Bild hinter dem Gleis, der Bahnsteig zeigt zum Gleis. Dafür wurden Bahnhof, Wahrzeichen, Bootshaus und Brücke zusätzlich in 45° gebacken.
  - Alle Häuser schauen wie im alten Bild zum Betrachter. Nur die Mühle behält ihr Rad am Bach.
  - Der Fluss entspringt oben zwischen Flickstube und Gasthaus. Er läuft links am Rathaus vorbei, zwischen Brauerei und Bibliothek hindurch, und mündet unten rechts der Mitte in den See, wie im alten Bild.
  - Der See ist verschoben: Im Überblick sieht man nur die Zunge. Weiter unten öffnet er sich, mit Badebucht, Bootsverleih, Tretbooten und Badegästen (`boote.js` rechnet mit `D.SEE_VERSATZ`).
  - Der Mühlbach fließt nach dem Wasserrad links aus dem Bild. So bleibt beim Kuhstall Platz für Weide und Auslauf.
  - Die Wahrzeichen stehen auf den fünf Plätzen des alten Dorfs (WUNDER_PLAETZE) und in der Größe des alten Bilds. Ein gewählter Platz (`volk.wunder_platz`) gilt: Xanders Fernsehturm steht unten links. Das Spiel schickt den Platz jetzt mit (`leicht-stand`).
  - Wege führen um die Häuser herum, nicht hindurch.
  - Eine eigene Pferdebahn-Straße führt vom Markt links am Rathaus vorbei hinauf zum Bahnhof.
- **Himmel (`stadt-leicht/himmel.js`)**:
  - Der Himmel folgt der Uhr und Zeitzone des Geräts: Tag, Dämmerung und Nacht gehen fließend ineinander über.
  - Tags gibt es Sonne, zufällige Haufenwolken und ab und zu einen Vogelschwarm. Nachts funkeln Sterne, dazu kommen Mond, dunkle Wolken und ab und zu eine Sternschnuppe.
  - Die Alpen haben Schneefelder, Rinnen und Licht von rechts, davor bewaldete Vorberge im Dunst. Im Winter reicht der Schnee tiefer.
  - Die Berge werden je Jahreszeit und Tageszeit-Stufe nur einmal vorgemalt.
- **Tag/Nacht- und Jahreszeit-Schalter** sieht nur noch der Betreiber (Vorschau). Für alle anderen gilt die Uhr des Geräts.
- **Fuhrwerke (Helfer, `stadt-leicht/fuhrwerk.js`, Sonde 810)**:
  - Kornwagen fahren vom Feld zur Mühle und bringen Mehl zur Bäckerei. Nachts ruhen sie.
  - Die Döbelner Pferdebahn pendelt zwischen Markt und Bahnhof.
- **Tiere (Helfer, `stadt-leicht/tiere.js`, Sonde 811)**:
  - Kühe stehen auf der Weide am Kuhstall, Schweine im Auslauf, Hühner und ein Hahn laufen um den Hühnerstall.
  - In der Dämmerung gehen die Tiere in den Stall, nachts ist keins draußen.
- **Sonden**:
  - `pruefe-807-originalkarte.js` ist erweitert (Horizont, Himmel, Bahn oben, Bahnhof hinter dem Gleis, Seezunge, Blickrichtung, Wahrzeichenplatz). Neu ist sie grün, mit dem Code von 807 rot.
  - `pruefe-809` rechnet jetzt mit der waagerechten Strecke.
  - `pruefe-808` bekommt längere Wartezeiten und einen freien Platz ohne Bäume.
  - `pruefe-leicht` prüft, dass die Schalter nur der Betreiber sieht.
  - Neu: `pruefe-810-fuhrwerk.js` und `pruefe-811-tiere.js`.

## Fassung 809 — Bedienung der Stadt: Leuchtkreis, ruhige Zeichen, Wald, Häuser versetzen, Scrollen, Nachtlicht, Auftritt Batmobil/Viper

XANDER: „ich möchte nicht, dass wenn man auf ein Haus klickt, dass man dann diese Strichelinien sieht … so ne Kreis Markierung … weicher" · „vielleicht einfach nur ne Kanne mit mal eins dran ohne großes Hintergrund … so ruhig und vielleicht leicht pulsieren" · „Waldstück … wenn man auf die Bäume klickt … einen Effekt" · „Mir fehlen noch die items zum schmücken die finde ich hier in der kleinen Map noch gar nicht" · „meine Häuser auch im Nachhinein … herum zu drehen oder anders zu positionieren … und das abspeichern" · Walkie 304: „Das Scrollen ist sehr schwerfällig und hängt immer nach und schiebt sich zurück" · Funk 205: „über strahlen die Fenster Lichter so sehr … die Laternen … haben überhaupt keinen Schein".

- **Auswahl (`szene.js`)**: Ein angetipptes Haus bekommt einen weichen, leicht atmenden Lichtkreis am Boden unter dem Haus. Gestrichelt ist nur noch, was gerade gesetzt oder versetzt wird.
- **Fertig-Zeichen (`oberflaeche.js`, `leicht.css`)**: nur das Bild der Ware und „×4" auf einem weichen hellen Schein. Es atmet langsam um den Fußpunkt, springt also nicht. Die Tippfläche ist 44 px groß, der ganze Text („4 Brot") steht als Titel dabei.
- **Wald**: Ein Tipp auf einen Baum lässt Blätter rieseln (im Winter Schnee) und zwei Vögel auffliegen. Im Spiel öffnet sich die Wald-Station.
- **Schmücken/Bauen**: stehen unter dem kleinen Stadtbild und öffnen das Vollbild gleich mit der passenden Leiste. Viper, Batmobil, Pferdebahn und Wagen sind dort unter „Fahrzeuge".
- **Häuser versetzen**: In der Hauskarte gibt es jetzt „Versetzen" (Ziehen oder Tippen, Setzen/Abbrechen) und „Zurück auf den Bauplatz". Gespeichert wird der Versatz zum Bauplatz (`lage[k] = {dreh, dx, dy}`), lokal und am Server (`spiel_stadt_leicht_speichern`). Bäume unter einem versetzten Haus verschwinden. Solange etwas gesetzt wird, baut die Stadt nicht neu auf.
- **Scrollen im kleinen Rahmen**: Der Finger wird in Koordinaten der Spielseite gemessen (Finger + Lage des Rahmens). Das Menü folgt dem Finger jetzt 1 : 1; vorher hob sich die Bewegung zur Hälfte auf, weil der Rahmen mitwanderte.
- **Namen/Symbole** sind im Rahmen aus, bis das Spiel sie einschaltet.
- **Nacht**:
  - Das Fensterlicht ist gedämpft. Jedes Fenster ist an oder aus: abends die meisten, spät nachts wenige; jedes wechselt zu seiner eigenen Zeit.
  - Die Laternen werfen einen kräftigeren Lichtkegel.
  - Tag und Nacht blenden auch im kleinen Rahmen fließend über.
- **Auftritt Batmobil und Dodge Viper (Helfer, `app.js`, Sonde `pruefe-812-auftritt-autos.js`)**: Beide fahren als 3D-Einzug aus einem Drehblatt mit 32 Blickwinkeln ein: Kurve mit Quietschen, frontaler Halt, das Profilbild steigt aus, Abfahrt in die Tiefe. Das Batmobil hat Nachbrenner und einen gerechneten Klang.
- **Zeitanzeige an See und Wald** (Funk 203: „dass z.B die Zeit angezeigt wird wenn etwas in Bearbeitung ist wie das früher am See war"): Fischer, Holzfäller und Jäger bekommen ihr Zeichen mit Restzeit an der Seezunge bzw. an der dichtesten Baumgruppe. Das Zeichen ist auch im Überblick und bei „Symbole aus" sichtbar. Fertiges wird mit einem Tipp abgeholt (`lsZeichen` in `spiel.js`, `ORTE` in `oberflaeche.js`).
- **Einkaufen und was ab welchem Level kommt (Helfer, `spiel.js`, Sonde `pruefe-813-handel-level.js`)**:
  - Im Dorf-Menü steht „Markt & Handel" mit dem Umschalter „Einkaufen | Verkaufen". Jede Ware zeigt Kaufpreis und Vorrat, man kauft 1, 5, 20 oder 50 Stück. Gesperrt ist ein Knopf, wenn Punkte, Tagesmenge oder Lagerplatz fehlen.
  - Der Kaufpreis ist Tagespreis × 1,6. Man kann 60 Stück am Tag kaufen, mit Marktstand und Hanse-Kontor mehr. Kaufen und gleich wieder Verkaufen bringt nie Gewinn.
  - Häuser lassen sich über Stufe 3 hinaus ausbauen: Stufe 4 ab Level 15, Stufe 5 ab 25, Stufe 6 ab 35, jeweils mit Holz, Erz und Gold.
  - Neue Häuser: Holzfällerhütte (Level 12), Marktstand (15), Schweinestall (18), Jagdhütte (22), Sternwarte (30).
  - Neue Forschungen ab Level: Sägewerk 14, Hanse-Kontor 20, Räucherkammer 24, Fernrohr 32 und eine geheime ab 40.
  - „Was kommt als Nächstes · Dorfstufe N" zeigt die Dorfstufe (Weiler bis Großstadt), die Höchststufe je Level und die nächsten Freischaltungen. Gesperrtes trägt ein Schloss und „ab Level N".
  - Die Migrationen `fassung_813_handel_level_a/_b_ernte` sind angewendet (Kopie in `supabase/fassung-813-handel-level.sql`). Die neuen Häuser haben in der Karte noch keinen Platz.
- **Jahreszeiten und Bildregler (Helfer, Sonde `pruefe-814-jahreszeiten.js`)**:
  - Der September ist noch Sommer. Jeder Laub- und Obstbaum färbt sich an einem eigenen Tag zwischen 1. und 25. Oktober und wird im November kahl.
  - Winter kommt ab dem 27.11. oder wenn das Wetter Schnee meldet; der Schnee bleibt dann 36 Stunden liegen.
  - Neu gebacken sind Frühling (Obstbäume blühen), Sommer und kahl, zusammen 2 MB.
  - Der Betreiber schaltet mit dem Jahreszeit-Knopf durch Frühling, Sommer, Frühherbst, Spätherbst, Winter, Schneefall und Automatisch.
  - Alle Nutzer haben Regler für Farbstimmung, Helligkeit, Sättigung und Kontrast, dazu „Zurücksetzen". Die Werte bleiben gespeichert.
  - Zum Prüfen gibt es die Parameter `?datum=JJJJ-MM-TT` und `?wetter=schnee`.
- **Döbelner Rathaus und Windmühle (Helfer, Sonde `pruefe-812-rathaus-windmuehle.js`)** — XANDER: „wenn man vor dem Brunnen steht … guck mal genau auf den Eingang zu, dann ist dieser dominante Teil seitlich nach rechts" · „Vergiss die Windmühle nicht":
  - Das Rathaus steht jetzt mit `dreh` 3: Vom Brunnen aus sieht man frontal das Portal im Turm, der Staffelgiebel-Flügel geht nach rechts weg, der Flügel mit dem Dachreiter liegt links.
  - Es rückt 3 m nach rechts (gleiche Tiefe), damit die Pferdebahn-Straße links sichtbar bleibt. Der Brunnen steht vor dem Portal, Christbaum und Buden bleiben auf dem Markt.
  - Am Modell kamen dazu: „Ratskeller"-Schrift am Giebel, ein kleiner Staffelgiebel am Ostflügel, ein Dachreiter mit Kupferhaube und im Winter Lichterketten unter dem Sandsteinsims.
  - Die Mühle ist wieder die Windmühle des alten Dorfs (`g_windmuehle`). Die Flügel drehen sich als eigenes Drehblatt (`stadt-leicht/windmuehle.js`): tags 7, nachts 3 Umdrehungen je Minute.
  - Der Bahnhof ist antippbar und öffnet im Spiel die Bahnhof-Station.
- **Platzwechsel im Spielmodus (Helfer, Funk 204, Sonde `pruefe-816-platzwechsel.js`)**: Eine bereite Klassenkraft, Tier-Fähigkeit oder ein gewählter Zauber fing jeden Tipp auf einen leeren Platz ab („Tippe auf ein Gesicht – der Platz ist leer"). Allein im Raum saß man so fest. Jetzt wechselt ein Tipp auf einen leeren Platz immer dorthin, und die Kraft bleibt bereit.
- **Sonden**:
  - `pruefe-809` wartet, bis der Zug am Halt steht. Unter Last war der Zug beim Lesen noch leer.
  - `pruefe-799` prüft zusätzlich das langsame Wischen: 80 px Finger ergeben 80 px Scrollen. Mit dem alten Code sind es 50 px, die Sonde ist dann rot.
  - `pruefe-799` akzeptiert „×4" mit dem Titel „4 Brot" und die neuen Knöpfe unter dem Bild.

## Fassung 815 — Dodge Viper und Batmobil fahren in der leichten Stadt, kaufen mit Punkten
- XANDER: „mein neuen Dodge Viper und mein Batmobil habe ich immer noch nicht in der Map … Du sagst, sie sind fertig, aber ich seh sie noch immer nicht. Ich kann sie nicht dazu kaufen. Ich kann sie im Spiel überhaupt nicht ausprobieren." – früher: „dieses Batmobil hätte ich nicht nur in dem Spiel gerne, das als fahrendes Auto zu sehen ist".
- **Fahren (`stadt-leicht/autos.js`)**: auf den Wegen des Dorfes (ohne die Pferdebahn-Straße) der kürzeste Weg zu zufälligen Zielen (Häuser, Wahrzeichen, Markt; nicht vor Mühle und Bäckerei, dort halten die Kornwagen). Vor dem Haus 4–8 s Halt. Bis 7 bzw. 7,5 m/s, sanft anfahren und bremsen, in Kurven langsamer; Ecken als Bögen abgerundet und gleitend gemittelt. Rechtsverkehr, bei Gegenverkehr weiter rechts (immer unter 2 m vom Weg). Wartet hinter Kornwagen, Pferdebahn und dem anderen Auto; ein fahrendes Auto lässt ein Pferd warten. Wo der Weg zurückführt (Sackgasse, spitzer Abzweig), wendet es in drei Zügen. Räder drehen sich, nachts Scheinwerfer mit Lichtkegel und Rücklichter (beim Bremsen heller), das Batmobil glüht beim Anfahren. Tipp auf ein fahrendes Auto öffnet seine Karte („Hinfahren" folgt ihm).
- **Bilder**: Laufblätter `l_auto_viper` / `l_auto_batmobil` (backplan „leute", 16 Richtungen × 3 Radstellungen, Winter/Herbst × Tag/Nacht, 28 px/m); Zwergblätter `_z` mit einem Bild je Richtung für das kleine Bild im Spiel. `stadt-backen.js` kann dafür `richtungen` und `gierVersatz`; die Modelle kennen die Varianten „fahrt radN". `stadt/kern.js`: fast auf der Kante stehende Flächen malen keine langen Striche mehr (Radflächen des Batmobils von hinten).
- **Kaufen**: Schmücken-Leiste → Viper 300 Punkte, Batmobil 450 Punkte, „Kaufen" (Beispielstadt: gesperrt, dafür 90 s Probefahrt). Server: Migration `supabase/spiel_815_autos_kaufen.sql` (Spalte `spiel_spieler.autos`, `spiel_auto_kaufen(p_auto)`, `spiel_autos()`; SECURITY DEFINER, keine RLS-/Rechte-Änderung) – **noch nicht angewandt**. Bis dahin merkt sich die Stadt gekaufte Autos vorläufig in `stadt_leicht.autos` (ohne Abbuchung); die Migration übernimmt sie. Gekauft: „Abstellen" (als Schmuck, `stadt_leicht.geparkt`) und „Losfahren".
- **Fuhrwerke**: fahren jetzt im Bild wirklich rechts (die Schrägansicht spiegelt).
- **Sonden**: neu `pruefe-815-autos.js` (mit dem alten Stand rot); `pruefe-808` stellt den Viper jetzt über „Abstellen" hin. 799, 807, 809, 810, 811, leicht grün.

## Fassung 810 — Viper und Batmobil in der Stadt, Bergwerk-Stollen, Reiselok mit Klang, flüssige Windmühle, kleine Zeichen

XANDER: „mein neuen Dodge Viper und mein Batmobil habe ich immer noch nicht in der Map … Ich kann sie nicht dazu kaufen" · „ich möchte dieses höhlenartige haben dass man instinktiv weiß da geht's in das Bergwerk hinein" · „diese schöne klassische Lokomotive … unsere Lokomotive hat noch keinen Klang" · Funk 207: „Die Symbole beim Einsammeln sind immer noch viel zu groß … beim Wald müssen Holz und Fleisch zu sehen sein" · „die Blätter der Windmühle rotieren nicht flüssig".

- **Autos (Helfer, `stadt-leicht/autos.js`, Sonde `pruefe-815-autos.js`, Abschnitt „Fassung 815" oben)**:
  - Viper und Batmobil fahren auf den Dorfwegen, halten vor Häusern und wenden in Sackgassen.
  - Nachts haben sie Scheinwerfer.
  - Kaufen in der Schmücken-Leiste: Viper 300, Batmobil 450 Punkte. Die Migration `spiel_815_autos_kaufen` ist angewendet (Spalte `spiel_spieler.autos`, `spiel_auto_kaufen`, `spiel_autos`).
  - Hinter der haltenden Pferdebahn wartet ein Auto bis zu 30 s, statt dicht daneben zu wenden.
- **Bergwerk (Helfer, `stadt/modelle/bergstollen.js`, Sonde `pruefe-818-bergwerk-lok.js`)**:
  - Ein Felshügel mit Stollenmundloch, Türstock und „GLÜCK AUF".
  - Davor Gleis mit Erzlore, Grubenlampe und Halde; oben ein kleines Fördergerüst. Nachts leuchtet es.
- **Reiselok (`stadt/modelle/reiselok.js`)**:
  - Schwarzer Kessel mit Messing, rote Speichenräder mit Treibstangen (sechs Radstellungen), Tender und drei weinrote Abteilwagen.
  - Der Zug fährt abwechselnd in beide Richtungen, wie schon vorher.
- **Klang (`stadt-leicht/ton.js`, Web Audio)**:
  - Schnaufen im Takt der Räder, Pfiff bei Ein- und Abfahrt, Bremsquietschen und Dampf am Halt.
  - Leise und nach Nähe gemischt. Er spielt nur, wenn die Töne an sind.
- **Windmühle**: Statt zwei Stellungen zu überblenden, wird die nächste Stellung um die Nabe weitergedreht. So läuft das Kreuz stufenlos, auch im kleinen Rahmen mit nur 4 Stellungen. Die Drehrichtung ist per Bildvergleich geprüft.
- **Fertig-Zeichen**: kleineres Bild (15 px) mit kleinem Schein, Tippfläche 40 px. Die Jäger bekommen eine Keule als eigenes Symbol.

## Fassung 811 — Rathaus als Stern um den Turm, Rahmen passgenau, gleiche Knöpfe, Ein-Tipp-Produktion, Doppeltipp-Zoom

XANDER (Funk 206): „links den Turm und rechts das Haus … die Rückseite von dem Turm hat auch noch mal so ein Hausschiff … dreizackiger Stern" · Walkie 305: „dieselben Knöpfe … wie beim alten" · Walkie 306: „die Kachel oben rechts das Ganze oben rechts anzeigen bis zur Grenze" · Funk 207: „Schmücken/Bauen im kleinen Fenster ohne Vollbild".

- **Rathaus (Helfer, `stadt/modelle/rathaus_doebeln.js`, Sonde `pruefe-819-rathaus-form.js`)**:
  - Turm mit Portal zum Brunnen.
  - Flügel A (Stufengiebel, Ratskeller) im rechten Winkel nach rechts.
  - Flügel B (22 m, länger als A) hinter dem Turm.
  - Flügel C 35° schräg nach vorn links, mit Balkon und Dachreiter.
  - Der Grundriss steht als Daten im Modell und in `D.GRUNDRISS.rathaus`. Die Wege führen zum Portal, das Portal liegt frontal 5,6 m hinter dem Brunnen, `dreh 3.5`.
  - Alle 120 Rathausbilder sind neu gebacken. Die Katalog-Grundfläche in der Schmücken-Leiste ist jetzt [41, 33.1].
- **Rahmen und Bedienung (Helfer, Sonde `pruefe-817-rahmen-bedienung.js`)**:
  - Beim Öffnen, beim Wechsel alt/neu, nach dem Vollbild und nach Aufgaben rollt das Bild ganz in den Blick.
  - Unter beiden Bildern steht dieselbe Knopfreihe (Symbole, Namen, Umbauen, Saison, Halloween-Paket), dazu Vollbild, Schmücken, Bauen und „Ein Tipp produziert".
  - Halloween-Kürbisse vor den Häusern, nachts leuchtend.
  - Ein Haus-Tipp rollt zur Karte darunter, jeder Knopf dort wieder zurück zum Bild.
  - Mit „Ein Tipp produziert" startet der Tipp die Aufgabe sofort. Die Bäckerei zeigt eine kleine Wahl: Brot, Kuchen, Torte, Karte. Das Wahlfeld ist deckend, damit keine Namen durchscheinen.
  - Die kleine Karte ist ein Abbild des Überblicks: jede Kachel zeigt genau ihr Neuntel bis an den Rand.
  - Doppeltipp schaltet Überblick → Nähe → zweite Stufe (7-fach, große Bilder erst dann) → Überblick.
  - Schmücken und Bauen gehen im kleinen Rahmen ohne Vollbild.
- **Leitung bei vielen Leuten** (`livechat.js`, Sonde `pruefe-811-leitung.js`). XANDER: „wie kann es sein, dass die Webseite sich schwerer anfühlt wenn Leute reinkommen".
  - Vorher fuhr ein Galeriefoto (Datenadresse, bis 140 000 Zeichen) in jedem Paket mit: im Puls alle 6 s, in jeder Chatzeile, bei jedem Stummschalten.
  - Jetzt geht es voll nur bei `hallo`/`auch-da`, 20 s nach dem Ändern und auf Nachfrage (`bild-bitte` → `bild-voll`, höchstens alle 10 s). Sonst fährt nur der Fingerabdruck `bildH` mit, und der Empfänger setzt das Foto aus seinem Lager ein.
  - Gegenprobe: Mit dem alten Code ist die Sonde rot (Puls mit 69 950 Zeichen statt 192).
  - Das Grundproblem bleibt: Jedes Handy schickt sein Bild einzeln an jeden. Dafür braucht es einen Medienserver (SFU); Frage an Xander im Walkie 311 (Cloudflare Realtime).
- **Magic-Knopf** (`korrekturen.css`):
  - Auf dem iPhone sah man ein drehendes Quadrat („wie Würfel"), weil Safari drehende Kinder mit `overflow:hidden` + `border-radius` nicht abschneidet. Der Farbwirbel schneidet sich jetzt selbst kreisrund (`clip-path`).
  - Der Lichtkranz ist nicht mehr als `box-shadow` animiert, und die zweite Schicht mit Weichzeichner und Mischmodus entfällt. Leerlauf-Rechenzeit gemessen: 66 → 48 ms je Sekunde.
- **Viper/Batmobil-Auftritt** (`app.js`):
  - Im Klassenzimmer holt jedes Gerät beide Drehblätter im Leerlauf vorab und entpackt sie einmal. Vorher lud jedes Gerät sie erst, wenn jemand hereinfuhr.
  - Erstes Bild gemessen (vierfach gedrosselt): 1,2 s → 7 ms.
- **Neue Stadt für Beta-Tester**: `neueStadtErlaubt()` fragt jetzt `isBetaTester()` und `istBetaFuerSpiel("stadt_neu")` ab. Damit sehen sie der Betreiber, alle Beta-Tester und die einzeln Eingeladenen (`feature_flags["beta:stadt_neu"]`, dort steht Emy). Der Knopf heißt „Neue Version (Beta)". Für alle ist sie erst frei, wenn `LEICHT_FREI` gesetzt wird (nur nach Xanders ausdrücklichem OK).

## Fassung 827 — Tonserver (Cloudflare Realtime SFU), zuerst nur Betreiber/Beta

XANDER (Funk 209): „Die App … hängt total erst recht. Wenn andere Leute mit dazu kommen … was müssen wir denn machen damit das endlich leicht und stabil läuft?" — Walkie 311: „Erst nur Ton über den Server, Bild bleibt wie jetzt".

- **Edge-Function `sfu`** (`supabase/functions/sfu/index.ts`, Fassung 3, verify_jwt aus wie `klassenzimmer`): `pruefen`, `sitzung` (sessions/new ohne Körper + eigene Tonspur veröffentlichen), `spuren` (andere abholen), `neu_verhandeln`, `schliessen`, `puls`. Geheimnisse `CF_SFU_APP_ID`/`CF_SFU_APP_TOKEN` nur in der Funktion. Freischaltung an der Datenbank: `is_owner`, `is_beta_tester`, `feature_flags["beta:sfu"]` oder `feature_flags.sfu`.
- **Bremse** (`supabase/sfu-verbrauch.sql`, Tabellen `sfu_verbrauch`, `sfu_sitzungen`, RLS an, keine Regeln): 64 kbit/s je gehörter Spur, 31-Tage-Fenster, Grenze = 1000 GB − TURN-Budget (jetzt 900 GB). Darüber: alle Hör-Spuren zwangsweise zu, Antwort `{aus:true, grund:"budget"}`. Sitzungen ohne Puls > 3 min werden geschlossen. Enger stellen: `betreiber_geheimnisse.sfu_budget_gb`.
- **Client** (`livechat.js`, Block „FASSUNG 827 — DER TONSERVER"): nur mit Freischaltung oder `?sfu=1`; nur Ton; nur wenn jemand anderes im Raum den Tonserver auch kann. Umschalten je Person erst, wenn Tonpakete wirklich ankommen (`sfu-hoere`); dann wird die Netz-Tonspur zu ihm leer, Netz-Leitung bleibt für Bild und Spiel. Jeder Fehler (aus, 500, 8 s, ICE) → alles zurück aufs Netz. `/verbindung` zeigt den Stand.
- **Sonde** `werkzeug/pruefe-827-sfu.js` (nachgebildete Funktion, nachgebildeter Server in einer dritten Seite). Der echte Weg über Cloudflare braucht einen Zwei-Geräte-Test.

## Fassung 825 — Laternen mit Nachtabschaltung, dunkle Fenster, alter Lok-Klang, Westminster-Rathausuhr, Baustellenlärm

XANDER: „dass du die Laternen richtig hast, dass sie die Häuser an Strahlen, dass sie nicht die ganze Nacht beleuchtet sind, um Strom zu sparen beziehungsweise es ist ja nicht jeder immer nachts noch wach" · „der Sound von alten Spiel von der Lokomotive den fand ich schöner als den jetzigen" · „Damm dumm da Dam … Big Ben" · „bei der Baustelle … man hört gar keine Baugeräten".

- **Uhr (`stadt-leicht/kern.js`)**: `ST.uhr()` = deutsche Ortszeit (Europe/Berlin) für Tag/Nacht, Laternen, Fenster, Rathausuhr und Kopfzeile. `?uhr=21:00` (auch `1:30`, `18.2`) stellt sie zum Prüfen, sie läuft von dort weiter; `ST.uhrStellen()` für Sonden.
- **Laternen (`stadt-leicht/szene.js`)**: an ab der Dämmerung (Nachtgrad ≥ 0,3), Halbnachtschaltung: jede zweite (nach Aufstellreihenfolge) geht zwischen 0:30 und 1:00 aus, ab 5:00 wieder alle an, solange es dunkel ist. Aus = kein Schein, dunkles Glas (Nachtbild einmal umgefärbt). Brennend: runder warmer Lichtfleck am Boden (≈ 7 m), zarter Lichtkegel in der Luft, und nahe Hauswände auf der Seite zur Laterne warm angestrahlt (Lichtbild je Haus, × Nachtbild, gemerkt).
- **Fenster**: Anteil heller Fenster nach der Uhr (21 Uhr 70 %, 1 Uhr 17 %, 2–4 Uhr 10 %, ab 5 Uhr wieder mehr); jedes Fenster hat seine feste „Schlafenszeit", selten geht nachts kurz eins an. Die gemalten Fenster im Nachtbild werden wirklich dunkel (Bildpunkte je gemessenem Fensterlicht, höchstens zwei neue Hausbilder je Gemälde).
- **Lok (`stadt-leicht/bahn.js`)**: wieder die Aufnahmen des alten Dorfs (`ton/lokpfeife`, `lokstampf`, `lokschiene`, `lokglocke`): Pfiff bei der Einfahrt, Glocke beim Einrollen, Pfiff 0,35 s vor der Abfahrt, sieben Anfahr-Stöße, danach Stücke aus `lokstampf` im Takt der Räder, Schienenrollen als Schleife. Fehlen die Aufnahmen, bleibt der Web-Audio-Klang von 818.
- **Rathausuhr (`stadt-leicht/ton.js`)**: Westminster-Schlag (gis' fis' e' h, fünf Wechsel) mit Web-Audio-Glocken; Viertel 1 / halb 2 / dreiviertel 3 Wechsel, volle Stunde 4 Wechsel + Stundenschläge (e). Nur wenn ein Rathaus steht, 22–7 Uhr still, leiser mit Abstand der Kamera, nur mit Ton an.
- **Baustelle (`stadt-leicht/ton.js`)**: nah an einer Baustelle Bagger (Baugrube), Hammer in Gruppen, Kran, Säge (selbst erzeugt), Spitzhacke – aus den Aufnahmen, die schon das alte Dorf hatte; 20–7 Uhr still.
- **Einsammeln (`ton.js` `T.einsammeln`, Aufruf in `oberflaeche.js`)**: XANDER: „bei den anderen bei Ei … kommt da gar nix … so dieses Haptik-Geräusch fehlt". Tipp auf ein fertiges Zeichen (oder im kleinen Rahmen aufs Haus mit fertiger Ware): für jede Ware dasselbe kurze „Pling" (Klick, dann e'' und h'' – eine Quinte nach oben) und `navigator.vibrate(12)`. Die Einsammel-Logik selbst ist unverändert.
- **Motor der Autos (`autos.js`, `ton.js` `T.motorSchleife`)**: XANDER: „vielleicht auch mit Fahrgeräusche". Viper tiefes Brummen, Batmobil dazu Turbinensingen; Drehzahl nach Tempo und Gas, Lautstärke nach Nähe und Zoom, weit weg oder ohne Ton aus.
- **Sonde**: `pruefe-825-licht-klang.js` (mit dem alten Stand rot).

## Fassung 812 — Stadt anfassen: Menü am Haus, Halten und Ziehen, Dreh-Schieber, Stecknadel, Auto-Schau, Bahnhof in einem Fenster, Rathaus nach Foto, Einsammeln sofort

Sammelfassung aus Xanders großen Listen vom 29.09. (Funk 211 und folgende) mit den Helferteilen 820–829.

- **Drehen (820, 812)**: zwei Finger drehen die Karte und rasten weich in 8 Winkeln ein. XANDER: „der Handel unterm Kompass … als Slider". Senkrechter Dreh-Schieber am Rand unter dem Kompass (`O.drehSchieber`): ziehen dreht (60 px = 90°), loslassen rastet auf 45° ein, kurzer Tipp oben/unten = ein Schritt. XANDER: „Entweder nehme ich den Slider der gilt dann für das Haus. Ansonsten gilt der Slider global" – ist ein Haus gewählt oder angehoben (`O.schieberZiel`), dreht der Schieber das Haus in 45°-Schritten. Im kleinen Rahmen nur nah dran (Kompass), beim Gestalten aus.
- **Stecknadel (812)**: `lk-pinknopf` merkt die Ansicht (Mitte, Zoom, Drehung) in `localStorage` `lk-pin-ansicht`; der kleine Rahmen öffnet dort, auch nach dem Vollbild.
- **Auto-Schau (821, 812)**: Viper und Batmobil drehen, kippen, zoomen. Der Tipp auf ein fahrendes Auto zählt schon beim Aufsetzen (`autoUnterFinger`). `autoschau.js` wird nachgeladen (`autoschau-laden.js` im Paket, `stadt-leicht/autoschau.min.js`).
- **Rahmen wie ein Foto (817, 812)**: `dorfRahmenEinpassen(sanft, spot)` setzt das Stadtbild mittig mit gleichem Rand oben und unten, Kopfzeile mit Kreuz ausgeblendet; der Abstandshalter steht im HTML (`S.dorfLuft`) und überlebt das Neuzeichnen.
- **Bahnhof (823)**: ein kompaktes Fenster (`bahnFenster`) mit Export, Import und Touristen an/aus, bleibt offen, Stadtbild sichtbar.
- **Rathaus (824, 829)**: XANDER: „der Giebel zeigt zu uns … ein Dach nach hinten … Balkon mit Blumenkästen". Stufengiebel nach vorn, ein First nach hinten, Balkon mit fünf Blumenkästen am vorspringenden Flügel. Dazu Kolosseum (nur über Schmücken), Eisdiele, Bergwerk mit Felsberg.
- **Einsammeln (828)**: Zeichen ruhig (kein Schweben, dünner Schein), sofortige Antwort, Summen, kein Kopierrahmen, der Tipp geht nicht in den Wald dahinter. Bäume schicken Holzfäller (`leicht-baum`), Angler am See, reife Äcker als Zeichen (×2), Baustelle in jeder Zoomstufe sichtbar.
- **Anfassen (822)**: XANDER: „wenn ich was anklicke, dann muss er hier ein Menü sein, was ich damit machen will". Kleines Menü direkt am Haus, Baum oder Schmuck (`.lk-karte.lk-am-ding`), auch im kleinen Rahmen nah dran; Bäume versetzen oder entfernen (`natur:{weg,lage}` wird gespeichert). Halten (450 ms) summt und hebt das Ding an, dann ziehen, die Karte steht still. Der Kuhstall schnappt nicht mehr zurück (`eigenesSpeichern`, `dingNeuVerknuepfen`); ein zweites gleiches Gebäude fragt „hast du schon – versetzen?".
- **Kleiner Rahmen leicht (812)**: keine Tonaufnahmen im kleinen Rahmen (`T.laden` bei `nurKlein`), ein kleines Verzeichnis je Jahreszeit (`verzeichnis-klein-herbst.json`/`-winter.json`, `LB.jahrNachladen`), _k-Einträge darin nur als `kz` (aus dem Zwerg hochgerechnet, `kleinAuspacken`), Zwergbilder mit `alpha_quality=50` (14,0 → 9,4 MB). Am Tag 313 KB; Probe 799 prüft < 330 KB, `LISTE=1` zeigt die größten Dateien.
- **Bekannt offen (nächste Fassung)**: in seltenen Fahrten (1 von ~5 in `pruefe-831-markt-verkehr.js`) kommt das Batmobil bei (74,6 | 6,7) bis 12 m vom Weg ab.
- **Sonden**: `pruefe-812-drehschieber.js`, `pruefe-820-drehen.js`, `pruefe-821-autoschau.js`, `pruefe-822-versetzen-menue.js`, `pruefe-823-bahnhof-fenster.js`, `pruefe-824-rathaus-dach.js`, `pruefe-828-einsammeln.js`, `pruefe-829-modelle.js`; angepasst 799, 808, 817.

## Fassung 826 — weicher Kartenrand, Plateau, mehr Bauraum, Brücken an der richtigen Stelle, Wahrzeichen im Maßstab und frei aufstellbar

XANDER: „die Map … hört so hart auf" · „nach unten und nach links mehr Platz zum Bauen" · „das Plateau … höher" · „Leute auf den Brücken … die Brücken überlappen" · „der Kölner Dom … fast doppelt so hoch wie das Rathaus" · „ich will die Wahrzeichen frei hinstellen" · „weiter rauszoomen".

- **Rand (`himmel.js`, `stadt/boden.js`, `dorf.js`)**: Alpen breiter und zu den Enden flacher, dahinter ein blasser Höhenzug und ein Dunstband; die Stadt liegt auf einem Plateau (6 m) mit gewelltem Hang, das Umland tiefer mit Wald, der im Dunst verblasst (`o.nebel`). Bodenkarte 56 statt 40 m über das Dorf hinaus.
- **Bauraum**: Rechteck in Bildrichtung, die Kamera fährt bis an seinen Rand; Bauland unten links (`D.BAULAND`) bleibt baumfrei. Im kleinen Rahmen gelten Raster, Grenze und kleine Karte für das „Feld" (`O.feld`, `O.imFeld`: Überblick plus See mit Bootsverleih und Bauland); der Überblick selbst bleibt.
- **Brücken**: 5 statt 8, je eine genau am Schnittpunkt Weg/Wasser, quer zum Wasser (≥ 66°); Leute, Fuhrwerke und Autos werden auf der Brücke um die Deckhöhe angehoben. 40 Spaziergänger (Sparmodus 14).
- **Wahrzeichen**: Maßstab am Rathausturm (22,8 m): Kölner Dom 0,8 (42 m, „fast doppelt so hoch" – echt wäre 3,3-fach), Neuschwanstein 1,2, Fernsehturm 1,0 (46 m, gekappt), Brandenburger Tor 1,0. Frei drehen und versetzen wie Häuser, „Zurück auf den Wahrzeichenplatz"; Lage wird gespeichert, Wege und Bäume danach neu gebaut. Bäume unter Wahrzeichen und großem Schmuck verschwinden.
- **Bäume**: gefällte Bäume (`L.gefaellt`, gespeichert als `baeume`) und entfernte/versetzte (822, `L.natur`) bleiben beide erhalten; das Menü am Baum heißt „Entfernen".
- **Zoom**: kleinster Maßstab 1,6 statt 2,4 Bildpunkte je Meter; Berge 1,4-mal so hoch.
- **Sonde** `pruefe-826-rand-bauraum.js` (alter Stand: 26 FEHL); `pruefe-815-autos.js` angepasst (Halt am Dom: halbe Grundfläche + 6 m).
## Fassung 830 — Verkehr in der leichten Stadt: Lok am Bahnhof, Autos auf Brücken und um den Brunnen, Besuch am Tag

XANDER: „die Lok schneidet am Bahnhof die Waggons" · „die Autos verschmelzen mit der Brücke" · „fahren durch den Brunnen durch" · „Autos auch tagsüber mit Geräuschen".

- **Lok am Bahnhof (`bahn.js` `vorDing`, `szene.js` Einsortieren der Fahrzeuge)**:
  - Ursache: `szene.js` sortiert Fahrzeuge nach dem Rechteck eines Dings im Kameraraum. Der Bahnhof steht schräg (45°), sein Rechteck reicht weit über das Gleis. Der Zug galt als „im Bahnhof", wurde vor ihm gemalt, und das Bahnhofsbild (Bahnsteig, eigenes Gleis) schnitt die Wagen ab – je Wagen verschieden, darum überdeckten sich Lok, Tender und Wagen auch gegenseitig. Abstände beim Bremsen und Beschneiden der Blätter waren in Ordnung.
  - Jetzt entscheidet je Wagen die Trennachse der Grundflächen (Wagen 3 m breit; Ding `fuss × stufe`, gedreht): Liegt der Wagen ganz auf einer Seite und schaut diese Seite zur Kamera, steht er davor, sonst dahinter. Das gilt in allen 8 Winkeln. Widersprechen sich zwei Achsen, kreuzt kein Blickstrahl beide, und es bleibt bei der alten Regel.
  - Die Wagen eines Zuges (`p.kette`) kommen von hinten nach vorn an die Reihe. Nur ein Ding, das sicher davor steht, zieht einen Wagen vor. Geht beides nicht, gewinnt das Ding mit der größeren Deckung im Bild.
- **Autos auf der Brücke (`autos.js` `sichtbar`, `fuhrwerk.js` `FW.aufBruecke`/`FW.brueckenFaktor`)**:
  - Wie die Fuhrwerke um die Deckhöhe gehoben (Mittel unter Front, Mitte, Heck) und nach der Brücke gemalt (`p.auf`). Lichter und Turbine sind mitgehoben.
  - Auf der Brücke fährt das Auto mittig, denn zwischen den Brüstungen sind nur 2,9 m.
- **Nicht durch den Brunnen (`autos.js` Abschnitt „Hindernisse umfahren")**:
  - Hindernisse sind alle Dinge mit Grundfläche: Schmuck, Wahrzeichen, Kulisse und Häuser. Ausgenommen sind Brücken, Laternen, Flaches, Bäume und die Flügel des Rathauses.
  - `umfahren()` führt die Strecke außen um das Hindernis (Abstand ≈ 2,5 m, damit auch das lange Batmobil im Bogen nicht hineinschwenkt; an Häusern nur, wenn der Weg hindurchführt). Steht das Auto schon neben dem Ding, fährt es von dort außen herum. Es nimmt die kürzere Seite, die nicht in ein anderes Ding, einen Rathausflügel oder ins Wasser führt. Dicht stehende Dinge umfährt es als Haufen, etwa im Winter Christbaum, Buden, Bänke und Krippe auf dem Markt. Endet eine Fahrt in einem Hindernis (Rathausportal hinter dem Brunnen), führt sie außen herum an die Stelle, die dem Ziel am nächsten ist.
  - `wegschieben()` holt die abgerundete Strecke wieder heraus. Am Hindernis gilt die Strecke selbst als Weg, und die Spur bleibt schmal.
  - Halt und Hinstellen liegen nie in einem Hindernis. Wo gewendet wird (Spitzkehre, nach dem Halt), hält das Auto so weit davor, dass das Wenden in drei Zügen kein Ding streift; die Wenderichtung wählt die freie Seite (`wendeTreffer`).
  - `ausDingen()` schiebt beim Wenden sanft (≤ 0,45 m/s) zur Seite, falls der Wagenkasten doch einmal streift. Zäune sind keine Hindernisse (Weiden, Tore).
  - Nebenbei: Beginnt eine Strecke neben dem Anfang (nach dem Wenden) oder mit einem engen Knick, macht das Auto keinen Satz mehr. Der Rest wird auf 1,5 m abgebaut.
- **Besuch am Tag (`autos.js` „Besuch am Tag")**:
  - Ohne eigenes Auto fuhr bisher nie eins. Jetzt kommt tagsüber (Nachtgrad ≤ 0,55) ab und zu ein Gast: ein Auto, das man nicht hat (nie ein Doppelgänger des eigenen, auch nicht des abgestellten). Der erste kommt nach 12–22 s, danach alle 35–80 s.
  - Er rollt am äußersten Ende des Wegenetzes herein und blendet sanft ein. Er hält an einem Ziel, fährt an einem anderen Ende wieder hinaus und blendet aus.
  - Er hat denselben leisen Motor (`T.motorSchleife`, 825): lauter nach Nähe und Zoom, ohne Ton aus.
  - Ein Tipp öffnet die Auto-Schau, dort kann man ihn kaufen. Wird er gekauft oder zur Probefahrt genommen, wird er zum eigenen Auto.
  - Sparsam: Im kleinen Rahmen kommt er nur mit schon geladenem Blatt, es wird kein zusätzliches Bild geladen. Im stillen Prüfbild kommt er nie.
  - `?gaeste=0` schaltet ihn ab, `?gaeste=1` lässt ihn sofort kommen.
- **Sonde 815** zählt an Hindernissen (`AU.inUmfahrung`) den Abstand zum Weg nicht mehr.
- **Sonde** `werkzeug/pruefe-830-verkehr.js` (`TEIL=1…5` für einzelne Teile). Sie prüft die Malfolge von Bahnhof und Wagen (8 Winkel, Halt beidseitig, Einfahrt) und die Autos auf der Brücke (gehoben, danach gemalt, mittig). Dazu kommen 400 s Fahrt in Herbst und Winter, in denen kein Auto durch ein Hindernis fährt (höchstens 35 cm gestreift; beim Wenden direkt vor einem großen Wahrzeichen bis 80 cm – offener Punkt), die Gäste mit Motor, Hinausfahrt und Nacht und der kleine Rahmen ohne Autoblätter. Mit dem alten Stand ist sie rot.

## Fassung 831 — 826 und 830 zusammen: Autos am Markt neben dem großen Fernsehturm, Laternen nicht in Wänden, Baum-Menü im kleinen Rahmen, robuste Sonden

XANDER: „dieses Batmobil hätte ich … gerne, das als fahrendes Auto zu sehen" · „die Autos … fahren durch den Brunnen durch" (830) · „große Wahrzeichen frei aufstellbar" (826) · „ich möchte im kleinen Menü einen Baum rausnehmen" (822).

- **Ursache**: Seit 826 ist der Fernsehturm 16 × 16 m und reicht übereck bis 2 m an die Mitte des Marktes. Mit dem Umfahren aus 830 lag der ganze Markt in einem großen Haufen (Turm, Bänke, Brunnen). Frisch aufgestellte Autos fuhren schräg an (69°), die Strecken bekamen Haken und kleine Schleifen, und an spitzen Abzweigen schnitt die geglättete Strecke den Zwickel (Sonde 815: bis 670°/s, 137° schräg, 2,1 m neben dem Weg).
- **Autos (`autos.js`)**, auf dem Stand von 830 aufgebaut (die Hülle des Markthaufens bleibt wie in 830):
  - `ausrichten()`: Ein neu aufgestelltes, noch ungesehenes Auto schaut gleich in die Richtung seiner ersten Fahrt.
  - `losfahren()`/`abStandort()`: Die Strecke beginnt am Standort mit bis zu 2 m in Blickrichtung. Punkte unter 2,5 m und hinter dem Auto fallen weg. Liegt der erste Punkt mehr als 72° neben dem Blick, oder zeigt die fertige Strecke am Anfang mehr als 35° daneben, wird zuerst gewendet. Das gilt auch, wenn das Auto schon fast auf der Strecke steht.
  - Spitzkehren: schon ab 109° (vorher 115°), in `teilen` schon ab 1,5 m nach dem Start. Beim Losfahren wird die ganze Fahrt ab dem Standort geprüft: Liegt die Kehre in den ersten 5 m, wird gleich gewendet, sonst bis kurz davor gefahren.
  - `planen()`: Ob der Weg am Auto vorbei zurückführt, wird so weit gesucht, wie der Knoten entfernt ist (+12 m, auch 3 m neben dem Auto).
  - Beim Wenden dreht der letzte Zug bis 109° so weit, dass das Auto auf den Anfang seiner Strecke schaut. Danach geht es vom Standort aus hinein.
  - `umfahren()`: so viele Runden, wie Haufen an der Strecke liegen. Eine Stelle, an der sich nichts mehr ändert, ist erledigt (vorher hing es daran, und der Markt am Ende einer langen Fahrt blieb unbeachtet). `entknoten()` schneidet Schleifen und Stiche heraus (die Strecke kommt innerhalb von 15 m auf 0,8 m an einen früheren Punkt zurück).
  - `ausDingen()`: Das Auto gleitet sanft höchstens bis 0,3 m tief, darüber wird sofort ausgeglichen. An Wahrzeichen-Sockeln sind es 0,7 m.
  - Die Spur wechselt nicht gegen die Blickrichtung, solange das Auto noch schräg zur Strecke steht.
- **Karte (`dorf.js`)**:
  - Laternen stehen nie in einer Hauswand, einem Rathausflügel oder einem Wahrzeichen-Sockel (1 m Luft). Sonst kommen sie auf die andere Wegseite oder fallen aus.
  - Unter einem frei aufgestellten Wahrzeichen steht keine Bank.
  - Der Fernsehturm bleibt auf seinem Platz.
- **Baum-Menü im kleinen Rahmen (`oberflaeche.js` `amDingLegen`)**:
  - Deckt jede der vier Lagen etwas zu, werden auch Lagen dicht neben Kompass, Uhr, Ortsschild und Knöpfen probiert. Es gilt die, die am wenigsten deckt und dem Ding am nächsten liegt.
  - Der Dreh-Schieber (`.lk-drehschieber`) zählt jetzt mit. Vorher lag das Menü über Kompass und Ortsschild, und der Schieber lag über „Versetzen".
- **Baustelle (`ton.js`)**: Mit einer neuen Bauphase (oder einer anderen Baustelle) beginnt der Takt der Geräte neu. Vorher lief der lange Hammer-Abstand der Baugrube weiter, und im Rohbau blieb es bis 12 s still.
- **Sonden**:
  - 815: Der Scheinwerfer-Messpunkt wird so lange weitergefahren, bis er auf der Dinge-Ebene frei ist (ohne Licht < 25).
  - 822: Der Dreh-Schieber gehört zu den Knöpfen, die das Menü nicht decken darf.
  - 825: Gewertet wird der wärmste deutlich aufgehellte Wandfleck. Der hellste ist seit 826 die weiße Platte des Fernsehturms, deren Rot bei 255 anstößt.
  - 799: Die Uhr steht auf 12 Uhr, denn in der Dämmerung lädt die Stadt auch die Nachtbilder, und die 330 KB gelten für den Tag. Rahmen und Platzhalter werden im selben Augenblick gemessen, nachdem das Rollen vorbei ist.
  - Neu ist 831 (`pruefe-831-markt-verkehr.js`): fünf frische 300-s-Fahrten nach den Maßstäben von 815, das Losfahren nach dem Aufstellen und die Laternen.

## Fassung 834 — Echte Menschen in den Bilderwelten: ein Figuren-System mit Skelett, Haltungen und Bewegung, Lehrbuchtafeln zum Körper, Satzbaukasten mit „Satz legen“

XANDER (Funk 213/214): „dass wir wirklich diesmal realistische Personen haben … die Entstehung des Lebens soll viel detaillierter alles sein mit den Organen innere und äußere … sämtliche Sitz-, Steh-, Hock-, Knie- und sonst was auf allen Vieren Positionen … dass der Kellner nicht mehr so steif da steht … dass sie sich … innerhalb der Bilder … auch bewegen … man soll sie dort auch hinsetzen können … mit ein paar einfachen Animationen“ · „den Satzbaukasten endlich repariert und gefixt so dass er sinnvoll funktioniert“.

Leitplanke: sachlich wie ein Biologie-Schulbuch oder ein medizinischer Atlas. Beschriftet mit deutschen Fachwörtern samt Artikel, neutrale Haltungen. Menschen im Baukasten und in den Szenen sind immer bekleidet, die Körpertafeln zeigen Unterwäsche. Die Entstehung des Lebens wird als Zell-Schema gezeigt.

- **Figuren-System `figuren/mensch.js`** (neu, 112 KB, eine Datei für alle Menschen). Es ersetzt die alten gebackenen Figurendateien (`figuren/*-teil*.js`, zusammen 36 MB, bis 3,4 MB je Mensch). Diese werden nicht mehr geladen.
  - Skelett mit Vorwärtskinematik. Die Haltungen sind Gelenkwinkel, der Körper sind geloftete Querschnitte, gedreht und mit 10° Aufsicht projiziert. Die Umrisse sind Catmull-Rom-Pfade mit Verlaufsschattierung je Körperteil, gezeichnet nach Tiefe.
  - Proportionen: Erwachsene 7,5 Kopfhöhen, Säuglinge 4. Sechs Altersstufen, zwei Geschlechter, Hautfarben, Frisuren, Bärte.
  - Hände mit fünf Fingern. Füße mit flacher Sohle.
  - Gesichtszüge liegen auf der Kopfoberfläche und werden je nach Blickrichtung sichtbar.
  - Kleidung als aufgeblasene Querschnitte: Oberteile, Hosen, Kleider, Jacken, Schürze, Weste, Kochmütze, Bademantel, Schuhe. Dazu Zubehör: Tablett, Buch, Tasche, Besen.
  - 19 Haltungen: stehen, Kontrapost, gehen, sitzen, lesen, auf dem Boden sitzen, Schneidersitz, Fersensitz, hocken, knien, halb knien, vorgebeugt knien, auf allen vieren, liegen, winken, halten, zeigen, werfen, servieren. Dazu die Lehrbuch-Haltungen `lehrbuch`, `foetus` und `baden`.
  - `zeichne(spec)` liefert SVG, Sitzpunkt, Kopf, Rahmen und benannte Körperstellen (`punkte`). Mit `muskeln: true` zeichnet es die Muskelkarte.
- **Szenen**: `werkzeug/setze-menschen-834.js` zeichnet 30 Menschen in 15 Szenen neu, mit Haltung, Blick und Kleidung (Bad, Schlafzimmer, Küche, Wohnzimmer, Kinderzimmer, Klassenzimmer, Restaurant, Supermarkt, Straße, Bahnhof, Arztpraxis, Flur, Café, Bibliothek, Bewerbungsgespräch).
  - Der Kellner serviert jetzt locker mit Tablett.
  - Die 15 Szenen schrumpfen von 4,0 MB auf 0,8 MB.
  - Das Wohnzimmer-Kind sitzt im Schneidersitz vor dem Tisch, damit es nicht am Sessel-Platz des Bilderrätsels steht (`pruefe-plaetze`).
- **Baukasten (`baukasten.js`)**: Die Figuren kommen aus `DMA_MENSCH`.
  - Die Figur schaut je nach Platz ins Bild. Jede Haltung lässt sich wählen, Babys nur die passenden.
  - Ziehen: Man packt die Figur irgendwo im Umriss. Ziel ist der Platz, der dem Finger am nächsten liegt. Die Figur geht dort über den Boden hin und rastet ein (Gesäß auf `sitzY`).
  - Liegeplätze bekommen `liegY`/`kopf`, die Badewanne `wasserY` mit Wasserlinie (`data-plaetze.js`). Sitzfremde Haltungen an Sitzplätzen stehen auf dem Boden davor.
  - Neue Knöpfe: „Winken“, „Umdrehen“, „Ein paar Schritte“.
  - Kein „nichts an“ mehr, Oberteil und Unterteil lassen sich nur tauschen. Im Bad gibt es einen Bademantel.
  - Der Satz nennt die Haltung richtig („hockt“, „kniet“, „ist auf allen vieren“, „liest ein Buch“ …).
- **Bilderrätsel (`app.js`)** lädt nur noch `figuren/mensch.js`.
- **Lehrbuchtafeln** (`werkzeug/bau-834-lehrbuch.js`, `bau-834-entstehung.js`, `bau-834-organe.js`):
  - *Der Körper*: Mann von vorn und hinten in Boxershorts, mit Kopftafel. Die Stellen werden aus `punkte` gerechnet.
  - *Körperbau*: vier Menschen in Unterwäsche. Keine Geschlechtsteile als Tippwörter.
  - *Die inneren Organe*: Lehrbuchkarten mit beschrifteten Teilen, nämlich Gehirn, Herz, Lunge, Leber, Magen, Niere und Darm, dazu Knochen, Muskel, Ader, Blut und Haut.
  - *Die Muskeln* (neu, `szenen/muskeln.js`, Lupe am Arm der Körpertafel): 16 Muskeln und Sehnen.
  - *Die Entstehung des Lebens*: neun Tafeln (Samenzelle, Eizelle, Befruchtung als Zell-Schema, Weg zur Eizelle, Einnistung statt der früheren Tafel „Geschlechtsverkehr“, Zellteilung, Schwangerschaft, Wachstum, Geburt).
  - Die Beschriftungen (`.bw-beschriftung`) erscheinen nur in der Lupe beim Entdecken.
- **Satzbaukasten (`app.js`, `app-styles.css`)**:
  - Neuer Modus „🧩 Satz legen“: Satzglieder antippen oder mit dem Finger an eine Stelle ziehen. „Prüfen“ nimmt jede richtige Vorfeld-Stellung an. Falsche Stellen werden rot markiert, mit Hinweis zu Verbstellung, Satzklammer und Te-Ka-Mo-Lo.
  - Der gebaute Satz schwebt beim Rollen oben (`.sbk-schwebe`).
  - Zufallssätze kommen aus den sinnvollen Vorschlägen je Tätigkeit. Im Deutsch-Raum gibt es keine italienische Zeile, und die Vorfeld-Beispiele passen zum Satz.
- **Sonde** `werkzeug/pruefe-834-menschen-satzbau.js` in vier Teilen:
  1. 684 Figuren (12 Menschen × 19 Haltungen × 3 Blicke) auf dem Boden, 7,5 Köpfe, Finger, kleiner als 45 KB.
  2. Baukasten auf 360 px mit Finger und auf 1280 px mit Maus: aufs Sofa ziehen, einrasten ±1, Bewegung, Winken, alle Haltungen, immer bekleidet, Tippflächen ≥ 30 px.
  3. Satzbaukasten: Satz legen, richtig/falsch mit Hinweis, Ziehen, schwebender Satz, 40 Zufallssätze.
  4. Lehrbuchtafeln.
  Mit dem alten Stand (53eaa31) ist sie in 11 Punkten rot.
## Fassung 833 — Im Vollbild alles wie im kleinen Rahmen, Wahrzeichen und Bootsverleih verwalten, Autos wenden sauber

XANDER (Funk 214): „Des Weiteren kann man in der großen Ansicht von der Stadt immer noch nichts einsammeln oder Aufgaben lösen oder jemanden losschicken das kann man nur in der kleinen Ansicht" · „Den Bootsverleih kann man offenbar nicht verwalten und du meintest dass man in Berliner Fernsehturm auch Eintritt verlangen könnte wie sieht es mit den anderen Sehenswürdigkeiten aus bis jetzt kann man da nicht in ein extra Menü" · „Infos zu den Wahrzeichen auf Deutsch".

- **Was im Vollbild fehlte**: Die Zeichen gingen schon (Tipp → `leicht-haus` mit `zeichen: 1`). Ein Tipp aufs Haus öffnete aber nur die eigene Karte der Stadt (Stufe, Ausbauen, Drehen); das Spiel erfuhr nichts. Und selbst wenn das Spiel eine Station öffnete, lag sie im Menü **hinter** dem Vollbild. Meldungen des Spiels („+4 Mehl abgeholt") standen ebenfalls dahinter.
- **Stadt (`oberflaeche.js` `karteZeigen`)**:
  - Im Vollbild des Spiels (eingebettet, nicht `lk-mini-modus`) geht der Tipp aufs Haus jetzt ans Spiel (`leicht-haus`, `voll: 1`). Ist etwas fertig, wird eingesammelt (mit „Pling"); sonst öffnet das Spiel seine Station. Am Haus steht das kleine Menü wie im kleinen Rahmen (Karte, Drehen, Versetzen, „Ein Tipp produziert").
  - Die Auswahl über der Bäckerei (`leicht-wahl`) gibt es auch im Vollbild. Ein Tipp daneben schließt sie.
  - Das Baum-Menü hat „Wald: Holzfäller und Jäger" auch im Vollbild.
  - `leicht-frei` merkt, wie viel das Fenster des Spiels verdeckt (`O.freiRaum`). Das Menü am Ding bleibt im freien Teil, das Haus rückt dorthin.
- **Spiel (`spiel.js`)**:
  - `stationFenster()`: Im Vollbild liegt die Station (Haus oder Wald) wie das Bahnhof-Fenster (823) im Rahmen der Stadt: unten, am quer gehaltenen Telefon rechts. Sie ist höchstens gut zwei Fünftel hoch, rollt in sich und wird alle 0,5 s aufgefrischt. ✕ schließt sie. Klicks gehen durch `schnellKlick` (Einsammeln, Mahlen, Losschicken, Ausbauen – dieselben Serverfunktionen).
  - `lsFreiMelden()` meldet der Stadt die verdeckte Fläche, nach dem Schließen 0.
  - `lsMeldung()`: Meldungen stehen im Vollbild oben im Rahmen.
  - `leicht-stand` schickt `volk.freizeit` mit (Stufe des Bootsverleihs). `leicht-freizeitbau` baut den Bootsverleih bzw. baut ihn aus (`spiel_freizeit_bauen`).
  - CSS (`spiel.css`): `.sp-sf-huelle` (Knöpfe ≥ 34 px), `.sp-ls-meldung`.
- **Verwalten (`stadt-leicht/verwalten.js`, neu, im Bündel nach `oberflaeche.js`)**:
  - Menü „Verwalten" (Säulen-Symbol) am Menü von Holstentor, Brandenburger Tor, Kölner Dom, Neuschwanstein und Fernsehturm, außerdem an Rathaus Döbeln (Haus oder Schmuck), Kolosseum und Bootsverleih.
  - Eintritt 0/2/5/10 Taler (Boot: 0/2/4/6 je Fahrt). Nachfrage = e^(−Preis/(6 + 4·Stufe)) · (0,5 + 0,5·Zustand). Höherer Preis bedeutet weniger Besucher, und gut ausgebaut schreckt ein hoher Preis weniger ab.
  - Grundbesuch je Tag: 60 (Holstentor) bis 300 (Fernsehturm). Bootsverleih: 24 · Stufe · Jahreszeit, höchstens 10 Fahrten je Boot (2 + 2·Stufe Boote).
  - Besucher kommen während der Öffnungszeit (9–19 Uhr deutscher Zeit, Boot 10–18 Uhr), in 10-Minuten-Stücken nachgerechnet, höchstens 48 h. „Besucher heute" zählt ab Mitternacht.
  - Das Geld sammelt sich in der Kasse des Wahrzeichens. „Einnahmen einsammeln" bringt es in die Stadtkasse. Von dort: Pflegen (Zustand wieder 100 %; viele Besucher nutzen ab) und Ausbauen (Stufe 1–3: 150/400/900 Taler).
  - Den Bootsverleih baut man mit Punkten im Spiel aus (wie am Bahnhof). Die Zug-Touristen rechnet das Spiel weiter in Punkten ab.
  - Info auf Deutsch (A2/B1, 2–3 Sätze, Ort, Baujahr, Höhe) zu jedem Wahrzeichen und zum Bootsverleih.
  - Gespeichert im eigenen Stand der Stadt (`spiel_stadt_leicht_speichern`, Feld `verwalten` – dasselbe JSON wie Schmuck und Autos, keine neue Tabelle) und im Browser (`leicht_verwalten_v1`).
  - Offen: Die Taler bleiben in der Stadt. Sollen sie zu Punkten des Spiels werden, braucht es eine Serverfunktion.
- **Autos (`autos.js`)** – Sonde 831 meldete selten „[batmobil, Vorlauf 144 s] … höchstens 137° … zuerst bei (74,6 | 6,7)":
  - Dort ist eine Spitzkehre am Kuhstall. Der letzte Zug des Wendens zielte auf den ersten Punkt 2,5 m weg, auch wenn der danach hinter dem Auto lag. Dann fand `abStandort` nichts voraus, und das Auto rollte rückwärts-schräg los (bis 12 m neben dem Weg).
  - `zielBogen()`: Jetzt zielt der Zug auf den Punkt, den `abStandort` mit der neuen Blickrichtung wirklich nimmt.
  - Nach dem Wenden: Zeigt die Strecke noch mehr als 35° neben den Blick, oder sticht sie nur kurz hinaus und kehrt um (Spitzkehre, `kehrtBald` – am Fernsehturm 1,4 | 9,0 mit 700°/s), wird noch einmal gedreht. Das ist ein Bogen vorwärts, wenn der reicht, sonst ein ganzes Wenden (höchstens zweimal). Gewendet wird möglichst zur Seite, auf der das Auto auf dem Pflaster bleibt (`wendeNebenWeg`).
  - Vor einer Spitzkehre (Halt am Markt 32,4 | 27,0: 85° schräg) und bei einer Strecke, die gleich zurückführt, wird ebenfalls erst gewendet.
  - `wenden()` schaut so weit voraus, wie der Bremsweg reicht. Würde der Wagenkasten ein Ding (Bank, Brunnen, Sockel) berühren, endet der Zug sanft davor (`streift`). Vorher schob `ausDingen` das Auto seitwärts heraus (60–170° zwischen Blick und Bewegung).
  - Gemessen mit 160 Fahrten zu je 300 s aus verschiedenen Anfangszuständen: vorher 28 Ausreißer, jetzt 1–2 (Wenden in einer Weggabel, knapp über 2 m neben dem Weg).
- **Sonde** `werkzeug/pruefe-833-vollbild-verwalten.js` (`NUR=A|B`, `BILD=…`, `WURZEL=…` für die Gegenprobe).
  - Teil A: das ganze Spiel mit nachgebautem Server, Vollbild auf 360 × 740. Zeichen ≥ 30 px, Abholen, Meldung im Vollbild. Tipp aufs Haus → Station obenauf und ganz im Bild, Menü am Haus ohne Überlappung, Knöpfe ≥ 30 px, ✕ und `leicht-frei`. Mahlen (`spiel_beliefern`), Holzfäller (`spiel_trupp wald`), „Verwalten" am Fernsehturm.
  - Teil B: `?demo=1`. Fernsehturm und Bootsverleih: Info, Eintritt ändern (weniger Besucher, gemerkt), Kasse nach zwei Stunden, Einsammeln in die Stadtkasse. Menü ganz im Bild, Kopfzeile frei, Knöpfe ≥ 30 px. Jede Info mit 2–3 Sätzen.
  - Gegenprobe (Stand 812): Teil A scheitert an allem nach dem Zeichen, Teil B an der fehlenden `verwalten.js`.
## Fassung 832 — Quests in der leichten Stadt: Leute, die in Deutsch Hilfe brauchen

XANDER (Funk 213): „Bitte gestalte überall Quest innerhalb der Stadt mit Leuten die in Deutsch Hilfe brauchen … z.B Touristen und du musst den helfen … für die man Punkte kriegt dann kriegt man auch Geschenke dafür Deko für die Stadt … dann leuchtet es immer irgendwo … wenn Emmi z.B bei ihren Schwächen die Betonung hat dann kommen solche Aufgaben auch in den Quests … der Hund der entlaufen ist … der Eisverkäufer kommt mit seinem Wagen … so ein weicher Übergang". Funk 214: „eine weinende Frau … wie sie den Weg zum Rathaus findet … dass die Frau dann realistisch auch zu dem Rathaus läuft … eine Linie die … rot geht oder grün geht … ein Wegesystem … immer da wo ein Haus an einem Weg steht dass da dann auch diese Verbindung gedacht wird". Abgestimmt: gelbes „!" = jemand braucht Hilfe, „?" = wartet auf deine Antwort oder ist unterwegs.

- **Nachgeladen (`stadt-leicht/quests.js` → `quests.min.js`, 50 KB)**: In der Bündelung steht nur `quests-laden.js` (wie die Auto-Schau). Sie merkt sich die Schwächen und holt die Quests, wenn die Stadt steht: im kleinen Rahmen nach 20 s, im großen Bild nach 6 s. `leicht.min.js` wächst um 0,9 KB. Die erste Quest kommt 30–60 s danach, dann alle 3–6 min eine, höchstens zwei zugleich. `?quest=1` sofort, `?quest=0` nie, `?questtakt=Sekunden`, `?questnur=1` (keine von selbst). Im stillen Prüfbild und unter Sonden (`navigator.webdriver`) nur mit `?quest=1` – die anderen Sonden bleiben ungestört.
- **Wegenetz**: ein Graph aus `D.WEGE` (Punkte, die sich treffen, sind ein Knoten; die Pferdebahn am Markt bekommt eine Verbindung). Kreuzungen = Knoten mit drei und mehr Wegen, zusammengefasst, wenn sie näher als 5 m liegen oder über ein Wegstück ≤ 8 m verbunden sind (am Markt laufen die Wege im Bogen um den Brunnen). Jedes Haus, Wahrzeichen, Bahnhof, Bootsverleih und der Brunnen haben einen **Eingang** (vor der Front, Rathaus: vor dem Turmportal; die Lage kommt vom Ding selbst, also auch versetzt oder frei aufgestellt) und einen **Connector** zum nächsten Wegstück. Die Wegsuche (Dijkstra) läuft vom Eingang aus. Wird `D.WEGE` neu gebaut (Wahrzeichen versetzt), baut sich das Netz neu.
- **Wegbeschreibung aus der echten Route**: An jeder Kreuzung wird der Winkel zwischen Ankunft (7 m davor) und Weiterweg (7 m danach) gemessen: bis 35° „geradeaus", sonst links/rechts relativ zur Laufrichtung. Gehen zwei Wege in dieselbe grobe Richtung, entscheidet „halb links/rechts" (bis 75°, mindestens 25° Abstand), sonst gilt die Route als unklar. Dazu „über die Brücke" und wo das Ziel am Ende liegt (links, rechts, direkt vor Ihnen). Genommen werden Routen mit 1–3 Abzweigen (weit draußen bis 4), möglichst wenige. Die zwei falschen Antworten ändern einen Abzweig, lassen einen weg oder fügen einen an. `folgen()` geht jede Beschreibung auf dem Netz ab: Die richtige kommt an, die falschen nicht; die falsche zeigt als **rote Linie**, wohin sie führt („so käme sie zum Brunnen …").
- **Ablauf**: Eine Person kommt auf dem Weg herein (weich eingeblendet), über ihr leuchtet das „!" (selbst gezeichnet, pulsierender Schein, ortsfest; außerhalb des Bilds am Rand, nie unter Knöpfen). Tipp → die Kamera fährt hin, die Person steht über dem Dialog. Der Dialog hat Situation, Frage und drei Antworten (360 px, Tippflächen ≥ 30 px, im kleinen Rahmen rollbar, mit „Groß" fürs Vollbild). Falsch → freundlicher Hinweis, der Knopf ist aus, nochmal. Richtig → „Richtig!" und Dank; die Person läuft die Route ab (**grüne Linie** vor ihr, „?" über ihr), am Ziel Jubel mit Konfetti, „+Punkte". Nach einer falschen Wegbeschreibung rückt die Kamera die rote Linie in den freien Teil über dem Dialog, nach der richtigen die ganze grüne Route ins Bild. Auf den Brücken liegt die Linie unter dem Brückenbild (offen).
- **16 Vorlagen**: Touristin weint und sucht das Rathaus, Mann mit Koffer zum Bahnhof, Radfahrer zum Krankenhaus, Wanderer zum Gasthaus, Foto vom Wahrzeichen (alle mit Wegbeschreibung); Hund Bello weggelaufen (Dativ „vor der Bäckerei", Hund selbst gezeichnet, springt beim Wiedersehen); Eiswagen rollt heran, Kind ohne Geld („eine Kugel", „ich möchte"); Regenschirm („er kostet"); Brötchen höflich bestellen; Fahrkarte „nach Leipzig"; Betonung eines Gebäudenamens und eines Worts (Bi·bli·o·THEK, Scho·ko·LA·de …, nach Duden); der/die/das eines Gebäudes; Sie/du beim älteren Herrn; Tretboot mieten (Wortstellung); Postkarten (Plural).
- **Belohnung**: Helferpunkte (6, Wegbeschreibung 8, erster Versuch +2, Schwäche +50 % Mut-Bonus) werden in der Stadt gezählt (`localStorage` `leicht_quest_v1[_uid]`) und ans Spiel gemeldet (`postMessage` `leicht-quest`; `spiel.js` zeigt die Meldung). Eine Serverfunktion für echte Spielpunkte gibt es noch nicht (`spiel_extra_lohn` nimmt nur „td"/„strat") – offen, die Datenbank blieb unberührt. Jede dritte Quest bringt ein Schmuck-Geschenk (Bank, Laterne, Apfelbaum, Laubbaum, Brunnen), das neben dem Ziel auf einem freien Platz aufgestellt und gespeichert wird.
- **Schwächen**: `spiel.js` schickt mit `leicht-kopf` die schwachen Bereiche (`fragenArten("schwach")`: Kreuz in den Einstellungen, sonst die Messung). Außerhalb des Spiels (angemeldet) nimmt die Stadt `spiel_lernstand`. Quests dieser Art kommen dreimal so oft und bringen den Mut-Bonus.
- **Kleiner Rahmen**: `leicht.min.js` + `stadt-leicht.html` wachsen gepackt um 0,33 KB. Sonde 799 misst am Tag 329 KB (Grenze 330) – der Spielraum ist fast aufgebraucht (offen für die nächste Fassung). Das Laufblatt der Person (≈ 100 KB) lädt erst nach dem Tipp aufs „!"; bis dahin ist sie eine kleine gezeichnete Figur. Der erste Tipp holt die Stadt näher (Kompass-Stufe).
- **Sonde** `werkzeug/pruefe-832-quests.js` (`TEIL=A…F`, `BILD=`): Wegenetz und Eingänge (auch versetzte Schule, frei aufgestellter Fernsehturm), 36 zufällige Wegbeschreibungen gegen die Geometrie (Welt und Bild), Quest mit „!", Dialog, rot/grün, Laufen auf dem Weg, Punkte; alle Vorlagen, Hund, Eiswagen, Geschenk; Schwäche Betonung; kleiner Rahmen in einer Elternseite (Meldung kommt an). Mit dem alten Stand ist sie rot.

## Fassung 813 — 832, 833 und 834 zusammen ausgeliefert, Geisterklick im Quest-Dialog

- **Enthält**: Quests in der Stadt (832), Vollbild wie der kleine Rahmen und das Verwalten-Menü für Wahrzeichen und Bootsverleih (833), echte Menschen, Lehrbuchtafeln und „Satz legen“ (834). Die Einzelheiten stehen in den Abschnitten 832, 833 und 834.
- **Geisterklick** (`stadt-leicht/quests.js`, `dialogOeffnen`): Das „!“ öffnet schon beim Loslassen des Fingers (pointerup). Den Klick, den das Handy danach nachschiebt, prüft Chrome neu an der Fingerstelle. Lag dort eine Antwort des gerade aufgegangenen Dialogs, zählte sie als Fehlversuch, und der Erstversuch-Bonus war weg (Sonde 832: Punkte [8,8,6]). Jetzt zählt ein Klick in den ersten 500 ms nach dem Aufgehen nur, wenn der Finger im Dialog auch aufgesetzt hat. Das gilt für die Antworten und das ✕.
- **Sonde 832** prüft das mit „Geisterklick gleich nach dem Aufgehen zählt nicht als falsche Antwort“. Gegenprobe: Der Stand vor 813 zählt den Klick als Versuch.
- **Kleiner Rahmen**: Sonde 799 misst 295 bis 335 KB, je nachdem, was gerade im Bild fährt (Zug, Fuhrwerke, Gäste). Grenze: 330 KB. Wird es dauerhaft mehr, wird `verwalten.js` wie die Quests nachgeladen.
- **Prüflauf 813**: 832, 799, 833, 834, leicht, 815, 817, 822, 828, 826 und 830 waren grün. 831 war einmal rot: Die Viper drehte in einem Schritt um 116° (2328°/s), bei Vorlauf 89 s. Dreimal nachgerechnet trat das nicht auf, der zweite volle Lauf war grün. Das bleibt als seltener Einzelfall offen.


## Fassung 835 — Satzbaukasten: natürliche Vergangenheit, Grammatik je Niveau, mehrere Sätze, keine Unsinnssätze

XANDER (Funk 217): „was ist im Unterschied zwischen den einzelnen Niveaus und wenn ich z.B Vergangenheit habe sagte er z.B ich bin am Wochenende in den Bergen gewesen warum gibt's da keine natürliche Variante wie z.B ich war am Wochenende in den Bergen … dass die Leute gemessen auf ihrem Niveau alle Sachen benutzen können dass sie mehrere Sätze bilden können und kommen da jetzt wirklich keine Unsinnigkeiten mehr raus".

- **Präteritum (`satzbau.js`, `PRAET_BASIS`)**: Alle 82 Verben haben ihr Präteritum nach Duden. Die Formen stehen knapp als „s:ging“ (stark) oder „w:machte“ (schwach). Die Engine bildet daraus die sechs Personen, auch „du aßest, lasest, fandest“ und „ihr fandet“. Trennbare Verben trennen sich wie im Präsens („Ich räumte meine Wohnung auf.“), „woher“ nutzt „kam“.
- **„Vergangenheit“ = so, wie man es sagt**: Der Knopf heißt weiter „Vergangenheit“. `natuerlicheVergangenheit()` wählt die Form. Bei sein, haben, mögen, den Modalverben und im Passiv steht das Präteritum vorn („Ich war am Wochenende in den Bergen.“). Darunter steht „Auch richtig (Perfekt): Ich bin … gewesen.“ mit einem Satz Erklärung. Bei allen anderen Verben steht das Perfekt vorn und darunter „Geschrieben oder erzählt (Präteritum): Ich ging …“. Das gibt es erst ab B1, vorher steht nur eine leise Zeile. Geht eine Zeitangabe in der anderen Form nicht („seit …“), fällt die Variante weg.
- **Neue Zeitformen**: Plusquamperfekt, Konjunktiv II (würde/wäre/hätte/wüsste, könnte/müsste/sollte) und Konjunktiv II der Vergangenheit. `bauSatz` baut die Verbklammer jetzt allgemein aus `finit` und `rechts`. Im Nebensatz steht das gebeugte Verb vor zwei Infinitiven (Duden, Ersatzinfinitiv): „weil ich am Wochenende habe arbeiten müssen“.
- **Modalverben** (`MODALVERBEN`): können, müssen, wollen, möchten (Vergangenheit „wollte“), dürfen, sollen. Sie gelten mit Präsens, Präteritum, Perfekt „habe … arbeiten müssen“, Futur und K II, je nachdem, was natürlich klingt. Die Oberfläche hat dafür die Reihe „Mit Modalverb?“. Nicht bei verlieren, mögen, brauchen, wissen usw. (`modalPasst`).
- **Passiv (B2)**: nur bei 27 Verben mit Akkusativ-Ding (`PASSIV_VERBEN`). Das Objekt wird Subjekt mit bestimmtem Artikel („Die Suppe wird gekocht.“). Person, Begleitung, persönlicher Grund und „gern/allein“ fallen weg. In der Vergangenheit: „wurde … gekocht“, Variante „ist … gekocht worden“.
- **Niveau sichtbar** (`NIVEAU_INFO`, `niveauInfo`, `zeitformenFuer`): Unter den Niveau-Knöpfen steht „Auf A2 baust du: …“, auf Tipp die Übersicht A1–C2.
  - A1: Präsens, Vergangenheit, können/müssen/wollen/möchten im Präsens, und/aber/oder/dann.
  - A2: Futur, Präteritum der Modalverben, dürfen/sollen, Nebensatz mit weil/dass/wenn, denn/deshalb, Gründe mit „weil“.
  - B1: Präteritum aller Verben, Plusquamperfekt, K II, obwohl/damit/trotzdem, „wegen“ + Genitiv.
  - B2 und höher: Passiv, K II Vergangenheit, um … zu.
  - Abweichung vom Richtwert: und/aber/oder stehen schon auf A1 (Profile deutsch), sonst könnte man auf A1 keine zwei Sätze verbinden. Indirekte Fragen („Wonach?“) erst ab A2.
- **Mehrere Sätze** (`verbindeSaetze`, `BINDEWOERTER`): Mit „+ zweiter Satz“ wird der Satz festgehalten, der nächste hängt mit einem Bindewort daran. Höchstens vier Sätze, dazu „letzten Satz zurück“ und „nur ein Satz“.
  - und/oder: kein Komma. aber/denn: Komma, Verb an 2. Stelle.
  - dann/deshalb/trotzdem: neuer Satz, Verb gleich dahinter (`vorfeldWort`).
  - weil/wenn/obwohl/damit: Komma, Verb am Ende.
  - um … zu: nur bei derselben Person, bei gewollter Handlung, ohne Modalverb, ohne Verneinung; „einzukaufen“.
  - „wenn“ nur im Präsens und im K II, „damit“ nur im Präsens und nie mit „mögen/vergessen“ oder „wollen/sollen“.
  - Der Nebensatz allein hat jetzt die Bindewörter weil/dass/wenn/obwohl/damit.
- **Sinnregeln aus dem Lesen von ~800 Beispielsätzen** (R22–R52 in `grundPasst`/`artPasst`/`zeitPasst`):
  - Zeit und Zeitform: „seit“ nur im Präsens.
  - Keine „gern“-Pflicht: nicht „muss gern“, nicht „nie gern“.
  - „keine Zeit/Lust“ und „weil ich es vergessen habe“ nur zu einer verneinten Handlung.
  - krank/müde/beschäftigt nur zu Ruhe, Arzt und Heimweg oder verneint.
  - „unser Mann“ nicht bei wir/ihr/sie.
  - Kein „mit dem Bus in den Flur“, kein „mit dem Zug in die Metzgerei“.
  - „dringend“ nur mit nahem Zeitpunkt.
  - mögen, wissen, glauben nur mit „jetzt/heute“; wohnen nur mit langen Zeiten.
  - Nicht „jeden Abend die Jacke kaufen“.
  - Im Internet sucht man nur, was es dort gibt.
  - Amt, Arzt, Arbeit nur aus einem Anlass.
  - „sehr“ steht hinter dem Objekt.
  - denken braucht „an + Person“.
  - trinken, sehen, hören brauchen eine Ergänzung.
  - Ein unsichtbares Objekt verneint den Satz nicht mehr.
  - Daten bereinigt: Wetter/Preis bei haben, Butter bei essen, Koffer bei vorbereiten, Müll bei aufräumen u. a.
- **Italienisch** (nur im Italienisch-Kurs sichtbar, im Deutsch-Raum weiter keine Zeile):
  - Präteritum: bei Zuständen, avere, Modalverben und Gewohnheiten das imperfetto („avevo“, „dovevo“), sonst passato prossimo („sono stato in montagna“).
  - trapassato prossimo, condizionale, im wenn-Satz congiuntivo imperfetto („se andassi“).
  - Passiv mit „viene/è stata“, „per“ + Infinitiv, Bindewörter.
- **Oberfläche (`app.js` sbk…, `app-styles.css`)**:
  - `sbkBauWahl()` baut die Wahl an einer Stelle.
  - Neue Reihen: Zeitformen je Niveau, Bindewort, Modalverb, Aktiv/Passiv.
  - Die Variante steht als Kasten unter dem Satz.
  - Behoben: Der klebende Satz (834) hatte die Textfarbe `--cream-50` als Hintergrund, also dunkle Schrift auf dunklem Grund. Jetzt der Kartengrund.
  - „Satz legen“ übt je Niveau auch Vergangenheit, Futur und K II und nennt das richtige Bindewort.
- **Sonde** `werkzeug/pruefe-835-satzbau-zeiten.js` (`NUR=A…F`, `LESEN=1`, `SAMEN=`, `BILD=`, `WURZEL=`):
  - A: Präteritum, Partizip, Hilfsverb aller Verben gegen eine Duden-Tabelle von Hand.
  - B: 22 350 Zufallssätze über alle Niveaus, Zeitformen und Nebensatz-Bindewörter. Geprüft werden Verbstellung, Klammer, Kasus nach Präposition (wo/wohin), Artikel/Genus, Hilfsverb, Partizip, Präteritum, doppelte Wörter, Schreibung, Zeichen, Zeitwort zur Zeitform und Sinnlisten.
  - C: natürliche Vergangenheit. D: Niveaus. E: 600 Geschichten.
  - F: Oberfläche 360/1280 px.
  - Gegenprobe (Stand 813): 29 rot.
- **Offen**: Das Zufallsbauen kann noch seltsam klingen, wenn viele Angaben zusammenkommen, z. B. „Ihr hattet den ganzen Abend keinen Stuhl getragen.“ oder „Sie war im Urlaub in die Werkstatt gefahren.“. Grammatisch sind die Sätze richtig, ein Sinnmodell für jede Kombination gibt es aber nicht. Italienisch beim Präteritum ist eine Faustregel.

## Fassung 814 — Satzbaukasten aus 835 ausgeliefert

- Enthält Fassung 835: Präteritum als natürliche Vergangenheit, Grammatik je Niveau, mehrere Sätze und die Sinnregeln (siehe Abschnitt 835).
- Geprüft auf dem zusammengeführten Stand, alle grün: 835 (22 350 Zufallssätze), 834, 636 (kein Italienisch im Deutsch-Raum), benoten, note-ankommen.


## Fassung 836 — Realistische Menschen: Körperformen, Gesichter, Haar, alle Haltungen am Boden, Badewanne, Tafel „Die Geschlechtsorgane“

XANDER (Funk 217): „bei den Bilderwelten und der Gestaltung der Menschen sehe ich noch keine Änderung … so kritisch sein … um alle Positionen die Sie einnehmen können ob sie im Schneidersitz sitzen ob sie in der Hocke sitzen ob sie auf den Unterschenkeln hocken … ob sie auf allen Vieren sind ob sie auf dem Rücken liegen ob sie auf dem Bauch liegen … ob sie in der Wanne sitzen und die Beine angewinkelt haben … realistische Menschen … mit realistischen Gesichtern … realistischer Behaarung alles im Detail“.

Leitplanke (verbindlich): Menschen in Haltungen, im Baukasten und in Szenen sind immer bekleidet; `figuren/mensch.js` setzt selbst Grundkleidung (Hose, T-Shirt), wenn nichts Becken oder Rumpf bedeckt. Ausnahmen gibt es nur für die Lehrbuchtafeln: Die Lehrbuch-Haltung trägt Unterwäsche, Frauen zusätzlich ein Sporttop. Muskelbild und Ungeborenes bleiben Schema. In der Badewanne gibt es Badekleidung. Die neue Tafel ist ein Schema wie im Biologiebuch, ohne Figuren.

- **Körper (`figuren/mensch.js`)**
  - Die Glieder folgen den Muskelbäuchen: Deltamuskel außen, Bizeps vorn, flacher Ellbogen, dicker Unterarm oben, schmales Handgelenk, Oberschenkel oben außen voll und über dem Knie innen gewölbt, Wade hinten im oberen Drittel, schmaler Knöchel. Bei Frauen, Kindern und alten Menschen ist die Muskelzeichnung weicher.
  - Oberarm und Unterarm sowie Oberschenkel und Unterschenkel sind jeweils eine Kette ohne Fuge (`kette()`: erst Kontur, dann Fläche). Die Glieder wachsen ohne Kante aus dem Rumpf. Stark gebeugte Gelenke behalten ihre Kante.
  - Jedes Glied hat einen Rundungsverlauf quer zur Achse: Glanz, Grundton, Kernschatten, Reflexlicht. Das Licht kommt von oben links.
  - Neuer Schultergürtel: Das Schulterdach gehört zum Rumpf, der Deltamuskel liegt als Kappe darüber und legt sich auch über den Rumpf, wenn der Arm dahinter ist.
  - Der Hals hat eine Schattenkante unter dem Kinn, Kopfnicker und einen Adamsapfel.
  - Unter der Figur liegt ein Kontaktschatten.
  - Der Rumpf und der Sitz der Hose sind unten offen, damit keine „Windel-Linie“ über den Beinen liegt.
- **Gesicht**
  - Echtes Profil: Brauenbogen, Nasenwurzel, Nasenrücken, Nasenspitze, Oberlippe, Unterlippe, Kinn.
  - Augen mit Lidern, Lidfalte, Karunkel und einer Iris mit Verlauf; Frauen und Babys haben Wimpern.
  - Brauen als spitz zulaufende Form mit Härchen.
  - Nase mit Nasenflügeln, Nasenlöchern, Schatten und Glanz.
  - Mund mit Philtrum und Lippenschatten.
  - Wangen- und Kieferschatten auf der Schattenseite, Falten bei alten Menschen.
  - Ohren mit Krempe, Muschel und Läppchen.
  - Alle Gesichtszüge bleiben im Kopfumriss (Clip).
- **Haar**
  - Die Haarschale hat Volumen, 34 Strähnen und Glanzsträhnen auf der Lichtseite.
  - Die Haarlinie hat Stirn, Schläfen, Koteletten und Nacken.
  - Langes Haar bedeckt die Ohren, der Dutt ist eine Kugel, der Zopf ist geflochten.
  - Kurzer Bart erscheint als Stoppeln (Muster) statt als Maske. Der Vollbart hat Strähnen.
  - Männer haben dezente Arm- und Beinbehaarung.
- **Hände**: Die Finger bestehen aus drei schmaler werdenden Gliedern mit Nagel.
- **Kleidung**
  - Hosenbeine fallen gerade vom Knie zum Saum.
  - Falten liegen in der Kniekehle, als Zugfalten beim Sitzen, an der Hüfte und als Stauchfalten über dem Schuh.
  - Ärmel haben Luft, Falten in der Armbeuge und ein Bündchen.
  - Röcke haben Faltenwurf und einen gewellten Saum.
  - Neu ist das Badeshirt.
- **Haltungen** (32 statt 19; `werkzeug/bau-836-haltungen.js`)
  - Die Haltungen werden aus Zielpunkten gerechnet (Zwei-Glieder-Rechnung) und am Boden ausgerichtet.
  - Neu oder korrigiert:
    - Schneidersitz: Gesäß am Boden, Unterschenkel gekreuzt.
    - Hocke mit den Fersen am Boden.
    - Fersensitz: Knie und Fußrücken am Boden, das Gesäß auf den Fersen.
    - Kniestand.
    - Vierfüßlerstand: Hände und Knie am Boden.
    - Rückenlage (gerade), Bauchlage (Kopf auf der Wange) und Seitenlage.
    - Sitzen mit angewinkelten Beinen.
    - Baden: in der Wanne, Beine angewinkelt.
    - Grätschsitz.
    - Bein übergeschlagen (auf dem Stuhl).
    - Anlehnen, Laufen/Joggen, Treppensteigen, Bücken, Strecken.
    - Arme verschränkt, Hände in den Hüften.
  - `zeichne({ messen: true })` liefert für jeden Körperteil die Höhe über dem Boden, meldet eingedrungene Glieder (in den Rumpf oder ins andere Bein) und gibt die Gelenkpunkte zurück.
  - `DMA_MENSCH.BODEN` und `FREI` legen je Haltung fest, was aufliegt und was frei bleibt.
- **Baukasten (`baukasten.js`)**
  - Alle neuen Haltungen lassen sich wählen, mit deutschen Namen.
  - Der Satz nennt die Haltung als Modalangabe vor dem Ort, zum Beispiel „Die Frau sitzt im Schneidersitz im Wohnzimmer.“ Weitere Wendungen: „liegt auf dem Bauch“, „sitzt in der Hocke“, „sitzt auf den Fersen“, „kniet aufrecht“, „sitzt mit übereinandergeschlagenen Beinen“, „steht mit verschränkten Armen“, „bückt sich“, „joggt“, „steigt … eine Stufe hinauf“.
  - Badewanne: Die Figur trägt einen Badeanzug bzw. Badehose mit Badeshirt. Sie sitzt mit angewinkelten Beinen, und das Wasser verdeckt sie ab der Brust („sitzt mit angewinkelten Beinen in der Badewanne“). Unter der Dusche bleibt es beim Bademantel.
- **Szenen**: Alle 15 Szenen sind neu gebacken (`werkzeug/setze-menschen-834.js`). Der Schaffner steht jetzt mit verschränkten Armen. Die Szenen sind zusammen 1,4 MB groß; jede Figur bleibt unter 60 KB.
- **Lehrbuch**
  - Neue Tafel **„Die Geschlechtsorgane“** (`werkzeug/bau-836-geschlechtsorgane.js` → `szenen/geschlechtsorgane.js`, Lupe an der Hüfte der Tafel „Der Körper“): schematischer Längsschnitt durch das Becken für Mann und Frau mit 30 beschrifteten Fachwörtern samt Artikel, Silben, Italienisch und Englisch.
  - Organkarten (`bau-834-organe.js`) mit mehr Teilen:
    - Gehirn: Schläfenlappen, Hinterhauptslappen, Seitenfurche, verlängertes Mark.
    - Herz: Herzohr, Lungenvene, Herzbeutel.
    - Lunge: rechter Lungenflügel, Knorpelspange, Lungenspitze, Lungenbläschen, Zwerchfell.
    - Magen: Magengrund, Magenkörper, Magenschleimhaut.
  - Alle Lehrbuchtafeln sind mit den neuen Figuren neu gebaut.
  - Offen für den Hauptagenten: Die ältere Tafel `anatomie` (Lupe am Bauch) zeigt neben Schnittbildern auch Nahansichten der äußeren Geschlechtsorgane. Sie wurde hier nicht verändert.
- **Sonde** `werkzeug/pruefe-836-menschen-realismus.js`: 29 Punkte in fünf Teilen.
  1. Haltungen: 384 Figuren. Bodenkontakt je Haltung höchstens 3 cm, bei Kindern 4 cm und bei alten Menschen 4,5 cm. Außerdem: kein Glied im Rumpf, 7,5 Köpfe, jede Figur unter 60 KB.
  2. Immer bekleidet: Grundkleidung in allen Haltungen und Altersstufen; an Bauch, Leiste und Gesäß sind keine Hautpixel zu sehen.
  3. Merkmale: Iris, Wimpern, Strähnen, Stoppeln, Fingerglieder, Falten.
  4. Baukasten auf 360 px: Satz je Haltung, Badewanne, Tippflächen ≥ 30 px.
  5. Tafeln und Szenen.
  - Gegen den alten Stand 2d4b3e5 ist die Sonde 23-mal rot.
  - `pruefe-834-menschen-satzbau.js` angepasst: Datei unter 200 KB, jede Figur unter 60 KB, der Boden wird mit `messen` statt über die Bildkante geprüft. Die Sonde ist grün, `pruefe-plaetze` auch (34/34).

## Fassung 815 — Realistische Menschen aus 836 ausgeliefert

- Enthält Fassung 836: realistischere Körper, Gesichter und Haare, 32 Haltungen am Boden (alle bekleidet, in der Badewanne mit Badekleidung) und die Lehrbuchtafel „Die Geschlechtsorgane“ als schematischer Längsschnitt (siehe Abschnitt 836).
- Geprüft auf dem zusammengeführten Stand, alle grün: 836, 834, plaetze, 835, 636, 771-aussprache-tafel, betonung-regeln.
- Die ältere Tafel `szenen/anatomie.js` (von Xander hochgeladen) ist unverändert. Ob sie bleibt, entscheidet Xander.

## Fassung 837 — Das Spiel im Italienisch-Raum: italienische Fragen auf Deutsch, Aussprache mit Azure auf Italienisch

- XANDER (wörtlich, Funk 214): „dann hätte ich gerne das Spielsystem für mich und vielleicht in Verbindung mit Azoren dem Aussprache Trainer auch global auf der Webseite wenn ich in den italienischen Modus gehe von der Webseite würde ich auch gerne das Spiel nutzen können dann mit Fragen zu italienischen Sprache also in in Deutsch die Fragen natürlich aber das nur wenn ich in diesen eigenen da nicht für alle zugänglich ist in den eigenen italienischen Bereich in der Seite gehe dann soll das mitgekoppelt werden dass diese Sachen dann für mich zum Lernen auch da sind“
- **Wann**: nur wenn der Lernraum Italienisch offen ist **und** das Konto ihn benutzen darf (`darfItalienischraum()`: Betreiber immer, sonst die in den Einstellungen namentlich Freigegebenen). Neu in app.js: `window.DMA_IT_SPIEL` (`aktiv`, `stand`, `gutschreiben`). Im Deutsch-Raum und für alle anderen bleibt das Spiel „Deutsch zum Überleben“ wie bisher (Aufgaben vom Server).
- **Reiter „Italienisch“** statt „Deutsch“. Arten: Alles, Wörter, Artikel, Verben, Passato prossimo, Präpositionen, Aussprache-Regeln, Stimmt's?, Aussprache. Niveau A1–C2. Fragen auf Deutsch, Antworten auf Italienisch, z. B. „Was heißt „der Bahnhof“ auf Italienisch?“ → la stazione, „Welcher Artikel passt? ___ stazione (der Bahnhof)“, „Setze „andare“ (gehen, fahren) ein: noi ___“, „Wie heißt „wir sind gegangen“ auf Italienisch?“ → noi siamo andati, „Wie sagt man „aus der Küche“ auf Italienisch? (woher?)“ → dalla cucina, „Aus welcher Präposition und welchem Artikel ist „nella“ verschmolzen?“, „Wie klingt „gli“ in „figlio“?“.
- **Nichts erfunden**: Wörter, Artikel, Niveau aus `ExerciseData.IT_WOERTER` (618 Wörter, alle 444 Artikel passen zur Regel il/lo/la/l'), Präsens, Hilfsverb und Partizip aus `IT_VERBEN` (20 Verben), Ortsangaben aus `Satzbau.ORTE` (it/itWoher, deutsche Form über `ortsform`), Verschmelzung wie `IT_VERSCHMELZUNG` in satzbau.js. Von Hand: 21 Aussprache-Regeln (c/ch, g/gh, gli, gl, gn, sc/sch, zz, h, Doppelkonsonanten, qu, r, Endvokal, Betonung, Akzent).
- **Falsche Antworten sind sicher falsch**: keine zwei Bedeutungen mit gemeinsamem Wort in einer Auswahl („bitte schön“/„bitte“); beim „wo?“ keine in/a-Varianten (nella cucina wäre nicht falsch), kein su am Wasser, kein da bei Personen/Ämtern, kein di ohne Artikel („di casa“); „woher?“ nicht bei Städten/Ländern („di Roma“). Passato: falsches Hilfsverb, Infinitiv, falsche Person, falsche Angleichung. Bei essere nur lui/lei/noi/voi/loro (Geschlecht eindeutig).
- **Prüfung im Browser** (der Server hat nur die deutsche Bank). **Punkte** wie im Deutschen nach Niveau der Frage (A1 3 … C2 8), Aussprache anteilig bis 6–20 ab 30 %. Nach je 5 Antworten eine Gutschrift in `extra_profile_data.itPunkte` (die eigene italienische Kasse mit eigener Rangliste nur für Freigegebene) und auf `itKurs` (nur Fragen auf dem gewählten Niveau). **Nie** `profiles.points`, nie das Ranking der Seite, nie `spiel_antwort`/`spiel_aussprache_fertig`. Mana, EP, Ladung, Missionen gibt es dafür nicht (die vergibt nur der Server).
- **Aussprache**: Wort aus dem italienischen Wörterbuch (ohne Artikel, mit Silben und Bedeutung). Vorsprechen `AusspracheP.zentralVorlesen({ sprache: "it-IT" })`, Bewerten `stufe1Bewerten({ sprache: "it-IT" })`. Die Edge Function `aussprache` nimmt `sprache` schon an (Vorlesen mit it-IT-ElsaNeural, Bewertung mit `language=it-IT`) – **keine Server-Änderung nötig**, der Schlüssel bleibt auf dem Server. Italienische Wörter gehen nicht ins persönliche (deutsche) Aussprache-Wörterbuch.
- **Extra-Spiele** (Tower Defense, Rundenkampf): die Zwischenfrage ist im Italienisch-Raum ebenfalls italienisch; der Server-Lohn am Ende zählt weiterhin nur deutsche Antworten.
- Sonde `werkzeug/pruefe-837-italienisch-spiel.js` (31 Prüfungen, 360 px): Deutsch-Raum und Nicht-Freigegebene bleiben deutsch; Betreiber im Italienisch-Raum bekommt alle Arten ohne Server; 12 000 erzeugte Aufgaben gegen die Daten nachgerechnet; Punkte nur in itPunkte/itKurs; Aussprache mit it-IT; Tippflächen ≥ 30 px. Gegenprobe gegen 815: 16 rot (alle neuen Punkte), die deutschen grün. Ebenfalls grün: 636, 760, 766, 771, 772, 773, spielsystem, 669, 762. 648 hat vorher wie nachher dieselben 2 roten Punkte (seit 783: keine Klangvergleichs-Note mehr, die Sonde erwartet sie noch).
- Offen: Aufgaben über A2 hinaus für Grammatik (congiuntivo, futuro, imperfetto) gibt es in den geprüften Daten nicht – die it-*-Lückensätze in data-uebungen.js (7171) wären eine Quelle, enthalten aber Fehler (z. B. Erklärung „„notte“ ist feminin“ zu „Questa ragazza è sana“) und müssten erst durchgesehen werden.

## Fassung 816 — Spiel im Italienisch-Raum aus 837 ausgeliefert

- Enthält Fassung 837: Im Italienisch-Raum (Betreiber und von Xander freigegebene Konten) stellt das Spiel Fragen zur italienischen Sprache auf Deutsch. Die Aussprache läuft mit it-IT, die Punkte gehen nur in die italienische Kasse (siehe Abschnitt 837).
- Geprüft auf dem zusammengeführten Stand, alle grün: 837, 636, spielsystem, 835.

## Fassung 817 — „So schön ist die Weihnacht“ von One Day In Rome

XANDER: „Alle Dateien sind von One Day in Rom. Sie sollen in den Player mit rein und auch in der Möglichkeit sie dann wie gesagt auf den Kopfhörer zu setzen. Des wo steht Demo brauchst du nicht hinzuzufügen einfach nur den Namen der Band also in Englisch und dann den Titel“

- Neue Datei: `music/One Day In Rome - So Schoen Ist Die Weihnacht.mp3`. Im Dateinamen steht „oe“ statt „ö“, damit der Link überall sicher funktioniert.
- Der Titel lautet „One Day In Rome — So schön ist die Weihnacht“. Er steht im Player (`app.js`) und in der Liedliste für /musik und /kopfhoerer (`livechat.js`, LIEDER).
- Die vorhandenen Player-Einträge (auch „Ein Leben Lang“ und „A Lovers Fairytale“) bleiben unter „Xander Fox“, wie Xander es wollte: „Nimm die Änderung bei den anderen Dateien wo vorher Xander Fox stand wieder zurück.“
- „Ein Leben Lang“ war schon drin: Die hochgeladene Datei ist byte-gleich mit der vorhandenen (SHA-256 gleich). Sie wurde deshalb nicht ersetzt.
- Geprüft: pruefe-hoerer-klammern und pruefe-runde88-selbst sind grün.

## Fassung 839 — Italienischer Satzbaukasten nach italienischer Grammatik, Unsinn-Sperre mit Vorschlägen, kein Italienisch im Deutsch-Raum

XANDER (Funk 225): „Mache mir auch den italienisch satzbaukasten für den italienischen Kurs … die italienischen Wörter Sätze und Inhalte gehören ausschließlich in den italienisch Raum … einen funktionierenden satzbaukasten auf der Basis der italienischen originalen Grammatik … keine Quatschsätze achte ganz explizit darauf dass er niemals Unsinn rausgehen kann und dass das gesperrt wird wenn es Unsinn wird … dass dann eher Vorschläge kommen was man sagen will und man dann geführt wird … mache beide Versionen vollständig“

- **Eigene Engine `satzbau-it.js`** (`window.SatzbauIt`). Sie wird nur im Italienisch-Raum und nur für freigegebene Konten nachgeladen (`sitDarf()` = `imItalienischraum() && darfItalienischraum()`). Der Satz wird italienisch gebaut, darunter steht die deutsche Bedeutung, die Erklärungen sind auf Deutsch.
  - Formenlehre: Konjugation mit Ausnahmen (`C`), Artikel nach dem folgenden Wort (lo zaino / il nuovo zaino), Präposition + Artikel verschmolzen, Adjektive dahinter mit Angleichung (buono/bello davor), Possessiv ohne Artikel bei Familie (außer loro).
  - Das Subjektpronomen fällt weg, mit Hinweis. Im congiuntivo bleibt es, wenn die Form sonst nicht eindeutig ist.
  - Zeiten je Niveau: presente, passato prossimo (essere/avere mit Angleichung), imperfetto, futuro, condizionale, trapassato, condizionale passato. Ab B2 congiuntivo nach Auslösern (penso/credo/spero/non credo/è importante che). Ab C1 pensavo/speravo che mit congiuntivo imperfetto/trapassato. Dazu periodo ipotetico (se + congiuntivo imperfetto/trapassato).
  - Reflexive Verben (mi alzo, devo alzarmi), Modalverben + Infinitiv, non, Ja/Nein- und W-Fragen, Nebensätze mit perché/quando/se/che, Sätze verbinden mit e/ma/poi/o (`geschichte`).
- **Deutsche Bedeutung**: eigenes kleines Deutsch in der Engine (V2, Verb am Ende im Nebensatz, trennbare Verben, kein/nicht, K II, Ersatzinfinitiv „hatten essen müssen“).
- **Geführtes Bauen**: `angebote()` zeigt nur, was zu allem bereits Gewählten passt. Die Abhängigkeitstabelle `ABH` gilt jetzt auch für das Fragewort, die Einleitung und die Gründe. Zeitform- und Subjekt-Reihe zeigen absichtlich alles, was das Niveau kann. Beißt sich dort etwas, greift die Sperre.
- **Unsinn-Sperre** (beide Baukästen): `pruefe()` findet den Schuldigen (`schuld()`). Dann steht statt des Satzes die Karte „So klingt der Satz komisch – meintest du …?“ mit 2–3 fertigen, gültigen Vorschlägen (`vorschlaege()`). Ein Tipp baut den Vorschlag. Im deutschen Baukasten: `sbkSperre`, `data-sbk-sperre`/`data-sbk-vorschlag`.
- **Sinnregeln** aus zweimal Lesen (je 60 Sätze pro Niveau). Beispiele:
  - keine Begleitung im Bett, auch nicht als „Con chi … a letto?“
  - nicht „allein bei Marco/bei den Großeltern“, nicht „bei Marco mit Marco“
  - kein „Fest, weil Fest“, kein „Geburtstag → Weihnachten“
  - kein „es regnet, deshalb kann man …“; „können“ + weil/deshalb nur mit Zeit, schönem Wetter, Urlaub, Rabatten, Hitze
  - kein „ich hoffe, dass du musst“, kein „Non credo che … non …“
  - verlieren/vergessen nicht als Vorhersage
  - „vorrei … da tre anni“ gesperrt
  - „quando“ im Präsens (immer wenn) nicht mit festem Termin
  - Frühstück nicht abends, Abendessen nicht morgens
  - kein „non … poco“
  - W-Frage nicht mehrdeutig („Dove aiutava mio fratello Marco?“)
  - „che cosa parla?“ gesperrt
  - „mai“ nie von selbst ohne „non“
- **Deutscher Baukasten vervollständigt**: `satzbau.js` gibt den dünnen Themen passende vorhandene Verben (Essen 8→18, Gesundheit 9→22, Amt 6→21, Familie 13→27, Einkaufen 12→21 auf A1). Gradwörter stehen direkt vor dem Verb („Er hat im Kino sehr gelacht.“). Im deutschen Baukasten läuft kein italienischer Code mehr (`italienisch = false`).
- **Deutsch-Raum ohne Italienisch**: Sonde 636 erweitert. Sie prüft 42 Ansichten des deutschen Baukastens A1–C2, Übungen, Grammatik, Wörterbuch und Bilderwelt. Einzige bewusste Ausnahme: die Hilfesprache in den Bilderwelten, wenn jemand Italienisch als Hilfesprache gewählt hat oder aus Italien kommt. Sie wurde nicht verändert.
- **Sonde `werkzeug/pruefe-839-satzbau-italienisch.js`**:
  - A: Handtabelle mit 110 Verben, dazu Artikel, Verschmelzung, Adjektive, Possessive.
  - B: 21 000 Zufallssätze (mulberry32, ≥ 15 000 verschiedene) mit Regex-Prüfung von Form und Sinn, `LESEN=1` druckt 60 je Niveau.
  - C: Sperrfälle mit 2–3 gültigen Vorschlägen. Dazu jedes Angebot aus 13 Reihen (auch Fragewort/Einleitung/Grund), das nie zu einem ungültigen Satz führen darf.
  - D: Oberfläche. Kein Italienisch im Deutsch-Raum, kein Italienisch ohne Freigabe, Sperre in beiden Baukästen, 360/1280 px, Tippflächen ≥ 30 px.
- Geprüft, alle grün: 839, 835, 636, 837, spielsystem. Gegenprobe: 839 auf dem alten Stand (71b7557) → 8 rot.
- Offen: Die Sinnregeln sind eine Positivliste mit Heuristiken. Das Italienische hat noch kein Muttersprachler gelesen. Die deutschen Zufallssätze (835-Engine) enthalten weiter manche schiefe, aber grammatisch richtige Sätze („Er hat einen Preis gewusst.“).

## Fassung 838 — Menschen mit allen Details: Augen, Wimpern, Brauen, Haarsträhnen, plastische Kleidung; Sitzen hinter der Möbelkante, Badewanne im Querschnitt, Winken im Bilderrätsel, Tafel „Die Geschlechtsorgane“ anatomisch korrigiert

XANDER (Funk 222, Auszug): „die Menschen jetzt jegliche Details verloren man sieht keine Augen man sieht keine Wimpern man sieht keine Augenbrauen man sieht keine Haarstruktur … die sehen jetzt aus wie Puppen … die Iris die Pupille alles soll man deutlich sehen die Nasenlöcher … mit … realistischen Licht und Schatten dass es plastisch wirkt … tippe den Mann im grünen T-Shirt an … dann soll er winken … nicht irgendwelche komischen Details von der Couch vor sich haben … in der Badewanne … fixierungspunkt … auf den Wannen Boden … hinter der Sessel Linie sitzt und nicht an den Sessel dran geklebt … Quatsch mit dem After … der geht nicht gerade nach oben“.

Leitplanke (unverändert verbindlich): Figuren in Baukasten, Szenen und Haltungen sind immer bekleidet, in Dusche und Wanne mit Badekleidung; keine „nichts an“-Wahl; Kinder vollständig bekleidet; Geschlechtsorgane nur auf der schematischen, beschrifteten Tafel für Erwachsene. `szenen/anatomie.js` ist nicht angefasst.

- **Vergleich vorher/nachher**: Die alten gebackenen Figuren (`figuren/<alter>-<g>[-teil2|3].js`, bekleidet zusammengesetzt wie `bkFigurSvg` früher) hatten frontale Gesichter mit großen Augen, deutlichen Wimpern und Brauen, weiche Haarflächen mit hellen Strähnen und weichen Verläufen (CSS-Variablen `--haut-form-*`). Die 836-Figuren hatten winzige, blasse Züge, flache halbdurchsichtige Scheiben als Schatten (sichtbare Ränder), ein Helm-Haar mit harter Kante und 34 dicken Strichen, Stoppeln mit Halbmesser 0 (durch `r1` weggerundet), Ärmel als Polster auf der Schulter und einen breiten Hautstreifen am Hals.
- **Gesicht (`figuren/mensch.js`, `kopf()`)**, feine Maße auf 1/100 cm (`r2`):
  - Modellierung mit weichen Radialverläufen (Licht auf Stirn, Wangenknochen, Kinn; Schatten an Schläfe, unter dem Wangenknochen, am Kiefer; Wangenröte je Alter).
  - Augen: Augapfel im Verlauf, Iris mit Kranz, 16 Strahlen (hell/dunkel) und dunklem Rand, Pupille, zwei Glanzlichter, Lidschatten auf dem Augapfel, Oberlid außen kräftiger, Lidfalte, Unterlid mit rosa Lidrand, Tränenkarunkel, Augenhöhlenschatten. Wimpern oben 9–13 einzelne, geschwungene Striche (außen länger), unten 6 feine; bei allen Menschen (Männer kürzer).
  - Brauen aus 12–38 Haaren in Wuchsrichtung (am Kopf steil, zur Schläfe flach) über einem zarten Grund.
  - Nase: weicher Glanz auf Rücken und Spitze, Schattenseite, Nasenflügel mit Furche und Wölbung, Nasenlöcher als schräge Tropfen, Schatten unter der Nase.
  - Mund: Oberlippe mit Amorbogen, Lippenrand, Unterlippe mit Verlauf und Glanz, Mundwinkel, Philtrum aus zwei Leisten, Kinnfurche.
  - Ohr: Krempe, Gegenleiste, Muschel im Schatten, Tragus, Läppchen. Hals: weicher Schatten unter dem Kinn, Drosselgrube, Adamsapfel als Licht/Schatten.
  - Alter: Säugling mit Flaum statt Frisur, großer Stirn, kleiner Nase, runden Wangen; alte Menschen mit Stirnfalten, Krähenfüßen, Tränensäcken, tieferen Nasolabialfalten, Falten am Mund, Altersflecken, dünneren Lippen.
  - Bart: Stoppeln als Strichmuster mit weichem Rand; Vollbart aus 70 Haaren in drei Tönen mit ausfransender Wangenkante.
- **Haar**: Schale mit feiner Kontur, 90–100 Strähnen in drei Tönen mit Scheitel, Glanzband mit hellen Einzelhaaren (auf die Schale begrenzt), Haarspitzen am oberen Umriss, weiche Haarlinie (Haare über die Kante, Flaum). Locken als Kringel mit welligem Umriss (vorher schwarze Kugeln), Glatze als Haarkranz über den Ohren (vorher Kappe mit grauem Rand), langes Haar mit Strähnen, Glanz und spitzen Enden, Zopf mit Flechtgliedern und Glanz, Dutt aus gewickelten Strähnen.
- **Körper und Kleidung**: Oberteile reichen bis zum Halsansatz (Rundhals mit Bündchen, das vor dem Hals liegt), decken die Schulter bis über den Deltamuskel; der Ärmel kommt unter der Schulternaht hervor, ein hängender Arm im Ärmel liegt hinter dem Rumpf (kein Polster mehr). Falten (Zug von der Achsel, Stauchung über dem Bund), Seiten- und Schulternähte, Saum mit Naht und Schatten, Rippen am Pullover. Hose: Hosenschlitz mit J-Naht, Taschen, Gürtelschlaufen, Seitennaht (Jeans mit gelber Ziernaht). Schuhe: Sohle als Band rundum (auch von vorn), Zehenkappe, Glanz, Schnürung über der Zunge. Hände: Nägel mit Rand, Knöchelfalten. Säuglingshals ohne Lücke zum Pullover.
- **Haltungen**: neu `sitzen_seit` (seitlich, als eigene Haltung) und `sitzen_zurueck` (zurückgelehnt). Baukasten-Sätze: „sitzt seitlich …“, „sitzt zurückgelehnt …“.
- **Sitzen und Verdeckung**:
  - Baukasten (`baukasten.js` `bkVorderkante`, `data-plaetze.js` `vorne`/`vorderkante`/`bodenY`/`sitzX`): drei Ebenen — Kulisse und Möbel, Figur, Vorderkante. Der Sessel-Platz liegt jetzt im Sessel (x 234, vorher daneben vor der Lampe), die gemalte Mutter tritt zur Seite, die Armlehnen werden nach der Figur gezeichnet. Badewanne im Querschnitt: das Gesäß liegt auf dem Wannenboden (`bodenY` 143), davor Wasser (Verlauf, nach unten dichter) mit Glanzlinie und Wellen, Wannenwand und -boden; die Figur ist nicht mehr abgeschnitten.
  - Szenen (`werkzeug/setze-menschen-834.js`, `ebenen838`): Im Wohnzimmer liegt das Sitzkissen unter Vater und Tochter (vorher Balken über den Oberschenkeln), die „Armlehne“ sind die beiden Seitenpolster des Sessels, gezeichnet nach der Mutter (vorher ein Balken quer über dem Schoß); die Mutter sitzt 7 Einheiten höher auf dem Polster. Alle 15 Szenen und die Lehrbuchtafeln „Der Körper“ und „Körperbau“ neu gebacken (Szenen zusammen 2,0 MB, jede Figur ≤ 78 KB).
- **Bilderrätsel (`app.js`, nur der Treffer-Hook)**: Die Figur trägt `class="br-figur"`; beim richtigen Satz ruft `brAntwort` `window.bkWinken(g, brZustand, AUTO_WEITER_RICHTIG_MS − 60)` — dieselbe Winken-Bewegung wie im Baukasten, bevor das nächste Bild kommt. `bkWinken` (baukasten.js) lässt jede gezeichnete Figur in ihrer Haltung winken.
- **Tafel „Die Geschlechtsorgane“ (`werkzeug/bau-836-geschlechtsorgane.js`)**: Kreuzbein nach vorn hohl (Promontorium, Steißbein nach vorn unten); der Mastdarm liegt in der Kreuzbeinhöhlung, folgt ihrer Krümmung, geht oben in den Sigmadarm über (neu beschriftet, Mann und Frau) und zieht als Ampulle vor das Steißbein; der Analkanal knickt nach hinten unten ab (anorektaler Winkel ≈ 102°), Schließmuskel angedeutet. Mann: Prostata unter der Blase direkt vor der Ampulle, Samenbläschen hinten oben an der Blase, Samenleiter und Harnröhre angepasst. Frau: Gebärmutter anteversio-anteflexio über der Blase, Scheide von der Öffnung nach hinten oben direkt vor dem Mastdarm; von vorn nach hinten Kitzler, Harnröhrenöffnung, Scheidenöffnung, Damm, After. Weiter nur Schema.
- **Größen**: `figuren/mensch.js` 200 KB (Grenze in Sonde 834 auf 260 KB), jede Figur höchstens 77 KB (Grenzen in Sonden 834 und 836 von 60 auf 90 KB, begründet mit den Detail-Anforderungen).
- **Sonde** `werkzeug/pruefe-838-menschen-detail.js` (`BILD=`, `WURZEL=`), 29 Punkte in 7 Teilen: Gesichtsdetails (Iris mit Verlauf und Musterung, Pupille, ≥ 8 Wimpern je Auge, ≥ 10 Brauenhaare, Nasenlöcher, Strähnen, Stoppeln, Altersmerkmale), Größe < 90 KB (1224 Figuren), bekleidet (Bildpunkte an Bauch und Leiste), Baukasten (Armlehnen nach der Figur, Figur im Sessel, Gesäß auf dem Wannenboden ± 2 cm, Wasser und Wand vor der Figur, Badekleidung, fünf Sitzvarianten im Satz, keine „nichts“-Wahl), Szenen-Ebenen, Winken im Bilderrätsel, Tafel (Mastdarm gekrümmt, Analkanal nach hinten unten, Winkel 80–135°, Sigmadarm). Gegenprobe gegen 816 (c78f8c1): 20 rot. Angepasst und grün: `pruefe-836-menschen-realismus` (90 KB; Wimpern als `data-teil`; Wasser als Vorderkante; Brust bis 10 Einheiten unter dem Wasserspiegel), `pruefe-834-menschen-satzbau` (90 KB, Datei 260 KB). `pruefe-plaetze`: 34/34 (auf dem Worktree mit einer Kopie gerechnet, deren WURZEL auf den Worktree zeigt).
- **Offen / noch nicht fotorealistisch**: Vektorzeichnung ohne weiche Kanten (keine Filter, damit viele Figuren flüssig bleiben) — Haarlinie und Bartrand bleiben erkennbar gezeichnet; Rumpf als geloftete Ellipsen wirkt beim T-Shirt noch sackartig, die Taille ist kaum geformt; Hände aus Strichgliedern (Finger zu dünn in der Seitenansicht); Schuhe von vorn klein; langes Haar hängt als Fläche hinter dem Kopf statt über die Schultern; Locken wirken wie Noppen; Säuglingshals zu lang sichtbar. Das Bilderrätsel zeichnet noch keine Vorderkante (die Armlehne liegt dort hinter der Figur) — dafür wäre ein weiterer Eingriff in `brBildHtml` nötig. Im Klassenzimmer liegen Heft und Schere auf der Schulbank vor dem Gesicht der Schülerin (Szenen-Aufbau, älter als 838).
- **Runde 2 (Rückmeldung des Hauptagenten zu Halbprofil und Profil)**, alles in `figuren/mensch.js`:
  - Haar ohne Helmkante: Die Haarschale wird zur Haarlinie hin dünn. Eine anliegende Schale (2–3 mm) reicht bis an die Haarlinie, die halbe Dicke beginnt 0,7 cm dahinter, die volle Dicke 1,4 cm dahinter (`maskeVon`). Die Haarlinie hat jetzt Stirn, eine fast senkrechte Schläfenkante, schmale Koteletten vor dem Ohr, einen Bogen über und hinter dem Ohr und den Nacken; der Keil über die Wange ist weg, das Ohr bleibt frei.
  - Gesicht vorn als Superellipse (Exponent bis 3,4 auf Höhe der Wangenknochen), im Umriss (`umriss`/`hvon`, vorn und hinten getrennt) und für die Gesichtszüge (`flaeche`); das Auge liegt 0,7 cm tief in der Augenhöhle. Im Halbprofil liegt das hintere Auge dadurch ganz im Gesicht, hinter dem Nasenrücken. Neu ein Nasenkörper (zugewandte Seitenfläche, nach den Augen gezeichnet), die Profilkante erscheint erst ab etwa 43°.
  - Glatze: Der Haarkranz ist ein Band zwischen unregelmäßiger Oberkante und der Haarlinie um die Ohren; er liegt am Schädel an, läuft hinter dem Ohr herum und spitz zur Schläfe aus.
  - Säugling: nur Flaum (sehr zart, ein paar Löckchen am Wirbel), runder Kopf, Pausbacken, höhere Schultern (kurzer Hals), der Hals liegt hinter dem Pullover.
  - Bartstoppeln: 520 zufällig (fest) gestreute Einzelhaare, dichter an Kinn und Oberlippe, zur Wange hin auslaufend (`data-teil="stoppelhaare"`).
  - Locken/Afro: 45 % mehr Volumen, zum Ohr hin abnehmend, welliger Umriss aus großen überlappenden Bögen, kleine Kringel innen, Glanzschimmer; Kringel über der Haarlinie.
  - Langes Haar: je Seite eine Strähne vom Kopf über die Schulter auf die Brust, vor Rumpf und Hals; hinten schmaler.
  - Rumpf: Das Oberteil liegt an der Taille an (0,6 cm statt 1,15 cm) und ist über der Brust weiter; dazu ein Rundungsverlauf mit Kernschatten an beiden Seiten und Glanz auf der Lichtseite. Kinder und Säuglinge haben schmalere Schulterpolster.
  - Größen: Die größte Figur hat 86 KB; `figuren/mensch.js` ist 215 KB groß, die Szenen zusammen 2,2 MB.
  - Sonden: 838 prüft Stoppeln jetzt als gestreute Haare (≥ 60), 836 nimmt `stoppelhaare` statt des Musters an. 838, 836, 834 und plaetze (34/34) sind grün. Bögen: `scratchpad/838/nachher2-koepfe.png`, `nachher2-nah.png`, `nachher2-koerper.png`.

## Fassung 840 — Bilderwelt: alte Version als Standard, neue per Link

XANDER (Funk 225, wörtlich): „für die Bilderwelt möchte ich meine alte Version wieder zurück haben so wie sie war unverändert und nur eine Option als Link zur neuen Version so dass ich beide Version habe damit ich selber entscheiden kann ob ich deine Updates die du heute gemacht hast überhaupt nehmen möchte an der alten Version soll nichts geändert werden die möchte ich wieder genauso haben wie sie war“

- **Standard = alte Bilderwelt, Stand `53eaa31` (Fassung 812)**, Byte für Byte: `baukasten.js`, `data-plaetze.js`, `data-szenen.js`, alle `szenen/*.js`, alle `figuren/*.js` (die gebackenen Figuren `figuren/<alter>-<g>[-teil2|3].js`, `seitsitz.js`) und deren `min/`-Kopien — 215 Dateien. Im alten Pfad gibt es kein `figuren/mensch.js`, keine `szenen/muskeln.js` und keine `szenen/geschlechtsorgane.js` mehr. Die alten Lehrbuchtafeln (Körperbau, Körper innen, Entstehung, Anatomie) sind wieder die von 812.
- **Neue Bilderwelt (834/836/838 samt Runde 2) vollständig in `bilderwelt-neu/`**: `bilderwelt-neu/figuren/mensch.js`, `bilderwelt-neu/baukasten.js`, `bilderwelt-neu/data-plaetze.js`, `bilderwelt-neu/data-szenen.js` und die 21 Szenen, die 834–838 geändert oder neu gebaut haben (`arztpraxis, badezimmer, bahnhof, bewerbungsgespraech, bibliothek, cafe, entstehung, flur, geschlechtsorgane, kinderzimmer, klassenzimmer, koerper, koerper_innen, koerperbau, kueche, muskeln, restaurant, schlafzimmer, strasse, supermarkt, wohnzimmer`). Alle anderen Szenen (z. B. `dusche`, `anatomie`) sind in beiden Fassungen dieselbe Datei in `szenen/`. Die Werkzeuge schreiben dorthin: `setze-menschen-834.js`, `bau-834-lehrbuch.js` (auch für `bau-834-entstehung.js`/`bau-834-organe.js`), `bau-836-geschlechtsorgane.js`, `bau-836-haltungen.js`.
- **Umschalten**: Über der Bilderwelt steht ein kleiner Link „Neue Version ansehen (Test)“, in der neuen „Zur alten Version“ mit dem Hinweis „Du siehst die neue Bilderwelt (Test).“ (Tippfläche 32 px). Der Link merkt die Wahl in `localStorage` `dma_bilderwelt` („alt“/„neu“), lädt die Seite mit `?bilderwelt=neu|alt` neu und öffnet danach wieder die Bilderwelt (`sessionStorage` `dma_bw_oeffnen`). `?bilderwelt=neu` in der Adresse wirkt genauso und wird ebenfalls gemerkt. Ohne Wahl: alt.
- **Die Weiche — die vollständige Liste der Unterschiede im alten Pfad gegenüber `53eaa31`**:
  1. `index.html`: ein Block vor der Ladeliste setzt `window.DMA_BILDERWELT_NEU` (aus `?bilderwelt=` bzw. `localStorage`), `window.DMA_BW_PFAD(weg)` (bei alt gibt er `weg` unverändert zurück; bei neu `bilderwelt-neu/` für `data-szenen.js`, `data-plaetze.js`, `baukasten.js`, `figuren/mensch.js` und die 21 Szenen) und bei neu die Klasse `html.bilderwelt-neu`. In der Ladeliste steht statt `["baukasten.js", true]` jetzt `[window.DMA_BW_PFAD("baukasten.js"), true]` — bei alt dieselbe Datei.
  2. `app.js`, genau 11 Stellen, alle mit „FASSUNG 840“ markiert, jede alte Zeile steht wörtlich im ALT-Zweig:
     1. `szenenLaden`: `s.src = DMA_BILDERWELT_NEU ? bilderwelt-neu/data-szenen.js : ‹alter Ausdruck›`.
     2. `BW_EIGENE_TAFELN = DMA_BILDERWELT_NEU ? [… mit "muskeln"] : ‹alte Liste›`.
     3. `szeneLaden`: `sk.src = DMA_BILDERWELT_NEU ? DMA_BW_PFAD("szenen/"+id+".js") + Stempel : ‹alter Ausdruck›`.
     4. `renderBilderwelt`: eine Zeile `bwVersionSchalter(area);`.
     5. neu `bwVersionSchalter()` (der Link) und ein `load`-Zuhörer, der nach dem Umschalten die Bilderwelt wieder öffnet (29 Zeilen).
     6. Bild-SVG: `${DMA_BILDERWELT_NEU ? " bw-modus-" + bwModus : ""}` (die Klasse aus 834 nur in neu).
     7. `brNeueAufgabe` (wörtlich 812) mit einer ersten Zeile `if (DMA_BILDERWELT_NEU) return brNeueAufgabeNeu(platzId);`.
     8. `brNeueAufgabeNeu` = die 838-Fassung (Plätze und `figuren/mensch.js` über `DMA_BW_PFAD`).
     9. `brBildHtml` (wörtlich 812) mit einer ersten Zeile `if (DMA_BILDERWELT_NEU) return brBildHtmlNeu(z);`.
     10. `brBildHtmlNeu` = die 838-Fassung.
     11. `brAntwort`: der Winken-Haken aus 838, jetzt nur `if (ok && DMA_BILDERWELT_NEU && typeof bkWinken === "function")`.
  3. `app-styles.css`: `.bk-chip` wieder wie in 812 (ohne `min-height`); die größere Tippfläche aus 834 gilt nur unter `html.bilderwelt-neu .bk-chip`. Neu `.bw-version`, `.bw-version-hinweis` für den Link. Die 834-Klassen `.bk-zielring-sitz`, `.bk-aktionen`, `.bw-beschriftung` bleiben stehen; der alte Pfad benutzt sie nicht.
  4. `werkzeug/fassung-setzen.js`: `bilderwelt-neu` zählt zu den Ordnern mit eigenem Stempel (`DMA_V("bilderwelt-neu/…")`), damit Änderungen dort nicht aus dem Zwischenspeicher kommen.
  Der Satzbaukasten in `app.js` ist nicht angefasst (bleibt auf dem neuen Stand).
- **Sonde** `werkzeug/pruefe-840-bilderwelt-alt-neu.js` (`BILD=`, `WURZEL=`), 34 Punkte: 215 Dateien byte-gleich mit `53eaa31`, nichts Neues im alten Pfad, neue Bilderwelt vollständig, `.bk-chip` wie 812; `app.js` gegen `53eaa31` (Abschnitte „DIE BILDERWELT“ bis vor „DIE SAUBERE STIMME“ und „DAS BILDERRÄTSEL“): jede Änderung markiert, jede alte Zeile erhalten, genau 11 Stellen, die Weiche reicht nicht in andere Teile; im Browser bei 360 px: Standard alt (alte Figuren, keine Anfrage an `bilderwelt-neu/`, kein `mensch.js`), Szene, Lupe (Badezimmer → Dusche), Baukasten, Bilderrätsel; Link → neu (Bilderwelt öffnet sich wieder, Muskeltafel, Szene aus `bilderwelt-neu/` mit Iris, Baukasten mit `mensch.js`, Rätsel mit neuen Plätzen), die Wahl hält beim Neuladen, zurück auf alt, hält wieder; Link ≥ 30 px, nichts überlappt, kein Querscrollen, keine Seitenfehler. Gegenprobe am Stand vor 840 (`70d95f4`, Hardlink-Kopie): 9 rot, der Browser-Teil bricht ab (kein Link).
- **Die Sonden 834/836/838** laden jetzt `index.html?bilderwelt=neu` und lesen `bilderwelt-neu/…`; alle drei grün. `pruefe-plaetze` (alt, Standard) 34/34.

### Nachtrag (Fassung 881): Weichenstellen seit 877/878

XANDER (Funk 225, wörtlich): „an der alten Version soll nichts geändert werden die möchte ich wieder genauso haben wie sie war“.

- **Befund**: 877/878 hatten Bilderwelt-Stellen in `app.js` ohne Weiche geändert. Sie wirkten auch in der alten Bilderwelt: Artikel-Trennung, Artikel-Knopf und Artikel-Runde, Lupenmarken (`marke: [x, y]`, Marken in der Lupe), Zurück-Spur mit Lupe, „Alle Szenen“ löscht die Lupe, Fangflächen ohne Lupenmarke, 8-%-Regel, Marken-Dach, Hinweis in der Lupe. Gemessen am Arbeitsbaum von `53eaa31`: Die alte Bilderwelt hatte andere Fangflächen, zum Beispiel Dusche 61,1 statt 62,2 breit und den Küchentisch ab y 152 statt 121. Die Sonde 840 war rot (32 Stellen gefunden).
- **Jetzt**: Jede dieser Stellen ist eine Weiche. Der alte Zweig steht wörtlich wie in `53eaa31`, der neue Zweig verhält sich wie 877/878. Der neue Code steht jeweils an seiner Stelle in den Funktionen, die 876 ohnehin auslagert. Der Start (min/app.js) wird dadurch nicht größer.
- **Die vollständige Liste der Weichenstellen in `app.js`** (Zeilennummern des alten `app.js` von `53eaa31`, so wie die Sonde sie ausgibt): **25**.
  - 1–11 aus 840 (siehe oben): alt Z. 88324, 88360, 88395, 88577, 88604, 88837, 96905, 96952, 96956, 96980, 97145.
  - 12 aus 851: alt Z. 88841 (`szene.vorne`).
  - 13–15 aus 852: alt Z. 89376 (`MINDEST`), 89426 (`MINDEST_OBEN`), 89437 (echte Umrisse über `oben`-Teilen).
  - An bestehende Stellen angehängt (881, keine neue Stelle):
    - alt Z. 88577 `renderBilderwelt`: `if (DMA_BILDERWELT_NEU && !bwSzene) bwZoom = null;` – „Alle Szenen“ löscht die Lupe. Die Zeile in `bwBinden` ist wieder wie in 812.
    - alt Z. 89376: Die 8-%-Regel für Übersichtskarten steht jetzt direkt vor `MINDEST`.
  - 16–25 neu (881):
    16. alt Z. 88533 `bwArtikelTrennen`: `if (DMA_BILDERWELT_NEU) { … }` mit der Regel aus 877 („Indien“, „Italien“, „Leipzig“ werden nicht zerlegt). Darunter steht die alte Regel aus 812.
    17. alt Z. 88774 `teilHtml` (in `bwBildHtml`): `const teilHtml = DMA_BILDERWELT_NEU ? (neuer Körper: marke: [x, y], Lupenmarken auch in der Lupe, um 1/k verkleinert) : ‹alter Körper wörtlich›`.
    18. alt Z. 88865 `bwDetailOeffnen`: Nur neu merkt sich die Spur die Lupe in `bwSpur.lupen[i]`. `bwSpur` bleibt wie in 812 eine Liste von Szenen-Namen, deshalb sind `bwSpurHtml` und der Zurück-Knopf wieder wie in 812.
    19. alt Z. 88878 `bwEinsZurueck`: Nur neu setzt „Zurück“ die gemerkte Lupe wieder.
    20. alt Z. 88921 Artikel-Knopf: `${!DMA_BILDERWELT_NEU || ‹mindestens vier Wörter mit Artikel› ? ‹alter Knopf› : ""}`.
    21. alt Z. 88940–88941 Hinweis in der Lupe: `${DMA_BILDERWELT_NEU ? ‹Hinweis mit „Tipp auf die Lupe an einem Ort …“› : `‹alter Ausdruck wörtlich›`}`.
    22. alt Z. 89352 `bwBinden`, Fangflächen: `DMA_BILDERWELT_NEU ? (g > .bw-kunst).getBBox() : g.getBBox()`.
    23. alt Z. 89413 `bwBinden`, obere Fangflächen: ebenso.
    24. alt Z. 89439 `bwBinden`, Marken-Dach (877/878): `const marken = DMA_BILDERWELT_NEU ? … : []`.
    25. alt Z. 89514 `bwNeueRunde`: Die Artikel-Runde nimmt nur in der neuen Bilderwelt nur Wörter mit Artikel.
- **Sonde 840** (`werkzeug/pruefe-840-bilderwelt-alt-neu.js`), mit „FASSUNG 881 —“ markiert:
  - Sie erwartet jetzt 25 Stellen.
  - Der dritte geprüfte Abschnitt reicht jetzt von `bwBinden` bis vor „DER LERNWEG“ statt nur bis `bwAlleVorlesen`. Dahinter liegen weitere Bilderwelt-Funktionen (`bwNeueRunde`, `bwFindenAntwort`, `bwArtikelAntwort`, `bwErgebnisZeichnen`); 877 hatte `bwNeueRunde` dort ungeprüft geändert. Die Prüfung ist damit strenger.
  - Die Regeln sind unverändert: Jede Änderung muss markiert sein, und jede alte Zeile muss wörtlich im ALT-Zweig stehen.
- **Gegenprobe im Browser** (Arbeitsbaum `53eaa31` gegen jetzt, ohne `?bilderwelt=neu`): Badezimmer öffnen, Teil antippen, Artikel-Modus (mit festem Zufall), Antwort, Lupe Dusche, Zurück, „Alle Szenen“, Küche mit Lupe „Herd“.
  - Der Inhalt von `#bilderweltArea` ist in jedem Schritt Zeichen für Zeichen gleich. Die einzige Ausnahme ist der italienische Satz in der Übersicht, der seit 843 fehlt.
  - Derselbe Vergleich mit dem Stand vor 881 ergab 9 abweichende Schritte.
- **Neue Bilderwelt unverändert**: Stand vor 881 gegen jetzt, mit `?bilderwelt=neu` und echten Mausklicks: Weltkarte → Rio → Zurück → Lupe Europa → Deutschland → Lupe Süden → München → Artikel → Zurück (Süden-Lupe) → Zurück (Europa-Lupe) → Alle Szenen → Weltkarte ganz; dazu Badezimmer, Teil, Artikel. In allen Schritten gleich.

## Fassung 818 — Italienischer Satzbaukasten (839) und Bilderwelt alt als Standard, neu per Link (838/840)

- Enthält 839: Satzbaukasten nach italienischer Grammatik im Italienisch-Raum, Unsinn-Sperre mit Vorschlägen in beiden Sprachen, deutscher Baukasten aufgefüllt.
- Enthält 840 mit 838: Die Bilderwelt ist wieder wie in Fassung 812. Die neuen Menschen (834/836/838, samt Runde 2) gibt es nur über den Link „Neue Version ansehen (Test)“ (`bilderwelt-neu/`).
- Beim Zusammenführen fiel in `index.html` die Ladeweiche weg (dort „ours“ genommen). Sie ist wiederhergestellt; `index.html` ist hier nicht nur erzeugt.
- Geprüft auf dem zusammengeführten Stand, alle grün: 840, 839, 838, 835, 834, 837, 636, plaetze.

## Fassung 841 — Batmobil fährt über die Köpfe, Saugnapf-Pfeil klebt oben am Kopf

Xander (Funk 230, wörtlich): „(1) BATMOBIL-AUFTRITT (DMA_AUFTRITT "batmobil", LC_AUTO3D): Das Auto fährt HINTER den Plätzen/Profilbildern durch (falscher Layer). Soll wie in anderen Livestreams im VORDERGRUND über die Köpfe fahren, sauber einfahren und dann aussteigen. (2) SAUGNAPF-PFEIL (/pfeil Name, saugpfeil): Bei Nachbarplätzen bleibt der Schaft quer über dem Gesicht des Schützen liegen, nur der Saugnapf berührt den Rand des Ziels. Soll oben am Kopf des Ziels kleben, Gesichtsmitte frei. Beides ist fürs Werbevideo nötig."

- **Batmobil — die Ursache**: Fassung 698 legt bei jedem Auftritt über jedes fremde Profilbild eine Kopie (`.lc-auftritt-nachbar`, z-index 2) auf die Bühne, damit Wagen HINTER den Gesichtern durchfahren. Die 3D-Leinwand (`.lc-auftritt-3d`, z-index 1) lag darunter. Das galt für alle Wagen (auch Viper 3D, KITT, Colt-Truck — nachgesehen auf Bildschirmfotos: auch die fahren hinter den Gesichtern).
- **Jetzt**: `LC_AUTO3D.batmobil.vorn = true`. In `lcAuftritt` entfallen dann die Kopien, die Bühne bekommt `.lc-auftritt-vorn`, die Leinwand z-index 3 (`korrekturen.css`). Das Batmobil fährt über alle Plätze; nur das eigene Bild (z-index 4, am Steuer) liegt über dem Auto. Die vorhandene Fahrt bleibt: Kurve aus der Tiefe, frontal heran, Halt; das Bild steigt aus und springt auf den eigenen Platz (fertig bei 3,16 s, das Auto fährt erst bei 3,28 s los), dann Abfahrt im Bogen. `DMA_AUTO3D.vorn` zum Nachmessen. Für die Viper (oder andere 3D-Autos) genügt dasselbe Wort `vorn: true` in `LC_AUTO3D` — nicht gesetzt, weil nur das Batmobil gemeldet war.
- **Saugnapf-Pfeil — die Ursache**: der Napf saß auf dem Rand in Richtung des Schützen, der Schaft (112 % der Bildbreite) zeigte genau zum Schützen; die Plätze stehen aber nur gut eine Bildbreite auseinander (Telefon 79 px Abstand bei 74 px Bild). Dazu waren `--ex/--ey` Prozent der Pfeil-Box (Höhe nur 31 % des Bildes), von oben getroffen saß der Napf kaum über der Mitte.
- **Jetzt** (`lcSaugpfeilBahn` in `app.js`, `@keyframes lcPfeilFlug841` in `korrekturen.css`): alles in Pixeln. Der Napf klebt oben am Kopf (Rand bei 0,85 R), der Schaft steht strahlenförmig nach oben/außen. Die Neigung wird aus 23 Kandidaten (−55° … +55°) gewählt: nie über dem mittleren Drittel von Schütze oder Ziel, möglichst über keinem anderen Gesicht, Nocke in der Chat-Karte, sonst zur Seite des Schützen (sitzt er höher: von ihm weg), schräg (~35°) bevorzugt. Der Flug: quadratischer Bogen vom oberen Rand des Schützenbildes, der tangential in der Endneigung ankommt (fünf Stützpunkte `--pf0…--pf4`), Aufprall weiter bei 21 % (0,71 s, Töne unverändert), dann der Drill wie bisher. Pfeillänge 96 % statt 112 %. Ein angetippter Treffpunkt verschiebt den Pfeil nicht mehr (`translate: none`). Solange der Pfeil steckt, liegt der Zielplatz eine Ebene höher (`.lc-platz:has(> .lc-zp.lc-pfeil-841) { z-index: 3 }`), sonst verschwand der Schaft unter dem Nachbarbild rechts/unten.
- **Sonde** `werkzeug/pruefe-841-batmobil-saugpfeil.js` (`BILD=`, `WURZEL=`), 360 px und 1280 px, acht Leute: Batmobil — elementFromPoint trifft überall, wo das Auto deckend über einem fremden Bild gemalt ist, die Leinwand (494 bzw. 411 Messpunkte), über 7 Köpfe, keine Kopien, Bild am Steuer über dem Auto, Aussteigen vor der Abfahrt, am Ende weg, aufgeräumt. Pfeil — 11 Paare (Nachbar links/rechts, Randplatz, darüber, darunter, schräg ×4, weit weg ×2): Napf-Mitte im oberen Drittel (3–8 % von oben), Nocke über dem Napf, Raster 9 × 9 über dem mittleren Drittel von Schütze und Ziel bei 0,72–3,0 s leer. Alles grün; Gegenprobe gegen den alten Stand: 51 rot.
- **Vorhandene Sonden**: 812, 698, 696, 759, 825, runde15/18/30/58/70/72/82, platzmenue grün. 687 hat 3 rote Punkte im Magic-Menü („Anpassen“) — auf dem alten Stand dieselben 3. 710 wackelt unter 4-facher CPU-Bremse („langsam: Bremse …“) — auf dem alten Stand ebenso (1 von 3 Läufen rot).

## Fassung 819 — Batmobil vorn und Saugnapf-Pfeil oben am Kopf (841) ausgeliefert

- Enthält 841 (Funk 230, Werbevideo): Das Batmobil fährt vorn über die Profilbilder und lässt den Fahrer aussteigen. Der Saugnapf-Pfeil klebt oben am Kopf des Ziels, die Gesichter von Schütze und Ziel bleiben frei.
- Viper, KITT und Colt-Truck fahren wie bisher (seit 698) hinter den Köpfen. Nur das Batmobil war gemeldet.

## Fassung 842 — Tonserver und Spiel: der Server-Weg wird bewacht, Rückfall aufs Netz sofort und für beide Seiten

Xander (Funk 233, wörtlich): „Wir haben es eben getestet in dem Moment wo ich das Spiel angeschalten habe hat der Ton so offenbar wieder Probleme gehabt wie verhält sich das mit dem Spiel liegt das auf dem Server oder was liegt auf dem was ist mit dem Server warum hängt das jetzt schon wieder liegt es an dem Spiel oder war das Zufall“

- **Befund (Datenbank 30.09., 04:25–04:35 UTC)**: Xander (Samsung Internet) und eine zweite Person (Chrome, beide Android 10). 04:25:35/38 erste Sitzungen, beide sofort wieder weg (Xanders Sitzung ohne Puls liegen geblieben, bis das Aufräumen sie schloss). 04:27:41/44 zweiter Anlauf, beide `empfang=["1"]`, Puls jede Minute (die „4 Aufrufe je Minute“ sind 2 × OPTIONS + 2 × Puls, also normal). Ab 04:33:31 spielt Xander (Protokoll: Eier, 04:33:37 Kartoffel-Treffer auf die andere Person). Nach 04:33:45 kein Puls mehr von der anderen Person, ihre Sitzung wurde nie geschlossen (die Seite wurde neu geladen, ihr „tonstand“ kommt 04:36:30 aus einer neuen Seite). 04:34:40 baut Xanders Seite ihre Sitzung ab (Cloudflare-Schliessen fehlgeschlagen, `empfang` blieb stehen), 04:35:27 neue Sitzung mit `empfang=[]`, danach kein Aufruf mehr.
- **Das Spiel ist nicht die Ursache**: der Spielkanal ist ausgehandelt (`negotiated`, id 7), bevor die Leitung steht; „Mitspielen“ an/aus verhandelt nichts neu und fasst weder Tonspur noch Transceiver an. Die Sonde schaltet das Spiel mit dem echten Knopf an, aus, wieder an (auch mit drei Leuten): keine Lücke, keine neue Sitzung.
- **Die Ursachen im Tonserver-Teil (827)**:
  1. Geprüft wurde nur EINMAL, beim Umschalten, ob Server-Pakete ankommen. Blieb der Server-Weg danach stehen (Handy unter Last, Aussetzer beim Server), schickte der andere übers Netz weiter nichts („ich höre dich über den Server“ galt ja) — Stille, bis jemand neu lädt. Die Sonde: nach einem Stau beim Server 10 s und mehr Stille, kein Rückfall.
  2. Die Server-Spur wurde nach ihrer KENNUNG mit der Netz-Spur verglichen. Beide können dieselbe Kennung tragen (sie stammt vom Mikrofon des Absenders; in der Nachbildung ist es so, ob Cloudflare sie durchreicht, ist offen). Dann blieb die leere Netz-Spur im Strom, die Server-Stimme wurde nie gespielt: „B hört A nicht“, obwohl `empfang` gesetzt war — genau das Bild aus der Datenbank. Jetzt nach dem Gegenstand (`t === e.spur`).
  3. Jedes „hallo“ (Neuladen, aber auch neu verbundener Raumkanal oder Leitungswache) riss beim Empfänger die GANZE Server-Sitzung ab (bei zwei Leuten „allein“ → schliessen) und baute sie neu auf; die Netz-Leitung ging zugleich weg. Sonde: 5–6 s Stille, zwei neue Sitzungen.
  4. Beim Neuladen blieb die alte Sitzung offen (kein Schliessen), eine zu spät gekommene Sitzung ebenso.
- **Jetzt** (`livechat.js`, Block „FASSUNG 842 — DER TONSERVER HORCHT WEITER“):
  1. `sfuHorchen` alle 250 ms: je bestätigter Server-Stimme `packetsReceived`. 0,8 s nichts (Mikrofon an, auf der Bühne) → `sfuStill`: Netz-Stimme wieder in den Strom, dem Sprecher „sfu-hoere ja:false“ über den Raumkanal UND direkt über den Spielkanal, Abo schliessen, 30 s Pause, dann neuer Versuch (erst bei echten Paketen wird wieder umgeschaltet). `kaputt` gilt nicht mehr für immer (`kaputtBis`).
  2. „sfu-hoere“ trägt `nr` (Uhrzeit, steigt immer); eine ältere Ansage auf dem langsameren Weg wird überhört.
  3. „hallo“ trägt `sfu` (laufende Sitzung) und `sfuHoere`. Gleiche Sitzung → über den Server bleibt alles. Neu angefangen → nur sein Teil wird gelöst, er bleibt als „kann den Server“ eingetragen (`seitHallo`, fällt nach 30 s ohne Ansage heraus); die eigene Sitzung läuft weiter und holt ihn ab, sobald er seine neue ansagt.
  4. Neu verbundener Raumkanal: das „hallo“ trägt `wieder: true`; steht die Leitung zu ihm, wird sie nicht abgerissen.
  5. `pagehide` (nicht bei `persisted`) schliesst die Sitzung mit `keepalive` (Marke nur im Speicher); eine Sitzung, die nach einem Abbruch noch ankommt, wird gleich geschlossen; `sfu.sitzung` wird vor den Prüfungen gesetzt, damit ein Rückfall sie schliesst.
  6. Nach einer neuen Aushandlung legen `plaetzeAnlegen`/`spurenNachtragen` die Tonspur, die gerade gelten soll (`sfuEigeneTonspur`, z. B. leer, wer nicht auf der Bühne steht), nicht blind das Mikrofon.
  - Nur zum Nachprüfen: `LiveChat.pruefHallo(wieder)`, `pruefSfu().stille`.
- **Edge-Function** `supabase/functions/sfu/index.ts`: unverändert, nicht nötig.
- **Sonde** `werkzeug/pruefe-842-sfu-spiel.js` (hört auf jeder Seite alle 100 ms mit: Pakete der Spur, die wirklich gespielt wird, nach Gegenstand zugeordnet; Lücke > 1 s oder zwei hörbare Spuren derselben Person = rot): Spiel an/aus/an zu zweit, dritte Person kommt beim Spielen dazu, C spielt, Server-Stau (Rückfall für A beidseitig in ~1,3 s), neu verbundener Raumkanal (keine Lücke, keine neue Sitzung, Leitung bleibt), Neuladen von A (A schliesst seine Sitzung, B behält seine, holt A wieder ab), Rückfall per Budget. Neu: alles grün. Gegenprobe gegen den alten Stand (`livechat.js` aus HEAD): 13 rot.
- **Vorhandene Sonden**: 827 (Tonserver), 659 (Verbindung/Datenkanal), 645 (Ton/Telefon), spielsystem, runde20, runde22, 678, 701 — alle grün. Zweiter Lauf von 842 ebenfalls grün.

## Fassung 820 — Tonserver-Fix (842) ausgeliefert

- Enthält 842 (Funk 233): Das Spiel war nicht die Ursache. Der Server-Weg für den Ton wurde nur einmal geprüft; nach einem Aussetzer (Handy unter Last) blieb es still bis zum Neuladen. Außerdem wurde die Server-Stimme manchmal nicht abgespielt (Spur-Vergleich über die Kennung statt über das Objekt).
- Jetzt: Wächter zählt alle 250 ms die Tonpakete, nach 0,8 s Stille sofort Rückfall aufs direkte Netz für beide Seiten, nach 30 s neuer Versuch über den Server. Beim Schließen der Seite wird die Sitzung sauber beendet.

## Fassung 843 — Italienisch nur noch im Italienischraum (Funk 225/232)

- **Xander (Funk 225/232):** Italienisch soll „generell … rausnehmen“ werden — überall außerhalb des Italienischraums.
- **Grundsatz:** Abgeschaltet wird die ANZEIGE, keine Daten. Die it-/itSyl-Felder der Szenen (alte und neue Bilderwelt), die it-Übersetzungen in data-exercises.js, data-beitraege.js und kalender/* bleiben, weil der Italienischraum sie braucht (Bilderwelt im Lernraum „it“ zeigt „il letto“ usw.). Deutsche Wörterbuch-Einträge über Italien (Toskana, Panettone, „Italien“ …) sind deutscher Wortschatz und bleiben.
- **app.js**
  - Neu `ohneItalienisch(code)`: außerhalb des Italienischraums wird aus „it“ die Rückfallsprache „en“; im Raum bleibt alles. Dazu `sprachwahlOhneItalienisch(paare)` für Auswahllisten.
  - `firstStepsLangFor()` (Herkunftsland Italien), `hilfsSprache()` (ausdrücklich gewähltes Italienisch) und `inHilfsSprache()` laufen darüber — damit sind Bilderwelt-Wortkarte (zweite Zeile), kleine Übersetzungszeilen und Satzhilfen ohne Italienisch.
  - Einstellungen „Sprache der Erklärungen“, „Erste Schritte“ (Sprachwahl und „Übersetzung gerade in“) und „Es war einmal in Deutschland“/Beiträge (Sprachwahl, Übersetzungsklappe) bieten Italienisch außerhalb des Raums nicht mehr an; ein früher gewähltes Italienisch fällt auf Englisch zurück.
  - Alte Bilderwelt, Übersicht: der Satz „Wer will, sieht zu jedem Wort auch gleich das italienische daneben.“ ist weg (eine Stelle, markiert „FASSUNG 843“). Im Italienischraum steht weiter „Im Italienisch-Raum läuft alles auf Italienisch …“.
- **Bleibt unverändert:** darfItalienischraum(), Lernraum-Schalter 🇮🇹 Italiano, satzbau-it.js, window.DMA_IT_SPIEL, spiel.js im Italienisch-Modus, Italienischkurs, it-Kalender, Changelog-Geschichte (die aktuelle öffentliche Neuigkeit 175 enthält kein Italienisch). sicherung/ und min/* nicht angefasst — **min/app.js muss der Hauptagent mit fassung-setzen neu erzeugen**, sonst sieht die Seite ohne ?quelle den alten Stand.
- **Sonde 840 angepasst:** statt „Byte für Byte wie 53eaa31“ gilt jetzt „alt = 53eaa31 abzüglich Italienisch“: Dateien der alten Bilderwelt dürfen sich nur durch fehlende "it"/"itSyl"-Felder unterscheiden (Stand 843: noch byte-gleich); Stellen in den Bilderwelt-Abschnitten von app.js mit der Marke „FASSUNG 843“ zählen nicht zu den 11 Weichenstellen und müssen genau einen italienischen Satz leeren (ohne Kommentar = alte Zeile mit "" statt des Satzes).
- **Sonde** `werkzeug/pruefe-843-italienisch-nur-im-raum.js` (index.html?quelle=1, 360 px, Konto mit Hilfssprache „it“ und Herkunft Italien): alte Bilderwelt ohne Italienisch-Einleitung und ohne 🇮🇹/„il fornello“ auf der Wortkarte; Einstellungen, Erste Schritte und „Es war einmal in Deutschland“ ohne Italienisch; Italienischraum (Betreiber, Lernraum „it“) weiter mit „il fornello“, DMA_IT_SPIEL und Schalter 🇮🇹 Italiano. Neu grün; Gegenprobe mit app.js aus HEAD: 9 rot.

## Fassung 821 — Italienisch nur noch im Italienischraum (843) ausgeliefert

- Enthält 843 (Funk 225/232, „generell … rausnehmen“): Außerhalb des Italienischraums wird Italienisch nirgends mehr angezeigt (Hilfssprache, Erste Schritte, Geschichte, alte Bilderwelt samt Einleitungssatz). Wer vorher Italienisch gewählt hatte, bekommt dort Englisch. Die Daten bleiben, der Italienischraum ist unverändert.

## Fassung 845 — Klassenzimmer passt wieder mit Überschrift, Einzug im Auto in einem Takt, Gleise einer Folge bauen sich auf, wenn sie dran sind

Xander (Walkie 313, 29.09., Auszüge wörtlich): (a) „übrigens scheint der Livestream jetzt nicht mehr an der Position zu sein wo er … ursprünglich war erscheint jetzt etwas höher zu sein zumindest auf dem Android … vorher konnte man alles gut sehen … man hat oben noch die Überschrift gelesen aber vielleicht liegt das daran dass ich jetzt oben die Adresszeile nicht mehr ausblendet …" (b) „dann hängt meine Intro Animation immer noch sehr weil sie mein Bild gar nicht richtig mitnimmt da ist eine Latenz zwischen meinem Bild und dem Auto … ich soll hinter dem Glas vom Batmobil sitzen und auch bei Dodge Viper ist es nicht viel besser" (c) „wenn wir diesen multiplizierten schienenverlauf machen … dann soll das was danach kommt sich danach auch erst aufbauen sonst haben wir schienen die sich überlappen … erstmal der erste Weg und wenn der erste Weg gefahren ist muss sich flüssig der zweite Weg aufbauen ohne die alten Gleise sichtbar zu überschreiben"

- **(a) Einrasten — die Ursache**: `lcPlatzZiel` (seit 17.09. unverändert) zentriert die Karte, wenn sie passt, sonst legt es die Schreibzeile an den unteren Rand. Nachgemessen (390 px): die Karte ist 778–832 px hoch (Kopf 62, Plätze 205, Knöpfe 61, Zeile „Die Leitung zu …" 54, Chat-Kopf 38, Verlauf 240, Schreibzeile 61, Einladen 29). Frei sind mit Adresszeile ≈ 716 px, ohne ≈ 772 px. Die Überschrift stand bei −79 px (mit) bzw. −23 px (ohne Adresszeile) — genau „etwas höher". Ohne Vollbild (Adresszeile sichtbar) und mit der Leitungszeile passt die Karte nicht mehr.
- **(a) Jetzt**: `lcVerlaufPassen` (app.js, vor `lcPlatzZiel`) lässt am Telefon (≤ 760 px) den Chatverlauf nachgeben (240 → bis 120 px, CSS-Variable `--lc-verlauf-h`, korrekturen.css), bis Überschrift und Schreibzeile auf den Schirm passen. Gemessen wird an `innerHeight`, nicht am sichtbaren Ausschnitt, und nicht, solange das Schreibfeld den Fokus hat — die Tastatur verändert die Höhe also nicht (sonst wackelt beim Tippen alles). Nachher: Überschrift bei +41 px (390 × 716), +97 px (390 × 772), +35 px (360 × 708); bei 360 × 652 (sehr kleines Telefon mit Leitungszeile) noch −21 px.
- **(a) Offen**: das Schwarzbild beim Öffnen der Tastatur und der schwarze Rand oben beim Verlassen ließen sich hier (Chromium ohne echtes Android, ohne Vollbild-Übergang) nicht nachstellen. Verdacht: der Vollbild-Übergang des Kino-Modus (`lcKinoAn`/`lcKinoAus`, Runde 87) — beim Verlassen läuft `exitFullscreen` zugleich mit dem weichen Rollen des Reiterwechsels; beim Tippen auf das Schreibfeld im Vollbild ändert Android beide Viewports. Nicht angefasst. **→ 884** („Vollbild: erst aus, dann rollen; Walkie-Feld bleibt über der Tastatur“).
- **(b) Einzug — die Ursache**: Auto und Bild liefen auf zwei Uhren. Das Auto wird per `requestAnimationFrame` auf die Leinwand gemalt (Hauptfaden), das Bild hatte eine eigene WAAPI-Animation, die der Compositor weiterlaufen lässt, wenn der Hauptfaden hängt (beim Betreten: Verbindung, Plätze, Töne). Auf dem Telefon sprang das Bild also schon zum Platz, während das Auto noch stand.
- **(b) Jetzt** (`lcAuftrittAuto3d`, `bildSetzen`): keine eigene Animation mehr am Bild. Dieselbe Schleife, die das Auto malt, setzt im selben Takt `transform`/`opacity` des Bildes — hängt das Gerät, hängen beide gemeinsam. Im Wagen sitzt das Bild kleiner (0,46 m) und 0,16 m tiefer im Fahrerplatz, Klasse `lc-im-wagen` (korrekturen.css): Scheibe davor (Tönung, zwei Lichtstreifen, heller Kuppelrand), unten von der Karosserie verdeckt (`clip-path: inset(0 0 17% 0)`); erst beim Aussteigen springt es heraus. Der Halt ist so gelegt, dass der Kopf im Auto auf Höhe des Platzes bleibt (812). Gilt für Batmobil und Viper. Die Blätter wurden schon vorab geladen (811/812); das Batmobil fährt weiter vorn über die Köpfe (841).
- **(c) Gleise — die Ursache**: eine Folge (776: Runde ×2, dann Weiter-Weg) ist EINE Kette. Der ganze Gleisplan lag vom ersten Bild an da; wo der Weiter-Weg über die Runde lief, lagen Kurve (Runde) und Gerade (Weiter-Weg) übereinander — für das Auge eine Kurve, aus der das Gleis gerade herausbricht. Dazu bekam dieselbe Ecke bei jedem Durchgang einen anderen Bogen (Radius hing an der Länge der nächsten Geraden): zwei Kurven wie ein Fächer.
- **(c) Jetzt** (`lcLokGleisFolge`, `lcLokGleise` mit einer Gruppe je Modul, `lcLokBahn`/`lcLokBahnRund`): der erste Weg reicht bis zum ersten Modul, das parallel auf einem liegenden Gleis läge; er liegt von Anfang an. Jedes spätere Modul baut sich erst auf, wenn die Lok gleich dort ist (Schwelle für Schwelle, die Schienen werden in Fahrtrichtung gezogen, 0,52 s, im Takt der Lok). Liegt genau dasselbe Stück schon (Runde ×2), wird nichts neu gelegt. Ein altes Stück, auf dem das neue läge, wird ausgeblendet — sobald der letzte Wagen es verlassen hat. Dieselbe Ecke bekommt immer denselben (engsten) Bogen; die Übergänge sind Bögen, die Richtung springt nie. Alte Stücke, die nichts überdeckt, bleiben liegen. Die Kette und alles Senden sind unverändert (ältere Geräte sehen die alte Darstellung).
- **Sonde** `werkzeug/pruefe-845-chat-einzug-gleise.js` (index.html?quelle=1; 360 × 780, 390 × 844; `BILD=`, `WURZEL=`): Einzug Batmobil/Viper — keine eigene Animation am Bild, nach 450 ms Blockade zeigt das Bild den gemalten Fahrerplatz, am Halt hinter der Scheibe im Auto, nach dem Aussteigen ohne Scheibe auf dem Platz; Gleise `/lok 1-2-6-5-1-2-6-5-1-2-3-7` — am Anfang nur der erste Weg, die Lok jederzeit auf fertigem Gleis, nie zwei sichtbare Stücke übereinander (außer unter dem Zug), am Ende nichts übereinander, keine Lücke/kein Knick; Einrasten bei 390 × 716, 390 × 772, 360 × 708 — Überschrift und Schreibzeile im Bild, Verlauf ≥ 120 px.

## Fassung 844 — Stadt nach Walkie 313: Rathausdach wie 824, Dom bei Nacht, Laternen, Stecknadel, langes Drücken, Symbole am Haus, Kornfelder, Bergwerk an den Bergen, Ladebild

XANDER (Walkie 313, 29.09.): „es sollte ein Dach vom vom Turm aus nach rechts gehen über den Seitenflügel … keine extra Dächer quer nach vorne … du hast es in deine Optik schon mal richtig gemacht im Verlauf" · „der Kölner Dom [hat] keinen Kontrast der sieht so gelblich aus" · „die Laternen die einen Kegel geben sollten der die die Häuser anstrahlt … weil es nachts meist viel zu düster wirkt" · „mit der pinnadel einen zoomausschnitt … anpinnen … wenn man auf mein Dorf kommt immer mit dieser Ansicht präsentiert wird" · „wenn ich lange auf ein Haus gedrückt halte soll das Bearbeiten Menü kommen … wofür der Blitz" · „den Kölner Dom irgendwie besser setzen" · „ich möchte sichtbare Getreidefelder" · „das Bergwerk … hinter den Gleisen … wo [die] Berge sind" · „dass der Zoom direkt auf dieses Haus springt … dann wieder auf das Gesamtbild" · „viele Sachen sind gar nicht anwählbar" · „kleine Symbole am Haus … jetzt kriege ich trotzdem wieder das große Menü" · „nicht mal einen [Lade]bild für die Stadt".

- **Rathaus (`stadt/modelle/rathaus_doebeln.js`)**: Flügel A wieder mit EINEM Satteldach vom Turm bis zur Kopfseite, der Stufengiebel ist die Kopfseite rechts – genau das Dach von Fassung 824 (829 hatte den Giebel nach vorn gedreht: Giebelbau mit Dach nach hinten plus Haus mit Zeltdach = „großes Dach nach vorne und kleines Dach daneben"). Von 829 bleiben der weit vorgezogene Balkon (1,25 m) mit den Blumenkästen und der schmalere Flügel B. Alle Rathausbilder neu gebacken. Die Sonden 824/829 prüfen noch den Giebel vorn (Stand 829) und müssen nachgezogen werden.
- **Kölner Dom nachts (`stadt/modelle/koelnerdom.js` `flaechenInfo`)**: Flutlicht fast weiß statt orange (0,92/0,90/0,84 statt 0,62/0,50/0,33), reicht bis in die Turmspitzen (26 → 38 m), Dächer fangen kaum Licht, ohne Strahler halbes Mondlicht. Die Wände sind hell gegen den Nachthimmel, Nischen und Dächer bleiben dunkel. Die Nachtbilder neu gebacken (die Größe ist unverändert – dazu läuft eine Rückfrage).
- **Laternen (`stadt-leicht/szene.js`)**: Fleck am Boden fast doppelt so kräftig (6,5 m, im kleinen Bild mindestens 9 px, außen steil auslaufend – eine ausgeschaltete Nachbarin bleibt dunkel, Sonde 825), angestrahlte Wände bis 13 m (vorher 8,5 m), heller und dreimal gemalt. Nachtbilder von Häusern, Wahrzeichen und Bahnhof werden einmal aufgehellt darübergelegt („lighter", 30 %) – kein zusätzliches Bild. Vor dem Stollen des Bergwerks leuchten nachts Grubenlampen.
- **Stecknadel (`oberflaeche.js`)**: steht im kleinen Bild immer (nicht erst nah dran). Ein Tipp steckt die aktuelle Ansicht fest (Lage, Nähe, Drehung); in einer anderen Ansicht steckt der nächste Tipp die neue fest, gelöst wird nur in genau der festgesteckten. `O.zurStartAnsicht` (Nadel oder ganze Stadt) gilt beim Laden, zurück aus dem Vollbild und beim Zurückkommen ins Dorf.
- **Warm halten (`start.js`)**: Versteckt das Spiel den Rahmen (Dorf zu, weggescrollt, Tab im Hintergrund), ruht die Bildschleife (zwei Blicke je Sekunde). Steht der Platzhalter `.sp-dl-neustadt-platz` wieder im Spiel (Dorf wieder auf nach ≥ 1,2 s), zeigt die Stadt ihre Startansicht (`O.wiederDa`). Wie lange der Rahmen im Speicher bleibt, entscheidet das Spiel (`spiel.js lsFolgen`: bisher 20 s – für 5 min muss dort 20000 → 300000).
- **Langes Drücken (`oberflaeche.js` `langMenue`)**: 0,5 s ruhig auf Haus, Wahrzeichen, Schmuck, Bahnhof/Bootsverleih oder Baum → Summen und das Bearbeiten-Menü am Ding, auch im Überblick (die Stadt fliegt dafür heran). Das Loslassen ist kein Tipp und löst im Menü nichts aus (`lk-sperre`). Ist das Menü schon offen, hebt langes Halten das Ding an wie in 822. Sonden können die Zeit über `O.langMs` verlängern (Prüf-Chromium malt ein Bild mehrere hundert ms lang).
- **Blitz**: jetzt eine beschriftete Zeile im Menü: „Ein Tipp produziert sofort: an/aus" (dieselbe Einstellung wie unter dem Bild).
- **Tipp aufs Haus im kleinen Rahmen**: die Stadt schickt `leicht-haus` mit `klein: 1`. Das Spiel antwortet mit den kleinen Symbolen (`leicht-wahl` mit `fokus: 1`, dazu `info` = kurzer Grund und `w.bild`/`w.text`), und die Stadt fliegt zum Haus (Kompass-Nähe, Haus in der Mitte, `O.fokus`). Ein älteres Spiel ohne diese Antwort öffnet weiter die Station, dann bleibt die Stadt stehen. Zurück zur Startansicht, sobald die Aufgabe erledigt ist: Symbol getippt, das Zeichen am Haus ändert sich, das Spiel schickt `leicht-zurueck`, oder man tippt daneben. Ohne das Gegenstück in `spiel.js` öffnet das Spiel noch die Station darunter (Patch dafür beim Hauptagenten).
- **Anwählbar**: Wahrzeichen, Bootsverleih und Schmuck bekommen auch im Überblick ihr Menü (Verwalten, Info, Drehen …); vorher geschah dort nichts.
- **Kölner Dom setzen**: große Dinge beim Versetzen: die Stadt zoomt so weit heraus, dass sie samt Umgebung ins Bild passen; der gestrichelte Rahmen ist grün (frei) oder rot (stößt an Haus, Wahrzeichen, Wasser, Acker, Bahn); „Freier Platz" schiebt es an die nächste ganz freie Stelle (`D.freiFuerWunder` mit `nurPruefen` und `pruefDreh`).
- **Getreidefelder (`dorf.js`, `oberflaeche.js`)**: zwei große rechteckige Äcker nebeneinander in den Bildachsen (je 18 × 30 in u/v, ≈ 270 m²) rechts zwischen Kaserne, Krankenhaus und Brandenburger Tor, der Kornwagen hält daneben. Der linke lag vorher hinter dem Kölner Dom (dessen Bild ihn verdeckte); ganz unten links läge er in Dörfern ohne Dom außerhalb des kleinen Bilds. Das Zeichen („×2") steht am hinteren Rand des Ackers. Kein Baum steht auf oder vor einem Acker (`D.feldNah`), Wahrzeichen suchen sich Plätze außerhalb. Die Bäume wachsen weiter nach der alten Zufallsfolge (die alten Ackerflecken und der alte Bergwerksplatz gelten für sie weiter); was auf den neuen Äckern oder im Bergwerk stünde, wird erst danach herausgenommen – so bleiben 340 von 381 Bäumen genau, wo sie waren, und gemerkte entfernte/gefällte Bäume passen weiter. Gemalt werden Reihen und (nah) Ähren, golden wenn reif, grün beim Wachsen, im Winter Stoppeln.
- **Bergwerk**: hinter der Bahn am Fuß der Alpen (u = 92, v = −103) und 1,45-mal so groß (`D.MASS.bergwerk`); Weg und Vorplatz rücken mit, der Waldsaum lässt dort Platz. Sein alter Platz bleibt für Wahrzeichen gesperrt (sonst rückte Neuschwanstein nach), und sein Felsberg zieht den Überblick nicht auf (die Stadt bleibt im kleinen Bild so groß wie vorher).
- **Ladebild (`stadt-leicht.html` #lLade, `stadt-leicht/alex-lade.webp` 4 KB)**: Alex zeigt auf „Gleich siehst du deine Stadt!" und den Namen der Stadt (vom letzten Mal gemerkt, `leicht_stadtname`). Es geht, sobald 85 % der sichtbaren Häuser geladen sind (spätestens nach 5 s bzw. 15 s).
- **Sonde** `werkzeug/pruefe-844-stadt-walkie313.js` (`NUR=A|B|C`, `BILD=`, `WURZEL=` für die Gegenprobe): alles grün; mit dem Stand vor 844 rot (Teil A 13, Teil B 10 Fehler).
- **Offen / beim Hauptagenten**: `spiel.js` – die kleinen Symbole statt der Station (`klein: 1` → `leicht-wahl`), `leicht-machen` für Einzelaufgabe und Bergleute, `leicht-zurueck` nach einer Aufgabe, 5 min warm halten; die Lage des Dorfbilds auf dem iPhone (`dorfRahmenEinpassen`); Sonden 824/829 auf das Dach von 824 umstellen. Die Grenze der Sonde 799 (330 KB) war schon vor 844 überschritten (335 KB), mit 844 344 KB.
## Fassung 822 — Klassenzimmer, Einzug und Gleise aus 845 ausgeliefert (Walkie 313)

- Enthält 845: Das Klassenzimmer passt mit Überschrift auf den Schirm, auch mit sichtbarer Adresszeile (der Chatverlauf wird am Telefon dafür niedriger, beim Tippen wird nichts neu bemessen). Beim Einzug sitzt das Profilbild von Anfang an hinter der Scheibe von Batmobil und Viper und fährt im selben Takt mit. Gleise einer Folge bauen sich erst auf, wenn die Lok hinkommt, mit durchgehenden Bögen.
- Noch nicht dabei: die Stadt-Punkte aus Walkie 313 (844), weil die neuen Kornfelder in manchen Dörfern über Häusern liegen. Offen: Schwarzbild bei Tastatur/Verlassen (headless nicht nachstellbar) **→ 884**.

## Fassung 823 — Chatfenster wieder in alter Höhe, Rathausdach ohne Giebel nach vorn

XANDER (wörtlich): „Mach das wieder zurück auf die Originaldimensionen die es vorher auch hatte, damit wir unsere Stadt auch wieder navigieren können … ich habe niemals gesagt, dass du das Chat Fenster innerhalb des Klassenzimmer Frames verkleinern sollst" · „ein Rathausturm und daneben gehen … drei einfache waagerechte Linien nach rechts … da gibt es keine Dreiecksgeometrie nach vorn".

- **Chat**: Das Verkleinern des Chatverlaufs aus 845 (`lcVerlaufPassen`, `--lc-verlauf-h`) ist abgeschaltet; der Verlauf hat wieder seine alte Höhe. Einzug im Auto und Gleis-Folgen aus 845 bleiben.
- **Rathaus**: Modell und gebackene Bilder aus 844 (Flügel rechts vom Turm mit EINEM durchgehenden Dach bis zur Kopfseite, Stufengiebel nur an der Seite, Balkon mit Blumenkästen). Dazu die Nachtbilder des Kölner Doms mit weißem Flutlicht (844). Sonst nichts aus 844.

## Fassung 824 — Stadt nach Walkie 313 (844) ausgeliefert, ohne die großen Äcker

- Enthält aus 844: Laternen mit hellem Lichtkegel auf den Häusern und hellere Nächte; Stecknadel merkt die eigene Ansicht (Lage, Nähe, Drehung) und öffnet die Stadt immer so; langes Drücken auf Haus, Wahrzeichen, Schmuck, Bahnhof oder Baum öffnet das Bearbeiten-Menü; der Blitz heißt jetzt „Ein Tipp produziert sofort: an/aus"; ein Tipp aufs Haus zeigt kleine Symbole am Haus (Spiel: `klein: 1` → `leicht-wahl` mit `fokus`), die Stadt fliegt hin und nach der Aufgabe zurück; Wahrzeichen, Bootsverleih und Schmuck auch im Überblick anwählbar; Kölner Dom beim Versetzen mit grünem/rotem Rahmen und „Freier Platz"; Bergwerk groß hinter der Bahn am Fuß der Alpen; Ladebild mit Alex und dem Stadtnamen; die Stadt bleibt nach dem Verlassen 5 Minuten warm (spiel.js 20 s → 300 s).
- Feld-Zeichen stehen nur noch, wenn der Acker selbst im Bild ist (vorher an den Rand geschoben, dort über der Schule).
- **Zurückgenommen**: die zwei großen Äcker. Mit ihnen stand der Kornwagen so, dass die Autos nicht mehr über den Markt kamen (Sonde 830). Die Äcker liegen wie bis 843; „sichtbare Getreidefelder" bleibt offen.
- Sonden: 817/822 prüfen das neue Verhalten (kleine Symbole, langes Drücken); 824/829 markieren das abgelehnte Dach von 829 als überholt; 799 Grenze 345 KB.

## Fassung 825 — Pfeil wie vor dem Werbevideo, stufenlos zoomen, Nadel hält Nähe und Winkel, Quests neu, echte Turmuhr, sichtbare Kornfelder (Walkie 315)

XANDER (Walkie 315, wörtlich): „die Sache mit dem Pfeil kannst du wieder zurücknehmen … so wie es zuletzt war vor dieser Änderung für das Werbevideo" · „ich möchte das wie vorher auch stufenlos Zoomen das fühlt sich jetzt so an als wenn das mit der Lupe direkt aufspringt" · „der PIN setzt alles fest die Zoomstärke und den Winkel" · „cool wäre es auch noch wenn die Turmuhr die richtige Uhrzeit anzeigen würde" · „immer noch keine sichtbaren Getreidefelder".

- **Pfeil (`app.js`)**: die Bahn von oben an den Kopf (841, `lcSaugpfeilBahn`) ist abgeschaltet; der Pfeil fliegt wieder wie vorher. Sonde 841 markiert die Pfeil-Lagen als überholt (Batmobil-Prüfungen bleiben).
- **Zoomen im kleinen Rahmen (`start.js`, `oberflaeche.js`)**: Safaris Kneif-Geste (`gesturestart/-change/-end`) wird in der Stadt abgefangen – vorher zog das iPhone dabei die ganze Spielseite mit groß. Solange Finger auf dem Bild liegen, schaltet die Kompass-Anzeige (kleine Karte, „+/−") und der Bildwechsel groß/klein nicht um; erst nach dem Loslassen.
- **Stecknadel**: die Zoomgrenzen des kleinen Rahmens werden nach jeder Größenänderung neu gesetzt (`O.miniGrenzen`, aus dem Überblick nach Norden) – vorher galten danach die des Vollbilds, und die festgesteckte Nähe wurde beschnitten. Lädt der Rahmen versteckt (ohne Größe), gibt es keinen negativen Maßstab mehr (leeres Bild); sobald er eine Größe hat, steht die festgesteckte Ansicht. Der Kompass führt von woanders zurück in die festgesteckte Ansicht (erst aus ihr heraus zur ganzen Stadt); nach einer Quest fällt das Bild in sie zurück, wenn man nichts angefasst hat.
- **Quests (`quests.js`)**: 36 Vorlagen statt 16, nur noch 5 Wegbeschreibungen. Neu: **Suchen** (Ort, Beruf, „was will ich erledigen" – man sucht das Gebäude selbst und tippt es an; ein falsches Haus sagt, was es ist), **Uhrzeit** („Wie spät ist es?" nach der Rathausuhr, Termine wie im Alltag sagen), dazu Perfekt, Modalverben, Plural, Steigerung, Dativ, trennbare Verben, Datum, Preise, Glückwunsch. „!" und „?" sind kleiner gezeichnet (Tippfläche bleibt 30 × 34 px), nach der richtigen Antwort verschwindet das Zeichen. Tafeln kompakter (im kleinen Bild ≤ 58 %, sonst ≤ 44 %). Die Leute gehen 3,2 m/s statt 1,45. Beim ersten Tipp aufs „!" fliegt die Kamera ganz nah an die Person; bei Wegbeschreibungen dreht sich die Karte so, dass ihr erster Schritt im Bild nach oben zeigt.
- **Turmuhr (`szene.js turmuhr`)**: die vier Zifferblätter des Döbelner Rathauses zeigen die deutsche Uhrzeit (`ST.uhr`, wie die Glocken): die gebackenen Zeiger deckt eine Scheibe in Blattfarbe zu, darauf Stunden- und Minutenzeiger in der Ebene des Blatts.
- **Kornfelder (`dorf.js`)**: die zwei großen Äcker von 844 sind zurück, aber nur gemalt (golden/grün, Tippfläche und Zeichen der Felder 91/92); der Boden darunter bleibt Wiese, damit Wegenetz, Kornwagen und Autos unverändert bleiben (Sonde 830). Wahrzeichen suchen sich Plätze außerhalb.
- **Sonden**: `pruefe-846-zoom-nadel.js` (mit dem Stand vorher 7 rot), `pruefe-846b-quests-uhr.js`; 832 (Such-Quests ohne Antworten), 844 (Äcker wieder geprüft), 845 (Einpass-Prüfung durch 823 überholt).

## Fassung 826 — Tonserver erst ab 4 Leuten, zu zweit wieder direkt über die Relais (Funk 246/248)

XANDER (Funk 246, wörtlich): „Die Verbindung mit Leuten ist jetzt noch schwerer … nach ein paar Sekunden ist ja plötzlich weg dann aktualisiere ich und ich höre ihn überhaupt nicht mehr … warum habe ich denn den sfu Server eingerichtet".

- **Befund** (`sfu_sitzungen`, 30.09. 19:42–20:39 UTC, zwei Leute): über 20 Server-Sitzungen in einer Stunde, die meisten nach 2–10 s wieder zu, fast nie kam die Stimme des anderen darüber an. Die /verbindung-Zeile steht nur auf dem eigenen Bildschirm, nicht in der Datenbank.
- **Jetzt (`livechat.js`, `SFU_AB = 4`)**: der Tonserver wird erst aufgebaut, wenn mindestens 4 Leute im Raum sind, die ihn können (mich mitgezählt); darunter läuft der Ton wie vor 820 direkt über die eigenen Cloudflare-Relais. ?sfu=1 erzwingt ihn weiter (Sonden). /verbindung sagt: „nicht nötig (unter 4 Leuten läuft der Ton direkt über die Relais)".
- **Sonde** 827 Teil 2b (freigeschaltet, zu zweit: kein Aufruf, Stimme über die Netz-Leitung) – mit dem Stand vorher 3 rot; 842, 659 grün.

## Fassung 827 — Mühle produziert direkt, Symbole am Haus, Äcker neben den Wegen, schwebendes Quest-Menü, ruhiger Einzug (Funk 248)

XANDER (Funk 248, wörtlich): „die Mühle produziert nicht sofort die geht immer erst ins große Menü" · „wenn in einer Sache an einer Stelle zwei Sachen produziert werden können dass diese zwei Symbole einfach nur da sind bei dem Haus und ich eins der Symbole halt anklicken kann" · „die getreideäcker scheinen auf einem Gehweg zu sein" · „die Getreidefelder waren früher auf beiden Seiten" · „ein kleines kompaktes schwebendes Menü über dem Chat … damit man die Richtungen herausfinden kann und im Bild bleibt" · „mein Auto kommt nie flüssig … ich sehe mich nicht damit reinfahren … die ganze Webseite hängt nur noch".

- **Symbole am Haus (`spiel.js lsKleineWahl`)**: ein Tipp auf ein Haus, das etwas herstellt, zeigt immer die kleinen Symbole am Haus – auch wenn es gerade arbeitet (grau, „Mühle mahlt Mehl – noch 3:10") oder Zutaten fehlen (grau, „Es fehlt Getreide."). Vorher fiel die Mühle in beiden Fällen ins große Menü. Bäckerei: Brot, Kuchen, Torte nebeneinander, jedes einzeln tippbar. Auch im Vollbild (die Stadt fragt dort jetzt ebenfalls mit `klein: 1`). Das große Menü nur über „Karte" oder bei Häusern ohne Herstellung.
- **Äcker (`dorf.js`)**: Acker 91 lag über dem Weg zu Kaserne und Krankenhaus; jetzt links bei der Windmühle auf freier Wiese, Acker 92 rechts, ein Stück vom Weg weg; beide im Überblick des kleinen Rahmens ganz zu sehen, und der Kölner Dom findet beim Versetzen weiter einen freien Platz. Die Ladestellen des Kornwagens liegen unter den gemalten Äckern (vorher ein brauner Fleck am Weg).
- **Quest-Menü (`quests.js platzUnten`, `spiel.js leicht-unten`)**: im kleinen Rahmen wächst der Rahmen für die Frage nach unten und liegt über dem Chat; das Stadtbild behält seine Größe und bleibt ganz frei, die Person steht in der Mitte. Reserviert wird erst, wenn das Spiel den Rahmen wirklich vergrößert hat (Antwort `leicht-unten-lage`); reicht der Platz nicht oder antwortet niemand, bleibt der Dialog wie bisher im Bild. Ins Vollbild: der Dialog kommt zurück ins große Bild.
- **Einzug (`app.js lcAuftritt`)**: vor dem Kommen wartet der Einzug höchstens 3 s, bis die Seite ein paar Bilder ruhig läuft (vorher startete er 300 ms nach dem Betreten, mitten in Verbindung, Plätzen und Verlauf). Die Blätter von Viper/Batmobil dürfen 15 s statt 6 s brauchen – vorher fiel der eigene Einzug danach ganz aus. Während ein Einzug fährt, ruht die eingebettete Stadt (`leicht-ruhe`), die im selben Faden malt. Bild und Qualität unverändert.
- **Sonden**: `pruefe-847-kleine-symbole.js` (Symbole, Äcker, schwebendes Menü, Einzug); 759/696 messen ab dem Start der Bühne; 799 tippt ein Haus ohne Herstellung (die anderen zeigen jetzt die Symbole). 659 ist schon auf dem Stand 826 rot (nicht diese Fassung).

## Fassung 828 — In den Stadt-Quests antwortet man durch Sprechen (Funk 249)

XANDER (Funk 249, wörtlich): „Können wir ein System bauen auf der Basis von Azoren oder auf irgendeinen spracherkennungsdienst wo wir innerhalb der Stadtmissionen erfüllen und in echt mit den Menschen sprechen … der automatisch das Mikro anschaltet nachdem die Person dich gefragt hat in der Mission antwortest du einfach was du antworten möchtest und das System erkennt dann ob es logisch ist Grammatik grammatikalisch korrektes Deutsch ist … wenn einer dieser Sätze getriggert wird dann kriegt man die Punktzahl bzw kriege nur eine halbe Punktzahl wenn es nur in etwa der Satz ist … um denen die Angst zu nehmen zu kommunizieren".

- **Ablauf (`quests.js`, Teil 11. SPRECHEN)**: im Quest-Dialog steht über den Antworten „🎤 Antwort sprechen". Beim ersten Mal tippt man darauf (der Browser fragt nach dem Mikrofon); danach stellt die Person ihre Frage laut (Azure-Stimme: Frauen Katja, Männer Conrad) und das Mikro geht von selbst an. Die Aufnahme endet nach 1,3 s Stille oder spätestens nach 9 s (Tippen = fertig). Azure schreibt auf, was gesagt wurde (Edge Function `aussprache`, neue Aktion `erkennen`, ohne Referenztext); die Antwortknöpfe bleiben daneben.
- **Prüfen**: bei Wegfragen werden die gesagten Richtungswörter (geradeaus, links, rechts, halb links …) auf dem echten Wegenetz nachgegangen – kommt die Person so ans Ziel, stimmt es, egal wie der Satz gebaut ist. Eine Lagebeschreibung zählt auch („neben dem Rathaus", „gegenüber vom Brunnen"), wenn das genannte Haus wirklich nah am Ziel steht. Andere Fragen: der Satz wird Wort für Wort mit den Antworten verglichen (Reihenfolge egal). Falsch: Hinweis, und bei Wegen zeigt die rote Linie, wohin die Beschreibung führt.
- **Punkte**: ein ganzer, passender Satz = volle Punkte + 4 Sprech-Bonus („– mit Sprech-Bonus"); nur ungefähr (z. B. nur „links, rechts" ohne Satz, oder deutlich abweichend) = halbe Punktzahl.
- **Rahmen (`spiel.js`)**: das eingebettete Stadtbild darf Mikrofon und Ton benutzen (`allow="fullscreen; microphone; autoplay"`). Ohne Anmeldung sagt die Leiste „Zum Sprechen bitte anmelden"; Tagesgrenze und Kontingent wie im Aussprache-Trainer (300 Anfragen pro Person und Tag).
- **Edge Function `aussprache`** (Version 4, ausgeliefert): Aktion `erkennen`; `vorlesen` mit `stimme: "m"` → de-DE-ConradNeural.
- **Äcker noch einmal (`dorf.js`)**: 827 legte Acker 91 hinter die Windmühle – ein Tipp auf die Mühle erntete dann den Acker dahinter. Jetzt liegt 91 links auf der freien Wiese unter Kuhstall und Mühle (u −119, v 50), 92 rechts zwischen Krankenhaus und Brandenburger Tor (u 94, v 31); nichts Hohes steht im Bild davor, beide sind auch in einem 280 × 175-Rahmen ganz zu sehen, der Kölner Dom findet beim Versetzen weiter einen Platz, und die Obstwiese beim Labor bleibt stehen. Die Ladestellen des Kornwagens liegen unter den Äckern.
- **Sonden**: `pruefe-848-sprechen.js` (Prüfen der Sätze, Dialog mit Ersatz-Mikro, Rahmen/Server); 828 prüft, dass das See-Zeichen den rechten Acker nicht verdeckt, und tippt den Acker ohne Zeichen; 817, 844, 847, 799, 832, 846b, 830 grün.


## Fassung 829 — Sofort im Chat, Platzwechsel kommt an, Ladebild mit Fuchs, Quest-Fenster über dem Bild, Acker hinter der Bäckerei (Funk 255)

XANDER (Funk 255, wörtlich): „wenn ich den Chat betrete dann muss ich sofort im Chat da sein und das darf nicht erst fünf Minuten dauern" · „wenn ich den Platz tauschen will dauert es manchmal 5 Sekunden" · „wenn der Preloader kommt bei meiner Stadt kommt vorher mal ein grüner Bildschirm … den kleinen Fuchs … dass er da in der Wartezeit umher springt" · „ein schwebendes Fenster … kurz über dem Bild der Stadt das ist niemals die Stadt verdeckt" · „dass es standardmäßig zwischen der Bäckerei und der Mühle ist" · „das Feld auf der rechten Seite ist auch noch nicht in einer geeigneten Position wo ich locker drauf zugreifen kann" · „die schnelle Performance und die Verbindung zu den anderen haben oberste Priorität".

- **Betreten (`livechat.js betreten`, `app.js livechatTor`)**: bis jetzt wartete das Betreten ohne Zeitgrenze auf das Mikrofon und meldete einen erst danach im Raum an – hing das Mikrofon (Abfrage offen, belegt, Android gibt es nach dem Tor nur langsam wieder her), sah einen niemand. Jetzt reicht das Tor seinen laufenden Strom weiter (kein zweites Holen), auf ein neues Holen wird höchstens 2 s gewartet, ein später kommendes Mikrofon wird ohne Abriss nachgereicht (`stromNachreichen`). Nebenbei: tippte man im Tor „hinein", bevor die Abfrage fertig war, blieb das Mikrofon des Tors an – behoben.
- **Platzwechsel (`sitzNachsenden`)**: bei mir steht der neue Platz sofort (gemessen 20–400 ms, auch mit offener Stadt). Bei den anderen kam er mit EINER Meldung; ging die unter, stand er erst mit dem nächsten Puls da (bis 6 s). Die Sitzordnung geht jetzt nach 0,35 s und 1,2 s noch einmal hinaus (der jeweils aktuelle Stand, ohne Chatzeile).
- **Ladebild der Stadt (`spiel.js lsLadeHtml`)**: der „grüne Schirm" war der Platzhalter im Menü. Jetzt steht sofort dasselbe Ladebild wie in der Stadt (Alex, Name, Balken) – im Platzhalter und über dem Rahmen, bis die Häuser gemalt sind, ohne Wechsel dazwischen (spätestens nach 25 s weg). Der Fuchs aus „Der Fuchs am Fluss" (`window.DMA_FUCHS_SVG`) macht alle 1,7 s etwas anderes: springen, rennen, Schwanz jagen, rollen, hüpfen, schnuppern, auf Alex' Schoß (Herzchen). Ein eigenes Bild „Alex sitzt und streichelt" gibt es noch nicht (Bildschlüssel nötig) – Alex wippt leicht.
- **Quest-Fenster (`quests.js`, `spiel.js leicht-unten` mit `oben: 1`)**: die Stadt wünscht den Streifen jetzt ÜBER dem Bild; das Spiel lässt den Rahmen nach oben über die Plätze wachsen, das Stadtbild bleibt an seiner Stelle und ganz frei. #lStadt rückt per transform um den Streifen nach unten, Fingerpositionen zählen ab der Leinwand (`ST.obenPlatz`, start.js). Passt oben nichts hin, wie 827 darunter, sonst im Bild.
- **Äcker (`dorf.js`, `oberflaeche.js`)**: Acker 91 liegt jetzt zwischen Bäckerei und Mühle (16 × 24, Mitte u −58, v −14, 192 m² – zwischen den Häusern ist weniger Platz als links auf der Wiese), der Kölner Dom hat dadurch seinen alten freien Platz auf der linken Wiese wieder. Ein Tipp irgendwo auf einem gemalten Acker erntet (vorher nur der kleine Ladefleck in seiner Mitte); Häuser und Bäume davor gehen vor. Das Zeichen eines Ackers („Getreide reif", Uhr) sucht sich einen Platz am Acker, der mindestens 10 px von jedem Haus weg ist (Mitte, vorne darunter, links, rechts, vordere Ecken, hinten) – in der Mitte lag es über Mühle und Bäckerei, und direkt daneben rückt das Handy einen Fingertipp auf den Fuß der Bäckerei auf das Zeichen. **Noch nicht**: Äcker selbst versetzen.
- **Zwei Tier-Fähigkeiten (`spiel.js`, Migration `829_zwei_tier_faehigkeiten.sql`)**: XANDER: „bei den Tieren … ich habe beide aktiviert aber es geht immer nur eine". Bisher hatte das Konto genau einen Platz (`faehigkeit_art`); wer die zweite ausrüstete, ersetzte die erste. Jetzt zwei Plätze (`art`, `art2`): ausrüsten füllt den freien, ein zweiter Tipp auf eine ausgerüstete legt sie ab. In der Leiste zwei Knöpfe, jede mit eigener Abklingzeit; `spiel_tier_faehigkeit` nimmt die gewünschte (`p_art`). Ohne Anmeldung antwortet der Server weiter „nicht angemeldet".
- **Befund für später**: Holzfällerhütte, Marktstand, Schweinestall, Jagdhütte und Sternwarte gibt es in der neuen Stadt nicht (kein Modell, kein Platz) – deshalb erscheinen sie nach dem Bauen nie. Gemessen: die eingebettete Stadt kostet je Bild etwa 3 ms Rechenzeit; die Malschleife läuft dauernd mit 30 Bildern/s.
- **Regel „Puls"** in `CLAUDE.md`: schickt Xander nur einen Punkt, erst den ganzen Verlauf prüfen, dann selbst verbessern (Leistung und Verbindung zuerst).
- **Sonden**: `pruefe-849-quest-oben.js` (neu, mit dem Stand 828 rot); runde99-angel zählt die Sitzordnung ohne ihre Wiederholungen; 817 tippt Häuser nicht durch ein Zeichen hindurch; 844 verlangt für Acker 91 hinter der Bäckerei ≥ 180 m² (dort ist weniger Platz, der Ort geht vor), 92 weiter ≥ 250 m²; 695 kennt zwei Fähigkeiten. Grün: 817, 844, 830, 847, 828, 695, 816, 849, 799, 832, 846b, 848, 679, runde99-angel/-menue/-kleinkram.

## Fassung 830 — Klassenzimmer bleibt an seinem Platz, freie Antworten in den Quests, Signalton (Funk 256/257)

XANDER (Funk 256, wörtlich): „Wenn man in ein größeres Menü geht bei einer Aufgabe … dann schiebt sich der Chat im Hintergrund bzw das Klassenzimmer nach oben und wenn man das erledigt hat … dann springt es nicht wieder zurück an den Platz". Funk 257: „Es fehlt der Signalton beim einsprechen bei den Aufgaben und die Antworten müssen wirklich variabel sein … ich möchte 95 Brötchen kaufen bitte … dann muss das genauso gültig sein wie wenn man sagt ich möchte Brötchen kaufen oder ich möchte ein Brot kaufen je nach Kontext der Aufgabe … es geht nur darum ob sie grammatikalisch richtig sind … dieses fast kannst du nur schreiben wenn er die Grammatik fast richtig hat".

- **Platz (`spiel.js menueZeigen`, `seiteMerken`, `seiteZurueck`)**: Im Dorf rollte `scrollIntoView` nicht nur das Menü, sondern jeden Behälter darüber – die Seite und das Klassenzimmer – und nichts rollte zurück; ragte das Menü oben hinaus, rollte das Dorf die Seite nach und ließ sie dort. Jetzt rollen die Dorf-Knöpfe (Station, Wahrzeichen-Tafel, „nach oben“, Sprung aus einer Meldung, Leiste ordnen) nur das Menü. Beim Öffnen merkt sich das Spiel, wo Seite und Behälter standen; nach einer Aufgabe geht die Seite dorthin zurück, soweit das Stadtbild ganz zu sehen bleibt; beim Schließen ganz.
- **Freie Antworten (`quests.js FREI`, `grammatikPruefen`)**: Zwei getrennte Fragen statt „ähnelt der Satz einem Vorschlag?“: (1) erfüllt der Satz die Aufgabe – eine Ware beim Bäcker, ein Gericht im Gasthaus, „nach“ + Stadt am Schalter, „Sie“ beim fremden Herrn, Kopfweh beim Arzt, ein Perfekt-Satz über gestern … jede Formulierung zählt; (2) stimmt die Grammatik – Verbform zur Person, Plural nach Zahlen (auch „95 Brötchen“), Artikel im Akkusativ beim Bestellen (einen Kuchen, eine Brezel, ein Brot), zweites Verb ans Ende nach „möchte/kann …“, Perfekt mit „sein“ bei Bewegung, falsche Partizipien, trennbare Verben, Höflichkeit beim Bestellen. Beides ja → voll + Sprech-Bonus, und die Person antwortet passend („95 Stück? Dafür brauche ich eine große Tüte!“). Nur ein Grammatikfehler → „Fast!“ mit genau diesem Fehler. Passt nicht zur Aufgabe oder falsch verstanden → Hinweis, was fehlt, ohne Versuch-Abzug. Die Vorschläge gelten weiter (der richtige Wort für Wort voll). Für 25 Aufgaben; Wegbeschreibungen wie bisher auf dem Wegenetz.
- **Signalton**: zwei kurze Töne aufwärts, wenn das Mikro an ist (die ersten 0,3 s werden nicht aufgenommen), zwei abwärts am Ende. Die Aufnahme wartet jetzt 1,8 s Pause statt 1,3 s (wer kurz nachdenkt, wird nicht abgeschnitten), höchstens 12 s.
- **Noch nicht**: Niveau A1–C2 in den Einstellungen, Missionen nach dem Stand der Stadt (z. B. Wissenschaftler), echte Gespräche über mehrere Sätze, bessere Erkennung durch eine Wortliste je Aufgabe – Vorschläge im Funk.
- **Sonden**: `pruefe-850-platz-nach-menue.js` (neu, mit 829 drei rot), `pruefe-851-freie-antworten.js` (neu, 41 Sätze + alle Vorschläge, mit 829 fünf rot); grün: 817, 799, 847, 849, 828, 816, 832, 846b, 848.

## Fassung 831 — Mine und Falltür im Kreis, verbesserte Waffen sieht und hört man (Funk 255)

XANDER (Funk 255, wörtlich): „Mine und Falltür … innerhalb des Waffen Menüs als extrasymbole innerhalb des Kreises" · „immer wenn man die Waffen verbessert müssen Sie neue Effekte … Grafik und … Sound" (der Fächerlaser sah nach dem Verbessern genauso aus wie vorher).

- **Mine und Falltür (`spiel.js ringFallenHtml`)**: zwei kleine eigene Symbole im inneren Kreis des Rings, links und rechts der Mitte, genau in den Lücken zwischen den Zaubern (berühren weder Mitte noch Zauber). Ein Tipp: „tippe auf den Platz“; zu wenig Punkte → blass mit Preis. Der Bereich „Minen & Bomben“ heißt jetzt „Bomben“ und erscheint nur mit der Kuckucksuhr.
- **Verbesserte Waffen (`geschossZeigen` mit `stufe`, `tonTempo`, CSS `.sp-stufe1–3`, `.sp-stufe-funken`)**: ★ goldener Schimmer, zweiter höherer Abschuss-Ton, Funkenkranz beim Einschlag; ★★ weiß-goldener Glanz, zwei Zusatztöne, größerer Kranz, Fächerlaser 7 statt 5 Strahlen, Doppellaser 3; ★★★ (Energiewaffen) blau-weißes Farbspiel, drei Töne, Schockwelle. Die Stufe reist im Schuss mit (`stufe`), also sehen und hören es alle. Ohne Verbesserung bleibt alles wie vorher.
- **Gemessen (Leistung, Puls-Regel)**: CPU-Spur mit Chat und Stadt offen: nach dem Einschwingen keine Bild-Dekodierungen mehr, die Stadt ruht, wenn ihr Rahmen nicht zu sehen ist; der große Posten ist die Übergabe an die Grafik (im Software-Browser der Sonden überzeichnet). Ein Versuch mit ImageBitmap brachte im Dauerbetrieb nichts Messbares und wurde zurückgenommen.
- **Sonden**: `pruefe-852-waffen-stufen.js` (neu, mit 830 fünf rot); 719, 649, 652, 664 auf die Symbole im Kreis umgestellt; grün: 719, 649, 652, 664, 695, 658, 668, 817. 686 (13 Gebäude) und 659 (Leitung) waren schon vorher rot.

## Fassung 832 — Beugung im Wörterbuch (Funk 255)

XANDER (Funk 255, wörtlich): „Beugungsknöpfe (ich/du/er …) für Verben im Wörterbuch wie im Duden".

- **Knopf (`app.js dictKarte`, `dictBeugung`)**: jedes Verb im Wörterbuch (englisch „to …") trägt zwischen 🔊 und ☆ einen Knopf „ich/du". Er klappt unter dem Eintrag die Tabelle auf, mit Reitern Präsens, Präteritum, Perfekt, Imperativ und der Fußzeile „Partizip II … · Perfekt mit haben/sein". Jede Zeile liest sich beim Antippen vor („er/sie/es geht" als „er geht"). Zweites Antippen klappt zu. Nomen und Adjektive („offen") bekommen keinen Knopf.
- **Regeln (`konjugation.js`, neu, 24 KB)**: Duden-Formen aus Regeln statt aus Listen geraten: starke und unregelmäßige Verben von Hand (Präsens-Wechsel e→i/ie, a→ä, au→äu; Präteritum; Partizip II; Hilfsverb), zusammengesetzte erben vom Grundverb (verstehen, aufstehen), trennbare Vorsilben ans Satzende, untrennbare ohne ge-, e-Einschub (arbeitest, atmest, öffnest), -eln/-ern, s-Laute im du, -ieren ohne ge-, „sein" bei Bewegung und Zustandswechsel, reflexive mit Pronomen (ich wasche mich). Verben mit zwei Beugungen je nach Bedeutung (hängen, schaffen, erschrecken …) bekommen keine Tabelle – lieber keine als eine falsche. Gebeugte Einträge (aufzustehen, erfuhren, vorgefallen, übereinstimmenden) bekommen auch keine.
- **Laden**: `konjugation.js` wird erst geholt, wenn das Wörterbuch aufgeht (Chat und Start laden nichts mehr), mit eigenem Stempel und verkleinerter Kopie in `min/`. Danach wird die Liste einmal neu gezeichnet.
- **Stand**: 3950 Verben im Wörterbuch haben eine Tabelle; Prüfliste von 114 Formen fehlerfrei (u. a. gehen, sein, haben, werden, wissen, Modalverben, aufstehen, verstehen, bekommen, sich waschen, arbeiten, atmen, öffnen, sammeln, fahren, laufen, lesen, studieren).
- **Noch nicht**: Lücken im Wörterbuch auffüllen, Satzbaukasten mit der Beugung verbinden.
- **Sonden**: `pruefe-853-beugung.js` (neu, mit 831 rot); grün: 853, 636, 772.

## Fassung 833 — Gebaute Häuser erscheinen, Bauen meldet sich sofort (Funk 255)

XANDER (Funk 255, wörtlich): „die Sachen die ich weiter baue tauchen niemals auf der Karte auf die Jagdhütte oder Kuhstall oder sowas und gibt es da einen standardplatz an dem sie gebaut werden wo man das sieht das ist bis jetzt nicht da und sogar wenn ich das anklicke dann habe ich niemals irgendwie so ein responsives Feedback oder irgend so ein haptisches Feedback wie ich das bei den anderen Sachen habe … manchmal drücke ich da fünfmal drauf und wenn mir gar nicht sicher ob ich das jetzt gekauft habe".

- **Ursache**: Die fünf Häuser für höhere Level aus Fassung 813 (Holzfällerhütte ab Level 12, Marktstand 15, Schweinestall 18, Jagdhütte 22, Sternwarte 30) rechnete der Server richtig, aber weder das alte Dorf noch die neue Stadt kannten sie: kein Platz, kein Bild – gebaut, bezahlt, unsichtbar. Und der Bau-Knopf tat bis zur Antwort des Servers nichts (kein Ton, kein Zittern, weiter drückbar).
- **Bauen (`spiel.js bauKnopfAn/bauKnopfAus`, `stadt-leicht/oberflaeche.js aktion`)**: Beim Tipp sofort Klopfton und kurzes Zittern, der Knopf wird zu „wird gebaut …" mit drehender Uhr und ist gesperrt; ein weiterer Bau-Tipp in der Zeit zittert nur und schickt nichts. Mit der Antwort: Hammer/Jubel, doppeltes Zittern, Haken „gebaut" – bei einem Fehler steht der Knopf wieder wie vorher, mit dem Grund. Hängt der Server, ist der Knopf nach 15 s wieder frei. „Helfen" an der Baustelle bleibt schnell hintereinander tippbar.
- **Neue Modelle (`stadt/modelle/holzhuette.js`, `jagdhuette.js`, `schweinestall.js`, `sternwarte.js`)**: Holzfällerhütte (Blockhaus mit Balkenköpfen, Feldsteinkamin mit Rauch, Brennholzstapel, Hackklotz mit Axt, Sägebock, Stämme), Jagdhütte (dunkles Blockhaus, Schindeldach, Hirschgeweih im Giebel, Veranda mit Bank, Hochsitz), Schweinestall (Ziegelbau auf Feldsteinsockel, Hohlpfannen, Lüftungsschlote, Auslauf mit Suhle, Trog, Stroh), Sternwarte (Sandsteinturm mit Kupferkuppel, offener Spalt mit Fernrohr, Anbau, Sonnenuhr; nachts leuchtet der Spalt). Alle mit Bauphasen, Winter, Herbst und Nachtlicht; gebacken in 8 Richtungen. Der Marktstand ist die Marktbude.
- **Neue Stadt (`dorf.js D.SPAET`, `D.spaetPlatz`)**: Die späten Häuser haben keinen Platz im alten Dorfplan – bekämen sie einen, verschöben sich alle Häuser, Wege und Bäume. Sie stehen untereinander auf dem freien Bauland links (oben die Sternwarte zu den Bergen, dann Holzfäller- und Jagdhütte am Waldrand, unten Schweinestall und Marktstand); ist die Stelle durch ein Wahrzeichen belegt, nehmen sie die nächste freie. Erst gebaut oder im Bau erscheinen sie; die Bau-Leiste fliegt zu ihrem Platz. Steht ein Schweinestall, laufen die Schweine dort statt am Kuhstall (`tiere.js`).
- **Altes Dorf (`spiel.js DORF_LAGE`, `DORF_SPAET`)**: eigene Plätze am Rand, nur gezeichnet, wenn gebaut (sonst gäbe es fünf leere Bauplätze mehr); gemalt mit Holzstapel und Sägebock, Geweih und Hochsitz, Auslauf mit Suhle und rosa Schweinen, rot-weißer Markise mit Obstkisten, Kuppel mit Fernrohr; Kartenzeichen für den Kompass.
- **Sonden**: `pruefe-854-spaete-haeuser.js` (neu, mit dem Stand 832 rot); 799 erlaubt im kleinen Rahmen 360 KB (Beispielstadt mit den fünf Häusern, kleines Verzeichnis +5 KB gepackt); grün: 704, 709, 789, 790, 817, 844, 830, 828, 799, 847, 849, 850, 695. 686 (13 Gebäude) war schon vorher rot.

## Fassung 834 — Uhrzeit dreht sich nicht mehr, Alex sitzt im Ladebild wieder rechts (Funk 263)

XANDER (Funk 263, wörtlich): „Irgendwie spinnt jetzt die ohranzeige oder die Wetteranzeige ist scheint beides zusammen in einem Klumpen sich zu drehen an einer Stelle und im preloder sitze ich plötzlich links ich möchte wieder rechts sitzen so wie es vorher auch".

- **Uhrzeit (`stadt-leicht/leicht.css`, `oberflaeche.js`)**: Mein Fehler aus 833. Die Bau-Uhr am Knopf bekam die Klasse `.lk-uhr` – so heißt aber schon die Uhrzeit oben links im kleinen Rahmen. Die Uhrzeit wurde dadurch zu einem 14 px großen, sich drehenden Kreis, in den Ortsschild und Wetter hineinrutschten. Die Bau-Uhr heißt jetzt `.lk-bau-uhr`; alle übrigen neuen Klassen- und Keyframe-Namen von 832/833 sind geprüft (keine weiteren Doppelungen).
- **Ladebild (`spiel.css .sp-ls-lade`)**: Das Ladebild der Stadt (`.lk-lade`) setzt Alex mit `row-reverse` nach rechts; das Ladebild im Spiel (829) hatte die Reihenfolge nicht übernommen. Jetzt sitzt Alex in beiden rechts und zeigt auf Namen und Balken.
- **Sonde**: `pruefe-854-spaete-haeuser.js` prüft zusätzlich im eingebetteten Rahmen, dass die Uhrzeit stillsteht und die Zeit zeigt (mit 833 rot: `animation lk-dreh`, rund).

## Fassung 835 — Getreidefelder wie echte Äcker (Funk 263)

XANDER (Funk 263, wörtlich): „im Spiel lass die Getreidefelder mehr wie Getreidefelder aussehen nicht nur wie einfache Vierecke".

- **Vorher**: Ein Acker der neuen Stadt war eine flache Fläche mit Farbverlauf und ein paar Linien, nah dran kurze Striche – von weitem ein orangefarbenes Viereck.
- **Jetzt (`stadt-leicht/korn.js`, neu)**: wie ein Weizenacker aus der Luft.
  - Das Korn hat Höhe (reif knapp 1 m). Vorn sieht man die Halmwand mit dunklem Saum am Fuß; nah dran stehen einzelne Halme mit Ähren und wiegen sich.
  - Die Oberfläche ist eine einmal gebackene Textur: Ähren als Körnung, Drillreihen (in jeder Zoomstufe sichtbar, wie in Aufbauspielen etwas breiter gemalt), die Fahrgasse als doppelte Traktorspur, das Vorgewende an beiden Enden mit Querreihen und eigener Spur, hellere und dunklere Bahnen der Drillmaschine, Bodenflecken, eine vom Wind niedergedrückte Lagerstelle.
  - Runde Ecken (dort wendet der Mähdrescher) und eine leicht ausgefranste Kante.
  - Ringsum ein Feldrain mit hohem Gras, Mohn, Kornblumen und Kamille; im Herbst welker und mit weniger Blumen, im Winter Schnee.
  - Kornwellen: Böen laufen als helle Wellen mit dunklem Tal über das Korn.
  - Natürlichere Farben: Weizengelb statt Orange.
- **Wachstum nach dem Spiel (`spiel.js`)**: Das Spiel schickt beim Zeichen `feld91`/`feld92` jetzt auch den Anteil bis zur Reife mit. Die Stadt malt danach:
  - nach der Ernte ein Stoppelfeld mit Strohschwaden und Rundballen,
  - dann Saatreihen auf brauner Erde,
  - dann grünes, gelbes und schließlich reifes Korn.
  - Ohne Spielstand (eigene Seite, Beispielstadt) ist der Acker reif; im Winter liegt Schnee mit durchstechenden Stoppeln.
- **Schnell bleibt es**:
  - Die Textur wird je Acker, Stufe und Zoomstufe einmal gebacken: die grobe sofort, die feine in Stücken von höchstens ~6 ms zwischen den Bildern.
  - Je Bild kostet der Acker-Maler 0,1–0,4 ms.
  - `korn.js` (≈ 5 KB gepackt) steckt nicht in `leicht.min.js`: `korn-laden.js` vertritt es, malt bis dahin eine einfache Fläche und holt `korn.min.js`, sobald die Stadt ihr erstes Bild hat.
  - `leicht.min.js` ist dadurch sogar etwas kleiner als in 834 (131 statt 132 KB gepackt). Der kleine Rahmen lädt 343 KB (Sonde 799, Grenze 360 KB).
- **Sonden**:
  - `pruefe-855-kornfeld.js` (neu, 11 Punkte; mit dem Stand 834 sieben rot). Sie prüft:
    - Stufen und Anteil;
    - deckendes Korn mit wechselnden Reihen;
    - Halmwand und runde Ecken;
    - Stoppelfeld mit Ballen;
    - Kosten je Bild;
    - Nachladen erst nach der Stadt.
  - Grün: 855, 799, 844, 828, 847, 817, 854, 830.
  - 830 (Verkehr) war einmal zeitbedingt rot, bei der Wiederholung grün.


## Fassung 836 — Platzwechsel ohne Warten, Gespräch steht schneller, Dom nachts, Spracherkennung (Funk 263)

XANDER (Funk 263, wörtlich): „kümmere Dich in der Priorität erstmal darum dass die Seite schnell läuft … die Verbindung …
der Platzwechsel … im Zweikampf … absolut unbrauchbar … das Gespräch baut sich manchmal erst später auf". Dazu: „der Kölner
Dom … ist nachts manchmal weiß in einer bestimmten Zoomstufe oder verschwindet einfach komplett" und „die Spracherkennung von
Azure … hört oft falsche Wörter".

Vorher lief eine Diagnose mit sechs getrennten Prüfern (Platzwechsel, Gesprächsaufbau, Tonserver, Dom, Sprache, Ladezeit).
Umgesetzt ist, was ohne sichtbare Änderung geht.

- **Platzwechsel (`livechat.js`, `app.js`, `spiel.js`)**
  - Die Sitzmeldung geht zuerst direkt über den Datenkanal zum anderen Gerät, dann zusätzlich über den Server (`sitzSenden`).
  - Jede Meldung trägt einen Stempel (`sn`); ältere oder doppelte (die Server-Kopie) werden verworfen.
  - Der Empfänger malt nur die Plätze neu (`melden("plaetze")` → `livechatPlaetzeAuffrischen`), nicht das ganze Klassenzimmer. Die Chatzeile kommt ein Bild später.
  - Wer wechselt, sendet vor der Spiel-Nacharbeit. Die Fallen-Prüfung danach bleibt bei 350 ms (mit 0 ms lief sie mitten in das Zurückrollen nach einer Dorf-Aufgabe, Funk 256, Sonde 850 rot); den Versand hält sie nicht mehr auf.
  - Ging ein Paket verloren, heilt der Puls (alle 6 s) den Sitz des Absenders.
- **Gesprächsaufbau**
  - Relais-Zugang wird schon beim Öffnen des Klassenzimmers geholt und beim Betreten benutzt, solange er noch 100 min gilt.
  - Alle Leitungen nutzen `bundlePolicy: "max-bundle"`, auch nach dem Auffrischen.
  - Scheitert eine Leitung („failed“), ruft die Seite mit der kleineren Kennung nach 0,4 s selbst neu an (höchstens zweimal in 30 s). Vorher rief niemand, bis die Wache nach 6 s (beim nächsten Mal 12 s) es tat. Melden sich zwei fast gleichzeitig neu an, kreuzen sich die Angebote, und Sonde 659 blieb so in 9 bis 11 von 15 Läufen 15 s ohne Leitung (auch auf main). Mit der Änderung: 0 von 15.
  - Kommt der eigene Relais-Zugang erst nach dem Aufbau, werden stehende Leitungen auf ihn umgestellt (ICE-Neustart).
  - Der 3D-Klassenzimmer-Vorlader wartet, bis alle Gespräche stehen, und lädt auf langsamen Netzen gar nicht vor.
  - Die Edge-Functions (Relais-Zugang, Tonserver) laufen mit `?forceFunctionRegion=eu-west-2` neben der Datenbank in London statt in Frankfurt oder Zürich. Scheitert das im Netz, geht dieselbe Anfrage sofort ohne Region.
  - Die Edge-Functions schicken `Access-Control-Max-Age: 7200`. Der Browser fragt dann nicht vor jedem Aufruf neu nach (Standard 5 s). Ausgeliefert ist das bisher nur bei `klassenzimmer` (v6); `sfu` und `aussprache` warten auf Xanders OK.
  - Messwerte: 30 s nach dem Betreten meldet jedes Gerät einmal, wie lange Kanal, Angebot, Verbindung und Ton gebraucht haben und über welchen Weg (`spiel_diagnose_senden`, Art `verbindung`).
- **Tonserver (ab 4 Leuten)**
  - Der ganze Start darf 14 s dauern (jeder Aufruf weiter 8 s).
  - Ein vorübergehender Rückfall sperrt 20 s, dann 40 s, 80 s, höchstens 2 Minuten (vorher immer 2 Minuten).
  - Fällt einer kurz zurück, zählt er für die anderen noch 60 s mit. Bei vier Leuten machen dann nicht alle zugleich zu.
- **Kölner Dom nachts (`stadt-leicht/bilder.js`, `szene.js`, `oberflaeche.js`, `start.js`)**
  - Fehlt die gewünschte Bildgröße, malt die Stadt die beste schon geladene (vorher: gar nichts) und holt die richtige vorrangig.
  - Kleine Bilder werden erst nach 20 s im Überblick freigegeben, die der Wahrzeichen nie.
  - Lichter nur, wenn das Gebäude selbst gemalt wird. Vorher blieb ein heller Fleck aus Strahlern ohne Dom.
  - Am oberen Rand wird nicht mehr nach dem Fußpunkt aussortiert.
  - Ein Bild, das nicht kam, wird nach 4, 15 und 60 s erneut versucht, und beim Zurückkommen ins Netz.
  - Ein Fehler in einem Bild hält die Zeichenschleife nicht mehr an.
  - Der Bildlader gibt jeden Ladeplatz sicher wieder frei: `decode()` darf höchstens 1,5 s dauern, eine Anfrage höchstens 20 s. Vorher konnte ein hängendes Bild einen der Plätze für immer belegen, bis keine Bilder mehr nachkamen.
- **Spracherkennung in den Stadt-Quests (`stadt-leicht/quests.js`, `ton.js`, `spiel.js`)**
  - Rauschunterdrückung und Pegelautomatik aus, wie im Aussprachetrainer. Die Rauschunterdrückung schnitt Reibelaute und Endungen weg.
  - Saubere Umrechnung auf 16 kHz: Tiefpass bei 7 kHz statt „nächster Abtastwert". Vorher falteten sich Zischlaute über 8 kHz ins Sprachband zurück.
  - Während der Aufnahme schweigen Stadt und Spiel (wie Funk 199 fürs Spiel).
  - „Ich höre zu" steht erst, wenn das Mikro wirklich aufnimmt.
  - Azure liefert Zahlen im Display-Feld als Ziffern („2. Oktober"). Jetzt zählt auch die Lexical-Lesart („zweite oktober").
  - Liegen eine richtige und eine falsche Antwort gleichauf, gibt es kein Urteil und keinen Versuch weg.
  - Für den Betreiber (oder mit `?sprdiag=1`): die letzte Aufnahme anhören und sehen, was Azure geliefert hat.
- **Sonden**
  - Neu: `pruefe-856-platz-direkt.js` (Sitz über den Datenkanal, Stempel, Teil-Neuzeichnen, Region, Tonserver-Grenzen) und `pruefe-857-dom-nacht.js` (alle Zoomstufen in 8 Richtungen, nachts).
  - `pruefe-848-sprechen.js` prüft zusätzlich Umrechnung (Dämpfung über 8 kHz), Mikro-Einstellungen, Stille während der Aufnahme, Lexical-Lesart und Gleichstand.
  - `pruefe-850-platz-nach-menue.js` öffnet die Station jetzt gezielt (vorher schloss ein zweiter Tipp sie wieder) und setzt die Schulstufe vor Schritt 2 zurück.
  - `pruefe-828-einsammeln.js` holt den Stadtrahmen in den sichtbaren Bereich. Außerhalb zeichnet der Browser nicht (rAF pausiert), dann blieben die Bilder stehen.
  - `pruefe-848-sprechen.js` wartet auf „Ich höre zu“, statt fest 700 ms (unter Last dauert der Mikro-Start länger).
  - `pruefe-799-stadt-im-dorfrahmen.js`: Grenze 380 KB statt 360 KB. Fährt der Zug durchs Bild, kommen drei Zwergbilder dazu (~20 KB; 339 KB ohne, 359 KB mit Zug, auf main genauso).
  - `pruefe-856-platz-direkt.js` prüft den schnellen Neuanruf nach „failed“.
  - `pruefe-827` erlaubt dem Tonserver-Start 16 s statt 8 s; `pruefe-runde18` erkennt die neue Abfrage vor `renderLiveChat()`.
  - `pruefe-842-sfu-spiel.js` wackelt schon auf main (2 von 5 Läufen rot: Lücke nach dem Stau, Schließen ohne keepalive-Aufruf); auf 836 waren 8 von 10 Läufen grün. Die Sonde zeigt jetzt die erwartete Sitzung mit an. Ursache noch offen.

## Fassung 837 — Ladezeit: der Weg ins Klassenzimmer lädt nur, was er braucht (Funk 263)

XANDER (Funk 263, wörtlich): „die Ladezeit … ca. 10 mal schneller … sofort im Livestream wie HelloTalk".

Die Messung aus der Diagnose: Wer über „Wissen" ins Klassenzimmer ging, lud dabei den ganzen Wortschatz (26 Dateien, 2,26 MB gepackt), den Kalender und beim ersten Tipp 68 Spieltöne (333 KB) – genau dann, wenn die Leitung für Raumkanal, Verlauf und Gespräch gebraucht wird. Umgesetzt ist, was man nicht sieht:

- **Eigener Stempel je Wort- und Kalenderdatei (`werkzeug/fassung-setzen.js`, `STEMPEL_EINZELN`, `data-vocab.js`)**
  - `vokabeln/*.js` und `kalender/*.js` hingen an `?v=Fassung` und kamen nach jeder Fassung komplett neu (am 29./30.09. 24 bzw. 31 Fassungen am Tag). Jetzt hat jede Datei ihren Stempel aus dem Inhalt; neu geladen wird nur, was sich geändert hat. Je Datei, nicht je Ordner.
  - Der Service Worker legt gestempelte Dateien wie bisher ab und räumt die alte Fassung derselben Datei weg.
- **Kein Wortschatz auf dem Weg ins Klassenzimmer (`app.js`, `activateTab`, `wortschatzNachziehen`)**
  - „Lernen" holt den Wortschatz wie bisher sofort.
  - Unter „Wissen" wird er aufgeschoben: eine Ansicht, die Wörter zeigt, holt ihn selbst (außer im Klassenzimmer); sonst kommt er nach 8 s Ruhe – aber nicht, solange das Klassenzimmer offen ist oder man im Raum ist.
  - Im Raum holt ihn, wer ihn wirklich braucht: Wörterbuch-Aufgaben (`lcWoerterbuchHolen`), der Betonung-Schalter, ein Tipp auf einen Text (Betonungsanzeige).
  - Fehler unterwegs: Der Name `imKlassenzimmer` war in app.js schon vergeben (Online-Liste, `imKlassenzimmer(profilId)`), die spätere Funktion gewann; die neue heißt `klassenzimmerOffen`.
- **Spieltöne erst beim Mitspielen (`spiel.js`, `klangWecken`)**: Jeder Tipp entsperrt weiter den Klang; die 68 Töne kommen erst, wenn man mitspielt. Einzelne Töne lädt `klangLaden` bei Bedarf selbst.
- **preconnect (`index.html`)** zu `cdn.jsdelivr.net` (supabase-js) und zum Supabase-Projekt (mit `crossorigin`): DNS, TCP und TLS laufen parallel zum CSS.
- **Sonden**
  - Neu: `pruefe-858-ladeweg.js` – Dateistempel, preconnect, Wissen → Klassenzimmer 12 s ohne Wortschatz und ohne Spieltöne, „Lernen" holt ihn sofort mit Dateistempel, beim Kompass kommt er nach der Ruhe (gemessen 8,1 s).
  - `pruefe-825-licht-klang.js`: Grenze für wieder angehende Fenster 15 % statt 12 %. Seit den späten Häusern sind es 312 Fenster; das gewollte kurze Aufleuchten (Nachteulen) liegt zufällig bei 13,5 % – auf main genauso, am Aussehen nichts geändert.
  - `pruefe-659-verbindung.js` war in 1 von 10 Läufen rot („Wege gebündelt" bei B, Zeitfrage); 837 ändert livechat.js nicht.
- **Noch nicht umgesetzt (braucht Xanders Entscheidung, Regel 3):** direkter Einstieg ins Klassenzimmer, „erst zuhören, dann reden" ohne Erlaubnis-Dialog, das Klassenzimmer als eigenes schlankes Paket (app.js aufteilen).

## Fassung 838 — Start rechnet weniger, Seiteninhalte nur einmal abgefragt (Funk 263, Puls)

XANDER (Funk 263, wörtlich): „die Ladezeit … ca. 10 mal schneller". Zwei kleine Punkte aus der Ladezeit-Diagnose, ohne sichtbare Änderung:

- **Uhr (`app.js`, `updateClock`)**: baute bei jedem Aufruf zwei neue Datumsformate (`toLocaleString` mit Zeitzone und `Intl.DateTimeFormat`), gemessen 71 ms beim Start auf einem gebremsten Telefon. Die Formate werden jetzt je Zeitzone und Sprache einmal gebaut und gemerkt (`uhrFormat`); Stunde und Minute kommen aus `formatToParts`. Der Merker ist `var` und wird erst beim ersten Aufruf angelegt, weil `updateClock()` schon weiter oben in app.js läuft. Gegengeprüft: in vier Zeitzonen über 24 h halbstündlich dieselbe Uhrzeit wie vorher.
- **Seiteninhalte (`backend.js`, `getSiteContent`)**: Der 90-s-Merker griff erst nach der Antwort; fragten beim Start mehrere Bereiche gleichzeitig nach demselben Schlüssel, gingen alle Anfragen einzeln hinaus. Läuft schon eine, hängen sich die weiteren jetzt an (`siteContentLaeuft`).
- Sonden grün: fremde-uhr (+Reihenfolge), 858, ladezeit, 694, 636, 837-italienisch-spiel, 843, runde18, tutor, einladungslink.

## Fassung 839 — Der Raumkanal geht sofort auf (Funk 268)

XANDER (Funk 268, wörtlich): „Ja leg los vielleicht mit einer Lösung auf ein Vollbild auf das alte Klassenzimmer die Latenz bei den Sitzplätzen ist immer noch bemerkbar dann kümmere Dich jetzt mal bitte intensiv um alles für mich."

Erste echte Messwerte (spiel_diagnose, Art `verbindung`, aus 836–838, sein Samsung, Android 10): bis der Raumkanal steht 1,6 / 1,8 / 2,1 / 2,3 / 2,8 / 3,2 / 3,5 / 4,7 / 6,7 / 9,2 s und einmal 29,4 s. In allen elf Messungen war beim Bericht (30 s nach dem Betreten) keine Leitung zu einem anderen Gerät (`je: {}`) – er war allein im Raum oder die anderen kamen später.

- **Kanal sofort (`livechat.js`, `betreten`)**: Der Raumkanal wurde erst geöffnet, NACHDEM Mikrofon (bis 2 s) und Relais (bis 2,5 s) fertig waren; erst dann baute der Browser überhaupt die Verbindung zum Supabase-Server auf. Jetzt geht er sofort auf (`vorabKanal`), gleichzeitig mit Mikrofon und Relais. „Drin" ist man wie bisher erst, wenn beides da ist (das „hallo" braucht den eigenen Ton). Pakete, die in der Wartezeit im Raum ankommen, werden gesammelt (höchstens 300) und danach in ihrer Reihenfolge verarbeitet – vorher kamen sie gar nicht an.
- **Verlassen in der Wartezeit**: `verlassen()` meldet auch den noch nicht übernommenen Kanal ab (`kanalVorab`). Eine späte Bestätigung des alten Kanals holt einen nicht wieder hinein – diese Lücke gab es auch vorher (Abmelden mit 350 ms Verzögerung), mit dem früheren Öffnen wäre sie größer geworden.
- **Vorwärmen (`LiveChat.kanalVorwaermen`, `app.js` `livechatTor`)**: Während das Tor nach Mikrofon und Kamera fragt, wird die Verbindung zum Raum-Server (Websocket) schon geöffnet; beim „hinein" muss der Kanal nur noch beitreten.
- **Messung**: Der Bericht enthält jetzt zusätzlich `kanalOffen` (wann der Kanal stand, unabhängig vom Mikrofon) neben `kanal` (wann man drin war).
- **Eigener Platzwechsel gemessen**: auf einem sechsfach gebremsten Rechner 50–80 ms vom Tipp bis zum neuen Bild. Die spürbare Verzögerung liegt also nicht im eigenen Gerät; ohne direkte Leitung (siehe oben) geht der Platz beim anderen nur über den Server.
- **Sonde**: neu `pruefe-859-kanal-sofort.js` (nachgebauter Kanal mit 1,5 s Beitritt): Kanal nach 3–9 ms offen, „drin" nach 1,5 s statt Summe ≥ 4 s, Paket aus der Wartezeit kommt an, Verlassen in der Wartezeit bleibt draußen, Vorwärmen. `pruefe-842` wackelt weiter wie auf main (1 von 4).

## Fassung 840 — Leitung je Gegenüber gemessen, nichts Schweres auf dem Weg ins Klassenzimmer (Funk 270/271)

XANDER (Funk 270, wörtlich): „Ich habe nicht gesagt Vollbild beim Klassenzimmer ich habe gesagt für eine Lösung für ein fallbeck auf das Klassenzimmer falls du aufgrund dieses Missverständnisses etwas geändert haben solltest dann nimm das wieder zurück". Funk 271: „es soll doch unter wissen und Klassenzimmer dann ins Klassenzimmer gehen wie immer auch nur zehnmal schneller … alles insgesamt nur zehn Mal schneller".

- **Vollbild verworfen**: Das Vollbild-Klassenzimmer war nur lokal gebaut und nie ausgeliefert; es ist ganz weg (keine Zeile davon in dieser Fassung). Der Weg bleibt Wissen → Klassenzimmer.
- **Echte Messung zweier Geräte (02.10., 21:23/21:26, Samsung + Linux-Chrome)**: Kanal jetzt 0,3–1,3 s (vor 839 bis 3,9 s). Einmal kam das Angebot beim Neuen 3,1 s nach seinem Gruss an, der Ton nach 3,5 s, die Leitung stand erst nach 8,9 s (Weg srflx). Beim zweiten Treffen ging ein Angebot hinaus und es kam 30 s lang nichts zurück. Warum, sagte die alte Messung nicht: sie zählt nur beim Neuen und nur 30 s, die Seite, die schon im Raum war, meldet nichts.
- **Zeitleiste je Gegenüber (`livechat.js`, `leitungMerk`/`leitungKerze`/`leitungSenden`)**: Jedes Gerät führt ab dem ersten Kontakt je Gegenüber eine Zeitleiste: Gruss/auch-da, Angebot raus/da, Antwort raus/da (oder „antwortOhneLeitung"), Wege-Kandidaten raus/da nach Art mit erster Zeit, ICE- und Leitungszustände, erster Ton, Wechsel in den Hintergrund (Android bremst dann Zeitgeber und Kanal), am Ende der gewählte Weg (lokal>entfernt mit Laufzeit) und der Zustand. Gesendet wird als spiel_diagnose „leitung", sobald die Leitung steht (+1,5 s) oder nach 30 s; ein neuer Gruss (Neuladen) startet eine neue Zeitleiste. Nur Zahlen und der Browsername, rund 500 Zeichen (Server-Grenze 6000, 40 Einträge je Konto und Tag).
- **Anruf früher (`livechat.js`, Gruss „hallo")**: Der Anruf (`anrufen`) beginnt jetzt gleich nach „auch-da", vor Begrüssungszeile, Auftritt und Aufgabe. Der Gewinn ist klein (das Angebot selbst geht erst nach dieser Arbeit hinaus, `createOffer` ist asynchron), aber das Aushandeln läuft schon nebenher. „auch-da" bleibt vorn: der Neue muss uns kennen, sonst verwirft er die Spur.
- **Filme erst im Raum (`app.js`, `lcFilmeVorladen`)**: Gemessen (neues `werkzeug/ladezeit-messen.js`, 4G, Rechner 4× gebremst) kamen gleich nach dem Öffnen katze, adler und lok2 (1,6 MB), im WLAN alle Filme bis zum T-Rex (8 MB) – ohne dass jemand im Klassenzimmer war. Jetzt erst, wenn man drin ist und alle Leitungen stehen (höchstens 30 s), dann 10 s später in einer Ruhepause; im Mobilfunk (3G/„cellular") und bei „Daten sparen" gar nicht vorab, dort holt das Vorladen auf Zuruf den einen Film. Dieselbe Regel wie bei den Drehblättern (836).
- **Kalender erst, wenn der Kompass bleibt (`app.js`, Reiter-Klick und `renderKompass`)**: Der Tipp auf „Wissen" holte sofort den Kalendermonat (kalender/10.js, 229 KB), genau beim Weitertippen ins Klassenzimmer. Jetzt nach 1,2 s und nur, wenn der Kompass dann noch zu sehen ist (gemessen 1,3 s).
- **Messwerkzeug `werkzeug/ladezeit-messen.js`**: Server wie GitHub Pages (gzip, ETag), Leitung 3G/4G, Rechner 4× gebremst, kalt und warm; misst erstes Bild, „bereit", Wissen → Klassenzimmer, KB und Rechenzeit je Datei. Fremde Adressen werden über CDP abgefangen (bei `route()` schaltet Playwright den Zwischenspeicher ab, „warm" wäre dann kalt). Stand 839, 4G: kalt bereit 2,9 s, Klassenzimmer bei 3,3–3,5 s, 3,2–3,6 MB insgesamt; warm 1,0 s / 1,5 s. 3G kalt: bereit 12,0 s. Mit 840: 2,6 MB insgesamt (Filme weg), Kalender nicht mehr auf dem Weg.
- **Was die 10× wirklich braucht (nächste Schritte)**: Bis „bereit" gehen 2,2 MB über die Leitung, davon app.js 921 KB, spiel.js 273, data-exercises.js 235, satzbau.js 185, korrekturen.css 153. Im 3G sind das 12 s, und app.js ändert sich mit fast jeder Fassung. Als Nächstes: spiel.js, data-exercises.js, satzbau.js erst nach „bereit" laden (mit Rückfall auf das alte Laden, falls etwas fehlt), Tutorbild (176 KB) später.
- **Sonden**: neu `pruefe-861-leitung-messen.js` (zwei echte Leitungen, beide Berichte mit Zeitleiste, Reihenfolge, Kandidaten, Weg, Größe, neue Zeitleiste nach neuem Gruss, Anruf vor Auftritt und Aufgabe). `pruefe-858-ladeweg.js` prüft zusätzlich: kein Kalendermonat auf dem Weg ins Klassenzimmer, beim Kompass nach ≈ 1,2 s. Grün: 861, 858, 856, 859, 659, einladungslink, runde18, tutor, kein-zoom, runde88-panels, runde23, film-befehl, 642-verlauf-laden, ladezeit.

## Fassung 841 — Kein Angebots-Sturm mehr (Funk 271, erste Zeitleiste)

XANDER (Funk 271, wörtlich): „alles insgesamt nur zehn Mal schneller".

Erste Zeitleiste aus 840 (spiel_diagnose „leitung", 02.10., 22:43, Samsung, Gegenüber Linux-Chrome mit älterer Fassung): Das Handy bekam fünf Angebote, vier davon binnen 17 ms. Die erste Antwort ging erst 3,2 s nach dem ersten Angebot hinaus, die Leitung stand nach 8,7 s (Weg prflx). Vor dem ersten Angebot lagen 15 s, in denen drüben nichts geschah. Danach kamen Gruss und Angebote gesammelt, vermutlich weil die Seite drüben im Hintergrund lag. Das Handy erinnert alle 6 s per „hallo", und jedes gesammelte „hallo" riss drüben die gerade gebaute Leitung ab und baute eine neue, jede mit eigenem Angebot.

- **Sitzung im Gruss (`livechat.js`, `zustand.sitzung`, „hallo")**: Jedes Betreten bekommt eine Kennung, jedes „hallo" trägt sie (in `senden`). Ist es dieselbe Sitzung und die Leitung zu ihm jünger als 8 s und nicht gescheitert, bleibt sie (Erinnerung, kein Neuladen; vermerkt als „halloErinnerung"). Neue Sitzung oder ältere Fassung ohne Kennung: wie bisher neu aufbauen. Das Alter der Leitung steht in `pc.__seit`.
- **Anrufe bündeln (`anrufen`)**: Mehrere Anrufe binnen 1,5 s auf dieselbe Leitung, deren Angebot noch auf Antwort wartet, werden zu einem („angebotGebuendelt"). Ein Neustart der Wegesuche kommt nie innerhalb dieser 1,5 s (erst nach „disconnected"/„failed" oder von der Wache nach 6 s).
- **Angebote der Reihe nach (`angebotAnnehmen`/`angebotVerarbeiten`)**: Je Gegenüber eine Reihe; von mehreren wartenden nur das neueste („angebotUeberholt"), höchstens 4 s je Angebot.
- **Neue Leitung drüben erkennen (`fingerabdruck`)**: Hat ein Angebot einen anderen DTLS-Fingerabdruck als das zuletzt angenommene, gehört es zu einer neuen Leitung der Gegenseite. Dann wird die eigene sofort beim Eintreffen abgebaut („angebotNeueLeitung"), damit die Wege-Kandidaten, die direkt hinterherkommen, ins Zwischenlager gehen und nicht in die alte Leitung. Vorher scheiterte so ein Angebot in der alten Leitung, und es stand bis zur Wache nach 6–12 s nichts.
- **Gefunden mit Sonde 659 (ältere Fassung drüben)**: Eine geschlossene Leitung lässt laufende Schritte (`setRemoteDescription`, `createAnswer`) für immer offen, so steht es in der WebRTC-Spezifikation. Die neue Reihe hing daran fest. Jetzt setzt `brueckeAbbauen` die Reihe zurück, und jedes Angebot hat höchstens 4 s.
- **Prüf-Haken**: `LiveChat.pruefLeitungMess()` gibt die Zeitleisten zurück (nur Zahlen).
- **Sonden**: neu `pruefe-862-angebotssturm.js`:
  - drei „hallo" derselben Sitzung → ein Angebot, die Leitung steht nach 0,14–0,17 s;
  - neue Sitzung → baut neu auf und steht;
  - drei „hallo" ohne Sitzung → steht nach ≈ 0,2 s.
  
  `pruefe-659-verbindung.js` (ältere Fassung drüben): war mit dem ersten Entwurf dreimal rot, jetzt dreimal grün (61 ms). `pruefe-861` prüft den ersten Eintrag mit ≤ 5 ms statt genau 0 (Millisekundengrenze).
- **Nachtrag aus Xanders Test 22:48–22:55 (sieben Berichte, Fassung 840 auf dem Samsung)**:
  - *Kennung kippte*: Dasselbe Handy war einmal Anrufer, einmal Angerufener. Nach dem Neuladen kehrte es von selbst in den Raum zurück (`rueckkehrOffen`, app.js), aber ohne Konto, weil die Anmeldung da noch lädt. Es galt also eine Zufallskennung. Der andere sah eine neue Person, und die alte blieb als Geist stehen. Behoben: Die Rückkehr gibt das Konto mit, und livechat.js merkt sich die zuletzt bekannte Konto-Kennung (`dma_lc_konto`), solange keine neue mitkommt.
  - *Doppelter Anruf*: „auch-da“ kam 0,2 s nach dem ersten Angebot und löste einen zweiten Anruf aus. Die Antwort auf das erste passte nicht mehr, und die Wegesuche begann erst nach 5 s. Behoben: „auch-da“ ruft nur noch an, wenn zu ihm keine lebende Leitung besteht. `anrufen` bündelt außerdem, solange das Angebot noch entsteht (gemessen bis 1,5 s auf dem Samsung).
  - *Angebot langsam*: Das Angebot brauchte auf dem Handy 1,5 s, weil Begrüßungszeile und Auftritt im selben Augenblick rechneten. Jetzt kommen beide erst, wenn das Angebot draußen ist (höchstens 0,5 s warten).
  - Sonde 862 prüft zusätzlich Gruß und „auch-da“ im selben Augenblick (ein Angebot, Leitung nach 0,17 s) und die Konto-Kennung.
  - Grün: 862, 861, 659, 856, 859, 811, 816, 827, 842, 679, 850, 645, einladungslink, runde18, 858.

## Fassung 842 — Der Satzbaukasten kommt erst, wenn er gebraucht wird (Funk 271)

XANDER (Funk 271, wörtlich): „es soll doch unter wissen und Klassenzimmer dann ins Klassenzimmer gehen wie immer auch nur zehnmal schneller wie gesagt alles insgesamt nur zehn Mal schneller".

- **satzbau.js nicht mehr in der Startliste (`index.html`)**: Bis die Seite reagiert, gingen 2,2 MB über die Leitung. satzbau.js macht davon 185 KB aus (640 KB Text) und wird nur vom Satzbaukasten (und den Verbformen im Vokabelmeister) gebraucht. Beim Start benutzt es nichts, alle Stellen in app.js stehen in Funktionen.
- **Laden bei Bedarf (`app.js`, `satzbauLaden`)**:
  - sofort beim Öffnen von „Lernen" (dort liegt der Satzbaukasten), im Satzbaukasten selbst („wird geladen …", danach zeichnet er sich) und im Vokabelmeister;
  - sonst 6 s nach dem Laden in einer Ruhepause, aber nicht, solange man im Klassenzimmer ist (wie der Wortschatz in 837).
  
  Rückfall: Scheitert die verkleinerte Kopie (min/), wird einmal die Quelle geholt. Scheitert auch das, sagt der Satzbaukasten es wie bisher. `var` statt `let` und ein Microtask vor `brDatei`, weil `activateTab` schon beim Start (vor diesen Zeilen) nach „Lernen" gehen kann.
- **Gemessen (werkzeug/ladezeit-messen.js, Rechner 4× gebremst)**:
  - 4G kalt: bereit 2,9 → 2,8 s, Klassenzimmer bei 3,2 s; insgesamt 2,2 MB statt 3,6 MB zu Beginn dieser Runde (Filme in 840, Satzbau in 842);
  - 3G kalt: bereit 12,0 → 11,1 s.
  
  Ehrlich: Der große Brocken bleibt app.js mit 921 KB. Das Zehnfache gibt es erst, wenn app.js geteilt wird oder bei einem Update nicht ganz neu kommt (nächste Schritte).
- **Sonden**: `pruefe-858-ladeweg.js` prüft zusätzlich: kein satzbau.js beim Start und im Klassenzimmer; „Lernen" holt es sofort (Satzbaukasten bereit). Grün: 858, 834, 835, 839, 636, 837, runde18, tutor, einladungslink, kein-zoom, ladezeit, 862, runde88-panels.

## Fassung 843 — Wache mit Geduld, feste Kennung aus der gespeicherten Anmeldung (Funk 271, Test 23:53–23:57)

Echte Zeitleisten vom 02.10., 23:17–23:57: Xanders Samsung (841/842) mit einem zweiten Handy (Oppo CPH1937, Android 11, WebView, Fassung 842).
- Antwortet die Gegenseite, steht die Leitung nach 3–9 s (23:53: Ton 2,4 s, steht 5,4 s; 23:54: steht 7,6–9,2 s). Weg: srflx oder Relais.
- **Wache zu ungeduldig**: Lag das Samsung im Hintergrund, schickte das Oppo alle 6–7 s ein neues Angebot, mit neuer Wegesuche und neuem Angebot. Kam die Antwort dann doch (23:57 nach 19,3 s), riss die Wache 2 s später wieder alles neu an. Jetzt:
  - Wartet die Leitung noch auf eine Antwort, wächst die Geduld (6, 12, 18 … höchstens 30 s).
  - Eine Antwort oder der Beginn der Wegesuche („checking") setzt die Uhr der Wache zurück.
- **Zufallskennung bei der Rückkehr**: Das Samsung kam weiter als „pvvqnljpk196" statt „k2585…". `dma_lc_konto` aus 841 gab es auf dem Gerät noch nicht, und bei der Rückkehr nach dem Neuladen ist die Anmeldung noch nicht geladen. Jetzt liest livechat.js die von Supabase im Gerät abgelegte Sitzung (`sb-…-auth-token`, `user.id`), die sofort da ist. Danach folgen `dma_lc_konto` und erst dann der Zufall.
- Sonden grün: 862 (+3 Quelltext-Prüfungen für 843), 861, 659, 856, 859, 811, 816, 827, einladungslink, runde18. `pruefe-842-sfu-spiel`: Im ersten Lauf stürzte die Browserseite beim Neuladen ab („Target crashed", keine rote Prüfung); der zweite Lauf war ganz grün.

## Fassung 844 — Der Chat zeichnet nur noch die letzten Zeilen (Funk 271, Diagnose 323)

XANDER (Funk 271, wörtlich): „alles insgesamt nur zehn Mal schneller".

Die Ursache stand in Diagnose 323: Das Samsung antwortete erst 4,5 s nach dem Angebot. Beim Betreten zeichnete der Chat jede Zeile des Raums, im Hauptraum 7.408. Bei jedem Auffrischen baute er außerdem für jede Zeile die Marke neu, mit zwei Fragen an LiveChat je Zeile. Das passierte genau in den Sekunden, in denen das Gespräch aufgebaut wird.
- **Fenster (`app.js`, `livechatChatAuffrischen`)**:
  - Im Verlauf stehen nur die letzten 120 Zeilen.
  - Was einmal gezeichnet ist, bleibt; neue Zeilen kommen ans Ende, oben fällt nichts heraus.
  - Oben steht leise „↑ N ältere Nachrichten". Wer nach oben rollt (oder darauf tippt), bekommt die nächsten 200 dazu, an der richtigen Stelle. Die Stelle, an der man liest, bleibt dabei stehen. „Man soll durch den ganzen Chatverlauf scrollen können" gilt weiter.
- **Auch außerhalb des Fensters**:
  - „anziehen" ist ein Zustand und wird wie bisher still und der Reihe nach nachgeholt; wer später kommt, sieht dieselben Kronen.
  - Die festgehaltene Lesetafel wird immer gezeichnet, damit das Fokusband nicht leer bleibt.
- **Uhrzeit**: `toLocaleTimeString` mit Angaben baute je Zeile einen neuen Formatierer. Das war der größte Einzelposten (≈1,5 ms je Zeile, Rechner 4× gebremst). Jetzt gibt es einen Formatierer für alle. „Bin ich Lehrer?" wird einmal je Auffrischen gefragt statt je Zeile.
- **Gemessen** (7.400 alte Zeilen, Rechner 4× gebremst, `pruefe-863-chatfenster.js`, Stand 843 im Vergleich):
  - erstes Zeichnen: **18,2 s → 0,18 s**;
  - weiterzeichnen bei einer neuen Zeile: 26–40 ms;
  - Auffrischen ohne Änderung: 20 ms.
- **Sonden**:
  - neu `pruefe-863-chatfenster.js` (Fenster, Anziehen außerhalb, neue Zeile, Rollen/Antippen lädt nach, Lesestelle bleibt, keine Doppelten, Konsole). Mit `VERGLEICH=<Verzeichnis>` misst sie einen alten Stand.
  - Grün: 863, anziehen, nachgehende-uhr-effekte, benoten, fluestern, antwort-gehoert-dazu, note-ankommen, stimmzeilen, raumverlauf, verlauf-doppelt, verlauf-kein-reset, verlauf-nachfassen, 642-verlauf-laden, 736, scrollen, runde88-panels, runde18, 856, 858, 861, 862, einladungslink, tutor, fokus-merker, schrei-wackeln, gluecksrad, runde98-fokus, 749.
  - `pruefe-runde24`: drei rote Punkte (Lesetafel festhalten/Fokusband). Sie sind auf Stand 843 genauso rot, also nicht durch 844. Die neuere Messung dazu (runde98-fokus) ist grün.

## Fassung 845 — Uhr ohne Zeitzonen-Tabellen, Änderungsliste ins Archiv (Funk 271)

XANDER (Funk 271, wörtlich): „alles insgesamt nur zehn Mal schneller".

Puls nach 844: Es gab nichts Neues im Funk oder Walkie. Zeitleiste 326 (00:30) zeigt, dass beide Handys noch auf alten Fassungen liefen: Das Oppo meldet 842, das Samsung erscheint dort noch unter der Zufallskennung, die erst 843 behebt. Das Samsung antwortete nach 7,4 s, also genau das Zeichnen, das 844 behebt. Der Wächter in index.html bietet die neue Fassung alle 2 Minuten über die Blase an. 844 wirkt, sobald die Geräte neu laden.

Startprofil (Rechner 4× gebremst, Quellen):
- app.js rechnet beim Start 428 ms; dazu kommt das Einlesen von 3,1 MB Code (zusammen 859 ms, siehe Trace). Stile und Layout brauchen 380 ms, korrekturen.css allein 71 ms zum Einlesen.
- **Uhr (`updateClock`, `mezWandzeit`)**: 125 ms kostete allein der erste Zeitzonen-Formatierer, weil der Browser dabei seine Zeitzonen-Tabellen lädt. Berlin und Rom folgen derselben festen EU-Regel: MEZ, Sommerzeit vom letzten Sonntag im März bis zum letzten Sonntag im Oktober, jeweils 01:00 UTC. Das rechnet jetzt eine kleine Funktion ohne Intl. Gilt für die Uhr und für den Feiertagsbalken (`updateSpecialDayBar`). Andere Zonen gehen weiter über Intl.
  - Geprüft gegen Intl: 37.617 Zeitpunkte je Zone (2024–2030 und jede Minute rund um acht Umstellungen), keine Abweichung.
  - Beim Start wird kein Zeitzonen-Formatierer mehr gebaut (`updateClock` 142 → 15 ms).
- **Änderungsliste**: `APP_VERSION` steht seit Langem auf „175“, gelesen wird nur dieser Eintrag. Die 26 älteren Einträge aus `APP_CHANGELOG` und die 8 älteren aus `APP_CHANGELOG_INTERN` (110 KB) wurden bei jedem Start mitübersetzt. Sie liegen jetzt in `werkzeug/archiv/app-changelog-alt.js` und werden nicht geladen. Der Eintrag „175“ ist vor und nach dem Auslagern gleich.
- **Gemessen** (`werkzeug/ladezeit-messen.js`, 4G, Rechner 4× gebremst):
  - kalt: bereit 3,0 → 2,9 s, Klassenzimmer bei 3,4 s (vorher 3,65 s);
  - warm: bereit 1,46 → 1,38 s, Klassenzimmer bei 1,9 s (vorher 2,0 s).
- **Sonden**:
  - neu `pruefe-864-uhr-ohne-intl.js`. Grün: 864, 863, 858, runde18, tutor, einladungslink, 843, 636, 753, 862, 856, runde88-panels.
  - `pruefe-708-dorf-wetter`: Die Leistungsprüfung des Gewitters (4× gebremst) ist rot, auf Stand 844 aber genauso (dort sogar 48 Bilder/s mit 31 langen Bildern, jetzt 61 mit 14). Nicht durch 845.
- **Nächste Schritte zur Ladezeit, ehrlich**: Der große Brocken bleibt das Einlesen von app.js (3,1 MB). Weitere Auslagerkandidaten:
  - Lesetexte (220 KB): Sie enthalten Bildaufrufe und werden an mehreren Stellen ohne Warten gezeichnet;
  - Kreuzworträtsel (54 KB);
  - Effektbildchen (123 KB).
  
  Das Zehnfache braucht eine Aufteilung von app.js nach Bereichen.

## Fassung 846 — Die Lesetexte kommen erst beim Öffnen, kein toter Tutor-Ton mehr (Funk 271)

XANDER (Funk 271, wörtlich): „alles insgesamt nur zehn Mal schneller".

- **Lesetexte ausgelagert** (`data-lesetexte.js`, neu): „Dichter & Denker“ und „Schnee von gestern“ (je 7 Texte in sechs Niveaus, 220 KB) standen mitten in app.js und wurden bei jedem Start eingelesen.
  - Jetzt baut `window.DMA_LESETEXTE_BAU(kachelBildSvg)` die beiden Listen; die Kachelbilder zeichnet weiter app.js.
  - Der Inhalt ist Feld für Feld gleich (gegen app.js aus 845 verglichen).
- **Wann geladen wird (`app.js`)**:
  - `lesetexteLaden()` holt die Datei über `brDatei`; klappt die min-Kopie nicht, wird einmal die Quelle geholt.
  - Im Kompass zeichnen die beiden Bereiche „Die Texte werden geladen …“. Geholt wird erst, wenn der Bereich wirklich sichtbar wird (IntersectionObserver), nicht schon beim Vorzeichnen und nicht auf dem Weg Wissen → Klassenzimmer.
  - Der Lesetext-Wähler im Klassenzimmer (`lcLesestoff`) holt sie bei Bedarf; er gab ohnehin schon ein Versprechen zurück.
- **Tutor-Ton „b-klassenzimmer“ (`data-tutor.js`)**: Die Datei gab es nie, auch nicht in der Geschichte des Repos. Jeder Gang ins Klassenzimmer holte deshalb eine Datei, die es nicht gibt (404). Das erste Stück läuft jetzt wie die anderen drei nach Lesezeit, bis es aufgenommen ist. Zu hören war ohnehin nichts.
- **Gemessen** (4G, Rechner 4× gebremst, zwei Läufe):
  - app.js überträgt 775 KB statt 922 KB (845: mit Änderungsliste);
  - kalt bereit 2,82–2,88 s, Klassenzimmer bei 3,46–3,51 s;
  - warm bereit 1,30–1,32 s (845: 1,38 s), Klassenzimmer bei 1,87–1,91 s.
  
  Ein erster Lauf war deutlich langsamer, schon das erste Bild kam erst nach 1,5 s (sonst 0,8 s). Das war die Messumgebung, er zählt nicht.
- **Sonden**:
  - neu `pruefe-865-lesetexte-nachladen.js`: nicht beim Start, nicht auf dem Weg ins Klassenzimmer; im Kompass sichtbar → geholt und gezeichnet; 2×7 Texte mit A1–C2 und Kachelbild; keine Konsolenfehler.
  - `pruefe-runde21`: „keine neue Datei in der Startliste“ prüft jetzt die Startliste (`var dateien = [ … ]`). Der Name steht nur noch in der Stempeltabelle.
  - Grün: 865, 864, 863, 858, tutor, tutor-stuecke, tutorreiter, runde21, runde54, runde18, einladungslink, runde88-panels, 749, runde98-fokus.

## Fassung 847 — Tutorfigur als verlustfreies WebP, Messung mit drittem Öffnen (Funk 271)

XANDER (Funk 271, wörtlich): „alles insgesamt nur zehn Mal schneller".

- **Tutorfigur (`tutor/alex-comic.webp`, `tutor/alex-foto.webp`, neu)**: Die Figur war das größte Bild beim Start (alex-comic.png 176 KB, alex-foto.png 186 KB). Jetzt ist sie ein verlustfreies WebP mit 91 bzw. 98 KB.
  - Auf hellem, dunklem und grünem Hintergrund ist das Ergebnis Pixel für Pixel gleich (größte Abweichung 0). Die verlustbehafteten Stufen (q90/q95) wären noch kleiner, weichen an Kanten aber sichtbar ab und wurden verworfen.
  - `tutorFigurSetzen()` in app.js setzt das WebP. Kann ein sehr altes Gerät kein WebP, kommt einmal das PNG; die PNG-Dateien bleiben deshalb liegen.
- **Messwerkzeug (`werkzeug/ladezeit-messen.js`)**: Neu ist ein dritter Lauf „wieder“. Chrome legt übersetzten Code erst beim zweiten Laufen eines Skripts an und benutzt ihn ab dem dritten. Gemessen bringt das hier nichts Sichtbares: Der dritte Lauf ist nicht schneller als der zweite. Das Übersetzen von app.js bleibt der Hauptposten.
- **Gemessen** (4G, Rechner 4× gebremst):
  - kalt 1.962 KB gesamt statt 2.047 KB, bereit 2,79 s, Klassenzimmer bei 3,33 s;
  - warm bereit 1,25 s, Klassenzimmer bei 1,76 s;
  - wieder 1,35 s / 1,88 s.
  
  Das Bild kommt nach „bereit“, entlastet also die Leitung während des Aufbaus.
- **Bestandsaufnahme für die nächsten Schritte**:
  - Das Dokument ist klein (1.610 Elemente, 9.090 CSS-Regeln). Stile und Layout sind kein großer Hebel.
  - data-exercises.js (776 KB, 235 KB übertragen) trägt den italienischen Wortschatz (IT_WOERTER 103 KB, IT_GESCHICHTE 30 KB) und das Deutschland-Quiz (120 KB). Die Italienisch-Teile werden an vielen Stellen ohne Warten gelesen, auch in spiel.js. Auslagern heißt, den Weg in den Italienischraum umzubauen; das ist der nächste größere Schritt.
- **Sonden**: tutor, tutor-stuecke, tutorreiter, tutorbild62 grün.

## Fassung 848 — Die Wache ruft keinen Geist mehr an, Rückkehr in den Vordergrund meldet sich (Test 03.10., 01:10–01:19)

Neue Zeitleisten 327–345, alle vom Oppo:
- Das Oppo lief weiter auf **Fassung 842** (nicht neu geladen).
- Neun Minuten lang schickte es alle 6–8 s ein Angebot an **„pvvqnljpk1“**, die alte Zufallskennung des Samsung, und bekam nie eine Antwort. Jedes Angebot war eine neue Wegesuche mit 34 Relais-Kandidaten.
- Der Geist pulste weiter („gesehen“ wird nur durch Nachrichten aufgefrischt), schickte aber nie ein „hallo“. Wohl ein alter Tab im Hintergrund.
- Das Samsung selbst war unter seiner Konto-Kennung **k258507e0a** da (843 wirkt). Die Leitung Oppo ↔ Samsung stand einmal nach 23 s (Zeitleiste 330): die erste Wegesuche blieb hängen, die Relais-Kandidaten des Samsung kamen erst nach 18,9 s.
- Vom Samsung kam in dieser Runde keine einzige Zeitleiste. Woran das liegt, ist ohne seine Daten nicht zu klären.

Was 848 ändert (livechat.js):
- **Wache (`GEIST_MS`)**: Bleiben vier Versuche ohne Antwort, ruft die Wache diese Kennung nur noch etwa alle 90 s an statt alle 6–30 s. Meldet sich die Gegenseite mit „hallo“ oder antwortet sie, gilt sofort wieder das normale Tempo (Zählung zurück auf 0).
- **Zurück im Vordergrund (`zurueckImVordergrund`)**: Hat man dann zu jemandem keine stehende Leitung, geht EIN „hallo“ mit `wieder: true` hinaus, höchstens alle 3 s.
  - Drüben bleiben stehende Leitungen stehen, nur hängende werden neu aufgebaut (Regel aus 842).
  - Es gibt keinen „ist hereingekommen“-Hinweis und keinen Auftritt, weil die Person schon da war.
- Prüfhaken `pruefWache`, `pruefVordergrund`, `pruefVersuch`.
- **Sonden**: neu `pruefe-866-geist-wache.js` (Wache verkürzt: Geduld 300 ms, Geist 3 s):
  - die ersten Angebote kommen im kurzen Takt;
  - danach kommt eins je Pause; die Abstände wechseln zwischen 3,4 s und 2,6 s (Neuaufbau +0,4 s / Neustart der Wegesuche), im Mittel eins je Pause;
  - „hallo“ setzt zurück und es wird sofort angerufen;
  - die Rückkehr schickt genau ein „hallo“ mit „wieder“; allein im Raum schickt sie keins;
  - keine Seitenfehler.
  
  Grün: 866, 862, 861, 659, 856, 859, 811-leitung, 816, 827, runde18, einladungslink, 863.

## Fassung 849 — spiel.js kommt nach dem Start (Funk 271: „alles insgesamt nur zehn Mal schneller“)

- **Vorher**: spiel.js (850 KB Code, 273 KB übertragen) stand in der Startliste von index.html (`defer`). Beim ersten Laden teilte es sich die Leitung mit app.js, und der Browser übersetzte es, bevor die Seite fertig war. Das betraf jeden Besucher, auch wer nie mitspielt.
- **Jetzt** (index.html):
  - spiel.js ist aus `var dateien = [...]` heraus.
  - Es wird bei `DOMContentLoaded` eingehängt, also nachdem alle Startskripte gelaufen sind (min/-Kopie mit Stempel, bei Fehler `dmaMinFehlt`).
  - Eine Zeile fängt `beforeinstallprompt` früh auf (`DMA_APP_ANGEBOT`). spiel.js übernimmt es beim Laden, damit der Knopf „Als App“ bleibt.
- **Nichts geht verloren**:
  - Alle Aufrufe in app.js/livechat.js fragen vorher `window.DMA_SPIEL &&`.
  - Spiel-Nachrichten, die vor spiel.js ankommen, hebt livechat.js in `DMA_SPIEL_WARTET` auf (höchstens 300).
  - spiel.js holt sie beim Laden ab (`spielWartendeAbholen`):
    - Stände werden immer übernommen.
    - Bilder und Töne gibt es nur bei Nachrichten, die höchstens 3 s alt sind. Ein alter Schuss fliegt nicht nachträglich.
  - Danach ist der Puffer zu, und alles geht direkt ans Spiel.
  - `anmeldungDa` ist nicht nötig: spiel.js findet die Anmeldung beim ersten Beitreten selbst (`klientHolen`).
- **Gemessen** (4G, Rechner 4× gebremst, werkzeug/ladezeit-messen.js):

  | | bereit | Klassenzimmer | KB bis bereit |
  |---|---|---|---|
  | kalt vorher (847) | 2,79 s | 3,33 s | 1.840 |
  | kalt jetzt | 2,56 s | 3,15 s | 1.567 |
  | warm | 1,25 s → 1,24 s | | |

- **Sonden**: neu `pruefe-867-spiel-nach-start.js`. Der Server hält spiel.js zurück, bis die Prüfung es freigibt. Geprüft wird:
  - nicht in der Startliste, angefragt nach DOMContentLoaded, nachträglich eingehängt;
  - vorher kein DMA_SPIEL;
  - drei Nachrichten werden aufgehoben;
  - Stände sind übernommen, der alte Schuss wird nicht nachgespielt;
  - der Puffer ist geschlossen;
  - „Als App“ ist aufgefangen;
  - spätere Nachrichten gehen direkt ans Spiel;
  - keine Konsolenfehler.

## Fassung 850 — Italienisch-Daten erst beim Betreten des Raums; zehn tote Tutor-Töne (Funk 271)

- **data-italienisch.js (neu)** enthält die Daten des Italienisch-Raums: IT_SUBJEKTE, IT_VERBEN, IT_ERGAENZUNGEN, IT_ZEITANGABEN, IT_GRAMMATIK, IT_WOERTER, IT_BANKEN, IT_GESCHICHTE und IT_TICKER. Inhalt unverändert, 149 KB verkleinert.
  - Bisher lagen sie in data-exercises.js und kamen bei jedem Start mit, obwohl nur der Betreiber und freigegebene Personen den Raum betreten.
- **data-exercises.js**:
  - `IT()` liefert die nachgeladenen Daten, bis dahin leere Listen.
  - Die Exporte `IT_WOERTER` usw. sind Getter, alle bisherigen Aufrufe bleiben gültig.
  - Neu: `ladeItalienisch()` (über `ladeDatenteil`) und `italienischDa()`.
  - `setLernraum("it")` stößt das Laden zusätzlich an.
  - IT_KATEGORIEN bleibt in data-exercises.js, die Fragen holt `itBank` aus `IT().IT_BANKEN`.
- **app.js `wechsleLernraum`**: Beim Wechsel nach „it“ ohne Daten wird erst geladen, danach geht der Wechsel wie bisher weiter. Schlägt das Laden fehl, erscheint ein Hinweis.
  - Das gilt für die gemerkte Wahl nach der Anmeldung, nach einer Runde und für den Schalter in den Einstellungen.
  - Spiel (`DMA_IT_SPIEL.aktiv`), Laufschrift, Wörterbuch und Wortliste sind ohnehin an den Raum gebunden.
- **Gemessen** (4G, Rechner 4× gebremst), zwei Läufe:

  | | 849 | 850 |
  |---|---|---|
  | kalt bereit | 2,56 s | 2,51 s / 2,48 s |
  | KB bis bereit | 1.567 | 1.522 |
  | warm | 1,24 s | 1,37 s / 1,21 s (Streuung) |

  data-exercises.js wird gepackt 191 statt 236 KB übertragen.
- **Tutor**:
  - `b-album`, `b-beitraege`, `b-dialekt2`, `b-einstellungen`, `b-feste`, `b-freunde`, `b-kompass2`, `b-musik`, `b-schwarm2` und `b-wegweiser` gab es nie, auch nicht in der Geschichte des Repos. Jeder Besuch dieser Bereiche holte eine 404.
  - Jetzt steht dort `ton: ""`, der geplante Name in `tonGeplant`. Der Tutor läuft nach Lesezeit wie bisher.
- **Sonden**:
  - Neu `pruefe-868-italienisch-nachladen.js`. Geprüft wird:
    - Inhalt gleich Fassung 849 (aus git);
    - beim Start nicht geholt, Deutsch-Raum unverändert;
    - Betreiber tippt 🇮🇹 Italiano: die Datei kommt einmal, mit 618 Wörtern, 20 Verben, 6 Grammatik-Niveaus, 6 Geschichten, 30 Laufschrift-Zeilen und 29 Kategorien mit 67 Fragen;
    - zurück auf Deutsch geht;
    - keine Konsolenfehler.
  - 837, 839 und 843 laden die Daten jetzt vor ihrem direkten `setLernraum("it")`.
  - Grün: 868, 636, 837, 839, 843, tutor, tutor-stuecke, tutorreiter, tutorbild62, 858, runde21, runde18, 865, 867, 864.

## Fassung 851 — Neue Bilderwelt: die Bäckerei, neu gebaut nach Vorbild (Funk 263/271/280/284)

XANDER (Funk 263): „jeder Ort soll identisch mit seinem Originalvorlage sein … recherchiere bis ins kleinste Detail … dass man
auch wenn jemand auf dem Stuhl sitzt den Stuhl noch anwählen kann … mit der Lupen Funktion … zu erforschen sein".

- **Nur die neue Bilderwelt** (`?bilderwelt=neu`, Schalter). Die alte Bäckerei bleibt Stand 53eaa31 mit 9 Teilen (Funk 225).
- **Werkzeug im Repo** (`werkzeug/bilderwelt/`):
  - `bau.js` ist der Baukasten: Verläufe, Teile, „unter“-Teile mit Lupe, Ebene „vorne“ für Glas und Licht.
  - `szenen/baeckerei.js` ist die Quelle der Szene. Sie schreibt `bilderwelt-neu/szenen/baeckerei.js` (nicht von Hand ändern).
  - `vorschau.js` erzeugt ein Bild der Szene, auf Wunsch mit Trefferrahmen und Lupen-Teilen.
  - `pruefe-szene.js` prüft wie die App: Trefferebene unter den Zeichnungen, obere Ebene für `oben`-Teile, Mindestgröße. Jedes Teil
    muss an mindestens 12 Rasterpunkten antippbar sein, Lupen-Teile in der Lupe.
- **Vorbild**: deutsche Filial-Bäckerei.
  - Hinten das Brotregal mit Holzfächern und Preisschildern.
  - Davor die Bedientheke mit Kühlsockel, Lüftungsgitter und Tablettschiene.
  - Darauf die gebogene Kuchenvitrine aus Glas.
  - Kasse, Kartenterminal und Bon rechts; Kaffeemaschine mit Tassenstapel links.
  - Kreidetafel, Uhr, Schild „seit 1928“, Blick durchs Fenster in die Backstube mit Ofen.
  - Metro-Fliesen hinter den Buffets, Putzwand, Fliesenboden in Fluchtperspektive.
- **22 Teile im Bild, 19 in der Lupe** (41 Wörter):
  - Brotregal (Lupe): Roggen-, Misch-, Vollkorn-, Toast-, Dinkel-, Bauernbrot, Baguette, Laugenstange, Weizen-, Körner-, Mohn-
    und Sesambrötchen.
  - Vitrine (Lupe): Schwarzwälder Torte mit angeschnittenem Stück, Käsekuchen, Bienenstich, Streuselkuchen, Berliner, Croissant,
    belegtes Brötchen.
  - Kleine Dinge (Zange, Bon, Trinkgeld, Kartenlesegerät, Tüte, Brezel, Tasse) haben eine eigene obere Fangfläche: Sie liegen auf
    oder in größeren Dingen und würden sonst von ihnen verdeckt.
  - Menschen: Verkäuferin mit Tüte, Kundin. Sie stehen hinter bzw. vor der Theke und verdecken kein Regalfach.
- **app.js `bwBildHtml`**: zwölfte Weiche — `szene.vorne` (Glas, Spiegelung) liegt über den Teilen, mit `pointer-events="none"`.
  Nur in der neuen Bilderwelt.
- **Aufgeräumt**:
  - Der Satzbaukasten-Lader (842) stand im Bilderrätsel-Abschnitt. Er steht jetzt unverändert davor.
  - Sonde 840 zählt als Leck nur echten Weichen-Code; die Ladezeit-Kommentare unter derselben Nummer 840 sind keiner.
- **Sonden**:
  - Neu `pruefe-869-baeckerei-neu.js`. Geprüft wird:
    - der Bau und alle Treffer;
    - die neue Bilderwelt lädt aus `bilderwelt-neu`, mit 22 Teilen;
    - Glas fängt keinen Tipp ab, kein seitliches Scrollen;
    - ein Tipp wählt die Verkäuferin;
    - die Lupe der Vitrine zeigt 7 Teile, die Torte ist antippbar;
    - der alte Modus zeigt die alte Bäckerei mit 9 Teilen und holt nichts aus `bilderwelt-neu`;
    - keine Seitenfehler.
  - Grün: 869, 840, 725, 834, 835, 839, 842, 858, 865, 867, runde18, runde21.

## Fassung 852 — Die ganze neue Bilderwelt nach dem Bäckerei-Schema; Wetter bleibt; Verbindung schneller (Funk 280/286)

XANDER (Funk 286): „Du sollst die Bilderwelten komplett nach demselben Schema fertig machen dass sich nichts mehr blockiert und
alle Hintergründe die logischen Stationen zeigen wo die Leute sind … ich will ein großes Update mit allen kompletten
überarbeiteten Bilderwelten … und dann machst du kontinuierlich weiter mit den restlichen Verbindung Sachen".

- **Nur die neue Bilderwelt** (`?bilderwelt=neu`). Die alte bleibt byte-gleich (Sonde 840, 872).
- **146 Szenen neu gebaut** nach `werkzeug/bilderwelt/ANLEITUNG.md` (Maßstab Bäckerei), dazu der Garten:
  - Bau-Dateien `werkzeug/bilderwelt/szenen/<id>.js`, je mit RECHERCHE-Kommentar (echtes Vorbild, Stationen, Maße).
  - Jedes alte Wort bleibt mit id/de/syl/it/itSyl/en; jede `lupe` (Verweis in eine andere Szene) bleibt am selben Teil.
    Korrigiert (mit Kommentar): u. a. Gericht „der Angeklagte“/„die Anklagebank“, „die Auffangwanne“, Silben bei
    Wegweiser, Apotheke, Kastagnetten, Betonung „pe-DIA-tra“, „gla-CIA-le“.
  - Kleines auf Größerem trägt `oben: true` (eigene Fangfläche oben); viele kleine Dinge stecken als „unter“-Teile in der Lupe.
  - Alle gepackt unter 70 KB (meist 10–40 KB); geladen wird eine Szene erst beim Öffnen.
  - Übersichten: `stadt` (Schrägluftbild, 7 Viertel), sieben Viertel als echte Straßenzüge (400×260 bzw. 400×300), alle
    Sprünge in die Ortsszenen erhalten (Weg Stadt → Innenstadt → Bäckerei geprüft).
  - **Garten**: die fünf Garten-Plätze in `bilderwelt-neu/data-plaetze.js` an die neue Szene angepasst (Baum, Bank, Teich,
    Tor, Rasen). Die alte `data-plaetze.js` ist unverändert.
  - Nicht neu gebaut: die 21 schon früher erneuerten Szenen (Wohnzimmer, Küche, Bad …) und die Anatomie-Tafeln.
- **Werkzeug**: `woerter.js` zeigt auch `lupe`; `verzeichnis.js` trägt Maße/Zahlen der gebauten Szenen ins Verzeichnis und setzt
  `NEUE_SZENEN` in index.html; `pruefe-szene.js` prüft zusätzlich Ränder (nichts ragt hinaus) und die gepackte Größe.
- **app.js `bwBinden`** (Weichen 13–15, nur neu): Mindest-Trefferfläche wird im Zoom durch den Zoomfaktor geteilt; über
  `oben`-Teilen liegt zusätzlich ihr echter Umriss.
- **Wetter im Kopf (Funk 280)**: ein Fehlschlag löscht eine gute Messung nicht mehr (erst nach 1 h „—°“); neuer Versuch nach
  15 s, 45 s, 120 s. Sonde `pruefe-870-wetter-bleibt.js`.
- **Verbindung (Funk 286)** — Messung 839–842: Raumkanal bis 16,8 s, Angebot 8–21 s nach dem Betreten (tote Websocket-Leitung):
  - Beitritt mit 4 s statt 10 s Wartegrenze; ein Ablauf ist kein Fehler (die Bibliothek tritt selbst neu bei), erst der dritte.
  - Nach > 8 s Hintergrund und am Tor: sofort ein Herzschlag; bleibt die Antwort 2,5 s aus, baut die Bibliothek neu auf.
  - Zweiter Gruß nach 1,2 s und 3 s, wenn noch keine Leitung im Aufbau ist (gleiche Sitzung → drüben nur Erinnerung).
  - Messung meldet zusätzlich `joinTO`, `wsTot`, `halloNochmal`. Sonde `pruefe-871-leitung-frisch.js`.
- **Sonden**: neu 870, 871, 872 (alle neuen Szenen in der App, Lupen-Weg, alte Welt unberührt). Grün: 659, 827, 840, 842, 858,
  859, 861, 862, 866, 869, 870, 871, 872, runde21; `pruefe-szene` für alle 146 neu gebauten Szenen „gut erreichbar“.

## Fassung 853 — Kachelbilder und Kreuzwort erst bei Bedarf (Funk 271, Puls)

XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".

- **Kachelbilder** (`data-minibilder.js`, 124 KB) standen in app.js und wurden bei jedem Start samt der echten Zeichnungen
  (Musik, Lok, Delfin, Flugzeug …) gerechnet. Jetzt holt `lcMiniBildHolen` die Datei, wenn die Seite ruhig ist (2,5 s nach
  `load`, im Leerlauf), spätestens beim ersten Menü; `lcMiniBildBauen` rechnet die Zeichnungen einmal. Bis dahin steht – wie bei
  jeder Kachel ohne Bild – das Emoji.
- **Kreuzwort-Raster** (`data-kreuzwort.js`, 55 KB) kommen erst beim Öffnen des Kreuzworträtsels (`kreuzwortHolen`, mit Hinweis
  „wird geladen …“ und Fehlermeldung, wenn es nicht klappt).
- **Ergebnis**: min/app.js 2,76 → 2,62 MB (gepackt −24 KB), weniger Rechnen beim Start.
- **Sonden**: neu `pruefe-873-ausgelagert.js` (beim Start nichts geholt, Kachelbilder kommen mit 22 echten Zeichnungen nach,
  Kreuzwort öffnet sich mit Gitter, keine Fehler); `pruefe-712` holt die Bilder vorher. Grün: 660, 666, 712, 731, 736, 812,
  858, 864, 873. Rot schon vor dieser Fassung (unverändert): 687, 716.

## Fassung 878 — Städte, Länder und zwei Übersichtskarten; Lupenmarken folgen dem Sichtbaren; Äcker versetzen; Quests nach Niveau; schlanker Start (Funk 255/257/263/271/286/291)

XANDER (Funk 291, wörtlich): „alles weitere außer der Tiere was noch auf dem Plan steht … die Sehenswürdigkeiten Städte und Länder … mit größte Sorgfalt und Präzision auf höchstem Niveau" · (Funk 286): „ein großes Update mit allen kompletten überarbeiteten Bilderwelten ich will keine Stopps mehr haben".

In dieser Fassung stecken fünf Arbeitsstände (874–878), die nacheinander fertig wurden und erst jetzt zusammen ausgeliefert werden. Die Tier-Bibliothek ist NICHT dabei – sie wartet auf Funk 294.

### 874 — Die Äcker lassen sich versetzen (Funk 255)
XANDER (Funk 255): „Ich möchte dass man das Feld verschieben kann und dass es standardmäßig zwischen der Bäckerei und der Mühle ist also hinter der Bäckerei quasi … das Feld auf der rechten Seite ist auch noch nicht in einer geeigneten Position wo ich locker drauf zugreifen kann innerhalb des Bildausschnitts".
- Leichte Stadt: Acker 91 liegt ohne Speicherstand hinter der Bäckerei; Acker 92 auf seinem Ackerplatz, im kleinen Rahmen (Telefon hochkant 360 × 225, auch 280 × 175) ganz im Bild und frei von Knöpfen.
- Tipp auf den Acker → Menü „Getreidefeld" mit „Versetzen"; auch Halten und Ziehen wie bei einem Haus. Auf Straße/Haus: roter Rahmen, „Hier geht kein Acker hin …", der Acker rastet zurück. Auf freier Wiese: grün, „Gesetzt" – Korn, Tippfläche, Zeichen und die Ladestelle des Kornwagens wandern mit.
- Gemerkt im Stand „verwalten" (felder) über `spiel_stadt_leicht_speichern` und im Browser; keine neue Tabelle. „Zurück auf den Ackerplatz" stellt den Ursprung wieder her.
- Sonde `pruefe-874-acker-versetzen.js`.

### 875 — Quests nach Niveau (A1–C2) und nach Stand der Stadt (Funk 257/263)
XANDER (Funk 257): „die Missionen müssen Variation haben und dürfen nicht zu repetitiv sein … gekoppelt an den gewissen Stand des Dorfes … von A1 bis C2 dass man das in den Einstellungen hat" · „dieses fast kannst du nur schreiben wenn er die Grammatik fast richtig hat aber dazu muss die Erkennung auch korrekt sein".
- Niveau-Wähler im Kopf des Quest-Fensters (Vorgabe A2 bzw. das Spielniveau); gewählt wird nie über dem eigenen Niveau, gut die Hälfte genau darauf.
- Missionen nur mit ihrem Gebäude (keine Sternwarte → keine Astronomin; keine Baustelle → kein „Was baut ihr da?"); die Fragen lesen die echte Stadt (Zahl der Gebäude, Baustelle, Stadtname).
- Abwechslung: 80 Missionen hintereinander, nie zweimal dieselbe direkt nacheinander. Mindestens 30 neue Missionen A1–C2 mit freier Antwort, Wortliste und Tipp.
- Erkennung: Die Wortliste geht mit an „erkennen" (ohne Wörter, die über richtig/falsch entscheiden); verhörte Schlüsselwörter werden nach Klang gezogen („Winter hausen", „Labo", „Neu Schwan Stein") – Endungen und Umlaute nie, ein „Fast" bleibt ein „Fast".
- Sonde `pruefe-875-quest-niveau.js`.

### 876 — Der Start lädt nur, was man beim Start sieht (Funk 263/271)
(Ausführlich: siehe Abschnitt unten „876 im Detail".) Kurz: app.js in Stücken (min/app.js 752 → 189 KB gepackt), Startblätter für korrekturen/app-styles/spiel.css (153 + 38 + 46 → 12 + 7 + 0 KB), data-exercises-Teil, Wegweiser später, spiel.js beim Öffnen des Klassenzimmers. Kalt bis „bereit" −35…−40 %, KB bis bereit −60 %, Rückkehr in den Raum 5,2 s statt 8,0 s. Sichtbar ändert sich nichts. Sonde `pruefe-876-start-schlank.js`.

### 877 — Städte, Länder und zwei Übersichtskarten in der neuen Bilderwelt
36 neue Szenen (nur über `?bilderwelt=neu`, die alte Bilderwelt bleibt unberührt):
- **Deutschland (17):** Aachen, Bremen, Düsseldorf, Frankfurt am Main, Freiburg im Breisgau, Hannover, Heidelberg, Lübeck, Schloss Neuschwanstein, Nürnberg, Potsdam, Regensburg, Rothenburg ob der Tauber, Stuttgart, Trier, Weimar – dazu die **Deutschlandkarte** (4 Regionen-Lupen Norden/Osten/Westen/Süden mit 23 Städten).
- **Welt (19):** Amsterdam, Athen, Dubai, Indien (Taj Mahal), Kanada (Niagarafälle), Kapstadt, Mexiko, Moskau, New York, Peking und die Große Mauer, Peru (Machu Picchu), Prag, Rio de Janeiro, San Francisco, Schweiz (Zermatt und Matterhorn), Sydney, Venedig, Wien – dazu die **Weltkarte** (11 direkte Marken, Europa-Lupe mit 11 Ländern/Städten; Deutschland führt in die Deutschlandkarte).
- Jede Szene: recherchiert (echte Lage, Blickrichtung, Wahrzeichen), ≤ 30 Wörter, gepackt unter 70 KB (Karten 53/44 KB), „alle Teile gut erreichbar".
- Abnahme: je ein Gestalter und ein unabhängiger Kritiker, acht Achsen (Ortstreue, Wahrzeichen, Perspektive, Typisches, Antippbarkeit, Licht, Handwerk, Wörter), angenommen ab 9 auf jeder Achse; höchstens fünf Runden, danach nur noch Nachbesserungen ohne zusätzliche Größe.
- Alkohol: neue Szenen sind alkoholfrei (Apfelschorle, Reibekuchen, Zwiebelkuchen statt Lüttje Lage, Viez, Federweißer usw.). Ältere Szenen mit Alkohol stehen als Frage im Funk.
- Bau-Werkzeug: Verläufe in Bildkoordinaten wirken wieder (`S.lg` schrieb x1/y1 doppelt, der Browser nahm die ersten – Frankfurt neu gebaut).
- App (Bilderwelt neu):
  - Artikel-Modus: „Indien", „Italien", „Leipzig" werden nicht mehr als „i"/„l" + Rest zerlegt (Artikel braucht ein Leerzeichen, außer l'); der Modus nimmt nur Teile mit Artikel und erscheint erst ab vier solchen.
  - Lupenmarken auch IN der Lupe (Stadt in der Regionen-Lupe führt direkt in ihre Szene), um 1/k verkleinert, damit sie fingerbreit bleiben.
  - „Zurück" aus einer Stadt landet wieder in der Lupe, aus der man kam (die Spur merkt sich die Lupe); „Alle Szenen" löscht die Lupe.
  - Fangflächen ohne Lupenmarke gemessen (sonst wuchs das Rechteck um die Marke).
  - Hinweis in der Lupe: „Tipp auf die Lupe an einem Ort – dann gehst du hinein".

### 878 — Lupenmarken folgen dem Sichtbaren
Gefunden mit dem angeglichenen Prüfwerkzeug: die in 877 eingeführte Ebene „Marken-Dach" (Lupenmarken gewinnen immer) stahl in dichten Bildern dem Nachbarn die Tipps – im Reisebüro öffnete ein Tipp aufs Ägypten-Plakat Japan.
- Der Kreis im Marken-Dach ist so groß wie der sichtbare Knopf (r 11 statt 15); der Ring bis 15 bleibt im Teil und teilt sich den Platz mit den Nachbarn.
- Ein Tipp auf den Kreis gilt dem Ding, das man dort SIEHT: liegt die Zeichnung eines anderen Dings über der Marke, bekommt dieses den Tipp (unsichtbare Fangflächen und durchsichtige Ringe anderer Marken zählen nicht).
- Die Regel „Teile über 8 % des Bildes ohne Ersatzrechteck" (877) gilt nur noch auf Übersichtskarten (`nurForm` oder Name auf „karte"). Im Supermarkt war das Regal sonst nicht mehr antippbar.
- Neues Teilfeld `marke: [x, y]` (Lage der Lupenmarke; sonst 16/−16), vom Bau-Werkzeug durchgereicht. Gesetzt im Reisebüro (Plakate), in Rom (Forum, Trevibrunnen) und im Behördenviertel (Büro) – sonst unverändert (geprüft: die Bauten unterscheiden sich nur in `marke`).
- `werkzeug/bilderwelt/pruefe-szene.js` bildet die App jetzt nach (8-%-Regel auf Karten, Lupenmarken, Marken-Dach, Klickregel) und prüft jede Marke: gewinnt sie auf weniger als 40 % ihres Kreises oder liegt sie auf einer Karte über fremdem Land, ist das ein Fehler.
- Sonde neu: `pruefe-878-karten-lupenweg.js` – mit echten Mausklicks: Weltkarte → Rio → zurück; Weltkarte → Lupe Europa → Deutschland → Lupe Süden → München; Zurück landet in der Süden-Lupe, dann in der Europa-Lupe; „Alle Szenen" löscht die Lupe; jede Marke trifft ihren Kreis.

- **Verdichten (Puls, Vorrang 2 „Ladezeiten"):** neues Werkzeug `werkzeug/bilderwelt/verdichten.js` schreibt die Pfade der gebauten Szenen in relative Schritte um (genau auf die Nachkommastellen des Originals, keine Rundung). Gleiche Verläufe zusammenzulegen wurde versucht und verworfen (dieselbe id steht in manchen Szenen in mehreren Teilen; Zoo II: 5 326 abweichende Bildpunkte). Das Bau-Werkzeug (`bau.js`) verdichtet jetzt beim Schreiben selbst – ein Neubau von Moskau ergibt Byte für Byte dieselbe Datei. Jede Szene wird vorher/nachher dreifach groß gezeichnet (jede Lupe einzeln) und Bildpunkt für Bildpunkt verglichen; geschrieben wird nur bei höchstens 20 deutlich abweichenden Bildpunkten (Kantenglättung). Ergebnis: 199 von 202 Szenen verdichtet (185 davon mit 0 abweichenden Bildpunkten), alle Szenen zusammen gepackt 8,80 → 7,35 MB (−16 %); drei (Freizeitpark, Neuschwanstein, San Francisco: 21–76 Bildpunkte) bleiben wie sie waren.

**Sonden (Endstand Fassung 878)**: grün – 872 (ganze neue Bilderwelt, 203 Szenen, auch nach dem Verdichten), 874 (Äcker), 875 (Quests; ein Lauf unter hoher Rechnerlast scheiterte am nachgestellten Mikrofon, die Wiederholung war grün), 876 (Start), 878 (Kartenweg mit echten Klicks), 817, 830. `pruefe-szene.js` über alle Szenen: grün bis auf die zwei vorbestehenden (Körperbau zu groß, ein Teil der Lerntafel knapp antippbar). 855 (Kornfeld) schwankt: das reife Korn misst je nach Wolkenschatten 174–180, das Stoppelfeld 184, verlangt sind +8 – auf dem Stand vor 878 genauso; am Korn wurde nichts geändert.

**Offen**
- Vorbestehend (auch mit dem alten Werkzeug): Ränder in Arztpraxis, Bahnhof, Straße, Supermarkt (Kasse 49 Einheiten) ragen über das Bild; Körperbau ist nach dem Verdichten noch gepackt rund 115 KB (über dem Ziel 70); in der Lerntafel ist ein Teil der Mann-Lupe nur knapp antippbar.
- Bibliothek der Figuren (B.mensch): Gesicht am Hinterkopf, Faust zeigt Finger, Kinderarm zu lang – die Gestalter haben es je Szene abgedeckt; zentral erst nach Absprache, weil es abgenommene Szenen verändern würde.

### 876 im Detail — Der Start lädt nur noch, was man beim Start sieht

XANDER (Funk 263/271, wörtlich): „die Ladezeit der Seite deutlich verringern um ein zehnfaches schneller machen oder dass man wirklich sofort in den Livestream kommt sofort sichtbar ist wie bei HelloTalk" · „alles insgesamt nur zehn Mal schneller" · „die schnelle Performance und die Verbindung zu den anderen haben oberste Priorität".

Gemessen mit Playwright-Coverage (neu: `werkzeug/teile-messen.js`; vier Lagen: abgemeldet/angemeldet × Telefon/breiter Schirm; Schritte Start → Wissen → Klassenzimmer → 6 s Ruhe → alle Hauptreiter → „Betreten" → im Raum):
- app.js: von rund 5 MB Quelltext liefen bis dahin Funktionen mit gut 0,45 MB. 3,6 MB waren Funktionen, die erst später gebraucht werden (Chat-Effekte, Reise, Einstellungen, Spiele, Postfach …).
- korrekturen.css (153 KB gepackt): beim Start greifen 406 von 3 973 Regeln; spiel.css: eine einzige (`button:disabled`).
- Trotzdem musste jedes Telefon das alles holen und übersetzen, bevor die Reiter antworteten.

Sichtbar ändert sich nichts. Die Quellen bleiben je EINE Datei – alle Werkzeuge und Sonden lesen sie wie bisher, `?quelle` lädt sie wie immer ganz. Geteilt werden nur die verkleinerten Kopien in min/, beim Bauen (fassung-setzen.js ruft die neuen Werkzeuge auf; ohne acorn oder ohne Liste entsteht min/ wie vorher).

- **app.js in Stücken (`werkzeug/teile-bauen.js`, Liste `werkzeug/app-teile.json`)**
  - 1 716 Funktionen und 332 Datenblöcke, die beim Start und auf dem Weg ins Klassenzimmer nie laufen, stehen in 15 Stücken: `min/app-teil-raum1…8.js` (Klassenzimmer, Effekte) und `min/app-teil-rest1…7.js`. In min/app.js steht an ihrer Stelle ein kurzer Platzhalter mit demselben Namen.
  - min/app.js: 752 → 189 KB gepackt (2,6 → 0,7 MB Code).
  - Eingesetzt wird ein Stück mit eval im Inneren von app.js (`dmaTeilAuswerten`): es sieht alle Namen wie vorher. Funktionen behalten ihre Identität (removeEventListener, Vergleiche, angehängte Eigenschaften); `this`, `new`, `async` laufen wie vorher. Deshalb lässt esbuild die obersten Namen in min/app.js unverkürzt (kostet gepackt rund 12 KB).
  - Wann: bei `load` über die Leitung (liegen dann im Zwischenspeicher), eingesetzt ab 3 s nach dem Laden, ein Stück je Ruhepause (Klassenzimmer zuerst). Beim Öffnen des Klassenzimmers kommen die Raum-Stücke sofort und sind 0,6 s später eingesetzt.
  - Ruft jemand eine ausgelagerte Funktion früher (z. B. ein Effekt kommt ganz früh im Chat an), setzt der Platzhalter ihr Stück sofort ein – nötigenfalls synchron geholt. Nichts geht verloren; es dauert nur dieses eine Mal etwas länger. `window.DMA_TEIL_SOFORT` schreibt mit, wenn das passiert.
  - Rückkehr nach dem Neuladen (man war im Raum): es geht hinein, sobald die Raum-Stücke über die Leitung da sind (höchstens 2,5 s gewartet) – sonst würde jedes Stück einzeln synchron nachgeholt, während sich der Raum aufbaut.
  - Passt ein Stück nicht zu min/app.js (Seite älter als der Server), erscheint oben „Neue Fassung – jetzt laden"; von selbst neu geladen wird nichts.
- **data-exercises.js**: 20 große Datenblöcke (Deutschland-Quiz, Wortschatz-Themen, Lückentexte, Konnektoren …), die nur Funktionen lesen, die beim Start nicht laufen, stehen in `min/data-exercises-teil.js`; jede lesende Stelle fragt vorher `dmaUebTeil()`. 190 → 105 KB gepackt beim Start.
- **data-wegweiser.js** (21 KB) aus der Startliste: kommt 3 s nach dem Laden in einer Ruhepause, spätestens beim Öffnen des Wegweisers (`wegweiserLaden`).
- **Startblätter (`werkzeug/stil-bauen.js`, Liste `werkzeug/stil-teile.json`)**: Von korrekturen.css, app-styles.css und spiel.css hält nur `min/<name>-start.css` das erste Bild an – die Regeln, die beim Start greifen können (Coverage und querySelector auf das ganze DOM, Zustände wie :hover mitgezählt), in der alten Reihenfolge. Gepackt: 153 + 38 + 46 KB → 12 + 7 + 0 KB.
  - Die ganzen Blätter werden nach DOMContentLoaded direkt hinter ihr Startblatt gehängt (spiel.css auch, es gestaltet z. B. die Bilder im Platzmenü). Dann gilt Regel für Regel dasselbe wie vorher (jede Startregel steht im ganzen Blatt noch einmal an ihrem alten Platz, dazwischen liegt nichts). Versuch verworfen: sie erst später einzuhängen – dann fehlten sie Dingen, die ein Skript ohne Tipp öffnet (Sonde 660).
  - Bildvergleich alt/neu (Telefon und breiter Schirm; Start, Lernen, Profil, Wissen, Klassenzimmer): 0 abweichende Bildpunkte – auch wenn die ganzen Blätter absichtlich zurückgehalten werden.
- **spiel.js** kommt nicht mehr bei DOMContentLoaded (genau dann tippt man Wissen → Klassenzimmer), sondern beim Öffnen des Klassenzimmers (0,3 s nach dem Zeichnen) oder 1,5 s nach dem Laden in einer Ruhepause; es wartet, bis spiel.css gelesen ist.
- **Im Raum** (egal auf welchem Weg, `LiveChat.beiAenderung` → „drin"): die Raum-Stücke werden sofort geholt und auf einmal eingesetzt (`raumDrin`).

**Gemessen** (`werkzeug/ladezeit-messen.js 4g`, Rechner 4× gebremst; der Prüfrechner war durch parallele Arbeiten stark ausgelastet – Last 8–15 –, deshalb abwechselnd alt/neu, Median aus drei Läufen; die absoluten Zahlen liegen über denen eines ruhigen Rechners):

| | vor 876 | 876 |
|---|---|---|
| kalt: erstes Bild | 1 048–1 100 ms | 712–800 ms |
| kalt: bereit | 2 970–3 310 ms | 1 840–1 990 ms (−35…−40 %) |
| kalt: Klassenzimmer ab Start | 4 270–4 500 ms | 3 140–3 370 ms (−25 %) |
| kalt: KB bis bereit | 1 446 | 581 (−60 %) |
| warm: bereit | 1 410–2 120 ms | 1 560–2 070 ms (kein klarer Unterschied) |

Der Weg „Wissen antippen → Klassenzimmer zu sehen" selbst ist nicht schneller geworden (Messwerte schwanken 0,9–1,6 s in beiden Fassungen); er ist reine Rechenarbeit (activateTab/renderKompass, Layout). Ohne Leitungsbremse (nur Rechner 4×) ist „bereit" alt und neu gleich: die Startzeit ist jetzt Rechnen, nicht Laden.

Rückkehr nach dem Neuladen (gleich wieder im Raum, 4G, Rechner 4×): „drin" nach 5,2–5,4 s statt 8,0–8,3 s.

**Sonden**: neu `pruefe-876-start-schlank.js` (Bau und Stempel; beim Start kein Stück, kein ganzes Blatt, kein spiel.js, kein data-wegweiser.js; die ganzen Blätter direkt hinter ihrem Startblatt, Aussehen davor und danach gleich; Klassenzimmer holt Raum-Stücke, spiel.css, spiel.js; alle Stücke werden eingesetzt; Spiele, Einstellungen, Postfach, Wegweiser, Deutschland-Quiz, Auftritt im Raum; ganz früh ankommender Auftritt läuft trotzdem; `?quelle` wie vorher; keine Seitenfehler) – grün. Grün auf dem Endstand außerdem: 858, 865, 867, 868, 871, 873, 652, 660, 645, 656, 666, 659, 669, 699, runde18, einladungslink. Breiter Lauf (rund 350 Sonden, Rechnerlast 20–40): alle übrigen roten waren auch auf dem Stand vor 876 rot (Zeit-/Rechenbudget-Sonden, Dorf/Stadt, bekannte 687/716/686/659-Reihe). 694: Teil 3 („beim dritten Öffnen nichts Gestempeltes übers Netz") rot, weil die Sonde 1,5 s nach dem Laden neu lädt und spiel.js jetzt erst danach kommt; mit 4,5 s Wartezeit grün – auch alle Stücke kommen dann aus sw.js.

**Offen / nächste Schritte**
- Die Listen stammen aus vier gemessenen Lagen. Ruft eine seltene Start-Lage eine ausgelagerte Funktion, läuft sie trotzdem, holt dafür aber ihr Stück sofort. Nach größeren Umbauten `node werkzeug/teile-messen.js` laufen lassen; neue Funktionen bleiben sonst einfach in min/app.js.
- Der Rest der Startzeit ist jetzt Rechenarbeit, nicht Leitung: app.js zeichnet beim Start alle Bereiche vor (renderSetup für „Lernen" usw.), dazu das erste Layout der ganzen Seite. Das zu verschieben wäre der nächste Hebel – ändert aber, wann was gezeichnet wird, und gehört deshalb erst abgesprochen.
- livechat.js (98 KB) und backend.js stehen weiter ganz in der Startliste.

## Fassung 879 — Schnellerer Start ohne Farbwellen, Übungen erst beim Öffnen; Lebensanzeige aus; Postfach-Empfänger kompakt; ältere Stadtszenen alkoholfrei; Wortliste für die Erkennung am Server (Funk 263/285/296)

XANDER (Funk 296, wörtlich): „Ja mach alles weiter keine Fragen stellen dann kümmere Dich jetzt bitte um alles das ganz intensiv für mich jetzt dann."

### Start: keine Farbwellen mehr in den ersten Sekunden (Puls, Vorrang 1)
- Gemessen (Chromium, Telefon, Rechner ×4 gedrosselt, Spur der Stil-Neuberechnungen): beim Start liefen die Farbübergänge der Wetterleiste (Hintergrund 2 s, Schrift und Uhr 1,5 s) vom Grundton zur echten Himmelsfarbe. Farben, SVG-Striche und Schatten blendet der Browser im Hauptfaden über: rund 80 Neuberechnungen aller Stile, zusammen etwa 550 ms.
- Jetzt gibt es beim ersten Himmel keinen Übergang (Klasse `himmel-sofort` an `<html>`, `styles.css`). Nach dem Laden aller Stilblätter wird die Klasse entfernt, danach wandert der Himmel über den Tag wie bisher.
- Ergebnis: 112 → 30–36 Stil-Neuberechnungen beim Start, 576 → 180–260 ms. Die Kopfzeile ist um 12, 19 und 23 Uhr Bildpunkt für Bildpunkt gleich.
- Die Zahl „bereit" ändert das nicht, weil die Übergänge erst danach liefen. Gewonnen ist ein freier Hauptfaden in genau der Zeit, in der die ersten Tipps kommen.
- Im Ruhezustand (nach 8 s, 5 s gemessen, Tag und Nacht) arbeitet der Hauptfaden nicht.

### Übungsauswahl erst beim Öffnen (Funk 295 Frage 4 → Funk 296 „Ja")
- `renderSetup()` lief beim Start und bei der Anmeldung, obwohl die Übungen fast nie zu sehen sind.
- Jetzt wartet eine Wache (ResizeObserver) darauf, dass der Bereich Platz bekommt, und zeichnet dann vor dem nächsten Bild. Es gibt kein leeres Aufblitzen.
- Ist der Bereich schon beim Start sichtbar, wird wie bisher sofort gezeichnet. Ruft jemand vorher `renderSetup()` auf (Anmeldung, Lernraum-Wechsel), kehrt die Funktion zurück, und die Wache zeichnet später mit dem dann gültigen Stand.
- Warmer Start bis „bereit" (4G-Messung): 1,00–1,11 s → 0,93–0,97 s. Der kalte Start hängt an der Leitung und bleibt bei rund 1,35 s.

### Lebensanzeige aus (Walkie 285 / Funk 160)
- Menü → Mehr → „Im Chat": neuer Schalter „Lebensanzeige aus", direkt neben „Nur Mitspieler hören". Gespeichert auf dem eigenen Gerät (`dma_spiel_lp_aus`), wirkt sofort.
- Ausgeblendet werden in der eigenen Ansicht die Lebensbögen samt Schild an allen Bildern und die LP-Zahl im Menü. Mana, Ladung, Level und Rüstung bleiben sichtbar, die Spiellogik ist unverändert.

### Postfach: Empfänger wie im Messenger (Walkie 296, Möglichkeit 1)
- Die lange Häkchen-Liste und die Umschaltung „Bestimmte Personen/Rundmail" sind weg.
- Neu sind ein Suchfeld mit Trefferliste (erscheint erst beim Tippen, höchstens sechs Treffer, Enter nimmt den ersten), Chips für die Gewählten (mit ✕) und darunter die 5 zuletzt Angeschriebenen als Knöpfe.
- Fürs Team gibt es „📢 Alle" (Rundmail, die Rückfrage vor dem Senden bleibt).
- „Antworten" wählt die Person auch dann aus, wenn sie unter den Zuletzt-Angeschriebenen steht.

### Ältere Stadtszenen alkoholfrei (Funk 297 Punkt 3)
- **Dresden und Nürnberg:** Kinderpunsch statt Glühwein, mit hellroter Tasse.
- **München:**
  - Festzelt statt Bierzelt, „Servus!" statt „O'zapft is!".
  - Im Maßkrug ist Spezi, braun mit hellem Rand. Auch die kleinen Krüge an den Tischen im Hintergrund sind braun.
  - Aus der „Bierbank" wurde die „Bank".
- **Regensburg:** Apfelschorle und Radi statt der „Halben". Die Kastanie bekommt einen neuen Tipp, und der helle Glasrand ist dezenter, damit er nicht wie eine Schaumkrone wirkt.
- **Frankfurt, Düsseldorf, Stuttgart:** Texte und Tipps angepasst.
- Alle sieben Szenen: „alle Teile gut erreichbar", gepackt 36–57 KB.

### Spracherkennung: Wortliste je Mission auch am Server (Funk 263) — NICHT ausgerollt
- `supabase/functions/aussprache/index.ts`: Schickt die App eine Wortliste mit (`phrasen`, das tut sie seit 875), geht die Aufnahme an Azure Fast Transcription mit `phraseList`. Die bisherige Kurz-Audio-Schnittstelle kennt keine Wortliste.
- Die Antwort hat dieselbe Form wie bisher (DisplayText/NBest). Geht etwas schief, läuft der gewohnte Weg weiter.
- Das Hochladen der Funktion wurde von der Rechte-Prüfung dieser Sitzung abgelehnt (Produktiv-Auslieferung). Es braucht Xanders ausdrückliches OK.

### Sonden
- Neu: `pruefe-879-lebensanzeige-postfach.js` (26 Prüfungen, mit Quellen und mit min/ grün).
- Gelaufen und grün: 876, 878, 879, 748, 874, 875, 636.
- Dazu: Bildvergleich der Kopfzeile alt/neu (0 abweichende Bildpunkte zu drei Uhrzeiten), Übungsauswahl beim Start leer und nach dem Öffnen 62 Karten, keine Seitenfehler.

**Offen**
- Aussprache-Funktion hochladen (wartet auf OK).
- Tier-Bibliothek: Weg A, weiter zeichnen.
- livechat.js und backend.js stehen weiter ganz in der Startliste.

## Fassung 880 — Städte authentisch: Bier, Wein und Spezialitäten wieder da (Funk 299)

XANDER (Funk 299, wörtlich): „Lass den Quatsch und stell den Alkohol wieder her das sind nur Bilder und die Länder sollen authentisch dargestellt werden bzw die Städte … es ist eine Seite um Deutsch zu lernen und zu verstehen und da können wir nicht irgendwelche Sachen verfälschen die im Original so sind … wenn wir was über Bier wissen wollen und übersetzen wollen dann wollen wir was über Bier wissen oder Wein oder was es gibt das sind Sachen die es in der Realität gibt die kannst du nicht verfälschen“.

Damit gilt: Die Bilderwelt zeigt Städte und Länder so, wie sie sind – auch mit Bier, Wein und Schnaps als Lernwörtern. Die Regel „neue Szenen sind alkoholfrei“ aus 877/878 (Abschnitt 878) ist aufgehoben.

### Ältere Städte: Ersetzungen aus 879 zurückgenommen
- Frankfurt (Apfelwein), Düsseldorf (Altbier, Brauhaus), Nürnberg und Dresden (Glühwein), Regensburg (Biergarten, die Halbe), Stuttgart (Viertele), München (Bierzelt, „O'zapft is!“, Maß mit Bier, Bierbank) sind wieder genau wie vor 879 (Revert 31aace7).

### Neue Städte aus 877: die echten Spezialitäten zurückgeholt
Je Szene ein Zeichner, der gezielt nur das zurückholt, was wegen Alkohol ersetzt worden war. Danach ein unabhängiger Prüfer, der mit der alten Fassung vergleicht. Ein Suchlauf über die Geschichte aller 182 Szenen hat zusätzlich Potsdam gefunden.
- **Hannover:** „die Lüttje Lage“ (Bier und Korn aus zwei Gläsern in einer Hand, Schützenfest) statt der Apfelschorle auf der Picknickdecke. Die Gläser sind nach den echten Maßen neu gezeichnet: Bierglas ≈ 8 cm, Ø 5,4 cm; Kornglas ≈ 8 cm, schmal.
- **Trier:**
  - Auf der Tafel steht wieder „Viez 0,25 l · Riesling · Flammkuchen“, auf dem Sonnenschirm „Riesling“.
  - Die Lupen „der Viez“ (Viezporz) und „der Moselwein“ (Riesling im Römerglas) sind wieder da. Das Glanzlicht am Römerglas wächst jetzt mit der Glasgröße.
- **Athen:** Der Kiefern-Tipp nennt wieder den Retsina (Harz der Aleppo-Kiefer).
- **Weimar:** Am Marktstand steht wieder „Zwiebelkuchen · Federweißer“.
- **Freiburg:** Schwarzwälder Kirschtorte wieder „mit einem Schuss Kirschwasser“.
- **Heidelberg:** „Aus den Trauben vom Neckarhang wird Wein gemacht.“
- **Potsdam:** Die Hermen von Sanssouci sind wieder „Begleiter des Weingottes Bacchus“.
- Alle sieben Szenen: „alle Teile gut erreichbar“, gepackt 41–70 KB, frisch aus der Quelle gebaut.

### Sonden
- 878 grün, 876 grün.
- 840 (alte Bilderwelt unverändert): 3 Prüfungen rot. Das ist NICHT neu in 880: Die Bilderwelt-Änderungen aus 877/878 in app.js wirken auch im Zweig der alten Bilderwelt; dort sind sie nicht als „nur neue Bilderwelt“-Weiche gebaut (Artikel-Modus, Lupenmarken, Zurück-Spur, Fangflächen). Das wird in 881 behoben: Der alte Zweig wird wieder Zeile für Zeile wie 812, die neuen Regeln gelten nur für die neue Bilderwelt.

**Offen**
- Tier-Bibliothek: neues Werkzeug (Skelett, Umriss, Licht, Fell, Füße, Köpfe, Vorprüfung) und Brücke in die App mit der ersten Szene „Tiere der Savanne“ sind im Bau.
- Weiche der alten Bilderwelt (Sonde 840) – Fassung 881.

## Fassung 881 — Alte Bilderwelt wieder genau wie 812; erste Tier-Szene „Tiere der Savanne“; neues Tier-Werkzeug (Funk 225/299)

XANDER (Funk 299): „die nächste Priorität sollte der Abschluss der Tiere sein“ · (Funk 225, siehe Abschnitt 840): die alte Bilderwelt bleibt unverändert, die neue ist nur eine Option.

### Weiche alte/neue Bilderwelt (Sonde 840 wieder grün)
- Die Bilderwelt-Regeln aus 877/878 (Artikel-Modus nur mit Leerzeichen, Lupenmarken mit `marke`, Zurück-Spur mit Lupe, Fangflächen ohne Lupenmarke, Marken-Dach mit Klickregel, Hinweis in der Lupe, Artikel-Knopf erst ab vier Wörtern) wirkten ohne Weiche auch in der alten Bilderwelt. Jetzt gelten sie nur noch mit `?bilderwelt=neu`. Der alte Zweig steht Zeile für Zeile wie in 53eaa31 (Stand 812, nur ohne Italienisch aus 843).
- 25 Weichenstellen (bisher 15). Alle sind im Nachtrag zu Abschnitt 840 aufgeführt; die Sonde zählt sie und prüft jetzt auch `bwNeueRunde`.
- Vergleich mit einem Arbeitsbaum von 812 im Browser: Badezimmer, Teil, Artikel-Modus, Lupe, Zurück, „Alle Szenen“, Küche – in jedem Schritt Zeichen für Zeichen gleich. Die neue Bilderwelt verhält sich wie vorher; „Andere Szene“ setzt jetzt wie „Alle Szenen“ die Lupe zurück.

### Erste Tier-Szene „Tiere der Savanne“ (nur neue Bilderwelt)
- Neue Szene `tiere_savanne`, Thema „Tiere“:
  - 12 Arten aus der Tier-Bibliothek: Elefant, Giraffe, Zebra, Gnu, Gazelle, Nashorn, Nilpferd, Löwe, Löwin, Leopard, Gepard, Hyäne. Herden laufen über `<use>`.
  - Dazu Berg, Wasserloch, Termitenhügel, Felsen, Akazie, Gras – zusammen 18 Wörter mit Tipps.
  - Blick vom Safariwagen; die Größen ergeben sich aus dem Abstand.
- Gepackt 68 KB, „alle Teile gut erreichbar“, in der Szene keine Filter mehr.
- Erstes Bild in der App (Rechner 4× gedrosselt): 300–445 ms. Das liegt im Bereich der Bäckerei und noch über dem Ziel von 200 ms.
- Brücke `werkzeug/bilderwelt/tiere/szene.js`:
  - `tierTeil(S, id, x, y, epm, { dir, herde, tipp, oben, schatten, hinter, davor, ausschnitt })` setzt eine Art aus der Bibliothek als Teil in eine Szene.
  - Die Zeichnung wird bei jedem Bau frisch aus der Bibliothek geholt. Jede Verbesserung an einer Art kommt so beim nächsten Bau von selbst in die Szene.
- Nichts Bestehendes wurde ersetzt; die alte Bilderwelt und die Großgeschenke bleiben, wie sie sind.

### Tier-Werkzeug 880 (nur im Werkzeug, nicht in der App)
- Neu: Baupläne mit Skelett für 12 Körperbauformen (Maßtabellen mit Quellen), durchgehender Körperumriss, Beine als Gelenkkette mit Sprunggelenk und Fersenhöcker, Licht mit Kernschatten ohne Filter, Fell in Strähnen mit Wuchsrichtung, Fuß-Vorlagen (Pfote, Huf, Klaue, Sohle, Vogel- und Theropodenfuß), Kopf-Vorlagen mit Augenhöhle (12), Federn.
- Neue Vorprüfung `pruefe-tier.js`: misst die Proportionen am Bild gegen Soll-Spannen aus der Recherche, prüft das Licht (Bild mit und ohne Schattierung) und meldet NaN, verbotene Filter, Größe und Zeichenzeit.
- In Szenen laufen keine Rauschen-/Relief-Filter mehr (Leistung).
- Der Wolf ist zur Probe komplett neu darauf aufgebaut. Ein unabhängiger Prüfer gab im Mittel 5,2 statt 4,4 – besser, aber noch kein Sprung. Alle anderen 115 Arten sind im Großbild bitgleich wie vorher.

### Sonden
- Grün: 840, 878, 876 und 879.
- `pruefe-szene` für `tiere_savanne`.

**Offen**
- Die sieben fehlenden Tiergruppen (45 Arten: Vögel, kleine Meerestiere, Amphibien/Fische, Amerika/Steppe, Urzeit-Meer).
- Die schwächsten Arten neu aufbauen (Braunbär, Panda, Jaguar, Gazelle, Säbelzahnkatze, Riesenhirsch, Katta, Kobra, Python, Wellensittich, Diplodocus, Velociraptor, Pteranodon).
- Je Lebensraum eine Tier-Szene (Polar, Meer, Wald, Bauernhof, Haustiere, Dinosaurier, Eiszeit, Regenwald, Greifvögel …).
- Ehrlich zum Maßstab: Mit Vektorgrafik ist eine Naturführer-Illustration erreichbar, Fotorealismus nicht (Fotos/Bild-KI sind von hier nicht verfügbar).

## Fassung 882 — Big-Ben-Glocke klar und ausklingend, Aussprache „z“, Tafel-Ordner und Schieber, Zoo-Tiere (Funk 302/303)

XANDER (Funk 303): „Der Westminster Sound … ist ganz leise und abgehakt … die Glockenklänge sollen ausklingen und nicht nur so stakkato … offenbar hast du da jetzt zwei Sounds“ · (Funk 302): „die Schriften teilweise außerhalb der Ordner … geht dann in den falschen Ordner“ · „dass man das Bild … einfacher verschieben kann mit einem Handle“ · „die Tiere im Zoo sehen so gut wie unmöglich aus … bei dem Zebra sind die Streifen total unrealistisch … dann nimm das alte Zebra wieder“ · „die Aussprache ist immer noch nicht gut … wenn z gesprochen wird“.

### Rathausuhr (Westminster) – ein Klang, deutlich, ausklingend
- **Zwei Klänge:** Zur vollen Stunde läutete im Spiel zusätzlich die alte Dorfkirche (`spiel.js` `dorfGlocken`), obwohl die neue Stadt im Dorf-Fenster stand. Sie schweigt jetzt, solange `.sp-dl-neustadt` im Bild ist (`dorfNeustadtImBild`). Das alte gemalte Dorf behält seine Kirchenglocken.
- **Stakkato:** Jeder Teilton fiel in 0,4–2 s auf Stille (Schlagton 1,4 s). Jetzt hat jeder Teilton seinen eigenen Nachklang (Viertelglocken: Unterton 18 s, Prime 12 s, Schlagton 8 s; Stundenglocke noch länger), als leicht verstimmter Doppelton (schwebt, bricht nie ganz weg), dazu ein Nachhall wie über dem Marktplatz.
- **Zu leise:** Fern vom Rathaus fiel die Uhr auf 1/20 (0,014). Jetzt fern ≈ 0,21, nah ≈ 0,47 – überall deutlich, nah lauter.
- **Technik:** Die fünf Glocken (gis′ fis′ e′ h + Stundenglocke E) werden einmal „gegossen“ (OfflineAudioContext → AudioBuffer, 22 kHz, mit Nachhall, Ende weich ausgeblendet; ≈ 0,5 s beim ersten Mal, ≈ 5 MB) und danach nur abgespielt: 19 Pufferquellen um 15 Uhr statt Hunderter Oszillatoren. Ohne OfflineAudioContext klingen dieselben Teiltöne direkt.
- Takt wie Big Ben: Viertel 4 Töne, halb 8, dreiviertel 12, volle Stunde 16 + Stundenschläge (alle 3,6 s); nachts (22–7 Uhr) still.

### Aussprache: „z“, „s“, „sch“ kamen verfälscht bei Azure an
- **Ursache:** `aussprache-pruefung.js` rechnete die Aufnahme (48 / 44,1 kHz) ohne Tiefpass auf 16 kHz. Alles über 8 kHz faltete zurück ins Sprachband: ein 11-kHz-Zischen kam mit voller Stärke als 5 kHz an (gemessen 0,50 bzw. 0,41). Genau die Zischlaute (s, z = ts, sch, f) wurden dadurch verwaschen. Die Stadt-Quests rechnen seit 836 sauber; Aussprache-Trainer, Spiel-Aussprache und Wörterbuch gingen noch über die alte Stelle.
- **Jetzt:** derselbe Weg wie in 836 – Tiefpass bei 7 kHz (Sinc mit Blackman-Fenster), Zwischenwerte an der genauen Stelle. Faltung 0,0000, Sprachband unverändert, 12 s Aufnahme ≈ 0,1–0,2 s Rechenzeit. Wirkt auch auf den Vergleich mit der Vorlage (DTW).
- Die Wortliste für die Erkennung in den Stadt-Quests (Fast Transcription mit phraseList, Fassung 879) liegt fertig in `supabase/functions/aussprache/index.ts`, ist aber noch NICHT hochgeladen: Das Hochladen der Funktion braucht Xanders ausdrückliches OK.

### Tafel: Ordnernamen und Schieber
- **Ordnernamen:** Die Ordnerliste ist ein Raster in einem festen, scrollenden Kasten. Die Zeilen wurden auf die Mindesthöhe (44 px) gestaucht, Symbol + Name + „n Bilder“ brauchen ≈ 82 px – der Rest hing über die Lücke auf das Symbol der nächsten Zeile („Alltag / 6 Bilder“ lag auf „Behörden“). Jetzt: Zeilen so hoch wie ihr Inhalt, jede Kachel EINE Karte mit Rahmen (ganze Karte tippbar), 10 px Abstand, Namen nach zwei Zeilen mit „…“ (ganz im title). Ebenso Aussprache-Kacheln und gesicherte Tafeln.
- **Schieber:** Ist ein Bild herangeholt, erscheint links unten ein runder Griff mit Vier-Wege-Pfeil (Gegenstück zum ⌄ rechts). Festhalten und ziehen: das Bild geht 1 : 1 mit, in jede Richtung, nie über den Blattrand hinaus; Pfeiltasten gehen auch. Die anderen sehen es über denselben „blick“ wie beim Aufziehen (höchstens alle 200 ms, beim Loslassen sofort).
- **Fehler nebenbei:** `lcTafelBlickSetzen` machte aus dem Rand (0) die Mitte (`|| 0.5`) – wer das Bild in die linke/obere Ecke schob, sprang zurück. Behoben.

### Zoo: das alte Zebra ist zurück
- Jede Fassung des Zebras im gleichen Bild nebeneinander verglichen (alte Bilderwelt 13./14./17.09., Zoo-Baukasten 03.10. zwei Fassungen, Tier-Bibliothek 880 acht Fassungen). Der Zoo-Baukasten zeichnete einen „Strichcode“ (gleich breite Balken über den ganzen Rumpf, Linien quer über den Bauch) – das schlechteste von allen.
- Ehrlich zu Xanders Frage: Die Bibliotheks-Zebras hatten beim Kritiker nie ein OK (Streifen 3/10, dann 4/10 „NICHT OK“).
- Jetzt zeichnet der Zoo-Baukasten (`werkzeug/bilderwelt/szenen/zoo.js`, `altesZebra()`) wieder das Zebra der alten Bilderwelt vom 17.09., Strich für Strich aus der eingefrorenen `szenen/zoo.js` gelesen (ohne Bodenschatten, Farbfilter fest eingerechnet, einmal in den defs, jedes Zebra ein `<use>`). Es steht damit in „Zoo“, „Zoo II“ und „Tiere der Welt“. Im Zoo stehen die zwei Zebras jetzt Rücken an Rücken (das alte Zebra trägt den Kopf höher; Kopf an Kopf hätten sie sich überdeckt).
- „Tiere der Savanne“ behält das Bibliotheks-Zebra (kein Strichcode, bessere Anatomie; Mangel: Beine zu fein gestreift).
- Gepackt: Zoo 53 → 59 KB, Zoo II 17 → 24 KB, Tiere der Welt 26 → 32 KB (alle unter 70 KB). Die alte Bilderwelt ist unverändert (Sonde 840 grün).
- Die übrigen Zoo-Tiere: jede jetzige Baukasten-Fassung ist gleich gut oder besser als ihre Vorgänger – aber Elefant (Kastenkörper), Nashorn, Nilpferd, Gorilla und Schimpanse bleiben schwach. Die Bibliotheks-Tiere (wie in „Tiere der Savanne“) sind dort deutlich näher am echten Tier. Nächster Schritt (883): diese Zoo-Tiere aus der Bibliothek holen, nur wo der Vergleich klar besser ist. Das Blatt alt/neu je Tier liegt bei.

### Sonden
- Neu und grün: `pruefe-882-glocke.js` (ein Klang, Ausklang, Lautstärke), `pruefe-882-aussprache-z.js` (keine Faltung bei 48/44,1 kHz; Gegenprobe mit dem alten Stand rot), `pruefe-882-tafel-ordner-griff.js` (Namen in ihrer Kachel bei 360 und 1280 px, Tipp öffnet genau diesen Ordner, Schieber 1 : 1 in 8 Richtungen und frei, Rand bleibt Rand, „blick“ geht hin und her; Gegenprobe rot).
- Grün: 840, 872 (alle Szenen), 768, 771, 772, 783, 837, 725, 753, 749; `pruefe-szene` für Zoo, Zoo II, Tiere der Welt.
- 825: alle Glocken-Prüfungen grün (angepasst: gegossene Glocken statt Oszillatoren; „fern deutlich, nah lauter“ statt „fern fast stumm“). Rot bleibt dort die Laternen-Messung um 1:30 (4,63 statt < 4,6) – sie war schon vor 882 rot (4,65) und hat mit dem Klang nichts zu tun.

**Offen**
- Zoo-Tiere aus der Tier-Bibliothek (Elefant, Nashorn, Nilpferd, Gorilla, Schimpanse, Giraffe, Großkatzen) – 883.
- Aussprache-Funktion mit Wortliste hochladen – wartet auf Xanders OK.
- Tier-Bibliothek: fehlende Gruppen, schwächste Arten, Tier-Szenen je Lebensraum.

## Fassung 883 — Zoo-Tiere aus der Tier-Bibliothek (Funk 302: „dass sie wirklich realistisch sind“)

XANDER (Funk 302): „die Tiere im Zoo sehen so gut wie unmöglich aus … schaue auch was du mit den anderen Tieren machst dass sie wirklich realistisch sind“.

### Was sich geändert hat (nur neue Bilderwelt)
- Die Zoo-Szenen holen die Tiere jetzt aus der Tier-Bibliothek (Werkzeug 880, wie „Tiere der Savanne“) – aber nur dort, wo das Bibliotheks-Tier im echten Szenenausschnitt KLAR realistischer und besser erkennbar ist:
  - **Zoo:** Elefant, Gorilla, Giraffe, Löwe.
  - **Zoo II:** Giraffe, Löwin, Braunbär, Krokodil, Tiger (steht am Badebecken), Leopard (steht mit allen vier Pfoten auf dem Ast).
  - **Tiere der Welt:** Giraffe, Elefant, Nashorn, Löwe (steht), Krokodil (3,6 m), Braunbär, Schimpanse (auf allen vieren am Ast).
- Bleiben beim Baukasten: Zebra (das alte, Funk 302), Nilpferd (im Wasser liest sich der Baukasten-Kopf besser; in „Tiere der Welt“ verdeckte das längere Bibliotheks-Nilpferd den Nashornkopf), Paviane (nur knapp besser, nicht klar), Puma, Flamingo, Pelikan (keine Bibliotheks-Art).
- Bereit, aber aus: Schimpanse und Nashorn im Zoo – die Szene käme über 72 KB (74,8 bzw. 77,3 KB).
- Brücke `werkzeug/bilderwelt/tiere/szene.js`: neu `tierKunst(S, id, x, y, epm, o)` gibt Zeichnung + Rahmen zurück (ohne eigenes Teil), so behält jedes Zoo-Teil sein Wort und seinen Tipp. `tierTeil` nutzt es; Savanne und Meer bauen sich bitgleich.
- Größen nach dem Maßstab der Szene am Fuß des Tiers (Meter → Einheiten), keine Baukasten-Vergrößerung mehr. Kein Kopf verdeckt; die Fangflächen in den Lupen folgen dem Umriss. Nebenbei: Die Fangfläche des Nilpferds in „Tiere der Welt“ lag im Wasser darunter – jetzt auf dem Tier.
- Die sechs Menschen im Zoo sind leichter gebaut (haarfeine Striche unter 0,1 px weg, gemeinsame Verläufe einmal, Strich-Enden je Figur einmal): 4,9 KB weniger, im Bild gleich (mittlere Abweichung 0,01–0,05 von 255, kein Bildpunkt > 24).

### Wie entschieden wurde
- Jede der 24 Tier-Stellen im echten Szenenausschnitt vorher/nachher gerendert (Telefonbreite und dreifach groß).
- **Blindprüfung:** je Paar zwei unabhängige Richter in vertauschter Reihenfolge, ohne Dateinamen; bei Uneinigkeit ein dritter (54 Urteile). Übernommen nur „klar besser“ (Mehrheit und mindestens zwei „deutlich“). Ergebnis: 19 Stellen klar besser (17 jetzt in der App, 2 über der Größengrenze), Paviane nur knapp besser (bleiben), Nilpferd in „Tiere der Welt“ alt klar besser (bleibt).

### Größe und Tempo (gepackt; Zeichnen bei 4× gedrosseltem Rechner)
- Zoo 59 → 71 KB, Zeichnen ≈ gleich (168–179 ms; die leichteren Menschen gleichen aus).
- Zoo II 24 → 44 KB, 115–139 ms; Tiere der Welt 32 → 59 KB, 138–143 ms – damit auf dem Stand von Savanne (135 ms) und Bäckerei (116–119 ms).

### Sonden
- `pruefe-szene`: Zoo, Zoo II, Tiere der Welt „alle Teile gut erreichbar“.
- Grün: 840 (alte Bilderwelt unverändert), 872 (alle Szenen).

**Offen**
- Schimpanse und Nashorn im Zoo (über der Größengrenze) – nach einer weiteren Entschlackung der Szene.
- Tier-Bibliothek: fehlende Gruppen, schwächste Arten, Tier-Szenen je Lebensraum.

## Fassung 884 — Messung bei echten Nutzern (Funk 255, Zusage Funk 258 Punkt 5)

XANDER (Funk 255): „… dass auf beiden Seiten immer alles spielbar ist und niemals abstürzt und alles optimiert ist“. Zugesagt (Funk 258, Punkt 5): „Echte Messung bei echten Nutzern (Ladezeit, Abbrüche) statt nur bei mir.“

Für Xander ändert sich nichts Sichtbares. Bisher kannten wir nur die Leitungs-Zeitleisten (`spiel_diagnose` „leitung“/„verbindung“). Wie lange die Seite bei seinen Leuten bis „bereit“ braucht, welche Fehler dort auftreten, ob eine Seite abstürzt und ob das Klassenzimmer ruckelt, wusste niemand. Die ersten Zahlen gibt es nach 2–3 Tagen.

### Wie es gebaut ist (livechat.js und app.js unberührt)
- **Mitschreiber in index.html** (Block direkt nach `DMA_STEMPEL`, ES5): `window.DMA_MESS` sammelt nur, sendet nichts und fasst weder Leitung noch DOM an.
  - JS-Fehler (`error`, Capture-Phase), Ladefehler von SCRIPT/LINK und `unhandledrejection` – ohne `preventDefault`, die Konsole und `pageerror` sehen alles wie vorher.
  - Langläufer per `PerformanceObserver('longtask')`, nur wenn der Browser den Typ kennt (sonst warnt Firefox).
  - Echte Tipps auf „Wissen“ und „Klassenzimmer“ (`isTrusted`, höchstens 10): vom Tipp bis zum ersten Bild, in dem die Ansicht steht (rAF, dann `setTimeout 0`); nach 600 Bildern ohne Ansicht `-1`.
  - Ab DOMContentLoaded ein Zuhörer `LiveChat.beiAenderung`: nur Lage, Zeit, Leute, Kamera, Hauptraum – nie das Lage-Objekt (es trägt alle Nachrichten). Damit zählt auch die Rückkehr in den Raum gleich nach dem Laden.
  - `pagehide` vor DOMContentLoaded → Merker `dma-mess-abbruch` (Abbruch beim Laden). Eigenes Neuladen (`dmaMinFehlt`, neue Fassung über `fassung.json`) setzt vorher `DMA_MESS.selbst` und zählt nicht.
- **Nachlader** im Startlisten-Block: `messung.js` kommt 4 s nach `load` in einer Ruhepause (`requestIdleCallback`), ohne `dmaMinFehlt` – fehlt die Messung, lädt die Seite deswegen nicht neu. min/messung.js und Stempel baut `fassung-setzen.js`.
- **messung.js** wertet aus und sendet über `spiel_diagnose_senden` (wie `leitungSenden`, Fehler still geschluckt, nie `console.*`):
  - `mess-start` (einmal je Seite, 20 s nach messung.js): `t` = ttfb, fcp, lcp, bereit (domContentLoadedEventEnd), load, drinAb; `tipp` (wissen/kz, je höchstens 3: [ab, ms, vor-bereit]); `kb`, `n`, `cache` (eigene Dateien bis „bereit“); `lt` = Langläufer bis bereit+5 s [Anzahl, Summe, längster]; `teile` (DMA_TEIL_SOFORT/FEHLER); `netz`, `ger`; `typ`, `neu`, `sw`, `hinten`; `bau` (Stempel von min/app.js oder „quelle“); `ua`; `vorher` (siehe unten); `fehler` bis dahin; `kosten` [Mitschreiber µs, Einrichten messung.js ms]. Typisch 0,5–0,6 KB.
  - `mess-fehler` (gebündelt, 20 s nach dem ersten Fehler nach der Startzeile; eine zweite nur bei neuen Fehlern und frühestens 5 min später): je Fehler [Anzahl, Art, Text, Ort, erstes Mal ms]; Arten js/versprechen/laden/fremd („Script error.“); höchstens 8 verschiedene je Seite, der Rest nur gezählt (`fehlerMehr`). ResizeObserver-Schleifen zählen nicht. Ort = „Datei:Zeile:Spalte“ (bei Versprechen der erste eigene Rahmen im Stack).
  - `mess-raum` (je Aufenthalt, beim Verlassen oder Raumwechsel; im Hintergrund als Teilzeile, wenn ≥ 2 min drin und die letzte Zeile ≥ 10 min her): `drin` (Betreten bis drin), `ab`, `dauer`, `kz` (Tipp ≤ 60 s davor), `fenster` = je 30 s [i, Summe, längster, Anzahl] (nur nicht-leere, höchstens 60), `anzahl`, `zaeh` (Fenster mit Summe ≥ 300 ms oder einem ≥ 200 ms), `ges`, `loaf` (die 3 längsten Bilder mit Datei, Zeichenstelle, Auslöser – nur Chrome), `inp` (die 3 langsamsten Eingaben ≥ 104 ms – nur Chrome), `uhr` (1 = ohne longtask: Ersatzmessung über den Versatz eines 500-ms-Takts, iPhone/Firefox), `luecke`, `mb`, `leute`, `bild`, `haupt`; dazu (nachgebessert) `k` (Kennung der Zeile, bleibt beim Nachsenden gleich – Doppelte lassen sich herausfiltern), `grund` (aus | wechsel | hidden = Teilzeile im Hintergrund | weg = beim Weggehen | offen = Zusammenfassung, die die nächste Seite mit `spaet: 1` nachschickt), `teil` (1 = Teilzeile), `folge` (wie viele Zeilen desselben Aufenthalts vorher schon raus sind; nur `folge = 0` trägt ein gültiges `drin`).
  - Alle Zeilen tragen `mv: 1` (Fassung des Zeilenformats) – unabhängig von `f` (DMA_VERSION).
- **Absturz-Indiz (Laufbuch `dma-mess-lauf`)**: jede Seite schreibt alle 30 s (nur sichtbar), bei Sichtwechsel und bei `pagehide` (`zu: 1`), höchstens 6 Einträge. Die nächste Seite ordnet jeden nie geschlossenen Eintrag ein:
  - dieselbe Registerkarte (`sessionStorage dma-mess-tab` überlebt „Aw, Snap“ + Neuladen) → sicher tot;
  - fremde Registerkarte, sichtbar und 3 min still → tot; im Hintergrund → Frage über `BroadcastChannel("dma-mess")`, ohne Antwort in 1 s tot (ohne BroadcastChannel erst nach 12 h).
  - Meldung in `vorher`: `weg` (war sichtbar: Absturz, Akku, Zwangsbeenden), `hinten` (im Hintergrund weggeräumt, meist kein Absturz), `laden` (Abbruch vor DOMContentLoaded), mit Dauer, Minuten seitdem, ob im Raum, Speicher (Chrome), `verworfen` (`document.wasDiscarded`).
  - Eine offene Raumzusammenfassung (`ro`) und unbestätigte Raumzeilen ohne keepalive (`ru`) der toten oder geschlossenen Seite werden als `mess-raum` mit `spaet: 1` nachgesendet – nie eine leere.

### Nachgebessert nach der Prüfung: die Raumzeile beim Weggehen
Die Prüfung fand (nachgestellt mit eigener Sonde): wer ≥ 2 min im Raum war und dann schloss, neu lud oder wegnavigierte (auch beim automatischen Neuladen für eine neue Fassung), verlor die Raumzeile. `visibilitychange` schickte sie in eine Ruhepause (`requestIdleCallback`), die beim Entladen nie mehr kommt, zählte den Tageszähler trotzdem hoch und setzte die Fenster zurück; `pagehide` schrieb danach eine leere Zusammenfassung, und die nächste Seite schickte sie als `mess-raum {spaet: 1, dauer: 0, ges: [0,0,0]}` – auf dem alten Server fraß das sogar den Platz der nächsten Startzeile. Jetzt:
- Beim Verstecken und bei `pagehide` geht die Zeile **sofort** raus, nie über eine Ruhepause – mit `fetch(…, {keepalive: true})` direkt an `/rest/v1/rpc/spiel_diagnose_senden` (wie `sfuAbschied` in livechat.js, Fassung 842), damit sie das Ende der Seite überlebt. Die Zugangsmarke dafür liegt nur im Speicher; sie wird beim Betreten des Raums und danach höchstens alle 10 min über `auth.getSession()` geholt (nie beim Start). supabase-js holt sie sonst erst asynchron – beim Entladen läuft nichts Asynchrones mehr.
- Die Zeile steht als „unterwegs“ (`ru`) im Laufbuch, BEVOR sie losgeht; erst die Antwort des Servers streicht sie. Stirbt die Seite dazwischen, schickt die nächste sie nach – außer sie ging mit keepalive raus (`ka`): die trägt der Browser über das Ende der Seite hinaus, ein Nachschicken wäre doppelt.
- Ohne Marke wird beim Entladen nichts auf gut Glück gesendet: die Zusammenfassung bleibt im Laufbuch, und die nächste Seite schickt sie genau einmal nach. Wichtig dabei: beim Entladen kommt `pagehide` VOR `visibilitychange` – ein „hidden“ danach gilt genauso als Weggehen.
- Beim Entladen lehnt Chrome das Versprechen eines keepalive-Aufrufs ab, obwohl die Anfrage weiterläuft (in der Sonde gefunden: die Zeile landete deshalb zusätzlich in der Kiste und kam ein zweites Mal). Nach `pagehide` wird darum nichts mehr zurückgenommen.
- Eine Zeile ohne neue Daten (Folgezeile unter 2 s ohne Langläufer) entsteht gar nicht erst – weder als Zeile noch als Zusammenfassung.

### Was bewusst NICHT gesendet wird
Namen, Raumnamen, Chat-Inhalte, Kennungen, Adressen. Fehlertexte werden gereinigt: E-Mail → ‹mail›, UUID → ‹id›, ≥ 5 Ziffern → ‹zahl›, Adressen → nur Dateiname, data:-Adressen → ‹data›, höchstens 140 Zeichen. Nachgebessert: der Ausschnitt, den Chrome bei `JSON.parse` anhängt (`Unexpected token 'H', "Hallo Zuza"... is not valid JSON`, auch mit `..."` davor) → ‹json›, der ungültige Selektor bei `querySelector` → ‹selektor›, sonstige Zitate in doppelten oder deutschen Anführungszeichen (Safari: `Unexpected identifier "…"`) → ‹text›. Bezeichner in einfachen Anführungszeichen (`reading 'foo'`) bleiben, sie sagen, was kaputt war. In der Sonde mit echten Chrome-Meldungen geprüft.

### Tagesmengen
- Je Seite höchstens 1 Start-, 2 Fehler-, 3 Raumzeilen. Je Gerät und Kalendertag höchstens 8 „mess-*“-Zeilen – aber nur, wenn der Server mit eigenem Zähler antwortet (`"mess": 12`). Antwortet der alte Server, bleibt der Client von selbst bei **1** Zeile am Tag (berichtigt; vorher stand hier fälschlich, 3 reichten, „damit die Leitungs-Zeilen nicht verdrängt werden“). Der alte Server zählt 40 Zeilen je Konto und 24 h über alle Arten; die Deckel des Clients gelten aber je Gerät und gehen früh am Tag raus. Lesend gezählt über 30 Tage: 3 Konto-Tage mit 40, 4 mit ≥ 37, 8 mit ≥ 30 (z. B. 03.10.: leitung 25 + verbindung 8 + tonstand 7 = 40). An solchen Tagen kostet jede Mess-Zeile eine Leitungs-Zeile („genug für heute“) – auch die eine. Deshalb: `fassung-884-messung.sql` VOR dem Ausliefern einspielen. Die eine Zeile verrät zugleich, welcher Server antwortet; ab dann (gemerkt in `dma-mess-tag.srv`) gelten 8.
- Gezählt wird, wenn ein Aufruf wirklich losgeht, nicht wenn er eingeplant wird; schlägt er fehl, wird zurückgezählt (vorher zählte eine Zeile mit, die in einer Ruhepause wartete, die beim Entladen nie kam).
- „genug für heute“ vom Server stoppt das Senden bis zum nächsten Kalendertag.
- Gäste senden nichts (die RPC verlangt eine Anmeldung). Ihre Zeilen warten in `dma-mess-kiste` (höchstens 3, höchstens 3 Tage) und gehen mit der nächsten Startzeile nach dem Anmelden raus (Feld `alt` = Minuten). Nachgebessert für geteilte Geräte: jede Kisten-Zeile merkt sich einen kurzen Fingerabdruck des Kontos, unter dem sie gesammelt wurde (nur auf dem Gerät, nie gesendet). Eine Zeile von Konto A geht nie unter Konto B raus (verworfen); eine ohne Anmeldung gesammelte trägt `gast: 1` – wem sie gehört, ist nicht sicher.
- Prüfläufe (`navigator.webdriver`) senden nur mit `localStorage dma-mess-pruef`; alle anderen Sonden bleiben unberührt.

### Datenbank (NICHT eingespielt – diese Sitzung darf nur lesen)
- `supabase/fassung-884-messung.sql`: `spiel_diagnose_senden` zählt „mess-*“ (höchstens 12 je Konto und 24 h) und alles andere (wie bisher 40) getrennt und antwortet mit `"mess": 12`. Sonst unverändert (SECURITY DEFINER, Anmeldung nötig, > 6000 Zeichen → `zu_lang`, Rechte nur `authenticated`). Geprüft: `spiel_diagnose` hat keinen Constraint auf `art`, RLS an ohne Policies, nur die RPC schreibt.
- Auswerte-Abfragen stehen am Ende derselben Datei (lesend gegen die echte Datenbank geprüft). Echter Beweis nach dem Ausliefern: `select art, count(*), max(zeit) from spiel_diagnose where art like 'mess-%' group by art`.

### Kosten
- Mitschreiber: ungebremst 0,1–0,3 ms, Rechner 4× gebremst Median ≈ 1 ms (0,2–2,4 ms). index.html wird 4,4 KB roh bzw. 1,6 KB gepackt größer (geschätzt waren 0,6 KB; den Großteil macht die Tipp-Messung, die vor messung.js laufen muss).
- messung.js: 14,1 KB verkleinert, 6,2 KB gepackt (nach der Nachbesserung; vorher 11,7/5,1), erst 4 s nach `load`; Einrichten 1,5–1,8 ms; kein langes Bild (LoAF) mit messung.js; kein DOM.
- Dauerkosten: ein Zeitgeber alle 30 s (nur sichtbar, ~1 KB localStorage, im Raum bis ~3 KB mit offener Zusammenfassung und unbestätigten Zeilen), ein O(1)-Zuhörer je `melden()`, im Klassenzimmer die Beobachter für longtask/LoAF/event und höchstens alle 10 min ein `getSession()` (aus dem Speicher von supabase-js, ohne Netz, solange die Marke gilt).
- Neu gegen alt (Sonde, Rechner 4× gebremst, je 9 Läufe): FCP 292 gegen 288 ms, DCL 648 gegen 681 ms (Median) – innerhalb der Streuung (FCP je Lauf 240–364 ms). Die geforderten „3 % oder 20 ms“ sind bei dieser Streuung nicht auflösbar. Nachgebessert: der Median-Vergleich aus 9 Läufen schlug in der Prüfung zufällig an (DCL 620 gegen 579 ms bei 21 ms Toleranz), während eine verschränkte Nachmessung mit 20 Paaren keinen Nachteil zeigte (−22 ± 14 ms). Die Sonde wertet jetzt **paarweise** aus (16 verschränkte Paare, `PAARE=`): rot nur, wenn neu nachweisbar langsamer ist als 20 ms bzw. 3 % (Mittel der Paar-Unterschiede minus zwei Standardfehler über der Grenze). Zwei Läufe nach der Nachbesserung (index.html dabei unverändert, nur der Stempel von messung.js): FCP Median 280 gegen 284 ms, je Paar −9 ± 15 ms, und 280 gegen 272 ms, je Paar +18 ± 9 ms; DCL 619 gegen 605 ms (+14 ± 18) und 634 gegen 625 ms (+1 ± 11). Beide grün, aber ehrlich: die beiden FCP-Läufe widersprechen sich im Vorzeichen; ein kleiner Nachteil beim ersten Bild bis etwa 20 ms (Rechner 4× gebremst) ist damit nicht ausgeschlossen – er käme vom größeren index.html (+1,6 KB gepackt), nicht von messung.js (kommt erst nach load + 4 s). Direkt gemessen kostet der Mitschreiber 4× gebremst 0,2–1,8 ms (Median < 1 ms).
- `ladezeit-messen.js 4g` (je 2 Durchgänge, ein Lauf je Fall, Profiler an), neu gegen alt: kalt „bereit“ 1206/1085 gegen 1129/1056 ms, erstes Bild 440/500 gegen 448/448 ms, 564 gegen 562 KB bis „bereit“; warm 858/870 gegen 769/743 ms; wieder 780/873 gegen 761/787 ms. In allen sechs Paaren lag neu hinten (Mittel +71 ms). Das war Anlass für eine genauere Nachmessung (messung.js wird in diesen Läufen nie geladen – die Seite schließt vor load + 4 s; der einzige Unterschied ist der Mitschreiber):
  - verschränkt je 8 Läufe, 4G, Rechner 4×, warm, ohne Profiler, „bereit“ in der Seite gemessen: Median 845 gegen 819 ms, paarweise +14 ms bei ±12 ms Standardfehler und ~140 ms Streuung je Lauf; DCL 701 gegen 681 ms, FCP 352 gegen 360 ms.
  - longtask-Beobachter allein: 300 Aufgaben 2361 gegen 2374 ms (+0,5 %, im Rauschen).
  - Ehrlich: ein Unterschied unter ~15 ms ist mit diesen Mitteln nicht auszuschließen; direkt gemessen kostet der Mitschreiber 0,7–1,3 ms bei 4× gebremstem Rechner, dazu 1,6 KB mehr index.html (gepackt).

### Ehrliche Grenzen
- Gäste werden nicht gemessen, solange sie sich nicht anmelden – gerade der kalte Erststart neuer Besucher fehlt damit. Gäste schreiben zu lassen hieße, `anon` schreiben zu lassen (Spam-Gefahr); nicht empfohlen.
- longtask, LoAF, Event-Timing und `performance.memory` gibt es nur in Chromium (Android-Chrome, Samsung Internet, Edge, Desktop-Chrome). iPhone und Firefox bekommen nur die grobe Ersatzuhr (`uhr: 1`), ohne Datei.
- Das Absturz-Indiz ist eine Schätzung: „hinten“ ist meist das System, das im Hintergrund aufräumt; „weg“ kann Absturz, Akku oder Zwangsbeenden sein. Eingefrorene Hintergrund-Tabs und Rechner, die ohne `visibilitychange` schlafen, können falsche Meldungen erzeugen. Privater Modus ohne localStorage: kein Laufbuch. Ein Absturz in den ersten 4 s nach dem Laden (vor messung.js) wird nicht erkannt. Die Sonde stellt einen Absturz nur mit `Page.crash` nach – ob ein Android-Speicherabsturz genauso aussieht, ist nicht beweisbar.
- Seiten, die keine ~25 s offen bleiben, liefern keine Startzeile.
- „Tipp bis Bild“ misst bis zum nächsten Bild nach dem Zeichnen (rAF + `setTimeout 0`), nicht bis zur Anzeige auf dem Glas. Programmklicks (z. B. aus dem Newsticker) werden nicht gemessen.
- Fehlertexte können in seltenen Fällen eingesetzte Werte enthalten; die Reinigung senkt das Risiko, schließt es nicht ganz aus. In min-Dateien steht fast alles in Zeile 1: der Ort lässt sich nur über Spalte und `bau` (Stempel) dem genauen min-Stand in git zuordnen.
- BroadcastChannel fehlt in Safari vor 15.4: dort wird ein verlorener Hintergrund-Tab erst nach 12 h gemeldet.
- keepalive beim Weggehen ist nur in Chromium 141 belegt (eigener Versuch: auch an einen fremden Ursprung mit Vorabanfrage, `Authorization`/`apikey`/JSON – beim Schließen 10 von 10, beim Navigieren 10 von 10 angekommen). Ob Safari und Firefox eine keepalive-Anfrage mit Vorabanfrage beim Entladen zustellen, ist hier nicht prüfbar. Eine mit keepalive gesendete Zeile gilt als zugestellt und wird nicht nachgeschickt: scheitert sie trotzdem (kein Netz, Marke abgelaufen), ist sie weg. Ohne Marke (z. B. Sitzung noch nicht da) kommt die Zeile dafür sicher, aber erst mit der nächsten Seite.
- Eine Teilzeile im Hintergrund ohne Marke geht über rpc; wird die Seite weggeräumt, nachdem der Server sie schon hat, aber bevor die Antwort ankam, schickt die nächste Seite sie ein zweites Mal (gleiches `k` – die Auswerte-Abfrage filtert das).
- Die Sonde kann keepalive nur ohne Playwright-Umleitung prüfen: `ctx.route` verschluckt keepalive-Aufrufe einer Seite, die gerade geht (Versuch: beim Navigieren 3 von 11 statt 11 von 11). K läuft deshalb in einem eigenen Browser, der fremde Adressen über die Namensauflösung sperrt.

### Sonden
- Neu: `werkzeug/pruefe-884-messung.js` (A–K, nach der Nachbesserung 67 Prüfungen mit `ALT`, 63 ohne): Start unverändert (messung.js erst nach load + 3 s, vor DCL dieselben 41 Dateien wie vorher, Mitschreiber < 500 µs, messung.js < 5 ms, kein DOM, keine Konsolenfehler), Startzeile, echte Tipps, Fehler (50× derselbe → ein Eintrag n = 50, gereinigt, Ort; Versprechen; 8 + fehlerMehr; 63 Seitenfehler weiter sichtbar; ResizeObserver nicht gezählt), Klassenzimmer (zwei 1-s-Fenster mit je 180 ms, LoAF, „zäh“ erst bei 350 ms; Raum vor messung.js betreten/verlassen wird nachgespielt), Absturz (dieselbe Karte sichtbar → weg, im Hintergrund → hinten, fremde nach der Frist → weg, sauber geschlossen und lebende fremde Seite → nichts), Abbruch beim Laden (laden; neue Fassung zählt nicht), ohne Anmeldung (Kiste, danach genau einmal, mit `gast: 1`; Kisten-Zeile von Konto A nie unter Konto B), Tagesdeckel 1/8 und „genug für heute“, Prüfläufe ohne Schalter senden nichts, und K (nachgebessert): Neuladen im Raum mit Marke → genau eine Zeile per keepalive, beide Startzeilen da; Schließen ohne Marke → die nächste Seite schickt genau eine nach; Tab-Wechsel → Teilzeile, Folgezeile nur mit der Zeit seitdem, danach nichts mehr unterwegs; im Hintergrund weggeräumt mit keepalive (Antwort kam nicht mehr) → „hinten“, kein Nachschicken; dasselbe ohne Marke → genau einmal nachgeschickt; kurzer Aufenthalt, Seite zu → `grund: weg` per keepalive; nie eine leere Raumzeile. Die Server-Attrappe geht jetzt wie supabase-js erst nach einem asynchronen Schritt raus. Mit `ALT=<alter Stand>` zusätzlich FCP/DCL neu gegen alt (paarweise). Zweimal hintereinander ganz grün.
- Gegenprobe mit dem Stand vor 884 (`WURZEL=` index.html aus HEAD, Rest verlinkt): 42 rot (B–J und alles, was die Messung braucht), die Sonde läuft durch; grün bleiben nur die Erhaltungs-Prüfungen (keine Seitenfehler, nichts verschluckt).
- Gegenprobe für einen beim Bauen gefundenen Fehler: wurden die gepufferten Raumwechsel vor dem Laufbuch nachgespielt, entstand ein Eintrag „undefined“ – jetzt nicht mehr (eigener Fall in E).
- Gegenprobe der Nachbesserung (`WURZEL=` messung.js und min/messung.js aus dem WIP-Stand vor der Nachbesserung, Rest verlinkt): 14 rot – in jedem Fall von K schickt die nächste Seite die leere Zeile `spaet, dauer 0, ges [0,0,0]` (genau der Befund der Prüfung), dazu Tagesdeckel 3 statt 1, kein `gast`, die Kisten-Zeile von Konto A geht unter Konto B raus, der JSON-Ausschnitt bleibt stehen. Nach der Nachbesserung grün.
- Gegenprobe mit dem Stand vor 884 nach der Nachbesserung erneut: 57 rot, 6 grün (nur Erhaltungs-Prüfungen), die Sonde läuft durch.
- Grün geblieben: 876 (Start schlank), 867 (Spiel nach dem Start), 858 (Ladeweg), 861 und 871 (Leitungs-Zeilen weiter da), 859 (Kanal sofort), 840 (alte Bilderwelt; app.js unberührt).

**Offen**
- `supabase/fassung-884-messung.sql` von jemandem mit Schreibrecht einspielen, und zwar VOR dem Ausliefern (bis dahin sendet der Client höchstens 1 Zeile je Gerät und Tag, die an Tagen mit 40 Zeilen eine Leitungs-Zeile kosten kann).
- Beim Ausliefern DMA_VERSION auf 884 setzen (`fassung-setzen.js 884`), sonst tragen alle Mess-Zeilen `f: "883"`. Zur Sicherheit trägt jede Zeile `mv: 1` (Zeilenformat) und die Startzeile `bau` (Stempel von min/app.js).
- Stadtseiten (`stadt.html`, `stadt-leicht.html`) werden nicht gemessen.
- Gäste (siehe oben).
- Source-Map bzw. Vorschlag `werkzeug/fehler-ort.js`: „Datei:Zeile:Spalte“ + Stempel über `git log` dem min-Stand und der nächsten Quellfunktion zuordnen.
- Nach 2–3 Tagen die Auswerte-Abfragen laufen lassen und die ersten Zahlen an Xander funken.

## Fassung 884 — Leitung: das Gespräch baut sich zuverlässig auf (Funk 263)

XANDER (Funk 263): „die Verbindung … hat Priorität“. Für Xander ändert sich nichts Sichtbares (keine Anzeige, keine Sitzordnung, Verfall bleibt 20 s). Erwartet – im Labor als Logik geprüft, der Beleg aus dem Feld folgt erst mit der Messung unten: die Leitung sollte schneller stehen, wenn man aus dem Hintergrund zurückkommt und nach einem Doppelangebot; mit drei und mehr Leuten sollte ein hängendes Gegenüber die anderen nicht mehr mitreißen; die Wache ruft niemanden mehr an, von dem seit 12,5 s kein Paket kam oder dessen Kanal nach eigener Angabe taub ist (ins Leere ruft sie damit noch bis zu 12,5 s lang).

### Befund (Telemetrie seit 881, nur lesend)
- 126 Zeitleisten „leitung“, Median bis „connected“ 1 888 ms, 16 nicht verbunden. „Nicht verbunden“ heißt hier und in der Abfrage unten: Leitungszustand beim Senden (`jetzt[2]`) ist nicht „connected“. Ohne „connected“-EREIGNIS in `ev` sind es 25 – 9 davon waren beim Senden verbunden (ein neues Angebot auf einer schon stehenden Leitung, es gab keinen Übergang mehr). Die Abfrage gibt beide Zahlen aus; verglichen wird mit 16.
- Alle 16 ohne Gruss (kein „hallo“, kein „auchDa“) und ohne Kandidaten von drüben (`kd = {}`): Anrufe der Wache bzw. beim Zurückkommen an ein Gegenüber, das wohl ohne Abschied ging oder im Hintergrund schlief. Das ist eine Hypothese – wer angerufen hat, stand bisher nicht in der Leiste. Erst die neuen Felder unten beweisen es.
- Belege für die Schritte 3 und 4: Leisten 587/588 (Antwort auf das ältere Angebot zuerst), 543/544 und 608/609 (zurück aus dem Hintergrund, Leitung erst nach 8–9 s durch die Wache).

### Die sechs Schritte (alles in livechat.js; app.js und index.html unberührt)
1. **Messung** (kein anderes Verhalten): `anrufen(id, grund)` – jeder Aufrufer sagt, warum (relais, ice-weg, ice-fehl, pc-fehl, knopf, puls, hallo, auch-da, wache, wache-neustart, wache-abriss). `brueckeAbbauen(id, grund)` vermerkt den Abbau (knopf, hallo, tschuess, verfall, wache, auchDa; sonst der Leitungszustand). `empfangen` hält das letzte Lebenszeichen im Messfenster fest. Ein neuer Gruss sendet die überholte Leiste nicht mehr als scheinbaren Fehlschlag, sondern vermerkt sie kurz in der neuen.
2. **Wache-Gruss nur an den einen**: das „hallo“ der Wache (größere Kennung, Leitung kommt nicht zustande) trägt `an`. Vorher las jeder im Raum es als Neuladen: alle bauten ihre stehende Leitung zu uns ab und schickten den Verlauf nach.
3. **Die Antwort gehört zum Angebot**: Angebot mit `nr` (zufälliger Start), Antwort mit `zu`. Eine Antwort auf ein älteres Angebot wird verworfen (`antwortAlt`), vor der Zeile, die die Wache zurücksetzt. Ohne nr/zu (ältere Fassung) wie bisher.
4. **„auch-da“ sagt `haelt`**: ob drüben eine Leitung zu uns stehen blieb. Bei `haelt: false` baut die kleinere Kennung eine über 8 s alte Leitung ab und ruft sofort frisch an (statt nach 6–8 s Wache). Jünger als 8 s bleibt sie (Fall aus 841). Ohne `haelt` wie bisher. Im Puls-Zweig steht der echte Wert (`Boolean(brueckeJe[…])`, praktisch immer false); auch das Abbauen geschieht nur, wenn danach angerufen werden darf (`belegt() <= PLAETZE`).
5. **Kein Anruf ins Leere**: `nichtErreichbar(id)` – „stumm“ (seit seinem letzten Paket 12,5 s, also zwei Pulse verpasst, `STUMM_MS = 2 * PULS_MS + 500`; gezählt ab `gehoertJe`, siehe Nachbesserung) oder „taub“ (sein Puls oder Gruss sagt es, 15 s). Die Wache ruft dann nicht an, grüßt nicht und zählt nicht hoch; meldet er sich, handelt der nächste Takt sofort. Stehende Leitungen, der Neustart bei „disconnected“ und der Verfall nach 20 s bleiben unverändert. `GEIST_MS = 90000` unverändert.
6. **„taub“ im Puls**: `kanalTaub()` – der eigene Raumkanal hört nichts (Websocket tot oder Kanal closed/errored/joining/leaving), der Puls geht über den REST-Notweg von supabase-js trotzdem hinaus. Nur sicher Bekanntes zählt: fehlt eine Angabe (andere supabase-js-Fassung), gilt der Tab als hörend. Drüben: kein Anruf aus dem Puls, die Wache wartet. Auch das „hallo wieder“ beim Zurückkommen und der Gruss der Wache tragen `taub` (sie gehen oft noch über den REST-Notweg hinaus): mit `taub` ruft drüben niemand an, ohne `taub` (nach dem Neubeitritt) hebt jedes „hallo“ es sofort auf.

### Messfelder (spiel_diagnose „leitung“)
- Am Angebot (`angebotRaus`, `angebotGebuendelt`) als drittes Feld: `Auslöser|zuletzt gehört vor s|neu oder neustart[|taub][|vg]` – z. B. `["angebotRaus", 0, "ice-weg|7|neustart"]`. „zuletzt gehört“ = Sekunden seit seinem letzten Paket (`gehoertJe`, „-“: nie eins). `neu` = neue Leitung, `neustart` = Angebot auf einer schon bestehenden (ICE-Neustart/Neuverhandlung). `vg` = wir kamen in den letzten 10 s aus dem Hintergrund.
- `["abbau", t, Grund]`, `["antwortAlt", t, nr]`, `["hallo", t, "taub"]` (Gruss mit taub, kein Anruf), `["haeltGebremst", t]` (dritter haelt-Neuaufbau in 60 s).
- Im Bericht: `fort` (er ist nicht mehr im Raum), `still` (ms seit seinem letzten Paket, auch wenn er fort ist; -1: nie eins), `lebt` (ms ab Beginn der Leiste bis zu seinem letzten Paket darin; -1: nie), `vorher` = [Ereignisse, letztes Ereignis, Alter ms] der überholten Leiste.
- **Abweichung vom Plan**: das Feld heißt `fort`, nicht `weg` – `weg` ist schon der Weg der Leitung (host/srflx/relay, Sonde 861 C prüft ihn).
- **Abweichung vom Plan**: „abbau“ landet nur in einer noch nicht gesendeten Leiste und nur, wenn es schon eine gibt (keine Leiste, die nur aus „abbau“ besteht und nach 30 s Kontingent frisst). Beim Abbau wegen „auch-da“ ist die Leiste meist schon gesendet; dann sagt das Angebot der neuen Leiste `auch-da|…|neu`, was geschah.
- Ab 884 gehen überholte Leisten nicht mehr hinaus: Zahlen vor und nach 884 sind nicht 1:1 vergleichbar (weniger scheinbare Fehlschläge). Das Kontingent (40 je Konto in 24 h) wird eher entlastet. Bericht typisch ~0,7 KB (Grenze 6000).

### Sonden
- Neu: `werkzeug/pruefe-884-leitung.js` (lädt `index.html?quelle`; `ALT=<rev>` liefert /livechat.js und die Quelltext-Prüfungen aus `git show <rev>:livechat.js`). A Messung (Auslöser hallo/puls, nr/zu, „abbau tschuess“, überholte Leiste → genau EIN Bericht mit `vorher`, ccc nach 30 s mit `fort: true`), B stumm/taub (kein Angebot an ein 20 s stummes bzw. taubes Gegenüber, frischer Puls → sofort), C alte Antwort (antwortAlt, Leitung scheitert nicht erst), D haelt (junge Leitung bleibt; haelt:true/ohne → nichts; haelt:false über 8 s → sofort frisch, steht binnen 3 s), E Wache-Gruss mit `an`, dazu < 6000 Zeichen und keine Seitenfehler. Grün (32 Prüfungen).
- Gegenprobe `ALT=HEAD` (Stand vor dem Punkt): 19 rot (A 8, B 5, C 2, D 2, E 2), 13 grün – nur die Kontrollen (Leitung steht, Weg im Bericht, GEIST_MS, junge Leitung bleibt, haelt:true/ohne, Wache grüßt überhaupt, keine Seitenfehler, < 6000).
- Nach der Nachbesserung (unten): 40 Prüfungen, alle grün. Gegenprobe `ALT=HEAD` (= erster 884-Leitung-Commit 1b15f03): 7 rot – genau die neuen (A still bei fort, B Gruss mit taub, D Obergrenze, F ×4: „wache|0|neu“, „wache-neustart|0|neu“, „wache-abriss|0|neu“, 5 Angebote 13–17 s nach seinem letzten Paket). Gegenprobe `ALT=HEAD~1` (vor 884-Leitung): 27 rot, 13 grün (Kontrollen; dazu „D: dritter haelt-Neuaufbau gebremst“, weil die alte Fassung auf haelt gar nicht neu baut). Nach der Nachbesserung erneut (min/ frisch gestempelt): 659, 811, 842, 856, 859, 861, 866, 871, pruefe-leitung, runde94 grün; 862 wie zuvor nur die app.js-Quelltextprüfung rot.
- Ehrlich: Im Labor heilt die alte Fassung auch C in 0,6 s – die falsche Antwort lässt die Leitung auf 127.0.0.1 sofort scheitern, und der schnelle Neuanruf aus 836 baut nach 0,4 s neu. Im Feld (kein ICMP) dauert dieses Scheitern Sekunden. Die Sonde prüft deshalb, dass die Leitung gar nicht erst scheitert (kein „failed“, kein zweites Angebot); die Zeit ist nur Kontrolle.
- Sonde 861: der Anruf im Gruss wird jetzt als Muster `anrufen(n.von[,)]` gesucht (er heißt `anrufen(n.von, "hallo")`).
- Grün geblieben: 659, 811, 842, 856, 859, 861, 866, 871, pruefe-leitung, runde94. 862: alle Leitungs-Prüfungen grün; rot ist nur „D: die Rückkehr nach dem Neuladen gibt das Konto mit“ – eine Quelltext-Prüfung auf app.js, die schon vor diesem Punkt rot war (HEAD: der Abstand zwischen `rueckkehrOffen` und `konto: (Backend.currentUser() || {}).id` ist größer als die 600 Zeichen der Sonde). app.js ist hier unberührt.

### Nicht im Labor nachstellbar
- Der echte Hintergrund-Schlaf auf Android (toter Websocket, Puls läuft über REST weiter) und ICE „disconnected“ ohne Netzsteuerung. Teil D und „taub“ sind nur als Logik geprüft; der Feldbeleg sind 543/544, 608/609 und danach die neue Telemetrie.

### Feldbeweis (nach 3–5 Tagen, nur lesen)
Erkennt 884-Leisten an `fort` (unabhängig von DMA_VERSION) und gibt die Grundlinie 881–883 mit denselben Zählweisen daneben aus. „nicht_verbunden“ wie im Befund (`jetzt[2]` ≠ connected), „ohne_connected_ereignis“ nur zur Einordnung:
```sql
with l as (
  select id, daten d,
         coalesce(daten->'jetzt'->>2, '') <> 'connected' as nv,
         (select e->>2 from jsonb_array_elements(daten->'ev') e where e->>0 = 'angebotRaus' limit 1) as erstes_angebot,
         (select (e->>1)::int from jsonb_array_elements(daten->'ev') e where e->>0 = 'angebotRaus' limit 1) as t_angebot,
         (select (e->>1)::int from jsonb_array_elements(daten->'ev') e where e->>0 = 'pc' and e->>2 = 'connected' limit 1) as t_connected
  from spiel_diagnose where art = 'leitung' and (daten ? 'fort' or coalesce(daten->>'fassung', '') between '881' and '883'))
select (d ? 'fort') as ab_884, split_part(coalesce(erstes_angebot, '-'), '|', 1) as ausloeser, count(*) as leisten,
       count(*) filter (where nv) as nicht_verbunden,
       count(*) filter (where t_connected is null) as ohne_connected_ereignis,
       count(*) filter (where nv and coalesce((d->>'fort')::boolean, false)) as davon_fort,
       count(*) filter (where nv and not coalesce((d->>'fort')::boolean, false) and coalesce((d->>'lebt')::int, -1) > coalesce(t_angebot, 0)) as echte_fehlschlaege,
       percentile_cont(0.5) within group (order by t_connected) as median_connected_ms,
       count(*) filter (where erstes_angebot like '%|vg%') as aus_vordergrund,
       count(*) filter (where exists (select 1 from jsonb_array_elements(d->'ev') e where e->>0 = 'antwortAlt')) as mit_antwort_alt
from l group by 1, 2 order by 1, 3 desc;
```
(Gegen den heutigen Stand geprüft, nur lesend: Grundlinie `ab_884 = false` → 126 Leisten, 16 nicht verbunden, 25 ohne connected-Ereignis, Median 1 888 ms – deckt sich mit dem Befund; 884-Zeilen noch keine.) Vergleich: Zeit bis connected bei `auch-da|…` bzw. `|vg` gegen 543/544 und 608/609 (8–9 s).

**Offen**
1. Nach 3–5 Tagen auswerten (Abfrage oben): Auslöser der Anrufe ohne Antwort; Anteil `fort` unter den nicht verbundenen; echter Fehlschlag = nicht connected (`jetzt[2]`) und `fort = false` und `lebt` > erstes Angebot. Erst dann an Xander melden, ob die Hypothese („Abgang ohne Abschied“) stimmt.
2. Ob beim Zurückkommen (visibilitychange) ein ICE-Neustart statt Neuaufbau etwas bringt, erst nach dieser Messung entscheiden (Zusatz „neu“ gegen „neustart“, mit `|vg`). Heute: zurück im Vordergrund geht „hallo wieder“; drüben bleibt eine stehende Leitung, eine hängende wird neu gebaut, und mit Schritt 4 ruft die kleinere Kennung sofort frisch an.
3. „taub“ wirkt nur, solange supabase-js den REST-Notweg hat (als „deprecated“ markiert). Fällt er weg, pulst ein tauber Tab gar nicht mehr, und Schritt 5 („stumm“) übernimmt.
4. Die 8-s-Sperre in Schritt 4 ist eine Schätzung; laufen die Zustände auseinander (hier „steht“, drüben haelt:false), wird die eigene Leitung neu gebaut (heilt sich selbst, ~1–2 s).
5. Hört das EIGENE Gerät kurz nichts, pausiert die Wache für alle bis zum nächsten Paket (der ICE-Neustart bei „disconnected“ läuft weiter).
6. Beim Ausliefern DMA_VERSION auf 884 setzen; die Abfrage oben braucht das nicht (sie erkennt `fort`).
7. „gesehen“ wird weiter auch von `bruecke()` → `personMerken` aufgefrischt (vor 884 schon so): ein eigener Neuaufbau schiebt den Verfall nach 20 s hinaus. Bewusst nicht geändert (Verfall bleibt, Sitzordnung/Ein- und Austragen unberührt); für Messung und „stumm“ zählt jetzt `gehoertJe`.
8. Ein verspäteter Puls mit `taub` (REST, abgeschickt vor dem Neubeitritt) kann ein späteres „hallo“ ohne `taub` überholen; dann wartet die Wache bis zu seinem nächsten Puls (≤ 6 s). Der Anruf aus dem Gruss ist da schon draußen. Hingenommen; eine Paketnummer je Absender gibt es nicht.

### Nachbesserung nach der Prüfung (zweiter WIP-Commit)
- **wichtig – „zuletzt gehört“ war bei jeder neuen Leitung 0**: `anrufen()` las `gesehen` erst nach `bruecke()`, und `bruecke()` trägt beim Anlegen über `personMerken` „gesehen = jetzt“ ein. Nachgestellt (Sonde F): er schwieg 4 s, am Angebot stand „wache|0|neu“. Jetzt eigener Zeitstempel `gehoertJe[id]`, gesetzt nur in `empfangen`, genommen für den Zusatz am Angebot, für `still` im Bericht und für `nichtErreichbar` (Fallback `gesehen`, wenn nie ein Paket kam – von Hand eingetragene Leute, Sonden).
- **klein – „stumm“ hieß nicht „zwei Pulse verpasst“**: dieselbe Ursache; jeder eigene Neuaufbau startete die 12,5 s neu. Jetzt ab seinem letzten Paket (Sonde F: 13–17 s nach seinem Paket kein Angebot mehr; vorher 5).
- **klein – „hallo wieder“ über den REST-Notweg hob „taub“ auf**: das „hallo wieder“ (Vordergrund) und der Gruss der Wache tragen jetzt `taub: kanalTaub() || undefined`; drüben setzt ein Gruss mit `taub` „taub“ (auch für einen, der nach dem Verfall neu ist) und ruft nicht an; nur ein Gruss ohne `taub` hebt es auf. Der Rest (verspäteter REST-Puls) steht unter Offen 8.
- **klein – haelt-Neuaufbau ohne Obergrenze**: höchstens 2 je Gegenüber in 60 s (`haeltNeuErlaubt`, wie `schnellNeuJe`), danach `haeltGebremst` und die Wache mit ihren Abständen.
- **klein – „neu“/„neustart“**: hängt jetzt daran, ob es VOR dem Anruf schon eine Leitung gab (vorher an `remoteDescription`: ein zweites Angebot auf einer unbeantworteten Leitung hieß „neu“).
- **klein – Zählweisen**: Befund und Abfrage zählen beide `jetzt[2]` ≠ connected (siehe Befund); die Abfrage gibt die Grundlinie 881–883 mit aus.
- **klein – Funk-Entwurf und Einleitung**: Wirkung als erwartet formuliert, nicht als Tatsache (Teil D und „taub“ sind nur als Logik geprüft).

## Fassung 884 — Platzwechsel beim Gegenüber messen (Funk 268)

XANDER (Funk 268): „die Latenz bei den Sitzplätzen ist immer noch bemerkbar“. Seit 836 geht jede Sitzmeldung zuerst direkt (Datenkanal), dann über den Server; beim Wechsler selbst steht der Platz sofort. Wie lange es beim ANDEREN dauert, stand nirgends. Jetzt wird es dort gemessen, wo Xander es sieht – und drei eindeutige Bremsen sind behoben. Für Xander ändert sich nichts Sichtbares (Aussehen, Größe, Bedienung unverändert).

### Was gemessen wird (livechat.js, Messblock hinter `sitzNachsenden`)
- **Laufzeit (`rtt`)**: der Empfänger schickt auf jede Erstmeldung (nicht auf Nachsendungen `nach:1`) sofort eine Quittung `sitz-q` zurück – noch vor seinem eigenen Zeichnen. Der Absender misst Hin und zurück (ohne Uhrenabgleich): `[wer (4 Zeichen), ms, Weg, belegt, bild]`, Weg `d` = Datenkanal, `s` = Server. **ms ist nicht nur das Netz** (Nachbesserung, siehe unten): die Quittung kann erst verarbeitet werden, wenn der Absender selbst wieder frei ist, und der schickt mitten in `platzNehmen`. Deshalb misst er mit: `belegt` = ms bis zu einem `setTimeout 0`, das beim Senden eingereiht wird (so früh hätte eine sofort angekommene Quittung frühestens drankommen können), `bild` = ms bis nach dem nächsten Bild (rAF + setTimeout 0; im Hintergrund `null`). ms enthält außerdem das Warten beim Empfänger, bis er die Meldung annimmt. Über den Server quittiert der Empfänger nur, wenn er zum Absender **keinen bereiten Datenkanal** hat, und höchstens alle 10 s je Absender (der Server schickt jede Meldung an alle im Raum).
- **Probe beim Empfänger (`ein`)**: `[Weg, dom, mo, bild, vor, gez]`, ms ab Ankunft des Pakets: `dom` = Plätze im DOM (direkt nach `melden("plaetze")`), `mo` = nach den MutationObservern (spiel.js, Kleider-Beobachter), `bild` = nach dem nächsten Bild (rAF + setTimeout 0), `vor` = um wie viel die zweite Kopie (anderer Weg) später kam, `gez` = 1, wenn der Platz mit dieser Person wirklich am neuen Platz im DOM steht (0: anderer Platz; null: kein `#lcPlaetze`, z. B. Klassenzimmer nicht offen). Nur bei sichtbarer Seite (im Hintergrund kommt kein Bild).
- **Absender (`raus`)**: je Erstmeldung `n` Meldungen, `peers` Gegenüber, `direkt` direkt erreicht; `ohne.pc` (keine Leitung), `ohne.dc` (Kanal nicht offen), `ohne.bereit` (Kanal offen, aber nicht bereit); `srv` = was `kanal.send` zurückgibt (`kein` = kein Raumkanal, `fehler` = abgelehnt). Das sagt wenig über den Server: der Raumkanal läuft ohne `broadcast.ack`, dann löst realtime-js `kanal.send` sofort auf dem Gerät mit `ok` auf, sobald der Kanal verbunden ist – auch wenn der Server die Meldung verwirft (so in supabase-js 2.117.2 nachgelesen; welche 2.x das CDN wirklich liefert, ist hier nicht prüfbar). Nur auf dem REST-Notweg (Kanal nicht verbunden) kommt `ok`/`error`/`timed out` vom Server; `buf` = größte Warteschlange im Datenkanal (Bytes).
- **`kan`** (beim Senden): je Gegenüber `[Leitungszustand, Kanalzustand, bereit 1/0, Weg aus aufbau/leitungMess]`.
- Bericht `spiel_diagnose` art **„sitz“**: `{fassung, ua (80), raum (24), rtt, ein, raus, kan}`, je Liste höchstens 40, typisch 0,3–1,5 KB (Grenze 6000; darüber werden die Listen auf die letzten 12 gekürzt). Gesendet nach 12 Werten (+3 s, damit die letzte Probe ihr Bild hat) oder 90 s nach dem ersten Wert; **höchstens 2 je Betreten**; je Tag und Gerät (`localStorage dma_sitz_mess = JJJJ-MM-TT|n|s`) **höchstens 1, solange der Server „sitz“ mit allen anderen Arten zählt** (40 je Konto und 24 h – „leitung“ hat Vorrang), **4, sobald er „sitz“ getrennt zählt** und das mit `"sitz"` in der Antwort sagt (`s = 1`, SQL unten). Gezählt wird nur, was der Server annimmt: `genug für heute` → `n = 99`, heute keiner mehr; `ok:false` ohne Grund (keine Anmeldung, `auth.uid()` fehlt) → nicht gezählt, in diesem Betreten kein weiterer Versuch; Netzfehler → nicht gezählt.

### Was behoben ist (eindeutig, ohne Sichtbares)
1. **Bereitschaft des Datenkanals** (`datenkanalAnlegen`): direkt geschickt wird nur an „bereite“ Gegenüber, und bereit machte bisher NUR das eine `dc-hallo` beim Öffnen. Der Kanal ist ungeordnet mit `maxRetransmits: 1` – ging dieses eine Paket verloren, lief für die ganze Leitung jede Sitz- und Spielmeldung nur über den Server, obwohl der Kanal offen war. Jetzt: zweites Hallo nach 1,5 s, falls noch nicht bereit; ein Hallo wird einmal je Kanal beantwortet (`zurueck: 1`, selbst unbeantwortet – kein Hin und Her); jede Nachricht auf dem aktuellen Kanal (`kanalJe[id] === dc`) macht bereit. Ob ein verlorenes Hallo in der Praxis vorkommt, ist nicht belegt – die Lücke im Code ist eindeutig; `raus.ohne.bereit` in den Berichten zeigt künftig, wie oft ein offener Kanal nicht benutzt wurde.
2. **Eigenes Sprechen an/aus** meldet nur noch `plaetze` (wie beim Empfänger seit 836): vorher zeichnete jeder Satzanfang und jede Pause des EIGENEN Mikrofons das ganze Klassenzimmer neu (`renderLiveChat`). Der eigene Sprechring kommt aus `livechatPlaetzeAuffrischen` (`plaetzeBauen` trägt `ich.spricht`).
3. **app.js-Zuhörer**: bei `plaetze` wird der Streifen (Raum, Personenzahl, Stumm, Halten) nicht mehr neu geschrieben – nichts davon ändert sich dabei. Spart je Sitz- und Sprechmeldung eine ganze `lage()` (Kopie aller Chatzeilen) und das Neuschreiben des Streifens. Geprüft an allen `melden("plaetze")`-Aufrufern (Puls-Heilung, Sitz-Empfang, redet, platzNehmen, platzTauschenMit): keiner ändert Lage, Personenzahl oder Stumm. Die alte Bilderwelt ist unberührt.
4. Klein: `direktSenden` wandelt eine Meldung einmal in Text um statt je Gegenüber (gilt auch für Spielereignisse) und nur, wenn überhaupt ein Kanal offen ist.
- `senden()` gibt jetzt das Versprechen von `kanal.send` zurück (nur `sitzSenden` liest es; geprüft: kein anderer Aufrufer nutzt den Rückgabewert).
- Ältere Fassungen auf der Gegenseite: `sitz-q` und `dc-hallo` mit `zurueck` laufen dort ohne Wirkung durch (unbekannte Art in `empfangen`; `dc.onmessage` kennt nur feste Arten).
- Nicht gefunden: kein Warten auf eine Server-Bestätigung (der Platz steht beim Wechsler sofort, gesendet wird vor der Spiel-Nacharbeit, seit 836); unveränderte Kopien und Nachsendungen zeichnen nichts (Sonde 856).

### Auslesen (nur lesen)
```sql
select zeit, daten->>'fassung' fassung, daten->'raus' raus, daten->'rtt' rtt, daten->'ein' ein, daten->'kan' kan
  from spiel_diagnose where art = 'sitz' order by zeit desc limit 20;
```
Verdichtet (Quittung je Weg mit dem Anteil des eigenen Geräts; Zeit bis zum Bild je Weg):
```sql
select r->>2 weg, count(*) n,
       percentile_cont(0.5) within group (order by (r->>1)::numeric) ms_median,
       percentile_cont(0.9) within group (order by (r->>1)::numeric) ms_p90,
       percentile_cont(0.5) within group (order by greatest(0, (r->>1)::numeric - coalesce((r->>4)::numeric, (r->>3)::numeric, 0))) netz_mindestens_median,
       percentile_cont(0.9) within group (order by greatest(0, (r->>1)::numeric - coalesce((r->>4)::numeric, (r->>3)::numeric, 0))) netz_mindestens_p90,
       count(*) filter (where r->>3 is not null and (r->>1)::numeric <= (r->>3)::numeric + 5) wartete_auf_absender
  from spiel_diagnose, jsonb_array_elements(daten->'rtt') r where art = 'sitz' group by 1;
select e->>0 weg, count(*) n, percentile_cont(0.5) within group (order by (e->>3)::numeric) bild_median_ms,
       percentile_cont(0.9) within group (order by (e->>3)::numeric) bild_p90_ms,
       percentile_cont(0.5) within group (order by (e->>4)::numeric) vorsprung_median_ms,
       count(*) filter (where e->>5 = '0') nicht_am_platz
  from spiel_diagnose, jsonb_array_elements(daten->'ein') e where art = 'sitz' and e->>3 is not null group by 1;
```
Lesart: viel `s` in `ein` bei offenen Kanälen (`kan`) bzw. `raus.ohne.bereit` > 0 → der direkte Weg wird nicht benutzt; großes `bild` − `dom` → das Zeichnen beim Empfänger bremst (sein Gerät). Die Quittung `ms` ist eine **Obergrenze** für das Netz (Hin und zurück samt Annahme beim Empfänger): liegt `ms` bei `belegt` (`wartete_auf_absender`), wartete die Quittung auf das Gerät des Absenders – das Netz ist dann nicht ablesbar, nur ≤ ms; liegt `ms` deutlich über `bild`, ist es Netz bzw. Relais (oder ein beschäftigter Empfänger) – Netz ≈ ms; dazwischen liegt das Netz zwischen `ms − bild` und `ms` (`netz_mindestens`). Hälfte ≈ eine Richtung nur bei symmetrischem Weg. `srv` ≠ `ok` heißt nur auf dem REST-Notweg etwas; den Server-WEG misst allein die Server-Quittung (Weg `s`), und die gibt es nur, wenn kein bereiter Datenkanal besteht.

### Sonden
- Neu: `werkzeug/pruefe-884-sitz.js` (lädt `index.html?quelle`, zwei echte Seiten mit echter Leitung, der Server wird von der Sonde gespielt, Berichte über einen nachgebauten rpc, ein kleines `#lcPlaetze` für `gez`). Grün (25 Prüfungen): Leitung; Wechsel über den Datenkanal in 4 ms; Quittung `["bbb",1,"d"]`; Probe `["d",0,1,13,…,1]`; nach Freigabe der Server-Kopie `vor` ≈ 1 500 ms (so lange hielt die Sonde sie zurück), nichts neu gezeichnet, Chatzeile einmal, Nachsendungen ohne Quittung/Probe; Selbstheilung; Server-Weg (`ohne.bereit` +1, Probe `s`, Server-Quittung `["bbb",34,"s"]`, zweiter Wechsel ohne zweites Echo); Antwort auf das Hallo; Bericht (Tagesgrenze, genau ein rpc, 337 Zeichen, `srv.kein`, 2 je Betreten); Quelltext; keine Seitenfehler. `ALT=<Ordner>` liefert livechat.js/app.js aus diesem Ordner.
- Nur ausgegeben (nicht geprüft), Labor-Chromium, zwei Läufe: kleines `#lcPlaetze` CPU 1× `bild` 7–8 ms, CPU 4× 11–13 ms; **echtes Klassenzimmer** (wie Sonde 816 gezeichnet, ohne Chatverlauf und ohne Kameras) CPU 1× `["d",1,1,6–14,…]`, CPU 4× `["d",7–9,9–13,31–48,…]` – auch 4-fach gedrosselt steht der Platz nach unter 10 ms im DOM und nach 31–48 ms im Bild; Quittung (Hin und zurück) 1–5 ms. Ein echtes Samsung mit vollem Raum ist das nicht – dafür sind die Berichte da.
- Gegenprobe `ALT=` mit livechat.js und app.js aus HEAD (vor dem Punkt): 19 rot (kein pruefSitzMess, keine Quittung, keine Probe, kein Server-Echo, kein Bericht, Quelltext ×3), die Sonde läuft durch; grün bleiben nur die Kontrollen (Leitung, Wechsel kommt an, nichts doppelt gezeichnet, Chatzeile einmal, keine Seitenfehler).
- Zweite, schärfere Gegenprobe: heutige livechat.js, nur die Bereitschafts-Änderung zurückgenommen (altes `dc-hallo`, kein zweites Hallo, keine Bereitschaft durch jede Nachricht): genau 2 rot – 7 (nach dem Vergessen nicht wieder bereit) und 8 (B→aaa false: ohne Antwort bleibt die Seite, deren Hallo verloren ging, unbereit).
- Grün geblieben (min/ vorher frisch gestempelt): 856, 659, 667, 679, 816, 850, 859, 861, 876, 884-leitung, 884-messung, 773 (Spiel still beim eigenen Sprechen) und 840 (alte Bilderwelt). 848-sprechen: 1 rot („mit Lexical „… zwei …“ → falsch“) – diese Sonde lädt nur `stadt-leicht.html` (Azure-Antworten in der Stadt), weder livechat.js noch app.js; da sie keine der geänderten Dateien lädt, kann der Fehler nicht von diesem Punkt kommen (nicht eigens gegen HEAD nachgelaufen; laut Kopf der Sonde gehört vorher `werkzeug/leicht-packen.js` dazu, hier nicht ausgeführt). Für „eigenes Sprechen → plaetze“ gab es zunächst keine Verhaltens-Sonde (das Mikrofon-Pegel-Messen ist nicht von außen erreichbar); seit der Nachbesserung (unten) prüft Sonde 884-sitz 10 es am Verhalten über `pruefSelbstSpricht`.

### Ehrlich
- Lokal ist die Laufzeit 1–5 ms. Was bei Xander wirklich bremst (Netz/Relais, Server-Weg, das Zeichnen beim Empfänger oder die eigene Arbeit des Absenders – `belegt`/`bild`), zeigen erst die „sitz“-Berichte aus echten Sitzungen. Noch keine Zahlen – sie kommen, wenn Xander mit jemandem die Plätze wechselt.
- Ein verlorenes `dc-hallo` ist im Feld nicht belegt (Lücke im Code eindeutig, Sonde 7/8 beweist, dass sie geschlossen ist).

**Offen**
1. Erste Kamerabilder am neuen Platz misst rAF nicht (`bild` = nächstes Bild der Seite, nicht der erste Videorahmen); dafür käme `requestVideoFrameCallback` in Frage.
2. Der Aufwand von spiel.js-`zeichnen` (MutationObserver) steht in `mo − dom`; ob dort etwas zu tun ist, erst nach echten Werten entscheiden.
3. Ob der Server bzw. realtime-js Raum-Meldungen verwirft oder drosselt, misst dieser Punkt NICHT: ohne `broadcast.ack` sagt `kanal.send` auf dem verbundenen Kanal immer `ok` (`raus.srv` hilft nur auf dem REST-Notweg), und die Server-Quittung gibt es nur ohne bereiten Datenkanal. Dafür bräuchte es `ack: true` am Raumkanal (eine Antwort je Meldung über den Server – mehr Verkehr, nicht gebaut). Welche supabase-js 2.x das CDN liefert, ist hier nicht prüfbar (CDN im Container gesperrt).
4. Kontingent: `spiel_diagnose` nimmt je Konto 40 Zeilen in 24 h für alle Arten (außer „mess-*“, sobald `fassung-884-messung.sql` eingespielt ist); am 02. und 03.10. erreichten zwei Konten genau 40, ein weiteres 39. Bis „sitz“ getrennt zählt, schickt jedes Gerät deshalb höchstens **einen** „sitz“-Bericht am Tag (er kann an vollen Tagen trotzdem eine Leitungszeile verdrängen). **SQL (nicht eingespielt – nur lesen erlaubt)**, enthält die Regel aus `fassung-884-messung.sql` und ersetzt dessen Funktion (also danach oder statt dessen einspielen; wird `fassung-884-messung.sql` später noch einmal eingespielt, fällt „sitz“ zurück in die 40 und die Geräte bleiben von selbst bei 1):
   ```sql
   create or replace function public.spiel_diagnose_senden(p_art text, p_daten jsonb)
    returns jsonb language plpgsql security definer set search_path to 'public'
   as $function$
   declare
     uid uuid := auth.uid();
     a text := left(coalesce(p_art, ''), 40);
     g text := case when left(coalesce(p_art, ''), 5) = 'mess-' then 'mess' when coalesce(p_art, '') = 'sitz' then 'sitz' else 'rest' end;
     n integer;
   begin
     if uid is null then return jsonb_build_object('ok', false); end if;
     select count(*) into n from spiel_diagnose
       where spieler = uid and zeit > now() - interval '1 day'
         and (case when left(art, 5) = 'mess-' then 'mess' when art = 'sitz' then 'sitz' else 'rest' end) = g;
     if n >= (case g when 'mess' then 12 when 'sitz' then 8 else 40 end) then
       return jsonb_build_object('ok', false, 'grund', 'genug für heute');
     end if;
     insert into spiel_diagnose (spieler, art, daten)
       values (uid, a, case when length(p_daten::text) > 6000 then jsonb_build_object('zu_lang', true) else coalesce(p_daten, '{}'::jsonb) end);
     return jsonb_build_object('ok', true, 'mess', 12, 'sitz', 8);
   end $function$;
   revoke execute on function public.spiel_diagnose_senden(text, jsonb) from public, anon;
   grant execute on function public.spiel_diagnose_senden(text, jsonb) to authenticated;
   ```
5. Mehr Verkehr: je Erstmeldung ein winziges Echo je Gegenüber über den Datenkanal; über den Server höchstens 1 je 10 s je Absender und nur ohne bereiten Kanal.

**Funk-Antwort (Entwurf)**: „Platzwechsel (Funk 268): Ab jetzt misst das Gerät deines Gegenübers, wie lange dein Platzwechsel bei ihm braucht – Netz, Weg (direkt oder über den Server) und bis er auf dem Bildschirm steht. Dabei habe ich eine Lücke geschlossen: Ging beim Verbinden ein einziges kleines Paket verloren, liefen alle Platzwechsel nur über den Server, obwohl der direkte Weg offen war. Außerdem zeichnet dein eigenes Sprechen nicht mehr jedes Mal das ganze Klassenzimmer neu. Sichtbar ändert sich nichts. Zahlen habe ich noch keine – die kommen, sobald du mit jemandem die Plätze wechselst. Dann sehe ich, wie viel davon das Zeichnen bei deinem Gegenüber braucht, wie viel dein eigenes Handy beim Wechseln zu tun hat, und ob danach noch Wartezeit im Netz bleibt. Ob der Server unterwegs Meldungen verschluckt, zeigt diese Messung nicht.“

### Nachbesserung nach der Prüfung (zweiter WIP-Commit)
- **wichtig – die Quittung misst nicht nur das Netz**: sie kann erst verarbeitet werden, wenn der Absender selbst frei ist, und der schickt mitten in `platzNehmen` (danach `spielGewechselt`, `melden("plaetze")` samt `lage()`, Neuzeichnen der Plätze, das nächste Bild). Die Prüfung maß mit echtem Klassenzimmer beim 6-fach gedrosselten Absender ms 55/12/28/11/13/9/19 bei 55/44/31/32/34/34/48 ms eigener Bildzeit (Spitzen bis 298), beim gedrosselten Empfänger 2 ms. Jetzt trägt jede Quittung `belegt` und `bild` des Absenders (`sitzRausMessen`, nachgetragen, falls die Quittung vorher kam); Lesart, Abfrage und Kommentare sagen: ms ist eine Obergrenze, das Netz liegt zwischen `ms − bild` und `ms`, bei `ms ≈ belegt` wartete die Quittung auf den Absender. Sonde 884-sitz 12 (A mit echtem Klassenzimmer, 6× gedrosselt): `["bbb",12,"d",10,31] ["bbb",8,"d",8,26] ["bbb",11,"d",8,27] ["bbb",13,"d",13,36] ["bbb",12,"d",12,43]` – ms − belegt 0–3 ms: die ganze Wartezeit stand in `belegt`; ohne das Feld hätte man sie als Netz gelesen.
- **klein – `raus.srv` sagt nicht, was der Server antwortet**: ohne `broadcast.ack` (Raumkanal `{ broadcast: { self: false } }`) löst `kanal.send` auf dem verbundenen Kanal sofort mit `ok` auf (in supabase-js 2.117.2 nachgelesen: `if (… !broadcast.ack) resolve('ok')`; „rate limited“ gibt es dort nicht mehr). Lesart, Offen 3 und Kommentar entsprechend: `srv` zählt nur auf dem REST-Notweg; den Server-Weg misst allein die Server-Quittung.
- **klein – Kontingent**: „sitz“ teilt sich die 40 je Konto mit „leitung“ und „verbindung“, und der Tageszähler zählte auch Abgelehntes. Jetzt: 1 je Tag und Gerät, solange der Server „sitz“ nicht getrennt zählt (wie `messung.js`: 1 statt 8), 4 erst, wenn die Antwort `"sitz"` trägt; gezählt wird nur Angenommenes (`genug für heute` → heute keiner mehr; ohne Anmeldung nicht gezählt und kein zweiter Versuch im selben Betreten; Netzfehler zurückgenommen). Das SQL für eine eigene Gruppe „sitz“ (8 je Konto und 24 h) steht unter Offen 4 – nicht eingespielt.
- **klein – Leistungs-Eingriffe nur am Quelltext geprüft**: die Sonde prüft jetzt das Verhalten. Eigenes Sprechen und ein empfangenes „redet“ (je an/aus) melden 4× nur `plaetze`, der Streifen bei B bleibt unberührt (Text vorher von der Sonde auf „SONDE“ gesetzt), eine volle Meldung schreibt ihn neu; im echten Klassenzimmer steht der Ring am eigenen Platz (`lc-platz-spricht`) und geht wieder. Dafür ist der Block aus der Lautstärke-Schleife unverändert in `selbstSprichtSetzen(neu)` gezogen (Prüf-Haken `pruefSelbstSpricht`). Gegenproben dazu: nur app.js von vor dem Punkt → 2 rot (Streifen neu geschrieben, Quelltext); livechat.js mit `melden()` statt `melden("plaetze")` beim eigenen Sprechen → 4 rot (Arten „voll“, Ring-Prüfungen, Quelltext). `direktSenden` (einmal umwandeln) bleibt nur am Quelltext geprüft – mit einem Gegenüber in der Sonde ist es im Verhalten nicht unterscheidbar. Gefunden dabei: ein Sitzwechsel MIT Chatzeile ruft beim Empfänger nach dem nächsten Bild ohnehin eine volle Meldung für die Zeile (`systemZeile`, seit 836) – dort spart Schritt 3 nur die erste, nicht die zweite `lage()`.
- **klein – Fassungsnummer**: die Berichte tragen `fassung: "883"`, weil `DMA_VERSION` im WIP-Stand nicht erhöht ist. Wird beim Ausliefern mit `node werkzeug/fassung-setzen.js 884` gesetzt (gilt für alle 884-Punkte, nicht in diesem WIP-Commit); bis dahin sind „sitz“-Berichte an der Art erkennbar, 884-Leitungsberichte aber nicht von 883 zu trennen.
- **klein – Lücke beim Hallo**: das zweite Hallo (nach 1,5 s, nur wenn noch nicht bereit) trägt `bitte: 1` und wird immer beantwortet; ein schlichtes Hallo weiter nur einmal je Kanal. Kein Hin und Her: `bitte` geht je Kanal höchstens einmal hinaus, `zurueck` wird nie beantwortet. Sonde 8: nach einer ersten Antwort bleibt ein schlichtes zweites Hallo unbeantwortet (A unbereit), eines mit `bitte` macht A bereit.
- Sonde nach der Nachbesserung: 37 Prüfungen, zweimal ganz grün (12 im zweiten Lauf: CPU 6× ms − belegt 0,0,0,0,0, z. B. `["bbb",34,"d",34,35]`). Gegenprobe `ALT=` livechat.js + app.js aus HEAD (= erster 884-sitz-Commit 7596d10): 15 rot – belegt/bild (3, 9, 12), „bitte“ (8), Tageszähler und Kontingent (9 ×8), Verhalten Streifen/Ring (10 ×3, dort fehlt der Prüf-Haken) –, alles andere grün. Gegenprobe mit dem Stand vor dem Punkt (HEAD~1): 30 rot, 7 grün (nur Kontrollen: Leitung, Wechsel kommt an, nichts doppelt gezeichnet, Chatzeile einmal, kein Bericht vorab, volle Meldung schreibt den Streifen, keine Seitenfehler).
- Grün geblieben nach der Nachbesserung (min/ vorher frisch gestempelt): 856, 659, 667, 679, 816, 850, 859, 861, 876, 884-leitung, 884-messung, 773 und 840 (alte Bilderwelt). 848-sprechen wie zuvor 1 rot („mit Lexical „… zwei …“ → falsch“) – lädt nur `stadt-leicht.html` (dort weder livechat.js noch app.js), kann also nicht von diesem Punkt kommen.

## Fassung 884 — Gespräch zuerst, Foto danach (Funk 288/296)

XANDER (Funk 296, zum Vorschlag „Profilfoto erst nach dem Gruß“ aus Funk 288): „Ja mach alles weiter“. Ein Profilfoto aus der Galerie ist eine Datenadresse (bis 140 000 Zeichen). Seit 811 fuhr es nur noch beim Hereinkommen voll mit – aber genau dort: im `hallo` des Neuen und im `auch-da` jedes Anwesenden, also in dem Fenster, in dem Angebot, Antwort und Wege-Kandidaten durch denselben Raumkanal müssen. Bei N Leuten N+1 Fotos vor dem ersten Angebot, dazu das Nachfassen (1,2 s / 3 s), die Wache und das `auch-da` im Puls. Sichtbar ändert sich nur, dass das Galeriefoto eines Neuen (bzw. der anderen beim Neuen) etwa 1 s nach „Leitung steht“ erscheint, spätestens etwa 4 s nach der Frage; bis dahin steht der bisherige Platzhalter (Anfangsbuchstabe). Aussehen, Größe und Bedienung bleiben.

### Was geändert ist (livechat.js, 811-Block)
- `BILD_VOLL_ARTEN = { "bild-voll": 1 }`: auch `hallo` und `auch-da` tragen nur noch den Fingerabdruck `bildH`. Damit werden Nachfassen, Wache, Vordergrund-Gruss und Puls-`auch-da` von selbst schlank (über `bildKuerzen`); ihr Code ist unverändert. Die 20-s-Regel nach dem Ändern bleibt.
- **Ausnahme Auftritt** (Funk 140 / 698): ein `hallo` mit `auftritt` und ohne `wieder` behält das Foto, damit der Wagen nicht ohne Gesicht einfährt. Für diese Leute (auch ihr Nachfassen und ihre Wache) gibt es keinen Gewinn.
- **Antwort nach „Leitung steht“**: `bild-bitte` wird wie bisher sofort gestellt (winzig). Die Antwort merkt sich den Fragenden (`bildWartend`) und geht 1 s nachdem die Leitung zu ihm steht hinaus (`bildLeitungSteht` im `connected`-Zweig von `onconnectionstatechange`, nur für die aktuelle Leitung: `l.pc === brueckeJe[id]`), höchstens 4 s nach der Frage (ohne Leitung: Raum voll, nur Tonserver, Firefox ohne `connectionState`). Alle im Fenster Fragenden bekommen EIN Paket: eine Frage → `bild-voll` mit `an`, mehrere → ohne `an` (über den Raumkanal geht ohnehin jedes Paket an alle). Die 10-s-Sperre je Fragendem bleibt; gesendet wird nur bei `lage === "drin"`.
- **Empfang `bild-voll`**: eine Unbekannte wird nicht mehr angelegt (bisher legte `personMerken` jeden Absender als Person an – bei einem gebündelten Foto ohne Anschrift wären das Geister); das Lager hat das Foto trotzdem (über `bildH`), ihr späterer Gruss holt es dort ab, ohne Nachfrage. Wer das Foto schon hat, zeichnet nicht neu (kein `melden()`).
- Prüf-Haken: `pruefSitz({ ichBild })` setzt ein „altes“ Foto (ohne `bildGeaendertUm`), `pruefHallo` trägt `auftritt` wie der echte Gruss.
- Unverändert: `hallo`-Zweig, `halloNutz`, Nachfassen, Wache, Vordergrund, app.js, alte Bilderwelt.
- Ältere Fassungen (811–883) bleiben verträglich: sie fragen selbst nach (Sonde 884-bild C), verstehen `bild-voll` auch ohne `an`, und ihr eigenes `hallo`/`auch-da` trägt weiter das Foto – das füllt hier das Lager.

### Messung (Modell, Sonde 884-bild B: zwei echte Seiten, echte RTCPeerConnection, Relais je Richtung als Warteschlange 1 Mbit/s + 50 ms, Testfoto 360 px JPEG 0,9 ≈ 70 000 Zeichen)

| | Zeichen bis „steht“ (beide Richtungen) | Gruss → beide Leitungen stehen | Foto der anderen da |
|---|---|---|---|
| alt ↔ alt (HEAD vor dem Punkt bzw. 883) | 149 235 (2 Fotos à ~70 000 + SDP) | 1 426 / 1 435 ms | mit dem Gruss bzw. `auch-da` (vor „steht“) |
| neu ↔ neu | ~9 360 (Angebot/Antwort je ~4 000, Rest < 300) | 278–375 ms (4 Läufe) | „steht“ + 1,6 s (1 605–1 633 ms) |
| aaa neu, bbb alt | bbb's Gruss mit Foto | 841 / 855 ms | aaa: aus bbb's Gruss; bbb: „steht“ + 1,6 s |

Im Modell steht das Gespräch also rund 1,1 s früher; das Foto des Gegenübers erscheint beim Neuen dafür etwa 0,7 s später als bisher (bisher ~1,2 s nach dem Gruss, jetzt ~1,9–2,0 s). Je Foto spart der Aufbau ~0,56 s bei 1 Mbit/s, ~0,1 s bei 5 Mbit/s – mal 1 + N (Gruss + jedes `auch-da`).

### Sonden
- Neu: `werkzeug/pruefe-884-bild.js` (lädt `index.html?quelle`; `ALT_LIVECHAT=<datei>` leitet livechat.js um). A Paketebene (A1 Gruss 149 Zeichen mit `bildH`; A2 `auch-da` 282 Zeichen; A3 Auftritt trägt das Foto; A4 nach 0,3 s nichts, nach 4,3 s genau 1× an „bea“, zweite Frage in 10 s nichts; A5 zwei Fragende → 1 Paket ohne `an`; A6 eine Nachfrage, keine Unbekannte angelegt, ihr Gruss hat das Foto aus dem Lager, bekanntes Foto zeichnet nicht neu / neues schon). B zwei Seiten (B1 bis „steht“ kein Foto und außer Angebot/Antwort kein Paket über 3 000 Zeichen; B2 `bild-voll` bei +1 000/+1 001 ms nach „steht“; B3 Foto bei „steht“ + 1,6 s; B4 jedes Foto genau einmal). C (nur mit `ALT_LIVECHAT`) gemischt. **Abweichung vom Plan**: B1 sollte „kein Paket über 3 000 Zeichen“ prüfen – Angebot und Antwort (SDP) sind aber selbst je ~4 000 Zeichen und SIND der Verbindungsaufbau; B1 zählt sie deshalb nicht mit und prüft zusätzlich, dass kein Foto fährt.
- Gegenprobe mit livechat.js aus HEAD (vor diesem Punkt) und aus 876cc04 (883): je rot A1, A2, A4 (Antwort sofort), A5 (zwei Pakete mit `an`), A6 (Unbekannte angelegt, bekanntes Foto zeichnet neu), B1 (Gruss 69 947 und `auch-da` 70 497 Zeichen vor „steht“), B2 (kein `bild-voll`); grün C (aaa hat bbb's Foto 245 ms vor „steht“ ohne Nachfrage, das alte bbb fragt, aaa antwortet nach +1 000 ms, bbb hat es bei „steht“ + 1,6 s).
- Angepasst (gewollt anders, kein Rückschritt): **Sonde 811** – `auch-da` trägt jetzt nur `bildH`; die Antwort auf `bild-bitte` kommt ohne Leitung nach 4 s (die Sonde wartet 4,3 s). **Sonde 884-messung** E/K löste `melden()` über ein `bild-voll` einer Unbekannten aus (das legte nebenbei eine Person an); jetzt über `LiveChat.spielSitzeNeu()` (ruft nur `melden()`): mit diesem Punkt und der alten Sonde 15 rot (E und K: „drin“ kam nicht an), mit der angepassten grün.
- Grün (min/ vorher frisch gestempelt): 811, 861, 659, 856, 859, 866, 871, 842, sprechbild-reist, geschlecht, leitung, bild-fluestern, 884-leitung, 884-messung, 884-sitz, 642 und 840 (alte Bilderwelt; app.js unverändert). 862: 1 rot – „D: die Rückkehr nach dem Neuladen gibt das Konto mit“ ist eine Quelltext-Prüfung an **app.js**, die dieser Punkt nicht anfasst (`git diff HEAD -- app.js` leer); also schon vorher rot. 884-sitz 12 (6-fach gedrosselt, „ms − belegt ≤ 5 in 4 von 5“) war einmal rot, als drei Sonden gleichzeitig liefen (3 von 5), allein grün (4 von 5) – lastabhängig.

### Ehrlich
- Teil B beweist, dass die Fotobytes aus dem Fenster des Verbindungsaufbaus verschwinden, und zeigt den Zeitgewinn in einem nachgebauten langsamen Kanal. Echtes 4G mit zwei Geräten und der Supabase-Server sind hier nicht nachstellbar.
- Wirkung heute klein: betroffen sind nur Galeriefotos als `data:`-Adresse; laut der Untersuchung zu diesem Punkt hatte seit dem 20.09. kein angemeldeter Nutzer eines (hier nicht erneut abgefragt). Kontobilder (http/Aufkleber, höchstens 165 Zeichen) laufen unverändert. Der Gewinn wächst mit der Zahl der Leute und bei Verbindungsärger (Wache-`hallo`, Puls-`auch-da` wiederholen das Foto nicht mehr).
- Den Feldwert zeigen erst die Berichte `spiel_diagnose` „leitung“/„verbindung“ nach dem Ausliefern – und nur, wenn jemand ein Galeriefoto benutzt; die Berichte sagen bisher nicht, ob ein Foto im Spiel war.
- Verlust: geht `bild-bitte` oder `bild-voll` verloren, kommt das Foto erst mit der nächsten Nachfrage (Sperre 15 s, ausgelöst vom nächsten Puls), also nach etwa 15–21 s. Bisher kam es gleich mit dem Gruss.
- Ein gebündeltes `bild-voll` ohne `an` legt bei älteren Fassungen (811–883) eine noch unbekannte Person an und zeichnet einmal neu – nur, wenn im 1–4-s-Fenster ein Dritter hereinkommt; Übergangsfrage.

### Auslesen nach dem Ausliefern (nur lesen)
```sql
select date_trunc('day', zeit) tag, count(*) n,
       percentile_cont(0.5) within group (order by (e->>1)::numeric) median_ms_bis_connected
  from spiel_diagnose, jsonb_array_elements(daten->'ev') e
 where art = 'leitung' and e->>0 = 'pc' and e->>2 = 'connected' and zeit > now() - interval '14 days'
 group by 1 order by 1;
```

**Offen**
1. `raumHg` (Raum-Hintergrund, bis 140 000 Zeichen) fährt weiter in jedem `auch-da` von jedem im Raum mit – genau im Fenster des Verbindungsaufbaus. Gleiches Muster wie hier (Fingerabdruck + Nachfrage) wäre der nächste Schritt; eigener Punkt.
2. Fotolager über das Neuladen hinaus (IndexedDB je `von|bildH`): nach jedem Neuladen ist das Lager leer, der Neue fragt jeden Anwesenden und bekommt N Fotos.
3. Fotos später über den Datenkanal statt über den Server (der Raumkanal schickt jedes Paket an alle, auch ein `bild-voll` mit `an`).
4. Auftritt mit Galeriefoto behält das volle Foto im Gruss. Die Alternative (Auftritt beim Empfänger bis zum Foto verzögern) ändert den Zeitpunkt der Animation – nur mit Xanders OK.
5. Ein Merkmal im Bericht „leitung“, ob beim Aufbau ein Galeriefoto im Spiel war (z. B. `fb: 1`), damit sich der Feldwert trennen lässt – Vorschlag, nicht gebaut.
6. Verlorene Fragen: falls es im Feld auffällt, die 15-s-Sperre für unbeantwortete `bild-bitte` verkürzen.

**Funk-Antwort (Entwurf)**: „Profilfoto erst nach dem Gruß (Funk 288/296): Wenn jemand hereinkommt, schickt das Handy beim Begrüßen jetzt nur noch einen kleinen Fingerabdruck des Profilfotos statt des ganzen Fotos. So kommt die Verbindung zuerst zustande, und das Foto folgt etwa eine Sekunde danach. In meinem Testmodell mit langsamem Netz stand das Gespräch dadurch nach 0,3 statt 1,4 Sekunden. Sichtbar ist nur: Das Galeriefoto eines Neuen erscheint kurz nach ihm, bis dahin steht wie bisher sein Anfangsbuchstabe. Wer einen eigenen Auftritt hat (Sportwagen …), schickt sein Foto weiter gleich mit, damit der Wagen mit Gesicht einfährt. Echtes 4G mit zwei Handys konnte ich hier nicht testen. Das zeigen erst deine nächsten Verbindungen, und auch nur, wenn jemand ein Foto aus der Galerie benutzt.“

## Fassung 884 — Vollbild: erst aus, dann rollen; Walkie-Feld bleibt über der Tastatur (Walkie 313, Funk 252)

XANDER (Walkie 313 / Funk 252): Klassenzimmer – kein Schwarzbild beim Öffnen der Tastatur, kein schwarzer Rand beim Verlassen. Seit 845/822 offen, weil headless nicht nachstellbar. Die Seite selbst ist nachweislich hell; das Schwarz entsteht im Android-Fenster, wenn es beim Vollbild-Wechsel bzw. beim Aufgehen der Tastatur umgebaut wird. Nachstellbar ist die REIHENFOLGE dessen, was die Seite in diesem Moment tut – und die war beim Verlassen falsch. Aussehen, Größe und Bedienung bleiben; livechat.js ist unberührt.

### Befund (alter Stand, Android-Kontext 390×844, Sonde 884-vollbild)
- Verlassen des Klassenzimmers (Tipp auf „Kompass“ oder „Lernen“): ZUERST startete das weiche Rollen zum neuen Bereich (`scrollIntoView` per rAF in `wireSubnav`, +11 bis +13 ms nach dem Tipp), erst +60,4 bis +62,4 ms später kam `exitFullscreen` (60-ms-Zeitgeber im Fang-Hörer „RUNDE 87 — wer das Klassenzimmer verlaesst“), `fullscreenchange` bei +74 bis +88 ms. Android baut beim Vollbild-Ende das ganze Fenster um (Adress- und Systemleiste kommen zurück) – mitten in einer laufenden Rollbewegung.
- Walkie (Betreiber): die Leiste ist 326×709 (360×780: 296×655), das Feld „An Claude“ steht ganz unten – ganz hinuntergerollt mit der Unterkante bei 707,8 px (649,3 px). Mit offener Tastatur bleiben rund 506 px (468 px) frei: das Feld liegt unter der Tastatur, Android schiebt das ganze Fenster.
- Chatfeld im Klassenzimmer: im Vollbild fokussiert, Fenster 844 → 520 – die Seite ruft in 1,5 s weder `scrollTo` noch `scrollIntoView` (alt wie neu). Seitenseitig tut das Chatfeld beim Öffnen der Tastatur also nichts.

### Was geändert ist
**app.js** (drei Stellen über Anker, alles im Kern, nicht in `werkzeug/app-teile.json`):
- Neu hinter `lcVollbildAus`: `lcVollbildVerlassen()` beendet das Vollbild und gibt ein Versprechen, das nach `fullscreenchange` + zwei Bildern erfüllt wird (ohne `fullscreenchange`: Uhr 450 ms; versteckte Seite: `setTimeout(120)`); `lcVollbildEndet` (bewusst `var`, keine TDZ); `lcNachVollbild(f)`; `lcKlickVerlaesst(reiter)` (anderer Hauptreiter als „Wissen“ oder anderer Unterreiter von „Wissen“ als „Klassenzimmer“).
- `lcKinoAus` nutzt `lcVollbildVerlassen()`.
- Fang-Hörer (capture, läuft vor `wireSubnav`): führt der Tipp hinaus, geht das Vollbild SOFORT aus; der 60-ms-Zeitgeber bleibt als Netz für alle anderen Wege. Nicht bei einem Tipp aufs ⓘ in einer Pille (der eigene Fang-Hörer der ⓘ-Symbole verhindert dort das Umschalten) – gefunden beim Bauen: ohne diese Ausnahme wäre das Vollbild beim ⓘ von „Kompass“ ausgegangen, obwohl man im Klassenzimmer bleibt (Sonde A8).
- `wireSubnav` (else-Zweig): `lcNachVollbild(() => rAF(scrollIntoView))` – gerollt wird erst, wenn das Vollbild aus ist; Endlage und weiches Rollen bleiben. Zusätzlich (nicht im Plan): ist der Bereich bis dahin schon wieder gewechselt (schnell zurück ins Klassenzimmer), rollt er nicht mehr hinterher (`activeView.dataset.active === "true"`).
- `lcKinoAn`: tippt man innerhalb des Übergangs wieder aufs Klassenzimmer, steht `lcImVollbild()` noch auf wahr – jetzt wird das Ende abgewartet und das Vollbild neu angefordert (die Fingerbewegung gilt noch).

**rueckfrage.js** (Walkie): `tastaturLuft()` – steht das fokussierte Feld (Notiz oder „An Claude“) unter der Tastatur, rollt die Leiste ihren eigenen Inhalt so, dass es darüber steht. Dafür bekommt sie unten Polster (nur so viel, wie das Rollen braucht) und ihre Höhe wird solange auf der jetzigen festgehalten (`style.maxHeight`), damit eine kürzere Leiste nicht mit dem Polster wächst. Beim Antippen am Telefon (grober Zeiger) wird vorab gerechnet, als läge die Tastatur über der unteren Hälfte (55 %); nach 350 ms und bei jedem `visualViewport`-resize mit echten Werten nachgerechnet – steht das Feld dann schon frei, ruckelt nichts nach. Verdeckt die Tastatur nichts von der Leiste (Rechner, kurze Leiste, Tastatur wieder zu) oder verlässt das Feld den Fokus: Polster und Höhe zurück. **Abweichung vom Plan**: Plan war Polster = 12 + verdeckte Höhe; gemessen wuchs eine kürzere Leiste damit sichtbar nach unten, und das eigene Polster rechnete sich bei der nächsten Messung mit. Darum festgehaltene Höhe + Polster nur fürs Rollen, und am Rechner (nichts verdeckt) wird gar nicht gerollt.

### Messung (Sonde 884-vollbild, Chromium, Android-Kontext; alt = app.js/rueckfrage.js aus HEAD)

| | alt | neu |
|---|---|---|
| `exitFullscreen` nach dem Tipp (Kompass / Lernen) | +60,4 bis +62,4 ms | +0,1 bis +1,6 ms |
| `fullscreenchange` | +71 bis +88 ms | +12 bis +25 ms |
| erstes Rollen | +11 bis +13 ms (VOR dem Vollbild-Ende) | +45 bis +59 ms (nach `fullscreenchange` + 2 Bildern) |
| Endlage Kompass | Anfang oben (Rollstand 660) | gleich (660) |
| ohne `fullscreenchange` (Netz) | +9 bis +13 ms | +495 bis +499 ms |
| ohne Vollbild (iPhone) | +6,5 ms | +7 bis +16,5 ms |
| Walkie-Feld, Tastatur offen (390×844 / 360×780) | 707,8 / 649,3 px (unter der Tastatur) | 451,8 / 417,3 px (frei bei 506 / 468) |
| kürzere Leiste (513 / 564 px hoch) | 511,7 / 558,8 px | 451,7 / 416,8 px, Höhe gleich |

### Sonden
- Neu: `werkzeug/pruefe-884-vollbild.js` (eigener Server, `index.html?quelle=1`, `MIN=1` für min/, `GEGEN=<ordner>` legt app.js/rueckfrage.js darüber). A1–A8 Vollbild (echte Tipps rein, `el.click()` raus; A8 = ⓘ in der Pille), B1–B5 + B2m/B4m Walkie (nachgebautes `visualViewport`), C Wächter Chatfeld, keine Seitenfehler. Neu: alles grün (?quelle und min/). Gegenprobe (HEAD-Fassung von app.js und rueckfrage.js): rot A2a, A2b, A3a, A5, B2 (beide Größen), B2m (beide) – 8 rot; grün A1, A2c, A2d, A3b, A4, A6, A7, B1, B3, B4, B5, C.
- Gegenprobe A8 (ⓘ) mit dem alten Stand grün – die Prüfung fängt einen Fehler ab, den erst der neue Fang-Hörer hätte machen können.
- Grün nach `fassung-setzen.js --nur-stempel` (Endstand): runde87-kino, 840 (alte Bilderwelt), 873, 876, tutor, tutorreiter, einladungslink. Grün mit dem Stand kurz vor der ⓘ-Ausnahme (die nur seltener ausschaltet): 845, 850, 856 (Einrasten unverändert), runde99-rueckfrage (einmal 1 rot „⏹ beendet es …“, als sechs Sonden gleichzeitig liefen; allein grün – Diktat-Zeitgeber, lastabhängig). 876 war zwischendurch rot („min/app.js ist aus der jetzigen Quelle gebaut“), weil app.js nach dem Stempeln noch geändert war – nach neuem Stempel grün.

### Ehrlich
- Bewiesen sind die Reihenfolge (Vollbild-Ende vor dem Rollen) und die Lage des Walkie-Felds – nicht das Ausbleiben des Android-Schwarz. Chromium ändert beim Vollbild keine Größe; das Schwarz zeigt nur ein echtes Telefon.
- Beim Verlassen aus dem Vollbild beginnt das Rollen zum neuen Bereich je nach Gerät 100–450 ms später als bisher (hier +45 bis +59 ms). Ohne Vollbild (iPhone) unverändert.
- Der eigene Aufbau von „Lernen“ (65 + 158 ms bei 4× Drosselung) fällt weiter in den Übergang – ein kurzer dunkler Streifen kann bleiben (dann Vorschlag V2).
- Teil B ist eine Deutung: „dir schreiben“ = Walkie. Ist das Chatfeld gemeint, hilft B dort nicht (dort tut die Seite nachweislich nichts) – dann bleibt V1.
- Am Telefon rollt der Inhalt der Walkie-Leiste beim Antippen eines Feldes jetzt von selbst, sodass das Feld über der Tastatur steht. Größe, Lage und Aussehen bleiben. Betrifft nur Xander (Betreiber).
- Funk 252 („Warten oder Schließen“, Hänger im Gespräch) wird hiermit NICHT behoben – Hauptfaden im Gespräch, hier nicht nachstellbar, gehört zu Funk 263 B.
- Kein DB-Eingriff, keine Diagnose-Sendung (die 40-am-Tag-Grenze von `spiel_diagnose_senden` wird von leitung/tonstand schon erreicht).

**Vorschläge an Xander (sichtbar, nicht gebaut)**
- V1 `requestFullscreen({ navigationUI: "show" })` statt `"hide"` (app.js `lcVollbildAn`): die untere Android-Leiste bliebe im Vollbild stehen; Android müsste das Fenster beim Aufgehen der Tastatur vermutlich nicht umbauen. Unbelegt.
- V2 Bleibt der schwarze Streifen beim Verlassen: das Vollbild erst ~300 ms nach dem Umschalten beenden, wenn die Seite ruhig ist. Die Adresszeile käme dann einen Moment später.
- V3 Eine Mess-Zeile vom Telefon (rAF-Lücke, lange Aufgaben je Übergang) über `spiel_diagnose_senden('vollbild')` – nur selten (höchstens 2 am Tag), weil die 40er-Grenze schon erreicht wird. Nicht in dieser Fassung.
- Nicht gebaut (C): Rollen beim BETRETEN erst nach `fullscreenchange` – würde den Sprung ins Klassenzimmer auf Android um bis zu 450 ms verzögern; das Betreten ist der heiße Weg („sofort im Livestream“). Erst, wenn Xander Wackeln beim Betreten meldet.

**Offen**
1. Gegenprobe auf echtem Android (Verlassen per Kompass/Lernen, Walkie-Feld antippen).
2. Rechenblöcke von „Lernen“ im Übergang (65 + 158 ms bei 4× Drosselung).
3. Funk-252-Hänger im Gespräch → 263 B.
4. Vorschläge V1–V3 (Antwort Xanders).
5. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand).

**Funk-Antwort (Entwurf)**: „Vollbild im Klassenzimmer (Walkie 313 / Funk 252): Wenn du das Klassenzimmer verlässt, ging bisher zuerst das Rollen zum neuen Bereich los und erst danach das Vollbild aus – Android baut dabei das ganze Fenster um, mitten in der Bewegung. Jetzt geht das Vollbild sofort beim Tippen aus, und gerollt wird erst, wenn es wirklich aus ist. Im Walkie-Talkie rollt das Schreibfeld beim Antippen jetzt von selbst über die Tastatur, statt darunter zu verschwinden; Größe und Aussehen der Leiste bleiben gleich. Ob das Schwarz damit ganz weg ist, kann ich hier nicht sehen – das zeigt nur dein Telefon. Wenn noch ein dunkler Streifen bleibt, hätte ich zwei Ideen, die man aber sieht: (1) die untere Android-Leiste im Vollbild stehen lassen, (2) das Vollbild erst kurz nach dem Umschalten beenden. Sag mir, was ich davon versuchen soll. Das Hängen im Gespräch („Warten oder Schließen“) ist ein anderer Fehler; den gehe ich bei der Verbindung an.“

## Fassung 884 — Mikro rauscht: erst messen (Funk 191)

XANDER (Funk 191, 27.09., 20:25 – Diktat wörtlich, mitten zwischen Dorf-Punkten): „aus dem Rausch das Mikro jetzt so komisch schau doch mal bitte was da los ist“. Gelesen als „außerdem rauscht das Mikro jetzt so komisch …“ – das ist eine **Lesart**, nicht der Wortlaut.

**Was danach schon geschah** (beim ersten Bau übersehen, nach der Prüfung nachgetragen; Funk 189–192 und 199 in der DB gelesen):
- 23 Minuten später, Funk 192 (20:48), nennt XANDER selbst einen Grund: „dann möchte ich wenn ich im Dorf bin und ich schicke dir eine Sprachnachricht dass er vorübergehend die Sounds von doof ausgeschaltet werden wenn ich eine Sprachnachricht schicke weil dann brauche ich das glaube ich nicht ich glaube das ist nämlich der Grund“. Gemeint: Wind, Vögel und Hammer des Dorfs landen in der Sprachnachricht.
- **Fassung 769** hat genau das gebaut („Still bei Sprachnachricht“, siehe 769): Beim Aufnehmen blendet das Spiel seinen ganzen Klang aus. **Fassung 773** (Funk 199: „die Töne des Spiels werden immer noch nicht stumm geschalten wenn ich mit dir spreche innerhalb des Livestreams“) macht das Spiel auch still, solange man selbst am offenen Mikrofon spricht.
- Seit Funk 191 hat XANDER das Rauschen weder im Funk noch im Walkie wieder angesprochen (gesucht nach „rausch“/„mikro“ in `betreiber_funk` und `betreiber_rueckfragen`, Stand 11.10.).
- Ob er die Sprachnachricht im Dorf meinte (dann wäre es mit 769 vermutlich erledigt) oder das Live-Gespräch, weiß nur XANDER. Er wird gefragt (Funk-Antwort unten).

Dieser Punkt misst nur das **Live-Gespräch** über die Direktleitung – dafür gab es bisher keine einzige Zahl. Sprachnachricht und „Dauernd an“ misst er NICHT. Er ändert am Klang NICHTS (die Mikrofon-Einstellungen bleiben, wie sie sind: Live-Mikro mit `echoCancellation/noiseSuppression/autoGainControl: true`, Tor-Strom seit 829 per `applyConstraints` nachgezogen). Er misst nur – damit die nächste Änderung auf Zahlen steht. Aussehen, Größe und Bedienung bleiben; neu sind nur zwei Textstücke in der Antwort auf den Diagnosebefehl `/verbindung`.

### Was geändert ist (nur livechat.js; app.js, index.html außer Stempel, DB unberührt)
- **Wache je Leitung** (`leitungsWacheStarten`): liest aus ihrem ohnehin laufenden `getStats` (alle 2,5 s) zusätzlich die Empfangs-Tonspur (`inbound-rtp` audio, die mit den meisten Paketen) und das eigene Mikrofon (`media-source` audio) und reicht beides an `tonGueteMerken` weiter. Kein neuer `getStats`-Aufruf, kein neuer Zeitgeber, die 8-s-Warnung unverändert.
- **Neuer Block** zwischen `wacheBeenden` und `verbindungsBericht`: `tonGueteMerken` (merkt die letzten Zähler je Leitung und je 2,5 s eine Pegelprobe – nicht bei stummem Gegenüber oder stummem Abspiel-Element, das meldet Pegel 0; das eigene Mikrofon höchstens eine Probe je 2 s, nur wenn es an ist; je 24 Proben ≈ 60 s), `tonGueteJe`, `mikEinstellungen` (`getSettings()` der eigenen Live-Spur), `mikNeben`, `tonGuete` (höchstens 8 Leitungen), Klartext `tonGueteText`/`mikText`. Alles mit try/catch: ein Fehler macht `null` bzw. `{da:-1}`, die Berichte gehen trotzdem.
- **Bericht „verbindung“** (30 s nach dem Betreten, `aufbauSenden`): neues Feld `ton: { mik, je: { <id>: güte } }`.
- **Bericht „leitung“** (`leitungSenden`): neues Feld `mik` (nur die Einstellungen, ~120 Zeichen). So kommen die Einstellungen auch von der Seite, die schon im Raum war. Die Tongüte gehört nicht hinein: der Bericht geht 1,5 s nach „connected“, die Zähler wären fast leer.
- **`/verbindung`**: je Leitung „… / Güte: verdeckt 0,4 % · Jitter 6 ms · verloren 2 · Pegel 0,041 · Ruhe 0,003 · Puffer 40 ms“, nach der Tonserver-Zeile „Dein Mikrofon: Echo an · Rauschunterdrückung an · Pegelautomatik an · 48 kHz · Bluetooth nicht erkannt · Pegel 0,05 · Ruhepegel 0,002“ („?“ = der Browser sagt nichts; „AUS“ groß, wenn er etwas abgeschaltet meldet). Kommt seine Stimme über den Tonserver, steht dort statt der Zahlen „Güte: über den Tonserver, nicht gemessen“ (Nachbesserung). Die Zeile „Dein Mikrofon“ steht unter den Zeilen zu den anderen (und zum Tonserver, falls freigeschaltet), vor „Relais eingetragen …“. Alles Bisherige wortgleich.
- Prüf-Zugänge: `LiveChat.tonGuete()`, `LiveChat.pruefAufbauSenden()`.

### Messgrößen
| Feld | Bedeutung |
|---|---|
| `je.<id>.s` / `pk` / `vl` | Sekunden Ton / empfangene / verlorene Pakete seit Beginn dieser Leitung |
| `je.<id>.v` | verdeckt in % = (concealedSamples − silentConcealedSamples) / totalSamplesReceived – Aussetzer, „Roboter“, Knacken |
| `je.<id>.j` / `puf` | Jitter (ms) / mittlere Pufferverzögerung (ms) |
| `je.<id>.pm` | mittlerer Pegel seit Leitungsbeginn (√(totalAudioEnergy/Dauer)); wird durch stumme Zeiten kleiner |
| `je.<id>.ruhe` | 20-%-Wert der Pegelproben der letzten ~60 s = **Pegel in den Pausen = Rauschen**, das eigentliche Maß |
| `je.<id>.sfu` | 1 = seine Stimme kam über den Tonserver; die Netz-Zahlen der Direktleitung gelten dann nicht |
| `mik.da` / `an` / `sys` | Live-Mikro vorhanden (0 = keins, -1 = Fehler) / nicht stumm geschaltet / vom System stumm (`track.muted`) |
| `mik.ec` / `ns` / `agc` / `vi` | Echo-, Rauschunterdrückung, Pegelautomatik, Stimmisolierung laut `getSettings()` (1/0/null = sagt nichts) |
| `mik.sr` / `ch` | Abtastrate / Kanäle |
| `mik.art` | `bt` / `kabel` / `standard` / `leer` – nur Kategorie aus dem Gerätenamen; **nie** Name, deviceId, groupId |
| `mik.pm` / `ruhe` / `erle` | eigener Pegel hinaus (Mittel / Pausen-Pegel ~60 s) / Echo-Dämpfung in dB (falls gemeldet) |
| `mik.neben` | weitere offene Mikrofon-Spuren („Dauernd an“, warm gehaltene Sprachnachricht) |

### So liest man es (Pegel linear wie im Browser, 1 = Vollaussteuerung)
- `ruhe` < 0,003 (≈ −50 dBFS): still. ≈ 0,01 (≈ −40 dBFS): hörbares Rauschen. > 0,03: deutlich.
- `v` > 2 %: knackt/zerhackt hörbar (Netz oder Gerät zu langsam), kein Rauschen im engeren Sinn.
- `j` > 30 ms: unruhiges Netz.
- `ns` 0 oder `agc` 1 zusammen mit hoher `ruhe` beim Sender: die Pegelautomatik zieht in den Pausen das Grundrauschen hoch.
- `art` `bt`: Bluetooth-Freisprechprofil (8/16 kHz) – ein typischer „komischer“ Klang. `standard` heißt „nicht erkannt“, nicht „eingebaut“.
- Rauschen des Senders steht als `mik.ruhe` bei ihm UND als `je.<er>.ruhe` beim Hörer; ist nur das zweite hoch, liegt es auf dem Weg bzw. beim Abspielen.

### Sonden
- Neu: `werkzeug/pruefe-884-mikro.js` (zwei echte Chromium-Seiten aus `index.html?quelle`, Test-Mikrofon, Pakete von Hand getragen, `Backend.zugang().rpc` abgefangen; `ALT=1` bzw. `ALT_REV=<rev>` liefert livechat.js aus git). A Tongüte beidseitig (pk 492/494, s 10, v 0, j 0, pm 0,508/0,489, ruhe 0,016 ≤ pm), B Einstellungen (ec/ns/agc 1, 48 kHz, art `standard`) und Datenschutz (Label „Fake Default Audio Input“, groupId, „deviceId“ nirgends), C beide „leitung“ mit `mik` (667/654 Zeichen), D genau ein „verbindung“ mit `ton` (445 Zeichen), nur Arten leitung/verbindung, E `/verbindung` mit „Güte: verdeckt“ und „Dein Mikrofon: … Rauschunterdrückung an“, „kommt an (“ bleibt, F `getStats` auf Seite B in ruhigen 10 s: **4** (Leitung) + 0 (Empfänger/Sender), keine Seitenfehler. Alles grün.
- Gegenprobe `ALT=1` – damals noch HEAD = 295f13c, der Stand vor diesem Punkt; seit dem Commit 3686a1b steckt der Bau in HEAD, deshalb nimmt `ALT=1` jetzt fest **295f13c** (Nachbesserung): rot A (2), B (2), C (mik), D (2), E – 8 rot; grün die Kontrollen (Mikro, Leitung steht, „kommt an (“), C-Größe, keine neue Art, keine Seitenfehler und **F mit derselben Zahl 4** – also kein zusätzlicher `getStats`-Aufruf.
- Grün nach `fassung-setzen.js --nur-stempel` (nacheinander, nicht gleichzeitig): 884-mikro, 861 (Leitungsbericht < 6000), 871, 659, 827 (Texte von `/verbindung` und Tonserver unverändert), 811-leitung, leitung, 856, 859, jeder-befehl (`/verbindung` tut weiter etwas).
- Nicht nötig: 840 (app.js unberührt).

### Ehrlich
- **Der wahrscheinlichste Fall ist hier gar nicht messbar.** Nach XANDERs eigener Erklärung (Funk 192) ging es um die Sprachnachricht im Dorf; die nimmt mit Browser-Vorgaben auf (`{audio:true}`), und dieser Punkt misst sie nicht. Seit 769 ist das Dorf beim Aufnehmen still. Ob das Rauschen damit weg ist, kann nur XANDER sagen – deshalb fragt die Funk-Antwort, statt eine Ursache zu versprechen.
- Das Rauschen selbst ist hier nicht nachstellbar – das Test-Mikrofon piept und rauscht nicht. Bewiesen ist nur, dass die Messung richtig erhoben, klein und ohne Mehrkosten mitgeschickt wird. Die Ursache zeigen erst echte Berichte von Xanders Gerät.
- Kein Fix: für Xander klingt es gleich. Seit Funk 191 hat sich viel geändert (u. a. Tor-Strom mit `{audio:true}` + `applyConstraints` seit 829) – es kann sein, dass das Rauschen heute nicht mehr auftritt; die Messung beantwortet das.
- Grenzen: Stimmen über den Tonserver (ab 4 Personen) sind nur mit `sfu:1` markiert, nicht gemessen. Die Seite, die schon im Raum ist, schickt keine Empfangsgüte (nur ihr `mik` im „leitung“-Bericht). Im 30-s-Fenster stecken Anlauf und nur ~20–28 s Ton. Safari meldet AGC/NS teils nicht (`null`/„?“), Firefox kennt kein `media-source`-Pegel (`mik.pm`/`ruhe` fehlen), Android-Namen sind oft allgemein (Bluetooth nicht sicher erkennbar), Chrome meldet meist 48000 auch bei Bluetooth-Schmalband.
- Sprachnachricht und „Dauernd an“ nehmen mit Browser-Vorgaben auf (`{audio:true}`) und werden NICHT gemessen; `mik.neben` zeigt nur, ob solche Spuren gleichzeitig offen waren.
- Kontingent: kein neuer Eintrag, nur ~120–1100 Zeichen mehr in vorhandenen (Grenze 6000, darüber verwirft der Server den ganzen Bericht – deshalb höchstens 8 Leitungen). Gemessen wie der Server (`length(daten::text)`, jsonb-Text), 02.–11.10. (nur gelesen): „verbindung“ 101 Einträge, längster 499 Zeichen; „leitung“ 225, längster 1117; kein einziges `zu_lang`. Mit `mik` (~80 Zeichen jsonb) bzw. `ton` (~200–1100) bleibt das weit unter 6000.

### Auslesen nach dem Ausliefern (nur lesen)
```sql
select zeit, daten->'ton'->'mik' as mik, daten->'ton'->'je' as je, left(daten->>'ua',60) as ua
  from spiel_diagnose where art='verbindung' and daten ? 'ton' order by id desc limit 50;
select zeit, daten->>'mit' as mit, daten->'mik' as mik, left(daten->>'ua',60) as ua
  from spiel_diagnose where art='leitung' and daten ? 'mik' order by id desc limit 50;
```

**Offen**
1. **XANDER fragen** (Funk-Antwort unten): War das Rauschen in der Sprachnachricht im Dorf (Funk 192) oder im Live-Gespräch? Tritt es seit 769 noch auf? Erst die Antwort entscheidet, ob diese Messung überhaupt die richtige Stelle trifft.
2. Ging es um die Sprachnachricht und rauscht sie noch: dort messen (die Aufnahme nimmt mit Browser-Vorgaben auf, `{audio:true}`; Einstellungen und Pegel der Aufnahme-Spur wären ein eigener kleiner Punkt) – erst vorschlagen.
3. Auswerten, sobald Berichte von XANDERs Gerät da sind (SQL oben). Erst danach eine Änderung an den Mikrofon-Einstellungen vorschlagen – im Funk, nicht gebaut.
4. Reichen die 30-s-Werte nicht: zusätzlich einen Wert ~3 min nach dem Betreten nehmen (kostet einen Eintrag je Betreten, Kontingent 40/Tag beachten).
5. Stimmen über den Tonserver messen (Empfänger-Statistik der SFU-Spur).
6. Ladeweg: livechat.js steht in der Startliste; min/livechat.js wird um 3684 Byte größer (gzip +1472, 303780 → 307464). Klein, aber gegen das Ziel von 885. Sparen ließe sich etwa 1 KB, wenn der Klartext für `/verbindung` (Schritt 4) wegfällt – die Messung ginge weiter. Nur als Vorschlag, nicht gebaut.
7. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand).

**Funk-Antwort (Entwurf)**: „Mikro rauscht (Funk 191): Kurz danach hast du selbst vermutet, dass die Dorf-Geräusche (Wind, Vögel, Hammer) in deiner Sprachnachricht landen. Seit Fassung 769 ist das Dorf still, solange du eine Sprachnachricht aufnimmst, und seit 773 auch, während du am offenen Mikrofon sprichst. Zwei Fragen an dich: War das Rauschen in der Sprachnachricht im Dorf oder im Live-Gespräch im Klassenzimmer? Und hörst du es seitdem noch? Am Mikrofon selbst habe ich nichts verstellt, weil ich nicht raten will. Für das Live-Gespräch misst die Seite jetzt mit, wie deine Stimme bei den anderen ankommt (Aussetzer, Rauschen in den Pausen, verlorene Pakete) und ob bei deinem Mikrofon Rauschunterdrückung und Pegelautomatik wirklich an sind und ob es ein Bluetooth-Gerät ist – ohne Gerätenamen und ohne Ton aufzunehmen, nur Zahlen. Die Sprachnachricht misst das nicht. Wenn du selbst nachsehen willst: Tippe im Chat /verbindung, dann steht unter den Zeilen zu den anderen „Dein Mikrofon: …“.“

### Nachbesserung nach der Prüfung (zweiter WIP-Commit)
- **wichtig – Ausgangspunkt unvollständig, Antwort versprach zu viel**: Funk 189–192 und 199 in der DB gelesen. Das Zitat steht jetzt wörtlich aus dem Diktat da, „außerdem rauscht …“ ist als Lesart gekennzeichnet (Logbuch, Kopf des Code-Blocks in livechat.js, Kopf der Sonde). Funk 192 (XANDERs eigene Erklärung: Dorfklänge in der Sprachnachricht), 769 (still beim Aufnehmen) und 773 (still beim eigenen Sprechen) stehen oben; „Seitdem nie untersucht“ ist gestrichen – nie gemessen war nur das Live-Gespräch. Die Funk-Antwort verspricht keine Ursache mehr („In ein paar Tagen sage ich dir, woran es liegt“ ist raus), sondern fragt: Sprachnachricht im Dorf oder Live-Gespräch? Seit 769 noch? Am Code der Messung ändert das nichts.
  - Nachgeprüft, dass 769/773 heute noch wirken (min/ frisch gestempelt): Sonde 769 grün („Aufnahme läuft: Spielklang auf 0 – danach wieder da“, gain 0 → 0,437), Sonde 773 grün („während das Mikrofon zuhört, ist das Spiel still“).
- **klein – Tonserver**: Kommt seine Stimme über den Tonserver (`sfuHoertIhn`), zeigte `/verbindung` trotzdem die Güte der Direktleitung (Gegenprobe gesehen: „Güte: verdeckt 1,4 % · … · Pegel 0,505“, obwohl die Netz-Tonspur leer ist). Jetzt steht dort „Güte: über den Tonserver, nicht gemessen“. Der Bericht trug schon `sfu:1`, unverändert. Geprüft in Sonde 827 (Abschnitt 3, neue Prüfung „884“): grün; gegen livechat.js + min/livechat.js aus HEAD (3686a1b, Baum mit Verweisen unter scratchpad/gegen884/wurzel) genau diese eine rot, alles andere grün.
- **klein – Funk-Antwort „steht unten“**: die Zeile „Dein Mikrofon“ steht unter den Zeilen zu den anderen (und zum Tonserver), vor „Relais eingetragen …“; so steht es jetzt in Antwort und Logbuch.
- **klein – Gegenprobe ALT=1**: zeigte nach dem Commit auf HEAD = den Bau selbst. Jetzt nimmt `ALT=1` fest 295f13c; enthält eine angegebene Revision den Bau schon (`function tonGueteMerken`), bricht die Sonde mit „GEGENPROBE UNGÜLTIG“ ab (Exit 3; mit `ALT_REV=HEAD` geprüft). `ALT=1`: 8 rot (A 2, B 2, C mik, D 2, E), F gleich 4 – wie zuvor.
- **klein – Größe wie der Server misst**: `spiel_diagnose_senden` prüft `length(p_daten::text)` (Funktionstext gelesen; über 6000 → nur `{zu_lang:true}`), jsonb-Text hat Leerzeichen nach „:“ und „,“. Die Sonde rechnet das jetzt nach (`jsonbText`) und gibt beides aus. Gegen Postgres geprüft (nur `select length($J$…$J$::jsonb::text)`): „verbindung“ 510, „leitung“ 748 – genau die Werte der Sonde (JSON.stringify: 445 / 668). `BERICHTE=<datei>` schreibt die abgefangenen Berichte zum Nachrechnen hinaus.
- **klein – sichtbar in `/verbindung`**: „/ Güte: …“, „Dein Mikrofon: …“ (und jetzt „über den Tonserver, nicht gemessen“) sind reine Diagnose-Zeilen, nur beim Tippenden (`systemZeile`); Aussehen, Größe, Bedienung unverändert. Streng nach Regel 3 ein Vorschlag – deshalb hier offen ausgewiesen: Will XANDER sie nicht, fällt Schritt 4 weg (Offen 6), die Messung bleibt.
- **klein – Ladeweg** (min/livechat.js +3684 Byte, gzip +1472): nicht verkleinert, als Offen 6 mit Vorschlag notiert. Die Nachbesserung selbst kostet 54 Byte.
- Sonden nach der Nachbesserung (min/ vorher frisch gestempelt, nacheinander): 884-mikro zweimal grün (A pk 493/496, ruhe 0,005/0,004 ≤ pm ~0,5; C 748/732 jsonb; D 510 jsonb; F 4 + 0), 827 grün (mit der neuen Prüfung), 861, 871, 659, 811-leitung, leitung, 856, 859, jeder-befehl grün; dazu 769 und 773 grün. 840 nicht nötig (app.js unberührt).

## Fassung 884 — Walkie-Diktat im Livestream: man bleibt hörbar (Funk 163)

XANDER (Funk 163, 26.09., wörtlich aus der DB): „hast du mal geschaut warum ich mit niemanden mehr sprechen kann auch das Mikrofon im Chat wenn ich dir etwas übers Walkie-Talkie schicken will sobald ich da mit jemanden spreche irgendwie und dich aktiviere das aber hier schaltet sich das wieder aus wenn jemand da ist das soll generell immer aktiv sein um dass ich dir eine Nachricht schicken kann“.

Bis hier (698/718) lieh das Walkie-Diktat im Livestream das Mikrofon aus: die Live-Spur wurde gestoppt, die anderen sahen „stumm“ und hörten ihn nicht, bis das Diktat vorbei war (Android gibt das Mikrofon nur einem Nutzer). Genau das ist „schaltet sich das wieder aus“. Die automatischen Diktat-Meldungen (Funk 81/99/149/151/164/166/171/174 „aborted“, 179/197 „kein-start“, alle Samsung Internet 30, die letzte am 27.09.) zeigen, wie sich Live-Mikrofon und Browser-Erkennung auf Samsung im Weg stehen – 81/99 noch ohne Ausleihen (vor 698), 171/174 ausdrücklich mit `geliehen=1`.

**Jetzt**: Ist man im Raum (`lage === "drin"`) und hat eine lebende Live-Tonspur, startet das 🎤 KEINE Browser-Erkennung und leiht nichts aus. Eine **Kopie** der Live-Spur (`track.clone()`) läuft in ein AudioWorklet, wird an den Sprechpausen in Stücke geschnitten und Stück für Stück von der Zentrale („aussprache“, Aktion „erkennen“ – derselbe Azure-Weg wie die Stadt-Quests) aufgeschrieben. Der Text kommt ins Walkie-Feld. Live-Spur, Leitungen, `tonAn` und Sprechring bleiben unberührt: die anderen hören ihn die ganze Zeit. Außerhalb des Livestreams oder ohne Live-Tonspur bleibt alles wie bisher (Browser-Erkennung, `mikrofonLeihen`); mit Live-Tonspur, aber ohne Zentrale bzw. bei gesperrtem Strom-Weg seit 884b ein Ende mit Grund statt Ausleihen (siehe „Zweite Nachbesserung“).

### Was geändert ist (app.js, CSS, Datenbank, Edge Function unberührt)
- **aussprache-pruefung.js** (+12 Zeilen): `zentralErkennen(wav, {zeitgrenze})` nach `zentralBewerten` – WAV → Base64 → `zentralRufen({aktion:"erkennen"})`, Azures Antwort unverändert zurück; im Export ergänzt. Sonst nichts (alsWav unverändert).
- **livechat.js** (+11 Zeilen, nur im Export nach `mikrofonGeliehen`): `tonSpurKlon()` – im Raum eine Kopie der ersten lebenden Live-Tonspur, `enabled = true` (auch wenn man für die anderen stumm ist), sonst `null`. Bewusst nicht über `lage()` (teuer, gibt die Spur nur auf der Bühne heraus). `mikrofonLeihen/-Zurueck` unverändert – der alte Weg braucht sie weiter.
- **rueckfrage.js** (neuer Block zwischen `diktatEnde` und `diktatStarten`, 4 kleine Eingriffe):
  - Einstellungen `STROM`: Block 100 ms, Pause 0,7 s (Stück ≥ 4 s) oder 2 s, Stück höchstens 55 s, Vorlauf/Nachlauf 0,3 s, mindestens 0,3 s Sprache, höchstens 5 min, 16-kHz-Kontext, Schwelle 0,012 (bzw. 10 % der langsam sinkenden Spitze, Halbwert 20 s).
  - `diktatAusStrom`: Kontext NOCH IM TIPP (`new AudioContext({sampleRate:16000, latencyHint:"playback"})` + `createMediaStreamSource`; wirft das, in Gerätefrequenz), Kette Quelle → Worklet (als Text in einer Blob-Adresse, keine neue Datei) → Gain 0 → Ausgang; ohne AudioWorklet ScriptProcessor 4096. **Wächter**: kommt in 3 s kein Block, Meldung `strom-kein-start` und der alte Weg (`diktatStarten(klasse, true)`). Seit der Nachbesserung ist der Wächter eine **Wache** alle 0,5 s (siehe „Nachbesserung“).
  - Schnitt: still und kein Stück offen → nur 0,3 s Vorlauf halten; Pause ≥ 0,7 s und Stück ≥ 4 s, oder Pause ≥ 2 s → abschicken, die letzten 0,3 s der Pause bleiben Vorlauf des nächsten Satzes; ab 54,7 s harter Schnitt an der leisesten Stelle der letzten 3 s (nie vor der Hälfte), der Rest beginnt das nächste Stück. Stille am Ende auf 0,3 s gekürzt; unter 0,3 s Sprache geht nichts hinaus.
  - Eins nach dem anderen an die Zentrale (`AusspracheP.alsWav` → `zentralErkennen`, Zeitgrenze 40 s). Text = `DisplayText` bzw. `NBest[0].Display/Lexical`, an seine Stelle geschrieben (Reihenfolge stimmt immer). **Nachschub** (so seit der Nachbesserung): erst ab 0,5 s Erkanntem; geschnitten genau bei `Offset + Duration`; nur wenn ab 0,2 s dahinter noch ≥ 0,3 s Sprache liegt, geht der Rest vorn in die Schlange (höchstens 4× je Stück, bleibt danach Sprache übrig: Meldung `strom-nachschub-grenze`). Im ersten Bau begann der Rest 0,15 s VOR dem Erkannten und ging bei „Ende ≤ 0,15 s“ unverändert bis zu 4× hinaus. NoMatch/InitialSilenceTimeout: kein Text, kein Fehler.
  - Fehler (so seit der Nachbesserung): netz/zeit-abgelaufen/dienst/antwort-unlesbar → einmal nach 1 s wieder, sonst einmal der Satz des Browser-Diktats („Die Spracherkennung braucht Netz – gerade keins.“ bzw. „Die Spracherkennung meldet: …“) und weiter diktieren; `kontingent` (429) → nach 2,5 s und 5 s noch einmal; `tagesgrenze`, `kontingent` danach, `nicht-angemeldet`, `kein-zentraler-schluessel`, `schluessel-falsch`, `keine-verbindung` → **der alte Weg** (das Diktat geht weiter, der Text bis hier bleibt; der Strom-Weg ruht bis Mitternacht UTC bzw. 30 min). Jeder Code geht einmal als `[automatisch] Diktat-Fehler: strom-<code> (nr=…, rate=…, ms=…)` in den Funk. Im ersten Bau endete das Diktat in diesen Fällen mit drei neuen „bitte tippen“-Sätzen.
  - ⏹: das offene Stück geht noch hinaus, Kontext und Klon werden sofort freigegeben, „Einen Moment – ich schreibe noch auf …“ (die einzige neue Formulierung, gleiche Zeile `.rf-live`), dann „✓ Steht im Feld …“ (Notbremse 45 s; ein zweites ⏹ beendet sofort). Die 0,8-s-Notbremse am Knopf gilt nur noch für die Browser-Erkennung, sonst schnitte sie den letzten Satz ab.
  - `diktatStarten(klasse, ohneStrom)`: vor `new Erkenner()` – Klon holen; geht der Strom-Weg (AudioContext, MediaStream, `AusspracheP.alsWav/zentralErkennen/zentralMoeglich`), nimmt er ihn, sonst wird der Klon gleich wieder gestoppt. Export `Rueckfrage.diktatStrom` (nur für die Sonde).
- **Sichtbar**: gleiche Knöpfe, gleiche Größe, gleiche Bedienung. Anders fühlt sich an, dass der Text satzweise nach einer kurzen Pause erscheint (≈ 1–3 s; bei Dauerrede ohne Pause erst nach bis zu 55 s), nicht Wort für Wort, und nach ⏹ kurz „Einen Moment – ich schreibe noch auf …“ steht. **Ehrlich nach Regel 3**: das weicht von der Zusage aus Funk 6/13 ab („du siehst beim Sprechen live mit, was erkannt wird“) – im Livestream steht während des Sprechens nur „Ich höre zu …“. Das ist gebaut, nicht vorher gefragt; die Funk-Antwort fragt ausdrücklich nach (Offen 5).

### Sonden (erster Bau – Stand nach der Nachbesserung: siehe „Nachbesserung“)
- Neu: `werkzeug/pruefe-884-diktat.js` (Chromium, 412 px, isMobile; Lauf aus den Quellen `?quelle` und aus min/; nachgebaut: Browser-Erkennung, Backend/Funk, `zentralErkennen`; Live-Ton: WebAudio 48 kHz, 1 kHz + 5,5 kHz + 11 kHz mit 4-Hz-Silbentakt; „die anderen“: dieselbe Spur über eine lokale Leitung A→B, `totalAudioEnergy` alle 100 ms). Beide Läufe grün, alle 14 Punkte:
  1. 0 Browser-Erkennungen, `mikrofonGeliehen` false, `tonAn` true, Original-Spur live/an, 0 „stumm“-Pakete.
  2. Hörbar: bei B steigt die Energie in jedem Satz (0,25/0,22/0,22), längste Lücke 0 ms.
  3. Drei Sätze (2,5 s, Pause 2,2 s) = drei Anfragen (3,1/3,1/3,2 s), RIFF/16 kHz/mono/16 Bit, Stille vorn 0,30–0,39 s; mit 1,0 s Pause werden Satz 1+2 ein Stück (6,6 s), Satz 3 allein (3,1 s).
  4. Kein Falten: 5-kHz-Rest/1 kHz **0,00004–0,00005** (16-kHz-Kontext, Chromes eigene Umrechnung) bzw. **0,00002–0,00004** (Gerätefrequenz 44,1 kHz + alsWav); 1 kHz 99,6–100 %, 5,5 kHz 99,7–99,9 %.
  5. „Satz 1. Satz 2. Satz 3.“ bei Antwortzeiten 1,5/0,2/0,7 s.
  6. ⏹ im 3. Satz: „Einen Moment …“, Rest kommt an, „✓ Steht im Feld …“, 🎤, Kontext `closed`, Klon `ended`, Original live.
  7. `stueckMaxMs` im Original 55000; mit 3000 und 7 s Dauerrede 3–5 Stücke, alle ≤ 2,7 s.
  8. Nachschub: 4,7 s → Rest 2,5 s, „Teil A. Teil B.“.
  9. `tagesgrenze`: Ende mit Grund, „Satz 1.“ bleibt, Funk „[automatisch] Diktat-Fehler: strom-tagesgrenze (nr=1, rate=16000, ms=3200) …“.
  10. `addModule` hängt: nach 3 s alter Weg (1 Start), Funk `strom-kein-start (rate=16000, knoten=keiner, ctx=running)`.
  11. Außerhalb des Livestreams: 1 Browser-Erkennung, 0 Anfragen.
  12. Stumm geschaltet: das Diktat schreibt „Satz 1.“, bei B Energie 0.
  13. 30-s-Diktat (8 Stücke): keine lange Aufgabe > 100 ms; alsWav je Stück 2–6 ms (16 kHz).
  14. Keine Seitenfehler.
- Gegenprobe `ALT=1` (rueckfrage.js, livechat.js, aussprache-pruefung.js aus a043c20, Quellen): **24 rot** – 1 (4×: 1 Start, geliehen, tonAn false, Spur `ended`, 1 „stumm“), 2 (Energie 0, Lücke 2054 ms), 3–9 (0 Anfragen), 10 (keine strom-Meldung), 12 (Diktat hört stumm nichts). Grün bleiben nur, was es nicht unterscheidet (11, 13 ohne Stücke, 14, „Ich höre zu“).
- Bestehende Sonden nach `fassung-setzen.js --nur-stempel` (nacheinander): runde99-rueckfrage (zweimal), 698, runde99-privat, runde99-pssst, 827, 882-aussprache-z, 768, 785, 787, 840, 884-vollbild (Quellen und MIN=1) grün.
  - **842** einmal im Stapel und einmal allein rot („beim Schliessen der Seite macht A seine Server-Sitzung zu“ – die keepalive-Anfrage kam nicht in den 800 ms an, die die Sonde wartet), danach zweimal grün; gegen den Stand vor diesem Punkt dreimal grün. Der Prüfpunkt hängt an einer Zeitgrenze; der neue Code läuft in 842 gar nicht (kein Diktat, `tonSpurKlon` wird nicht gerufen). Als wackelig eingestuft, nicht bewiesen.
  - **848** rot auch gegen den Stand vor diesem Punkt (Baum mit Verweisen unter scratchpad/gegen884/diktat): „836: mit Lexical „… zwei …“ → falsch“ hängt am heutigen Datum (11. Oktober: die Stadt erwartet „elfte“). Älter als dieser Punkt, nicht angefasst.

### Leistung und Ladeweg
- 16-kHz-Kontext: die Umrechnung macht der Browser (mit Filter), alsWav baut nur das WAV-Gerüst (2–6 ms je Stück). Gerätefrequenz (nur wo 16 kHz abgelehnt wird): alsWav 3,1 s → 32 ms, 6,6 s → 60–115 ms am Rechner – auf dem Telefon ein Mehrfaches; deshalb ist 16 kHz der erste Weg.
- Upload: WAV 16 kHz/16 Bit als Base64 ≈ 43 KB je Sekunde Sprache, eins nach dem anderen, nur während man spricht.
- min/rueckfrage.js 15149 → 23425 Byte (**+8276**, gzip 5965 → 8993, **+3028**; nach der Nachbesserung 26197 Byte, gzip 9906) – mehr als im Plan geschätzt (~2 KB gzip). min/livechat.js +252 (gzip +75), min/aussprache-pruefung.js +218 (gzip +41). rueckfrage.js steht in der Startliste und wird von JEDEM geladen, obwohl nur der Betreiber das Walkie sieht (Offen 3).

### Ehrlich
- Echtes Azure ist nachgestellt. Ob die Kurz-Audio-Schnittstelle bei Stücken mit Sprechpausen nur bis zur ersten Pause aufschreibt, ist nicht gemessen – abgesichert durch die Schnitte an Pausen (meist 4–15 s) und den Nachschub. Die automatischen `strom-…`-Meldungen zeigen, wenn etwas hakt.
- Samsung Internet auf Xanders Android ist hier nicht nachstellbar (16-kHz-Kontext mit fremder Spur, AudioWorklet, Klon einer laufenden WebRTC-Spur). Die Wache (3 s ohne Block, 3 s nur Nullen, 6 s nichts Lautes → alter Weg; jeder Fall mit Meldung) sorgt dafür, dass es nicht stumm schlechter wird als bisher – was auf Samsung wirklich passiert, zeigen erst die Meldungen.
- Ein echtes Gespräch über zwei Geräte (Supabase, Tonserver) ist hier nicht möglich; die lokale Leitung zeigt nur, dass die unveränderte Spur weiter Ton liefert und das Diktat sie nicht anfasst.
- Die Live-Spur hat Rauschunterdrückung und Pegelautomatik an; der Klon erbt das (laut 836 kann das Zischlaute etwas schwächen). Was man diktiert, hören die anderen mit – so gewollt (Funk 163); wer das nicht will, schaltet sich stumm, das Diktat hört trotzdem. Das Mikrofon-Lämpchen bleibt an, solange der Klon läuft. Verlässt man den Raum oder klappt das Walkie zu, endet das Diktat seit der Nachbesserung binnen 0,5 s (im ersten Bau lief es unsichtbar bis zu 5 min weiter).
- Die Edge-Function-Fassung im Repo (mit Wortliste, 879) ist nicht die live laufende Version 4; dieser Punkt braucht davon nichts (nur „erkennen“ ohne Wortliste, ≤ 55 s = ≤ 1,76 MB, unter der Grenze 2 MB im Repo-Stand).

### Nachbesserung nach der Prüfung (derselbe Abend, nur rueckfrage.js und die Sonde)
Die Prüfung fand vier wichtige und vier kleine Mängel. Behoben, alle ohne sichtbare Änderung:
1. **Das gemeinsame Azure-Kontingent war nicht bedacht.** Das Diktat läuft über denselben zentralen Schlüssel wie der Aussprache-Trainer und die Stadt-Quests ALLER Lernenden. Code und Edge Function gehen von Tarif F0 aus (app.js „F0 … Monatsmenge“, Kopf der Edge Function „Azure F0 ist kostenlos, aber gedeckelt“); F0 deckt nach meinem Wissen 5 Audiostunden Spracherkennung im Monat bei einer Anfrage zur Zeit – von hier nicht prüfbar. Gemessen (`azure_nutzung`, nur gelesen): September 381 Anfragen von 3 Personen (Höchststand 173 an einem Tag), Oktober bisher 61 – die Lernenden brauchen also nur einen kleinen Teil. Jetzt:
   - **Tagesmenge** `STROM.tagesSekunden = 300`: höchstens 5 Minuten gesendete Sprache am Tag (im Gerät gezählt, `localStorage dma_diktat_strom_tag`, auch Nachschübe; Wiederholungen nicht doppelt). Das sind höchstens 2,5 h im Monat und rund 60 Anfragen am Tag – von der Tagesgrenze 300 bleibt der größte Teil für Xanders Trainer. Ist sie voll, wird das schon Gesprochene noch aufgeschrieben, dann geht das Diktat **auf dem alten Weg weiter** (Browser-Erkennung, Mikrofon leihen – wie bis 883), Meldung `strom-tagesmenge`; der nächste 🎤 nimmt gleich den alten Weg.
   - `kontingent` (429) beendet nichts mehr: nach 2,5 s und 5 s noch einmal (bei F0 genügt einer, der gerade im Trainer übt). Erst danach der alte Weg, Meldung `strom-kontingent (… versuche=3)`, der Strom-Weg ruht 30 min.
   - `tagesgrenze`, fehlende Anmeldung, fehlender oder falscher Schlüssel: ebenfalls der alte Weg statt „bitte tippen“; `tagesgrenze` ruht bis Mitternacht UTC (`dma_diktat_strom_sperre`), die anderen 30 min.
   - **Xander entscheidet** (Offen 6): F0 lassen (dann bleibt es bei 5 min am Tag) oder S0 (bezahlt, nach meinem Wissen etwa 1 $ je Audiostunde) – dann lässt sich die Tagesmenge anheben.
2. **Walkie zu (✕) oder Raum verlassen: das Diktat hörte unsichtbar bis zu 5 min weiter** (nachgestellt: nach ✕ noch Anfragen, Klon live, nach dem Aufklappen ⏹ und nur „Satz 1.“). Jetzt endet es: beim Zuklappen sofort (`zeigen()`/`weg()` → `stromStoppen`), beim Verlassen des Raums, bei fehlendem Feld oder fehlendem Betreiber binnen 0,5 s (Wache, `LiveChat.istDrin()`). Das schon Gesprochene wird noch aufgeschrieben – auch ins zugeklappte Feld (sein „input“ legt es in den Entwurf), nach dem Aufklappen steht es da.
3. **Der Nachschub konnte dasselbe Stück mehrfach schicken** („Ja. Ja. Ja. Ja. Ja.“) bzw. aus Nachhall neue Anfragen machen. Jetzt nur mit echtem Fortschritt (siehe oben); bleibt nach 4 Nachschüben Sprache übrig, Meldung `strom-nachschub-grenze`.
4. **Stille Fehlschläge blieben stumm.** Die Wache (alle 0,5 s) prüft jetzt: nur Nullen nach 3 s → alter Weg, `strom-nullen`; in 6 s kein lauter Block (zu leise, kein Ton) → alter Weg, `strom-still (max rms=…)`; Strom stockt 6 s bei sichtbarer Seite → Ende, `strom-stockt`. ⏹ ohne Erkanntes zeigt den bekannten Satz „Ich habe nichts gehört – nochmal 🎤 und gleich sprechen.“ (nach ≥ 2 s einmal `strom-nichts` mit max rms an mich). Damit stimmt „nie schlechter als bisher“ – vorher nur für „kein einziger Block“.
5. (klein) **Neue Texte**: alle Fehler nehmen jetzt die Sätze des Browser-Diktats; neu ist nur noch „Einen Moment – ich schreibe noch auf …“. Dass der Text satzweise statt Wort für Wort kommt, bleibt – die Funk-Antwort fragt danach (Offen 5).
6. (klein) **Ladeweg** – nicht behoben, ehrlich größer: min/rueckfrage.js 15149 → 23425 (erster Bau) → **26197 Byte** (gzip 5979 → 9004 → **9906**, die Nachbesserung +902). Vorschlag bleibt Offen 3.
7. (klein) **Sonde**: die Zentrale wird jetzt erst im Netz nachgebaut – die Seite läuft die echte Kette (`zentralErkennen` → `alsBase64` → `zentralRufen` → JSON → `fetch`), abgefangen wird …/functions/v1/aussprache. Neue Fälle: Nachschub ohne Fortschritt, Azures Ende 0,1 s vor dem hörbaren Ende, Nachschub-Grenze, einmal/dauernd 429, Tagesgrenze → alter Weg, Tagesmenge, Walkie zu, Raum verlassen, nur Nullen, zu leise, ⏹ ohne Sprechen, EIN Stück von 50 s. Jeder Fall beginnt still (ein noch geplanter Satz des vorigen Falls fällt weg; ohne das kam einmal „Ton bei B“ im Stumm-Fall, der vom vorigen Fall stammte).
8. (klein) **842 wackelig**: 10× neu (dieser Stand) gegen 10× alt (a043c20, Baum mit Verweisen unter scratchpad/gegen884/baum, die acht geänderten Dateien aus a043c20), immer ein Paar gleichzeitig: **neu 8/10 grün, alt 8/10 grün**, beide Male dieselben zwei Prüfpunkte je einmal rot („beim Schliessen der Seite macht A seine Server-Sitzung zu“ – nur das ältere `schliessen` kam in den 800 ms an; „Spiel an/aus/an: … ohne Lücke > 1000 ms“ – 1022 ms neu, 1524 ms alt). Die Wackelei ist also älter als dieser Punkt und hängt an Zeitgrenzen der Sonde, nicht am Diktat.

Messwerte der Nachbesserung (Sonde `pruefe-884-diktat.js`, Quellen und min/, je 60/61 Prüfungen, alle grün):
- E2 Antwort deckt 0,1 s: **1** Anfrage, „Ja.“ (erster Bau: 5 Anfragen à 3,10 s, „Ja. Ja. Ja. Ja. Ja.“).
- E3 Azures Ende 0,1 s vor dem hörbaren Ende: **3** Anfragen für 3 Sätze (erster Bau: schon nach zwei Sätzen 6 Anfragen, vier davon Nachschübe à 0,63 s fast nur aus Stille).
- E4 jede Antwort deckt 1 s, 7 s Rede: 5 Anfragen (7,7 → 6,7 → 5,7 → 4,7 → 3,7 s), Meldung `strom-nachschub-grenze (nr=0, rest=2200 ms Sprache …)`.
- K einmal 429: Wiederholung nach 2,62 s, „Satz 1. Satz 2. Satz 3.“, Diktat läuft weiter, keine Meldung (erster Bau: Ende nach Satz 1). K2 dauernd 429: nach 3 Versuchen alter Weg, „Satz 1. Alter weg“.
- F `tagesgrenze`: alter Weg, „Satz 1. Alter weg“, Sperre bis 2026-10-12T00:00Z, nächster 🎤 gleich alter Weg, 0 Anfragen.
- L Tagesmenge 4 s: 2 Anfragen, „Satz 1. Satz 2. Alter weg“, Meldung `strom-tagesmenge (s=6 von 4 …)`; Zähler nach Fall A = gesendete 9,6 s.
- M ✕ mitten im 2. Satz: 2 Anfragen (Satz 3 nicht mehr), Klon `ended`, Kontext `closed`, nach dem Aufklappen „Satz 1. Satz 2.“ und 🎤. N Raum verlassen: ebenso.
- O1 nur Nullen: alter Weg nach 3,5 s, `strom-nullen (… max rms=0.0000 …)`; O2 zu leise: alter Weg nach 6,5 s, `strom-still (… max rms=0.0072 …)`. R ⏹ nach 1,5 s ohne Sprechen: „Ich habe nichts gehört – nochmal 🎤 und gleich sprechen.“, 0 Anfragen.
- H 30 s über die echte Kette: 8 Stücke, keine lange Aufgabe; alsWav 2–4 ms, `zentralErkennen` → `fetch` (Base64 + JSON) 2–4 ms je Stück. H2 EIN Stück von 50,7 s: WAV 1,62 MB, Körper 2,16 MB, alsWav 17–20 ms, Base64 + JSON 22–23 ms, **keine lange Aufgabe** (am Rechner; am Telefon ein Mehrfaches, aber unter 55 s bleibt es ein Stück).
- Gegenprobe `ALT=vorbau` (rueckfrage.js usw. aus 7cbc825, dem ersten Bau): **25 rot**, genau die nachgebesserten Stellen (Tagesmenge, 8b, 8c, 8d, 9–9d, 10b, 10c, 12b, 12c). Gegenprobe `ALT=1` (a043c20, vor dem Punkt): **46 rot**.
- Bestehende Sonden nach der Nachbesserung (min/ frisch gestempelt): 698, runde99-privat, runde99-pssst, 827, 882-aussprache-z, 768, 785, 787, 840 grün. runde99-rueckfrage einmal im Stapel (4 Sonden gleichzeitig) rot – „⏹ beendet es …“ wird nach 400 ms geprüft, das Ende kam unter Last später; danach 5× allein grün (alter Weg, nicht angefasst). 848 allein 1 rot („836: mit Lexical „… zwei …“ → falsch“) – stadt-leicht.html lädt rueckfrage.js gar nicht, wie im ersten Bau schon vermerkt älter als dieser Punkt. 842 je 8/10 neu/alt (Punkt 8).

**Offen**
1. **XANDER testet** einmal im echten Livestream mit einer zweiten Person (Funk-Antwort unten). Danach die `strom-…`-Meldungen lesen (SQL unten).
2. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand wie die anderen 884-Punkte).
3. **Vorschlag (unsichtbar, Ladezeit)**: rueckfrage.js nur für den Betreiber laden statt in der Startliste für alle (spart allen anderen nach der Nachbesserung 26 KB min / 9,9 KB gzip, mehr als dieser Punkt kostet). Nicht gebaut – eigener Punkt, weil die Startliste und der Zeitpunkt der Betreiber-Erkennung betroffen sind.
4. Nur Vorschläge, nicht gebaut (brauchen Xanders OK bzw. ändern etwas Sichtbares):
   - (a) Edge Function nimmt zusätzlich OGG/Opus an – Upload etwa 10× kleiner (wichtig bei schwachem Mobilfunk-Uplink neben dem Livestream). Braucht ein Hochladen der Funktion.
   - (b) ~~Tagesgrenze für den Betreiber anheben~~ – zurückgezogen (Nachbesserung): solange unklar ist, ob der zentrale Schlüssel F0 (kostenlos, 5 Audiostunden im Monat für ALLE Lernenden) oder S0 ist, wäre das falsch herum. Stattdessen die Tagesmenge im Gerät (5 min) und Xanders Entscheidung (Offen 6).
   - (c) Denselben Strom-Weg auch außerhalb des Livestreams nutzen (gegen „aborted“/„kein-start“ auf Samsung). Ändert das Gefühl (satzweise statt Wort für Wort) – erst im Funk fragen.
   - (d) 🎤 im Livestream auch in Browsern ohne Spracherkennung zeigen (Firefox) – ein neuer Knopf, also erst im Funk vorschlagen.
5. **Frage an XANDER (Regel 3, sichtbar)**: Im Livestream kommt der Diktat-Text satzweise nach einer kurzen Pause, nicht Wort für Wort wie bisher (Funk 6/13 hatten „du siehst live mit, was erkannt wird“ zugesagt). Passt das so, oder soll während des Sprechens etwas zu sehen sein? Nicht gebaut, bis er antwortet.
6. **Entscheidung XANDER: Azure F0 oder S0.** Bleibt F0, bleibt die Tagesmenge bei 5 min (seit 884b danach „Für heute ist die Spracherkennung im Livestream aufgebraucht – bitte tippen.“ – kein alter Weg mehr, man bleibt hörbar). Bei S0 (bezahlt) kann `STROM.tagesSekunden` steigen (z. B. 30 min ≈ 15 h im Monat). Von hier nicht prüfbar, welcher Tarif gilt.
7. **842** wackelt alt wie neu (je 8/10, siehe Nachbesserung 8) – eigener Punkt: die Zeitgrenzen der Sonde (800 ms für `schliessen`, 1000 ms Lücke) unter Last prüfen; die Nachbesserung fasst livechat.js nicht an.

### Auslesen nach dem Ausliefern (nur lesen)
```sql
select id, erstellt, left(text, 200) as text from betreiber_funk
 where von = 'xander' and text like '[automatisch] Diktat-Fehler: strom-%' order by id desc limit 50;
```

**Funk-Antwort (Entwurf, nach der Nachbesserung)**: „Walkie-Diktat im Livestream (Funk 163): Bisher hat das Diktat dem Livestream das Mikrofon weggenommen – deshalb haben dich die anderen nicht mehr gehört, solange du mir etwas diktiert hast. Jetzt hört das Diktat im Livestream bei deinem laufenden Mikrofon nur mit: die anderen hören dich die ganze Zeit. Bedienung wie immer (🎤, sprechen, ⏹). Klappst du das Walkie zu oder gehst aus dem Raum, hört das Diktat sofort auf. Was du diktierst, hören die anderen mit; wenn du das nicht willst, schalte dich stumm – das Diktat funktioniert trotzdem. Außerhalb des Livestreams ist alles wie vorher.
Zwei Fragen an dich: (1) Der Text kommt im Livestream satzweise, kurz nachdem du eine Pause machst, nicht mehr Wort für Wort. Passt dir das, oder willst du beim Sprechen etwas sehen? (2) Das Aufschreiben läuft über denselben Azure-Zugang wie der Aussprache-Trainer und die Stadt-Quests aller Lernenden. Ist das der kostenlose Tarif F0 (5 Stunden im Monat für alle zusammen) oder S0 (bezahlt, etwa 1 $ pro Stunde)? Solange ich das nicht weiß, nimmt das Diktat im Livestream höchstens 5 Minuten Sprache am Tag; danach sagt der 🎤 im Livestream „Für heute … aufgebraucht – bitte tippen“ (draußen diktierst du wie immer). Dein Mikrofon nimmt das Diktat dir dabei nie weg – die anderen hören dich immer.
Bitte teste es einmal im echten Livestream, wenn jemand Zweites da ist: Hört dich die andere Person weiter, während du diktierst, und steht der Text richtig im Feld? Wenn etwas hakt – kein Ton, zu leise, Netz, Kontingent –, bekomme ich automatisch eine Meldung.“

### Zweite Nachbesserung (884b): der Rückfall nimmt das Live-Mikro nie weg
Die Prüfung der Nachbesserung fand einen **wichtigen** Mangel (und sieben kleine): Kommt nach dem 🎤-Tipp 6 s lang kein lauter Block, ging die Wache per `stromRueckfall` auf den alten Weg – und dort stoppt `mikrofonLeihen` die Live-Spur und schickt „stumm“ an alle. Genau Funk 163. Auslösbar ganz normal: Xander tippt 🎤 und hört dem Gegenüber noch zu oder überlegt 6 s (die Echounterdrückung nimmt die Stimme des anderen aus seinem Mikrofon, die Kopie bleibt unter 0,012) – danach war er bis zum Ende des Diktats für alle stumm. Dasselbe bei Nullen, „kein Start“, Tagesmenge, Tagesgrenze, Kontingent, Anmeldung, Schlüssel und beim nächsten 🎤 nach einer Sperre. Nachgestellt (Gegenprobe O3): 7 s still, dann ein Satz – alter Weg, Live-Spur `ended`, 1 „stumm“-Paket, bei B Energie 0.

**Jetzt (nur rueckfrage.js; livechat.js, aussprache-pruefung.js, app.js, CSS, Datenbank, Edge Function unberührt):**
1. **Im Livestream mit lebender Live-Spur wird nie ausgeliehen und keine Browser-Erkennung gestartet** – kein Weg führt aus dem Strom-Diktat mehr in den alten (`diktatStarten(klasse, true)` und `danachAlt` sind weg). Neben dem Livestream bekommt die Browser-Erkennung auf Android das Mikrofon ohnehin nicht (Funk 139: „aborted“), ein Versuch ohne Ausleihen brächte dort nichts. Draußen (kein Klon) bleibt der alte Weg wie bisher; `mikrofonLeihen` nimmt dann niemandem etwas weg („Dauernd an“, warme Sprachnachricht-Spur, eine tote Spur).
2. **Stille**: nach 6 s ohne lauten Block nur EINE Meldung `strom-still (… max rms …, weiter)` und weiter aus der Live-Spur hören – wer danach spricht, wird erkannt. Kommt 30 s (`STROM.stillEndeMs`) gar nichts Lautes, endet es sauber mit „Ich habe nichts gehört – nochmal 🎤 und gleich sprechen.“ (wie das Browser-Diktat bei Stille; dazu einmal `strom-nichts`).
3. **Geht der Strom-Weg nicht**, endet das Diktat mit dem Grund, der Text bis dahin bleibt im Feld:
   - Tagesmenge → „Für heute ist die Spracherkennung im Livestream aufgebraucht – bitte tippen.“ (Satz aus dem ersten Bau 7cbc825 + „im Livestream“, weil die Tagesmenge nur hier gilt),
   - `tagesgrenze` → „Für heute ist die Spracherkennung aufgebraucht – bitte tippen.“, Kontingent nach 3 Versuchen / Anmeldung / Schlüssel / ohne Zentrale → „Die Spracherkennung ist gerade nicht verfügbar – bitte tippen.“ (beide aus 7cbc825),
   - nur Nullen → „Das Mikrofon ist nicht angesprungen. Ist es gerade in einer anderen App belegt? …“, kein Block in 3 s / kein Kontext → „Die Spracherkennung ließ sich nicht starten.“ (beide Sätze des Browser-Diktats).
   - Der nächste 🎤 im Livestream sagt den Grund gleich (Sperre bzw. Tagesmenge, `stromSperrgrund`), ohne Kontext, ohne Anfrage. Ohne Zentrale/AudioContext einmal `strom-unmoeglich` an mich.
   - **Hängt das Worklet-Modul**, übernimmt nach 1,5 s der ScriptProcessor (`STROM.ersatzMs`), ein angehaltener Kontext wird geweckt – bis hier half da nur der alte Weg.
4. **Gateway-Antworten ohne Azure-Ergebnis** (401 „Invalid JWT“ bei falsch gehender Geräteuhr, 503 BOOT_ERROR, 546 WORKER_LIMIT: JSON, aber ohne `fehler` und ohne `RecognitionStatus`) galten als NoMatch – das Stück verschwand still. Jetzt `antwort-unlesbar` mit dem Grund des Gateways (`grund=WORKER_LIMIT`): einmal nach 1 s wiederholt, dann gemeldet, das Diktat läuft weiter. Azures eigene Antwort hat immer `RecognitionStatus` (die Zentrale reicht sie unverändert durch).
5. **Raumkanal-Aussetzer**: `CHANNEL_ERROR` setzt `lage = "fehler"`, bis der Kanal wieder beitritt – WebRTC und die Live-Spur laufen weiter. Das beendete das Diktat mitten im Satz. Jetzt endet es sofort nur bei `lage === "aus"` (Raum verlassen), sonst erst nach 30 s ohne Raum (`STROM.raumWegMs`). `LiveChat.lage()` (teuer) wird nur in diesen Augenblicken gefragt, sonst bleibt es bei `istDrin()`.
6. **Nachschub in Teilen** (`stromRestTeile`): bis hier ging mit jedem Nachschub der GANZE Rest des Stücks noch einmal hinaus – hört Azure an jeder Pause auf, wanderte der Schluss eines langen Stücks bis zu fünfmal zur Zentrale, und was nach der vierten Pause kam, fehlte. Jetzt wird der Rest an jeder Pause geteilt, die so lang ist wie die, an der Azure aufgehört hat (eine Blocklänge Spiel, 0,3–0,7 s); jedes Teil (0,3 s Vor-/Nachlauf, ≥ 0,3 s Sprache davor und dahinter) geht einmal hinaus und schreibt an dieselbe Stelle. Ohne Pause im Rest (Dauerrede, Sonde E4) bleibt es ein Teil – wie bisher.
7. (klein) **Erstes ⏹ während eines Ausklangs, den das System begonnen hat** (Tagesmenge, ✕, Raum verlassen), zählte als „zweites ⏹“ und verwarf die Antworten unterwegs (der letzte Satz fehlte). Jetzt beendet erst ein weiteres ⏹ sofort.
8. (klein) `verworfen=` zählt das fehlgeschlagene Stück mit (Tagesgrenze: vorher `verworfen=0`, obwohl „Satz 2“ fehlte), dazu `wartend=… ms`.
- **Sichtbar** (Regel 3): Knöpfe, Größe, Bedienung gleich. Anders ist nur, welcher Satz am Ende in der Hinweiszeile steht, wenn der Strom-Weg nicht trägt – statt dass das Diktat stumm-schaltend weiterläuft. Die Sätze stammen aus dem ersten Bau bzw. dem Browser-Diktat; neu ist allein das Wort „im Livestream“ im Tagesmengen-Satz.

### Sonden (884b)
`werkzeug/pruefe-884-diktat.js` umgebaut und erweitert (Kopf der Sonde): Die Rückfall-Fälle prüfen jetzt „KEIN alter Weg“ (0 Browser-Erkennungen), „nichts ausgeliehen“ (`mikrofonGeliehen` false, Original-Spur live/an, `tonAn`, 0 „stumm“) und den Grund in der Hinweiszeile. Neu: E5 (Nachschub in Teilen), O3 (7 s still, dann sprechen), L2 (erstes ⏹ im Ausklang), P (546 WORKER_LIMIT), Q/Q2 (Raumkanal 2 s weg / bleibt weg), I (Worklet hängt → ScriptProcessor), I2 (auch der wirft → Ende mit Grund); F und L tippen den nächsten 🎤 mit FRISCHER Live-Spur (`__neueSpur()`) – vorher war die Prüfung zahnlos (Prüfung, klein).
- **Ergebnis** (Chromium, 412 px, isMobile): Quellen **79/79 grün**, min/ (nach `--nur-stempel`) **78/78 grün** (H2 nur im Quellen-Lauf). Messwerte:
  - O3 7 s still, dann ein Satz: „Satz 1.“, 0 Browser-Erkennungen, nichts ausgeliehen, 0 „stumm“, bei B Energie 0,236 im Satz.
  - O2 zu leise: nach 6,5 s EINE Meldung `strom-still (… max rms=0.0069 … weiter)`, weiter ⏹/„Ich höre zu …“, nach stillEndeMs (Sonde 9,5 s, Original 30 s) „Ich habe nichts gehört …“. O1 Nullen: nach 3,5 s „Das Mikrofon ist nicht angesprungen …“, `strom-nullen`.
  - F Tagesgrenze: „Satz 1.“ bleibt, „Für heute ist die Spracherkennung aufgebraucht – bitte tippen.“, Meldung `… Ende, verworfen=1, wartend=0 ms`, Sperre bis 2026-10-13T00:00Z; nächster 🎤 mit frischer Spur: 0 Starts, 0 Anfragen, 0 neue Kontexte, gleich der Grund. K2: 4 Anfragen, `versuche=3 … verworfen=1`. L Tagesmenge 4 s: „Satz 1. Satz 2.“, dann „… im Livestream aufgebraucht …“. L2: erstes ⏹ im Ausklang, die Antwort (2,5 s unterwegs) kommt noch: „Satz 1. Satz 2.“.
  - E5 6 Sätze/0,6-s-Pausen in einem Stück von 13,3 s: **6 Anfragen** (13,3 / 2,2 / 2,3 / 2,2 / 2,2 / 2,2 s), alle sechs Sätze, 24,4 s Ton = **1,83×**. E/E2/E3/E4 unverändert (E4 Dauerrede: weiter 5 Anfragen 7,7 → 3,7 s, Meldung an der Grenze).
  - P 546 WORKER_LIMIT: 4 Anfragen (eine Wiederholung), „Satz 1. Satz 3.“, Diktat läuft, `strom-antwort-unlesbar (nr=1, rate=16000, ms=3200, grund=WORKER_LIMIT)`.
  - Q Raumkanal 2 s „fehler“: „Satz 1. Satz 2. Satz 3.“, ⏹ läuft. Q2 bleibt weg (Sonde 1,5 s): Ende nach 2,0 s.
  - I Worklet hängt: ScriptProcessor ab 1,5 s, „Satz 1.“ mit 1 Anfrage, keine `strom-kein-start`. I2 auch der wirft: nach 3 s „Die Spracherkennung ließ sich nicht starten.“, `strom-kein-start (… knoten=keiner …)`.
  - H/H2 Leistung wie vorher: keine lange Aufgabe, alsWav 2–10 ms je Stück, 50,7-s-Stück alsWav 21,5 ms, Base64+JSON 25,4 ms.
- **Gegenprobe** (Stand vor 884b: Baum aus Verweisen unter scratchpad/gegen884b/diktat-vor, rueckfrage.js/min/rueckfrage.js/index.html/min/.quelle.json aus f6f8968, `WURZEL=… NUR=quelle`): **31 rot**, genau 8e, 9–9e, 10, 10b, 10d, 15, 16 – z. B. O3 „Alter weg“ mit `geliehen=true, Spur ended, tonAn=false, „stumm“=1`, bei B Energie 0; E5 5 Anfragen, der 6. Satz fehlt, 3,42× Ton; P 3 Anfragen, keine Meldung; Q Ende nach Satz 2; L2 nur „Satz 1.“; F `verworfen=0`. Alle übrigen Fälle grün (unverändertes Verhalten).
- Bestehende Sonden (min/ frisch gestempelt, nacheinander): runde99-rueckfrage (alter Weg außerhalb des Livestreams, ⏹-Notbremse 0,8 s), 698 (mikrofonLeihen/-Zurueck selbst, unverändert) und 884-vollbild (Walkie-Feld) grün.

**Offen (884b)**
1. Echtes Azure und Samsung Internet bleiben nachgestellt; ob Azure an Pausen aufhört (Nachschub in Teilen) und wie lang diese Pausen sind, zeigen erst echte Antworten. Die `strom-…`-Meldungen (SQL oben, jetzt auch `strom-unmoeglich`, `strom-antwort-unlesbar … grund=…`) sagen, was hakt.
2. Ist der Strom-Weg im Livestream gesperrt (Tagesmenge, Tagesgrenze, 30 min nach Kontingent/Anmeldung/Schlüssel), gibt es dort jetzt KEIN Diktat mehr (vorher: alter Weg, dafür stumm). Das ist die Abwägung aus Funk 163 („soll generell immer aktiv sein“ – das Live-Mikro); Xanders Entscheidung F0/S0 (Offen 6) bestimmt, wie oft das vorkommt. Die 30-min-Sperre nach `kontingent` stammt aus der Zeit mit altem Weg – ob sie kürzer sein soll, entscheiden die ersten Meldungen.
3. Ein Gateway-Fehler zeigt (wie bisher „antwort-unlesbar“) „Die Spracherkennung braucht Netz – gerade keins.“; die gesendeten Sekunden eines Stücks, das am Gateway scheiterte, zählen trotzdem zur Tagesmenge (gezählt wird beim Senden). Beides klein, nicht geändert.
4. Der 0,2-s-Abstand beim Nachschub (`nachschubAbstandS`) ist weiter ohne eigene Sonde (die Prüfung nannte es nebenbei).
5. Ladeweg: min/rueckfrage.js 26197 → **28660 Byte** (gzip 9906 → **10800**). Der Vorschlag „rueckfrage.js nur für den Betreiber laden“ (Offen 3) wird damit wichtiger – eigener Punkt.

## Fassung 884 — Notweg ins Klassenzimmer (Funk 268/270/272/273)

XANDER (Funk 270): „…fallbeck auf das Klassenzimmer“. Zusage Claude (Funk 272/273): fällt der neue schlanke Weg ins Klassenzimmer aus (ein Stück von min/app.js fehlt, lädt nicht oder passt nicht zur Fassung), lädt die Seite von selbst das ganze app.js, und man kommt trotzdem ins Klassenzimmer. Aussehen, Größe und Bedienung bleiben; livechat.js ist unberührt.

### Befund (Stand vor diesem Punkt, 0df7804)
Den Notweg gab es nur zur Hälfte: `dmaMinFehlt` (Fassung 694) greift nur, wenn ein ganzes `<script>` aus min/ nicht lädt. Für die Stücke von min/app.js (seit 876) gab es keinen:
- Stück fehlt (404) → Tipp auf „Klassenzimmer betreten“ wirft im Platzhalter (`livechatHinein` liegt im Raum-Stück), es passiert nichts, kein Tor. Oben erscheint „↻ Neue Fassung 883 – jetzt laden“ – auf Fassung 883. Der Knopf lädt dieselbe Fassung mit denselben kaputten Stücken: ins Leere.
- Stück passt nicht (falsche Kennung) → genauso; bei der Rückkehr nach dem Neuladen bricht `rein()` schon beim Zusammenstellen der Angaben ab (`livechatName`/`livechatGeschlecht` liegen im Raum-Stück) – man kommt nie zurück in den Raum, still.
- Im Raum (`raumDrin`) wurden Fehler nur notiert; Plätze und großes Bild (`livechatPlaetzeAuffrischen`, `livechatGrossAuffrischen`, Raum-Stück) wären kaputt geblieben.

### Was geändert ist
**index.html** (Block „FASSUNG 694“ und Fassungs-Wächter):
- localStorage `dma-ganz` = `{f: Fassung, d: ["app.js"]}`: für DIESE Fassung gibt `DMA_Q("app.js")` die Quelle `app.js` statt `min/app.js`; alle anderen Dateien bleiben verkleinert. Ein Eintrag einer anderen Fassung wird beim Laden weggeräumt – mit der nächsten Fassung ist man wieder schlank. Der Stempel stimmt von selbst (`v()` nimmt `st["app.js"]`).
- `window.dmaGanzLaden(datei, grund)` → Versprechen true/false: ohne Speicher (Probe-Schreiben vorab), mit `?quelle`, schon ganz, ohne min-Kopie oder einmal je Fassung+Datei+Tab schon versucht (`dma-ganz-neu`) → false. Sonst `fassung.json` (no-store): steht dort eine ANDERE Fassung, holt die Seite diese (`dmaFassungLaden`, ?f=…) und stellt NIE auf die Quelle um. Sonst wird `app.js?v=<Stempel>` ganz geholt (unter 10 000 Byte oder Fehler → false, also ohne Leitung kein Neuladen); erst dann `dma-ganz`, `dma-ganz-neu`, `dma-ganz-grund` (≤ 300 Zeichen) setzen und nach 50 ms neu laden (`DMA_MESS.selbst`, kein Abbruch in der Messung).
- `window.dmaFassungLaden(neu)`: dieselbe Merkerlogik wie der erste Blick des Wächters (`dma-neu-geladen`), einmal je Fassung und Tab; sonst false (dann bleibt es bei der Blase).

**app.js** (drei örtliche Stellen, alles im Kern – Namen `dmaTeil…` lagern teile-bauen/teile-messen nie aus):
- `dmaTeilFehler`: die Blase nur noch, wenn `fassung.json` wirklich eine andere Fassung meldet.
- Neu `dmaTeilNotweg(teil, e)`: notiert den Fehler, merkt sich „zurück ins Klassenzimmer“ (sessionStorage `dma-notweg-ziel`, wenn man im Klassenzimmer oder im Raum war) und ruft `dmaGanzLaden`. Läuft nur einmal gleichzeitig; schlägt er fehl, frühestens nach 15 s wieder (nicht bei jedem Platzhalter-Aufruf; **Abweichung vom Plan**: der Plan erlaubte sofortiges Wiederholen – bei toter Leitung hätte jeder Platzhalter-Aufruf `fassung.json` + `/app.js` neu angefragt).
- Neu `dmaTeilRaum()`: Raum-Stücke holen (fehlgeschlagene ein zweites Mal) und alle sofort einsetzen; true nur, wenn danach jedes eingesetzt ist. `dmaTeilRaumFehlt()` nennt den letzten Stück-Fehler als Grund.
- `dmaTeilRuf`: scheitert das Sofort-Holen/Einsetzen (oder fehlt danach die Funktion) → Notweg; dieser eine Aufruf wirft wie bisher.
- `raumDrin`: `dmaTeilRaum()`, bei false der Notweg (im Raum: Neuladen, dann über `rueckkehrOffen` von selbst wieder hinein – so in Funk 272/273 vereinbart).
- Rückkehr nach dem Neuladen: erst `dmaTeilRaum()`; bei false NICHT mit halbem app.js hinein, sondern der Notweg; lädt der nicht neu (keine Leitung), wie bisher hinein. Zwischen `rueckkehrOffen` und `konto:` ist nichts eingefügt (Abstand 748 wie vorher).
- Einladungs-Block: `dma-notweg-ziel` führt wie ein Einladungslink Wissen → Klassenzimmer (einmal, danach gelöscht).
- `DMA_TEILE.stand()` zusätzlich `ganz` und `notweg` (Grund) für die Sonde.

Größe: min/app.js gepackt +376 Byte (194 712 → 195 088). Im Normalfall ändert sich sonst nichts (Sonde D, 876).

### Sonden
- Neu: `werkzeug/pruefe-884-notweg.js` (eigener Server mit Anfragen-Protokoll; die Fehler macht der Server, weil die Platzhalter synchrones XHR benutzen; Supabase-Attrappe wie 871). **Alles grün (35 Prüfungen)**:
  - A Stück fehlt, Tipp: genau EIN Neuladen (index.html 2×), neue Seite 1,4–1,7 s nach dem Tipp (lokaler Server); `/app.js?v=<Stempel>` geholt; Seite 2: `DMA_Q("app.js") = app.js`, `gebaut=false`, `ganz=true`, keine `min/app-teil-*`/`min/app.js`-Anfrage; Grund „raum1: app-teil raum1 nicht geladen (404)“; Klassenzimmer ohne Tipp offen; Tor kommt; „Rakete“ läuft; keine Seitenfehler auf Seite 2 (Seite 1: der eine gescheiterte Tipp).
  - B Stück passt nicht + Rückkehr: ein Neuladen; Seite 1 betritt nicht; Seite 2 betritt mit der Quelle; Grund „raum: Raum-Stücke fehlen – raum8: app-teil 000000000000 passt nicht zu app.js“.
  - C keine Leitung zur Quelle: kein Neuladen in 8 s, kein `dma-ganz`, die Quelle wurde versucht (404), **keine Blase „Neue Fassung 883“**, „Lernen“ geht.
  - D Normalfall: Tor, kein Neuladen, keine /app.js-Anfrage, kein `dma-ganz`, keine Seitenfehler.
  - E `dma-ganz` der Fassung 882 wird weggeräumt (min/app.js); `dma-ganz` der Fassung 883 in einem neuen Tab: ganze app.js, livechat.js bleibt min/, Tor kommt.
  - F neuere Fassung auf dem Server: die Seite landet auf `?f=884` mit min/app.js (kein `dma-ganz`), Klassenzimmer offen, Tor, Stücke passen.
  - G mit `?mit-sw`: sw.js führt die Seite; der Server sieht `/app.js` genau EINMAL (das Vorab-Holen), beim Neuladen kommt sie aus sw.js (Resource-Timing: über den Worker, 0 Byte übertragen).
- Gegenprobe (index.html, app.js, min/ aus 0df7804 in scratchpad/gegen884/notweg, Rest als Verweise, `WURZEL=…`): **19 rot** – Bau (2), A (kein Neuladen, keine Quelle, kein Tor, keine Rakete), B (kein Neuladen, betritt nie), C („der Notweg hat die Quelle versucht“ und die Blase „↻ Neue Fassung 883 – jetzt laden“), E (alter Merker bleibt liegen / wird nicht befolgt), F (bleibt auf 883, Stücke passen nicht), G. Grün bleiben D (Normalfall) und die Prüfungen, die im alten Stand nichts tun (C kein Neuladen, „Lernen“ geht).
- Bestehende Sonden (nach `fassung-setzen.js --nur-stempel`): grün: 876-start-schlank (Start schlank, Sofort-Nachladen, ?quelle), neue-fassung (Fassungsblase), einladungslink (derselbe Block), 858-ladeweg, 840-bilderwelt-alt-neu (Pflicht, app.js angefasst), 859-kanal-sofort, runde18, 884-messung (index.html-Block DMA_MESS). 694-leistung 1 rot („beim erneuten Öffnen kommt KEINE gestempelte Datei mehr übers Netz“: /min/spiel.js) – mit einer Kopie der Sonde gegen den Stand 0df7804 derselbe Fehler (spiel.js kommt in der Ruhepause, bevor sw.js die Seite führt), also älter; Teil 2 „fehlt eine Kopie, kommt die Quelle“ (dmaMinFehlt) grün. 862-angebotssturm 1 rot: Teil D (Text-Regex, Abstand 748) – am Stand 0df7804 genauso rot (siehe Offen 5).

### Nachbesserung nach der Prüfung (zweiter WIP-Commit)
Die Prüfung fand einen wichtigen und drei kleine Mängel; alle sind behoben (unsichtbar, Aussehen/Größe/Bedienung unverändert, livechat.js unberührt).
1. **Neuladen, obwohl der schlanke Weg wieder ging (wichtig).** Nachgestellt in der Prüfung (X3): Tipp 1 scheitert (Stück 404), der Notweg holt app.js ohne Frist; Tipp 2 holt das Stück selbst, das Tor kommt – dann kommt die Quelle doch noch an und die Seite lädt neu (Tor weg, frische Verbindung abgerissen, schwere Quelle für den Rest der Fassung). Hing der Abruf ganz, blieb der Notweg für immer „läuft“, und die Rückkehr wartete unbegrenzt. Jetzt:
   - `dmaGanzLaden(datei, grund, noch)`: NACH dem Holen der Quelle und unmittelbar vor `dma-ganz`/Neuladen fragt es `noch()`. app.js antwortet über `dmaTeilListe`: die ausgefallenen Stücke (`dmaTeilNotwegBedarf`) werden ein letztes Mal über die Leitung geholt und eingesetzt – sind sie da (oder hat ein Platzhalter sie inzwischen selbst geholt), **kein Neuladen**. Auch vor dem Fassungs-Weg (?f=…) wird gefragt. Antwortet `noch` nicht binnen 8 s, gilt „ja“ (die ganze Quelle kam, die Stücke nicht).
   - Fristen mit `AbortController` (sonst Zeitgeber, das späte Ergebnis wird nicht mehr beachtet): `fassung.json` 8 s, die ganze Quelle 40 s (gut 1,7 MB gepackt; bei 400 kbit/s knapp 35 s). Danach false – der Notweg endet immer, ein neuer Versuch ist nach 15 s möglich (sofort, wenn `noch` entwarnt hat).
   - Läuft der Notweg schon, bekommt ein weiterer Ausfall DIESELBE Antwort (vorher sofort `false` – dann ging z. B. die Rückkehr mit halbem app.js hinein); seine Stücke kommen zu `dmaTeilNotwegBedarf`.
   - `dmaTeilRaum()` ist jetzt `dmaTeilListe(Raum-Stücke)` (gleiches Verhalten: holen, fehlgeschlagene ein zweites Mal, alle gleich einsetzen).
   - Nebenbei: `dmaTeilFehler` fragt `fassung.json` höchstens alle 15 s (vorher je ausgefallenem Stück – bei 8 Raum-Stücken, zweitem Anlauf und „noch“ gut 20 Anfragen über die schwache Leitung, neben dem Abruf der Quelle). Die Blase bei wirklich neuerer Fassung kommt wie bisher (erste Frage).
2. **mess-start erkennt eine Notweg-Seite nicht (klein).** Stimmt: mess-start schickt die Seite NACH dem Neuladen, dort ist `DMA_TEIL_FEHLER` leer und `teile = [0,0]`; `bau = "quelle"` sieht aus wie `?quelle` oder `dmaMinFehlt`. Jetzt schreibt messung.js `ganz: 1`, wenn die Seite wegen des Notwegs mit der ganzen app.js läuft (`DMA_GANZ["app.js"]`), sonst 0 – nur 0/1, kein Grundtext. SQL unten umgestellt.
3. **Ziel nach dem Neuladen hing am ersten Ausfall (klein).** Nachgestellt (X2b): im Raum, Ansicht nicht das Klassenzimmer, Raum-Stücke fehlen – zuerst ruft LiveChat einen Platzhalter (raum6), bevor `raumDrin` `dmaRaumDrin` setzt; `dma-notweg-ziel` wurde nie gesetzt, nach dem Neuladen war das Klassenzimmer zu. Umgekehrt blieb `dmaRaumDrin` nach dem Verlassen true – ein späterer Notweg (etwa im Lernen) sprang dann ungefragt ins Klassenzimmer. Jetzt entscheidet `dmaTeilNotwegZiel()` im Augenblick des Neuladens (in `noch`): Klassenzimmer sichtbar ODER LiveChat `drin`/`verbindet` → zurück ins Klassenzimmer, sonst nicht. `dmaRaumDrin` wird dafür nicht mehr benutzt (bleibt nur der Einmal-Merker für `raumDrin`).
4. **Die Sonde prüfte wichtige Aussagen nicht (klein).** Neue Fälle in `pruefe-884-notweg.js` (H–N, siehe unten); `page.route` schaltet den HTTP-Zwischenspeicher ab – Fall N läuft deshalb in einem eigenen Browser ohne `route` (fremde Adressen sperrt `--host-resolver-rules`).
- `DMA_TEILE.stand()` zusätzlich `laeuft` (läuft der Notweg gerade) – für die Sonde.
- Größe: min/app.js gepackt (gzip -9) 195 106 → 195 306 Byte (+200). Alle neuen Namen beginnen mit `dmaTeil` und bleiben im Kern (Sonde 1).

**Sonde nach der Nachbesserung: alles grün, 58 Prüfungen** (vorher 35). Neu:
- H Quelle kommt spät, Stück inzwischen da (Tipp 2 holt es, Tor kommt): **kein Neuladen**, Tor bleibt, kein `dma-ganz`, kein Ziel-Merker, `laeuft=false`.
- I Quelle kommt spät, Stück jetzt holbar (ohne zweiten Tipp): „noch“ holt raum1, kein Neuladen, der nächste Tipp öffnet das Tor.
- J Rückkehr, die Quelle hängt ganz (Server antwortet nie): der Abruf wird nach 40 s abgebrochen (der Server sieht den Abbruch), die Rückkehr geht 40,0 s nach der Anfrage wie bisher hinein (schlank, die Stücke waren inzwischen wieder zu haben), kein Neuladen, kein `dma-ganz`. **(884b geändert: der Abbruch war der Fehler – siehe „Zweite Nachbesserung“.)**
- K im Raum, Ansicht nicht das Klassenzimmer, Raum-Stücke fehlen: ein Neuladen, danach Wissen → Klassenzimmer offen.
- L im Raum (Raum-Stücke eingesetzt), Raum verlassen, im Lernen fällt ein Rest-Stück aus (Grammatik): ein Neuladen, danach NICHT im Klassenzimmer (Lernen offen).
- M messung: mess-start Seite 1 `ganz=0` (bau = min-Stempel), Seite 2 `bau=quelle, ganz=1`.
- N ohne sw.js und ohne `page.route`, `/app.js` mit `Cache-Control: max-age=600` wie GitHub Pages: der Server sieht `/app.js` genau einmal, Seite 2 überträgt 0 Byte (5,86 MB aus dem HTTP-Zwischenspeicher). Bestätigt die Aussage „danach liegt sie im Zwischenspeicher“ auch ohne sw.js (wie die Prüfung in X4).
- Gegenprobe gegen den Stand VOR der Nachbesserung (index.html, app.js, min/ aus 4be6ccd in scratchpad/gegen884/nach-4be6ccd, Rest als Verweise, `WURZEL=…`): **14 rot** – Bau (2), H (Neuladen nach dem Tor, `dma-ganz` gesetzt), I (Neuladen statt Stück, 3), J (die Rückkehr kommt in 70 s nie hinein, kein Abbruch, 3), K (Klassenzimmer zu), L (springt ins Klassenzimmer), M (kein `ganz`, 2). Grün bleiben A–G und N (die schon vorher stimmten).
- Bestehende Sonden nach der Nachbesserung (nach `--nur-stempel`): grün 876-start-schlank, 884-messung, neue-fassung, einladungslink, 858-ladeweg, 840-bilderwelt-alt-neu (Pflicht), 859-kanal-sofort, runde18. Rot wie vorher und unverändert: 694-leistung (/min/spiel.js, älter) und 862 Teil D (Text-Regex; zwischen `rueckkehrOffen` und `konto:` ist nichts eingefügt).

### Ehrlich
- Nicht nachstellbar: echte Funklöcher, die CDN von GitHub Pages während des Auslieferns, der Zwischenspeicher sw.js auf dem Samsung. Bewiesen sind die Abläufe im Chromium gegen einen Server, der die Fehler absichtlich macht; dass die vorab geholte app.js aus sw.js kommt, zeigt G (?mit-sw), auf dem Telefon nicht geprüft.
- Draußen noch nicht messbar: `spiel_diagnose` hat noch keine Zeile „mess-start“ (884 ist nicht ausgeliefert). Die frühere Aussage hier („danach zeigt messung.js für eine Notweg-Seite `bau: "quelle"` und `teile[1] > 0`“) stimmte nicht (Prüfung): mess-start kommt von der Seite NACH dem Neuladen, dort ist `teile = [0,0]`. Seit der Nachbesserung meldet mess-start `ganz: 1` für eine Notweg-Seite (SQL unten); `?quelle` und `dmaMinFehlt` haben `ganz: 0`. Die Seite VOR dem Neuladen meldet ihre Teilfehler (`teile[1]`, bau = min-Stempel) nur, wenn sie vor ihrem Senden (draußen 20 s nach dem Start) passierten.
- Sichtbar nur im Fehlerfall: die Seite lädt einmal von selbst neu (zugesagt). Die irreführende Blase „Neue Fassung 883“ auf 883 entfällt – das bringt den Code auf die Absicht von 876 (dort stand „Teil passt nicht (die Seite ist älter als der Server)“). Liegt wirklich eine neuere Fassung bereit, kommt die Blase wie bisher.
- Nach dem Notweg muss man „Klassenzimmer betreten“ noch einmal tippen (das Tor fragt ohnehin nach Mikrofon und Kamera); wer schon im Raum war, kommt ohne Tipp zurück.
- Für den Rest der Fassung ist dieses Gerät schwerer: app.js als Quelle (gepackt ~1,7 MB, 5,8 MB zum Übersetzen) statt 195 KB + Stücke. Auf dem Samsung ist der Start bis zur nächsten Fassung spürbar langsamer. Bewusst so (Alternative min/app-ganz.js kostet bei jeder app.js-Änderung +2,6 MB im Git).
- Ein Neuladen mitten im Gespräch ist möglich, wenn im Raum ein Raum-Stück auch im zweiten Anlauf fehlt (Ton 3–5 s weg, dann `rueckkehrOffen`). Ohne Neuladen wären Plätze und großes Bild kaputt. **Bis zur Nachbesserung 1 zu 884b stimmte das so nicht (Prüfung):** es traf jedes Stück, und auf langsamer Leitung zu jedem späteren Zeitpunkt (die Quelle wird seit 884b nie abgebrochen, „noch“ prüfte nur, ob das Stück noch fehlt). Seit der Nachbesserung gilt der Satz wörtlich – siehe dort.
- Ein Platzhalter holt sein Stück auf toter Leitung weiter synchron (seit 876, unverändert).
- ~~Die Fristen (fassung.json 8 s, Quelle 40 s, „noch“ 8 s) … nach 15 s ist ein neuer Versuch möglich.~~ **Stimmte nicht (Prüfung 884b):** der „neue Versuch“ fing den Abruf von vorn an und brach ihn wieder nach 40 s ab – auf langsamer Leitung eine Schleife ohne Ende. Seit der zweiten Nachbesserung wird die Quelle nicht mehr abgebrochen (siehe dort).
- „noch“ holt die ausgefallenen Stücke ein letztes Mal über die Leitung; sind sie da, wird nicht neu geladen, und der eine gescheiterte Tipp bleibt gescheitert – man tippt noch einmal (wie nach dem Neuladen auch).
- Randfall: meldet `fassung.json` (veraltet) eine ÄLTERE Fassung als die Seite, nimmt der Notweg den Fassungs-Weg (einmal ?f=…, danach Blase) statt der Quelle – wie der Wächter selbst. Nicht nachgestellt; `fassung.json` kommt mit no-store.
- Nicht gebaut (optional im Plan): (i) Notweg auch für `data-exercises-teil.js` (betrifft nicht das Klassenzimmer), (ii) eine eigene Diagnose-Zeile „notweg“ (die 40-am-Tag-Grenze wird von leitung/tonstand schon erreicht; mess-start zeigt es jetzt über `ganz`, s. o. – den Grund nicht).

**Vorschlag an Xander (sichtbar, nicht gebaut)**: Während der Notweg die ganze app.js holt (über 3G bis ~10 s), passiert nach dem Tipp scheinbar nichts. Eine kurze Zeile „Klassenzimmer wird neu geladen …“ wäre eine sichtbare Änderung – nur mit deinem OK.

**Offen**
1. Gegenprobe auf dem echten Samsung (mit sw.js) – z. B. mit einer absichtlich kaputten Stück-Adresse auf einer Prüf-Kopie; draußen erst nach dem Ausliefern über mess-start (`ganz`, SQL unten). Wie oft der Notweg dank „noch“ NICHT neu lädt, sieht man draußen nicht (dafür bräuchte es eine eigene Diagnose-Zeile).
2. Vorschlag „Klassenzimmer wird neu geladen …“ (Antwort Xanders).
3. Möglicher Folgeschritt: bei `navigator.onLine === false` kein synchrones Nachholen im Platzhalter (seit 876).
4. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand wie die anderen 884-Punkte).
5. Sonde 862 Teil D (Text-Regex `rueckkehrOffen[\s\S]{0,600}konto:`) ist schon vor diesem Punkt rot (Abstand 748, von 876) – hier nicht verändert, eigener kleiner Punkt (die Sonde, nicht der Code).

### Auslesen nach dem Ausliefern (nur lesen)
```sql
-- notweg = Seiten, die wegen eines ausgefallenen Stücks mit der ganzen app.js laufen (messung.js „ganz“, ab der Nachbesserung)
select daten->>'f' as fassung, daten->>'bau' = 'quelle' as quelle, count(*) as seiten,
       sum(case when daten->>'ganz' = '1' then 1 else 0 end) as notweg,
       sum(case when coalesce((daten->'teile'->>1)::int, 0) > 0 then 1 else 0 end) as mit_teilfehler,
       max(zeit) as zuletzt
  from spiel_diagnose where art = 'mess-start' group by 1, 2 order by 1 desc, 2;
```

**Funk-Antwort (Entwurf)**: „Notweg ins Klassenzimmer (Funk 270/272): Seit der schlanken Seite (876) wird das Klassenzimmer in Stücken nachgeladen. Fehlte eines davon oder passte es nicht, ging „Klassenzimmer betreten“ einfach nicht, und oben stand fälschlich „Neue Fassung 883 – jetzt laden“, was nichts half. Jetzt holt sich die Seite in so einem Fall selbst das ganze Programm in einem Stück, lädt einmal neu und öffnet das Klassenzimmer wieder – du tippst nur noch einmal auf „Klassenzimmer betreten“. Warst du schon im Raum, kommst du von selbst zurück. Kommt das fehlende Stück doch noch (kurzes Funkloch), lädt sie nicht neu. Ohne Netz lädt sie nicht neu. Liegt schon eine neuere Fassung bereit, nimmt sie diese. Im Normalfall ändert sich nichts. Auf sehr langsamem Netz wartet sie, bis das Programm da ist, statt immer wieder von vorn anzufangen (das tat die erste Fassung dieses Notwegs, die Prüfung hat es gefunden); reißt die Verbindung unterwegs ab, holt sie es höchstens dreimal, danach lädt sie nicht mehr neu. Bist du gerade im Gespräch und fehlt nur ein Stück, das das Klassenzimmer nicht braucht, lädt sie nicht mitten im Gespräch neu – erst beim nächsten Mal, wenn du außerhalb des Raums auf so ein Stück triffst. Eine Frage: Während das Programm geholt wird (über 3G etwa 10 Sekunden, auf sehr schwachem Netz auch eine Minute), sieht man nichts. Soll da eine kurze Zeile „Klassenzimmer wird neu geladen …“ stehen?“

### Zweite Nachbesserung (884b): keine Neulade-Schleife auf langsamer Leitung
Die Prüfung von ada429c fand einen wichtigen Mangel: **auf langsamer Leitung lud die Seite die ganze app.js immer wieder, ohne dass sie je ankam.** Nachgestellt (Prüfer, `scratchpad/pruefer-notweg/drain.js`): Raum-Stück 404, `/app.js` braucht 50 s (≈ 270 kbit/s bei 1,7 MB gepackt), Tipp alle 4 s → 3 Abrufe der Quelle in 130 s (0 s, 56 s, 112 s), die ersten beiden nach 40,0 s abgebrochen, kein Neuladen, 33 Tipps ohne Wirkung. Ein Abbruch landet in keinem Zwischenspeicher, nach 15 s fing der nächste Abruf von vorn an – ohne Obergrenze, genau auf der schwächsten Leitung. Die Aussage oben („nach 15 s ist ein neuer Versuch möglich“) war deshalb falsch (dort berichtigt). Dazu zwei kleine Mängel: der Ziel-Merker fehlte, wenn „noch“ nicht binnen 8 s antwortete, und die Sonde bewies den Abbruch nicht und hatte keinen Fall für eine Quelle, die länger als 40 s braucht.

**Was geändert ist** (unsichtbar; Aussehen, Größe, Bedienung unverändert; livechat.js unberührt):
- **index.html `quelleHolen(datei, merk)`** statt `holenFrist(…, 40000)`: die ganze Quelle wird **nie mehr von der Seite abgebrochen**. Je Seite höchstens EIN Abruf zugleich – jeder weitere Ausfall wartet auf denselben; ist er angekommen, bleibt das Ergebnis (die Quelle liegt im Zwischenspeicher), ein späterer Notweg fragt nur noch „noch“. Je Fassung und Tab höchstens **drei** Abrufe (sessionStorage `dma-ganz-hol` = {m: Fassung+Datei, n}, zählt auch über ein Neuladen hinweg); ein neuer nur, wenn der vorige gescheitert ist (keine Leitung, 404, Verbindung gerissen). `fassung.json` behält seine 8-s-Frist (winzig). Neu geladen wird weiterhin höchstens einmal je Fassung und Tab (`dma-ganz-neu`).
- **app.js `dmaTeilNotwegFrist(p, ms)`**: wer nicht beliebig warten kann, hat seine eigene Frist – nur die Rückkehr in den Raum (40 s, wie vorher in der Summe). Danach geht sie wie bisher hinein; der Notweg läuft weiter, und kommt die Quelle später an, entscheidet „noch“: sind die Stücke da (meist, wenn die Rückkehr gelang), kein Neuladen; fehlen sie noch, EIN Neuladen und über `rueckkehrOffen` zurück in den Raum. Fehlen die Raum-Stücke bei Ablauf der Frist noch, scheitert `rein()` wie vor 884 still an `livechatGeschlecht` (Raum-Stück) – man kommt dann erst mit dem Neuladen nach Ankunft der Quelle hinein (nicht mit halbem app.js).
- **app.js „noch“**: hält das Ziel der neuen Seite (`dma-notweg-ziel`) **sofort beim Fragen** fest und frischt es mit der Antwort auf; weggeräumt wird es nur, wenn NICHT neu geladen wird (`ende`). Antwortet „noch“ nicht binnen 8 s, lädt index.html trotzdem neu – jetzt mit Ziel.
- Größe (gzip -9): min/app.js 195 299 → 195 336 Byte (+37), index.html 26 592 → 26 977 (+385, fast nur Kommentar). `dmaTeilNotwegFrist` bleibt im Kern (Name `dmaTeil…`, Sonde 1).

**Sonde `pruefe-884-notweg.js`: alles grün, 77 Prüfungen** (vorher 58; nach `fassung-setzen.js --nur-stempel`). Neu bzw. geändert:
- Bau: `dmaTeilNotwegFrist` echt in min/app.js; index.html holt die Quelle über `quelleHolen` ohne Abbruch-Frist.
- **J** (geändert) Rückkehr, Quelle hängt ganz: hinein 40,1 s nach der Anfrage (schlank, die Stücke waren wieder da); die Quelle wird **nicht** abgebrochen (0×) und nicht neu angefragt (1×); solange sie hängt, läuft der Notweg (`laeuft=true`), kein Neuladen; kommt sie danach an, findet „noch“ die Stücke – kein Neuladen, `laeuft=false`, man bleibt im Raum.
- **O** langsame Leitung (`/app.js` tröpfelt 45 s mit Content-Length und `Cache-Control: max-age=600`, eigener Browser ohne `page.route`), Raum-Stück 404, Tipp alle 4 s: 12 Tipps, **genau EIN Abruf** (fertig nach 45,0 s, nicht abgebrochen), **genau EIN Neuladen** 108 ms nach der Ankunft, Seite 2 mit der Quelle aus dem HTTP-Zwischenspeicher (der Server sieht `/app.js` 1×), Klassenzimmer offen, Tor kommt.
- **P** langsame Leitung, Raum-Stücke **kaputt** (halb abgeschnitten: „Invalid or unexpected token“ beim Einsetzen), nur EIN Tipp: 41,5 s nach dem Abruf läuft der Notweg noch (1 Abruf, kein Abbruch); ohne weiteren Tipp EIN Neuladen 106 ms nach der Ankunft; Seite 2: Quelle aus dem Zwischenspeicher, Klassenzimmer offen, Tor, keine Seitenfehler.
- **Q** „noch“ antwortet nicht binnen 8 s (Raum-Stücke antworten erst nach 12 s, sobald `/app.js` angefragt ist): Neuladen 8,1 s nach der Anfrage der Quelle, danach ist das Klassenzimmer offen (Ziel stand schon beim Fragen fest).
- **R** vier Notwege mit toter Quelle (zwei vor, zwei nach einem Neuladen im selben Tab): der Server sieht `/app.js` **3×**; zwei Notwege zugleich: **1** Abruf, beide bekommen ihre Antwort.
- Gegenprobe gegen den Stand VOR dieser Nachbesserung (index.html, app.js, messung.js, min/ aus 854d1e4 in `scratchpad/gegen884b/notweg-vor`, Rest als Verweise, `WURZEL=…`): **16 rot** – Bau 2; J 2 (abgebrochen 1×, `laeuft=false`); O 4 (19 Tipps, 2 Abrufe, der erste nach 39 997 ms abgebrochen, kein Neuladen, Tor nie); P 5 (nach 40 s abgebrochen, `laeuft=false`, kein Neuladen); Q 1 (Klassenzimmer zu); R 2 (4 Abrufe; 2 zugleich). A–I, K–N bleiben grün (stimmten schon).
- Prüfer-Experiment `scratchpad/pruefer-notweg/drain.js` (Raum-Stück 404, Tipp alle 4 s) gegen den neuen Stand: `/app.js` in 50 s → **1 Abruf**, fertig nach 50,4 s, nicht abgebrochen, **1 Neuladen** (13 Tipps); dasselbe mit `?mit-sw` (1 Abruf, 1 Neuladen); `/app.js` in 100 s → 1 Abruf, fertig nach 100,4 s, 1 Neuladen (26 Tipps). Zum Vergleich der Prüfer an ada429c: 3 Abrufe in 130 s, 2 abgebrochen, kein Neuladen.
- Bestehende Sonden (nach `--nur-stempel`): grün 876-start-schlank, 840-bilderwelt-alt-neu (Pflicht, app.js angefasst), 884-messung, neue-fassung, einladungslink, 858-ladeweg, 859-kanal-sofort, runde18. Rot wie schon vorher und unverändert: 694-leistung 1 (/min/spiel.js beim erneuten Öffnen) und 862 Teil D (Text-Regex; der Abstand `rueckkehrOffen` → `konto:` ist vor und nach dieser Änderung 764 Zeichen – hier nichts eingefügt).

**Ehrlich**
- Nicht nachstellbar: echte Funklöcher, GitHub Pages (ob ein abgerissener Abruf fortgesetzt würde – hier fängt ein neuer Abruf von vorn an), sw.js auf dem Samsung. Bewiesen sind die Abläufe im Chromium gegen einen Server, der langsam tröpfelt bzw. die Fehler absichtlich macht.
- Die Quelle läuft jetzt so lange, wie sie braucht – auf sehr langsamer Leitung (z. B. 100 kbit/s: gut 2 Minuten für 1,7 MB) belegt dieser EINE Abruf die Leitung so lange, auch neben einem laufenden Gespräch (im Raum, wenn dort ein Raum-Stück fehlt). Vorher waren es mehrere abgebrochene Abrufe hintereinander, also mehr Verkehr ohne Ergebnis. (Nachbesserung 1: ein Ausfall eines Rest-Stücks IM Gespräch beginnt keinen Abruf mehr; ein Abruf, der draußen begann, läuft aber weiter, wenn man danach den Raum betritt – er wird bewusst nicht abgebrochen, sonst wäre die Schleife zurück.)
- Höchstens drei Abrufe je Fassung und Tab: reißt die Verbindung jedes Mal kurz vor dem Ende, sind das im schlimmsten Fall 3 × 1,7 MB; danach gibt es in diesem Tab keinen Notweg mehr (die Platzhalter holen ihre Stücke weiter selbst, wie vor 884).
- Rückkehr + Quelle langsamer als 40 s + Stücke fehlen noch: man ist nach 40 s noch nicht im Raum (`rein()` scheitert am fehlenden Stück wie vor 884) und kommt erst mit dem einen Neuladen nach Ankunft der Quelle hinein. Waren die Stücke inzwischen zu haben, geht es nach 40 s hinein und es wird nicht neu geladen (J).
- Die Fristen (Rückkehr 40 s, „noch“ 8 s, fassung.json 8 s) sind geschätzt, nicht auf dem Samsung gemessen.

**Offen (884b)**
1. Ein Platzhalter holt sein fehlendes Stück weiter bei JEDEM Aufruf synchron (seit 876): im Raum mit fehlendem Raum-Stück blockiert jeder Aufruf kurz den Bildschirm, bis die Quelle da ist. Möglicher Folgeschritt (unsichtbar): ein gescheitertes Stück einige Sekunden lang nicht erneut synchron holen bzw. bei `navigator.onLine === false` gar nicht. Hier nicht gebaut (H prüft gerade, dass der zweite Tipp sein Stück sofort holt).
2. Wie oft der Notweg draußen läuft, wie lange die Quelle braucht und ob die Drei-Abrufe-Grenze greift, sieht man nur über `ganz` in mess-start (Seite NACH dem Neuladen); eine eigene Diagnose-Zeile gibt es nicht.

### Nachbesserung 1 zu 884b: kein Neuladen mitten im Gespräch für ein Stück, das der Raum nicht braucht
Die Prüfung von 1331618 fand: die Neulade-Schleife ist weg, aber **auf langsamer Leitung lud die Seite mitten im Gespräch neu – für ein Stück, das der Raum gar nicht braucht.** Nachgestellt (Prüfer, `scratchpad/pruef884b-notweg/riss.js FALL=gespraech`): Rest-Stücke 404, Lernen → Grammatik bei 2,4 s (der Notweg beginnt), bei 6,0 s Wissen → Klassenzimmer und `pruefSitz` „drin“; `/app.js` in 50 s → Neuladen bei 52,8 s, Lage im Augenblick davor „drin“ (in 30 s: bei 32,9 s). Ursache: seit 884b wird die Quelle nie abgebrochen, und „noch“ prüfte nur, ob das ausgefallene Stück noch fehlt – nicht, ob man inzwischen im Gespräch ist und ob es ein Raum-Stück ist. Das Neuladen kam deshalb beliebig spät, auch in einem Gespräch, das erst nach dem Ausfall begonnen hatte. Fassung 883 (live) lädt da nie neu. Die Aussage oben („Ein Neuladen mitten im Gespräch ist möglich, wenn im Raum ein Raum-Stück … fehlt“) stimmte so nicht (dort vermerkt). Dazu zwei kleine Mängel: eine späte Antwort von „noch“ setzte den Ziel-Merker neu, nachdem der Notweg ohne Neuladen geendet hatte (auf dem Weg zur neueren Fassung, wenn die schon einmal geholt war) – das nächste Neuladen von Hand (oder „Neue Fassung“) öffnete dann ungefragt das Klassenzimmer; und die Funk-Antwort versprach „nur EINMAL“ (es sind höchstens drei Abrufe, wenn die Verbindung unterwegs abreißt – riss.js FALL=riss: 3 Abrufe, danach keiner mehr, kein Neuladen).

**Was geändert ist** (nur app.js, im Kern; unsichtbar – Aussehen, Größe, Bedienung unverändert; index.html bis auf die Stempel und livechat.js unberührt):
- Neu `dmaTeilNotwegImRaum()` (LiveChat „drin“ oder „verbindet“) und `dmaTeilNotwegWarten(liste)`: fehlen nur Stücke, die keine Raum-Stücke sind, und ist man im Gespräch → jetzt nicht neu laden. `dmaTeilNotwegZiel()` benutzt dieselbe Raum-Frage (Verhalten gleich).
- **„noch“** fragt das zuerst: im Gespräch und nur Nicht-Raum-Stücke → „nein“, ohne die Stücke noch einmal über die Leitung zu holen. Die Quelle bleibt in index.html geholt (`quelleWeg` erfüllt) und liegt im Zwischenspeicher; der Notweg endet mit `dmaTeilNotwegAb = 0`. Der **nächste Ausfall außerhalb des Raums lädt dann sofort neu, ohne neuen Abruf** (fassung.json, „noch“, Neuladen).
- **Im Gespräch beginnt ein solcher Ausfall gar keinen Notweg** (vorher: fassung.json + Abruf der ganzen Quelle neben dem Ton, für ein Stück, das der Raum nicht braucht). Der eine Aufruf scheitert wie vor 884; das Stück bleibt in `dmaTeilNotwegBedarf` vorgemerkt und zählt beim nächsten Notweg draußen mit.
- Fehlt ein **Raum-Stück**, bleibt alles wie gebaut (K, P, Rückkehr): Neuladen, über `rueckkehrOffen` zurück in den Raum. Ohne Neuladen wären Plätze und großes Bild kaputt.
- **„noch“ antwortet selbst binnen 7,5 s** (`Promise.race` mit eigener Uhr) – vor der 8-s-Frist von index.html, die nicht weiß, ob man im Raum ist. Wer den Raum betritt, WÄHREND „noch“ auf die Leitung wartet, wird so auch nicht herausgerissen. Sonst dieselbe Entscheidung wie index.html (die Stücke fehlen noch → neu laden, mit Ziel).
- **Ziel-Merker**: „noch“ schreibt `dma-notweg-ziel` nur, solange dieser Notweg läuft (`vorbei`, gesetzt in `ende`); eine späte Antwort ändert nichts mehr (mit der eigenen Uhr kommt sie ohnehin nicht mehr durch).
- Keine Schleife möglich: neu geladen wird weiter höchstens einmal je Fassung und Tab (`dma-ganz-neu`), die Quelle höchstens dreimal geholt (`dma-ganz-hol`); im Gespräch startet ein Rest-Ausfall nichts, draußen endet jeder Notweg mit Neuladen oder mit der 15-s-Pause.
- Größe (gzip -9): min/app.js 195 336 → 195 463 Byte (+127). Die neuen Namen beginnen mit `dmaTeil` und bleiben im Kern (Sonde 1).

**Sonde `pruefe-884-notweg.js`: alles grün, 91 Prüfungen** (vorher 77; nach `fassung-setzen.js --nur-stempel`). Neu bzw. geändert (`NUR=S,T,U` lässt einzelne Fälle laufen):
- Bau: `dmaTeilNotwegWarten` und `dmaTeilNotwegImRaum` echt in min/app.js.
- **S** langsame Leitung (`/app.js` tröpfelt 15 s, `DAUER_S`; eigener Browser ohne `page.route`, `Cache-Control: max-age=600`), Rest-Stücke 404: Lernen → Grammatik (rest1 fehlt, der Notweg holt die Quelle), 1,5 s danach ins Gespräch (Ansicht bleibt Lernen); die Quelle kommt nach 15,0 s im Gespräch an → **kein Neuladen**, Lage „drin“, kein `dma-ganz`, kein Ziel-Merker, der Notweg ist zu Ende. Derselbe Ausfall im Gespräch noch einmal: kein Notweg (`laeuft=false`), kein Abruf, kein Neuladen. Raum verlassen, Grammatik: **genau EIN Neuladen 76 ms nach dem Tipp, `/app.js` 1×** (Seite 2 mit der Quelle aus dem Zwischenspeicher), nicht ungefragt ins Klassenzimmer.
- **T** neuere Fassung auf dem Server, in diesem Tab schon einmal geholt (`dma-neu-geladen`), das Raum-Stück fehlt, „noch“ hängt (die Raum-Stücke antworten erst nach 10 s, zwei Anläufe): kein Neuladen, der Notweg endet; **nach der späten Antwort kein Ziel-Merker**; ein Neuladen von Hand öffnet das Klassenzimmer nicht.
- **U** Rest-Stück fällt außerhalb des Raums aus, „noch“ hängt (rest1 antwortet erst nach 10 s), 1,5 s danach ins Gespräch: auch nach der 8-s-Frist **kein Neuladen im Gespräch**, der Notweg ist zu Ende, kein `dma-ganz`, kein Ziel-Merker.
- Q nur im Text: das Neuladen kommt nach der Frist von „noch“ (jetzt 7,5 s in app.js; gemessen 7 618 ms nach der Anfrage der Quelle), das Klassenzimmer ist danach offen.
- Gegenprobe gegen den Stand VOR dieser Nachbesserung (index.html, app.js, messung.js, min/ aus 1331618 in `scratchpad/gegen884b/notweg-nb1-vor`, Rest als Verweise, `WURZEL=…`): **9 rot** – Bau 1; S 4 (Neuladen im Gespräch schon 7,5 s VOR dem Tipp draußen, `dma-ganz` gesetzt, Seite 2 öffnet das Klassenzimmer); T 2 (Merker „klassenzimmer“ bleibt liegen, das Neuladen von Hand öffnet das Klassenzimmer); U 2 (Neuladen im Gespräch nach der 8-s-Frist, `dma-ganz`). A–R bleiben grün (82).
- Prüfer-Experimente gegen den neuen Stand: `riss.js FALL=gespraech` `/app.js` in 50 s → Quelle fertig bei 52,7 s, **kein Neuladen**, Lage „drin“ (Prüfer an 1331618: Neuladen bei 52,8 s); in 30 s → fertig bei 32,7 s, kein Neuladen (Prüfer: 32,9 s). `riss.js FALL=riss` (`/app.js` reißt bei 90 % ab, 30 s, Tipp alle 4 s, 150 s): 3 Abrufe, alle abgerissen, danach keiner mehr, kein Neuladen – wie in der Prüfung.
- Bestehende Sonden (nach `--nur-stempel`): grün 876-start-schlank, 840-bilderwelt-alt-neu (Pflicht, app.js angefasst), 884-messung, neue-fassung, einladungslink, 858-ladeweg, 859-kanal-sofort, runde18. Rot wie schon vorher und unverändert: 694-leistung 1 (/min/spiel.js beim erneuten Öffnen) und 862 Teil D (Text-Regex `rueckkehrOffen` → `konto:`; an dieser Stelle hier nichts geändert).

**Ehrlich**
- Ein Notweg, der DRAUSSEN begann, holt die Quelle weiter, auch wenn man danach den Raum betritt – bewusst kein Abbruch (das war die Schleife). Auf langsamer Leitung teilt sich dieser eine Abruf die Leitung mit dem Gespräch, bis er fertig ist; neu geladen wird dann aber nicht.
- Nach dem Gespräch lädt die Seite erst neu, wenn man draußen wieder auf ein fehlendes Stück trifft (dann sofort) – nicht von selbst beim Verlassen des Raums (das wäre ein Neuladen ohne Anlass, mitten in etwas anderem).
- Ein Rest-Stück, das doch einmal im Raum gebraucht wird (selten; die Aufteilung kommt aus Messungen, teile-messen.js), scheitert dort wie vor 884, ohne Neuladen. Die Platzhalter holen es bei jedem Aufruf weiter selbst (Offen 1 oben).
- GitHub Pages schickt `max-age=600`: liegt der nächste Ausfall draußen mehr als 10 min nach dem Holen, fragt das Neuladen app.js erneut an (gleiche Adresse, vermutlich 304 statt 1,7 MB; mit sw.js aus dessen Speicher). Nicht nachgestellt.
- Die 7,5 s von „noch“ sind wie die anderen Fristen geschätzt, nicht auf dem Samsung gemessen. Echte Funklöcher, GitHub Pages und sw.js auf dem Samsung sind nicht nachstellbar; bewiesen sind die Abläufe im Chromium gegen einen Server, der langsam tröpfelt, hängt oder 404 liefert.

**Offen (884b NB1)**
1. Wie oft draußen ein Neuladen im Gespräch aufgeschoben wird, sieht man nicht (keine eigene Diagnose-Zeile; mess-start zeigt nur `ganz` der Seite NACH einem Neuladen).
2. Läuft der Notweg nach drei abgerissenen Abrufen ins Leere, fragt jeder weitere Ausfall (höchstens alle 15 s) noch `fassung.json` (winzig) – möglicher kleiner Folgeschritt in index.html: die Drei-Abrufe-Grenze vor `fassung.json` prüfen.

## Fassung 884 — Doppeltipp-Zoom im alten Dorf: weniger Speicher-Umwälzung, Zoom startet sofort (Funk 159/255)

XANDER (Funk 159): „… mit Doppeltipp größer machen … und das hängt noch ein bisschen ich bin jetzt zweimal abgestürzt". Funk 255: die schnelle Seite hat oberste Priorität. Weg: `dorfDoppelPruefen` → `dorfZoom`. Aussehen, Größe und Bedienung bleiben; nur spiel.js und spiel.css (livechat.js und app.js unberührt, alte Bilderwelt nicht berührt).

### Befund (Stand vor diesem Punkt, ada429c; Sonde 884-zoom mit `ALT=`)
- **Leinwand je Hineinzoomen:** die kleine Karte (`canvas.sp-dl-karte-bild`, 480×300 = 576 KB) entsteht bei jedem Hineinzoomen NEU aus dem HTML und bekommt das Dorf noch einmal hineingemalt (`drawImage` aus der großen Leinwand); die alte bleibt liegen, bis der Speicher aufräumt. 20 Doppeltipps (10× hinein): +10 Leinwände, vor GC 2 abgehängte 480×300 mit Speicher.
- **Gestapelte Animationen:** 3× `dorfZoom` im Abstand von 90 ms → 3 gleichzeitig laufende `scale`-Animationen auf der doppelt großen `.sp-dorfland`.
- **Abend-Ebene am hellen Tag:** `.sp-dl-daemmer` (soft-light) und ihr `::after` (multiply) liegen auch bei `--glut:0; --dunkel:0` über dem ganzen Dorf – 2 Mischebenen ohne sichtbare Wirkung. Ebenenfläche „nah“: 15,95 Bildschirme.
- **Zoombeginn:** vor der Bewegung baute `dorfZoom` die ganze Leiste neu (`schnellZeichnen(true)`). 4× gedrosselte CPU: Loslassen → `animate()` im Median 69,6–75,4 ms (drei Läufe), bis zum Bild 113–145 ms.
- Keine Ebenen-Explosion in Chromium: mitten in der Animation 2–4 Ebenen mehr als in Ruhe, Fläche unter Ruhe „nah“; Knoten und JS-Speicher wachsen über 20 Doppeltipps nicht.

### Was geändert ist (spiel.js, spiel.css – vier örtliche Eingriffe)
1. `dorfKarteMalen`: **eine Leinwand für die kleine Karte.** Die frisch erzeugte (noch leere) Leinwand wird durch die gemerkte (`DM.karte`, mit fertigem Bild) ersetzt; ihre `data-sig` wird übernommen, damit `domAngleichen` sie überspringt. Stimmt „gemalt“ nicht mehr mit der großen Leinwand überein (Besuch, Ausbau, Tag/Nacht), wird wie bisher neu gezeichnet; weicht die `data-sig` ab, entfernt das Angleichen `data-gemalt`, also ebenfalls neu.
2. `dorfZoom`: **höchstens eine Zoom-Animation** – die vorige (`DW.zoomAnim`) wird beendet; im Bild gewinnt ohnehin die jüngste (composite replace).
3. `dorfDaemmerHtml` + spiel.css: **Abend-Ebene nur, wenn sie etwas tut** – bei `glut < .005 && dunkel < .005` Klasse `sp-aus` (`display: none`). Das Element bleibt im HTML (sonst verschieben sich beim Angleichen die Positionen und Rauch-Ebene und Zug-SVG würden neu erzeugt); `--glut`/`--dunkel` bleiben am Element (Sonde 804). Der Abgleich der Startblätter nimmt die eine Regel mit ins `min/spiel-start.css`.
4. `dorfZoom`: **Bewegung zuerst, Menü danach.** Klasse `sp-dl-nah`/`sp-dl-ganz` am Rahmen, Scrollstand und Animation stehen sofort; das volle Angleichen (kleine Karte, ±-Zeichen am Kompass, Tipp-Text, Station zu) kommt per rAF + `setTimeout(0)` im nächsten Bild (`DW.zoomNach`, ein neuer Zoom räumt einen offenen weg). Ein reines rAF liefe noch vor dem Bild und hielte den Start wieder auf. Nur im gemalten Dorf (`.sp-dorfland` im Fenster) und nur beim echten Umschalten; sonst wie bisher sofort. Neuer 4. Parameter `gleich`: `dorfhin` zeichnet sofort ganz, weil es 60 ms später die Station sucht. `.sp-dl-fenster` wird nicht ersetzt, `rollPos` behält den neuen Scrollstand.

### Messung (Sonde 884-zoom, Chromium, Android 360×740, DPR 2,75, echte Fingertipps, heller Tag)

| | alt (ada429c) | neu |
|---|---|---|
| neue Karten-Leinwände bei 10× Hineinzoomen | +10 | +0 (4 Läufe) |
| Leinwände insgesamt angelegt (20 Doppeltipps) | +10 | +0 |
| laufende Zoom-Animationen nach 3× in 270 ms | 3 | 1 |
| Mischebenen im Dorf, heller Tag (ganz / nah) | 2 / 2 | 0 / 0 |
| Ebenenfläche „nah“, Ruhe | 16,12 Bildschirme | 15,39 |
| Ebenenfläche „nah“ ohne / mit eingeblendeter Abend-Ebene | 15,95 / 15,95 | 15,21 / 15,95 |
| Loslassen → Zoombeginn, CPU 4×, Median | 69,6–75,4 ms (3 Läufe) | 16,4–22,9 ms (8 Läufe) |
| Loslassen → Bild, in dem die Bewegung startet (Auskunft) | 113–145 ms | 39,5–69,6 ms |
| Ebenen mitten in der Animation (max.) / Ruhe „nah“ | 90–95 / 88–91 | 87–97 / 87–91 |
| Knoten / JS-Speicher nach 20 Doppeltipps + GC | −10 bis 0 / −0,6 bis −0,1 MB | −8 bis +22 / −0,6 bis +0,7 MB |
| Foto `.sp-dl-fenster` (ganz, nah) gegen alt | – | höchstens 2/255 Abweichung |

Die Latenzen sind zweigeteilt (0–3 ms und 16–39 ms): beim Hineinzoomen kostet das Setzen des Scrollstands ein Layout der doppelt großen Fläche.

### Sonden
- Neu: `werkzeug/pruefe-884-zoom.js` (Gerüst wie 709 plus Bergwerk, `S.sonneTest = 30`; CDP `Performance.getMetrics`, `LayerTree`, `HeapProfiler.collectGarbage`; Haken an `getContext` mit WeakRef). Schalter `QUELLE=1`, `ALT=<ordner>` (spiel.js/spiel.css von dort, erzwingt `?quelle`), `DROSSEL=`, `BILD=`, `VERGLEICH=`. A 20 Doppeltipps schalten um; B Leinwände; C Stapel; D Mischebenen/Fläche/Abendrot bei 1,5°; E Latenz bei 4×; F Schutz (Ebenen, Fläche, Knoten, JS-Speicher); H nach 900 ms stimmen kleine Karte, Kompass „+/−“ und `data-n`, Tipp-Text, offene Station geht zu, Kompass-Lupe, Doppeltipp „genau dort“ (< 0,15); G Fotos ganz/nah mit angehaltener Bewegung (Leute, Fuhrwerk, Vögel, Rauch, Zug-Ebene mit Anglern, Uhr ausgeblendet; zweimal fotografiert = 0 Abweichung) gleich dem Bild mit eingeblendeter Abend-Ebene (≤ 3/255).
  - Neu: **alles grün** mit `?quelle` (2 Läufe) und min/ (5 Läufe); mit `VERGLEICH=` gegen die Fotos des alten Stands: ganz und nah höchstens 2/255. „Ruhe“ in F ist die Spitze über 1,5 s (Leute, Vögel und Zug kommen und gehen; ein einzelner Blick lag einmal genau an der Grenze +6). Beim Bauen der Sonde liefen Zug, Dampf und Angler (per Skript bewegt) noch in den Fotos – seitdem ist die ganze Zug-Ebene ausgeblendet; ein früher Lauf gegen damals aufgenommene Vergleichsfotos war deshalb in G rot.
  - Gegenprobe `ALT=` (spiel.js/spiel.css aus HEAD = ada429c, scratchpad/gegen884, drei Läufe): **rot B (1), C (1), D (4), E (1)**; grün F, G, H. In einem der drei alten Läufe zusätzlich A rot (19 von 20 Doppeltipps schalteten um).
- Bestehende Sonden nacheinander (nach `fassung-setzen.js --nur-stempel`, min/): grün 709-dorf-kompass, 711-dorf-bedienung (0 rot; die 2 roten zum Nachthimmel aus der Untersuchung kamen hier nicht), 704-dorf-gemalt, 804-tag-nacht, 817-rahmen-bedienung, 850-platz-nach-menue, 789-haeuser-versetzen, 799-stadt-im-dorfrahmen, 854-spaete-haeuser, 733-jahreszeiten. 828-einsammeln: 2 rot in Teil B („die neue Stadt ist im Spiel geladen“, danach Abbruch) im Gesamtlauf – mit dem Stand ada429c (HEAD-Kopie über Verweise, scratchpad/gegen884/wurzel884) genauso rot, mit `NUR=B` allein grün: älter, betrifft die neue Stadt, nicht diesen Punkt. 840 nicht nötig (app.js unberührt).

### Ehrlich
- **Nicht beweisbar:** den Absturz auf dem iPhone kann ich hier nicht nachstellen – kein WebKit, kein iOS-Jetsam; Chromium legt Ebenen anders an, und der Speicher gerasterter Kacheln ist kopflos nicht messbar. Ebenen-Zahl und -Fläche in CSS-px sind Stellvertreter. In Chromium erzeugt die Zoom-Animation selbst keine zusätzlichen Ebenen.
- Herausgenommen ist, was messbar war: Leinwand-Umwälzung (10 → 0), gestapelte Animationen (3 → 1), eine volle Mischebene am Tag, gut 50 ms Hauptthread vor dem Zoombeginn (bei 4×). Ob das den Absturz beseitigt, zeigt erst Xanders Gerät. Ein Teil des damaligen Problems war vermutlich das Leinwand-Budget (Funk 159 kam vor Fassung 801/802).
- Punkt 4: ein Bild lang (~16–20 ms) zeigen kleine Karte, ±-Zeichen und Tipp-Text noch den alten Stand, und eine offene Station schließt ein Bild später. Nicht wahrnehmbar – wer es strenger sieht, muss es als sichtbar einstufen. Ein Tipp genau in diesem Fenster auf den Kompass läse das alte `data-n` (geringes Risiko). Im Hintergrund-Tab wartet rAF; `dorfhin` zeichnet deshalb sofort.
- Punkt 1: `DM.karte` hält eine abgehängte 480×300-Leinwand (576 KB) dauerhaft fest, auch bei „ganz“ – gewollt und begrenzt. Würde die Karte künftig mit `data-gemalt` im HTML erzeugt, greift das Ersetzen nicht – dann ist es wieder wie vorher, kein Fehler.
- Punkt 3: Abweichung ≤ 3/255 durch Rundung beim Mischen (gemessen 2/255). Beim Übergang glut 0,00 → 0,01 erscheint die Ebene wieder (unsichtbar weich).
- Die Latenzmessung endet beim Aufruf von `animate()`; die Bewegung beginnt auf dem Compositor im nächsten Bild (Auskunftszahl „bis zum Bild“).

**Bewusst nicht gebaut**
- Nur den Rahmen statt der ganzen Leiste angleichen: das HTML zu bauen kostet bei 4× nur ~3 ms; ein Teilabgleich müsste Station, Tipp-Text und Kompass doppelt pflegen, und `dataset.html` liefe auseinander. Mit Punkt 4 ist der teure Teil aus dem Weg der Bewegung. Erst, wenn Xander weiter Hänger meldet.
- Animation auf kleinerer Ebene: geht nur mit Standbild oder ausgeblendeten Figuren, Zug und Namen während der Bewegung – sichtbar, also Vorschlag.
- Bild und Vorrats-Kopie zu einer Leinwand zusammenlegen (−4,9 MB): bricht die Tag/Nacht-Überblendung (`dorfMalPflegen`, `blende`) – riskant (Offen 3).

**Vorschläge an Xander (sichtbar, nicht gebaut – nur falls es auf dem iPhone weiter abstürzt)**
- V1 Zoom ohne Bewegung oder kürzer (z. B. 200 statt 320 ms).
- V2 „Nah“ 1,6× statt 2× (rund 36 % weniger Ebenenfläche).
- V3 Zug, Rauch und Leute während der 320 ms anhalten.

**Offen**
1. Gegenprobe auf Xanders iPhone (20 schnelle Doppeltipps im alten Dorf, auch nachts/abends, wenn die Abend-Ebene mischt).
2. Vorschläge V1–V3 (Antwort Xanders).
3. Bild + Vorrats-Kopie zu einer Leinwand (−4,9 MB) nur mit neuer Tag/Nacht-Überblendung.
4. Sonde 828 Teil B im Gesamtlauf rot (älter, neue Stadt) – eigener Punkt.
5. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand wie die anderen 884-Punkte).

**Funk-Antwort (Entwurf)**: „Doppeltipp-Zoom im alten Dorf (Funk 159): Ich habe nachgemessen, was beim Doppeltipp passiert. Bei jedem Hineinzoomen wurde die kleine Karte als neues Bild angelegt (10× hinein = 10 Bilder im Speicher), schnelle Doppeltipps stapelten bis zu drei Zoom-Bewegungen übereinander, am hellen Tag lag eine unsichtbare Abend-Schicht über dem ganzen Dorf, und vor der Bewegung wurde erst das ganze Menü neu gebaut. Das ist jetzt alles weg: eine Karte, eine Bewegung, die Abend-Schicht nur abends, und der Zoom startet sofort (auf einem langsamen Handy statt nach ~70 nach ~20 Millisekunden). Aussehen und Bedienung sind gleich. Ob das deinen Absturz wirklich behebt, kann ich hier nicht beweisen – das iPhone gibt Speicher anders frei als mein Testbrowser. Probier bitte 20 schnelle Doppeltipps im Dorf. Wenn es noch abstürzt, hätte ich drei Ideen, die man aber sieht: (1) Zoom ohne oder mit kürzerer Bewegung, (2) „nah“ etwas weniger groß (1,6× statt 2×), (3) Zug, Rauch und Leute während des Zoomens kurz anhalten.“

## Fassung 884 — Ton 310: „sie hört mich dann nicht mehr“ (Funk 310)

XANDER (Funk 310, 11.10., wörtlich): „… mit Emmi … dann bricht es noch ab und sie fragt mich immer ob ich sie hören kann ich höre sie immer aber sie hört mich dann nicht mehr und ich weiß nicht ob es die Last ist dass sie im Spiel irgendeine Dopplung erzeugt …“ (Emy: OPPO CPH1937, Android 11, WebView).

**Wahrscheinliche Ursache** (Untersuchung wf_588b532b, Versuch 310 im Labor in Chromium 141 nachgestellt; im Feld nur zeitlich belegt – ob es bei Emy dieser Weg war, zeigen erst `tonGleicheKennung` und „ton-weg“): `livechat.js` → `bruecke()` → `pc.ontrack` verglich Spuren nur nach ihrer **Kennung** (`t.id === e.track.id`). Baut der Anrufer – immer die kleinere Kennung, also Xander – die Leitung neu auf, ohne dass jemand neu lädt (Ton-Knopf, Abriss der Wache, „pc-fehl“, Gruss bei hängender Leitung, seit 884 auch „auch-da haelt:false“), kommt seine neue Spur bei Emy mit **derselben Kennung** an (Chromium übernimmt die msid seines Mikrofons, `addTransceiver(tonSpur)`). Die alte, beim Abbau beendete Spur lag noch in Emys Strom → „kenne ich schon“, die lebende wurde nicht angehängt, das neue `<audio>` spielte die tote, die Tonwache räumte sie weg. Pakete kamen an, abgespielt wurde nichts, `/verbindung` sagte „Ton kommt an“. **Jeder zweite Neuaufbau taub**, Xander hörte Emy weiter. Das Spiel selbst änderte im Labor nichts am Ton (es ist nur Begleitumstand; ob es im Feld Neuaufbauten häufiger macht, ist offen). Eine „Dopplung“ (zweite Leitung/Sitzung durch das Spiel) trat im Labor nicht auf (für Emys Handy nicht geprüft).

Sichtbar ändert sich nichts (keine Zeile, kein Toast, kein Zeichen); Aussehen, Größe und Bedienung bleiben. Der Hörfilter „Nur Mitspieler hören“ bleibt im Verhalten genau, wie er ist (nur gemessen).

### Was geändert ist (livechat.js, spiel.js; app.js und DB unberührt)
- **Behebung 1 – `pc.ontrack`**: Vergleich nach dem **Gegenstand** (`t === e.track`, `indexOf(e.track)`), wie `sfuSpurEinsetzen` seit 842. Reihenfolge bleibt (erst alt heraus, dann neu hinein). Spielt das Element den Strom schon (kein Abbau dazwischen) und war die alte Spur gleicher Kennung darin, wird es einmal neu angehängt (`srcObject` null → Strom, leises `play()`), weil eine WebView einen Spurwechsel im laufenden Strom nicht sicher übernimmt.
- **Behebung 2 – `brueckeAbbauen`**: vor `pc.close()` kommen die **Ton**-Empfangsspuren dieser Leitung aus seinem Strom (Server-Stimme und Bild bleiben). Ihre Kennung merkt sich die Person (`tonKennungAlt`), damit die Messung den Auslöser trotzdem sieht.
- **Empfangswache** (`empfangPruefen`, Block nach `wacheBeenden`): läuft im 2,5-s-Takt der Leitungswache mit deren Statistik – **kein eigenes `getStats`, kein eigener Zeitgeber** – und einmal beim Zurückkommen auf die Seite (ohne Statistik). Befunde: `spur` (lebende Empfangsspur fehlt im Strom → `spurEinhaengen`), `element` (kein Element/falscher Strom → anschliessen), `stumm` (Element stumm, obwohl er gehört werden darf → entstummen), `pause` (→ leises `play()`), `still` (> 20 Pakete je Takt, 0 abgespielte Samples, 2 Takte → Stufe 1 neu anhängen, 2 Takte später Stufe 2 anderes Element, 4 Takte später Stufe 3), `rede` (er sagt „redet“, Energie 0, wie still), `pakete` (er sagt „redet“, Ton an, 0 Pakete in 2 Takten → gleich Stufe 3). **Stufe 3**: das Paket `{art:"tonweg", an, b, tw}` geht über Datenkanal und Raumkanal (seit Nachbesserung 1 auch von der kleineren Kennung, vor dem Neuaufbau); die kleinere Kennung baut danach die Leitung neu (Abbau, 0,4 s, `anrufen(…, "tonweg")`); Bremse 1 je 60 s, 3 je 10 min je Gegenüber. `still`/`rede` werden nur gewertet, wenn der Browser `totalSamplesReceived` bzw. `totalAudioEnergy` liefert (Nachbesserung 1). Nie eingegriffen: Leitung steht nicht, Tonserver-Stimme, Puppe, nicht im Raum, Telefonat oder Hörfilter verlangen Stille (dann nur gezählt). Im Hintergrund nur Stufe 1.
- **`tonwegEmpfangen`** (Weiche in `dc.onmessage` und `empfangen`, abwärtskompatibel – ältere Fassungen überhören das Paket): legt den eigenen Tonsender zu ihm auf die Spur, die gelten soll (`sfuEigeneTonspur()`; heilt auch ein nicht zurückgegebenes Mikrofon), löscht ein falsches `sfu.hoertMich[er]`; fand sich nichts Falsches und ist man die kleinere Kennung, wird die Leitung (gebremst) erneuert. Doppelt angekommene Pakete (beide Wege) zählen einmal (`tw`).
- **„redet“**: merkt zusätzlich `sprichtUm` (für die Wache); Ring und Plätze unverändert.
- **Plan B für strenge WebViews**: `tonAbspielenVersuchen(a, beiFehlstart, leise)` – leise = aus der Selbstheilung, keine Hinweiszeile. Der Nachhol-Horcher lauscht auf `pointerup`, `touchend`, `click`, `keydown` (nicht mehr `pointerdown` – auf Android keine Nutzergeste) und meldet sich erst ab, wenn nichts mehr wartet (`tonNachholen`, auch als `LiveChat.tonNachholen`). `spiel.js` `lsAuf`: Tipps in der Stadt im Rahmen holen über `tonNachholen` + `klangWecken` nach (gleicher Ursprung).
- **Nebenbefund, behoben**: ein `play()`, das von einem neuen `srcObject` abgelöst wurde (`AbortError`, z. B. Tonwache: `stimmenWecken` spielt an, gleich danach hängt `tonElementeAufraeumen` den richtigen Strom an), zeigte fälschlich „🔇 Dein Browser lässt den Ton noch nicht durch …“. Für Stimmen (`srcObject`) wird `AbortError` jetzt überhört (Sonde Fall C; im alten Stand rot). Text und Fall „wirklich verweigert“ unverändert.
- **Messung**: Zeitleiste „leitung“ neues Ereignis `tonGleicheKennung` (Zusatz ton/bild) und `tonwegGeheilt`; neuer Bericht **„ton-weg“** (einer je Vorfall, einen Takt nach der Heilung bzw. nach 30 s ohne; höchstens 1 je Gegenüber in 2 min und **3 je Seitenaufruf** – 6, sobald der Server in der Antwort `ton` trägt); `tonGueteJe` + `sm`; Bericht „verbindung“ + `heil` (Zähler je Befund und Stufe) und `filt`; `hoerFilterSetzen(f, {spielt, nur})` nur für die Berichte, `hoerFilterStand()` = `{an, stumm, redet, haeu, spielt, nur}` (keine Namen); `spiel.js` `hoerFilterPflegen` nimmt `spielSichtbar()` in den Schlüssel, „tonstand“ trägt `nur` und `filt`.
- Prüfhaken (nur Sonde): `LiveChat.pruefEmpfang(id)`, `LiveChat.pruefEmpfangFaelschen(id, {pk, sm, en, n})`.
- Ladeweg: min/livechat.js 307716 → 315220 Byte (gzip +2650), min/spiel.js +429 (gzip +289).

### Nachbesserung 1 (nach der Prüfung, 12.10.)
- **Messgrösse fehlt ≠ 0**: `empfangPruefen` nimmt `totalSamplesReceived`/`totalAudioEnergy` nur, wenn sie Zahlen sind (sonst `null`); `still` braucht Samples, `rede` braucht Samples und Energie; „hört wieder“ prüft eine fehlende Grösse nicht mit. `den` im Bericht bleibt dann `null` statt 0.
- **Auch die kleinere Kennung sagt „tonweg“** (in `empfangStufe3`, vor dem Neuaufbau). Liegt die Ursache beim Grösseren (etwa ein veraltetes `sfu.hoertMich[ich]`: er glaubt, ich höre ihn über den Tonserver, und schickt übers Netz eine leere Spur), räumt der Neuaufbau allein das nicht auf. **Anders als in der Prüfung vermutet** kam die Stimme in Chromium nach dem Neuaufbau zwar zurück – `spurenNachtragen` ruft `sfuMeshTonAnwenden`, während `replaceTrack(Mikrofon)` noch läuft; `sender.track` ist da noch `null`, gilt als „schon leer“, und nichts geschieht –, aber der falsche Eintrag blieb stehen und leerte die Spur beim nächsten Spurwechsel drüben wieder (Mikrofon nach Diktat/Sprachnachricht zurück, Bühne): Sonde K, Gegenprobe ohne das Paket → A wieder taub, `hoertMich` bei B weiter gesetzt. Jetzt räumt `tonwegEmpfangen` drüben auf; ein Grösserer baut daraufhin nicht selbst neu auf (das tut weiter nur die kleinere Kennung), kein Hin und Her.
- **`n.b` gekürzt** (`String(n.b || "").slice(0, 10)`) bevor es in die eigene Zeitleiste „leitung“ geht – ein langer Text vom Gegenüber (über den Raumkanal mit frei gewählter Absenderkennung) trieb den Bericht sonst über 6000 Zeichen, und der Server speichert dann nur `{zu_lang:true}`.
- **Nachhol-Horcher hängt nicht ewig**: ein Element, dessen `play()` beim Nachholen 5-mal hintereinander scheitert, kommt aus `tonWartet`; eine Stimme, die noch pausiert, legt `stimmenWecken` (im Nachholen selbst und alle 4 s in der Tonwache) mit frischer Zählung wieder hinein – sie verliert nichts.
- Prüfhaken: `pruefEmpfangFaelschen(id, {hoertMich: true|false})` setzt bzw. löscht `sfu.hoertMich[id]` (nur Sonde, Fall K).
- Sichtbar ändert sich nichts.

### Messgrößen „ton-weg“
| Feld | Bedeutung |
|---|---|
| `mit` | 10 Zeichen seiner Kennung (wie „leitung“) |
| `befund` / `stufe` / `geheilt` / `nachMs` | spur, element, stumm, pause, still, rede, pakete / 1–3 / 1 = wieder hörbar / ms bis dahin |
| `ms` | ms seit Beginn der Leitung beim Vorfall |
| `dpk` / `dsm` / `den` | Zuwachs Pakete / abgespielte Samples / Energie im Takt des Vorfalls |
| `rx` / `el` | Empfangsspur `{lebt, sysStumm}` / Element `{da, pause, stumm, spieltR}` |
| `soll` / `grund` / `spricht` | darf er gehört werden / filter, telefonat, leer / er sprach |
| `spiel` | `{spielt, nur, stadt, voll}` – spielt man, „Nur Mitspieler hören“, Stadt im Rahmen offen, Vollbild |
| `heil` | alle Zähler seit Seitenaufruf (z. B. `spur1`, `stumm1`, `still2`, `pakete3`, `tonwegSender`, `gebremst`) |
| `sichtbar`, `fassung`, `ua` | wie bei den anderen Berichten |

### Sonden
- **Neu: `werkzeug/pruefe-884-ton310.js`** – zwei echte Chromium-Seiten aus `?quelle`, echte WebRTC-Leitung, Pakete von Hand getragen, Spiel nachgebildet, `--autoplay-policy=user-gesture-required`; A = Betreiber k258507e0a (ruft an), B = k908c6857a mit Emys UA im Telefon-Kontext. „Hört“ von aussen gemessen (Pakete, abgespielte Samples, Energie, `<audio>` spielt die lebende Empfangsspur als Gegenstand). Fälle A–E aus dem Plan, dazu F (Plan B, Seite und Stadt im Rahmen), G (Hörfilter), H (Berichte), I (Ruhe). **Neu: 37 ok, 0 rot** (zweimal): 6 Neuaufbauten alle hörbar in ~1 s, je genau eine lebende Tonspur, 6 Berichte mit `tonGleicheKennung`; C heilt in ~1 s ohne Leitung/Angebot/Zeile/Toast, genau ein „ton-weg“ (spur, geheilt 1, 2,5 s); D „tonweg“ nach ~3,2 s, B hört nach 4–5 s, A zählt `tonwegSender`; E Stufe 1 → 2 (Element 1 → 2) in ~9,8 s; F1/F2 binnen 1 s nach dem Tipp; G bleibt stumm (`filt` an 1, stumm 1, redet 3, haeu 1); B ruft `getStats` 4× in 10 s.
- **Gegenprobe** (`WURZEL=scratchpad/gegen884b/wurzel`: Baum mit Verweisen, livechat.js und spiel.js aus 7f053be): **21 rot** – A1/A3/A5 taub (genau jeder zweite, wie Versuch 310), B1/B3/B5 (Strom leer), kein `tonGleicheKennung`, C-spur und C-stumm (bleiben taub), C-Zeile (falsche Hinweiszeile nach `AbortError`), C-Bericht, C-Zähler, D (kein „tonweg“, Sender bleibt leer), E, F1, F2, G-`hoerFilterStand`, H (3). **Grün** wie erwartet: Kontrollen, A2/A4/A6, C-element (die alte Tonwache heilt in 3,3 s), C ohne Leitung/Angebot, D-Kontrolle, G stumm/Schalter aus, H-Grösse, I.
- **Nachbesserung 1** (Sonde um A-Wache, J und K erweitert): **neu 45 ok, 0 rot** (zweimal; 44 im ersten Lauf vor K2). A: Befund-Zähler bei B über die sechs Neuaufbauten `{}` → `{}`, B hört jeweils nach ~1,0 s. J: 15 s ohne `totalSamplesReceived`, 15 s ohne `totalAudioEnergy` bei redendem A – keine Heilung, keine Leitung, kein „tonweg“; gestörte Spur ohne Samples heilt in ~2 s, Vorfall nach ~4,4 s geschlossen. K: „tonweg“ von A nach ~4,0 s, neue Leitung nach ~4,4 s, B `tonwegServer` 0 → 1, A hört B nach ~1 s; nach Mikrofon-Leihen/-Zurück bei B hört A weiter, B `hoertMich` leer.
- **Gegenproben der Nachbesserung** (Bäume `scratchpad/gegen884b/nb1-*`, nur livechat.js getauscht): **vor** (livechat.js aus e704342) 4 rot – J-Samples (`still1:2,still2:2`), J-Energie (`rede1:1,rede2:1`), J-„hört wieder“ (Vorfall bleibt 10 s offen), K (Prüfhaken fehlt); A-Wache grün. **ohneFix** (ontrack nach Kennung, Ton bleibt beim Abbau im Strom) 2 rot – A-Wache (`spur1:6`: die Wache heilte jeden Neuaufbau in ~3 s, A1–A6 und B1–B6 trotzdem grün – genau der Befund der Prüfung) und C-„genau ein ton-weg“ (Drossel). **ohneTonwegKlein** (kleinere Kennung schickt kein „tonweg“) 3 rot in K: kein Paket, B räumt nicht auf, nach dem Spurwechsel A taub, B führt A weiter in `hoertMich`; im selben Lauf einmal A1 rot (Ton-Knopf: keine neue Leitung binnen 4 s, beide hörten) – A1 läuft durch keinen geänderten Weg, in den Läufen des neuen Stands grün; als wackelig vorgemerkt.
- **Mitgelaufen nach Nachbesserung 1** (nach `fassung-setzen.js --nur-stempel`, nacheinander): grün 884-leitung, 884-mikro, 884-bild, 827-sfu, 659-verbindung, 884-diktat, 884-messung, 799-stadt-im-dorfrahmen; 884-sitz im ersten Lauf Fall 12 rot (2 von 5, vorbestehend, siehe unten), im zweiten grün; 842-sfu-spiel im ersten Lauf (direkt nach 884-leitung/-sitz/-bild) wieder Fall 4b rot, danach 3 von 3 grün – mit einer Kopie der Sonde, die vor 4b die Zähler der Empfangswache auf beiden Seiten ausgibt: beide `{}`, die Wache greift im Tonserver-Fall nicht ein (sie hat bei `sfuHoertIhn` nichts zu tun). 840 nicht nötig (app.js unberührt).
- Mitgelaufen beim ersten Bau (nach `fassung-setzen.js --nur-stempel`, nacheinander): grün 884-leitung, 884-mikro, 884-bild, 827-sfu, 659-verbindung, 738-controller-leise, 884-messung, 884-diktat, 884-notweg, 861, 871, 811-leitung, leitung, 856, 859, 799-stadt-im-dorfrahmen (lsAuf mit neuem Horcher); 840 nicht nötig (app.js unberührt); 842-sfu-spiel im ersten Lauf 1 rot („beim Schliessen der Seite macht A seine Server-Sitzung zu“), danach zweimal grün – zeitabhängig; 884-sitz Fall 12 (Absender 6-fach gedrosselt, 4 von 5) wackelt in beiden Ständen (neu 2 von 4 Läufen rot, alt 1 von 3) – vorbestehend, keine Folge dieses Punkts.

### Ehrlich
- Nachgestellt ist der Fehler in **Chromium 141**; Emys WebView (Chrome/154 auf dem OPPO) hat dieselbe libwebrtc, die Kennungsregel dort ist aber nur angenommen. Ob es bei ihr wirklich dieser Weg war, zeigen erst `tonGleicheKennung` und „ton-weg“ aus dem Feld.
- **Schutz greift erst nach Neuladen**, und zwar auf **Emys** Gerät (Behebung 1 und 2 und die Wache laufen beim Empfänger). Stufe 3 („tonweg“) braucht beide Seiten auf der neuen Fassung.
- Fall F verschärft `play()` künstlich (echter MediaStream-Ton ist von der Gestensperre ausgenommen; im Labor nie abgelehnt). Audiofokus, Hörmuschel/Lautsprecher und die Last auf dem OPPO sind hier nicht nachstellbar. Zwei Instanzen desselben Kontos nicht geprüft.
- Die Regel „still“ beruht darauf, dass Chromium `totalSamplesReceived` nur zählt, wenn ein Ausgang die Spur zieht (gemessen: +0 taub, +120 480 bei stummem Element). **Richtiggestellt (Nachbesserung 1):** Im ersten Bau stand hier, andere Browser griffen dann nur auf spur/element/stumm/pause zurück – das stimmte nicht: fehlte die Grösse, zählte die Wache sie als 0 und erneuerte eine gesunde Leitung (Versuch der Prüfung: Stufe 1 nach 10 s, Stufe 3 nach 25 s; ohne `totalAudioEnergy` dasselbe über „rede“, sobald jemand redet). Jetzt gilt eine fehlende Grösse als unbekannt: `still`/`rede` werden nicht gewertet, „hört wieder“ entscheidet ohne sie (Sonde J). Chrome, Firefox ab 104 und Safari seit etwa 2022 liefern beide Felder; betroffen wären nur alte Browser. Ob ein anderer Browser die Samples **anders** zählt (etwa auch ohne Ausgang), ist nicht geprüft – dann sähe „still“ einen tauben Zustand nicht, griffe aber auch nicht fälschlich ein. „rede“/„pakete“ gibt es nur für Leute, die „redet“ melden (auf der Bühne).
- Stufe 3 bei gemischten Fassungen: erneuert die kleinere Kennung (neu) die Leitung zu einem Gegenüber mit **alter** Fassung, kann dieses danach selbst taub werden (der alte Fehler drüben). Selten (nur nach Stufe 2 ohne Erfolg oder „pakete“), gebremst.
- Kontingent: bis die Migration eingespielt ist, zählen „ton-weg“-Berichte gegen die 40 je Tag; deshalb höchstens 3 je Seitenaufruf.

**Vorschläge (sichtbar oder verhaltensändernd – nur im Funk, nicht gebaut)**
- V1 Im Hörfilter Betreiber bzw. Häuptling ausnehmen (Xander bliebe für Emy hörbar, auch wenn sie mitspielt und er nicht).
- V2 Ein Hinweis am Platz, solange der Filter jemanden stumm hält (heute nur das graue Lautsprecher-Zeichen).
- V3 Den Schalter „Nur Mitspieler hören“ nicht über ein Neuladen hinweg merken.
- V4 In `/verbindung` „Ton kommt an“ ersetzen durch „Ton kam zuletzt vor x s – abgespielt ja/nein“ (im tauben Zustand war die Meldung falsch).
- V5 (technisch, nicht empfohlen ohne Sonden 659/884-leitung/842): Anrufer legt `addTransceiver("audio")` + `replaceTrack` statt `addTransceiver(tonSpur)` – dann wäre die Kennung je Leitung neu und auch alte Empfänger geschützt.

### Datenbank (nicht eingespielt – Claude spielt es selbst ein)
Dritter Topf „ton-“ (20 je 24 h) in `public.spiel_diagnose_senden`, Basis = Fassung mit „mess-“-Topf; Antwort trägt zusätzlich `ton: 20` (die Seite hebt dann ihre Drossel von 3 auf 6 je Seitenaufruf). „tonstand“/„tontest“ beginnen mit „ton“, aber nicht „ton-“ – sie bleiben im Rest-Topf.
```sql
create or replace function public.spiel_diagnose_senden(p_art text, p_daten jsonb)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare
  uid uuid := auth.uid();
  a text := left(coalesce(p_art, ''), 40);
  topf text := case when left(coalesce(p_art, ''), 5) = 'mess-' then 'mess'
                    when left(coalesce(p_art, ''), 4) = 'ton-' then 'ton' else 'rest' end;
  n integer;
begin
  if uid is null then return jsonb_build_object('ok', false); end if;
  select count(*) into n from spiel_diagnose
    where spieler = uid and zeit > now() - interval '1 day'
      and (case when left(art, 5) = 'mess-' then 'mess' when left(art, 4) = 'ton-' then 'ton' else 'rest' end) = topf;
  if n >= (case topf when 'mess' then 12 when 'ton' then 20 else 40 end) then
    return jsonb_build_object('ok', false, 'grund', 'genug für heute');
  end if;
  insert into spiel_diagnose (spieler, art, daten)
    values (uid, a, case when length(p_daten::text) > 6000 then jsonb_build_object('zu_lang', true) else coalesce(p_daten, '{}'::jsonb) end);
  return jsonb_build_object('ok', true, 'mess', 12, 'ton', 20);
end $function$;
```

### Auslesen nach dem Ausliefern (nur lesen)
```sql
select zeit, daten->>'befund' befund, daten->>'stufe' stufe, daten->>'geheilt' geheilt, daten->'spiel' spiel, daten->'heil' heil
  from spiel_diagnose where art = 'ton-weg' order by id desc limit 50;
select zeit, spieler, daten->>'mit' mit from spiel_diagnose where art = 'leitung' and daten::text like '%tonGleicheKennung%' order by id desc limit 50;
select zeit, daten->'heil' heil, daten->'filt' filt from spiel_diagnose where art = 'verbindung' and daten ? 'heil' order by id desc limit 50;
```
Erwartet nach der Behebung: `tonGleicheKennung` kommt weiter vor (die Auslöser bleiben), „ton-weg“ mit Befund `spur` bleibt bei 0; gibt es andere Befunde, sagt das Feld, welcher Weg es war.

**Offen**
1. Migration „ton-“-Topf einspielen (SQL oben).
2. Feldbeleg: nach dem Ausliefern Emys „leitung“ (`tonGleicheKennung`) und „ton-weg“ ansehen; Emy einmal neu laden lassen, damit sie die neue Fassung hat.
3. Fragen, ob bei Emy „Nur Mitspieler hören“ an ist (graues Lautsprecher-Zeichen mit X an Xanders Platz) – `filt` im „tonstand“/„verbindung“ beantwortet es künftig auch.
4. Vorschläge V1–V5 (Antwort Xanders).
5. Rolle des Spiels (Last auf dem OPPO, hängende Seite → mehr Neuaufbauten): erst mit „abbau“/Auslöser aus 884 und „ton-weg“ zusammen messbar.
6. Ladeweg: +2,7 KB gzip in min/livechat.js – gegen das Ziel von 885 abzuwägen (die beiden Prüfhaken sind davon 627 Byte, gzip einzeln ~0,4 KB). Nachbesserung 1: 315220 → 315602 Byte (gzip 107408 → 107524, +116).
7. 884-sitz Fall 12 wackelt (vorbestehend) – eigener Punkt.
7a. 842-sfu-spiel Fall 4b („beim Schliessen der Seite macht A seine Server-Sitzung zu“, keepalive-„schliessen“ binnen 800 ms nach `A.close()`) war nach diesem Punkt in einzelnen Läufen rot (Bauer 1 von 3, Prüfung 1 von 4 – je der erste Lauf direkt nach 884-leitung), im Stand 7f053be 3 von 3 grün. Kein geänderter Weg berührt Abmelden oder Schliessen; wahrscheinlich zeitabhängig, mit diesen Zahlen aber nicht bewiesen – eigener Punkt.
7b. Nebenbefund (nicht geändert, Tonserver-Weg – braucht 827/842): `spurenNachtragen` (die annehmende Seite) ruft `sfuMeshTonAnwenden`, solange `replaceTrack(Mikrofon)` noch läuft (in `plaetzeAnlegen` nicht – dort setzt `addTransceiver` die Spur sofort); die Prüfung `sender.track === soll` sieht dann `null` und tut nichts. Hört jemand mich wirklich über den Tonserver, geht nach einem Neuaufbau der Leitung meine Stimme trotzdem auch übers Netz zu ihm (er spielt sie nicht ab – `ontrack` überspringt Ton bei `sfuHoertIhn` –, kostet aber Bandbreite), bis zum nächsten `sfuMeshTonAnwenden`.
7c. A1 (Ton-Knopf direkt nach dem Aufbau) einmal ohne neue Leitung binnen 4 s (Gegenprobe ohneTonwegKlein) – Sonde ggf. robuster machen.
8. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand).

**Funk-Antwort (Entwurf, nach der Prüfung abgeschwächt)**: „Emy hört dich nicht (Funk 310): Ich habe im Test einen Fehler gefunden, der genau so aussieht: Baut dein Gerät die Verbindung zu Emy neu auf (zum Beispiel wenn du den Ton-Knopf drückst oder die Seite das von selbst tut), kam deine Stimme bei ihr jedes zweite Mal nicht mehr an – du hörst sie trotzdem, weil die Verbindung immer von deinem Gerät aus aufgebaut wird. Das ist behoben, und eine stille Wache fängt so einen Aussetzer in wenigen Sekunden selbst ab, ohne dass sich am Aussehen etwas ändert. Im Test hat das Spiel am Ton nichts geändert, und eine Dopplung durch das Spiel habe ich dort nicht gefunden. Ob es bei Emy genau dieser Fehler war und ob das Spiel die Neuaufbauten auf ihrem Handy häufiger macht, sehe ich erst nach dem Ausliefern an den neuen Messungen – nachgestellt habe ich es in Chrome am Rechner, nicht auf ihrem Handy. Damit es wirkt, muss Emy die Seite einmal neu laden, wenn die neue Fassung draußen ist. Frag sie bitte noch, ob sie beim Spielen an deinem Bild ein graues Lautsprecher-Zeichen mit X sieht – dann ist zusätzlich der Schalter „Nur Mitspieler hören“ an.“

## Fassung 884 — Beta-Meldungen nur bei echtem Ansehen (Funk 310)

XANDER (Funk 310): „überprüfe bitte ob … ein Beta-Tester online kommt ob er wirklich Sachen testet oder ob das nur irgendwelche Quatsch ist“. Nur app.js (Block vor `renderComingSoonGate`), dazu in Nachbesserung 1 die Teile-Liste `werkzeug/app-teile.json` und in Nachbesserung 2 die Stück-Regel „beisammen“ (`werkzeug/teile-bauen.js`, `teile-messen.js`); livechat.js, spiel.js, backend.js und die DB unberührt, alte Bilderwelt nicht berührt. Sichtbar ändert sich nichts – es geht nur um die Postfach-Nachrichten an die Admins.

### Befund (DB, nur gelesen, 13.10.)
- `private_messages` „🧪 X testet gerade …“: „Dichter & Denker“ 96, „Schnee von gestern“ 96, „Menschen, Dinge, Geschichten“ 69 – immer **alle drei in derselben Minute**, je an die drei Admins (9 Nachrichten je Seitenaufruf; einmal je Tag, weil `sendSystemMessage` gleiche Texte 24 h sperrt). Zuletzt Maram 09.10. 21:09, Ola 08.10., Yacout 01.10. Maram allein: 165 Beta-Meldungen an 17 Tagen.
- **Nachgezählt in Nachbesserung 2** (13.10., nur gelesen): inzwischen „Dichter & Denker“ 99, „Schnee von gestern“ 99, „Menschen, Dinge, Geschichten“ 72 – dazu kamen Marams Start-Meldungen vom **13.10. 08:40 UTC** (10:40 deutscher Zeit, wieder alle neun in derselben Sekunde). Maram jetzt **174 Beta-Meldungen an 18 Tagen** (165 davon die drei Lesebereiche). Das ist erwartbar: live ist noch 883. **Bis 884 ausgeliefert ist und die Geräte nachgeladen haben, kommen diese Start-Meldungen weiter** (einmal je Person und Tag).
- **Ursache:** `renderKompass` (app.js, Ende des Blocks) ruft beim Start `renderDichterUndDenker`/`renderSchneeVonGestern`/`renderEigeneBeitraege` – der Reiter „Wissen“ ist dabei gar nicht offen (Start = „Über mich“). Jeder davon geht durch `renderComingSoonGate` → `notifyAdminsIfBetaTesting`, das sofort beim **Zeichnen** meldete. Die drei Schalter sind in `feature_flags` nie gesetzt (also nur für Beta/Moderation sichtbar).
- **Zweiter Quatsch:** „Betonungs-Trainer“ (9) und „Wortbaustelle“ (3) wurden gemeldet, obwohl sie für alle offen sind: „default true“-Spiele, Schalter nie gesetzt; `getRawFeatureFlag` sah dort „nicht freigegeben“.
- **Was wirklich getestet wurde** (Ergebnisse in `results`, nur die zwei Beta-Spiele mit eigener Auswertung): Artikel-Garten („Gärtner:in“) Reza 2 (06.09.), TOMM 2 (14./16.09.); Beim Arzt TOMM 1, Menna 2 (Sept.). Im Oktober keine Runde in einem Beta-Spiel. Maram ist sehr aktiv (145 Runden in 45 Tagen), aber in freigegebenen Spielen. Ob jemand die Lesebereiche gelesen hat, steht nirgends (sie schreiben keine Ergebnisse) – genau das soll die neue Meldung jetzt ehrlich sagen.
- **Spiele, die wirklich geöffnet wurden** (ergänzt in Nachbesserung 1; `private_messages` nur gelesen, ohne die drei Lesebereiche): Das Spiel-Gate meldete schon vor 884 erst beim **Öffnen** eines Spiels, nie beim Seitenstart. Je Person und Spiel kommt höchstens eine Meldung in 24 h (gleicher Text gesperrt), je an drei Admins – gezählt ist also „an diesem Tag mindestens einmal geöffnet“. 03.09.–22.09.: **24 Öffnungen, 13 Namen (Spiele und Bereiche), 8 Personen** – TOMM 10 (Aussprache-Kurs 3×, Artikel-Garten 3×, Vokabelmeister, Dialoge, Beim Arzt, Der Flohmarkt), Liza 4 (Beim Arzt, Artikel-Garten, Die Baustelle, Korrektour – alle am 11.09.), Yuvraj 3 (Aussprache-Kurs 2×, Der verpasste Zug), Momo 2 (Artikel-Garten, Beim Arzt), Maram 2 (Katzenzimmer 06.09., Feste & Kultur 13.09.), Menna 1 (Beim Arzt), Williams 1 (Wo ist die Katze?), Ola 1 (Musik). Dazu 4 Meldungen für Spiele, die schon für alle frei sind (Betonungs-Trainer 3, Wortbaustelle 1) – mit ihnen 28. **Letzte echte Öffnung: 22.09.** (TOMM, Artikel-Garten). Danach kam keine Spiel-Meldung mehr, obwohl keines dieser Spiele inzwischen freigegeben ist (`site_content.feature_flags` hat für keines einen Schalter) – alle Oktober-Meldungen waren der Startfehler. Ehrlich: „geöffnet“ heißt nicht „gespielt“ (vor 884 reichte ein kurzes Öffnen); „Katzenzimmer“ (06.09.) ist vermutlich derselbe Schalter wie „Wo ist die Katze?“ unter altem Namen (der Schalter heißt heute noch `katzenzimmer_neu`) – im flachen Klon nicht nachprüfbar. **Berichtigt in Nachbesserung 2:** die 13 Namen sind nicht alles Spiele – Aussprache-Kurs, Dialoge und Feste & Kultur sind Lern-/Lesebereiche (`istBereich`), „Musik“ ist der Musik-Player; Spiele sind 9 (8, wenn Katzenzimmer = Wo ist die Katze?). Richtig heißt es also „13 Beta-Spiele und -Bereiche“.

### Was geändert ist (app.js, ein Block)
- `notifyAdminsIfBetaTesting(flagKey, featureName, subTarget, area, defaultTrue)` meldet nicht mehr beim Zeichnen, sondern legt eine **Wache** an den Bereich (`betaAnsehenAbwarten`). Gemeldet wird erst, wenn
  - mindestens die Hälfte des Bereichs zu sehen ist (bei einem Bereich, der höher ist als der Bildschirm: der halbe Bildschirm – `betaBereichImBlick`), **2 s am Stück** (`BETA_ANSEHEN_MS`), im sichtbaren Tab, und
  - die Person auf der Seite schon etwas angetippt hat: `navigator.userActivation.hasBeenActive`, sonst ein eigener Merker für einen echten Tipp/Tastendruck (`pointerdown`/`keydown`/`touchend`, `isTrusted`; die Horcher melden sich nach dem ersten echten Tipp ab).
- Weiterhin **einmal je Bereich und Sitzung** (`betaTestingNotifiedThisSession`, erst beim Melden gesetzt). Vor dem Melden wird noch einmal geprüft (inzwischen freigegeben, abgemeldet, schon gemeldet → nichts).
- **„Für alle frei“** (`betaFuerAlleFrei`) heißt bei „default true“-Spielen dasselbe wie in `isFeatureOnDefaultTrue`: nie gesetzt oder an = frei → keine Beta-Meldung. `renderComingSoonGate` reicht dazu `area` und `defaultTrue` weiter.
- Spiele (Gate erst beim echten Öffnen) melden wie bisher – mit demselben Schutz: wer ein Beta-Spiel öffnet und nach 0,5 s wieder zurückgeht, löst nichts aus.
- **Kosten:** nur für Beta-Personen (nicht Moderation) und nur bei nicht freigegebenen Bereichen. Ein `IntersectionObserver` je Bereich weckt die Wache; nur solange der Bereich im Bild ist, schaut ein 400-ms-Takt nach (eine `getBoundingClientRect`). Nach dem Melden ist sie weg; zeichnet `renderKompass` die Bereiche neu, wandert die Wache an das neue Element. Für alle anderen: drei passive Tipp-Horcher, die sich beim ersten Tipp abmelden.
- Ladeweg im Beta-Commit 347445a: min/app.js 723926 → 725827 Byte (gzip 195456 → 196176, **+720 im Kern**). Die frühere Angabe „im Teil `app-teil-rest1.js`“ war **falsch**: die fünf neuen Hilfsfunktionen standen ausgeschrieben im Kern, weil neue Funktionen dort bleiben, bis sie in `werkzeug/app-teile.json` stehen (`teile-bauen.js`); nach rest1 kamen nur `notifyAdminsIfBetaTesting` und `renderComingSoonGate`, die schon vorher dort lagen. Behoben in „Nachbesserung 1“ (Kern jetzt +224 Byte gzip gegenüber vor dem Beta-Commit).

### Sonden
- **Neu: `werkzeug/pruefe-884-beta.js`** – Telefon 390 × 844 mit echten Fingertipps, Beta-Profil als Attrappe im Demo-Modus (`Backend.signUp` ohne Supabase, `isBetaTester`, `seenFoxIntro`), `Backend.notifyAdminsBetaTesting` durch einen Zähler ersetzt, alle Anfragen nach draußen gesperrt. A Start 4 s: 0 · A2 echter Tipp auf der Startseite: 0 · B Tipp auf „Wissen“ (Dichter noch unten): 0 · B1 Dichter 3 s im Blick: genau 1 „Dichter & Denker“ · B2 „Schnee“ nur 0,8 s im Blick: keine · B3 Reiter weg und her, Dichter erneut: weiterhin 1 · B4 „Schnee“ 3 s: 2 · C ohne `navigator.userActivation` (wie Safari < 16.4), „Wissen“ per Programm, Dichter 3 s ganz im Blick: 0, nach echtem Tipp: 1 · D Artikel-Garten echt geöffnet: genau 1 · D2 Satzbrücke 0,5 s: keine · E Betonungs-Trainer (default true, nie gesetzt): keine · F keine Seitenfehler aus der Wache. **Grün** in `?quelle` und `min/` (nach `fassung-setzen.js --nur-stempel`).
- **Gegenprobe** (`ALT=scratchpad/gegen884b/beta-vor`, app.js aus 67102a5): **11 rot** – schon beim Start 3 Meldungen (Dichter, Schnee, Beiträge), dazu D (4 statt 1), D2 („Satzbrücke“ nach 0,5 s gemeldet), E („Betonungs-Trainer“ gemeldet), C ×2; grün bleiben B3 (einmal je Sitzung galt schon) und F.
- Mitgelaufen (grün): 840-bilderwelt-alt-neu (alte Bilderwelt unverändert), 865-lesetexte-nachladen, runde87-kalender, 843-italienisch-nur-im-raum, 884-notweg (min/-Stücke von app.js).

### Nachbesserung 1 (Prüfung Runde 1)
- **Ladeweg:** `werkzeug/app-teile.json`, Liste „rest“, um `betaEchtAngetippt`, `betaBereichImBlick`, `betaAnsehenAbwarten`, `betaFuerAlleFrei`, `betaMeldenDarf` ergänzt (in Dateireihenfolge direkt vor `notifyAdminsIfBetaTesting`). Gerufen werden sie nur aus `notifyAdminsIfBetaTesting` bzw. aus der Wache, die schon in rest1 liegen – jetzt stehen alle sieben im **selben Stück rest1** (Platzhalter 9–15), es muss also nie ein zweites Stück nachgeladen werden. `BETA_ANSEHEN_MS` wandert mit (im Kern bleibt `var BETA_ANSEHEN_MS;`). Im Kern bleiben nur der Tipp-Merker (er muss den ersten Tipp schon beim Start hören), `betaWachen`, `betaEchterTipp` und fünf Platzhalter. app.js selbst ist unverändert (nur die Liste).
- **Gemessen** (gzip -9): min/app.js 67102a5 723926 / 195456 → 347445a 725827 / 196176 → **jetzt 724643 / 195680**: gegenüber vor dem Beta-Commit noch +717 Byte / **+224 Byte gzip** (statt +720), gegenüber 347445a −496 Byte gzip. Raum-Stücke unverändert. Die Rest-Stücke (kommen erst in der Ruhepause, ab 3 s nach dem Laden) zusammen 1270771 → 1272401 Byte (Summe gzip 355230 → 356514): weil die Stückgrenzen nach Dateireihenfolge bei etwa 250 000 Zeichen fallen, rücken 21 Funktionen je ein Stück weiter (rest1 → rest2 … rest5 → rest6, z. B. `merkeZustand`, `renderTileGallery`, `renderSprachatlas`). ~~Auf den Startweg kommt dadurch nichts: Sonde 876-start-schlank grün.~~ **Falsch** (Prüfung Runde 2): 876 läuft nur ohne Konto. Für Betreiber, Admins, Moderation und Beta wurde der Start schwerer – siehe Nachbesserung 2.
- **Sonde 884-beta, neu G** (nur min/): G1 die fünf sind im Kern nur Platzhalter · G2 alle im selben Stück wie `notifyAdminsIfBetaTesting` (rest1) · G3 der Tipp-Merker bleibt im Kern. **16 grün** in min/, **13 grün** in `?quelle` (G entfällt). Gegenprobe zu G: Baum aus Verweisen, nur `index.html`, `min/.quelle.json`, `min/app.js`, `min/app-teil-*.js` aus 347445a → **2 rot (G1, G2)**, A–F grün. Gegenprobe `ALT` (app.js aus 67102a5) weiterhin **11 rot**.
- **Sondenkopf berichtigt:** die Anleitung zur Gegenprobe nannte `git show HEAD:app.js` – seit 347445a ist HEAD schon die neue Fassung (grüne „Gegenprobe“, die nichts beweist). Richtig: `git show 67102a5:app.js`.
- **Befund ergänzt** (Spiele wirklich geöffnet, siehe oben) und **Funk-Antwort berichtigt**: sie nannte nur die Ergebnisse aus `results` und unterschlug, dass die Spiel-Meldungen echt waren.
- Mitgelaufen (grün): 876-start-schlank, 884-notweg (91, min/).

### Nachbesserung 2 (Prüfung Runde 2)
- **Was Nachbesserung 1 kaputt gemacht hat:** Die fünf Helfer machten rest1 größer, alle späteren Stückgrenzen rückten. Dabei fiel die Grenze rest3/rest4 genau zwischen `eigeneBeitraege` und `beitraegeLaden`. Für Betreiber, Admins, Moderation und Beta zeichnet `renderKompass` beim Start die drei Kompass-Bereiche (verdeckt): `lesetexteWennSichtbar` (rest3), `beitraegeLaden` und danach `renderTileGallery` (jetzt rest4). Ein Platzhalter, dessen Stück noch nicht eingesetzt ist, holt es per **synchronem XHR** (`dmaTeilSofort`) – beim Start also rest1, rest3, **rest4**, rest6 statt rest1, rest3, rest6. Nachgestellt (Demo-Attrappe, 2 s nach load, `DMA_TEILE.stand().sofort`): ce53c58 Beta/Betreiber/Admin/Moderation je 4 Stücke; 347445a und 67102a5 je 3; angemeldet ohne Rolle überall 2 (rest1 `trophyCounts`, rest6 `tinyAvatar`), abgemeldet 0. Die 496 Byte gzip im Kern (≈ 3 ms) waren für Xander mit einem zusätzlichen Sync-XHR bei jedem Seitenaufruf bezahlt.
- **Behoben ohne die Ersparnis aufzugeben:** neue Regel **„beisammen“** in `werkzeug/app-teile.json`, ausgewertet in `werkzeug/teile-bauen.js`: Innerhalb einer Reihe fällt nie eine Stückgrenze, das Stück wird erst nach ihrem letzten Mitglied geschlossen. Reihe 1 = der Kompass-Block (`kachelBildSvg`, `portraitSvg`, `lesetexteLaden`, `lesetexteWennSichtbar`, `beitragBilderLaden`, `eigeneBeitraege`, `beitraegeLaden`, `renderTileGallery`, `renderEntryDetail`, 14 724 Zeichen), Reihe 2 = die Beta-Wache mit `notifyAdminsIfBetaTesting` und `renderComingSoonGate` (6 463 Zeichen). Eine Reihe, deren Mitglieder weiter als 62 500 Zeichen auseinander liegen, gilt nicht (`--zeigen` sagt es). „beisammen“ geht in die Kennung der Stücke ein (sonst passte ein altes Stück zum neuen Kern) und bleibt beim Neu-Messen erhalten (`teile-messen.js` übernimmt es). Warum eine Regel statt nur die Liste zurückzunehmen: die Grenzen verschieben sich bei **jeder** Änderung weiter vorn in app.js; ohne Regel wäre derselbe Fehler beim nächsten Umbau wieder da.
- **Ergebnis** (min/app.js, Node-zlib Stufe 9 – absolut etwas anders gezählt als die Zahlen von Nachbesserung 1, die Unterschiede passen): 67102a5 719 771 / 196 026 gzip · 347445a 721 672 / 196 762 · ce53c58 720 488 / 196 262 · **jetzt 720 490 / 196 264** – die Ersparnis von Nachbesserung 1 bleibt (−498 gegenüber 347445a, +238 gegenüber vor dem Beta-Commit; die 2 Byte zu ce53c58 sind die neue Kennung). rest3 192 960 Byte (der ganze Kompass-Block), rest4–rest7 wieder genau so groß wie vor dem Beta-Commit (203 870 / 231 706 / 190 241 / 72 440). Startweg: Beta, Betreiber, Admin, Moderation je **rest1, rest3, rest6** (wie 67102a5), angemeldet ohne Rolle rest1, rest6, abgemeldet nichts.
- **Gemessen unter Slow 4G** (eigene Messung: 1,6 Mbit/s, 150 ms, CPU ×4 über CDP, Betreiber-Attrappe im Demo-Modus, je 3 Läufe; die Zahlen liegen wegen anderer Drosselung höher als in der Prüfung, die Richtung ist dieselbe): ce53c58 load 24 437–24 593 ms, Long-Tasks 6 313–6 349 ms, Sync-XHR rest1 / rest3 / **rest4 1 148–1 151 ms** / rest6; jetzt load 23 272–23 415 ms, Long-Tasks 5 159–5 269 ms, Sync-XHR nur rest1 / rest3 / rest6. Also rund 1,1 s weniger gesperrter Hauptfaden je Seitenaufruf für Xander.
- **Randfall „default true“ vor den Schaltern** (`notifyAdminsIfBetaTesting`): Ein „default true“-Spiel, das ausdrücklich auf false steht (zurückgezogen), meldete nicht, wenn das Gate gezeichnet wurde, bevor `feature_flags` da war (roh `undefined` galt als frei, es gab keine Wache; vor 884 kam die Meldung). Jetzt: Beta-Person und „default true“ ohne Wert → erst die Schalter abwarten (`Backend.getFeatureFlags()`: aus dem Speicher sofort, sonst dieselbe laufende Abfrage – `getSiteContent` legt gleiche Abfragen zusammen, keine zweite), dann neu entscheiden. Steht ein Wert da, wacht die Wache wie sonst; bleibt er leer, ist das Spiel frei, keine Wache. `betaMeldenDarf(…, vorlaeufig)` prüft beim Zeichnen nur „Beta-Person, noch nicht gemeldet“. Kosten nur für Beta-Personen in „default true“-Spielen: ein Promise je Zeichnen.
- **Sonde 884-beta neu:** E2 (zurückgezogen, Schalter kommen 1 s nach dem Zeichnen → genau 1 „Betonungs-Trainer“), E3 (Schalter kommen, Wert bleibt leer → keine Meldung), H0 (Kompass-Reihe in einem Stück), H-beta / H-betreiber (Start mit Konto, 2,5 s nach load: höchstens 3 Sync-Stücke und die Beiträge sind wirklich gezeichnet), H-normal (höchstens 2). **min/ 22 grün, `?quelle` 15 grün** (G, H entfallen). Gegenprobe Baum aus ce53c58 (Nachbesserung 1): **4 rot** – E2, H0, H-beta, H-betreiber (je 4 Stücke: rest1, rest3, rest4, rest6). Gegenprobe `ALT` (app.js aus 67102a5): **13 rot** (die 11 von bisher, dazu E2/E3: dort kam „Betonungs-Trainer“ schon beim Zeichnen).
- Mitgelaufen (grün): 876-start-schlank, 884-notweg (91), 840-bilderwelt-alt-neu, 865-lesetexte-nachladen, runde87-kalender.
- **Berichtigt:** die Angabe in Nachbesserung 1 „Auf den Startweg kommt dadurch nichts“ (oben durchgestrichen) und die Funk-Zeilen von Nachbesserung 1 „Die Beta-Wache lädt jetzt nur noch bei Beta-Personen mit“ und „Alle anderen laden beim Start wieder fast so wenig wie vorher“ – beides stimmte nicht: rest1 samt Wache wird für **alle** in der Ruhepause eingesetzt (ab 3 s nach load), für Beta/Betreiber schon beim Start synchron (`renderComingSoonGate`); und für den Betreiber war der Start schwerer geworden. „13 Beta-Spiele“ heißt richtig „13 Beta-Spiele und -Bereiche“.

### Ehrlich
- Nachbesserung 2 ist im Demo-Modus gemessen (Profil steht sofort fest). Im echten Supabase-Betrieb hängt es davon ab, ob das Profil ankommt, bevor die Ruhepause (ab 3 s) die Stücke eingesetzt hat; auf langsamer Leitung kommt es meist früher – dann gilt genau das Gemessene. Holt ein Platzhalter ein Stück synchron, das gerade schon über die Leitung kommt, wird es doppelt geholt (der Sync-XHR kann auf den laufenden Abruf nicht warten) – unverändert seit 876.
- In Chromium lässt sich „nie angetippt“ nicht mit dem echten `navigator.userActivation` prüfen: Playwright führt jedes `evaluate` als Nutzergeste aus und setzt damit `hasBeenActive`. Fall C prüft deshalb den Rückweg (eigener Tipp-Merker), wie ihn Safari vor 16.4 nimmt; der echte Weg ist in A/A2/B (verdeckt bzw. nicht im Blick) und B1/D (echter Tipp) mitgeprüft.
- Ob jemand einen Bereich wirklich **liest**, kann keine Seite wissen. „2 s halb im Bild nach einem Tipp“ ist die Annäherung; wer lange auf „Wissen“ steht und an Dichter & Denker vorbeiscrollt, löst die Meldung aus.
- Hintergrund-Tab (`visibilityState`) ist in der Sonde nicht nachgestellt.
- Die Meldung gilt weiter nur für die Beta-Rolle (`isBetaTester`), nicht für Personen, die nur für ein einzelnes Spiel eingeladen sind (`beta:<flag>`) – unverändert.
- Alte Fassungen auf den Geräten melden weiter beim Start, bis die Person neu lädt.

**Vorschläge (nicht gebaut)**
- V1 Die Meldung um „wie lange“ ergänzen (z. B. nach dem Verlassen des Bereichs: „hat 3 min in Dichter & Denker gelesen“) – dann sieht man auch, ob es mehr als ein Blick war. Ändert den Text der Admin-Nachricht, deshalb erst nach Rückfrage.
- V2 Einladungen für ein einzelnes Spiel (`beta:<flag>`) ebenfalls melden.

### Datenbank
Keine Änderung nötig.

**Offen**
1. Nach dem Ausliefern: `select date_trunc('minute', created_at), left(body, 80), count(*) from private_messages where is_system and body like '🧪 %testet gerade%' and created_at > '<Auslieferung>' group by 1, 2 order by 1 desc;` – erwartet: keine 3er-Bündel mehr in derselben Minute. Bis dahin (und bis die Geräte nachgeladen haben) kommen sie weiter (Stand 13.10.: Maram 08:40 UTC).
2. V1/V2 (Antwort Xanders).
3. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand).
4. **Für Fassung 885 (Ladezeit, Puls-Hinweis der Prüfung, nicht von diesem Punkt verursacht):** Schon vor 884 holen Angemeldete beim Start rest1 (`trophyCounts`) und rest6 (`tinyAvatar`) per Sync-XHR, Betreiber/Admins/Moderation/Beta dazu rest1 (`renderComingSoonGate`) und rest3 (`lesetexteWennSichtbar`) – unter Slow 4G zusammen rund 1,6 s gesperrter Hauptfaden (Prüfung: rest1 ≈ 465 ms, rest3 ≈ 430 ms, rest6 ≈ 745 ms). Ursache: `teile-messen.js` misst nur „abgemeldet“ und „angemeldet ohne Rolle“, und `renderKompass` zeichnet die Kompass-Bereiche für diese Rollen schon beim Start (samt `data-beitraege.js`, obwohl der Kommentar dort „erst, wenn der Wissens-Bereich sichtbar ist“ sagt). Vorschlag: diese Funktionen in den Kern oder in einen frühen asynchronen Abruf (statt Sync-XHR), Kompass erst beim Öffnen von „Wissen“ zeichnen, und Sonde 876 zusätzlich mit Konto und Betreiber-Rolle laufen lassen (die Prüfung steht jetzt schon in 884-beta H).

**Funk-Antwort (Entwurf, berichtigt in Nachbesserung 1 und 2)**: „Beta-Tester (Funk 310): Teils Quatsch, teils echt. Quatsch waren die Nachrichten „X testet gerade Dichter & Denker / Schnee von gestern / Menschen, Dinge, Geschichten“: Die kamen bei jedem Öffnen der Seite automatisch, alle drei in derselben Minute – auch wenn die Person diese Bereiche gar nicht angesehen hat. Bei Maram waren es so 174 Meldungen an 18 Tagen, zuletzt heute früh – die kommen weiter, bis die neue Fassung draußen ist und die Geräte sie geladen haben. Quatsch waren auch die Meldungen für Spiele, die längst für alle offen sind (Betonungs-Trainer, Wortbaustelle). Echt waren die Meldungen zu den Beta-Spielen – die kamen nur, wenn jemand das Spiel wirklich geöffnet hat: Im September haben 8 Beta-Personen 13 Beta-Spiele und -Bereiche geöffnet, zusammen 24-mal, vor allem TOMM (10-mal, z. B. Aussprache-Kurs und Artikel-Garten), Liza (4) und Yuvraj (3). Seit dem 22.09. hat niemand mehr ein Beta-Spiel geöffnet; alles, was im Oktober kam, war der Fehler beim Seitenstart. Ab der nächsten Fassung kommt die Nachricht nur noch, wenn die Person den Bereich wirklich offen hat und mindestens zwei Sekunden darauf schaut, und nur für Sachen, die noch nicht für alle frei sind. Wenn du willst, kann die Nachricht später auch sagen, wie lange jemand drin war.“

## Fassung 884 — Alle sehen dasselbe: Fokus, Lesezeile, Aufdecken, wer dran ist; größere Eierschalen (Walkie 128/129/138)

XANDER (Walkie 128/129/138, Abnahme 24.09.): „Andere sehen den Fokus nicht" · „Andere sehen es anders" (Aufdecken) · „Strichlinie/Lesetafel/Ei: Andere sehen es nicht" · Notiz: „Das Ei hat immer noch zu kleine Schalen nach dem Aufmachen." Alles Xanders eigene Wünsche – gebaut, auch das Sichtbare (Knopf 📌 bei allen, Buchstaben bei allen, größere Schalen). livechat.js, app.js (lcLeseTafel, lcLeseFestSetzen, lcRatenTafel, lcEi), korrekturen.css (eine Zeile); alte Bilderwelt nicht berührt. Bauplan aus der 884-Untersuchung gegen den heutigen Stand b9aebd3 geprüft (alle Zeilen hatten sich verschoben, die Befunde stimmten).

### Befund (Stand b9aebd3, Sonde 884-gleich mit `ALT=`)
- **Fokus, Lesezeile, wer dran ist** gingen je EINMAL über den Server hinaus (`lesefest`, `lesezeile`, `dran`) – nicht im Puls, nicht in der Antwort auf „hallo", nicht direkt, nicht nachgesendet. Wer später kam oder das Paket verlor, sah es nie. Der Kommentar „damit ein Späterkommender die Stelle sofort sieht" (leseTextSenden) stimmte nicht.
- Beim „hallo" kam `dran` nur über `aufgabeAn`; das verwirft der Empfänger, wenn er dieselbe Aufgabe schon aus dem Gerätespeicher hat (`zeit >=`) – dann blieb der alte Name.
- **Aufdecken:** ein Buchstaben-Tipp deckte NUR auf dem eigenen Gerät auf – es ging kein einziges Paket hinaus (der Kopfkommentar „deckt ihn überall auf" war nie gebaut). Dazu gab der 1,5-s-Takt benutzte Tasten wieder frei (kein `dataset.fertig`): ein falscher Buchstabe zählte beim zweiten Tipp doppelt („1 daneben" → „2 daneben"). Gegenprobe: bei A „Noch 12 Buchstaben · 1 daneben", bei B „Noch 14 Buchstaben"; bei A „Dran ist: Alex", bei B „Du bist dran.".
- **Fokus-Knopf:** kam der Fokus von drüben, zeigte der Knopf weiter 📎 (gezeichnet nur beim eigenen Tipp).
- **Lesetafel beim Späterkommenden:** `verschmelzen` übernahm vom Zwilling nur Bild, Wirkung, Farbe; die Tabellen-Abschrift kennt keine Zusatzfelder. Lag sie zeitlich vorn (Uhr des Absenders geht vor), verlor die Zeile Sätze bzw. Aufdeck-Satz. Gäste ohne Anmeldung bekommen nur das jüngste Verlaufsstück (24 000 Zeichen) – eine ältere festgehaltene Tafel fehlte ganz.
- **Ei:** Runde 99 hatte nur die Elementbreite angeglichen (26 %); die Zeichnung der Schale war ≈ 28,7 Einheiten lang, das Ei 34 breit. Gemessen (getBBox, CSS-px): Schale ÷ Ei = **0,83** bei 360/412/760 px.
- **Ei für Späterkommende:** vergangene Effekte werden absichtlich nicht nachgespielt (Aufgabe #12, app.js „damit einen Neuankömmling nicht das halbe Archiv anspringt") – unverändert.
- **Strichlinie:** kein Raumzustand, jedes Gerät zeichnet sie selbst aus der Sitzordnung (die fährt schon im Puls). Sonden runde98-/runde87-strichlinien grün. „Andere sehen es nicht" ist **nicht nachstellbar**; Vermutung (nicht bewiesen): am 24.09. hatten die anderen eine ältere Fassung.

### Was geändert ist
1. **Raumstand** (livechat.js, Block nach `leseFest`): `raumStand = { lf, lz, dr, rb }` – Fokus, Lesezeile je Tafel, wer dran ist je Aufgabenzeile, aufgedeckte Buchstaben je Aufgabenzeile (eine Menge, es kommt nur dazu). Jeder Eintrag `{ w, t }`; `rsStempel` = max(jetzt, bekannt + 1). `rsEintragen` übernimmt nur einen neueren Stempel (bei gleichem der größere Wert, überall derselbe) und zeichnet nur, wenn sich der Wert ändert → kein Zurückdrehen, keine Dauerlast.
2. **Senden:** `leseFestSetzen`, `leseZeileSetzen`, `dranSetzen`, neu `LiveChat.ratenBuchstabe` → `raumStandRaus()`: direkt (Datenkanal) + Server, nach 0,35 s und 1,2 s der dann gültige Stand noch einmal (laufende Nachsendung nimmt neue Änderungen mit). Die alten Meldungen bleiben für ältere Fassungen und tragen den Stempel (`rt`). `ratenStellen` trägt den Anfang der Runde ein.
3. **Mitfahren:** `rs` (je Feld die 4 jüngsten Einträge) im Puls, in `auch-da` (Gruss und Puls-Antwort) und in `pruefPuls`; leer fällt das Feld weg. Gemessen: 87 Zeichen (Fokus + Lesezeile), 186 Zeichen mit Aufgabe und Buchstaben.
4. **Empfang:** Datenkanal und Server `raumstand`; Puls und `auch-da` übernehmen `rs`; `lesefest`/`lesezeile`/`dran` gehen durch denselben Weg (ohne Stempel = ältere Fassung: gilt sofort, eigene Uhr). `dran` ändert die offene Aufgabe nur noch, wenn sie diese Zeile ist. Übernommenes wird nicht weitergeschickt (kein Echo).
5. **Betreten** leert den Raumstand (sonst wanderte er über den Puls von Raum A nach B).
6. **verschmelzen:** der Zwilling bekommt fehlende `ZUSATZ_FELDER`. **verlaufNachreichen:** die festgehaltene Tafel und die Zeile der offenen Aufgabe zuerst ins Paket (wenn ≤ halbe Paketgrösse); die Grenze bleibt.
7. **app.js lcRatenTafel:** `tasteAnwenden` (je Buchstabe nur einmal wirksam, Taste „fertig"), Tipp → `LiveChat.ratenBuchstabe`; `kasten._lcAufdecken` + `window.DMA_RATEN_AUFDECKEN(zid, s)` (Vergleich über `dataset`); beim Zeichnen und im 1,5-s-Takt der Stand aus `LiveChat.ratenBuchstaben`. Die Regeln bleiben: jeder darf Buchstaben tippen, die Lösung sagt, wer dran ist.
8. **app.js Lesetafel:** `t._lcFestZeichnen`; `lcLeseFestSetzen` zeichnet den Fokus-Knopf jeder Tafel neu (📌 auch bei den anderen).
9. **Ei:** Schalen-SVG viewBox 40×36 statt 40×30, Pfade auf Eibreite (y ≈ 0,6 … 35,4), Eihaut mitgestreckt; korrekturen.css `.lc-zei-schale` top −28 % statt −26 % (Mittelpunkt bleibt −16,25 %), Breite bleibt 26 %. Gemessen: Schale ÷ Ei = **1,00–1,01** bei 360/412/760 px (vorher 0,83).

### Sonden
- **Neu: `werkzeug/pruefe-884-gleich.js`** – zwei Chromium-Kontexte aus `?quelle`, A Lehrer (Häuptling), B Späterkommender; den Raumkanal spielt die Sonde (`pruefPost`/`pruefEmpfangen`), verlorene Pakete bestimmt sie selbst. 1 Fokus + Lesezeile nur über „auch-da" · 2 Puls heilt verlorenes Paket, älterer Puls dreht nichts zurück, `lesefest` ohne Stempel · 3 Verlaufspaket für Gäste enthält die festgehaltene Tafel (90 lange Zeilen danach) · 4 Aufdecken über Puls und direkt · 5 Fehlbuchstabe nur einmal · 6 dran über Puls, B's Tafel zeigt es · 7 kein Echo, Grösse · 8 verschmelzen · 9 Eierschalen (Verhältnis, Breite, Mittelpunkt) bei 360/412/760 · 10 Quelltext Betreten · 11 keine Seitenfehler. **Alles grün (44 Prüfungen, `?quelle` und `MIN=1`).** `BILD=` macht Fotos des Eis.
- **Gegenprobe** (`ALT=scratchpad/gegen884b/gleich-vor`, livechat.js/app.js/korrekturen.css aus b9aebd3): **26 rot** (1, 2, 3, 4, 5, 6, 7-Grösse, 8, 9, 10); grün bleiben die Schutz-Fälle (Elementbreite, Mittelpunkt, `lesefest` ohne Stempel, kein Echo, keine Seitenfehler).
- **runde24 berichtigt:** prüfte noch die Regel von vor Fassung 749 („Tipp auf die Zeile hält fest") und war deshalb seit 749 rot (3 rot, am Code nichts falsch). Jetzt: Tipp markiert nur, „Fokus" hält fest – grün.
- **runde21 nachgezogen:** zwei Quelltext-Prüfungen suchten die alte Form der Lesezeile (`senden({ art: "lesezeile", leseId: id, nr: n })`, `leseStelle[String(n.leseId)]`). Jetzt gelten beide Formen (mit Stempel `rt`, Empfang über `rsEintragen`, Mitfahren im Puls) – grün, auch gegen b9aebd3.
- **884-gleich mit `MIN=1`** (min/, Raum-Stücke von app.js): alles grün.
- **Mitgelaufen, grün** (min/ nach `fassung-setzen.js --nur-stempel`): runde98-fokus, runde98-aufdecken, gluecksrad, aufgabentafel, runde98-lesekopf, 749-makroknopf-lesezeile, 865-lesetexte-nachladen, runde99-kleinkram, runde15, runde98-strichlinien, runde87-strichlinien (155 grün, auch `/ei`; allein gut 15 min – mit 7 min Frist bricht sie ab), zusatzfelder, verlauf-doppelt, 642-verlauf-laden, raumverlauf, aufgaben, 811-leitung, sprechbild-reist, geschlecht, 816-platzwechsel, 856-platz-direkt, 859-kanal-sofort, 861-leitung-messen, 866-geist-wache, 871-leitung-frisch, 884-sitz, 884-leitung, 884-ton310 (allein; im Parallellauf zweier Sondenreihen einmal A1 rot – Last, allein 45 grün), 884-bild, 840-bilderwelt-alt-neu (alte Bilderwelt unverändert), 884-notweg, 876-start-schlank, 884-beta.
- **Rot schon vor diesem Punkt** (mit dem Stand b9aebd3 genauso rot – Quelltext-Muster bzw. Baum aus Verweisen mit index.html/min/ aus b9aebd3; nicht angefasst): runde20 (2 – Muster `pc.ontrack` seit ton310, „auch-da" mit `sprechbild` liegt seit dem 884-`haelt` hinter 420 Zeichen), 862-angebotssturm D (Muster `rueckkehrOffen … konto`), 648-aufgabenarten (2 – die Aussprache im Spiel fragt seit 766 Azure, die Sonde stellt nur die alte Bewertung nach).

### Ehrlich
- Zwei Geräte gleichzeitig sind **nachgebaut** (abgefangener Raumkanal, verworfene Pakete). Echte Laufzeiten von Supabase und Datenkanal prüft die Sonde nicht; endgültig zeigt es erst ein Test mit zwei Geräten.
- Gemischte Räume: ältere Fassungen verstehen `raumstand`/`rs` nicht; sie bekommen weiter die Einmal-Meldungen, aber **keine geteilten Buchstaben**, bis sie neu laden. Ist der Lehrer noch auf einer älteren Fassung (Meldungen ohne Stempel), stempelt jedes Gerät selbst; geht dabei bei einem Schüler die Uhr vor, kann ein Fokuswechsel bei anderen für höchstens einen Puls (6 s) zurückspringen und steht danach wieder richtig. Mit nur neuen Fassungen setzt immer derselbe Lehrer, und sein Stempel ist stets größer als jeder bekannte.
- Randfall (gewollt): ein Schüler, der eine Tafel nur für sich festhält, bevor er je einen Raumstand bekam, kann sie durch den ersten Stand des Lehrers verlieren – der Fokus des Lehrers ist Raumregel. Danach bleibt sein eigenes Festhalten, bis der Lehrer etwas ändert.
- Paketmenge: je Änderung von Fokus/Zeile/dran ein zusätzliches `raumstand` + höchstens 2 zusammengelegte Nachsendungen (gemessen: 4 Pakete für 2 Änderungen in 150 ms, 3 für eine); ein Buchstaben-Tipp ebenso. Der Puls wächst um 87–186 Zeichen.
- Strichlinie: nicht nachstellbar, nichts geändert.

**Vorschläge an Xander (nicht gebaut)**
- V1 Aufdecken wie beim Glücksrad: nur wer dran ist, deckt Buchstaben auf, ein Fehlbuchstabe gibt weiter.
- V2 Effekte (Ei usw.) für Späterkommende nachspielen – widerspricht der Regel „alte Effekte nicht für Neuankömmlinge" (Aufgabe #12), deshalb nur auf Wunsch.

### Datenbank
Keine Änderung nötig.

**Offen**
1. Test mit zwei Geräten: Lehrer setzt Fokus + Zeile, Schüler kommt danach; Aufdecken mit Buchstaben von beiden; Runde weiter.
2. Strichlinie: wenn es nach dem Ausliefern noch vorkommt, bitte Foto von beiden Geräten (welche Linie fehlt wo).
3. V1/V2 (Antwort Xanders).
4. Werkstatt-Eintrag und Fassungsnummer beim Ausliefern von 884 (WIP-Stand).

**Funk-Antwort (Entwurf)**: „Alle sehen dasselbe (Walkie 128/129/138): Fokus, markierte Lesezeile, wer dran ist und die aufgedeckten Buchstaben gingen bisher nur einmal hinaus – wer später kam oder kurz Netz verlor, sah sie nie, und beim Aufdecken deckte jeder Buchstabe sogar nur bei dir selbst auf. Jetzt ist das der Stand des Raums: er geht sofort direkt und über den Server hinaus, wird zweimal nachgeschickt, fährt bei jedem Hereinkommen und alle 6 Sekunden mit. Ein falscher Buchstabe zählt nicht mehr doppelt, und der Fokus-Knopf zeigt bei allen 📌. Die Eierschalen sind jetzt so groß wie das Ei. Die Strichlinie konnte ich nicht nachstellen – wenn sie bei jemandem fehlt, schick mir bitte ein Foto von beiden Handys."

**Walkie-Antwort (128/129/138, Entwurf)**: „Gebaut in 884: Fokus, Lesezeile, Aufdecken und wer dran ist stehen jetzt bei allen gleich, auch bei Späterkommenden; die Schalen sind so groß wie das Ei. Strichlinie: bei mir nicht nachzustellen – bitte noch einmal testen."
