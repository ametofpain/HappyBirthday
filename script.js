(function(){
  const enterBtn = document.getElementById('enter-btn');
  const enterScreen = document.getElementById('enter-screen');
  const main = document.getElementById('main');
  const bgm = document.getElementById('bgm');
  const floating = document.getElementById('floating-container');
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext && canvas.getContext('2d');

  let confettiParticles = [];
  function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function rand(min,max){ return Math.random()*(max-min)+min }

  function createConfetti(count){
    const colors = ['#ffd1e8','#ff9fd6','#ff71b8','#ffb3d6','#ffc6e6'];
    for(let i=0;i<count;i++){
      confettiParticles.push({
        x: rand(0,canvas.width),
        y: rand(-canvas.height,0),
        w: rand(6,12),
        h: rand(8,18),
        vx: rand(-2,2),
        vy: rand(2,6),
        r: rand(0,360),
        color: colors[Math.floor(rand(0,colors.length))]
      });
    }
  }

  function drawConfetti(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confettiParticles.forEach((p,i)=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.r += 3;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r*Math.PI/180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
      if(p.y > canvas.height + 40){ confettiParticles.splice(i,1); }
    });
    requestAnimationFrame(drawConfetti);
  }

  function burstConfetti(){ createConfetti(150); }

  // floating emojis
  function spawnFloating(){
    const el = document.createElement('div');
    const isButterfly = Math.random() < 0.35;
    el.className = 'floating ' + (isButterfly? 'butterfly' : 'heart');
    el.style.left = Math.floor(rand(5,95)) + '%';
    el.style.fontSize = Math.floor(rand(22,46)) + 'px';
    el.style.animationDuration = (rand(6,12)) + 's';
    el.style.opacity = rand(0.8,1);
    el.textContent = isButterfly ? '🦋' : '❤';
    floating.appendChild(el);
    el.addEventListener('animationend', ()=> el.remove());
  }

  let spawnInterval;
  function startFloating(){ spawnInterval = setInterval(spawnFloating, 350); }
  function stopFloating(){ clearInterval(spawnInterval); }

  enterBtn.addEventListener('click', async ()=>{
    enterScreen.style.display = 'none';
    main.classList.remove('hidden');
    // lower the background music volume slightly
    try{ bgm.volume = 0.28; await bgm.play(); }catch(e){
      console.error('bgm play failed:', e);
      // expose controls so user can manually start playback for debugging
      bgm.controls = true;
    }
    burstConfetti();
    startFloating();
    // keep light confetti coming for a while
    const confettiTimer = setInterval(()=>{ burstConfetti(); }, 2500);
    setTimeout(()=>{ clearInterval(confettiTimer); }, 10000);
  });

  // start the confetti animation loop
  drawConfetti();

  // mouse trail hearts
  document.addEventListener('mousemove', (e)=>{
    const heart = document.createElement('div');
    heart.className = 'trail-heart';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.fontSize = Math.floor(rand(14,34)) + 'px';
    heart.textContent = '❤';
    document.body.appendChild(heart);
    heart.addEventListener('animationend', ()=> heart.remove());
  });

  // small accessibility: allow Enter key also
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' && enterScreen.style.display !== 'none'){ enterBtn.click(); } });
})();
