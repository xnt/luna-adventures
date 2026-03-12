import Phaser from "phaser";
import type { Theme } from "./types";

export const sodaPopTheme: Theme = {
  id: "soda-pop",
  name: "Soda Pop World",
  colors: {
    background: 0xc41e3a,
    sky: 0xff6b6b,
    platform: 0xe8e8e8,
    platformAccent: 0xc41e3a,
    cat: 0xffffff,
    catAccent: 0xc41e3a,
    roomba: 0xc41e3a,
    roombaAccent: 0xffffff,
    food: 0xffd700,
    foodAccent: 0xffa500,
    drumstick: 0xff6b6b,
    drumstickAccent: 0xffffff,
  },
  backgroundElements: [],
  groundStyle: "solid",

  generateBackground: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Red gradient background
    graphics.fillStyle(0xc41e3a, 1);
    graphics.fillRect(0, 0, 960, 350);
    graphics.fillStyle(0xd42a46, 0.9);
    graphics.fillRect(0, 250, 960, 150);
    graphics.fillStyle(0xe43650, 0.8);
    graphics.fillRect(0, 350, 960, 190);

    // Fizzy bubbles floating up
    graphics.fillStyle(0xffffff, 0.4);
    for (let i = 0; i < 50; i++) {
      const x = Math.floor(Math.random() * 960);
      const y = Math.floor(Math.random() * 540);
      const size = 3 + Math.floor(Math.random() * 12);
      graphics.fillCircle(x, y, size);
      // Bubble highlight
      graphics.fillStyle(0xffffff, 0.6);
      graphics.fillCircle(x - size * 0.3, y - size * 0.3, size * 0.3);
      graphics.fillStyle(0xffffff, 0.4);
    }

    // Soda bottle shapes in background
    const drawSodaBottle = (x: number, baseY: number, scale: number) => {
      // Bottle body
      graphics.fillStyle(0xc41e3a, 0.6);
      graphics.fillRect(x, baseY - 80 * scale, 40 * scale, 80 * scale);

      // Bottle neck
      graphics.fillRect(x + 10 * scale, baseY - 110 * scale, 20 * scale, 30 * scale);

      // Cap
      graphics.fillStyle(0xffd700, 0.8);
      graphics.fillRect(x + 8 * scale, baseY - 120 * scale, 24 * scale, 12 * scale);

      // Label area
      graphics.fillStyle(0xffffff, 0.5);
      graphics.fillRect(x + 4 * scale, baseY - 60 * scale, 32 * scale, 40 * scale);

      // Fizz at top
      graphics.fillStyle(0xffffff, 0.7);
      for (let i = 0; i < 5; i++) {
        graphics.fillCircle(x + 10 * scale + Math.random() * 20 * scale, baseY - 130 * scale - Math.random() * 20 * scale, 3 * scale);
      }
    };

    drawSodaBottle(50, 450, 0.8);
    drawSodaBottle(180, 440, 1);
    drawSodaBottle(350, 445, 0.9);
    drawSodaBottle(520, 435, 1.1);
    drawSodaBottle(700, 440, 0.95);
    drawSodaBottle(850, 445, 0.85);

    // Ice cubes
    const drawIceCube = (x: number, y: number, size: number) => {
      graphics.fillStyle(0xb8e4f0, 0.6);
      graphics.fillRect(x, y, size, size);
      graphics.fillStyle(0xffffff, 0.4);
      graphics.fillRect(x + 2, y + 2, size * 0.4, size * 0.3);
    };

    drawIceCube(100, 380, 30);
    drawIceCube(250, 400, 25);
    drawIceCube(400, 390, 28);
    drawIceCube(600, 385, 32);
    drawIceCube(780, 395, 26);

    // Straw decorations
    graphics.fillStyle(0xffd700, 0.8);
    graphics.fillRect(300, 200, 8, 180);
    graphics.fillRect(600, 180, 8, 200);

    // Wave pattern at bottom
    graphics.fillStyle(0xffffff, 0.2);
    for (let i = 0; i < 960; i += 40) {
      graphics.fillCircle(i, 500, 30);
    }

    graphics.generateTexture("theme-background", 960, 540);
    graphics.destroy();
  },

  generateGround: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();
    const size = 32;

    // White/cream platform base
    graphics.fillStyle(0xe8e8e8, 1);
    graphics.fillRect(0, 0, size, size);

    // Red accent stripes
    graphics.fillStyle(0xc41e3a, 0.8);
    graphics.fillRect(0, 12, size, 8);

    // Wavy pattern
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillCircle(8, 8, 4);
    graphics.fillCircle(24, 8, 4);
    graphics.fillCircle(16, 24, 4);

    // Fizz bubbles
    graphics.fillStyle(0xc41e3a, 0.3);
    graphics.fillCircle(4, 4, 2);
    graphics.fillCircle(28, 4, 2);
    graphics.fillCircle(16, 16, 3);

    graphics.generateTexture("ground", size, size);
    graphics.destroy();
  },

  generateCat: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // White cream cat
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(6, 16, 16, 8);
    graphics.fillRect(8, 10, 12, 6);
    graphics.fillRect(8, 6, 12, 8);

    // Red accents
    graphics.fillStyle(0xc41e3a, 0.8);
    graphics.fillRect(6, 4, 4, 4);
    graphics.fillRect(18, 4, 4, 4);
    graphics.fillRect(22, 14, 4, 10);

    // Soda-bottle-green eyes
    graphics.fillStyle(0x228b22, 1);
    graphics.fillRect(11, 10, 2, 2);
    graphics.fillRect(15, 10, 2, 2);

    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(13, 12, 2, 2);

    graphics.fillStyle(0xc41e3a, 1);
    graphics.fillRect(4, 12, 4, 1);
    graphics.fillRect(20, 12, 4, 1);
    graphics.fillRect(14, 14, 2, 1);

    graphics.generateTexture("cat", 28, 28);
    graphics.destroy();
  },

  generateRoomba: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Soda can robot
    graphics.fillStyle(0xc41e3a, 1);
    graphics.fillRoundedRect(0, 4, 28, 20, 4);

    // White label
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillRect(4, 8, 20, 12);

    // Red stripe on label
    graphics.fillStyle(0xc41e3a, 0.8);
    graphics.fillRect(6, 12, 16, 4);

    // Pull tab
    graphics.fillStyle(0xffd700, 0.8);
    graphics.fillRect(10, 2, 8, 4);

    graphics.generateTexture("roomba", 28, 24);
    graphics.destroy();
  },

  generateFood: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Bottle cap treat
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(10, 8, 10);

    // Inner circle
    graphics.fillStyle(0xffa500, 1);
    graphics.fillCircle(10, 8, 6);

    // Shine
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillCircle(7, 5, 3);

    graphics.generateTexture("food", 20, 16);
    graphics.destroy();
  },

  generateDrumstick: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Full soda bottle power-up
    graphics.fillStyle(0xc41e3a, 1);
    graphics.fillRect(4, 4, 14, 16);

    // Neck
    graphics.fillRect(7, 0, 8, 6);

    // Cap
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(6, 0, 10, 4);

    // Label
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillRect(6, 8, 10, 8);

    // Fizz
    graphics.fillStyle(0xffffff, 0.7);
    graphics.fillCircle(8, 2, 2);
    graphics.fillCircle(14, 3, 2);

    graphics.generateTexture("drumstick", 22, 20);
    graphics.destroy();
  },
};
