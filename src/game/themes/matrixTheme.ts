import Phaser from "phaser";
import type { Theme } from "./types";

export const matrixTheme: Theme = {
  id: "matrix",
  name: "The Matrix",
  colors: {
    background: 0x0a0a0a,
    sky: 0x000000,
    platform: 0x0d4d0d,
    platformAccent: 0x00ff00,
    cat: 0x1a1a1a,
    catAccent: 0x00ff00,
    roomba: 0x1a1a1a,
    roombaAccent: 0x00ff00,
    food: 0x00aa00,
    foodAccent: 0x00ff00,
    drumstick: 0x00dd00,
    drumstickAccent: 0x00ff00,
  },
  ui: {
    scrim: "rgba(0, 0, 0, 0.78)",
    cardFrom: "#061406",
    cardTo: "#0a1f0a",
    border: "#00ff00",
    text: "#c8ffc8",
    muted: "#6fdc6f",
    accent: "#00ff00",
    buttonBorder: "#00ff00",
    buttonFrom: "#0d4d0d",
    buttonTo: "#083308",
    buttonShadow: "rgba(0, 255, 0, 0.35)",
    titleShadow: "rgba(0, 255, 0, 0.55)",
    dark: true,
  },
  backgroundElements: [],
  groundStyle: "tech",

  generateBackground: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Black background
    graphics.fillStyle(0x0a0a0a, 1);
    graphics.fillRect(0, 0, 960, 540);

    // Matrix rain effect (falling characters)
    graphics.fillStyle(0x00ff00, 0.15);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    for (let i = 0; i < 80; i++) {
      const x = Math.floor(Math.random() * 960);
      const y = Math.floor(Math.random() * 540);
      const brightness = Math.random();
      graphics.fillStyle(0x00ff00, 0.1 + brightness * 0.4);
      for (let j = 0; j < 5 + Math.floor(Math.random() * 10); j++) {
        graphics.fillRect(x, y + j * 12, 8, 10);
      }
    }

    // Glowing vertical lines (data streams)
    graphics.fillStyle(0x00ff00, 0.3);
    for (let i = 0; i < 30; i++) {
      const x = Math.floor(Math.random() * 960);
      const height = 100 + Math.floor(Math.random() * 300);
      graphics.fillRect(x, Math.floor(Math.random() * 540), 2, height);
    }

    // High-tech grid overlay
    graphics.lineStyle(1, 0x00ff00, 0.1);
    for (let x = 0; x < 960; x += 40) {
      graphics.lineBetween(x, 0, x, 540);
    }
    for (let y = 0; y < 540; y += 40) {
      graphics.lineBetween(0, y, 960, y);
    }

    // Cyberpunk buildings / data structures
    const drawDataStructure = (x: number, baseY: number, width: number, height: number) => {
      // Main structure
      graphics.fillStyle(0x0d1a0d, 0.9);
      graphics.fillRect(x, baseY - height, width, height);

      // Glowing outline
      graphics.lineStyle(2, 0x00ff00, 0.8);
      graphics.strokeRect(x, baseY - height, width, height);

      // Windows / data ports
      graphics.fillStyle(0x00ff00, 0.4);
      const windowW = width * 0.2;
      const windowH = height * 0.15;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          graphics.fillRect(
            x + width * 0.2 + col * width * 0.35,
            baseY - height * 0.85 + row * height * 0.25,
            windowW,
            windowH
          );
        }
      }

      // Antenna / data spikes
      graphics.fillStyle(0x00ff00, 0.6);
      graphics.fillRect(x + width * 0.4, baseY - height - 20, 4, 20);
      graphics.fillRect(x + width * 0.55, baseY - height - 30, 4, 30);
    };

    drawDataStructure(40, 420, 100, 120);
    drawDataStructure(180, 400, 120, 140);
    drawDataStructure(350, 410, 90, 130);
    drawDataStructure(500, 390, 130, 150);
    drawDataStructure(680, 405, 110, 135);
    drawDataStructure(840, 395, 100, 145);

    // Floating data nodes
    graphics.fillStyle(0x00ff00, 0.5);
    for (let i = 0; i < 15; i++) {
      const x = Math.floor(Math.random() * 960);
      const y = 50 + Math.floor(Math.random() * 200);
      graphics.fillCircle(x, y, 3);
      graphics.lineStyle(1, 0x00ff00, 0.3);
      graphics.strokeCircle(x, y, 8);
    }

    graphics.generateTexture("theme-background", 960, 540);
    graphics.destroy();
  },

  generateGround: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();
    const size = 32;

    // Dark tech platform base
    graphics.fillStyle(0x0d4d0d, 1);
    graphics.fillRect(0, 0, size, size);

    // Circuit board pattern
    graphics.fillStyle(0x00ff00, 0.3);
    graphics.fillRect(0, 14, 12, 4);
    graphics.fillRect(20, 14, 12, 4);
    graphics.fillRect(14, 0, 4, 12);
    graphics.fillRect(14, 20, 4, 12);

    // Connection nodes
    graphics.fillStyle(0x00ff00, 0.6);
    graphics.fillCircle(6, 16, 2);
    graphics.fillCircle(26, 16, 2);
    graphics.fillCircle(16, 6, 2);
    graphics.fillCircle(16, 26, 2);

    // Central processor
    graphics.fillStyle(0x00aa00, 0.4);
    graphics.fillRect(10, 10, 12, 12);

    graphics.generateTexture("ground", size, size);
    graphics.destroy();
  },

  generateCat: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Glitch cat / digital entity
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(6, 16, 16, 8);
    graphics.fillRect(8, 10, 12, 6);
    graphics.fillRect(8, 6, 12, 8);

    // Glowing green accents
    graphics.fillStyle(0x00ff00, 0.8);
    graphics.fillRect(6, 4, 4, 4);
    graphics.fillRect(18, 4, 4, 4);
    graphics.fillRect(22, 14, 4, 10);

    // Digital eyes
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(11, 10, 2, 2);
    graphics.fillRect(15, 10, 2, 2);

    // Glitch effect
    graphics.fillStyle(0x00ff00, 0.5);
    graphics.fillRect(4, 12, 4, 1);
    graphics.fillRect(20, 12, 4, 1);
    graphics.fillRect(14, 14, 2, 1);

    // Scanlines
    graphics.fillStyle(0x00ff00, 0.2);
    for (let i = 0; i < 28; i += 4) {
      graphics.fillRect(0, i, 28, 1);
    }

    graphics.generateTexture("cat", 28, 28);
    graphics.destroy();
  },

  generateRoomba: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Robot sentinel
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRoundedRect(0, 6, 28, 16, 4);

    // Glowing core
    graphics.fillStyle(0x00ff00, 0.8);
    graphics.fillRect(10, 10, 8, 8);

    // Sensor array
    graphics.fillStyle(0x00ff00, 0.5);
    graphics.fillRect(2, 10, 4, 4);
    graphics.fillRect(22, 10, 4, 4);

    // Hover effect
    graphics.fillStyle(0x00ff00, 0.3);
    graphics.fillRect(4, 22, 20, 2);

    graphics.generateTexture("roomba", 28, 24);
    graphics.destroy();
  },

  generateFood: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Data packet / power orb
    graphics.fillStyle(0x00aa00, 1);
    graphics.fillRoundedRect(0, 2, 20, 12, 4);

    // Glowing core
    graphics.fillStyle(0x00ff00, 0.8);
    graphics.fillRect(4, 4, 12, 8);

    // Binary decoration
    graphics.fillStyle(0x00ff00, 0.4);
    graphics.fillRect(6, 6, 2, 2);
    graphics.fillRect(10, 6, 2, 2);
    graphics.fillRect(14, 6, 2, 2);
    graphics.fillRect(8, 9, 2, 2);
    graphics.fillRect(12, 9, 2, 2);

    graphics.generateTexture("food", 20, 16);
    graphics.destroy();
  },

  generateDrumstick: (scene: Phaser.Scene) => {
    const graphics = scene.add.graphics();

    // Power core / upgrade module
    graphics.fillStyle(0x00dd00, 1);
    graphics.fillRect(2, 2, 18, 14);

    // Inner glow
    graphics.fillStyle(0x00ff00, 0.9);
    graphics.fillRect(4, 4, 14, 10);

    // Circuit pattern
    graphics.fillStyle(0x00aa00, 1);
    graphics.fillRect(6, 6, 2, 6);
    graphics.fillRect(10, 6, 2, 6);
    graphics.fillRect(14, 6, 2, 6);

    // Top connector
    graphics.fillStyle(0x00ff00, 0.6);
    graphics.fillRect(8, 0, 6, 4);

    graphics.generateTexture("drumstick", 22, 20);
    graphics.destroy();
  },
};
