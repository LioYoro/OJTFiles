<?php
// Flappy Bird - Game with Power-Ups
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flappy Bird Power-Ups</title>
<style>
html,body{height:100%;margin:0;display:flex;align-items:center;justify-content:center;background:#87ceeb;font-family:Arial,Helvetica,sans-serif;}
.wrap{width:420px;height:640px;position:relative;border-radius:12px;overflow:hidden;box-shadow:0 14px 35px rgba(0,0,0,.25);}
canvas{display:block;}
.hud{position:absolute;left:12px;top:12px;color:#fff;font-weight:800;font-size:18px;text-shadow:0 2px 6px rgba(0,0,0,.4);z-index:5;}
.menu-btn{position:absolute;right:12px;top:12px;padding:6px 10px;border-radius:8px;font-weight:800;background:#fff;border:none;cursor:pointer;z-index:6;}
.center{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}
.btn{padding:10px 16px;border-radius:10px;border:none;font-weight:800;cursor:pointer;}
#winFace,#loseFace{position:absolute;inset:0;margin:auto;width:60%;height:auto;max-height:40%;display:none;pointer-events:none;z-index:10;object-fit:contain;}
</style>
</head>
<body>
<div class="wrap">
  <canvas id="game" width="420" height="640"></canvas>
  <img id="winFace" src="win.jpg">
  <img id="loseFace" src="lose.jpg">
  <div class="hud">
    Score: <span id="score">0</span> | Best: <span id="best">0</span>
  </div>
  <button class="menu-btn" id="menuBtn">☰</button>
  <div class="center" id="center">
    <button class="btn" id="startBtn">Start</button>
  </div>
</div>

<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const centerEl = document.getElementById('center');
const startBtn = document.getElementById('startBtn');
const menuBtn = document.getElementById('menuBtn');
const winFace = document.getElementById('winFace');
const loseFace = document.getElementById('loseFace');

const W = canvas.width, H = canvas.height;
const GROUND = 40, PIPE_W = 60, CAP_H = 12;

let bird, pipes, frame, score, running, animFrame;
let best = Number(localStorage.getItem('flappy_best')) || 0;
bestEl.textContent = best;

// bird sprite
const birdImg = new Image();
birdImg.src = 'bird.png';
let spriteReady = false;
birdImg.onload = ()=>spriteReady=true;

// power-ups
const powerups = [];
const POWERUP_TYPES = ['star','speed','bomb'];

let invincible = false;
let speedUp = false;
let bombCounter = 0;
let powerTimer = 0;

function reset(){
  bird = {x:80,y:H/2,vy:0,r:12};
  pipes = [];
  frame = 0;
  score = 0;
  animFrame = 0;
  running = false;
  powerups.length = 0;
  invincible = false;
  speedUp = false;
  bombCounter = 0;
  powerTimer = 0;
  scoreEl.textContent = 0;
  centerEl.style.display='flex';
  winFace.style.display='none';
  loseFace.style.display='none';
}

function start(){
  reset();
  running = true;
  centerEl.style.display='none';
  loop();
}

function gameOver(){
  running = false;
  loseFace.style.display='block';
  if(score>best){ best=score; localStorage.setItem('flappy_best',best); bestEl.textContent=best; }
  setTimeout(()=> location.href='index.php?lose=1',700);
}

function showWin(){ winFace.style.display='block'; setTimeout(()=>winFace.style.display='none',350); }
function flap(){ if(!running) start(); bird.vy=-6; }

// Pipes
function spawnPipe(){
  const gap = 140;
  const top = Math.random()*(H-gap-GROUND-120)+60;
  pipes.push({x:W+30,top,gap,scored:false});
}

// Power-ups spawn inside pipe gaps
// Spawn power-ups frequently, in pipe gaps
function spawnPowerup(){
    if(pipes.length===0) return;
    if(powerups.length >= 5) return; // allow more power-ups at once
    const pipe = pipes[Math.floor(Math.random()*pipes.length)];
    const type = POWERUP_TYPES[Math.floor(Math.random()*POWERUP_TYPES.length)];
    const x = pipe.x + PIPE_W + Math.random()*50; // inside pipe gap area
    const y = pipe.top + Math.random()*(pipe.gap-40) + 20;
    powerups.push({x,y,type,active:true});
}

// In update() add frequent spawn
if(frame % 80 === 0){  // every 80 frames (~1.3 seconds)
    if(Math.random()<0.8) spawnPowerup(); // 80% chance
}

// Bomb effect: destroy next N pipes and score points
if(bombCounter>0){
    for(let i=pipes.length-1;i>=0;i--){
        const p=pipes[i];
        if(p.x + PIPE_W < W-10){
            pipes.splice(i,1);
            score++;             // increment score for each pipe destroyed
            scoreEl.textContent = score;
            bombCounter--;
            if(bombCounter===0) break;
        }
    }
}


// Update
function update(){
  frame++;
  bird.vy += 0.35 * (speedUp?1.5:1);
  bird.y += bird.vy;

  if(bird.y-bird.r<0){ bird.y=bird.r; bird.vy=0; }
  if(bird.y+bird.r>H-GROUND && !invincible) gameOver();

  // spawn pipes and power-ups
  if(frame % 110 === 0){ 
    spawnPipe(); 
    if(Math.random()<0.5) spawnPowerup(); // 50% chance per pipe
  }

  // Pipes movement & scoring
  for(let i=pipes.length-1;i>=0;i--){
    const p=pipes[i];
    p.x -= 3 * (speedUp?1.5:1);

    if(!p.scored && p.x+PIPE_W<bird.x){
      p.scored=true;
      score++;
      scoreEl.textContent=score;
      showWin();
    }

    // Bomb effect
    if(bombCounter>0 && p.x+PIPE_W < W-10){
      pipes.splice(i,1);
      bombCounter--;
      continue;
    }

    if(p.x<-80) pipes.splice(i,1);
  }

  // Collision with pipes
  for(const p of pipes){
    const inX = bird.x+bird.r>p.x && bird.x-bird.r<p.x+PIPE_W;
    if(inX && !invincible && bombCounter===0){
      if(bird.y-bird.r<p.top || bird.y+bird.r>p.top+p.gap){ gameOver(); }
    }
  }

  // Power-ups movement & collision
  for(const pu of powerups){
      if(!pu.active) continue;
      pu.x -= 3 * (speedUp?1.5:1);

      const dx = bird.x - pu.x;
      const dy = bird.y - pu.y;
      if(Math.sqrt(dx*dx + dy*dy) < bird.r + 10){
          pu.active = false;
          if(pu.type==='star'){ invincible = true; powerTimer=180; }
          if(pu.type==='speed'){ speedUp = true; powerTimer=180; }
          if(pu.type==='bomb'){ bombCounter = [3,5,10][Math.floor(Math.random()*3)]; }
      }

      if(pu.x < -20) pu.active = false;
  }

  // Power-up timer
  if(powerTimer>0){ 
    powerTimer--; 
    if(powerTimer===0){ invincible=false; speedUp=false; } 
  }

  if(frame%5===0) animFrame=(animFrame+1)%3;
}

// Draw functions
function drawPipe(x,y,h){
  const grad = ctx.createLinearGradient(x,0,x+PIPE_W,0);
  grad.addColorStop(0,'#3cb371');
  grad.addColorStop(1,'#2e8b57');
  ctx.fillStyle=grad;
  ctx.fillRect(x,y,PIPE_W,h);
  ctx.fillStyle='#1f6b45';
  ctx.fillRect(x-3, y+(y===0?h-CAP_H:0), PIPE_W+6, CAP_H);
}

function drawPowerup(pu){
  ctx.fillStyle = pu.type==='star'?'gold':pu.type==='speed'?'cyan':'red';
  ctx.beginPath();
  ctx.arc(pu.x, pu.y, 8, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle='#fff';
  ctx.stroke();
}

function draw(){
  ctx.fillStyle='#70c5ce';
  ctx.fillRect(0,0,W,H);

  // Pipes
  for(const p of pipes){ drawPipe(p.x,0,p.top); drawPipe(p.x,p.top+p.gap,H); }

  // Power-ups
  for(const pu of powerups){ if(pu.active) drawPowerup(pu); }

  // Bird
  ctx.save();
  ctx.translate(bird.x,bird.y);
  ctx.rotate(Math.max(-0.7,Math.min(1.2,bird.vy*0.08)));
  if(spriteReady){
    const sw=birdImg.width/3, sh=birdImg.height;
    ctx.drawImage(birdImg,sw*animFrame,0,sw,sh,-17,-12,34,24);
  }else{
    ctx.fillStyle='#ffd166';
    ctx.beginPath();
    ctx.arc(0,0,bird.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  // Ground
  ctx.fillStyle='#ded895';
  ctx.fillRect(0,H-GROUND,W,GROUND);
  ctx.fillStyle='#c9be6a';
  ctx.fillRect(0,H-GROUND,W,6);

  // Active power-up overlay
  if(invincible) ctx.fillStyle='rgba(255,255,0,0.2)';
  else if(speedUp) ctx.fillStyle='rgba(0,255,255,0.2)';
  if(invincible || speedUp) ctx.fillRect(0,0,W,H);
}

// Loop
function loop(){
  if(!running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

// Events
menuBtn.onclick = ()=>{ running=false; location.href='index.php'; };
window.addEventListener('keydown', e=>{ if(e.code==='Space'){ e.preventDefault(); flap(); }});
canvas.addEventListener('click',flap);
startBtn.addEventListener('click',start);

reset();
</script>
</body>
</html>
