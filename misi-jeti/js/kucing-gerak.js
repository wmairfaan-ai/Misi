/* =====================================================================
   kucing-gerak.js - pergerakan kucing (jalan / lompat) dengan SATU
   gelung requestAnimationFrame yang hanya hidup semasa ada kucing
   bergerak. Hanya transform & opacity dianimasikan.
   Juga: pemantau kadar bingkai untuk Mod Ringan automatik.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.gerak = (function () {
  'use strict';
  var aktif = {};
  var rafId = null;
  var fps = { terakhir: 0, lambatMs: 0 };

  function hadkan(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function letak(k, x, y) {
    k.x = x;
    k.y = y;
    k.el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
  }
  function anjakY(k, dy) {
    k.elLompat.style.transform = dy ? 'translateY(' + dy.toFixed(1) + 'px)' : '';
  }
  function modRingan() { return MJ.runtime.ringan || MJ.runtime.kurangGerak; }

  /* o = { cara: 'jalan'|'lompat', durasi: ms, selesai: fn, paksa: bool } */
  function ke(k, x, y, o) {
    o = o || {};
    batal(k.id);
    var dx = x - k.x;
    var dy = y - k.y;
    var jarak = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dx) > 2) { k.elArah.classList.toggle('terbalik', dx < 0); }
    if (jarak < 2) { if (o.selesai) { o.selesai(); } return; }

    if (modRingan()) {
      /* Mod Ringan / kurangkan gerakan: pudar keluar, pindah, pudar masuk */
      k.bergerak = true;
      k.el.style.opacity = '0';
      setTimeout(function () {
        letak(k, x, y);
        k.el.style.opacity = '';
        k.bergerak = false;
        if (o.selesai) { o.selesai(); }
      }, 300);
      return;
    }
    var cara = o.cara || (k.id === 'oyen' ? 'lompat' : 'jalan');
    var laju = k.id === 'oyen' ? 400 : 250;   // px/s (Spesifikasi 4.3.1c)
    var durasi = o.durasi || (cara === 'lompat' ?
      hadkan(jarak / laju * 800, 500, 1000) :
      hadkan(jarak / laju * 1000, 300, 1600));
    aktif[k.id] = {
      k: k, dariX: k.x, dariY: k.y, keX: x, keY: y,
      mula: performance.now(), durasi: durasi, cara: cara,
      tinggi: cara === 'lompat' ? Math.min(140, 40 + jarak * 0.2) : 0,
      selesai: o.selesai || null
    };
    k.bergerak = true;
    k.el.classList.add(cara === 'lompat' ? 'melompat' : 'berjalan');
    if (!rafId) { fps.terakhir = 0; rafId = requestAnimationFrame(langkah); }
  }

  function langkah(t) {
    rafId = null;
    pantauFps(t);
    var ada = false;
    Object.keys(aktif).forEach(function (id) {
      var a = aktif[id];
      if (!a) { return; }
      var p = Math.min(1, (t - a.mula) / a.durasi);
      if (p < 0) { p = 0; }
      var x = a.dariX + (a.keX - a.dariX) * p;
      var y = a.dariY + (a.keY - a.dariY) * p;
      letak(a.k, x, y);
      if (a.tinggi) {
        anjakY(a.k, -Math.sin(Math.PI * p) * a.tinggi);
      } else {
        anjakY(a.k, -Math.abs(Math.sin((t - a.mula) / 1000 * Math.PI * 3.3)) * 6);
      }
      if (p >= 1) { tamat(id); } else { ada = true; }
    });
    if (ada) { rafId = requestAnimationFrame(langkah); } else { fps.terakhir = 0; }
  }

  function pantauFps(t) {
    if (fps.terakhir) {
      var d = t - fps.terakhir;
      if (d > 34 && d < 1000) { fps.lambatMs += d; } else { fps.lambatMs = Math.max(0, fps.lambatMs - d * 0.5); }
      if (fps.lambatMs > 5000 && !MJ.runtime.ringan) {
        var tet = MJ.keadaan.tetapan();
        if (tet.kucing.modRingan === 'auto') {
          MJ.runtime.ringan = true;
          document.documentElement.classList.add('mod-ringan');
          if (window.console) { console.info('[MJ] Mod Ringan diaktifkan secara automatik (< 30 fps).'); }
        }
      }
    }
    fps.terakhir = t;
  }

  function tamat(id) {
    var a = aktif[id];
    if (!a) { return; }
    delete aktif[id];
    anjakY(a.k, 0);
    a.k.el.classList.remove('melompat', 'berjalan');
    a.k.bergerak = false;
    if (a.selesai) { a.selesai(); }
  }

  /* Batal tanpa memanggil selesai */
  function batal(id) {
    var a = aktif[id];
    if (!a) { return; }
    delete aktif[id];
    anjakY(a.k, 0);
    a.k.el.classList.remove('melompat', 'berjalan');
    a.k.bergerak = false;
  }

  function sedangBergerak(id) { return !!aktif[id]; }

  return { ke: ke, letak: letak, batal: batal, sedangBergerak: sedangBergerak };
})();
