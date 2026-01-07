<?php
session_start();
if(!isset($_SESSION['player_name'])){
    header('Location: index.php');
    exit;
}
$name = $_SESSION['player_name'];
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flappy Bird</title>

<style>
html,body{height:100%;margin:0;display:flex;align-items:center;justify-content:center;background:#87ceeb;font-family:Arial,sans-serif}
.wrap{width:420px;height:640px;position:relative;border-radius:12px;overflow:hidden;box-shadow:0 14px 35px rgba(0,0,0,.25);}
canvas{display:block;}
.hud{position:absolute;left:12px;top:12px;color:#fff;font-weight:800;font-size:18px;text-shadow:0 2px 6px rgba(0,0,0,.4);z-index:5;}
.menu-btn{position:absolute;right:12px;top:12px;padding:6px 10px;border-radius:8px;font-weight:800;background:#fff;border:none;cursor:pointer;z-index:6;}
#winFace, #loseFace {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100%;       /* reduce width */
  height: auto;     /* keep aspect ratio */
  max-height: 40%;  /* limit max height */
  display: none;
  pointer-events: none;
  z-index: 10;
  object-fit: contain;
  opacity: 1;    /* optional for lose face overlay */
}
</style>
</head>
<body>
<div class="wrap">
<canvas id="game" width="420" height="640"></canvas>
<img id="winFace" src="win.jpg">
<img id="loseFace" src="lose.jpg">

<div class="hud">
Score: <span id="score">0</span><br>
Best: <span id="best">0</span>
</div>

<button class="menu-btn" id="menuBtn">☰</button>
</div>

<script>
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score');
const bestEl=document.getElementById('best');
const winFace=document.getElementById('winFace');
const loseFace=document.getElementById('loseFace');
const menuBtn=document.getElementById('menuBtn');

const W=canvas.width,H=canvas.height,GROUND=40,PIPE_W=60;
let bird,pipes,frame,score,running,animFrame;
let best=Number(localStorage.getItem('flappy_best'))||0;
bestEl.textContent=best;
const name="<?=htmlspecialchars($name)?>";

const birdImg=new Image();
birdImg.src='bird.png';
let spriteReady=false;
birdImg.onload=()=>spriteReady=true;

/* ===== GAME STATE ===== */
function reset(){bird={x:80,y:H/2,vy:0,r:12};pipes=[];frame=0;score=0;animFrame=0;running=false;scoreEl.textContent=0;loseFace.style.display='none';}
function start(){reset();running=true;loop();}
function flap(){if(!running) start(); bird.vy=-6;}
function spawnPipe(){const gap=140;const top=Math.random()*(H-gap-GROUND-120)+60;pipes.push({x:W+30,top,gap,scored:false});}

function update(){
frame++;bird.vy+=0.35;bird.y+=bird.vy;
if(bird.y-bird.r<0){bird.y=bird.r;bird.vy=0;}
if(bird.y+bird.r>H-GROUND) gameOver();
if(frame%110===0) spawnPipe();

for(let i=pipes.length-1;i>=0;i--){const p=pipes[i];p.x-=3;
if(!p.scored && p.x+PIPE_W<bird.x){p.scored=true;score++;scoreEl.textContent=score;showWin();}
if(p.x<-80)pipes.splice(i,1);}

for(const p of pipes){
if(bird.x+bird.r>p.x && bird.x-bird.r<p.x+PIPE_W){
if(bird.y-bird.r<p.top || bird.y+bird.r>p.top+p.gap){gameOver();}}}

if(frame%5===0) animFrame=(animFrame+1)%3;
}

function showWin(){winFace.style.display='block';setTimeout(()=>winFace.style.display='none',350);}
function drawPipe(x,y,h){const grad=ctx.createLinearGradient(x,0,x+PIPE_W,0);grad.addColorStop(0,'#3cb371');grad.addColorStop(1,'#2e8b57');ctx.fillStyle=grad;ctx.fillRect(x,y,PIPE_W,h);ctx.fillStyle='#1f6b45';ctx.fillRect(x-3,y+(y===0?h-12:0),PIPE_W+6,12);}
function draw(){ctx.fillStyle='#70c5ce';ctx.fillRect(0,0,W,H);for(const p of pipes){drawPipe(p.x,0,p.top);drawPipe(p.x,p.top+p.gap,H);}
ctx.save();ctx.translate(bird.x,bird.y);ctx.rotate(Math.max(-0.7,Math.min(1.2,bird.vy*0.08)));
if(spriteReady){const sw=birdImg.width/3,sh=birdImg.height;ctx.drawImage(birdImg,sw*animFrame,0,sw,sh,-17,-12,34,24);}
else{ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(0,0,bird.r,0,Math.PI*2);ctx.fill();}
ctx.restore();
ctx.fillStyle='#ded895';ctx.fillRect(0,H-GROUND,W,GROUND);
ctx.fillStyle='#c9be6a';ctx.fillRect(0,H-GROUND,W,6);
}

function loop(){if(!running) return;update();draw();requestAnimationFrame(loop);}

function gameOver(){
running=false;loseFace.style.display='block';
if(score>best){best=score;localStorage.setItem('flappy_best',best);bestEl.textContent=best;}
setTimeout(()=>{location.href='index.php?lose=1';},700);
}

/* ===== EVENTS ===== */
window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();flap();}});
canvas.addEventListener('click',flap);
menuBtn.onclick=()=>{running=false;location.href='index.php';};

start();
</script>
</body>
</html>
