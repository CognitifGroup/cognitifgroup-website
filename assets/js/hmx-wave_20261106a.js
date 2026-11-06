/* ============================================================
   hmx-wave_20261106a.js
   Originated by and the copyright intellectual property of
   Cognitif Group Limited. All rights reserved.

   HMX page: an "audio transmission" graphic. A navy sinusoidal
   FM wave is drawn over a copper, sporadic AM "speech pattern"
   wave. The whole graphic scrolls continuously from right to left
   at about 2 cm per second (76 CSS px/s; 1 cm = 37.8 CSS px).
   Decorative only - not driven by any audio or data.
   Usage: <canvas data-hmx-wave></canvas>
   ============================================================ */
(function () {
  "use strict";
  var motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SPEED = 76;   /* CSS px per second, about 2 cm/s */

  /* smooth, repeatable pseudo-random value noise along the strip,
     so the speech pattern never repeats visibly and has no seams */
  function hash(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function noise(u) {
    var i = Math.floor(u), f = u - i, t = f * f * (3 - 2 * f);
    return hash(i) * (1 - t) + hash(i + 1) * t;
  }

  /* speech envelope: syllable-like bursts separated by pauses */
  function envelope(u) {
    var syll = noise(u / 34);                     /* individual syllables */
    var phrase = noise(u / 190 + 40);             /* phrases and pauses */
    var e = Math.max(0, syll - 0.28) / 0.72;
    var p = Math.max(0, phrase - 0.3) / 0.7;
    return Math.pow(e, 0.8) * Math.min(1, p * 1.8);
  }

  function render(ctx, W, H, t) {
    var off = t * SPEED;
    var mid = H / 2;

    /* AM speech pattern (copper): fast carrier, sporadic amplitude */
    ctx.strokeStyle = "rgba(166,98,62,0.85)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (var x = 0; x <= W; x += 1) {
      var u = x + off;
      var carrier = Math.sin(u * 0.9) * 0.7 + Math.sin(u * 2.3 + noise(u / 9) * 6) * 0.3;
      var y = mid - carrier * envelope(u) * H * 0.44;
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();

    /* FM wave (navy): constant amplitude, frequency swinging
       sinusoidally, drawn over the speech pattern */
    ctx.strokeStyle = "rgba(24,32,64,0.9)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (var x2 = 0; x2 <= W; x2 += 1) {
      var u2 = x2 + off;
      var phase = u2 * 0.16 + 4.5 * Math.sin(u2 * 0.012);
      var y2 = mid - Math.sin(phase) * H * 0.26;
      x2 ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2);
    }
    ctx.stroke();
  }

  function run(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    var W = 0, H = 0, acc = 0, last = null, visible = false, running = false;
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    function draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      render(ctx, W, H, t);
    }
    function loop(now) {
      if (!visible) { running = false; last = null; return; }
      if (last !== null) acc += Math.min(now - last, 100);   /* no jump after a pause */
      last = now;
      draw(acc / 1000);
      requestAnimationFrame(loop);
    }
    function kick() { if (visible && !running) { running = true; requestAnimationFrame(loop); } }
    resize();
    if (motionOK && "IntersectionObserver" in window) {
      window.addEventListener("resize", function () { resize(); kick(); });
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        kick();
      }, { threshold: 0.01 }).observe(canvas);
    } else {
      /* reduced motion: one still frame */
      window.addEventListener("resize", function () { resize(); draw(0); });
      draw(0);
    }
  }

  document.querySelectorAll("[data-hmx-wave]").forEach(run);
})();
