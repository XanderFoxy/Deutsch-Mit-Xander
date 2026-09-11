/* =========================================================
   BILDVERWALTUNG
   ---------------------------------------------------------
   GEWÜNSCHT: „du kannst mir gerne auch einen Bereich auf der
   Webseite geben, wo ich die Möglichkeit habe, kleine PNG-Files
   für die einzelnen Bereiche hochzuladen — nicht in den Bildern
   selber, sondern in den Einstellungen, wo ich eine Art
   Bildverwaltung habe für sämtliche SVG-Grafiken auf der Seite …
   das ich immer wieder rausnehmen kann und verwalten kann."

   Also: Zu jedem gezeichneten Ding in der Bilderwelt kann ein
   eigenes Bild hochgeladen werden — ein durchsichtiges PNG, ein
   GIF, ein WebP. Es wird nur DARÜBER gelegt. Die gezeichnete
   Fassung bleibt unangetastet in data-szenen.js liegen und kommt
   sofort zurück, sobald man das eigene Bild wieder herausnimmt.

   Wo liegen die Bilder? In der IndexedDB dieses Geräts, nicht im
   Konto. Ein Bild ist schnell ein paar hundert Kilobyte groß —
   das gehört nicht in den Speicher, der für Punkte und Trophäen
   da ist. Deshalb: eigenes Gerät, eigene Bilder.
   ========================================================= */
const Bildverwaltung = (() => {
  const DB_NAME = "dma-bilder";
  const LADEN = "bilder";
  const MAX_BYTES = 400 * 1024;      // 400 kB pro Bild — es sind Platzhalter
  const ERLAUBT = ["image/png", "image/gif", "image/webp", "image/jpeg", "image/svg+xml"];

  let db = null;
  const cache = new Map();           // id -> dataUrl (für das Zeichnen ohne Warten)
  let bereit = false;

  function oeffnen() {
    return new Promise((ok, fehl) => {
      if (db) return ok(db);
      if (!("indexedDB" in window)) return fehl(new Error("Dieses Gerät kann keine Bilder ablegen."));
      const anfrage = indexedDB.open(DB_NAME, 1);
      anfrage.onupgradeneeded = () => {
        const d = anfrage.result;
        if (!d.objectStoreNames.contains(LADEN)) d.createObjectStore(LADEN);
      };
      anfrage.onsuccess = () => { db = anfrage.result; ok(db); };
      anfrage.onerror = () => fehl(anfrage.error);
    });
  }

  function lauf(modus, arbeit) {
    return oeffnen().then((d) => new Promise((ok, fehl) => {
      const t = d.transaction(LADEN, modus);
      const s = t.objectStore(LADEN);
      const a = arbeit(s);
      t.oncomplete = () => ok(a && a.result !== undefined ? a.result : undefined);
      t.onerror = () => fehl(t.error);
    }));
  }

  /* Beim Start alles einmal in den Speicher holen. Danach kann das
     Zeichnen ohne Warten entscheiden, ob ein Ding ein eigenes Bild hat. */
  async function laden() {
    if (bereit) return;
    try {
      const d = await oeffnen();
      await new Promise((ok) => {
        const t = d.transaction(LADEN, "readonly");
        const s = t.objectStore(LADEN);
        const c = s.openCursor();
        c.onsuccess = () => {
          const z = c.result;
          if (!z) return ok();
          cache.set(z.key, z.value);
          z.continue();
        };
        c.onerror = () => ok();
      });
    } catch (e) { /* ohne IndexedDB bleibt einfach alles gezeichnet */ }
    bereit = true;
  }

  const hat = (id) => cache.has(id);
  const bild = (id) => cache.get(id) || null;
  const anzahl = () => cache.size;

  async function speichern(id, dataUrl) {
    cache.set(id, dataUrl);
    try { await lauf("readwrite", (s) => s.put(dataUrl, id)); } catch (e) { /* nur im Speicher */ }
  }

  async function entfernen(id) {
    cache.delete(id);
    try { await lauf("readwrite", (s) => s.delete(id)); } catch (e) { /* egal */ }
  }

  async function entferneAlle(praefix) {
    const raus = [...cache.keys()].filter((k) => !praefix || k.startsWith(praefix));
    for (const k of raus) await entfernen(k);
    return raus.length;
  }

  /* Eine Datei einlesen und dabei auf eine vernünftige Größe bringen.
     Ein Foto vom Telefon hat leicht 4000 Pixel Kantenlänge — als
     Platzhalter in einem 320 Pixel breiten Bild ist das Unsinn und
     würde die Seite nur langsam machen. GIFs bleiben unangetastet,
     sonst verlören sie ihre Bewegung. */
  function einlesen(datei) {
    return new Promise((ok, fehl) => {
      if (!datei) return fehl(new Error("Keine Datei gewählt."));
      if (ERLAUBT.indexOf(datei.type) < 0) {
        return fehl(new Error("Erlaubt sind PNG, GIF, WebP, JPG und SVG."));
      }
      const leser = new FileReader();
      leser.onerror = () => fehl(new Error("Die Datei ließ sich nicht lesen."));
      leser.onload = () => {
        const roh = String(leser.result);
        if (datei.type === "image/gif" || datei.type === "image/svg+xml") {
          if (roh.length > MAX_BYTES * 2) return fehl(new Error("Die Datei ist zu groß (über 400 kB)."));
          return ok(roh);
        }
        const img = new Image();
        img.onerror = () => fehl(new Error("Das ist kein lesbares Bild."));
        img.onload = () => {
          const max = 256;
          let b = img.width, h = img.height;
          if (b > max || h > max) {
            const f = max / Math.max(b, h);
            b = Math.round(b * f); h = Math.round(h * f);
          }
          const leinwand = document.createElement("canvas");
          leinwand.width = b; leinwand.height = h;
          leinwand.getContext("2d").drawImage(img, 0, 0, b, h);
          // PNG behält die Durchsichtigkeit, JPG nicht — deshalb immer PNG.
          ok(leinwand.toDataURL("image/png"));
        };
        img.src = roh;
      };
      leser.readAsDataURL(datei);
    });
  }

  return { laden, istBereit: () => bereit, hat, bild, anzahl, speichern, entfernen, entferneAlle, einlesen, MAX_BYTES };
})();
