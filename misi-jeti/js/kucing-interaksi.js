/* =====================================================================
   kucing-interaksi.js - belai (klik/sentuh/Enter) dan hover-meow
   Had kekerapan (Spesifikasi 4.3.2):
   - meow: 1 kali / 4 s setiap kucing; jarak global 1.5 s;
     mesti keluar >= 0.5 s sebelum hover baharu; 6 meow / 60 s -> senyap 30 s
   - tiada meow semasa Mod Uji, dialog/surat, Tirai, Panel Guru, Senyap,
     permainan berpasangan, atau suis "Meow hover" dimatikan
   - belai: 3 sentuhan / 30 s -> baris had + bertenang 20 s
   - sentuhan TIDAK PERNAH memberi petunjuk atau dialog misi
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.interaksi = (function () {
  'use strict';
  var rekod = {
    oyen: { sentuh: [], bertenangHingga: 0, hoverTerakhir: 0, keluarPada: 0 },
    kiko: { sentuh: [], bertenangHingga: 0, hoverTerakhir: 0, keluarPada: 0 }
  };
  var meowGlobalTerakhir = 0;
  var sejarahMeow = [];
  var senyapHoverHingga = 0;

  function kelip(id) {
    var k = MJ.kucing.k(id);
    if (!k) { return; }
    k.el.classList.add('kelip');
    setTimeout(function () { k.el.classList.remove('kelip'); }, 150);
  }

  function bolehBunyiMeow() {
    if (MJ.runtime.modUji || MJ.runtime.tirai || MJ.runtime.pgBuka || MJ.runtime.suratBuka) { return false; }
    if (MJ.dialog.aktif()) { return false; }
    if (MJ.pasangan && MJ.pasangan.aktif()) { return false; }
    var tet = MJ.keadaan.tetapan();
    if (!tet.kucing.meowHover || !tet.bunyi.hidup) { return false; }
    return true;
  }

  function masukHover(id, titik) {
    var r = rekod[id];
    var kini = Date.now();
    if (MJ.runtime.modUji) { return; }                       // tiada reaksi langsung
    if (MJ.pasangan && MJ.pasangan.aktif()) { return; }
    if (MJ.runtime.tirai || MJ.runtime.pgBuka) { return; }
    if (titik) { MJ.kucing.pandang(id, titik); }
    if (r.keluarPada && kini - r.keluarPada < 500) { return; } // mesti keluar >= 0.5 s
    if (kini - r.hoverTerakhir < 4000) { return; }             // 1 kali / 4 s setiap kucing
    if (kini < senyapHoverHingga) { return; }                  // hanya pandang & kelip
    r.hoverTerakhir = kini;
    MJ.kucing.setEmosi(id, 'hover');
    if (!bolehBunyiMeow()) { return; }
    if (kini - meowGlobalTerakhir < 1500) { return; }          // jarak global
    sejarahMeow = sejarahMeow.filter(function (t) { return kini - t < 60000; });
    if (sejarahMeow.length >= 6) {
      senyapHoverHingga = kini + 30000;
      sejarahMeow = [];
      return;
    }
    sejarahMeow.push(kini);
    meowGlobalTerakhir = kini;
    MJ.bunyi.meow(id);
  }

  function belai(id) {
    var r = rekod[id];
    var kini = Date.now();
    MJ.aktiviti();
    if (kini < r.bertenangHingga) { kelip(id); return; }
    if (MJ.runtime.modUji) {
      /* Mod Uji: hanya kelip + purr kecil, tanpa berguling */
      kelip(id);
      MJ.bunyi.purr(id, 0.6);
      return;
    }
    r.sentuh = r.sentuh.filter(function (t) { return kini - t < 30000; });
    r.sentuh.push(kini);
    if (r.sentuh.length >= 3) {
      r.bertenangHingga = kini + 20000;
      r.sentuh = [];
      MJ.kucing.setEmosi(id, 'dibelai');
      MJ.bunyi.purr(id, 1.0);
      if (!MJ.dialog.aktif()) {
        MJ.dialog.mainkan(id === 'oyen' ? MJ.KANDUNGAN.dialog.hadBelaiOyen : MJ.KANDUNGAN.dialog.hadBelaiKiko);
      }
      return;
    }
    var berulang = r.sentuh.length >= 2 && (kini - r.sentuh[r.sentuh.length - 2] < 10000);
    if (berulang) {
      MJ.kucing.setEmosi(id, id === 'oyen' ? 'guling' : 'lembik');
      MJ.bunyi.purr(id, 1.6);
    } else {
      MJ.kucing.setEmosi(id, 'dibelai');
      MJ.bunyi.purr(id, 1.1);
    }
  }

  function init() {
    if (!MJ.kucing || !MJ.kucing.sedia) { return; }
    ['oyen', 'kiko'].forEach(function (id) {
      var k = MJ.kucing.k(id);
      if (!k || !k.zon) { return; }
      k.zon.addEventListener('pointerenter', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') { return; }
        masukHover(id, { x: e.clientX, y: e.clientY });
      });
      k.zon.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') { return; }
        if (MJ.runtime.modUji || (MJ.pasangan && MJ.pasangan.aktif())) { return; }
        MJ.kucing.pandang(id, { x: e.clientX, y: e.clientY });
      });
      k.zon.addEventListener('pointerleave', function () {
        rekod[id].keluarPada = Date.now();
        MJ.kucing.pandang(id, null);
      });
      k.zon.addEventListener('click', function (e) {
        e.stopPropagation();
        belai(id);
      });
      k.el.addEventListener('focus', function () { masukHover(id, null); });
      k.el.addEventListener('blur', function () { rekod[id].keluarPada = Date.now(); });
      k.el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); belai(id); }
      });
    });
  }

  return { init: init, belai: belai };
})();
