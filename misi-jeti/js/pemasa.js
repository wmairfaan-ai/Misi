/* =====================================================================
   pemasa.js - pemasa fasa ("Pasang Surut") di bar atas
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.pemasa = (function () {
  'use strict';
  var detik = null;

  function baki(p) {
    var pm = p.pemasa;
    if (pm.dijeda || !pm.tamatPada) { return Math.max(0, pm.bakiSaat || 0); }
    return Math.max(0, Math.round((pm.tamatPada - Date.now()) / 1000));
  }

  function format(s) {
    var m = Math.floor(s / 60);
    var d = s % 60;
    return m + ':' + (d < 10 ? '0' : '') + d;
  }

  function tetapFasa(fasaId, mulaSerta) {
    MJ.keadaan.ubah(function (p) {
      var f = MJ.u.fasa(fasaId);
      var j = f.minit * 60;
      p.fasa = fasaId;
      p.pemasa = {
        fasa: fasaId, jumlahSaat: j, bakiSaat: j,
        tamatPada: mulaSerta ? Date.now() + j * 1000 : null,
        dijeda: !mulaSerta, amaran2: false, tamatBerbunyi: false
      };
      if (fasaId === 'misi1') { p.misiDibuka[1] = true; }
      if (fasaId === 'misi2') { p.misiDibuka[1] = true; p.misiDibuka[2] = true; }
      if (fasaId === 'misi3' || ['peti', 'galeri', 'upacara', 'tiket'].indexOf(fasaId) >= 0) {
        p.misiDibuka[1] = true; p.misiDibuka[2] = true; p.misiDibuka[3] = true;
      }
      p.dimulakan = true;
    });
  }

  function mula() {
    MJ.keadaan.ubah(function (p) {
      if (p.pemasa.dijeda) {
        p.pemasa.tamatPada = Date.now() + p.pemasa.bakiSaat * 1000;
        p.pemasa.dijeda = false;
      }
    });
  }

  function jeda() {
    MJ.keadaan.ubah(function (p) {
      if (!p.pemasa.dijeda) {
        p.pemasa.bakiSaat = baki(p);
        p.pemasa.tamatPada = null;
        p.pemasa.dijeda = true;
      }
    });
  }

  function tambah(minit) {
    MJ.keadaan.ubah(function (p) {
      var pm = p.pemasa;
      if (pm.dijeda) {
        pm.bakiSaat = Math.max(0, (pm.bakiSaat || 0) + minit * 60);
      } else {
        pm.tamatPada = Math.max(Date.now(), pm.tamatPada + minit * 60000);
      }
      pm.jumlahSaat = Math.max(60, (pm.jumlahSaat || 60) + minit * 60);
      var b = baki(p);
      if (b > 120) { pm.amaran2 = false; }
      if (b > 0) { pm.tamatBerbunyi = false; }
    });
  }

  function paparkan() {
    var p = MJ.keadaan.permainan();
    var b = baki(p);
    var f = MJ.u.fasa(p.fasa);
    var elFasa = document.getElementById('bar-fasa');
    var elMasa = document.getElementById('bar-masa');
    var elIsi = document.getElementById('bar-pasang-isi');
    if (elFasa) { elFasa.textContent = f.nama; }
    if (elMasa) { elMasa.textContent = format(b) + (p.pemasa.dijeda ? ' (jeda)' : ''); }
    if (elIsi) {
      var peratus = p.pemasa.jumlahSaat ? Math.max(0, Math.min(100, (b / p.pemasa.jumlahSaat) * 100)) : 0;
      elIsi.style.transform = 'scaleX(' + (peratus / 100).toFixed(3) + ')';
    }
    /* Amaran hanya di tetingkap murid (bukan #/guru) supaya tidak berbunyi dua kali */
    if (MJ.runtime.halamanGuru || p.pemasa.dijeda) { return; }
    /* QA-025: amaran "tinggal 2 minit" hanya untuk fasa yang lebih panjang daripada 2 minit */
    if (b <= 120 && b > 0 && !p.pemasa.amaran2 && (p.pemasa.jumlahSaat || 0) > 120) {
      MJ.keadaan.ubah(function (q) { q.pemasa.amaran2 = true; });
      MJ.bunyi.loceng();
      MJ.u.toast('Loceng jeti: tinggal 2 minit!');
    } else if (b === 0 && !p.pemasa.tamatBerbunyi) {
      MJ.keadaan.ubah(function (q) { q.pemasa.tamatBerbunyi = true; });
      MJ.bunyi.loceng();
      MJ.u.toast('Masa fasa ini sudah tamat.');
    }
  }

  function init() {
    if (detik) { clearInterval(detik); }
    detik = setInterval(paparkan, 1000);
    MJ.bas.on('dataBerubah', paparkan);
    paparkan();
  }

  return { init: init, tetapFasa: tetapFasa, mula: mula, jeda: jeda, tambah: tambah,
           baki: baki, format: format, paparkan: paparkan };
})();
