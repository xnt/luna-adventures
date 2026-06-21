export interface ThemeColors {
  background: number;
  sky: number;
  platform: number;
  platformAccent: number;
  cat: number;
  catAccent: number;
  roomba: number;
  roombaAccent: number;
  food: number;
  foodAccent: number;
  drumstick: number;
  drumstickAccent: number;
}

/** CSS/DOM styling derived from a theme for non-Phaser UI (e.g. end screen). */
export interface ThemeUiPalette {
  /** Backdrop over the game canvas */
  scrim: string;
  /** Card surface gradient start */
  cardFrom: string;
  /** Card surface gradient end */
  cardTo: string;
  /** Card border */
  border: string;
  /** Primary text on the card */
  text: string;
  /** Muted / secondary text */
  muted: string;
  /** Accent (kicker, emphasis) */
  accent: string;
  /** Button border */
  buttonBorder: string;
  /** Button gradient start */
  buttonFrom: string;
  /** Button gradient end */
  buttonTo: string;
  /** Button depth/shadow tint */
  buttonShadow: string;
  /** Title text-shadow color */
  titleShadow: string;
  /** Prefer light text on dark themes */
  dark?: boolean;
}

export interface ThemeBackgroundElement {
  type: "building" | "decoration" | "cloud" | "particle";
  color: number;
  accentColor?: number;
  width: number;
  height: number;
  y: number;
  scrollFactor: number;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  /** Optional explicit UI palette; otherwise derived from colors. */
  ui?: ThemeUiPalette;
  backgroundElements: ThemeBackgroundElement[];
  groundStyle: "solid" | "cobblestone" | "tech" | "snowy";
  generateBackground: (scene: Phaser.Scene) => void;
  generateGround: (scene: Phaser.Scene) => void;
  generateCat: (scene: Phaser.Scene) => void;
  generateRoomba: (scene: Phaser.Scene) => void;
  generateFood: (scene: Phaser.Scene) => void;
  generateDrumstick: (scene: Phaser.Scene) => void;
}
