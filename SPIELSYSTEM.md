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
