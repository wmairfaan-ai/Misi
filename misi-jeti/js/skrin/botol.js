/* =====================================================================
   botol.js - S8 Botol Misteri (laluan explorer), #/botol/<bot>
   Dibuka selepas Cop Misi 1 + kata rahsia daripada Gulungan Rahsia fizikal.
   Gelaran Penjejak Rahsia diluluskan guru dalam Panel Guru.
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.botol = (function () {
  'use strict';
  var u = MJ.u;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var akarS = null;
  var botS = null;

  /* QA-027: siluet ringkas Objek Misteri (bentuk gelap sahaja, tanpa nama).
     Kunci = nama dalam KANDUNGAN.objekMisteri; bentuk lain guna siluet umum. */
  var SILUET = {
    'Epal': '<path d="M32 18 C20 10 8 18 10 34 C12 50 24 58 32 54 C40 58 52 50 54 34 C56 18 44 10 32 18 Z"/><path d="M32 18 C32 12 34 8 38 6" stroke-width="4" fill="none"/><path d="M36 12 C42 6 50 8 50 8 C48 14 42 16 36 12 Z"/>',
    'Telur': '<path d="M32 6 C18 6 10 26 10 38 C10 52 20 60 32 60 C44 60 54 52 54 38 C54 26 46 6 32 6 Z"/>',
    'Ais batu': '<path d="M14 22 L34 12 L54 22 L54 46 L34 56 L14 46 Z"/>',
    'Lilin': '<rect x="22" y="24" width="20" height="34" rx="3"/><path d="M32 6 C38 14 38 20 32 22 C26 20 26 14 32 6 Z"/>',
    'Span': '<rect x="8" y="18" width="48" height="30" rx="6"/>',
    'Kunci besi': '<circle cx="18" cy="32" r="12"/><rect x="26" y="28" width="32" height="8" rx="2"/><rect x="44" y="34" width="5" height="10"/><rect x="52" y="34" width="5" height="8"/>'
  };
  function siluetSvg(nama) {
    var bentuk = SILUET[nama] || '<path d="M32 8 C48 8 56 22 56 34 C56 48 46 58 32 58 C18 58 8 48 8 34 C8 22 16 8 32 8 Z"/>';
    return '<svg viewBox="0 0 64 64" class="siluet-svg" role="img" aria-label="Siluet Objek Misteri">' +
      '<g fill="#1d2a36" stroke="#1d2a36" stroke-linejoin="round">' + bentuk + '</g></svg>';
  }

  function papar(akar, param) {
    akarS = akar;
    botS = param[0] && u.bot(param[0]) ? param[0] : null;
    if (!botS) { MJ.penghala.pergi('#/peta'); return; }
    lukis(true);
  }

  function lukis(pertama) {
    var akar = akarS;
    var p = MJ.keadaan.permainan();
    var b = p.bot[botS];
    if (!b.misi1.cop) {
      akar.innerHTML = '<section class="kad kad-tengah"><h1>' + u.esc(TS.botolTajukPendek) + '</h1><p>' + u.esc(TS.botolTerkunci) + '</p>' +
        '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></section>';
      return;
    }
    if (!b.botolDibuka) {
      akar.innerHTML =
        '<section class="botol">' +
          '<header class="kepala-misi"><h1>' + u.lencanaBot(botS) + ' ' + u.esc(TS.botolTajukPenuh) + '</h1></header>' +
          '<form class="kad kad-tengah" id="form-rahsia" autocomplete="off">' +
            '<p>' + u.tebal(TS.botolCari) + '</p>' +
            '<label class="label-kod">' + u.esc(TS.botolLabel) + ' <input class="input-kod" name="rahsia" type="text" maxlength="20" autocomplete="off" spellcheck="false"></label>' +
            '<div class="baris-butang"><button class="btn btn-utama" type="submit">' + u.esc(TS.botolBuka) + '</button><a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></div>' +
            '<p class="mesej-kod" aria-live="polite"></p>' +
          '</form>' +
        '</section>';
      var f = u.$('#form-rahsia', akar);
      /* QA-045: kata rahsia dibandingkan sebagai cincangan (normalisasi sama seperti kod misi) */
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var mesej = u.$('.mesej-kod', f);
        var hash = MJ.keadaan.kod().rahsia;
        if (!hash) { mesej.textContent = TS.botolBelumTetap; return; }
        var nilai = String(f.elements.rahsia.value || '');
        if (!MJ.cincang.normal(nilai)) { return; }
        var bekasId = botS;
        MJ.cincang.kod(nilai).then(function (h) {
          if (botS !== bekasId || !akarS) { return; }
          if (h === hash) {
            MJ.keadaan.ubah(function (q) { q.bot[bekasId].botolDibuka = true; });
            MJ.bunyi.dering();
            lukis(true);
          } else {
            MJ.bunyi.ombak(false);
            mesej.textContent = TS.botolSalah;
          }
        });
      });
      return;
    }
    var sesi = MJ.keadaan.sesi();
    akar.innerHTML =
      '<section class="botol">' +
        '<header class="kepala-misi"><h1>' + u.lencanaBot(botS) + ' ' + u.esc(TS.botolTajukPenuh) + '</h1></header>' +
        '<div class="botol-isi">' +
          '<div class="dua-bekas">' +
            '<figure class="bekas-limau">' + MJ.ikon.bekasAir('<g transform="translate(80 52) scale(1)">' + MJ.ikon.limau(true).replace(/<\/?svg[^>]*>/g, '') + '</g>') +
              '<figcaption>' + u.esc(TS.limauBerkulit) + '</figcaption></figure>' +
            '<figure class="bekas-limau">' + MJ.ikon.bekasAir('<g transform="translate(80 100) scale(1)">' + MJ.ikon.limau(false).replace(/<\/?svg[^>]*>/g, '') + '</g>') +
              '<figcaption>' + u.esc(TS.limauTanpaKulit) + '</figcaption></figure>' +
          '</div>' +
          '<div class="kad"><h2>' + u.esc(TS.botolTajuk) + '</h2>' +
            '<p>' + u.esc(TS.botolTeks) + '</p>' +
            '<p class="status-misi ' + (b.penjejakRahsia ? 'ya' : 'belum') + '">' +
              u.esc(b.penjejakRahsia ? TS.penjejakLulus : TS.penjejakMenunggu) + '</p>' +
            (b.penjejakRahsia && sesi.objekMisteri ?
              '<div class="siluet"><span class="siluet-bentuk">' + siluetSvg(sesi.objekMisteri) + '</span><p>' + u.esc(TS.botolSiluet) + '</p></div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="baris-butang tengah"><a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></div>' +
      '</section>';
    if (pertama) { MJ.dialog.mainkan(MJ.KANDUNGAN.dialog.botol); }
  }

  return {
    papar: papar,
    kemasKini: function () {
      if (!akarS || !botS) { return; }
      var b = MJ.keadaan.permainan().bot[botS];
      var el = u.$('.status-misi', akarS);
      if (el && b.penjejakRahsia && el.classList.contains('belum')) { lukis(false); }
    },
    tutup: function () { akarS = null; botS = null; }
  };
})();
