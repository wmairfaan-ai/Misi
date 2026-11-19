/* =====================================================================
   semak-kandungan.js - ujian penerimaan kandungan (Spesifikasi 6.5)
   Tanpa kebergantungan. Jalankan dari folder misi-jeti:
       node tests/semak-kandungan.js
   Kod keluar 0 = lulus, 1 = ada kegagalan. AMARAN tidak menggagalkan.

   Semakan:
   1. kandungan.js dimuat tanpa ralat dan mempunyai struktur asas.
   2. Tangga petunjuk: tepat 3 surat (P1-P3) bagi setiap misi; tiada P4.
   3. Petunjuk & dialog tidak mengandungi perkataan jawapan misi itu.
   4. Tiada kod misi sebagai teks biasa di luar js/kunci-jawapan.js
      (kod dibaca daripada kunci-jawapan.js jika ada; TIDAK ditulis di sini).
   5. Susunan paparan cecair/objek tidak sama dengan susunan jawapan.
   6. Gelembung dialog <= 20 perkataan (Spesifikasi 1.3 no. 5).
   7. Istilah Indonesia / tidak baku dalam teks murid.
   8. Kod M1 = anagram huruf objek ikut nasib; kod M2 = huruf menara;
      huruf dikongsi dua kumpulan = GAGAL (keputusan guru QA-040).
   9. (Pusingan 4, QA-045) KANDUNGAN.kataRahsia tiada; kataRahsiaHashLalai
      wujud (null atau 64 hex); kata rahsia tiada sebagai teks biasa dalam
      fail lain selain kunci-jawapan.js; kata rahsia bukan kod misi.
  10. (Pusingan 4) Kod M1 tidak muncul sebagai subrentetan teks murid.
   Kod dibaca daripada js/kunci-jawapan.js (vm), TIDAK dikod keras di sini.
   ===================================================================== */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var AKAR = path.resolve(__dirname, '..');
var gagal = 0, lulus = 0, amaran = 0;
function ok(msg) { lulus++; console.log('  LULUS  ' + msg); }
function salah(msg) { gagal++; console.log('  GAGAL  ' + msg); }
function awas(msg) { amaran++; console.log('  AMARAN ' + msg); }

function muat(fail) {
  var kotak = { window: {} };
  kotak.window.MJ = {};
  kotak.MJ = kotak.window.MJ;
  vm.createContext(kotak);
  vm.runInContext(fs.readFileSync(path.join(AKAR, fail), 'utf8'), kotak, { filename: fail });
  return kotak.window.MJ;
}

console.log('1. Memuat kandungan.js');
var MJ = muat('js/kandungan.js');
var K = MJ.KANDUNGAN;
if (K && K.surat && K.dialog && K.hukum && K.objek && K.cecair) { ok('struktur asas ada'); }
else { salah('struktur kandungan tidak lengkap'); process.exit(1); }

var KUNCI = null;
if (fs.existsSync(path.join(AKAR, 'js/kunci-jawapan.js'))) {
  KUNCI = muat('js/kunci-jawapan.js').KUNCI;
  console.log('   (kunci-jawapan.js ditemui: semakan kod & susunan dijalankan)');
} else {
  console.log('   (kunci-jawapan.js tiada: semakan 4-5 dilangkau)');
}

console.log('2. Tangga petunjuk');
[1, 2, 3].forEach(function (n) {
  var s = K.surat[n];
  if (!s || !Array.isArray(s.p)) { salah('Misi ' + n + ': tiada senarai petunjuk'); return; }
  if (s.p.length === 3) { ok('Misi ' + n + ': tepat 3 petunjuk (P1-P3), tiada P4'); }
  else { salah('Misi ' + n + ': ' + s.p.length + ' petunjuk (mesti 3)'); }
  if (!s.terbuka) { salah('Misi ' + n + ': tiada respons terbuka selepas P3'); }
});

console.log('3. Perkataan jawapan dalam petunjuk & dialog');
/* Perkataan jawapan bagi setiap misi. Frasa perbandingan ketumpatan ialah
   jawapan konsep; nasib objek & susunan cecair ialah jawapan data.
   KERAHSIAAN: corak nasib objek (M1) dan kedudukan menara (M2) DIBINA
   SECARA DINAMIK daripada KUNCI.nasib dan KUNCI.menara. Jangan tulis
   senarai objek-ikut-nasib atau cecair-ikut-kedudukan secara keras di sini
   (fail ini diterbitkan; senarai keras membocorkan kod M1/M2). */
var LARANG_SEMUA = [/\bkurang\s+tumpat/i, /\blebih\s+tumpat/i, /\bketumpatan\b/i];
function lepas(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
/* Nama bagi satu item: id + nama paparan (tanpa kurungan), huruf kecil. */
function namaItem(item) {
  var n = [item.id, String(item.nama || '').toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').trim()];
  (String(item.nama || '').match(/\(([^)]+)\)/g) || []).forEach(function (k) { n.push(k.slice(1, -1).toLowerCase()); });
  return n.filter(function (x, i, a) { return x && a.indexOf(x) === i; });
}
function coraKumpulan(nama, kataNasib) {
  if (!nama.length) { return null; }
  return new RegExp('\\b(' + nama.map(lepas).join('|') + ')\\b[^.?!]*\\b(' + kataNasib + ')\\b', 'i');
}
/* Kata nasib/kedudukan generik (bukan rahsia): ikut kumpulan, bukan ikut objek. */
var KATA_NASIB = { atas: 'terapung|timbul', dasar: 'tenggelam' };
var LARANG = { 1: LARANG_SEMUA.slice(), 2: LARANG_SEMUA.slice(), 3: LARANG_SEMUA };
var bilCorakData = 0;
if (KUNCI && KUNCI.nasib && KUNCI.menara) {
  Object.keys(KATA_NASIB).forEach(function (nasib) {
    var nama = [];
    K.objek.forEach(function (o) { if (KUNCI.nasib[o.id] === nasib) { nama = nama.concat(namaItem(o)); } });
    var re = coraKumpulan(nama, KATA_NASIB[nasib]);
    if (re) { LARANG[1].push(re); bilCorakData++; }
  });
  var menara = KUNCI.menara; /* bawah -> atas */
  function namaCecair(id) {
    var c = K.cecair.filter(function (x) { return x.id === id; })[0];
    return c ? namaItem(c) : [id];
  }
  var kedudukan = [];
  kedudukan.push([menara[0], 'di bawah|paling bawah']);
  kedudukan.push([menara[menara.length - 1], 'di atas|paling atas|terapung']);
  menara.slice(1, -1).forEach(function (id) { kedudukan.push([id, 'di tengah']); });
  kedudukan.forEach(function (k) {
    var re = coraKumpulan(namaCecair(k[0]), k[1]);
    if (re) { LARANG[2].push(re); bilCorakData++; }
  });
  if (bilCorakData >= 5) { ok(bilCorakData + ' corak nasib/menara dibina daripada kunci-jawapan.js (M1: 2, M2: ' + (bilCorakData - 2) + ')'); }
  else { salah('hanya ' + bilCorakData + ' corak nasib/menara dibina (jangkaan >= 5); semak KUNCI.nasib/menara'); }
} else {
  awas('kunci-jawapan.js tiada: semakan frasa nasib objek (M1) & susunan menara (M2) DILANGKAU; hanya frasa konsep disemak');
}
/* Perkataan isian Hukum Muara: amaran jika muncul (spesifikasi asal menggunakan
   sebahagiannya dalam bentuk soalan, jadi guru perlu memutuskan). */
var ISIAN = {};
K.hukum.forEach(function (h) { ISIAN[h.isian] = true; });
function semakTeks(label, teks, misi) {
  var lr = LARANG[misi] || LARANG_SEMUA;
  var kena = lr.filter(function (re) { return re.test(teks); });
  if (kena.length) { salah(label + ' mengandungi frasa jawapan: ' + kena.join(', ')); return; }
  var isian = Object.keys(ISIAN).filter(function (w) { return new RegExp('\\b' + w + '\\b', 'i').test(teks); });
  if (isian.length) { awas(label + ' mengandungi perkataan isian Hukum Muara: ' + isian.join(', ')); }
}
[1, 2, 3].forEach(function (n) {
  K.surat[n].p.forEach(function (t, i) { semakTeks('Surat M' + n + ' P' + (i + 1), t, n); });
});
var MISI_DIALOG = { m1: 1, kod: 1, m2: 2, m3: 3 };
var bilDialog = 0;
Object.keys(K.dialog).forEach(function (kunci) {
  var misi = 0;
  Object.keys(MISI_DIALOG).forEach(function (pre) { if (kunci.indexOf(pre) === 0) { misi = MISI_DIALOG[pre]; } });
  K.dialog[kunci].forEach(function (b, i) {
    bilDialog++;
    var lr = misi ? LARANG[misi] : LARANG_SEMUA;
    var kena = lr.filter(function (re) { return re.test(b.t); });
    if (kena.length) { salah('dialog.' + kunci + '[' + i + '] mengandungi frasa jawapan: ' + b.t); }
  });
});
ok(bilDialog + ' baris dialog disemak untuk frasa jawapan');
/* Petunjuk Peti Mak Tok: tajuk slot tidak boleh mengandungi perkataan isian */
K.hukum.forEach(function (h) {
  if (new RegExp('\\b' + h.isian + '\\b', 'i').test(h.tajuk)) {
    salah('Hukum ' + h.id + ': tajuk slot "' + h.tajuk + '" mengandungi perkataan isian ruang kosong');
  }
});

console.log('4. Kod misi sebagai teks biasa');
if (KUNCI && KUNCI.kod) {
  var kod = Object.keys(KUNCI.kod).map(function (k) { return String(KUNCI.kod[k]).toUpperCase(); });
  var fail = [];
  (function jalan(dir) {
    fs.readdirSync(dir).forEach(function (f) {
      var p = path.join(dir, f);
      var rel = path.relative(AKAR, p).replace(/\\/g, '/');
      if (fs.statSync(p).isDirectory()) { if (f !== 'tests' && f[0] !== '.') { jalan(p); } return; }
      if (rel === 'js/kunci-jawapan.js') { return; }
      if (/\.(js|css|html|md|json|txt)$/i.test(f)) { fail.push(rel); }
    });
  })(AKAR);
  fail.forEach(function (rel) {
    var teks = fs.readFileSync(path.join(AKAR, rel), 'utf8');
    kod.forEach(function (c, i) {
      /* kod sebagai token huruf besar sendiri (cth. dalam petikan atau senarai) */
      var re = new RegExp("(['\"`]|\\b)" + c + "(['\"`]|\\b)", 'g');
      var m = teks.match(re) || [];
      var tepat = m.filter(function (x) { return x.replace(/['"`]/g, '') === c; }).length;
      if (!tepat) { return; }
      if (/\.md$/i.test(rel)) { salah(rel + ': kod misi #' + (i + 1) + ' muncul ' + tepat + ' kali sebagai teks biasa (fail ini diterbitkan bersama aplikasi)'); }
      else { awas(rel + ': kod misi #' + (i + 1) + ' muncul ' + tepat + ' kali sebagai perkataan huruf besar (semak sama ada ia membayangkan kod)'); }
    });
    /* sebutan kasual (bukan huruf besar) dalam teks murid */
    kod.forEach(function (c, i) {
      if (rel === 'js/kandungan.js' && new RegExp('\\b' + c + '\\b', 'i').test(teks)) {
        awas('kandungan.js: perkataan kod misi #' + (i + 1) + ' muncul dalam teks murid (tajuk/telegram); kod mungkin boleh diteka');
      }
    });
  });
  if (!gagal) { ok('tiada kod dalam fail .md'); }
}

console.log('5. Susunan paparan berbanding jawapan');
if (KUNCI && KUNCI.menara) {
  var paparan = K.cecair.map(function (c) { return c.id; }).join(',');
  if (paparan === KUNCI.menara.join(',') || paparan === KUNCI.menara.slice().reverse().join(',')) {
    salah('KANDUNGAN.cecair dipaparkan dalam susunan jawapan menara (butang Peti Kod M2 kiri ke kanan = jawapan)');
  } else { ok('susunan cecair tidak sama dengan jawapan'); }
}
if (KUNCI && KUNCI.nasib) {
  var seq = K.objek.map(function (o) { return KUNCI.nasib[o.id]; });
  var tukar = 0;
  for (var i = 1; i < seq.length; i++) { if (seq[i] !== seq[i - 1]) { tukar++; } }
  if (tukar <= 1) { awas('KANDUNGAN.objek tersusun mengikut nasib (semua terapung dahulu, kemudian tenggelam): susunan paparan membayangkan kumpulan'); }
  else { ok('susunan objek bercampur'); }
}

console.log('6. Panjang gelembung dialog (<= 20 perkataan)');
var panjang = 0;
Object.keys(K.dialog).forEach(function (k) {
  K.dialog[k].forEach(function (b, i) {
    var n = String(b.t).trim().split(/\s+/).length;
    if (n > 20) { panjang++; awas('dialog.' + k + '[' + i + '] ' + n + ' perkataan'); }
  });
});
if (!panjang) { ok('semua gelembung <= 20 perkataan'); }

console.log('7. Istilah Indonesia / tidak baku');
var INDO = ['bisa', 'kok', 'banget', 'nggak', 'gak', 'aja', 'sih', 'dong', 'mau', 'silakan', 'tombol', 'layar',
  'peramban', 'unduh', 'unggah', 'berkas', 'kata sandi', 'pengaturan', 'ekspor', 'impor', 'kamar', 'mobil', 'kantor',
  'gimana', 'kenapa sih', 'saja deh', 'terima kasih banyak ya', 'sepeda', 'kursi', 'handuk'];
var semuaTeks = [];
(function kumpul(o, jalur) {
  if (typeof o === 'string') { semuaTeks.push([jalur, o]); return; }
  if (o && typeof o === 'object') { Object.keys(o).forEach(function (k) { kumpul(o[k], jalur + '.' + k); }); }
})(K, 'KANDUNGAN');
var indo = 0;
semuaTeks.forEach(function (x) {
  INDO.forEach(function (w) {
    if (new RegExp('\\b' + w + '\\b', 'i').test(x[1])) { indo++; salah(x[0] + ': istilah tidak baku/Indonesia "' + w + '"'); }
  });
});
if (!indo) { ok('tiada istilah Indonesia daripada senarai semakan dalam kandungan.js'); }

console.log('8. Kod boleh dibentuk daripada keputusan ujian sebenar');
if (KUNCI && KUNCI.kod && KUNCI.nasib) {
  var susun = function (x) { return String(x).toUpperCase().split('').sort().join(''); };
  var hurufAtas = K.objek.filter(function (o) { return KUNCI.nasib[o.id] === 'atas'; }).map(function (o) { return o.huruf; }).join('');
  var hurufDasar = K.objek.filter(function (o) { return KUNCI.nasib[o.id] === 'dasar'; }).map(function (o) { return o.huruf; }).join('');
  if (susun(hurufAtas) === susun(KUNCI.kod.m1Atas)) { ok('kod Atas Air = anagram huruf objek terapung'); } else { salah('kod Atas Air tidak boleh dibentuk daripada huruf objek terapung'); }
  if (susun(hurufDasar) === susun(KUNCI.kod.m1Dasar)) { ok('kod Dasar Sungai = anagram huruf objek tenggelam'); } else { salah('kod Dasar Sungai tidak boleh dibentuk daripada huruf objek tenggelam'); }
  var sama = hurufAtas.split('').filter(function (h, i, a) { return a.indexOf(h) === i && hurufDasar.indexOf(h) >= 0; });
  if (sama.length) {
    salah('huruf ' + sama.length + ' jenis muncul dalam KEDUA-DUA kumpulan (QA-040: setiap huruf mesti milik satu kumpulan sahaja)');
  } else { ok('tiada huruf dikongsi dua kumpulan'); }
  if (KUNCI.menara && KUNCI.kod.m2) {
    var m2 = KUNCI.menara.map(function (id) { var c = K.cecair.filter(function (x) { return x.id === id; })[0]; return c ? c.huruf : '?'; }).join('');
    if (m2 === String(KUNCI.kod.m2).toUpperCase()) { ok('kod M2 = huruf warna menara bawah ke atas'); } else { salah('kod M2 tidak sepadan dengan susunan menara'); }
  }
} else { console.log('   (kunci-jawapan.js tiada: dilangkau)'); }

console.log('9. Kata rahsia Botol Misteri (QA-045)');
if (Object.prototype.hasOwnProperty.call(K, 'kataRahsia')) { salah('KANDUNGAN.kataRahsia masih wujud (mesti dibuang; guna kataRahsiaHashLalai)'); }
else { ok('KANDUNGAN.kataRahsia tiada'); }
if (!Object.prototype.hasOwnProperty.call(K, 'kataRahsiaHashLalai')) { salah('KANDUNGAN.kataRahsiaHashLalai tiada'); }
else if (K.kataRahsiaHashLalai === null || /^[0-9a-f]{64}$/.test(String(K.kataRahsiaHashLalai))) { ok('kataRahsiaHashLalai wujud (null atau cincangan SHA-256)'); }
else { salah('kataRahsiaHashLalai bukan null dan bukan cincangan 64 hex (mungkin teks biasa)'); }
function semuaFail() {
  var out = [];
  (function jalan(dir) {
    fs.readdirSync(dir).forEach(function (f) {
      var p = path.join(dir, f);
      var rel = path.relative(AKAR, p).replace(/\\/g, '/');
      if (fs.statSync(p).isDirectory()) { if (f !== 'tests' && f[0] !== '.') { jalan(p); } return; }
      if (rel === 'js/kunci-jawapan.js') { return; }
      if (/\.(js|css|html|md|json|txt)$/i.test(f)) { out.push(rel); }
    });
  })(AKAR);
  return out;
}
if (KUNCI && KUNCI.kataRahsia) {
  var kr = String(KUNCI.kataRahsia).toUpperCase();
  var kodSemua = Object.keys(KUNCI.kod || {}).map(function (k) { return String(KUNCI.kod[k]).toUpperCase(); });
  if (kodSemua.indexOf(kr) >= 0) { salah('kata rahsia sama dengan kod misi'); } else { ok('kata rahsia bukan kod misi'); }
  var reKr = new RegExp('\\b' + kr + '\\b', 'i');
  var adaKr = semuaFail().filter(function (rel) { return reKr.test(fs.readFileSync(path.join(AKAR, rel), 'utf8')); });
  if (adaKr.length) { salah('kata rahsia muncul sebagai teks biasa dalam: ' + adaKr.join(', ')); }
  else { ok('kata rahsia tiada sebagai teks biasa di luar kunci-jawapan.js'); }
} else { console.log('   (kunci-jawapan.js atau kataRahsia tiada: imbasan teks biasa dilangkau)'); }

console.log('10. Kod misi sebagai subrentetan dalam teks murid (kandungan.js)');
if (KUNCI && KUNCI.kod) {
  var bilSub = 0;
  Object.keys(KUNCI.kod).forEach(function (n, i) {
    var c = String(KUNCI.kod[n]).toUpperCase();
    if (c.length < 4) { return; }   /* kod M2 (3 huruf warna) terlalu pendek untuk imbasan subrentetan */
    semuaTeks.forEach(function (x) {
      if (/^KANDUNGAN\.(garam|kodHashLalai|kataRahsiaHashLalai)/.test(x[0])) { return; }
      if (x[1].toUpperCase().indexOf(c) >= 0) { bilSub++; salah(x[0] + ': kod misi #' + (i + 1) + ' muncul sebagai subrentetan'); }
    });
  });
  if (!bilSub) { ok('tiada kod M1 sebagai subrentetan dalam teks murid'); }
}

console.log('\nRingkasan: ' + lulus + ' lulus, ' + gagal + ' gagal, ' + amaran + ' amaran');
process.exit(gagal ? 1 : 0);
