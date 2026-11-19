/* =====================================================================
   ikon.js - ilustrasi SVG sebaris (objek, potret watak, bot, peti...)
   Tiada fail imej luar. (Lihat NOTA-PEMBINAAN.md: ganti folder assets/svg)
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.ikon = (function () {
  'use strict';
  var G = 'stroke="#1d2a36" stroke-width="2.5" stroke-linejoin="round"';

  var objek = {
    pensel: '<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-35 32 32)"><rect x="10" y="26" width="38" height="12" fill="#F2C230" ' + G + '/><rect x="10" y="26" width="7" height="12" fill="#E89AA5" ' + G + '/><path d="M48 26 L58 32 L48 38 Z" fill="#E9C9A0" ' + G + '/><path d="M55 30.3 L58 32 L55 33.7 Z" fill="#333"/></g></svg>',
    gabus: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 16 h24 l-3 34 h-18 Z" fill="#C8955A" ' + G + '/><ellipse cx="32" cy="16" rx="12" ry="4" fill="#DDB07A" ' + G + '/><circle cx="27" cy="30" r="1.6" fill="#8a5a2b"/><circle cx="36" cy="38" r="1.6" fill="#8a5a2b"/><circle cx="31" cy="44" r="1.2" fill="#8a5a2b"/></svg>',
    penutup: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="22" width="36" height="20" rx="4" fill="#2F80ED" ' + G + '/><path d="M18 24 v16 M23 24 v16 M28 24 v16 M33 24 v16 M38 24 v16 M43 24 v16" stroke="#1B5BB5" stroke-width="2"/></svg>',
    straw: '<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-30 32 32)"><rect x="6" y="28" width="52" height="8" rx="3" fill="#fff" ' + G + '/><path d="M12 28 l4 8 M20 28 l4 8 M28 28 l4 8 M36 28 l4 8 M44 28 l4 8" stroke="#E0475B" stroke-width="3"/></g></svg>',
    aiskrim: '<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-30 32 32)"><rect x="8" y="27" width="48" height="10" rx="5" fill="#E8C38C" ' + G + '/></g></svg>',
    guli: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="34" r="14" fill="#8FD3F4" ' + G + '/><path d="M22 34 q10 -12 20 0 q-10 10 -20 0" fill="#2E86C1" opacity=".8"/><circle cx="27" cy="28" r="3" fill="#fff" opacity=".9"/></svg>',
    syiling: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="16" fill="#C9CED6" ' + G + '/><circle cx="32" cy="32" r="12" fill="none" stroke="#9aa2ad" stroke-width="2"/><text x="32" y="38" text-anchor="middle" font-size="14" font-weight="700" fill="#4b5560" font-family="Segoe UI, Verdana, sans-serif">10</text></svg>',
    klip: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 48 V20 a7 7 0 0 1 14 0 V44 a4 4 0 0 1 -8 0 V24" fill="none" stroke="#7f8c8d" stroke-width="4" stroke-linecap="round"/></svg>',
    batu: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 42 q-2 -14 12 -18 q12 -6 20 4 q8 8 2 16 q-8 6 -20 4 q-12 0 -14 -6 Z" fill="#8C8C8C" ' + G + '/><path d="M24 34 q6 -4 12 0" stroke="#6d6d6d" stroke-width="2" fill="none"/></svg>'
  };

  function ikonObjek(id) { return objek[id] || ''; }

  function potret(jenis) {
    if (jenis === 'maktok') {
      return '<svg viewBox="0 0 80 80" class="potret" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="#FCE9D4"/>' +
        '<path d="M12 74 q2 -26 28 -26 q26 0 28 26 Z" fill="#7B4FA0"/>' +
        '<path d="M16 40 q0 -26 24 -26 q24 0 24 26 q-2 14 -6 18 h-36 q-4 -4 -6 -18 Z" fill="#5E3A82"/>' +
        '<ellipse cx="40" cy="40" rx="15" ry="17" fill="#E8B48A"/>' +
        '<path d="M32 38 q3 -2 6 0 M42 38 q3 -2 6 0" stroke="#3a2a1a" stroke-width="2" fill="none"/>' +
        '<path d="M34 49 q6 5 12 0" stroke="#7a3b2a" stroke-width="2" fill="none"/>' +
        '<circle cx="33" cy="38" r="5" fill="none" stroke="#3a2a1a" stroke-width="1.5"/><circle cx="47" cy="38" r="5" fill="none" stroke="#3a2a1a" stroke-width="1.5"/></svg>';
    }
    if (jenis === 'pakdin') {
      return '<svg viewBox="0 0 80 80" class="potret" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="#E3F1E8"/>' +
        '<path d="M12 76 q2 -24 28 -24 q26 0 28 24 Z" fill="#1E7A5A"/>' +
        '<ellipse cx="40" cy="40" rx="16" ry="18" fill="#C98E62"/>' +
        '<rect x="24" y="14" width="32" height="13" rx="3" fill="#1d1d1d"/>' +
        '<path d="M32 38 h6 M42 38 h6" stroke="#2a1a10" stroke-width="2.5"/>' +
        '<path d="M31 47 q9 3 18 0" stroke="#2a1a10" stroke-width="3" fill="none"/>' +
        '<path d="M34 51 q6 4 12 0" stroke="#7a3b2a" stroke-width="2" fill="none"/></svg>';
    }
    return '<svg viewBox="0 0 80 80" class="potret" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="#E1ECF7"/>' +
      '<path d="M12 76 q2 -24 28 -24 q26 0 28 24 Z" fill="#0B3C5D"/>' +
      '<ellipse cx="40" cy="42" rx="16" ry="18" fill="#D9A27A"/>' +
      '<path d="M20 26 q20 -16 40 0 l-2 6 h-36 Z" fill="#fff" stroke="#0B3C5D" stroke-width="2"/>' +
      '<rect x="20" y="30" width="40" height="5" fill="#0B3C5D"/><circle cx="40" cy="24" r="3" fill="#F2C230"/>' +
      '<path d="M33 41 h5 M43 41 h5" stroke="#2a1a10" stroke-width="2.5"/>' +
      '<path d="M28 50 q12 10 24 0 q-2 8 -12 9 q-10 -1 -12 -9 Z" fill="#6b6b6b"/></svg>';
  }

  function bot(warna) {
    return '<svg viewBox="0 0 90 50" class="ikon-bot" aria-hidden="true">' +
      '<path d="M44 4 V30" stroke="#5E3B1F" stroke-width="3"/><path d="M46 6 L70 24 H46 Z" fill="#fff" stroke="#1d2a36" stroke-width="2"/>' +
      '<path d="M6 30 H84 L72 46 H18 Z" fill="' + warna + '" stroke="#1d2a36" stroke-width="2.5"/></svg>';
  }

  var bintang = '<svg viewBox="0 0 24 24" class="ikon-bintang" aria-hidden="true"><path d="M12 2 l2.9 6.6 7.1 .6 -5.4 4.7 1.6 7 -6.2 -3.7 -6.2 3.7 1.6 -7 -5.4 -4.7 7.1 -.6 Z" fill="#FF8A3D" stroke="#7a3200" stroke-width="1.5"/></svg>';
  var sauh = '<svg viewBox="0 0 24 24" class="ikon-sauh" aria-hidden="true"><circle cx="12" cy="5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5 V21 M7 11 H17 M4 15 q2 6 8 6 q6 0 8 -6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var kerang = '<svg viewBox="0 0 24 24" class="ikon-kerang" aria-hidden="true"><path d="M12 20 L3 10 q9 -10 18 0 Z" fill="#F7C6A3" stroke="#8a4a20" stroke-width="1.5"/><path d="M12 20 L8 8 M12 20 V6 M12 20 L16 8" stroke="#8a4a20" stroke-width="1.2"/></svg>';
  var kerangKosong = '<svg viewBox="0 0 24 24" class="ikon-kerang kosong" aria-hidden="true"><path d="M12 20 L3 10 q9 -10 18 0 Z" fill="none" stroke="#8a4a20" stroke-width="1.5" stroke-dasharray="2 2"/></svg>';
  var bunyiHidup = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor"/><path d="M16 9 q2 3 0 6 M18.5 7 q4 5 0 10" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
  var bunyiMati = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor"/><path d="M16 9 L22 15 M22 9 L16 15" stroke="currentColor" stroke-width="2"/></svg>';

  function bekasAir(isi) {
    return '<svg viewBox="0 0 220 170" class="ilus-bekas" aria-hidden="true">' +
      '<path d="M20 30 L35 160 H185 L200 30" fill="#EAF6FF" stroke="#1d2a36" stroke-width="4"/>' +
      '<path d="M27 80 L36 155 H184 L193 80 Z" fill="#7EC8F0" opacity=".85"/>' +
      '<path class="riak" d="M28 80 q14 -8 28 0 t28 0 t28 0 t28 0 t28 0 t26 0" stroke="#2E86C1" stroke-width="3" fill="none"/>' +
      (isi || '') + '</svg>';
  }

  function cawanKosong() {
    return '<svg viewBox="0 0 120 170" class="ilus-cawan" aria-hidden="true">' +
      '<path d="M15 10 L25 160 H95 L105 10" fill="#F4FAFF" stroke="#1d2a36" stroke-width="4"/>' +
      '<text x="60" y="95" text-anchor="middle" font-size="40" fill="#9fb3c4" font-family="Segoe UI, Verdana, sans-serif">?</text></svg>';
  }

  function peti(terbuka) {
    if (terbuka) {
      return '<svg viewBox="0 0 160 130" class="ilus-peti terbuka" aria-hidden="true">' +
        '<path d="M20 20 L140 20 L150 0 L10 0 Z" fill="#8A5A33" stroke="#3b2412" stroke-width="3" transform="rotate(-18 20 40)"/>' +
        '<rect x="15" y="45" width="130" height="75" rx="6" fill="#A86B3C" stroke="#3b2412" stroke-width="3"/>' +
        '<path d="M30 45 q50 -40 100 0" fill="#FFE27A" opacity=".85"/>' +
        '<rect x="70" y="60" width="20" height="20" rx="3" fill="#F2C230" stroke="#3b2412" stroke-width="2"/></svg>';
    }
    return '<svg viewBox="0 0 160 130" class="ilus-peti" aria-hidden="true">' +
      '<path d="M15 50 q65 -50 130 0 Z" fill="#8A5A33" stroke="#3b2412" stroke-width="3"/>' +
      '<rect x="15" y="50" width="130" height="70" rx="6" fill="#A86B3C" stroke="#3b2412" stroke-width="3"/>' +
      '<rect x="15" y="62" width="130" height="8" fill="#6d4424"/>' +
      '<rect x="70" y="58" width="20" height="24" rx="3" fill="#F2C230" stroke="#3b2412" stroke-width="2"/>' +
      '<circle cx="80" cy="68" r="3" fill="#3b2412"/></svg>';
  }

  function limau(berkulit) {
    if (berkulit) {
      return '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="20" fill="#F39C12" stroke="#8a4a00" stroke-width="3"/><circle cx="24" cy="24" r="1.5" fill="#c9780a"/><circle cx="34" cy="20" r="1.5" fill="#c9780a"/><circle cx="36" cy="34" r="1.5" fill="#c9780a"/><path d="M30 10 q4 -6 10 -4" stroke="#2e7d32" stroke-width="3" fill="none"/></svg>';
    }
    return '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="17" fill="#FFD27F" stroke="#b5741a" stroke-width="3"/><path d="M30 13 V47 M13 30 H47 M18 18 L42 42 M42 18 L18 42" stroke="#f0b04a" stroke-width="2"/></svg>';
  }

  var bendera = '<svg viewBox="0 0 80 100" class="ilus-bendera" aria-hidden="true"><path d="M14 4 V96" stroke="#5E3B1F" stroke-width="5" stroke-linecap="round"/><path class="kain" d="M17 8 q18 -6 30 0 t30 0 V44 q-15 -6 -30 0 t-30 0 Z" fill="#E07A1F" stroke="#1d2a36" stroke-width="3"/><text x="46" y="32" text-anchor="middle" font-size="16" font-weight="800" fill="#1A0E00" font-family="Segoe UI, Verdana, sans-serif">UJI</text></svg>';

  return {
    objek: ikonObjek, potret: potret, bot: bot, bintang: bintang, sauh: sauh,
    kerang: kerang, kerangKosong: kerangKosong, bunyiHidup: bunyiHidup, bunyiMati: bunyiMati,
    bekasAir: bekasAir, cawanKosong: cawanKosong, peti: peti, limau: limau, bendera: bendera
  };
})();
