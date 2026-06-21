import { RunController, type SceneUiRefs } from "../runController";
import { GAME_CONFIG } from "../constants";

function makeMockUi(): SceneUiRefs {
  const hpElement = document.createElement("div");
  const statusElement = document.createElement("div");
  const endScreen = document.createElement("div");
  endScreen.hidden = true;
  const endScreenKicker = document.createElement("p");
  const endScreenTitle = document.createElement("h2");
  const endScreenMessage = document.createElement("p");
  return {
    hpElement,
    statusElement,
    endScreen,
    endScreenKicker,
    endScreenTitle,
    endScreenMessage,
  };
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
    expect(result.defeated).toBe(false);
    expect(result.gameOver).toBe(false);
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp - 1);
  });

  it("onFoeHit cat stomp does not damage", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.onFoeHit(true, "cat", 1000);
    expect(result.damaged).toBe(false);
    expect(result.defeated).toBe(true);
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp);
    expect(result.message).toContain("booped");
  });

  it("onFoeHit with drumstick immunity defeats any foe without damage", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    ctrl.onItemPickup("drumstick", 1000);

    const catHit = ctrl.onFoeHit(false, "cat", 1500);
    expect(catHit.damaged).toBe(false);
    expect(catHit.defeated).toBe(true);
    expect(catHit.message).toContain("Star power");
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp);

    const roombaHit = ctrl.onFoeHit(false, "roomba", 1600);
    expect(roombaHit.damaged).toBe(false);
    expect(roombaHit.defeated).toBe(true);
    expect(roombaHit.message).toContain("roomba");
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp);
  });

  it("onFoeHit roomba stomp without immunity damages but does not defeat", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.onFoeHit(true, "roomba", 1000);
    expect(result.defeated).toBe(false);
    expect(result.damaged).toBe(true);
    expect(ctrl.getHealth().hp).toBe(GAME_CONFIG.maxHp - 1);
  });

  it("onFoeHit roomba during post-hit i-frames shows sturdy message", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    ctrl.onFoeHit(false, "cat", 1000); // take damage, gain brief i-frames
    const result = ctrl.onFoeHit(true, "roomba", 1100); // still within 600ms i-frames
    expect(result.defeated).toBe(false);
    expect(result.damaged).toBe(false);
    expect(result.message).toContain("sturdy");
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
    expect(ui.endScreen.hidden).toBe(false);
    expect(ui.endScreenTitle.textContent).toBe("Game over");
    expect(ui.endScreenKicker.textContent).toContain("Game over");
    expect(ui.endScreenMessage.textContent).toContain("pit");
  });

  it("setTheme styles the end screen for the active scene", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    ctrl.setTheme({
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
      backgroundElements: [],
      groundStyle: "tech",
      generateBackground: () => undefined,
      generateGround: () => undefined,
      generateCat: () => undefined,
      generateRoomba: () => undefined,
      generateFood: () => undefined,
      generateDrumstick: () => undefined,
    });
    ctrl.onPitFall();
    expect(ui.endScreen.dataset.themeId).toBe("matrix");
    expect(ui.endScreenKicker.textContent).toContain("The Matrix");
    expect(ui.endScreen.style.getPropertyValue("--theme-accent")).toBeTruthy();
  });

  it("checkWin triggers win when close enough", () => {
    const ui = makeMockUi();
    const ctrl = new RunController({ ui });
    ctrl.start();
    const result = ctrl.checkWin(100, 100, 120, 120);
    expect(result.won).toBe(true);
    expect(ui.endScreen.hidden).toBe(false);
    expect(ui.endScreenTitle.textContent).toBe("You win!");
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
