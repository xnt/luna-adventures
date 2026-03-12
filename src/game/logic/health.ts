import { GAME_CONFIG } from "./constants";

export interface HealthState {
  hp: number;
  immuneUntil: number;
}

export const createHealth = (): HealthState => ({
  hp: GAME_CONFIG.maxHp,
  immuneUntil: 0,
});

export const damage = (state: HealthState, amount: number, now: number): HealthState => {
  if (now < state.immuneUntil) {
    return state;
  }
  return {
    ...state,
    hp: Math.max(0, state.hp - amount),
    immuneUntil: now + 600,
  };
};

export const heal = (state: HealthState, amount: number): HealthState => ({
  ...state,
  hp: Math.min(GAME_CONFIG.maxHp, state.hp + amount),
});

export const applyImmunity = (state: HealthState, now: number): HealthState => ({
  ...state,
  hp: GAME_CONFIG.maxHp,
  immuneUntil: now + GAME_CONFIG.buffDurationMs,
});

export const isGameOver = (state: HealthState): boolean => state.hp <= 0;
