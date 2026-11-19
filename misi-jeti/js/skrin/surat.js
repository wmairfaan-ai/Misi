/* =====================================================================
   surat.js - S6 Surat Petunjuk (tindanan). MJ.surat.buka(botId, misi)
   Tangga P1 -> P2 -> P3, satu Kerang Petunjuk setiap surat.
   Surat yang sudah dibuka boleh dibaca semula percuma (Beg Surat).
   Selepas P3: TIADA P4, hanya respons terbuka (Spesifikasi 6.5).
   Soalan misi tidak ditulis semula.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.surat = (function () {
  'use strict';
  var u = MJ.u;
  var TX = MJ.KANDUNGAN.teksSkrin;
  var modalS = null;

  function adaKucing() { return !!(MJ.kucing && MJ.kucing.sedia); }
  function modTablet() { return MJ.keadaan.tetapan().mod === 'tablet'; }

  function pilihAwal(id, misi, p) {
    if (misi && MJ.keadaan.misiBoleh(id, misi, p)) { return misi; }
    for (var n = 3; n >= 1; n--) { if (MJ.keadaan.misiBoleh(id, n, p)) { return n; } }
    return 1;
  }

  function tahapDibuka(b, misi) {
    return b.suratDibuka.filter(function (s) { return s.misi === misi; })
      .map(function (s) { return s.tahap; })
      .sort(function (a, c) { return a - c; });
  }

  function buka(id, misi) {
    /* QA-010: tiada surat (atau dialog Kiko) semasa Mod Uji */
    if (MJ.runtime.modUji) { return; }
    var p = MJ.keadaan.permainan();
    if (!p.bot[id]) { return; }
    if (modalS) { modalS.tutup(); }
    misi = pilihAwal(id, misi, p);
    MJ.runtime.suratBuka = true;
    if (MJ.pasangan) { MJ.pasangan.lerai(true); }
    modalS = u.modal('<div class="surat-bekas"></div>', {
      kelas: 'modal-surat',
      semasaTutup: function () { MJ.runtime.suratBuka = false; modalS = null; }
    });
    lukis(id, misi, null);
  }

  function lukis(id, misi, tahapDipapar) {
    if (!modalS) { return; }
    var p = MJ.keadaan.permainan();
    var b = p.bot[id];
    var S = MJ.KANDUNGAN.surat[misi];
    var sudah = tahapDibuka(b, misi);
    var seterusnya = sudah.length + 1;
    var bekas = modalS.el.querySelector('.surat-bekas');

    var tab = '<div class="tab-misi" role="tablist">' + [1, 2, 3].map(function (n) {
      var boleh = MJ.keadaan.misiBoleh(id, n, p);
      return '<button class="btn btn-tab' + (n === misi ? ' aktif' : '') + '" data-tab="' + n + '"' +
        (boleh ? '' : ' disabled') + ' role="tab" aria-selected="' + (n === misi) + '">' + u.esc(u.isi(TX.suratTabMisi, { n: n })) + '</button>';
    }).join('') + '</div>';

    var html = '<header class="surat-kepala"><h2>' + u.lencanaBot(id) + ' ' + u.esc(TX.suratBeg) + '</h2>' +
      MJ.misi.kerangHtml(b.kerang) + '</header>' + tab;

    if (tahapDipapar) {
      html += '<article class="surat-kertas jenis-' + misi + '">' +
        '<header>' + MJ.ikon.potret(S.potret) + '<div><b>' + u.esc(S.jenis) + '</b>' +
        '<span class="blok kecil">' + u.esc(u.isi(TX.suratTahap, { n: tahapDipapar })) + '</span></div></header>' +
        '<p class="surat-teks">' + u.esc(S.p[tahapDipapar - 1]) + '</p></article>' +
        '<div class="baris-butang"><button class="btn" data-kembali>' + u.esc(TX.suratKembaliBeg) + '</button>' +
        '<button class="btn btn-utama" data-tutup-surat>' + u.esc(TX.tutup) + '</button></div>';
    } else {
      html += '<div class="beg-surat">';
      if (sudah.length) {
        html += '<p>' + u.esc(TX.suratSudahDibuka) + '</p><div class="baris-butang">' +
          sudah.map(function (t) { return '<button class="btn" data-baca="' + t + '">' + u.esc(u.isi(TX.suratBaca, { n: t })) + '</button>'; }).join('') + '</div>';
      } else {
        html += '<p>' + u.esc(TX.suratTiada) + '</p>';
      }
      if (seterusnya === 3 && S.kunciP3 && !MJ.keadaan.suratP3Dibuka(id, misi, p)) {
        /* QA-044: P3 dikunci sehingga krew menguji di air; tiada kerang ditolak */
        html += '<p class="nota surat-dikunci">' + u.esc(S.kunciP3) + '</p>';
      } else if (seterusnya <= 3) {
        if (b.kerang > 0) {
          html += '<div class="baris-butang"><button class="btn btn-aksen" data-tebus>' + MJ.ikon.kerang +
            ' ' + u.esc(u.isi(TX.suratTebus, { n: seterusnya })) + '</button></div>';
        } else {
          html += '<p class="nota">' + u.esc(TX.suratKerangHabis) + '</p>';
        }
      } else {
        html += '<p class="nota terbuka">' + u.esc(S.terbuka) + '</p>';
      }
      html += '<div class="baris-butang">' +
        (!modTablet() && b.kerang > 0 ? '<button class="btn" data-hadiah>' + u.esc(TX.suratHadiah) + '</button>' : '') +
        '<button class="btn btn-utama" data-tutup-surat>' + u.esc(TX.tutup) + '</button></div></div>';
    }
    bekas.innerHTML = html;

    u.$$('[data-tab]', bekas).forEach(function (t) {
      t.addEventListener('click', function () { lukis(id, parseInt(t.getAttribute('data-tab'), 10), null); });
    });
    u.$$('[data-baca]', bekas).forEach(function (t) {
      t.addEventListener('click', function () { lukis(id, misi, parseInt(t.getAttribute('data-baca'), 10)); });
    });
    u.$$('[data-tutup-surat]', bekas).forEach(function (t) {
      t.addEventListener('click', function () { if (modalS) { modalS.tutup(); } });
    });
    var kb = u.$('[data-kembali]', bekas);
    if (kb) { kb.addEventListener('click', function () { lukis(id, misi, null); }); }
    var tb = u.$('[data-tebus]', bekas);
    if (tb) { tb.addEventListener('click', function () { tebus(id, misi); }); }
    var hd = u.$('[data-hadiah]', bekas);
    if (hd) { hd.addEventListener('click', function () { hadiah(id, misi); }); }
    if (!tahapDipapar && seterusnya > 3) { MJ.dialog.satu('kiko', S.terbuka); }
  }

  function tebus(id, misi) {
    var tahap = 0;
    var S = MJ.KANDUNGAN.surat[misi];
    MJ.keadaan.ubah(function (q) {
      var b = q.bot[id];
      var sudah = tahapDibuka(b, misi);
      var p3Kunci = sudah.length === 2 && S && S.kunciP3 && !MJ.keadaan.suratP3Dibuka(id, misi, q);
      if (b.kerang > 0 && sudah.length < 3 && !p3Kunci) {
        b.kerang -= 1;
        tahap = sudah.length + 1;
        b.suratDibuka.push({ misi: misi, tahap: tahap, masa: Date.now() });
      }
    });
    if (!tahap) { lukis(id, misi, null); return; }
    var bekas = modalS ? modalS.el.querySelector('.surat-bekas') : null;
    if (bekas) {
      bekas.innerHTML = '<div class="surat-tiba"><p class="besar">' + u.esc(TX.suratDibawa) + '</p></div>';
    }
    if (adaKucing() && !MJ.runtime.modUji) {
      MJ.kucing.hantar('surat');
      MJ.dialog.satu('kiko', u.isi(TX.suratUntukBot, { bot: u.bot(id).nama }));
    }
    setTimeout(function () { lukis(id, misi, tahap); }, 1500);
  }

  /* QA-004 (keputusan Pak Cik): hadiah Kerang TIDAK memberi Cop Penolong secara
     terus. Ia mencipta PERMINTAAN dalam permintaanPenolong; guru Lulus/Tolak
     dalam Panel Guru (Kelulusan). Satu permintaan tertunda bagi setiap
     pasangan pemberi -> penerima. */
  function hadiah(id, misi) {
    var TS = MJ.KANDUNGAN.teksSistem;
    u.pilihBot(TX.pilihHadiah, function (sasaran) {
      return sasaran === id ? { boleh: false, sebab: TX.botSendiri } : { boleh: true };
    }, function (sasaran) {
      var berjaya = false;
      var permintaanBaru = false;
      MJ.keadaan.ubah(function (q) {
        var b = q.bot[id];
        if (b.kerang > 0) {
          b.kerang -= 1;
          q.bot[sasaran].kerang += 1;
          berjaya = true;
          var sudahAda = (q.permintaanPenolong || []).some(function (r) {
            return r.penolong === id && r.dibantu === sasaran;
          });
          if (!sudahAda) {
            q.permintaanPenolong.push({ id: Date.now() + '-' + id + '-hadiah', dibantu: sasaran, penolong: id,
              masa: Date.now(), jenis: 'hadiah' });
            permintaanBaru = true;
          }
        }
      });
      if (berjaya) {
        MJ.bunyi.plup();
        u.toast(u.isi(permintaanBaru ? TS.hadiahDihantar : TS.hadiahMenunggu, { sasaran: u.bot(sasaran).nama }));
      }
      lukis(id, misi, null);
    });
  }

  return { buka: buka };
})();
