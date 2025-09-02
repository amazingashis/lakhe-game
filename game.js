const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');


// Game objects
const kid = { x: 100, y: 200, width: 40, height: 40, speed: 4, frame: 0 };
const lakhe = { x: 500, y: 200, width: 48, height: 48, speed: 2.7, frame: 0 };
let keys = {};
let gameOver = false;
let startTime = null;
let elapsed = 0;

// Asset loading
const kidImg = new Image();
kidImg.src = 'assets/kid.png';
const lakheImg = new Image();
lakheImg.src = 'assets/lakhe.png';
const bgImg = new Image();
bgImg.src = 'assets/bg-temple.png';

// Sound loading
const runSound = new Audio('assets/run.mp3');
const gameOverSound = new Audio('assets/gameover.mp3');
runSound.loop = true;

// Background animation
let bgX = 0;
const bgSpeed = 2;

function drawBackground() {
  // Animate background for endless runner effect
  bgX -= bgSpeed;
  if (bgX <= -canvas.width) bgX = 0;
  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);
}

function drawKid() {
  // Animate kid sprite (if sprite sheet, use frame; else just draw)
  ctx.drawImage(kidImg, kid.x - kid.width/2, kid.y - kid.height/2, kid.width, kid.height);
}

function drawLakhe() {
  // Animate Lakhe sprite (if sprite sheet, use frame; else just draw)
  ctx.drawImage(lakheImg, lakhe.x - lakhe.width/2, lakhe.y - lakhe.height/2, lakhe.width, lakhe.height);
}


function moveKid() {
  if (keys['ArrowUp'] && kid.y - kid.height/2 > 0) kid.y -= kid.speed;
  if (keys['ArrowDown'] && kid.y + kid.height/2 < canvas.height) kid.y += kid.speed;
  if (keys['ArrowLeft'] && kid.x - kid.width/2 > 0) kid.x -= kid.speed;
  if (keys['ArrowRight'] && kid.x + kid.width/2 < canvas.width) kid.x += kid.speed;
}

function moveLakhe() {
  // Simple chase logic
  let dx = kid.x - lakhe.x;
  let dy = kid.y - lakhe.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > 1) {
    lakhe.x += (dx/dist) * lakhe.speed;
    lakhe.y += (dy/dist) * lakhe.speed;
  }
  // Animate Lakhe frame (if using sprite sheet)
  lakhe.frame = (lakhe.frame + 1) % 4;
}

function checkCollision() {
  let dx = kid.x - lakhe.x;
  let dy = kid.y - lakhe.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  return dist < (kid.width/2 + lakhe.width/2 - 4);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawKid();
  drawLakhe();
}

function update() {
  if (gameOver) return;
  moveKid();
  moveLakhe();
  if (checkCollision()) {
    gameOver = true;
    runSound.pause();
    runSound.currentTime = 0;
    gameOverSound.play();
    gameOverDiv.style.display = 'block';
    gameOverDiv.textContent = `Game Over! You survived ${elapsed}s.`;
  }
}

function gameLoop(timestamp) {
  if (!startTime) {
    startTime = timestamp;
    runSound.play();
  }
  elapsed = Math.floor((timestamp - startTime) / 1000);
  scoreDiv.textContent = `Time: ${elapsed}s`;
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });


function resetGame() {
  kid.x = 100; kid.y = 200;
  lakhe.x = 500; lakhe.y = 200;
  gameOver = false;
  startTime = null;
  elapsed = 0;
  bgX = 0;
  gameOverDiv.style.display = 'none';
  runSound.currentTime = 0;
  gameOverSound.pause();
  gameOverSound.currentTime = 0;
  requestAnimationFrame(gameLoop);
}

gameOverDiv.addEventListener('click', resetGame);


// Wait for all images to load before starting
let assetsLoaded = 0;
const totalAssets = 3;
function checkAssetsLoaded() {
  assetsLoaded++;
  if (assetsLoaded === totalAssets) {
    requestAnimationFrame(gameLoop);
  }
}
kidImg.onload = checkAssetsLoaded;
lakheImg.onload = checkAssetsLoaded;
bgImg.onload = checkAssetsLoaded;
