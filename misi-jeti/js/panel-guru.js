/* =====================================================================
   panel-guru.js - PG Panel Guru (tersembunyi). MJ.pg = { buka, tutup,
   halamanPenuh, terbuka }. Dipasang dalam #akar-pg.
   - Tindanan (Ctrl+Shift+G / tekan lama logo / #/guru dalam tetingkap
     murid): PIN setiap kali dibuka, tutup auto selepas 60 s tanpa aktiviti.
   - Halaman penuh (tetingkap #/guru): dikunci selepas 10 minit.
   - SATU SKRIN (Keputusan Pak Cik): tab lalai neutral (Kelulusan); tab
     Metrik & Kunci Jawapan perlu klik "Tunjuk"; disembunyikan semula
     apabila tab ditukar atau panel ditutup. Tirai dihidupkan automatik.
   Hanya fail ini yang membaca kunci mjks.v1.guru.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.pg = (function () {
  'use strict';
  var u = MJ.u;
  var akar = null;
  var dipasang = false;

  var terbukaF = false;     // panel dipaparkan
  var penuh = false;        // mod halaman penuh (#/guru)
  var disahkan = false;     // PIN sudah disemak
  var tabSemasa = 'kelulusan';
  var perluGateF = false;   // tindanan dalam tetingkap murid (mod projektor)
  var satuSkrin = false;    // tiada Extend dikesan
  var tunjuk = false;       // kandungan tab bergate sedang ditunjukkan
  var tiraiAuto = false;    // Tirai dihidupkan oleh panel (dimatikan semula semasa tutup)
  var terakhirAktif = Date.now();
  var detik = null;
  var perluLukis = false;
  var jadualLukisId = null;
  var ikutSkrin = true;     // tab Masa: pindahkan projektor semasa tetapkan fasa
  var tunjukCincangan = false;
  var pemasaMaklum = null;

  var HAD_TINDANAN = 60000;
  var HAD_PENUH = 600000;

  var TAB = [
    { id: 'kelulusan', nama: 'Kelulusan' },
    { id: 'masa', nama: 'Masa' },
    { id: 'kunci', nama: 'Kunci' },
    { id: 'metrik', nama: 'Metrik' },
    { id: 'gelaran', nama: 'Gelaran' },
    { id: 'jawapan', nama: 'Kunci Jawapan' },
    { id: 'data', nama: 'Data' },
    { id: 'tetapan', nama: 'Tetapan' },
    { id: 'reset', nama: 'Reset' }
  ];
  /* QA-013: tab Kunci juga bergate (tajuk hukum, status kod, cincangan) */
  var TAB_GATE = ['kunci', 'metrik', 'jawapan'];
  var NAMA_GATE = { kunci: 'Kunci', metrik: 'Metrik', jawapan: 'Kunci Jawapan' };
  var tunjukCubaan = false;   // "cubaan N" dalam Kelulusan, hanya selepas klik (apabila bergate)
  var padanKunci = null;      // { m1Atas: true|false, ... } cincangan tersimpan lawan kunci-jawapan.js

  var OP = [
    { id: 'op1', nama: 'OP1 Objek', huraian: 'Menerangkan objek terapung/tenggelam berdasarkan ketumpatan (Misi 1)' },
    { id: 'op2', nama: 'OP2 Cecair', huraian: 'Menerangkan susunan lapisan cecair berdasarkan ketumpatan (Misi 2)' },
    { id: 'op3', nama: 'OP3 Aplikasi', huraian: 'Mengaplikasi konsep ketumpatan dalam situasi harian (Misi 3)' }
  ];
  var MISKONSEPSI = [
    { id: 'saiz', nama: 'Saiz menentukan' },
    { id: 'ringan', nama: 'Ringan = terapung' },
    { id: 'pekat', nama: 'Pekat = paling bawah' },
    { id: 'dituang', nama: 'Dituang dulu = bawah' }
  ];
  var NAV = [
    ['#/mula', 'Skrin Mula'], ['#/daftar', 'Daftar Krew'], ['#/peta', 'Peta Jeti'],
    ['#/misi1', 'Misi 1'], ['#/misi2', 'Misi 2'], ['#/misi3', 'Misi 3'],
    ['#/peti', 'Peti Mak Tok'], ['#/galeri', 'Galeri'], ['#/upacara', 'Upacara'], ['#/tiket', 'Tiket Keluar']
  ];

  /* ---------------- Pembantu ---------------- */
  function esc(s) { return u.esc(s); }
  function q(sel) { return akar ? akar.querySelector(sel) : null; }
  function qq(sel) { return akar ? Array.prototype.slice.call(akar.querySelectorAll(sel)) : []; }
  function namaBot(id) { var b = u.bot(id); return b ? b.nama : String(id); }
  function bots() { return MJ.KANDUNGAN.bot.map(function (b) { return b.id; }); }
  function jam(t) {
    if (!t) { return ''; }
    try { return new Date(t).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return new Date(t).toTimeString().slice(0, 5); }
  }
  function suratMisi(b, n) { return (b.suratDibuka || []).filter(function (s) { return s.misi === n; }).length; }
  function perluGate(tab) { return perluGateF && TAB_GATE.indexOf(tab) >= 0; }
  function btn(aksi, teks, atribut, kelas) {
    return '<button type="button" class="pg-btn' + (kelas ? ' ' + kelas : '') + '" data-aksi="' + aksi + '"' +
      (atribut || '') + '>' + teks + '</button>';
  }
  function semak(ubah, label, aktif, atribut) {
    return '<label class="pg-semak"><input type="checkbox" data-ubah="' + ubah + '"' + (atribut || '') +
      (aktif ? ' checked' : '') + '> ' + label + '</label>';
  }
  function pilihanBot(nilai, kosong) {
    var s = '<option value="">' + esc(kosong || 'Tiada') + '</option>';
    MJ.KANDUNGAN.bot.forEach(function (b) {
      s += '<option value="' + b.id + '"' + (nilai === b.id ? ' selected' : '') + '>' + esc(b.nama) + '</option>';
    });
    return s;
  }
  function maklum(teks) {
    var el = q('.pg-status');
    if (!el) { return; }
    el.textContent = teks;
    clearTimeout(pemasaMaklum);
    pemasaMaklum = setTimeout(function () { var e2 = q('.pg-status'); if (e2) { e2.textContent = ''; } }, 5000);
  }
  function log(bot, jenis) {
    MJ.keadaan.ubahGuru(function (g) {
      g.logKelulusan = g.logKelulusan || [];
      g.logKelulusan.push({ bot: bot, jenis: jenis, masa: Date.now() });
    });
  }
  function ubahMetrik(id, fn) {
    MJ.keadaan.ubahGuru(function (g) {
      g.metrik = g.metrik || {};
      var m = g.metrik[id] || { op1: null, op2: null, op3: null, miskonsepsi: [], catatan: '' };
      if (!m.miskonsepsi) { m.miskonsepsi = []; }
      fn(m);
      g.metrik[id] = m;
    });
  }
  function fokusInput() {
    var a = document.activeElement;
    if (!a || !akar || !akar.contains(a)) { return false; }
    var tag = (a.tagName || '').toUpperCase();
    if (tag === 'TEXTAREA' || tag === 'SELECT') { return true; }
    if (tag === 'INPUT') {
      var t = (a.type || '').toLowerCase();
      return ['checkbox', 'radio', 'button', 'submit', 'file'].indexOf(t) < 0;
    }
    return false;
  }

  /* ---------------- Pemasangan ---------------- */
  function pasang() {
    if (dipasang) { return; }
    akar = document.getElementById('akar-pg');
    if (!akar) { return; }
    dipasang = true;
    akar.addEventListener('click', onKlik);
    akar.addEventListener('change', onUbah);
    akar.addEventListener('input', onInput);
    akar.addEventListener('submit', onHantar);
    ['pointerdown', 'keydown', 'input', 'wheel'].forEach(function (ev) {
      akar.addEventListener(ev, function () { terakhirAktif = Date.now(); }, true);
    });
    MJ.bas.on('dataBerubah', onData);
    MJ.bas.on('tetapanBerubah', onData);
    MJ.bas.on('tiraiBerubah', function () { if (terbukaF && disahkan) { kemasKepala(); } });
  }

  function mulaDetik() {
    if (detik) { clearInterval(detik); }
    detik = setInterval(tick, 1000);
    tick();
  }
  function hentiDetik() {
    if (detik) { clearInterval(detik); detik = null; }
  }

  function tick() {
    if (!terbukaF) { return; }
    var kini = Date.now();
    var had = penuh ? HAD_PENUH : HAD_TINDANAN;
    var baki = had - (kini - terakhirAktif);
    if (baki <= 0) {
      if (penuh) {
        if (disahkan) {
          disahkan = false;
          tunjuk = false;
          lukisPin('Panel dikunci selepas 10 minit tanpa aktiviti.');
        }
        terakhirAktif = kini;
      } else {
        tutup();
        return;
      }
    }
    var kira = q('.pg-kira');
    if (kira) { kira.textContent = penuh ? '' : 'Tutup auto: ' + Math.max(0, Math.ceil(baki / 1000)) + ' s'; }
    var p = MJ.keadaan.permainan();
    var teksMasa = MJ.u.fasa(p.fasa).nama + ' | ' + MJ.pemasa.format(MJ.pemasa.baki(p)) + (p.pemasa.dijeda ? ' (jeda)' : '');
    qq('.pg-masa-hidup').forEach(function (el) { el.textContent = teksMasa; });
    if (perluLukis && disahkan && !fokusInput()) { lukisTab(); }
  }

  function onData() {
    if (!terbukaF || !disahkan) { return; }
    if (fokusInput()) { perluLukis = true; return; }
    if (jadualLukisId) { return; }
    jadualLukisId = setTimeout(function () {
      jadualLukisId = null;
      if (!terbukaF || !disahkan) { return; }
      if (fokusInput()) { perluLukis = true; } else { lukisTab(); }
    }, 60);
  }

  /* ---------------- Buka / tutup ---------------- */
  function buka(opsyen) {
    pasang();
    if (!akar) { return; }
    if (MJ.runtime.halamanGuru) { halamanPenuh(); return; }
    /* QA-008: tekan lama logo tidak boleh menetapkan PIN kali pertama */
    if (opsyen && opsyen.dariLogo && !terbukaF && !MJ.keadaan.guru().pinHash) {
      u.toast(MJ.KANDUNGAN.teksSistem.pgBelumSedia);
      return;
    }
    if (terbukaF) {
      var f = q('input, button');
      if (f) { f.focus(); }
      return;
    }
    terbukaF = true;
    penuh = false;
    disahkan = false;
    tunjuk = false;
    tabSemasa = 'kelulusan';   /* tab lalai neutral, BUKAN Metrik */
    var t = MJ.keadaan.tetapan();
    perluGateF = t.mod !== 'tablet';
    satuSkrin = perluGateF && !(window.screen && window.screen.isExtended === true);
    MJ.runtime.pgBuka = true;
    if (MJ.pasangan) { MJ.pasangan.lerai(true); }
    MJ.dialog.henti();
    tiraiAuto = false;
    if (satuSkrin && !MJ.runtime.tirai && MJ.tirai) {
      MJ.tirai(true);
      tiraiAuto = true;
    }
    if (MJ.kemaskiniJeda) { MJ.kemaskiniJeda(); }
    terakhirAktif = Date.now();
    lukisPin();
    mulaDetik();
  }

  function tutup() {
    if (!terbukaF || penuh) { return; }
    terbukaF = false;
    disahkan = false;
    tunjuk = false;     /* kandungan bergate disembunyikan semula */
    tunjukCincangan = false;
    tunjukCubaan = false;
    hentiDetik();
    clearTimeout(jadualLukisId);
    jadualLukisId = null;
    if (akar) { akar.innerHTML = ''; }
    MJ.runtime.pgBuka = false;
    if (tiraiAuto && MJ.tirai) { MJ.tirai(false); }
    tiraiAuto = false;
    if (MJ.kemaskiniJeda) { MJ.kemaskiniJeda(); }
    if (MJ.kunci) { MJ.kunci.lepas(); }   /* buang MJ.KUNCI global (kecuali di Galeri) */
    var s = document.getElementById('skrin');
    if (s) { try { s.focus({ preventScroll: true }); } catch (e) { s.focus(); } }
  }

  function halamanPenuh() {
    pasang();
    if (!akar) { return; }
    if (penuh && terbukaF) { return; }   /* idempoten (dipanggil pada setiap hashchange) */
    penuh = true;
    terbukaF = true;
    disahkan = false;
    perluGateF = false;
    satuSkrin = false;
    tunjuk = false;
    tabSemasa = 'kelulusan';
    MJ.runtime.pgBuka = true;
    document.title = 'Panel Guru: Misi Jeti Kuala Senyum';
    terakhirAktif = Date.now();
    lukisPin();
    mulaDetik();
  }

  /* ---------------- Rangka ---------------- */
  function lukisRangka() {
    akar.innerHTML =
      '<div class="pg-latar' + (penuh ? ' pg-penuh' : '') + '">' +
        '<div class="pg" role="dialog"' + (penuh ? '' : ' aria-modal="true"') + ' aria-label="Panel Guru">' +
          '<header class="pg-kepala">' +
            '<h2>Panel Guru</h2>' +
            '<span class="pg-masa-hidup"></span>' +
            '<span class="pg-status" aria-live="polite"></span>' +
            '<span class="pg-kira"></span>' +
            '<div class="pg-kepala-butang"></div>' +
          '</header>' +
          '<div class="pg-banner" hidden></div>' +
          '<nav class="pg-tab" role="tablist" aria-label="Tab Panel Guru"></nav>' +
          '<div class="pg-isi" id="pg-isi" role="tabpanel"></div>' +
        '</div>' +
      '</div>';
  }

  function kemasKepala() {
    var kb = q('.pg-kepala-butang');
    if (!kb) { return; }
    var h = '';
    if (disahkan) {
      if (MJ.runtime.halamanGuru) {
        h += btn('tiraiHidup', 'Tirai Projektor: Hidup') + btn('tiraiMati', 'Tirai Projektor: Mati');
      } else {
        h += '<button type="button" class="pg-btn' + (MJ.runtime.tirai ? ' aktif' : '') + '" data-aksi="tirai" aria-pressed="' +
          (MJ.runtime.tirai ? 'true' : 'false') + '">Tirai: ' + (MJ.runtime.tirai ? 'HIDUP' : 'mati') + ' (T)</button>';
      }
    }
    if (penuh) {
      if (disahkan) { h += btn('kunciPanel', 'Kunci Panel'); }
    } else {
      h += btn('tutup', 'Tutup (Esc)');
    }
    kb.innerHTML = h;
  }

  function lukisPin(mesej) {
    lukisRangka();
    kemasKepala();
    var ada = !!MJ.keadaan.guru().pinHash;
    var isi = q('.pg-isi');
    var inp = function (nama, label) {
      return '<label class="pg-medan">' + label + ' <input type="password" name="' + nama +
        '" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off"></label>';
    };
    isi.innerHTML =
      '<form class="pg-pin" data-borang="' + (ada ? 'pin' : 'pinBaru') + '" autocomplete="off" novalidate>' +
        (ada ?
          '<h3>Masukkan PIN guru</h3>' + inp('pin', 'PIN') :
          '<h3>Tetapkan PIN guru (kali pertama)</h3>' +
          '<p class="pg-nota">4 hingga 6 digit. PIN ini penghalang ringan sahaja, bukan keselamatan sebenar.</p>' +
          inp('pin1', 'PIN baharu') + inp('pin2', 'Ulang PIN')) +
        '<div class="pg-baris-butang"><button type="submit" class="pg-btn pg-btn-utama">' + (ada ? 'Buka' : 'Simpan PIN') + '</button>' +
          (penuh ? '' : btn('tutup', 'Batal')) + '</div>' +
        '<p class="pg-mesej" aria-live="polite">' + esc(mesej || '') + '</p>' +
      '</form>';
    setTimeout(function () { var f = q('.pg-pin input'); if (f) { f.focus(); } }, 30);
  }

  function lukisPanel() {
    lukisRangka();
    kemasKepala();
    var ban = q('.pg-banner');
    if (ban && perluGateF) {
      ban.hidden = false;
      ban.className = 'pg-banner pg-amaran';
      ban.innerHTML = satuSkrin ?
        '<b>Satu skrin dikesan.</b> Projektor mungkin menunjukkan panel ini. Tirai dihidupkan automatik. ' +
        'Sebelum membuka Kunci, Metrik atau Kunci Jawapan, tekan <b>Win+P</b> dan pilih <b>"PC screen only"</b>.' :
        '<b>Panel dibuka dalam tetingkap murid.</b> Jika tetingkap ini dipaparkan di projektor, gunakan tetingkap ' +
        '<b>#/guru</b> di skrin laptop untuk Kunci, Metrik dan Kunci Jawapan.';
    }
    lukisTab();
    setTimeout(function () { var f = q('.pg-tab-btn.aktif'); if (f) { f.focus(); } }, 30);
  }

  function lukisTab() {
    if (!terbukaF || !disahkan) { return; }
    var nav = q('.pg-tab');
    var isi = q('.pg-isi');
    if (!nav || !isi) { return; }
    perluLukis = false;
    nav.innerHTML = TAB.map(function (t) {
      var aktif = t.id === tabSemasa;
      return '<button type="button" class="pg-tab-btn' + (aktif ? ' aktif' : '') + (perluGate(t.id) ? ' pg-tab-gate' : '') +
        '" role="tab" aria-selected="' + aktif + '" data-aksi="tab" data-tab="' + t.id + '">' + esc(t.nama) + '</button>';
    }).join('');
    var skrol = isi.scrollTop;
    var h;
    if (perluGate(tabSemasa) && !tunjuk) {
      h = gateHtml();
    } else {
      try { h = PELUKIS[tabSemasa](); }
      catch (e) {
        if (window.console) { console.error('[PG]', tabSemasa, e); }
        h = '<p class="pg-mesej">Ralat semasa memaparkan tab ini: ' + esc(e.message) + '</p>';
      }
    }
    isi.innerHTML = h;
    isi.scrollTop = skrol;
    tick();
  }

  function gateHtml() {
    var nama = NAMA_GATE[tabSemasa] || 'Tab ini';
    return '<div class="pg-gate">' +
      '<h3>' + nama + ' disembunyikan</h3>' +
      '<p>Kandungan ini hanya untuk guru. ' + (satuSkrin ?
        'Tiada paparan Extend dikesan, jadi projektor mungkin menunjukkan skrin ini.' :
        'Panel ini dibuka dalam tetingkap murid.') + '</p>' +
      '<ol><li>Tekan <b>Win+P</b> dan pilih <b>"PC screen only"</b> (atau pastikan projektor tidak menunjukkan skrin ini).</li>' +
      '<li>Kemudian tekan <b>Tunjuk</b>.</li></ol>' +
      '<p class="pg-nota">Kandungan akan disembunyikan semula apabila anda menukar tab atau menutup panel. ' +
      'Selepas selesai, tekan Win+P semula dan pilih "Duplicate".</p>' +
      btn('tunjuk', 'Tunjuk', '', 'pg-btn-utama') +
      '</div>';
  }

  /* ---------------- Tab: Kelulusan ---------------- */
  function tabKelulusan() {
    var p = MJ.keadaan.permainan();
    /* QA-013: bilangan cubaan kod disembunyikan dalam tindanan bergate sehingga guru klik */
    var paparCubaan = !perluGateF || tunjukCubaan;
    var h = '<section class="pg-bahagian"><h3>Cop Pelabuhan</h3>' +
      '<p class="pg-nota">Beri Cop selepas menyemak ayat penjelasan dalam Log Krew. "Belum lagi" menghantar mesej lembut ke skrin.</p>' +
      (perluGateF ? '<p class="pg-nota">' + btn('tunjukCubaan', paparCubaan ? 'Sembunyi bilangan cubaan' : 'Tunjuk bilangan cubaan', '', 'pg-btn-kecil') +
        ' Bilangan cubaan kod disembunyikan kerana panel ini mungkin kelihatan di projektor.</p>' : '') +
      '<div class="pg-jadual-bekas"><table class="pg-jadual"><thead><tr><th>Bot</th><th>Bintang</th>' +
      '<th>Misi 1</th><th>Misi 2</th><th>Misi 3</th><th>Cop Penolong</th><th>Lain-lain</th></tr></thead><tbody>';
    MJ.KANDUNGAN.bot.forEach(function (b) {
      var d = p.bot[b.id];
      var a = ' data-bot="' + b.id + '"';
      h += '<tr><th scope="row">' + u.lencanaBot(b.id) + '</th><td class="pg-nombor">' + MJ.keadaan.bintang(b.id, p) + '</td>';
      [1, 2, 3].forEach(function (n) {
        var m = d['misi' + n];
        var info = n < 3 ?
          'Kod: ' + (m.kodDiterima ? '<b>diterima</b>' : 'belum') + (paparCubaan ? ' (cubaan ' + (m.cubaanKod || 0) + ')' : '') :
          'Kad dibuka: ' + (m.kadDibuka || []).length + (m.satuKad ? ' (pintasan 1 kad)' : '') + (m.serpihan ? ', serpihan ada' : '');
        h += '<td><span class="pg-kecil blok">' + info + '</span>' + (m.cop ?
          '<span class="pg-ok">Cop ada</span> ' + btn('tarikCop', 'Tarik', a + ' data-n="' + n + '"', 'pg-btn-kecil') :
          btn('cop', 'Cop M' + n, a + ' data-n="' + n + '"', 'pg-btn-utama')) + '</td>';
      });
      h += '<td><span class="pg-nombor">' + (d.copPenolong || 0) + '</span> ' +
        btn('penolong', '+1', a + ' data-d="1"', 'pg-btn-kecil') + btn('penolong', '-1', a + ' data-d="-1"', 'pg-btn-kecil') +
        ((d.copPenolong || 0) < 1 ? '<span class="pg-kecil blok">Peti Bonus berantai</span>' : '') + '</td>';
      h += '<td>' + btn('belum', 'Belum lagi', a) +
        semak('penjejak', 'Penjejak Rahsia' + (d.botolDibuka ? '' : ' <span class="pg-kecil">(botol belum dibuka)</span>'), d.penjejakRahsia, a) +
        /* QA-012: rekod murid = menunggu; Bintang/Jurutera hanya selepas "Simpan klip" */
        '<span class="pg-klip">' +
        (typeof d.bonusKlipMenunggu === 'number' ? '<span class="pg-kecil blok"><b>Menunggu:</b> murid merekod ' + d.bonusKlipMenunggu + ' klip</span>' : '') +
        (typeof d.bonusKlip === 'number' ? '<span class="pg-kecil blok">Disahkan: ' + d.bonusKlip + ' klip</span>' : '') +
        '<input type="number" min="0" max="200" class="pg-input-kecil" id="pg-klip-' + b.id + '" value="' +
        (typeof d.bonusKlipMenunggu === 'number' ? d.bonusKlipMenunggu : (typeof d.bonusKlip === 'number' ? d.bonusKlip : '')) +
        '" aria-label="Klip rakit Bot ' + esc(b.nama) + '">' +
        btn('klip', 'Simpan klip', a, 'pg-btn-kecil') +
        (typeof d.bonusKlipMenunggu === 'number' ? btn('tolakKlip', 'Tolak', a, 'pg-btn-kecil') : '') + '</span></td></tr>';
    });
    h += '</tbody></table></div></section>';

    h += '<section class="pg-bahagian"><h3>Permintaan Cop Penolong ("Kami Dibantu!")</h3>';
    var pp = p.permintaanPenolong || [];
    if (!pp.length) {
      h += '<p class="pg-nota">Tiada permintaan.</p>';
    } else {
      h += '<ul class="pg-senarai">' + pp.map(function (r) {
        return '<li>Bot <b>' + esc(namaBot(r.penolong)) + '</b> ' +
          (r.jenis === 'hadiah' ? 'menghadiahkan Kerang Petunjuk kepada' : 'membantu') + ' Bot <b>' + esc(namaBot(r.dibantu)) + '</b> ' +
          '<span class="pg-kecil">(' + jam(r.masa) + (r.jenis === 'hadiah' ? ', hadiah kerang: semak sama ada ia bantuan sebenar' : '') + ')</span> ' +
          btn('lulusPenolong', 'Lulus', ' data-id="' + esc(r.id) + '"', 'pg-btn-utama') +
          btn('tolakPenolong', 'Tolak', ' data-id="' + esc(r.id) + '"') + '</li>';
      }).join('') + '</ul>';
    }
    h += '</section>';

    var bj = p.barisanJeti || [];
    h += '<section class="pg-bahagian"><h3>Barisan Jeti</h3>' + (bj.length ?
      '<ul class="pg-senarai">' + bj.map(function (id) {
        return '<li>' + u.lencanaBot(id) + ' ' + btn('buangBarisan', 'Keluarkan', ' data-bot="' + id + '"', 'pg-btn-kecil') + '</li>';
      }).join('') + '</ul>' + btn('kosongBarisan', 'Kosongkan barisan') :
      '<p class="pg-nota">Barisan kosong.</p>') + '</section>';
    return h;
  }

  /* ---------------- Tab: Masa ---------------- */
  function tabMasa() {
    var p = MJ.keadaan.permainan();
    var h = '<section class="pg-bahagian"><h3>Pemasa fasa</h3>' +
      '<p class="pg-besar"><span class="pg-masa-hidup"></span></p>' +
      '<div class="pg-baris-butang">' +
        btn('masaMula', 'Mula / Sambung', '', 'pg-btn-utama') + btn('masaJeda', 'Jeda') +
        btn('masaTambah', '-1 minit', ' data-d="-1"') + btn('masaTambah', '+1 minit', ' data-d="1"') +
        btn('loceng', 'Bunyikan loceng') +
      '</div><p class="pg-nota">Amaran 2 minit dan loceng tamat berbunyi automatik di tetingkap projektor.</p></section>';

    h += '<section class="pg-bahagian"><h3>Tetapkan fasa</h3>' +
      semak('ikutSkrin', 'Pindahkan projektor ke skrin fasa sekali', ikutSkrin) +
      '<div class="pg-grid-butang">' + MJ.KANDUNGAN.fasa.map(function (f) {
        return btn('fasa', esc(f.nama) + ' <span class="pg-kecil">(' + f.minit + ' min)</span>', ' data-id="' + f.id + '"',
          f.id === p.fasa ? 'aktif' : '');
      }).join('') + '</div><p class="pg-nota">Fasa baharu bermula dalam keadaan jeda. Tekan "Mula / Sambung".</p></section>';

    h += '<section class="pg-bahagian"><h3>Pindahkan projektor ke</h3><div class="pg-grid-butang">' +
      NAV.map(function (n) { return btn('nav', esc(n[1]), ' data-hash="' + n[0] + '"'); }).join('') + '</div></section>';
    return h;
  }

  /* ---------------- Tab: Kunci ---------------- */
  function tabKunci() {
    var p = MJ.keadaan.permainan();
    var h = '<section class="pg-bahagian"><h3>Buka misi (semua bot)</h3><div class="pg-baris-butang">' +
      [1, 2, 3].map(function (n) { return semak('misiDibuka', 'Misi ' + n, !!p.misiDibuka[n], ' data-n="' + n + '"'); }).join('') +
      '</div></section>';

    h += '<section class="pg-bahagian"><h3>Setiap bot: buka paksa, pintasan dan serpihan</h3>' +
      '<p class="pg-nota">Pintasan untuk bot yang ketinggalan: Misi 3 dengan 1 Kad Situasi sahaja.</p>' +
      '<div class="pg-jadual-bekas"><table class="pg-jadual"><thead><tr><th>Bot</th><th>Buka M1</th><th>Buka M2</th><th>Buka M3</th>' +
      '<th>Pintasan M3 (1 kad)</th><th>Serpihan Hukum</th></tr></thead><tbody>';
    MJ.KANDUNGAN.bot.forEach(function (b) {
      var d = p.bot[b.id];
      var a = ' data-bot="' + b.id + '"';
      h += '<tr><th scope="row">' + u.lencanaBot(b.id) + '</th>' +
        [1, 2, 3].map(function (n) {
          return '<td>' + semak('bukaPaksa', '<span class="sr">Buka paksa Misi ' + n + '</span>', !!(d.bukaPaksa && d.bukaPaksa[n]), a + ' data-n="' + n + '"') + '</td>';
        }).join('') +
        '<td>' + semak('satuKad', '<span class="sr">Pintasan</span>', !!d.misi3.satuKad, a) + '</td>' +
        '<td>' + semak('serpihan', '<span class="sr">Serpihan</span>', !!d.misi3.serpihan, a) + '</td></tr>';
    });
    h += '</tbody></table></div></section>';

    /* QA-044 (pusingan 5): guru boleh membuka surat P3 M1/M2 tanpa Bendera Uji kelas */
    var uk = p.ujiKelas || {};
    h += '<section class="pg-bahagian"><h3>Surat Petunjuk 3 (Misi 1 dan 2)</h3>' +
      '<p class="pg-nota">P3 dibuka automatik apabila "Angkat Bendera Uji" ditekan di skrin taklimat misi (Mod Projektor). ' +
      'Tandakan di sini jika krew sudah menguji tetapi Bendera Uji tidak diangkat di skrin.</p><div class="pg-baris-butang">' +
      [1, 2].map(function (n) { return semak('ujiKelas', 'Buka P3 Misi ' + n + ' (semua bot)', !!uk[n], ' data-n="' + n + '"'); }).join('') +
      '</div></section>';

    h += '<section class="pg-bahagian"><h3>Fasa bersama</h3>' +
      btn('bukaFasaBersama', 'Buka Peti Mak Tok (tetapkan fasa + pindah projektor)', '', 'pg-btn-utama') + '</section>';

    h += '<section class="pg-bahagian"><h3>Hukum Muara: isi ruang kosong</h3>' +
      '<p class="pg-nota">Tekan "Isi" hanya selepas kelas menyebut perkataan yang hilang dengan lantang.</p><ul class="pg-senarai">';
    MJ.KANDUNGAN.hukum.forEach(function (hk) {
      var diletak = !!p.peti.serpihanDiletak[hk.id];
      var diisi = p.peti.ruangDiisi.indexOf(hk.id) >= 0;
      h += '<li>' + hk.id + '. ' + esc(hk.tajuk) + (diletak ? '' : ' <span class="pg-kecil">(serpihan belum diletak)</span>') + ' ' +
        (diisi ? '<span class="pg-ok">Diisi</span> ' + btn('kosongHukum', 'Kosongkan', ' data-id="' + hk.id + '"', 'pg-btn-kecil') :
          btn('isiHukum', 'Isi', ' data-id="' + hk.id + '"', 'pg-btn-utama pg-btn-kecil')) + '</li>';
    });
    h += '</ul>' + btn('isiSemuaHukum', 'Isi semua') + ' ' +
      semak('petiDibuka', 'Peti Mak Tok sudah dibuka', !!p.peti.dibuka) + '</section>';

    var k = MJ.keadaan.kod();
    var km = MJ.keadaan.kodMentah();
    var manual = km.manual || {};
    var sumber = function (n) {
      var s;
      if (km[n]) { s = '<span class="pg-ok">ditetapkan' + (manual[n] ? ' (manual)' : '') + '</span>'; }
      else if (k[n]) { s = '<span class="pg-ok">lalai (kandungan.js)</span>'; }
      else { s = '<span class="pg-tiada">BELUM</span>'; }
      if (padanKunci && padanKunci[n] === false) { s += ' <span class="pg-tiada">TIDAK SEPADAN dengan kunci-jawapan.js</span>'; }
      return s;
    };
    var adaTakPadan = padanKunci && Object.keys(padanKunci).some(function (n) { return padanKunci[n] === false; });
    h += '<section class="pg-bahagian"><h3>Kod misi</h3>' +
      '<p class="pg-nota">Kod disimpan sebagai cincangan sahaja. Jika objek atau cecair ditukar, tetapkan kod baharu di sini. ' +
      'Biarkan kosong untuk mengekalkan kod sedia ada. Kod yang ditetapkan di sini ditanda "manual" dan tidak ditimpa oleh kunci-jawapan.js.</p>' +
      (adaTakPadan ? '<p class="pg-banner pg-amaran"><b>Kod tersimpan tidak sepadan dengan kunci-jawapan.js.</b> ' +
        'Jika kunci-jawapan.js baru dikemas kini, tekan "Jana semula daripada kunci-jawapan.js".</p>' : '') +
      '<form class="pg-borang" data-borang="kod" autocomplete="off" novalidate>' +
        '<label class="pg-medan">Kod Atas Air (Misi 1) ' + sumber('m1Atas') + ' <input type="password" name="m1Atas" maxlength="12" autocomplete="off"></label>' +
        '<label class="pg-medan">Kod Dasar Sungai (Misi 1) ' + sumber('m1Dasar') + ' <input type="password" name="m1Dasar" maxlength="12" autocomplete="off"></label>' +
        '<label class="pg-medan">Kod Misi 2 (huruf warna, bawah ke atas: ' +
          MJ.KANDUNGAN.cecair.map(function (c) { return esc(c.huruf) + ' = ' + esc(c.label); }).join(', ') + ') ' + sumber('m2') +
          ' <input type="password" name="m2" maxlength="6" autocomplete="off"></label>' +
        '<label class="pg-medan">Kata rahsia Botol Misteri (Gulungan Rahsia) ' + sumber('rahsia') +
          ' <input type="password" name="rahsia" maxlength="20" autocomplete="off"></label>' +
        '<div class="pg-baris-butang"><button type="submit" class="pg-btn pg-btn-utama">Simpan kod</button>' +
          (MJ.KUNCI && MJ.KUNCI.kod ? btn('janaSemulaKod', 'Jana semula daripada kunci-jawapan.js') : '') +
          btn('paparCincangan', tunjukCincangan ? 'Sembunyi cincangan' : 'Papar cincangan') + '</div>' +
      '</form>';
    if (tunjukCincangan) {
      h += '<p class="pg-nota">Untuk versi awam (GitHub Pages), salin baris ini ke <code>kodHashLalai</code> dalam js/kandungan.js:</p>' +
        '<textarea class="pg-kod-teks" readonly rows="6">kodHashLalai: {\n  m1Atas: ' + JSON.stringify(k.m1Atas) +
        ',\n  m1Dasar: ' + JSON.stringify(k.m1Dasar) + ',\n  m2: ' + JSON.stringify(k.m2) + '\n},\n' +
        'kataRahsiaHashLalai: ' + JSON.stringify(k.rahsia) + ',</textarea>';
    }
    h += '</section>';
    return h;
  }

  /* Bandingkan cincangan tersimpan dengan kunci-jawapan.js (jika dimuat). */
  function semakPadanKunci() {
    var K = MJ.KUNCI;
    if (!K || !K.kod) { padanKunci = null; return; }
    var NAMA = ['m1Atas', 'm1Dasar', 'm2', 'rahsia'];
    Promise.all(NAMA.map(function (n) {
      var v = MJ.kunci ? MJ.kunci.nilai(K, n) : null;
      return v ? MJ.cincang.kod(v) : Promise.resolve(null);
    })).then(function (hs) {
      var k = MJ.keadaan.kod();
      var hasil = {};
      NAMA.forEach(function (n, i) { if (hs[i]) { hasil[n] = k[n] === hs[i]; } });
      padanKunci = hasil;
      if (terbukaF && disahkan && tabSemasa === 'kunci' && !fokusInput()) { lukisTab(); }
    }).catch(function () { padanKunci = null; });
  }

  /* Muat kunci-jawapan.js secara dinamik selepas PIN (QA-016) */
  function muatKunciPanel() {
    if (!MJ.kunci) { return; }
    MJ.kunci.muat(function () {
      if (!terbukaF || !disahkan) { if (MJ.kunci) { MJ.kunci.lepas(); } return; }
      semakPadanKunci();
      if (tabSemasa === 'jawapan' || tabSemasa === 'kunci') { if (!fokusInput()) { lukisTab(); } }
    });
  }

  /* ---------------- Tab: Metrik ---------------- */
  function cadangan(b) {
    var c = {};
    [1, 2].forEach(function (n) {
      var m = b['misi' + n];
      if (m.cop && suratMisi(b, n) === 0 && (m.cubaanKod || 0) <= 1) { c['op' + n] = 2; }
      else if (m.cop) { c['op' + n] = 1; }
    });
    if (b.misi3.cop) { c.op3 = 2; }
    return c;
  }

  function tabMetrik() {
    var p = MJ.keadaan.permainan();
    var g = MJ.keadaan.guru();
    var h = '<section class="pg-bahagian"><h3>Metrik penguasaan (0 hingga 3)</h3>' +
      '<p class="pg-nota">0 Belum, 1 Sedang Membina, 2 Hampir Menguasai, 3 Menguasai. ' +
      'Cadangan automatik hanya panduan; guru yang memutuskan.</p>' +
      '<ul class="pg-senarai pg-kecil">' + OP.map(function (o) { return '<li><b>' + esc(o.nama) + ':</b> ' + esc(o.huraian) + '</li>'; }).join('') + '</ul>' +
      '<div class="pg-jadual-bekas"><table class="pg-jadual pg-metrik"><thead><tr><th>Bot</th>' +
      OP.map(function (o) { return '<th>' + esc(o.nama) + '</th>'; }).join('') +
      '<th>Data automatik</th><th>Cadangan</th><th>Miskonsepsi</th><th>Catatan</th></tr></thead><tbody>';
    MJ.KANDUNGAN.bot.forEach(function (b) {
      var d = p.bot[b.id];
      var m = (g.metrik && g.metrik[b.id]) || {};
      var mk = m.miskonsepsi || [];
      var a = ' data-bot="' + b.id + '"';
      var c = cadangan(d);
      h += '<tr><th scope="row">' + u.lencanaBot(b.id) + '</th>';
      OP.forEach(function (o) {
        var v = (m[o.id] === null || m[o.id] === undefined) ? '' : String(m[o.id]);
        h += '<td><select data-ubah="op"' + a + ' data-op="' + o.id + '" aria-label="' + esc(o.nama) + ' Bot ' + esc(b.nama) + '">' +
          ['', '0', '1', '2', '3'].map(function (x) {
            return '<option value="' + x + '"' + (x === v ? ' selected' : '') + '>' + (x === '' ? '-' : x) + '</option>';
          }).join('') + '</select></td>';
      });
      h += '<td class="pg-kecil">Surat M1/M2/M3: ' + suratMisi(d, 1) + '/' + suratMisi(d, 2) + '/' + suratMisi(d, 3) +
        '<br>Cubaan kod M1: ' + (d.misi1.cubaanKod || 0) + ', M2: ' + (d.misi2.cubaanKod || 0) +
        '<br>Kerang baki: ' + d.kerang + '</td>';
      var cTeks = OP.filter(function (o) { return c[o.id] !== undefined; })
        .map(function (o) { return o.id.toUpperCase() + ' &ge; ' + c[o.id]; }).join('<br>');
      h += '<td class="pg-kecil">' + (cTeks || '-') + (cTeks ? '<br>' + btn('gunaCadangan', 'Guna (untuk ruang kosong)', a, 'pg-btn-kecil') : '') + '</td>';
      h += '<td>' + MISKONSEPSI.map(function (x) {
        return semak('miskon', esc(x.nama), mk.indexOf(x.id) >= 0, a + ' data-m="' + x.id + '"');
      }).join('') + '</td>';
      h += '<td><textarea data-ubah="catatan"' + a + ' rows="2" aria-label="Catatan Bot ' + esc(b.nama) + '">' + esc(m.catatan || '') + '</textarea></td></tr>';
    });
    h += '</tbody></table></div></section>';
    return h;
  }

  /* ---------------- Tab: Gelaran ---------------- */
  function cadanganGelaran(p) {
    var semua = bots();
    var terbaik = null;
    semua.forEach(function (id) {
      var n = MJ.keadaan.bintang(id, p);
      var cp = p.bot[id].copPenolong || 0;
      if (n > 0 && (!terbaik || n > terbaik.n || (n === terbaik.n && cp > terbaik.cp))) {
        terbaik = { id: id, n: n, cp: cp };
      }
    });
    var calon = semua.filter(function (id) {
      var b = p.bot[id];
      return (b.copPenolong || 0) >= 1 && b.misi3.cop && b.misi3.copMasa;
    }).sort(function (a, c) { return p.bot[a].misi3.copMasa - p.bot[c].misi3.copMasa; });
    var jb = MJ.keadaan.pemenangBonus(p);
    return {
      nakhoda: terbaik ? terbaik.id : null,
      pegawai: calon[0] || null,
      jurutera: jb[0] || null,
      juruteraSemua: jb,
      penjejak: semua.filter(function (id) { return p.bot[id].penjejakRahsia; })
    };
  }

  function tabGelaran() {
    var p = MJ.keadaan.permainan();
    var c = cadanganGelaran(p);
    var up = p.upacara || {};
    var G = MJ.KANDUNGAN.gelaran;
    var nm = function (id) { return id ? esc(namaBot(id)) : 'tiada'; };
    var h = '<section class="pg-bahagian"><h3>Gelaran untuk Upacara Jeti</h3>' +
      '<p class="pg-nota">Cadangan dikira automatik. Sahkan atau tukar, kemudian tekan Simpan. Upacara memaparkan gelaran yang disimpan.</p>' +
      '<div class="pg-jadual-bekas"><table class="pg-jadual"><thead><tr><th>Gelaran</th><th>Kriteria</th><th>Cadangan</th><th>Pilihan guru</th></tr></thead><tbody>';
    ['nakhoda', 'pegawai', 'jurutera'].forEach(function (x) {
      var cad = nm(c[x]);
      if (x === 'jurutera' && c.juruteraSemua.length > 1) { cad += ' (seri: ' + c.juruteraSemua.map(nm).join(', ') + ')'; }
      if (x === 'nakhoda' && c.nakhoda) { cad += ' (' + MJ.keadaan.bintang(c.nakhoda, p) + ' bintang)'; }
      h += '<tr><th scope="row">' + esc(G[x].nama) + '</th><td class="pg-kecil">' + esc(G[x].huraian) + '</td><td>' + cad + '</td>' +
        '<td><select data-gelaran="' + x + '" aria-label="' + esc(G[x].nama) + '">' + pilihanBot(up[x] || '', 'Tiada') + '</select></td></tr>';
    });
    h += '<tr><th scope="row">' + esc(G.penjejak.nama) + '</th><td class="pg-kecil">' + esc(G.penjejak.huraian) + '</td><td>' +
      (c.penjejak.length ? c.penjejak.map(nm).join(', ') : 'tiada') + '</td><td>' +
      MJ.KANDUNGAN.bot.map(function (b) {
        return '<label class="pg-semak"><input type="checkbox" data-gelaran-penjejak="' + b.id + '"' +
          ((up.penjejak || []).indexOf(b.id) >= 0 ? ' checked' : '') + '> ' + esc(b.nama) + '</label>';
      }).join('') + '</td></tr>';
    h += '</tbody></table></div><div class="pg-baris-butang">' +
      btn('gunaCadanganGelaran', 'Guna cadangan') + btn('simpanGelaran', 'Simpan gelaran', '', 'pg-btn-utama') + '</div></section>';

    var s = MJ.keadaan.sesi();
    var pil = function (senarai, nilai) {
      return '<option value="">Belum dipilih</option>' + senarai.map(function (x) {
        return '<option value="' + esc(x) + '"' + (x === nilai ? ' selected' : '') + '>' + esc(x) + '</option>';
      }).join('');
    };
    h += '<section class="pg-bahagian"><h3>Kuasa untuk sesi seterusnya</h3>' +
      '<p class="pg-nota">Biasanya dipilih oleh Nakhoda dan Jurutera di skrin Upacara. Boleh diubah di sini.</p>' +
      '<label class="pg-medan">Objek Misteri <select data-sesi="objekMisteri">' + pil(MJ.KANDUNGAN.objekMisteri, s.objekMisteri) + '</select></label>' +
      '<label class="pg-medan">Bot dicabar <select data-sesi="botDicabar">' + pilihanBot(s.botDicabar || '', 'Belum dipilih') + '</select></label>' +
      '<label class="pg-medan">Peraturan rakit <select data-sesi="peraturanRakit">' + pil(MJ.KANDUNGAN.peraturanRakit, s.peraturanRakit) + '</select></label>' +
      '<div class="pg-baris-butang">' + btn('simpanSesi', 'Simpan pilihan kuasa', '', 'pg-btn-utama') + '</div></section>';
    return h;
  }

  /* ---------------- Tab: Kunci Jawapan ---------------- */
  function tabJawapan() {
    var K = MJ.KUNCI;
    if (!K) { return '<section class="pg-bahagian"><p class="pg-mesej">Kunci jawapan tidak tersedia pada peranti ini.</p></section>'; }
    var h = '<section class="pg-bahagian"><h3>Nasib objek (Misi 1)</h3><div class="pg-jadual-bekas"><table class="pg-jadual">' +
      '<thead><tr><th>Objek</th><th>Huruf</th><th>Keputusan</th><th>Anggaran ketumpatan (g/cm3)</th></tr></thead><tbody>';
    MJ.KANDUNGAN.objek.forEach(function (o) {
      var n = K.nasib ? K.nasib[o.id] : null;
      h += '<tr><td>' + esc(o.nama) + '</td><td>' + esc(o.huruf) + '</td><td>' +
        (n === 'atas' ? 'Terapung' : (n === 'dasar' ? 'Tenggelam' : '-')) + '</td><td>' +
        (K.ketumpatan && K.ketumpatan[o.id] !== undefined ? esc(K.ketumpatan[o.id]) : '-') + '</td></tr>';
    });
    h += '</tbody></table></div></section>';
    if (K.kod) {
      h += '<section class="pg-bahagian"><h3>Kod misi</h3><ul class="pg-senarai">' +
        '<li>Kod Atas Air: <b>' + esc(K.kod.m1Atas) + '</b></li>' +
        '<li>Kod Dasar Sungai: <b>' + esc(K.kod.m1Dasar) + '</b></li>' +
        '<li>Kod Misi 2 (bawah ke atas): <b>' + esc(K.kod.m2) + '</b></li>' +
        (K.kataRahsia ? '<li>Kata rahsia Botol Misteri: <b>' + esc(K.kataRahsia) + '</b></li>' : '') + '</ul></section>';
    }
    if (K.menara) {
      h += '<section class="pg-bahagian"><h3>Menara cecair (bawah ke atas)</h3><p>' +
        K.menara.map(function (id) { var c = u.cecair(id); return c ? esc(c.nama + ' (' + c.label + ')') : esc(id); }).join(' &rarr; ') +
        '</p></section>';
    }
    var pm = K.penjelasanModel || {};
    h += '<section class="pg-bahagian"><h3>Contoh penjelasan model</h3><ul class="pg-senarai">';
    if (pm.m1) { h += '<li><b>Misi 1:</b> ' + esc(pm.m1) + '</li>'; }
    if (pm.m2) { h += '<li><b>Misi 2:</b> ' + esc(pm.m2) + '</li>'; }
    if (pm.m3) {
      MJ.KANDUNGAN.situasi.forEach(function (s) {
        if (pm.m3[s.id]) { h += '<li><b>Misi 3, ' + esc(s.tajuk) + ':</b> ' + esc(pm.m3[s.id]) + '</li>'; }
      });
    }
    if (pm.botol) { h += '<li><b>Botol Misteri:</b> ' + esc(pm.botol) + '</li>'; }
    h += '</ul></section>';
    return h;
  }

  /* ---------------- Tab: Data ---------------- */
  function tabData() {
    return '<section class="pg-bahagian"><h3>Laporan dan eksport</h3>' +
      '<p class="pg-nota">Data hanya disimpan dalam pelayar ini. Eksport JSON pada akhir setiap sesi sebagai sandaran.</p>' +
      '<div class="pg-baris-butang">' +
        btn('cetak', 'Cetak laporan A4', '', 'pg-btn-utama') + btn('csv', 'Eksport CSV (rekod TP)') + btn('json', 'Eksport JSON (sandaran)') +
      '</div></section>' +
      '<section class="pg-bahagian"><h3>Import JSON</h3>' +
      '<p class="pg-nota">Fail daripada tablet (Mod Tablet) hanya menggabungkan data bot tablet itu. Fail lain menggantikan semua data permainan. ' +
      'Metrik dalam fail digabungkan.</p>' +
      '<label class="pg-btn pg-fail-label">Pilih fail JSON <input type="file" class="pg-fail" accept="application/json,.json" data-ubah="import"></label>' +
      '</section>';
  }

  function barisLaporan() {
    var p = MJ.keadaan.permainan();
    var g = MJ.keadaan.guru();
    var up = p.upacara || {};
    var G = MJ.KANDUNGAN.gelaran;
    return MJ.KANDUNGAN.bot.map(function (b) {
      var d = p.bot[b.id];
      var m = (g.metrik && g.metrik[b.id]) || {};
      var gel = [];
      if (up.nakhoda === b.id) { gel.push(G.nakhoda.nama); }
      if (up.pegawai === b.id) { gel.push(G.pegawai.nama); }
      if (up.jurutera === b.id) { gel.push(G.jurutera.nama); }
      if ((up.penjejak || []).indexOf(b.id) >= 0) { gel.push(G.penjejak.nama); }
      var v = function (x) { return x === null || x === undefined || x === '' ? '-' : x; };
      return [
        b.nama, MJ.keadaan.bintang(b.id, p), v(m.op1), v(m.op2), v(m.op3),
        (m.miskonsepsi || []).map(function (id) {
          var x = MISKONSEPSI.filter(function (y) { return y.id === id; })[0];
          return x ? x.nama : id;
        }).join('; '),
        m.catatan || '',
        suratMisi(d, 1), suratMisi(d, 2), suratMisi(d, 3),
        d.misi1.cubaanKod || 0, d.misi2.cubaanKod || 0,
        d.misi1.cop ? 'Ya' : '-', d.misi2.cop ? 'Ya' : '-', d.misi3.cop ? 'Ya' : '-',
        d.copPenolong || 0, typeof d.bonusKlip === 'number' ? d.bonusKlip : '-', gel.join('; ')
      ];
    });
  }
  var KEPALA_LAPORAN = ['Bot', 'Bintang Laut', 'OP1', 'OP2', 'OP3', 'Miskonsepsi', 'Catatan', 'Surat M1', 'Surat M2', 'Surat M3',
    'Cubaan Kod M1', 'Cubaan Kod M2', 'Cop M1', 'Cop M2', 'Cop M3', 'Cop Penolong', 'Klip Rakit', 'Gelaran'];

  function tarikh() {
    var d = new Date();
    var z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }

  function muatTurun(nama, teks, jenis) {
    try {
      var blob = new Blob([teks], { type: jenis });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nama;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); if (a.parentNode) { a.parentNode.removeChild(a); } }, 1000);
      maklum('Fail ' + nama + ' dimuat turun.');
    } catch (e) {
      maklum('Gagal memuat turun fail.');
    }
  }

  function cetak() {
    var w = window.open('', '_blank');
    if (!w) { maklum('Tetingkap cetak disekat. Benarkan pop-up untuk laman ini.'); return; }
    var baris = barisLaporan();
    var p = MJ.keadaan.permainan();
    var html = '<!DOCTYPE html><html lang="ms"><head><meta charset="utf-8"><title>Laporan Misi Jeti Kuala Senyum ' + tarikh() + '</title>' +
      '<style>@page{size:A4 landscape;margin:12mm}body{font-family:"Segoe UI",Verdana,sans-serif;font-size:10pt;color:#000}' +
      'h1{font-size:15pt;margin:0 0 4pt}p{margin:2pt 0 8pt}table{border-collapse:collapse;width:100%}' +
      'th,td{border:1px solid #444;padding:3pt 4pt;text-align:left;vertical-align:top}th{background:#e8e8e8}' +
      '.nota{font-size:9pt;color:#333}</style></head><body>' +
      '<h1>Laporan Sesi: Misi Jeti Kuala Senyum</h1>' +
      '<p>Sains Tahun 4: Ketumpatan | Tarikh: ' + tarikh() + ' | Fasa terakhir: ' + esc(MJ.u.fasa(p.fasa).nama) + '</p>' +
      '<p class="nota">Metrik: 0 Belum, 1 Sedang Membina, 2 Hampir Menguasai, 3 Menguasai. ' +
      OP.map(function (o) { return esc(o.nama) + ' = ' + esc(o.huraian); }).join('; ') + '.</p>' +
      '<table><thead><tr>' + KEPALA_LAPORAN.map(function (k) { return '<th>' + esc(k) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      baris.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table><p class="nota">Tiada nama murid disimpan. Data dijana daripada pelayar guru.</p></body></html>';
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(function () { try { w.print(); } catch (e) { /* abai */ } }, 400);
  }

  function csv() {
    var sel = function (v) {
      var s = v === null || v === undefined ? '' : String(v);
      /* elak suntikan formula; QA-026: nilai tepat "-" (tiada data) dibiarkan */
      if (s !== '-' && /^[=+\-@]/.test(s)) { s = "'" + s; }
      return /[",\r\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    var teks = '﻿' + [KEPALA_LAPORAN].concat(barisLaporan()).map(function (r) {
      return r.map(sel).join(',');
    }).join('\r\n');
    muatTurun('misi-jeti-' + tarikh() + '.csv', teks, 'text/csv;charset=utf-8');
  }

  function json() {
    var g = JSON.parse(JSON.stringify(MJ.keadaan.guru()));
    delete g.pinHash;
    var obj = {
      aplikasi: 'misi-jeti-kuala-senyum', versi: 1, dieksport: new Date().toISOString(),
      permainan: MJ.keadaan.permainan(), guru: g, tetapan: MJ.keadaan.tetapan(), sesi: MJ.keadaan.sesi()
    };
    muatTurun('misi-jeti-' + tarikh() + '.json', JSON.stringify(obj, null, 2), 'application/json');
  }

  function importFail(input) {
    var f = input.files && input.files[0];
    if (!f) { return; }
    var r = new FileReader();
    r.onload = function () {
      var d = null;
      try { d = JSON.parse(String(r.result)); } catch (e) { d = null; }
      input.value = '';
      if (!d || !d.permainan || !d.permainan.bot) { maklum('Fail ini bukan eksport Misi Jeti yang sah.'); return; }
      prosesImport(d);
    };
    r.onerror = function () { maklum('Gagal membaca fail.'); };
    r.readAsText(f);
  }

  function prosesImport(d) {
    var t = d.tetapan || {};
    var hadBot = null;
    if (t.mod === 'tablet' && t.botTablet && d.permainan.bot[t.botTablet] && u.bot(t.botTablet)) {
      hadBot = t.botTablet;
      if (!window.confirm('Gabungkan data Bot ' + namaBot(hadBot) + ' daripada tablet? Data bot lain tidak disentuh.')) { return; }
      MJ.keadaan.ubah(function (q2) { q2.bot[hadBot] = d.permainan.bot[hadBot]; });
    } else {
      if (!window.confirm('Ganti SEMUA data permainan dengan fail ini?')) { return; }
      MJ.keadaan.gantiPermainan(d.permainan);
    }
    if (d.guru && d.guru.metrik) {
      MJ.keadaan.ubahGuru(function (g) {
        g.metrik = g.metrik || {};
        Object.keys(d.guru.metrik).forEach(function (id) {
          if (!u.bot(id)) { return; }
          if (hadBot && id !== hadBot) { return; }
          g.metrik[id] = d.guru.metrik[id];
        });
      });
    }
    maklum('Import selesai' + (hadBot ? ' (Bot ' + namaBot(hadBot) + ').' : '.'));
    lukisTab();
  }

  /* ---------------- Tab: Tetapan ---------------- */
  function tabTetapan() {
    var t = MJ.keadaan.tetapan();
    var kel = Math.round((t.bunyi.kelantangan || 0) * 100);
    return '<section class="pg-bahagian"><h3>Mod</h3><div class="pg-baris-butang">' +
        '<label class="pg-semak"><input type="radio" name="pg-mod" value="projektor" data-ubah="mod"' + (t.mod !== 'tablet' ? ' checked' : '') + '> Projektor</label>' +
        '<label class="pg-semak"><input type="radio" name="pg-mod" value="tablet" data-ubah="mod"' + (t.mod === 'tablet' ? ' checked' : '') + '> Tablet</label>' +
        '<label class="pg-medan pg-sebaris">Bot tablet <select data-ubah="botTablet">' + pilihanBot(t.botTablet || '', 'Tiada') + '</select></label>' +
      '</div></section>' +
      '<section class="pg-bahagian"><h3>Bunyi</h3>' +
        semak('bunyiHidup', 'Bunyi hidup', !!t.bunyi.hidup) +
        '<label class="pg-medan pg-sebaris">Kelantangan <input type="range" min="0" max="100" step="1" value="' + kel + '" data-ubah="kelantangan"> ' +
        '<output class="pg-nilai-kelantangan">' + kel + '%</output></label>' +
        '<p class="pg-nota">Lalai 40%. Disyorkan 35% hingga 45%. Meow dan purr dihadkan kepada 60% kelantangan induk.</p></section>' +
      '<section class="pg-bahagian"><h3>Kucing</h3>' +
        semak('meowHover', 'Meow hover', !!t.kucing.meowHover) +
        semak('mainBerpasangan', 'Main berpasangan', !!t.kucing.mainBerpasangan) +
        semak('kurangkanAnimasi', 'Kurangkan animasi', !!t.kucing.kurangkanAnimasi) +
        '<label class="pg-medan pg-sebaris">Mod Ringan <select data-ubah="modRingan">' +
          [['auto', 'Auto'], ['hidup', 'Hidup'], ['mati', 'Mati']].map(function (x) {
            return '<option value="' + x[0] + '"' + (t.kucing.modRingan === x[0] ? ' selected' : '') + '>' + x[1] + '</option>';
          }).join('') + '</select></label>' +
        '<p class="pg-nota">Mod Ringan sedang ' + (MJ.runtime.ringan ? 'AKTIF' : 'tidak aktif') + ' di tetingkap ini.</p></section>' +
      '<section class="pg-bahagian"><h3>Saiz teks</h3><div class="pg-baris-butang">' +
        btn('skala', 'A-', ' data-d="-0.05"') + '<span class="pg-besar">' + Math.round((Number(t.skala) || 1) * 100) + '%</span>' +
        btn('skala', 'A+', ' data-d="0.05"') + '</div></section>';
  }

  /* ---------------- Tab: Reset ---------------- */
  function tabReset() {
    return '<section class="pg-bahagian"><h3>Reset sesi</h3>' +
        '<p>Padam semua data permainan (bot, cop, bintang, peti, gelaran). Taip <b>RESET</b> untuk mengesahkan.</p>' +
        '<label class="pg-medan pg-sebaris">Pengesahan <input type="text" id="pg-reset-teks" autocomplete="off" spellcheck="false"></label>' +
        semak('tiada', 'Padam juga metrik dan log kelulusan guru', false, ' id="pg-reset-guru"') +
        '<div class="pg-baris-butang">' + btn('resetSesi', 'Reset sesi', '', 'pg-btn-bahaya') + '</div></section>' +
      '<section class="pg-bahagian"><h3>Reset satu bot</h3>' +
        '<label class="pg-medan pg-sebaris">Bot <select id="pg-reset-bot">' + pilihanBot('', 'Pilih bot') + '</select></label>' +
        btn('resetBot', 'Reset bot ini', '', 'pg-btn-bahaya') + '</section>' +
      '<section class="pg-bahagian"><h3>Tukar PIN</h3>' +
        '<form class="pg-borang" data-borang="tukarPin" autocomplete="off" novalidate>' +
          '<label class="pg-medan">PIN semasa <input type="password" name="lama" inputmode="numeric" maxlength="6" autocomplete="off"></label>' +
          '<label class="pg-medan">PIN baharu (4 hingga 6 digit) <input type="password" name="pin1" inputmode="numeric" maxlength="6" autocomplete="off"></label>' +
          '<label class="pg-medan">Ulang PIN baharu <input type="password" name="pin2" inputmode="numeric" maxlength="6" autocomplete="off"></label>' +
          '<div class="pg-baris-butang"><button type="submit" class="pg-btn pg-btn-utama">Tukar PIN</button></div>' +
          '<p class="pg-mesej" aria-live="polite"></p>' +
        '</form></section>';
  }

  var PELUKIS = {
    kelulusan: tabKelulusan, masa: tabMasa, kunci: tabKunci, metrik: tabMetrik, gelaran: tabGelaran,
    jawapan: tabJawapan, data: tabData, tetapan: tabTetapan, reset: tabReset
  };

  /* ---------------- Tindakan (klik) ---------------- */
  function beriCop(id, n, beri) {
    MJ.keadaan.ubah(function (q2) {
      var m = q2.bot[id]['misi' + n];
      m.cop = beri;
      m.copMasa = beri ? Date.now() : null;
      if (n === 3 && beri) { m.serpihan = true; }
    });
    if (beri) {
      MJ.keadaan.hantarMesej('cop', id, 'Cop Pelabuhan Misi ' + n + ' untuk Bot ' + namaBot(id) + '!');
      log(id, 'copM' + n);
      maklum('Cop Misi ' + n + ' diberi kepada Bot ' + namaBot(id) + '.');
    } else {
      log(id, 'tarikCopM' + n);
      maklum('Cop Misi ' + n + ' Bot ' + namaBot(id) + ' ditarik.');
    }
  }

  function onKlik(e) {
    var b = e.target.closest ? e.target.closest('[data-aksi]') : null;
    if (!b || !akar.contains(b) || b.disabled) { return; }
    var aksi = b.getAttribute('data-aksi');
    var bot = b.getAttribute('data-bot');
    var n = parseInt(b.getAttribute('data-n'), 10);
    var dlt = parseFloat(b.getAttribute('data-d'));
    var id = b.getAttribute('data-id');
    var T = MJ.KANDUNGAN.teksSistem;

    switch (aksi) {
      case 'tab':
        tabSemasa = b.getAttribute('data-tab');
        tunjuk = false;   /* sembunyi semula kandungan bergate apabila tukar tab */
        tunjukCubaan = false;
        tunjukCincangan = false;
        var isi = q('.pg-isi');
        if (isi) { isi.scrollTop = 0; }
        lukisTab();
        var f = q('.pg-tab-btn.aktif');
        if (f) { f.focus(); }
        break;
      case 'tunjuk':
        tunjuk = true;
        lukisTab();
        break;
      case 'tutup': tutup(); break;
      case 'kunciPanel':
        disahkan = false; tunjuk = false;
        lukisPin('Panel dikunci.');
        break;
      case 'tirai':
        tiraiAuto = false;   /* guru mengawal Tirai secara manual */
        MJ.tirai();
        kemasKepala();
        break;
      case 'tiraiHidup': MJ.tirai(true); maklum('Arahan Tirai HIDUP dihantar ke projektor.'); break;
      case 'tiraiMati': MJ.tirai(false); maklum('Arahan Tirai MATI dihantar ke projektor.'); break;

      /* Kelulusan */
      case 'cop': beriCop(bot, n, true); break;
      case 'tarikCop': beriCop(bot, n, false); break;
      case 'penolong':
        MJ.keadaan.ubah(function (q2) { q2.bot[bot].copPenolong = Math.max(0, (q2.bot[bot].copPenolong || 0) + dlt); });
        if (dlt > 0) {
          MJ.keadaan.hantarMesej('penolong', bot, 'Cop Penolong untuk Bot ' + namaBot(bot) + '!');
          log(bot, 'copPenolong');
        }
        break;
      case 'belum':
        MJ.keadaan.hantarMesej('belum', bot, T.belumLagi);
        log(bot, 'belumLagi');
        maklum('Mesej "Belum lagi" dihantar kepada Bot ' + namaBot(bot) + '.');
        break;
      case 'klip':
        var inp = q('#pg-klip-' + bot);
        var v = inp ? String(inp.value).trim() : '';
        var nk = v === '' ? null : Math.max(0, Math.min(200, parseInt(v, 10) || 0));
        MJ.keadaan.ubah(function (q2) { q2.bot[bot].bonusKlip = nk; q2.bot[bot].bonusKlipMenunggu = null; });
        if (nk !== null) { log(bot, 'klipDisahkan'); }
        maklum('Klip Bot ' + namaBot(bot) + ': ' + (nk === null ? 'dipadam' : nk + ' (disahkan)') + '.');
        break;
      case 'tolakKlip':
        MJ.keadaan.ubah(function (q2) { q2.bot[bot].bonusKlipMenunggu = null; });
        maklum('Rekod klip Bot ' + namaBot(bot) + ' yang menunggu ditolak.');
        break;
      case 'tunjukCubaan':
        tunjukCubaan = !tunjukCubaan;
        lukisTab();
        break;
      case 'lulusPenolong':
        var r = null;
        (MJ.keadaan.permainan().permintaanPenolong || []).forEach(function (x) { if (x.id === id) { r = x; } });
        if (!r) { lukisTab(); break; }
        MJ.keadaan.ubah(function (q2) {
          var pb = q2.bot[r.penolong];
          pb.copPenolong = (pb.copPenolong || 0) + 1;
          if (pb.membantu.indexOf(r.dibantu) < 0) { pb.membantu.push(r.dibantu); }
          q2.permintaanPenolong = q2.permintaanPenolong.filter(function (x) { return x.id !== id; });
        });
        MJ.keadaan.hantarMesej('penolong', r.penolong, 'Cop Penolong untuk Bot ' + namaBot(r.penolong) + '! Terima kasih kerana membantu Bot ' + namaBot(r.dibantu) + '.');
        log(r.penolong, 'copPenolong');
        break;
      case 'tolakPenolong':
        MJ.keadaan.ubah(function (q2) {
          q2.permintaanPenolong = q2.permintaanPenolong.filter(function (x) { return x.id !== id; });
        });
        break;
      case 'buangBarisan':
        MJ.keadaan.ubah(function (q2) { q2.barisanJeti = q2.barisanJeti.filter(function (x) { return x !== bot; }); });
        break;
      case 'kosongBarisan':
        MJ.keadaan.ubah(function (q2) { q2.barisanJeti = []; });
        break;

      /* Masa */
      case 'masaMula': MJ.pemasa.mula(); break;
      case 'masaJeda': MJ.pemasa.jeda(); break;
      case 'masaTambah': MJ.pemasa.tambah(dlt); break;
      case 'loceng': MJ.keadaan.hantarMesej('loceng'); maklum('Loceng dibunyikan di projektor.'); break;
      case 'fasa':
        MJ.pemasa.tetapFasa(id, false);
        if (ikutSkrin) { MJ.keadaan.navPaksa(MJ.u.fasa(id).skrin); }
        maklum('Fasa: ' + MJ.u.fasa(id).nama + ' (jeda).');
        break;
      case 'nav':
        MJ.keadaan.navPaksa(b.getAttribute('data-hash'));
        maklum('Projektor dipindahkan.');
        break;

      /* Kunci */
      case 'bukaFasaBersama':
        MJ.pemasa.tetapFasa('peti', false);
        MJ.keadaan.navPaksa('#/peti');
        maklum('Fasa bersama (Peti Mak Tok) dibuka.');
        break;
      case 'isiHukum':
        MJ.keadaan.ubah(function (q2) { if (q2.peti.ruangDiisi.indexOf(parseInt(id, 10)) < 0) { q2.peti.ruangDiisi.push(parseInt(id, 10)); } });
        break;
      case 'kosongHukum':
        MJ.keadaan.ubah(function (q2) { q2.peti.ruangDiisi = q2.peti.ruangDiisi.filter(function (x) { return x !== parseInt(id, 10); }); });
        break;
      case 'isiSemuaHukum':
        MJ.keadaan.ubah(function (q2) { q2.peti.ruangDiisi = MJ.KANDUNGAN.hukum.map(function (h) { return h.id; }); });
        break;
      case 'janaSemulaKod':
        if (!MJ.KUNCI || !MJ.KUNCI.kod) { break; }
        var KJ = MJ.KUNCI;
        Promise.all(['m1Atas', 'm1Dasar', 'm2', 'rahsia'].map(function (k) {
          var v = MJ.kunci.nilai(KJ, k);
          return v ? MJ.cincang.kod(v) : Promise.resolve(null);
        })).then(function (hs) {
          MJ.keadaan.ubahKod(function (k) {
            if (hs[0]) { k.m1Atas = hs[0]; }
            if (hs[1]) { k.m1Dasar = hs[1]; }
            if (hs[2]) { k.m2 = hs[2]; }
            if (hs[3]) { k.rahsia = hs[3]; }
            k.manual = {};
          });
          maklum('Kod dijana semula daripada kunci-jawapan.js.');
          semakPadanKunci();
          lukisTab();
        });
        break;
      case 'paparCincangan':
        tunjukCincangan = !tunjukCincangan;
        lukisTab();
        break;

      /* Metrik */
      case 'gunaCadangan':
        var c = cadangan(MJ.keadaan.permainan().bot[bot]);
        ubahMetrik(bot, function (m) {
          Object.keys(c).forEach(function (op) { if (m[op] === null || m[op] === undefined) { m[op] = c[op]; } });
        });
        lukisTab();
        break;

      /* Gelaran */
      case 'gunaCadanganGelaran':
        var cg = cadanganGelaran(MJ.keadaan.permainan());
        ['nakhoda', 'pegawai', 'jurutera'].forEach(function (x) {
          var s = q('[data-gelaran="' + x + '"]');
          if (s) { s.value = cg[x] || ''; }
        });
        qq('[data-gelaran-penjejak]').forEach(function (cb) {
          cb.checked = cg.penjejak.indexOf(cb.getAttribute('data-gelaran-penjejak')) >= 0;
        });
        maklum('Cadangan diisi. Tekan "Simpan gelaran" untuk mengesahkan.');
        break;
      case 'simpanGelaran':
        var nilai = { penjejak: [] };
        ['nakhoda', 'pegawai', 'jurutera'].forEach(function (x) {
          var s = q('[data-gelaran="' + x + '"]');
          nilai[x] = s && s.value ? s.value : null;
        });
        qq('[data-gelaran-penjejak]').forEach(function (cb) {
          if (cb.checked) { nilai.penjejak.push(cb.getAttribute('data-gelaran-penjejak')); }
        });
        MJ.keadaan.ubah(function (q2) { q2.upacara = nilai; });
        maklum('Gelaran disimpan.');
        break;
      case 'simpanSesi':
        var pil = {};
        ['objekMisteri', 'botDicabar', 'peraturanRakit'].forEach(function (x) {
          var s = q('[data-sesi="' + x + '"]');
          pil[x] = s && s.value ? s.value : null;
        });
        MJ.keadaan.ubahSesi(function (s) {
          s.objekMisteri = pil.objekMisteri; s.botDicabar = pil.botDicabar; s.peraturanRakit = pil.peraturanRakit;
          s.dikemasKini = Date.now();
        });
        maklum('Pilihan kuasa disimpan untuk sesi seterusnya.');
        break;

      /* Data */
      case 'cetak': cetak(); break;
      case 'csv': csv(); break;
      case 'json': json(); break;

      /* Tetapan */
      case 'skala':
        MJ.keadaan.ubahTetapan(function (t) {
          var sk = (Number(t.skala) || 1) + dlt;
          t.skala = Math.round(Math.max(0.85, Math.min(1.25, sk)) * 100) / 100;
        });
        lukisTab();
        break;

      /* Reset */
      case 'resetSesi':
        var rt = q('#pg-reset-teks');
        if (!rt || String(rt.value).trim().toUpperCase() !== 'RESET') {
          maklum('Taip RESET dalam kotak pengesahan dahulu.');
          break;
        }
        var padamGuru = q('#pg-reset-guru');
        MJ.keadaan.resetPermainan();
        if (padamGuru && padamGuru.checked) {
          MJ.keadaan.ubahGuru(function (g) { g.metrik = {}; g.logKelulusan = []; });
        }
        try { sessionStorage.removeItem('mjks.pasangan'); } catch (e2) { /* abai */ }
        MJ.keadaan.navPaksa('#/mula');
        maklum('Sesi direset. Projektor dipindahkan ke Skrin Mula.');
        lukisTab();
        break;
      case 'resetBot':
        var sb = q('#pg-reset-bot');
        var rid = sb ? sb.value : '';
        if (!rid) { maklum('Pilih bot dahulu.'); break; }
        if (!window.confirm('Reset semua data Bot ' + namaBot(rid) + '?')) { break; }
        MJ.keadaan.ubah(function (q2) {
          q2.bot[rid] = MJ.keadaan.lalaiBot(rid);
          Object.keys(q2.peti.serpihanDiletak).forEach(function (k) {
            if (q2.peti.serpihanDiletak[k] === rid) { delete q2.peti.serpihanDiletak[k]; }
          });
          q2.barisanJeti = q2.barisanJeti.filter(function (x) { return x !== rid; });
          q2.permintaanPenolong = q2.permintaanPenolong.filter(function (x) { return x.penolong !== rid && x.dibantu !== rid; });
        });
        maklum('Bot ' + namaBot(rid) + ' direset.');
        break;
      default: break;
    }
  }

  /* ---------------- Perubahan (select / checkbox / range / fail) ---------------- */
  function onInput(e) {
    var el = e.target;
    if (el.getAttribute && el.getAttribute('data-ubah') === 'kelantangan') {
      var o = q('.pg-nilai-kelantangan');
      if (o) { o.textContent = el.value + '%'; }
    }
  }

  function onUbah(e) {
    var el = e.target;
    var jenis = el.getAttribute ? el.getAttribute('data-ubah') : null;
    if (!jenis) { return; }
    var bot = el.getAttribute('data-bot');
    var n = parseInt(el.getAttribute('data-n'), 10);
    var on = !!el.checked;
    switch (jenis) {
      case 'penjejak':
        MJ.keadaan.ubah(function (q2) { q2.bot[bot].penjejakRahsia = on; });
        if (on) { log(bot, 'penjejakRahsia'); }
        break;
      case 'ikutSkrin': ikutSkrin = on; break;
      case 'misiDibuka': MJ.keadaan.ubah(function (q2) { q2.misiDibuka[n] = on; }); break;
      case 'ujiKelas':
        MJ.keadaan.ubah(function (q2) { q2.ujiKelas = q2.ujiKelas || {}; q2.ujiKelas[n] = on; });
        maklum('Surat P3 Misi ' + n + (on ? ' dibuka.' : ' dikunci semula.'));
        break;
      case 'bukaPaksa':
        MJ.keadaan.ubah(function (q2) { q2.bot[bot].bukaPaksa = q2.bot[bot].bukaPaksa || {}; q2.bot[bot].bukaPaksa[n] = on; });
        break;
      case 'satuKad': MJ.keadaan.ubah(function (q2) { q2.bot[bot].misi3.satuKad = on; }); break;
      case 'serpihan': MJ.keadaan.ubah(function (q2) { q2.bot[bot].misi3.serpihan = on; }); break;
      case 'petiDibuka': MJ.keadaan.ubah(function (q2) { q2.peti.dibuka = on; }); break;
      case 'op':
        var op = el.getAttribute('data-op');
        var v = el.value === '' ? null : parseInt(el.value, 10);
        ubahMetrik(bot, function (m) { m[op] = v; });
        maklum('Metrik disimpan.');
        break;
      case 'miskon':
        var mid = el.getAttribute('data-m');
        ubahMetrik(bot, function (m) {
          var i = m.miskonsepsi.indexOf(mid);
          if (on && i < 0) { m.miskonsepsi.push(mid); }
          if (!on && i >= 0) { m.miskonsepsi.splice(i, 1); }
        });
        break;
      case 'catatan':
        var teks = String(el.value || '').slice(0, 500);
        ubahMetrik(bot, function (m) { m.catatan = teks; });
        maklum('Catatan disimpan.');
        break;
      case 'mod':
        var mod = el.value === 'tablet' ? 'tablet' : 'projektor';
        MJ.keadaan.ubahTetapan(function (t) { t.mod = mod; if (mod === 'projektor') { t.botTablet = null; } });
        break;
      case 'botTablet': MJ.keadaan.ubahTetapan(function (t) { t.botTablet = el.value || null; }); break;
      case 'bunyiHidup': MJ.keadaan.ubahTetapan(function (t) { t.bunyi.hidup = on; }); break;
      case 'kelantangan':
        var kv = Math.max(0, Math.min(100, parseInt(el.value, 10) || 0)) / 100;
        MJ.keadaan.ubahTetapan(function (t) { t.bunyi.kelantangan = kv; });
        maklum('Kelantangan ' + Math.round(kv * 100) + '%.');
        break;
      case 'meowHover': MJ.keadaan.ubahTetapan(function (t) { t.kucing.meowHover = on; }); break;
      case 'mainBerpasangan': MJ.keadaan.ubahTetapan(function (t) { t.kucing.mainBerpasangan = on; }); break;
      case 'kurangkanAnimasi': MJ.keadaan.ubahTetapan(function (t) { t.kucing.kurangkanAnimasi = on; }); break;
      case 'modRingan': MJ.keadaan.ubahTetapan(function (t) { t.kucing.modRingan = el.value; }); break;
      case 'import': importFail(el); break;
      default: break;
    }
  }

  /* ---------------- Borang (PIN, kod) ---------------- */
  function sahPin(s) { return /^\d{4,6}$/.test(String(s || '')); }

  function onHantar(e) {
    var f = e.target;
    var jenis = f.getAttribute ? f.getAttribute('data-borang') : null;
    if (!jenis) { return; }
    e.preventDefault();
    var mesej = f.querySelector('.pg-mesej');
    var tulis = function (t) { if (mesej) { mesej.textContent = t; } };
    var E = f.elements;

    if (jenis === 'pin') {
      var cuba = String(E.pin.value || '');
      MJ.cincang.pin(cuba).then(function (h) {
        if (h && h === MJ.keadaan.guru().pinHash) {
          disahkan = true;
          terakhirAktif = Date.now();
          lukisPanel();
          muatKunciPanel();
        } else {
          E.pin.value = '';
          tulis('PIN tidak sepadan. Cuba lagi.');
          E.pin.focus();
        }
      });
      return;
    }
    if (jenis === 'pinBaru') {
      var p1 = String(E.pin1.value || ''), p2 = String(E.pin2.value || '');
      if (!sahPin(p1)) { tulis('PIN mesti 4 hingga 6 digit.'); return; }
      if (p1 !== p2) { tulis('PIN tidak sama. Ulang semula.'); E.pin2.value = ''; return; }
      MJ.cincang.pin(p1).then(function (h) {
        MJ.keadaan.ubahGuru(function (g) { g.pinHash = h; });
        disahkan = true;
        terakhirAktif = Date.now();
        lukisPanel();
        muatKunciPanel();
        maklum('PIN disimpan. Ingat PIN ini.');
      });
      return;
    }
    if (jenis === 'tukarPin') {
      var lama = String(E.lama.value || ''), b1 = String(E.pin1.value || ''), b2 = String(E.pin2.value || '');
      if (!sahPin(b1)) { tulis('PIN baharu mesti 4 hingga 6 digit.'); return; }
      if (b1 !== b2) { tulis('PIN baharu tidak sama.'); return; }
      MJ.cincang.pin(lama).then(function (hl) {
        if (hl !== MJ.keadaan.guru().pinHash) { tulis('PIN semasa tidak sepadan.'); E.lama.value = ''; return null; }
        return MJ.cincang.pin(b1);
      }).then(function (hb) {
        if (!hb) { return; }
        MJ.keadaan.ubahGuru(function (g) { g.pinHash = hb; });
        f.reset();
        tulis('PIN ditukar.');
      });
      return;
    }
    if (jenis === 'kod') {
      var huruf = MJ.KANDUNGAN.cecair.map(function (c) { return c.huruf; });
      var nilai = {};
      ['m1Atas', 'm1Dasar', 'm2', 'rahsia'].forEach(function (k) {
        var v = E[k] ? MJ.cincang.normal(E[k].value) : '';
        if (v) { nilai[k] = v; }
      });
      if (!Object.keys(nilai).length) { maklum('Tiada kod dimasukkan.'); return; }
      if (nilai.m2 && (nilai.m2.length !== huruf.length || nilai.m2.split('').some(function (h) { return huruf.indexOf(h) < 0; }))) {
        maklum('Kod Misi 2 mesti ' + huruf.length + ' huruf daripada: ' + huruf.join(', ') + '.');
        return;
      }
      var kunci = Object.keys(nilai);
      Promise.all(kunci.map(function (k) { return MJ.cincang.kod(nilai[k]); })).then(function (hs) {
        MJ.keadaan.ubahKod(function (k) { kunci.forEach(function (nm, i) { k[nm] = hs[i]; k.manual[nm] = true; }); });
        f.reset();
        maklum('Kod disimpan sebagai cincangan (' + kunci.length + ').');
        semakPadanKunci();
        lukisTab();
      });
    }
  }

  return {
    buka: buka,
    tutup: tutup,
    halamanPenuh: halamanPenuh,
    terbuka: function () { return terbukaF; },
    /* QA-018: kekunci T semasa panel terbuka = Tirai dikawal manual (Esc tidak mematikannya) */
    tiraiManual: function () { tiraiAuto = false; if (terbukaF && disahkan) { setTimeout(kemasKepala, 0); } }
  };
})();
