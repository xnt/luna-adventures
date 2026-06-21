import {
  applyImmunity,
  createHealth,
  damage,
  heal,
  isGameOver,
  isImmune,
  isStarPowerActive,
  isStarPowerExpiring,
  starPowerRemainingMs,
} from "../health";
import { GAME_CONFIG } from "../constants";

describe("health", () => {
  it("starts with max hp", () => {
    const health = createHealth();
    expect(health.hp).toBe(GAME_CONFIG.maxHp);
    expect(health.immuneUntil).toBe(0);
    expect(health.starPowerUntil).toBe(0);
  });

  it("takes damage when not immune", () => {
    const health = createHealth();
    const next = damage(health, 1, 1000);
    expect(next.hp).toBe(GAME_CONFIG.maxHp - 1);
    expect(next.immuneUntil).toBeGreaterThan(1000);
    expect(next.starPowerUntil).toBe(0);
  });

  it("ignores damage during immunity window", () => {
    const health = createHealth();
    const damaged = damage(health, 1, 1000);
    const next = damage(damaged, 1, damaged.immuneUntil - 100);
    expect(next.hp).toBe(damaged.hp);
  });

  it("post-hit i-frames are not star power", () => {
    const damaged = damage(createHealth(), 1, 1000);
    expect(isImmune(damaged, 1100)).toBe(true);
    expect(isStarPowerActive(damaged, 1100)).toBe(false);
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
    expect(buffed.starPowerUntil).toBe(2000 + GAME_CONFIG.buffDurationMs);
  });

  it("detects game over", () => {
    const health = createHealth();
    const damaged = damage(health, GAME_CONFIG.maxHp, 1000);
    expect(isGameOver(damaged)).toBe(true);
  });

  it("tracks star power remaining and expiry warning", () => {
    const buffed = applyImmunity(createHealth(), 1000);
    expect(isStarPowerActive(buffed, 1000)).toBe(true);
    expect(starPowerRemainingMs(buffed, 1000)).toBe(GAME_CONFIG.buffDurationMs);
    expect(isStarPowerExpiring(buffed, 1000, 1500)).toBe(false);
    const nearEnd = buffed.starPowerUntil - 500;
    expect(isStarPowerExpiring(buffed, nearEnd, 1500)).toBe(true);
    expect(isStarPowerActive(buffed, buffed.starPowerUntil)).toBe(false);
  });
});
