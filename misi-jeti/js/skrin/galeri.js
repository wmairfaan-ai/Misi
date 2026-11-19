/* =====================================================================
   galeri.js - S10 Galeri Hukum Muara (#/galeri)
   DIKUNCI sehingga Peti Mak Tok dibuka (animasi fizik betul, Spesifikasi 1.3).
   Tab: Bekas Air | Menara | Timbangan Muara. Madu TIDAK dipaparkan
   (ia muncul dalam Tiket Keluar). Data sebenar daripada MJ.KUNCI jika ada;
   jika tiada (versi awam), contoh umum daripada KANDUNGAN.galeriUmum.
   ===================================================================== */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.galeri = (function () {
  'use strict';
  var u = MJ.u;
  var TS = MJ.KANDUNGAN.teksSkrin;
  var akarS = null;
  var tabS = 'bekas';
  var dibukaTadi = null;
  var pilihS = null;

  var TAB = [
    { id: 'bekas', nama: TS.galeriTabBekas },
    { id: 'menara', nama: TS.galeriTabMenara },
    { id: 'timbangan', nama: TS.galeriTabTimbangan }
  ];

  /* Senarai objek galeri: { id, nama, nasib, k, ikon } */
  function data() {
    var K = MJ.KUNCI;
    if (K && K.nasib) {
      return MJ.KANDUNGAN.objek.filter(function (o) { return !!K.nasib[o.id]; }).map(function (o) {
        return {
          id: o.id, nama: o.nama, nasib: K.nasib[o.id],
          k: K.ketumpatan && typeof K.ketumpatan[o.id] === 'number' ? K.ketumpatan[o.id] : null,
          ikon: MJ.ikon.objek(o.id)
        };
      });
    }
    return (MJ.KANDUNGAN.galeriUmum || []).map(function (g, i) {
      return { id: 'umum' + i, nama: g.nama, nasib: g.nasib, k: typeof g.k === 'number' ? g.k : null, ikon: null };
    });
  }

  function papar(akar) {
    akarS = akar;
    tabS = 'bekas';
    pilihS = null;
    lukis(true);
    muatKunci();
  }

  /* QA-016: kunci-jawapan.js dimuat secara dinamik hanya selepas peti dibuka */
  function muatKunci() {
    if (MJ.KUNCI || !MJ.kunci || !MJ.keadaan.permainan().peti.dibuka) { return; }
    MJ.kunci.muat(function (K) {
      if (!akarS) { MJ.kunci.lepas(); return; }
      if (K) { lukisTab(); var nota = u.$('.nota-umum', akarS); if (nota) { nota.hidden = true; } }
    });
  }

  function lukis(pertama) {
    var akar = akarS;
    if (!akar) { return; }
    var p = MJ.keadaan.permainan();
    dibukaTadi = !!p.peti.dibuka;
    if (!p.peti.dibuka) {
      akar.innerHTML = '<section class="kad kad-tengah"><h1>' + u.esc(TS.galeriTajuk) + '</h1>' +
        '<p>' + u.esc(TS.galeriTerkunci) + '</p>' +
        '<div class="baris-butang tengah"><a class="btn btn-utama" href="#/peti">' + u.esc(TS.galeriKePeti) + '</a>' +
        '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></div></section>';
      return;
    }
    akar.innerHTML =
      '<section class="galeri">' +
        '<header class="kepala-misi"><h1>' + u.esc(TS.galeriTajuk) + '</h1>' +
          '<div class="galeri-tab" role="tablist">' + TAB.map(function (t) {
            return '<button class="btn btn-tab' + (t.id === tabS ? ' aktif' : '') + '" role="tab" aria-selected="' + (t.id === tabS) +
              '" data-tab="' + t.id + '">' + u.esc(t.nama) + '</button>';
          }).join('') + '</div></header>' +
        '<div id="galeri-isi"></div>' +
        '<div class="baris-butang tengah baris-galeri"><a class="btn btn-utama" href="#/upacara">' + u.esc(TS.galeriKeUpacara) + '</a>' +
          '<a class="btn" href="#/peta">' + u.esc(TS.kembaliJeti) + '</a></div>' +
      '</section>';
    u.$$('[data-tab]', akar).forEach(function (b) {
      b.addEventListener('click', function () {
        tabS = b.getAttribute('data-tab');
        u.$$('[data-tab]', akar).forEach(function (x) {
          var on = x === b;
          x.classList.toggle('aktif', on);
          x.setAttribute('aria-selected', String(on));
        });
        lukisTab();
      });
    });
    lukisTab();
    if (pertama) { MJ.dialog.mainkan(MJ.KANDUNGAN.dialog.galeri); }
  }

  function lukisTab() {
    var isi = u.$('#galeri-isi', akarS);
    if (!isi) { return; }
    if (tabS === 'menara') { isi.innerHTML = menara(); }
    else if (tabS === 'timbangan') { timbangan(isi); }
    else { isi.innerHTML = bekas(); }
  }

  /* ---------------- (a) Bekas air ---------------- */
  function bekas() {
    var d = data();
    var n = d.length || 1;
    var lebar = Math.min(11, 90 / n);
    var objek = d.map(function (o, i) {
      var atas = o.nasib === 'atas';
      var kiri = (5 + i * (90 / n)).toFixed(1);
      var gaya = 'left:' + kiri + '%;width:' + lebar.toFixed(1) + '%;' +
        (atas ? 'top:13%;--dari:-9vh;' : 'bottom:2%;--dari:-30vh;') +
        '--tunda:' + (i * 0.25).toFixed(2) + 's';
      var rupa = o.ikon || '<span class="bentuk" aria-hidden="true"></span>';
      return '<div class="galeri-objek' + (atas ? ' apung' : ' berat') + (o.ikon ? '' : ' umum') + '" style="' + gaya + '">' +
        rupa + '<span class="label">' + u.esc(o.nama) + '</span></div>';
    }).join('');
    return '<div class="galeri-isi">' +
      '<div class="galeri-bekas" role="img" aria-label="' + u.esc(TS.galeriBekasLabel) + '">' +
        '<div class="galeri-permukaan" aria-hidden="true"></div>' + objek + '</div>' +
      '<div class="kad"><h2>' + u.esc(TS.galeriBekasTajuk) + '</h2><ul class="arahan">' +
        TS.galeriBekas.map(function (t) { return '<li>' + u.tebal(t) + '</li>'; }).join('') + '</ul>' +
        (MJ.KUNCI ? '' : '<p class="kecil nota-umum">' + u.esc(TS.galeriContohUmum) + '</p>') + '</div>' +
    '</div>';
  }

  /* ---------------- (b) Menara cecair ---------------- */
  function menara() {
    var K = MJ.KUNCI;
    if (!K || !K.menara || !K.menara.length) {
      return '<div class="kad kad-tengah"><h2>' + u.esc(TS.galeriTabMenara) + '</h2>' +
        '<p>' + u.esc(TS.galeriMenaraTiada) + '</p></div>';
    }
    var arr = K.menara.slice(0, 3);   /* bawah -> atas */
    var lapisan = '';
    for (var i = arr.length - 1; i >= 0; i--) {
      var c = u.cecair(arr[i]);
      lapisan += '<div class="lapisan cecair-' + (c ? c.id : 'kosong') + '" style="--i:' + (arr.length - 1 - i) + '">' +
        '<span>' + (c ? u.esc(c.nama + ' (' + c.label + ')') : '') + '</span></div>';
    }
    return '<div class="galeri-isi">' +
      '<div class="menara-anim galeri-menara" role="img" aria-label="' + u.esc(TS.galeriMenaraLabel) + '">' + lapisan + '</div>' +
      '<div class="kad"><h2>' + u.esc(TS.galeriMenaraTajuk) + '</h2><ul class="arahan">' +
        TS.galeriMenara.map(function (t) { return '<li>' + u.tebal(t) + '</li>'; }).join('') + '</ul></div>' +
    '</div>';
  }

  /* ---------------- (c) Timbangan Muara ---------------- */
  function sudut(k) {
    /* negatif = dulang kiri (objek) turun */
    return -Math.max(-25, Math.min(25, (k - 1) * 20));
  }

  function svgTimbangan(o) {
    var ikon = o.ikon ? o.ikon.replace('<svg ', '<svg x="23" y="88" width="44" height="44" ') :
      '<rect x="27" y="96" width="36" height="32" rx="8" fill="#C8955A" stroke="#1d2a36" stroke-width="3"/>';
    return '<svg viewBox="0 0 300 210" class="ilus-timbangan" role="img" aria-label="' + u.esc(u.isi(TS.galeriTimbanganLabel, { objek: o.nama })) + '">' +
      '<rect x="110" y="190" width="80" height="12" rx="4" fill="#5E3B1F"/>' +
      '<path d="M150 64 V192" stroke="#5E3B1F" stroke-width="8" stroke-linecap="round"/>' +
      '<g class="rasuk" style="transform-box:view-box;transform-origin:150px 60px;transform:rotate(0deg)">' +
        '<rect x="40" y="55" width="220" height="10" rx="5" fill="#8A5A33" stroke="#3b2412" stroke-width="2"/></g>' +
      '<circle cx="150" cy="60" r="8" fill="#F2C230" stroke="#3b2412" stroke-width="2"/>' +
      '<g class="dulang-kiri" style="transform:translateY(0px)">' +
        '<path d="M45 60 L22 132 M45 60 L68 132" stroke="#3b2412" stroke-width="2"/>' +
        '<path d="M14 132 H76 Q72 146 45 146 Q18 146 14 132 Z" fill="#C9CED6" stroke="#1d2a36" stroke-width="3"/>' +
        ikon + '</g>' +
      '<g class="dulang-kanan" style="transform:translateY(0px)">' +
        '<path d="M255 60 L232 132 M255 60 L278 132" stroke="#3b2412" stroke-width="2"/>' +
        '<path d="M224 132 H286 Q282 146 255 146 Q228 146 224 132 Z" fill="#C9CED6" stroke="#1d2a36" stroke-width="3"/>' +
        '<rect x="235" y="98" width="40" height="34" rx="4" fill="#7EC8F0" stroke="#1B5E8C" stroke-width="3"/>' +
        '<text x="255" y="120" text-anchor="middle" font-size="12" font-weight="800" fill="#0b3c5d" font-family="Segoe UI, Verdana, sans-serif">AIR</text>' +
      '</g></svg>';
  }

  function teksTimbangan(o) {
    var kTeks = o.k !== null ? ' <span class="kecil">' + u.esc(u.isi(TS.galeriAnggaran, { k: o.k })) + '</span>' : '';
    var berat = o.k !== null ? o.k > 1 : o.nasib === 'dasar';
    return u.tebal(u.isi(berat ? TS.galeriTimbangBerat : TS.galeriTimbangRingan, { objek: o.nama })) + kTeks;
  }

  function timbangan(isi) {
    var d = data();
    if (!d.length) { isi.innerHTML = '<p>' + u.esc(TS.galeriTiadaObjek) + '</p>'; return; }
    if (!pilihS || !d.some(function (o) { return o.id === pilihS; })) { pilihS = d[0].id; }
    isi.innerHTML = '<div class="galeri-isi">' +
      '<div class="kad timbangan"><div id="timbangan-svg"></div><p class="timbangan-teks" aria-live="polite"></p></div>' +
      '<div class="kad"><h2>' + u.esc(TS.galeriTabTimbangan) + '</h2>' +
        '<p>' + u.tebal(TS.galeriTimbanganArahan) + '</p>' +
        '<div class="timbangan-pilih">' + d.map(function (o) {
          return '<button class="btn" data-timbang="' + u.esc(o.id) + '">' + u.esc(o.nama) + '</button>';
        }).join('') + '</div></div>' +
    '</div>';
    u.$$('[data-timbang]', isi).forEach(function (b) {
      b.addEventListener('click', function () { pilihS = b.getAttribute('data-timbang'); pilih(isi, d); });
    });
    pilih(isi, d);
  }

  function pilih(isi, d) {
    var o = null;
    d.forEach(function (x) { if (x.id === pilihS) { o = x; } });
    if (!o) { return; }
    u.$$('[data-timbang]', isi).forEach(function (b) {
      var on = b.getAttribute('data-timbang') === pilihS;
      b.classList.toggle('aktif', on);
      b.setAttribute('aria-pressed', String(on));
    });
    var bekasSvg = u.$('#timbangan-svg', isi);
    bekasSvg.innerHTML = svgTimbangan(o);
    u.$('.timbangan-teks', isi).innerHTML = '';
    MJ.bunyi.plup();
    var k = o.k !== null ? o.k : (o.nasib === 'dasar' ? 2 : 0.5);
    var a = sudut(k);
    var rad = a * Math.PI / 180;
    var dyKiri = -105 * Math.sin(rad);
    var dyKanan = 105 * Math.sin(rad);
    u.tunda(function () {
      var r = u.$('.rasuk', bekasSvg);
      if (!r) { return; }
      r.style.transform = 'rotate(' + a.toFixed(1) + 'deg)';
      u.$('.dulang-kiri', bekasSvg).style.transform = 'translateY(' + dyKiri.toFixed(1) + 'px)';
      u.$('.dulang-kanan', bekasSvg).style.transform = 'translateY(' + dyKanan.toFixed(1) + 'px)';
      var t = u.$('.timbangan-teks', isi);
      if (t) { t.innerHTML = teksTimbangan(o); }
    }, 60);
  }

  return {
    papar: papar,
    kemasKini: function () {
      if (!akarS) { return; }
      var dibuka = !!MJ.keadaan.permainan().peti.dibuka;
      if (dibuka !== dibukaTadi) { lukis(dibuka); muatKunci(); }
    },
    tutup: function () {
      akarS = null;
      /* buang MJ.KUNCI global selepas meninggalkan Galeri (penghala belum tukar nama di sini) */
      setTimeout(function () { if (MJ.kunci) { MJ.kunci.lepas(); } }, 0);
    }
  };
})();
