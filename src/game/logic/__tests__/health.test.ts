import { applyImmunity, createHealth, damage, heal, isGameOver } from "../health";
import { GAME_CONFIG } from "../constants";

describe("health", () => {
  it("starts with max hp", () => {
    const health = createHealth();
    expect(health.hp).toBe(GAME_CONFIG.maxHp);
    expect(health.immuneUntil).toBe(0);
  });

  it("takes damage when not immune", () => {
    const health = createHealth();
    const next = damage(health, 1, 1000);
    expect(next.hp).toBe(GAME_CONFIG.maxHp - 1);
    expect(next.immuneUntil).toBeGreaterThan(1000);
  });

  it("ignores damage during immunity window", () => {
    const health = createHealth();
    const damaged = damage(health, 1, 1000);
    const next = damage(damaged, 1, damaged.immuneUntil - 100);
    expect(next.hp).toBe(damaged.hp);
  });

  it("heals but does not exceed max hp", () => {
    const health = createHealth();
    const damaged = damage(health, 2, 1000);
    const healed = heal(damaged, 2);
    expect(healed.hp).toBe(GAME_CONFIG.maxHp);
  });

  it("applies full heal and immunity", () => {
    const health = createHealth();
    const damaged = damage(health, 2, 1000);
    const buffed = applyImmunity(damaged, 2000);
    expect(buffed.hp).toBe(GAME_CONFIG.maxHp);
    expect(buffed.immuneUntil).toBe(2000 + GAME_CONFIG.buffDurationMs);
  });

  it("detects game over", () => {
    const health = createHealth();
    const damaged = damage(health, GAME_CONFIG.maxHp, 1000);
    expect(isGameOver(damaged)).toBe(true);
  });
});
