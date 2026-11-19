/* =====================================================================
   bonus.js - S7 Bantu Dahulu & Peti Bonus (#/bonus/<bot>)
   Peti Bonus KEKAL BERANTAI sehingga copPenolong >= 1.
   QA-012: rekod klip murid disimpan sebagai bonusKlipMenunggu. Bintang Laut
   dan cadangan Jurutera Rakit hanya dikira daripada bonusKlip, yang
   ditetapkan guru melalui Panel Guru > Kelulusan > "Simpan klip".
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.bonus = (function () {
  'use strict';
  var u = MJ.u;
  var D = MJ.KANDUNGAN.dialog;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var akarS = null;
  var botS = null;
  var berantaiTadi = null;
  var tandaKlip = '';

  function papar(akar, param) {
    akarS = akar;
    botS = param[0] && u.bot(param[0]) ? param[0] : null;
    if (!botS) { MJ.penghala.pergi('#/peta'); return; }
    lukis(true);
  }

  /* Papan Rakit: hanya rekod yang DISAHKAN guru */
  function papanKlip(p) {
    var senarai = MJ.KANDUNGAN.bot.map(function (b) { return { id: b.id, k: p.bot[b.id].bonusKlip }; })
      .filter(function (x) { return typeof x.k === 'number'; })
      .sort(function (a, c) { return c.k - a.k; });
    if (!senarai.length) { return '<p class="kecil">' + u.esc(TS.bonusPapanKosong) + '</p>'; }
    return '<ol class="papan-klip">' + senarai.map(function (x) {
      return '<li>' + u.lencanaBot(x.id) + ' <b>' + x.k + ' klip</b></li>';
    }).join('') + '</ol>';
  }

  function statusKlip(b) {
    if (typeof b.bonusKlipMenunggu === 'number') {
      return '<p class="status-klip menunggu">' + u.esc(u.isi(TS.bonusMenunggu, { n: b.bonusKlipMenunggu })) + '</p>';
    }
    if (typeof b.bonusKlip === 'number') {
      return '<p class="status-klip ya">' + u.esc(u.isi(TS.bonusDisahkan, { n: b.bonusKlip })) + '</p>';
    }
    return '';
  }

  function tanda(p) {
    return JSON.stringify(MJ.KANDUNGAN.bot.map(function (b) {
      return [p.bot[b.id].bonusKlip, b.id === botS ? p.bot[b.id].bonusKlipMenunggu : 0];
    }));
  }

  function lukis(pertama) {
    var akar = akarS;
    if (!akar) { return; }
    var p = MJ.keadaan.permainan();
    var b = p.bot[botS];
    var berantai = (b.copPenolong || 0) < 1;
    if (berantai) {
      akar.innerHTML =
        '<section class="bonus">' +
          '<header class="kepala-misi"><h1>' + u.lencanaBot(botS) + ' ' + u.esc(TS.petaBonus) + '</h1>' +
            '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></header>' +
          '<div class="peti-berantai kad">' +
            '<div class="ilus-rantai" aria-hidden="true">' + MJ.ikon.peti(false) + '<div class="rantai"></div></div>' +
            '<div><h2>' + u.esc(TS.bonusTajukBantu) + '</h2>' +
            '<ol class="arahan">' + TS.bonusArahanBantu.map(function (t) { return '<li>' + u.tebal(t) + '</li>'; }).join('') + '</ol></div>' +
          '</div>' +
        '</section>';
      if (pertama) { MJ.dialog.mainkan(D.bantu); }
      berantaiTadi = true;
      return;
    }
    var baruBuka = !b.bonusDibuka || berantaiTadi === true;
    berantaiTadi = false;   /* ditetapkan SEBELUM ubah() supaya kemasKini tidak melukis semula */
    tandaKlip = tanda(p);
    if (!b.bonusDibuka) { MJ.keadaan.ubah(function (q) { q.bot[botS].bonusDibuka = true; }); }
    var nilaiAwal = typeof b.bonusKlipMenunggu === 'number' ? b.bonusKlipMenunggu : (typeof b.bonusKlip === 'number' ? b.bonusKlip : 0);
    akar.innerHTML =
      '<section class="bonus">' +
        '<header class="kepala-misi"><h1>' + u.lencanaBot(botS) + ' ' + u.esc(TS.petaBonus) + '</h1>' +
          '<div class="ilus-rantai kecil-ilus' + (baruBuka ? ' putus' : ' terbuka') + '" aria-hidden="true">' + MJ.ikon.peti(true) + '<div class="rantai"></div></div>' +
          '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></header>' +
        '<div class="bonus-isi">' +
          '<div class="kad">' +
            '<h2>' + u.esc(TS.bonusTajukRakit) + '</h2>' +
            '<ol class="arahan">' + TS.bonusArahanRakit.map(function (t) { return '<li>' + u.tebal(t) + '</li>'; }).join('') + '</ol>' +
            '<div class="input-klip"><label for="klip">' + u.esc(TS.bonusLabelKlip) + '</label>' +
              '<button class="btn" type="button" id="klip-tolak" aria-label="' + u.esc(TS.klipKurang) + '">-</button>' +
              '<input id="klip" type="number" min="0" max="200" inputmode="numeric" value="' + nilaiAwal + '">' +
              '<button class="btn" type="button" id="klip-tambah" aria-label="' + u.esc(TS.klipTambah) + '">+</button>' +
              '<button class="btn btn-utama" type="button" id="klip-simpan">' + u.esc(TS.bonusSimpan) + '</button></div>' +
            '<div id="status-klip">' + statusKlip(b) + '</div>' +
          '</div>' +
          '<div class="kad"><h2>' + u.esc(TS.bonusPapan) + '</h2><div id="papan-klip">' + papanKlip(p) + '</div></div>' +
        '</div>' +
      '</section>';
    if (baruBuka) {
      MJ.bunyi.dering();
      MJ.dialog.mainkan(D.bonusBuka);
    }
    berantaiTadi = false;
    var input = u.$('#klip', akar);
    u.$('#klip-tolak', akar).addEventListener('click', function () { input.value = Math.max(0, (parseInt(input.value, 10) || 0) - 1); });
    u.$('#klip-tambah', akar).addEventListener('click', function () { input.value = Math.min(200, (parseInt(input.value, 10) || 0) + 1); });
    u.$('#klip-simpan', akar).addEventListener('click', function () {
      var n = Math.max(0, Math.min(200, parseInt(input.value, 10) || 0));
      MJ.keadaan.ubah(function (q) { q.bot[botS].bonusKlipMenunggu = n; });
      MJ.bunyi.plup();
      u.toast(u.isi(TS.bonusToast, { bot: u.bot(botS).nama, n: n }));
      kemasStatus();
    });
  }

  /* Kemas kini status & papan tanpa melukis semula input */
  function kemasStatus() {
    if (!akarS || !botS) { return; }
    var p = MJ.keadaan.permainan();
    tandaKlip = tanda(p);
    var s = u.$('#status-klip', akarS);
    if (s) { s.innerHTML = statusKlip(p.bot[botS]); }
    var pk = u.$('#papan-klip', akarS);
    if (pk) { pk.innerHTML = papanKlip(p); }
  }

  return {
    papar: papar,
    kemasKini: function () {
      /* lukis semula hanya jika status rantai berubah (elak ganggu input) */
      if (!akarS || !botS) { return; }
      var p = MJ.keadaan.permainan();
      var b = p.bot[botS];
      var berantai = (b.copPenolong || 0) < 1;
      if (berantai !== berantaiTadi) { lukis(false); return; }
      if (!berantai && tanda(p) !== tandaKlip) { kemasStatus(); }
    },
    tutup: function () { akarS = null; botS = null; berantaiTadi = null; }
  };
})();
