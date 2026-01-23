// Sidewalk Sprint - Enhanced Endless Runner

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const distanceEl = document.getElementById('distance');
const coinsEl = document.getElementById('coins');

const ASSETS = {
  // Runner animation frames (4 frames)
  runner1: 'assets/runner_1.webp',
  runner2: 'assets/runner_2.webp',
  runner3: 'assets/runner_3.webp',
  runner4: 'assets/runner_4.webp',
  // Chaser type 1 - bald, black suit (4 frames)
  chaser1_1: 'assets/chaser1_1.webp',
  chaser1_2: 'assets/chaser1_2.webp',
  chaser1_3: 'assets/chaser1_3.webp',
  chaser1_4: 'assets/chaser1_4.webp',
  // Chaser type 2 - black hair, black suit (4 frames)
  chaser2_1: 'assets/chaser2_1.webp',
  chaser2_2: 'assets/chaser2_2.webp',
  chaser2_3: 'assets/chaser2_3.webp',
  chaser2_4: 'assets/chaser2_4.webp',
  // Chaser type 3 - black hair, blue suit (4 frames)
  chaser3_1: 'assets/chaser3_1.webp',
  chaser3_2: 'assets/chaser3_2.webp',
  chaser3_3: 'assets/chaser3_3.webp',
  chaser3_4: 'assets/chaser3_4.webp',
  // Obstacles
  car: 'assets/car.webp',
  low: 'assets/construction_low.webp',
  high: 'assets/construction_high.webp',
  // Power-ups
  coin: 'assets/coin.webp',
  shield: 'assets/shield.webp',
  speed: 'assets/speed.webp',
  // Platforms
  platform: 'assets/platform.webp',
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
  playing: false,
  started: false,
  missteps: [],
  distance: 0,
  coins: 0,
  speed: 420,
  lastTime: 0,
  gravity: 2400,
  groundY: 0,
  skylineShift: 0,
  curbShift: 0,
  reason: '',
  animationFrame: 0,
  animationTimer: 0,
  currentBgIndex: 0,
  bgTransitionDistance: 0,
  shieldActive: false,
  shieldTimer: 0,
  speedBoostActive: false,
  speedBoostTimer: 0,
  comboMultiplier: 1,
  lastCoinTime: 0,
  highScore: parseInt(localStorage.getItem('highScore') || '0'),
  totalCoins: parseInt(localStorage.getItem('totalCoins') || '0')
};

const player = {
  x: 180,
  y: 0,
  w: 70,
  h: 110,
  vy: 0,
  slideTimer: 0,
  slideDuration: 450,
  crouching: false,
  onPlatform: false,
  currentPlatform: null,
  jumpCount: 0,
  maxJumps: 2 // Double jump
};

const chasers = new Array(3).fill(0).map((_, i) => ({
  offset: -110 - i * 45,
  bob: 0,
  type: (i % 3) + 1,
  y: 0,
  targetY: 0,
  vy: 0
}));

const obstacles = [];
const platforms = [];
const powerups = [];
let spawnTimer = 0;
let platformSpawnTimer = 0;
let powerupSpawnTimer = 0;

function reset() {
  state.playing = true;
  state.started = true;
  state.missteps = [];
  state.distance = 0;
  state.coins = 0;
  state.speed = 420;
  state.lastTime = 0;
  state.skylineShift = 0;
  state.curbShift = 0;
  state.reason = '';
  state.animationFrame = 0;
  state.animationTimer = 0;
  state.currentBgIndex = 0;
  state.bgTransitionDistance = 0;
  state.shieldActive = false;
  state.shieldTimer = 0;
  state.speedBoostActive = false;
  state.speedBoostTimer = 0;
  state.comboMultiplier = 1;
  state.lastCoinTime = 0;
  
  player.y = state.groundY - player.h;
  player.vy = 0;
  player.slideTimer = 0;
  player.crouching = false;
  player.onPlatform = false;
  player.currentPlatform = null;
  player.jumpCount = 0;
  
  chasers.forEach((c, i) => {
    c.y = state.groundY - player.h;
    c.targetY = c.y;
    c.vy = 0;
  });
  
  obstacles.length = 0;
  platforms.length = 0;
  powerups.length = 0;
  spawnTimer = 0;
  platformSpawnTimer = 2000;
  powerupSpawnTimer = 3000;
  
  updateHUD();
}

function spawnObstacle() {
  const types = [
    { key: 'car', w: 160, h: 80, hard: true },
    { key: 'low', w: 120, h: 60, hard: false },
    { key: 'high', w: 120, h: 100, hard: false }
  ];
  const pick = types[Math.floor(Math.random() * types.length)];
  const baseY = state.groundY - pick.h;
  obstacles.push({
    x: canvas.width + 50,
    y: baseY,
    w: pick.w,
    h: pick.h,
    type: pick.key,
    hard: pick.hard,
    hit: false
  });
}

function spawnPlatform() {
  const heights = [120, 180, 240];
  const height = heights[Math.floor(Math.random() * heights.length)];
  const width = 150 + Math.random() * 100;
  platforms.push({
    x: canvas.width + 50,
    y: state.groundY - height,
    w: width,
    h: 30
  });
}

function spawnPowerup() {
  const types = ['coin', 'coin', 'coin', 'shield', 'speed']; // More coins
  const type = types[Math.floor(Math.random() * types.length)];
  const onPlatform = Math.random() > 0.5 && platforms.length > 0;
  let y = state.groundY - 100 - Math.random() * 150;
  
  if (onPlatform) {
    const platform = platforms[platforms.length - 1];
    if (platform && platform.x > canvas.width * 0.5) {
      y = platform.y - 50;
    }
  }
  
  powerups.push({
    x: canvas.width + 50,
    y: y,
    w: 40,
    h: 40,
    type: type,
    collected: false
  });
}

function updateMissteps(now) {
  const windowMs = 15000;
  state.missteps = state.missteps.filter((t) => now - t <= windowMs);
  if (state.missteps.length >= 2) {
    endGame('Caught by the suits!');
  }
}

function endGame(reason) {
  state.playing = false;
  state.reason = reason;
  
  // Update high scores
  if (state.distance > state.highScore) {
    state.highScore = Math.floor(state.distance);
    localStorage.setItem('highScore', state.highScore);
  }
  state.totalCoins += state.coins;
  localStorage.setItem('totalCoins', state.totalCoins);
}

function handleInputDown(key) {
  if (!state.started && (key === ' ' || key === 'arrowup' || key === 'r')) {
    reset();
    return;
  }
  if (!state.playing && key === 'r') {
    reset();
    return;
  }
  if (!state.playing) return;
  
  if ((key === ' ' || key === 'arrowup' || key === 'w') && canJump()) {
    jump();
  }
  if ((key === 'arrowdown' || key === 's') && onGround()) {
    player.crouching = true;
  }
  if (key === 's' && onGround() && !player.crouching) {
    slide();
  }
}

function handleInputUp(key) {
  if (key === 'arrowdown' || key === 's') {
    player.crouching = false;
  }
}

function onGround() {
  return player.y >= state.groundY - player.h - 1;
}

function canJump() {
  return player.jumpCount < player.maxJumps;
}

function jump() {
  player.vy = player.jumpCount === 0 ? -900 : -750;
  player.jumpCount++;
  player.onPlatform = false;
  player.currentPlatform = null;
}

function slide() {
  player.slideTimer = player.slideDuration;
}

function updatePlayer(dt) {
  // Apply gravity
  player.vy += state.gravity * dt;
  player.y += player.vy * dt;
  
  // Check platform collisions
  player.onPlatform = false;
  for (const plat of platforms) {
    if (isOnTopOf(player, plat)) {
      player.y = plat.y - player.h;
      player.vy = 0;
      player.onPlatform = true;
      player.currentPlatform = plat;
      player.jumpCount = 0;
      break;
    }
  }
  
  // Ground collision
  if (player.y > state.groundY - player.h) {
    player.y = state.groundY - player.h;
    player.vy = 0;
    player.jumpCount = 0;
    player.onPlatform = false;
    player.currentPlatform = null;
  }
  
  if (player.slideTimer > 0) {
    player.slideTimer -= dt * 1000;
  }
  
  // Update power-up timers
  if (state.shieldTimer > 0) {
    state.shieldTimer -= dt * 1000;
    if (state.shieldTimer <= 0) {
      state.shieldActive = false;
    }
  }
  if (state.speedBoostTimer > 0) {
    state.speedBoostTimer -= dt * 1000;
    if (state.speedBoostTimer <= 0) {
      state.speedBoostActive = false;
    }
  }
  
  // Combo decay
  if (Date.now() - state.lastCoinTime > 2000) {
    state.comboMultiplier = Math.max(1, state.comboMultiplier - dt);
  }
}

function isOnTopOf(entity, platform) {
  const wasAbove = entity.y + entity.h - entity.vy * 0.016 <= platform.y + 5;
  const isNowBelow = entity.y + entity.h >= platform.y;
  const withinX = entity.x + entity.w > platform.x && entity.x < platform.x + platform.w;
  const fallingDown = entity.vy >= 0;
  
  return wasAbove && isNowBelow && withinX && fallingDown && 
         entity.y + entity.h <= platform.y + platform.h * 0.5;
}

function updateChasers(dt) {
  chasers.forEach((c, i) => {
    // Chasers follow player's vertical position with delay
    c.targetY = player.y;
    
    const diff = c.targetY - c.y;
    const followDelay = 0.15 + i * 0.08; // Staggered follow
    
    if (Math.abs(diff) > 5) {
      c.vy += (diff > 0 ? 1 : -1) * state.gravity * dt * followDelay;
    }
    
    c.vy *= 0.95; // Damping
    c.y += c.vy * dt;
    
    // Don't let chasers go below ground
    if (c.y > state.groundY - player.h) {
      c.y = state.groundY - player.h;
      c.vy = 0;
    }
  });
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
  const speed = (state.speedBoostActive ? state.speed * 1.5 : state.speed) * dt;
  
  obstacles.forEach((o) => { o.x -= speed; });
  platforms.forEach((p) => { p.x -= speed; });
  powerups.forEach((p) => { p.x -= speed; });
  
  // Remove off-screen objects
  while (obstacles.length && obstacles[0].x + obstacles[0].w < -40) {
    obstacles.shift();
  }
  while (platforms.length && platforms[0].x + platforms[0].w < -40) {
    if (player.currentPlatform === platforms[0]) {
      player.onPlatform = false;
      player.currentPlatform = null;
    }
    platforms.shift();
  }
  while (powerups.length && powerups[0].x + powerups[0].w < -40) {
    powerups.shift();
  }
  
  // Spawn new obstacles
  spawnTimer -= dt * 1000;
  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = 1200 + Math.random() * 1000;
  }
  
  // Spawn platforms
  platformSpawnTimer -= dt * 1000;
  if (platformSpawnTimer <= 0) {
    spawnPlatform();
    platformSpawnTimer = 2500 + Math.random() * 2000;
  }
  
  // Spawn power-ups
  powerupSpawnTimer -= dt * 1000;
  if (powerupSpawnTimer <= 0) {
    spawnPowerup();
    powerupSpawnTimer = 1500 + Math.random() * 2000;
  }
}

function checkCollisions(now) {
  const p = currentPlayerBox();
  
  // Check obstacles with improved collision (landing on top is safe)
  for (const o of obstacles) {
    if (o.hit) continue;
    
    // Check if colliding
    if (p.x < o.x + o.w && p.x + p.w > o.x && p.y < o.y + o.h && p.y + p.h > o.y) {
      // Check if landing on top (safe)
      const landingOnTop = player.vy > 0 && 
                           p.y + p.h - player.vy * 0.016 <= o.y + 10 &&
                           p.y + p.h >= o.y;
      
      if (landingOnTop) {
        // Safe landing on top - bounce off
        player.y = o.y - player.h;
        player.vy = -400;
        player.jumpCount = 0;
        continue;
      }
      
      // Side collision
      if (state.shieldActive) {
        state.shieldActive = false;
        state.shieldTimer = 0;
        o.hit = true;
        continue;
      }
      
      if (o.hard) {
        endGame('Crashed into traffic!');
      } else {
        state.missteps.push(now);
        updateMissteps(now);
        o.hit = true;
      }
      break;
    }
  }
  
  // Check power-ups
  for (const pu of powerups) {
    if (pu.collected) continue;
    
    if (p.x < pu.x + pu.w && p.x + p.w > pu.x && p.y < pu.y + pu.h && p.y + p.h > pu.y) {
      pu.collected = true;
      
      if (pu.type === 'coin') {
        const timeSinceLast = Date.now() - state.lastCoinTime;
        if (timeSinceLast < 1000) {
          state.comboMultiplier = Math.min(5, state.comboMultiplier + 0.5);
        }
        state.coins += Math.floor(1 * state.comboMultiplier);
        state.lastCoinTime = Date.now();
      } else if (pu.type === 'shield') {
        state.shieldActive = true;
        state.shieldTimer = 8000;
      } else if (pu.type === 'speed') {
        state.speedBoostActive = true;
        state.speedBoostTimer = 5000;
      }
      
      updateHUD();
    }
  }
}

function updateDistance(dt) {
  const speedMod = state.speedBoostActive ? 1.5 : 1;
  state.distance += (state.speed * speedMod * dt) / 5;
  
  // Update animation frame
  state.animationTimer += dt * 1000;
  const frameSpeed = state.speedBoostActive ? 60 : 100;
  if (state.animationTimer >= frameSpeed) {
    state.animationFrame = (state.animationFrame + 1) % 4;
    state.animationTimer = 0;
  }
  
  // Transition backgrounds every 1500m (less frequent)
  const bgInterval = 1500;
  const newBgIndex = Math.floor(state.distance / bgInterval) % 6;
  if (newBgIndex !== state.currentBgIndex) {
    state.currentBgIndex = newBgIndex;
  }
  
  updateHUD();
}

function updateHUD() {
  distanceEl.textContent = `${Math.floor(state.distance)}m`;
  coinsEl.textContent = `${state.coins}`;
}

function drawBackground() {
  const skylineSpeed = state.speed * 0.2;
  const curbSpeed = state.speed * 0.6;
  state.skylineShift = (state.skylineShift + skylineSpeed * 0.016) % canvas.width;
  state.curbShift = (state.curbShift + curbSpeed * 0.016) % canvas.width;

  const bgNames = ['bgSuburb', 'bgCity', 'bgPark', 'bgIndustrial', 'bgDowntown', 'bgWaterfront'];
  const skyBgName = bgNames[state.currentBgIndex];
  const midBgName = bgNames[(state.currentBgIndex + 1) % 6];
  
  const bgSky = images[skyBgName];
  const bgSub = images[midBgName];
  const groundY = state.groundY + 60;

  // Dark background
  ctx.fillStyle = '#0d1322';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Parallax backgrounds
  if (bgSky) {
    const scale = canvas.height / 400 * 0.8;
    drawTiled(bgSky, state.skylineShift * 0.3, canvas.height - bgSky.height * scale - 180, scale);
  }
  if (bgSub) {
    const scale = canvas.height / 400 * 0.6;
    drawTiled(bgSub, state.skylineShift * 0.6, canvas.height - bgSub.height * scale - 100, scale);
  }

  // Road/sidewalk
  ctx.fillStyle = '#1c2639';
  ctx.fillRect(0, groundY - 40, canvas.width, 120);
  ctx.fillStyle = '#222c42';
  ctx.fillRect(0, groundY + 80, canvas.width, canvas.height - groundY - 80);
  ctx.fillStyle = '#a0b3d4';
  ctx.fillRect(0, groundY + 30, canvas.width, 4);

  // Moving lane lines
  const laneGap = 90;
  for (let x = -state.curbShift % (laneGap + 40); x < canvas.width; x += laneGap + 40) {
    ctx.fillStyle = '#d6deed';
    ctx.fillRect(x, groundY + 55, 40, 6);
  }
}

function drawTiled(img, shift, y, scale = 1) {
  const w = img.width * scale;
  const h = img.height * scale;
  const start = -((shift % w) + w);
  for (let x = start; x < canvas.width + w; x += w) {
    ctx.drawImage(img, x, y, w, h);
  }
}

function drawPlatforms() {
  const img = images.platform;
  for (const plat of platforms) {
    if (img) {
      ctx.drawImage(img, plat.x, plat.y, plat.w, plat.h);
    } else {
      ctx.fillStyle = '#555';
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    }
  }
}

function drawPowerups() {
  for (const pu of powerups) {
    if (pu.collected) continue;
    
    const img = images[pu.type];
    const bob = Math.sin(Date.now() / 200) * 5;
    
    if (img) {
      ctx.drawImage(img, pu.x, pu.y + bob, pu.w, pu.h);
    } else {
      ctx.fillStyle = pu.type === 'coin' ? '#FFD700' : pu.type === 'shield' ? '#4488FF' : '#FF4444';
      ctx.beginPath();
      ctx.arc(pu.x + pu.w / 2, pu.y + pu.h / 2 + bob, pu.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPlayer() {
  const box = currentPlayerBox();
  const frameNum = state.animationFrame + 1;
  const img = images[`runner${frameNum}`];
  
  // Draw shield effect
  if (state.shieldActive) {
    ctx.strokeStyle = 'rgba(68, 136, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(box.x + box.w / 2, box.y + box.h / 2, box.w * 0.8, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Draw speed lines
  if (state.speedBoostActive) {
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const lineY = box.y + 20 + i * 20;
      ctx.beginPath();
      ctx.moveTo(box.x - 30 - i * 10, lineY);
      ctx.lineTo(box.x - 60 - i * 15, lineY);
      ctx.stroke();
    }
  }
  
  if (img) {
    ctx.drawImage(img, box.x - 15, box.y - 10, box.w + 30, box.h + 20);
  } else {
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(box.x, box.y, box.w, box.h);
  }
}

function drawChasers(t) {
  chasers.forEach((c, i) => {
    c.bob = Math.sin((t / 200 + i) * 0.6) * 4;
    const x = player.x + c.offset;
    const y = c.y + c.bob;
    const frameNum = state.animationFrame + 1;
    const img = images[`chaser${c.type}_${frameNum}`];
    
    if (img) {
      ctx.drawImage(img, x - 10, y - 5, player.w + 20, player.h + 15);
    } else {
      ctx.fillStyle = c.type === 3 ? '#223366' : '#111';
      ctx.fillRect(x, y, player.w, player.h);
    }
  });
}

function drawObstacles() {
  obstacles.forEach((o) => {
    if (o.hit) return;
    
    const sprite = o.type === 'car' ? images.car : o.type === 'low' ? images.low : images.high;
    if (sprite) {
      ctx.drawImage(sprite, o.x, o.y, o.w, o.h);
    } else {
      ctx.fillStyle = o.hard ? '#e74c3c' : '#FF6600';
      ctx.fillRect(o.x, o.y, o.w, o.h);
    }
  });
}

function drawStartScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = '#ffd166';
  ctx.font = `bold ${canvas.width * 0.06}px "Archivo Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('SIDEWALK SPRINT', canvas.width / 2, canvas.height * 0.3);
  
  // Instructions
  ctx.font = `${canvas.width * 0.025}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = '#e7ecf5';
  ctx.fillText('Run from the suits! Collect coins! Stay alive!', canvas.width / 2, canvas.height * 0.42);
  
  // Controls
  ctx.font = `${canvas.width * 0.02}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = '#9fb1c7';
  ctx.fillText('SPACE / ↑ / W - Jump (Double Jump available!)', canvas.width / 2, canvas.height * 0.55);
  ctx.fillText('↓ / S - Crouch/Slide', canvas.width / 2, canvas.height * 0.60);
  ctx.fillText('Land on obstacles to bounce!', canvas.width / 2, canvas.height * 0.65);
  
  // High score
  if (state.highScore > 0) {
    ctx.fillStyle = '#8ef0ff';
    ctx.fillText(`High Score: ${state.highScore}m | Total Coins: ${state.totalCoins}`, canvas.width / 2, canvas.height * 0.75);
  }
  
  // Start prompt
  ctx.fillStyle = '#ffd166';
  ctx.font = `bold ${canvas.width * 0.03}px "Space Grotesk", sans-serif`;
  const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.8;
  ctx.globalAlpha = pulse;
  ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height * 0.88);
  ctx.globalAlpha = 1;
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#e74c3c';
  ctx.font = `bold ${canvas.width * 0.05}px "Archivo Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(state.reason || 'CAUGHT!', canvas.width / 2, canvas.height * 0.35);
  
  ctx.fillStyle = '#e7ecf5';
  ctx.font = `${canvas.width * 0.03}px "Space Grotesk", sans-serif`;
  ctx.fillText(`Distance: ${Math.floor(state.distance)}m`, canvas.width / 2, canvas.height * 0.48);
  ctx.fillText(`Coins: ${state.coins}`, canvas.width / 2, canvas.height * 0.55);
  
  if (Math.floor(state.distance) >= state.highScore && state.distance > 0) {
    ctx.fillStyle = '#ffd166';
    ctx.fillText('🏆 NEW HIGH SCORE! 🏆', canvas.width / 2, canvas.height * 0.65);
  }
  
  ctx.fillStyle = '#8ef0ff';
  ctx.font = `bold ${canvas.width * 0.025}px "Space Grotesk", sans-serif`;
  ctx.fillText('Press R to Run Again', canvas.width / 2, canvas.height * 0.80);
}

function loop(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.033);
  state.lastTime = timestamp;

  if (state.playing) {
    updatePlayer(dt);
    updateChasers(dt);
    updateObstacles(dt);
    checkCollisions(timestamp);
    updateDistance(dt);
    state.speed = Math.min(state.speed + dt * 12, 750);
  }

  drawBackground();
  drawPlatforms();
  drawPowerups();
  drawObstacles();
  drawPlayer();
  drawChasers(timestamp);

  if (!state.started) {
    drawStartScreen();
  } else if (!state.playing) {
    drawGameOver();
  }

  requestAnimationFrame(loop);
}

function resize() {
  // Full screen canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  state.groundY = canvas.height - 100;
  
  // Reposition player
  player.x = canvas.width * 0.15;
  if (player.y > state.groundY - player.h) {
    player.y = state.groundY - player.h;
  }
}

window.addEventListener('resize', resize);

window.addEventListener('keydown', (e) => {
  if ([' ', 'ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) {
    e.preventDefault();
  }
  handleInputDown(e.key.toLowerCase());
});

window.addEventListener('keyup', (e) => {
  handleInputUp(e.key.toLowerCase());
});

// Touch controls for mobile
let touchStartY = 0;
canvas.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  if (!state.started || !state.playing) {
    if (!state.started) reset();
    else if (!state.playing) reset();
    return;
  }
  if (canJump()) jump();
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
  const touchY = e.touches[0].clientY;
  if (touchY - touchStartY > 50 && onGround()) {
    player.crouching = true;
  }
}, { passive: true });

canvas.addEventListener('touchend', () => {
  player.crouching = false;
}, { passive: true });

resize();
loadAssets().then(() => requestAnimationFrame(loop));
