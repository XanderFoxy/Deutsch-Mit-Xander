#!/usr/bin/env node
/* =========================================================
   WELCHER TON LAEUFT WANN? — EIN MITSCHNITT, KEINE MEINUNG
   ---------------------------------------------------------
   XANDER hat mehrfach Toene gemeldet, die „zu spaet", „zu
   frueh" oder „gar nicht" kommen. Raten hilft da nicht: dieses
   Werkzeug haengt sich an Audio() und play() und schreibt auf,
   welche Datei zu welcher Millisekunde wirklich anfaengt.

     node werkzeug/pruefe-tonlage.js geld 6000
     node werkzeug/pruefe-tonlage.js ohrfeige 4000

   So ist zum Beispiel herausgekommen, dass die Registerkasse
   beim Geldregen SCHON lief — sie startete nur gleichzeitig
   mit dem 9,5 s langen Geldbett und ging darin unter.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const WURZEL="/home/user/Deutsch-Mit-Xander";
const TYP={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml",".mp3":"audio/mpeg",".opus":"audio/ogg",".m4a":"audio/mp4"};
(async()=>{
 const srv=http.createServer((q,a)=>{let p=decodeURIComponent(q.url.split("?")[0]);if(p==="/")p="/index.html";const f=path.join(WURZEL,p);if(!f.startsWith(WURZEL)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){a.writeHead(404);return a.end();}a.writeHead(200,{"Content-Type":TYP[path.extname(f)]||"application/octet-stream"});fs.createReadStream(f).pipe(a);}).listen(0);
 const br=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 const pg=await br.newPage({viewport:{width:460,height:900}});
 await pg.goto("http://127.0.0.1:"+srv.address().port+"/index.html",{waitUntil:"domcontentloaded"});
 await pg.waitForFunction(()=>window.DMA_PRUEFUNG&&window.DMA_PRUEF,{timeout:20000});
 await pg.evaluate(()=>window.DMA_PRUEF.effektBuehne());
 await pg.evaluate(()=>{window.__toene=[];const O=window.Audio;window.Audio=function(src){window.__toene.push({t:Math.round(performance.now()),src:String(src).split("/").pop().split("?")[0]});return new O(src);};
   const ap=HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play=function(){window.__toene.push({t:Math.round(performance.now()),ab:(this.currentSrc||this.src||"").split("/").pop().split("?")[0]});return ap.call(this);};});
 const was = process.argv[2] || "geld";
 const t0 = await pg.evaluate((w)=>{window.__t0=Math.round(performance.now());window.DMA_PRUEFUNG.wirkung(w, "3", "Alex");return window.__t0;}, was);
 await pg.waitForTimeout(Number(process.argv[3]||5000));
 const r = await pg.evaluate((t0)=>window.__toene.map(x=>({...x,t:x.t-t0})), t0);
 console.log(was+":"); r.forEach(x=>console.log("  "+String(x.t).padStart(5)+" ms  "+(x.ab?("ab   "+x.ab):("neu  "+x.src))));
 await br.close(); srv.close();
})();
