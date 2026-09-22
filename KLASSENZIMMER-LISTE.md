# Was du gesagt hast — und was die Seite heute wirklich tut

> Stand: 2026-09-22 22:15 · 180 Sonden · 180 grün, 0 rot, 0 ohne Urteil

Diese Liste ist nicht aufgeschrieben, sondern **gemessen**. Jede Zeile
ist eine Sonde: im Kopf steht dein Satz, im Programm läuft die Messung
dazu. ✅ heisst, die Messung bestätigt ihn heute; ❌ heisst, sie
widerlegt ihn; · heisst, diese Sonde lief beim letzten Sammellauf
nicht mit.

Neu messen:

```
bash werkzeug/alle-pruefen.sh > /tmp/stand.txt
node werkzeug/uebersicht-bauen.js /tmp/stand.txt > KLASSENZIMMER-LISTE.md
```

## Was JETZT offen ist

Keine Sonde ist rot. Was noch offen ist, steht in der Werkstatt
(`data-werkstatt.js`) — das sind die Dinge, für die es noch keine
Messung gibt, nicht die, die eine Messung widerlegt.

## Die Kurzfassung — eine Zeile je Messung

- ✅ `pruefe-animationsbuehne` — BLEIBEN DIE ANIMATIONEN IM CHAT?
- ✅ `pruefe-antwort-gehoert-dazu` — PRÜFT: DAS SYSTEM RÄT NICHT MEHR, ES WEISS.
- ✅ `pruefe-aufgabe-reist` — PRÜFT: DIE AUFGABE GEHÖRT DEM RAUM, NICHT DEM GERÄT.
- ✅ `pruefe-aufgabe` — PRÜFT, WANN EINE ZEILE ALS ANTWORT AUF EINE AUFGABE GILT.
- ✅ `pruefe-aufgaben` — PRÜFT DIE KLASSENZIMMER-AUFGABEN.
- ✅ `pruefe-aufgabentafel` — HAT DIE AUFGABE EINE FUNKTION?
- ✅ `pruefe-befehl-unbekannt` — GEHT EIN BEFEHL, DEN ES NICHT GIBT, TROTZDEM HINAUS?
- ✅ `pruefe-befehlspanel` — PRÜFT DAS BEFEHLS-PANEL AM SCHRÄGSTRICH.
- ✅ `pruefe-befehlsreihenfolge` — KEINE ABZWEIGUNG DARF HINTER IHRER TABELLE STEHEN
- ✅ `pruefe-befund` — PRÜFT DEN BEFUND (/diagnose): LEITUNG, REIHE UND UHREN.
- ✅ `pruefe-benoten` — PRÜFT DEN NOTENKNOPF AN DER NACHRICHT.
- ✅ `pruefe-betonung-uebung` — PRUEFT DIE BETONUNGSUEBUNG — AN DER ECHTEN SEITE
- ✅ `pruefe-betreiber` — PRÜFT, OB DAS KLASSENZIMMER DAS KONTO ÜBERHAUPT FINDET.
- ✅ `pruefe-bild-fluestern` — PRÜFT: BILDER FLÜSTERN, UND DER UMSCHALTER IST FÜR JEDEN DA.
- ✅ `pruefe-bildwaehler-zu` — GEHT DAS BILDERFACH NACH DER WAHL WIEDER ZU?
- ✅ `pruefe-blase` — MISST, OB DIE SYMBOLE IN DER SPRECHBLASE BLEIBEN.
- ✅ `pruefe-boxen` — PRÜFT DAS BOXEN — HIN UND ZURÜCK.
- ✅ `pruefe-buehne` — PRÜFT DIE BÜHNENANSICHT UND DIE BEIDEN SPRECH-EFFEKTE.
- ✅ `pruefe-effekttueren` — IST JEDE ANIMATION AUCH AUFRUFBAR?
- ✅ `pruefe-einladen` — PRÜFT, WARUM „/i Emmy" NICHT ABGESCHICKT WERDEN KANN.
- ✅ `pruefe-einladungslink` — PRÜFT, OB EIN EINLADUNGSLINK WIRKLICH IM KLASSENZIMMER LANDET.
- ✅ `pruefe-film-befehl` — PRUEFT AN DER ECHTEN SEITE: TUT /film WIRKLICH ETWAS?
- ✅ `pruefe-film-durchsichtig` — IST JEDER FILM WIRKLICH DURCHSICHTIG?
- ✅ `pruefe-film-freistellen` — PRUEFT DIE FILMKETTE: AUS GRUEN WIRD DURCHSICHTIG
- ✅ `pruefe-film-geschenk` — PRUEFT: ZEIGT EIN GESCHENK JETZT DEN FILM?
- ✅ `pruefe-film-platz` — PRUEFT DIE DREI GEMELDETEN FEHLER — GEMESSEN, NICHT GEGLAUBT
- ✅ `pruefe-filmspieler` — PRUEFT DEN FILMSPIELER — BEIDE WEGE
- ✅ `pruefe-fluester-nachreichen` — PRÜFT: FLÜSTERN FOLGT DER PERSON, NICHT DEM RAUM.
- ✅ `pruefe-fluestern` — PRÜFT: EIN TIPP AUF EINE FLÜSTERZEILE BEREITET DIE ANTWORT VOR.
- ✅ `pruefe-fokus-betreiber` — WER DARF DEN FOKUS-MODUS SCHALTEN?
- ✅ `pruefe-fokus-merker` — PRUEFT: UEBERLEBT DIE FOKUS-REGEL DAS NEULADEN?
- ✅ `pruefe-fremde-uhr-reihenfolge` — PRÜFT, OB EINE NACHGEHENDE UHR DIE REIHENFOLGE VERSCHIEBT.
- ✅ `pruefe-fremde-uhr` — PRÜFT: EINE FALSCH GEHENDE UHR SCHALTET NIEMANDEN STUMM.
- ✅ `pruefe-galgenmaennchen` — DAS GALGENMAENNCHEN — BUCHSTABE FUER BUCHSTABE
- ✅ `pruefe-geschlecht` — PRUEFT: ERKENNT DIE WARTEMELDUNG, DASS EMMI EINE FRAU IST?
- ✅ `pruefe-gif-favoriten` — GIPHY: FAVORITEN UND EIGENE SUCHEN
- ✅ `pruefe-gluecksrad` — PRUEFT DAS GLUECKSRAD — AN DER ECHTEN SEITE
- ✅ `pruefe-haende` — SIND ES HAENDE ODER HOLZTEILE?
- ✅ `pruefe-jeder-befehl` — TUT JEDER BEFEHL, DER IN DER LISTE STEHT, AUCH ETWAS?
- ✅ `pruefe-katapult60` — DAS KATAPULT IST EIN ONAGER GEWORDEN
- ✅ `pruefe-kein-zoom` — ZIEHT DER BROWSER DIE SEITE VON SELBST HERAN?
- ✅ `pruefe-leere` — PRÜFT DEN KLICK INS LEERE DES CHATS.
- ✅ `pruefe-leitung` — PRÜFT: EINE HÄNGENGEBLIEBENE WORTMELDUNG BLOCKIERT NICHT MEHR.
- ✅ `pruefe-muell` — PRÜFT: ALTE BEDIENUNGSHINWEISE VERSCHWINDEN AUS DEM VERLAUF.
- ✅ `pruefe-nachgehende-uhr-effekte` — PRÜFT DEN FALL, DER SECHS RUNDEN GEKOSTET HAT.
- ✅ `pruefe-namensvorschlaege` — PRÜFT: NAMENSVORSCHLÄGE UND SELBST ANGEHEFTETE FAVORITEN.
- ✅ `pruefe-neue-fassung` — PRÜFT: MERKT DIE SEITE, DASS SIE ALT IST?
- ✅ `pruefe-nichts-verrutscht` — VERSCHIEBT SICH DAS BILD DURCH EINE ANIMATION?
- ✅ `pruefe-note-ankommen` — PRÜFT DEN GANZEN WEG EINER NOTE — VOM KNOPF BIS ZU IHR.
- ✅ `pruefe-notenknopf-aufgabe` — PRÜFT, OB DER NOTENKNOPF AN DER ANTWORT STEHT — AUCH NACH DEM NEULADEN UND AUCH BEI EINER AUFGABE IN EIGENEN WORTEN.
- ✅ `pruefe-notenknopf` — MISST DIE ZEILE MIT DEM NOTENKNOPF.
- ✅ `pruefe-paketverlust` — PRÜFT, OB EINE WORTMELDUNG EIN VERLORENES PAKET ÜBERLEBT.
- ✅ `pruefe-pille` — PRÜFT, DASS DIE PILLE NIE ÜBER DEM CHAT-KOPF LIEGT.
- ✅ `pruefe-plaetze` — PRÜFT JEDEN PLATZ IM BILDERRÄTSEL GEGEN SEINEN EIGENEN SZENENTEIL.
- ✅ `pruefe-platzdesign` — DAS PLATZDESIGN BLEIBT STEHEN — BEI JEDEM EFFEKT
- ✅ `pruefe-platzmenue` — DAS MENUE AM PROFILBILD — UND WAS ES AUSLOEST
- ✅ `pruefe-postfach-knopf` — PRÜFT, OB AUS DER EINLADUNG EIN KNOPF WIRD — UND OB ER HINFÜHRT.
- ✅ `pruefe-raumverlauf` — PRÜFT: DER VERLAUF BLEIBT IM VERLASSENEN RAUM LIEGEN.
- ✅ `pruefe-raumwechsel` — PRÜFT: WER IN EINEN ANDEREN RAUM GEHT, HAT NICHT „VERLASSEN".
- ✅ `pruefe-reihenfolge` — PRÜFT DIE REIHENFOLGE DER SPRACHSTÜCKE.
- ✅ `pruefe-reisen34` — BOOT UND BAUSTELLENKRAN — DIE ZWEI NEUEN REISEN
- ✅ `pruefe-rexzaehne` — PRUEFT: ZEIGEN DIE ZÄHNE DES TYRANNOSAURUS INS MAUL?
- ✅ `pruefe-ruecknahme` — PRÜFT DEN PAPIERKORB MIT FRIST.
- ✅ `pruefe-runde15` — WAS ER EINZELN NACHGEFORDERT HAT
- ✅ `pruefe-runde16` — PAC-MAN, DIE FAHRLINIE UND DAS AUFESSEN
- ✅ `pruefe-runde18` — PLATZWAHL, DIE STEHENDE NUMMER UND DER AUFGERAEUMTE EFFEKTKASTEN
- ✅ `pruefe-runde20` — DOPPELTES HOEREN, DER PANIK-KNOPF UND DIE AUFGABEN, DIE WIRKLICH AUFGABEN SIND
- ✅ `pruefe-runde21` — RUNDE 21 — LESEN IM CHAT
- ✅ `pruefe-runde22` — DER GEZEICHNETE WEG, DAS EIGENE ECHO, DER LEERE PLATZ HINTER DEM STRUDEL UND DIE MUSIK
- ✅ `pruefe-runde23` — VORLADEN, BEVOR ES GEBRAUCHT WIRD, DIE TRANSPORTLEISTE UND DAS FRISCHE WETTER
- ✅ `pruefe-runde24` — LESEN NACH KATEGORIEN, DER FOKUS, DIE BETONUNG UND DER KONTEXTER
- ✅ `pruefe-runde25` — DIE AUFGABE MIT SINN, DER WOERTERBUCH-LINK, DAS AUFDECKEN FUER ALLE UND DAS RUNDENLAUFEN
- ✅ `pruefe-runde27` — DIE TAGESGRENZE UND DER TON
- ✅ `pruefe-runde29` — WHITEBOARD, BILLARD ZU DRITT, SCHNEEKUGEL, GEMEINSAM FAHREN, BETONUNG IM LESETEXT, T-REX
- ✅ `pruefe-runde30` — ECHTE GERAEUSCHE, SCHIFFE VERSENKEN, BLUBBERNDES PROFILBILD, FESTE REIHENFOLGE
- ✅ `pruefe-runde37` — RÖHRE, EIGENES LOCH, ZORRO, SPRECHBILDER AUSSEN
- ✅ `pruefe-runde38` — PAINTBALL, MÜNZE, WECKERKLÖPPEL
- ✅ `pruefe-runde40` — SANDUHR UND GLÜHBIRNE
- ✅ `pruefe-runde49` — TROMMEL, OHRFEIGE, KRAN, SCHLAEGER
- ✅ `pruefe-runde50` — WAS MAN HAELT, BLEIBT BEIM HALTENDEN
- ✅ `pruefe-runde51` — DAS PORTAL UND DER ZUG AM SEIL
- ✅ `pruefe-runde52` — DAS BOWLING IM TAKT, DIE PUNKTE AUF DEN PLAETZEN
- ✅ `pruefe-runde53` — DIE MÜNZE UND DAS WHITEBOARD
- ✅ `pruefe-runde54` — KNÜLLEN, BENOTUNG BEIM LESEN, ANDROID-BREITE
- ✅ `pruefe-runde58` — PEITSCHE, LIANE, PFEIL UND COWBOYHUT
- ✅ `pruefe-runde59` — TOENE ZUR RICHTIGEN ZEIT, BLITZE MIT ÄSTEN
- ✅ `pruefe-runde60` — DER TUTOR REDET KUERZER UND SIEHT AUS WIE ER SELBST
- ✅ `pruefe-runde63` — MAULWURF VON OBEN, HAUTTON, RUTSCHENDER SCHNEE, SANDUHR AUF JEDEM EINZELNEN BILD
- ✅ `pruefe-runde64` — LOECHER FARBIG FUELLEN, COWBOYRUF ZURUECK, DER BALL RATTERT IM RING
- ✅ `pruefe-runde65` — MAULWURF IM KREIS, LASSO AM PLATZ, LOK MIT DETAILS, GREIFVOGEL, DREI-METER-TURM, AUFBLASEN
- ✅ `pruefe-runde66` — HELIKOPTER, GEWICKELTER GRIFF, DIE NEUNSCHWAENZIGE UND DIE ROHRREISE AUF BEIDEN SEITEN
- ✅ `pruefe-runde67` — DAS TOR ALS STEHENDE WASSERWAND UND EFFEKTE FUER ALLE GLEICHZEITIG
- ✅ `pruefe-runde68` — BILLARD-PRALLPHYSIK
- ✅ `pruefe-runde69` — DAS WHITEBOARD GEHOERT INS PROFIL
- ✅ `pruefe-runde70` — DIE TOENE STIMMEN WIEDER
- ✅ `pruefe-runde71` — DIE ZEICHNUNGEN, ERSTER TEIL
- ✅ `pruefe-runde72` — XANDERS FEHLERLISTE
- ✅ `pruefe-runde73` — DIE GROSSE LISTE VOM 21. SEPTEMBER, TEIL 1
- ✅ `pruefe-runde74` — XANDERS LISTE VOM 21. SEPTEMBER, ZWEITER TEIL
- ✅ `pruefe-runde75` — XANDERS LISTE VOM 21. SEPTEMBER, DRITTER TEIL
- ✅ `pruefe-runde76` — XANDERS GROSSE LISTE, ERSTER TEIL
- ✅ `pruefe-runde77` — XANDERS LISTE VOM 21. SEPTEMBER, DRITTER TEIL
- ✅ `pruefe-runde78` — JEMAND ANDEREN ALS ZIEL NEHMEN
- ✅ `pruefe-runde80` — was Xander am 22. September gemeldet hat
- ✅ `pruefe-runde81` — der zweite Teil von Xanders Liste vom 22. September
- ✅ `pruefe-runde82` — der Rest von Xanders Liste aus Runde 76
- ✅ `pruefe-runde83` — Frosch-Sprung und Zylinder mit Kaninchen
- ✅ `pruefe-runde84` — die letzten drei Punkte aus Runde 76
- ✅ `pruefe-runde85` — Xanders Liste vom 22. September, erster Teil
- ✅ `pruefe-runde85b` — RUNDE 85, ZWEITER TEIL
- ✅ `pruefe-runde86` — Spruehdose, Spuckton und der Zauberer
- ✅ `pruefe-runde86b` — RUNDE 86, ZWEITER TEIL
- ✅ `pruefe-runde87-hand` — DAS REALISTISCHE GREIFEN
- ✅ `pruefe-runde87-kalender` — PRÜFT DAS UPDATE-PANEL BEI „ES WAR EINMAL IN DEUTSCHLAND".
- ✅ `pruefe-runde87-katapult` — RUNDE 87 — DAS KATAPULT
- ✅ `pruefe-runde87-kino` — ADRESSZEILE WEG UND BILDSCHIRM AN
- ✅ `pruefe-runde87-klaps` — RUNDE 87 — DER KLAPS
- ✅ `pruefe-runde87-lied` — DAS EIGENE LIED WIRKLICH HOEREN
- ✅ `pruefe-runde87-pacman` — PAC-MAN BLEIBT, WO ER ANKOMMT
- ✅ `pruefe-runde87-sechzehn` — SECHZEHN PLAETZE IM SELBEN RAHMEN
- ✅ `pruefe-runde87-strichlinien` — DIE STRICHLINIEN, ALLE AUF EINMAL
- ✅ `pruefe-runde88-aufgabenwahl` — DAS AUFGABEN-MODUL HAT EINE FUNKTION
- ✅ `pruefe-runde88-becken` — DER SPRUNG INS BECKEN
- ✅ `pruefe-runde88-billard` — DIE BILLARD-PHYSIK
- ✅ `pruefe-runde88-birne` — DIE BIRNE IN DIE FASSUNG DREHEN
- ✅ `pruefe-runde88-bongo` — BONGO AUF DEM BILD
- ✅ `pruefe-runde88-fahrgeraeusch` — DAS AUTOFAHRER-GERAEUSCH
- ✅ `pruefe-runde88-frosch` — RUNDE 88 — DER FROSCH
- ✅ `pruefe-runde88-haende` — RUNDE 88 — DIE EMOJI-HAENDE
- ✅ `pruefe-runde88-hut` — DER COWBOYHUT UND SEIN RUF
- ✅ `pruefe-runde88-kaninchen` — DAS KANINCHEN AUS DEM ZYLINDER
- ✅ `pruefe-runde88-klaps` — DER KLAPS KOMMT VON OBEN UND HINTEN
- ✅ `pruefe-runde88-liedstellen` — DIE SONGABSCHNITTE
- ✅ `pruefe-runde88-lok` — DIE LOK IN DER KURVE
- ✅ `pruefe-runde88-mario` — RUNDE 88 — DER MARIO-MODUS
- ✅ `pruefe-runde88-maulwurf` — DER MAULWURF BRICHT DIE PLAETZE AUF
- ✅ `pruefe-runde88-modulhoehe` — DAS SCHWEBENDE MODUL IST NICHT MEHR BESCHNITTEN
- ✅ `pruefe-runde88-pac` — RUNDE 88 — PAC-MAN
- ✅ `pruefe-runde88-panels` — JEDES PANEL LAESST SICH SCHLIESSEN
- ✅ `pruefe-runde88-pferd` — RUNDE 88 — TRAB UND GALOPP
- ✅ `pruefe-runde88-schiffe` — SCHIFFE VERSENKEN, JETZT MIT SINN
- ✅ `pruefe-runde88-selbst` — „ICH KANN MICH NICHT SELBER ANZIEHEN"
- ✅ `pruefe-runde88-slf` — DER SPIELFUEHRER WERTET AUS
- ✅ `pruefe-runde88-zauberer` — DER ZAUBERER MIT BEIDEN HAENDEN
- ✅ `pruefe-runde89-ballon` — DIE ZWEI LUFTBALLON-VARIANTEN, WIE ER SIE GENANNT HAT
- ✅ `pruefe-runde89-bleibt` — WAS BLEIBEN SOLL, BLEIBT AUCH
- ✅ `pruefe-schallwelle` — MISST, OB DIE SCHALLWELLE EINE KANTE HAT.
- ✅ `pruefe-schiffe60` — PADDELN UND DAS SEITENRAD
- ✅ `pruefe-schrei-echo` — MISST DEN NEUEN SCHREI — TON UND WELLE.
- ✅ `pruefe-schrei-ohne-stimme` — PRÜFT: GESCHRIEEN WIRD AUCH OHNE DEUTSCHE STIMME.
- ✅ `pruefe-schrei-stimme` — PRÜFT DEN SCHREI: STIMME NACH GESCHLECHT UND ECHTES ECHO.
- ✅ `pruefe-schrei-wackeln` — LAUFEN BEIM SCHREIEN BEIDE EFFEKTE GLEICHZEITIG?
- ✅ `pruefe-schreien` — PRÜFT DAS SCHREIEN.
- ✅ `pruefe-scrollen` — PRÜFT, OB MAN IM CHATVERLAUF OBEN BLEIBEN KANN.
- ✅ `pruefe-seitsitz` — PRUEFT DIE ELFTE HALTUNG: SEITLICHES SITZEN
- ✅ `pruefe-sprechbild-reist` — SIEHT MAN DAS SPRECHBILD DER ANDEREN?
- ✅ `pruefe-sprechbilder` — DIE SPRECHBILDER — SECHZEHN STUECK, JEDES ANDERS
- ✅ `pruefe-sprecherbalken` — PRÜFT DEN SPRECHERBALKEN IN DEN DREI FÄLLEN.
- ✅ `pruefe-stimmzeilen` — PRÜFT DIE DREI ZUSTÄNDE EINER WORTMELDUNG IM CHAT.
- ✅ `pruefe-strudel61` — DER STRUDEL IST EIN WIRBEL, KEINE ZIELSCHEIBE
- ✅ `pruefe-tipps` — PRÜFT: DIE ERKLÄRUNG ZUM BEFEHL IST AUCH AUF DEM TELEFON DA.
- ✅ `pruefe-tonlage` — WELCHER TON LAEUFT WANN? — EIN MITSCHNITT, KEINE MEINUNG
- ✅ `pruefe-tonliste` — JEDER TON, DEN DER PLAN NENNT, MUSS AUCH KLINGEN
- ✅ `pruefe-tonriegel` — PRÜFT, OB EIN BLOCKIERTER TON DEN RAUM ANHÄLT.
- ✅ `pruefe-tonschleifen` — SPIELT EIN GERAEUSCH LAENGER, ALS ES SOLL?
- ✅ `pruefe-tutor-stuecke` — PRÜFT: DER TUTOR ERKLÄRT EINEN BEREICH IN MEHREREN STÜCKEN.
- ✅ `pruefe-tutor` — MISST, OB DER TUTOR SPRINGT ODER DOPPELT SPRICHT.
- ✅ `pruefe-tutorbild62` — DAS STANDBILD KLEBT NICHT MEHR HINTER DEM FILM
- ✅ `pruefe-tutorfilm34` — IST JEDER TUTOR-FILM FREIGESTELLT — UND HAT ER SEINE MASKE?
- ✅ `pruefe-tutorreiter` — const { chromium } = require("/tmp/claude-0/node_modules/playwright"); const http = require("http"), fs = require("fs"), path = require("path"); const WURZEL = "/home/user/Deutsch-Mit-Xander"; const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
- ✅ `pruefe-tutorstimme34` — HAT DER TUTOR UEBERALL EINE STIMME — UND DEN GRUSS FUER GAESTE?
- ✅ `pruefe-verlauf-doppelt` — PRÜFT: DIESELBE ZEILE STEHT NICHT ZWEIMAL DA.
- ✅ `pruefe-verlauf-kein-reset` — SETZT EIN ANKOEMMLING MEINEN CHAT ZURUECK?
- ✅ `pruefe-verlauf-nachfassen` — PRÜFT, OB DER GEMEINSAME VERLAUF WIRKLICH NACHGEHOLT WIRD.
- ✅ `pruefe-waehler-zu` — GEHT EIN WAEHLER WIEDER ZU?
- ✅ `pruefe-wagenheber` — JEMANDEN AUF EINEN ANDEREN PLATZ SETZEN
- ✅ `pruefe-wartende-zeilen` — PRÜFT: EINE ZEILE OHNE LEITUNG GEHT NICHT VERLOREN.
- ✅ `pruefe-zeilenhoehe` — MISST, OB NAME UND TEXT AUF DERSELBEN GRUNDLINIE STEHEN.
- ✅ `pruefe-zensur-fokus` — PRÜFT DREI GEMELDETE SACHEN AUF EINMAL.
- ✅ `pruefe-zusatzfelder` — JEDES FELD, DAS EIN EFFEKT LIEST, MUSS AUCH ANKOMMEN

## Was diese Liste NICHT belegt

- **Zwei Geraete, zwei Menschen.** Jede Sonde misst EINEN Browser.
  Dass eine Wirkung auch auf dem iPhone des anderen ankommt, haengt an
  Supabase und am Netz — das steht in `pruefe-leitung` und
  `pruefe-paketverlust`, aber ein echter Raum mit acht Leuten ist etwas
  anderes als eine Messung.
- **Ob es schoen aussieht.** Eine Sonde misst, dass die Schwungfedern nach
  hinten zeigen und der Daumen nicht abgespreizt ist. Ob der Adler
  aussieht wie ein Weisskopfseeadler, entscheidest du.
- **Klang.** Dass ein Ton zur richtigen Millisekunde startet, wird gemessen.
  Wie er klingt, nicht.
- **Was du als Zukunft genannt hast** (z. B. das Flugzeug als weitere
  Reise) steht bewusst noch nicht drin.
- **Eine Sache habe ich nicht gebaut** und werde es nicht: das Ausziehen von
  Unterwaesche an den Profilbildern anderer Leute im Klassenzimmer. Alles
  andere aus deinen Listen ist gebaut oder steht als offener Punkt drin.

## Alles, Sonde für Sonde

### ✅ BLEIBEN DIE ANIMATIONEN IM CHAT?  
`pruefe-animationsbuehne`

> „Die Grenze fuer die Animation ist immer der Chat-Boden, so wie es bisher war. Aber wenn ich nach oben scrolle, sollen die Animationen nicht die Links verdecken oder irgendwas anderes. Die Animationen sollen im Bereich des Chats bleiben.“

### ✅ PRÜFT: DAS SYSTEM RÄT NICHT MEHR, ES WEISS.  
`pruefe-antwort-gehoert-dazu`

> „Du sollst nicht Trick 17 machen und einfach überall eine Benotung dranmachen, sondern es soll die Benotung für die Aufgabe sein. Es soll dazugehören, und das soll das System verstehen, dass diese Antwort von der Aufgabe kommt und deswegen soll die Benotung dranstehen für diese Klasse.“

### ✅ PRÜFT: DIE AUFGABE GEHÖRT DEM RAUM, NICHT DEM GERÄT.  
`pruefe-aufgabe-reist`

> „Die Benotung wird immer noch nicht angezeigt zu der Antwort, die von der Frage kommt.“

### ✅ PRÜFT, WANN EINE ZEILE ALS ANTWORT AUF EINE AUFGABE GILT.  
`pruefe-aufgabe`

> „Ich moechte diese Benotung nicht global haben, nur an den Antworten von den Aufgaben. Die Stelle, wenn es wirklich als diese Antwort von dieser Aufgabe erkannt wird, soll rechts Note stehen.“

### ✅ PRÜFT DIE KLASSENZIMMER-AUFGABEN.  
`pruefe-aufgaben`

> „Einmal, dass man die Wörter verdrehen kann … und die Leute sollen richtig schreiben, wie es richtig geschrieben wird … und das gibt Punkte.“

### ✅ HAT DIE AUFGABE EINE FUNKTION?  
`pruefe-aufgabentafel`

> „Die Aufgabe hat keine Funktion. Man schreibt einen ganzen Satz, und der ganze Satz ist eingerahmt, und es hat ueberhaupt keine Funktion — man kann nur den Satz anklicken, und das ist quasi die Loesung. Was soll das fuer eine Aufgabe sein?“

> „Das wird bei anderen nicht angezeigt.“

### ✅ GEHT EIN BEFEHL, DEN ES NICHT GIBT, TROTZDEM HINAUS?  
`pruefe-befehl-unbekannt`

> „Ich moechte, dass es Befehle, die es nicht gibt, nicht schickt — also zum Beispiel, wenn ich schreibe /hallo, dass das nicht gesendet wird.“

> „/me/" bleibt eine ganz normale Zeile, ein Bruch wie „3/4“

### ✅ PRÜFT DAS BEFEHLS-PANEL AM SCHRÄGSTRICH.  
`pruefe-befehlspanel`

> „Sobald ich den / schreibe, sollen die Kategorien alle da sein — Favoriten und was man so machen möchte … und da steht dann ein kleiner Hinweis, aus welcher Sektion das kommt, oder die Rändchen um den Befehl sind farbmarkiert und man hat eine Legende daneben.“

> „/" die Kategorien? 2. Steht jeder Befehl mit seinem Zeichen da? 3. Hat jeder Befehl einen FARBIGEN Rand — und ist die Farbe dieselbe wie in der Legende? 4. Filtert ein Klick auf eine Kategorie wirklich? 5. Schickt „🐧“

### ✅ KEINE ABZWEIGUNG DARF HINTER IHRER TABELLE STEHEN  
`pruefe-befehlsreihenfolge`

> „Ausserdem geht deine Luftballon-Animation nicht einfach so.“

> „Ich kann den Ausschnitt waehlen … ich kann mir das Lied noch nicht anhoeren.“

> „Diese Abzweigung muss VOR AM_PLATZ stehen“

> „Alex setzt Kopfhoerer auf Bea 1“

### ✅ PRÜFT DEN BEFUND (/diagnose): LEITUNG, REIHE UND UHREN.  
`pruefe-befund`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ PRÜFT DEN NOTENKNOPF AN DER NACHRICHT.  
`pruefe-benoten`

> „Es gibt keine Notenanzeige, nachdem sie mir den Satz geschickt hat.“

> „Bei normalen Nachrichten soll dieses Zensieren nicht dabeistehen.“

> „Ich moechte diese Benotung nicht global haben, nur an den Antworten von den Aufgaben.“

### ✅ PRUEFT DIE BETONUNGSUEBUNG — AN DER ECHTEN SEITE  
`pruefe-betonung-uebung`

> „Bau gleich noch eine Betonungsuebung ein: wenn ich ein Wort oder einen Satz schreibe, wird im Woerterbuch danach gescannt, ob es diese Woerter gibt … dass die Leute die anklicken koennen, die betont werden … und dass ich das auch benoten kann ganz normal.“

### ✅ PRÜFT, OB DAS KLASSENZIMMER DAS KONTO ÜBERHAUPT FINDET.  
`pruefe-betreiber`

> „Zum Unterricht rufen darf nur der Betreiber … Emmi ist gerade nirgends zu finden und das Postfach steht hier nicht zur Verfügung.“

> „Backend" gibt es also, „window.Backend“

### ✅ PRÜFT: BILDER FLÜSTERN, UND DER UMSCHALTER IST FÜR JEDEN DA.  
`pruefe-bild-fluestern`

> „Mach es bitte ausserdem möglich, dass wir uns Bilder flüstern können.“

> „Bei Emmi gibt es diesen Umschalter nicht zwischen den zwei Plätzen und dem Klassenzimmer.“

### ✅ GEHT DAS BILDERFACH NACH DER WAHL WIEDER ZU?  
`pruefe-bildwaehler-zu`

> „Wenn man sich ein Bild aussucht und dann in dieses Panel klickt, um sich das Bild auszusuchen, dann soll sich das eigentlich wieder schliessen — aber es schliesst sich nicht. Und die Auswahl fuer die GIPHY- Bilder: da sind meine Favoriten nicht.“

### ✅ MISST, OB DIE SYMBOLE IN DER SPRECHBLASE BLEIBEN.  
`pruefe-blase`

> „Bei Android sind die Symbole immer noch nicht in der Blase. Das muss gesperrt sein innerhalb der Blase, die dürfen nicht darüber hinaus ragen. Und das Herunterladen-Symbol soll erkennbar sein und das Zurückrufen-Symbol auch.“

> „In den Android-Sprechblasen kann man zwar die Zeit, den Download und das Zurückrufen sehen, allerdings nicht mehr die kleine Wellenform. Die kann ruhig kleiner dargestellt werden oder kürzer, damit die anderen Symbole passen.“

### ✅ PRÜFT DAS BOXEN — HIN UND ZURÜCK.  
`pruefe-boxen`

> „Mach jetzt bitte mal die Box-Animation und die Rückanimation fertig, dass sie auch kommt, wenn man schreibt, dass ich jemand anderen boxe.“

> „/box Emmi" schrieb, während sie auf ihrem Platz „Emmy“

### ✅ PRÜFT DIE BÜHNENANSICHT UND DIE BEIDEN SPRECH-EFFEKTE.  
`pruefe-buehne`

> „Mach die Bühnenansicht fertig, die man wechseln kann zwischen der klassischen und zwischen den beiden Personen, die nur sich selbst sehen, wenn sie nur zwei auf der Bühne sind.“

> „Bei dem Sprechen die Effekte — der Regenbogen deutlicher und das magische Funkeln als eigener Effekt.“

### ✅ IST JEDE ANIMATION AUCH AUFRUFBAR?  
`pruefe-effekttueren`

> „Die Keks-Animation fehlt. Die Cash-Animation fehlt. Das mit dem zerbrochenen Glas geht nicht. Die Animationen, die du neu gemacht hast, sind noch nicht aufrufbar.“

### ✅ PRÜFT, WARUM „/i Emmy" NICHT ABGESCHICKT WERDEN KANN.  
`pruefe-einladen`

> „/i Emmy" NICHT ABGESCHICKT WERDEN KANN. --------------------------------------------------------------- GEMELDET: „Wenn ich invite Emmy mache, kann ich das nicht mehr abschicken. Das liegt wahrscheinlich daran, dass das irgendwie blockiert ist.“

### ✅ PRÜFT, OB EIN EINLADUNGSLINK WIRKLICH IM KLASSENZIMMER LANDET.  
`pruefe-einladungslink`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ PRUEFT AN DER ECHTEN SEITE: TUT /film WIRKLICH ETWAS?  
`pruefe-film-befehl`

> „Es funktioniert im Chat noch nicht. Ich habe auch /trex versucht, aber das geht nicht.“

### ✅ IST JEDER FILM WIRKLICH DURCHSICHTIG?  
`pruefe-film-durchsichtig`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ PRUEFT DIE FILMKETTE: AUS GRUEN WIRD DURCHSICHTIG  
`pruefe-film-freistellen`

> „Wie machen die das bei TikTok, dass da ein Loewe durchs Bild rennt und einfach nur ueber dem Chat liegt?“

### ✅ PRUEFT: ZEIGT EIN GESCHENK JETZT DEN FILM?  
`pruefe-film-geschenk`

> „Man sieht die nur noch nicht — baue das bitte mit ein in die Tiere und Fahrzeuge.“

> „Ich habe auch /trex versucht, aber das geht nicht.“

### ✅ PRUEFT DIE DREI GEMELDETEN FEHLER — GEMESSEN, NICHT GEGLAUBT  
`pruefe-film-platz`

> „Das Video bleibt nicht an Ort und Stelle, sondern es springt nach oben über die Besucher im Chat und geht dort weiter … das darf nicht auf der Achse von unten nach oben springen.“

> „Die Videos unterbrechen ständig mindestens zwei oder dreimal, die sind nicht vollständig.“

> „waiting"-Ereignisse (jedes ist ein Aussetzer) und am Ende geprueft, ob die Spielzeit die volle Laenge erreicht hat. 3. „Man hört nicht den Sound von den Videos.“

### ✅ PRUEFT DEN FILMSPIELER — BEIDE WEGE  
`pruefe-filmspieler`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ PRÜFT: FLÜSTERN FOLGT DER PERSON, NICHT DEM RAUM.  
`pruefe-fluester-nachreichen`

> „Wenn ich jemandem auf sein Fluestern antworte und derjenige ist im selben Moment dabei zu gehen und kann die Nachricht nicht mehr lesen — dann moechte ich, dass er sie spaeter trotzdem sieht … egal in welchem Raum sie ist, chronologisch, unabhaengig vom Raum.“

### ✅ PRÜFT: EIN TIPP AUF EINE FLÜSTERZEILE BEREITET DIE ANTWORT VOR.  
`pruefe-fluestern`

> „Wenn man eine zugefluesterte Zeile antippt, dann soll in dem ,Schreib etwas'-Feld direkt die Formatierung schon so dastehen, dass man diesem Menschen fluestern antworten kann.“

### ✅ WER DARF DEN FOKUS-MODUS SCHALTEN?  
`pruefe-fokus-betreiber`

> „Emmi hat mir gerade gesagt, dass sie den Fokus-Schalter auch hat. Er ist nicht fuer die anderen. Der ist fuer mich, falls ich das Kontingent weiter nutzen moechte. Das ist nur fuer mich zur Kontrolle — ist ja mein Geld. Wir muessen ja sowieso die automatische Regel haben: wenn das aufgebraucht ist, dass es dann blockiert und wieder in den Fokus-Modus zurueckgeht.“

### ✅ PRUEFT: UEBERLEBT DIE FOKUS-REGEL DAS NEULADEN?  
`pruefe-fokus-merker`

> „Ich hab es extra eingestellt, dass wir uns alle gleichzeitig hoeren koennen, und trotzdem geht es nicht … bei ihr stand im Screenshot auch Fokus.“

### ✅ PRÜFT, OB EINE NACHGEHENDE UHR DIE REIHENFOLGE VERSCHIEBT.  
`pruefe-fremde-uhr-reihenfolge`

> „Die Uhr von Emmy geht 5 Sekunden nach. Das stört das Hören nicht mehr. Die Reihenfolge im Verlauf kann es aber verschieben.“

### ✅ PRÜFT: EINE FALSCH GEHENDE UHR SCHALTET NIEMANDEN STUMM.  
`pruefe-fremde-uhr`

> „Emmy kann mich auf ihrer Seite nicht mehr hören.“

### ✅ DAS GALGENMAENNCHEN — BUCHSTABE FUER BUCHSTABE  
`pruefe-galgenmaennchen`

> „Einige Aufgaben gehen noch nicht wie das Galgenmaennchen. Da ist einfach ein ganzer Satz angezeigt und den kann man nur einmal auswaehlen, aber die einzelnen Buchstaben sind nicht auswaehlbar, einzutragen, auch keine voreingestellten Buchstaben, die schon da sind, die man ausfuellen kann.“

### ✅ PRUEFT: ERKENNT DIE WARTEMELDUNG, DASS EMMI EINE FRAU IST?  
`pruefe-geschlecht`

> „Wenn die Blase mich erinnert, dass ich noch warten soll, weil jemand spricht, dann soll sie korrekt erkennen, wenn Emmi spricht, dass es eine Frau ist. Sie hat ja in ihrem Profil dieses Geschlechtszeichen — das soll auch erkannt werden.“

### ✅ GIPHY: FAVORITEN UND EIGENE SUCHEN  
`pruefe-gif-favoriten`

> „Die Favoriten, die man bei GIPHY macht, sollen sich immer im Profil mitspeichern, sodass man das auf einem anderen Geraet auch wiederfindet … Dann sollen auch die Suchen, die man gemacht hat, als Auswahl mit dabeistehen … Und die Favoriten, die ich oft auswaehle, das soll automatisch in den Favoriten sein.“

### ✅ PRUEFT DAS GLUECKSRAD — AN DER ECHTEN SEITE  
`pruefe-gluecksrad`

> „Dann noch als Variante fuer einen gesuchten Satz wie bei Gluecksrad — dass ich einen Satz oder eine Redewendung schreibe und ein paar Buchstaben schon in den Feldern stehen, ohne den Chat irgendwie in seinem Designfluss zu beeintraechtigen.“

### ✅ SIND ES HAENDE ODER HOLZTEILE?  
`pruefe-haende`

> „Der Daumen von der winkenden Hand ist noch nicht realistisch, und die klatschenden Haende sehen somit auch nicht natuerlich aus — die sind immer noch verschachtelt. Unten ist immer noch so eine Box und dann die aufgestellten Dinger. Das sind kleine Holzhaende. Das sind natuerliche Haende. Die haben zwar auch in der Natur ihre Konturen, aber nicht so auffaellig, dass sie aussehen wie Roboter oder hoelzern.“

> „Box mit den aufgestellten Dingern“

### ✅ TUT JEDER BEFEHL, DER IN DER LISTE STEHT, AUCH ETWAS?  
`pruefe-jeder-befehl`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ DAS KATAPULT IST EIN ONAGER GEWORDEN  
`pruefe-katapult60`

> „Der Katapult sieht auch nicht schoen animiert aus.“

> „transform-origin: 50% 100%“

### ✅ ZIEHT DER BROWSER DIE SEITE VON SELBST HERAN?  
`pruefe-kein-zoom`

> „Man wählt irgendwas an und dann muss man immer dieses Pinch machen mit den Fingern, damit man das Bild wieder zusammenzieht, weil das plötzlich ein bisschen aufgegangen ist.“

### ✅ PRÜFT DEN KLICK INS LEERE DES CHATS.  
`pruefe-leere`

> „Das mit den Sprachnachrichten abrufen per Klick in den leeren Bereich des Chats geht immer noch nicht“

> „bei einer Zeile von den ASCII-Codes, wenn ich da links daneben klicke, wo die Uhrzeit auch ist.“

### ✅ PRÜFT: EINE HÄNGENGEBLIEBENE WORTMELDUNG BLOCKIERT NICHT MEHR.  
`pruefe-leitung`

> „Manchmal hängt sich die Sprachnachricht auf, also dieser grüne Balken, und er bleibt dann stehen. Gibt es eine Möglichkeit zu überprüfen, ob die Leitung frei ist und ob das nur ein Hängen ist? Ich würde gern weitersprechen und muss jedes Mal die Seite neu aktualisieren.“

### ✅ PRÜFT: ALTE BEDIENUNGSHINWEISE VERSCHWINDEN AUS DEM VERLAUF.  
`pruefe-muell`

> „Alles, was ich im Chat gesammelt habe mit ,Du bist hier Haeuptling', das koennte auch wieder raus.“

### ✅ PRÜFT DEN FALL, DER SECHS RUNDEN GEKOSTET HAT.  
`pruefe-nachgehende-uhr-effekte`

> „Die Uhr von Emmy geht 5 Sekunden nach.“

> „Emmi boxt alle … Die Box-Animation ist immer noch nicht da, auch die von der Umarmung nicht, auch die von dem Lecken nicht.“

### ✅ PRÜFT: NAMENSVORSCHLÄGE UND SELBST ANGEHEFTETE FAVORITEN.  
`pruefe-namensvorschlaege`

> „Wenn ich /w schreibe, sollen mir die anzuflüsternden Namen vorgeschlagen werden — egal, ob die Person in einem anderen Raum ist. Es soll alle Räume kennen, alle Personen, egal ob abgeschlossen oder nicht.“

> „Meine Favoriten kann ich immer noch nicht anlegen.“

### ✅ PRÜFT: MERKT DIE SEITE, DASS SIE ALT IST?  
`pruefe-neue-fassung`

> „Bei Emmi gibt es diesen Umschalter nicht zwischen den zwei Plätzen und dem Klassenzimmer.“

### ✅ VERSCHIEBT SICH DAS BILD DURCH EINE ANIMATION?  
`pruefe-nichts-verrutscht`

> „Achte darauf, dass sich das Bild nicht mehr verschiebt durch die Dinos, oder dass sich generell das Bild nie wieder verschiebt durch irgendeine Einstellung, die man macht.“

### ✅ PRÜFT DEN GANZEN WEG EINER NOTE — VOM KNOPF BIS ZU IHR.  
`pruefe-note-ankommen`

> „Die Benotung zeigt es immer noch nicht an, das Mädchen versucht es die ganze Zeit und ist schon am Verzweifeln. Mache es möglich, dass ich sie anklicken kann als Betreiber und dass sie auf der anderen Seite diese Note auch wirklich kriegt, mit einer Meldung, dass sie die Note kriegt.“

### ✅ PRÜFT, OB DER NOTENKNOPF AN DER ANTWORT STEHT — AUCH NACH DEM NEULADEN UND AUCH BEI EINER AUFGABE IN EIGENEN WORTEN.  
`pruefe-notenknopf-aufgabe`

> „Ich kann, wenn sie eine Aufgabe löst, immer noch nicht diesen Note-Button sehen, um sie zu benoten für die Aufgabe. Das Ding muss erkennen, dass sie von der Aufgabe kommt mit ihrer Antwort, damit ich weiß: diese Antwort gehört zu der Frage, die sie beantwortet hat.“

### ✅ MISST DIE ZEILE MIT DEM NOTENKNOPF.  
`pruefe-notenknopf`

> „Die Nachrichten von Emmi stehen immer noch unter der Uhrzeit und nicht im Chat. Sie sind senkrecht nach unten, jedes Wort einzeln auf einer eigenen Zeile. Die Note steht auch mit ihren Einzelbuchstaben von oben nach unten: N dann O dann T E.“

### ✅ PRÜFT, OB EINE WORTMELDUNG EIN VERLORENES PAKET ÜBERLEBT.  
`pruefe-paketverlust`

> „Emmy sagt, sie würde versuchen zu sprechen, es kommt aber nicht durch … Geht das nur in Deutschland?“

### ✅ PRÜFT, DASS DIE PILLE NIE ÜBER DEM CHAT-KOPF LIEGT.  
`pruefe-pille`

> „Diese Sprechblase liegt immer noch über dem Chat-Kopf. Sie soll darunter liegen, ohne den Chat zu verschieben.“

### ✅ PRÜFT JEDEN PLATZ IM BILDERRÄTSEL GEGEN SEINEN EIGENEN SZENENTEIL.  
`pruefe-plaetze`

> „Da steht, das Mädchen mit der gelben Bluse steht am Waschbecken — sie steht aber vor der Waschmaschine.“

> „Eine Frau steht komplett im Koffer statt auf dem Gleis.“

> „teil" das Ding, an dem die Figur stehen soll. Damit lässt sich RECHNEN statt hinsehen. Geprüft wird dreierlei: 1. Ist die Figur überhaupt bei ihrem eigenen Teil? 2. Stehen die Füsse auf dem Boden — oder schwebt sie? 3. Steckt sie in einem gemalten MENSCHEN? Warum nur Menschen bei 3: die Szenen sind flache Seitenansichten ohne Tiefe. „Vor der Küchenzeile stehen“

> „in der Küchenzeile stecken“

### ✅ DAS PLATZDESIGN BLEIBT STEHEN — BEI JEDEM EFFEKT  
`pruefe-platzdesign`

> „der Strudel saugt die Platzzahl mit weg und die Strichlinie“

> „das Knüllen knallt den Platz mit weg, also die Strichlinie und die Positionsnummer“

> „beim Tennis ist die Strichlinie und die Platznummer komplett weg“

> „die Sanduhr beeinflusst auch die Strichlinie und die Platznummer“

### ✅ DAS MENUE AM PROFILBILD — UND WAS ES AUSLOEST  
`pruefe-platzmenue`

> „Wenn man jemand anderen gedrückt hält, dann sollen nur diese Befehle sein … es könnte noch ein Kick sein, wo man gegen das Profilbild tritt und das dann wie so ein Fussball wegfliegt … Man kann auch die Herzen direkt an die Person schicken … oder dass man Wassereimer drüber kippt … oder eine Wolke über denjenigen, wo man es regnen lässt … Aber das sind dann nur ganz kleine Symbole, die halt passend in der Größe vom Profilbild sind.“

> „in der Groesse vom Profilbild“

### ✅ PRÜFT, OB AUS DER EINLADUNG EIN KNOPF WIRD — UND OB ER HINFÜHRT.  
`pruefe-postfach-knopf`

> „Im Briefkasten steht nur die Adresszeile, wenn man zum Unterricht soll, aber es ist kein Sprunglink, der direkt in diesen Raum befördert. Wir hatten früher das immer so, dass man das anklicken konnte über eine Schaltfläche.“

> „Lernen" — es hängt unter „Wissen“

### ✅ PRÜFT: DER VERLAUF BLEIBT IM VERLASSENEN RAUM LIEGEN.  
`pruefe-raumverlauf`

> „Der Verlauf soll in einem verlassenen Raum bleiben — dass man alle Nachrichten dort auch wieder sieht, wenn man in diesen Raum zurueckkehrt, nachdem man ihn komplett verlassen hat.“

### ✅ PRÜFT: WER IN EINEN ANDEREN RAUM GEHT, HAT NICHT „VERLASSEN".  
`pruefe-raumwechsel`

> „VERLASSEN". --------------------------------------------------------------- GEWUENSCHT: „Wenn man einen Raum verlaesst auf die Art, dass man einen anderen Raum erzeugt, dann soll im Chat stehen: ,Emmi ist in den Raum Langeweile gegangen' — nicht nur ,sie hat den Raum verlassen'. Nur sie hat den Raum verlassen, wenn sie wirklich was anderes gemacht hat.“

### ✅ PRÜFT DIE REIHENFOLGE DER SPRACHSTÜCKE.  
`pruefe-reihenfolge`

> „Emmys Nachrichten sind kaum zu verstehen. Das klingt so, als wenn sie rückwärts spricht.“

### ✅ BOOT UND BAUSTELLENKRAN — DIE ZWEI NEUEN REISEN  
`pruefe-reisen34`

> „eine Variante mit dem Flugzeug ... und eine Variante vielleicht noch mit einem Boot ... oder dass man einen Baustellenkran hat, der einen dann dahin hebt.“

> „viele der neuen Animationen funktionieren noch gar nichts. Sie sind einfach nicht sichtbar.“

### ✅ PRUEFT: ZEIGEN DIE ZÄHNE DES TYRANNOSAURUS INS MAUL?  
`pruefe-rexzaehne`

> „Der hat die falschen Zähne, die Zähne gehen nach oben.“

### ✅ PRÜFT DEN PAPIERKORB MIT FRIST.  
`pruefe-ruecknahme`

> „Das Rückruf-Symbol soll man wieder rückgängig machen können … wenn es aber zu lange ignoriert wurde, dann kann es nicht mehr wiederhergestellt werden.“

### ✅ WAS ER EINZELN NACHGEFORDERT HAT  
`pruefe-runde15`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ PAC-MAN, DIE FAHRLINIE UND DAS AUFESSEN  
`pruefe-runde16`

> „dass man den anderen wie so ein Keks aufessen kann … Biss für Biss“

> „zufällig durch die Plätze springen lassen, bis es irgendwann einen neuen Platz gefunden hat“

> „sein Profilbild so hoch wirft und mit so einem großen Tennisschläger … weg schlägt“

> „dann fällt das in den Loch und verschwindet, wie beim Bowling“

### ✅ PLATZWAHL, DIE STEHENDE NUMMER UND DER AUFGERAEUMTE EFFEKTKASTEN  
`pruefe-runde18`

> „am Ende soll dieses typische Pfeil sein mit der Feder … auf der Seite, wo die Spitze ist, soll der Saugnapf sein“

> „sie soll richtig in meiner Hand sein, von meinem Profil ausgehend … dass die ganze Distanz abgedeckt wird“

> „man soll die Leute zu sich heranziehen“

> „weil ich von links nach rechts stosse … muss die Kugel nach rechts weiter fallen, ins naechste Loch“

### ✅ DOPPELTES HOEREN, DER PANIK-KNOPF UND DIE AUFGABEN, DIE WIRKLICH AUFGABEN SIND  
`pruefe-runde20`

> „Dann wurde mir oft gemeldet, dass nach einiger Zeit die Leute sich irgendwie doppelt gehoert haben … Entweder du fixt es fuer die Zukunft generell, dass so etwas nie wieder passieren kann … oder du gibst den Leuten eine Art Panic-Button, wo sie ihr Audio selber fixen koennen.“

> „Hast du auch das /aufgabe geloest? Also dass man da nicht einfach nur einen Satz schreibt und dieser Satz dann komplett anklickbar dasteht und eigentlich gar keine Aufgabenfunktion hat.“

> „Dann moechte ich eine Kontextaufgabe … dass die Leute diese Saetze sortieren, damit die Geschichte von oben bis unten logisch Sinn macht.“

> „Zum Beispiel sehe ich die Sprechbild-Animation von den anderen nicht, wenn sie sprechen.“

### ✅ RUNDE 21 — LESEN IM CHAT  
`pruefe-runde21`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ DER GEZEICHNETE WEG, DAS EIGENE ECHO, DER LEERE PLATZ HINTER DEM STRUDEL UND DIE MUSIK  
`pruefe-runde22`

> „Dann funktioniert das mit dem Angelhaken und mit dem Lasso nicht, egal was man waehlt. Es springt immer zwischen Angeln und Lasso hin und her … mit der Angel soll man ihn irgendwohin ziehen koennen und mit dem Lasso soll man ihn eigentlich zu sich heranziehen.“

> „Zeichnen beschreibt den Weg, den man machen moechte, in der naechsten Auswahl. Wenn man die Linie gezeichnet hat, soll man bestimmen, ob fahren oder laufen … Da muesstest du auch kein extra Menue machen.“

> „Man geht jetzt los, und die Nummer mit der Strichlinie, dieser Kreis ist gar nicht mehr sichtbar.“

> „Ich weiss ja nicht, wann die doppelte Stimme kommt … dass ich mich selber niemals hoeren kann. Vielleicht kannst du das in diesen Tonschalter mit einbauen.“

### ✅ VORLADEN, BEVOR ES GEBRAUCHT WIRD, DIE TRANSPORTLEISTE UND DAS FRISCHE WETTER  
`pruefe-runde23`

> „Die Tiere laden immer noch so lange … es soll auch kein Ladebalken mitten im Chat sein.“

> „Man soll in dem Moment, wo man / schreibt, bevor man ihn ueberhaupt absendet, sollen die Effekte sich schon anfangen zu laden, ohne dass man das spuert — im Hintergrund soll das passieren … /l laedt alle Inhalte mit L … in dem Moment, wo man die Sektion Tiere anklickt, sollen alle Tiere von den Animationen schon geladen sein, dass der Loewe sofort fluessig abspielt.“

> „Wenn ich bei jemand anderem die Kopfhoerer aufsetzen soll, einmal der normale Effekt, und einmal soll ich die Moeglichkeit haben, nur ihn alleine mein Lied hoeren zu lassen, was ich selber aussuchen kann.“

> „Ich brauche fuer das Lied entweder eine Art kleine Transportleiste oder auch einen Pause-Befehl irgendwo.“

### ✅ LESEN NACH KATEGORIEN, DER FOKUS, DIE BETONUNG UND DER KONTEXTER  
`pruefe-runde24`

> „Kannst du das so machen, dass, wenn jemand diese Texte liest und auf seine Zeile klickt, dass der Text dann immer im Fokus bleibt … die Zeile, wenn sie angewaehlt ist, die soll immer den Text an Platz halten … und wenn man wieder die Zeile anklickt, dass es die Aufgabe unter den bestehenden Chat schiebt.“

> „Dann moechte ich auch, dass ‚Es war einmal in Deutschland' auch in den Texten zu finden ist. Du kannst das auch nach Kategorien in dem Panel machen bei dem Lesen … vielleicht auch mit der Option, die Betonung beim Lesen anzuschalten … Es war einmal in Deutschland, eigene Beitraege, Dichter und Denker, Schnee von gestern, Menschen Dinge Situation.“

> „Und diesen Kontext-Text brauche ich noch, dass die Leute eine Reihenfolge in einer Geschichte logisch zusammensetzen koennen. Den Kontextsortierer … KONTEXTER. Also koennte man das Ding nennen.“

### ✅ DIE AUFGABE MIT SINN, DER WOERTERBUCH-LINK, DAS AUFDECKEN FUER ALLE UND DAS RUNDENLAUFEN  
`pruefe-runde25`

> „Und bei Aufgabe gibt's immer noch keinen richtigen Sinn in der Aufgabe. Was ist deine Strategie fuer diese Aufgabe?“

> „vielleicht sofern das moeglich ist auch einige der Spiele, die fuer den Chat kompatibel sind, zum Beispiel Artikel raten … dass man im Chat sogar auf den Link im Woerterbuch zugreifen kann … Das Ganze soll dann natuerlich auch benotet werden koennen.“

> „Dann ist bei diesem Aufdeckspiel — sehen die anderen das immer noch nicht und da soll, wie gesagt, das Runden laufen.“

### ✅ DIE TAGESGRENZE UND DER TON  
`pruefe-runde27`

> „Bei mir steht: das Gespraechs-Kontingent ist aufgebraucht, ab jetzt gilt der Fokus-Modus … und drunter: dieses Geraet laeuft ohne eigenes Relais, ueber Netze hinweg Deutschland – Aegypten kann der Ton deshalb ausbleiben. Dieses Konto hat heute schon 60-mal Zugangsdaten geholt … kann man nicht 100.000-mal Request machen? … Ich moechte in Zukunft die Leute immer hoeren.“

### ✅ WHITEBOARD, BILLARD ZU DRITT, SCHNEEKUGEL, GEMEINSAM FAHREN, BETONUNG IM LESETEXT, T-REX  
`pruefe-runde29`

> „Ich moechte ein Whiteboard implementieren … dass die Plaetze, die oben sind, nach unten wandern und das Whiteboard nach oben … Ich moechte das Layout nicht erweitern … man kann in das Whiteboard Bilder einladen … an jeder Stelle im Bild eine Markierung zeichnen … oder ein Pointer, dass die Markierung dort blinkt … dass ich den Leuten das reinzoomen kann.“

> „Beim Billard soll es so sein, dass zufaellig einer von allen teilnimmt: wenn mehr als zwei Leute teilnehmen, soll die eine Kugel, die man anstoesst, die anderen beeinflussen und einer von denen soll zufaellig in ein leerstehendes Loch fallen.“

> „Dann moechte ich noch einen Effekt haben, der Schneekugel heisst.“

> „wenn ich mit jemandem gemeinsam fahren will, dann kriege ich sein Profilbild an … und dann fahren wir einfach weg.“

### ✅ ECHTE GERAEUSCHE, SCHIFFE VERSENKEN, BLUBBERNDES PROFILBILD, FESTE REIHENFOLGE  
`pruefe-runde30`

> „dass du jetzt einen richtigen Sound dazu machst … viele Sounds stimmen einfach noch nicht … der Drill von dem Pfeil … wenn man den Hut aufsetzt, dann koennte so ein YIHAAH wie bei den Cowboys kommen … bei der Peitsche selber kann einfach nur ein Peitschenknall sein … bei dem Angelhaken soll man dieses Einholen der Angelschnur hoeren … das Fenster aufmachen soll auch nach Fenster oeffnen klingen … Behalte gerne die alten Sounds im Hintergrund als Fallback.“

> „Bei dem Fahren ein realistisches Fahrgeraeusch und dann ein Quietschgeraeusch, wenn er da wirklich landet.“

> „bei dem Blubbern haette ich gern, dass das Profilbild in vielen kleinen Blasen dargestellt ist.“

> „dann moechte ich noch ein Schiffe versenken spielen … jeder sucht sich einen Platz, versteckt sich … das duerfen die anderen natuerlich nicht sehen … dann ist jeder nach der Reihe dran.“

### ✅ RÖHRE, EIGENES LOCH, ZORRO, SPRECHBILDER AUSSEN  
`pruefe-runde37`

> „An der Stelle kannst du auch noch wie bei Super Mario früher diese Rohre machen, wo man sich so reinsetzt und dann irgendwo anders wieder rauskommt, mit diesem typischen Geräusch.“

> „Der Maulwurf verschwindet nicht in seinem eigenen Loch. Man soll sich durch sein eigenes Profilbild graben.“

> „Vielleicht kannst du auch noch so ne Animation für so ne Zorro Schlitzen machen.“

> „die Blütenblätter … sollen außen am Profil sein“

### ✅ PAINTBALL, MÜNZE, WECKERKLÖPPEL  
`pruefe-runde38`

> „Bei dem Paintball sind die Farbklecksen immer nur auf einer Stelle die sollen über das ganze Bild … und dann runter fließen.“

> „Bei der Münze sollen diese Bewegungeffekte weg und die Münze soll einfach drehen realistisch und sie soll am Boden landen und nicht in der Mitte vom Bild.“

> „bei den Wecker musst du diesen Klöppel da zwischen den zwei schallkuppeln hin und her schlägt.“

### ✅ SANDUHR UND GLÜHBIRNE  
`pruefe-runde40`

> „bei der Sanduhr die funktioniert immer noch nicht … es könnte realistischer sein, dass sich das Bild wirklich so zerfließt wie Sand.“

> „wenn man die Glühbirne dreht, dann soll sie sich natürlich von links nach rechts rum drehen … Das muss von links nach rechts mit der Fassung mit drehen … und da hört man auch dieses realistische Quietschegeräusch.“

### ✅ TROMMEL, OHRFEIGE, KRAN, SCHLAEGER  
`pruefe-runde49`

> „Die Trommel hat immer noch keine filigranen Trommelstoecke und sie sind auch nicht bis zum Ende der Animation zu sehen bei dem Marschgeraeusch. Es soll nur ein Schlaegel sein bei dem Paukenschlag und filigrane normale Drumsticks bei der zweiten Einstellung.“

> „Die Ohrfeige hat immer noch kein Klatschgeraeusch.“

> „dann moechte ich abhaengig vom Geschlecht ... ein Schmerzgeraeusch von der Frau.“

> „Der Kran hat noch am Ende ein Motorengeraeusch, das soll nicht da sein.“

### ✅ WAS MAN HAELT, BLEIBT BEIM HALTENDEN  
`pruefe-runde50`

> „bei der Zwille — die soll natuerlich bei mir bleiben, wenn ich sie aufziehe.“

> „Das Blasrohr ist realistisch, aber der Spuckball, der muss nach unten laufen.“

> „dieses eine Boot mit dem Dampfer, das kann so ein klassischer Raddampfer sein wie bei Steamboat Willie.“

> „die Liane ist auch nicht realistisch.“

### ✅ DAS PORTAL UND DER ZUG AM SEIL  
`pruefe-runde51`

> „der Gate-Effekt ist noch nicht realistisch.“

> „bei dem Lasso sieht es nicht so aus, als wenn man den anderen ran zieht.“

### ✅ DAS BOWLING IM TAKT, DIE PUNKTE AUF DEN PLAETZEN  
`pruefe-runde52`

> „Das Bowling ist schlecht getimet“

> „gelbe Punkte auf den Plaetzen“

### ✅ DIE MÜNZE UND DAS WHITEBOARD  
`pruefe-runde53`

> „bei dem Whiteboard moechte ich die Werkzeuge ausblenden koennen und vielleicht eine Rueckschritt- und Fortschritt-Funktion ... Bilder sichern.“

### ✅ KNÜLLEN, BENOTUNG BEIM LESEN, ANDROID-BREITE  
`pruefe-runde54`

> „Denk auch dran, dass wir da Benotung machen koennen“

> „bei den Texten laufen die Ueberschriften am Android senkrecht.“

### ✅ PEITSCHE, LIANE, PFEIL UND COWBOYHUT  
`pruefe-runde58`

> „Auch die Peitsche die kann richtig schoen ausholen lang sein mit einem verjuengen Ende. Ja das muss aber eher schwarzes Leder sein.“

> „Die Liane kann laenger sein und von oben drueber richtig lang runter haengen.“

### ✅ TOENE ZUR RICHTIGEN ZEIT, BLITZE MIT ÄSTEN  
`pruefe-runde59`

> „Das Schmerzgeraeusch kommt viel zu spaet.“

> „Bei der Zwille hoert man vorher schon das Schmerzgeraeusch, bevor die Zwille ueberhaupt los schiesst.“

> „Der Sound von der Muenze faengt erst danach an.“

> „Das Geld hat immer noch kein Registerkassenklingeln.“

### ✅ DER TUTOR REDET KUERZER UND SIEHT AUS WIE ER SELBST  
`pruefe-runde60`

> „Pass auf, dass der Tutor nicht so viel erzaehlt … du musst nicht doppelt gemoppelt sagen. Ausserdem bin ich Musiker und deutscher Muttersprache.“

> „der Kalender ist eher in der Mitte, nicht links — als erstes ist der Kalender, dann kommt das Profil, dann die Kaffeetasse, und darunter links das Wetter, rechts die Uhrzeit.“

> „der Avatar soll genauso gross sein wie der alte, meiner ist fast doppelt so gross … unten rechts liegt irgend so ein Symbol, was da nicht hingehoert.“

### ✅ MAULWURF VON OBEN, HAUTTON, RUTSCHENDER SCHNEE, SANDUHR AUF JEDEM EINZELNEN BILD  
`pruefe-runde63`

> „der gegrabene Maulwurfshuegel sieht auch nicht realistisch aus … das soll man von oben, von der Draufsicht.“

> „die Brueste bei dem Obst sind immer noch nicht hautfarben, sie sind immer noch gelb.“

> „die Spur kann besser animiert nach unten rutschen.“

> „Die Sanduhr soll auch im einzelnen Profilbild den Effekt haben, dass das Profilbild von oben nach unten durchlaeuft.“

### ✅ LOECHER FARBIG FUELLEN, COWBOYRUF ZURUECK, DER BALL RATTERT IM RING  
`pruefe-runde64`

> „Ist es moeglich, dass du die Silhouette am Umriss berechnest und da, wo die Loecher im Koerper sind, dass du sie fuellen kannst — vielleicht mit einem weichen Verlauf, der zu den Pixeln in dieser Umgebung passt?“

> „und auch den Cowboyhut wieder ein bisschen besser gestaltest und das urspruengliche Geraeusch vom Cowboy zurueckholst“

> „und endlich den perfekten Basketballkorb-Sound machst, inklusive der realistischen Animation in dem Korb, dass der Ball so im Metallgeruest herumrattert, bevor er runterfaellt“

### ✅ MAULWURF IM KREIS, LASSO AM PLATZ, LOK MIT DETAILS, GREIFVOGEL, DREI-METER-TURM, AUFBLASEN  
`pruefe-runde65`

> „der Maulwurfshuegel ist uebrigens nicht von oben. Er soll auf dem Platz in demselben kreisrunden Format wie mein Profilbild … dass zum Beispiel auf Platz 1 der Maulwurfshuegel wirklich aus dem Kreis rund gegraben wird … ohne dass das Loch mitgeht, sondern nur die aufgeschuettete Erde einen Streifen zieht.“

> „Das Lasso schlingt sich immer noch nicht um das Opfer an seinem Platz, sondern taucht erst auf, wenn derjenige neben dir ist … und dann zieht man den anderen Stueck fuer Stueck mit kraeftigen Zuegen heran.“

> „Im Uebrigen ist unsere Lokomotive noch nicht detailliert. Sie soll so schoen sein wie unsere urspruengliche Lok — und ich moechte, dass unsere urspruengliche Lok auch an seiner urspruenglichen Adresse zu finden ist, naemlich unter /LOK.“

> „Vielleicht schaffst du es noch, einen realistischen Vogel zu bauen, so ein Greifvogel, der unser Profilbild mitnimmt … mit realistischen Fluegelschlaegen.“

### ✅ HELIKOPTER, GEWICKELTER GRIFF, DIE NEUNSCHWAENZIGE UND DIE ROHRREISE AUF BEIDEN SEITEN  
`pruefe-runde66`

> „Lok und Helikopter brauchen noch mehr Details“

> „Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal“

> „Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen“

### ✅ DAS TOR ALS STEHENDE WASSERWAND UND EFFEKTE FUER ALLE GLEICHZEITIG  
`pruefe-runde67`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ BILLARD-PRALLPHYSIK  
`pruefe-runde68`

> „wenn mehr als zwei Leute teilnehmen, soll die eine Kugel, die man anstoesst, die anderen beeinflussen und einer von denen soll zufaellig in ein leerstehendes Loch fallen.“

### ✅ DAS WHITEBOARD GEHOERT INS PROFIL  
`pruefe-runde69`

> „Whiteboard neu denken, alles ins Profil speichern statt lokal.“

### ✅ DIE TOENE STIMMEN WIEDER  
`pruefe-runde70`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ DIE ZEICHNUNGEN, ERSTER TEIL  
`pruefe-runde71`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ XANDERS FEHLERLISTE  
`pruefe-runde72`

> „wenn ich einen anderen Platz aussuche, ist der Schein immer noch auf der 1 da, wo ich hergekommen bin“

> „das beamen hinterlaesst immer noch den Rueckstand“

> „die Roehre ist immer noch nicht repariert“

> „Das Wasser von dem Schwimmbecken … ist noch nicht buendig mit dem Profil Platz“

### ✅ DIE GROSSE LISTE VOM 21. SEPTEMBER, TEIL 1  
`pruefe-runde73`

> „Man kann die Einladung, wenn man jemand einlaedt, nicht absenden … ich moechte auch Leute einladen, die grad nicht online sind.“

> „Der Neuankoemmling soll auch den naechsten freien Platz bekommen. Und nicht auf dem ersten Platz landen.“

> „Die Gluehbirne soll nur an meinem Platz ausgemacht werden … dann wird es besonders hell im Raum.“

> „Das Flugzeuggeraeusch ist nicht lang genug … es klingt eher wie ein Rennauto.“

### ✅ XANDERS LISTE VOM 21. SEPTEMBER, ZWEITER TEIL  
`pruefe-runde74`

> „Denk daran, dass du die Buegel mit der Kreisrundung mitfaehrst und dass oben dieser Zwischenhalt wie eine kleine Bruecke deutlich ist … die sind silbrig, also metallic … wie als wenn du so einen Tropfen links und rechts von dem Pflaster hast.“

> „Die koennen auch noch ein bisschen enger reingehen, dass jemand, der rechts oder links von mir sitzt, nicht mit meinem Design korreliert.“

> „Das Helikopterfenster ist immer noch nicht abgeschraegt vorne.“

> „Die Liane ist totaler Quatsch, sie hat immer noch keinen Mittelpunkt in der Bildmitte auf der X-Achse.“

### ✅ XANDERS LISTE VOM 21. SEPTEMBER, DRITTER TEIL  
`pruefe-runde75`

> „Ich moechte noch eine Bewegungsanimation mit einem UFO … was mich rein beamt von meinem Platz, ohne dass da Rueckstaende sind … der Beameffekt soll dann auch ein eigener sein in diesem Strahl.“

> „Eine Katze soll noch dabei sein, die mit meinem Profilbild spielt wie mit einem Wollknaeuel … die kann zwischendurch auch miau machen.“

> „Irgendeine ueberdimensionale Hand soll mich anfassen und auf einen anderen Platz setzen … vielleicht kann man sich die Hand auch aussuchen … so ein Plopp-Geraeusch, als wenn ich da rausgezupft wurde … und dann wieder so ein Aufsatzgeraeusch.“

> „Dann noch Frisbee, eine Animation … die sich wirklich so drehend animiert.“

### ✅ XANDERS GROSSE LISTE, ERSTER TEIL  
`pruefe-runde76`

> „Beim Lasso: erst soll derjenige mit dem Lasso gefangen werden, dann soll er von dieser Position herangezogen werden … Genauso bei dem Angeln. Die Animation kommt immer erst dann, wenn derjenige schon auf dem Platz sitzt.“

> „Der Bumerang soll auch richtig zu mir zurueckfliegen und nicht nur auf dem halben Weg.“

> „Der Schneeball hat ne Schleifspur, die nach unten geht, waehrend der Schneeball nach rechts runter[rutscht].“

> „Die Muenze … soll etwas hoeher landen, nicht den Namen verdecken, sondern flach aufliegen.“

### ✅ XANDERS LISTE VOM 21. SEPTEMBER, DRITTER TEIL  
`pruefe-runde77`

> „das mit dem Blut funktioniert auch noch nicht so richtig, weil oben immer noch abgedeckt wird und es soll nach links und rechts ein bisschen fliessen und oben kein Volumen machen. Es soll nicht das Bild zu machen.“

> „dann der Effekt bei der Blume wurde noch nicht beruecksichtigt. Schau im Verlauf, was ich dir dazu gesagt habe.“

> „wie so eine Leuchtvignette drum, die nicht sein musste … das sieht so aus, als wenn man die Blaetter auf einen Kranz geklebt hat … die Blaetter sind auch nicht buendig … es soll an Ort und Stelle bluehen und sich nicht unbedingt drehen.“

> „mit dem Regenbogen. Das wurde auch noch nicht beruecksichtigt.“

### ✅ JEMAND ANDEREN ALS ZIEL NEHMEN  
`pruefe-runde78`

> „Der Frisbee ist Mega cool. Vielleicht kannst du es auch moeglich machen, dass man jemand anderen auch wegwerfen kann … dass man in dem Reisemenue jemand anderen als Ziel nehmen kann, bei dem Frisbee … und er taucht an meinem Platz wieder auf, und vielleicht auch noch ne Variante fuer die Roehre.“

### ✅ was Xander am 22. September gemeldet hat  
`pruefe-runde80`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ der zweite Teil von Xanders Liste vom 22. September  
`pruefe-runde81`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ der Rest von Xanders Liste aus Runde 76  
`pruefe-runde82`

> „Hammer mit Zufall und Glasbruch“

### ✅ Frosch-Sprung und Zylinder mit Kaninchen  
`pruefe-runde83`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ die letzten drei Punkte aus Runde 76  
`pruefe-runde84`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ Xanders Liste vom 22. September, erster Teil  
`pruefe-runde85`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ RUNDE 85, ZWEITER TEIL  
`pruefe-runde85b`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ Spruehdose, Spuckton und der Zauberer  
`pruefe-runde86`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ RUNDE 86, ZWEITER TEIL  
`pruefe-runde86b`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ DAS REALISTISCHE GREIFEN  
`pruefe-runde87-hand`

> „Hände mit realistischen Zeichnungen für alle Handstellungen, ein realistisches Greifen, eine realistische Greifanimation aus einem Ursprungszustand in einen Griff in einzelnen Stationen, wie so etwas animiert werden muss, dass es wirklich realistisch aussieht.“

### ✅ PRÜFT DAS UPDATE-PANEL BEI „ES WAR EINMAL IN DEUTSCHLAND".  
`pruefe-runde87-kalender`

> „ES WAR EINMAL IN DEUTSCHLAND“

> „Ich sehe übrigens immer noch nicht wieder mein Update Panel bei ‚Es war einmal in Deutschland'. Ich als Administrator muss das sehen, damit ich darauf Einfluss haben kann … an der Stelle, wo es früher war, über dem Beitrag … Es soll so freigegeben sein, wie ich es freigegeben hab, indem ich auf dieses Häkchen geklickt habe.“

> „nie gesperrt heisst freigegeben“

### ✅ RUNDE 87 — DAS KATAPULT  
`pruefe-runde87-katapult`

> „Der Katapult schießt nach links. Er soll aber nach rechts schießen.“

> „Er sollte realistisch die Ladung erst mal aufnehmen und dann wegschmeißen, das kann auch ein bisschen länger sein“

> „der Katapult nimmt das Profilbild immer noch nicht als Ladung auf“

### ✅ ADRESSZEILE WEG UND BILDSCHIRM AN  
`pruefe-runde87-kino`

> „Ich habe auch noch immer nicht den Modus, dass oben die Adresszeile ausgeblendet wird beim Klassenzimmer und des Weiteren möchte ich einen Screen-on-Modus haben in dieser Situation, dass man dort länger bleiben kann … ich möchte, dass der Bildschirm hier offen gezwungen bleibt.“

### ✅ RUNDE 87 — DER KLAPS  
`pruefe-runde87-klaps`

> „Ich habe dir auch gesagt, dass man der Frau den Tanga runterziehen soll, bevor man den Po schlaegt und die Hand soll auch drauf schlagen und es soll auch der Abdruck sein, der vorher da war, nur eben, dass er jetzt auf der Pobacke zu sehen ist.“

### ✅ DAS EIGENE LIED WIRKLICH HOEREN  
`pruefe-runde87-lied`

> „mache das möglich, dass ich mein Lied selber hören kann, nicht nur einstellen kann, sondern sofort hören kann. Ich kann es immer noch nicht hören.“

> „Das Musikstück kann ich immer noch nicht für mich einstellen über die Note oder über den Kopfhörer selber.“

### ✅ PAC-MAN BLEIBT, WO ER ANKOMMT  
`pruefe-runde87-pacman`

> „Wenn ich mit Pac-Man einen Weg einzeichne und er da landet, wo er landet, dann soll er nicht zurückgehen. Er soll da bleiben und er soll immer in die Richtung schauen … am Ende, wo er ankommt und bleibt, soll er wieder zu meinem Profilbild werden.“

> „beim Pac-Man sollen auch die Futterelemente nicht an Stellen sein, die keine Profil-Sitzplätze sind.“

### ✅ SECHZEHN PLAETZE IM SELBEN RAHMEN  
`pruefe-runde87-sechzehn`

> „sie sollen das Design nicht verändern, oben und unten die Position soll fest bleiben. Es soll nur kleinere Felder erzeugt werden, die genau im selben Stil sind … Stell dir die acht Plätze wie einen Raum vor. Innerhalb dieser Grenzen bleiben wir: die oberste Grenze ist die Strichlinie der obersten Positionen von den Plätzen und die unterste Grenze ist der letzte Pixel von dem Wort ,frei'.“

### ✅ DIE STRICHLINIEN, ALLE AUF EINMAL  
`pruefe-runde87-strichlinien`

> „auch die Inkonsistenzen der Strichlinien, die immer noch da sind“

> „keine Design-Inkonsistenzen mehr übrig, wenn man den Platz verlässt … dass das Profilbild verkleinert wird beim Verlassen des Platzes.“

### ✅ DAS AUFGABEN-MODUL HAT EINE FUNKTION  
`pruefe-runde88-aufgabenwahl`

> „Die Aufgabe macht keinen Sinn: man schreibt irgendwas hin und kann die einzelnen Woerter nicht anklicken.“

> „Die Aufgabe hat keine Funktion. Man schreibt einen ganzen Satz und weiss gar nicht, was man da loesen soll … man kann nur den Satz anklicken, und das ist quasi die Loesung. Was soll das fuer eine Aufgabe sein?“

> „Die Aufgabe hatte noch keine Funktion, immer noch nicht — ich weiss immer noch nicht, was das sein soll.“

> „/aufgabe" war nur EINER davon — die freie Aufgabe ohne Musterloesung. Wer den tippte, sah genau eine der acht Arten und keinen Hinweis auf die anderen sieben. Deshalb wusste er nicht, was es sein soll: es war nie die Tuer zum Modul, es war ein Zimmer darin. Diese Sonde haelt fest, dass „/aufgabe“

### ✅ DER SPRUNG INS BECKEN  
`pruefe-runde88-becken`

> „Beim Schwimmbecken sieht man immer noch nicht, dass das Profilbild unters Wasser taucht und dann wieder aufploppt, wenn es ankommt.“

### ✅ DIE BILLARD-PHYSIK  
`pruefe-runde88-billard`

> „Die Billard-Physik ist offenbar immer noch nicht gemacht, weil sie immer an dasselbe Loch fliegt. Ja, die soll auch, wenn ich das selber mache, so sein, dass ich da ne Physik habe beim Spielen, die an realistisches Billardspielen erinnert.“

> „es soll wirklich an allen Ecken abprallen, bis es ein Loch gefunden hat — also die Physik soll stimmen wie beim Billardspiel, dass es realistisch in so'n Loch faellt.“

### ✅ DIE BIRNE IN DIE FASSUNG DREHEN  
`pruefe-runde88-birne`

> „wenn man die Birne in die Fassung dreht und somit das Licht [anmacht], hat man nicht denselben Drehsound, den er hat, wenn man die Birne raus dreht. Wenn man die Birne rein dreht, klingt [es] … nicht realistisch.“

### ✅ BONGO AUF DEM BILD  
`pruefe-runde88-bongo`

> „bei der Bongo, bei der Trommel soll man auf dem BILD Bongo spielen, nicht auf Bongos — sondern das Bild soll die Bongo-Flaeche sein … und wenn ich zum Beispiel bei ‚alle‘ — kannst du die Bongo auch mit reinmachen … dann wird auf allen jeweils mit EINER Hand immer getrommelt, so also linke und rechte Hand.“

> „Du sagst, du bist mit der Liste fertig, hast die Bongos aber immer noch als Bongos im Bild. Du sollst mit den Haenden auf die BILDFLAECHE schlagen, nicht auf Bongos.“

### ✅ DAS AUTOFAHRER-GERAEUSCH  
`pruefe-runde88-fahrgeraeusch`

> „beim Reisen hoert man kein Fahrgeraeusch, man hoert nur das quietschende Bremsen am Schluss.“

> „Ich weiss auch nicht, ob du das Autofahrer- Geraeusch schon gemacht hast.“

> „schleife", und das stand nicht da. Gemessen wird deshalb beides: · Der TONPLAN: laeuft „fahren“

### ✅ RUNDE 88 — DER FROSCH  
`pruefe-runde88-frosch`

> „Der Frosch hat vorne keine Fuesse, so wie's aussieht.“

> „Der Frosch huepft auch nicht in die Richtung, in die er schaut. Wenn er anfaengt zu springen, schaut er nach links, und wenn er zurueckgeht, schaut er in die richtige Richtung.“

> „und das Quakgeraeusch ist auch unmoeglich. Das ist ueberhaupt nicht realistisch.“

### ✅ RUNDE 88 — DIE EMOJI-HAENDE  
`pruefe-runde88-haende`

> „auch die Schlag- oder die Emoji-Haende, die so einen extrem gespreizten Daumen haben bei den Emoji-Haenden. Mach das so, dass der Daumen realistisch ist.“

> „Die Hand wird niemals gehalten beim Winken, die ist ganz natuerlich einfach nur offen und dann winkt man. Da kriegt man keinen Krampf in den Fingern, wenn man winkt, weil man seinen Daumen extrem nach aussen drehen muss. Das ist keine Haltung, die man hat — man hat seine Hand nur offen und winkt.“

> „Auch beim Klatschen hat man auch nicht diese extrem rausgedehnten Daumen, die sollen schraeg nach oben gehen, ganz natuerlich liegen.“

> „und beim Klatschen soll sich die Handflaeche in der Mitte treffen.“

### ✅ DER COWBOYHUT UND SEIN RUF  
`pruefe-runde88-hut`

> „Bei dem Cowboyhut sieht man auch noch nicht, dass er am Ende mit seiner Hand den Cowboyhut ausrichtet.“

> „Die Animation kann auch ein bisschen laenger sein.“

> „das YIHAAH Geraeusch ist immer noch abgeschnitten.“

> „Die Hand soll vorher gar nicht zu sehen sein.“

### ✅ DAS KANINCHEN AUS DEM ZYLINDER  
`pruefe-runde88-kaninchen`

> „eine Animation koennte auch noch sein, dass man jemanden oder sich selbst mit dem Profileffekt beeinflusst, der wie ein Zylinder ist, und dann mit dem Zauberstab auf den Zylinder schlaegt und dann ein Kaninchen an seinen Ohren herausholt und dann so Beifall geklatscht wird. Vor Kunststueck halt.“

> „Der Zauberer mit Kaninchen, das sollte ein Profilbild-Effekt sein, keine Reise.“

> „Die Animation mit dem Kaninchen … als einfacher Profil-Effekt … und dass ich andere damit beeinflussen kann. Und die Reise ist ein anderer Effekt. Das sind zwei verschiedene Paar Schuhe.“

### ✅ DER KLAPS KOMMT VON OBEN UND HINTEN  
`pruefe-runde88-klaps`

> „ueberleg auch mal, wenn man jemanden schlaegt auf dem Popo, das bei den Emoji-Haenden, ob das auch richtig aussieht. Die kommen naemlich manchmal so von der Seite, als wenn sie mit der Rueckhand schlagen, oder dass die Physik nicht stimmt. Wenn man jemand auf die Wange schlaegt, schlaegt man seitlich. Wenn man auf den Popo schlaegt, schlaegt man so hinten drauf, und dann ist die Hand flach so von der Seite zu sehen und kommt auch so animiert auf dem Po geschlagen.“

### ✅ DIE SONGABSCHNITTE  
`pruefe-runde88-liedstellen`

> „125-167 ist die Zeitmarke fuer [A Lovers] Fairytale.“

> „Fuer Nah habe ich 45 Sekunden bis 1 Minute 19.“

> „Fuer Ein Leben lang habe ich 1 Minute 18 bis 1 Minute 53.“

> „Fuer Du habe ich 52 Sekunden bis 1 Minute 32.“

### ✅ DIE LOK IN DER KURVE  
`pruefe-runde88-lok`

> „Die Lok dreht sich immer noch auf der Stelle. Bevor sie zurueckfaehrt, dreht sie sich einmal rum.“

> „DREHT SICH AUF DER STELLE“

### ✅ RUNDE 88 — DER MARIO-MODUS  
`pruefe-runde88-mario`

> „WIRKLICH ZUFAELLIG UND NICHT FUENFMAL DASSELBE NACHEINANDER.“

> „DA DARF AUCH NICHTS KLATSCHEN AM ABFAHRTSORT.“

### ✅ DER MAULWURF BRICHT DIE PLAETZE AUF  
`pruefe-runde88-maulwurf`

> „Die Striche und Positionsnummer soll immer von jeglicher Animation ausbleiben, es sei denn ich sag es ausdruecklich wie zum Beispiel beim Maulwurfhuegel. Dort hast du das wieder rausgenommen? Offenbar dort sollen die Plaetze richtig aufgebrochen werden.“

> „die Maulwurfhuegel, die im uebrigen immer noch nicht aufgeschuettet werden an dem Profilnummern — da sollen diese Profilnummern durcheinandergebracht werden … Wenn es leere Plaetze sind, dann sollen die Strichlinie und Zahlen durcheinandergebracht werden, also dass da wirklich das mit sich umkippt realistisch, und wenn dort Leute sitzen, dass die entsprechend auch durcheinandergebracht werden … dann koennten sie vielleicht auf den Kopf stehen oder so, aber trotzdem mit Erde bisschen gehaeuft werden.“

### ✅ DAS SCHWEBENDE MODUL IST NICHT MEHR BESCHNITTEN  
`pruefe-runde88-modulhoehe`

> „das Panel, wenn ich die Musik aufrufe und aussuchen möchte, das ist übrigens immer noch beschnitten. Wir hatten das schon mal als schwebendes Modul so, dass ich es auf dem kleinen Android ganz gesehen habe, aber jetzt ist es wieder beschnitten, und ich muss dann durchscrollen und sehe nicht das ganze Modul.“

### ✅ RUNDE 88 — PAC-MAN  
`pruefe-runde88-pac`

> „Die Futterpunkte beim Pac-Man liegen nicht mittig auf den Feldern … die Futterpunkte muessen exakt im Zentrum der Zahlen liegen, und in dem Moment braucht man auch keine Zahlen zu sehen, damit das wie das klassische Spiel aussieht.“

> „Er frisst immer noch nicht in die richtige Richtung, wenn er die Richtung aendert … wenn ich ihn von links nach rechts, dann runter und von rechts nach links wieder schicke, dann soll er auch nach links essen. Das soll original wie bei Pac-Man sein. Dann soll er seinen Mund drehen, also beziehungsweise sein Gesicht drehen und richtig herum essen, so wie er sich von der Physik in dem Spiel auch wirklich dreht.“

> „Wenn ich spreche, soll der Pac-Man nicht in seiner Animation gestoert werden. Wenn ich den Weg zeichne, soll er da bleiben, wo ich ihn hinschicke.“

### ✅ JEDES PANEL LAESST SICH SCHLIESSEN  
`pruefe-runde88-panels`

> „das Text-Panel, wenn man es oeffnet, ist immer noch beim Android zu gross — man sieht das untere Ende und die Seite nicht, man kann nur hinscrollen … das geht aus dem Bildschirm raus.“

> „und man kann das Panel immer noch nicht schliessen beim Klicken in den Leerraum. Genauso beim Bild-Panel … man muss immer versuchen, links neben das Bild-Panel den Hintergrund zu erreichen, um ueberhaupt wieder rauszukommen. Ansonsten muss man glaube ich nur nach unten scrollen, um das zu schliessen, aber das ist viel zu umstaendlich — UND DA IST NICHT MAL EIN SCHLIESSEN UNTEN IN DEM RAHMEN.“

> „Du sollst diesen Schliessen-Button entfernen — das habe ich niemals von dir verlangt. Ich habe gesagt, dass man das Panel durch Klicken in den Leerbereich von dem Panel schliessen soll, nicht anders. Ich moechte das intuitiv wie bei Apple, also mache das wieder, wie es vorher war, auch in den Animations-Menues.“

> „Saemtlicher Platz, der beschriftet ist oder der keine Buttons oder Navigationselemente enthaelt, die man anklicken kann, soll dieses Panel mit einem Klick in das Panel geschlossen werden koennen, ohne den Hintergrund und die Elemente im Hintergrund zu beeinflussen. Das bei allen aufklappbaren Panels.“

### ✅ RUNDE 88 — TRAB UND GALOPP  
`pruefe-runde88-pferd`

> „bei der Physik der Beine von dem Pferd, da gibt es auch Wissenschaften dazu, wie so ein Pferd Galopp laeuft. Ja, entweder sind es beide Beine, die gleichzeitig auftreffen vorne, und dann die hinteren, die nachziehen, oder sie sind im Wechsel — so, das ist glaube ich Trab, der Wechsel ist Trab. Aber da koenntest du ja entweder den Trab machen, wie realistisch ist, und wenn man das Ganze aufzieht, dann soll es Pferd im Galopp.“

> „achte dabei auf den Arsch, dass die Beine am Arsch sind“

> „der Arsch hinten, weil das so lang ist … es sieht aus wie so eine wulstige Wurst anstatt von dem Pferdekoerper.“

### ✅ SCHIFFE VERSENKEN, JETZT MIT SINN  
`pruefe-runde88-schiffe`

> „Das Schiffe versenken macht im Uebrigen auch keinen Sinn. Da muessen wir uns etwas ueberlegen, wie wir das spielen koennen, denn wenn sich ein Zweiter einen Platz aussucht, dann darf er nicht rausfinden, dass ein Platz besetzt ist, weil dann wuerde er den ja anklicken, um ihn zu versenken. Deswegen musst du das eher mit Zufallszahlen loesen, dass einfach jeder zufaellig gesetzt wird und die anderen das eben nicht wissen, wo sie hingesetzt sind.“

> „weil wir sind ja maximal acht Leute, und damit wir ein bisschen Verteilung machen koennen … dass da vielleicht ploetzlich sechzehn sind.“

> „diese Reihenfolge muss einem logischen Prinzip folgen, nach der Reihe der Anmeldungen im Chat.“

> „dann sollen wir das Spiel natuerlich auch wieder ausschalten koennen.“

### ✅ „ICH KANN MICH NICHT SELBER ANZIEHEN"  
`pruefe-runde88-selbst`

> „ICH KANN MICH NICHT SELBER ANZIEHEN“

> „dann kann ich immer noch nicht das Musikstueck fuer mich selber einstellen. Ich kann mich immer noch nicht selber anziehen und ausziehen.“

> „ich" fand also niemanden, und der Rueckfall { name:“

> „ich" heisst. Den gibt es nicht. Und selbst mit dem eigenen NAMEN war es nicht sicher: die Platzsuche in app.js verglich die BESCHRIFTUNG des Platzes, und die lautet beim eigenen „Alex (du)“

### ✅ DER SPIELFUEHRER WERTET AUS  
`pruefe-runde88-slf`

> „koennen wir sogar ein Stadt Land Fluss einbauen, was wir realistisch jeder fuer uns ausfuellen koennen und dann wenn die Zeit um ist beenden koennen mit einer realistischen Auswertung, so dass die Ergebnisse beim Spielfuehrer immer vorliegen und er dann entscheiden kann, ob die Woerter Sinn machen, ob wir die verwenden koennen, wo der Lehrer aber auch immer noch Mit-Entscheidungsrecht hat, wenn es zu der Auswertung kommt — ja also derjenige, der das auswertet, ist ja der Spielfuehrer an sich, der auch am Anfang den Buchstaben bestimmt.“

### ✅ DER ZAUBERER MIT BEIDEN HAENDEN  
`pruefe-runde88-zauberer`

> „Dann der Zauberer sollte ueber dem Profilbild sein. Er sollte einen Zylinder mit seinen Haenden an den Platz desjenigen STELLEN, der losreisen will. In diesen Zylinder soll er mit der ANDEREN Hand das Profilbild packen und in den Zylinder rein tun. Dann soll er den Zylinder dem Publikum praesentieren mit der Oeffnung des Zylinders, dass das Publikum sieht: der Zylinder ist leer. Danach soll er den Zylinder MIT BEIDEN HAENDEN auf dem Platz stellen, wo der Reisende hin moechte. Und auf diesem Platz zieht er die Person, das Profilbild, mit Hasenohren aus dem Zylinder.“

### ✅ DIE ZWEI LUFTBALLON-VARIANTEN, WIE ER SIE GENANNT HAT  
`pruefe-runde89-ballon`

> „Hast du eigentlich auch die Animation, dass man jemanden aufblasen kann bis er platzt? Da sollen auch zwei Animationen sein: ein, dass man ihn aufblasen kann, bis er platzt, und ein, dass man ihn einfach nur aufblasen kann wie ein Helium Luftballon und er fliegt dann von der Buehne hoch und oder fliegt halt zur Seite weg.“

> „Welche zwei Varianten habe ich dir mit dem Luftballon genannt? Suche das wirklich.“

> „Man soll das auch auf sich selbst anwenden koennen, deswegen soll es in den allgemeinen Profilbild-Effekten auch drin sein.“

> „Ausserdem geht deine Luftballon Animation nicht einfach so, man muss immer einen Namen auswaehlen, die muss auch von so gehen.“

### ✅ WAS BLEIBEN SOLL, BLEIBT AUCH  
`pruefe-runde89-bleibt`

> „Du sagst, dass ich mir ein Lied anhoeren kann. Ich kann's mir immer noch nicht anhoeren … Die Kopfhoerer bleiben auch nicht auf meinem Kopf, waehrend ich das Lied anhoeren koennte.“

> „was man jemandem aufsetzt, hat er an, bis es jemand abnimmt“

> „sollen so lange auf der Person bleiben, bis sie sie von selber abnimmt“

> „es kann nicht sein, dass beim zweiten Betaetigen von Birne an die Birne ausgeht“

### ✅ MISST, OB DIE SCHALLWELLE EINE KANTE HAT.  
`pruefe-schallwelle`

> „Diese hässliche Animation hat so eine Schachtel-Optik, weil sie oben und unten eine Kontrastkante zeigt.“

### ✅ PADDELN UND DAS SEITENRAD  
`pruefe-schiffe60`

> „Ich will bei dem Segelboot, dass ich zusaetzlich paddle. Und bei dem Raddampfer vom Mississippi: da muss in der Mitte so ein grosses Rad sein, wie das klassisch ist, nicht hinten.“

### ✅ MISST DEN NEUEN SCHREI — TON UND WELLE.  
`pruefe-schrei-echo`

> „Jetzt höre ich die Stimme. Aber dieses komische Föhngeräusch ist noch im Hintergrund, was wie ein Staubsauger klingt, das soll weggehen. Und das Hallo soll viel kürzere Echozeiten haben, viel öfter Echo und lauter. Man soll plötzlich Schreck bekommen.“

> „Der Schall soll von dem Wort zentriert ausgehen in alle Richtungen und nicht nur nach oben.“

### ✅ PRÜFT: GESCHRIEEN WIRD AUCH OHNE DEUTSCHE STIMME.  
`pruefe-schrei-ohne-stimme`

> „Du hattest gesagt, dass du eine Echoüberlagerung von den Stimmen erzeugen kannst … aber ich höre immer noch den alten Sound.“

### ✅ PRÜFT DEN SCHREI: STIMME NACH GESCHLECHT UND ECHTES ECHO.  
`pruefe-schrei-stimme`

> „Vielleicht je nach Person — wenn es ein Mann geschrieben hat, dass es dann männlich klingt, und wenn es eine Frau geschrieben hat, dass es dann weiblich klingt, aber halt wirklich mit dem dramatischen Effekt eines Schreis und nicht einfach nur wie ein Roboter … es soll auch dezent wie ein Nachhall sein.“

### ✅ LAUFEN BEIM SCHREIEN BEIDE EFFEKTE GLEICHZEITIG?  
`pruefe-schrei-wackeln`

> „Da hatten wir vorher so eine Art wackelnde Animation mit dem Wort, bevor wir diesen Schall gesendet haben. Schau bitte wirklich in den Verlauf … genau das moechte ich wie frueher haben, mit der Addition von dem Kreisel — also beide Effekte gleichzeitig.“

### ✅ PRÜFT DAS SCHREIEN.  
`pruefe-schreien`

> „Wenn man schreit, dann sollen die Buchstaben der ausgewählten Schriftart sein. Wenn es bunt eingestellt ist, sollen die Buchstaben durcheinander bunt sein, so wie das vorher auch war. Und wenn die Animation kommt, soll es auch den Chat ein bisschen beeinflussen … und vielleicht ein Sound-Effekt, der neutral dazu passt, egal was man schreit.“

### ✅ PRÜFT, OB MAN IM CHATVERLAUF OBEN BLEIBEN KANN.  
`pruefe-scrollen`

> „Man kann im Chatverlauf nicht mehr nach oben scrollen, um das alte Rätsel zu lesen.“

### ✅ PRUEFT DIE ELFTE HALTUNG: SEITLICHES SITZEN  
`pruefe-seitsitz`

> „Das seitliche Sitzen … ich moechte die Originale haben und dann auf der Basis weiterarbeiten.“

> „liegen" aufgerichtet und „krabbeln“

### ✅ SIEHT MAN DAS SPRECHBILD DER ANDEREN?  
`pruefe-sprechbild-reist`

> „Wenn jemand anders einen Effekt in seinem Sprechbild einstellt — zum Beispiel bei Emmi aus Aegypten —, ich sehe ihren Effekt nicht. Sie sieht ihn selber, aber ich seh ihn nicht.“

### ✅ DIE SPRECHBILDER — SECHZEHN STUECK, JEDES ANDERS  
`pruefe-sprechbilder`

> „Ich brauche noch mehr fantastische Profilbildrahmen, wenn man spricht … Der Regenbogen muss viel bunter, dafuer klarer und farbiger werden … viele kleine Sternchen funkeln in verschiedenen Staerken, die das Profilbild umgeben … und dann vielleicht noch eins, wo Noten rauskommen.“

> „in verschiedenen Staerken“

### ✅ PRÜFT DEN SPRECHERBALKEN IN DEN DREI FÄLLEN.  
`pruefe-sprecherbalken`

> „Wenn sie danach noch mal gehört wird, die Nachricht nach dem Abschicken, soll oben in der Chatleiste auch mein grüner Balken stehen — damit ich abschätzen kann, wann die andere Seite die Nachricht zu Ende gehört hat.“

### ✅ PRÜFT DIE DREI ZUSTÄNDE EINER WORTMELDUNG IM CHAT.  
`pruefe-stimmzeilen`

> „Bei Personen steht der leere Name, wenn sie eine Sprachnachricht schicken“

> „Die Sprachnachrichten sind nicht mehr aufzurufen.“

### ✅ DER STRUDEL IST EIN WIRBEL, KEINE ZIELSCHEIBE  
`pruefe-strudel61`

> „der Strudel-Animationseffekt sieht immer noch nicht gut aus.“

### ✅ PRÜFT: DIE ERKLÄRUNG ZUM BEFEHL IST AUCH AUF DEM TELEFON DA.  
`pruefe-tipps`

> „Die Beschreibungen der Befehle sehe ich auf dem Handy gar nicht.“

> „Mache die Liste der Befehle wieder nebeneinander, so wie es vorher war … Was ich wollte, war nur, dass du diese einzelnen Sachen leicht erklaeren kannst — und das galt nur fuer die einzelnen Buchstaben, fuer W oder S oder I.“

### ✅ WELCHER TON LAEUFT WANN? — EIN MITSCHNITT, KEINE MEINUNG  
`pruefe-tonlage`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ JEDER TON, DEN DER PLAN NENNT, MUSS AUCH KLINGEN  
`pruefe-tonliste`

> „Der Strudel hat noch kein Geräusch, kein Geräusch.“

### ✅ PRÜFT, OB EIN BLOCKIERTER TON DEN RAUM ANHÄLT.  
`pruefe-tonriegel`

> „Bist du sicher, dass Emmy mich hören kann mit der Pseudovariante?“

### ✅ SPIELT EIN GERAEUSCH LAENGER, ALS ES SOLL?  
`pruefe-tonschleifen`

> „Beim Paintball ist der Sound so lange — am Anfang wird nur kurz geschossen, und du hast das geloopt. Bei manchen Sachen passt dieser Loop einfach nicht, weil das im ersten Moment schon zu Ende ist … und bei solchen Sachen, wo du den Schuss machst, brauchst du auch nicht loopen, dass es dann noch mal schiesst, wenn die Animation laengst vorbei ist. Suche nach solchen Sachen und aendere das wieder, dass es wieder normal ist.“

### ✅ PRÜFT: DER TUTOR ERKLÄRT EINEN BEREICH IN MEHREREN STÜCKEN.  
`pruefe-tutor-stuecke`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ MISST, OB DER TUTOR SPRINGT ODER DOPPELT SPRICHT.  
`pruefe-tutor`

> „In der Übersicht-Sektion springt der Tutor. Ich weiss nicht, ob er in einer anderen Sektion auch noch spricht. Aber überprüft das bitte mal, dass so etwas nicht passiert.“

### ✅ DAS STANDBILD KLEBT NICHT MEHR HINTER DEM FILM  
`pruefe-tutorbild62`

> „der Originalavatar klebt immer noch hinter mir. Das sieht aus, als wenn zwei uebereinander gesetzt sind … ich sehe immer noch Freistellungsluecken in den Schuhen.“

### ✅ IST JEDER TUTOR-FILM FREIGESTELLT — UND HAT ER SEINE MASKE?  
`pruefe-tutorfilm34`

> „den Tutor auf dem Android sieht man ihn freigestellt. Auf dem iPhone sieht man ihn mit einem schwarzen Hintergrund.“

### ✅ const { chromium } = require("/tmp/claude-0/node_modules/playwright"); const http = require("http"), fs = require("fs"), path = require("path"); const WURZEL = "/home/user/Deutsch-Mit-Xander"; const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };  
`pruefe-tutorreiter`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ HAT DER TUTOR UEBERALL EINE STIMME — UND DEN GRUSS FUER GAESTE?  
`pruefe-tutorstimme34`

> „die über mich. Sektion soll auch eingesprochen sein und im Original“

> „Vielleicht auch für die Leute die neu sind bei der Registration, dass wenn sie auf der Profil Sektion sind, dass er sagt willkommen in deinem Profil ... dass die Seite komplett kostenlos ist und ich mich freue, dass du dabei bist.“

### ✅ PRÜFT: DIESELBE ZEILE STEHT NICHT ZWEIMAL DA.  
`pruefe-verlauf-doppelt`

_(kein wörtliches Zitat im Kopf dieser Sonde)_

### ✅ SETZT EIN ANKOEMMLING MEINEN CHAT ZURUECK?  
`pruefe-verlauf-kein-reset`

> „In dem Moment, wenn ein anderer reinkommt, wird der Chat auf den Zustand gesetzt, den der andere aus seinem persoenlichen Chat mit mir kennt. Mein Chat soll sich gar nicht resetten dadurch, dass er reinkommt. Wenn ich unten zuletzt lese, dass ich mich selbst geschlagen habe, und dann kommt der neue Gast, soll der Chat nicht ploetzlich leer werden oder den alten Stand zeigen.“

### ✅ PRÜFT, OB DER GEMEINSAME VERLAUF WIRKLICH NACHGEHOLT WIRD.  
`pruefe-verlauf-nachfassen`

> „Ich bin ins Klassenzimmer zurück und hab wieder einen alten Stand geladen bekommen, der nicht der aktuelle Chat ist.“

### ✅ GEHT EIN WAEHLER WIEDER ZU?  
`pruefe-waehler-zu`

> „Wenn ich auf mein eigenes Profilbild klicke, um das Menue aufzurufen, wo ich ein anderes Profilbild einstellen kann, moechte ich, dass es wieder schliesst, wenn ich in den Lernbereich klicke. Also intuitiv wie bei Apple. Bei dir gibt es nur, wenn man nach unten scrollt — es gibt gar kein Schliessen.“

### ✅ JEMANDEN AUF EINEN ANDEREN PLATZ SETZEN  
`pruefe-wagenheber`

> „Mal so ein Wagenheber-Effekt, wenn jemand unten ist … man kann den anderen irgendwie auf einen anderen Sitzplatz ziehen. Von unten nach oben waere es dann so ein Heber, von rechts nach links waere so ein Lasso … und das System soll dann erkennen, welche Plaetze hebelbar sind.“

> „Wenn ich auf Platz 1 bin, dann kann man den nicht vom Platz 5 zu Platz 1 heben, sondern nur aus der Position, wo man selber sich nicht befindet.“

### ✅ PRÜFT: EINE ZEILE OHNE LEITUNG GEHT NICHT VERLOREN.  
`pruefe-wartende-zeilen`

> „Wenn Emmy die alte Aufgabe aus dem Verlauf noch mal löst, kommt sie nicht an, sie schickt nicht ab.“

### ✅ MISST, OB NAME UND TEXT AUF DERSELBEN GRUNDLINIE STEHEN.  
`pruefe-zeilenhoehe`

> „Die Schrift ist manchmal nicht auf einer Linie mit dem Namen — zum Beispiel wenn ich normal schreibe, ist das ,Hallo' tiefer gesetzt als mein Nickname.“

### ✅ PRÜFT DREI GEMELDETE SACHEN AUF EINMAL.  
`pruefe-zensur-fokus`

> „Die Zensuren, die ich vergebe, sollen auch im Chat sichtbar sein.“

> „Dann schreit sie etwas, und da steht plötzlich in Klammern, als wenn es kodiert hier ankommt.“

### ✅ JEDES FELD, DAS EIN EFFEKT LIEST, MUSS AUCH ANKOMMEN  
`pruefe-zusatzfelder`

> „Ich kann mich immer noch nicht anziehen und ausziehen.“

> „Ausserdem geht deine Luftballon-Animation nicht einfach so.“

> „Ich kann den Ausschnitt waehlen … ich kann mir das Lied noch nicht anhoeren.“

> „" — die Krone war weg, bevor sie irgendwo ankommen konnte. „/ballonpumpe helium“

