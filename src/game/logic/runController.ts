import { GAME_CONFIG } from "./constants";
import {
  applyImmunity,
  createHealth,
  damage,
  heal,
  isGameOver,
  type HealthState,
} from "./health";
import type { FoeSpawn, ItemSpawn } from "./types";

export interface SceneUiRefs {
  hpElement: HTMLDivElement;
  statusElement: HTMLDivElement;
}

export interface RunState {
  health: HealthState;
  isEnded: boolean;
  hasWon: boolean;
  statusText: string;
}

export interface FoeHitResult {
  damaged: boolean;
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

  constructor(options: RunControllerOptions) {
    this.ui = options.ui;
  }

  /** Reset all run state for a fresh start */
  start() {
    this.healthState = createHealth();
    this.isEnded = false;
    this.hasWon = false;
    this.statusText = "";
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

  /** Handle foe collision. Returns whether damage occurred and if game ended */
  onFoeHit(
    isStomp: boolean,
    kind: FoeSpawn["kind"],
    now: number
  ): FoeHitResult {
    if (isStomp && kind === "cat") {
      return { damaged: false, gameOver: false, message: "Luna booped a cat away!" };
    }

    const nextHealth = damage(this.healthState, 1, now);
    if (nextHealth !== this.healthState) {
      this.healthState = nextHealth;
      if (isGameOver(this.healthState)) {
        return this.endGame("Oh no! Luna needs a rest.");
      }
      return { damaged: true, gameOver: false, message: "Ouch! Luna lost a heart." };
    }

    if (isStomp && kind === "roomba") {
      return { damaged: false, gameOver: false, message: "Roombas are sturdy!" };
    }

    return { damaged: false, gameOver: false, message: "" };
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
    if (this.hasWon) {
      return { won: false };
    }
    const distance = Math.hypot(lunaX - ownerX, lunaY - ownerY);
    if (distance < 50) {
      this.hasWon = true;
      this.isEnded = true;
      this.setStatus("Luna found her human! 💖 You win!", true);
      return { won: true, message: "Luna found her human! 💖 You win!" };
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
    this.setStatus(message, true);
    return { damaged: true, gameOver: true, message };
  }
}
