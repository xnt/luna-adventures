import { LevelGenerator } from "../levelGenerator";
import { GAME_CONFIG } from "../constants";

describe("LevelGenerator", () => {
  it("produces deterministic chunks with the same seed", () => {
    const generatorA = new LevelGenerator({ seed: 42 });
    const generatorB = new LevelGenerator({ seed: 42 });

    const chunkA = generatorA.nextChunk();
    const chunkB = generatorB.nextChunk();

    expect(chunkA).toEqual(chunkB);
  });

  it("advances the cursor each chunk", () => {
    const generator = new LevelGenerator({ seed: 7 });
    const first = generator.nextChunk();
    const second = generator.nextChunk();

    expect(second.startX).toBe(first.endX);
    expect(second.endX).toBe(first.endX + GAME_CONFIG.chunkWidth * GAME_CONFIG.tileSize);
  });

  it("keeps the initial tiles safe from pits", () => {
    const generator = new LevelGenerator({ seed: 1 });
    const chunk = generator.nextChunk();
    const safeTiles = chunk.platforms.filter((platform) => platform.kind !== "pit" && platform.x < GAME_CONFIG.tileSize * 2);

    expect(safeTiles.length).toBeGreaterThan(0);
    const pitsInStart = chunk.platforms.filter((platform) => platform.kind === "pit" && platform.x < GAME_CONFIG.tileSize * 2);
    expect(pitsInStart.length).toBe(0);
  });

  it("spawns items and foes within chunk bounds", () => {
    const generator = new LevelGenerator({ seed: 11 });
    const chunk = generator.nextChunk();

    chunk.items.forEach((item) => {
      expect(item.x).toBeGreaterThanOrEqual(chunk.startX);
      expect(item.x).toBeLessThan(chunk.endX);
    });

    chunk.foes.forEach((foe) => {
      expect(foe.x).toBeGreaterThanOrEqual(chunk.startX);
      expect(foe.x).toBeLessThan(chunk.endX);
    });
  });

  it("calculates level length correctly", () => {
    const expectedLength = GAME_CONFIG.levelChunks * GAME_CONFIG.chunkWidth * GAME_CONFIG.tileSize;
    expect(GAME_CONFIG.levelLength).toBe(expectedLength);
    expect(GAME_CONFIG.levelLength).toBe(40 * 12 * 32); // 15,360 pixels
  });

  it("foes have valid platform bounds", () => {
    const generator = new LevelGenerator({ seed: 42 });
    const chunk = generator.nextChunk();

    chunk.foes.forEach((foe) => {
      // Foe should be within its platform bounds
      expect(foe.x).toBeGreaterThanOrEqual(foe.platformStartX);
      expect(foe.x).toBeLessThanOrEqual(foe.platformEndX);
      // Platform bounds should be reasonable
      expect(foe.platformEndX).toBeGreaterThan(foe.platformStartX);
    });
  });
});
