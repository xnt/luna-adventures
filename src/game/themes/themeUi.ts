import type { Theme, ThemeColors, ThemeUiPalette } from "./types";

/** Convert a Phaser/hex number (0xRRGGBB) to a CSS #rrggbb string. */
export function colorToCss(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

function mixToward(color: number, target: number, amount: number): number {
  const ar = (color >> 16) & 0xff;
  const ag = (color >> 8) & 0xff;
  const ab = color & 0xff;
  const br = (target >> 16) & 0xff;
  const bg = (target >> 8) & 0xff;
  const bb = target & 0xff;
  const r = Math.round(ar + (br - ar) * amount);
  const g = Math.round(ag + (bg - ag) * amount);
  const b = Math.round(ab + (bb - ab) * amount);
  return (r << 16) | (g << 8) | b;
}

function luminance(color: number): number {
  const r = ((color >> 16) & 0xff) / 255;
  const g = ((color >> 8) & 0xff) / 255;
  const b = (color & 0xff) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function withAlpha(color: number, alpha: number): string {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Build a cohesive UI palette from theme entity/background colors.
 * Themes can override via `theme.ui` for hand-tuned results.
 */
export function deriveThemeUiPalette(colors: ThemeColors): ThemeUiPalette {
  const dark = luminance(colors.background) < 0.28;
  const accent = colors.platformAccent;
  const highlight = colors.foodAccent || colors.drumstickAccent || accent;
  const textBase = dark ? 0xe8ffe8 : mixToward(colors.background, 0x2a1830, 0.72);
  const mutedBase = dark ? mixToward(accent, 0xffffff, 0.35) : mixToward(textBase, 0xffffff, 0.25);
  const cardFrom = dark
    ? mixToward(colors.background, 0x000000, 0.15)
    : mixToward(colors.sky || colors.background, 0xffffff, 0.55);
  const cardTo = dark
    ? mixToward(colors.background, accent, 0.12)
    : mixToward(colors.background, 0xffffff, 0.35);

  return {
    scrim: withAlpha(dark ? 0x000000 : mixToward(colors.background, 0x2a1830, 0.5), dark ? 0.72 : 0.58),
    cardFrom: colorToCss(cardFrom),
    cardTo: colorToCss(cardTo),
    border: colorToCss(accent),
    text: colorToCss(textBase),
    muted: colorToCss(mutedBase),
    accent: colorToCss(accent),
    buttonBorder: colorToCss(highlight),
    buttonFrom: colorToCss(mixToward(highlight, 0xffffff, dark ? 0.08 : 0.45)),
    buttonTo: colorToCss(mixToward(accent, highlight, 0.35)),
    buttonShadow: withAlpha(accent, 0.32),
    titleShadow: dark ? withAlpha(accent, 0.45) : "rgba(255, 255, 255, 0.9)",
    dark,
  };
}

export function resolveThemeUiPalette(theme: Theme): ThemeUiPalette {
  return theme.ui ?? deriveThemeUiPalette(theme.colors);
}

/** Apply theme palette as CSS variables on an element (typically the end screen). */
export function applyThemeUiVars(element: HTMLElement, theme: Theme): void {
  const palette = resolveThemeUiPalette(theme);
  const style = element.style;
  style.setProperty("--theme-scrim", palette.scrim);
  style.setProperty("--theme-card-from", palette.cardFrom);
  style.setProperty("--theme-card-to", palette.cardTo);
  style.setProperty("--theme-border", palette.border);
  style.setProperty("--theme-text", palette.text);
  style.setProperty("--theme-muted", palette.muted);
  style.setProperty("--theme-accent", palette.accent);
  style.setProperty("--theme-button-border", palette.buttonBorder);
  style.setProperty("--theme-button-from", palette.buttonFrom);
  style.setProperty("--theme-button-to", palette.buttonTo);
  style.setProperty("--theme-button-shadow", palette.buttonShadow);
  style.setProperty("--theme-title-shadow", palette.titleShadow);
  element.dataset.themeId = theme.id;
  element.dataset.themeName = theme.name;
  element.classList.toggle("end-screen--dark", Boolean(palette.dark));
}
