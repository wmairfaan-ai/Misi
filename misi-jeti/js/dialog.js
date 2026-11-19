/* =====================================================================
   dialog.js - gelembung dialog "taip" + segerak mulut kucing
   Hanya seekor kucing bercakap pada satu masa. Klik gelembung = langkau.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.dialog = (function () {
  'use strict';
  var aktif = false;
  var senarai = [];
  var indeks = 0;
  var selesaiCb = null;
  var pemasaTaip = null;
  var pemasaTahan = null;
  var pemasaSorok = null;
  var baris = null;
  var teksPenuh = '';
  var pos = 0;
  var sedangTaip = false;

  function gelembung(k) { return document.getElementById('gelembung-' + k); }
  function adaKucing() { return !!(MJ.kucing && MJ.kucing.sedia && !MJ.runtime.halamanGuru); }

  function bersihPemasa() {
    clearTimeout(pemasaTaip); clearTimeout(pemasaTahan); clearTimeout(pemasaSorok);
    pemasaTaip = pemasaTahan = pemasaSorok = null;
  }

  var emosiBaris = [];   // QA-038: emosi berterusan yang ditetapkan oleh baris dialog ini

  function sorokSemua() {
    ['oyen', 'kiko'].forEach(function (k) {
      var g = gelembung(k);
      if (g) {
        g.classList.remove('nampak', 'pudar', 'tembus');
        g.hidden = true;
        g.style.width = ''; g.style.minHeight = '';
      }
    });
  }

  /* Ukur gelembung dengan teks penuh dahulu supaya saiznya tetap semasa menaip,
     kemudian letak (kepit ke viewport, elak butang utama: QA-036/037). */
  function sediakanSaiz(g, k, teks) {
    var t = g.querySelector('.g-teks');
    g.style.width = ''; g.style.minHeight = '';
    g.style.left = '0px'; g.style.right = 'auto';   /* ukur tanpa dihimpit tepi skrin */
    t.textContent = teks;
    var w = g.offsetWidth, h = g.offsetHeight;
    if (w && h) { g.style.width = w + 'px'; g.style.minHeight = h + 'px'; }
    t.textContent = '';
    MJ.kucing.letakGelembung(k);
  }

  /* QA-046: MJ.muatSkrin (utama.js) mungkin menukar --muat SELEPAS baris pertama
     diukur (dialog taklimat bermula dalam papar(), muatSkrin pada bingkai rAF
     berikutnya dan selepas 1.8 s). Ukur semula gelembung aktif dengan saiz fon
     baharu, kekalkan teks yang sudah ditaip, kemudian letak semula. */
  function ukurSemula() {
    if (!aktif || !baris || !adaKucing()) { return; }
    var g = gelembung(baris.k);
    if (!g || g.hidden) { return; }
    var t = g.querySelector('.g-teks');
    var semasa = sedangTaip ? teksPenuh.slice(0, pos) : teksPenuh;
    g.style.width = ''; g.style.minHeight = '';
    g.style.left = '0px'; g.style.right = 'auto';
    t.textContent = teksPenuh;
    var w = g.offsetWidth, h = g.offsetHeight;
    if (w && h) { g.style.width = w + 'px'; g.style.minHeight = h + 'px'; }
    t.textContent = semasa;
    MJ.kucing.letakGelembung(baris.k);
  }

  function mainkan(s, selesai) {
    henti();
    if (!s || !s.length || !adaKucing()) {
      if (selesai) { selesai(); }
      return;
    }
    senarai = s.slice();
    indeks = 0;
    emosiBaris = [];
    selesaiCb = selesai || null;
    aktif = true;
    seterusnya();
  }

  function satu(k, t, e, selesai) {
    mainkan([{ k: k, t: t, e: e }], selesai);
  }

  function seterusnya() {
    bersihPemasa();
    if (indeks >= senarai.length) {
      aktif = false;
      baris = null;
      if (MJ.kucing) { MJ.kucing.mulut('oyen', false); MJ.kucing.mulut('kiko', false); MJ.kucing.dengar(null); }
      /* QA-036: selepas dialog tamat, gelembung terus pudar TANPA menerima klik
         (CSS .pudar = pointer-events:none), kemudian disorok sepenuhnya. */
      ['oyen', 'kiko'].forEach(function (k) {
        var g = gelembung(k);
        if (g && !g.hidden) { g.classList.add('pudar'); }
      });
      pemasaSorok = setTimeout(sorokSemua, 1500);
      /* QA-038: tamatkan emosi berterusan (cth. terfikir) yang dimulakan oleh baris dialog */
      var em = emosiBaris;
      emosiBaris = [];
      if (MJ.kucing && MJ.kucing.sedia) {
        em.forEach(function (x) { MJ.kucing.tamatEmosi(x.k, x.e); });
      }
      var cb = selesaiCb;
      selesaiCb = null;
      if (cb) { cb(); }
      return;
    }
    baris = senarai[indeks++];
    var g = gelembung(baris.k);
    if (!g) { seterusnya(); return; }
    if (baris.e) {
      var kc = MJ.kucing.k(baris.k);
      var sebelum = kc ? kc.emosi : null;
      MJ.kucing.setEmosi(baris.k, baris.e);
      /* hanya emosi yang DIMULAKAN oleh dialog ditamatkan kemudian (bukan 'fikir' sedia ada) */
      if (sebelum !== baris.e && kc && kc.emosi === baris.e) { emosiBaris.push({ k: baris.k, e: baris.e }); }
    }
    var lain = baris.k === 'oyen' ? 'kiko' : 'oyen';
    var gl = gelembung(lain);
    /* QA-036: gelembung kucing lain disorok terus (bukan dibiarkan pudar di atas butang) */
    if (gl && !gl.hidden) { gl.classList.remove('nampak', 'pudar', 'tembus'); gl.hidden = true; gl.style.width = ''; gl.style.minHeight = ''; }
    g.classList.remove('pudar');
    g.hidden = false;
    g.classList.add('nampak');
    sediakanSaiz(g, baris.k, String(baris.t));
    MJ.kucing.dengar(lain, baris.k);
    var live = document.getElementById('suara-dialog');
    if (live) { live.textContent = (baris.k === 'oyen' ? 'Oyen' : 'Kiko') + ': ' + baris.t; }
    teksPenuh = String(baris.t);
    pos = 0;
    sedangTaip = true;
    MJ.kucing.mulut(baris.k, true);
    taip();
  }

  function taip() {
    if (!baris) { return; }
    var g = gelembung(baris.k);
    if (pos >= teksPenuh.length) { tamatTaip(); return; }
    var c = teksPenuh.charAt(pos++);
    g.querySelector('.g-teks').textContent = teksPenuh.slice(0, pos);
    var jedaTanda = /[,.!?]/.test(c) && pos < teksPenuh.length;
    if (jedaTanda) { MJ.kucing.mulut(baris.k, false); }
    pemasaTaip = setTimeout(function () {
      if (jedaTanda && baris) { MJ.kucing.mulut(baris.k, true); }
      taip();
    }, jedaTanda ? 260 : 33);
  }

  function tamatTaip() {
    sedangTaip = false;
    if (!baris) { return; }
    var g = gelembung(baris.k);
    g.querySelector('.g-teks').textContent = teksPenuh;
    MJ.kucing.mulut(baris.k, false);
    MJ.kucing.letakGelembung(baris.k);   /* butang mungkin muncul semasa menaip */
    var perkataan = teksPenuh.split(/\s+/).length;
    pemasaTahan = setTimeout(seterusnya, Math.max(1600, perkataan * 300));
  }

  function langkau() {
    /* QA-036: klik pada gelembung selepas dialog tamat = sorok terus */
    if (!aktif) { clearTimeout(pemasaSorok); sorokSemua(); return; }
    if (sedangTaip) {
      clearTimeout(pemasaTaip);
      pos = teksPenuh.length;
      tamatTaip();
    } else {
      seterusnya();
    }
  }

  function henti() {
    bersihPemasa();
    aktif = false;
    senarai = [];
    selesaiCb = null;
    baris = null;
    sedangTaip = false;
    emosiBaris = [];
    if (MJ.kucing && MJ.kucing.sedia) {
      MJ.kucing.mulut('oyen', false); MJ.kucing.mulut('kiko', false); MJ.kucing.dengar(null);
    }
    sorokSemua();
  }

  return {
    mainkan: mainkan, satu: satu, langkau: langkau, henti: henti, ukurSemula: ukurSemula,
    aktif: function () { return aktif; },
    penutur: function () { return aktif && baris ? baris.k : null; }
  };
})();
