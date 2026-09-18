/* MACHT AUS DER EDGE-FUNCTION EINE SCHLANKE FASSUNG ZUM HOCHLADEN.
   ---------------------------------------------------------------
   Die Datei supabase/functions/klassenzimmer/index.ts ist der
   Ursprung — dort stehen die langen Erklaerungen, warum etwas so
   ist, wie es ist. Beim Hochladen zu Supabase braucht es die nicht:
   dort zaehlt nur, was die Funktion TUT.

   Dieses Werkzeug entfernt deshalb NUR Kommentarbloecke, die laenger
   als 260 Zeichen sind. Am Code aendert es nichts — sonst liefe das
   Hochgeladene irgendwann anders als das, was im Ordner steht, und
   niemand wuesste mehr, welches von beiden stimmt.

   Aufruf:  node werkzeug/kz-knapp.js  →  /tmp/kz-knapp.ts
   Danach die Ausgabe hochladen (Supabase, Edge Functions). */
const fs = require("fs");
const quelle = "/home/user/Deutsch-Mit-Xander/supabase/functions/klassenzimmer/index.ts";
const s = fs.readFileSync(quelle, "utf8");
const knapp = s.replace(/\/\*[\s\S]*?\*\//g, (m) => (m.length > 260 ? "" : m))
               .replace(/\n{3,}/g, "\n\n");
/* Zur Sicherheit: dieselben Funktionen muessen noch da sein. */
["monatsverbrauch", "budget-erschoepft", "budget-setzen", "vonCloudflare", "MB_JE_AUSGABE"]
  .forEach((w) => { if (knapp.indexOf(w) < 0) throw new Error("Im Kurzschnitt fehlt: " + w); });
fs.writeFileSync("/tmp/kz-knapp.ts", knapp);
console.log("voll " + s.length + " → knapp " + knapp.length + "  (/tmp/kz-knapp.ts)");
