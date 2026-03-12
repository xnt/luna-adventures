import Phaser from "phaser";
import type { Theme } from "./types";

export const canadianNeighbourhoodTheme: Theme = {
  id: "canadian-neighbourhood",
  name: "Canadian Neighbourhood",
  colors: {
    background: 0xd4e5f7,
    sky: 0xc8ddf4,
    platform: 0xf0f4f8,
    platformAccent: 0xb8c9d9,
    cat: 0xe8e4dc,
    catAccent: 0x8b7355,
    roomba: 0x4a5568,
    roombaAccent: 0x2d3748,
    food: 0xc4a574,
    foodAccent: 0x8b6914,
    drumstick: 0xd4a574,
    drumstickAccent: 0xffe4b5,
  },
  backgroundElements: [],
  groundStyle: "snowy",

  generateBackground: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Snowy sky gradient effect
    graphics.fillStyle(0xd4e5f7, 1);
    graphics.fillRect(0, 0, 960, 300);
    graphics.fillStyle(0xc8ddf4, 0.8);
    graphics.fillRect(0, 200, 960, 150);

    // Chalet-style homes in background
    const drawChalet = (x: number, baseY: number, width: number, height: number, wallColor: number, roofColor: number) => {
      // Main building
      graphics.fillStyle(wallColor, 1);
      graphics.fillRect(x, baseY - height, width, height);

      // Steep roof with snow
      graphics.fillStyle(roofColor, 1);
      graphics.fillTriangle(x, baseY - height, x + width / 2, baseY - height - height * 0.6, x + width, baseY - height);

      // Snow on roof
      graphics.fillStyle(0xffffff, 0.9);
      graphics.fillTriangle(x + 2, baseY - height, x + width / 2, baseY - height - height * 0.55, x + width - 2, baseY - height);

      // Windows
      graphics.fillStyle(0xffd700, 0.8);
      const windowSize = width * 0.15;
      graphics.fillRect(x + width * 0.2, baseY - height * 0.7, windowSize, windowSize);
      graphics.fillRect(x + width * 0.6, baseY - height * 0.7, windowSize, windowSize);

      // Door
      graphics.fillStyle(0x654321, 1);
      graphics.fillRect(x + width * 0.4, baseY - height * 0.4, width * 0.2, height * 0.4);
    };

    drawChalet(60, 380, 80, 60, 0xf5f0e6, 0x8b4513);
    drawChalet(200, 360, 100, 80, 0xe8dcc8, 0x6b4423);
    drawChalet(380, 370, 90, 70, 0xf0e6d6, 0x7a5230);
    drawChalet(550, 355, 110, 85, 0xf5efe5, 0x8b5a2b);
    drawChalet(720, 365, 95, 75, 0xebe0d0, 0x6d4c2a);
    drawChalet(870, 375, 85, 65, 0xf2e8dc, 0x7c5030);

    // Pine trees
    const drawPineTree = (x: number, baseY: number, scale: number) => {
      graphics.fillStyle(0x2d5a3d, 1);
      graphics.fillTriangle(x, baseY, x - 15 * scale, baseY - 20 * scale, x + 15 * scale, baseY - 20 * scale);
      graphics.fillTriangle(x, baseY - 15 * scale, x - 20 * scale, baseY - 45 * scale, x + 20 * scale, baseY - 45 * scale);
      graphics.fillTriangle(x, baseY - 35 * scale, x - 25 * scale, baseY - 75 * scale, x + 25 * scale, baseY - 75 * scale);
      graphics.fillStyle(0x4a3728, 1);
      graphics.fillRect(x - 4 * scale, baseY, 8 * scale, 15 * scale);
      // Snow on branches
      graphics.fillStyle(0xffffff, 0.7);
      graphics.fillTriangle(x, baseY - 18 * scale, x - 12 * scale, baseY - 20 * scale, x + 12 * scale, baseY - 20 * scale);
      graphics.fillTriangle(x, baseY - 43 * scale, x - 15 * scale, baseY - 45 * scale, x + 15 * scale, baseY - 45 * scale);
    };

    drawPineTree(30, 420, 1);
    drawPineTree(170, 430, 0.8);
    drawPineTree(340, 415, 1.1);
    drawPineTree(500, 425, 0.9);
    drawPineTree(680, 420, 1);
    drawPineTree(850, 430, 0.85);

    // Falling snowflakes
    graphics.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * 960;
      const sy = Math.random() * 400;
      const size = 2 + Math.random() * 3;
      graphics.fillCircle(sx, sy, size);
    }

    graphics.generateTexture("theme-background", 960, 540);
    graphics.destroy();
  },

  generateGround: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();
    const size = 32;

    // Snowy ground base
    graphics.fillStyle(0xf0f4f8, 1);
    graphics.fillRect(0, 0, size, size);

    // Snow texture
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillCircle(8, 8, 3);
    graphics.fillCircle(24, 12, 4);
    graphics.fillCircle(16, 24, 3);
    graphics.fillCircle(6, 26, 2);
    graphics.fillCircle(28, 28, 3);

    // Subtle ice patches
    graphics.fillStyle(0xd4e5f7, 0.4);
    graphics.fillRect(4, 14, 10, 4);
    graphics.fillRect(18, 6, 8, 3);

    graphics.generateTexture("ground", size, size);
    graphics.destroy();
  },

  generateCat: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Fluffy winter cat
    graphics.fillStyle(0xe8e4dc, 1);
    graphics.fillRect(6, 16, 16, 8);
    graphics.fillRect(8, 10, 12, 6);
    graphics.fillRect(8, 6, 12, 8);

    // Grey markings
    graphics.fillStyle(0x8b7355, 1);
    graphics.fillRect(6, 4, 4, 4);
    graphics.fillRect(18, 4, 4, 4);
    graphics.fillRect(22, 14, 4, 10);

    // Eyes (blue for winter cat)
    graphics.fillStyle(0x6ab7d1, 1);
    graphics.fillRect(11, 10, 2, 2);
    graphics.fillRect(15, 10, 2, 2);

    graphics.fillStyle(0xf29bb2, 1);
    graphics.fillRect(13, 12, 2, 2);

    graphics.fillStyle(0x2d2a45, 1);
    graphics.fillRect(4, 12, 4, 1);
    graphics.fillRect(20, 12, 4, 1);
    graphics.fillRect(14, 14, 2, 1);

    graphics.generateTexture("cat", 28, 28);
    graphics.destroy();
  },

  generateRoomba: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Snow blower / winter roomba
    graphics.fillStyle(0x4a5568, 1);
    graphics.fillRoundedRect(0, 8, 28, 16, 4);

    graphics.fillStyle(0x2d3748, 1);
    graphics.fillRect(8, 12, 12, 6);

    // Snow clearing brush
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillRect(2, 20, 24, 3);

    graphics.generateTexture("roomba", 28, 24);
    graphics.destroy();
  },

  generateFood: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Maple cookie
    graphics.fillStyle(0xc4a574, 1);
    graphics.fillRoundedRect(0, 0, 20, 16, 6);

    // Maple leaf design
    graphics.fillStyle(0x8b6914, 1);
    graphics.fillRect(4, 4, 12, 6);
    graphics.fillRect(8, 2, 4, 10);

    graphics.generateTexture("food", 20, 16);
    graphics.destroy();
  },

  generateDrumstick: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Hot cocoa treat
    graphics.fillStyle(0xd4a574, 1);
    graphics.fillRoundedRect(2, 2, 18, 16, 6);

    graphics.fillStyle(0xffe4b5, 1);
    graphics.fillCircle(2, 16, 4);

    // Steam
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillRoundedRect(8, 0, 3, 6, 2);
    graphics.fillRoundedRect(12, 2, 3, 5, 2);

    graphics.generateTexture("drumstick", 22, 20);
    graphics.destroy();
  },
};
