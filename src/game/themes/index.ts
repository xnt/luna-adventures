/**
 * Theme Service - Centralized theming system for Luna Adventures.
 *
 * This module provides:
 * - ThemeRegistry: Registry of all available themes
 * - resolveTheme(registry, seed?): Select a theme (deterministic or random)
 * - applyTheme(scene, theme): Apply a theme to a Phaser scene
 *
 * Usage:
 *   import { themeRegistry, resolveTheme, applyTheme } from "./themeService";
 *   const theme = resolveTheme(themeRegistry, seed);
 *   applyTheme(scene, theme);
 */

export {
  ThemeRegistry,
  resolveTheme,
  applyTheme,
  themeRegistry,
} from "./themeService";

export type { Theme, ThemeColors, ThemeBackgroundElement } from "./types";

// Backward compatibility exports
export { canadianNeighbourhoodTheme } from "./canadianNeighbourhood";
export { mexicanPuebloMagicoTheme } from "./mexicanPuebloMagico";
export { matrixTheme } from "./matrixTheme";
export { sodaPopTheme } from "./sodaPopTheme";
