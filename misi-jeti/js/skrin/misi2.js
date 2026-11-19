/* =====================================================================
   misi2.js - S4 Misi 2: Menara Pak Din
   #/misi2        : taklimat kelas + Mod Uji
   #/misi2/<bot>  : Peti Kod warna (Mod Tablet: ramal/uji/rekod pemerhatian)
   Aplikasi TIDAK memaparkan susunan sebenar sebelum Peti Mak Tok dibuka.
   Animasi menara hanya mengikut PEMERHATIAN bot sendiri.
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.misi2 = (function () {
  'use strict';
  var u = MJ.u;
  var D = MJ.KANDUNGAN.dialog;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var LANGKAH = TS.langkahM2;
  var IDX = { ramal: 0, uji: 1, rekod: 2, kod: 3 };
  var akarS = null;
  var botS = null;
  var seretS = null;

  function papar(akar, param) {
    akarS = akar;
    botS = param[0] && u.bot(param[0]) ? param[0] : null;
    if (!botS) { taklimat(akar); } else { paparBot(akar); }
  }

  function swatch(c) {
    return '<span class="blok-label cecair-' + c.id + '"><span class="swatch" aria-hidden="true"></span>' +
      u.esc(c.nama) + ' (' + u.esc(c.label) + ')</span>';
  }

  function taklimat(akar) {
    /* Susunan swatch = susunan paparan tetap kandungan.js (BUKAN susunan menara) */
    akar.innerHTML =
      '<section class="taklimat">' +
        '<header class="kepala-misi"><h1>' + MJ.misi.tajuk(2) + '</h1>' + MJ.misi.langkahHtml(LANGKAH, 0) + '</header>' +
        '<div class="taklimat-isi">' +
          '<div class="taklimat-ilus" data-labuh="menara">' + MJ.ikon.cawanKosong() +
            '<div class="cecair-meja">' + MJ.KANDUNGAN.cecair.map(swatch).join('') + '</div></div>' +
          '<ol class="arahan">' + TS.misi2Arahan.map(function (t) { return '<li>' + u.tebal(t) + '</li>'; }).join('') + '</ol>' +
        '</div>' +
        '<div class="baris-butang tengah">' +
          '<button class="btn btn-aksen" id="angkat-bendera">' + u.esc(TS.angkatBendera) + '</button>' +
          '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a>' +
        '</div>' +
      '</section>';
    MJ.dialog.mainkan(D.m2Taklimat);
    u.$('#angkat-bendera', akar).addEventListener('click', function () {
      MJ.misi.modUji(akar, 2, function () { MJ.penghala.pergi('#/peta'); });
    });
  }

  function paparBot(akar) {
    var id = botS;
    var p = MJ.keadaan.permainan();
    if (!MJ.keadaan.misiBoleh(id, 2, p)) { MJ.misi.terkunci(akar, 2); return; }
    MJ.misi.keluarBarisan(id);
    akar.innerHTML =
      '<section class="misi-bot">' +
        '<header class="kepala-misi"><h1>' + u.lencanaBot(id) + ' ' + MJ.misi.tajuk(2) + '</h1><div id="langkah-misi"></div></header>' +
        '<div class="misi-badan">' +
          '<div class="misi-utama" id="misi-utama"></div>' +
          '<aside class="misi-sisi"><div id="status-misi"></div>' +
            '<div class="baris-butang lajur"><button class="btn" id="btn-kerang">' + MJ.ikon.kerang + ' ' + u.esc(TS.kerangPetunjuk) + '</button>' +
            '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></div></aside>' +
        '</div>' +
      '</section>';
    u.$('#btn-kerang', akar).addEventListener('click', function () { MJ.surat.buka(id, 2); });
    lukisStatus();
    if (MJ.keadaan.tetapan().mod === 'tablet') {
      lukisTablet();
    } else {
      u.$('#langkah-misi', akar).innerHTML = MJ.misi.langkahHtml(LANGKAH, 3);
      MJ.misi.petiKod(u.$('#misi-utama', akar), id, 2);
    }
  }

  function lukisStatus() {
    if (!akarS || !botS) { return; }
    var s = u.$('#status-misi', akarS);
    if (s) { s.innerHTML = MJ.misi.statusHtml(botS, 2); }
  }

  function setLangkah(L) {
    if (MJ.kucing && MJ.kucing.sedia) { MJ.kucing.hantar('fikirTamat'); }
    MJ.keadaan.ubah(function (q) { q.bot[botS].misi2.langkah = L; });
    lukisTablet();
  }

  function lukisTablet() {
    if (seretS) { seretS.hapus(); seretS = null; }
    var b = MJ.keadaan.permainan().bot[botS];
    var L = b.misi2.langkah || 'ramal';
    u.$('#langkah-misi', akarS).innerHTML = MJ.misi.langkahHtml(LANGKAH, IDX[L]);
    var utama = u.$('#misi-utama', akarS);
    if (L === 'ramal') {
      menaraSeret(utama, 'ramalan', TS.ramalanKami, TS.kunciRamalan, function () { setLangkah('uji'); });
    } else if (L === 'uji') {
      MJ.misi.modUji(utama, 2, function () { setLangkah('rekod'); });
    } else if (L === 'rekod') {
      menaraSeret(utama, 'pemerhatian', TS.pemerhatianKami, TS.simpanPemerhatian, simpanPemerhatian);
    } else {
      paparKod(utama);
    }
  }

  function blok(c) {
    return '<div class="blok-cecair cecair-' + c.id + '" data-cecair="' + c.id + '" tabindex="0" role="button" aria-pressed="false">' +
      '<span class="swatch" aria-hidden="true"></span>' + u.esc(c.nama) + ' (' + u.esc(c.label) + ')</div>';
  }

  /* medan: 'ramalan' | 'pemerhatian'. Indeks 0 = bawah, 2 = atas. */
  function menaraSeret(utama, medan, tajuk, labelButang, onSimpan) {
    var arr = (MJ.keadaan.permainan().bot[botS].misi2[medan] || [null, null, null]).slice();
    var dulang = MJ.KANDUNGAN.cecair.filter(function (c) { return arr.indexOf(c.id) < 0; }).map(blok).join('');
    var slot = function (i, label) {
      var c = arr[i] ? u.cecair(arr[i]) : null;
      return '<div class="slot-cecair" data-zon="' + i + '" tabindex="0" aria-label="' + label + '">' +
        '<span class="slot-label">' + label + '</span>' + (c ? blok(c) : '') + '</div>';
    };
    var lengkap = arr.every(function (x) { return !!x; });
    utama.innerHTML =
      '<div class="m2-menara">' +
        '<p class="arahan-satu">' + u.tebal(medan === 'ramalan' ? TS.misi2Ramal : TS.misi2Rekod) + '</p>' +
        '<div class="dulang-cecair" data-zon="dulang" tabindex="0" aria-label="' + u.esc(TS.dulangCecairLabel) + '">' + dulang + '</div>' +
        '<div class="cawan-menara" data-labuh="menara"><h3>' + u.esc(tajuk) + '</h3>' +
          slot(2, 'ATAS') + slot(1, 'TENGAH') + slot(0, 'BAWAH') + '</div>' +
        '<div class="baris-butang tengah"><button class="btn btn-aksen" id="simpan-menara"' + (lengkap ? '' : ' disabled') + '>' + u.esc(labelButang) + '</button></div>' +
        '<div class="mesej-kod" aria-live="polite"></div>' +
      '</div>';
    var kotak = u.$('.m2-menara', utama);
    seretS = MJ.seret.jadikan({
      akar: kotak, item: '.blok-cecair', zon: '[data-zon]',
      lepas: function (item, zon) {
        var c = item.getAttribute('data-cecair');
        var z = zon.getAttribute('data-zon');
        MJ.keadaan.ubah(function (q) {
          var a = q.bot[botS].misi2[medan];
          var lama = a.indexOf(c);
          if (lama >= 0) { a[lama] = null; }
          if (z !== 'dulang') { a[parseInt(z, 10)] = c; }
        });
        MJ.bunyi.plup();
        if (seretS) { seretS.hapus(); seretS = null; }
        menaraSeret(utama, medan, tajuk, labelButang, onSimpan);
      }
    });
    u.$('#simpan-menara', kotak).addEventListener('click', function () { onSimpan(utama); });
    /* QA-020: kucing 'terfikir' semasa langkah Ramal */
    if (medan === 'ramalan' && MJ.kucing && MJ.kucing.sedia) { MJ.kucing.hantar('fikir'); }
  }

  function simpanPemerhatian(utama) {
    var obs = MJ.keadaan.permainan().bot[botS].misi2.pemerhatian;
    var kodTeks = obs.map(function (c) { return u.cecair(c).huruf; }).join('');
    var bekasMesej = u.$('.m2-menara', utama);
    MJ.misi.semak(bekasMesej, botS, 2, [kodTeks], true).then(function (betul) {
      if (betul) { setLangkah('kod'); }
      else {
        var b = u.$('#simpan-menara', utama);
        if (b) { b.disabled = false; }
      }
    });
  }

  function menaraAnim(arr) {
    /* Animasi titisan "duduk" mengikut PEMERHATIAN bot (bukan jawapan) */
    var lapisan = '';
    for (var i = 2; i >= 0; i--) {
      var c = arr[i] ? u.cecair(arr[i]) : null;
      lapisan += '<div class="lapisan cecair-' + (c ? c.id : 'kosong') + '" style="--i:' + (2 - i) + '">' +
        '<span>' + (c ? u.esc(c.nama) : '') + '</span></div>';
    }
    return '<div class="menara-anim" aria-label="' + u.esc(TS.menaraPemerhatianLabel) + '">' + lapisan + '</div>';
  }

  function paparKod(utama) {
    var b = MJ.keadaan.permainan().bot[botS];
    utama.innerHTML =
      '<div class="m2-kod"><div class="kad"><h3>' + u.esc(TS.menaraPemerhatian) + '</h3>' + menaraAnim(b.misi2.pemerhatian) + '</div>' +
      '<div id="peti-kod-bekas"></div></div>';
    MJ.misi.petiKod(u.$('#peti-kod-bekas', utama), botS, 2);
    MJ.dialog.mainkan(D.m2Rekod);
  }

  return {
    papar: papar,
    kemasKini: function () { lukisStatus(); },
    tutup: function () { if (seretS) { seretS.hapus(); seretS = null; } akarS = null; botS = null; }
  };
})();
