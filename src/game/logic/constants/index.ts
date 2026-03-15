/**
 * Constants namespace - organized game configuration constants.
 *
 * Each file is exposed as a namespace:
 *   import { Display, Level, Player, Enemies, Items } from "./constants";
 *   const width = Display.width;
 *   const maxHp = Player.maxHp;
 *
 * Or use the combined Constants object:
 *   import { Constants } from "./constants";
 *   const width = Constants.display.width;
 *
 * Or for backward compatibility:
 *   import { GAME_CONFIG } from "./constants";
 *   const width = GAME_CONFIG.width;
 */

import { display } from "./display";
import { level } from "./level";
import { player } from "./player";
import { enemies } from "./enemies";
import { items } from "./items";

// Export as namespaces (PascalCase for namespace style)
export const Display = display;
export const Level = level;
export const Player = player;
export const Enemies = enemies;
export const Items = items;

// Also export lowercase for flexibility
export { display, level, player, enemies, items };

/**
 * Combined namespace object for convenient access to all constant groups.
 */
export const Constants = {
  display,
  level,
  player,
  enemies,
  items,
} as const;

// Re-export for backward compatibility (GAME_CONFIG style)
export const GAME_CONFIG = {
  ...display,
  ...level,
  ...player,
  ...enemies,
  ...items,
  get levelLength(): number {
    return this.levelChunks * this.chunkWidth * this.tileSize;
  },
} as const;
