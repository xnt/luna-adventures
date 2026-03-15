import { describe, it, expect, beforeEach } from "vitest";
import {
  ThemeRegistry,
  resolveTheme,
  applyTheme,
  themeRegistry,
} from "../themeService";
import type { Theme } from "../types";

describe("ThemeRegistry", () => {
  it("registers all themes on construction", () => {
    const registry = new ThemeRegistry();
    expect(registry.count).toBe(4);
    expect(registry.getAllIds()).toContain("canadian-neighbourhood");
    expect(registry.getAllIds()).toContain("mexican-pueblo-magico");
    expect(registry.getAllIds()).toContain("matrix");
    expect(registry.getAllIds()).toContain("soda-pop");
  });

  it("gets theme by id", () => {
    const registry = new ThemeRegistry();
    const theme = registry.get("matrix");
    expect(theme).toBeDefined();
    expect(theme?.id).toBe("matrix");
  });

  it("returns undefined for unknown id", () => {
    const registry = new ThemeRegistry();
    expect(registry.get("unknown")).toBeUndefined();
  });

  it("getAll returns all themes", () => {
    const registry = new ThemeRegistry();
    const themes = registry.getAll();
    expect(themes.length).toBe(4);
  });
});

describe("resolveTheme", () => {
  it("returns deterministic theme with seed", () => {
    const registry = new ThemeRegistry();
    const theme1 = resolveTheme(registry, 42);
    const theme2 = resolveTheme(registry, 42);
    expect(theme1.id).toBe(theme2.id);
  });

  it("returns different themes for different seeds", () => {
    const registry = new ThemeRegistry();
    const theme1 = resolveTheme(registry, 0);
    const theme2 = resolveTheme(registry, 1);
    // With 4 themes, seeds 0 and 1 should give different themes
    expect(theme1.id).not.toBe(theme2.id);
  });

  it("cycles through themes with different seeds", () => {
    const registry = new ThemeRegistry();
    const themes = new Set<string>();
    for (let i = 0; i < 4; i++) {
      const theme = resolveTheme(registry, i);
      themes.add(theme.id);
    }
    // Should have seen all 4 themes
    expect(themes.size).toBe(4);
  });

  it("singleton registry has themes", () => {
    expect(themeRegistry.count).toBe(4);
  });
});

describe("applyTheme", () => {
  it("calls all theme generate methods", () => {
    const mockScene = {
      add: {
        graphics: () => ({
          fillStyle: () => {},
          fillRect: () => {},
          generateTexture: () => {},
          destroy: () => {},
          fillRoundedRect: () => {},
          fillCircle: () => {},
          fillTriangle: () => {},
          lineStyle: () => {},
          lineBetween: () => {},
          strokeRect: () => {},
        }),
      },
    } as unknown as Phaser.Scene;

    const generateCalls: string[] = [];
    const mockTheme: Theme = {
      id: "test",
      name: "Test Theme",
      colors: {} as Theme["colors"],
      backgroundElements: [],
      groundStyle: "solid",
      generateBackground: () => generateCalls.push("background"),
      generateGround: () => generateCalls.push("ground"),
      generateCat: () => generateCalls.push("cat"),
      generateRoomba: () => generateCalls.push("roomba"),
      generateFood: () => generateCalls.push("food"),
      generateDrumstick: () => generateCalls.push("drumstick"),
    };

    applyTheme(mockScene, mockTheme);

    expect(generateCalls).toContain("background");
    expect(generateCalls).toContain("ground");
    expect(generateCalls).toContain("cat");
    expect(generateCalls).toContain("roomba");
    expect(generateCalls).toContain("food");
    expect(generateCalls).toContain("drumstick");
  });
});
