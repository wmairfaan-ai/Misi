/* =====================================================================
   semak-statik.js - semakan statik seni bina & peraturan (CLAUDE.md,
   Spesifikasi 1.3, 4.3.1f, 6.1, 6.4, 9). Tanpa kebergantungan.
   Jalankan dari folder misi-jeti:   node tests/semak-statik.js
   Kod keluar 0 = lulus, 1 = ada kegagalan. AMARAN tidak menggagalkan.

   Semakan:
   1. Setiap <script>/<link> dalam index.html wujud; tiada type="module",
      tiada import/export dalam js/.
   2. Luar talian: tiada URL http(s), fetch/XHR/WebSocket/sendBeacon,
      @import, url(), fail audio/imej/fon.
   3. Skrin murid tidak membaca data guru (mjks.v1.guru / keadaan.guru).
   4. Animasi: @keyframes dan transition hanya transform/opacity.
   5. kunci-jawapan.js dalam .gitignore dan tidak dijejak git.
   6. Fail yang dihidang bersama aplikasi tetapi tidak dalam .gitignore
      (NOTA-PEMBINAAN.md, README.md) - amaran sahaja di sini; kod misi
      diperiksa oleh semak-kandungan.js.
   ===================================================================== */
'use strict';
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var AKAR = path.resolve(__dirname, '..');
var gagal = 0, lulus = 0, amaran = 0;
function ok(m) { lulus++; console.log('  LULUS  ' + m); }
function salah(m) { gagal++; console.log('  GAGAL  ' + m); }
function awas(m) { amaran++; console.log('  AMARAN ' + m); }
function baca(rel) { return fs.readFileSync(path.join(AKAR, rel), 'utf8'); }
function senarai(dir, ext) {
  var hasil = [];
  (function jalan(d) {
    fs.readdirSync(path.join(AKAR, d)).forEach(function (f) {
      var rel = d + '/' + f;
      if (fs.statSync(path.join(AKAR, rel)).isDirectory()) { jalan(rel); } else if (ext.test(f)) { hasil.push(rel); }
    });
  })(dir);
  return hasil;
}
function tanpaKomen(s) { return s.replace(/\/\*[\s\S]*?\*\//g, ''); }

var html = baca('index.html');
var JS = senarai('js', /\.js$/);
var CSS = senarai('css', /\.css$/);

console.log('1. index.html dan modul');
var ruj = [];
html.replace(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g, function (_, u) { ruj.push(u); });
var hilang = ruj.filter(function (u) { return !fs.existsSync(path.join(AKAR, u)); });
if (!hilang.length) { ok(ruj.length + ' fail dirujuk dalam index.html wujud'); } else { salah('fail dirujuk tetapi tiada: ' + hilang.join(', ')); }
if (!/type="module"/.test(html) && !JS.some(function (f) { return /^\s*(import|export)\s/m.test(baca(f)); })) { ok('tiada ES modules'); } else { salah('ES modules ditemui'); }
var tidakDimuat = JS.filter(function (f) { return ruj.indexOf(f) < 0; });
/* Pusingan 3 (penyimpangan 23): kunci-jawapan.js MESTI tidak dimuat secara statik */
if (ruj.indexOf('js/kunci-jawapan.js') >= 0) { salah('index.html memuat js/kunci-jawapan.js secara statik (QA-016)'); }
else { ok('index.html tidak memuat js/kunci-jawapan.js secara statik'); }
tidakDimuat = tidakDimuat.filter(function (f) { return f !== 'js/kunci-jawapan.js'; });
if (!tidakDimuat.length) { ok('setiap fail js/ lain dimuat oleh index.html'); } else { awas('fail js/ tidak dimuat: ' + tidakDimuat.join(', ')); }

console.log('2. Luar talian (tiada sumber luar)');
var semua = ['index.html'].concat(JS, CSS);
var langgar = [];
semua.forEach(function (f) {
  var s = tanpaKomen(baca(f));
  var pola = [/https?:\/\/(?!www\.w3\.org\/)/, /\bfetch\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|new Audio\(|new Image\(/, /@import|url\((?!\s*['"]?data:)/, /\.(mp3|wav|ogg|png|jpe?g|gif|webp|woff2?|ttf|otf)\b/i];
  pola.forEach(function (re) { var m = s.match(re); if (m) { langgar.push(f + ': ' + m[0]); } });
});
if (!langgar.length) { ok('tiada URL luar, API rangkaian atau fail media/fon dalam ' + semua.length + ' fail'); } else { salah('sumber luar: ' + langgar.join(' | ')); }

console.log('3. Skrin murid tidak membaca data guru');
var bolehGuru = ['js/panel-guru.js', 'js/keadaan.js'];
var bacaGuru = JS.filter(function (f) { return bolehGuru.indexOf(f) < 0; }).filter(function (f) {
  return /mjks\.v1\.guru|keadaan\.guru\s*\(|ubahGuru\s*\(/.test(tanpaKomen(baca(f)));
});
if (!bacaGuru.length) { ok('hanya panel-guru.js/keadaan.js menyentuh data guru'); } else { salah('fail murid membaca data guru: ' + bacaGuru.join(', ')); }

console.log('4. Animasi hanya transform/opacity');
var kfBuruk = [], trBuruk = [];
CSS.forEach(function (f) {
  var s = tanpaKomen(baca(f));
  var re = /@keyframes\s+([\w-]+)\s*\{/g, m;
  while ((m = re.exec(s))) {
    var i = re.lastIndex, d = 1;
    while (d && i < s.length) { if (s[i] === '{') { d++; } else if (s[i] === '}') { d--; } i++; }
    var props = (s.slice(re.lastIndex, i - 1).match(/([a-z-]+)\s*:/g) || []).map(function (x) { return x.replace(/\s*:/, ''); });
    props.filter(function (p) { return ['transform', 'opacity', 'animation-timing-function', 'offset'].indexOf(p) < 0; })
      .forEach(function (p) { kfBuruk.push(f + ' @keyframes ' + m[1] + ': ' + p); });
  }
  var tr = /transition\s*:\s*([^;}]+)/g;
  while ((m = tr.exec(s))) {
    /* pisah pada koma di luar kurungan (var(), cubic-bezier()) */
    var bahagian = [], tahap = 0, kini = '';
    m[1].split('').forEach(function (ch) {
      if (ch === '(') { tahap++; } else if (ch === ')') { tahap--; }
      if (ch === ',' && tahap === 0) { bahagian.push(kini); kini = ''; } else { kini += ch; }
    });
    bahagian.push(kini);
    bahagian.forEach(function (bah) {
      var p = bah.trim().split(/\s+/)[0];
      if (['transform', 'opacity', 'none', 'all'].indexOf(p) < 0 && !/^[\d.]+m?s$/.test(p)) { trBuruk.push(f + ': transition ' + p); }
    });
  }
});
if (!kfBuruk.length) { ok('semua @keyframes hanya transform/opacity'); } else { salah(kfBuruk.join(' | ')); }
if (!trBuruk.length) { ok('semua transition hanya transform/opacity'); } else { salah('transition bukan transform/opacity: ' + trBuruk.join(' | ')); }

console.log('5. Kunci jawapan tidak diterbitkan');
var gi = fs.existsSync(path.join(AKAR, '.gitignore')) ? baca('.gitignore') : '';
if (/^\s*\/?js\/kunci-jawapan\.js\s*$/m.test(gi)) { ok('.gitignore menyenaraikan js/kunci-jawapan.js'); } else { salah('.gitignore tidak menyenaraikan js/kunci-jawapan.js'); }
try {
  var dijejak = cp.execSync('git ls-files -- js/kunci-jawapan.js', { cwd: AKAR, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  if (!dijejak) { ok('kunci-jawapan.js tidak dijejak git'); } else { salah('kunci-jawapan.js DIJEJAK git (perlu git rm --cached)'); }
} catch (e) { awas('git tidak tersedia: semakan penjejakan dilangkau'); }

console.log('6. Fail dokumentasi yang dihidang bersama aplikasi');
/* Baris corak sahaja (abaikan komen): pusingan 4b, komen .gitignore menyebut README.md */
var giCorak = gi.split(/\r?\n/).map(function (b) { return b.trim(); }).filter(function (b) { return b && b.charAt(0) !== '#'; });
function diabaikan(f) { return giCorak.some(function (b) { return b.replace(/^\//, '') === f; }); }
/* QA-050 (pusingan 4b): NOTA-PEMBINAAN.md mesti dalam .gitignore */
if (diabaikan('NOTA-PEMBINAAN.md')) { ok('.gitignore menyenaraikan NOTA-PEMBINAAN.md (QA-050)'); } else { salah('NOTA-PEMBINAAN.md tidak dalam .gitignore (QA-050)'); }
['NOTA-PEMBINAAN.md', 'README.md'].forEach(function (f) {
  if (fs.existsSync(path.join(AKAR, f))) {
    if (!diabaikan(f)) { awas(f + ' akan diterbitkan (tidak dalam .gitignore): pastikan tiada jawapan atau petunjuk'); }
    awas(f + ' dihidang oleh http.server dari folder ini (pastikan tiada jawapan atau petunjuk)');
  }
});

console.log('\nRingkasan: ' + lulus + ' lulus, ' + gagal + ' gagal, ' + amaran + ' amaran');
process.exitCode = gagal ? 1 : 0;
