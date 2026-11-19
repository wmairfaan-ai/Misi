/* =====================================================================
   bunyi.js - semua bunyi disintesis dengan Web Audio (tiada fail audio)
   Tiada bunyi "salah"/buzzer. Meow & purr dihadkan <= 60% kelantangan induk.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.bunyi = (function () {
  'use strict';
  var ctx = null;
  var induk = null;
  var bufferBising = null;

  function sediakan() {
    if (ctx) {
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* abai */ } }
      return ctx;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { return null; }
    try {
      ctx = new AC();
    } catch (e2) { ctx = null; return null; }
    induk = ctx.createGain();
    induk.connect(ctx.destination);
    kemaskiniKelantangan();
    return ctx;
  }

  function kemaskiniKelantangan() {
    if (!induk) { return; }
    var t = MJ.keadaan.tetapan();
    induk.gain.value = t.bunyi.hidup ? Math.max(0, Math.min(1, t.bunyi.kelantangan)) : 0;
  }

  function boleh() {
    if (MJ.runtime.halamanGuru) { return false; }
    var t = MJ.keadaan.tetapan();
    if (!t.bunyi.hidup) { return false; }
    if (!ctx) { return false; } /* AudioContext hanya dimulakan selepas klik pertama */
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* abai */ } }
    return true;
  }

  function bising() {
    if (bufferBising) { return bufferBising; }
    var panjang = ctx.sampleRate * 2;
    bufferBising = ctx.createBuffer(1, panjang, ctx.sampleRate);
    var d = bufferBising.getChannelData(0);
    for (var i = 0; i < panjang; i++) { d[i] = Math.random() * 2 - 1; }
    return bufferBising;
  }

  function nada(freq, mula, durasi, jenis, puncak) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = jenis || 'sine';
    o.frequency.setValueAtTime(freq, mula);
    g.gain.setValueAtTime(0.0001, mula);
    g.gain.linearRampToValueAtTime(puncak, mula + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, mula + durasi);
    o.connect(g);
    g.connect(induk);
    o.start(mula);
    o.stop(mula + durasi + 0.05);
  }

  function loceng() {
    if (!boleh()) { return; }
    var t = ctx.currentTime + 0.01;
    nada(880, t, 1.8, 'sine', 0.35);
    nada(1320, t, 1.4, 'sine', 0.15);
    nada(1760, t, 0.9, 'sine', 0.08);
  }

  function plup() {
    if (!boleh()) { return; }
    var t = ctx.currentTime + 0.01;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(700, t);
    o.frequency.exponentialRampToValueAtTime(180, t + 0.15);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.35, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(induk);
    o.start(t); o.stop(t + 0.2);
  }

  function dering() {
    if (!boleh()) { return; }
    var t = ctx.currentTime + 0.01;
    nada(660, t, 0.25, 'sine', 0.25);
    nada(990, t + 0.15, 0.35, 'sine', 0.25);
  }

  function ombak(kuat) {
    if (!boleh()) { return; }
    var t = ctx.currentTime + 0.01;
    var src = ctx.createBufferSource();
    src.buffer = bising();
    var f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(400, t);
    f.frequency.linearRampToValueAtTime(900, t + 0.6);
    f.frequency.linearRampToValueAtTime(300, t + 1.6);
    var g = ctx.createGain();
    var p = kuat ? 0.35 : 0.15;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(p, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    src.connect(f); f.connect(g); g.connect(induk);
    src.start(t); src.stop(t + 1.8);
  }

  function purr(kucing, durasi) {
    if (!boleh()) { return; }
    var t = ctx.currentTime + 0.01;
    var d = durasi || 1.2;
    var oyen = kucing === 'oyen';
    var src = ctx.createBufferSource();
    src.buffer = bising();
    src.loop = true;
    var f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = oyen ? 320 : 240;
    var mod = ctx.createGain();
    mod.gain.value = 0.15;
    var lfo = ctx.createOscillator();
    lfo.frequency.value = oyen ? 27 : 22;
    var lfoG = ctx.createGain();
    lfoG.gain.value = 0.12;
    lfo.connect(lfoG); lfoG.connect(mod.gain);
    var env = ctx.createGain();
    var puncak = oyen ? 0.6 : 0.42;
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(puncak, t + 0.1);
    env.gain.setValueAtTime(puncak, t + d - 0.3);
    env.gain.exponentialRampToValueAtTime(0.0001, t + d);
    src.connect(f); f.connect(mod); mod.connect(env); env.connect(induk);
    src.start(t); lfo.start(t);
    src.stop(t + d + 0.05); lfo.stop(t + d + 0.05);
  }

  /* Meow: Oyen tinggi & riang, Kiko lembut & dalam (Spesifikasi 5.3) */
  function meow(kucing) {
    if (!boleh()) { return; }
    var oyen = kucing === 'oyen';
    var t0 = ctx.currentTime + 0.01;
    var v = 1 + (Math.random() * 0.1 - 0.05);           // nada +-5%
    var d = (oyen ? 0.35 : 0.55) * (1 + (Math.random() * 0.2 - 0.1)); // durasi +-10%
    var f0 = (oyen ? 650 : 380) * v;
    var f1 = (oyen ? 900 : 520) * v;
    var f2 = (oyen ? 600 : 360) * v;
    var serang = oyen ? 0.02 : 0.04;
    var lepas = oyen ? 0.12 : 0.2;
    var puncak = oyen ? 0.6 : 0.42;   // <= 60% induk; Kiko 0.7x Oyen

    var penapis = ctx.createBiquadFilter();
    if (oyen) {
      penapis.type = 'bandpass'; penapis.frequency.value = 1200; penapis.Q.value = 0.8;
    } else {
      penapis.type = 'lowpass'; penapis.frequency.value = 1500; penapis.Q.value = 0.7;
    }
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(puncak, t0 + serang);
    env.gain.setValueAtTime(puncak, Math.max(t0 + serang + 0.01, t0 + d - lepas));
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + d);

    var vib = ctx.createOscillator();
    vib.frequency.value = 6;
    var vibG = ctx.createGain();
    vibG.gain.value = oyen ? 10 : 6;
    vib.connect(vibG);

    function pengayun(jenis, campur) {
      var o = ctx.createOscillator();
      o.type = jenis;
      o.frequency.setValueAtTime(f0, t0);
      o.frequency.linearRampToValueAtTime(f1, t0 + d * 0.4);
      o.frequency.linearRampToValueAtTime(f2, t0 + d);
      vibG.connect(o.frequency);
      var g = ctx.createGain();
      g.gain.value = campur;
      o.connect(g); g.connect(penapis);
      o.start(t0); o.stop(t0 + d + 0.05);
    }
    if (oyen) {
      pengayun('triangle', 0.7);
      pengayun('sawtooth', 0.3);
    } else {
      pengayun('triangle', 1.0);
    }
    penapis.connect(env);
    env.connect(induk);
    vib.start(t0); vib.stop(t0 + d + 0.05);
  }

  function togolSenyap() {
    var t = MJ.keadaan.ubahTetapan(function (s) { s.bunyi.hidup = !s.bunyi.hidup; });
    kemaskiniKelantangan();
    MJ.bas.emit('bunyiBerubah', t.bunyi.hidup);
    return t.bunyi.hidup;
  }

  MJ.bas.on('tetapanBerubah', kemaskiniKelantangan);

  return {
    sediakan: sediakan, kemaskiniKelantangan: kemaskiniKelantangan,
    loceng: loceng, plup: plup, dering: dering, ombak: ombak,
    purr: purr, meow: meow, togolSenyap: togolSenyap
  };
})();
