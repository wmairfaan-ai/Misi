/* =====================================================================
   penghala.js - penghala berasaskan hash
   #/mula #/daftar #/peta #/misi1[/bot] #/misi2[/bot] #/misi3[/bot]
   #/bonus/bot #/botol/bot #/peti #/galeri #/upacara #/tiket #/guru
   Setiap skrin: MJ.skrin.<nama> = { papar(akar, param[]), tutup?(), kemasKini?(data) }
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.penghala = (function () {
  'use strict';
  var semasa = null;
  var namaSemasa = '';
  var paramSemasa = [];
  var navTerakhir = null;

  function urai() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var bah = h.split('/').filter(function (x) { return x.length > 0; });
    return { nama: bah[0] || '', param: bah.slice(1) };
  }

  function laksana() {
    var r = urai();
    if (MJ.runtime.halamanGuru) {
      if (MJ.pg) { MJ.pg.halamanPenuh(); }
      return;
    }
    if (r.nama === 'guru') {
      /* Tetingkap murid: buka Panel Guru sebagai tindanan, kekal di peta */
      if (MJ.pg) { MJ.pg.buka(); }
      pergi('#/peta');
      return;
    }
    if (!r.nama) {
      r.nama = MJ.keadaan.permainan().dimulakan ? 'peta' : 'mula';
    }
    var s = MJ.skrin[r.nama];
    if (!s) { r.nama = 'peta'; s = MJ.skrin.peta; }

    if (semasa && semasa.tutup) {
      try { semasa.tutup(); } catch (e) { if (window.console) { console.error(e); } }
    }
    MJ.u.bersihPemasaSkrin();
    MJ.dialog.henti();
    MJ.u.tutupSemuaModal();
    MJ.runtime.modUji = false;
    MJ.runtime.suratBuka = false;
    document.documentElement.classList.remove('mod-uji');
    if (MJ.kucing && MJ.kucing.sedia) { MJ.kucing.hantar('konteksBaru'); }

    semasa = s;
    namaSemasa = r.nama;
    paramSemasa = r.param;
    var akar = document.getElementById('skrin');
    akar.innerHTML = '';
    akar.className = 'skrin skrin-' + r.nama;
    akar.scrollTop = 0;
    document.body.setAttribute('data-skrin', r.nama);
    try {
      s.papar(akar, r.param);
    } catch (e2) {
      if (window.console) { console.error('[penghala]', r.nama, e2); }
      akar.innerHTML = '<div class="kad kad-ralat"><h2>Alamak!</h2><p>Skrin ini menghadapi masalah.</p>' +
        '<p><a class="btn" href="#/peta">Kembali ke Peta Jeti</a></p></div>';
    }
    MJ.aktiviti();
  }

  function pergi(hash) {
    if (location.hash === hash) { laksana(); } else { location.hash = hash; }
  }

  function semakNav() {
    if (MJ.runtime.halamanGuru) { return; }
    var p = MJ.keadaan.permainan();
    if (p.navPaksa && p.navPaksa.id !== navTerakhir) {
      navTerakhir = p.navPaksa.id;
      pergi(p.navPaksa.hash);
    }
  }

  function init() {
    var p = MJ.keadaan.permainan();
    navTerakhir = p.navPaksa ? p.navPaksa.id : null;
    window.addEventListener('hashchange', laksana);
    MJ.bas.on('dataBerubah', function (d) {
      semakNav();
      if (!MJ.runtime.halamanGuru && semasa && semasa.kemasKini) {
        try { semasa.kemasKini(d); } catch (e) { if (window.console) { console.error(e); } }
      }
    });
    laksana();
  }

  return {
    init: init, pergi: pergi, muatSemula: laksana,
    nama: function () { return namaSemasa; },
    param: function () { return paramSemasa; }
  };
})();
