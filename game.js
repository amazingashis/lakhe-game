const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');

const kid = { x: 100, y: 200, size: 32, speed: 4 };
const lakhe = { x: 500, y: 200, size: 40, speed: 2.5 };
let keys = {};
let gameOver = false;
let startTime = null;
let elapsed = 0;

function drawKid() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(kid.x, kid.y, kid.size/2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd700'; // yellow face
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(kid.x, kid.y+8, 8, 0, Math.PI, false); // smile
  ctx.strokeStyle = '#333';
  ctx.stroke();
  ctx.restore();
}

function drawLakhe() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(lakhe.x, lakhe.y, lakhe.size/2, 0, Math.PI * 2);
  ctx.fillStyle = '#d32f2f'; // red face
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Eyes
  ctx.beginPath();
  ctx.arc(lakhe.x-8, lakhe.y-6, 5, 0, Math.PI*2);
  ctx.arc(lakhe.x+8, lakhe.y-6, 5, 0, Math.PI*2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(lakhe.x-8, lakhe.y-6, 2, 0, Math.PI*2);
  ctx.arc(lakhe.x+8, lakhe.y-6, 2, 0, Math.PI*2);
  ctx.fillStyle = '#000';
  ctx.fill();
  // Fangs
  ctx.beginPath();
  ctx.moveTo(lakhe.x-6, lakhe.y+12);
  ctx.lineTo(lakhe.x-8, lakhe.y+20);
  ctx.lineTo(lakhe.x-4, lakhe.y+12);
  ctx.moveTo(lakhe.x+6, lakhe.y+12);
  ctx.lineTo(lakhe.x+8, lakhe.y+20);
  ctx.lineTo(lakhe.x+4, lakhe.y+12);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function moveKid() {
  if (keys['ArrowUp'] && kid.y - kid.size/2 > 0) kid.y -= kid.speed;
  if (keys['ArrowDown'] && kid.y + kid.size/2 < canvas.height) kid.y += kid.speed;
  if (keys['ArrowLeft'] && kid.x - kid.size/2 > 0) kid.x -= kid.speed;
  if (keys['ArrowRight'] && kid.x + kid.size/2 < canvas.width) kid.x += kid.speed;
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
}

function checkCollision() {
  let dx = kid.x - lakhe.x;
  let dy = kid.y - lakhe.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  return dist < (kid.size/2 + lakhe.size/2 - 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawKid();
  drawLakhe();
}

function update() {
  if (gameOver) return;
  moveKid();
  moveLakhe();
  if (checkCollision()) {
    gameOver = true;
    gameOverDiv.style.display = 'block';
    gameOverDiv.textContent = `Game Over! You survived ${elapsed}s.`;
  }
}

function gameLoop(timestamp) {
  if (!startTime) startTime = timestamp;
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
  gameOverDiv.style.display = 'none';
  requestAnimationFrame(gameLoop);
}

gameOverDiv.addEventListener('click', resetGame);

// Start the game
requestAnimationFrame(gameLoop);
