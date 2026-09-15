/* =====================================================================
   DIALEKT — wie heißt etwas in welcher Region
   ---------------------------------------------------------------------
   GEWÜNSCHT: „Wie heißt etwas in welcher Region.“ Ein Wort, und dazu,
   wie es in Bayern, Schwaben, Sachsen, im Ruhrgebiet, in Berlin, in
   Österreich und in der Schweiz heißt.

   WARUM DAS WICHTIG IST
   Wer Deutsch aus dem Lehrbuch lernt, bestellt in München ein Brötchen
   und bekommt es auch — aber er versteht nicht, was die Frau vor ihm
   gerade bestellt hat. Und wer in Wien nach Sahne fragt, erntet einen
   fragenden Blick. Das Hochdeutsche ist überall richtig; die regionale
   Form ist das, was man tatsächlich hört.

   WAS HIER STEHT
   Nur Wörter, die tatsächlich verbreitet sind und sich belegen lassen —
   Wortgeographie (Atlas zur deutschen Alltagssprache), Duden, das
   Variantenwörterbuch des Deutschen, Österreichisches Wörterbuch.
   Wo eine Region einfach das hochdeutsche Wort benutzt, steht hier
   `null`: die App zeigt dann „wie hochdeutsch“. Das ist ehrlicher, als
   irgendeine Mundartschreibung zu erfinden.

   GESCHRIEBEN IST IN STANDARDRECHTSCHREIBUNG, nicht in Lautschrift.
   „die Semmel“, nicht „d'Semmé“. Mundart schreibt man nicht einheitlich,
   und wer Deutsch lernt, braucht ein Wort, das er nachschlagen kann.

   ACHTUNG, GRENZEN: Ein Wort gehört nie exakt einem Bundesland. Die
   Grenzen der Wörter laufen quer durch die Landkarte, und in jeder
   größeren Stadt hört man beides. Die Angaben sind Schwerpunkte,
   keine Landesgrenzen — das sagt die App auch so.
   ===================================================================== */

window.DMA_DIALEKT_REGIONEN = [
  { id: "bayern", name: "Bayern", emoji: "🥨", raum: "Bairisch — München, Nürnberg, Niederbayern" },
  { id: "schwaben", name: "Schwaben", emoji: "🥨", raum: "Schwäbisch — Stuttgart, Ulm, Tübingen" },
  { id: "sachsen", name: "Sachsen", emoji: "🏰", raum: "Obersächsisch — Leipzig, Dresden, Chemnitz" },
  { id: "ruhr", name: "Ruhrgebiet", emoji: "⛏️", raum: "Ruhrdeutsch — Dortmund, Essen, Bochum" },
  { id: "berlin", name: "Berlin", emoji: "🐻", raum: "Berlinisch — Berlin und Brandenburg" },
  { id: "oesterreich", name: "Österreich", emoji: "🇦🇹", raum: "Österreichisches Deutsch — Wien bis Vorarlberg" },
  { id: "schweiz", name: "Schweiz", emoji: "🇨🇭", raum: "Schweizer Hochdeutsch — Zürich, Bern, Basel" },
];

/* `formen`: null = diese Gegend sagt es wie im Hochdeutschen.
   `notiz`  = was sonst noch dazugehört (andere Gegenden, Fallstricke). */
window.DMA_DIALEKT = [

  /* ---------------- Essen und Trinken ---------------- */
  {
    hoch: "das Brötchen", gruppe: "Essen & Trinken",
    was: "Das kleine Weißbrot zum Frühstück — der Klassiker unter den regionalen Wörtern.",
    formen: { bayern: "die Semmel", schwaben: "der Weck / das Weckle", sachsen: "die Semmel",
              ruhr: null, berlin: "die Schrippe", oesterreich: "die Semmel",
              schweiz: "das Brötli / das Weggli" },
    notiz: "In Hamburg heißt das aufgeschnittene, belegte Brötchen „Rundstück“. Im Rheinland sagt man auch „das Brötchen“, am Niederrhein „das Brötken“.",
  },
  {
    hoch: "der Berliner (Gebäck)", gruppe: "Essen & Trinken",
    was: "Das runde Hefegebäck mit Marmelade, das es zu Karneval und Silvester gibt.",
    formen: { bayern: "der Krapfen", schwaben: "das Fasnachtsküchle / der Berliner",
              sachsen: "der Pfannkuchen", ruhr: "der Berliner", berlin: "der Pfannkuchen",
              oesterreich: "der Krapfen", schweiz: "der Berliner / das Fasnachtschüechli" },
    notiz: "Die gefährlichste Falle der Liste: In Berlin und Sachsen ist „Pfannkuchen“ dieses Gebäck — der flache Eierkuchen heißt dort „Eierkuchen“. Wer in Berlin Pfannkuchen bestellt, bekommt etwas Süßes mit Marmelade.",
  },
  {
    hoch: "der Pfannkuchen (flach)", gruppe: "Essen & Trinken",
    was: "Der flache Teigfladen aus Mehl, Milch und Ei, aus der Pfanne.",
    formen: { bayern: null, schwaben: null, sachsen: "der Eierkuchen", ruhr: null,
              berlin: "der Eierkuchen", oesterreich: "die Palatschinke", schweiz: "die Omelette" },
    notiz: "Siehe den Eintrag darüber — in Berlin und Sachsen MUSS man „Eierkuchen“ sagen, sonst bekommt man Gebäck.",
  },
  {
    hoch: "die Kartoffel", gruppe: "Essen & Trinken",
    was: "Die Knolle, die in Deutschland zu fast allem passt.",
    formen: { bayern: "der Erdapfel", schwaben: "die Grombiere", sachsen: null, ruhr: null,
              berlin: null, oesterreich: "der Erdapfel", schweiz: "der Härdöpfel" },
    notiz: "In der Pfalz und im Saarland „die Grumbeere“. Alle drei Wörter meinen dasselbe: Apfel aus der Erde.",
  },
  {
    hoch: "die Tomate", gruppe: "Essen & Trinken",
    was: "Das rote Fruchtgemüse aus dem Salat.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "der Paradeiser", schweiz: null },
    notiz: "„Paradeiser“ ist rein österreichisch — von „Paradiesapfel“. In Wien steht es so auf der Speisekarte.",
  },
  {
    hoch: "die Aprikose", gruppe: "Essen & Trinken",
    was: "Die kleine orange Steinfrucht.",
    formen: { bayern: "die Marille", schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "die Marille", schweiz: null },
    notiz: "„Wachauer Marillenmarmelade“ ist in Österreich ein feststehender Begriff — mit „Aprikose“ wäre sie nicht dieselbe.",
  },
  {
    hoch: "die Sahne", gruppe: "Essen & Trinken",
    was: "Das Fett der Milch — auf dem Kuchen, im Kaffee, in der Soße.",
    formen: { bayern: "der Rahm", schwaben: "der Rahm", sachsen: null, ruhr: null, berlin: null,
              oesterreich: "das Obers", schweiz: "der Rahm / die Nidle" },
    notiz: "In Österreich heißt die geschlagene Sahne „das Schlagobers“ — im Kaffeehaus einfach „ein Melange mit Obers“.",
  },
  {
    hoch: "der Quark", gruppe: "Essen & Trinken",
    was: "Das weiße Frischkäseerzeugnis aus Sauermilch.",
    formen: { bayern: "der Topfen", schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "der Topfen", schweiz: null },
    notiz: "Österreichische Rezepte nennen die Topfentorte — das ist der Käsekuchen.",
  },
  {
    hoch: "die Möhre", gruppe: "Essen & Trinken",
    was: "Das orange Wurzelgemüse.",
    formen: { bayern: "die gelbe Rübe", schwaben: "die gelbe Rübe", sachsen: "die Mohrrübe",
              ruhr: "die Mohrrübe", berlin: "die Mohrrübe", oesterreich: "die Karotte",
              schweiz: "das Rüebli" },
    notiz: "Im Norden sagt man auch „die Wurzel“. „Karotte“ versteht man überall — es ist das sicherste Wort.",
  },
  {
    hoch: "der Rotkohl", gruppe: "Essen & Trinken",
    was: "Der rote Kohl, der klassisch zum Braten gehört.",
    formen: { bayern: "das Blaukraut", schwaben: "das Blaukraut", sachsen: "das Rotkraut",
              ruhr: null, berlin: null, oesterreich: "das Blaukraut / das Rotkraut", schweiz: "der Rotchabis" },
    notiz: "Rot oder blau hängt am Boden: in saurer Erde wird der Kohl rot, in kalkhaltiger blau. Beide Wörter haben also recht.",
  },
  {
    hoch: "die Frikadelle", gruppe: "Essen & Trinken",
    was: "Der gebratene Kloß aus Hackfleisch.",
    formen: { bayern: "das Fleischpflanzerl", schwaben: "das Fleischküchle", sachsen: null,
              ruhr: "die Frikandelle", berlin: "die Bulette", oesterreich: "das faschierte Laibchen",
              schweiz: "das Hacktätschli" },
    notiz: "„Bulette“ kommt aus dem Französischen (boulette, Kügelchen) — ein Rest aus der Zeit der Hugenotten in Berlin.",
  },
  {
    hoch: "das Hackfleisch", gruppe: "Essen & Trinken",
    was: "Das durch den Wolf gedrehte Fleisch.",
    formen: { bayern: null, schwaben: null, sachsen: "das Gehackte", ruhr: null,
              berlin: "das Gehackte", oesterreich: "das Faschierte", schweiz: "das Ghackte" },
    notiz: "Achtung: „Hackepeter“ (Berlin) und „Mett“ (Westen) sind rohes, gewürztes Schweinehack — nicht dasselbe wie Hackfleisch zum Braten.",
  },
  {
    hoch: "das Hähnchen", gruppe: "Essen & Trinken",
    was: "Das Brathähnchen vom Grill oder aus dem Ofen.",
    formen: { bayern: "das Hendl", schwaben: null, sachsen: "der Broiler", ruhr: null,
              berlin: "der Broiler / das Hähnchen", oesterreich: "das Hendl", schweiz: "das Poulet" },
    notiz: "„Broiler“ ist das Wort der DDR — im Osten hört man es bis heute, im Westen kennt es fast niemand.",
  },
  {
    hoch: "der Kartoffelpuffer", gruppe: "Essen & Trinken",
    was: "Der flache, gebratene Fladen aus geriebenen Kartoffeln.",
    formen: { bayern: "der Reiberdatschi", schwaben: null, sachsen: null,
              ruhr: "der Reibekuchen", berlin: null, oesterreich: "der Erdäpfelpuffer", schweiz: "die Rösti" },
    notiz: "Die Schweizer Rösti ist verwandt, aber nicht dasselbe: sie wird als eine große Scheibe in der Pfanne gebacken.",
  },
  {
    hoch: "der Kloß", gruppe: "Essen & Trinken",
    was: "Die gekochte Kugel aus Kartoffel- oder Semmelteig, als Beilage.",
    formen: { bayern: "der Knödel", schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "der Knödel", schweiz: null },
    notiz: "Grobe Faustregel: nördlich des Mains Kloß, südlich davon Knödel. In Thüringen sind die „Thüringer Klöße“ eine eigene Institution.",
  },
  {
    hoch: "das Würstchen", gruppe: "Essen & Trinken",
    was: "Das dünne Brühwürstchen mit Senf oder im Brötchen.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "das Frankfurter", schweiz: "das Wienerli" },
    notiz: "Kurios: In Deutschland heißt es „Wiener Würstchen“, in Wien „Frankfurter“. Jede Stadt schreibt die Wurst der anderen zu.",
  },
  {
    hoch: "das Butterbrot", gruppe: "Essen & Trinken",
    was: "Die Scheibe Brot mit Butter und Belag.",
    formen: { bayern: null, schwaben: null, sachsen: "die Bemme", ruhr: null,
              berlin: "die Stulle", oesterreich: null, schweiz: "das Butterbrot / die Schnitte" },
    notiz: "„Bemme“ ist so sächsisch wie kaum ein zweites Wort; „Stulle“ hört man in Berlin und Brandenburg.",
  },
  {
    hoch: "die Zwischenmahlzeit", gruppe: "Essen & Trinken",
    was: "Die kleine Mahlzeit zwischendurch — Brot, Wurst, Käse.",
    formen: { bayern: "die Brotzeit", schwaben: "das Vesper", sachsen: null, ruhr: null,
              berlin: null, oesterreich: "die Jause", schweiz: "das Znüni (vormittags) / das Zvieri (nachmittags)" },
    notiz: "Die Schweizer Wörter sagen die Uhrzeit mit: Znüni um neun, Zvieri um vier.",
  },
  {
    hoch: "die Kneipe", gruppe: "Essen & Trinken",
    was: "Die einfache Gaststätte, in der man abends etwas trinkt.",
    formen: { bayern: "das Wirtshaus", schwaben: "die Wirtschaft", sachsen: null, ruhr: null,
              berlin: "die Eckkneipe", oesterreich: "das Beisl", schweiz: "die Beiz" },
    notiz: "Im Ruhrgebiet gehört die „Trinkhalle“ (auch „die Bude“) dazu — ein Kiosk, an dem man auch stehen bleibt.",
  },
  {
    hoch: "der Kiosk", gruppe: "Essen & Trinken",
    was: "Der kleine Laden für Getränke, Zeitungen und Süßigkeiten.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: "die Trinkhalle / die Bude",
              berlin: "der Späti", oesterreich: "die Trafik", schweiz: "das Kiosk" },
    notiz: "Der Berliner „Spätkauf“ hat bis tief in die Nacht offen. Die österreichische Trafik verkauft vor allem Tabak, Zeitungen und Fahrscheine.",
  },

  /* ---------------- Zeit ---------------- */
  {
    hoch: "der Samstag", gruppe: "Zeit",
    was: "Der sechste Tag der Woche.",
    formen: { bayern: null, schwaben: null, sachsen: "der Sonnabend", ruhr: null,
              berlin: "der Sonnabend", oesterreich: null, schweiz: null },
    notiz: "Beide Wörter sind hochdeutsch und amtlich richtig. „Sonnabend“ ist im Norden und Osten üblich, „Samstag“ im Süden, Westen und in den Medien.",
  },
  {
    hoch: "Viertel nach drei (15:15)", gruppe: "Zeit",
    was: "Fünfzehn Minuten nach der vollen Stunde.",
    formen: { bayern: "viertel vier", schwaben: "viertel vier", sachsen: "viertel vier",
              ruhr: null, berlin: null, oesterreich: "viertel vier", schweiz: "viertel ab drei" },
    notiz: "Die gefährlichste Zeitangabe überhaupt: „viertel vier“ heißt 15:15, nicht 16:15 — gezählt wird zur NÄCHSTEN Stunde hin, ein Viertel des Weges dorthin. Im Zweifel sagt man die Uhrzeit als Zahl.",
  },
  {
    hoch: "Viertel vor vier (15:45)", gruppe: "Zeit",
    was: "Fünfzehn Minuten vor der vollen Stunde.",
    formen: { bayern: "dreiviertel vier", schwaben: "dreiviertel vier", sachsen: "dreiviertel vier",
              ruhr: null, berlin: null, oesterreich: "dreiviertel vier", schweiz: "viertel vor vier" },
    notiz: "Dieselbe Logik: drei Viertel des Weges zur vier. Eine Linie quer durch Deutschland trennt „Viertel vor“ (Westen, Norden) von „dreiviertel“ (Osten, Süden).",
  },
  {
    hoch: "der Januar", gruppe: "Zeit",
    was: "Der erste Monat des Jahres.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "der Jänner", schweiz: null },
    notiz: "„Jänner“ steht in Österreich auf amtlichen Formularen und in der Zeitung — es ist kein Dialekt, sondern die dortige Standardform.",
  },

  /* ---------------- Menschen ---------------- */
  {
    hoch: "der Junge", gruppe: "Menschen",
    was: "Das männliche Kind.",
    formen: { bayern: "der Bub", schwaben: "der Bub", sachsen: null, ruhr: "der Jung",
              berlin: null, oesterreich: "der Bub", schweiz: "der Bueb" },
    notiz: "Die Linie zwischen „Junge“ und „Bub“ verläuft ungefähr am Main. Im Rheinland hört man auch „der Jung“.",
  },
  {
    hoch: "das Mädchen", gruppe: "Menschen",
    was: "Das weibliche Kind.",
    formen: { bayern: "das Mädl / das Dirndl", schwaben: "das Mädle", sachsen: "das Mädel",
              ruhr: null, berlin: null, oesterreich: "das Mädl / das Dirndl", schweiz: "das Meitli" },
    notiz: "„Dirndl“ heißt beides: das Mädchen und das Kleid. Welches gemeint ist, sagt der Zusammenhang.",
  },
  {
    hoch: "der Metzger", gruppe: "Menschen",
    was: "Wer Fleisch verarbeitet und verkauft.",
    formen: { bayern: null, schwaben: null, sachsen: "der Fleischer", ruhr: null,
              berlin: "der Fleischer", oesterreich: "der Fleischhauer", schweiz: null },
    notiz: "Im Norden heißt er „der Schlachter“. Über dem Laden steht meistens das regionale Wort — man erkennt die Gegend am Schild.",
  },
  {
    hoch: "das Kind", gruppe: "Menschen",
    was: "Der junge Mensch.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: "das Pänz (Mehrzahl)",
              berlin: "die Gören (Mehrzahl)", oesterreich: null, schweiz: "das Chind" },
    notiz: "„Pänz“ ist rheinisch und wird fast nur in der Mehrzahl gesagt. „Gören“ klingt in Berlin liebevoll-frech, anderswo abwertend — Vorsicht damit.",
  },
  {
    hoch: "der Hausmeister", gruppe: "Menschen",
    was: "Wer sich um ein Gebäude kümmert.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "der Hausbesorger", schweiz: "der Abwart" },
    notiz: "In der Schweiz steht „Abwart“ so am Klingelschild.",
  },

  /* ---------------- Sprechen und Tun ---------------- */
  {
    hoch: "sprechen / reden", gruppe: "Sprechen & Tun",
    was: "Worte an jemanden richten.",
    formen: { bayern: "ratschen", schwaben: "schwätzen", sachsen: "schwatzen",
              ruhr: "quatschen", berlin: "quatschen / labern", oesterreich: "plaudern",
              schweiz: "schwatzen" },
    notiz: "Alle diese Wörter meinen eher das lockere Reden. Für „eine Rede halten“ bleibt es überall „sprechen“.",
  },
  {
    hoch: "gucken / schauen", gruppe: "Sprechen & Tun",
    was: "Den Blick auf etwas richten.",
    formen: { bayern: "schauen", schwaben: "gucken / luagen", sachsen: "gucken",
              ruhr: "kucken", berlin: "kieken", oesterreich: "schauen", schweiz: "luegen" },
    notiz: "Auch hier trennt eine Linie quer durch das Land: im Norden und Osten „gucken“, im Süden „schauen“. Fernsehen heißt entsprechend „Fernsehen gucken“ oder „fernschauen“.",
  },
  {
    hoch: "fegen / kehren", gruppe: "Sprechen & Tun",
    was: "Den Boden mit dem Besen sauber machen.",
    formen: { bayern: "kehren", schwaben: "kehren", sachsen: "kehren", ruhr: "fegen",
              berlin: "fegen", oesterreich: "kehren", schweiz: "wischen" },
    notiz: "In Schwaben gehört dazu die „Kehrwoche“: Die Hausbewohner sind reihum für Treppenhaus und Gehweg zuständig. Wer das nicht weiß, gerät als Neuer schnell in Erklärungsnot.",
  },
  {
    hoch: "arbeiten", gruppe: "Sprechen & Tun",
    was: "Einer Tätigkeit nachgehen, für die man bezahlt wird.",
    formen: { bayern: "schaffen", schwaben: "schaffen", sachsen: null, ruhr: "malochen",
              berlin: "malochen", oesterreich: null, schweiz: "schaffen / werken" },
    notiz: "„Malochen“ kommt aus dem Bergbau und meint harte körperliche Arbeit. „Schaffen“ im Süden heißt schlicht arbeiten — „i muss schaffa“ ist kein Stolz, sondern ein Terminhinweis.",
  },
  {
    hoch: "Guten Tag / Hallo", gruppe: "Sprechen & Tun",
    was: "Die Begrüßung am Tag.",
    formen: { bayern: "Grüß Gott / Servus", schwaben: "Grüß Gott / Griaß di",
              sachsen: "Tach", ruhr: "Tach / Glück auf", berlin: "Tach / Hallo",
              oesterreich: "Grüß Gott / Servus", schweiz: "Grüezi" },
    notiz: "„Grüß Gott“ ist im Süden auch für Nichtgläubige ganz normal — es ist keine religiöse Aussage, sondern schlicht der Gruß. „Glück auf“ ist der alte Bergmannsgruß im Ruhrgebiet.",
  },
  {
    hoch: "Tschüss / auf Wiedersehen", gruppe: "Sprechen & Tun",
    was: "Die Verabschiedung.",
    formen: { bayern: "Servus / Pfiat di", schwaben: "Ade", sachsen: "Tschüss",
              ruhr: "Tschö", berlin: "Tschüss", oesterreich: "Baba / Servus",
              schweiz: "Adieu / Tschau" },
    notiz: "„Servus“ heißt im Süden und in Österreich beides — hallo und tschüss. Es gilt nur beim Du.",
  },

  /* ---------------- Wohnen und Dinge ---------------- */
  {
    hoch: "die Treppe", gruppe: "Wohnen & Dinge",
    was: "Die Stufen von einem Stockwerk zum nächsten.",
    formen: { bayern: "die Stiege", schwaben: "die Staffel", sachsen: null, ruhr: null,
              berlin: null, oesterreich: "die Stiege", schweiz: "die Stäge" },
    notiz: "In Stuttgart sind die „Stäffele“ berühmt — die vielen Freitreppen an den Weinbergen mitten in der Stadt.",
  },
  {
    hoch: "der Bürgersteig", gruppe: "Wohnen & Dinge",
    was: "Der Weg für Fußgänger neben der Fahrbahn.",
    formen: { bayern: "der Gehsteig", schwaben: "der Gehweg / das Trottoir",
              sachsen: "der Fußweg", ruhr: null, berlin: null,
              oesterreich: "der Gehsteig", schweiz: "das Trottoir" },
    notiz: "„Trottoir“ kommt aus dem Französischen und ist im Südwesten und in der Schweiz das normale Wort.",
  },
  {
    hoch: "die Tüte", gruppe: "Wohnen & Dinge",
    was: "Der Beutel aus Papier oder Kunststoff im Laden.",
    formen: { bayern: "das Sackerl", schwaben: "der Beutel", sachsen: "der Beutel",
              ruhr: null, berlin: null, oesterreich: "das Sackerl", schweiz: "der Sack / das Säckli" },
    notiz: "An der Kasse fragt man in Wien „A Sackerl dazu?“ und in Zürich „Bruuched Sie es Säckli?“.",
  },
  {
    hoch: "der Mülleimer", gruppe: "Wohnen & Dinge",
    was: "Der Behälter für den Abfall in der Wohnung.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "der Mistkübel", schweiz: "der Kehrichteimer" },
    notiz: "In Österreich heißt der Abfall „der Mist“ — der Mistkübel hat mit Bauernhof nichts zu tun.",
  },
  {
    hoch: "das Kopfkissen", gruppe: "Wohnen & Dinge",
    was: "Das Kissen, auf dem der Kopf liegt.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "der Polster", schweiz: null },
    notiz: "In Österreich ist „der Polster“ das Kissen — was in Deutschland das Polster der Couch ist, heißt dort anders.",
  },
  {
    hoch: "die Bettdecke", gruppe: "Wohnen & Dinge",
    was: "Die dicke Decke, unter der man schläft.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: "das Oberbett",
              berlin: "das Oberbett", oesterreich: "die Tuchent", schweiz: "das Duvet" },
    notiz: "„Duvet“ spricht man in der Schweiz französisch: „Düweh“.",
  },
  {
    hoch: "die Hausschuhe", gruppe: "Wohnen & Dinge",
    was: "Die Schuhe, die man in der Wohnung trägt.",
    formen: { bayern: "die Schlappen", schwaben: "die Schlappa", sachsen: "die Puschen",
              ruhr: "die Puschen", berlin: "die Puschen", oesterreich: "die Patschen",
              schweiz: "die Finken" },
    notiz: "In vielen deutschen Wohnungen zieht man die Straßenschuhe an der Tür aus — ein Angebot von Hausschuhen ist Gastfreundschaft, keine Kritik.",
  },
  {
    hoch: "das Fahrrad", gruppe: "Wohnen & Dinge",
    was: "Das Zweirad mit Pedalen.",
    formen: { bayern: "das Radl", schwaben: "das Rädle", sachsen: null, ruhr: null,
              berlin: null, oesterreich: "das Radl", schweiz: "das Velo" },
    notiz: "In der Schweiz heißt es ausschließlich „Velo“ — auch auf Verkehrsschildern und in Gesetzestexten.",
  },
  {
    hoch: "der Aufzug", gruppe: "Wohnen & Dinge",
    was: "Die Kabine, die zwischen den Stockwerken fährt.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: "der Fahrstuhl",
              berlin: "der Fahrstuhl", oesterreich: "der Lift", schweiz: "der Lift" },
    notiz: "„Lift“ versteht man überall; im Behördendeutsch steht „Aufzug“.",
  },
  {
    hoch: "der Putzlappen", gruppe: "Wohnen & Dinge",
    was: "Das Tuch zum Saubermachen.",
    formen: { bayern: "der Putzlumpen", schwaben: "der Lumpen", sachsen: null, ruhr: null,
              berlin: null, oesterreich: "der Putzfetzen", schweiz: "der Putzlumpen" },
    notiz: "Im Norden heißt der große Lappen für den Fußboden „der Feudel“, und das Verb dazu ist „feudeln“.",
  },

  /* ---------------- Ämter, Schule, Gesundheit ---------------- */
  {
    hoch: "das Krankenhaus", gruppe: "Ämter & Schule",
    was: "Das Haus, in dem man behandelt und gepflegt wird.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "das Spital", schweiz: "das Spital" },
    notiz: "In Österreich und der Schweiz heißt es fast nur „Spital“ — „Klinik“ ist meist ein spezialisiertes Haus.",
  },
  {
    hoch: "das Abitur", gruppe: "Ämter & Schule",
    was: "Der Schulabschluss, der zum Studium berechtigt.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "die Matura", schweiz: "die Matura" },
    notiz: "Wer die Matura hat, braucht sie in Deutschland nicht zu übersetzen — sie wird anerkannt, heißt aber weiter Matura.",
  },
  {
    hoch: "die Grundschule", gruppe: "Ämter & Schule",
    was: "Die ersten Schuljahre für alle Kinder.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: "die Volksschule", schweiz: "die Primarschule" },
    notiz: "Achtung: „Volksschule“ heißt in Deutschland etwas ganz anderes — die Volkshochschule ist Erwachsenenbildung am Abend.",
  },
  {
    hoch: "der Führerschein", gruppe: "Ämter & Schule",
    was: "Die Erlaubnis, ein Auto zu fahren.",
    formen: { bayern: null, schwaben: null, sachsen: null, ruhr: null, berlin: null,
              oesterreich: null, schweiz: "der Führerausweis" },
    notiz: "In der Schweiz heißen viele Papiere „Ausweis“: Führerausweis, Fahrausweis (die Fahrkarte), Ausländerausweis.",
  },
  {
    hoch: "der Schluckauf", gruppe: "Ämter & Schule",
    was: "Das unwillkürliche Zucken des Zwerchfells mit dem „Hick“.",
    formen: { bayern: "der Hitscher", schwaben: null, sachsen: null, ruhr: null,
              berlin: "der Hickser", oesterreich: "das Schnackerl", schweiz: "der Hitzgi" },
    notiz: "In Österreich sagt man „Ich hab das Schnackerl“ — ein Wort, das man einmal hört und nie wieder vergisst.",
  },
  {
    hoch: "die Kirmes", gruppe: "Ämter & Schule",
    was: "Das Volksfest mit Karussell, Bude und Riesenrad.",
    formen: { bayern: "die Dult", schwaben: "die Kirbe", sachsen: "der Rummel",
              ruhr: null, berlin: "der Rummel", oesterreich: "der Kirtag", schweiz: "die Chilbi" },
    notiz: "Alle diese Wörter gehen auf die Kirchweih zurück — das Fest zum Jahrestag der Kirchweihe.",
  },
];
