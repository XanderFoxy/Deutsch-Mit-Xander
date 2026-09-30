#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 839: DER ITALIENISCHE SATZBAUKASTEN
   ---------------------------------------------------------------------
   XANDER (Funk 225, wörtlich, Auszug): „Mache mir auch den italienisch
   satzbaukasten für den italienischen Kurs … die italienischen Wörter
   Sätze und Inhalte gehören ausschließlich in den italienisch Raum …
   einen funktionierenden satzbaukasten auf der Basis der italienischen
   originalen Grammatik … keine Quatschsätze … dass das gesperrt wird
   wenn es Unsinn wird bzw dass der Hinweis kommt … und dass dann eher
   Vorschläge kommen was man sagen will … 100% idiotensicher und
   bulletproof … ich spreche die italienische Sprache nicht … darf
   niemals irgendetwas falsches dabei rauskommen … überprüfe sämtliche
   Konstellationen“

   A  REFERENZTABELLE (Node, von Hand geschrieben, NICHT aus der Engine):
      jedes Verb in presente (6 Formen), congiuntivo presente (6),
      imperfetto, futuro, condizionale, congiuntivo imperfetto (aus der
      1. Person nach den festen Endungen), Partizip, Hilfsverb. Dazu die
      Modalverben, essere/avere, Artikel, Präposition + Artikel, die
      deutschen Verben der Bedeutungszeile (gegen satzbau.js/Duden).
   B  MASSENPRÜFUNG: ≥ 20 000 Zufallssätze über alle Niveaus, Zeitformen,
      Satzarten, Verbindungen und Einleitungen. Geprüft mit eigenen
      Regeln: Artikel vor Vokal/s impura, Verschmelzung, Elision, Verbform
      laut Tabelle, Hilfsverb, Partizip-Angleichung bei essere, non vor
      dem Verb, Pronomen weggelassen, congiuntivo nach dem Auslöser,
      periodo ipotetico, Satzzeichen, doppelte Wörter, Zeitangabe zur
      Zeitform, Sinn-Sperrliste; deutsche Zeile: Großschreibung, Verb am
      Ende im Nebensatz, kein „nicht kein“.
   C  UNSINN-SPERRE: widersprüchliche Wahl → gesperrt, mit Hinweis und
      2–3 gültigen Vorschlägen.
   D  OBERFLÄCHE (Chromium): Italienisch nur im Italienisch-Raum und nur
      für Berechtigte, deutsche Bedeutung darunter, Hinweis „klingt
      komisch – meintest du …?“ mit Vorschlägen, 360 px ohne Überlappung,
      Tippflächen ≥ 30 px, Bildschirmfotos. Im Deutsch-Raum: kein
      Italienisch, und die Sperre mit Vorschlägen im deutschen Baukasten.
   NUR=A,B,C,D  LESEN=1 (60 Sätze je Niveau)  BILD=/pfad/präfix
   WURZEL=…  (Gegenprobe gegen einen anderen Stand)
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const NUR = (process.env.NUR || "A,B,C,D").split(",");
const BILD = process.env.BILD || "";
const LESEN = process.env.LESEN === "1";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
let samen = Number(process.env.SAMEN || 839);
const zufall = () => { samen = (samen * 1103515245 + 12345) % 2147483648; return samen / 2147483648; };

global.window = {};
let S = {};
try { require(path.join(WURZEL, "satzbau.js")); } catch (e) {}
try { require(path.join(WURZEL, "satzbau-it.js")); S = window.SatzbauIt || {}; } catch (e) { console.log("satzbau-it.js lädt nicht: " + e.message); }
const DE = window.Satzbau || {};
const da = typeof S.bauen === "function";

/* ---------------------------------------------------------------------
   A · DIE REFERENZTABELLE — von Hand.
   inf | presente (6) | imperfetto io | futuro io | congiuntivo (6) |
   congiuntivo imperfetto io | Partizip | Hilfsverb (E = essere)
   --------------------------------------------------------------------- */
const TABELLE = `
andare|vado vai va andiamo andate vanno|andavo|andrò|vada vada vada andiamo andiate vadano|andassi|andato|E
tornare|torno torni torna torniamo tornate tornano|tornavo|tornerò|torni torni torni torniamo torniate tornino|tornassi|tornato|E
venire|vengo vieni viene veniamo venite vengono|venivo|verrò|venga venga venga veniamo veniate vengano|venissi|venuto|E
uscire|esco esci esce usciamo uscite escono|uscivo|uscirò|esca esca esca usciamo usciate escano|uscissi|uscito|E
partire|parto parti parte partiamo partite partono|partivo|partirò|parta parta parta partiamo partiate partano|partissi|partito|E
arrivare|arrivo arrivi arriva arriviamo arrivate arrivano|arrivavo|arriverò|arrivi arrivi arrivi arriviamo arriviate arrivino|arrivassi|arrivato|E
restare|resto resti resta restiamo restate restano|restavo|resterò|resti resti resti restiamo restiate restino|restassi|restato|E
essere|sono sei è siamo siete sono|ero|sarò|sia sia sia siamo siate siano|fossi|stato|E
abitare|abito abiti abita abitiamo abitate abitano|abitavo|abiterò|abiti abiti abiti abitiamo abitiate abitino|abitassi|abitato|A
viaggiare|viaggio viaggi viaggia viaggiamo viaggiate viaggiano|viaggiavo|viaggerò|viaggi viaggi viaggi viaggiamo viaggiate viaggino|viaggiassi|viaggiato|A
fare|faccio fai fa facciamo fate fanno|facevo|farò|faccia faccia faccia facciamo facciate facciano|facessi|fatto|A
alzare|alzo alzi alza alziamo alzate alzano|alzavo|alzerò|alzi alzi alzi alziamo alziate alzino|alzassi|alzato|A
svegliare|sveglio svegli sveglia svegliamo svegliate svegliano|svegliavo|sveglierò|svegli svegli svegli svegliamo svegliate sveglino|svegliassi|svegliato|A
lavare|lavo lavi lava laviamo lavate lavano|lavavo|laverò|lavi lavi lavi laviamo laviate lavino|lavassi|lavato|A
vestire|vesto vesti veste vestiamo vestite vestono|vestivo|vestirò|vesta vesta vesta vestiamo vestiate vestano|vestissi|vestito|A
riposare|riposo riposi riposa riposiamo riposate riposano|riposavo|riposerò|riposi riposi riposi riposiamo riposiate riposino|riposassi|riposato|A
addormentare|addormento addormenti addormenta addormentiamo addormentate addormentano|addormentavo|addormenterò|addormenti addormenti addormenti addormentiamo addormentiate addormentino|addormentassi|addormentato|A
dormire|dormo dormi dorme dormiamo dormite dormono|dormivo|dormirò|dorma dorma dorma dormiamo dormiate dormano|dormissi|dormito|A
divertire|diverto diverti diverte divertiamo divertite divertono|divertivo|divertirò|diverta diverta diverta divertiamo divertiate divertano|divertissi|divertito|A
sentire|sento senti sente sentiamo sentite sentono|sentivo|sentirò|senta senta senta sentiamo sentiate sentano|sentissi|sentito|A
annoiare|annoio annoi annoia annoiamo annoiate annoiano|annoiavo|annoierò|annoi annoi annoi annoiamo annoiate annoino|annoiassi|annoiato|A
sedere|siedo siedi siede sediamo sedete siedono|sedevo|sederò|sieda sieda sieda sediamo sediate siedano|sedessi|seduto|A
trasferire|trasferisco trasferisci trasferisce trasferiamo trasferite trasferiscono|trasferivo|trasferirò|trasferisca trasferisca trasferisca trasferiamo trasferiate trasferiscano|trasferissi|trasferito|A
preparare|preparo prepari prepara prepariamo preparate preparano|preparavo|preparerò|prepari prepari prepari prepariamo prepariate preparino|preparassi|preparato|A
mangiare|mangio mangi mangia mangiamo mangiate mangiano|mangiavo|mangerò|mangi mangi mangi mangiamo mangiate mangino|mangiassi|mangiato|A
bere|bevo bevi beve beviamo bevete bevono|bevevo|berrò|beva beva beva beviamo beviate bevano|bevessi|bevuto|A
cucinare|cucino cucini cucina cuciniamo cucinate cucinano|cucinavo|cucinerò|cucini cucini cucini cuciniamo cuciniate cucinino|cucinassi|cucinato|A
ordinare|ordino ordini ordina ordiniamo ordinate ordinano|ordinavo|ordinerò|ordini ordini ordini ordiniamo ordiniate ordinino|ordinassi|ordinato|A
pranzare|pranzo pranzi pranza pranziamo pranzate pranzano|pranzavo|pranzerò|pranzi pranzi pranzi pranziamo pranziate pranzino|pranzassi|pranzato|A
cenare|ceno ceni cena ceniamo cenate cenano|cenavo|cenerò|ceni ceni ceni ceniamo ceniate cenino|cenassi|cenato|A
assaggiare|assaggio assaggi assaggia assaggiamo assaggiate assaggiano|assaggiavo|assaggerò|assaggi assaggi assaggi assaggiamo assaggiate assaggino|assaggiassi|assaggiato|A
pagare|pago paghi paga paghiamo pagate pagano|pagavo|pagherò|paghi paghi paghi paghiamo paghiate paghino|pagassi|pagato|A
comprare|compro compri compra compriamo comprate comprano|compravo|comprerò|compri compri compri compriamo compriate comprino|comprassi|comprato|A
cercare|cerco cerchi cerca cerchiamo cercate cercano|cercavo|cercherò|cerchi cerchi cerchi cerchiamo cerchiate cerchino|cercassi|cercato|A
scegliere|scelgo scegli sceglie scegliamo scegliete scelgono|sceglievo|sceglierò|scelga scelga scelga scegliamo scegliate scelgano|scegliessi|scelto|A
provare|provo provi prova proviamo provate provano|provavo|proverò|provi provi provi proviamo proviate provino|provassi|provato|A
vendere|vendo vendi vende vendiamo vendete vendono|vendevo|venderò|venda venda venda vendiamo vendiate vendano|vendessi|venduto|A
lavorare|lavoro lavori lavora lavoriamo lavorate lavorano|lavoravo|lavorerò|lavori lavori lavori lavoriamo lavoriate lavorino|lavorassi|lavorato|A
scrivere|scrivo scrivi scrive scriviamo scrivete scrivono|scrivevo|scriverò|scriva scriva scriva scriviamo scriviate scrivano|scrivessi|scritto|A
leggere|leggo leggi legge leggiamo leggete leggono|leggevo|leggerò|legga legga legga leggiamo leggiate leggano|leggessi|letto|A
telefonare|telefono telefoni telefona telefoniamo telefonate telefonano|telefonavo|telefonerò|telefoni telefoni telefoni telefoniamo telefoniate telefonino|telefonassi|telefonato|A
chiamare|chiamo chiami chiama chiamiamo chiamate chiamano|chiamavo|chiamerò|chiami chiami chiami chiamiamo chiamiate chiamino|chiamassi|chiamato|A
mandare|mando mandi manda mandiamo mandate mandano|mandavo|manderò|mandi mandi mandi mandiamo mandiate mandino|mandassi|mandato|A
finire|finisco finisci finisce finiamo finite finiscono|finivo|finirò|finisca finisca finisca finiamo finiate finiscano|finissi|finito|A
cominciare|comincio cominci comincia cominciamo cominciate cominciano|cominciavo|comincerò|cominci cominci cominci cominciamo cominciate comincino|cominciassi|cominciato|A
organizzare|organizzo organizzi organizza organizziamo organizzate organizzano|organizzavo|organizzerò|organizzi organizzi organizzi organizziamo organizziate organizzino|organizzassi|organizzato|A
rispondere|rispondo rispondi risponde rispondiamo rispondete rispondono|rispondevo|risponderò|risponda risponda risponda rispondiamo rispondiate rispondano|rispondessi|risposto|A
aiutare|aiuto aiuti aiuta aiutiamo aiutate aiutano|aiutavo|aiuterò|aiuti aiuti aiuti aiutiamo aiutiate aiutino|aiutassi|aiutato|A
incontrare|incontro incontri incontra incontriamo incontrate incontrano|incontravo|incontrerò|incontri incontri incontri incontriamo incontriate incontrino|incontrassi|incontrato|A
vedere|vedo vedi vede vediamo vedete vedono|vedevo|vedrò|veda veda veda vediamo vediate vedano|vedessi|visto|A
aspettare|aspetto aspetti aspetta aspettiamo aspettate aspettano|aspettavo|aspetterò|aspetti aspetti aspetti aspettiamo aspettiate aspettino|aspettassi|aspettato|A
usare|uso usi usa usiamo usate usano|usavo|userò|usi usi usi usiamo usiate usino|usassi|usato|A
riparare|riparo ripari ripara ripariamo riparate riparano|riparavo|riparerò|ripari ripari ripari ripariamo ripariate riparino|riparassi|riparato|A
stampare|stampo stampi stampa stampiamo stampate stampano|stampavo|stamperò|stampi stampi stampi stampiamo stampiate stampino|stampassi|stampato|A
firmare|firmo firmi firma firmiamo firmate firmano|firmavo|firmerò|firmi firmi firmi firmiamo firmiate firmino|firmassi|firmato|A
compilare|compilo compili compila compiliamo compilate compilano|compilavo|compilerò|compili compili compili compiliamo compiliate compilino|compilassi|compilato|A
prenotare|prenoto prenoti prenota prenotiamo prenotate prenotano|prenotavo|prenoterò|prenoti prenoti prenoti prenotiamo prenotiate prenotino|prenotassi|prenotato|A
rinnovare|rinnovo rinnovi rinnova rinnoviamo rinnovate rinnovano|rinnovavo|rinnoverò|rinnovi rinnovi rinnovi rinnoviamo rinnoviate rinnovino|rinnovassi|rinnovato|A
richiedere|richiedo richiedi richiede richiediamo richiedete richiedono|richiedevo|richiederò|richieda richieda richieda richiediamo richiediate richiedano|richiedessi|richiesto|A
consegnare|consegno consegni consegna consegniamo consegnate consegnano|consegnavo|consegnerò|consegni consegni consegni consegniamo consegniate consegnino|consegnassi|consegnato|A
spedire|spedisco spedisci spedisce spediamo spedite spediscono|spedivo|spedirò|spedisca spedisca spedisca spediamo spediate spediscano|spedissi|spedito|A
giocare|gioco giochi gioca giochiamo giocate giocano|giocavo|giocherò|giochi giochi giochi giochiamo giochiate giochino|giocassi|giocato|A
suonare|suono suoni suona suoniamo suonate suonano|suonavo|suonerò|suoni suoni suoni suoniamo suoniate suonino|suonassi|suonato|A
ascoltare|ascolto ascolti ascolta ascoltiamo ascoltate ascoltano|ascoltavo|ascolterò|ascolti ascolti ascolti ascoltiamo ascoltiate ascoltino|ascoltassi|ascoltato|A
guardare|guardo guardi guarda guardiamo guardate guardano|guardavo|guarderò|guardi guardi guardi guardiamo guardiate guardino|guardassi|guardato|A
ballare|ballo balli balla balliamo ballate ballano|ballavo|ballerò|balli balli balli balliamo balliate ballino|ballassi|ballato|A
cantare|canto canti canta cantiamo cantate cantano|cantavo|canterò|canti canti canti cantiamo cantiate cantino|cantassi|cantato|A
nuotare|nuoto nuoti nuota nuotiamo nuotate nuotano|nuotavo|nuoterò|nuoti nuoti nuoti nuotiamo nuotiate nuotino|nuotassi|nuotato|A
correre|corro corri corre corriamo correte corrono|correvo|correrò|corra corra corra corriamo corriate corrano|corressi|corso|A
visitare|visito visiti visita visitiamo visitate visitano|visitavo|visiterò|visiti visiti visiti visitiamo visitiate visitino|visitassi|visitato|A
disegnare|disegno disegni disegna disegniamo disegnate disegnano|disegnavo|disegnerò|disegni disegni disegni disegniamo disegniate disegnino|disegnassi|disegnato|A
festeggiare|festeggio festeggi festeggia festeggiamo festeggiate festeggiano|festeggiavo|festeggerò|festeggi festeggi festeggi festeggiamo festeggiate festeggino|festeggiassi|festeggiato|A
regalare|regalo regali regala regaliamo regalate regalano|regalavo|regalerò|regali regali regali regaliamo regaliate regalino|regalassi|regalato|A
portare|porto porti porta portiamo portate portano|portavo|porterò|porti porti porti portiamo portiate portino|portassi|portato|A
dare|do dai dà diamo date danno|davo|darò|dia dia dia diamo diate diano|dessi|dato|A
parlare|parlo parli parla parliamo parlate parlano|parlavo|parlerò|parli parli parli parliamo parliate parlino|parlassi|parlato|A
raccontare|racconto racconti racconta raccontiamo raccontate raccontano|raccontavo|racconterò|racconti racconti racconti raccontiamo raccontiate raccontino|raccontassi|raccontato|A
spiegare|spiego spieghi spiega spieghiamo spiegate spiegano|spiegavo|spiegherò|spieghi spieghi spieghi spieghiamo spieghiate spieghino|spiegassi|spiegato|A
mostrare|mostro mostri mostra mostriamo mostrate mostrano|mostravo|mostrerò|mostri mostri mostri mostriamo mostriate mostrino|mostrassi|mostrato|A
studiare|studio studi studia studiamo studiate studiano|studiavo|studierò|studi studi studi studiamo studiate studino|studiassi|studiato|A
imparare|imparo impari impara impariamo imparate imparano|imparavo|imparerò|impari impari impari impariamo impariate imparino|imparassi|imparato|A
ripetere|ripeto ripeti ripete ripetiamo ripetete ripetono|ripetevo|ripeterò|ripeta ripeta ripeta ripetiamo ripetiate ripetano|ripetessi|ripetuto|A
capire|capisco capisci capisce capiamo capite capiscono|capivo|capirò|capisca capisca capisca capiamo capiate capiscano|capissi|capito|A
frequentare|frequento frequenti frequenta frequentiamo frequentate frequentano|frequentavo|frequenterò|frequenti frequenti frequenti frequentiamo frequentiate frequentino|frequentassi|frequentato|A
superare|supero superi supera superiamo superate superano|superavo|supererò|superi superi superi superiamo superiate superino|superassi|superato|A
tradurre|traduco traduci traduce traduciamo traducete traducono|traducevo|tradurrò|traduca traduca traduca traduciamo traduciate traducano|traducessi|tradotto|A
chiedere|chiedo chiedi chiede chiediamo chiedete chiedono|chiedevo|chiederò|chieda chieda chieda chiediamo chiediate chiedano|chiedessi|chiesto|A
prendere|prendo prendi prende prendiamo prendete prendono|prendevo|prenderò|prenda prenda prenda prendiamo prendiate prendano|prendessi|preso|A
misurare|misuro misuri misura misuriamo misurate misurano|misuravo|misurerò|misuri misuri misuri misuriamo misuriate misurino|misurassi|misurato|A
avere|ho hai ha abbiamo avete hanno|avevo|avrò|abbia abbia abbia abbiamo abbiate abbiano|avessi|avuto|A
fumare|fumo fumi fuma fumiamo fumate fumano|fumavo|fumerò|fumi fumi fumi fumiamo fumiate fumino|fumassi|fumato|A
pulire|pulisco pulisci pulisce puliamo pulite puliscono|pulivo|pulirò|pulisca pulisca pulisca puliamo puliate puliscano|pulissi|pulito|A
riordinare|riordino riordini riordina riordiniamo riordinate riordinano|riordinavo|riordinerò|riordini riordini riordini riordiniamo riordiniate riordinino|riordinassi|riordinato|A
stirare|stiro stiri stira stiriamo stirate stirano|stiravo|stirerò|stiri stiri stiri stiriamo stiriate stirino|stirassi|stirato|A
aprire|apro apri apre apriamo aprite aprono|aprivo|aprirò|apra apra apra apriamo apriate aprano|aprissi|aperto|A
chiudere|chiudo chiudi chiude chiudiamo chiudete chiudono|chiudevo|chiuderò|chiuda chiuda chiuda chiudiamo chiudiate chiudano|chiudessi|chiuso|A
accendere|accendo accendi accende accendiamo accendete accendono|accendevo|accenderò|accenda accenda accenda accendiamo accendiate accendano|accendessi|acceso|A
spegnere|spengo spegni spegne spegniamo spegnete spengono|spegnevo|spegnerò|spenga spenga spenga spegniamo spegniate spengano|spegnessi|spento|A
buttare|butto butti butta buttiamo buttate buttano|buttavo|butterò|butti butti butti buttiamo buttiate buttino|buttassi|buttato|A
innaffiare|innaffio innaffi innaffia innaffiamo innaffiate innaffiano|innaffiavo|innaffierò|innaffi innaffi innaffi innaffiamo innaffiate innaffino|innaffiassi|innaffiato|A
perdere|perdo perdi perde perdiamo perdete perdono|perdevo|perderò|perda perda perda perdiamo perdiate perdano|perdessi|perso|A
trovare|trovo trovi trova troviamo trovate trovano|trovavo|troverò|trovi trovi trovi troviamo troviate trovino|trovassi|trovato|A
dimenticare|dimentico dimentichi dimentica dimentichiamo dimenticate dimenticano|dimenticavo|dimenticherò|dimentichi dimentichi dimentichi dimentichiamo dimentichiate dimentichino|dimenticassi|dimenticato|A
potere|posso puoi può possiamo potete possono|potevo|potrò|possa possa possa possiamo possiate possano|potessi|potuto|A
dovere|devo devi deve dobbiamo dovete devono|dovevo|dovrò|debba debba debba dobbiamo dobbiate debbano|dovessi|dovuto|A
volere|voglio vuoi vuole vogliamo volete vogliono|volevo|vorrò|voglia voglia voglia vogliamo vogliate vogliano|volessi|voluto|A
sapere|so sai sa sappiamo sapete sanno|sapevo|saprò|sappia sappia sappia sappiamo sappiate sappiano|sapessi|saputo|A
apparecchiare|apparecchio apparecchi apparecchia apparecchiamo apparecchiate apparecchiano|apparecchiavo|apparecchierò|apparecchi apparecchi apparecchi apparecchiamo apparecchiate apparecchino|apparecchiassi|apparecchiato|A
costare|costo costi costa costiamo costate costano|costavo|costerò|costi costi costi costiamo costiate costino|costassi|costato|E
`.trim().split("\n");
const REF = {};
TABELLE.forEach((z) => {
  const [inf, pres, imp1, fut1, cong, ci1, part, aux] = z.split("|");
  const impSt = inf === "essere" ? null : imp1.replace(/vo$/, "");
  const futSt = fut1.replace(/ò$/, "");
  const ciSt = ci1.replace(/ssi$/, "");
  REF[inf] = {
    presente: pres.split(" "),
    imperfetto: inf === "essere" ? ["ero", "eri", "era", "eravamo", "eravate", "erano"] : ["vo", "vi", "va", "vamo", "vate", "vano"].map((e) => impSt + e),
    futuro: ["ò", "ai", "à", "emo", "ete", "anno"].map((e) => futSt + e),
    condizionale: ["ei", "esti", "ebbe", "emmo", "este", "ebbero"].map((e) => futSt + e),
    congiuntivo: cong.split(" "),
    congImperfetto: ["ssi", "ssi", "sse", "ssimo", "ste", "ssero"].map((e) => ciSt + e),
    part, aux,
  };
});
/* Welche Verben reflexiv sind (Hilfsverb dann immer essere) */
const REFLEXIV = ["alzare", "svegliare", "vestire", "riposare", "addormentare", "divertire", "sentire", "annoiare", "sedere", "trasferire"];

/* Artikel von Hand: Wort → bestimmt | unbestimmt */
const ARTIKEL_SOLL = [
  ["m", 0, "libro", "il ", "un "], ["m", 0, "amico", "l'", "un "], ["m", 0, "zaino", "lo ", "uno "], ["m", 0, "studente", "lo ", "uno "],
  ["m", 0, "psicologo", "lo ", "uno "], ["m", 0, "gnomo", "lo ", "uno "], ["m", 0, "spagnolo", "lo ", "uno "], ["m", 0, "orologio", "l'", "un "],
  ["f", 0, "casa", "la ", "una "], ["f", 0, "amica", "l'", "un'"], ["f", 0, "email", "l'", "un'"], ["f", 0, "stazione", "la ", "una "],
  ["f", 0, "insalata", "l'", "un'"], ["m", 1, "libri", "i ", "dei "], ["m", 1, "amici", "gli ", "degli "], ["m", 1, "spaghetti", "gli ", "degli "],
  ["m", 1, "zaini", "gli ", "degli "], ["f", 1, "case", "le ", "delle "], ["f", 1, "amiche", "le ", "delle "], ["m", 1, "occhiali", "gli ", "degli "],
];
const VERSCHMELZUNG_SOLL = {
  "a il": "al", "a lo": "allo", "a la": "alla", "a l'": "all'", "a i": "ai", "a gli": "agli", "a le": "alle",
  "di il": "del", "di lo": "dello", "di la": "della", "di l'": "dell'", "di i": "dei", "di gli": "degli", "di le": "delle",
  "da il": "dal", "da lo": "dallo", "da la": "dalla", "da l'": "dall'", "da i": "dai", "da gli": "dagli", "da le": "dalle",
  "in il": "nel", "in lo": "nello", "in la": "nella", "in l'": "nell'", "in i": "nei", "in gli": "negli", "in le": "nelle",
  "su il": "sul", "su lo": "sullo", "su la": "sulla", "su l'": "sull'", "su i": "sui", "su gli": "sugli", "su le": "sulle",
};
/* Deutsche Verben, die satzbau.js nicht kennt — von Hand nach Duden:
   Präteritum er/sie/es | Partizip II | Hilfsverb */
const DE_HAND = {
  fliegen: "flog geflogen s", zurueckkommen: "kam zurückgekommen s", zurueckgehen: "ging zurückgegangen s", zurueckfahren: "fuhr zurückgefahren s",
  zurueckfliegen: "flog zurückgeflogen s", ausgehen: "ging ausgegangen s", abreisen: "reiste abgereist s", ankommen: "kam angekommen s",
  spazierengehen: "ging spazieren_gegangen s", aufwachen: "wachte aufgewacht s", waschen_sich: "wusch gewaschen h", waschen_sich_d: "wusch gewaschen h",
  putzen_sich_d: "putzte geputzt h", anziehen_sich: "zog angezogen h", ausruhen_sich: "ruhte ausgeruht h", einschlafen: "schlief eingeschlafen s",
  amuesieren_sich: "amüsierte amüsiert h", vorbereiten_sich: "bereitete vorbereitet h", setzen_sich: "setzte gesetzt h", langweilen_sich: "langweilte gelangweilt h",
  umziehen: "zog umgezogen s", fuehlen_sich: "fühlte gefühlt h", zubereiten: "bereitete zubereitet h", fertigmachen: "machte fertig_gemacht h",
  fruehstuecken: "frühstückte gefrühstückt h", mittagessen: "aß zu_Mittag_gegessen h", abendessen: "aß zu_Abend_gegessen h", probieren: "probierte probiert h",
  aussuchen: "suchte ausgesucht h", anprobieren: "probierte anprobiert h", verkaufen: "verkaufte verkauft h", rufen: "rief gerufen h", beginnen: "begann begonnen h",
  organisieren: "organisierte organisiert h", drucken: "druckte gedruckt h", unterschreiben: "unterschrieb unterschrieben h", ausfuellen: "füllte ausgefüllt h",
  reservieren: "reservierte reserviert h", verlaengern: "verlängerte verlängert h", beantragen: "beantragte beantragt h", abgeben: "gab abgegeben h",
  fernsehen: "sah ferngesehen h", besichtigen: "besichtigte besichtigt h", zeichnen: "zeichnete gezeichnet h", studieren: "studierte studiert h",
  bestehen: "bestand bestanden h", uebersetzen: "übersetzte übersetzt h", bitten: "bat gebeten h", messen: "maß gemessen h", rauchen: "rauchte geraucht h",
  spuelen: "spülte gespült h", buegeln: "bügelte gebügelt h", einschalten: "schaltete eingeschaltet h", ausschalten: "schaltete ausgeschaltet h",
  rausbringen: "brachte rausgebracht h", giessen: "goss gegossen h", decken: "deckte gedeckt h", duschen: "duschte geduscht h", mieten: "mietete gemietet h",
  telefonieren: "telefonierte telefoniert h", backen: "backte gebacken h", ausdrucken: "druckte ausgedruckt h", anschauen: "schaute angeschaut h",
  mitnehmen: "nahm mitgenommen h", verpassen: "verpasste verpasst h", regnen: "regnete geregnet h", geben_es: "gab gegeben h", kosten: "kostete gekostet h",
  streiken: "streikte gestreikt h", schreiben: "schrieb geschrieben h",
};
/* Starke Präsensformen (du) von Hand */
const DE_DU = { essen: "isst", lesen: "liest", sehen: "siehst", fahren: "fährst", schlafen: "schläfst", laufen: "läufst", helfen: "hilfst", treffen: "triffst",
  nehmen: "nimmst", geben: "gibst", sprechen: "sprichst", waschen: "wäschst", vergessen: "vergisst", backen: "bäckst", messen: "misst", abgeben: "gibst",
  fernsehen: "siehst", mitnehmen: "nimmst", einschlafen: "schläfst" };

(async () => {
  /* ================================================================ A */
  if (NUR.includes("A")) {
    console.log("\nA · REFERENZTABELLE (von Hand) gegen die Engine\n");
    if (!da) { sage(false, "satzbau-it.js mit bauen() ist da"); }
    else {
      const K = S.konj;
      const verbenEngine = new Map();
      S.VERBI.forEach((v) => verbenEngine.set(v.v.inf, v.v));
      S.MODALI.forEach((m) => verbenEngine.set(m.v.inf, m.v));
      verbenEngine.set("costare", { inf: "costare", aux: "essere" });
      verbenEngine.set("annoiare", { inf: "annoiare", rifl: true });
      const ohneTabelle = [...verbenEngine.keys()].filter((i) => !REF[i]);
      sage(!ohneTabelle.length, "jedes der " + verbenEngine.size + " Verben (samt Modalverben) steht in der Handtabelle", ohneTabelle.join(","));
      const falsch = [];
      let n = 0;
      verbenEngine.forEach((v, inf) => {
        const r = REF[inf]; if (!r) return;
        ["presente", "imperfetto", "futuro", "condizionale", "congiuntivo", "congImperfetto"].forEach((z) => {
          for (let p = 0; p < 6; p++) {
            n++;
            const ist = K.einfach(v, z, p);
            if (ist !== r[z][p]) falsch.push(inf + " " + z + "[" + p + "] " + ist + " ≠ " + r[z][p]);
          }
        });
        n++;
        if (K.partizip(v) !== r.part) falsch.push(inf + " Partizip " + K.partizip(v) + " ≠ " + r.part);
        const auxSoll = v.rifl || REFLEXIV.includes(inf) && v.rifl ? "essere" : (r.aux === "E" ? "essere" : "avere");
        if (!v.rifl && K.hilfsverb(v) !== auxSoll) falsch.push(inf + " Hilfsverb " + K.hilfsverb(v) + " ≠ " + auxSoll);
        if (v.rifl && K.hilfsverb(v) !== "essere") falsch.push(inf + " reflexiv ohne essere");
      });
      sage(n > 3500 && !falsch.length, n + " Formen: presente, imperfetto, futuro, condizionale, congiuntivo, congiuntivo imperfetto, Partizip, Hilfsverb stimmen mit der Handtabelle", falsch.slice(0, 6).join(" | "));
      // Angleichung des Partizips
      const ang = [["andare", "f", false, "andata"], ["andare", "m", true, "andati"], ["andare", "f", true, "andate"], ["essere", "f", true, "state"],
        ["uscire", "f", false, "uscita"], ["venire", "m", true, "venuti"], ["alzare", "f", true, "alzate"], ["sedere", "f", false, "seduta"]];
      const angF = ang.filter(([inf, g, pl, soll]) => K.partizipForm(verbenEngine.get(inf), g, pl) !== soll).map((x) => x.join(" "));
      sage(!angF.length, "Partizip richtet sich bei essere nach der Person: andata, andati, andate, state, uscita, venuti, alzate, seduta", angF.join(" | "));
      // Enklitisch
      const enk = [["alzare", 0, "alzarmi"], ["alzare", 2, "alzarsi"], ["alzare", 3, "alzarci"], ["sedere", 1, "sederti"], ["vestire", 4, "vestirvi"]];
      const enkF = enk.filter(([inf, p, soll]) => K.enklitisch(inf, p) !== soll).map((x) => x.join(" "));
      sage(!enkF.length, "reflexiv mit Modalverb: devo alzarmi, deve alzarsi, possiamo alzarci, puoi sederti, dovete vestirvi", enkF.join(" | "));
      // Artikel
      const artF = [];
      ARTIKEL_SOLL.forEach(([g, pl, wort, best, unb]) => {
        const b = S.artikel("def", g, Boolean(pl), wort), u = S.artikel(pl ? "part" : "indef", g, Boolean(pl), wort);
        if (b !== best) artF.push(wort + ": " + b + "≠" + best);
        if (u !== unb) artF.push(wort + ": " + u + "≠" + unb);
      });
      sage(!artF.length, "Artikel nach dem folgenden Wort: il libro, l'amico, lo zaino, lo studente, uno psicologo, un'amica, gli spaghetti, degli amici …", artF.slice(0, 6).join(" | "));
      const vsF = [];
      Object.entries(VERSCHMELZUNG_SOLL).forEach(([k, soll]) => {
        const [p, a] = k.split(" ");
        const ist = S.verschmelze(p, a + (a.endsWith("'") ? "amico" : " x"));
        const erwartet = soll + (soll.endsWith("'") ? "amico" : " x");
        if (ist !== erwartet) vsF.push(k + " → " + ist);
      });
      sage(!vsF.length, "alle 35 Verschmelzungen (al, allo, all', alla, ai, agli, alle, del … sulle)", vsF.slice(0, 5).join(" | "));
      // Adjektive vor dem Nomen
      const adjF = [];
      const A = (id) => S.AGGETTIVI.find((a) => a.id === id);
      [[A("bello"), "m", false, "orologio", "bell'"], [A("bello"), "m", false, "libro", "bel"], [A("bello"), "m", true, "fiori", "bei"], [A("bello"), "m", true, "occhi", "begli"],
        [A("bello"), "m", false, "zaino", "bello"], [A("buono"), "m", false, "vino", "buon"], [A("buono"), "f", false, "pizza", "buona"], [A("buono"), "m", false, "spumante", "buono"]]
        .forEach(([a, g, pl, f, soll]) => { const ist = S.adjVorForm(a, g, pl, f); if (ist !== soll) adjF.push(f + ": " + ist + "≠" + soll); });
      [[A("bianco"), "m", true, "bianchi"], [A("bianco"), "f", true, "bianche"], [A("lungo"), "m", true, "lunghi"], [A("vecchio"), "m", true, "vecchi"],
        [A("economico"), "m", true, "economici"], [A("grande"), "f", true, "grandi"], [A("blu"), "f", true, "blu"], [A("fresco"), "f", true, "fresche"]]
        .forEach(([a, g, pl, soll]) => { const ist = S.adjForm(a, g, pl); if (ist !== soll) adjF.push(a.it + ": " + ist + "≠" + soll); });
      sage(!adjF.length, "Adjektive: bel/bell'/bello/bei/begli, buon/buona, bianchi/bianche, lunghi, vecchi, economici, grandi, blu, fresche", adjF.join(" | "));
      // Possessiv bei Verwandten
      const posF = [];
      const si0 = S.subjektInfo(S.SOGGETTI.find((x) => x.id === "io"), "m"), si5 = S.subjektInfo(S.SOGGETTI.find((x) => x.id === "loro"), "m");
      const P = (id) => S.PERSONE.find((x) => x.id === id);
      [[P("madre"), si0, "con", "con mia madre"], [P("madre"), si5, "con", "con la loro madre"], [P("genitori"), si0, "a", "ai miei genitori"],
        [P("ragazzo"), si0, "a", "al mio ragazzo"], [P("amica"), si0, "a", "a un'amica"], [P("nonni"), si0, "da", "dai miei nonni"], [P("marco"), si0, "con", "con Marco"]]
        .forEach(([pe, si, pr, soll]) => { const ist = S.personIt(pe, si, pr); if (ist !== soll) posF.push(ist + "≠" + soll); });
      sage(!posF.length, "Possessiv: con mia madre, con la loro madre, ai miei genitori, al mio ragazzo, a un'amica, dai miei nonni", posF.join(" | "));
      // Deutsche Verben der Bedeutungszeile
      const deF = [];
      const tafel835 = {};
      if (DE.VERBEN) DE.VERBEN.forEach((v) => { tafel835[v.inf] = v; });
      Object.entries(S.DE_VERBEN).forEach(([k, v]) => {
        if (!v) return;
        const ref = tafel835[v.inf];
        const hand = DE_HAND[k];
        if (!v.pref && !v.refl && ref && ref.partizip && !hand) {
          if (ref.partizip !== v.part) deF.push(k + " Partizip " + v.part + "≠" + ref.partizip);
          if (ref.praeteritum && ref.praeteritum[2] !== v.praet[2]) deF.push(k + " Präteritum " + v.praet[2] + "≠" + ref.praeteritum[2]);
          if ((ref.hilfsverb === "sein") !== (v.hilf === "sein")) deF.push(k + " Hilfsverb");
          if (ref.formen && ref.formen.join() !== v.praes.join()) deF.push(k + " Präsens " + v.praes.join(","));
        } else if (hand) {
          const [pt, pa, hi] = hand.split(" ");
          if (v.praet[2] !== pt) deF.push(k + " Präteritum " + v.praet[2] + "≠" + pt);
          if (v.part !== pa.replace(/_/g, " ")) deF.push(k + " Partizip " + v.part + "≠" + pa);
          if ((v.hilf === "sein") !== (hi === "s")) deF.push(k + " Hilfsverb");
        } else if (!ref) deF.push(k + " ungeprüft");
        if (DE_DU[k] && v.praes[1] !== DE_DU[k]) deF.push(k + " du " + v.praes[1] + "≠" + DE_DU[k]);
      });
      sage(!deF.length, "deutsche Verben der Bedeutungszeile: Präsens, Präteritum, Partizip, Hilfsverb (gegen satzbau.js und Handtabelle)", deF.slice(0, 6).join(" | "));
    }
  }

  /* ================================================================ B */
  const lesen = {};
  if (NUR.includes("B")) {
    console.log("\nB · MASSENPRÜFUNG\n");
    if (!da) sage(false, "Engine fehlt");
    else {
      const FIN = {};           // alle finiten Formen je Zeit aus der Handtabelle
      const P2 = (inf, g, pl) => { const p = REF[inf].part; return p.slice(0, -1) + (pl ? (g === "f" ? "e" : "i") : (g === "f" ? "a" : "o")); };
      const ESS = REF.essere, AVE = REF.avere;
      const zusammen = { passato: "presente", trapassato: "imperfetto", condPassato: "condizionale", congPassato: "congiuntivo", congTrapassato: "congImperfetto" };
      /* Zeitangabe → erlaubte Zeitformen, von Hand */
      const ZEIT_SOLL = {
        adesso: "presente condizionale", oggi: "presente passato futuro condizionale", stamattina: "presente passato", stasera: "presente futuro condizionale",
        "oggi pomeriggio": "presente futuro condizionale", domani: "presente futuro condizionale", "domani mattina": "presente futuro condizionale",
        "domani sera": "presente futuro condizionale", dopodomani: "presente futuro condizionale", "la prossima settimana": "presente futuro condizionale",
        "il mese prossimo": "presente futuro condizionale", "l'anno prossimo": "presente futuro condizionale", "fra due giorni": "presente futuro condizionale",
        ieri: "passato imperfetto trapassato condPassato", "ieri sera": "passato imperfetto trapassato condPassato", "ieri mattina": "passato imperfetto trapassato condPassato",
        "l'altro ieri": "passato imperfetto trapassato condPassato", "sabato scorso": "passato imperfetto trapassato condPassato",
        "la settimana scorsa": "passato imperfetto trapassato condPassato", "l'anno scorso": "passato imperfetto trapassato condPassato",
        "ogni giorno": "presente imperfetto", "ogni mattina": "presente imperfetto", "ogni sera": "presente imperfetto", "il sabato": "presente imperfetto",
        "da bambino": "imperfetto", "da bambina": "imperfetto", "da bambini": "imperfetto", "da bambine": "imperfetto", "da tre anni": "presente", "per tre anni": "passato",
      };
      const SPERRE = [
        [/\ba letto con\b/i, "ins Bett mit jemandem"], [/\bdorm\w* [^.?]*\bcon (mi|tu|su|nostr|vostr|il |la |i |le |un|Marco|Giulia)/i, "schlafen mit jemandem"],
        [/\bin bagno con\b/i, "im Bad mit jemandem"], [/\bla doccia con\b/i, "duschen mit jemandem"],
        [/\bda bambin[oaie]\b[^.?]*(\bvino\b|\bbirra\b|\bcaffè\b|lavorav|discoteca|\bbanca\b|in comune)/i, "als Kind Wein/Kaffee/Arbeit"],
        [/\bogni (giorno|mattina|sera)\b[^.?]*(dal medico|dal dentista|in banca|in comune|in questura|all'aeroporto|in ospedale)/i, "jeden Tag zum Arzt/Amt"],
        [/\b(stasera|ieri sera|domani sera|ogni sera)\b[^.?]*colazione/i, "abends frühstücken"],
        [/\b(stamattina|ieri mattina|domani mattina|ogni mattina)\b[^.?]*(\bcen(o|i|a|iamo|ate|ano|ato|at[aie]|avo|avi|ava|erò|erai|erà)\b|in pizzeria|in discoteca|al cinema|a teatro)/i, "morgens Abendessen/Kino"],
        [/\bnon \w+ \w*\s*perché (ho|hai|ha|abbiamo|avete|hanno|avevo|avevi|aveva|avevamo|avevate|avevano) fame/i, "nicht … weil Hunger (bei Essen)"],
        [/\b(rest\w+|sono|sei|è|siamo|siete) a casa perché (fa|faceva|farà) bel tempo/i, "zu Hause, weil schönes Wetter"],
        [/\b(vado|vai|va|andiamo|andate|vanno|sono andat\w|siamo andat\w) (al mare|in piscina|in spiaggia|al lago) perché (piove|pioveva|pioverà)/i, "ans Meer, weil es regnet"],
        [/\bin aereo\b[^.?]*\b(in cucina|al supermercato|in ufficio)\b|\b(in cucina|in bagno|a letto)\b[^.?]*\bin (macchina|treno|aereo|autobus)\b/i, "Verkehrsmittel zum Zimmer"],
        [/\bsempre\b[^.?]*perché/i, "immer … weil (Gewohnheit mit Einzelgrund)"],
        [/\b(la|il) buon[oa]? /i, "der gute … (buono mit bestimmtem Artikel)"],
        [/\bMarco\b[^.?]*\bda Marco\b|\bda Marco\b[^.?]*\bMarco\b(?! )/, "Marco bei Marco"],
        [/\bmai\b[^.?]*perché/i, "nie … weil"],
        [/\bda bambin[oaie]\b[^.?]*(apriv|chiudev|trasferiv)/i, "als Kind öffnete …"],
      ];
      const kaputt = [], deKaputt = [];
      let n = 0;
      const arten = ["aussage", "aussage", "aussage", "frage", "wfrage"];
      const vbs = ["", "perche", "quindi", "se", "quando", "se2", "se3"];
      const einl = ["", "", "", "so_che", "penso_che", "credo_che", "spero_che", "non_credo_che", "importante_che", "pensavo_che", "speravo_che"];
      const t0 = Date.now();
      for (let i = 0; n < 21000 && i < 60000; i++) {
        const lv = S.NIVEAUS[i % 6];
        const kat = S.KATEGORIEN[Math.floor(zufall() * S.KATEGORIEN.length)].id;
        const ex = { satzart: arten[i % arten.length] };
        const vb = vbs[Math.floor(zufall() * vbs.length)];
        if (vb) { ex.mitGrund = true; ex.verbindung = vb; }
        const el = einl[Math.floor(zufall() * einl.length)];
        ex.einleitung = el || false;
        const b = S.zufallsWahl(lv, kat, zufall, ex);
        if (!b) continue;
        n++;
        const w = b.w, it = b.it, de = b.de;
        const f = (grund) => kaputt.push(grund + ": " + it);
        // Satzzeichen, Leerzeichen, Großschreibung
        if (!/^[A-ZÈ]/.test(it)) f("klein am Anfang");
        if (/\s[,.?]|\s\s|,,|\.\.|\?\?/.test(it)) f("Leerzeichen/Zeichen");
        if ((w.satzart === "aussage") !== /\.$/.test(it) || (w.satzart !== "aussage") !== /\?$/.test(it)) f("Satzzeichen zur Satzart");
        if (/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu.test(it)) f("doppeltes Wort");
        // Artikel und Elision
        if (/(?<![\p{L}'])(il|la|lo|una|del|al|nel|dal|sul|della|alla|nella|dalla|sulla) [aeiouàèìòù]/iu.test(it)) f("Artikel vor Vokal ohne Elision");
        if (/\b(il|un|al|del|dal|nel|sul|i|dei|ai|dai|nei|sui) (s[bcdfgmnpqrtv]|z|gn|ps)/i.test(it)) f("il/i vor s impura");
        if (/\b(i|dei|ai|nei|sui) [aeiouàèìòù]/i.test(it)) f("i vor Vokal (gli)");
        if (/\blo [bcdfghlmnpqrtv][aeiouàèìòù]/i.test(it)) f("lo vor einfachem Konsonanten");
        if (/\buno [^sz]/i.test(it) && !/\buno (gn|ps)/i.test(it)) f("uno falsch");
        if (/\b(a|di|da|in|su) (il|lo|la|i|gli|le|l')(\s|$)/i.test(it) || /\b(a|di|da|in|su) l'/i.test(it)) f("Präposition nicht verschmolzen");
        if (/\bun'[^aeiouàèìòù]/i.test(it) || /\bun'(amico|orologio|ombrello|autobus|appartamento)/i.test(it)) f("un' falsch");
        // Pronomen weggelassen
        const soggPron = ["io", "tu", "lui", "lei", "noi", "voi", "loro"].includes(w.soggetto);
        if (soggPron && !w.pronome && !w.einleitung && w.satzart === "aussage" && !w.causa && new RegExp("^" + w.soggetto + "\\b", "i").test(it)) f("Pronomen nicht weggelassen");
        // Verbform laut Tabelle
        const v = S.VERBI.find((x) => x.id === w.verbo);
        const r = REF[v.v.inf];
        const pIdx = { io: 0, tu: 1, lui: 2, lei: 2, noi: 3, voi: 4, loro: 5, marco: 2, giulia: 2, fratello: 2, sorella: 2, genitori: 5, amici: 5 }[w.soggetto];
        const g = S.SOGGETTI.find((x) => x.id === w.soggetto).g || w.genus || "m";
        const pl = pIdx >= 3;
        const zeit = b.itZeit;
        const m = w.modale ? S.MODALI.find((x) => x.id === w.modale) : null;
        const hatWort = (x) => new RegExp("(^|[\\s'])" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=[\\s,.?]|$)", "i").test(it);
        let erwartet = [];
        if (!m) {
          if (zusammen[zeit]) {
            const auxInf = (v.v.rifl || r.aux === "E") ? "essere" : "avere";
            erwartet.push(REF[auxInf][zusammen[zeit]][pIdx]);
            erwartet.push(auxInf === "essere" ? P2(v.v.inf, g, pl) : r.part);
          } else erwartet.push(r[zeit][pIdx]);
        } else {
          const mr = REF[m.v.inf];
          const mz = m.id === "vorrei" ? "condizionale" : zeit;
          if (zusammen[mz]) {
            const auxInf = v.v.rifl ? "avere" : (r.aux === "E" ? "essere" : "avere");
            erwartet.push(REF[auxInf][zusammen[mz]][pIdx]);
            erwartet.push(auxInf === "essere" ? P2(m.v.inf, g, pl) : mr.part);
          } else erwartet.push(mr[mz][pIdx]);
          erwartet.push(v.v.rifl ? v.v.inf.slice(0, -1) + ["mi", "ti", "si", "ci", "vi", "si"][pIdx] : v.v.inf);
        }
        erwartet.forEach((x) => { if (!hatWort(x)) f("Verbform „" + x + "“ fehlt (" + zeit + ")"); });
        if (v.v.rifl && !m && !hatWort(["mi", "ti", "si", "ci", "vi", "si"][pIdx])) f("Reflexivpronomen fehlt");
        // Verneinung: non direkt vor dem Verb(-block)
        if (w.neg) {
          const erstes = erwartet[0];
          const re = new RegExp("(^|\\s)non (mi |ti |si |ci |vi )?" + erstes.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=[\\s,.?]|$)", "i");
          if (!re.test(it)) f("non nicht direkt vor dem Verb");
        }
        if (!w.causa && !w.einleitung && /\bnon\b/i.test(it) && !w.neg) f("non ohne Verneinung");
        // Zeitangabe passt zur Zeitform (Handliste)
        const zt = w.quando ? S.TEMPI.find((t) => t.id === w.quando) : null;
        if (zt && ZEIT_SOLL[zt.it]) {
          const basis = w.verbindung === "se2" && w.causa ? "condizionale" : (w.verbindung === "se3" && w.causa ? "condPassato" : w.tempo);
          if (!ZEIT_SOLL[zt.it].split(" ").includes(basis)) f("Zeitangabe „" + zt.it + "“ passt nicht zu " + basis);
        }
        // Sinn-Sperrliste
        SPERRE.forEach(([re, was]) => { if (re.test(it)) f("Sinn: " + was); });
        // congiuntivo nach dem Auslöser, periodo ipotetico
        if (w.einleitung && /_che$/.test(w.einleitung) && w.einleitung !== "so_che" && !/^cong/.test(zeit) && zeit !== "condizionale") f("kein congiuntivo nach „" + w.einleitung + "“");
        if (w.causa && w.verbindung === "se2" && !/^Se [^,]*\b(fossi|fosse|fossimo|foste|fossero|\w+assi|\w+asse|\w+essi|\w+esse|\w+issi|\w+isse|\w+assimo|\w+essimo|\w+issimo|\w+aste|\w+este|\w+iste|\w+assero|\w+essero|\w+issero)\b/.test(it)) f("se2 ohne congiuntivo imperfetto");
        // Deutsche Zeile
        const g2 = (grund) => deKaputt.push(grund + ": " + de + "  ⟵  " + it);
        if (!/^[A-ZÄÖÜ]/.test(de)) g2("klein am Anfang");
        if (/\s[,.?]|\s\s/.test(de)) g2("Leerzeichen");
        if (/\bnicht kein|\bkein\w* nicht\b/.test(de)) g2("nicht + kein");
        if (/(?<!\p{L})(\p{L}+) \1(?!\p{L})/iu.test(de.replace(/\bdass das\b/, ""))) g2("doppeltes Wort");
        const neben = de.match(/, (weil|dass|wenn|als) [^,.?]+/g) || [];
        neben.forEach((ns) => {
          const woerter = ns.replace(/^, \w+ /, "").split(" ");
          const letztes = woerter[woerter.length - 1];
          if (/^(nicht|gern|heute|morgen|nie|oft|immer|zu|Hause|dem|der|den|die|das)$/.test(letztes)) g2("Verb nicht am Ende im Nebensatz");
        });
        if (w.satzart === "wfrage" && !/^(Was|Wen|Wem|Auf wen|Worauf|Mit wem|Wo|Wohin|Woher|Wann|Wie|Warum)\b/.test(de)) g2("W-Frage ohne Fragewort vorn");
        if (LESEN && (lesen[lv] = lesen[lv] || []).length < 60) lesen[lv].push(it + "  —  " + de);
      }
      sage(n >= 20000, n + " italienische Zufallssätze gebaut (" + Math.round((Date.now() - t0) / 1000) + " s)");
      sage(!kaputt.length, "Italienisch: Artikel, Verschmelzung, Elision, Verbform, Hilfsverb, Angleichung, non, Pronomen, congiuntivo, periodo ipotetico, Zeichen, Zeitangabe, Sinn", kaputt.length + " | " + kaputt.slice(0, 5).join(" || "));
      sage(!deKaputt.length, "Deutsche Bedeutung: Großschreibung, Verb am Ende im Nebensatz, W-Frage, kein „nicht kein“", deKaputt.length + " | " + deKaputt.slice(0, 5).join(" || "));
      if (LESEN) Object.keys(lesen).forEach((lv) => { console.log("\n  --- " + lv + " ---"); lesen[lv].forEach((x) => console.log("  " + x)); });
    }
  }

  /* ================================================================ C */
  if (NUR.includes("C")) {
    console.log("\nC · UNSINN-SPERRE MIT VORSCHLÄGEN\n");
    if (!da || typeof S.vorschlaege !== "function") sage(false, "Engine mit pruefe()/vorschlaege()");
    else {
      const faelle = [
        ["Eis in der Pizzeria", { niveau: "A2", verbo: "mangiare", oggetto: "gelato", luogo: "pizzeria" }],
        ["gestern + Zukunft", { niveau: "A2", verbo: "andare", luogo: "mare", tempo: "futuro", quando: "ieri" }],
        ["Morgen + Vergangenheit", { niveau: "A1", verbo: "andare", luogo: "cinema", tempo: "passato", quando: "domani" }],
        ["ins Bett mit jemandem", { niveau: "A1", verbo: "andare", luogo: "letto", compagnia: "amica" }],
        ["nicht essen, weil hungrig", { niveau: "A2", verbo: "mangiare", oggetto: "pizza", neg: true, causa: "fame" }],
        ["als Kind Wein", { niveau: "A2", verbo: "bere", oggetto: "vino", tempo: "imperfetto", quando: "da_bambino" }],
        ["ich … zusammen (insieme)", { niveau: "A1", verbo: "mangiare", soggetto: "io", modo: "insieme" }],
        ["abends frühstücken", { niveau: "A1", verbo: "fare_colazione", quando: "stasera" }],
        ["mit dem Flugzeug in die Küche", { niveau: "A1", verbo: "andare", luogo: "cucina", mezzo: "aereo" }],
        ["seit drei Jahren + Vergangenheit", { niveau: "B1", verbo: "abitare", luogo: "roma", tempo: "passato", quando: "da_tre_anni" }],
        ["jeden Tag zum Arzt", { niveau: "A2", verbo: "andare", luogo: "medico", quando: "ogni_giorno" }],
        ["Brot in der Apotheke kaufen", { niveau: "A2", verbo: "comprare", oggetto: "pane", det: "part", luogo: "farmacia" }],
        ["Wein im Büro", { niveau: "A1", verbo: "bere", oggetto: "vino", luogo: "ufficio" }],
        ["condizionale ohne Anlass", { niveau: "B1", verbo: "compilare", oggetto: "modulo", tempo: "condizionale" }],
        ["zu viele Angaben", { niveau: "B1", verbo: "andare", luogo: "cinema", quando: "stasera", compagnia: "amici", mezzo: "autobus", modo: "volentieri", causa: "tempo", verbindung: "se", tempo: "presente" }],
        ["Penso che + io", { niveau: "B2", verbo: "andare", luogo: "mare", einleitung: "penso_che", soggetto: "io" }],
        ["ma ohne Gegensatz", "geschichte"],
      ];
      faelle.forEach(([name, w]) => {
        if (w === "geschichte") {
          const g = S.geschichte([{ w: { niveau: "A1", verbo: "restare", luogo: "casa", soggetto: "io" } }, { w: { niveau: "A1", verbo: "leggere", oggetto: "libro", det: "indef", soggetto: "io" }, binder: "ma" }]);
          const g2 = S.geschichte([{ w: { niveau: "A1", verbo: "restare", luogo: "casa", soggetto: "io" } }, { w: { niveau: "A1", verbo: "leggere", oggetto: "libro", det: "indef", soggetto: "io" }, binder: "e" }]);
          sage(!g.ok && g2.ok, "„" + name + "“ gesperrt, mit „e“ geht es", (g.text || "") + " / " + (g2.it || ""));
          return;
        }
        const pr = S.pruefe(w);
        const vs = S.vorschlaege(w);
        const alleGut = vs.every((x) => S.pruefe(x.w).ok && x.it && x.de);
        sage(!pr.ok && vs.length >= 2 && vs.length <= 3 && alleGut, "„" + name + "“ gesperrt: " + (pr.probleme[0] ? pr.probleme[0].text : "") , vs.map((x) => x.it).join(" · "));
      });
      // Jede Angebotsliste führt zu einem gültigen Satz (geführtes Bauen)
      let versuche = 0, schlecht = [];
      for (let i = 0; i < 1500; i++) {
        const lv = S.NIVEAUS[i % 6];
        const b = S.zufallsWahl(lv, S.KATEGORIEN[i % 10].id, zufall, {});
        if (!b) continue;
        const felder = ["oggetto", "luogo", "quando", "modo", "compagnia", "mezzo", "persona", "causa", "modale"];
        const f = felder[i % felder.length];
        S.angebote(b.w, f).slice(0, 6).forEach((x) => {
          versuche++;
          const w2 = Object.assign({}, b.w, { [f]: x.id });
          if (f === "oggetto") { w2.det = ""; w2.agg = ""; }
          const r = S.pruefe(w2);
          if (!r.ok && !r.probleme.every((p) => p.feld === "zuviel")) schlecht.push(f + "=" + x.id + " bei " + b.it + " → " + r.probleme.map((p) => p.feld).join(","));
        });
      }
      sage(versuche > 2000 && !schlecht.length, versuche + " angebotene Bausteine zu fertigen Sätzen: jedes Angebot passt (sonst wäre es nicht angeboten)", schlecht.slice(0, 3).join(" || "));
    }
  }

  /* ================================================================ D */
  if (NUR.includes("D")) {
    console.log("\nD · OBERFLÄCHE\n");
    await oberflaeche();
  }

  console.log("\nFassung 839 (italienischer Satzbaukasten): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})();

async function oberflaeche() {
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg" };
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const seite = async (vp, telefon) => {
    const pg = await br.newPage({ viewport: vp, deviceScaleFactor: telefon ? 2 : 1, hasTouch: !!telefon, isMobile: !!telefon });
    pg.setDefaultTimeout(90000);
    pg.fehler = [];
    pg.on("pageerror", (e) => pg.fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
    await pg.goto(basis, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.Satzbau && window.ExerciseData && document.querySelector(".tape-tab[data-target=view-learn]"), null, { timeout: 90000 });
    await pg.waitForTimeout(400);
    return pg;
  };
  const layout = (pg, sel) => pg.evaluate((sel) => {
    const area = document.querySelector(sel);
    if (!area) return { fehlt: true };
    const knoepfe = [...area.querySelectorAll("button, summary")].filter((b) => b.offsetParent && b.getBoundingClientRect().width > 0);
    const zuKlein = knoepfe.filter((b) => { const r = b.getBoundingClientRect(); return r.height < 30 || r.width < 30; }).map((b) => b.textContent.trim().slice(0, 20) + " " + Math.round(b.getBoundingClientRect().height));
    const rs = knoepfe.map((b) => b.getBoundingClientRect());
    const ueber = [];
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
      const a = rs[i], c = rs[j];
      const x = Math.min(a.right, c.right) - Math.max(a.left, c.left), y = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
      if (x > 2 && y > 2 && !knoepfe[i].contains(knoepfe[j]) && !knoepfe[j].contains(knoepfe[i])) ueber.push(knoepfe[i].textContent.trim().slice(0, 16) + " / " + knoepfe[j].textContent.trim().slice(0, 16));
    }
    const raus = [...area.querySelectorAll("p, span, div, button")].filter((e) => e.offsetParent && e.getBoundingClientRect().right > innerWidth + 1).map((e) => e.className || e.tagName).slice(0, 4);
    return { zuKlein, ueber, breit: document.documentElement.scrollWidth, fenster: innerWidth, raus, anzahl: knoepfe.length };
  }, sel);
  const italienischRaum = async (pg, owner) => pg.evaluate(async (owner) => {
    Backend.isOwner = () => owner;
    Backend.currentUser = () => ({ id: "xander" });
    if (typeof window.__dmaLernraum === "function") window.__dmaLernraum("it");
    else ExerciseData.setLernraum("it");
    document.body.classList.add("lernraum-it");
    document.querySelector(".tape-tab[data-target=view-learn]").click();
    await new Promise((r) => setTimeout(r, 200));
    const pill = document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-it"]');
    if (pill) pill.click();
    await new Promise((r) => setTimeout(r, 1500));
    return Boolean(pill);
  }, owner);
  try {
    /* 1. Deutsch-Raum: kein Italienisch, deutscher Baukasten wie gehabt */
    const pg = await seite({ width: 360, height: 780 }, true);
    await pg.evaluate(() => { document.querySelector(".tape-tab[data-target=view-learn]").click(); document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]').click(); });
    await pg.waitForFunction(() => document.querySelector("#satzbaukastenDeArea .baustein-satz"), null, { timeout: 30000 });
    const deRaum = await pg.evaluate(() => ({
      itGeladen: Boolean(window.SatzbauIt),
      text: document.getElementById("satzbaukastenDeArea").innerText,
    }));
    const itWoerter = /\b(sono|andato|perché|vado|della|nella|dalla|mangio|domani|ieri|stasera|con mia|il mio|gli|perch)\b/;
    sage(!deRaum.itGeladen, "im Deutsch-Raum wird der italienische Baukasten gar nicht geladen");
    sage(!itWoerter.test(deRaum.text), "im Deutsch-Raum kein italienisches Wort im Satzbaukasten", (deRaum.text.match(itWoerter) || [""])[0]);

    /* 2. Deutsch-Raum: Sperre mit Vorschlägen im deutschen Baukasten */
    const dk = (s) => pg.evaluate((s) => { const e = document.querySelector("#satzbaukastenDeArea " + s); if (!e) return false; e.click(); return true; }, s);
    await dk('[data-sbk-niveau="A2"]'); await dk('[data-sbk-kat="alle"]');
    await dk('[data-sbk-feld="verb"][data-sbk-wert="sein"]');
    await dk('[data-sbk-feld="ort"][data-sbk-wert="berge"]');
    await dk('[data-sbk-zeitform="praesens"]');
    await dk('[data-sbk-feld="zeit"][data-sbk-wert="gestern"]');
    let sperre = await pg.evaluate(() => { const h = document.querySelector("#satzbaukastenDeArea [data-sbk-sperre]"); return h ? { text: h.innerText, vorschlaege: h.querySelectorAll("[data-sbk-vorschlag]").length } : null; });
    if (!sperre) {
      /* „gestern“ gibt es im Präsens nicht als Knopf — die Sperre entsteht, wenn man danach die Zeitform wechselt */
      await dk('[data-sbk-zeitform="vergangenheit"]'); await dk('[data-sbk-feld="zeit"][data-sbk-wert="gestern"]'); await dk('[data-sbk-zeitform="futur"]');
      sperre = await pg.evaluate(() => { const h = document.querySelector("#satzbaukastenDeArea [data-sbk-sperre]"); return h ? { text: h.innerText, vorschlaege: h.querySelectorAll("[data-sbk-vorschlag]").length } : null; });
    }
    sage(Boolean(sperre) && /komisch|passt nicht/i.test(sperre.text) && sperre.vorschlaege >= 2 && sperre.vorschlaege <= 3, "deutscher Baukasten: Zeitform passt nicht zur Zeitangabe → Hinweis „klingt komisch“ mit 2–3 Vorschlägen", sperre ? sperre.text.replace(/\s+/g, " ").slice(0, 140) : "kein Hinweis");
    if (sperre) {
      await pg.evaluate(() => document.querySelector("#satzbaukastenDeArea [data-sbk-vorschlag]").click());
      const nach = await pg.evaluate(() => ({ satz: (document.querySelector("#satzbaukastenDeArea .sbk-klebe .baustein-satz") || {}).textContent || "", sperre: Boolean(document.querySelector("#satzbaukastenDeArea [data-sbk-sperre]")) }));
      sage(!nach.sperre && nach.satz.length > 5, "Tipp auf einen Vorschlag baut diesen Satz", nach.satz.replace(/\s+/g, " "));
    }
    if (BILD) await (await pg.$("#satzbaukastenDeArea")).screenshot({ path: BILD + "-de-360.png" });

    /* 3. Italienisch-Raum ohne Berechtigung: nichts */
    const pgN = await seite({ width: 360, height: 780 }, true);
    const nichtOwner = await pgN.evaluate(async () => {
      Backend.isOwner = () => false;
      return { darf: typeof darfItalienischraum === "function" ? darfItalienischraum() : null };
    });
    await italienischRaum(pgN, false);
    const nichtOwnerIt = await pgN.evaluate(() => ({ text: (document.getElementById("satzbaukastenItArea") || {}).innerText || "", sbit: Boolean(window.SatzbauIt) }));
    sage(!/Satzbaukasten auf Italienisch|italiano/.test(nichtOwnerIt.text) && !nichtOwnerIt.sbit, "ohne Freigabe kein italienischer Baukasten (auch nicht bei gesetztem Lernraum)", nichtOwnerIt.text.slice(0, 80));
    await pgN.close();

    /* 4. Italienisch-Raum als Betreiber */
    await italienischRaum(pg, true);
    await pg.waitForFunction(() => window.SatzbauIt && document.querySelector("#satzbaukastenItArea .baustein-satz"), null, { timeout: 30000 }).catch(() => {});
    const it1 = await pg.evaluate(() => {
      const a = document.getElementById("satzbaukastenItArea");
      return { da: Boolean(a && a.querySelector(".baustein-satz")), satz: ((a && a.querySelector(".sbk-klebe .baustein-satz")) || {}).textContent || "",
        de: ((a && a.querySelector(".baustein-satz-de")) || {}).textContent || "", hinweis: ((a && a.querySelector(".sbk-hinweis")) || {}).textContent || "" };
    });
    sage(it1.da && /[a-zàèìòù]/.test(it1.satz), "Italienisch-Raum (Betreiber): italienischer Satz wird gebaut", it1.satz.replace(/\s+/g, " "));
    sage(/[A-ZÄÖÜ]/.test(it1.de) && it1.de !== it1.satz, "darunter steht die deutsche Bedeutung", it1.de.replace(/\s+/g, " "));
    sage(/[äöüß]|\b(die|der|das|steht|Verb|zeigt)\b/.test(it1.hinweis), "Erklärung auf Deutsch", it1.hinweis.slice(0, 80));
    const ik = (s) => pg.evaluate((s) => { const e = document.querySelector("#satzbaukastenItArea " + s); if (!e) return false; e.click(); return true; }, s);
    const itSatz = () => pg.evaluate(() => ({ it: ((document.querySelector("#satzbaukastenItArea .sbk-klebe .baustein-satz")) || {}).textContent || "",
      de: ((document.querySelector("#satzbaukastenItArea .baustein-satz-de")) || {}).textContent || "" }));
    await ik('[data-sit-niveau="A2"]'); await ik('[data-sit-kat="alle"]');
    await ik('[data-sit-feld="soggetto"][data-sit-wert="io"]'); await ik('[data-sit-feld="genus"][data-sit-wert="f"]');
    await ik('[data-sit-feld="verbo"][data-sit-wert="andare"]');
    await ik('[data-sit-feld="luogo"][data-sit-wert="mare"]');
    await ik('[data-sit-feld="tempo"][data-sit-wert="passato"]');
    await ik('[data-sit-feld="quando"][data-sit-wert="ieri"]');
    await ik('[data-sit-feld="compagnia"][data-sit-wert="sorella"]');
    await ik('[data-sit-feld="mezzo"][data-sit-wert=""]'); await ik('[data-sit-feld="modo"][data-sit-wert=""]'); await ik('[data-sit-feld="causa"][data-sit-wert=""]');
    const s1 = await itSatz();
    sage(/Ieri sono andata al mare con mia sorella\./.test(s1.it.replace(/\s+/g, " ")) && /Gestern bin ich mit meiner Schwester ans Meer gefahren\./.test(s1.de), "„Ieri sono andata al mare con mia sorella.“ — Gestern bin ich mit meiner Schwester ans Meer gefahren.", s1.it.replace(/\s+/g, " ") + " / " + s1.de);
    // Konflikt: Zeitform auf Zukunft → gestern passt nicht
    await ik('[data-sit-feld="tempo"][data-sit-wert="futuro"]');
    const sp = await pg.evaluate(() => { const h = document.querySelector("#satzbaukastenItArea [data-sit-sperre]"); return h ? { text: h.innerText, n: h.querySelectorAll("[data-sit-vorschlag]").length, satz: Boolean(document.querySelector("#satzbaukastenItArea .sbk-klebe .baustein-satz")) } : null; });
    sage(Boolean(sp) && sp.n >= 2 && sp.n <= 3 && /komisch/i.test(sp.text) && !sp.satz, "Italienisch: „ieri“ + futuro → gesperrt, Hinweis „klingt komisch – meintest du …?“ mit 2–3 Vorschlägen, kein falscher Satz", sp ? sp.text.replace(/\s+/g, " ").slice(0, 160) : "kein Hinweis");
    if (BILD) await (await pg.$("#satzbaukastenItArea")).screenshot({ path: BILD + "-it-360-sperre.png" });
    if (sp) await pg.evaluate(() => document.querySelector("#satzbaukastenItArea [data-sit-vorschlag]").click());
    const s2 = await itSatz();
    sage(s2.it.length > 5 && !(await pg.evaluate(() => Boolean(document.querySelector("#satzbaukastenItArea [data-sit-sperre]")))), "Vorschlag angetippt → gültiger Satz", s2.it.replace(/\s+/g, " "));
    // Geführtes Bauen: nach „mangiare“ nur Essbares
    await ik('[data-sit-feld="verbo"][data-sit-wert="mangiare"]');
    const essbar = await pg.evaluate(() => [...document.querySelectorAll('#satzbaukastenItArea [data-sit-feld="oggetto"]')].map((b) => b.dataset.sitWert).filter(Boolean));
    sage(essbar.length > 5 && !essbar.some((x) => ["chiavi", "vino", "libro", "macchina", "caffe"].includes(x)), "nach „mangiare“ werden nur Speisen angeboten (" + essbar.length + ")", essbar.slice(0, 8).join(","));
    // + zweiter Satz
    await ik('[data-sit-feld="oggetto"][data-sit-wert="pizza"]');
    const plus = await ik("#sitPlusSatz");
    await ik('[data-sit-binder="poi"]');
    await ik('[data-sit-feld="verbo"][data-sit-wert="andare"]');
    await ik('[data-sit-feld="luogo"][data-sit-wert="cinema"]');
    const g = await itSatz();
    sage(plus && /, poi /.test(g.it) && /, dann /.test(g.de), "zwei Sätze mit „poi“ (dann)", g.it.replace(/\s+/g, " ") + " / " + g.de);
    if (BILD) await (await pg.$("#satzbaukastenItArea")).screenshot({ path: BILD + "-it-360.png" });
    const l360 = await layout(pg, "#satzbaukastenItArea");
    sage(!l360.fehlt && l360.breit <= l360.fenster, "360 px: keine waagrechte Rollleiste", l360.breit + "/" + l360.fenster);
    sage(!l360.fehlt && !l360.zuKlein.length, "360 px: alle " + (l360.anzahl || 0) + " Tippflächen ≥ 30 px", (l360.zuKlein || []).slice(0, 4).join(" | "));
    sage(!l360.fehlt && !l360.ueber.length, "360 px: nichts überlappt", (l360.ueber || []).slice(0, 3).join(" | "));
    sage(!pg.fehler.length, "keine Seitenfehler (360)", pg.fehler.slice(0, 2).join(" | "));
    // zurück in den Deutsch-Raum: Italienisch verschwindet
    await pg.evaluate(() => { if (typeof window.__dmaLernraum === "function") window.__dmaLernraum("de"); else ExerciseData.setLernraum("de"); document.body.classList.remove("lernraum-it"); document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]').click(); });
    await pg.waitForTimeout(500);
    const zurueck = await pg.evaluate(() => document.getElementById("satzbaukastenDeArea").innerText);
    sage(!itWoerter.test(zurueck), "zurück im Deutsch-Raum: wieder kein Italienisch");
    await pg.close();

    const pg2 = await seite({ width: 1280, height: 800 }, false);
    await italienischRaum(pg2, true);
    await pg2.waitForFunction(() => document.querySelector("#satzbaukastenItArea .baustein-satz"), null, { timeout: 30000 }).catch(() => {});
    if (BILD) await (await pg2.$("#satzbaukastenItArea")).screenshot({ path: BILD + "-it-1280.png" });
    const l1280 = await layout(pg2, "#satzbaukastenItArea");
    sage(!l1280.fehlt && !l1280.ueber.length && l1280.breit <= l1280.fenster, "1280 px: nichts überlappt, keine Rollleiste", (l1280.ueber || []).slice(0, 2).join(" | "));
    sage(!pg2.fehler.length, "keine Seitenfehler (1280)", pg2.fehler.slice(0, 2).join(" | "));
    await pg2.close();
  } catch (e) { sage(false, "Oberfläche lässt sich bedienen", String(e.message || e).split("\n")[0]); }
  await br.close(); srv.close();
}
