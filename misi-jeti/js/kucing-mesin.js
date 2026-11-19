/* =====================================================================
   kucing-mesin.js - MJ.kucing: cipta Si Oyen & Si Kiko, mesin keadaan
   (lapisan LOKASI / EMOSI / MULUT), keutamaan, baris peristiwa, idle.
   Keutamaan (1 = paling tinggi): permainan 1 > belai 2 > hover 3 >
   berpasangan 4 > rehat/mengantuk 5.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.kucing = (function () {
  'use strict';
  var S = {};
  var sedia = false;
  var pentas = null;

  var KEUTAMAAN = {
    gembira: 1, terfikir: 1, terkejut: 1, 'sedih-semangat': 1, 'membawa-surat': 1,
    menonton: 1, meraikan: 1,
    dibelai: 2, guling: 2, lembik: 2,
    hover: 3,
    rehat: 5, mengantuk: 5
  };
  var KELAS = {
    gembira: 'e-gembira', terfikir: 'e-terfikir', terkejut: 'e-terkejut',
    'membawa-surat': 'e-membawa', menonton: 'e-menonton', meraikan: 'e-meraikan',
    dibelai: 'e-dibelai', guling: 'e-guling', lembik: 'e-lembik', hover: 'e-hover',
    mengantuk: 'e-mengantuk'
  };
  var SEMUA_E = ['e-gembira', 'e-terfikir', 'e-terkejut', 'e-sedih', 'e-semangat', 'e-membawa',
    'e-menonton', 'e-meraikan', 'e-dibelai', 'e-guling', 'e-lembik', 'e-hover', 'e-mengantuk'];
  var TANPA_KELIP = ['dibelai', 'mengantuk', 'guling', 'lembik'];

  function durasi(nama, id) {
    switch (nama) {
      case 'gembira': return 1500;
      case 'terkejut': return 1000;
      case 'membawa-surat': return 1500;
      case 'meraikan': return 2500;
      case 'dibelai': return 1200;
      case 'guling': return 1800;
      case 'lembik': return 2000;
      case 'hover': return id === 'oyen' ? 600 : 800;
      default: return 0;   // berterusan: terfikir, menonton, mengantuk
    }
  }

  function hadkan(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function W() { return window.innerWidth; }
  function H() { return window.innerHeight; }
  /* QA-005: kucing lebih kecil dan duduk DI ATAS jalur lantai jeti (11vh), supaya
     hanya telinga yang melepasi lantai; #skrin berakhir di atas lantai + 2.5vh. */
  function saiz(id) { return Math.round(id === 'oyen' ? hadkan(H() * 0.135, 84, 190) : hadkan(H() * 0.15, 92, 210)); }
  function rumah(id) {
    var s = saiz(id);
    var y = H() - s + Math.round(s * 0.04);   /* bayang SVG berada pada y=191/200 */
    return id === 'oyen' ? { x: Math.round(W() * 0.012), y: y } : { x: W() - s - Math.round(W() * 0.012), y: y };
  }

  function cipta(id) {
    var nama = id === 'oyen' ? 'Si Oyen' : 'Si Kiko';
    var el = MJ.u.el(
      '<div class="kb kucing--' + id + '" data-kucing="' + id + '" tabindex="0" role="button" aria-label="Belai ' + nama + '">' +
        '<div class="kb-lompat"><div class="kb-arah">' + MJ.rig.svg(id) + '</div>' + MJ.rig.efek() + '</div>' +
      '</div>');
    var g = MJ.u.el('<div class="gelembung gelembung--' + id + '" id="gelembung-' + id + '" hidden>' +
      '<b class="g-nama">' + nama + '</b><span class="g-teks"></span></div>');
    g.addEventListener('click', function () { MJ.dialog.langkau(); });
    pentas.appendChild(el);
    pentas.appendChild(g);
    var k = {
      id: id, el: el, gel: g,
      elLompat: el.querySelector('.kb-lompat'),
      elArah: el.querySelector('.kb-arah'),
      elPandang: el.querySelector('.k-pandang'),
      anakMata: Array.prototype.slice.call(el.querySelectorAll('.k-anak-mata')),
      zon: el.querySelector('.k-zon-hover'),
      x: 0, y: 0, saiz: saiz(id),
      emosi: 'rehat', pemasa: null, baris: [],
      bergerak: false, pasangan: false, diRumah: true
    };
    el.style.setProperty('--saiz', k.saiz + 'px');
    S[id] = k;
    if (id === 'kiko') { k.elArah.classList.add('terbalik'); }
    return k;
  }

  function buangKelasEmosi(k) {
    SEMUA_E.forEach(function (c) { k.el.classList.remove(c); });
  }

  function kembali(k) {
    clearTimeout(k.pemasa);
    k.pemasa = null;
    buangKelasEmosi(k);
    k.emosi = 'rehat';
    if (k.baris.length) { terap(k, k.baris.shift()); }
  }

  function terap(k, nama) {
    clearTimeout(k.pemasa);
    k.pemasa = null;
    buangKelasEmosi(k);
    k.emosi = nama;
    if (nama === 'rehat') { return; }
    if (nama === 'sedih-semangat') {
      /* 0.6 s sedih, kemudian 1.2 s semangat: sentiasa berakhir dengan semangat */
      k.el.classList.add('e-sedih');
      k.pemasa = setTimeout(function () {
        k.el.classList.remove('e-sedih');
        k.el.classList.add('e-semangat');
        k.pemasa = setTimeout(function () { kembali(k); }, 1200);
      }, 600);
      return;
    }
    if (KELAS[nama]) { k.el.classList.add(KELAS[nama]); }
    if (nama === 'meraikan') { k.el.classList.add('bertopi'); }
    var d = durasi(nama, k.id);
    if (d) { k.pemasa = setTimeout(function () { kembali(k); }, d); }
  }

  /* Pulangkan true jika diterima/dibariskan */
  function setEmosi(id, nama, o) {
    o = o || {};
    var k = S[id];
    if (!k || !sedia) { return false; }
    var p = KEUTAMAAN[nama] || 5;
    if (k.pasangan) {
      if (p <= 3 && MJ.pasangan) { MJ.pasangan.lerai(); } else { return false; }
    }
    var semasa = k.emosi;
    var ps = KEUTAMAAN[semasa] || 5;
    if (semasa !== 'rehat' && semasa !== 'mengantuk' && ps < p) { return false; }
    if (semasa !== 'rehat' && ps === p && p === 1 && k.pemasa && !o.pintas) {
      if (k.baris.length < 2) { k.baris.push(nama); }
      return true;
    }
    terap(k, nama);
    return true;
  }

  function tamatEmosi(id, nama) {
    var k = S[id];
    if (!k) { return; }
    if (!nama || k.emosi === nama) { kembali(k); }
  }

  function keDuaDua(nama, o) {
    setEmosi('oyen', nama, o);
    setEmosi('kiko', nama, o);
  }

  function hantar(peristiwa) {
    if (!sedia) { return; }
    MJ.aktiviti();
    if (MJ.pasangan && MJ.pasangan.aktif() && peristiwa !== 'konteksBaru') { MJ.pasangan.lerai(); }
    switch (peristiwa) {
      case 'kodDiterima': case 'cop': case 'bintang': case 'serpihan':
        keDuaDua('gembira'); break;
      case 'kodBelum': case 'belumLagi':
        keDuaDua('sedih-semangat'); break;
      case 'kejutan': case 'petiDibuka':
        keDuaDua('terkejut'); break;
      case 'surat':
        setEmosi('kiko', 'membawa-surat', { pintas: true }); break;
      case 'modUjiMula':
        keDuaDua('menonton', { pintas: true }); break;
      case 'modUjiTamat':
        tamatEmosi('oyen', 'menonton'); tamatEmosi('kiko', 'menonton'); break;
      case 'fikir':
        keDuaDua('terfikir'); break;
      case 'fikirTamat':
        tamatEmosi('oyen', 'terfikir'); tamatEmosi('kiko', 'terfikir'); break;
      case 'meraikan':
        keDuaDua('meraikan', { pintas: true }); break;
      case 'konteksBaru':
        if (MJ.pasangan) { MJ.pasangan.lerai(true); }
        ['oyen', 'kiko'].forEach(function (id) {
          var k = S[id];
          k.baris = [];
          if (['menonton', 'terfikir', 'mengantuk', 'meraikan'].indexOf(k.emosi) >= 0) { kembali(k); }
          k.el.classList.remove('bertopi');
          pandang(id, null);
          if (!k.diRumah) { pulang(id); }
        });
        break;
      default: break;
    }
  }

  function setTopi(on) {
    ['oyen', 'kiko'].forEach(function (id) { if (S[id]) { S[id].el.classList.toggle('bertopi', !!on); } });
  }

  /* ---------------- Lokasi ---------------- */
  function pulang(id, selesai, o) {
    var k = S[id];
    if (!k) { return; }
    var r = rumah(id);
    o = o || {};
    MJ.gerak.ke(k, r.x, r.y, {
      cara: o.cara, durasi: o.durasi,
      selesai: function () {
        k.diRumah = true;
        k.elArah.classList.toggle('terbalik', id === 'kiko');
        letakGelembung(id);
        if (selesai) { selesai(); }
      }
    });
  }

  function keXY(id, x, y, o) {
    var k = S[id];
    if (!k) { return; }
    o = o || {};
    k.diRumah = false;
    var s = k.saiz;
    x = hadkan(x, 0, W() - s);
    y = hadkan(y, 0, H() - s);
    var asal = o.selesai;
    o.selesai = function () { letakGelembung(id); if (asal) { asal(); } };
    MJ.gerak.ke(k, x, y, o);
  }

  /* Gerak ke tepi elemen [data-labuh] (tidak menutupi elemen itu) */
  function gerakKeElemen(id, pemilih, sisi, selesai) {
    var k = S[id];
    if (!k || !sedia) { return; }
    var sasaran = typeof pemilih === 'string' ? document.querySelector(pemilih) : pemilih;
    if (!sasaran) { return; }
    var r = sasaran.getBoundingClientRect();
    var s = k.saiz;
    var x = sisi === 'kanan' ? r.right - s * 0.12 : r.left - s * 0.88;
    var y = r.bottom - s * 0.95;
    var bar = document.getElementById('bar-atas');
    var minY = bar ? bar.getBoundingClientRect().bottom : 0;
    y = hadkan(y, minY, H() - s);
    keXY(id, x, y, { selesai: selesai });
  }

  function masuk() {
    ['oyen', 'kiko'].forEach(function (id) {
      var k = S[id];
      var r = rumah(id);
      MJ.gerak.letak(k, id === 'oyen' ? -k.saiz : W(), r.y);
      setTimeout(function () {
        pulang(id, null, { cara: id === 'oyen' ? 'lompat' : 'jalan', durasi: id === 'oyen' ? 800 : 1200 });
      }, id === 'oyen' ? 100 : 500);
    });
  }

  function susunSemula() {
    ['oyen', 'kiko'].forEach(function (id) {
      var k = S[id];
      if (!k) { return; }
      k.saiz = saiz(id);
      k.el.style.setProperty('--saiz', k.saiz + 'px');
      if (k.diRumah && !k.bergerak && !k.pasangan) {
        var r = rumah(id);
        MJ.gerak.letak(k, r.x, r.y);
      }
      letakGelembung(id);
    });
  }

  /* ---------------- Gelembung, mulut, pandang ---------------- */
  /* Kawasan butang/kad yang tidak boleh ditutup gelembung (QA-036) */
  var PEMILIH_ELAK = '.btn, .btn-togol, .oleh, .cip-serpihan, .kad-serpihan[data-serpihan], .slot-hukum, .kad-situasi, .kad-objek, .blok-cecair, .slot-cecair, input, select, textarea';
  /* QA-046: butang utama paling berat (tidak boleh ditutup jika ada pilihan lain) */
  /* Pusingan 6 (QA-052): butang baris Galeri ("Kembali ke Jeti") juga dikira utama */
  var PEMILIH_UTAMA = '.btn-utama, .btn-aksen, .baris-galeri .btn';
  /* QA-047: ilustrasi dan arahan taklimat dielak jika ada kedudukan lain (lembut:
     tidak menolak gelembung ke atas, hanya dikira dalam skor).
     Pusingan 6 (QA-047 pilihan C): tajuk dan penunjuk langkah misi juga lembut. */
  var PEMILIH_LEMBUT = '.taklimat-ilus, .meja-objek, .cecair-meja, .arahan, .arahan-satu, h1, .kepala-misi .langkah, .kepala-misi .sub';
  var BERAT_LEMBUT = 0.1;
  /* Pusingan 6 (QA-052): kotak kepala+badan kucing dalam koordinat skrin.
     Rig SVG 200x200: kepala+telinga x 54..146, y 18..114; badan x 44..158, y 99..192. */
  function kotakBadanKucing(kk) {
    var s = kk.saiz;
    return { left: kk.x + s * 0.2, right: kk.x + s * 0.8, top: kk.y + s * 0.08, bottom: kk.y + s * 0.97 };
  }
  function kotakKepalaKucing(kk) {
    var s = kk.saiz;
    return { left: kk.x + s * 0.26, right: kk.x + s * 0.74, top: kk.y + s * 0.08, bottom: kk.y + s * 0.58 };
  }
  function kotakElak(pemilih) {
    var hasil = [];
    var akar = document.getElementById('skrin');
    if (!akar) { return hasil; }
    var tinggi = H(), lebar = W();
    MJ.u.$$(pemilih || PEMILIH_ELAK, akar).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < tinggi && r.right > 0 && r.left < lebar) { hasil.push(r); }
    });
    return hasil;
  }
  function kembang(senarai) {
    return senarai.map(function (r) {
      return { left: r.left - 6, right: r.right + 6, top: r.top - 6, bottom: r.bottom + 6 };
    });
  }
  function bertindih(x, y, w, h, r) {
    var m = 6;
    return x < r.right + m && x + w > r.left - m && y < r.bottom + m && y + h > r.top - m;
  }

  function luasTindih(x, y, w, h, kotak) {
    var jumlah = 0;
    kotak.forEach(function (r) {
      var lx = Math.max(0, Math.min(x + w, r.right) - Math.max(x, r.left));
      var ly = Math.max(0, Math.min(y + h, r.bottom) - Math.max(y, r.top));
      jumlah += lx * ly;
    });
    return jumlah;
  }

  /* QA-037: gelembung dikepit ke dalam viewport.
     QA-036 (pusingan 5): gelembung aktif SENTIASA menerima klik (klik = langkau baris;
     klik itu tidak pernah sampai ke butang di bawahnya). Untuk mengelak menutup
     butang/kad, beberapa kedudukan calon dicuba:
       1. sisi biasa kucing (dekat, dan dianjak ke atas butang yang ditindih);
       2. sisi bertentangan kucing (dekat, dan dianjak);
       3. di atas kepala kucing (dekat, dan dianjak);
       4. tepi kiri/kanan skrin pada paras kepala (dekat, dan dianjak);
       5. tiga bucu atas skrin (di bawah bar).
     Pusingan 4b (QA-046/047): calon tanpa tindihan butang/kad sentiasa menang;
     calon yang menindih butang utama hanya dipilih jika semua calon begitu; dalam
     peringkat sama, skor terendah (butang utama, butang/kad, ilustrasi/arahan,
     jarak dari kepala) dipilih. Dialog tetap maju sendiri mengikut masa. */
  function letakGelembung(id) {
    var k = S[id];
    if (!k) { return; }
    var g = k.gel;
    var tengahX = k.x + k.saiz / 2;
    var kiri = tengahX < W() / 2;
    var w = g.hidden ? 0 : g.offsetWidth;
    var h = g.hidden ? 0 : g.offsetHeight;
    var bar = document.getElementById('bar-atas');
    var minY = bar ? Math.round(bar.getBoundingClientRect().bottom) + 4 : 4;
    var maxY = Math.max(minY, H() - h - 4);
    var maxX = Math.max(4, W() - w - 4);
    var xBiasa = kiri ? Math.round(k.x + k.saiz * 0.86) : Math.round(k.x + k.saiz * 0.14 - w);
    var xLain = kiri ? Math.round(k.x + k.saiz * 0.14 - w) : Math.round(k.x + k.saiz * 0.86);
    var yBiasa = Math.round(k.y + k.saiz * 0.08 - h * 0.4);
    var x = hadkan(xBiasa, 4, maxX);
    var y = hadkan(yBiasa, minY, maxY);
    g.classList.remove('tembus');
    if (h && w) {
      var kotak = kotakElak();
      var naik = function (cx, cy) {
        /* anjak ke atas butang yang ditindih (paling atas dahulu) */
        for (var cuba = 0; cuba < 10; cuba++) {
          var kena = null;
          for (var i = 0; i < kotak.length; i++) {
            if (bertindih(cx, cy, w, h, kotak[i]) && (!kena || kotak[i].top < kena.top)) { kena = kotak[i]; }
          }
          if (!kena) { break; }
          var yBaru = Math.round(kena.top - h - 8);
          if (yBaru < minY) { break; }
          cy = yBaru;
        }
        return cy;
      };
      var calon = [];
      var x1 = hadkan(xBiasa, 4, maxX);
      var y1 = hadkan(yBiasa, minY, maxY);
      var x3 = hadkan(Math.round(tengahX - w / 2), 4, maxX);
      var y3 = hadkan(Math.round(k.y - h - 6), minY, maxY);
      /* kedudukan dekat (tanpa anjak) dan versi dianjak ke atas butang */
      calon.push({ x: x1, y: y1 });
      calon.push({ x: x1, y: naik(x1, y1) });
      if (xLain >= 4 && xLain <= maxX) {
        calon.push({ x: xLain, y: y1 });
        calon.push({ x: xLain, y: naik(xLain, y1) });
      }
      calon.push({ x: x3, y: y3 });
      calon.push({ x: x3, y: naik(x3, y3) });
      /* Pusingan 4b (QA-046): tepi kiri/kanan skrin pada paras kepala, dekat dan dianjak */
      calon.push({ x: 4, y: y1 });
      calon.push({ x: 4, y: naik(4, y1) });
      calon.push({ x: maxX, y: y1 });
      calon.push({ x: maxX, y: naik(maxX, y1) });
      calon.push({ x: x1, y: minY });
      calon.push({ x: 4, y: minY });
      calon.push({ x: maxX, y: minY });
      /* Pilihan (QA-046/047, pusingan 4b):
         peringkat 0 = tiada tindihan butang/kad;
         peringkat 1 = tindih butang/kad biasa sahaja;
         peringkat 2 = tindih butang utama (.btn-utama/.btn-aksen): hanya jika SEMUA calon begitu.
         Dalam peringkat yang sama, skor terendah menang:
         butang utama + butang/kad + ilustrasi/arahan + jarak dari kepala kucing. */
      var keras = kembang(kotak);
      /* Pusingan 6 (QA-052, pilihan F): kepala+badan KEDUA-DUA kucing ialah kawasan
         keras, supaya gelembung tidak menutup penutur (atau kucing lain). Tidak
         dimasukkan ke dalam `naik` (anjakan ke atas butang sahaja). */
      ['oyen', 'kiko'].forEach(function (kid) {
        if (S[kid]) { keras.push(kotakBadanKucing(S[kid])); }
      });
      var utama = kembang(kotakElak(PEMILIH_UTAMA));
      var lembut = kotakElak(PEMILIH_LEMBUT);
      var kepalaY = k.y + k.saiz * 0.35;
      var jarakKepala = function (cx, cy) {
        var dx = Math.max(cx - tengahX, 0, tengahX - (cx + w));
        var dy = Math.max(cy - kepalaY, 0, kepalaY - (cy + h));
        return Math.sqrt(dx * dx + dy * dy);
      };
      var terbaik = null;
      for (var c = 0; c < calon.length; c++) {
        var cc = calon[c];
        var lk = luasTindih(cc.x, cc.y, w, h, keras);
        var lu = luasTindih(cc.x, cc.y, w, h, utama);
        cc.peringkat = lu > 0 ? 2 : (lk > 0 ? 1 : 0);
        cc.skor = lu * 50 + lk * 20 + luasTindih(cc.x, cc.y, w, h, lembut) * BERAT_LEMBUT + jarakKepala(cc.x, cc.y) * 60;
        if (!terbaik || cc.peringkat < terbaik.peringkat ||
            (cc.peringkat === terbaik.peringkat && cc.skor < terbaik.skor)) { terbaik = cc; }
      }
      x = terbaik.x;
      y = terbaik.y;
    }
    g.style.left = x + 'px';
    g.style.right = 'auto';
    var ekorKiri = x + w / 2 >= tengahX;   /* gelembung di kanan kucing: ekor di kiri */
    g.classList.toggle('ekor-kiri', ekorKiri);
    g.classList.toggle('ekor-kanan', !ekorKiri);
    g.style.top = y + 'px';
    /* QA-047: ekor hanya dipapar jika gelembung di sisi kucing dan sebaris dengan
       kepalanya; ekor diletak setentang kepala. Jika jauh, ekor disorok (label nama
       SI OYEN / SI KIKO masih menunjukkan penutur). */
    var kepY = k.y + k.saiz * 0.35;
    var jurangX = Math.max(k.x - (x + w), 0, x - (k.x + k.saiz));
    var sebaris = h > 0 && kepY >= y + 12 && kepY <= y + h - 12;
    /* Pusingan 6 (QA-052): tiada ekor jika gelembung menindih kepala penutur */
    var kp = kotakKepalaKucing(k);
    var tindihKepala = h > 0 && w > 0 && x < kp.right && x + w > kp.left && y < kp.bottom && y + h > kp.top;
    var adaEkor = sebaris && !tindihKepala && jurangX <= Math.max(48, k.saiz * 0.4);
    g.classList.toggle('tanpa-ekor', !adaEkor);
    if (adaEkor) {
      g.style.setProperty('--ekor-y', Math.round(hadkan(kepY - y - 10, 8, h - 28)) + 'px');
    } else {
      g.style.removeProperty('--ekor-y');
    }
  }

  function mulut(id, on) {
    var k = S[id];
    if (k) { k.el.classList.toggle('bercakap', !!on); }
  }

  function dengar(pendengar, penutur) {
    ['oyen', 'kiko'].forEach(function (id) {
      if (S[id]) { S[id].el.classList.remove('dengar-kiri', 'dengar-kanan'); }
    });
    if (!pendengar || !penutur || !S[pendengar] || !S[penutur]) { return; }
    var arah = S[penutur].x > S[pendengar].x ? 'dengar-kanan' : 'dengar-kiri';
    S[pendengar].el.classList.add(arah);
  }

  /* Pandang ke arah titik skrin (x,y); null = kembali ke tengah */
  function pandang(id, titik) {
    var k = S[id];
    if (!k || !k.elPandang) { return; }
    if (!titik) {
      k.elPandang.style.transform = '';
      k.anakMata.forEach(function (m) { m.style.transform = ''; });
      return;
    }
    var cx = k.x + k.saiz / 2;
    var cy = k.y + k.saiz * 0.38;
    var dx = titik.x - cx;
    var dy = titik.y - cy;
    var terbalik = k.elArah.classList.contains('terbalik') ? -1 : 1;
    var sudut = hadkan(dx / 20, -10, 10) * terbalik;
    k.elPandang.style.transform = 'rotate(' + sudut.toFixed(1) + 'deg)';
    var mx = hadkan(dx / 60, -2.5, 2.5) * terbalik;
    var my = hadkan(dy / 60, -2, 2);
    k.anakMata.forEach(function (m) { m.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)'; });
  }

  /* ---------------- Hidup semasa rehat ---------------- */
  function jadualKelip(k) {
    setTimeout(function () {
      if (TANPA_KELIP.indexOf(k.emosi) < 0 && !document.hidden) {
        k.el.classList.add('kelip');
        setTimeout(function () { k.el.classList.remove('kelip'); }, 150);
        if (Math.random() < 0.2) {
          setTimeout(function () {
            k.el.classList.add('kelip');
            setTimeout(function () { k.el.classList.remove('kelip'); }, 150);
          }, 320);
        }
      }
      jadualKelip(k);
    }, 2000 + Math.random() * 4000);
  }

  function jadualMikro(k) {
    setTimeout(function () {
      if (k.emosi === 'rehat' && !k.pasangan && !k.bergerak && !MJ.runtime.modUji && !document.hidden &&
          !(MJ.dialog && MJ.dialog.penutur() === k.id)) {
        var pilihan = k.id === 'oyen' ? ['m-telinga', 'm-regang', 'm-menguap', 'm-pandang'] :
          ['m-telinga', 'm-jilat', 'm-pandang'];
        var c = pilihan[Math.floor(Math.random() * pilihan.length)];
        if (c === 'm-pandang') {
          pandang(k.id, { x: Math.random() * W(), y: Math.random() * H() * 0.6 });
          setTimeout(function () { pandang(k.id, null); }, 1300);
        } else {
          k.el.classList.add(c);
          setTimeout(function () { k.el.classList.remove(c); }, 1300);
        }
      }
      jadualMikro(k);
    }, 8000 + Math.random() * 7000);
  }

  function gelungIdle() {
    setInterval(function () {
      var idle = Date.now() - MJ.runtime.aktivitiTerakhir;
      var diHab = MJ.penghala && MJ.penghala.nama() === 'peta';
      ['oyen', 'kiko'].forEach(function (id) {
        var k = S[id];
        if (!k) { return; }
        if (k.emosi === 'mengantuk' && idle < 1500) { kembali(k); return; }
        /* QA-020: 'terfikir' selepas 30 s tiada tindakan (bukan di hab, bukan Mod Uji/Tirai/PG) */
        if (k.fikirIdle && (idle < 1500 || k.emosi !== 'terfikir')) {
          k.fikirIdle = false;
          if (k.emosi === 'terfikir') { kembali(k); }
          return;
        }
        if (id === 'oyen' && !diHab && idle >= 30000 && k.emosi === 'rehat' && !k.pasangan && !k.bergerak &&
            !MJ.runtime.modUji && !MJ.runtime.tirai && !MJ.runtime.pgBuka && !MJ.dialog.aktif()) {
          terap(k, 'terfikir');
          k.fikirIdle = true;
          return;
        }
        if (diHab && idle >= 90000 && k.emosi === 'rehat' && !k.pasangan && !k.bergerak &&
            !MJ.dialog.aktif()) {
          terap(k, 'mengantuk');
        }
      });
    }, 1000);
  }

  function init() {
    if (sedia || MJ.runtime.halamanGuru) { return; }
    pentas = document.getElementById('pentas-kucing');
    if (!pentas) { return; }
    cipta('oyen');
    cipta('kiko');
    sedia = true;
    api.sedia = true;
    jadualKelip(S.oyen); jadualKelip(S.kiko);
    setTimeout(function () { jadualMikro(S.oyen); }, 3000);
    setTimeout(function () { jadualMikro(S.kiko); }, 7000);
    gelungIdle();
    window.addEventListener('resize', susunSemula);
    masuk();
  }

  var api = {
    sedia: false,
    init: init,
    k: function (id) { return S[id]; },
    setEmosi: setEmosi, tamatEmosi: tamatEmosi, hantar: hantar, setTopi: setTopi,
    pulang: pulang, keXY: keXY, gerakKeElemen: gerakKeElemen, masuk: masuk, rumah: rumah,
    letakGelembung: letakGelembung, mulut: mulut, dengar: dengar, pandang: pandang,
    susunSemula: susunSemula
  };
  return api;
})();
