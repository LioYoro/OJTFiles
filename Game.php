<?php
// Simple Flappy-like skeleton in one file.
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Flappy Skeleton</title>
  <style>
    html,body{
      height:100%;
      margin:0;
      background:linear-gradient(#87ceeb,#cfe9ff);
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:Arial,Helvetica,sans-serif
    }
    .wrap{
      width:420px;
      height:640px;
      background:#70c5ce;
      border-radius:10px;
      box-shadow:0 10px 30px rgba(0,0,0,.15);
      position:relative;
      overflow:hidden
    }
    canvas{
      display:block;
      background:linear-gradient(#70c5ce,#58b3bb);
      width:100%;
      height:100%
    }
    .hud{
      position:absolute;
      left:12px;
      top:12px;
      color:#fff;
      font-weight:700;
      text-shadow:0 2px 6px rgba(0,0,0,.25)
    }
    .center{
      position:absolute;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      pointer-events:none
    }
    .btn{
      pointer-events:auto;
      padding:8px 12px;
      border-radius:8px;
      border:none;
      background:#fff;
      color:#222;
      cursor:pointer
    }
    .footer{
      position:absolute;
      left:12px;
      right:12px;
      bottom:12px;
      color:#fff;
      font-size:13px;
      text-align:center
    }
    #face{
      position:absolute;
  width:50%;
  height:50%;
  display:none;
  pointer-events:none;
  transform:translate(-50%, -50%);
  object-fit:contain;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <canvas id="game" width="420" height="640"></canvas>

    <!-- FACE PLACEHOLDER -->
    <img id="face" src="win.jpg" alt="face">

    <div class="hud" id="score">Score: 0</div>

    <div class="center" id="center">
      <div style="text-align:center">
        <div style="font-size:20px;color:#fff;font-weight:800;text-shadow:0 3px 8px rgba(0,0,0,.4)">
          Flappy — Skeleton
        </div>
        <div style="height:10px"></div>
        <button class="btn" id="startBtn">Start</button>
      </div>
    </div>

    <div class="footer">
      Controls: click / tap or press <strong>Space</strong> to flap
    </div>
  </div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const centerEl = document.getElementById('center');
    const startBtn = document.getElementById('startBtn');
    const faceEl = document.getElementById('face');

    const W = canvas.width, H = canvas.height;

    let bird, pipes, frame, score, running;
    let gravity, flapPower, pipeGap, pipeWidth, pipeInterval;

    function reset(){
      bird = {x:80, y:H/2, vy:0, radius:12};
      pipes = [];
      frame = 0;
      score = 0;
      running = false;

      gravity = 0.3;
      flapPower = -6;
      pipeGap = 140;
      pipeWidth = 60;
      pipeInterval = 110;

      scoreEl.textContent = 'Score: 0';
      centerEl.style.display = 'flex';
      faceEl.style.display = 'none';
    }

    function start(){
      reset();
      running = true;
      centerEl.style.display = 'none';
      loop();
    }

    function gameOver(){
      running = false;
      centerEl.style.display = 'flex';
      startBtn.textContent = 'Restart';
      faceEl.style.display = 'none';
    }

    function flap(){
      if (!running) start();
      bird.vy = flapPower;
    }

    function spawnPipe(){
      const minTop = 50;
      const maxTop = H - pipeGap - 50;
      const topH = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

      pipes.push({
        x: W + 20,
        topH,
        scored:false,
        faceShown:false
      });
    }

    function update(){
      frame++;

      bird.vy += gravity;
      bird.y += bird.vy;

      if (frame % pipeInterval === 0) spawnPipe();

      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 3;

        if (!p.scored && p.x + pipeWidth < bird.x - bird.radius) {
          p.scored = true;
          score++;
          scoreEl.textContent = 'Score: ' + score;
        }

        if (p.x + pipeWidth < -50) pipes.splice(i,1);
      }

      // Face logic (once per pipe)
      for (const p of pipes){
        const pipeCenterX = p.x + pipeWidth / 2;
        const gapCenterY = p.topH + pipeGap / 2;

        if (
          bird.x > p.x &&
          bird.x < p.x + pipeWidth &&
          !p.faceShown
        ) {
          faceEl.style.left = pipeCenterX + 'px';
          faceEl.style.top = gapCenterY + 'px';
          faceEl.style.display = 'block';
          p.faceShown = true;
        }

        if (p.faceShown && p.x + pipeWidth < bird.x - bird.radius) {
          faceEl.style.display = 'none';
        }
      }

      if (bird.y - bird.radius <= 0 || bird.y + bird.radius >= H) {
        gameOver();
      }

      for (const p of pipes){
        const bx = bird.x, by = bird.y;
        const inX = bx + bird.radius > p.x && bx - bird.radius < p.x + pipeWidth;
        if (inX){
          if (by - bird.radius < p.topH || by + bird.radius > p.topH + pipeGap){
            gameOver();
          }
        }
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H);

      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0,0,W,H);

      for (const p of pipes){
        ctx.fillStyle = '#2e8b57';
        ctx.fillRect(p.x, 0, pipeWidth, p.topH);
        ctx.fillRect(p.x, p.topH + pipeGap, pipeWidth, H - (p.topH + pipeGap));

        ctx.fillStyle = '#1f6b45';
        ctx.fillRect(p.x, p.topH - 8, pipeWidth, 8);
        ctx.fillRect(p.x, p.topH + pipeGap, pipeWidth, 8);
      }

      ctx.save();
      ctx.translate(bird.x, bird.y);
      const angle = Math.max(-0.6, Math.min(0.8, bird.vy * 0.06));
      ctx.rotate(angle);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0,0,bird.radius,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(6,-4,2,0,Math.PI*2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0,H-6,W,6);
    }

    function loop(){
      if (!running) return;
      update();
      draw();
      requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', e=>{
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    });

    canvas.addEventListener('click', flap);
    startBtn.addEventListener('click', start);

    reset();
  </script>
</body>
</html>
