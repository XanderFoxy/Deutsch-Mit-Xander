#!/usr/bin/env node
/* =====================================================================
   DEUTSCHE GERICHTE (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch, jedes Ding einzeln
   antippbar, mit Lupe.

   RECHERCHE (Wirtshauskultur Landkreis Erding; Landgasthöfe in Bayern
   und Oberösterreich; Hotel-Buffets „Deutsche Spezialitäten“):
   - Die GASTSTUBE: Holzbalkendecke, Holzvertäfelung, Dielenboden,
     Fenster mit Butzenscheiben, ein Geweih und eine Kuckucksuhr an der
     Wand, eine Kreidetafel mit dem Tagesangebot, Wagenrad-Leuchter.
   - Der STAMMTISCH ist der Tisch für die Stammgäste — erkennbar am
     schmiedeeisernen Stammtisch-Schild, das auf dem Tisch steht.
   - Beim Buffet stehen die warmen Hauptgerichte in Warmhaltebehältern
     (Chafing Dishes) mit Klapphaube, Suppen in Suppentöpfen, vor jedem
     Gericht ein Namensschild; die Beilagen in Schüsseln auf der
     Anrichte, die Bratensoße in der Sauciere; Kuchen in der gekühlten
     Kuchenvitrine.
   - Ordnung der Gerichte: Hauptgerichte (Buffet), Beilagen (Anrichte),
     Kuchen (Vitrine), Süddeutsches (Stammtisch: Weißwurst, Brezel,
     Leberkäse, Käsespätzle, Maultaschen, Linsensuppe), Norddeutsches
     und Berliner Imbiss (Tisch: Labskaus, Matjes, Fischbrötchen,
     Grünkohl, Currywurst, Bratwurst, Salate) und das deutsche Frühstück
     (Brot, Brötchen, Butter, Käse, Eier).
   Maßstab: Rückwand 37,7 Einheiten je Meter (6 m entfernt), Augenhöhe
   2,4 m, Fluchtpunkt (160|21,5); vordere Tischkante 73,5 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const r = B.r;

const S = neueSzene({ id: "gerichte", titel: "Deutsche Gerichte", emoji: "🍽️", thema: "Essen & Trinken", kuerzel: "ger", fassung: 852 });
const rnd = zufall(1516);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);

/* Die alten Wörter (unverändert): id → [de, syl, it, itSyl, en, tipp] */
const W = {
  schnitzel: ["das Schnitzel","SCHNIT-zel","la cotoletta","co-to-LET-ta","breaded cutlet","Panierte, dünn geklopfte Fleischscheibe. Das Wiener Schnitzel ist vom Kalb, das deutsche meist vom Schwein."],
  steak: ["das Steak","STEAK","la bistecca","bi-STEC-ca","steak","Ein dickes Stück vom Rind, kurz und heiß gebraten. Außen Röstkruste, innen rosa."],
  ruehrei: ["das Rührei","RÜHR-ei","le uova strapazzate","U-o-va stra-paz-ZA-te","scrambled eggs","Eier in der Pfanne gerührt, bis sie weich stocken. Man erkennt es an den weichen Ballen mit ihren Falten — und am Schnittlauch darüber."],
  ei_spiegel: ["das Spiegelei","SPIE-gel-ei","l'uovo all'occhio di bue","UO-vo al-LOC-chio di BU-e","fried egg","Das Ei wird ganz in die Pfanne geschlagen: das Eiweiß wird weiß, der Dotter bleibt rund und gelb."],
  ei_gekocht: ["das gekochte Ei","ge-KOCH-te EI","l'uovo sodo","UO-vo SO-do","boiled egg","In der Schale gekocht und halbiert. Vier Minuten weich, sieben Minuten wachsweich, zehn Minuten hart."],
  bratkartoffeln: ["die Bratkartoffeln","BRAT-kar-tof-feln","le patate arrosto","pa-TA-te ar-RO-sto","fried potatoes","Gekochte Kartoffeln in Scheiben, in der Pfanne braun gebraten, oft mit Speck und Zwiebeln."],
  salzkartoffeln: ["die Salzkartoffeln","SALZ-kar-tof-feln","le patate bollite","pa-TA-te bol-LI-te","boiled potatoes","In Salzwasser gekocht, sonst nichts. Die einfachste Beilage überhaupt."],
  kartoffelpueree: ["das Kartoffelpüree","Kar-TOF-fel-pü-ree","il purè di patate","pu-RÈ di pa-TA-te","mashed potatoes","Gekochte Kartoffeln zerstampft, mit Milch und Butter glatt gerührt."],
  pommes: ["die Pommes frites","POM-mes fritt","le patatine fritte","pa-ta-TI-ne FRIT-te","french fries","In heißem Fett ausgebackene Kartoffelstäbchen. Zweimal frittiert werden sie außen knusprig und innen weich."],
  reis: ["der Reis","REIS","il riso","RI-so","rice","Man sieht die EINZELNEN Körner — daran erkennt man gekochten Reis und nicht einen weißen Klumpen."],
  sauerkraut: ["das Sauerkraut","SAU-er-kraut","i crauti","CRAU-ti","sauerkraut","Weißkohl, fein gehobelt und mit Salz vergoren. Durch das Säuern wird er haltbar — und sauer."],
  rotkohl: ["der Rotkohl","ROT-kohl","il cavolo rosso","CA-vo-lo ROS-so","red cabbage","Rotkohl mit Apfel und Essig geschmort. Der Essig hält ihn rot; ohne ihn wird er blau."],
  bratensosse: ["die Bratensoße","BRA-ten-so-ße","il sugo d'arrosto","SU-go dar-RO-sto","gravy","Der Bratensaft mit Mehl gebunden. Man sieht, dass sie fließt: der Rand läuft flach aus und das Licht spiegelt."],
  senf: ["der Senf","SENF","la senape","SE-na-pe","mustard","Gemahlene Senfkörner mit Essig. Zur Bratwurst gehört mittelscharfer, zur Weißwurst süßer Senf."],
  ketchup: ["der Ketchup","KET-chup","il ketchup","KET-chup","ketchup","Eingekochte Tomaten, süß und sauer zugleich."],
  brot: ["das Brot","BROT","il pane","PA-ne","bread","In Deutschland gibt es über dreihundert Brotsorten — mehr als in jedem anderen Land."],
  broetchen: ["das Brötchen","BRÖT-chen","il panino","pa-NI-no","bread roll","Im Norden Brötchen, in Berlin Schrippe, in Bayern Semmel, im Rheinland Weck — dasselbe Gebäck, vier Wörter."],
  butter: ["die Butter","BUT-ter","il burro","BUR-ro","butter","Aus Rahm geschlagen. Auf dem Brot zuerst, dann alles andere."],
  kaese: ["der Käse","KÄ-se","il formaggio","for-MAG-gio","cheese","Die Löcher im Schnittkäse entstehen durch Gase, die Bakterien beim Reifen bilden."],
  gurkensalat: ["der Gurkensalat","GUR-ken-sa-lat","l'insalata di cetrioli","in-sa-LA-ta di ce-tri-O-li","cucumber salad","Hauchdünne Gurkenscheiben mit Essig, Öl und Dill."],
  kartoffelsalat: ["der Kartoffelsalat","Kar-TOF-fel-sa-lat","l'insalata di patate","in-sa-LA-ta di pa-TA-te","potato salad","Im Norden mit Mayonnaise, im Süden mit Brühe und Essig. Darüber streiten die Familien seit Generationen."],
  gulasch: ["das Gulasch","GU-lasch","il gulasch","GU-lasch","goulash","Fleischwürfel, lange in Zwiebeln und Paprika geschmort. Kommt aus Ungarn und ist längst überall zu Hause."],
  gemuesesuppe: ["die Gemüsesuppe","Ge-MÜ-se-sup-pe","la minestra di verdure","mi-NE-stra di ver-DU-re","vegetable soup","Klare Brühe mit klein geschnittenem Gemüse und Suppennudeln."],
  butterbrot: ["das Butterbrot","BUT-ter-brot","il pane e burro","PA-ne e BUR-ro","bread and butter","Eine Scheibe Brot mit Butter — das Abendbrot in seiner kürzesten Form."],
  wurstbrot: ["das Wurstbrot","WURST-brot","il panino con salame","pa-NI-no con sa-LA-me","sausage sandwich","Butterbrot mit Wurst darauf. Steht in Millionen Brotdosen."],
  rinderbraten: ["der Rinderbraten","RIN-der-bra-ten","l'arrosto di manzo","ar-RO-sto di MAN-zo","roast beef","Ein großes Stück Rindfleisch aus dem Ofen, in Scheiben geschnitten, mit Soße."],
  spaetzle: ["die Spätzle","SPÄTZ-le","gli spätzle","SPÄTZ-le","Swabian noodles","SPÄTZLE werden vom BRETT GESCHABT. Darum ist kein Stück wie das andere: verschieden lang, vorn dick und rund, hinten dünn ausgezogen, die Kante wellig und ausgefranst. Aus Schwaben."],
  nudeln: ["die Nudeln","NU-deln","la pasta","PA-sta","noodles","BANDNUDELN werden ausgerollt und mit dem Messer geschnitten. Darum ist jede über ihre ganze Länge GLEICH BREIT, die beiden Kanten laufen parallel, und das Band ist flach. Genau darin unterscheidet es sich vom geschabten Spätzle daneben."],
  weisswurst: ["die Weißwurst","WEISS-wurst","la salsiccia bianca bavarese","sal-SIC-cia BIAN-ca ba-va-RE-se","Bavarian white sausage","Aus Kalbfleisch und Speck, nur gebrüht, nie gebraten. In München sagt man: Sie darf das Zwölfuhrläuten nicht mehr hören. Dazu süßer Senf und eine Brezel."],
  leberkaese: ["der Leberkäse","LE-ber-kä-se","il polpettone bavarese","pol-pet-TO-ne ba-va-RE-se","meatloaf","Ein gebackener Brätlaib — trotz des Namens meist ohne Leber und ohne Käse. In dicken Scheiben, oft in der Semmel."],
  brezel: ["die Brezel","BRE-zel","il bretzel","BRE-tzel","pretzel","Laugengebäck mit dickem Bauch und zwei dünnen, gekreuzten Armen. In Bayern gehört sie zur Brotzeit."],
  knoedel: ["der Knödel","KNÖ-del","il canederlo","ca-NE-der-lo","dumpling","Der Semmelknödel aus altem Brötchen, Milch und Ei. Er zieht im heißen Wasser, er kocht nicht — sonst zerfällt er."],
  kaesespaetzle: ["die Käsespätzle","KÄ-se-spätz-le","gli spätzle al formaggio","SPÄTZ-le al for-MAG-gio","cheese spaetzle","Spätzle mit geriebenem Bergkäse in Schichten und Röstzwiebeln obenauf. Das Bergsteigeressen schlechthin."],
  maultaschen: ["die Maultaschen","MAUL-ta-schen","i ravioli svevi","ra-VIO-li SVE-vi","Swabian pasta pockets","Große gefüllte Teigtaschen. Der Überlieferung nach versteckten Mönche in der Fastenzeit das Fleisch im Teig — daher der Spitzname „Herrgottsbscheißerle“."],
  linsensuppe: ["die Linsensuppe","LIN-sen-sup-pe","la zuppa di lenticchie","ZUP-pa di len-TIC-chie","lentil soup","Linsen mit Spätzle und Saitenwürstchen sind das schwäbische Alltagsgericht. Ein Schuss Essig gehört dazu."],
  sauerbraten: ["der Sauerbraten","SAU-er-bra-ten","l'arrosto marinato","ar-RO-sto ma-ri-NA-to","marinated pot roast","Rindfleisch, tagelang in Essig und Gewürzen eingelegt. Im Rheinland kommen Rosinen und Rübenkraut in die Soße — das macht sie süßsauer."],
  kartoffelpuffer: ["der Kartoffelpuffer","Kar-TOF-fel-puf-fer","la frittella di patate","frit-TEL-la di pa-TA-te","potato pancake","Geriebene rohe Kartoffeln, in Fett ausgebacken. Im Rheinland heißen sie Reibekuchen und werden mit Apfelmus gegessen."],
  roulade: ["die Roulade","Rou-LA-de","l'involtino di manzo","in-vol-TI-no di MAN-zo","beef roulade","Eine dünne Rindfleischscheibe, um Speck, Zwiebel, Gurke und Senf gerollt und zwei Stunden geschmort."],
  labskaus: ["das Labskaus","LABS-kaus","il labskaus","LABS-kaus","labskaus","Ein rosabrauner Brei aus Kartoffeln, Pökelfleisch und Roter Bete — Seemannsessen, weil man dafür keine Zähne braucht. Dazu Spiegelei, Rollmops und Gurke."],
  matjes: ["der Matjes","MAT-jes","l'aringa giovane","a-RIN-ga gio-VA-ne","soused herring","Ein junger Hering, mild gesalzen und in Fässern gereift. Im Frühsommer gibt es den ersten."],
  fischbroetchen: ["das Fischbrötchen","FISCH-bröt-chen","il panino al pesce","pa-NI-no al PE-sce","fish roll","Am Hafen isst jeder eins: Brötchen, Fisch, Zwiebelringe, Gurke."],
  gruenkohl: ["der Grünkohl","GRÜN-kohl","il cavolo riccio","CA-vo-lo RIC-cio","kale","Der Kohl braucht Frost, bevor er geerntet wird — dann schmeckt er milder. Im Januar zieht man in Niedersachsen zum Grünkohlessen los, mit Pinkelwurst."],
  schwarzbrot: ["das Schwarzbrot","SCHWARZ-brot","il pane nero","PA-ne NE-ro","dark rye bread","Sehr dunkles, dichtes Brot aus Roggenschrot. Pumpernickel backt bis zu sechzehn Stunden."],
  bratwurst: ["die Bratwurst","BRAT-wurst","la salsiccia arrosto","sal-SIC-cia ar-RO-sto","fried sausage","Die Thüringer Rostbratwurst wird über Holzkohle gegrillt und quer im Brötchen gegessen — mit Senf, nie mit Ketchup, sagen die Thüringer."],
  klopse: ["die Königsberger Klopse","KÖ-nigs-ber-ger KLOP-se","le polpette in salsa di capperi","pol-PET-te in SAL-sa di CAP-pe-ri","meatballs in caper sauce","Königsberger Klopse: helle Fleischklößchen in weißer Soße mit Kapern. Sie kommen aus Ostpreußen und wurden nach 1945 in ganz Ostdeutschland heimisch."],
  streuselkuchen: ["der Streuselkuchen","STREU-sel-ku-chen","la torta sbriciolata","TOR-ta sbri-cio-LA-ta","crumble cake","Ein Blechkuchen mit dicker Butterstreuseldecke. In Sachsen gehört er zu jedem Kaffeetisch."],
  currywurst: ["die Currywurst","CUR-ry-wurst","la salsiccia al curry","sal-SIC-cia al CUR-ry","curry sausage","Gebratene Brühwurst, in Stücke geschnitten, mit Tomatensoße und Currypulver. 1949 in Berlin erfunden."],
  currywurst_pommes: ["die Currywurst mit Pommes","CUR-ry-wurst mit POM-mes","la salsiccia al curry con patatine","sal-SIC-cia al CUR-ry con pa-ta-TI-ne","currywurst with chips","Currywurst mit Pommes und dem kleinen Holzgäbelchen — so bekommt man sie an jeder Bude."],
  eisbein: ["das Eisbein","EIS-bein","lo stinco di maiale","STIN-co di ma-IA-le","pork knuckle","Gepökeltes, gekochtes Schweinebein. In Berlin mit Sauerkraut und Erbspüree."],
  erbspueree: ["das Erbspüree","ERBS-pü-ree","il purè di piselli","pu-RÈ di pi-SEL-li","pea purée","Gelbe Erbsen, weich gekocht und zerdrückt. Die Beilage zum Eisbein."],
  frikadelle: ["die Frikadelle","Fri-ka-DEL-le","la polpetta schiacciata","pol-PET-ta schiac-CIA-ta","meat patty","In Berlin heißt sie Bulette: flach gedrücktes Hackfleisch, in der Pfanne gebraten."],
  berliner: ["der Berliner","Ber-LI-ner","il bombolone","bom-bo-LO-ne","jam doughnut","Ein Hefegebäck mit Marmelade, in Fett ausgebacken. In Berlin selbst heißt es Pfannkuchen — der „Berliner“ ist der Name überall SONST."],
  kirschtorte: ["die Schwarzwälder Kirschtorte","SCHWARZ-wäl-der KIRSCH-tor-te","la torta della Foresta Nera","TOR-ta del-la fo-RE-sta NE-ra","Black Forest gateau","Schwarzwälder Kirschtorte: Schokoladenböden, Sahne, Sauerkirschen und Kirschwasser. Aus dem Schwarzwald."],
  apfelstrudel: ["der Apfelstrudel","AP-fel-stru-del","lo strudel di mele","STRU-del di ME-le","apple strudel","Hauchdünner Teig um Äpfel, Rosinen und Zimt gewickelt. Aus dem Süden und aus Österreich."],
  bienenstich: ["der Bienenstich","BIE-nen-stich","il dolce alle mandorle","DOL-ce al-le MAN-dor-le","bee sting cake","Hefekuchen mit Cremefüllung und einer Decke aus Mandeln und Karamell."],
  kaesekuchen: ["der Käsekuchen","KÄ-se-ku-chen","la torta di formaggio","TOR-ta di for-MAG-gio","cheesecake","Quark auf einem Mürbeteigboden. In Deutschland aus Quark, nicht aus Frischkäse."],
  lebkuchen: ["der Lebkuchen","LEB-ku-chen","il pan di zenzero","PAN di ZEN-ze-ro","gingerbread","Weiches Gewürzgebäck. Der Nürnberger Lebkuchen wird seit dem Mittelalter auf Oblaten gebacken."],
  stollen: ["der Stollen","STOL-len","il dolce natalizio tedesco","DOL-ce na-ta-LI-zio te-DE-sco","Christmas stollen","Schwerer Weihnachtskuchen mit Rosinen, Marzipan und dick Puderzucker. Der Dresdner Christstollen muss drei Wochen ruhen."],
};
const wort = (id, x, y, kunst) => { const w = W[id]; if (!w) throw new Error(id); return { id, de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], tipp: w[5], x, y, kunst }; };

/* ---------- Farben ---------------------------------------------------- */
const HOLZ = S.lg("holz", [[0, "#8a5a32"], [0.5, "#74492a"], [1, "#5e3a20"]]);
const HOLZ_V = S.lg("holzv", [[0, "#6b4426"], [0.5, "#86552f"], [1, "#68411f"]], 0, 0, 1, 0);
const HOLZ_D = S.lg("holzd", [[0, "#5a3820"], [1, "#3f2614"]]);
const STAHL = S.lg("stahl", [[0, "#f4f6f7"], [0.45, "#c9cfd4"], [0.55, "#aeb6bd"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const PORZ = S.rg("porz", [[0, "#ffffff"], [0.75, "#f4f2ec"], [1, "#d8d3c8"]], 0.45, 0.4, 0.65);
const SCHUE = S.lg("schue", [[0, "#ffffff"], [0.7, "#ece8df"], [1, "#cfc8ba"]], 0, 0, 1, 0);
const PANADE = S.rg("panade", [[0, "#f0be62"], [0.6, "#d9953a"], [1, "#a8621f"]], 0.45, 0.35, 0.7);
const BRAUN = S.rg("braten", [[0, "#9a5a32"], [0.7, "#6e3a1c"], [1, "#4a2410"]], 0.45, 0.35, 0.7);
const SOSSE = S.lg("sosse", [[0, "#7a4520"], [1, "#5a2e12"]]);
const KARTOFFEL = S.rg("kartoffel", [[0, "#fbe7a2"], [0.7, "#ecc96a"], [1, "#c99a3e"]], 0.4, 0.35, 0.7);
const KRUSTE = S.rg("kruste", [[0, "#e2a65a"], [0.6, "#c07a32"], [1, "#8a4e1c"]], 0.42, 0.35, 0.75);
const LAUGE = S.rg("lauge", [[0, "#b36a2c"], [0.6, "#8a4614"], [1, "#5e2c0a"]], 0.4, 0.35, 0.8);
const WURST = S.lg("wurst", [[0, "#c98a5a"], [0.5, "#a8653a"], [1, "#7d4424"]]);
const WEISS = S.lg("weisswurst", [[0, "#fbf8f0"], [0.6, "#ece4d2"], [1, "#cdbfa3"]]);

/* ---------- Grundformen (wiederverwendet) ----------------------------- */
/* Teller: Rand + Spiegel; (x|y) = Aufstandspunkt, s = Maßstab */
const teller = (x, y, s, rx = 7.4) => `<ellipse cx="${r(x)}" cy="${r(y - 1.4 * s)}" rx="${r(rx * s)}" ry="${r(2.9 * s)}" fill="${PORZ}" stroke="#c9c2b4" stroke-width=".25"/><ellipse cx="${r(x)}" cy="${r(y - 1.5 * s)}" rx="${r(rx * 0.68 * s)}" ry="${r(1.95 * s)}" fill="none" stroke="#dcd6ca" stroke-width=".3"/>`;
/* Schüssel: Körper + Rand, Inhalt als Ellipse mit Farbe */
const schuessel = (x, y, s, inhalt, rx = 6.4) => `<path d="M${r(x - rx * s)} ${r(y - 4 * s)}Q${r(x - rx * s)} ${r(y)} ${r(x)} ${r(y)}Q${r(x + rx * s)} ${r(y)} ${r(x + rx * s)} ${r(y - 4 * s)}Z" fill="${SCHUE}"/><ellipse cx="${r(x)}" cy="${r(y - 4 * s)}" rx="${r(rx * s)}" ry="${r(1.9 * s)}" fill="#f7f5ef"/><ellipse cx="${r(x)}" cy="${r(y - 4.1 * s)}" rx="${r((rx - 0.7) * s)}" ry="${r(1.5 * s)}" fill="${inhalt}"/>`;
/* Pfanne (Gusseisen) mit Griff */
const pfanne = (x, y, s, inhalt) => `<path d="M${r(x + 6 * s)} ${r(y - 2.4 * s)}l${r(6 * s)} ${r(-1.6 * s)}" stroke="#2a2a2a" stroke-width="${r(1.1 * s)}" stroke-linecap="round"/><path d="M${r(x - 6.6 * s)} ${r(y - 2.6 * s)}v${r(1.2 * s)}q0 ${r(1.3 * s)} ${r(6.6 * s)} ${r(1.3 * s)}t${r(6.6 * s)} ${r(-1.3 * s)}v${r(-1.2 * s)}z" fill="#2f2f2f"/><ellipse cx="${r(x)}" cy="${r(y - 2.6 * s)}" rx="${r(6.6 * s)}" ry="${r(2.4 * s)}" fill="#3a3a3a"/><ellipse cx="${r(x)}" cy="${r(y - 2.6 * s)}" rx="${r(5.9 * s)}" ry="${r(2 * s)}" fill="${inhalt}"/>`;
/* Brett (Holz) */
const brett = (x, y, s, w = 7) => `<path d="M${r(x - w * s)} ${r(y - 1.6 * s)}h${r(2 * w * s)}l${r(-0.8 * s)} ${r(-3.4 * s)}h${r(-(2 * w - 1.6) * s)}z" fill="#c8955a"/><path d="M${r(x - w * s)} ${r(y - 1.6 * s)}h${r(2 * w * s)}v${r(1.2 * s)}h${r(-2 * w * s)}z" fill="#9c6c38"/>`;
const E = (cx, cy, rx, ry, f, extra = "") => `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${f}"${extra}/>`;
const glanz = (cx, cy, rx) => `<ellipse cx="${r(cx - rx * 0.3)}" cy="${r(cy)}" rx="${r(rx * 0.35)}" ry="${r(rx * 0.12)}" fill="#fff" opacity=".35"/>`;
const punkte = (n, cx, cy, rx, ry, f, rr) => { let g = ""; for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()); g += `<circle cx="${r(cx + Math.cos(a) * d * rx)}" cy="${r(cy + Math.sin(a) * d * ry)}" r="${rr}" fill="${f}"/>`; } return g; };
const schild = (x, y, txt) => `<path d="M${r(x - 6)} ${r(y)}l.8 -3.2h10.4l.8 3.2z" fill="#fffdf6" stroke="#bfb6a4" stroke-width=".2"/><text x="${r(x)}" y="${r(y - 0.9)}" font-size="1.9" text-anchor="middle" fill="#3a2a18" font-family="Georgia,serif" font-style="italic">${txt}</text>`;

/* ---------- Die Gerichte: je eine Zeichenfunktion (x, y, s) ----------- */
const G = {
  /* —— Buffet: Warmhaltebehälter (Chafing Dish) —— */
  _chafing: (x, y, s, essen) => {
    let g = `<path d="M${r(x - 9 * s)} ${r(y)}l${r(1.2 * s)} ${r(-3 * s)}M${r(x + 9 * s)} ${r(y)}l${r(-1.2 * s)} ${r(-3 * s)}" stroke="#9aa3aa" stroke-width="${r(0.7 * s)}"/>`;
    g += `<path d="M${r(x - 9.6 * s)} ${r(y - 7.8 * s)}Q${r(x)} ${r(y - 15 * s)} ${r(x + 9.6 * s)} ${r(y - 7.8 * s)}Z" fill="${STAHL}" stroke="#8b949b" stroke-width=".25"/>`;   // aufgeklappte Haube
    g += `<path d="M${r(x - 10 * s)} ${r(y - 3 * s)}h${r(20 * s)}l${r(-0.6 * s)} ${r(-4.6 * s)}h${r(-18.8 * s)}z" fill="${STAHL}"/>`;
    g += `<path d="M${r(x - 9 * s)} ${r(y - 7.6 * s)}h${r(18 * s)}l${r(-1 * s)} ${r(-2.6 * s)}h${r(-16 * s)}z" fill="#8f979e"/>`;
    return g + essen(x, y - 8.9 * s, s);
  },
  schnitzel: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = ""; for (const [dx, dy, a] of [[-4.6, 0.2, -8], [0.4, -0.3, 6], [5, 0.3, -4]]) g += `<ellipse cx="${r(cx + dx * s)}" cy="${r(cy + dy * s)}" rx="${r(3.6 * s)}" ry="${r(1.5 * s)}" fill="${PANADE}" transform="rotate(${a} ${r(cx + dx * s)} ${r(cy + dy * s)})"/>`; g += punkte(14, cx, cy, 7 * s, 1.2 * s, "#f6d08a", r(0.22 * s)); g += E(cx + 3 * s, cy - 0.6 * s, 1.1 * s, 0.6 * s, "#f6e15a") + E(cx + 3 * s, cy - 0.6 * s, 0.7 * s, 0.35 * s, "#fff6b0"); return g; }),
  steak: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = ""; for (const dx of [-4.4, 0.6, 5.2]) { g += E(cx + dx * s, cy, 3 * s, 1.35 * s, "#6e3a1c"); for (let i = -1; i <= 1; i++) g += `<path d="M${r(cx + (dx + i * 1.2 - 1) * s)} ${r(cy - 0.8 * s)}l${r(1.6 * s)} ${r(1.5 * s)}" stroke="#2e170a" stroke-width="${r(0.35 * s)}"/>`; } return g + `<path d="M${r(cx - 6 * s)} ${r(cy + 0.9 * s)}q${r(3 * s)} ${r(-0.6 * s)} ${r(7 * s)} 0" stroke="#d64a4a" stroke-width="${r(0.4 * s)}" fill="none" opacity=".7"/>`; }),
  rinderbraten: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = E(cx, cy + 0.2 * s, 7.6 * s, 1.4 * s, SOSSE); for (let i = 0; i < 6; i++) g += `<ellipse cx="${r(cx + (-5.5 + i * 2.2) * s)}" cy="${r(cy - 0.2 * s)}" rx="${r(1.6 * s)}" ry="${r(1.3 * s)}" fill="#b05e48" stroke="#5a2a14" stroke-width="${r(0.3 * s)}"/><ellipse cx="${r(cx + (-5.5 + i * 2.2) * s)}" cy="${r(cy - 0.3 * s)}" rx="${r(0.9 * s)}" ry="${r(0.7 * s)}" fill="#d07a68"/>`; return g; }),
  sauerbraten: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = E(cx, cy + 0.1 * s, 7.6 * s, 1.5 * s, "#4a2210"); for (let i = 0; i < 5; i++) g += `<ellipse cx="${r(cx + (-5 + i * 2.5) * s)}" cy="${r(cy - 0.3 * s)}" rx="${r(1.8 * s)}" ry="${r(1.2 * s)}" fill="#7a3e22" stroke="#3a1a08" stroke-width="${r(0.25 * s)}"/>`; return g + punkte(10, cx, cy + 0.6 * s, 6.5 * s, 0.6 * s, "#2a1206", r(0.3 * s)) + glanz(cx, cy - 0.8 * s, 6 * s); }),
  roulade: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = E(cx, cy + 0.2 * s, 7.6 * s, 1.4 * s, SOSSE); for (const dx of [-4.2, 0, 4.2]) g += `<rect x="${r(cx + (dx - 1.8) * s)}" y="${r(cy - 1.4 * s)}" width="${r(3.6 * s)}" height="${r(2.2 * s)}" rx="${r(1.1 * s)}" fill="${BRAUN}"/><path d="M${r(cx + (dx - 0.6) * s)} ${r(cy - 1.4 * s)}v${r(2.2 * s)}M${r(cx + (dx + 0.7) * s)} ${r(cy - 1.4 * s)}v${r(2.2 * s)}" stroke="#f3e9d2" stroke-width="${r(0.2 * s)}"/>`;
    g += `<circle cx="${r(cx + 6.4 * s)}" cy="${r(cy - 0.4 * s)}" r="${r(1.1 * s)}" fill="#8a4a28"/><path d="M${r(cx + 6.4 * s)} ${r(cy - 0.4 * s)}m-.5 0a.5 .5 0 1 1 .5 .5" stroke="#d9b48a" stroke-width="${r(0.25 * s)}" fill="none"/>`; return g; }),
  eisbein: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = E(cx, cy + 0.4 * s, 7.4 * s, 1.2 * s, "#e9dc95"); for (let i = 0; i < 12; i++) g += `<path d="M${r(cx + (-6 + i) * s)} ${r(cy + 0.4 * s)}q.6 -.8 1.2 0" stroke="#c8b95a" stroke-width="${r(0.25 * s)}" fill="none"/>`;
    g += `<path d="M${r(cx - 4 * s)} ${r(cy + 0.4 * s)}q${r(-1 * s)} ${r(-3.4 * s)} ${r(3 * s)} ${r(-3.6 * s)}q${r(4.6 * s)} ${r(-0.2 * s)} ${r(5 * s)} ${r(3.2 * s)}z" fill="${S.rg("eisbein", [[0, "#f6d6c4"], [0.6, "#e0a98e"], [1, "#b97a5e"]], 0.45, 0.35, 0.7)}"/><circle cx="${r(cx + 3.6 * s)}" cy="${r(cy - 2.4 * s)}" r="${r(0.7 * s)}" fill="#f6efe0" stroke="#c9b9a0" stroke-width=".2"/>`; return g; }),
  _topf: (x, y, s, inhalt, deko) => {
    let g = `<path d="M${r(x - 6.6 * s)} ${r(y - 9 * s)}v${r(7.6 * s)}q0 ${r(1.4 * s)} ${r(1.4 * s)} ${r(1.4 * s)}h${r(10.4 * s)}q${r(1.4 * s)} 0 ${r(1.4 * s)} ${r(-1.4 * s)}v${r(-7.6 * s)}z" fill="${STAHL}"/>`;
    g += `<path d="M${r(x - 6.6 * s)} ${r(y - 7 * s)}h${r(-1.4 * s)}M${r(x + 6.6 * s)} ${r(y - 7 * s)}h${r(1.4 * s)}" stroke="#8b949b" stroke-width="${r(0.8 * s)}"/>`;
    g += E(x, y - 9 * s, 6.6 * s, 2 * s, "#d7dcdf") + E(x, y - 9 * s, 6 * s, 1.6 * s, inhalt);
    g += `<path d="M${r(x + 3 * s)} ${r(y - 9.4 * s)}l${r(3.4 * s)} ${r(-5 * s)}" stroke="#7d868d" stroke-width="${r(0.6 * s)}"/>`;   // Schöpfkelle
    return g + (deko ? deko(x, y - 9 * s, s) : "");
  },
  gulasch: (x, y, s) => G._topf(x, y, s, "#7a2e14", (cx, cy, s) => { let g = ""; for (let i = 0; i < 8; i++) g += `<rect x="${r(cx + (-4.6 + (i % 4) * 2.6) * s)}" y="${r(cy + (-1 + Math.floor(i / 4) * 0.9) * s)}" width="${r(1.6 * s)}" height="${r(0.9 * s)}" rx="${r(0.3 * s)}" fill="#5a240e"/>`; return g + punkte(5, cx, cy, 4.6 * s, 1 * s, "#c0392b", r(0.3 * s)) + glanz(cx, cy - 0.7 * s, 5 * s); }),
  gemuesesuppe: (x, y, s) => G._topf(x, y, s, "#e3b84f", (cx, cy, s) => punkte(10, cx, cy, 5 * s, 1.2 * s, "#e67e22", r(0.35 * s)) + punkte(8, cx, cy, 5 * s, 1.2 * s, "#4caf50", r(0.3 * s)) + `<path d="M${r(cx - 3 * s)} ${r(cy)}q1 -.6 2 0t2 0M${r(cx + 1 * s)} ${r(cy + 0.6 * s)}q1 -.6 2 0" stroke="#fbeec0" stroke-width="${r(0.3 * s)}" fill="none"/>`),
  frikadelle: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = ""; for (const [dx, dy] of [[-4.6, 0.3], [0, -0.2], [4.6, 0.3], [-2.3, -0.9], [2.3, -0.9]]) g += E(cx + dx * s, cy + dy * s, 2.4 * s, 1.2 * s, BRAUN) + punkte(3, cx + dx * s, cy + dy * s, 1.6 * s, 0.6 * s, "#3e1c0a", r(0.25 * s)); return g; }),
  klopse: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = E(cx, cy + 0.1 * s, 7.6 * s, 1.5 * s, "#f3ead6"); for (const [dx, dy] of [[-4.6, 0.3], [-1.5, 0.1], [1.6, 0.3], [4.7, 0.1], [-3, -0.8], [0.1, -0.8], [3.2, -0.8]]) g += E(cx + dx * s, cy + dy * s, 1.4 * s, 1.05 * s, "#d8c6a6") + E(cx + (dx - 0.4) * s, cy + (dy - 0.4) * s, 0.5 * s, 0.3 * s, "#fff", ' opacity=".5"'); return g + punkte(12, cx, cy, 6.6 * s, 1.2 * s, "#4f6b2a", r(0.28 * s)); }),
  kartoffelpuffer: (x, y, s) => G._chafing(x, y, s, (cx, cy, s) => { let g = ""; for (const [dx, dy] of [[-4.6, 0.3], [0, -0.1], [4.6, 0.3]]) { g += E(cx + dx * s, cy + dy * s, 2.8 * s, 1.3 * s, "#c9862e"); for (let i = 0; i < 7; i++) g += `<path d="M${r(cx + (dx - 2 + rnd() * 4) * s)} ${r(cy + (dy - 0.8 + rnd() * 1.4) * s)}l${r(0.9 * s)} ${r(0.2 * s)}" stroke="#8a4e14" stroke-width="${r(0.25 * s)}"/>`; } return g + E(cx + 6.6 * s, cy - 1.2 * s, 1.4 * s, 0.7 * s, "#eedc9a"); }),

  /* —— Anrichte: Beilagen in Schüsseln —— */
  bratkartoffeln: (x, y, s) => schuessel(x, y, s, "#d79a3e") + (() => { let g = ""; for (let i = 0; i < 9; i++) { const cx = x + (-4 + (i % 5) * 2) * s, cy = y - (4.6 + Math.floor(i / 5) * 0.9) * s; g += E(cx, cy, 1.2 * s, 0.7 * s, "#e9b552", ' stroke="#9a5a1a" stroke-width=".2"'); } return g + punkte(6, x, y - 4.3 * s, 4.6 * s, 0.9 * s, "#8e2b1a", r(0.3 * s)) + punkte(4, x, y - 4.3 * s, 4.6 * s, 0.9 * s, "#f6e7c6", r(0.3 * s)); })(),
  salzkartoffeln: (x, y, s) => schuessel(x, y, s, "#f2d47a") + [[-3, -4.8], [0, -5.2], [3, -4.8], [-1.5, -6.1], [1.6, -6.2]].map(([dx, dy]) => E(x + dx * s, y + dy * s, 1.7 * s, 1.2 * s, KARTOFFEL)).join("") + punkte(6, x, y - 5.4 * s, 3.6 * s, 1 * s, "#3e8e2e", r(0.25 * s)),
  kartoffelpueree: (x, y, s) => schuessel(x, y, s, "#f6e9bf") + `<path d="M${r(x - 4.6 * s)} ${r(y - 4.4 * s)}q${r(4.6 * s)} ${r(-4.2 * s)} ${r(9.2 * s)} 0z" fill="#f8edc6"/>` + E(x, y - 6 * s, 1.4 * s, 0.6 * s, "#f6d35c") + `<path d="M${r(x - 3 * s)} ${r(y - 5.2 * s)}q${r(1.5 * s)} ${r(-0.8 * s)} ${r(3 * s)} 0" stroke="#e2d2a2" stroke-width="${r(0.3 * s)}" fill="none"/>`,
  pommes: (x, y, s) => { let g = `<path d="M${r(x - 5.6 * s)} ${r(y - 4.6 * s)}l${r(1.2 * s)} ${r(4.6 * s)}h${r(8.8 * s)}l${r(1.2 * s)} ${r(-4.6 * s)}z" fill="#c0392b"/><path d="M${r(x - 5 * s)} ${r(y - 2.4 * s)}h${r(10 * s)}" stroke="#fff" stroke-width="${r(0.5 * s)}"/>`; for (let i = 0; i < 14; i++) { const dx = -4.6 + i * 0.7, h = 3 + (i * 7 % 5) * 0.6; g += `<rect x="${r(x + dx * s)}" y="${r(y - (4.4 + h) * s)}" width="${r(0.65 * s)}" height="${r(h * s)}" fill="${i % 3 ? "#f2c14e" : "#e9ae3a"}" transform="rotate(${(i % 5) * 4 - 8} ${r(x + dx * s)} ${r(y - 4.4 * s)})"/>`; } return g; },
  reis: (x, y, s) => schuessel(x, y, s, "#f4f1e8") + `<path d="M${r(x - 4.8 * s)} ${r(y - 4.3 * s)}q${r(4.8 * s)} ${r(-3.6 * s)} ${r(9.6 * s)} 0z" fill="#faf8f2"/>` + (() => { let g = ""; for (let i = 0; i < 30; i++) { const a = rnd() * 2 - 1; g += `<ellipse cx="${r(x + a * 4.2 * s)}" cy="${r(y - (4.6 + rnd() * 2.2 * (1 - a * a)) * s)}" rx="${r(0.42 * s)}" ry="${r(0.17 * s)}" fill="#e2ddcf" transform="rotate(${Math.round(rnd() * 180)} ${r(x)} ${r(y - 5 * s)})"/>`; } return g; })(),
  nudeln: (x, y, s) => schuessel(x, y, s, "#f0d27a") + (() => { let g = ""; for (let i = 0; i < 7; i++) { const yy = y - (4.2 + i * 0.35) * s, a = (i % 2 ? 1 : -1); g += `<path d="M${r(x - 4.6 * s)} ${r(yy)}c${r(2 * s)} ${r(-1.2 * s * a)} ${r(4 * s)} ${r(1.2 * s * a)} ${r(6 * s)} 0s${r(2.6 * s)} ${r(-0.6 * s * a)} ${r(3.2 * s)} 0" stroke="${i % 2 ? "#f6dc8a" : "#e9c766"}" stroke-width="${r(0.75 * s)}" fill="none" stroke-linecap="butt"/>`; } return g; })(),
  spaetzle: (x, y, s) => schuessel(x, y, s, "#f3dc8e") + (() => { let g = ""; for (let i = 0; i < 16; i++) { const cx = x + (rnd() * 8.6 - 4.3) * s, cy = y - (4.2 + rnd() * 1.9) * s, l = (1 + rnd() * 1.6) * s; g += `<path d="M${r(cx)} ${r(cy)}q${r(l * 0.5)} ${r(-0.5 * s)} ${r(l)} ${r(0.2 * s)}" stroke="#f8e6a6" stroke-width="${r((0.5 + rnd() * 0.3) * s)}" stroke-linecap="round" fill="none"/>`; } return g + `<path d="M${r(x - 4 * s)} ${r(y - 4.6 * s)}q${r(4 * s)} ${r(-1.6 * s)} ${r(8 * s)} 0" stroke="#d9b65a" stroke-width="${r(0.2 * s)}" fill="none"/>`; })(),
  knoedel: (x, y, s) => { const KN = S.rg("knoedel", [[0, "#fbf3dc"], [0.6, "#eadcb6"], [1, "#c9b27e"]], 0.4, 0.35, 0.7); return schuessel(x, y, s, "#7a4520") + [[-2.6, -5.8], [2.6, -5.8], [0, -6.8]].map(([dx, dy]) => E(x + dx * s, y + dy * s, 2.3 * s, 2 * s, KN) + punkte(4, x + dx * s, y + dy * s, 1.4 * s, 1.2 * s, "#cfa86a", r(0.25 * s)) + punkte(2, x + dx * s, y + dy * s, 1.4 * s, 1.2 * s, "#4f8a2e", r(0.2 * s))).join(""); },
  sauerkraut: (x, y, s) => schuessel(x, y, s, "#e6dca0") + (() => { let g = ""; for (let i = 0; i < 18; i++) { const cx = x + (rnd() * 8.6 - 4.3) * s, cy = y - (4.2 + rnd() * 1.4) * s; g += `<path d="M${r(cx)} ${r(cy)}q${r(1 * s)} ${r(-0.6 * s)} ${r(2 * s)} 0" stroke="${rnd() < 0.5 ? "#f2ebc0" : "#cfc27a"}" stroke-width="${r(0.3 * s)}" fill="none"/>`; } return g + punkte(4, x, y - 4.6 * s, 4 * s, 0.8 * s, "#3a2a14", r(0.18 * s)); })(),
  rotkohl: (x, y, s) => schuessel(x, y, s, "#6a1d4a") + (() => { let g = ""; for (let i = 0; i < 18; i++) { const cx = x + (rnd() * 8.6 - 4.3) * s, cy = y - (4.2 + rnd() * 1.4) * s; g += `<path d="M${r(cx)} ${r(cy)}q${r(1 * s)} ${r(-0.6 * s)} ${r(2 * s)} 0" stroke="${rnd() < 0.5 ? "#9c3a76" : "#4a1034"}" stroke-width="${r(0.32 * s)}" fill="none"/>`; } return g + E(x + 2 * s, y - 5 * s, 0.9 * s, 0.4 * s, "#f3e3b0"); })(),
  erbspueree: (x, y, s) => schuessel(x, y, s, "#d6c25a") + `<path d="M${r(x - 4.6 * s)} ${r(y - 4.4 * s)}q${r(4.6 * s)} ${r(-3.6 * s)} ${r(9.2 * s)} 0z" fill="#d9c45e"/>` + punkte(5, x, y - 5.2 * s, 3 * s, 0.8 * s, "#8a3a1a", r(0.3 * s)) + `<path d="M${r(x - 2 * s)} ${r(y - 5.6 * s)}q${r(2 * s)} ${r(-0.8 * s)} ${r(4 * s)} 0" stroke="#b9a43e" stroke-width="${r(0.3 * s)}" fill="none"/>`,
  bratensosse: (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 0.6 * s)}" rx="${r(6 * s)}" ry="${r(1.6 * s)}" fill="${PORZ}"/><path d="M${r(x - 4.6 * s)} ${r(y - 4.6 * s)}q0 ${r(3.8 * s)} ${r(3.6 * s)} ${r(3.8 * s)}h${r(2 * s)}q${r(3.4 * s)} 0 ${r(3.6 * s)} ${r(-3 * s)}l${r(2.4 * s)} ${r(-1.6 * s)}z" fill="${SCHUE}"/><path d="M${r(x - 4.6 * s)} ${r(y - 4.6 * s)}q${r(-2.6 * s)} ${r(0.4 * s)} ${r(-1.6 * s)} ${r(2.6 * s)}" stroke="#ece8df" stroke-width="${r(0.7 * s)}" fill="none"/>` + E(x + 0.6 * s, y - 4.7 * s, 4.6 * s, 1.1 * s, SOSSE) + glanz(x + 0.6 * s, y - 4.9 * s, 4 * s) + `<path d="M${r(x + 6.8 * s)} ${r(y - 6.2 * s)}q${r(0.6 * s)} ${r(1.2 * s)} ${r(0.2 * s)} ${r(2.4 * s)}" stroke="#6b3a18" stroke-width="${r(0.5 * s)}" fill="none"/>`,

  /* —— Kuchenvitrine —— */
  kirschtorte: (x, y, s) => { let g = E(x, y - 0.4 * s, 7 * s, 1.5 * s, "#e9e3d7") + `<path d="M${r(x - 6 * s)} ${r(y - 0.6 * s)}v${r(-6.4 * s)}a${r(6 * s)} ${r(1.6 * s)} 0 0 1 ${r(12 * s)} 0v${r(6.4 * s)}a${r(6 * s)} ${r(1.6 * s)} 0 0 1 ${r(-12 * s)} 0z" fill="${S.lg("sahne", [[0, "#fbf8f1"], [0.6, "#f3eee3"], [1, "#d9d0bf"]], 0, 0, 1, 0)}"/>` + E(x, y - 7 * s, 6 * s, 1.6 * s, "#fffdf8");
    g += punkte(26, x, y - 2.4 * s, 5.8 * s, 1.6 * s, "#5a321a", r(0.32 * s)); for (let i = 0; i < 5; i++) { const tx = x + (-4.4 + i * 2.2) * s; g += E(tx, y - 7.6 * s, 0.9 * s, 0.7 * s, "#fffaf0") + `<circle cx="${r(tx)}" cy="${r(y - 8.5 * s)}" r="${r(0.6 * s)}" fill="#8a0c22"/>`; } return g + punkte(10, x, y - 7 * s, 3 * s, 0.8 * s, "#4a2a17", r(0.25 * s)); },
  kaesekuchen: (x, y, s) => `<path d="M${r(x - 6 * s)} ${r(y)}v${r(-5.6 * s)}q${r(6 * s)} ${r(-1.4 * s)} ${r(12 * s)} 0v${r(5.6 * s)}z" fill="${S.lg("kaesek", [[0, "#f6dc93"], [1, "#e6be68"]])}"/><path d="M${r(x - 6 * s)} ${r(y - 5.6 * s)}q${r(6 * s)} ${r(-1.4 * s)} ${r(12 * s)} 0q${r(-6 * s)} ${r(-1.6 * s)} ${r(-12 * s)} 0z" fill="#b8722d"/><rect x="${r(x - 6 * s)}" y="${r(y - 1.2 * s)}" width="${r(12 * s)}" height="${r(1.2 * s)}" fill="#c98c45"/><path d="M${r(x - 1 * s)} ${r(y - 6.2 * s)}V${r(y)}" stroke="#d6aa5c" stroke-width="${r(0.3 * s)}"/>`,
  bienenstich: (x, y, s) => `<rect x="${r(x - 6 * s)}" y="${r(y - 2 * s)}" width="${r(12 * s)}" height="${r(2 * s)}" fill="#e8b766"/><rect x="${r(x - 6 * s)}" y="${r(y - 4.6 * s)}" width="${r(12 * s)}" height="${r(2.6 * s)}" fill="#fbf2d8"/><rect x="${r(x - 6 * s)}" y="${r(y - 6.4 * s)}" width="${r(12 * s)}" height="${r(1.8 * s)}" fill="#e5a85a"/><rect x="${r(x - 6 * s)}" y="${r(y - 7.4 * s)}" width="${r(12 * s)}" height="${r(1 * s)}" fill="#b8661f"/>` + punkte(14, x, y - 7.2 * s, 5.6 * s, 0.4 * s, "#f2d8a2", r(0.35 * s)) + `<path d="M${r(x)} ${r(y - 7.4 * s)}V${r(y)}" stroke="#c48b45" stroke-width="${r(0.3 * s)}"/>`,
  apfelstrudel: (x, y, s) => { let g = `<path d="M${r(x - 6.6 * s)} ${r(y)}q${r(-0.6 * s)} ${r(-5.6 * s)} ${r(3 * s)} ${r(-5.8 * s)}h${r(7.6 * s)}q${r(3.4 * s)} ${r(0.2 * s)} ${r(2.6 * s)} ${r(5.8 * s)}z" fill="${KRUSTE}"/>`; for (let i = 0; i < 5; i++) g += `<path d="M${r(x + (-5 + i * 2.4) * s)} ${r(y - 5.4 * s)}q${r(0.8 * s)} ${r(2 * s)} ${r(0.2 * s)} ${r(4.8 * s)}" stroke="#a86226" stroke-width="${r(0.3 * s)}" fill="none"/>`; g += `<path d="M${r(x + 4.8 * s)} ${r(y)}a${r(2 * s)} ${r(2.8 * s)} 0 0 1 0 ${r(-5.6 * s)}" fill="#f0d79a" stroke="#c48b45" stroke-width=".2"/>` + punkte(4, x + 4.6 * s, y - 2.8 * s, 0.8 * s, 1.8 * s, "#7a3e14", r(0.3 * s)); return g + punkte(30, x - 0.6 * s, y - 5.2 * s, 5.4 * s, 0.9 * s, "#ffffff", r(0.3 * s)); },
  streuselkuchen: (x, y, s) => `<rect x="${r(x - 6 * s)}" y="${r(y - 3.2 * s)}" width="${r(12 * s)}" height="${r(3.2 * s)}" fill="#e2b26c"/>` + punkte(26, x, y - 3.8 * s, 5.8 * s, 0.9 * s, "#efc883", r(0.55 * s)) + punkte(14, x, y - 3.8 * s, 5.8 * s, 0.9 * s, "#c98b44", r(0.45 * s)) + `<path d="M${r(x)} ${r(y - 4.4 * s)}V${r(y)}" stroke="#b77d3d" stroke-width="${r(0.3 * s)}"/>`,
  berliner: (x, y, s) => [[-3.3, 0], [3.3, 0], [0, -2.2]].map(([dx, dy]) => E(x + dx * s, y + (dy - 1.8) * s, 3 * s, 2.1 * s, KRUSTE) + `<path d="M${r(x + (dx - 2.9) * s)} ${r(y + (dy - 1.7) * s)}q${r(2.9 * s)} ${r(1.1 * s)} ${r(5.8 * s)} 0" stroke="#f6ead0" stroke-width="${r(0.8 * s)}" fill="none"/>` + punkte(6, x + dx * s, y + (dy - 2.6) * s, 2 * s, 0.9 * s, "#fff", r(0.25 * s)) + `<circle cx="${r(x + (dx + 2.3) * s)}" cy="${r(y + (dy - 1.9) * s)}" r="${r(0.5 * s)}" fill="#b5162b"/>`).join(""),
  lebkuchen: (x, y, s) => [[-3.2, 0], [3.2, 0], [0, -1.6]].map(([dx, dy]) => E(x + dx * s, y + (dy - 1) * s, 3.4 * s, 1.5 * s, "#e8dcc0") + E(x + dx * s, y + (dy - 1.6) * s, 3 * s, 1.3 * s, "#7a3e1a") + [[-1, 0], [1, 0], [0, -0.6], [0, 0.6]].map(([a, b]) => E(x + (dx + a) * s, y + (dy - 1.6 + b) * s, 0.55 * s, 0.25 * s, "#f3e6c8")).join("")).join(""),
  stollen: (x, y, s) => `<path d="M${r(x - 6.6 * s)} ${r(y)}q${r(-0.4 * s)} ${r(-5 * s)} ${r(4 * s)} ${r(-5.4 * s)}q${r(2.6 * s)} ${r(-0.2 * s)} ${r(2.6 * s)} ${r(1.4 * s)}q0 ${r(-1.6 * s)} ${r(2.8 * s)} ${r(-1.4 * s)}q${r(4 * s)} ${r(0.6 * s)} ${r(3.8 * s)} ${r(5.4 * s)}z" fill="#fbf8f2"/>` + punkte(16, x, y - 3.8 * s, 5.4 * s, 1.2 * s, "#efe9dc", r(0.4 * s)) + `<path d="M${r(x + 4.4 * s)} ${r(y)}v${r(-4 * s)}" stroke="#d9cdb4" stroke-width="${r(0.3 * s)}"/>` + `<rect x="${r(x + 4.6 * s)}" y="${r(y - 3.8 * s)}" width="${r(1.6 * s)}" height="${r(3.8 * s)}" fill="#d9a35b"/>` + punkte(4, x + 5.4 * s, y - 2 * s, 0.6 * s, 1.4 * s, "#5a2a14", r(0.25 * s)) + E(x + 5.4 * s, y - 2.6 * s, 0.4 * s, 0.4 * s, "#f0e6a8"),

  /* —— Stammtisch: Süddeutsches —— */
  weisswurst: (x, y, s) => { let g = `<path d="M${r(x - 5.4 * s)} ${r(y - 5.2 * s)}q0 ${r(5.2 * s)} ${r(5.4 * s)} ${r(5.2 * s)}t${r(5.4 * s)} ${r(-5.2 * s)}z" fill="${SCHUE}"/>` + E(x, y - 5.2 * s, 5.4 * s, 1.7 * s, "#f4f1e8") + E(x, y - 5.3 * s, 4.8 * s, 1.3 * s, "#cfe0e6");
    for (const [dx, a] of [[-1.6, -14], [1.4, 10]]) g += `<rect x="${r(x + (dx - 0.9) * s)}" y="${r(y - 9.4 * s)}" width="${r(1.8 * s)}" height="${r(5.6 * s)}" rx="${r(0.9 * s)}" fill="${WEISS}" transform="rotate(${a} ${r(x + dx * s)} ${r(y - 5 * s)})"/>`;
    return g + punkte(6, x, y - 7 * s, 1.6 * s, 2 * s, "#7fa66a", r(0.2 * s)); },
  brezel: (x, y, s) => { const p = (dx, dy) => `${r(x + dx * s)} ${r(y - 5 * s + dy * s)}`; const d = `M${p(-4.4, 3.4)}C${p(-7, 1)} ${p(-5.4, -4.4)} ${p(-1, -4)}C${p(2.6, -3.6)} ${p(3.4, 0)} ${p(1, 2.4)}M${p(4.4, 3.4)}C${p(7, 1)} ${p(5.4, -4.4)} ${p(1, -4)}C${p(-2.6, -3.6)} ${p(-3.4, 0)} ${p(-1, 2.4)}`; return brett(x, y + 0.6 * s, s, 6.6) + `<path d="${d}" stroke="${LAUGE}" stroke-width="${r(1.9 * s)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#c0773a" stroke-width="${r(0.5 * s)}" opacity=".6" fill="none" transform="translate(-.2 -.3)"/>` + punkte(9, x, y - 5 * s, 4.6 * s, 3 * s, "#fffaf0", r(0.28 * s)); },
  senf: (x, y, s) => `<path d="M${r(x - 2.4 * s)} ${r(y)}v${r(-6 * s)}q0 ${r(-0.8 * s)} ${r(0.8 * s)} ${r(-0.8 * s)}h${r(3.2 * s)}q${r(0.8 * s)} 0 ${r(0.8 * s)} ${r(0.8 * s)}v${r(6 * s)}z" fill="${S.lg("senfglas", [[0, "#e8f0f2"], [0.5, "#c9d6da"], [1, "#e3eaec"]], 0, 0, 1, 0)}"/><rect x="${r(x - 2.2 * s)}" y="${r(y - 5.2 * s)}" width="${r(4.4 * s)}" height="${r(5 * s)}" fill="#c9a227"/><rect x="${r(x - 2 * s)}" y="${r(y - 4.2 * s)}" width="${r(4 * s)}" height="${r(2.2 * s)}" fill="#fff"/><text x="${r(x)}" y="${r(y - 2.6 * s)}" font-size="${r(1.3 * s)}" text-anchor="middle" fill="#7a3e14" font-family="Arial" font-weight="bold">SENF</text><path d="M${r(x - 1.4 * s)} ${r(y - 6.8 * s)}l${r(0.6 * s)} ${r(-3.4 * s)}" stroke="#c8955a" stroke-width="${r(0.5 * s)}"/>`,
  leberkaese: (x, y, s) => teller(x, y, s) + `<path d="M${r(x - 4.6 * s)} ${r(y - 1.6 * s)}v${r(-2.6 * s)}q0 ${r(-0.6 * s)} ${r(0.8 * s)} ${r(-0.6 * s)}h${r(7.4 * s)}q${r(0.8 * s)} 0 ${r(0.8 * s)} ${r(0.6 * s)}v${r(2.6 * s)}z" fill="${S.lg("lk", [[0, "#e6a08e"], [1, "#d48672"]])}"/><path d="M${r(x - 4.6 * s)} ${r(y - 4.2 * s)}q0 ${r(-0.6 * s)} ${r(0.8 * s)} ${r(-0.6 * s)}h${r(7.4 * s)}q${r(0.8 * s)} 0 ${r(0.8 * s)} ${r(0.6 * s)}" stroke="#8a4a24" stroke-width="${r(0.6 * s)}" fill="none"/>` + punkte(5, x - 1 * s, y - 2.8 * s, 3 * s, 0.8 * s, "#f0c6b8", r(0.25 * s)) + E(x + 4.4 * s, y - 2 * s, 1.4 * s, 0.6 * s, "#d9a227"),
  kaesespaetzle: (x, y, s) => pfanne(x, y, s, "#f2d27a") + (() => { let g = ""; for (let i = 0; i < 12; i++) g += `<path d="M${r(x + (rnd() * 9 - 4.5) * s)} ${r(y - (2.6 + rnd() * 1.6 - 0.8) * s)}q.6 -.4 1.3 .1" stroke="#fbe8a8" stroke-width="${r(0.5 * s)}" fill="none" stroke-linecap="round"/>`; return g + `<path d="M${r(x - 3 * s)} ${r(y - 2.8 * s)}q${r(1.6 * s)} ${r(0.8 * s)} ${r(3.6 * s)} ${r(-0.4 * s)}" stroke="#f7e3a0" stroke-width="${r(0.6 * s)}" fill="none" opacity=".9"/>` + punkte(14, x, y - 2.8 * s, 4.4 * s, 1.2 * s, "#9a5a1e", r(0.35 * s)); })(),
  maultaschen: (x, y, s) => teller(x, y, s) + E(x, y - 1.6 * s, 5.2 * s, 1.7 * s, "#e8c36a", ' opacity=".55"') + [[-2.4, -0.2, -6], [2.4, -0.2, 8], [0, -1.6, 2]].map(([dx, dy, a]) => `<rect x="${r(x + (dx - 2) * s)}" y="${r(y + (dy - 3.4) * s)}" width="${r(4 * s)}" height="${r(2.6 * s)}" rx="${r(0.5 * s)}" fill="#f2deb0" stroke="#d9bd84" stroke-width="${r(0.3 * s)}" transform="rotate(${a} ${r(x + dx * s)} ${r(y + (dy - 2) * s)})"/>`).join("") + punkte(6, x, y - 3.6 * s, 3.6 * s, 1.2 * s, "#3e8e2e", r(0.22 * s)),
  linsensuppe: (x, y, s) => schuessel(x, y, s, "#7a5a2a", 6) + punkte(30, x, y - 4.1 * s, 4.8 * s, 1.1 * s, "#5a4a1c", r(0.3 * s)) + [[-2, -4.2], [1.6, -4.4], [3.4, -3.9]].map(([dx, dy]) => E(x + dx * s, y + dy * s, 0.9 * s, 0.45 * s, "#c26a4a") + E(x + dx * s, y + dy * s, 0.5 * s, 0.25 * s, "#e0957a")).join("") + punkte(4, x - 1, y - 4.4 * s, 3 * s, 0.6 * s, "#f0d27a", r(0.3 * s)),

  /* —— Tisch: Norddeutsches und Berliner Imbiss —— */
  labskaus: (x, y, s) => teller(x, y, s) + `<path d="M${r(x - 4.4 * s)} ${r(y - 1.6 * s)}q${r(3 * s)} ${r(-3.4 * s)} ${r(6.2 * s)} 0z" fill="#c76b6e"/>` + punkte(8, x - 1.3 * s, y - 2.4 * s, 2.4 * s, 0.6 * s, "#a84e52", r(0.25 * s)) + E(x - 1.2 * s, y - 3.6 * s, 2.1 * s, 0.85 * s, "#fffdf6") + E(x - 1.2 * s, y - 3.7 * s, 0.8 * s, 0.45 * s, "#f6b81c") + `<path d="M${r(x + 2.6 * s)} ${r(y - 1.8 * s)}q${r(1.6 * s)} ${r(-1.2 * s)} ${r(3.4 * s)} 0" stroke="#5b8a2e" stroke-width="${r(1.1 * s)}" fill="none" stroke-linecap="round"/>` + E(x + 4.6 * s, y - 2.6 * s, 1.1 * s, 0.6 * s, "#7a1e3a") + `<rect x="${r(x + 2.4 * s)}" y="${r(y - 3.4 * s)}" width="${r(1.8 * s)}" height="${r(1 * s)}" rx=".3" fill="#cfd6d8"/>`,
  matjes: (x, y, s) => teller(x, y, s) + [-1.6, 1.6].map((dy, i) => `<path d="M${r(x - 5 * s)} ${r(y + (dy * 0.5 - 2) * s)}q${r(5 * s)} ${r(-1.8 * s)} ${r(9.6 * s)} ${r(0.2 * s)}q${r(-4.6 * s)} ${r(1.2 * s)} ${r(-9.6 * s)} ${r(-0.2 * s)}z" fill="${S.lg("matjes" + i, [[0, "#c9d3da"], [0.5, "#e8b8b0"], [1, "#b88a84"]])}" stroke="#7d8b94" stroke-width="${r(0.2 * s)}"/>`).join("") + [[-1.6, -3.4], [1.4, -3.2]].map(([dx, dy]) => `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(1.2 * s)}" ry="${r(0.6 * s)}" fill="none" stroke="#f3eef6" stroke-width="${r(0.3 * s)}"/>`).join(""),
  fischbroetchen: (x, y, s) => brett(x, y, s, 6.4) + E(x, y - 2.6 * s, 5.2 * s, 1.4 * s, KRUSTE) + `<path d="M${r(x - 5 * s)} ${r(y - 3.2 * s)}q${r(5 * s)} ${r(-1.4 * s)} ${r(10 * s)} 0" stroke="#d6dfe4" stroke-width="${r(1.3 * s)}" fill="none"/>` + `<path d="M${r(x - 4.6 * s)} ${r(y - 3.8 * s)}q${r(4.6 * s)} ${r(-1.4 * s)} ${r(9.2 * s)} 0" stroke="#7fae4a" stroke-width="${r(0.6 * s)}" fill="none"/>` + `<path d="M${r(x - 3 * s)} ${r(y - 4.4 * s)}a${r(0.8 * s)} ${r(0.4 * s)} 0 1 1 ${r(1.6 * s)} 0M${r(x + 1 * s)} ${r(y - 4.5 * s)}a${r(0.8 * s)} ${r(0.4 * s)} 0 1 1 ${r(1.6 * s)} 0" stroke="#f3eef6" stroke-width="${r(0.3 * s)}" fill="none"/>` + `<path d="M${r(x - 5 * s)} ${r(y - 4.4 * s)}q${r(5 * s)} ${r(-3.6 * s)} ${r(10 * s)} 0z" fill="${KRUSTE}"/>` + punkte(4, x, y - 5.4 * s, 3 * s, 0.6 * s, "#f5e6c2", r(0.2 * s)),
  gruenkohl: (x, y, s) => teller(x, y, s) + `<path d="M${r(x - 5 * s)} ${r(y - 1.6 * s)}q${r(2.4 * s)} ${r(-3.6 * s)} ${r(5.4 * s)} 0z" fill="#2f4a22"/>` + punkte(12, x - 2.4 * s, y - 2.4 * s, 2.2 * s, 0.9 * s, "#4a6e30", r(0.35 * s)) + `<rect x="${r(x + 0.4 * s)}" y="${r(y - 3.2 * s)}" width="${r(4.6 * s)}" height="${r(1.5 * s)}" rx="${r(0.7 * s)}" fill="#8a5a3a"/><rect x="${r(x + 1 * s)}" y="${r(y - 4.4 * s)}" width="${r(4 * s)}" height="${r(1.3 * s)}" rx="${r(0.6 * s)}" fill="#b07a5a"/>` + E(x + 2.4 * s, y - 1.6 * s, 1.4 * s, 0.6 * s, KARTOFFEL),
  _schale: (x, y, s) => `<path d="M${r(x - 5.6 * s)} ${r(y - 2 * s)}l${r(0.6 * s)} ${r(2 * s)}h${r(10 * s)}l${r(0.6 * s)} ${r(-2 * s)}z" fill="#f4f1ea" stroke="#cfc8ba" stroke-width=".2"/>` + E(x, y - 2 * s, 5.6 * s, 1.5 * s, "#fbfaf6"),
  currywurst: (x, y, s) => G._schale(x, y, s) + (() => { let g = ""; for (let i = 0; i < 6; i++) g += E(x + (-3.8 + i * 1.5) * s, y - (2.3 + (i % 2) * 0.3) * s, 0.75 * s, 0.6 * s, "#b5652e") + E(x + (-3.8 + i * 1.5) * s, y - (2.4 + (i % 2) * 0.3) * s, 0.45 * s, 0.35 * s, "#e9b98a"); return g + `<path d="M${r(x - 4.4 * s)} ${r(y - 2.6 * s)}q${r(4.4 * s)} ${r(-1.6 * s)} ${r(8.8 * s)} 0q${r(-4.4 * s)} ${r(1.4 * s)} ${r(-8.8 * s)} 0z" fill="#c0281c" opacity=".92"/>` + punkte(14, x, y - 2.7 * s, 4 * s, 0.5 * s, "#e8a21e", r(0.22 * s)); })(),
  currywurst_pommes: (x, y, s) => G._schale(x, y, s) + (() => { let g = ""; for (let i = 0; i < 9; i++) g += `<rect x="${r(x + (0.4 + (i % 5) * 0.9) * s)}" y="${r(y - (3.8 + (i % 3) * 0.3) * s)}" width="${r(0.6 * s)}" height="${r(2.6 * s)}" fill="#f2c14e" transform="rotate(${(i % 4) * 20 - 30} ${r(x + 2 * s)} ${r(y - 2.4 * s)})"/>`; for (let i = 0; i < 3; i++) g += E(x + (-3.6 + i * 1.5) * s, y - 2.4 * s, 0.75 * s, 0.6 * s, "#b5652e"); return g + `<path d="M${r(x - 4.4 * s)} ${r(y - 2.6 * s)}q${r(2.2 * s)} ${r(-1.4 * s)} ${r(4.4 * s)} 0q${r(-2.2 * s)} ${r(1.2 * s)} ${r(-4.4 * s)} 0z" fill="#c0281c"/>` + punkte(6, x - 2.2 * s, y - 2.7 * s, 2 * s, 0.4 * s, "#e8a21e", r(0.22 * s)) + E(x + 3 * s, y - 4.6 * s, 1.2 * s, 0.5 * s, "#fffdf6") + `<path d="M${r(x - 1 * s)} ${r(y - 2.8 * s)}l${r(-1.6 * s)} ${r(-3 * s)}" stroke="#d9b46a" stroke-width="${r(0.35 * s)}"/>`; })(),
  bratwurst: (x, y, s) => brett(x, y, s, 7) + E(x, y - 2.6 * s, 4.4 * s, 1.3 * s, KRUSTE) + `<rect x="${r(x - 6.8 * s)}" y="${r(y - 4.4 * s)}" width="${r(13.6 * s)}" height="${r(1.8 * s)}" rx="${r(0.9 * s)}" fill="${WURST}"/>` + [-4, -1.4, 1.2, 3.8].map((dx) => `<path d="M${r(x + dx * s)} ${r(y - 4.3 * s)}l${r(0.8 * s)} ${r(1.4 * s)}" stroke="#4a2410" stroke-width="${r(0.3 * s)}"/>`).join("") + `<path d="M${r(x - 3 * s)} ${r(y - 4.4 * s)}q${r(1 * s)} ${r(-0.5 * s)} ${r(2 * s)} 0t${r(2 * s)} 0" stroke="#e1b12c" stroke-width="${r(0.45 * s)}" fill="none"/>`,
  ketchup: (x, y, s) => `<path d="M${r(x - 1.8 * s)} ${r(y)}v${r(-6.6 * s)}q0 ${r(-1.4 * s)} ${r(1 * s)} ${r(-2 * s)}v${r(-1.4 * s)}h${r(1.6 * s)}v${r(1.4 * s)}q${r(1 * s)} ${r(0.6 * s)} ${r(1 * s)} ${r(2 * s)}v${r(6.6 * s)}z" fill="${S.lg("ketchup", [[0, "#e23a2a"], [0.5, "#b31d14"], [1, "#d0301f"]], 0, 0, 1, 0)}"/><rect x="${r(x - 0.9 * s)}" y="${r(y - 11.6 * s)}" width="${r(1.8 * s)}" height="${r(1.6 * s)}" rx=".3" fill="#f4f1ea"/><rect x="${r(x - 1.8 * s)}" y="${r(y - 5.4 * s)}" width="${r(3.6 * s)}" height="${r(2.6 * s)}" fill="#fff"/><text x="${r(x)}" y="${r(y - 3.7 * s)}" font-size="${r(0.95 * s)}" text-anchor="middle" fill="#b31d14" font-family="Arial" font-weight="bold">Ketchup</text>`,
  gurkensalat: (x, y, s) => schuessel(x, y, s, "#e6efd2", 5.8) + (() => { let g = ""; for (let i = 0; i < 9; i++) { const cx = x + (-3.6 + (i % 5) * 1.8) * s, cy = y - (4 + Math.floor(i / 5) * 0.8) * s; g += E(cx, cy, 1.1 * s, 0.55 * s, "#4f7a2a") + E(cx, cy, 0.9 * s, 0.42 * s, "#dfe9b8"); } return g + punkte(8, x, y - 4.3 * s, 4 * s, 0.8 * s, "#3a6a1e", r(0.18 * s)); })(),
  kartoffelsalat: (x, y, s) => schuessel(x, y, s, "#f3e3a8", 5.8) + (() => { let g = ""; for (let i = 0; i < 12; i++) g += `<rect x="${r(x + (rnd() * 7.4 - 3.9) * s)}" y="${r(y - (4.4 + rnd() * 1.4) * s)}" width="${r(0.9 * s)}" height="${r(0.7 * s)}" rx=".2" fill="#f8e6a0" stroke="#e4c870" stroke-width=".15"/>`; return g + punkte(8, x, y - 4.6 * s, 4 * s, 0.9 * s, "#3e8e2e", r(0.2 * s)) + punkte(5, x, y - 4.6 * s, 4 * s, 0.9 * s, "#f6f3e8", r(0.3 * s)); })(),

  /* —— Frühstückstisch —— */
  brot: (x, y, s) => brett(x, y, s, 7) + `<path d="M${r(x - 6 * s)} ${r(y - 1.8 * s)}q${r(-0.2 * s)} ${r(-5 * s)} ${r(4.6 * s)} ${r(-5 * s)}h${r(2 * s)}v${r(5 * s)}z" fill="${KRUSTE}"/>` + `<ellipse cx="${r(x + 0.6 * s)}" cy="${r(y - 4.3 * s)}" rx="${r(0.6 * s)}" ry="${r(2.5 * s)}" fill="#ead2a2"/>` + [2.2, 4].map((dx) => `<path d="M${r(x + dx * s)} ${r(y - 1.8 * s)}l${r(0.8 * s)} ${r(-4.6 * s)}" stroke="#a8692e" stroke-width="${r(1.1 * s)}"/><path d="M${r(x + (dx + 0.3) * s)} ${r(y - 1.9 * s)}l${r(0.7 * s)} ${r(-4.2 * s)}" stroke="#ead2a2" stroke-width="${r(0.6 * s)}"/>`).join(""),
  broetchen: (x, y, s) => `<path d="M${r(x - 6.4 * s)} ${r(y - 4 * s)}h${r(12.8 * s)}l${r(-1.2 * s)} ${r(4 * s)}h${r(-10.4 * s)}z" fill="${S.lg("korb", [[0, "#d3a35b"], [1, "#9b6b2c"]])}"/>` + [-4.6, -1.6, 1.4, 4.4].map((dx) => `<path d="M${r(x + dx * s)} ${r(y - 4 * s)}l${r(0.4 * s)} ${r(4 * s)}" stroke="#8a5c22" stroke-width=".25"/>`).join("") + [[-3.6, -4.8], [0, -5.2], [3.6, -4.8], [-1.8, -6.6], [1.8, -6.6]].map(([dx, dy]) => E(x + dx * s, y + dy * s, 2 * s, 1.4 * s, KRUSTE) + `<path d="M${r(x + (dx - 1) * s)} ${r(y + (dy - 0.3) * s)}q${r(1 * s)} ${r(-0.6 * s)} ${r(2 * s)} 0" stroke="#8a4e1c" stroke-width="${r(0.3 * s)}" fill="none"/>`).join(""),
  schwarzbrot: (x, y, s) => brett(x, y, s, 6.4) + [0, 1, 2].map((i) => `<rect x="${r(x + (-4.6 + i * 1.4) * s)}" y="${r(y - (6.4 - i * 0.6) * s)}" width="${r(5.6 * s)}" height="${r(4.4 * s)}" rx=".2" fill="#3a2414" stroke="#24150a" stroke-width=".2"/>` + punkte(6, x + (-1.8 + i * 1.4) * s, y - (4.2 - i * 0.6) * s, 2.2 * s, 1.6 * s, "#5a3a22", r(0.22 * s))).join(""),
  butter: (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 0.8 * s)}" rx="${r(5.6 * s)}" ry="${r(1.6 * s)}" fill="${PORZ}"/><path d="M${r(x - 3.6 * s)} ${r(y - 1.2 * s)}v${r(-2.2 * s)}l${r(1.2 * s)} ${r(-1 * s)}h${r(6 * s)}v${r(2.2 * s)}l${r(-1.2 * s)} ${r(1 * s)}z" fill="#f8e27a"/><path d="M${r(x - 3.6 * s)} ${r(y - 3.4 * s)}l${r(1.2 * s)} ${r(-1 * s)}h${r(6 * s)}l${r(-1.2 * s)} ${r(1 * s)}z" fill="#fcef9e"/><path d="M${r(x - 0.4 * s)} ${r(y - 3.4 * s)}l${r(4 * s)} ${r(-2.4 * s)}" stroke="#c9cfd4" stroke-width="${r(0.6 * s)}"/>`,
  kaese: (x, y, s) => brett(x, y, s, 6.6) + `<path d="M${r(x - 5 * s)} ${r(y - 1.8 * s)}v${r(-3.2 * s)}l${r(9 * s)} ${r(-1.6 * s)}v${r(3.2 * s)}z" fill="#f2cf5a"/><path d="M${r(x - 5 * s)} ${r(y - 5 * s)}l${r(9 * s)} ${r(-1.6 * s)}l${r(1 * s)} ${r(0.8 * s)}l${r(-9 * s)} ${r(1.6 * s)}z" fill="#f8de7c"/>` + [[-3, -3.4], [0, -3.9], [2.4, -3], [-1.4, -2.6]].map(([dx, dy]) => E(x + dx * s, y + dy * s, 0.6 * s, 0.45 * s, "#d9ae36")).join(""),
  butterbrot: (x, y, s) => teller(x, y, s, 6.6) + `<path d="M${r(x - 4 * s)} ${r(y - 1.8 * s)}v${r(-2.4 * s)}q0 ${r(-1.4 * s)} ${r(2 * s)} ${r(-1.4 * s)}h${r(4 * s)}q${r(2 * s)} 0 ${r(2 * s)} ${r(1.4 * s)}v${r(2.4 * s)}z" fill="#c98c45"/><path d="M${r(x - 3.4 * s)} ${r(y - 2.2 * s)}v${r(-1.8 * s)}q0 ${r(-1 * s)} ${r(1.6 * s)} ${r(-1 * s)}h${r(3.6 * s)}q${r(1.6 * s)} 0 ${r(1.6 * s)} ${r(1 * s)}v${r(1.8 * s)}z" fill="#f6e38a"/>`,
  wurstbrot: (x, y, s) => teller(x, y, s, 6.6) + `<path d="M${r(x - 4 * s)} ${r(y - 1.8 * s)}v${r(-2.4 * s)}q0 ${r(-1.4 * s)} ${r(2 * s)} ${r(-1.4 * s)}h${r(4 * s)}q${r(2 * s)} 0 ${r(2 * s)} ${r(1.4 * s)}v${r(2.4 * s)}z" fill="#8a5a32"/>` + [[-1.8, -3.4], [1.6, -3.6], [0, -2.6]].map(([dx, dy]) => E(x + dx * s, y + dy * s, 1.7 * s, 1 * s, "#b33a3a") + punkte(4, x + dx * s, y + dy * s, 1.1 * s, 0.6 * s, "#f1d0c4", r(0.2 * s))).join(""),
  ruehrei: (x, y, s) => teller(x, y, s) + [[-2.4, -2.4], [0.6, -2.8], [2.8, -2.2], [-0.8, -3.6], [1.6, -3.6]].map(([dx, dy]) => `<path d="M${r(x + (dx - 1.8) * s)} ${r(y + dy * s)}q${r(0.4 * s)} ${r(-1.6 * s)} ${r(1.8 * s)} ${r(-1.2 * s)}q${r(1.6 * s)} ${r(-0.2 * s)} ${r(1.8 * s)} ${r(1.2 * s)}z" fill="#f7d850" stroke="#e2b62e" stroke-width="${r(0.2 * s)}"/>`).join("") + punkte(9, x, y - 3.6 * s, 3.4 * s, 0.9 * s, "#3e8e2e", r(0.2 * s)),
  ei_spiegel: (x, y, s) => pfanne(x, y, s, "#2e2e2e") + `<path d="M${r(x - 4.6 * s)} ${r(y - 2.6 * s)}q${r(0.6 * s)} ${r(-2 * s)} ${r(3.4 * s)} ${r(-1.6 * s)}q${r(2.6 * s)} ${r(-0.8 * s)} ${r(4.8 * s)} ${r(0.6 * s)}q${r(1.4 * s)} ${r(1.6 * s)} ${r(-1.6 * s)} ${r(2 * s)}q${r(-2.4 * s)} ${r(0.6 * s)} ${r(-5.6 * s)} ${r(-0.4 * s)}z" fill="#fffdf6"/>` + E(x, y - 3.1 * s, 1.5 * s, 1 * s, S.rg("dotter", [[0, "#ffd34a"], [1, "#f29c12"]], 0.4, 0.35, 0.7)) + glanz(x, y - 3.4 * s, 1.4 * s),
  ei_gekocht: (x, y, s) => `<path d="M${r(x - 1.8 * s)} ${r(y)}h${r(3.6 * s)}l${r(-0.8 * s)} ${r(-1.4 * s)}q${r(1.6 * s)} ${r(-0.6 * s)} ${r(1.6 * s)} ${r(-2.6 * s)}h${r(-5.2 * s)}q0 ${r(2 * s)} ${r(1.6 * s)} ${r(2.6 * s)}z" fill="#3a7bd5"/>` + `<path d="M${r(x - 2.2 * s)} ${r(y - 4 * s)}q0 ${r(-4.4 * s)} ${r(2.2 * s)} ${r(-4.4 * s)}q${r(2.2 * s)} 0 ${r(2.2 * s)} ${r(4.4 * s)}z" fill="#f4ead8"/>` + E(x, y - 4 * s, 2.2 * s, 0.9 * s, "#fffdf6") + E(x, y - 4 * s, 1.2 * s, 0.55 * s, "#f6b81c") + E(x + 4.2 * s, y - 1 * s, 2 * s, 0.9 * s, "#fffdf6") + E(x + 4.2 * s, y - 1.1 * s, 1.1 * s, 0.5 * s, "#f6b81c"),
};

/* Eine Gruppe: Gerichte an Positionen zeichnen und als Lupen-Teile sammeln */
function gruppe(liste, hitW, hitH) {
  let g = ""; const unter = [];
  for (const [id, x, y, s] of liste) {
    g += `<g>${G[id](x, y, s)}</g>`;
    const w = hitW * s, h = hitH * s;
    unter.push(wort(id, x, y, flaeche(-w / 2, -h, w, h + 0.6)));
  }
  return { g, unter };
}

/* =====================================================================
   KULISSE: Holzbalkendecke, Rückwand (Putz + Vertäfelung), Dielen
   ===================================================================== */
const HY = 21.5, VX = 160, WAND_U = 112;
S.hinten(`<rect width="320" height="200" fill="#efe4cf"/>`);
/* Decke mit Balken (zum Fluchtpunkt) */
{
  let d = `<path d="M0 0H320L311 14H9Z" fill="#5e3e24"/>`;
  for (let i = -6; i <= 6; i++) { const xb = VX + i * 25.2, xt = VX + (xb - VX) * 1.55; d += `<path d="M${r(xb - 1.6)} 14L${r(xt - 3)} 0H${r(xt + 3)}L${r(xb + 1.6)} 14Z" fill="#3e2614"/>`; }
  d += `<rect y="13" width="320" height="2" fill="#4a2e18"/>`;
  S.hinten(d);
}
/* Rückwand: Kalkputz oben, Vertäfelung unten, Seitenwände in den Ecken */
S.hinten(`<rect x="9" y="15" width="302" height="${WAND_U - 15}" fill="${S.lg("putz", [[0, "#f6eedd"], [1, "#eadcc0"]])}"/>`);
S.hinten(`<path d="M0 0L9 15V${WAND_U}L0 ${WAND_U + 10}Z" fill="#e2d2b2"/><path d="M320 0L311 15V${WAND_U}L320 ${WAND_U + 10}Z" fill="#d9c7a4"/>`);
{
  let v = `<rect x="9" y="72" width="302" height="${WAND_U - 72}" fill="${HOLZ}"/><rect x="9" y="70.5" width="302" height="2.2" fill="#4a2e18"/>`;
  for (let x = 12; x < 308; x += 14) v += `<rect x="${x}" y="75" width="11" height="${WAND_U - 79}" rx=".6" fill="none" stroke="#5a3820" stroke-width=".6"/>`;
  v += `<path d="M0 ${WAND_U + 10}L9 ${WAND_U}V72L0 66Z" fill="#6b4426"/><path d="M320 ${WAND_U + 10}L311 ${WAND_U}V72L320 66Z" fill="#5e3a20"/>`;
  S.hinten(v);
}
/* Dielenboden in Fluchtperspektive */
{
  let f = `<path d="M0 ${WAND_U + 10}L9 ${WAND_U}H311L320 ${WAND_U + 10}V200H0Z" fill="${S.lg("dielen", [[0, "#7a5232"], [1, "#94653d"]])}"/>`;
  let l = "";
  for (let i = -14; i <= 14; i++) { const xa = VX + i * 11, xb = VX + (xa - VX) * (200 - HY) / (WAND_U - HY); l += `M${r(xa)} ${WAND_U}L${r(xb)} 200`; }
  f += `<path d="${l}" stroke="#4e321c" stroke-width=".45" opacity=".7"/>`;
  f += `<rect x="9" y="${WAND_U}" width="302" height="1.4" fill="#3e2614"/>`;
  f += `<path d="M0 ${WAND_U + 10}L9 ${WAND_U}H311L320 ${WAND_U + 10}V200H0Z" fill="${S.lg("dielenlicht", [[0, "#000", 0.25], [0.5, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   WAND: Fenster, Geweih, Speisekarte, Kuckucksuhr
   ===================================================================== */
{
  /* DAS FENSTER mit Butzenscheiben, draußen grün */
  let g = `<rect x="-22" y="-16" width="44" height="32" rx="1" fill="${HOLZ_D}"/><rect x="-19.5" y="-13.5" width="39" height="27" fill="${S.lg("draussen", [[0, "#cfe6f2"], [0.6, "#a9cf8a"], [1, "#7fae5a"]])}"/>`;
  let b = ""; for (let yy = -12; yy < 13; yy += 3.6) for (let xx = -18 + ((yy + 12) / 3.6 % 2) * 1.8; xx < 19; xx += 3.6) b += `<circle cx="${r(xx)}" cy="${r(yy)}" r="1.7" fill="none" stroke="#9b8d6a" stroke-width=".3" opacity=".7"/>`;
  g += b + `<path d="M0 -13.5V13.5M-19.5 0H19.5" stroke="${"#4a2e18"}" stroke-width="1.6"/><path d="M-18 12L-6 -12H-2L-14 12Z" fill="#fff" opacity=".15"/>`;
  g += `<rect x="-24" y="15" width="48" height="2.4" fill="#5a3820"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 49, y: 38, kunst: g });
}
{
  /* DAS GEWEIH auf einem Holzschild */
  let g = `<path d="M-5 -1h10l-1.4 8h-7.2z" fill="${HOLZ_D}" stroke="#2e1c0e" stroke-width=".3"/>`;
  const stange = "M0 0c-2 -3 -4 -7 -3 -12M-1.4 -4c-2 -.6 -3.4 -2 -4 -4M-2.2 -8c-1.6 -.4 -2.6 -1.6 -3 -3M-2.8 -11.4c-1 -1 -1.2 -2.6 -.8 -3.6M-2.8 -11.4c.8 -1 1.8 -1.6 2.6 -1.8";
  g += `<path d="${stange}" transform="translate(-1 0)" stroke="#e8dcc2" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="${stange}" transform="translate(1 0) scale(-1 1)" stroke="#e8dcc2" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M-1.4 0c-.6 -.6 -.6 -1.6 0 -2h2.8c.6 .4 .6 1.4 0 2z" fill="#c9b48e"/>`;
  S.teil({ id: "geweih", de: "das Geweih", syl: "ge-WEIH", it: "le corna", itSyl: "COR-na", en: "antlers", x: 98, y: 36, kunst: g, tipp: "Ein Hirschgeweih an der Wand — typisch für ein Wirtshaus." });
}
{
  /* DIE SPEISEKARTE — Kreidetafel mit dem Tagesangebot */
  let g = `<rect x="-26" y="-17" width="52" height="34" rx="1.4" fill="${HOLZ_V}"/><rect x="-23.6" y="-14.6" width="47.2" height="29.2" fill="${S.lg("tafel", [[0, "#2e3a33"], [1, "#222b26"]])}"/>`;
  const t = (y, sz, txt, f = "#f4f0e6", w = "normal") => `<text x="0" y="${y}" font-size="${sz}" text-anchor="middle" fill="${f}" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="${w}">${txt}</text>`;
  g += t(-8.4, 4.4, "Heute: Buffet", "#f6e7a1", "bold") + `<path d="M-15 -6.4h30" stroke="#f6e7a1" stroke-width=".35" stroke-dasharray="1 .8"/>`;
  g += t(-1.6, 3, "Suppe · Braten · Beilagen") + t(3.6, 3, "Kaffee &amp; Kuchen") + t(9.6, 3, "Brotzeit ab 10 Uhr", "#ffc9b8");
  S.teil({ id: "speisekarte", de: "die Speisekarte", syl: "SPEI-se-kar-te", it: "il menù", itSyl: "me-NÙ", en: "menu", x: 160, y: 40, kunst: g, tipp: "Auf der Tafel steht, was es heute gibt." });
}
{
  /* DIE KUCKUCKSUHR — Schwarzwälder Uhr mit Gewichten */
  let g = `<path d="M-8 -6L0 -14L8 -6Z" fill="${HOLZ_D}"/><path d="M-9.4 -5.4L0 -15L9.4 -5.4" stroke="#3a2412" stroke-width="1.2" fill="none"/>`;
  g += `<rect x="-7" y="-6" width="14" height="13" fill="${HOLZ_V}"/><circle cx="0" cy="1.6" r="4.4" fill="#f6efdf" stroke="#3a2412" stroke-width=".5"/>`;
  g += `<path d="M0 1.6v-3M0 1.6l2 1" stroke="#222" stroke-width=".5"/><rect x="-1.6" y="-5.2" width="3.2" height="2.6" fill="#2a1a0c"/><path d="M-1 -3.4l1.6 -.6l.4 .6z" fill="#b5651d"/>`;
  g += `<path d="M-5 -10.4q-2 1 -3 -1M5 -10.4q2 1 3 -1" stroke="#5b7f3a" stroke-width=".9" fill="none"/><path d="M-2.6 7v9M2.6 7v13" stroke="#b08a3a" stroke-width=".3"/><path d="M-3.4 16h1.6l-.2 4h-1.2zM1.8 20h1.6l-.2 4h-1.2z" fill="#6b4a1c"/><path d="M0 7v6" stroke="#b08a3a" stroke-width=".3"/><circle cx="0" cy="13.8" r="1" fill="#c9a227"/>`;
  S.teil({ id: "kuckucksuhr", de: "die Kuckucksuhr", syl: "KU-ckucks-uhr", it: "l'orologio a cucù", itSyl: "o-ro-LO-gio a cu-CÙ", en: "cuckoo clock", x: 210, y: 36, kunst: g, tipp: "Die Kuckucksuhr kommt aus dem Schwarzwald." });
}

/* =====================================================================
   1 — DIE KUCHENVITRINE (links an der Wand) — Lupe: acht Kuchen
   ===================================================================== */
{
  const x0 = 14, x1 = 84, oben = 61, boden = 99.5, mitte = 79.5;
  let k = `<rect x="${x0}" y="${boden}" width="${x1 - x0}" height="${WAND_U - boden}" fill="${HOLZ_V}"/><rect x="${x0 + 2}" y="${boden + 2.4}" width="${x1 - x0 - 4}" height="${WAND_U - boden - 4}" rx=".8" fill="none" stroke="#4a2e18" stroke-width=".5"/>`;
  k += `<rect x="${x0}" y="${oben}" width="${x1 - x0}" height="${boden - oben}" fill="${S.lg("vitinnen", [[0, "#fdf8ec"], [1, "#eadfc6"]])}"/><rect x="${x0}" y="${oben}" width="${x1 - x0}" height="1.8" fill="#fffbe9"/>`;
  k += `<rect x="${x0 + 1}" y="${mitte}" width="${x1 - x0 - 2}" height="1.2" fill="#cfe4ea"/><rect x="${x0}" y="${boden - 0.8}" width="${x1 - x0}" height="1.8" fill="${STAHL}"/>`;
  k += `<rect x="${x0 - 1}" y="${oben - 1.4}" width="${x1 - x0 + 2}" height="2" fill="${STAHL}"/><rect x="${x0 - 1}" y="${oben - 1}" width="2" height="${boden - oben + 2}" fill="${STAHL}"/><rect x="${x1 - 1}" y="${oben - 1}" width="2" height="${boden - oben + 2}" fill="${STAHL}"/>`;
  const { g, unter } = gruppe([
    ["kirschtorte", 23, mitte - 0.1, 0.95], ["kaesekuchen", 40.5, mitte - 0.1, 0.95], ["bienenstich", 57.5, mitte - 0.1, 0.95], ["apfelstrudel", 74.5, mitte - 0.1, 0.95],
    ["streuselkuchen", 23, boden - 0.8, 0.95], ["berliner", 40.5, boden - 0.8, 0.95], ["lebkuchen", 57.5, boden - 0.8, 0.95], ["stollen", 74.5, boden - 0.8, 0.95],
  ], 16.4, 13);
  k += g;
  /* Preisschilder */
  for (const [x, y, p] of [[23, mitte, "3,90"], [40.5, mitte, "2,80"], [57.5, mitte, "2,60"], [74.5, mitte, "3,20"], [23, boden - 0.8, "2,20"], [40.5, boden - 0.8, "1,40"], [57.5, boden - 0.8, "0,90"], [74.5, boden - 0.8, "4,50"]])
    k += `<rect x="${x - 3}" y="${y + 0.2}" width="6" height="2.4" rx=".3" fill="#fff" stroke="#9e8a62" stroke-width=".15"/><text x="${x}" y="${y + 2}" font-size="1.6" text-anchor="middle" fill="#2b1d0e" font-family="Arial" font-weight="bold">${p} €</text>`;
  const cx = (x0 + x1) / 2;
  S.teil({ id: "kuchenvitrine", de: "die Kuchenvitrine", syl: "KU-chen-vi-tri-ne", it: "la vetrina dei dolci", itSyl: "ve-TRI-na dei DOL-ci", en: "cake display", x: cx, y: WAND_U,
    kunst: `<g transform="translate(${-cx} ${-WAND_U})">${k}</g>`, zoom: { x: x0 - 4, y: oben - 4, w: x1 - x0 + 8, h: 52 },
    unter: unter.map((u) => Object.assign(u, {})), tipp: "In der gekühlten Vitrine stehen Torten und Kuchen." });
  S.davor(`<rect x="${x0}" y="${oben}" width="${x1 - x0}" height="${boden - oben}" fill="${S.lg("glas", [[0, "#ffffff", 0.3], [0.4, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1)}"/><path d="M${x0 + 6} ${boden} L${x0 + 18} ${oben} H${x0 + 24} L${x0 + 12} ${boden}Z" fill="#fff" opacity=".12"/>`);
}

/* =====================================================================
   2 — DAS BUFFET (Mitte): warme Hauptgerichte — Lupe
   ===================================================================== */
{
  const x0 = 92, x1 = 228, platte = 82, stufe = 69.5;
  let k = `<path d="M${x0} ${platte}L${x0 + 2} ${platte - 4}H${x1 - 2}L${x1} ${platte}Z" fill="#fbfaf6"/>`;
  k += `<rect x="${x0}" y="${platte}" width="${x1 - x0}" height="${WAND_U - platte}" fill="${S.lg("tischtuch", [[0, "#fbfaf6"], [1, "#e4e0d6"]])}"/>`;
  for (let x = x0 + 8; x < x1; x += 10) k += `<path d="M${x} ${platte + 1}q1 14 -.4 ${WAND_U - platte - 1}" stroke="#d6d0c2" stroke-width=".5" fill="none"/>`;
  k += `<rect x="${x0}" y="${platte}" width="${x1 - x0}" height="3" fill="#2f5a3a"/>`;     // grüne Tischdecke-Bordüre
  /* Stufe (Podest) hinten für die zweite Reihe */
  k += `<rect x="${x0 + 3}" y="${stufe}" width="${x1 - x0 - 6}" height="${platte - 4 - stufe}" fill="#efebe2"/><rect x="${x0 + 3}" y="${stufe - 1}" width="${x1 - x0 - 6}" height="1.2" fill="#fbfaf6"/>`;
  const hinten = ["schnitzel", "steak", "rinderbraten", "sauerbraten", "roulade", "eisbein"];
  const vorne = ["gulasch", "frikadelle", "klopse", "kartoffelpuffer", "gemuesesuppe"];
  const liste = [...hinten.map((id, i) => [id, 106.5 + i * 21.4, stufe, 0.98]), ...vorne.map((id, i) => [id, 117 + i * 21.4, platte - 0.6, 0.98])];
  const { g, unter } = gruppe(liste, 20.6, 12.4);
  k += g;
  const NAME = { schnitzel: "Schnitzel", steak: "Steak", rinderbraten: "Rinderbraten", sauerbraten: "Sauerbraten", roulade: "Rouladen", eisbein: "Eisbein", gulasch: "Gulasch", frikadelle: "Frikadellen", klopse: "Kön. Klopse", kartoffelpuffer: "Kartoffelpuffer", gemuesesuppe: "Gemüsesuppe" };
  hinten.forEach((id, i) => { k += schild(106.5 + i * 21.4, stufe + 3.6, NAME[id]); });
  vorne.forEach((id, i) => { k += schild(117 + i * 21.4, platte + 2.9, NAME[id]); });
  const cx = (x0 + x1) / 2;
  S.teil({ id: "buffet", de: "das Buffet", syl: "Buf-FET", it: "il buffet", itSyl: "buf-FÈ", en: "buffet", x: cx, y: WAND_U,
    kunst: `<g transform="translate(${-cx} ${-WAND_U})">${k}</g>`, zoom: { x: x0 - 2, y: 46, w: x1 - x0 + 4, h: 93.3 },
    unter, tipp: "Am Buffet nimmt sich jeder selbst, was er essen möchte." });
}

/* =====================================================================
   3 — DIE ANRICHTE (rechts): Beilagen in Schüsseln — Lupe
   ===================================================================== */
{
  const x0 = 236, x1 = 306, platte = 82;
  let k = `<rect x="${x0 + 2}" y="38" width="${x1 - x0 - 4}" height="${platte - 38}" fill="${HOLZ}"/>`;
  k += `<path d="M${x0} 38h${x1 - x0}v-3q-${(x1 - x0) / 2} -5 -${x1 - x0} 0z" fill="${HOLZ_D}"/>`;
  for (const y of [46.6, 62.6]) k += `<rect x="${x0 + 1}" y="${y}" width="${x1 - x0 - 2}" height="2" fill="#a06a3a"/><rect x="${x0 + 1}" y="${y + 2}" width="${x1 - x0 - 2}" height=".8" fill="#3e2614"/>`;
  k += `<path d="M${x0} ${platte}L${x0 + 1.6} ${platte - 3}H${x1 - 1.6}L${x1} ${platte}Z" fill="#a06a3a"/><rect x="${x0}" y="${platte}" width="${x1 - x0}" height="${WAND_U - platte}" fill="${HOLZ_V}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${x0 + 2 + i * 22.4}" y="${platte + 3}" width="21" height="7" rx=".6" fill="none" stroke="#3e2614" stroke-width=".6"/><rect x="${x0 + 10 + i * 22.4}" y="${platte + 6}" width="5" height="1" rx=".5" fill="#d8c6a4"/>`;
  for (let i = 0; i < 2; i++) k += `<rect x="${x0 + 2 + i * 33.6}" y="${platte + 12}" width="32.4" height="${WAND_U - platte - 15}" rx=".6" fill="none" stroke="#3e2614" stroke-width=".6"/>`;
  const xs = [245, 262, 279, 296];
  const liste = [
    ...["reis", "nudeln", "spaetzle", "knoedel"].map((id, i) => [id, xs[i], 46.6, 1]),
    ...["sauerkraut", "rotkohl", "erbspueree", "bratensosse"].map((id, i) => [id, xs[i], 62.6, 1]),
    ...["bratkartoffeln", "salzkartoffeln", "kartoffelpueree", "pommes"].map((id, i) => [id, xs[i], platte - 1.2, 1]),
  ];
  const { g, unter } = gruppe(liste, 16, 12.5);
  k += g;
  const cx = (x0 + x1) / 2;
  S.teil({ id: "anrichte", de: "die Anrichte", syl: "AN-rich-te", it: "la credenza", itSyl: "cre-DEN-za", en: "sideboard", x: cx, y: WAND_U,
    kunst: `<g transform="translate(${-cx} ${-WAND_U})">${k}</g>`, zoom: { x: x0 - 9, y: 30, w: x1 - x0 + 18, h: 58.7 },
    unter, tipp: "Auf der Anrichte stehen die Beilagen in Schüsseln." });
}

/* =====================================================================
   4–6 — DIE DREI TISCHE vorne (Stammtisch, Frühstückstisch, Tisch)
   ===================================================================== */
const VORN = 143, HINT = 115, FUSS = 198, SK = 0.774;          // Tischplatte vorne/hinten, Fußpunkt, Maßstab hinten/vorne
function tisch(a, b, decke, liste, extra) {
  const ah = VX + (a - VX) * SK, bh = VX + (b - VX) * SK;
  const at = (u, w) => { const xa = ah + (a - ah) * w, xb = bh + (b - bh) * w; return [xa + (xb - xa) * u, HINT + (VORN - HINT) * w]; };
  let k = schatten((a + b) / 2, FUSS - 0.5, (b - a) / 2 + 2, 2.6, 0.35);
  /* Beine (Kantholz), hintere Beine kürzer */
  for (const [x, y0, y1, w] of [[ah + 3, HINT, 158, 2.6], [bh - 3, HINT, 158, 2.6], [a + 4, VORN, FUSS, 3.6], [b - 4, VORN, FUSS, 3.6]]) k += `<rect x="${r(x - w / 2)}" y="${y0}" width="${w}" height="${y1 - y0}" fill="${HOLZ_V}"/>`;
  k += `<rect x="${a + 2}" y="${VORN + 2}" width="${b - a - 4}" height="5" fill="${HOLZ_D}"/>`;
  /* Platte */
  k += `<path d="M${r(ah)} ${HINT}H${r(bh)}L${b} ${VORN}H${a}Z" fill="${decke}"/>`;
  k += `<path d="M${a} ${VORN}H${b}v2.6H${a}z" fill="${decke === "url(#ger_holzplatte)" ? "#4e2f17" : "#e9e4d8"}"/>`;
  if (extra) k += extra(at);
  const pos = liste.map(([id, u, w]) => { const [x, y] = at(u, w); return [id, x, y, 1.22 * (SK + (1 - SK) * w)]; });
  const { g, unter } = gruppe(pos, 16.6, 12.8);
  return { k: k + g, unter };
}
S.def(`<linearGradient id="ger_holzplatte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4f2c"/><stop offset="1" stop-color="#8f6037"/></linearGradient>`);
S.def(`<pattern id="ger_karo" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#fbfaf6"/><rect width="2" height="2" fill="#c0392b" opacity=".85"/><rect x="2" y="2" width="2" height="2" fill="#c0392b" opacity=".85"/><rect x="2" width="2" height="2" fill="#e6a39b" opacity=".6"/><rect y="2" width="2" height="2" fill="#e6a39b" opacity=".6"/></pattern>`);
const zoomTisch = (a, b) => ({ x: a - 4, y: 90, w: b - a + 8, h: (b - a + 8) / 1.5 });
{
  /* DER STAMMTISCH — Holzplatte, schmiedeeisernes Stammtisch-Schild */
  const a = 6, b = 102;
  const { k, unter } = tisch(a, b, "url(#ger_holzplatte)", [
    ["weisswurst", 0.14, 0.28], ["brezel", 0.36, 0.26], ["senf", 0.64, 0.24], ["leberkaese", 0.86, 0.28],
    ["kaesespaetzle", 0.17, 0.74], ["maultaschen", 0.5, 0.76], ["linsensuppe", 0.83, 0.74],
  ], (at) => {
    const [x, y] = at(0.5, 0.05);
    let s = `<path d="M${r(x - 3)} ${r(y + 0.6)}h6l-.8 -1.4h-4.4z" fill="#222"/><path d="M${r(x)} ${r(y)}V${r(y - 13)}" stroke="#222" stroke-width=".9"/>`;
    s += `<path d="M${r(x - 11)} ${r(y - 12)}q11 -6 22 0" stroke="#222" stroke-width=".7" fill="none"/><path d="M${r(x - 10)} ${r(y - 11)}h20" stroke="#222" stroke-width=".5"/>`;
    s += `<rect x="${r(x - 11)}" y="${r(y - 11.4)}" width="22" height="5.2" rx="1" fill="#f3e6c4" stroke="#222" stroke-width=".6"/><text x="${r(x)}" y="${r(y - 7.6)}" font-size="3.4" text-anchor="middle" fill="#3a2412" font-family="'Old English Text MT','UnifrakturMaguntia',Georgia,serif" font-weight="bold">Stammtisch</text>`;
    s += `<path d="M${r(x - 8)} ${r(y - 12.2)}l-1.6 -1.6M${r(x + 8)} ${r(y - 12.2)}l1.6 -1.6" stroke="#222" stroke-width=".5"/>`;
    return s;
  });
  S.teil({ id: "stammtisch", de: "der Stammtisch", syl: "STAMM-tisch", it: "il tavolo dei clienti abituali", itSyl: "TA-vo-lo dei cli-EN-ti a-bi-tu-A-li", en: "regulars' table", x: (a + b) / 2, y: FUSS,
    kunst: `<g transform="translate(${-(a + b) / 2} ${-FUSS})">${k}</g>`, zoom: zoomTisch(a, b), unter,
    tipp: "Am Stammtisch sitzen die Stammgäste — hier mit Gerichten aus Bayern und Schwaben." });
}
{
  /* DER FRÜHSTÜCKSTISCH — weiße Decke */
  const a = 112, b = 208;
  const { k, unter } = tisch(a, b, S.lg("weiss", [[0, "#f1eee6"], [1, "#fbfaf6"]]), [
    ["brot", 0.12, 0.26], ["broetchen", 0.33, 0.24], ["schwarzbrot", 0.54, 0.26], ["kaese", 0.74, 0.24], ["butter", 0.92, 0.28],
    ["ruehrei", 0.1, 0.76], ["ei_spiegel", 0.31, 0.74], ["ei_gekocht", 0.5, 0.74], ["butterbrot", 0.7, 0.76], ["wurstbrot", 0.9, 0.76],
  ], (at) => { const [x, y] = at(0.5, 0.5); return `<path d="M${r(x - 30)} ${r(y)}h60" stroke="#e2dccf" stroke-width=".4"/>`; });
  S.teil({ id: "fruehstueckstisch", de: "der Frühstückstisch", syl: "FRÜH-stücks-tisch", it: "il tavolo della colazione", itSyl: "TA-vo-lo del-la co-la-ZIO-ne", en: "breakfast table", x: (a + b) / 2, y: FUSS,
    kunst: `<g transform="translate(${-(a + b) / 2} ${-FUSS})">${k}</g>`, zoom: zoomTisch(a, b), unter,
    tipp: "Ein deutsches Frühstück: Brot und Brötchen, Butter, Käse, Wurst und Ei." });
}
{
  /* DER TISCH — rot-weiß karierte Decke: Norddeutsches und Berliner Imbiss */
  const a = 218, b = 314;
  const { k, unter } = tisch(a, b, "url(#ger_karo)", [
    ["matjes", 0.12, 0.27], ["fischbroetchen", 0.33, 0.25], ["ketchup", 0.52, 0.22], ["bratwurst", 0.71, 0.26], ["gurkensalat", 0.91, 0.27],
    ["labskaus", 0.1, 0.76], ["gruenkohl", 0.31, 0.76], ["currywurst", 0.51, 0.75], ["currywurst_pommes", 0.71, 0.75], ["kartoffelsalat", 0.91, 0.75],
  ]);
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: (a + b) / 2, y: FUSS,
    kunst: `<g transform="translate(${-(a + b) / 2} ${-FUSS})">${k}</g>`, zoom: zoomTisch(a, b), unter,
    tipp: "Auf diesem Tisch: Gerichte aus Norddeutschland und vom Berliner Imbiss." });
}
{
  /* DIE LAMPE — Wagenrad-Leuchter über dem mittleren Tisch */
  let g = `<path d="M0 -14V-4" stroke="#2a1a0c" stroke-width=".6"/><path d="M-3 -4L-16 2M3 -4L16 2M0 -4V2" stroke="#2a1a0c" stroke-width=".4"/>`;
  g += `<ellipse cx="0" cy="2" rx="17" ry="2.6" fill="none" stroke="#4a2e18" stroke-width="1.6"/><path d="M-17 2H17M0 -.6V4.6M-12 .2L12 3.8M12 .2L-12 3.8" stroke="#4a2e18" stroke-width=".7"/>`;
  for (const x of [-15, -7, 7, 15]) g += `<rect x="${x - 0.6}" y="-1" width="1.2" height="3" fill="#f3ead2"/><ellipse cx="${x}" cy="-1.8" rx=".7" ry="1.2" fill="#ffd36b"/><circle cx="${x}" cy="-1.6" r="3" fill="#fff3c4" opacity=".35"/>`;
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 160, y: 14, kunst: g + flaeche(-18, -2, 36, 8), oben: true });
}

/* warmes Licht über allem */
S.davor(`<rect width="320" height="200" fill="${S.rg("licht", [[0, "#ffe6a8", 0.14], [1, "#ffe6a8", 0]], 0.5, 0.2, 0.7)}"/>`);

console.log(S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/gerichte.js")));
