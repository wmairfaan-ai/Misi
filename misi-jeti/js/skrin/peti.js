/* =====================================================================
   peti.js - S9 Peti Mak Tok (fasa bersama, seluruh kelas)
   Seret 6 serpihan ke papan Hukum Muara. Perkataan kosong TIDAK
   ditawarkan sebagai pilihan: kelas menyebutnya, guru tekan "Isi" dalam PG.
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.peti = (function () {
  'use strict';
  var u = MJ.u;
  var D = MJ.KANDUNGAN.dialog;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var akarS = null;
  var seretS = null;
  var sudahSapa = false;
  var pilihBot = null;   // bot yang kad serpihannya sedang dipaparkan dalam dulang

  function bilDiletakKira(pt, H) {
    return H.filter(function (h) { return !!pt.serpihanDiletak[h.id]; }).length;
  }

  function teksSerpihan(h, diisi) {
    var bah = u.esc(h.serpihan).split('____');
    var tengah = diisi ? '<b class="isian">' + u.esc(h.isian) + '</b>' : '<span class="kosong">____</span>';
    return bah.join(tengah);
  }

  function papar(akar) {
    akarS = akar;
    lukis();
    if (!sudahSapa) {
      sudahSapa = true;
      MJ.dialog.mainkan(D.peti);
    }
  }

  function lukis() {
    var akar = akarS;
    if (!akar) { return; }
    if (seretS) { seretS.hapus(); seretS = null; }
    var p = MJ.keadaan.permainan();
    var pt = p.peti;
    var H = MJ.KANDUNGAN.hukum;
    var B = MJ.KANDUNGAN.bot;

    /* QA-005 (baki): dulang memaparkan SATU kad serpihan pada satu masa (kad
       semasa), dengan cip bot di atasnya untuk memilih kad lain. Papan hukum
       3 lajur x 2 baris. */
    var senaraiD = u.kocok(H.map(function (h, i) { return { h: h, bot: B[i] }; }), 'peti');
    var sediaD = senaraiD.filter(function (x) { return !pt.serpihanDiletak[x.h.id] && p.bot[x.bot.id].misi3.serpihan; });
    if (!sediaD.some(function (x) { return x.bot.id === pilihBot; })) { pilihBot = sediaD.length ? sediaD[0].bot.id : null; }
    var adaDiDulang = sediaD.length;
    var cip = senaraiD.map(function (x) {
      var diletak = !!pt.serpihanDiletak[x.h.id];
      var ada = p.bot[x.bot.id].misi3.serpihan;
      var status = diletak ? 'diletak' : (ada ? 'sedia' : 'menunggu');
      var label = diletak ? TS.petiCipDiletak : (ada ? TS.petiCipSedia : TS.petiCipMenunggu);
      return '<button type="button" class="cip-serpihan ' + status + (x.bot.id === pilihBot ? ' aktif' : '') + '" data-cip="' + x.bot.id + '" title="' + u.esc(x.bot.nama + ': ' + label) + '"' +
        (status === 'sedia' ? '' : ' disabled') + ' aria-pressed="' + (x.bot.id === pilihBot) + '">' +
        u.lencanaBot(x.bot.id) + '<span class="sr"> ' + u.esc(label) + '</span></button>';
    }).join('');
    var dulang = '<div class="baris-cip">' + cip + '</div>';
    var semasa = null;
    sediaD.forEach(function (x) { if (x.bot.id === pilihBot) { semasa = x; } });
    if (semasa) {
      dulang += '<div class="kad-serpihan" data-serpihan="' + semasa.h.id + '" data-bot="' + semasa.bot.id + '" tabindex="0" role="button" aria-pressed="false">' +
        u.lencanaBot(semasa.bot.id) + '<span>' + teksSerpihan(semasa.h, false) + '</span></div>';
    } else {
      dulang += '<p class="kecil">' + u.esc(bilDiletakKira(pt, H) === H.length ? TS.petiSemuaDiletak : TS.petiMenungguSerpihan) + '</p>';
    }

    var papan = '';
    var bilDiletak = 0;
    H.forEach(function (h) {
      var botId = pt.serpihanDiletak[h.id];
      var diisi = pt.ruangDiisi.indexOf(h.id) >= 0;
      if (botId) { bilDiletak++; }
      papan += '<div class="slot-hukum' + (botId ? ' terisi' : '') + '" data-zon="slot" data-hukum="' + h.id + '" tabindex="0">' +
        '<span class="slot-no">' + h.id + '</span><span class="slot-tajuk">' + u.esc(h.tajuk) + '</span>' +
        '<div class="slot-isi">' + (botId ? teksSerpihan(h, diisi) : '') + '</div></div>';
    });

    var semuaDiisi = H.every(function (h) { return pt.ruangDiisi.indexOf(h.id) >= 0; });
    var sedia = bilDiletak === H.length && semuaDiisi;
    var kunci = '';
    H.forEach(function (h) { kunci += '<span class="bulat' + (pt.serpihanDiletak[h.id] ? ' isi' : '') + '"></span>'; });

    akar.innerHTML =
      '<section class="peti">' +
        '<header class="kepala-misi"><h1>' + u.esc(TS.petiTajuk) + '</h1><p class="sub">' + u.esc(TS.petiSub) + '</p></header>' +
        '<div class="peti-susun">' +
          '<div class="peti-atas">' +
            '<div class="serpihan-dulang" data-zon="dulang">' + dulang + '</div>' +
            '<div class="peti-bawah">' +
              '<div class="peti-ilus' + (pt.dibuka ? ' terbuka' : '') + '" data-labuh="peti-mak-tok">' + MJ.ikon.peti(pt.dibuka) + '</div>' +
              '<div class="peti-status">' +
                '<div class="kunci-bulat" aria-label="' + bilDiletak + ' daripada 6 serpihan">' + kunci + '</div>' +
                '<p class="kecil">' + u.esc(bilDiletak < H.length ? TS.petiSeret : (semuaDiisi ? '' : TS.petiSebut)) + '</p>' +
                (sedia && !pt.dibuka ? '<button class="btn btn-aksen besar" id="buka-peti">' + u.esc(TS.petiBuka) + '</button>' : '') +
                (pt.dibuka ? '<a class="btn btn-utama" href="#/galeri">' + u.esc(TS.petiKeGaleri) + '</a>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="papan-hukum">' + papan + '</div>' +
        '</div>' +
      '</section>';
    u.$$('[data-cip]', akar).forEach(function (b) {
      b.addEventListener('click', function () {
        pilihBot = b.getAttribute('data-cip');
        lukis();
        var kad = u.$('.kad-serpihan[data-serpihan]', akarS);
        if (kad) { kad.focus(); }
      });
    });

    if (adaDiDulang) {
      seretS = MJ.seret.jadikan({
        akar: u.$('.peti-susun', akar), item: '.kad-serpihan[data-serpihan]', zon: '[data-zon="slot"]',
        lepas: function (item, zon) {
          var hid = parseInt(item.getAttribute('data-serpihan'), 10);
          var sasaran = parseInt(zon.getAttribute('data-hukum'), 10);
          if (hid === sasaran) {
            MJ.keadaan.ubah(function (q) { q.peti.serpihanDiletak[hid] = item.getAttribute('data-bot'); });
            MJ.bunyi.plup();
            if (MJ.kucing && MJ.kucing.sedia) { MJ.kucing.hantar('serpihan'); }
          } else {
            MJ.bunyi.ombak(false);
            zon.classList.add('goyang');
            setTimeout(function () { zon.classList.remove('goyang'); }, 500);
            u.toast(TS.petiBelumPadan);
          }
        }
      });
    }
    var bp = u.$('#buka-peti', akar);
    if (bp) { bp.addEventListener('click', bukaPeti); }
  }

  function bukaPeti() {
    MJ.keadaan.ubah(function (q) { q.peti.dibuka = true; });
    MJ.bunyi.ombak(true);
    MJ.bunyi.dering();
    if (MJ.kucing && MJ.kucing.sedia) {
      MJ.kucing.hantar('petiDibuka');
      MJ.kucing.gerakKeElemen('kiko', '[data-labuh="peti-mak-tok"]', 'kanan');
      /* QA-015: pemasa terikat skrin (u.tunda) dan semak skrin semasa sebelum bergomol */
      u.tunda(function () {
        MJ.dialog.mainkan(D.petiBuka, function () {
          u.tunda(function () {
            if (MJ.pasangan && MJ.penghala.nama() === 'peti') { MJ.pasangan.mula('gomol', true); }
          }, 400);
        });
      }, 1100);
    }
  }

  return {
    papar: papar,
    kemasKini: function () { lukis(); },
    tutup: function () { if (seretS) { seretS.hapus(); seretS = null; } akarS = null; }
  };
})();
