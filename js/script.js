/* =========================================================
   PRIYANKA'S BIRTHDAY SCRAPBOOK — SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. AMBIENT LAYER: floating hearts, sparkles, stars, butterflies
  --------------------------------------------------------- */
  const ambientLayer = document.getElementById('ambientLayer');
  const HEARTS = ['❤️','💗','💕','💓'];
  const SPARKLES = ['✨','⋆','·'];
  const STARS = ['✦','✧','⭐'];
  const BUTTERFLY = '🦋';

  function spawnFloaty(){
    const rand = Math.random();
    const el = document.createElement('span');
    let type;

    if (rand < 0.4){
      type = 'heart';
      el.className = 'floaty floaty--heart';
      el.textContent = HEARTS[Math.floor(Math.random()*HEARTS.length)];
      el.style.fontSize = (0.9 + Math.random()*1.1) + 'rem';
    } else if (rand < 0.75){
      type = 'sparkle';
      el.className = 'floaty floaty--sparkle';
      el.textContent = SPARKLES[Math.floor(Math.random()*SPARKLES.length)];
      el.style.fontSize = (0.8 + Math.random()*1) + 'rem';
    } else if (rand < 0.92){
      type = 'star';
      el.className = 'floaty floaty--star';
      el.textContent = STARS[Math.floor(Math.random()*STARS.length)];
      el.style.fontSize = (0.7 + Math.random()*0.8) + 'rem';
    } else {
      type = 'butterfly';
      el.className = 'floaty floaty--butterfly';
      el.textContent = BUTTERFLY;
    }

    el.style.left = Math.random()*96 + 'vw';
    const duration = type === 'butterfly' ? (9 + Math.random()*5) : (7 + Math.random()*7);
    el.style.animationDuration = duration + 's';
    el.style.opacity = '0';

    ambientLayer.appendChild(el);
    setTimeout(() => el.remove(), duration*1000 + 500);
  }

  // gentle, ongoing ambient spawn (not overwhelming)
  for (let i=0;i<6;i++){ setTimeout(spawnFloaty, i*600); }
  setInterval(spawnFloaty, 1100);


  /* ---------------------------------------------------------
     2. HERO -> "Open Your Surprise" transition
  --------------------------------------------------------- */
  const openBtn = document.getElementById('openSurpriseBtn');
  const mainContent = document.getElementById('mainContent');

  openBtn.addEventListener('click', () => {
    document.getElementById('hero').style.pointerEvents = 'none';
    mainContent.scrollIntoView({ behavior:'smooth', block:'start' });
    // little celebratory burst of hearts on click
    for (let i=0;i<14;i++){ setTimeout(spawnFloaty, i*70); }
  });


  /* ---------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------------
     4. MUSIC PLAYER
  --------------------------------------------------------- */
  const musicPlayer = document.getElementById('musicPlayer');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = musicToggle.querySelector('.music-player__icon');
  const bgAudio = document.getElementById('bgAudio');

  musicToggle.addEventListener('click', () => {
    if (bgAudio.paused){
      bgAudio.play().catch(() => {
        /* autoplay-policy or missing file safeguard */
      });
      musicPlayer.classList.add('is-playing');
      musicIcon.textContent = '🎶';
    } else {
      bgAudio.pause();
      musicPlayer.classList.remove('is-playing');
      musicIcon.textContent = '🎵';
    }
  });

  bgAudio.addEventListener('pause', () => {
    musicPlayer.classList.remove('is-playing');
    musicIcon.textContent = '🎵';
  });


  /* ---------------------------------------------------------
     5. ENVELOPE + TYPEWRITER LETTER
  --------------------------------------------------------- */
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelopeHint');
  const typewriterTarget = document.getElementById('letterTypewriter');

  const letterText =
`You are one of the sweetest souls I have ever met.

You are caring, loving, kind, and honestly deserve every happiness this world has to offer.

Thank you for every coffee, every sandwich, every appes, every cutlet, every idli, every laugh, every random conversation, and every little thing you've done for me.

I don't think you even realize how many beautiful memories we've created together.

The moon watching.
The coffee sipping.
The marine ride.
Kiki Cafe.
Movie dates.
Everything.

But my favourite memory will always be those 5 AM scooty learning days.
Sitting together in the park afterwards.
Laughing over nothing.

And when you fell…
I swear my heart almost stopped.
You scared me so much. 🤧❤️

Happy Birthday babyyyy.
I know it's difficult without me. 😜
But don't worry.
We'll continue our bakchodi exactly where we left off when I come back.

I love you endlessly.

Tum jiyo hazaaron saal,
Ye meri hai aarzoo…

Happy Birthday to youuu ❤️`;

  let typewriterStarted = false;
  let typewriterDone = false;
  let typeTimer = null;

  function typeLetter(){
    if (typewriterStarted) return;
    typewriterStarted = true;

    typewriterTarget.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    let i = 0;
    const speed = 16; // ms per character

    function step(){
      if (i < letterText.length){
        // append next character (rebuild text node + cursor for simplicity)
        typewriterTarget.textContent = letterText.slice(0, i+1);
        typewriterTarget.appendChild(cursor);
        i++;
        typeTimer = setTimeout(step, speed);
      } else {
        typewriterDone = true;
        cursor.remove();
      }
    }
    step();
  }

  function skipTypewriter(){
    clearTimeout(typeTimer);
    typewriterTarget.textContent = letterText;
    typewriterDone = true;
  }

  envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('is-open')){
      envelope.classList.add('is-open');
      envelopeHint.textContent = 'tap again to skip the reveal';
      setTimeout(typeLetter, 650); // wait for flap to open
    } else if (!typewriterDone){
      skipTypewriter();
      envelopeHint.textContent = '';
    }
  });


  /* ---------------------------------------------------------
     6. SECRET MESSAGE
  --------------------------------------------------------- */
  const secretBtn = document.getElementById('secretBtn');
  const secretMessage = document.getElementById('secretMessage');

  secretBtn.addEventListener('click', () => {
    const willShow = !secretMessage.classList.contains('is-visible');
    secretMessage.classList.toggle('is-visible');
    secretBtn.textContent = willShow ? '💌 Close Message' : '💌 Open Secret Message';
    if (willShow){
      for (let i=0;i<10;i++){ setTimeout(spawnFloaty, i*80); }
    }
  });


  /* ---------------------------------------------------------
     7. CONFETTI ON ENDING SECTION
  --------------------------------------------------------- */
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  const endingSection = document.getElementById('ending');
  let confettiPieces = [];
  let confettiRunning = false;
  let confettiFrame;

  const CONFETTI_COLORS = ['#E88AA8', '#F7C6D9', '#D9CCF3', '#E7B45C', '#FFFFFF'];

  function resizeCanvas(){
    canvas.width = endingSection.offsetWidth;
    canvas.height = endingSection.offsetHeight;
  }

  function makeConfettiPiece(){
    return {
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*canvas.height*0.5,
      size: 5 + Math.random()*6,
      color: CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],
      speedY: 1.5 + Math.random()*2.5,
      speedX: (Math.random()-0.5)*1.6,
      rotation: Math.random()*360,
      rotationSpeed: (Math.random()-0.5)*8,
      shape: Math.random() > 0.5 ? 'circle' : 'rect'
    };
  }

  function startConfetti(){
    if (confettiRunning) return;
    confettiRunning = true;
    resizeCanvas();
    confettiPieces = Array.from({length:90}, makeConfettiPiece);
    animateConfetti();
    // taper off new pieces after a while, just let existing ones fall & clear
    setTimeout(() => { confettiRunning = false; }, 4500);
  }

  function animateConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI/180);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle'){
        ctx.beginPath();
        ctx.arc(0,0,p.size/2,0,Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      }
      ctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 30);

    if (confettiPieces.length > 0){
      confettiFrame = requestAnimationFrame(animateConfetti);
    } else {
      cancelAnimationFrame(confettiFrame);
    }
  }

  window.addEventListener('resize', () => {
    if (canvas.width) resizeCanvas();
  });

  const endingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        startConfetti();
        endingObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.4 });

  endingObserver.observe(endingSection);

});
