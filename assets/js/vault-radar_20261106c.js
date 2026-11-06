/* ============================================================
   vault-radar_20261106c.js
   Originated by and the copyright intellectual property of
   Cognitif Group Limited. All rights reserved.

   Animated hex-axis radar ("vault" graphic), replicated from the
   Insightvault hero on cognitifgroup.com
   (repo cognitifgroup-com-website, assets/js/main.js, makeVault).
   Readings are RANDOM and decorative only - not data-driven.
   Changes from the source: the graphic is always centred
   horizontally in its canvas (source offset it right on wide screens);
   six outer-ring nodes aligned to the six axes (source had eight);
   overall diameter enlarged by 5%.
   Usage: <canvas data-vault-radar></canvas>
   ============================================================ */
(function () {
  "use strict";
  var motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

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
    window.addEventListener("resize", function () { resize(); kick(); });
    window.addEventListener("load", function () { resize(); kick(); });
    requestAnimationFrame(function () { resize(); kick(); });
    var visT = null, visible = false, running = false;
    function loop(now) {
      if (!visible) { running = false; return; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      render(ctx, W, H, (now - visT) / 1000, canvas);
      requestAnimationFrame(loop);
    }
    function kick() {
      if (visible && !running) { running = true; requestAnimationFrame(loop); }
    }
    if (motionOK && "IntersectionObserver" in window) {
      var iofx = new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible && visT === null) visT = performance.now();
        kick();
      }, { threshold: 0.04 });
      iofx.observe(host);
    } else {
      /* reduced motion: render the settled final state once */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(ctx, W, H, 9, canvas);
    }
  }

  /* Insightvault — a vault door spins and unseals, dissolving into
     particles that reassemble as the dial mechanism around a hex-axis
     radar whose readings re-randomise cyclically */
  function makeVault() {
    var parts = null;
    var radarVals = [0.85, 0.55, 0.72, 0.62, 0.9, 0.48];
    var radarRegen = -1;
    return function (ctx, W, H, te) {
      var cx = W * 0.5;
      var cy = H * 0.52;
      var R = Math.min(W * 0.3, H * 0.36) * 1.05;   /* +5% diameter vs source */
      var sy = window.scrollY || 0;
      if (!parts) {
        parts = [];
        for (var i = 0; i < 170; i++) {
          parts.push({ sa: Math.random() * 6.2832, sr: 0.82 + Math.random() * 0.16, ring: i % 3, ang: Math.random() * 6.2832, d: Math.random() * 0.35 });
        }
      }

      /* — phase one: the sealed door. A heavy wheel — hub, spokes,
         rim — spins anticlockwise as it unseals, then breaks apart */
      if (te < 1.45 && motionOK) {
        var de = smooth(clamp(te / 1.25, 0, 1));
        var dAl = Math.min(te * 3.5, 1) * (1 - smooth(clamp((te - 0.95) / 0.45, 0, 1)));
        if (dAl > 0.005) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-2.1 * de);
          ctx.strokeStyle = "rgba(24,32,64," + (0.55 * dAl).toFixed(3) + ")";
          ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.arc(0, 0, R * 0.92, 0, 6.2832); ctx.stroke();
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(0, 0, R * 0.3, 0, 6.2832); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, R * 0.09, 0, 6.2832); ctx.stroke();
          ctx.lineWidth = 2;
          for (var sp = 0; sp < 8; sp++) {
            var spa = sp / 8 * 6.2832;
            ctx.beginPath();
            ctx.moveTo(Math.cos(spa) * R * 0.09, Math.sin(spa) * R * 0.09);
            ctx.lineTo(Math.cos(spa) * R * 0.9, Math.sin(spa) * R * 0.9);
            ctx.stroke();
            ctx.fillStyle = "rgba(166,98,62," + (0.7 * dAl).toFixed(3) + ")";
            ctx.beginPath();
            ctx.arc(Math.cos(spa) * R * 0.3, Math.sin(spa) * R * 0.3, 3, 0, 6.2832);
            ctx.fill();
          }
          /* seal ticks around the rim */
          ctx.lineWidth = 1.2;
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

      var rings = [
        { r: 1.0, ticks: 72, dash: false, start: -2.4, drift: 0.045, w: 1.1 },
        { r: 0.82, ticks: 0, dash: true, start: 1.7, drift: -0.03, w: 1 },
        { r: 0.64, ticks: 36, dash: false, start: -1.1, drift: 0.02, w: 1 }
      ];
      rings.forEach(function (rg, ri) {
        var ap = clamp((te - 1.4 - 0.12 * ri) / 1.1, 0, 1);
        var e = 1 - Math.pow(1 - ap, 3);
        var rot = rg.start * (1 - e) + (motionOK ? te * rg.drift : 0) + sy * 0.0005 * (ri % 2 ? -1 : 1);
        var rr = R * rg.r;
        var al = 0.32 * e;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = "rgba(24,32,64," + al.toFixed(3) + ")";
        ctx.lineWidth = rg.w;
        if (rg.dash) ctx.setLineDash([3, 9]);
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.2832); ctx.stroke();
        ctx.setLineDash([]);
        for (var t = 0; t < rg.ticks; t++) {
          var a = t / rg.ticks * 6.2832;
          var L = t % (rg.ticks / 12) === 0 ? 12 : 5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
          ctx.lineTo(Math.cos(a) * (rr - L), Math.sin(a) * (rr - L));
          ctx.stroke();
        }
        ctx.restore();
      });

      /* the unlock — a click flash and bolts extending */
      var fl = clamp((te - 2.6) / 0.7, 0, 1);
      if (fl > 0 && fl < 1) {
        ctx.strokeStyle = "rgba(166,98,62," + (0.5 * (1 - fl)).toFixed(3) + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, R * (1 + fl * 0.35), 0, 6.2832); ctx.stroke();
      }
      var bf = smooth(clamp((te - 2.55) / 0.5, 0, 1));
      /* six outer-ring nodes, one on each radar axis (source had 8) */
      for (var b = 0; b < 6; b++) {
        var ba = -1.5708 + b / 6 * 6.2832;
        var br = R * (1.02 + 0.07 * bf);
        ctx.fillStyle = "rgba(166,98,62," + (0.7 * bf).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(cx + Math.cos(ba) * br, cy + Math.sin(ba) * br, 2.4, 0, 6.2832); ctx.fill();
      }

      /* hex-axis radar inside the dial */
      var hf = smooth(clamp((te - 2.2) / 0.8, 0, 1));
      if (hf > 0) {
        ctx.save(); ctx.translate(cx, cy);
        var HR = R * 0.5;
        var k, v6, ha, hr;
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
        /* the reading — draws out, holds, folds back to nothing, then
           re-draws with fresh values, cyclically */
        var pf;
        var CYC_START = 3.7, CYC_LEN = 6.4;
        if (!motionOK) {
          pf = 1;
        } else if (te < CYC_START) {
          pf = smooth(clamp((te - 2.7) / 0.9, 0, 1));
        } else {
          var ct = (te - CYC_START) % CYC_LEN;
          var cyc = Math.floor((te - CYC_START) / CYC_LEN);
          if (ct < CYC_LEN - 2.2) {
            pf = 1;                                         /* hold */
          } else if (ct < CYC_LEN - 1.4) {
            pf = 1 - smooth((ct - (CYC_LEN - 2.2)) / 0.8);  /* fold away */
          } else {
            if (radarRegen !== cyc) {                        /* new sounding */
              radarRegen = cyc;
              for (var rv6 = 0; rv6 < 6; rv6++) radarVals[rv6] = 0.38 + Math.random() * 0.57;
            }
            pf = smooth((ct - (CYC_LEN - 1.4)) / 0.9);      /* draw back out */
          }
        }
        if (pf > 0.004) {
          ctx.beginPath();
          for (var p6 = 0; p6 <= 6; p6++) {
            var pa = -1.5708 + (p6 % 6) / 6 * 6.2832;
            var pr = HR * radarVals[p6 % 6] * pf * (1 + (motionOK ? 0.02 * Math.sin(te * 1.4 + p6) : 0));
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
            var dr = HR * radarVals[d6] * pf;
            ctx.fillStyle = "rgba(166,98,62," + (0.85 * pf).toFixed(3) + ")";
            ctx.beginPath();
            ctx.arc(Math.cos(da) * dr, Math.sin(da) * dr, 2.6 + (motionOK ? Math.sin(te * 2 + d6 * 1.3) * 0.7 : 0), 0, 6.2832);
            ctx.fill();
          }
        }
        ctx.fillStyle = "rgba(166,98,62," + (0.8 * hf).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, 6.2832); ctx.fill();
        ctx.restore();
      }

      /* the door dissolves into particles, which drift outward and
         reassemble as the dial mechanism */
      if (te > 0.8 && te < 2.7 && motionOK) {
        var pIn = smooth(clamp((te - 0.8) / 0.3, 0, 1));
        var pOut = 1 - smooth(clamp((te - 2.1) / 0.55, 0, 1));
        var pAl = pIn * pOut;
        if (pAl > 0.004) {
          ctx.fillStyle = "rgba(166,98,62," + (0.65 * pAl).toFixed(3) + ")";
          parts.forEach(function (p) {
            var pe = 1 - Math.pow(1 - clamp((te - 1.0 - p.d) / 1.0, 0, 1), 3);
            /* start on the door's rim; scatter slightly as it breaks */
            var burst = smooth(clamp((te - 0.85) / 0.5, 0, 1)) * 0.12;
            var sr = R * (p.sr + burst);
            var sxx = cx + Math.cos(p.sa - 2.1) * sr;
            var syy = cy + Math.sin(p.sa - 2.1) * sr;
            var tr = R * rings[p.ring].r;
            var xx = lerp(sxx, cx + Math.cos(p.ang) * tr, pe);
            var yy = lerp(syy, cy + Math.sin(p.ang) * tr, pe);
            ctx.beginPath(); ctx.arc(xx, yy, 1.5, 0, 6.2832); ctx.fill();
          });
        }
      }
    };
  }

  document.querySelectorAll("[data-vault-radar]").forEach(function (cv) {
    canvasFX(cv, makeVault());
  });
})();
