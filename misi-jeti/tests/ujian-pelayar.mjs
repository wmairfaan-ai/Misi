/* =====================================================================
   ujian-pelayar.mjs - ujian asap automatik dalam Chrome/Edge tanpa kepala
   Tanpa pakej npm. Perlu: Node 22+ (WebSocket terbina) dan Chrome atau Edge.
   1. Dari folder misi-jeti:  py -m http.server 8000
   2. Terminal lain:          node tests/ujian-pelayar.mjs
   Pilihan: CHROME="C:/path/chrome.exe"  URL="http://localhost:8000/"
   Kod misi dibaca daripada MJ.KUNCI dalam pelayar; TIDAK ditulis di sini.
   Pusingan 3: kunci-jawapan.js dimuat secara dinamik (NOTA penyimpangan 23).
   Ujian memuatkannya dengan MJ.kunci.muat() dan menyemak bahawa MJ.KUNCI
   TIADA di skrin murid selepas but, dimuat selepas PIN PG / Galeri selepas
   peti dibuka, dan dibuang semula.
   ===================================================================== */
import { spawn } from 'node:child_process';
import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL0 = process.env.URL || 'http://localhost:8000/';
const CALON = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean);
const CHROME = CALON.find((c) => existsSync(c));
if (!CHROME) { console.log('Chrome/Edge tidak ditemui. Tetapkan CHROME=...'); process.exit(2); }
const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
let lulus = 0, gagal = 0;
const semak = (syarat, msg) => { if (syarat) { lulus++; console.log('  LULUS  ' + msg); } else { gagal++; console.log('  GAGAL  ' + msg); } };

const PORT = 9400 + Math.floor(Math.random() * 400);
const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'mj-'))}`,
  '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
let ver;
for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await tidur(200); } }
const ws = new WebSocket(ver.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const tunggu = new Map(); const dengar = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && tunggu.has(m.id)) { tunggu.get(m.id)(m); tunggu.delete(m.id); } else { dengar.forEach((f) => f(m)); } });
const hantar = (method, params = {}, sessionId) => new Promise((res) => { const i = ++id; tunggu.set(i, res); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });

async function halaman(url, { sekat = [] } = {}) {
  const { result: { targetId } } = await hantar('Target.createTarget', { url: 'about:blank' });
  const { result: { sessionId } } = await hantar('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => hantar(m, p, sessionId);
  const log = []; const luar = [];
  dengar.push((m) => {
    if (m.sessionId !== sessionId) { return; }
    if (m.method === 'Runtime.exceptionThrown') { log.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') { log.push(m.params.args.map((a) => a.value ?? a.description).join(' ')); }
    if (m.method === 'Network.requestWillBeSent' && !/^(https?:\/\/(localhost|127\.0\.0\.1)|file:|data:|blob:|about:)/.test(m.params.request.url)) { luar.push(m.params.request.url); }
  });
  await s('Runtime.enable'); await s('Network.enable'); await s('Page.enable');
  if (sekat.length) { await s('Network.setBlockedURLs', { urls: sekat }); }
  await s('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await s('Page.navigate', { url }); await tidur(1500);
  const ev = async (x) => { const r = await s('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result.exceptionDetails ? { ralat: r.result.exceptionDetails.text } : r.result.result.value; };
  return { s, ev, log, luar, tutup: () => hantar('Target.closeTarget', { targetId }) };
}

try {
  console.log('1. Asap: but dan semua laluan');
  const p = await halaman(URL0);
  semak(await p.ev(`document.body.dataset.skrin === 'mula'`), 'Skrin Mula dipaparkan');
  semak(await p.ev(`(function(){var k=JSON.parse(localStorage['mjks.v1.kod']||'{}');return !!(k.m1Atas&&k.m1Dasar&&k.m2);})()`), 'cincangan kod dijana automatik semasa but (localhost)');
  semak(await p.ev(`typeof MJ.KUNCI === 'undefined'`), 'MJ.KUNCI tiada di skrin murid selepas but');
  semak(await p.ev(`!document.querySelector('script[src*="kunci-jawapan"]')`), 'tiada tag <script> kunci-jawapan dalam DOM');
  semak(await p.ev(`MJ.cincang.sha256Js('abc')`) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'SHA-256 sandaran JS betul');
  semak(await p.ev(`MJ.cincang.sha256('x'.repeat(119)).then(function(h){return h===MJ.cincang.sha256Js('x'.repeat(119))})`), 'Web Crypto = sandaran JS');
  await p.ev(`MJ.keadaan.ubah(function(q){q.dimulakan=true;q.misiDibuka={1:true,2:true,3:true};q.peti.dibuka=true;})`);
  for (const r of ['#/daftar', '#/peta', '#/misi1', '#/misi1/penyu', '#/misi2', '#/misi2/penyu', '#/misi3', '#/misi3/penyu', '#/bonus/penyu', '#/botol/penyu', '#/peti', '#/galeri', '#/upacara', '#/tiket']) {
    await p.ev(`location.hash=${JSON.stringify(r)}`); await tidur(700);
    semak(await p.ev(`!document.querySelector('.kad-ralat')`), 'laluan ' + r + ' tanpa skrin ralat');
  }
  semak(p.log.length === 0, 'tiada ralat konsol (' + p.log.length + ')' + (p.log.length ? ': ' + p.log.slice(0, 3).join(' | ') : ''));
  semak(p.luar.length === 0, 'tiada permintaan ke luar' + (p.luar.length ? ': ' + p.luar.join(', ') : ''));

  console.log('2. Kod misi');
  semak(await p.ev(`typeof MJ.KUNCI === 'undefined'`), 'MJ.KUNCI masih tiada selepas melawat semua laluan (kecuali Galeri)');
  /* muat kunci secara dinamik untuk ujian sahaja */
  const adaKunci = await p.ev(`new Promise(function(r){MJ.kunci.muat(function(K){r(!!(K&&K.kod));});})`);
  if (adaKunci) {
    await p.ev(`location.hash='#/misi1/pari'`); await tidur(600);
    await p.ev(`(function(){var f=document.querySelector('form.peti-kod'); f.elements.atas.value='ZZZZ'; f.elements.dasar.value='QQ'; f.requestSubmit();})()`); await tidur(500);
    semak(!(await p.ev(`MJ.keadaan.permainan().bot.pari.misi1.kodDiterima`)), 'M1: kod salah ditolak');
    await p.ev(`(function(){var f=document.querySelector('form.peti-kod'); f.elements.atas.value=MJ.KUNCI.kod.m1Atas.toLowerCase(); f.elements.dasar.value=MJ.KUNCI.kod.m1Dasar; f.requestSubmit();})()`); await tidur(500);
    semak(await p.ev(`MJ.keadaan.permainan().bot.pari.misi1.kodDiterima`), 'M1: kod betul diterima (huruf kecil dibenarkan)');
    await p.ev(`location.hash='#/misi2/pari'`); await tidur(600);
    await p.ev(`MJ.KUNCI.kod.m2.split('').forEach(function(h){document.querySelector('[data-huruf="'+h+'"]').click()}); document.getElementById('hantar-kod').click()`); await tidur(500);
    semak(await p.ev(`MJ.keadaan.permainan().bot.pari.misi2.kodDiterima`), 'M2: kod betul diterima');
    await p.ev(`location.hash='#/misi2/kerapu'`); await tidur(600);
    semak(await p.ev(`[].map.call(document.querySelectorAll('[data-huruf]'),function(x){return x.getAttribute('data-huruf')}).join('') !== MJ.KUNCI.kod.m2`), 'M2: susunan butang warna (kiri ke kanan) bukan susunan jawapan');
  } else { console.log('  (kunci-jawapan.js tiada: dilangkau)'); }
  await p.tutup();

  console.log('3. Tanpa kunci-jawapan.js');
  const q = await halaman(URL0, { sekat: ['*kunci-jawapan.js*'] });
  semak(await q.ev(`typeof MJ.KUNCI === 'undefined' && !!document.body.dataset.skrin && !document.querySelector('.kad-ralat')`), 'aplikasi dibuka tanpa kunci-jawapan.js');
  semak(await q.ev(`new Promise(function(r){MJ.kunci.muat(function(K){r(K===null);});})`), 'MJ.kunci.muat memulangkan null jika fail tiada (tanpa ralat)');
  await q.ev(`MJ.keadaan.ubah(function(x){x.dimulakan=true;x.peti.dibuka=true;}); location.hash='#/galeri'`); await tidur(700);
  semak(await q.ev(`/Contoh umum/.test(document.getElementById('skrin').innerText)`), 'galeri guna galeriUmum');
  semak(!(await q.ev(`/madu/i.test(document.getElementById('skrin').innerHTML)`)), 'galeri tidak memaparkan madu');
  await q.tutup();

  console.log('4. Panel Guru (tindanan, satu skrin)');
  const g = await halaman(URL0);
  await g.ev(`MJ.keadaan.ubah(function(x){x.dimulakan=true;}); location.hash='#/peta'`); await tidur(500);
  await g.ev(`MJ.pg.buka()`); await tidur(300);
  semak(await g.ev(`MJ.runtime.tirai === true`), 'Tirai hidup automatik');
  await g.ev(`(function(){var f=document.querySelector('.pg-pin'); f.elements.pin1.value='4321'; f.elements.pin2.value='4321'; f.requestSubmit();})()`); await tidur(400);
  semak(await g.ev(`document.querySelector('.pg-tab-btn.aktif').dataset.tab === 'kelulusan'`), 'tab lalai Kelulusan');
  await g.ev(`document.querySelector('[data-tab="metrik"]').click()`);
  semak(await g.ev(`!!document.querySelector('.pg-gate')`), 'Metrik bergate');
  await g.ev(`document.querySelector('[data-aksi="tunjuk"]').click()`);
  semak(await g.ev(`!!document.querySelector('.pg-metrik')`), '"Tunjuk" mendedahkan Metrik');
  await g.ev(`document.querySelector('[data-tab="jawapan"]').click()`);
  semak(await g.ev(`!!document.querySelector('.pg-gate')`), 'tukar tab: gate kembali');
  semak(await g.ev(`typeof MJ.KUNCI === 'object'`), 'selepas PIN: MJ.KUNCI dimuat untuk tab Kunci Jawapan');
  await g.ev(`MJ.pg.tutup()`);
  semak(await g.ev(`MJ.runtime.tirai === false`), 'tutup panel: Tirai auto dimatikan');
  semak(await g.ev(`typeof MJ.KUNCI === 'undefined'`), 'tutup panel: MJ.KUNCI dibuang');
  await g.ev(`MJ.keadaan.ubah(function(x){x.peti.dibuka=true;}); location.hash='#/galeri'`); await tidur(900);
  semak(await g.ev(`typeof MJ.KUNCI === 'object'`), 'Galeri selepas peti dibuka: MJ.KUNCI dimuat');
  await g.ev(`location.hash='#/peta'`); await tidur(400);
  semak(await g.ev(`typeof MJ.KUNCI === 'undefined'`), 'tinggalkan Galeri: MJ.KUNCI dibuang');
  semak(g.log.length === 0, 'tiada ralat konsol (Panel Guru/Galeri)' + (g.log.length ? ': ' + g.log.slice(0, 3).join(' | ') : ''));
  await g.tutup();

  /* ---------------- Pusingan 4 (2026-11-16) ---------------- */
  console.log('5. Surat P3 dikunci sehingga krew menguji (QA-044, penyimpangan 35)');
  const t = await halaman(URL0);
  const SEDIA5 = `localStorage.removeItem('mjks.v1.permainan'); MJ.keadaan.ubah(function(q){q.dimulakan=true;q.misiDibuka={1:true,2:true,3:true};
    Object.keys(q.bot).forEach(function(k){q.bot[k].dilantik=true;});
    var b=q.bot.pari; b.kerang=5; b.suratDibuka=[{misi:1,tahap:1,masa:1},{misi:1,tahap:2,masa:2},{misi:2,tahap:1,masa:3},{misi:2,tahap:2,masa:4}];});`;
  const bukaSurat = (n) => `(function(){MJ.surat.buka('pari',${n}); var m=document.querySelector('.modal-surat');
    return {kunci:!!(m&&m.querySelector('.surat-dikunci')), tebus:!!(m&&m.querySelector('[data-tebus]')), kerang:MJ.keadaan.permainan().bot.pari.kerang,
      teks:m?m.innerText:''};})()`;
  const tutupSurat = `(function(){var b=document.querySelector('.modal-surat [data-tutup-surat]'); if(b) b.click();})()`;
  await t.ev(SEDIA5); await t.ev(`location.hash='#/peta'`); await tidur(700);
  let r5 = await t.ev(bukaSurat(1));
  semak(r5.kunci && !r5.tebus && r5.kerang === 5, 'Projektor: P3 M1 terkunci sebelum Bendera Uji; tiada butang tebus; kerang tidak ditolak');
  await t.ev(tutupSurat); await tidur(300);
  r5 = await t.ev(bukaSurat(2));
  semak(r5.kunci && !r5.tebus && r5.kerang === 5, 'Projektor: P3 M2 terkunci sebelum Bendera Uji');
  await t.ev(tutupSurat); await tidur(300);
  /* P1/P2 kekal boleh ditebus: bot lain tanpa surat */
  semak(await t.ev(`(function(){MJ.keadaan.ubah(function(q){q.bot.kerapu.kerang=2;}); MJ.surat.buka('kerapu',1); var ok=!!document.querySelector('.modal-surat [data-tebus]'); var b=document.querySelector('.modal-surat [data-tutup-surat]'); if(b) b.click(); return ok;})()`), 'P1 boleh ditebus (tidak dikunci)');
  await tidur(300);
  await t.ev(`location.hash='#/misi1'`); await tidur(900);
  await t.ev(`document.getElementById('angkat-bendera').click()`); await tidur(500);
  semak(await t.ev(`MJ.keadaan.permainan().ujiKelas[1]===true && MJ.keadaan.permainan().ujiKelas[2]===false`), 'Bendera Uji M1 menetapkan ujiKelas[1] sahaja');
  await t.ev(`document.getElementById('selesai-uji').click()`); await tidur(500);
  await t.ev(`location.hash='#/peta'`); await tidur(700);
  r5 = await t.ev(bukaSurat(1));
  semak(!r5.kunci && r5.tebus, 'Selepas Bendera Uji M1: P3 M1 boleh ditebus');
  await t.ev(`document.querySelector('.modal-surat [data-tebus]').click()`); await tidur(1900);
  semak(await t.ev(`(function(){var b=MJ.keadaan.permainan().bot.pari; return b.kerang===4 && b.suratDibuka.filter(function(s){return s.misi===1;}).length===3;})()`), 'Tebus P3 M1: kerang -1, 3 surat M1');
  await t.ev(tutupSurat); await tidur(300);
  r5 = await t.ev(bukaSurat(2));
  semak(r5.kunci && !r5.tebus, 'P3 M2 masih terkunci (ujiKelas[2] belum)');
  await t.ev(tutupSurat); await tidur(300);
  /* Logik Mod Tablet (fungsi tulen) */
  semak(await t.ev(`(function(){var p=MJ.keadaan.permainan(); p.ujiKelas={1:false,2:false}; var m1=p.bot.pari.misi1, m2=p.bot.pari.misi2, f=MJ.keadaan.suratP3Dibuka;
    var hasil=[];
    m1.kodDiterima=false; m2.kodDiterima=false;
    /* Penyimpangan 43 (QA-048, pusingan 4b): M1 tablet dibuka sejak langkah rekod, sama seperti M2 */
    ['ramal','uji'].forEach(function(L){m1.langkah=L; hasil.push(f('pari',1,p)===false);});
    ['rekod','kod'].forEach(function(L){m1.langkah=L; hasil.push(f('pari',1,p)===true);});
    ['ramal','uji'].forEach(function(L){m2.langkah=L; hasil.push(f('pari',2,p)===false);});
    ['rekod','kod'].forEach(function(L){m2.langkah=L; hasil.push(f('pari',2,p)===true);});
    m1.langkah='ramal'; m1.kodDiterima=true; hasil.push(f('pari',1,p)===true);
    hasil.push(f('pari',3,p)===true);
    return hasil.every(Boolean);})()`), 'suratP3Dibuka: M1 dan M2 tablet dibuka di rekod/kod (penyimpangan 43); kodDiterima membuka; M3 tiada kunci');
  /* QA-048: Mod Tablet M1, "Ubah Rekod" (kod -> rekod) tidak mengunci semula P3 */
  await t.ev(`MJ.keadaan.ubahTetapan(function(s){s.mod='tablet';s.botTablet='pari';}); MJ.keadaan.ubah(function(q){q.ujiKelas={1:false,2:false}; q.bot.pari.misi1.langkah='kod'; q.bot.pari.misi1.kodDiterima=false;}); location.hash='#/misi1/pari'`); await tidur(1200);
  await t.ev(`(function(){var b=document.getElementById('rekod-semula'); if(b) b.click();})()`); await tidur(600);
  semak(await t.ev(`MJ.keadaan.permainan().bot.pari.misi1.langkah==='rekod' && MJ.keadaan.suratP3Dibuka('pari',1)===true`), 'Mod Tablet M1: selepas "Ubah Rekod", P3 kekal dibuka (QA-048)');
  await t.ev(`MJ.keadaan.ubahTetapan(function(s){s.mod='projektor';s.botTablet=null;}); location.hash='#/peta'`); await tidur(500);
  /* Mod Tablet: Bendera Uji TIDAK menetapkan ujiKelas */
  await t.ev(`MJ.keadaan.ubah(function(q){q.ujiKelas={1:false,2:false}; q.bot.pari.misi1.langkah='ramal';}); MJ.keadaan.ubahTetapan ? MJ.keadaan.ubahTetapan(function(s){s.mod='tablet';s.botTablet='pari';}) : null`);
  const adaUbahTetapan = await t.ev(`typeof MJ.keadaan.ubahTetapan === 'function'`);
  if (adaUbahTetapan) {
    await t.ev(`location.hash='#/misi1/pari'`); await tidur(900);
    await t.ev(`MJ.keadaan.ubah(function(q){q.bot.pari.misi1.langkah='uji';}); location.hash='#/peta'`); await tidur(400);
    await t.ev(`location.hash='#/misi1/pari'`); await tidur(900);
    semak(await t.ev(`MJ.keadaan.permainan().ujiKelas[1]===false`), 'Mod Tablet: Mod Uji M1 tidak menetapkan ujiKelas');
    await t.ev(`MJ.keadaan.ubahTetapan(function(s){s.mod='projektor';s.botTablet=null;})`); await tidur(300);
  } else { console.log('  (MJ.keadaan.ubahTetapan tiada: semakan Mod Tablet UI dilangkau)'); }
  /* Butang guru PG > Kunci (bergate) */
  await t.ev(`location.hash='#/peta'`); await tidur(400);
  await t.ev(`MJ.pg.buka()`); await tidur(300);
  await t.ev(`(function(){var f=document.querySelector('.pg-pin'); if(!f) return; if(f.elements.pin2){f.elements.pin1.value='4321'; f.elements.pin2.value='4321';} else {f.elements.pin.value='4321';} f.requestSubmit();})()`); await tidur(400);
  await t.ev(`document.querySelector('[data-tab="kunci"]').click()`); await tidur(200);
  semak(await t.ev(`!!document.querySelector('.pg-gate') && !document.querySelector('[data-ubah="ujiKelas"]')`), 'PG Kunci bergate: togol "Buka P3" tersembunyi sebelum Tunjuk');
  await t.ev(`document.querySelector('[data-aksi="tunjuk"]').click()`); await tidur(200);
  semak(await t.ev(`document.querySelectorAll('[data-ubah="ujiKelas"]').length===2`), 'Selepas Tunjuk: 2 togol "Buka P3 Misi 1/2"');
  await t.ev(`(function(){var c=document.querySelector('[data-ubah="ujiKelas"][data-n="2"]'); c.click();})()`); await tidur(300);
  semak(await t.ev(`MJ.keadaan.permainan().ujiKelas[2]===true`), 'Togol guru "Buka P3 Misi 2" menetapkan ujiKelas[2]');
  await t.ev(`MJ.pg.tutup()`); await tidur(300);
  r5 = await t.ev(bukaSurat(2));
  semak(!r5.kunci && r5.tebus, 'Selepas togol guru: P3 M2 boleh ditebus');
  await t.ev(tutupSurat); await tidur(300);
  await t.ev(`MJ.keadaan.resetPermainan()`); await tidur(300);
  semak(await t.ev(`(function(){var u=MJ.keadaan.permainan().ujiKelas; return u[1]===false && u[2]===false;})()`), 'Reset sesi mengosongkan ujiKelas');
  /* Data lama tanpa ujiKelas: Bendera Uji tidak ralat */
  await t.ev(`(function(){var p=JSON.parse(localStorage['mjks.v1.permainan']); delete p.ujiKelas; p.dimulakan=true; localStorage['mjks.v1.permainan']=JSON.stringify(p);})()`);
  await t.ev(`location.hash='#/misi1'`); await tidur(900);
  await t.ev(`document.getElementById('angkat-bendera').click()`); await tidur(400);
  semak(await t.ev(`MJ.keadaan.permainan().ujiKelas[1]===true`), 'Data lama tanpa ujiKelas: Bendera Uji tetap berfungsi');
  await t.ev(`document.getElementById('selesai-uji').click()`); await tidur(300);
  semak(t.log.length === 0, 'tiada ralat konsol (surat P3)' + (t.log.length ? ': ' + t.log.slice(0, 3).join(' | ') : ''));

  console.log('6. Kata rahsia Botol Misteri sebagai cincangan (QA-045, penyimpangan 36)');
  semak(await t.ev(`typeof MJ.KANDUNGAN.kataRahsia === 'undefined'`), 'KANDUNGAN.kataRahsia tiada');
  semak(await t.ev(`(function(){var k=JSON.parse(localStorage['mjks.v1.kod']||'{}'); return /^[0-9a-f]{64}$/.test(k.rahsia||'');})()`), 'mjks.v1.kod.rahsia ialah cincangan SHA-256 (dijana semasa but)');
  /* nilai sebenar dibaca dalam pelayar sahaja; tidak dicetak */
  const sumberBersih = await t.ev(`new Promise(function(r){MJ.kunci.muat(function(K){var s=K&&K.kataRahsia; if(!s){r(null);return;}
    Promise.all(['js/kandungan.js','index.html','js/skrin/botol.js','README.md','NOTA-PEMBINAAN.md'].map(function(f){return fetch(f).then(function(x){return x.text();});}))
    .then(function(ts){var re=new RegExp(s,'i'); var ok=ts.every(function(x){return !re.test(x);}); MJ.kunci.lepas(); r(ok);});});})`);
  semak(sumberBersih === true, 'kata rahsia tiada sebagai teks biasa dalam fail yang dihidang (kandungan.js, index.html, botol.js, README, NOTA)');
  await t.tutup();
  /* Botol tanpa kunci-jawapan.js (fail disekat), cincangan sudah ada dalam storan */
  const bt = await halaman(URL0 + '#/peta', { sekat: ['*kunci-jawapan.js*'] });
  const RAHSIA_UJI = 'ujian' + 'rahsia';   /* nilai ujian sahaja, bukan kata rahsia sebenar */
  await bt.ev(`MJ.keadaan.ubah(function(q){q.dimulakan=true;q.misiDibuka={1:true,2:true,3:true}; q.bot.penyu.dilantik=true; q.bot.penyu.misi1.cop=true; q.bot.penyu.botolDibuka=false;})`);
  const simpanRahsia = await bt.ev(`MJ.cincang.kod('${RAHSIA_UJI}').then(function(h){var k=JSON.parse(localStorage['mjks.v1.kod']||'{}'); window.__asal=k.rahsia; k.rahsia=h; localStorage['mjks.v1.kod']=JSON.stringify(k); return true;})`);
  await bt.ev(`location.hash='#/botol/penyu'`); await tidur(800);
  semak(await bt.ev(`typeof MJ.KUNCI==='undefined' && !!document.getElementById('form-rahsia')`), 'Botol dibuka tanpa kunci-jawapan.js (borang kata rahsia ada)');
  await bt.ev(`(function(){var f=document.getElementById('form-rahsia'); f.elements.rahsia.value='salah'; f.requestSubmit();})()`); await tidur(500);
  semak(await bt.ev(`!MJ.keadaan.permainan().bot.penyu.botolDibuka && /\\S/.test(document.querySelector('.mesej-kod').textContent)`), 'kata salah ditolak dengan mesej mesra');
  await bt.ev(`(function(){var f=document.getElementById('form-rahsia'); f.elements.rahsia.value='  ${RAHSIA_UJI.toUpperCase()} '; f.requestSubmit();})()`); await tidur(600);
  semak(simpanRahsia && await bt.ev(`MJ.keadaan.permainan().bot.penyu.botolDibuka===true`), 'kata betul (huruf besar + ruang) diterima melalui cincangan, tanpa kunci-jawapan.js');
  await bt.ev(`(function(){var k=JSON.parse(localStorage['mjks.v1.kod']); delete k.rahsia; localStorage['mjks.v1.kod']=JSON.stringify(k); MJ.keadaan.ubah(function(q){q.bot.penyu.botolDibuka=false;}); location.hash='#/peta';})()`); await tidur(400);
  await bt.ev(`location.hash='#/botol/penyu'`); await tidur(800);
  await bt.ev(`(function(){var f=document.getElementById('form-rahsia'); f.elements.rahsia.value='apa'; f.requestSubmit();})()`); await tidur(400);
  semak(await bt.ev(`document.querySelector('.mesej-kod').textContent===MJ.KANDUNGAN.teksSkrin.botolBelumTetap`), 'tiada cincangan: mesej "Kata rahsia belum ditetapkan"');
  await bt.ev(`(function(){var k=JSON.parse(localStorage['mjks.v1.kod']||'{}'); if(window.__asal) k.rahsia=window.__asal; localStorage['mjks.v1.kod']=JSON.stringify(k);})()`);
  semak(bt.log.length === 0, 'tiada ralat konsol (Botol)' + (bt.log.length ? ': ' + bt.log.slice(0, 3).join(' | ') : ''));
  await bt.tutup();

  console.log('7. Gelembung dialog (QA-036/037, pusingan 5)');
  const gb = await halaman(URL0 + '#/peta');
  await gb.ev(`localStorage.removeItem('mjks.v1.permainan'); MJ.keadaan.ubah(function(q){q.dimulakan=true;q.misiDibuka={1:true,2:true,3:true};}); location.hash='#/misi1'`); await tidur(2600);
  const aktifG = await gb.ev(`(function(){var g=[].slice.call(document.querySelectorAll('.gelembung')).filter(function(x){return !x.hidden;})[0]; if(!g) return null;
    var r=g.getBoundingClientRect(); var e=document.elementFromPoint(r.left+r.width/2, r.top+r.height/2);
    return {aktif:MJ.dialog.aktif(), pe:getComputedStyle(g).pointerEvents, atas:!!(e&&e.closest('.gelembung')), x:r.left+r.width/2, y:r.top+r.height/2, bawah:r.bottom, vh:innerHeight};})()`);
  semak(aktifG && aktifG.aktif && aktifG.pe === 'auto' && aktifG.atas, 'gelembung aktif menerima klik (pointer-events auto, berada paling atas)');
  semak(aktifG && aktifG.bawah <= aktifG.vh + 1, 'gelembung aktif tidak melepasi bawah skrin');
  if (aktifG) {
    const sebelum = await gb.ev(`document.querySelector('.gelembung:not([hidden]) .g-teks').textContent.length`);
    await gb.s('Input.dispatchMouseEvent', { type: 'mousePressed', x: aktifG.x, y: aktifG.y, button: 'left', clickCount: 1 });
    await gb.s('Input.dispatchMouseEvent', { type: 'mouseReleased', x: aktifG.x, y: aktifG.y, button: 'left', clickCount: 1 });
    await tidur(150);
    const selepas = await gb.ev(`(function(){var g=document.querySelector('.gelembung:not([hidden]) .g-teks'); return g?g.textContent.length:-1;})()`);
    semak(selepas !== sebelum, 'klik gelembung aktif = langkau (teks dilengkapkan atau baris seterusnya)');
    semak(await gb.ev(`MJ.runtime.modUji !== true`), 'klik gelembung tidak tembus ke butang di bawahnya');
  }
  /* tunggu dialog tamat */
  for (let i = 0; i < 60 && await gb.ev(`MJ.dialog.aktif()`); i++) { await tidur(500); }
  await tidur(200);
  const pudar = await gb.ev(`(function(){var g=[].slice.call(document.querySelectorAll('.gelembung')).filter(function(x){return !x.hidden;}); return g.map(function(x){return {pudar:x.classList.contains('pudar'), pe:getComputedStyle(x).pointerEvents};});})()`);
  semak(pudar.length === 0 || pudar.every((x) => x.pudar && x.pe === 'none'), 'selepas dialog tamat: gelembung pudar dengan pointer-events none');
  await tidur(1700);
  semak(await gb.ev(`[].slice.call(document.querySelectorAll('.gelembung')).every(function(x){return x.hidden;})`), 'gelembung disorok selepas 1.5 s');
  semak(gb.log.length === 0, 'tiada ralat konsol (gelembung)' + (gb.log.length ? ': ' + gb.log.slice(0, 3).join(' | ') : ''));
  await gb.tutup();
} finally {
  console.log(`\nRingkasan: ${lulus} lulus, ${gagal} gagal`);
  try { await hantar('Browser.close'); } catch { /* abai */ }
  proc.kill();
  process.exitCode = gagal ? 1 : 0;
}
