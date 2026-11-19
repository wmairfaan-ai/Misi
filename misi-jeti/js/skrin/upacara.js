/* =====================================================================
   upacara.js - S11 Upacara Jeti (#/upacara)
   Loceng x3 -> skrol pengisytiharan Mak Tok -> gelaran diumumkan satu demi
   satu (kucing meraikan, topi nakhoda, sorakan ombak) -> kuasa (Nakhoda:
   Objek Misteri + bot dicabar; Jurutera: peraturan rakit; disimpan dalam
   sesiSeterusnya) -> pusingan kemenangan (bermain-kejar) -> Tiket Keluar.
   Gelaran dibaca daripada p.upacara (ditetapkan guru dalam Panel Guru).
   QA-005 (pusingan 4): skrol dan gelaran sebelah-menyebelah; gelaran
   terkini dipaparkan penuh dalam "sorotan", yang lain sebagai senarai
   ringkas; langkah kuasa menggantikan kedua-duanya (bukan ditambah di bawah).
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.upacara = (function () {
  'use strict';
  var u = MJ.u;
  var D = MJ.KANDUNGAN.dialog;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var akarS = null;
  var langkah = 'mula';      // mula | gelaran | kuasa | tamat
  var idx = 0;
  var senarai = [];
  var tandaGelaran = '';
  var pilihan = {};
  var umumDikunci = false;

  var LOCENG = '<svg viewBox="0 0 64 64" class="loceng-ilus" aria-hidden="true">' +
    '<path d="M32 4 V10" stroke="#5E3B1F" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M14 46 Q14 14 32 12 Q50 14 50 46 Z" fill="#F2C230" stroke="#7a5a00" stroke-width="3" stroke-linejoin="round"/>' +
    '<rect x="10" y="44" width="44" height="7" rx="3" fill="#E0A800" stroke="#7a5a00" stroke-width="3"/>' +
    '<circle cx="32" cy="56" r="5" fill="#7a5a00"/></svg>';

  function adaKucing() { return !!(MJ.kucing && MJ.kucing.sedia); }

  /* Susunan: Penjejak -> Jurutera -> Pegawai -> Nakhoda (kemuncak) */
  function binaSenarai(p) {
    var up = p.upacara || {};
    var s = [];
    var pj = (up.penjejak || []).filter(function (id) { return !!u.bot(id); });
    if (pj.length) { s.push({ jenis: 'penjejak', bots: pj }); }
    ['jurutera', 'pegawai', 'nakhoda'].forEach(function (x) {
      if (up[x] && u.bot(up[x])) { s.push({ jenis: x, bots: [up[x]] }); }
    });
    return s;
  }

  function papar(akar) {
    akarS = akar;
    langkah = 'mula';
    idx = 0;
    pilihan = {};
    umumDikunci = false;
    lukis();
  }

  function lukis() {
    var akar = akarS;
    if (!akar) { return; }
    var p = MJ.keadaan.permainan();
    senarai = binaSenarai(p);
    tandaGelaran = JSON.stringify(p.upacara || {});
    var G = MJ.KANDUNGAN.gelaran;
    akar.innerHTML =
      '<section class="upacara">' +
        '<header class="kepala-misi"><h1>' + u.esc(TS.upacaraTajuk) + '</h1>' +
          '<div class="upacara-atas">' + LOCENG + '<div class="baris-butang" id="up-kawal"></div></div></header>' +
        '<div class="sorak-ombak" aria-hidden="true">' + MJ.KANDUNGAN.bot.map(function (b, i) {
          return '<span class="ombak-item" style="--i:' + i + '">' + u.lencanaBot(b.id) + '</span>';
        }).join('') + '</div>' +
        '<div class="upacara-isi" id="up-isi">' +
          '<div class="skrol" id="up-skrol" aria-hidden="true"><header>' + MJ.ikon.potret('maktok') +
            '<span>' + u.esc(TS.upacaraSkrol) + '</span></header><p>' + u.esc(MJ.KANDUNGAN.pengisytiharan) + '</p></div>' +
          '<div class="upacara-gelaran">' +
            '<div class="kad sorotan-gelaran" id="up-sorotan" aria-live="polite"><p class="kecil">' +
              u.esc(senarai.length ? TS.upacaraSorotanKosong : TS.upacaraTiadaGelaran) + '</p></div>' +
            (senarai.length ? '<ul class="senarai-gelaran">' + senarai.map(function (g, i) {
              return '<li class="kad-gelaran" data-i="' + i + '"><span class="nama-gelaran">' + u.esc(G[g.jenis].nama) + '</span>' +
                '<span class="isi-gelaran"><span class="tersembunyi" aria-hidden="true">?</span></span></li>';
            }).join('') + '</ul>' : '') +
          '</div>' +
        '</div>' +
        '<div id="up-kuasa"></div>' +
      '</section>';
    lukisKawal();
  }

  function lukisKawal() {
    var k = akarS ? u.$('#up-kawal', akarS) : null;
    if (!k) { return; }
    var h = '';
    if (langkah === 'mula') {
      h = '<button class="btn btn-aksen" id="up-loceng">' + u.esc(TS.upacaraLoceng) + '</button>';
    } else if (langkah === 'gelaran') {
      h = idx < senarai.length ?
        '<button class="btn btn-aksen" id="up-umum">' + u.esc(TS.upacaraUmum) + ' (' + (idx + 1) + '/' + senarai.length + ')</button>' :
        '<button class="btn btn-utama" id="up-terus">' + u.esc(TS.upacaraTerus) + '</button>';
    } else if (langkah === 'kuasa') {
      h = '<button class="btn btn-aksen" id="up-menang">' + u.esc(TS.upacaraMenang) + '</button>';
    } else {
      h = '<a class="btn btn-utama" href="#/tiket">' + u.esc(TS.upacaraKeTiket) + '</a>';
    }
    k.innerHTML = h;
    var b;
    if ((b = u.$('#up-loceng', k))) { b.addEventListener('click', mulaUpacara); }
    if ((b = u.$('#up-umum', k))) { b.addEventListener('click', umumkan); if (umumDikunci) { b.disabled = true; } }
    if ((b = u.$('#up-terus', k))) { b.addEventListener('click', function () { keKuasa(); }); }
    if ((b = u.$('#up-menang', k))) { b.addEventListener('click', kemenangan); }
  }

  function mulaUpacara() {
    var akar = akarS;
    var btn = u.$('#up-loceng', akar);
    if (btn) { btn.disabled = true; }
    MJ.bunyi.sediakan();
    var loc = u.$('.loceng-ilus', akar);
    if (loc) { loc.classList.add('berayun'); }
    [0, 900, 1800].forEach(function (t) { u.tunda(function () { MJ.bunyi.loceng(); }, t); });
    u.tunda(function () {
      var s = u.$('#up-skrol', akarS);
      if (s) { s.classList.add('terbuka'); s.setAttribute('aria-hidden', 'false'); }
      langkah = 'gelaran';
      lukisKawal();
    }, 2600);
  }

  function sorakOmbak() {
    var so = u.$('.sorak-ombak', akarS);
    if (!so) { return; }
    so.classList.remove('main');
    void so.offsetWidth;   /* mula semula animasi */
    so.classList.add('main');
  }

  function umumkan() {
    /* QA-033: satu gelaran setiap kali; butang dikunci ~2.5 s untuk detik dramatik */
    if (umumDikunci) { return; }
    if (idx >= senarai.length) { keKuasa(); return; }
    umumDikunci = true;
    u.tunda(function () {
      umumDikunci = false;
      var bu = akarS ? u.$('#up-umum', akarS) : null;
      if (bu) { bu.disabled = false; }
    }, 2500);
    var g = senarai[idx];
    var G = MJ.KANDUNGAN.gelaran[g.jenis];
    var lencana = g.bots.map(function (id) { return u.lencanaBot(id); }).join(' ');
    var li = u.$('.kad-gelaran[data-i="' + idx + '"]', akarS);
    if (li) {
      u.$('.isi-gelaran', li).innerHTML = lencana;
      li.classList.add('diumumkan');
    }
    var sorot = u.$('#up-sorotan', akarS);
    if (sorot) {
      sorot.innerHTML = '<h2>' + u.esc(G.nama) + '</h2>' +
        '<p class="besar">' + lencana + '</p>' +
        '<p class="kecil">' + u.esc(G.huraian) + '</p>' +
        (G.akses ? '<p class="kuasa">' + u.esc(G.akses) + '</p>' : '');
      sorot.classList.remove('baru');
      void sorot.offsetWidth;
      sorot.classList.add('baru');
    }
    MJ.bunyi.ombak(true);
    sorakOmbak();
    u.toast(u.isi(TS.upacaraToast, { gelaran: G.nama, bot: g.bots.map(function (id) { return u.bot(id).nama; }).join(', ') }));
    if (adaKucing()) {
      MJ.dialog.mainkan(D.upacara);
      MJ.kucing.hantar('meraikan');
      MJ.kucing.setTopi(true);
    }
    idx++;
    lukisKawal();   /* selepas gelaran terakhir: butang "Teruskan" (gelaran kekal dipaparkan) */
  }

  /* ---------------- Kuasa untuk sesi seterusnya ---------------- */
  function keKuasa() {
    langkah = 'kuasa';
    var sek = u.$('.upacara', akarS);
    if (sek) { sek.classList.add('langkah-kuasa'); }
    lukisKawal();
    lukisKuasa();
  }

  function lukisKuasa() {
    var bekas = u.$('#up-kuasa', akarS);
    if (!bekas) { return; }
    var up = MJ.keadaan.permainan().upacara || {};
    var nakhoda = up.nakhoda && u.bot(up.nakhoda) ? up.nakhoda : null;
    var jurutera = up.jurutera && u.bot(up.jurutera) ? up.jurutera : null;
    if (!nakhoda && !jurutera) {
      bekas.innerHTML = '<div class="kad kuasa-pilih"><p>' + u.esc(TS.upacaraTiadaKuasa) + '</p></div>';
      return;
    }
    var G = MJ.KANDUNGAN.gelaran;
    var butang = function (jenis, nilai, teks) {
      return '<button class="btn' + (pilihan[jenis] === nilai ? ' aktif' : '') + '" data-kuasa="' + jenis + '" data-nilai="' + u.esc(nilai) +
        '" aria-pressed="' + (pilihan[jenis] === nilai) + '">' + teks + '</button>';
    };
    var kiri = '', kanan = '';
    if (nakhoda) {
      kiri = '<h3>' + u.esc(G.nakhoda.nama) + ' ' + u.lencanaBot(nakhoda) + '</h3>' +
        '<p class="label-kuasa">' + u.esc(TS.upacaraPilihObjek) + '</p><div class="baris-butang">' +
        MJ.KANDUNGAN.objekMisteri.map(function (o) { return butang('objekMisteri', o, u.esc(o)); }).join('') + '</div>' +
        '<p class="label-kuasa">' + u.esc(TS.upacaraBotDicabar) + '</p><div class="baris-butang">' +
        MJ.KANDUNGAN.bot.filter(function (b) { return b.id !== nakhoda; }).map(function (b) {
          return butang('botDicabar', b.id, u.lencanaBot(b.id));
        }).join('') + '</div>';
    }
    if (jurutera) {
      kanan = '<h3>' + u.esc(G.jurutera.nama) + ' ' + u.lencanaBot(jurutera) + '</h3>' +
        '<p class="label-kuasa">' + u.esc(TS.upacaraPilihRakit) + '</p><div class="baris-butang">' +
        MJ.KANDUNGAN.peraturanRakit.map(function (r) { return butang('peraturanRakit', r, u.esc(r)); }).join('') + '</div>';
    }
    kanan += '<div class="baris-butang"><button class="btn btn-utama" id="up-simpan-kuasa">' + u.esc(TS.upacaraSimpanKuasa) + '</button></div>';
    bekas.innerHTML = '<div class="kad kuasa-pilih"><h2>' + u.esc(TS.upacaraKuasaTajuk) + '</h2>' +
      '<div class="kuasa-grid"><div>' + kiri + '</div><div>' + kanan + '</div></div></div>';
    u.$$('[data-kuasa]', bekas).forEach(function (b) {
      b.addEventListener('click', function () {
        pilihan[b.getAttribute('data-kuasa')] = b.getAttribute('data-nilai');
        MJ.bunyi.plup();
        lukisKuasa();
      });
    });
    u.$('#up-simpan-kuasa', bekas).addEventListener('click', function () {
      MJ.keadaan.ubahSesi(function (s) {
        if (pilihan.objekMisteri) { s.objekMisteri = pilihan.objekMisteri; }
        if (pilihan.botDicabar) { s.botDicabar = pilihan.botDicabar; }
        if (pilihan.peraturanRakit) { s.peraturanRakit = pilihan.peraturanRakit; }
        s.dikemasKini = Date.now();
      });
      MJ.bunyi.dering();
      u.toast(TS.upacaraKuasaDisimpan);
    });
  }

  /* ---------------- Pusingan kemenangan ---------------- */
  function kemenangan() {
    langkah = 'tamat';
    lukisKawal();
    MJ.bunyi.ombak(true);
    sorakOmbak();
    if (adaKucing()) {
      MJ.dialog.mainkan(D.kemenangan, function () {
        u.tunda(function () { if (MJ.pasangan) { MJ.pasangan.mula('kejar', true); } }, 300);
      });
    }
  }

  return {
    papar: papar,
    kemasKini: function () {
      /* Lukis semula hanya sebelum upacara bermula, jika guru menukar gelaran */
      if (!akarS || langkah !== 'mula') { return; }
      var t = JSON.stringify(MJ.keadaan.permainan().upacara || {});
      if (t !== tandaGelaran) { lukis(); }
    },
    tutup: function () { akarS = null; }
  };
})();
