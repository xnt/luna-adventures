import type { Theme } from "./types";
import { canadianNeighbourhoodTheme } from "./canadianNeighbourhood";
import { mexicanPuebloMagicoTheme } from "./mexicanPuebloMagico";
import { matrixTheme } from "./matrixTheme";
import { sodaPopTheme } from "./sodaPopTheme";

export const allThemes: Theme[] = [
  canadianNeighbourhoodTheme,
  mexicanPuebloMagicoTheme,
  matrixTheme,
  sodaPopTheme,
];

export const getRandomTheme = (seed?: number): Theme => {
  const index = seed !== undefined ? seed % allThemes.length : Math.floor(Math.random() * allThemes.length);
  return allThemes[index];
};

export type { Theme, ThemeColors, ThemeBackgroundElement } from "./types";
