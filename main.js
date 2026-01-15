// Sidewalk Sprint - endless runner skeleton

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const distanceEl = document.getElementById('distance');
const statusEl = document.getElementById('status');

const ASSETS = {
  // Runner animation frames (4 frames)
  runner1: 'assets/runner_1.webp',
  runner2: 'assets/runner_2.webp',
  runner3: 'assets/runner_3.webp',
  runner4: 'assets/runner_4.webp',
  // Chaser type 1 (4 frames)
  chaser1_1: 'assets/chaser1_1.webp',
  chaser1_2: 'assets/chaser1_2.webp',
  chaser1_3: 'assets/chaser1_3.webp',
  chaser1_4: 'assets/chaser1_4.webp',
  // Chaser type 2 (4 frames)
  chaser2_1: 'assets/chaser2_1.webp',
  chaser2_2: 'assets/chaser2_2.webp',
  chaser2_3: 'assets/chaser2_3.webp',
  chaser2_4: 'assets/chaser2_4.webp',
  // Chaser type 3 (4 frames)
  chaser3_1: 'assets/chaser3_1.webp',
  chaser3_2: 'assets/chaser3_2.webp',
  chaser3_3: 'assets/chaser3_3.webp',
  chaser3_4: 'assets/chaser3_4.webp',
  // Obstacles
  car: 'assets/car.webp',
  low: 'assets/construction_low.webp',
  high: 'assets/construction_high.webp',
  // Multiple background areas
  bgSuburb: 'assets/bg_suburb.webp',
  bgCity: 'assets/bg_city.webp',
  bgPark: 'assets/bg_park.webp',
  bgIndustrial: 'assets/bg_industrial.webp',
  bgDowntown: 'assets/bg_downtown.webp',
  bgWaterfront: 'assets/bg_waterfront.webp'
};

const images = {};
function loadImage(key, src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve({ key, img });
    img.onerror = () => resolve({ key, img: null });
  });
}

function loadAssets() {
  const entries = Object.entries(ASSETS);
  return Promise.all(entries.map(([key, src]) => loadImage(key, src))).then((res) => {
    res.forEach(({ key, img }) => { images[key] = img; });
  });
}

// Game state
const state = {
  playing: true,
  missteps: [],
  distance: 0,
  speed: 420, // px per second
  lastTime: 0,
  gravity: 2100,
  groundY: canvas.height - 90,
  skylineShift: 0,
  curbShift: 0,
  reason: '',
  animationFrame: 0,
  animationTimer: 0,
  currentBgIndex: 0,
  bgTransitionDistance: 0
};

const player = {
  x: 180,
  y: 0,
  w: 80,
  h: 120,
  vy: 0,
  slideTimer: 0,
  slideDuration: 450,
  crouching: false,
  color: '#ffd166'
};
player.y = state.groundY - player.h;

const chasers = new Array(3).fill(0).map((_, i) => ({
  offset: -120 - i * 50,
  bob: 0,
  type: (i % 3) + 1 // Cycle through chaser types 1, 2, 3
}));

const obstacles = [];
let spawnTimer = 0;

function reset() {
  state.playing = true;
  state.missteps = [];
  state.distance = 0;
  state.speed = 420;
  state.lastTime = 0;
  state.skylineShift = 0;
  state.curbShift = 0;
  state.reason = '';
  state.animationFrame = 0;
  state.animationTimer = 0;
  state.currentBgIndex = 0;
  state.bgTransitionDistance = 0;
  player.y = state.groundY - player.h;
  player.vy = 0;
  player.slideTimer = 0;
  player.crouching = false;
  obstacles.length = 0;
  spawnTimer = 0;
  statusEl.textContent = 'Stay clean';
}

function spawnObstacle() {
  const types = [
    { key: 'car', w: 160, h: 90, hard: true },
    { key: 'low', w: 140, h: 80, hard: false },
    { key: 'high', w: 140, h: 150, hard: false }
  ];
  const pick = types[Math.floor(Math.random() * types.length)];
  const baseY = state.groundY - pick.h;
  obstacles.push({
    x: canvas.width + 50,
    y: baseY,
    w: pick.w,
    h: pick.h,
    type: pick.key,
    hard: pick.hard
  });
}

function updateMissteps(now) {
  const windowMs = 15000;
  state.missteps = state.missteps.filter((t) => now - t <= windowMs);
  if (state.missteps.length >= 2) {
    endGame('Caught after two slips');
  }
}

function endGame(reason) {
  state.playing = false;
  state.reason = reason;
  statusEl.textContent = reason;
}

function handleInputDown(key) {
  if (!state.playing && key === 'r') {
    reset();
    return;
  }
  if (!state.playing) return;
  if ((key === ' ' || key === 'arrowup') && onGround()) jump();
  if (key === 'arrowdown' && onGround()) {
    player.crouching = true;
  }
  if (key === 's' && onGround()) slide();
}

function handleInputUp(key) {
  if (key === 'arrowdown') {
    player.crouching = false;
  }
}

function onGround() {
  return player.y >= state.groundY - player.h - 1;
}

function jump() {
  player.vy = -980;
}

function slide() {
  player.slideTimer = player.slideDuration;
}

function updatePlayer(dt) {
  player.vy += state.gravity * dt;
  player.y += player.vy * dt;
  if (player.y > state.groundY - player.h) {
    player.y = state.groundY - player.h;
    player.vy = 0;
  }
  if (player.slideTimer > 0) {
    player.slideTimer -= dt * 1000;
  }
}

function currentPlayerBox() {
  const sliding = player.slideTimer > 0;
  const crouching = player.crouching && onGround();
  const heightMod = sliding ? 0.55 : (crouching ? 0.7 : 1.0);
  const h = player.h * heightMod;
  const y = player.y + player.h - h;
  return { x: player.x, y, w: player.w, h };
}

function updateObstacles(dt) {
  const speed = state.speed * dt;
  obstacles.forEach((o) => { o.x -= speed; });
  while (obstacles.length && obstacles[0].x + obstacles[0].w < -40) {
    obstacles.shift();
  }
  spawnTimer -= dt * 1000;
  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = 900 + Math.random() * 900;
  }
}

function checkCollisions(now) {
  const p = currentPlayerBox();
  for (const o of obstacles) {
    if (p.x < o.x + o.w && p.x + p.w > o.x && p.y < o.y + o.h && p.y + p.h > o.y) {
      if (o.hard) {
        endGame('Hard hit – down');
      } else {
        state.missteps.push(now);
        updateMissteps(now);
        statusEl.textContent = 'Slip! Watch it';
        o.x = -9999; // move away to avoid repeat
      }
      break;
    }
  }
}

function updateDistance(dt) {
  state.distance += (state.speed * dt) / 5;
  distanceEl.textContent = `${Math.floor(state.distance)} m`;
  
  // Update animation frame
  state.animationTimer += dt * 1000;
  if (state.animationTimer >= 100) { // Change frame every 100ms
    state.animationFrame = (state.animationFrame + 1) % 4;
    state.animationTimer = 0;
  }
  
  // Transition backgrounds every 500m
  const bgInterval = 500;
  const newBgIndex = Math.floor(state.distance / bgInterval) % 6;
  if (newBgIndex !== state.currentBgIndex) {
    state.currentBgIndex = newBgIndex;
  }
}

function drawBackground() {
  const skylineSpeed = state.speed * 0.2;
  const curbSpeed = state.speed * 0.6;
  state.skylineShift = (state.skylineShift + skylineSpeed * 0.016) % canvas.width;
  state.curbShift = (state.curbShift + curbSpeed * 0.016) % canvas.width;

  // Select background based on current area
  const bgNames = ['bgSuburb', 'bgCity', 'bgPark', 'bgIndustrial', 'bgDowntown', 'bgWaterfront'];
  const skyBgName = bgNames[state.currentBgIndex];
  const midBgName = bgNames[(state.currentBgIndex + 1) % 6];
  
  const bgSky = images[skyBgName];
  const bgSub = images[midBgName];
  const groundY = state.groundY + 60;

  ctx.fillStyle = '#0d1322';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgSky) {
    drawTiled(bgSky, state.skylineShift * 0.5, canvas.height - bgSky.height - 200);
  }
  if (bgSub) {
    drawTiled(bgSub, state.skylineShift, canvas.height - bgSub.height - 120);
  }

  // road/sidewalk bands
  ctx.fillStyle = '#1c2639';
  ctx.fillRect(0, groundY - 40, canvas.width, 120);
  ctx.fillStyle = '#222c42';
  ctx.fillRect(0, groundY + 80, canvas.width, 100);
  ctx.fillStyle = '#a0b3d4';
  ctx.fillRect(0, groundY + 30, canvas.width, 4);

  // moving curb lines
  const laneGap = 90;
  for (let x = -state.curbShift % (laneGap + 40); x < canvas.width; x += laneGap + 40) {
    ctx.fillStyle = '#d6deed';
    ctx.fillRect(x, groundY + 55, 40, 6);
  }
}

function drawTiled(img, shift, y) {
  const w = img.width;
  const start = -((shift % w) + w);
  for (let x = start; x < canvas.width + w; x += w) {
    ctx.drawImage(img, x, y);
  }
}

function drawPlayer() {
  const box = currentPlayerBox();
  const frameNum = state.animationFrame + 1; // 1-4
  const img = images[`runner${frameNum}`];
  if (img) {
    ctx.drawImage(img, box.x - 30, box.y - 20, box.w + 60, box.h + 40);
  } else {
    ctx.fillStyle = player.color;
    ctx.fillRect(box.x, box.y, box.w, box.h);
  }
}

function drawChasers(t) {
  chasers.forEach((c, i) => {
    c.bob = Math.sin((t / 200 + i) * 0.6) * 6;
    const x = player.x + c.offset;
    const y = state.groundY - player.h + c.bob;
    const frameNum = state.animationFrame + 1; // 1-4
    const img = images[`chaser${c.type}_${frameNum}`];
    if (img) {
      ctx.drawImage(img, x - 20, y - 10, player.w + 30, player.h + 20);
    } else {
      ctx.fillStyle = '#9fb1c7';
      ctx.fillRect(x, y, player.w, player.h);
    }
  });
}

function drawObstacles() {
  obstacles.forEach((o) => {
    const sprite = o.type === 'car' ? images.car : o.type === 'low' ? images.low : images.high;
    if (sprite) {
      ctx.drawImage(sprite, o.x, o.y, o.w, o.h);
    } else {
      ctx.fillStyle = o.hard ? '#e74c3c' : '#8ef0ff';
      ctx.fillRect(o.x, o.y, o.w, o.h);
    }
  });
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffd166';
  ctx.font = '42px "Archivo Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.reason || 'Caught', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#e7ecf5';
  ctx.fillText('Press R to run again', canvas.width / 2, canvas.height / 2 + 20);
}

function loop(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.033);
  state.lastTime = timestamp;

  if (state.playing) {
    updatePlayer(dt);
    updateObstacles(dt);
    checkCollisions(timestamp);
    updateDistance(dt);
    state.speed = Math.min(state.speed + dt * 18, 820);
  }

  drawBackground();
  drawObstacles();
  drawPlayer();
  drawChasers(timestamp);

  if (!state.playing) drawGameOver();

  requestAnimationFrame(loop);
}

function resize() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.clientWidth * scale);
  canvas.height = Math.floor((canvas.clientWidth * 9) / 16 * scale);
  state.groundY = canvas.height - 120;
}

window.addEventListener('resize', () => {
  resize();
});

window.addEventListener('keydown', (e) => {
  handleInputDown(e.key.toLowerCase());
});

window.addEventListener('keyup', (e) => {
  handleInputUp(e.key.toLowerCase());
});

resize();
loadAssets().then(() => requestAnimationFrame(loop));
