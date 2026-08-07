/* =========================================================
   PREMIUM HEART LOCK — logic
   Builds a fullscreen lock overlay entirely at runtime and
   inserts it before everything else in <body>. Does not
   touch, read from, or modify any existing site markup.
   Removes itself completely after a correct unlock.
   ========================================================= */
(function(){
  "use strict";

  var PASSWORD = "meri moti awrat"; // compared lowercase/trimmed
  var SESSION_KEY = "lk_unlocked_v1";

  // If already unlocked earlier this browser session, skip the lock entirely.
  try{
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
  }catch(e){ /* storage unavailable — just show the lock every time */ }

  document.documentElement.classList.add("lk-locked");

  var overlayHTML =
    '<div id="lkOverlay" role="dialog" aria-modal="true" aria-label="Password protected">' +
      '<canvas id="lkParticles" aria-hidden="true"></canvas>' +
      '<div class="lk-card">' +
        '<div class="lk-heart-wrap">' +
          '<div class="lk-heart-glow" aria-hidden="true"></div>' +
          '<svg class="lk-heart-svg" viewBox="0 0 200 190" aria-hidden="true">' +
            '<defs>' +
              '<linearGradient id="lkHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#ff7a3d"/>' +
                '<stop offset="55%" stop-color="#ff2f9e"/>' +
                '<stop offset="100%" stop-color="#ff8fce"/>' +
              '</linearGradient>' +
              '<linearGradient id="lkHeartFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                '<stop offset="0%" stop-color="#ff8fce"/>' +
                '<stop offset="100%" stop-color="#ff7a3d"/>' +
              '</linearGradient>' +
            '</defs>' +
            '<path class="lk-heart-fill" d="M100,175 C46,132 6,95 6,52 C6,24 27,3 55,3 C74,3 92,14 100,33 C108,14 126,3 145,3 C173,3 194,24 194,52 C194,95 154,132 100,175 Z"/>' +
            '<path class="lk-heart-outline" d="M100,175 C46,132 6,95 6,52 C6,24 27,3 55,3 C74,3 92,14 100,33 C108,14 126,3 145,3 C173,3 194,24 194,52 C194,95 154,132 100,175 Z"/>' +
            '<path class="lk-heart-trail" d="M100,175 C46,132 6,95 6,52 C6,24 27,3 55,3 C74,3 92,14 100,33 C108,14 126,3 145,3 C173,3 194,24 194,52 C194,95 154,132 100,175 Z"/>' +
            '<g class="lk-lock-shackle">' +
              '<path d="M84,88 L84,72 a16,16 0 0 1 32,0 L116,88" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>' +
            '</g>' +
            '<g class="lk-lock-body">' +
              '<rect x="76" y="86" width="48" height="38" rx="9" fill="rgba(255,255,255,0.94)"/>' +
              '<circle class="lk-lock-keyhole" cx="100" cy="101" r="4.2"/>' +
              '<rect class="lk-lock-keyhole" x="97.4" y="101" width="5.2" height="10" rx="1.6"/>' +
            '</g>' +
          '</svg>' +
        '</div>' +
        '<p class="lk-eyebrow">for your eyes only</p>' +
        '<h2 class="lk-title">This little world<br>is locked, just&nbsp;for&nbsp;you</h2>' +
        '<p class="lk-subtitle">Enter the password to open it.</p>' +
        '<form id="lkForm" novalidate>' +
          '<p class="lk-error-msg" id="lkErrorMsg">that&rsquo;s not it&hellip; try again 🤍</p>' +
          '<div class="lk-field">' +
            '<input class="lk-input" id="lkInput" type="password" inputmode="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Enter password" aria-label="Password">' +
            '<button type="button" class="lk-eye" id="lkEye" aria-label="Show password">' +
              '<svg id="lkEyeIcon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
            '</button>' +
          '</div>' +
          '<button type="submit" class="lk-btn" id="lkSubmit">' +
            '<span>Unlock 💗</span>' +
            '<span class="lk-spinner" aria-hidden="true"><i></i></span>' +
          '</button>' +
        '</form>' +
        '<p class="lk-hint">made with love, kept just for you</p>' +
      '</div>' +
    '</div>';

  function init(){
    var mount = document.createElement("div");
    mount.innerHTML = overlayHTML;
    var overlay = mount.firstElementChild;
    document.body.insertBefore(overlay, document.body.firstChild);

    var form = overlay.querySelector("#lkForm");
    var input = overlay.querySelector("#lkInput");
    var submitBtn = overlay.querySelector("#lkSubmit");
    var eyeBtn = overlay.querySelector("#lkEye");
    var eyeIcon = overlay.querySelector("#lkEyeIcon");

    // Autofocus (gently — avoids forcing keyboard open jarringly on load)
    setTimeout(function(){ try{ input.focus({preventScroll:true}); }catch(e){} }, 650);

    eyeBtn.addEventListener("click", function(){
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      eyeIcon.innerHTML = showing
        ? '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>'
        : '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.6 20.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a20.6 20.6 0 0 1-2.61 3.68M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>';
      eyeBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      try{ input.focus({preventScroll:true}); }catch(e){}
    });

    function normalize(s){
      return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
    }

    function showError(){
      overlay.classList.add("lk-error");
      var card = overlay.querySelector(".lk-card");
      card.classList.remove("lk-shake");
      void card.offsetWidth; // restart animation
      card.classList.add("lk-shake");
      input.select();
    }

    function clearError(){
      overlay.classList.remove("lk-error");
    }

    input.addEventListener("input", clearError);

    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      if (submitBtn.classList.contains("lk-loading")) return;

      var val = normalize(input.value);
      if (!val){ showError(); return; }

      submitBtn.classList.add("lk-loading");

      // tiny cinematic pause before verdict — feels intentional, not laggy
      setTimeout(function(){
        submitBtn.classList.remove("lk-loading");
        if (val === PASSWORD){
          unlock(overlay);
        } else {
          showError();
        }
      }, 420);
    });

    setupParticles(overlay);
  }

  function unlock(overlay){
    try{ sessionStorage.setItem(SESSION_KEY, "1"); }catch(e){}

    overlay.classList.add("lk-unlocking");
    var input = overlay.querySelector("#lkInput");
    if (input) input.blur();

    // little burst of hearts across the screen for that magical moment
    spawnBurst();

    setTimeout(function(){
      overlay.classList.add("lk-hidden");
      document.documentElement.classList.remove("lk-locked");
    }, 650);

    setTimeout(function(){
      overlay.classList.add("lk-removed");
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      stopParticles();
    }, 1850);
  }

  function spawnBurst(){
    var wrap = document.createElement("div");
    wrap.className = "lk-burst";
    var glyphs = ["❤️","💗","✨","🩷","🧡"];
    var count = 16;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++){
      var s = document.createElement("span");
      s.textContent = glyphs[i % glyphs.length];
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      var dist = 120 + Math.random() * 160;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist - 40;
      s.style.setProperty("--lk-tx", tx.toFixed(0) + "px");
      s.style.setProperty("--lk-ty", ty.toFixed(0) + "px");
      s.style.setProperty("--lk-r", (Math.random() * 140 - 70).toFixed(0) + "deg");
      s.style.animationDelay = (Math.random() * 0.12).toFixed(2) + "s";
      s.style.fontSize = (1 + Math.random() * 1.1).toFixed(2) + "rem";
      frag.appendChild(s);
    }
    wrap.appendChild(frag);
    document.body.appendChild(wrap);
    setTimeout(function(){ if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 1400);
  }

  // ---------------- particle canvas: soft floating glows + tiny heart trails ----------------
  var rafId = null;
  var running = false;

  function setupParticles(overlay){
    var canvas = overlay.querySelector("#lkParticles");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h;
    var particles = [];
    var hearts = [];

    function resize(){
      w = overlay.clientWidth || window.innerWidth;
      h = overlay.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    var isSmall = Math.min(window.innerWidth, window.innerHeight) < 500;
    var pCount = isSmall ? 20 : 30;
    var hCount = isSmall ? 3 : 5;

    function rand(a, b){ return a + Math.random() * (b - a); }
    var colors = ["255,143,206", "255,122,61", "255,47,158", "255,179,122"];

    function makeParticle(){
      return {
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1, 2.6),
        speed: rand(6, 18),
        drift: rand(-8, 8),
        alpha: rand(0.25, 0.75),
        color: colors[(Math.random() * colors.length) | 0],
        tw: rand(0, Math.PI * 2)
      };
    }
    function makeHeart(){
      return {
        x: rand(0, w),
        y: h + rand(0, h * 0.6),
        s: rand(6, 11),
        speed: rand(10, 20),
        drift: rand(-6, 6),
        alpha: rand(0.35, 0.7),
        color: colors[(Math.random() * colors.length) | 0]
      };
    }
    for (var i = 0; i < pCount; i++) particles.push(makeParticle());
    for (var j = 0; j < hCount; j++) hearts.push(makeHeart());

    function heartPath(ctx, cx, cy, s){
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.3);
      ctx.bezierCurveTo(cx - s, cy - s * 0.6, cx - s * 0.5, cy - s * 1.3, cx, cy - s * 0.5);
      ctx.bezierCurveTo(cx + s * 0.5, cy - s * 1.3, cx + s, cy - s * 0.6, cx, cy + s * 0.3);
      ctx.closePath();
    }

    var last = performance.now();
    function tick(now){
      if (!running) return;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++){
        var p = particles[i];
        p.y -= p.speed * dt;
        p.x += Math.sin((now / 1000) + p.tw) * p.drift * dt;
        p.tw += dt;
        if (p.y < -10){ p.y = h + 10; p.x = rand(0, w); }
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + p.color + "," + p.alpha + ")";
        ctx.shadowColor = "rgba(" + p.color + ",0.9)";
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 10;
      for (var j = 0; j < hearts.length; j++){
        var hp = hearts[j];
        hp.y -= hp.speed * dt;
        hp.x += hp.drift * dt;
        if (hp.y < -20){ hp.y = h + 20; hp.x = rand(0, w); }
        ctx.fillStyle = "rgba(" + hp.color + "," + hp.alpha + ")";
        ctx.shadowColor = "rgba(" + hp.color + ",0.9)";
        heartPath(ctx, hp.x, hp.y, hp.s);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    }

    running = true;
    rafId = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function(){
      if (document.hidden){
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else if (document.getElementById("lkOverlay")) {
        running = true;
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    });
  }

  function stopParticles(){
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
