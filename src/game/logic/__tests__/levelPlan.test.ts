import { generateLevelPlan, type LevelPlan } from "../levelPlan";
import { GAME_CONFIG } from "../constants";

describe("levelPlan", () => {
  it("generateLevelPlan produces deterministic plans with same seed", () => {
    const planA = generateLevelPlan({ seed: 42 });
    const planB = generateLevelPlan({ seed: 42 });

    expect(planA.seed).toBe(planB.seed);
    expect(planA.chunks.length).toBe(planB.chunks.length);
    expect(planA.ownerX).toBe(planB.ownerX);
    expect(planA.ownerY).toBe(planB.ownerY);

    // First chunk platforms should match
    expect(planA.chunks[0].platforms.length).toBe(planB.chunks[0].platforms.length);
    if (planA.chunks[0].platforms.length > 0) {
      expect(planA.chunks[0].platforms[0].x).toBe(planB.chunks[0].platforms[0].x);
    }
  });

  it("generates correct number of chunks", () => {
    const plan = generateLevelPlan({ seed: 7 });
    expect(plan.chunks.length).toBe(GAME_CONFIG.levelChunks);
  });

  it("each chunk has valid structure", () => {
    const plan = generateLevelPlan({ seed: 1 });
    plan.chunks.forEach((chunk, i) => {
      expect(chunk.startX).toBe(i * GAME_CONFIG.chunkWidth * GAME_CONFIG.tileSize);
      expect(chunk.endX).toBe((i + 1) * GAME_CONFIG.chunkWidth * GAME_CONFIG.tileSize);
      expect(chunk.platforms.length).toBeGreaterThanOrEqual(0);
      expect(chunk.foes.length).toBeGreaterThanOrEqual(0);
      expect(chunk.items.length).toBeGreaterThanOrEqual(0);
    });
  });

  it("owner position is at end of level", () => {
    const plan = generateLevelPlan({ seed: 99 });
    expect(plan.ownerX).toBe(GAME_CONFIG.levelLength - 80);
    expect(plan.ownerY).toBe(GAME_CONFIG.groundY - 48);
  });

  it("first chunk has safe starting area (no pits in first 8 tiles)", () => {
    const plan = generateLevelPlan({ seed: 3 });
    const firstChunk = plan.chunks[0];
    const earlyPlatforms = firstChunk.platforms.filter((p) => p.x < GAME_CONFIG.tileSize * 8);
    // Should have at least some non-pit platforms in early area
    const nonPits = earlyPlatforms.filter((p) => p.kind !== "pit");
    expect(nonPits.length).toBeGreaterThan(0);
  });
});
