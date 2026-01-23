# Sidewalk Sprint - Sprite Generation Prompt

Use this comprehensive prompt with Gemini, Midjourney, DALL-E, or your preferred image generator to create all game sprites.

---

## 🎮 PROJECT OVERVIEW

You're creating sprites for "Sidewalk Sprint," an endless runner game where a character runs away from pursuing chasers while avoiding obstacles across different urban environments. The art style should be **vibrant, modern, cartoon-like** with **bold outlines and expressive character design**. All sprites should be **horizontal oriented (landscape)** with **transparent backgrounds** in WebP format.

---

## 🏃 RUNNER CHARACTER (4 Animation Frames)

**Style:** Energetic young person in casual athletic wear, Asian representation, friendly expression

**File Names:**
- runner_1.webp
- runner_2.webp
- runner_3.webp
- runner_4.webp

**Description:**
Create 4 running animation frames of a single character showing the running cycle:
1. **runner_1.webp** - Right leg forward, arms pumping, mid-stride
2. **runner_2.webp** - Both legs in air, explosive jump-like pose
3. **runner_3.webp** - Left leg forward, arms pumping opposite direction
4. **runner_4.webp** - Recovering stride, transitioning back to right leg forward

**Details:**
- Character height: ~120px when scaled in game
- Wearing bright athletic colors (neon yellow/orange hoodie, blue shorts recommended)
- Energetic facial expression (determined but not scared)
- Visible motion lines optional but appreciated
- Bold black outlines
- Smooth, flowing lines suggesting speed and movement
- Keep proportions consistent across all 4 frames

---

## 🏃 CHASER CHARACTERS (3 Types × 4 Frames Each)

**Style:** Three distinct antagonist characters, professional suits/formal wear, menacing but cartoony, diverse representations

### CHASER TYPE 1 (4 Frames)

**File Names:**
- chaser1_1.webp
- chaser1_2.webp
- chaser1_3.webp
- chaser1_4.webp

**Description:**
Tall, stern-looking chaser in a sharp business suit (dark navy/black). Running with purpose, slightly intimidating posture. Similar running cycle animation as runner but with more aggressive stride:
1. **chaser1_1.webp** - Right leg forward, arms pumping aggressively
2. **chaser1_2.webp** - Both legs in air, powerful stride
3. **chaser1_3.webp** - Left leg forward, leaning forward intensely
4. **chaser1_4.webp** - Recovery stride, maintaining pursuit

**Details:**
- Professional suit with tie
- Serious/stern facial expression
- Bold black outlines
- Dark color palette (navy, black, white shirt)
- Same height as runner (~120px)
- Menacing but not cartoonishly evil

---

### CHASER TYPE 2 (4 Frames)

**File Names:**
- chaser2_1.webp
- chaser2_2.webp
- chaser2_3.webp
- chaser2_4.webp

**Description:**
Athletic, muscular chaser in casual formal wear (blazer, no tie). Different body type and posture - wider stance, more powerful. Running with intimidating confidence:
1. **chaser2_1.webp** - Right leg forward, arms up in pursuit
2. **chaser2_2.webp** - Both legs in air, powerful jump
3. **chaser2_3.webp** - Left leg forward, muscular frame emphasized
4. **chaser2_4.webp** - Recovery stride, unstoppable momentum

**Details:**
- Blazer over casual shirt (gray or burgundy recommended)
- Athletic, bulky build
- Intense/determined facial expression
- Bold black outlines
- Lighter color palette than Type 1 (grays, warm tones)
- Same height as runner (~120px)
- Distinct from Type 1 in silhouette and stance

---

### CHASER TYPE 3 (4 Frames)

**File Names:**
- chaser3_1.webp
- chaser3_2.webp
- chaser3_3.webp
- chaser3_4.webp

**Description:**
Slender, swift-moving chaser in modern tech-wear/casual. Different personality - fast and nimble. Running with graceful but predatory motion:
1. **chaser3_1.webp** - Right leg forward, lean and swift
2. **chaser3_2.webp** - Both legs in air, elegant leap
3. **chaser3_3.webp** - Left leg forward, fluid motion
4. **chaser3_4.webp** - Recovery stride, maintaining chase

**Details:**
- Modern casual jacket/hoodie (teal, purple, or neon color)
- Slender, athletic build
- Cold/calculating facial expression
- Bold black outlines
- Bright, cool color palette (teals, purples)
- Same height as runner (~120px)
- Distinctly different silhouette from Types 1 & 2

---

## 🚗 OBSTACLES

### Car (Hard Obstacle)

**File Name:** car.webp

**Description:**
A stylized sedan/compact car viewed from the side, moving from right to left. Vibrant color (red, purple, or bright blue recommended). Simple, bold design with clear windows, wheels, and bumpers.

**Details:**
- Width: ~160px, Height: ~90px
- Side profile view
- Modern design
- Clear window with visible interior
- Distinctive bumpers and headlights
- Bold black outlines
- Bright, eye-catching color
- This is a "hard hit" obstacle - instant game over

---

### Construction Barrier - Low

**File Name:** construction_low.webp

**Description:**
A low construction barrier or orange caution barrier, roughly knee-to-waist height. Can be jumped over. Yellow and black warning stripes pattern on orange base.

**Details:**
- Width: ~140px, Height: ~80px
- Side profile view
- Orange with yellow/black warning stripes
- Simple, recognizable construction aesthetic
- Bold black outlines
- This is a "soft" obstacle - causes a misstep, not instant failure

---

### Construction Barrier - High

**File Name:** construction_high.webp

**Description:**
A taller construction barrier or wall, roughly torso-height (reduced from original to be jumpable). Still challenging to clear. Same construction theme as low barrier with consistent visual language.

**Details:**
- Width: ~140px, Height: ~150px (can be jumped with good timing)
- Side profile view
- Orange with yellow/black warning stripes
- Taller version of low barrier
- Bold black outlines
- Visually matches low barrier design language
- This is a "soft" obstacle - causes a misstep, not instant failure

---

## 🌆 BACKGROUND ENVIRONMENTS (6 Areas)

Each background should be a **horizontal scrolling landscape** showing the environment at the distance the runner is passing through. They scroll at different speeds to create parallax effect.

### Background 1: Suburban Area

**File Name:** bg_suburb.webp

**Description:**
Peaceful suburban neighborhood with residential houses, trees, fences, and blue sky. Daytime setting with warm lighting.

**Details:**
- Landscape orientation, ~1920x400px minimum
- Single-story houses with varying colors
- Green trees and grass
- White picket fences
- Clear blue sky with light clouds
- Sunny afternoon lighting
- Safe, calm aesthetic
- Should tile seamlessly for scrolling

---

### Background 2: City Environment

**File Name:** bg_city.webp

**Description:**
Urban downtown with tall buildings, storefronts, street lamps, and busy infrastructure. Modern city vibe with slight grit.

**Details:**
- Landscape orientation, ~1920x400px minimum
- Tall office/apartment buildings (8-10+ stories)
- Visible storefronts and windows
- Street lights and urban infrastructure
- Modern but slightly worn aesthetic
- Overcast or late afternoon lighting
- Urban energy
- Should tile seamlessly for scrolling

---

### Background 3: Park/Green Space

**File Name:** bg_park.webp

**Description:**
Lush public park with large trees, benches, open grass areas, walking paths. Relaxing green environment with natural elements.

**Details:**
- Landscape orientation, ~1920x400px minimum
- Large mature trees with full foliage
- Park benches scattered
- Wide open grass areas
- Walking/cycling paths
- Blue sky with puffy clouds
- Peaceful, natural aesthetic
- Nature-dominant over buildings
- Should tile seamlessly for scrolling

---

### Background 4: Industrial Area

**File Name:** bg_industrial.webp

**Description:**
Gritty industrial zone with factories, warehouses, smokestacks, metal structures. Worn, utilitarian aesthetic with metallic elements.

**Details:**
- Landscape orientation, ~1920x400px minimum
- Warehouse buildings with corrugated metal
- Factory structures with smokestacks
- Metal fences and industrial barriers
- Utilitarian color palette (grays, browns, rust tones)
- Overcast or hazy sky
- Heavy, industrial aesthetic
- Weathered appearance
- Should tile seamlessly for scrolling

---

### Background 5: Downtown/Commercial District

**File Name:** bg_downtown.webp

**Description:**
Busy downtown commercial area with shops, restaurants, signage, neon lights. Vibrant, energetic urban environment with commercial activity.

**Details:**
- Landscape orientation, ~1920x400px minimum
- Multi-story buildings with storefronts at street level
- Visible shop signs and neon signage
- Busy commercial aesthetic
- Mix of glass, metal, and stone
- Evening or dusk lighting with some artificial lights
- High-energy, commercial vibe
- Crowded urban feel
- Should tile seamlessly for scrolling

---

### Background 6: Waterfront Area

**File Name:** bg_waterfront.webp

**Description:**
Scenic waterfront with water visible (harbor, river, or lake), boats, docks, and water-view buildings. Calm but urban waterside.

**Details:**
- Landscape orientation, ~1920x400px minimum
- Body of water (harbor/river/lake) with boats/watercraft
- Dock structures and piers
- Waterfront buildings/warehouses
- Water reflections
- Seagulls optional
- Calm water or gentle waves
- Blue/teal color tones from water
- Peaceful yet urban aesthetic
- Should tile seamlessly for scrolling

---

## 🎨 GENERAL REQUIREMENTS FOR ALL SPRITES

1. **Format:** WebP with transparent background
2. **Style:** Cartoon/illustrated with bold black outlines
3. **Colors:** Vibrant and distinct, good contrast
4. **Clarity:** Characters should be recognizable at small sizes
5. **Consistency:** Characters and obstacles should feel like they belong in the same game world
6. **Motion:** Animation frames should show smooth motion progression
7. **Proportions:** Maintain consistent proportions across animation frames
8. **Backgrounds:** Should tile seamlessly and create parallax effect when scrolled

---

## 📝 SAMPLE PROMPT FOR IMAGE GENERATOR

"Create a set of cartoon-style game sprites for an endless runner game. The art style is vibrant, bold, and modern with thick black outlines. All sprites should have transparent backgrounds.

I need:
1. Four running animation frames of an energetic young Asian character in bright athletic wear (neon yellow hoodie, blue shorts)
2. Three different chaser characters, each with 4 running animation frames:
   - Type 1: Stern suit-wearing businessman in dark navy suit
   - Type 2: Athletic muscular chaser in casual blazer
   - Type 3: Swift, nimble chaser in modern tech-wear
3. Three obstacles:
   - A bright red/purple sedan viewed from side
   - A knee-height orange construction barrier with warning stripes
   - A torso-height orange construction barrier with warning stripes
4. Six scrolling background environments:
   - Suburban neighborhood with houses and trees
   - Urban downtown with tall buildings
   - Green park with trees and benches
   - Industrial area with warehouses
   - Downtown commercial district with shops
   - Waterfront area with boats and docks

All characters should be approximately the same height (~120px in game). All sprites should feel cohesive and belong to the same game world. Animation frames should show smooth motion progression."

---

## 💡 TIPS FOR GENERATION

- **Use multiple prompts:** Generate each character or background separately for better control
- **Specify dimensions:** If your generator supports it, specify output size
- **Request variations:** Ask for multiple variations and pick the best ones
- **Iterate:** Refine descriptions based on initial results
- **Consistency:** Reference earlier generated images when creating related assets
- **Test in game:** Once generated, test sprites in the game at actual size

Good luck creating your Sidewalk Sprint sprites! 🎮
