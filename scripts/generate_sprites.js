const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const ASSETS_DIR = path.join(__dirname, '../assets');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function saveCanvas(canvas, filename) {
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(ASSETS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ ${filename}`);
}

// Enhanced pixel art drawing
function drawPixelArt(pattern, palette, pixelSize = 8) {
    const rows = pattern.length;
    const cols = Math.max(...pattern.map(r => r.length));
    const width = cols * pixelSize;
    const height = rows * pixelSize;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
            const char = pattern[y][x];
            if (char !== ' ' && char !== '.' && palette[char]) {
                ctx.fillStyle = palette[char];
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
    
    return canvas;
}

// ============= PROTAGONIST (Red hair, white shirt, blue jeans, white sneakers) =============
const protagonistPalette = {
    'H': '#CC3333', // Red Hair
    'h': '#AA2222', // Hair shadow
    'S': '#FFDDBB', // Skin
    's': '#EECCAA', // Skin shadow
    'W': '#FFFFFF', // White shirt
    'w': '#DDDDDD', // Shirt shadow/fold
    'J': '#2255AA', // Blue jeans
    'j': '#1A4488', // Jeans shadow
    'K': '#FFFFFF', // White sneakers
    'k': '#CCCCCC', // Sneaker shadow
    'B': '#000000', // Black outlines
    'E': '#442211', // Eyes
    'M': '#CC6666', // Mouth
};

// 16x24 pixel character - more detailed
function createProtagonistFrames() {
    const frames = [];
    
    // Frame 1: Right leg forward
    frames.push([
        "    HHHH    ",
        "   HhHHHH   ",
        "   HHHHH    ",
        "   SSESS    ",
        "   SSMSS    ",
        "    SSS     ",
        "   WWWWW    ",
        "  WwWWWwW   ",
        "  SWWWWWS   ",
        "   WWWWW    ",
        "   JJJJJ    ",
        "   JjJJj    ",
        "  JJ  JJ    ",
        "  Jj   Jj   ",
        " JJ     J   ",
        " KK     K   ",
        " kk     k   ",
    ]);

    // Frame 2: Mid-air / Jump
    frames.push([
        "    HHHH    ",
        "   HhHHHH   ",
        "   HHHHH    ",
        "   SSESS    ",
        "   SSMSS    ",
        "    SSS     ",
        "  SWWWWWS   ",
        " WwWWWWWwW  ",
        "  SWWWWWS   ",
        "   WWWWW    ",
        "   JJJJJ    ",
        "  JJJJJJj   ",
        "  KK  KK    ",
        "  kk  kk    ",
        "            ",
        "            ",
        "            ",
    ]);

    // Frame 3: Left leg forward
    frames.push([
        "    HHHH    ",
        "   HhHHHH   ",
        "   HHHHH    ",
        "   SSESS    ",
        "   SSMSS    ",
        "    SSS     ",
        "   WWWWW    ",
        "  WwWWWwW   ",
        "  SWWWWWS   ",
        "   WWWWW    ",
        "   JJJJJ    ",
        "   jJJJj    ",
        "    JJ  JJ  ",
        "   jJ   jJ  ",
        "   J     JJ ",
        "   K     KK ",
        "   k     kk ",
    ]);

    // Frame 4: Recovery stride
    frames.push([
        "    HHHH    ",
        "   HhHHHH   ",
        "   HHHHH    ",
        "   SSESS    ",
        "   SSMSS    ",
        "    SSS     ",
        "   WWWWW    ",
        "  WwWWWwW   ",
        "  SWWWWWS   ",
        "   WWWWW    ",
        "   JJJJJ    ",
        "   JjJJJj   ",
        "   JJ JJ    ",
        "   jJ jJ    ",
        "   KK KK    ",
        "   kk kk    ",
        "            ",
    ]);

    return frames;
}

// ============= ANTAGONISTS (Men in suits) =============
// Chaser 1: Black suit, bald head
const chaser1Palette = {
    'H': '#DDCCBB', // Bald head (skin tone)
    'h': '#CCBBAA', // Head shadow
    'S': '#EEDDCC', // Skin (face)
    's': '#DDCCBB', // Skin shadow
    'C': '#111111', // Black suit
    'c': '#000000', // Suit shadow
    'T': '#880000', // Red tie
    't': '#660000', // Tie shadow
    'W': '#FFFFFF', // White shirt collar
    'K': '#111111', // Black shoes
    'k': '#000000', // Shoe shadow
    'B': '#000000', // Outlines
    'E': '#222222', // Eyes
    'M': '#AA6655', // Mouth
    'P': '#222222', // Pants (same as suit)
};

// Chaser 2: Black suit, black hair
const chaser2Palette = {
    'H': '#111111', // Black hair
    'h': '#000000', // Hair shadow
    'S': '#DDBB99', // Skin (slightly different tone)
    's': '#CCAA88', // Skin shadow
    'C': '#1A1A1A', // Black suit (slightly different)
    'c': '#000000', // Suit shadow
    'T': '#003366', // Blue tie
    't': '#002244', // Tie shadow
    'W': '#FFFFFF', // White shirt collar
    'K': '#111111', // Black shoes
    'k': '#000000', // Shoe shadow
    'B': '#000000', // Outlines
    'E': '#222222', // Eyes
    'M': '#BB7766', // Mouth
    'P': '#1A1A1A', // Pants
};

// Chaser 3: Blue suit, black hair
const chaser3Palette = {
    'H': '#1A1A1A', // Black hair
    'h': '#000000', // Hair shadow
    'S': '#FFCCAA', // Skin
    's': '#EEBB99', // Skin shadow
    'C': '#223366', // Blue suit
    'c': '#112244', // Suit shadow
    'T': '#AA2222', // Red tie
    't': '#881111', // Tie shadow
    'W': '#FFFFFF', // White shirt collar
    'K': '#222222', // Dark shoes
    'k': '#111111', // Shoe shadow
    'B': '#000000', // Outlines
    'E': '#222222', // Eyes
    'M': '#CC7766', // Mouth
    'P': '#223366', // Pants (match suit)
};

function createChaserFrames(isBald = false) {
    const frames = [];
    const headTop = isBald ? [
        "    HHHH    ",
        "   HhHHHH   ",
        "   HHHHHH   ",
    ] : [
        "    HHHH    ",
        "   HhHHHH   ",
        "   HHHHH    ",
    ];

    // Frame 1: Aggressive stride right
    frames.push([
        ...headTop,
        "   SSESS    ",
        "   SSMSS    ",
        "    WSW     ",
        "   CCTCC    ",
        "  CcCCCcC   ",
        "   CCCCC    ",
        "   CCCCC    ",
        "   PPPPP    ",
        "   PpPPp    ",
        "  PP  PP    ",
        "  Pp   Pp   ",
        " PP     P   ",
        " KK     K   ",
        " kk     k   ",
    ]);

    // Frame 2: Powerful leap
    frames.push([
        ...headTop,
        "   SSESS    ",
        "   SSMSS    ",
        "    WSW     ",
        "  SCCTCCS   ",
        " CcCCCCCcC  ",
        "   CCCCC    ",
        "   CCCCC    ",
        "   PPPPP    ",
        "  PPPPPP    ",
        "  KK  KK    ",
        "  kk  kk    ",
        "            ",
        "            ",
        "            ",
    ]);

    // Frame 3: Stride left
    frames.push([
        ...headTop,
        "   SSESS    ",
        "   SSMSS    ",
        "    WSW     ",
        "   CCTCC    ",
        "  CcCCCcC   ",
        "   CCCCC    ",
        "   CCCCC    ",
        "   PPPPP    ",
        "   pPPPp    ",
        "    PP  PP  ",
        "   pP   pP  ",
        "   P     PP ",
        "   K     KK ",
        "   k     kk ",
    ]);

    // Frame 4: Recovery
    frames.push([
        ...headTop,
        "   SSESS    ",
        "   SSMSS    ",
        "    WSW     ",
        "   CCTCC    ",
        "  CcCCCcC   ",
        "   CCCCC    ",
        "   CCCCC    ",
        "   PPPPP    ",
        "   PpPPPp   ",
        "   PP PP    ",
        "   pP pP    ",
        "   KK KK    ",
        "   kk kk    ",
        "            ",
    ]);

    return frames;
}

// ============= OBSTACLES =============
const carPalette = {
    'R': '#DD2222', // Red body
    'r': '#AA1111', // Body shadow
    'W': '#AADDFF', // Windows
    'w': '#88BBDD', // Window shadow
    'B': '#111111', // Black (tires, outline)
    'b': '#222222', // Tire highlight
    'Y': '#FFDD00', // Headlight
    'y': '#DDBB00', // Headlight shadow
    'G': '#333333', // Grille
    'C': '#888888', // Chrome/trim
    'T': '#FF4444', // Tail light
};

const carPattern = [
    "                        ",
    "        WWWWWWWW        ",
    "      WwWWWWWWWWWw      ",
    "     WWWWWWWWWWWWWW     ",
    "    RRRRRRRRRRRRRRRR    ",
    "   RRRRRRRRRRRRRRRRRT   ",
    "  YRRRRRRRRRRRRRRRRRRr  ",
    "  YRRRRRRRRRRRRRRRRRT   ",
    "  GCCCCCCCCCCCCCCCCG    ",
    " BBbBB          BBbBB   ",
    " BBBBB          BBBBB   ",
    "  BBB            BBB    ",
];

const barrierPalette = {
    'O': '#FF6600', // Orange
    'o': '#DD5500', // Orange shadow
    'Y': '#FFDD00', // Yellow stripe
    'y': '#DDBB00', // Yellow shadow
    'B': '#111111', // Black stripe
    'W': '#FFFFFF', // White
    'G': '#444444', // Gray base
};

const barrierLowPattern = [
    "                    ",
    "  OOOOOOOOOOOOOOOO  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OOOOOOOOOOOOOOOO  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  GGGGGGGGGGGGGGGG  ",
];

const barrierHighPattern = [
    "  OOOOOOOOOOOOOOOO  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OOOOOOOOOOOOOOOO  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OOOOOOOOOOOOOOOO  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  OOOOOOOOOOOOOOOO  ",
    "  OYYBBYYBBYYBBYYo  ",
    "  GGGGGGGGGGGGGGGG  ",
];

// ============= POWER-UPS =============
const coinPalette = {
    'G': '#FFD700', // Gold
    'g': '#DAA520', // Gold shadow
    'Y': '#FFFF00', // Highlight
    'B': '#8B6914', // Dark edge
};

const coinPattern = [
    "   GGGG   ",
    "  GgGGGY  ",
    " GgGGGGGY ",
    " GgGGGGGY ",
    " GgGGGGGY ",
    " GgGGGGGY ",
    "  BgGGGY  ",
    "   BBBB   ",
];

const shieldPalette = {
    'B': '#4488FF', // Blue
    'b': '#2266DD', // Blue shadow
    'W': '#FFFFFF', // White star
    'Y': '#FFDD00', // Yellow accent
    'D': '#1144AA', // Dark blue
};

const shieldPattern = [
    "   BBBBB   ",
    "  BbBBBBB  ",
    " BbBBWBBBB ",
    " BbBWWWBBB ",
    " BbBBWBBBB ",
    " BbBBBBBBB ",
    "  BbBBBBB  ",
    "   BbBBB   ",
    "    BbB    ",
    "     B     ",
];

const speedPalette = {
    'R': '#FF4444', // Red
    'r': '#DD2222', // Red shadow
    'Y': '#FFFF00', // Yellow lightning
    'W': '#FFFFFF', // White
    'O': '#FF8800', // Orange
};

const speedPattern = [
    "      YY  ",
    "     YY   ",
    "    YYY   ",
    "   YYYY   ",
    "  YYYYY   ",
    "   YYYY   ",
    "    YYY   ",
    "     YY   ",
    "      Y   ",
];

// ============= PLATFORMS =============
const platformPalette = {
    'G': '#555555', // Gray concrete
    'g': '#444444', // Shadow
    'Y': '#FFDD00', // Yellow marking
    'W': '#AAAAAA', // Light edge
};

const platformPattern = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWW",
    "YGGGGGGGGGGGGGGGGGGGGGGGY",
    "gGGGGGGGGGGGGGGGGGGGGGGGg",
    "gGGGGGGGGGGGGGGGGGGGGGGGg",
    "gggggggggggggggggggggggggg",
];

// ============= BACKGROUNDS (Procedural pixel art) =============
function drawBackground(type) {
    const width = 1920;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Gradient sky
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    if (type.name === 'suburb') {
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#B0E0E6');
        gradient.addColorStop(1, '#98D8C8');
    } else if (type.name === 'city') {
        gradient.addColorStop(0, '#2C3E50');
        gradient.addColorStop(0.5, '#34495E');
        gradient.addColorStop(1, '#1A252F');
    } else if (type.name === 'park') {
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#98FB98');
        gradient.addColorStop(1, '#228B22');
    } else if (type.name === 'industrial') {
        gradient.addColorStop(0, '#696969');
        gradient.addColorStop(0.5, '#808080');
        gradient.addColorStop(1, '#505050');
    } else if (type.name === 'downtown') {
        gradient.addColorStop(0, '#191970');
        gradient.addColorStop(0.4, '#2C2C54');
        gradient.addColorStop(1, '#1A1A2E');
    } else if (type.name === 'waterfront') {
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#00CED1');
        gradient.addColorStop(1, '#20B2AA');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw clouds for daytime scenes
    if (['suburb', 'park', 'waterfront'].includes(type.name)) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 8; i++) {
            const cx = (i * 280 + 50) % width;
            const cy = 30 + (i % 3) * 25;
            drawCloud(ctx, cx, cy, 40 + (i % 3) * 20);
        }
    }
    
    // Scene-specific elements
    if (type.name === 'suburb') {
        for (let i = 0; i < width; i += 180) {
            drawHouse(ctx, i + 20, height - 180, 120, 130);
        }
        for (let i = 0; i < width; i += 250) {
            drawTree(ctx, i + 150, height - 160, 60);
        }
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, height - 50, width, 50);
    } else if (type.name === 'city') {
        const buildingColors = ['#2C3E50', '#34495E', '#1A252F', '#2E4053'];
        for (let i = 0; i < width; i += 90) {
            const h = 150 + Math.sin(i * 0.02) * 100;
            const color = buildingColors[Math.floor(i / 90) % buildingColors.length];
            drawBuilding(ctx, i, height - 50 - h, 75, h, color);
        }
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, height - 50, width, 50);
    } else if (type.name === 'park') {
        for (let i = 0; i < width; i += 120) {
            drawTree(ctx, i + 60, height - 140, 70 + (i % 3) * 10);
        }
        for (let i = 0; i < width; i += 400) {
            drawBench(ctx, i + 180, height - 70);
        }
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, height - 50, width, 50);
    } else if (type.name === 'industrial') {
        for (let i = 0; i < width; i += 300) {
            drawFactory(ctx, i, height - 220, 250, 170);
        }
        ctx.fillStyle = '#505050';
        ctx.fillRect(0, height - 50, width, 50);
    } else if (type.name === 'downtown') {
        const neonColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
        for (let i = 0; i < width; i += 100) {
            const h = 180 + Math.sin(i * 0.03) * 80;
            drawNeonBuilding(ctx, i, height - 50 - h, 85, h, neonColors[Math.floor(i / 100) % neonColors.length]);
        }
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(0, height - 50, width, 50);
    } else if (type.name === 'waterfront') {
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(0, height - 120, width, 70);
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 2;
        for (let i = 0; i < width; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i, height - 90);
            ctx.quadraticCurveTo(i + 15, height - 100, i + 30, height - 90);
            ctx.quadraticCurveTo(i + 45, height - 80, i + 60, height - 90);
            ctx.stroke();
        }
        for (let i = 0; i < width; i += 250) {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(i + 50, height - 120, 15, 80);
            ctx.fillRect(i + 150, height - 120, 15, 80);
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(i + 30, height - 130, 160, 20);
        }
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(0, height - 50, width, 50);
    }
    
    saveCanvas(canvas, `bg_${type.name}.webp`);
}

function drawCloud(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y + size * 0.15, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawHouse(ctx, x, y, w, h) {
    const houseColors = ['#F5DEB3', '#DEB887', '#D2B48C', '#FAEBD7'];
    ctx.fillStyle = houseColors[Math.floor(x / 180) % houseColors.length];
    ctx.fillRect(x, y + h * 0.35, w, h * 0.65);
    
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x - 10, y + h * 0.35);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w + 10, y + h * 0.35);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + w * 0.4, y + h * 0.55, w * 0.2, h * 0.45);
    
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + w * 0.1, y + h * 0.45, w * 0.2, h * 0.2);
    ctx.fillRect(x + w * 0.7, y + h * 0.45, w * 0.2, h * 0.2);
}

function drawTree(ctx, x, y, size) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - size * 0.1, y, size * 0.2, size * 0.8);
    
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y - size * 0.1, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(x - size * 0.25, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size * 0.25, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawBuilding(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    
    ctx.fillStyle = '#FFFFE0';
    for (let wy = y + 15; wy < y + h - 20; wy += 25) {
        for (let wx = x + 10; wx < x + w - 15; wx += 20) {
            if (Math.random() > 0.3) {
                ctx.fillRect(wx, wy, 12, 18);
            }
        }
    }
}

function drawNeonBuilding(ctx, x, y, w, h, neonColor) {
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(x, y, w, h);
    
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    
    ctx.fillStyle = '#FFE4B5';
    for (let wy = y + 20; wy < y + h - 30; wy += 30) {
        for (let wx = x + 12; wx < x + w - 20; wx += 22) {
            if (Math.random() > 0.4) {
                ctx.fillRect(wx, wy, 14, 20);
            }
        }
    }
    
    ctx.fillStyle = neonColor;
    ctx.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, 8);
}

function drawFactory(ctx, x, y, w, h) {
    ctx.fillStyle = '#696969';
    ctx.fillRect(x, y + h * 0.3, w * 0.8, h * 0.7);
    
    ctx.fillStyle = '#505050';
    ctx.fillRect(x + w * 0.7, y, w * 0.15, h * 0.5);
    
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.beginPath();
    ctx.arc(x + w * 0.775, y - 20, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w * 0.75, y - 50, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#333333';
    for (let wx = x + 20; wx < x + w * 0.7; wx += 50) {
        ctx.fillRect(wx, y + h * 0.4, 30, 20);
    }
}

function drawBench(ctx, x, y) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, 60, 8);
    ctx.fillRect(x + 5, y + 8, 8, 20);
    ctx.fillRect(x + 47, y + 8, 8, 20);
    ctx.fillRect(x, y - 25, 60, 6);
    ctx.fillRect(x + 5, y - 25, 5, 25);
    ctx.fillRect(x + 50, y - 25, 5, 25);
}

// ============= GENERATE ALL ASSETS =============
console.log('\n🎨 Generating Sidewalk Sprint sprites...\n');

// Protagonist
console.log('👤 Protagonist (red hair, white shirt, blue jeans):');
const protagonistFrames = createProtagonistFrames();
protagonistFrames.forEach((frame, i) => {
    const canvas = drawPixelArt(frame, protagonistPalette, 7);
    saveCanvas(canvas, `runner_${i + 1}.webp`);
});

// Chasers
console.log('\n🕴️ Chaser 1 (black suit, bald):');
const chaser1Frames = createChaserFrames(true);
chaser1Frames.forEach((frame, i) => {
    const canvas = drawPixelArt(frame, chaser1Palette, 7);
    saveCanvas(canvas, `chaser1_${i + 1}.webp`);
});

console.log('\n🕴️ Chaser 2 (black suit, black hair):');
const chaser2Frames = createChaserFrames(false);
chaser2Frames.forEach((frame, i) => {
    const canvas = drawPixelArt(frame, chaser2Palette, 7);
    saveCanvas(canvas, `chaser2_${i + 1}.webp`);
});

console.log('\n🕴️ Chaser 3 (blue suit, black hair):');
const chaser3Frames = createChaserFrames(false);
chaser3Frames.forEach((frame, i) => {
    const canvas = drawPixelArt(frame, chaser3Palette, 7);
    saveCanvas(canvas, `chaser3_${i + 1}.webp`);
});

// Obstacles
console.log('\n🚗 Obstacles:');
saveCanvas(drawPixelArt(carPattern, carPalette, 7), 'car.webp');
saveCanvas(drawPixelArt(barrierLowPattern, barrierPalette, 7), 'construction_low.webp');
saveCanvas(drawPixelArt(barrierHighPattern, barrierPalette, 7), 'construction_high.webp');

// Power-ups
console.log('\n⭐ Power-ups:');
saveCanvas(drawPixelArt(coinPattern, coinPalette, 6), 'coin.webp');
saveCanvas(drawPixelArt(shieldPattern, shieldPalette, 6), 'shield.webp');
saveCanvas(drawPixelArt(speedPattern, speedPalette, 6), 'speed.webp');

// Platforms
console.log('\n🧱 Platforms:');
saveCanvas(drawPixelArt(platformPattern, platformPalette, 6), 'platform.webp');

// Backgrounds
console.log('\n🌆 Backgrounds:');
drawBackground({ name: 'suburb' });
drawBackground({ name: 'city' });
drawBackground({ name: 'park' });
drawBackground({ name: 'industrial' });
drawBackground({ name: 'downtown' });
drawBackground({ name: 'waterfront' });

console.log('\n✅ All sprites generated successfully!\n');
