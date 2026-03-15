import { GAME_CONFIG } from "./constants";
import { createRng, type Rng } from "./random";
import type { ChunkLayout, FoeSpawn, ItemSpawn, PlatformSegment } from "./types";

export interface LevelGeneratorOptions {
  seed?: number;
}

export class LevelGenerator {
  private rng: Rng;
  private cursorX: number;

  constructor(options: LevelGeneratorOptions = {}) {
    this.rng = createRng(options.seed ?? 1);
    this.cursorX = 0;
  }

  nextChunk(): ChunkLayout {
    const startX = this.cursorX;
    const platforms: PlatformSegment[] = [];
    const foes: FoeSpawn[] = [];
    const items: ItemSpawn[] = [];
    const tiles = GAME_CONFIG.chunkWidth;

    for (let index = 0; index < tiles; index += 1) {
      const roll = this.rng();
      const x = startX + index * GAME_CONFIG.tileSize;
      const isSafeStart = this.cursorX === 0 && index < 8;

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

      if (this.rng() < GAME_CONFIG.stairChance) {
        const stepHeight = GAME_CONFIG.tileSize * (1 + Math.floor(this.rng() * 3));
        height = Math.max(GAME_CONFIG.groundY - stepHeight, 260);
        kind = "stairs";
      }

      const width = GAME_CONFIG.tileSize *
        (GAME_CONFIG.minPlatformLength +
          Math.floor(this.rng() * (GAME_CONFIG.maxPlatformLength - GAME_CONFIG.minPlatformLength + 1)));
      platforms.push({ x, width, height, kind });
      index += Math.floor(width / GAME_CONFIG.tileSize) - 1;

      if (this.rng() < GAME_CONFIG.foeChance) {
        const kind = this.rng() > 0.5 ? "cat" : "roomba";
        const foeX = x + width * 0.5;
        const foeY = height - 64; // Spawn above the platform to ensure collision catches
        foes.push({
          x: foeX,
          y: foeY,
          kind,
          platformStartX: x + 10,
          platformEndX: x + width - 10,
        });
      }

      if (this.rng() < GAME_CONFIG.itemChance) {
        const kind = this.rng() > 0.7 ? "drumstick" : "food";
        items.push({ x: x + width * 0.35, y: height - 48, kind });
      }
    }

    this.cursorX += tiles * GAME_CONFIG.tileSize;

    return {
      startX,
      endX: this.cursorX,
      platforms,
      foes,
      items,
    };
  }
}
