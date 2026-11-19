/* =====================================================================
   kucing-pasangan.js - koreografer permainan berpasangan
   bermain-kejar, bergomol (sprite "bola bulu"), bersentuh-hidung (Mod Ringan),
   lerai (batal serta-merta). Spesifikasi 4.3.1(g).
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.pasangan = (function () {
  'use strict';
  var kunci = false;
  var jenisAktif = null;
  var pemasa = [];
  var bola = null;
  var dicubaKitaranIni = false;
  var KELAS_P = ['p-tepuk', 'p-guling', 'p-cungap', 'p-baring', 'p-jilat', 'p-hidung', 'berpasangan', 'm-telinga'];

  function K(id) { return MJ.kucing.k(id); }
  function W() { return window.innerWidth; }
  function H() { return window.innerHeight; }

  function jadual(ms, fn) { pemasa.push(setTimeout(fn, ms)); }
  function bersihPemasa() { pemasa.forEach(function (t) { clearTimeout(t); }); pemasa = []; }

  function had() {
    try { return JSON.parse(sessionStorage.getItem('mjks.pasangan')) || { bilangan: 0, terakhir: 0 }; }
    catch (e) { return { bilangan: 0, terakhir: 0 }; }
  }
  function simpanHad(h) {
    try { sessionStorage.setItem('mjks.pasangan', JSON.stringify(h)); } catch (e) { /* abai */ }
  }

  function bolehMula(perayaan) {
    if (!MJ.kucing.sedia || kunci) { return false; }
    var tet = MJ.keadaan.tetapan();
    if (!tet.kucing.mainBerpasangan) { return false; }
    if (MJ.runtime.kurangGerak) { return false; }
    if (MJ.runtime.modUji || MJ.runtime.tirai || MJ.runtime.pgBuka || MJ.runtime.suratBuka ||
        MJ.runtime.modalTerbuka) { return false; }
    var o = K('oyen'), k = K('kiko');
    if (!o || !k || o.bergerak || k.bergerak) { return false; }
    if (!perayaan) {
      if (MJ.dialog.aktif()) { return false; }
      if (o.emosi !== 'rehat' || k.emosi !== 'rehat') { return false; }
      if (!MJ.penghala || MJ.penghala.nama() !== 'peta') { return false; }
      var p = MJ.keadaan.permainan();
      if (p.barisanJeti && p.barisanJeti.length) { return false; }
      if (Date.now() - MJ.runtime.aktivitiTerakhir < 10000) { return false; }
    }
    return true;
  }

  function sediakanBola() {
    if (bola) { return bola; }
    bola = MJ.u.el('<div class="bola-bulu" aria-hidden="true">' + MJ.rig.bolaBulu() + '</div>');
    document.getElementById('pentas-kucing').appendChild(bola);
    return bola;
  }

  function mulaKunci() {
    kunci = true;
    ['oyen', 'kiko'].forEach(function (id) {
      var k = K(id);
      MJ.kucing.tamatEmosi(id);
      k.pasangan = true;
      k.diRumah = false;
      k.el.classList.add('berpasangan');
    });
    K('oyen').el.style.zIndex = '2';
  }

  function lepasKunci() {
    bersihPemasa();
    ['oyen', 'kiko'].forEach(function (id) {
      var k = K(id);
      if (!k) { return; }
      KELAS_P.forEach(function (c) { k.el.classList.remove(c); });
      k.el.style.opacity = '';
      k.el.style.zIndex = '';
      k.pasangan = false;
    });
    if (bola) { bola.classList.remove('main'); bola.style.display = 'none'; }
    kunci = false;
    jenisAktif = null;
  }

  function tamat() {
    lepasKunci();
    ['oyen', 'kiko'].forEach(function (id) { if (!K(id).diRumah) { MJ.kucing.pulang(id); } });
  }

  /* ---------------- Koreografi ---------------- */
  function kejar() {
    var o = K('oyen'), k = K('kiko');
    var ro = MJ.kucing.rumah('oyen'), rk = MJ.kucing.rumah('kiko');
    jadual(0, function () { MJ.gerak.ke(o, rk.x - o.saiz * 0.75, ro.y, { cara: 'lompat', durasi: 550 }); });
    jadual(600, function () { o.el.classList.add('p-tepuk'); k.el.classList.add('m-telinga'); });
    jadual(1000, function () {
      o.el.classList.remove('p-tepuk'); k.el.classList.remove('m-telinga');
      MJ.gerak.ke(k, W() * 0.04, rk.y, { cara: 'jalan', durasi: 1300 });
    });
    jadual(1150, function () { MJ.gerak.ke(o, W() * 0.04 + k.saiz * 0.9, ro.y, { cara: 'jalan', durasi: 1250 }); });
    jadual(2550, function () {
      o.el.style.zIndex = '';
      k.el.style.zIndex = '2';
      MJ.gerak.ke(o, W() * 0.6, ro.y, { cara: 'jalan', durasi: 1000 });
      MJ.gerak.ke(k, W() * 0.6 - k.saiz * 0.95, rk.y, { cara: 'jalan', durasi: 1050 });
    });
    jadual(3650, function () {
      MJ.gerak.ke(k, W() * 0.6 + o.saiz * 0.9, rk.y, { cara: 'lompat', durasi: 500 });
      o.el.classList.add('p-guling');
    });
    jadual(4250, function () {
      o.el.classList.remove('p-guling');
      MJ.kucing.pulang('oyen', null, { cara: 'jalan', durasi: 750 });
      MJ.kucing.pulang('kiko', null, { cara: 'jalan', durasi: 750 });
    });
    jadual(5050, function () { o.el.classList.add('p-cungap'); k.el.classList.add('p-cungap'); });
    jadual(5550, tamat);
  }

  function gomol() {
    var o = K('oyen'), k = K('kiko');
    var ro = MJ.kucing.rumah('oyen'), rk = MJ.kucing.rumah('kiko');
    var cx = W() / 2;
    jadual(0, function () {
      MJ.gerak.ke(o, cx - o.saiz * 0.9, ro.y, { cara: 'jalan', durasi: 800 });
      MJ.gerak.ke(k, cx - k.saiz * 0.1, rk.y, { cara: 'jalan', durasi: 800 });
    });
    jadual(850, function () {
      var b = sediakanBola();
      var lebar = Math.round(k.saiz * 1.5);
      var tinggi = Math.round(lebar * 170 / 240);
      b.style.width = lebar + 'px';
      b.style.height = tinggi + 'px';
      b.style.left = Math.round(cx - lebar / 2) + 'px';
      b.style.top = Math.round(H() - tinggi - H() * 0.012) + 'px';
      b.style.display = 'block';
      b.classList.add('main');
      o.el.style.opacity = '0';
      k.el.style.opacity = '0';
    });
    jadual(3050, function () {
      if (bola) { bola.classList.remove('main'); bola.style.display = 'none'; }
      o.el.style.opacity = '';
      k.el.style.opacity = '';
      o.el.classList.add('p-baring');
      k.el.classList.add('p-baring', 'p-jilat');
    });
    jadual(3750, function () {
      o.el.classList.remove('p-baring');
      k.el.classList.remove('p-baring', 'p-jilat');
      MJ.kucing.pulang('oyen', null, { cara: 'jalan', durasi: 800 });
      MJ.kucing.pulang('kiko', null, { cara: 'jalan', durasi: 800 });
    });
    jadual(4650, tamat);
  }

  function hidung() {
    var o = K('oyen'), k = K('kiko');
    var ro = MJ.kucing.rumah('oyen'), rk = MJ.kucing.rumah('kiko');
    var cx = W() / 2;
    jadual(0, function () {
      MJ.gerak.ke(o, cx - o.saiz * 0.85, ro.y);
      MJ.gerak.ke(k, cx - k.saiz * 0.15, rk.y);
    });
    jadual(450, function () { o.el.classList.add('p-hidung'); k.el.classList.add('p-hidung'); });
    jadual(1950, function () {
      o.el.classList.remove('p-hidung'); k.el.classList.remove('p-hidung');
      MJ.kucing.pulang('oyen'); MJ.kucing.pulang('kiko');
    });
    jadual(2400, tamat);
  }

  /* jenis: 'kejar' | 'gomol'. perayaan: true jika selepas peristiwa besar. */
  function mula(jenis, perayaan) {
    if (MJ.runtime.ringan) {
      if (!perayaan) { return false; }
      jenis = 'hidung';
    }
    if (!bolehMula(perayaan)) { return false; }
    mulaKunci();
    jenisAktif = jenis;
    if (jenis === 'gomol') { gomol(); } else if (jenis === 'hidung') { hidung(); } else { kejar(); }
    return true;
  }

  /* Batal serta-merta (peristiwa permainan, sentuhan, tukar skrin, PG, Tirai) */
  function lerai(senyap) {
    if (!kunci) { return; }
    ['oyen', 'kiko'].forEach(function (id) { MJ.gerak.batal(id === 'oyen' ? 'oyen' : 'kiko'); });
    lepasKunci();
    ['oyen', 'kiko'].forEach(function (id) {
      var k = K(id);
      if (!senyap && !MJ.runtime.kurangGerak) {
        k.el.classList.add('lerai');
        setTimeout(function () { k.el.classList.remove('lerai'); }, 450);
      }
      MJ.kucing.pulang(id, null, { cara: id === 'oyen' ? 'lompat' : 'jalan', durasi: 400 });
    });
  }

  function init() {
    if (MJ.runtime.halamanGuru) { return; }
    setInterval(function () {
      if (!MJ.kucing.sedia) { return; }
      var idle = Date.now() - MJ.runtime.aktivitiTerakhir;
      if (idle < 1500) { dicubaKitaranIni = false; return; }
      if (idle >= 45000 && !dicubaKitaranIni && !kunci) {
        dicubaKitaranIni = true;
        var h = had();
        if (h.bilangan >= 3 || Date.now() - h.terakhir < 180000) { return; }
        if (Math.random() >= 0.5) { return; }
        if (mula(Math.random() < 0.5 ? 'kejar' : 'gomol', false)) {
          h.bilangan += 1;
          h.terakhir = Date.now();
          simpanHad(h);
        }
      }
    }, 1000);
  }

  return {
    init: init, mula: mula, lerai: lerai,
    aktif: function () { return kunci; },
    jenis: function () { return jenisAktif; }
  };
})();
