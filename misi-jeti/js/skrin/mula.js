/* S0 Skrin Mula: pilih mod, telegram pembukaan Kapten Hamzah.
   Semua teks murid dalam KANDUNGAN.teksSkrin (mula*). */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.mula = (function () {
  'use strict';
  var u = MJ.u;
  var TS = MJ.KANDUNGAN.teksSkrin;

  function papar(akar) {
    var tet = MJ.keadaan.tetapan();
    akar.innerHTML =
      '<section class="mula">' +
        '<div class="mula-tajuk">' +
          '<div class="mula-logo">' + MJ.ikon.sauh + '</div>' +
          '<h1>' + u.esc(TS.mulaTajuk) + '</h1>' +
          '<p class="sub">' + u.esc(TS.mulaSub) + '</p>' +
        '</div>' +
        '<div class="kad mula-mod" id="mula-mod">' +
          '<h2>' + u.esc(TS.mulaPilihMod) + '</h2>' +
          '<div class="baris-butang">' +
            '<button class="btn btn-utama" data-mod="projektor">' + u.esc(TS.mulaModProjektor) + '</button>' +
            '<button class="btn" data-mod="tablet">' + u.esc(TS.mulaModTablet) + '</button>' +
          '</div>' +
          '<p class="kecil">' + u.esc(TS.mulaModSemasa) + ' <b>' + u.esc(tet.mod === 'tablet' ? TS.mulaNamaTablet : TS.mulaNamaProjektor) + '</b></p>' +
        '</div>' +
        '<div class="telegram" id="telegram" hidden>' +
          '<div class="telegram-kepala">' + MJ.ikon.potret('kapten') + '<span>' + u.esc(TS.mulaTelegram) + '</span></div>' +
          '<p class="telegram-teks" id="telegram-teks" aria-live="polite"></p>' +
          '<div class="baris-butang"><button class="btn btn-utama" id="ke-daftar" hidden>' + u.esc(TS.mulaKeDaftar) + '</button></div>' +
        '</div>' +
      '</section>';

    u.$$('[data-mod]', akar).forEach(function (b) {
      b.addEventListener('click', function () {
        MJ.bunyi.sediakan();
        var mod = b.getAttribute('data-mod');
        if (mod === 'tablet') {
          pilihBotTablet(function (id) {
            MJ.keadaan.ubahTetapan(function (t) { t.mod = 'tablet'; t.botTablet = id; });
            mulaTelegram(akar);
          });
        } else {
          MJ.keadaan.ubahTetapan(function (t) { t.mod = 'projektor'; t.botTablet = null; });
          mulaTelegram(akar);
        }
      });
    });
    u.$('#ke-daftar', akar).addEventListener('click', function () {
      MJ.keadaan.ubah(function (p) { p.dimulakan = true; });
      MJ.penghala.pergi('#/daftar');
    });
  }

  function pilihBotTablet(cb) {
    var html = '<h2>' + u.esc(TS.mulaPilihBotTablet) + '</h2><div class="grid-pilih-bot">';
    MJ.KANDUNGAN.bot.forEach(function (b) {
      html += '<button class="btn btn-bot" data-bot="' + b.id + '">' + u.lencanaBot(b.id) + '</button>';
    });
    html += '</div><div class="baris-butang"><button class="btn" data-tutup>' + u.esc(TS.batal) + '</button></div>';
    var m = u.modal(html, { kelas: 'modal-lebar' });
    u.$$('[data-bot]', m.el).forEach(function (b) {
      b.addEventListener('click', function () { m.tutup(); cb(b.getAttribute('data-bot')); });
    });
  }

  function mulaTelegram(akar) {
    var kotakMod = u.$('#mula-mod', akar);
    var tel = u.$('#telegram', akar);
    var teks = u.$('#telegram-teks', akar);
    if (!tel || !teks) { return; }
    kotakMod.hidden = true;
    tel.hidden = false;
    MJ.bunyi.loceng();
    var penuh = MJ.KANDUNGAN.telegramPembukaan;
    var i = 0;
    function taip() {
      i += 2;
      teks.textContent = penuh.slice(0, i);
      if (i < penuh.length) { u.tunda(taip, 45); } else {
        u.$('#ke-daftar', akar).hidden = false;
        MJ.dialog.mainkan(MJ.KANDUNGAN.dialog.mula);
      }
    }
    teks.addEventListener('click', function () { i = penuh.length; });
    taip();
  }

  return { papar: papar };
})();
