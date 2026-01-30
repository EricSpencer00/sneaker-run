// Sneaker Run - Enhanced Endless Runner

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const distanceEl = document.getElementById('distance');
const coinsEl = document.getElementById('coins');
const bgm = document.getElementById('bgm');

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
  vy: 0,
  jumpCount: 0,
  maxJumps: 2,
  onGround: true,
  jumpDelay: 0.3 + i * 0.05
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
  
  // Start background music
  bgm.currentTime = 0;
  bgm.play().catch(() => {
    // Autoplay might be blocked by browser, user interaction required
  });
  
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
    c.jumpCount = 0;
    c.onGround = true;
  });
  
  obstacles.length = 0;
  platforms.length = 0;
  powerups.length = 0;
  spawnTimer = 1500; // Start with slight delay
  platformSpawnTimer = 2500;
  powerupSpawnTimer = 2500;
  
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
  const heights = [140, 200, 260];
  const height = heights[Math.floor(Math.random() * heights.length)];
  const width = 160 + Math.random() * 90;
  platforms.push({
    x: canvas.width + 50,
    y: state.groundY - height,
    w: width,
    h: 30
  });
}

function spawnPowerup() {
  const types = ['coin', 'coin', 'coin', 'coin', 'shield', 'speed']; // More coins
  const type = types[Math.floor(Math.random() * types.length)];
  const onPlatform = Math.random() > 0.6 && platforms.length > 0;
  let y = state.groundY - 120 - Math.random() * 120;
  
  if (onPlatform) {
    const platform = platforms[platforms.length - 1];
    if (platform && platform.x > canvas.width * 0.4) {
      y = platform.y - 60;
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
  
  // Stop background music
  bgm.pause();
  
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
  return player.onPlatform || player.y >= state.groundY - player.h - 2;
}

function canJump() {
  return player.jumpCount < player.maxJumps;
}

function jump() {
  // First jump stronger, second jump slightly weaker
  player.vy = player.jumpCount === 0 ? -950 : -800;
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
  
  // Check platform collisions first
  let landedOnPlatform = false;
  player.onPlatform = false;
  
  for (const plat of platforms) {
    if (isOnTopOf(player, plat)) {
      player.y = plat.y - player.h;
      player.vy = 0;
      player.onPlatform = true;
      player.currentPlatform = plat;
      player.jumpCount = 0;
      landedOnPlatform = true;
      break;
    }
  }
  
  // Ground collision (only if not on platform)
  if (!landedOnPlatform && player.y >= state.groundY - player.h) {
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
  if (Date.now() - state.lastCoinTime > 2500) {
    state.comboMultiplier = Math.max(1, state.comboMultiplier - dt * 0.8);
  }
}

function isOnTopOf(entity, platform) {
  const prevY = entity.y - entity.vy * 0.016;
  const wasAbove = prevY + entity.h <= platform.y + 10;
  const isNowOnOrBelow = entity.y + entity.h >= platform.y - 5;
  const withinX = entity.x + entity.w - 10 > platform.x && entity.x + 10 < platform.x + platform.w;
  const fallingDown = entity.vy >= 0;
  const notTooDeep = entity.y + entity.h < platform.y + platform.h;
  
  return wasAbove && isNowOnOrBelow && withinX && fallingDown && notTooDeep;
}

function updateChasers(dt) {
  chasers.forEach((c, i) => {
    // Apply gravity
    c.vy += state.gravity * dt;
    c.y += c.vy * dt;
    
    // Ground collision
    if (c.y >= state.groundY - player.h) {
      c.y = state.groundY - player.h;
      c.vy = 0;
      c.jumpCount = 0;
      c.onGround = true;
    } else {
      c.onGround = false;
    }
    
    // Simplified chaser jumping - jump when player is airborne and they're on ground
    if (!onGround() && c.onGround && c.jumpCount < c.maxJumps) {
      // Delay based on chaser index for staggered effect
      c.jumpDelay -= dt;
      if (c.jumpDelay <= 0) {
        c.vy = -850; // Consistent jump height
        c.jumpCount++;
        c.jumpDelay = 0.2 + i * 0.08; // Reset delay
      }
    }
    
    // Reset delay when player lands
    if (onGround() && c.onGround) {
      c.jumpDelay = 0.2 + i * 0.08;
      c.jumpCount = 0;
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
  
  // Spawn new obstacles with better spacing
  spawnTimer -= dt * 1000;
  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = 1400 + Math.random() * 900;
  }
  
  // Spawn platforms
  platformSpawnTimer -= dt * 1000;
  if (platformSpawnTimer <= 0) {
    spawnPlatform();
    platformSpawnTimer = 2800 + Math.random() * 1800;
  }
  
  // Spawn power-ups
  powerupSpawnTimer -= dt * 1000;
  if (powerupSpawnTimer <= 0) {
    spawnPowerup();
    powerupSpawnTimer = 1800 + Math.random() * 1700;
  }
}

function checkCollisions(now) {
  const p = currentPlayerBox();
  
  // Check obstacles with improved collision (landing on top is safe)
  for (const o of obstacles) {
    if (o.hit) continue;
    
    // Add margin to collision box for better feel
    const margin = 5;
    const colliding = p.x + margin < o.x + o.w && 
                      p.x + p.w - margin > o.x && 
                      p.y + margin < o.y + o.h && 
                      p.y + p.h > o.y;
    
    if (colliding) {
      // Check if landing on top (safe)
      const prevY = player.y - player.vy * 0.016;
      const wasAbove = prevY + player.h <= o.y + 15;
      const landingOnTop = player.vy > 0 && wasAbove && p.y + p.h >= o.y;
      
      if (landingOnTop && o.type !== 'car') {
        // Safe landing on top - bounce off (not on cars)
        player.y = o.y - player.h;
        player.vy = -450;
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
        if (timeSinceLast < 1200) {
          state.comboMultiplier = Math.min(5, state.comboMultiplier + 0.5);
        }
        state.coins += Math.floor(1 * state.comboMultiplier);
        state.lastCoinTime = Date.now();
      } else if (pu.type === 'shield') {
        state.shieldActive = true;
        state.shieldTimer = 7000;
      } else if (pu.type === 'speed') {
        state.speedBoostActive = true;
        state.speedBoostTimer = 6000;
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
  const newBgIndex = Math.floor(state.distance / bgInterval) % 5;
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

  const bgNames = ['bgSuburb', 'bgPark', 'bgIndustrial', 'bgDowntown', 'bgWaterfront'];
  const skyBgName = bgNames[state.currentBgIndex % bgNames.length];
  const midBgName = bgNames[(state.currentBgIndex + 1) % bgNames.length];
  
  const bgSky = images[skyBgName];
  const bgMid = images[midBgName];
  const groundY = state.groundY + 60;

  // Sky gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
  gradient.addColorStop(0, '#1a2332');
  gradient.addColorStop(0.6, '#2a3645');
  gradient.addColorStop(1, '#3a4658');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

  // Parallax backgrounds with better scaling and positioning
  if (bgSky) {
    const scale = Math.max(canvas.width / bgSky.width, canvas.height / bgSky.height) * 0.8;
    const yPos = canvas.height * 0.3;
    ctx.globalAlpha = 0.7;
    drawTiled(bgSky, state.skylineShift * 0.3, yPos, scale);
    ctx.globalAlpha = 1;
  }
  if (bgMid) {
    const scale = Math.max(canvas.width / bgMid.width, canvas.height / bgMid.height) * 0.9;
    const yPos = canvas.height * 0.5;
    ctx.globalAlpha = 0.85;
    drawTiled(bgMid, state.skylineShift * 0.6, yPos, scale);
    ctx.globalAlpha = 1;
  }

  // Road/sidewalk with better colors
  ctx.fillStyle = '#2c3648';
  ctx.fillRect(0, groundY - 40, canvas.width, 120);
  ctx.fillStyle = '#1c2432';
  ctx.fillRect(0, groundY + 80, canvas.width, canvas.height - groundY - 80);
  
  // Road edge line
  ctx.fillStyle = '#8a95a8';
  ctx.fillRect(0, groundY + 30, canvas.width, 3);

  // Moving lane lines with better spacing
  const laneGap = 80;
  const lineWidth = 35;
  for (let x = -state.curbShift % (laneGap + lineWidth + 10); x < canvas.width; x += laneGap + lineWidth + 10) {
    ctx.fillStyle = '#c8d4e5';
    ctx.fillRect(x, groundY + 55, lineWidth, 5);
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
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const lineY = box.y + 15 + i * 18;
      const offset = Math.sin(Date.now() / 100 + i) * 5;
      ctx.beginPath();
      ctx.moveTo(box.x - 25 - i * 8 + offset, lineY);
      ctx.lineTo(box.x - 50 - i * 12 + offset, lineY);
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
  ctx.fillText('SNEAKER RUN', canvas.width / 2, canvas.height * 0.3);
  
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
    state.speed = Math.min(state.speed + dt * 10, 720);
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
