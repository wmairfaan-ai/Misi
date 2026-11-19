/* =====================================================================
   seret.js - seret-dan-lepas dengan Pointer Events (tetikus & sentuh)
   Alternatif ketik-ketik: ketik item (dipilih), kemudian ketik zon.
   Papan kekunci: Enter/Space pada item untuk pilih, pada zon untuk lepas.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.seret = (function () {
  'use strict';

  /* o = { akar: Element, item: 'selector', zon: 'selector', lepas: function(itemEl, zonEl) } */
  function jadikan(o) {
    var akar = o.akar;
    var mula = null;
    var hantu = null;
    var itemAktif = null;
    var bergerak = false;
    var ofset = { x: 0, y: 0 };
    var dipilih = null;
    var zonSorot = null;

    function nyahPilih() {
      if (dipilih) { dipilih.classList.remove('dipilih'); dipilih.setAttribute('aria-pressed', 'false'); }
      dipilih = null;
      akar.classList.remove('ada-pilihan');
    }
    function pilih(item) {
      if (dipilih === item) { nyahPilih(); return; }
      nyahPilih();
      dipilih = item;
      item.classList.add('dipilih');
      item.setAttribute('aria-pressed', 'true');
      akar.classList.add('ada-pilihan');
    }
    function pemilihData(el, nama) {
      for (var i = 0; i < nama.length; i++) {
        var v = el.getAttribute(nama[i]);
        if (v !== null) { return '[' + nama[i] + '="' + String(v).replace(/"/g, '') + '"]'; }
      }
      return null;
    }
    function lepasKe(item, zon, dariKekunci) {
      nyahPilih();
      /* QA-021: selepas lepas dengan papan kekunci, skrin dilukis semula; pulihkan fokus */
      var selItem = dariKekunci ? pemilihData(item, ['data-objek', 'data-cecair', 'data-serpihan']) : null;
      var selZon = dariKekunci ? pemilihData(zon, ['data-hukum', 'data-zon']) : null;
      try { o.lepas(item, zon); } catch (e) { if (window.console) { console.error('[seret] lepas', e); } }
      if (dariKekunci) {
        setTimeout(function () {
          var a = document.activeElement;
          if (a && a !== document.body && a.isConnected) { return; }
          var sasaran = (selItem && document.querySelector(selItem + '[tabindex]')) || (selZon && document.querySelector(selZon));
          if (sasaran && sasaran.focus) { try { sasaran.focus({ preventScroll: true }); } catch (e2) { sasaran.focus(); } }
        }, 30);
      }
    }
    function sorot(zon) {
      if (zonSorot === zon) { return; }
      if (zonSorot) { zonSorot.classList.remove('zon-sorot'); }
      zonSorot = zon;
      if (zonSorot) { zonSorot.classList.add('zon-sorot'); }
    }

    function onDown(e) {
      var item = e.target.closest ? e.target.closest(o.item) : null;
      if (!item || !akar.contains(item) || item.hasAttribute('data-kunci')) { return; }
      if (e.button !== undefined && e.button !== 0) { return; }
      var butang = e.target.closest('button');
      if (butang && butang !== item && item.contains(butang)) { return; }   /* butang dalam kad */
      mula = { x: e.clientX, y: e.clientY, id: e.pointerId };
      itemAktif = item;
      bergerak = false;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onBatal);
    }
    function onMove(e) {
      if (!mula || e.pointerId !== mula.id) { return; }
      var dx = e.clientX - mula.x;
      var dy = e.clientY - mula.y;
      if (!bergerak && Math.sqrt(dx * dx + dy * dy) > 8) {
        bergerak = true;
        var r = itemAktif.getBoundingClientRect();
        ofset = { x: mula.x - r.left, y: mula.y - r.top };
        hantu = itemAktif.cloneNode(true);
        hantu.classList.add('seret-hantu');
        hantu.style.width = r.width + 'px';
        hantu.style.height = r.height + 'px';
        document.body.appendChild(hantu);
        itemAktif.classList.add('sedang-diseret');
        nyahPilih();
      }
      if (bergerak && hantu) {
        e.preventDefault();
        hantu.style.transform = 'translate(' + (e.clientX - ofset.x) + 'px,' + (e.clientY - ofset.y) + 'px)';
        hantu.style.visibility = 'hidden';
        var bawah = document.elementFromPoint(e.clientX, e.clientY);
        hantu.style.visibility = 'visible';
        var z = bawah && bawah.closest ? bawah.closest(o.zon) : null;
        sorot(z && akar.contains(z) ? z : null);
      }
    }
    function bersih() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onBatal);
      if (hantu && hantu.parentNode) { hantu.parentNode.removeChild(hantu); }
      hantu = null;
      if (itemAktif) { itemAktif.classList.remove('sedang-diseret'); }
      sorot(null);
    }
    function onUp(e) {
      if (!mula || e.pointerId !== mula.id) { return; }
      var item = itemAktif;
      var adaGerak = bergerak;
      var bawah = null;
      if (adaGerak && hantu) {
        hantu.style.display = 'none';
        bawah = document.elementFromPoint(e.clientX, e.clientY);
      }
      bersih();
      mula = null;
      itemAktif = null;
      bergerak = false;
      if (adaGerak) {
        var zon = bawah && bawah.closest ? bawah.closest(o.zon) : null;
        if (zon && akar.contains(zon)) { lepasKe(item, zon); }
        return;
      }
      /* Ketik: jika item lain sudah dipilih dan item ini berada dalam zon, lepas ke zon itu */
      if (dipilih && dipilih !== item) {
        var zonItem = item.closest(o.zon);
        if (zonItem && akar.contains(zonItem)) { lepasKe(dipilih, zonItem); return; }
      }
      pilih(item);
    }
    function onBatal() {
      bersih();
      mula = null;
      itemAktif = null;
      bergerak = false;
    }
    function onKlik(e) {
      if (!dipilih) { return; }
      if (e.target.closest && e.target.closest(o.item)) { return; }
      var zon = e.target.closest ? e.target.closest(o.zon) : null;
      if (zon && akar.contains(zon)) { lepasKe(dipilih, zon); }
    }
    function onKekunci(e) {
      if (e.key !== 'Enter' && e.key !== ' ') { return; }
      var item = e.target.closest ? e.target.closest(o.item) : null;
      if (item && akar.contains(item) && !item.hasAttribute('data-kunci') && e.target === item) {
        e.preventDefault();
        pilih(item);
        return;
      }
      var zon = e.target.closest ? e.target.closest(o.zon) : null;
      if (zon && dipilih && e.target === zon) {
        e.preventDefault();
        lepasKe(dipilih, zon, true);
      }
    }

    akar.addEventListener('pointerdown', onDown);
    akar.addEventListener('click', onKlik);
    akar.addEventListener('keydown', onKekunci);

    return {
      hapus: function () {
        bersih();
        akar.removeEventListener('pointerdown', onDown);
        akar.removeEventListener('click', onKlik);
        akar.removeEventListener('keydown', onKekunci);
      },
      nyahPilih: nyahPilih
    };
  }

  return { jadikan: jadikan };
})();
