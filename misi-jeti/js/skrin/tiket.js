/* =====================================================================
   tiket.js - S12 Tiket Keluar (#/tiket)
   3 soalan daripada KANDUNGAN.tiket dipaparkan besar, satu demi satu.
   Murid menjawab SENDIRI di atas kertas. Tiada input jawapan di skrin.
   Kekunci anak panah kiri/kanan untuk tukar soalan.
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.tiket = (function () {
  'use strict';
  var u = MJ.u;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var akarS = null;
  var i = 0;
  var pendengarKekunci = null;

  function soalan() { return MJ.KANDUNGAN.tiket || []; }

  function papar(akar) {
    akarS = akar;
    i = 0;
    akar.innerHTML =
      '<section class="tiket">' +
        '<header class="kepala-misi"><h1>' + u.esc(TS.tiketTajuk) + '</h1><p class="sub">' + u.esc(TS.tiketSub) + '</p></header>' +
        '<article class="kad-tiket" aria-live="polite"><p class="no-soalan"></p><p class="soalan"></p></article>' +
        '<div class="titik-tiket" aria-hidden="true"></div>' +
        '<div class="baris-butang tengah">' +
          '<button class="btn" id="tiket-sebelum">' + u.esc(TS.tiketSebelum) + '</button>' +
          '<button class="btn btn-utama" id="tiket-seterusnya">' + u.esc(TS.tiketSeterusnya) + '</button>' +
        '</div>' +
      '</section>';
    u.$('#tiket-sebelum', akar).addEventListener('click', function () { ke(i - 1); });
    u.$('#tiket-seterusnya', akar).addEventListener('click', function () { ke(i + 1); });
    pendengarKekunci = function (e) {
      var t = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') { return; }
      if (MJ.pg && MJ.pg.terbuka()) { return; }
      if (e.key === 'ArrowRight') { ke(i + 1); }
      else if (e.key === 'ArrowLeft') { ke(i - 1); }
    };
    document.addEventListener('keydown', pendengarKekunci);
    ke(0);
    MJ.dialog.mainkan(MJ.KANDUNGAN.dialog.tiket);
  }

  function ke(n) {
    var s = soalan();
    if (!akarS || !s.length) { return; }
    i = Math.max(0, Math.min(s.length - 1, n));
    u.$('.no-soalan', akarS).textContent = u.isi(TS.tiketNo, { n: i + 1, jumlah: s.length });
    u.$('.soalan', akarS).textContent = s[i];
    var titik = '';
    for (var k = 0; k < s.length; k++) { titik += '<span' + (k === i ? ' class="aktif"' : '') + '></span>'; }
    u.$('.titik-tiket', akarS).innerHTML = titik;
    u.$('#tiket-sebelum', akarS).disabled = i === 0;
    u.$('#tiket-seterusnya', akarS).disabled = i === s.length - 1;
  }

  return {
    papar: papar,
    tutup: function () {
      if (pendengarKekunci) { document.removeEventListener('keydown', pendengarKekunci); pendengarKekunci = null; }
      akarS = null;
    }
  };
})();
