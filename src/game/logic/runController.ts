import { GAME_CONFIG } from "./constants";
import {
  applyImmunity,
  createHealth,
  damage,
  heal,
  isGameOver,
  isStarPowerActive,
  type HealthState,
} from "./health";
import type { FoeSpawn, ItemSpawn } from "./types";
import type { Theme } from "../themes/types";
import { applyThemeUiVars } from "../themes/themeUi";

export interface SceneUiRefs {
  hpElement: HTMLDivElement;
  statusElement: HTMLDivElement;
  endScreen: HTMLDivElement;
  endScreenKicker: HTMLParagraphElement;
  endScreenTitle: HTMLHeadingElement;
  endScreenMessage: HTMLParagraphElement;
}

export interface RunState {
  health: HealthState;
  isEnded: boolean;
  hasWon: boolean;
  statusText: string;
}

export interface FoeHitResult {
  damaged: boolean;
  /** True when drumstick/star power defeats the foe on contact */
  defeated: boolean;
  gameOver: boolean;
  message: string;
}

export interface ItemPickupResult {
  message: string;
}

export interface PitFallResult {
  gameOver: true;
  message: string;
}

export interface WinCheckResult {
  won: boolean;
  message?: string;
}

export interface ProgressData {
  progress: number;
  startX: number;
  endX: number;
}

export interface RunControllerOptions {
  ui: SceneUiRefs;
}

export class RunController {
  private healthState: HealthState = createHealth();
  private isEnded = false;
  private hasWon = false;
  private statusText = "";
  private ui: SceneUiRefs;
  private theme: Theme | null = null;

  constructor(options: RunControllerOptions) {
    this.ui = options.ui;
  }

  /** Bind the run's theme so the end-screen modal matches the selected scene. */
  setTheme(theme: Theme) {
    this.theme = theme;
    applyThemeUiVars(this.ui.endScreen, theme);
  }

  /** Reset all run state for a fresh start */
  start() {
    this.healthState = createHealth();
    this.isEnded = false;
    this.hasWon = false;
    this.statusText = "";
    this.hideEndScreen();
    this.updateHud();
  }

  /** Can the player move? False after win/lose */
  canMove(): boolean {
    return !this.isEnded;
  }

  /** Current health state (for immunity tint checks) */
  getHealth(): HealthState {
    return this.healthState;
  }

  /** Get current run state snapshot */
  getState(): RunState {
    return {
      health: this.healthState,
      isEnded: this.isEnded,
      hasWon: this.hasWon,
      statusText: this.statusText,
    };
  }

  /** Handle foe collision. Returns whether damage occurred, foe defeated, and if game ended */
  onFoeHit(
    isStomp: boolean,
    kind: FoeSpawn["kind"],
    now: number
  ): FoeHitResult {
    // Drumstick / star power: any contact defeats the foe (Mario star style).
    // Brief post-hit i-frames alone do NOT count — only the drumstick buff.
    if (isStarPowerActive(this.healthState, now)) {
      const foeLabel = kind === "roomba" ? "roomba" : "cat";
      return {
        damaged: false,
        defeated: true,
        gameOver: false,
        message: `Star power! Luna blasted a ${foeLabel}!`,
      };
    }

    if (isStomp && kind === "cat") {
      return {
        damaged: false,
        defeated: true,
        gameOver: false,
        message: "Luna booped a cat away!",
      };
    }

    const nextHealth = damage(this.healthState, 1, now);
    if (nextHealth !== this.healthState) {
      this.healthState = nextHealth;
      if (isGameOver(this.healthState)) {
        return this.endGame("Oh no! Luna needs a rest.");
      }
      return {
        damaged: true,
        defeated: false,
        gameOver: false,
        message: "Ouch! Luna lost a heart.",
      };
    }

    if (isStomp && kind === "roomba") {
      return {
        damaged: false,
        defeated: false,
        gameOver: false,
        message: "Roombas are sturdy!",
      };
    }

    return { damaged: false, defeated: false, gameOver: false, message: "" };
  }

  /** Handle item pickup. Returns status message */
  onItemPickup(kind: ItemSpawn["kind"], now: number): ItemPickupResult {
    if (kind === "food") {
      this.healthState = heal(this.healthState, 1);
      return { message: "Yum! Puppy food +1 HP." };
    } else {
      this.healthState = applyImmunity(this.healthState, now);
      return { message: "Drumstick power! Luna is glowing." };
    }
  }

  /** Handle falling into a pit */
  onPitFall(): PitFallResult {
    this.healthState = { ...this.healthState, hp: 0 };
    return this.endGame("Luna fell into a pit!");
  }

  /** Check if Luna reached her human */
  checkWin(lunaX: number, lunaY: number, ownerX: number, ownerY: number): WinCheckResult {
    if (this.hasWon || this.isEnded) {
      return { won: false };
    }
    const distance = Math.hypot(lunaX - ownerX, lunaY - ownerY);
    if (distance < 50) {
      this.hasWon = true;
      this.isEnded = true;
      const message = "Luna found her human! 💖 You win!";
      this.setStatus(message, true);
      this.showEndScreen("win", message);
      return { won: true, message };
    }
    return { won: false };
  }

  /** Compute progress bar data from Luna and owner positions */
  getProgress(lunaX: number): ProgressData {
    const startX = 120;
    const endX = GAME_CONFIG.levelLength - 80;
    const progress = Math.min(1, Math.max(0, (lunaX - startX) / (endX - startX)));
    return { progress, startX, endX };
  }

  /** Set a transient or sticky status message */
  setStatus(message: string, sticky = false) {
    this.statusText = message;
    this.updateHud();
    // Note: timer clearing is handled by the scene via clearStatusTimer / scheduleStatusClear
  }

  /** Clear status text (called after timer) */
  clearStatus() {
    this.statusText = "";
    this.updateHud();
  }

  /** Update HUD elements from current state */
  updateHud() {
    const hearts = "❤".repeat(this.healthState.hp).padEnd(GAME_CONFIG.maxHp, "♡");
    this.ui.hpElement.textContent = `HP: ${hearts}`;
    this.ui.statusElement.textContent = this.statusText || "Run to your human!";
  }

  /** Force end game with message */
  private endGame(message: string): FoeHitResult & PitFallResult {
    this.isEnded = true;
    this.hasWon = false;
    this.setStatus(message, true);
    this.showEndScreen("lose", message);
    return { damaged: true, defeated: false, gameOver: true, message };
  }

  private showEndScreen(outcome: "win" | "lose", message: string) {
    const isWin = outcome === "win";
    if (this.theme) {
      applyThemeUiVars(this.ui.endScreen, this.theme);
    }
    this.ui.endScreen.classList.toggle("end-screen--win", isWin);
    this.ui.endScreen.classList.toggle("end-screen--lose", !isWin);
    const themeLabel = this.theme?.name ?? "Luna Adventures";
    this.ui.endScreenKicker.textContent = isWin
      ? `${themeLabel} · Success`
      : `${themeLabel} · Game over`;
    this.ui.endScreenTitle.textContent = isWin ? "You win!" : "Game over";
    this.ui.endScreenMessage.textContent = message;
    this.ui.endScreen.hidden = false;
    this.ui.endScreen.setAttribute("aria-hidden", "false");
  }

  private hideEndScreen() {
    this.ui.endScreen.hidden = true;
    this.ui.endScreen.setAttribute("aria-hidden", "true");
    this.ui.endScreen.classList.remove("end-screen--win", "end-screen--lose");
  }
}
