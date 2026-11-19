/* S1 Daftar Krew: lantik peranan Ahli 1-5 bagi setiap bot. Tiada nama murid disimpan. */
window.MJ = window.MJ || {};
MJ.skrin = MJ.skrin || {};

MJ.skrin.daftar = (function () {
  'use strict';
  var u = MJ.u;
  var TX = MJ.KANDUNGAN.teksSkrin;
  var akarSemasa = null;

  function senaraiBot() {
    var tet = MJ.keadaan.tetapan();
    if (tet.mod === 'tablet' && tet.botTablet) { return [u.bot(tet.botTablet)]; }
    return MJ.KANDUNGAN.bot;
  }

  function lukis() {
    var akar = akarSemasa;
    if (!akar) { return; }
    var p = MJ.keadaan.permainan();
    /* QA-005: "Ke Peta Jeti" di kepala supaya kelihatan tanpa menatal */
    var html = '<section class="daftar"><header class="kepala-misi"><h1>' + u.esc(TX.daftarTajuk) + '</h1>' +
      '<a class="btn btn-aksen" href="#/peta">' + u.esc(TX.daftarKePeta) + '</a></header>' +
      '<p class="sub">' + u.esc(TX.daftarSub) + '</p>' +
      '<div class="grid-bot">';
    senaraiBot().forEach(function (b) {
      var d = p.bot[b.id].dilantik;
      html += '<div class="kad kad-bot' + (d ? ' dilantik' : '') + '">' + u.lencanaBot(b.id) +
        '<p class="status">' + u.esc(d ? TX.daftarSudah : TX.daftarBelum) + '</p>' +
        '<button class="btn' + (d ? '' : ' btn-utama') + '" data-lantik="' + b.id + '">' + u.esc(d ? TX.daftarUbah : TX.daftarLantik) + '</button></div>';
    });
    html += '</div></section>';
    akar.innerHTML = html;
    u.$$('[data-lantik]', akar).forEach(function (btn) {
      btn.addEventListener('click', function () { bukaLantikan(btn.getAttribute('data-lantik')); });
    });
  }

  function bukaLantikan(id) {
    var p = MJ.keadaan.permainan();
    var b = p.bot[id];
    var html = '<h2>' + u.esc(TX.daftarSuratTajuk) + ' ' + u.lencanaBot(id) + '</h2><table class="jadual-peranan"><tbody>';
    MJ.KANDUNGAN.peranan.forEach(function (r) {
      html += '<tr><th scope="row">' + u.esc(r.nama) + '<span class="kecil blok">' + u.esc(r.tugas) + '</span></th><td>' +
        '<select data-peranan="' + r.id + '" aria-label="' + u.esc(r.nama) + '">';
      for (var n = 1; n <= 5; n++) {
        html += '<option value="' + n + '"' + (b.peranan[r.id] === n ? ' selected' : '') + '>' + u.esc(u.isi(TX.ahli, { n: n })) + '</option>';
      }
      html += '</select></td></tr>';
    });
    html += '</tbody></table><p class="kecil">' + u.esc(TX.daftarNota) + '</p>' +
      '<div class="baris-butang"><button class="btn" data-tutup>' + u.esc(TX.batal) + '</button>' +
      '<button class="btn btn-utama" id="tandatangan">' + u.esc(TX.daftarTandatangan) + '</button></div>';
    var m = u.modal(html, { kelas: 'modal-lebar' });
    u.$('#tandatangan', m.el).addEventListener('click', function () {
      var peranan = {};
      u.$$('[data-peranan]', m.el).forEach(function (s) {
        peranan[s.getAttribute('data-peranan')] = parseInt(s.value, 10);
      });
      MJ.keadaan.ubah(function (q) { q.bot[id].peranan = peranan; q.bot[id].dilantik = true; });
      m.tutup();
      MJ.bunyi.dering();
      if (MJ.kucing && MJ.kucing.sedia) { MJ.kucing.setEmosi('oyen', 'gembira'); }
      u.toast(u.isi(TX.daftarToast, { bot: u.bot(id).nama }));
      lukis();
    });
  }

  return {
    papar: function (akar) {
      akarSemasa = akar;
      lukis();
      MJ.dialog.mainkan(MJ.KANDUNGAN.dialog.daftar);
    },
    tutup: function () { akarSemasa = null; }
  };
})();
