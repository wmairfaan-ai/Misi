/* =====================================================================
   misi1.js - MJ.misi (pembantu bersama misi 1-3) + S3 Misi 1: Rakit & Sauh
   #/misi1        : taklimat kelas + Mod Uji
   #/misi1/<bot>  : Peti Kod + status (Mod Tablet: ramal/uji/rekod/kod)
   Air sebenar = sumber kebenaran: aplikasi TIDAK memaparkan nasib objek.
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

/* ---------------- Pembantu bersama ---------------- */
MJ.misi = (function () {
  'use strict';
  var u = MJ.u;
  var D = MJ.KANDUNGAN.dialog;
  var T = MJ.KANDUNGAN.teksSistem;
  var TS = MJ.KANDUNGAN.teksSkrin;

  function adaKucing() { return !!(MJ.kucing && MJ.kucing.sedia); }

  /* QA-035 (baki): tajuk misi daripada KANDUNGAN.fasa[].nama (sudah escape) */
  function tajuk(n) {
    var f = MJ.KANDUNGAN.fasa.filter(function (x) { return x.id === 'misi' + n; })[0];
    return u.esc(f ? f.nama : '');
  }

  function langkahHtml(senarai, aktif) {
    return '<ol class="langkah">' + senarai.map(function (s, i) {
      return '<li class="' + (i === aktif ? 'aktif' : (i < aktif ? 'siap' : '')) + '">' +
        '<span class="no">' + (i + 1) + '</span> ' + u.esc(s) + '</li>';
    }).join('') + '</ol>';
  }

  function kerangHtml(n) {
    var s = '';
    var slot = Math.max(3, n);
    for (var i = 0; i < slot; i++) { s += i < n ? MJ.ikon.kerang : MJ.ikon.kerangKosong; }
    return '<span class="kerang-baris" aria-label="' + n + ' ' + u.esc(TS.kerangPetunjuk) + '">' + s + '</span>';
  }

  function statusHtml(id, n) {
    var p = MJ.keadaan.permainan();
    var b = p.bot[id];
    var m = b['misi' + n];
    var s = '<h2 class="tajuk-kecil">' + u.esc(u.isi(TS.statusBot, { bot: u.bot(id).nama })) + '</h2><ul class="status-misi">';
    if (n < 3) {
      s += '<li class="' + (m.kodDiterima ? 'ya' : 'belum') + '">' + u.esc(m.kodDiterima ? TS.statusKodYa : TS.statusKodBelum) + '</li>';
    }
    s += '<li class="' + (m.cop ? 'ya' : 'belum') + '">' + u.esc(m.cop ? TS.statusCopAda : TS.statusCopMenunggu) + '</li>';
    if (n === 3) {
      s += '<li class="' + (m.serpihan ? 'ya' : 'belum') + '">' + u.esc(m.serpihan ? TS.statusSerpihanYa : TS.statusSerpihanBelum) + '</li>';
    }
    s += '<li>' + u.esc(TS.statusKerang) + ' ' + kerangHtml(b.kerang) + '</li></ul>';
    return s;
  }

  function ringkas(m, n) {
    if (m.cop) { return TS.ringkasCop; }
    if (n < 3 && m.kodDiterima) { return TS.ringkasKod; }
    return TS.ringkasBelum;
  }

  function pilihMisi(id, cb) {
    var p = MJ.keadaan.permainan();
    var b = p.bot[id];
    var html = '<h2>' + u.lencanaBot(id) + ' ' + u.esc(TS.pilihMisi) + '</h2><div class="grid-misi">';
    [1, 2, 3].forEach(function (n) {
      var boleh = MJ.keadaan.misiBoleh(id, n, p);
      html += '<button class="btn btn-misi" data-n="' + n + '"' + (boleh ? '' : ' disabled') + '>' +
        '<b>' + u.esc(u.isi(TS.suratTabMisi, { n: n })) + '</b><span class="kecil blok">' + u.esc(boleh ? ringkas(b['misi' + n], n) : TS.belumDibuka) + '</span></button>';
    });
    html += '</div><div class="baris-butang"><button class="btn" data-tutup>' + u.esc(TS.batal) + '</button></div>';
    var m = u.modal(html, { kelas: 'modal-lebar' });
    u.$$('[data-n]', m.el).forEach(function (btn) {
      btn.addEventListener('click', function () { m.tutup(); cb(parseInt(btn.getAttribute('data-n'), 10)); });
    });
  }

  function keluarBarisan(id) {
    var p = MJ.keadaan.permainan();
    if (p.barisanJeti.indexOf(id) >= 0) {
      MJ.keadaan.ubah(function (q) { q.barisanJeti = q.barisanJeti.filter(function (x) { return x !== id; }); });
    }
  }

  function terkunci(akar, n) {
    akar.innerHTML = '<section class="kad kad-tengah"><h1>' + u.esc(u.isi(TS.terkunciTajuk, { n: n })) + '</h1>' +
      '<p>' + u.esc(TS.terkunciTeks) + '</p><a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></section>';
  }

  /* Mod Uji: paparan tenang, tiada interaksi selain "Selesai Uji" */
  function modUji(bekas, n, selesai) {
    var labuh = n === 2 ? 'menara' : 'bekas-air';
    if (adaKucing()) { MJ.kucing.hantar('fikirTamat'); }
    bekas.innerHTML =
      '<section class="mod-uji-skrin" aria-live="polite">' +
        '<div class="mod-uji-bendera">' + MJ.ikon.bendera + '</div>' +
        '<h1>' + u.esc(TS.modUjiTajuk) + '</h1>' +
        '<p class="besar">' + u.esc(TS.modUjiTeks) + '</p>' +
        (n === 1 ? '<p class="mod-uji-tolak">' + u.esc(TS.modUjiM1) + '</p>' : '') +
        '<div class="mod-uji-ilus" data-labuh="' + labuh + '">' + (n === 2 ? MJ.ikon.cawanKosong() : MJ.ikon.bekasAir('')) + '</div>' +
        '<button class="btn btn-utama" id="selesai-uji">' + u.esc(TS.selesaiUji) + '</button>' +
      '</section>';
    MJ.runtime.modUji = true;
    document.documentElement.classList.add('mod-uji');
    /* QA-044: Bendera Uji kelas (Mod Projektor) membuka surat P3 misi ini */
    if (MJ.keadaan.tetapan().mod !== 'tablet' && !MJ.keadaan.permainan().ujiKelas[n]) {
      MJ.keadaan.ubah(function (q) { q.ujiKelas[n] = true; });
    }
    MJ.dialog.henti();
    if (adaKucing()) {
      if (n === 2) {
        MJ.kucing.gerakKeElemen('kiko', '[data-labuh="menara"]', 'kanan');
      } else {
        MJ.kucing.gerakKeElemen('oyen', '[data-labuh="bekas-air"]', 'kiri');
      }
      u.tunda(function () {
        MJ.dialog.mainkan(n === 2 ? D.m2Uji : D.m1Uji, function () { MJ.kucing.hantar('modUjiMula'); });
      }, 1100);
    }
    u.$('#selesai-uji', bekas).addEventListener('click', function () {
      tamatModUji();
      selesai();
    });
  }

  function tamatModUji() {
    MJ.runtime.modUji = false;
    document.documentElement.classList.remove('mod-uji');
    if (adaKucing()) {
      MJ.kucing.hantar('modUjiTamat');
      MJ.kucing.pulang('oyen');
      MJ.kucing.pulang('kiko');
    }
  }

  /* Peti Kod bertopeng. n=1: dua input kata laluan; n=2: tiga butang warna. */
  function petiKod(bekas, id, n) {
    var p = MJ.keadaan.permainan();
    var m = p.bot[id]['misi' + n];
    if (m.kodDiterima) {
      bekas.innerHTML = '<div class="kad kod-diterima"><h2>' + u.esc(TS.kodDiterimaTajuk) + '</h2>' +
        '<p>' + u.esc(TS.kodDiterimaTeks) + '</p></div>';
      return;
    }
    if (n === 1) {
      /* Peti Kod padat (QA-005): label sebaris, satu baris tindakan */
      bekas.innerHTML =
        '<form class="peti-kod padat kad" autocomplete="off" novalidate>' +
          '<h2>' + u.esc(TS.petiKodM1Tajuk) + '</h2>' +
          '<div class="grid-kod">' +
            '<label class="label-kod" for="kod-atas-' + id + '">' + u.esc(TS.labelKodAtas) + '</label>' +
            '<input class="input-kod" id="kod-atas-' + id + '" type="password" name="atas" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false">' +
            '<label class="label-kod" for="kod-dasar-' + id + '">' + u.esc(TS.labelKodDasar) + '</label>' +
            '<input class="input-kod" id="kod-dasar-' + id + '" type="password" name="dasar" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false">' +
          '</div>' +
          '<div class="baris-butang"><button class="btn btn-utama" type="submit">' + u.esc(TS.hantarKod) + '</button>' +
            '<span class="kecil">' + u.esc(TS.petiKodM1Nota) + '</span></div>' +
          '<div class="mesej-kod" aria-live="polite"></div>' +
        '</form>';
      var f = u.$('form', bekas);
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var a = String(f.elements.atas.value || '').trim();
        var d = String(f.elements.dasar.value || '').trim();
        /* QA-014: medan kosong diabaikan, tidak dikira sebagai cubaan */
        if (!MJ.cincang.normal(a) || !MJ.cincang.normal(d)) {
          var mk = u.$('.mesej-kod', bekas);
          if (mk) { mk.textContent = T.kodKosong; }
          (MJ.cincang.normal(a) ? f.elements.dasar : f.elements.atas).focus();
          return;
        }
        semak(bekas, id, 1, [a, d]);
      });
      return;
    }
    /* n === 2 (susunan butang = susunan paparan tetap dalam kandungan.js, BUKAN jawapan) */
    var urutan = [];
    var html = '<div class="peti-kod padat kad"><h2>' + u.esc(TS.petiKodM2Tajuk) + '</h2>' +
      '<p>' + u.tebal(TS.petiKodM2Arahan) + '</p><div class="baris-warna">';
    MJ.KANDUNGAN.cecair.forEach(function (c) {
      html += '<button class="btn btn-warna cecair-' + c.id + '" data-huruf="' + c.huruf + '" type="button">' +
        '<span class="swatch" aria-hidden="true"></span>' + u.esc(c.label) + '</button>';
    });
    html += '</div><div class="baris-butang baris-kod-m2"><div class="titik-kod" aria-live="polite" title="' + u.esc(TS.titikKodTitle) + '">' + titik(0) + '</div>' +
      '<button class="btn" type="button" id="padam-kod">' + u.esc(TS.padam) + '</button>' +
      '<button class="btn btn-utama" type="button" id="hantar-kod" disabled>' + u.esc(TS.hantarKod) + '</button></div>' +
      '<div class="mesej-kod" aria-live="polite"></div></div>';
    bekas.innerHTML = html;
    var elTitik = u.$('.titik-kod', bekas);
    var btnHantar = u.$('#hantar-kod', bekas);
    u.$$('[data-huruf]', bekas).forEach(function (b) {
      b.addEventListener('click', function () {
        if (urutan.length >= 3) { return; }
        urutan.push(b.getAttribute('data-huruf'));
        MJ.bunyi.plup();
        elTitik.innerHTML = titik(urutan.length);
        btnHantar.disabled = urutan.length !== 3;
      });
    });
    u.$('#padam-kod', bekas).addEventListener('click', function () {
      urutan = [];
      elTitik.innerHTML = titik(0);
      btnHantar.disabled = true;
    });
    btnHantar.addEventListener('click', function () {
      semak(bekas, id, 2, [urutan.join('')]);
      urutan = [];
      elTitik.innerHTML = titik(0);
      btnHantar.disabled = true;
    });
  }

  function titik(n) {
    var s = '';
    for (var i = 0; i < 3; i++) { s += '<span class="titik' + (i < n ? ' isi' : '') + '"></span>'; }
    return s + '<span class="sr">' + n + ' daripada 3 warna</span>';
  }

  /* Semak kod (dibandingkan sebagai cincangan). Memulangkan Promise<bool>. */
  function semak(bekas, id, n, nilai, senyap) {
    var kod = MJ.keadaan.kod();
    var perlu = n === 1 ? [kod.m1Atas, kod.m1Dasar] : [kod.m2];
    var mesej = bekas ? u.$('.mesej-kod', bekas) : null;
    if (perlu.some(function (x) { return !x; })) {
      u.toast(T.kodTiada);
      if (mesej) { mesej.textContent = T.kodTiada; }
      return Promise.resolve(false);
    }
    var butang = bekas ? u.$$('button', bekas) : [];
    butang.forEach(function (b) { b.disabled = true; });
    return Promise.all(nilai.map(function (v) { return MJ.cincang.kod(v); })).then(function (hs) {
      var betul = hs.every(function (h, i) { return h === perlu[i]; });
      var cubaan = 0;
      MJ.keadaan.ubah(function (q) {
        var mm = q.bot[id]['misi' + n];
        mm.cubaanKod = (mm.cubaanKod || 0) + 1;
        cubaan = mm.cubaanKod;
        if (betul) { mm.kodDiterima = true; }
      });
      if (betul) {
        MJ.bunyi.dering();
        if (adaKucing()) { MJ.kucing.hantar('kodDiterima'); }
        MJ.dialog.mainkan(D.kodDiterima);
        if (bekas && !senyap) { petiKod(bekas, id, n); }
      } else {
        MJ.bunyi.ombak(false);
        if (adaKucing()) { MJ.kucing.hantar('kodBelum'); }
        butang.forEach(function (b) { b.disabled = false; });
        if (bekas) {
          var hb = u.$('#hantar-kod', bekas);
          if (hb) { hb.disabled = true; }
          u.$$('input', bekas).forEach(function (i) { i.value = ''; });
        }
        var baris = (n === 1 ? D.kodBelum : D.kodBelumM2).slice();
        /* QA-017: tawaran cubaan ke-3 ikut watak misi (M1 Mak Tok, M2 Pak Din) */
        if (cubaan === 3) { baris = baris.concat(n === 2 ? D.cubaan3M2 : D.cubaan3); }
        MJ.dialog.mainkan(baris);
        if (mesej) {
          mesej.innerHTML = '<p>' + u.esc(T.kodBelum) + '</p>' +
            (cubaan === 3 ? '<p>' + u.esc(n === 2 ? T.cubaan3M2 : T.cubaan3) + '</p><button class="btn" type="button" data-buka-kerang>' +
              u.esc(T.bukaKerang) + '</button>' : '');
          var bk = u.$('[data-buka-kerang]', mesej);
          if (bk) { bk.addEventListener('click', function () { MJ.surat.buka(id, n); }); }
        }
      }
      return betul;
    });
  }

  return {
    tajuk: tajuk, langkahHtml: langkahHtml, kerangHtml: kerangHtml, statusHtml: statusHtml,
    pilihMisi: pilihMisi, keluarBarisan: keluarBarisan, terkunci: terkunci,
    modUji: modUji, tamatModUji: tamatModUji, petiKod: petiKod, semak: semak
  };
})();

/* ---------------- S3 Misi 1 ---------------- */
MJ.skrin.misi1 = (function () {
  'use strict';
  var u = MJ.u;
  var D = MJ.KANDUNGAN.dialog;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var LANGKAH = TS.langkahM1;
  var IDX = { ramal: 0, uji: 1, rekod: 2, kod: 3 };
  var akarS = null;
  var botS = null;
  var seretS = null;

  function papar(akar, param) {
    akarS = akar;
    botS = param[0] && u.bot(param[0]) ? param[0] : null;
    if (!botS) { taklimat(akar); } else { paparBot(akar); }
  }

  function taklimat(akar) {
    var objekHtml = MJ.KANDUNGAN.objek.map(function (o) {
      return '<span class="objek-meja" title="' + u.esc(o.nama) + '">' + MJ.ikon.objek(o.id) + '</span>';
    }).join('');
    akar.innerHTML =
      '<section class="taklimat">' +
        '<header class="kepala-misi"><h1>' + MJ.misi.tajuk(1) + '</h1>' + MJ.misi.langkahHtml(LANGKAH, 0) + '</header>' +
        '<div class="taklimat-isi">' +
          '<div class="taklimat-ilus" data-labuh="bekas-air">' + MJ.ikon.bekasAir('') +
            '<div class="meja-objek" aria-label="' + u.esc(TS.mejaObjekLabel) + '">' + objekHtml + '</div></div>' +
          '<ol class="arahan">' + TS.misi1Arahan.map(function (t) { return '<li>' + u.tebal(t) + '</li>'; }).join('') + '</ol>' +
        '</div>' +
        '<div class="baris-butang tengah">' +
          '<button class="btn btn-aksen" id="angkat-bendera">' + u.esc(TS.angkatBendera) + '</button>' +
          '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a>' +
        '</div>' +
      '</section>';
    MJ.dialog.mainkan(D.m1Taklimat);
    u.$('#angkat-bendera', akar).addEventListener('click', function () {
      MJ.misi.modUji(akar, 1, function () { MJ.penghala.pergi('#/peta'); });
    });
  }

  function paparBot(akar) {
    var id = botS;
    var p = MJ.keadaan.permainan();
    if (!MJ.keadaan.misiBoleh(id, 1, p)) { MJ.misi.terkunci(akar, 1); return; }
    MJ.misi.keluarBarisan(id);
    akar.innerHTML =
      '<section class="misi-bot">' +
        '<header class="kepala-misi"><h1>' + u.lencanaBot(id) + ' ' + MJ.misi.tajuk(1) + '</h1><div id="langkah-misi"></div></header>' +
        '<div class="misi-badan">' +
          '<div class="misi-utama" id="misi-utama"></div>' +
          '<aside class="misi-sisi"><div id="status-misi"></div>' +
            '<div class="baris-butang lajur"><button class="btn" id="btn-kerang">' + MJ.ikon.kerang + ' ' + u.esc(TS.kerangPetunjuk) + '</button>' +
            '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></div></aside>' +
        '</div>' +
      '</section>';
    u.$('#btn-kerang', akar).addEventListener('click', function () { MJ.surat.buka(id, 1); });
    lukisStatus();
    if (MJ.keadaan.tetapan().mod === 'tablet') {
      lukisTablet();
    } else {
      u.$('#langkah-misi', akar).innerHTML = MJ.misi.langkahHtml(LANGKAH, 3);
      MJ.misi.petiKod(u.$('#misi-utama', akar), id, 1);
    }
  }

  function lukisStatus() {
    if (!akarS || !botS) { return; }
    var s = u.$('#status-misi', akarS);
    if (s) { s.innerHTML = MJ.misi.statusHtml(botS, 1); }
  }

  function setLangkah(L) {
    if (MJ.kucing && MJ.kucing.sedia) { MJ.kucing.hantar('fikirTamat'); }
    MJ.keadaan.ubah(function (q) { q.bot[botS].misi1.langkah = L; });
    lukisTablet();
  }

  function lukisTablet() {
    if (seretS) { seretS.hapus(); seretS = null; }
    var b = MJ.keadaan.permainan().bot[botS];
    var L = b.misi1.langkah || 'ramal';
    u.$('#langkah-misi', akarS).innerHTML = MJ.misi.langkahHtml(LANGKAH, IDX[L]);
    var utama = u.$('#misi-utama', akarS);
    if (L === 'ramal') { ramal(utama); }
    else if (L === 'uji') { MJ.misi.modUji(utama, 1, function () { setLangkah('rekod'); }); }
    else if (L === 'rekod') { rekod(utama); }
    else { kod(utama); }
  }

  function kadObjek(o, oleh) {
    var n = oleh[o.id];
    return '<div class="kad-objek" data-objek="' + o.id + '" tabindex="0" role="button" aria-pressed="false">' +
      MJ.ikon.objek(o.id) + '<span class="nama">' + u.esc(o.nama) + '</span>' +
      '<button class="oleh" type="button" data-oleh="' + o.id + '">' + u.esc(n ? u.isi(TS.ahli, { n: n }) : TS.siapa) + '</button></div>';
  }

  function ramal(utama) {
    var b = MJ.keadaan.permainan().bot[botS];
    var ram = b.misi1.ramalan || {};
    var oleh = b.misi1.ramalanOleh || {};
    var dulang = '', atas = '', dasar = '', semua = true;
    MJ.KANDUNGAN.objek.forEach(function (o) {
      var h = kadObjek(o, oleh);
      if (ram[o.id] === 'atas') { atas += h; }
      else if (ram[o.id] === 'dasar') { dasar += h; }
      else { dulang += h; semua = false; }
    });
    utama.innerHTML =
      '<div class="m1-ramal">' +
        '<p class="arahan-satu">' + u.tebal(TS.misi1Ramal) + '</p>' +
        '<div class="dulang-kad" data-zon="dulang" tabindex="0" aria-label="' + u.esc(TS.dulangKadLabel) + '">' + dulang + '</div>' +
        '<div class="tikar-jeti">' +
          '<div class="zon-tikar zon-atas" data-zon="atas" tabindex="0" aria-label="' + u.esc(TS.zonAtas) + '"><h3>' + u.esc(TS.zonAtas) + '</h3><div class="isi-zon">' + atas + '</div></div>' +
          '<div class="zon-tikar zon-dasar" data-zon="dasar" tabindex="0" aria-label="' + u.esc(TS.zonDasar) + '"><h3>' + u.esc(TS.zonDasar) + '</h3><div class="isi-zon">' + dasar + '</div></div>' +
        '</div>' +
        '<div class="baris-butang tengah"><button class="btn btn-aksen" id="kunci-ramalan"' + (semua ? '' : ' disabled') + '>' + u.esc(TS.kunciRamalan) + '</button></div>' +
      '</div>';
    var kotak = u.$('.m1-ramal', utama);
    seretS = MJ.seret.jadikan({
      akar: kotak, item: '.kad-objek', zon: '[data-zon]',
      lepas: function (item, zon) {
        var oid = item.getAttribute('data-objek');
        var z = zon.getAttribute('data-zon');
        MJ.keadaan.ubah(function (q) {
          var r = q.bot[botS].misi1.ramalan;
          if (z === 'dulang') { delete r[oid]; } else { r[oid] = z; }
        });
        MJ.bunyi.plup();
        if (seretS) { seretS.hapus(); seretS = null; }
        ramal(utama);
      }
    });
    u.$$('[data-oleh]', kotak).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var oid = btn.getAttribute('data-oleh');
        var baru = 1;
        MJ.keadaan.ubah(function (q) {
          var ol = q.bot[botS].misi1.ramalanOleh;
          baru = ((ol[oid] || 0) % 5) + 1;
          ol[oid] = baru;
        });
        btn.textContent = u.isi(TS.ahli, { n: baru });
      });
    });
    u.$('#kunci-ramalan', kotak).addEventListener('click', function () { setLangkah('uji'); });
    /* QA-020: kucing 'terfikir' semasa langkah Ramal (spesifikasi 4.3.3) */
    if (MJ.kucing && MJ.kucing.sedia) { MJ.kucing.hantar('fikir'); }
  }

  function rekod(utama) {
    var b = MJ.keadaan.permainan().bot[botS];
    var kep = b.misi1.keputusan || {};
    var html = '<div class="m1-rekod"><p class="arahan-satu">' + u.tebal(TS.misi1Rekod) + '</p><div class="senarai-rekod">';
    MJ.KANDUNGAN.objek.forEach(function (o) {
      html += '<div class="baris-rekod"><span class="ikon-kecil">' + MJ.ikon.objek(o.id) + '</span>' +
        '<span class="nama">' + u.esc(o.nama) + '</span>' +
        '<div class="togol" role="group" aria-label="Keputusan ' + u.esc(o.nama) + '">' +
          '<button type="button" class="btn-togol' + (kep[o.id] === 'atas' ? ' aktif' : '') + '" data-o="' + o.id + '" data-k="atas" aria-pressed="' + (kep[o.id] === 'atas') + '">' + u.esc(TS.terapung) + '</button>' +
          '<button type="button" class="btn-togol' + (kep[o.id] === 'dasar' ? ' aktif' : '') + '" data-o="' + o.id + '" data-k="dasar" aria-pressed="' + (kep[o.id] === 'dasar') + '">' + u.esc(TS.tenggelam) + '</button>' +
        '</div></div>';
    });
    html += '</div><div class="baris-butang tengah"><button class="btn btn-aksen" id="simpan-rekod">' + u.esc(TS.simpanRekod) + '</button></div></div>';
    utama.innerHTML = html;
    var btnSimpan = u.$('#simpan-rekod', utama);
    function lengkap() {
      var k = MJ.keadaan.permainan().bot[botS].misi1.keputusan;
      return MJ.KANDUNGAN.objek.every(function (o) { return !!k[o.id]; });
    }
    btnSimpan.disabled = !lengkap();
    u.$$('.btn-togol', utama).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var oid = btn.getAttribute('data-o');
        var k = btn.getAttribute('data-k');
        MJ.keadaan.ubah(function (q) { q.bot[botS].misi1.keputusan[oid] = k; });
        u.$$('.btn-togol[data-o="' + oid + '"]', utama).forEach(function (x) {
          var on = x.getAttribute('data-k') === k;
          x.classList.toggle('aktif', on);
          x.setAttribute('aria-pressed', String(on));
        });
        MJ.bunyi.plup();
        btnSimpan.disabled = !lengkap();
      });
    });
    btnSimpan.addEventListener('click', function () {
      var kejutan = 0;
      MJ.keadaan.ubah(function (q) {
        var m = q.bot[botS].misi1;
        kejutan = MJ.KANDUNGAN.objek.filter(function (o) { return m.ramalan[o.id] !== m.keputusan[o.id]; }).length;
        m.kejutan = kejutan;
        m.langkah = 'kod';
      });
      lukisTablet();
      if (kejutan > 0) {
        MJ.dialog.mainkan(D.m1Kejutan.concat(D.m1Renung));
      } else {
        MJ.dialog.mainkan(D.m1TiadaKejutan.concat(D.m1Renung));
      }
    });
  }

  function kadSelak(o, i) {
    return '<div class="kad-selak" style="--tunda:' + (i * 0.15).toFixed(2) + 's">' +
      '<div class="kad-selak-dalam">' +
        '<div class="muka depan">' + MJ.ikon.objek(o.id) + '</div>' +
        '<div class="muka belakang"><span class="huruf">' + u.esc(o.huruf) + '</span></div>' +
      '</div></div>';
  }

  function kod(utama) {
    var b = MJ.keadaan.permainan().bot[botS];
    var m = b.misi1;
    var beza = MJ.KANDUNGAN.objek.filter(function (o) { return m.ramalan[o.id] !== m.keputusan[o.id]; });
    var atas = u.kocok(MJ.KANDUNGAN.objek.filter(function (o) { return m.keputusan[o.id] === 'atas'; }), botS + 'atas');
    var dasar = u.kocok(MJ.KANDUNGAN.objek.filter(function (o) { return m.keputusan[o.id] === 'dasar'; }), botS + 'dasar');
    utama.innerHTML =
      '<div class="m1-kod">' +
        '<div class="infografik-kejutan kad">' +
          '<h3>' + u.esc(beza.length ? u.isi(TS.kejutanBilangan, { n: beza.length }) : TS.semuaSepadan) + '</h3>' +
          '<div class="senarai-kejutan">' + beza.map(function (o) {
            return '<span class="item-kejutan">' + MJ.ikon.objek(o.id) + '<span class="ombak-kecil" aria-hidden="true">~</span><span class="sr">' + u.esc(o.nama) + '</span></span>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="huruf-kumpulan">' +
          '<div class="kumpulan-huruf"><h3>' + u.esc(TS.hurufAtas) + '</h3><div class="baris-huruf">' + atas.map(kadSelak).join('') + '</div></div>' +
          '<div class="kumpulan-huruf"><h3>' + u.esc(TS.hurufDasar) + '</h3><div class="baris-huruf">' + dasar.map(kadSelak).join('') + '</div></div>' +
        '</div>' +
        '<div id="peti-kod-bekas"></div>' +
        (m.kodDiterima ? '' : '<div class="baris-butang"><button class="btn" id="rekod-semula">' + u.esc(TS.ubahRekod) + '</button></div>') +
      '</div>';
    u.tunda(function () {
      u.$$('.kad-selak', utama).forEach(function (k) { k.classList.add('terselak'); });
    }, 400);
    MJ.misi.petiKod(u.$('#peti-kod-bekas', utama), botS, 1);
    var rs = u.$('#rekod-semula', utama);
    if (rs) { rs.addEventListener('click', function () { setLangkah('rekod'); }); }
  }

  return {
    papar: papar,
    kemasKini: function () { lukisStatus(); },
    tutup: function () { if (seretS) { seretS.hapus(); seretS = null; } akarS = null; botS = null; }
  };
})();
