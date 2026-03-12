import Phaser from "phaser";
import type { Theme } from "./types";

export const mexicanPuebloMagicoTheme: Theme = {
  id: "mexican-pueblo-magico",
  name: "Pueblo Mágico",
  colors: {
    background: 0x87ceeb,
    sky: 0x7ec8e3,
    platform: 0x8b7355,
    platformAccent: 0xa0826d,
    cat: 0xffd700,
    catAccent: 0xff6b35,
    roomba: 0xcd853f,
    roombaAccent: 0x8b4513,
    food: 0xff6b35,
    foodAccent: 0xffd700,
    drumstick: 0x8b4513,
    drumstickAccent: 0xffe4b5,
  },
  backgroundElements: [],
  groundStyle: "cobblestone",

  generateBackground: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Bright Mexican sky
    graphics.fillStyle(0x87ceeb, 1);
    graphics.fillRect(0, 0, 960, 350);
    graphics.fillStyle(0x7ec8e3, 0.6);
    graphics.fillRect(0, 250, 960, 150);

    // Sun
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(800, 80, 40);
    graphics.fillStyle(0xfff8dc, 0.6);
    graphics.fillCircle(800, 80, 50);

    // Mountains in background
    graphics.fillStyle(0x4a6741, 0.8);
    graphics.fillTriangle(0, 350, 200, 150, 400, 350);
    graphics.fillTriangle(300, 350, 500, 180, 700, 350);
    graphics.fillTriangle(600, 350, 800, 200, 960, 350);

    // Colorful colonial buildings
    const drawBuilding = (x: number, baseY: number, width: number, height: number, color: number, accentColor: number) => {
      // Main building
      graphics.fillStyle(color, 1);
      graphics.fillRect(x, baseY - height, width, height);

      // Roof/terracotta tiles
      graphics.fillStyle(0xcd5c5c, 1);
      graphics.fillRect(x, baseY - height, width, 8);

      // Windows with colorful frames
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(x + width * 0.15, baseY - height * 0.75, width * 0.2, height * 0.2);
      graphics.fillRect(x + width * 0.55, baseY - height * 0.75, width * 0.2, height * 0.2);
      graphics.fillStyle(accentColor, 1);
      graphics.fillRect(x + width * 0.17, baseY - height * 0.73, width * 0.16, height * 0.16);
      graphics.fillRect(x + width * 0.57, baseY - height * 0.73, width * 0.16, height * 0.16);

      // Door
      graphics.fillStyle(0x8b4513, 1);
      graphics.fillRect(x + width * 0.35, baseY - height * 0.4, width * 0.3, height * 0.4);

      // Decorative trim
      graphics.fillStyle(0xffffff, 0.8);
      graphics.fillRect(x, baseY - height * 0.5, width, 3);
    };

    drawBuilding(20, 400, 90, 80, 0xff6b6b, 0x4169e1); // Pink/red
    drawBuilding(130, 380, 100, 100, 0xffd93d, 0x6b4423); // Yellow
    drawBuilding(250, 395, 85, 85, 0xff8c42, 0x2e8b57); // Orange
    drawBuilding(360, 375, 110, 105, 0x6bcb77, 0xff69b4); // Green
    drawBuilding(490, 390, 95, 90, 0x4d96ff, 0xffd700); // Blue
    drawBuilding(610, 385, 100, 95, 0xff69b4, 0x00ced1); // Pink
    drawBuilding(730, 395, 90, 85, 0xffa07a, 0x9370db); // Salmon
    drawBuilding(840, 380, 100, 100, 0xdda0dd, 0x20b2aa); // Plum

    // Central parish church
    const drawParish = (x: number, baseY: number) => {
      // Main church body
      graphics.fillStyle(0xfff8dc, 1);
      graphics.fillRect(x, baseY - 100, 120, 100);

      // Towers
      graphics.fillRect(x - 20, baseY - 130, 35, 130);
      graphics.fillRect(x + 105, baseY - 130, 35, 130);

      // Tower tops (domes)
      graphics.fillStyle(0xffd700, 1);
      graphics.fillCircle(x - 2, baseY - 140, 20);
      graphics.fillCircle(x + 122, baseY - 140, 20);

      // Crosses
      graphics.fillStyle(0x8b4513, 1);
      graphics.fillRect(x - 4, baseY - 165, 4, 25);
      graphics.fillRect(x - 10, baseY - 158, 16, 4);
      graphics.fillRect(x + 120, baseY - 165, 4, 25);
      graphics.fillRect(x + 114, baseY - 158, 16, 4);

      // Main dome
      graphics.fillStyle(0x4169e1, 1);
      graphics.fillCircle(x + 60, baseY - 110, 35);
      graphics.fillStyle(0xffd700, 1);
      graphics.fillCircle(x + 60, baseY - 145, 8);

      // Windows (stained glass)
      graphics.fillStyle(0x4169e1, 0.8);
      graphics.fillRect(x + 45, baseY - 80, 30, 40);
      graphics.fillStyle(0xffd700, 0.6);
      graphics.fillRect(x + 50, baseY - 75, 20, 30);

      // Door
      graphics.fillStyle(0x8b4513, 1);
      graphics.fillRoundedRect(x + 40, baseY - 50, 40, 50, 10);
    };

    drawParish(420, 480);

    // Papel picado (paper banners)
    const drawPapelPicado = (x: number, y: number, color: number) => {
      graphics.fillStyle(color, 0.9);
      for (let i = 0; i < 5; i++) {
        graphics.fillTriangle(x + i * 25, y, x + 12 + i * 25, y + 20, x + 25 + i * 25, y);
      }
    };

    drawPapelPicado(50, 320, 0xff6b6b);
    drawPapelPicado(200, 300, 0xffd93d);
    drawPapelPicado(400, 310, 0x6bcb77);
    drawPapelPicado(600, 305, 0xff69b4);
    drawPapelPicado(780, 315, 0x4d96ff);

    // Cacti
    const drawCactus = (x: number, baseY: number, scale: number) => {
      graphics.fillStyle(0x228b22, 1);
      graphics.fillRect(x, baseY - 40 * scale, 15 * scale, 40 * scale);
      graphics.fillRect(x - 15 * scale, baseY - 30 * scale, 15 * scale, 25 * scale);
      graphics.fillRect(x + 15 * scale, baseY - 25 * scale, 15 * scale, 20 * scale);
      // Flowers
      graphics.fillStyle(0xff69b4, 1);
      graphics.fillCircle(x + 7 * scale, baseY - 42 * scale, 4 * scale);
    };

    drawCactus(50, 440, 0.8);
    drawCactus(900, 435, 1);

    graphics.generateTexture("theme-background", 960, 540);
    graphics.destroy();
  },

  generateGround: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();
    const size = 32;

    // Cobblestone base
    graphics.fillStyle(0x8b7355, 1);
    graphics.fillRect(0, 0, size, size);

    // Cobblestone pattern
    graphics.fillStyle(0xa0826d, 1);
    graphics.fillRect(0, 0, 14, 14);
    graphics.fillRect(18, 0, 14, 14);
    graphics.fillRect(9, 18, 14, 14);

    // Stone highlights
    graphics.fillStyle(0xb8a089, 0.6);
    graphics.fillRect(2, 2, 4, 4);
    graphics.fillRect(20, 2, 4, 4);
    graphics.fillRect(11, 20, 4, 4);

    // Stone shadows
    graphics.fillStyle(0x6b5344, 0.5);
    graphics.fillRect(10, 10, 4, 4);
    graphics.fillRect(28, 10, 4, 4);
    graphics.fillRect(19, 28, 4, 4);

    graphics.generateTexture("ground", size, size);
    graphics.destroy();
  },

  generateCat: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Orange tabby cat (gato naranja)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(6, 16, 16, 8);
    graphics.fillRect(8, 10, 12, 6);
    graphics.fillRect(8, 6, 12, 8);

    // Tabby stripes
    graphics.fillStyle(0xff6b35, 1);
    graphics.fillRect(6, 4, 4, 4);
    graphics.fillRect(18, 4, 4, 4);
    graphics.fillRect(10, 8, 2, 4);
    graphics.fillRect(16, 8, 2, 4);
    graphics.fillRect(22, 14, 4, 10);

    // Green eyes
    graphics.fillStyle(0x228b22, 1);
    graphics.fillRect(11, 10, 2, 2);
    graphics.fillRect(15, 10, 2, 2);

    graphics.fillStyle(0xff69b4, 1);
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

    // Wooden cart / market cart style
    graphics.fillStyle(0xcd853f, 1);
    graphics.fillRoundedRect(0, 6, 28, 18, 3);

    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(4, 10, 20, 8);

    // Wheels
    graphics.fillStyle(0x4a3728, 1);
    graphics.fillCircle(6, 22, 4);
    graphics.fillCircle(22, 22, 4);

    // Decorative paint
    graphics.fillStyle(0xff6b35, 0.8);
    graphics.fillRect(8, 8, 12, 2);

    graphics.generateTexture("roomba", 28, 24);
    graphics.destroy();
  },

  generateFood: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Tamale
    graphics.fillStyle(0x8b7355, 1);
    graphics.fillRoundedRect(0, 2, 20, 12, 4);

    // Corn husk wrap
    graphics.fillStyle(0x9acd32, 0.7);
    graphics.fillRect(2, 4, 16, 8);

    graphics.fillStyle(0xffd700, 0.6);
    graphics.fillRect(6, 6, 8, 4);

    graphics.generateTexture("food", 20, 16);
    graphics.destroy();
  },

  generateDrumstick: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Churro treat
    graphics.fillStyle(0xd4a574, 1);
    graphics.fillRect(2, 4, 18, 12);

    // Ridged texture
    graphics.fillStyle(0xc49464, 1);
    for (let i = 0; i < 5; i++) {
      graphics.fillRect(4 + i * 4, 4, 2, 12);
    }

    // Cinnamon sugar dusting
    graphics.fillStyle(0xffffff, 0.4);
    graphics.fillRect(4, 6, 14, 2);
    graphics.fillRect(6, 10, 12, 2);

    graphics.generateTexture("drumstick", 22, 20);
    graphics.destroy();
  },
};
