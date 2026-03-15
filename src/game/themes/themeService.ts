import type { Theme } from "./types";
export type { Theme };
import { canadianNeighbourhoodTheme } from "./canadianNeighbourhood";
import { mexicanPuebloMagicoTheme } from "./mexicanPuebloMagico";
import { matrixTheme } from "./matrixTheme";
import { sodaPopTheme } from "./sodaPopTheme";

/**
 * Registry of all available themes.
 * Themes self-register their ID and implementation.
 */
export class ThemeRegistry {
  private themes: Map<string, Theme> = new Map();

  constructor() {
    this.registerAll();
  }

  private registerAll(): void {
    const themes: Theme[] = [
      canadianNeighbourhoodTheme,
      mexicanPuebloMagicoTheme,
      matrixTheme,
      sodaPopTheme,
    ];
    themes.forEach((theme) => this.themes.set(theme.id, theme));
  }

  /**
   * Get a theme by its ID.
   */
  get(id: string): Theme | undefined {
    return this.themes.get(id);
  }

  /**
   * Get all registered theme IDs.
   */
  getAllIds(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Get all registered themes.
   */
  getAll(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get the number of registered themes.
   */
  get count(): number {
    return this.themes.size;
  }
}

/**
 * Resolve a theme from an optional seed.
 * If seed is provided, uses deterministic selection.
 * Otherwise, uses random selection.
 */
export function resolveTheme(registry: ThemeRegistry, seed?: number): Theme {
  const themes = registry.getAll();
  if (themes.length === 0) {
    throw new Error("No themes registered");
  }
  const index = seed !== undefined ? seed % themes.length : Math.floor(Math.random() * themes.length);
  return themes[index];
}

/**
 * Apply a theme to a Phaser scene.
 * This delegates to the theme's own generate methods for:
 * - Background texture generation
 * - Ground texture generation
 * - Entity sprite generation (cat, roomba, food, drumstick)
 */
export function applyTheme(scene: Phaser.Scene, theme: Theme): void {
  // Generate all theme textures
  theme.generateBackground(scene);
  theme.generateGround(scene);
  theme.generateCat(scene);
  theme.generateRoomba(scene);
  theme.generateFood(scene);
  theme.generateDrumstick(scene);
}

/**
 * Singleton registry instance for convenience.
 */
export const themeRegistry = new ThemeRegistry();
