/* =====================================================================
   utama.js - permulaan aplikasi (DIMUAT TERAKHIR)
   - tetapan -> kelas html, skala, kurang gerak, Mod Ringan, ikon bunyi
   - Mod Tirai (MJ.tirai), jeda animasi (MJ.kemaskiniJeda)
   - cincangan kod automatik daripada kunci-jawapan.js (jika ada)
   - mesej daripada Panel Guru (cop, belum, penolong, loceng, info, tirai)
   - pintasan papan kekunci & tekan lama logo
   ===================================================================== */
window.MJ = window.MJ || {};

(function () {
  'use strict';
  var u = MJ.u;
  var html = document.documentElement;

  /* ---------------- Tetingkap Panel Guru (#/guru)? ---------------- */
  MJ.runtime.halamanGuru = (location.hash || '').indexOf('#/guru') === 0;
  if (MJ.runtime.halamanGuru) { html.classList.add('halaman-guru'); }

  /* QA-028: ikon kosong supaya pelayar tidak meminta /favicon.ico (404).
     Ditambah dengan JS kerana semak-statik menyemak setiap href dalam index.html sebagai fail. */
  (function () {
    var ik = document.createElement('link');
    ik.rel = 'icon';
    ik.href = 'data:,';
    document.head.appendChild(ik);
  })();

  var mqKurang = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var modRinganTerakhir = null;

  /* ---------------- Jeda animasi ---------------- */
  MJ.kemaskiniJeda = function () {
    var jeda = !!(document.hidden || MJ.runtime.pgBuka || MJ.runtime.tirai);
    html.classList.toggle('jeda-animasi', jeda);
  };

  /* ---------------- Terap tetapan ---------------- */
  MJ.terapTetapan = function () {
    var t = MJ.keadaan.tetapan();
    var tablet = t.mod === 'tablet';
    html.classList.toggle('mod-tablet', tablet);
    html.classList.toggle('mod-projektor', !tablet);

    var sk = Number(t.skala);
    if (!sk || isNaN(sk)) { sk = 1; }
    sk = Math.max(0.85, Math.min(1.25, sk));
    html.style.setProperty('--skala', String(sk));

    var kurang = !!(t.kucing && t.kucing.kurangkanAnimasi) || !!(mqKurang && mqKurang.matches);
    MJ.runtime.kurangGerak = kurang;
    html.classList.toggle('kurang-gerak', kurang);

    var mr = (t.kucing && t.kucing.modRingan) || 'auto';
    if (mr === 'hidup') {
      MJ.runtime.ringan = true;
    } else if (mr === 'mati') {
      MJ.runtime.ringan = false;
    } else if (modRinganTerakhir && modRinganTerakhir !== 'auto') {
      /* baru bertukar kepada 'auto': mula semula tanpa Mod Ringan; pemantau fps akan menghidupkannya jika perlu */
      MJ.runtime.ringan = false;
    }
    modRinganTerakhir = mr;
    html.classList.toggle('mod-ringan', !!MJ.runtime.ringan);

    if ((kurang || !t.kucing.mainBerpasangan) && MJ.pasangan && MJ.pasangan.aktif()) { MJ.pasangan.lerai(true); }

    var bb = document.getElementById('btn-bunyi');
    if (bb) {
      bb.innerHTML = t.bunyi.hidup ? MJ.ikon.bunyiHidup : MJ.ikon.bunyiMati;
      bb.setAttribute('aria-pressed', t.bunyi.hidup ? 'false' : 'true');
      bb.setAttribute('aria-label', t.bunyi.hidup ? 'Senyapkan bunyi (kekunci M)' : 'Hidupkan bunyi (kekunci M)');
      bb.classList.toggle('senyap', !t.bunyi.hidup);
    }
    MJ.bunyi.kemaskiniKelantangan();
  };

  /* ---------------- Mod Tirai ---------------- */
  var tiraiJauh = false;   /* anggaran keadaan Tirai projektor, dilihat dari tetingkap #/guru */
  MJ.tirai = function (on) {
    if (MJ.runtime.halamanGuru) {
      /* Tetingkap #/guru: hantar arahan ke tetingkap projektor */
      tiraiJauh = on === undefined ? !tiraiJauh : !!on;
      MJ.keadaan.hantarMesej('tirai', null, tiraiJauh ? '1' : '0');
      MJ.bas.emit('tiraiBerubah', tiraiJauh);
      return tiraiJauh;
    }
    var s = on === undefined ? !MJ.runtime.tirai : !!on;
    MJ.runtime.tirai = s;
    var el = document.getElementById('tirai');
    if (el) { el.hidden = !s; }
    html.classList.toggle('tirai-aktif', s);
    if (s) {
      MJ.dialog.henti();
      if (MJ.pasangan) { MJ.pasangan.lerai(true); }
    }
    MJ.kemaskiniJeda();
    MJ.bas.emit('tiraiBerubah', s);
    return s;
  };

  /* ---------------- Pemuat kunci-jawapan.js (QA-016) ----------------
     Fail ini TIDAK dimuat oleh index.html. Ia disuntik secara dinamik hanya
     apabila diperlukan, dan rujukan global MJ.KUNCI dibuang selepas itu
     (kecuali semasa Panel Guru terbuka atau Galeri dipaparkan). */
  MJ.kunci = (function () {
    var menunggu = null;
    function muat(cb) {
      if (MJ.KUNCI) { cb(MJ.KUNCI); return; }
      if (menunggu) { menunggu.push(cb); return; }
      menunggu = [cb];
      var s = document.createElement('script');
      s.src = 'js/kunci-jawapan.js';
      var selesai = function () {
        var senarai = menunggu || [];
        menunggu = null;
        if (s.parentNode) { s.parentNode.removeChild(s); }
        senarai.forEach(function (f) {
          try { f(MJ.KUNCI || null); } catch (e) { if (window.console) { console.error('[MJ.kunci]', e); } }
        });
      };
      s.onload = selesai;
      s.onerror = selesai;   /* fail tiada (versi awam / tablet): teruskan tanpa kunci */
      document.head.appendChild(s);
    }
    function lepas() {
      if (MJ.runtime.pgBuka) { return; }
      /* QA-039: Galeri dikecualikan HANYA selepas Peti Mak Tok dibuka */
      if (!MJ.runtime.halamanGuru && MJ.penghala && MJ.penghala.nama() === 'galeri' &&
          MJ.keadaan.permainan().peti.dibuka) { return; }
      try { delete MJ.KUNCI; } catch (e) { MJ.KUNCI = undefined; }
    }
    /* Nilai teks biasa bagi satu kunci cincangan: m1Atas/m1Dasar/m2 daripada K.kod, rahsia daripada K.kataRahsia */
    function nilai(K, nama) {
      if (!K) { return null; }
      if (nama === 'rahsia') { return K.kataRahsia || null; }
      return K.kod ? (K.kod[nama] || null) : null;
    }
    return { muat: muat, lepas: lepas, nilai: nilai };
  })();

  function komputerGuru() {
    return location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  }

  /* ---------------- Cincangan kod daripada kunci-jawapan.js ----------------
     Dijalankan semasa but pada komputer guru sahaja (bukan Mod Tablet).
     Kod yang tiada ATAU tidak sepadan dengan kunci-jawapan.js dikemas kini,
     kecuali kod yang ditetapkan manual oleh guru (mjks.v1.kod.manual). */
  function janaKodAutomatik() {
    if (!komputerGuru() || MJ.keadaan.tetapan().mod === 'tablet') { return; }
    var NAMA = ['m1Atas', 'm1Dasar', 'm2', 'rahsia'];   /* QA-045: kata rahsia Botol juga */
    MJ.kunci.muat(function (K) {
      if (!K || !K.kod) { MJ.kunci.lepas(); return; }
      Promise.all(NAMA.map(function (k) {
        var mentahK = MJ.kunci.nilai(K, k);
        return mentahK ? MJ.cincang.kod(mentahK) : Promise.resolve(null);
      })).then(function (hs) {
        var mentah = MJ.keadaan.kodMentah();
        var manual = mentah.manual || {};
        var tukar = NAMA.filter(function (k, i) { return hs[i] && !manual[k] && mentah[k] !== hs[i]; });
        if (tukar.length) {
          MJ.keadaan.ubahKod(function (k) {
            tukar.forEach(function (nama) { k[nama] = hs[NAMA.indexOf(nama)]; });
          });
        }
        MJ.kunci.lepas();
      }).catch(function (e) {
        if (window.console) { console.warn('[MJ] gagal jana cincangan kod', e); }
        MJ.kunci.lepas();
      });
    });
  }

  /* ---------------- Muat skrin (QA-005/006) ----------------
     Teks projektor bermula pada saiz penuh (~32 px pada 1280x720). Jika
     kandungan skrin tidak muat tanpa menatal, saiz dikecilkan berperingkat
     (5%) hingga minimum 80%. Hanya Mod Projektor. */
  var muatSemasa = 1;
  function tetapMuat(m) {
    if (m !== muatSemasa) {
      muatSemasa = m;
      html.style.setProperty('--muat', String(m));
    }
  }
  /* QA-046: jika --muat berubah, gelembung dialog aktif diukur dan diletak semula
     (ia mungkin diukur dengan saiz fon lama sebelum muatSkrin dijalankan). */
  /* Pusingan 4b: ukur semula juga jika saiz tetingkap atau --skala berubah
     (saiz fon projektor bergantung pada vh/vw dan --skala, bukan --muat sahaja). */
  var asasTerakhir = '';
  function selepasMuat(sebelum) {
    var asas = window.innerWidth + 'x' + window.innerHeight + '@' + (html.style.getPropertyValue('--skala') || '1');
    var asasBerubah = asas !== asasTerakhir;
    asasTerakhir = asas;
    if ((muatSemasa !== sebelum || asasBerubah) && MJ.dialog && MJ.dialog.ukurSemula) { MJ.dialog.ukurSemula(); }
  }
  MJ.muatSkrin = function () {
    var sebelum = muatSemasa;
    var s = document.getElementById('skrin');
    if (!s || MJ.runtime.halamanGuru || !html.classList.contains('mod-projektor')) { tetapMuat(1); selepasMuat(sebelum); return; }
    tetapMuat(1);
    var m = 1;
    while (s.scrollHeight > s.clientHeight + 2 && m > 0.801) {
      m = Math.round((m - 0.05) * 100) / 100;
      tetapMuat(m);
    }
    MJ.runtime.muat = m;
    selepasMuat(sebelum);
  };
  var muatDijadual = false;
  var muatLewat = null;
  function jadualMuat() {
    if (!muatDijadual) {
      muatDijadual = true;
      requestAnimationFrame(function () { muatDijadual = false; MJ.muatSkrin(); });
    }
    clearTimeout(muatLewat);
    muatLewat = setTimeout(MJ.muatSkrin, 1800);   /* selepas peralihan CSS (cth. skrol upacara) */
  }
  function pasangMuat() {
    var s = document.getElementById('skrin');
    if (!s || MJ.runtime.halamanGuru) { return; }
    if (window.MutationObserver) {
      new MutationObserver(jadualMuat).observe(s, {
        childList: true, subtree: true, characterData: true,
        attributes: true, attributeFilter: ['class', 'hidden']
      });
    }
    window.addEventListener('resize', jadualMuat);
    MJ.bas.on('tetapanBerubah', jadualMuat);
    jadualMuat();
  }

  /* ---------------- Mesej daripada Panel Guru ---------------- */
  var mesejTerakhir = null;

  function bolehReaksiKucing() {
    return !!(MJ.kucing && MJ.kucing.sedia && !MJ.runtime.tirai && !MJ.runtime.modUji);
  }

  function kendaliMesej(m) {
    var D = MJ.KANDUNGAN.dialog;
    var T = MJ.KANDUNGAN.teksSistem;
    switch (m.jenis) {
      case 'cop':
        u.toast(m.teks || 'Cop Pelabuhan!');
        MJ.bunyi.dering();
        if (bolehReaksiKucing()) {
          MJ.kucing.hantar('cop');
          if (!MJ.runtime.suratBuka) { MJ.dialog.mainkan(D.cop); }
        }
        break;
      case 'belum':
        u.toast((m.bot && u.bot(m.bot) ? 'Bot ' + u.bot(m.bot).nama + ': ' : '') + (m.teks || T.belumLagi));
        if (bolehReaksiKucing()) {
          MJ.kucing.hantar('belumLagi');
          if (!MJ.runtime.suratBuka) { MJ.dialog.mainkan(D.belumLagi); }
        }
        break;
      case 'penolong':
        u.toast(m.teks || 'Cop Penolong!');
        MJ.bunyi.dering();
        if (bolehReaksiKucing()) { MJ.kucing.hantar('bintang'); }
        break;
      case 'loceng':
        MJ.bunyi.loceng();
        u.toast(MJ.KANDUNGAN.teksSkrin.locengToast);
        break;
      case 'tirai':
        MJ.tirai(m.teks === '1');
        break;
      case 'info':
        if (m.teks) { u.toast(m.teks); }
        break;
      default:
        break;
    }
  }

  function semakMesej() {
    if (MJ.runtime.halamanGuru) { return; }
    var m = MJ.keadaan.permainan().mesej;
    if (!m || !m.id || m.id === mesejTerakhir) { return; }
    mesejTerakhir = m.id;
    try { kendaliMesej(m); } catch (e) { if (window.console) { console.error('[MJ] mesej', e); } }
  }

  /* ---------------- Peristiwa global ---------------- */
  function dalamInput(t) {
    if (!t || !t.tagName) { return false; }
    var tag = t.tagName.toUpperCase();
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || !!t.isContentEditable;
  }

  function pasangPeristiwa() {
    document.addEventListener('pointerdown', function () {
      MJ.aktiviti();
      MJ.bunyi.sediakan();
      if (MJ.pasangan && MJ.pasangan.aktif()) { MJ.pasangan.lerai(); }
    }, true);

    document.addEventListener('keydown', function (e) {
      MJ.aktiviti();
      MJ.bunyi.sediakan();
      if (MJ.pasangan && MJ.pasangan.aktif()) { MJ.pasangan.lerai(); }

      var kunci = e.key || '';
      /* Ctrl+Shift+G: Panel Guru */
      if (e.ctrlKey && e.shiftKey && (kunci === 'G' || kunci === 'g' || e.code === 'KeyG')) {
        e.preventDefault();
        if (MJ.pg) { MJ.pg.buka(); }
        return;
      }
      if (kunci === 'Escape') {
        if (MJ.pg && MJ.pg.terbuka() && !MJ.runtime.halamanGuru) {
          MJ.pg.tutup();
        } else if (MJ.runtime.modalTerbuka) {
          u.tutupSemuaModal();
          MJ.runtime.suratBuka = false;
        }
        return;
      }
      if (dalamInput(e.target) || e.ctrlKey || e.altKey || e.metaKey) { return; }
      if (kunci === 't' || kunci === 'T') {
        e.preventDefault();
        /* QA-018: T semasa PG terbuka = guru mengawal Tirai secara manual */
        if (MJ.pg && MJ.pg.terbuka() && MJ.pg.tiraiManual) { MJ.pg.tiraiManual(); }
        MJ.tirai();
        return;
      }
      if (kunci === 'm' || kunci === 'M') {
        e.preventDefault();
        MJ.bunyi.togolSenyap();
      }
    });

    /* Tekan lama logo 3 s: Panel Guru (untuk tablet). QA-008: hanya membuka
       panel jika PIN SUDAH ditetapkan; penetapan PIN kali pertama hanya
       melalui #/guru atau Ctrl+Shift+G (MJ.pg.buka({ dariLogo: true })). */
    var logo = document.getElementById('logo');
    var pemasaLogo = null;
    function batalLogo() { if (pemasaLogo) { clearTimeout(pemasaLogo); pemasaLogo = null; } }
    if (logo) {
      logo.addEventListener('pointerdown', function () {
        batalLogo();
        pemasaLogo = setTimeout(function () {
          pemasaLogo = null;
          if (MJ.pg) { MJ.pg.buka({ dariLogo: true }); }
        }, 3000);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
        logo.addEventListener(ev, batalLogo);
      });
      logo.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    }

    var bb = document.getElementById('btn-bunyi');
    if (bb) {
      bb.addEventListener('click', function () {
        MJ.bunyi.sediakan();
        MJ.bunyi.togolSenyap();
      });
    }

    document.addEventListener('visibilitychange', MJ.kemaskiniJeda);
    if (mqKurang) {
      var f = function () { MJ.terapTetapan(); };
      if (mqKurang.addEventListener) { mqKurang.addEventListener('change', f); }
      else if (mqKurang.addListener) { mqKurang.addListener(f); }
    }

    MJ.bas.on('tetapanBerubah', MJ.terapTetapan);
    MJ.bas.on('dataBerubah', semakMesej);
  }

  /* ---------------- Urutan but ---------------- */
  function but() {
    var logo = document.getElementById('logo');
    if (logo) { logo.innerHTML = MJ.ikon.sauh + '<span class="logo-teks">Kuala Senyum</span>'; }
    var tl = document.querySelector('#tirai .tirai-logo');
    if (tl) { tl.innerHTML = MJ.ikon.sauh + '<span>Jeti Kuala Senyum</span>'; }

    var p0 = MJ.keadaan.permainan();
    mesejTerakhir = p0.mesej ? p0.mesej.id : null;   /* jangan main semula mesej lama selepas muat semula */

    MJ.terapTetapan();
    pasangPeristiwa();
    janaKodAutomatik();
    MJ.pemasa.init();
    if (!MJ.runtime.halamanGuru) {
      MJ.kucing.init();
      MJ.interaksi.init();
      MJ.pasangan.init();
    }
    MJ.penghala.init();
    MJ.kemaskiniJeda();
    pasangMuat();
  }

  try {
    but();
  } catch (e) {
    if (window.console) { console.error('[MJ] gagal dimulakan', e); }
    var s = document.getElementById('skrin');
    if (s) {
      /* QA-034: jalan keluar tanpa DevTools jika data storan rosak */
      s.innerHTML = '<div class="kad kad-ralat"><h2>Alamak!</h2><p>Aplikasi gagal dimulakan. ' +
        'Pastikan semua fail dalam folder js/ ada, kemudian muat semula halaman.</p>' +
        '<p>Jika masalah berulang, data permainan dalam pelayar ini mungkin rosak. Eksport sandaran tidak dapat dibuat dalam keadaan ini.</p>' +
        '<div class="baris-butang"><button class="btn" type="button" id="padam-data-rosak">Padam data permainan rosak dan muat semula</button></div>' +
        '<p class="kecil">Metrik guru, PIN dan kod misi tidak dipadam.</p></div>';
      var bp = document.getElementById('padam-data-rosak');
      if (bp) {
        bp.addEventListener('click', function () {
          if (!window.confirm('Padam data permainan (bot, cop, bintang, tetapan) dalam pelayar ini?')) { return; }
          try {
            localStorage.removeItem('mjks.v1.permainan');
            localStorage.removeItem('mjks.v1.tetapan');
          } catch (e2) { /* abai */ }
          location.reload();
        });
      }
    }
  }
})();
