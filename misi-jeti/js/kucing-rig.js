/* =====================================================================
   kucing-rig.js - jana SVG berlapis Si Oyen & Si Kiko (satu rig, dua rupa)
   Warna & garis luar diatur dalam css/kucing-rupa.css (kelas r-*).
   Kumpulan animasi: k-badan, k-ekor, k-kaki-depan, k-kepala, k-pandang,
   k-telinga, k-mata, k-anak-mata, k-mulut (m-tutup/m-buka/m-senyum),
   k-topi, k-sampul, k-efek (ef-*), k-zon-hover.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.rig = (function () {
  'use strict';

  function f(v) { return Math.round(v * 10) / 10; }

  /* Elips bergerigi lembut (bulu gebu) */
  function bulu(cx, cy, rx, ry, n, amp) {
    var d = '';
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2;
      var a2 = (i + 1) / n * Math.PI * 2;
      var am = (a + a2) / 2;
      if (i === 0) { d += 'M' + f(cx + rx * Math.cos(a)) + ' ' + f(cy + ry * Math.sin(a)); }
      d += ' Q' + f(cx + (rx + amp) * Math.cos(am)) + ' ' + f(cy + (ry + amp) * Math.sin(am)) +
        ' ' + f(cx + rx * Math.cos(a2)) + ' ' + f(cy + ry * Math.sin(a2));
    }
    return d + ' Z';
  }

  var EFEK =
    '<g class="k-efek">' +
      '<text class="ef ef-tanya" x="156" y="44">?</text>' +
      '<text class="ef ef-titik" x="140" y="44">...</text>' +
      '<text class="ef ef-seru" x="160" y="44">!</text>' +
      '<text class="ef ef-zzz" x="142" y="40">z z</text>' +
      '<text class="ef ef-nota" x="154" y="48">~</text>' +
      '<path class="ef ef-hati" d="M160 30 c-6 -8 -18 -2 -10 8 l10 9 l10 -9 c8 -10 -4 -16 -10 -8 Z"/>' +
      '<path class="ef ef-kilau" d="M40 40 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z M162 66 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z"/>' +
    '</g>';

  var TOPI =
    '<g class="k-topi"><path class="r-topi" d="M58 46 Q100 12 142 46 L138 55 Q100 42 62 55 Z"/>' +
    '<rect class="r-topi-pita" x="64" y="45" width="72" height="7" rx="3"/>' +
    '<circle class="r-lencana" cx="100" cy="33" r="5"/></g>';

  var SAMPUL =
    '<g class="k-sampul"><rect class="r-sampul" x="83" y="97" width="34" height="21" rx="2"/>' +
    '<path class="r-sampul-garis" d="M83 97 L100 109 L117 97"/></g>';

  var MULUT =
    '<g class="k-mulut"><path class="m-tutup" d="M92 96 Q96 100 100 96 Q104 100 108 96"/>' +
    '<ellipse class="m-buka" cx="100" cy="100" rx="5" ry="6"/>' +
    '<path class="m-senyum" d="M90 96 Q100 108 110 96"/></g>';

  function oyen() {
    var ekor = 'M136 172 C178 172 190 134 168 104';
    return '' +
      '<svg class="k-svg" viewBox="0 0 200 200" focusable="false" aria-hidden="true">' +
      '<ellipse class="k-bayang" cx="100" cy="191" rx="58" ry="7"/>' +
      '<g class="k-badan">' +
        '<g class="k-ekor"><path class="r-ekor-garis" d="' + ekor + '"/><path class="r-ekor" d="' + ekor + '"/></g>' +
        '<ellipse class="r-badan" cx="68" cy="180" rx="22" ry="11"/>' +
        '<ellipse class="r-badan" cx="132" cy="180" rx="22" ry="11"/>' +
        '<ellipse class="r-badan" cx="100" cy="143" rx="50" ry="44"/>' +
        '<ellipse class="r-perut" cx="100" cy="153" rx="26" ry="28"/>' +
        '<path class="r-jalur" d="M56 132 q9 4 16 -1 M54 148 q9 4 16 -1 M144 132 q-9 4 -16 -1 M146 148 q-9 4 -16 -1"/>' +
        '<g class="k-aksesori"><path class="r-selendang" d="M62 110 Q100 130 138 110 L134 122 Q100 140 66 122 Z"/>' +
          '<path class="r-selendang" d="M118 124 L132 146 L116 142 Z"/></g>' +
        '<g class="k-kaki-depan k-kiri"><ellipse class="r-kaki" cx="84" cy="178" rx="11" ry="13"/></g>' +
        '<g class="k-kaki-depan k-kanan"><ellipse class="r-kaki" cx="116" cy="178" rx="11" ry="13"/></g>' +
        '<g class="k-kepala"><g class="k-pandang">' +
          '<g class="k-telinga k-kiri"><path class="r-kepala" d="M60 64 L54 18 L92 44 Z"/><path class="r-telinga-dalam" d="M65 56 L60 30 L83 46 Z"/></g>' +
          '<g class="k-telinga k-kanan"><path class="r-kepala" d="M140 64 L146 18 L108 44 Z"/><path class="r-telinga-dalam" d="M135 56 L140 30 L117 46 Z"/></g>' +
          '<ellipse class="r-kepala" cx="100" cy="76" rx="46" ry="38"/>' +
          '<path class="r-jalur" d="M92 42 l2 12 M100 40 v15 M108 42 l-2 12"/>' +
          '<ellipse class="r-moncong" cx="100" cy="93" rx="18" ry="12"/>' +
          '<g class="k-mata k-kiri"><ellipse class="r-mata" cx="83" cy="74" rx="7" ry="9"/><g class="k-anak-mata"><circle class="r-kilau" cx="85" cy="70.5" r="2.5"/></g></g>' +
          '<g class="k-mata k-kanan"><ellipse class="r-mata" cx="117" cy="74" rx="7" ry="9"/><g class="k-anak-mata"><circle class="r-kilau" cx="119" cy="70.5" r="2.5"/></g></g>' +
          '<path class="r-hidung" d="M95 86 L105 86 L100 92 Z"/>' +
          MULUT +
          '<path class="r-misai" d="M80 92 L58 87 M80 97 L58 99 M120 92 L142 87 M120 97 L142 99"/>' +
          '<ellipse class="k-pipi-merah" cx="73" cy="92" rx="7" ry="4"/><ellipse class="k-pipi-merah" cx="127" cy="92" rx="7" ry="4"/>' +
          TOPI +
        '</g></g>' +
        SAMPUL +
      '</g>' +
      '<g class="k-zon-hover"><ellipse cx="100" cy="143" rx="54" ry="48"/><ellipse cx="100" cy="66" rx="50" ry="50"/></g>' +
      '</svg>';
  }

  function kiko() {
    var ekor = 'M138 174 C184 176 196 132 172 98';
    return '' +
      '<svg class="k-svg" viewBox="0 0 200 200" focusable="false" aria-hidden="true">' +
      '<ellipse class="k-bayang" cx="100" cy="191" rx="62" ry="7"/>' +
      '<g class="k-badan">' +
        '<g class="k-ekor"><path class="r-ekor-garis" d="' + ekor + '"/><path class="r-ekor" d="' + ekor + '"/></g>' +
        '<ellipse class="r-badan" cx="66" cy="180" rx="24" ry="12"/>' +
        '<ellipse class="r-badan" cx="134" cy="180" rx="24" ry="12"/>' +
        '<g class="k-bulu-gebu"><path class="r-badan" d="' + bulu(100, 144, 55, 46, 22, 5) + '"/></g>' +
        '<path class="r-surai" d="' + bulu(100, 116, 42, 17, 14, 4.5) + '"/>' +
        '<g class="k-aksesori"><path class="r-reben" d="M70 124 Q100 136 130 124 L128 131 Q100 143 72 131 Z"/>' +
          '<circle class="r-loceng" cx="100" cy="140" r="6"/><path class="r-loceng-garis" d="M96 141 h8"/></g>' +
        '<g class="k-kaki-depan k-kiri"><ellipse class="r-kaki" cx="84" cy="179" rx="12" ry="13"/></g>' +
        '<g class="k-kaki-depan k-kanan"><ellipse class="r-kaki" cx="116" cy="179" rx="12" ry="13"/></g>' +
        '<g class="k-kepala"><g class="k-pandang">' +
          '<g class="k-telinga k-kiri"><path class="r-titik" d="M60 62 L52 20 L90 42 Z"/><path class="r-telinga-dalam" d="M65 55 L59 32 L81 45 Z"/></g>' +
          '<g class="k-telinga k-kanan"><path class="r-titik" d="M140 62 L148 20 L110 42 Z"/><path class="r-telinga-dalam" d="M135 55 L141 32 L119 45 Z"/></g>' +
          '<path class="r-kepala" d="' + bulu(100, 77, 46, 38, 20, 3.5) + '"/>' +
          '<ellipse class="r-topeng" cx="100" cy="82" rx="30" ry="25"/>' +
          '<ellipse class="r-moncong" cx="100" cy="97" rx="13" ry="9"/>' +
          '<g class="k-mata k-kiri"><ellipse class="r-mata-biru" cx="85" cy="76" rx="7.5" ry="8.5"/><ellipse class="r-anak" cx="85" cy="77" rx="3" ry="5"/><g class="k-anak-mata"><circle class="r-kilau" cx="87" cy="72.5" r="2.2"/></g></g>' +
          '<g class="k-mata k-kanan"><ellipse class="r-mata-biru" cx="115" cy="76" rx="7.5" ry="8.5"/><ellipse class="r-anak" cx="115" cy="77" rx="3" ry="5"/><g class="k-anak-mata"><circle class="r-kilau" cx="117" cy="72.5" r="2.2"/></g></g>' +
          '<path class="r-hidung" d="M95 88 L105 88 L100 93 Z"/>' +
          MULUT +
          '<path class="r-misai" d="M84 95 L60 90 M84 99 L60 101 M116 95 L140 90 M116 99 L140 101"/>' +
          '<ellipse class="k-pipi-merah" cx="74" cy="94" rx="6" ry="3.5"/><ellipse class="k-pipi-merah" cx="126" cy="94" rx="6" ry="3.5"/>' +
          TOPI +
        '</g></g>' +
        SAMPUL +
      '</g>' +
      '<g class="k-zon-hover"><ellipse cx="100" cy="144" rx="60" ry="51"/><ellipse cx="100" cy="68" rx="52" ry="50"/></g>' +
      '</svg>';
  }

  /* Sprite gabungan "bola bulu" untuk bergomol (lebih ringan daripada dua rig bertindih) */
  function bolaBulu() {
    return '' +
      '<svg class="bola-svg" viewBox="0 0 240 170" focusable="false" aria-hidden="true">' +
      '<ellipse cx="120" cy="160" rx="90" ry="8" fill="rgba(0,0,0,.25)"/>' +
      '<g class="bola-putar">' +
        '<path d="M60 130 C20 140 10 100 30 80" stroke="#5A2E0E" stroke-width="20" fill="none" stroke-linecap="round"/>' +
        '<path d="M60 130 C20 140 10 100 30 80" stroke="#F08A24" stroke-width="13" fill="none" stroke-linecap="round"/>' +
        '<path d="M180 128 C226 136 232 92 206 70" stroke="#2F3B4A" stroke-width="28" fill="none" stroke-linecap="round"/>' +
        '<path d="M180 128 C226 136 232 92 206 70" stroke="#7F8C9D" stroke-width="21" fill="none" stroke-linecap="round"/>' +
        '<circle cx="95" cy="96" r="52" fill="#F08A24" stroke="#5A2E0E" stroke-width="3.5"/>' +
        '<path d="M70 80 q8 4 14 -1 M66 100 q8 4 14 -1" stroke="#C2621A" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="' + bulu(150, 92, 50, 48, 20, 5) + '" fill="#F3F0E8" stroke="#2F3B4A" stroke-width="3.5"/>' +
        '<path d="M70 52 L64 22 L92 40 Z" fill="#F08A24" stroke="#5A2E0E" stroke-width="3"/>' +
        '<path d="M172 50 L182 20 L156 38 Z" fill="#7F8C9D" stroke="#2F3B4A" stroke-width="3"/>' +
        '<ellipse cx="160" cy="70" rx="20" ry="16" fill="#7F8C9D" opacity=".85"/>' +
        '<path d="M80 70 q4 -4 8 0 M96 70 q4 -4 8 0" stroke="#1d1d1d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M150 66 q4 -4 8 0 M164 66 q4 -4 8 0" stroke="#1d1d1d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse class="bola-kaki" cx="118" cy="126" rx="11" ry="9" fill="#FFE7C2" stroke="#5A2E0E" stroke-width="3"/>' +
        '<ellipse class="bola-kaki b2" cx="132" cy="58" rx="11" ry="9" fill="#ffffff" stroke="#2F3B4A" stroke-width="3"/>' +
      '</g>' +
      '<path class="bola-hati" d="M120 20 c-6 -8 -18 -2 -10 8 l10 9 l10 -9 c8 -10 -4 -16 -10 -8 Z" fill="#F06292" stroke="#8a1c45" stroke-width="2"/>' +
      '<path class="bola-hati h2" d="M70 30 c-4 -6 -13 -1 -7 6 l7 6 l7 -6 c6 -7 -3 -12 -7 -6 Z" fill="#F06292" stroke="#8a1c45" stroke-width="2"/>' +
      '</svg>';
  }

  function svg(id) { return id === 'kiko' ? kiko() : oyen(); }

  /* QA-019: kesan teks ("?", "z z", "!") dalam SVG berasingan, DI LUAR .kb-arah,
     supaya tidak dicermin apabila kucing menghadap kiri (scaleX(-1)). */
  function efek() {
    return '<svg class="k-svg k-svg-efek" viewBox="0 0 200 200" focusable="false" aria-hidden="true">' + EFEK + '</svg>';
  }

  return { svg: svg, efek: efek, bolaBulu: bolaBulu, bulu: bulu };
})();
