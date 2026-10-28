/*
 * petalyx-capture_20261028a.js
 * The Petalyx capture constellation: particles converge into five radial candidates and a "None of the Above"
 * node, and pulses record reaction times. Drawn on any <canvas data-petalyx-capture> element.
 *
 * Originated by and the copyright intellectual property of Cognitif Group Limited.
 * The drawing routine is the one used on the cognitifgroup.com Petalyx page. Differences: the helper functions are
 * included here, the animation loop is self-contained, and the label font is a system font.
 */
(function () {
  "use strict";

  var motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* Petalyx: the capture constellation. Particles converge into five radial candidates + NOTA; pulses record
     reaction times. */
  function makeCapture() {
    var parts = null, events = [], lastPulse = 0;
    return function (ctx, W, H, te) {
      var cx = W > 860 ? W * 0.66 : W * 0.5;
      var cy = H * 0.52;
      var R = Math.min(W * 0.27, H * 0.34);
      if (!parts) {
        parts = [];
        for (var i = 0; i < 150; i++) {
          parts.push({ sx: Math.random(), sy: Math.random(), a: Math.random() * 6.2832, d: Math.random() * 0.4, orbit: 0.72 + (Math.random() - 0.5) * 0.06 });
        }
      }
      var nodes = [];
      for (var n2 = 0; n2 < 6; n2++) nodes.push(-1.5708 + n2 * 1.0472);
      var intro = smooth(clamp((te - 0.2) / 1.1, 0, 1));
      var sy = window.scrollY || 0;
      var rot = sy * 0.00015 + (motionOK ? Math.sin(te * 0.1) * 0.02 : 0);

      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);

      ctx.strokeStyle = "rgba(24,32,64," + (0.14 * intro).toFixed(3) + ")";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 8]);
      ctx.beginPath(); ctx.arc(0, 0, R * 0.72, 0, 6.2832); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(24,32,64," + (0.08 * intro).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.2832); ctx.stroke();

      nodes.forEach(function (a, i) {
        var nx = Math.cos(a) * R * 0.72, ny = Math.sin(a) * R * 0.72;
        var isNota = i === 3;
        ctx.strokeStyle = "rgba(24,32,64," + (0.08 * intro).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 30, Math.sin(a) * 30); ctx.lineTo(nx, ny); ctx.stroke();
        ctx.fillStyle = "rgba(24,32,64," + ((isNota ? 0.24 : 0.52) * intro).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(nx, ny, isNota ? 3 : 4.2, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(24,32,64," + (0.18 * intro).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(nx, ny, isNota ? 8 : 11, 0, 6.2832); ctx.stroke();
      });

      /* ghost petals: the Petalyx flower flashes into place over the constellation as it forms, then dissolves
         into pure geometry */
      if (motionOK && te > 0.5 && te < 2.4) {
        var gIn = smooth(clamp((te - 0.55) / 0.55, 0, 1));
        var gOut = 1 - smooth(clamp((te - 1.5) / 0.8, 0, 1));
        var gA = gIn * gOut;
        if (gA > 0.004) {
          var gs = (R * 0.72 / 228) * (0.82 + 0.18 * gIn);
          nodes.forEach(function (a, i) {
            var isNota = i === 3;
            ctx.save();
            ctx.rotate(a + 1.5708);
            ctx.scale(gs, gs);
            ctx.globalAlpha = gA * (isNota ? 0.4 : 1);
            ctx.strokeStyle = "rgba(24,32,64,0.85)";
            ctx.lineWidth = 1.4 / gs;
            ctx.beginPath();
            ctx.moveTo(0, -60);
            ctx.bezierCurveTo(36, -96, 42, -166, 0, -228);
            ctx.bezierCurveTo(-42, -166, -36, -96, 0, -60);
            ctx.closePath();
            ctx.stroke();
            ctx.strokeStyle = "rgba(166,98,62,0.45)";
            ctx.setLineDash([3 / gs, 6 / gs]);
            ctx.beginPath();
            ctx.moveTo(0, -78);
            ctx.bezierCurveTo(24, -104, 28, -152, 0, -196);
            ctx.bezierCurveTo(-28, -152, -24, -104, 0, -78);
            ctx.closePath();
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
          });
          ctx.globalAlpha = 1;
        }
      }

      var coreFade = smooth(clamp((te - 0.55) / 0.7, 0, 1));
      var pulse = motionOK ? 1 + Math.sin(te * 1.8) * 0.06 : 1;
      ctx.strokeStyle = "rgba(166,98,62," + (0.5 * intro * coreFade).toFixed(3) + ")";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(0, 0, 22 * pulse, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = "rgba(166,98,62," + (0.85 * intro * coreFade).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(0, 0, 3.4, 0, 6.2832); ctx.fill();

      if (motionOK && te > 1.6 && te - lastPulse > 2.1) {
        lastPulse = te;
        events.push({ n: [0, 1, 2, 4, 5][Math.floor(Math.random() * 5)], t: te, ms: 280 + Math.round(Math.random() * 320) });
        if (events.length > 3) events.shift();
      }
      events.forEach(function (ev) {
        var age = te - ev.t;
        var a = nodes[ev.n];
        var nx = Math.cos(a) * R * 0.72, ny = Math.sin(a) * R * 0.72;
        if (age < 0.4) {
          var pp = smooth(age / 0.4);
          var rr = 30 + (R * 0.72 - 30) * pp;
          ctx.fillStyle = "rgba(166,98,62,0.9)";
          ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 2.6, 0, 6.2832); ctx.fill();
        } else if (age < 1.5) {
          var fa = (age - 0.4) / 1.1;
          ctx.strokeStyle = "rgba(166,98,62," + (0.5 * (1 - fa)).toFixed(3) + ")";
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(nx, ny, 11 + fa * 30, 0, 6.2832); ctx.stroke();
          ctx.fillStyle = "rgba(24,32,64," + (0.55 * (1 - fa)).toFixed(3) + ")";
          ctx.font = "500 13px Arial, Helvetica, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(ev.ms + " ms", nx, ny - 20 - fa * 10);
        }
      });
      ctx.restore();

      if (te < 1.6 && motionOK) {
        var pAl = clamp(1 - te / 1.5, 0, 1);
        ctx.fillStyle = "rgba(24,32,64," + (0.5 * pAl).toFixed(3) + ")";
        parts.forEach(function (p) {
          var pe = 1 - Math.pow(1 - clamp((te - p.d) / 1.1, 0, 1), 3);
          ctx.beginPath();
          ctx.arc(
            lerp(p.sx * W, cx + Math.cos(p.a) * R * p.orbit, pe),
            lerp(p.sy * H, cy + Math.sin(p.a) * R * p.orbit, pe),
            1.3, 0, 6.2832
          );
          ctx.fill();
        });
      }
    };
  }

  /* Runs the constellation on one canvas: sizes it for the screen density, animates while it is on screen, and
     draws a single settled frame when the visitor has asked for reduced motion. */
  function run(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) { return; }
    var draw = makeCapture();
    var dpr = 1, W = 0, H = 0;
    var visible = true, running = false, t0 = null;

    function paint(te) {
      if (W < 1 || H < 1) { return; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      draw(ctx, W, H, te);
      ctx.restore();
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      if (!motionOK) { paint(3); }
    }

    function frame(now) {
      running = false;
      if (!visible) { return; }
      if (t0 === null) { t0 = now; }
      paint((now - t0) / 1000);
      running = true;
      requestAnimationFrame(frame);
    }

    function kick() {
      if (motionOK && visible && !running) {
        running = true;
        requestAnimationFrame(frame);
      }
    }

    resize();
    if (typeof ResizeObserver === "function") {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }
    if (typeof IntersectionObserver === "function") {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        kick();
      }, { threshold: 0.05 }).observe(canvas);
    }
    kick();
  }

  document.querySelectorAll("canvas[data-petalyx-capture]").forEach(run);
})();
