/* ============================================================
   hmx-timeline_20261106a.js
   Originated by and the copyright intellectual property of
   Cognitif Group Limited. All rights reserved.

   HMX page: a scrolling "arrow of time" sequence of six-axis
   radial dials (the dial used on semantic-bathymetry.html,
   vault-radar_20261106d.js). A new dial is created on the right
   and plays its origination animation; when the strip steps left
   it freezes; the oldest fades out on the left. Arrows link each
   dial to the next, pointing left to right.
   Readings are RANDOM and decorative only - not data-driven.
   Usage: <canvas data-hmx-timeline></canvas>
   ============================================================ */
(function () {
  "use strict";
  var motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  var PERIOD = 6.4;   /* seconds between new dials (same as the radar cycle) */
  var SLIDE = 1.4;    /* seconds the strip takes to step one place left */
  var SLOTS = 3;      /* dials visible at once */

  var RINGS = [
    { r: 1.0, ticks: 72, dash: false, start: -2.4, drift: 0.045, w: 1.1 },
    { r: 0.82, ticks: 0, dash: true, start: 1.7, drift: -0.03, w: 1 },
    { r: 0.64, ticks: 36, dash: false, start: -1.1, drift: 0.02, w: 1 }
  ];

  function newItem() {
    var it = { vals: [], parts: [] };
    for (var v = 0; v < 6; v++) it.vals.push(0.38 + Math.random() * 0.57);
    for (var i = 0; i < 120; i++) {
      it.parts.push({ sa: Math.random() * 6.2832, sr: 0.82 + Math.random() * 0.16, ring: i % 3, ang: Math.random() * 6.2832, d: Math.random() * 0.35 });
    }
    return it;
  }

  /* One dial, drawn as the semantic-bathymetry dial at local time te.
     Passing a constant te freezes it exactly as it was at that moment. */
  function drawDial(ctx, cx, cy, R, te, it) {
    /* phase one: the sealed door spins and breaks apart */
    if (te < 1.45 && motionOK) {
      var de = smooth(clamp(te / 1.25, 0, 1));
      var dAl = Math.min(te * 3.5, 1) * (1 - smooth(clamp((te - 0.95) / 0.45, 0, 1)));
      if (dAl > 0.005) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-2.1 * de);
        ctx.strokeStyle = "rgba(24,32,64," + (0.55 * dAl).toFixed(3) + ")";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, R * 0.92, 0, 6.2832); ctx.stroke();
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(0, 0, R * 0.3, 0, 6.2832); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, R * 0.09, 0, 6.2832); ctx.stroke();
        ctx.lineWidth = 1.6;
        for (var sp = 0; sp < 6; sp++) {
          var spa = sp / 6 * 6.2832;
          ctx.beginPath();
          ctx.moveTo(Math.cos(spa) * R * 0.09, Math.sin(spa) * R * 0.09);
          ctx.lineTo(Math.cos(spa) * R * 0.9, Math.sin(spa) * R * 0.9);
          ctx.stroke();
          ctx.fillStyle = "rgba(166,98,62," + (0.7 * dAl).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(Math.cos(spa) * R * 0.3, Math.sin(spa) * R * 0.3, 2.4, 0, 6.2832); ctx.fill();
        }
        ctx.lineWidth = 1;
        for (var st = 0; st < 24; st++) {
          var sta = st / 24 * 6.2832;
          ctx.beginPath();
          ctx.moveTo(Math.cos(sta) * R * 0.92, Math.sin(sta) * R * 0.92);
          ctx.lineTo(Math.cos(sta) * R * 0.85, Math.sin(sta) * R * 0.85);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    /* the dial rings assemble, then drift slowly */
    RINGS.forEach(function (rg, ri) {
      var ap = clamp((te - 1.4 - 0.12 * ri) / 1.1, 0, 1);
      var e = 1 - Math.pow(1 - ap, 3);
      var rot = rg.start * (1 - e) + (motionOK ? te * rg.drift : 0);
      var rr = R * rg.r;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = "rgba(24,32,64," + (0.32 * e).toFixed(3) + ")";
      ctx.lineWidth = rg.w;
      if (rg.dash) ctx.setLineDash([3, 7]);
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.2832); ctx.stroke();
      ctx.setLineDash([]);
      for (var t = 0; t < rg.ticks; t++) {
        var a = t / rg.ticks * 6.2832;
        var L = t % (rg.ticks / 12) === 0 ? 9 : 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
        ctx.lineTo(Math.cos(a) * (rr - L), Math.sin(a) * (rr - L));
        ctx.stroke();
      }
      ctx.restore();
    });

    /* the unlock flash and the six outer-ring nodes, one per axis */
    var fl = clamp((te - 2.6) / 0.7, 0, 1);
    if (fl > 0 && fl < 1) {
      ctx.strokeStyle = "rgba(166,98,62," + (0.5 * (1 - fl)).toFixed(3) + ")";
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(cx, cy, R * (1 + fl * 0.25), 0, 6.2832); ctx.stroke();
    }
    var bf = smooth(clamp((te - 2.55) / 0.5, 0, 1));
    for (var b = 0; b < 6; b++) {
      var ba = -1.5708 + b / 6 * 6.2832;
      var br = R * (1.02 + 0.07 * bf);
      ctx.fillStyle = "rgba(166,98,62," + (0.7 * bf).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(cx + Math.cos(ba) * br, cy + Math.sin(ba) * br, 2.2, 0, 6.2832); ctx.fill();
    }

    /* the hex-axis radar and its reading */
    var hf = smooth(clamp((te - 2.2) / 0.8, 0, 1));
    if (hf > 0) {
      ctx.save(); ctx.translate(cx, cy);
      var HR = R * 0.5, k, v6, ha, hr;
      for (k = 1; k <= 3; k++) {
        ctx.strokeStyle = "rgba(24,32,64," + (0.14 * hf).toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (v6 = 0; v6 <= 6; v6++) {
          ha = -1.5708 + v6 / 6 * 6.2832;
          hr = HR * k / 3 * hf;
          v6 ? ctx.lineTo(Math.cos(ha) * hr, Math.sin(ha) * hr) : ctx.moveTo(Math.cos(ha) * hr, Math.sin(ha) * hr);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(24,32,64," + (0.1 * hf).toFixed(3) + ")";
      for (var s6 = 0; s6 < 6; s6++) {
        var sa = -1.5708 + s6 / 6 * 6.2832;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sa) * HR * hf, Math.sin(sa) * HR * hf);
        ctx.stroke();
      }
      var pf = motionOK ? smooth(clamp((te - 2.7) / 0.9, 0, 1)) : 1;
      if (pf > 0.004) {
        ctx.beginPath();
        for (var p6 = 0; p6 <= 6; p6++) {
          var pa = -1.5708 + (p6 % 6) / 6 * 6.2832;
          var pr = HR * it.vals[p6 % 6] * pf * (1 + (motionOK ? 0.02 * Math.sin(te * 1.4 + p6) : 0));
          p6 ? ctx.lineTo(Math.cos(pa) * pr, Math.sin(pa) * pr) : ctx.moveTo(Math.cos(pa) * pr, Math.sin(pa) * pr);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(160,95,60," + (0.1 * pf).toFixed(3) + ")";
        ctx.fill();
        ctx.strokeStyle = "rgba(166,98,62," + (0.6 * pf).toFixed(3) + ")";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        for (var d6 = 0; d6 < 6; d6++) {
          var da = -1.5708 + d6 / 6 * 6.2832;
          var dr = HR * it.vals[d6] * pf;
          ctx.fillStyle = "rgba(166,98,62," + (0.85 * pf).toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(Math.cos(da) * dr, Math.sin(da) * dr, 2.3 + (motionOK ? Math.sin(te * 2 + d6 * 1.3) * 0.6 : 0), 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.fillStyle = "rgba(166,98,62," + (0.8 * hf).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, 6.2832); ctx.fill();
      ctx.restore();
    }

    /* the door dissolves into particles that reassemble as the dial */
    if (te > 0.8 && te < 2.7 && motionOK) {
      var pAl = smooth(clamp((te - 0.8) / 0.3, 0, 1)) * (1 - smooth(clamp((te - 2.1) / 0.55, 0, 1)));
      if (pAl > 0.004) {
        ctx.fillStyle = "rgba(166,98,62," + (0.65 * pAl).toFixed(3) + ")";
        var burst = smooth(clamp((te - 0.85) / 0.5, 0, 1)) * 0.12;
        it.parts.forEach(function (p) {
          var pe = 1 - Math.pow(1 - clamp((te - 1.0 - p.d) / 1.0, 0, 1), 3);
          var sr = R * (p.sr + burst);
          var tr = R * RINGS[p.ring].r;
          var xx = lerp(cx + Math.cos(p.sa - 2.1) * sr, cx + Math.cos(p.ang) * tr, pe);
          var yy = lerp(cy + Math.sin(p.sa - 2.1) * sr, cy + Math.sin(p.ang) * tr, pe);
          ctx.beginPath(); ctx.arc(xx, yy, 1.3, 0, 6.2832); ctx.fill();
        });
      }
    }
  }

  /* the "arrow of time" between two neighbouring dials */
  function drawArrow(ctx, x1, x2, y, al) {
    if (x2 - x1 < 12 || al < 0.01) return;
    ctx.strokeStyle = "rgba(24,32,64," + (0.4 * al).toFixed(3) + ")";
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2 - 2, y); ctx.stroke();
    ctx.fillStyle = "rgba(166,98,62," + (0.85 * al).toFixed(3) + ")";
    ctx.beginPath();
    ctx.moveTo(x2, y); ctx.lineTo(x2 - 8, y - 4.5); ctx.lineTo(x2 - 8, y + 4.5);
    ctx.closePath(); ctx.fill();
  }

  function makeTimeline() {
    var items = {};
    function item(i) { if (!items[i]) items[i] = newItem(); return items[i]; }

    return function (ctx, W, H, te) {
      var S = W / SLOTS;
      var R = Math.min(S * 0.34, H * 0.36);
      var cy = H * 0.5;
      var n, f;
      if (motionOK) {
        n = Math.floor(te / PERIOD);
        f = smooth(clamp((te - n * PERIOD) / SLIDE, 0, 1));
      } else {
        n = 0; f = 1;   /* reduced motion: one still frame of three dials */
      }
      var shown = [];
      for (var i = n - SLOTS; i <= n; i++) {
        var j = n - i;                                   /* 0 = newest */
        var x = W - S / 2 - (j + f - 1) * S;
        var al = clamp((x + S / 2) / S, 0, 1) * clamp((W + S / 2 - x) / (S * 0.6), 0, 1);
        if (al <= 0.004) { shown.push(null); continue; }
        /* local time: the newest dial is live; older ones are frozen
           as they were at the moment the strip stepped left */
        var age = motionOK ? te - i * PERIOD : PERIOD;
        var tl = j === 0 ? age : Math.min(age, PERIOD);
        if (!motionOK) tl = 9;
        shown.push({ x: x, al: al, tl: tl, i: i });
      }
      for (var a = 0; a < shown.length - 1; a++) {
        var A = shown[a], B = shown[a + 1];
        if (!A || !B) continue;
        var bIn = smooth(clamp((B.tl - 2.4) / 0.8, 0, 1));
        drawArrow(ctx, A.x + R * 1.2, B.x - R * 1.2, cy, Math.min(A.al, B.al) * bIn);
      }
      shown.forEach(function (s) {
        if (!s) return;
        ctx.save();
        ctx.globalAlpha = s.al;
        drawDial(ctx, s.x, cy, R, s.tl, item(s.i));
        ctx.restore();
      });
      for (var k in items) { if (+k < n - SLOTS) delete items[k]; }
    };
  }

  function canvasFX(canvas, render) {
    var host = canvas.parentElement;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    var W = 0, H = 0;
    function resize() {
      W = canvas.clientWidth || host.clientWidth;
      H = canvas.clientHeight || host.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    resize();
    var visT = null, visible = false, running = false;
    function loop(now) {
      if (!visible) { running = false; return; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      render(ctx, W, H, (now - visT) / 1000);
      requestAnimationFrame(loop);
    }
    function kick() {
      if (visible && !running) { running = true; requestAnimationFrame(loop); }
    }
    function still() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      render(ctx, W, H, 0);
    }
    if (motionOK && "IntersectionObserver" in window) {
      window.addEventListener("resize", function () { resize(); kick(); });
      window.addEventListener("load", function () { resize(); kick(); });
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible && visT === null) visT = performance.now();
        kick();
      }, { threshold: 0.04 }).observe(host);
    } else {
      /* reduced motion: draw three settled dials once */
      window.addEventListener("resize", function () { resize(); still(); });
      still();
    }
  }

  document.querySelectorAll("[data-hmx-timeline]").forEach(function (cv) {
    canvasFX(cv, makeTimeline());
  });
})();
