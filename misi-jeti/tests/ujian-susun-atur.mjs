/* =====================================================================
   ujian-susun-atur.mjs - ukuran susun atur Mod Projektor (QA-005/006, QA-036+)
   Tanpa pakej npm. Perlu: Node 22+ dan Chrome atau Edge.
   1. Dari folder misi-jeti:  py -m http.server 8000 --bind 127.0.0.1
   2. Terminal lain:          node tests/ujian-susun-atur.mjs
   Pilihan: CHROME=...  URL=http://127.0.0.1:8000/  SAIZ=1280x720,1024x768
            JSON=fail.json (simpan jadual mentah)
   Bagi setiap skrin dan saiz:
   - setiap butang dalam #skrin (atau modal) kelihatan tanpa menatal;
   - butang dilindungi badan kucing (>10% luas) atau gelembung;
   - MJ.runtime.muat; #skrin masih melimpah selepas muat;
   - saiz fon: badan (mod ikut panjang teks), h1, gelembung, paling kecil;
   - kestabilan: perubahan --muat semasa 3 s tanpa aktiviti; ralat konsol;
   - (QA-036/037) gelembung dialog tidak menutup tengah butang utama selepas
     dialog tamat, dan tidak melepasi bawah skrin;
   - (QA-046, 2026-11-16) gelembung AKTIF tidak menutup tengah butang utama
     dalam 8 s pertama, dan saiznya tidak melebihi teks penuhnya (< 1.1x).
   Tiada kod misi atau jawapan dibaca/ditulis oleh ujian ini.
   ===================================================================== */
import { spawn } from 'node:child_process';
import { mkdtempSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL0 = process.env.URL || 'http://127.0.0.1:8000/';
const SAIZ = (process.env.SAIZ || '1280x720,1024x768').split(',').map((x) => x.split('x').map(Number));
const CALON = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean);
const CHROME = CALON.find((c) => existsSync(c));
if (!CHROME) { console.log('Chrome/Edge tidak ditemui. Tetapkan CHROME=...'); process.exit(2); }
const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = 9400 + Math.floor(Math.random() * 400);
const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'mjs-'))}`,
  '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
let ver;
for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await tidur(200); } }
const ws = new WebSocket(ver.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const tunggu = new Map(); const dengar = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && tunggu.has(m.id)) { tunggu.get(m.id)(m); tunggu.delete(m.id); } else { dengar.forEach((f) => f(m)); } });
const hantar = (method, params = {}, sessionId) => new Promise((res) => { const i = ++id; tunggu.set(i, res); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });

const { result: { targetId } } = await hantar('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await hantar('Target.attachToTarget', { targetId, flatten: true });
const s = (m, p) => hantar(m, p, sessionId);
const log = [];
dengar.push((m) => {
  if (m.sessionId !== sessionId) { return; }
  if (m.method === 'Runtime.exceptionThrown') { log.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') { log.push(m.params.args.map((a) => a.value ?? a.description).join(' ')); }
});
await s('Runtime.enable'); await s('Page.enable');
const ev = async (x) => { const r = await s('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result.exceptionDetails ? { ralat: r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text } : r.result.result.value; };

/* Pengukur (dijalankan dalam halaman) */
const UKUR = `(function(){
  var vw=innerWidth, vh=innerHeight, sk=document.getElementById('skrin'), skr=sk.getBoundingClientRect();
  var modal=document.querySelector('#lapisan-atas .modal');
  var akar=modal||sk;
  function nampak(el){var r=el.getBoundingClientRect(); var cs=getComputedStyle(el); return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&!el.closest('.sr,[hidden]');}
  function bahagianKucing(){var out=[]; document.querySelectorAll('#pentas-kucing .kb').forEach(function(kb){
    kb.querySelectorAll('.k-badan,.k-kepala,.k-ekor,.k-telinga,.k-kaki-depan').forEach(function(g){var r=g.getBoundingClientRect(); if(r.width>0) out.push({k:kb.dataset.kucing||kb.id||'kucing',r:r});});});
    return out;}
  function gelembung(){var out=[]; document.querySelectorAll('.gelembung').forEach(function(g){var cs=getComputedStyle(g); if(cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>0.05){var r=g.getBoundingClientRect(); if(r.width>0) out.push(r);}}); return out;}
  function luas(a,b){var x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)), y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)); return x*y;}
  var kc=bahagianKucing(), gl=gelembung();
  var bawahNampak = modal ? vh : Math.min(vh, skr.bottom);
  var butang=[].slice.call(akar.querySelectorAll('button, a.btn')).filter(nampak).map(function(b){
    var r=b.getBoundingClientRect(); var A=r.width*r.height;
    var lindung=kc.filter(function(c){return luas(r,c.r)>0.10*A;}).map(function(c){return c.k;});
    var lindungG=gl.some(function(g){return luas(r,g)>0.10*A;});
    return {t:(b.id?'#'+b.id+' ':'')+(b.innerText||b.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,28),
      utama:b.classList.contains('btn-utama')||b.classList.contains('btn-aksen'),
      tanpaTatal: r.top>=0 && r.bottom<=bawahNampak+1 && r.right<=vw+1,
      kucing: Array.from(new Set(lindung)), gelembung: lindungG, h: Math.round(r.height)};
  });
  var teks=[]; var w=document.createTreeWalker(akar, NodeFilter.SHOW_TEXT); var n;
  while((n=w.nextNode())){ if(!n.nodeValue.trim()) continue; var el=n.parentElement; if(!el||!nampak(el)||el.closest('svg')) continue;
    teks.push({fs:parseFloat(getComputedStyle(el).fontSize), len:n.nodeValue.trim().length, tag:el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.split(' ')[0]:''), s:n.nodeValue.trim().slice(0,20)}); }
  var ber={}; teks.forEach(function(t){ber[t.fs]=(ber[t.fs]||0)+t.len;});
  var badan=Object.keys(ber).sort(function(a,b){return ber[b]-ber[a];})[0];
  var kecil=teks.slice().sort(function(a,b){return a.fs-b.fs;})[0]||null;
  var h1=akar.querySelector('h1'); var g=document.querySelector('.g-teks');
  return { muat: MJ.runtime.muat, limpah: sk.scrollHeight>sk.clientHeight+2, scrollTop: sk.scrollTop,
    badan: badan?Math.round(+badan*10)/10:null, h1: h1&&nampak(h1)?Math.round(parseFloat(getComputedStyle(h1).fontSize)*10)/10:null,
    gelembung: g?Math.round(parseFloat(getComputedStyle(g).fontSize)*10)/10:null,
    kecil: kecil?{fs:Math.round(kecil.fs*10)/10, el:kecil.tag, s:kecil.s}:null, butang: butang,
    akarFont: parseFloat(getComputedStyle(document.documentElement).fontSize) };
})()`;

const ASAS = `localStorage.clear();`;
const SEDIA = `MJ.keadaan.ubah(function(q){q.dimulakan=true;q.misiDibuka={1:true,2:true,3:true};
  Object.keys(q.bot).forEach(function(k){q.bot[k].dilantik=true;});
  q.bot.penyu.copPenolong=1;q.bot.penyu.bonusDibuka=true;q.bot.penyu.misi1.cop=true;q.bot.penyu.misi1.kodDiterima=false;});`;
const GELARAN = `MJ.keadaan.ubah(function(q){q.upacara={nakhoda:'pari',pegawai:'penyu',jurutera:'kerapu',penjejak:['dugong']};});`;
/* Klik loceng, umumkan 4 gelaran (kunci 2.5 s), kemudian (pilihan) Teruskan ke langkah kuasa */
const upacara = (kuasa) => `new Promise(function(r){var k=function(id){var b=document.getElementById(id); if(b) b.click();};
  k('up-loceng'); [2900,5600,8300,11000].forEach(function(t){setTimeout(function(){k('up-umum');},t);});
  setTimeout(function(){ ${kuasa ? "k('up-terus');" : ''} r(true);},11600);})`;
const UPACARA_GELARAN = upacara(false);
const UPACARA_KUASA = upacara(true);
const SKRIN = [
  ['#/mula', `MJ.keadaan.ubah(function(q){q.dimulakan=false;})`, null],
  ['#/daftar', SEDIA, null],
  ['#/peta', SEDIA, null],
  ['#/misi1', SEDIA, null],
  ['#/misi1 (Mod Uji)', SEDIA, `document.getElementById('angkat-bendera').click()`, '#/misi1'],
  ['#/misi1/pari (Peti Kod)', SEDIA, null, '#/misi1/pari'],
  ['#/misi2', SEDIA, null],
  ['#/misi2 (Mod Uji)', SEDIA, `document.getElementById('angkat-bendera').click()`, '#/misi2'],
  ['#/misi2/pari (Peti Kod)', SEDIA, null, '#/misi2/pari'],
  ['#/misi3', SEDIA, null],
  ['#/misi3/pari', SEDIA, null, '#/misi3/pari'],
  ['Surat (modal, M1 pari)', SEDIA, `MJ.surat.buka('pari',1)`, '#/misi1/pari'],
  ['#/bonus/penyu', SEDIA, null, '#/bonus/penyu'],
  ['#/botol/penyu', SEDIA, null, '#/botol/penyu'],
  ['#/peti', SEDIA, null],
  ['#/galeri', SEDIA + `MJ.keadaan.ubah(function(q){q.peti.dibuka=true;})`, null],
  ['#/upacara', SEDIA, null],
  /* Pusingan 4: Upacara dengan 4 gelaran, kemudian langkah kuasa (QA-005 baki) */
  ['#/upacara (4 gelaran)', SEDIA + GELARAN, UPACARA_GELARAN, '#/upacara'],
  ['#/upacara (langkah kuasa)', SEDIA + GELARAN, UPACARA_KUASA, '#/upacara'],
  ['#/tiket', SEDIA, null]
];

const hasil = [];
let gagal = 0;
try {
  await s('Page.navigate', { url: URL0 }); await tidur(1500);
  const HANYA = process.env.HANYA || '';
  for (const [w, h] of (HANYA === 'aktif' ? [] : SAIZ)) {
    await s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    console.log(`\n=== ${w}x${h} (Mod Projektor) ===`);
    for (const [nama, sedia, aksi, hash0] of SKRIN) {
      const hash = hash0 || nama.split(' ')[0];
      await s('Page.navigate', { url: 'about:blank' }); await tidur(200);
      await s('Page.navigate', { url: URL0 + '#/peta' }); await tidur(900); await ev(ASAS); await s('Page.reload'); await tidur(1200);
      await ev(sedia); await ev(`location.hash=${JSON.stringify(hash)}`); await tidur(900);
      if (aksi) { await ev(aksi); await tidur(900); }
      await tidur(2600);   /* kucing berjalan pulang, dialog bermula */
      await ev(`window.__mjM=0; window.__mjObs=new MutationObserver(function(r){window.__mjM+=r.length;}); window.__mjObs.observe(document.documentElement,{attributes:true,attributeFilter:['style']});`);
      await tidur(3000);
      const ubahMuat = await ev(`(function(){window.__mjObs.disconnect(); return window.__mjM;})()`);
      const u = await ev(UKUR);
      if (u.ralat) { console.log('  RALAT ukur ' + nama + ': ' + u.ralat); gagal++; continue; }
      const tak = u.butang.filter((b) => !b.tanpaTatal).map((b) => b.t);
      const kuc = u.butang.filter((b) => b.kucing.length).map((b) => b.t + '[' + b.kucing.join('/') + ']');
      const gel = u.butang.filter((b) => b.gelembung).map((b) => b.t);
      const utamaOk = u.butang.filter((b) => b.utama).every((b) => b.tanpaTatal && !b.kucing.length);
      if (!utamaOk || tak.length || kuc.length) { gagal++; }
      hasil.push({ saiz: `${w}x${h}`, skrin: nama, ...u, ubahMuat });
      console.log(`${utamaOk && !tak.length && !kuc.length ? '  OK   ' : '  GAGAL'} ${nama.padEnd(26)} muat=${u.muat} limpah=${u.limpah} badan=${u.badan} h1=${u.h1} gel=${u.gelembung} kecil=${u.kecil && u.kecil.fs}(${u.kecil && u.kecil.el}) ubahStyleIdle=${ubahMuat}`);
      if (tak.length) { console.log('         di bawah lipatan: ' + tak.join(' | ')); }
      if (kuc.length) { console.log('         dilindungi kucing: ' + kuc.join(' | ')); }
      if (gel.length) { console.log('         dilindungi gelembung: ' + gel.join(' | ')); }
    }
  }
  /* QA-036: gelembung dialog tidak boleh menghalang klik di tengah butang utama
     selepas dialog tamat (gelembung 'pudar' kekal dengan pointer-events:auto). */
  /* Pusingan 4: kedua-dua saiz; klik tetikus SEBENAR di tengah butang mesti berkesan. */
  for (const [GW, GH] of (HANYA === 'aktif' ? [] : SAIZ)) {
  console.log(`\n=== Gelembung lawan butang utama (selepas dialog tamat, ${GW}x${GH}, klik tetikus sebenar) ===`);
  await s('Emulation.setDeviceMetricsOverride', { width: GW, height: GH, deviceScaleFactor: 1, mobile: false });
  for (const [hash, sel, aksi, kesan] of [['#/misi1', '#angkat-bendera', null, 'MJ.runtime.modUji===true'], ['#/misi2', '#angkat-bendera', null, 'MJ.runtime.modUji===true'],
    ['#/misi1', '#selesai-uji', `document.getElementById('angkat-bendera').click()`, 'MJ.runtime.modUji===false'],
    ['#/tiket', '#tiket-seterusnya', null, `/SOALAN 2/.test(document.getElementById('skrin').innerText)`]]) {
    await ev(ASAS); await s('Page.navigate', { url: URL0 + '#/peta' }); await tidur(900);
    await ev(SEDIA); await ev(`location.hash=${JSON.stringify(hash)}`); await tidur(900);
    if (aksi) { await ev(aksi); await tidur(900); }
    await tidur(16000);
    const r = await ev(`(function(){var b=document.querySelector('${sel}'); if(!b) return null; var r=b.getBoundingClientRect(); var e=document.elementFromPoint(r.left+r.width/2, r.top+r.height/2);
      var g=[].slice.call(document.querySelectorAll('.gelembung')).filter(function(x){return !x.hidden;}).map(function(x){var q=x.getBoundingClientRect(); return {id:x.id, bawah:Math.round(q.bottom)};});
      return {tengahDiGelembung: !!(e && e.closest('.gelembung')), dialog: MJ.dialog.aktif(), gelembung: g, vh: innerHeight, x: r.left+r.width/2, y: r.top+r.height/2};})()`);
    if (!r) { console.log(`  (dilangkau) ${hash} ${sel}: butang tiada`); continue; }
    await s('Input.dispatchMouseEvent', { type: 'mousePressed', x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await s('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await tidur(500);
    const berkesan = await ev(kesan);
    const ok = !r.tengahDiGelembung && berkesan === true;
    if (!ok) { gagal++; }
    console.log(`${ok ? '  OK   ' : '  GAGAL'} ${hash} ${sel}: tengah butang ${r.tengahDiGelembung ? 'DITUTUP gelembung' : 'bebas'}; klik tetikus ${berkesan ? 'berkesan' : 'TIDAK berkesan'}; gelembung kelihatan: ${JSON.stringify(r.gelembung)}`);
    const potong = (r.gelembung || []).filter((g) => g.bawah > r.vh + 1);
    if (potong.length) { gagal++; console.log('         gelembung melepasi bawah skrin (teks terpotong): ' + potong.map((g) => g.id + ' bawah=' + g.bawah).join(', ')); }
  }
  }
  /* Pusingan 4 (2026-11-16, QA-046): gelembung AKTIF (dialog sedang berjalan) tidak boleh
     menutup tengah butang utama dalam 8 s pertama skrin. Klik pada gelembung aktif =
     langkau baris, jadi klik pertama guru pada butang itu akan "hilang". Juga semak saiz
     gelembung tidak melebihi teks penuhnya (diukur sebelum MJ.muatSkrin mengecilkan fon). */
  /* Pusingan 4b (QA-046/047): tambah Galeri dan Peti Mak Tok; sasaran = semua kawalan
     penting (bukan butang utama sahaja). Bagi setiap sampel juga diukur:
     - tindihan gelembung aktif dengan badan kucing LAIN (> 10% luas gelembung = isu);
     - ekor: jika ekor dipapar, kepala penutur mesti sebaris dengan gelembung dan dekat
       (jurang mendatar <= 0.6 x saiz kucing), dan --ekor-y mesti setentang kepala (+-24 px);
       jika gelembung jauh (jurang > 0.6 x saiz atau tidak sebaris), ekor mesti disorok. */
  const KES_AKTIF = [
    ['#/misi1', '#angkat-bendera', SEDIA],
    ['#/misi2', '#angkat-bendera', SEDIA],
    ['#/misi3', '#buka-kad', SEDIA],
    ['#/tiket', '#tiket-seterusnya', SEDIA],
    ['#/galeri', '.baris-galeri .btn, .galeri-tab .btn', SEDIA + `MJ.keadaan.ubah(function(q){q.peti.dibuka=true;})`],
    ['#/peti', '.cip-serpihan, .kad-serpihan[data-serpihan], .slot-hukum, #skrin .btn', SEDIA]
  ];
  const UKUR_AKTIF = (sel) => `(function(){
    var g=[].slice.call(document.querySelectorAll('.gelembung')).filter(function(x){return !x.hidden && !x.classList.contains('pudar');})[0];
    var sasaran=[].slice.call(document.querySelectorAll(${JSON.stringify(sel)})).filter(function(b){var r=b.getBoundingClientRect(); return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0;});
    var tutup=[]; sasaran.forEach(function(b){var q=b.getBoundingClientRect(); var e=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
      if(e && e.closest('.gelembung') && !e.closest('.gelembung').classList.contains('pudar')) tutup.push((b.id?'#'+b.id:b.className.split(' ').slice(-1)[0])+' '+(b.innerText||'').trim().slice(0,14));});
    if(!g) return {ada:false, n:sasaran.length, tutup:tutup};
    var c=g.cloneNode(true); c.style.minHeight=''; c.style.visibility='hidden'; c.querySelector('.g-teks').textContent=(document.getElementById('suara-dialog').textContent||'').replace(/^(Oyen|Kiko): /,''); g.parentNode.appendChild(c); var nisbah=g.offsetHeight/Math.max(1,c.offsetHeight); c.remove();
    var gr=g.getBoundingClientRect(); var pen=g.id.replace('gelembung-',''); var lain=pen==='oyen'?'kiko':'oyen';
    function luas(a,b){var x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)), y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)); return x*y;}
    var kp=document.querySelector('.kb[data-kucing="'+pen+'"]'); var tpen=0, apen=0; if(kp){kp.querySelectorAll('.k-badan,.k-kepala').forEach(function(x){var q=x.getBoundingClientRect(); var vis={left:Math.max(0,q.left),right:Math.min(innerWidth,q.right),top:Math.max(0,q.top),bottom:Math.min(innerHeight,q.bottom)}; apen+=Math.max(0,vis.right-vis.left)*Math.max(0,vis.bottom-vis.top); tpen+=luas(gr,vis);});}
    var kl=document.querySelector('.kb[data-kucing="'+lain+'"]'); var tlain=0;
    if(kl){kl.querySelectorAll('.k-badan,.k-kepala').forEach(function(x){tlain+=luas(gr,x.getBoundingClientRect());});}
    var ilus=0; document.querySelectorAll('#skrin .taklimat-ilus, #skrin .meja-objek, #skrin .cecair-meja').forEach(function(x){ilus+=luas(gr,x.getBoundingClientRect());});
    var k=MJ.kucing.k(pen); var kepY=k.y+k.saiz*0.35; var jurang=Math.max(k.x-gr.right,0,gr.left-(k.x+k.saiz));
    var tanpaEkor=g.classList.contains('tanpa-ekor'); var ey=parseFloat(g.style.getPropertyValue('--ekor-y'));
    var sebaris=kepY>=gr.top+12&&kepY<=gr.bottom-12;
    var ekorSalah=null;
    if(!tanpaEkor){ if(!sebaris||jurang>Math.max(48,k.saiz*0.6)) ekorSalah='ekor dipapar walaupun jauh (jurang '+Math.round(jurang)+' px)';
      else if(!(Math.abs(gr.top+ey+8-kepY)<=24)) ekorSalah='ekor tidak setentang kepala ('+Math.round(gr.top+ey+8-kepY)+' px)'; }
    return {ada:true, n:sasaran.length, tutup:tutup, nisbah:nisbah, lain:tlain/Math.max(1,gr.width*gr.height), penutur: apen>0 ? tpen/apen : 0, ilus:Math.round(ilus/Math.max(1,gr.width*gr.height)*100),
      ekor:tanpaEkor?'sorok':'papar', jurang:Math.round(jurang), ekorSalah:ekorSalah, bawah:gr.bottom>innerHeight+1, kanan:gr.right>innerWidth+1||gr.left<-1};})()`;
  for (const [GW, GH] of SAIZ) {
    console.log(`\n=== Gelembung AKTIF lawan kawalan (8 s pertama, ${GW}x${GH}) ===`);
    await s('Emulation.setDeviceMetricsOverride', { width: GW, height: GH, deviceScaleFactor: 1, mobile: false });
    for (const [hash, sel, sedia] of KES_AKTIF) {
      await ev(ASAS); await s('Page.navigate', { url: URL0 + '#/peta' }); await tidur(900);
      await ev(sedia); await ev(`location.hash=${JSON.stringify(hash)}`);
      let penMaks = 0, tutup = 0, sampel = 0, nisbahMaks = 0, lainMaks = 0, ilusMaks = 0, ekorP = 0, ekorS = 0, keluar = 0, aktifN = 0, nSasaran = 0;
      const tutupApa = new Set(), ekorSalah = new Set(), jurangMaks = [0];
      const t0 = Date.now();
      while (Date.now() - t0 < 8000) {
        const r = await ev(UKUR_AKTIF(sel));
        if (r && !r.ralat) {
          sampel++; nSasaran = Math.max(nSasaran, r.n);
          if (r.tutup.length) { tutup++; r.tutup.forEach((x) => tutupApa.add(x)); }
          if (r.ada) {
            aktifN++;
            nisbahMaks = Math.max(nisbahMaks, r.nisbah); lainMaks = Math.max(lainMaks, r.lain); penMaks = Math.max(penMaks, r.penutur || 0); ilusMaks = Math.max(ilusMaks, r.ilus);
            if (r.ekor === 'papar') { ekorP++; } else { ekorS++; }
            if (r.ekorSalah) { ekorSalah.add(r.ekorSalah); }
            if (r.bawah || r.kanan) { keluar++; }
            jurangMaks[0] = Math.max(jurangMaks[0], r.jurang);
          }
        }
        await tidur(250);
      }
      const ok = tutup === 0 && nisbahMaks < 1.1 && lainMaks <= 0.10 && penMaks <= 0.30 && ekorSalah.size === 0 && keluar === 0 && nSasaran > 0;
      if (!ok) { gagal++; }
      console.log(`${ok ? '  OK   ' : '  GAGAL'} ${hash.padEnd(8)} ${nSasaran} sasaran: ditutup gelembung aktif ${tutup}/${sampel} sampel (~${(tutup * 0.25).toFixed(1)} s)${tutupApa.size ? ' [' + [...tutupApa].join(' | ') + ']' : ''}; saiz/teks maks ${nisbahMaks.toFixed(2)}; tindih kucing lain maks ${(lainMaks * 100).toFixed(0)}%; kucing penutur ditutup maks ${(penMaks * 100).toFixed(0)}%; tindih ilustrasi maks ${ilusMaks}%; ekor papar/sorok ${ekorP}/${ekorS} (jurang maks ${jurangMaks[0]} px)${ekorSalah.size ? '; EKOR SALAH: ' + [...ekorSalah].join(' | ') : ''}${keluar ? '; keluar skrin ' + keluar : ''}; sampel aktif ${aktifN}`);
    }
  }
  console.log('\nRalat konsol: ' + log.length + (log.length ? ' :: ' + log.slice(0, 5).join(' | ') : ''));
  if (process.env.JSON) { writeFileSync(process.env.JSON, JSON.stringify(hasil, null, 1)); }
} finally {
  console.log(`\nRingkasan: ${hasil.length} ukuran, ${gagal} skrin bermasalah`);
  try { await hantar('Browser.close'); } catch { /* abai */ }
  proc.kill();
  process.exitCode = gagal || log.length ? 1 : 0;
}
