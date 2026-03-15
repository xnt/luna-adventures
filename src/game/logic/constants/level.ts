/**
 * Level constants - level geometry, chunk generation, and terrain settings
 */
export const level = {
  groundY: 470,
  tileSize: 32,
  chunkWidth: 12,
  minPlatformLength: 3,
  maxPlatformLength: 6,
  pitChance: 0.2,
  stairChance: 0.25,
  chunkBuffer: 6,
  levelChunks: 40,
  get levelLength() {
    return this.levelChunks * this.chunkWidth * this.tileSize;
  },
} as const;
