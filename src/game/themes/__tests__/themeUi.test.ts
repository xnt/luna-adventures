import { describe, it, expect } from "vitest";
import { applyThemeUiVars, colorToCss, deriveThemeUiPalette, resolveThemeUiPalette } from "../themeUi";
import { matrixTheme } from "../matrixTheme";
import { sodaPopTheme } from "../sodaPopTheme";
import { canadianNeighbourhoodTheme } from "../canadianNeighbourhood";

describe("themeUi", () => {
  it("converts Phaser colors to css hex", () => {
    expect(colorToCss(0x00ff00)).toBe("#00ff00");
    expect(colorToCss(0xff)).toBe("#0000ff");
  });

  it("uses explicit matrix ui palette", () => {
    const palette = resolveThemeUiPalette(matrixTheme);
    expect(palette.dark).toBe(true);
    expect(palette.accent).toBe("#00ff00");
  });

  it("derives a light palette for bright themes", () => {
    const palette = deriveThemeUiPalette(canadianNeighbourhoodTheme.colors);
    expect(palette.dark).toBe(false);
    expect(palette.border).toBe("#b8c9d9");
  });

  it("derives soda-pop accents from its red palette", () => {
    const palette = deriveThemeUiPalette(sodaPopTheme.colors);
    expect(palette.border).toBe("#c41e3a");
  });

  it("applies css variables and dataset to an element", () => {
    const el = document.createElement("div");
    applyThemeUiVars(el, canadianNeighbourhoodTheme);
    expect(el.dataset.themeId).toBe("canadian-neighbourhood");
    expect(el.style.getPropertyValue("--theme-card-from")).toMatch(/^#/);
  });
});
