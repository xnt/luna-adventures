import { RunController, type SceneUiRefs } from "../runController";
import { GAME_CONFIG } from "../constants";

function makeMockUi(): SceneUiRefs {
  const hpElement = document.createElement("div");
  const statusElement = document.createElement("div");
  return { hpElement, statusElement };
}

describe("RunController", () => {
  it("starts with full health and not ended", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const state = ctrl.getState();
    expect(state.health.hp).toBe(GAME_CONFIG.maxHp);
    expect(state.isEnded).toBe(false);
    expect(state.hasWon).toBe(false);
  });

  it("canMove is true initially", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    expect(ctrl.canMove()).toBe(true);
  });

  it("onFoeHit returns damage result when not immune", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.onFoeHit(false, "cat", 1000);
    expect(result.damaged).toBe(true);
    expect(result.gameOver).toBe(false);
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp - 1);
  });

  it("onFoeHit cat stomp does not damage", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.onFoeHit(true, "cat", 1000);
    expect(result.damaged).toBe(false);
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp);
    expect(result.message).toContain("booped");
  });

  it("onFoeHit triggers game over at 0 hp", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    // Deal maxHp damage
    for (let i = 0; i < GAME_CONFIG.maxHp; i++) {
      ctrl.onFoeHit(false, "cat", 1000 + i * 1000);
    }
    expect(ctrl.getState().isEnded).toBe(true);
    expect(ctrl.canMove()).toBe(false);
  });

  it("onItemPickup food heals", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    ctrl.onFoeHit(false, "cat", 1000); // take 1 damage
    const result = ctrl.onItemPickup("food", 2000);
    expect(result.message).toContain("Yum");
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp);
  });

  it("onItemPickup drumstick applies immunity", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.onItemPickup("drumstick", 1000);
    expect(result.message).toContain("glowing");
    expect(ctrl.getHealth().immuneUntil).toBe(1000 + GAME_CONFIG.buffDurationMs);
  });

  it("onPitFall ends game", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.onPitFall();
    expect(result.gameOver).toBe(true);
    expect(ctrl.getState().isEnded).toBe(true);
    expect(ctrl.getHealth().hp).toBe(0);
  });

  it("checkWin triggers win when close enough", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.checkWin(100, 100, 120, 120);
    expect(result.won).toBe(true);
    expect(ctrl.getState().hasWon).toBe(true);
    expect(ctrl.canMove()).toBe(false);
  });

  it("checkWin no-op if already won", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    ctrl.checkWin(100, 100, 120, 120);
    const result = ctrl.checkWin(100, 100, 120, 120);
    expect(result.won).toBe(false);
  });

  it("getProgress returns bounded progress", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const p0 = ctrl.getProgress(120);
    expect(p0.progress).toBeCloseTo(0);
    const p1 = ctrl.getProgress(GAME_CONFIG.levelLength - 80);
    expect(p1.progress).toBeCloseTo(1);
  });

  it("updateHud writes to provided elements", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    ctrl.setStatus("Hello");
    expect(ui.statusElement.textContent).toContain("Hello");
    expect(ui.hpElement.textContent).toContain("❤");
  });
});
