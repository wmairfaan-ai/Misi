/* =====================================================================
   semak-cincang.js - sandaran SHA-256 JavaScript (cincang.js) lawan
   node:crypto. Tanpa kebergantungan. Jalankan dari folder misi-jeti:
       node tests/semak-cincang.js
   Kod keluar 0 = lulus, 1 = ada kegagalan.

   Semakan:
   1. sha256Js betul bagi vektor ujian dan semua panjang 0-200 bait
      (merentasi sempadan blok 55/56/64/119/120/128).
   2. sha256() dalam mod file:// (tiada Web Crypto) = node:crypto,
      termasuk teks UTF-8 (huruf Melayu/emoji tidak dibuang).
   3. normal(): huruf besar, A-Z sahaja; kod() = sha256(garam|NORMAL).
   4. pin(): digit sahaja.
   Tiada kod misi sebenar ditulis di sini.
   ===================================================================== */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var crypto = require('crypto');

var AKAR = path.resolve(__dirname, '..');
var gagal = 0, lulus = 0;
function semak(syarat, msg) { if (syarat) { lulus++; console.log('  LULUS  ' + msg); } else { gagal++; console.log('  GAGAL  ' + msg); } }
function nodeHex(s) { return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex'); }
function nodeHexLatin1(s) { return crypto.createHash('sha256').update(Buffer.from(s, 'latin1')).digest('hex'); }

/* Muat cincang.js dalam kotak pasir tanpa Web Crypto (seperti file:// lama) */
var kotak = { window: { isSecureContext: false }, unescape: unescape, encodeURIComponent: encodeURIComponent, Promise: Promise };
kotak.window.MJ = { KANDUNGAN: { garam: 'garam-ujian' } };
kotak.MJ = kotak.window.MJ;
vm.createContext(kotak);
vm.runInContext(fs.readFileSync(path.join(AKAR, 'js/cincang.js'), 'utf8'), kotak, { filename: 'js/cincang.js' });
var C = kotak.MJ.cincang;

console.log('1. sha256Js lawan vektor ujian & node:crypto');
semak(C.sha256Js('') === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'vektor "" (kosong)');
semak(C.sha256Js('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'vektor "abc"');
var salahPanjang = [];
for (var n = 0; n <= 200; n++) {
  var s = '';
  for (var i = 0; i < n; i++) { s += String.fromCharCode(32 + ((i * 7 + n) % 95)); }
  if (C.sha256Js(s) !== nodeHexLatin1(s)) { salahPanjang.push(n); }
}
semak(salahPanjang.length === 0, 'semua panjang 0-200 aksara ASCII sepadan' + (salahPanjang.length ? ' (gagal: ' + salahPanjang.slice(0, 10).join(',') + ')' : ''));
var salahBait = 0;
for (var t = 0; t < 300; t++) {
  var b = '';
  var len = (t * 37) % 150;
  for (var j = 0; j < len; j++) { b += String.fromCharCode((t * 131 + j * 17) % 256); }
  if (C.sha256Js(b) !== nodeHexLatin1(b)) { salahBait++; }
}
semak(salahBait === 0, '300 rentetan bait 0-255 rawak-tetap sepadan');
semak(C.sha256Js('Ā') === null, 'aksara > 255 ditolak (null) oleh sha256Js mentah');

console.log('2. sha256() sandaran (tiada Web Crypto) termasuk UTF-8');
var ujianUtf8 = ['', 'abc', 'Kuala Senyum', 'garam-ujian|ABC', 'Pak Din jual air sirap éè', 'kucing 🐱 Oyen'];
Promise.all(ujianUtf8.map(function (x) { return C.sha256(x); })).then(function (hs) {
  var semua = hs.every(function (h, i) { return h === nodeHex(ujianUtf8[i]); });
  semak(semua, 'sha256() = node:crypto bagi ' + ujianUtf8.length + ' teks (UTF-8)');

  console.log('3. normal() dan kod()');
  semak(C.normal('  ab c-1d! ') === 'ABCD', 'normal buang ruang/digit/simbol & huruf besar');
  semak(C.normal(null) === '' && C.normal(undefined) === '', 'normal(null/undefined) = ""');
  return Promise.all([C.kod(' xy z '), C.kod('XYZ')]);
}).then(function (k) {
  semak(k[0] === k[1] && k[0] === nodeHex('garam-ujian|XYZ'), 'kod() = sha256(garam|NORMAL) dan tidak sensitif huruf/ruang');
  console.log('4. pin()');
  return Promise.all([C.pin('12a34'), C.pin('1234')]);
}).then(function (p) {
  semak(p[0] === p[1] && p[0] === nodeHex('garam-ujian|PIN|1234'), 'pin() simpan digit sahaja');
}).catch(function (e) {
  semak(false, 'ralat tidak dijangka: ' + e);
}).then(function () {
  console.log('\nRingkasan: ' + lulus + ' lulus, ' + gagal + ' gagal');
  process.exitCode = gagal ? 1 : 0;
});
