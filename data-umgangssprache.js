/* =====================================================================
   UMGANGSSPRACHE — wie man es wirklich sagt
   ---------------------------------------------------------------------
   GEWÜNSCHT: „Ein Umschalter formell ↔ umgangssprachlich, auch in der
   Anatomie.“ Also: zu den Wörtern aus dem Wörterbuch die zweite Form,
   die man auf der Straße, am Küchentisch und beim Arzt tatsächlich hört.

   WAS HIER STEHT UND WAS NICHT
   Aufgenommen ist nur, was im Wörterbuch (Duden, DWDS) als
   umgangssprachlich, salopp, derb, Kurzform oder landschaftlich
   verzeichnet ist. Erfundene „Alltagswörter“ stehen hier nicht. Wo es
   keine zweite Form gibt, bleibt das Wort, wie es ist — das ist kein
   Loch in der Liste, sondern die Wahrheit über das Wort.

   DER SCHLÜSSEL ist das Wort MIT Artikel, genau so, wie es in den
   Bildern und im Wörterbuch steht („das Toilettenpapier“). Nur so
   findet die App es wieder.

   JEDER EINTRAG TRÄGT SEINE STILEBENE MIT — das ist der eigentliche
   Lernwert. Wer „die Glotze“ sagt, sagt etwas anderes als wer „der
   Fernseher“ sagt, und wer das nicht weiß, tritt ins Fettnäpfchen:
     kurz          übliche Kurzform desselben Wortes (die Uni)
     ugs.          umgangssprachlich, überall unverfänglich (das Klo)
     salopp        lockerer, unter Freunden (die Kohle)
     derb          grob — verstehen ja, selbst benutzen lieber nicht
     abwertend     enthält eine Herabsetzung (der Bulle)
     Kindersprache mit und von Kindern gesprochen (der Popo)
     regional      nur in einem Teil des Sprachgebiets üblich
   Mehrere Angaben stehen mit Komma zusammen. „wo“ nennt die Gegend.

   Hierher gehören KEINE reinen Regionalwörter wie Semmel/Schrippe/Weck
   — die stehen in data-dialekt.js, wo sie nebeneinander vergleichbar
   sind. Hier steht nur, was im ganzen Sprachgebiet als lockere Form
   gilt (plus ein paar wenige, die man überall versteht).
   ===================================================================== */
window.DMA_UMGANGSSPRACHE = {

  /* ---- Haushalt, Wohnung, Dinge des Tages ------------------------ */
  "das Toilettenpapier": { wort: "das Klopapier", syl: "KLO-pa-pier", stil: "ugs." },
  "die Toilette": { wort: "das Klo", syl: "KLO", stil: "ugs." },
  "der Kugelschreiber": { wort: "der Kuli", syl: "KU-li", stil: "kurz" },
  "das Spülmittel": { wort: "das Spüli", syl: "SPÜ-li", stil: "ugs." },
  "die Geschirrspülmaschine": { wort: "die Spülmaschine", syl: "SPÜL-ma-schi-ne", stil: "kurz" },
  "die Spülmaschine": { wort: "der Geschirrspüler", syl: "Ge-SCHIRR-spü-ler", stil: "kurz" },
  "das Federmäppchen": { wort: "das Mäppchen", syl: "MÄPP-chen", stil: "kurz" },
  "das Sofa": { wort: "die Couch", syl: "COUCH", stil: "ugs." },
  "der Fernseher": { wort: "die Glotze", syl: "GLOT-ze", stil: "salopp" },
  "das Fernsehgerät": { wort: "der Fernseher", syl: "FERN-se-her", stil: "kurz" },
  "der Kühlschrank": { wort: "der Kühlschrank", syl: "KÜHL-schrank", stil: "" },
  "der Staubsauger": { wort: "der Sauger", syl: "SAU-ger", stil: "kurz" },
  "die Mülltonne": { wort: "die Tonne", syl: "TON-ne", stil: "kurz" },
  "der Regenschirm": { wort: "der Schirm", syl: "SCHIRM", stil: "kurz" },
  "das Deodorant": { wort: "das Deo", syl: "DE-o", stil: "kurz" },
  "der Schraubendreher": { wort: "der Schraubenzieher", syl: "SCHRAU-ben-zie-her", stil: "ugs." },
  "der Kleiderschrank": { wort: "der Schrank", syl: "SCHRANK", stil: "kurz" },
  "die Wohnung": { wort: "die Bude", syl: "BU-de", stil: "salopp" },
  "die Wohngemeinschaft": { wort: "die WG", syl: "We-GE", stil: "kurz" },
  "der Wecker": { wort: "der Wecker", syl: "WE-cker", stil: "" },
  "das Kopfkissen": { wort: "das Kissen", syl: "KIS-sen", stil: "kurz" },
  "die Bettdecke": { wort: "das Oberbett", syl: "O-ber-bett", stil: "regional", wo: "Norddeutschland; in Österreich „die Tuchent“, in der Schweiz „das Duvet“" },

  /* ---- Technik --------------------------------------------------- */
  "das Smartphone": { wort: "das Handy", syl: "HAN-dy", stil: "ugs." },
  "das Mobiltelefon": { wort: "das Handy", syl: "HAN-dy", stil: "ugs." },
  "der Computer": { wort: "der Rechner", syl: "RECH-ner", stil: "ugs." },
  "das Ladegerät": { wort: "das Ladekabel", syl: "LA-de-ka-bel", stil: "ugs." },
  "der Fernsprecher": { wort: "das Telefon", syl: "Te-le-FON", stil: "ugs." },
  "die Fotografie": { wort: "das Foto", syl: "FO-to", stil: "kurz" },
  "die Telefonnummer": { wort: "die Nummer", syl: "NUM-mer", stil: "kurz" },
  "der Lautsprecher": { wort: "die Box", syl: "BOX", stil: "ugs." },

  /* ---- Unterwegs ------------------------------------------------- */
  "das Fahrrad": { wort: "das Rad", syl: "RAD", stil: "kurz" },
  "das Motorrad": { wort: "die Maschine", syl: "Ma-SCHI-ne", stil: "ugs." },
  "das Automobil": { wort: "das Auto", syl: "AU-to", stil: "kurz" },
  "der Personenkraftwagen": { wort: "das Auto", syl: "AU-to", stil: "kurz" },
  "das Auto": { wort: "die Karre", syl: "KAR-re", stil: "salopp" },
  "der Lastwagen": { wort: "der Laster", syl: "LAS-ter", stil: "ugs." },
  "die Lokomotive": { wort: "die Lok", syl: "LOK", stil: "kurz" },
  "die Fahrkarte": { wort: "das Ticket", syl: "TI-cket", stil: "ugs." },
  "der Fahrkartenautomat": { wort: "der Automat", syl: "Au-to-MAT", stil: "kurz" },
  "der Aufzug": { wort: "der Fahrstuhl", syl: "FAHR-stuhl", stil: "ugs." },
  "die Straßenbahn": { wort: "die Tram", syl: "TRAM", stil: "regional", wo: "Süddeutschland, Österreich, Schweiz; im Norden „die Bahn“" },
  "der Motorroller": { wort: "der Roller", syl: "ROL-ler", stil: "kurz" },
  "die Tankstelle": { wort: "die Tanke", syl: "TAN-ke", stil: "salopp" },

  /* ---- Papier, Ämter, Geld --------------------------------------- */
  "der Personalausweis": { wort: "der Perso", syl: "PER-so", stil: "ugs." },
  "das Geld": { wort: "die Kohle", syl: "KOH-le", stil: "salopp" },
  "der Geldbeutel": { wort: "das Portemonnaie", syl: "Port-mo-NEE", stil: "ugs." },
  "die Arbeit": { wort: "der Job", syl: "JOB", stil: "ugs." },
  "die Universität": { wort: "die Uni", syl: "U-ni", stil: "kurz" },
  "die Kindertagesstätte": { wort: "die Kita", syl: "KI-ta", stil: "kurz" },
  "die Mathematik": { wort: "Mathe", syl: "MA-the", stil: "kurz" },
  "der Polizist": { wort: "der Bulle", syl: "BUL-le", stil: "salopp, abwertend", wo: "Vorsicht: Polizistinnen und Polizisten empfinden das als Beleidigung — verstehen ja, selbst sagen besser nicht." },
  "die Polizei": { wort: "die Bullen", syl: "BUL-len", stil: "salopp, abwertend", wo: "Dasselbe gilt hier: im Gespräch mit der Polizei ist das eine Beleidigung." },
  "der Krankenwagen": { wort: "der Rettungswagen", syl: "RET-tungs-wa-gen", stil: "" },

  /* ---- Essen und Trinken ----------------------------------------- */
  "die Limonade": { wort: "die Limo", syl: "LI-mo", stil: "kurz" },
  "die Schokolade": { wort: "die Schoki", syl: "SCHO-ki", stil: "ugs." },
  "das Mineralwasser": { wort: "das Sprudelwasser", syl: "SPRU-del-was-ser", stil: "ugs." },
  "das stille Mineralwasser": { wort: "das stille Wasser", syl: "STIL-le WAS-ser", stil: "kurz" },
  "die Zigarette": { wort: "die Kippe", syl: "KIP-pe", stil: "salopp" },
  "das Essen": { wort: "das Futter", syl: "FUT-ter", stil: "salopp", wo: "Eigentlich das Essen der Tiere — über eigenes Essen gesagt ist es ein Scherz." },
  "das Abendessen": { wort: "das Abendbrot", syl: "A-bend-brot", stil: "regional", wo: "Nord- und Ostdeutschland" },
  "die Kartoffel": { wort: "die Kartoffel", syl: "Kar-TOF-fel", stil: "" },
  "der Kartoffelpuffer": { wort: "der Reibekuchen", syl: "REI-be-ku-chen", stil: "regional", wo: "Rheinland; in Berlin „Kartoffelpuffer“, in Süddeutschland „Reiberdatschi“" },
  "das Hähnchen": { wort: "das Hähnchen", syl: "HÄHN-chen", stil: "" },
  "das Butterbrot": { wort: "das Butterbrot", syl: "BUT-ter-brot", stil: "" },
  "der Kaugummi": { wort: "der Kaugummi", syl: "KAU-gum-mi", stil: "" },
  "der Kaffee": { wort: "der Kaffee", syl: "KAF-fee", stil: "" },
  "die Kantine": { wort: "die Mensa", syl: "MEN-sa", stil: "", wo: "An der Uni heißt die Kantine Mensa." },

  /* ---- Kleidung -------------------------------------------------- */
  "der Pullover": { wort: "der Pulli", syl: "PUL-li", stil: "kurz" },
  "die Turnschuhe": { wort: "die Sneaker", syl: "SNEA-ker", stil: "ugs." },
  "der Turnschuh": { wort: "der Sneaker", syl: "SNEA-ker", stil: "ugs." },
  "die Unterhose": { wort: "die Unterhose", syl: "UN-ter-ho-se", stil: "" },
  "die Jeanshose": { wort: "die Jeans", syl: "JEANS", stil: "kurz" },
  "die Brille": { wort: "die Brille", syl: "BRIL-le", stil: "" },

  /* ---- Menschen -------------------------------------------------- */
  "der Großvater": { wort: "der Opa", syl: "O-pa", stil: "ugs." },
  "die Großmutter": { wort: "die Oma", syl: "O-ma", stil: "ugs." },
  "der Vater": { wort: "der Papa", syl: "PA-pa", stil: "ugs." },
  "die Mutter": { wort: "die Mama", syl: "MA-ma", stil: "ugs." },
  "die Eltern": { wort: "die Alten", syl: "AL-ten", stil: "salopp", wo: "Unter Jugendlichen — vor den Eltern selbst lieber nicht." },
  "der Freund": { wort: "der Kumpel", syl: "KUM-pel", stil: "ugs.", wo: "„Kumpel“ heißt Freund ohne Liebesbeziehung — genau der Unterschied, der bei „mein Freund“ oft missverstanden wird." },
  "der Mann": { wort: "der Typ", syl: "TYP", stil: "salopp" },
  "der Arzt": { wort: "der Doktor", syl: "DOK-tor", stil: "ugs." },
  "der Lehrer": { wort: "der Lehrer", syl: "LEH-rer", stil: "" },
  "der Chef": { wort: "der Chef", syl: "CHEF", stil: "" },

  /* =================================================================
     ANATOMIE — die alltäglichen Wörter
     -----------------------------------------------------------------
     GEWÜNSCHT: „und in der Anatomie die alltäglichen Wörter.“

     Beim Arzt fällt das Fachwort, zu Hause das Alltagswort, und
     zwischen beiden liegt genau die Lücke, in der Lernende stecken
     bleiben. Deshalb steht hier beides nebeneinander — mit der
     Stilebene dazu, denn zwischen „der Po“, „der Hintern“ und dem
     dritten Wort liegen Welten.

     Was hier NICHT steht: derbe Wörter ohne Nutzen. Wo ein Körperteil
     im Alltag schlicht sein Fachwort behält (die Wade, der Knöchel,
     die Leber), steht hier nichts.
     ================================================================= */
  "das Gesäß": { wort: "der Po", syl: "PO", stil: "ugs.", wo: "„Der Hintern“ geht auch überall; „der Popo“ sagen Kinder; das Wort mit A ist derb." },
  "der Po": { wort: "der Hintern", syl: "HIN-tern", stil: "ugs." },
  "der Nabel": { wort: "der Bauchnabel", syl: "BAUCH-na-bel", stil: "ugs." },
  "das Gehirn": { wort: "das Hirn", syl: "HIRN", stil: "kurz" },
  "die Wirbelsäule": { wort: "das Rückgrat", syl: "RÜCK-grat", stil: "ugs." },
  "die Harnblase": { wort: "die Blase", syl: "BLA-se", stil: "kurz" },
  "der Mastdarm": { wort: "der Enddarm", syl: "END-darm", stil: "ugs." },
  "die Speiseröhre": { wort: "die Speiseröhre", syl: "SPEI-se-röh-re", stil: "" },
  "der Bauch": { wort: "der Bauch", syl: "BAUCH", stil: "" },
  "der Brustkorb": { wort: "der Brustkorb", syl: "BRUST-korb", stil: "" },
  "das Schlüsselbein": { wort: "das Schlüsselbein", syl: "SCHLÜS-sel-bein", stil: "" },
  "die Kniescheibe": { wort: "die Kniescheibe", syl: "KNIE-schei-be", stil: "" },
  "der Blinddarm": { wort: "der Blinddarm", syl: "BLIND-darm", stil: "" },
  "die Menstruation": { wort: "die Periode", syl: "Pe-ri-O-de", stil: "ugs.", wo: "Ebenso üblich: „die Tage“ — „ich habe meine Tage“." },
  "die Klitoris": { wort: "der Kitzler", syl: "KITZ-ler", stil: "ugs.", wo: "„Kitzler“ ist das deutsche Wort, „Klitoris“ das lateinische Fachwort." },
  "die Vagina": { wort: "die Scheide", syl: "SCHEI-de", stil: "", wo: "„Scheide“ ist das normale deutsche Wort; im Alltag sagen viele verhüllend „die Muschi“ (ugs.)." },
  "die Scheide": { wort: "die Muschi", syl: "MU-schi", stil: "ugs., verhüllend", wo: "Zu Hause und unter Freundinnen üblich; beim Arzt sagt man „die Scheide“." },
  "der Penis": { wort: "der Pimmel", syl: "PIM-mel", stil: "ugs., Kindersprache", wo: "Kinder und Familien sagen „Pimmel“; beim Arzt heißt es „Penis“. „Der Schwanz“ ist derb." },
  "der Hoden": { wort: "die Eier", syl: "EI-er", stil: "salopp, meist Mehrzahl", wo: "Beim Arzt heißt es „der Hoden“." },
  "die Brustwarze": { wort: "der Nippel", syl: "NIP-pel", stil: "ugs." },
  "der Geschlechtsverkehr": { wort: "der Sex", syl: "SEX", stil: "ugs." },
  "die Schwangerschaft": { wort: "die Schwangerschaft", syl: "SCHWAN-ger-schaft", stil: "" },
  "der Mutterkuchen": { wort: "die Plazenta", syl: "Pla-ZEN-ta", stil: "", wo: "Hier ist es umgekehrt: das Fachwort „Plazenta“ hört man häufiger als „Mutterkuchen“." },
  "das Ungeborene": { wort: "das Baby", syl: "BA-by", stil: "ugs." },
  "der Fötus": { wort: "das Baby", syl: "BA-by", stil: "ugs.", wo: "Im Mutterpass steht „Fötus“, die Eltern sagen „Baby“." },
  "der Schnupfen": { wort: "die Erkältung", syl: "Er-KÄL-tung", stil: "", wo: "Streng genommen ist Schnupfen nur die laufende Nase, Erkältung das Ganze." },
};

/* Einträge ohne echte zweite Form stehen hier bewusst mit leerem Stil
   drin — als dokumentierte Entscheidung („für dieses Wort gibt es
   keine“), damit niemand später eines erfindet. Die App wirft sie beim
   Einlesen selbst heraus. */
