/* =====================================================================
   keadaan.js - utiliti, bas peristiwa, keadaan runtime dan localStorage
   ===================================================================== */
window.MJ = window.MJ || {};

/* ---------------- Utiliti DOM kecil ---------------- */
MJ.u = (function () {
  'use strict';
  function $(sel, akar) { return (akar || document).querySelector(sel); }
  function $$(sel, akar) { return Array.prototype.slice.call((akar || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = String(html).trim();
    return t.content.firstElementChild;
  }
  /* Pemasa terikat pada skrin semasa: dibersihkan oleh penghala. */
  function tunda(fn, ms) {
    var id = setTimeout(function () {
      var i = MJ.runtime.pemasaSkrin.indexOf(id);
      if (i >= 0) { MJ.runtime.pemasaSkrin.splice(i, 1); }
      fn();
    }, ms);
    MJ.runtime.pemasaSkrin.push(id);
    return id;
  }
  function bersihPemasaSkrin() {
    MJ.runtime.pemasaSkrin.forEach(function (id) { clearTimeout(id); });
    MJ.runtime.pemasaSkrin = [];
  }
  function kocok(arr, benih) {
    /* kocok deterministik (supaya susunan sama setiap kali dipapar) */
    var a = arr.slice();
    var s = 0, i;
    var b = String(benih || 'x');
    for (i = 0; i < b.length; i++) { s = (s * 31 + b.charCodeAt(i)) % 2147483647; }
    if (!s) { s = 1; }
    for (i = a.length - 1; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      var j = s % (i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function bot(id) {
    var s = MJ.KANDUNGAN.bot;
    for (var i = 0; i < s.length; i++) { if (s[i].id === id) { return s[i]; } }
    return null;
  }
  function indeksBot(id) {
    var s = MJ.KANDUNGAN.bot;
    for (var i = 0; i < s.length; i++) { if (s[i].id === id) { return i; } }
    return -1;
  }
  function fasa(id) {
    var s = MJ.KANDUNGAN.fasa;
    for (var i = 0; i < s.length; i++) { if (s[i].id === id) { return s[i]; } }
    return s[0];
  }
  function objek(id) {
    var s = MJ.KANDUNGAN.objek;
    for (var i = 0; i < s.length; i++) { if (s[i].id === id) { return s[i]; } }
    return null;
  }
  function cecair(id) {
    var s = MJ.KANDUNGAN.cecair;
    for (var i = 0; i < s.length; i++) { if (s[i].id === id) { return s[i]; } }
    return null;
  }
  function lencanaBot(id, tambahan) {
    var b = bot(id);
    if (!b) { return ''; }
    return '<span class="lencana-bot corak-' + b.corak + '" style="--warna-bot:' + b.warna + '">' +
      '<span class="lencana-bot-corak" aria-hidden="true"></span>' +
      '<span class="lencana-bot-nama">' + esc(b.nama) + '</span>' + (tambahan || '') + '</span>';
  }
  /* Teks kandungan dengan **tebal**: escape dahulu, kemudian tukar ** kepada <b>. */
  function tebal(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  /* Ganti {nama} dalam templat teks kandungan (nilai TIDAK di-escape di sini). */
  function isi(s, nilai) {
    return String(s === undefined || s === null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) {
      return nilai && nilai[k] !== undefined ? String(nilai[k]) : m;
    });
  }
  var HAD_TOAST = 2;
  function toast(teks, jenis) {
    var t = $('#toast');
    if (!t) { return; }
    /* QA-022: paling banyak 2 toast serentak; yang paling lama dibuang dahulu */
    var ada = $$('.toast-item', t);
    while (ada.length >= HAD_TOAST) {
      var lama = ada.shift();
      if (lama.parentNode) { lama.parentNode.removeChild(lama); }
    }
    var item = el('<div class="toast-item ' + (jenis ? 'toast-' + jenis : '') + '">' + esc(teks) + '</div>');
    t.appendChild(item);
    setTimeout(function () { item.classList.add('hilang'); }, 4200);
    setTimeout(function () { if (item.parentNode) { item.parentNode.removeChild(item); } }, 4800);
  }
  function modal(html, opsyen) {
    opsyen = opsyen || {};
    var akar = $('#lapisan-atas');
    var latar = el('<div class="modal-latar" role="dialog" aria-modal="true"></div>');
    var kotak = el('<div class="modal ' + (opsyen.kelas || '') + '"></div>');
    kotak.innerHTML = html;
    latar.appendChild(kotak);
    akar.appendChild(latar);
    var objekModal = {
      el: kotak,
      latar: latar,
      tutup: function () {
        if (latar.parentNode) { latar.parentNode.removeChild(latar); }
        MJ.runtime.modalTerbuka = $$('.modal-latar', akar).length;
        if (opsyen.semasaTutup) { opsyen.semasaTutup(); }
      }
    };
    $$('[data-tutup]', kotak).forEach(function (b) {
      b.addEventListener('click', function () { objekModal.tutup(); });
    });
    MJ.runtime.modalTerbuka = $$('.modal-latar', akar).length;
    var fokus = $('button, [tabindex="0"], input, select', kotak);
    if (fokus) { setTimeout(function () { fokus.focus(); }, 30); }
    return objekModal;
  }
  function tutupSemuaModal() {
    $$('#lapisan-atas .modal-latar').forEach(function (m) { m.parentNode.removeChild(m); });
    MJ.runtime.modalTerbuka = 0;
  }
  /* Pilih bot. penapis(botId, permainan) -> { boleh: bool, sebab: '' } */
  function pilihBot(tajuk, penapis, cb) {
    var tet = MJ.keadaan.tetapan();
    if (tet.mod === 'tablet' && tet.botTablet) {
      var p0 = MJ.keadaan.permainan();
      var r0 = penapis ? penapis(tet.botTablet, p0) : { boleh: true };
      if (r0.boleh) { cb(tet.botTablet); } else { toast(r0.sebab || 'Belum dibuka.'); }
      return;
    }
    var p = MJ.keadaan.permainan();
    var html = '<h2>' + esc(tajuk) + '</h2><div class="grid-pilih-bot">';
    MJ.KANDUNGAN.bot.forEach(function (b) {
      var r = penapis ? penapis(b.id, p) : { boleh: true };
      html += '<button class="btn btn-bot" data-bot="' + b.id + '"' + (r.boleh ? '' : ' disabled') + '>' +
        lencanaBot(b.id) + (r.boleh ? '' : '<span class="kecil sebab">' + esc(r.sebab || '') + '</span>') +
        '</button>';
    });
    html += '</div><div class="baris-butang"><button class="btn" data-tutup>Batal</button></div>';
    var m = modal(html, { kelas: 'modal-lebar' });
    $$('[data-bot]', m.el).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-bot');
        m.tutup();
        cb(id);
      });
    });
  }
  return {
    $: $, $$: $$, esc: esc, tebal: tebal, isi: isi, el: el, tunda: tunda, bersihPemasaSkrin: bersihPemasaSkrin,
    kocok: kocok, bot: bot, indeksBot: indeksBot, fasa: fasa, objek: objek, cecair: cecair,
    lencanaBot: lencanaBot, toast: toast, modal: modal, tutupSemuaModal: tutupSemuaModal,
    pilihBot: pilihBot
  };
})();

/* ---------------- Bas peristiwa ---------------- */
MJ.bas = (function () {
  'use strict';
  var pendengar = {};
  return {
    on: function (nama, fn) { (pendengar[nama] = pendengar[nama] || []).push(fn); },
    off: function (nama, fn) {
      var s = pendengar[nama] || [];
      var i = s.indexOf(fn);
      if (i >= 0) { s.splice(i, 1); }
    },
    emit: function (nama, data) {
      (pendengar[nama] || []).slice().forEach(function (fn) {
        try { fn(data); } catch (e) { if (window.console) { console.error('[MJ.bas]', nama, e); } }
      });
    }
  };
})();

/* ---------------- Keadaan runtime (tidak disimpan) ---------------- */
MJ.runtime = {
  halamanGuru: false,   // tetingkap #/guru
  modUji: false,        // skrin Mod Uji aktif
  tirai: false,
  pgBuka: false,
  modalTerbuka: 0,
  suratBuka: false,
  pemasaSkrin: [],
  aktivitiTerakhir: Date.now(),
  ringan: false,        // Mod Ringan aktif (auto atau tetapan)
  kurangGerak: false
};
MJ.aktiviti = function () { MJ.runtime.aktivitiTerakhir = Date.now(); };

/* ---------------- localStorage ---------------- */
MJ.keadaan = (function () {
  'use strict';
  var KUNCI = {
    permainan: 'mjks.v1.permainan',
    guru: 'mjks.v1.guru',
    tetapan: 'mjks.v1.tetapan',
    sesi: 'mjks.v1.sesiSeterusnya',
    kod: 'mjks.v1.kod'
  };
  var memori = {};   // sandaran jika localStorage tidak tersedia
  var adaStorage = (function () {
    try {
      var k = 'mjks.ujian';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })();

  function baca(kunci, lalai) {
    var mentah = null;
    try {
      mentah = adaStorage ? window.localStorage.getItem(kunci) : (memori[kunci] || null);
    } catch (e) { mentah = memori[kunci] || null; }
    if (!mentah) { return lalai; }
    try { return JSON.parse(mentah); } catch (e2) { return lalai; }
  }
  var gagalDimaklum = false;
  function tulis(kunci, nilai) {
    var s = JSON.stringify(nilai);
    try {
      if (adaStorage) { window.localStorage.setItem(kunci, s); } else { memori[kunci] = s; }
    } catch (e) {
      memori[kunci] = s;
      if (window.console) { console.warn('[MJ.keadaan] gagal simpan', e); }
      /* QA-034: jangan gagal secara senyap */
      if (!gagalDimaklum && MJ.u && MJ.KANDUNGAN) {
        gagalDimaklum = true;
        try { MJ.u.toast(MJ.KANDUNGAN.teksSistem.simpanGagal); } catch (e2) { /* abai */ }
      }
    }
  }
  function objekBiasa(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }

  function lalaiBot(id) {
    return {
      id: id,
      peranan: { kapten: 1, penguji: 2, jurutulis: 3, pemerhati: 4, juruhubung: 5 },
      dilantik: false,
      bukaPaksa: {},
      misi1: { langkah: 'ramal', ramalan: {}, ramalanOleh: {}, keputusan: {}, kejutan: null,
               kodDiterima: false, cubaanKod: 0, cop: false, copMasa: null },
      misi2: { langkah: 'ramal', ramalan: [null, null, null], pemerhatian: [null, null, null],
               kodDiterima: false, cubaanKod: 0, cop: false, copMasa: null },
      misi3: { satuKad: false, kadDibuka: [], cop: false, copMasa: null, serpihan: false },
      kerang: 3,
      suratDibuka: [],
      copPenolong: 0,
      membantu: [],
      penjejakRahsia: false,
      botolDibuka: false,
      bonusDibuka: false,
      bonusKlip: null,          // nilai yang DISAHKAN guru (Panel Guru > Simpan klip)
      bonusKlipMenunggu: null   // rekod murid, menunggu pengesahan guru (QA-012)
    };
  }
  function lalaiPermainan() {
    var bot = {};
    MJ.KANDUNGAN.bot.forEach(function (b) { bot[b.id] = lalaiBot(b.id); });
    return {
      versi: 1,
      dimulakan: false,
      fasa: 'mula',
      misiDibuka: { 1: true, 2: false, 3: false },
      /* QA-044: Bendera Uji kelas sudah diangkat (Mod Projektor) -> P3 M1/M2 dibuka */
      ujiKelas: { 1: false, 2: false },
      pemasa: { fasa: 'mula', jumlahSaat: 180, tamatPada: null, bakiSaat: 180, dijeda: true,
                amaran2: false, tamatBerbunyi: false },
      barisanJeti: [],
      permintaanPenolong: [],
      bot: bot,
      peti: { serpihanDiletak: {}, ruangDiisi: [], dibuka: false },
      upacara: { nakhoda: null, pegawai: null, jurutera: null, penjejak: [] },
      mesej: null,
      navPaksa: null
    };
  }
  function pastikanStruktur(p) {
    var l = lalaiPermainan();
    if (!objekBiasa(p)) { return l; }
    /* QA-034: medan null / jenis salah diganti dengan lalai (bukan hanya undefined) */
    Object.keys(l).forEach(function (k) {
      var lv = l[k];
      if (p[k] === undefined) { p[k] = lv; return; }
      if (Array.isArray(lv) && !Array.isArray(p[k])) { p[k] = lv; return; }
      if (objekBiasa(lv) && !objekBiasa(p[k])) { p[k] = lv; }
    });
    ['serpihanDiletak'].forEach(function (k) { if (!objekBiasa(p.peti[k])) { p.peti[k] = {}; } });
    if (!Array.isArray(p.peti.ruangDiisi)) { p.peti.ruangDiisi = []; }
    if (!objekBiasa(p.pemasa)) { p.pemasa = l.pemasa; }
    if (!objekBiasa(p.upacara)) { p.upacara = l.upacara; }
    if (!Array.isArray(p.upacara.penjejak)) { p.upacara.penjejak = []; }
    MJ.KANDUNGAN.bot.forEach(function (b) {
      if (!objekBiasa(p.bot[b.id])) { p.bot[b.id] = lalaiBot(b.id); return; }
      var lb = lalaiBot(b.id);
      var pb = p.bot[b.id];
      Object.keys(lb).forEach(function (k) {
        var lv = lb[k];
        if (pb[k] === undefined) { pb[k] = lv; return; }
        if (Array.isArray(lv) && !Array.isArray(pb[k])) { pb[k] = lv; return; }
        if (objekBiasa(lv) && !objekBiasa(pb[k])) { pb[k] = lv; return; }
        if (objekBiasa(lv)) {
          Object.keys(lv).forEach(function (k2) {
            var lv2 = lv[k2];
            if (pb[k][k2] === undefined) { pb[k][k2] = lv2; return; }
            if (Array.isArray(lv2) && !Array.isArray(pb[k][k2])) { pb[k][k2] = lv2; return; }
            if (objekBiasa(lv2) && !objekBiasa(pb[k][k2])) { pb[k][k2] = lv2; }
          });
        }
      });
      if (typeof pb.kerang !== 'number') { pb.kerang = 0; }
    });
    return p;
  }
  function lalaiTetapan() {
    return {
      mod: 'projektor',
      botTablet: null,
      bunyi: { hidup: true, kelantangan: 0.40 },
      skala: 1,
      kucing: { meowHover: true, mainBerpasangan: true, kurangkanAnimasi: false, modRingan: 'auto' }
    };
  }
  function lalaiGuru() {
    return { pinHash: null, metrik: {}, logKelulusan: [] };
  }

  var api = {
    KUNCI: KUNCI,
    adaStorage: adaStorage,
    lalaiBot: lalaiBot,
    lalaiPermainan: lalaiPermainan,

    permainan: function () { return pastikanStruktur(baca(KUNCI.permainan, null)); },
    ubah: function (fn) {
      var p = api.permainan();
      fn(p);
      tulis(KUNCI.permainan, p);
      MJ.bas.emit('dataBerubah', { kunci: 'permainan', luar: false });
      return p;
    },
    gantiPermainan: function (p) {
      tulis(KUNCI.permainan, pastikanStruktur(p));
      MJ.bas.emit('dataBerubah', { kunci: 'permainan', luar: false });
    },

    tetapan: function () {
      var t = baca(KUNCI.tetapan, null);
      var l = lalaiTetapan();
      if (!objekBiasa(t)) { return l; }
      Object.keys(l).forEach(function (k) { if (t[k] === undefined || t[k] === null && l[k] !== null) { t[k] = l[k]; } });
      if (!objekBiasa(t.kucing)) { t.kucing = l.kucing; }
      if (!objekBiasa(t.bunyi)) { t.bunyi = l.bunyi; }
      Object.keys(l.kucing).forEach(function (k) { if (t.kucing[k] === undefined) { t.kucing[k] = l.kucing[k]; } });
      Object.keys(l.bunyi).forEach(function (k) { if (t.bunyi[k] === undefined) { t.bunyi[k] = l.bunyi[k]; } });
      return t;
    },
    ubahTetapan: function (fn) {
      var t = api.tetapan();
      fn(t);
      tulis(KUNCI.tetapan, t);
      MJ.bas.emit('tetapanBerubah', t);
      return t;
    },

    /* DATA GURU: hanya dibaca oleh panel-guru.js */
    guru: function () {
      var g = baca(KUNCI.guru, null);
      var l = lalaiGuru();
      if (!objekBiasa(g)) { return l; }
      if (!objekBiasa(g.metrik)) { g.metrik = {}; }
      if (!Array.isArray(g.logKelulusan)) { g.logKelulusan = []; }
      Object.keys(l).forEach(function (k) { if (g[k] === undefined) { g[k] = l[k]; } });
      return g;
    },
    ubahGuru: function (fn) {
      var g = api.guru();
      fn(g);
      tulis(KUNCI.guru, g);
      return g;
    },

    /* Cincangan kod misi (bukan metrik) */
    kod: function () {
      var k = api.kodMentah();
      var lalai = MJ.KANDUNGAN.kodHashLalai || {};
      return {
        m1Atas: k.m1Atas || lalai.m1Atas || null,
        m1Dasar: k.m1Dasar || lalai.m1Dasar || null,
        m2: k.m2 || lalai.m2 || null,
        /* QA-045: cincangan kata rahsia Botol Misteri */
        rahsia: k.rahsia || MJ.KANDUNGAN.kataRahsiaHashLalai || null
      };
    },
    /* mjks.v1.kod: { m1Atas, m1Dasar, m2 (cincangan), manual: {nama: true} }
       manual = ditetapkan guru dalam PG > Kunci (tidak ditimpa oleh kunci-jawapan.js) */
    kodMentah: function () {
      var k = baca(KUNCI.kod, null);
      return objekBiasa(k) ? k : {};
    },
    ubahKod: function (fn) {
      var k = api.kodMentah();
      if (!objekBiasa(k.manual)) { k.manual = {}; }
      fn(k);
      tulis(KUNCI.kod, k);
      return k;
    },

    sesi: function () { return baca(KUNCI.sesi, {}) || {}; },
    ubahSesi: function (fn) {
      var s = api.sesi();
      fn(s);
      tulis(KUNCI.sesi, s);
      return s;
    },

    /* Nilai terbitan */
    copMisi: function (b) {
      return (b.misi1.cop ? 1 : 0) + (b.misi2.cop ? 1 : 0) + (b.misi3.cop ? 1 : 0);
    },
    pemenangBonus: function (p) {
      var maks = 0, pemenang = [];
      Object.keys(p.bot).forEach(function (id) {
        var k = p.bot[id].bonusKlip;
        if (typeof k === 'number' && k > maks) { maks = k; pemenang = [id]; }
        else if (typeof k === 'number' && k === maks && maks > 0) { pemenang.push(id); }
      });
      return pemenang;
    },
    bintang: function (id, p) {
      p = p || api.permainan();
      var b = p.bot[id];
      if (!b) { return 0; }
      var n = api.copMisi(b) + Math.min(b.copPenolong || 0, 2);
      if (api.pemenangBonus(p).indexOf(id) >= 0) { n += 1; }
      return n;
    },
    misiBoleh: function (id, misi, p) {
      p = p || api.permainan();
      var b = p.bot[id];
      if (!b) { return false; }
      if (b.bukaPaksa && b.bukaPaksa[misi]) { return true; }
      return !!p.misiDibuka[misi];
    },
    /* QA-044: surat P3 Misi 1/2 hanya selepas krew menguji di air:
       Projektor = Bendera Uji kelas diangkat (p.ujiKelas[n]);
       Tablet = M1 dan M2 selepas Selesai Uji (langkah 'rekod' atau 'kod');
       atau kod misi sudah diterima. M3 tiada kunci.
       QA-048 (pusingan 4b): M1 dahulu hanya 'kod', jadi "Ubah Rekod" (kod -> rekod)
       mengunci semula P3 walaupun krew sudah menguji. Langkah 'rekod' hanya dicapai
       selepas Selesai Uji (tiada laluan kembali ke 'ramal'/'uji'), jadi P3 kekal
       terkunci SEBELUM ujian. */
    suratP3Dibuka: function (id, misi, p) {
      p = p || api.permainan();
      if (misi !== 1 && misi !== 2) { return true; }
      var b = p.bot[id];
      if (!b) { return false; }
      var m = b['misi' + misi];
      if (m.kodDiterima) { return true; }
      if (p.ujiKelas && p.ujiKelas[misi]) { return true; }
      return m.langkah === 'rekod' || m.langkah === 'kod';
    },
    hantarMesej: function (jenis, bot, teks) {
      api.ubah(function (p) {
        p.mesej = { id: Date.now() + '-' + Math.floor(Math.random() * 1000), jenis: jenis, bot: bot || null, teks: teks || '' };
      });
    },
    navPaksa: function (hash) {
      api.ubah(function (p) {
        p.navPaksa = { id: Date.now() + '-' + Math.floor(Math.random() * 1000), hash: hash };
      });
    },
    resetPermainan: function () {
      tulis(KUNCI.permainan, lalaiPermainan());
      MJ.bas.emit('dataBerubah', { kunci: 'permainan', luar: false, reset: true });
    }
  };

  /* Segerak antara tetingkap (projektor <-> #/guru) */
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf('mjks.') !== 0) { return; }
    if (e.key === KUNCI.tetapan) { MJ.bas.emit('tetapanBerubah', api.tetapan()); return; }
    MJ.bas.emit('dataBerubah', { kunci: e.key, luar: true });
  });

  return api;
})();
