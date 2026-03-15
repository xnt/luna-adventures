import { GAME_CONFIG } from "./constants";
import { createRng, type Rng } from "./random";
import type { ChunkLayout, FoeSpawn, ItemSpawn, PlatformSegment } from "./types";

export interface LevelPlan {
  seed: number;
  chunks: ChunkLayout[];
  ownerX: number;
  ownerY: number;
}

export interface LevelPlanOptions {
  seed: number;
  chunkCount?: number;
}

/**
 * Pure function: generates a complete level plan from a seed.
 * No Phaser dependencies — just data describing what the level contains.
 */
export function generateLevelPlan(options: LevelPlanOptions): LevelPlan {
  const { seed, chunkCount = GAME_CONFIG.levelChunks } = options;
  const rng = createRng(seed);
  const chunks: ChunkLayout[] = [];
  let cursorX = 0;

  for (let c = 0; c < chunkCount; c += 1) {
    const chunk = generateChunk(rng, cursorX);
    chunks.push(chunk);
    cursorX = chunk.endX;
  }

  const ownerX = GAME_CONFIG.levelLength - 80;
  const ownerY = GAME_CONFIG.groundY - 48;

  return { seed, chunks, ownerX, ownerY };
}

/**
 * Generate a single chunk of the level plan.
 */
function generateChunk(rng: Rng, startX: number): ChunkLayout {
  const platforms: PlatformSegment[] = [];
  const foes: FoeSpawn[] = [];
  const items: ItemSpawn[] = [];
  const tiles = GAME_CONFIG.chunkWidth;

  for (let index = 0; index < tiles; index += 1) {
    const roll = rng();
    const x = startX + index * GAME_CONFIG.tileSize;
    const isSafeStart = startX === 0 && index < 8;

    if (!isSafeStart && roll < GAME_CONFIG.pitChance) {
      platforms.push({
        x,
        width: GAME_CONFIG.tileSize,
        height: 0,
        kind: "pit",
      });
      continue;
    }

    let height: number = GAME_CONFIG.groundY;
    let kind: PlatformSegment["kind"] = "ground";

    if (rng() < GAME_CONFIG.stairChance) {
      const stepHeight = GAME_CONFIG.tileSize * (1 + Math.floor(rng() * 3));
      height = Math.max(GAME_CONFIG.groundY - stepHeight, 260);
      kind = "stairs";
    }

    const width =
      GAME_CONFIG.tileSize *
      (GAME_CONFIG.minPlatformLength +
        Math.floor(rng() * (GAME_CONFIG.maxPlatformLength - GAME_CONFIG.minPlatformLength + 1)));
    platforms.push({ x, width, height, kind });
    index += Math.floor(width / GAME_CONFIG.tileSize) - 1;

    if (rng() < GAME_CONFIG.foeChance) {
      const kind = rng() > 0.5 ? "cat" : "roomba";
      const foeX = x + width * 0.5;
      const foeY = height - 64;
      foes.push({
        x: foeX,
        y: foeY,
        kind,
        platformStartX: x + 10,
        platformEndX: x + width - 10,
      });
    }

    if (rng() < GAME_CONFIG.itemChance) {
      const kind = rng() > 0.7 ? "drumstick" : "food";
      items.push({ x: x + width * 0.35, y: height - 48, kind });
    }
  }

  const endX = startX + tiles * GAME_CONFIG.tileSize;

  return { startX, endX, platforms, foes, items };
}

/**
 * Side-effectful: creates Phaser static bodies for platforms from the plan.
 */
export function buildLevelGeometry(
  scene: Phaser.Scene,
  plan: LevelPlan,
  groundGroup: Phaser.Physics.Arcade.StaticGroup
): void {
  plan.chunks.forEach((chunk) => {
    chunk.platforms.forEach((segment) => {
      if (segment.kind === "pit") {
        return;
      }
      const platform = groundGroup.create(segment.x, segment.height, "ground");
      platform.setOrigin(0, 1);
      platform.displayWidth = segment.width;
      platform.displayHeight = GAME_CONFIG.tileSize;
      platform.refreshBody();
      platform.setTint(segment.kind === "stairs" ? 0xb7e4ff : 0xffc7e8);
    });
  });

  // Spawn platform under Luna's start position
  const spawnPlatform = groundGroup.create(0, GAME_CONFIG.groundY, "ground");
  spawnPlatform.setOrigin(0, 1);
  spawnPlatform.displayWidth = GAME_CONFIG.tileSize * 12;
  spawnPlatform.displayHeight = GAME_CONFIG.tileSize;
  spawnPlatform.refreshBody();
}

/**
 * Side-effectful: spawns foes and items from the plan.
 * Uses delayed call so static bodies are ready for collision.
 */
export function spawnLevelEntities(
  scene: Phaser.Scene,
  plan: LevelPlan,
  foeGroup: Phaser.Physics.Arcade.Group,
  itemGroup: Phaser.Physics.Arcade.Group
): void {
  // Collect all entities to spawn
  const allFoes: FoeSpawn[] = [];
  const allItems: ItemSpawn[] = [];
  plan.chunks.forEach((chunk) => {
    allFoes.push(...chunk.foes);
    allItems.push(...chunk.items);
  });

  // Delay to next frame to ensure static bodies are ready
  scene.time.delayedCall(0, () => {
    allFoes.forEach((spawn) => {
      const foe = foeGroup.create(spawn.x, spawn.y, spawn.kind);
      foe.setBounce(0);
      foe.setCollideWorldBounds(false);
      foe.setVelocityX(spawn.kind === "cat" ? -GAME_CONFIG.catSpeed : -GAME_CONFIG.roombaSpeed);
      foe.setData("kind", spawn.kind);
      foe.setData("direction", -1);
      foe.setData("platformStartX", spawn.platformStartX);
      foe.setData("platformEndX", spawn.platformEndX);
      if (spawn.kind === "roomba") {
        foe.setSize(26, 18);
        foe.setOffset(1, 6);
      }
      foe.setDepth(1);
      foe.setGravityY(400);
    });

    allItems.forEach((spawn) => {
      const item = itemGroup.create(spawn.x, spawn.y, spawn.kind);
      item.setData("kind", spawn.kind);
      item.setBounce(0.1);
    });
  });
}
