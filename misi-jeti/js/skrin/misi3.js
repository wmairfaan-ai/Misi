/* =====================================================================
   misi3.js - S5 Misi 3: Telegram Kapten (Kad Situasi, jawapan terbuka)
   #/misi3        : taklimat kelas
   #/misi3/<bot>  : 2 Kad Situasi (atau 1 jika pintasan) + status Cop/Serpihan
   Penjelasan ditulis dalam Log Krew kertas; guru memberi Cop dalam PG.
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.misi3 = (function () {
  'use strict';
  var u = MJ.u;
  var D = MJ.KANDUNGAN.dialog;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var akarS = null;
  var botS = null;

  function papar(akar, param) {
    akarS = akar;
    botS = param[0] && u.bot(param[0]) ? param[0] : null;
    if (!botS) { taklimat(akar); } else { paparBot(akar); }
  }

  function taklimat(akar) {
    akar.innerHTML =
      '<section class="taklimat">' +
        '<header class="kepala-misi"><h1>' + MJ.misi.tajuk(3) + '</h1></header>' +
        '<div class="telegram telegram-misi">' +
          '<div class="telegram-kepala">' + MJ.ikon.potret('kapten') + '<span>' + u.esc(MJ.KANDUNGAN.surat[3].jenis) + '</span></div>' +
          '<p class="telegram-teks">' + u.esc(TS.misi3Telegram) + '</p>' +
        '</div>' +
        '<div class="baris-butang tengah">' +
          '<button class="btn btn-utama" id="buka-kad">' + u.esc(TS.bukaKadSituasi) + '</button>' +
          '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a>' +
        '</div>' +
      '</section>';
    MJ.dialog.mainkan(D.m3Taklimat);
    u.$('#buka-kad', akar).addEventListener('click', function () {
      u.pilihBot(TS.pilihBotSituasi, function (id, p) {
        return MJ.keadaan.misiBoleh(id, 3, p) ? { boleh: true } : { boleh: false, sebab: TS.belumDibuka };
      }, function (id) { MJ.penghala.pergi('#/misi3/' + id); });
    });
  }

  function kadBot(id, p) {
    var i = u.indeksBot(id);
    var pasangan = MJ.KANDUNGAN.pasanganSituasi[i] || [0, 1];
    var senarai = pasangan.map(function (x) { return MJ.KANDUNGAN.situasi[x]; });
    if (p.bot[id].misi3.satuKad) { senarai = senarai.slice(0, 1); }
    return senarai;
  }

  function paparBot(akar) {
    var id = botS;
    var p = MJ.keadaan.permainan();
    if (!MJ.keadaan.misiBoleh(id, 3, p)) { MJ.misi.terkunci(akar, 3); return; }
    MJ.misi.keluarBarisan(id);
    var dibuka = p.bot[id].misi3.kadDibuka || [];
    var kad = kadBot(id, p).map(function (s) {
      var terbuka = dibuka.indexOf(s.id) >= 0;
      return '<button class="kad-situasi' + (terbuka ? ' terselak' : '') + '" data-situasi="' + s.id + '" aria-expanded="' + terbuka + '">' +
        '<span class="kad-situasi-dalam">' +
          '<span class="muka depan"><span class="tajuk-kad">' + u.esc(TS.kadSituasi) + '</span><span class="kecil">' + u.esc(TS.ketikBuka) + '</span></span>' +
          '<span class="muka belakang"><b>' + u.esc(s.tajuk) + '</b><span class="teks-situasi">' + u.esc(s.teks) + '</span></span>' +
        '</span></button>';
    }).join('');
    akar.innerHTML =
      '<section class="misi-bot">' +
        '<header class="kepala-misi"><h1>' + u.lencanaBot(id) + ' ' + MJ.misi.tajuk(3) + '</h1></header>' +
        '<div class="misi-badan">' +
          '<div class="misi-utama">' +
            '<div class="grid-situasi">' + kad + '</div>' +
            '<p class="arahan-satu">' + u.tebal(TS.misi3Arahan) + '</p>' +
          '</div>' +
          '<aside class="misi-sisi"><div id="status-misi"></div>' +
            '<div class="baris-butang lajur"><button class="btn" id="btn-kerang">' + MJ.ikon.kerang + ' ' + u.esc(TS.kerangPetunjuk) + '</button>' +
            '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></div></aside>' +
        '</div>' +
      '</section>';
    lukisStatus();
    /* QA-020: langkah Jelaskan = kucing 'terfikir' (tamat semasa tukar skrin, konteksBaru) */
    if (MJ.kucing && MJ.kucing.sedia) { MJ.kucing.hantar('fikir'); }
    u.$('#btn-kerang', akar).addEventListener('click', function () { MJ.surat.buka(id, 3); });
    u.$$('[data-situasi]', akar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('terselak')) { return; }
        var sid = parseInt(btn.getAttribute('data-situasi'), 10);
        btn.classList.add('terselak');
        btn.setAttribute('aria-expanded', 'true');
        MJ.bunyi.plup();
        MJ.keadaan.ubah(function (q) {
          var kd = q.bot[id].misi3.kadDibuka;
          if (kd.indexOf(sid) < 0) { kd.push(sid); }
        });
        var s = null;
        MJ.KANDUNGAN.situasi.forEach(function (x) { if (x.id === sid) { s = x; } });
        var baris = [];
        if (s && s.oyen) { baris.push({ k: 'oyen', t: s.oyen, e: 'terfikir' }); }
        MJ.dialog.mainkan(baris.concat(D.m3Jelaskan));
      });
    });
  }

  function lukisStatus() {
    if (!akarS || !botS) { return; }
    var s = u.$('#status-misi', akarS);
    if (s) { s.innerHTML = MJ.misi.statusHtml(botS, 3); }
  }

  return {
    papar: papar,
    kemasKini: function () { lukisStatus(); },
    tutup: function () { akarS = null; botS = null; }
  };
})();
