/* =====================================================================
   cincang.js - SHA-256 untuk PIN guru dan kod misi
   Guna Web Crypto (localhost / https). Sandaran JavaScript tulen untuk
   file:// atau pelayar lama. Semua fungsi memulangkan Promise<string hex>.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.cincang = (function () {
  'use strict';

  /* ---- Sandaran SHA-256 JavaScript tulen (input: rentetan bait 0-255) ---- */
  function sha256Js(ascii) {
    function rr(v, n) { return (v >>> n) | (v << (32 - n)); }
    var maxWord = Math.pow(2, 32);
    var result = '';
    var words = [];
    var asciiBitLength = ascii.length * 8;
    var hash = [];
    var k = [];
    var primeCounter = 0;
    var isComposite = {};
    var i, j, candidate;
    for (candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii.length % 64 - 56) { ascii += '\x00'; }
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) { return null; }
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = (asciiBitLength);
    hash = hash.slice(0, 8);
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16);
      var oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7] +
          (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) +
          ((e & hash[5]) ^ ((~e) & hash[6])) +
          k[i] +
          (w[i] = (i < 16) ? w[i] : (
            w[i - 16] +
            (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) +
            w[i - 7] +
            (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))
          ) | 0);
        var temp2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  function keUtf8(teks) {
    return unescape(encodeURIComponent(String(teks)));
  }

  function bolehWebCrypto() {
    return !!(window.isSecureContext && window.crypto && window.crypto.subtle &&
      window.TextEncoder);
  }

  function sha256(teks) {
    if (bolehWebCrypto()) {
      try {
        var data = new TextEncoder().encode(String(teks));
        return window.crypto.subtle.digest('SHA-256', data).then(function (buf) {
          var arr = new Uint8Array(buf);
          var hex = '';
          for (var i = 0; i < arr.length; i++) {
            hex += (arr[i] < 16 ? '0' : '') + arr[i].toString(16);
          }
          return hex;
        }).catch(function () {
          return sha256Js(keUtf8(teks));
        });
      } catch (e) {
        /* jatuh ke sandaran */
      }
    }
    return Promise.resolve(sha256Js(keUtf8(teks)));
  }

  /* Normalkan kod: huruf besar, buang semua selain A-Z. */
  function normal(teks) {
    return String(teks || '').toUpperCase().replace(/[^A-Z]/g, '');
  }

  function kod(teks) {
    var garam = (MJ.KANDUNGAN && MJ.KANDUNGAN.garam) || 'mjks';
    return sha256(garam + '|' + normal(teks));
  }

  function pin(teks) {
    var garam = (MJ.KANDUNGAN && MJ.KANDUNGAN.garam) || 'mjks';
    return sha256(garam + '|PIN|' + String(teks || '').replace(/\D/g, ''));
  }

  return { sha256: sha256, sha256Js: sha256Js, kod: kod, pin: pin, normal: normal };
})();
