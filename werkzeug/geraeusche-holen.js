#!/usr/bin/env node
/* HOLT ECHTE GERAEUSCHE FUER DIE ANIMATIONEN — sparsam.

   GEWUENSCHT: „Koennen wir eigentlich was machen wegen den Sounds,
   dass wir den Orkan und so — dass wir da realistische Sounds dafuer
   bekommen? Wenn du das Opus Format nimmst, ist es klein."

   Die Toene in der Seite sind bisher Sinuswellen aus dem Browser:
   gratis, sofort da, aber eben synthetisch. Hier kommen echte
   Geraeusche dazu. Sie werden EINMAL erzeugt und liegen danach als
   Datei im Haus — jedes Abspielen ist gratis.

   SPARSAMKEIT, ausdruecklich gewuenscht („verbrenn keine Credits"):
     * jede Datei nur, wenn sie noch nicht da ist;
     * kurz (2 bis 4 Sekunden);
     * danach auf Opus mit 24 kbit/s heruntergerechnet — das ergibt
       etwa 8 bis 15 Kilobyte je Geraeusch.

   AUFRUF:
       ELEVEN_KEY=... node werkzeug/geraeusche-holen.js [nur-dieser-name]
   Der Schluessel steht NIE in einer Datei im Repo.
*/
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SCHLUESSEL = process.env.ELEVEN_KEY || "";
if (!SCHLUESSEL) { console.error("Kein ELEVEN_KEY gesetzt."); process.exit(1); }

const WURZEL = path.dirname(__dirname);
const ZIEL = path.join(WURZEL, "ton");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";

/* Was gebraucht wird — der Name ist der Name der WIRKUNG in app.js. */
const GERAEUSCHE = [
  { name: "orkan",     dauer: 4, text: "Strong howling storm wind gusting through a narrow street, continuous, no music, no voices" },
  { name: "gewitter",  dauer: 4, text: "A single close thunderclap with a long rolling rumble afterwards, distant rain, no music" },
  { name: "regen",     dauer: 4, text: "Steady rain falling on a window and pavement, soft and continuous, no music, no voices" },
  { name: "feuerwerk", dauer: 3, text: "Two fireworks rockets launching and bursting overhead with crackling sparks, outdoors, no music" },
  { name: "glasbruch", dauer: 2, text: "A pane of glass shattering into many pieces on a hard floor, single impact, no music" },
  { name: "dino",      dauer: 3, text: "A huge dinosaur roar, deep and guttural, ending in a growl, no music" },
  { name: "pirat",     dauer: 4, text: "Wooden sailing ship creaking on ocean waves, rope rigging, one distant seagull, no music" },
  { name: "route66",   dauer: 3, text: "A V8 muscle car approaching at speed on an empty desert road and passing by, no music" },
  { name: "schuss",    dauer: 2, text: "Two gunshots in an open space with a short echo, no music, no voices" },
  { name: "prunk",     dauer: 3, text: "Magical sparkling chime rising, a soft whoosh and glittering bells, celebratory, no voices" },
  { name: "katze",     dauer: 2, text: "A small kitten meowing twice, close up, soft, no music" },
  { name: "enten",     dauer: 3, text: "A duck family quacking by a pond, small splashes of water, outdoors, no music" },
  /* ZWEITE RUNDE — ausdruecklich gewuenscht: „Mach bitte alle
     Geraeusche nach eigenem Ermessen: realistisches Rennauto, und wenn
     man eine Geschenkbox oeffnet, dass so ein Jubel kommt. Bei der
     Fratze ein fieses Lachen. Beim Stromausfall so ein Bratzeln, wie
     wenn die Gluehbirne durchbrennt, und dann der Schalter mit der
     Taschenlampe. Bei Weihnachten etwas Festliches." */
  { name: "rennauto",  dauer: 3, text: "A race car engine revving hard and accelerating past the listener, tyres on asphalt, no music" },
  { name: "kitt",      dauer: 3, text: "A powerful 1980s sports car idling then accelerating away, deep V8 rumble, no music" },
  { name: "jubel",     dauer: 3, text: "A small crowd cheering and applauding warmly, happy voices, short burst, no music" },
  { name: "geschenk",  dauer: 3, text: "Gift wrapping paper tearing open, a party popper, then a short cheerful cheer, no music" },
  { name: "konfetti",  dauer: 2, text: "A party popper bursting and confetti fluttering down, no music" },
  { name: "ballon",    dauer: 2, text: "Several balloons squeaking and rising, one gentle pop, no music" },
  { name: "fratze",    dauer: 3, text: "An evil demonic laugh, deep and distorted, echoing in a large empty hall, horror, no music" },
  { name: "halloween", dauer: 3, text: "Creepy horror ambience: a distant creaking door, whispering wind, a single low tone, no music" },
  { name: "schloss",   dauer: 4, text: "A huge heavy iron gate creaking open slowly, cold wind rushing through a stone hall, no music" },
  { name: "tore",      dauer: 3, text: "Two massive wooden doors slamming shut and a heavy iron bolt sliding into place, no music" },
  { name: "finsternis",dauer: 3, text: "An electrical short circuit crackling, a light bulb popping, silence, then a torch switch clicking on, no music" },
  { name: "erdbeben",  dauer: 4, text: "A deep earthquake rumble with objects rattling and creaking walls, no music" },
  { name: "vulkan",    dauer: 4, text: "A volcano erupting: deep explosive boom, rumbling ground, falling debris, no music" },
  { name: "armageddon",dauer: 4, text: "Apocalyptic impact: a huge distant explosion, rolling shockwave, debris raining down, no music" },
  { name: "weihnachten",dauer: 3, text: "Sleigh bells jingling merrily in the snow, festive and warm, no singing, no music bed" },
  { name: "lagerfeuer",dauer: 4, text: "A campfire crackling and popping quietly at night, occasional cricket, no music" },
  { name: "aquarium",  dauer: 4, text: "Underwater ambience with rising air bubbles, calm and muffled, no music" },
  { name: "handdurch", dauer: 2, text: "Wood splintering and tearing apart violently, a single sharp crack, no music" },
  { name: "jalousie",  dauer: 2, text: "Venetian window blinds rattling and being pulled up quickly, no music" },
  { name: "paintball", dauer: 2, text: "Three paintballs splattering wetly against a hard surface in quick succession, no music" },
  { name: "sternschnuppe", dauer: 2, text: "A soft magical whoosh of a shooting star passing, airy and sparkling, no music" },
  { name: "spinnen",   dauer: 3, text: "Creepy skittering of many small legs on a hard surface, eerie tension, horror, no music" },
  { name: "matrix",    dauer: 3, text: "Digital data stream: rapid electronic clicks and low synthetic hum, cyber, no melody" },
  { name: "sintflut",  dauer: 4, text: "Torrential rain and rushing water flooding, heavy downpour, no music" }
];

function schlafen(ms) { return new Promise((f) => setTimeout(f, ms)); }

async function holen(g) {
  const fertig = path.join(ZIEL, g.name + ".opus");
  const fertigAac = path.join(ZIEL, g.name + ".m4a");
  if (fs.existsSync(fertig) && fs.existsSync(fertigAac)) { console.log("  schon da:  " + g.name); return "da"; }
  const antwort = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: { "xi-api-key": SCHLUESSEL, "Content-Type": "application/json" },
    body: JSON.stringify({ text: g.text, duration_seconds: g.dauer, prompt_influence: 0.45 })
  });
  if (!antwort.ok) {
    console.log("  FEHLER " + antwort.status + ": " + g.name + "  " + (await antwort.text()).slice(0, 160));
    return "fehler";
  }
  const roh = Buffer.from(await antwort.arrayBuffer());
  const zwischen = path.join("/tmp", "geraeusch-" + g.name + ".mp3");
  fs.writeFileSync(zwischen, roh);
  /* Klein rechnen: mono, 24 kHz, Opus mit 24 kbit/s. Dazu die Lautheit
     angleichen, damit nicht ein Geraeusch brüllt und das naechste
     fluestert. */
  execFileSync(FFMPEG, ["-y", "-i", zwischen,
    "-af", "loudnorm=I=-18:TP=-2:LRA=11",
    "-c:a", "libopus", "-b:a", "24k", "-ac", "1", "-ar", "24000",
    fertig], { stdio: "pipe" });
  /* ZWEITE FASSUNG IN AAC — und die ist kein Luxus: Safari auf dem
     iPhone spielt Opus je nach Fassung NICHT. Wer nur Opus ablegt,
     baut eine Datei, die ausgerechnet auf seinem Geraet stumm
     bleibt. Die Seite fragt den Browser und nimmt, was er kann. */
  execFileSync(FFMPEG, ["-y", "-i", zwischen,
    "-af", "loudnorm=I=-18:TP=-2:LRA=11",
    "-c:a", "aac", "-b:a", "40k", "-ac", "1", "-ar", "24000",
    fertigAac], { stdio: "pipe" });
  fs.unlinkSync(zwischen);
  const kb = (fs.statSync(fertig).size / 1024).toFixed(1);
  const kbA = (fs.statSync(fertigAac).size / 1024).toFixed(1);
  console.log("  neu:       " + g.name + "  Opus " + kb + " kB / AAC " + kbA + " kB");
  return "neu";
}

(async () => {
  fs.mkdirSync(ZIEL, { recursive: true });
  const nur = process.argv[2];
  let neu = 0, fehler = 0;
  for (const g of GERAEUSCHE) {
    if (nur && g.name !== nur) continue;
    const r = await holen(g);
    if (r === "neu") { neu++; await schlafen(900); }
    if (r === "fehler") fehler++;
  }
  console.log("\n" + neu + " neu erzeugt, " + fehler + " Fehler.");
  /* Die Liste fuer die Seite schreiben — wie bei den Aufnahmen. */
  const da = GERAEUSCHE.filter((g) => fs.existsSync(path.join(ZIEL, g.name + ".opus")))
    .map((g) => g.name);
  fs.writeFileSync(path.join(WURZEL, "data-geraeusche.js"),
    "/* =========================================================\n"
    + "   WELCHE ECHTEN GERAEUSCHE ES GIBT\n"
    + "   ---------------------------------------------------------\n"
    + "   Geschrieben von werkzeug/geraeusche-holen.js — nicht von\n"
    + "   Hand aendern. Steht ein Name hier, sucht die Seite\n"
    + "   ton/<name>.opus; steht er nicht da, klingt wie bisher der\n"
    + "   synthetische Ton aus dem Browser.\n"
    + "   ========================================================= */\n"
    + "window.DMA_GERAEUSCHE = \"" + da.join("|") + "\";\n");
  console.log(da.length + " Geraeusche stehen in data-geraeusche.js");
})();
