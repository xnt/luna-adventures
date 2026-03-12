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
  backgroundElements: ThemeBackgroundElement[];
  groundStyle: "solid" | "cobblestone" | "tech" | "snowy";
  generateBackground: (scene: Phaser.Scene) => void;
  generateGround: (scene: Phaser.Scene) => void;
  generateCat: (scene: Phaser.Scene) => void;
  generateRoomba: (scene: Phaser.Scene) => void;
  generateFood: (scene: Phaser.Scene) => void;
  generateDrumstick: (scene: Phaser.Scene) => void;
}
