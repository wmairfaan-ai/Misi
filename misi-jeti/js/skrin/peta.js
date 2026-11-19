/* S2 Peta Jeti (hab): Carta Muara + tindakan */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.peta = (function () {
  'use strict';
  var u = MJ.u;
  var TX = MJ.KANDUNGAN.teksSkrin;
  var akarSemasa = null;
  var sudahSapa = false;

  function senaraiBot() {
    var tet = MJ.keadaan.tetapan();
    if (tet.mod === 'tablet' && tet.botTablet) { return [u.bot(tet.botTablet)]; }
    return MJ.KANDUNGAN.bot;
  }
  function modTablet() { return MJ.keadaan.tetapan().mod === 'tablet'; }

  function misiFasa(p) {
    var m = /^misi(\d)$/.exec(p.fasa);
    return m ? parseInt(m[1], 10) : null;
  }

  function tindakanFasa(p) {
    var n = misiFasa(p);
    var L = TX.petaFasa;
    if (n) { return { label: u.isi(L.misi, { n: n }), hash: '#/misi' + n }; }
    switch (p.fasa) {
      case 'peti': return { label: L.peti, hash: '#/peti' };
      case 'galeri': return { label: L.galeri, hash: '#/galeri' };
      case 'upacara': return { label: L.upacara, hash: '#/upacara' };
      case 'tiket': return { label: L.tiket, hash: '#/tiket' };
      default: return { label: L.daftar, hash: '#/daftar' };
    }
  }

  function gelaranBot(p, id) {
    var g = [];
    var up = p.upacara || {};
    var G = MJ.KANDUNGAN.gelaran;
    if (up.nakhoda === id) { g.push(G.nakhoda.nama); }
    if (up.pegawai === id) { g.push(G.pegawai.nama); }
    if (up.jurutera === id) { g.push(G.jurutera.nama); }
    if (up.penjejak && up.penjejak.indexOf(id) >= 0) { g.push(G.penjejak.nama); }
    return g;
  }

  function papar(akar) {
    akarSemasa = akar;
    var html = '<section class="peta">' +
      '<div class="peta-sungai" id="carta-muara" role="list" aria-label="Carta Muara">' +
        '<div class="sungai-jeti" aria-hidden="true">' + u.esc(TX.labelJeti) + '</div><div class="sungai-seberang" aria-hidden="true">' + u.esc(TX.labelSeberang) + '</div>';
    senaraiBot().forEach(function (b) {
      /* QA-023: bot bergerak dengan transform (landas selebar lorong, translateX %) */
      html += '<div class="lorong" role="listitem" data-lorong="' + b.id + '">' +
        '<div class="lorong-label">' + u.lencanaBot(b.id) + '</div>' +
        '<div class="lorong-air">' +
          '<div class="lorong-landas"><div class="lorong-bot" data-labuh="bot-' + b.id + '">' + MJ.ikon.bot(b.warna) + '</div></div>' +
          '<div class="lorong-info"><span class="lorong-bintang"></span><span class="lorong-reben"></span></div>' +
        '</div></div>';
    });
    /* Barisan Jeti dalam kepala sungai (QA-005: panel tindakan lebih pendek) */
    html += '<div class="barisan-jeti" id="barisan-jeti"></div></div>' +
      '<div class="peta-panel">' +
        '<div class="grid-tindakan">' +
          '<button class="btn btn-utama" id="t-fasa"></button>' +
          '<button class="btn" id="t-kod">' + u.esc(TX.petaKod) + '</button>' +
          '<button class="btn" id="t-kerang">' + MJ.ikon.kerang + ' ' + u.esc(TX.kerangPetunjuk) + '</button>' +
          (modTablet() ? '' : '<button class="btn" id="t-dibantu">' + u.esc(TX.petaDibantu) + '</button>') +
          '<button class="btn" id="t-bonus">' + u.esc(TX.petaBonus) + '</button>' +
          '<button class="btn" id="t-botol">' + u.esc(TX.petaBotol) + '</button>' +
          (modTablet() ? '' : '<button class="btn" id="t-beratur">' + u.esc(TX.petaBeratur) + '</button>') +
        '</div>' +
      '</div></section>';
    akar.innerHTML = html;
    ikat(akar);
    kemasKini();
    if (!sudahSapa) {
      sudahSapa = true;
      MJ.dialog.mainkan(MJ.KANDUNGAN.dialog.peta);
    }
  }

  function ikat(akar) {
    u.$('#t-fasa', akar).addEventListener('click', function () {
      MJ.penghala.pergi(tindakanFasa(MJ.keadaan.permainan()).hash);
    });
    u.$('#t-kod', akar).addEventListener('click', function () {
      u.pilihBot(TX.pilihBotKod, null, function (id) {
        MJ.misi.pilihMisi(id, function (n) { MJ.penghala.pergi('#/misi' + n + '/' + id); });
      });
    });
    u.$('#t-kerang', akar).addEventListener('click', function () {
      u.pilihBot(TX.pilihBotKerang, null, function (id) {
        MJ.surat.buka(id, misiFasa(MJ.keadaan.permainan()));
      });
    });
    var dib = u.$('#t-dibantu', akar);
    if (dib) {
      dib.addEventListener('click', function () {
        u.pilihBot(TX.pilihDibantu, null, function (dibantu) {
          u.pilihBot(u.isi(TX.pilihPenolong, { bot: u.bot(dibantu).nama }), function (id) {
            return id === dibantu ? { boleh: false, sebab: TX.botSendiri } : { boleh: true };
          }, function (penolong) {
            MJ.keadaan.ubah(function (p) {
              p.permintaanPenolong.push({ id: Date.now() + '-' + penolong, dibantu: dibantu, penolong: penolong, masa: Date.now() });
            });
            u.toast(u.isi(TX.dibantuToast, { bot: u.bot(penolong).nama }));
          });
        });
      });
    }
    u.$('#t-bonus', akar).addEventListener('click', function () {
      u.pilihBot(TX.pilihBotBonus, null, function (id) { MJ.penghala.pergi('#/bonus/' + id); });
    });
    u.$('#t-botol', akar).addEventListener('click', function () {
      u.pilihBot(TX.pilihBotBotol, function (id, p) {
        return p.bot[id].misi1.cop ? { boleh: true } : { boleh: false, sebab: TX.selepasCopM1 };
      }, function (id) { MJ.penghala.pergi('#/botol/' + id); });
    });
    var ber = u.$('#t-beratur', akar);
    if (ber) {
      ber.addEventListener('click', function () {
        u.pilihBot(TX.pilihBotBeratur, function (id, p) {
          return p.barisanJeti.indexOf(id) >= 0 ? { boleh: false, sebab: TX.sudahBeratur } : { boleh: true };
        }, function (id) {
          MJ.keadaan.ubah(function (p) { if (p.barisanJeti.indexOf(id) < 0) { p.barisanJeti.push(id); } });
        });
      });
    }
  }

  function kemasKini() {
    var akar = akarSemasa;
    if (!akar || !akar.isConnected) { return; }
    var p = MJ.keadaan.permainan();
    var tf = tindakanFasa(p);
    var bf = u.$('#t-fasa', akar);
    if (bf) { bf.textContent = tf.label; }
    senaraiBot().forEach(function (b) {
      var lorong = u.$('[data-lorong="' + b.id + '"]', akar);
      if (!lorong) { return; }
      var n = MJ.keadaan.bintang(b.id, p);
      var landas = u.$('.lorong-landas', lorong);
      landas.style.transform = 'translateX(' + (n / 6 * 74).toFixed(1) + '%)';
      var bin = '';
      for (var i = 0; i < n; i++) { bin += MJ.ikon.bintang; }
      u.$('.lorong-bintang', lorong).innerHTML = bin + '<span class="sr">' + u.esc(u.isi(TX.bintangSr, { n: n })) + '</span>';
      u.$('.lorong-reben', lorong).innerHTML = gelaranBot(p, b.id).map(function (g) {
        return '<span class="reben">' + u.esc(g) + '</span>';
      }).join('');
    });
    var bj = u.$('#barisan-jeti', akar);
    if (bj) {
      if (modTablet()) { bj.innerHTML = ''; return; }
      var bar = p.barisanJeti || [];
      /* QA-042 (baki): teks penuh (semua bot) untuk tetikus (title) dan pembaca skrin
         (.sr); paparan ringkas disembunyikan daripada pembaca skrin. */
      var penuh = TX.barisanJeti + ': ' + (bar.length ?
        bar.map(function (id) { return u.bot(id).nama; }).join(', ') : TX.barisanKosong);
      bj.innerHTML = '<span aria-hidden="true"><b>' + u.esc(TX.barisanJeti) + ':</b> ' + (bar.length ?
        bar.slice(0, 2).map(function (id) { return u.esc(u.bot(id).nama); }).join(' &gt; ') +
        (bar.length > 2 ? ' (+' + (bar.length - 2) + ')' : '') : u.esc(TX.barisanKosong)) + '</span>' +
        '<span class="sr">' + u.esc(penuh) + '</span>';
      bj.title = penuh;
    }
  }

  return {
    papar: papar,
    kemasKini: kemasKini,
    tutup: function () { akarSemasa = null; }
  };
})();
